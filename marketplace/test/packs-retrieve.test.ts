// Per-agent knowledge retrieval (src/modules/packs/retrieve.ts): chunking, stemming, citations, the stopping rule,
// the knowledge map, the generated tools/ask-knowledge.mjs, the blind-review tool, and the floor on the independent
// golden set (test/fixtures/retrieval-golden.json, 75 questions over 15 role kits).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KnowledgeIndex, answerText, chunkMarkdown, glossaryOf, indexedPath, knowledgeExcerpt, knowledgeMap, parseSourcesMd, stem, tokens } from "../src/modules/packs/retrieve.ts";

/** Plain-JS modules (scripts and pack tools) have no type declarations: load them untyped. */
const load = (rel: string): Promise<any> => import(rel);

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const KNOWLEDGE = `# SEO specialist: role knowledge

Researched on 6 November 2026. Numbers in square brackets point to sources.

## 4. Benchmarks and numbers

- **Core Web Vitals pass rates:** 48% of mobile origins had good Core Web Vitals in July 2025 [16].

## 5. Decision rules

- If a drop starts during a core update, wait for the rollout to finish before you compare pages [1][8].
- If the site has fewer than about 10,000 pages, ignore crawl budget [4].

## 9. Glossary

- **Soft 404:** a page that is empty but returns a success code.
- **CWV:** Core Web Vitals, Google's page experience metrics for loading, response and layout shift.
`;

test("stemming meets plurals and verb forms without eating short or -ss words", () => {
  assert.equal(stem("dropped"), "drop");
  assert.equal(stem("dropping"), "drop");
  assert.equal(stem("drops"), "drop");
  assert.equal(stem("audits"), "audit");
  assert.equal(stem("queries"), "query");
  assert.equal(stem("business"), "business");
  assert.equal(stem("status"), "status");
  assert.equal(stem("analysis"), "analysis");
  assert.deepEqual(tokens("The 404 pages, and 2026!"), ["404", "page", "2026"]);
});

test("chunks follow headings, carry their trail as context, keep line numbers and list their [n] sources", () => {
  const chunks = chunkMarkdown("knowledge.md", KNOWLEDGE);
  const rules = chunks.find(c => c.heading === "5. Decision rules")!;
  assert.equal(rules.context, "SEO specialist: role knowledge > 5. Decision rules");
  assert.deepEqual(rules.cites, [1, 8, 4]);
  assert.equal(KNOWLEDGE.split("\n")[rules.lines[0] - 1], "- If a drop starts during a core update, wait for the rollout to finish before you compare pages [1][8].");
  assert.equal(new Set(chunks.map(c => c.id)).size, chunks.length, "ids are unique");
  // A skill's description is searchable even though the front matter is not.
  const skill = chunkMarkdown("skills/x/SKILL.md", "---\nname: x\ndescription: Diagnoses a fall in organic traffic.\n---\n# X\n\nStep one.\n");
  assert.match(skill[0].text, /Diagnoses a fall in organic traffic/);
  assert.ok(!skill.some(c => /^name: x/m.test(c.text)));
  // A long section is cut near the target with a short paragraph carried over.
  const long = `# T\n\n## Long\n\n${Array.from({ length: 12 }, (_, i) => `Paragraph ${i} ${"word ".repeat(40)}`).join("\n\n")}`;
  const parts = chunkMarkdown("k.md", long);
  assert.ok(parts.length >= 3 && parts.every(p => p.text.split(/\s+/).length <= 300));
});

test("the right passage comes first, with its dated sources, and stale sources are marked", () => {
  const sources = parseSourcesMd("1. [Google Search Status Dashboard](https://status.search.google.com/), Google. Checked 2026-11-06.\n4. [Crawl budget](https://developers.google.com/crawling), Google. Checked 2025-01-02.");
  assert.deepEqual(sources.map(s => s.n), [1, 4]);
  const index = new KnowledgeIndex([{ path: "knowledge.md", text: KNOWLEDGE }], { sources, reviewDays: 14 });
  const a = index.ask("Our traffic dropped after a Google core update. What now?", { today: "2026-11-13" });
  assert.equal(a.passages[0].heading, "5. Decision rules");
  assert.ok(a.enough);
  const crawl = a.passages[0].cites.find(c => c.n === 4)!;
  assert.equal(crawl.stale, true, "checked 2025-01-02 is more than twice the 14-day window old");
  assert.equal(a.passages[0].cites.find(c => c.n === 1)!.stale, false);
  assert.equal(a.passages[0].cites.some(c => c.n === 8), false, "an [n] with no source row is left out, not invented");
  assert.match(answerText(a, "Nova"), /STALE: recheck before use/);
});

test("the glossary bridges a term the question spells out, and a question the pack cannot answer says so", () => {
  assert.ok(glossaryOf(KNOWLEDGE).has("soft 404"));
  const index = new KnowledgeIndex([{ path: "knowledge.md", text: KNOWLEDGE }]);
  const off = index.ask("What is the best sourdough starter ratio for a bakery?");
  assert.equal(off.enough, false);
  assert.match(answerText(off, "Nova"), /not in the pack|has nothing on this/);
  const none = new KnowledgeIndex([{ path: "knowledge.md", text: "# K\n\n## A\n\nPlain words.\n" }]).ask("zebra quantum");
  assert.equal(none.passages.length, 0);
  assert.match(answerText(none, "Nova"), /has nothing on this/);
});

test("several phrasings fuse, results can be limited to files, and one section never crowds out the rest", () => {
  const files = [{ path: "knowledge.md", text: KNOWLEDGE }, { path: "skills/drop/SKILL.md", text: "---\nname: drop\ndescription: Diagnoses a traffic drop after an update.\n---\n# Drop\n\n## Steps\n\nCompare the losing pages with the pages that replaced them.\n" }];
  const index = new KnowledgeIndex(files);
  const both = index.ask(["traffic drop after update", "pages lost rankings in a core update"]);
  assert.ok(both.passages.some(p => p.path === "skills/drop/SKILL.md") && both.passages.some(p => p.path === "knowledge.md"));
  assert.ok(index.ask("traffic drop", { paths: ["knowledge.md"] }).passages.every(p => p.path === "knowledge.md"));
  const perSection = new Map<string, number>();
  for (const p of index.ask("pages", { k: 10 }).passages) perSection.set(p.path + p.context, (perSection.get(p.path + p.context) ?? 0) + 1);
  assert.ok([...perSection.values()].every(n => n <= 2));
});

test("load_agent's excerpt: passages for the request plus each steering section, never the preamble", () => {
  const { passages, headings } = knowledgeExcerpt(KNOWLEDGE, "how many pages before crawl budget matters", 10_000);
  assert.ok(headings.includes("5. Decision rules"));
  assert.ok(!passages.some(p => /Researched on 6 November/.test(p.text)));
  const tight = knowledgeExcerpt(KNOWLEDGE, "crawl budget", 120);
  assert.ok(tight.passages.reduce((n, p) => n + p.text.length, 0) <= 120);
});

test("which pack files are indexed, and the knowledge map lists them with and without the tool", () => {
  for (const p of ["knowledge.md", "playbook.md", "skills/a/SKILL.md", "prompts/x.md", "workflows/y.md", "toolbox/skill/z.md", "tools/quality/cards/landing-page.md"]) assert.ok(indexedPath(p), p);
  for (const p of ["AGENTS.md", "WORK-METHOD.md", "skills.md", "sources.md", "access.md", "knowledge-map.md", "context/README.md", "tools/check-handover.mjs", "tools/quality/CHECKER-v3.md", "pack.json"]) assert.ok(!indexedPath(p), p);
  const index = new KnowledgeIndex([{ path: "knowledge.md", text: KNOWLEDGE }]);
  const map = knowledgeMap(index, "Nova");
  assert.match(map, /^# Knowledge map/);
  assert.match(map, /- `knowledge\.md`: 4\. Benchmarks and numbers; 5\. Decision rules; 9\. Glossary/);
  assert.match(map, /node tools\/ask-knowledge\.mjs/);
  assert.doesNotMatch(knowledgeMap(index, "Nova", false), /ask-knowledge/);
});

test("tools/ask-knowledge.mjs is generated from retrieve.ts and answers the same way from a pack folder", async () => {
  const { generate, TARGET } = await load("../scripts/gen-ask-knowledge.mjs");
  assert.equal(readFileSync(TARGET, "utf8"), generate(), "out of date: run node scripts/gen-ask-knowledge.mjs");
  const dir = mkdtempSync(path.join(tmpdir(), "ask-"));
  mkdirSync(path.join(dir, "tools"));
  writeFileSync(path.join(dir, "AGENTS.md"), "# Nova\n");
  writeFileSync(path.join(dir, "knowledge.md"), KNOWLEDGE);
  writeFileSync(path.join(dir, "sources.md"), "# Sources\n\n1. [Status](https://status.search.google.com/), Google. Checked 2026-11-06.\n");
  writeFileSync(path.join(dir, "pack.json"), JSON.stringify({ name: "Nova", knowledge: { review_every_days: 14 } }));
  writeFileSync(path.join(dir, "tools", "ask-knowledge.mjs"), readFileSync(TARGET, "utf8"));
  const tool = await import(`${new URL(`file:///${path.join(dir, "tools", "ask-knowledge.mjs").replace(/\\/g, "/")}`).href}?t=${Date.now()}`);
  const fromTool = new tool.KnowledgeIndex([{ path: "knowledge.md", text: KNOWLEDGE }]).ask("core update drop");
  const fromTs = new KnowledgeIndex([{ path: "knowledge.md", text: KNOWLEDGE }]).ask("core update drop");
  assert.deepEqual(fromTool.passages.map((p: { id: string }) => p.id), fromTs.passages.map(p => p.id));
});

test("tools/blind-review.mjs counts a winner only when both orders agree, and flags a length win", async () => {
  const { sheet, tally, verdictOf } = await load("../packs/shared/tools/blind-review.mjs");
  const s = sheet("Write one subject line.", ["Draft one", "Draft two"], 2);
  assert.match(s, /## Draft A \(2 words\)[\s\S]*## Draft B \(2 words\)/);
  assert.match(s, /Length is not quality/);
  assert.equal(verdictOf("reasons\n**VERDICT:** b\nGRAFT: none"), "B");
  assert.equal(verdictOf("no verdict here"), null);
  const key = { sheets: [["a.md", "b.md"], ["b.md", "a.md"]] };
  assert.equal(tally(key, ["VERDICT: A", "VERDICT: B"]).winner, "a.md", "A first, then B second: the same file");
  const flip = tally(key, ["VERDICT: A", "VERDICT: A"]);
  assert.equal(flip.winner, null);
  assert.equal(flip.status, "position-dependent");
  assert.equal(tally(key, ["VERDICT: TIE", "VERDICT: TIE"]).status, "tie");
  assert.equal(tally(key, ["", "VERDICT: A"]).status, "incomplete");
  const long = tally(key, ["VERDICT: A", "VERDICT: B"], { "a.md": "word ".repeat(200), "b.md": "word ".repeat(100) });
  assert.match(long.length_warning!, /100% longer/);
});

test("retrieval floor on the independent golden set: Hit@5 at least 0.65 and MRR@10 at least 0.5", async () => {
  const { evaluate } = await load("../scripts/eval-retrieval.mjs");
  const golden = JSON.parse(readFileSync(path.join(ROOT, "test", "fixtures", "retrieval-golden.json"), "utf8"));
  assert.equal(golden.questions.length, 75);
  const r = evaluate(golden);
  assert.ok(r.hit5 >= 0.65, `Hit@5 ${r.hit5}`);
  assert.ok(r.mrr >= 0.5, `MRR ${r.mrr}`);
});

test("every role kit's citations point at a dated source with a url (scripts/check-knowledge.mjs)", async () => {
  const { checkKit } = await load("../scripts/check-knowledge.mjs");
  const roles = (await import("node:fs")).readdirSync(path.join(ROOT, "packs", "roles"));
  const errors = roles.flatMap((r: string) => checkKit(r).errors.map((e: string) => `${r}: ${e}`));
  assert.deepEqual(errors, []);
});
