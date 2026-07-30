import { Link } from "@tanstack/react-router";
import { Icon } from "./Icon";

const links = [
  { to: "/", label: "DASHBOARD" },
  { to: "/telemetry", label: "ANALYTICS" },
  { to: "/visuals", label: "VISUAL_TELEMETRY" },
  { to: "/intelligence", label: "INTELLIGENCE" },
] as const;

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-background px-gutter">
      <div className="flex items-center gap-8">
        <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
          POULTRY_AI
        </span>
        <nav className="hidden h-16 gap-stack-md md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="flex items-center px-4 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              activeProps={{
                className:
                  "flex items-center px-4 font-label-caps text-label-caps text-primary border-b-2 border-primary",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden items-center lg:flex">
          <Icon
            name="search"
            size={18}
            className="absolute left-3 text-on-surface-variant"
          />
          <input
            className="w-64 border border-outline-variant bg-surface-container-lowest py-1.5 pl-10 pr-4 font-data-md text-data-md text-on-surface transition-all focus:border-primary focus:outline-none"
            placeholder="QUERY_SYSTEM..."
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest">
            <Icon name="notifications" />
          </button>
          <button className="p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest">
            <Icon name="apps" />
          </button>
          <button className="p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest">
            <Icon name="account_circle" />
          </button>
        </div>
      </div>
    </header>
  );
}