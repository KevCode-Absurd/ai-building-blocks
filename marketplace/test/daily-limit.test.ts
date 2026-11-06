// The optional daily job limit: off by default; with DAILY_JOBS_PER_USER set, one person can start that many jobs in any 24 hours.
// A job counts when it is started (job.confirmed). New requests and starts are refused over the limit with a plain
// message that says when the next start is possible. Ops are exempt. The runner and ops services are mocked, as in
// intake.test.ts.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function stubExports(rel: string): Record<string, unknown> {
  const src = readFileSync(new URL(rel, import.meta.url), "utf8");
  const out: Record<string, unknown> = {};
  for (const m of src.matchAll(/export\s+(?:async\s+)?(function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)\s*(=\s*(.))?/g)) {
    const [, kind, name, , start] = m;
    if (kind === "function" || kind === "function*" || kind === "class" || start === "(" || start === "a") out[name] = async () => { throw new Error(`${name} is mocked out in the daily limit tests`); };
    else out[name] = start === "[" ? [] : start === "{" ? {} : start === "\"" || start === "'" || start === "`" ? "" : /\d/.test(start ?? "") ? 0 : null;
  }
  return out;
}

const runnerCalls: { jobId: string }[] = [];
mock.module(new URL("../src/modules/runner/service.ts", import.meta.url).href, {
  exports: { ...stubExports("../src/modules/runner/service.ts"), startJobRun: async (_env: unknown, input: { jobId: string }) => { runnerCalls.push(input); return { runId: "run_test" }; } },
});
mock.module(new URL("../src/modules/ops/service.ts", import.meta.url).href, {
  exports: { ...stubExports("../src/modules/ops/service.ts"), notifyOps: async () => {} },
});

const { testEnv } = await import("./helpers.ts");
const { dailyJobLimit, dailyJobs, dailyLimitMessage, waitWords, utcTime, DEFAULT_DAILY_JOBS } = await import("../src/modules/intake/limits.ts");
type T = Awaited<ReturnType<typeof testEnv>>;

const BUYER = "user_a";
const TEXT = "We need a landing page for dog groomers. Our scheduling app costs $29 a month.\nVisitors should Book a call.";
const WHEN = /You can start the next one in about \d+ (hour|hours|minute|minutes), at \d{1,2}:\d{2} (AM|PM) UTC on [A-Z][a-z]{2} \d{1,2}\./;

/** A fresh app with open hiring and the given limit; null leaves DAILY_JOBS_PER_USER unset. */
async function setup(limit: string | null): Promise<T> {
  runnerCalls.length = 0;
  return testEnv(limit === null ? { INVITE_ONLY: "false" } : { INVITE_ONLY: "false", DAILY_JOBS_PER_USER: limit });
}

/** A request with its plan ready, not started yet. */
async function planned(t: T, user = BUYER): Promise<string> {
  const created = await t.api("POST", "/api/requests", { user, body: { text: TEXT } });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const id = created.body.request.id as string;
  const plan = await t.api("POST", `/api/requests/${id}/plan`, { user, body: {} });
  assert.equal(plan.status, 200, JSON.stringify(plan.body));
  return id;
}

const startJob = (t: T, id: string, user = BUYER) => t.api("POST", `/api/requests/${id}/start`, { user, body: {} });
const status = async (t: T, id: string) => (await t.sql("SELECT status FROM jobs WHERE id = ?", id))[0].status;

test("two starts are fine; the third start and a new request are refused with when to come back", async () => {
  const t = await setup("2");
  const [a, b, c] = [await planned(t), await planned(t), await planned(t)];
  assert.equal((await startJob(t, a)).status, 200);
  assert.equal((await startJob(t, b)).status, 200);

  const third = await startJob(t, c);
  assert.equal(third.status, 429);
  assert.equal(third.body.error.code, "daily_limit");
  assert.match(third.body.error.message, /^You can start 2 jobs a day, and you have started 2 in the last 24 hours\./);
  assert.match(third.body.error.message, WHEN);
  assert.match(third.body.error.message, /in about 24 hours/);
  assert.match(third.body.error.message, /Your request is saved, so you can start it then\.$/);
  assert.equal(await status(t, c), "quoted", "the plan stays as it was");
  assert.equal(runnerCalls.length, 2);

  const request = await t.api("POST", "/api/requests", { user: BUYER, body: { text: TEXT } });
  assert.equal(request.status, 429);
  assert.equal(request.body.error.code, "daily_limit");
  assert.match(request.body.error.message, WHEN);
  assert.doesNotMatch(request.body.error.message, /saved/, "a refused request was not saved");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM jobs")).at(0).n, 3, "no draft was made");

  // Clicking start again on a job that already started is never blocked.
  const again = await startJob(t, a);
  assert.equal(again.status, 200);
  assert.equal(again.body.job.status, "confirmed");
});

test("once the earliest start is more than 24 hours old, the next start is allowed", async () => {
  const t = await setup("2");
  const [a, b, c] = [await planned(t), await planned(t), await planned(t)];
  await startJob(t, a);
  await startJob(t, b);
  assert.equal((await startJob(t, c)).status, 429);
  // Events are append-only; this test moves one back in time on purpose.
  t.db.db.exec("DROP TRIGGER events_no_update");
  const old = new Date(Date.now() - 25 * 3600_000).toISOString();
  await t.sql("UPDATE events SET at = ? WHERE entity_id = ? AND type = 'job.confirmed'", old, a);
  const later = await startJob(t, c);
  assert.equal(later.status, 200, JSON.stringify(later.body));
  assert.equal(await status(t, c), "confirmed");
});

test("ops are exempt, and other people have their own limit", async () => {
  const t = await setup("1");
  await t.makeOps("user_ops");
  for (let i = 0; i < 3; i++) {
    const id = await planned(t, "user_ops");
    assert.equal((await startJob(t, id, "user_ops")).status, 200, `ops start ${i + 1}`);
  }
  const mine = await planned(t);
  const next = await planned(t);
  assert.equal((await startJob(t, mine)).status, 200);
  assert.equal((await startJob(t, next)).status, 429);
  const theirs = await planned(t, "user_b");
  assert.equal((await startJob(t, theirs, "user_b")).status, 200, "user_b is not affected by user_a's starts");
  // Ops starting a buyer's job for them is not blocked either.
  assert.equal((await startJob(t, next, "user_ops")).status, 200);
});

test("the limit counts starts, not drafts or plans", async () => {
  const t = await setup("2");
  for (let i = 0; i < 4; i++) await planned(t);
  const d = await dailyJobs(t.env, BUYER);
  assert.deepEqual(d, { limit: 2, used: 0, left: 2, next_at: null });
  const id = await planned(t);
  assert.equal((await startJob(t, id)).status, 200);
  assert.equal((await dailyJobs(t.env, BUYER)).used, 1);
});

test("there is no limit when the setting is missing, 0 or not a whole number above 0", async () => {
  assert.equal(DEFAULT_DAILY_JOBS, 0);
  for (const v of [undefined, "", "abc", "0", "-2", "2.5"]) assert.equal(dailyJobLimit({ DAILY_JOBS_PER_USER: v } as any), 0, String(v));
  assert.equal(dailyJobLimit({ DAILY_JOBS_PER_USER: "3" } as any), 3);
  const t = await setup(null);
  const ids: string[] = [];
  for (let i = 0; i < 7; i++) ids.push(await planned(t));
  for (let i = 0; i < 7; i++) assert.equal((await startJob(t, ids[i])).status, 200, `start ${i + 1}`);
  assert.equal((await t.api("POST", "/api/requests", { user: BUYER, body: { text: TEXT } })).status, 201, "new requests are never refused");
});

test("the window and the wording", async () => {
  const t = await setup("2");
  const [a, b] = [await planned(t), await planned(t)];
  await startJob(t, a);
  await startJob(t, b);
  const now = new Date().toISOString();
  const d = await dailyJobs(t.env, BUYER, now);
  assert.equal(d.used, 2);
  assert.equal(d.left, 0);
  const [first] = await t.sql("SELECT at FROM events WHERE entity_id = ? AND type = 'job.confirmed'", a);
  assert.equal(d.next_at, new Date(Date.parse(first.at) + 24 * 3600_000).toISOString(), "the earliest start drops out 24 hours after it happened");
  // A day later, nothing counts.
  assert.equal((await dailyJobs(t.env, BUYER, new Date(Date.now() + 25 * 3600_000).toISOString())).used, 0);

  assert.equal(waitWords("2026-11-06T10:00:00.000Z", "2026-11-06T10:00:30.000Z"), "in about 1 minute");
  assert.equal(waitWords("2026-11-06T10:00:00.000Z", "2026-11-06T10:40:00.000Z"), "in about 40 minutes");
  assert.equal(waitWords("2026-11-06T10:00:00.000Z", "2026-11-06T11:20:00.000Z"), "in about 1 hour");
  assert.equal(waitWords("2026-11-06T10:00:00.000Z", "2026-11-07T09:50:00.000Z"), "in about 24 hours");
  assert.equal(utcTime("2026-11-07T14:05:00.000Z"), "2:05 PM UTC on Nov 7");
  const message = dailyLimitMessage({ limit: 1, used: 1, left: 0, next_at: "2026-11-07T14:05:00.000Z" }, "2026-11-07T11:05:00.000Z", { saved: true });
  assert.equal(message, "You can start 1 job a day, and you have started 1 in the last 24 hours. You can start the next one in about 3 hours, at 2:05 PM UTC on Nov 7. Your request is saved, so you can start it then.");
  assert.doesNotMatch(message, /\$|price|quote|charg|beta|pay/i);
});
