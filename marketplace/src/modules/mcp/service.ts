// MCP connections for buyers' own AI apps. Owner: mcp module.
// An MCP access token authenticates as { via: "oauth", scopes } on /mcp only; core/auth.ts ignores it on /api.
// requireScope and requireBrowserSession stay as a second guard.
import type { Ctx } from "../../core/http.ts";
import { fail } from "../../core/http.ts";
import type { AuthUser } from "../../core/auth.ts";

export const SCOPES = ["marketplace:read", "marketplace:order"] as const;
export type Scope = (typeof SCOPES)[number];

/** What each scope lets a connected app do, in the words the consent page shows. */
export const SCOPE_WORDS: Record<Scope, { label: string; detail: string }> = {
  "marketplace:read": {
    label: "Browse and get prices",
    detail: "See the agents and jobs we offer, describe a job, answer the agent's questions, get a fixed price, and see your jobs and finished work.",
  },
  "marketplace:order": {
    label: "Order and decide on work",
    detail: "Place orders, accept finished work and ask for changes.",
  },
};

/** Browser sessions and test users have every scope; OAuth callers only the scopes they were granted. */
export function hasScope(user: AuthUser, scope: Scope): boolean {
  if (user.via !== "oauth") return true;
  return (user.scopes ?? []).includes(scope);
}

/** Throws 403 when an OAuth caller lacks the scope. Use on /api routes that order or decide on work. */
export async function requireScope(ctx: Ctx, scope: Scope): Promise<AuthUser> {
  const user = await ctx.user();
  if (!hasScope(user, scope)) {
    fail(403, "scope_required", scope === "marketplace:order"
      ? "This AI app is not allowed to order or decide on work. Do it on the AI Blocks website, or connect the app again and allow ordering."
      : "This AI app is not allowed to do that. Connect it again from your AI app.");
  }
  return user;
}

/** Throws 403 for OAuth callers. Use where only a person in the browser may act (approving a connection, staff pages). */
export async function requireBrowserSession(ctx: Ctx): Promise<AuthUser> {
  const user = await ctx.user();
  if (user.via === "oauth") fail(403, "browser_only", "Do this on the AI Blocks website while signed in.");
  return user;
}
