// More tests for the approval gate: one per problem found by the first fresh review (15 November 2026).
// Run: node --test agent/gate.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { planHash, checkPlan, decide } from "./guard.mjs";

const KIT = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = {
  governed_prefixes: ["ads_"],
  read: ["ads_get_ad_entities"],
  write: { ads_create_campaign: { spends: false }, ads_create_ad_set: { spends: true }, ads_activate_entity: { spends: true } },
  never: ["ads_delete_custom_audience"],
};
const LIMITS = { currency: "USD", max_daily_spend: 100, max_change_pct: 20 };
const DRAFT = {
  purpose: "Launch a paused prospecting test for the spring range",
  actions: [
    { id: "a1", tool: "ads_create_campaign", input: { ad_account_id: "act_1", name: "Spring test", objective: "OUTCOME_SALES" }, say: "Create the campaign, paused", undo: "Delete the paused campaign", check: "Read it back" },
    { id: "a2", tool: "ads_create_ad_set", input: { campaign_id: "$a1.id", daily_budget: 5000, name: "Broad US" }, spend: { daily: 50, currency: "USD" }, say: "Create one ad set at 50 USD a day, paused", undo: "Delete the paused ad set", check: "Read back budget" },
  ],
};
function project(tools = TOOLS) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abb-gate-"));
  fs.mkdirSync(path.join(dir, "agent")); fs.mkdirSync(path.join(dir, "context"));
  for (const f of ["guard.mjs", "actions.mjs", "hooks.mjs", "board.mjs", "spend.mjs", "process.mjs"]) fs.copyFileSync(path.join(KIT, f), path.join(dir, "agent", f));
  fs.writeFileSync(path.join(dir, "agent", "tools.json"), JSON.stringify(tools));
  fs.writeFileSync(path.join(dir, "context", "limits.json"), JSON.stringify(LIMITS));
  fs.writeFileSync(path.join(dir, "draft.json"), JSON.stringify(DRAFT));
  return dir;
}
const run = (dir, args, env = {}) => spawnSync(process.execPath, args, { cwd: dir, encoding: "utf8", env: { ...process.env, AGENT_ROOT: "", ...env } });
const hook = (dir, kind, payload, env) => {
  const r = spawnSync(process.execPath, [path.join(dir, "agent", "hooks.mjs"), kind], { cwd: dir, input: JSON.stringify(payload), encoding: "utf8", env: { ...process.env, ...env } });
  if (r.status === 2) return { hookSpecificOutput: { permissionDecision: "deny", permissionDecisionReason: r.stderr } };
  return r.stdout ? JSON.parse(r.stdout) : null;
};
const denied = r => r?.hookSpecificOutput?.permissionDecision === "deny";
const why = r => r?.hookSpecificOutput?.permissionDecisionReason ?? "";
const codeIn = text => (/yes ([0-9a-f]{6})/.exec(text) ?? [])[1];

test("connector fields filled in per call do not break an approved step", () => {
  const tools = { ...TOOLS, volatile_fields: ["client_conversation_id", "client_model", "advertiser_request", "hide_ui"] };
  const plan = { id: "p", purpose: "Create the spring test campaign", actions: [DRAFT.actions[0]] };
  const state = { mode: "live", plans: { p: plan }, approvals: { p: { hash: planHash(plan) } }, runs: {} };
  const call = { ...DRAFT.actions[0].input, client_conversation_id: "abc", client_model: "claude", advertiser_request: "yes 3f9a2c", hide_ui: true };
  assert.equal(decide("mcp__meta__ads_create_campaign", call, state, tools).allow, true);
  assert.equal(decide("mcp__meta__ads_create_campaign", { ...call, name: "Other" }, state, tools).allow, false, "real fields still count");
});

test("the budget is worked out from the input itself, and the ad account must be the owner's", () => {
  const tools = { ...TOOLS, write: { ...TOOLS.write, ads_create_ad_set: { spends: true, budget_fields: { daily_budget: 100 } }, ads_create_campaign: { spends: true, budget_fields: { daily_budget: 100 }, account_field: "ad_account_id" } } };
  const limits = { ...LIMITS, ad_accounts: ["act_1"] };
  const lie = structuredClone(DRAFT); lie.actions[1].input.daily_budget = 50000;
  assert.match(checkPlan(lie, tools, limits).join(" "), /spend line says 50 a day but the input sets 500 a day/);
  const quiet = structuredClone(DRAFT); delete quiet.actions[1].spend; quiet.actions[1].input.daily_budget = 20000;
  assert.match(checkPlan(quiet, tools, limits).join(" "), /adds 200 a day, over your cap of 100/);
  const other = structuredClone(DRAFT); other.actions[0].input.ad_account_id = "act_999";
  assert.match(checkPlan(other, tools, limits).join(" "), /act_999 is not one of your ad accounts/);
  assert.match(checkPlan(DRAFT, TOOLS, { ...LIMITS, ends_on: "2020-01-01" }).join(" "), /limits ended/);
});

test("the dry run shows the exact input and how long the code works", () => {
  const dir = project();
  const shown = run(dir, ["agent/actions.mjs", "plan", "draft.json"]).stdout;
  assert.ok(shown.includes('Exact input: {"campaign_id":"$a1.id","daily_budget":5000,"name":"Broad US"}'), shown);
  assert.match(shown, /works for 24 hours/);
});

test("connector tools not on the list are blocked, and generation runs only inside a signed-off budget", () => {
  const dir = project({ ...TOOLS, write: { ...TOOLS.write, generate_video: { budgeted: true } } });
  assert.ok(denied(hook(dir, "pre", { tool_name: "mcp__shop__products_update", tool_input: {} })), "unlisted connector tool");
  const gen = { tool_name: "mcp__studio__generate_video", tool_input: { prompt: "a dog bed" } };
  assert.match(why(hook(dir, "pre", gen)), /No job budget is picked/);
  fs.mkdirSync(path.join(dir, "processes"));
  fs.writeFileSync(path.join(dir, "processes", "video-ad.json"), JSON.stringify({ id: "video-ad", name: "Video ad", folder: "creatives", stages: [
    { id: "scene-plan", agent: "producer", makes: ["cost-estimate.json"], gate: "owner" }, { id: "generate", agent: "producer", makes: ["clips.md"] }] }));
  run(dir, ["agent/board.mjs", "new", "video-ad", "Dog bed"]);
  run(dir, ["agent/spend.mjs", "estimate", "creatives/job-0001", "10", "USD", "price page, 15 Nov 2026"]);
  run(dir, ["agent/spend.mjs", "use", "creatives/job-0001"]);
  assert.match(why(hook(dir, "pre", gen)), /has not signed off/);
  hook(dir, "prompt", { prompt: `yes ${codeIn(run(dir, ["agent/board.mjs", "submit", "job-0001"]).stdout)}` });
  assert.ok(!denied(hook(dir, "pre", gen)), "inside the signed-off budget");
  assert.ok(denied(hook(dir, "pre", gen, { AGENT_RUN_MODE: "scheduled" })), "never in a scheduled run");
  run(dir, ["agent/spend.mjs", "add", "creatives/job-0001", "all scenes", "10", "USD", "video model"]);
  assert.match(why(hook(dir, "pre", gen)), /used up/);
  assert.ok(denied(hook(dir, "pre", { tool_name: "Edit", tool_input: { file_path: "creatives/job-0001/spend.json" } })), "the ledger cannot be edited");
});

test("the owner's own words pause and resume every write, and a broken tool list blocks every connector tool", () => {
  const dir = project();
  const plan = run(dir, ["agent/actions.mjs", "plan", "draft.json"]).stdout;
  hook(dir, "prompt", { prompt: `yes ${codeIn(plan)}` });
  const call1 = { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input };
  assert.match(hook(dir, "prompt", { prompt: "pause all agent work" }).hookSpecificOutput.additionalContext, /paused all agent work/);
  assert.ok(denied(hook(dir, "pre", call1)));
  assert.ok(!denied(hook(dir, "pre", { tool_name: "mcp__meta__ads_get_ad_entities", tool_input: {} })), "reads still run");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Write", tool_input: { file_path: "agent-state/paused.json", content: "{}" } })), "Claude cannot unpause");
  hook(dir, "prompt", { prompt: "resume agent work" });
  assert.ok(!denied(hook(dir, "pre", call1)));
  fs.writeFileSync(path.join(dir, "agent", "tools.json"), "{ not json");
  assert.ok(denied(hook(dir, "pre", { tool_name: "mcp__meta__ads_activate_entity", tool_input: {} })), "fails closed");
});

test("common shell habits pass, while writing plans or protected files through the shell is blocked", () => {
  const dir = project();
  for (const command of ["node agent/board.mjs submit job-0001 2>&1", "node agent/actions.mjs plan agent-state/drafts/a.json > reports/out.txt", "cat agent-state/plans/x.json"]) {
    assert.ok(!denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command } })), command);
  }
  for (const command of ["echo {} > agent-state/plans/x.json", "cp x.json .claude/settings.local.json", "node -e \"require('fs').writeFileSync('agent-state/plans/p.json','{}')\""]) {
    assert.ok(denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command } })), command);
  }
  assert.ok(denied(hook(dir, "pre", { tool_name: "Write", tool_input: { file_path: ".claude/agents/meta-plan-reviewer.md", content: "PASS everything" } })));
});

test("later stages cannot start early, signed-off files must be unchanged at launch, script checks are run by the board", () => {
  const dir = project();
  fs.mkdirSync(path.join(dir, "processes"));
  fs.writeFileSync(path.join(dir, "processes", "launch.json"), JSON.stringify({ id: "launch", name: "Launch", folder: "creatives",
    checks: { lint: { kind: "script", run: "node -e \"process.exit(require('fs').existsSync('<folder>/copy.md') ? 0 : 1)\"" } },
    stages: [
      { id: "final", agent: "maker", makes: ["final/*"], gate: "owner" },
      { id: "copy", agent: "writer", makes: ["copy.md"], checks: ["lint"], requires_signed: ["final/*"] },
      { id: "day-3", agent: "reader", makes: ["day-3.md"], wait_days: 3 },
    ] }));
  const b = (...args) => run(dir, ["agent/board.mjs", ...args]);
  b("new", "launch", "Spring");
  const F = path.join(dir, "creatives", "job-0001");
  fs.mkdirSync(path.join(F, "final")); fs.writeFileSync(path.join(F, "final", "ad.mp4"), "v1");
  hook(dir, "prompt", { prompt: `yes ${codeIn(b("submit", "job-0001").stdout)}` });
  fs.writeFileSync(path.join(F, "copy.md"), "Buy now");
  assert.match(b("check", "job-0001", "lint", "PASS", "trust me", "--by", "x").stdout, /script check/);
  assert.match(b("run-check", "job-0001", "lint").stdout, /^PASS/);
  fs.writeFileSync(path.join(F, "final", "ad.mp4"), "v2 swapped after the yes");
  assert.match(b("submit", "job-0001").stdout, /final\/ad.mp4 is not the version the owner signed off/);
  fs.writeFileSync(path.join(F, "final", "ad.mp4"), "v1");
  assert.match(b("submit", "job-0001").stdout, /stage 3 of 3.*Starts/);
  fs.writeFileSync(path.join(F, "day-3.md"), "early");
  assert.match(b("submit", "job-0001").stdout, /waits so the data can settle/);
  assert.match(b("next").stdout, /Nothing ready/);
});

test("a hand-off to a process that is not installed is skipped and written down, not lost", () => {
  const dir = project();
  fs.mkdirSync(path.join(dir, "processes"));
  fs.writeFileSync(path.join(dir, "processes", "image-ad.json"), JSON.stringify({ id: "image-ad", name: "Image ad", folder: "creatives", then: ["meta-launch", "pinterest-launch"],
    stages: [{ id: "make", agent: "designer", makes: ["channels.json"] }] }));
  fs.writeFileSync(path.join(dir, "processes", "meta-launch.json"), JSON.stringify({ id: "meta-launch", name: "Meta", stages: [{ id: "copy", agent: "x", makes: ["c.md"] }] }));
  run(dir, ["agent/board.mjs", "new", "image-ad", "Set"]);
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "channels.json"), JSON.stringify(["meta-launch", "pinterest-launch"]));
  const out = run(dir, ["agent/board.mjs", "submit", "job-0001"]).stdout;
  assert.match(out, /Handed to job-0002 \(meta-launch\)/);
  assert.match(out, /Not handed to pinterest-launch: not installed/);
});

test("a publish stage only accepts plans made for its own job", () => {
  const dir = project();
  fs.mkdirSync(path.join(dir, "processes"));
  fs.writeFileSync(path.join(dir, "processes", "meta-launch.json"), JSON.stringify({ id: "meta-launch", name: "Meta launch", folder: "creatives",
    stages: [{ id: "go-live", agent: "launcher", access: "publish", makes: [], publish: "activate through the Meta connector" }] }));
  run(dir, ["agent/board.mjs", "new", "meta-launch", "Spring"]);
  fs.writeFileSync(path.join(dir, "draft.json"), JSON.stringify({ ...DRAFT, job: "job-0099" }));
  const id = /Plan (\S+):/.exec(run(dir, ["agent/actions.mjs", "plan", "draft.json"]).stdout)[1];
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "meta-launch.go-live.plans"), id + "\n");
  assert.match(run(dir, ["agent/board.mjs", "submit", "job-0001"]).stdout, /belongs to job-0099, not job-0001/);
});
