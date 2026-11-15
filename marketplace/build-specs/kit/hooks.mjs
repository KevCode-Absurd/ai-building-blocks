// hooks.mjs: Claude Code hooks that enforce the approval gate in code, on the owner's own machine
// or in a Claude cloud scheduled task. Wired up in .claude/settings.json:
//   UserPromptSubmit   -> node agent/hooks.mjs prompt   (the owner's own words: "yes <code>", "pause all agent work", "resume agent work")
//   PreToolUse         -> node agent/hooks.mjs pre      (blocks any write that is not allowed right now)
//   PostToolUse        -> node agent/hooks.mjs post     (records the step as done, with returned ids)
//   PostToolUseFailure -> node agent/hooks.mjs failure  (stops the plan; nothing is retried)
// The gate fails closed: if anything goes wrong while deciding, the tool call is blocked.
import { baseName, decide, isConnectorTool, isProtectedFile, mentionsProtected } from "./guard.mjs";
import { loadState, loadTools, recordApproval, recordPause, recordResult, log } from "./actions.mjs";
import { signOff } from "./board.mjs";
import { budgetState } from "./spend.mjs";

const read = async () => { let s = ""; for await (const c of process.stdin) s += c; return JSON.parse(s || "{}"); };
const out = obj => process.stdout.write(JSON.stringify(obj));
const context = (event, text) => out({ hookSpecificOutput: { hookEventName: event, additionalContext: text } });
const deny = why => out({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: why } });
const listed = (name, tools) => {
  const n = baseName(name);
  return tools.read?.includes(n) || Boolean(tools.write?.[n]) || tools.never?.includes(n) || (tools.standing ?? []).some(s => baseName(s.tool) === n)
    || (tools.governed_prefixes ?? []).some(p => n.startsWith(p));
};
// Every connector tool is governed; built-in tools are governed when tools.json names them.
const governed = (name, tools) => isConnectorTool(name) || listed(name, tools);

// Only the owner's words and these hooks may write approvals, sign-offs, plans, the pause switch and run records.
const STATE_PATH = /agent-state[\\/]+(approvals|runs|plans)\b|agent-state[\\/]+(log\.jsonl|paused\.json)|(^|[\\/\s"'=])board[\\/]+[^\s"']*\.json|[\\/]spend\.json\b/i;
// Words that change files. A redirect counts only by its target, so "2>&1" or "> report.txt" is fine.
const WRITE_VERBS = /(\btee\b|\bcp\b|\bmv\b|\brm\b|\bln\b|sed\s+-i|\btruncate\b|writeFile|appendFile|copyFile|rename|unlink|Set-Content|Add-Content|Out-File|Copy-Item|Move-Item|Remove-Item|New-Item)/i;
const redirectTargets = cmd => [...cmd.matchAll(/(?<![<>&\d])\d?>>?\s*(?!&)["']?([^\s"'|;&<>]+)/g)].map(m => m[1]);
const FORGERY = /recordApproval|recordResult|recordPause|signOff/;
const FILE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);
const touchesState = text => STATE_PATH.test(text);
function forging(name, ti) {
  if (FILE_TOOLS.has(name)) { const f = String(ti.file_path ?? ti.notebook_path ?? ""); return touchesState(f) || isProtectedFile(f); }
  if (name !== "Bash" && name !== "PowerShell") return false;
  const cmd = String(ti.command ?? "");
  if (FORGERY.test(cmd)) return true;
  if (redirectTargets(cmd).some(t => touchesState(t) || isProtectedFile(t))) return true;
  return WRITE_VERBS.test(cmd) && (touchesState(cmd) || mentionsProtected(cmd));
}

const kind = process.argv[2];
try {
  const input = await read();
  const tools = loadTools();

  if (kind === "prompt") {
    const words = input.prompt ?? "";
    const pause = recordPause(words);
    if (pause) context("UserPromptSubmit", pause === "pause"
      ? "Approval gate (this project's own hook): the owner paused all agent work. Only reads run until they say \"resume agent work\". Live ads keep running; tell the owner that pausing ads needs a pause plan or Ads Manager."
      : "Approval gate (this project's own hook): the owner resumed agent work. Plans still need their own yes.");
    else {
      const gate = signOff(words);
      if (gate?.found) {
        context("UserPromptSubmit", gate.changed
          ? `Approval gate (this project's own hook): the files for ${gate.job} changed after the sign-off code was shown, so the yes does not count. Submit the stage again to get a new code.`
          : `Approval gate (this project's own hook): the owner signed off ${gate.stage} of ${gate.job} with the code you showed them.${gate.next ? ` Next stage: ${gate.next}.` : " The process is done."}${gate.handed_to ? ` It was handed to ${gate.handed_to}.` : ""}${gate.missing?.length ? ` Not handed to ${gate.missing.join(", ")}: not installed.` : ""}`);
      } else {
        const result = recordApproval(words);
        if (result?.applied) context("UserPromptSubmit", `Approval gate (this project's own hook): the owner approved plan ${result.plan}, and ${result.applied} now holds the new version.`);
        else if (result?.plan) context("UserPromptSubmit", `Approval gate (this project's own hook in .claude/settings.json): the owner's message above contains the code for plan ${result.plan}, which was shown to them as a dry run. Carry out its steps in order, with exactly the inputs in agent-state/plans/${result.plan}.json, then check each one.`);
        else if (result?.changed) context("UserPromptSubmit", "Approval gate (this project's own hook): that plan changed after it was shown, so the yes does not count. Show the new list and its new code.");
        else if (result && !result.found) context("UserPromptSubmit", `Approval gate (this project's own hook): the owner typed a yes with code ${result.code}, but nothing is waiting with that code. Nothing is approved. Show the current plan or stage again.`);
      }
    }
  } else if (kind === "pre") {
    const name = input.tool_name ?? "", ti = input.tool_input ?? {};
    if (forging(name, ti)) {
      log({ event: "blocked", tool: name, why: "tried to change approvals, sign-offs, plans or owner-held files" });
      deny("Approvals, sign-offs, plans, run records and owner-held files (limits, goals, approvers, tool list, processes, agent files, hooks and kit code) change only through the owner's yes. Propose a change with: node agent/actions.mjs propose-file <file> <new version> \"<what changes>\"");
    } else if (!tools && (isConnectorTool(name))) {
      deny("agent/tools.json is missing or not valid JSON, so every connector tool is blocked. Propose a fixed version with a file plan.");
    } else if (tools && governed(name, tools)) {
      const verdict = decide(name, ti, { ...loadState(), budget: budgetState() }, tools);
      if (!verdict.allow) { log({ event: "blocked", tool: baseName(name), why: verdict.why }); deny(verdict.why); }
      // Allowed calls print nothing, so the app's own permission settings still apply on top.
    }
  } else if (kind === "post" || kind === "failure") {
    if (tools && governed(input.tool_name ?? "", tools)) {
      const r = recordResult(input.tool_name, input.tool_input ?? {}, input.tool_response ?? input.error ?? null, kind === "failure");
      if (r?.failed) context("PostToolUseFailure", `Approval gate (this project's own hook): step ${r.actionId} of plan ${r.planId} failed. The plan is stopped. Do not retry it. Tell the owner what failed, what is already done, and how to undo it.`);
    }
  }
} catch (e) {
  // Fail closed. Exit code 2 blocks the call in Claude Code; the message says why.
  if (kind === "pre") { process.stderr.write(`Approval gate error, so the call is blocked: ${e.message}`); process.exit(2); }
  process.stderr.write(`Approval gate error: ${e.message}`);
}
