import { Link } from "@tanstack/react-router";
import { farm, unacknowledgedAlerts } from "@/lib/farm/dataset";
import { Icon } from "./Icon";

const groups = [
  {
    label: "COMMAND_CENTER",
    items: [
      { to: "/", icon: "dashboard", label: "Command" },
      { to: "/telemetry", icon: "analytics", label: "Telemetry" },
      { to: "/visuals", icon: "videocam", label: "Visuals" },
      { to: "/intelligence", icon: "psychology", label: "Intelligence" },
    ],
  },
] as const;

export function SideNav({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const itemClass = `mx-3 flex items-center gap-4 rounded-lg px-3 py-3 transition-all ${
    collapsed ? "justify-center" : ""
  }`;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-full flex-col border-r border-outline-variant bg-surface-container-lowest pt-16 transition-[width] duration-200 md:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-outline-variant py-6 ${
          collapsed ? "justify-center px-2" : "justify-between px-6"
        }`}
      >
        {!collapsed && (
          <div>
            <div className="font-headline-sm text-headline-sm font-bold text-primary">
              FARM_OS
            </div>
            <div className="mt-1 font-label-caps text-label-caps text-on-surface-variant">
              V{farm.platform.appVersion}-{farm.platform.releaseChannel}
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <Icon name={collapsed ? "chevron_right" : "chevron_left"} size={18} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {groups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="mb-2 px-6 font-label-caps text-[10px] tracking-[0.2em] text-outline">
                {group.label}
              </div>
            )}
            {group.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                title={collapsed ? item.label : undefined}
                className={`${itemClass} text-on-surface-variant hover:bg-surface-container-high`}
                activeProps={{
                  className: `${itemClass} nav-active`,
                }}
              >
                <Icon name={item.icon} size={20} />
                {!collapsed && (
                  <span className="font-label-caps text-label-caps">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
        {!collapsed && (
          <div className="mt-6 mb-2 px-6 font-label-caps text-[10px] tracking-[0.2em] text-outline">
            SYSTEM_MONITOR
          </div>
        )}
        {collapsed && <div className="mx-4 mt-6 mb-2 h-px bg-outline-variant" />}
        <span
          title={collapsed ? "Alerts" : undefined}
          className={`${itemClass} cursor-default text-on-surface-variant hover:bg-surface-container-high`}
        >
          <Icon name="notification_important" size={20} />
          {!collapsed && (
            <span className="flex flex-1 items-center justify-between font-label-caps text-label-caps">
              Alerts
              <span className="font-data-md text-[10px] text-on-surface-variant">
                {unacknowledgedAlerts()}
              </span>
            </span>
          )}
        </span>
        <span
          title={collapsed ? "Settings" : undefined}
          className={`${itemClass} cursor-default text-on-surface-variant hover:bg-surface-container-high`}
        >
          <Icon name="settings" size={20} />
          {!collapsed && <span className="font-label-caps text-label-caps">Settings</span>}
        </span>
      </nav>
      {!collapsed && (
        <div className="p-6">
          <div className="clinical-card p-4">
            <div className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
              SYSTEM_RESOURCE
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-container">
              <div
                className="h-full rounded-full accent-gradient"
                style={{ width: `${farm.platform.cpuPercent}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between">
              <span className="font-data-md text-[10px] text-on-surface-variant">
                CPU: {farm.platform.cpuPercent}%
              </span>
              <span className="font-data-md text-[10px] text-on-surface-variant">
                RAM: {farm.platform.ramGb}GB
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
