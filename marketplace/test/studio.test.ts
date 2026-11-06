// Studio: permissions and ownership, the interview, and the examples library.
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv, type TestEnv } from "./helpers.ts";
import { FOLLOW_UP_HINTS, questionBank } from "../src/modules/studio/questions.ts";
import { RIGHTS_STATEMENTS } from "../src/modules/studio/service.ts";
import { validateAgentPackage, withRuleBlock } from "../src/modules/studio/package.ts";
import { fakePackage } from "../src/modules/studio/fakes.ts";
import { LANDING_PAGE } from "./fixtures.ts";

const LONG = (topic: string) => `For ${topic}, I start by reading the whole brief twice and writing down the one thing the reader must believe. `
  + "Then I list every fact the client gave me, mark which ones are proof, and cut anything I cannot back up. "
  + "I draft the headline last, after the sections, and I read it out loud to check it sounds like a person.";

async function makeExpert(t: TestEnv, userId: string, opts: { status?: string; jobTypes?: string[]; persona?: boolean } = {}): Promise<string> {
  await t.api("GET", "/api/me", { user: userId });
  const id = `exp_${userId}`;
  await t.sql("INSERT INTO experts (id, user_id, status, display_name, job_types, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'x', 'x')",
    id, userId, opts.status ?? "approved", `Expert ${userId}`, JSON.stringify(opts.jobTypes ?? ["landing-page-copy"]));
  if (opts.persona) {
    await t.sql("INSERT INTO personas (id, kind, expert_id, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES (?, 'expert', ?, 'Pia', 'Conversion copywriter', 'Pages that turn visitors into buyers.', 'marketing', '{}', 'hidden', 100, 'x', 'x')",
      `pia-${userId}`, id);
  }
  return id;
}

async function createAgent(t: TestEnv, user: string): Promise<string> {
  const res = await t.api("POST", "/api/studio/agents", { user, body: { jobTypeId: "landing-page-copy" } });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.agent.id;
}

test("the studio is for approved experts, and each expert sees only their own agents", async () => {
  const t = await testEnv();
  assert.equal((await t.api("GET", "/api/studio/agents")).status, 401);
  assert.equal((await t.api("GET", "/api/studio/agents", { user: "user_buyer" })).status, 403);
  await makeExpert(t, "user_applied", { status: "applied" });
  assert.equal((await t.api("GET", "/api/studio/agents", { user: "user_applied" })).status, 403);
  const expertId = await makeExpert(t, "user_pia", { persona: true });

  const list = await t.api("GET", "/api/studio/agents", { user: "user_pia" });
  assert.equal(list.status, 200);
  assert.deepEqual(list.body.jobTypes.map((j: any) => [j.id, j.taken]), [["landing-page-copy", false]]);

  assert.equal((await t.api("POST", "/api/studio/agents", { user: "user_pia", body: { jobTypeId: "nope" } })).status, 400);
  const notMine = await t.api("POST", "/api/studio/agents", { user: "user_pia", body: { jobTypeId: "seo-blog-post" } });
  assert.equal(notMine.status, 403);
  assert.equal(notMine.body.error.code, "job_type_not_approved");

  const agentId = await createAgent(t, "user_pia");
  const [row] = await t.sql("SELECT * FROM agents WHERE id = ?", agentId);
  assert.equal(row.kind, "expert");
  assert.equal(row.expert_id, expertId);
  assert.equal(row.persona_id, "pia-user_pia");
  assert.equal(row.status, "draft");
  assert.equal(row.name, "Pia: Landing page copy");
  assert.equal((await t.api("POST", "/api/studio/agents", { user: "user_pia", body: { jobTypeId: "landing-page-copy" } })).status, 409);
  const events = await t.sql("SELECT type, actor_kind FROM events WHERE entity = 'agent' AND entity_id = ?", agentId);
  assert.deepEqual(events.map(e => [e.type, e.actor_kind]), [["agent.created", "expert"]]);

  // Someone else's agent is a 404 everywhere; ops who are not experts are refused.
  await makeExpert(t, "user_other");
  for (const [method, path, body] of [
    ["GET", `/api/studio/agents/${agentId}`, undefined],
    ["POST", `/api/studio/agents/${agentId}/interview`, { questionId: "case", answer: LONG("a test") }],
    ["POST", `/api/studio/agents/${agentId}/examples`, { rightsConfirmed: true }],
    ["DELETE", `/api/studio/agents/${agentId}/examples/ex_1`, undefined],
    ["POST", `/api/studio/agents/${agentId}/build`, {}],
    ["POST", `/api/studio/agents/${agentId}/test`, {}],
    ["POST", `/api/studio/agents/${agentId}/publish`, { version: 1 }],
  ] as const) {
    const res = await t.api(method, path, { user: "user_other", body });
    assert.equal(res.status, 404, `${method} ${path}`);
  }
  assert.equal((await t.api("GET", "/api/studio/agents", { user: "user_other" })).body.agents.length, 0);
  await t.makeOps("user_ops");
  assert.equal((await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_ops" })).status, 403);
  assert.equal((await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_pia" })).status, 200);
});

test("the interview asks follow-ups, then drafts a playbook the expert can edit", async () => {
  const t = await testEnv();
  await makeExpert(t, "user_pia");
  const agentId = await createAgent(t, "user_pia");
  const path = `/api/studio/agents/${agentId}/interview`;
  const bank = questionBank(LANDING_PAGE);

  let d = (await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_pia" })).body;
  assert.equal(d.interview.total, bank.length);
  assert.ok(bank.some(q => q.id.startsWith("rubric_")), "job-type questions come from the rubric");
  assert.deepEqual(d.interview.next, { id: "case", kind: "question", text: bank[0].text, help: bank[0].help, required: true });
  assert.equal(d.current, "interview");

  // A short answer gets a follow-up.
  let iv = (await t.api("POST", path, { user: "user_pia", body: { questionId: "case", answer: "A yoga studio that wanted more trial sign-ups." } })).body.interview;
  assert.equal(iv.next.kind, "follow_up");
  assert.equal(iv.next.text, FOLLOW_UP_HINTS.case);
  assert.ok(iv.next.id.startsWith("turn_"));
  iv = (await t.api("POST", path, { user: "user_pia", body: { questionId: iv.next.id, answer: "A short page with one offer, and the owner said sign-ups doubled." } })).body.interview;
  assert.equal(iv.next.id, "method");

  const short = await t.api("POST", path, { user: "user_pia", body: { questionId: "method", answer: "I write it." } });
  assert.equal(short.status, 400);
  assert.equal(short.body.error.code, "answer_too_short");
  assert.equal((await t.api("POST", path, { user: "user_pia", body: { questionId: "method", skip: true } })).status, 400);
  assert.equal((await t.api("POST", path, { user: "user_pia", body: { questionId: "made_up", answer: LONG("x") } })).status, 400);
  const early = await t.api("POST", `/api/studio/agents/${agentId}/playbook/draft`, { user: "user_pia", body: {} });
  assert.equal(early.status, 409);
  assert.equal(early.body.error.code, "interview_not_done");

  // Long answers need no follow-up.
  for (const q of bank.filter(b => b.required && b.id !== "case")) {
    iv = (await t.api("POST", path, { user: "user_pia", body: { questionId: q.id, answer: LONG(q.id) } })).body.interview;
    assert.notEqual(iv.next?.kind, "follow_up", q.id);
  }
  assert.equal(iv.requiredLeft, 0);
  assert.equal(iv.canDraftPlaybook, true);
  assert.equal(iv.next.id, "counterfactual");
  iv = (await t.api("POST", path, { user: "user_pia", body: { questionId: "counterfactual", skip: true } })).body.interview;
  assert.ok(iv.next.id.startsWith("rubric_"));

  // Editing an earlier answer keeps one row per question.
  await t.api("POST", path, { user: "user_pia", body: { questionId: "red_lines", answer: "I never invent reviews or numbers.\nI never promise results I cannot prove." } });
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_interview_turns WHERE agent_id = ? AND question_id = 'red_lines'", agentId))[0].n, 1);

  const drafted = await t.api("POST", `/api/studio/agents/${agentId}/playbook/draft`, { user: "user_pia", body: {} });
  assert.equal(drafted.status, 200, JSON.stringify(drafted.body));
  const pb = drafted.body.interview.playbook as string;
  for (const h of ["## My method", "## My quality bar", "## Red lines", "## When information is missing"]) assert.ok(pb.includes(h), h);
  assert.ok(pb.includes("I never invent reviews or numbers."));
  assert.ok(pb.includes("sign-ups doubled"), "follow-up answers feed the playbook");
  assert.equal(drafted.body.interview.playbookSource, "ai");
  const calls = await t.sql("SELECT purpose, ok FROM model_calls WHERE purpose = 'studio.interview'");
  assert.ok(calls.length >= 2 && calls.every(c => c.ok === 1));

  const edited = `${pb}\n\n## One more thing\nI always end with the one action the reader should take.`;
  const saved = await t.api("POST", `/api/studio/agents/${agentId}/playbook`, { user: "user_pia", body: { playbook: edited } });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.interview.playbookSource, "expert");
  assert.equal((await t.api("POST", `/api/studio/agents/${agentId}/playbook`, { user: "user_pia", body: { playbook: "Too short." } })).status, 400);

  d = (await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_pia" })).body;
  assert.equal(d.interview.playbook, edited);
  assert.equal(d.steps.find((s: any) => s.id === "interview").done, true);
  assert.equal(d.current, "examples");
  const types = (await t.sql("SELECT type FROM events WHERE entity = 'agent' AND entity_id = ?", agentId)).map(e => e.type);
  for (const type of ["studio.interview_answered", "studio.follow_up_asked", "studio.playbook_drafted", "studio.playbook_edited"]) assert.ok(types.includes(type), type);
});

test("examples need a rights confirmation, stay within size limits and stay private", async () => {
  const t = await testEnv();
  await makeExpert(t, "user_pia");
  await makeExpert(t, "user_other");
  const agentId = await createAgent(t, "user_pia");
  const path = `/api/studio/agents/${agentId}/examples`;
  const example = {
    title: "Trial page for a yoga studio", brief: "A yoga studio wanted more people to book a free first class from Instagram.",
    audience: "Busy parents near the studio", result: "Your first class is free. Come as you are, no mat needed. Book a time that suits you, and we will save you a spot.",
    notes: "One offer, one button, and the fear of not being fit enough answered up front.", rights: "own_work",
  };

  const noConfirm = await t.api("POST", path, { user: "user_pia", body: example });
  assert.equal(noConfirm.status, 400);
  assert.equal(noConfirm.body.error.code, "rights_required");
  assert.equal((await t.api("POST", path, { user: "user_pia", body: { ...example, rightsConfirmed: "yes" } })).body.error.code, "rights_required");
  assert.equal((await t.api("POST", path, { user: "user_pia", body: { ...example, rights: "found_online", rightsConfirmed: true } })).status, 400);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_examples"))[0].n, 0);

  const ok = await t.api("POST", path, { user: "user_pia", body: { ...example, rightsConfirmed: true } });
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  assert.equal(ok.body.examples.length, 1);
  const [row] = await t.sql("SELECT * FROM studio_examples WHERE agent_id = ?", agentId);
  assert.equal(row.rights, "own_work");
  assert.equal(row.rights_statement, RIGHTS_STATEMENTS.own_work);
  assert.ok(row.rights_confirmed_at);
  const [event] = await t.sql("SELECT data FROM events WHERE type = 'studio.example_added'");
  assert.ok(!event.data.includes("yoga"), "events never hold the example's text");

  const tooLong = await t.api("POST", path, { user: "user_pia", body: { ...example, result: "x".repeat(20001), rightsConfirmed: true } });
  assert.equal(tooLong.status, 400);
  const secret = await t.api("POST", path, { user: "user_pia", body: { ...example, result: `${example.result} sk-ant-api03-${"a".repeat(40)}`, rightsConfirmed: true } });
  assert.equal(secret.body.error.code, "remove_secret");

  for (let i = 0; i < 11; i++) {
    assert.equal((await t.api("POST", path, { user: "user_pia", body: { ...example, title: `Example ${i}`, rights: "client_permission", rightsConfirmed: true } })).status, 201);
  }
  const full = await t.api("POST", path, { user: "user_pia", body: { ...example, rightsConfirmed: true } });
  assert.equal(full.status, 409);
  assert.equal(full.body.error.code, "too_many_examples");

  assert.equal((await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_other" })).status, 404);
  assert.equal((await t.api("DELETE", `${path}/${row.id}`, { user: "user_other" })).status, 404);
  const removed = await t.api("DELETE", `${path}/${row.id}`, { user: "user_pia" });
  assert.equal(removed.status, 200);
  assert.equal(removed.body.examples.length, 11);
  assert.equal((await t.api("DELETE", `${path}/${row.id}`, { user: "user_pia" })).status, 404);
});

test("compiled packages use the runner's exact placeholders, and rules reach the instructions", async () => {
  const { renderPrompt } = await import("../src/modules/runner/packages.ts");
  const pkg = withRuleBlock(fakePackage({
    job_type: { id: LANDING_PAGE.id, title: LANDING_PAGE.title, deliverable: LANDING_PAGE.deliverable, rubric: LANDING_PAGE.rubric, not_for: LANDING_PAGE.not_for, spec_fields: LANDING_PAGE.spec_fields },
    agent_name: "Pia: Landing page copy", expert_name: "Pia Marsh",
    playbook: "# How I do landing page copy\n\n## My method\n1. Read the brief.\n2. Write.\n\n## My quality bar\n- One action only.\n\n## Red lines\n- No invented reviews.",
    examples: [], marks: [{ passage: "Unlock your potential", reason: "Hype with no proof" }], approved_rules: [], previous_package: null, problems: [],
  }));
  const checked = validateAgentPackage(pkg, { jobTypeId: LANDING_PAGE.id });
  assert.ok(checked.ok, JSON.stringify(checked));
  assert.ok(pkg.skill.instructions.includes("- Unlock your potential"), "banned patterns are in the system prompt");
  assert.ok(pkg.skill.instructions.includes("- One action only."), "the checklist is in the system prompt");
  assert.equal(withRuleBlock(pkg).skill.instructions, pkg.skill.instructions, "rebuilding does not stack rule blocks");
  const steps: Record<string, string> = {};
  for (const s of pkg.steps) {
    const out = renderPrompt(s.prompt, { request: "Sell my app", spec: {}, rubric: LANDING_PAGE.rubric, brand: {}, previous: "", feedback: "", steps });
    assert.ok(!out.includes("{{"), `${s.id} has an unfilled placeholder`);
    assert.ok(!out.includes("(not written yet)"), `${s.id} reads a step that has not run`);
    steps[s.id] = `output of ${s.id}`;
  }
  assert.ok(renderPrompt(pkg.steps[2].prompt, { request: "", spec: {}, rubric: [], brand: {}, previous: "", feedback: "", steps }).includes("output of draft"), "the last step checks the draft");

  const spaced = { ...pkg, steps: [{ ...pkg.steps[0], prompt: "Write it for {{ request }} please" }] };
  assert.equal(validateAgentPackage(spaced).ok, false);
  const unchained = { ...pkg, steps: [pkg.steps[0], { ...pkg.steps[1], prompt: "Write the page for {{request}} now." }] };
  const res = validateAgentPackage(unchained);
  assert.ok(!res.ok && res.errors.some(e => e.includes("{{step:<id>}}")));
});
