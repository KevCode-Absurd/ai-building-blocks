// Expert studio: turns an expert's method into a versioned agent package. Owner: studio module.
//
// The six steps an approved expert works through (about 10 to 15 hours of their time):
//   1 Interview      question bank per job type; the interviewer asks follow-ups and drafts a playbook they edit
//   2 Examples       past work (brief, audience, result) with a rights confirmation; private, never shown to buyers
//   3 Mark up        a plain-AI draft of a public sample brief; the expert marks what they would never ship, and why
//   4 Build          playbook + examples + markup -> AgentPackage, saved as a new draft agent_versions row
//   5 Test bench     the draft next to plain AI on the public sample briefs, judged pair by pair; edits -> suggested rules -> approve/decline
//   6 Publish        the version becomes 'published' (immutable) and the agent 'testing'; ops puts it live
import { z } from "zod";
import type { Env } from "../../env.ts";
import type { AgentPackage, JobType, RubricCriterion } from "../../core/types.ts";
import type { ExpertRow } from "../../core/access.ts";
import { all, first, newId, nowIso, parseJson, sha256Hex, stableJson, today } from "../../core/db.ts";
import { eventStatement, type ActorKind } from "../../core/events.ts";
import { fail, HttpError, str, oneOf } from "../../core/http.ts";
import { callModel, parseModelJson, type ModelRequest } from "../../core/models.ts";
import { notify } from "../../core/email.ts";
import { getJobType } from "../catalogue/index.ts";
import { runAgentOnBrief, runBaseline } from "../runner/service.ts";
import { compareWithBaseline } from "../evaluation/service.ts";
import { notifyOps } from "../ops/service.ts";
import { questionBank, FOLLOW_UP_HINTS } from "./questions.ts";
import { copiedExamples, looksLikeSecret, mergeRules, normalizePackage, packageJsonSchema, validateAgentPackage, withRuleBlock } from "./package.ts";
import {
  COMPILE_SYSTEM, COMPILE_TASK, FOLLOW_UP_TASK, INTERVIEW_SYSTEM, PLAYBOOK_TASK, SUGGEST_SYSTEM, SUGGEST_TASK, withData,
  type CompileInput, type FollowUpInput, type PlaybookInput, type SuggestInput,
} from "./prompts.ts";

// ---------- Limits ----------

export const LIMITS = {
  answerChars: 6000,
  playbookChars: 20000,
  example: { title: 120, brief: 4000, audience: 300, result: 20000, notes: 1000 },
  examplesPerAgent: 12,
  exampleTotalChars: 120_000,
  marksPerAgent: 40,
  benchBriefs: 3,
  perDay: { playbook: 10, markup: 5, build: 10, bench: 6, edit: 30 },
} as const;

/** The exact sentence an expert confirms for each kind of right. Stored with the example. */
export const RIGHTS_STATEMENTS = {
  own_work: "I made this work. I have the right to use it to teach my agent, and it holds no private details I may not share.",
  client_permission: "The client agreed that I may use this work to teach my agent, and it holds no private details I may not share.",
} as const;
export type Rights = keyof typeof RIGHTS_STATEMENTS;

export const STEP_IDS = ["interview", "examples", "markup", "build", "test", "publish"] as const;
export type StepId = (typeof STEP_IDS)[number];

// ---------- Rows ----------

export interface AgentRow {
  id: string; kind: "house" | "expert"; expert_id: string | null; persona_id: string | null; job_type_id: string; name: string;
  status: "draft" | "testing" | "live" | "retired"; live_version: number | null; created_at: string; updated_at: string;
}
interface StudioRow {
  agent_id: string; expert_id: string; playbook: string; playbook_source: "none" | "ai" | "expert"; playbook_updated_at: string | null;
  markup_brief_id: string | null; markup_brief: string | null; markup_run_id: string | null; markup_draft_id: string | null; markup_draft: string | null; markup_made_at: string | null;
  created_at: string; updated_at: string;
}
interface VersionRow { agent_id: string; version: number; package: string; sha256: string; changelog: string; status: "draft" | "published"; test_results: string; created_at: string; published_at: string | null }
interface TurnRow { id: string; agent_id: string; seq: number; question_id: string; kind: "question" | "follow_up"; question: string; answer: string | null; skipped: number; created_at: string; answered_at: string | null }
interface ExampleRow { id: string; agent_id: string; title: string; brief: string; audience: string; result: string; notes: string; rights: Rights; rights_statement: string; rights_confirmed_at: string; chars: number; created_at: string }
interface MarkRow { id: string; agent_id: string; draft_id: string | null; brief_id: string | null; passage: string; reason: string; created_at: string }
interface TestRow {
  id: string; agent_id: string; version: number; bench_id: string; brief_id: string; brief: string; agent_run_id: string | null; agent_draft_id: string | null;
  baseline_run_id: string | null; baseline_draft_id: string | null; status: "done" | "failed"; error: string | null; created_by: string; created_at: string;
  /** JSON StoredVerdict (migration 0011), or null. */
  verdict: string | null;
}
interface EditRow { id: string; agent_id: string; test_id: string; version: number; original: string; edited: string; reason: string; created_by: string; created_at: string }
interface SuggestionRow { id: string; agent_id: string; edit_id: string | null; target: "style_rules" | "checklist"; text: string; why: string; status: "proposed" | "approved" | "declined"; decided_by: string | null; decided_at: string | null; applied_version: number | null; created_at: string }

// ---------- Views (what the API returns; the UI imports these as types) ----------

export interface InterviewQuestionView {
  id: string; text: string; help: string; required: boolean;
  answer: string | null; skipped: boolean; answeredAt: string | null;
  followUp: { id: string; text: string; answer: string | null; skipped: boolean } | null;
}
export interface InterviewView {
  questions: InterviewQuestionView[];
  next: { id: string; kind: "question" | "follow_up"; text: string; help: string; required: boolean; parentText?: string } | null;
  requiredLeft: number; answered: number; total: number;
  playbook: string; playbookSource: "none" | "ai" | "expert"; playbookUpdatedAt: string | null;
  canDraftPlaybook: boolean;
}
export interface ExampleView { id: string; title: string; brief: string; audience: string; result: string; notes: string; rights: Rights; rightsConfirmedAt: string; chars: number; createdAt: string }
export interface MarkView { id: string; passage: string; reason: string; createdAt: string }
export interface VersionView { version: number; status: "draft" | "published"; sha256: string; changelog: string; createdAt: string; publishedAt: string | null; tests: { done: number; failed: number; lastRunAt: string | null } }
/**
 * How a bench draft did against the plain-AI draft. done: evaluation's pairwise judge ran in both orders (a tie when the
 * orders disagree). skipped: not compared, because today's AI limit was reached or the judge gave no usable answer.
 */
export type BenchVerdict =
  | { status: "done"; winner: "agent" | "baseline" | "tie"; reasons: string; judgeModel: string | null; avoidedProvider: string | null; at: string }
  | { status: "skipped"; code: "daily_limit" | "judge_failed"; at: string };
/** Bench drafts against plain AI: judged pairs and the outcomes; skipped = pairs that could not be compared. */
export interface BenchScore { judged: number; agentWins: number; baselineWins: number; ties: number; skipped: number }
export interface TestView {
  id: string; benchId: string; briefId: string; brief: string; status: "done" | "failed"; error: string | null; createdAt: string;
  agentDraft: string | null; baselineDraft: string | null;
  verdict: BenchVerdict | null;
  edits: { id: string; edited: string; reason: string; createdAt: string }[];
}
export interface BenchView { version: number; tests: TestView[]; earlierRuns: number; vsPlainAi: BenchScore }
export interface SuggestionView { id: string; target: "style_rules" | "checklist"; text: string; why: string; status: "proposed" | "approved" | "declined"; appliedVersion: number | null; createdAt: string; editId: string | null }
export interface StepView { id: StepId; done: boolean }
export interface AgentSummary {
  id: string; name: string; status: AgentRow["status"]; liveVersion: number | null; jobTypeId: string; jobTypeTitle: string; personaId: string | null;
  latestVersion: { version: number; status: "draft" | "published"; createdAt: string } | null;
  tests: { done: number; failed: number; lastRunAt: string | null };
  stepsDone: number; current: StepId | null; createdAt: string; updatedAt: string;
}
export interface StudioDetail {
  agent: AgentSummary;
  jobType: { id: string; title: string; summary: string; deliverable: string; checklist: string[]; sampleBriefs: { id: string; text: string }[] } | null;
  steps: StepView[]; current: StepId | null;
  interview: InterviewView;
  examples: ExampleView[]; exampleChars: { used: number; max: number; count: number; maxCount: number };
  rightsStatements: typeof RIGHTS_STATEMENTS;
  markup: { briefId: string | null; brief: string | null; draft: string | null; madeAt: string | null; marks: MarkView[] };
  versions: VersionView[];
  latest: { version: number; status: "draft" | "published"; sha256: string; package: AgentPackage } | null;
  bench: BenchView | null;
  suggestions: SuggestionView[];
}

// ---------- Helpers ----------

const EXPERT: ActorKind = "expert";
const collapse = (s: string) => s.replace(/\s+/g, " ").trim();
const listWords = (items: string[]) => items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function noSecrets(...texts: string[]): void {
  if (texts.some(looksLikeSecret)) fail(400, "remove_secret", "That text looks like it has a password or key in it. Remove it, then try again.");
}

async function ownedAgent(env: Env, expertId: string, agentId: string): Promise<{ agent: AgentRow; studio: StudioRow }> {
  const agent = await first<AgentRow>(env.DB, "SELECT * FROM agents WHERE id = ? AND kind = 'expert' AND expert_id = ?", agentId, expertId);
  const studio = agent ? await first<StudioRow>(env.DB, "SELECT * FROM studio_agents WHERE agent_id = ?", agentId) : null;
  if (!agent || !studio) return fail(404, "agent_not_found", "We could not find that agent in your studio.");
  return { agent, studio };
}

function jobTypeOf(agent: AgentRow): JobType {
  return getJobType(agent.job_type_id) ?? fail(409, "job_type_gone", "This job is no longer on the menu, so this agent cannot change. Contact us if you need help.");
}

function publicBriefs(jt: JobType) { return jt.sample_briefs.filter(b => b.visibility === "public"); }

/** Daily limits per agent, counted from the event log, so model spend stays bounded. */
async function dailyLimit(env: Env, agentId: string, type: string, max: number, message: string): Promise<void> {
  const row = await first<{ n: number }>(env.DB, "SELECT COUNT(*) AS n FROM events WHERE entity = 'agent' AND entity_id = ? AND type = ? AND at >= ?", agentId, type, `${today()}T00:00:00.000Z`);
  if ((row?.n ?? 0) >= max) fail(429, "daily_limit", message);
}

/** One model call that must return JSON matching schema. Model problems become a plain 502; the daily cap passes through. */
async function askModel<T>(env: Env, req: ModelRequest, schema: z.ZodType<T>, failMessage: string): Promise<T> {
  let data: unknown;
  try {
    const res = await callModel(env, { ...req, json: true });
    data = res.data ?? parseModelJson(res.text);
  } catch (err) {
    if (err instanceof HttpError) throw err;
    console.error("studio_model_failed", req.purpose, err instanceof Error ? err.message : String(err));
    return fail(502, "model_failed", failMessage);
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) return fail(502, "model_failed", failMessage);
  return parsed.data;
}

function jobTypeBrief(jt: JobType) { return { id: jt.id, title: jt.title, deliverable: jt.deliverable }; }

async function personaFor(env: Env, expertId: string): Promise<string | null> {
  const p = await first<{ id: string }>(env.DB, "SELECT id FROM personas WHERE expert_id = ? AND kind = 'expert' ORDER BY created_at LIMIT 1", expertId);
  return p?.id ?? null;
}

// ---------- My agents ----------

async function summarize(env: Env, agent: AgentRow, studio: StudioRow | null): Promise<AgentSummary> {
  const jt = getJobType(agent.job_type_id);
  const latest = await first<VersionRow>(env.DB, "SELECT version, status, created_at FROM agent_versions WHERE agent_id = ? ORDER BY version DESC LIMIT 1", agent.id);
  const tests = latest ? await testCounts(env, agent.id, latest.version) : { done: 0, failed: 0, lastRunAt: null };
  const steps = await stepStatus(env, agent, studio, jt);
  return {
    id: agent.id, name: agent.name, status: agent.status, liveVersion: agent.live_version, jobTypeId: agent.job_type_id,
    jobTypeTitle: jt?.title ?? agent.job_type_id, personaId: agent.persona_id,
    latestVersion: latest ? { version: latest.version, status: latest.status, createdAt: latest.created_at } : null,
    tests, stepsDone: steps.filter(s => s.done).length, current: steps.find(s => !s.done)?.id ?? null,
    createdAt: agent.created_at, updatedAt: agent.updated_at,
  };
}

async function testCounts(env: Env, agentId: string, version: number) {
  const r = await first<{ done: number | null; failed: number | null; last: string | null }>(env.DB,
    "SELECT SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done, SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed, MAX(created_at) AS last FROM studio_tests WHERE agent_id = ? AND version = ?",
    agentId, version);
  return { done: r?.done ?? 0, failed: r?.failed ?? 0, lastRunAt: r?.last ?? null };
}

async function stepStatus(env: Env, agent: AgentRow, studio: StudioRow | null, jt: JobType | null): Promise<StepView[]> {
  const c = await first<{ examples: number; marks: number; versions: number; published: number; tested: number; imported: number }>(env.DB, `SELECT
      (SELECT COUNT(*) FROM studio_examples WHERE agent_id = ?1) AS examples,
      (SELECT COUNT(*) FROM studio_marks WHERE agent_id = ?1) AS marks,
      (SELECT COUNT(*) FROM studio_pack_imports WHERE agent_id = ?1) AS imported,
      (SELECT COUNT(*) FROM agent_versions WHERE agent_id = ?1) AS versions,
      (SELECT COUNT(*) FROM agent_versions WHERE agent_id = ?1 AND status = 'published') AS published,
      (SELECT COUNT(*) FROM studio_tests t WHERE t.agent_id = ?1 AND t.status = 'done'
         AND t.version = (SELECT MAX(version) FROM agent_versions WHERE agent_id = ?1)) AS tested`, agent.id);
  let interviewDone = false;
  if (studio?.playbook.trim() && jt) {
    const answered = await all<{ question_id: string }>(env.DB, "SELECT question_id FROM studio_interview_turns WHERE agent_id = ? AND kind = 'question' AND (answer IS NOT NULL OR skipped = 1)", agent.id);
    const have = new Set(answered.map(a => a.question_id));
    interviewDone = questionBank(jt).filter(q => q.required).every(q => have.has(q.id));
  } else if (studio?.playbook.trim()) interviewDone = true;
  // A trained pack (studio/import.ts) stands in for two steps: its soul, personality, knowledge and playbook for the
  // interview, and its "Rules I learned" (from test rounds against plain AI) for the marked passages.
  const imported = (c?.imported ?? 0) > 0 && !!studio?.playbook.trim();
  return [
    { id: "interview", done: interviewDone || imported },
    { id: "examples", done: (c?.examples ?? 0) > 0 },
    { id: "markup", done: (c?.marks ?? 0) > 0 || imported },
    { id: "build", done: (c?.versions ?? 0) > 0 },
    { id: "test", done: (c?.tested ?? 0) > 0 || (c?.published ?? 0) > 0 },
    { id: "publish", done: (c?.published ?? 0) > 0 },
  ];
}

/** Which studio steps an expert has done on at least one of their agents (the expert dashboard's onboarding list). */
export async function expertStudioProgress(env: Env, expertId: string): Promise<Record<StepId, boolean>> {
  const done = Object.fromEntries(STEP_IDS.map(id => [id, false])) as Record<StepId, boolean>;
  const agents = await all<AgentRow>(env.DB, "SELECT * FROM agents WHERE kind = 'expert' AND expert_id = ? ORDER BY created_at LIMIT 50", expertId);
  for (const agent of agents) {
    const studio = await first<StudioRow>(env.DB, "SELECT * FROM studio_agents WHERE agent_id = ?", agent.id);
    for (const step of await stepStatus(env, agent, studio, getJobType(agent.job_type_id))) if (step.done) done[step.id] = true;
  }
  return done;
}

export async function listMyAgents(env: Env, expert: ExpertRow): Promise<{ agents: AgentSummary[]; jobTypes: { id: string; title: string; summary: string; taken: boolean }[] }> {
  const agents = await all<AgentRow>(env.DB, "SELECT * FROM agents WHERE expert_id = ? AND kind = 'expert' ORDER BY created_at DESC", expert.id);
  const studios = new Map((await all<StudioRow>(env.DB, "SELECT * FROM studio_agents WHERE expert_id = ?", expert.id)).map(s => [s.agent_id, s]));
  const summaries = [];
  for (const a of agents) summaries.push(await summarize(env, a, studios.get(a.id) ?? null));
  const taken = new Set(agents.filter(a => a.status !== "retired").map(a => a.job_type_id));
  const jobTypes = parseJson<string[]>(expert.job_types, [])
    .map(id => getJobType(id))
    .filter((jt): jt is JobType => !!jt)
    .map(jt => ({ id: jt.id, title: jt.title, summary: jt.summary, taken: taken.has(jt.id) }));
  return { agents: summaries, jobTypes };
}

export async function createStudioAgent(env: Env, input: { expert: ExpertRow; actor: string; jobTypeId: string; name?: string }): Promise<AgentSummary> {
  const jt = getJobType(input.jobTypeId);
  if (!jt) return fail(400, "unknown_job_type", "Pick a job from the menu.");
  const approved = parseJson<string[]>(input.expert.job_types, []);
  if (!approved.includes(jt.id)) {
    const titles = approved.map(id => getJobType(id)?.title).filter(Boolean) as string[];
    return fail(403, "job_type_not_approved", titles.length
      ? `You can build agents for the jobs you were approved for: ${listWords(titles)}. To add another job, contact us.`
      : "Your expert profile has no jobs yet. Contact us and we will add the jobs you want to build for.");
  }
  const existing = await first<{ id: string }>(env.DB, "SELECT id FROM agents WHERE expert_id = ? AND job_type_id = ? AND status != 'retired'", input.expert.id, jt.id);
  if (existing) return fail(409, "agent_exists", "You already have an agent for this job. Open it from your studio to keep building.");
  const personaId = await personaFor(env, input.expert.id);
  const persona = personaId ? await first<{ name: string }>(env.DB, "SELECT name FROM personas WHERE id = ?", personaId) : null;
  const name = input.name ? str(input.name, "the agent name", { min: 2, max: 80 }) : `${persona?.name ?? input.expert.display_name}: ${jt.title}`;
  const id = newId("agt"), now = nowIso(), db = env.DB;
  await db.batch([
    db.prepare("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES (?, 'expert', ?, ?, ?, ?, 'draft', NULL, ?, ?)")
      .bind(id, input.expert.id, personaId, jt.id, name, now, now),
    db.prepare("INSERT INTO studio_agents (agent_id, expert_id, created_at, updated_at) VALUES (?, ?, ?, ?)").bind(id, input.expert.id, now, now),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: id, type: "agent.created", data: { job_type_id: jt.id, expert_id: input.expert.id, persona_id: personaId, via: "studio" } }, now),
  ]);
  const agent = (await first<AgentRow>(env.DB, "SELECT * FROM agents WHERE id = ?", id))!;
  return summarize(env, agent, null);
}

export async function getStudio(env: Env, input: { expertId: string; agentId: string; benchVersion?: number }): Promise<StudioDetail> {
  const { agent, studio } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = getJobType(agent.job_type_id);
  const [summary, steps, interview, examples, marks, versions, suggestions] = await Promise.all([
    summarize(env, agent, studio),
    stepStatus(env, agent, studio, jt),
    jt ? interviewState(env, agent.id, studio, jt) : Promise.resolve(emptyInterview(studio)),
    all<ExampleRow>(env.DB, "SELECT * FROM studio_examples WHERE agent_id = ? ORDER BY created_at", agent.id),
    all<MarkRow>(env.DB, "SELECT * FROM studio_marks WHERE agent_id = ? ORDER BY created_at", agent.id),
    all<VersionRow>(env.DB, "SELECT * FROM agent_versions WHERE agent_id = ? ORDER BY version DESC", agent.id),
    all<SuggestionRow>(env.DB, "SELECT * FROM studio_suggestions WHERE agent_id = ? ORDER BY created_at DESC", agent.id),
  ]);
  const versionViews: VersionView[] = [];
  for (const v of versions) versionViews.push({ version: v.version, status: v.status, sha256: v.sha256, changelog: v.changelog, createdAt: v.created_at, publishedAt: v.published_at, tests: await testCounts(env, agent.id, v.version) });
  const latestRow = versions[0];
  const benchVersion = input.benchVersion && versions.some(v => v.version === input.benchVersion) ? input.benchVersion : latestRow?.version;
  return {
    agent: summary,
    jobType: jt ? { id: jt.id, title: jt.title, summary: jt.summary, deliverable: jt.deliverable, checklist: jt.rubric.map(c => c.text), sampleBriefs: publicBriefs(jt).map(b => ({ id: b.id, text: b.text })) } : null,
    steps, current: steps.find(s => !s.done)?.id ?? null,
    interview,
    examples: examples.map(exampleView),
    exampleChars: { used: examples.reduce((n, e) => n + e.chars, 0), max: LIMITS.exampleTotalChars, count: examples.length, maxCount: LIMITS.examplesPerAgent },
    rightsStatements: RIGHTS_STATEMENTS,
    markup: { briefId: studio.markup_brief_id, brief: studio.markup_brief, draft: studio.markup_draft, madeAt: studio.markup_made_at, marks: marks.map(m => ({ id: m.id, passage: m.passage, reason: m.reason, createdAt: m.created_at })) },
    versions: versionViews,
    latest: latestRow ? { version: latestRow.version, status: latestRow.status, sha256: latestRow.sha256, package: parseJson<AgentPackage>(latestRow.package, null as unknown as AgentPackage) } : null,
    bench: benchVersion ? await benchState(env, agent.id, benchVersion) : null,
    suggestions: suggestions.map(suggestionView),
  };
}

const exampleView = (e: ExampleRow): ExampleView => ({ id: e.id, title: e.title, brief: e.brief, audience: e.audience, result: e.result, notes: e.notes, rights: e.rights, rightsConfirmedAt: e.rights_confirmed_at, chars: e.chars, createdAt: e.created_at });
const suggestionView = (s: SuggestionRow): SuggestionView => ({ id: s.id, target: s.target, text: s.text, why: s.why, status: s.status, appliedVersion: s.applied_version, createdAt: s.created_at, editId: s.edit_id });

// ---------- Step 1: interview ----------

function emptyInterview(studio: StudioRow): InterviewView {
  return { questions: [], next: null, requiredLeft: 0, answered: 0, total: 0, playbook: studio.playbook, playbookSource: studio.playbook_source, playbookUpdatedAt: studio.playbook_updated_at, canDraftPlaybook: false };
}

async function interviewState(env: Env, agentId: string, studio: StudioRow, jt: JobType): Promise<InterviewView> {
  const turns = await all<TurnRow>(env.DB, "SELECT * FROM studio_interview_turns WHERE agent_id = ? ORDER BY seq", agentId);
  const bank = questionBank(jt);
  const questions: InterviewQuestionView[] = bank.map(q => {
    const main = turns.find(t => t.question_id === q.id && t.kind === "question");
    const fu = turns.find(t => t.question_id === q.id && t.kind === "follow_up");
    return {
      id: q.id, text: q.text, help: q.help, required: q.required,
      answer: main?.answer ?? null, skipped: !!main?.skipped, answeredAt: main?.answered_at ?? null,
      followUp: fu ? { id: fu.id, text: fu.question, answer: fu.answer, skipped: !!fu.skipped } : null,
    };
  });
  const isDone = (q: InterviewQuestionView) => q.answer !== null || q.skipped;
  let next: InterviewView["next"] = null;
  const pendingFollowUp = questions.find(q => q.followUp && q.followUp.answer === null && !q.followUp.skipped);
  if (pendingFollowUp) {
    next = { id: pendingFollowUp.followUp!.id, kind: "follow_up", text: pendingFollowUp.followUp!.text, help: "A follow-up on your last answer. Skip it if you have nothing to add.", required: false, parentText: pendingFollowUp.text };
  } else {
    const q = questions.find(x => !isDone(x));
    if (q) next = { id: q.id, kind: "question", text: q.text, help: q.help, required: q.required };
  }
  const requiredLeft = questions.filter(q => q.required && !isDone(q)).length;
  return {
    questions, next, requiredLeft,
    answered: questions.filter(q => q.answer !== null).length, total: questions.length,
    playbook: studio.playbook, playbookSource: studio.playbook_source, playbookUpdatedAt: studio.playbook_updated_at,
    canDraftPlaybook: requiredLeft === 0,
  };
}

export async function answerInterview(env: Env, input: { expertId: string; actor: string; agentId: string; questionId: string; answer?: unknown; skip?: boolean }): Promise<InterviewView> {
  const { agent, studio } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = jobTypeOf(agent);
  const db = env.DB, now = nowIso();
  const readAnswer = () => {
    const a = str(input.answer, "your answer", { max: LIMITS.answerChars });
    if (a.length < 20) fail(400, "answer_too_short", "Write a little more. A few full sentences help your agent most.");
    noSecrets(a);
    return a;
  };
  const event = (data: Record<string, unknown>) => eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.interview_answered", data }, now);

  // A follow-up the interviewer asked.
  if (input.questionId.startsWith("turn_")) {
    const turn = await first<TurnRow>(db, "SELECT * FROM studio_interview_turns WHERE id = ? AND agent_id = ? AND kind = 'follow_up'", input.questionId, agent.id);
    if (!turn) return fail(404, "question_not_found", "We could not find that question. Reload the page.");
    const answer = input.skip ? null : readAnswer();
    await db.batch([
      db.prepare("UPDATE studio_interview_turns SET answer = ?, skipped = ?, answered_at = ? WHERE id = ?").bind(answer, input.skip ? 1 : 0, now, turn.id),
      event({ question_id: turn.question_id, kind: "follow_up", skipped: !!input.skip }),
    ]);
    return interviewState(env, agent.id, studio, jt);
  }

  // A question from the bank.
  const bank = questionBank(jt);
  const q = bank.find(b => b.id === input.questionId);
  if (!q) return fail(400, "unknown_question", "That question is not part of this interview. Reload the page.");
  if (input.skip && q.required) return fail(400, "question_required", "Your playbook needs this answer. Write a short one, and you can improve it later.");
  const answer = input.skip ? null : readAnswer();
  const existing = await first<TurnRow>(db, "SELECT * FROM studio_interview_turns WHERE agent_id = ? AND question_id = ? AND kind = 'question'", agent.id, q.id);
  if (existing) {
    await db.batch([
      db.prepare("UPDATE studio_interview_turns SET answer = ?, skipped = ?, answered_at = ? WHERE id = ?").bind(answer, input.skip ? 1 : 0, now, existing.id),
      event({ question_id: q.id, kind: "question", edited: true, skipped: !!input.skip }),
    ]);
    return interviewState(env, agent.id, studio, jt);
  }
  const seq = (await first<{ n: number }>(db, "SELECT COALESCE(MAX(seq), 0) + 1 AS n FROM studio_interview_turns WHERE agent_id = ?", agent.id))!.n;
  await db.batch([
    db.prepare("INSERT INTO studio_interview_turns (id, agent_id, seq, question_id, kind, question, answer, skipped, created_at, answered_at) VALUES (?, ?, ?, ?, 'question', ?, ?, ?, ?, ?)")
      .bind(newId("turn"), agent.id, seq, q.id, q.text, answer, input.skip ? 1 : 0, now, now),
    event({ question_id: q.id, kind: "question", skipped: !!input.skip }),
  ]);
  if (answer) await askFollowUp(env, { agent, jt, question: q.text, questionId: q.id, answer, actor: input.actor, seq: seq + 1 });
  return interviewState(env, agent.id, studio, jt);
}

/** The interviewer may ask one follow-up per question. A model problem never blocks the interview. */
async function askFollowUp(env: Env, a: { agent: AgentRow; jt: JobType; question: string; questionId: string; answer: string; actor: string; seq: number }): Promise<void> {
  const earlier = await all<{ question: string; answer: string }>(env.DB, "SELECT question, answer FROM studio_interview_turns WHERE agent_id = ? AND answer IS NOT NULL AND question_id != ? ORDER BY seq DESC LIMIT 4", a.agent.id, a.questionId);
  const data: FollowUpInput = { task: "follow_up", job_type: jobTypeBrief(a.jt), question_id: a.questionId, question: a.question, answer: a.answer, hint: FOLLOW_UP_HINTS[a.questionId] ?? null, earlier };
  let followUp: string | null = null;
  try {
    const out = await askModel(env, {
      purpose: "studio.interview", tier: "standard", system: INTERVIEW_SYSTEM, prompt: withData(FOLLOW_UP_TASK, data), maxTokens: 300, temperature: 0.3,
      schema: { type: "object", properties: { follow_up: { type: ["string", "null"] } }, required: ["follow_up"], additionalProperties: false },
    }, z.object({ follow_up: z.string().nullable() }), "no follow-up");
    followUp = out.follow_up?.trim() ? collapse(out.follow_up).slice(0, 300) : null;
  } catch (err) {
    console.error("studio_follow_up_skipped", err instanceof Error ? err.message : String(err));
    return;
  }
  if (!followUp || followUp.length < 5) return;
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO studio_interview_turns (id, agent_id, seq, question_id, kind, question, answer, skipped, created_at) VALUES (?, ?, ?, ?, 'follow_up', ?, NULL, 0, ?)")
      .bind(newId("turn"), a.agent.id, a.seq, a.questionId, followUp, now),
    eventStatement(db, { actor: "system", actorKind: "system", entity: "agent", entityId: a.agent.id, type: "studio.follow_up_asked", data: { question_id: a.questionId } }, now),
  ]);
}

export async function draftPlaybook(env: Env, input: { expertId: string; actor: string; agentId: string; expertName: string }): Promise<InterviewView> {
  const { agent, studio } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = jobTypeOf(agent);
  const view = await interviewState(env, agent.id, studio, jt);
  if (view.requiredLeft > 0) return fail(409, "interview_not_done", `Answer the required questions first. ${view.requiredLeft} left.`);
  await dailyLimit(env, agent.id, "studio.playbook_drafted", LIMITS.perDay.playbook, "You have drafted your playbook many times today. Edit it by hand, or try again tomorrow.");
  const data: PlaybookInput = {
    task: "playbook", job_type: jobTypeBrief(jt), expert_name: input.expertName,
    answers: view.questions.filter(q => q.answer).map(q => ({ question_id: q.id, question: q.text, answer: q.answer!, follow_up: q.followUp?.text ?? null, follow_up_answer: q.followUp?.answer ?? null })),
  };
  const out = await askModel(env, {
    purpose: "studio.interview", tier: "standard", system: INTERVIEW_SYSTEM, prompt: withData(PLAYBOOK_TASK, data), maxTokens: 5000, temperature: 0.4,
    schema: { type: "object", properties: { playbook: { type: "string" } }, required: ["playbook"], additionalProperties: false },
  }, z.object({ playbook: z.string().min(200).max(LIMITS.playbookChars) }), "We could not draft your playbook just now. Try again in a minute.");
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE studio_agents SET playbook = ?, playbook_source = 'ai', playbook_updated_at = ?, updated_at = ? WHERE agent_id = ?").bind(out.playbook.trim(), now, now, agent.id),
    db.prepare("UPDATE agents SET updated_at = ? WHERE id = ?").bind(now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.playbook_drafted", data: { chars: out.playbook.length } }, now),
  ]);
  return interviewState(env, agent.id, { ...studio, playbook: out.playbook.trim(), playbook_source: "ai", playbook_updated_at: now }, jt);
}

export async function savePlaybook(env: Env, input: { expertId: string; actor: string; agentId: string; playbook: unknown }): Promise<InterviewView> {
  const { agent, studio } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = jobTypeOf(agent);
  const playbook = str(input.playbook, "your playbook", { min: 100, max: LIMITS.playbookChars });
  noSecrets(playbook);
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE studio_agents SET playbook = ?, playbook_source = 'expert', playbook_updated_at = ?, updated_at = ? WHERE agent_id = ?").bind(playbook, now, now, agent.id),
    db.prepare("UPDATE agents SET updated_at = ? WHERE id = ?").bind(now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.playbook_edited", data: { chars: playbook.length } }, now),
  ]);
  return interviewState(env, agent.id, { ...studio, playbook, playbook_source: "expert", playbook_updated_at: now }, jt);
}

// ---------- Step 2: examples ----------

export async function addExample(env: Env, input: { expertId: string; actor: string; agentId: string; body: Record<string, unknown> }): Promise<ExampleView[]> {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const b = input.body;
  if (b.rightsConfirmed !== true) return fail(400, "rights_required", "Confirm that you have the right to use this work before you add it.");
  const rights = oneOf(b.rights, "who owns this work", ["own_work", "client_permission"] as const);
  const L = LIMITS.example;
  const title = str(b.title, "a short title", { min: 3, max: L.title });
  const brief = str(b.brief, "the brief", { min: 20, max: L.brief });
  const audience = str(b.audience, "who it was for", { min: 3, max: L.audience });
  const result = str(b.result, "the finished work", { min: 50, max: L.result });
  const notes = str(b.notes, "why it worked", { max: L.notes, optional: true });
  noSecrets(title, brief, audience, result, notes);
  const chars = title.length + brief.length + audience.length + result.length + notes.length;
  const used = (await first<{ n: number; c: number }>(env.DB, "SELECT COUNT(*) AS n, COALESCE(SUM(chars), 0) AS c FROM studio_examples WHERE agent_id = ?", agent.id))!;
  if (used.n >= LIMITS.examplesPerAgent) return fail(409, "too_many_examples", `You can add up to ${LIMITS.examplesPerAgent} examples. Remove one to add another.`);
  if (used.c + chars > LIMITS.exampleTotalChars) return fail(413, "examples_too_long", "Your examples are too long in total. Shorten this one, or remove another first.");
  const db = env.DB, now = nowIso(), id = newId("ex");
  await db.batch([
    db.prepare("INSERT INTO studio_examples (id, agent_id, expert_id, title, brief, audience, result, notes, rights, rights_statement, rights_confirmed_at, chars, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(id, agent.id, input.expertId, title, brief, audience, result, notes, rights, RIGHTS_STATEMENTS[rights], now, chars, now),
    db.prepare("UPDATE agents SET updated_at = ? WHERE id = ?").bind(now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.example_added", data: { example_id: id, rights, chars } }, now),
  ]);
  return (await all<ExampleRow>(env.DB, "SELECT * FROM studio_examples WHERE agent_id = ? ORDER BY created_at", agent.id)).map(exampleView);
}

export async function removeExample(env: Env, input: { expertId: string; actor: string; agentId: string; exampleId: string }): Promise<ExampleView[]> {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const db = env.DB, now = nowIso();
  const res = await db.batch([
    db.prepare("DELETE FROM studio_examples WHERE id = ? AND agent_id = ?").bind(input.exampleId, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.example_removed", data: { example_id: input.exampleId } }, now),
  ]);
  if (!res[0]?.meta?.changes) return fail(404, "example_not_found", "We could not find that example. Reload the page.");
  return (await all<ExampleRow>(env.DB, "SELECT * FROM studio_examples WHERE agent_id = ? ORDER BY created_at", agent.id)).map(exampleView);
}

// ---------- Step 3: mark up plain AI ----------

export async function makeMarkupDraft(env: Env, input: { expertId: string; actor: string; agentId: string; briefId?: string }): Promise<StudioDetail["markup"]> {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = jobTypeOf(agent);
  const briefs = publicBriefs(jt);
  if (!briefs.length) return fail(409, "no_sample_briefs", "This job has no sample briefs yet. Contact us and we will add some.");
  const brief = input.briefId ? briefs.find(b => b.id === input.briefId) : briefs[0];
  if (!brief) return fail(400, "unknown_brief", "Pick one of the sample briefs.");
  await dailyLimit(env, agent.id, "studio.markup_draft_made", LIMITS.perDay.markup, "You have made several plain AI drafts today. Mark up the one you have, or try again tomorrow.");
  let out: { runId: string; draftId: string };
  try {
    out = await runBaseline(env, { jobTypeId: jt.id, brief: brief.text, rubric: jt.rubric });
  } catch (err) {
    if (err instanceof HttpError) throw err;
    console.error("studio_markup_baseline_failed", err instanceof Error ? err.message : String(err));
    return fail(502, "baseline_failed", "We could not make the plain AI draft just now. Try again in a few minutes.");
  }
  const draft = await first<{ content: string }>(env.DB, "SELECT content FROM drafts WHERE id = ?", out.draftId);
  if (!draft?.content) return fail(502, "baseline_failed", "We could not make the plain AI draft just now. Try again in a few minutes.");
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE studio_agents SET markup_brief_id = ?, markup_brief = ?, markup_run_id = ?, markup_draft_id = ?, markup_draft = ?, markup_made_at = ?, updated_at = ? WHERE agent_id = ?")
      .bind(brief.id, brief.text, out.runId, out.draftId, draft.content, now, now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.markup_draft_made", data: { brief_id: brief.id, run_id: out.runId, draft_id: out.draftId } }, now),
  ]);
  const marks = await all<MarkRow>(env.DB, "SELECT * FROM studio_marks WHERE agent_id = ? ORDER BY created_at", agent.id);
  return { briefId: brief.id, brief: brief.text, draft: draft.content, madeAt: now, marks: marks.map(m => ({ id: m.id, passage: m.passage, reason: m.reason, createdAt: m.created_at })) };
}

export async function addMark(env: Env, input: { expertId: string; actor: string; agentId: string; passage: unknown; reason: unknown }): Promise<MarkView[]> {
  const { agent, studio } = await ownedAgent(env, input.expertId, input.agentId);
  if (!studio.markup_draft) return fail(409, "no_markup_draft", "Make the plain AI draft first.");
  const passage = str(input.passage, "the passage", { min: 3, max: 2000 });
  const reason = str(input.reason, "why you would never ship it", { min: 5, max: 500 });
  if (!collapse(studio.markup_draft).includes(collapse(passage))) return fail(400, "passage_not_found", "Copy the passage exactly from the plain AI draft, or select it and use the button.");
  const marks = await all<MarkRow>(env.DB, "SELECT * FROM studio_marks WHERE agent_id = ? ORDER BY created_at", agent.id);
  if (marks.length >= LIMITS.marksPerAgent) return fail(409, "too_many_marks", `You can mark up to ${LIMITS.marksPerAgent} passages. Remove one to add another.`);
  if (marks.some(m => collapse(m.passage).toLowerCase() === collapse(passage).toLowerCase())) return fail(409, "already_marked", "You already marked that passage.");
  const db = env.DB, now = nowIso(), id = newId("mark");
  await db.batch([
    db.prepare("INSERT INTO studio_marks (id, agent_id, draft_id, brief_id, passage, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(id, agent.id, studio.markup_draft_id, studio.markup_brief_id, passage, reason, now),
    db.prepare("UPDATE agents SET updated_at = ? WHERE id = ?").bind(now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.mark_added", data: { mark_id: id } }, now),
  ]);
  return [...marks, { id, agent_id: agent.id, draft_id: studio.markup_draft_id, brief_id: studio.markup_brief_id, passage, reason, created_at: now }]
    .map(m => ({ id: m.id, passage: m.passage, reason: m.reason, createdAt: m.created_at }));
}

export async function removeMark(env: Env, input: { expertId: string; actor: string; agentId: string; markId: string }): Promise<MarkView[]> {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const db = env.DB, now = nowIso();
  const res = await db.batch([
    db.prepare("DELETE FROM studio_marks WHERE id = ? AND agent_id = ?").bind(input.markId, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.mark_removed", data: { mark_id: input.markId } }, now),
  ]);
  if (!res[0]?.meta?.changes) return fail(404, "mark_not_found", "We could not find that mark. Reload the page.");
  return (await all<MarkRow>(env.DB, "SELECT * FROM studio_marks WHERE agent_id = ? ORDER BY created_at", agent.id)).map(m => ({ id: m.id, passage: m.passage, reason: m.reason, createdAt: m.created_at }));
}

// ---------- Step 4: build ----------

export interface BuildResult { version: number; sha256: string; status: "draft"; changelog: string; package: AgentPackage; rulesAdded: number }

export async function buildVersion(env: Env, input: { expertId: string; actor: string; agentId: string; expertName: string; changelog?: unknown }): Promise<BuildResult> {
  const { agent, studio } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = jobTypeOf(agent);
  const [examples, marks, approved] = await Promise.all([
    all<ExampleRow>(env.DB, "SELECT * FROM studio_examples WHERE agent_id = ? ORDER BY created_at", agent.id),
    all<MarkRow>(env.DB, "SELECT * FROM studio_marks WHERE agent_id = ? ORDER BY created_at", agent.id),
    all<SuggestionRow>(env.DB, "SELECT * FROM studio_suggestions WHERE agent_id = ? AND status = 'approved' ORDER BY decided_at, created_at", agent.id),
  ]);
  // An agent started from a trained pack, with the expert's own playbook, may build without studio examples or marked
  // passages: the pack's examples and "Rules I learned" stand in for them. The test bench and ops review still apply.
  const fromPack = studio.playbook_source === "expert"
    && !!(await first<{ n: number }>(env.DB, "SELECT 1 AS n FROM studio_pack_imports WHERE agent_id = ? LIMIT 1", agent.id));
  const missing: string[] = [];
  if (!studio.playbook.trim()) missing.push("your playbook (step 1)");
  if (!examples.length && !fromPack) missing.push("at least one example of your work (step 2)");
  if (!marks.length && !fromPack) missing.push("at least one marked passage (step 3)");
  if (missing.length) return fail(409, "not_ready", `Before you build, add ${listWords(missing)}.`);
  const changelogIn = str(input.changelog, "what changed", { max: 500, optional: true });
  await dailyLimit(env, agent.id, "agent.version_built", LIMITS.perDay.build, "You have built this agent many times today. Try again tomorrow.");

  const latest = await first<VersionRow>(env.DB, "SELECT * FROM agent_versions WHERE agent_id = ? ORDER BY version DESC LIMIT 1", agent.id);
  const rules = approved.map(s => ({ target: s.target, text: s.text }));
  const data: CompileInput = {
    job_type: {
      ...jobTypeBrief(jt),
      rubric: jt.rubric.map(c => ({ id: c.id, text: c.text, pass_rule: c.pass_rule, critical: c.critical })),
      not_for: jt.not_for,
      spec_fields: jt.spec_fields.map(f => ({ id: f.id, label: f.label, required: f.required })),
    },
    agent_name: agent.name, expert_name: input.expertName, playbook: studio.playbook,
    examples: examples.map(e => ({ title: e.title, brief: e.brief, audience: e.audience, result: e.result.slice(0, 6000), notes: e.notes })),
    marks: marks.map(m => ({ passage: m.passage, reason: m.reason })),
    approved_rules: rules,
    previous_package: latest ? parseJson<AgentPackage | null>(latest.package, null) : null,
    problems: [],
  };

  let pkg: AgentPackage | null = null;
  for (let attempt = 0; attempt < 2 && !pkg; attempt++) {
    let raw: unknown;
    try {
      const res = await callModel(env, { purpose: "studio.compile", tier: "premium", system: COMPILE_SYSTEM, prompt: withData(COMPILE_TASK, data), json: true, schema: packageJsonSchema, maxTokens: 16000, temperature: 0.3 });
      raw = res.data ?? parseModelJson(res.text);
    } catch (err) {
      if (err instanceof HttpError) throw err;
      data.problems = ["Your last reply was not valid JSON."];
      console.error("studio_compile_failed", err instanceof Error ? err.message : String(err));
      continue;
    }
    const checked = validateAgentPackage(normalizePackage(raw, { jobTypeId: jt.id, name: agent.name }), { jobTypeId: jt.id });
    if (!checked.ok) { data.problems = checked.errors.slice(0, 20); continue; }
    const merged = validateAgentPackage(withRuleBlock(mergeRules(checked.pkg, rules)), { jobTypeId: jt.id });
    if (!merged.ok) { data.problems = merged.errors.slice(0, 20); continue; }
    const copied = copiedExamples(merged.pkg, examples);
    if (copied.length) { data.problems = [`You copied text from the past work titled ${listWords(copied.map(t => `"${t}"`))}. Describe the lessons instead.`]; continue; }
    pkg = merged.pkg;
  }
  if (!pkg) return fail(502, "build_failed", "We could not build a working agent this time. Try again. If it keeps failing, make your playbook shorter and clearer.");

  const version = (latest?.version ?? 0) + 1;
  const packageJson = stableJson(pkg);
  const sha256 = await sha256Hex(packageJson);
  const newRules = approved.filter(s => s.applied_version === null).length;
  const changelog = changelogIn || (version === 1 ? "First build from your interview, examples and markup." : newRules ? `Rebuilt with ${newRules} new rule${newRules === 1 ? "" : "s"} from your test bench edits.` : "Rebuilt from your latest playbook, examples and markup.");
  const db = env.DB, now = nowIso();
  try {
    await db.batch([
      db.prepare("INSERT INTO agent_versions (agent_id, version, package, sha256, changelog, status, test_results, created_at, published_at) VALUES (?, ?, ?, ?, ?, 'draft', '{}', ?, NULL)")
        .bind(agent.id, version, packageJson, sha256, changelog, now),
      db.prepare("UPDATE studio_suggestions SET applied_version = ? WHERE agent_id = ? AND status = 'approved' AND applied_version IS NULL").bind(version, agent.id),
      db.prepare("UPDATE agents SET updated_at = ? WHERE id = ?").bind(now, agent.id),
      eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "agent.version_built", data: { version, sha256, rules_added: newRules, examples: examples.length, marks: marks.length } }, now),
    ]);
  } catch (err) {
    if (/UNIQUE|PRIMARY KEY/i.test(err instanceof Error ? err.message : "")) return fail(409, "build_conflict", "Another build finished at the same time. Reload the page to see it.");
    throw err;
  }
  return { version, sha256, status: "draft", changelog, package: pkg, rulesAdded: newRules };
}

export async function getVersion(env: Env, input: { expertId: string; agentId: string; version: number }) {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const v = await first<VersionRow>(env.DB, "SELECT * FROM agent_versions WHERE agent_id = ? AND version = ?", agent.id, input.version);
  if (!v) return fail(404, "version_not_found", "We could not find that version.");
  return { version: v.version, status: v.status, sha256: v.sha256, changelog: v.changelog, createdAt: v.created_at, publishedAt: v.published_at, testResults: parseJson(v.test_results, {}), package: parseJson<AgentPackage | null>(v.package, null) };
}

// ---------- Step 5: test bench ----------

async function benchState(env: Env, agentId: string, version: number): Promise<BenchView> {
  const latest = await first<{ bench_id: string }>(env.DB, "SELECT bench_id FROM studio_tests WHERE agent_id = ? AND version = ? ORDER BY created_at DESC, rowid DESC LIMIT 1", agentId, version);
  if (!latest) return { version, tests: [], earlierRuns: 0, vsPlainAi: tallyVerdicts([]) };
  const rows = await all<TestRow & { agent_content: string | null; baseline_content: string | null }>(env.DB,
    `SELECT t.*, a.content AS agent_content, b.content AS baseline_content FROM studio_tests t
     LEFT JOIN drafts a ON a.id = t.agent_draft_id LEFT JOIN drafts b ON b.id = t.baseline_draft_id
     WHERE t.agent_id = ? AND t.bench_id = ? ORDER BY t.rowid`, agentId, latest.bench_id);
  const edits = await all<EditRow>(env.DB, `SELECT * FROM studio_edits WHERE test_id IN (SELECT id FROM studio_tests WHERE bench_id = ?) ORDER BY created_at`, latest.bench_id);
  const runs = (await first<{ n: number }>(env.DB, "SELECT COUNT(DISTINCT bench_id) AS n FROM studio_tests WHERE agent_id = ? AND version = ?", agentId, version))!.n;
  const verdicts = rows.map(r => readVerdict(r.verdict));
  return {
    version, earlierRuns: Math.max(0, runs - 1),
    tests: rows.map((r, i) => ({
      id: r.id, benchId: r.bench_id, briefId: r.brief_id, brief: r.brief, status: r.status, error: r.error, createdAt: r.created_at,
      agentDraft: r.agent_content, baselineDraft: r.baseline_content,
      verdict: r.status === "done" ? verdictView(verdicts[i]) : null,
      edits: edits.filter(e => e.test_id === r.id).map(e => ({ id: e.id, edited: e.edited, reason: e.reason, createdAt: e.created_at })),
    })),
    vsPlainAi: tallyVerdicts(rows.map((r, i) => (r.status === "done" ? verdicts[i] : null))),
  };
}

// The verdict as stored in studio_tests.verdict (snake_case, see migrations/0011_studio_bench_verdict.sql).
type StoredVerdict =
  | { status: "done"; winner: "agent" | "baseline" | "tie"; reasons: string; judge_model: string | null; avoided_provider: string | null; at: string }
  | { status: "skipped"; code: "daily_limit" | "judge_failed"; at: string };

function readVerdict(json: string | null): StoredVerdict | null {
  const v = parseJson<Partial<StoredVerdict> | null>(json, null);
  if (!v || typeof v !== "object") return null;
  if (v.status === "done" && (v.winner === "agent" || v.winner === "baseline" || v.winner === "tie")) return v as StoredVerdict;
  if (v.status === "skipped") return { status: "skipped", code: v.code === "daily_limit" ? "daily_limit" : "judge_failed", at: String(v.at ?? "") };
  return null;
}

function verdictView(v: StoredVerdict | null): BenchVerdict | null {
  if (!v) return null;
  if (v.status === "skipped") return v;
  return { status: "done", winner: v.winner, reasons: v.reasons ?? "", judgeModel: v.judge_model ?? null, avoidedProvider: v.avoided_provider ?? null, at: v.at };
}

function tallyVerdicts(list: (StoredVerdict | null)[]): BenchScore {
  const done = list.filter((v): v is Extract<StoredVerdict, { status: "done" }> => v?.status === "done");
  return {
    judged: done.length,
    agentWins: done.filter(v => v.winner === "agent").length,
    baselineWins: done.filter(v => v.winner === "baseline").length,
    ties: done.filter(v => v.winner === "tie").length,
    skipped: list.filter(v => v?.status === "skipped").length,
  };
}

/**
 * Judge one bench pair with evaluation's pairwise judge: both orders, a tie when they disagree, and a judge from a
 * different provider than the one that wrote the agent's draft (compareWithBaseline reads it from the run's model calls).
 * Every judge call goes through callModel, so the daily AI limit applies. Never throws: a problem means "not compared".
 */
async function judgeBenchPair(env: Env, input: { agentDraftId: string; baselineDraftId: string; brief: string; rubric: RubricCriterion[] }): Promise<StoredVerdict> {
  const at = nowIso();
  try {
    const res = await compareWithBaseline(env, { agentDraftId: input.agentDraftId, baselineDraftId: input.baselineDraftId, rubric: input.rubric, brief: input.brief });
    const score = await first<{ judge_model: string | null; result: string }>(env.DB,
      "SELECT judge_model, result FROM scores WHERE draft_id = ? AND judge = 'baseline' ORDER BY created_at DESC, rowid DESC LIMIT 1", input.agentDraftId);
    const avoided = parseJson<{ avoided_provider?: string | null }>(score?.result, {}).avoided_provider ?? null;
    return { status: "done", winner: res.winner, reasons: (res.reasons ?? "").slice(0, 2000), judge_model: score?.judge_model ?? null, avoided_provider: avoided, at };
  } catch (err) {
    const capped = err instanceof HttpError && err.code === "model_cap_reached";
    if (!capped) console.error("studio_bench_judge_failed", err instanceof Error ? err.message : String(err));
    return { status: "skipped", code: capped ? "daily_limit" : "judge_failed", at };
  }
}

const runError = (r: PromiseSettledResult<unknown>) => r.status === "rejected"
  ? (r.reason instanceof HttpError ? r.reason.message : "This run did not finish. Try the test bench again in a few minutes.")
  : null;

export async function runTestBench(env: Env, input: { expertId: string; actor: string; agentId: string; version?: number }): Promise<BenchView> {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = jobTypeOf(agent);
  const row = input.version
    ? await first<VersionRow>(env.DB, "SELECT * FROM agent_versions WHERE agent_id = ? AND version = ?", agent.id, input.version)
    : await first<VersionRow>(env.DB, "SELECT * FROM agent_versions WHERE agent_id = ? ORDER BY version DESC LIMIT 1", agent.id);
  if (!row) return input.version ? fail(404, "version_not_found", "We could not find that version.") : fail(409, "not_built", "Build your agent first (step 4).");
  // Only public briefs: hidden ones are kept back for certification and never shown to experts.
  const briefs = publicBriefs(jt).slice(0, LIMITS.benchBriefs);
  if (!briefs.length) return fail(409, "no_sample_briefs", "This job has no sample briefs yet. Contact us and we will add some.");
  await dailyLimit(env, agent.id, "studio.test_bench_run", LIMITS.perDay.bench, `You have run the test bench ${LIMITS.perDay.bench} times today. Try again tomorrow.`);

  const benchId = newId("bench");
  const results = await Promise.all(briefs.map(async b => {
    const [mine, plain] = await Promise.allSettled([
      runAgentOnBrief(env, { agentId: agent.id, version: row.version, brief: b.text, rubric: jt.rubric, kind: "test", actor: input.actor }),
      runBaseline(env, { jobTypeId: jt.id, brief: b.text, rubric: jt.rubric }),
    ]);
    const error = runError(mine) ?? runError(plain);
    for (const r of [mine, plain]) if (r.status === "rejected") console.error("studio_bench_run_failed", r.reason instanceof Error ? r.reason.message : String(r.reason));
    return {
      brief: b,
      agent: mine.status === "fulfilled" ? mine.value : null,
      baseline: plain.status === "fulfilled" ? plain.value : null,
      error,
    };
  }));
  // Each finished pair is judged against plain AI. A judge problem never fails the bench: the pair shows "not compared".
  const verdicts = await Promise.all(results.map(r => r.agent && r.baseline && !r.error
    ? judgeBenchPair(env, { agentDraftId: r.agent.draftId, baselineDraftId: r.baseline.draftId, brief: r.brief.text, rubric: jt.rubric })
    : Promise.resolve(null)));
  const db = env.DB, now = nowIso();
  const done = results.filter(r => !r.error).length;
  const score = tallyVerdicts(verdicts);
  const statements = results.map((r, i) => db.prepare("INSERT INTO studio_tests (id, agent_id, version, bench_id, brief_id, brief, agent_run_id, agent_draft_id, baseline_run_id, baseline_draft_id, status, error, created_by, created_at, verdict) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(newId("test"), agent.id, row.version, benchId, r.brief.id, r.brief.text, r.agent?.runId ?? null, r.agent?.draftId ?? null, r.baseline?.runId ?? null, r.baseline?.draftId ?? null, r.error ? "failed" : "done", r.error, input.actor, now,
      verdicts[i] ? JSON.stringify(verdicts[i]) : null));
  await db.batch([
    ...statements,
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.test_bench_run", data: {
      version: row.version, bench_id: benchId, briefs: briefs.map(b => b.id), done, failed: results.length - done,
      vs_plain_ai: { judged: score.judged, agent_wins: score.agentWins, baseline_wins: score.baselineWins, ties: score.ties, skipped: score.skipped },
    } }, now),
  ]);
  // Record the results on the version while it is a draft. Published versions never change.
  if (row.status === "draft") {
    const counts = await testCounts(env, agent.id, row.version);
    const doneRows = await all<{ brief_id: string; verdict: string | null }>(env.DB, "SELECT brief_id, verdict FROM studio_tests WHERE agent_id = ? AND version = ? AND status = 'done'", agent.id, row.version);
    const briefIds = [...new Set(doneRows.map(r => r.brief_id))];
    const totals = tallyVerdicts(doneRows.map(r => readVerdict(r.verdict)));
    const vsPlainAi = { judged: totals.judged, agent_wins: totals.agentWins, baseline_wins: totals.baselineWins, ties: totals.ties, skipped: totals.skipped };
    await db.prepare("UPDATE agent_versions SET test_results = ? WHERE agent_id = ? AND version = ? AND status = 'draft'")
      .bind(JSON.stringify({ studio: { runs: counts.done, failed: counts.failed, brief_ids: briefIds, last_run_at: counts.lastRunAt, vs_plain_ai: vsPlainAi } }), agent.id, row.version).run();
  }
  if (!done) return fail(502, "test_bench_failed", results[0]?.error ?? "The test bench could not run just now. Try again in a few minutes.");
  return benchState(env, agent.id, row.version);
}

function lineDiff(original: string, edited: string): { removed: string[]; added: string[] } {
  const a = original.split("\n").map(l => l.trim()).filter(Boolean), b = edited.split("\n").map(l => l.trim()).filter(Boolean);
  const inA = new Set(a), inB = new Set(b);
  return { removed: a.filter(l => !inB.has(l)).slice(0, 40), added: b.filter(l => !inA.has(l)).slice(0, 40) };
}

export async function saveEdit(env: Env, input: { expertId: string; actor: string; agentId: string; testId: string; edited: unknown; reason: unknown }): Promise<{ suggestions: SuggestionView[]; notice: string | null }> {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const jt = jobTypeOf(agent);
  const test = await first<TestRow & { content: string | null }>(env.DB, "SELECT t.*, d.content FROM studio_tests t LEFT JOIN drafts d ON d.id = t.agent_draft_id WHERE t.id = ? AND t.agent_id = ?", input.testId, agent.id);
  if (!test) return fail(404, "test_not_found", "We could not find that test. Reload the page.");
  if (test.status !== "done" || !test.content) return fail(409, "test_failed", "This test did not finish, so there is no draft to edit. Run the test bench again.");
  const edited = str(input.edited, "your edited draft", { max: 40000 });
  const reason = str(input.reason, "why you changed it", { min: 5, max: 1000 });
  noSecrets(edited, reason);
  if (collapse(edited) === collapse(test.content)) return fail(400, "no_change", "Change something in the draft first, then save.");
  await dailyLimit(env, agent.id, "studio.edit_saved", LIMITS.perDay.edit, "You have saved many edits today. Approve the rules you have, rebuild, and try again tomorrow.");
  const db = env.DB, now = nowIso(), editId = newId("edit");
  await db.batch([
    db.prepare("INSERT INTO studio_edits (id, agent_id, test_id, version, original, edited, reason, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(editId, agent.id, test.id, test.version, test.content, edited, reason, input.actor, now),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "studio.edit_saved", data: { edit_id: editId, test_id: test.id, version: test.version } }, now),
  ]);

  // Rules the agent already has, so suggestions do not repeat them.
  const pkgRow = await first<{ package: string }>(env.DB, "SELECT package FROM agent_versions WHERE agent_id = ? AND version = ?", agent.id, test.version);
  const pkg = parseJson<Partial<AgentPackage>>(pkgRow?.package, {});
  const known = await all<SuggestionRow>(env.DB, "SELECT * FROM studio_suggestions WHERE agent_id = ? AND status != 'declined'", agent.id);
  const current = {
    style_rules: [...(pkg.style_rules ?? []), ...known.filter(k => k.target === "style_rules").map(k => k.text)],
    checklist: [...(pkg.checklist ?? []), ...known.filter(k => k.target === "checklist").map(k => k.text)],
  };
  const data: SuggestInput = { job_type: jobTypeBrief(jt), brief: test.brief, original: test.content, edited, ...lineDiff(test.content, edited), reason, current_rules: current };
  let proposed: { target: "style_rules" | "checklist"; text: string; why: string }[] = [];
  try {
    const out = await askModel(env, {
      purpose: "studio.suggest", tier: "standard", system: SUGGEST_SYSTEM, prompt: withData(SUGGEST_TASK, data), maxTokens: 800, temperature: 0.2,
      schema: {
        type: "object", additionalProperties: false, required: ["suggestions"],
        properties: { suggestions: { type: "array", maxItems: 3, items: { type: "object", additionalProperties: false, required: ["target", "text", "why"], properties: { target: { enum: ["style_rules", "checklist"] }, text: { type: "string" }, why: { type: "string" } } } } },
      },
    }, z.object({ suggestions: z.array(z.object({ target: z.enum(["style_rules", "checklist"]), text: z.string().trim().min(5).max(400), why: z.string().max(400).default("") })).max(5) }), "no suggestions");
    const seen = new Set([...current.style_rules, ...current.checklist].map(r => collapse(r).toLowerCase()));
    proposed = out.suggestions.filter(s => { const k = collapse(s.text).toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
  } catch (err) {
    // The edit is saved either way; say so instead of showing an error.
    const why = err instanceof HttpError && err.status !== 502 ? ` ${err.message}` : " Try another edit later.";
    return { suggestions: [], notice: `We saved your edit, but could not suggest rules from it just now.${why}` };
  }
  if (proposed.length) {
    await db.batch([
      ...proposed.map(s => db.prepare("INSERT INTO studio_suggestions (id, agent_id, edit_id, target, text, why, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'proposed', ?)")
        .bind(newId("sug"), agent.id, editId, s.target, collapse(s.text), collapse(s.why).slice(0, 400), now)),
      eventStatement(db, { actor: "system", actorKind: "system", entity: "agent", entityId: agent.id, type: "studio.rules_suggested", data: { edit_id: editId, count: proposed.length } }, now),
    ]);
  }
  const rows = await all<SuggestionRow>(env.DB, "SELECT * FROM studio_suggestions WHERE edit_id = ? ORDER BY created_at, rowid", editId);
  return { suggestions: rows.map(suggestionView), notice: proposed.length ? null : "We saved your edit. It did not suggest any new rules." };
}

export async function decideSuggestion(env: Env, input: { expertId: string; actor: string; agentId: string; suggestionId: string; decision: unknown; text?: unknown }): Promise<SuggestionView> {
  const { agent } = await ownedAgent(env, input.expertId, input.agentId);
  const decision = oneOf(input.decision, "your decision", ["approve", "decline"] as const);
  const s = await first<SuggestionRow>(env.DB, "SELECT * FROM studio_suggestions WHERE id = ? AND agent_id = ?", input.suggestionId, agent.id);
  if (!s) return fail(404, "suggestion_not_found", "We could not find that rule. Reload the page.");
  const text = input.text === undefined || input.text === null || input.text === "" ? s.text : collapse(str(input.text, "the rule", { min: 5, max: 400 }));
  noSecrets(text);
  const status = decision === "approve" ? "approved" : "declined";
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE studio_suggestions SET status = ?, text = ?, decided_by = ?, decided_at = ? WHERE id = ?").bind(status, text, input.actor, now, s.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: `studio.suggestion_${status}`, data: { suggestion_id: s.id, target: s.target, edited: text !== s.text } }, now),
  ]);
  return suggestionView({ ...s, status, text, decided_by: input.actor, decided_at: now });
}

// ---------- Step 6: publish ----------

export async function publishVersion(env: Env, input: { expertId: string; actor: string; agentId: string; version: number }): Promise<AgentSummary> {
  const { agent, studio } = await ownedAgent(env, input.expertId, input.agentId);
  const v = await first<VersionRow>(env.DB, "SELECT * FROM agent_versions WHERE agent_id = ? AND version = ?", agent.id, input.version);
  if (!v) return fail(404, "version_not_found", "We could not find that version.");
  if (v.status === "published") return fail(409, "already_published", "That version is already published, and published versions cannot change. Build a new version to make changes.");
  if (agent.status === "retired") return fail(409, "agent_retired", "This agent is retired. Contact us if you want to bring it back.");
  const tests = await testCounts(env, agent.id, v.version);
  if (!tests.done) return fail(409, "not_tested", "Run the test bench on this version before you publish it.");
  const personaId = agent.persona_id ?? await personaFor(env, input.expertId);
  const to = agent.status === "draft" ? "testing" : agent.status;
  const db = env.DB, now = nowIso();
  const res = await db.batch([
    db.prepare("UPDATE agent_versions SET status = 'published', published_at = ? WHERE agent_id = ? AND version = ? AND status = 'draft'").bind(now, agent.id, v.version),
    db.prepare("UPDATE agents SET status = ?, persona_id = ?, updated_at = ? WHERE id = ? AND changes() = 1").bind(to, personaId, now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: EXPERT, entity: "agent", entityId: agent.id, type: "agent.version_published", data: { version: v.version, sha256: v.sha256, from: agent.status, to } }, now),
  ]);
  if (!res[0]?.meta?.changes) return fail(409, "already_published", "That version was published a moment ago. Reload the page.");
  await notifyOps(env, {
    kind: "studio.version_published",
    subject: `Agent version to check: ${agent.name}, version ${v.version}`,
    text: `${agent.name} (${agent.job_type_id}) has a new published version ${v.version}. Check it, then put it live from the ops agents page.`,
    link: "/ops/agents",
  });
  if (to !== agent.status) await syncPersona(env, agent, input.actor, EXPERT);
  const updated = (await first<AgentRow>(env.DB, "SELECT * FROM agents WHERE id = ?", agent.id))!;
  return summarize(env, updated, studio);
}

// ---------- Ops: live, retire and un-retire ----------

const opsKind = (actor: string): ActorKind => (actor === "system" ? "system" : "ops");

/**
 * An expert has one active agent per job type (createStudioAgent enforces it). Bringing back a retired agent must not
 * make a second one, so this is a 409 when the expert has built another agent for the same job since.
 */
async function noOtherActiveAgent(env: Env, agent: AgentRow): Promise<void> {
  if (agent.kind !== "expert" || !agent.expert_id) return;
  const other = await first<{ id: string; name: string }>(env.DB,
    "SELECT id, name FROM agents WHERE expert_id = ? AND job_type_id = ? AND status != 'retired' AND id != ? LIMIT 1", agent.expert_id, agent.job_type_id, agent.id);
  if (other) fail(409, "agent_exists", `This expert has another agent for this job: ${other.name}. Retire that one first, then bring this one back.`);
}

/** Ops (or later, automated certification) puts a published version live; the previous live version stays traceable. */
export async function setAgentLive(env: Env, input: { agentId: string; version: number; actor: string }): Promise<void> {
  const agent = await first<AgentRow>(env.DB, "SELECT * FROM agents WHERE id = ?", input.agentId);
  if (!agent) return fail(404, "agent_not_found", "We could not find that agent.");
  const v = await first<VersionRow>(env.DB, "SELECT version, status FROM agent_versions WHERE agent_id = ? AND version = ?", agent.id, input.version);
  if (!v) return fail(404, "version_not_found", "We could not find that version of the agent.");
  if (v.status !== "published") return fail(409, "version_not_published", "Only a published version can go live. The expert must publish it first.");
  if (agent.status === "live" && agent.live_version === v.version) return;
  if (agent.status === "retired") await noOtherActiveAgent(env, agent);
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE agents SET status = 'live', live_version = ?, updated_at = ? WHERE id = ?").bind(v.version, now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: opsKind(input.actor), entity: "agent", entityId: agent.id, type: "agent.live", data: { version: v.version, previous_version: agent.live_version, previous_status: agent.status } }, now),
  ]);
  await tellExpert(env, agent, {
    kind: "agent.live",
    subject: `${agent.name} is live`,
    text: `Version ${v.version} of ${agent.name} is now live. Buyers who hire for this job can be matched with it.`,
  }, input.actor);
}

/** Take an agent out of matching (status retired or back to testing). Retiring keeps every version, run and job. */
export async function setAgentStatus(env: Env, input: { agentId: string; status: "testing" | "retired"; actor: string; reason: string }): Promise<void> {
  const agent = await first<AgentRow>(env.DB, "SELECT * FROM agents WHERE id = ?", input.agentId);
  if (!agent) return fail(404, "agent_not_found", "We could not find that agent.");
  const status = oneOf(input.status, "status", ["testing", "retired"] as const);
  const reason = str(input.reason, "a reason", { min: 3, max: 500 });
  if (agent.status === status) return;
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE agents SET status = ?, updated_at = ? WHERE id = ?").bind(status, now, agent.id),
    eventStatement(db, { actor: input.actor, actorKind: opsKind(input.actor), entity: "agent", entityId: agent.id, type: status === "retired" ? "agent.retired" : "agent.status_changed", data: { from: agent.status, to: status, reason, live_version: agent.live_version } }, now),
  ]);
  await tellExpert(env, agent, status === "retired"
    ? { kind: "agent.retired", subject: `${agent.name} was taken off the marketplace`, text: `We took ${agent.name} off the marketplace, so buyers are no longer matched with it. Reason: ${reason}` }
    : { kind: "agent.testing", subject: `${agent.name} is back in testing`, text: `We moved ${agent.name} back to testing, so buyers are not matched with it for now. Reason: ${reason}` },
  input.actor);
}

/**
 * Bring a retired agent back. With a published live version it goes straight back to live on that version; otherwise
 * it goes back to draft, so the expert can publish again and ops can check it. Versions, runs and events are untouched.
 */
export async function unretireAgent(env: Env, input: { agentId: string; actor: string; reason?: string }): Promise<{ status: "live" | "draft"; liveVersion: number | null }> {
  const agent = await first<AgentRow>(env.DB, "SELECT * FROM agents WHERE id = ?", input.agentId);
  if (!agent) return fail(404, "agent_not_found", "We could not find that agent.");
  if (agent.status !== "retired") return fail(409, "not_retired", `This agent is ${agent.status}, not retired, so there is nothing to bring back.`);
  const reason = input.reason ? str(input.reason, "a note", { max: 500, optional: true }) : "";
  await noOtherActiveAgent(env, agent);
  const liveRow = agent.live_version === null ? null
    : await first<{ version: number }>(env.DB, "SELECT version FROM agent_versions WHERE agent_id = ? AND version = ? AND status = 'published'", agent.id, agent.live_version);
  const to: "live" | "draft" = liveRow ? "live" : "draft";
  const db = env.DB, now = nowIso();
  const res = await db.batch([
    db.prepare("UPDATE agents SET status = ?, updated_at = ? WHERE id = ? AND status = 'retired'").bind(to, now, agent.id),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, ?, 'agent', ?, 'agent.unretired', ? WHERE changes() = 1")
      .bind(now, input.actor, opsKind(input.actor), agent.id, JSON.stringify({ from: "retired", to, live_version: agent.live_version, reason })),
  ]);
  if (!res[0]?.meta?.changes) return fail(409, "not_retired", "Someone changed this agent a moment ago. Reload the page.");
  await tellExpert(env, agent, to === "live"
    ? { kind: "agent.unretired", subject: `${agent.name} is back on the marketplace`, text: `We brought ${agent.name} back. Version ${agent.live_version} is live again, so buyers can be matched with it.` }
    : { kind: "agent.unretired", subject: `${agent.name} is back in your studio`, text: `We brought ${agent.name} back to your studio as a draft. It is not live. Test it and publish a version, and we will check it before it goes live.` },
  input.actor);
  return { status: to, liveVersion: to === "live" ? agent.live_version : null };
}

/**
 * Refresh the expert's public persona now (outcomes follow live agents) instead of waiting for the 15-minute cron.
 * Runs after every agent status change. Loaded at call time to keep studio and experts free of an import cycle.
 */
async function syncPersona(env: Env, agent: AgentRow, actor = "system", actorKind?: ActorKind): Promise<void> {
  if (agent.kind !== "expert" || !agent.expert_id) return;
  await import("../experts/service.ts")
    .then(m => m.syncExpertPersona(env, agent.expert_id!, actor, actorKind ?? opsKind(actor)))
    .catch(err => console.error("studio_persona_sync_failed", err instanceof Error ? err.message : String(err)));
}

async function tellExpert(env: Env, agent: AgentRow, notice: { kind: string; subject: string; text: string }, actor = "system"): Promise<void> {
  if (agent.kind !== "expert" || !agent.expert_id) return;
  await syncPersona(env, agent, actor);
  const expert = await first<{ user_id: string }>(env.DB, "SELECT user_id FROM experts WHERE id = ?", agent.expert_id);
  if (!expert) return;
  await notify(env, { userId: expert.user_id, ...notice, link: `/studio/agents/${agent.id}` }).catch(err => console.error("studio_notify_failed", err instanceof Error ? err.message : String(err)));
}
