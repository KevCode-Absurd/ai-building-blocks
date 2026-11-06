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

export type Provider = "anthropic" | "openai" | "gemini" | "deepseek" | "fake";

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
  /** Spend already billed by providers before the call failed (e.g. a cut-off or broken reply). Logged by callModel. */
  costMicroUsd = 0;
  provider?: Provider;
  model?: string;
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
// Anthropic Messages, OpenAI Responses, Gemini generateContent and DeepSeek chat completions, all over fetch with a timeout.
// Each tier lists models in order of preference; providers without a key, or left out of MODEL_PROVIDERS, are skipped,
// and busy, failing or cut-off replies fall back to the next model. Prompts, replies, keys and provider error bodies are
// never logged or echoed: error messages are our own words.

type LiveProvider = Exclude<Provider, "fake">;

/** Prices in USD per million tokens (from the library's composer table, checked 2026-10-22). Same number as micro-USD per token. */
export interface LiveModel { id: string; provider: LiveProvider; input: number; output: number; cached: number }

export const LIVE_MODELS: Record<string, LiveModel> = {
  "claude-haiku-5-5": { id: "claude-haiku-5-5", provider: "anthropic", input: 0.1, output: 0.5, cached: 0.01 },
  "claude-sonnet-5-5": { id: "claude-sonnet-5-5", provider: "anthropic", input: 2, output: 10, cached: 0.1 },
  "claude-opus-5-5": { id: "claude-opus-5-5", provider: "anthropic", input: 4, output: 20, cached: 0.2 },
  "gpt-6-luna": { id: "gpt-6-luna", provider: "openai", input: 0.1, output: 0.5, cached: 0.01 },
  "gpt-6.1-sol": { id: "gpt-6.1-sol", provider: "openai", input: 2, output: 10, cached: 0.1 },
  "gpt-6-astra": { id: "gpt-6-astra", provider: "openai", input: 10, output: 50, cached: 1 },
  "gemini-3.5-flash-lite": { id: "gemini-3.5-flash-lite", provider: "gemini", input: 0.3, output: 2.5, cached: 0.03 },
  "gemini-3.1-pro-preview": { id: "gemini-3.1-pro-preview", provider: "gemini", input: 2, output: 12, cached: 0.2 },
  // DeepSeek's peak-hour prices (off-peak is half), checked 2026-11-06. Thinking tokens are billed as output.
  "deepseek-flash": { id: "deepseek-flash", provider: "deepseek", input: 0.3, output: 1.2, cached: 0.006 },
  "deepseek-v4-pro": { id: "deepseek-v4-pro", provider: "deepseek", input: 1.32, output: 3.96, cached: 0.044 },
};

/** Models per tier, first choice first. Judges list other families first: the default writer is Anthropic. */
export const TIER_MODELS: Record<ModelTier | "judge", string[]> = {
  small: ["claude-haiku-5-5", "gpt-6-luna", "gemini-3.5-flash-lite", "deepseek-flash"],
  standard: ["claude-sonnet-5-5", "gpt-6.1-sol", "gemini-3.1-pro-preview", "deepseek-v4-pro"],
  premium: ["claude-opus-5-5", "gpt-6-astra", "gemini-3.1-pro-preview", "deepseek-v4-pro"],
  judge: ["gpt-6.1-sol", "gemini-3.1-pro-preview", "deepseek-v4-pro", "claude-sonnet-5-5"],
};

export const PROVIDER_KEYS = { anthropic: "ANTHROPIC_API_KEY", openai: "OPENAI_API_KEY", gemini: "GEMINI_API_KEY", deepseek: "DEEPSEEK_API_KEY" } as const;

/** MODEL_PROVIDERS, e.g. "anthropic,gemini,deepseek": only these providers do text work. Unset = every provider with a key. */
function allowedProviders(env: Env): Set<string> | null {
  const list = (env.MODEL_PROVIDERS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return list.length ? new Set(list) : null;
}

type Effort = "low" | "medium" | "high";
const EFFORT: Record<ModelTier | "judge", Effort> = { small: "low", standard: "medium", premium: "high", judge: "medium" };
/** Reasoning tokens count against the provider's output limit, so the limit is the caller's budget plus headroom. */
const THINKING_HEADROOM: Record<Effort, number> = { low: 2048, medium: 6144, high: 12288 };
const TIMEOUT_MS: Record<ModelTier | "judge", number> = { small: 60_000, judge: 150_000, standard: 180_000, premium: 300_000 };

export interface TokenUsage { input: number; output: number; cached: number; cacheWrite: number }

/** Cost in micro-USD. input = uncached input tokens. Haiku costs 5x for prompts over 100k tokens. */
export function usageCostMicroUsd(model: LiveModel, u: TokenUsage): number {
  const long = model.id === "claude-haiku-5-5" && u.input + u.cached + u.cacheWrite > 100_000 ? 5 : 1;
  return Math.ceil((u.input * model.input + u.output * model.output + u.cached * model.cached + u.cacheWrite * model.input * 1.25) * long);
}

/** The models callProvider will try for a request, in order: tier list, minus avoidProvider, providers outside
 *  MODEL_PROVIDERS and providers without a key. */
export function modelCandidates(env: Env, tier: ModelTier | "judge", avoidProvider?: Provider): LiveModel[] {
  const allowed = allowedProviders(env);
  return TIER_MODELS[tier]
    .map(id => LIVE_MODELS[id])
    .filter(m => m && m.provider !== avoidProvider && (!allowed || allowed.has(m.provider)) && !!env[PROVIDER_KEYS[m.provider]]?.trim());
}

/** Pick a provider and model for the tier, call it, and return usage and cost. Throws ModelError on failure. */
export async function callProvider(env: Env, req: ModelRequest): Promise<ModelResponse> {
  const candidates = modelCandidates(env, req.tier, req.avoidProvider);
  if (!candidates.length) throw new ModelError("not_configured", "No AI provider is set up for this kind of work yet.");
  let billed = 0;
  let last: ModelError | null = null;
  for (const model of candidates) {
    try {
      const res = await callLiveModel(env, model, req, true);
      return { ...res, costMicroUsd: res.costMicroUsd + billed };
    } catch (err) {
      const e = err instanceof ModelError ? err : tag(new ModelError("provider_error", "The AI provider failed.", true), model);
      billed += e.costMicroUsd;
      last = e;
      if (!(e.retryable || FALLBACK_CODES.has(e.code))) break;
    }
  }
  const out = new ModelError(last!.code, last!.message, last!.retryable);
  out.costMicroUsd = billed;
  out.provider = last!.provider;
  out.model = last!.model;
  throw out;
}

/** Not retryable on the same model, but another provider may well work. */
const FALLBACK_CODES = new Set(["provider_auth", "model_unavailable"]);

function tag(e: ModelError, model: LiveModel): ModelError { e.provider = model.provider; e.model = model.id; return e; }

function httpError(status: number): ModelError {
  if (status === 401 || status === 403) return new ModelError("provider_auth", `The AI provider did not accept our key (HTTP ${status}).`);
  if (status === 404) return new ModelError("model_unavailable", "The AI provider does not offer this model right now (HTTP 404).");
  if (status === 429) return new ModelError("provider_busy", "The AI provider is busy right now (HTTP 429).", true);
  if (status === 408 || status === 409 || status === 425 || status >= 500) return new ModelError("provider_error", `The AI provider had a problem (HTTP ${status}).`, true);
  return new ModelError("provider_rejected", `The AI provider could not accept this request (HTTP ${status}).`);
}

interface Reply { text: string; usage: TokenUsage; finish: "complete" | "incomplete" | "refused"; actualModel: string }

async function callLiveModel(env: Env, model: LiveModel, req: ModelRequest, structured: boolean): Promise<ModelResponse> {
  const key = env[PROVIDER_KEYS[model.provider]]!.trim();
  const effort = EFFORT[req.tier];
  const limit = Math.min(64_000, Math.max(256, req.maxTokens ?? 4096) + THINKING_HEADROOM[effort]);
  const schema = structured && req.json && req.schema ? providerSchema(model.provider, req.schema) : null;
  const system = !req.json ? req.system
    : schema || !req.schema ? `${req.system}\n\nReply with one JSON object only.`
    : `${req.system}\n\nReply with one JSON object only, matching this JSON schema:\n${JSON.stringify(req.schema)}`;
  const { url, headers, body } = buildRequest(model, key, { system, prompt: req.prompt, limit, effort, json: !!req.json, schema, temperature: req.temperature });

  let response: Response;
  try {
    response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(TIMEOUT_MS[req.tier]) });
  } catch (err) {
    const name = (err as { name?: string } | null)?.name;
    const timedOut = name === "TimeoutError" || name === "AbortError";
    throw tag(new ModelError(timedOut ? "provider_timeout" : "provider_unreachable", timedOut ? "The AI provider took too long to answer." : "We could not reach the AI provider.", true), model);
  }
  if (!response.ok) {
    // Never read or pass on provider error bodies: they can echo the request or account details.
    await response.body?.cancel().catch(() => {});
    // A schema the provider will not take: ask again with the schema in the prompt instead.
    if (response.status === 400 && schema) return callLiveModel(env, model, req, false);
    throw tag(httpError(response.status), model);
  }
  let payload: unknown;
  try { payload = await response.json(); } catch { throw tag(new ModelError("provider_bad_reply", "The AI provider sent a reply we could not read.", true), model); }

  const reply = parseReply(model, payload);
  const cost = usageCostMicroUsd(model, reply.usage);
  const billedError = (code: string, message: string) => { const e = tag(new ModelError(code, message, true), model); e.costMicroUsd = cost; return e; };
  if (reply.finish === "refused") throw billedError("provider_refused", "The AI provider declined this request.");
  if (reply.finish === "incomplete" || !reply.text.trim()) throw billedError("provider_incomplete", "The AI reply was cut off before it finished.");
  let data: unknown;
  if (req.json) {
    try { data = parseModelJson(reply.text); } catch (err) { throw billedError("bad_json", err instanceof Error ? err.message : "The model returned broken JSON."); }
  }
  return {
    text: reply.text, data, provider: model.provider, model: reply.actualModel || model.id,
    inputTokens: reply.usage.input + reply.usage.cached + reply.usage.cacheWrite, outputTokens: reply.usage.output, costMicroUsd: cost,
  };
}

interface BuildInput { system: string; prompt: string; limit: number; effort: Effort; json: boolean; schema: ProviderSchema | null; temperature?: number }
type ProviderSchema = { schema: Record<string, unknown>; strict: boolean };

function buildRequest(model: LiveModel, key: string, b: BuildInput): { url: string; headers: Record<string, string>; body: unknown } {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (model.provider === "anthropic") {
    headers["x-api-key"] = key;
    headers["anthropic-version"] = "2023-06-01";
    // Thinking is adaptive by default on the 5.5 models; effort sets its depth. Sampling settings are not accepted there.
    return {
      url: "https://api.anthropic.com/v1/messages", headers,
      body: {
        model: model.id, max_tokens: b.limit, system: b.system, messages: [{ role: "user", content: b.prompt }],
        output_config: { effort: b.effort, ...(b.schema ? { format: { type: "json_schema", schema: b.schema.schema } } : {}) },
      },
    };
  }
  if (model.provider === "openai") {
    headers.authorization = `Bearer ${key}`;
    return {
      url: "https://api.openai.com/v1/responses", headers,
      body: {
        model: model.id, instructions: b.system, input: b.prompt, max_output_tokens: b.limit, store: false, reasoning: { effort: b.effort },
        ...(b.json ? { text: { format: b.schema ? { type: "json_schema", name: "result", strict: b.schema.strict, schema: b.schema.schema } : { type: "json_object" } } } : {}),
      },
    };
  }
  if (model.provider === "deepseek") {
    // OpenAI-style chat completions. JSON mode needs the word "json" in the prompt; the system line above has it.
    headers.authorization = `Bearer ${key}`;
    return {
      url: "https://api.deepseek.com/chat/completions", headers,
      body: {
        model: model.id, max_tokens: b.limit,
        messages: [{ role: "system", content: b.system }, { role: "user", content: b.prompt }],
        thinking: { type: "enabled" }, reasoning_effort: b.effort,
        ...(b.json ? { response_format: { type: "json_object" } } : {}),
      },
    };
  }
  headers["x-goog-api-key"] = key;
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent`, headers,
    body: {
      systemInstruction: { parts: [{ text: b.system }] },
      contents: [{ role: "user", parts: [{ text: b.prompt }] }],
      generationConfig: {
        maxOutputTokens: b.limit,
        thinkingConfig: { thinkingLevel: b.effort === "high" ? "HIGH" : "LOW" },
        ...(b.temperature !== undefined ? { temperature: b.temperature } : {}),
        ...(b.json ? { responseMimeType: "application/json", ...(b.schema ? { responseJsonSchema: b.schema.schema } : {}) } : {}),
      },
    },
  };
}

/** Adapt a JSON schema to what each provider's structured output accepts; null = ask for JSON in the prompt instead. */
function providerSchema(provider: LiveProvider, schema: Record<string, unknown>): ProviderSchema | null {
  if (provider === "deepseek") return null; // JSON mode only: the schema goes in the prompt.
  if (provider === "gemini") return { schema, strict: false };
  if (provider === "openai") return { schema, strict: isStrictSchema(schema) };
  const copy = structuredClone(schema) as Record<string, unknown>;
  let supported = true;
  const visit = (node: any) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;
    // Anthropic does not take numeric, length or most array constraints: keep them as a note (callers validate anyway).
    const constraints: Record<string, unknown> = {};
    for (const key of ["maxItems", "minLength", "maxLength", "minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf", "minItems"]) {
      if (Object.hasOwn(node, key) && (key !== "minItems" || ![0, 1].includes(node[key]))) { constraints[key] = node[key]; delete node[key]; }
    }
    if (Object.keys(constraints).length) node.description = [node.description, `Limits: ${JSON.stringify(constraints)}`].filter(Boolean).join("\n");
    const isObject = node.type === "object" || (Array.isArray(node.type) && node.type.includes("object")) || node.properties;
    if (isObject) {
      // Every object needs additionalProperties: false; free-form maps cannot be expressed.
      if (!node.properties || (node.additionalProperties !== undefined && node.additionalProperties !== false)) supported = false;
      else node.additionalProperties = false;
    }
    for (const key of ["properties", "$defs", "definitions"]) for (const child of Object.values(node[key] ?? {})) visit(child);
    if (Array.isArray(node.items)) node.items.forEach(visit); else visit(node.items);
    for (const key of ["anyOf", "allOf", "oneOf"]) for (const child of node[key] ?? []) visit(child);
  };
  visit(copy);
  return supported ? { schema: copy, strict: true } : null;
}

/** OpenAI strict mode needs every object closed and every property required. Otherwise send the schema non-strict. */
function isStrictSchema(schema: unknown): boolean {
  let ok = true;
  const visit = (node: any) => {
    if (!ok || !node || typeof node !== "object" || Array.isArray(node)) return;
    if (node.properties) {
      const keys = Object.keys(node.properties);
      const required: string[] = Array.isArray(node.required) ? node.required : [];
      if (node.additionalProperties !== false || keys.some(k => !required.includes(k))) { ok = false; return; }
      for (const child of Object.values(node.properties)) visit(child);
    } else if (node.type === "object") { ok = false; return; }
    if (Array.isArray(node.items)) node.items.forEach(visit); else visit(node.items);
    for (const key of ["anyOf", "allOf", "oneOf"]) for (const child of node[key] ?? []) visit(child);
    for (const key of ["$defs", "definitions"]) for (const child of Object.values(node[key] ?? {})) visit(child);
  };
  visit(schema);
  return ok;
}

const GEMINI_REFUSALS = new Set(["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII", "IMAGE_SAFETY"]);

function parseReply(model: LiveModel, payload: unknown): Reply {
  const d = (payload ?? {}) as any;
  const usage: TokenUsage = { input: 0, output: 0, cached: 0, cacheWrite: 0 };
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  if (model.provider === "anthropic") {
    const text = (d.content ?? []).filter((c: any) => c?.type === "text").map((c: any) => String(c.text ?? "")).join("");
    usage.input = num(d.usage?.input_tokens);
    usage.output = num(d.usage?.output_tokens);
    usage.cached = num(d.usage?.cache_read_input_tokens);
    usage.cacheWrite = num(d.usage?.cache_creation_input_tokens);
    const stop = d.stop_reason;
    const finish = stop === "end_turn" || stop === "stop_sequence" ? "complete" : stop === "refusal" ? "refused" : "incomplete";
    return { text, usage, finish, actualModel: String(d.model ?? "") };
  }
  if (model.provider === "openai") {
    // A reply can hold commentary and a final answer; joining them corrupts JSON, so take the final message only.
    const messages = (d.output ?? []).filter((o: any) => (!o?.type || o.type === "message") && (!o.role || o.role === "assistant"));
    const final = messages.filter((o: any) => o.phase === "final_answer").at(-1) ?? messages.filter((o: any) => !o.phase).at(-1);
    const parts: any[] = final?.content ?? [];
    const text = parts.filter(c => c?.type === "output_text").map(c => String(c.text ?? "")).join("");
    usage.cached = num(d.usage?.input_tokens_details?.cached_tokens);
    usage.input = Math.max(0, num(d.usage?.input_tokens) - usage.cached);
    usage.output = num(d.usage?.output_tokens);
    const refused = parts.some(c => c?.type === "refusal");
    const finish = refused ? "refused" : d.status === "completed" ? "complete" : "incomplete";
    return { text, usage, finish, actualModel: String(d.model ?? "") };
  }
  if (model.provider === "deepseek") {
    // The answer is message.content; thinking arrives separately in reasoning_content and is not part of the reply.
    const choice = d.choices?.[0];
    const text = String(choice?.message?.content ?? "");
    usage.cached = num(d.usage?.prompt_cache_hit_tokens);
    usage.input = Math.max(0, num(d.usage?.prompt_tokens) - usage.cached);
    usage.output = num(d.usage?.completion_tokens);
    const reason = choice?.finish_reason;
    const finish = reason === "stop" ? "complete" : reason === "content_filter" ? "refused" : "incomplete";
    return { text, usage, finish, actualModel: String(d.model ?? "") };
  }
  const candidate = d.candidates?.[0];
  const text = (candidate?.content?.parts ?? []).filter((p: any) => p && !p.thought).map((p: any) => String(p.text ?? "")).join("");
  usage.cached = num(d.usageMetadata?.cachedContentTokenCount);
  usage.input = Math.max(0, num(d.usageMetadata?.promptTokenCount) - usage.cached);
  usage.output = num(d.usageMetadata?.candidatesTokenCount) + num(d.usageMetadata?.thoughtsTokenCount);
  const reason = candidate?.finishReason;
  const finish = !candidate && d.promptFeedback?.blockReason ? "refused"
    : reason === "STOP" ? "complete" : GEMINI_REFUSALS.has(reason) ? "refused" : "incomplete";
  return { text, usage, finish, actualModel: String(d.modelVersion ?? "") };
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
    // A failed call can still have been billed (a cut-off or broken reply): the error carries that spend.
    const failed = error instanceof ModelError ? error : null;
    await env.DB.prepare("INSERT INTO model_calls (id, day, purpose, job_id, run_id, provider, model, input_tokens, output_tokens, cost_micro_usd, ok, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(newId("mc"), today(), req.purpose, req.jobId ?? null, req.runId ?? null, res?.provider ?? failed?.provider ?? "unknown", res?.model ?? failed?.model ?? "unknown",
        res?.inputTokens ?? 0, res?.outputTokens ?? 0, res?.costMicroUsd ?? failed?.costMicroUsd ?? 0, error ? 0 : 1, nowIso())
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
