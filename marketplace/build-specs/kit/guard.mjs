// guard.mjs: the approval gate every AI Blocks build spec ships. No dependencies.
// It decides one thing: may this tool call run right now?
// Reads on the tool list always may. Every other connector tool is blocked unless it is the next step
// of a plan the owner approved, with the exact input approved, once, inside the owner's limits; or a
// generation tool inside a budget the owner signed off; or an exact standing rule the owner set.
import { createHash } from "node:crypto";

// Stable JSON: keys sorted at every level, so the same data always gives the same text.
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().filter(k => value[k] !== undefined).map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export const sha256 = text => createHash("sha256").update(text).digest("hex");

// The fingerprint covers what will happen (and for which job), not when the plan was written.
export function planHash(plan) {
  if (plan.kind === "file") return sha256(canonical({ kind: "file", purpose: plan.purpose, target: plan.target, content: plan.content }));
  return sha256(canonical({ purpose: plan.purpose, job: plan.job ?? null, actions: plan.actions.map(a => ({ id: a.id, tool: a.tool, input: a.input, spend: a.spend ?? null })) }));
}

// The six characters the owner types after "yes". It ties the yes to this exact list.
export const shortCode = hash => hash.slice(0, 6);

// The tool's own name, whatever prefix the app adds (mcp__<server>__<tool>).
export const baseName = toolName => String(toolName).split("__").pop();
export const isConnectorTool = toolName => String(toolName).startsWith("mcp__");

// "yes 3f9a2c", "Yes, 3f9a2c go ahead". A bare "yes", "ok" or "sounds good" is not an approval.
export function parseYes(text) {
  const m = /^\s*(?:yes|approved|approve)\b[\s,.:!-]*([0-9a-f]{6})\b/i.exec(String(text));
  return m ? m[1].toLowerCase() : null;
}
// The owner's own words that stop or restart all agent writes.
export const parsePause = text => /^\s*pause all agent work\b/i.test(String(text)) ? "pause" : /^\s*resume agent work\b/i.test(String(text)) ? "resume" : null;

// Fill "$a1.id" or "$a1.ad_set_id" references with ids returned by earlier actions in the same plan.
export function resolve(input, results) {
  if (typeof input === "string") {
    const m = /^\$([A-Za-z0-9_-]+)\.([A-Za-z0-9_]+)$/.exec(input);
    if (!m) return input;
    const value = results?.[m[1]]?.[m[2]];
    return value === undefined ? input : value;
  }
  if (Array.isArray(input)) return input.map(v => resolve(v, results));
  if (input && typeof input === "object") return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, resolve(v, results)]));
  return input;
}

// Fields a connector fills in per call (conversation ids, the client's model, the user's last words).
// They cannot be known when the plan is written, so they are left out when inputs are compared.
export function withoutVolatile(input, tools) {
  const drop = new Set(tools?.volatile_fields ?? []);
  if (!drop.size || !input || typeof input !== "object" || Array.isArray(input)) return input;
  return Object.fromEntries(Object.entries(input).filter(([k]) => !drop.has(k)));
}

// The new daily spend an action's own input sets, worked out in code from the tool's budget fields.
// budget_fields maps a field name to its divisor (Meta budgets are in cents, so 100).
export function inputDaily(action, tools) {
  const fields = tools.write?.[baseName(action.tool)]?.budget_fields ?? {};
  let total = null;
  for (const [field, divisor] of Object.entries(fields)) {
    const v = action.input?.[field];
    if (v !== undefined && v !== null && v !== "") total = (total ?? 0) + Number(v) / Number(divisor || 1);
  }
  return total === null ? null : Math.round(total * 100) / 100;
}

// Checks a plan before the owner sees it. Returns a list of problems; empty means it can be shown.
export function checkPlan(plan, tools, limits, now = Date.now()) {
  const problems = [];
  if (!plan?.purpose || String(plan.purpose).length < 12) problems.push("plan needs a purpose the owner can read");
  if (!Array.isArray(plan?.actions) || !plan.actions.length) return [...problems, "plan has no actions"];
  if (tools.require_review && plan.review?.verdict !== "PASS") problems.push("the reviewer has not passed this plan yet (review.verdict must be PASS, with review.by naming the reviewer)");
  if (tools.require_review && plan.review?.verdict === "PASS" && !plan.review?.by) problems.push("say which reviewer passed the plan (review.by)");
  if (limits?.ends_on && Date.parse(limits.ends_on) < now) problems.push(`your limits ended on ${limits.ends_on}; renew them before any new plan`);
  const ids = new Set();
  let newDaily = 0;
  for (const a of plan.actions) {
    if (!a.id || ids.has(a.id)) problems.push(`action ids must be unique (${a.id})`);
    ids.add(a.id);
    const name = baseName(a.tool), rule = tools.write?.[name];
    if (tools.never?.includes(name)) problems.push(`${a.id}: ${name} is never allowed`);
    else if (!rule) problems.push(`${a.id}: ${name} is not on the write list`);
    else if (rule.budgeted) problems.push(`${a.id}: ${name} is a generation tool; it runs inside a signed-off budget, not in a plan`);
    if (!a.say || String(a.say).length < 8) problems.push(`${a.id}: say in plain words what this does`);
    if (!a.undo) problems.push(`${a.id}: say how to undo it, or "cannot be undone"`);
    if (!a.check) problems.push(`${a.id}: say how the result will be checked after`);
    for (const f of [].concat(rule?.account_field ?? [])) {
      const acct = a.input?.[f];
      if (acct !== undefined && Array.isArray(limits?.ad_accounts) && !limits.ad_accounts.includes(String(acct))) problems.push(`${a.id}: account ${acct} is not one of your ad accounts in limits.json`);
    }
    const fromInput = inputDaily(a, tools);
    if (rule?.spends && !a.spend && fromInput === null) problems.push(`${a.id}: ${name} can spend money, so it needs a spend line`);
    if (fromInput !== null && a.spend && Math.abs(Number(a.spend.daily) - fromInput) > 0.01) problems.push(`${a.id}: the spend line says ${a.spend.daily} a day but the input sets ${fromInput} a day (check the units)`);
    if (a.spend && (!Number.isFinite(a.spend.daily) || a.spend.daily < 0)) problems.push(`${a.id}: spend.daily must be a number in the account currency`);
    const daily = fromInput ?? (Number.isFinite(a.spend?.daily) ? a.spend.daily : 0);
    newDaily += daily;
    if (a.spend && limits?.currency && a.spend.currency !== limits.currency) problems.push(`${a.id}: spend currency ${a.spend.currency} is not ${limits.currency}`);
    if (Number.isFinite(a.spend?.change_pct) && Number.isFinite(limits?.max_change_pct) && a.spend.change_pct > limits.max_change_pct) {
      problems.push(`${a.id}: a ${a.spend.change_pct}% budget rise is over your ${limits.max_change_pct}% step limit (cuts and pauses are fine)`);
    }
  }
  if (Number.isFinite(limits?.max_daily_spend) && newDaily > limits.max_daily_spend) {
    problems.push(`this plan adds ${newDaily} a day, over your cap of ${limits.max_daily_spend} a day`);
  }
  return problems;
}

// Files only the owner may change. Claude proposes a new version as a "file" plan; the owner's
// "yes <code>" writes it. Process files and Claude Code's own settings and agent files are included.
export const PROTECTED_FILES = ["context/limits.json", "context/goals.json", "context/approvers.json", "agent/tools.json", "agent/agents.json",
  ".claude/settings.json", ".claude/settings.local.json",
  "agent/guard.mjs", "agent/actions.mjs", "agent/hooks.mjs", "agent/board.mjs", "agent/spend.mjs", "agent/process.mjs",
  "agent/trace.mjs", "agent/trace-checks.mjs", "agent/transitions.mjs"];
const PROTECTED_PATTERNS = [/(^|\/)processes\/[^/\s"']+\.json$/, /(^|\/)\.claude\/agents\/[^/\s"']+\.md$/];
export const isProtectedFile = file => {
  const f = String(file).replace(/\\/g, "/");
  return PROTECTED_FILES.some(p => f === p || f.endsWith("/" + p)) || PROTECTED_PATTERNS.some(r => r.test(f));
};
const isAbsolute = p => /^([a-zA-Z]:|\/|\\)/.test(String(p ?? ""));
// True when a text (a shell command) names an owner-held file anywhere.
export const mentionsProtected = text => {
  const t = String(text).replace(/\\/g, "/");
  return PROTECTED_FILES.some(p => t.includes(p)) || /(^|[\/\s"'=])processes\/[^/\s"']+\.json/.test(t) || /\.claude\/agents\//.test(t);
};

export function checkFilePlan(plan) {
  const problems = [];
  if (!plan?.purpose || String(plan.purpose).length < 12) problems.push("plan needs a purpose the owner can read");
  const target = String(plan?.target ?? "");
  if (!isProtectedFile(target) || target.includes("..") || isAbsolute(target)) problems.push(`file plans are only for owner-held files, as a path inside the store folder: ${PROTECTED_FILES.join(", ")}, processes/<id>.json, .claude/agents/<name>.md`);
  if (typeof plan?.content !== "string" || !plan.content.length) problems.push("file plan needs the full new content as text");
  else if (target.endsWith(".json")) { try { JSON.parse(plan.content); } catch (e) { problems.push(`the new ${target} is not valid JSON: ${e.message}`); } }
  if (!plan?.say || String(plan.say).length < 8) problems.push("say in plain words what changes in this file");
  return problems;
}

// A standing rule lets one exact kind of write run without a plan, for example posting reports
// to the owner's own private channel. The owner approves standing rules at setup, in tools.json.
export function standingRule(name, toolInput, tools) {
  return (tools.standing ?? []).find(s => baseName(s.tool) === name && s.match && Object.keys(s.match).length
    && Object.entries(s.match).every(([k, v]) => canonical(toolInput?.[k]) === canonical(v)));
}

// The decision for one tool call.
// state = { mode, paused, budget: { ok, why, folder }, plans: {id: plan}, approvals: {id: approval}, runs: {id: run} }
// run = { results: {actionId: {...}}, done: [actionId], failed: [actionId], verified: {actionId: note} }
export function decide(toolName, toolInput, state, tools, now = Date.now()) {
  const name = baseName(toolName);
  if (tools.read?.includes(name)) return { allow: true, why: "read" };
  if (tools.never?.includes(name)) return { allow: false, why: `${name} is never allowed for this agent` };
  if (state.paused) return { allow: false, why: "the owner paused all agent work; only reads run until they say \"resume agent work\"" };
  const standing = standingRule(name, toolInput, tools);
  if (standing && (state.mode !== "scheduled" || standing.scheduled_ok)) return { allow: true, why: `standing rule: ${standing.why ?? "set by the owner"}` };
  const rule = tools.write?.[name];
  if (!rule) return { allow: false, why: `${name} is not on this agent's tool list (agent/tools.json). Ask the owner to add it with a file plan.` };
  if (state.mode === "scheduled") return { allow: false, why: "scheduled runs read and draft only; changes and generation wait for the owner" };
  if (rule.budgeted) {
    return state.budget?.ok ? { allow: true, why: `inside the signed-off budget for ${state.budget.folder}` }
      : { allow: false, why: `${name} spends generation money. ${state.budget?.why ?? "Pick the job's signed-off budget first with: node agent/spend.mjs use <job folder>"}` };
  }
  let near = null; // the closest approved step, to say exactly what differs
  for (const [planId, approval] of Object.entries(state.approvals ?? {})) {
    const plan = state.plans?.[planId];
    if (!plan || plan.kind === "file") continue;
    if (approval.hash !== planHash(plan)) continue; // the list changed after the yes
    if (Number.isFinite(approval.expires_at) && approval.expires_at < now) continue;
    const run = state.runs?.[planId] ?? { results: {}, done: [], failed: [] };
    if (run.failed?.length) continue; // a failed step stops the plan; the owner decides what next
    const next = plan.actions.find(a => !run.done?.includes(a.id));
    if (!next) continue;
    if (baseName(next.tool) !== name) continue;
    const want = samePaths(withoutVolatile(resolve(next.input, run.results), tools)), got = samePaths(withoutVolatile(toolInput, tools));
    if (canonical(want) !== canonical(got)) { near ??= { planId, actionId: next.id, fields: differences(want, got) }; continue; }
    return { allow: true, why: "approved", planId, actionId: next.id };
  }
  if (near) return { allow: false, near: near.planId, why: `${name} is the next step (${near.actionId}) of approved plan ${near.planId}, but the input differs from what the owner approved in: ${near.fields.join(", ")}. Send exactly the approved input (see agent-state/plans/${near.planId}.json), or make a new plan.` };
  return { allow: false, why: `${name} with this input is not the next step of an approved plan. Show the owner a plan and wait for "yes <code>".` };
}

// File paths can arrive as C:\a\b or C:/a/b depending on the app. Treat both as the same path,
// for fields whose name says they hold a path. Nothing else is loosened.
export function samePaths(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, typeof v === "string" && /(^|_)(path|file|dir)/i.test(k)
    ? v.replace(/\\/g, "/").replace(/^([a-z]):/, (m, d) => d.toUpperCase() + ":") : v]));
}

// Top-level field names that differ between two inputs (missing, extra or changed).
export function differences(want, got) {
  const keys = new Set([...Object.keys(want ?? {}), ...Object.keys(got ?? {})]);
  return [...keys].filter(k => canonical(want?.[k]) !== canonical(got?.[k])).sort();
}
