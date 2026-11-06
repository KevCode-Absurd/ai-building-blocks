// API routes for the evaluation module. Paths and owners are listed in ARCHITECTURE.md.
//   GET  /api/review/blind/next   reviewer: the oldest open pair they have not judged (brief + drafts A and B only)
//   POST /api/review/blind/:id    reviewer: { pick: "a" | "b" | "tie", reason? }, one per reviewer per pair
//   GET  /api/review/stats        ops: blind win rates (all, by job type, by agent) and model-judge agreement
import { json, oneOf, str, type Route } from "../../core/http.ts";
import { requireOps, requireReviewer } from "../../core/access.ts";
import type { Env } from "../../env.ts";
import { nextBlindTest, recordJudgment, reviewStats, reviewerCounts } from "./service.ts";

const PICKS = ["a", "b", "tie"] as const;

export const routes: Route[] = [
  {
    method: "GET", path: "/api/review/blind/next", handler: async ctx => {
      const a = await requireReviewer(ctx);
      return json(await nextBlindTest(ctx.env, a.user.id));
    },
  },
  {
    method: "POST", path: "/api/review/blind/:id", handler: async ctx => {
      const a = await requireReviewer(ctx);
      const body = await ctx.body<{ pick?: unknown; reason?: unknown }>();
      const pick = oneOf(body.pick, "pick", PICKS);
      const reason = str(body.reason, "reason", { optional: true, max: 2000 });
      const { closed } = await recordJudgment(ctx.env, { testId: ctx.params.id, reviewerId: a.user.id, pick, reason });
      return json({ ok: true, closed, ...(await reviewerCounts(ctx.env, a.user.id)) });
    },
  },
  {
    method: "GET", path: "/api/review/stats", handler: async ctx => {
      await requireOps(ctx);
      return json(await reviewStats(ctx.env));
    },
  },
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [];
