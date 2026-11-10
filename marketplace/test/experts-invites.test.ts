// Experts module: founding invites. Ops create, list, email and revoke invites; the invited person opens a personal
// link and applies with it; invited applications go to the top of the review queue. Ops-only routes stay ops-only.
import { test, mock } from "node:test";
import assert from "node:assert/strict";

const OPS = new URL("../src/modules/ops/service.ts", import.meta.url).href;
const EVAL = new URL("../src/modules/evaluation/service.ts", import.meta.url).href;
const realOps = await import(`${OPS}?real`);
const realEval = await import(`${EVAL}?real`);
mock.module(OPS, { exports: { ...realOps, notifyOps: async () => {} } });
mock.module(EVAL, { exports: { ...realEval, winRates: async () => [] } });

const { testEnv } = await import("./helpers.ts");
const { inviteStatus, isInviteToken, newInviteToken } = await import("../src/modules/experts/invites.ts");

type T = Awaited<ReturnType<typeof testEnv>>;

const application = (over: Record<string, unknown> = {}) => ({
  display_name: "Maya Patel",
  headline: "Conversion copywriter for SaaS founders",
  areas: ["marketing"],
  job_types: ["landing-page-copy"],
  experience: "Eight years writing landing pages and launch emails for software companies. I run a two-person studio.",
  claims: [{ text: "Wrote the launch page for a scheduling app", evidence_url: "https://example.com/case-study" }],
  sample_links: [],
  country: "India",
  agree: true,
  ...over,
});

async function opsSetup(t: T) { await t.makeOps("ops_1"); }

async function invite(t: T, body: Record<string, unknown> = {}) {
  const res = await t.api("POST", "/api/ops/invites", { user: "ops_1", body: { name: "Maya Patel", areas: ["marketing"], job_types: ["landing-page-copy"], note: "Met at a meetup", ...body } });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  const token = res.body.invite.link.split("/experts/invite/")[1] as string;
  return { invite: res.body.invite, token };
}

test("invite tokens are long, random and URL-safe", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const tok = newInviteToken();
    assert.equal(tok.length, 32);
    assert.ok(isInviteToken(tok));
    assert.ok(!seen.has(tok));
    seen.add(tok);
  }
  assert.equal(isInviteToken("short"), false);
  assert.equal(isInviteToken("a".repeat(31)), false);
  assert.equal(isInviteToken(`${"a".repeat(31)}/`), false);
});

test("only ops can create, list, email or revoke invites", async () => {
  const t = await testEnv();
  await opsSetup(t);
  const { invite: inv } = await invite(t);
  for (const [method, path, body] of [
    ["GET", "/api/ops/invites", undefined],
    ["POST", "/api/ops/invites", { name: "Someone Else" }],
    ["POST", `/api/ops/invites/${inv.id}/revoke`, {}],
    ["POST", `/api/ops/invites/${inv.id}/email`, {}],
  ] as const) {
    assert.equal((await t.api(method, path, { user: "user_x", body })).status, 403, `${method} ${path} as a non-ops user`);
    assert.equal((await t.api(method, path, { body })).status, 401, `${method} ${path} signed out`);
  }
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM expert_invites"))[0].n, 1);
});

test("creating an invite checks its fields and gives a personal link", async () => {
  const t = await testEnv();
  await opsSetup(t);
  for (const [body, message] of [
    [{ name: "M" }, /name/],
    [{ name: "Maya", email: "not an email" }, /email address/],
    [{ name: "Maya", areas: ["marketing", "sales", "content", "finance"] }, /up to 3 areas/],
    [{ name: "Maya", areas: ["astrology"] }, /from the list/],
    [{ name: "Maya", job_types: ["no-such-job"] }, /not on the menu/],
  ] as const) {
    const res = await t.api("POST", "/api/ops/invites", { user: "ops_1", body });
    assert.equal(res.status, 400);
    assert.match(res.body.error.message, message);
  }
  const { invite: inv, token } = await invite(t, { email: "Maya@Example.com " });
  assert.equal(inv.status, "created");
  assert.equal(inv.email, "maya@example.com");
  assert.ok(inv.link.startsWith("https://agents.test/experts/invite/"));
  assert.ok(isInviteToken(token));
  const [ev] = await t.sql("SELECT type, data FROM events WHERE entity = 'expert_invite' AND entity_id = ?", inv.id);
  assert.equal(ev.type, "expert_invite.created");
  assert.ok(!ev.data.includes("maya@example.com"), "the event log does not copy the email");
});

test("the invite page greets the person, marks the first visit, and keeps the email and note private", async () => {
  const t = await testEnv();
  await opsSetup(t);
  const { invite: inv, token } = await invite(t, { email: "maya@example.com" });

  const res = await t.api("GET", `/api/experts/invites/${token}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.invite.first_name, "Maya");
  assert.equal(res.body.invite.name, "Maya Patel");
  assert.deepEqual(res.body.invite.areas, ["marketing"]);
  assert.deepEqual(res.body.invite.job_types, ["landing-page-copy"]);
  assert.equal(res.body.invite.state, "open");
  assert.equal(res.body.founding.left, 100);
  const text = JSON.stringify(res.body);
  assert.ok(!text.includes("maya@example.com") && !text.includes("meetup"), "email and private note are not shown");

  await t.api("GET", `/api/experts/invites/${token}`);
  const opened = await t.sql("SELECT type FROM events WHERE entity = 'expert_invite' AND entity_id = ? AND type = 'expert_invite.opened'", inv.id);
  assert.equal(opened.length, 1, "opened is recorded once");
  const list = await t.api("GET", "/api/ops/invites", { user: "ops_1" });
  assert.equal(list.body.invites[0].status, "opened");
  assert.ok(list.body.invites[0].opened_at);
  assert.equal(list.body.counts.opened, 1);

  assert.equal((await t.api("GET", `/api/experts/invites/${"x".repeat(32)}`)).status, 404);
  assert.equal((await t.api("GET", "/api/experts/invites/abc")).status, 404);
});

test("applying with an invite marks the application invited and puts it at the top of the queue", async () => {
  const t = await testEnv();
  await opsSetup(t);
  // An earlier application without an invite.
  assert.equal((await t.api("POST", "/api/experts/apply", { user: "user_early", email: "early@example.com", body: application({ display_name: "Arjun Rao" }) })).status, 201);
  const { invite: inv, token } = await invite(t);
  const res = await t.api("POST", "/api/experts/apply", { user: "user_maya", email: "maya@example.com", body: { ...application(), invite_token: token } });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  assert.equal(res.body.expert.invited, true);

  const queue = await t.api("GET", "/api/experts?status=applied", { user: "ops_1" });
  assert.deepEqual(queue.body.experts.map((e: { display_name: string }) => e.display_name), ["Maya Patel", "Arjun Rao"]);
  assert.equal(queue.body.experts[0].invited, true);
  assert.equal(queue.body.experts[1].invited, false);

  let list = await t.api("GET", "/api/ops/invites", { user: "ops_1" });
  assert.equal(list.body.invites[0].status, "applied");
  assert.equal(list.body.invites[0].expert.name, "Maya Patel");
  assert.equal((await t.api("GET", `/api/experts/invites/${token}`)).body.invite.state, "used");

  // Someone else cannot use the same invite.
  const other = await t.api("POST", "/api/experts/apply", { user: "user_other", body: { ...application({ display_name: "Ola Nord" }), invite_token: token } });
  assert.equal(other.status, 409);
  assert.equal(other.body.error.code, "invite_used");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM experts WHERE user_id = 'user_other'"))[0].n, 0, "nothing saved");

  // Approving shows on the invite.
  await t.api("POST", `/api/experts/${res.body.expert.id}/review`, { user: "ops_1", body: { decision: "approve" } });
  list = await t.api("GET", "/api/ops/invites", { user: "ops_1" });
  assert.equal(list.body.invites[0].status, "approved");
  assert.ok(list.body.invites[0].decided_at);
  assert.equal(list.body.counts.approved, 1);
  assert.equal(inv.id, list.body.invites[0].id);
});

test("a rejected invited applicant shows as rejected on the invite", async () => {
  const t = await testEnv();
  await opsSetup(t);
  const { token } = await invite(t);
  const res = await t.api("POST", "/api/experts/apply", { user: "user_maya", body: { ...application(), invite_token: token } });
  await t.api("POST", `/api/experts/${res.body.expert.id}/review`, { user: "ops_1", body: { decision: "reject", note: "Links did not open." } });
  const list = await t.api("GET", "/api/ops/invites", { user: "ops_1" });
  assert.equal(list.body.invites[0].status, "rejected");
});

test("ops can revoke an unused invite; a revoked or bad invite cannot be used", async () => {
  const t = await testEnv();
  await opsSetup(t);
  const { invite: inv, token } = await invite(t);
  const revoked = await t.api("POST", `/api/ops/invites/${inv.id}/revoke`, { user: "ops_1" });
  assert.equal(revoked.status, 200);
  assert.equal(revoked.body.invite.status, "revoked");
  assert.equal((await t.api("POST", `/api/ops/invites/${inv.id}/revoke`, { user: "ops_1" })).status, 409);
  assert.equal((await t.api("GET", `/api/experts/invites/${token}`)).body.invite.state, "revoked");
  const apply = await t.api("POST", "/api/experts/apply", { user: "user_maya", body: { ...application(), invite_token: token } });
  assert.equal(apply.status, 409);
  assert.equal(apply.body.error.code, "invite_revoked");
  const bad = await t.api("POST", "/api/experts/apply", { user: "user_maya", body: { ...application(), invite_token: "nope" } });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.code, "invite_not_valid");

  // Once someone has applied, the invite can no longer be revoked.
  const second = await invite(t, { name: "Ola Nord" });
  await t.api("POST", "/api/experts/apply", { user: "user_ola", body: { ...application({ display_name: "Ola Nord" }), invite_token: second.token } });
  const late = await t.api("POST", `/api/ops/invites/${second.invite.id}/revoke`, { user: "ops_1" });
  assert.equal(late.status, 409);
  assert.equal(late.body.error.code, "invite_used");
});

test("the invite email goes out only when ops ask, and only with an address", async () => {
  const t = await testEnv();
  await opsSetup(t);
  const { invite: noEmail } = await invite(t);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM notifications"))[0].n, 0, "creating an invite sends nothing");
  const missing = await t.api("POST", `/api/ops/invites/${noEmail.id}/email`, { user: "ops_1" });
  assert.equal(missing.status, 400);
  assert.equal(missing.body.error.code, "no_email");

  const sent: { to: string; subject: string; text: string }[] = [];
  t.env.EMAIL = { send: async (m: { to: string; subject: string; text: string }) => { sent.push(m); return { messageId: "m1" }; } } as unknown as typeof t.env.EMAIL;
  const { invite: inv, token } = await invite(t, { name: "Ola Nord", email: "ola@example.com" });
  const res = await t.api("POST", `/api/ops/invites/${inv.id}/email`, { user: "ops_1" });
  assert.equal(res.status, 200);
  assert.equal(res.body.sent, true);
  assert.ok(res.body.invite.emailed_at);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "ola@example.com");
  assert.match(sent[0].subject, /^Ola, you are invited/);
  assert.ok(sent[0].text.includes(`/experts/invite/${token}`));
  assert.doesNotMatch(sent[0].text, /\$|price|beta|early access/i);
});

test("invite status is worked out from the record", () => {
  const base = { revoked_at: null, expert_id: null, expert_status: null, applied_at: null, opened_at: null };
  assert.equal(inviteStatus(base), "created");
  assert.equal(inviteStatus({ ...base, opened_at: "x" }), "opened");
  assert.equal(inviteStatus({ ...base, opened_at: "x", applied_at: "y", expert_id: "e", expert_status: "applied" }), "applied");
  assert.equal(inviteStatus({ ...base, applied_at: "y", expert_id: "e", expert_status: "approved" }), "approved");
  assert.equal(inviteStatus({ ...base, revoked_at: "z", opened_at: "x" }), "revoked");
});
