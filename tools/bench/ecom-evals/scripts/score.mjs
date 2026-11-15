#!/usr/bin/env node
// Scores a round: reads the judge verdicts and checker results, unblinds them, and prints per task, per area and
// per arm: owner grades, win rate with job-level 95% intervals, pass^3, worst-of-3, spread, the knowledge lift,
// length and cost. Offline.
//
//   node scripts/score.mjs --round R1 [--rounds-dir <dir>] [--boot 2000] [--seed 7]
//
// Writes rounds/<R>/score.json and rounds/<R>/SCORE.md, and rounds/<R>/tune-reasons.md (judge and checker
// reasons for TUNE tasks only, for the improvement loop). Held-out tasks are reported as numbers only.
// Also reported: the share of runs at or above the pass line per grade, how often each yes/no sub-check is "yes",
// the must-pass gate (nothing invented, no claim the brand cannot make, no decoy taken), the free code checks from
// asserts.mjs, the checker's first-failure counts, which judge models ran, and task flags (always passed: graduate
// it; never passed: check its key).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROUNDS, GRADES, IMAGE_GRADES, SUBCHECKS, MUST_PASS, PASS_LINE, args, loadTasks, ownerScore, readJson, mean, r2, pct, rng, writeFile, yn } from "./lib.mjs";

const A = args();
if (!A.round) { console.error("usage: score.mjs --round <name>"); process.exit(2); }
const RD = path.join(A["rounds-dir"] ? path.resolve(A["rounds-dir"]) : ROUNDS, A.round);
const keyFile = path.join(RD, "_key", "blind-key.json");
if (!existsSync(keyFile)) { console.error(`no ${keyFile}; run make-sheets.mjs sheets first`); process.exit(2); }
const KEY = JSON.parse(readFileSync(keyFile, "utf8")).sheets;
const VD = path.join(RD, "verdicts");
const tasks = Object.fromEntries(loadTasks().map(t => [t.id, t]));
const BOOT = Number(A.boot ?? 2000);

const verdict = id => { const p = path.join(VD, `${id}.json`); if (!existsSync(p)) return null; try { return readJson(p); } catch (e) { console.warn(`bad verdict ${id}: ${e.message}`); return null; } };
const runs = {};          // task|arm|run -> {grades, owner, check}
const R = (t, a, k) => (runs[`${t}|${a}|${k}`] ??= { task: t, arm: a, run: k });
const missing = { single: 0, checker: 0, pairwise: 0 };
const pairs = {};         // pair -> task -> list of outcomes ("x", "y", "tie")
const lengthDuels = { decided: 0, longerWon: 0 };
const reasons = [];
const judgeModels = {};
const firstFailures = {}; // arm -> kind -> count

for (const [id, s] of Object.entries(KEY)) {
  const v = verdict(id);
  if (s.type === "single") {
    if (!v?.grades) { missing.single++; continue; }
    const r = R(s.task, s.arm, s.run); r.grades = v.grades; r.owner = ownerScore(v.grades); r.words = s.words;
    r.unbacked = (v.unbacked_claims ?? []).length;
    r.sub = {}; for (const g of GRADES) for (const c of SUBCHECKS[g]) { const a = yn(v.subchecks?.[g]?.[c]); if (a) r.sub[c] = a; }
    r.act = String(v.would_act_on_it_today ?? "").toLowerCase();
    if (v.judge_model) judgeModels[v.judge_model] = (judgeModels[v.judge_model] ?? 0) + 1;
    if (tasks[s.task]?.split === "tune") reasons.push({ task: s.task, arm: s.arm, run: s.run, kind: "judge", critique: v.critique ?? v.reasons, subchecks_no: Object.entries(r.sub).filter(([, a]) => a === "no").map(([c]) => c), unbacked: v.unbacked_claims });
  } else if (s.type === "checker") {
    if (!v?.checks) { missing.checker++; continue; }
    const r = R(s.task, s.arm, s.run);
    const checks = v.checks.map(c => String(c.result).toLowerCase());
    const decoysTaken = (v.decoys ?? []).filter(d => String(d.result).toLowerCase() === "taken").length;
    const falseSig = (v.false_signals ?? []).filter(x => String(x).trim()).length;
    const sig = (v.signals ?? []).map(x => String(x.result).toLowerCase());
    r.check = { pass: checks.length > 0 && checks.every(c => c === "pass") && decoysTaken === 0 && falseSig === 0,
      checkPassRate: checks.filter(c => c === "pass").length / Math.max(1, checks.length),
      signalsActed: sig.filter(x => x === "acted").length, signals: tasks[s.task]?.signal_count ?? sig.length, decoysTaken, falseSig };
    const ff = String(v.first_failure ?? "").toLowerCase().trim();
    if (ff && ff !== "none") { const m = (firstFailures[s.arm] ??= {}); m[ff] = (m[ff] ?? 0) + 1; }
    if (tasks[s.task]?.split === "tune") reasons.push({ task: s.task, arm: s.arm, run: s.run, kind: "checker", fails: v.checks.filter(c => String(c.result).toLowerCase() !== "pass"), decoys: v.decoys, false_signals: v.false_signals });
  } else if (s.type === "pairwise") {
    if (id > s.twin) continue; // handle each twin pair once
    const v2 = verdict(s.twin), s2 = KEY[s.twin];
    if (!v?.winner || !v2?.winner) { missing.pairwise++; continue; }
    const armOf = (sheet, w) => (/^a$/i.test(String(w).trim()) ? sheet.A : /^b$/i.test(String(w).trim()) ? sheet.B : "tie");
    const w1 = armOf(s, v.winner), w2 = armOf(s2, v2.winner);
    const [x, y] = s.pair.split(":");
    const out = w1 === w2 && w1 !== "tie" ? (w1 === x ? "x" : "y") : "tie";
    ((pairs[s.pair] ??= {})[s.task] ??= []).push({ run: s.run, out });
    if (out !== "tie") { lengthDuels.decided++; const wa = out === "x" ? x : y, la = out === "x" ? y : x; if (s.words[wa] > s.words[la]) lengthDuels.longerWon++; }
    if (tasks[s.task]?.split === "tune") reasons.push({ task: s.task, pair: s.pair, run: s.run, kind: "pairwise", outcome: out === "x" ? x : out === "y" ? y : "tie", reasons: [v.reason, v2.reason] });
  }
}

// ---------------------------------------------------------------- code checks (asserts.mjs) from run meta
const runsDir = path.join(RD, "runs");
for (const r of Object.values(runs)) {
  const m = path.join(runsDir, r.task, r.arm, r.run, "meta.json");
  if (existsSync(m)) { const a = JSON.parse(readFileSync(m, "utf8")).asserts; if (a) r.asserts = a; }
}
// must-pass gate per run: nothing invented, no claim the brand cannot make (judge), no decoy taken (checker)
for (const r of Object.values(runs)) {
  if (!r.grades && !r.check) continue;
  r.mustPass = MUST_PASS.every(c => r.sub?.[c] !== "no") && !(r.check && r.check.decoysTaken > 0);
}

// ---------------------------------------------------------------- per task x arm
const cells = {};
for (const r of Object.values(runs)) (cells[`${r.task}|${r.arm}`] ??= []).push(r);
const taskArm = Object.entries(cells).map(([k, rs]) => {
  const [task, arm] = k.split("|"), t = tasks[task];
  const owners = rs.map(r => r.owner).filter(Number.isFinite);
  const checked = rs.filter(r => r.check);
  const g = Object.fromEntries(GRADES.map(x => [x, r2(mean(rs.map(r => Number(r.grades?.[x])).filter(n => n > 0)))]));
  return { task, arm, split: t?.split, area: t?.area, runs: rs.length,
    owner_mean: r2(mean(owners)), owner_worst: owners.length ? r2(Math.min(...owners)) : null, spread: owners.length ? r2(Math.max(...owners) - Math.min(...owners)) : null,
    grades: g, checked_runs: checked.length,
    pass3: checked.length >= 3 ? checked.every(r => r.check.pass) : null,
    pass_rate: checked.length ? r2(mean(checked.map(r => (r.check.pass ? 1 : 0)))) : null,
    check_pass_rate: checked.length ? r2(mean(checked.map(r => r.check.checkPassRate))) : null,
    signal_recall: checked.length && t?.signal_count ? r2(mean(checked.map(r => r.check.signalsActed / t.signal_count))) : null,
    decoys_taken: checked.reduce((a, r) => a + r.check.decoysTaken, 0), false_signals: checked.reduce((a, r) => a + r.check.falseSig, 0),
    must_pass_rate: r2(mean(rs.filter(r => r.mustPass !== undefined).map(r => (r.mustPass ? 1 : 0)))),
    pass_line: Object.fromEntries(GRADES.map(x => { const v = rs.map(r => Number(r.grades?.[x])).filter(n => n > 0); return [x, v.length ? r2(v.filter(n => n >= PASS_LINE).length / v.length) : null]; })),
    sub_yes: Object.fromEntries(Object.values(SUBCHECKS).flat().map(c => { const v = rs.map(r => r.sub?.[c]).filter(a => a === "yes" || a === "no"); return [c, v.length ? r2(v.filter(a => a === "yes").length / v.length) : null]; })),
    asserts_pass_rate: r2(mean(rs.filter(r => r.asserts).map(r => (r.asserts.pass_all ? 1 : 0)))),
    asserts_fails: rs.flatMap(r => Object.entries(r.asserts?.checks ?? {}).filter(([, c]) => !c.pass).map(([k]) => k)),
    words: r2(mean(rs.map(r => r.words).filter(Boolean))) };
}).sort((a, b) => (a.task + a.arm).localeCompare(b.task + b.arm));

function rollup(filter) {
  const rows = taskArm.filter(filter), byArm = {};
  for (const r of rows) (byArm[r.arm] ??= []).push(r);
  return Object.fromEntries(Object.entries(byArm).map(([arm, rs]) => {
    const p3 = rs.filter(r => r.pass3 !== null);
    return [arm, { tasks: rs.length, owner_mean: r2(mean(rs.map(r => r.owner_mean).filter(Number.isFinite))), owner_worst_mean: r2(mean(rs.map(r => r.owner_worst).filter(Number.isFinite))),
      spread_mean: r2(mean(rs.map(r => r.spread).filter(Number.isFinite))), pass3: p3.length ? r2(p3.filter(r => r.pass3).length / p3.length) : null, pass3_tasks: p3.length,
      pass_rate: r2(mean(rs.map(r => r.pass_rate).filter(Number.isFinite))), signal_recall: r2(mean(rs.map(r => r.signal_recall).filter(Number.isFinite))),
      decoys_taken: rs.reduce((a, r) => a + r.decoys_taken, 0), false_signals: rs.reduce((a, r) => a + r.false_signals, 0),
      grades: Object.fromEntries(GRADES.map(g => [g, r2(mean(rs.map(r => r.grades[g]).filter(Number.isFinite)))])),
      must_pass_rate: r2(mean(rs.map(r => r.must_pass_rate).filter(Number.isFinite))),
      asserts_pass_rate: r2(mean(rs.map(r => r.asserts_pass_rate).filter(Number.isFinite))),
      pass_line: Object.fromEntries(GRADES.map(g => [g, r2(mean(rs.map(r => r.pass_line[g]).filter(Number.isFinite)))])),
      sub_yes: Object.fromEntries(Object.values(SUBCHECKS).flat().map(c => [c, r2(mean(rs.map(r => r.sub_yes[c]).filter(Number.isFinite)))])) }];
  }));
}

// ---------------------------------------------------------------- task flags: saturated or possibly broken
const flags = [];
for (const id of Object.keys(tasks)) {
  const rs = Object.values(runs).filter(r => r.task === id && r.check);
  if (rs.length >= 6 && rs.every(r => r.check.pass)) flags.push({ task: id, split: tasks[id].split, flag: "always passed", note: "every arm passed every run: graduate it to the regression set and add a harder task" });
  if (rs.length >= 6 && rs.every(r => !r.check.pass)) flags.push({ task: id, split: tasks[id].split, flag: "never passed", note: "no arm passed any run: check the key, the checks and the fixtures before blaming the arms" });
}

// ---------------------------------------------------------------- win rates, job-level bootstrap
const rand = rng(Number(A.seed ?? 7));
function winStats(byTask, filter) {
  const ids = Object.keys(byTask).filter(id => filter(tasks[id]));
  const count = list => { let x = 0, y = 0, t = 0; for (const o of list) o.out === "x" ? x++ : o.out === "y" ? y++ : t++; return { x, y, t }; };
  const all = count(ids.flatMap(id => byTask[id]));
  const share = c => (c.x + c.y ? c.x / (c.x + c.y) : NaN);
  const boots = [];
  if (ids.length) for (let b = 0; b < BOOT; b++) {
    const sample = [];
    for (let i = 0; i < ids.length; i++) { const list = byTask[ids[Math.floor(rand() * ids.length)]]; for (let j = 0; j < list.length; j++) sample.push(list[Math.floor(rand() * list.length)]); }
    const s = share(count(sample)); if (Number.isFinite(s)) boots.push(s);
  }
  boots.sort((a, b) => a - b);
  return { tasks: ids.length, wins: all.x, losses: all.y, ties: all.t, share: r2(share(all)), ci95: boots.length ? [r2(boots[Math.floor(0.025 * boots.length)]), r2(boots[Math.floor(0.975 * boots.length) - 1])] : null };
}
const wins = {};
for (const [pair, byTask] of Object.entries(pairs)) wins[pair] = {
  all: winStats(byTask, () => true), tune: winStats(byTask, t => t?.split === "tune"), heldout: winStats(byTask, t => t?.split === "heldout"),
  by_task: Object.fromEntries(Object.entries(byTask).map(([id, l]) => [id, l.map(o => o.out).join("")])),
};

// ---------------------------------------------------------------- knowledge lift (grades 2 and 4, plus 7)
const lift = [];
for (const id of Object.keys(tasks)) {
  const plain = taskArm.find(r => r.task === id && r.arm === "plain"); if (!plain) continue;
  for (const arm of ["chat", "code"]) {
    const a = taskArm.find(r => r.task === id && r.arm === arm); if (!a) continue;
    const d = g => (Number.isFinite(a.grades[g]) && Number.isFinite(plain.grades[g]) ? r2(a.grades[g] - plain.grades[g]) : null);
    lift.push({ task: id, split: tasks[id].split, area: tasks[id].area, arm, principles: d("principles"), backed: d("backed"), insight: d("insight"), owner: Number.isFinite(a.owner_mean) && Number.isFinite(plain.owner_mean) ? r2(a.owner_mean - plain.owner_mean) : null });
  }
}

// ---------------------------------------------------------------- cost and mode from run meta
const cost = {};
const rdir = path.join(RD, "runs");
if (existsSync(rdir)) for (const t of readdirSync(rdir)) for (const arm of readdirSync(path.join(rdir, t))) for (const k of readdirSync(path.join(rdir, t, arm))) {
  const m = path.join(rdir, t, arm, k, "meta.json"); if (!existsSync(m)) continue;
  const j = JSON.parse(readFileSync(m, "utf8")), c = (cost[arm] ??= { runs: 0, with_usage: 0, input_tokens: 0, output_tokens: 0, cost_usd: 0, modes: {} });
  c.runs++; if (j.chat_mode) c.modes[j.chat_mode] = (c.modes[j.chat_mode] ?? 0) + 1;
  if (j.usage) { c.with_usage++; c.input_tokens += (j.usage.input_tokens ?? 0) + (j.usage.cache_read_input_tokens ?? 0) + (j.usage.cache_creation_input_tokens ?? 0); c.output_tokens += j.usage.output_tokens ?? 0; }
  if (Number.isFinite(j.cost_usd)) c.cost_usd += j.cost_usd;
}

// ---------------------------------------------------------------- images
const images = {};
const ikeyFile = path.join(RD, "_key", "image-key.json");
if (existsSync(ikeyFile)) {
  const ik = JSON.parse(readFileSync(ikeyFile, "utf8"));
  for (const sid of Object.keys(ik.sheets)) { const v = verdict(sid); if (!v?.images) continue;
    for (const im of v.images) { const k = ik.images[im.id]; if (!k) continue; const cell = ((images[k.task] ??= {})[k.arm] ??= []); cell.push(im); } }
  for (const t of Object.keys(images)) for (const arm of Object.keys(images[t])) { const l = images[t][arm];
    images[t][arm] = { images: l.length, ...Object.fromEntries(IMAGE_GRADES.map(g => [g, r2(mean(l.map(x => Number(x[g])).filter(n => n > 0)))])) }; }
}

const score = { round: A.round, scored: new Date().toISOString(), missing, by_arm: { all: rollup(() => true), tune: rollup(r => r.split === "tune"), heldout: rollup(r => r.split === "heldout") },
  by_area: Object.fromEntries([...new Set(taskArm.map(r => r.area))].map(a => [a, rollup(r => r.area === a)])),
  wins, knowledge_lift: lift, flags, judge_models: judgeModels, first_failures: firstFailures, pass_line: PASS_LINE, length: { ...lengthDuels, longer_won_share: lengthDuels.decided ? r2(lengthDuels.longerWon / lengthDuels.decided) : null }, cost, images, by_task: taskArm };
writeFile(path.join(RD, "score.json"), JSON.stringify(score, null, 1));

// ---------------------------------------------------------------- report
const L = [`# Round ${A.round}: scores`, "", `Scored ${score.scored}. Missing verdicts: single ${missing.single}, checker ${missing.checker}, pairwise pairs ${missing.pairwise}.`, ""];
for (const split of ["all", "tune", "heldout"]) {
  L.push(`## By arm, ${split}`, "", "| Arm | Tasks | Owner score | Worst of 3 | Spread | pass^3 | Pass rate | Signals acted | Decoys taken | False signals |", "|---|---|---|---|---|---|---|---|---|---|");
  for (const [arm, s] of Object.entries(score.by_arm[split])) L.push(`| ${arm} | ${s.tasks} | ${s.owner_mean ?? "n/a"} | ${s.owner_worst_mean ?? "n/a"} | ${s.spread_mean ?? "n/a"} | ${s.pass3 === null ? "n/a" : pct(s.pass3)} (${s.pass3_tasks}) | ${s.pass_rate === null ? "n/a" : pct(s.pass_rate)} | ${s.signal_recall === null ? "n/a" : pct(s.signal_recall)} | ${s.decoys_taken} | ${s.false_signals} |`);
  L.push("", "| Arm | " + GRADES.join(" | ") + " |", "|---|" + GRADES.map(() => "---").join("|") + "|");
  for (const [arm, s] of Object.entries(score.by_arm[split])) L.push(`| ${arm} | ${GRADES.map(g => s.grades[g] ?? "n/a").join(" | ")} |`);
  L.push("");
}
L.push("## Pass line, must-pass gate and code checks", "", `Share of runs with each grade at ${PASS_LINE} or more (the owner would accept it), the must-pass gate (nothing invented, no claim the brand cannot make, no decoy taken) and the free code checks.`, "");
for (const split of ["all", "tune", "heldout"]) {
  L.push(`### ${split}`, "", "| Arm | Must-pass | Code checks | " + GRADES.join(" | ") + " |", "|---|---|---|" + GRADES.map(() => "---").join("|") + "|");
  for (const [arm, s] of Object.entries(score.by_arm[split])) L.push(`| ${arm} | ${s.must_pass_rate == null ? "n/a" : pct(s.must_pass_rate)} | ${s.asserts_pass_rate == null ? "n/a" : pct(s.asserts_pass_rate)} | ${GRADES.map(g => (s.pass_line[g] == null ? "n/a" : pct(s.pass_line[g]))).join(" | ")} |`);
  L.push("");
}
L.push("### Sub-checks answered yes (all tasks)", "", "| Sub-check | " + Object.keys(score.by_arm.all).join(" | ") + " |", "|---|" + Object.keys(score.by_arm.all).map(() => "---").join("|") + "|");
for (const c of Object.values(SUBCHECKS).flat()) L.push(`| ${c} | ${Object.values(score.by_arm.all).map(s => (s.sub_yes[c] == null ? "n/a" : pct(s.sub_yes[c]))).join(" | ")} |`);
L.push("", "### Where failed runs first went wrong (checker)", "", "| Arm | " + ["read", "diagnose", "decide", "number", "decoy", "deliver"].join(" | ") + " |", "|---|---|---|---|---|---|---|");
for (const [arm, m] of Object.entries(firstFailures)) L.push(`| ${arm} | ${["read", "diagnose", "decide", "number", "decoy", "deliver"].map(k => m[k] ?? 0).join(" | ")} |`);
L.push("", `Judge models seen: ${Object.keys(judgeModels).length ? Object.entries(judgeModels).map(([m, n]) => `${m} (${n})`).join(", ") : "not recorded"}.`, "");
if (flags.length) { L.push("### Task flags", "", "| Task | Split | Flag | What to do |", "|---|---|---|---|"); for (const f of flags) L.push(`| ${f.task} | ${f.split} | ${f.flag} | ${f.note} |`); L.push(""); }
L.push("## Win rate (both orders must agree; ties excluded from the share)", "", "| Pair (first arm's share) | Split | Tasks | Wins | Losses | Ties | Share | 95% interval (tasks resampled) |", "|---|---|---|---|---|---|---|---|");
for (const [pair, w] of Object.entries(wins)) for (const split of ["all", "tune", "heldout"]) { const s = w[split]; L.push(`| ${pair} | ${split} | ${s.tasks} | ${s.wins} | ${s.losses} | ${s.ties} | ${s.share === null ? "n/a" : pct(s.share)} | ${s.ci95 ? `${pct(s.ci95[0])} to ${pct(s.ci95[1])}` : "n/a"} |`); }
L.push("", "## By area (owner score, pass^3)", "", "| Area | Arm | Tasks | Owner score | Worst of 3 | pass^3 |", "|---|---|---|---|---|---|");
for (const [area, arms] of Object.entries(score.by_area)) for (const [arm, s] of Object.entries(arms)) L.push(`| ${area} | ${arm} | ${s.tasks} | ${s.owner_mean ?? "n/a"} | ${s.owner_worst_mean ?? "n/a"} | ${s.pass3 === null ? "n/a" : pct(s.pass3)} |`);
L.push("", "## Knowledge lift: agent minus plain (context-matched), per task", "", "Grade 2 is domain principles, grade 4 is backed by sound sources, grade 7 is unique insight. Positive means the agent beat plain Claude with the same inputs.", "", "| Task | Split | Area | Arm | Principles | Backed | Insight | Owner score |", "|---|---|---|---|---|---|---|---|");
for (const l of lift) L.push(`| ${l.task} | ${l.split} | ${l.area} | ${l.arm} | ${l.principles ?? "n/a"} | ${l.backed ?? "n/a"} | ${l.insight ?? "n/a"} | ${l.owner ?? "n/a"} |`);
L.push("", "## Per task", "", "| Task | Split | Arm | Runs | Owner mean | Worst | Spread | pass^3 | Checks passed | Signals acted | Words |", "|---|---|---|---|---|---|---|---|---|---|---|");
for (const r of taskArm) L.push(`| ${r.task} | ${r.split} | ${r.arm} | ${r.runs} | ${r.owner_mean ?? "n/a"} | ${r.owner_worst ?? "n/a"} | ${r.spread ?? "n/a"} | ${r.pass3 === null ? "n/a" : r.pass3 ? "yes" : "no"} | ${r.check_pass_rate === null ? "n/a" : pct(r.check_pass_rate)} | ${r.signal_recall === null ? "n/a" : pct(r.signal_recall)} | ${r.words ?? "n/a"} |`);
L.push("", "## Length and cost", "", `Decided pairwise outcomes won by the longer answer: ${score.length.longer_won_share === null ? "n/a" : pct(score.length.longer_won_share)} of ${lengthDuels.decided}. Well above 50% means length may be swaying judges.`, "");
L.push("| Arm | Runs | Runs with usage | Input tokens | Output tokens | Cost USD (plan equivalent, as logged) | Chat modes |", "|---|---|---|---|---|---|---|");
for (const [arm, c] of Object.entries(cost)) L.push(`| ${arm} | ${c.runs} | ${c.with_usage} | ${c.input_tokens} | ${c.output_tokens} | ${r2(c.cost_usd)} | ${JSON.stringify(c.modes)} |`);
if (Object.keys(images).length) {
  L.push("", "## Images", "", "| Task | Arm | Images | " + IMAGE_GRADES.join(" | ") + " |", "|---|---|---|" + IMAGE_GRADES.map(() => "---").join("|") + "|");
  for (const [t, arms] of Object.entries(images)) for (const [arm, s] of Object.entries(arms)) L.push(`| ${t} | ${arm} | ${s.images} | ${IMAGE_GRADES.map(g => s[g] ?? "n/a").join(" | ")} |`);
}
writeFile(path.join(RD, "SCORE.md"), L.join("\n") + "\n");
const tr = ["# Tune-set reasons (for the improvement loop; held-out reasons are never written here)", ""];
for (const x of reasons.sort((a, b) => a.task.localeCompare(b.task))) tr.push(`## ${x.task} ${x.kind} ${x.arm ?? x.pair} run ${x.run}`, "", "```json", JSON.stringify(x, null, 1), "```", "");
writeFile(path.join(RD, "tune-reasons.md"), tr.join("\n"));
console.log(L.join("\n"));
