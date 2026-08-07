import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";
import {
  type NotificationPreference,
  fetchNotificationPreferences,
  saveNotificationPreferences,
} from "@/lib/api-client";
import { STATUS_TONE } from "@/lib/farm/format";
import type { StatusLevel } from "@/lib/farm/types";
import { useAuth } from "@/lib/auth-context";

const TITLE = "Settings | POULTRY_AI";
const DESC = "System configuration — notification delivery preferences and channel settings.";

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
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const CHANNEL_ICONS: Record<string, string> = {
  in_app: "notifications_active",
  email: "email",
  push: "smartphone",
  sms: "chat",
};

const CHANNEL_LABELS: Record<string, string> = {
  in_app: "IN_APP",
  email: "EMAIL",
  push: "PUSH",
  sms: "SMS",
};

const SEVERITIES: StatusLevel[] = ["optimal", "nominal", "deviation", "warning", "critical"];

const CHANNELS = ["in_app", "email", "push", "sms"];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function SettingsPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prefs = await fetchNotificationPreferences();
      setPreferences(prefs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleTogglePref = (channel: string) => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.channel === channel ? { ...p, enabled: !p.enabled } : p,
      ),
    );
    setPrefsSaved(false);
  };

  const handleSeverityChange = (channel: string, severity: string) => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.channel === channel ? { ...p, minSeverity: severity } : p,
      ),
    );
    setPrefsSaved(false);
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      await saveNotificationPreferences(preferences);
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    } catch {
      setError("Failed to save preferences");
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Icon name="settings" size={28} className="text-primary" />
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              SETTINGS
            </h1>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              System configuration and delivery preferences
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-error/30 bg-error/5 p-4">
            <Icon name="error" size={20} className="text-error" />
            <span className="font-body-md text-body-md text-error">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Account info */}
            <section>
              <h2 className="mb-4 font-label-caps text-label-caps tracking-[0.15em] text-outline">
                ACCOUNT
              </h2>
              <div className="clinical-card p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon name="account_circle" size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body-md text-body-md text-on-surface">
                      {user?.email}
                    </p>
                    <p className="mt-0.5 font-data-md text-[10px] text-on-surface-variant">
                      {user?.roles?.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Notification preferences */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-label-caps text-label-caps tracking-[0.15em] text-outline">
                  NOTIFICATION_CHANNELS
                </h2>
                <span className="font-data-md text-[10px] text-on-surface-variant">
                  Configure how and when alerts reach you
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {CHANNELS.map((channel) => {
                  const pref = preferences.find((p) => p.channel === channel);
                  const enabled = pref?.enabled ?? false;
                  const minSev = pref?.minSeverity ?? "deviation";
                  const icon = CHANNEL_ICONS[channel] ?? "notifications";

                  return (
                    <div key={channel} className="clinical-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon
                            name={icon}
                            size={20}
                            className={enabled ? "text-primary" : "text-on-surface-variant"}
                          />
                          <span className="font-label-caps text-label-caps text-on-surface">
                            {CHANNEL_LABELS[channel] ?? channel}
                          </span>
                        </div>
                        {/* Toggle */}
                        <button
                          onClick={() => handleTogglePref(channel)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            enabled ? "bg-primary" : "bg-surface-container-high"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-on-primary transition-transform ${
                              enabled ? "translate-x-5" : ""
                            }`}
                          />
                        </button>
                      </div>
                      {enabled && (
                        <div className="mt-4 flex items-center gap-3">
                          <span className="font-label-caps text-[10px] text-outline">
                            MIN_SEVERITY:
                          </span>
                          <div className="flex gap-1">
                            {SEVERITIES.map((s) => {
                              const tone = STATUS_TONE[s];
                              return (
                                <button
                                  key={s}
                                  onClick={() => handleSeverityChange(channel, s)}
                                  className={`rounded-md px-2.5 py-0.5 font-label-caps text-[9px] transition-all ${
                                    minSev === s
                                      ? `${tone.chip} font-bold`
                                      : "text-on-surface-variant hover:bg-surface-container-high"
                                  }`}
                                >
                                  {s.toUpperCase()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Save */}
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={handleSavePrefs}
                  disabled={savingPrefs}
                  className="flex items-center gap-2 rounded-lg accent-gradient px-6 py-2.5 font-label-caps text-label-caps font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Icon name="save" size={16} />
                  {savingPrefs ? "SAVING..." : "SAVE_PREFERENCES"}
                </button>
                {prefsSaved && (
                  <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-accent-teal">
                    <Icon name="check_circle" size={16} />
                    PREFERENCES_SAVED
                  </span>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}
