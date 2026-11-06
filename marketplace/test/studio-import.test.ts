// Studio: starting an agent from a trained pack (POST /api/studio/import). The pack comes from the real builder,
// is "trained" here by replacing its templates, zipped, and uploaded as application/zip.
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv, type TestEnv } from "./helpers.ts";
import { NOVA, FIXTURE_JOB_TYPES } from "./fixtures.ts";
import { handleFetch } from "../src/app.ts";
import { buildPack } from "../src/modules/packs/build.ts";
import { writeZip } from "../src/modules/packs/zip.ts";
import { composePlaybook } from "../src/modules/studio/import.ts";

const TRAINED_SOUL = `# Ria, Conversion copywriter

I write pages for small shops that have no time for fluff.

## How I think

I find the one reason a buyer says yes, then I build the page around it.

## When we disagree

If you want a claim we cannot prove, I say no and offer one we can.
`;
const TRAINED_PERSONALITY = `# How Ria talks and writes

## Tone

Direct and kind. I sound like a friend who has run a shop.

## Words I avoid

- revolutionary
- world-class
`;
const RULES = "R1. Never promise a result in a headline. Why: no one controls it. From brief 2, round 1.\nR2. Put the price on the first screen when the buyer gave one. Why: hidden prices lose trust. From brief 1, round 2.";

async function makeExpert(t: TestEnv, userId: string, jobTypes = ["landing-page-copy"]): Promise<string> {
  await t.api("GET", "/api/me", { user: userId });
  const id = `exp_${userId}`;
  await t.sql("INSERT INTO experts (id, user_id, status, display_name, job_types, created_at, updated_at) VALUES (?, ?, 'approved', ?, ?, 'x', 'x')",
    id, userId, `Expert ${userId}`, JSON.stringify(jobTypes));
  return id;
}

/** A training pack built from NOVA (linked to both fixture job types), as files keyed by path. */
async function trainingPack(): Promise<Map<string, string>> {
  const pack = await buildPack({ persona: NOVA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, options: { kind: "train", version: "2026.11.06", updated: "2026-11-06" } });
  return new Map(pack.files.map(f => [f.path, f.content]));
}

/** What a finished training leaves: real soul and personality, rules, the expert's know-how. */
async function trainedPack(): Promise<Map<string, string>> {
  const files = await trainingPack();
  files.set("soul.md", TRAINED_SOUL);
  files.set("personality.md", TRAINED_PERSONALITY);
  files.set("playbook.md", files.get("playbook.md")!.replace("Rules come from test rounds. See instructions.md, stage 6.", RULES));
  files.set("knowledge.md", `${files.get("knowledge.md")!}\n## My know-how\n\n### My decision rules\n\nIf the buyer has reviews, I put one above the fold, because proof beats adjectives.\n`);
  files.set("training/results.md", "# Results\n\nBrief 1: agent won.\n");
  return files;
}

async function zipOf(files: Map<string, string>, folder = "seo-strategist-agent"): Promise<Uint8Array> {
  return writeZip([...files].map(([p, content]) => ({ path: folder ? `${folder}/${p}` : p, data: content })));
}

const exec = { waitUntil() {}, passThroughOnException() {}, props: {} } as unknown as ExecutionContext;

async function upload(t: TestEnv, opts: { user?: string; zip: Uint8Array; jobTypeId?: string; type?: string }) {
  const url = new URL("/api/studio/import", t.env.APP_ORIGIN);
  if (opts.jobTypeId !== undefined) url.searchParams.set("job_type_id", opts.jobTypeId);
  const headers: Record<string, string> = { "content-type": opts.type ?? "application/zip" };
  if (opts.user) headers["x-test-user"] = opts.user;
  const res = await handleFetch(new Request(url, { method: "POST", headers, body: opts.zip.slice() }), t.env, exec);
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

async function sha256Hex(bytes: Uint8Array) {
  const d = await crypto.subtle.digest("SHA-256", bytes.slice());
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}

test("an approved expert imports a trained pack: a draft studio agent with the composed playbook, and the pack stored", async () => {
  const t = await testEnv();
  const expertId = await makeExpert(t, "user_ria");
  const pack = await trainedPack();
  // What a real trained pack carries besides: past work in examples/, the zip's skill copies (one matching skills/,
  // one the coach added only there), and pack.json hashes that are stale after training.
  pack.set("examples/menu-page.md", "# Menu page rewrite\n\nRights: I made this work\n\n## The brief\n\nClient A, a bakery, wanted more orders.\n");
  pack.set(".claude/skills/landing-page-copy/SKILL.md", pack.get("skills/landing-page-copy/SKILL.md")!);
  pack.set(".agents/skills/menu-copy/SKILL.md", "---\nname: menu-copy\ndescription: Writes menu pages.\n---\n\n# Menu copy\n");
  const manifest = JSON.parse(pack.get("pack.json")!);
  manifest.trained_by = "Ria";
  manifest.based_on = { agent_id: "nova-seo", version: "2026.11.06", source: "https://agents.useaiblocks.com/agents/nova-seo" };
  manifest.files = manifest.files.map((f: any) => ({ ...f, sha256: "0".repeat(64) }));
  pack.set("pack.json", JSON.stringify(manifest, null, 2));
  const zip = await zipOf(pack);
  const res = await upload(t, { user: "user_ria", zip, jobTypeId: "landing-page-copy" });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  const agentId = res.body.agentId;
  assert.match(agentId, /^agt_/);
  assert.equal(res.body.agent.id, agentId);
  assert.deepEqual(res.body.trimmed, []);
  assert.equal(res.body.updated, false);
  assert.equal(res.body.examplesAdded, 0);
  assert.ok(res.body.warnings.some((w: string) => /base method: make it yours/.test(w)), "untouched base sections are pointed out");
  assert.ok(res.body.warnings.some((w: string) => /examples were kept private/.test(w)), "without examples_rights the examples stay private");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_examples"))[0].n, 0);

  const [agent] = await t.sql("SELECT * FROM agents WHERE id = ?", agentId);
  assert.equal(agent.kind, "expert");
  assert.equal(agent.expert_id, expertId);
  assert.equal(agent.job_type_id, "landing-page-copy");
  assert.equal(agent.status, "draft");

  const [studio] = await t.sql("SELECT * FROM studio_agents WHERE agent_id = ?", agentId);
  assert.equal(studio.playbook_source, "expert");
  const playbook: string = studio.playbook;
  assert.ok(playbook.length <= 20000 && playbook.length === res.body.playbookChars);
  assert.ok(playbook.startsWith("# Playbook: SEO strategist"));
  const at = (s: string) => { const i = playbook.indexOf(s); assert.ok(i >= 0, `missing ${s}`); return i; };
  assert.ok(at("## How I work") < at("## Rules I learned"));
  assert.ok(at("## Rules I learned") < at("## How I work and write"));
  assert.ok(at("## How I work and write") < at("## What I know"));
  at("R1. Never promise a result in a headline.");
  at("R2. Put the price on the first screen");
  at("I find the one reason a buyer says yes");
  at("Direct and kind.");
  at("If the buyer has reviews, I put one above the fold");
  assert.ok(!playbook.includes("<!--"), "template comments are left out");
  assert.equal(playbook.match(/## Rules I learned/g)!.length, 1);

  const [stored] = await t.sql("SELECT * FROM studio_pack_imports WHERE agent_id = ?", agentId);
  const files = JSON.parse(stored.files) as { path: string; bytes: number; sha256: string; content: string }[];
  assert.ok(files.some(f => f.path === "soul.md" && f.content === TRAINED_SOUL), "paths start at the pack root");
  assert.ok(files.some(f => f.path === "training/results.md"));
  // Hashes are worked out on upload; the zeros in the uploaded pack.json are ignored.
  for (const f of files) {
    const bytes = new TextEncoder().encode(f.content);
    assert.equal(f.bytes, bytes.byteLength, f.path);
    assert.equal(f.sha256, await sha256Hex(bytes), f.path);
  }
  // examples/ is kept apart, never with the pack files.
  assert.ok(!files.some(f => f.path.startsWith("examples/")));
  const examples = JSON.parse(stored.examples) as { path: string; sha256: string; content: string }[];
  assert.deepEqual(examples.map(e => e.path).sort(), ["examples/README.md", "examples/menu-page.md"]);
  // The skill copy that matches skills/ is dropped; the one only in .agents/skills is kept.
  assert.ok(!files.some(f => f.path.startsWith(".claude/")));
  assert.ok(files.some(f => f.path === ".agents/skills/menu-copy/SKILL.md"));
  assert.equal(stored.bytes, zip.byteLength);
  assert.equal(stored.sha256, await sha256Hex(zip));
  const [imported] = await t.sql("SELECT data FROM events WHERE type = 'studio.pack_imported' AND entity_id = ?", agentId);
  const data = JSON.parse(imported.data);
  assert.equal(data.trained_by, "Ria");
  assert.equal(data.based_on.agent_id, "nova-seo");
  assert.equal(data.examples, 2);

  const events = await t.sql("SELECT type, actor_kind FROM events WHERE entity = 'agent' AND entity_id = ? ORDER BY seq", agentId);
  assert.deepEqual(events.map(e => e.type), ["agent.created", "studio.playbook_edited", "studio.pack_imported"]);
  assert.ok(events.every(e => e.actor_kind === "expert"));

  // The agent is now an ordinary studio agent.
  const detail = await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_ria" });
  assert.equal(detail.status, 200);
  assert.equal(detail.body.interview.playbookSource, "expert");
  // A zip of the files without a top folder works too (another expert: their own new agent).
  await makeExpert(t, "user_flat");
  const flat = await upload(t, { user: "user_flat", zip: await zipOf(await trainedPack(), ""), jobTypeId: "landing-page-copy" });
  assert.equal(flat.status, 201);
  assert.notEqual(flat.body.agentId, agentId);
});

test("re-uploading for the same job updates that agent; another job makes a new one; a studio-built agent is not overwritten", async () => {
  const t = await testEnv();
  await makeExpert(t, "user_ria", ["landing-page-copy", "seo-blog-post"]);
  const first = await upload(t, { user: "user_ria", zip: await zipOf(await trainedPack()), jobTypeId: "landing-page-copy" });
  assert.equal(first.status, 201);
  const agentId = first.body.agentId;

  const newer = await trainedPack();
  newer.set("playbook.md", newer.get("playbook.md")!.replace("R2. Put the price", "R3. Answer the top objection next to the button. Why: it is where people stop. From brief 4.\nR2. Put the price"));
  const again = await upload(t, { user: "user_ria", zip: await zipOf(newer), jobTypeId: "landing-page-copy" });
  assert.equal(again.status, 200, JSON.stringify(again.body));
  assert.equal(again.body.updated, true);
  assert.equal(again.body.agentId, agentId);
  const [studio] = await t.sql("SELECT playbook, playbook_source FROM studio_agents WHERE agent_id = ?", agentId);
  assert.match(studio.playbook, /R3\. Answer the top objection/);
  assert.equal(studio.playbook_source, "expert");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_pack_imports WHERE agent_id = ?", agentId))[0].n, 2, "each upload keeps its own row");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM agents WHERE expert_id = 'exp_user_ria'"))[0].n, 1);
  const imported = await t.sql("SELECT data FROM events WHERE type = 'studio.pack_imported' AND entity_id = ? ORDER BY seq", agentId);
  assert.deepEqual(imported.map(e => JSON.parse(e.data).update), [false, true]);

  // The same expert and another job in the pack: a new agent, as before.
  const blog = await upload(t, { user: "user_ria", zip: await zipOf(await trainedPack()), jobTypeId: "seo-blog-post" });
  assert.equal(blog.status, 201);
  assert.notEqual(blog.body.agentId, agentId);

  // An agent built in the studio (no pack) for the job is never overwritten by a pack: the usual 409.
  await makeExpert(t, "user_sam", ["landing-page-copy"]);
  assert.equal((await t.api("POST", "/api/studio/agents", { user: "user_sam", body: { jobTypeId: "landing-page-copy" } })).status, 201);
  const clash = await upload(t, { user: "user_sam", zip: await zipOf(await trainedPack()), jobTypeId: "landing-page-copy" });
  assert.equal(clash.status, 409);
  assert.equal(clash.body.error.code, "agent_exists");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_pack_imports i JOIN agents a ON a.id = i.agent_id WHERE a.expert_id = 'exp_user_sam'"))[0].n, 0);
});

const FULL_EXAMPLE = `# Menu page rewrite for a bakery

Rights: The client agreed I may use it
When: March 2026

## The brief

Client A, a family bakery with two shops, wanted more pre-orders for celebration cakes from its menu page.

## What I delivered

A rewritten menu page that leads with the three cakes people order most, a clear price for each size, and one button to pre-order with the pick-up day.

## The result

Not measured.

## What made it good

I cut the page to the three cakes people ask about and put the price next to each one.
`;

test("an imported agent counts as interviewed and marked up, builds without studio examples, and examples join only with examples_rights=1", async () => {
  const t = await testEnv();
  await makeExpert(t, "user_ria");
  const pack = await trainedPack();
  pack.set("examples/menu-page.md", FULL_EXAMPLE);
  pack.set("examples/notes-only.md", "# Just notes\n\nSome thoughts, no sections.\n");

  // Without the flag: private only, and the steps that the pack stands in for are done.
  const res = await upload(t, { user: "user_ria", zip: await zipOf(pack), jobTypeId: "landing-page-copy" });
  assert.equal(res.status, 201);
  const agentId = res.body.agentId;
  const steps = (await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_ria" })).body.steps as { id: string; done: boolean }[];
  assert.deepEqual(Object.fromEntries(steps.map(s => [s.id, s.done])), { interview: true, examples: false, markup: true, build: false, test: false, publish: false });
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_examples"))[0].n, 0);

  // Build works with no studio examples or marks; publishing still needs the test bench.
  const built = await t.api("POST", `/api/studio/agents/${agentId}/build`, { user: "user_ria", body: {} });
  assert.equal(built.status, 201, JSON.stringify(built.body));
  assert.equal(built.body.build.version, 1);
  const publish = await t.api("POST", `/api/studio/agents/${agentId}/publish`, { user: "user_ria", body: { version: 1 } });
  assert.equal(publish.status, 409);
  assert.equal(publish.body.error.code, "not_tested");

  // A studio agent that did not come from a pack still needs examples and marks to build.
  await makeExpert(t, "user_sam");
  const plain = await t.api("POST", "/api/studio/agents", { user: "user_sam", body: { jobTypeId: "landing-page-copy" } });
  await t.api("POST", `/api/studio/agents/${plain.body.agent.id}/playbook`, { user: "user_sam", body: { playbook: "My playbook. ".repeat(20) } });
  const notReady = await t.api("POST", `/api/studio/agents/${plain.body.agent.id}/build`, { user: "user_sam", body: {} });
  assert.equal(notReady.status, 409);
  assert.equal(notReady.body.error.code, "not_ready");

  // With examples_rights=1 the examples become studio examples (once), through the studio's own checks.
  const url = new URL("/api/studio/import", t.env.APP_ORIGIN);
  url.searchParams.set("job_type_id", "landing-page-copy");
  url.searchParams.set("examples_rights", "1");
  const withRights = await handleFetch(new Request(url, { method: "POST", headers: { "content-type": "application/zip", "x-test-user": "user_ria" }, body: (await zipOf(pack)).slice() }), t.env, exec);
  const body = await withRights.json() as any;
  assert.equal(withRights.status, 200, JSON.stringify(body));
  assert.equal(body.examplesAdded, 1);
  assert.ok(body.warnings.some((w: string) => /examples\/notes-only\.md was not added/.test(w)));
  const rows = await t.sql("SELECT * FROM studio_examples WHERE agent_id = ?", agentId);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].title, "Menu page rewrite for a bakery");
  assert.equal(rows[0].rights, "client_permission");
  assert.match(rows[0].brief, /Client A, a family bakery/);
  assert.match(rows[0].result, /three cakes people order most/);
  assert.match(rows[0].notes, /price next to each one/);
  const [latest] = await t.sql("SELECT examples_rights FROM studio_pack_imports WHERE agent_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1", agentId);
  assert.equal(latest.examples_rights, 1);
  const stepsAfter = (await t.api("GET", `/api/studio/agents/${agentId}`, { user: "user_ria" })).body.steps as { id: string; done: boolean }[];
  assert.equal(stepsAfter.find(s => s.id === "examples")!.done, true);
  // Uploading the same pack again does not add the same example twice.
  const third = await handleFetch(new Request(url, { method: "POST", headers: { "content-type": "application/zip", "x-test-user": "user_ria" }, body: (await zipOf(pack)).slice() }), t.env, exec);
  assert.equal(((await third.json()) as any).examplesAdded, 0);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_examples WHERE agent_id = ?", agentId))[0].n, 1);
});

test("import is for approved experts, and needs a zip", async () => {
  const t = await testEnv();
  const zip = await zipOf(await trainedPack());
  assert.equal((await upload(t, { zip, jobTypeId: "landing-page-copy" })).status, 401);
  assert.equal((await upload(t, { user: "user_buyer", zip, jobTypeId: "landing-page-copy" })).status, 403);
  await makeExpert(t, "user_ria");
  const json = await upload(t, { user: "user_ria", zip, jobTypeId: "landing-page-copy", type: "application/json" });
  assert.equal(json.status, 415);
  const noJob = await upload(t, { user: "user_ria", zip });
  assert.equal(noJob.status, 400);
  assert.equal(noJob.body.error.code, "job_type_required");
  const tooBig = await upload(t, { user: "user_ria", zip: new Uint8Array(2 * 1024 * 1024 + 10), jobTypeId: "landing-page-copy" });
  assert.equal(tooBig.status, 413);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM agents"))[0].n, 0);
});

test("import rejects a template soul, a secret, path traversal, an oversize file and a job type not in the pack", async () => {
  const t = await testEnv();
  await makeExpert(t, "user_ria", ["landing-page-copy"]);
  const send = async (files: Map<string, string>, jobTypeId = "landing-page-copy") => upload(t, { user: "user_ria", zip: await zipOf(files), jobTypeId });
  const expectError = (res: { status: number; body: any }, status: number, code: string) => {
    assert.equal(res.status, status, JSON.stringify(res.body));
    assert.equal(res.body.error.code, code);
    assert.ok(res.body.error.message.length > 20);
  };

  // Straight from the download: soul.md is still the template.
  expectError(await send(await trainingPack()), 400, "pack_not_trained");
  const halfDone = await trainedPack();
  halfDone.set("personality.md", (await trainingPack()).get("personality.md")!);
  expectError(await send(halfDone), 400, "pack_not_trained");

  const secret = await trainedPack();
  secret.set("examples/launch.md", `# Launch page\n\nOur key was sk-ant-api03-${"a".repeat(40)} for the test.\n`);
  expectError(await send(secret), 400, "remove_secret");

  // A name the zip writer would refuse, patched into the archive afterwards.
  const evil = await trainedPack();
  evil.set("zz/evil.md", "x");
  const zip = await zipOf(evil, "");
  const from = new TextEncoder().encode("zz/evil.md"), to = new TextEncoder().encode("../evil.md");
  for (let i = 0; i + from.length <= zip.length; i++) if (from.every((b, j) => zip[i + j] === b)) zip.set(to, i);
  expectError(await upload(t, { user: "user_ria", zip, jobTypeId: "landing-page-copy" }), 400, "unsafe_path");

  const big = await trainedPack();
  big.set("examples/huge.md", `# Huge\n\n${"A long past job. ".repeat(14000)}`);
  expectError(await send(big), 413, "entry_too_large");

  const binary = await trainedPack();
  binary.set("logo.png", "not really a png");
  expectError(await send(binary), 400, "file_type_not_allowed");

  const noSoul = await trainedPack();
  noSoul.delete("soul.md");
  expectError(await send(noSoul), 400, "pack_incomplete");

  const agentPack = await trainedPack();
  agentPack.set("pack.json", agentPack.get("pack.json")!.replace('"kind": "train"', '"kind": "agent"'));
  expectError(await send(agentPack), 400, "not_a_training_pack");

  expectError(await send(await trainedPack(), "customer-faq"), 400, "job_type_not_in_pack");
  // In the pack, but not a job this expert was approved for: the studio's own rule answers.
  expectError(await send(await trainedPack(), "seo-blog-post"), 403, "job_type_not_approved");

  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM agents"))[0].n, 0, "no agent is created by a refused import");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM studio_pack_imports"))[0].n, 0);
});

test("the composed playbook fits 20,000 characters: knowledge is trimmed first, the rules never", () => {
  const rules = Array.from({ length: 30 }, (_, i) => `R${i + 1}. Rule number ${i + 1}: check the thing before you ship it.`).join("\n");
  const playbook = `# Playbook\n\n## How I work\n\n${"I read the brief twice. ".repeat(300)}\n\n## Rules I learned\n\n${rules}\n`;
  const knowledge = `# What I know\n\n${Array.from({ length: 400 }, (_, i) => `Fact ${i}: something worth knowing about the role, with a source [${i}].`).join("\n\n")}\n\n## My know-how\n\nIf X, I do Y.\n`;
  const out = composePlaybook({ playbook, soul: TRAINED_SOUL, personality: TRAINED_PERSONALITY, knowledge });
  assert.ok(out.playbook.length <= 20000, String(out.playbook.length));
  assert.deepEqual(out.trimmed, ["knowledge"]);
  assert.ok(out.playbook.includes(rules), "every rule kept");
  assert.ok(out.playbook.includes("I find the one reason a buyer says yes"));
  assert.ok(out.playbook.includes("### My know-how\n\nIf X, I do Y."), "the expert's own know-how comes before the role knowledge");

  // When the rules alone are too long, the import says so instead of cutting them.
  assert.throws(() => composePlaybook({ playbook: `## Rules I learned\n\n${"R1. A very long rule. ".repeat(1200)}`, soul: "", personality: "", knowledge: "" }), /Rules I learned/);
  // A huge playbook body is cut after knowledge and voice, still keeping the rules.
  const huge = composePlaybook({ playbook: `${"Step. ".repeat(5000)}\n\n## Rules I learned\n\n${rules}`, soul: TRAINED_SOUL, personality: TRAINED_PERSONALITY, knowledge });
  assert.ok(huge.playbook.length <= 20000 && huge.playbook.includes(rules));
  assert.deepEqual(huge.trimmed, ["knowledge", "how_i_work_and_write", "playbook"]);
});
