import { readFileSync } from "node:fs";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Kimi-K3 integration for the Intelligence page.
 *
 * Requested model `inference-optimization/Kimi-K3-0.40B` is a tiny CI test
 * checkpoint (custom_code, feature-extraction) with no hosted inference
 * endpoint, so we route to its production base model `moonshotai/Kimi-K3`
 * through the Hugging Face Inference Providers router instead.
 */
const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const DEFAULT_MODEL = "moonshotai/Kimi-K3";
const REQUEST_TIMEOUT_MS = 90_000;

/** Telemetry snapshot mirroring the dashboard mock data — grounding context for the model. */
const FARM_SNAPSHOT = `FARM TELEMETRY SNAPSHOT (POULTRY_AI FARM_OS v2.4.0)
- Facility: Houses 01-04, Ross 308 broilers, grow-out day 42.
- Real-time activity index: 482.4 IDX, trending up over last 24h.
- Weight: actual avg 2,452 g vs breed standard 2,422 g (+1.2% variance, TRENDING_OPTIMAL, conf 98.4%).
- Estimation confidence: 94% (SENSOR_STABLE).
- House 04 environment: temp 24.2 C, humidity 58%, NH3 3 ppm, CO2 1,100 ppm — within bounds.
- Open incident: House 02 activity dropped 15.4% between 02:15-04:40 UTC. Sensor SN-482-H2
  recorded an ammonia spike peaking 28.4 ppm (+420% vs baseline), above the 25 ppm threshold
  for 142 minutes. Cause: ventilation group B failure after a circuit breaker trip. Ventilation
  restored; NH3 back to 3 ppm.
- Camera AI (UNIT_04_NORTH): huddling cluster warning flagged (0.82 confidence) in House 02 replay.
- Platform: API_v1.2, ML_MODEL_v4, inference latency 24 ms, CPU 34%, RAM 2.1 GB, status NOMINAL.`;

const SYSTEM_PROMPT = `You are the POULTRY_AI Intelligence Engine inside the FARM_OS operations console.
Answer operator questions strictly grounded in the telemetry snapshot below. Be precise and
clinical; reference sensors, houses and figures from the snapshot. If asked something the
snapshot cannot answer, say what additional telemetry would be required. Respond in plain
text only (no markdown, no headings), maximum 120 words.

${FARM_SNAPSHOT}`;

type ChatMessage = { role: "system" | "user"; content: string };

/**
 * Vite does not copy .env into process.env for SSR modules, so fall back to
 * parsing the project .env file once at module load.
 */
function loadHfToken(): string | undefined {
  if (process.env.HF_TOKEN) return process.env.HF_TOKEN;
  try {
    const line = readFileSync(".env", "utf8")
      .split(/\r?\n/)
      .find((l) => l.startsWith("HF_TOKEN="));
    const value = line?.slice("HF_TOKEN=".length).trim().replace(/^["']|["']$/g, "");
    return value || undefined;
  } catch {
    return undefined;
  }
}

async function callKimi(
  messages: ChatMessage[],
  maxTokens: number,
): Promise<{ content: string; latencyMs: number; model: string }> {
  const token = loadHfToken();
  if (!token) {
    throw new Error(
      "HF_TOKEN is not configured. Add HF_TOKEN=hf_... to the .env file (see .env.example) and restart the dev server.",
    );
  }

  const model = process.env.HF_MODEL ?? DEFAULT_MODEL;
  const started = Date.now();
  const res = await fetch(HF_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Kimi-K3 request failed (HTTP ${res.status}): ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    model?: string;
    choices?: { message?: { content?: string; reasoning_content?: string } }[];
  };
  // Kimi-K3 is a reasoning model: the final answer lands in `content` after the
  // reasoning budget; fall back to `reasoning_content` if content came back empty.
  const message = json.choices?.[0]?.message;
  const content = message?.content?.trim() || message?.reasoning_content?.trim();
  if (!content) throw new Error("Kimi-K3 returned an empty response.");

  return { content, latencyMs: Date.now() - started, model: json.model ?? model };
}

/** Operator Q&A — results analysis grounded in the farm snapshot. */
export const queryIntelligence = createServerFn({ method: "POST" })
  .validator(z.object({ question: z.string().trim().min(1).max(2000) }))
  .handler(async ({ data }) => {
    const { content, latencyMs, model } = await callKimi(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: data.question },
      ],
      2000,
    );
    return { answer: content, latencyMs, model };
  });

const alertSchema = z.object({
  severity: z.enum(["critical", "warning", "nominal"]),
  title: z.string().min(1).max(80),
  detail: z.string().min(1).max(300),
  action: z.string().min(1).max(200),
});

export type FeedbackAlert = z.infer<typeof alertSchema>;

const ALERTS_PROMPT = `Analyze the telemetry snapshot and produce feedback alerts for the farm operator.
Return ONLY a JSON array (no markdown fences, no prose) of 3 to 5 objects with exactly these keys:
"severity" (one of "critical", "warning", "nominal"), "title" (<= 8 words, uppercase),
"detail" (one sentence citing snapshot figures), "action" (one imperative sentence).
Order from most to least severe.

${FARM_SNAPSHOT}`;

function extractJsonArray(raw: string): unknown {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end <= start) {
    throw new Error("Kimi-K3 response did not contain a JSON array.");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

/** Feedback alerts — model-generated triage of the current telemetry. */
export const fetchFeedbackAlerts = createServerFn({ method: "POST" }).handler(async () => {
  const { content, latencyMs, model } = await callKimi(
    [{ role: "user", content: ALERTS_PROMPT }],
    2500,
  );
  const alerts = z.array(alertSchema).min(1).max(6).parse(extractJsonArray(content));
  return { alerts, latencyMs, model, generatedAt: new Date().toISOString() };
});
