import { Link } from "@tanstack/react-router";
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

export function SideNav() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface-container-lowest pt-16 md:flex">
      <div className="border-b border-outline-variant px-6 py-6">
        <div className="font-headline-sm text-headline-sm font-bold text-primary">FARM_OS</div>
        <div className="mt-1 font-label-caps text-label-caps text-on-surface-variant">
          V2.4.0-STABLE
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="mb-2 px-6 font-label-caps text-[10px] tracking-[0.2em] text-outline">
              {group.label}
            </div>
            {group.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="flex items-center gap-4 px-6 py-3 text-on-surface-variant transition-all hover:bg-surface-container-high"
                activeProps={{
                  className:
                    "flex items-center gap-4 px-6 py-3 nav-active transition-all",
                }}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-label-caps text-label-caps">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
        <div className="mt-6 mb-2 px-6 font-label-caps text-[10px] tracking-[0.2em] text-outline">
          SYSTEM_MONITOR
        </div>
        <span className="flex cursor-default items-center gap-4 px-6 py-3 text-on-surface-variant transition-all hover:bg-surface-container-high">
          <Icon name="notification_important" size={20} />
          <span className="font-label-caps text-label-caps">Alerts</span>
        </span>
        <span className="flex cursor-default items-center gap-4 px-6 py-3 text-on-surface-variant transition-all hover:bg-surface-container-high">
          <Icon name="settings" size={20} />
          <span className="font-label-caps text-label-caps">Settings</span>
        </span>
      </nav>
      <div className="p-6">
        <div className="clinical-card rounded p-4">
          <div className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
            SYSTEM_RESOURCE
          </div>
          <div className="h-1 overflow-hidden rounded bg-surface-container">
            <div className="h-full w-[34%] bg-accent-cyan" />
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-data-md text-[10px] text-on-surface-variant">CPU: 34%</span>
            <span className="font-data-md text-[10px] text-on-surface-variant">RAM: 2.1GB</span>
          </div>
        </div>
      </div>
    </aside>
  );
}