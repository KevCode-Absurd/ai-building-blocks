// Honest checks (CS329Z W3, 15 Nov 2026): a check the writer can pass on its own word is not a check.
// make-rubric fails "partly" and unexplained "n/a" gates, prints the weighted score and labels SAME-CONTEXT;
// qe-check fails a required check that did not run; blind-review puts every draft in every position, parses the
// verdict exactly, hides word counts and flags halo scoring.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/** Plain-JS pack tools have no type declarations: load them untyped. */
const load = (rel: string): Promise<any> => import(rel);
const TOOLS = fileURLToPath(new URL("../packs/shared/tools/", import.meta.url));
const env = { ...process.env };
delete env.AIB_JOB_LOG;
const run = (cwd: string, tool: string, ...args: string[]) => spawnSync(process.execPath, [path.join(TOOLS, tool), ...args], { encoding: "utf8", cwd, env });
const workdir = (withContext = true) => {
  const dir = mkdtempSync(path.join(tmpdir(), "honest-"));
  if (withContext) mkdirSync(path.join(dir, "context"));
  return dir;
};
const logLines = (dir: string) => existsSync(path.join(dir, "context", "job-log.jsonl"))
  ? readFileSync(path.join(dir, "context", "job-log.jsonl"), "utf8").trim().split("\n").map(l => JSON.parse(l)) : [];

// ---------- make-rubric ----------
const INTAKE = "## Good looks like\n- More repeat orders\n- Sounds like us\n## Never\n- Discounts over 10%\n## Asks\n- 3 emails\n## Limits\n- Each email under 150 words\n";
const card = (over: Record<string, string> = {}) => {
  const rows: Record<string, string> = {
    G1: "met | email 2", G2: "met | voice lines", A1: "met | three emails", N1: "met | no discount used", L1: "met | 120, 130, 140 words",
    Q1: "met | every price from the brief", Q2: "met | all three emails", Q3: "met | subject, preview, body", Q4: "met | none left",
    C1: "met | email 1 opening", C2: "met | the refill data", C3: "met | short", ...over,
  };
  return Object.entries(rows).map(([id, v]) => `| ${id} | ${v} |`).join("\n");
};

test("make-rubric: a scorecard with every gate marked partly fails", async () => {
  const r = await load("../packs/shared/tools/make-rubric.mjs");
  const md = r.rubricMarkdown(r.readIntake(INTAKE), { today: "2026-11-15" }).text;
  assert.equal(r.checkScorecard(md, card()).ok, true);
  const partly = card(Object.fromEntries(["A1", "N1", "L1", "Q1", "Q2", "Q3", "Q4"].map(id => [id, "partly | most of it"])));
  const res = r.checkScorecard(md, partly);
  assert.equal(res.ok, false);
  assert.deepEqual(res.failedGates, ["A1", "N1", "L1", "Q1", "Q2", "Q3", "Q4"]);
  assert.match(res.reasons.Q4, /partly/);
});

test("make-rubric: n/a needs a reason; a heavy scored line marked not met fails; the weighted score is printed", async () => {
  const r = await load("../packs/shared/tools/make-rubric.mjs");
  const md = r.rubricMarkdown(r.readIntake(INTAKE), { today: "2026-11-15" }).text;
  const bare = r.checkScorecard(md, card({ L1: "n/a | " }));
  assert.equal(bare.ok, false);
  assert.match(bare.problems.join("\n"), /L1: n\/a with no reason/);
  assert.equal(r.checkScorecard(md, card({ L1: "n/a | the owner set no length for these" })).ok, true);
  // G1 is worth 33 of 100: not met fails. C3 is worth 10: not met counts against the score but does not fail.
  const g1 = r.checkScorecard(md, card({ G1: "not met | " }));
  assert.equal(g1.ok, false);
  assert.deepEqual(g1.failedLines, ["G1"]);
  const c3 = r.checkScorecard(md, card({ C3: "not met | " }));
  assert.equal(c3.ok, true);
  assert.equal(c3.score, 90);
  assert.equal(r.checkScorecard(md, card({ C1: "partly | email 1" })).score, 85);
  assert.equal(r.checkScorecard(md, card()).score, 100);
});

test("make-rubric: SAME-CONTEXT unless a fresh reader scored it; a met gate the last qe-check failed is a fail", async () => {
  const r = await load("../packs/shared/tools/make-rubric.mjs");
  const md = r.rubricMarkdown(r.readIntake(INTAKE), { today: "2026-11-15" }).text;
  assert.equal(r.checkScorecard(md, card()).sameContext, true);
  assert.equal(r.checkScorecard(md, `Scored by: a fresh reviewer in a new chat\n${card()}`).sameContext, false);
  assert.equal(r.checkScorecard(md, `Scored by: me, the maker\n${card()}`).sameContext, true);
  assert.equal(r.checkScorecard(md, card(), { by: "fresh" }).sameContext, false);
  const qe = [{ name: "leakcheck", status: "FAIL" }, { name: "limit", status: "FAIL" }, { name: "proof", status: "PASS" }];
  const res = r.checkScorecard(md, card(), { qe });
  assert.equal(res.ok, false);
  assert.deepEqual(res.failedGates.sort(), ["L1", "Q4"]);
  assert.match(res.reasons.Q4, /qe-check leakcheck failed/);

  // From the command line: the label, the score line and one job-log line.
  const dir = workdir();
  writeFileSync(path.join(dir, "context", "intake.md"), INTAKE);
  assert.equal(run(dir, "make-rubric.mjs").status, 0);
  writeFileSync(path.join(dir, "card.md"), card());
  const ok = run(dir, "make-rubric.mjs", "check", "card.md");
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.match(ok.stdout, /Weighted score: 100 of 100/);
  assert.match(ok.stdout, /Result: PASS \(SAME-CONTEXT\)/);
  const lines = logLines(dir);
  assert.deepEqual(lines.map(l => `${l.tool} ${l.cmd} ${l.result}`), ["make-rubric build PASS", "make-rubric check PASS"]);
  assert.equal(lines[1].counts.same_context, true);
  assert.doesNotMatch(JSON.stringify(lines), /repeat orders|voice lines/, "the log keeps hashes, not the owner's text");
});

// ---------- qe-check ----------
const QE = "quality/qe-check.cjs";

test("qe-check: buyer-facing work without the numbers ledger or a format contract fails", () => {
  const dir = workdir();
  writeFileSync(path.join(dir, "ad.md"), "# Ad\n\n**Primary text:** Soap that lasts. Made by hand in small batches.\n\n**Headline:** Small-batch soap\n");
  const r = run(dir, QE, "ad.md", "--profile", "paid-social-ads");
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /FAIL\s+numbers \(required\)\n\s+required for paid-social-ads, but not run: no context[\\/]numbers\.json/);
  assert.match(r.stdout, /FAIL\s+format \(required\)/);
  writeFileSync(path.join(dir, "context", "numbers.json"), "[]");
  const ok = run(dir, QE, "ad.md", "--profile", "paid-social-ads", "--max-words", "80");
  assert.equal(ok.status, 0, ok.stdout);
  // Without a family nothing extra is required, so the old behaviour holds.
  const loose = workdir();
  writeFileSync(path.join(loose, "ad.md"), "# Ad\n\nSoap that lasts.\n");
  assert.equal(run(loose, QE, "ad.md").status, 0);
});

test("qe-check: --require adds checks, the job's kind sets the family, and --json reports the same result", () => {
  const dir = workdir();
  writeFileSync(path.join(dir, "memo.md"), "# Memo\n\nKeep the bundle at its current price.\n");
  const req = run(dir, QE, "memo.md", "--require", "trace");
  assert.equal(req.status, 1, req.stdout);
  assert.match(req.stdout, /FAIL\s+trace \(required\)\n\s+required by --require, but not run/);
  assert.equal(run(dir, QE, "memo.md", "--require", "nonsense").status, 2);
  writeFileSync(path.join(dir, "context", "job.json"), JSON.stringify({ id: "j1", kind: "analysis-memo" }));
  const fromJob = run(dir, QE, "memo.md", "--json");
  assert.equal(fromJob.status, 1);
  const report = JSON.parse(fromJob.stdout);
  assert.equal(report.family, "analysis-memo");
  assert.deepEqual(report.required, ["leakcheck", "proof", "numbers"]);
  assert.deepEqual(report.failed, ["numbers"]);
  assert.equal(report.rows.find((r: { name: string }) => r.name === "numbers").not_run, true);
  const lines = logLines(dir);
  assert.equal(lines.length, 2, "one log line per qe-check run");
  assert.equal(lines[1].job, "j1");
  assert.equal(lines[1].result, "FAIL");
  assert.ok(lines[1].checks.some((c: { name: string; status: string; required?: boolean }) => c.name === "numbers" && c.status === "FAIL" && c.required));
});

test("profiles: every family names its required checks, and buyer-facing families require the ledger and format", () => {
  const profiles = JSON.parse(readFileSync(path.join(TOOLS, "quality", "profiles.json"), "utf8")) as Record<string, { required: string[]; buyer_facing: boolean }>;
  for (const [family, p] of Object.entries(profiles)) {
    assert.ok(Array.isArray(p.required) && p.required.includes("leakcheck") && p.required.includes("proof"), family);
    assert.equal(typeof p.buyer_facing, "boolean", family);
    if (p.buyer_facing) for (const c of ["numbers", "format"]) assert.ok(p.required.includes(c), `${family} requires ${c}`);
  }
  for (const f of ["paid-social-ads", "landing-page", "lifecycle-email", "product-description"]) assert.equal(profiles[f].buyer_facing, true, f);
});

// ---------- blind-review ----------
test("blind-review: with 2, 3 and 4 drafts every draft sits in every position once", async () => {
  const { sheetOrders } = await load("../packs/shared/tools/blind-review.mjs");
  for (const n of [2, 3, 4]) {
    const orders: number[][] = sheetOrders(n);
    assert.equal(orders.length, n);
    for (const order of orders) assert.deepEqual([...order].sort(), [...Array(n).keys()]);
    for (let pos = 0; pos < n; pos++) assert.deepEqual(orders.map(o => o[pos]).sort(), [...Array(n).keys()], `position ${pos} with ${n} drafts`);
  }
  // 4 drafts: each draft also comes straight after each other draft once.
  const pairs = new Set(sheetOrders(4).flatMap((o: number[]) => o.slice(1).map((d, i) => `${o[i]}>${d}`)));
  assert.equal(pairs.size, 12);

  const dir = workdir();
  writeFileSync(path.join(dir, "brief.md"), "# Brief\n\nThree welcome emails.\n");
  for (const n of [1, 2, 3]) writeFileSync(path.join(dir, `d${n}.md`), `Draft number ${n} ${"word ".repeat(n * 10)}`);
  const prep = run(dir, "blind-review.mjs", "prepare", "--brief", "brief.md", "d1.md", "d2.md", "d3.md");
  assert.equal(prep.status, 0, prep.stderr);
  const key = JSON.parse(readFileSync(path.join(dir, "review", "key.json"), "utf8"));
  assert.equal(key.sheets.length, 3);
  for (let pos = 0; pos < 3; pos++) assert.deepEqual(key.sheets.map((s: string[]) => s[pos]).sort(), ["d1.md", "d2.md", "d3.md"]);
  assert.deepEqual(key.lengths, { "d1.md": 13, "d2.md": 23, "d3.md": 33 }, "word counts live in key.json");
  for (let s = 1; s <= 3; s++) {
    const text = readFileSync(path.join(dir, "review", `sheet-${s}.md`), "utf8");
    assert.doesNotMatch(text, /\(\d+ words\)/, "no word counts on the sheet");
    assert.match(text, /VERDICT: A or B or C or TIE/);
    assert.match(text, /\| Draft \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \|/);
  }
});

test("blind-review: the verdict parse is exact; 'a tie' is TIE, never draft A", async () => {
  const { verdictOf } = await load("../packs/shared/tools/blind-review.mjs");
  assert.equal(verdictOf("VERDICT: a tie"), "TIE");
  assert.equal(verdictOf("**VERDICT:** It's a tie"), "TIE");
  assert.equal(verdictOf("VERDICT: TIE"), "TIE");
  assert.equal(verdictOf("VERDICT: A"), "A");
  assert.equal(verdictOf("**VERDICT:** b"), "B");
  assert.equal(verdictOf("VERDICT: Draft C."), "C");
  assert.equal(verdictOf("VERDICT: B, because the numbers trace"), "B");
  assert.equal(verdictOf("VERDICT: A or B"), null, "two letters name no single draft");
  assert.equal(verdictOf("VERDICT: Absolutely the second one"), null);
  assert.equal(verdictOf("VERDICT: E"), null);
  assert.equal(verdictOf("no verdict line"), null);
});

test("blind-review: a win needs every order; halo scoring and a length win are flagged", async () => {
  const { tally } = await load("../packs/shared/tools/blind-review.mjs");
  const key = { sheets: [["x.md", "y.md", "z.md"], ["y.md", "z.md", "x.md"], ["z.md", "x.md", "y.md"]], lengths: { "x.md": 300, "y.md": 100, "z.md": 120 } };
  const all = tally(key, ["VERDICT: A", "VERDICT: C", "VERDICT: B"]);
  assert.equal(all.status, "consistent");
  assert.equal(all.winner, "x.md");
  assert.match(all.length_warning, /150% longer/, "lengths come from key.json when no texts are given");
  const two = tally(key, ["VERDICT: A", "VERDICT: C", "VERDICT: A"]);
  assert.equal(two.status, "position-dependent");
  assert.equal(two.winner, null);
  assert.deepEqual(two.leaning, { file: "x.md", sheets: 2 });
  assert.equal(tally(key, ["VERDICT: TIE", "VERDICT: a tie", "VERDICT: TIE"]).status, "tie");
  assert.equal(tally(key, ["VERDICT: A", "VERDICT: C"]).status, "incomplete", "a missing third answer");
  const scored = "| Draft | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |\n|---|---|---|---|---|---|---|---|---|---|\n| A | 8 | 8 | 9 | 8 | 8 | 9 | 8 | 8 | 9 |\n| B | 6 | 4 | 7 | 5 | 8 | 7 | 6 | 3 | 5 |\n| C | 7 | 6 | 5 | 8 | 4 | 6 | 7 | 5 | 6 |\nVERDICT: A";
  const halo = tally(key, [scored, "VERDICT: C", "VERDICT: B"]);
  assert.deepEqual(halo.halo, [{ sheet: 1, file: "x.md", low: 8, high: 9 }]);
  assert.match(halo.halo_warning, /sheet 1 scored x\.md 8 to 9 on every question/);
  assert.equal(halo.scores["x.md"], 8.3);
});
