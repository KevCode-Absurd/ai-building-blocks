#!/usr/bin/env node
// Word counts of bench outputs against each brief's word limit.
//
//   node limits.cjs --briefs <dir>[,<dir>...] <out-dir> [<out-dir> ...] [--json]
//
// Briefs are <ID>.md files with a line like "**Length:** at most 1,000 words." Outputs are <ID>-agent.md and
// <ID>-plain.md, as written by the bench arms. For every output it prints:
//   - raw words: every whitespace-separated token, tables and markup included, the way an owner's word processor
//     or `wc -w` counts;
//   - visible words: the reader-facing count used by packs/shared/tools/quality/wordcount.cjs (markdown pipes and
//     markup stripped);
//   - each as a share of the owner's limit, flagged at the 85% aim and over 100%.
// Then a summary per arm: outputs over the limit by raw count and by visible count.
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const raw = t => (t.match(/\S+/g) || []).length;
// Same rule as the visible count in packs/shared/tools/quality/wordcount.cjs (markdown files).
const visible = t => (t.replace(/[|#*_>`-]+/g, " ").match(/[A-Za-z0-9$%€£][^\s]*/g) || []).length;

function limitOf(briefText) {
  const m = /at most\s+([\d,]+)\s+words/i.exec(briefText.split(/\r?\n/).find(l => /^\*\*Length/i.test(l)) || briefText);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

function rows(briefDirs, outDirs) {
  const limits = {};
  for (const d of briefDirs) for (const f of fs.readdirSync(d)) {
    const m = /^([A-Z]+\d+)\.md$/.exec(f);
    if (m) limits[m[1]] = limitOf(fs.readFileSync(path.join(d, f), "utf8"));
  }
  const out = [];
  for (const d of outDirs) for (const f of fs.readdirSync(d).sort()) {
    const m = /^([A-Z]+\d+)-(agent|plain)\.md$/.exec(f);
    if (!m) continue;
    const [, id, arm] = m, limit = limits[id] ?? null;
    const t = fs.readFileSync(path.join(d, f), "utf8"), r = raw(t), v = visible(t);
    out.push({ id, arm, file: path.join(d, f), limit, raw: r, visible: v,
      rawShare: limit ? r / limit : null, visibleShare: limit ? v / limit : null });
  }
  return out;
}

const pct = x => (x == null ? "n/a" : `${Math.round(x * 100)}%`);
const flag = x => (x == null ? "no limit found" : x > 1 ? "OVER" : x > 0.85 ? "above 85% aim" : "ok");

function main(argv) {
  const bi = argv.indexOf("--briefs");
  const briefDirs = bi >= 0 ? (argv[bi + 1] || "").split(",").filter(Boolean) : [];
  const outDirs = argv.filter((a, i) => !a.startsWith("--") && i !== bi + 1);
  if (!briefDirs.length || !outDirs.length) {
    console.error("Usage: node limits.cjs --briefs <dir>[,<dir>...] <out-dir> [<out-dir> ...] [--json]");
    return 2;
  }
  const res = rows(briefDirs, outDirs);
  const summary = {};
  for (const r of res) {
    const s = (summary[r.arm] ??= { outputs: 0, overRaw: 0, overVisible: 0, aboveAimRaw: 0, overRawIds: [] });
    s.outputs++;
    if (r.rawShare > 1) { s.overRaw++; s.overRawIds.push(r.id); }
    if (r.visibleShare > 1) s.overVisible++;
    if (r.rawShare > 0.85) s.aboveAimRaw++;
  }
  if (argv.includes("--json")) { console.log(JSON.stringify({ outputs: res, summary }, null, 1)); return 0; }
  console.log("| Job | Arm | Limit | Raw | Raw share | Visible | Visible share | Raw check |");
  console.log("|---|---|---|---|---|---|---|---|");
  for (const r of res) console.log(`| ${r.id} | ${r.arm} | ${r.limit ?? "?"} | ${r.raw} | ${pct(r.rawShare)} | ${r.visible} | ${pct(r.visibleShare)} | ${flag(r.rawShare)} |`);
  console.log("");
  for (const [arm, s] of Object.entries(summary)) {
    console.log(`${arm}: ${s.overRaw} of ${s.outputs} over the limit by raw count${s.overRawIds.length ? ` (${s.overRawIds.join(", ")})` : ""}; ${s.overVisible} over by visible count; ${s.aboveAimRaw} above the 85% aim by raw count.`);
  }
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { raw, visible, limitOf, rows };
