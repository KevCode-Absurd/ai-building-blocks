// Ask or start (14 Nov 2026): every brief gets a readiness check. A specific brief starts at once; a gap that would
// change the work gets one message of questions first (what good looks like, the brand brain, facts only the owner
// knows). Nobody to ask (a test or an API call): decide and finish. The owner's answers become the rubric.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { TOOL_FILES } from "../src/modules/packs/build.ts";

const load = (rel: string): Promise<any> => import(rel);
const shared = (f: string) => readFileSync(new URL(`../packs/shared/${f}`, import.meta.url), "utf8");

test("the intake rule is a readiness check, not a fixed habit of asking or of assuming", () => {
  const intake = shared("tools/quality/INTAKE.md");
  assert.match(intake, /## The readiness check/);
  assert.match(intake, /\*\*Start\*\* when all six are answered/);
  assert.match(intake, /\*\*Ask\*\* when any gap would change what you make if you guessed wrong/);
  assert.match(intake, /at most five questions/);
  assert.match(intake, /brand-brain\.mjs ask --for <kind>/);
  assert.match(intake, /What good looks like/);
  assert.match(intake, /## When nobody can answer[\s\S]*never ask/);
  assert.match(intake, /When the brief already answered everything, do not stop: start/, "a fully specified brief runs without a Go stop");
  assert.match(shared("AGENTS.md"), /five questions at most, each with a default; when the job needs your tools, one of the five asks the access level/);
  const agents = shared("AGENTS.md");
  assert.match(agents, /\*\*Ask or start\.\*\* Run the readiness check/);
  assert.doesNotMatch(agents, /three questions at most/);
  const method = shared("WORK-METHOD.md");
  assert.match(method, /\*\*Ask or start:\*\* run the readiness check/);
  assert.match(method, /\*\*One-shot jobs\*\* \(nobody can reply: a test or an API call\)/);
  assert.match(method, /make-rubric\.mjs/);
  assert.ok(TOOL_FILES.some(t => t.name === "make-rubric.mjs"), "every pack carries the rubric tool");
});

test("the rubric puts the owner's 'good' first, in their order, and gates fail a scorecard", async () => {
  const r = await load("../packs/shared/tools/make-rubric.mjs");
  const intake = r.readIntake("## Good looks like\n- More repeat orders\n- Sounds like us\n- (hint)\n## Never\n- Discounts over 10%\n## Asks\n- 3 emails\n## Limits\n- you decide\n");
  assert.deepEqual(intake.good, ["More repeat orders", "Sounds like us"]);
  assert.deepEqual(intake.limits, [], "'you decide' and template hints are not rubric lines");
  const w = r.ownerWeights(3);
  assert.equal(w.reduce((a: number, b: number) => a + b, 0), 50);
  assert.ok(w[0] > w[1] && w[1] > w[2], "the first item the owner named weighs most");
  const md = r.rubricMarkdown(intake, { today: "2026-11-14" }).text;
  assert.match(md, /\| G1 \| 33 \| More repeat orders \|/);
  assert.match(md, /## Never \(pass or fail\)[\s\S]*\| N1 \| Discounts over 10% \|/);
  const all = "| G1 | met | email 2 |\n| G2 | met | voice lines |\n| A1 | met | three emails |\n| N1 | met | no discount used |\n" +
    ["Q1", "Q2", "Q3", "Q4"].map(id => `| ${id} | met | checked |`).join("\n") + "\n" + ["C1", "C2", "C3"].map(id => `| ${id} | partly | body |`).join("\n");
  assert.equal(r.checkScorecard(md, all).ok, true);
  const failed = r.checkScorecard(md, all.replace("| N1 | met | no discount used |", "| N1 | not met | |"));
  assert.deepEqual(failed.failedGates, ["N1"]);
  const none = r.rubricMarkdown(r.readIntake("## Asks\n- one page\n")).text;
  assert.match(none, /craft carries all 100 points/);
  assert.match(none, /\| C1 \| 60 \|/);
  assert.ok(!r.checkScorecard(none, "").ids.includes("G1"), "the scorecard example row is not a rubric line");
});

test("the brand brain is asked about only when the job needs it and none is saved; an import is kept", async () => {
  const bf = await load("../../catalogue-items/general/brand-dna-capture/scripts/brand-file.mjs");
  const ctx = path.join(mkdtempSync(path.join(tmpdir(), "bb-")), "context");
  const now = new Date("2026-11-14T12:00:00Z");
  const first = bf.askText(ctx, { now, kind: "email" });
  assert.equal(first.ask, true);
  assert.match(first.text, /Do you have a brand brain \(a brand file, guide or folder\) I should use\?/);
  assert.match(first.text, /b\) No: send your store URL and I will build one now and keep it for every later job/);
  assert.equal(bf.askText(ctx, { now, kind: "analysis" }).ask, false, "an analysis job needs no brand brain");
  const guide = path.join(path.dirname(ctx), "guide.md");
  writeFileSync(guide, "# Our brand\nVoice: warm and plain.\n");
  const r = bf.importBrand(ctx, guide, { now });
  assert.deepEqual(r.done, ["imported/guide.md"]);
  assert.ok(existsSync(path.join(ctx, "brand-file", "imported", "guide.md")));
  assert.match(readFileSync(path.join(ctx, "brand-file", "history", "changes.md"), "utf8"), /2026-11-14: imported from the client/);
  const later = bf.askText(ctx, { now, kind: "email" });
  assert.equal(later.ask, false, "a saved brand brain is never asked about again");
  assert.match(later.text, /Do not ask whether they have one/);
  assert.throws(() => bf.importBrand(ctx, "https://example.com/brand", { now }), /opens no network connection/);
  const folder = path.join(path.dirname(ctx), "theirs", "brand-file");
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, "voice.md"), "# Voice\n\n## Brand lines\n- \"Sleep cool.\" (site, 2026-11-01)\n");
  assert.deepEqual(bf.importBrand(ctx, path.dirname(folder), { now }).done, ["voice.md"], "a brand-file folder is taken in whole");
});
