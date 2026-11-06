// Intake: a plan stays open 7 days. On the 15-minute cron, a job whose plan timed out goes back to draft (the same
// move as changing a detail), keeps the buyer's goals and faster-delivery choice, and the buyer is told they can check
// the plan again. Jobs in any other state are never touched. Hiring is free, so no price is set or mentioned.
// The runner and ops services are mocked, as in intake.test.ts.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/** Value exports of a module, read from its source, so the mock keeps every name other modules import. */
function stubExports(rel: string): Record<string, unknown> {
  const src = readFileSync(new URL(rel, import.meta.url), "utf8");
  const out: Record<string, unknown> = {};
  for (const m of src.matchAll(/export\s+(?:async\s+)?(function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)\s*(=\s*(.))?/g)) {
    const [, kind, name, , start] = m;
    if (kind === "function" || kind === "function*" || kind === "class" || start === "(" || start === "a") out[name] = async () => { throw new Error(`${name} is mocked out in the intake tests`); };
    else out[name] = start === "[" ? [] : start === "{" ? {} : start === "\"" || start === "'" || start === "`" ? "" : /\d/.test(start ?? "") ? 0 : null;
  }
  return out;
}

const runnerCalls: unknown[] = [];
mock.module(new URL("../src/modules/runner/service.ts", import.meta.url).href, {
  exports: { ...stubExports("../src/modules/runner/service.ts"), startJobRun: async (_env: unknown, input: unknown) => { runnerCalls.push(input); return { runId: "run_test" }; } },
});
mock.module(new URL("../src/modules/ops/service.ts", import.meta.url).href, {
  exports: { ...stubExports("../src/modules/ops/service.ts"), notifyOps: async () => {} },
});

const { testEnv } = await import("./helpers.ts");
const { expireQuotes, quoteExpiredMessage } = await import("../src/modules/intake/service.ts");
const { scheduled } = await import("../src/modules/intake/routes.ts");
type T = Awaited<ReturnType<typeof testEnv>>;

const BUYER = "user_a";
const LANDING_TEXT = "We need a landing page for dog groomers. Our scheduling app costs $29 a month.\nVisitors should Book a call.";
const PAST = "2026-01-01T00:00:00.000Z";
/** Money and beta words a buyer must never read. */
const MONEY = /\$|price|quote|charg|refund|credit|beta|\bpaid\b|\bpay\b/i;

async function setup(): Promise<T> {
  runnerCalls.length = 0;
  const t = await testEnv();
  await t.grantBeta(BUYER);
  return t;
}

async function planned(t: T, body: Record<string, unknown> = {}) {
  const created = await t.api("POST", "/api/requests", { user: BUYER, body: { text: LANDING_TEXT } });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const id = created.body.request.id as string;
  const q = await t.api("POST", `/api/requests/${id}/plan`, { user: BUYER, body });
  assert.equal(q.status, 200, JSON.stringify(q.body));
  return id;
}

const job = async (t: T, id: string) => (await t.sql("SELECT * FROM jobs WHERE id = ?", id))[0];
const expire = (t: T, id: string) => t.sql("UPDATE jobs SET quote_expires_at = ? WHERE id = ?", PAST, id);

test("the cron sends a plan that timed out back to draft, keeps the buyer's choices and tells them", async () => {
  const t = await setup();
  const goals = "Mention our 14-day free trial.";
  const id = await planned(t, { faster: true, goals });
  const before = await job(t, id);
  assert.equal(before.price_cents, null);
  assert.equal(before.turnaround_hours, 12);
  await expire(t, id);

  assert.equal(await expireQuotes(t.env), 1);
  const after = await job(t, id);
  assert.equal(after.status, "draft");
  assert.equal(after.price_cents, null);
  assert.equal(after.quote_expires_at, null);
  assert.equal(after.turnaround_hours, null);
  assert.deepEqual(JSON.parse(after.quote), { goals, rush: true, expired: { expired_at: PAST } });
  const [event] = await t.sql("SELECT actor, actor_kind, data FROM events WHERE entity_id = ? AND type = 'job.draft'", id);
  assert.equal(event.actor_kind, "system");
  assert.deepEqual(JSON.parse(event.data), { from: "quoted", reason: "quote_expired", expired_at: PAST });

  const [n] = await t.sql("SELECT * FROM notifications WHERE user_id = ? AND kind = 'job.quote_expired'", BUYER);
  assert.equal(n.link, `https://agents.test/requests/${id}`);
  assert.equal(n.subject, "Your plan for Landing page copy: dog groomers timed out");
  assert.match(n.body_text, /within 7 days/);
  assert.match(n.body_text, /check the plan again/);
  assert.doesNotMatch(`${n.subject} ${n.body_text}`, MONEY);

  // The request page says so, and still has everything needed for a new plan.
  const view = await t.api("GET", `/api/requests/${id}`, { user: BUYER });
  const r = view.body.request;
  assert.equal(r.status, "draft");
  assert.equal(r.plan, null);
  assert.equal(r.ready, true);
  assert.equal(r.goals, goals);
  assert.deepEqual(r.expired_plan, { expired_at: PAST });
  assert.equal((await t.api("POST", `/api/requests/${id}/start`, { user: BUYER })).body.error.code, "quote_needed");

  // A fresh plan keeps the faster choice and the goals, clears the timed-out note, and can be started.
  const fresh = await t.api("POST", `/api/requests/${id}/plan`, { user: BUYER, body: { goals } });
  assert.equal(fresh.status, 200, JSON.stringify(fresh.body));
  assert.equal(fresh.body.request.status, "quoted");
  assert.equal(fresh.body.request.plan.faster, true);
  assert.equal(fresh.body.request.plan.turnaround_hours, 12);
  assert.equal(fresh.body.request.expired_plan, null);
  assert.equal((await t.api("POST", `/api/requests/${id}/start`, { user: BUYER })).status, 200);
  assert.equal(runnerCalls.length, 1);
});

test("only jobs whose plan timed out are touched, and a second run changes nothing", async () => {
  const t = await setup();
  const due = await planned(t);
  const fresh = await planned(t);
  const started = await planned(t);
  assert.equal((await t.api("POST", `/api/requests/${started}/start`, { user: BUYER })).status, 200);
  const draft = (await t.api("POST", "/api/requests", { user: BUYER, body: { text: LANDING_TEXT } })).body.request.id as string;
  const cancelled = await planned(t);
  await t.sql("UPDATE jobs SET status = 'cancelled' WHERE id = ?", cancelled);
  for (const id of [due, started, cancelled]) await expire(t, id);
  // A draft with a stale expiry (should never happen, but it must not be touched either).
  await t.sql("UPDATE jobs SET quote_expires_at = ? WHERE id = ?", PAST, draft);
  const snapshot = async () => Object.fromEntries(await Promise.all([fresh, started, draft, cancelled].map(async id => [id, await job(t, id)])));
  const was = await snapshot();

  assert.equal(await expireQuotes(t.env), 1);
  assert.equal((await job(t, due)).status, "draft");
  assert.deepEqual(await snapshot(), was);
  assert.equal(await expireQuotes(t.env), 0);
  assert.equal((await t.sql("SELECT 1 FROM notifications WHERE kind = 'job.quote_expired'")).length, 1);
  assert.equal((await t.sql("SELECT 1 FROM events WHERE type = 'job.draft'")).length, 1);
});

test("a fresh plan before the cron runs keeps the job ready", async () => {
  const t = await setup();
  const id = await planned(t);
  await expire(t, id);
  // The buyer checks the plan again; it is ready again and stays open another 7 days.
  await t.api("POST", `/api/requests/${id}/plan`, { user: BUYER, body: { faster: true } });
  assert.equal(await expireQuotes(t.env), 0);
  assert.equal((await job(t, id)).status, "quoted");
});

test("plans time out on the 15-minute cron", async () => {
  const t = await setup();
  const id = await planned(t);
  await expire(t, id);
  assert.equal(scheduled.length, 1);
  // The whole cron, as the Worker runs it. Other modules' tasks may log here because their neighbours are mocked.
  await t.scheduled();
  assert.equal((await job(t, id)).status, "draft");
});

test("the message says what happened and what to do, in plain words, with no money words", () => {
  const m = quoteExpiredMessage("Landing page copy");
  assert.equal(m.subject, "Your plan for Landing page copy timed out");
  assert.equal(m.text, "You did not start Landing page copy within 7 days, so we closed the plan. Open it to check the plan again and start it in one click. We kept your answers and your goals.");
  assert.doesNotMatch(`${m.subject} ${m.text}`, MONEY);
  assert.match(quoteExpiredMessage("  ").subject, /your job/);
});
