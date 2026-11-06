// API routes for the delivery module. Paths and owners are listed in ARCHITECTURE.md.
//   GET  /api/jobs                 the caller's jobs (every org they belong to), newest first
//   GET  /api/jobs/:id             the buyer's view of one job (released drafts only)
//   POST /api/jobs/:id/accept      { rating 1-5, note?, editedContent?, shareEdits?: boolean }
//   POST /api/jobs/:id/revise      { reasons?, failedCriteria?: string[], editedContent?, shareEdits?: boolean } (reasons or criteria needed)
//   POST /api/jobs/:id/reject      { reasons, failedCriteria?: string[] }
//   POST /api/jobs/:id/report      { reasons }
//   POST /api/jobs/:id/decisions/:decisionId/share-edits   { share: boolean }  change the choice for one decision's edits
//   GET  /api/settings/edit-sharing                        the caller's org choice about learning from edits
//   POST /api/settings/edit-sharing { share: boolean }     change it (off also stops every past decision's edits)
//   GET  /api/notifications        the caller's latest 50 messages, with read marks and the unread count
//   GET  /api/notifications/unread { unread } for the header bell
//   POST /api/notifications/:id/read, POST /api/notifications/read-all
//   GET  /api/ops/problems?status=open|resolved|all, GET /api/ops/problems/:id (ops)
//   POST /api/ops/problems/:id/resolve { outcome: rerun|accept|cancel|close, note } (ops)
import type { Ctx, Route } from "../../core/http.ts";
import { fail, json, oneOf, str } from "../../core/http.ts";
import { account, isOrgMember, jobForCaller, requireOps, runsInYourAi } from "../../core/access.ts";
import type { JobRow } from "../../core/types.ts";
import { getJob } from "../../core/jobs.ts";
import type { Env } from "../../env.ts";
import { acceptJob, autoAcceptDue, buyerJobView, listJobsForUser, rejectJob, reportProblem, requestRevision } from "./service.ts";
import { orgLearnChoice, setDecisionConsent, setOrgLearnChoice } from "./consent.ts";
import { listNotifications, markAllNotificationsRead, markNotificationRead, unreadCount } from "./notifications.ts";
import { PROBLEM_OUTCOMES, getProblemReport, listProblemReports, problemCounts, resolveProblem } from "./problems.ts";

const MAX_EDITED = 100_000;

/** A job the caller may act on as a buyer: a member of the job's org (ops use the ops console instead). */
async function buyerJob(ctx: Ctx, opts: { needsBeta?: boolean } = {}) {
  const { job, account: a } = await jobForCaller<JobRow>(ctx, ctx.params.id);
  if (!(await isOrgMember(ctx.env, a.user.id, job.org_id))) fail(403, "buyer_only", "Only the people who started this job can do that.");
  if (opts.needsBeta && !a.hostedJobs) fail(403, "runs_in_your_ai", runsInYourAi(ctx.env));
  if (opts.needsBeta && !a.betaAccess) fail(403, "beta_access_required", "Hiring needs an invite code right now. Enter your code to ask for changes.");
  return { job, account: a };
}

function editedText(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return fail(400, "invalid_input", "Your edited text must be text.");
  if (value.length > MAX_EDITED) return fail(400, "invalid_input", "Your edited text is too long (max 100,000 characters).");
  return value;
}

function criterionIds(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 30 || value.some(v => typeof v !== "string" || v.length > 80)) {
    return fail(400, "invalid_input", "Pick checklist items from this job's checklist.");
  }
  return value as string[];
}

function rating(value: unknown): number {
  const n = typeof value === "string" && value.trim() ? Number(value) : value;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > 5) return fail(400, "invalid_input", "Pick 1 to 5 stars.");
  return n;
}

/** A yes / no from the body. Optional values may be left out. */
function yesNo(value: unknown, what: string, opts: { optional?: boolean } = {}): boolean | undefined {
  if ((value === undefined || value === null) && opts.optional) return undefined;
  if (typeof value !== "boolean") return fail(400, "invalid_input", `Say yes or no to ${what}.`);
  return value;
}

async function view(ctx: Ctx, jobId: string) {
  return json(await buyerJobView(ctx.env, (await getJob(ctx.env, jobId))!));
}

async function editSharing(ctx: Ctx, orgId: string) {
  const c = await orgLearnChoice(ctx.env, orgId);
  return { share: c.granted, chosen: c.set, updatedAt: c.updatedAt };
}

export const routes: Route[] = [
  {
    method: "GET", path: "/api/jobs", handler: async ctx => {
      const a = await account(ctx);
      return json({ jobs: await listJobsForUser(ctx.env, a.user.id) });
    },
  },
  {
    method: "GET", path: "/api/jobs/:id", handler: async ctx => {
      const { job } = await jobForCaller<JobRow>(ctx, ctx.params.id);
      return json(await buyerJobView(ctx.env, job));
    },
  },
  {
    method: "POST", path: "/api/jobs/:id/accept", handler: async ctx => {
      const { job, account: a } = await buyerJob(ctx);
      const body = await ctx.body<{ rating?: unknown; note?: unknown; editedContent?: unknown; shareEdits?: unknown }>();
      await acceptJob(ctx.env, {
        jobId: job.id, userId: a.user.id, actorKind: "user",
        rating: rating(body.rating),
        note: str(body.note, "Your note", { optional: true, max: 2000 }),
        editedContent: editedText(body.editedContent),
        shareEdits: yesNo(body.shareEdits, "sharing your edits", { optional: true }),
      });
      return view(ctx, job.id);
    },
  },
  {
    method: "POST", path: "/api/jobs/:id/revise", handler: async ctx => {
      const { job, account: a } = await buyerJob(ctx, { needsBeta: true });
      const body = await ctx.body<{ reasons?: unknown; failedCriteria?: unknown; editedContent?: unknown; shareEdits?: unknown }>();
      await requestRevision(ctx.env, {
        jobId: job.id, userId: a.user.id, actorKind: "user",
        reasons: str(body.reasons, "What should change", { optional: true, max: 4000 }),
        failedCriteria: criterionIds(body.failedCriteria),
        editedContent: editedText(body.editedContent),
        shareEdits: yesNo(body.shareEdits, "sharing your edits", { optional: true }),
      });
      return view(ctx, job.id);
    },
  },
  {
    method: "POST", path: "/api/jobs/:id/reject", handler: async ctx => {
      const { job, account: a } = await buyerJob(ctx);
      const body = await ctx.body<{ reasons?: unknown; failedCriteria?: unknown }>();
      await rejectJob(ctx.env, {
        jobId: job.id, userId: a.user.id, actorKind: "user",
        reasons: str(body.reasons, "why you are rejecting the work", { max: 4000 }),
        failedCriteria: criterionIds(body.failedCriteria),
      });
      return view(ctx, job.id);
    },
  },
  {
    method: "POST", path: "/api/jobs/:id/report", handler: async ctx => {
      const { job, account: a } = await buyerJob(ctx);
      const body = await ctx.body<{ reasons?: unknown }>();
      await reportProblem(ctx.env, { jobId: job.id, userId: a.user.id, actorKind: "user", reasons: str(body.reasons, "what the problem is", { max: 4000 }) });
      return view(ctx, job.id);
    },
  },
  {
    method: "POST", path: "/api/jobs/:id/decisions/:decisionId/share-edits", handler: async ctx => {
      const { job, account: a } = await buyerJob(ctx);
      const body = await ctx.body<{ share?: unknown }>();
      const share = yesNo(body.share, "sharing your edits") as boolean;
      await setDecisionConsent(ctx.env, { jobId: job.id, decisionId: ctx.params.decisionId, userId: a.user.id, granted: share });
      return view(ctx, job.id);
    },
  },

  // ---------- Learning from edits: the org's choice ----------
  {
    method: "GET", path: "/api/settings/edit-sharing", handler: async ctx => {
      const a = await account(ctx);
      return json(await editSharing(ctx, a.orgId));
    },
  },
  {
    method: "POST", path: "/api/settings/edit-sharing", handler: async ctx => {
      const a = await account(ctx);
      const body = await ctx.body<{ share?: unknown }>();
      const share = yesNo(body.share, "sharing your edits") as boolean;
      const res = await setOrgLearnChoice(ctx.env, { orgId: a.orgId, userId: a.user.id, granted: share });
      return json({ ...(await editSharing(ctx, a.orgId)), stopped: res.withdrawn });
    },
  },

  // ---------- In-app messages ----------
  {
    method: "GET", path: "/api/notifications", handler: async ctx => {
      const a = await account(ctx);
      return json(await listNotifications(ctx.env, a.user.id));
    },
  },
  {
    method: "GET", path: "/api/notifications/unread", handler: async ctx => {
      const a = await account(ctx);
      return json({ unread: await unreadCount(ctx.env, a.user.id) });
    },
  },
  {
    method: "POST", path: "/api/notifications/read-all", handler: async ctx => {
      const a = await account(ctx);
      const marked = await markAllNotificationsRead(ctx.env, a.user.id);
      return json({ marked, unread: await unreadCount(ctx.env, a.user.id) });
    },
  },
  {
    method: "POST", path: "/api/notifications/:id/read", handler: async ctx => {
      const a = await account(ctx);
      await markNotificationRead(ctx.env, a.user.id, ctx.params.id);
      return json({ ok: true, unread: await unreadCount(ctx.env, a.user.id) });
    },
  },

  // ---------- Problem reports (ops) ----------
  {
    method: "GET", path: "/api/ops/problems", handler: async ctx => {
      await requireOps(ctx);
      const status = oneOf(ctx.url.searchParams.get("status") ?? "open", "The list", ["open", "resolved", "all"] as const);
      return json({ reports: await listProblemReports(ctx.env, { status }), counts: await problemCounts(ctx.env) });
    },
  },
  {
    method: "GET", path: "/api/ops/problems/:id", handler: async ctx => {
      await requireOps(ctx);
      const report = await getProblemReport(ctx.env, ctx.params.id);
      if (!report) return fail(404, "report_not_found", "We could not find that problem report.");
      return json({ report });
    },
  },
  {
    method: "POST", path: "/api/ops/problems/:id/resolve", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<{ outcome?: unknown; note?: unknown }>();
      const outcome = oneOf(body.outcome, "What happens next", PROBLEM_OUTCOMES);
      const note = str(body.note, "a note for the buyer", { max: 4000 });
      const res = await resolveProblem(ctx.env, { reportId: ctx.params.id, outcome, note, actor: a.user.id });
      return json({ ok: true, report: res.report, runId: res.runId, counts: await problemCounts(ctx.env) });
    },
  },
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [
  async env => { await autoAcceptDue(env); },
];
