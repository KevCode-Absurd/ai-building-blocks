// Intake and quote (the dispatcher, first version). Owner: intake module.
// Buyer's words -> job type -> spec -> at most three questions -> rubric -> fixed price -> confirmed order.
import type { Env } from "../../env.ts";
import type { ClarifyingQuestion, JobRow, Quote } from "../../core/types.ts";
import type { ActorKind } from "../../core/events.ts";

export interface Classification {
  job_type_id: string | null;   // null = open request for the ops queue
  confidence: number;           // 0 to 1
  reason: string;
  alternatives: string[];       // other likely job type ids
}

export interface IntakeState {
  job: JobRow;
  classification: Classification;
  spec: Record<string, unknown>;
  questions: ClarifyingQuestion[];   // still unanswered; empty = ready to quote
  ready: boolean;
}

/** Start from the buyer's own words. Creates a draft job and its brief (request_text kept verbatim). */
export async function startRequest(env: Env, input: { orgId: string; userId: string; text: string; source?: "web" | "mcp" | "api" | "ops"; jobTypeId?: string; personaId?: string }): Promise<IntakeState> {
  void env; void input; throw new Error("intake.startRequest is not built yet");
}

/** Save answers (keyed by spec field id). Returns what is still missing. */
export async function answerQuestions(env: Env, input: { jobId: string; userId: string; answers: Record<string, unknown> }): Promise<IntakeState> {
  void env; void input; throw new Error("intake.answerQuestions is not built yet");
}

/** Current intake state for a draft or quoted job. */
export async function getIntake(env: Env, jobId: string): Promise<IntakeState> {
  void env; void jobId; throw new Error("intake.getIntake is not built yet");
}

/** Write the rubric (5 template criteria + up to 3 from the buyer's goals) and price it. Moves draft -> quoted. */
export async function quoteJob(env: Env, input: { jobId: string; userId: string; rush?: boolean; goals?: string }): Promise<{ job: JobRow; quote: Quote }> {
  void env; void input; throw new Error("intake.quoteJob is not built yet");
}

/** The buyer orders the quoted job: freezes the rubric, moves quoted -> confirmed, then starts the run (runner.startJobRun). */
export async function confirmOrder(env: Env, input: { jobId: string; userId: string; actorKind?: ActorKind }): Promise<JobRow> {
  void env; void input; throw new Error("intake.confirmOrder is not built yet");
}
