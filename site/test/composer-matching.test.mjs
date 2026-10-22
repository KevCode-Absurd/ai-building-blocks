import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { decodeCatalogue, freeSelection, finalize } from "../src/lib/composer-core.ts";
const c = decodeCatalogue(JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8")));

test("ordinary phrasing and business context retain the requested specialist", () => {
  const slugs = goal => freeSelection(c, goal).steps.map(s => s.slug);
  for (const [task, specialist] of [
    ["audit my ad", "pre-launch-ad-checker"],
    ["write a product FAQ", "hard-questions-faq-writer"],
    ["create an incident response runbook", "incident-runbook-writer"],
  ]) {
    const expected = slugs(task);
    assert.ok(expected.includes(specialist));
    assert.ok(!expected.includes("request-deliverable-drafter"));
    for (const prefix of ["", "I want to ", "Can you please help me ", "We would like to "]) {
      for (const suffix of ["", " for my ecommerce store", " of our online business"]) {
        const goal = `${prefix}${task}${suffix}`;
        assert.deepEqual(slugs(goal), expected, goal);
      }
    }
  }
});

test("ad audits review supplied creative or account instead of collecting or generating ads", () => {
  for (const goal of ["i want to audit my ad of my ecommerce store", "I want to review my Facebook ad", "Review this video ad for my store", "Can you check my advertisement"]) {
    const plan = finalize(c, freeSelection(c, goal), "free");
    const slugs = plan.steps.map(s => s.slug);
    assert.ok(slugs.includes("pre-launch-ad-checker"), goal);
    assert.ok(slugs.includes("claim-and-proof-matcher"), goal);
    assert.ok(!slugs.some(s => /request-deliverable|collector|quote-video-ad-script|ad-account-audit/.test(s)), goal);
    assert.ok(plan.missing.some(p => ["copy_draft", "script"].includes(p.type)), "Existing ad copy must be supplied, not invented");
    assert.match(plan.steps[0].notes, /Require the existing ad/);
    if (/video/.test(goal)) assert.ok(slugs.includes("video-ad-bridge-checker"));
  }
  const account = freeSelection(c, "Please audit my Google Ads account performance");
  assert.deepEqual(account.steps.map(s => s.slug), ["ad-data-quality-checker", "google-ads-account-auditor"]);
  const creation = freeSelection(c, "Turn customer reviews into checked video ad scripts");
  assert.ok(creation.steps.some(s => s.slug === "quote-video-ad-script"));
  assert.ok(!creation.steps.some(s => s.slug === "pre-launch-ad-checker"));
});

test("review intent survives polite wording without choosing a non-review specialist", () => {
  for (const task of ["audit my ecommerce store", "check my spreadsheet formulas"]) {
    const base = freeSelection(c, task).steps.map(s => s.slug);
    const polite = freeSelection(c, `I want to ${task}`).steps.map(s => s.slug);
    assert.deepEqual(polite, base, task);
    assert.ok(base.some(slug => c.bySlug[slug].role === "check" && !slug.startsWith("request-")), task);
  }
  const unrelated = freeSelection(c, "Plan my trip; do not audit any ads");
  assert.ok(!unrelated.steps.some(s => s.slug === "pre-launch-ad-checker"));
});
