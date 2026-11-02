// Test AI specialists (site/public/data/roles) on their own golden tasks: one model works as the specialist,
// a different model grades the answer against that role's checks (evaluation.rubric).
//
//   node tools/eval-roles.mjs plan [--roles a,b] [--area x] [--limit n]   count the work and price it; no calls
//   node tools/eval-roles.mjs run  --roles a,b | --area x [--limit n]     run and grade; needs ANTHROPIC_API_KEY
//
// A role passes when every golden task meets at least 80% of its checks and the missing-input task names the gap.
// Passing results go to site/src/roles/role-evals.json, keyed to the rubric they were graded on, so the next
// build-roles shows them; a changed rubric drops the role back to NOT_RUN. Full runs stay in runs/role-evals/<label>/.
// Only ANTHROPIC_API_KEY is read from ../.env, by name. Every call is priced and checked by tools/spend-cap.mjs first.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { cost, estimate, guard, charge, summary as spendSummary } from "./spend-cap.mjs";
import { rubricSha } from "../site/src/roles/role-enrichment.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const ROLES = path.join(ROOT, "site/public/data/roles");
const RESULTS = path.join(ROOT, "site/src/roles/role-evals.json");

// The worker and the judge are different models (never grade with the model that wrote it).
const WORKER = { model: "claude-sonnet-5-5", effort: "medium" };
const JUDGE = { model: "claude-opus-5-5", effort: "medium" };
const EST_OUT = { work: 7000, judge: 3000 };
const PASS_SHARE = 0.8;

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k) => { const i = args.indexOf(`--${k}`); return i < 0 ? undefined : args[i + 1]; };
const LABEL = opt("label") || new Date().toISOString().slice(0, 10);
const STATE = path.join(ROOT, "runs/role-evals", LABEL);

function loadKey() {
  if (process.env.ANTHROPIC_API_KEY) return;
  const env = path.resolve(ROOT, "../.env");
  if (!fs.existsSync(env)) throw new Error("No ANTHROPIC_API_KEY set and no ../.env found.");
  for (const line of fs.readFileSync(env, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.*)\s*$/);
    if (m) { process.env.ANTHROPIC_API_KEY = m[1].replace(/^["']|["']$/g, ""); return; }
  }
  throw new Error("ANTHROPIC_API_KEY isn't in ../.env.");
}

function selected() {
  const ids = opt("roles")?.split(",").map((s) => s.trim()).filter(Boolean);
  const area = opt("area"), limit = opt("limit") ? Number(opt("limit")) : Infinity;
  let roles = fs.readdirSync(ROLES).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(ROLES, f), "utf8")));
  if (ids) roles = roles.filter((r) => ids.includes(r.id));
  if (area) roles = roles.filter((r) => r.area === area);
  return roles.filter((r) => r.evaluation?.goldenTasks?.length).slice(0, limit);
}

const userMessage = (task) => task.kind === "missing-input"
  ? `I need your help with this. ${task.situation.replace(/^The request leaves out: /, "I haven't given you ")}. Do what you can and tell me what you need.`
  : `${task.situation}\n\nI haven't attached my files. Make up a short sample, clearly marked SAMPLE, so you can show the complete result, and say what you would need from me for the real thing.`;

const workRequest = (role, task) => ({
  model: WORKER.model, max_tokens: 32000, output_config: { effort: WORKER.effort },
  system: `${role.instructions}\n\nThis is a test run with no files or tools attached. Answer in this chat.`,
  messages: [{ role: "user", content: userMessage(task) }],
});

const JUDGE_SCHEMA = {
  type: "object", additionalProperties: false, required: ["criteria", "summary"],
  properties: {
    criteria: { type: "array", items: { type: "object", additionalProperties: false, required: ["id", "met", "reason"], properties: { id: { type: "string" }, met: { type: "boolean" }, reason: { type: "string" } } } },
    summary: { type: "string" },
  },
};

function judgeRequest(role, task, answer) {
  const checks = task.kind === "missing-input" ? task.expect.map((c, i) => ({ id: `m${i + 1}`, criterion: c })) : role.evaluation.rubric;
  return {
    model: JUDGE.model, max_tokens: 16000,
    output_config: { effort: JUDGE.effort, format: { type: "json_schema", schema: JUDGE_SCHEMA } },
    system: "You grade one AI specialist's answer against a fixed list of checks. Judge only what the answer shows. Sample material marked SAMPLE is allowed; presenting invented facts as real is not. Return one entry per check id.",
    messages: [{ role: "user", content: `<role>${role.name}: ${role.summary}</role>\n<request>\n${userMessage(task)}\n</request>\n<checks>\n${checks.map((c) => `${c.id}: ${c.criterion}`).join("\n")}\n</checks>\n<answer>\n${answer}\n</answer>\n\nGrade the answer.` }],
  };
}

let client;
async function call(req, what) {
  guard(estimate(req, req.model === JUDGE.model ? EST_OUT.judge : EST_OUT.work, false), `${what} (${req.model})`);
  const msg = await (client ??= new Anthropic({ maxRetries: 4 })).messages.stream(req).finalMessage();
  charge({ script: "eval-roles", kind: what, label: LABEL, model: msg.model || req.model }, cost(msg.model || req.model, msg.usage, false));
  if (msg.stop_reason === "refusal") throw new Error(`${what} was declined (${msg.stop_details?.category ?? "no category"}).`);
  return msg;
}
const textOf = (msg) => msg.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();

async function evaluate(role) {
  const tasks = [];
  for (const task of role.evaluation.goldenTasks) {
    const work = await call(workRequest(role, task), `work ${role.id}/${task.id}`);
    const answer = textOf(work);
    const graded = JSON.parse(textOf(await call(judgeRequest(role, task, answer), `judge ${role.id}/${task.id}`)));
    const met = graded.criteria.filter((c) => c.met).length, share = graded.criteria.length ? met / graded.criteria.length : 0;
    tasks.push({ id: task.id, kind: task.kind, share: +share.toFixed(2), passed: task.kind === "missing-input" ? share === 1 : share >= PASS_SHARE, criteria: graded.criteria, summary: graded.summary, answer });
  }
  const score = +(tasks.reduce((n, t) => n + t.share, 0) / tasks.length).toFixed(2);
  return { id: role.id, version: role.version?.number ?? null, rubricSha: rubricSha(role.evaluation.rubric), score, passed: tasks.every((t) => t.passed), tasks };
}

const roles = selected();
if (cmd === "plan") {
  const calls = roles.reduce((n, r) => n + r.evaluation.goldenTasks.length * 2, 0);
  const usd = roles.reduce((n, r) => n + r.evaluation.goldenTasks.reduce((m, t) => m + estimate(workRequest(r, t), EST_OUT.work, false) + estimate(judgeRequest(r, t, "x".repeat(20000)), EST_OUT.judge, false), 0), 0);
  console.log(`${roles.length} roles, ${calls} calls, estimated up to $${usd.toFixed(2)} before caching. ${spendSummary()}`);
} else if (cmd === "run") {
  if (!opt("roles") && !opt("area")) throw new Error("Choose roles with --roles or --area. Run plan first to see the cost.");
  loadKey();
  const store = JSON.parse(fs.readFileSync(RESULTS, "utf8"));
  for (const role of roles) {
    const result = await evaluate(role);
    fs.mkdirSync(STATE, { recursive: true });
    fs.writeFileSync(path.join(STATE, `${role.id}.json`), JSON.stringify(result, null, 2));
    store.results[role.id] = { date: new Date().toISOString().slice(0, 10), model: WORKER.model, judge: JUDGE.model, score: result.score, passed: result.passed, rubricSha: result.rubricSha, version: result.version };
    fs.writeFileSync(RESULTS, JSON.stringify(store, null, 1) + "\n");
    console.log(`${role.id}: ${result.passed ? "PASS" : "FAIL"} (${result.score})`);
  }
  console.log(`Saved to ${path.relative(ROOT, RESULTS)}. Run node site/scripts/build-roles.mjs to show the results. ${spendSummary()}`);
} else {
  console.log("Usage: node tools/eval-roles.mjs plan|run [--roles a,b] [--area x] [--limit n] [--label name]");
}
