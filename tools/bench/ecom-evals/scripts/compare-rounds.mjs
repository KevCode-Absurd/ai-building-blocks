#!/usr/bin/env node
// Round over round: is it improving, on tune and held-out separately? A change is promoted only if held-out
// does not fall. Offline; reads each round's score.json (from score.mjs).
//
//   node scripts/compare-rounds.mjs --base R1 --cand R2 [--arm code] [--pair code:plain] [--grade-drop 0.1]
//        [--rounds-dir <dir>] [--history R1,R2,R3]
//
// Promotion rule for the candidate (all must hold on HELD-OUT, for --arm):
//   1. owner score does not fall;  2. worst-of-3 does not fall;  3. pass^3 does not fall;
//   4. win share vs plain (--pair) does not fall;  5. no single grade falls by more than --grade-drop;
//   6. the held-out task set is identical in both rounds (frozen), and no held-out task was dropped.
// Tune must also improve on owner score or win share, or the change is "no gain" (not promoted).
// Exit code 0 = PROMOTE, 1 = DO NOT PROMOTE, 2 = usage error.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROUNDS, GRADES, args, list, r2, pct } from "./lib.mjs";

const A = args();
const base = A.base, cand = A.cand;
const dir = A["rounds-dir"] ? path.resolve(A["rounds-dir"]) : ROUNDS;
const load = r => { const p = path.join(dir, r, "score.json"); if (!existsSync(p)) { console.error(`missing ${p}`); process.exit(2); } return JSON.parse(readFileSync(p, "utf8")); };
const roundMeta = r => { const p = path.join(dir, r, "round.json"); return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {}; };

if (A.history) {
  const rs = list(A.history), arm = A.arm ?? "code", pair = A.pair ?? `${arm}:plain`;
  console.log(`| Round | Split | Owner score | Worst of 3 | pass^3 | Win share vs plain |\n|---|---|---|---|---|---|`);
  for (const r of rs) { const s = load(r); for (const split of ["tune", "heldout"]) { const a = s.by_arm[split]?.[arm] ?? {}, w = s.wins?.[pair]?.[split] ?? {};
    console.log(`| ${r} | ${split} | ${a.owner_mean ?? "n/a"} | ${a.owner_worst_mean ?? "n/a"} | ${a.pass3 == null ? "n/a" : pct(a.pass3)} | ${w.share == null ? "n/a" : pct(w.share)} |`); } }
  process.exit(0);
}
if (!base || !cand) { console.error("usage: compare-rounds.mjs --base <round> --cand <round> [--arm code]  or  --history R1,R2,..."); process.exit(2); }

const B = load(base), C = load(cand), arm = A.arm ?? "code", pair = A.pair ?? `${arm}:plain`, drop = Number(A["grade-drop"] ?? 0.1);
const get = (s, split) => ({ arm: s.by_arm[split]?.[arm] ?? null, win: s.wins?.[pair]?.[split] ?? null });
const rows = [], fails = [];
const d = (x, y) => (Number.isFinite(x) && Number.isFinite(y) ? r2(y - x) : null);
for (const split of ["tune", "heldout"]) {
  const b = get(B, split), c = get(C, split);
  const line = { split, owner: [b.arm?.owner_mean, c.arm?.owner_mean], worst: [b.arm?.owner_worst_mean, c.arm?.owner_worst_mean], pass3: [b.arm?.pass3, c.arm?.pass3], win: [b.win?.share, c.win?.share],
    ci: [b.win?.ci95, c.win?.ci95], grades: Object.fromEntries(GRADES.map(g => [g, [b.arm?.grades?.[g], c.arm?.grades?.[g]]])) };
  rows.push(line);
  if (split === "heldout") {
    if (!c.arm) fails.push("no held-out scores for the candidate");
    for (const [k, label] of [["owner", "owner score"], ["worst", "worst of 3"], ["pass3", "pass^3"], ["win", `win share (${pair})`]]) {
      const [x, y] = line[k]; if (Number.isFinite(x) && Number.isFinite(y) && y < x) fails.push(`held-out ${label} fell: ${r2(x)} to ${r2(y)}`);
      if (Number.isFinite(x) && !Number.isFinite(y)) fails.push(`held-out ${label} missing in candidate`);
    }
    for (const g of GRADES) { const [x, y] = line.grades[g]; if (Number.isFinite(x) && Number.isFinite(y) && x - y > drop) fails.push(`held-out grade ${g} fell by ${r2(x - y)} (limit ${drop})`); }
  }
}
const mb = roundMeta(base), mc = roundMeta(cand);
if (mb.heldout_sha256 && mc.heldout_sha256 && mb.heldout_sha256 !== mc.heldout_sha256) fails.push("held-out task definitions changed between rounds (the held-out set must stay frozen)");
const hoTasks = s => new Set(s.by_task.filter(r => r.split === "heldout" && r.arm === arm).map(r => r.task));
const hb = hoTasks(B), hc = hoTasks(C);
for (const t of hb) if (!hc.has(t)) fails.push(`held-out task ${t} missing from candidate`);
if (mb.model && mc.model && mb.model !== mc.model) fails.push(`model changed (${mb.model} to ${mc.model}): compare like for like`);
const tune = rows.find(r => r.split === "tune");
const tuneGain = (Number.isFinite(tune.owner[0]) && tune.owner[1] > tune.owner[0]) || (Number.isFinite(tune.win[0]) && tune.win[1] > tune.win[0]);

console.log(`# ${base} vs ${cand} (arm ${arm}, pair ${pair})\n`);
console.log("| Split | Owner score | Worst of 3 | pass^3 | Win share | Win 95% interval |\n|---|---|---|---|---|---|");
for (const r of rows) console.log(`| ${r.split} | ${r2(r.owner[0])} to ${r2(r.owner[1])} (${d(r.owner[0], r.owner[1])}) | ${r2(r.worst[0])} to ${r2(r.worst[1])} | ${r.pass3[0] == null ? "n/a" : pct(r.pass3[0])} to ${r.pass3[1] == null ? "n/a" : pct(r.pass3[1])} | ${r.win[0] == null ? "n/a" : pct(r.win[0])} to ${r.win[1] == null ? "n/a" : pct(r.win[1])} | ${r.ci[0] ? `${pct(r.ci[0][0])}-${pct(r.ci[0][1])}` : "n/a"} vs ${r.ci[1] ? `${pct(r.ci[1][0])}-${pct(r.ci[1][1])}` : "n/a"} |`);
console.log("\n| Grade | Tune | Held-out |\n|---|---|---|");
for (const g of GRADES) console.log(`| ${g} | ${d(...rows[0].grades[g]) ?? "n/a"} | ${d(...rows[1].grades[g]) ?? "n/a"} |`);
const overlap = rows[1].ci[0] && rows[1].ci[1] && !(rows[1].ci[1][0] > rows[1].ci[0][1]);
console.log(`\nHeld-out win intervals ${overlap ? "overlap: any held-out change is within noise." : "do not overlap."}`);
if (fails.length) { console.log(`\nDO NOT PROMOTE:\n${fails.map(f => `- ${f}`).join("\n")}`); process.exit(1); }
if (!tuneGain) { console.log("\nDO NOT PROMOTE: no gain on tune (held-out held, but the change did not help)."); process.exit(1); }
console.log("\nPROMOTE: tune improved and held-out did not fall.");
