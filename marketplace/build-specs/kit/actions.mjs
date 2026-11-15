// actions.mjs: plans, approvals, runs and the task schedule, kept as plain files in agent-state/.
// Claude uses it to write a plan and show the dry run. It cannot approve: only the owner's own
// message "yes <code>" does that, through the prompt hook (or the signed-in approval page when hosted).
//
//   node agent/actions.mjs plan <draft.json>      check a draft plan and show the dry run
//   node agent/actions.mjs propose-file <file> <new version> "<what changes>"   change an owner-held file (limits, goals, tool list)
//   node agent/actions.mjs status [planId]         what is waiting, approved, done or failed
//   node agent/actions.mjs verify <planId> <actionId> "<what you read back>"
//   node agent/actions.mjs due                     tasks whose time has come
//   node agent/actions.mjs schedule add <ISO time> "<task>"
//   node agent/actions.mjs schedule done <taskId> "<result>"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonical, checkPlan, checkFilePlan, decide, planHash, shortCode, parseYes, parsePause, baseName, inputDaily, withoutVolatile } from "./guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = process.env.AGENT_ROOT || path.resolve(HERE, "..");
const STATE = () => process.env.AGENT_STATE_DIR || path.join(ROOT, "agent-state");
const DAY = 24 * 60 * 60 * 1000;

const readJson = (file, fallback) => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; } };
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n"); };
const readDir = dir => Object.fromEntries((fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(f => f.endsWith(".json")).map(f => [f.slice(0, -5), readJson(path.join(dir, f), null)]).filter(([, v]) => v));
export const log = entry => { fs.mkdirSync(STATE(), { recursive: true }); fs.appendFileSync(path.join(STATE(), "log.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n"); };

// null when tools.json is missing or broken: the hooks then block every connector tool (the gate fails closed).
export const loadTools = () => { const t = readJson(path.join(ROOT, "agent", "tools.json"), null); return t && typeof t === "object" && !Array.isArray(t) ? t : null; };
export const loadLimits = () => readJson(path.join(ROOT, "context", "limits.json"), {});
export function loadState() {
  return {
    mode: process.env.AGENT_RUN_MODE === "scheduled" ? "scheduled" : "live",
    paused: Boolean(readJson(path.join(STATE(), "paused.json"), null)?.paused),
    plans: readDir(path.join(STATE(), "plans")),
    approvals: readDir(path.join(STATE(), "approvals")),
    runs: readDir(path.join(STATE(), "runs")),
  };
}

export function savePlan(draft, now = Date.now()) {
  const tools = loadTools();
  if (!tools && draft?.kind !== "file") return { problems: ["agent/tools.json is missing or not valid JSON, so no plan can be checked. Propose a fixed version with a file plan."] };
  const problems = draft?.kind === "file" ? checkFilePlan(draft) : checkPlan(draft, tools, loadLimits(), now);
  if (problems.length) return { problems };
  const hash = planHash(draft);
  const id = `${new Date(now).toISOString().slice(0, 10)}-${shortCode(hash)}`;
  const plan = { ...draft, id, hash, code: shortCode(hash), created_at: new Date(now).toISOString() };
  writeJson(path.join(STATE(), "plans", `${id}.json`), plan);
  log({ event: "plan", plan: id, kind: plan.kind ?? "actions" });
  return { plan };
}

// Called only by the prompt hook with the owner's own words: "pause all agent work" or "resume agent work".
export function recordPause(words, by = "owner", now = Date.now()) {
  const p = parsePause(words);
  if (!p) return null;
  writeJson(path.join(STATE(), "paused.json"), { paused: p === "pause", by, words: String(words).slice(0, 200), at: new Date(now).toISOString() });
  log({ event: p === "pause" ? "paused" : "resumed", by });
  return p;
}

// Called only by the prompt hook with the owner's own words, or by the hosted approval page.
export function recordApproval(words, by = "owner", now = Date.now()) {
  const code = parseYes(words);
  if (!code) return null;
  const state = loadState();
  const plan = Object.values(state.plans).find(p => p.code === code && !state.approvals[p.id]);
  if (!plan) return { code, found: false };
  if (plan.hash !== planHash(plan)) return { code, found: true, changed: true };
  const approval = { plan_id: plan.id, hash: plan.hash, owner_words: String(words).slice(0, 500), approved_by: by, approved_at: new Date(now).toISOString(), expires_at: now + DAY };
  writeJson(path.join(STATE(), "approvals", `${plan.id}.json`), approval);
  log({ event: "approved", plan: plan.id, by });
  if (plan.kind === "file") {
    const target = path.join(ROOT, plan.target);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, plan.content);
    writeJson(path.join(STATE(), "runs", `${plan.id}.json`), { results: {}, done: ["file"], failed: [], applied: plan.target });
    log({ event: "file changed", plan: plan.id, target: plan.target });
    return { code, found: true, plan: plan.id, applied: plan.target };
  }
  return { code, found: true, plan: plan.id };
}

// After a write ran (or failed), record it so the same step never runs twice.
export function recordResult(toolName, toolInput, response, failed = false) {
  const state = loadState();
  const verdict = decide(toolName, toolInput, state, loadTools());
  if (!verdict.allow || !verdict.planId) return null;
  const file = path.join(STATE(), "runs", `${verdict.planId}.json`);
  const run = readJson(file, { results: {}, done: [], failed: [], verified: {} });
  if (failed) run.failed.push(verdict.actionId);
  else { run.done.push(verdict.actionId); run.results[verdict.actionId] = pickIds(response); }
  writeJson(file, run);
  log({ event: failed ? "failed" : "done", plan: verdict.planId, action: verdict.actionId, tool: baseName(toolName) });
  return { planId: verdict.planId, actionId: verdict.actionId, failed };
}

// Pull "id"-like fields out of a tool response (MCP text content holding JSON, or plain JSON).
export function pickIds(response) {
  const found = {};
  const visit = v => {
    if (typeof v === "string") { try { visit(JSON.parse(v)); } catch { /* plain text */ } return; }
    if (Array.isArray(v)) return v.forEach(visit);
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { if (/(^|_)id$/.test(k) && (typeof x === "string" || typeof x === "number")) found[k] ??= String(x); else visit(x); }
  };
  visit(response);
  return found;
}

export function dryRun(plan) {
  if (plan.kind === "file") {
    const now = fs.existsSync(path.join(ROOT, plan.target)) ? fs.readFileSync(path.join(ROOT, plan.target), "utf8") : "(file does not exist yet)";
    return [`Plan ${plan.id}: ${plan.purpose}`, "", `Change ${plan.target}: ${plan.say}`, "", "Now:", now.trim(), "", "After:", plan.content.trim(), "",
      `To approve exactly this change, reply: yes ${plan.code}`, "Anything else, including a plain yes, changes nothing."].join("\n");
  }
  const lines = [`Plan ${plan.id}: ${plan.purpose}`, ""];
  const tools = loadTools() ?? {};
  plan.actions.forEach((a, i) => {
    const fromInput = inputDaily(a, tools);
    lines.push(`${i + 1}. ${a.say}`);
    lines.push(`   Exact input: ${JSON.stringify(withoutVolatile(a.input, tools))}`);
    if (fromInput !== null) lines.push(`   Daily budget set by this input: ${fromInput} ${a.spend?.currency ?? ""} (worked out from the input, not from the description)`);
    lines.push(`   Where: ${a.where ?? baseName(a.tool)}${a.spend ? `   Money: ${a.spend.daily} ${a.spend.currency} a day${Number.isFinite(a.spend.change_pct) ? ` (${a.spend.change_pct > 0 ? "+" : ""}${a.spend.change_pct}%)` : ""}` : "   Money: none"}`);
    lines.push(`   Undo: ${a.undo}   Check after: ${a.check}`);
  });
  if (plan.job) lines.splice(1, 0, `For job ${plan.job}`);
  lines.push("", `To approve exactly this list, reply: yes ${plan.code}`, "Anything else, including a plain yes, changes nothing. The code works for 24 hours.");
  return lines.join("\n");
}

function status(id) {
  const s = loadState();
  const rows = Object.values(s.plans).filter(p => !id || p.id === id).map(p => {
    const run = s.runs[p.id] ?? { done: [], failed: [] };
    const total = p.kind === "file" ? 1 : p.actions.length;
    const st = run.failed?.length ? "stopped after a failed step" : !s.approvals[p.id] ? "waiting for the owner" : run.done.length === total ? "done" : `approved, ${run.done.length}/${total} steps done`;
    return `${p.id}  ${st}  ${p.purpose}`;
  });
  return rows.join("\n") || "No plans yet.";
}

const schedFile = () => path.join(STATE(), "schedule.json");
export function due(now = Date.now()) { return readJson(schedFile(), []).filter(t => !t.done && Date.parse(t.due_at) <= now); }

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, a, b, c] = process.argv.slice(2);
  if (cmd === "plan") {
    const { plan, problems } = savePlan(readJson(a, null) ?? {});
    if (problems) { console.log("Plan not saved. Fix these first:\n- " + problems.join("\n- ")); process.exit(1); }
    console.log(dryRun(plan));
  } else if (cmd === "propose-file") {
    const content = fs.readFileSync(b, "utf8");
    const { plan, problems } = savePlan({ kind: "file", target: a.replace(/\\/g, "/"), content, purpose: `Change ${a}`, say: c ?? "" });
    if (problems) { console.log("Not saved. Fix these first:\n- " + problems.join("\n- ")); process.exit(1); }
    console.log(dryRun(plan));
  } else if (cmd === "status") console.log(status(a));
  else if (cmd === "verify") {
    const file = path.join(STATE(), "runs", `${a}.json`), run = readJson(file, null);
    if (!run?.done?.includes(b)) { console.log(`Step ${b} of ${a} has not run, so there is nothing to verify.`); process.exit(1); }
    run.verified = { ...(run.verified ?? {}), [b]: { note: c, at: new Date().toISOString() } };
    writeJson(file, run); log({ event: "verified", plan: a, action: b }); console.log("Recorded.");
  } else if (cmd === "due") console.log(JSON.stringify(due(), null, 2));
  else if (cmd === "schedule" && a === "add") {
    const list = readJson(schedFile(), []), t = { id: `t${list.length + 1}`, due_at: new Date(b).toISOString(), task: c, done: false };
    writeJson(schedFile(), [...list, t]); console.log(`Scheduled ${t.id} for ${t.due_at}`);
  } else if (cmd === "schedule" && a === "done") {
    const list = readJson(schedFile(), []); const t = list.find(x => x.id === b);
    if (!t) { console.log(`No task ${b}`); process.exit(1); }
    Object.assign(t, { done: true, result: c, done_at: new Date().toISOString() }); writeJson(schedFile(), list); console.log("Marked done.");
  } else { console.log("Commands: plan <draft.json> | propose-file <file> <new version> \"<what changes>\" | status [planId] | verify <planId> <actionId> \"<note>\" | due | schedule add <ISO> \"<task>\" | schedule done <id> \"<result>\""); }
}
export { canonical };
