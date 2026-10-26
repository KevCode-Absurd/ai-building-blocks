import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const bundle = await build({ entryPoints: [fileURLToPath(new URL("../src/lib/workflow-chain.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
const { firstSkillSuggestions, chainSuggestions, replacementSuggestions } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`);
const port = type => ({ type, required: true });
const part = (slug, patch = {}) => ({ slug, name: slug.replaceAll("-", " "), summary: "", headline: "", type: "skill", category: "general", role: "make", task: "set-up-ai", job: "ops", usedIn: 0, inputs: [], outputs: [], steps: [], ...patch });
const catalogue = blocks => ({ blocks, bySlug: Object.fromEntries(blocks.map(b => [b.slug, b])) });
const slugs = list => list.map(x => x.b.slug);

test("first choices follow the goal, exclude other kinds and existing steps, and never exceed five", () => {
  const c = catalogue([
    ...Array.from({ length: 8 }, (_, i) => part(`customer-reviews-${i}`, { summary: "Collect customer reviews for an ad", role: "source" })),
    part("research-mind", { type: "mind", summary: "Customer reviews" }),
    part("research-agent", { type: "agent", summary: "Customer reviews" }),
    part("research-coordinator", { execution: "coordinator", summary: "Customer reviews" }),
    part("customer-workflow", { category: "orchestrator", type: "workflow", summary: "Customer reviews", steps: [{ uses: "customer-reviews-0" }] }),
    part("unrelated-payroll", { usedIn: 100 }),
  ]);
  const original = structuredClone(c);
  const got = firstSkillSuggestions(c, "collect customer reviews", new Set(["customer-reviews-0"]), 99);
  assert.equal(got.length, 5);
  assert(got.every(x => x.b.slug.startsWith("customer-reviews-") && x.b.slug !== "customer-reviews-0"));
  assert.deepEqual(c, original, "suggesting must not mutate or assemble the workflow");
  assert.deepEqual(firstSkillSuggestions(c, "unfindablexyz"), [], "unmatched goals must not claim unrelated suggestions");
});

test("empty goal offers bounded first-step choices from the existing ready workflows", () => {
  const c = catalogue([part("begin"), part("check", { role: "check" }), part("ready", { category: "orchestrator", type: "workflow", steps: [{ uses: "begin" }, { uses: "check" }] })]);
  assert.deepEqual(slugs(firstSkillSuggestions(c, "")), ["begin"]);
  assert.deepEqual(firstSkillSuggestions(c, "", new Set(), 0), []);
});

test("ready-workflow neighbors rank first in both directions and remain one-step options", () => {
  const c = catalogue([
    part("collect", { outputs: [port("voc_reviews")] }),
    part("summarize", { inputs: [port("voc_reviews")], outputs: [port("ad_copy")] }),
    part("publish", { inputs: [port("ad_copy")] }),
    part("alternative", { inputs: [port("ad_copy")] }),
    part("ready", { category: "orchestrator", type: "workflow", steps: [{ uses: "collect" }, { uses: "summarize" }, { uses: "publish" }] }),
  ]);
  assert.equal(chainSuggestions(c, "summarize", new Set(), "", "before")[0].b.slug, "collect");
  const got = chainSuggestions(c, "summarize", new Set(), "", "after");
  assert.deepEqual(slugs(got), ["publish", "alternative"]);
  assert.match(got[0].why, /ready workflow/);
  assert.match(got[1].why, /May use/);
  assert.deepEqual(slugs(chainSuggestions(c, "summarize", new Set(["publish"]), "", "after")), ["alternative"]);
});

test("generic source and brief ports cannot recommend unrelated buyer briefs for migration work", () => {
  const c = catalogue([
    part("data-move", { name: "Business data move runbook", summary: "Move records between old and new systems", task: "manage-data", inputs: [port("source_text"), port("brief")] }),
    part("buyer-brief", { summary: "Customer persuasion and purchase motives", task: "understand-customers", job: "marketing", outputs: [port("brief")] }),
    part("article-source", { summary: "Write a source article for a newspaper", task: "write-articles", job: "writing", outputs: [port("source_text")] }),
    part("migration-source", { name: "Migration records inventory", summary: "List data move records and old and new systems", task: "manage-data", outputs: [port("source_text")] }),
  ]);
  assert.deepEqual(slugs(chainSuggestions(c, "data-move", new Set(), "move business data records", "before")), ["migration-source"]);
});

test("specific ports retain useful handoffs but a goal narrows unrelated candidates", () => {
  const c = catalogue([
    part("reviews", { outputs: [port("voc_reviews")] }),
    part("customer-ad", { summary: "Create an ad from customer reviews", inputs: [port("voc_reviews")] }),
    part("chart", { summary: "Create a financial chart", inputs: [port("voc_reviews")] }),
    part("mind", { type: "mind", inputs: [port("voc_reviews")] }),
  ]);
  assert.deepEqual(slugs(chainSuggestions(c, "reviews", new Set(), "create customer ad", "after")), ["customer-ad"]);
  assert.deepEqual(chainSuggestions(c, "missing", new Set(), "", "after"), []);
});

test("both neighbor directions cap at five even when many typed matches exist", () => {
  const c = catalogue([part("anchor", { inputs: [port("codebase")], outputs: [port("codebase")] }), ...Array.from({ length: 12 }, (_, i) => part(`code-${i}`, { inputs: [port("codebase")], outputs: [port("codebase")] }))]);
  for (const direction of ["before", "after"]) assert.equal(chainSuggestions(c, "anchor", new Set(), "", direction, 80).length, 5);
});

test("replacement options preserve semantic relevance and exclude orchestration, minds and existing steps", () => {
  const c = catalogue([
    part("old-customer-summary", { summary: "Summarize customer reviews", task: "understand-customers", role: "compress", inputs: [port("voc_reviews")], outputs: [port("brief")] }),
    ...Array.from({ length: 7 }, (_, i) => part(`customer-summary-${i}`, { summary: "Summarize customer reviews", task: "understand-customers", role: "compress", inputs: [port("voc_reviews")], outputs: [port("brief")] })),
    part("unrelated-payroll", { summary: "Calculate salary and tax", outputs: [port("brief")] }),
    part("customer-mind", { type: "mind", summary: "Summarize customer reviews" }),
    part("customer-workflow", { type: "workflow", category: "orchestrator", summary: "Summarize customer reviews" }),
    part("customer-agent", { type: "agent", summary: "Summarize customer reviews" }),
  ]);
  const snapshot = structuredClone(c);
  const got = replacementSuggestions(c, "old-customer-summary", new Set(["customer-summary-0"]), "summarize customer reviews", 99);
  assert.equal(got.length, 5);
  assert(got.every(x => /^customer-summary-[1-6]$/.test(x.b.slug)));
  assert(got.every(x => /Review|Check/.test(x.why)));
  assert.deepEqual(c, snapshot);
  assert.deepEqual(replacementSuggestions(c, "missing", new Set(), ""), []);
});

test("default generic task metadata alone cannot establish context for a generic port", () => {
  const c = catalogue([part("migration", { summary: "Move records between databases", inputs: [port("brief")] }), part("buyer-persona", { summary: "Customer purchase motives", outputs: [port("brief")] })]);
  assert.deepEqual(chainSuggestions(c, "migration", new Set(), "", "before"), []);
});

test("broad file categories do not turn book extraction and article formatting into data-migration prerequisites", () => {
  const c = catalogue([
    part("migration", { name: "Business data move runbook", summary: "Field maps, test imports and recovery", task: "work-with-files", inputs: [port("source_text")], outputs: [port("document")] }),
    part("book-reader", { name: "Book text finder", summary: "Find readable book editions", task: "work-with-files", outputs: [port("source_text")] }),
    part("article-formatter", { summary: "Format article titles and Markdown", task: "work-with-files", inputs: [port("document")] }),
  ]);
  for (const direction of ["before", "after"]) assert.deepEqual(chainSuggestions(c, "migration", new Set(), "move business data between tools", direction), []);
});

test("purpose aliases find AI-answer skills without turning geography or generic operations into AEO", () => {
  const c = catalogue([
    part("answer-audit", { name: "AI search audit", summary: "Check whether your brand is visible in AI answers" }),
    part("geo-coordinates", { name: "Geo coordinates converter", summary: "Convert latitude and longitude" }),
    part("generic-ops", { name: "Operating checklist", summary: "A checklist for everyday work" }),
    part("seo-crawl", { name: "SEO crawler", summary: "Find search indexing errors", task: "get-found-in-search" }),
  ]);
  for (const query of ["AEO", "GEO", "show up in AI answers", "get found in ChatGPT"]) {
    const got = slugs(firstSkillSuggestions(c, query));
    assert(got.includes("answer-audit"), query); assert(!got.includes("geo-coordinates"), query); assert(!got.includes("generic-ops"), query);
  }
  assert(!slugs(firstSkillSuggestions(c, "geo coordinates")).includes("answer-audit"));
  assert(!slugs(firstSkillSuggestions(c, "fix a coding bug")).includes("seo-crawl"));
});

// Pin these integration checks to the complete, verified catalogue snapshot, never mutable authoring data.
const verifiedPath = new URL("../.wrangler/releases/release-2026-10-23-luna-first-output-builder-ui-r1/assets/data/blocks.json", import.meta.url);
const verifiedBytes = existsSync(verifiedPath) ? readFileSync(verifiedPath) : null;
const verifiedWire = verifiedBytes ? JSON.parse(verifiedBytes) : { blocks: [] };
const verified = catalogue(verifiedWire.blocks.map(raw => part(raw.slug, { ...raw,
  inputs: (raw.inputs ?? []).map(p => typeof p === "string" ? { type: p.replace(/\?$/, ""), required: !p.endsWith("?") } : p),
  outputs: (raw.outputs ?? []).map(p => typeof p === "string" ? port(p.replace(/\?$/, "")) : p),
  steps: (raw.steps ?? []).map(s => typeof s === "string" ? { uses: s } : Array.isArray(s) ? { uses: s[0] } : s),
})));
if (verifiedBytes) verified.sourceHash = createHash("sha256").update(verifiedBytes).digest("hex");

test("verified catalogue offers bounded relevant choices for AEO, GEO, SEO, agentic and ordinary requests", { skip: !verifiedBytes && "The local verified release snapshot is not present in this checkout" }, () => {
  for (const query of ["AEO", "GEO", "show up in AI answers", "get found in ChatGPT"]) {
    const got = firstSkillSuggestions(verified, query);
    assert.equal(got.length, 5, query); assert(got.some(x => /ai-search/.test(x.b.slug)), query);
    assert(got.every(x => /ai|answer|recommendation/i.test(x.b.name + " " + x.b.summary)), query);
    assert(!got.some(x => /coordinates|generic-ops|unit-converter/.test(x.b.slug)), query);
  }
  assert(firstSkillSuggestions(verified, "SEO").every(x => /seo|search/i.test(x.b.name + " " + x.b.summary)));
  assert(firstSkillSuggestions(verified, "agentic").every(x => /agent/i.test(x.b.name + " " + x.b.summary)));
  assert(firstSkillSuggestions(verified, "tidy my meeting notes").every(x => /meeting|minutes/i.test(x.b.name + " " + x.b.summary)));
  assert.equal(firstSkillSuggestions(verified, "move business data between tools")[0]?.b.slug, "business-data-move-runbook");
  assert(!firstSkillSuggestions(verified, "geo coordinates").some(x => /ai-search|answer-visibility/.test(x.b.slug)));
});
