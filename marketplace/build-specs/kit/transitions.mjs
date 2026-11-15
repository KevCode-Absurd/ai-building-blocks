// transitions.mjs: where jobs first go wrong. For each job in the trace it finds the last state that
// went well and the first thing that failed after it, then counts them per process in a table:
// rows are the last good state, columns are the first failure. Only the first failure of each job counts,
// so one early problem does not show up as many later ones. Plain code, no model.
//
//   node agent/transitions.mjs [agent-state/trace.jsonl ...] [--days 31] [--json] [--out <file>] [--check <file>]
//
// A failure is one of: a reviewer FIX, a failed script check, an owner change request, a gate block,
// a failed plan step, going over budget or limits, a platform rejection, a read back that does not match,
// or a job stopped as blocked (with its reason).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readTrace } from "./trace.mjs";

export const FAILURES = ["reviewer_fix", "script_fix", "owner_changes", "gate_block", "failed_step", "over_budget", "platform_rejection", "readback_mismatch",
  "blocked: missing_input", "blocked: tracking_broken", "blocked: needs_owner", "blocked: misrouted"];
const REJECTED = new Set(["DISAPPROVED", "REJECTED", "WITH_ISSUES"]);

// The failure a row shows, or null.
export function failureOf(r) {
  if (r.kind === "check" && r.verdict === "FIX") return r.check === "spend-within-budget" || r.over_limits ? "over_budget" : r.check_kind === "script" || r.by === "script" ? "script_fix" : "reviewer_fix";
  if (r.kind === "changes_requested") return "owner_changes";
  if (r.kind === "tool_call" && r.decision === "deny" && ["write", "generate", "never", "unlisted", "protected"].includes(r.class)) return "gate_block";
  if (r.kind === "blocked") return r.reason === "out_of_limits" ? "over_budget" : `blocked: ${r.reason}`;
  if (r.kind === "tool_result" && r.ok === false && r.class === "write") return /reject|disapprov|policy/i.test(r.error ?? "") ? "platform_rejection" : "failed_step";
  if (r.kind === "tool_result" && r.ok && (r.entities ?? []).some(e => REJECTED.has(e.effective_status ?? e.status))) return "platform_rejection";
  if (r.kind === "readback" && r.match === false) return "readback_mismatch";
  return null;
}

// The good state a row shows, or null (reads and allowed calls are not states on their own).
export function stateOf(r) {
  const at = r.stage ?? "-";
  if (r.kind === "stage_start") return `${at}: started`;
  if (r.kind === "check" && r.verdict === "PASS") return `${at}: ${r.check} passed`;
  if (r.kind === "signoff_shown") return `${at}: shown to owner`;
  if (r.kind === "signoff_given") return `${at}: signed off`;
  if (r.kind === "plan_proposed") return `${at}: plan shown`;
  if (r.kind === "approved") return `${at}: plan approved`;
  if (r.kind === "tool_result" && r.ok && r.class === "write") return `${at}: ${r.tool} done`;
  if (r.kind === "readback" && r.match === true) return `${at}: read back`;
  if (r.kind === "handoff") return `${at}: handed off`;
  return null;
}

// One entry per job: its process, its last good state and its first failure (or null).
export function firstFailures(rows, { days = null, now = Date.now() } = {}) {
  rows = [...rows].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
  const planJob = Object.fromEntries(rows.filter(r => r.kind === "plan_proposed").map(r => [r.plan, r.job]));
  const planStage = Object.fromEntries(rows.filter(r => r.kind === "plan_proposed").map(r => [r.plan, r.stage]));
  const jobs = new Map();
  for (const r0 of rows) {
    const job = r0.job ?? planJob[r0.plan] ?? null;
    const r = { ...r0, stage: r0.stage ?? planStage[r0.plan] ?? null };
    const id = job ?? "(no job)";
    if (!jobs.has(id)) jobs.set(id, { job: id, process: null, started: r.ts, last_ok: "(start)", failure: null, failed_at: null, seq: null, note: null });
    const j = jobs.get(id);
    if (r.kind === "stage_start" && !j.process) j.process = r.process ?? null;
    if (j.failure) continue;
    const f = failureOf(r);
    if (f) { Object.assign(j, { failure: f, failed_at: `${r.stage ?? "-"}: ${f}`, seq: r.seq, note: r.note || r.reason || r.error || (r.mismatches ?? []).join("; ") || r.why || "" }); continue; }
    const s = stateOf(r);
    if (s) j.last_ok = s;
  }
  // A child job's process is known from its first stage; a job seen only through plans keeps "(unknown)".
  // Reads that belong to no job are left out unless something failed there.
  const list = [...jobs.values()].filter(j => j.job !== "(no job)" || j.failure).map(j => ({ ...j, process: j.process ?? (j.job === "(no job)" ? "(no job)" : "(unknown)") }));
  return days ? list.filter(j => !j.started || Date.parse(j.started) >= now - days * 86400000) : list;
}

// Counts per process: { process: { jobs, failed, cells: { last_ok: { failed_at: n } } } }
export function matrix(entries) {
  const out = {};
  for (const e of entries) {
    const p = (out[e.process] ??= { jobs: 0, failed: 0, cells: {}, types: {} });
    p.jobs += 1;
    if (!e.failure) continue;
    p.failed += 1;
    p.cells[e.last_ok] ??= {};
    p.cells[e.last_ok][e.failed_at] = (p.cells[e.last_ok][e.failed_at] ?? 0) + 1;
    p.types[e.failure] = (p.types[e.failure] ?? 0) + 1;
  }
  return out;
}

export function toMarkdown(m) {
  const L = ["# Where jobs first went wrong", "", "Rows are the last state that went well. Columns are the first thing that failed after it. Each job counts once, at its first failure.", ""];
  const names = Object.keys(m).sort();
  if (!names.length) return [...L, "No jobs in the trace yet.", ""].join("\n");
  for (const name of names) {
    const p = m[name], rows = Object.keys(p.cells).sort(), cols = [...new Set(rows.flatMap(r => Object.keys(p.cells[r])))].sort();
    L.push(`## ${name}`, "", `${p.jobs} job${p.jobs === 1 ? "" : "s"}, ${p.failed} with a failure.`, "");
    if (!cols.length) { L.push("No failures.", ""); continue; }
    L.push(`| Last good state | ${cols.join(" | ")} | Total |`, `|---|${cols.map(() => "---:").join("|")}|---:|`);
    for (const r of rows) L.push(`| ${r} | ${cols.map(c => p.cells[r][c] ?? "").join(" | ")} | ${Object.values(p.cells[r]).reduce((a, b) => a + b, 0)} |`);
    L.push(`| Total | ${cols.map(c => rows.reduce((t, r) => t + (p.cells[r][c] ?? 0), 0)).join(" | ")} | ${p.failed} |`, "");
    L.push("First failures by type: " + Object.entries(p.types).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(", ") + ".", "");
  }
  return L.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const valued = new Set(["--days", "--out", "--check"]);
  let files = args.filter((a, i) => !a.startsWith("--") && !valued.has(args[i - 1]));
  if (!files.length) files = [path.join(process.env.AGENT_STATE_DIR || "agent-state", "trace.jsonl")];
  // Rows from several traces (for example many eval trials) are kept apart by prefixing job ids with the file.
  const rows = files.flatMap((f, n) => readTrace(f).map(r => files.length > 1 ? { ...r, job: r.job ? `${n}/${r.job}` : null, plan: r.plan ? `${n}/${r.plan}` : r.plan } : r));
  const entries = firstFailures(rows, { days: opt("--days") ? Number(opt("--days")) : null });
  const text = args.includes("--json") ? JSON.stringify({ entries, matrix: matrix(entries) }, null, 2) : toMarkdown(matrix(entries));
  if (opt("--check")) {
    const have = fs.existsSync(opt("--check")) ? fs.readFileSync(opt("--check"), "utf8").replace(/\r\n/g, "\n").trim() : null;
    if (have !== text.trim()) { console.log(`${opt("--check")} does not match the trace. Make it again with: node agent/transitions.mjs ${files.join(" ")}${opt("--days") ? ` --days ${opt("--days")}` : ""} --out ${opt("--check")}`); process.exit(1); }
    console.log(`${opt("--check")} matches the trace.`);
  } else if (opt("--out")) { fs.mkdirSync(path.dirname(path.resolve(opt("--out"))), { recursive: true }); fs.writeFileSync(opt("--out"), text + "\n"); console.log(`Wrote ${opt("--out")}.`); }
  else console.log(text);
}
