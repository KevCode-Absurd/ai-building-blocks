import fs from "node:fs";
import path from "node:path";
import { MODELS, callModel } from "../site/src/lib/composer-models.ts";
import { decodeCatalogue, candidatesFor, plannerPrompt, SELECTION_SCHEMA } from "../site/src/lib/composer-core.ts";
import { loadWorkflowEnv } from "./lib/workflow-env.mjs";
import { WORKFLOW_CASES } from "./lib/workflow-fresh-cases.mjs";
const root = process.cwd(), env = loadWorkflowEnv(root);
const c = decodeCatalogue(JSON.parse(fs.readFileSync("site/public/data/blocks.json", "utf8")));
const model = MODELS.find(m => m.id === "gpt-6-luna");
const task = WORKFLOW_CASES.find(t => t.id === "refund-support");
const prompt = plannerPrompt(task.goal, task.context, {}, candidatesFor(c, task.goal));
const out = path.join(root, "runs/workflow-benchmark/luna-response-diagnostic"); fs.mkdirSync(out, { recursive: true });
let raw;
const result = await callModel(model, env.OPENAI_API_KEY, prompt, SELECTION_SCHEMA, 5000, async (...args) => { const response = await fetch(...args); if (response.ok) raw = await response.clone().json(); return response; });
fs.writeFileSync(path.join(out, "response.json"), JSON.stringify(raw, null, 2));
console.log(JSON.stringify({ cost: result.cost, usage: result.usage, output: raw.output.map(o => ({ type: o.type, role: o.role, phase: o.phase, status: o.status, content: o.content?.map(c => ({ type: c.type, length: c.text?.length })) })) }, null, 2));
try { JSON.parse(result.text); console.log("combined JSON valid"); } catch (e) { console.log(e.message); }
