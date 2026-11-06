// Accounts and permissions: users, personal orgs, staff roles, hiring access and expert status.
import type { Env } from "../env.ts";
import type { Ctx } from "./http.ts";
import { fail } from "./http.ts";
import type { AuthUser } from "./auth.ts";
import { first, newId, nowIso } from "./db.ts";
import { eventStatement } from "./events.ts";

export interface UserRow { id: string; email: string | null; email_verified: number; name: string | null; beta_access: number; created_at: string; last_seen_at: string }
export interface ExpertRow {
  id: string; user_id: string; status: "applied" | "approved" | "rejected" | "paused"; display_name: string; headline: string;
  areas: string; job_types: string; application: string; founding: number; agreement_version: string | null; agreement_accepted_at: string | null;
  review_note: string; reviewed_by: string | null; reviewed_at: string | null; created_at: string; updated_at: string;
}

export interface Account {
  user: UserRow;
  auth: AuthUser;
  orgId: string;            // the user's personal org
  ops: boolean;
  reviewer: boolean;        // ops are reviewers too
  /** Can hire agents. True for everyone signed in unless INVITE_ONLY is "true"; then it needs a redeemed invite code. */
  betaAccess: boolean;
  /** May start jobs that run here, on our model keys: everyone while HOSTED_JOBS is "on", else ops only. */
  hostedJobs: boolean;
  expert: ExpertRow | null;
}

const opsIds = (env: Env) => (env.OPS_USER_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean);

/** Hiring is open to anyone signed in unless INVITE_ONLY is exactly "true". */
export const inviteOnly = (env: Env) => env.INVITE_ONLY === "true";

/** Jobs run on this site (on our model keys) only when HOSTED_JOBS is exactly "on". Off, agents run in people's own
 *  AI: the free download, the API and the MCP connector. */
export const hostedJobs = (env: Env) => env.HOSTED_JOBS === "on";

/** What a visitor is told when they try to start a job while hosted jobs are off. */
export const runsInYourAi = (env: Env) =>
  `Our agents work in your own AI, so we do not run jobs on this site. Download the agent from its page, or connect your AI at ${env.APP_ORIGIN}/connect and load the agent there.`;

/** Creates the user row and personal org on first sign-in; refreshes last_seen and email afterwards. */
export async function ensureAccount(env: Env, auth: AuthUser): Promise<Account> {
  const db = env.DB, now = nowIso();
  let user = await first<UserRow>(db, "SELECT * FROM users WHERE id = ?", auth.id);
  if (!user) {
    const orgId = newId("org");
    await db.batch([
      db.prepare("INSERT INTO users (id, email, email_verified, name, beta_access, created_at, last_seen_at) VALUES (?, ?, ?, NULL, 0, ?, ?) ON CONFLICT(id) DO NOTHING")
        .bind(auth.id, auth.email ?? null, auth.email ? 1 : 0, now, now),
      db.prepare("INSERT INTO orgs (id, name, personal, created_by, created_at) SELECT ?, 'Personal', 1, ?, ? WHERE NOT EXISTS (SELECT 1 FROM org_members WHERE user_id = ?)")
        .bind(orgId, auth.id, now, auth.id),
      db.prepare("INSERT INTO org_members (org_id, user_id, role, created_at) SELECT ?, ?, 'owner', ? WHERE EXISTS (SELECT 1 FROM orgs WHERE id = ?)")
        .bind(orgId, auth.id, now, orgId),
      eventStatement(db, { actor: auth.id, actorKind: "user", entity: "user", entityId: auth.id, type: "user.signed_up", data: { via: auth.via } }, now),
    ]);
    user = (await first<UserRow>(db, "SELECT * FROM users WHERE id = ?", auth.id))!;
  } else if (Date.parse(now) - Date.parse(user.last_seen_at) > 5 * 60_000 || (auth.email && auth.email !== user.email)) {
    await db.prepare("UPDATE users SET last_seen_at = ?, email = COALESCE(?, email), email_verified = CASE WHEN ? IS NULL THEN email_verified ELSE 1 END WHERE id = ?")
      .bind(now, auth.email ?? null, auth.email ?? null, auth.id).run();
  }
  const org = await first<{ org_id: string }>(db, "SELECT m.org_id FROM org_members m JOIN orgs o ON o.id = m.org_id WHERE m.user_id = ? ORDER BY o.personal DESC, m.created_at LIMIT 1", auth.id);
  const roles = await env.DB.prepare("SELECT role FROM staff WHERE user_id = ?").bind(auth.id).all<{ role: string }>();
  const staffRoles = new Set((roles.results ?? []).map(r => r.role));
  const ops = opsIds(env).includes(auth.id) || staffRoles.has("ops");
  const expert = await first<ExpertRow>(db, "SELECT * FROM experts WHERE user_id = ?", auth.id);
  return {
    user, auth, orgId: org!.org_id, ops,
    reviewer: ops || staffRoles.has("reviewer"),
    betaAccess: ops || !inviteOnly(env) || user.beta_access === 1,
    hostedJobs: ops || hostedJobs(env),
    expert,
  };
}

export async function account(ctx: Ctx): Promise<Account> {
  return ensureAccount(ctx.env, await ctx.user());
}

export async function requireOps(ctx: Ctx): Promise<Account> {
  const a = await account(ctx);
  if (!a.ops) fail(403, "ops_only", "Only the AI Blocks team can do that.");
  return a;
}

export async function requireReviewer(ctx: Ctx): Promise<Account> {
  const a = await account(ctx);
  if (!a.reviewer) fail(403, "reviewer_only", "Only reviewers can do that.");
  return a;
}

/** Starting a job here: ops only while HOSTED_JOBS is off. Then, unless INVITE_ONLY is "true" (buyers need a redeemed
 *  invite code), anyone signed in. */
export async function requireBuyer(ctx: Ctx): Promise<Account> {
  const a = await account(ctx);
  if (!a.hostedJobs) fail(403, "runs_in_your_ai", runsInYourAi(ctx.env));
  if (!a.betaAccess) fail(403, "beta_access_required", "Hiring needs an invite code right now. Enter your code to hire an agent.");
  return a;
}

export async function requireApprovedExpert(ctx: Ctx): Promise<Account & { expert: ExpertRow }> {
  const a = await account(ctx);
  if (!a.expert || a.expert.status !== "approved") fail(403, "expert_only", "This is for approved experts. Apply first, and we will email you when you are approved.");
  return a as Account & { expert: ExpertRow };
}

export async function isOrgMember(env: Env, userId: string, orgId: string): Promise<boolean> {
  return !!(await first(env.DB, "SELECT 1 AS ok FROM org_members WHERE org_id = ? AND user_id = ?", orgId, userId));
}

/** Loads a job the caller may see as a buyer (member of its org) or as ops. 404 otherwise, so ids do not leak. */
export async function jobForCaller<T = import("./types.ts").JobRow>(ctx: Ctx, jobId: string): Promise<{ job: T; account: Account }> {
  const a = await account(ctx);
  const job = await first<any>(ctx.env.DB, "SELECT * FROM jobs WHERE id = ?", jobId);
  if (!job || (!a.ops && !(await isOrgMember(ctx.env, a.user.id, job.org_id)))) fail(404, "job_not_found", "We could not find that job.");
  return { job: job as T, account: a };
}
