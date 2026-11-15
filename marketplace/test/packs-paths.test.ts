// Routing lists that are true (CS329Z plan W5): each agent's module toolboxes list in full only what its pack
// carries, the rest as other agents' skills with their outside address; the library map shows the agent's own
// modules under headings; client lessons go to the store's memory; the linter fails a pack path the pack lacks
// unless the line gives its outside address, and notes items listed under two tasks or two skills for one deliverable.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { moduleToolboxMarkdown, personaVerticalFiles, verticalBundle, verticalKnowledgeSection, type ToolNames, type VerticalToolbox } from "../src/modules/knowledge/bundle.ts";
import type { Card, Source, Vertical } from "../src/modules/knowledge/cards.ts";
import { lintNotes, lintPack, outsideAddress } from "../src/modules/packs/lint.ts";
import { toolboxTaskItems } from "../src/modules/packs/toolbox.ts";
import type { BuiltPack, PackFile } from "../src/modules/packs/build.ts";
import type { Persona } from "../src/core/types.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "knowledge", "ecommerce");
const VERTICAL = JSON.parse(readFileSync(path.join(DIR, "vertical.json"), "utf8")) as Vertical;
const SOURCES = JSON.parse(readFileSync(path.join(DIR, "sources.json"), "utf8")) as Source[];
const CARDS = readdirSync(path.join(DIR, "cards")).filter(f => f.endsWith(".json")).sort().flatMap(f => JSON.parse(readFileSync(path.join(DIR, "cards", f), "utf8")) as Card[]);
const TOOLBOX = JSON.parse(readFileSync(path.join(DIR, "toolbox.json"), "utf8")) as VerticalToolbox;
const ECOM = JSON.parse(readFileSync(path.join(ROOT, "src", "modules", "directory", "data", "personas-ecommerce.json"), "utf8")) as Persona[];
const SAMPLES = ["lindsey-meta-media-buyer", "howard-copy-chief", "margaret-job-orchestrator", "wenhao-procurement"];

/** The vendored and own skill files, and the names the build gives them (as scripts/build-packs.mjs does). */
function realBundle() {
  const walk = (d: string): string[] => readdirSync(d).flatMap(n => statSync(path.join(d, n)).isDirectory() ? walk(path.join(d, n)).map(x => `${n}/${x}`) : [n]);
  const vendor: Record<string, string> = {};
  for (const [sub, at] of [["vendor", "vendor"], ["skills", "skills"]]) if (existsSync(path.join(DIR, sub))) for (const f of walk(path.join(DIR, sub)).filter(f => f.endsWith(".md"))) vendor[`knowledge/ecommerce/${at}/${f}`] = readFileSync(path.join(DIR, sub, f), "utf8");
  const names: ToolNames = { library: {}, vendor: {} };
  for (const items of Object.values(TOOLBOX.modules)) for (const i of items) {
    if (i.ref.startsWith("skill:")) { const p = `knowledge/ecommerce/skills/${i.ref.slice(6)}/SKILL.md`; if (vendor[p]) names.vendor[`own/${i.ref.slice(6)}`] = { name: /^#\s+(.+)$/m.exec(vendor[p].replace(/^---[\s\S]*?---/, ""))?.[1] ?? i.ref.slice(6), path: p, set: "own" }; }
    if (i.ref.startsWith("local:")) { const [set, skill] = i.ref.slice(6).split("/"); const p = `knowledge/ecommerce/vendor/${set}/skills/${skill}/SKILL.md`; if (vendor[p]) names.vendor[`${set}/${skill}`] = { name: skill, path: p, set }; }
  }
  return verticalBundle(VERTICAL, CARDS, SOURCES, { toolbox: TOOLBOX, vendor, names });
}
const BUNDLE = realBundle();

test("each sample agent's module toolboxes name only files its pack carries; the rest are other agents' skills with an address", () => {
  for (const id of SAMPLES) {
    const p = ECOM.find(x => x.id === id)!;
    const files = personaVerticalFiles(p, BUNDLE);
    const have = new Set(files.map(f => f.path));
    const boxes = files.filter(f => /^knowledge\/ecommerce\/toolbox\/[A-Z]+\.md$/.test(f.path));
    assert.ok(boxes.length > 0, `${id} carries module toolboxes`);
    for (const box of boxes) {
      assert.equal(box.shared, false, `${id} ${box.path} is the agent's own copy`);
      assert.doesNotMatch(box.content, /Every item is in this pack/);
      // Library items ship under toolbox/ from personaVerticalLibrary; everything under knowledge/ must be carried.
      const named = [...box.content.matchAll(/`(knowledge\/[^`\s]+\.md)`/g)].map(m => m[1]);
      const missing = named.filter(n => !have.has(n));
      assert.deepEqual(missing, [], `${id} ${box.path} names files it does not carry`);
      const away = box.content.split("## Not in this pack")[1] ?? "";
      if (away) {
        assert.match(away, /get_agent_file/);
        assert.match(away, /https:\/\/agents\.useaiblocks\.com\/packs\/knowledge\/ecommerce\/skills\/<name>\/SKILL\.md/);
        assert.match(away, /^- Carried by `[a-z0-9-]+`/m);
        assert.doesNotMatch(away, /\*\*File:\*\*/, "an item this pack lacks has no File line");
      }
    }
  }
});

test("the library's own copy of a module toolbox lists every item and does not say it is in a pack", () => {
  const md = BUNDLE.files["knowledge/ecommerce/toolbox/MCR.md"].content;
  assert.doesNotMatch(md, /in this pack/);
  assert.doesNotMatch(md, /## Not in this pack/);
  const carriedOnly = moduleToolboxMarkdown(VERTICAL, "MCR", TOOLBOX.modules.MCR, BUNDLE.names, new Set(CARDS.map(c => c.id)), () => false);
  assert.match(carriedOnly, /The 0 items below are in this pack/);
  assert.match(carriedOnly, /## Not in this pack/);
});

test("the library map lists the agent's own modules under headings, with their topics", () => {
  const lindsey = ECOM.find(x => x.id === "lindsey-meta-media-buyer")!;
  const map = personaVerticalFiles(lindsey, BUNDLE).find(f => f.path.endsWith("/library-map.md"))!.content;
  assert.match(map, /## My modules/);
  for (const code of ["MCR", "ADC", "MEA"]) assert.match(map, new RegExp(`^### ${code}, [^\\n]+: [^\\n]+$`, "m"), `${code} has a heading with its topics`);
  assert.match(map, /cards in `knowledge\/ecommerce\/MCR\.md`\. Topics: [^\n]+ \(\d+\);/);
});

test("knowledge.md sends a client's lessons to the store's memory, and says toolbox.md comes before the toolkit", () => {
  const p = ECOM.find(x => x.id === "lindsey-meta-media-buyer")!;
  const files = personaVerticalFiles(p, BUNDLE);
  const withCraft = { ...BUNDLE, principles: { schema: "ai-blocks-principles/1" as const, disciplines: [{ id: "why-people-buy", title: "Why people buy", summary: "s", everyone: true }] }, files: { ...BUNDLE.files, "knowledge/ecommerce/principles/why-people-buy.md": { content: "# Why", purpose: "p" } } };
  const note = verticalKnowledgeSection(p, withCraft, [...files.map(f => f.path), "knowledge/ecommerce/principles/why-people-buy.md"], "https://agents.useaiblocks.com/mcp");
  assert.match(note, /write the lesson in that store's memory, `context\/MEMORY\.md`/);
  assert.doesNotMatch(note, /record it in playbook\.md/);
  assert.doesNotMatch(note, /open the toolkit first/);
  assert.match(note, /`toolbox\.md` covers my whole role; for store work, open the toolkit right after it/);
});

// ---------- The linter ----------

const file = (p: string, content: string, source: PackFile["source"] = "agent"): PackFile => ({ path: p, content, purpose: "", group: "start", bytes: content.length, sha256: "", source });
const pack = (files: PackFile[], toolbox = true): BuiltPack => ({
  kind: "agent", folder: "x", files, notes: [], routes: [],
  manifest: { agent_id: "test-agent", role: "test-role" } as BuiltPack["manifest"],
  toolbox: toolbox ? { summary: { left_out: [], words: 100 } as unknown as NonNullable<BuiltPack["toolbox"]>["summary"], top: [] } : null,
});

test("the linter fails a pack path the pack lacks, unless the line gives its outside address or says it is not in this pack", () => {
  const base = [file("AGENTS.md", "# A\n"), file("knowledge/ecommerce/MCR.md", "# MCR\n")];
  const issues = (text: string) => lintPack(pack([...base, file("knowledge.md", text)])).filter(i => i.rule === "missing_file").map(i => i.message);
  assert.deepEqual(issues("Read `knowledge/ecommerce/MCR.md`.\n"), []);
  assert.deepEqual(issues("Read `knowledge/ecommerce/skills/x/SKILL.md`.\n"), ["refers to knowledge/ecommerce/skills/x/SKILL.md, which this pack does not contain"]);
  assert.deepEqual(issues("Run `tools/quality/numbers.cjs` on it.\n"), ["refers to tools/quality/numbers.cjs, which this pack does not contain"]);
  assert.deepEqual(issues("Read `knowledge/ecommerce/skills/x/SKILL.md` (at https://agents.useaiblocks.com/packs/knowledge/ecommerce/skills/x/SKILL.md).\n"), [], "a web address for the same path labels it");
  assert.deepEqual(issues("Read `knowledge/ecommerce/skills/x/SKILL.md` (at https://agents.useaiblocks.com/packs/knowledge/ecommerce/skills/y/SKILL.md).\n"), ["refers to knowledge/ecommerce/skills/x/SKILL.md, which this pack does not contain"], "an address for another file does not");
  assert.deepEqual(issues("`knowledge/ecommerce/skills/x/SKILL.md` is not in this pack.\n"), []);
  assert.deepEqual(issues("## Not in this pack\n\n- `knowledge/ecommerce/skills/x/SKILL.md`\n"), []);
  assert.deepEqual(issues("Edit the theme's `config/settings_data.json` and `context/brand-file/foundation/messaging.md`.\n"), [], "the client's own files are not pack paths");
  assert.deepEqual(issues("Write `foundation/messaging.md` in the brand file.\n"), []);
});

test("outsideAddress matches only a web address that ends in the same path", () => {
  assert.ok(outsideAddress("`tools/a.mjs` (get https://x.com/tools/a.mjs into a tools/ folder first)", "tools/a.mjs"));
  assert.ok(!outsideAddress("`tools/a.mjs` (get https://x.com/tools/a.mjsx first)", "tools/a.mjs"));
  assert.ok(!outsideAddress("`tools/a.mjs` and tools/a.mjs", "tools/a.mjs"));
});

const TOOLBOX_MD = [
  "# T's toolbox", "", "## Your jobs", "", "- Meta account audit `skills/meta-account-audit/SKILL.md`", "",
  "## Your work, by task", "",
  "### Audit an account", "",
  "- When the exports are in: **Meta account audit** (build, skill) `skills/meta-account-audit/SKILL.md`",
  "- For thirty checks: **Meta Ads 30-check account auditor** (check, skill) `toolbox/skill/meta-ads-30-check-account-auditor.md`",
  "- For the money: **Break-even calculator** (build, skill) `toolbox/skill/break-even.md`", "",
  "### Plan a month", "",
  "- When the budget is proposed: **Break-even calculator** (check, skill) `toolbox/skill/break-even.md`",
  "- For the plan: **Monthly ad budget planner** (build, skill) `toolbox/skill/monthly-plan.md`", "",
  "## More", "", "- Plan a month: **Break-even calculator** `toolbox/skill/break-even.md`",
].join("\n");

test("toolboxTaskItems reads each task's items back from toolbox.md, and stops at More", () => {
  const tasks = toolboxTaskItems(TOOLBOX_MD);
  assert.deepEqual(tasks.map(t => [t.task, t.items.length]), [["Audit an account", 3], ["Plan a month", 2]]);
  assert.deepEqual(tasks[1].items[0], { name: "Break-even calculator", path: "toolbox/skill/break-even.md" });
});

test("the linter notes an item under two tasks and two skills that make the same deliverable, and never fails on them", () => {
  const files = [
    file("toolbox.md", TOOLBOX_MD),
    file("skills/meta-account-audit/SKILL.md", "---\nname: x\n---\n\n# Meta account audit\n"),
    file("knowledge/ecommerce/skills/store-meta-audit/SKILL.md", "# Meta account audit for an online store\n", "vertical"),
    file("toolbox/skill/meta-ads-30-check-account-auditor.md", "# Meta Ads 30-check account auditor\n", "toolbox"),
    file("toolbox/skill/break-even.md", "# Break-even calculator\n", "toolbox"),
    file("toolbox/skill/monthly-plan.md", "# Monthly ad budget planner\n", "toolbox"),
    file("knowledge/ecommerce/skills/store-meta-plan/SKILL.md", "# Meta ads plan for an online store\n", "vertical"),
  ];
  const notes = lintNotes(pack(files));
  const overlap = notes.filter(n => n.rule === "toolbox_overlap");
  assert.equal(overlap.length, 1);
  assert.match(overlap[0].message, /^test-role: Break-even calculator \(toolbox\/skill\/break-even\.md\) is listed under 2 tasks \(Audit an account; Plan a month\)/);
  const same = notes.filter(n => n.rule === "deliverable_overlap").map(n => n.message);
  assert.ok(same.some(m => m.includes("skills/meta-account-audit/SKILL.md") && m.includes("knowledge/ecommerce/skills/store-meta-audit/SKILL.md")), same.join("\n"));
  assert.ok(same.some(m => m.includes("skills/meta-account-audit/SKILL.md") && m.includes("toolbox/skill/meta-ads-30-check-account-auditor.md")), "auditor matches audit");
  assert.ok(!same.some(m => m.includes("monthly-plan")), "a different deliverable is not flagged");
  assert.ok(!same.some(m => m.includes("store-meta-plan")), "\"Meta ads plan\" names a channel and a kind of work, not one deliverable");
  assert.deepEqual(lintPack(pack(files)).filter(i => i.rule !== "missing_file"), [], "overlaps are notes, not build failures");
});
