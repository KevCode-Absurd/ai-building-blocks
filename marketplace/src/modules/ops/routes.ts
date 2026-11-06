// API routes for the ops module. Paths and owners are listed in ARCHITECTURE.md. Every route is ops-only.
import { fail, int, json, oneOf, str, type Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { requireOps } from "../../core/access.ts";
import { gateMetrics } from "./service.ts";
import { costReport, jobRecord, jobSummary, listAgents, listJobSummaries } from "./queries.ts";
import {
  addNote, assignAgent, cancelJob, changeStaff, createBetaCodes, listBetaCodes, listStaff, parseExpiry, releaseJob, rerunJob, resolveJob, seedAll,
} from "./actions.ts";

type Body = Record<string, unknown>;
const flag = (v: unknown) => v !== false && v !== "false";

export const routes: Route[] = [
  {
    method: "GET", path: "/api/ops/jobs", handler: async ctx => {
      await requireOps(ctx);
      const p = ctx.url.searchParams;
      const jobs = await listJobSummaries(ctx.env, { status: p.get("status") ?? undefined, q: p.get("q") ?? undefined, queue: p.get("queue") ?? undefined });
      return json({ jobs });
    },
  },

  {
    method: "GET", path: "/api/ops/jobs/:id", handler: async ctx => {
      await requireOps(ctx);
      const record = await jobRecord(ctx.env, ctx.params.id);
      if (!record) return fail(404, "job_not_found", "We could not find that job.");
      return json(record);
    },
  },

  {
    method: "POST", path: "/api/ops/jobs/:id/release", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      if (typeof body.draft_id !== "string" || !body.draft_id.trim()) return fail(400, "invalid_input", "Pick a draft to release.");
      const draftId = str(body.draft_id, "the draft", { max: 100 });
      await releaseJob(ctx.env, { jobId: ctx.params.id, draftId, actor: a.user.id });
      return json({ ok: true, job: await jobSummary(ctx.env, ctx.params.id) });
    },
  },

  {
    method: "POST", path: "/api/ops/jobs/:id/rerun", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      const feedback = str(body.feedback, "notes for the agent", { max: 4000 });
      const { runId } = await rerunJob(ctx.env, { jobId: ctx.params.id, feedback, actor: a.user.id });
      return json({ ok: true, runId, job: await jobSummary(ctx.env, ctx.params.id) });
    },
  },

  {
    method: "POST", path: "/api/ops/jobs/:id/cancel", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      const reason = str(body.reason, "a reason", { max: 2000 });
      await cancelJob(ctx.env, { jobId: ctx.params.id, reason, actor: a.user.id, notifyBuyer: flag(body.notify_buyer) });
      return json({ ok: true, job: await jobSummary(ctx.env, ctx.params.id) });
    },
  },

  {
    method: "POST", path: "/api/ops/jobs/:id/assign", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      if (typeof body.agent_id !== "string" || !body.agent_id.trim()) return fail(400, "invalid_input", "Pick an agent.");
      const agentId = str(body.agent_id, "the agent", { max: 100 });
      const version = body.version === undefined || body.version === null || body.version === "" ? undefined : int(body.version, "Version", { min: 1, max: 100_000 });
      await assignAgent(ctx.env, { jobId: ctx.params.id, agentId, version, actor: a.user.id });
      return json({ ok: true, job: await jobSummary(ctx.env, ctx.params.id) });
    },
  },

  {
    method: "POST", path: "/api/ops/jobs/:id/note", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      const text = str(body.body, "your note", { max: 4000 });
      const note = await addNote(ctx.env, { jobId: ctx.params.id, body: text, actor: a.user.id });
      return json({ ok: true, note });
    },
  },

  {
    method: "POST", path: "/api/ops/jobs/:id/resolve", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      const outcome = oneOf(body.outcome, "The decision", ["accept", "rerun", "cancel"] as const);
      const note = str(body.note, "a note about your decision", { max: 4000 });
      const res = await resolveJob(ctx.env, { jobId: ctx.params.id, outcome, note, actor: a.user.id, notifyBuyer: flag(body.notify_buyer) });
      return json({ ok: true, runId: res.runId ?? null, job: await jobSummary(ctx.env, ctx.params.id) });
    },
  },

  {
    method: "GET", path: "/api/ops/gate", handler: async ctx => {
      await requireOps(ctx);
      return json(await gateMetrics(ctx.env));
    },
  },

  {
    method: "GET", path: "/api/ops/beta-codes", handler: async ctx => {
      await requireOps(ctx);
      return json({ codes: await listBetaCodes(ctx.env) });
    },
  },

  {
    method: "POST", path: "/api/ops/beta-codes", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      const count = body.count === undefined ? 1 : int(body.count, "Number of codes", { min: 1, max: 100 });
      const maxUses = body.max_uses === undefined ? 1 : int(body.max_uses, "Uses per code", { min: 1, max: 1000 });
      const note = str(body.note, "a note", { max: 200, optional: true });
      const expiresAt = parseExpiry(body.expires_at);
      const codes = await createBetaCodes(ctx.env, { count, maxUses, note, expiresAt, actor: a.user.id });
      return json({ ok: true, codes, max_uses: maxUses, note, expires_at: expiresAt });
    },
  },

  {
    method: "GET", path: "/api/ops/staff", handler: async ctx => {
      await requireOps(ctx);
      return json(await listStaff(ctx.env));
    },
  },

  {
    method: "POST", path: "/api/ops/staff", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      const action = oneOf(body.action ?? "add", "The action", ["add", "remove"] as const);
      const role = oneOf(body.role, "The role", ["ops", "reviewer"] as const);
      const userId = str(body.user_id, "a user id", { max: 200, optional: true });
      const email = str(body.email, "an email", { max: 320, optional: true });
      const res = await changeStaff(ctx.env, { action, role, userId: userId || undefined, email: email || undefined, actor: a.user.id });
      return json({ ok: true, ...res, ...(await listStaff(ctx.env)) });
    },
  },

  {
    method: "POST", path: "/api/ops/seed", handler: async ctx => {
      const a = await requireOps(ctx);
      return json(await seedAll(ctx.env, a.user.id));
    },
  },

  {
    method: "GET", path: "/api/ops/agents", handler: async ctx => {
      await requireOps(ctx);
      const p = ctx.url.searchParams;
      const agents = await listAgents(ctx.env, { status: p.get("status") ?? undefined, kind: p.get("kind") ?? undefined, job_type: p.get("job_type") ?? undefined, q: p.get("q") ?? undefined });
      return json({ agents });
    },
  },

  {
    method: "GET", path: "/api/ops/costs", handler: async ctx => {
      await requireOps(ctx);
      return json(await costReport(ctx.env));
    },
  },
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [];
