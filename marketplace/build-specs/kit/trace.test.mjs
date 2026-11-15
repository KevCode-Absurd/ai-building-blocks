// Tests for the trace, the trace checks and the failure table. Run: node --test agent/trace.test.mjs
// Each flow test builds a throwaway store folder and drives the real hook scripts the way Claude Code does.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { checkTrace } from "./trace-checks.mjs";
import { firstFailures, matrix, toMarkdown } from "./transitions.mjs";
import { claimsIn, entitiesIn, argsHash } from "./trace.mjs";
import { validate } from "./process.mjs";

const KIT = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = {
  governed_prefixes: ["ads_"],
  read: ["ads_get_ad_entities"],
  write: {
    ads_create_campaign: { spends: false, readback_status: "PAUSED" },
    ads_create_ad_set: { spends: true, budget_fields: { daily_budget: 100 }, readback_status: "PAUSED" },
    ads_activate_entity: { spends: true, readback_status: ["ACTIVE", "IN_PROCESS"] },
  },
  never: ["ads_delete_custom_audience"],
};
const LIMITS = { currency: "USD", max_daily_spend: 100, max_change_pct: 20 };
const DRAFT = {
  purpose: "Build the spring test as paused drafts",
  job: "job-0001",
  actions: [
    { id: "a1", tool: "ads_create_campaign", input: { ad_account_id: "act_1", name: "Spring [job-0001]", status: "PAUSED" }, say: "Create the campaign, paused", undo: "Delete the paused campaign", check: "Read it back" },
    { id: "a2", tool: "ads_create_ad_set", input: { campaign_id: "$a1.id", daily_budget: 5000, name: "Broad [job-0001]", status: "PAUSED" }, spend: { daily: 50, currency: "USD" }, say: "Create one ad set at 50 USD a day, paused", undo: "Delete the paused ad set", check: "Read back budget" },
  ],
};
const LAUNCH = { id: "launch", name: "Launch test", folder: "creatives", stages: [
  { id: "pack", agent: "producer", makes: ["pack.md"], checks: ["pack-review"], gate: "owner" },
  { id: "build", agent: "deployer", access: "publish", makes: [], publish: "paused drafts through the Meta connector" },
], checks: { "pack-review": { kind: "reviewer", agent: "orchestrator", passes_when: "every ad has its file and copy" } } };

function project(tools = TOOLS) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abb-trace-"));
  for (const d of ["agent", "context", "processes"]) fs.mkdirSync(path.join(dir, d));
  for (const f of ["guard.mjs", "actions.mjs", "hooks.mjs", "board.mjs", "spend.mjs", "process.mjs", "trace.mjs", "trace-checks.mjs", "transitions.mjs"]) fs.copyFileSync(path.join(KIT, f), path.join(dir, "agent", f));
  fs.writeFileSync(path.join(dir, "agent", "tools.json"), JSON.stringify(tools));
  fs.writeFileSync(path.join(dir, "context", "limits.json"), JSON.stringify(LIMITS));
  fs.writeFileSync(path.join(dir, "processes", "launch.json"), JSON.stringify(LAUNCH));
  fs.writeFileSync(path.join(dir, "draft.json"), JSON.stringify(DRAFT));
  return dir;
}
const env = { AGENT_ROOT: "", AGENT_STATE_DIR: "", AGENT_BOARD_DIR: "", AGENT_RUN_MODE: "", AGENT_SIMULATED_OWNER: "" };
const run = (dir, args, extra = {}) => spawnSync(process.execPath, args, { cwd: dir, encoding: "utf8", env: { ...process.env, ...env, ...extra } });
const hook = (dir, kind, payload, extra = {}) => {
  const r = spawnSync(process.execPath, [path.join(dir, "agent", "hooks.mjs"), kind], { cwd: dir, input: JSON.stringify(payload), encoding: "utf8", env: { ...process.env, ...env, ...extra } });
  if (r.status === 2) return { hookSpecificOutput: { permissionDecision: "deny", permissionDecisionReason: r.stderr } };
  return r.stdout ? JSON.parse(r.stdout) : null;
};
const denied = r => r?.hookSpecificOutput?.permissionDecision === "deny";
const rows = dir => fs.readFileSync(path.join(dir, "agent-state", "trace.jsonl"), "utf8").trim().split("\n").map(l => JSON.parse(l));
const codeIn = text => (/yes ([0-9a-f]{6})/.exec(text) ?? [])[1];
const mcp = obj => ({ content: [{ type: "text", text: JSON.stringify(obj) }] });

// Moves a launch job to its build stage: pack made, reviewed, signed off by the owner.
function toBuild(dir, extra = {}) {
  run(dir, ["agent/board.mjs", "new", "launch", "Spring"]);
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "pack.md"), "Ad 1: video, copy, link");
  run(dir, ["agent/board.mjs", "check", "job-0001", "pack-review", "PASS", "complete", "--by", "orchestrator"]);
  const code = codeIn(run(dir, ["agent/board.mjs", "submit", "job-0001"]).stdout);
  hook(dir, "prompt", { prompt: `yes ${code}` }, extra);
}

test("a whole job leaves one ordered trace, and every rule holds on it", () => {
  const dir = project();
  toBuild(dir, { AGENT_SIMULATED_OWNER: "1" });
  const shown = run(dir, ["agent/actions.mjs", "plan", "draft.json"]).stdout;
  const call1 = { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input, tool_use_id: "t1" };
  assert.ok(denied(hook(dir, "pre", call1)), "blocked before the yes");
  hook(dir, "prompt", { prompt: `yes ${codeIn(shown)}` }, { AGENT_SIMULATED_OWNER: "1" });
  assert.ok(!denied(hook(dir, "pre", call1)));
  hook(dir, "post", { ...call1, tool_response: mcp({ id: "1201" }) });
  const call2 = { tool_name: "mcp__meta__ads_create_ad_set", tool_input: { campaign_id: "1201", daily_budget: 5000, name: "Broad [job-0001]", status: "PAUSED" }, tool_use_id: "t2" };
  assert.ok(!denied(hook(dir, "pre", call2)));
  hook(dir, "post", { ...call2, tool_response: mcp({ id: "1202" }) });
  const read = { tool_name: "mcp__meta__ads_get_ad_entities", tool_input: { ids: ["1201", "1202"] }, tool_use_id: "t3" };
  hook(dir, "pre", read);
  hook(dir, "post", { ...read, tool_response: mcp({ data: [{ id: "1201", name: "Spring [job-0001]", status: "PAUSED" }, { id: "1202", name: "Broad [job-0001]", status: "PAUSED", daily_budget: "5000" }] }) });
  const planId = /Plan (\S+):/.exec(shown)[1];
  for (const a of ["a1", "a2"]) assert.equal(run(dir, ["agent/actions.mjs", "verify", planId, a, "paused, budget 50 a day"]).status, 0);
  hook(dir, "stop", { last_assistant_message: "Both drafts are built and read back as paused: campaign 1201 and ad set 1202. It is done. Nothing is live yet." });

  const t = rows(dir);
  assert.deepEqual(t.map(r => r.seq), t.map((_, i) => i + 1), "seq counts up from 1 with no gaps");
  const kinds = t.map(r => r.kind);
  for (const k of ["stage_start", "check", "signoff_shown", "signoff_given", "plan_proposed", "approved", "tool_call", "tool_result", "readback", "owner_message"]) assert.ok(kinds.includes(k), k);
  const given = t.find(r => r.kind === "signoff_given"), approved = t.find(r => r.kind === "approved");
  assert.equal(given.simulated, true); assert.equal(approved.simulated, true, "the simulated owner is tagged");
  assert.ok(given.files["pack.md"], "the sign-off carries file hashes");
  const calls = t.filter(r => r.kind === "tool_call");
  assert.equal(calls[0].decision, "deny"); assert.equal(calls[0].job, "job-0001", "a blocked call is tied to its job by the name tag");
  assert.equal(calls[1].plan, planId); assert.equal(calls[1].job, "job-0001"); assert.equal(calls[1].stage, "build");
  assert.equal(t.find(r => r.kind === "tool_result" && r.class === "read").entities.length, 2);
  assert.ok(t.filter(r => r.kind === "readback").every(r => r.match === true));
  const msg = t.find(r => r.kind === "owner_message");
  assert.equal(msg.claims.done, true); assert.equal(msg.claims.live, false, "\"nothing is live yet\" is not a claim");

  const result = checkTrace(t, { tools: TOOLS, processes: { launch: LAUNCH } });
  assert.ok(result.safety_ok, JSON.stringify(result.checks.filter(c => !c.ok)));
  assert.ok(result.step_ok);
  assert.equal(result.checks.find(c => c.id === "no_unapproved_attempts").problems.length, 1, "the early try is noted");
  const cli = run(dir, ["agent/trace-checks.mjs"]);
  assert.equal(cli.status, 0, cli.stdout);
  assert.match(run(dir, ["agent/transitions.mjs"]).stdout, /## launch[\s\S]*build: plan shown \| 1/);
});

test("a read back that does not match the plan is refused and written down", () => {
  const dir = project();
  toBuild(dir);
  const shown = run(dir, ["agent/actions.mjs", "plan", "draft.json"]).stdout, planId = /Plan (\S+):/.exec(shown)[1];
  hook(dir, "prompt", { prompt: `yes ${codeIn(shown)}` });
  const call1 = { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input };
  hook(dir, "pre", call1); hook(dir, "post", { ...call1, tool_response: mcp({ id: "1201" }) });
  const nothing = run(dir, ["agent/actions.mjs", "verify", planId, "a1", "looked fine"]);
  assert.notEqual(nothing.status, 0, "no read of the object means nothing to check");
  assert.match(nothing.stdout, /1201 was not read back/);
  hook(dir, "post", { tool_name: "mcp__meta__ads_get_ad_entities", tool_input: {}, tool_response: mcp([{ id: "1201", name: "Spring [job-0001]", status: "ACTIVE" }]) });
  const wrong = run(dir, ["agent/actions.mjs", "verify", planId, "a1", "looked fine"]);
  assert.notEqual(wrong.status, 0);
  assert.match(wrong.stdout, /reads back as ACTIVE, not PAUSED[\s\S]*Do not say it is done or live/);
  hook(dir, "stop", { last_assistant_message: "The campaign is done." });
  const result = checkTrace(rows(dir), { tools: TOOLS });
  assert.equal(result.checks.find(c => c.id === "readback_matches_plan").ok, false);
  assert.equal(result.checks.find(c => c.id === "no_early_done_message").ok, false, "done before a good read back");
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, "agent-state", "runs", `${planId}.json`), "utf8")).verified?.a1, undefined, "not marked checked");
});

test("an MCP error inside a normal response stops the plan, and the trace shows the failed step", () => {
  const dir = project();
  toBuild(dir);
  hook(dir, "prompt", { prompt: `yes ${codeIn(run(dir, ["agent/actions.mjs", "plan", "draft.json"]).stdout)}` });
  const call1 = { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input, tool_use_id: "t1" };
  hook(dir, "pre", call1);
  const r = hook(dir, "post", { ...call1, tool_response: { isError: true, content: [{ type: "text", text: "Rate limit reached (code 17)" }] } });
  assert.match(r.hookSpecificOutput.additionalContext, /Do not retry/);
  assert.equal(r.hookSpecificOutput.hookEventName, "PostToolUse");
  assert.ok(denied(hook(dir, "pre", { ...call1, tool_use_id: "t2" })), "the gate blocks the retry");
  const t = rows(dir), failed = t.find(x => x.kind === "tool_result");
  assert.equal(failed.ok, false); assert.match(failed.error, /Rate limit/);
  assert.equal(checkTrace(t, { tools: TOOLS }).checks.find(c => c.id === "no_retry_after_error").ok, false, "trying again counts, even when blocked");
  assert.match(run(dir, ["agent/transitions.mjs"]).stdout, /build: plan approved \| 1/);
});

test("the owner's change request at a sign-off is recorded with their words, and the old code stops working", () => {
  const dir = project();
  run(dir, ["agent/board.mjs", "new", "launch", "Spring"]);
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "pack.md"), "Ad 1");
  run(dir, ["agent/board.mjs", "check", "job-0001", "pack-review", "PASS", "complete", "--by", "orchestrator"]);
  const code = codeIn(run(dir, ["agent/board.mjs", "submit", "job-0001"]).stdout);
  hook(dir, "prompt", { prompt: "ok" });
  assert.equal(rows(dir).filter(r => r.kind === "changes_requested").length, 0, "a plain reply is not a change request");
  const r = hook(dir, "prompt", { prompt: "Change the headline to lead with the free returns" });
  assert.match(r.hookSpecificOutput.additionalContext, /asked for changes to stage pack of job-0001/);
  const ch = rows(dir).find(x => x.kind === "changes_requested");
  assert.equal(ch.reason, "Change the headline to lead with the free returns"); assert.equal(ch.stage, "pack");
  const card = JSON.parse(fs.readFileSync(path.join(dir, "board", "job-0001.json"), "utf8"));
  assert.equal(card.status, "in_progress"); assert.match(card.history.at(-1).event, /owner asked for changes/);
  hook(dir, "prompt", { prompt: `yes ${code}` });
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, "board", "job-0001.json"), "utf8")).stage, "pack", "the old code signs off nothing");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "node -e \"import('./agent/board.mjs').then(m=>m.requestChanges('no'))\"" } })), "Claude cannot fake the owner's words");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Write", tool_input: { file_path: "agent-state/trace.jsonl", content: "{}" } })), "the trace cannot be edited");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "echo {} >> agent-state/trace.jsonl" } })));
  assert.match(run(dir, ["agent/transitions.mjs"]).stdout, /pack: shown to owner \| 1/);
});

test("a change request with no job waiting is written against the plan that waits", () => {
  const dir = project();
  run(dir, ["agent/actions.mjs", "plan", "draft.json"]);
  hook(dir, "prompt", { prompt: "Lower the budget to 30 a day" });
  const ch = rows(dir).find(x => x.kind === "changes_requested");
  assert.ok(ch.plan); assert.equal(ch.job, "job-0001");
});

test("a job can be blocked with a reason from the list, shows it on the board, and carries on when unblocked", () => {
  const dir = project();
  run(dir, ["agent/board.mjs", "new", "launch", "Spring"]);
  assert.match(run(dir, ["agent/board.mjs", "block", "job-0001", "broken", "x"]).stdout, /reason must be one of/);
  const out = run(dir, ["agent/board.mjs", "block", "job-0001", "tracking_broken", "No purchase events in 7 days", "--by", "media-buyer"]).stdout;
  assert.match(out, /Blocked \(tracking_broken\): No purchase events in 7 days/);
  assert.match(run(dir, ["agent/board.mjs", "submit", "job-0001"]).stdout, /is blocked, not in progress/);
  assert.match(run(dir, ["agent/board.mjs", "next"]).stdout, /Nothing ready/);
  const b = rows(dir).find(r => r.kind === "blocked");
  assert.equal(b.reason, "tracking_broken"); assert.equal(b.agent, "media-buyer"); assert.equal(b.stage, "pack");
  assert.match(run(dir, ["agent/board.mjs", "unblock", "job-0001", "Owner fixed the pixel"]).stdout, /stage 1 of 2/);
  assert.equal(rows(dir).at(-1).resumed, true);
  assert.match(run(dir, ["agent/transitions.mjs"]).stdout, /pack: started \| 1/);
  const proc = { ...LAUNCH, id: "launch", goal: "Signed-off ads go live with a cap you approved.", stages: LAUNCH.stages.map(s => ({ ...s, say: "Does this stage of the launch.", done_when: "The stage files exist." })) };
  proc.stages[0].blocked_when = { tracking_broken: "the pixel shows no purchase events this week" };
  assert.ok(!validate({ ...proc, kind: "continuation" }).some(p => /blocked_when/.test(p)));
  proc.stages[0].blocked_when = { gone_fishing: "the buyer is away for a while" };
  assert.ok(validate({ ...proc, kind: "continuation" }).some(p => /gone_fishing is not one of/.test(p)));
});

test("a scheduled run's write tries and never-list tools are caught", () => {
  const dir = project();
  hook(dir, "pre", { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input }, { AGENT_RUN_MODE: "scheduled" });
  hook(dir, "pre", { tool_name: "mcp__meta__ads_delete_custom_audience", tool_input: { id: "1" } });
  const res = checkTrace(rows(dir), { tools: TOOLS });
  assert.equal(res.checks.find(c => c.id === "no_scheduled_writes").ok, false);
  assert.equal(res.checks.find(c => c.id === "no_never_tools").ok, false);
  assert.equal(res.safety_ok, false);
});

// Hand-made traces: one row list per broken rule, each of which a passing trace must not show.
const R = (seq, kind, f = {}) => ({ seq, ts: new Date(Date.UTC(2026, 10, 16, 0, 0, seq)).toISOString(), job: "job-0001", parent: null, stage: "build", agent: "deployer", kind, note: "", ...f });
const PLAN = { plan: "p1", hash: "h1", code: "abc123", actions: [{ id: "a1", tool: "ads_create_campaign", input: { name: "A", status: "PAUSED" } }, { id: "a2", tool: "ads_activate_entity", input: { ids: ["$a1.id"] } }] };
const H = input => argsHash(input);
const good = () => [
  R(1, "stage_start", { process: "launch", stage: "pack", agent: "producer" }),
  R(2, "check", { stage: "pack", check: "pack-review", verdict: "PASS", by: "orchestrator", maker: "producer" }),
  R(3, "signoff_shown", { stage: "pack", code: "s1" }),
  R(4, "signoff_given", { stage: "pack", code: "s1", by: "owner" }),
  R(5, "stage_start", { process: "launch", stage: "build" }),
  R(6, "plan_proposed", PLAN),
  R(7, "approved", { plan: "p1", hash: "h1", code: "abc123", by: "owner" }),
  R(8, "tool_call", { tool: "ads_create_campaign", class: "write", decision: "allow", plan: "p1", action: "a1", args_hash: H({ name: "A", status: "PAUSED" }), mode: "live", tool_use_id: "u1" }),
  R(9, "tool_result", { tool: "ads_create_campaign", class: "write", ok: true, ids: { id: "77" }, plan: "p1", action: "a1", tool_use_id: "u1" }),
  R(10, "tool_call", { tool: "ads_activate_entity", class: "write", decision: "allow", plan: "p1", action: "a2", args_hash: H({ ids: ["77"] }), mode: "live", tool_use_id: "u2" }),
  R(11, "tool_result", { tool: "ads_activate_entity", class: "write", ok: true, ids: {}, plan: "p1", action: "a2", tool_use_id: "u2" }),
  R(12, "tool_result", { tool: "ads_get_ad_entities", class: "read", ok: true, entities: [{ id: "77", status: "ACTIVE" }] }),
  R(13, "readback", { plan: "p1", action: "a1", match: true, observed: { 77: { id: "77", status: "PAUSED" } } }),
  R(14, "readback", { plan: "p1", action: "a2", match: true, observed: { 77: { id: "77", status: "ACTIVE" } } }),
  R(15, "owner_message", { claims: claimsIn("Campaign 77 is live."), text: "Campaign 77 is live." }),
];
const TOOLS2 = { never: ["ads_creative_delete"], write: { ads_create_campaign: { readback_status: "PAUSED" }, ads_activate_entity: { readback_status: ["ACTIVE"] } } };
const PROCS = { launch: { id: "launch", stages: [{ id: "pack", gate: "owner" }, { id: "build" }] } };
const failing = rows => checkTrace(rows, { tools: TOOLS2, processes: PROCS }).checks.filter(c => !c.ok && c.severity !== "discipline").map(c => c.id);

test("trace checks pass a good trace and name exactly the rule each broken trace breaks", () => {
  assert.deepEqual(failing(good()), []);
  const cases = {
    write_has_approval: t => { t.splice(6, 1); },
    "write_has_approval ": t => { t[7].args_hash = H({ name: "B", status: "PAUSED" }); },
    step_runs_once: t => { t.splice(9, 0, R(9.5, "tool_result", { tool: "ads_create_campaign", class: "write", ok: true, ids: { id: "78" }, plan: "p1", action: "a1" })); },
    no_retry_after_error: t => { t[8] = R(9, "tool_result", { tool: "ads_create_campaign", class: "write", ok: false, error: "rate limit", plan: "p1", action: "a1", tool_use_id: "u1" });
      t.splice(9); t.push(R(10, "tool_call", { tool: "ads_create_campaign", class: "write", decision: "deny", plan: null, args_hash: H({ name: "A", status: "PAUSED" }), mode: "live" })); },
    no_never_tools: t => { t.push(R(16, "tool_call", { tool: "ads_creative_delete", class: "never", decision: "deny", mode: "live" })); },
    no_scheduled_writes: t => { t.push(R(16, "tool_call", { tool: "ads_create_campaign", class: "write", decision: "deny", mode: "scheduled" })); },
    no_early_done_message: t => { const m = t.pop(); t.splice(11, 0, { ...m, seq: 11.5 }); },
    reviewer_not_maker: t => { t[1].by = "producer"; },
    signoffs_in_order: t => { t[3].code = "zz9999"; },
    readback_matches_plan: t => { t[12] = R(13, "readback", { plan: "p1", action: "a1", match: true, observed: { 77: { id: "77", status: "ACTIVE" } } }); },
  };
  for (const [name, breakIt] of Object.entries(cases)) {
    const t = good(); breakIt(t);
    const got = failing(t);
    assert.ok(got.includes(name.trim()), `${name}: got ${got.join(", ")}`);
  }
  const live = good(); live.splice(9, 2); live.at(-2).observed = {}; live.splice(live.length - 2, 1);
  assert.ok(failing(live).includes("no_early_done_message"), "told live with nothing switched on");
  const jump = good(); jump[4].stage = "ship";
  assert.ok(failing(jump).includes("signoffs_in_order"), "a stage that is not next");
});

test("carrying on with a plan after a failed step counts as a retry", () => {
  const t = good().slice(0, 8);
  t.push(R(9, "tool_result", { tool: "ads_create_campaign", class: "write", ok: false, error: "server error", plan: "p1", action: "a1", tool_use_id: "u1" }));
  assert.deepEqual(failing(t).filter(x => x !== "readback_matches_plan"), []);
  const p = { ...PLAN, actions: [PLAN.actions[0], { id: "a2", tool: "ads_create_ad_set", input: { name: "S" } }] };
  t[5] = R(6, "plan_proposed", p);
  t.push(R(10, "tool_call", { tool: "ads_create_ad_set", class: "write", decision: "deny", plan: null, args_hash: H({ name: "S" }), mode: "live" }));
  assert.ok(failing(t).includes("no_retry_after_error"));
});

test("the failure table counts only the first failure of each job, per process", () => {
  const rowsIn = [
    R(1, "stage_start", { job: "job-0001", process: "launch", stage: "pack" }),
    R(2, "check", { job: "job-0001", stage: "pack", check: "pack-review", verdict: "FIX", by: "orchestrator", check_kind: "reviewer" }),
    R(3, "changes_requested", { job: "job-0001", stage: "pack", reason: "shorter" }),
    R(4, "stage_start", { job: "job-0002", process: "launch", stage: "pack" }),
    R(5, "check", { job: "job-0002", stage: "pack", check: "pack-review", verdict: "PASS", by: "orchestrator" }),
    R(6, "check", { job: "job-0002", stage: "pack", check: "lint", verdict: "FIX", by: "script", check_kind: "script" }),
    R(7, "stage_start", { job: "job-0003", process: "launch", stage: "pack" }),
    R(8, "stage_start", { job: "job-0004", process: "results", stage: "act" }),
    R(9, "plan_proposed", { job: "job-0004", stage: "act", plan: "p9", actions: [] }),
    R(10, "approved", { job: "job-0004", stage: "act", plan: "p9" }),
    R(11, "tool_result", { job: "job-0004", stage: "act", tool: "ads_update_entity", class: "write", ok: false, error: "Ad was disapproved for policy" }),
    R(12, "stage_start", { job: "job-0005", process: "results", stage: "act" }),
    R(13, "blocked", { job: "job-0005", stage: "act", reason: "out_of_limits" }),
    R(14, "stage_start", { job: "job-0006", process: "results", stage: "act" }),
    R(15, "readback", { job: "job-0006", stage: "act", plan: "p8", match: false, mismatches: ["budget 9000, not 6000"] }),
  ];
  const e = firstFailures(rowsIn);
  assert.equal(e.find(x => x.job === "job-0001").failure, "reviewer_fix", "the change request after it is not counted");
  assert.equal(e.find(x => x.job === "job-0002").last_ok, "pack: pack-review passed");
  assert.equal(e.find(x => x.job === "job-0003").failure, null);
  assert.equal(e.find(x => x.job === "job-0004").failure, "platform_rejection");
  assert.equal(e.find(x => x.job === "job-0005").failure, "over_budget");
  assert.equal(e.find(x => x.job === "job-0006").failure, "readback_mismatch");
  const m = matrix(e);
  assert.deepEqual(m.launch.cells, { "pack: started": { "pack: reviewer_fix": 1 }, "pack: pack-review passed": { "pack: script_fix": 1 } });
  assert.equal(m.launch.jobs, 3); assert.equal(m.launch.failed, 2);
  assert.deepEqual(m.results.cells["act: plan approved"], { "act: platform_rejection": 1 });
  const md = toMarkdown(m);
  assert.match(md, /## launch\n\n3 jobs, 2 with a failure\./);
  assert.match(md, /\| Last good state \| pack: reviewer_fix \| pack: script_fix \| Total \|/);
  assert.doesNotMatch(md, /[–—]/, "no em or en dashes");

  const dir = project();
  fs.mkdirSync(path.join(dir, "agent-state"));
  fs.writeFileSync(path.join(dir, "agent-state", "trace.jsonl"), rowsIn.map(r => JSON.stringify(r)).join("\n") + "\n");
  run(dir, ["agent/transitions.mjs", "agent-state/trace.jsonl", "--out", "jobs/t.md"]);
  assert.equal(run(dir, ["agent/transitions.mjs", "agent-state/trace.jsonl", "--check", "jobs/t.md"]).status, 0);
  fs.appendFileSync(path.join(dir, "jobs", "t.md"), "| typed by hand | 9 |\n");
  assert.equal(run(dir, ["agent/transitions.mjs", "agent-state/trace.jsonl", "--check", "jobs/t.md"]).status, 1, "a table that does not match the trace fails");
});

test("claims and entities are read from text and responses", () => {
  assert.deepEqual(claimsIn("Nothing is live yet. Reply yes 3f9a2c to switch it on."), { done: false, live: false, ids: [] });
  assert.equal(claimsIn("Ad 120210000000001 is live and spending.").live, true);
  assert.deepEqual(claimsIn("Ad 120210000000001 is live.").ids, ["120210000000001"]);
  assert.equal(claimsIn("I have not finished: step 2 failed.").done, false);
  assert.deepEqual(entitiesIn(mcp({ data: [{ id: 5, status: "PAUSED", other: 1 }, { id: "6" }] })), [{ id: "5", status: "PAUSED" }]);
});
