// HOSTED_JOBS off (every real environment): agents run in people's own AI, so nobody but the AI Blocks team can start
// a job that runs here on our model keys. The MCP side is in mcp-tools.test.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { hostedJobs } from "../src/core/access.ts";
import type { Env } from "../src/env.ts";

const OFF = { HOSTED_JOBS: "off", INVITE_ONLY: "false" } as const;
const TEXT = "We need a landing page for dog groomers. Our scheduling app costs $29 a month.\nVisitors should Book a call.";

test("hosted jobs are on only when HOSTED_JOBS is exactly \"on\"", () => {
  assert.equal(hostedJobs({ HOSTED_JOBS: "on" } as Env), true);
  assert.equal(hostedJobs({ HOSTED_JOBS: "off" } as Env), false);
  assert.equal(hostedJobs({} as Env), false, "unset is off");
});

test("with hosted jobs off, the config and the account say so; the team keeps hosted jobs for testing", async () => {
  const t = await testEnv(OFF);
  const config = await t.api("GET", "/api/config");
  assert.equal(config.body.hostedJobs, false);
  const me = await t.api("GET", "/api/me", { user: "user_buyer" });
  assert.equal(me.body.hostedJobs, false);
  await t.makeOps("user_ops");
  const ops = await t.api("GET", "/api/me", { user: "user_ops" });
  assert.equal(ops.body.hostedJobs, true);

  const on = await testEnv({ INVITE_ONLY: "false" });
  assert.equal((await on.api("GET", "/api/config")).body.hostedJobs, true);
  assert.equal((await on.api("GET", "/api/me", { user: "user_buyer" })).body.hostedJobs, true);
});

test("with hosted jobs off, nobody outside the team can start a job or ask for changes", async () => {
  const t = await testEnv(OFF);
  const start = await t.api("POST", "/api/requests", { user: "user_buyer", body: { text: TEXT } });
  assert.equal(start.status, 403);
  assert.equal(start.body.error.code, "runs_in_your_ai");
  assert.match(start.body.error.message, /Our agents work in your own AI, so we do not run jobs on this site\. .*https:\/\/agents\.test\/connect/);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM jobs"))[0].n, 0);

  // A job from before the switch: it can still be read, but not sent back for a rerun on our keys.
  const me = await t.api("GET", "/api/me", { user: "user_buyer" });
  const now = new Date().toISOString();
  await t.sql("INSERT INTO jobs (id, org_id, created_by, source, status, job_type_id, title, revisions_used, revisions_allowed, created_at, updated_at) VALUES ('job_before0000000001', ?, 'user_buyer', 'web', 'delivered', 'landing-page-copy', 'Old job', 0, 2, ?, ?)", me.body.orgId, now, now);
  assert.equal((await t.api("GET", "/api/jobs/job_before0000000001", { user: "user_buyer" })).status, 200);
  const revise = await t.api("POST", "/api/jobs/job_before0000000001/revise", { user: "user_buyer", body: { reasons: ["Shorter intro"] } });
  assert.equal(revise.status, 403);
  assert.equal(revise.body.error.code, "runs_in_your_ai");

  await t.makeOps("user_ops");
  const ops = await t.api("POST", "/api/requests", { user: "user_ops", body: { text: TEXT } });
  assert.notEqual(ops.status, 403, JSON.stringify(ops.body));
  assert.ok(ops.status < 300, JSON.stringify(ops.body));
});
