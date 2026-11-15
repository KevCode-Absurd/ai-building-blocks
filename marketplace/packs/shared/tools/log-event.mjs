#!/usr/bin/env node
// log-event.mjs (AI Blocks) - version 1.0.0
//
// The job log: one JSON line per tool run in context/job-log.jsonl, written by the tools themselves, so "which checks
// ran and what they found" is a record, not the writer's own word. job.mjs status reads it.
//
//   node tools/log-event.mjs show [--context <dir>] [--json]
//                                       print the runs logged for this job, oldest first
//   node tools/log-event.mjs add --tool <name> --result PASS|FAIL|NOT_RUN [--cmd <step>] [--input <file>]...
//                                       log a check you ran another way (by hand, or a tool that does not log)
//
// What a line holds: the tool, its version, the command, the arguments (flags and numbers as given, file paths as
// given, any other text as a short hash), a hash of each input file, the result, and each check's status with a
// hash of what it found. Never the client's text: no brief, no draft, no data. Lines stay on this computer.
// A tool writes a line only when the context folder already exists (a pack ships one), so running a tool in some
// other folder leaves no trace there. AIB_JOB_LOG=off turns logging off; AIB_JOB_LOG=<file> writes there instead.
// Logging never stops a tool: any error writing the line is ignored.
// Plain Node 18+. Reads and writes local files only; opens no network connection.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "1.0.0";
export const SCHEMA = "ai-blocks-job-log/1";
export const LOG_NAME = "job-log.jsonl";
export const RESULTS = Object.freeze(["PASS", "FAIL", "NOT_RUN", "WARN", "ERROR"]);

/** A short, stable hash of any text: 16 hex characters of SHA-256. */
export const hash = text => createHash("sha256").update(String(text)).digest("hex").slice(0, 16);

/** A file as { file, sha256, bytes }, or { file, missing: true } when it cannot be read. */
export function hashFile(file) {
  try {
    const bytes = fs.readFileSync(file);
    return { file: String(file).replace(/\\/g, "/"), sha256: createHash("sha256").update(bytes).digest("hex").slice(0, 16), bytes: bytes.length };
  } catch {
    return { file: String(file).replace(/\\/g, "/"), missing: true };
  }
}

/**
 * Arguments made safe to keep: flags and plain numbers as given, a path to a file or folder that exists as given,
 * anything else (a question, a name, a line of copy) as "#" plus its hash.
 */
export function safeArgs(args = []) {
  return args.map(a => {
    const s = String(a);
    if (/^--?[A-Za-z][\w-]*(=.*)?$/.test(s)) {
      const eq = s.indexOf("=");
      return eq < 0 ? s : `${s.slice(0, eq)}=${safeArgs([s.slice(eq + 1)])[0]}`;
    }
    if (/^-?\d+(\.\d+)?%?$/.test(s)) return s;
    try { if (s.length < 400 && fs.existsSync(s)) return s.replace(/\\/g, "/"); } catch { /* not a path */ }
    return `#${hash(s)}`;
  });
}

/** Where the log goes, or null when nothing should be written (no context folder, or AIB_JOB_LOG=off). */
export function logPath(context = "context") {
  const env = process.env.AIB_JOB_LOG;
  if (env && /^(off|0|false|no)$/i.test(env)) return null;
  if (env) return env;
  try { return fs.statSync(context).isDirectory() ? path.join(context, LOG_NAME) : null; } catch { return null; }
}

/** The id of the job under way in this context folder (context/job.json), if any. */
export function jobId(context = "context") {
  try { return JSON.parse(fs.readFileSync(path.join(context, "job.json"), "utf8")).id ?? null; } catch { return null; }
}

/**
 * Appends one line for one tool run. Returns the event written, or null when logging is off or failed.
 *   tool     the tool's name (qe-check, make-rubric, blind-review, job ...)
 *   cmd      the sub-command or step (check, build, tally, done ...)
 *   args     the raw arguments; they are made safe with safeArgs
 *   inputs   files the run read; each is hashed
 *   result   PASS, FAIL, NOT_RUN, WARN or ERROR
 *   checks   [{ name, status, required?, detail? }]: detail is hashed to "hit", never kept as text
 *   counts   small numbers or short fixed labels the tool wants to keep (scores, sheet count, outcome)
 */
export function logEvent({ tool, version = null, cmd = null, args = [], inputs = [], result, checks = [], counts = {}, context = "context" } = {}) {
  try {
    const file = logPath(context);
    if (!file || !tool) return null;
    const event = {
      schema: SCHEMA,
      ts: new Date().toISOString(),
      tool: String(tool),
      version,
      cmd,
      job: jobId(context),
      args: safeArgs(args),
      inputs: inputs.filter(Boolean).map(hashFile),
      result: RESULTS.includes(result) ? result : "ERROR",
      checks: checks.map(c => ({ name: String(c.name), status: String(c.status), ...(c.required ? { required: true } : {}), ...(c.detail ? { hit: hash(c.detail) } : {}) })),
      counts: Object.fromEntries(Object.entries(counts).filter(([, v]) => typeof v === "number" || typeof v === "boolean" || (typeof v === "string" && v.length <= 40 && /^[\w .:/+-]*$/.test(v)))),
    };
    fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
    fs.appendFileSync(file, `${JSON.stringify(event)}\n`);
    return event;
  } catch {
    return null;
  }
}

/** Every valid line of the log, oldest first. Lines that do not parse are skipped. */
export function readLog(context = "context") {
  const file = process.env.AIB_JOB_LOG && !/^(off|0|false|no)$/i.test(process.env.AIB_JOB_LOG) ? process.env.AIB_JOB_LOG : path.join(context, LOG_NAME);
  let text = "";
  try { text = fs.readFileSync(file, "utf8"); } catch { return []; }
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try { const e = JSON.parse(line); if (e && e.tool) out.push(e); } catch { /* a torn line */ }
  }
  return out;
}

// ---------- command line ----------
function args(argv) {
  const o = { _: [], input: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") o.json = true;
    else if (a === "--help" || a === "-h") o.help = true;
    else if (a === "--input") o.input.push(argv[++i]);
    else if (["--tool", "--result", "--cmd", "--context"].includes(a)) o[a.slice(2)] = argv[++i];
    else o._.push(a);
  }
  return o;
}

export function main(argv = process.argv.slice(2), print = console.log) {
  const o = args(argv), cmd = o._[0] ?? "show", context = o.context ?? "context";
  if (o.help) { print(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter(l => l.startsWith("//")).slice(0, 18).map(l => l.replace(/^\/\/ ?/, "")).join("\n")); return 0; }
  if (cmd === "show") {
    const events = readLog(context);
    if (o.json) { print(JSON.stringify(events, null, 1)); return 0; }
    if (!events.length) { print(`No runs logged in ${path.join(context, LOG_NAME)} yet.`); return 0; }
    for (const e of events) print(`${e.ts}  ${e.tool}${e.cmd ? ` ${e.cmd}` : ""}  ${e.result}${e.checks?.length ? `  (${e.checks.map(c => `${c.name} ${c.status}`).join(", ")})` : ""}`);
    return 0;
  }
  if (cmd === "add") {
    const result = String(o.result ?? "").toUpperCase();
    if (!o.tool || !RESULTS.includes(result)) { console.error("Usage: node tools/log-event.mjs add --tool <name> --result PASS|FAIL|NOT_RUN [--cmd <step>] [--input <file>]..."); return 2; }
    if (!logPath(context)) { console.error(`No ${context} folder here (or AIB_JOB_LOG=off), so nothing was logged.`); return 2; }
    const e = logEvent({ tool: o.tool, cmd: o.cmd ?? "by-hand", inputs: o.input, result, context, counts: { by_hand: true } });
    print(e ? `Logged ${e.tool}${e.cmd ? ` ${e.cmd}` : ""} ${e.result} in ${logPath(context)}.` : "Could not write the log line.");
    return e ? 0 : 1;
  }
  console.error(`Unknown command "${cmd}". Use show or add.`);
  return 2;
}

const invoked = !!process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = main();
