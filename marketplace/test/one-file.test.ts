// The one-file text for chat apps (CS329Z plan W1): a lean ordered core, a card digest for the agent's jobs, the
// reference files the method points to, and every other file by its address, within ONE_FILE_BUDGET. Also the pack
// tool list: the org context tool (and its two old names) in every agent pack, and the job, log and team tools once they exist.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verticalBundle, type VerticalBundle } from "../src/modules/knowledge/bundle.ts";
import type { Card, Source, Vertical } from "../src/modules/knowledge/cards.ts";
import {
  DIGEST_MARK, EVERY_PACK_TOOLS, ONE_FILE_BUDGET, ONE_FILE_ORDER, TOOL_FILES, accessSummary, buildPack, oneFileStats, oneFileText,
} from "../src/modules/packs/build.ts";
import type { Persona } from "../src/core/types.ts";
import { FIXTURE_JOB_TYPES, NOVA } from "./fixtures.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "knowledge", "ecommerce");
const VERTICAL = JSON.parse(readFileSync(path.join(DIR, "vertical.json"), "utf8")) as Vertical;
const SOURCES = JSON.parse(readFileSync(path.join(DIR, "sources.json"), "utf8")) as Source[];
const CARDS = readdirSync(path.join(DIR, "cards")).filter(f => f.endsWith(".json")).sort().flatMap(f => JSON.parse(readFileSync(path.join(DIR, "cards", f), "utf8")) as Card[]);
const BUNDLE: VerticalBundle = verticalBundle(VERTICAL, CARDS, SOURCES);
const ECOM = JSON.parse(readFileSync(path.join(ROOT, "src", "modules", "directory", "data", "personas-ecommerce.json"), "utf8")) as Persona[];
const persona = (id: string) => ECOM.find(p => p.id === id)!;
const OPTIONS = { version: "2026.11.15", updated: "2026-11-15", kind: "agent" as const };
const SITE = "https://agents.test";
const parts = (text: string) => [...text.matchAll(/^===== FILE: (.+) =====$/gm)].map(m => m[1]);

const ecomPack = (templates: Record<string, string> = {}) =>
  buildPack({ persona: persona("zara-tiktok-ads"), role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates, vertical: BUNDLE, verticals: [BUNDLE], options: OPTIONS });

test("an e-commerce agent's one file is a lean core, then a card digest, within the budget and with the rules near the top", async () => {
  const pack = await ecomPack();
  const text = oneFileText(pack, SITE);
  const s = oneFileStats(text);
  assert.deepEqual(s.problems, [], "within ONE_FILE_BUDGET");
  assert.ok(s.coreTokens <= ONE_FILE_BUDGET.coreTokens && s.tokens < ONE_FILE_BUDGET.totalTokens);
  for (const d of [s.depth.agents, s.depth.method, s.depth.intake, s.depth.outputPolicy]) assert.ok(d !== null && d <= ONE_FILE_BUDGET.ruleDepth);
  // The core order: AGENTS.md, the method, the output policy, the access summary, the toolbox, the persona, knowledge, map.
  const p = parts(text);
  const at = (x: string) => p.indexOf(x);
  assert.equal(p[0], "AGENTS.md");
  assert.equal(at("METHOD.md"), 1, "the method comes right after AGENTS.md");
  assert.ok(at("WORK-METHOD.md") > at("knowledge.md"), "the old method file is a pointer, after the digest");
  const order = ["AGENTS.md", "METHOD.md", "OUTPUT-POLICY.md", "access.md (summary)", "toolbox.md", "soul.md", "playbook.md", "knowledge.md"];
  for (let i = 1; i < order.length; i++) assert.ok(at(order[i - 1]) < at(order[i]), `${order[i - 1]} before ${order[i]}`);
  // The digest follows the core: the agent's own cards, each with its id, never an "Asked as" line.
  const digestAt = text.indexOf(`\n${DIGEST_MARK}`);
  assert.ok(digestAt > text.indexOf("===== FILE: knowledge.md =====") && digestAt < text.indexOf("===== FILE: knowledge-map.md ====="), "the digest closes the core; the maps follow it");
  assert.ok(s.digestCards >= 1 && s.digestCards <= ONE_FILE_BUDGET.digestCards);
  const digest = text.slice(digestAt, text.indexOf("\n===== FILE:", digestAt));
  const ids = [...digest.matchAll(/^Card ([A-Z]{3}-\d{4})\./gm)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, "each card once");
  const own = new Set((persona("zara-tiktok-ads").modules ?? []).slice(0, 4));
  assert.ok(ids.every(id => own.has(id.slice(0, 3))), "only the agent's own modules");
  assert.doesNotMatch(text, /^\*\*Asked as:\*\*/m, "search keys stay out of the chat file");
  // Whole card modules are addresses, not parts; the digest and the head say how to reach them.
  assert.ok(!p.some(x => /^knowledge\/ecommerce\/[A-Z]{3}\.md$/.test(x)), "no whole module inlined");
  assert.match(digest, /https:\/\/agents\.test\/packs\/knowledge\/ecommerce\/MCR\.md/);
  assert.match(text, /`get_agent_file` reads one file of the pack by its path/);
  assert.match(text, /a path that starts with knowledge\/ or toolbox\/ and is not a part here is the page at https:\/\/agents\.test\/packs\//);
  // Said once: which steps need a coding app, and what to do in a chat.
  assert.equal((text.match(/Steps that need a coding app/g) ?? []).length, 1);
  assert.match(text, /METHOD\.md says, under "Coding app or chat app", what runs where and what to do by hand in a chat app\.[\s\S]*Never say a script ran when it did not\./, "the head points to METHOD.md instead of repeating it");
  assert.equal(oneFileText(pack, SITE), text, "the same pack gives the same bytes");
});

test("the shared METHOD.md comes right after AGENTS.md, the old method file waits in the reference part, and the shared memory template wins over the builder's short one", async () => {
  const method = "# Method\n\nOne numbered loop. Rule 1: never invent facts.\n";
  const memory = "# Store memory\n\nOne home: `context/MEMORY.md`.\n";
  const pack = await ecomPack({ "METHOD.md": method, "MEMORY-TEMPLATE.md": memory });
  assert.equal(pack.files.find(f => f.path === "METHOD.md")!.content, method);
  assert.equal(pack.files.find(f => f.path === "MEMORY-TEMPLATE.md")!.content, memory);
  const text = oneFileText(pack, SITE);
  const p = parts(text);
  assert.deepEqual(p.slice(0, 2), ["AGENTS.md", "METHOD.md"]);
  assert.ok(p.indexOf("WORK-METHOD.md") > p.indexOf("knowledge.md"));
  assert.ok(p.includes("MEMORY-TEMPLATE.md"));
  assert.ok(oneFileStats(text).depth.method! < 0.05);
  const without = await ecomPack();
  assert.ok(without.files.some(f => f.path === "METHOD.md"), "METHOD.md is required: the builder's outline stands in");
  assert.match(without.files.find(f => f.path === "MEMORY-TEMPLATE.md")!.content, /context\/MEMORY\.md/, "every pack names the memory template, so every pack carries one");
});

test("generic quality cards come in only for the agent's own kinds of work; the rest stay addresses", async () => {
  const quality = Object.fromEntries(["_any", "INDEX", "investor-update", "paid-social-ads", "job-description"].map(c => [`tools/quality/cards/${c}.md`, `# ${c}\n\nA card.\n`]));
  quality["tools/quality/cards/INDEX.md"] = [
    "investor-update | shareholder update, monthly update, board update | tools/quality/cards/investor-update.md",
    "paid-social-ads | social ads, image ads, video ad scripts, ad creative, ad copy | tools/quality/cards/paid-social-ads.md",
    "job-description | job post, job ad, hiring post | tools/quality/cards/job-description.md",
    "_any | anything else | tools/quality/cards/_any.md",
  ].join("\n");
  const names = Object.keys(quality).map(p => p.slice("tools/".length));
  const pack = await buildPack({ persona: persona("zara-tiktok-ads"), role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, vertical: BUNDLE, verticals: [BUNDLE],
    tools: Object.fromEntries(names.map(n => [n, quality[`tools/${n}`]])), options: OPTIONS });
  const p = parts(oneFileText(pack, SITE));
  assert.ok(p.includes("tools/quality/cards/_any.md") && p.includes("tools/quality/cards/INDEX.md"));
  assert.ok(!p.includes("tools/quality/cards/investor-update.md") && !p.includes("tools/quality/cards/job-description.md"), "work a TikTok buyer never does");
});

test("the access summary keeps the levels and the safety sections whole and names the tools; the rest is one address", () => {
  const access = [
    "# Access", "", "Until you choose, I only read.", "",
    "## Access levels", "", "- **Level 1, Read:** I look.", "- **Level 3:** live, within limits.", "",
    "## The tools of the trade", "", "**Meta Ads Manager** (help). Where ads live.", "", "- Level 1: read.", "", "**Google Analytics 4**. Sessions.", "",
    "## What I never ask for", "", "Passwords or card numbers.", "",
    "## Questions I ask first", "", "1. Which account?",
  ].join("\n");
  const s = accessSummary(access, "https://x.test/access.md");
  assert.match(s, /## Access levels\n\n- \*\*Level 1, Read:\*\* I look\.\n- \*\*Level 3:\*\* live, within limits\./);
  assert.match(s, /## What I never ask for\n\nPasswords or card numbers\./);
  assert.match(s, /The tools I work with: Meta Ads Manager; Google Analytics 4\./);
  assert.match(s, /\(The tools of the trade; Questions I ask first\) are in the full access file: https:\/\/x\.test\/access\.md/);
  assert.doesNotMatch(s, /Which account\?|Where ads live/);
});

test("the gate reads the core, the total and how deep each rule file starts", () => {
  const filler = "x".repeat(ONE_FILE_BUDGET.charsPerToken * 1000);
  const ok = `# Head\n\n===== FILE: AGENTS.md =====\n\na\n\n===== FILE: METHOD.md =====\n\nb\n\n===== FILE: OUTPUT-POLICY.md =====\n\nc\n\n${filler}\n${DIGEST_MARK}: cards =====\n\nCard MCR-0001. Tier 1, baseline.\n\n${filler}\n`;
  const s = oneFileStats(ok);
  assert.deepEqual(s.problems, []);
  assert.equal(s.digestCards, 1);
  assert.ok(s.coreTokens > 900 && s.coreTokens < 1100);
  const deep = `${"y".repeat(10_000)}\n===== FILE: AGENTS.md =====\n\na\n\n===== FILE: METHOD.md =====\n\nb\n`;
  const d = oneFileStats(deep);
  assert.ok(d.problems.some(p => /agents starts at/.test(p)) && d.problems.some(p => /outputPolicy is missing/.test(p)));
  const big = oneFileStats(`===== FILE: AGENTS.md =====\n===== FILE: METHOD.md =====\n===== FILE: OUTPUT-POLICY.md =====\n${"z".repeat(ONE_FILE_BUDGET.charsPerToken * ONE_FILE_BUDGET.totalTokens)}`);
  assert.ok(big.problems.some(p => /core before the digest/.test(p)) && big.problems.some(p => /whole file/.test(p)));
  // A mega agent's core also holds its traction playbook, so its limit is megaCoreTokens.
  const megaCore = `===== FILE: AGENTS.md =====\n===== FILE: METHOD.md =====\n===== FILE: OUTPUT-POLICY.md =====\n===== FILE: traction-playbook.md =====\n${"m".repeat(ONE_FILE_BUDGET.charsPerToken * 65_000)}\n${DIGEST_MARK}: cards =====\n${"d".repeat(ONE_FILE_BUDGET.charsPerToken * 30_000)}`;
  assert.ok(!oneFileStats(megaCore).problems.some(p => /core/.test(p)));
  assert.ok(oneFileStats(megaCore.replace("traction-playbook.md", "playbook.md")).problems.some(p => /core before the digest/.test(p)));
  // No card modules, no digest: the core ends at the first part outside ONE_FILE_ORDER.
  const plain = oneFileStats(`===== FILE: AGENTS.md =====\n\na\n\n===== FILE: METHOD.md =====\n\nb\n\n===== FILE: OUTPUT-POLICY.md =====\n\nc\n\n${filler}\n===== FILE: tools/quality/CHECKER-v3.md =====\n\n${filler}${filler}\n`);
  assert.ok(plain.coreTokens > 900 && plain.coreTokens < 1100 && plain.tokens > 2900);
  assert.deepEqual(ONE_FILE_ORDER.slice(0, 4).map(g => g.part), ["operating instructions", "method", "output policy", "foundation questions"]);
});

test("every agent pack carries the org context tool and its old names, and the job, log and team tools once they exist", async () => {
  for (const name of ["org-context.mjs", "brand-file.mjs", "brand-brain.mjs", "job.mjs", "log-event.mjs", "check-team.mjs"]) assert.ok(TOOL_FILES.some(t => t.name === name), name);
  assert.deepEqual([...EVERY_PACK_TOOLS].sort(), ["brand-brain.mjs", "brand-file.mjs", "org-context.mjs"]);
  const tools = { "org-context.mjs": "// org context\n", "brand-file.mjs": "// brand file\n", "brand-brain.mjs": "// brand brain\n", "capture-brand-dna.mjs": "// capture\n", "job.mjs": "// job\n", "log-event.mjs": "// log\n", "check-team.mjs": "// team\n" };
  // A bookkeeper's work carries no brand to the public: it still gets the store memory tools, never the site capture.
  const books: Persona = { ...NOVA, id: "books-test", area: "finance", outcomes: undefined } as unknown as Persona;
  const pack = await buildPack({ persona: { ...books, profile: NOVA.profile }, role: null, kit: null, jobTypes: [], templates: {}, tools, options: OPTIONS });
  const have = new Set(pack.files.filter(f => f.path.startsWith("tools/")).map(f => f.path));
  for (const t of ["tools/org-context.mjs", "tools/brand-file.mjs", "tools/brand-brain.mjs", "tools/job.mjs", "tools/log-event.mjs", "tools/check-team.mjs"]) assert.ok(have.has(t), t);
  assert.ok(!have.has("tools/capture-brand-dna.mjs"), "site capture stays with brand-facing work");
  const readme = pack.files.find(f => f.path === "context/README.md")!.content;
  assert.match(readme, /`context\/org-context\/`: the org context, kept across jobs/);
  assert.doesNotMatch(readme, /brand-dna\.json/, "no captured site for work that carries no brand");
  const none = await buildPack({ persona: { ...books, profile: NOVA.profile }, role: null, kit: null, jobTypes: [], templates: {}, tools: {}, options: OPTIONS });
  assert.ok(!none.files.some(f => f.path === "tools/job.mjs"), "a tool ships only once its file exists");
});
