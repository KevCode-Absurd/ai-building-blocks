// Agent runs. Owner: runner module (also owns src/core/models.ts live providers and runner/workflow.ts).
// A job pins one agent version; a run executes its steps in order with a cost cap, logging every step.
import type { Env } from "../../env.ts";
import type { AgentPackage, JobRow, JobStatus, JobType, Persona, PersonaProfile, RubricCriterion } from "../../core/types.ts";
import type { ActorKind } from "../../core/events.ts";
import { eventStatement, recordEvent } from "../../core/events.ts";
import { all, first, newId, nowIso, parseJson, run, sha256Hex } from "../../core/db.ts";
import { getJob, STATUS_LABELS, transitionJob } from "../../core/jobs.ts";
import { callModel, ModelError, type ModelResponse, type Provider, type WebSource } from "../../core/models.ts";
import { fail, HttpError } from "../../core/http.ts";
import { getJobType, listJobTypes } from "../catalogue/index.ts";
import { housePersonas } from "../directory/index.ts";
import { afterJobDraft, checkDraft } from "../evaluation/service.ts";
import { releaseDraft } from "../delivery/service.ts";
import { notifyOps } from "../ops/service.ts";
import { buildHousePackage, isLongJob, packageSha, renderPrompt, specMarkdown, type PromptContext } from "./packages.ts";

type RunKind = "job" | "revision" | "baseline" | "test" | "certification";
type RunStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";

export interface RunRow {
  id: string; job_id: string | null; kind: RunKind; agent_id: string | null; agent_version: number | null; status: RunStatus;
  input: string; attempt: number; workflow_id: string | null; input_tokens: number; output_tokens: number; cost_micro_usd: number;
  error: string | null; created_at: string; started_at: string | null; finished_at: string | null;
}

/** What a run was given, frozen in runs.input so every draft can be traced to its inputs. */
export interface RunInput {
  mode: "job" | "revision" | "rerun" | "test" | "certification" | "baseline";
  brief: string;
  spec: Record<string, unknown>;
  rubric: RubricCriterion[];
  brand: Record<string, unknown>;
  jobTypeId: string | null;
  /** The buyer's change request (revision) or the ops note (rerun). */
  feedback: string;
  /** The draft this run improves on: the one the buyer saw, or the one that failed the check. */
  previousDraftId: string | null;
  /** True for the one automatic rerun after a failed check. */
  checkRerun?: boolean;
  checkFeedback?: string;
}

/** A clean stop with a plain-words reason (cost cap, bad package, empty draft). */
class RunStop extends Error {
  code: string;
  constructor(code: string, message: string) { super(message); this.code = code; }
}

const START_FROM: Record<"job" | "revision" | "rerun", JobStatus[]> = {
  job: ["confirmed"],
  revision: ["revising"],
  rerun: ["in_review", "failed", "rejected", "disputed"],
};

// Live, with a published live version, and (for expert agents) an expert who is still approved: pausing an expert
// takes all of their agents out of matching straight away.
const LIVE_AGENT = "a.status = 'live' AND a.live_version IS NOT NULL AND EXISTS (SELECT 1 FROM agent_versions v WHERE v.agent_id = a.id AND v.version = a.live_version AND v.status = 'published')"
  + " AND (a.expert_id IS NULL OR EXISTS (SELECT 1 FROM experts e WHERE e.id = a.expert_id AND e.status = 'approved'))";

// ---------- Picking an agent ----------

/** The agent for a new job: the persona's live agent for the job type, else the best live expert agent, else the house agent. */
export async function pickAgent(env: Env, jobTypeId: string, personaId?: string | null): Promise<{ agentId: string; version: number } | null> {
  const db = env.DB;
  type Pick = { id: string; live_version: number };
  if (personaId) {
    const own = await first<Pick>(db, `SELECT a.id, a.live_version FROM agents a WHERE a.persona_id = ? AND a.job_type_id = ? AND ${LIVE_AGENT}
      ORDER BY (a.kind = 'expert') DESC, a.updated_at DESC LIMIT 1`, personaId, jobTypeId);
    if (own) return { agentId: own.id, version: own.live_version };
  }
  // "Best" expert agent: most accepted jobs, then the best average rating, then the longest-serving.
  const expert = await first<Pick>(db, `SELECT a.id, a.live_version,
      (SELECT COUNT(*) FROM jobs j WHERE j.agent_id = a.id AND j.status = 'accepted') AS accepted,
      (SELECT AVG(d.rating) FROM decisions d JOIN jobs j ON j.id = d.job_id WHERE j.agent_id = a.id AND d.rating IS NOT NULL) AS rating
    FROM agents a WHERE a.kind = 'expert' AND a.job_type_id = ? AND ${LIVE_AGENT}
    ORDER BY accepted DESC, COALESCE(rating, 0) DESC, a.created_at ASC LIMIT 1`, jobTypeId);
  if (expert) return { agentId: expert.id, version: expert.live_version };
  // House agent: the generic one first, then a house persona's agent for the job type.
  const house = await first<Pick>(db, `SELECT a.id, a.live_version FROM agents a LEFT JOIN personas p ON p.id = a.persona_id
    WHERE a.kind = 'house' AND a.job_type_id = ? AND ${LIVE_AGENT}
    ORDER BY (a.persona_id IS NOT NULL) ASC, COALESCE(p.sort, 0) ASC, a.created_at ASC LIMIT 1`, jobTypeId);
  return house ? { agentId: house.id, version: house.live_version } : null;
}

// ---------- Starting a job run ----------

/**
 * Start a run for a job. kind "job" from confirmed; "revision" from revising (feedback = the buyer's reasons);
 * "rerun" from in_review / failed / rejected / disputed by ops. Pins the agent version on the first run,
 * creates the run row, moves the job to running and starts the JOB_RUN workflow (inline when there is no binding:
 * through exec.waitUntil when given, otherwise awaited).
 */
export async function startJobRun(env: Env, input: { jobId: string; actor: string; actorKind: ActorKind; kind?: "job" | "revision" | "rerun"; feedback?: string; agentId?: string; agentVersion?: number; exec?: { waitUntil(promise: Promise<unknown>): void } }): Promise<{ runId: string }> {
  const db = env.DB;
  const kind = input.kind ?? "job";
  const job = await getJob(env, input.jobId);
  if (!job) return fail(404, "job_not_found", "We could not find that job.");
  if (!START_FROM[kind].includes(job.status)) {
    return fail(409, "cannot_start_run", `This job is "${STATUS_LABELS[job.status]}", so work cannot start on it right now.`);
  }
  const jobType = getJobType(job.job_type_id);
  if (!jobType) return fail(409, "no_job_type", "This job has no job type yet, so no agent can take it. Our team will pick one.");

  const agent = await resolveAgent(env, job, input);
  if (!agent) {
    await alertOps(env, job, "no_agent", `No agent for: ${jobTitle(job)}`, `No live agent can take "${jobTitle(job)}" (${jobType.title}). Seed the house agents or put an agent live, then rerun the job.`);
    return fail(503, "no_agent", "No agent is ready for this job yet. Our team has been told and will follow up.");
  }

  const runInput = await jobRunInput(env, job, kind, input.feedback ?? "");
  const count = await first<{ n: number }>(db, "SELECT COUNT(*) AS n FROM runs WHERE job_id = ? AND kind IN ('job','revision')", job.id);
  const runId = newId("run"), now = nowIso();
  await db.batch([
    db.prepare("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, input, attempt, created_at) VALUES (?, ?, ?, ?, ?, 'queued', ?, ?, ?)")
      .bind(runId, job.id, kind === "revision" ? "revision" : "job", agent.agentId, agent.version, JSON.stringify(runInput), (count?.n ?? 0) + 1, now),
    eventStatement(db, { actor: input.actor, actorKind: input.actorKind, entity: "run", entityId: runId, type: "run.created", data: { job_id: job.id, kind, agent_id: agent.agentId, agent_version: agent.version } }, now),
  ]);

  const set: Record<string, string | number | null> = {};
  if (job.agent_id !== agent.agentId || job.agent_version !== agent.version) { set.agent_id = agent.agentId; set.agent_version = agent.version; }
  try {
    await transitionJob(env, {
      jobId: job.id, to: "running", actor: input.actor, actorKind: input.actorKind, set,
      data: { run_id: runId, run_kind: kind, agent_id: agent.agentId, agent_version: agent.version },
    });
  } catch (err) {
    await markRun(env, runId, "cancelled", "The job changed before the run could start.", "job_changed");
    throw err;
  }
  await launch(env, runId, input.exec);
  return { runId };
}

async function resolveAgent(env: Env, job: JobRow, input: { agentId?: string; agentVersion?: number }): Promise<{ agentId: string; version: number } | null> {
  if (input.agentId) {
    const agent = await first<{ live_version: number | null; job_type_id: string }>(env.DB, "SELECT live_version, job_type_id FROM agents WHERE id = ?", input.agentId);
    const version = input.agentVersion ?? agent?.live_version ?? null;
    const published = agent && version ? await first(env.DB, "SELECT 1 AS ok FROM agent_versions WHERE agent_id = ? AND version = ? AND status = 'published'", input.agentId, version) : null;
    if (!agent || !version || !published) return fail(400, "agent_not_ready", "That agent version is not published, so it cannot take this job.");
    if (agent.job_type_id !== job.job_type_id) return fail(400, "agent_wrong_job_type", "That agent is built for a different kind of job.");
    return { agentId: input.agentId, version };
  }
  if (job.agent_id && job.agent_version) return { agentId: job.agent_id, version: job.agent_version };
  return pickAgent(env, job.job_type_id!, job.persona_id);
}

async function jobRunInput(env: Env, job: JobRow, kind: "job" | "revision" | "rerun", feedback: string): Promise<RunInput> {
  const db = env.DB;
  const brief = await first<{ request_text: string; spec: string; answers: string }>(db, "SELECT request_text, spec, answers FROM briefs WHERE job_id = ?", job.id);
  const rubricRow = await first<{ criteria: string }>(db, "SELECT criteria FROM rubrics WHERE job_id = ?", job.id);
  const org = await first<{ brand_profile: string }>(db, "SELECT brand_profile FROM orgs WHERE id = ?", job.org_id);
  const spec = parseJson<Record<string, unknown>>(brief?.spec, {});
  // Answers to the intake questions are keyed by spec field id; a given answer is the buyer's own word on that field.
  for (const [k, v] of Object.entries(parseJson<Record<string, unknown>>(brief?.answers, {}))) if (v !== null && v !== undefined && v !== "") spec[k] = v;

  let previousDraftId: string | null = null;
  if (kind !== "job") {
    const released = kind === "revision" ? await first<{ id: string }>(db, "SELECT id FROM drafts WHERE job_id = ? AND released_at IS NOT NULL ORDER BY version DESC LIMIT 1", job.id) : null;
    const latest = released ?? await first<{ id: string }>(db, "SELECT id FROM drafts WHERE job_id = ? ORDER BY version DESC LIMIT 1", job.id);
    previousDraftId = latest?.id ?? null;
  }
  if (kind === "revision" && !feedback.trim()) {
    const decision = await first<{ reasons: string; failed_criteria: string }>(db, "SELECT reasons, failed_criteria FROM decisions WHERE job_id = ? AND kind = 'revise' ORDER BY created_at DESC LIMIT 1", job.id);
    if (decision) {
      const failed = parseJson<string[]>(decision.failed_criteria, []);
      feedback = [decision.reasons, failed.length ? `Checklist items the buyer marked as not met: ${failed.join(", ")}` : ""].filter(Boolean).join("\n");
    }
  }
  return {
    mode: kind,
    brief: brief?.request_text ?? "",
    spec,
    rubric: parseJson<RubricCriterion[]>(rubricRow?.criteria, getJobType(job.job_type_id)?.rubric ?? []),
    brand: parseJson<Record<string, unknown>>(org?.brand_profile, {}),
    jobTypeId: job.job_type_id,
    feedback,
    previousDraftId,
  };
}

async function launch(env: Env, runId: string, exec?: { waitUntil(promise: Promise<unknown>): void }): Promise<void> {
  if (env.JOB_RUN) {
    try {
      const wf = await env.JOB_RUN.create({ id: runId, params: { runId } });
      await run(env.DB, "UPDATE runs SET workflow_id = ? WHERE id = ?", wf.id, runId);
    } catch {
      const r = await getRun(env, runId);
      if (r) await failJobRun(env, r, new RunStop("workflow_start_failed", "We could not start the agent run."));
    }
    return;
  }
  const work = executeRun(env, runId).catch(err => { console.error("runner_inline_failed", err instanceof Error ? err.name : "error"); });
  if (exec) exec.waitUntil(work); else await work;
}

// ---------- Executing a job run ----------

/**
 * Execute a run end to end (called by the workflow). For job runs: writes the draft, moves the job to checking,
 * calls evaluation.checkDraft, reruns once with the check feedback if it fails, then moves the job to in_review
 * (RELEASE_REVIEW=required) or releases it (delivery.releaseDraft). Also calls evaluation.afterJobDraft.
 * Safe to call again for the same run: finished runs return at once, and finished steps are not repeated.
 */
export async function executeRun(env: Env, runId: string): Promise<{ draftId: string | null }> {
  const r = await getRun(env, runId);
  if (!r) return fail(404, "run_not_found", "We could not find that run.");
  if (r.kind !== "job" && r.kind !== "revision") return { draftId: (await draftForRun(env, r.id))?.id ?? null };
  if (r.status === "failed" || r.status === "cancelled") return { draftId: null };
  return executeJobRun(env, r);
}

async function executeJobRun(env: Env, r: RunRow): Promise<{ draftId: string | null }> {
  const input = parseJson<RunInput | null>(r.input, null);
  const job = r.job_id ? await getJob(env, r.job_id) : null;
  if (!input || !job) {
    await markRun(env, r.id, "failed", "This run has no job or inputs to work from.", "bad_run");
    return { draftId: null };
  }
  let draft = await draftForRun(env, r.id);
  if (!draft) {
    if (job.status !== "running") {
      await markRun(env, r.id, "cancelled", `The job is "${STATUS_LABELS[job.status]}", so this run stopped.`, "job_moved_on");
      return { draftId: null };
    }
    try {
      await markRunStarted(env, r.id);
      const pkg = await loadPackage(env, r.agent_id, r.agent_version);
      const ctx = await promptContext(env, input);
      const out = await executeSteps(env, r, pkg, ctx);
      draft = await writeDraft(env, { runId: r.id, jobId: job.id, content: out.content, fingerprintKey: job.id });
      await markRun(env, r.id, "succeeded");
    } catch (err) {
      await failJobRun(env, r, err);
      return { draftId: null };
    }
  } else if (r.status !== "succeeded") {
    await markRun(env, r.id, "succeeded");
  }
  return checkAndRoute(env, r, input, draft.id);
}

async function checkAndRoute(env: Env, r: RunRow, input: RunInput, draftId: string): Promise<{ draftId: string | null }> {
  let job = (await getJob(env, r.job_id!))!;
  if (job.status === "running") {
    job = await transitionJob(env, { jobId: job.id, to: "checking", actor: "system", actorKind: "system", data: { run_id: r.id, draft_id: draftId } });
  } else if (job.status !== "checking") {
    return { draftId };
  }
  const title = jobTitle(job);
  const writerProvider = await writerOf(env, r.id);

  let check: Awaited<ReturnType<typeof checkDraft>>;
  try {
    check = await checkDraft(env, { draftId, rubric: input.rubric, jobTypeId: input.jobTypeId ?? job.job_type_id ?? "", brief: input.brief, writerProvider });
  } catch {
    await toReview(env, job, r.id, draftId, { check_error: true }, "check_error", `Checks could not run: ${title}`,
      `The agent finished a draft for "${title}", but the automatic checks could not run. Read the draft yourself, then release it or rerun the job.`);
    await maybeAfterJobDraft(env, input, job.id, draftId);
    return { draftId };
  }

  if (!check.passed && !input.checkRerun) {
    const next = await queueCheckRerun(env, r, input, draftId, check.feedback);
    if (next) return executeJobRun(env, next);
    return { draftId };
  }
  if (!check.passed) {
    await toReview(env, job, r.id, draftId, { checks_failed: true }, "draft_failed_checks", `Draft failed checks twice: ${title}`,
      `The draft for "${title}" failed the automatic checks twice. Read the check notes, then release it, edit it or rerun the job.`);
  } else if (env.RELEASE_REVIEW !== "off") {
    await toReview(env, job, r.id, draftId, {}, "draft_ready", `Draft ready for review: ${title}`,
      `The draft for "${title}" passed the automatic checks. Review it and release it to the buyer.`);
  } else {
    try {
      await releaseDraft(env, { jobId: job.id, draftId, actor: "system", actorKind: "system" });
    } catch {
      await toReview(env, job, r.id, draftId, { release_error: true }, "release_error", `Release failed: ${title}`,
        `The draft for "${title}" passed its checks, but we could not send it to the buyer. Release it from the job page.`);
    }
  }
  await maybeAfterJobDraft(env, input, job.id, draftId);
  return { draftId };
}

async function queueCheckRerun(env: Env, r: RunRow, input: RunInput, draftId: string, feedback: string): Promise<RunRow | null> {
  const db = env.DB, now = nowIso(), runId = newId("run");
  const nextInput: RunInput = { ...input, checkRerun: true, checkFeedback: feedback?.trim() || "The draft did not pass the rubric. Check every rubric item again.", previousDraftId: draftId };
  await db.batch([
    db.prepare("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, input, attempt, workflow_id, created_at) VALUES (?, ?, ?, ?, ?, 'queued', ?, ?, ?, ?)")
      .bind(runId, r.job_id, r.kind, r.agent_id, r.agent_version, JSON.stringify(nextInput), r.attempt + 1, r.workflow_id, now),
    eventStatement(db, { actor: "system", actorKind: "system", entity: "run", entityId: runId, type: "run.created", data: { job_id: r.job_id, kind: "check_rerun", after_run: r.id, draft_id: draftId } }, now),
  ]);
  try {
    await transitionJob(env, { jobId: r.job_id!, to: "running", actor: "system", actorKind: "system", data: { run_id: runId, reason: "check_failed", draft_id: draftId } });
  } catch {
    await markRun(env, runId, "cancelled", "The job changed before the rerun could start.", "job_changed");
    return null;
  }
  return getRun(env, runId);
}

async function toReview(env: Env, job: JobRow, runId: string, draftId: string, flags: Record<string, unknown>, kind: string, subject: string, text: string): Promise<void> {
  try {
    await transitionJob(env, { jobId: job.id, to: "in_review", actor: "system", actorKind: "system", data: { run_id: runId, draft_id: draftId, ...flags } });
  } catch {
    return; // the job moved on (for example, ops cancelled it)
  }
  await alertOps(env, job, kind, subject, text);
}

async function maybeAfterJobDraft(env: Env, input: RunInput, jobId: string, draftId: string): Promise<void> {
  if (input.mode !== "job") return; // only the job's first execution, not revisions or reruns
  try {
    await afterJobDraft(env, { jobId, draftId });
  } catch (err) {
    const code = err instanceof HttpError || err instanceof ModelError ? err.code : "error";
    await recordEvent(env.DB, { actor: "system", actorKind: "system", entity: "job", entityId: jobId, type: "evaluation.after_draft_failed", data: { draft_id: draftId, code } }).catch(() => {});
  }
}

async function failJobRun(env: Env, r: RunRow, err: unknown): Promise<void> {
  const { code, message } = describeError(err);
  await markRun(env, r.id, "failed", message, code);
  if (!r.job_id) return;
  const job = await getJob(env, r.job_id);
  if (!job) return;
  const newer = await first<{ n: number }>(env.DB, "SELECT COUNT(*) AS n FROM runs WHERE job_id = ? AND kind IN ('job','revision') AND created_at > ? AND id <> ?", job.id, r.created_at, r.id);
  if ((newer?.n ?? 0) > 0) return; // a later run owns the job now
  if (job.status !== "running" && job.status !== "checking") return; // the job moved on (for example, ops cancelled it)
  try { await transitionJob(env, { jobId: job.id, to: "failed", actor: "system", actorKind: "system", data: { run_id: r.id, reason: code } }); } catch { return; }
  await alertOps(env, job, "job_run_failed", `Job failed: ${jobTitle(job)}`,
    `The agent run for "${jobTitle(job)}" stopped. Reason: ${message} Open the job to rerun it or follow up with the buyer.`);
}

function describeError(err: unknown): { code: string; message: string } {
  if (err instanceof RunStop || err instanceof ModelError || err instanceof HttpError) return { code: err.code, message: err.message };
  console.error("runner_error", err instanceof Error ? err.name : typeof err);
  return { code: "run_error", message: "Something went wrong while the agent was working." };
}

// ---------- Steps ----------

async function executeSteps(env: Env, r: RunRow, pkg: AgentPackage, ctx: PromptContext): Promise<{ content: string; provider: Provider | undefined }> {
  const db = env.DB;
  const cap = costCapMicro(env);
  const done = await all<{ seq: number; step_id: string; output: string | null; provider: Provider | null; sources: string | null }>(db,
    "SELECT seq, step_id, output, provider, sources FROM run_steps WHERE run_id = ? AND status = 'succeeded'", r.id);
  // outputs feed later steps' prompts (with the pages each step cited); raw holds each step's own reply.
  const outputs: Record<string, string> = {}, raw: Record<string, string> = {};
  const cited: WebSource[] = [];
  const keep = (stepId: string, output: string, sources: WebSource[]) => {
    raw[stepId] = output;
    outputs[stepId] = sources.length ? `${output}\n\n${citedNote(sources)}` : output;
    for (const s of sources) if (!cited.some(c => c.url === s.url)) cited.push(s);
  };
  const searches = webSearchUses(env);
  let writer: Provider | undefined;
  for (let i = 0; i < pkg.steps.length; i++) {
    const step = pkg.steps[i], seq = i + 1;
    const prior = done.find(d => d.seq === seq && d.step_id === step.id);
    if (prior) { keep(step.id, prior.output ?? "", parseJson<WebSource[]>(prior.sources, [])); writer = prior.provider ?? writer; continue; }
    if (await spentMicro(env, r) >= cap) {
      throw new RunStop("job_cost_cap", "This job reached its spending limit for AI work, so the agent stopped.");
    }
    const prompt = renderPrompt(step.prompt, { ...ctx, steps: outputs });
    await run(db, "INSERT OR REPLACE INTO run_steps (run_id, seq, step_id, status, started_at) VALUES (?, ?, ?, 'running', ?)", r.id, seq, step.id, nowIso());
    let res: ModelResponse;
    try {
      res = await callModel(env, {
        purpose: `runner.step.${step.id}`, tier: step.tier, system: pkg.skill.instructions, prompt,
        json: step.output === "json", maxTokens: step.max_tokens, jobId: r.job_id ?? undefined, runId: r.id,
        ...(step.output !== "json" && searches ? { webSearch: searches } : {}),
      });
    } catch (err) {
      const billed = err instanceof ModelError ? err.costMicroUsd : 0;
      const e = err instanceof ModelError ? err : null;
      await db.batch([
        db.prepare("UPDATE run_steps SET status = 'failed', provider = ?, model = ?, cost_micro_usd = ?, error = ?, finished_at = ? WHERE run_id = ? AND seq = ?")
          .bind(e?.provider ?? null, e?.model ?? null, billed, describeError(err).message, nowIso(), r.id, seq),
        db.prepare("UPDATE runs SET cost_micro_usd = cost_micro_usd + ? WHERE id = ?").bind(billed, r.id),
      ]);
      throw err;
    }
    const output = step.output === "json" && res.data !== undefined ? JSON.stringify(res.data) : res.text;
    const sources = res.sources ?? [];
    await db.batch([
      db.prepare("UPDATE run_steps SET status = 'succeeded', provider = ?, model = ?, input_tokens = ?, output_tokens = ?, cost_micro_usd = ?, output = ?, sources = ?, finished_at = ? WHERE run_id = ? AND seq = ?")
        .bind(res.provider, res.model, res.inputTokens, res.outputTokens, res.costMicroUsd, output, sources.length ? JSON.stringify(sources) : null, nowIso(), r.id, seq),
      db.prepare("UPDATE runs SET input_tokens = input_tokens + ?, output_tokens = output_tokens + ?, cost_micro_usd = cost_micro_usd + ? WHERE id = ?")
        .bind(res.inputTokens, res.outputTokens, res.costMicroUsd, r.id),
    ]);
    keep(step.id, output, sources);
    writer = res.provider;
  }
  const last = pkg.steps[pkg.steps.length - 1];
  const draft = cleanDraft(raw[last.id] ?? "");
  if (!draft) throw new RunStop("empty_draft", "The agent finished without writing a draft.");
  return { content: last.output === "json" ? draft : withSources(draft, cited), provider: writer };
}

/** WEB_SEARCH_MAX_USES: the most web searches one text step may run. "0" or unset = no web search. */
export function webSearchUses(env: Env): number {
  const n = Number(env.WEB_SEARCH_MAX_USES ?? "0");
  return Number.isFinite(n) && n > 0 ? Math.min(20, Math.floor(n)) : 0;
}

/** Handed to later steps with a step's output, so they can cite the same pages. */
function citedNote(sources: WebSource[]): string {
  return `Pages this step cited:\n${sources.map(s => `- ${s.title}: ${s.url}`).join("\n")}`;
}

/** The draft plus a "Sources from web search" list: every cited page the text does not already link. The search
 *  provider's terms require showing the sources with the text, and buyers should be able to check them. */
export function withSources(content: string, sources: WebSource[]): string {
  const fresh = sources.filter(s => !content.includes(s.url));
  if (!fresh.length) return content;
  const link = (s: WebSource) => `- [${s.title.replace(/[[\]]/g, "")}](${s.url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`;
  return `${content}\n\n## Sources from web search\n\n${fresh.map(link).join("\n")}`;
}

/** Strip a code fence wrapped around the whole reply. */
export function cleanDraft(text: string): string {
  const t = text.trim();
  const fenced = /^```(?:markdown|md)?[ \t]*\n([\s\S]*?)\n```$/.exec(t);
  return (fenced ? fenced[1] : t).trim();
}

function costCapMicro(env: Env): number {
  const usd = Number(env.JOB_COST_CAP_USD ?? "2");
  return Math.round((Number.isFinite(usd) && usd > 0 ? usd : 2) * 1_000_000);
}

/** Spend so far: every run of the job (job, revision, baseline), or this run alone when there is no job. */
async function spentMicro(env: Env, r: { id: string; job_id: string | null }): Promise<number> {
  const row = r.job_id
    ? await first<{ micro: number }>(env.DB, "SELECT COALESCE(SUM(cost_micro_usd), 0) AS micro FROM runs WHERE job_id = ?", r.job_id)
    : await first<{ micro: number }>(env.DB, "SELECT cost_micro_usd AS micro FROM runs WHERE id = ?", r.id);
  return row?.micro ?? 0;
}

async function promptContext(env: Env, input: RunInput): Promise<PromptContext> {
  const previous = input.previousDraftId ? (await first<{ content: string }>(env.DB, "SELECT content FROM drafts WHERE id = ?", input.previousDraftId))?.content ?? "" : "";
  const parts: string[] = [];
  if (input.feedback.trim()) parts.push(`${input.mode === "revision" ? "The buyer asked for these changes" : "Our reviewer asked for these changes"}:\n${input.feedback.trim()}`);
  if (input.checkFeedback?.trim()) parts.push(`Our quality check found these problems in the earlier version. Fix every one:\n${input.checkFeedback.trim()}`);
  return {
    request: input.brief, spec: input.spec, specFields: getJobType(input.jobTypeId)?.spec_fields ?? [], rubric: input.rubric,
    brand: input.brand, previous, feedback: parts.join("\n\n"), steps: {},
  };
}

async function loadPackage(env: Env, agentId: string | null, version: number | null): Promise<AgentPackage> {
  const row = agentId && version ? await first<{ package: string }>(env.DB, "SELECT package FROM agent_versions WHERE agent_id = ? AND version = ?", agentId, version) : null;
  const pkg = parseJson<AgentPackage | null>(row?.package, null);
  if (!pkg || !Array.isArray(pkg.steps) || !pkg.steps.length || !pkg.skill?.instructions) {
    throw new RunStop("bad_package", "This agent version cannot run because its package is incomplete.");
  }
  return pkg;
}

// ---------- Rows and events ----------

async function getRun(env: Env, runId: string): Promise<RunRow | null> {
  return first<RunRow>(env.DB, "SELECT * FROM runs WHERE id = ?", runId);
}

async function draftForRun(env: Env, runId: string): Promise<{ id: string } | null> {
  return first<{ id: string }>(env.DB, "SELECT id FROM drafts WHERE run_id = ? ORDER BY created_at DESC LIMIT 1", runId);
}

async function writerOf(env: Env, runId: string): Promise<Provider | undefined> {
  const row = await first<{ provider: Provider | null }>(env.DB, "SELECT provider FROM run_steps WHERE run_id = ? AND status = 'succeeded' ORDER BY seq DESC LIMIT 1", runId);
  return row?.provider ?? undefined;
}

async function markRunStarted(env: Env, runId: string): Promise<void> {
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE runs SET status = 'running', started_at = COALESCE(started_at, ?) WHERE id = ? AND status = 'queued'").bind(now, runId),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, 'system', 'system', 'run', ?, 'run.started', '{}' WHERE changes() = 1").bind(now, runId),
  ]);
}

async function markRun(env: Env, runId: string, status: "succeeded" | "failed" | "cancelled", error?: string, code?: string): Promise<void> {
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE runs SET status = ?, error = ?, finished_at = ? WHERE id = ?").bind(status, error ?? null, now, runId),
    eventStatement(db, { actor: "system", actorKind: "system", entity: "run", entityId: runId, type: `run.${status}`, data: code ? { code } : {} }, now),
  ]);
}

async function writeDraft(env: Env, input: { runId: string; jobId: string | null; content: string; fingerprintKey: string }): Promise<{ id: string; version: number }> {
  const db = env.DB, now = nowIso(), id = newId("draft");
  const version = input.jobId ? ((await first<{ v: number }>(db, "SELECT COALESCE(MAX(version), 0) AS v FROM drafts WHERE job_id = ?", input.jobId))?.v ?? 0) + 1 : 1;
  const fingerprint = await sha256Hex(input.content + input.fingerprintKey);
  await db.batch([
    db.prepare("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, ?, ?, ?, ?, 'markdown', ?, ?)")
      .bind(id, input.jobId, input.runId, version, input.content, fingerprint, now),
    eventStatement(db, { actor: "system", actorKind: "system", entity: "draft", entityId: id, type: "draft.created", data: { run_id: input.runId, job_id: input.jobId, version } }, now),
  ]);
  return { id, version };
}

function jobTitle(job: JobRow): string {
  return job.title || getJobType(job.job_type_id)?.title || job.id;
}

async function alertOps(env: Env, job: JobRow, kind: string, subject: string, text: string): Promise<void> {
  try { await notifyOps(env, { kind, subject, text, link: `/ops/jobs/${job.id}` }); } catch { /* notifyOps never throws; belt and braces */ }
}

// ---------- Runs outside a job ----------

/** Run an agent version on a brief outside a job: studio test bench ("test") or certification. */
export async function runAgentOnBrief(env: Env, input: { agentId: string; version: number; brief: string; spec?: Record<string, unknown>; rubric?: RubricCriterion[]; kind: "test" | "certification"; actor: string }): Promise<{ runId: string; draftId: string }> {
  const db = env.DB;
  const agent = await first<{ job_type_id: string }>(db, "SELECT job_type_id FROM agents WHERE id = ?", input.agentId);
  if (!agent) return fail(404, "agent_not_found", "We could not find that agent.");
  const jobType = getJobType(agent.job_type_id);
  const runInput: RunInput = {
    mode: input.kind, brief: input.brief, spec: input.spec ?? {}, rubric: input.rubric ?? jobType?.rubric ?? [], brand: {},
    jobTypeId: agent.job_type_id, feedback: "", previousDraftId: null,
  };
  const r = await createSideRun(env, { kind: input.kind, jobId: null, agentId: input.agentId, version: input.version, input: runInput, actor: input.actor });
  try {
    const pkg = await loadPackage(env, input.agentId, input.version);
    const out = await executeSteps(env, r, pkg, await promptContext(env, runInput));
    const draft = await writeDraft(env, { runId: r.id, jobId: null, content: out.content, fingerprintKey: r.id });
    await markRun(env, r.id, "succeeded");
    return { runId: r.id, draftId: draft.id };
  } catch (err) {
    const { code, message } = describeError(err);
    await markRun(env, r.id, "failed", message, code);
    throw new HttpError(502, code, message);
  }
}

/** The plain-AI baseline: the job type's baseline_prompt on the standard tier, same brief. */
export async function runBaseline(env: Env, input: { jobTypeId: string; brief: string; spec?: Record<string, unknown>; rubric?: RubricCriterion[]; jobId?: string }): Promise<{ runId: string; draftId: string }> {
  const jobType = getJobType(input.jobTypeId);
  if (!jobType) return fail(404, "job_type_not_found", "We could not find that kind of job.");
  const runInput: RunInput = {
    mode: "baseline", brief: input.brief, spec: input.spec ?? {}, rubric: input.rubric ?? jobType.rubric, brand: {},
    jobTypeId: jobType.id, feedback: "", previousDraftId: null,
  };
  const r = await createSideRun(env, { kind: "baseline", jobId: input.jobId ?? null, agentId: null, version: null, input: runInput, actor: "system" });
  try {
    if (await spentMicro(env, r) >= costCapMicro(env)) throw new RunStop("job_cost_cap", "This job reached its spending limit for AI work, so the baseline was skipped.");
    const prompt = baselinePrompt(jobType, runInput);
    const started = nowIso();
    let res: ModelResponse;
    try {
      // Same web search as the agent gets, so the comparison is fair.
      const searches = webSearchUses(env);
      res = await callModel(env, {
        purpose: "runner.baseline", tier: "standard", system: jobType.baseline_prompt, prompt, maxTokens: isLongJob(jobType) ? 12000 : 6000, jobId: input.jobId, runId: r.id,
        ...(searches ? { webSearch: searches } : {}),
      });
    } catch (err) {
      const billed = err instanceof ModelError ? err.costMicroUsd : 0;
      await env.DB.batch([
        env.DB.prepare("INSERT INTO run_steps (run_id, seq, step_id, status, cost_micro_usd, error, started_at, finished_at) VALUES (?, 1, 'baseline', 'failed', ?, ?, ?, ?)")
          .bind(r.id, billed, describeError(err).message, started, nowIso()),
        env.DB.prepare("UPDATE runs SET cost_micro_usd = cost_micro_usd + ? WHERE id = ?").bind(billed, r.id),
      ]);
      throw err;
    }
    const text = cleanDraft(res.text);
    const sources = res.sources ?? [];
    const content = text ? withSources(text, sources) : "";
    await env.DB.batch([
      env.DB.prepare("INSERT INTO run_steps (run_id, seq, step_id, provider, model, status, input_tokens, output_tokens, cost_micro_usd, output, sources, started_at, finished_at) VALUES (?, 1, 'baseline', ?, ?, 'succeeded', ?, ?, ?, ?, ?, ?, ?)")
        .bind(r.id, res.provider, res.model, res.inputTokens, res.outputTokens, res.costMicroUsd, text, sources.length ? JSON.stringify(sources) : null, started, nowIso()),
      env.DB.prepare("UPDATE runs SET input_tokens = input_tokens + ?, output_tokens = output_tokens + ?, cost_micro_usd = cost_micro_usd + ? WHERE id = ?")
        .bind(res.inputTokens, res.outputTokens, res.costMicroUsd, r.id),
    ]);
    if (!content) throw new RunStop("empty_draft", "The baseline finished without writing a draft.");
    // Baseline drafts never carry job_id, so they can never be mistaken for (or released as) the job's draft.
    const draft = await writeDraft(env, { runId: r.id, jobId: null, content, fingerprintKey: input.jobId ?? r.id });
    await markRun(env, r.id, "succeeded");
    return { runId: r.id, draftId: draft.id };
  } catch (err) {
    const { code, message } = describeError(err);
    await markRun(env, r.id, "failed", message, code);
    throw new HttpError(502, code, message);
  }
}

function baselinePrompt(jobType: JobType, input: RunInput): string {
  // Plain AI gets what a buyer would paste into a chat: the request, the details and the goals they named.
  // The platform's own template criteria stay with the agents.
  const goals = input.rubric.filter(c => c.source === "buyer").map(c => `- ${c.text}`);
  return [
    `## Request\n${input.brief.trim() || "(none given)"}`,
    `## Details\n${specMarkdown(input.spec, jobType.spec_fields)}`,
    ...(goals.length ? [`## What matters to me\n${goals.join("\n")}`] : []),
    "Write the full deliverable in markdown.",
  ].join("\n\n");
}

async function createSideRun(env: Env, s: { kind: RunKind; jobId: string | null; agentId: string | null; version: number | null; input: RunInput; actor: string }): Promise<RunRow> {
  const db = env.DB, now = nowIso(), id = newId("run");
  await db.batch([
    db.prepare("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, input, attempt, created_at, started_at) VALUES (?, ?, ?, ?, ?, 'running', ?, 1, ?, ?)")
      .bind(id, s.jobId, s.kind, s.agentId, s.version, JSON.stringify(s.input), now, now),
    eventStatement(db, { actor: s.actor, actorKind: s.actor === "system" ? "system" : "expert", entity: "run", entityId: id, type: "run.created", data: { kind: s.kind, job_id: s.jobId, agent_id: s.agentId, agent_version: s.version } }, now),
  ]);
  return (await getRun(env, id))!;
}

// ---------- House agents ----------

interface PersonaRowDb { id: string; kind: "house" | "expert"; name: string; title: string; tagline: string; area: Persona["area"]; profile: string; status: "live" | "hidden"; sort: number }

/**
 * Build and publish house agents (idempotent): one agent per (house persona outcome with a job_type_id), version 1 compiled
 * from the persona's method and the job type, status live; plus one generic house agent per job type no persona covers.
 * Run after directory.seedPersonas. A changed package is published as a new version (published versions never change).
 * Returns how many agents were created, and how many got a new version.
 */
export async function seedHouseAgents(env: Env, actor: string): Promise<{ created: number; updated: number }> {
  const db = env.DB;
  const personas = (await housePersonaList(env, actor)).filter(p => p.status === "live");

  const targets: { persona: Persona | null; jobType: JobType }[] = [];
  const seen = new Set<string>(), covered = new Set<string>();
  for (const persona of personas) {
    for (const outcome of persona.profile.outcomes ?? []) {
      const jobType = getJobType(outcome.job_type_id);
      if (!jobType || seen.has(`${persona.id}|${jobType.id}`)) continue;
      seen.add(`${persona.id}|${jobType.id}`);
      covered.add(jobType.id);
      targets.push({ persona, jobType });
    }
  }
  for (const jobType of listJobTypes()) if (!covered.has(jobType.id)) targets.push({ persona: null, jobType });

  const existing = await all<{ id: string; persona_id: string | null; job_type_id: string; status: string; latest_version: number | null; latest_sha: string | null }>(db,
    `SELECT a.id, a.persona_id, a.job_type_id, a.status,
       (SELECT MAX(v.version) FROM agent_versions v WHERE v.agent_id = a.id) AS latest_version,
       (SELECT v.sha256 FROM agent_versions v WHERE v.agent_id = a.id ORDER BY v.version DESC LIMIT 1) AS latest_sha
     FROM agents a WHERE a.kind = 'house' ORDER BY a.created_at`);
  const byKey = new Map<string, (typeof existing)[number]>();
  for (const a of existing) if (!byKey.has(`${a.persona_id ?? ""}|${a.job_type_id}`)) byKey.set(`${a.persona_id ?? ""}|${a.job_type_id}`, a);

  let created = 0, updated = 0;
  for (const { persona, jobType } of targets) {
    const pkg = buildHousePackage(persona, jobType);
    const sha = await packageSha(pkg);
    const found = byKey.get(`${persona?.id ?? ""}|${jobType.id}`);
    const now = nowIso();
    if (!found) {
      const agentId = newId("agent");
      const name = persona ? `${persona.name}: ${jobType.title}` : `AI Blocks: ${jobType.title}`;
      await db.batch([
        db.prepare("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES (?, 'house', NULL, ?, ?, ?, 'live', 1, ?, ?)")
          .bind(agentId, persona?.id ?? null, jobType.id, name, now, now),
        db.prepare("INSERT INTO agent_versions (agent_id, version, package, sha256, changelog, status, test_results, created_at, published_at) VALUES (?, 1, ?, ?, ?, 'published', '{}', ?, ?)")
          .bind(agentId, JSON.stringify(pkg), sha, "First house version.", now, now),
        eventStatement(db, { actor, actorKind: "system", entity: "agent", entityId: agentId, type: "agent.created", data: { kind: "house", persona_id: persona?.id ?? null, job_type_id: jobType.id } }, now),
        eventStatement(db, { actor, actorKind: "system", entity: "agent", entityId: agentId, type: "agent.version_published", data: { version: 1, sha256: sha } }, now),
        eventStatement(db, { actor, actorKind: "system", entity: "agent", entityId: agentId, type: "agent.live", data: { version: 1 } }, now),
      ]);
      created++;
    } else if (found.status !== "retired" && found.latest_sha !== sha) {
      const version = (found.latest_version ?? 0) + 1;
      const statements = [
        db.prepare("INSERT INTO agent_versions (agent_id, version, package, sha256, changelog, status, test_results, created_at, published_at) VALUES (?, ?, ?, ?, ?, 'published', '{}', ?, ?)")
          .bind(found.id, version, JSON.stringify(pkg), sha, "House package rebuilt from updated persona or job type.", now, now),
        eventStatement(db, { actor, actorKind: "system", entity: "agent", entityId: found.id, type: "agent.version_published", data: { version, sha256: sha } }, now),
      ];
      if (found.status === "live") {
        statements.push(
          db.prepare("UPDATE agents SET live_version = ?, updated_at = ? WHERE id = ?").bind(version, now, found.id),
          eventStatement(db, { actor, actorKind: "system", entity: "agent", entityId: found.id, type: "agent.live", data: { version } }, now),
        );
      }
      await db.batch(statements);
      updated++;
    }
  }
  return { created, updated };
}

/** House personas from the table; until the directory has seeded it, from its data files (rows added so agents can point at them). */
async function housePersonaList(env: Env, actor: string): Promise<Persona[]> {
  const db = env.DB;
  const rows = await all<PersonaRowDb>(db, "SELECT id, kind, name, title, tagline, area, profile, status, sort FROM personas WHERE kind = 'house' ORDER BY sort, id");
  if (rows.length) {
    return rows.map(r => ({ id: r.id, kind: "house", expert_id: null, name: r.name, title: r.title, tagline: r.tagline, area: r.area, status: r.status, sort: r.sort, profile: parseJson<PersonaProfile>(r.profile, { outcomes: [] } as unknown as PersonaProfile) }));
  }
  const list = [...housePersonas()].filter(p => p.kind === "house").sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id));
  const now = nowIso();
  const statements = list.flatMap(p => [
    db.prepare("INSERT OR IGNORE INTO personas (id, kind, expert_id, name, title, tagline, area, profile, status, sort, content_hash, created_at, updated_at) VALUES (?, 'house', NULL, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)")
      .bind(p.id, p.name, p.title, p.tagline, p.area, JSON.stringify(p.profile), p.status, p.sort, now, now),
    eventStatement(db, { actor, actorKind: "system", entity: "persona", entityId: p.id, type: "persona.created", data: { source: "runner.seed_house_agents" } }, now),
  ]);
  for (let i = 0; i < statements.length; i += 50) await db.batch(statements.slice(i, i + 50));
  return list;
}

// ---------- Read helpers for other modules ----------

export interface RunStepRow { seq: number; step_id: string; provider: string | null; model: string | null; status: string; input_tokens: number; output_tokens: number; cost_micro_usd: number; error: string | null; started_at: string; finished_at: string | null }

/** Every run of a job with its steps (for the ops job page). Step outputs stay in run_steps; drafts hold the work. */
export async function jobRuns(env: Env, jobId: string): Promise<(RunRow & { steps: RunStepRow[] })[]> {
  const runs = await all<RunRow>(env.DB, "SELECT * FROM runs WHERE job_id = ? ORDER BY created_at, attempt", jobId);
  const steps = await all<RunStepRow & { run_id: string }>(env.DB,
    "SELECT s.run_id, s.seq, s.step_id, s.provider, s.model, s.status, s.input_tokens, s.output_tokens, s.cost_micro_usd, s.error, s.started_at, s.finished_at FROM run_steps s JOIN runs r ON r.id = s.run_id WHERE r.job_id = ? ORDER BY s.seq", jobId);
  return runs.map(r => ({ ...r, steps: steps.filter(s => s.run_id === r.id).map(({ run_id: _r, ...s }) => s) }));
}

// ---------- Scheduled ----------

/** Fail job runs that never finished (a lost workflow or a crashed inline run), so ops hears about them. */
export async function sweepStaleRuns(env: Env, now = new Date()): Promise<number> {
  const cutoff = new Date(now.getTime() - 2 * 3600_000).toISOString();
  const stale = await all<RunRow>(env.DB, "SELECT * FROM runs WHERE status IN ('queued','running') AND kind IN ('job','revision') AND created_at < ? ORDER BY created_at LIMIT 20", cutoff);
  for (const r of stale) await failJobRun(env, r, new RunStop("run_timed_out", "The run did not finish within two hours."));
  return stale.length;
}
