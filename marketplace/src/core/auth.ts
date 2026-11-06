// Who is calling. Browser requests carry a Clerk session token (Authorization: Bearer <token>), verified offline
// with Clerk's public key (CLERK_JWT_KEY), so no secret is needed. Other token kinds (MCP OAuth) plug in below.
import { verifyToken } from "@clerk/backend";
import type { Env } from "../env.ts";

export interface AuthUser {
  id: string;                       // Clerk user id
  via: "session" | "oauth" | "test";
  sessionId?: string;
  /** Present when the Clerk session token carries an "email" claim (Clerk dashboard > Sessions > Customize session token). */
  email?: string;
  /** OAuth scopes when via = "oauth". */
  scopes?: string[];
}

export type TokenVerifier = (token: string, env: Env) => Promise<AuthUser | null>;
const verifiers: TokenVerifier[] = [];
/** Modules that issue their own bearer tokens (the MCP module's OAuth) register a verifier at import time. */
export function registerTokenVerifier(v: TokenVerifier): void { verifiers.push(v); }

export async function authenticate(req: Request, env: Env): Promise<AuthUser | null> {
  // Tests and local dev only: the live Clerk app does not work on localhost. Staging and production never set this.
  if ((env.APP_ENV === "test" || env.APP_ENV === "local") && env.AUTH_TEST_MODE === "true") {
    const testUser = req.headers.get("x-test-user");
    if (testUser) return { id: testUser, via: "test", email: req.headers.get("x-test-email") ?? undefined };
  }
  const header = req.headers.get("authorization") ?? "";
  const m = /^Bearer (\S{10,16384})$/.exec(header);
  if (!m) return null;
  const token = m[1];
  for (const verify of verifiers) {
    const user = await verify(token, env).catch(() => null);
    if (user) return user;
  }
  return verifyClerkSession(token, env);
}

async function verifyClerkSession(token: string, env: Env): Promise<AuthUser | null> {
  if (!env.CLERK_JWT_KEY && !env.CLERK_SECRET_KEY) return null;
  try {
    const payload: any = await verifyToken(token, {
      ...(env.CLERK_JWT_KEY ? { jwtKey: env.CLERK_JWT_KEY.replace(/\\n/g, "\n") } : { secretKey: env.CLERK_SECRET_KEY }),
      authorizedParties: [env.APP_ORIGIN],
    });
    if (!payload?.sub) return null;
    // Pending sessions (an unfinished sign-in step such as MFA) cannot act.
    if (payload.sts && payload.sts !== "active") return null;
    const email = typeof payload.email === "string" && payload.email.includes("@") ? payload.email.toLowerCase() : undefined;
    return { id: payload.sub, via: "session", sessionId: payload.sid, email };
  } catch {
    return null;
  }
}
