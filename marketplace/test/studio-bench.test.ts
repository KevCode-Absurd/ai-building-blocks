// Studio with the runner mocked: mark-up drafts, compile, test bench, suggested rules, publish, and ops live/retire.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { TestEnv } from "./helpers.ts";
import type { Env } from "../src/env.ts";

// ---------- Runner mock (runAgentOnBrief and runBaseline write real runs and drafts rows) ----------

const RUNNER = new URL("../src/modules/runner/service.ts", import.meta.url);
// Every export of the runner service gets a stand-in, so neighbours that import other runner functions still link.
// Names come from the source text: importing the real module first would load its dependencies unmocked.
const runnerSource = readFileSync(RUNNER, "utf8");
const runnerExports = new Set([
  ...[...runnerSource.matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]),
  ...[...runnerSource.matchAll(/^export\s*\{([^}]*)\}/gm)].flatMap(m => m[1].split(",").map(x => x.trim().split(/\s+as\s+/).pop()!).filter(Boolean)),
]);
const stubs = Object.fromEntries([...runnerExports].map(name => [name, () => { throw new Error(`runner.${name} is not part of the studio tests`); }]));
const calls: { agent: any[]; baseline: any[] } = { agent: [], baseline: [] };
let failAgentOnBrief: string | null = null;
let n = 0;

const AGENT_DRAFT = (version: number, brief: string) =>
  `# Book a call with us\n\nVersion ${version} draft for: ${brief.slice(0, 40)}\n\nWe help you grow.\n\nFlat fee, booked in 20 minutes.\n\n[Book a 20-minute call]`;
const BASELINE_DRAFT = "# Unlock your potential\n\nIn today's world, every business needs a seamless solution.\n\nOur revolutionary service will transform everything.\n\n[Sign up now]";

async function writeDraft(env: Env, kind: "test" | "baseline", agentId: string | null, version: number | null, content: string) {
  const runId = `run_mock${++n}`, draftId = `drf_mock${n}`, now = new Date().toISOString();
  await env.DB.prepare("INSERT INTO runs (id, kind, agent_id, agent_version, status, input, created_at) VALUES (?, ?, ?, ?, 'succeeded', '{}', ?)").bind(runId, kind, agentId, version, now).run();
  await env.DB.prepare("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, NULL, ?, 1, ?, 'markdown', ?, ?)").bind(draftId, runId, content, `fp${n}`, now).run();
  return { runId, draftId };
}

mock.module(RUNNER.href, {
  exports: {
    ...stubs,
    async runAgentOnBrief(env: Env, input: { agentId: string; version: number; brief: string; kind: string; actor: string }) {
      calls.agent.push(input);
      if (failAgentOnBrief && input.brief === failAgentOnBrief) throw new Error("provider timeout");
      return writeDraft(env, "test", input.agentId, input.version, AGENT_DRAFT(input.version, input.brief));
    },
    async runBaseline(env: Env, input: { jobTypeId: string; brief: string }) {
      calls.baseline.push(input);
      return writeDraft(env, "baseline", null, null, BASELINE_DRAFT);
    },
  },
});

const { testEnv } = await import("./helpers.ts");
const { LANDING_PAGE } = await import("./fixtures.ts");
const { questionBank } = await import("../src/modules/studio/questions.ts");
const { agentPackageSchema, copiedExamples, validateAgentPackage } = await import("../src/modules/studio/package.ts");
const { setAgentStatus } = await import("../src/modules/studio/service.ts");
const { fakePackage } = await import("../src/modules/studio/fakes.ts");
const { registerFake } = await import("../src/core/models.ts");
const { readData } = await import("../src/modules/studio/prompts.ts");
const { sha256Hex, stableJson } = await import("../src/core/db.ts");

const PUBLIC = LANDING_PAGE.sample_briefs.filter(b => b.visibility === "public").map(b => b.text);
const HIDDEN = LANDING_PAGE.sample_briefs.filter(b => b.visibility === "hidden").map(b => b.text);
const EXAMPLE_RESULT = "Your first class is free. Come as you are, no mat needed. Book a time that suits you, and we will save you a spot near the front.";
const LONG = "I read the brief twice and write down the one thing the reader must believe. Then I list every fact the client gave me, mark which ones are proof, "
  + "and cut anything I cannot back up. I draft the headline last, after the sections, and I read it out loud to check it sounds like a person.";

async function setup(t: TestEnv, user = "user_pia") {
  await t.api("GET", "/api/me", { user });
  await t.sql("INSERT INTO experts (id, user_id, status, display_name, job_types, created_at, updated_at) VALUES (?, ?, 'approved', 'Pia Marsh', '[\"landing-page-copy\"]', 'x', 'x')", `exp_${user}`, user);
  const res = await t.api("POST", "/api/studio/agents", { user, body: { jobTypeId: "landing-page-copy" } });
  assert.equal(res.status, 201);
  return res.body.agent.id as string;
}

/** Interview, playbook, one example, and a plain-AI draft (without marks). */
async function upToMarkup(t: TestEnv, agentId: string, user = "user_pia") {
  const base = `/api/studio/agents/${agentId}`;
  for (const q of questionBank(LANDING_PAGE).filter(b => b.required)) {
    assert.equal((await t.api("POST", `${base}/interview`, { user, body: { questionId: q.id, answer: LONG } })).status, 200);
  }
  assert.equal((await t.api("POST", `${base}/playbook/draft`, { user, body: {} })).status, 200);
  assert.equal((await t.api("POST", `${base}/examples`, { user, body: {
    title: "Trial page for a yoga studio", brief: "A yoga studio wanted more people to book a free first class.", audience: "Busy parents near the studio",
    result: EXAMPLE_RESULT, notes: "One offer, one button.", rights: "own_work", rightsConfirmed: true,
  } })).status, 201);
  const mk = await t.api("POST", `${base}/markup`, { user, body: {} });
  assert.equal(mk.status, 200, JSON.stringify(mk.body));
  return base;
}

async function ready(t: TestEnv, agentId: string, user = "user_pia") {
  const base = await upToMarkup(t, agentId, user);
  const mark = await t.api("POST", `${base}/marks`, { user, body: { passage: "In today's world, every business needs a seamless solution.", reason: "Empty filler that says nothing about this reader" } });
  assert.equal(mark.status, 201, JSON.stringify(mark.body));
  return base;
}

test("mark-up uses plain AI on a public sample brief, and marks must quote it", async () => {
  calls.agent.length = 0; calls.baseline.length = 0;
  const t = await testEnv();
  const agentId = await setup(t);
  const base = `/api/studio/agents/${agentId}`;
  assert.equal((await t.api("POST", `${base}/marks`, { user: "user_pia", body: { passage: "anything", reason: "not yet made" } })).body.error.code, "no_markup_draft");
  const hidden = await t.api("POST", `${base}/markup`, { user: "user_pia", body: { briefId: "hid_1" } });
  assert.equal(hidden.status, 400, "hidden briefs are never used in the studio");

  await upToMarkup(t, agentId);
  assert.equal(calls.baseline.length, 1);
  assert.equal(calls.baseline[0].jobTypeId, "landing-page-copy");
  assert.equal(calls.baseline[0].brief, PUBLIC[0]);
  const d = (await t.api("GET", base, { user: "user_pia" })).body;
  assert.equal(d.markup.draft, BASELINE_DRAFT);
  assert.equal(d.markup.briefId, "pub_1");

  const wrong = await t.api("POST", `${base}/marks`, { user: "user_pia", body: { passage: "Text that is not in the draft", reason: "Made up" } });
  assert.equal(wrong.body.error.code, "passage_not_found");
  const ok = await t.api("POST", `${base}/marks`, { user: "user_pia", body: { passage: "Our revolutionary   service will transform everything.", reason: "Hype with no proof" } });
  assert.equal(ok.status, 201, "spacing differences are fine");
  assert.equal((await t.api("POST", `${base}/marks`, { user: "user_pia", body: { passage: "Our revolutionary service will transform everything.", reason: "Again" } })).status, 409);
  const removed = await t.api("DELETE", `${base}/marks/${ok.body.marks[0].id}`, { user: "user_pia" });
  assert.equal(removed.body.marks.length, 0);
});

test("build compiles a valid package into a new draft version", async () => {
  const t = await testEnv();
  const agentId = await setup(t);
  const base = `/api/studio/agents/${agentId}`;
  const early = await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  assert.equal(early.status, 409);
  assert.match(early.body.error.message, /playbook.*example.*marked passage/);

  await ready(t, agentId);
  const res = await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  assert.equal(res.body.build.version, 1);
  const [row] = await t.sql("SELECT * FROM agent_versions WHERE agent_id = ?", agentId);
  assert.equal(row.status, "draft");
  const pkg = JSON.parse(row.package);
  assert.equal(row.sha256, await sha256Hex(stableJson(pkg)));
  assert.equal(row.sha256, await sha256Hex(row.package));
  assert.ok(agentPackageSchema.safeParse(pkg).success);
  assert.deepEqual(validateAgentPackage(pkg, { jobTypeId: "landing-page-copy" }).ok, true);
  assert.equal(pkg.job_type_id, "landing-page-copy");
  assert.ok(pkg.steps.some((s: any) => s.prompt.includes("{{request}}")));
  assert.ok(pkg.banned_patterns.includes("In today's world, every business needs a seamless solution."));
  assert.ok(pkg.skill.instructions.includes("## My method"), "the playbook drives the instructions");
  assert.deepEqual(copiedExamples(pkg, [{ title: "yoga", result: EXAMPLE_RESULT }]), []);
  assert.ok(!row.package.includes("save you a spot"), "past work is never copied into the package");
  assert.ok((await t.sql("SELECT 1 FROM events WHERE type = 'agent.version_built' AND entity_id = ?", agentId)).length);
  const agent = (await t.sql("SELECT status FROM agents WHERE id = ?", agentId))[0];
  assert.equal(agent.status, "draft", "building does not publish");

  // A model that copies the past work, or writes a broken package, is refused after one retry.
  registerFake("studio.compile", req => {
    const p = fakePackage(readData(req.prompt));
    return { data: { ...p, files: [...p.files, { path: "copied.md", content: EXAMPLE_RESULT }] } };
  });
  const copied = await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  assert.equal(copied.status, 502);
  assert.equal(copied.body.error.code, "build_failed");
  registerFake("studio.compile", () => ({ data: { name: "x", steps: [{ id: "only", title: "Only", prompt: "Write something good for {{nope}}", tier: "standard", output: "json", max_tokens: 500 }] } }));
  assert.equal((await t.api("POST", `${base}/build`, { user: "user_pia", body: {} })).status, 502);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM agent_versions WHERE agent_id = ?", agentId))[0].n, 1);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM model_calls WHERE purpose = 'studio.compile'"))[0].n, 5);
});

test("the test bench runs the draft next to plain AI on public briefs only", async () => {
  calls.agent.length = 0; calls.baseline.length = 0;
  const t = await testEnv();
  const agentId = await setup(t);
  const base = await ready(t, agentId);
  assert.equal((await t.api("POST", `${base}/test`, { user: "user_pia", body: {} })).body.error.code, "not_built");
  await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  calls.agent.length = 0; calls.baseline.length = 0;

  const res = await t.api("POST", `${base}/test`, { user: "user_pia", body: {} });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const tests = res.body.bench.tests;
  assert.equal(tests.length, 2);
  assert.deepEqual(calls.agent.map(c => [c.agentId, c.version, c.kind, c.actor]), [[agentId, 1, "test", "user_pia"], [agentId, 1, "test", "user_pia"]]);
  assert.deepEqual(calls.agent.map(c => c.brief).sort(), [...PUBLIC].sort());
  assert.deepEqual(calls.baseline.map(c => c.jobTypeId), ["landing-page-copy", "landing-page-copy"]);
  for (const c of [...calls.agent, ...calls.baseline]) assert.ok(!HIDDEN.includes(c.brief), "hidden briefs are kept for certification");
  for (const x of tests) {
    assert.equal(x.status, "done");
    assert.equal(x.agentDraft, AGENT_DRAFT(1, x.brief));
    assert.equal(x.baselineDraft, BASELINE_DRAFT);
  }
  const [v] = await t.sql("SELECT test_results FROM agent_versions WHERE agent_id = ? AND version = 1", agentId);
  assert.equal(JSON.parse(v.test_results).studio.runs, 2);

  // One failed run is shown as failed; the rest still come back.
  failAgentOnBrief = PUBLIC[1];
  const partial = await t.api("POST", `${base}/test`, { user: "user_pia", body: { version: 1 } });
  failAgentOnBrief = null;
  assert.equal(partial.status, 200);
  assert.deepEqual(partial.body.bench.tests.map((x: any) => x.status), ["done", "failed"]);
  assert.equal(partial.body.bench.earlierRuns, 1);

  const list = await t.api("GET", "/api/studio/agents", { user: "user_pia" });
  assert.equal(list.body.agents[0].tests.done, 3);
  assert.equal(list.body.agents[0].latestVersion.version, 1);
});

test("approved rules from edits go into the next version; declined ones do not", async () => {
  const t = await testEnv();
  const agentId = await setup(t);
  const base = await ready(t, agentId);
  await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  const v1 = (await t.sql("SELECT sha256, package FROM agent_versions WHERE agent_id = ? AND version = 1", agentId))[0];
  const test1 = (await t.api("POST", `${base}/test`, { user: "user_pia", body: {} })).body.bench.tests[0];

  assert.equal((await t.api("POST", `${base}/tests/${test1.id}/edit`, { user: "user_pia", body: { edited: test1.agentDraft, reason: "No change" } })).body.error.code, "no_change");
  const edited = test1.agentDraft.replace("We help you grow.\n\n", "");
  const res = await t.api("POST", `${base}/tests/${test1.id}/edit`, { user: "user_pia", body: { edited, reason: "Always add the price next to the call to action" } });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  const [checklistRule, styleRule] = res.body.suggestions;
  assert.equal(checklistRule.target, "checklist");
  assert.equal(checklistRule.status, "proposed");
  assert.equal(styleRule.target, "style_rules");
  assert.match(styleRule.text, /We help you grow/);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_edits WHERE test_id = ?", test1.id))[0].n, 1);

  // Nothing changes until the expert decides.
  const approved = await t.api("POST", `${base}/suggestions/${checklistRule.id}`, { user: "user_pia", body: { decision: "approve", text: "State the price next to every call to action." } });
  assert.equal(approved.body.suggestion.status, "approved");
  assert.equal((await t.api("POST", `${base}/suggestions/${styleRule.id}`, { user: "user_pia", body: { decision: "decline" } })).body.suggestion.status, "declined");
  assert.equal((await t.api("POST", `${base}/suggestions/${styleRule.id}`, { user: "user_pia", body: { decision: "maybe" } })).status, 400);

  const v2 = await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  assert.equal(v2.body.build.version, 2);
  assert.equal(v2.body.build.rulesAdded, 1);
  assert.ok(v2.body.build.package.checklist.includes("State the price next to every call to action."));
  assert.ok(![...v2.body.build.package.style_rules, ...v2.body.build.package.checklist].includes(styleRule.text));
  // The runner only sends the instructions and step prompts to the model, so the rule has to be in the instructions.
  const instructions: string = v2.body.build.package.skill.instructions;
  assert.ok(instructions.includes("- State the price next to every call to action."));
  assert.ok(!instructions.includes(styleRule.text));
  assert.equal(instructions.split("<!-- studio:rules -->").length, 2, "one rules block");
  const sugg = await t.sql("SELECT id, applied_version FROM studio_suggestions WHERE agent_id = ? ORDER BY created_at, rowid", agentId);
  assert.deepEqual(sugg.map(s => s.applied_version), [2, null]);
  const v1After = (await t.sql("SELECT sha256, package FROM agent_versions WHERE agent_id = ? AND version = 1", agentId))[0];
  assert.deepEqual(v1After, v1, "older versions stay as they were");

  const v3 = await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  assert.ok(v3.body.build.package.checklist.includes("State the price next to every call to action."), "approved rules stay in later builds");
  assert.equal(v3.body.build.rulesAdded, 0);
});

test("publishing makes a version immutable and moves the agent to testing", async () => {
  const t = await testEnv();
  const agentId = await setup(t);
  const base = await ready(t, agentId);
  await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  const notTested = await t.api("POST", `${base}/publish`, { user: "user_pia", body: { version: 1 } });
  assert.equal(notTested.body.error.code, "not_tested");
  await t.api("POST", `${base}/test`, { user: "user_pia", body: {} });

  const pub = await t.api("POST", `${base}/publish`, { user: "user_pia", body: { version: 1 } });
  assert.equal(pub.status, 200, JSON.stringify(pub.body));
  assert.equal(pub.body.agent.status, "testing");
  const [v] = await t.sql("SELECT status, published_at, test_results FROM agent_versions WHERE agent_id = ? AND version = 1", agentId);
  assert.equal(v.status, "published");
  assert.ok(v.published_at);
  assert.equal((await t.api("POST", `${base}/publish`, { user: "user_pia", body: { version: 1 } })).body.error.code, "already_published");
  assert.equal((await t.api("POST", `${base}/publish`, { user: "user_pia", body: { version: 9 } })).status, 404);
  await assert.rejects(t.sql("UPDATE agent_versions SET package = '{}' WHERE agent_id = ? AND version = 1", agentId), /agent_version_immutable/);
  await assert.rejects(t.sql("DELETE FROM agent_versions WHERE agent_id = ? AND version = 1", agentId), /agent_version_immutable/);

  // Testing a published version again does not touch its record.
  assert.equal((await t.api("POST", `${base}/test`, { user: "user_pia", body: { version: 1 } })).status, 200);
  assert.equal((await t.sql("SELECT test_results FROM agent_versions WHERE agent_id = ? AND version = 1", agentId))[0].test_results, v.test_results);
  // Changes go into a new version instead.
  const v2 = await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  assert.equal(v2.body.build.version, 2);
  const [event] = await t.sql("SELECT data FROM events WHERE type = 'agent.version_published' AND entity_id = ?", agentId);
  assert.deepEqual(JSON.parse(event.data).to, "testing");
});

test("going live and retiring are for ops only, and write events", async () => {
  const t = await testEnv();
  const agentId = await setup(t);
  const base = await ready(t, agentId);
  await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  await t.api("POST", `${base}/test`, { user: "user_pia", body: {} });
  await t.api("POST", `${base}/publish`, { user: "user_pia", body: { version: 1 } });
  await t.api("POST", `${base}/build`, { user: "user_pia", body: {} });
  await t.makeOps("user_ops");

  assert.equal((await t.api("POST", `${base}/live`, { body: { version: 1 } })).status, 401);
  assert.equal((await t.api("POST", `${base}/live`, { user: "user_pia", body: { version: 1 } })).status, 403);
  assert.equal((await t.api("POST", `${base}/retire`, { user: "user_pia", body: { reason: "Done" } })).status, 403);
  assert.equal((await t.api("POST", `${base}/live`, { user: "user_ops", body: { version: 2 } })).body.error.code, "version_not_published");
  assert.equal((await t.api("POST", "/api/studio/agents/agt_missing/live", { user: "user_ops", body: { version: 1 } })).status, 404);

  assert.equal((await t.api("POST", `${base}/live`, { user: "user_ops", body: { version: 1 } })).status, 200);
  let [agent] = await t.sql("SELECT status, live_version FROM agents WHERE id = ?", agentId);
  assert.deepEqual({ ...agent }, { status: "live", live_version: 1 });
  const [live] = await t.sql("SELECT actor, actor_kind, data FROM events WHERE type = 'agent.live' AND entity_id = ?", agentId);
  assert.deepEqual([live.actor, live.actor_kind, JSON.parse(live.data).version], ["user_ops", "ops", 1]);
  const [note] = await t.sql("SELECT kind, link FROM notifications WHERE user_id = 'user_pia'");
  assert.equal(note.kind, "agent.live");
  assert.ok(note.link.endsWith(`/studio/agents/${agentId}`));
  assert.equal((await t.api("GET", base, { user: "user_pia" })).body.agent.status, "live");

  assert.equal((await t.api("POST", `${base}/retire`, { user: "user_ops", body: {} })).status, 400);
  assert.equal((await t.api("POST", `${base}/retire`, { user: "user_ops", body: { reason: "Buyers rejected three drafts in a row." } })).status, 200);
  [agent] = await t.sql("SELECT status, live_version FROM agents WHERE id = ?", agentId);
  assert.deepEqual({ ...agent }, { status: "retired", live_version: 1 }, "the last live version stays traceable");
  const [retired] = await t.sql("SELECT data FROM events WHERE type = 'agent.retired' AND entity_id = ?", agentId);
  assert.equal(JSON.parse(retired.data).reason, "Buyers rejected three drafts in a row.");

  await t.api("POST", `${base}/test`, { user: "user_pia", body: { version: 2 } });
  assert.equal((await t.api("POST", `${base}/publish`, { user: "user_pia", body: { version: 2 } })).body.error.code, "agent_retired");
  await setAgentStatus(t.env, { agentId, status: "testing", actor: "user_ops", reason: "Second look after fixes." });
  assert.equal((await t.sql("SELECT status FROM agents WHERE id = ?", agentId))[0].status, "testing");
  assert.ok((await t.sql("SELECT 1 FROM events WHERE type = 'agent.status_changed' AND entity_id = ?", agentId)).length);
});
