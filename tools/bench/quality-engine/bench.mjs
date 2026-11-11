#!/usr/bin/env node
// The standing quality benchmark (QUALITY-ENGINE.md, rule 10): blind-pack two arms' answers and tally judges' verdicts.
//
//   node tools/bench/quality-engine/bench.mjs pack  <run folder>   # <run>/plain/<id>/final.* and <run>/engine/<id>/final.*
//   node tools/bench/quality-engine/bench.mjs tally <run folder>   # reads <run>/judge-results/*.json
//
// pack writes <run>/judge/<id>/{request.txt,X.*,Y.*} with the order randomised per task, and keeps the answer key in
// <run>/key.json, which judges must never open. tally writes <run>/RESULTS.md: win rate and mean scores for all,
// by task set, by judge panel (ids starting "i" use the independent brief), by judge model and by task.
// Runs happen on your own machine and model account (no hosted jobs, no CI). Plain Node, no packages.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [cmd, runDir] = process.argv.slice(2);
if (!["pack", "tally"].includes(cmd) || !runDir) { console.error("Usage: bench.mjs pack|tally <run folder>"); process.exit(2); }
const HERE = path.dirname(fileURLToPath(import.meta.url));
const tasks = JSON.parse(readFileSync(existsSync(path.join(runDir, "tasks.json")) ? path.join(runDir, "tasks.json") : path.join(HERE, "tasks.json"), "utf8"));
const DIMS = ["usefulness", "accuracy", "specificity", "clarity", "craft", "overall"];
const OPUS = new Set((process.env.OPUS_JUDGES ?? "j1,j2,j3,i1,i2").split(","));

if (cmd === "pack") {
  const key = {};
  for (const t of tasks) {
    const plain = path.join(runDir, "plain", t.id, `final.${t.ext}`), engine = path.join(runDir, "engine", t.id, `final.${t.ext}`);
    if (!existsSync(plain) || !existsSync(engine)) { console.log(`missing ${t.id}: plain ${existsSync(plain)}, engine ${existsSync(engine)}`); continue; }
    const out = path.join(runDir, "judge", t.id); mkdirSync(out, { recursive: true });
    const engineIsX = Math.random() < 0.5;
    copyFileSync(engineIsX ? engine : plain, path.join(out, `X.${t.ext}`));
    copyFileSync(engineIsX ? plain : engine, path.join(out, `Y.${t.ext}`));
    writeFileSync(path.join(out, "request.txt"), t.brief);
    key[t.id] = { X: engineIsX ? "engine" : "plain", Y: engineIsX ? "plain" : "engine" };
  }
  writeFileSync(path.join(runDir, "key.json"), JSON.stringify(key, null, 1));
  console.log(`packed ${Object.keys(key).length} pairs into ${path.join(runDir, "judge")}`);
} else {
  const key = JSON.parse(readFileSync(path.join(runDir, "key.json"), "utf8"));
  const groups = new Map(), perTask = {};
  const add = (g, eng, pla, won, tie) => {
    const s = groups.get(g) ?? { n: 0, w: 0, t: 0, e: {}, p: {} }; groups.set(g, s);
    s.n++; if (won) s.w++; if (tie) s.t++;
    for (const d of DIMS) { s.e[d] = (s.e[d] ?? 0) + eng[d]; s.p[d] = (s.p[d] ?? 0) + pla[d]; }
  };
  const dir = path.join(runDir, "judge-results");
  for (const f of readdirSync(dir).filter(f => f.endsWith(".json"))) {
    const r = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
    for (const p of r.pairs) {
      const k = key[p.id], t = tasks.find(x => x.id === p.id); if (!k || !t) continue;
      const es = k.X === "engine" ? "X" : "Y", ps = es === "X" ? "Y" : "X", won = p.winner === es, tie = p.winner === "tie";
      for (const g of ["All", `set: ${t.set}`, /^i/.test(r.judge) ? "panel: independent brief" : "panel: original brief", OPUS.has(r.judge) ? "judges: Opus" : "judges: Sonnet", `judge ${r.judge}`, `task ${p.id} (${t.kind})`]) add(g, p[es], p[ps], won, tie);
      perTask[p.id] = perTask[p.id] ?? { w: 0, n: 0 }; perTask[p.id].n++; if (won) perTask[p.id].w++;
    }
  }
  const rows = ["| Scope | Verdicts | Engine wins | Ties | Engine win rate | " + DIMS.map(d => `${d} (plain → engine)`).join(" | ") + " |", "|" + "---|".repeat(5 + DIMS.length)];
  for (const [g, s] of groups) rows.push(`| ${g} | ${s.n} | ${s.w} | ${s.t} | ${Math.round((100 * s.w) / s.n)}% | ` + DIMS.map(d => `${(s.p[d] / s.n).toFixed(2)} → ${(s.e[d] / s.n).toFixed(2)}`).join(" | ") + " |");
  rows.push("", "Engine wins per task: " + Object.entries(perTask).map(([id, v]) => `${id} ${v.w}/${v.n}`).join(", "));
  writeFileSync(path.join(runDir, "RESULTS.md"), rows.join("\n") + "\n");
  console.log(rows.join("\n"));
}
