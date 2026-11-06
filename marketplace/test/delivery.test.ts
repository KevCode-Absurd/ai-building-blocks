// Delivery module: release, accept / revise / reject / report, auto-accept, the buyer API and access rules.
// The runner and ops services are mocked (mock.module) so these tests do not depend on those modules being built.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/** A stand-in for any export: calling it rejects, reading a property gives the stand-in again, iterating gives nothing. */
function inert(name: string): any {
  const proxy: any = new Proxy(function () {}, {
    get: (_t, p) => (p === Symbol.iterator ? function* () {} : p === "then" || typeof p === "symbol" ? undefined : proxy),
    apply: () => Promise.reject(new Error(`${name} is mocked out in delivery tests`)),
  });
  return proxy;
}

/** Mocks a module: every export its source declares becomes inert, then the overrides apply. Import code under test after this. */
function mockModule(rel: string, overrides: Record<string, unknown>) {
  const url = new URL(rel, import.meta.url);
  const source = readFileSync(url, "utf8");
  const exports: Record<string, unknown> = {};
  for (const m of source.matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm)) exports[m[1]] = inert(m[1]);
  mock.module(url.href, { exports: { ...exports, ...overrides } });
}

const runCalls: any[] = [];
let runFails = false;
mockModule("../src/modules/runner/service.ts", {
  startJobRun: async (_env: unknown, input: unknown) => {
    runCalls.push(input);
    if (runFails) throw new Error("runner is down");
    return { runId: "run_mocked" };
  },
});
const opsCalls: any[] = [];
mockModule("../src/modules/ops/service.ts", { notifyOps: async (_env: unknown, notice: unknown) => { opsCalls.push(notice); } });

const { testEnv } = await import("./helpers.ts");
const { LANDING_PAGE, NOVA } = await import("./fixtures.ts");
const delivery = await import("../src/modules/delivery/service.ts");
const { applyLineDiff } = await import("../src/modules/delivery/diff.ts");

type T = Awaited<ReturnType<typeof testEnv>>;

const DRAFT = [
  "# Book grooming in two taps",
  "",
  "A scheduling app for one-person dog grooming shops.",
  "",
  "## Why groomers switch",
  "No more booking by text message.",
  "",
  "[Start your free trial](#)",
].join("\n");

let seq = 0;
/** A job with a frozen rubric, one run, one draft (not released) and a rubric score. */
async function seedJob(t: T, opts: { user?: string; status?: string; revisionsUsed?: number; createdAt?: string; title?: string } = {}) {
  const user = opts.user ?? "user_buyer";
  await t.grantBeta(user);
  const now = new Date().toISOString();
  await t.sql("INSERT OR IGNORE INTO personas (id, kind, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES (?, 'house', ?, ?, ?, ?, ?, 'live', 10, ?, ?)",
    NOVA.id, NOVA.name, NOVA.title, NOVA.tagline, NOVA.area, JSON.stringify(NOVA.profile), now, now);
  const n = ++seq;
  const jobId = `job_${n.toString().padStart(4, "0")}`, runId = `run_${n}`, draftId = `drf_${n}`;
  await t.sql(`INSERT INTO jobs (id, org_id, created_by, status, job_type_id, persona_id, title, price_cents, quote, revisions_used, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'landing-page-copy', ?, ?, 14900, ?, ?, ?, ?)`,
    jobId, `org_${user}`, user, opts.status ?? "in_review", NOVA.id, opts.title ?? "Landing page copy",
    JSON.stringify({ price_cents: 14900, breakdown: [{ label: "Landing page copy", cents: 14900 }], turnaround_hours: 24, rush: false }),
    opts.revisionsUsed ?? 0, opts.createdAt ?? now, now);
  await t.sql("INSERT INTO briefs (job_id, request_text, created_at, updated_at) VALUES (?, ?, ?, ?)", jobId, "Landing page for my grooming app.", now, now);
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", jobId, JSON.stringify(LANDING_PAGE.rubric), now, now, now);
  await t.sql("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES (?, ?, 'job', 'succeeded', ?)", runId, jobId, now);
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, ?, ?, 1, ?, 'markdown', 'fp', ?)", draftId, jobId, runId, DRAFT, now);
  await t.sql("INSERT INTO scores (id, draft_id, judge, judge_model, passed, score, result, created_at) VALUES (?, ?, 'rubric', 'fake', 1, 0.9, ?, ?)", `scr_${n}`, draftId,
    JSON.stringify({ passed: true, score: 0.9, criteria: LANDING_PAGE.rubric.map((c, i) => ({ id: c.id, pass: i !== 3, evidence: "SECRET_EVIDENCE", note: "SECRET_JUDGE_NOTE" })) }), now);
  return { jobId, draftId, runId, user };
}

async function deliveredJob(t: T, opts: Parameters<typeof seedJob>[1] = {}) {
  const ids = await seedJob(t, opts);
  await delivery.releaseDraft(t.env, { jobId: ids.jobId, draftId: ids.draftId, actor: "user_ops", actorKind: "ops" });
  return ids;
}

const job = async (t: T, id: string) => (await t.sql("SELECT * FROM jobs WHERE id = ?", id))[0];

test("release moves the job to delivered, sets the times, marks the draft and notifies the buyer", async () => {
  const t = await testEnv();
  const { jobId, draftId } = await seedJob(t);
  const before = Date.now();
  const out = await delivery.releaseDraft(t.env, { jobId, draftId, actor: "user_ops", actorKind: "ops" });
  assert.equal(out.status, "delivered");
  const row = await job(t, jobId);
  assert.ok(Date.parse(row.delivered_at) >= before - 1000);
  assert.equal(Date.parse(row.auto_accept_at) - Date.parse(row.delivered_at), 5 * 24 * 3600_000);
  const [draft] = await t.sql("SELECT released_at, released_by FROM drafts WHERE id = ?", draftId);
  assert.ok(draft.released_at);
  assert.equal(draft.released_by, "user_ops");
  const types = (await t.sql("SELECT type FROM events WHERE entity_id IN (?, ?) ORDER BY seq", jobId, draftId)).map(e => e.type);
  assert.ok(types.includes("job.delivered") && types.includes("draft.released"));
  const [n] = await t.sql("SELECT * FROM notifications WHERE user_id = 'user_buyer'");
  assert.equal(n.kind, "job.delivered");
  assert.equal(n.link, `https://agents.test/jobs/${jobId}`);
  assert.equal(n.to_email, "user_buyer@example.com");
  assert.equal(n.status, "skipped"); // no EMAIL binding in tests
  assert.match(n.body_text, /Nova finished your draft/);
  assert.doesNotMatch(`${n.subject} ${n.body_text}`, /\$|price|cents|charg|refund|credit|quote|beta|payment/i, "no money or beta words in the delivery message");
  // safe to repeat, and only from checking or in_review
  assert.equal((await delivery.releaseDraft(t.env, { jobId, draftId, actor: "user_ops", actorKind: "ops" })).status, "delivered");
  const running = await seedJob(t, { status: "running" });
  await assert.rejects(delivery.releaseDraft(t.env, { jobId: running.jobId, draftId: running.draftId, actor: "system", actorKind: "system" }), /cannot be released/);
  await assert.rejects(delivery.releaseDraft(t.env, { jobId, draftId: running.draftId, actor: "system", actorKind: "system" }), /could not find that draft/);
});

test("release emails through the EMAIL binding when it is set", async () => {
  const sent: any[] = [];
  const t = await testEnv({ EMAIL: { async send(m: unknown) { sent.push(m); return { messageId: "m1" }; } } });
  const { jobId } = await deliveredJob(t);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "user_buyer@example.com");
  assert.deepEqual(sent[0].from, { name: "AI Blocks", email: "agents@useaiblocks.com" });
  assert.equal(sent[0].subject, "Landing page copy is ready for you");
  assert.match(sent[0].text, new RegExp(`https://agents.test/jobs/${jobId}`));
  const [n] = await t.sql("SELECT status, sent_at FROM notifications");
  assert.equal(n.status, "sent");
  assert.ok(n.sent_at);
});

test("accept with a rating, a note and edits stores a line diff the edits can be rebuilt from", async () => {
  const t = await testEnv();
  const { jobId, draftId } = await deliveredJob(t);
  const edited = DRAFT.replace("No more booking by text message.", "Stop booking by text message.\nGet paid at booking.");
  const res = await t.api("POST", `/api/jobs/${jobId}/accept`, { user: "user_buyer", body: { rating: 4, note: "Good work", editedContent: edited } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.job.status, "accepted");
  const row = await job(t, jobId);
  assert.ok(row.accepted_at);
  const [d] = await t.sql("SELECT * FROM decisions WHERE job_id = ?", jobId);
  assert.equal(d.kind, "accept");
  assert.equal(d.rating, 4);
  assert.equal(d.reasons, "Good work");
  assert.equal(d.draft_id, draftId);
  const edits = JSON.parse(d.edits);
  assert.equal(edits.format, "ai-blocks-line-diff/1");
  assert.equal(edits.removed, 1);
  assert.equal(edits.added, 2);
  assert.equal(applyLineDiff(DRAFT, edits.ops), edited);
  // the view shows the decision without the diff itself
  assert.equal(res.body.decisions[0].edited, true);
  assert.deepEqual(res.body.decisions[0].editStats, { added: 2, removed: 1 });
  // no second decision, and stars are required in the API
  assert.equal((await t.api("POST", `/api/jobs/${jobId}/accept`, { user: "user_buyer", body: { rating: 5 } })).status, 409);
  const other = await deliveredJob(t);
  const noStars = await t.api("POST", `/api/jobs/${other.jobId}/accept`, { user: "user_buyer", body: {} });
  assert.equal(noStars.status, 400);
  assert.match(noStars.body.error.message, /stars/);
  // accepting without changes stores no edits
  await t.api("POST", `/api/jobs/${other.jobId}/accept`, { user: "user_buyer", body: { rating: 5, editedContent: DRAFT } });
  const [d2] = await t.sql("SELECT edits FROM decisions WHERE job_id = ?", other.jobId);
  assert.equal(d2.edits, null);
});

test("a revision moves to revising, counts it, and starts a revision run with the buyer's feedback", async () => {
  const t = await testEnv();
  runCalls.length = 0;
  const { jobId } = await deliveredJob(t);
  const edited = DRAFT.replace("# Book grooming in two taps", "# Fill your grooming calendar");
  const res = await t.api("POST", `/api/jobs/${jobId}/revise`, {
    user: "user_buyer",
    body: { reasons: "Use our price, $29 a month.", failedCriteria: ["objections", "proof_used"], editedContent: edited },
  });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const row = await job(t, jobId);
  assert.equal(row.status, "revising");
  assert.equal(row.revisions_used, 1);
  assert.equal(runCalls.length, 1);
  const call = runCalls[0];
  assert.equal(call.kind, "revision");
  assert.equal(call.jobId, jobId);
  assert.equal(call.actor, "user_buyer");
  assert.match(call.feedback, /revision 1 of 2/);
  assert.match(call.feedback, /Use our price, \$29 a month\./);
  assert.ok(call.feedback.includes(LANDING_PAGE.rubric.find(c => c.id === "objections")!.text));
  assert.ok(call.feedback.includes(LANDING_PAGE.rubric.find(c => c.id === "proof_used")!.text));
  assert.match(call.feedback, /- # Book grooming in two taps/);
  assert.match(call.feedback, /\+ # Fill your grooming calendar/);
  const [d] = await t.sql("SELECT * FROM decisions WHERE job_id = ?", jobId);
  assert.equal(d.kind, "revise");
  assert.deepEqual(JSON.parse(d.failed_criteria), ["objections", "proof_used"]);
  assert.ok(d.edits);
  // unknown checklist items and empty requests are refused
  const other = await deliveredJob(t);
  assert.equal((await t.api("POST", `/api/jobs/${other.jobId}/revise`, { user: "user_buyer", body: { failedCriteria: ["nope"] } })).status, 400);
  assert.equal((await t.api("POST", `/api/jobs/${other.jobId}/revise`, { user: "user_buyer", body: { reasons: "  " } })).status, 400);
});

test("no more revisions than revisions_allowed", async () => {
  const t = await testEnv();
  runCalls.length = 0;
  const { jobId } = await deliveredJob(t, { revisionsUsed: 2 });
  const view = await t.api("GET", `/api/jobs/${jobId}`, { user: "user_buyer" });
  assert.equal(view.body.revisionsLeft, 0);
  assert.equal(view.body.actions.revise, false);
  const res = await t.api("POST", `/api/jobs/${jobId}/revise`, { user: "user_buyer", body: { reasons: "Again please" } });
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, "no_revisions_left");
  assert.equal((await job(t, jobId)).status, "delivered");
  assert.equal(runCalls.length, 0);
});

test("if the revision run cannot start, the request is kept and ops is told", async () => {
  const t = await testEnv();
  opsCalls.length = 0;
  runFails = true;
  try {
    const { jobId } = await deliveredJob(t);
    const res = await t.api("POST", `/api/jobs/${jobId}/revise`, { user: "user_buyer", body: { reasons: "Shorter headline" } });
    assert.equal(res.status, 200);
    assert.equal((await job(t, jobId)).status, "revising");
    assert.equal(opsCalls.at(-1).kind, "job.revision_not_started");
  } finally { runFails = false; }
});

test("reject and report a problem alert ops and write their records", async () => {
  const t = await testEnv();
  opsCalls.length = 0;
  const a = await deliveredJob(t);
  const rej = await t.api("POST", `/api/jobs/${a.jobId}/reject`, { user: "user_buyer", body: { reasons: "Wrong product entirely", failedCriteria: ["clear_offer"] } });
  assert.equal(rej.status, 200, JSON.stringify(rej.body));
  assert.equal((await job(t, a.jobId)).status, "rejected");
  const [d] = await t.sql("SELECT * FROM decisions WHERE job_id = ?", a.jobId);
  assert.equal(d.kind, "reject");
  assert.equal(d.reasons, "Wrong product entirely");
  assert.equal(opsCalls.length, 1);
  assert.equal(opsCalls[0].kind, "job.rejected");
  assert.equal(opsCalls[0].link, `/ops/jobs/${a.jobId}`);
  assert.match(opsCalls[0].text, /Wrong product entirely/);
  assert.equal((await t.api("POST", `/api/jobs/${a.jobId}/reject`, { user: "user_buyer", body: {} })).status, 400);

  const b = await deliveredJob(t);
  assert.equal((await t.api("POST", `/api/jobs/${b.jobId}/report`, { user: "user_buyer", body: {} })).status, 400);
  const rep = await t.api("POST", `/api/jobs/${b.jobId}/report`, { user: "user_buyer", body: { reasons: "It quotes reviews we never had." } });
  assert.equal(rep.status, 200, JSON.stringify(rep.body));
  assert.equal(rep.body.job.status, "disputed");
  const [r] = await t.sql("SELECT * FROM problem_reports WHERE job_id = ?", b.jobId);
  assert.equal(r.reasons, "It quotes reviews we never had.");
  assert.equal(r.draft_id, b.draftId);
  assert.equal(r.status, "open");
  assert.equal(opsCalls.at(-1).kind, "job.disputed");
  assert.ok((await t.sql("SELECT 1 FROM events WHERE entity_id = ? AND type = 'job.disputed'", b.jobId)).length);
  assert.equal(rep.body.timeline.at(-1).label, "You reported a problem");
});

test("the cron accepts delivered jobs once auto_accept_at has passed", async () => {
  const t = await testEnv();
  const due = await deliveredJob(t);
  const fresh = await deliveredJob(t);
  await t.sql("UPDATE jobs SET auto_accept_at = ? WHERE id = ?", new Date(Date.now() - 60_000).toISOString(), due.jobId);
  await t.scheduled();
  const row = await job(t, due.jobId);
  assert.equal(row.status, "accepted");
  assert.ok(row.accepted_at);
  const [d] = await t.sql("SELECT * FROM decisions WHERE job_id = ?", due.jobId);
  assert.equal(d.kind, "auto_accept");
  assert.equal(d.created_by, "system");
  assert.equal(d.draft_id, due.draftId);
  assert.equal((await job(t, fresh.jobId)).status, "delivered");
  assert.ok((await t.sql("SELECT 1 FROM notifications WHERE kind = 'job.auto_accepted'")).length);
  assert.equal(await delivery.autoAcceptDue(t.env), 0);
  const view = await t.api("GET", `/api/jobs/${due.jobId}`, { user: "user_buyer" });
  assert.equal(view.body.timeline.at(-1).label, "Accepted for you after 5 days");
});

test("buyers cannot see other orgs' jobs or drafts that are not released", async () => {
  const t = await testEnv();
  const mine = await seedJob(t, { status: "in_review" });
  const theirs = await deliveredJob(t, { user: "user_other" });
  await t.grantBeta("user_buyer");
  // list only shows my org
  const list = await t.api("GET", "/api/jobs", { user: "user_buyer" });
  assert.deepEqual(list.body.jobs.map((j: any) => j.id), [mine.jobId]);
  // someone else's job: 404 for reading and for every action
  assert.equal((await t.api("GET", `/api/jobs/${theirs.jobId}`, { user: "user_buyer" })).status, 404);
  for (const action of ["accept", "revise", "reject", "report"]) {
    const res = await t.api("POST", `/api/jobs/${theirs.jobId}/${action}`, { user: "user_buyer", body: { rating: 5, reasons: "x" } });
    assert.equal(res.status, 404, action);
  }
  assert.equal((await job(t, theirs.jobId)).status, "delivered");
  // my job before release: no draft content, no judge notes, no actions
  const view = await t.api("GET", `/api/jobs/${mine.jobId}`, { user: "user_buyer" });
  assert.equal(view.status, 200);
  assert.deepEqual(view.body.drafts, []);
  assert.equal(view.body.actions.accept, false);
  assert.ok(!JSON.stringify(view.body).includes("Book grooming in two taps"));
  assert.equal((await t.api("POST", `/api/jobs/${mine.jobId}/accept`, { user: "user_buyer", body: { rating: 5 } })).status, 409);
  // signed-out callers get nothing
  assert.equal((await t.api("GET", "/api/jobs")).status, 401);
  assert.equal((await t.api("GET", `/api/jobs/${mine.jobId}`)).status, 401);
});

test("the buyer view shows released drafts with pass marks only, the timeline and what happens next", async () => {
  const t = await testEnv();
  const { jobId, draftId } = await seedJob(t, { status: "checking" });
  await t.sql("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) VALUES (?, 'ops', 'ops', 'job', ?, 'job.note', '{\"note\":\"INTERNAL_OPS_NOTE\"}')", new Date().toISOString(), jobId);
  await delivery.releaseDraft(t.env, { jobId, draftId, actor: "system", actorKind: "system" });
  const res = await t.api("GET", `/api/jobs/${jobId}`, { user: "user_buyer" });
  assert.equal(res.status, 200);
  const v = res.body;
  assert.equal(v.job.status, "delivered");
  assert.equal(v.job.statusLabel, "Ready for you");
  assert.equal(v.persona.name, "Nova");
  assert.equal(v.persona.portrait, "/agents/nova-seo.webp");
  assert.equal(v.drafts.length, 1);
  assert.equal(v.drafts[0].content, DRAFT);
  assert.equal(v.drafts[0].check.criteria.length, 5);
  assert.deepEqual(Object.keys(v.drafts[0].check.criteria[0]).sort(), ["id", "pass"]);
  assert.equal(v.drafts[0].check.criteria[3].pass, false);
  assert.equal(v.criteria.length, 5);
  assert.equal(v.criteria[0].pass_rule, undefined);
  const text = JSON.stringify(v);
  for (const secret of ["SECRET_EVIDENCE", "SECRET_JUDGE_NOTE", "INTERNAL_OPS_NOTE", "user_ops"]) assert.ok(!text.includes(secret), secret);
  assert.deepEqual(v.timeline.map((e: any) => e.label), ["Draft ready for you"]);
  assert.equal(v.next.title, "Your draft is ready");
  assert.deepEqual(v.actions, { accept: true, revise: true, reject: true, report: true });
  assert.equal(v.revisionsLeft, 2);
  assert.equal(v.orderAgain, "/new?persona=nova-seo&job=landing-page-copy");
  // Old jobs may still have a price in the database; buyers never see it. Hiring is free.
  assert.equal(v.quote, undefined);
  assert.deepEqual(v.plan, { turnaroundHours: 24, faster: false });
  for (const key of ["priceCents", "currency", "paymentStatus"]) assert.equal(key in v.job, false, key);
  assert.doesNotMatch(JSON.stringify({ ...v, drafts: undefined, request: undefined }), /\$|price|cents|charg|refund|credit|quote|beta|payment/i);
  assert.equal(v.request, "Landing page for my grooming app.");
});

test("job list: newest first, plain labels, persona and job type", async () => {
  const t = await testEnv();
  const old = await seedJob(t, { createdAt: "2026-01-01T00:00:00.000Z", title: "Old job" });
  const recent = await deliveredJob(t, { createdAt: "2026-02-01T00:00:00.000Z", title: "" });
  const res = await t.api("GET", "/api/jobs", { user: "user_buyer" });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.jobs.map((j: any) => j.id), [recent.jobId, old.jobId]);
  const top = res.body.jobs[0];
  assert.equal(top.title, "Landing page copy"); // falls back to the job type title
  assert.equal(top.status, "delivered");
  assert.equal(top.statusLabel, "Ready for you");
  assert.equal(top.needsYou, true);
  assert.equal(top.href, `/jobs/${recent.jobId}`);
  assert.equal(top.persona.name, "Nova");
  assert.equal(top.jobType.title, "Landing page copy");
  assert.equal("priceCents" in top, false, "the jobs list shows no price");
  assert.doesNotMatch(JSON.stringify(res.body.jobs), /\$|price|cents|charg|refund|credit|quote|beta|payment/i);
  assert.equal(res.body.jobs[1].statusLabel, "Final check");
});

test("notifications: the caller's own, newest first, with in-app paths", async () => {
  const t = await testEnv();
  const { jobId } = await deliveredJob(t);
  await deliveredJob(t, { user: "user_other" });
  const res = await t.api("GET", "/api/notifications", { user: "user_buyer" });
  assert.equal(res.status, 200);
  assert.equal(res.body.notifications.length, 1);
  assert.equal(res.body.notifications[0].path, `/jobs/${jobId}`);
  assert.equal(res.body.notifications[0].kind, "job.delivered");
});
