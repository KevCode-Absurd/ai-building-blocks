// Ops console services. Owner: ops module.
// notifyOps alerts the team; gateMetrics computes the week-6 beta gate numbers shown on /ops.
import type { Env } from "../../env.ts";
import { all, first } from "../../core/db.ts";
import { notify } from "../../core/email.ts";

/**
 * Neighbour services load when first used, not at import. Delivery and runner import this file (for notifyOps),
 * so a static import back to them, or to evaluation, would tie the load order of all four modules together.
 */
export const neighbours = {
  delivery: () => import("../delivery/service.ts"),
  runner: () => import("../runner/service.ts"),
  directory: () => import("../directory/service.ts"),
  evaluation: () => import("../evaluation/service.ts"),
};

const errText = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Ops user ids from configuration (OPS_USER_IDS). */
export function settingsOpsIds(env: Env): string[] {
  return (env.OPS_USER_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean);
}

/**
 * Everyone who gets ops alerts: OPS_USER_IDS plus staff 'ops', in that order, without repeats.
 * Only people with a user row are returned (they have signed in once), because a notification needs one.
 */
export async function opsRecipients(env: Env): Promise<string[]> {
  const ids: string[] = [];
  for (const id of settingsOpsIds(env)) if (!ids.includes(id)) ids.push(id);
  const staff = await all<{ user_id: string }>(env.DB, "SELECT user_id FROM staff WHERE role = 'ops' ORDER BY created_at, user_id");
  for (const r of staff) if (!ids.includes(r.user_id)) ids.push(r.user_id);
  if (!ids.length) return [];
  const known = new Set((await all<{ id: string }>(env.DB, `SELECT id FROM users WHERE id IN (${ids.map(() => "?").join(", ")})`, ...ids)).map(r => r.id));
  return ids.filter(id => known.has(id));
}

/** Alert the AI Blocks team (every OPS_USER_IDS user and every staff 'ops' user) through notify(). Never throws. */
export async function notifyOps(env: Env, notice: { kind: string; subject: string; text: string; link?: string }): Promise<void> {
  let recipients: string[];
  try {
    recipients = await opsRecipients(env);
  } catch (err) {
    console.error("notify_ops_failed", errText(err));
    return;
  }
  for (const userId of recipients) {
    try {
      await notify(env, { userId, kind: notice.kind, subject: notice.subject, text: notice.text, link: notice.link });
    } catch (err) {
      console.error("notify_ops_failed", userId, errText(err));
    }
  }
}

export interface GateMetrics {
  experts: { approved: number; target: number };
  jobs: { delivered: number; accepted: number; target: number };
  blindWinRate: { value: number | null; tests: number; target: number };
  repeatBuyers: { value: number | null; buyers: number; target: number };
  firstPassAcceptance: number | null;
  medianHoursToFirstDraft: number | null;
  modelCostPerJobUsd: number | null;
}

export const GATE_TARGETS = { experts: 50, jobs: 100, blindWinRate: 0.65, repeatBuyers: 0.3 } as const;
const REPEAT_WINDOW_MS = 30 * 86_400_000;

/** Statuses a job can only reach after the buyer confirmed it. Used when a job has no job.confirmed event. */
const AFTER_CONFIRM = ["confirmed", "running", "checking", "in_review", "delivered", "revising", "accepted", "rejected", "disputed", "failed"];
const IN_LIST = AFTER_CONFIRM.map(s => `'${s}'`).join(", ");

/** SQL for when job j was confirmed: the first job.confirmed event, else created_at for jobs past that point. */
export const CONFIRMED_AT_SQL = `COALESCE(
  (SELECT MIN(e.at) FROM events e WHERE e.entity = 'job' AND e.entity_id = j.id AND e.type = 'job.confirmed'),
  CASE WHEN j.status IN (${IN_LIST}) THEN j.created_at END)`;

const round = (n: number, places: number) => Math.round(n * 10 ** places) / 10 ** places;

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** The week-6 beta gate: 50 experts, 100 jobs, 65% blind wins, 30% repeat buyers within 30 days. */
export async function gateMetrics(env: Env): Promise<GateMetrics> {
  const db = env.DB;

  const experts = await first<{ n: number }>(db, "SELECT COUNT(*) AS n FROM experts WHERE status = 'approved'");

  // Payments are on hold, so the jobs target counts accepted jobs. Delivered = ever shown to the buyer.
  const jobs = await first<{ delivered: number | null; accepted: number | null }>(db, `
    SELECT
      SUM(CASE WHEN j.delivered_at IS NOT NULL OR j.status IN ('delivered', 'accepted')
        OR EXISTS (SELECT 1 FROM events e WHERE e.entity = 'job' AND e.entity_id = j.id AND e.type = 'job.delivered') THEN 1 ELSE 0 END) AS delivered,
      SUM(CASE WHEN j.status = 'accepted' THEN 1 ELSE 0 END) AS accepted
    FROM jobs j`);
  const accepted = jobs?.accepted ?? 0;

  let blind: { value: number | null; tests: number } = { value: null, tests: 0 };
  try {
    const rows = await (await neighbours.evaluation()).winRates(env, "all");
    const row = rows.find(r => r.key === "all") ?? rows[0];
    if (row) blind = { value: row.winRate, tests: row.tests };
  } catch (err) {
    console.error("gate_win_rate_unavailable", errText(err));
  }

  // Repeat buyers: of the orgs with a confirmed job, the share whose second confirmed job came within 30 days of the first.
  const confirmed = await all<{ org_id: string; confirmed_at: string | null }>(db, `SELECT j.org_id, ${CONFIRMED_AT_SQL} AS confirmed_at FROM jobs j`);
  const byOrg = new Map<string, number[]>();
  for (const r of confirmed) {
    if (!r.confirmed_at) continue;
    const t = Date.parse(r.confirmed_at);
    if (Number.isNaN(t)) continue;
    byOrg.set(r.org_id, [...(byOrg.get(r.org_id) ?? []), t]);
  }
  let repeat = 0;
  for (const times of byOrg.values()) {
    times.sort((a, b) => a - b);
    if (times.length >= 2 && times[1] - times[0] <= REPEAT_WINDOW_MS) repeat++;
  }
  const buyers = byOrg.size;

  // First-pass acceptance: of the jobs where the buyer answered a draft, the share accepted with no revision or rejection.
  const fp = await first<{ first_pass: number | null; answered: number | null }>(db, `
    SELECT
      SUM(CASE WHEN j.status = 'accepted' AND j.revisions_used = 0
        AND NOT EXISTS (SELECT 1 FROM decisions d WHERE d.job_id = j.id AND d.kind IN ('revise', 'reject')) THEN 1 ELSE 0 END) AS first_pass,
      SUM(CASE WHEN j.status IN ('accepted', 'rejected', 'disputed', 'revising') OR j.revisions_used > 0
        OR EXISTS (SELECT 1 FROM decisions d WHERE d.job_id = j.id) THEN 1 ELSE 0 END) AS answered
    FROM jobs j`);
  const answered = fp?.answered ?? 0;

  // Hours from confirmed to the first draft the buyer could see.
  const timing = await all<{ confirmed_at: string | null; released_at: string | null }>(db, `
    SELECT ${CONFIRMED_AT_SQL} AS confirmed_at,
      COALESCE(
        (SELECT MIN(d.released_at) FROM drafts d WHERE d.job_id = j.id AND d.released_at IS NOT NULL),
        (SELECT MIN(e.at) FROM events e WHERE e.entity = 'job' AND e.entity_id = j.id AND e.type = 'job.delivered')) AS released_at
    FROM jobs j`);
  const hours = timing
    .filter(r => r.confirmed_at && r.released_at)
    .map(r => (Date.parse(r.released_at!) - Date.parse(r.confirmed_at!)) / 3_600_000)
    .filter(h => Number.isFinite(h) && h >= 0);
  const med = median(hours);

  // Model cost per accepted job: all model spend on jobs (including reruns, checks and failed jobs) divided by accepted jobs.
  const spend = await first<{ micro: number | null }>(db, "SELECT SUM(cost_micro_usd) AS micro FROM model_calls WHERE job_id IS NOT NULL");

  return {
    experts: { approved: experts?.n ?? 0, target: GATE_TARGETS.experts },
    jobs: { delivered: jobs?.delivered ?? 0, accepted, target: GATE_TARGETS.jobs },
    blindWinRate: { value: blind.value, tests: blind.tests, target: GATE_TARGETS.blindWinRate },
    repeatBuyers: { value: buyers ? round(repeat / buyers, 4) : null, buyers, target: GATE_TARGETS.repeatBuyers },
    firstPassAcceptance: answered ? round((fp?.first_pass ?? 0) / answered, 4) : null,
    medianHoursToFirstDraft: med === null ? null : round(med, 1),
    modelCostPerJobUsd: accepted ? round((spend?.micro ?? 0) / 1_000_000 / accepted, 4) : null,
  };
}
