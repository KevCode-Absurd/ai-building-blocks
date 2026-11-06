// Agent runs. Owner: runner module (also owns src/core/models.ts live providers and runner/workflow.ts).
// A job pins one agent version; a run executes its steps in order with a cost cap, logging every step.
import type { Env } from "../../env.ts";
import type { RubricCriterion } from "../../core/types.ts";
import type { ActorKind } from "../../core/events.ts";

/** The agent for a new job: the persona's live agent for the job type, else the best live expert agent, else the house agent. */
export async function pickAgent(env: Env, jobTypeId: string, personaId?: string | null): Promise<{ agentId: string; version: number } | null> {
  void env; void jobTypeId; void personaId; throw new Error("runner.pickAgent is not built yet");
}

/**
 * Start a run for a job. kind "job" from confirmed; "revision" from revising (feedback = the buyer's reasons);
 * "rerun" from in_review / failed / rejected / disputed by ops. Pins the agent version on the first run,
 * creates the run row, moves the job to running and starts the JOB_RUN workflow (inline when APP_ENV is test or local).
 */
export async function startJobRun(env: Env, input: { jobId: string; actor: string; actorKind: ActorKind; kind?: "job" | "revision" | "rerun"; feedback?: string; agentId?: string; agentVersion?: number }): Promise<{ runId: string }> {
  void env; void input; throw new Error("runner.startJobRun is not built yet");
}

/**
 * Execute a run end to end (called by the workflow). For job runs: writes the draft, moves the job to checking,
 * calls evaluation.checkDraft, reruns once with the check feedback if it fails, then moves the job to in_review
 * (RELEASE_REVIEW=required) or releases it (delivery.releaseDraft). Also calls evaluation.afterJobDraft.
 */
export async function executeRun(env: Env, runId: string): Promise<{ draftId: string | null }> {
  void env; void runId; throw new Error("runner.executeRun is not built yet");
}

/** Run an agent version on a brief outside a job: studio test bench ("test") or certification. */
export async function runAgentOnBrief(env: Env, input: { agentId: string; version: number; brief: string; spec?: Record<string, unknown>; rubric?: RubricCriterion[]; kind: "test" | "certification"; actor: string }): Promise<{ runId: string; draftId: string }> {
  void env; void input; throw new Error("runner.runAgentOnBrief is not built yet");
}

/** The plain-AI baseline: the job type's baseline_prompt on the standard tier, same brief. */
export async function runBaseline(env: Env, input: { jobTypeId: string; brief: string; spec?: Record<string, unknown>; rubric?: RubricCriterion[]; jobId?: string }): Promise<{ runId: string; draftId: string }> {
  void env; void input; throw new Error("runner.runBaseline is not built yet");
}

/**
 * Build and publish house agents (idempotent): one agent per (house persona outcome with a job_type_id), version 1 compiled
 * from the persona's method and the job type, status live; plus one generic house agent per job type no persona covers.
 * Run after directory.seedPersonas. Returns how many agents were created.
 */
export async function seedHouseAgents(env: Env, actor: string): Promise<{ created: number }> {
  void env; void actor; throw new Error("runner.seedHouseAgents is not built yet");
}
