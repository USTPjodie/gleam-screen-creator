import { farm } from "@/lib/farm/dataset";
import { STATUS_TONE, statusLabel } from "@/lib/farm/format";

export function StatusFooter({ collapsed }: { collapsed: boolean }) {
  const { platform } = farm;
  const tone = STATUS_TONE[platform.status];

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-50 flex h-8 items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-gutter transition-[left] duration-200 ${
        collapsed ? "md:left-16" : "md:left-64"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="font-label-caps text-[10px] text-on-surface-variant">
          SYSTEM_STATUS: <span className={tone.text}>{statusLabel(platform.status)}</span>
        </span>
        <div className={`h-1.5 w-1.5 animate-pulse rounded-full ${tone.dot}`} />
      </div>
      <div className="flex gap-6">
        <span className="font-data-md text-[10px] text-on-surface-variant">
          API_{platform.apiVersion}
        </span>
        <span className="font-data-md text-[10px] text-on-surface-variant">
          LATENCY_{platform.inferenceLatencyMs}ms
        </span>
        <span className="font-data-md text-[10px] text-on-surface-variant">
          ML_MODEL_{platform.mlModel}
        </span>
      </div>
    </footer>
  );
}