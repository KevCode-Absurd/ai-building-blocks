// The method core: WORK-METHOD.md stays short and complete, the craft weights are job-first, and each family's real
// candidates and completeness list reach the job skills. The shared lists are checked against the library's copy in
// site/test/jobs-grounding.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { buildPack, type PackInput } from "../src/modules/packs/build.ts";
import { lintPack } from "../src/modules/packs/lint.ts";
import {
  CANDIDATES, CANDIDATE_AXES, COMPLETENESS, CONTEXT_LEVELS, CONTEXT_NEED, CRAFT_WEIGHTS, PROVEN_LEVERS, RUBRIC_GROUP, WORD_BUDGETS,
  contextNeed, craftWeightsLine, familyGates, familySlice, jobFirstCraft,
} from "../src/modules/packs/families.ts";
import type { CraftCriterion, DeliverableFamily, JobType } from "../src/core/types.ts";
import { FIXTURE_JOB_TYPES, LANDING_PAGE, NOVA } from "./fixtures.ts";

const shared = (p: string) => readFileSync(new URL(`../packs/shared/${p}`, import.meta.url), "utf8");
const METHOD = shared("WORK-METHOD.md");
const FAMILIES = Object.keys(WORD_BUDGETS) as DeliverableFamily[];
const DATA = new URL("../src/modules/catalogue/data/", import.meta.url);
const allJobTypes = (): JobType[] => readdirSync(DATA).filter(f => f.endsWith(".json")).flatMap(f => JSON.parse(readFileSync(new URL(f, DATA), "utf8")));

test("WORK-METHOD.md is under 1,120 words and still covers every part of the method", () => {
  const words = METHOD.split(/\s+/).filter(Boolean).length;
  // 1,000 until 13 Nov 2026; the pack lookup, outside-evidence checks and two-order blind pick added about 100. The
  // owner rules (13 Nov) fit inside the same cap: their detail lives in the quality engine, and the whole one-shot
  // reading list is held under 6,000 words in packs-grounded.test.ts.
  assert.ok(words < 1120, `WORK-METHOD.md has ${words} words`);
  const parts: [string, RegExp][] = [
    ["spec sheet", /## 0\. Frame: the spec sheet[\s\S]*who must do what after seeing this[\s\S]*\*\*Deliverables:\*\* exact count and format/],
    ["signal pass", /\*\*Signal pass:\*\* the three strongest signals in the owner's data[^\n]*For each: its number, what it means for the decision, and where the deliverable acts on it\./],
    ["ground only what the job needs", /## 1\. Ground: only what the job needs\n\nCapture what the signals and the decision depend on, and no more/],
    ["toolbox", /\nYour `toolbox\.md` lists what to use when; pick at your own discretion and open only what you pick\.\n/],
    ["real candidates", /make about 3 candidates of the part that decides the outcome, as real work, not descriptions/],
    ["outside chooser", /fresh reviewer who has not seen your reasoning[\s\S]*SAME-CONTEXT[\s\S]*one more round only/],
    ["craft floor", /New framing of true facts, never new facts\.[\s\S]*Never a menu\.[\s\S]*labelled as a projection; never in what a buyer reads, and never an invented result[\s\S]*5 real brand lines beside 5 of yours/],
    ["truth gate with sourced claims", /Each claim a buyer or the client will read \(prices, counts, ratings, policies, names, delivery times, quotes, product properties\): sourced or not\.[\s\S]*Remove each unsourced claim, or rewrite it to what the source says\. Never flag or footnote it\./],
    ["buyer can act", /\*\*Can the buyer act today\?\*\* Confirm the thing sold is live, in stock[\s\S]*say so in your first line/],
    ["format completeness", /\*\*Finish the format\.\*\* Ads:[\s\S]*Emails:[\s\S]*Plans:[\s\S]*Pages:/],
    ["client's-eye check", /## 5\. Check: the client's-eye review\n\nA fresh reviewer \(as in step 3\) gets only the client's brief, the finished deliverable and `context\/facts\.md`/],
    ["hand-over shape", /The native work comes first[\s\S]*Nothing internal reaches the client[\s\S]*appendix inside the deliverable/],
    ["rules I learned", /Add shared lessons to "Rules I learned" in playbook\.md/],
    // The Quality Engine v2.1 rules (11 Nov 2026 benchmark: 88% of 128 blind verdicts against a plain model).
    ["expert and playbook", /\*\*Expert and playbook:\*\*[\s\S]*One is the expert's standard playbook done excellently; clever ones must beat it\./],
    ["plain yardstick and final pick", /plain one-pass answer from the brief alone: the yardstick[\s\S]*a fresh reader chooses between anonymous final and plain/],
    ["facts versus proposals", /\*\*Facts and proposals differ\.\*\* Facts carry a source\. Recommendations are complete and decided\. Keep explicitly requested template fields; otherwise no blanks or placeholders\./],
    ["length against the owner's limit", /\*\*Length follows use:\*\* aim at about 85% of the owner's limit, counted the way the owner counts; without one, the family profile[\s\S]*ceiling is never a target\. No sections about method or assumptions\./],
    // The owner rules (13 Nov 2026 owner bench): finish one-shot work, combine complementary levers, act fully, project.
    ["owner override", /^# Work method\n\n\*\*The owner comes first:\*\* if a rule in this pack would make the work worse for this owner's stated goal and data, follow the owner and say why in one line\./],
    ["one-shot finish", /\*\*One-shot jobs\*\*[^\n]*decide every open point with the assumption a top practitioner would pick, and finish\. At most three assumption lines[^\n]*Never ask for confirmation, a yes, a sign-off or a choice inside the deliverable/],
    ["legal sign-off next to its item", /A sign-off that law or a platform needs is one line next to its item\./],
    ["fast path", /\*\*Fast path:\*\* when the brief carries the data, skip site capture, brand DNA, the taste brief and knowledge reading; read the quality engine's rules and steps 2 to 4 and 8, the matched card and one job skill\./],
    ["decide, combining complementary moves", /\*\*Decide\.\*\* One recommendation, which may combine complementary moves; a runner-up only when the options truly exclude each other\. Never a menu\./],
    ["act fully", /\*\*Act fully\.\*\* If the deliverable keeps anything a signal says to cut, say why in one line with the number\./],
    ["persona's real moment", /\*\*Fit the persona's real moment\*\* in every time, place, unit and channel \(quality engine step 4\)\./],
    ["first screen", /its first screen holds the decision, the numbers the owner asked for by name, every piece of bad news, and the first move this week\./],
    ["nothing left to the owner", /4\. What is left for the owner to do: questions, sign-offs, choices, placeholders\.[\s\S]*Fix 1, 3 and 4, cut 5,/],
    ["fresh facts", /Re-check on the day facts that change/],
    ["hand-over check tool", /Run `node tools\/check-handover\.mjs <deliverable> <plain answer> --profile <family>` and fix every hit\./],
  ];
  for (const [name, re] of parts) assert.match(METHOD, re, name);
  // Other pack files point at these steps by number: ground is step 1, the gates and craft are step 5, learning is step 6.
  assert.deepEqual([...METHOD.matchAll(/^## (\d)\. (\w+)/gm)].map(m => `${m[1]} ${m[2]}`), ["0 Frame", "1 Ground", "2 Taste", "3 Diverge", "4 Build", "5 Check", "6 Hand"]);
  assert.match(METHOD, /## 1\.[\s\S]*\n3\. Or ask for the URL, screenshots and brand guide\.[\s\S]*## 2\./, "step 1 keeps three capture routes");
  assert.match(METHOD, /## 5\.[\s\S]*\*\*Gates\.\*\*[\s\S]*\*\*Craft\.\*\* "Does the job" \(for the buyer or the decision\) weighs most, 30 of 100[\s\S]*"Own material" weighs 10[\s\S]*## 6\./);
  // The method names every axis candidates must differ on, as the shared list has them.
  assert.ok(METHOD.includes(`at least two of: ${CANDIDATE_AXES.join(", ")}.`));
  assert.doesNotMatch(METHOD, /job[- ]card|search the library|one-screen summary/i);
  // No homework: "To confirm" appears only in the rule that forbids it, and the runner-up is never the default.
  assert.deepEqual(METHOD.split("\n").filter(l => l.includes("To confirm")).map(l => /no "To confirm" list/.test(l)), [true]);
  assert.doesNotMatch(METHOD, /acceptance tests?|runner-up in a line|revenue forecast|Please confirm/i);
});

test("craft weights are job-first in every family and carry the own-material row", () => {
  assert.deepEqual(Object.keys(CRAFT_WEIGHTS), [...new Set(FAMILIES.map(f => RUBRIC_GROUP[f]))]);
  for (const [group, rows] of Object.entries(CRAFT_WEIGHTS)) {
    assert.equal(rows.reduce((n, [, weight]) => n + weight, 0), 100, group);
    assert.match(rows[0][0], /^Does the job/, group); assert.equal(rows[0][1], 30, group);
    assert.ok(rows.slice(1).every(([, weight]) => weight < 30), `${group}: nothing ties the job`);
    assert.ok(rows.some(([criterion, weight]) => criterion === "Own material" && weight === 10), group);
  }
  assert.equal(craftWeightsLine("web_page"), "Does the job for the buyer 30, Brand fidelity 20, Launchability 15, Own material 10, Specificity 10, Clarity 10, Distinctiveness vs defaults 5");
  assert.equal(craftWeightsLine("email"), "Does the job for the buyer 30, Voice fidelity 20, Specificity 15, Clarity 15, Own material 10, Distinctiveness vs defaults 10");
  assert.match(craftWeightsLine("plan"), /^Does the job for the decision 30, Actionability 25/);
});

test("jobFirstCraft puts the job first in every catalogue job type and keeps the weights at 100", () => {
  const jobTypes = allJobTypes();
  assert.ok(jobTypes.length > 200);
  for (const jt of jobTypes) {
    const before = jt.craft_rubric as CraftCriterion[], after = jobFirstCraft(before, jt.family as DeliverableFamily);
    assert.equal(after.reduce((n, c) => n + c.weight, 0), 100, jt.id);
    assert.match(after[0].criterion, /^Does the job/, jt.id); assert.equal(after[0].weight, 30, jt.id);
    assert.equal(after[1].criterion, "Own material", jt.id); assert.equal(after[1].weight, 10, jt.id);
    assert.ok(after.slice(1).every(c => c.weight < 30 && c.weight >= 1 && Number.isInteger(c.weight)), `${jt.id}: ${after.map(c => c.weight).join(",")}`);
    // The job's own rows are kept, in their order, with their own tests.
    const kept = before.filter(c => !/^(job done|job and conversion logic)\b/i.test(c.criterion));
    assert.deepEqual(after.slice(2).map(c => [c.criterion, c.test]), kept.map(c => [c.criterion, c.test]), jt.id);
    const job = before.find(c => /^(job done|job and conversion logic)\b/i.test(c.criterion));
    if (job) assert.equal(after[0].test, job.test, `${jt.id}: the job row keeps the job's own test`);
  }
  // The landing page build today: brand fidelity 25 and the job 10. After: the job 30, brand fidelity below it.
  const page = jobFirstCraft(jobTypes.find(jt => jt.id === "landing-page-build")!.craft_rubric!, "web_page");
  assert.deepEqual(page.slice(0, 3).map(c => [c.criterion, c.weight]), [["Does the job for the buyer", 30], ["Own material", 10], ["Brand fidelity", 17]]);
  // Idempotent, and safe on a rubric with no other rows.
  assert.deepEqual(jobFirstCraft(page, "web_page"), page);
  assert.deepEqual(jobFirstCraft([{ criterion: "Job done", weight: 100, test: "It works." }], "code").map(c => c.weight), [90, 10]);
});

test("each family's real candidates, completeness list and brand-context slice are data a job skill can carry", () => {
  for (const family of FAMILIES) {
    assert.ok(familySlice(family).diverge.startsWith(CANDIDATES[family]), family);
    const gates = familyGates(family);
    assert.match(gates[0], /^The hand-over fits: the native work first, with context only when needed, with nothing internal in it\./, family);
    assert.ok(gates[0].includes(WORD_BUDGETS[family]), family);
    assert.equal(gates.some(g => g === `Format complete: ${(COMPLETENESS[family] ?? []).join("; ")}.`), Boolean(COMPLETENESS[family]), family);
    assert.equal(gates.length, 1 + Number(Boolean(PROVEN_LEVERS[family])) + Number(Boolean(COMPLETENESS[family])), family);
    assert.equal(contextNeed(family).take, CONTEXT_LEVELS[CONTEXT_NEED[family]], family);
    // No "2 or 3 directions" left: candidates are made, not described.
    assert.doesNotMatch(familySlice(family).diverge, /2 or 3|directions|hypothes/i, family);
  }
  assert.deepEqual(Object.keys(COMPLETENESS), ["web_page", "ad_creative", "email", "plan"]);
  assert.ok(COMPLETENESS.ad_creative!.some(x => /brand and the price named for a cold audience/.test(x)));
  assert.ok(COMPLETENESS.email!.includes("one product and one ask in every email"));
  assert.ok(COMPLETENESS.plan!.includes("totals that add up") && COMPLETENESS.plan!.includes("break-even shown"));
  for (const family of ["strategy", "plan", "code", "ops_doc", "other"] as const) assert.ok(["none", "facts"].includes(CONTEXT_NEED[family]), `${family} never demands a brand capture`);
});

test("a built job skill carries its family's candidates and completeness list, and the pack still lints clean", async () => {
  const email: JobType = { ...LANDING_PAGE, id: "welcome-series", title: "Welcome email series", family: "email" };
  const input: PackInput = {
    persona: { ...NOVA, profile: { ...NOVA.profile, outcomes: [{ ...NOVA.profile.outcomes[0], job_type_id: email.id }] } }, role: null, kit: null,
    jobTypes: [...FIXTURE_JOB_TYPES, email],
    templates: Object.fromEntries(["AGENTS.md", "WORK-METHOD.md", "README.md", "LICENSE.md"].map(p => [p, shared(p)])),
    tools: { "capture-brand-dna.mjs": "// capture\nexport {};\n", "brand-dna-snippet.js": "// snippet\n", "check-brand-fidelity.mjs": "// check\nexport {};\n", "ai-default-patterns.md": "# AI default patterns\n" },
    options: { kind: "agent", version: "t", updated: "2026-11-10" },
  };
  const pack = await buildPack(input);
  const skill = pack.files.find(f => f.path === `skills/${email.id}/SKILL.md`)!.content;
  assert.ok(skill.includes(CANDIDATES.email), "the candidates reach the job skill");
  assert.ok(skill.includes(`Format complete: ${COMPLETENESS.email!.join("; ")}.`), "the completeness list reaches the job skill");
  assert.ok(skill.includes("The hand-over fits: the native work first, with context only when needed"));
  assert.deepEqual(lintPack(pack), []);
});
