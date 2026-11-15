#!/usr/bin/env node
// Free code checks on every answer, before any judge. They measure and never gate a run out of judging.
// They run on all three arms, so plain Claude is measured the same way.
//
//   node scripts/asserts.mjs <run folder>                         one run (finish-run.mjs calls this)
//   node scripts/asserts.mjs --round R1 [--rounds-dir <dir>]      every run in a round
//
// Hard checks (all must hold for "pass_all"):
//   no_dashes        no em or en dashes (the deliverable rules ban them)
//   no_placeholders  no [X], $X, TBD, XX%, "[insert", lorem ipsum (merge fields and live cart values are fine)
//   no_internal      no card ids (ABC-1234), pack file names or stage labels leaking to the owner
//   must_include     each pattern in the task's "asserts.must_include" appears (key figures the arms never see)
// Advisory (reported, never in pass_all):
//   leakcheck        the pack's own homework and notes check. Advisory because it also flags quoted text, such as
//                    "do not publish" inside a quote of what an AI assistant said
//   readability      the pack's readability check at the business ceiling
//   figures_traced   share of figures in the answer that appear in the inputs (worked figures count as untraced,
//                    so this is a pointer for review, not a fault)
// Results go to <run>/meta.json under "asserts".
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { ROUNDS, REPO, args, loadTasks } from "./lib.mjs";

const QUALITY = path.join(REPO, "marketplace", "packs", "shared", "tools", "quality");
// Merge fields ([name], {{first_name}}) and live values ("you're $X away from free shipping") are real copy, not
// placeholders, so they pass. A placeholder is something the owner would have to fill in before using the work.
export const PLACEHOLDER = /\[(?:x|xx|insert[^\]]*|tbd|todo|fill in[^\]]*)\]|\$X(?!\s+(?:away|from|more|left|to go|for free)\b)\b|\bX{2,}%|\bTBD\b|\bTODO\b|lorem ipsum/i;
const INTERNAL = /\b[A-Z]{2,4}-\d{3,5}\b|\b(?:SKILL|WORK-METHOD|toolkit|toolbox)\.md\b|\bpack\/[\w./-]+|\bknowledge card\b/;

function qe(answer, inputs) {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "asserts-"));
  try {
    // No --brief: its date rule would fail dates the arms took from the inputs, which is right for them to use.
    const argv = [path.join(QUALITY, "qe-check.cjs"), answer, "--audience", "business", "--json", "--context", path.join(tmp, "ctx")];
    if (existsSync(inputs)) argv.push("--sources", inputs);
    const r = spawnSync(process.execPath, argv, { encoding: "utf8", timeout: 60000 });
    try { return JSON.parse(r.stdout); } catch { return null; }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

export function assertRun(dir, task) {
  const answerPath = path.join(dir, "answer.md");
  if (!existsSync(answerPath)) return null;
  const text = readFileSync(answerPath, "utf8");
  const checks = {};
  const dashes = (text.match(/[–—]/g) ?? []).length;
  checks.no_dashes = { pass: dashes === 0, detail: `${dashes} dashes` };
  const ph = text.match(PLACEHOLDER);
  checks.no_placeholders = { pass: !ph, detail: ph ? `found "${ph[0]}"` : "none" };
  const inn = text.match(INTERNAL);
  checks.no_internal = { pass: !inn, detail: inn ? `found "${inn[0]}"` : "none" };
  const must = task?.asserts?.must_include ?? [];
  if (must.length) {
    const miss = must.filter(p => !new RegExp(p, "i").test(text));
    checks.must_include = { pass: miss.length === 0, detail: miss.length ? `missing ${miss.length} of ${must.length}` : `all ${must.length} present` };
  }
  const advisory = {};
  const rep = existsSync(path.join(QUALITY, "qe-check.cjs")) ? qe(answerPath, path.join(dir, "inputs")) : null;
  if (rep?.rows) {
    const row = n => rep.rows.find(r => r.name === n);
    const lk = row("leakcheck");
    if (lk && lk.status !== "NOT_RUN") advisory.leakcheck = { pass: lk.status !== "FAIL", detail: (String(lk.detail).split("\n").find(l => /^\s*line \d+/.test(l)) ?? String(lk.detail).split("\n")[0]).trim().slice(0, 160) };
    const rd = row("readability");
    if (rd) advisory.readability = { pass: rd.status !== "FAIL", detail: String(rd.detail).split("\n")[0].slice(0, 120) };
    const pf = row("proof");
    const m = pf && /(\d+) distinct figures[^:]*: (\d+) found in sources, (\d+) not/.exec(pf.detail);
    if (m) advisory.figures_traced = { share: Number(m[1]) ? Math.round((Number(m[2]) / Number(m[1])) * 100) / 100 : null, detail: `${m[2]} of ${m[1]} figures found in the inputs` };
  } else advisory.qe_check = { pass: null, detail: "qe-check did not run" };
  const out = { checks, advisory, pass_all: Object.values(checks).every(c => c.pass) };
  const metaPath = path.join(dir, "meta.json");
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
  meta.asserts = out;
  writeFileSync(metaPath, JSON.stringify(meta, null, 1));
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (isMain) {
  const A = args();
  const tasks = Object.fromEntries(loadTasks().map(t => [t.id, t]));
  const dirs = [];
  if (A.round) {
    const rd = path.join(A["rounds-dir"] ? path.resolve(A["rounds-dir"]) : ROUNDS, A.round, "runs");
    for (const t of readdirSync(rd)) for (const arm of readdirSync(path.join(rd, t))) for (const k of readdirSync(path.join(rd, t, arm))) dirs.push(path.join(rd, t, arm, k));
  } else if (A._[0]) dirs.push(path.resolve(A._[0]));
  else { console.error("usage: asserts.mjs <run folder> | --round <name> [--rounds-dir <dir>]"); process.exit(2); }
  let n = 0, passed = 0;
  for (const d of dirs) {
    const metaPath = path.join(d, "meta.json");
    const task = existsSync(metaPath) ? tasks[JSON.parse(readFileSync(metaPath, "utf8")).task] : undefined;
    const r = assertRun(d, task); if (!r) continue;
    n++; if (r.pass_all) passed++;
    if (dirs.length === 1 || !r.pass_all) console.log(`${path.relative(path.dirname(path.dirname(path.dirname(d))), d)}: ${r.pass_all ? "pass" : "FAIL " + Object.entries(r.checks).filter(([, c]) => !c.pass).map(([k, c]) => `${k} (${c.detail})`).join(", ")}`);
  }
  console.log(`${passed} of ${n} answers pass every hard check`);
}
