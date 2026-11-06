// The job state machine. Every status change goes through transitionJob, which checks the move is allowed,
// applies it only if the job is still in the expected state, and writes the event in the same batch.
import type { Env } from "../env.ts";
import type { JobRow, JobStatus } from "./types.ts";
import { first, nowIso } from "./db.ts";
import type { ActorKind } from "./events.ts";
import { fail } from "./http.ts";

/**
 * draft      intake in progress (questions may be open)
 * quoted     price and rubric shown; waiting for the buyer to confirm
 * confirmed  buyer ordered (payments are on hold: nothing is charged yet)
 * running    an agent run is in progress
 * checking   automated checks are scoring the draft
 * in_review  ops must approve the draft before the buyer sees it (RELEASE_REVIEW=required)
 * delivered  the buyer can see the draft; accept, revise or reject
 * revising   the buyer asked for changes; a revision run will start
 * accepted   done (final)
 * rejected   the buyer rejected the work; ops follows up
 * disputed   needs an ops decision
 * failed     runs or checks failed beyond retries; ops follows up
 * cancelled  stopped before delivery (final)
 */
export const TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  draft: ["quoted", "cancelled"],
  quoted: ["draft", "confirmed", "cancelled"],
  confirmed: ["running", "cancelled"],
  running: ["checking", "failed", "cancelled"],
  checking: ["running", "in_review", "delivered", "failed"],
  in_review: ["delivered", "running", "failed", "cancelled"],
  delivered: ["accepted", "revising", "rejected", "disputed"],
  revising: ["running", "cancelled"],
  accepted: [],
  rejected: ["disputed", "running", "cancelled"],
  disputed: ["accepted", "running", "cancelled"],
  failed: ["running", "cancelled"],
  cancelled: [],
};

/** Columns a transition may set alongside the status. */
const SETTABLE = new Set([
  "job_type_id", "catalogue_version", "persona_id", "title", "price_cents", "quote", "quote_expires_at", "turnaround_hours", "due_at",
  "agent_id", "agent_version", "revisions_used", "delivered_at", "auto_accept_at", "accepted_at", "payment_status",
]);

export interface TransitionInput {
  jobId: string;
  to: JobStatus;
  actor: string;
  actorKind: ActorKind;
  /** Event data, e.g. { reason } */
  data?: Record<string, unknown>;
  /** Extra columns to set in the same update. */
  set?: Record<string, string | number | null>;
  /** Extra statements to run right after the transition applies (never if it does not). Keep them safe to repeat. */
  also?: D1PreparedStatement[];
}

export async function getJob(env: Env, jobId: string): Promise<JobRow | null> {
  return first<JobRow>(env.DB, "SELECT * FROM jobs WHERE id = ?", jobId);
}

export async function transitionJob(env: Env, input: TransitionInput): Promise<JobRow> {
  const db = env.DB, now = nowIso();
  const job = await getJob(env, input.jobId);
  if (!job) return fail(404, "job_not_found", "We could not find that job.");
  if (!TRANSITIONS[job.status].includes(input.to)) {
    return fail(409, "invalid_transition", `This job is ${job.status.replace("_", " ")}, so it cannot move to ${input.to.replace("_", " ")}.`);
  }
  const set = input.set ?? {};
  for (const key of Object.keys(set)) if (!SETTABLE.has(key)) throw new Error(`transitionJob cannot set ${key}`);
  const cols = Object.keys(set);
  const update = db.prepare(`UPDATE jobs SET status = ?, updated_at = ?${cols.map(c => `, ${c} = ?`).join("")} WHERE id = ? AND status = ?`)
    .bind(input.to, now, ...cols.map(c => set[c]), job.id, job.status);
  // The event row is inserted in the same batch and only if the guarded update changed the row (changes() = 1).
  const event = db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, ?, 'job', ?, ?, ? WHERE changes() = 1")
    .bind(now, input.actor, input.actorKind, job.id, `job.${input.to}`, JSON.stringify({ from: job.status, ...(input.data ?? {}) }));
  const results = await db.batch([update, event]);
  const changed = results[0]?.meta?.changes ?? 0;
  if (!changed) return fail(409, "job_changed", "This job changed while you were working on it. Refresh and try again.");
  // Extra statements run right after the transition applied. Keep them safe to repeat.
  if (input.also?.length) await db.batch(input.also);
  return (await getJob(env, job.id))!;
}

/** Statuses a buyer sees in plain words. */
export const STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Needs details",
  quoted: "Quote ready",
  confirmed: "Ordered",
  running: "In progress",
  checking: "Being checked",
  in_review: "Final check",
  delivered: "Ready for you",
  revising: "Being revised",
  accepted: "Done",
  rejected: "Rejected",
  disputed: "Under review",
  failed: "Delayed",
  cancelled: "Cancelled",
};
