export function StatusFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex h-8 items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-gutter md:left-64">
      <div className="flex items-center gap-4">
        <span className="font-label-caps text-[10px] text-on-surface-variant">
          SYSTEM_STATUS: <span className="text-emerald-500">NOMINAL</span>
        </span>
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      </div>
      <div className="flex gap-6">
        <span className="font-data-md text-[10px] text-on-surface-variant">API_v1.2</span>
        <span className="font-data-md text-[10px] text-on-surface-variant">LATENCY_24ms</span>
        <span className="font-data-md text-[10px] text-on-surface-variant">ML_MODEL_v4</span>
      </div>
    </footer>
  );
}