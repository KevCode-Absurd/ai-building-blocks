// The model router: one function every module uses to call an AI model.
// Owner: runner module (it implements the live providers in callProvider). Other modules only call callModel.
//
// - Tiers, not model names: small (sort, extract), standard (most writing), premium (hard work), judge (scoring).
// - Judges must come from a different provider family than the writer: pass avoidProvider.
// - Every call is logged in model_calls with tokens and cost; the daily cap (DAILY_MODEL_CAP_USD) is checked first.
// - MODEL_MODE=fake returns deterministic replies from registered fakes, for tests and the local demo.
import type { Env } from "../env.ts";
import type { ModelTier } from "./types.ts";
import { HttpError } from "./http.ts";
import { newId, nowIso, today } from "./db.ts";

export type Provider = "anthropic" | "openai" | "gemini" | "fake";

export interface ModelRequest {
  /** What the call is for, e.g. "intake.classify", "runner.step", "evaluation.rubric". Used for logs and fakes. */
  purpose: string;
  tier: ModelTier | "judge";
  system: string;
  prompt: string;
  /** Expect a JSON object back. With schema, providers that support it are asked for structured output. */
  json?: boolean;
  schema?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
  /** Do not use this provider (judges avoid the writer's family). */
  avoidProvider?: Provider;
  jobId?: string;
  runId?: string;
}

export interface ModelResponse {
  text: string;
  /** Parsed JSON when json was requested. */
  data?: unknown;
  provider: Provider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costMicroUsd: number;
}

export class ModelError extends Error {
  code: string;
  retryable: boolean;
  constructor(code: string, message: string, retryable = false) { super(message); this.code = code; this.retryable = retryable; }
}

// ---------- Fakes ----------

export type FakeHandler = (req: ModelRequest) => { text?: string; data?: unknown } | Promise<{ text?: string; data?: unknown }>;
const fakes = new Map<string, FakeHandler>();

/** Register a fake reply for a purpose (exact match, or a prefix ending in "*", e.g. "runner.*"). Later registrations win. */
export function registerFake(purpose: string, handler: FakeHandler): void { fakes.set(purpose, handler); }
export function clearFakes(): void { fakes.clear(); }

function findFake(purpose: string): FakeHandler | undefined {
  if (fakes.has(purpose)) return fakes.get(purpose);
  let best: [string, FakeHandler] | undefined;
  for (const [key, handler] of fakes) {
    if (key.endsWith("*") && purpose.startsWith(key.slice(0, -1)) && (!best || key.length > best[0].length)) best = [key, handler];
  }
  return best?.[1];
}

async function callFake(req: ModelRequest): Promise<ModelResponse> {
  const handler = findFake(req.purpose);
  let text: string, data: unknown;
  if (handler) {
    const out = await handler(req);
    data = out.data;
    text = out.text ?? (out.data !== undefined ? JSON.stringify(out.data) : "");
  } else if (req.json) {
    throw new ModelError("no_fake", `No fake model reply registered for ${req.purpose}.`);
  } else {
    text = `Draft for ${req.purpose}.\n\n${req.prompt.slice(0, 400)}`;
  }
  if (req.json && data === undefined) {
    try { data = JSON.parse(text); } catch { throw new ModelError("bad_json", "The fake reply was not JSON."); }
  }
  return { text, data, provider: "fake", model: "fake-1", inputTokens: Math.ceil((req.system.length + req.prompt.length) / 4), outputTokens: Math.ceil(text.length / 4), costMicroUsd: 0 };
}

// ---------- Live providers (runner module implements) ----------

/** Pick a provider and model for the tier, call it, and return usage and cost. Throws ModelError on failure. */
export async function callProvider(env: Env, req: ModelRequest): Promise<ModelResponse> {
  void env; void req;
  throw new ModelError("not_configured", "Live model providers are not set up yet.");
}

// ---------- The one entry point ----------

export async function callModel(env: Env, req: ModelRequest): Promise<ModelResponse> {
  const capUsd = Number(env.DAILY_MODEL_CAP_USD ?? "5");
  if (env.MODEL_MODE !== "fake") {
    const spent = await env.DB.prepare("SELECT COALESCE(SUM(cost_micro_usd), 0) AS micro FROM model_calls WHERE day = ?").bind(today()).first<{ micro: number }>();
    if ((spent?.micro ?? 0) >= capUsd * 1_000_000) {
      throw new HttpError(503, "model_cap_reached", "We have reached today's limit for AI work. Your job is saved and will continue tomorrow.");
    }
  }
  let res: ModelResponse | null = null, error: unknown = null;
  try {
    res = env.MODEL_MODE === "fake" ? await callFake(req) : await callProvider(env, req);
    return res;
  } catch (err) {
    error = err;
    throw err;
  } finally {
    await env.DB.prepare("INSERT INTO model_calls (id, day, purpose, job_id, run_id, provider, model, input_tokens, output_tokens, cost_micro_usd, ok, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(newId("mc"), today(), req.purpose, req.jobId ?? null, req.runId ?? null, res?.provider ?? "unknown", res?.model ?? "unknown",
        res?.inputTokens ?? 0, res?.outputTokens ?? 0, res?.costMicroUsd ?? 0, error ? 0 : 1, nowIso())
      .run().catch(() => {});
  }
}

/** Parse a JSON object out of model text (tolerates code fences). */
export function parseModelJson<T = unknown>(text: string): T {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const body = (fenced ? fenced[1] : text).trim();
  const start = body.indexOf("{"), end = body.lastIndexOf("}");
  if (start < 0 || end < start) throw new ModelError("bad_json", "The model did not return JSON.", true);
  try { return JSON.parse(body.slice(start, end + 1)) as T; } catch { throw new ModelError("bad_json", "The model returned broken JSON.", true); }
}
