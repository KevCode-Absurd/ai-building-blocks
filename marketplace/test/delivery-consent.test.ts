// Delivery module: consent before a buyer's edits are used to improve an agent.
// Edits are private by default; the buyer opts in per decision (accept or revise), can change it later, and can set an
// org-wide choice. Every reuse path (today: the expert dashboard) goes through consent.learnableDecisionIds.
import { test } from "node:test";
import assert from "node:assert/strict";
import { DRAFT, EDITED, deliveredJob, mockDeliveryNeighbours } from "./delivery-kit.ts";

mockDeliveryNeighbours();
const { testEnv } = await import("./helpers.ts");
const { learnableDecisionIds } = await import("../src/modules/delivery/consent.ts");
const { expertDashboard } = await import("../src/modules/experts/service.ts");

type T = Awaited<ReturnType<typeof testEnv>>;

const decisionOf = async (t: T, jobId: string) => (await t.sql("SELECT * FROM decisions WHERE job_id = ? ORDER BY created_at, rowid", jobId)).at(-1);
const consentOf = async (t: T, decisionId: string) => (await t.sql("SELECT * FROM decision_consents WHERE decision_id = ?", decisionId))[0];

test("edits are private by default: accepting with edits records a no for that decision", async () => {
  const t = await testEnv();
  const { jobId } = await deliveredJob(t);
  const res = await t.api("POST", `/api/jobs/${jobId}/accept`, { user: "user_buyer", body: { rating: 4, editedContent: EDITED } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const d = await decisionOf(t, jobId);
  assert.ok(d.edits, "the edits are still kept for this job");
  const c = await consentOf(t, d.id);
  assert.equal(c.granted, 0);
  assert.equal(c.scope, "learn_from_edits");
  assert.equal(c.org_id, "org_user_buyer");
  assert.equal((await learnableDecisionIds(t.env, [d.id])).size, 0);
  assert.equal(res.body.decisions[0].shareEdits, false);
  assert.equal(res.body.shareEditsDefault, false);
  const [event] = await t.sql("SELECT data FROM events WHERE entity_id = ? AND type = 'job.accepted'", jobId);
  assert.equal(JSON.parse(event.data).share_edits, false);

  // No edits: no consent row, and the view has nothing to share.
  const plain = await deliveredJob(t);
  const res2 = await t.api("POST", `/api/jobs/${plain.jobId}/accept`, { user: "user_buyer", body: { rating: 5, editedContent: DRAFT, shareEdits: true } });
  const d2 = await decisionOf(t, plain.jobId);
  assert.equal(d2.edits, null);
  assert.equal(await consentOf(t, d2.id), undefined);
  assert.equal(res2.body.decisions[0].shareEdits, null);
});

test("the buyer can opt in when accepting or asking for changes, and change it later on the job page", async () => {
  const t = await testEnv();
  const a = await deliveredJob(t);
  const accepted = await t.api("POST", `/api/jobs/${a.jobId}/accept`, { user: "user_buyer", body: { rating: 5, editedContent: EDITED, shareEdits: true } });
  assert.equal(accepted.status, 200, JSON.stringify(accepted.body));
  const d = await decisionOf(t, a.jobId);
  assert.equal((await consentOf(t, d.id)).granted, 1);
  assert.deepEqual([...await learnableDecisionIds(t.env, [d.id])], [d.id]);
  assert.equal(accepted.body.decisions[0].shareEdits, true);

  // Change of mind: stop sharing. The edits stay on the job; they just are not used beyond it.
  const off = await t.api("POST", `/api/jobs/${a.jobId}/decisions/${d.id}/share-edits`, { user: "user_buyer", body: { share: false } });
  assert.equal(off.status, 200, JSON.stringify(off.body));
  assert.equal(off.body.decisions[0].shareEdits, false);
  assert.equal((await consentOf(t, d.id)).granted, 0);
  assert.equal((await learnableDecisionIds(t.env, [d.id])).size, 0);
  const events = await t.sql("SELECT actor, data FROM events WHERE entity = 'decision' AND entity_id = ? AND type = 'consent.learn_from_edits'", d.id);
  assert.equal(events.length, 1);
  assert.equal(events[0].actor, "user_buyer");
  assert.equal(JSON.parse(events[0].data).granted, false);
  assert.ok((await decisionOf(t, a.jobId)).edits);

  // Asking for changes with edits and a yes.
  const b = await deliveredJob(t);
  const revised = await t.api("POST", `/api/jobs/${b.jobId}/revise`, { user: "user_buyer", body: { reasons: "Shorter, please.", editedContent: EDITED, shareEdits: true } });
  assert.equal(revised.status, 200, JSON.stringify(revised.body));
  const rd = await decisionOf(t, b.jobId);
  assert.equal(rd.kind, "revise");
  assert.equal((await consentOf(t, rd.id)).granted, 1);

  // Bad input, decisions without edits, and other people's jobs.
  assert.equal((await t.api("POST", `/api/jobs/${a.jobId}/decisions/${d.id}/share-edits`, { user: "user_buyer", body: { share: "yes" } })).status, 400);
  assert.equal((await t.api("POST", `/api/jobs/${a.jobId}/accept`, { user: "user_buyer", body: { rating: 5, shareEdits: "yes" } })).status, 400);
  const c = await deliveredJob(t);
  await t.api("POST", `/api/jobs/${c.jobId}/accept`, { user: "user_buyer", body: { rating: 5 } });
  const cd = await decisionOf(t, c.jobId);
  const noEdits = await t.api("POST", `/api/jobs/${c.jobId}/decisions/${cd.id}/share-edits`, { user: "user_buyer", body: { share: true } });
  assert.equal(noEdits.status, 409);
  assert.equal(noEdits.body.error.code, "no_edits");
  assert.equal((await t.api("POST", `/api/jobs/${c.jobId}/decisions/${d.id}/share-edits`, { user: "user_buyer", body: { share: true } })).status, 404, "a decision from another job");
  await t.grantBeta("user_other");
  assert.equal((await t.api("POST", `/api/jobs/${a.jobId}/decisions/${d.id}/share-edits`, { user: "user_other", body: { share: true } })).status, 404);
  assert.equal((await consentOf(t, d.id)).granted, 0);
});

test("the org choice sets the default, covers new edits only, and turning it off stops every past decision", async () => {
  const t = await testEnv();
  await t.grantBeta("user_buyer");
  const start = await t.api("GET", "/api/settings/edit-sharing", { user: "user_buyer" });
  assert.deepEqual(start.body, { share: false, chosen: false, updatedAt: null });
  assert.equal((await t.api("GET", "/api/settings/edit-sharing")).status, 401);

  // An older decision with edits, made before the buyer was ever asked.
  const old = await deliveredJob(t);
  await t.api("POST", `/api/jobs/${old.jobId}/accept`, { user: "user_buyer", body: { rating: 4, editedContent: EDITED } });
  const oldDecision = await decisionOf(t, old.jobId);
  await t.sql("DELETE FROM decision_consents WHERE decision_id = ?", oldDecision.id);

  const on = await t.api("POST", "/api/settings/edit-sharing", { user: "user_buyer", body: { share: true } });
  assert.equal(on.status, 200, JSON.stringify(on.body));
  assert.equal(on.body.share, true);
  assert.equal(on.body.chosen, true);
  assert.equal((await consentOf(t, oldDecision.id)).granted, 0, "turning it on does not share older edits");

  // New decisions start as shared when the buyer is not asked, and the form starts ticked.
  const a = await deliveredJob(t);
  const view = await t.api("GET", `/api/jobs/${a.jobId}`, { user: "user_buyer" });
  assert.equal(view.body.shareEditsDefault, true);
  await t.api("POST", `/api/jobs/${a.jobId}/accept`, { user: "user_buyer", body: { rating: 5, editedContent: EDITED } });
  const da = await decisionOf(t, a.jobId);
  assert.equal((await consentOf(t, da.id)).granted, 1);
  // The buyer can still say no on one job.
  const b = await deliveredJob(t);
  await t.api("POST", `/api/jobs/${b.jobId}/accept`, { user: "user_buyer", body: { rating: 5, editedContent: EDITED, shareEdits: false } });
  const db = await decisionOf(t, b.jobId);
  assert.deepEqual([...await learnableDecisionIds(t.env, [oldDecision.id, da.id, db.id])], [da.id]);

  const off = await t.api("POST", "/api/settings/edit-sharing", { user: "user_buyer", body: { share: false } });
  assert.equal(off.status, 200);
  assert.equal(off.body.share, false);
  assert.equal(off.body.stopped, 1);
  assert.equal((await learnableDecisionIds(t.env, [oldDecision.id, da.id, db.id])).size, 0);
  const orgEvents = await t.sql("SELECT data FROM events WHERE entity = 'org' AND entity_id = 'org_user_buyer' AND type = 'consent.learn_from_edits' ORDER BY seq");
  assert.deepEqual(orgEvents.map(e => JSON.parse(e.data).granted), [true, false]);
  assert.equal((await t.api("POST", "/api/settings/edit-sharing", { user: "user_buyer", body: {} })).status, 400);
});

test("the expert dashboard shows a buyer's edits only for decisions the buyer shared", async () => {
  const t = await testEnv();
  const now = new Date().toISOString();
  await t.grantBeta("user_expert");
  await t.sql("INSERT INTO experts (id, user_id, status, display_name, created_at, updated_at) VALUES ('exp_maya', 'user_expert', 'approved', 'Maya Patel', ?, ?)", now, now);
  await t.sql("INSERT INTO agents (id, kind, expert_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_maya', 'expert', 'exp_maya', 'landing-page-copy', 'Maya: landing pages', 'live', 1, ?, ?)", now, now);
  const shared = await deliveredJob(t, { agentId: "agt_maya" });
  const kept = await deliveredJob(t, { agentId: "agt_maya" });
  await t.api("POST", `/api/jobs/${shared.jobId}/accept`, { user: "user_buyer", body: { rating: 5, editedContent: EDITED, shareEdits: true } });
  await t.api("POST", `/api/jobs/${kept.jobId}/accept`, { user: "user_buyer", body: { rating: 4, editedContent: EDITED } });
  // Even an org-wide yes does not override a no on one decision.
  await t.sql("INSERT INTO consents (owner_kind, owner_id, scope, granted, updated_by, updated_at) VALUES ('org', 'org_user_buyer', 'learn_from_edits', 1, 'user_buyer', ?)", now);

  const dash = await expertDashboard(t.env, "exp_maya");
  const fb = (jobId: string) => dash.feedback.find(f => f.job_id === jobId)!;
  assert.equal(fb(shared.jobId).has_edits, true);
  assert.equal(fb(shared.jobId).edits_shared, true);
  assert.equal((fb(shared.jobId).edits as any).format, "ai-blocks-line-diff/1");
  assert.equal(fb(kept.jobId).has_edits, true);
  assert.equal(fb(kept.jobId).edits_shared, false);
  assert.equal(fb(kept.jobId).edits, null);
  assert.ok(!JSON.stringify(fb(kept.jobId)).includes("Get paid at booking"));

  // Withdrawn later: the dashboard stops showing them.
  const d = await decisionOf(t, shared.jobId);
  await t.api("POST", `/api/jobs/${shared.jobId}/decisions/${d.id}/share-edits`, { user: "user_buyer", body: { share: false } });
  const after = await expertDashboard(t.env, "exp_maya");
  assert.equal(after.feedback.find(f => f.job_id === shared.jobId)!.edits, null);
});
