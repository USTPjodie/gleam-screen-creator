import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/farm/AppShell";
import { Icon } from "@/components/farm/Icon";

const TITLE = "Intelligence OS | POULTRY_AI Query Engine";
const DESC =
  "Ask the intelligence engine about flock anomalies and review grounded sensor, visual and reference evidence.";

const EVIDENCE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAABtUdsRNWeVnOQQB2eAHQ35S-QIhSVyxsOimgAmCc5ZGENE3aaquoZdsSlLwpqmm3lkucrtSv_T1Gefy13GUaEiewbOM0CF70C6h5Oavh88ttUST7n4EPBg69gyu9nG5vTucK7Wfk94AJUbuBz_ogbzaoB-cje9ScHmyirVT9LPGu8bKNn66CEUGEHJ3dBEkrZ5Mg10sxAW-cyV446s9kSufVx675k0kJU-oRoJV8QerT4tOIsTnL";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: EVIDENCE_IMAGE },
      { name: "twitter:image", content: EVIDENCE_IMAGE },
    ],
  }),
  component: IntelligencePage,
});

function IntelligencePage() {
  return (
    <AppShell bare>
      <div className="grid flex-1 grid-cols-1 overflow-hidden xl:grid-cols-12">
        <section className="flex h-full flex-col border-r border-outline-variant bg-background xl:col-span-8">
          <div className="flex-1 space-y-12 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-3xl">
              <h1 className="sr-only">POULTRY_AI Intelligence OS</h1>
              <div className="mb-8 flex items-center gap-2">
                <span className="border border-outline-variant bg-surface-container-high px-2 py-1 font-label-caps text-[9px] uppercase tracking-widest text-primary">
                  System Ready
                </span>
                <div className="h-px flex-1 bg-outline-variant opacity-30" />
                <span className="font-data-md text-data-md text-on-surface-variant">
                  2024-05-24 08:00:12 UTC
                </span>
              </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-10">
              <div className="flex flex-col items-end gap-2">
                <div className="max-w-[85%] rounded-lg border border-outline-variant bg-surface-container-high px-4 py-3">
                  <p className="font-body-md text-body-md text-primary">
                    Why did activity drop in House 2 yesterday between 02:00 and 06:00?
                  </p>
                </div>
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                  Operator 01
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                    <Icon name="psychology" size={16} filled className="text-on-primary" />
                  </div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">
                    Intelligence Engine
                  </span>
                </div>
                <div className="max-w-[90%] space-y-4 pl-11">
                  <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Analyzing telemetry for <span className="font-medium text-primary">House_02</span>.
                    Detection of activity drop (15.4%) confirmed between{" "}
                    <span className="font-data-md">02:15</span> and{" "}
                    <span className="font-data-md">04:40</span> UTC.
                  </p>
                  <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Root cause analysis suggests a localized{" "}
                    <span className="font-medium text-error">ammonia spike</span> (peak: 28ppm)
                    detected by environmental sensor{" "}
                    <span className="font-data-md">SN-482-H2</span>. This coincided with a brief
                    failure in ventilation group B due to a circuit breaker trip.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                      ["CONFIDENCE", "98.2%", "verified", "text-primary"],
                      ["LATENCY", "420ms", "speed", "text-on-surface-variant"],
                    ].map(([label, value, icon, iconClass]) => (
                      <div
                        key={label}
                        className="rounded border border-outline-variant bg-surface-container-lowest p-3"
                      >
                        <span className="mb-1 block font-label-caps text-[9px] text-on-surface-variant">
                          {label}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="font-data-lg text-data-lg text-primary">{value}</span>
                          <Icon name={icon} size={16} className={iconClass} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-3xl border-t border-outline-variant pt-16">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">
                    Automated Reports
                  </h3>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">
                    Scheduled analytical summaries
                  </p>
                </div>
                <button className="font-label-caps text-label-caps text-primary transition-all hover:underline">
                  VIEW ARCHIVE
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["description", "PDF_EXPORT", "Daily Health Summary", "2024-05-23 | 2.4 MB"],
                  ["monitoring", "CSV_RAW", "Environment Audit v4", "2024-05-23 | 8.1 MB"],
                ].map(([icon, tag, title, meta]) => (
                  <div
                    key={title}
                    className="group cursor-pointer border border-outline-variant bg-surface-container-lowest p-4 transition-all hover:border-primary"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Icon
                        name={icon}
                        className="text-on-surface-variant transition-colors group-hover:text-primary"
                      />
                      <span className="border border-outline-variant px-1 font-data-md text-[10px] text-on-surface-variant">
                        {tag}
                      </span>
                    </div>
                    <h4 className="mb-1 font-label-caps text-label-caps text-primary">{title}</h4>
                    <p className="font-data-md text-data-md text-on-surface-variant opacity-60">
                      {meta}
                    </p>
                  </div>
                ))}
                <div className="group relative col-span-2 cursor-pointer overflow-hidden border border-outline-variant bg-surface-container-lowest p-4 transition-all hover:border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 font-label-caps text-label-caps text-primary">
                        Weekly Genetic Trend Projection
                      </h4>
                      <p className="font-data-md text-data-md text-on-surface-variant opacity-60">
                        Week 21 Analysis | Generated 2h ago
                      </p>
                    </div>
                    <Icon
                      name="arrow_forward_ios"
                      className="text-on-surface-variant group-hover:text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant bg-background p-6">
            <div className="relative mx-auto max-w-3xl">
              <input
                className="w-full border border-outline-variant bg-surface-container-lowest px-5 py-4 pr-16 font-body-md text-primary transition-all placeholder:text-on-surface-variant placeholder:opacity-30 focus:border-primary focus:outline-none"
                placeholder="Query Intelligence Engine..."
                type="text"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary transition-transform hover:scale-110">
                <Icon name="send" />
              </button>
            </div>
            <div className="mx-auto mt-2 flex max-w-3xl gap-4">
              <span className="font-data-md text-[10px] text-on-surface-variant opacity-40">
                SUGGESTIONS:
              </span>
              <button className="font-data-md text-[10px] uppercase text-on-surface-variant transition-colors hover:text-primary">
                Analyse House 04 Mortality
              </button>
              <button className="font-data-md text-[10px] uppercase text-on-surface-variant transition-colors hover:text-primary">
                Predict Feed Requirement
              </button>
            </div>
          </div>
        </section>

        <aside className="flex h-full flex-col bg-surface-container-lowest xl:col-span-4">
          <div className="flex items-center justify-between border-b border-outline-variant p-6">
            <div className="flex items-center gap-2">
              <Icon name="hub" size={16} className="text-primary" />
              <h3 className="font-label-caps text-label-caps uppercase tracking-widest text-primary">
                Data Grounding
              </h3>
            </div>
            <span className="font-data-md text-data-md text-on-surface-variant">ID: RAG-8821</span>
          </div>
          <div className="flex-1 space-y-8 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-60">
                <Icon name="sensors" size={14} />
                <span className="font-label-caps text-[10px] uppercase tracking-widest">
                  Sensor Metric: Ammonia (NH3)
                </span>
              </div>
              <div className="relative h-40 w-full overflow-hidden border border-outline-variant bg-background">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex items-start justify-between">
                    <span className="font-data-md text-[18px] text-error">28.4 ppm</span>
                    <span className="font-data-md text-[10px] text-on-surface-variant">
                      +420% vs Baseline
                    </span>
                  </div>
                  <div className="flex h-12 w-full items-end gap-[2px]">
                    {[
                      ["30%", false],
                      ["35%", false],
                      ["32%", false],
                      ["80%", true],
                      ["100%", true],
                      ["90%", true],
                      ["40%", false],
                      ["30%", false],
                    ].map(([h, hot], i) => (
                      <div
                        key={i}
                        className={`flex-1 ${hot ? "bg-error" : "bg-outline-variant opacity-20"}`}
                        style={{ height: h as string }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-data-md text-data-md leading-snug text-on-surface-variant opacity-80">
                Sensor <span className="text-primary">SN-482-H2</span> reported critical ammonia
                levels exceeding 25ppm threshold for 142 minutes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-60">
                <Icon name="videocam" size={14} />
                <span className="font-label-caps text-[10px] uppercase tracking-widest">
                  Visual Evidence: H2-CAM-08
                </span>
              </div>
              <div className="group relative aspect-video w-full cursor-pointer overflow-hidden border border-outline-variant bg-background">
                <img
                  src={EVIDENCE_IMAGE}
                  alt="Night vision camera replay of poultry house with movement tracking overlays"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Icon name="play_circle" size={40} filled className="text-primary" />
                </div>
                <div className="absolute left-2 top-2 bg-error px-2 py-0.5 font-data-md text-[10px] text-on-error">
                  REPLAY: 02:45 UTC
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-60">
                <Icon name="library_books" size={14} />
                <span className="font-label-caps text-[10px] uppercase tracking-widest">
                  Reference: Biological Standards
                </span>
              </div>
              <div className="border-l-2 border-primary bg-surface-container p-4">
                <p className="font-body-md text-body-md italic text-on-surface-variant">
                  "Ammonia levels above 20ppm cause respiratory irritation in broiler populations,
                  leading to reduced movement and huddling behavior."
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-label-caps text-[9px] text-primary">
                    MANUAL_VOL_II_SEC_4.2
                  </span>
                  <Icon name="open_in_new" size={16} className="text-on-surface-variant" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-outline-variant bg-surface-container-lowest p-6">
            <button className="w-full border border-primary py-3 font-label-caps text-label-caps tracking-widest text-primary transition-all hover:bg-primary hover:text-on-primary">
              GENERATE INCIDENT REPORT
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}