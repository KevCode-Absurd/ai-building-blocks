// Ops review page (/ops/review, GET /api/ops/review): blind-test win rates overall, by agent and by job type, the
// reviewers' queue, and how often job drafts pass the rubric and policy checks. Real evaluation module, rows in SQL.
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { blindTestQueue, checkPassRates } from "../src/modules/evaluation/service.ts";

type T = Awaited<ReturnType<typeof testEnv>>;
type Pick = "a" | "b" | "tie";

const OPS = "user_ops";
const REVIEWERS = ["rev_1", "rev_2", "rev_3"];
const at = (minutes: number) => new Date(Date.UTC(2026, 10, 1, 9, minutes)).toISOString();

async function draft(t: T, id: string, jobId: string | null = null) {
  await t.sql("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES (?, ?, ?, 'succeeded', ?)", `run_${id}`, jobId, jobId ? "job" : "baseline", at(0));
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, fingerprint, created_at) VALUES (?, ?, ?, 1, ?, ?, ?)", id, jobId, `run_${id}`, `Draft ${id}`, `fp_${id}`, at(0));
}

/** A blind test with the agent on side A (or B), and one pick per reviewer in order. */
async function blind(t: T, id: string, o: { agent: string; version: number; jobType: string; status: "open" | "closed"; agentIsA?: boolean; picks: Pick[]; created?: number }) {
  await draft(t, `${id}_agent`);
  await draft(t, `${id}_plain`);
  const agentIsA = o.agentIsA ?? true;
  await t.sql(`INSERT INTO blind_tests (id, job_type_id, job_id, agent_id, agent_version, brief, a_draft_id, b_draft_id, a_source, b_source, judgments_needed, status, created_at, closed_at)
    VALUES (?, ?, NULL, ?, ?, 'A brief', ?, ?, ?, ?, 3, ?, ?, ?)`, id, o.jobType, o.agent, o.version,
  agentIsA ? `${id}_agent` : `${id}_plain`, agentIsA ? `${id}_plain` : `${id}_agent`, agentIsA ? "agent" : "baseline", agentIsA ? "baseline" : "agent",
  o.status, at(o.created ?? 1), o.status === "closed" ? at(30) : null);
  for (const [i, pick] of o.picks.entries()) {
    await t.sql("INSERT INTO blind_judgments (test_id, reviewer_id, pick, created_at) VALUES (?, ?, ?, ?)", id, REVIEWERS[i], pick, at(10 + i));
  }
}

async function score(t: T, draftId: string, judge: "rubric" | "policy" | "baseline", passed: boolean, value: number | null, result: Record<string, unknown> = {}) {
  await t.sql("INSERT INTO scores (id, draft_id, judge, judge_model, passed, score, result, created_by, created_at) VALUES (?, ?, ?, 'fake:fake-1', ?, ?, ?, 'system', ?)",
    `score_${draftId}_${judge}`, draftId, judge, passed ? 1 : 0, value, JSON.stringify(result), at(5));
}

async function job(t: T, id: string, jobType: string) {
  await t.sql("INSERT INTO jobs (id, org_id, created_by, status, job_type_id, title, created_at, updated_at) VALUES (?, 'org_buyer_1', 'buyer_1', 'in_review', ?, ?, ?, ?)", id, jobType, `Job ${id}`, at(0), at(0));
  await draft(t, `d_${id}`, id);
  return `d_${id}`;
}

async function seed(t: T) {
  await t.makeOps(OPS);
  for (const r of REVIEWERS) await t.makeReviewer(r);
  await t.grantBeta("buyer_1");
  const now = at(0);
  await t.sql("INSERT INTO agents (id, kind, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_nova', 'house', 'seo-blog-post', 'Nova: SEO blog post', 'live', 1, ?, ?)", now, now);
  await t.sql("INSERT INTO agents (id, kind, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_lp', 'house', 'landing-page-copy', 'Pia: landing pages', 'live', 2, ?, ?)", now, now);

  // Nova v1: two agent wins (one with the agent on side B), one plain-AI win, one tie. Pia v2: one plain-AI win.
  await blind(t, "bt_1", { agent: "agt_nova", version: 1, jobType: "seo-blog-post", status: "closed", picks: ["a", "a", "b"] });
  await blind(t, "bt_2", { agent: "agt_nova", version: 1, jobType: "seo-blog-post", status: "closed", agentIsA: false, picks: ["b", "b", "tie"] });
  await blind(t, "bt_3", { agent: "agt_nova", version: 1, jobType: "seo-blog-post", status: "closed", picks: ["b", "b", "a"] });
  await blind(t, "bt_4", { agent: "agt_nova", version: 1, jobType: "seo-blog-post", status: "closed", picks: ["a", "b", "tie"] });
  await blind(t, "bt_5", { agent: "agt_lp", version: 2, jobType: "landing-page-copy", status: "closed", picks: ["b", "b", "b"] });
  // Two pairs still waiting: 2 + 3 more picks needed.
  await blind(t, "bt_open_1", { agent: "agt_nova", version: 1, jobType: "seo-blog-post", status: "open", picks: ["a"], created: 3 });
  await blind(t, "bt_open_2", { agent: "agt_lp", version: 2, jobType: "landing-page-copy", status: "open", picks: [], created: 2 });
  // The AI judge agreed with the reviewers on bt_1.
  await score(t, "bt_1_agent", "baseline", true, 1, { winner: "agent" });

  // Checks on job drafts: j1 passes both, j2 fails the rubric, j3 fails policy. A bench draft (no job) is left out.
  const d1 = await job(t, "job_1", "seo-blog-post");
  const d2 = await job(t, "job_2", "seo-blog-post");
  const d3 = await job(t, "job_3", "landing-page-copy");
  await score(t, d1, "rubric", true, 0.9); await score(t, d1, "policy", true, null);
  await score(t, d2, "rubric", false, 0.5); await score(t, d2, "policy", true, null);
  await score(t, d3, "rubric", true, 1); await score(t, d3, "policy", false, null);
  await draft(t, "d_bench");
  await score(t, "d_bench", "rubric", false, 0.1);
}

test("the review report shows win rates, the reviewers' queue and check pass rates", async () => {
  const t = await testEnv();
  await seed(t);
  const res = await t.api("GET", "/api/ops/review", { user: OPS });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const r = res.body;

  assert.equal(r.target, 0.65);
  assert.deepEqual(
    { tests: r.overall.tests, agentWins: r.overall.agentWins, baselineWins: r.overall.baselineWins, ties: r.overall.ties, winRate: r.overall.winRate, judgments: r.overall.judgments },
    { tests: 5, agentWins: 2, baselineWins: 2, ties: 1, winRate: 0.5, judgments: 15 },
  );

  const nova = r.byAgent.find((a: any) => a.agent_id === "agt_nova");
  assert.deepEqual([nova.label, nova.version, nova.tests, nova.agentWins, nova.baselineWins, nova.ties, nova.winRate], ["Nova: SEO blog post v1", 1, 4, 2, 1, 1, 0.6667]);
  const pia = r.byAgent.find((a: any) => a.agent_id === "agt_lp");
  assert.deepEqual([pia.version, pia.tests, pia.winRate], [2, 1, 0]);

  const seo = r.byJobType.find((j: any) => j.key === "seo-blog-post");
  assert.equal(seo.tests, 4);
  assert.equal(seo.winRate, 0.6667);
  assert.deepEqual(seo.rubric, { checks: 2, passed: 1, rate: 0.5 });
  assert.deepEqual(seo.policy, { checks: 2, passed: 2, rate: 1 });
  const lp = r.byJobType.find((j: any) => j.key === "landing-page-copy");
  assert.equal(lp.label, "Landing page copy");
  assert.deepEqual([lp.tests, lp.winRate, lp.rubric.rate, lp.policy.rate], [1, 0, 1, 0]);

  assert.deepEqual(r.queue, { open: 2, closed: 5, judgments: 16, openJudgments: 1, stillNeeded: 5, reviewers: 3, oldestOpenAt: at(2) });
  assert.deepEqual(r.agreement, { tests: 1, agree: 1, rate: 1 });

  assert.deepEqual(r.checks.rubric, { checks: 3, passed: 2, rate: 0.6667, averageScore: 0.8 });
  assert.deepEqual(r.checks.policy, { checks: 3, passed: 2, rate: 0.6667 });
  assert.deepEqual([r.checks.drafts, r.checks.allPassed, r.checks.allRate], [3, 1, 0.3333]);
});

test("the review report is for ops only, and is empty but complete with no data", async () => {
  const t = await testEnv();
  await t.makeOps(OPS);
  await t.makeReviewer("rev_1");
  assert.equal((await t.api("GET", "/api/ops/review")).status, 401);
  assert.equal((await t.api("GET", "/api/ops/review", { user: "rev_1" })).status, 403, "reviewers judge pairs but do not see the numbers");
  assert.equal((await t.api("GET", "/api/ops/review", { user: "buyer_x" })).status, 403);

  const res = await t.api("GET", "/api/ops/review", { user: OPS });
  assert.equal(res.status, 200);
  assert.deepEqual([res.body.overall.tests, res.body.overall.winRate], [0, null]);
  assert.deepEqual([res.body.byAgent, res.body.byJobType], [[], []]);
  assert.deepEqual(res.body.queue, { open: 0, closed: 0, judgments: 0, openJudgments: 0, stillNeeded: 0, reviewers: 0, oldestOpenAt: null });
  assert.deepEqual(res.body.checks, { rubric: { checks: 0, passed: 0, rate: null, averageScore: null }, policy: { checks: 0, passed: 0, rate: null }, drafts: 0, allPassed: 0, allRate: null });
});

test("a draft checked twice counts as passing only when every check passed", async () => {
  const t = await testEnv();
  await t.grantBeta("buyer_1");
  const d = await job(t, "job_twice", "seo-blog-post");
  await score(t, d, "rubric", false, 0.6);
  await t.sql("INSERT INTO scores (id, draft_id, judge, passed, score, result, created_at) VALUES ('score_again', ?, 'rubric', 1, 0.8, '{}', ?)", d, at(6));
  await score(t, d, "policy", true, null);
  const c = await checkPassRates(t.env);
  assert.deepEqual([c.rubric.checks, c.rubric.passed, c.drafts, c.allPassed], [2, 1, 1, 0]);
  assert.equal(c.byJobType[0].label, "SEO blog post");
  const q = await blindTestQueue(t.env);
  assert.equal(q.open, 0);
});
