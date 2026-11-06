// Intake and quote (the dispatcher, first version). Owner: intake module.
// Buyer's words -> job type -> spec -> at most three questions -> rubric -> fixed price -> confirmed order.
import { z } from "zod";
import type { Env } from "../../env.ts";
import type { ClarifyingQuestion, JobRow, JobType, Quote, RubricCriterion } from "../../core/types.ts";
import type { ActorKind } from "../../core/events.ts";
import { eventStatement, recordEvent } from "../../core/events.ts";
import { addHours, first, newId, nowIso, parseJson, stableJson } from "../../core/db.ts";
import { fail } from "../../core/http.ts";
import { getJob, transitionJob } from "../../core/jobs.ts";
import { callModel, parseModelJson } from "../../core/models.ts";
import { CATALOGUE_VERSION, getJobType, listJobTypes } from "../catalogue/index.ts";
import { notifyOps } from "../ops/service.ts";
import { startJobRun } from "../runner/service.ts";
import { priceFor } from "./pricing.ts";
import { CLASSIFY_SCHEMA, CLASSIFY_SYSTEM, EXTRACT_SCHEMA, EXTRACT_SYSTEM, RUBRIC_SCHEMA, RUBRIC_SYSTEM, classifyPrompt, extractPrompt, rubricPrompt } from "./prompts.ts";
import { buildQuestions, isEmpty, jobTitle, normaliseValue, openTitle, type Spec } from "./spec.ts";

export interface Classification {
  job_type_id: string | null;   // null = open request for the ops queue
  confidence: number;           // 0 to 1
  reason: string;
  alternatives: string[];       // other likely job type ids
}

/** What the brief stores: the classification plus who made it and, for open requests, the model's low-confidence guess. */
export interface StoredClassification extends Classification {
  by: "buyer" | "model" | "fallback";
  suggested_job_type_id?: string | null;
  first_guess?: string | null;
  error?: string;
}

export interface IntakeState {
  job: JobRow;
  classification: Classification;
  spec: Record<string, unknown>;
  questions: ClarifyingQuestion[];   // still unanswered; empty = ready to quote
  ready: boolean;
  /** The buyer's words, verbatim. */
  requestText?: string;
  /** The buyer's goals from the last quote ("anything else that matters?"). */
  goals?: string;
  /** Whether the last quote was a rush quote. */
  rush?: boolean;
}

/** The quote JSON stored on jobs.quote: the shared Quote plus the goals it was built from. */
export type StoredQuote = Quote & { goals: string };

/** Below this the request goes to the ops queue as an open request. */
export const CONFIDENCE_MIN = 0.55;
export const MAX_BUYER_CRITERIA = 3;
export const QUOTE_VALID_HOURS = 7 * 24;
const MIN_TEXT = 10;
const MAX_TEXT = 60000;
const MAX_GOALS = 3000;

interface BriefRow { job_id: string; request_text: string; spec: string; questions: string; answers: string; classification: string }
interface PersonaLite { id: string; name: string; title: string; profile: string }

// ---------- Small helpers ----------

function checkText(text: unknown): string {
  if (typeof text !== "string" || !text.trim()) return fail(400, "request_empty", "Tell us what you need, in a sentence or two.");
  if (text.trim().length < MIN_TEXT) return fail(400, "request_too_short", "Tell us a little more: what you need, who it is for, and any facts we should use.");
  if (text.length > MAX_TEXT) return fail(400, "request_too_long", `That is too long. Keep it under ${MAX_TEXT.toLocaleString("en-US")} characters, or paste only the parts we need.`);
  return text;
}

function checkGoals(goals: unknown): string {
  if (goals === null || goals === undefined) return "";
  if (typeof goals !== "string") return fail(400, "invalid_input", "Write what else matters as plain text.");
  const v = goals.trim();
  if (v.length > MAX_GOALS) return fail(400, "goals_too_long", `Keep this under ${MAX_GOALS.toLocaleString("en-US")} characters.`);
  return v;
}

const actorFor = (source: string): ActorKind => (source === "mcp" ? "mcp" : source === "ops" ? "ops" : "user");

async function mustJob(env: Env, jobId: string): Promise<JobRow> {
  return (await getJob(env, jobId)) ?? fail(404, "job_not_found", "We could not find that job.");
}

async function mustBrief(env: Env, jobId: string): Promise<BriefRow> {
  return (await first<BriefRow>(env.DB, "SELECT job_id, request_text, spec, questions, answers, classification FROM briefs WHERE job_id = ?", jobId))
    ?? fail(404, "request_not_found", "We could not find the request for that job.");
}

async function livePersona(env: Env, id: string): Promise<PersonaLite | null> {
  return first<PersonaLite>(env.DB, "SELECT id, name, title, profile FROM personas WHERE id = ? AND status = 'live'", id);
}

function personaJobTypes(p: PersonaLite | null): string[] {
  if (!p) return [];
  const profile = parseJson<{ outcomes?: { job_type_id?: string | null }[] }>(p.profile, {});
  return [...new Set((profile.outcomes ?? []).map(o => o.job_type_id).filter((id): id is string => !!id && !!getJobType(id)))];
}

async function alertOps(env: Env, notice: { kind: string; subject: string; text: string; link?: string }): Promise<void> {
  try { await notifyOps(env, notice); } catch (err) { console.error("intake_notify_ops_failed", err instanceof Error ? err.message : String(err)); }
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err)).slice(0, 300);

// ---------- Model steps ----------

const classificationSchema = z.object({
  job_type_id: z.string().nullable().optional(),
  confidence: z.coerce.number().min(0).max(1),
  reason: z.string().max(1000).optional().default(""),
  alternatives: z.array(z.string()).max(20).optional().default([]),
});

export async function classifyRequest(env: Env, text: string, opts: { jobId?: string; persona?: { name: string; jobTypeIds: string[] } } = {}): Promise<StoredClassification> {
  try {
    const res = await callModel(env, {
      purpose: "intake.classify", tier: "small", system: CLASSIFY_SYSTEM, prompt: classifyPrompt(listJobTypes(), text, opts.persona),
      json: true, schema: CLASSIFY_SCHEMA, maxTokens: 400, temperature: 0, jobId: opts.jobId,
    });
    const parsed = classificationSchema.safeParse(res.data ?? parseModelJson(res.text));
    if (!parsed.success) return { job_type_id: null, confidence: 0, reason: "The reply from the sorting step did not make sense.", alternatives: [], by: "fallback", error: "invalid_reply" };
    const d = parsed.data;
    const pick = d.job_type_id && getJobType(d.job_type_id) ? d.job_type_id : null;
    const alternatives = [...new Set(d.alternatives.filter(id => id !== pick && !!getJobType(id)))].slice(0, 3);
    const reason = d.reason.trim().slice(0, 300);
    if (!pick) return { job_type_id: null, confidence: d.confidence, reason, alternatives, by: "model", suggested_job_type_id: null };
    if (d.confidence < CONFIDENCE_MIN) {
      return { job_type_id: null, confidence: d.confidence, reason, alternatives: [pick, ...alternatives].slice(0, 3), by: "model", suggested_job_type_id: pick };
    }
    return { job_type_id: pick, confidence: d.confidence, reason, alternatives, by: "model" };
  } catch (err) {
    return { job_type_id: null, confidence: 0, reason: "We could not sort this request automatically.", alternatives: [], by: "fallback", error: errorText(err) };
  }
}

const extractSchema = z.object({
  fields: z.record(z.string(), z.unknown()).optional().default({}),
  questions: z.array(z.object({ field_id: z.string(), question: z.string() })).max(20).optional().default([]),
});

/** Fill spec fields only from what the buyer said. Values that do not fit their field, or numbers and links the request never states, are dropped. */
export async function extractSpec(env: Env, jt: JobType, text: string, jobId?: string): Promise<{ spec: Spec; questions: { field_id: string; question: string }[] }> {
  try {
    const res = await callModel(env, {
      purpose: "intake.extract", tier: "small", system: EXTRACT_SYSTEM, prompt: extractPrompt(jt, text),
      json: true, schema: EXTRACT_SCHEMA, maxTokens: 4000, temperature: 0, jobId,
    });
    const parsed = extractSchema.safeParse(res.data ?? parseModelJson(res.text));
    if (!parsed.success) return { spec: {}, questions: [] };
    const spec: Spec = {};
    for (const f of jt.spec_fields) {
      if (!(f.id in parsed.data.fields)) continue;
      const n = normaliseValue(f, parsed.data.fields[f.id], { mode: "extract", request: text });
      if (n.value !== undefined && !n.error) spec[f.id] = n.value;
    }
    return { spec, questions: parsed.data.questions };
  } catch {
    return { spec: {}, questions: [] };
  }
}

const criterionSchema = z.object({
  id: z.string().max(80).optional(),
  text: z.string().trim().min(10).max(300),
  pass_rule: z.string().trim().min(15).max(400),
  weight: z.coerce.number().optional(),
  critical: z.boolean().optional(),
});

/** One checklist item that carries the buyer's goals word for word, used when the rubric step fails. */
function goalsFallback(goals: string): RubricCriterion[] {
  const short = goals.replace(/\s+/g, " ").slice(0, 240);
  return [{
    id: "buyer_goal_1",
    text: `Covers what you added: "${short}"`.slice(0, 300),
    pass_rule: `A reviewer can point to where the draft does what the buyer asked here: "${short}"`.slice(0, 400),
    weight: 3, critical: false, source: "buyer",
  }];
}

/** Up to three buyer criteria from the buyer's goals (source "buyer"), each with a checkable pass rule. */
export async function rubricFromGoals(env: Env, jt: JobType, goals: string, jobId?: string): Promise<RubricCriterion[]> {
  if (!goals.trim()) return [];
  try {
    const res = await callModel(env, {
      purpose: "intake.rubric", tier: "small", system: RUBRIC_SYSTEM, prompt: rubricPrompt(jt, jt.rubric, goals),
      json: true, schema: RUBRIC_SCHEMA, maxTokens: 1200, temperature: 0, jobId,
    });
    const data = (res.data ?? parseModelJson(res.text)) as { criteria?: unknown };
    if (!data || !Array.isArray(data.criteria)) return goalsFallback(goals);
    const out: RubricCriterion[] = [];
    for (const raw of data.criteria) {
      const c = criterionSchema.safeParse(raw);
      if (!c.success) continue;
      const w = c.data.weight;
      const weight = Math.min(5, Math.max(1, Math.round(typeof w === "number" && Number.isFinite(w) ? w : 3)));
      out.push({ id: `buyer_goal_${out.length + 1}`, text: c.data.text, pass_rule: c.data.pass_rule, weight, critical: c.data.critical === true, source: "buyer" });
      if (out.length === MAX_BUYER_CRITERIA) break;
    }
    // An empty list is a valid answer (the goals repeat the checklist); a list of only broken items is not.
    return out.length || data.criteria.length === 0 ? out : goalsFallback(goals);
  } catch {
    return goalsFallback(goals);
  }
}

// ---------- Service functions ----------

/** Start from the buyer's own words. Creates a draft job and its brief (request_text kept verbatim). */
export async function startRequest(env: Env, input: { orgId: string; userId: string; text: string; source?: "web" | "mcp" | "api" | "ops"; jobTypeId?: string; personaId?: string }): Promise<IntakeState> {
  const text = checkText(input.text);
  const source = input.source ?? "web";
  const actorKind = actorFor(source);
  const persona = input.personaId ? await livePersona(env, input.personaId) : null;
  if (input.personaId && !persona) fail(404, "agent_not_found", "We could not find that agent. Pick one on the agents page, or describe the job without one.");

  const jobId = newId("job");
  let jt: JobType | null;
  let classification: StoredClassification;
  if (input.jobTypeId) {
    jt = getJobType(input.jobTypeId);
    if (!jt) return fail(400, "job_type_not_found", "We do not offer that job yet. Pick one from the list, or describe the job in your own words.");
    classification = { job_type_id: jt.id, confidence: 1, reason: persona ? `Chosen on ${persona.name}'s page.` : "Chosen by the buyer.", alternatives: [], by: "buyer" };
  } else {
    classification = await classifyRequest(env, text, { jobId, persona: persona ? { name: persona.name, jobTypeIds: personaJobTypes(persona) } : undefined });
    jt = getJobType(classification.job_type_id);
  }

  const extracted = jt ? await extractSpec(env, jt, text, jobId) : { spec: {}, questions: [] };
  const questions = jt ? buildQuestions(jt, extracted.spec, extracted.questions) : [];
  const now = nowIso(), db = env.DB;
  await db.batch([
    db.prepare("INSERT INTO jobs (id, org_id, created_by, source, status, job_type_id, persona_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?)")
      .bind(jobId, input.orgId, input.userId, source, jt?.id ?? null, persona?.id ?? null, jt ? jobTitle(jt, extracted.spec) : openTitle(text), now, now),
    db.prepare("INSERT INTO briefs (job_id, request_text, spec, questions, answers, attachments, classification, created_at, updated_at) VALUES (?, ?, ?, ?, '{}', '[]', ?, ?, ?)")
      .bind(jobId, text, JSON.stringify(extracted.spec), JSON.stringify(questions), JSON.stringify(classification), now, now),
    eventStatement(db, {
      actor: input.userId, actorKind, entity: "job", entityId: jobId, type: "job.created",
      data: { source, job_type_id: jt?.id ?? null, persona_id: persona?.id ?? null, classified_by: classification.by, confidence: classification.confidence, fields_filled: Object.keys(extracted.spec).length, questions: questions.length },
    }, now),
  ]);

  if (!jt) {
    await recordEvent(db, { actor: "system", actorKind: "system", entity: "job", entityId: jobId, type: "job.open_request", data: { confidence: classification.confidence, reason: classification.reason, alternatives: classification.alternatives, error: classification.error ?? null } });
    const guess = classification.alternatives.map(id => getJobType(id)?.title).filter(Boolean).join(", ");
    await alertOps(env, {
      kind: "intake.open_request",
      subject: "Open request: a buyer's job needs a person",
      text: `We could not match a request to a job type${guess ? ` (closest: ${guess})` : ""}. Read it, then pick a job type or reply to the buyer.\n\n"${text.slice(0, 600)}${text.length > 600 ? "..." : ""}"`,
      link: `/ops/jobs/${jobId}`,
    });
  }
  return getIntake(env, jobId);
}

/** Current intake state for a draft or quoted job. */
export async function getIntake(env: Env, jobId: string): Promise<IntakeState> {
  const job = await mustJob(env, jobId);
  const brief = await mustBrief(env, jobId);
  const stored = parseJson<StoredClassification>(brief.classification, { job_type_id: null, confidence: 0, reason: "", alternatives: [], by: "fallback" });
  const classification: Classification = { job_type_id: job.job_type_id, confidence: stored.confidence ?? 0, reason: stored.reason ?? "", alternatives: stored.alternatives ?? [] };
  const spec = parseJson<Spec>(brief.spec, {});
  const jt = getJobType(job.job_type_id);
  const asked = parseJson<ClarifyingQuestion[]>(brief.questions, []);
  const questions = jt ? asked.filter(q => isEmpty(spec[q.field_id])) : [];
  const quote = parseJson<Partial<StoredQuote>>(job.quote, {});
  return {
    job, classification, spec, questions, ready: !!jt && questions.length === 0,
    requestText: brief.request_text, goals: typeof quote.goals === "string" ? quote.goals : "", rush: quote.rush === true,
  };
}

/** What a quoted job keeps of its quote when it goes back to draft: the buyer's last rush and goals choices. */
function keptChoices(job: JobRow): string {
  const q = parseJson<Partial<StoredQuote>>(job.quote, {});
  return JSON.stringify({ goals: typeof q.goals === "string" ? q.goals : "", rush: q.rush === true });
}

const backToDraft = (job: JobRow) => ({ price_cents: null, quote_expires_at: null, turnaround_hours: null, quote: keptChoices(job) });

/** Point the request at a (different) job type: read the spec again for it and ask its questions. Answers start over. */
async function setJobType(env: Env, job: JobRow, brief: BriefRow, jt: JobType, actor: string, actorKind: ActorKind): Promise<void> {
  const db = env.DB, now = nowIso();
  const old = parseJson<StoredClassification>(brief.classification, { job_type_id: null, confidence: 0, reason: "", alternatives: [], by: "fallback" });
  const extracted = await extractSpec(env, jt, brief.request_text, job.id);
  const questions = buildQuestions(jt, extracted.spec, extracted.questions);
  const classification: StoredClassification = {
    job_type_id: jt.id, confidence: 1, reason: "Picked by the buyer.", alternatives: old.alternatives ?? [], by: "buyer",
    first_guess: old.first_guess ?? old.job_type_id ?? old.suggested_job_type_id ?? null,
  };
  const title = jobTitle(jt, extracted.spec);
  const briefValues = [JSON.stringify(extracted.spec), JSON.stringify(questions), JSON.stringify(classification), now, job.id];
  const data = { from_job_type_id: job.job_type_id, job_type_id: jt.id, questions: questions.length };
  if (job.status === "quoted") {
    await transitionJob(env, {
      jobId: job.id, to: "draft", actor, actorKind, data: { reason: "job_type_changed", ...data },
      set: { ...backToDraft(job), job_type_id: jt.id, title, catalogue_version: null },
      also: [db.prepare("UPDATE briefs SET spec = ?, questions = ?, answers = '{}', classification = ?, updated_at = ? WHERE job_id = ?").bind(...briefValues)],
    });
    return;
  }
  const res = await db.batch([
    db.prepare("UPDATE jobs SET job_type_id = ?, title = ?, updated_at = ? WHERE id = ? AND status = 'draft'").bind(jt.id, title, now, job.id),
    db.prepare("UPDATE briefs SET spec = ?, questions = ?, answers = '{}', classification = ?, updated_at = ? WHERE job_id = ? AND EXISTS (SELECT 1 FROM jobs WHERE id = ? AND status = 'draft')")
      .bind(...briefValues, job.id),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, ?, 'job', ?, 'job.job_type_set', ? WHERE changes() = 1")
      .bind(now, actor, actorKind, job.id, JSON.stringify(data)),
  ]);
  if (!res[0]?.meta?.changes) fail(409, "job_changed", "This job changed while you were working on it. Refresh and try again.");
}

/** Save answers (keyed by spec field id). Returns what is still missing. With jobTypeId, first points the request at that job type. */
export async function answerQuestions(env: Env, input: { jobId: string; userId: string; answers: Record<string, unknown>; jobTypeId?: string; actorKind?: ActorKind }): Promise<IntakeState> {
  const actorKind = input.actorKind ?? "user";
  let job = await mustJob(env, input.jobId);
  if (job.status !== "draft" && job.status !== "quoted") fail(409, "request_locked", "This job is already ordered, so its details are fixed. Open the job page to follow it.");
  let brief = await mustBrief(env, job.id);

  if (input.jobTypeId && input.jobTypeId !== job.job_type_id) {
    const next = getJobType(input.jobTypeId);
    if (!next) return fail(400, "job_type_not_found", "We do not offer that job yet. Pick one from the list.");
    await setJobType(env, job, brief, next, input.userId, actorKind);
    job = await mustJob(env, job.id);
    brief = await mustBrief(env, job.id);
  }

  const answers = input.answers ?? {};
  if (typeof answers !== "object" || Array.isArray(answers)) fail(400, "invalid_input", "Send your answers as field names and values.");
  const jt = getJobType(job.job_type_id);
  if (!jt) {
    if (Object.keys(answers).length) fail(409, "job_type_needed", "Pick the job that fits best first, then answer its questions.");
    return getIntake(env, job.id);
  }

  const errors: string[] = [];
  const clean: Spec = {};
  for (const [fieldId, raw] of Object.entries(answers)) {
    const field = jt.spec_fields.find(f => f.id === fieldId);
    if (!field) continue;
    const n = normaliseValue(field, raw, { mode: "answer" });
    if (n.error) errors.push(n.error);
    else if (n.value !== undefined) clean[fieldId] = n.value;
  }
  if (errors.length) fail(400, "invalid_answer", errors.join(" "));

  const oldSpec = parseJson<Spec>(brief.spec, {});
  const spec = { ...oldSpec, ...clean };
  if (stableJson(spec) === stableJson(oldSpec)) return getIntake(env, job.id);
  const merged = { ...parseJson<Spec>(brief.answers, {}), ...clean };
  const db = env.DB, now = nowIso();
  const briefUpdate = db.prepare("UPDATE briefs SET spec = ?, answers = ?, updated_at = ? WHERE job_id = ?").bind(JSON.stringify(spec), JSON.stringify(merged), now, job.id);
  const answered = eventStatement(db, { actor: input.userId, actorKind, entity: "job", entityId: job.id, type: "job.answered", data: { fields: Object.keys(clean) } }, now);
  if (job.status === "quoted") {
    // New details can change the price or the checklist, so the quote is built again.
    await transitionJob(env, {
      jobId: job.id, to: "draft", actor: input.userId, actorKind, data: { reason: "details_changed", fields: Object.keys(clean) },
      set: backToDraft(job), also: [briefUpdate, answered],
    });
  } else {
    await db.batch([briefUpdate, answered]);
  }
  return getIntake(env, job.id);
}

/** Write the rubric (5 template criteria + up to 3 from the buyer's goals) and price it. Moves draft -> quoted. */
export async function quoteJob(env: Env, input: { jobId: string; userId: string; rush?: boolean; goals?: string; actorKind?: ActorKind }): Promise<{ job: JobRow; quote: Quote }> {
  const actorKind = input.actorKind ?? "user";
  const state = await getIntake(env, input.jobId);
  const job = state.job;
  if (job.status !== "draft" && job.status !== "quoted") fail(409, "already_ordered", "This job is already ordered. Open the job page to follow it.");
  const jt = getJobType(job.job_type_id);
  if (!jt) return fail(409, "job_type_needed", "We need to match your request to a job first. Pick the job that fits best, or wait for our team to get back to you.");
  if (state.questions.length) fail(409, "questions_open", "Answer the questions first, then get your quote.");

  const lastGoals = state.goals ?? "";
  const goals = input.goals === undefined ? lastGoals : checkGoals(input.goals);
  const rushWanted = input.rush === undefined ? state.rush === true : input.rush === true;
  const existing = await first<{ criteria: string; frozen_at: string | null }>(env.DB, "SELECT criteria, frozen_at FROM rubrics WHERE job_id = ?", job.id);
  if (existing?.frozen_at) fail(409, "record_locked", "This checklist is locked because the job was ordered.");
  // Same goals as last time (a rush toggle, say): keep the buyer criteria instead of asking the model again.
  const buyerCriteria = existing && goals && goals === lastGoals
    ? parseJson<RubricCriterion[]>(existing.criteria, []).filter(c => c.source === "buyer").slice(0, MAX_BUYER_CRITERIA)
    : await rubricFromGoals(env, jt, goals, job.id);
  const criteria: RubricCriterion[] = [...jt.rubric.map(c => ({ ...c, source: "template" as const })), ...buyerCriteria];

  const price = priceFor(jt, state.spec, rushWanted);
  const now = nowIso();
  const quote: StoredQuote = {
    job_type_id: jt.id, catalogue_version: CATALOGUE_VERSION, price_cents: price.price_cents, currency: "usd", breakdown: price.breakdown,
    turnaround_hours: price.turnaround_hours, rush: price.rush, expires_at: addHours(now, QUOTE_VALID_HOURS), rubric: criteria, spec: state.spec, goals,
  };
  const set: Record<string, string | number | null> = {
    quote: JSON.stringify(quote), price_cents: quote.price_cents, title: jobTitle(jt, state.spec), turnaround_hours: quote.turnaround_hours,
    catalogue_version: CATALOGUE_VERSION, quote_expires_at: quote.expires_at,
  };
  const eventData = { price_cents: quote.price_cents, rush: quote.rush, turnaround_hours: quote.turnaround_hours, buyer_criteria: buyerCriteria.length };
  const db = env.DB;
  const upsertRubric = (afterUpdate: boolean) => db.prepare(
    `INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) ${afterUpdate ? "SELECT ?, ?, NULL, ?, ? WHERE changes() = 1" : "VALUES (?, ?, NULL, ?, ?)"} ` +
    "ON CONFLICT(job_id) DO UPDATE SET criteria = excluded.criteria, updated_at = excluded.updated_at WHERE rubrics.frozen_at IS NULL",
  ).bind(job.id, JSON.stringify(criteria), now, now);

  if (job.status === "draft") {
    const updated = await transitionJob(env, { jobId: job.id, to: "quoted", actor: input.userId, actorKind, data: eventData, set, also: [upsertRubric(false)] });
    return { job: updated, quote };
  }
  // Already quoted: a new price (rush toggle, new goals) without a status change.
  const cols = Object.keys(set);
  const res = await db.batch([
    db.prepare(`UPDATE jobs SET ${cols.map(c => `${c} = ?`).join(", ")}, updated_at = ? WHERE id = ? AND status = 'quoted'`).bind(...cols.map(c => set[c]), now, job.id),
    upsertRubric(true),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, ?, 'job', ?, 'job.requoted', ? WHERE changes() = 1")
      .bind(now, input.userId, actorKind, job.id, JSON.stringify(eventData)),
  ]);
  if (!res[0]?.meta?.changes) fail(409, "job_changed", "This job changed while you were working on it. Refresh and try again.");
  return { job: (await getJob(env, job.id))!, quote };
}

/** The buyer orders the quoted job: freezes the rubric, moves quoted -> confirmed, then starts the run (runner.startJobRun). */
export async function confirmOrder(env: Env, input: { jobId: string; userId: string; actorKind?: ActorKind }): Promise<JobRow> {
  const actorKind = input.actorKind ?? "user";
  const job = await mustJob(env, input.jobId);
  if (job.status === "draft") fail(409, "quote_needed", "Get your quote first, then order.");
  if (job.status === "cancelled") fail(409, "job_cancelled", "This job was cancelled. Start a new request to order again.");
  // Ordered already (a second click, say): nothing more to do.
  if (job.status !== "quoted") return job;
  const now = nowIso();
  if (!job.quote_expires_at || job.quote_expires_at <= now) fail(409, "quote_expired", "This quote has expired. Get a new quote to see the current price, then order.");
  const rubric = await first<{ job_id: string }>(env.DB, "SELECT job_id FROM rubrics WHERE job_id = ?", job.id);
  if (!rubric) fail(409, "quote_needed", "Get a new quote, then order.");

  const hours = job.turnaround_hours ?? getJobType(job.job_type_id)?.turnaround_hours ?? 48;
  const dueAt = addHours(now, hours);
  const confirmed = await transitionJob(env, {
    jobId: job.id, to: "confirmed", actor: input.userId, actorKind,
    data: { price_cents: job.price_cents, due_at: dueAt, payment: "not_required", rubric_frozen: true },
    set: { due_at: dueAt },
    also: [env.DB.prepare("UPDATE rubrics SET frozen_at = ?, updated_at = ? WHERE job_id = ? AND frozen_at IS NULL").bind(now, now, job.id)],
  });

  try {
    await startJobRun(env, { jobId: job.id, actor: input.userId, actorKind, kind: "job" });
  } catch (err) {
    // The order stands; ops starts the run by hand.
    await recordEvent(env.DB, { actor: "system", actorKind: "system", entity: "job", entityId: job.id, type: "job.start_failed", data: { error: errorText(err) } });
    await alertOps(env, {
      kind: "job.start_failed",
      subject: `A confirmed job did not start: ${confirmed.title || job.id}`,
      text: `The buyer ordered this job, but the agent run did not start (${errorText(err)}). The job is still confirmed. Start it from the ops page.`,
      link: `/ops/jobs/${job.id}`,
    });
  }
  return (await getJob(env, job.id)) ?? confirmed;
}
