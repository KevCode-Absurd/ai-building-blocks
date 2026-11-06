// Quality checks and blind tests. Owner: evaluation module.
//
// checkDraft          rubric judge (a different provider than the writer, quoting the draft) + policy rules -> scores
// compareWithBaseline pairwise judge, run twice with the order swapped; a winner only when both orders agree
// afterJobDraft       sampled plain-AI baseline for a job's first draft, then a blind test for reviewers
// blind tests         reviewers pick A, B or "about the same"; a_source / b_source never leave the server
import { z } from "zod";
import type { Env } from "../../env.ts";
import type { BaselineResult, CriterionResult, PolicyResult, RubricCriterion, RubricResult } from "../../core/types.ts";
import { callModel, ModelError, parseModelJson, type ModelRequest, type ModelResponse, type Provider } from "../../core/models.ts";
import { all, first, newId, nowIso, parseJson } from "../../core/db.ts";
import { eventStatement, recordEvent } from "../../core/events.ts";
import { fail } from "../../core/http.ts";
import { getJob } from "../../core/jobs.ts";
import { getJobType } from "../catalogue/index.ts";
import { runBaseline } from "../runner/service.ts";
import { PAIRWISE_SCHEMA, PAIRWISE_SYSTEM, POLICY_SCHEMA, POLICY_SYSTEM, RUBRIC_SCHEMA, RUBRIC_SYSTEM, pairwisePrompt, policyPrompt, rubricPrompt } from "./prompts.ts";
import { POLICY_FIX, knownFrom, normalizeText, placeholdersExpected, runPolicyRules, type Known, type PolicyCode } from "./policy.ts";

/** A draft passes the rubric when every critical criterion passes and the weighted score reaches this. */
export const PASS_THRESHOLD = 0.75;
/** Reviewers needed before a blind test closes. */
export const DEFAULT_JUDGMENTS_NEEDED = 3;
const MAX_JUDGED_CHARS = 60_000;

interface DraftRow { id: string; job_id: string | null; run_id: string; content: string; format: string; version: number; created_at: string }
interface BlindTestRow {
  id: string; job_type_id: string; job_id: string | null; agent_id: string | null; agent_version: number | null; brief: string;
  a_draft_id: string; b_draft_id: string; a_source: "agent" | "baseline"; b_source: "agent" | "baseline";
  judgments_needed: number; status: "open" | "closed"; created_at: string; closed_at: string | null;
}
export type Pick = "a" | "b" | "tie";
type Outcome = "agent" | "baseline" | "tie";

const errText = (err: unknown) => (err instanceof Error ? err.message : String(err));

async function loadDraft(env: Env, draftId: string): Promise<DraftRow> {
  const row = await first<DraftRow>(env.DB, "SELECT id, job_id, run_id, content, format, version, created_at FROM drafts WHERE id = ?", draftId);
  if (!row) throw new Error(`evaluation: draft ${draftId} not found`);
  return row;
}

/** The writer's provider family for a run, from its logged model calls, so the judge can avoid it. */
async function writerProviderFor(env: Env, runId: string): Promise<Provider | undefined> {
  const row = await first<{ provider: string }>(env.DB,
    "SELECT provider FROM model_calls WHERE run_id = ? AND ok = 1 AND provider IN ('anthropic','openai','gemini') AND purpose NOT LIKE 'evaluation.%' ORDER BY created_at DESC LIMIT 1", runId);
  return (row?.provider as Provider | undefined) ?? undefined;
}

/** Ask a judge for JSON and validate it. One retry on a broken or invalid reply; other errors (daily cap, no provider) are thrown. */
async function askJson<T>(env: Env, req: ModelRequest, parse: (data: unknown) => T): Promise<{ value: T; res: ModelResponse; cost: number; attempts: number }> {
  let cost = 0;
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    let res: ModelResponse;
    try {
      res = await callModel(env, req);
    } catch (err) {
      if (err instanceof ModelError && (err.retryable || err.code === "bad_json")) { lastError = err; continue; }
      throw err;
    }
    cost += res.costMicroUsd;
    try {
      const data = res.data !== undefined ? res.data : parseModelJson(res.text);
      return { value: parse(data), res, cost, attempts: attempt };
    } catch (err) {
      lastError = err;
    }
  }
  throw new ModelError("judge_failed", `The ${req.purpose} judge did not give a usable answer: ${errText(lastError)}`, true);
}

const looseText = z.string().nullish().transform(v => (v ?? "").trim());
const passValue = z.union([z.boolean(), z.enum(["pass", "fail", "true", "false", "yes", "no"])]).transform(v => v === true || v === "pass" || v === "true" || v === "yes");

export const RubricReply = z.object({
  criteria: z.array(z.object({ id: z.string().trim().min(1), pass: passValue, evidence: looseText, note: looseText })),
});
export type RubricReplyItem = z.infer<typeof RubricReply>["criteria"][number];

const PairwiseReply = z.object({ winner: z.string(), reason: looseText }).transform((v, ctx) => {
  const w = v.winner.trim().toLowerCase().replace(/^draft\s*/, "");
  const winner: Pick | null = w === "a" ? "a" : w === "b" ? "b" : /^(tie|same|equal|neither|both|about the same)$/.test(w) ? "tie" : null;
  if (!winner) { ctx.addIssue({ code: "custom", message: `winner must be A, B or tie, not ${v.winner}` }); return z.NEVER; }
  return { winner, reason: v.reason };
});

const PolicyReply = z.object({ flags: z.array(z.object({ excerpt: looseText, reason: looseText })) });

// ---------- Rubric scoring ----------

/** True when every quoted part of the evidence is in the draft (case, spacing, quotes and markdown marks ignored). */
export function evidenceInDraft(evidence: string, draft: string): boolean {
  const norm = normalizeText(evidence);
  const quoted = [...norm.matchAll(/"([^"]{4,})"/g)].map(m => m[1]);
  const parts = (quoted.length ? quoted : norm.split(/\.{3}|…/))
    .map(p => p.replace(/^[\s"'.,;:!?()-]+|[\s"'.,;:!?()-]+$/g, ""))
    .filter(p => p.length >= 4);
  if (!parts.length) return false;
  const body = normalizeText(draft);
  return parts.every(p => body.includes(p));
}

/** Turn judge replies into a result: missing criteria fail, passes without a real quote fail, weighted score, critical rule. */
export function scoreRubric(rubric: RubricCriterion[], replies: RubricReplyItem[], draft: string): RubricResult {
  const byId = new Map<string, RubricReplyItem>();
  for (const r of replies) if (!byId.has(r.id)) byId.set(r.id, r);
  const criteria: CriterionResult[] = rubric.map(c => {
    const r = byId.get(c.id);
    if (!r) return { id: c.id, pass: false, evidence: "", note: "The checker did not score this item, so it counts as not met." };
    const evidence = r.evidence.slice(0, 500);
    if (r.pass && !evidenceInDraft(evidence, draft)) {
      return { id: c.id, pass: false, evidence, note: `The checker said this was met but did not quote the draft to show it, so it counts as not met.${r.note ? ` Checker's note: ${r.note}` : ""}` };
    }
    return { id: c.id, pass: r.pass, evidence, note: r.note };
  });
  const weight = (c: RubricCriterion) => (Number.isFinite(c.weight) && c.weight > 0 ? c.weight : 1);
  const total = rubric.reduce((s, c) => s + weight(c), 0);
  const got = rubric.reduce((s, c, i) => s + (criteria[i].pass ? weight(c) : 0), 0);
  const score = total > 0 ? Math.round((got / total) * 10_000) / 10_000 : 1;
  const criticalOk = rubric.every((c, i) => !c.critical || criteria[i].pass);
  return { criteria, passed: criticalOk && score >= PASS_THRESHOLD, score };
}

/** Plain instructions for a rerun: each failed criterion and each policy flag, with what to do. Empty when nothing failed. */
export function buildFeedback(rubric: RubricCriterion[], result: RubricResult, policy: PolicyResult): string {
  const failed = result.criteria.filter(c => !c.pass);
  if (!failed.length && !policy.flags.length) return "";
  const lines = ["The draft did not pass every check. Fix the points below and keep everything that already works."];
  if (failed.length) {
    lines.push("", "Checklist items that are not met:");
    for (const c of failed) {
      const crit = rubric.find(x => x.id === c.id);
      const parts = [`- ${c.id}${crit?.critical ? " (must pass)" : ""}:`];
      if (crit) parts.push(`${crit.text} Rule: ${crit.pass_rule}`);
      if (c.note) parts.push(`What is wrong: ${c.note}`);
      lines.push(parts.join(" "));
    }
    if (result.score < PASS_THRESHOLD) lines.push(`The draft meets ${Math.round(result.score * 100)}% of the checklist by weight. It needs at least ${Math.round(PASS_THRESHOLD * 100)}%.`);
  }
  if (policy.flags.length) {
    lines.push("", "Problems in the text:");
    for (const f of policy.flags) lines.push(`- ${f.code}: ${f.message} Found: "${f.excerpt}". ${POLICY_FIX[f.code as PolicyCode] ?? ""}`.trimEnd());
  }
  return lines.join("\n");
}

// ---------- checkDraft ----------

interface BriefRow { request_text: string; spec: string; answers: string }

async function briefFor(env: Env, jobId: string | null): Promise<{ request: string; spec: Record<string, unknown> } | null> {
  if (!jobId) return null;
  const row = await first<BriefRow>(env.DB, "SELECT request_text, spec, answers FROM briefs WHERE job_id = ?", jobId);
  if (!row) return null;
  return { request: row.request_text, spec: { ...parseJson<Record<string, unknown>>(row.answers, {}), ...parseJson<Record<string, unknown>>(row.spec, {}) } };
}

/** The brief as one readable text: the buyer's words, then the details they gave. Shown to judges and reviewers. */
export function composeBrief(requestText: string, spec: Record<string, unknown>, jobTypeId: string | null): string {
  const labels = new Map((getJobType(jobTypeId)?.spec_fields ?? []).map(f => [f.id, f.label]));
  const show = (v: unknown): string => Array.isArray(v) ? v.map(show).join("; ") : v && typeof v === "object" ? JSON.stringify(v) : String(v);
  const details = Object.entries(spec)
    .filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => `- **${labels.get(k) ?? k.replace(/_/g, " ")}** ${show(v)}`);
  const text = requestText.trim();
  return details.length ? `${text}\n\n**Details**\n\n${details.join("\n")}` : text;
}

function scoreRow(db: D1Database, s: { draftId: string; judge: "rubric" | "policy" | "baseline" | "human"; judgeModel: string | null; passed: boolean; score: number | null; result: unknown; cost: number; createdBy: string }, at: string) {
  return db.prepare("INSERT INTO scores (id, draft_id, judge, judge_model, passed, score, result, cost_micro_usd, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(newId("score"), s.draftId, s.judge, s.judgeModel, s.passed ? 1 : 0, s.score, JSON.stringify(s.result), s.cost, s.createdBy, at);
}

type PolicyFlagRow = PolicyResult["flags"][number];

async function modelPolicyFlags(env: Env, input: { draft: string; brief: string; known: Known; notFor: string[]; jobId?: string; runId?: string }): Promise<{ flags: PolicyFlagRow[]; model: string | null; cost: number; error: string | null }> {
  try {
    const out = await askJson(env, {
      purpose: "evaluation.policy", tier: "small", system: POLICY_SYSTEM,
      prompt: policyPrompt({ brief: input.brief, draft: input.draft, notFor: input.notFor }),
      json: true, schema: POLICY_SCHEMA, maxTokens: 1200, temperature: 0, jobId: input.jobId, runId: input.runId,
    }, data => PolicyReply.parse(data));
    const flags = out.value.flags
      // The quote must really be in the draft, and must not be something the buyer gave us.
      .filter(f => f.excerpt.length >= 3 && evidenceInDraft(f.excerpt, input.draft) && !input.known.norm.includes(normalizeText(f.excerpt)))
      .slice(0, 10)
      .map(f => ({ code: "unsupported_claim", message: f.reason ? `The brief does not support this. ${f.reason}` : "The brief does not support this.", excerpt: f.excerpt.slice(0, 200) }));
    return { flags, model: `${out.res.provider}:${out.res.model}`, cost: out.cost, error: null };
  } catch (err) {
    // The model check is a second net; the rules still apply when it is down.
    console.warn("evaluation.policy model check skipped", errText(err));
    return { flags: [], model: null, cost: 0, error: errText(err) };
  }
}

/**
 * Score one draft: rubric judge (a model from a different provider than the writer, quoting evidence per criterion)
 * plus policy checks. Writes rows to scores. feedback = plain instructions for a rerun when it fails.
 * Throws when the judge cannot give a usable answer after one retry (or the daily model cap is reached).
 * writerProvider defaults to the provider logged for the draft's run. modelPolicy: false skips the small-model claim check.
 */
export async function checkDraft(env: Env, input: { draftId: string; rubric: RubricCriterion[]; jobTypeId: string; brief: string; writerProvider?: Provider; spec?: Record<string, unknown>; modelPolicy?: boolean }): Promise<{ passed: boolean; rubric: RubricResult; policy: PolicyResult; feedback: string }> {
  const db = env.DB;
  const draft = await loadDraft(env, input.draftId);
  const jobType = getJobType(input.jobTypeId);
  const stored = await briefFor(env, draft.job_id);
  const known = knownFrom(input.brief, stored?.request, JSON.stringify(stored?.spec ?? {}), JSON.stringify(input.spec ?? {}));
  const avoidProvider = input.writerProvider ?? (await writerProviderFor(env, draft.run_id));
  const content = draft.content.slice(0, MAX_JUDGED_CHARS);
  const jobId = draft.job_id ?? undefined, runId = draft.run_id;

  const judge = input.rubric.length
    ? askJson(env, {
      purpose: "evaluation.rubric", tier: "judge", system: RUBRIC_SYSTEM,
      prompt: rubricPrompt({ brief: input.brief, rubric: input.rubric, draft: content, jobTitle: jobType?.title }),
      json: true, schema: RUBRIC_SCHEMA, maxTokens: 2500, temperature: 0, avoidProvider, jobId, runId,
    }, data => RubricReply.parse(data))
    : Promise.resolve(null);
  const allowPlaceholders = placeholdersExpected(input.brief, jobType?.baseline_prompt, jobType?.deliverable, ...input.rubric.map(c => `${c.text} ${c.pass_rule}`));
  const ruleFlags = runPolicyRules(draft.content, known, { allowPlaceholders });
  const modelCheck = input.modelPolicy === false
    ? Promise.resolve({ flags: [] as PolicyFlagRow[], model: null, cost: 0, error: null })
    : modelPolicyFlags(env, { draft: content, brief: input.brief, known, notFor: jobType?.not_for ?? [], jobId, runId });

  const [judged, model] = await Promise.all([judge, modelCheck]);
  const rubric = scoreRubric(input.rubric, judged?.value.criteria ?? [], draft.content);
  const flags = [...ruleFlags, ...model.flags];
  const policy: PolicyResult = { passed: flags.length === 0, flags };
  const passed = rubric.passed && policy.passed;
  const feedback = buildFeedback(input.rubric, rubric, policy);

  const now = nowIso();
  const judgeModel = judged ? `${judged.res.provider}:${judged.res.model}` : null;
  await db.batch([
    scoreRow(db, {
      draftId: draft.id, judge: "rubric", judgeModel, passed: rubric.passed, score: rubric.score, cost: judged?.cost ?? 0, createdBy: "system",
      result: { ...rubric, threshold: PASS_THRESHOLD, avoided_provider: avoidProvider ?? null, attempts: judged?.attempts ?? 0 },
    }, now),
    scoreRow(db, {
      draftId: draft.id, judge: "policy", judgeModel: model.model ? `rules+${model.model}` : "rules", passed: policy.passed, score: null, cost: model.cost, createdBy: "system",
      result: { ...policy, model_check: model.model ? "done" : input.modelPolicy === false ? "off" : "skipped", model_error: model.error },
    }, now),
    eventStatement(db, {
      actor: "system", actorKind: "system", entity: "draft", entityId: draft.id, type: "draft.checked",
      data: { jobId: draft.job_id, passed, score: rubric.score, failed: rubric.criteria.filter(c => !c.pass).map(c => c.id), flags: policy.flags.map(f => f.code) },
    }, now),
  ]);
  return { passed, rubric, policy, feedback };
}

// ---------- compareWithBaseline ----------

/** Pairwise judge: agent draft vs plain-AI draft on the same brief, judged twice with the order swapped. Writes a 'baseline' score. */
export async function compareWithBaseline(env: Env, input: { agentDraftId: string; baselineDraftId: string; rubric: RubricCriterion[]; brief: string; writerProvider?: Provider }): Promise<BaselineResult> {
  const db = env.DB;
  const [agent, baseline] = await Promise.all([loadDraft(env, input.agentDraftId), loadDraft(env, input.baselineDraftId)]);
  const avoidProvider = input.writerProvider ?? (await writerProviderFor(env, agent.run_id));
  const ask = (a: DraftRow, b: DraftRow) => askJson(env, {
    purpose: "evaluation.pairwise", tier: "judge", system: PAIRWISE_SYSTEM,
    prompt: pairwisePrompt({ brief: input.brief, rubric: input.rubric, a: a.content.slice(0, MAX_JUDGED_CHARS), b: b.content.slice(0, MAX_JUDGED_CHARS) }),
    json: true, schema: PAIRWISE_SCHEMA, maxTokens: 600, temperature: 0, avoidProvider, jobId: agent.job_id ?? undefined, runId: agent.run_id,
  }, data => PairwiseReply.parse(data));

  const [agentFirst, baselineFirst] = await Promise.all([ask(agent, baseline), ask(baseline, agent)]);
  const o1: Outcome = agentFirst.value.winner === "a" ? "agent" : agentFirst.value.winner === "b" ? "baseline" : "tie";
  const o2: Outcome = baselineFirst.value.winner === "a" ? "baseline" : baselineFirst.value.winner === "b" ? "agent" : "tie";
  const winner: Outcome = o1 === o2 ? o1 : "tie";
  const reasons = [
    o1 === o2 ? "" : "The two orders disagreed, so this counts as a tie.",
    `With the agent's draft shown first: ${agentFirst.value.reason || "no reason given."}`,
    `With plain AI's draft shown first: ${baselineFirst.value.reason || "no reason given."}`,
  ].filter(Boolean).join(" ");
  const result: BaselineResult = { winner, reasons, orders: [o1, o2] };

  const now = nowIso();
  await db.batch([
    scoreRow(db, {
      draftId: agent.id, judge: "baseline", judgeModel: `${agentFirst.res.provider}:${agentFirst.res.model}`,
      passed: winner !== "baseline", score: winner === "agent" ? 1 : winner === "tie" ? 0.5 : 0, cost: agentFirst.cost + baselineFirst.cost, createdBy: "system",
      result: {
        ...result, agent_draft_id: agent.id, baseline_draft_id: baseline.id, avoided_provider: avoidProvider ?? null,
        verdicts: [
          { shown_first: "agent", pick: agentFirst.value.winner, outcome: o1, reason: agentFirst.value.reason },
          { shown_first: "baseline", pick: baselineFirst.value.winner, outcome: o2, reason: baselineFirst.value.reason },
        ],
      },
    }, now),
    eventStatement(db, {
      actor: "system", actorKind: "system", entity: "draft", entityId: agent.id, type: "draft.compared",
      data: { jobId: agent.job_id, baselineDraftId: baseline.id, winner, orders: [o1, o2] },
    }, now),
  ]);
  return result;
}

// ---------- afterJobDraft ----------

/** BASELINE_SAMPLE_RATE as a share from 0 to 1 ("1" = always, "0.2" or "20%" = one job in five). Anything else = 0. */
export function sampleRate(value: string | undefined): number {
  const raw = (value ?? "").trim();
  if (!raw) return 0;
  const n = raw.endsWith("%") ? Number(raw.slice(0, -1)) / 100 : Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/**
 * After a job draft is written: with probability BASELINE_SAMPLE_RATE, run the baseline, compare, and open a blind test.
 * Only the job's first draft counts (not revisions), and the sampling decision is made once per job (idempotent).
 * Never throws: failures are logged and return null.
 */
export async function afterJobDraft(env: Env, input: { jobId: string; draftId: string }): Promise<{ blindTestId: string | null }> {
  const none = { blindTestId: null };
  const db = env.DB;
  try {
    const existing = await first<{ id: string }>(db, "SELECT id FROM blind_tests WHERE job_id = ? ORDER BY created_at, id LIMIT 1", input.jobId);
    if (existing) return { blindTestId: existing.id };
    const job = await getJob(env, input.jobId);
    if (!job?.job_type_id) return none;
    const draft = await first<{ id: string; job_id: string | null; kind: string; agent_id: string | null; agent_version: number | null }>(db,
      "SELECT d.id, d.job_id, r.kind, r.agent_id, r.agent_version FROM drafts d JOIN runs r ON r.id = d.run_id WHERE d.id = ?", input.draftId);
    if (!draft || draft.job_id !== job.id || draft.kind !== "job") return none;
    // The first draft: nothing has gone back for a revision yet.
    if (await first(db, "SELECT 1 AS x FROM runs WHERE job_id = ? AND kind = 'revision' LIMIT 1", job.id)) return none;
    const agentId = draft.agent_id ?? job.agent_id;
    const agentVersion = draft.agent_version ?? job.agent_version;
    if (!agentId || agentVersion === null || agentVersion === undefined) return none;
    const stored = await briefFor(env, job.id);
    if (!stored) return none;

    const rate = sampleRate(env.BASELINE_SAMPLE_RATE);
    const sampled = rate >= 1 || (rate > 0 && Math.random() < rate);
    // Decide once per job: the event row is the claim, written only if no decision exists yet.
    const claim = await db.prepare(
      "INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, 'system', 'system', 'job', ?, 'baseline.sample_decided', ? " +
      "WHERE NOT EXISTS (SELECT 1 FROM events WHERE entity = 'job' AND entity_id = ? AND type = 'baseline.sample_decided')")
      .bind(nowIso(), job.id, JSON.stringify({ sampled, rate, draftId: draft.id }), job.id).run();
    if (!claim.meta?.changes) {
      const made = await first<{ id: string }>(db, "SELECT id FROM blind_tests WHERE job_id = ? ORDER BY created_at, id LIMIT 1", job.id);
      return { blindTestId: made?.id ?? null };
    }
    if (!sampled) return none;

    const rubric = parseJson<RubricCriterion[]>((await first<{ criteria: string }>(db, "SELECT criteria FROM rubrics WHERE job_id = ?", job.id))?.criteria, []);
    const fullBrief = composeBrief(stored.request, stored.spec, job.job_type_id);
    const base = await runBaseline(env, { jobTypeId: job.job_type_id, brief: stored.request, spec: stored.spec, rubric, jobId: job.id });
    try {
      await compareWithBaseline(env, { agentDraftId: draft.id, baselineDraftId: base.draftId, rubric, brief: fullBrief });
    } catch (err) {
      // The reviewers' test still opens when the model comparison fails.
      console.error("evaluation.compareWithBaseline failed", job.id, errText(err));
      await recordEvent(db, { actor: "system", actorKind: "system", entity: "job", entityId: job.id, type: "baseline.compare_failed", data: { error: errText(err) } }).catch(() => {});
    }
    const { testId } = await createBlindTest(env, {
      jobTypeId: job.job_type_id, jobId: job.id, agentId, agentVersion, brief: fullBrief, agentDraftId: draft.id, baselineDraftId: base.draftId,
    });
    return { blindTestId: testId };
  } catch (err) {
    console.error("evaluation.afterJobDraft failed", input.jobId, errText(err));
    await recordEvent(db, { actor: "system", actorKind: "system", entity: "job", entityId: input.jobId, type: "baseline.failed", data: { draftId: input.draftId, error: errText(err) } }).catch(() => {});
    return none;
  }
}

// ---------- Blind tests ----------

/** Open a blind test: the two drafts shown unlabelled, in random order, to reviewers. */
export async function createBlindTest(env: Env, input: { jobTypeId: string; jobId?: string; agentId: string; agentVersion: number; brief: string; agentDraftId: string; baselineDraftId: string; judgmentsNeeded?: number }): Promise<{ testId: string }> {
  const db = env.DB, now = nowIso();
  const agentIsA = Math.random() < 0.5;
  const id = newId("bt");
  const needed = Math.max(1, Math.floor(input.judgmentsNeeded ?? DEFAULT_JUDGMENTS_NEEDED));
  await db.batch([
    db.prepare("INSERT INTO blind_tests (id, job_type_id, job_id, agent_id, agent_version, brief, a_draft_id, b_draft_id, a_source, b_source, judgments_needed, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)")
      .bind(id, input.jobTypeId, input.jobId ?? null, input.agentId, input.agentVersion, input.brief,
        agentIsA ? input.agentDraftId : input.baselineDraftId, agentIsA ? input.baselineDraftId : input.agentDraftId,
        agentIsA ? "agent" : "baseline", agentIsA ? "baseline" : "agent", needed, now),
    eventStatement(db, {
      actor: "system", actorKind: "system", entity: "blind_test", entityId: id, type: "blind_test.created",
      data: { jobId: input.jobId ?? null, jobTypeId: input.jobTypeId, agentId: input.agentId, agentVersion: input.agentVersion, judgmentsNeeded: needed },
    }, now),
  ]);
  return { testId: id };
}

/** The majority pick: the single most common pick; a draw for first place is a tie. */
export function majorityPick(picks: Pick[]): Pick {
  const n = { a: 0, b: 0, tie: 0 };
  for (const p of picks) n[p]++;
  const top = Math.max(n.a, n.b, n.tie);
  const leaders = (Object.keys(n) as Pick[]).filter(k => n[k] === top);
  return leaders.length === 1 ? leaders[0] : "tie";
}

const outcomeOf = (pick: Pick, row: { a_source: Outcome; b_source: Outcome }): Outcome =>
  pick === "a" ? row.a_source : pick === "b" ? row.b_source : "tie";

interface ClosedOutcome { test: BlindTestRow; picks: Pick[]; majority: Pick; winner: Outcome }

async function closedOutcomes(env: Env): Promise<ClosedOutcome[]> {
  const tests = await all<BlindTestRow>(env.DB, "SELECT * FROM blind_tests WHERE status = 'closed' ORDER BY created_at, id");
  const judgments = await all<{ test_id: string; pick: Pick }>(env.DB, "SELECT j.test_id, j.pick FROM blind_judgments j JOIN blind_tests t ON t.id = j.test_id WHERE t.status = 'closed'");
  const picks = new Map<string, Pick[]>();
  for (const j of judgments) picks.set(j.test_id, [...(picks.get(j.test_id) ?? []), j.pick]);
  return tests.map(test => {
    const p = picks.get(test.id) ?? [];
    const majority = majorityPick(p);
    return { test, picks: p, majority, winner: outcomeOf(majority, test) };
  });
}

export interface WinRate { key: string; label?: string; tests: number; judgments: number; agentWins: number; baselineWins: number; ties: number; winRate: number | null }

function tally(key: string, rows: ClosedOutcome[]): WinRate {
  const agentWins = rows.filter(r => r.winner === "agent").length;
  const baselineWins = rows.filter(r => r.winner === "baseline").length;
  return {
    key, tests: rows.length, judgments: rows.reduce((s, r) => s + r.picks.length, 0), agentWins, baselineWins,
    ties: rows.length - agentWins - baselineWins,
    winRate: agentWins + baselineWins > 0 ? Math.round((agentWins / (agentWins + baselineWins)) * 10_000) / 10_000 : null,
  };
}

/** Blind-test results. winRate = agent wins / (agent wins + baseline wins) over closed tests' majority picks. */
export async function winRates(env: Env, groupBy: "all" | "agent" | "job_type"): Promise<WinRate[]> {
  const rows = await closedOutcomes(env);
  if (groupBy === "all") return [tally("all", rows)];
  const groups = new Map<string, ClosedOutcome[]>();
  for (const r of rows) {
    const key = groupBy === "agent" ? `${r.test.agent_id ?? "unknown"}:${r.test.agent_version ?? 0}` : r.test.job_type_id;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()].map(([k, v]) => tally(k, v)).sort((a, b) => b.tests - a.tests || a.key.localeCompare(b.key));
}

/** How often the model's baseline verdict matches the reviewers' majority, over closed tests that have both. */
export async function judgeAgreement(env: Env): Promise<{ tests: number; agree: number; rate: number | null }> {
  const rows = await closedOutcomes(env);
  if (!rows.length) return { tests: 0, agree: 0, rate: null };
  const scores = await all<{ draft_id: string; result: string }>(env.DB,
    "SELECT s.draft_id, s.result FROM scores s JOIN blind_tests t ON s.draft_id = CASE WHEN t.a_source = 'agent' THEN t.a_draft_id ELSE t.b_draft_id END " +
    "WHERE s.judge = 'baseline' AND t.status = 'closed' ORDER BY s.created_at, s.id");
  const model = new Map<string, Outcome>();
  for (const s of scores) {
    const winner = parseJson<{ winner?: Outcome }>(s.result, {}).winner;
    if (winner === "agent" || winner === "baseline" || winner === "tie") model.set(s.draft_id, winner);
  }
  let tests = 0, agree = 0;
  for (const r of rows) {
    const agentDraft = r.test.a_source === "agent" ? r.test.a_draft_id : r.test.b_draft_id;
    const verdict = model.get(agentDraft);
    if (!verdict || !r.picks.length) continue;
    tests++;
    if (verdict === r.winner) agree++;
  }
  return { tests, agree, rate: tests ? Math.round((agree / tests) * 10_000) / 10_000 : null };
}

// ---------- Reviewer flow (used by routes.ts) ----------

export interface ReviewerCounts { waiting: number; done: number }

export async function reviewerCounts(env: Env, reviewerId: string): Promise<ReviewerCounts> {
  const waiting = await first<{ n: number }>(env.DB,
    "SELECT COUNT(*) AS n FROM blind_tests t WHERE t.status = 'open' AND NOT EXISTS (SELECT 1 FROM blind_judgments j WHERE j.test_id = t.id AND j.reviewer_id = ?)", reviewerId);
  const done = await first<{ n: number }>(env.DB, "SELECT COUNT(*) AS n FROM blind_judgments WHERE reviewer_id = ?", reviewerId);
  return { waiting: Number(waiting?.n ?? 0), done: Number(done?.n ?? 0) };
}

/** What a reviewer sees. Only the brief and the two contents as A and B: no sources, draft ids, agents or jobs. */
export interface ReviewerTest {
  id: string;
  jobType: string | null;
  brief: string;
  a: { content: string; format: string };
  b: { content: string; format: string };
}

/** The oldest open test this reviewer has not judged, with their counts. */
export async function nextBlindTest(env: Env, reviewerId: string): Promise<{ test: ReviewerTest | null } & ReviewerCounts> {
  const row = await first<{ id: string; job_type_id: string; brief: string; a_content: string; a_format: string; b_content: string; b_format: string }>(env.DB,
    "SELECT t.id, t.job_type_id, t.brief, a.content AS a_content, a.format AS a_format, b.content AS b_content, b.format AS b_format " +
    "FROM blind_tests t JOIN drafts a ON a.id = t.a_draft_id JOIN drafts b ON b.id = t.b_draft_id " +
    "WHERE t.status = 'open' AND NOT EXISTS (SELECT 1 FROM blind_judgments j WHERE j.test_id = t.id AND j.reviewer_id = ?) " +
    "ORDER BY t.created_at, t.id LIMIT 1", reviewerId);
  const counts = await reviewerCounts(env, reviewerId);
  if (!row) return { test: null, ...counts };
  return {
    test: {
      id: row.id,
      jobType: getJobType(row.job_type_id)?.title ?? null,
      brief: row.brief,
      a: { content: row.a_content, format: row.a_format },
      b: { content: row.b_content, format: row.b_format },
    },
    ...counts,
  };
}

/** One judgment per reviewer per test. Closes the test when it has enough, and records the reviewers' verdict on the agent draft. */
export async function recordJudgment(env: Env, input: { testId: string; reviewerId: string; pick: Pick; reason: string }): Promise<{ closed: boolean }> {
  const db = env.DB;
  const test = await first<BlindTestRow>(db, "SELECT * FROM blind_tests WHERE id = ?", input.testId);
  if (!test) return fail(404, "test_not_found", "We could not find that pair. Load the next one.");
  if (test.status !== "open") return fail(409, "test_closed", "Enough people have judged this pair already. Load the next one.");
  if (await first(db, "SELECT 1 AS x FROM blind_judgments WHERE test_id = ? AND reviewer_id = ?", test.id, input.reviewerId)) {
    return fail(409, "already_judged", "You have already judged this pair. Load the next one.");
  }
  const now = nowIso();
  const res = await db.batch([
    db.prepare("INSERT INTO blind_judgments (test_id, reviewer_id, pick, reason, created_at) SELECT ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM blind_tests WHERE id = ? AND status = 'open') ON CONFLICT (test_id, reviewer_id) DO NOTHING")
      .bind(test.id, input.reviewerId, input.pick, input.reason, now, test.id),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'reviewer', 'blind_test', ?, 'blind_test.judged', ? WHERE changes() = 1")
      .bind(now, input.reviewerId, test.id, JSON.stringify({ pick: input.pick, hasReason: !!input.reason })),
    db.prepare("UPDATE blind_tests SET status = 'closed', closed_at = ? WHERE id = ? AND status = 'open' AND (SELECT COUNT(*) FROM blind_judgments WHERE test_id = ?) >= judgments_needed")
      .bind(now, test.id, test.id),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, 'system', 'system', 'blind_test', ?, 'blind_test.closed', '{}' WHERE changes() = 1")
      .bind(now, test.id),
  ]);
  if (!res[0]?.meta?.changes) return fail(409, "already_judged", "This pair changed while you were judging it. Load the next one.");
  const closed = (res[2]?.meta?.changes ?? 0) === 1;
  if (closed) await recordHumanVerdict(env, test).catch(err => console.error("evaluation.human verdict failed", test.id, errText(err)));
  return { closed };
}

async function recordHumanVerdict(env: Env, test: BlindTestRow): Promise<void> {
  const db = env.DB, now = nowIso();
  const picks = (await all<{ pick: Pick }>(db, "SELECT pick FROM blind_judgments WHERE test_id = ?", test.id)).map(r => r.pick);
  const majority = majorityPick(picks);
  const winner = outcomeOf(majority, test);
  const agentDraft = test.a_source === "agent" ? test.a_draft_id : test.b_draft_id;
  const count = (p: Pick) => picks.filter(x => x === p).length;
  await db.batch([
    scoreRow(db, {
      draftId: agentDraft, judge: "human", judgeModel: null, passed: winner !== "baseline", score: winner === "agent" ? 1 : winner === "tie" ? 0.5 : 0, cost: 0, createdBy: "reviewers",
      result: { blind_test_id: test.id, winner, majority, picks: { a: count("a"), b: count("b"), tie: count("tie") } },
    }, now),
    eventStatement(db, { actor: "system", actorKind: "system", entity: "draft", entityId: agentDraft, type: "draft.blind_judged", data: { blindTestId: test.id, winner } }, now),
  ]);
}

/** Everything the ops view needs: win rates overall, by job type and by agent, plus how often the model judge agrees with people. */
export async function reviewStats(env: Env) {
  const [allRates, byJobType, byAgent, agreement] = await Promise.all([winRates(env, "all"), winRates(env, "job_type"), winRates(env, "agent"), judgeAgreement(env)]);
  const agents = await all<{ id: string; name: string }>(env.DB, "SELECT id, name FROM agents");
  const agentName = new Map(agents.map(a => [a.id, a.name]));
  const counts = await first<{ open: number; closed: number }>(env.DB,
    "SELECT COALESCE(SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END), 0) AS open, COALESCE(SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END), 0) AS closed FROM blind_tests");
  return {
    all: allRates[0],
    byJobType: byJobType.map(r => ({ ...r, label: getJobType(r.key)?.title ?? r.key })),
    byAgent: byAgent.map(r => {
      const cut = r.key.lastIndexOf(":");
      const id = r.key.slice(0, cut), version = r.key.slice(cut + 1);
      return { ...r, label: `${agentName.get(id) ?? id} v${version}` };
    }),
    agreement,
    open: Number(counts?.open ?? 0),
    closed: Number(counts?.closed ?? 0),
  };
}
