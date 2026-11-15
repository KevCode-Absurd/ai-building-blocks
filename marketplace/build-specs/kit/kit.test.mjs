// Tests for the approval gate. Run: node --test build-specs/kit/kit.test.mjs
// Each test builds a throwaway agent project, then drives the real hook scripts the way Claude Code does.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseYes, planHash, checkPlan, decide, resolve, canonical } from "./guard.mjs";

const KIT = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = {
  governed_prefixes: ["ads_"],
  read: ["ads_get_ad_entities", "ads_get_ad_accounts"],
  write: { ads_create_campaign: { spends: false }, ads_create_ad_set: { spends: true }, ads_activate_entity: { spends: true }, ads_update_entity: { spends: true } },
  never: ["ads_delete_custom_audience"],
};
const LIMITS = { currency: "USD", max_daily_spend: 100, max_change_pct: 20 };
const DRAFT = {
  purpose: "Launch a paused prospecting test for the spring range",
  actions: [
    { id: "a1", tool: "ads_create_campaign", input: { ad_account_id: "act_1", name: "Spring test", objective: "OUTCOME_SALES" }, say: "Create the campaign, paused", undo: "Delete the paused campaign", check: "Read it back: paused, right name" },
    { id: "a2", tool: "ads_create_ad_set", input: { campaign_id: "$a1.id", daily_budget: 5000, name: "Broad US" }, spend: { daily: 50, currency: "USD" }, say: "Create one ad set at 50 USD a day, paused", undo: "Delete the paused ad set", check: "Read back budget 50 USD and paused" },
  ],
};

function project() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abb-agent-"));
  fs.mkdirSync(path.join(dir, "agent")); fs.mkdirSync(path.join(dir, "context"));
  for (const f of ["guard.mjs", "actions.mjs", "hooks.mjs", "board.mjs", "spend.mjs", "process.mjs", "trace.mjs"]) fs.copyFileSync(path.join(KIT, f), path.join(dir, "agent", f));
  fs.writeFileSync(path.join(dir, "agent", "tools.json"), JSON.stringify(TOOLS));
  fs.writeFileSync(path.join(dir, "context", "limits.json"), JSON.stringify(LIMITS));
  fs.writeFileSync(path.join(dir, "draft.json"), JSON.stringify(DRAFT));
  return dir;
}
const run = (dir, args, env = {}) => spawnSync(process.execPath, args, { cwd: dir, encoding: "utf8", env: { ...process.env, AGENT_ROOT: "", ...env } });
const hook = (dir, kind, payload, env) => { const r = spawnSync(process.execPath, [path.join(dir, "agent", "hooks.mjs"), kind], { cwd: dir, input: JSON.stringify(payload), encoding: "utf8", env: { ...process.env, ...env } });
  // Exit code 2 is how a hook blocks a call when it could not decide (the gate fails closed).
  if (r.status === 2) return { hookSpecificOutput: { permissionDecision: "deny", permissionDecisionReason: r.stderr } };
  return r.stdout ? JSON.parse(r.stdout) : null; };
const denied = r => r?.hookSpecificOutput?.permissionDecision === "deny";
const codeOf = dir => JSON.parse(fs.readFileSync(path.join(dir, "agent-state", "plans", fs.readdirSync(path.join(dir, "agent-state", "plans"))[0]), "utf8")).code;

test("only 'yes' plus the six-character code counts as approval", () => {
  assert.equal(parseYes("yes 3f9a2c"), "3f9a2c");
  assert.equal(parseYes("Yes, 3F9A2C go ahead"), "3f9a2c");
  for (const t of ["yes", "ok 3f9a2c", "sounds good", "no 3f9a2c", "I said yes 3f9a2c yesterday"]) assert.equal(parseYes(t), null, t);
});

test("a plan over the cap, off the tool list, or missing undo is refused before the owner sees it", () => {
  assert.deepEqual(checkPlan(DRAFT, TOOLS, LIMITS), []);
  const big = structuredClone(DRAFT); big.actions[1].spend.daily = 150;
  assert.match(checkPlan(big, TOOLS, LIMITS).join(" "), /over your cap/);
  const off = structuredClone(DRAFT); off.actions[0].tool = "ads_delete_custom_audience";
  assert.match(checkPlan(off, TOOLS, LIMITS).join(" "), /never allowed/);
  const noUndo = structuredClone(DRAFT); delete noUndo.actions[0].undo;
  assert.match(checkPlan(noUndo, TOOLS, LIMITS).join(" "), /undo/);
  assert.match(checkPlan(DRAFT, { ...TOOLS, require_review: true }, LIMITS).join(" "), /reviewer/);
  assert.deepEqual(checkPlan({ ...DRAFT, review: { verdict: "PASS", by: "meta-plan-reviewer" } }, { ...TOOLS, require_review: true }, LIMITS), []);
  const jump = structuredClone(DRAFT); jump.actions[1].spend.change_pct = 35;
  assert.match(checkPlan(jump, TOOLS, LIMITS).join(" "), /step limit/);
});

test("ids from earlier steps fill later inputs", () => {
  assert.deepEqual(resolve({ campaign_id: "$a1.id", n: ["$a1.id"] }, { a1: { id: "123" } }), { campaign_id: "123", n: ["123"] });
  assert.equal(canonical({ b: 1, a: { d: 2, c: 3 } }), canonical({ a: { c: 3, d: 2 }, b: 1 }));
});

test("full flow: plan, blocked before yes, owner yes, steps run once in order, then blocked again", () => {
  const dir = project();
  const shown = run(dir, ["agent/actions.mjs", "plan", "draft.json"]);
  assert.equal(shown.status, 0, shown.stdout + shown.stderr);
  assert.match(shown.stdout, /reply: yes [0-9a-f]{6}/);
  const code = codeOf(dir);
  const call1 = { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input };

  assert.ok(denied(hook(dir, "pre", call1)), "write before any yes");
  assert.ok(!denied(hook(dir, "pre", { tool_name: "mcp__meta__ads_get_ad_entities", tool_input: {} })), "reads pass");
  hook(dir, "prompt", { prompt: "yes" });
  assert.ok(denied(hook(dir, "pre", call1)), "a plain yes approves nothing");
  hook(dir, "prompt", { prompt: "yes 000000" });
  assert.ok(denied(hook(dir, "pre", call1)), "a wrong code approves nothing");

  const ok = hook(dir, "prompt", { prompt: `yes ${code}` });
  assert.match(ok.hookSpecificOutput.additionalContext, /contains the code for plan/);
  assert.ok(denied(hook(dir, "pre", { ...call1, tool_input: { ...call1.tool_input, name: "Other" } })), "changed input is blocked");
  assert.ok(denied(hook(dir, "pre", { tool_name: "mcp__meta__ads_create_ad_set", tool_input: { campaign_id: "123", daily_budget: 5000, name: "Broad US" } })), "steps run in order");
  assert.ok(!denied(hook(dir, "pre", call1)), "approved first step runs");
  hook(dir, "post", { ...call1, tool_response: { content: [{ type: "text", text: JSON.stringify({ id: "123" }) }] } });
  assert.ok(denied(hook(dir, "pre", call1)), "the same step never runs twice");

  const call2 = { tool_name: "mcp__meta__ads_create_ad_set", tool_input: { campaign_id: "123", daily_budget: 5000, name: "Broad US" } };
  assert.ok(denied(hook(dir, "pre", { ...call2, tool_input: { ...call2.tool_input, daily_budget: 9000 } })), "a bigger budget than approved is blocked");
  assert.ok(!denied(hook(dir, "pre", call2)), "second step runs with the id from step one");
  hook(dir, "post", { ...call2, tool_response: { id: "456" } });
  assert.ok(denied(hook(dir, "pre", call2)), "plan finished, nothing more runs");
  assert.match(run(dir, ["agent/actions.mjs", "status"]).stdout, /done/);
});

test("a failed step stops the plan and is never retried", () => {
  const dir = project();
  run(dir, ["agent/actions.mjs", "plan", "draft.json"]);
  hook(dir, "prompt", { prompt: `yes ${codeOf(dir)}` });
  const call1 = { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input };
  const r = hook(dir, "failure", { ...call1, error: "rate limited" });
  assert.match(r.hookSpecificOutput.additionalContext, /Do not retry/);
  assert.ok(denied(hook(dir, "pre", call1)));
});

test("scheduled runs never write, even with an approval on file", () => {
  const dir = project();
  run(dir, ["agent/actions.mjs", "plan", "draft.json"]);
  hook(dir, "prompt", { prompt: `yes ${codeOf(dir)}` });
  const call1 = { tool_name: "mcp__meta__ads_create_campaign", tool_input: DRAFT.actions[0].input };
  assert.ok(denied(hook(dir, "pre", call1, { AGENT_RUN_MODE: "scheduled" })));
  assert.ok(!denied(hook(dir, "pre", call1)));
});

test("Claude cannot forge an approval through files or the shell", () => {
  const dir = project();
  assert.ok(denied(hook(dir, "pre", { tool_name: "Write", tool_input: { file_path: path.join(dir, "agent-state", "approvals", "x.json"), content: "{}" } })));
  assert.ok(denied(hook(dir, "pre", { tool_name: "Edit", tool_input: { file_path: "agent-state\\runs\\x.json" } })));
  assert.ok(denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "echo {} > agent-state/approvals/p.json" } })));
  assert.ok(denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "node -e \"import('./agent/actions.mjs').then(m=>m.recordApproval('yes abcdef'))\"" } })));
  assert.ok(!denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "node agent/actions.mjs plan draft.json" } })));
});

test("an approval goes stale when the plan file is edited after the yes", () => {
  const dir = project();
  run(dir, ["agent/actions.mjs", "plan", "draft.json"]);
  hook(dir, "prompt", { prompt: `yes ${codeOf(dir)}` });
  const planDir = path.join(dir, "agent-state", "plans"), file = path.join(planDir, fs.readdirSync(planDir)[0]);
  const plan = JSON.parse(fs.readFileSync(file, "utf8")); plan.actions[1].input.daily_budget = 9000; plan.actions[1].spend.daily = 90;
  fs.writeFileSync(file, JSON.stringify(plan));
  const state = { mode: "live", plans: { [plan.id]: plan }, approvals: { [plan.id]: { hash: planHash(DRAFT) } }, runs: {} };
  assert.equal(decide("ads_create_campaign", DRAFT.actions[0].input, state, TOOLS).allow, false);
});

test("owner-held files change only through a file plan and the owner's yes", () => {
  const dir = project();
  assert.ok(denied(hook(dir, "pre", { tool_name: "Write", tool_input: { file_path: path.join(dir, "context", "limits.json"), content: "{}" } })), "direct edit of limits");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Edit", tool_input: { file_path: "agent\\tools.json" } })), "direct edit of tool list");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "echo '{}' > context/limits.json" } })), "shell write to limits");
  assert.ok(!denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "cat context/limits.json" } })), "reading is fine");
  fs.writeFileSync(path.join(dir, "new-limits.json"), JSON.stringify({ ...LIMITS, max_daily_spend: 150 }));
  const shown = run(dir, ["agent/actions.mjs", "propose-file", "context/limits.json", "new-limits.json", "Raise the daily cap from 100 to 150"]);
  assert.equal(shown.status, 0, shown.stdout);
  assert.match(shown.stdout, /Now:[\s\S]*"max_daily_spend":100[\s\S]*After:[\s\S]*"max_daily_spend":150/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, "context", "limits.json"), "utf8")).max_daily_spend, 100, "nothing changes before the yes");
  const code = /yes ([0-9a-f]{6})/.exec(shown.stdout)[1];
  const r = hook(dir, "prompt", { prompt: `yes ${code}` });
  assert.match(r.hookSpecificOutput.additionalContext, /now holds the new version/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, "context", "limits.json"), "utf8")).max_daily_spend, 150);
});

test("a standing rule allows one exact write, and nothing near it", () => {
  const tools = { ...TOOLS, standing: [{ tool: "slack_send_message", match: { channel_id: "C0OWNER" }, scheduled_ok: true, why: "daily report to the owner's own channel" }] };
  const state = { mode: "scheduled", plans: {}, approvals: {}, runs: {} };
  assert.equal(decide("mcp__slack__slack_send_message", { channel_id: "C0OWNER", text: "Report" }, state, tools).allow, true);
  assert.equal(decide("mcp__slack__slack_send_message", { channel_id: "C0CUSTOMERS", text: "Report" }, state, tools).allow, false);
});

test("the job board moves work stage by stage, waits for the owner's sign-off, and hands off", () => {
  const dir = project();
  fs.mkdirSync(path.join(dir, "processes"));
  fs.writeFileSync(path.join(dir, "processes", "video-ad.json"), JSON.stringify({ id: "video-ad", name: "Video ad", folder: "creatives", then: "meta-launch", stages: [
    { id: "script", agent: "scriptwriter", makes: ["script.md"], checks: ["script-reviewer"], gate: "owner" },
    { id: "final-cut", agent: "video-editor", makes: ["final.mp4"], gate: "none" },
  ] }));
  fs.writeFileSync(path.join(dir, "processes", "meta-launch.json"), JSON.stringify({ id: "meta-launch", name: "Launch on Meta", stages: [{ id: "copy", agent: "ad-copywriter", makes: ["copy.md"] }] }));
  const b = (...args) => run(dir, ["agent/board.mjs", ...args]);
  assert.match(b("new", "video-ad", "Dog bed demo").stdout, /stage 1 of 2: script/);
  assert.match(b("submit", "job-0001").stdout, /missing creatives\/job-0001\/script.md/);
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "script.md"), "Hook: ...");
  assert.match(b("submit", "job-0001").stdout, /check script-reviewer has not run/);
  assert.match(b("check", "job-0001", "script-reviewer", "PASS", "fine", "--by", "scriptwriter").stdout, /cannot pass its own work/);
  assert.match(b("check", "job-0001", "script-reviewer", "PASS", "fine").stdout, /say who reviewed it/);
  b("check", "job-0001", "script-reviewer", "PASS", "on brand, claims proven", "--by", "copy-chief");
  const asked = b("submit", "job-0001").stdout;
  const code = /yes ([0-9a-f]{6})/.exec(asked)[1];
  assert.ok(denied(hook(dir, "pre", { tool_name: "Write", tool_input: { file_path: "board/job-0001.json", content: "{}" } })), "board files are protected");
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "script.md"), "Hook: changed after showing");
  assert.match(hook(dir, "prompt", { prompt: `yes ${code}` }).hookSpecificOutput.additionalContext, /changed after the sign-off code/);
  const code2 = /yes ([0-9a-f]{6})/.exec(b("submit", "job-0001").stdout)[1];
  assert.match(hook(dir, "prompt", { prompt: `yes ${code2}` }).hookSpecificOutput.additionalContext, /signed off script of job-0001.*Next stage: final-cut/);
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "final.mp4"), "video");
  assert.match(b("submit", "job-0001").stdout, /Handed to job-0002 \(meta-launch\)/);
  assert.match(b("next", "ad-copywriter").stdout, /job-0002.*Launch on Meta.*copy/);
});

test("the gate treats back-slash and forward-slash paths as one path, and names the fields that differ", async () => {
  const { samePaths, differences } = await import("./guard.mjs");
  const BS = String.fromCharCode(92);
  assert.deepEqual(samePaths({ file_path: ["c:", "Users", "x", "a.txt"].join(BS), content: "a" + BS + "b" }), { file_path: "C:/Users/x/a.txt", content: "a" + BS + "b" }, "only path fields change");
  assert.deepEqual(differences({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 }), ["b", "c"]);
  const tools = { read: [], write: { Write: { spends: false } } };
  const plan = { id: "p", purpose: "Write a test file here", actions: [{ id: "a1", tool: "Write", input: { file_path: "C:/x/a.txt", content: "hi" } }] };
  const state = { mode: "live", plans: { p: plan }, approvals: { p: { hash: planHash(plan) } }, runs: {} };
  assert.equal(decide("Write", { file_path: ["C:", "x", "a.txt"].join(BS), content: "hi" }, state, tools).allow, true);
  assert.match(decide("Write", { file_path: ["C:", "x", "a.txt"].join(BS), content: "bye" }, state, tools).why, /differs .* in: content/);
});

test("a creative signed off for two channels starts one launch job per channel, in the same folder", () => {
  const dir = project();
  fs.mkdirSync(path.join(dir, "processes"));
  const launch = id => ({ id, name: id, stages: [{ id: "copy", agent: "x", makes: ["copy.md"] }] });
  fs.writeFileSync(path.join(dir, "processes", "image-ad.json"), JSON.stringify({ id: "image-ad", name: "Image ad", folder: "creatives", then: ["meta-launch", "pinterest-launch", "google-ads"],
    stages: [{ id: "make", agent: "designer", makes: ["final.png", "channels.json"], gate: "none" }] }));
  for (const id of ["meta-launch", "pinterest-launch", "google-ads"]) fs.writeFileSync(path.join(dir, "processes", `${id}.json`), JSON.stringify(launch(id)));
  const b = (...args) => run(dir, ["agent/board.mjs", ...args]);
  b("new", "image-ad", "Spring set");
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "final.png"), "img");
  fs.writeFileSync(path.join(dir, "creatives", "job-0001", "channels.json"), JSON.stringify(["meta-launch", "pinterest-launch", "tiktok-ads-launch"]));
  const out = b("submit", "job-0001").stdout;
  assert.match(out, /Handed to job-0002 \(meta-launch\), job-0003 \(pinterest-launch\)/);
  assert.doesNotMatch(out, /tiktok|google-ads/, "only channels on the process's own list, only the ones chosen");
  const child = JSON.parse(fs.readFileSync(path.join(dir, "board", "job-0003.json"), "utf8"));
  assert.equal(child.folder, "creatives/job-0001");
});

test("process files are owner-held: agents propose a new version, and only the owner's yes applies it", () => {
  const dir = project();
  fs.mkdirSync(path.join(dir, "processes"));
  fs.writeFileSync(path.join(dir, "processes", "video-ad.json"), "{}\n");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Edit", tool_input: { file_path: path.join(dir, "processes", "video-ad.json") } })), "direct edit");
  assert.ok(denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "sed -i s/a/b/ processes/video-ad.json" } })), "shell edit");
  assert.ok(!denied(hook(dir, "pre", { tool_name: "Bash", tool_input: { command: "node agent/process.mjs check processes/video-ad.json" } })), "checking is fine");
  fs.writeFileSync(path.join(dir, "new.json"), "{\"id\":\"video-ad\"}\n");
  const shown = run(dir, ["agent/actions.mjs", "propose-file", "processes/video-ad.json", "new.json", "Add a hook check before the storyboard"]);
  assert.equal(shown.status, 0, shown.stdout);
  const bad = run(dir, ["agent/actions.mjs", "propose-file", "../outside.json", "new.json", "Try to write outside the store"]);
  assert.notEqual(bad.status, 0, "paths outside the store folder are refused");
  hook(dir, "prompt", { prompt: `yes ${/yes ([0-9a-f]{6})/.exec(shown.stdout)[1]}` });
  assert.equal(fs.readFileSync(path.join(dir, "processes", "video-ad.json"), "utf8"), "{\"id\":\"video-ad\"}\n");
});
