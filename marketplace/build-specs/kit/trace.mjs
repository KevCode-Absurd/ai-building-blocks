// trace.mjs: one append-only record of everything that happens in this store folder, in order.
// File: agent-state/trace.jsonl (one JSON row per line). Only the kit writes it; agents read it.
//
// Every row has: ts, seq, job, parent, stage, agent, kind, note. Some kinds add their own fields.
//   stage_start        a job reached a stage (process, stage, agent)
//   check              a reviewer or script verdict: verdict PASS or FIX, check, by, maker
//   signoff_shown      the board showed the owner a sign-off code: code, hash, files {name: sha256}
//   signoff_given      the owner signed off with that code: code, by, files
//   changes_requested  the owner asked for changes instead: reason (the owner's own words)
//   plan_proposed      a plan's dry run was shown: plan, code, hash, actions [{id, tool, input}]
//   approved           the owner typed yes <code> for a plan: plan, code, hash, by
//   tool_call          a governed tool call reached the gate: tool, class, args, args_hash, decision, why, plan, action, mode
//   tool_result        it came back: tool, class, ok, error, ids, entities, plan, action
//   readback           a step was checked after it ran: plan, action, observed, expected, match, mismatches
//   handoff            a finished job started the next process: to [job ids], processes, missing
//   blocked            work stopped and needs the orchestrator: reason (one of BLOCK_REASONS)
//   owner_message      what the agent told the owner at the end of a turn: text, claims
//   pause              the owner paused or resumed all agent work: state
//
//   node agent/trace.mjs show [jobId]          the rows, one line each
// To stop a job with a reason, use node agent/board.mjs block <jobId> <reason> "<note>".
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonical, sha256 } from "./guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = () => process.env.AGENT_ROOT || path.resolve(HERE, "..");
const STATE = () => process.env.AGENT_STATE_DIR || path.join(ROOT(), "agent-state");
const BOARD = () => process.env.AGENT_BOARD_DIR || path.join(ROOT(), "board");
export const traceFile = () => path.join(STATE(), "trace.jsonl");

export const KINDS = ["stage_start", "check", "signoff_shown", "signoff_given", "changes_requested", "plan_proposed", "approved",
  "tool_call", "tool_result", "readback", "handoff", "blocked", "owner_message", "pause"];
// Why work stopped. The orchestrator reads it to decide: ask the owner, or send the job somewhere else.
export const BLOCK_REASONS = ["missing_input", "out_of_limits", "tracking_broken", "needs_owner", "misrouted"];

const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };
export const argsHash = args => sha256(canonical(args ?? {}));

// Who is acting: the subagent's name when Claude Code gives one, else AGENT_NAME, else the main session.
export const actor = input => input?.agent_type || input?.agent_name || process.env.AGENT_NAME || "main";

// The board card fills in the parent job and current stage when the caller only knows the job id.
function fromBoard(job) {
  if (!job) return {};
  const card = readJson(path.join(BOARD(), `${job}.json`), null);
  return card ? { parent: card.parent ?? null, stage: card.stage ?? null, process: card.process ?? null } : {};
}

// Append one row. It never throws: a trace problem must never change what the gate decides.
export function trace(row, now = Date.now()) {
  try {
    if (!KINDS.includes(row?.kind)) throw new Error(`unknown trace kind ${row?.kind}`);
    if (row.kind === "blocked" && !BLOCK_REASONS.includes(row.reason)) throw new Error(`blocked needs a reason from: ${BLOCK_REASONS.join(", ")}`);
    const file = traceFile();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const seq = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split("\n").filter(Boolean).length + 1 : 1;
    const card = row.job && (row.parent === undefined || row.stage === undefined) ? fromBoard(row.job) : {};
    const full = { ts: new Date(now).toISOString(), seq, job: row.job ?? null, parent: row.parent !== undefined ? row.parent : card.parent ?? null,
      stage: row.stage !== undefined ? row.stage : card.stage ?? null, agent: row.agent || process.env.AGENT_NAME || "main", kind: row.kind,
      note: String(row.note ?? "").slice(0, 300), ...strip(row) };
    if (process.env.AGENT_SIMULATED_OWNER === "1" && ["approved", "signoff_given", "changes_requested", "pause"].includes(row.kind)) full.simulated = true;
    fs.appendFileSync(file, JSON.stringify(full) + "\n");
    return full;
  } catch (e) {
    try { process.stderr.write(`trace: ${e.message}\n`); } catch { /* nothing more to do */ }
    return null;
  }
}
const strip = row => Object.fromEntries(Object.entries(row).filter(([k, v]) => !["ts", "seq", "job", "parent", "stage", "agent", "kind", "note"].includes(k) && v !== undefined));

export function readTrace(file = traceFile()) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split("\n").filter(Boolean).map((l, i) => { try { return JSON.parse(l); } catch { return { kind: "unreadable", seq: i + 1, line: l.slice(0, 200) }; } });
}

// Ids, statuses and budgets of the objects a read returned, so a later readback can be compared in code.
const ENTITY_FIELDS = ["id", "name", "status", "effective_status", "configured_status", "daily_budget", "lifetime_budget", "end_time", "review_feedback"];
export function entitiesIn(response, max = 100) {
  const out = [], seen = new Set();
  const visit = v => {
    if (out.length >= max) return;
    if (typeof v === "string") { if (/^\s*[[{]/.test(v)) { try { visit(JSON.parse(v)); } catch { /* plain text */ } } return; }
    if (Array.isArray(v)) return v.forEach(visit);
    if (v && typeof v === "object") {
      if ((typeof v.id === "string" || typeof v.id === "number") && ENTITY_FIELDS.some(f => f !== "id" && v[f] !== undefined) && !seen.has(String(v.id))) {
        seen.add(String(v.id));
        out.push(Object.fromEntries(ENTITY_FIELDS.filter(f => v[f] !== undefined).map(f => [f, f === "id" ? String(v[f]) : v[f]])));
      }
      for (const x of Object.values(v)) visit(x);
    }
  };
  visit(response);
  return out;
}

// Short, safe text of an error, whatever shape the app hands over.
export const errorText = e => String(typeof e === "string" ? e : e?.message ?? e?.error ?? JSON.stringify(e ?? "")).slice(0, 300);

// What a message to the owner claims: that the work is done or live, and which ids it names.
// A phrase that follows "not", "nothing", "no", "never" or "n't" closely is not a claim ("nothing is live yet").
const NEGATION = /\b(not|nothing|no|never|none|neither|nor|without|until|before|once|after|when|if)\b|n't\b|n’t\b/i;
const claimed = (t, re) => [...t.matchAll(re)].some(m => !NEGATION.test(t.slice(Math.max(0, m.index - 30), m.index)));
export function claimsIn(text) {
  const t = String(text ?? "");
  return {
    done: claimed(t, /\b(all done|is done|are done|it'?s done|finished|complete[d]?|all set)\b/gi),
    live: claimed(t, /\b(is live|are live|now live|went live|gone live|switched on|launched|running now|is running|are running|now active|are active|is active)\b/gi),
    // A message that reports a problem is not an "all good" message, even if it says some parts are on.
    problem: /\b(fail(ed|s|ure)?|error|reject(ed|ion)?|disapproved|mismatch|blocked|stopped|paused all|could not|couldn'?t|did not|didn'?t|problem|issue)\b/i.test(t),
    ids: [...new Set([...t.matchAll(/\b\d{10,20}\b/g)].map(m => m[0]))],
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, a] = process.argv.slice(2);
  if (cmd === "show") {
    const rows = readTrace().filter(r => !a || r.job === a);
    console.log(rows.map(r => `${r.seq}  ${r.ts}  ${r.job ?? "-"}  ${r.stage ?? "-"}  ${r.agent}  ${r.kind}${r.tool ? " " + r.tool : ""}${r.decision ? " " + r.decision : ""}${r.verdict ? " " + r.verdict : ""}${r.reason && r.kind === "blocked" ? " " + r.reason : ""}  ${r.note}`).join("\n") || "No trace yet.");
  } else console.log("Commands: show [jobId]");
}
