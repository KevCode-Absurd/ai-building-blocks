// API routes for the experts module. Paths and owners are listed in ARCHITECTURE.md.
import { fail, json, oneOf, str, type Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { account, requireApprovedExpert, requireOps } from "../../core/access.ts";
import { AREAS } from "../../core/types.ts";
import {
  AGREEMENT_VERSION, REVIEW_TIME, agreement, applyAsExpert, expertDashboard, expertView, foundingSpots, getExpertForUser,
  listApplications, reviewApplication, syncAllExpertPersonas, syncExpertPersona, type ExpertApplication,
} from "./service.ts";

const STATUSES = ["all", "applied", "approved", "rejected", "paused"] as const;

export const routes: Route[] = [
  // The founding expert agreement (a draft until a lawyer reviews it). Public so anyone can read it before applying.
  { method: "GET", path: "/api/experts/agreement", handler: () => json({ agreement: agreement() }) },

  {
    method: "POST", path: "/api/experts/apply", handler: async ctx => {
      const a = await account(ctx);
      const body = await ctx.body<Record<string, unknown>>();
      const application = (body.application && typeof body.application === "object" ? body.application : body) as unknown as ExpertApplication;
      const row = await applyAsExpert(ctx.env, { userId: a.user.id, application });
      return json({ expert: expertView(row), review_time: REVIEW_TIME }, 201);
    },
  },

  {
    method: "GET", path: "/api/experts/me", handler: async ctx => {
      const a = await account(ctx);
      const row = await getExpertForUser(ctx.env, a.user.id);
      return json({
        expert: row ? expertView(row) : null,
        agreement: { version: AGREEMENT_VERSION },
        review_time: REVIEW_TIME,
        founding: await foundingSpots(ctx.env),
      });
    },
  },

  {
    method: "GET", path: "/api/experts/me/dashboard", handler: async ctx => {
      const a = await requireApprovedExpert(ctx);
      // Bring the expert's persona in step with their live agents first, so the page never shows a stale status.
      await syncExpertPersona(ctx.env, a.expert.id, a.user.id, "expert").catch(err => console.error("experts.sync_persona_failed", err instanceof Error ? err.message : String(err)));
      return json(await expertDashboard(ctx.env, a.expert.id));
    },
  },

  {
    method: "GET", path: "/api/experts", handler: async ctx => {
      await requireOps(ctx);
      const p = ctx.url.searchParams;
      const status = p.get("status") || "all";
      if (!STATUSES.includes(status as (typeof STATUSES)[number])) fail(400, "invalid_input", `status must be one of: ${STATUSES.join(", ")}.`);
      const area = p.get("area") || "";
      if (area && !AREAS.includes(area as (typeof AREAS)[number])) fail(400, "invalid_input", `area must be one of: ${AREAS.join(", ")}.`);
      const limit = p.get("limit") ? Number(p.get("limit")) : undefined;
      return json(await listApplications(ctx.env, { status, area, jobType: p.get("job_type") || undefined, q: (p.get("q") ?? "").trim().slice(0, 100) || undefined, limit }));
    },
  },

  {
    method: "POST", path: "/api/experts/:id/review", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<{ decision?: string; note?: string }>();
      const decision = oneOf(body.decision, "decision", ["approve", "reject", "pause"] as const);
      const note = str(body.note, "note", { optional: true, max: 2000 });
      const row = await reviewApplication(ctx.env, { expertId: ctx.params.id!, decision, note, actor: a.user.id });
      return json({ expert: expertView(row) });
    },
  },
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [syncAllExpertPersonas];
