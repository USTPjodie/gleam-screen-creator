import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";

const TITLE = "Command Center | POULTRY_AI Executive Operations";
const DESC =
  "Executive operations console: LLM flock summary, real-time activity index, alerts and sensor cluster status.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

const metrics = [
  {
    label: "AVG_WEIGHT (G)",
    delta: "+1.2%",
    deltaClass: "text-emerald-400",
    value: "1,482.5",
    sub: "STD_DEV: 12g",
    path: "M0,30 L30,28 L60,32 L90,25 L120,20 L150,22 L180,15 L210,10 L240,12 L270,8 L300,5",
  },
  {
    label: "WATER_INTAKE (L/H)",
    delta: "NOMINAL",
    deltaClass: "text-primary",
    value: "2,140.0",
    sub: "EST_24H: 52k",
    path: "M0,20 L30,22 L60,20 L90,21 L120,20 L150,19 L180,21 L210,20 L240,22 L270,20 L300,21",
  },
  {
    label: "FEED_CONVERSION (FCR)",
    delta: "-0.02",
    deltaClass: "text-emerald-400",
    value: "1.34",
    sub: "TARGET: 1.36",
    path: "M0,10 L30,12 L60,11 L90,14 L120,13 L150,16 L180,18 L210,22 L240,24 L270,22 L300,25",
  },
];

const sensors = [
  ["TEMP_ZONE_A", "24.2°C"],
  ["HUMID_ZONE_A", "62.1%"],
  ["CO2_LEVEL", "840 PPM"],
  ["AMMONIA_NH3", "4.2 PPM"],
  ["LIGHT_LUX", "45.0 LX"],
  ["AIRFLOW_VEL", "1.8 M/S"],
];

function Index() {
  return (
    <AppShell>
      <section className="mb-stack-lg">
        <div className="clinical-card relative overflow-hidden border-l-4 border-l-primary p-6">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Icon name="neurology" size={64} filled />
          </div>
          <div className="mb-2 flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            EXECUTIVE_SUMMARY_ENGINE (LLM_v4.2)
          </div>
          <h1 className="max-w-4xl font-headline-sm text-headline-sm leading-relaxed text-on-surface">
            Flock status is <span className="font-bold text-primary">Optimal</span>. No behavioral
            anomalies detected in last 12 hours. Weight gain is{" "}
            <span className="text-primary">+2%</span> above breed target. Environmental parameters
            in{" "}
            <span className="underline decoration-outline-variant underline-offset-4">
              House 01-04
            </span>{" "}
            are strictly within biological bounds.
          </h1>
          <div className="mt-4 flex gap-6">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                CONFIDENCE_SCORE
              </span>
              <span className="font-data-md text-data-md text-primary">0.992</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                LAST_SCAN
              </span>
              <span className="font-data-md text-data-md text-primary">14:02:11 UTC</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-stack-lg grid grid-cols-12 gap-gutter">
        <div className="clinical-card col-span-12 p-6 lg:col-span-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-label-caps text-label-caps text-on-surface-variant">
                REAL_TIME_ACTIVITY_INDEX
              </h2>
              <div className="mt-1 font-headline-md text-headline-md text-primary">
                482.4 <span className="text-sm font-normal text-on-surface-variant">IDX</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-3 bg-primary" />
                <span className="font-label-caps text-[10px] text-on-surface-variant">ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-3 border-t border-dashed bg-outline-variant" />
                <span className="font-label-caps text-[10px] text-on-surface-variant">
                  BASELINE
                </span>
              </div>
            </div>
          </div>
          <div className="relative h-[320px] w-full">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-20">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-full border-t border-outline-variant" />
              ))}
            </div>
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 320">
              <path
                d="M0,160 Q100,150 200,170 T400,165 T600,155 T800,160"
                fill="none"
                stroke="#444749"
                strokeDasharray="4,2"
                strokeWidth="1.5"
              />
              <path
                d="M0,180 L50,170 L100,190 L150,160 L200,150 L250,155 L300,140 L350,145 L400,130 L450,135 L500,120 L550,125 L600,110 L650,115 L700,105 L750,110 L800,100"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <path
                d="M0,180 L50,170 L100,190 L150,160 L200,150 L250,155 L300,140 L350,145 L400,130 L450,135 L500,120 L550,125 L600,110 L650,115 L700,105 L750,110 L800,100 L800,320 L0,320 Z"
                fill="url(#chartGrad)"
              />
              <defs>
                <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="mt-4 flex justify-between font-data-md text-[11px] text-on-surface-variant">
            <span>T-24H</span>
            <span>T-18H</span>
            <span>T-12H</span>
            <span>T-06H</span>
            <span>CURRENT</span>
          </div>
        </div>

        <div className="clinical-card col-span-12 flex flex-col lg:col-span-4">
          <div className="flex items-center justify-between border-b border-outline-variant p-6">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant">
              SYSTEM_ALERTS
            </h2>
            <Icon name="filter_list" size={16} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="alert-critical border-b border-l-2 border-outline-variant/30 p-4">
              <div className="flex items-start justify-between">
                <span className="font-label-caps text-[10px] font-bold text-error">
                  CRITICAL_EVENT
                </span>
                <span className="font-data-md text-[10px] text-on-surface-variant">13:54:02</span>
              </div>
              <div className="mt-1 font-body-md text-body-md text-on-surface">
                Activity Drop detected in House 2. Sensor redundancy verified.
              </div>
              <div className="mt-2 flex gap-2">
                <button className="border border-outline-variant px-2 py-0.5 font-label-caps text-[9px] text-on-surface transition-colors hover:bg-surface-container">
                  INVESTIGATE
                </button>
                <button className="border border-outline-variant px-2 py-0.5 font-label-caps text-[9px] text-on-surface-variant transition-colors hover:bg-surface-container">
                  DISMISS
                </button>
              </div>
            </div>
            {[
              [
                "DEVIATION_LOG",
                "13:22:15",
                "Weight Deviation (+1.4g) House 1. Sampling rate adjusted.",
              ],
              ["ENV_REPORT", "12:10:45", "Humidity sensor H-09 recalibrated automatically."],
              ["FEED_CYCLE", "11:00:00", "Cycle 04 completed. Consumed: 1,420kg."],
            ].map(([kind, time, body]) => (
              <div
                key={kind}
                className="border-b border-l-2 border-outline-variant/30 border-l-on-surface-variant/30 p-4"
              >
                <div className="flex items-start justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant">
                    {kind}
                  </span>
                  <span className="font-data-md text-[10px] text-on-surface-variant">{time}</span>
                </div>
                <div className="mt-1 font-body-md text-body-md text-on-surface-variant">
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="clinical-card p-4">
            <div className="mb-4 flex items-start justify-between">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                {m.label}
              </span>
              <span className={`font-data-md text-data-md ${m.deltaClass}`}>{m.delta}</span>
            </div>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="font-data-lg text-data-lg text-primary">{m.value}</span>
              <span className="font-data-md text-on-surface-variant">{m.sub}</span>
            </div>
            <div className="h-10 w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 300 40">
                <path d={m.path} fill="none" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-stack-lg">
        <div className="clinical-card p-6">
          <h2 className="mb-6 font-label-caps text-label-caps text-on-surface-variant">
            SENSOR_CLUSTER_STATUS
          </h2>
          <div className="grid grid-cols-2 gap-stack-md md:grid-cols-4 lg:grid-cols-6">
            {sensors.map(([label, value]) => (
              <div key={label} className="rounded border border-outline-variant/20 p-3">
                <div className="font-label-caps text-[10px] text-on-surface-variant">{label}</div>
                <div className="mt-1 font-data-md text-data-md text-primary">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
