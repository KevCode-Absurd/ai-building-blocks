// Read side of the ops console: job queues, the full job record, agents and model spend.
import type { Env } from "../../env.ts";
import type { JobRow, JobStatus, RubricCriterion } from "../../core/types.ts";
import { JOB_STATUSES } from "../../core/types.ts";
import { TRANSITIONS } from "../../core/jobs.ts";
import { all, first, parseJson, today } from "../../core/db.ts";
import { getJobType } from "../catalogue/index.ts";
import type { WinRate } from "../evaluation/service.ts";
import { neighbours } from "./service.ts";
import type { AgentOption, AgentSummary, CostReport, DraftView, JobFlag, JobRecord, JobSummary, Queue, RunView } from "./types.ts";
import { QUEUES } from "./types.ts";

const usd = (micro: number | null | undefined) => Math.round((micro ?? 0) / 100) / 10_000;
const hoursSince = (iso: string, now: number) => {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : Math.max(0, Math.round(((now - t) / 3_600_000) * 10) / 10);
};

export function queueFor(job: { status: JobStatus; job_type_id: string | null }): Queue {
  if (job.status === "in_review") return "review";
  if (job.status === "rejected" || job.status === "disputed" || job.status === "failed") return "problems";
  if (job.status === "draft" && !job.job_type_id) return "requests";
  if (job.status === "accepted" || job.status === "cancelled") return "done";
  return "active";
}

/** Statuses before the buyer can see a draft: a due date in the past is a problem here. */
const BEFORE_DELIVERY: JobStatus[] = ["confirmed", "running", "checking", "in_review", "revising", "failed"];

interface SummaryRow extends JobRow {
  buyer_email: string | null;
  persona_name: string | null;
  request_excerpt: string | null;
  cost_micro: number | null;
  checks_failed: number;
}

const SUMMARY_SELECT = `
  SELECT j.*, u.email AS buyer_email, p.name AS persona_name, substr(b.request_text, 1, 140) AS request_excerpt,
    (SELECT SUM(mc.cost_micro_usd) FROM model_calls mc WHERE mc.job_id = j.id) AS cost_micro,
    EXISTS (
      SELECT 1 FROM scores s
      WHERE s.draft_id = (SELECT d.id FROM drafts d WHERE d.job_id = j.id ORDER BY d.created_at DESC, d.version DESC, d.rowid DESC LIMIT 1)
        AND s.judge IN ('rubric', 'policy') AND s.passed = 0
    ) AS checks_failed
  FROM jobs j
  LEFT JOIN users u ON u.id = j.created_by
  LEFT JOIN personas p ON p.id = j.persona_id
  LEFT JOIN briefs b ON b.job_id = j.id`;

function jobTitle(row: { title: string; request_excerpt?: string | null; job_type_id: string | null }): string {
  if (row.title?.trim()) return row.title.trim();
  const excerpt = row.request_excerpt?.trim().replace(/\s+/g, " ");
  if (excerpt) return excerpt.length > 80 ? `${excerpt.slice(0, 77)}...` : excerpt;
  return getJobType(row.job_type_id)?.title ?? "Untitled request";
}

function toSummary(env: Env, row: SummaryRow, now: number): JobSummary {
  const capUsd = Number(env.JOB_COST_CAP_USD ?? "2");
  const flags: JobFlag[] = [];
  if (row.checks_failed) flags.push("checks_failed");
  if (row.due_at && Date.parse(row.due_at) < now && BEFORE_DELIVERY.includes(row.status)) flags.push("overdue");
  if (capUsd > 0 && (row.cost_micro ?? 0) > capUsd * 1_000_000) flags.push("over_cost");
  if (row.revisions_used > 0) flags.push("revised");
  return {
    id: row.id, title: jobTitle(row), status: row.status, queue: queueFor(row), source: row.source,
    buyer_id: row.created_by, buyer_email: row.buyer_email, persona_id: row.persona_id, persona_name: row.persona_name,
    job_type_id: row.job_type_id, job_type_title: getJobType(row.job_type_id)?.title ?? null,
    agent_id: row.agent_id, agent_version: row.agent_version,
    price_cents: row.price_cents, currency: row.currency, revisions_used: row.revisions_used, flags,
    cost_usd: usd(row.cost_micro), age_hours: hoursSince(row.created_at, now), waiting_hours: hoursSince(row.updated_at, now),
    due_at: row.due_at, created_at: row.created_at, updated_at: row.updated_at,
  };
}

/** Order inside each queue: what needs a person first. */
function compareInQueue(a: JobSummary, b: JobSummary): number {
  const qa = QUEUES.indexOf(a.queue), qb = QUEUES.indexOf(b.queue);
  if (qa !== qb) return qa - qb;
  if (a.queue === "review") {
    const fa = a.flags.includes("checks_failed") ? 0 : 1, fb = b.flags.includes("checks_failed") ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return a.updated_at.localeCompare(b.updated_at);          // waiting longest first
  }
  if (a.queue === "problems") return a.updated_at.localeCompare(b.updated_at);
  if (a.queue === "requests") return a.created_at.localeCompare(b.created_at);
  return b.updated_at.localeCompare(a.updated_at);            // newest first
}

export interface JobFilter { status?: string; q?: string; queue?: string }

/**
 * Job summaries for the ops queues. With no filter: every open job plus the 25 most recently finished,
 * sorted by queue (review, problems, requests, active, done) and by urgency inside each queue.
 */
export async function listJobSummaries(env: Env, filter: JobFilter = {}): Promise<JobSummary[]> {
  const now = Date.now();
  const statuses = (filter.status ?? "").split(",").map(s => s.trim()).filter(Boolean)
    .filter((s): s is JobStatus => (JOB_STATUSES as readonly string[]).includes(s));
  const q = (filter.q ?? "").trim().slice(0, 200);
  const queue = QUEUES.includes(filter.queue as Queue) ? (filter.queue as Queue) : null;

  let rows: SummaryRow[];
  if (!statuses.length && !q) {
    const open = await all<SummaryRow>(env.DB, `${SUMMARY_SELECT} WHERE j.status NOT IN ('accepted', 'cancelled') ORDER BY j.updated_at DESC LIMIT 500`);
    const done = await all<SummaryRow>(env.DB, `${SUMMARY_SELECT} WHERE j.status IN ('accepted', 'cancelled') ORDER BY j.updated_at DESC LIMIT 25`);
    rows = [...open, ...done];
  } else {
    const where: string[] = [];
    const params: unknown[] = [];
    if (statuses.length) { where.push(`j.status IN (${statuses.map(() => "?").join(", ")})`); params.push(...statuses); }
    if (q) {
      const like = `%${q.toLowerCase()}%`;
      where.push("(lower(j.id) LIKE ? OR lower(j.title) LIKE ? OR lower(COALESCE(u.email, '')) LIKE ? OR lower(COALESCE(b.request_text, '')) LIKE ? OR lower(COALESCE(p.name, '')) LIKE ? OR lower(COALESCE(j.job_type_id, '')) LIKE ?)");
      params.push(like, like, like, like, like, like);
    }
    rows = await all<SummaryRow>(env.DB, `${SUMMARY_SELECT} WHERE ${where.join(" AND ")} ORDER BY j.updated_at DESC LIMIT 200`, ...params);
  }
  let jobs = rows.map(r => toSummary(env, r, now));
  if (queue) jobs = jobs.filter(j => j.queue === queue);
  return statuses.length || q ? jobs : jobs.sort(compareInQueue);
}

export async function jobSummary(env: Env, jobId: string): Promise<JobSummary | null> {
  const row = await first<SummaryRow>(env.DB, `${SUMMARY_SELECT} WHERE j.id = ?`, jobId);
  return row ? toSummary(env, row, Date.now()) : null;
}

/** Live and testing agents that could take this job type, with their published versions. */
export async function agentOptions(env: Env, jobTypeId: string | null, extraAgentId?: string | null): Promise<AgentOption[]> {
  const rows = await all<{ id: string; name: string; persona_name: string | null; kind: string; status: string; live_version: number | null }>(env.DB, `
    SELECT a.id, a.name, p.name AS persona_name, a.kind, a.status, a.live_version
    FROM agents a LEFT JOIN personas p ON p.id = a.persona_id
    WHERE (a.job_type_id = ? AND a.status != 'retired') OR a.id = ?
    ORDER BY a.status = 'live' DESC, a.kind = 'expert' DESC, a.name`, jobTypeId ?? "", extraAgentId ?? "");
  if (!rows.length) return [];
  const versions = await all<{ agent_id: string; version: number }>(env.DB,
    `SELECT agent_id, version FROM agent_versions WHERE status = 'published' AND agent_id IN (${rows.map(() => "?").join(", ")}) ORDER BY version DESC`,
    ...rows.map(r => r.id));
  return rows.map(r => ({ ...r, versions: versions.filter(v => v.agent_id === r.id).map(v => v.version) }));
}

const OPEN_LINK = /\/jobs\/([^/?#]+)/g;

/** Everything ops needs to decide on one job. */
export async function jobRecord(env: Env, jobId: string): Promise<JobRecord | null> {
  const db = env.DB;
  const row = await first<SummaryRow>(db, `${SUMMARY_SELECT} WHERE j.id = ?`, jobId);
  if (!row) return null;
  const summary = toSummary(env, row, Date.now());

  const brief = await first<any>(db, "SELECT * FROM briefs WHERE job_id = ?", jobId);
  const rubric = await first<{ criteria: string; frozen_at: string | null }>(db, "SELECT criteria, frozen_at FROM rubrics WHERE job_id = ?", jobId);

  const runRows = await all<any>(db, "SELECT * FROM runs WHERE job_id = ? ORDER BY created_at, rowid", jobId);
  const stepRows = runRows.length
    ? await all<any>(db, `SELECT * FROM run_steps WHERE run_id IN (${runRows.map(() => "?").join(", ")}) ORDER BY run_id, seq`, ...runRows.map(r => r.id))
    : [];
  const callsByRun = await all<{ run_id: string | null; micro: number; calls: number }>(db,
    "SELECT run_id, SUM(cost_micro_usd) AS micro, COUNT(*) AS calls FROM model_calls WHERE job_id = ? GROUP BY run_id", jobId);
  const runs: RunView[] = runRows.map(r => {
    const mc = callsByRun.find(c => c.run_id === r.id);
    return {
      id: r.id, kind: r.kind, agent_id: r.agent_id, agent_version: r.agent_version, status: r.status, attempt: r.attempt,
      input: parseJson(r.input, {}), input_tokens: r.input_tokens, output_tokens: r.output_tokens,
      cost_usd: usd(mc?.micro || r.cost_micro_usd), model_calls: mc?.calls ?? 0,
      error: r.error, created_at: r.created_at, started_at: r.started_at, finished_at: r.finished_at,
      steps: stepRows.filter(s => s.run_id === r.id).map(s => ({
        seq: s.seq, step_id: s.step_id, provider: s.provider, model: s.model, status: s.status,
        input_tokens: s.input_tokens, output_tokens: s.output_tokens, cost_usd: usd(s.cost_micro_usd),
        output: s.output, error: s.error, started_at: s.started_at, finished_at: s.finished_at,
      })),
    };
  });

  const draftRows = await all<any>(db, "SELECT * FROM drafts WHERE job_id = ? ORDER BY created_at DESC, version DESC, rowid DESC", jobId);
  const scoreRows = draftRows.length
    ? await all<any>(db, `SELECT * FROM scores WHERE draft_id IN (${draftRows.map(() => "?").join(", ")}) ORDER BY created_at, rowid`, ...draftRows.map(d => d.id))
    : [];
  const drafts: DraftView[] = draftRows.map(d => {
    const scores = scoreRows.filter(s => s.draft_id === d.id).map(s => ({
      id: s.id, judge: s.judge, judge_model: s.judge_model, passed: !!s.passed, score: s.score,
      result: parseJson(s.result, {}), cost_usd: usd(s.cost_micro_usd), created_by: s.created_by, created_at: s.created_at,
    }));
    return {
      id: d.id, run_id: d.run_id, version: d.version, content: d.content, format: d.format, fingerprint: d.fingerprint,
      released_at: d.released_at, released_by: d.released_by, created_at: d.created_at,
      checks_failed: scores.some(s => (s.judge === "rubric" || s.judge === "policy") && !s.passed),
      scores,
    };
  });

  const decisions = (await all<any>(db, "SELECT * FROM decisions WHERE job_id = ? ORDER BY created_at, rowid", jobId)).map(d => ({
    id: d.id, draft_id: d.draft_id, kind: d.kind, reasons: d.reasons, failed_criteria: parseJson<string[]>(d.failed_criteria, []),
    edits: d.edits === null ? null : parseJson<unknown>(d.edits, d.edits), rating: d.rating, created_by: d.created_by, created_at: d.created_at,
  }));

  const events = (await all<any>(db, `
    SELECT * FROM events
    WHERE (entity = 'job' AND entity_id = ?)
       OR (entity = 'draft' AND entity_id IN (SELECT id FROM drafts WHERE job_id = ?))
       OR (entity = 'run' AND entity_id IN (SELECT id FROM runs WHERE job_id = ?))
    ORDER BY seq`, jobId, jobId, jobId)).map(e => ({ ...e, data: parseJson<Record<string, unknown>>(e.data, {}) }));

  const notes = await all<any>(db, `
    SELECT n.id, n.body, n.created_by, u.email AS created_by_email, n.created_at
    FROM notes n LEFT JOIN users u ON u.id = n.created_by
    WHERE n.entity = 'job' AND n.entity_id = ? ORDER BY n.created_at DESC, n.rowid DESC`, jobId);

  // Notifications have no job column; match links that point at this job (/jobs/:id, /ops/jobs/:id, /requests/:id).
  const candidates = await all<any>(db,
    "SELECT * FROM notifications WHERE instr(link, ?) > 0 OR instr(link, ?) > 0 ORDER BY created_at, rowid", `/jobs/${jobId}`, `/requests/${jobId}`);
  const notifications = candidates.filter(n => {
    const ids = [...String(n.link).matchAll(OPEN_LINK)].map(m => m[1]);
    return ids.includes(jobId) || new RegExp(`/requests/${jobId}(?:[/?#]|$)`).test(String(n.link));
  });

  const byPurpose = await all<{ purpose: string; micro: number; calls: number }>(db,
    "SELECT purpose, SUM(cost_micro_usd) AS micro, COUNT(*) AS calls FROM model_calls WHERE job_id = ? GROUP BY purpose ORDER BY micro DESC, purpose", jobId);

  const options = await agentOptions(env, row.job_type_id, row.agent_id);
  const current = row.agent_id ? options.find(o => o.id === row.agent_id) ?? null : null;
  const status = row.status;
  const final = status === "accepted" || status === "cancelled";

  return {
    job: {
      ...summary,
      quote: parseJson(row.quote, {}), turnaround_hours: row.turnaround_hours, delivered_at: row.delivered_at,
      auto_accept_at: row.auto_accept_at, accepted_at: row.accepted_at, revisions_allowed: row.revisions_allowed,
      catalogue_version: row.catalogue_version, quote_expires_at: row.quote_expires_at,
    },
    buyer: { id: row.created_by, email: row.buyer_email },
    brief: brief ? {
      request_text: brief.request_text, spec: parseJson(brief.spec, {}), questions: parseJson(brief.questions, []),
      answers: parseJson(brief.answers, {}), attachments: parseJson(brief.attachments, []),
      classification: parseJson(brief.classification, {}), created_at: brief.created_at, updated_at: brief.updated_at,
    } : null,
    rubric: rubric ? { criteria: parseJson<RubricCriterion[]>(rubric.criteria, []), frozen_at: rubric.frozen_at } : null,
    agent: current,
    agent_options: options.filter(o => o.status !== "retired"),
    runs, drafts, decisions, events, notes, notifications,
    cost: {
      total_usd: summary.cost_usd,
      calls: byPurpose.reduce((n, p) => n + p.calls, 0),
      cap_usd: Number(env.JOB_COST_CAP_USD ?? "2"),
      by_purpose: byPurpose.map(p => ({ purpose: p.purpose, usd: usd(p.micro), calls: p.calls })),
    },
    actions: {
      release: status === "in_review" && drafts.some(d => !d.released_at),
      rerun: ["in_review", "failed", "rejected", "disputed"].includes(status),
      cancel: TRANSITIONS[status].includes("cancelled"),
      assign: !final && !!row.job_type_id,
      resolve: status === "rejected" || status === "disputed",
    },
  };
}

export interface AgentFilter { status?: string; kind?: string; job_type?: string; q?: string }

/** Every agent with its persona, job type, live version, job count, acceptance rate and blind-test win rate. */
export async function listAgents(env: Env, filter: AgentFilter = {}): Promise<AgentSummary[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filter.status && ["draft", "testing", "live", "retired"].includes(filter.status)) { where.push("a.status = ?"); params.push(filter.status); }
  if (filter.kind && ["house", "expert"].includes(filter.kind)) { where.push("a.kind = ?"); params.push(filter.kind); }
  if (filter.job_type) { where.push("a.job_type_id = ?"); params.push(filter.job_type); }
  const q = (filter.q ?? "").trim().toLowerCase().slice(0, 200);
  if (q) {
    where.push("(lower(a.name) LIKE ? OR lower(a.id) LIKE ? OR lower(COALESCE(p.name, '')) LIKE ? OR lower(a.job_type_id) LIKE ? OR lower(COALESCE(e.display_name, '')) LIKE ?)");
    params.push(...Array(5).fill(`%${q}%`));
  }
  const rows = await all<any>(env.DB, `
    SELECT a.*, p.name AS persona_name, p.sort AS persona_sort, e.display_name AS expert_name,
      (SELECT COUNT(*) FROM jobs j WHERE j.agent_id = a.id) AS jobs,
      (SELECT COUNT(*) FROM jobs j WHERE j.agent_id = a.id AND j.status = 'accepted') AS accepted,
      (SELECT COUNT(*) FROM jobs j WHERE j.agent_id = a.id AND j.status IN ('accepted', 'rejected', 'disputed')) AS decided,
      (SELECT MAX(v.version) FROM agent_versions v WHERE v.agent_id = a.id AND v.status = 'published') AS latest_version
    FROM agents a
    LEFT JOIN personas p ON p.id = a.persona_id
    LEFT JOIN experts e ON e.id = a.expert_id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY CASE a.status WHEN 'live' THEN 0 WHEN 'testing' THEN 1 WHEN 'draft' THEN 2 ELSE 3 END, COALESCE(p.sort, 100000), a.name, a.job_type_id
    LIMIT 1000`, ...params);

  let rates: WinRate[] = [];
  try { rates = await (await neighbours.evaluation()).winRates(env, "agent"); } catch (err) { console.error("ops_win_rates_unavailable", err instanceof Error ? err.message : String(err)); }
  const rateFor = (agentId: string) => {
    const exact = rates.find(r => r.key === agentId);
    if (exact) return { win_rate: exact.winRate, blind_tests: exact.tests };
    // Some groupings key by agent and version ("agent_x@2" or "agent_x:2"): combine them.
    const parts = rates.filter(r => r.key.startsWith(`${agentId}@`) || r.key.startsWith(`${agentId}:`));
    if (!parts.length) return { win_rate: null, blind_tests: 0 };
    const wins = parts.reduce((n, r) => n + r.agentWins, 0), losses = parts.reduce((n, r) => n + r.baselineWins, 0);
    return { win_rate: wins + losses ? Math.round((wins / (wins + losses)) * 10_000) / 10_000 : null, blind_tests: parts.reduce((n, r) => n + r.tests, 0) };
  };

  return rows.map(r => ({
    id: r.id, name: r.name, kind: r.kind, status: r.status, persona_id: r.persona_id, persona_name: r.persona_name,
    expert_id: r.expert_id, expert_name: r.expert_name, job_type_id: r.job_type_id, job_type_title: getJobType(r.job_type_id)?.title ?? null,
    live_version: r.live_version, latest_version: r.latest_version, jobs: r.jobs, accepted: r.accepted,
    acceptance_rate: r.decided ? Math.round((r.accepted / r.decided) * 10_000) / 10_000 : null,
    ...rateFor(r.id),
    updated_at: r.updated_at,
  }));
}

/** Model spend for the last 30 days: by day, by purpose and the costliest jobs, plus today against DAILY_MODEL_CAP_USD. */
export async function costReport(env: Env): Promise<CostReport> {
  const db = env.DB;
  const day = today();
  const since = today(new Date(Date.now() - 29 * 86_400_000));
  const cap = Number(env.DAILY_MODEL_CAP_USD ?? "5");
  const t = await first<{ micro: number | null; calls: number }>(db, "SELECT SUM(cost_micro_usd) AS micro, COUNT(*) AS calls FROM model_calls WHERE day = ?", day);
  const days = await all<{ day: string; micro: number; calls: number; failed: number }>(db, `
    SELECT day, SUM(cost_micro_usd) AS micro, COUNT(*) AS calls, SUM(CASE WHEN ok = 0 THEN 1 ELSE 0 END) AS failed
    FROM model_calls WHERE day >= ? GROUP BY day ORDER BY day DESC`, since);
  const purposes = await all<{ purpose: string; micro: number; calls: number; input_tokens: number; output_tokens: number }>(db, `
    SELECT purpose, SUM(cost_micro_usd) AS micro, COUNT(*) AS calls, SUM(input_tokens) AS input_tokens, SUM(output_tokens) AS output_tokens
    FROM model_calls WHERE day >= ? GROUP BY purpose ORDER BY micro DESC, calls DESC, purpose`, since);
  const jobs = await all<{ job_id: string; title: string | null; status: string | null; request_excerpt: string | null; job_type_id: string | null; micro: number; calls: number }>(db, `
    SELECT mc.job_id, j.title, j.status, j.job_type_id, substr(b.request_text, 1, 140) AS request_excerpt, SUM(mc.cost_micro_usd) AS micro, COUNT(*) AS calls
    FROM model_calls mc LEFT JOIN jobs j ON j.id = mc.job_id LEFT JOIN briefs b ON b.job_id = mc.job_id
    WHERE mc.day >= ? AND mc.job_id IS NOT NULL
    GROUP BY mc.job_id ORDER BY micro DESC, calls DESC LIMIT 10`, since);
  const todayUsd = usd(t?.micro);
  return {
    today: { day, usd: todayUsd, calls: t?.calls ?? 0, cap_usd: cap, share: cap > 0 ? Math.round((todayUsd / cap) * 10_000) / 10_000 : 0 },
    days: days.map(d => ({ day: d.day, usd: usd(d.micro), calls: d.calls, failed: d.failed })),
    purposes: purposes.map(p => ({ purpose: p.purpose, usd: usd(p.micro), calls: p.calls, input_tokens: p.input_tokens, output_tokens: p.output_tokens })),
    jobs: jobs.map(j => ({ job_id: j.job_id, title: jobTitle({ title: j.title ?? "", request_excerpt: j.request_excerpt, job_type_id: j.job_type_id }), status: j.status, usd: usd(j.micro), calls: j.calls })),
    since,
  };
}
