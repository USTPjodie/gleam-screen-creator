import type { ReactNode } from "react";
import { SideNav } from "./SideNav";
import { StatusFooter } from "./StatusFooter";
import { TopNav } from "./TopNav";

export function AppShell({
  children,
  bare = false,
}: {
  children: ReactNode;
  bare?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopNav />
      <SideNav />
      <main
        className={
          bare
            ? "relative flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-background md:ml-64"
            : "px-gutter pb-16 pt-4 data-grid-bg md:ml-64"
        }
      >
        {children}
      </main>
      <StatusFooter />
    </div>
  );
}