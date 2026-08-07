import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * The API base URL is read from the Vite env variable `VITE_API_URL`.
 * Falls back to `http://localhost:4000` which matches the default
 * `packages/api` configuration.
 */
const API_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:4000";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from stored token on first mount.
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("farm_access_token");
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser({
              id: data.user.id,
              email: data.user.email,
              fullName: data.user.full_name ?? data.user.fullName ?? null,
              roles: data.roles,
              permissions: data.permissions,
            });
          } else {
            localStorage.removeItem("farm_access_token");
            localStorage.removeItem("farm_refresh_token");
          }
        } catch {
          // Network down — keep null, the login page will surface the error.
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        (body as Record<string, string>).error ?? "login_failed",
      );
    }
    const data = await res.json();
    localStorage.setItem("farm_access_token", data.accessToken);
    localStorage.setItem("farm_refresh_token", data.refreshToken);
    setUser({
      id: data.user.id,
      email: data.user.email,
      roles: data.user.roles,
      permissions: data.user.permissions,
    });
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("farm_access_token");
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        /* swallow — clean up locally regardless */
      }
    }
    localStorage.removeItem("farm_access_token");
    localStorage.removeItem("farm_refresh_token");
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const refreshToken = localStorage.getItem("farm_refresh_token");
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        localStorage.removeItem("farm_access_token");
        localStorage.removeItem("farm_refresh_token");
        setUser(null);
        return false;
      }
      const data = await res.json();
      localStorage.setItem("farm_access_token", data.accessToken);
      localStorage.setItem("farm_refresh_token", data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, isLoading, isAuthenticated: user !== null, login, logout, refresh }),
    [user, isLoading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
