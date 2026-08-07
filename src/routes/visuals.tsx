import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";
import { liveCamera } from "@/lib/farm/dataset";
import {
  STATUS_TONE,
  barWidth,
  formatCompact,
  formatKilograms,
  formatMeasurement,
  formatNumber,
  formatPercent,
  formatScore,
  formatSignedPercent,
  statusLabel,
  timelinePosition,
  timelineTicks,
} from "@/lib/farm/format";
import { getVisualTelemetry } from "@/lib/farm/repository";

const TITLE = "Visual Telemetry | POULTRY_AI Live Feeds";
const DESC =
  "Live 4K house feed with behavior monitoring, 3D-camera weight estimation, spatial distribution and a 24h anomaly timeline.";

// `head()` runs before loader data exists, so the social preview reads the
// dataset directly — the same still the feed renders below.
const FEED_IMAGE = liveCamera().stillUrl;

export const Route = createFileRoute("/visuals")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: FEED_IMAGE },
      { name: "twitter:image", content: FEED_IMAGE },
    ],
  }),
  loader: () => getVisualTelemetry(),
  component: VisualsPage,
});

type FeedMode = "behavior" | "weight";

/** Overlay stroke colours, matched to the accent palette used by the HUD. */
const OVERLAY_NEUTRAL = "#f3f4f6";
const OVERLAY_DEPTH = "#22d3ee";
const OVERLAY_WARN = "#f59e0b";

function VisualsPage() {
  const {
    camera,
    hud,
    detections,
    clusterWarning,
    behavior,
    weight,
    cycleDay,
    cycleTotalDays,
    timeline,
  } = Route.useLoaderData();
  const [mode, setMode] = useState<FeedMode>("behavior");
  const [gridOverlay, setGridOverlay] = useState(false);

  const movementTone = STATUS_TONE[behavior.movementStatus];
  const huddlingTone = STATUS_TONE[behavior.huddlingStatus];
  const pointDensity = formatCompact(camera.depthPointsPerFrame).toUpperCase();

  return (
    <AppShell bare>
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
            <h1 className="font-data-md text-data-md text-on-surface">LIVE_FEED: {camera.id}</h1>
          </div>
          <div className="h-4 w-px bg-outline-variant" />
          <span className="font-data-md text-data-md text-on-surface-variant">
            {camera.houseLabel.toUpperCase()}
          </span>
          <span className="font-data-md text-data-md text-on-surface-variant">
            FPS: {camera.fps.toFixed(1)}
          </span>
          <span className="font-data-md text-data-md text-on-surface-variant">
            RES: {camera.resolution}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGridOverlay((on) => !on)}
            className={
              gridOverlay
                ? "rounded-lg border border-primary bg-surface-container-high panel-gradient px-3 py-1 font-label-caps text-label-caps text-primary"
                : "rounded-lg border border-outline-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high"
            }
          >
            GRID_OVERLAY
          </button>
          <button
            onClick={() => setMode("behavior")}
            className={
              mode === "behavior"
                ? "rounded-lg border border-primary bg-surface-container-high panel-gradient px-3 py-1 font-label-caps text-label-caps text-primary"
                : "rounded-lg border border-outline-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high"
            }
          >
            BEHAVIOR
          </button>
          <button
            onClick={() => setMode("weight")}
            className={
              mode === "weight"
                ? "rounded-lg border border-primary bg-surface-container-high panel-gradient px-3 py-1 font-label-caps text-label-caps text-primary"
                : "rounded-lg border border-outline-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high"
            }
          >
            WEIGHT
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1 overflow-hidden bg-[#070708]">
          <img
            src={camera.stillUrl}
            alt="High-angle CCTV view of a modern poultry house interior under clinical lighting"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 hud-scanline" />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 600"
          >
            {mode === "behavior" ? (
              <>
                {detections.map((detection) => {
                  const stroke = detection.flag ? OVERLAY_WARN : OVERLAY_NEUTRAL;
                  return (
                    <g key={detection.id}>
                      <rect
                        fill="none"
                        height={detection.box.height}
                        stroke={stroke}
                        strokeDasharray={detection.behavior === "FEEDING" ? "2 2" : undefined}
                        strokeWidth="1"
                        width={detection.box.width}
                        x={detection.box.x}
                        y={detection.box.y}
                      />
                      <text
                        fill={stroke}
                        fontFamily="JetBrains Mono"
                        fontSize="8"
                        x={detection.box.x}
                        y={detection.box.y - 5}
                      >
                        ID: {detection.id} [{detection.behavior}]
                      </text>
                    </g>
                  );
                })}
                <rect
                  fill="none"
                  height={clusterWarning.box.height}
                  stroke={OVERLAY_WARN}
                  strokeWidth="1"
                  width={clusterWarning.box.width}
                  x={clusterWarning.box.x}
                  y={clusterWarning.box.y}
                />
                <text
                  fill={OVERLAY_WARN}
                  fontFamily="JetBrains Mono"
                  fontSize="10"
                  x={clusterWarning.box.x}
                  y={clusterWarning.box.y - 5}
                >
                  WARN: {clusterWarning.label} [{formatScore(clusterWarning.risk)} RISK]
                </text>
              </>
            ) : (
              <>
                <text fill={OVERLAY_DEPTH} fontFamily="JetBrains Mono" fontSize="9" x="20" y="580">
                  DEPTH_MAP: STEREO_3D | {pointDensity} PTS/FRAME
                </text>
                {detections.map((detection) => {
                  const stroke = detection.flag ? OVERLAY_WARN : OVERLAY_DEPTH;
                  return (
                    <g key={detection.id}>
                      <rect
                        fill="none"
                        height={detection.box.height}
                        stroke={stroke}
                        strokeWidth="1"
                        width={detection.box.width}
                        x={detection.box.x}
                        y={detection.box.y}
                      />
                      <text
                        fill={stroke}
                        fontFamily="JetBrains Mono"
                        fontSize={detection.flag ? "9" : "8"}
                        x={detection.box.x}
                        y={detection.box.y - 5}
                      >
                        ID: {detection.id} | EST: {formatKilograms(detection.estimatedWeightG)} [
                        {detection.flag ?? formatPercent(detection.weightConfidence * 100)}]
                      </text>
                    </g>
                  );
                })}
              </>
            )}
            {gridOverlay && (
              <>
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={`gv-${i}`}
                    stroke={OVERLAY_DEPTH}
                    strokeOpacity="0.3"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    x1={(i + 1) * 100}
                    x2={(i + 1) * 100}
                    y1="0"
                    y2="600"
                  />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={`gh-${i}`}
                    stroke={OVERLAY_DEPTH}
                    strokeOpacity="0.3"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    x1="0"
                    x2="1000"
                    y1={(i + 1) * 100}
                    y2={(i + 1) * 100}
                  />
                ))}
                <line stroke={OVERLAY_DEPTH} strokeOpacity="0.6" strokeWidth="1" vectorEffect="non-scaling-stroke" x1="0" x2="1000" y1="300" y2="300" />
                <line stroke={OVERLAY_DEPTH} strokeOpacity="0.6" strokeWidth="1" vectorEffect="non-scaling-stroke" x1="500" x2="500" y1="0" y2="600" />
                <text fill={OVERLAY_DEPTH} fontFamily="JetBrains Mono" fontSize="9" x="860" y="20">
                  CAL_GRID: 10x6 | LOCKED
                </text>
              </>
            )}
            <line stroke="#232426" strokeWidth="0.5" x1="0" x2="1000" y1="300" y2="300" />
            <line stroke="#232426" strokeWidth="0.5" x1="500" x2="500" y1="0" y2="600" />
          </svg>

          <div className="absolute left-6 top-6 rounded-xl border border-outline-variant bg-surface-container-lowest/80 panel-gradient p-4 backdrop-blur-sm">
            <p className="mb-1 font-label-caps text-[10px] text-on-surface-variant">
              OPTICAL_SENSORS
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-data-md text-[10px] text-outline-variant">
                  {hud.temperature.label}
                </p>
                <p className="font-data-lg text-data-lg text-primary">
                  {formatMeasurement(hud.temperature.value, hud.temperature.unit)}
                </p>
              </div>
              <div className="h-8 w-px bg-outline-variant" />
              <div>
                <p className="font-data-md text-[10px] text-outline-variant">{hud.humidity.label}</p>
                <p className="font-data-lg text-data-lg text-primary">
                  {formatMeasurement(hud.humidity.value, hud.humidity.unit)}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
            <div className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest/80 panel-gradient p-2 backdrop-blur-sm">
              <span className="font-data-md text-[11px] text-on-surface">
                LOC_X: {camera.location.x.toFixed(3)}
              </span>
              <span className="font-data-md text-[11px] text-on-surface">
                LOC_Y: {camera.location.y.toFixed(3)}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest/80 transition-colors hover:bg-primary hover:text-background">
                <Icon name="videocam" size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest/80 transition-colors hover:bg-primary hover:text-background">
                <Icon name="screenshot_region" size={20} />
              </button>
            </div>
          </div>
        </div>

        <aside className="hidden w-80 flex-col overflow-y-auto border-l border-outline-variant bg-surface-container-lowest lg:flex">
          <div className="border-b border-outline-variant p-4">
            <h3 className="flex items-center gap-2 font-label-caps text-label-caps text-primary">
              <Icon name={mode === "behavior" ? "psychology" : "view_in_ar"} size={16} />
              {mode === "behavior" ? "BEHAVIORAL_INSIGHTS" : "WEIGHT_ESTIMATION"}
            </h3>
          </div>
          {mode === "behavior" ? (
            <div className="space-y-4 p-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    MOVEMENT_INDEX
                  </p>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${movementTone.chip}`}
                  >
                    {statusLabel(behavior.movementStatus)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">
                    {formatScore(behavior.movementIndex)}
                  </p>
                  <p className="font-data-md text-data-md text-on-surface-variant">
                    {behavior.movementLabel}
                  </p>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-outline-variant">
                  <div
                    className="h-full rounded-full accent-gradient"
                    style={{ width: barWidth(behavior.movementIndex, 1) }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    HUDDLING_RISK
                  </p>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${huddlingTone.chip}`}
                  >
                    {statusLabel(behavior.huddlingStatus)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">
                    {formatPercent(behavior.huddlingRisk * 100, 0)}
                  </p>
                  <p className="font-data-md text-data-md text-on-surface-variant">
                    {behavior.huddlingLabel}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-outline-variant bg-surface-container panel-gradient p-3">
                <p className="mb-2 font-label-caps text-[10px] text-outline-variant">
                  AGGRESSION_LOG
                </p>
                <div className="flex items-center gap-3">
                  <Icon name="shield" className="text-on-surface-variant" />
                  <span className="font-data-md text-data-md text-on-surface">
                    {behavior.aggressionEvents} EVENTS DETECTED
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    AVG_EST_WEIGHT
                  </p>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                      STATUS_TONE[weight.status].chip
                    }`}
                  >
                    {formatSignedPercent(weight.variancePercent)} VS STD
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">
                    {formatNumber(weight.actualAvgG)}g
                  </p>
                  <p className="font-data-md text-data-md text-on-surface-variant">
                    DAY {cycleDay}
                  </p>
                </div>
                {/* Bar tracks how far the grow-out has progressed. */}
                <div className="h-1 w-full overflow-hidden rounded-full bg-outline-variant">
                  <div
                    className="h-full rounded-full accent-gradient"
                    style={{ width: barWidth(cycleDay, cycleTotalDays) }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    EST_CONFIDENCE
                  </p>
                  <span className="rounded-md bg-on-surface-variant/10 px-1.5 py-0.5 text-[9px] font-bold text-on-surface-variant">
                    SENSOR_STABLE
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">
                    {formatPercent(weight.estimationConfidencePercent, 0)}
                  </p>
                  <p className="font-data-md text-data-md text-on-surface-variant">
                    {formatNumber(camera.birdsScanned)} BIRDS SCANNED
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-outline-variant bg-surface-container panel-gradient p-3">
                <p className="mb-2 font-label-caps text-[10px] text-outline-variant">
                  3D_DEPTH_CAMERA
                </p>
                <div className="flex items-center gap-3">
                  <Icon name="view_in_ar" className="text-accent-cyan" />
                  <div>
                    <span className="block font-data-md text-data-md text-on-surface">
                      STEREO_DEPTH: {camera.online ? "ONLINE" : "OFFLINE"}
                    </span>
                    <span className="block font-data-md text-[10px] text-on-surface-variant">
                      POINT_DENSITY: {pointDensity}/FRAME
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-auto border-t border-outline-variant p-4">
            <p className="mb-3 font-label-caps text-[10px] text-on-surface-variant">
              SPATIAL_DISTRIBUTION
            </p>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low panel-gradient">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border border-outline-variant" />
                ))}
              </div>
              <div className="h-16 w-16 rounded-full bg-accent-cyan/20 blur-xl" />
              <div className="h-12 w-12 translate-x-12 translate-y-8 rounded-full bg-accent-cyan/10 blur-lg" />
              <p className="relative z-10 font-data-md text-[9px] text-outline-variant">
                {camera.planViewLabel}
              </p>
            </div>
          </div>
          <div className="border-t border-outline-variant p-4">
            <button className="w-full rounded-lg border border-primary py-3 font-label-caps text-label-caps text-primary transition-all hover:bg-primary hover:text-background">
              EXPORT_METRICS_REPORT
            </button>
          </div>
        </aside>
      </div>

      <div className="flex h-32 flex-col gap-3 border-t border-outline-variant bg-surface-container-lowest px-6 py-4">
        <div className="flex items-center justify-between">
          <h4 className="font-label-caps text-label-caps text-on-surface-variant">
            ANOMALY_TIMELINE: 24H_HISTORY
          </h4>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-error" /> CRITICAL
            </span>
            <span className="flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-accent-amber" /> WARNING
            </span>
          </div>
        </div>
        <div className="relative flex-1 cursor-pointer overflow-hidden rounded-lg border border-outline-variant bg-surface-container panel-gradient">
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 py-1">
            {timelineTicks(timeline.windowStart, timeline.windowEnd).map((tick) => (
              <span key={tick} className="font-data-md text-[9px] text-outline-variant">
                {tick}
              </span>
            ))}
          </div>
          <div
            className="absolute bottom-0 top-0 z-10 w-px bg-accent-cyan"
            style={{
              left: timelinePosition(timeline.cursorAt, timeline.windowStart, timeline.windowEnd),
            }}
          >
            <div className="absolute top-0 h-2 w-2 -translate-x-1/2 rotate-45 bg-accent-cyan" />
          </div>
          {timeline.events.map((event) => (
            <div
              key={event.id}
              title={`${event.label} — ${statusLabel(event.severity)}`}
              className={`absolute top-1/4 h-1/2 w-1 transition-transform hover:scale-y-150 ${
                event.severity === "critical"
                  ? "border border-error bg-error-container"
                  : "border border-accent-amber bg-accent-amber/30"
              }`}
              style={{
                left: timelinePosition(event.at, timeline.windowStart, timeline.windowEnd),
              }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
