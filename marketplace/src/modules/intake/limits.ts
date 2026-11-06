// An optional daily job limit. It is OFF by default (owner, 6 Nov: no per-person limit). Set DAILY_JOBS_PER_USER to a
// whole number from 1 up to turn it on: one person can then start that many jobs in any 24 hours.
// A job counts when it is started (moves to confirmed); drafts and plans that were never started do not count.
// The model spend caps (DAILY_MODEL_CAP_USD, JOB_COST_CAP_USD) still apply on top of this.
import type { Env } from "../../env.ts";
import { all, nowIso } from "../../core/db.ts";
import { fail } from "../../core/http.ts";

/** 0 means no limit. */
export const DEFAULT_DAILY_JOBS = 0;
const DAY_MS = 24 * 3600_000;

/** The configured limit: a whole number from 1 up, else 0 (no limit). */
export function dailyJobLimit(env: Env): number {
  const n = Number(env.DAILY_JOBS_PER_USER);
  return Number.isInteger(n) && n >= 1 ? n : DEFAULT_DAILY_JOBS;
}

export interface DailyJobs {
  limit: number;
  /** Jobs this person started in the last 24 hours. */
  used: number;
  left: number;
  /** When the next start is allowed, if the limit is reached now. */
  next_at: string | null;
}

/** How many jobs a person (the job's creator) started in the 24 hours before `now`. */
export async function dailyJobs(env: Env, userId: string, now = nowIso()): Promise<DailyJobs> {
  const limit = dailyJobLimit(env);
  const since = new Date(Date.parse(now) - DAY_MS).toISOString();
  const rows = await all<{ at: string }>(env.DB,
    `SELECT e.at FROM events e JOIN jobs j ON j.id = e.entity_id
     WHERE e.type = 'job.confirmed' AND e.entity = 'job' AND e.at > ? AND j.created_by = ?
     ORDER BY e.at`, since, userId);
  const used = rows.length;
  // The oldest start that keeps the count at the limit drops out of the window 24 hours after it happened.
  if (!limit) return { limit, used, left: Number.POSITIVE_INFINITY, next_at: null };
  const next_at = used >= limit ? new Date(Date.parse(rows[used - limit].at) + DAY_MS).toISOString() : null;
  return { limit, used, left: Math.max(0, limit - used), next_at };
}

/** "in about 3 hours" style wording for the wait. */
export function waitWords(fromIso: string, toIso: string): string {
  const minutes = Math.max(1, Math.ceil((Date.parse(toIso) - Date.parse(fromIso)) / 60_000));
  if (minutes < 60) return `in about ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const hours = Math.round(minutes / 60);
  return `in about ${hours} ${hours === 1 ? "hour" : "hours"}`;
}

/** "2:05 PM UTC on Nov 7" */
export function utcTime(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
  const date = d.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${time} UTC on ${date}`;
}

/** The plain message: the limit, how many were started, and when the next start is allowed. */
export function dailyLimitMessage(d: DailyJobs, now = nowIso(), opts: { saved?: boolean } = {}): string {
  const jobs = `${d.limit} ${d.limit === 1 ? "job" : "jobs"}`;
  const when = d.next_at ? ` You can start the next one ${waitWords(now, d.next_at)}, at ${utcTime(d.next_at)}.` : "";
  const saved = opts.saved ? " Your request is saved, so you can start it then." : "";
  return `You can start ${jobs} a day, and you have started ${d.used} in the last 24 hours.${when}${saved}`;
}

/**
 * Stops a start, or a new request, when the person has reached the daily limit: HTTP 429, code "daily_limit".
 * saved: say the request is kept (true when stopping a start, since the plan stays on the request page).
 */
export async function checkDailyJobs(env: Env, userId: string, opts: { saved?: boolean } = {}): Promise<DailyJobs | null> {
  if (!dailyJobLimit(env)) return null;
  const now = nowIso();
  const d = await dailyJobs(env, userId, now);
  if (d.used >= d.limit) fail(429, "daily_limit", dailyLimitMessage(d, now, opts));
  return d;
}
