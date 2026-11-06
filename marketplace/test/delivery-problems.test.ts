// Delivery module: ops settles problem reports at /ops/problems (GET /api/ops/problems, POST /api/ops/problems/:id/resolve).
// Outcomes: redo the work, keep it, cancel, or close the report only. Hiring is free, so there is no money outcome.
import { test } from "node:test";
import assert from "node:assert/strict";
import { deliveredJob, disputedJob, jobRow, mockDeliveryNeighbours } from "./delivery-kit.ts";

const calls = mockDeliveryNeighbours();
const { testEnv } = await import("./helpers.ts");
const { problemResolvedMessage, problemRerunFeedback } = await import("../src/modules/delivery/problems.ts");

type T = Awaited<ReturnType<typeof testEnv>>;
const OPS = "user_ops";

async function setup(): Promise<T> {
  calls.runs.length = 0;
  calls.ops.length = 0;
  const t = await testEnv();
  await t.makeOps(OPS);
  return t;
}

const resolve = (t: T, reportId: string, body: Record<string, unknown>, user = OPS) => t.api("POST", `/api/ops/problems/${reportId}/resolve`, { user, body });
const report = async (t: T, id: string) => (await t.sql("SELECT * FROM problem_reports WHERE id = ?", id))[0];
const buyerNotices = (t: T) => t.sql("SELECT * FROM notifications WHERE user_id = 'user_buyer' AND kind = 'problem.resolved' ORDER BY created_at, rowid");

test("only ops can list and settle problem reports", async () => {
  const t = await setup();
  const { reportId } = await disputedJob(t);
  for (const [method, path] of [["GET", "/api/ops/problems"], ["GET", `/api/ops/problems/${reportId}`], ["POST", `/api/ops/problems/${reportId}/resolve`]] as const) {
    assert.equal((await t.api(method, path, { body: method === "POST" ? { outcome: "accept", note: "x" } : undefined })).status, 401, path);
    assert.equal((await t.api(method, path, { user: "user_buyer", body: method === "POST" ? { outcome: "accept", note: "x" } : undefined })).status, 403, path);
  }
  assert.equal((await report(t, reportId)).status, "open");
});

test("open reports list oldest first with the job, buyer, agent and draft; closed ones move to the closed list", async () => {
  const t = await setup();
  const first = await disputedJob(t, { title: "First page" });
  const second = await disputedJob(t, { title: "Second page" });
  await t.sql("UPDATE problem_reports SET created_at = '2026-01-01T00:00:00.000Z' WHERE id = ?", first.reportId);
  const res = await t.api("GET", "/api/ops/problems", { user: OPS });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.deepEqual(res.body.reports.map((r: any) => r.id), [first.reportId, second.reportId]);
  assert.deepEqual(res.body.counts, { open: 2, resolved: 0 });
  const r = res.body.reports[0];
  assert.equal(r.reasons, "It quotes reviews we never had.");
  assert.equal(r.job.title, "First page");
  assert.equal(r.job.status, "disputed");
  assert.equal("priceCents" in r.job, false, "ops reports show no price");
  assert.equal("creditCents" in r, false);
  assert.equal(r.buyer.email, "user_buyer@example.com");
  assert.equal(r.persona.name, "Nova");
  assert.deepEqual(r.draft, { id: first.draftId, version: 1 });
  assert.deepEqual(r.outcomes, ["rerun", "accept", "cancel"]);

  await resolve(t, first.reportId, { outcome: "accept", note: "The reviews were in your brief, so we kept them." });
  const open = await t.api("GET", "/api/ops/problems?status=open", { user: OPS });
  assert.deepEqual(open.body.reports.map((x: any) => x.id), [second.reportId]);
  const closed = await t.api("GET", "/api/ops/problems?status=resolved", { user: OPS });
  assert.deepEqual(closed.body.reports.map((x: any) => x.id), [first.reportId]);
  assert.equal(closed.body.reports[0].outcome, "accept");
  assert.deepEqual(closed.body.reports[0].outcomes, []);
  assert.equal(closed.body.reports[0].resolvedBy.id, OPS);
  assert.deepEqual(closed.body.counts, { open: 1, resolved: 1 });
  assert.equal((await t.api("GET", "/api/ops/problems?status=all", { user: OPS })).body.reports.length, 2);
  assert.equal((await t.api("GET", "/api/ops/problems?status=nope", { user: OPS })).status, 400);
  assert.equal((await t.api("GET", "/api/ops/problems/rpt_nope", { user: OPS })).status, 404);
});

test("redo: the agent reruns with the buyer's report and the note, and the buyer is told", async () => {
  const t = await setup();
  const { jobId, reportId } = await disputedJob(t);
  const note = "We checked: the reviews were made up. Nova will write it again without them.";
  const res = await resolve(t, reportId, { outcome: "rerun", note });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.runId, "run_mocked_1");
  assert.equal(calls.runs.length, 1);
  assert.equal(calls.runs[0].kind, "rerun");
  assert.equal(calls.runs[0].actorKind, "ops");
  assert.equal(calls.runs[0].jobId, jobId);
  assert.equal(calls.runs[0].feedback, problemRerunFeedback("It quotes reviews we never had.", note));
  assert.match(calls.runs[0].feedback, /It quotes reviews we never had\./);
  assert.match(calls.runs[0].feedback, /made up/);
  assert.equal((await jobRow(t, jobId)).status, "running");

  const r = await report(t, reportId);
  assert.equal(r.status, "resolved");
  assert.equal(r.outcome, "rerun");
  assert.equal(r.resolution_note, note);
  assert.equal(r.resolved_by, OPS);
  assert.ok(r.resolved_at);
  const [event] = await t.sql("SELECT actor, actor_kind, data FROM events WHERE entity = 'job' AND entity_id = ? AND type = 'problem_report.resolved'", jobId);
  assert.equal(event.actor, OPS);
  assert.equal(event.actor_kind, "ops");
  assert.deepEqual({ ...JSON.parse(event.data), note_id: undefined }, { report_id: reportId, outcome: "rerun", from: "disputed", run_id: "run_mocked_1", note_id: undefined });
  const [n] = await t.sql("SELECT body, created_by FROM notes WHERE entity = 'job' AND entity_id = ?", jobId);
  assert.match(n.body, /^Problem report closed \(we are redoing the work\): We checked/);

  const [msg] = await buyerNotices(t);
  assert.equal(msg.link, `https://agents.test/jobs/${jobId}`);
  assert.equal(msg.subject, "We looked into the problem with Landing page copy");
  assert.match(msg.body_text, /Nova is doing the work again/);
  assert.match(msg.body_text, /Note from our team: We checked/);

  const view = await t.api("GET", `/api/jobs/${jobId}`, { user: "user_buyer" });
  assert.equal(view.body.problems.length, 1);
  assert.equal(view.body.problems[0].status, "resolved");
  assert.equal(view.body.problems[0].outcomeLabel, "We are redoing the work");
  assert.equal(view.body.problems[0].note, note);

  const twice = await resolve(t, reportId, { outcome: "accept", note: "Again" });
  assert.equal(twice.status, 409);
  assert.equal(twice.body.error.code, "already_resolved");
});

test("keep: the job is marked as done and will not be auto-accepted", async () => {
  const t = await setup();
  const { jobId, reportId } = await disputedJob(t);
  const res = await resolve(t, reportId, { outcome: "accept", note: "The facts match your brief, so we kept the draft." });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const job = await jobRow(t, jobId);
  assert.equal(job.status, "accepted");
  assert.ok(job.accepted_at);
  assert.equal(job.auto_accept_at, null);
  assert.equal(calls.runs.length, 0);
  const [e] = await t.sql("SELECT actor_kind, data FROM events WHERE entity_id = ? AND type = 'job.accepted'", jobId);
  assert.equal(e.actor_kind, "ops");
  assert.equal(JSON.parse(e.data).report_id, reportId);
  assert.match((await buyerNotices(t))[0].body_text, /marked the job as done/);
});

test("credit is no longer an outcome; an old credit report still reads as closed, with no amount", async () => {
  const t = await setup();
  const { jobId, reportId } = await disputedJob(t);
  const res = await resolve(t, reportId, { outcome: "credit", note: "Sorry about this one." });
  assert.equal(res.status, 400);
  assert.equal((await jobRow(t, jobId)).status, "disputed");
  assert.equal((await report(t, reportId)).status, "open");

  // A report closed with a credit before hiring was free: the buyer sees "closed" and no money words.
  await t.sql("UPDATE problem_reports SET status = 'resolved', outcome = 'credit', credit_cents = 14900, resolution_note = 'Old note.', resolved_at = ?, resolved_by = ? WHERE id = ?", new Date().toISOString(), OPS, reportId);
  const view = await t.api("GET", `/api/jobs/${jobId}`, { user: "user_buyer" });
  assert.equal(view.body.problems[0].outcomeLabel, "We closed the job");
  assert.equal("creditCents" in view.body.problems[0], false);
  assert.doesNotMatch(JSON.stringify(view.body.problems), /credit|\$|price/i);
  const listed = await t.api("GET", "/api/ops/problems?status=resolved", { user: OPS });
  assert.equal(listed.body.reports[0].outcome, "credit");
});

test("cancel closes the job with no credit; a disputed job needs a real decision", async () => {
  const t = await setup();
  const { jobId, reportId } = await disputedJob(t);
  const closeOnly = await resolve(t, reportId, { outcome: "close", note: "Closing." });
  assert.equal(closeOnly.status, 409);
  assert.equal(closeOnly.body.error.code, "decision_needed");
  assert.equal((await resolve(t, reportId, { outcome: "refund", note: "x" })).status, 400);
  assert.equal((await resolve(t, reportId, { outcome: "cancel", note: "  " })).status, 400);
  assert.equal((await resolve(t, reportId, { outcome: "cancel" })).status, 400);
  assert.equal((await report(t, reportId)).status, "open");

  const res = await resolve(t, reportId, { outcome: "cancel", note: "This was the wrong job for this agent." });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal((await jobRow(t, jobId)).status, "cancelled");
  assert.equal((await report(t, reportId)).credit_cents, null);
  const [msg] = await buyerNotices(t);
  assert.match(msg.body_text, /We cancelled the job\. You can start a new job any time\./);
  assert.doesNotMatch(msg.body_text, /charg|credit|refund|price|\$/i);
});

test("a report whose job was settled another way can only be closed, and the job stays as it is", async () => {
  const t = await setup();
  const { jobId, reportId } = await disputedJob(t);
  // Ops settled the job from the job page (resolve: accept) without closing the report.
  await t.sql("UPDATE jobs SET status = 'accepted', accepted_at = ? WHERE id = ?", new Date().toISOString(), jobId);
  const listed = await t.api("GET", "/api/ops/problems", { user: OPS });
  assert.deepEqual(listed.body.reports[0].outcomes, ["close"]);
  const rerun = await resolve(t, reportId, { outcome: "rerun", note: "x" });
  assert.equal(rerun.status, 409);
  assert.equal(rerun.body.error.code, "job_already_settled");
  const res = await resolve(t, reportId, { outcome: "close", note: "We settled this on the job page." });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal((await jobRow(t, jobId)).status, "accepted");
  assert.equal(calls.runs.length, 0);
  assert.equal((await report(t, reportId)).outcome, "close");
  assert.match((await buyerNotices(t))[0].body_text, /We closed your report\./);
});

test("the buyer sees an open report on the job page until it is settled", async () => {
  const t = await setup();
  const { jobId } = await disputedJob(t);
  const view = await t.api("GET", `/api/jobs/${jobId}`, { user: "user_buyer" });
  assert.equal(view.body.problems.length, 1);
  assert.equal(view.body.problems[0].status, "open");
  assert.equal(view.body.problems[0].outcomeLabel, null);
  const other = await deliveredJob(t);
  assert.deepEqual((await t.api("GET", `/api/jobs/${other.jobId}`, { user: "user_buyer" })).body.problems, []);
});

test("buyer messages are plain, say what happens next, and never mention money", () => {
  const rerun = problemResolvedMessage({ outcome: "rerun", jobTitle: "X", agentName: null, note: "n" });
  assert.match(rerun.text, /^Your agent is doing the work again/);
  const all = (["rerun", "accept", "cancel", "close"] as const).map(outcome => problemResolvedMessage({ outcome, jobTitle: "Landing page copy", agentName: "Nova", note: "Sorry." }));
  for (const m of all) {
    assert.match(m.text, /useaiblocks\.com\/support/);
    assert.doesNotMatch(`${m.subject} ${m.text}`, /\$|price|charg|credit|refund|beta|quote/i);
  }
});
