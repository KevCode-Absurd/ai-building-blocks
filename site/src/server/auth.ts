import { accountAttemptLimit, type ComposerPolicyEnv } from "../lib/composer-policy.ts";
import { createClerkClient } from "@clerk/backend";
import { securityJson } from "./api-security.ts";
import type { ComposerStore } from "./composer.ts";
import type { SaveFailureReporter } from "./save-diagnostics.ts";

export type AuthEnv = ComposerPolicyEnv & { CLERK_PUBLISHABLE_KEY?: string; CLERK_SECRET_KEY?: string; CLERK_JWT_KEY?: string };
/** Read from Clerk after session verification, never from browser-supplied email fields. */
export async function verifiedEmails(user: string, env: AuthEnv): Promise<string[]> {
  const client = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  const profile = await client.users.getUser(user);
  return profile.emailAddresses.filter(e => e.verification?.status === "verified").map(e => e.emailAddress.toLowerCase());
}
export function authConfigured(env: AuthEnv) {
  return /^pk_(test|live)_[A-Za-z0-9=]+$/.test(env.CLERK_PUBLISHABLE_KEY ?? "") && !!env.CLERK_SECRET_KEY;
}

export async function handleAccount(request: Request, env: AuthEnv, store: ComposerStore | null): Promise<Response> {
  if (request.method !== "GET") return securityJson(405, { error: "Use GET." }, { allow: "GET" });
  const configured = authConfigured(env);
  if (!new URL(request.url).searchParams.has("usage")) return securityJson(200, { configured, publishableKey: configured ? env.CLERK_PUBLISHABLE_KEY : null });
  const user = await authenticateUser(request, env); if (user instanceof Response) return user;
  if (!store) return securityJson(503, { error: "Usage history is temporarily unavailable." });
  const usage = await store.usage(user, new Date().toISOString().slice(0, 10));
  const limit = accountAttemptLimit(env, user);
  return securityJson(200, { completed: usage.completed, attemptsToday: usage.attemptsToday, dailyAttemptLimit: limit, dailyIpAttemptLimit: limit === null ? null : 10, unlimited: limit === null });
}
export async function authenticateUser(req: Request, env: AuthEnv, report: SaveFailureReporter = () => {}): Promise<string | Response> {
  if (!authConfigured(env)) { report("auth", "auth_config_missing"); return securityJson(503, { error: "Sign-in is being connected. Free assembly is ready to use." }); }
  // Explicit bearer tokens keep owner-key authorization on existing spaces separate.
  const token = req.headers.get("authorization") ?? "";
  if (!/^Bearer \S+$/.test(token) || token.length > 16384) { report("auth", "session_required"); return securityJson(401, { error: "Sign in to access your saved work." }); }
  try {
    const client = createClerkClient({ publishableKey: env.CLERK_PUBLISHABLE_KEY!, secretKey: env.CLERK_SECRET_KEY });
    const state = await client.authenticateRequest(req, {
      acceptsToken: "session_token", authorizedParties: [new URL(req.url).origin],
      issuer: `https://${atob(env.CLERK_PUBLISHABLE_KEY!.split("_")[2]).replace(/\$$/, "")}`,
      ...(env.CLERK_JWT_KEY ? { jwtKey: env.CLERK_JWT_KEY.replace(/\\n/g, "\n") } : {}),
    });
    const auth = state.toAuth();
    // Pending sessions (for example, an unfinished MFA task) cannot generate.
    if (!state.isAuthenticated || !auth?.userId || auth.sessionStatus !== "active") {
      report("auth", "auth_inactive");
      return securityJson(401, { error: "Your session expired or needs verification. Sign in again." });
    }
    return auth.userId;
  } catch {
    report("auth", "auth_verification_failed");
    return securityJson(401, { error: "Your session could not be verified. Sign in again." });
  }
}
