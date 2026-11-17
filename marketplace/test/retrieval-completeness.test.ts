import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import type { Env } from "../src/env.ts";
import { askPack, forgetPackIndexes, MAX_FILE_CHARS, MAX_INDEX_FILE_CHARS, MAX_PENDING_INDEX_BUILDS, packKnowledgeIndex, readPackFile, type PackIndex } from "../src/modules/mcp/pack-files.ts";
import { KnowledgeIndex, chunkMarkdown, knowledgeMap } from "../src/modules/packs/retrieve.ts";
import { CardIndex, type Card, type Source, type Vertical } from "../src/modules/knowledge/cards.ts";
import { verticalBundle } from "../src/modules/knowledge/bundle.ts";
import { forgetVerticals, verticalIndex } from "../src/modules/knowledge/service.ts";
beforeEach(() => { forgetPackIndexes(); forgetVerticals(); });
function fixture(texts: Record<string, string>) {
  const reads: string[] = [];
  const index: PackIndex = { agent_id: "retrieval-fixture", version: "1", updated: "2026-11-17", knowledge: null,
    files: Object.entries(texts).map(([path, text]) => ({ path, url: `/packs/retrieval-fixture/${path}`, bytes: Buffer.byteLength(text), purpose: "Illustrative retrieval test", kind: "knowledge" })) };
  const env = { APP_ORIGIN: "https://retrieval.test", ASSETS: { async fetch(req: Request) {
    const url = new URL(req.url).pathname; reads.push(url); const f = index.files.find(f => f.url === url);
    return f && f.path in texts ? new Response(texts[f.path]) : new Response("Missing", { status: 404 });
  } } } as unknown as Env;
  return { env, index, reads };
}
test("response truncation does not truncate indexed evidence; all files beyond 160 are searchable", async () => {
  const texts = Object.fromEntries(Array.from({ length: 171 }, (_, n) => [`skills/task-${n}/SKILL.md`, `# Method ${n}\n\nGeneric documented method.`]));
  texts["knowledge.md"] = `# Intro\n\n${"Initial generic evidence.\n\n".repeat(3000)}\n# Late evidence\n\nQuasar repayment reconciliation preserves settlement identifiers.`;
  texts["skills/task-170/SKILL.md"] = "# Last task\n\nZephyr refunds reconcile currency and settlement.";
  const { env, index } = fixture(texts);
  const short = await readPackFile(env, index.files.find(f => f.path === "knowledge.md")!);
  assert.equal(short.trimmed, true); assert.equal(short.text.length, MAX_FILE_CHARS);
  const built = await packKnowledgeIndex(env, index);
  assert.equal(built.coverage.expected_files, 172); assert.equal(built.coverage.indexed_files, 172);
  assert.ok(built.chunks.some(c => c.text.includes("Quasar repayment")));
  assert.equal(built.ask("Zephyr refunds").passages[0].path, "skills/task-170/SKILL.md");
  const answer = await askPack(env, index, ["Quasar repayment"]);
  assert.equal(answer.index_coverage.complete, true); assert.equal(answer.business_data_ready, false);
});
test("missing evidence rejects the complete index and later retry succeeds", async () => {
  const texts = { "knowledge.md": "# In stock\n\nInventory reconciliation." }; const { env, index } = fixture(texts);
  index.files.push({ path: "skills/missing.md", url: "/packs/retrieval-fixture/skills/missing.md", bytes: 10, kind: "knowledge", purpose: "missing" });
  await assert.rejects(packKnowledgeIndex(env, index), /could not be read/);
  Object.assign(texts, { "skills/missing.md": "# Recovered\n\nRecovery evidence." });
  assert.equal((await packKnowledgeIndex(env, index)).coverage.indexed_files, 2);
});
test("oversize evidence rejects the full index instead of silently truncating it", async () => {
  const { env, index } = fixture({ "knowledge.md": "x".repeat(MAX_INDEX_FILE_CHARS + 1) });
  await assert.rejects(packKnowledgeIndex(env, index), /Index incomplete.*exceeds/);
});
test("unsafe and duplicate manifest paths fail before fetch", async () => {
  for (const url of ["/packs/../private.md", "/packs/%2e%2e/private.md", "/packs/a/%2f../private.md", "/packs/a/x.md?private=1", "https://other.test/x.md"]) {
    const { env, index, reads } = fixture({ "knowledge.md": "# Test" }); index.files[0].url = url;
    await assert.rejects(packKnowledgeIndex(env, index), /unsafe/); assert.equal(reads.length, 0);
    await assert.rejects(readPackFile(env, index.files[0]), /safe pack/);
  }
  const { env, index } = fixture({ "knowledge.md": "# Test" }); index.files.push({ ...index.files[0] });
  await assert.rejects(packKnowledgeIndex(env, index), /duplicate/);
});
test("same display version with changed manifest rebuilds the index", async () => {
  const texts = { "knowledge.md": "# First\n\nOld first evidence." }; const { env, index } = fixture(texts);
  const first = await packKnowledgeIndex(env, index);
  texts["knowledge.md"] = "# Second\n\nNew second evidence with a different byte count."; index.files[0].bytes = Buffer.byteLength(texts["knowledge.md"]);
  const second = await packKnowledgeIndex(env, index); assert.notEqual(first, second);
  assert.ok(second.chunks.some(c => c.text.includes("New second")));
});
test("pack synonyms are loaded by the actual serving entry point", async () => {
  const { env, index } = fixture({ "knowledge.md": "# Replenishment\n\nReorder point inventory safety stock.", "knowledge/ecommerce/synonyms.json": JSON.stringify({ groups: [["quasar", "replenishment"]] }) });
  assert.equal((await askPack(env, index, ["quasar"])).passages[0]?.path, "knowledge.md");
});
test("unique-path selection precedes top-k", () => {
  const files = Array.from({ length: 5 }, (_, n) => ({ path: `card-${n}.md`, text: `# Inventory source ${n}\n\n${"Inventory delivery stock. ".repeat(150)}\n\n${"Inventory delivery stock. ".repeat(150)}` }));
  assert.equal(new Set(new KnowledgeIndex(files).ask("inventory delivery", { k: 5, uniquePath: true }).passages.map(p => p.path)).size, 5);
});
const vertical: Vertical = { schema: "ai-blocks-vertical/1", id: "fixture", name: "Fixture", summary: "Illustrative", updated: "2026-11-17", tiers: {}, modules: [{ code: "OPS", name: "Operations", review_due_days: 30 }] };
const source: Source = { id: "S0001", title: "Illustrative reference", author: "Fixture", url: "https://example.com", date: "2026-11-17", rights: "owned", tier: 1, modules: ["OPS"], why: "Test", cards: 5, public: true };
function card(n: number): Card { return { id: `OPS-000${n}`, modules: ["OPS"], topics: [], claim: "Replenishment must account for inventory commitments.", body: "Replenishment inventory committed stock. ".repeat(150), conditions: "Known lead time.", fails_when: "Unknown inbound timing.", scope: "baseline", tier: 1, numbers: [], asks: [], platforms: [], platform: [], jurisdiction: [], marketplace: [], mode: "", source: source.id, evidence: { where: "Fixture" }, strength: "illustrative", public: true }; }
test("built vertical and service preserve synonyms and parent-card conditions", async () => {
  const cards = Array.from({ length: 5 }, (_, i) => card(i));
  const bundle = verticalBundle(vertical, cards, [source], { synonyms: { groups: [["zephyr", "replenishment"]] } }); assert.ok(bundle.index.synonyms);
  const env = { APP_ORIGIN: "https://vertical.test", ASSETS: { fetch: async () => Response.json(bundle.index) } } as unknown as Env;
  const answer = (await verticalIndex(env, "fixture"))!.index.ask("zephyr", { k: 5 });
  assert.equal(answer.hits.length, 5); assert.equal(answer.hits[0].card.conditions, "Known lead time."); assert.equal(answer.business_data_ready, false);
  assert.equal(new CardIndex(vertical, cards, [source]).ask("zephyr").hits.length, 0);
});
test("file pagination reconstructs complete source and validates offsets", async () => {
  const body = "\u03b1 reference line\n".repeat(9000); const { env, index } = fixture({ "knowledge.md": body });
  let offset: number | null = 0; const pages: string[] = [];
  while (offset !== null) { const page = await readPackFile(env, index.files[0], MAX_FILE_CHARS, offset); assert.equal(page.total_chars, body.length); pages.push(page.text); offset = page.next_offset; }
  assert.equal(pages.join(""), body); assert.ok(pages.length > 1);
  await assert.rejects(readPackFile(env, index.files[0], MAX_FILE_CHARS, -1), /offset/);
  await assert.rejects(readPackFile(env, index.files[0], MAX_FILE_CHARS, body.length + 1), /beyond/);
});


test("pack answers expand a selected card to its conditions and source and deduplicate its passages", async () => {
  const texts = { "knowledge/ecommerce/OPS.md": "# Operations\n\n## Replenish carefully\n\nCard OPS-0001. Tier 1, baseline.\n\n" + "Replenishment stock arrival forecast. ".repeat(180) + "\n\n**Holds when:** Committed stock is reconciled.\n\n**Fails when:** Arrival dates are unknown.\n\n**Source:** Illustrative inventory ledger.\n\n## Another check\n\nCard OPS-0002. Tier 1, baseline.\n\nReplenishment requires inspecting inbound stock.\n\n**Source:** Illustrative inbound ledger." };
  const { env, index } = fixture(texts);
  const answer = await askPack(env, index, ["replenishment stock arrival forecast"], { k: 2 });
  assert.equal(answer.passages.length, 2);
  const first = answer.passages.find(p => p.text.includes("OPS-0001"))!;
  assert.match(first.text, /Holds when/); assert.match(first.text, /Fails when/); assert.match(first.text, /Source/);
});


test("same-byte-count rebuilds use source hashes and mixed-release files fail closed", async () => {
  const texts = { "knowledge.md": "# Alpha\n\nFirst evidence." };
  const { env, index } = fixture(texts);
  const digest = (s: string) => createHash("sha256").update(s).digest("hex");
  index.files[0].sha256 = digest(texts["knowledge.md"]);
  const first = await packKnowledgeIndex(env, index);
  texts["knowledge.md"] = "# Bravo\n\nOther evidence.";
  assert.equal(Buffer.byteLength(texts["knowledge.md"]), index.files[0].bytes);
  index.files[0].sha256 = digest(texts["knowledge.md"]);
  const next = await packKnowledgeIndex(env, index); assert.notEqual(first, next);
  texts["knowledge.md"] = "# Wrong\n\nMixed evidence.";
  await assert.rejects(readPackFile(env, index.files[0]), /hash mismatch/);
});

test("oversize asset headers fail before allocating the body", async () => {
  const { index } = fixture({ "knowledge.md": "small" });
  const env = { APP_ORIGIN: "https://limit.test", ASSETS: { fetch: async () => new Response("small", { headers: { "content-length": "32000001" } }) } } as unknown as Env;
  await assert.rejects(readPackFile(env, index.files[0]), /source read limit/);
});


function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }

test("distinct cold indexes serialize and a queued duplicate shares the same build", async () => {
  const first = fixture({ "knowledge.md": "# First\n\nFirst evidence." });
  const second = fixture({ "knowledge.md": "# Second\n\nSecond evidence." }); second.index.agent_id = "second-fixture";
  const began = deferred<void>(), release = deferred<void>();
  let firstFetches = 0, secondFetches = 0;
  first.env.ASSETS = { fetch: async () => { firstFetches++; began.resolve(); await release.promise; return new Response("# First\n\nFirst evidence."); } } as unknown as Env["ASSETS"];
  second.env.ASSETS = { fetch: async () => { secondFetches++; return new Response("# Second\n\nSecond evidence."); } } as unknown as Env["ASSETS"];
  const a = packKnowledgeIndex(first.env, first.index); await began.promise;
  const b = packKnowledgeIndex(second.env, second.index);
  const duplicate = packKnowledgeIndex(first.env, first.index);
  assert.equal(a, duplicate); assert.equal(secondFetches, 0);
  release.resolve(); const [aa, bb] = await Promise.all([a, b]);
  assert.equal(firstFetches, 1); assert.equal(secondFetches, 1); assert.notEqual(aa, bb);
  await packKnowledgeIndex(second.env, second.index); assert.equal(secondFetches, 1, "completed most-recent corpus is cached");
  await packKnowledgeIndex(first.env, first.index); assert.equal(firstFetches, 2, "older completed corpus is evicted");
});

test("a failed cold build drains its batch, releases queued work and permits retry", async () => {
  const broken = fixture({ "knowledge.md": "# Broken", "skills/slow.md": "# Slow" });
  const good = fixture({ "knowledge.md": "# Good\n\nRecovery evidence." }); good.index.agent_id = "after-failure";
  const started = deferred<void>(), release = deferred<void>(); let missing = true, goodFetches = 0;
  broken.env.ASSETS = { fetch: async (req: Request) => {
    if (new URL(req.url).pathname.endsWith("slow.md")) { started.resolve(); await release.promise; return new Response("# Slow"); }
    return missing ? new Response("missing", { status: 404 }) : new Response("# Recovered");
  } } as unknown as Env["ASSETS"];
  good.env.ASSETS = { fetch: async () => { goodFetches++; return new Response("# Good"); } } as unknown as Env["ASSETS"];
  const failed = packKnowledgeIndex(broken.env, broken.index); const checked = assert.rejects(failed, /could not be read/);
  await started.promise; const queued = packKnowledgeIndex(good.env, good.index);
  await Promise.resolve(); assert.equal(goodFetches, 0, "queue must wait for every read in the failed batch");
  release.resolve(); await checked; await queued; assert.equal(goodFetches, 1);
  missing = false; assert.equal((await packKnowledgeIndex(broken.env, broken.index)).coverage.indexed_files, 2);
});

test("cold-build queue is bounded and a reset cannot publish an obsolete in-flight corpus", async () => {
  const release = deferred<void>(), began = deferred<void>();
  const first = fixture({ "knowledge.md": "# Held" });
  first.env.ASSETS = { fetch: async () => { began.resolve(); await release.promise; return new Response("# Held"); } } as unknown as Env["ASSETS"];
  const jobs = [packKnowledgeIndex(first.env, first.index)]; await began.promise;
  for (let i = 1; i < MAX_PENDING_INDEX_BUILDS; i++) { const f = fixture({ "knowledge.md": "# Queued" }); f.index.agent_id = `queue-${i}`; jobs.push(packKnowledgeIndex(f.env, f.index)); }
  const excess = fixture({ "knowledge.md": "# Excess" }); excess.index.agent_id = "excess";
  await assert.rejects(packKnowledgeIndex(excess.env, excess.index), /indexing is busy/);
  forgetPackIndexes(); release.resolve(); await Promise.all(jobs);
  const retry = await packKnowledgeIndex(excess.env, excess.index); assert.equal(retry.coverage.indexed_files, 1);
});

test("chunk-only build maps are byte-identical to maps from full retrieval indexes", () => {
  const files = [{ path: "knowledge.md", text: "# Operations\n\n## Inventory\n\nReconcile committed stock.\n\n## Logistics\n\nInspect arrivals." }, { path: "skills/reconcile/SKILL.md", text: "---\ndescription: Match inventory receipts\n---\n# Stock reconciliation\n\n" + "Count and match warehouse receipts. ".repeat(300) }];
  const chunks = files.flatMap(f => chunkMarkdown(f.path, f.text));
  const full = new KnowledgeIndex(files);
  for (const budget of [20, 100, 1800]) for (const withTool of [true, false]) assert.equal(knowledgeMap({ chunks }, "Fixture", withTool, budget), knowledgeMap(full, "Fixture", withTool, budget));
});
