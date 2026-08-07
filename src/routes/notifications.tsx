import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";
import {
  type ApiNotification,
  fetchNotifications,
  markNotificationRead,
} from "@/lib/api-client";
import {
  STATUS_TONE,
  formatDateTimeUtc,
  formatTime,
} from "@/lib/farm/format";
import type { StatusLevel } from "@/lib/farm/types";

const TITLE = "Notifications | POULTRY_AI";
const DESC = "User notification feed — accessible via the bell icon in the top navigation.";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: NotificationsPage,
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

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function NotificationsPage() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const handleMarkRead = async (id: string) => {
    setMarkingRead((prev) => ({ ...prev, [id]: true }));
    try {
      const result = await markNotificationRead(id);
      if (result.updated) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
          ),
        );
      }
    } catch {
      /* keep unread */
    } finally {
      setMarkingRead((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Icon name="notifications" size={28} className="text-primary" />
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
                NOTIFICATIONS
              </h1>
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                {isLoading
                  ? "Loading..."
                  : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""} · ${unreadCount} unread`}
              </p>
            </div>
          </div>
          <button
            onClick={load}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
          >
            <Icon name="refresh" size={16} />
            REFRESH
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-error/30 bg-error/5 p-4">
            <Icon name="error" size={20} className="text-error" />
            <span className="font-body-md text-body-md text-error">{error}</span>
          </div>
        )}

        {/* Feed */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <NotificationFeed
            notifications={notifications}
            markingRead={markingRead}
            onMarkRead={handleMarkRead}
          />
        )}
      </div>
    </AppShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notification feed                                                         */
/* -------------------------------------------------------------------------- */

function NotificationFeed({
  notifications,
  markingRead,
  onMarkRead,
}: {
  notifications: ApiNotification[];
  markingRead: Record<string, boolean>;
  onMarkRead: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return (
      <div className="clinical-card flex flex-col items-center justify-center py-20">
        <Icon name="notifications_none" size={48} className="text-accent-teal" />
        <p className="mt-4 font-headline-sm text-headline-sm text-on-surface">
          NO_NOTIFICATIONS
        </p>
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          You have no notifications at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notifications.map((notif) => {
        const sev = notif.severity as StatusLevel;
        const tone = STATUS_TONE[sev] ?? STATUS_TONE.nominal;
        const isUnread = !notif.readAt;
        const isMarking = markingRead[notif.id] ?? false;
        const channelIcon = CHANNEL_ICONS[notif.channel] ?? "notifications";

        return (
          <div
            key={notif.id}
            className={`clinical-card flex items-start gap-4 p-4 transition-all ${
              isUnread
                ? "border-l-4 " + tone.border
                : "opacity-70"
            }`}
          >
            {/* Channel icon */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                isUnread ? tone.chip : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              <Icon name={channelIcon} size={20} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className={`font-label-caps text-label-caps ${
                    isUnread ? "text-on-surface font-bold" : "text-on-surface-variant"
                  }`}
                >
                  {notif.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-label-caps text-[9px] ${tone.chip}`}
                >
                  {sev.toUpperCase()}
                </span>
                {notif.channel !== "in_app" && (
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-caps text-[9px] text-on-surface-variant">
                    {CHANNEL_LABELS[notif.channel] ?? notif.channel}
                  </span>
                )}
              </div>
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant line-clamp-2">
                {notif.body}
              </p>
              <span className="mt-2 block font-data-md text-[10px] text-on-surface-variant">
                {formatDateTimeUtc(notif.createdAt)}
              </span>
            </div>

            {/* Action */}
            {isUnread && (
              <button
                onClick={() => onMarkRead(notif.id)}
                disabled={isMarking}
                className="shrink-0 rounded-md border border-outline-variant px-3 py-1.5 font-label-caps text-[10px] text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
              >
                MARK_READ
              </button>
            )}
            {!isUnread && notif.readAt && (
              <span className="shrink-0 font-data-md text-[10px] text-on-surface-variant">
                <Icon name="done" size={12} className="mr-1 align-middle" />
                {formatTime(notif.readAt)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
