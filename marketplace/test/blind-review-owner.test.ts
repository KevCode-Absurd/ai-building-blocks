// The fresh reviewer judges as the owner: the sheet asks the owner's nine questions and three checks against the
// owner's original brief, and the verdict format the tally depends on is unchanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/** Plain-JS pack tools have no type declarations: load them untyped. */
const load = (rel: string): Promise<any> => import(rel);
const TOOL = fileURLToPath(new URL("../packs/shared/tools/blind-review.mjs", import.meta.url));
const QUALITY = fileURLToPath(new URL("../packs/shared/tools/quality/", import.meta.url));

test("the sheet asks the owner's nine questions and five checks against the owner's brief", async () => {
  const { sheet, OWNER_QUESTIONS, OWNER_CHECKS } = await load("../packs/shared/tools/blind-review.mjs");
  assert.equal(OWNER_QUESTIONS.length, 9);
  assert.equal(OWNER_CHECKS.length, 5);
  const s: string = sheet("Cut churn in the next two quarters. Data: yearly payers churn far less.", ["Draft one", "Draft two"], 1);
  assert.match(s, /You are the owner who wrote the brief/);
  for (const name of ["Fit", "New insight", "Priorities", "Reasoning", "Correct", "Clear", "Voice", "Range", "Ready to use"]) {
    assert.match(s, new RegExp(`^\\d\\. ${name}:`, "m"), name);
  }
  assert.match(s, /fully, partly or not at all/, "signal check");
  assert.match(s, /confirm lists, requests for my yes or sign-off, alternates/, "homework check");
  assert.match(s, /stock rule or template[\s\S]*goal and data point the other way/, "rule-over-owner check");
  // Round 2 (13 Nov 2026): the two checks that catch a dropped ask and a weight, order or ask set against the signal.
  assert.match(s, /## Five checks/);
  assert.match(s, /^\d\. Asks\. List every explicit ask in the brief\. For each draft, name any ask it drops/m, "asks check");
  assert.match(s, /^\d\. Signal sets the call\. Name any weight, order, ask or timing in a draft that cuts against a signal the draft itself quotes/m, "signal-sets check");
  assert.match(s, /a bolder move or second recommendation when I asked for one/);
  assert.match(s, /Length is not quality/);
  assert.match(s, /VERDICT: A or B or TIE, naming the draft the owner would rather pay for/);
  assert.match(s, /GRAFT:/);
  assert.match(s, /## The brief\n\nCut churn/);
  // No word counts on the sheet (15 Nov 2026): they prime the reviewer on length; key.json keeps them.
  assert.match(s, /## Draft A\n\nDraft one[\s\S]*## Draft B\n\nDraft two/);
  assert.doesNotMatch(s, /\(\d+ words\)/);
  assert.doesNotMatch(s, /acceptance test/i, "the reviewer judges the owner's brief, not the writer's spec");
  const four: string = sheet("Brief.", ["a", "b", "c", "d"], 2);
  assert.match(four, /VERDICT: A or B or C or D or TIE/);
});

test("verdictOf and the two-order tally still parse the reply", async () => {
  const { tally, verdictOf } = await load("../packs/shared/tools/blind-review.mjs");
  assert.equal(verdictOf("Signals: ...\n**VERDICT:** b\nGRAFT: none"), "B");
  assert.equal(verdictOf("VERDICT: A\nlater thoughts\nVERDICT: TIE"), "TIE");
  assert.equal(verdictOf("no verdict"), null);
  const key = { sheets: [["x.md", "y.md"], ["y.md", "x.md"]] };
  assert.equal(tally(key, ["VERDICT: B", "VERDICT: A"]).winner, "y.md");
  assert.equal(tally(key, ["VERDICT: B", "VERDICT: B"]).status, "position-dependent");
});

test("usage names the owner's brief and prepare warns when given the spec", () => {
  const usage = spawnSync(process.execPath, [TOOL, "prepare"], { encoding: "utf8" });
  assert.equal(usage.status, 2);
  assert.match(usage.stderr, /--brief is the owner's original brief[\s\S]*never context\/spec\.md/);
  const dir = mkdtempSync(path.join(tmpdir(), "owner-review-"));
  const spec = path.join(dir, "spec.md");
  writeFileSync(spec, "Acceptance tests: one.");
  for (const n of [1, 2]) writeFileSync(path.join(dir, `d${n}.md`), `Draft ${n}`);
  const run = spawnSync(process.execPath, [TOOL, "prepare", "--brief", spec, path.join(dir, "d1.md"), path.join(dir, "d2.md"), "--out", path.join(dir, "review")], { encoding: "utf8" });
  assert.equal(run.status, 0);
  assert.match(run.stderr, /owner's original brief, not your spec/);
  assert.match(readFileSync(path.join(dir, "review", "sheet-2.md"), "utf8"), /## Draft A\n\nDraft 2/);
});

test("the checker, clarity, voice, lessons and profiles follow the owner", () => {
  const read = (f: string) => readFileSync(path.join(QUALITY, f), "utf8");
  const checker = read("CHECKER-v3.md");
  assert.doesNotMatch(checker, /usefulness 25%/);
  for (const d of ["Fit", "New insight", "Priorities", "Reasoning", "Correct", "Clear", "Voice", "Range", "Ready to use"]) assert.match(checker, new RegExp(`\\| ${d} \\|`), d);
  assert.match(checker, /would rather pay for/);
  for (const f of ["CHECKER-v3.md", "CLARITY.md", "VOICE.md", "PROFILES.md", "profiles.json", "cards/_any.md"]) {
    assert.doesNotMatch(read(f), /To confirm/, `${f} asks for a To confirm box`);
  }
  assert.doesNotMatch(read("lessons-general.md"), /"To confirm" box/);
  assert.match(read("VOICE.md"), /persona's own lines[\s\S]*customer's words[\s\S]*count is the claim[\s\S]*Internal analytics never appear/);
  assert.match(read("CLARITY.md"), /first-screen rule/);
  assert.match(read("PROFILES.md"), /owner's limit wins[\s\S]*Stay within it[\s\S]*never by a word-count aim/);
  for (const f of ["CHECKER-v3.md", "PROFILES.md", "profiles.json", "QUALITY-ENGINE-v3.md"]) assert.doesNotMatch(read(f), /85%/, `${f} keeps the 85% aim`);
  // Round 2 rollback (13 Nov 2026): the round 1 checker and voice rules come back; asks are never dropped to stay safe.
  assert.match(read("CHECKER-v3.md"), /run three checks[\s\S]*\*\*Left for the owner\.\*\*[\s\S]*\*\*Rule over owner\.\*\*/);
  assert.match(read("CLARITY.md"), /Every explicit ask in the brief gets a visible answer[\s\S]*most money per unit of effort comes first/);
  assert.match(read("CLARITY.md"), /deliver every piece the owner asked for; never drop or water one down to stay safe/);
  assert.doesNotMatch(read("CLARITY.md"), /works either way/);
  assert.doesNotMatch(read("VOICE.md"), /it leads the hero or the hook/);
  const profiles = JSON.parse(read("profiles.json")) as Record<string, { aim: number; ceiling: number }>;
  for (const [family, p] of Object.entries(profiles)) {
    assert.ok(p.ceiling <= 1.1, `${family} ceiling ${p.ceiling}`);
    assert.ok(p.aim <= p.ceiling, `${family} aim above its ceiling`);
  }
  const lessons = read("lessons-general.md");
  assert.match(lessons, /\*\*The owner's data first; the playbook as the default/);
  assert.match(lessons, /\*\*Act fully on the signal\.\*\*[\s\S]*?Won:[\s\S]*?Avoid: the half-measure/);
  assert.match(lessons, /\*\*Finish one-shot work: no homework\.\*\*[\s\S]*?Won:[\s\S]*?Avoid:/);
  assert.match(read("cards/_any.md"), /\*\*SHAPE:\*\*.*one labelled bolder move sized in the owner's unit, with its first step and risk, never inside customer copy/);
  // Profiles add no unasked test or measurement plans, and plans run in relative days.
  const shapes = Object.values(JSON.parse(read("profiles.json")) as Record<string, { shape: string }>).map(p => p.shape).join("\n");
  assert.doesNotMatch(shapes, /then a test plan|measurement plan of|owner and date|owners and dates|owner, date|placeholders/);
});
