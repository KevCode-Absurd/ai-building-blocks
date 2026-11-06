// evaluation.afterJobDraft: baseline sampling, first-draft rule and idempotence, with the runner service mocked.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Env } from "../src/env.ts";
import type { RubricCriterion } from "../src/core/types.ts";

// Mock every export of the runner service (names read from its source, so new exports stay covered), with a
// runBaseline that writes a real baseline run and draft. Must happen before anything imports the runner.
const runnerUrl = new URL("../src/modules/runner/service.ts", import.meta.url);
const exported = [...readFileSync(runnerUrl, "utf8").matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
type BaselineInput = { jobTypeId: string; brief: string; spec?: Record<string, unknown>; rubric?: RubricCriterion[]; jobId?: string };
const baselineCalls: BaselineInput[] = [];
let baselineImpl: (env: Env, input: BaselineInput) => Promise<{ runId: string; draftId: string }> = writeBaseline;

async function writeBaseline(env: Env, input: BaselineInput) {
  const n = baselineCalls.length, now = new Date().toISOString(); // 1 for the first call
  const runId = `run_base_${n}`, draftId = `draft_base_${n}`;
  await env.DB.prepare("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES (?, ?, 'baseline', 'succeeded', ?)").bind(runId, input.jobId ?? null, now).run();
  await env.DB.prepare("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, NULL, ?, 1, ?, 'markdown', 'fp', ?)")
    .bind(draftId, runId, "Book grooms online. Try it free.", now).run();
  return { runId, draftId };
}

mock.module(runnerUrl.href, {
  namedExports: {
    ...Object.fromEntries(exported.map(name => [name, async () => { throw new Error(`runner.${name} is mocked out in this test`); }])),
    runBaseline: async (env: Env, input: BaselineInput) => { baselineCalls.push(input); return baselineImpl(env, input); },
  },
});

const { testEnv } = await import("./helpers.ts");
type TestEnv = Awaited<ReturnType<typeof testEnv>>;
const { LANDING_PAGE } = await import("./fixtures.ts");
const { registerFake } = await import("../src/core/models.ts");
const { afterJobDraft, sampleRate } = await import("../src/modules/evaluation/service.ts");

const BRIEF = LANDING_PAGE.sample_briefs[0].text;
const SPEC = { audience: "One-person dog grooming shops", goal: "Sign up" };
const DRAFT = "# Book every groom without the texts\n\n## Stop chasing texts\nClients book themselves from one link, day or night.\n\n**Start your free trial**";

let seq = 0;
async function seedJob(t: TestEnv) {
  seq++;
  await t.grantBeta("user_buyer");
  const [{ org_id }] = await t.sql("SELECT org_id FROM org_members WHERE user_id = 'user_buyer'");
  const jobId = `job_s${seq}`, agentId = `agent_s${seq}`, now = new Date().toISOString();
  await t.sql("INSERT INTO agents (id, kind, job_type_id, name, status, live_version, created_at, updated_at) VALUES (?, 'house', ?, 'House agent', 'live', 1, ?, ?)", agentId, LANDING_PAGE.id, now, now);
  await t.sql("INSERT INTO jobs (id, org_id, created_by, status, job_type_id, agent_id, agent_version, title, created_at, updated_at) VALUES (?, ?, 'user_buyer', 'in_review', ?, ?, 1, 'Test job', ?, ?)", jobId, org_id, LANDING_PAGE.id, agentId, now, now);
  await t.sql("INSERT INTO briefs (job_id, request_text, spec, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", jobId, BRIEF, JSON.stringify(SPEC), now, now);
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", jobId, JSON.stringify(LANDING_PAGE.rubric), now, now, now);
  return { jobId, agentId, draftId: await addDraft(t, jobId, agentId, "job") };
}

async function addDraft(t: TestEnv, jobId: string, agentId: string, kind: "job" | "revision") {
  seq++;
  const runId = `run_s${seq}`, draftId = `draft_s${seq}`, now = new Date().toISOString();
  await t.sql("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, created_at) VALUES (?, ?, ?, ?, 1, 'succeeded', ?)", runId, jobId, kind, agentId, now);
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, ?, ?, 1, ?, 'markdown', 'fp', ?)", draftId, jobId, runId, DRAFT, now);
  return draftId;
}

const decisions = (t: TestEnv, jobId: string) => t.sql("SELECT data FROM events WHERE entity = 'job' AND entity_id = ? AND type = 'baseline.sample_decided'", jobId);

function reset() { baselineCalls.length = 0; baselineImpl = writeBaseline; }

test("BASELINE_SAMPLE_RATE reads as a share from 0 to 1", () => {
  assert.equal(sampleRate("1"), 1);
  assert.equal(sampleRate("0"), 0);
  assert.equal(sampleRate("0.25"), 0.25);
  assert.equal(sampleRate("25%"), 0.25);
  assert.equal(sampleRate(" 0.5 "), 0.5);
  assert.equal(sampleRate("2"), 1);
  assert.equal(sampleRate("-1"), 0);
  assert.equal(sampleRate("often"), 0);
  assert.equal(sampleRate(""), 0);
  assert.equal(sampleRate(undefined), 0);
});

test("rate 1: the first draft gets a baseline run on the same brief, a comparison and a blind test", async () => {
  reset();
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "1" });
  const { jobId, agentId, draftId } = await seedJob(t);
  const out = await afterJobDraft(t.env, { jobId, draftId });
  assert.ok(out.blindTestId);
  assert.equal(baselineCalls.length, 1);
  assert.deepEqual(baselineCalls[0], { jobTypeId: LANDING_PAGE.id, brief: BRIEF, spec: SPEC, rubric: LANDING_PAGE.rubric, jobId });

  const [bt] = await t.sql("SELECT * FROM blind_tests WHERE id = ?", out.blindTestId);
  assert.deepEqual([bt.job_id, bt.agent_id, bt.agent_version, bt.status], [jobId, agentId, 1, "open"]);
  assert.deepEqual([bt.a_draft_id, bt.b_draft_id].sort(), [draftId, "draft_base_1"].sort());
  assert.match(bt.brief, /dog groomers/);
  assert.match(bt.brief, /\*\*Who is it for\?\*\* One-person dog grooming shops/);

  const [score] = await t.sql("SELECT draft_id, result FROM scores WHERE judge = 'baseline'");
  assert.equal(score.draft_id, draftId);
  assert.equal(JSON.parse(score.result).winner, "agent"); // the default fake prefers the fuller draft
  const [decision] = await decisions(t, jobId);
  assert.equal(JSON.parse(decision.data).sampled, true);
});

test("idempotent per job: calling again, or for a later draft, reuses the test and never reruns the baseline", async () => {
  reset();
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "1" });
  const { jobId, agentId, draftId } = await seedJob(t);
  const first = await afterJobDraft(t.env, { jobId, draftId });
  const again = await afterJobDraft(t.env, { jobId, draftId });
  const rerunDraft = await addDraft(t, jobId, agentId, "job");
  const later = await afterJobDraft(t.env, { jobId, draftId: rerunDraft });
  assert.equal(again.blindTestId, first.blindTestId);
  assert.equal(later.blindTestId, first.blindTestId);
  assert.equal(baselineCalls.length, 1);
  assert.equal((await t.sql("SELECT id FROM blind_tests")).length, 1);
  assert.equal((await decisions(t, jobId)).length, 1);
});

test("two calls at once still make one decision and one baseline", async () => {
  reset();
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "1" });
  const { jobId, draftId } = await seedJob(t);
  const outs = await Promise.all([afterJobDraft(t.env, { jobId, draftId }), afterJobDraft(t.env, { jobId, draftId })]);
  assert.equal(baselineCalls.length, 1);
  assert.equal((await decisions(t, jobId)).length, 1);
  assert.equal(outs.filter(o => o.blindTestId).length >= 1, true);
});

test("rate 0: no baseline, and the decision holds for the job even if the rate changes", async () => {
  reset();
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "0" });
  const { jobId, draftId } = await seedJob(t);
  assert.deepEqual(await afterJobDraft(t.env, { jobId, draftId }), { blindTestId: null });
  assert.equal(baselineCalls.length, 0);
  assert.equal(JSON.parse((await decisions(t, jobId))[0].data).sampled, false);
  t.env.BASELINE_SAMPLE_RATE = "1";
  assert.deepEqual(await afterJobDraft(t.env, { jobId, draftId }), { blindTestId: null });
  assert.equal(baselineCalls.length, 0);
  // A new job is sampled at the new rate.
  const other = await seedJob(t);
  assert.ok((await afterJobDraft(t.env, other)).blindTestId);
});

test("a rate between 0 and 1 samples by chance", async tc => {
  reset();
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "0.5" });
  tc.mock.method(Math, "random", () => 0.4);
  const inside = await seedJob(t);
  assert.ok((await afterJobDraft(t.env, inside)).blindTestId);
  tc.mock.method(Math, "random", () => 0.6);
  const outside = await seedJob(t);
  assert.equal((await afterJobDraft(t.env, outside)).blindTestId, null);
  assert.equal(baselineCalls.length, 1);
  t.env.BASELINE_SAMPLE_RATE = "not a number";
  tc.mock.method(Math, "random", () => 0);
  const bad = await seedJob(t);
  assert.equal((await afterJobDraft(t.env, bad)).blindTestId, null);
});

test("only the job's first draft: revisions, other jobs' drafts and jobs already revised are skipped", async () => {
  reset();
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "1" });
  const { jobId, agentId } = await seedJob(t);
  const revision = await addDraft(t, jobId, agentId, "revision");
  assert.equal((await afterJobDraft(t.env, { jobId, draftId: revision })).blindTestId, null);
  const other = await seedJob(t);
  assert.equal((await afterJobDraft(t.env, { jobId, draftId: other.draftId })).blindTestId, null, "a draft from another job");
  const later = await addDraft(t, jobId, agentId, "job");
  assert.equal((await afterJobDraft(t.env, { jobId, draftId: later })).blindTestId, null, "the job has been revised already");
  assert.equal((await afterJobDraft(t.env, { jobId: "job_missing", draftId: later })).blindTestId, null);
  assert.equal(baselineCalls.length, 0);
  assert.equal((await decisions(t, jobId)).length, 0, "skipped drafts do not use up the job's decision");
});

test("never throws: a failed baseline run is logged and returns null", async () => {
  reset();
  baselineImpl = async () => { throw new Error("provider down"); };
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "1" });
  const { jobId, draftId } = await seedJob(t);
  assert.deepEqual(await afterJobDraft(t.env, { jobId, draftId }), { blindTestId: null });
  const [failed] = await t.sql("SELECT data FROM events WHERE entity = 'job' AND entity_id = ? AND type = 'baseline.failed'", jobId);
  assert.match(JSON.parse(failed.data).error, /provider down/);
  assert.equal((await t.sql("SELECT id FROM blind_tests")).length, 0);
});

test("the blind test still opens when the model comparison fails", async () => {
  reset();
  const t = await testEnv({ BASELINE_SAMPLE_RATE: "1" });
  registerFake("evaluation.pairwise", () => { throw new Error("judge down"); });
  const { jobId, draftId } = await seedJob(t);
  const out = await afterJobDraft(t.env, { jobId, draftId });
  assert.ok(out.blindTestId);
  assert.equal((await t.sql("SELECT id FROM scores WHERE judge = 'baseline'")).length, 0);
  assert.equal((await t.sql("SELECT seq FROM events WHERE entity_id = ? AND type = 'baseline.compare_failed'", jobId)).length, 1);
});
