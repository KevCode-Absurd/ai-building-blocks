// Experts module: businesses post jobs, matching experts reply, the business picks one. Covers validation and the
// posting limit, who sees what, one reply per expert, pick (emails both sides), close, delete, the 60-day expiry,
// the daily digest and ops hiding. No prices and no model calls.
import { test, mock } from "node:test";
import assert from "node:assert/strict";

const OPS = new URL("../src/modules/ops/service.ts", import.meta.url).href;
const EVAL = new URL("../src/modules/evaluation/service.ts", import.meta.url).href;
const realOps = await import(`${OPS}?real`);
const realEval = await import(`${EVAL}?real`);
mock.module(OPS, { exports: { ...realOps, notifyOps: async () => {} } });
mock.module(EVAL, { exports: { ...realEval, winRates: async () => [] } });

const { testEnv } = await import("./helpers.ts");
const { expirePosts, sendPostDigests } = await import("../src/modules/experts/posts.ts");

type T = Awaited<ReturnType<typeof testEnv>>;

async function expert(t: T, user: string, name: string, areas: string[], jobTypes: string[], approve = true) {
  const res = await t.api("POST", "/api/experts/apply", {
    user, email: `${user}@example.com`, body: {
      display_name: name, headline: "Copywriter for software companies", areas, job_types: jobTypes,
      experience: "Eight years writing landing pages and launch emails for software companies.",
      claims: [{ text: "Wrote the launch page for a scheduling app", evidence_url: "https://example.com/case" }],
      sample_links: [], country: "India", agree: true,
    },
  });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  if (approve) {
    await t.makeOps("ops_1");
    await t.api("POST", `/api/experts/${res.body.expert.id}/review`, { user: "ops_1", body: { decision: "approve" } });
  }
  return res.body.expert.id as string;
}

const BRIEF = "We sell refillable cleaning sprays online. We need a new landing page for our starter kit that explains refills clearly.";
const post = (t: T, user = "biz_1", over: Record<string, unknown> = {}) =>
  t.api("POST", "/api/job-posts", { user, email: `${user}@example.com`, body: { title: "Landing page for our starter kit", brief: BRIEF, area: "marketing", job_type_id: "landing-page-copy", website_url: "https://example.com", needed_by: "two_weeks", ...over } });

async function setup() {
  const t = await testEnv();
  const maya = await expert(t, "user_maya", "Maya Patel", ["marketing"], ["landing-page-copy"]);
  const ola = await expert(t, "user_ola", "Ola Nord", ["finance"], ["seo-blog-post"]);
  const res = await post(t);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return { t, maya, ola, postId: res.body.post.id as string };
}

test("a post is checked: required fields, https website, no secrets, sign-in", async () => {
  const t = await testEnv();
  for (const [over, message] of [
    [{ title: "Hi" }, /short title/],
    [{ brief: "Too short." }, /bit more/],
    [{ brief: "x".repeat(3001) }, /under 3000/],
    [{ area: "astrology" }, /area/],
    [{ job_type_id: "no-such-job" }, /not on our menu/],
    [{ website_url: "http://example.com" }, /https:\/\//],
    [{ needed_by: "yesterday" }, /when you need it/],
    [{ brief: `${BRIEF} Our admin password: hunter22 for the shop.` }, /password or key/],
    [{ brief: `${BRIEF} Key sk-ant-api03-${"a".repeat(30)}` }, /password or key/],
  ] as const) {
    const res = await post(t, "biz_1", over);
    assert.equal(res.status, 400, JSON.stringify(over));
    assert.match(res.body.error.message, message);
  }
  assert.equal((await t.api("POST", "/api/job-posts", { body: { title: "x" } })).status, 401);
  const ok = await post(t, "biz_1", { website_url: "", job_type_id: "" });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.post.website_url, null);
  assert.equal(ok.body.post.job_type, null);
  assert.equal(ok.body.post.needed_by_label, "Within 2 weeks");
  assert.ok(!("price" in ok.body.post) && !("budget" in ok.body.post));
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM job_posts"))[0].n, 1);
});

test("posting is rate-limited per person", async () => {
  const t = await testEnv();
  for (let i = 0; i < 3; i++) assert.equal((await post(t)).status, 201);
  const fourth = await post(t);
  assert.equal(fourth.status, 429);
  assert.equal(fourth.body.error.code, "post_limit");
  assert.equal((await post(t, "biz_2")).status, 201, "the limit is per person");
});

test("only matching approved experts see a post and can reply, once each", async () => {
  const { t, postId } = await setup();
  await expert(t, "user_wait", "Ana Lima", ["marketing"], ["landing-page-copy"], false);

  const mayaSees = await t.api("GET", "/api/experts/me/posts", { user: "user_maya" });
  assert.deepEqual(mayaSees.body.posts.map((p: { id: string }) => p.id), [postId]);
  assert.equal(mayaSees.body.posts[0].my_reply, null);
  assert.ok(!JSON.stringify(mayaSees.body).includes("biz_1"), "experts do not see who posted");
  assert.deepEqual((await t.api("GET", "/api/experts/me/posts", { user: "user_ola" })).body.posts, [], "no match on area or job");
  assert.equal((await t.api("GET", "/api/experts/me/posts", { user: "user_wait" })).status, 403, "applied, not approved");
  assert.equal((await t.api("GET", "/api/experts/me/posts", { user: "biz_2" })).status, 403);

  const note = "I have written landing pages for three refill brands. I would start from your reviews.";
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "biz_2", body: { note } })).status, 403, "not an expert");
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_wait", body: { note } })).status, 403, "not approved yet");
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_ola", body: { note } })).status, 404, "does not match");
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_maya", body: { note: "Hi" } })).status, 400);

  const first = await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_maya", body: { note } });
  assert.equal(first.status, 201);
  const again = await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_maya", body: { note } });
  assert.equal(again.status, 409);
  assert.equal(again.body.error.code, "already_replied");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM job_post_replies"))[0].n, 1);
  const told = await t.sql("SELECT user_id, kind, subject FROM notifications WHERE kind = 'job_post.reply'");
  assert.deepEqual(told.map(n => n.user_id), ["biz_1"]);
  assert.match(told[0].subject, /Maya Patel replied/);
});

test("only the business (and ops) see the replies; a replying expert sees just their own", async () => {
  const { t, postId } = await setup();
  await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_maya", body: { note: "I have written landing pages for three refill brands." } });

  const owner = await t.api("GET", `/api/job-posts/${postId}`, { user: "biz_1" });
  assert.equal(owner.status, 200);
  assert.equal(owner.body.owner, true);
  assert.equal(owner.body.replies.length, 1);
  assert.equal(owner.body.replies[0].expert.name, "Maya Patel");
  assert.equal(owner.body.replies[0].expert.profile_url, null, "no public page until an agent is live");
  assert.ok(!JSON.stringify(owner.body).includes("user_maya@example.com"), "no emails before a pick");

  const asExpert = await t.api("GET", `/api/job-posts/${postId}`, { user: "user_maya" });
  assert.equal(asExpert.status, 200);
  assert.equal(asExpert.body.replies, null);
  assert.match(asExpert.body.my_reply.note, /refill brands/);
  assert.equal((await t.api("GET", `/api/job-posts/${postId}`, { user: "biz_2" })).status, 404, "another business");
  assert.equal((await t.api("GET", `/api/job-posts/${postId}`, { user: "user_ola" })).status, 404, "a non-matching expert");
  assert.equal((await t.api("GET", `/api/job-posts/${postId}`)).status, 401);
  await t.makeOps("ops_1");
  assert.equal((await t.api("GET", `/api/job-posts/${postId}`, { user: "ops_1" })).body.replies.length, 1);

  // Others cannot pick, close or delete it.
  const replyId = owner.body.replies[0].id;
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/pick`, { user: "biz_2", body: { reply_id: replyId } })).status, 404);
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/close`, { user: "user_maya" })).status, 404);
  assert.equal((await t.api("DELETE", `/api/job-posts/${postId}`, { user: "biz_2" })).status, 404);
});

test("picking a reply closes the post and emails both sides the other's address", async () => {
  const { t, postId } = await setup();
  const ana = await expert(t, "user_ana", "Ana Lima", ["marketing"], ["seo-blog-post"]);
  await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_maya", body: { note: "I have written landing pages for three refill brands." } });
  await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_ana", body: { note: "I write product pages for home goods brands." } });
  const owner = await t.api("GET", `/api/job-posts/${postId}`, { user: "biz_1" });
  const mayaReply = owner.body.replies.find((r: { expert: { name: string } }) => r.expert.name === "Maya Patel");

  assert.equal((await t.api("POST", `/api/job-posts/${postId}/pick`, { user: "biz_1", body: { reply_id: "rep_nope" } })).status, 404);
  const picked = await t.api("POST", `/api/job-posts/${postId}/pick`, { user: "biz_1", body: { reply_id: mayaReply.id } });
  assert.equal(picked.status, 200);
  assert.equal(picked.body.post.status, "picked");

  const mail = await t.sql("SELECT user_id, subject, body_text FROM notifications WHERE kind = 'job_post.picked' ORDER BY user_id");
  assert.equal(mail.length, 2);
  const toBiz = mail.find(m => m.user_id === "biz_1")!;
  const toMaya = mail.find(m => m.user_id === "user_maya")!;
  assert.match(toBiz.body_text, /user_maya@example\.com/);
  assert.match(toMaya.body_text, /biz_1@example\.com/);
  assert.ok(!mail.some(m => m.user_id === "user_ana"), "the expert not picked gets no email with contact details");
  assert.ok(ana);

  const after = await t.api("GET", `/api/job-posts/${postId}`, { user: "biz_1" });
  assert.equal(after.body.replies.find((r: { id: string }) => r.id === mayaReply.id).picked, true);
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/pick`, { user: "biz_1", body: { reply_id: mayaReply.id } })).status, 409);
  assert.deepEqual((await t.api("GET", "/api/experts/me/posts", { user: "user_ana" })).body.posts, [], "a picked post leaves experts' lists");
  const late = await expert(t, "user_late", "Ben Ode", ["marketing"], ["seo-blog-post"]);
  assert.ok(late);
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_late", body: { note: "I would like to help with this page." } })).status, 409);
});

test("the business can close or delete a post; delete removes the text", async () => {
  const { t, postId } = await setup();
  await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_maya", body: { note: "I have written landing pages for three refill brands." } });
  const closed = await t.api("POST", `/api/job-posts/${postId}/close`, { user: "biz_1" });
  assert.equal(closed.status, 200);
  assert.equal(closed.body.post.status, "closed");
  assert.deepEqual((await t.api("GET", "/api/experts/me/posts", { user: "user_maya" })).body.posts, []);
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/close`, { user: "biz_1" })).status, 409);

  const del = await t.api("DELETE", `/api/job-posts/${postId}`, { user: "biz_1" });
  assert.equal(del.status, 200);
  const [row] = await t.sql("SELECT status, title, brief, website_url, text_deleted_at FROM job_posts WHERE id = ?", postId);
  assert.deepEqual({ ...row, text_deleted_at: !!row.text_deleted_at }, { status: "deleted", title: "", brief: null, website_url: null, text_deleted_at: true });
  assert.equal((await t.sql("SELECT note FROM job_post_replies WHERE post_id = ?", postId))[0].note, "");
  assert.equal((await t.api("GET", `/api/job-posts/${postId}`, { user: "biz_1" })).status, 404);
  assert.deepEqual((await t.api("GET", "/api/job-posts", { user: "biz_1" })).body.posts, []);
  // An open post can be deleted straight away too.
  const second = await post(t);
  assert.equal((await t.api("DELETE", `/api/job-posts/${second.body.post.id}`, { user: "biz_1" })).status, 200);
});

test("after 60 days every post's text is removed, and open posts expire", async () => {
  const { t, postId } = await setup();
  const picked = (await post(t, "biz_2")).body.post.id;
  const fresh = (await post(t, "biz_3")).body.post.id;
  const old = new Date(Date.now() - 61 * 86_400_000).toISOString();
  const due = new Date(Date.now() - 86_400_000).toISOString();
  await t.sql("UPDATE job_posts SET created_at = ?, expires_at = ? WHERE id IN (?, ?)", old, due, postId, picked);
  await t.sql("UPDATE job_posts SET status = 'picked' WHERE id = ?", picked);
  await t.api("POST", `/api/job-posts/${fresh}/replies`, { user: "user_maya", body: { note: "I have written landing pages for three refill brands." } });

  assert.deepEqual(await expirePosts(t.env), { expired: 2 });
  const rows = await t.sql("SELECT id, status, title, brief, website_url FROM job_posts ORDER BY created_at");
  const byId = Object.fromEntries(rows.map(r => [r.id, r]));
  assert.deepEqual({ ...byId[postId], id: undefined }, { id: undefined, status: "expired", title: "", brief: null, website_url: null });
  assert.equal(byId[picked].status, "picked");
  assert.equal(byId[picked].brief, null);
  assert.equal(byId[fresh].status, "open");
  assert.equal(byId[fresh].brief, BRIEF);
  assert.deepEqual(await expirePosts(t.env), { expired: 0 }, "runs once per post");
  // The 15-minute cron runs it too.
  await t.sql("UPDATE job_posts SET expires_at = ? WHERE id = ?", due, fresh);
  await t.scheduled();
  assert.equal((await t.sql("SELECT status FROM job_posts WHERE id = ?", fresh))[0].status, "expired");
  assert.equal((await t.sql("SELECT note FROM job_post_replies WHERE post_id = ?", fresh))[0].note, "");
});

test("matching experts get at most one digest a day, never one email per post", async () => {
  const { t } = await setup();
  await post(t, "biz_2", { title: "Product pages for our refill range" });
  await t.api("POST", "/api/job-posts", { user: "biz_3", body: { title: "Monthly bookkeeping clean-up", brief: BRIEF, area: "finance", needed_by: "month" } });

  assert.deepEqual(await sendPostDigests(t.env), { sent: 2 });
  const digests = await t.sql("SELECT user_id, subject, body_text FROM notifications WHERE kind = 'job_post.digest' ORDER BY user_id");
  assert.deepEqual(digests.map(d => d.user_id), ["user_maya", "user_ola"]);
  assert.match(digests[0].subject, /2 new jobs match/);
  assert.match(digests[0].body_text, /Landing page for our starter kit/);
  assert.match(digests[0].body_text, /Product pages for our refill range/);
  assert.doesNotMatch(digests[0].body_text, /bookkeeping/);
  assert.match(digests[1].subject, /A new job matches/);

  await post(t, "biz_4", { title: "Waitlist page for a new refill scent" });
  assert.deepEqual(await sendPostDigests(t.env), { sent: 0 }, "not again within a day");
  // A day later: move the clock back on everything that happened so far.
  await t.sql("UPDATE expert_post_digests SET last_sent_at = ?", new Date(Date.now() - 25 * 3_600_000).toISOString());
  await t.sql("UPDATE job_posts SET created_at = ? WHERE title != 'Waitlist page for a new refill scent'", new Date(Date.now() - 26 * 3_600_000).toISOString());
  assert.deepEqual(await sendPostDigests(t.env), { sent: 1 }, "the next day, only experts with new matches");
  const last = await t.sql("SELECT body_text FROM notifications WHERE kind = 'job_post.digest' ORDER BY created_at DESC, rowid DESC LIMIT 1");
  assert.match(last[0].body_text, /Waitlist page/);
  assert.doesNotMatch(last[0].body_text, /starter kit/, "only posts since the last digest");
});

test("ops can hide a post from experts; the business sees why", async () => {
  const { t, postId } = await setup();
  await t.makeOps("ops_1");
  assert.equal((await t.api("POST", `/api/ops/job-posts/${postId}/hide`, { user: "biz_2", body: { hidden: true, note: "Spam" } })).status, 403);
  assert.equal((await t.api("GET", "/api/ops/job-posts", { user: "biz_2" })).status, 403);
  assert.equal((await t.api("POST", `/api/ops/job-posts/${postId}/hide`, { user: "ops_1", body: { hidden: true } })).status, 400, "a note is needed");
  const hidden = await t.api("POST", `/api/ops/job-posts/${postId}/hide`, { user: "ops_1", body: { hidden: true, note: "Asks for login details." } });
  assert.equal(hidden.status, 200);
  assert.equal(hidden.body.post.hidden, true);
  assert.deepEqual((await t.api("GET", "/api/experts/me/posts", { user: "user_maya" })).body.posts, []);
  assert.equal((await t.api("POST", `/api/job-posts/${postId}/replies`, { user: "user_maya", body: { note: "I would like to help with this page." } })).status, 404);
  const mine = await t.api("GET", "/api/job-posts", { user: "biz_1" });
  assert.equal(mine.body.posts[0].hidden_note, "Asks for login details.");
  const list = await t.api("GET", "/api/ops/job-posts?status=hidden", { user: "ops_1" });
  assert.equal(list.body.posts.length, 1);
  assert.equal(list.body.counts.hidden, 1);
  const shown = await t.api("POST", `/api/ops/job-posts/${postId}/hide`, { user: "ops_1", body: { hidden: false } });
  assert.equal(shown.body.post.hidden, false);
  assert.equal((await t.api("GET", "/api/experts/me/posts", { user: "user_maya" })).body.posts.length, 1);
});
