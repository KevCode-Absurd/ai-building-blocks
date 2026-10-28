import { accountAttemptLimit, dailyBudget, FREE_WORKFLOWS_PER_DAY, type ComposerPolicyEnv } from "../lib/composer-policy.ts";
import { decodeCatalogue, finalize, LIMITS, requestError, validateChoices, type Choices, type Library } from "../lib/composer-core.ts";
import { callModel, KEY_NAMES, MODELS, type ModelResult } from "../lib/composer-models.ts";
import { semanticReservation, semanticWorkflow } from "../lib/composer-semantic.ts";
export type ComposerEnv = ComposerPolicyEnv & { OPENAI_API_KEY?: string; GEMINI_API_KEY?: string; ANTHROPIC_API_KEY?: string; DEEPSEEK_API_KEY?: string; WORKFLOW_COMPOSER_ENABLED?: string; WORKFLOW_DEFAULT_MODEL?: string; WORKFLOW_SALT?: string };
type Job = { id: string; fingerprint: string; day: string; ip: string; user_id: string; charge: number; status: string; result: string | null };
export type ComposerUsage = { completed: number; attemptsToday: number; estimatedCost: number };
export interface ComposerStore { get(id: string): Promise<Job | null>; claim(job: Job, cap: number, dailyLimit?: number | null): Promise<boolean>; finish(id: string, charge: number, status: string, result: string | null): Promise<void>; usage(userId: string, day: string): Promise<ComposerUsage> }
export function memoryComposer(): ComposerStore {
  const jobs = new Map<string, Job>();
  return {
    async get(id) { return jobs.get(id) ?? null; },
    async claim(job, cap, dailyLimit = FREE_WORKFLOWS_PER_DAY) { const daily = [...jobs.values()].filter(j => j.day === job.day); if (jobs.has(job.id) || daily.reduce((n, j) => n + j.charge, 0) + job.charge > cap || dailyLimit !== null && (daily.filter(j => j.ip === job.ip).length >= 10 || daily.filter(j => j.user_id === job.user_id).length >= dailyLimit)) return false; jobs.set(job.id, job); return true; },
    async finish(id, charge, status, result) { const job = jobs.get(id); if (job) jobs.set(id, { ...job, charge, status, result }); },
    async usage(userId, day) { const own = [...jobs.values()].filter(j => j.user_id === userId); return { completed: own.filter(j => j.status === "done").length, attemptsToday: own.filter(j => j.day === day).length, estimatedCost: own.reduce((n, j) => n + j.charge, 0) }; },
  };
}
type Statement = { bind(...values: unknown[]): Statement; first<T>(): Promise<T | null>; run(): Promise<unknown> };
type Database = { prepare(sql: string): Statement };
export function d1Composer(db: Database): ComposerStore {
  return {
    get(id) { return db.prepare("SELECT * FROM composer_jobs WHERE id = ?").bind(id).first<Job>(); },
    async claim(j, cap, dailyLimit = FREE_WORKFLOWS_PER_DAY) {
      // One SQL statement: concurrent requests cannot overspend between check and reservation.
      const inserted = await db.prepare(`INSERT INTO composer_jobs (id, fingerprint, day, ip, user_id, charge, status, result)
        SELECT ?, ?, ?, ?, ?, ?, ?, NULL
        WHERE (SELECT COALESCE(SUM(charge), 0) FROM composer_jobs WHERE day = ?) + ? <= ?
        AND (? IS NULL OR (SELECT COUNT(*) FROM composer_jobs WHERE day = ? AND ip = ?) < 10)
        AND (? IS NULL OR (SELECT COUNT(*) FROM composer_jobs WHERE day = ? AND user_id = ?) < ?)
        ON CONFLICT(id) DO NOTHING RETURNING id`).bind(j.id, j.fingerprint, j.day, j.ip, j.user_id, j.charge, j.status, j.day, j.charge, cap, dailyLimit, j.day, j.ip, dailyLimit, j.day, j.user_id, dailyLimit).first<{ id: string }>();
      return !!inserted;
    },
    async finish(id, charge, status, result) { await db.prepare("UPDATE composer_jobs SET charge = ?, status = ?, result = ? WHERE id = ?").bind(charge, status, result, id).run(); },
    async usage(userId, day) {
      return await db.prepare(`SELECT COALESCE(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END), 0) AS completed,
        COALESCE(SUM(CASE WHEN day = ? THEN 1 ELSE 0 END), 0) AS attemptsToday,
        COALESCE(SUM(charge), 0) AS estimatedCost FROM composer_jobs WHERE user_id = ?`).bind(day, userId).first<ComposerUsage>() ?? { completed: 0, attemptsToday: 0, estimatedCost: 0 };
    },
  };
}
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
async function hash(s: string) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join(""); }
async function bodyOf(req: Request) {
  const reader = req.body?.getReader(); if (!reader) throw new Error("Empty request");
  const chunks: Uint8Array[] = []; let length = 0;
  for (;;) { const { value, done } = await reader.read(); if (done) break; length += value.length; if (length > 64000) { await reader.cancel(); throw new Error("Request too large"); } chunks.push(value); }
  const bytes = new Uint8Array(length); let at = 0; for (const chunk of chunks) { bytes.set(chunk, at); at += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function handleComposer(req: Request, library: Library | (() => Promise<Library>), env: ComposerEnv, store: ComposerStore | null, ip: string, runner = callModel, userId: string | null = null): Promise<Response> {
  const approved = new Map([["gpt-6-luna", "GPT-6 Luna"], ["gpt-6.1-sol", "GPT-6.1 Sol"], ["claude-haiku-5-5", "Claude Haiku"]]);
  const defaultModel = env.WORKFLOW_DEFAULT_MODEL || "gpt-6-luna";
  const models = [...approved].map(([id, label]) => { const m = MODELS.find(m => m.id === id)!; return { id, label, available: env.WORKFLOW_COMPOSER_ENABLED === "true" && !!store && !!env[KEY_NAMES[m.provider]] }; });
  if (req.method === "GET") return json(200, { enabled: models.some(m => m.available), defaultModel, models });
  if (req.method !== "POST") return json(405, { error: "Use POST to create a workflow." });
  if (!userId) return json(401, { error: "Sign in to generate a free AI workflow." });
  if (req.headers.get("origin") && req.headers.get("origin") !== new URL(req.url).origin) return json(403, { error: "Open the composer on this site." });
  if (!req.headers.get("content-type")?.includes("application/json")) return json(415, { error: "Send a JSON request." });
  let body: any; try { body = await bodyOf(req); } catch { return json(400, { error: "The request is invalid or too large." }); }
  if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.goal !== "string" || typeof body.context !== "string" || body.context.length > LIMITS.context) return json(400, { error: `Provide a request and keep context within ${LIMITS.context.toLocaleString("en-US")} characters.` });
  const error = requestError(body.goal); if (error) return json(400, { error });
  if (body.model !== undefined && (typeof body.model !== "string" || !approved.has(body.model))) return json(400, { error: "Choose one of the available workflow models." });
  if (body.assignMinds !== undefined && typeof body.assignMinds !== "boolean") return json(400, { error: "Choose whether to assign mind perspectives." });
  const assignMinds = body.assignMinds !== false;
  const model = MODELS.find(m => m.id === (body.model ?? defaultModel) && approved.has(m.id));
  const available = models.some(m => m.id === model?.id && m.available);
  let choices: Choices;
  try { choices = validateChoices(body.choices ?? {}); } catch { return json(400, { error: "Choose one of the supplied workflow options." }); }
  if (!available || !model || !store) return json(503, { error: "AI composition is not connected yet. Free assembly is ready to use." });
  const requestId = req.headers.get("idempotency-key") ?? "";
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(requestId)) return json(400, { error: "Start a new workflow request." });
  const id = await hash(JSON.stringify([userId, requestId]));
  const fingerprint = await hash(JSON.stringify([body.goal, body.context, choices, model.id, assignMinds]));
  const ipHash = await hash((env.WORKFLOW_SALT || "local-development") + ip);
  const previous = await store.get(id);
  if (previous) {
    if (previous.fingerprint !== fingerprint || previous.user_id !== userId) return json(409, { error: "That request ID has already been used." });
    if (previous.status === "done" && previous.result) return json(200, JSON.parse(previous.result));
    return json(409, { error: "That request has already started. Use free assembly or start a new request after it finishes." });
  }
  const c = typeof library === "function" ? await library() : library;
  const reserve = semanticReservation(c, body.goal, body.context, choices, model, assignMinds);
  const cap = dailyBudget(env);
  if (!Number.isFinite(cap) || cap <= 0 || !await store.claim({ id, fingerprint, ip: ipHash, user_id: userId, day: new Date().toISOString().slice(0, 10), charge: reserve, status: "pending", result: null }, cap, accountAttemptLimit(env, userId))) return json(429, { error: "The daily allowance is reached. Free assembly is still available." });
  let result: ModelResult | undefined;
  try {
    const planned = await semanticWorkflow(c, body.goal, body.context, choices, model, env[KEY_NAMES[model.provider]]!, runner, assignMinds);
    result = planned.result;
    const candidates = planned.candidates;
    const plan = finalize(c, JSON.parse(result.text), "ai", new Set(candidates.map(b => b.slug)), assignMinds);
    // The application owns the question policy. Model suggestions cannot introduce unrelated fields.
    const { questionsFor } = await import("../lib/composer-core.ts");
    plan.questionIds = questionsFor(body.goal, choices, body.context);
    const out = { plan, model: model.id, cost: result.cost, usage: result.usage, latencyMs: result.latencyMs };
    await store.finish(id, result.cost, "done", JSON.stringify(out));
    return json(200, out);
  } catch (e: any) {
    // Retain the reservation for transport errors with unknown billing; known usage is always charged.
    await store.finish(id, result?.cost ?? e.billable?.cost ?? (e.unbilled ? 0 : reserve), "failed", null);
    if (["credit_balance_exhausted", "insufficient_quota"].includes(e.providerCode)) return json(503, { error: "AI composition is temporarily unavailable because the provider allowance is exhausted. You can still use free assembly." });
    return json(502, { error: result ? "The service returned a workflow we could not validate. Try free assembly." : "AI composition could not finish this request. Try free assembly." });
  }
}
export { decodeCatalogue };
