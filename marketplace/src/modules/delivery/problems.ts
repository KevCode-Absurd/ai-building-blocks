// Problem reports, the ops side. Owner: delivery module.
// "Report a problem" (service.ts reportProblem) moves a delivered job to disputed and opens a problem_reports row.
// Ops sees open reports at /ops/problems and settles each one with a note and an outcome:
//   rerun   the agent does the work again with the buyer's report and the note (job -> running)
//   accept  keep the work as it is (job -> accepted)
//   cancel  cancel the job (job -> cancelled)
//   close   close the report only, for a job that was already settled another way (it is no longer disputed)
// The buyer is told in plain words. Every step writes an event; the note is also kept on the job record.
// Hiring is free, so there is no money outcome. Old reports may still hold the retired "credit" outcome and a
// credit_cents value; both are only read (shown as "closed"), and nothing new writes credit_cents.
import type { Env } from "../../env.ts";
import type { JobStatus } from "../../core/types.ts";
import { all, first, newId, nowIso } from "../../core/db.ts";
import { fail } from "../../core/http.ts";
import { getJob, STATUS_LABELS, transitionJob } from "../../core/jobs.ts";
import { notify } from "../../core/email.ts";
import { getJobType } from "../catalogue/index.ts";
import { startJobRun } from "../runner/service.ts";
import { PROBLEM_OUTCOME_LABELS, type ProblemOutcome, type StoredProblemOutcome } from "./service.ts";

export const PROBLEM_OUTCOMES: ProblemOutcome[] = ["rerun", "accept", "cancel", "close"];

/** What ops may pick for a report: a disputed job needs a decision about the job; any other job is already settled. */
export function outcomesFor(jobStatus: JobStatus): ProblemOutcome[] {
  return jobStatus === "disputed" ? ["rerun", "accept", "cancel"] : ["close"];
}

export interface ProblemReportView {
  id: string;
  status: "open" | "resolved";
  reasons: string;
  createdAt: string;
  resolvedAt: string | null;
  outcome: StoredProblemOutcome | null;
  outcomeLabel: string | null;
  note: string | null;
  job: { id: string; title: string; status: JobStatus; revisionsUsed: number; revisionsAllowed: number };
  buyer: { id: string; email: string | null };
  persona: { id: string; name: string } | null;
  draft: { id: string; version: number } | null;
  resolvedBy: { id: string; email: string | null } | null;
  /** Outcomes ops can pick now. Empty once resolved. */
  outcomes: ProblemOutcome[];
}

interface ReportRow {
  id: string; job_id: string; draft_id: string | null; reasons: string; status: "open" | "resolved"; created_by: string; created_at: string;
  resolved_by: string | null; resolved_at: string | null; outcome: StoredProblemOutcome | null; resolution_note: string | null;
  title: string; job_status: JobStatus; job_type_id: string | null; revisions_used: number; revisions_allowed: number;
  buyer_email: string | null; persona_id: string | null; persona_name: string | null; draft_version: number | null; resolved_by_email: string | null;
}

const SELECT = `
  SELECT r.id, r.job_id, r.draft_id, r.reasons, r.status, r.created_by, r.created_at, r.resolved_by, r.resolved_at, r.outcome, r.resolution_note,
         j.title, j.status AS job_status, j.job_type_id, j.revisions_used, j.revisions_allowed,
         ub.email AS buyer_email, p.id AS persona_id, p.name AS persona_name, d.version AS draft_version, uo.email AS resolved_by_email
  FROM problem_reports r
  JOIN jobs j ON j.id = r.job_id
  LEFT JOIN users ub ON ub.id = r.created_by
  LEFT JOIN personas p ON p.id = j.persona_id
  LEFT JOIN drafts d ON d.id = r.draft_id
  LEFT JOIN users uo ON uo.id = r.resolved_by`;

function toView(r: ReportRow): ProblemReportView {
  return {
    id: r.id, status: r.status, reasons: r.reasons, createdAt: r.created_at, resolvedAt: r.resolved_at,
    outcome: r.outcome, outcomeLabel: r.outcome ? PROBLEM_OUTCOME_LABELS[r.outcome] : null, note: r.resolution_note,
    job: {
      id: r.job_id, title: r.title?.trim() || getJobType(r.job_type_id)?.title || "Untitled job", status: r.job_status,
      revisionsUsed: r.revisions_used, revisionsAllowed: r.revisions_allowed,
    },
    buyer: { id: r.created_by, email: r.buyer_email },
    persona: r.persona_id ? { id: r.persona_id, name: r.persona_name ?? "" } : null,
    draft: r.draft_id && r.draft_version !== null ? { id: r.draft_id, version: r.draft_version } : null,
    resolvedBy: r.resolved_by ? { id: r.resolved_by, email: r.resolved_by_email } : null,
    outcomes: r.status === "open" ? outcomesFor(r.job_status) : [],
  };
}

/** Reports for the ops page. open: oldest first (waiting longest). resolved: newest first. all: open first. */
export async function listProblemReports(env: Env, filter: { status?: "open" | "resolved" | "all" } = {}): Promise<ProblemReportView[]> {
  const status = filter.status ?? "open";
  const where = status === "all" ? "" : "WHERE r.status = ?";
  const order = status === "open" ? "r.created_at ASC, r.rowid ASC"
    : status === "resolved" ? "r.resolved_at DESC, r.rowid DESC"
    : "(r.status = 'open') DESC, r.created_at DESC, r.rowid DESC";
  const rows = await all<ReportRow>(env.DB, `${SELECT} ${where} ORDER BY ${order} LIMIT 200`, ...(status === "all" ? [] : [status]));
  return rows.map(toView);
}

export async function getProblemReport(env: Env, reportId: string): Promise<ProblemReportView | null> {
  const row = await first<ReportRow>(env.DB, `${SELECT} WHERE r.id = ?`, reportId);
  return row ? toView(row) : null;
}

/** Counts for the ops page heading. */
export async function problemCounts(env: Env): Promise<{ open: number; resolved: number }> {
  const rows = await all<{ status: string; n: number }>(env.DB, "SELECT status, COUNT(*) AS n FROM problem_reports GROUP BY status");
  return { open: rows.find(r => r.status === "open")?.n ?? 0, resolved: rows.find(r => r.status === "resolved")?.n ?? 0 };
}

const errText = (err: unknown) => (err instanceof Error ? err.message : String(err)).slice(0, 300);

/** The instructions the rerun gets: the buyer's report and the team's note. */
export function problemRerunFeedback(reasons: string, note: string): string {
  return [
    "The buyer reported a problem with the last draft. Fix it, and keep everything else that works.",
    `What the buyer said:\n${reasons.trim()}`,
    `Notes from the AI Blocks team:\n${note.trim()}`,
  ].join("\n\n");
}

/** What the buyer reads when ops settles their report. */
export function problemResolvedMessage(input: { outcome: ProblemOutcome; jobTitle: string; agentName: string | null; note: string }): { subject: string; text: string } {
  const agent = input.agentName || "Your agent";
  const first = {
    rerun: `${agent} is doing the work again, using your report and our notes. We will email you when the new draft is ready.`,
    accept: "We kept the work as it is and marked the job as done. You can still read, copy and download it.",
    cancel: "We cancelled the job. You can start a new job any time.",
    close: "We closed your report.",
  }[input.outcome];
  return {
    subject: `We looked into the problem with ${input.jobTitle}`,
    text: `${first}\n\nNote from our team: ${input.note.trim()}\n\nIf you have questions, contact us at useaiblocks.com/support.`,
  };
}

/**
 * Settle one open report. Does the job part first (rerun, accept or cancel; nothing for close), then marks the
 * report resolved with the outcome and note, keeps the note on the job record, writes the event and tells the buyer.
 */
export async function resolveProblem(env: Env, input: { reportId: string; outcome: ProblemOutcome; note: string; actor: string }): Promise<{ report: ProblemReportView; runId: string | null }> {
  const db = env.DB;
  const report = await first<{ id: string; job_id: string; reasons: string; status: string }>(db, "SELECT id, job_id, reasons, status FROM problem_reports WHERE id = ?", input.reportId);
  if (!report) return fail(404, "report_not_found", "We could not find that problem report.");
  if (report.status !== "open") return fail(409, "already_resolved", "This report is already closed. Refresh the page to see what was decided.");
  const note = (input.note ?? "").trim();
  if (!note) return fail(400, "invalid_input", "Write a note for the buyer about what you decided.");
  const job = (await getJob(env, report.job_id)) ?? fail(404, "job_not_found", "We could not find the job for this report.");
  if (!outcomesFor(job.status).includes(input.outcome)) {
    if (job.status === "disputed") return fail(409, "decision_needed", "This job is still waiting for a decision. Pick redo, keep or cancel.");
    return fail(409, "job_already_settled", `This job is now "${STATUS_LABELS[job.status]}", so it no longer needs a decision. Close the report with a note.`);
  }

  const now = nowIso();
  const via = { via: "problem_report", report_id: report.id };
  const stopRuns = db.prepare("UPDATE runs SET status = 'cancelled', finished_at = COALESCE(finished_at, ?) WHERE job_id = ? AND status IN ('queued', 'running')").bind(now, job.id);
  let runId: string | null = null;
  switch (input.outcome) {
    case "rerun":
      runId = (await startJobRun(env, { jobId: job.id, actor: input.actor, actorKind: "ops", kind: "rerun", feedback: problemRerunFeedback(report.reasons, note) })).runId;
      break;
    case "accept":
      await transitionJob(env, { jobId: job.id, to: "accepted", actor: input.actor, actorKind: "ops", data: { ...via, note }, set: { accepted_at: now, auto_accept_at: null } });
      break;
    case "cancel":
      await transitionJob(env, { jobId: job.id, to: "cancelled", actor: input.actor, actorKind: "ops", data: { ...via, by: "ops", reason: note }, also: [stopRuns] });
      break;
    case "close":
      break;
  }

  const label = PROBLEM_OUTCOME_LABELS[input.outcome];
  const noteId = newId("note");
  const results = await db.batch([
    db.prepare("UPDATE problem_reports SET status = 'resolved', resolved_by = ?, resolved_at = ?, outcome = ?, resolution_note = ? WHERE id = ? AND status = 'open'")
      .bind(input.actor, now, input.outcome, note, report.id),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'ops', 'job', ?, 'problem_report.resolved', ? WHERE changes() = 1")
      .bind(now, input.actor, job.id, JSON.stringify({ report_id: report.id, outcome: input.outcome, from: job.status, run_id: runId, note_id: noteId })),
    db.prepare("INSERT INTO notes (id, entity, entity_id, body, created_by, created_at) SELECT ?, 'job', ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM problem_reports WHERE id = ? AND status = 'resolved' AND resolved_at = ? AND resolved_by = ?)")
      .bind(noteId, job.id, `Problem report closed (${label.toLowerCase()}): ${note}`, input.actor, now, report.id, now, input.actor),
  ]);
  if (!results[0]?.meta?.changes) return fail(409, "already_resolved", "Someone else closed this report just now. Refresh the page to see what was decided.");

  const persona = job.persona_id ? await first<{ name: string }>(db, "SELECT name FROM personas WHERE id = ?", job.persona_id) : null;
  const message = problemResolvedMessage({
    outcome: input.outcome, jobTitle: job.title?.trim() || getJobType(job.job_type_id)?.title || "your job",
    agentName: persona?.name ?? null, note,
  });
  try { await notify(env, { userId: job.created_by, kind: "problem.resolved", subject: message.subject, text: message.text, link: `/jobs/${job.id}` }); }
  catch (err) { console.error("delivery_problem_notice_failed", job.id, errText(err)); }

  return { report: (await getProblemReport(env, report.id))!, runId };
}

/**
 * Closes a job's open problem reports after ops settled the job from the ops job page (ops resolveJob), so the
 * report doesn't sit open at /ops/problems. Ops already told the buyer about the decision there, so no second
 * message goes out. Returns how many reports were closed.
 */
export async function closeReportsForJob(env: Env, input: { jobId: string; outcome: "rerun" | "accept" | "cancel"; note: string; actor: string }): Promise<number> {
  const db = env.DB, now = nowIso();
  const open = await all<{ id: string }>(db, "SELECT id FROM problem_reports WHERE job_id = ? AND status = 'open'", input.jobId);
  if (!open.length) return 0;
  const statements = open.flatMap(r => [
    db.prepare("UPDATE problem_reports SET status = 'resolved', resolved_by = ?, resolved_at = ?, outcome = ?, resolution_note = ? WHERE id = ? AND status = 'open'")
      .bind(input.actor, now, input.outcome, input.note, r.id),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'ops', 'job', ?, 'problem_report.resolved', ? WHERE changes() = 1")
      .bind(now, input.actor, input.jobId, JSON.stringify({ report_id: r.id, outcome: input.outcome, via: "ops_resolve" })),
  ]);
  const results = await db.batch(statements);
  return results.filter((_, i) => i % 2 === 0).reduce((n, res) => n + (res.meta?.changes ?? 0), 0);
}

