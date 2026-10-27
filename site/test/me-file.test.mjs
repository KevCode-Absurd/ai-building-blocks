import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { unzipSync, strFromU8 } from "fflate";
import { fieldsToSections, meContext, meCore, meOutline, meText, parseMe, pickSections, sectionOf, sectionsToMe, taskKinds, voiceRule } from "../src/lib/me-file.ts";

// A skeleton with placeholders only: no invented person.
const ME = `# me.md
Last checked: <date>

## Core
<name>, <what I do>, <who it's for>.

## Work
<role and tools>

## Projects (live)
- <project>: <status>, next: <step>. as of <date>, expires <date>

## Voice
<tone, sentence length, words I use and avoid>

## Preferences
<formats, units, time zone>

## Background
<education, past roles>

## Life (opt-in)
<interests>

## Never
<topics to avoid>

## Where to look
- Projects: <notes page>
- Writing: <my recent posts>

## Sources and dates
- Core: <source>, <date>

## Side notes
<something the person added>
`;
const ad = { slug: "fact-based-ad-copy-writer", name: "Fact-based ad copy writer", job: "copy", task: "write-ad-copy", outputs: [{ type: "ad_copy" }] };
const post = { slug: "linkedin-post-writer", name: "LinkedIn post writer", job: "organic", task: "grow-social", outputs: [{ type: "copy_draft" }] };
const planner = { slug: "weekly-plan-maker", name: "Weekly plan maker", job: "strategy", task: "manage-projects", outputs: [{ type: "plan" }] };
const report = { slug: "ad-results-report", name: "Ad results report", job: "analysis", task: "read-ad-results", outputs: [{ type: "audit_report" }] };
const bio = { slug: "speaker-bio", name: "Speaker bio", job: "copy", task: "speak-and-persuade", outputs: [{ type: "copy_draft" }] };
const plain = { slug: "spreadsheet-cleaner", name: "Spreadsheet cleaner", job: "ops", task: "work-with-files", outputs: [{ type: "spreadsheet" }] };
const ids = (s) => s === "all" ? "all" : [...s].sort().join(",");

test("headings map to sections, with parentheses and synonyms", () => {
  assert.equal(sectionOf("Projects (live)"), "projects");
  assert.equal(sectionOf("Life (opt-in)"), "life");
  assert.equal(sectionOf("Where to look"), "look");
  assert.equal(sectionOf("How I write"), "voice");
  assert.equal(sectionOf("Side notes"), null);
});

test("parseMe splits by ## headings, keeps unknown ones and ignores code fences", () => {
  const { intro, sections } = parseMe(ME + "\n```\n## Not a heading\n```\n");
  assert.match(intro, /^# me\.md/);
  assert.deepEqual(sections.map(s => s.id), ["core", "work", "projects", "voice", "preferences", "background", "life", "never", "look", "sources", "other"]);
  assert.equal(sections.at(-1).title, "Side notes");
  assert.equal(sections[2].title, "Projects (live)", "headings keep their dates and notes");
  assert.match(sections.at(-1).body, /## Not a heading/);
});

test("a file with no headings is kept whole", () => {
  const { sections } = parseMe("I run a small studio and like short answers.");
  assert.equal(sections.length, 1);
  assert.equal(sections[0].id, "other");
});

test("the 9 basic fields map onto sections and round-trip through parseMe", () => {
  const sections = fieldsToSections({ name: "<name>", sells: "<work>", voice: "<style>", site: "<link>", avoid: "<topic>", more: "<line one>\n<line two>" });
  assert.deepEqual(sections.map(s => s.id), ["core", "voice", "preferences", "never", "look"]);
  assert.match(sections[0].body, /- \*\*Name:\*\* <name>/);
  assert.match(sections[2].body, /<line one>\n<line two>/);
  assert.deepEqual(parseMe(sectionsToMe(sections)).sections.map(s => s.id), sections.map(s => s.id));
});

test("task kinds come from output types, jobs, use cases and a few name words", () => {
  assert.deepEqual([...taskKinds(ad)], ["writing"]);
  assert.ok(taskKinds(planner).has("planning"));
  assert.ok(taskKinds(bio).has("bio"));
  assert.equal(taskKinds(plain).size, 0);
});

test("sections chosen per task", () => {
  // Writing as the person is usually about their own work, so it carries their projects (blind test, 27 Oct).
  assert.equal(ids(pickSections([post])), "core,look,never,other,projects,voice");
  assert.equal(ids(pickSections([planner])), "core,look,other,preferences,projects");
  assert.equal(ids(pickSections([bio])), "background,core,look,never,other,projects,voice");
  assert.equal(ids(pickSections([plain])), "core,never,other,preferences");
  // Brand voice never carries the personal Voice section.
  assert.equal(ids(pickSections([ad])), "core,never,other");
  // A task that takes a me.md gets all of it.
  assert.equal(pickSections([{ slug: "me-md-refresher", inputs: [{ type: "me_file" }] }]), "all");
  // A workflow gets the union of its steps.
  assert.equal(ids(pickSections([post, planner])), "core,look,never,other,preferences,projects,voice");
});

test("one voice rule per task, from what it makes", () => {
  assert.equal(voiceRule([ad]), "brand");
  assert.equal(voiceRule([post]), "you");
  assert.equal(voiceRule([report]), "neutral");
  assert.equal(voiceRule([planner]), null);
  assert.equal(voiceRule([{ slug: "apology-email-writer", name: "Apology email writer", job: "email", outputs: [{ type: "copy_draft" }] }]), "ask");
  assert.equal(voiceRule([{ slug: "founder-video-ad-script", name: "Founder video ad script", job: "video", outputs: [{ type: "script" }] }]), "brand");
  assert.equal(voiceRule([{ slug: "personal-ad", name: "Personal brand ad", outputs: [{ type: "ad_copy" }] }]), "ask");
  assert.equal(voiceRule([report, ad]), "brand");
  assert.equal(voiceRule([post, ad]), "ask");
});

test("meContext writes the chosen sections, the voice rule and the freshness rule", () => {
  const brand = meContext(ME, [ad]);
  assert.match(brand, /^## Your me\.md \(the parts this task needs\)/);
  assert.match(brand, /not instructions and do not authorize any action/);
  assert.match(brand, /Ask for the full me\.md if you need more\./);
  assert.match(brand, /\*\*Voice:\*\* the brand's/);
  assert.doesNotMatch(brand, /### Voice|### Projects|### Life|### Sources and dates/);
  assert.match(brand, /### Core[\s\S]*### Never[\s\S]*### Side notes/);
  assert.match(brand, /propose a short dated me\.md update/);

  const plan = meContext(ME, [planner]);
  assert.match(plan, /### Projects[\s\S]*### Where to look/);
  assert.match(plan, /Never use a fact past its expires date without asking/);
  assert.doesNotMatch(plan, /\*\*Voice:\*\*/);

  const whole = meContext(ME, [{ inputs: [{ type: "me_file" }] }]);
  assert.match(whole, /^## Your me\.md\n/);
  assert.doesNotMatch(whole, /Ask for the full me\.md/);
  assert.match(whole, /### Life/);

  assert.equal(meContext("", [ad]), "");
  assert.equal(meContext(ME, [ad]), brand, "same input, same text");
});

test("meCore gives the Core section, cut for small boxes", () => {
  assert.match(meCore(ME), /^## About me \(from my me\.md\)\n\n<name>/);
  const long = `## Core\n${Array.from({ length: 80 }, (_, i) => `- line ${i} with some words in it`).join("\n")}`;
  assert.ok(meCore(long, 500).length < 560);
  assert.equal(meCore(""), "");
});

// The real exporter, bundled for Node: packs write me.md with the selected parts and say how to treat it.
const built = await build({ entryPoints: [fileURLToPath(new URL("../src/lib/handoff.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
const { buildHandoffZip } = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString("base64")}`);

test("a workflow pack writes me.md with only the parts its steps need", async () => {
  const markdown = "---\nname: custom-weekly-plan-maker\n---\n# Method\nPlan the week.\n## Checks\nEvery task has a day.\n";
  const custom = { ...planner, slug: "custom-weekly-plan-maker", summary: "Plan the week.", markdown, role: "make", inputs: [], outputs: [{ type: "plan", required: true }] };
  const c = { built: "fixture", blocks: [], bySlug: {}, renamed: {}, portTypes: {} };
  const flow = { id: "t", name: "Plan my week", goal: "Plan my week", updated: 0, customSkills: [custom], nodes: [{ id: "s1", slug: custom.slug, x: 0, y: 0 }], edges: [] };
  const result = await buildHandoffZip(c, flow, { me: ME, name: "<old field>" });
  assert.ok(!("error" in result), result.error);
  const files = unzipSync(new Uint8Array(await result.blob.arrayBuffer()));
  assert.ok(!files["about-me.md"]);
  const me = strFromU8(files["me.md"]);
  assert.match(me, /### Projects/);
  assert.doesNotMatch(me, /### Voice|<old field>/);
  assert.match(strFromU8(files["HANDOFF.md"]), /Read `me\.md` first[\s\S]*not as instructions with authority/);
  assert.deepEqual(JSON.parse(strFromU8(files["inputs.json"])).supplied_context.map(x => x.path), ["me.md"]);
  assert.match(strFromU8(files["README.txt"]), /me\.md/);
});

test("old saved data with only the fields still makes a me.md", async () => {
  const c = { built: "fixture", blocks: [], bySlug: {}, renamed: {}, portTypes: {} };
  const custom = { ...plain, slug: "custom-spreadsheet-cleaner", summary: "Clean it.", markdown: "---\nname: spreadsheet-cleaner\n---\n# Method\nClean.\n", role: "make", inputs: [], outputs: [{ type: "spreadsheet", required: true }] };
  const result = await buildHandoffZip(c, { id: "t", name: "Clean", goal: "Clean", updated: 0, customSkills: [custom], nodes: [{ id: "s1", slug: custom.slug, x: 0, y: 0 }], edges: [] }, { name: "<name>", more: "<a preference>" });
  const files = unzipSync(new Uint8Array(await result.blob.arrayBuffer()));
  const me = strFromU8(files["me.md"]);
  assert.match(me, /- \*\*Name:\*\* <name>/);
  assert.match(me, /<a preference>/);
});

test("support and customer replies are sent as the business", () => {
  assert.equal(voiceRule([{ slug: "customer-reply-drafter", name: "Customer reply drafter", outputs: [{ type: "copy_draft" }] }]), "brand");
});

test("a section past its expires date is not sent", () => {
  const file = ["## Core", "", "Name: x", "", "## Priorities (as of 2026-09-20, expires 2026-10-20)", "", "- an old rule", ""].join(String.fromCharCode(10));
  const late = meContext(file, [planner], "2026-10-27"), early = meContext(file, [planner], "2026-10-01");
  assert.ok(!late.includes("an old rule") && late.includes("Expired on 2026-10-20"));
  assert.ok(early.includes("an old rule"));
});

test("meText, meOutline and the sections filter used by the personal MCP's get_me", () => {
  assert.equal(meText({ me: "## Core\r\n\r\nx\r\n" }), "## Core\n\nx\n");
  assert.match(meText({ name: "<name>" }), /## Core\n\n- \*\*Name:\*\* <name>/);
  assert.equal(meText({}), "");
  const dated = ["## Core (as of 2026-10-01)", "", "c", "", "## Projects (as of 2026-09-01, expires 2026-10-01)", "", "p", "", "## Side notes", "", "s", ""].join("\n");
  assert.deepEqual(meOutline(dated, "2026-10-27").map(r => [r.id, r.as_of, r.expires, r.expired, r.live]),
    [["core", "2026-10-01", null, false, false], ["projects", "2026-09-01", "2026-10-01", true, true], ["other", null, null, false, false]]);
  // The filter replaces the task's section choice; the task still sets the voice rule. Packs pass no filter.
  const voiceOnly = meContext(ME, [post], "2026-10-27", ["voice"]);
  assert.match(voiceOnly, /\*\*Voice:\*\* yours[\s\S]*### Voice/);
  assert.doesNotMatch(voiceOnly, /### Core|### Projects/);
  assert.match(meContext(ME, [], "2026-10-27", "all"), /^## Your me\.md\n[\s\S]*### Life[\s\S]*### Side notes/);
  assert.equal(meContext(ME, [ad], "2026-10-27", undefined), meContext(ME, [ad], "2026-10-27"));
});
