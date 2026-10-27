import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { decodeCatalogue, freeSelection, finalize, candidatesFor, requestError, retrieve, questionsFor, terms, validateChoices, selectionSchema, LIMITS, positiveRequest, requestClauses } from "../src/lib/composer-core.ts";
import { MODELS, callModel, usageCost } from "../src/lib/composer-models.ts";
import { handleComposer as composerForUser, memoryComposer, d1Composer } from "../src/server/composer.ts";
const handleComposer = (req, library, env, store, ip, runner) => composerForUser(req, library, env, store, ip, runner, "user_test");
import { WORKFLOW_CASES } from "../../tools/lib/workflow-cases.mjs";
import { validateCustomSkills, withCustomSkills, replacementImpact, replacementOptions, replaceFlowSkill } from "../src/lib/custom-skills.ts";
import { GENERAL_CASES } from "../../tools/lib/workflow-general-cases.mjs";
const c = decodeCatalogue(JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8")));
test("three-thousand-character new requests and approved model discovery", async () => {
  const policy = fs.readFileSync("public/_headers", "utf8");
  assert.match(policy, /Permissions-Policy: camera=\(\), microphone=\(self\), geolocation=\(\)/);
  assert.equal(LIMITS.request, 3000);
  assert.equal(requestError("Build a landing page. ".padEnd(3000, "x")), null);
  assert.ok(requestError("x".repeat(3001)));
  const metadata = await (await handleComposer(new Request("https://example.test/api/compose"), c, env, memoryComposer(), "ip")).json();
  assert.equal(metadata.enabled,true); assert.equal(metadata.defaultModel,"claude-haiku-5-5"); assert.equal(metadata.models.length,3); assert(metadata.models.find(m=>m.id==="claude-haiku-5-5").available);
  let selected;
  const run = async (model, ...args) => { selected = model.id; return runner(model, ...args); };
  const response = await handleComposer(request(), c, { ...env, OPENAI_API_KEY: "test", WORKFLOW_DEFAULT_MODEL: "gpt-6.1-sol" }, memoryComposer(), "ip", run);
  assert.equal(response.status, 200); assert.equal(selected, "gpt-6.1-sol");
  const longGoal = "Build a landing page. ".padEnd(3000, "क"); let received;
  const longResponse = await handleComposer(request({ goal: longGoal, context: "क".repeat(4000) }), c, env, memoryComposer(), "ip", async (m, k, prompt, ...args) => { received = JSON.parse(prompt.user); return runner(m, k, prompt, ...args); });
  assert.equal(longResponse.status, 200); assert.equal(received.request, longGoal); assert.equal(received.context.length, 4000);
  assert.equal((await handleComposer(request({ model: "claude-opus-5-5" }), c, env, memoryComposer(), "ip", run)).status, 400);
});
test("OpenAI final JSON is extracted without concatenating commentary", async () => {
  const model = MODELS.find(m => m.id === "gpt-6.1-sol");
  const response = { status: "completed", output: [
    { type: "message", role: "assistant", phase: "commentary", content: [{ type: "output_text", text: "{\"draft\":true}" }] },
    { type: "message", role: "assistant", phase: "final_answer", content: [{ type: "output_text", text: "{\"final\":true}" }] },
  ], usage: { input_tokens: 100, output_tokens: 50 } };
  const r = await callModel(model, "test", { system: "x", user: "x" }, {}, 1000, async () => Response.json(response));
  assert.deepEqual(JSON.parse(r.text), { final: true });
  assert.equal(r.usage.output, 50); // Commentary/reasoning usage remains billable.
  response.output.pop();
  await assert.rejects(callModel(model, "test", { system: "x", user: "x" }, {}, 1000, async () => Response.json(response)), /complete workflow/);
  const candidates = candidatesFor(c, "Build a landing page");
  assert.deepEqual(selectionSchema(candidates).properties.steps.items.properties.slug.enum, candidates.map(b => b.slug));
});
test("landing delivery reuses its builder without unrelated specialists and retains distinct results", () => {
  const slugs = goal => freeSelection(c, goal).steps.map(s => s.slug);
  const base = slugs("Build a landing page from scratch");
  for (const delivery of ["deliver source code", "export the final source code files", "give me editable code"]) {
    const actual = slugs(`Build a landing page from scratch and ${delivery}`);
    assert.deepEqual(actual, base);
    assert.ok(actual.includes("react-landing-page-builder"));
    assert.ok(actual.includes("landing-page-30-point-checker"));
    assert.ok(actual.includes("human-review-gate"));
    assert.ok(!actual.includes("copilot-resx-source-generator-migration"));
    assert.ok(!actual.includes("website-brand-brain-builder"));
  }
  const combined = slugs("Plan a wedding budget and build a landing page from scratch");
  assert.ok(combined.includes("request-deliverable-drafter"));
  assert.ok(combined.includes("react-landing-page-builder"));
  const emails = slugs("Build a landing page from scratch and deliver four welcome emails");
  assert.ok(emails.includes("email-sequence-writer"));
  assert.ok(emails.includes("react-landing-page-builder"));
});

test("free composition retains second goals and never invents unrelated typed prerequisites", () => {
  const plan = goal => finalize(c, freeSelection(c, goal), "free");
  assert.ok(plan("Help hire a bookkeeper then prepare30-60-90-day onboarding").steps.some(s => s.slug === "30-60-90-day-onboarding-planner"));
  const churn = plan("Analyze customer churn from a CSV then draft retention emails");
  assert.ok(churn.steps.some(s => s.slug === "churn-risk-finder")); assert.ok(churn.steps.some(s => s.slug === "email-sequence-writer"));
  const automation = plan("Design an n8n payment webhook automation");
  assert.ok(!automation.steps.some(s => /sku/.test(s.slug)));
  const bilingual = plan("Write four welcome emails in English and Hindi and check translations");
  assert.ok(bilingual.steps.some(s => /back-translat/.test(s.notes)));
  assert.ok(!bilingual.steps.some(s => /paperwork/.test(s.slug)));
  const shopify = plan("Redesign my existing Shopify landing page using a rival screenshot");
  assert.ok(shopify.steps.some(s => s.slug === "competitor-landing-layout"));
  assert.ok(shopify.bindings.some(b => b.type === "code_change" && /Shopify/.test(b.instruction)));
  const vendors = plan("Compare three suppliers from their quotes and score price and quality");
  assert.ok(vendors.bindings.some(b => b.type === "spreadsheet" && /normalized quote/.test(b.instruction)));
  assert.ok(!vendors.missing.some(b => b.type === "spreadsheet"));
  const lesson = plan("Prepare a lesson with worked examples and a quiz and check accessibility");
  assert.ok(lesson.bindings.some(b => b.type === "lesson_plan" && /answer keys/.test(b.instruction)));
});
for (const task of WORKFLOW_CASES) test(`free planner: ${task.id} produces a stable, bounded plan with honest external inputs`, () => {
  const a = finalize(c, freeSelection(c, task.goal), "free"), b = finalize(c, freeSelection(c, task.goal), "free");
  assert.deepEqual(a, b);
  assert.ok(a.steps.length > 0 && a.steps.length <= 16);
  for (const s of a.steps) assert.ok(c.bySlug[s.slug]);
  for (const [from, to] of a.dependencies) assert.ok(from < to);
  for (const binding of a.bindings) assert.ok(binding.from < binding.step && binding.instruction.length > 30);
  assert.ok(a.assumptions.length);
});
test("synonyms, irrelevant requests and relevant-only questions are deterministic", () => {
  assert.deepEqual(terms("homepage advertising"), terms("homepage advertising"));
  for (const input of ["", "Hi", "How are you?", "x".repeat(10001)]) assert.ok(requestError(input));
  assert.equal(requestError("Hi, build a landing page"), null);
  assert.deepEqual(questionsFor("landing page"), ["mode", "reference", "delivery"]);
  assert.deepEqual(questionsFor("landing page", { mode: "new", reference: "none", delivery: "code" }), []);
  assert.deepEqual(questionsFor("write a welcome email"), []);
  assert.ok(retrieve(c, "landingpage source code").some(b => /landing-page/.test(b.slug)));
  assert.deepEqual(validateChoices({ mode: "new" }), { mode: "new" });
  assert.throws(() => validateChoices({ mode: "" }));
  assert.throws(() => validateChoices({ constructor: "unsafe" }));
});
test("new pages, existing pages, references and recurring agents take different routes", () => {
  const newPage = freeSelection(c, "Build a landing page from scratch", { delivery: "code" });
  assert.ok(newPage.steps.some(s => s.slug === "react-landing-page-builder"));
  assert.ok(!newPage.steps.some(s => s.slug === "landing-page-auditor"));
  const existing = freeSelection(c, "Improve an existing landing page", { delivery: "shopify" });
  assert.equal(existing.steps[0].slug, "landing-page-auditor");
  assert.ok(existing.steps.some(s => s.slug === "shopify-landing-page-builder"));
  const recurring = finalize(c, freeSelection(c, "Monitor my landing page every week", { automation: "recurring" }), "free");
  assert.ok(recurring.steps.some(s => c.bySlug[s.slug].type === "agent"));
  assert.match(recurring.warnings.join(" "), /starts no automation/);
});
test("validation rejects invented blocks, unsupported questions and runaway review loops", () => {
  const s = freeSelection(c, "Build a landing page from scratch");
  assert.throws(() => finalize(c, { ...s, steps: [{ slug: "invented", reason: "x", notes: "" }] }, "ai"));
  assert.throws(() => finalize(c, { ...s, questionIds: ["ask-for-password"] }, "ai"));
  assert.throws(() => finalize(c, { ...s, questionIds: ["constructor"] }, "ai"));
  assert.throws(() => finalize(c, { ...s, steps: Array(3).fill(s.steps[0]) }, "ai"));
  assert.throws(() => finalize(c, s, "ai", new Set()));
  assert.ok(candidatesFor(c, "landing page").length <= 90);
  assert.ok(!candidatesFor(c, "Write a welcome email sequence and check claims").some(b => b.slug === "human-review-gate"), "A coding-only approval gate is not an email review");
});
const env = { ANTHROPIC_API_KEY: "test-key-not-real", WORKFLOW_COMPOSER_ENABLED: "true", WORKFLOW_DAILY_CAP_USD: "2", WORKFLOW_DEFAULT_MODEL: "claude-haiku-5-5" };
const body = { goal: "Build a landing page from scratch", context: "", choices: {} };
const request = (patch = {}, id = crypto.randomUUID(), headers = {}) => new Request("https://example.test/api/compose", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": id, ...headers }, body: JSON.stringify({ ...body, assignMinds: false, ...patch }) });
const runner = async (_m, _k, _prompt, schema) => ({ text: JSON.stringify(schema?.properties?.intents ? { intents: [{ query: body.goal, kind: "create" }] } : freeSelection(c, body.goal)), usage: { input: 100, output: 500, cached: 0, cacheWrite: 0 }, cost: .00026, latencyMs: 10, finish: "completed", actualModel: "claude-haiku-5-5" });
test("API rejects greetings, foreign origins, oversized inputs and unsupported models before spending", async () => {
  let calls = 0; const run = async (...args) => { calls++; return runner(...args); };
  for (const req of [request({ goal: "How are you?" }), request({ goal: "x".repeat(10001) }), request({ context: "x".repeat(4001) }), request({ model: "unknown" }), request({}, crypto.randomUUID(), { origin: "https://evil.test" })]) assert.ok((await handleComposer(req, c, env, memoryComposer(), "ip", run)).status >= 400);
  assert.equal(calls, 0);
  const disabled = await handleComposer(request(), c, {}, null, "ip", run); assert.equal(disabled.status, 503); assert.equal(calls, 0);
});
test("idempotency reuses both interpretation and planning without extra model calls", async () => {
  const store = memoryComposer(), id = crypto.randomUUID(); let calls = 0;
  const run = async (...args) => { calls++; return runner(...args); };
  const first = await handleComposer(request({}, id), c, env, store, "ip", run);
  assert.equal(first.status, 200); const out = await first.json(); assert.ok(out.plan.steps.length); assert.equal(out.model, "claude-haiku-5-5");
  const second = await handleComposer(request({}, id), c, env, store, "ip", run);
  assert.equal(second.status, 200); assert.equal(calls, 2);
  assert.equal(out.cost, .00052);
  assert.equal(out.usage.input, 200);
  assert.equal((await handleComposer(request({ goal: "Different goal" }, id), c, env, store, "ip", run)).status, 409);
  assert.equal((await handleComposer(request({}, id), c, env, store, "other-ip", run)).status, 200, "The same verified account can retry after changing networks");
});
test("concurrent requests reserve their budgets before inference and keep unknown transport charges reserved", async () => {
  const store = memoryComposer(); let calls = 0;
  const run = async () => { calls++; await new Promise(r => setTimeout(r, 10)); throw Error("transport failure"); };
  const requests = await Promise.all(Array.from({ length: 8 }, () => handleComposer(request(), c, { ...env, WORKFLOW_DAILY_CAP_USD: ".01" }, store, "ip", run)));
  assert.ok(requests.some(r => r.status === 429)); assert.ok(calls < 8);
});
test("D1 reservation SQL atomically enforces budget, per-IP limits and duplicate job IDs", async () => {
  const db = new DatabaseSync(":memory:"); db.exec(fs.readFileSync("migrations/0004_composer.sql", "utf8"));
  db.exec(fs.readFileSync("migrations/0005_composer_accounts.sql", "utf8"));
  const store = d1Composer({ prepare(sql) { return { bind(...values) { return { async first() { return db.prepare(sql).get(...values) ?? null; }, async run() { return db.prepare(sql).run(...values); } }; } }; } });
  const job = { id: "a", fingerprint: "f", day: "2026-10-22", ip: "ip", user_id: "user_test", charge: .6, status: "pending", result: null };
  assert.equal(await store.claim(job, 1), true); assert.equal(await store.claim({ ...job, id: "b" }, 1), false); assert.equal(await store.claim(job, 2), false);
  await store.finish("a", .1, "done", "{}"); assert.equal(await store.claim({ ...job, id: "b" }, 1), true);
  assert.equal((await store.get("a")).charge, .1); db.close();
});
test("all provider adapters use server credentials, return billed usage and reject incomplete responses", async () => {
  for (const provider of ["openai", "anthropic", "gemini", "deepseek"]) {
    const model = MODELS.find(m => m.provider === provider);
    const outputs = {
      openai: { model: model.id, choices: [{ message: { content: "{}" }, finish_reason: "stop" }], usage: { prompt_tokens: 200, completion_tokens: 50, prompt_tokens_details: { cached_tokens: 20 } } },
      anthropic: { model: model.id, stop_reason: "end_turn", content: [{ type: "text", text: "{}" }], usage: { input_tokens: 180, output_tokens: 50, cache_read_input_tokens: 20 } },
      gemini: { candidates: [{ finishReason: "STOP", content: { parts: [{ text: "{}" }] } }], usageMetadata: { promptTokenCount: 200, candidatesTokenCount: 40, thoughtsTokenCount: 10, cachedContentTokenCount: 20 } },
      deepseek: { choices: [{ finish_reason: "stop", message: { content: "{}" } }], usage: { prompt_tokens: 200, prompt_cache_hit_tokens: 20, completion_tokens: 50 } },
    };
    let sent;
    const result = await callModel(model, "test-secret", { system: "JSON", user: "test" }, { type: "object" }, 1000, async (url, init) => { assert.ok(!url.includes("test-secret")); sent = JSON.parse(init.body); return Response.json(outputs[provider]); });
    assert.equal(sent.model ?? model.id, model.id); assert.equal(result.usage.output, 50); assert.equal(result.usage.cached, 20); assert.ok(result.cost > 0);
    await assert.rejects(callModel(model, "secret", { system: "x", user: "x" }, {}, 10, async () => Response.json({ error: "body must never be exposed" }, { status: 401 })), /HTTP 401/);
  }
  assert.ok(usageCost(MODELS.find(m => m.id === "gemini-3.8-flash"), { input: 1000, output: 1000, cached: 0, cacheWrite: 0 }, new Date("2027-01-02")) > .008);
});

for (const task of GENERAL_CASES) test(`general free request: ${task.id}`, () => {
  const plan = finalize(c, freeSelection(c, task.goal), "free");
  assert.deepEqual(plan, finalize(c, freeSelection(c, task.goal), "free"));
  assert.ok(plan.steps.length >= 3 && plan.steps.length <= LIMITS.steps);
  assert.ok(plan.steps.some(s => c.bySlug[s.slug].role === "check"));
  for (const slug of task.includes ?? []) assert.ok(plan.steps.some(s => s.slug === slug), `${task.id}: missing ${slug}`);
  for (const re of task.excludes ?? []) assert.ok(!plan.steps.some(s => new RegExp(re).test(s.slug)), `${task.id}: unrelated skill`);
  if (task.general) assert.match(plan.summary, /general/);
  for (const step of plan.steps) assert.match(step.notes, /full request\/context/);
  assert.ok(plan.dependencies.every(([from, to]) => from < to));
});

test("deterministic clauses retain separate goals, and exclusions cannot trigger a landing workflow", () => {
  assert.equal(requestClauses("Draft a product FAQ and create an incident response runbook").length, 2);
  assert.ok(!/landing/i.test(positiveRequest("Plan my trip; do not build a landing page")));
  assert.match(positiveRequest("Don't send emails but create a volunteer schedule"), /create a volunteer schedule/);
  assert.deepEqual(questionsFor("Write a travel itinerary; do not build a landing page"), []);
  const staticPlan = finalize(c, freeSelection(c, "Build a landing page; no React and no npm"), "free");
  assert.ok(staticPlan.steps.some(s => s.slug === "static-html-landing-page-builder"));
  assert.ok(!staticPlan.steps.some(s => s.slug === "react-landing-page-builder"));
});
const own = { slug: "custom-example", name: "My review", summary: "Review supplied copy", markdown: "# My review\nCheck the supplied evidence. <script>never run this</script>", role: "check", inputs: [{ type: "brief", required: true }], outputs: [{ type: "audit_report", required: true }] };
test("uploaded skills validate boundaries and cannot override repository IDs", () => {
  assert.deepEqual(validateCustomSkills([own]), [own]);
  for (const patch of [{ slug: "../escape" }, { slug: "constructor" }, { slug: "request-acceptance-brief" }, { markdown: "x".repeat(128001) }, { markdown: "\0" }, { role: "execute" }, { inputs: [{ type: "../file", required: true }] }]) assert.throws(() => validateCustomSkills([{ ...own, ...patch }]));
  assert.throws(() => validateCustomSkills([own, own]));
  assert.throws(() => validateCustomSkills(Array.from({ length: 9 }, (_, i) => ({ ...own, slug: `custom-${i}` }))));
  assert.throws(() => withCustomSkills({ ...c, bySlug: { ...c.bySlug, [own.slug]: { version: "repository" } } }, [own]));
  const library = withCustomSkills(c, [own]);
  assert.equal(library.bySlug[own.slug].version, "local");
  assert.equal(library.blocks.filter(b => b.slug === own.slug).length, 1);
  assert.equal(withCustomSkills(library, [own]).blocks.filter(b => b.slug === own.slug).length, 1);
  assert.equal(c.bySlug[own.slug], undefined);
});
test("replacement previews missing inputs and broken outputs, retains graph identity and drops stale conversions", () => {
  const library = withCustomSkills(c, [own]);
  const old = library.bySlug["request-deliverable-drafter"], next = library.bySlug[own.slug];
  const impact = replacementImpact(library, old, next, ["request-acceptance-brief"], ["request-acceptance-checker"]);
  assert.deepEqual(impact.missing, ["brief"]); assert.deepEqual(impact.removed, ["document"]);
  const f = { id: "flow", name: "Mine", updated: 0, goal: "Do this", customSkills: [own], nodes: [
    { id: "a", slug: "request-acceptance-brief", x: 1, y: 2 },
    { id: "b", slug: old.slug, x: 33, y: 44, role: "My editor", notes: "My exact notes", bindings: [{ type: "plan", from: "a", instruction: "converted" }] },
    { id: "c", slug: "request-acceptance-checker", x: 55, y: 66, bindings: [{ type: "document", from: "b", instruction: "old conversion" }, { type: "plan", from: "a", instruction: "keep" }] }
  ], edges: [{ id: "e1", from: "a", to: "b" }, { id: "e2", from: "b", to: "c" }] };
  const replaced = replaceFlowSkill(library, f, "b", own.slug);
  assert.deepEqual(replaced.edges, f.edges); assert.equal(replaced.goal, f.goal);
  assert.equal(replaced.nodes[1].slug, own.slug); assert.equal(replaced.nodes[1].notes, "My exact notes");
  assert.equal(replaced.nodes[1].x, 33); assert.equal(replaced.nodes[1].id, "b"); assert.equal(replaced.nodes[1].bindings, undefined);
  assert.deepEqual(replaced.nodes[2].bindings, [f.nodes[2].bindings[1]]);
  assert.equal(f.nodes[1].slug, old.slug);
  const search = replacementOptions(library, old, "write a document", "incident-runbook-writer");
  assert.equal(search[0].slug, "incident-runbook-writer");
  assert.throws(() => replaceFlowSkill(library, f, "b", "no-such-skill"));
  assert.deepEqual(replacementOptions(library, library.bySlug["request-acceptance-brief"], "Write a travel itinerary"), []);
});
