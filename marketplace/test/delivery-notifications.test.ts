// Delivery module: the in-app messages list, unread count and read marks (GET /api/notifications and friends).
import { test } from "node:test";
import assert from "node:assert/strict";
import { deliveredJob, mockDeliveryNeighbours } from "./delivery-kit.ts";

mockDeliveryNeighbours();
const { testEnv } = await import("./helpers.ts");
const { notify } = await import("../src/core/email.ts");
const { appPath, jobIdFromPath } = await import("../src/modules/delivery/notifications.ts");

test("messages come newest first with an unread mark, a job link and the unread count", async () => {
  const t = await testEnv();
  const a = await deliveredJob(t);
  const b = await deliveredJob(t);
  await notify(t.env, { userId: "user_buyer", kind: "account.note", subject: "Welcome to the beta", text: "Thanks for joining." });
  await deliveredJob(t, { user: "user_other" });

  const res = await t.api("GET", "/api/notifications", { user: "user_buyer" });
  assert.equal(res.status, 200);
  assert.equal(res.body.unread, 3);
  const list = res.body.notifications;
  assert.deepEqual(list.map((n: any) => n.kind), ["account.note", "job.delivered", "job.delivered"]);
  assert.deepEqual(list.map((n: any) => n.jobId), [null, b.jobId, a.jobId]);
  assert.equal(list[1].path, `/jobs/${b.jobId}`);
  assert.equal(list[1].link, `https://agents.test/jobs/${b.jobId}`);
  assert.equal(list[1].read, false);
  assert.equal(list[1].readAt, null);
  assert.equal(list[1].emailed, false);
  assert.equal(list[0].path, null);
  assert.equal((await t.api("GET", "/api/notifications/unread", { user: "user_buyer" })).body.unread, 3);
  assert.equal((await t.api("GET", "/api/notifications/unread", { user: "user_other" })).body.unread, 1);
  assert.equal((await t.api("GET", "/api/notifications")).status, 401);
  assert.equal((await t.api("GET", "/api/notifications/unread")).status, 401);
});

test("marking one message read is safe to repeat, writes one event and only works on your own messages", async () => {
  const t = await testEnv();
  const { jobId } = await deliveredJob(t);
  await deliveredJob(t, { user: "user_other" });
  const [mine] = await t.sql("SELECT id FROM notifications WHERE user_id = 'user_buyer'");
  const [theirs] = await t.sql("SELECT id FROM notifications WHERE user_id = 'user_other'");

  const res = await t.api("POST", `/api/notifications/${mine.id}/read`, { user: "user_buyer", body: {} });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.unread, 0);
  const again = await t.api("POST", `/api/notifications/${mine.id}/read`, { user: "user_buyer", body: {} });
  assert.equal(again.status, 200);
  const events = await t.sql("SELECT actor FROM events WHERE entity = 'notification' AND entity_id = ? AND type = 'notification.read'", mine.id);
  assert.deepEqual(events.map(e => e.actor), ["user_buyer"]);

  const list = await t.api("GET", "/api/notifications", { user: "user_buyer" });
  assert.equal(list.body.notifications[0].read, true);
  assert.ok(list.body.notifications[0].readAt);
  assert.equal(list.body.notifications[0].jobId, jobId);

  const stranger = await t.api("POST", `/api/notifications/${theirs.id}/read`, { user: "user_buyer", body: {} });
  assert.equal(stranger.status, 404);
  assert.equal(stranger.body.error.code, "notification_not_found");
  assert.equal((await t.api("GET", "/api/notifications/unread", { user: "user_other" })).body.unread, 1);
  assert.equal((await t.api("POST", "/api/notifications/ntf_nope/read", { user: "user_buyer", body: {} })).status, 404);
});

test("mark all as read covers only the caller's unread messages and logs how many", async () => {
  const t = await testEnv();
  await deliveredJob(t);
  await deliveredJob(t);
  await deliveredJob(t);
  await deliveredJob(t, { user: "user_other" });
  const [first] = await t.sql("SELECT id FROM notifications WHERE user_id = 'user_buyer' ORDER BY created_at, rowid LIMIT 1");
  await t.api("POST", `/api/notifications/${first.id}/read`, { user: "user_buyer", body: {} });

  const res = await t.api("POST", "/api/notifications/read-all", { user: "user_buyer", body: {} });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { marked: 2, unread: 0 });
  const [event] = await t.sql("SELECT data FROM events WHERE entity = 'user' AND entity_id = 'user_buyer' AND type = 'notifications.read_all'");
  assert.deepEqual(JSON.parse(event.data), { count: 2 });
  // Nothing left: no second event.
  assert.deepEqual((await t.api("POST", "/api/notifications/read-all", { user: "user_buyer", body: {} })).body, { marked: 0, unread: 0 });
  assert.equal((await t.sql("SELECT 1 FROM events WHERE type = 'notifications.read_all'")).length, 1);
  assert.equal((await t.api("GET", "/api/notifications/unread", { user: "user_other" })).body.unread, 1);
  // A new message after that is unread again.
  await notify(t.env, { userId: "user_buyer", kind: "job.delivered", subject: "New draft", text: "Ready.", link: "/jobs/job_x" });
  assert.equal((await t.api("GET", "/api/notifications/unread", { user: "user_buyer" })).body.unread, 1);
});

test("links become in-app paths and job ids", () => {
  assert.equal(appPath("https://agents.useaiblocks.com/jobs/job_1?x=1"), "/jobs/job_1?x=1");
  assert.equal(appPath("not a link"), null);
  assert.equal(appPath(null), null);
  assert.equal(jobIdFromPath("/jobs/job_1"), "job_1");
  assert.equal(jobIdFromPath("/requests/job_2"), "job_2");
  assert.equal(jobIdFromPath("/ops/jobs/job_3"), "job_3");
  assert.equal(jobIdFromPath("/expert"), null);
});
