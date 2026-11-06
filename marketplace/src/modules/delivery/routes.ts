// API routes for the delivery module. Paths and owners are listed in ARCHITECTURE.md.
//   GET  /api/jobs                 the caller's jobs (every org they belong to), newest first
//   GET  /api/jobs/:id             the buyer's view of one job (released drafts only)
//   POST /api/jobs/:id/accept      { rating 1-5, note?, editedContent? }
//   POST /api/jobs/:id/revise      { reasons?, failedCriteria?: string[], editedContent? } (reasons or criteria needed)
//   POST /api/jobs/:id/reject      { reasons, failedCriteria?: string[] }
//   POST /api/jobs/:id/report      { reasons }
//   GET  /api/notifications        the caller's latest 50 messages
import type { Ctx, Route } from "../../core/http.ts";
import { fail, json, str } from "../../core/http.ts";
import { account, isOrgMember, jobForCaller } from "../../core/access.ts";
import type { JobRow } from "../../core/types.ts";
import { all } from "../../core/db.ts";
import { getJob } from "../../core/jobs.ts";
import type { Env } from "../../env.ts";
import { acceptJob, autoAcceptDue, buyerJobView, listJobsForUser, rejectJob, reportProblem, requestRevision } from "./service.ts";

const MAX_EDITED = 100_000;

/** A job the caller may act on as a buyer: a member of the job's org (ops use the ops console instead). */
async function buyerJob(ctx: Ctx, opts: { needsBeta?: boolean } = {}) {
  const { job, account: a } = await jobForCaller<JobRow>(ctx, ctx.params.id);
  if (!(await isOrgMember(ctx.env, a.user.id, job.org_id))) fail(403, "buyer_only", "Only the people who ordered this job can do that.");
  if (opts.needsBeta && !a.betaAccess) fail(403, "beta_access_required", "The beta is invite-only for now. Enter your invite code to ask for changes.");
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

async function view(ctx: Ctx, jobId: string) {
  return json(await buyerJobView(ctx.env, (await getJob(ctx.env, jobId))!));
}

/** "https://agents.useaiblocks.com/jobs/job_1" -> "/jobs/job_1" for in-app links. */
function appPath(link: string | null): string | null {
  if (!link) return null;
  try { const u = new URL(link); return u.pathname + u.search; } catch { return null; }
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
      const body = await ctx.body<{ rating?: unknown; note?: unknown; editedContent?: unknown }>();
      await acceptJob(ctx.env, {
        jobId: job.id, userId: a.user.id, actorKind: "user",
        rating: rating(body.rating),
        note: str(body.note, "Your note", { optional: true, max: 2000 }),
        editedContent: editedText(body.editedContent),
      });
      return view(ctx, job.id);
    },
  },
  {
    method: "POST", path: "/api/jobs/:id/revise", handler: async ctx => {
      const { job, account: a } = await buyerJob(ctx, { needsBeta: true });
      const body = await ctx.body<{ reasons?: unknown; failedCriteria?: unknown; editedContent?: unknown }>();
      await requestRevision(ctx.env, {
        jobId: job.id, userId: a.user.id, actorKind: "user",
        reasons: str(body.reasons, "What should change", { optional: true, max: 4000 }),
        failedCriteria: criterionIds(body.failedCriteria),
        editedContent: editedText(body.editedContent),
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
    method: "GET", path: "/api/notifications", handler: async ctx => {
      const a = await account(ctx);
      const rows = await all<{ id: string; kind: string; subject: string; body_text: string; link: string | null; status: string; created_at: string }>(ctx.env.DB,
        "SELECT id, kind, subject, body_text, link, status, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 50", a.user.id);
      return json({
        notifications: rows.map(r => ({
          id: r.id, kind: r.kind, subject: r.subject, text: r.body_text, link: r.link, path: appPath(r.link), emailed: r.status === "sent", createdAt: r.created_at,
        })),
      });
    },
  },
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [
  async env => { await autoAcceptDue(env); },
];
