// Core API: health, public config, the signed-in account, and invite codes (used only while INVITE_ONLY is "true").
import { json, fail, str, type Route } from "./http.ts";
import { account, hostedJobs, inviteOnly } from "./access.ts";
import { first, nowIso } from "./db.ts";
import { eventStatement } from "./events.ts";

export const coreRoutes: Route[] = [
  { method: "GET", path: "/api/health", handler: ctx => json({ ok: true, env: ctx.env.APP_ENV }) },

  {
    method: "GET", path: "/api/config", handler: ctx => json({
      clerkPublishableKey: ctx.env.CLERK_PUBLISHABLE_KEY,
      env: ctx.env.APP_ENV,
      inviteOnly: inviteOnly(ctx.env),
      hostedJobs: hostedJobs(ctx.env),
      libraryUrl: "https://useaiblocks.com",
    }),
  },

  {
    method: "GET", path: "/api/me", handler: async ctx => {
      const a = await account(ctx);
      return json({
        user: { id: a.user.id, email: a.user.email, emailVerified: !!a.user.email_verified, name: a.user.name },
        orgId: a.orgId,
        roles: { ops: a.ops, reviewer: a.reviewer },
        betaAccess: a.betaAccess,
        hostedJobs: a.hostedJobs,
        expert: a.expert ? { id: a.expert.id, status: a.expert.status, displayName: a.expert.display_name, founding: !!a.expert.founding } : null,
      });
    },
  },

  {
    method: "POST", path: "/api/beta/redeem", handler: async ctx => {
      const a = await account(ctx);
      const body = await ctx.body<{ code?: string }>();
      const code = str(body.code, "invite code", { max: 40 }).toUpperCase();
      if (a.betaAccess) return json({ ok: true, betaAccess: true });
      const row = await first<{ code: string; max_uses: number; uses: number; expires_at: string | null }>(ctx.env.DB, "SELECT * FROM beta_codes WHERE code = ?", code);
      if (!row || row.uses >= row.max_uses || (row.expires_at && row.expires_at < nowIso())) return fail(400, "invalid_code", "That invite code is not valid. Check it, or ask whoever invited you for a new one.");
      const db = ctx.env.DB, now = nowIso();
      const res = await db.batch([
        db.prepare("UPDATE beta_codes SET uses = uses + 1 WHERE code = ? AND uses < max_uses").bind(code),
        db.prepare("INSERT INTO beta_redemptions (code, user_id, created_at) SELECT ?, ?, ? WHERE changes() = 1").bind(code, a.user.id, now),
        db.prepare("UPDATE users SET beta_access = 1 WHERE id = ? AND EXISTS (SELECT 1 FROM beta_redemptions WHERE code = ? AND user_id = ?)").bind(a.user.id, code, a.user.id),
        eventStatement(db, { actor: a.user.id, actorKind: "user", entity: "user", entityId: a.user.id, type: "user.beta_redeemed", data: { code } }, now),
      ]);
      if (!res[0]?.meta?.changes) return fail(400, "invalid_code", "That invite code has been used up.");
      return json({ ok: true, betaAccess: true });
    },
  },
];
