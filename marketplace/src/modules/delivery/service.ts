// Delivery and acceptance. Owner: delivery module (also owns sendEmail in src/core/email.ts).
// releaseDraft lets the buyer see a draft; the buyer then accepts, asks for changes, rejects or reports a problem.
// Every decision writes a decisions row (problem reports go to problem_reports, see migrations/0005_delivery.sql).
import type { Env } from "../../env.ts";
import type { JobRow, JobStatus, Quote, RubricCriterion, RubricResult } from "../../core/types.ts";
import type { ActorKind, EventRow } from "../../core/events.ts";
import { eventStatement, eventsFor } from "../../core/events.ts";
import { addHours, all, first, newId, nowIso, parseJson } from "../../core/db.ts";
import { fail, HttpError } from "../../core/http.ts";
import { getJob, STATUS_LABELS, transitionJob } from "../../core/jobs.ts";
import { notify } from "../../core/email.ts";
import { getJobType } from "../catalogue/index.ts";
import { startJobRun } from "../runner/service.ts";
import { notifyOps } from "../ops/service.ts";
import { editsRecord, summarizeDiff, type StoredEdits } from "./diff.ts";

/** A delivered draft is accepted for the buyer after this many days without a decision. */
export const AUTO_ACCEPT_DAYS = 5;
/** Statuses where an agent or a check is still working; the buyer page polls while a job is in one. */
export const WORKING_STATUSES: JobStatus[] = ["confirmed", "running", "checking", "in_review", "revising"];

export interface DraftRow {
  id: string; job_id: string | null; run_id: string; version: number; content: string; format: "markdown" | "text" | "json";
  fingerprint: string; released_at: string | null; released_by: string | null; created_at: string;
}

interface DecisionRow {
  id: string; job_id: string; draft_id: string; kind: "accept" | "revise" | "reject" | "auto_accept"; reasons: string;
  failed_criteria: string; edits: string | null; rating: number | null; created_by: string; created_at: string;
}

interface PersonaRow { id: string; name: string; title: string; profile: string }

// ---------- Small shared reads ----------

async function loadJob(env: Env, jobId: string): Promise<JobRow> {
  const job = await getJob(env, jobId);
  if (!job) return fail(404, "job_not_found", "We could not find that job.");
  return job;
}

export async function latestReleasedDraft(env: Env, jobId: string): Promise<DraftRow | null> {
  return first<DraftRow>(env.DB, "SELECT * FROM drafts WHERE job_id = ? AND released_at IS NOT NULL ORDER BY released_at DESC, version DESC LIMIT 1", jobId);
}

/** The job's frozen checklist: the rubrics row, else the quote's copy, else the job type's template. */
export async function rubricFor(env: Env, job: JobRow): Promise<RubricCriterion[]> {
  const row = await first<{ criteria: string }>(env.DB, "SELECT criteria FROM rubrics WHERE job_id = ?", job.id);
  const fromRow = parseJson<RubricCriterion[]>(row?.criteria, []);
  if (Array.isArray(fromRow) && fromRow.length) return fromRow;
  const quote = parseJson<Partial<Quote>>(job.quote, {});
  if (Array.isArray(quote.rubric) && quote.rubric.length) return quote.rubric;
  return getJobType(job.job_type_id)?.rubric ?? [];
}

async function personaFor(env: Env, personaId: string | null): Promise<PersonaRow | null> {
  return personaId ? first<PersonaRow>(env.DB, "SELECT id, name, title, profile FROM personas WHERE id = ?", personaId) : null;
}

/** What to call the job in messages: its title, else the job type, else "Your job". */
function jobName(job: JobRow): string {
  return job.title?.trim() || getJobType(job.job_type_id)?.title || "Your job";
}

function mustBeDelivered(job: JobRow): void {
  if (job.status === "delivered") return;
  if (job.status === "accepted") fail(409, "already_accepted", "This job is already accepted, so it cannot be changed.");
  if (job.status === "revising" || job.status === "running" || job.status === "checking" || job.status === "in_review") {
    fail(409, "still_working", "The agent is still working on this job. Wait for the new draft, then try again.");
  }
  if (job.status === "rejected" || job.status === "disputed") fail(409, "with_our_team", "Our team is looking at this job. We will get back to you.");
  fail(409, "no_draft_yet", "This job has no draft ready for you yet.");
}

function pickCriteria(ids: string[] | undefined, criteria: RubricCriterion[]): RubricCriterion[] {
  const wanted = [...new Set(ids ?? [])];
  const byId = new Map(criteria.map(c => [c.id, c]));
  if (wanted.some(id => !byId.has(id))) fail(400, "invalid_input", "Pick checklist items from this job's checklist.");
  return wanted.map(id => byId.get(id)!);
}

function decisionStatement(db: D1Database, d: {
  jobId: string; draftId: string; kind: DecisionRow["kind"]; reasons?: string; failedCriteria?: string[];
  edits?: StoredEdits | null; rating?: number | null; createdBy: string; at: string;
}): D1PreparedStatement {
  return db.prepare("INSERT INTO decisions (id, job_id, draft_id, kind, reasons, failed_criteria, edits, rating, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(newId("dec"), d.jobId, d.draftId, d.kind, d.reasons ?? "", JSON.stringify(d.failedCriteria ?? []), d.edits ? JSON.stringify(d.edits) : null, d.rating ?? null, d.createdBy, d.at);
}

const errText = (err: unknown) => (err instanceof Error ? err.message : String(err)).slice(0, 300);

/** notifyOps should never throw; this keeps a buyer's action from failing if it does. */
async function alertOps(env: Env, notice: { kind: string; subject: string; text: string; link?: string }): Promise<void> {
  try { await notifyOps(env, notice); } catch (err) { console.error("delivery_ops_alert_failed", notice.kind, errText(err)); }
}

async function notifyBuyer(env: Env, job: JobRow, notice: { kind: string; subject: string; text: string }): Promise<void> {
  try { await notify(env, { userId: job.created_by, link: `/jobs/${job.id}`, ...notice }); }
  catch (err) { console.error("delivery_notify_failed", notice.kind, errText(err)); }
}

function checkRating(rating: number | null | undefined): number | null {
  if (rating === undefined || rating === null) return null;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) fail(400, "invalid_input", "Pick 1 to 5 stars.");
  return rating;
}

// ---------- Release ----------

/** Let the buyer see a draft: moves the job to delivered, sets delivered_at and auto_accept_at (+5 days), emails the buyer. */
export async function releaseDraft(env: Env, input: { jobId: string; draftId: string; actor: string; actorKind: ActorKind }): Promise<JobRow> {
  const db = env.DB;
  const job = await loadJob(env, input.jobId);
  const draft = await first<DraftRow>(db, "SELECT * FROM drafts WHERE id = ? AND job_id = ?", input.draftId, job.id);
  if (!draft) return fail(404, "draft_not_found", "We could not find that draft for this job.");
  // Safe to repeat (workflow steps retry): a job already delivered with this draft comes back unchanged.
  if (job.status === "delivered" && draft.released_at) return job;
  if (job.status !== "in_review" && job.status !== "checking") {
    return fail(409, "not_releasable", `This job is ${STATUS_LABELS[job.status].toLowerCase()}, so its draft cannot be released now.`);
  }
  const now = nowIso();
  const updated = await transitionJob(env, {
    jobId: job.id, to: "delivered", actor: input.actor, actorKind: input.actorKind,
    data: { draftId: draft.id, version: draft.version },
    set: { delivered_at: now, auto_accept_at: addHours(now, AUTO_ACCEPT_DAYS * 24) },
    also: [
      db.prepare("UPDATE drafts SET released_at = ?, released_by = ? WHERE id = ? AND released_at IS NULL").bind(now, input.actor, draft.id),
      eventStatement(db, { actor: input.actor, actorKind: input.actorKind, entity: "draft", entityId: draft.id, type: "draft.released", data: { jobId: job.id, version: draft.version } }, now),
    ],
  });
  const persona = await personaFor(env, job.persona_id);
  const agent = persona?.name ?? "Your agent";
  const revised = job.revisions_used > 0;
  await notifyBuyer(env, job, {
    kind: "job.delivered",
    subject: revised ? `The new draft of ${jobName(job)} is ready` : `${jobName(job)} is ready for you`,
    text: [
      revised ? `${agent} made the changes you asked for.` : `${agent} finished your draft.`,
      "Open it to read it. Then accept it, ask for changes or reject it.",
      `If you do nothing, we accept it for you in ${AUTO_ACCEPT_DAYS} days. Nothing is charged during the beta.`,
    ].join(" "),
  });
  return updated;
}

// ---------- Buyer decisions ----------

/** The buyer accepts. Optional edited version is stored as a diff (with consent rules applied to its later use). */
export async function acceptJob(env: Env, input: { jobId: string; userId: string; rating?: number; note?: string; editedContent?: string; actorKind?: ActorKind }): Promise<JobRow> {
  const job = await loadJob(env, input.jobId);
  mustBeDelivered(job);
  const draft = await latestReleasedDraft(env, job.id);
  if (!draft) return fail(409, "no_draft_yet", "This job has no draft ready for you yet.");
  const rating = checkRating(input.rating);
  const edits = editsRecord(draft.id, draft.content, input.editedContent);
  const now = nowIso();
  return transitionJob(env, {
    jobId: job.id, to: "accepted", actor: input.userId, actorKind: input.actorKind ?? "user",
    data: { draftId: draft.id, rating, edited: !!edits },
    set: { accepted_at: now },
    also: [decisionStatement(env.DB, { jobId: job.id, draftId: draft.id, kind: "accept", reasons: input.note?.trim() ?? "", edits, rating, createdBy: input.userId, at: now })],
  });
}

/** The plain instructions a revision run gets: the buyer's words, the unmet checklist items and their own edits. */
export function revisionFeedback(input: { reasons: string; failed: RubricCriterion[]; edits: StoredEdits | null; round: number; allowed: number }): string {
  const parts = [`The buyer asked for changes (revision ${input.round} of ${input.allowed}). Fix every point below and keep everything else that works.`];
  if (input.reasons.trim()) parts.push(`What the buyer said:\n${input.reasons.trim()}`);
  if (input.failed.length) {
    parts.push(`Checklist items the buyer says are not met:\n${input.failed.map(c => `- ${c.text}${c.pass_rule ? ` (how it is checked: ${c.pass_rule})` : ""}`).join("\n")}`);
  }
  if (input.edits) {
    const summary = summarizeDiff(input.edits.ops);
    parts.push(`The buyer edited the last draft themselves (${input.edits.removed} lines removed, ${input.edits.added} lines added). Keep their changes and match their style:\n${summary || "(only blank lines changed)"}`);
  }
  return parts.join("\n\n");
}

/** The buyer asks for changes (max revisions_allowed). Moves to revising and starts a revision run with the reasons. */
export async function requestRevision(env: Env, input: { jobId: string; userId: string; reasons: string; failedCriteria: string[]; editedContent?: string; actorKind?: ActorKind }): Promise<JobRow> {
  const job = await loadJob(env, input.jobId);
  mustBeDelivered(job);
  if (job.revisions_used >= job.revisions_allowed) {
    return fail(409, "no_revisions_left", `You have used all ${job.revisions_allowed} revisions on this job. Accept the work, or reject it and our team will follow up.`);
  }
  const draft = await latestReleasedDraft(env, job.id);
  if (!draft) return fail(409, "no_draft_yet", "This job has no draft ready for you yet.");
  const failed = pickCriteria(input.failedCriteria, await rubricFor(env, job));
  const reasons = (input.reasons ?? "").trim();
  if (!reasons && !failed.length) return fail(400, "invalid_input", "Say what should change, or tick the checklist items that are not met.");
  const edits = editsRecord(draft.id, draft.content, input.editedContent);
  const round = job.revisions_used + 1;
  const feedback = revisionFeedback({ reasons, failed, edits, round, allowed: job.revisions_allowed });
  const actorKind = input.actorKind ?? "user";
  const now = nowIso();
  const updated = await transitionJob(env, {
    jobId: job.id, to: "revising", actor: input.userId, actorKind,
    data: { draftId: draft.id, round, failedCriteria: failed.map(c => c.id), edited: !!edits },
    set: { revisions_used: round },
    also: [decisionStatement(env.DB, { jobId: job.id, draftId: draft.id, kind: "revise", reasons, failedCriteria: failed.map(c => c.id), edits, createdBy: input.userId, at: now })],
  });
  try {
    await startJobRun(env, { jobId: job.id, actor: input.userId, actorKind, kind: "revision", feedback });
  } catch (err) {
    // The request is saved and the job stays in revising; ops starts the run by hand.
    console.error("delivery_revision_start_failed", job.id, errText(err));
    await alertOps(env, {
      kind: "job.revision_not_started",
      subject: `Revision did not start: ${jobName(job)}`,
      text: `The buyer asked for changes, but the revision run did not start (${errText(err)}). Start it from the job page.`,
      link: `/ops/jobs/${job.id}`,
    });
  }
  return (await getJob(env, job.id)) ?? updated;
}

/** The buyer rejects the work. Ops is alerted; payments are on hold so there is nothing to refund yet. */
export async function rejectJob(env: Env, input: { jobId: string; userId: string; reasons: string; failedCriteria: string[]; actorKind?: ActorKind }): Promise<JobRow> {
  const job = await loadJob(env, input.jobId);
  mustBeDelivered(job);
  const draft = await latestReleasedDraft(env, job.id);
  if (!draft) return fail(409, "no_draft_yet", "This job has no draft ready for you yet.");
  const failed = pickCriteria(input.failedCriteria, await rubricFor(env, job));
  const reasons = (input.reasons ?? "").trim();
  if (!reasons) return fail(400, "invalid_input", "Tell us why you are rejecting the work, so our team can put it right.");
  const now = nowIso();
  const updated = await transitionJob(env, {
    jobId: job.id, to: "rejected", actor: input.userId, actorKind: input.actorKind ?? "user",
    data: { draftId: draft.id, failedCriteria: failed.map(c => c.id) },
    also: [decisionStatement(env.DB, { jobId: job.id, draftId: draft.id, kind: "reject", reasons, failedCriteria: failed.map(c => c.id), createdBy: input.userId, at: now })],
  });
  await alertOps(env, {
    kind: "job.rejected",
    subject: `A buyer rejected ${jobName(job)}`,
    text: [`Reason: ${reasons}`, failed.length ? `Not met: ${failed.map(c => c.text).join("; ")}` : "", `Revisions used: ${job.revisions_used} of ${job.revisions_allowed}.`].filter(Boolean).join("\n"),
    link: `/ops/jobs/${job.id}`,
  });
  return updated;
}

/** "Report a problem": a delivered job moves to disputed with the buyer's reasons; ops is alerted and auto-accept stops. */
export async function reportProblem(env: Env, input: { jobId: string; userId: string; reasons: string; actorKind?: ActorKind }): Promise<JobRow> {
  const job = await loadJob(env, input.jobId);
  mustBeDelivered(job);
  const reasons = (input.reasons ?? "").trim();
  if (!reasons) return fail(400, "invalid_input", "Tell us what the problem is.");
  const draft = await latestReleasedDraft(env, job.id);
  const reportId = newId("rpt"), now = nowIso();
  const updated = await transitionJob(env, {
    jobId: job.id, to: "disputed", actor: input.userId, actorKind: input.actorKind ?? "user",
    data: { reportId, draftId: draft?.id ?? null },
    also: [
      env.DB.prepare("INSERT INTO problem_reports (id, job_id, draft_id, reasons, status, created_by, created_at) VALUES (?, ?, ?, ?, 'open', ?, ?)")
        .bind(reportId, job.id, draft?.id ?? null, reasons, input.userId, now),
    ],
  });
  await alertOps(env, {
    kind: "job.disputed",
    subject: `A buyer reported a problem with ${jobName(job)}`,
    text: `Problem: ${reasons}\nThe job is now disputed and will not be accepted automatically. Reply to the buyer and settle it from the job page.`,
    link: `/ops/jobs/${job.id}`,
  });
  return updated;
}

/** Scheduled: accept delivered jobs whose auto_accept_at has passed. Returns how many. */
export async function autoAcceptDue(env: Env): Promise<number> {
  const now = nowIso();
  const due = await all<JobRow>(env.DB, "SELECT * FROM jobs WHERE status = 'delivered' AND auto_accept_at IS NOT NULL AND auto_accept_at <= ? ORDER BY auto_accept_at LIMIT 200", now);
  let accepted = 0;
  for (const job of due) {
    try {
      const draft = await latestReleasedDraft(env, job.id);
      await transitionJob(env, {
        jobId: job.id, to: "accepted", actor: "system", actorKind: "system",
        data: { auto: true, draftId: draft?.id ?? null },
        set: { accepted_at: now },
        also: draft ? [decisionStatement(env.DB, { jobId: job.id, draftId: draft.id, kind: "auto_accept", createdBy: "system", at: now })] : [],
      });
      accepted++;
      await notifyBuyer(env, job, {
        kind: "job.auto_accepted",
        subject: `We marked ${jobName(job)} as done`,
        text: `Your draft was ready ${AUTO_ACCEPT_DAYS} days ago and we did not hear back, so we accepted it for you. You can still read, copy and download it.`,
      });
    } catch (err) {
      // A buyer acting at the same moment wins; anything else is logged and tried again on the next run.
      if (!(err instanceof HttpError && err.status === 409)) console.error("delivery_auto_accept_failed", job.id, errText(err));
    }
  }
  return accepted;
}

// ---------- Buyer views (the MCP module can reuse these) ----------

export interface PersonaBrief { id: string; name: string; title: string; portrait: string | null; accent: string | null }

function personaBrief(p: PersonaRow | null): PersonaBrief | null {
  if (!p) return null;
  const profile = parseJson<{ portrait?: unknown; accent?: unknown }>(p.profile, {});
  return {
    id: p.id, name: p.name, title: p.title,
    portrait: typeof profile.portrait === "string" && profile.portrait.startsWith("/") ? profile.portrait : null,
    accent: typeof profile.accent === "string" && /^#[0-9a-fA-F]{3,8}$/.test(profile.accent) ? profile.accent : null,
  };
}

/** Where a buyer opens a job: unfinished orders go back to the intake page. */
export const jobHref = (job: { id: string; status: JobStatus }) => (job.status === "draft" || job.status === "quoted" ? `/requests/${job.id}` : `/jobs/${job.id}`);

export interface JobListItem {
  id: string; title: string; status: JobStatus; statusLabel: string; needsYou: boolean; href: string;
  persona: PersonaBrief | null; jobType: { id: string; title: string } | null;
  priceCents: number | null; currency: string; createdAt: string; updatedAt: string;
}

/** Jobs in every org the user belongs to, newest first. */
export async function listJobsForUser(env: Env, userId: string, limit = 200): Promise<JobListItem[]> {
  const rows = await all<JobRow & { p_id: string | null; p_name: string | null; p_title: string | null; p_profile: string | null }>(env.DB,
    `SELECT j.*, p.id AS p_id, p.name AS p_name, p.title AS p_title, p.profile AS p_profile
     FROM jobs j LEFT JOIN personas p ON p.id = j.persona_id
     WHERE j.org_id IN (SELECT org_id FROM org_members WHERE user_id = ?)
     ORDER BY j.created_at DESC, j.id DESC LIMIT ?`, userId, limit);
  return rows.map(r => {
    const jt = getJobType(r.job_type_id);
    return {
      id: r.id, title: r.title?.trim() || jt?.title || "Untitled job", status: r.status, statusLabel: STATUS_LABELS[r.status],
      needsYou: r.status === "delivered" || r.status === "draft" || r.status === "quoted", href: jobHref(r),
      persona: personaBrief(r.p_id ? { id: r.p_id, name: r.p_name ?? "", title: r.p_title ?? "", profile: r.p_profile ?? "{}" } : null),
      jobType: jt ? { id: jt.id, title: jt.title } : null,
      priceCents: r.price_cents, currency: r.currency, createdAt: r.created_at, updatedAt: r.updated_at,
    };
  });
}

export interface TimelineItem { at: string; type: string; label: string }

function timelineLabel(status: string, from: string, actorKind: string, data: Record<string, unknown>): string | null {
  switch (status) {
    case "quoted": return "Quote ready";
    case "confirmed": return "You ordered";
    case "running": return from === "revising" ? "Changes started" : from === "confirmed" ? "Work started" : "Work started again";
    case "checking": return "Checking the draft";
    case "in_review": return "Final check by our team";
    case "delivered": return "Draft ready for you";
    case "revising": return "You asked for changes";
    case "accepted": return data.auto ? `Accepted for you after ${AUTO_ACCEPT_DAYS} days` : actorKind === "ops" ? "Marked as done by our team" : "You accepted the work";
    case "rejected": return actorKind === "ops" ? "Closed by our team" : "You rejected the work";
    case "disputed": return actorKind === "ops" ? "Our team is reviewing it" : "You reported a problem";
    case "failed": return "Delayed. Our team is on it";
    case "cancelled": return "Cancelled";
    default: return null;
  }
}

/** job.* status events in plain words. Internal reruns inside one round of work show once; other event types never show. */
export function buyerTimeline(events: EventRow[]): TimelineItem[] {
  const out: TimelineItem[] = [];
  let seen = new Set<string>();
  for (const e of events) {
    if (e.entity !== "job" || !e.type.startsWith("job.")) continue;
    const status = e.type.slice(4);
    const data = parseJson<Record<string, unknown>>(e.data, {});
    const working = status === "running" || status === "checking" || status === "in_review";
    if (working) {
      if (seen.has(status)) continue;
      seen.add(status);
    } else seen = new Set();
    const label = timelineLabel(status, typeof data.from === "string" ? data.from : "", e.actor_kind, data);
    if (label) out.push({ at: e.at, type: e.type, label });
  }
  return out;
}

export interface DraftCheck { passed: boolean; criteria: { id: string; pass: boolean }[] }

/** The latest rubric check of a draft as pass marks only (no judge evidence or notes). */
export async function latestCheck(env: Env, draftId: string): Promise<DraftCheck | null> {
  const row = await first<{ passed: number; result: string }>(env.DB, "SELECT passed, result FROM scores WHERE draft_id = ? AND judge = 'rubric' ORDER BY created_at DESC, rowid DESC LIMIT 1", draftId);
  if (!row) return null;
  const result = parseJson<Partial<RubricResult>>(row.result, {});
  const criteria = Array.isArray(result.criteria)
    ? result.criteria.filter(c => c && typeof c.id === "string").map(c => ({ id: c.id, pass: c.pass === true }))
    : [];
  return { passed: row.passed === 1, criteria };
}

export interface NextStep { title: string; text: string }

/** What is happening and what happens next, in plain words. */
export function nextStep(job: JobRow, agent: string): NextStep {
  const work = getJobType(job.job_type_id)?.title.toLowerCase() ?? "job";
  switch (job.status) {
    case "draft": return { title: "Your order is not finished", text: "Answer the questions and confirm the quote to start the work." };
    case "quoted": return { title: "Your quote is ready", text: "Check the price and the checklist, then confirm to start the work." };
    case "confirmed": return { title: `${agent} is about to start`, text: "Work starts in a moment. This page updates by itself." };
    case "running": return job.revisions_used > 0
      ? { title: `${agent} is making your changes`, text: "When the new draft is done, we check it against your checklist. We email you when it is ready." }
      : { title: `${agent} is working on your ${work}`, text: "When the draft is done, we check it against your checklist. We email you when it is ready." };
    case "checking": return { title: "We are checking the draft", text: `Each item on your checklist gets a pass or a fail. If something fails, ${agent} fixes it before you see it.` };
    case "in_review": return { title: "Our team is giving it a final look", text: "During the beta, a person on our team reads every draft before you see it. We email you when it is ready." };
    case "delivered": return { title: "Your draft is ready", text: "Read it, then accept it, ask for changes or reject it." };
    case "revising": return { title: "Your changes are on the way", text: `${agent} starts on them in a moment. This page updates by itself.` };
    case "accepted": return { title: "Done", text: "This job is finished. You can copy or download the work any time." };
    case "rejected": return { title: "You rejected this work", text: "Our team will look at what went wrong and get back to you. Nothing was charged." };
    case "disputed": return { title: "Our team is looking into it", text: "We got your report, so we will not accept the work for you. We will get back to you by email." };
    case "failed": return { title: "Your job is delayed", text: "Something went wrong on our side. Our team knows and will get it moving again." };
    case "cancelled": return { title: "This job was cancelled", text: "Nothing was charged." };
  }
}

const DECISION_LABELS: Record<DecisionRow["kind"], string> = {
  accept: "You accepted the work", revise: "You asked for changes", reject: "You rejected the work", auto_accept: `Accepted for you after ${AUTO_ACCEPT_DAYS} days`,
};

/** Everything the buyer's job page shows. Only released drafts; check results as pass marks only. */
export async function buyerJobView(env: Env, job: JobRow) {
  const db = env.DB;
  const [persona, criteria, draftRows, decisionRows, events, brief] = await Promise.all([
    personaFor(env, job.persona_id),
    rubricFor(env, job),
    all<DraftRow>(db, "SELECT * FROM drafts WHERE job_id = ? AND released_at IS NOT NULL ORDER BY released_at, version", job.id),
    all<DecisionRow>(db, "SELECT * FROM decisions WHERE job_id = ? ORDER BY created_at, rowid", job.id),
    eventsFor(db, "job", job.id),
    first<{ request_text: string }>(db, "SELECT request_text FROM briefs WHERE job_id = ?", job.id),
  ]);
  const jt = getJobType(job.job_type_id);
  const quote = parseJson<Partial<Quote>>(job.quote, {});
  const drafts = await Promise.all(draftRows.map(async d => ({
    id: d.id, version: d.version, format: d.format, content: d.content, releasedAt: d.released_at, check: await latestCheck(env, d.id),
  })));
  const revisionsLeft = Math.max(0, job.revisions_allowed - job.revisions_used);
  const delivered = job.status === "delivered" && drafts.length > 0;
  const agent = personaBrief(persona);
  const query = new URLSearchParams();
  if (job.persona_id) query.set("persona", job.persona_id);
  if (job.job_type_id) query.set("job", job.job_type_id);
  const qs = query.toString();
  return {
    job: {
      id: job.id, title: job.title?.trim() || jt?.title || "Untitled job", status: job.status, statusLabel: STATUS_LABELS[job.status],
      working: WORKING_STATUSES.includes(job.status),
      jobTypeId: job.job_type_id, personaId: job.persona_id,
      priceCents: job.price_cents, currency: job.currency, paymentStatus: job.payment_status,
      turnaroundHours: job.turnaround_hours, dueAt: job.due_at,
      createdAt: job.created_at, updatedAt: job.updated_at, deliveredAt: job.delivered_at, autoAcceptAt: job.auto_accept_at, acceptedAt: job.accepted_at,
      revisionsUsed: job.revisions_used, revisionsAllowed: job.revisions_allowed,
    },
    persona: agent,
    jobType: jt ? { id: jt.id, title: jt.title, deliverable: jt.deliverable } : null,
    request: brief?.request_text ?? null,
    quote: typeof quote.price_cents === "number"
      ? { priceCents: quote.price_cents, breakdown: Array.isArray(quote.breakdown) ? quote.breakdown : [], turnaroundHours: quote.turnaround_hours ?? null, rush: !!quote.rush }
      : null,
    criteria: criteria.map(c => ({ id: c.id, text: c.text, critical: !!c.critical, source: c.source })),
    timeline: buyerTimeline(events),
    drafts,
    decisions: decisionRows.map(d => {
      const edits = parseJson<StoredEdits | null>(d.edits, null);
      return {
        id: d.id, kind: d.kind, label: DECISION_LABELS[d.kind], rating: d.rating, reasons: d.reasons,
        failedCriteria: parseJson<string[]>(d.failed_criteria, []), edited: !!edits,
        editStats: edits ? { added: edits.added, removed: edits.removed } : null, createdAt: d.created_at,
      };
    }),
    revisionsLeft,
    next: nextStep(job, agent?.name ?? "Your agent"),
    actions: { accept: delivered, revise: delivered && revisionsLeft > 0, reject: delivered, report: delivered },
    orderAgain: qs ? `/new?${qs}` : "/new",
  };
}

export type BuyerJobView = Awaited<ReturnType<typeof buyerJobView>>;
