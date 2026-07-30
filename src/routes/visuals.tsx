import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";

const TITLE = "Visual Telemetry | POULTRY_AI Live Feeds";
const DESC =
  "Live 4K house feed with behavior monitoring, 3D-camera weight estimation, spatial distribution and a 24h anomaly timeline.";

const FEED_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCopPRa-XNdwo1f1TabwijSaLDroEN5UcUNFyqBxoDaoD7HlhDF31VnUxCcaHYvsmfoOnod-eYWNzRS9gu_YwwofE4fWx_b3U4UkQDptdvhXYFtSDbppGIPUqg1jrCNZGVz9bnAfI6WcOtg63ag0XjICfOZ_fXhdu-VU9Yi1FZfcxcRYHJkq4JLRJbPY1V2FkvDFg5tqr3PWKSKROY8pmCx9Xcd2tujDrN8qDnhKp7okRgiqYRgg5o_";

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
  component: VisualsPage,
});

type FeedMode = "behavior" | "weight";

function VisualsPage() {
  const [mode, setMode] = useState<FeedMode>("behavior");

  return (
    <AppShell bare>
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
            <h1 className="font-data-md text-data-md text-on-surface">
              LIVE_FEED: UNIT_04_NORTH
            </h1>
          </div>
          <div className="h-4 w-px bg-outline-variant" />
          <span className="font-data-md text-data-md text-on-surface-variant">FPS: 60.2</span>
          <span className="font-data-md text-data-md text-on-surface-variant">RES: 4K_UHD</span>
        </div>
        <div className="flex gap-2">
          <button className="border border-outline-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high">
            GRID_OVERLAY
          </button>
          <button
            onClick={() => setMode("behavior")}
            className={
              mode === "behavior"
                ? "border border-primary bg-surface-container-high px-3 py-1 font-label-caps text-label-caps text-primary"
                : "border border-outline-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high"
            }
          >
            BEHAVIOR
          </button>
          <button
            onClick={() => setMode("weight")}
            className={
              mode === "weight"
                ? "border border-primary bg-surface-container-high px-3 py-1 font-label-caps text-label-caps text-primary"
                : "border border-outline-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high"
            }
          >
            WEIGHT
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1 overflow-hidden bg-[#070708]">
          <img
            src={FEED_IMAGE}
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
                <rect
                  fill="none"
                  height="40"
                  stroke="#f3f4f6"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                  width="40"
                  x="250"
                  y="320"
                />
                <text fill="#f3f4f6" fontFamily="JetBrains Mono" fontSize="8" x="250" y="315">
                  ID: 4522 [FEEDING]
                </text>
                <rect
                  fill="none"
                  height="35"
                  stroke="#f3f4f6"
                  strokeWidth="1"
                  width="35"
                  x="580"
                  y="150"
                />
                <text fill="#f3f4f6" fontFamily="JetBrains Mono" fontSize="8" x="580" y="145">
                  ID: 8901 [PREENING]
                </text>
                <rect
                  fill="none"
                  height="80"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  width="120"
                  x="700"
                  y="400"
                />
                <text fill="#f59e0b" fontFamily="JetBrains Mono" fontSize="10" x="700" y="395">
                  WARN: HUDDLING_CLUSTER [0.02 RISK]
                </text>
              </>
            ) : (
              <>
                <text fill="#22d3ee" fontFamily="JetBrains Mono" fontSize="9" x="20" y="580">
                  DEPTH_MAP: STEREO_3D | 42K PTS/FRAME
                </text>
                <rect
                  fill="none"
                  height="40"
                  stroke="#22d3ee"
                  strokeWidth="1"
                  width="40"
                  x="250"
                  y="320"
                />
                <text fill="#22d3ee" fontFamily="JetBrains Mono" fontSize="8" x="250" y="315">
                  ID: 4522 | EST: 2.41kg [97.8%]
                </text>
                <rect
                  fill="none"
                  height="35"
                  stroke="#22d3ee"
                  strokeWidth="1"
                  width="35"
                  x="580"
                  y="150"
                />
                <text fill="#22d3ee" fontFamily="JetBrains Mono" fontSize="8" x="580" y="145">
                  ID: 8901 | EST: 2.53kg [96.4%]
                </text>
                <rect
                  fill="none"
                  height="45"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  width="45"
                  x="740"
                  y="420"
                />
                <text fill="#f59e0b" fontFamily="JetBrains Mono" fontSize="9" x="740" y="415">
                  ID: 7215 | EST: 1.98kg [LOW_WEIGHT]
                </text>
              </>
            )}
            <line stroke="#232426" strokeWidth="0.5" x1="0" x2="1000" y1="300" y2="300" />
            <line stroke="#232426" strokeWidth="0.5" x1="500" x2="500" y1="0" y2="600" />
          </svg>

          <div className="absolute left-6 top-6 border border-outline-variant bg-surface-container-lowest/80 p-4 backdrop-blur-sm">
            <p className="mb-1 font-label-caps text-[10px] text-on-surface-variant">
              OPTICAL_SENSORS
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-data-md text-[10px] text-outline-variant">TEMP</p>
                <p className="font-data-lg text-data-lg text-primary">24.2°C</p>
              </div>
              <div className="h-8 w-px bg-outline-variant" />
              <div>
                <p className="font-data-md text-[10px] text-outline-variant">HUMID</p>
                <p className="font-data-lg text-data-lg text-primary">58%</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
            <div className="flex items-center gap-4 border border-outline-variant bg-surface-container-lowest/80 p-2 backdrop-blur-sm">
              <span className="font-data-md text-[11px] text-on-surface">LOC_X: 45.021</span>
              <span className="font-data-md text-[11px] text-on-surface">LOC_Y: 12.884</span>
            </div>
            <div className="flex gap-2">
              <button className="flex h-10 w-10 items-center justify-center border border-outline-variant bg-surface-container-lowest/80 transition-colors hover:bg-primary hover:text-background">
                <Icon name="videocam" size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center border border-outline-variant bg-surface-container-lowest/80 transition-colors hover:bg-primary hover:text-background">
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
                  <span className="rounded bg-accent-teal/10 px-1.5 py-0.5 text-[9px] font-bold text-accent-teal">
                    STABLE
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">0.84</p>
                  <p className="font-data-md text-data-md text-on-surface-variant">HIGH</p>
                </div>
                <div className="h-1 w-full bg-outline-variant">
                  <div className="h-full bg-accent-cyan" style={{ width: "84%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    HUDDLING_RISK
                  </p>
                  <span className="rounded bg-on-surface-variant/10 px-1.5 py-0.5 text-[9px] font-bold text-on-surface-variant">
                    NOMINAL
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">2%</p>
                  <p className="font-data-md text-data-md text-on-surface-variant">MINIMAL</p>
                </div>
              </div>
              <div className="rounded border border-outline-variant bg-surface-container p-3">
                <p className="mb-2 font-label-caps text-[10px] text-outline-variant">
                  AGGRESSION_LOG
                </p>
                <div className="flex items-center gap-3">
                  <Icon name="shield" className="text-on-surface-variant" />
                  <span className="font-data-md text-data-md text-on-surface">
                    0 EVENTS DETECTED
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
                  <span className="rounded bg-accent-teal/10 px-1.5 py-0.5 text-[9px] font-bold text-accent-teal">
                    +1.2% VS STD
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">2,452g</p>
                  <p className="font-data-md text-data-md text-on-surface-variant">DAY 42</p>
                </div>
                <div className="h-1 w-full bg-outline-variant">
                  <div className="h-full bg-accent-cyan" style={{ width: "72%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    EST_CONFIDENCE
                  </p>
                  <span className="rounded bg-on-surface-variant/10 px-1.5 py-0.5 text-[9px] font-bold text-on-surface-variant">
                    SENSOR_STABLE
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-data-lg text-data-lg text-primary">96.8%</p>
                  <p className="font-data-md text-data-md text-on-surface-variant">
                    1,284 BIRDS SCANNED
                  </p>
                </div>
              </div>
              <div className="rounded border border-outline-variant bg-surface-container p-3">
                <p className="mb-2 font-label-caps text-[10px] text-outline-variant">
                  3D_DEPTH_CAMERA
                </p>
                <div className="flex items-center gap-3">
                  <Icon name="view_in_ar" className="text-accent-cyan" />
                  <div>
                    <span className="block font-data-md text-data-md text-on-surface">
                      STEREO_DEPTH: ONLINE
                    </span>
                    <span className="block font-data-md text-[10px] text-on-surface-variant">
                      POINT_DENSITY: 42K/FRAME
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
            <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-outline-variant bg-surface-container-low">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border border-outline-variant" />
                ))}
              </div>
              <div className="h-16 w-16 rounded-full bg-accent-cyan/20 blur-xl" />
              <div className="h-12 w-12 translate-x-12 translate-y-8 rounded-full bg-accent-cyan/10 blur-lg" />
              <p className="relative z-10 font-data-md text-[9px] text-outline-variant">
                UNIT_04_PLAN_VIEW
              </p>
            </div>
          </div>
          <div className="border-t border-outline-variant p-4">
            <button className="w-full border border-primary py-3 font-label-caps text-label-caps text-primary transition-all hover:bg-primary hover:text-background">
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
        <div className="relative flex-1 cursor-pointer border border-outline-variant bg-surface-container">
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 py-1">
            {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "NOW"].map((t) => (
              <span key={t} className="font-data-md text-[9px] text-outline-variant">
                {t}
              </span>
            ))}
          </div>
          <div
            className="absolute bottom-0 top-0 z-10 w-px bg-accent-cyan"
            style={{ left: "88%" }}
          >
            <div className="absolute top-0 h-2 w-2 -translate-x-1/2 rotate-45 bg-accent-cyan" />
          </div>
          {[
            ["12%", true],
            ["45%", false],
            ["62%", true],
            ["82%", false],
          ].map(([left, critical]) => (
            <div
              key={left as string}
              className={`absolute top-1/4 h-1/2 w-1 transition-transform hover:scale-y-150 ${
                critical
                  ? "border border-error bg-error-container"
                  : "border border-accent-amber bg-accent-amber/30"
              }`}
              style={{ left: left as string }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}