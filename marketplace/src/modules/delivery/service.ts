// Delivery and acceptance. Owner: delivery module (also owns sendEmail in src/core/email.ts).
import type { Env } from "../../env.ts";
import type { JobRow } from "../../core/types.ts";
import type { ActorKind } from "../../core/events.ts";

/** Let the buyer see a draft: moves the job to delivered, sets delivered_at and auto_accept_at (+5 days), emails the buyer. */
export async function releaseDraft(env: Env, input: { jobId: string; draftId: string; actor: string; actorKind: ActorKind }): Promise<JobRow> {
  void env; void input; throw new Error("delivery.releaseDraft is not built yet");
}

/** The buyer accepts. Optional edited version is stored as a diff (with consent rules applied to its later use). */
export async function acceptJob(env: Env, input: { jobId: string; userId: string; rating?: number; note?: string; editedContent?: string; actorKind?: ActorKind }): Promise<JobRow> {
  void env; void input; throw new Error("delivery.acceptJob is not built yet");
}

/** The buyer asks for changes (max revisions_allowed). Moves to revising and starts a revision run with the reasons. */
export async function requestRevision(env: Env, input: { jobId: string; userId: string; reasons: string; failedCriteria: string[]; editedContent?: string; actorKind?: ActorKind }): Promise<JobRow> {
  void env; void input; throw new Error("delivery.requestRevision is not built yet");
}

/** The buyer rejects the work. Ops is alerted; payments are on hold so there is nothing to refund yet. */
export async function rejectJob(env: Env, input: { jobId: string; userId: string; reasons: string; failedCriteria: string[]; actorKind?: ActorKind }): Promise<JobRow> {
  void env; void input; throw new Error("delivery.rejectJob is not built yet");
}

/** Scheduled: accept delivered jobs whose auto_accept_at has passed. Returns how many. */
export async function autoAcceptDue(env: Env): Promise<number> {
  void env; throw new Error("delivery.autoAcceptDue is not built yet");
}
