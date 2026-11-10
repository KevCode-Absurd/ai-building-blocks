// API routes for the experts module. Paths and owners are listed in ARCHITECTURE.md.
import { fail, json, oneOf, str, type Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { account, ensureAccount, requireApprovedExpert, requireOps } from "../../core/access.ts";
import { AREAS } from "../../core/types.ts";
import {
  AGREEMENT_VERSION, REVIEW_TIME, agreement, applyAsExpert, expertDashboard, expertView, foundingSpots, getExpertForUser,
  listApplications, reviewApplication, syncAllExpertPersonas, syncExpertPersona, type ExpertApplication,
} from "./service.ts";
import { createInvite, emailInvite, listInvites, openInvite, revokeInvite } from "./invites.ts";
import {
  acceptAgreement, ensureAllProfiles, ensureProfile, myProfile, onboardingChecklist, publicProfile, recordAgentUse, saveProfile,
  usedAgents, usedCookie,
} from "./profiles.ts";

const STATUSES = ["all", "applied", "approved", "rejected", "paused"] as const;

export const routes: Route[] = [
  // The founding expert agreement (a draft until a lawyer reviews it). Public so anyone can read it before applying.
  { method: "GET", path: "/api/experts/agreement", handler: () => json({ agreement: agreement() }) },

  {
    method: "POST", path: "/api/experts/apply", handler: async ctx => {
      const a = await account(ctx);
      const body = await ctx.body<Record<string, unknown>>();
      const application = (body.application && typeof body.application === "object" ? body.application : body) as unknown as ExpertApplication;
      const row = await applyAsExpert(ctx.env, { userId: a.user.id, application, inviteToken: body.invite_token });
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
      if (row.status === "approved") await ensureProfile(ctx.env, row).catch(err => console.error("experts.ensure_profile_failed", err instanceof Error ? err.message : String(err)));
      return json({ expert: expertView(row) });
    },
  },

  // ---------- Founding invites ----------

  // The invited person's page: public (the token is the key). The first visit marks the invite opened.
  {
    method: "GET", path: "/api/experts/invites/:token", handler: async ctx => {
      const invite = await openInvite(ctx.env, ctx.params.token!);
      return json({ invite, founding: await foundingSpots(ctx.env), review_time: REVIEW_TIME });
    },
  },
  {
    method: "GET", path: "/api/ops/invites", handler: async ctx => {
      await requireOps(ctx);
      return json({ ...(await listInvites(ctx.env)), founding: await foundingSpots(ctx.env) });
    },
  },
  {
    method: "POST", path: "/api/ops/invites", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Record<string, unknown>>();
      return json({ invite: await createInvite(ctx.env, { ...body, actor: a.user.id }) }, 201);
    },
  },
  {
    method: "POST", path: "/api/ops/invites/:id/revoke", handler: async ctx => {
      const a = await requireOps(ctx);
      return json({ invite: await revokeInvite(ctx.env, { id: ctx.params.id!, actor: a.user.id }) });
    },
  },
  {
    method: "POST", path: "/api/ops/invites/:id/email", handler: async ctx => {
      const a = await requireOps(ctx);
      const founding = await foundingSpots(ctx.env);
      return json(await emailInvite(ctx.env, { id: ctx.params.id!, actor: a.user.id, foundingLeft: founding.left }));
    },
  },

  // ---------- Public profiles, share links, onboarding ----------

  {
    method: "GET", path: "/api/expert-profiles/:slug", handler: async ctx => {
      const profile = await publicProfile(ctx.env, ctx.params.slug!);
      if (!profile) fail(404, "profile_not_found", "There is no expert page at this address.");
      return json({ profile });
    },
  },
  {
    method: "GET", path: "/api/experts/me/profile", handler: async ctx => {
      const a = await requireApprovedExpert(ctx);
      return json({ profile: await myProfile(ctx.env, a.expert) });
    },
  },
  {
    method: "POST", path: "/api/experts/me/profile", handler: async ctx => {
      const a = await requireApprovedExpert(ctx);
      const body = await ctx.body<{ headline?: unknown; bio?: unknown }>();
      return json({ profile: await saveProfile(ctx.env, { expert: a.expert, actor: a.user.id, headline: body.headline, bio: body.bio }) });
    },
  },
  {
    method: "GET", path: "/api/experts/me/checklist", handler: async ctx => {
      const a = await requireApprovedExpert(ctx);
      return json({ checklist: await onboardingChecklist(ctx.env, a.expert) });
    },
  },
  {
    method: "POST", path: "/api/experts/me/agreement", handler: async ctx => {
      const a = await requireApprovedExpert(ctx);
      const body = await ctx.body<{ version?: unknown }>();
      await acceptAgreement(ctx.env, { expert: a.expert, actor: a.user.id, version: body.version });
      return json({ ok: true, version: AGREEMENT_VERSION });
    },
  },
  // A download or load of an expert's agent, counted for the expert whose share link brought this browser here.
  // Public; counts each agent once per browser. Answers the same whether or not it counted.
  {
    method: "POST", path: "/api/share/agent-use", handler: async ctx => {
      const body = await ctx.body<{ agent?: unknown }>();
      const personaId = str(body.agent, "agent", { max: 80 });
      const seen = usedAgents(ctx.req);
      const headers: Record<string, string> = {};
      if (!seen.includes(personaId)) {
        const user = await ctx.maybeUser();
        const referredBy = user ? (await ensureAccount(ctx.env, user)).user.referred_by_expert ?? null : null;
        if (await recordAgentUse(ctx.env, { req: ctx.req, personaId, referredBy })) headers["set-cookie"] = usedCookie(ctx.env, [...seen, personaId]);
      }
      return json({ ok: true }, 200, headers);
    },
  },
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [
  syncAllExpertPersonas,
  ensureAllProfiles,
];
