#!/usr/bin/env node
// Can we trust the judges? Compares each Claude judge with the owner's own labels from review.mjs.
//
//   node scripts/agreement.mjs --round R1 [--rounds-dir <dir>] [--split dev|test|train|all] [--labels <file,...>]
//        [--boot 2000] [--seed 11]
//
// For each grade, a judge "passes" an answer when it scores it at or above the pass line (7). For each grade:
//   catch rate  of the answers the owner failed, the share the judge also failed (it catches real problems)
//   pass rate   of the answers the owner passed, the share the judge also passed (it does not fail good work)
// Both should reach 0.85 to 0.9. Raw agreement is not reported on its own: it looks good whenever one class is rare.
// The same two rates are given for "would you act on this today" (judge vs owner) and for the checker's run pass
// (checker vs the owner's "act today", as a rough check on the job-check key).
//
// Corrected pass rate: the round's observed judge pass rate for a grade, corrected for judge error with the two
// rates (Rogan-Gladen: (observed + catch - 1) / (pass + catch - 1), kept between 0 and 1). The 95% interval comes
// from a bootstrap that resamples both the labels and the round's runs.
//
// Use --split dev while tuning a judge sheet. Run --split test once, after tuning, and never tune on it.
// Writes rounds/<R>/AGREEMENT.md and rounds/<R>/agreement.json.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROUNDS, GRADES, PASS_LINE, args, list, readJson, r2, pct, rng, writeFile, latestLabels } from "./lib.mjs";

const A = args();
if (!A.round) { console.error("usage: agreement.mjs --round <name> [--split dev|test|train|all]"); process.exit(2); }
const RD = path.join(A["rounds-dir"] ? path.resolve(A["rounds-dir"]) : ROUNDS, A.round);
const split = A.split ?? "dev";
const BOOT = Number(A.boot ?? 2000);
const rand = rng(Number(A.seed ?? 11));
const TARGET = 0.85;

// Labels: this round's review file plus any extra label files (labels from other rounds point at their own verdicts).
const files = [path.join(RD, "review", "owner-labels.jsonl"), ...list(A.labels).map(f => path.resolve(f))];
const labels = files.flatMap(f => Object.values(latestLabels(f)).map(l => ({ ...l, _dir: path.dirname(path.dirname(f)) })))
  .filter(l => split === "all" || l.split === split);
const verdictIn = (dir, id) => { if (!id) return null; const p = path.join(dir, "verdicts", `${id}.json`); try { return existsSync(p) ? readJson(p) : null; } catch { return null; } };

// Pairs of (owner says pass, judge says pass) per measure.
const pairs = Object.fromEntries([...GRADES, "act_today", "checker"].map(g => [g, []]));
for (const l of labels) {
  const v = verdictIn(l._dir, l.single), c = verdictIn(l._dir, l.checker);
  for (const g of GRADES) {
    const o = l.grades?.[g], j = Number(v?.grades?.[g]);
    if ((o === "pass" || o === "fail") && j > 0) pairs[g].push({ owner: o === "pass", judge: j >= PASS_LINE });
  }
  if (l.act) {
    const ownerAct = l.act !== "no";
    const ja = String(v?.would_act_on_it_today ?? "").toLowerCase();
    if (ja) pairs.act_today.push({ owner: ownerAct, judge: !/^no/.test(ja) });
    if (c?.checks) pairs.checker.push({ owner: ownerAct, judge: c.checks.every(k => String(k.result).toLowerCase() === "pass") && !(c.decoys ?? []).some(d => String(d.result).toLowerCase() === "taken") });
  }
}
const rates = ps => {
  const fails = ps.filter(p => !p.owner), passes = ps.filter(p => p.owner);
  return { n: ps.length, owner_fails: fails.length, owner_passes: passes.length,
    catch: fails.length ? fails.filter(p => !p.judge).length / fails.length : NaN,
    pass: passes.length ? passes.filter(p => p.judge).length / passes.length : NaN };
};

// The round's observed judge pass rate per grade, over every judged run (not just the labelled ones).
const keyFile = path.join(RD, "_key", "blind-key.json");
const observed = Object.fromEntries(GRADES.map(g => [g, []]));
if (existsSync(keyFile)) for (const [id, s] of Object.entries(JSON.parse(readFileSync(keyFile, "utf8")).sheets)) {
  if (s.type !== "single") continue;
  const v = verdictIn(RD, id); if (!v?.grades) continue;
  for (const g of GRADES) { const x = Number(v.grades[g]); if (x > 0) observed[g].push(x >= PASS_LINE); }
}
const corrected = (obs, rt) => { const d = rt.pass + rt.catch - 1; if (!Number.isFinite(d) || d <= 0.05) return NaN; return Math.min(1, Math.max(0, (obs + rt.catch - 1) / d)); };
const pick = a => a[Math.floor(rand() * a.length)];
const quant = (a, q) => a[Math.min(a.length - 1, Math.max(0, Math.floor(q * a.length)))];

const out = { round: A.round, split, pass_line: PASS_LINE, labels: labels.length, target: TARGET, measures: {} };
for (const [g, ps] of Object.entries(pairs)) {
  const rt = rates(ps);
  const rec = { ...rt, catch: r2(rt.catch), pass: r2(rt.pass) };
  const obsList = observed[g];
  if (obsList?.length) {
    const obs = obsList.filter(Boolean).length / obsList.length;
    rec.observed_pass_rate = r2(obs);
    rec.corrected_pass_rate = r2(corrected(obs, rt));
    const boots = [];
    if (ps.length && Number.isFinite(rec.corrected_pass_rate)) for (let b = 0; b < BOOT; b++) {
      const sp = ps.map(() => pick(ps)), so = obsList.map(() => pick(obsList));
      const x = corrected(so.filter(Boolean).length / so.length, rates(sp)); if (Number.isFinite(x)) boots.push(x);
    }
    boots.sort((a, b) => a - b);
    rec.corrected_ci95 = boots.length > BOOT / 2 ? [r2(quant(boots, 0.025)), r2(quant(boots, 0.975))] : null;
  }
  const notes = [];
  if (rt.owner_fails < 30 || rt.owner_passes < 30) notes.push(`few labels (${rt.owner_fails} fails, ${rt.owner_passes} passes; aim for 30 or more of each): the rates are rough`);
  if (Number.isFinite(rt.catch) && rt.catch < TARGET) notes.push("misses too many of the owner's fails");
  if (Number.isFinite(rt.pass) && rt.pass < TARGET) notes.push("fails too much work the owner passed");
  rec.notes = notes;
  out.measures[g] = rec;
}
writeFile(path.join(RD, "agreement.json"), JSON.stringify(out, null, 1));

const f = x => (x == null || !Number.isFinite(x) ? "n/a" : pct(x));
const L = [`# Judge agreement with the owner, round ${A.round} (${split} split)`, "",
  `${labels.length} owner labels. A judge passes a grade at ${PASS_LINE} or more. Target: catch rate and pass rate both ${TARGET} or more.`, "",
  "| Measure | Labels | Owner fails | Owner passes | Catch rate | Pass rate | Observed pass | Corrected pass (95%) | Notes |", "|---|---|---|---|---|---|---|---|---|"];
for (const [g, m] of Object.entries(out.measures)) L.push(`| ${g} | ${m.n} | ${m.owner_fails} | ${m.owner_passes} | ${f(m.catch)} | ${f(m.pass)} | ${f(m.observed_pass_rate)} | ${f(m.corrected_pass_rate)}${m.corrected_ci95 ? ` (${f(m.corrected_ci95[0])} to ${f(m.corrected_ci95[1])})` : ""} | ${m.notes.join("; ")} |`);
L.push("", "Read the disagreements before changing a judge sheet: missing context, a loose grade definition or a mislabel are the usual causes. Change one thing, re-run the dev split, and run the test split once at the end.");
writeFile(path.join(RD, "AGREEMENT.md"), L.join("\n") + "\n");
console.log(L.join("\n"));
