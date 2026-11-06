import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { transitionJob, TRANSITIONS } from "../src/core/jobs.ts";
import { callModel, registerFake } from "../src/core/models.ts";
import { JOB_STATUSES } from "../src/core/types.ts";
import { validateJobType } from "../src/modules/catalogue/schema.ts";
import { FIXTURE_JOB_TYPES } from "./fixtures.ts";

test("health and config are public", async () => {
  const t = await testEnv();
  assert.equal((await t.api("GET", "/api/health")).status, 200);
  const cfg = await t.api("GET", "/api/config");
  assert.equal(cfg.body.inviteOnly, true);
  assert.equal((await (await testEnv({ INVITE_ONLY: "false" })).api("GET", "/api/config")).body.inviteOnly, false);
});

test("unknown API paths return JSON 404, wrong methods 405", async () => {
  const t = await testEnv();
  assert.equal((await t.api("GET", "/api/nope")).status, 404);
  assert.equal((await t.api("POST", "/api/health")).status, 405);
});

test("first sign-in creates the user, a personal org and an event", async () => {
  const t = await testEnv();
  assert.equal((await t.api("GET", "/api/me")).status, 401);
  const me = await t.api("GET", "/api/me", { user: "user_a", email: "a@example.com" });
  assert.equal(me.status, 200);
  assert.equal(me.body.betaAccess, false);
  assert.ok(me.body.orgId.startsWith("org_"));
  const again = await t.api("GET", "/api/me", { user: "user_a" });
  assert.equal(again.body.orgId, me.body.orgId);
  const events = await t.sql("SELECT type FROM events WHERE entity_id = 'user_a'");
  assert.deepEqual(events.map(e => e.type), ["user.signed_up"]);
});

test("test-user header is ignored outside the test environment", async () => {
  const t = await testEnv({ APP_ENV: "production" });
  assert.equal((await t.api("GET", "/api/me", { user: "user_a" })).status, 401);
});

test("beta codes grant access once per use", async () => {
  const t = await testEnv();
  await t.sql("INSERT INTO users (id, email, email_verified, beta_access, created_at, last_seen_at) VALUES ('ops', NULL, 0, 0, 'x', 'x')");
  await t.sql("INSERT INTO beta_codes (code, max_uses, created_by, created_at) VALUES ('AB-TEST-0001', 1, 'ops', 'x')");
  const ok = await t.api("POST", "/api/beta/redeem", { user: "user_b", body: { code: "ab-test-0001" } });
  assert.equal(ok.status, 200);
  assert.equal((await t.api("GET", "/api/me", { user: "user_b" })).body.betaAccess, true);
  const used = await t.api("POST", "/api/beta/redeem", { user: "user_c", body: { code: "AB-TEST-0001" } });
  assert.equal(used.status, 400);
});

test("job transitions follow the state machine and log events", async () => {
  const t = await testEnv();
  await t.api("GET", "/api/me", { user: "user_a" });
  const [{ org_id }] = await t.sql("SELECT org_id FROM org_members WHERE user_id = 'user_a'");
  await t.sql("INSERT INTO jobs (id, org_id, created_by, status, created_at, updated_at) VALUES ('job_1', ?, 'user_a', 'draft', 'x', 'x')", org_id);
  const quoted = await transitionJob(t.env, { jobId: "job_1", to: "quoted", actor: "user_a", actorKind: "user", set: { price_cents: 14900 } });
  assert.equal(quoted.status, "quoted");
  assert.equal(quoted.price_cents, 14900);
  await assert.rejects(transitionJob(t.env, { jobId: "job_1", to: "accepted", actor: "user_a", actorKind: "user" }), /cannot move/);
  const events = await t.sql("SELECT type, data FROM events WHERE entity = 'job' AND entity_id = 'job_1'");
  assert.equal(events.length, 1);
  assert.equal(JSON.parse(events[0].data).from, "draft");
  for (const s of JOB_STATUSES) assert.ok(Array.isArray(TRANSITIONS[s]), s);
});

test("events and frozen rubrics cannot be changed", async () => {
  const t = await testEnv();
  await t.api("GET", "/api/me", { user: "user_a" });
  await assert.rejects(t.sql("UPDATE events SET type = 'x'"), /append_only/);
  const [{ org_id }] = await t.sql("SELECT org_id FROM org_members WHERE user_id = 'user_a'");
  await t.sql("INSERT INTO jobs (id, org_id, created_by, status, created_at, updated_at) VALUES ('job_2', ?, 'user_a', 'quoted', 'x', 'x')", org_id);
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES ('job_2', '[]', 'x', 'x', 'x')");
  await assert.rejects(t.sql("UPDATE rubrics SET criteria = '[1]' WHERE job_id = 'job_2'"), /rubric_frozen/);
});

test("fake models answer registered purposes and log every call", async () => {
  const t = await testEnv();
  registerFake("test.*", req => ({ data: { echo: req.purpose } }));
  const res = await callModel(t.env, { purpose: "test.echo", tier: "small", system: "s", prompt: "p", json: true });
  assert.deepEqual(res.data, { echo: "test.echo" });
  const calls = await t.sql("SELECT purpose, ok FROM model_calls");
  assert.deepEqual(calls, [{ purpose: "test.echo", ok: 1 }]);
});

test("catalogue routes serve job types without hidden briefs or baseline prompts", async () => {
  const t = await testEnv();
  const list = await t.api("GET", "/api/catalogue");
  assert.equal(list.body.job_types.length, FIXTURE_JOB_TYPES.length);
  const one = await t.api("GET", "/api/catalogue/landing-page-copy");
  assert.equal(one.status, 200);
  assert.equal(one.body.job_type.baseline_prompt, undefined);
  assert.ok(one.body.job_type.sample_briefs.every((b: any) => b.visibility === "public"));
  assert.equal((await t.api("GET", "/api/catalogue/nope")).status, 404);
});

test("fixture job types pass validation", () => {
  for (const jt of FIXTURE_JOB_TYPES) {
    const r = validateJobType(jt);
    assert.ok(r.ok, `${jt.id}: ${!r.ok ? r.errors.join("; ") : ""}`);
  }
});
