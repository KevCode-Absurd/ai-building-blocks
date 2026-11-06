// Test kit: a fresh in-memory database with every migration applied, a test Env, and an API caller.
//   const t = await testEnv();
//   const res = await t.api("POST", "/api/requests", { user: "user_buyer", body: { text: "..." } });
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { Env } from "../src/env.ts";
import { handleFetch, handleScheduled } from "../src/app.ts";
import { clearFakes } from "../src/core/models.ts";
import { setCatalogueForTests } from "../src/modules/catalogue/index.ts";
import { D1Shim } from "./d1-shim.ts";
import { FIXTURE_JOB_TYPES } from "./fixtures.ts";

const MIGRATIONS = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");

export interface WorkflowCall { id?: string; params?: unknown }

export interface TestEnv {
  env: Env;
  db: D1Shim;
  workflowCalls: WorkflowCall[];
  /** Call the API as a user (Clerk id), or anonymously when user is omitted. */
  api(method: string, pathname: string, opts?: { user?: string; email?: string; body?: unknown; headers?: Record<string, string> }): Promise<{ status: number; body: any; res: Response }>;
  /** Pending ctx.waitUntil promises; await t.settle() before asserting on background work. */
  settle(): Promise<void>;
  scheduled(): Promise<void>;
  /** Make a user ops (adds a staff row). */
  makeOps(userId: string): Promise<void>;
  makeReviewer(userId: string): Promise<void>;
  /** Give a user beta access. */
  grantBeta(userId: string): Promise<void>;
  sql<T = any>(query: string, ...params: unknown[]): Promise<T[]>;
}

export async function testEnv(overrides: Partial<Env> = {}, opts: { catalogue?: typeof FIXTURE_JOB_TYPES; keepFakes?: boolean } = {}): Promise<TestEnv> {
  if (!opts.keepFakes) clearFakes();
  // Module fakes register at import; re-import them after clearing so defaults exist unless a test overrides them.
  if (!opts.keepFakes) await reloadModuleFakes();
  setCatalogueForTests(opts.catalogue ?? FIXTURE_JOB_TYPES);
  const db = new D1Shim();
  for (const file of readdirSync(MIGRATIONS).filter(f => f.endsWith(".sql")).sort()) {
    db.db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
  }
  const workflowCalls: WorkflowCall[] = [];
  const env: Env = {
    DB: db as unknown as D1Database,
    JOB_RUN: { async create(o) { workflowCalls.push(o); return { id: o.id ?? `wf_${workflowCalls.length}` }; } },
    APP_ENV: "test",
    APP_ORIGIN: "https://agents.test",
    CLERK_PUBLISHABLE_KEY: "pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk",
    AUTH_TEST_MODE: "true",
    BETA_MODE: "invite",
    MODEL_MODE: "fake",
    RELEASE_REVIEW: "required",
    DAILY_MODEL_CAP_USD: "5",
    JOB_COST_CAP_USD: "2",
    BASELINE_SAMPLE_RATE: "1",
    EMAIL_FROM: "AI Blocks <agents@useaiblocks.com>",
    ...overrides,
  };
  const pending: Promise<unknown>[] = [];
  const exec = { waitUntil(p: Promise<unknown>) { pending.push(p.catch(err => { console.error("waitUntil failed", err); })); }, passThroughOnException() {}, props: {} } as unknown as ExecutionContext;
  const t: TestEnv = {
    env, db, workflowCalls,
    async api(method, pathname, o = {}) {
      const headers: Record<string, string> = { ...(o.headers ?? {}) };
      if (o.user) headers["x-test-user"] = o.user;
      if (o.email) headers["x-test-email"] = o.email;
      if (o.body !== undefined) headers["content-type"] = "application/json";
      const req = new Request(new URL(pathname, env.APP_ORIGIN), { method, headers, body: o.body === undefined ? undefined : JSON.stringify(o.body) });
      const res = await handleFetch(req, env, exec);
      const text = await res.clone().text();
      let body: any = text;
      try { body = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
      return { status: res.status, body, res };
    },
    async settle() { while (pending.length) await Promise.all(pending.splice(0)); },
    scheduled: () => handleScheduled(env),
    async makeOps(userId) { await ensureUserRow(db, userId); db.db.prepare("INSERT OR IGNORE INTO staff (user_id, role, granted_by, created_at) VALUES (?, 'ops', 'test', ?)").run(userId, new Date().toISOString()); },
    async makeReviewer(userId) { await ensureUserRow(db, userId); db.db.prepare("INSERT OR IGNORE INTO staff (user_id, role, granted_by, created_at) VALUES (?, 'reviewer', 'test', ?)").run(userId, new Date().toISOString()); },
    async grantBeta(userId) { await ensureUserRow(db, userId); db.db.prepare("UPDATE users SET beta_access = 1 WHERE id = ?").run(userId); },
    async sql(query, ...params) { return (await db.prepare(query).bind(...params).all()).results as any[]; },
  };
  return t;
}

async function ensureUserRow(db: D1Shim, userId: string) {
  const now = new Date().toISOString();
  db.db.prepare("INSERT OR IGNORE INTO users (id, email, email_verified, name, beta_access, created_at, last_seen_at) VALUES (?, ?, 1, NULL, 0, ?, ?)").run(userId, `${userId}@example.com`, now, now);
  const has = db.db.prepare("SELECT 1 FROM org_members WHERE user_id = ?").get(userId);
  if (!has) {
    const orgId = `org_${userId}`;
    db.db.prepare("INSERT INTO orgs (id, name, personal, created_by, created_at) VALUES (?, 'Personal', 1, ?, ?)").run(orgId, userId, now);
    db.db.prepare("INSERT INTO org_members (org_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)").run(orgId, userId, now);
  }
}

let fakeVersion = 0;
async function reloadModuleFakes() {
  // A cache-busting query makes Node re-run each fakes module so its registerFake calls apply again.
  fakeVersion++;
  for (const m of ["intake", "runner", "evaluation", "studio"]) {
    await import(`../src/modules/${m}/fakes.ts?v=${fakeVersion}`);
  }
}
