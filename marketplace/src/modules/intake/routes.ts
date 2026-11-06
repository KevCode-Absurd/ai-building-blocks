// API routes for the intake module. Paths and owners are listed in ARCHITECTURE.md.
// Every route needs a signed-in buyer (anyone signed in, unless INVITE_ONLY is "true"); jobs are loaded through
// jobForCaller so other orgs get a 404. Hiring is free: no route takes or returns a price.
// The plan step has two addresses: /plan (current) and /quote (older clients). Starting has /start and /confirm.
// Ops are exempt from the daily job limit (DAILY_JOBS_PER_USER).
import { fail, json, type Ctx, type Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { jobForCaller, requireBuyer } from "../../core/access.ts";
import { answerQuestions, confirmOrder, expireQuotes, getIntake, quoteJob, startRequest } from "./service.ts";
import { requestView } from "./views.ts";

/** An optional id from the body: a short string, or nothing. */
function optionalId(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || value.length > 80 || !/^[a-z0-9][a-z0-9_-]*$/i.test(value)) return fail(400, "invalid_input", `That ${field} is not valid. Pick one from the list.`);
  return value;
}

async function callerJob(ctx: Ctx) {
  const a = await requireBuyer(ctx);
  const { job } = await jobForCaller(ctx, ctx.params.id);
  return { a, job };
}

const actorKindFor = (ops: boolean) => (ops ? "ops" as const : "user" as const);

/** Build (or rebuild) the plan. `faster` (or the older `rush`) asks for faster delivery. */
async function plan(ctx: Ctx): Promise<Response> {
  const { a, job } = await callerJob(ctx);
  const body = await ctx.body<{ faster?: unknown; rush?: unknown; goals?: unknown }>();
  const faster = body.faster ?? body.rush;
  if (faster !== undefined && typeof faster !== "boolean") return fail(400, "invalid_input", "Faster delivery must be on or off.");
  if (body.goals !== undefined && body.goals !== null && typeof body.goals !== "string") return fail(400, "invalid_input", "Write what else matters as plain text.");
  await quoteJob(ctx.env, {
    jobId: job.id, userId: a.user.id, rush: faster as boolean | undefined, goals: (body.goals ?? undefined) as string | undefined,
    actorKind: actorKindFor(a.ops && a.user.id !== job.created_by),
  });
  return json({ request: await requestView(ctx.env, await getIntake(ctx.env, job.id)) });
}

/** Start the job from its plan. */
async function start(ctx: Ctx): Promise<Response> {
  const { a, job } = await callerJob(ctx);
  const started = await confirmOrder(ctx.env, {
    jobId: job.id, userId: a.user.id, actorKind: actorKindFor(a.ops && a.user.id !== job.created_by), ignoreDailyLimit: a.ops,
  });
  return json({
    job: { id: started.id, status: started.status, title: started.title, due_at: started.due_at },
    next: `/jobs/${started.id}`,
  });
}

export const routes: Route[] = [
  {
    method: "POST", path: "/api/requests", handler: async ctx => {
      const a = await requireBuyer(ctx);
      const body = await ctx.body<{ text?: unknown; jobTypeId?: unknown; job_type_id?: unknown; personaId?: unknown; persona_id?: unknown }>();
      if (typeof body.text !== "string") return fail(400, "request_empty", "Tell us what you need, in a sentence or two.");
      const state = await startRequest(ctx.env, {
        orgId: a.orgId, userId: a.user.id, text: body.text, source: "web",
        jobTypeId: optionalId(body.jobTypeId ?? body.job_type_id, "job"),
        personaId: optionalId(body.personaId ?? body.persona_id, "agent"),
        ignoreDailyLimit: a.ops,
      });
      return json({ request: await requestView(ctx.env, state) }, 201);
    },
  },

  {
    method: "GET", path: "/api/requests/:id", handler: async ctx => {
      const { job } = await callerJob(ctx);
      return json({ request: await requestView(ctx.env, await getIntake(ctx.env, job.id)) });
    },
  },

  {
    method: "POST", path: "/api/requests/:id/answers", handler: async ctx => {
      const { a, job } = await callerJob(ctx);
      const body = await ctx.body<{ answers?: unknown; jobTypeId?: unknown; job_type_id?: unknown }>();
      const answers = body.answers ?? {};
      if (typeof answers !== "object" || answers === null || Array.isArray(answers)) return fail(400, "invalid_input", "Send your answers as field names and values.");
      const state = await answerQuestions(ctx.env, {
        jobId: job.id, userId: a.user.id, answers: answers as Record<string, unknown>,
        jobTypeId: optionalId(body.jobTypeId ?? body.job_type_id, "job"), actorKind: actorKindFor(a.ops && a.user.id !== job.created_by),
      });
      return json({ request: await requestView(ctx.env, state) });
    },
  },

  { method: "POST", path: "/api/requests/:id/plan", handler: plan },
  { method: "POST", path: "/api/requests/:id/quote", handler: plan },
  { method: "POST", path: "/api/requests/:id/start", handler: start },
  { method: "POST", path: "/api/requests/:id/confirm", handler: start },
];

/** Work the 15-minute cron runs for this module: plans nobody started within 7 days go back to draft, and the buyer is told. */
export const scheduled: ((env: Env) => Promise<void>)[] = [
  async env => { await expireQuotes(env); },
];
