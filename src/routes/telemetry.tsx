import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";

const TITLE = "Growth & Weight Analytics | POULTRY_AI";
const DESC =
  "Estimated average weight versus breed standard, flock weight distribution and volumetric mass analysis.";

export const Route = createFileRoute("/telemetry")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: TelemetryPage,
});

const cohorts = [
  ["SEC_A_FLOCK_01", "2,104", "2,855", "112", "2,480", "NOMINAL"],
  ["SEC_B_FLOCK_01", "1,980", "2,740", "145", "2,390", "DEVIATION"],
  ["SEC_C_FLOCK_01", "2,150", "2,910", "98", "2,510", "NOMINAL"],
  ["SEC_D_FLOCK_01", "2,050", "2,690", "130", "2,425", "NOMINAL"],
];

function TelemetryPage() {
  return (
    <AppShell>
      <div className="mb-stack-lg flex flex-col justify-between border-b border-outline-variant pb-stack-md md:flex-row md:items-end">
        <div>
          <nav className="mb-2 flex items-center gap-2">
            <span className="font-label-caps text-[10px] text-on-surface-variant">ANALYTICS</span>
            <Icon name="chevron_right" size={12} className="text-outline" />
            <span className="font-label-caps text-[10px] text-primary">GROWTH_WEIGHT</span>
          </nav>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            Growth &amp; Weight Analytics
          </h1>
        </div>
        <div className="mt-4 flex gap-4 md:mt-0">
          <div className="flex items-center gap-2 border border-outline-variant px-3 py-1.5">
            <Icon name="calendar_today" size={18} className="text-on-surface-variant" />
            <span className="font-data-md text-data-md">2023-08-01 - 2023-08-07</span>
          </div>
          <button className="bg-primary px-4 py-1.5 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-on-primary-container">
            EXPORT_DATA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-stack-md">
        <div className="relative col-span-12 h-[450px] overflow-hidden border border-outline-variant bg-surface-container-lowest p-stack-md lg:col-span-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="mb-1 font-label-caps text-label-caps uppercase text-outline">
                Estimated Average Weight vs Breed Standard
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border border-accent-cyan" />
                  <span className="font-data-md text-data-md text-accent-cyan">
                    Actual Avg: 2,452g
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border border-outline-variant bg-outline-variant opacity-30" />
                  <span className="font-data-md text-data-md text-on-surface-variant">
                    Standard: 2,422g
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="border border-outline-variant px-2 py-1 font-label-caps text-[10px] text-on-surface-variant">
                REAL_TIME
              </button>
              <button className="border border-primary bg-surface-container-high px-2 py-1 font-label-caps text-[10px] text-primary">
                HISTORICAL
              </button>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-gutter bottom-gutter top-24 grid-bg opacity-20" />
          <div className="relative mt-4 h-[300px] w-full">
            <svg
              className="h-full w-full text-accent-cyan"
              preserveAspectRatio="none"
              viewBox="0 0 1000 300"
            >
              <path
                d="M0 250 Q 250 240, 500 150 T 1000 50"
                className="stroke-outline"
                fill="none"
                strokeDasharray="4 2"
                strokeWidth="1.5"
              />
              <path
                d="M0 260 Q 250 250, 500 140 T 1000 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M0 260 Q 250 250, 500 140 T 1000 40 L 1000 300 L 0 300 Z"
                fill="url(#growthGrad)"
                opacity="0.2"
              />
              <defs>
                <linearGradient id="growthGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <circle cx="500" cy="140" fill="currentColor" r="4" />
              <circle cx="1000" cy="40" fill="currentColor" r="4" />
            </svg>
            <div className="absolute bottom-0 left-0 flex w-full translate-y-full justify-between pt-2 font-data-md text-[10px] text-outline">
              <span>DAY 01</span>
              <span>DAY 07</span>
              <span>DAY 14</span>
              <span>DAY 21</span>
              <span>DAY 28</span>
              <span>DAY 35</span>
              <span>DAY 42</span>
            </div>
          </div>
          <div className="absolute right-24 top-40 flex flex-col gap-1 border border-outline-variant bg-surface-container-high p-2 shadow-2xl">
            <div className="font-label-caps text-[10px] text-outline">CURRENT_STATE</div>
            <div className="font-data-md text-data-md text-primary">+1.2% VARIANCE</div>
            <div className="my-1 h-px w-full bg-outline-variant" />
            <div className="font-data-md text-[11px] text-on-surface-variant">CONF: 98.4%</div>
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-stack-md lg:col-span-4">
          <div className="flex flex-1 flex-col justify-between border border-outline-variant bg-surface-container-lowest p-stack-md">
            <div>
              <h2 className="mb-4 font-label-caps text-label-caps uppercase text-outline">
                System Performance
              </h2>
              <div className="space-y-6">
                {[
                  ["GROWTH VARIANCE", "+1.2%", "72%", "TRENDING_OPTIMAL", "bg-accent-cyan"],
                  ["ESTIMATION CONFIDENCE", "94%", "94%", "SENSOR_STABLE", "bg-accent-amber"],
                ].map(([label, value, width, note, barClass]) => (
                  <div key={label}>
                    <div className="mb-1 flex items-end justify-between">
                      <span className="font-label-caps text-[10px] text-on-surface-variant">
                        {label}
                      </span>
                      <span className="font-data-lg text-data-lg text-primary">{value}</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-high">
                      <div className={`h-full ${barClass}`} style={{ width }} />
                    </div>
                    <div className="mt-1 text-right font-data-md text-[10px] text-outline">
                      {note}
                    </div>
                  </div>
                ))}
                <div className="border-t border-outline-variant pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                      Projected Yield Date
                    </span>
                    <span className="bg-surface-container-high px-2 py-1 font-data-md text-data-md text-primary">
                      AUG 12, 2023
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="flex-1 border border-outline-variant p-2">
                <div className="mb-1 font-label-caps text-[9px] text-outline">FCR_ESTIMATE</div>
                <div className="font-data-md text-data-md">1.48</div>
              </div>
              <div className="flex-1 border border-outline-variant p-2">
                <div className="mb-1 font-label-caps text-[9px] text-outline">ADG_ESTIMATE</div>
                <div className="font-data-md text-data-md">68g/d</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex flex-col overflow-hidden border border-outline-variant bg-surface-container-lowest lg:col-span-7">
          <div className="flex items-center justify-between border-b border-outline-variant p-gutter">
            <h2 className="font-label-caps text-label-caps uppercase text-primary">
              Flock Weight Distribution
            </h2>
            <span className="font-data-md text-[10px] text-outline">SAMPLES: 4,820 SENSORS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  {["Cohort_ID", "Min (g)", "Max (g)", "SD (±)", "Median (g)", "Status"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-gutter py-3 font-label-caps text-[10px] uppercase text-outline ${
                          i === 0 ? "text-left" : "text-right"
                        }`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="font-data-md text-[13px]">
                {cohorts.map(([id, min, max, sd, median, status]) => (
                  <tr
                    key={id}
                    className="border-b border-outline-variant transition-colors hover:bg-surface-container-high"
                  >
                    <td className="px-gutter py-3 text-on-surface">{id}</td>
                    <td className="px-gutter py-3 text-right text-on-surface-variant">{min}</td>
                    <td className="px-gutter py-3 text-right text-on-surface-variant">{max}</td>
                    <td className="px-gutter py-3 text-right text-on-surface-variant">{sd}</td>
                    <td className="px-gutter py-3 text-right text-primary">{median}</td>
                    <td className="px-gutter py-3 text-right">
                      <span
                        className={`mr-2 inline-block h-2 w-2 rounded-full ${
                          status === "NOMINAL" ? "bg-accent-teal" : "bg-accent-amber"
                        }`}
                      />
                      <span
                        className={`font-label-caps text-[10px] ${
                          status === "NOMINAL" ? "text-accent-teal" : "text-accent-amber"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 flex flex-col border border-outline-variant bg-surface-container-lowest p-stack-md lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-label-caps text-label-caps uppercase text-primary">
              Kinect Volumetric Analysis
            </h2>
            <span className="font-data-md text-[10px] text-outline">REF: SN_82910_A</span>
          </div>
          <div className="relative flex aspect-video items-center justify-center overflow-hidden border border-outline-variant bg-background grid-bg">
            <div className="relative flex h-64 w-48 flex-col items-center justify-center rounded-full border-2 border-accent-cyan/20 backdrop-blur-[2px]">
              <div className="relative h-full w-full">
                <div className="absolute -right-12 -top-4 flex flex-col border-l border-accent-cyan pl-2">
                  <span className="font-label-caps text-[9px] text-outline">BREAST_WIDTH</span>
                  <span className="font-data-md text-[11px]">114.2mm</span>
                </div>
                <div className="absolute -left-16 top-1/2 flex flex-col border-r border-accent-cyan pr-2 text-right">
                  <span className="font-label-caps text-[9px] text-outline">TOTAL_LENGTH</span>
                  <span className="font-data-md text-[11px]">342.5mm</span>
                </div>
                <div className="absolute -bottom-4 right-1/4 flex flex-col border-t border-accent-cyan pt-2">
                  <span className="font-label-caps text-[9px] text-outline">DEPTH_Z</span>
                  <span className="font-data-md text-[11px]">182.1mm</span>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-data-lg text-data-lg text-primary">2,510g</span>
                  <span className="font-label-caps text-[9px] text-outline">CALCULATED_MASS</span>
                </div>
              </div>
            </div>
            <div className="absolute left-4 top-4 flex gap-2">
              <div className="h-2 w-2 animate-pulse bg-accent-cyan" />
              <span className="font-label-caps text-[10px] text-accent-cyan">
                LIDAR_SCANNING...
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="font-label-caps uppercase text-outline">Morphological Index</span>
              <span className="font-data-md text-on-surface">1.42 (Optimal)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="font-label-caps uppercase text-outline">Density Ratio</span>
              <span className="font-data-md text-on-surface">0.985 g/cm³</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="font-label-caps uppercase text-outline">Estimated Precision</span>
              <span className="font-data-md text-accent-teal">± 1.5%</span>
            </div>
          </div>
          <button className="mt-4 w-full border border-outline-variant py-2 font-label-caps text-[11px] uppercase transition-colors hover:bg-surface-container-high">
            View Latest High-Res Sample
          </button>
        </div>
      </div>
      <div className="h-12" />
    </AppShell>
  );
}