import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Icon } from "@/components/farm/Icon";

const TITLE = "Sign In | POULTRY_AI";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: "Authenticate to FARM_OS operations console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already authenticated — redirect to dashboard via effect (not during render).
  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/" });
    } catch (err) {
      const code = err instanceof Error ? err.message : "login_failed";
      const messages: Record<string, string> = {
        invalid_credentials: "Invalid email or password.",
        email_taken: "That email is already registered.",
        user_disabled: "This account has been disabled.",
        login_failed: "Could not reach the authentication service.",
      };
      setError(messages[code] ?? `Authentication failed (${code}).`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 data-grid-bg">
      {/* Accent gradient bar across the top of the viewport. */}
      <div className="absolute inset-x-0 top-0 h-1 accent-gradient" />

      <div className="w-full max-w-sm">
        {/* Brand block */}
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Icon name="precision_manufacturing" size={28} className="text-accent-cyan" />
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface">
              POULTRY_AI
            </span>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            FARM_OS OPERATIONS CONSOLE
          </span>
        </div>

        {/* Sign-in card */}
        <div className="clinical-card p-8">
          <div className="mb-6">
            <h1 className="font-headline-sm text-headline-sm text-on-surface">
              Sign In
            </h1>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Enter your credentials to access the operations dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-error/30 bg-error-container/40 p-3">
                <Icon name="error" size={18} className="mt-px shrink-0 text-error" />
                <span className="font-body-md text-body-md text-on-error-container">
                  {error}
                </span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="font-label-caps text-label-caps text-on-surface-variant"
              >
                EMAIL
              </label>
              <div className="relative">
                <Icon
                  name="mail"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@facility.com"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface transition-colors focus:border-accent-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="font-label-caps text-label-caps text-on-surface-variant"
              >
                PASSWORD
              </label>
              <div className="relative">
                <Icon
                  name="lock"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-11 font-body-md text-body-md text-on-surface transition-colors focus:border-accent-cyan focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-on-surface-variant transition-colors hover:text-on-surface"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon
                    name={showPassword ? "visibility_off" : "visibility"}
                    size={18}
                  />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-label-caps text-label-caps text-white accent-gradient transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Icon name="login" size={16} />
                  SIGN_IN
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center font-label-caps text-label-caps text-on-surface-variant">
          Need access? Contact your facility administrator.
        </p>
      </div>
    </div>
  );
}
