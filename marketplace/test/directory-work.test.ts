// What kind of work an agent does, read from its outcomes (src/modules/directory/work.ts): the "Makes: ..." line on
// cards and profiles, and the grouping of the profile's task list. Titles here are real outcome titles from the roster.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  groupByNature, lowerFirst, NATURE_LABELS, notMaking, outcomeNature, outcomeThing, taskNature, workLine, workLineText,
} from "../src/modules/directory/work.ts";

test("an outcome is a review, a plan or a made thing, by what its title names", () => {
  for (const title of [
    "A landing page teardown with ranked fixes", "A message match check between your ad and page", "A crawl and indexing fix list from your crawl export",
    "A read-out of your Search Console indexing report", "A monthly cost-per-lead and lead-quality review", "A check of whether the profit is real",
    "An NPS results analysis", "A review of your money controls", "A monthly design system health check",
  ]) assert.equal(outcomeNature(title), "review", title);
  for (const title of [
    "A logo design brief for your designer", "A 90-day SEO plan built from your Search Console export", "A keyword map for your site",
    "A plan to earn more honest reviews", "A site migration redirect map and launch checklist", "A hiring day plan and interview scorecard",
    "A new starter and leaver IT checklist",
  ]) assert.equal(outcomeNature(title), "plan", title);
  for (const title of [
    "Landing page copy for one offer", "A welcome email series, planned and written", "Replies to a batch of up to 30 customer emails",
    "Search and call ad copy by service and area", "One messy file cleaned up with tests", "Design tokens as a JSON file",
    // Two things: the first one decides, and "a photo shot list" is the second.
    "Item descriptions and a photo shot list", "Vetting questions and red flags to check",
  ]) assert.equal(outcomeNature(title), "make", title);
  // One bare word left of the title: the search hint decides.
  assert.equal(outcomeNature("A month of Meta ads, planned", "meta ads plan"), "plan");
});

test("the short name of an outcome drops the lead-in and the detail, and falls back to the search hint", () => {
  assert.equal(outcomeThing("A landing page teardown with ranked fixes"), "landing page teardown");
  assert.equal(outcomeThing("A logo design brief for your designer", "logo design brief"), "logo design brief");
  assert.equal(outcomeThing("A 90-day SEO plan built from your Search Console export", "seo plan"), "90-day SEO plan");
  assert.equal(outcomeThing("Replies to a batch of up to 30 customer emails", "customer reply drafts"), "customer reply drafts");
  // One bare word: the hint stands in, with its short forms in capitals.
  assert.equal(outcomeThing("A check of whether the profit is real", "profit quality review"), "profit quality review");
  assert.equal(outcomeThing("A check of AI-written code", "ai generated code review"), "AI generated code review");
  // What was done to a thing is not the thing: the hint names it.
  assert.equal(outcomeThing("Your bank statement matched to your books", "bank reconciliation"), "bank reconciliation");
  assert.equal(outcomeThing("A CV tailored to one job ad", "tailored cv"), "tailored CV");
  // "in" inside "in-store" and "after" inside "before and after" are not where the detail starts.
  assert.equal(outcomeThing("Window and in-store signage copy", "retail signage copy"), "window and in-store signage copy");
  assert.equal(outcomeThing("Before and after survey instruments", "before and after survey"), "before and after survey instruments");
  // Sentence case goes; names keep their capitals.
  assert.equal(outcomeThing("Gatekeeper and voicemail scripts"), "gatekeeper and voicemail scripts");
  assert.equal(outcomeThing("A Google Ads search campaign plan"), "Google Ads search campaign plan");
  // Too long with no hint: the first of the two things.
  assert.equal(outcomeThing("Local Services Ads set-up and lead dispute notes"), "Local Services Ads set-up");
  assert.equal(outcomeThing("CSS variables or a Tailwind theme"), "CSS variables or a Tailwind theme");
  // No file path, no trailing joining word, at most six words.
  for (const title of ["A site structure for your website", "A set of triage rules for your inbox", "Answers to staff questions from your own rules"]) {
    const thing = outcomeThing(title, "fallback hint words");
    assert.ok(thing.split(/\s+/).length <= 6 && !/[\\/]/.test(thing) && !/\b(and|or)$/.test(thing), `${title} -> ${thing}`);
  }
});

const DAWEI = [
  { title: "A landing page teardown with ranked fixes", job_type_hint: "landing page audit" },
  { title: "A rewrite of your top screen", job_type_hint: "hero section copy" },
  { title: "An A/B test plan for your top change", job_type_hint: "ab test plan" },
  { title: "A message match check between your ad and page", job_type_hint: "message match review" },
];
const RENATA = [
  { title: "A logo design brief for your designer", job_type_hint: "logo design brief" },
  { title: "A colour palette with hex codes and contrast", job_type_hint: "colour palette" },
  { title: "A font pairing and type scale", job_type_hint: "font pairing" },
  { title: "A full visual identity brief", job_type_hint: "visual identity brief" },
  { title: "A one-file brand brief with your voice and story", job_type_hint: "one-file brand brief" },
];

test("the work line says what most of an agent's outcomes are: an auditor reviews, a brief writer plans", () => {
  // Dawei is titled "Landing page CRO specialist" and audits pages: two reviews, one plan, one rewrite.
  const dawei = workLine(DAWEI, ["Fake testimonials or invented numbers", "Guaranteed conversion lifts"])!;
  assert.deepEqual(dawei, { nature: "review", label: "Reviews and advises", things: ["landing page teardown", "message match check"], does_not: null });
  assert.equal(workLineText(dawei), "Reviews and advises: landing page teardown and message match check");
  // Renata is titled "Brand designer" and writes briefs. Her own "Not for" line says so, and it rides along.
  const renata = workLine(RENATA, ["Drawing the logo or making files", "Trademark checks or legal advice"])!;
  assert.equal(renata.nature, "plan");
  assert.equal(renata.label, NATURE_LABELS.plan);
  assert.deepEqual(renata.things, ["logo design brief", "full visual identity brief", "one-file brand brief"]);
  assert.equal(renata.does_not, "Drawing the logo or making files");
  assert.equal(workLineText(renata), "Plans and briefs: logo design brief, full visual identity brief and one-file brand brief");
});

test("an agent that makes as much as it plans is a maker; nobody without outcomes gets a line", () => {
  const candice = workLine([
    { title: "A 90-day email plan" }, { title: "A list segmentation plan" }, { title: "A welcome email series, planned and written", job_type_hint: "welcome email sequence" },
    { title: "A launch email sequence" }, { title: "A newsletter or campaign email with five subject lines" }, { title: "A deliverability and consent checklist" },
  ])!;
  assert.equal(candice.nature, "make");
  assert.deepEqual(candice.things, ["welcome email series", "launch email sequence", "newsletter or campaign email"]);
  // A plan and a review each: the first outcome, the agent's lead offer, decides.
  assert.equal(workLine([{ title: "A hiring plan for one role" }, { title: "A weekly hiring progress report" }])!.nature, "plan");
  assert.equal(workLine([{ title: "A weekly hiring progress report" }, { title: "A hiring plan for one role" }])!.nature, "review");
  assert.equal(workLine([]), null);
  assert.equal(workLine(undefined), null);
  // One thing reads without "and"; the same thing is never listed twice.
  assert.equal(workLineText(workLine([{ title: "A cold call script for one buyer type" }, { title: "A cold call script for one buyer type" }])!), "Makes: cold call script");
});

test("a 'Not for' line counts only when it says the agent does not make the finished thing", () => {
  assert.equal(notMaking(["Drawing the logo or making files"]), "Drawing the logo or making files");
  assert.equal(notMaking(["Trademark checks", "Producing finished artwork or screens"]), "Producing finished artwork or screens");
  assert.equal(notMaking(["Designing the final image file"]), "Designing the final image file");
  assert.equal(notMaking(["Fake reviews", "Guaranteed rankings", "Legal advice"]), null);
  assert.equal(notMaking(undefined), null);
  assert.equal(lowerFirst("Drawing the logo or making files"), "drawing the logo or making files");
  assert.equal(lowerFirst("SEO audits"), "SEO audits");
});

test("a toolbox task is made, planned or reviewed by its first word, then its kind", () => {
  assert.equal(taskNature("Lay out a flyer, postcard or handout", "ad_creative"), "make");
  assert.equal(taskNature("Check a print file before it goes to the printer", "audit"), "review");
  assert.equal(taskNature("Review an existing design and list the fixes", "other"), "review");
  assert.equal(taskNature("Plan event signs and wayfinding", "other"), "plan");
  assert.equal(taskNature("Turn a thin request into a brief and copy deck", "plan"), "plan");
  assert.equal(taskNature("Write or tighten the words for a printed piece", "copy"), "make");
  const tasks = [
    { id: "a", nature: "make" as const }, { id: "b", nature: "review" as const }, { id: "c", nature: "make" as const }, { id: "d", nature: "plan" as const },
  ];
  const groups = groupByNature(tasks);
  assert.deepEqual(groups.map(g => [g.nature, g.heading, g.tasks.map(t => t.id)]), [
    ["make", "Things I make", ["a", "c"]], ["review", "Things I check and advise on", ["b"]], ["plan", "Things I plan", ["d"]],
  ]);
});
