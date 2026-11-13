#!/usr/bin/env node
// Ship rate from owner-judge verdicts: how often an owner would ship each arm's work.
//
//   node ship-rate.cjs <judge-dir> [<judge-dir> ...] [--json]
//
// Reads raw/<judge>-<id>.json and key.json (written by tools/bench/owner-judge.mjs), unblinds each verdict and
// prints, per judge family and arm: "as is", small tweaks, major rework, overall 10s and overall 9 or more.
// "Strict" totals leave out Gemini, which says "as is" and gives 10s far more freely than the other three families.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const dirs = process.argv.slice(2).filter(a => !a.startsWith("--"));
const asJson = process.argv.includes("--json");
if (!dirs.length) { console.error("Usage: node ship-rate.cjs <judge-dir> [...] [--json]"); process.exit(2); }
const blank = () => ({ n: 0, as_is: 0, small: 0, major: 0, tens: 0, nine_plus: 0 });
const out = {};
for (const dir of dirs) {
  const key = JSON.parse(fs.readFileSync(path.join(dir, "key.json"), "utf8"));
  const res = {};
  const bump = (fam, arm, v) => {
    res[fam] ??= { agent: blank(), plain: blank() };
    const r = res[fam][arm];
    r.n++;
    if (v.use_as_is === "as is") r.as_is++;
    else if (v.use_as_is === "with small tweaks") r.small++;
    else if (v.use_as_is === "with major rework" || v.use_as_is === "not usable") r.major++;
    const o = parseFloat(v.overall);
    if (o >= 10) r.tens++;
    if (o >= 9) r.nine_plus++;
  };
  for (const f of fs.readdirSync(path.join(dir, "raw"))) {
    const m = /^([A-Z]+\d+)-([A-Z]+\d+)\.json$/.exec(f);
    if (!m) continue;
    const [, judge, id] = m;
    const k = key[judge]?.[id];
    if (!k) continue;
    let v;
    try { v = JSON.parse(fs.readFileSync(path.join(dir, "raw", f), "utf8")); } catch { continue; }
    const fam = key[judge].provider;
    for (const slot of ["1", "2"]) {
      const s = v[`o${slot}`];
      if (!s) continue;
      for (const f2 of [fam, "all", ...(fam === "gemini" ? [] : ["strict"])]) bump(f2, k[slot], s);
    }
  }
  out[dir] = res;
}
if (asJson) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
for (const [dir, res] of Object.entries(out)) {
  console.log(`\n${path.basename(dir)}\n| Judges | Arm | Outputs | As is | Small tweaks | Major rework | 10s | 9 or more |\n|---|---|---|---|---|---|---|---|`);
  for (const fam of ["all", "strict", "claude", "openai", "deepseek", "gemini"]) {
    if (!res[fam]) continue;
    for (const arm of ["agent", "plain"]) {
      const r = res[fam][arm];
      console.log(`| ${fam} | ${arm} | ${r.n} | ${r.as_is} | ${r.small} | ${r.major} | ${r.tens} | ${r.nine_plus} |`);
    }
  }
}
