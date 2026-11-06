// Experts module: applications, the agreement, ops review, founding cap and expert personas.
// The ops and evaluation services are mocked so these tests do not depend on neighbours that may still be stubs.
import { test, mock } from "node:test";
import assert from "node:assert/strict";

const opsAlerts: { kind: string; subject: string; text: string; link?: string }[] = [];
const OPS = new URL("../src/modules/ops/service.ts", import.meta.url).href;
const EVAL = new URL("../src/modules/evaluation/service.ts", import.meta.url).href;
const realOps = await import(`${OPS}?real`);
const realEval = await import(`${EVAL}?real`);
mock.module(OPS, { exports: { ...realOps, notifyOps: async (_env: unknown, notice: (typeof opsAlerts)[number]) => { opsAlerts.push(notice); } } });
mock.module(EVAL, { exports: { ...realEval, winRates: async () => [] } });

const { testEnv } = await import("./helpers.ts");
const { AGREEMENT_VERSION, FOUNDING_LIMIT, REAPPLY_WAIT_DAYS } = await import("../src/modules/experts/service.ts");

type T = Awaited<ReturnType<typeof testEnv>>;

const application = (over: Record<string, unknown> = {}) => ({
  display_name: "Maya Patel",
  headline: "Conversion copywriter for SaaS founders",
  areas: ["marketing", "content"],
  job_types: ["landing-page-copy", "seo-blog-post"],
  experience: "Eight years writing landing pages and launch emails for software companies. I run a two-person studio. Before that I led content at an agency.",
  claims: [{ text: "Wrote the launch page for a scheduling app", evidence_url: "https://example.com/case-study" }],
  sample_links: ["https://example.com/samples"],
  country: "India",
  agree: true,
  ...over,
});

async function apply(t: T, user: string, over: Record<string, unknown> = {}) {
  return t.api("POST", "/api/experts/apply", { user, email: `${user}@example.com`, body: application(over) });
}

async function review(t: T, expertId: string, decision: string, note = "") {
  await t.makeOps("ops_1");
  return t.api("POST", `/api/experts/${expertId}/review`, { user: "ops_1", body: { decision, note } });
}

test("the agreement is a public, clearly marked draft with the business plan terms", async () => {
  const t = await testEnv();
  const res = await t.api("GET", "/api/experts/agreement");
  assert.equal(res.status, 200);
  const a = res.body.agreement;
  assert.equal(a.version, AGREEMENT_VERSION);
  assert.equal(a.status, "draft");
  assert.match(a.title, /draft/i);
  assert.match(a.draft_notice, /lawyer will review/);
  const text = a.sections.map((s: { body: string }) => s.body).join(" ");
  for (const needle of [/keep ownership of your method and your examples/, /run your agent for buyers/, /details taken out/, /70% of the net amount/, /first 100 approved experts/, /75%/, /confidential/, /within 7 days/]) {
    assert.match(text, needle);
  }
});

test("applications are validated with plain messages and nothing is saved on a bad one", async () => {
  const t = await testEnv();
  const cases: [Record<string, unknown>, RegExp][] = [
    [{ display_name: "" }, /Fill in your name/],
    [{ display_name: undefined }, /Fill in your name/],
    [{ headline: "x" }, /Add a headline/],
    [{ areas: [] }, /at least one area/],
    [{ areas: ["cooking"] }, /Pick your areas from the list/],
    [{ areas: ["marketing", "content", "sales", "finance"] }, /up to 3 areas/],
    [{ job_types: [] }, /at least one job/],
    [{ job_types: ["made-up-job"] }, /not on our menu/],
    [{ experience: "Short." }, /a bit more about your experience/],
    [{ claims: [] }, /at least one claim/],
    [{ claims: [{ text: "Ran ads for a bakery", evidence_url: "http://example.com/proof" }] }, /https:\/\//],
    [{ claims: [{ text: "Ran ads for a bakery", evidence_url: "https://localhost/proof" }] }, /https:\/\//],
    [{ claims: [{ text: "", evidence_url: "https://example.com/proof" }] }, /Fill in each claim/],
    [{ claims: Array.from({ length: 6 }, (_, i) => ({ text: `Claim number ${i}`, evidence_url: `https://example.com/${i}` })) }, /up to 5 claims/],
    [{ sample_links: ["ftp://example.com/file"] }, /Sample links must start with https/],
    [{ country: "" }, /which country/],
    [{ agree: false }, /Tick the box/],
    [{ agree: "yes" }, /Tick the box/],
  ];
  for (const [over, message] of cases) {
    const res = await apply(t, "user_val", over);
    assert.equal(res.status, 400, JSON.stringify(over));
    assert.equal(res.body.error.code, "invalid_application");
    assert.match(res.body.error.message, message, JSON.stringify(over));
  }
  const notObject = await t.api("POST", "/api/experts/apply", { user: "user_val", body: ["not", "a", "form"] });
  assert.equal(notObject.status, 400);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM experts"))[0].n, 0);
  assert.equal(opsAlerts.length, 0);
  assert.equal((await t.api("POST", "/api/experts/apply", { body: application() })).status, 401);
});

test("applying records the agreement, writes an event, alerts ops and shows on /api/me", async () => {
  const t = await testEnv();
  opsAlerts.length = 0;
  const res = await apply(t, "user_maya", { areas: ["marketing", "marketing"], sample_links: [] });
  assert.equal(res.status, 201);
  const e = res.body.expert;
  assert.equal(e.status, "applied");
  assert.deepEqual(e.areas, ["marketing"]);
  assert.equal(e.agreement.version, AGREEMENT_VERSION);
  assert.ok(e.agreement.accepted_at);
  assert.equal(e.founding, false);
  assert.equal(e.application.attempt, 1);

  const [row] = await t.sql("SELECT * FROM experts WHERE user_id = 'user_maya'");
  assert.equal(row.agreement_version, AGREEMENT_VERSION);
  assert.equal(row.agreement_accepted_at, e.agreement.accepted_at);
  assert.equal(JSON.parse(row.application).country, "India");

  const events = await t.sql("SELECT type, actor, data FROM events WHERE entity = 'expert' AND entity_id = ?", row.id);
  assert.deepEqual(events.map(ev => ev.type), ["expert.applied"]);
  assert.equal(events[0].actor, "user_maya");
  assert.equal(JSON.parse(events[0].data).agreement_version, AGREEMENT_VERSION);

  assert.equal(opsAlerts.length, 1);
  assert.equal(opsAlerts[0]!.kind, "expert.applied");
  assert.match(opsAlerts[0]!.subject, /Maya Patel/);
  assert.match(opsAlerts[0]!.link ?? "", /^\/ops\/experts/);

  const notes = await t.sql("SELECT kind, to_email FROM notifications WHERE user_id = 'user_maya'");
  assert.deepEqual(notes.map(n => n.kind), ["expert.applied"]);

  const me = await t.api("GET", "/api/me", { user: "user_maya" });
  assert.equal(me.body.expert.status, "applied");
  const mine = await t.api("GET", "/api/experts/me", { user: "user_maya" });
  assert.equal(mine.body.expert.status, "applied");
  assert.equal(mine.body.founding.left, FOUNDING_LIMIT);
  assert.ok(mine.body.review_time);
  const none = await t.api("GET", "/api/experts/me", { user: "user_nobody" });
  assert.equal(none.body.expert, null);
});

test("one application per user", async () => {
  const t = await testEnv();
  assert.equal((await apply(t, "user_once")).status, 201);
  const again = await apply(t, "user_once", { headline: "A different headline here" });
  assert.equal(again.status, 409);
  assert.equal(again.body.error.code, "already_applied");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM experts WHERE user_id = 'user_once'"))[0].n, 1);
});

test("a rejected applicant sees the note and can apply again after the wait", async () => {
  const t = await testEnv();
  opsAlerts.length = 0;
  const first = await apply(t, "user_re");
  const id = first.body.expert.id;
  assert.equal((await review(t, id, "reject")).status, 400, "a rejection needs a note");
  const rejected = await review(t, id, "reject", "Add links that show your client work.");
  assert.equal(rejected.status, 200);
  assert.equal(rejected.body.expert.status, "rejected");

  const mine = await t.api("GET", "/api/experts/me", { user: "user_re" });
  assert.equal(mine.body.expert.note, "Add links that show your client work.");
  const wait = Date.parse(mine.body.expert.can_reapply_at) - Date.parse(mine.body.expert.reviewed_at);
  assert.equal(Math.round(wait / 86_400_000), REAPPLY_WAIT_DAYS);
  const rejectMail = await t.sql("SELECT body_text FROM notifications WHERE user_id = 'user_re' AND kind = 'expert.rejected'");
  assert.match(rejectMail[0].body_text, /Add links that show your client work/);

  const tooSoon = await apply(t, "user_re");
  assert.equal(tooSoon.status, 409);
  assert.equal(tooSoon.body.error.code, "reapply_too_soon");
  assert.match(tooSoon.body.error.message, /You can apply again from/);

  const past = new Date(Date.now() - (REAPPLY_WAIT_DAYS + 1) * 86_400_000).toISOString();
  await t.sql("UPDATE experts SET reviewed_at = ? WHERE id = ?", past, id);
  const again = await apply(t, "user_re", { claims: [{ text: "Client work for a bakery chain", evidence_url: "https://example.com/bakery" }] });
  assert.equal(again.status, 201);
  assert.equal(again.body.expert.id, id, "same expert row");
  assert.equal(again.body.expert.status, "applied");
  assert.equal(again.body.expert.note, "");
  assert.equal(again.body.expert.application.attempt, 2);
  assert.equal(again.body.expert.application.claims[0].text, "Client work for a bakery chain");
  const types = (await t.sql("SELECT type FROM events WHERE entity = 'expert' AND entity_id = ? ORDER BY seq", id)).map(e => e.type);
  assert.deepEqual(types, ["expert.applied", "expert.rejected", "expert.applied"]);
  assert.equal(opsAlerts.length, 2);
});

test("only ops can list and review applications", async () => {
  const t = await testEnv();
  const a = await apply(t, "user_list", { display_name: "Ravi Kumar" });
  await apply(t, "user_list2", { display_name: "Ana Souza", areas: ["sales"], job_types: ["seo-blog-post"] });
  assert.equal((await t.api("GET", "/api/experts")).status, 401);
  assert.equal((await t.api("GET", "/api/experts", { user: "user_list" })).status, 403);
  const denied = await t.api("POST", `/api/experts/${a.body.expert.id}/review`, { user: "user_list", body: { decision: "approve" } });
  assert.equal(denied.status, 403);
  assert.equal((await t.sql("SELECT status FROM experts WHERE id = ?", a.body.expert.id))[0].status, "applied");

  await t.makeOps("ops_1");
  const list = await t.api("GET", "/api/experts", { user: "ops_1" });
  assert.equal(list.status, 200);
  assert.equal(list.body.experts.length, 2);
  assert.equal(list.body.counts.applied, 2);
  assert.equal(list.body.experts[0].email, "user_list@example.com");
  const byArea = await t.api("GET", "/api/experts?area=sales", { user: "ops_1" });
  assert.deepEqual(byArea.body.experts.map((e: { display_name: string }) => e.display_name), ["Ana Souza"]);
  const byQuery = await t.api("GET", "/api/experts?q=ravi", { user: "ops_1" });
  assert.deepEqual(byQuery.body.experts.map((e: { display_name: string }) => e.display_name), ["Ravi Kumar"]);
  const byJob = await t.api("GET", "/api/experts?job_type=landing-page-copy&status=applied", { user: "ops_1" });
  assert.equal(byJob.body.experts.length, 1);
  assert.equal((await t.api("GET", "/api/experts?status=nope", { user: "ops_1" })).status, 400);

  assert.equal((await review(t, "exp_missing", "approve")).status, 404);
  assert.equal((await t.api("POST", `/api/experts/${a.body.expert.id}/review`, { user: "ops_1", body: { decision: "promote" } })).status, 400);
});

test("approving creates a hidden expert persona and emails the expert", async () => {
  const t = await testEnv();
  const a = await apply(t, "user_persona");
  const id = a.body.expert.id;
  const res = await review(t, id, "approve", "Welcome aboard.");
  assert.equal(res.status, 200);
  assert.equal(res.body.expert.status, "approved");
  assert.equal(res.body.expert.founding, true);
  assert.equal(res.body.expert.rate, 0.75);

  const personas = await t.sql("SELECT * FROM personas WHERE expert_id = ?", id);
  assert.equal(personas.length, 1);
  const p = personas[0];
  assert.match(p.id, /^maya-patel-[0-9a-f]{4}$/);
  assert.equal(p.kind, "expert");
  assert.equal(p.name, "Maya");
  assert.equal(p.title, "Conversion copywriter");
  assert.equal(p.tagline, "Conversion copywriter for SaaS founders");
  assert.equal(p.area, "marketing");
  assert.equal(p.status, "hidden");
  const profile = JSON.parse(p.profile);
  assert.match(profile.bio, /^Eight years writing landing pages/);
  assert.deepEqual(profile.outcomes, []);
  assert.equal(profile.portrait, "/agents/expert-default.webp");

  const events = await t.sql("SELECT type, actor_kind, data FROM events WHERE (entity = 'expert' AND entity_id = ?) OR (entity = 'persona' AND entity_id = ?) ORDER BY seq", id, p.id);
  assert.deepEqual(events.map(e => e.type), ["expert.applied", "persona.created", "expert.approved"]);
  const approved = JSON.parse(events[2].data);
  assert.equal(approved.founding, 1);
  assert.equal(approved.persona_id, p.id);
  assert.equal(events[2].actor_kind, "ops");

  const mail = await t.sql("SELECT subject, body_text, link FROM notifications WHERE user_id = 'user_persona' AND kind = 'expert.approved'");
  assert.equal(mail.length, 1);
  assert.match(mail[0].body_text, /75% founding rate/);
  assert.match(mail[0].link, /\/studio$/);

  assert.equal((await t.api("GET", "/api/me", { user: "user_persona" })).body.expert.founding, true);
  assert.equal((await review(t, id, "approve")).status, 409, "already approved");
  assert.equal((await review(t, id, "reject", "Changed our mind.")).status, 409, "pause an approved expert instead");

  // Pause, then approve again: still one persona, founding kept.
  assert.equal((await review(t, id, "pause", "Checking a buyer complaint.")).body.expert.status, "paused");
  assert.equal((await apply(t, "user_persona")).body.error.code, "expert_paused");
  const back = await review(t, id, "approve");
  assert.equal(back.body.expert.status, "approved");
  assert.equal(back.body.expert.founding, true);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM personas WHERE expert_id = ?", id))[0].n, 1);
});

test("founding status stops at the first 100 approved experts", async () => {
  const t = await testEnv();
  const now = new Date().toISOString();
  for (let i = 0; i < FOUNDING_LIMIT - 1; i++) {
    await t.sql("INSERT INTO users (id, email, email_verified, beta_access, created_at, last_seen_at) VALUES (?, NULL, 0, 0, ?, ?)", `seed_${i}`, now, now);
    await t.sql("INSERT INTO experts (id, user_id, status, display_name, founding, created_at, updated_at) VALUES (?, ?, 'approved', ?, 1, ?, ?)", `exp_seed_${i}`, `seed_${i}`, `Seed ${i}`, now, now);
  }
  const last = await apply(t, "user_100th", { display_name: "Lena Fischer" });
  const late = await apply(t, "user_101st", { display_name: "Omar Haddad" });
  assert.equal((await review(t, last.body.expert.id, "approve")).body.expert.founding, true);
  assert.equal((await t.api("GET", "/api/experts/me", { user: "user_101st" })).body.founding.left, 0);
  const approvedLate = await review(t, late.body.expert.id, "approve");
  assert.equal(approvedLate.body.expert.status, "approved");
  assert.equal(approvedLate.body.expert.founding, false);
  assert.equal(approvedLate.body.expert.rate, 0.7);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM experts WHERE founding = 1"))[0].n, FOUNDING_LIMIT);
  const mail = await t.sql("SELECT body_text FROM notifications WHERE user_id = 'user_101st' AND kind = 'expert.approved'");
  assert.match(mail[0].body_text, /70% of the net amount/);
});
