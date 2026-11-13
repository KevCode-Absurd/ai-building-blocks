// Unblind the verdicts and tally agent vs plain.
const fs = require("fs"), path = require("path");
const B = __dirname, key = JSON.parse(fs.readFileSync(path.join(B, "key", "key.json"), "utf8"));
const names = { J01: "Meta budget decisions", J02: "TikTok launch plan", J03: "Meta ad concepts", J04: "UGC video scripts", J05: "Meta ad copy set", J06: "Product page copy", J07: "Welcome email series", J08: "Win-back programme", J09: "90-day growth plan", J10: "Bundles and shipping threshold", J11: "Mattress page test plan", J12: "WhatsApp COD and sales" };
const crit = ["job_done", "actionable", "commercial", "craft", "overall"];
const tot = { agent: 0, plain: 0, tie: 0 }, perJob = {}, perJudge = {}, sums = { agent: {}, plain: {} }, n = { agent: 0, plain: 0 }, margins = { agent: {}, plain: {} }, reasons = [];
for (const f of fs.readdirSync(path.join(B, "verdicts")).filter(f => f.endsWith(".json")).sort()) {
  const v = JSON.parse(fs.readFileSync(path.join(B, "verdicts", f), "utf8")), jd = f.replace(".json", "");
  perJudge[jd] = { agent: 0, plain: 0, tie: 0 };
  for (const x of v.verdicts) {
    const map = key[jd][x.job], w = x.winner === "tie" ? "tie" : map[String(x.winner)];
    tot[w]++; perJudge[jd][w]++;
    (perJob[x.job] ??= { agent: 0, plain: 0, tie: 0, a: [], p: [] })[w]++;
    for (const [o, arm] of [["o1", map["1"]], ["o2", map["2"]]]) {
      n[arm]++; for (const c of crit) sums[arm][c] = (sums[arm][c] ?? 0) + Number(x[o][c]);
      perJob[x.job][arm === "agent" ? "a" : "p"].push(Number(x[o].overall));
    }
    if (w !== "tie") margins[w][x.margin] = (margins[w][x.margin] ?? 0) + 1;
    reasons.push(`${x.job} ${jd} -> ${w} (${x.margin}): ${x.reason}`);
  }
}
const avg = a => (a.reduce((s, x) => s + x, 0) / a.length).toFixed(2);
console.log("TOTAL", tot, "agent win share of decided:", (100 * tot.agent / (tot.agent + tot.plain)).toFixed(1) + "%");
console.log("Margins", JSON.stringify(margins));
console.log("\nCriteria averages (agent vs plain):");
for (const c of crit) console.log(`  ${c}: ${(sums.agent[c] / n.agent).toFixed(2)} vs ${(sums.plain[c] / n.plain).toFixed(2)}`);
console.log("\nPer job:");
for (const [j, r] of Object.entries(perJob).sort()) console.log(`  ${j} ${names[j]}: agent ${r.agent} / plain ${r.plain} / tie ${r.tie}  overall ${avg(r.a)} vs ${avg(r.p)}`);
console.log("\nPer judge:");
for (const [j, r] of Object.entries(perJudge)) console.log(`  ${j}: agent ${r.agent} / plain ${r.plain} / tie ${r.tie}`);
fs.writeFileSync(path.join(B, "reasons.txt"), reasons.join("\n"));
fs.writeFileSync(path.join(B, "tally.json"), JSON.stringify({ tot, margins, perJob, perJudge, crit: Object.fromEntries(crit.map(c => [c, [sums.agent[c] / n.agent, sums.plain[c] / n.plain]])) }, null, 1));
