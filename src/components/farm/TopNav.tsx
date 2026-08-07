import { Link, useNavigate } from "@tanstack/react-router";
import { farm, unacknowledgedAlerts } from "@/lib/farm/dataset";
import { useAuth } from "@/lib/auth-context";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "DASHBOARD" },
  { to: "/telemetry", label: "ANALYTICS" },
  { to: "/visuals", label: "VISUAL_TELEMETRY" },
  { to: "/intelligence", label: "INTELLIGENCE" },
] as const;

export function TopNav() {
  const pendingAlerts = unacknowledgedAlerts();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-background px-gutter">
      <div className="flex items-center gap-8">
        <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
          {farm.facility.name}
        </span>
        <nav className="hidden h-16 gap-stack-md md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="my-3 flex items-center rounded-lg px-4 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              activeProps={{
                className:
                  "my-3 flex items-center rounded-lg px-4 font-label-caps text-label-caps text-primary bg-surface-container-high panel-gradient",
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
            className="w-64 rounded-lg border border-outline-variant bg-surface-container-lowest py-1.5 pl-10 pr-4 font-data-md text-data-md text-on-surface transition-all focus:border-primary focus:outline-none"
            placeholder="QUERY_SYSTEM..."
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Link
            to="/notifications"
            className="relative rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
          >
            <Icon name="notifications" />
            {pendingAlerts > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 font-data-md text-[9px] leading-none text-on-error">
                {pendingAlerts}
              </span>
            )}
          </Link>
          <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface">
            <Icon name="apps" />
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface">
                  <Icon name="account_circle" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.roles?.join(", ")}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Icon name="logout" size={16} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
            >
              <Icon name="account_circle" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}