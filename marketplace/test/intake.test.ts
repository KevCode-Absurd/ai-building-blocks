// Intake: request -> job type -> questions -> rubric and plan -> started job. Hiring is free: no price anywhere.
// The runner and ops services are mocked, so these tests check intake alone (run with --experimental-test-module-mocks).
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { JobType, Persona } from "../src/core/types.ts";
import { BLOG_POST, FIXTURE_JOB_TYPES, LANDING_PAGE, NOVA } from "./fixtures.ts";

// ---------- Mocks (before anything imports the app) ----------

/** Value exports of a module, read from its source, so the mock keeps every name other modules import. */
function stubExports(rel: string): Record<string, unknown> {
  const src = readFileSync(new URL(rel, import.meta.url), "utf8");
  const out: Record<string, unknown> = {};
  for (const m of src.matchAll(/export\s+(?:async\s+)?(function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)\s*(=\s*(.))?/g)) {
    const [, kind, name, , start] = m;
    if (kind === "function" || kind === "function*" || kind === "class" || start === "(" || start === "a") out[name] = async () => { throw new Error(`${name} is mocked out in the intake tests`); };
    else out[name] = start === "[" ? [] : start === "{" ? {} : start === "\"" || start === "'" || start === "`" ? "" : /\d/.test(start ?? "") ? 0 : null;
  }
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name && !name.startsWith("type ") && !(name in out)) out[name] = null;
    }
  }
  return out;
}

const runnerCalls: { jobId: string; actor: string; actorKind: string; kind?: string }[] = [];
let runnerFails = false;
mock.module(new URL("../src/modules/runner/service.ts", import.meta.url).href, {
  exports: {
    ...stubExports("../src/modules/runner/service.ts"),
    startJobRun: async (_env: unknown, input: { jobId: string; actor: string; actorKind: string; kind?: string }) => {
      runnerCalls.push(input);
      if (runnerFails) throw new Error("No live agent for this job type.");
      return { runId: "run_test" };
    },
  },
});

const opsCalls: { kind: string; subject: string; text: string; link?: string }[] = [];
mock.module(new URL("../src/modules/ops/service.ts", import.meta.url).href, {
  exports: {
    ...stubExports("../src/modules/ops/service.ts"),
    notifyOps: async (_env: unknown, notice: { kind: string; subject: string; text: string; link?: string }) => { opsCalls.push(notice); },
  },
});

const { testEnv } = await import("./helpers.ts");
const { registerFake } = await import("../src/core/models.ts");
const { planFor, fasterHours } = await import("../src/modules/intake/plan.ts");
const { classifyPrompt, extractPrompt } = await import("../src/modules/intake/prompts.ts");
const { fakeClassify, fakeExtract } = await import("../src/modules/intake/fakes.ts");
type TestEnv = Awaited<ReturnType<typeof testEnv>>;

// ---------- Helpers ----------

const BUYER = "user_a";
const LANDING_TEXT = "We need a landing page for dog groomers. Our scheduling app costs $29 a month.\nVisitors should Book a call.";

async function setup(catalogue?: JobType[]): Promise<TestEnv> {
  runnerCalls.length = 0;
  opsCalls.length = 0;
  runnerFails = false;
  const t = await testEnv({}, catalogue ? { catalogue } : {});
  await t.grantBeta(BUYER);
  return t;
}

async function addPersona(t: TestEnv, p: Persona = NOVA, status: "live" | "hidden" = "live") {
  await t.sql("INSERT INTO personas (id, kind, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES (?, 'house', ?, ?, ?, ?, ?, ?, ?, 'x', 'x')",
    p.id, p.name, p.title, p.tagline, p.area, JSON.stringify(p.profile), status, p.sort);
}

async function start(t: TestEnv, body: Record<string, unknown>, user = BUYER) {
  return t.api("POST", "/api/requests", { user, body });
}

async function quotedLanding(t: TestEnv, planBody: Record<string, unknown> = {}, user = BUYER) {
  const created = await start(t, { text: LANDING_TEXT }, user);
  assert.equal(created.status, 201, JSON.stringify(created.body));
  assert.equal(created.body.request.ready, true, JSON.stringify(created.body.request.questions));
  const id = created.body.request.id as string;
  const quoted = await t.api("POST", `/api/requests/${id}/plan`, { user, body: planBody });
  assert.equal(quoted.status, 200, JSON.stringify(quoted.body));
  return { id, quoted };
}

/** Money and beta words a buyer must never see in a request view or message. */
const MONEY = /\$|price|quote|charg|refund|credit|beta|fixed fee|\bpaid\b|\bpay\b/i;
/** The view a buyer sees, minus the internal status id "quoted" and the request's own words (they may name prices). */
const shown = (view: any) => JSON.stringify({ ...view, status: undefined, request_text: undefined, details: undefined, title: undefined });

// ---------- Access ----------

test("requests need sign-in, and an invite code while INVITE_ONLY is on", async () => {
  const t = await setup();
  assert.equal((await t.api("POST", "/api/requests", { body: { text: LANDING_TEXT } })).status, 401);
  const noBeta = await start(t, { text: LANDING_TEXT }, "user_nobeta");
  assert.equal(noBeta.status, 403);
  assert.equal(noBeta.body.error.code, "beta_access_required");
  assert.equal(noBeta.body.error.message, "Hiring needs an invite code right now. Enter your code to hire an agent.");
  const { id } = await quotedLanding(t);
  assert.equal((await t.api("GET", `/api/requests/${id}`, { user: "user_nobeta" })).status, 403);
  assert.equal((await t.api("POST", `/api/requests/${id}/confirm`, { user: "user_nobeta" })).status, 403);
});

test("open hiring: with INVITE_ONLY off, anyone signed in can ask, see the plan and start, with no code", async () => {
  runnerCalls.length = 0;
  const t = await testEnv({ INVITE_ONLY: "false" });
  assert.equal((await t.api("POST", "/api/requests", { body: { text: LANDING_TEXT } })).status, 401, "still needs sign-in");
  const me = await t.api("GET", "/api/me", { user: "user_new" });
  assert.equal(me.body.betaAccess, true);
  const { id, quoted } = await quotedLanding(t, {}, "user_new");
  assert.equal(quoted.body.request.status, "quoted");
  const started = await t.api("POST", `/api/requests/${id}/start`, { user: "user_new", body: {} });
  assert.equal(started.status, 200, JSON.stringify(started.body));
  assert.equal(started.body.job.status, "confirmed");
  const [job] = await t.sql("SELECT price_cents, payment_status FROM jobs WHERE id = ?", id);
  assert.deepEqual(job, { price_cents: null, payment_status: "not_required" });
  const [user] = await t.sql("SELECT beta_access FROM users WHERE id = 'user_new'");
  assert.equal(user.beta_access, 0, "no invite code was needed");
});

test("buyers cannot see or act on another org's job; ops can see it", async () => {
  const t = await setup();
  await t.grantBeta("user_b");
  const { id } = await quotedLanding(t);
  for (const [method, path, body] of [
    ["GET", `/api/requests/${id}`, undefined],
    ["POST", `/api/requests/${id}/answers`, { answers: { sections: 6 } }],
    ["POST", `/api/requests/${id}/quote`, { rush: true }],
    ["POST", `/api/requests/${id}/confirm`, {}],
  ] as const) {
    const res = await t.api(method, path, { user: "user_b", body });
    assert.equal(res.status, 404, `${method} ${path}`);
    assert.equal(res.body.error.code, "job_not_found");
  }
  const [job] = await t.sql("SELECT status, price_cents FROM jobs WHERE id = ?", id);
  assert.deepEqual(job, { status: "quoted", price_cents: null });
  assert.equal(runnerCalls.length, 0);
  await t.makeOps("user_ops");
  assert.equal((await t.api("GET", `/api/requests/${id}`, { user: "user_ops" })).status, 200);
});

test("a request needs a few words", async () => {
  const t = await setup();
  const res = await start(t, { text: "help" });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, "request_too_short");
  assert.equal((await start(t, {})).status, 400);
});

// ---------- Classification ----------

test("a clear request is matched to a job type and keeps the buyer's words verbatim", async () => {
  const t = await setup();
  const text = `  ${LANDING_TEXT}  \n`;
  const res = await start(t, { text });
  assert.equal(res.status, 201);
  const r = res.body.request;
  assert.equal(r.status, "draft");
  assert.equal(r.job_type.id, "landing-page-copy");
  assert.equal(r.open_request, false);
  assert.deepEqual(r.questions, []);
  assert.equal(r.ready, true);
  assert.equal(r.request_text, text);
  const [brief] = await t.sql("SELECT request_text, spec, classification FROM briefs WHERE job_id = ?", r.id);
  assert.equal(brief.request_text, text);
  const classification = JSON.parse(brief.classification);
  assert.equal(classification.job_type_id, "landing-page-copy");
  assert.ok(classification.confidence >= 0.55);
  const spec = JSON.parse(brief.spec);
  assert.equal(spec.audience, "dog groomers");
  assert.equal(spec.goal, "Book a call");
  assert.equal(spec.sections, undefined, "nothing invented");
  const [job] = await t.sql("SELECT status, job_type_id, persona_id, source, created_by FROM jobs WHERE id = ?", r.id);
  assert.deepEqual(job, { status: "draft", job_type_id: "landing-page-copy", persona_id: null, source: "web", created_by: BUYER });
  const events = await t.sql("SELECT type FROM events WHERE entity = 'job' AND entity_id = ?", r.id);
  assert.deepEqual(events.map(e => e.type), ["job.created"]);
  assert.equal(opsCalls.length, 0);
});

test("an unclear request becomes an open request, alerts ops, and the buyer can pick a job", async () => {
  const t = await setup();
  const res = await start(t, { text: "Can you help me sort out my garden shed this weekend please?" });
  assert.equal(res.status, 201);
  const r = res.body.request;
  assert.equal(r.open_request, true);
  assert.equal(r.job_type, null);
  assert.equal(r.status, "draft");
  assert.deepEqual(r.questions, []);
  assert.equal(r.ready, false);
  const [job] = await t.sql("SELECT job_type_id FROM jobs WHERE id = ?", r.id);
  assert.equal(job.job_type_id, null);
  assert.equal(opsCalls.length, 1);
  assert.equal(opsCalls[0].kind, "intake.open_request");
  assert.equal(opsCalls[0].link, `/ops/jobs/${r.id}`);
  assert.equal((await t.sql("SELECT 1 FROM events WHERE entity_id = ? AND type = 'job.open_request'", r.id)).length, 1);

  const plan = await t.api("POST", `/api/requests/${r.id}/plan`, { user: BUYER, body: {} });
  assert.equal(plan.status, 409);
  assert.equal(plan.body.error.code, "job_type_needed");

  const picked = await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { jobTypeId: "seo-blog-post" } });
  assert.equal(picked.status, 200, JSON.stringify(picked.body));
  assert.equal(picked.body.request.job_type.id, "seo-blog-post");
  assert.deepEqual(picked.body.request.questions.map((q: any) => q.field_id), ["topic", "audience"]);
  assert.equal((await t.sql("SELECT 1 FROM events WHERE entity_id = ? AND type = 'job.job_type_set'", r.id)).length, 1);
});

test("low confidence, unknown ids, bad replies and model errors all become open requests", async () => {
  const t = await setup();
  const replies: (() => { data?: unknown; text?: string })[] = [
    () => ({ data: { job_type_id: "landing-page-copy", confidence: 0.4, reason: "Maybe a landing page.", alternatives: ["seo-blog-post", "made-up-job"] } }),
    () => ({ data: { job_type_id: "made-up-job", confidence: 0.9, reason: "x", alternatives: [] } }),
    () => ({ data: { pick: "landing-page-copy" } }),
    () => { throw new Error("provider down"); },
  ];
  for (const [i, reply] of replies.entries()) {
    registerFake("intake.classify", reply);
    const res = await start(t, { text: `A page for something, version ${i}.` });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.equal(res.body.request.open_request, true, `reply ${i}`);
    if (i === 0) assert.deepEqual(res.body.request.alternatives.map((a: any) => a.id), ["landing-page-copy", "seo-blog-post"]);
  }
  assert.equal(opsCalls.length, replies.length);
});

test("a persona and job type skip classification and are stored on the job", async () => {
  const t = await setup();
  await addPersona(t);
  const res = await start(t, { text: "An article about how often to groom a dog, for dog owners.", personaId: "nova-seo", jobTypeId: "seo-blog-post" });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  const r = res.body.request;
  assert.equal(r.job_type.id, "seo-blog-post");
  assert.deepEqual(r.persona, { id: "nova-seo", name: "Nova", title: "SEO strategist" });
  assert.equal(r.ready, true);
  const [job] = await t.sql("SELECT persona_id, job_type_id, title FROM jobs WHERE id = ?", r.id);
  assert.equal(job.persona_id, "nova-seo");
  assert.equal(job.job_type_id, "seo-blog-post");
  assert.ok(job.title.startsWith("SEO blog post"));
  const purposes = (await t.sql("SELECT purpose FROM model_calls WHERE job_id = ?", r.id)).map(c => c.purpose);
  assert.deepEqual(purposes, ["intake.extract"]);
  const [brief] = await t.sql("SELECT classification FROM briefs WHERE job_id = ?", r.id);
  assert.equal(JSON.parse(brief.classification).confidence, 1);

  // A persona without a job type still sorts the request.
  const sorted = await start(t, { text: "I need a blog post for dog owners about grooming.", personaId: "nova-seo" });
  assert.equal(sorted.body.request.job_type.id, "seo-blog-post");
  assert.ok((await t.sql("SELECT 1 FROM model_calls WHERE job_id = ? AND purpose = 'intake.classify'", sorted.body.request.id)).length);

  const unknown = await start(t, { text: "An article about dogs for owners.", personaId: "nobody" });
  assert.equal(unknown.status, 404);
  assert.equal(unknown.body.error.code, "agent_not_found");
  await addPersona(t, { ...NOVA, id: "hidden-one" }, "hidden");
  assert.equal((await start(t, { text: "An article about dogs for owners.", personaId: "hidden-one" })).status, 404);
  const badJob = await start(t, { text: "An article about dogs for owners.", jobTypeId: "not-a-job" });
  assert.equal(badJob.status, 400);
  assert.equal(badJob.body.error.code, "job_type_not_found");
});

// ---------- Questions and answers ----------

const BIG: JobType = {
  ...LANDING_PAGE,
  id: "big-brief",
  title: "Big brief",
  keywords: ["big brief"],
  spec_fields: [
    { id: "brand", label: "Brand name", type: "text", required: true, max: 100 },
    { id: "tone", label: "Tone", type: "choice", required: true, options: ["Friendly", "Formal"] },
    { id: "pages", label: "Number of pages", type: "number", required: true, max: 20 },
    { id: "channels", label: "Where it will run", type: "multichoice", required: true, options: ["Email", "Web"] },
    { id: "competitors", label: "Competitors", type: "list", required: true, max: 5 },
  ],
  price: { base_usd: 100, min_usd: 50, max_usd: 300, rush_multiplier: 1.5 },
};

test("at most three questions, in plain words, with options for choice fields", async () => {
  const t = await setup([...FIXTURE_JOB_TYPES, BIG]);
  const res = await start(t, { text: "Please write a big brief for my company." });
  const r = res.body.request;
  assert.equal(r.job_type.id, "big-brief");
  assert.equal(r.questions.length, 3);
  assert.deepEqual(r.questions.map((q: any) => q.field_id), ["brand", "tone", "pages"]);
  assert.ok(r.questions.every((q: any) => q.question.endsWith("?")));
  assert.equal(r.questions[2].question, "How many pages?");
  assert.deepEqual(r.questions[1].options, ["Friendly", "Formal"]);
  assert.equal(r.questions[1].type, "choice");

  const bad = await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { answers: { tone: "Loud", pages: "many" } } });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.code, "invalid_answer");
  assert.match(bad.body.error.message, /Pick one of the options/);

  const partial = await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { answers: { brand: "Acme", tone: "friendly" } } });
  assert.deepEqual(partial.body.request.questions.map((q: any) => q.field_id), ["pages"]);
  assert.equal(partial.body.request.ready, false);
  const early = await t.api("POST", `/api/requests/${r.id}/plan`, { user: BUYER, body: {} });
  assert.equal(early.status, 409);
  assert.equal(early.body.error.code, "questions_open");
  assert.doesNotMatch(early.body.error.message, MONEY);

  const done = await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { answers: { pages: "4" } } });
  assert.equal(done.body.request.ready, true, "no more than three questions in total");
  assert.deepEqual(done.body.request.questions, []);
  const [brief] = await t.sql("SELECT spec, answers FROM briefs WHERE job_id = ?", r.id);
  assert.deepEqual(JSON.parse(brief.spec), { brand: "Acme", tone: "Friendly", pages: 4 });
  assert.deepEqual(JSON.parse(brief.answers), { brand: "Acme", tone: "Friendly", pages: 4 });
  assert.equal((await t.sql("SELECT 1 FROM events WHERE entity_id = ? AND type = 'job.answered'", r.id)).length, 2);
});

test("extraction never keeps numbers or links the buyer did not write", async () => {
  const t = await setup();
  registerFake("intake.extract", () => ({ data: { fields: { product: "A scheduling app", audience: "dog groomers", goal: "Sign up", sections: 9, proof: ["4.8 stars"] } } }));
  const res = await start(t, { text: "A landing page for our scheduling app, aimed at dog groomers. Goal: sign up." });
  const [brief] = await t.sql("SELECT spec FROM briefs WHERE job_id = ?", res.body.request.id);
  const spec = JSON.parse(brief.spec);
  assert.equal(spec.sections, undefined, "9 is not in the request");
  assert.equal(spec.goal, "Sign up");
  assert.deepEqual(spec.proof, ["4.8 stars"]);
});

// ---------- The plan ----------

test("plan: turnaround, faster delivery only when offered, and never a price", () => {
  const plain = planFor(LANDING_PAGE, false);
  assert.deepEqual(plain, { turnaround_hours: 24, faster: false, faster_available: true });
  const faster = planFor(LANDING_PAGE, true);
  assert.deepEqual(faster, { turnaround_hours: 12, faster: true, faster_available: true });
  const none = planFor({ ...LANDING_PAGE, price: { base_usd: 50, min_usd: 50, max_usd: 50, rush_multiplier: 1 } }, true);
  assert.deepEqual(none, { turnaround_hours: 24, faster: false, faster_available: false }, "no faster delivery when the job does not offer it");
  assert.equal(fasterHours(1), 1);
  assert.equal(fasterHours(5), 3);
  for (const p of [plain, faster, none]) assert.doesNotMatch(JSON.stringify(p), /price|cents|usd/i);
});

// ---------- Plan and start ----------

test("the plan writes the rubric and no price; starting freezes the rubric and starts the run", async () => {
  const t = await setup();
  const goals = "Mention our 14-day free trial. Keep it under 600 words; Must not name competitors. Use British spelling.";
  const { id, quoted } = await quotedLanding(t, { goals });
  const r = quoted.body.request;
  const q = r.plan;
  assert.equal(r.status, "quoted");
  assert.equal(r.status_label, "Plan ready");
  assert.equal(q.deliverable, LANDING_PAGE.deliverable);
  assert.equal(q.turnaround_hours, 24);
  assert.equal(q.faster, false);
  assert.deepEqual(q.faster_option, { faster: true, turnaround_hours: 12 });
  assert.equal(q.checklist.length, 8);
  assert.equal(q.goals, goals);
  assert.equal(r.job_type.faster_available, true);
  // Nothing priced reaches the buyer.
  for (const key of ["price_cents", "price", "breakdown", "currency", "rush_option"]) assert.equal(key in q, false, key);
  assert.equal("price_from_usd" in r.job_type, false);
  assert.equal("quote" in r, false);
  assert.doesNotMatch(shown(r), MONEY);

  const [job] = await t.sql("SELECT status, price_cents, payment_status, quote, quote_expires_at, catalogue_version, title, turnaround_hours FROM jobs WHERE id = ?", id);
  assert.equal(job.status, "quoted");
  assert.equal(job.price_cents, null, "hiring is free: no price is set");
  assert.equal(job.payment_status, "not_required");
  assert.ok(job.catalogue_version);
  assert.equal(job.title, "Landing page copy: dog groomers");
  const hoursLeft = (Date.parse(job.quote_expires_at) - Date.now()) / 3600_000;
  assert.ok(hoursLeft > 167.9 && hoursLeft <= 168, `expires in ${hoursLeft}h`);
  const stored = JSON.parse(job.quote);
  assert.equal(stored.price_cents, 0);
  assert.deepEqual(stored.breakdown, []);
  const [quotedEvent] = await t.sql("SELECT data FROM events WHERE entity_id = ? AND type = 'job.quoted'", id);
  assert.equal("price_cents" in JSON.parse(quotedEvent.data), false);

  const [rubric] = await t.sql("SELECT criteria, frozen_at FROM rubrics WHERE job_id = ?", id);
  assert.equal(rubric.frozen_at, null);
  const criteria = JSON.parse(rubric.criteria);
  assert.equal(criteria.length, 8);
  assert.deepEqual(criteria.slice(0, 5).map((c: any) => c.id), LANDING_PAGE.rubric.map(c => c.id));
  const buyer = criteria.filter((c: any) => c.source === "buyer");
  assert.equal(buyer.length, 3, "at most three buyer criteria");
  for (const c of buyer) {
    assert.ok(Number.isInteger(c.weight) && c.weight >= 1 && c.weight <= 5);
    assert.ok(c.pass_rule.length >= 15);
  }
  assert.equal(buyer[2].critical, true, "a 'must' goal is critical");

  // Buyer-safe: no baseline prompt, no hidden briefs.
  const raw = JSON.stringify(quoted.body);
  assert.ok(!raw.includes(LANDING_PAGE.baseline_prompt));
  for (const b of LANDING_PAGE.sample_briefs.filter(b => b.visibility === "hidden")) assert.ok(!raw.includes(b.text));

  // Faster delivery toggle: half the time, still no price, same buyer criteria, no second rubric call.
  const rushed = await t.api("POST", `/api/requests/${id}/plan`, { user: BUYER, body: { faster: true } });
  assert.equal(rushed.status, 200);
  assert.equal(rushed.body.request.plan.faster, true);
  assert.equal(rushed.body.request.plan.turnaround_hours, 12);
  assert.deepEqual(rushed.body.request.plan.faster_option, { faster: false, turnaround_hours: 24 });
  assert.equal(rushed.body.request.plan.goals, goals);
  assert.equal((await t.sql("SELECT 1 FROM model_calls WHERE job_id = ? AND purpose = 'intake.rubric'", id)).length, 1);
  assert.equal((await t.sql("SELECT 1 FROM events WHERE entity_id = ? AND type = 'job.requoted'", id)).length, 1);
  assert.equal((await t.sql("SELECT price_cents FROM jobs WHERE id = ?", id))[0].price_cents, null);

  const confirmed = await t.api("POST", `/api/requests/${id}/start`, { user: BUYER, body: {} });
  assert.equal(confirmed.status, 200, JSON.stringify(confirmed.body));
  assert.equal(confirmed.body.next, `/jobs/${id}`);
  assert.equal(confirmed.body.job.status, "confirmed");
  assert.equal("price_cents" in confirmed.body.job, false);
  assert.deepEqual(runnerCalls, [{ jobId: id, actor: BUYER, actorKind: "user", kind: "job" }]);
  const [after] = await t.sql("SELECT status, due_at, price_cents, payment_status FROM jobs WHERE id = ?", id);
  assert.equal(after.status, "confirmed");
  assert.equal(after.price_cents, null);
  assert.equal(after.payment_status, "not_required");
  const [confirmedEvent] = await t.sql("SELECT data FROM events WHERE entity_id = ? AND type = 'job.confirmed'", id);
  assert.equal("price_cents" in JSON.parse(confirmedEvent.data), false);
  const dueIn = (Date.parse(after.due_at) - Date.now()) / 3600_000;
  assert.ok(dueIn > 11.9 && dueIn <= 12, `due in ${dueIn}h`);
  const [frozen] = await t.sql("SELECT frozen_at FROM rubrics WHERE job_id = ?", id);
  assert.ok(frozen.frozen_at);
  await assert.rejects(t.sql("UPDATE rubrics SET criteria = '[]' WHERE job_id = ?", id), /rubric_frozen/);

  // Started: the details are fixed; a second click changes nothing.
  const replan = await t.api("POST", `/api/requests/${id}/plan`, { user: BUYER, body: { faster: false } });
  assert.equal(replan.status, 409);
  assert.doesNotMatch(replan.body.error.message, MONEY);
  const locked = await t.api("POST", `/api/requests/${id}/answers`, { user: BUYER, body: { answers: { sections: 6 } } });
  assert.equal(locked.status, 409);
  assert.equal(locked.body.error.code, "request_locked");
  assert.doesNotMatch(locked.body.error.message, MONEY);
  assert.equal((await t.api("POST", `/api/requests/${id}/confirm`, { user: BUYER })).status, 200);
  assert.equal(runnerCalls.length, 1);
});

test("the older /quote and /confirm addresses and the rush flag still work", async () => {
  const t = await setup();
  const created = await start(t, { text: LANDING_TEXT });
  const id = created.body.request.id;
  const quoted = await t.api("POST", `/api/requests/${id}/quote`, { user: BUYER, body: { rush: true } });
  assert.equal(quoted.status, 200, JSON.stringify(quoted.body));
  assert.equal(quoted.body.request.plan.faster, true);
  assert.equal(quoted.body.request.plan.turnaround_hours, 12);
  const bad = await t.api("POST", `/api/requests/${id}/plan`, { user: BUYER, body: { faster: "yes" } });
  assert.equal(bad.status, 400);
  const confirmed = await t.api("POST", `/api/requests/${id}/confirm`, { user: BUYER, body: {} });
  assert.equal(confirmed.status, 200);
  const dueIn = (Date.parse(confirmed.body.job.due_at) - Date.now()) / 3600_000;
  assert.ok(dueIn > 11.9 && dueIn <= 12, `due in ${dueIn}h`);
});

test("a job type without faster delivery offers no faster option", async () => {
  const slow: JobType = { ...LANDING_PAGE, price: { ...LANDING_PAGE.price, rush_multiplier: 1 } };
  const t = await setup([slow, BLOG_POST]);
  const { quoted } = await quotedLanding(t, { faster: true });
  assert.equal(quoted.body.request.job_type.faster_available, false);
  assert.equal(quoted.body.request.plan.faster, false);
  assert.equal(quoted.body.request.plan.faster_option, null);
  assert.equal(quoted.body.request.plan.turnaround_hours, 24);
});

test("answering after the plan is ready sends the job back to draft for a new plan", async () => {
  const t = await setup();
  const created = await start(t, { text: "We need a landing page for dog groomers. Our app costs $29 a month." });
  const r = created.body.request;
  assert.deepEqual(r.questions.map((q: any) => q.field_id), ["goal"]);
  assert.deepEqual(r.questions[0].options, LANDING_PAGE.spec_fields.find(f => f.id === "goal")!.options);
  await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { answers: { goal: "Sign up" } } });
  const quoted = await t.api("POST", `/api/requests/${r.id}/plan`, { user: BUYER, body: { goals: "Mention the free trial." } });
  assert.equal(quoted.body.request.status, "quoted");
  assert.equal(quoted.body.request.plan.turnaround_hours, 24);

  // The same answer again changes nothing.
  const same = await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { answers: { goal: "Sign up" } } });
  assert.equal(same.body.request.status, "quoted");

  const changed = await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { answers: { sections: 8 } } });
  assert.equal(changed.status, 200);
  assert.equal(changed.body.request.status, "draft");
  assert.equal(changed.body.request.plan, null);
  assert.equal(changed.body.request.goals, "Mention the free trial.", "the buyer's goals are kept for the new plan");
  const [job] = await t.sql("SELECT status, price_cents, quote_expires_at FROM jobs WHERE id = ?", r.id);
  assert.deepEqual(job, { status: "draft", price_cents: null, quote_expires_at: null });
  const early = await t.api("POST", `/api/requests/${r.id}/start`, { user: BUYER });
  assert.equal(early.body.error.code, "quote_needed");
  assert.equal(early.body.error.message, "Check the plan first, then start the job.");

  const again = await t.api("POST", `/api/requests/${r.id}/plan`, { user: BUYER, body: {} });
  assert.equal(again.body.request.status, "quoted");
  assert.equal(again.body.request.plan.checklist.filter((c: any) => c.source === "buyer").length, 1);
  assert.equal((await t.sql("SELECT price_cents FROM jobs WHERE id = ?", r.id))[0].price_cents, null);
});

test("a plan that timed out cannot be started until it is built again", async () => {
  const t = await setup();
  const { id } = await quotedLanding(t);
  await t.sql("UPDATE jobs SET quote_expires_at = '2000-01-01T00:00:00.000Z' WHERE id = ?", id);
  const view = await t.api("GET", `/api/requests/${id}`, { user: BUYER });
  assert.equal(view.body.request.plan.expired, true);
  const res = await t.api("POST", `/api/requests/${id}/start`, { user: BUYER });
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, "quote_expired");
  assert.equal(res.body.error.message, "This plan timed out. Check it again, then start the job.");
  assert.equal(runnerCalls.length, 0);
  await t.api("POST", `/api/requests/${id}/plan`, { user: BUYER, body: {} });
  assert.equal((await t.api("POST", `/api/requests/${id}/confirm`, { user: BUYER })).status, 200);
});

test("when the run cannot start, the start stands, the failure is logged and ops is alerted", async () => {
  const t = await setup();
  const { id } = await quotedLanding(t);
  runnerFails = true;
  const res = await t.api("POST", `/api/requests/${id}/confirm`, { user: BUYER });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.job.status, "confirmed");
  const [job] = await t.sql("SELECT status FROM jobs WHERE id = ?", id);
  assert.equal(job.status, "confirmed");
  const [event] = await t.sql("SELECT data FROM events WHERE entity_id = ? AND type = 'job.start_failed'", id);
  assert.match(JSON.parse(event.data).error, /No live agent/);
  assert.equal(opsCalls.at(-1)?.kind, "job.start_failed");
  assert.equal(opsCalls.at(-1)?.link, `/ops/jobs/${id}`);
});

// ---------- Fakes ----------

test("fakes: classify by catalogue keywords, prefer the persona's jobs, extract only stated facts", () => {
  const menu = FIXTURE_JOB_TYPES;
  assert.equal(fakeClassify(classifyPrompt(menu, "I need a new landing page")).job_type_id, "landing-page-copy");
  assert.equal(fakeClassify(classifyPrompt(menu, "Fix my car please")).job_type_id, null);
  const tie = "Some content to help conversion";
  assert.equal(fakeClassify(classifyPrompt(menu, tie)).job_type_id, "landing-page-copy", "ties break by id without a persona");
  assert.equal(fakeClassify(classifyPrompt(menu, tie, { name: "Nova", jobTypeIds: ["seo-blog-post"] })).job_type_id, "seo-blog-post");

  const out = fakeExtract(extractPrompt(BLOG_POST, "A 2,000 word post about \"how often to groom a dog\" for dog owners."));
  assert.equal(out.fields.topic, "how often to groom a dog");
  assert.equal(out.fields.audience, "dog owners");
  assert.equal(out.fields.words, 2000);
});
