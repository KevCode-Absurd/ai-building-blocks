#!/usr/bin/env node
// Scores the AI builder end to end on the workflow bench (site/test/fixtures/workflow-bench.json): the same code the
// site runs (composer-semantic.ts semanticWorkflow: the model reads the request as search queries, candidatesFor builds
// the list it may choose from, the model plans, and Luna reviews once). Real model calls; nothing else.
//   node tools/evaluate-ai-builder.mjs [--split dev|test] [--model gpt-6-luna] [--label name] [--cap 3] [--only wb001,wb003]
// Odd ids are dev, even ids are test: tune on dev only, score test rarely. Results are kept per goal in
// runs/ai-builder-eval/<label>/, so a rerun with the same label spends nothing on goals already done; use a new label
// after changing the planner or the catalogue.
// Measures, per split:
//   listAnchor   an acceptable first step (anchor) is in the candidate list the model chose from
//   listSteps    share of the labelled step positions with an acceptable item in that list
//   planAnchor   the finished plan uses an acceptable anchor (a step, or inside a coordinator step)
//   planSteps    share of the labelled step positions the plan covers
//   failed       goals where the AI builder returned no valid plan (checked as the site checks it)
// --minds on|off (default on, as the builder page sends it): each step also gets mind perspectives, recorded per step.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MODELS, KEY_NAMES } from "../site/src/lib/composer-models.ts";
import { decodeCatalogue, finalize } from "../site/src/lib/composer-core.ts";
import { semanticWorkflow } from "../site/src/lib/composer-semantic.ts";
import { loadWorkflowEnv } from "./lib/workflow-env.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args[i + 1]; };
const minds = opt("minds", "on") !== "off", split = opt("split", "dev"), label = opt("label", `ai-builder-${split}`), cap = Number(opt("cap", "3"));
if (!["dev", "test"].includes(split) || !/^[a-z0-9-]+$/i.test(label) || !(cap > 0)) throw Error("Bad --split, --label or --cap");
const model = MODELS.find(m => m.id === opt("model", "gpt-6-luna"));
if (!model) throw Error("Unknown model");
const env = loadWorkflowEnv(ROOT), key = env[KEY_NAMES[model.provider]];
if (!key) throw Error(`No key for ${model.provider}`);
const dir = path.join(ROOT, "runs/ai-builder-eval", label); fs.mkdirSync(dir, { recursive: true });
const c = decodeCatalogue(JSON.parse(fs.readFileSync(path.join(ROOT, "site/public/data/blocks.json"), "utf8")));
const bench = JSON.parse(fs.readFileSync(path.join(ROOT, "site/test/fixtures/workflow-bench.json"), "utf8"));
const only = opt("only") ? new Set(opt("only").split(",")) : null;
const goals = bench.goals.filter(g => (Number(g.id.replace(/\D/g, "")) % 2 ? "dev" : "test") === split && g.anchor?.length && (!only || only.has(g.id)));
const expand = slug => { const b = c.bySlug[slug]; return [slug, ...(b?.steps ?? []).map(s => s.uses)]; };

let spent = fs.readdirSync(dir).filter(f => f.endsWith(".json")).reduce((n, f) => n + (JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).cost ?? 0), 0);
const todo = goals.filter(g => !fs.existsSync(path.join(dir, `${g.id}.json`)));
let next = 0;
async function worker() {
  while (next < todo.length) {
    const g = todo[next++];
    if (spent >= cap) { console.warn(`cap $${cap} reached; ${g.id} skipped`); continue; }
    const row = { id: g.id, request: g.request, anchor: g.anchor, steps: g.steps };
    try {
      const r = await semanticWorkflow(c, g.request, "", {}, model, key, undefined, minds);
      Object.assign(row, { cost: r.result.cost, intents: r.intents, candidates: r.candidates.map(b => b.slug) });
      // The same check the site runs before it shows a plan.
      const plan = finalize(c, JSON.parse(r.result.text), "ai", new Set(r.candidates.map(b => b.slug)), minds);
      Object.assign(row, { plan: plan.steps.map(s => s.slug), minds: plan.steps.map(s => s.minds ?? []) });
    } catch (e) { Object.assign(row, { cost: e.billable?.cost ?? 0, error: String(e.message ?? e).slice(0, 300) }); }
    spent += row.cost ?? 0;
    fs.writeFileSync(path.join(dir, `${g.id}.json`), JSON.stringify(row, null, 1));
    process.stdout.write(".");
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
const rows = goals.map(g => path.join(dir, `${g.id}.json`)).filter(f => fs.existsSync(f)).map(f => JSON.parse(fs.readFileSync(f, "utf8")));
const share = (have, groups) => { const gs = (groups ?? []).filter(x => x.length); return gs.length ? gs.filter(x => x.some(s => have.has(s))).length / gs.length : 1; };
const ok = rows.filter(r => !r.error), round = n => Number(n.toFixed(3));
const score = {
  split, model: model.id, goals: rows.length, failed: rows.length - ok.length, spentUsd: round(spent),
  listAnchor: round(ok.filter(r => { const have = new Set(r.candidates.flatMap(expand)); return r.anchor.some(s => have.has(s)); }).length / Math.max(1, ok.length)),
  listSteps: round(ok.reduce((n, r) => n + share(new Set(r.candidates.flatMap(expand)), r.steps), 0) / Math.max(1, ok.length)),
  planAnchor: round(ok.filter(r => { const have = new Set(r.plan.flatMap(expand)); return r.anchor.some(s => have.has(s)); }).length / Math.max(1, rows.length)),
  planSteps: round(ok.reduce((n, r) => n + share(new Set(r.plan.flatMap(expand)), r.steps), 0) / Math.max(1, rows.length)),
};
console.log("\n" + JSON.stringify(score, null, 1));
if (split === "dev" && args.includes("--verbose")) for (const r of rows) {
  const have = new Set((r.plan ?? []).flatMap(expand)), list = new Set((r.candidates ?? []).flatMap(expand));
  if (r.error || !r.anchor.some(s => have.has(s))) console.log(`${r.id} ${r.error ? "FAILED " + r.error : ""}\n  "${r.request.slice(0, 100)}"\n  want ${r.anchor.join(", ")} (in list: ${r.anchor.some(s => list.has(s))})\n  plan ${(r.plan ?? []).join(", ")}\n  intents ${(r.intents ?? []).map(i => i.query).join(" | ")}`);
}
