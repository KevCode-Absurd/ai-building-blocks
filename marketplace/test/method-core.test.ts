// The method core: METHOD.md stays complete (and bloat-guarded), the craft weights are job-first, and each family's real
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

const shared = (p: string) => readFileSync(new URL(`../packs/shared/${p}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const METHOD = shared("METHOD.md");
const FAMILIES = Object.keys(WORD_BUDGETS) as DeliverableFamily[];
const DATA = new URL("../src/modules/catalogue/data/", import.meta.url);
const allJobTypes = (): JobType[] => readdirSync(DATA).filter(f => f.endsWith(".json")).flatMap(f => JSON.parse(readFileSync(new URL(f, DATA), "utf8")));

test("METHOD.md stays under its bloat guard and still covers every part of the method", () => {
  const words = METHOD.split(/\s+/).filter(Boolean).length;
  // 1,000 until 13 Nov 2026; the pack lookup, outside-evidence checks and two-order blind pick added about 100. The
  // owner rules (13 Nov) fit inside the same cap: their detail lives in the quality engine, and the whole one-shot
  // reading list is held under 6,000 words in packs-grounded.test.ts. The round 2 rollback (13 Nov) added the doubt
  // rule, the owner's named priority and the copy check, about 75 words.
  // Ask or start (14 Nov) added the readiness check and the rubric. Owner, 14 Nov: no cap that costs quality, so this
  // is a bloat guard, not a target: raise it when the method needs the words, never cut useful lines to fit.
  // Brand brain v2 (14 Nov) made build, write and gate the first step of buyer-facing work and a hand-over gate: +40 words.
  // One method (15 Nov 2026, CS329Z W2): WORK-METHOD.md, the quality engine's steps, INTAKE.md and ROUTING.md (4,895
  // words in all) merged into METHOD.md, each rule once, plus the step table, the chat path and the stuck rule.
  // The org context (15 Nov) named its sections in step 1, and rule 6 now says where facts come from (sound sources
  // first, then the e-commerce library) and what to do without web search: about 200 words.
  // The owner-requested automation-debt review adds one conditional reference, not a new universal workflow.
  assert.ok(words < 5500, `METHOD.md has ${words} words`);
  const parts: [string, RegExp][] = [
    ["spec sheet", /## 0\. Frame and ask[\s\S]*\*\*The spec sheet\.\*\*[\s\S]*who must do what after seeing this[\s\S]*\*\*Deliverables:\*\* exact count and format/],
    ["signal pass", /\*\*Signal pass:\*\* the signals in the owner's data that change the decision: as many as the data holds, or none\.[^\n]*For each: its number, what it means for the decision, and where the deliverable acts on it\./],
    ["ground only what the job needs", /## 1\. Ground: foundation first, then only what the job needs\n\nFollow `tools\/quality\/FOUNDATION\.md`[\s\S]*Capture what the signals and the decision depend on, and no more/],
    ["toolbox", /\nYour `toolbox\.md` lists what to use when; pick at your own discretion and open only what you pick\.\n/],
    ["real candidates", /make about 3 candidates of the part that decides the outcome, as real work, not descriptions/],
    ["outside chooser", /fresh reviewer who has not seen your reasoning[\s\S]*SAME-CONTEXT[\s\S]*one more round only/],
    ["craft floor", /New framing of true facts, never new facts\.[\s\S]*Never a menu\.[\s\S]*5 real brand lines beside 5 of yours/],
    ["truth gate with sourced claims", /Each claim a buyer or the client will read \(prices, counts, ratings, policies, names, delivery times, quotes, product properties\): sourced or not\.[\s\S]*Remove each unsourced claim, or rewrite it to what the source says\. Never flag or footnote it\./],
    ["buyer can act", /\*\*Can the buyer act today\?\*\* Confirm the thing sold is live, in stock[\s\S]*say so in your first line/],
    ["format completeness", /\*\*Finish the format\.\*\* Ads:[\s\S]*Emails:[\s\S]*Plans:[\s\S]*Pages:/],
    ["client's-eye check", /## 5\. Check: tools first, then one fresh pass[\s\S]*\*\*One fresh pass\.\*\* A fresh reviewer \(rule 7\) gets only the owner's original brief, the anonymous final and plain drafts in shuffled order, the actual renders and the facts the work rests on \(`context\/facts\.md`\)/],
    ["hand-over shape", /Nothing internal reaches the client[\s\S]*appendix inside the deliverable[\s\S]*The native work comes first/],
    ["rules I learned", /A lesson about this client goes in `context\/MEMORY\.md`, never in playbook\.md\. A general lesson goes to "Rules I learned" in playbook\.md only on the owner's yes/],
    // The Quality Engine v2.1 rules (11 Nov 2026 benchmark: 88% of 128 blind verdicts against a plain model).
    ["expert and playbook", /\*\*Expert and playbook:\*\*[\s\S]*The expert draft is the expert's standard playbook done excellently; clever ones must beat it\./],
    ["plain yardstick and final pick", /The plain draft is a one-pass answer from the brief alone: the yardstick[\s\S]*the anonymous final and plain drafts in shuffled order/],
    ["facts versus proposals", /\*\*Facts and proposals differ\.\*\* Facts carry a source and a date[\s\S]*Label projections and show ranges outside buyer copy\. Proposals are stated plainly and decided\.[\s\S]*Keep the fields a brief asks for in a template or per-customer macro; otherwise no blanks, placeholders/],
    ["length against the owner's limit", /\*\*Length follows use\.\*\* Stay within the owner's limit, counted the way the owner counts[\s\S]*the family profile[\s\S]*A ceiling is never a target\. No sections about method, assumptions or how the work was made\./],
    // The owner rules (13 Nov 2026 owner bench): finish one-shot work, combine complementary levers, act fully, project.
    ["owner override", /^# Method\n\n\*\*The owner comes first:\*\* if a rule in this pack would make the work worse for this owner's stated goal and data, follow the owner and say why in one line\./],
    ["one-shot finish", /\*\*Finish and decide: the rule for doubt\.\*\* Deliver every piece the owner asked for; never drop or water one down to stay safe\. Decide each open point with the assumption a top practitioner would pick\. At most three assumption lines[^\n]*The deliverable never holds a "To confirm" list, open questions, or a request for a yes, a sign-off or a choice\./],
    ["legal sign-off next to its item", /A sign-off that law or a platform needs is one line next to its item\./],
    // Brand brain v2 (14 Nov 2026): the fast path once skipped brand DNA on every data-rich brief, so buyer-facing
    // work had no voice to match. Now it never skips the org context (was the brand brain) for ads, copy, emails or pages.
    ["fast path", /\*\*The fast path\*\* is one-shot work where the brief carries the data and nothing in it is buyer-facing[\s\S]*\| 1 Ground \| The brief's data, plus the org context if buyer-facing \|[\s\S]*Buyer-facing one-shot work is not the fast path[\s\S]*Buyer-facing work never skips the org context/],
    ["decide, combining complementary moves", /\*\*Decide\.\*\* One recommendation, which may combine complementary moves; a runner-up only when the options truly exclude each other\. Never a menu\./],
    ["act fully", /\*\*Act fully\.\*\* If the deliverable keeps anything a signal says to cut, say why in one line with the number\./],
    ["persona's real moment", /\*\*Fit the persona's real moment\*\* in every time, place, unit and channel\./],
    ["first screen", /its first screen holds the decision, the numbers the owner asked for by name, every piece of bad news, and the first move this week\./],
    ["nothing left to the owner", /4\. What is left for the owner to do: questions, sign-offs, choices, placeholders\.[\s\S]*Fix 1, 3 and 4, cut 5,/],
    // Round 2 rollback (13 Nov 2026): the owner's named priority, no bolder move in copy, counts by script, nothing
    // internal in customer copy, relative days.
    ["owner's priority", /A priority the owner names takes a top slot unless the data clearly says otherwise; then say why in one line\./],
    ["no bolder move in copy", /Every plan, strategy or recommendation carries one labelled \*\*bolder move\*\*[^\n]*Customer copy never carries one\./],
    ["copy counted by script", /character counts checked with `node tools\/quality\/copy-check\.cjs`/],
    ["nothing internal in customer copy", /no working notes, signal maps, ledgers or monitoring lines in what the customer reads/],
    ["plans in relative days", /Plans: totals that add up, steps with owners and relative days\./],
    ["fresh facts", /Recheck on the day facts that change/],
    ["hand-over check tool", /With `--plain`, qe-check also runs the hand-over check; fix every hit\./],
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
  assert.deepEqual(METHOD.split("\n").filter(l => l.includes("To confirm")).map(l => /never holds a "To confirm" list/.test(l)), [true]);
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
    templates: Object.fromEntries(["AGENTS.md", "METHOD.md", "WORK-METHOD.md", "README.md", "LICENSE.md"].map(p => [p, shared(p)])),
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
