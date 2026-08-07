import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";
import { useAuth } from "@/lib/auth-context";

const TITLE = "Settings | CereBroiler";
const DESC = "System configuration and application preferences.";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: SettingsPage,
});

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ToggleSetting {
  key: string;
  label: string;
  description: string;
  icon: string;
  defaultValue: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const DASHBOARD_TOGGLES: ToggleSetting[] = [
  {
    key: "show_sparklines",
    label: "Sparkline Charts",
    description: "Show trend sparklines on metric cards",
    icon: "show_chart",
    defaultValue: true,
  },
  {
    key: "show_sensor_cluster",
    label: "Sensor Cluster",
    description: "Display sensor readings panel on dashboard",
    icon: "sensors",
    defaultValue: true,
  },
  {
    key: "show_alerts",
    label: "Active Alerts",
    description: "Show alert cards on the dashboard",
    icon: "notifications_active",
    defaultValue: true,
  },
];

const ANALYTICS_TOGGLES: ToggleSetting[] = [
  {
    key: "show_growth_curve",
    label: "Growth Curve",
    description: "Display growth curve chart on analytics page",
    icon: "insights",
    defaultValue: true,
  },
  {
    key: "show_volumetric",
    label: "Volumetric Data",
    description: "Show volumetric analysis section",
    icon: "science",
    defaultValue: true,
  },
];

const DISPLAY_TOGGLES: ToggleSetting[] = [
  {
    key: "compact_mode",
    label: "Compact Mode",
    description: "Reduce spacing and padding throughout the UI",
    icon: "compress",
    defaultValue: false,
  },
  {
    key: "show_descriptions",
    label: "Show Descriptions",
    description: "Display descriptive subtitles under section headers",
    icon: "description",
    defaultValue: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "cerebroiler_settings";

function loadSettings(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistSettings(settings: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    const storedTheme = localStorage.getItem("theme") ?? "light";
    setTheme(storedTheme === "dark" ? "dark" : "light");
  }, []);

  const getValue = useCallback(
    (key: string, defaultValue: boolean) =>
      key in settings ? settings[key] : defaultValue,
    [settings],
  );

  const handleToggle = (key: string) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persistSettings(next);
      return next;
    });
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      /* ignore */
    }
  };

  const handleReset = () => {
    setSettings({});
    persistSettings({});
    setTheme("light");
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("theme");
    } catch {
      /* ignore */
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon name="settings" size={28} className="text-primary" />
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
                Settings
              </h1>
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                Application preferences and configuration
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:border-error hover:text-error"
          >
            Reset All
          </button>
        </div>

        {/* Account info */}
        <section>
          <h2 className="mb-3 font-label-caps text-label-caps tracking-[0.15em] text-outline">
            ACCOUNT
          </h2>
          <div className="clinical-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon name="account_circle" size={28} className="text-primary" />
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">
                  {user?.email}
                </p>
                <p className="mt-0.5 font-data-md text-[11px] text-on-surface-variant">
                  {user?.roles?.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h2 className="mb-3 font-label-caps text-label-caps tracking-[0.15em] text-outline">
            APPEARANCE
          </h2>
          <div className="clinical-card divide-y divide-outline-variant/30 p-0">
            {/* Theme */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Icon name="palette" size={20} className="text-primary" />
                <div>
                  <p className="font-body-md text-body-md text-on-surface">Theme</p>
                  <p className="mt-0.5 font-body-sm text-[11px] text-on-surface-variant">
                    Choose between light and dark mode
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`rounded-lg border px-4 py-2 font-label-caps text-[11px] capitalize transition-all ${
                      theme === t
                        ? "border-primary bg-primary/10 font-bold text-primary"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Icon name="language" size={20} className="text-primary" />
                <div>
                  <p className="font-body-md text-body-md text-on-surface">Language</p>
                  <p className="mt-0.5 font-body-sm text-[11px] text-on-surface-variant">
                    Display language for the interface
                  </p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body-md text-body-md text-on-surface focus:border-primary focus:outline-none"
              >
                <option>English</option>
                <option>日本語</option>
                <option>한국어</option>
                <option>中文</option>
              </select>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section>
          <h2 className="mb-3 font-label-caps text-label-caps tracking-[0.15em] text-outline">
            DASHBOARD
          </h2>
          <div className="clinical-card divide-y divide-outline-variant/30 p-0">
            {DASHBOARD_TOGGLES.map((item) => (
              <SettingToggle
                key={item.key}
                item={item}
                value={getValue(item.key, item.defaultValue)}
                onToggle={() => handleToggle(item.key)}
              />
            ))}
          </div>
        </section>

        {/* Analytics */}
        <section>
          <h2 className="mb-3 font-label-caps text-label-caps tracking-[0.15em] text-outline">
            ANALYTICS
          </h2>
          <div className="clinical-card divide-y divide-outline-variant/30 p-0">
            {ANALYTICS_TOGGLES.map((item) => (
              <SettingToggle
                key={item.key}
                item={item}
                value={getValue(item.key, item.defaultValue)}
                onToggle={() => handleToggle(item.key)}
              />
            ))}
          </div>
        </section>

        {/* Display */}
        <section>
          <h2 className="mb-3 font-label-caps text-label-caps tracking-[0.15em] text-outline">
            DISPLAY
          </h2>
          <div className="clinical-card divide-y divide-outline-variant/30 p-0">
            {DISPLAY_TOGGLES.map((item) => (
              <SettingToggle
                key={item.key}
                item={item}
                value={getValue(item.key, item.defaultValue)}
                onToggle={() => handleToggle(item.key)}
              />
            ))}
          </div>
        </section>

        {/* System info */}
        <section>
          <h2 className="mb-3 font-label-caps text-label-caps tracking-[0.15em] text-outline">
            SYSTEM
          </h2>
          <div className="clinical-card p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoItem label="Platform" value="CereBroiler" />
              <InfoItem label="Version" value="2.4.0" />
              <InfoItem label="API Status" value="Connected" tone="success" />
              <InfoItem label="Database" value="PostgreSQL" />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function SettingToggle({
  item,
  value,
  onToggle,
}: {
  item: ToggleSetting;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-3">
        <Icon
          name={item.icon}
          size={20}
          className={value ? "text-primary" : "text-on-surface-variant"}
        />
        <div>
          <p className="font-body-md text-body-md text-on-surface">{item.label}</p>
          <p className="mt-0.5 font-body-sm text-[11px] text-on-surface-variant">
            {item.description}
          </p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? "bg-primary" : "bg-surface-container-high"
        }`}
        role="switch"
        aria-checked={value}
        aria-label={item.label}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-on-primary shadow-sm transition-transform ${
            value ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function InfoItem({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "error";
}) {
  const toneClass = {
    default: "text-on-surface",
    success: "text-accent-teal",
    warning: "text-accent-amber",
    error: "text-error",
  }[tone];

  return (
    <div>
      <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <p className={`mt-1 font-data-md text-data-md ${toneClass}`}>{value}</p>
    </div>
  );
}
