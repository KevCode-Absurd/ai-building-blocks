// Ops console: permissions, work queues, the job record and every job action.
// Neighbour services (delivery, runner, directory, evaluation) are mocked so these tests do not depend on their build state.
import { test, mock } from "node:test";
import assert from "node:assert/strict";

const realDelivery = await import("../src/modules/delivery/service.ts");
const realRunner = await import("../src/modules/runner/service.ts");
const realDirectory = await import("../src/modules/directory/service.ts");
const realEvaluation = await import("../src/modules/evaluation/service.ts");
const { getJob, transitionJob } = await import("../src/core/jobs.ts");
const { addHours } = await import("../src/core/db.ts");

let runCounter = 0;
const releaseDraft = mock.fn(async (env: any, input: { jobId: string; draftId: string; actor: string; actorKind: any }) => {
  const now = new Date().toISOString();
  return transitionJob(env, {
    jobId: input.jobId, to: "delivered", actor: input.actor, actorKind: input.actorKind, data: { draft_id: input.draftId },
    set: { delivered_at: now, auto_accept_at: addHours(now, 120) },
    also: [env.DB.prepare("UPDATE drafts SET released_at = ?, released_by = ? WHERE id = ?").bind(now, input.actor, input.draftId)],
  });
});
const startJobRun = mock.fn(async (env: any, input: { jobId: string; actor: string; actorKind: any; kind?: string; feedback?: string }) => {
  const job = (await getJob(env, input.jobId))!;
  const runId = `run_mock_${++runCounter}`;
  await env.DB.prepare("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, input, created_at) VALUES (?, ?, 'job', ?, ?, 'queued', ?, ?)")
    .bind(runId, job.id, job.agent_id, job.agent_version, JSON.stringify({ feedback: input.feedback ?? "" }), new Date().toISOString()).run();
  await transitionJob(env, { jobId: job.id, to: "running", actor: input.actor, actorKind: input.actorKind, data: { run_id: runId, kind: input.kind } });
  return { runId };
});
const seedPersonas = mock.fn(async () => ({ created: 2, updated: 1 }));
const seedHouseAgents = mock.fn(async () => ({ created: 3 }));
const winRates = mock.fn(async (_env: unknown, groupBy: string) => groupBy === "agent"
  ? [{ key: "agent_nova_blog", tests: 4, judgments: 12, agentWins: 3, baselineWins: 1, ties: 0, winRate: 0.75 }]
  : [{ key: "all", tests: 20, judgments: 60, agentWins: 14, baselineWins: 6, ties: 0, winRate: 0.7 }]);

mock.module("../src/modules/delivery/service.ts", { exports: { ...realDelivery, releaseDraft } });
mock.module("../src/modules/runner/service.ts", { exports: { ...realRunner, startJobRun, seedHouseAgents } });
mock.module("../src/modules/directory/service.ts", { exports: { ...realDirectory, seedPersonas } });
mock.module("../src/modules/evaluation/service.ts", { exports: { ...realEvaluation, winRates } });

const { testEnv } = await import("./helpers.ts");
const { notify } = await import("../src/core/email.ts");
type T = Awaited<ReturnType<typeof testEnv>>;

const OPS = "user_ops";
const BUYER = "user_buyer";
const ORG = `org_${BUYER}`;
const NOW = new Date().toISOString();

function resetMocks() {
  for (const m of [releaseDraft, startJobRun, seedPersonas, seedHouseAgents, winRates]) m.mock.resetCalls();
}

async function setup(overrides: Record<string, string> = {}): Promise<T> {
  resetMocks();
  const t = await testEnv(overrides as any);
  await t.makeOps(OPS);
  await t.grantBeta(BUYER);
  await t.sql("INSERT INTO personas (id, kind, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES ('nova-seo', 'house', 'Nova', 'SEO strategist', 'Gets you found.', 'marketing', '{}', 'live', 10, ?, ?)", NOW, NOW);
  for (const [id, status, live] of [["agent_nova_blog", "live", 1], ["agent_other_blog", "testing", null], ["agent_nova_lp", "live", 1]] as const) {
    const jt = id === "agent_nova_lp" ? "landing-page-copy" : "seo-blog-post";
    await t.sql("INSERT INTO agents (id, kind, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES (?, 'house', 'nova-seo', ?, ?, ?, ?, ?, ?)", id, jt, id, status, live, NOW, NOW);
    await t.sql("INSERT INTO agent_versions (agent_id, version, package, sha256, status, created_at, published_at) VALUES (?, 1, '{}', 'sha', 'published', ?, ?)", id, NOW, NOW);
  }
  await t.sql("INSERT INTO agent_versions (agent_id, version, package, sha256, status, created_at) VALUES ('agent_other_blog', 2, '{}', 'sha', 'draft', ?)", NOW);
  return t;
}

interface JobInput {
  id: string; status: string; jobType?: string | null; title?: string; createdAt?: string; updatedAt?: string;
  agentId?: string | null; dueAt?: string | null; revisionsUsed?: number; price?: number | null; createdBy?: string; orgId?: string;
}
async function addJob(t: T, j: JobInput) {
  await t.sql(`INSERT INTO jobs (id, org_id, created_by, status, job_type_id, persona_id, title, price_cents, agent_id, agent_version, due_at, revisions_used, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'nova-seo', ?, ?, ?, ?, ?, ?, ?, ?)`,
  j.id, j.orgId ?? ORG, j.createdBy ?? BUYER, j.status, j.jobType === undefined ? "seo-blog-post" : j.jobType, j.title ?? `Job ${j.id}`, j.price === undefined ? 12900 : j.price,
  j.agentId === undefined ? "agent_nova_blog" : j.agentId, j.agentId === null ? null : 1, j.dueAt ?? null, j.revisionsUsed ?? 0, j.createdAt ?? NOW, j.updatedAt ?? j.createdAt ?? NOW);
}

async function addDraft(t: T, jobId: string, d: { id: string; version: number; createdAt?: string; rubricPassed?: boolean; policyPassed?: boolean; releasedAt?: string | null }) {
  const at = d.createdAt ?? NOW;
  await t.sql("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, input_tokens, output_tokens, cost_micro_usd, created_at, started_at, finished_at) VALUES (?, ?, 'job', 'agent_nova_blog', 1, 'succeeded', 1000, 2000, 120000, ?, ?, ?)",
    `run_${d.id}`, jobId, at, at, at);
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, fingerprint, released_at, created_at) VALUES (?, ?, ?, ?, ?, 'fp', ?, ?)",
    d.id, jobId, `run_${d.id}`, d.version, `# Draft ${d.version}\n\nBody of draft ${d.version}.`, d.releasedAt ?? null, at);
  if (d.rubricPassed !== undefined) {
    await t.sql("INSERT INTO scores (id, draft_id, judge, judge_model, passed, score, result, created_at) VALUES (?, ?, 'rubric', 'fake-1', ?, 0.8, ?, ?)",
      `score_r_${d.id}`, d.id, d.rubricPassed ? 1 : 0, JSON.stringify({ criteria: [{ id: "clear_offer", pass: d.rubricPassed, evidence: "Headline names it.", note: "" }], passed: d.rubricPassed, score: 0.8 }), at);
  }
  if (d.policyPassed !== undefined) {
    await t.sql("INSERT INTO scores (id, draft_id, judge, passed, result, created_at) VALUES (?, ?, 'policy', ?, ?, ?)",
      `score_p_${d.id}`, d.id, d.policyPassed ? 1 : 0, JSON.stringify({ passed: d.policyPassed, flags: [] }), at);
  }
}

const events = (t: T, jobId: string) => t.sql<{ type: string; actor: string; actor_kind: string; data: string }>("SELECT type, actor, actor_kind, data FROM events WHERE entity = 'job' AND entity_id = ? ORDER BY seq", jobId);

// ---------- Permissions ----------

const ENDPOINTS: [string, string][] = [
  ["GET", "/api/ops/jobs"], ["GET", "/api/ops/jobs/job_x"],
  ["POST", "/api/ops/jobs/job_x/release"], ["POST", "/api/ops/jobs/job_x/rerun"], ["POST", "/api/ops/jobs/job_x/cancel"],
  ["POST", "/api/ops/jobs/job_x/assign"], ["POST", "/api/ops/jobs/job_x/note"], ["POST", "/api/ops/jobs/job_x/resolve"],
  ["GET", "/api/ops/gate"], ["GET", "/api/ops/beta-codes"], ["POST", "/api/ops/beta-codes"],
  ["GET", "/api/ops/staff"], ["POST", "/api/ops/staff"], ["POST", "/api/ops/seed"], ["GET", "/api/ops/agents"], ["GET", "/api/ops/costs"],
];

test("non-ops callers get 403 and anonymous callers 401 on every ops endpoint", async () => {
  const t = await setup();
  await t.makeReviewer("user_reviewer");
  for (const [method, path] of ENDPOINTS) {
    const body = method === "POST" ? { draft_id: "d", feedback: "x", reason: "x", agent_id: "a", body: "x", outcome: "accept", note: "x", role: "ops", email: "user_buyer@example.com" } : undefined;
    for (const user of [BUYER, "user_reviewer", "user_new"]) {
      const res = await t.api(method, path, { user, body });
      assert.equal(res.status, 403, `${method} ${path} as ${user}`);
      assert.equal(res.body.error.code, "ops_only");
    }
    assert.equal((await t.api(method, path, { body })).status, 401, `${method} ${path} anonymous`);
  }
  assert.equal(seedPersonas.mock.callCount(), 0);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM staff WHERE user_id = ?", BUYER))[0].n, 0);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM beta_codes"))[0].n, 0);
});

test("OPS_USER_IDS users are ops without a staff row", async () => {
  const t = await setup({ OPS_USER_IDS: "user_founder, user_two" });
  assert.equal((await t.api("GET", "/api/ops/jobs", { user: "user_founder" })).status, 200);
  assert.equal((await t.api("GET", "/api/ops/jobs", { user: OPS })).status, 200);
});

// ---------- Queues ----------

test("queues group jobs and put the most urgent first", async () => {
  const t = await setup();
  await addJob(t, { id: "job_r1", status: "in_review", updatedAt: "2026-11-01T10:00:00.000Z" });
  await addJob(t, { id: "job_r2", status: "in_review", updatedAt: "2026-11-02T10:00:00.000Z" });
  await addJob(t, { id: "job_r3", status: "in_review", updatedAt: "2026-11-01T09:00:00.000Z" });
  await addDraft(t, "job_r1", { id: "d_r1a", version: 1, createdAt: "2026-11-01T08:00:00.000Z", rubricPassed: false });
  await addDraft(t, "job_r1", { id: "d_r1b", version: 2, createdAt: "2026-11-01T09:30:00.000Z", rubricPassed: true, policyPassed: true });
  await addDraft(t, "job_r2", { id: "d_r2", version: 1, rubricPassed: true, policyPassed: false });
  await addJob(t, { id: "job_p1", status: "failed", updatedAt: "2026-11-03T10:00:00.000Z" });
  await addJob(t, { id: "job_p2", status: "disputed", updatedAt: "2026-11-01T10:00:00.000Z" });
  await addJob(t, { id: "job_p3", status: "rejected", updatedAt: "2026-11-02T10:00:00.000Z" });
  await addJob(t, { id: "job_q1", status: "draft", jobType: null, agentId: null, price: null, title: "", createdAt: "2026-11-02T10:00:00.000Z" });
  await t.sql("INSERT INTO briefs (job_id, request_text, created_at, updated_at) VALUES ('job_q1', 'I need a price list for my bakery, written for wholesale buyers.', ?, ?)", NOW, NOW);
  await addJob(t, { id: "job_a1", status: "draft", updatedAt: "2026-11-04T10:00:00.000Z" });
  await addJob(t, { id: "job_a2", status: "running", dueAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-11-05T10:00:00.000Z" });
  await addJob(t, { id: "job_a3", status: "delivered", revisionsUsed: 1, updatedAt: "2026-11-03T10:00:00.000Z" });
  await addJob(t, { id: "job_done", status: "accepted", updatedAt: "2026-11-04T10:00:00.000Z" });
  await addJob(t, { id: "job_gone", status: "cancelled", updatedAt: "2026-11-05T10:00:00.000Z" });
  await t.sql("INSERT INTO model_calls (id, day, purpose, job_id, provider, model, cost_micro_usd, ok, created_at) VALUES ('mc_big', '2026-11-01', 'runner.step', 'job_r1', 'fake', 'fake-1', 2500000, 1, ?)", NOW);

  const res = await t.api("GET", "/api/ops/jobs", { user: OPS });
  assert.equal(res.status, 200);
  const jobs: any[] = res.body.jobs;
  assert.deepEqual(jobs.map(j => j.id), ["job_r2", "job_r3", "job_r1", "job_p2", "job_p3", "job_p1", "job_q1", "job_a2", "job_a1", "job_a3", "job_gone", "job_done"]);
  const byId = Object.fromEntries(jobs.map(j => [j.id, j]));
  assert.deepEqual(jobs.map(j => j.queue), ["review", "review", "review", "problems", "problems", "problems", "requests", "active", "active", "active", "done", "done"]);
  assert.deepEqual(byId.job_r2.flags, ["checks_failed"]);
  assert.deepEqual(byId.job_r1.flags, ["over_cost"], "only the latest draft counts for failed checks");
  assert.equal(byId.job_r1.cost_usd, 2.5);
  assert.deepEqual(byId.job_a2.flags, ["overdue"]);
  assert.deepEqual(byId.job_a3.flags, ["revised"]);
  assert.equal(byId.job_q1.title, "I need a price list for my bakery, written for wholesale buyers.");
  assert.equal(byId.job_r1.buyer_email, "user_buyer@example.com");
  assert.equal(byId.job_r1.persona_name, "Nova");
  assert.equal(byId.job_r1.job_type_title, "SEO blog post");
  assert.equal(byId.job_r1.price_cents, 12900);
  assert.ok(byId.job_r1.age_hours >= 0);

  const review = await t.api("GET", "/api/ops/jobs?queue=review", { user: OPS });
  assert.deepEqual(review.body.jobs.map((j: any) => j.id), ["job_r2", "job_r3", "job_r1"]);
  const failed = await t.api("GET", "/api/ops/jobs?status=failed,disputed", { user: OPS });
  assert.deepEqual(failed.body.jobs.map((j: any) => j.id).sort(), ["job_p1", "job_p2"]);
  const search = await t.api("GET", "/api/ops/jobs?q=bakery", { user: OPS });
  assert.deepEqual(search.body.jobs.map((j: any) => j.id), ["job_q1"]);
  const byEmail = await t.api("GET", "/api/ops/jobs?q=USER_BUYER@example", { user: OPS });
  assert.equal(byEmail.body.jobs.length, 12);
});

// ---------- The job record ----------

test("the job record shows the brief, rubric, runs, drafts with checks, decisions, timeline, notes and notifications", async () => {
  const t = await setup();
  await addJob(t, { id: "job_r1", status: "in_review" });
  await addJob(t, { id: "job_r10", status: "draft" });
  await t.sql("INSERT INTO briefs (job_id, request_text, spec, answers, created_at, updated_at) VALUES ('job_r1', 'An article about grooming.', ?, ?, ?, ?)", JSON.stringify({ topic: "dog grooming" }), JSON.stringify({ audience: "owners" }), NOW, NOW);
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES ('job_r1', ?, ?, ?, ?)", JSON.stringify([{ id: "clear_offer", text: "Clear", weight: 5, pass_rule: "x", critical: true, source: "template" }]), NOW, NOW, NOW);
  await addDraft(t, "job_r1", { id: "d_1", version: 1, createdAt: "2026-11-01T08:00:00.000Z", rubricPassed: false, policyPassed: true });
  await t.sql("INSERT INTO run_steps (run_id, seq, step_id, provider, model, status, input_tokens, output_tokens, cost_micro_usd, output, started_at, finished_at) VALUES ('run_d_1', 1, 'outline', 'fake', 'fake-1', 'succeeded', 10, 20, 30000, 'Outline', ?, ?)", NOW, NOW);
  await t.sql("INSERT INTO model_calls (id, day, purpose, job_id, run_id, provider, model, cost_micro_usd, ok, created_at) VALUES ('mc_1', '2026-11-01', 'runner.step', 'job_r1', 'run_d_1', 'fake', 'fake-1', 30000, 1, ?), ('mc_2', '2026-11-01', 'evaluation.rubric', 'job_r1', NULL, 'fake', 'fake-1', 20000, 1, ?)", NOW, NOW);
  await t.sql("INSERT INTO decisions (id, job_id, draft_id, kind, reasons, failed_criteria, edits, created_by, created_at) VALUES ('dec_1', 'job_r1', 'd_1', 'revise', 'Too long', '[\"clear_offer\"]', '{\"diff\":\"-a +b\"}', ?, ?)", BUYER, NOW);
  await notify(t.env, { userId: BUYER, kind: "job.in_review", subject: "Final check", text: "Your draft is in a final check.", link: "/jobs/job_r1" });
  await notify(t.env, { userId: OPS, kind: "ops.review", subject: "Draft ready", text: "A draft needs your OK.", link: "/ops/jobs/job_r1?tab=drafts" });
  await notify(t.env, { userId: BUYER, kind: "job.quoted", subject: "Quote", text: "Other job.", link: "/jobs/job_r10" });
  await t.api("POST", "/api/ops/jobs/job_r1/note", { user: OPS, body: { body: "Called the buyer about length." } });

  const res = await t.api("GET", "/api/ops/jobs/job_r1", { user: OPS });
  assert.equal(res.status, 200);
  const r = res.body;
  assert.equal(r.job.id, "job_r1");
  assert.equal(r.job.status, "in_review");
  assert.deepEqual(r.job.flags, ["checks_failed"]);
  assert.equal(r.buyer.email, "user_buyer@example.com");
  assert.equal(r.brief.request_text, "An article about grooming.");
  assert.equal(r.brief.spec.topic, "dog grooming");
  assert.equal(r.rubric.criteria[0].id, "clear_offer");
  assert.equal(r.runs.length, 1);
  assert.equal(r.runs[0].steps[0].step_id, "outline");
  assert.equal(r.runs[0].cost_usd, 0.03);
  assert.equal(r.drafts[0].content.startsWith("# Draft 1"), true);
  assert.equal(r.drafts[0].checks_failed, true);
  assert.equal(r.drafts[0].scores.find((s: any) => s.judge === "rubric").result.criteria[0].evidence, "Headline names it.");
  assert.equal(r.decisions[0].kind, "revise");
  assert.deepEqual(r.decisions[0].failed_criteria, ["clear_offer"]);
  assert.deepEqual(r.decisions[0].edits, { diff: "-a +b" });
  assert.equal(r.notes[0].body, "Called the buyer about length.");
  assert.equal(r.notes[0].created_by_email, "user_ops@example.com");
  assert.deepEqual(r.notifications.map((n: any) => n.kind), ["job.in_review", "ops.review"]);
  assert.ok(r.events.some((e: any) => e.type === "ops.note_added" && e.actor_kind === "ops"));
  assert.equal(r.cost.total_usd, 0.05);
  assert.equal(r.cost.calls, 2);
  assert.equal(r.cost.cap_usd, 2);
  assert.deepEqual(r.cost.by_purpose.map((p: any) => p.purpose), ["runner.step", "evaluation.rubric"]);
  assert.equal(r.agent.id, "agent_nova_blog");
  assert.deepEqual(r.agent_options.map((a: any) => a.id).sort(), ["agent_nova_blog", "agent_other_blog"]);
  assert.deepEqual(r.agent_options.find((a: any) => a.id === "agent_other_blog").versions, [1]);
  assert.deepEqual(r.actions, { release: true, rerun: true, cancel: true, assign: true, resolve: false });

  assert.equal((await t.api("GET", "/api/ops/jobs/job_missing", { user: OPS })).status, 404);
});

// ---------- Actions ----------

test("release hands the draft to delivery.releaseDraft as ops and logs an ops event", async () => {
  const t = await setup();
  await addJob(t, { id: "job_1", status: "in_review" });
  await addDraft(t, "job_1", { id: "d_1", version: 1, rubricPassed: true });
  const res = await t.api("POST", "/api/ops/jobs/job_1/release", { user: OPS, body: { draft_id: "d_1" } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.job.status, "delivered");
  assert.equal(releaseDraft.mock.callCount(), 1);
  const input = releaseDraft.mock.calls[0].arguments[1];
  assert.deepEqual(input, { jobId: "job_1", draftId: "d_1", actor: OPS, actorKind: "ops" });
  const ev = await events(t, "job_1");
  assert.deepEqual(ev.map(e => e.type), ["job.delivered", "ops.draft_released"]);
  assert.ok(ev.every(e => e.actor_kind === "ops" && e.actor === OPS));
});

test("release refuses jobs not waiting for review, drafts of other jobs and drafts already released", async () => {
  const t = await setup();
  await addJob(t, { id: "job_1", status: "in_review" });
  await addJob(t, { id: "job_2", status: "running" });
  await addDraft(t, "job_1", { id: "d_1", version: 1, releasedAt: NOW });
  await addDraft(t, "job_2", { id: "d_2", version: 1 });
  const notReview = await t.api("POST", "/api/ops/jobs/job_2/release", { user: OPS, body: { draft_id: "d_2" } });
  assert.equal(notReview.status, 409);
  assert.match(notReview.body.error.message, /running/);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/release", { user: OPS, body: { draft_id: "d_2" } })).status, 404);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/release", { user: OPS, body: { draft_id: "d_1" } })).status, 409);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/release", { user: OPS, body: {} })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_nope/release", { user: OPS, body: { draft_id: "d_1" } })).status, 404);
  assert.equal(releaseDraft.mock.callCount(), 0);
});

test("rerun starts a rerun with the notes, only from review, failed, rejected or disputed", async () => {
  const t = await setup();
  await addJob(t, { id: "job_1", status: "failed" });
  await addJob(t, { id: "job_2", status: "delivered" });
  const res = await t.api("POST", "/api/ops/jobs/job_1/rerun", { user: OPS, body: { feedback: "Use the buyer's prices, not made-up ones." } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.runId, "run_mock_1");
  assert.equal(res.body.job.status, "running");
  const input = startJobRun.mock.calls[0].arguments[1];
  assert.deepEqual(input, { jobId: "job_1", actor: OPS, actorKind: "ops", kind: "rerun", feedback: "Use the buyer's prices, not made-up ones." });
  const ev = await events(t, "job_1");
  assert.equal(ev.at(-1)!.type, "ops.rerun_started");
  assert.equal(ev.at(-1)!.actor_kind, "ops");
  assert.equal(JSON.parse(ev.at(-1)!.data).from, "failed");

  assert.equal((await t.api("POST", "/api/ops/jobs/job_2/rerun", { user: OPS, body: { feedback: "x" } })).status, 409);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/rerun", { user: OPS, body: { feedback: "" } })).status, 400);
  assert.equal(startJobRun.mock.callCount(), 1);
});

test("cancel stops the job, closes open runs, tells the buyer and refuses final jobs", async () => {
  const t = await setup();
  await addJob(t, { id: "job_1", status: "running", title: "Grooming article" });
  await t.sql("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES ('run_open', 'job_1', 'job', 'running', ?)", NOW);
  await addJob(t, { id: "job_2", status: "accepted" });
  await addJob(t, { id: "job_3", status: "checking" });
  await addJob(t, { id: "job_4", status: "quoted" });

  const res = await t.api("POST", "/api/ops/jobs/job_1/cancel", { user: OPS, body: { reason: "Buyer asked to stop." } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.job.status, "cancelled");
  assert.equal((await t.sql("SELECT status FROM runs WHERE id = 'run_open'"))[0].status, "cancelled");
  const ev = (await events(t, "job_1")).at(-1)!;
  assert.equal(ev.type, "job.cancelled");
  assert.equal(ev.actor_kind, "ops");
  assert.equal(JSON.parse(ev.data).reason, "Buyer asked to stop.");
  const notes = await t.sql("SELECT user_id, kind, subject, body_text, link FROM notifications WHERE user_id = ?", BUYER);
  assert.equal(notes.length, 1);
  assert.equal(notes[0].kind, "job.cancelled");
  assert.match(notes[0].body_text, /Grooming article/);
  assert.equal(notes[0].link, "https://agents.test/jobs/job_1");

  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/cancel", { user: OPS, body: { reason: "again" } })).status, 409);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_2/cancel", { user: OPS, body: { reason: "x" } })).status, 409);
  const checking = await t.api("POST", "/api/ops/jobs/job_3/cancel", { user: OPS, body: { reason: "x" } });
  assert.equal(checking.status, 409);
  assert.match(checking.body.error.message, /Checks are running/);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_4/cancel", { user: OPS, body: {} })).status, 400);

  const quiet = await t.api("POST", "/api/ops/jobs/job_4/cancel", { user: OPS, body: { reason: "Spam", notify_buyer: false } });
  assert.equal(quiet.status, 200);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM notifications WHERE user_id = ?", BUYER))[0].n, 1);
});

test("assign sets the agent and version for future runs, with checks", async () => {
  const t = await setup();
  await addJob(t, { id: "job_1", status: "failed" });
  await addJob(t, { id: "job_2", status: "draft", jobType: null, agentId: null });
  await addJob(t, { id: "job_3", status: "accepted" });

  const res = await t.api("POST", "/api/ops/jobs/job_1/assign", { user: OPS, body: { agent_id: "agent_other_blog" } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const [job] = await t.sql("SELECT agent_id, agent_version, status FROM jobs WHERE id = 'job_1'");
  assert.deepEqual({ ...job }, { agent_id: "agent_other_blog", agent_version: 1, status: "failed" });
  const ev = (await events(t, "job_1")).at(-1)!;
  assert.equal(ev.type, "ops.agent_assigned");
  assert.equal(ev.actor_kind, "ops");
  assert.deepEqual(JSON.parse(ev.data), { agent_id: "agent_other_blog", version: 1, previous_agent_id: "agent_nova_blog", previous_version: 1 });

  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/assign", { user: OPS, body: { agent_id: "agent_other_blog", version: 2 } })).status, 400, "draft version");
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/assign", { user: OPS, body: { agent_id: "agent_nova_lp" } })).status, 400, "other job type");
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/assign", { user: OPS, body: { agent_id: "agent_ghost" } })).status, 404);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_2/assign", { user: OPS, body: { agent_id: "agent_nova_blog" } })).status, 409, "no job type");
  assert.equal((await t.api("POST", "/api/ops/jobs/job_3/assign", { user: OPS, body: { agent_id: "agent_nova_blog" } })).status, 409, "closed job");
  await t.sql("UPDATE agents SET status = 'retired' WHERE id = 'agent_nova_blog'");
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/assign", { user: OPS, body: { agent_id: "agent_nova_blog", version: 1 } })).status, 400, "retired");
});

test("note adds a note and an ops event; empty notes are refused", async () => {
  const t = await setup();
  await addJob(t, { id: "job_1", status: "running" });
  const res = await t.api("POST", "/api/ops/jobs/job_1/note", { user: OPS, body: { body: "Buyer wants it by Friday." } });
  assert.equal(res.status, 200);
  const [note] = await t.sql("SELECT entity, entity_id, body, created_by FROM notes");
  assert.deepEqual({ ...note }, { entity: "job", entity_id: "job_1", body: "Buyer wants it by Friday.", created_by: OPS });
  assert.equal((await events(t, "job_1")).at(-1)!.type, "ops.note_added");
  assert.equal((await t.api("POST", "/api/ops/jobs/job_1/note", { user: OPS, body: { body: "  " } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_nope/note", { user: OPS, body: { body: "x" } })).status, 404);
});

test("resolve decides rejected and disputed jobs: accept, rerun or cancel", async () => {
  const t = await setup();
  await addJob(t, { id: "job_rej", status: "rejected" });
  await addJob(t, { id: "job_dis", status: "disputed" });
  await addJob(t, { id: "job_dis2", status: "disputed" });
  await addJob(t, { id: "job_ok", status: "delivered" });

  const accept = await t.api("POST", "/api/ops/jobs/job_rej/resolve", { user: OPS, body: { outcome: "accept", note: "Buyer agreed the draft matches the brief." } });
  assert.equal(accept.status, 200, JSON.stringify(accept.body));
  assert.equal(accept.body.job.status, "accepted");
  const [acc] = await t.sql("SELECT accepted_at FROM jobs WHERE id = 'job_rej'");
  assert.ok(acc.accepted_at);
  const accEvents = await events(t, "job_rej");
  assert.deepEqual(accEvents.map(e => e.type), ["job.disputed", "job.accepted", "ops.note_added", "ops.resolved"]);
  assert.ok(accEvents.every(e => e.actor_kind === "ops"));
  assert.equal(JSON.parse(accEvents.at(-1)!.data).outcome, "accept");
  assert.match((await t.sql("SELECT body FROM notes WHERE entity_id = 'job_rej'"))[0].body, /Buyer agreed/);
  assert.equal((await t.sql("SELECT kind FROM notifications WHERE user_id = ?", BUYER))[0].kind, "job.accepted");

  const rerun = await t.api("POST", "/api/ops/jobs/job_dis/resolve", { user: OPS, body: { outcome: "rerun", note: "Add the FAQ the buyer asked for." } });
  assert.equal(rerun.status, 200, JSON.stringify(rerun.body));
  assert.equal(rerun.body.job.status, "running");
  assert.ok(rerun.body.runId);
  assert.equal(startJobRun.mock.calls[0].arguments[1].kind, "rerun");
  assert.equal(startJobRun.mock.calls[0].arguments[1].feedback, "Add the FAQ the buyer asked for.");

  const cancel = await t.api("POST", "/api/ops/jobs/job_dis2/resolve", { user: OPS, body: { outcome: "cancel", note: "Out of scope for this job type." } });
  assert.equal(cancel.status, 200);
  assert.equal(cancel.body.job.status, "cancelled");

  assert.equal((await t.api("POST", "/api/ops/jobs/job_ok/resolve", { user: OPS, body: { outcome: "accept", note: "x" } })).status, 409);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_rej/resolve", { user: OPS, body: { outcome: "accept", note: "again" } })).status, 409);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_dis2/resolve", { user: OPS, body: { outcome: "refund", note: "x" } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/jobs/job_dis2/resolve", { user: OPS, body: { outcome: "accept" } })).status, 400);
});
