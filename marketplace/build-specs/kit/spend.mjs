// spend.mjs: what a job spends on generation (images, video, voice), against the budget the owner signed off.
//   node agent/spend.mjs estimate <folder> <total> <currency> "<price source and date>"
//   node agent/spend.mjs use <folder>                                      pick the job whose signed-off budget generation tools may use
//   node agent/spend.mjs add <folder> "<what>" <cost> <currency> [model]   record a cost; refuses if it would go over
//   node agent/spend.mjs check <folder>                                     exit 1 if spend is over the estimate
//   node agent/spend.mjs left <folder>
// The estimate counts only once the owner signs off the stage that made it (the sign-off fingerprints
// cost-estimate.json). Generation tools marked "budgeted" in agent/tools.json are blocked by the gate unless
// the job picked with "use" has a signed-off estimate with money left. Costs are recorded by the agent
// after each generation from the provider's price; the hard stop is at the signed-off total.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { signedOff } from "./board.mjs";

const ROOT = process.env.AGENT_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATE = () => process.env.AGENT_STATE_DIR || path.join(ROOT, "agent-state");
const read = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };
const write = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2) + "\n"); };
const round = n => Math.round(n * 100) / 100;

export function totals(folder) {
  const est = read(path.join(ROOT, folder, "cost-estimate.json"), null), spent = read(path.join(ROOT, folder, "spend.json"), []);
  const sum = round(spent.reduce((t, x) => t + Number(x.cost || 0), 0));
  return { est, spent: sum, left: est ? round(est.total - sum) : null };
}

// What the gate reads before any generation tool runs.
export function budgetState() {
  const pick = read(path.join(STATE(), "budget.json"), null);
  if (!pick?.folder) return { ok: false, why: "No job budget is picked. Run: node agent/spend.mjs use <job folder>" };
  const t = totals(pick.folder);
  if (!t.est) return { ok: false, folder: pick.folder, why: `${pick.folder} has no cost-estimate.json` };
  if (!signedOff(pick.folder, "cost-estimate.json")) return { ok: false, folder: pick.folder, why: `the owner has not signed off this version of ${pick.folder}/cost-estimate.json` };
  if (t.left <= 0) return { ok: false, folder: pick.folder, why: `the budget for ${pick.folder} is used up (${t.spent} of ${t.est.total} ${t.est.currency}). Ask the owner.` };
  return { ok: true, folder: pick.folder, left: t.left };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, folder, a, b, c, d] = process.argv.slice(2);
  if (cmd === "estimate") {
    write(path.join(ROOT, folder, "cost-estimate.json"), { total: Number(a), currency: b, source: c ?? "", at: new Date().toISOString() });
    console.log(`Estimate of ${a} ${b} saved. It counts once the owner signs off this stage.`);
  } else if (cmd === "use") {
    write(path.join(STATE(), "budget.json"), { folder, at: new Date().toISOString() });
    const s = budgetState();
    console.log(s.ok ? `Generation may use ${folder}'s budget: ${s.left} left.` : `Picked ${folder}, but generation stays blocked: ${s.why}`);
  } else if (cmd === "add") {
    const t = totals(folder);
    if (!t.est) { console.log("No estimate for this job. Make one and get it signed off first."); process.exit(1); }
    if (!signedOff(folder, "cost-estimate.json")) { console.log("The owner has not signed off this version of cost-estimate.json. Nothing may be spent yet."); process.exit(1); }
    if (t.spent + Number(b) > t.est.total) { console.log(`Stop: this would bring spend to ${round(t.spent + Number(b))} ${t.est.currency}, over the approved ${t.est.total}. Ask the owner.`); process.exit(1); }
    const f = path.join(ROOT, folder, "spend.json");
    write(f, [...read(f, []), { what: a, cost: Number(b), currency: c, model: d ?? null, at: new Date().toISOString() }]);
    console.log(`Recorded. ${round(t.est.total - t.spent - Number(b))} ${t.est.currency} left.`);
  } else if (cmd === "check") {
    const t = totals(folder);
    if (!t.est) { console.log("No estimate."); process.exit(1); }
    console.log(`Spent ${t.spent} of ${t.est.total} ${t.est.currency}.`);
    process.exit(t.spent > t.est.total ? 1 : 0);
  } else if (cmd === "left") {
    const t = totals(folder);
    console.log(t.est ? `${t.left} ${t.est.currency} left of ${t.est.total}.` : "No estimate.");
  } else console.log("Commands: estimate <folder> <total> <currency> \"<source>\" | use <folder> | add <folder> \"<what>\" <cost> <currency> [model] | check <folder> | left <folder>");
}
