// Grounded packs: the capture tools, the one-file text without scripts, the pack linter, request routing and families.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildPack, filesIndex, oneFileText, type BuiltPack, type PackInput } from "../src/modules/packs/build.ts";
import { lintPack } from "../src/modules/packs/lint.ts";
import { bestRoute, relevantSections } from "../src/modules/packs/route.ts";
import { contextRequirements, familyOf } from "../src/modules/packs/families.ts";
import { FIXTURE_JOB_TYPES, LANDING_PAGE, NOVA } from "./fixtures.ts";

const shared = (p: string) => readFileSync(new URL(`../packs/shared/${p}`, import.meta.url), "utf8");
const TEMPLATES = Object.fromEntries(["AGENTS.md", "WORK-METHOD.md", "README.md", "LICENSE.md"].map(p => [p, shared(p)]));
const TOOLS = {
  "capture-brand-dna.mjs": "// capture\nexport {};\n",
  "brand-dna-snippet.js": "// snippet\n",
  "check-brand-fidelity.mjs": "// check\nexport {};\n",
  "ai-default-patterns.md": "# AI default patterns\n\n- **web-template-stack**: the average landing page.\n",
};
const build = (over: Partial<PackInput> = {}, kind: "agent" | "train" = "agent") =>
  buildPack({ persona: NOVA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: TEMPLATES, tools: TOOLS, options: { kind, version: "t", updated: "2026-11-09" }, ...over });
const file = (pack: BuiltPack, path: string) => pack.files.find(f => f.path === path)?.content;

test("AGENTS.md is a short entry point that starts every job by grounding it", async () => {
  const agents = file(await build(), "AGENTS.md")!;
  assert.ok(agents.split("\n").length <= 75, `AGENTS.md has ${agents.split("\n").length} lines`);
  assert.match(agents, /## How to start every job\n\n1\. \*\*Ground first\.\*\*/);
  assert.match(agents, /three questions at most/);
  // The method lives in WORK-METHOD.md and the choice of tools in toolbox.md; AGENTS.md only points at both.
  assert.match(agents, /run the job the way `WORK-METHOD\.md` says/);
  assert.match(agents, /Find the task in `toolbox\.md` and pick what fits it, at your own discretion/);
  assert.match(agents, /never search for a skill/);
  assert.match(agents, /one line naming the toolbox items you used/);
  assert.doesNotMatch(agents, /Your skills:|use the narrowest one/, "no flat skills list");
  assert.doesNotMatch(agents, /\{\{/);
  assert.doesNotMatch(agents, /read-only/i, "access is by level, never an absolute read-only rule");
  for (const level of ["Level 1, read", "Level 2, draft", "Level 3, publish"]) assert.ok(agents.includes(level), level);
});

test("agent packs carry the capture tools under tools/; the one file links to the scripts instead of holding them", async () => {
  const pack = await build();
  for (const name of Object.keys(TOOLS)) assert.equal(file(pack, `tools/${name}`), TOOLS[name as keyof typeof TOOLS], name);
  const index = filesIndex(pack);
  assert.equal(index.files.find(f => f.path === "tools/capture-brand-dna.mjs")!.url, "/packs/tools/capture-brand-dna.mjs");
  assert.equal(index.files.find(f => f.path === "tools/capture-brand-dna.mjs")!.kind, "tool");
  assert.ok(index.routes.length >= 2, "files.json lists what load_agent routes to");
  assert.match(file(pack, "WORK-METHOD.md")!, /Run `node tools\/capture-brand-dna\.mjs <url>`/);
  const text = oneFileText(pack, "https://agents.test");
  assert.doesNotMatch(text, /===== FILE: tools\/.+\.(mjs|js) =====/);
  assert.match(text, /===== FILE: tools\/ai-default-patterns\.md =====/, "the default list is data the method needs");
  // Commands stay runnable: the relative path is kept, with where to get the script first.
  assert.match(text, /Run `node tools\/capture-brand-dna\.mjs <url>` \(get https:\/\/agents\.test\/tools\/capture-brand-dna\.mjs into a tools\/ folder first\)/);
  assert.doesNotMatch(text, /`node https:|`https:\/\/[^`]*\.mjs/);
  assert.doesNotMatch(text, /(https:\/\/agents\.test\/tools\/[\w.-]+)`? \(also at \1\)/, "no doubled tool links");
  assert.deepEqual(lintPack(pack), []);
  // A training pack goes back to the studio, which takes text files only: it links to the public tools.
  const train = await build({ templates: { ...TEMPLATES } }, "train");
  assert.ok(!train.files.some(f => f.path.startsWith("tools/")));
  assert.match(file(train, "WORK-METHOD.md")!, /https:\/\/agents\.useaiblocks\.com\/tools\/capture-brand-dna\.mjs/);
  assert.ok(train.files.some(f => f.path === "context/README.md"));
  // Without the scripts in the build, references point at the public copies, so the pack never names a missing file.
  const bare = await build({ tools: {} });
  assert.deepEqual(lintPack(bare), []);
});

test("the pack linter fails missing files, conflicting limits, repeated paragraphs and made-up businesses", async () => {
  const pack = await build();
  const long = "This paragraph is long enough to count as boilerplate when it shows up twice in the same pack, which is exactly what the linter stops.";
  const broken: BuiltPack = { ...pack, files: [...pack.files,
    { ...pack.files[0], path: "notes-a.md", source: "agent", content: `See \`workflows/nowhere.md\` and JOB-CARD.json.\n\nAsk five questions at most.\n\n${long}\n\nOur example is Tidewell Bookkeeping.\n` },
    { ...pack.files[0], path: "notes-b.md", source: "agent", content: `${long}\n\n## Optional: hosts\n\nEXECUTION-PLAN.json comes from the tool.\n` },
  ] };
  const rules = lintPack(broken).map(i => `${i.rule}:${i.message.slice(0, 40)}`);
  assert.ok(rules.some(r => r.startsWith("missing_file:refers to workflows/nowhere.md")), rules.join("\n"));
  assert.ok(rules.some(r => r.startsWith("missing_file:refers to JOB-CARD.json")));
  assert.ok(!rules.some(r => r.includes("EXECUTION-PLAN")), "a section headed Optional may name host files");
  assert.ok(rules.some(r => r.startsWith("limit_conflict:sets the limit on questions to 3 and 5")), rules.join("\n"));
  assert.ok(rules.some(r => r.startsWith("repeated_paragraph")));
  assert.ok(rules.some(r => r.startsWith("made_up_business")));
  assert.equal(lintPack({ ...pack, files: [...pack.files, { ...pack.files[0], path: "x.md", content: "We compared it with Sprout Social.\n" }] }).length, 0, "a real company is fine");
});

test("requests route to the best skill without a model, and knowledge comes back by relevant section", () => {
  const routes = [
    { path: "skills/landing-page-copy-job/SKILL.md", kind: "job" as const, name: "Landing page copy landing page sales page", text: "Copy for one landing page." },
    { path: "skills/keyword-research/SKILL.md", kind: "skill" as const, name: "keyword research", text: "Finds the searches that matter for one page." },
    { path: "workflows/monthly-check.md", kind: "workflow" as const, name: "Monthly search check", text: "Export the Search Console report." },
  ];
  assert.equal(bestRoute("Rewrite our landing page copy for the spring sale", routes)!.candidate.path, "skills/landing-page-copy-job/SKILL.md");
  assert.equal(bestRoute("Which keywords should this page target?", routes)!.candidate.path, "skills/keyword-research/SKILL.md");
  assert.equal(bestRoute("Book me a flight to Lisbon", routes), null, "no match is better than a wrong one");
  const md = "# K\n\n## 1. What this role is for\n\nPages.\n\n## 5. Decision rules\n\nOne search per page.\n\n## 9. Glossary\n\nSERP: the results page.\n";
  assert.deepEqual(relevantSections(md, "help with the results page", 10_000).map(s => s.heading), ["5. Decision rules", "9. Glossary"]);
});

test("job types fall back to a family and its context requirements until the catalogue sets them", () => {
  assert.equal(familyOf(LANDING_PAGE), "copy");
  assert.equal(familyOf({ ...LANDING_PAGE, family: "web_page" }), "web_page");
  assert.equal(contextRequirements(LANDING_PAGE)[0].required, true);
  const own = [{ id: "site_url", label: "Your website", required: true, how: "Capture it with the capture tool before anything else." }];
  assert.deepEqual(contextRequirements({ ...LANDING_PAGE, context_requirements: own }), own);
});

test("a job type's own gates and craft rubric render as pass/fail gates and a weighted table", async () => {
  const jt = { ...LANDING_PAGE, family: "web_page" as const, gates: ["The live site's nav and footer are kept."],
    craft_rubric: [{ criterion: "Brand fidelity", weight: 60, test: "Fonts and colours match brand-dna.json." }, { criterion: "Specificity", weight: 40, test: "No line a competitor could publish unchanged." }] };
  const pack = await build({ jobTypes: [jt], persona: { ...NOVA, profile: { ...NOVA.profile, outcomes: [{ ...NOVA.profile.outcomes[0], job_type_id: jt.id }] } } });
  const skill = file(pack, `skills/${jt.id}/SKILL.md`)!;
  assert.match(skill, /## Gates: pass or fail[\s\S]*- The live site's nav and footer are kept\./);
  // The job type's own rubric is made job-first: the job leads at 30, own material follows at 10, the rest share 60.
  assert.match(skill, /\| Does the job for the buyer \| 30 \|[^\n]+\n\| Own material \| 10 \|[^\n]+\n\| Brand fidelity \| 36 \| Fonts and colours match brand-dna\.json\. \|\n\| Specificity \| 24 \|/);
  assert.match(skill, /3\. \*\*Diverge: real candidates, and someone else chooses\.\*\*[^\n]+A fresh reviewer who has not seen your reasoning picks one/);
  assert.match(skill, /6\. \*\*Hand over\.\*\* The native work comes first/);
  assert.doesNotMatch(skill, /Write DECISIONS\.md/);
  assert.match(skill, /Default mode: patch/);
  // A job type with no craft rubric of its own gets its family's weights in a line (WORK-METHOD.md has no table now).
  const plain = file(await build(), "skills/landing-page-copy/SKILL.md")!;
  assert.match(plain, /- Then score the craft out of 100 with these weights: Does the job for the buyer 30, /);
});

test("every job skill carries the hand-over word budget; conversion jobs also check the proven levers", async () => {
  const { familyGates, WORD_BUDGETS, PROVEN_LEVERS } = await import("../src/modules/packs/families.ts");
  for (const family of Object.keys(WORD_BUDGETS) as (keyof typeof WORD_BUDGETS)[]) {
    const gates = familyGates(family);
    assert.match(gates[0], /the native work first, with context only when needed/, family);
    assert.equal(gates.some(g => /^Proven levers checked/.test(g)), Boolean(PROVEN_LEVERS[family]), family);
  }
  const pack = await build();
  const skills = pack.files.filter(f => /^skills\/[^/]+\/SKILL\.md$/.test(f.path) && /## Gates: pass or fail/.test(f.content));
  assert.ok(skills.length > 0);
  for (const s of skills) assert.match(s.content, /The hand-over fits: the native work first, with context only when needed/, s.path);
  assert.match(file(pack, "WORK-METHOD.md")!, /check the proven levers/);
  // 10 Nov rerun: the deliverable stands on its own, and plans keep the detail someone needs to act.
  for (const family of Object.keys(WORD_BUDGETS) as (keyof typeof WORD_BUDGETS)[]) assert.match(familyGates(family)[0], /never in a file the client does not have/, family);
  assert.match(WORD_BUDGETS.plan, /10,000 words/);
});
