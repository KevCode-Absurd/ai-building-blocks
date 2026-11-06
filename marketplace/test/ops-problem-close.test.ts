// Ops settles a disputed job from the ops job page (POST /api/ops/jobs/:id/resolve): the buyer's problem report closes too.
// Not in delivery-problems.test.ts, which mocks the ops module out.
import { test } from "node:test";
import assert from "node:assert/strict";
import { disputedJob } from "./delivery-kit.ts";

const { testEnv } = await import("./helpers.ts");
const OPS = "user_ops";

test("settling a disputed job from the ops job page closes its problem report too", async () => {
  const t = await testEnv();
  await t.makeOps(OPS);
  const { jobId, reportId } = await disputedJob(t);
  const res = await t.api("POST", `/api/ops/jobs/${jobId}/resolve`, { user: OPS, body: { outcome: "accept", note: "The facts match the brief, so we kept it." } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const [r] = await t.sql("SELECT * FROM problem_reports WHERE id = ?", reportId);
  assert.equal(r.status, "resolved");
  assert.equal(r.outcome, "accept");
  assert.equal(r.resolution_note, "The facts match the brief, so we kept it.");
  assert.equal(r.resolved_by, OPS);
  const events = await t.sql("SELECT data FROM events WHERE entity_id = ? AND type = 'problem_report.resolved'", jobId);
  assert.equal(events.length, 1);
  assert.equal(JSON.parse(events[0].data).via, "ops_resolve");
  // Ops told the buyer on the job page; no second "problem resolved" message goes out.
  assert.equal((await t.sql("SELECT * FROM notifications WHERE user_id = 'user_buyer' AND kind = 'problem.resolved'")).length, 0);
  const listed = await t.api("GET", "/api/ops/problems", { user: OPS });
  assert.equal(listed.body.counts.open, 0);
});
