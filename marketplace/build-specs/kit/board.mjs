// board.mjs: the job board. It knows where every piece of work stands, who works on it next,
// and which stages wait for the owner's sign-off. No dependencies.
//
// A process (processes/<id>.json) is a list of stages. Each stage names the agent that does it,
// the files it must make, the checks that must pass, and whether the owner signs it off.
// A job is one run of a process, with its own folder (for a creative: creatives/<job id>/).
//
//   node agent/board.mjs new <process> "<title>"                  start a job at its first stage
//   node agent/board.mjs status [jobId]                            where each job stands and what is next
//   node agent/board.mjs next [agent]                              work that is ready now, per agent
//   node agent/board.mjs check <jobId> <check> PASS|FIX "<note>" --by <reviewer>   record a reviewer's verdict
//   node agent/board.mjs run-check <jobId> <check> ["<full command>"]             run a script check and record it
//   node agent/board.mjs submit <jobId>                            finish the current stage (asks for sign-off if needed)
//   node agent/board.mjs block <jobId> <reason> "<note>" [--by <agent>]   stop the job and say why (reasons below)
//   node agent/board.mjs unblock <jobId> "<what changed>"          carry on once the reason is gone
//
// A blocked job waits for the orchestrator, who asks the owner or sends the work to the right process.
// Reasons: missing_input, out_of_limits, tracking_broken, needs_owner, misrouted.
// Every event here is also written to agent-state/trace.jsonl (see trace.mjs).
//
// Only the owner's own message "yes <code>" signs off a stage (through the prompt hook).
// If any file changes after the sign-off code was shown, the code stops working.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { canonical, sha256, shortCode, parseYes } from "./guard.mjs";
import { loadState } from "./actions.mjs";
import { trace, BLOCK_REASONS } from "./trace.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.AGENT_ROOT || path.resolve(HERE, "..");
const BOARD = () => process.env.AGENT_BOARD_DIR || path.join(ROOT, "board");
const SCHEDULE = () => path.join(process.env.AGENT_STATE_DIR || path.join(ROOT, "agent-state"), "schedule.json");
const DAY = 24 * 60 * 60 * 1000;
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };
const writeJson = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2) + "\n"); };
const stamp = now => new Date(now).toISOString();

export const loadProcess = id => readJson(path.join(ROOT, "processes", `${id}.json`), null);
export const loadJob = id => readJson(path.join(BOARD(), `${id}.json`), null);
const saveJob = job => writeJson(path.join(BOARD(), `${job.id}.json`), job);
export const allJobs = () => (fs.existsSync(BOARD()) ? fs.readdirSync(BOARD()) : []).filter(f => f.endsWith(".json")).map(f => readJson(path.join(BOARD(), f), null)).filter(Boolean);

// A "makes" entry ending in /* means every file in that folder (for example final/*).
export function expand(folder, files) {
  return files.flatMap(f => {
    if (!f.endsWith("/*")) return [f];
    const dir = path.join(ROOT, folder, f.slice(0, -2));
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter(n => fs.statSync(path.join(dir, n)).isFile()).sort().map(n => `${f.slice(0, -2)}/${n}`) : [];
  });
}

// The fingerprint of what the owner is signing off: every file the stage made, byte for byte.
export function fileHashes(folder, files) {
  return Object.fromEntries(expand(folder, files).map(f => {
    const p = path.join(ROOT, folder, f);
    return [f, fs.existsSync(p) && fs.statSync(p).isFile() ? sha256(fs.readFileSync(p)) : null];
  }));
}
export function filesHash(folder, files) {
  const h = fileHashes(folder, files);
  return sha256(canonical(Object.keys(h).sort().map(f => ({ f, h: h[f] }))));
}

// True when the owner signed off this exact version of a file in this job folder.
export function signedOff(folder, file) {
  const p = path.join(ROOT, folder, file);
  if (!fs.existsSync(p)) return false;
  const now = sha256(fs.readFileSync(p));
  return allJobs().some(j => j.folder === folder && Object.values(j.signoffs ?? {}).some(s => s.files?.[file] === now));
}

// Puts a later stage on the schedule that every run reads first, and remembers when it may start.
function scheduleStage(job, stage, now) {
  if (!Number.isFinite(stage.wait_days)) return;
  const due = now + stage.wait_days * DAY, list = readJson(SCHEDULE(), []);
  list.push({ id: `t${list.length + 1}`, due_at: stamp(due), task: `board: ${job.id} stage ${stage.id} (${stage.name ?? stage.id})`, job: job.id, stage: stage.id, done: false });
  writeJson(SCHEDULE(), list);
  job.not_before = due;
  job.history.push({ at: stamp(now), event: `scheduled for ${stamp(due)}`, stage: stage.id });
}
function closeSchedule(job, stageId, now) {
  const list = readJson(SCHEDULE(), []);
  let changed = false;
  for (const t of list) if (!t.done && t.job === job.id && t.stage === stageId) { t.done = true; t.done_at = stamp(now); changed = true; }
  if (changed) writeJson(SCHEDULE(), list);
}

export function newJob(processId, title, now = Date.now(), parent = null) {
  const proc = loadProcess(processId);
  if (!proc) throw new Error(`No process called ${processId} in processes/`);
  const n = allJobs().length + 1;
  const id = `job-${String(n).padStart(4, "0")}`;
  const job = { id, process: processId, title, folder: parent?.folder ?? path.posix.join(proc.folder ?? "jobs", id), stage: proc.stages[0].id, status: "in_progress",
    parent: parent?.id ?? null, checks: {}, signoffs: {}, pending_gate: null, history: [{ at: stamp(now), event: "started", stage: proc.stages[0].id }] };
  fs.mkdirSync(path.join(ROOT, job.folder), { recursive: true });
  scheduleStage(job, proc.stages[0], now);
  saveJob(job);
  trace({ kind: "stage_start", job: id, parent: job.parent, stage: job.stage, agent: proc.stages[0].agent, process: processId, note: title }, now);
  return job;
}

const stageOf = (proc, job) => proc.stages.find(s => s.id === job.stage);

// A reviewer's verdict. The maker of the stage can never pass its own work.
export function recordCheck(jobId, name, verdict, note, by, now = Date.now()) {
  const job = loadJob(jobId); if (!job) throw new Error(`No job ${jobId}`);
  const proc = loadProcess(job.process), stage = stageOf(proc, job), def = proc.checks?.[name];
  if (!(stage.checks ?? []).includes(name)) throw new Error(`${name} is not a check of stage ${stage.id}`);
  if (def?.kind === "script") throw new Error(`${name} is a script check; run it with: node agent/board.mjs run-check ${jobId} ${name}`);
  if (!["PASS", "FIX"].includes(verdict)) throw new Error("verdict must be PASS or FIX");
  if (!by) throw new Error("say who reviewed it: --by <reviewer>");
  if (by === stage.agent) throw new Error(`${by} made this stage, so it cannot pass its own work; ask ${def?.agent ?? "the named reviewer"}`);
  if (def?.agent && by !== def.agent) throw new Error(`this check belongs to ${def.agent}, not ${by}`);
  job.checks[job.stage] = { ...(job.checks[job.stage] ?? {}), [name]: { verdict, note, by, at: stamp(now) } };
  job.history.push({ at: stamp(now), event: `check ${name} ${verdict} by ${by}`, stage: job.stage });
  saveJob(job);
  trace({ kind: "check", job: job.id, parent: job.parent, stage: job.stage, agent: by, check: name, verdict, by, maker: stage.agent, check_kind: "reviewer", note }, now);
  return job;
}

// A script check is run by the board itself, so its result is the script's exit code, not anyone's word.
export function runCheck(jobId, name, command = null, now = Date.now()) {
  const job = loadJob(jobId); if (!job) throw new Error(`No job ${jobId}`);
  const proc = loadProcess(job.process), stage = stageOf(proc, job), def = proc.checks?.[name];
  if (!(stage.checks ?? []).includes(name)) throw new Error(`${name} is not a check of stage ${stage.id}`);
  if (def?.kind !== "script") throw new Error(`${name} is a reviewer check; record it with check ... --by <reviewer>`);
  let cmd = def.run.replaceAll("<folder>", job.folder);
  if (/<[^>]+>/.test(cmd)) {
    if (!command) throw new Error(`fill in the blanks and pass the full command: ${cmd}`);
    const head = cmd.split(/\s+/).slice(0, 2).join(" ");
    if (!command.startsWith(head)) throw new Error(`the command must start with: ${head}`);
    cmd = command;
  }
  const r = spawnSync(cmd, { cwd: ROOT, shell: true, encoding: "utf8" });
  const verdict = r.status === 0 ? "PASS" : "FIX", note = `${cmd} exited ${r.status}: ${(r.stdout + r.stderr).trim().split("\n").slice(-3).join(" | ").slice(0, 300)}`;
  job.checks[job.stage] = { ...(job.checks[job.stage] ?? {}), [name]: { verdict, note, by: "script", at: stamp(now) } };
  job.history.push({ at: stamp(now), event: `check ${name} ${verdict} by script`, stage: job.stage });
  saveJob(job);
  trace({ kind: "check", job: job.id, parent: job.parent, stage: job.stage, agent: "script", check: name, verdict, by: "script", maker: stage.agent, check_kind: "script", note }, now);
  return { verdict, note };
}

// Where a finished job goes next. "then" is one process id, or a list to choose from. With a list, the
// job folder's channels.json (written at intake and signed off with the work) names the ones to start,
// one launch job per channel, all sharing the folder. Without channels.json, the first in the list.
// A process that is not installed in this store is skipped and written in the job's history.
export function handoffTargets(proc, job) {
  if (!proc.then) return [];
  if (!Array.isArray(proc.then)) return [proc.then];
  const chosen = readJson(path.join(ROOT, job.folder, "channels.json"), null);
  const list = Array.isArray(chosen) ? chosen.filter(c => proc.then.includes(c)) : [];
  return list.length ? [...new Set(list)] : [proc.then[0]];
}

function advance(job, proc, now) {
  const i = proc.stages.findIndex(s => s.id === job.stage);
  closeSchedule(job, job.stage, now);
  job.pending_gate = null; job.not_before = null;
  if (i === proc.stages.length - 1) {
    job.status = "done"; job.history.push({ at: stamp(now), event: "process done", stage: job.stage });
    saveJob(job);
    const targets = handoffTargets(proc, job), installed = targets.filter(t => loadProcess(t)), missing = targets.filter(t => !loadProcess(t));
    const children = installed.map(t => newJob(t, job.title, now, job));
    if (children.length) job.history.push({ at: stamp(now), event: `handed to ${children.map(c => `${c.id} (${c.process})`).join(", ")}`, stage: job.stage });
    if (missing.length) job.history.push({ at: stamp(now), event: `not handed to ${missing.join(", ")}: not installed in processes/`, stage: job.stage });
    saveJob(job);
    if (targets.length) trace({ kind: "handoff", job: job.id, parent: job.parent, stage: job.stage, agent: proc.stages[i].agent, to: children.map(c => c.id), processes: installed, missing,
      note: children.length ? `handed to ${children.map(c => `${c.id} (${c.process})`).join(", ")}` : "nothing installed to hand to" }, now);
    return { job, handed_to: children[0] ?? null, handed_all: children, missing };
  }
  const next = proc.stages[i + 1];
  job.stage = next.id; job.status = "in_progress";
  job.history.push({ at: stamp(now), event: "started", stage: job.stage });
  scheduleStage(job, next, now);
  saveJob(job);
  trace({ kind: "stage_start", job: job.id, parent: job.parent, stage: job.stage, agent: next.agent, process: job.process }, now);
  return { job };
}

// The plans of a publish stage are listed in <folder>/<process>.<stage>.plans, one id per line, so
// channels sharing a folder never mix them up. The stage is finished only when each plan belongs to this
// job, was approved by the owner, every step ran, and every step was checked afterwards.
export const plansFile = (job, stage) => path.posix.join(job.folder, `${job.process}.${stage.id}.plans`);
export function publishProblems(job, stage) {
  const file = path.join(ROOT, plansFile(job, stage));
  if (!fs.existsSync(file) && stage.optional) return [];
  if (!fs.existsSync(file)) return [`list the plan ids for this stage in ${plansFile(job, stage)}`];
  const ids = fs.readFileSync(file, "utf8").split(/\s+/).filter(Boolean), st = loadState(), out = [];
  if (!ids.length) out.push("no plan ids listed");
  for (const id of ids) {
    const plan = st.plans[id], run = st.runs[id];
    if (!plan) { out.push(`no plan ${id}`); continue; }
    if (plan.kind !== "file" && plan.job !== job.id) { out.push(`plan ${id} belongs to ${plan.job ?? "no job"}, not ${job.id}`); continue; }
    if (!st.approvals[id]) { out.push(`plan ${id} is waiting for the owner's yes`); continue; }
    const steps = plan.kind === "file" ? ["file"] : plan.actions.map(a => a.id);
    const left = steps.filter(a => !run?.done?.includes(a));
    if (left.length) out.push(`plan ${id} has steps not done: ${left.join(", ")}`);
    const unchecked = plan.kind === "file" ? [] : steps.filter(a => !run?.verified?.[a]);
    if (!left.length && unchecked.length) out.push(`plan ${id} has steps not checked after: ${unchecked.join(", ")}`);
  }
  return out;
}

// Finish the current stage. Returns problems, a sign-off request, or the next stage.
export function submit(jobId, now = Date.now()) {
  const job = loadJob(jobId); if (!job) throw new Error(`No job ${jobId}`);
  const proc = loadProcess(job.process), stage = stageOf(proc, job);
  if (job.status !== "in_progress") return { problems: [`${jobId} is ${job.status}, not in progress`] };
  if (Number.isFinite(job.not_before) && now < job.not_before) return { problems: [`stage ${stage.id} starts ${stamp(job.not_before)}; it waits so the data can settle`] };
  const problems = [];
  for (const f of stage.makes ?? []) {
    if (f.endsWith("/*")) { if (!expand(job.folder, [f]).length) problems.push(`missing files in ${path.posix.join(job.folder, f.slice(0, -2))}/`); }
    else if (!fs.existsSync(path.join(ROOT, job.folder, f))) problems.push(`missing ${path.posix.join(job.folder, f)}`);
  }
  // Files the owner signed off earlier must still be exactly those files (for example the final video before it is uploaded).
  for (const f of expand(job.folder, stage.requires_signed ?? [])) if (!signedOff(job.folder, f)) problems.push(`${path.posix.join(job.folder, f)} is not the version the owner signed off`);
  if ((stage.requires_signed ?? []).some(f => f.endsWith("/*") && !expand(job.folder, [f]).length)) problems.push("no signed-off files found to launch");
  for (const c of stage.checks ?? []) {
    const r = job.checks[stage.id]?.[c];
    if (!r) problems.push(`check ${c} has not run`); else if (r.verdict !== "PASS") problems.push(`check ${c} says FIX: ${r.note}`);
  }
  if (stage.access === "publish") problems.push(...publishProblems(job, stage));
  if (problems.length) return { problems };
  if (stage.gate === "owner") {
    const hash = filesHash(job.folder, stage.makes ?? []);
    job.pending_gate = { stage: stage.id, hash, code: shortCode(sha256(job.id + stage.id + hash)) };
    job.status = "waiting_owner";
    job.history.push({ at: stamp(now), event: "waiting for owner sign-off", stage: stage.id });
    saveJob(job);
    trace({ kind: "signoff_shown", job: job.id, parent: job.parent, stage: stage.id, agent: stage.agent, code: job.pending_gate.code, hash, files: fileHashes(job.folder, stage.makes ?? []) }, now);
    return { signoff: job.pending_gate, job };
  }
  return advance(job, proc, now);
}

// Called only by the prompt hook with the owner's own words.
export function signOff(words, by = "owner", now = Date.now()) {
  const code = parseYes(words);
  if (!code) return null;
  const job = allJobs().find(j => j.pending_gate?.code === code);
  if (!job) return { code, found: false };
  const proc = loadProcess(job.process), stage = stageOf(proc, job);
  if (filesHash(job.folder, stage.makes ?? []) !== job.pending_gate.hash) {
    job.pending_gate = null; job.status = "in_progress";
    job.history.push({ at: stamp(now), event: "sign-off refused: files changed after the code was shown", stage: stage.id });
    saveJob(job);
    trace({ kind: "check", job: job.id, parent: job.parent, stage: stage.id, agent: "board", check: "signed-files-unchanged", verdict: "FIX", by: "script", maker: stage.agent, check_kind: "script", note: "files changed after the sign-off code was shown" }, now);
    return { code, found: true, changed: true, job: job.id };
  }
  job.signoffs[stage.id] = { by, words: String(words).slice(0, 500), at: stamp(now), hash: job.pending_gate.hash, files: fileHashes(job.folder, stage.makes ?? []) };
  job.history.push({ at: stamp(now), event: `signed off by ${by}`, stage: stage.id });
  trace({ kind: "signoff_given", job: job.id, parent: job.parent, stage: stage.id, agent: by, by, code, hash: job.pending_gate.hash, files: job.signoffs[stage.id].files, note: String(words).slice(0, 200) }, now);
  const r = advance(job, proc, now);
  return { code, found: true, job: job.id, stage: stage.id, next: r.job.status === "done" ? null : r.job.stage,
    handed_to: (r.handed_all ?? []).map(c => c.id).join(", ") || null, missing: r.missing ?? [] };
}

// The owner's own words asking for changes instead of signing off (called only by the prompt hook).
// The words count as a change request when they start like one ("change...", "no, ...", "make it shorter").
// The pending code stops working; the maker changes the work and submits again for a new code.
// If no job is waiting but a plan is, the request is written down against that plan.
export const CHANGE_WORDS = /^\s*(no\b|nope\b|not\b|change|fix|redo|re-do|revise|rewrite|edit|swap|replace|remove|drop|add|make it|make the|try again|instead|i don'?t|i do not|don'?t|do not|please change|can you change|could you change|less\b|more\b|shorter|longer|lower|raise|cut)/i;
export function requestChanges(words, by = "owner", now = Date.now()) {
  const text = String(words ?? "");
  if (!CHANGE_WORDS.test(text)) return null;
  const waiting = allJobs().filter(j => j.status === "waiting_owner" && j.pending_gate);
  const named = waiting.filter(j => text.includes(j.id));
  const pick = named.length === 1 ? named[0] : waiting.length === 1 ? waiting[0] : null;
  if (pick) {
    const stage = pick.pending_gate.stage;
    pick.pending_gate = null; pick.status = "in_progress";
    pick.history.push({ at: stamp(now), event: `owner asked for changes: ${text.slice(0, 300)}`, stage });
    saveJob(pick);
    trace({ kind: "changes_requested", job: pick.id, parent: pick.parent, stage, agent: by, by, reason: text.slice(0, 500), note: text.slice(0, 200) }, now);
    return { job: pick.id, stage };
  }
  if (waiting.length > 1) {
    trace({ kind: "changes_requested", job: null, stage: null, agent: by, by, reason: text.slice(0, 500), note: `several jobs wait (${waiting.map(j => j.id).join(", ")}); ask which one` }, now);
    return { several: waiting.map(j => j.id) };
  }
  const st = loadState(), open = Object.values(st.plans).filter(p => !st.approvals[p.id] && Date.parse(p.created_at) > now - DAY);
  const plan = open.find(p => text.includes(p.code) || text.includes(p.id)) ?? (open.length === 1 ? open[0] : null);
  if (!plan) return null;
  trace({ kind: "changes_requested", job: plan.job ?? null, plan: plan.id, agent: by, by, reason: text.slice(0, 500), note: text.slice(0, 200) }, now);
  return { plan: plan.id, job: plan.job ?? null };
}

// Stop a job and say why, so the orchestrator can ask the owner or send the work elsewhere.
export function block(jobId, reason, note, by = null, now = Date.now()) {
  const job = loadJob(jobId); if (!job) throw new Error(`No job ${jobId}`);
  if (!BLOCK_REASONS.includes(reason)) throw new Error(`reason must be one of: ${BLOCK_REASONS.join(", ")}`);
  if (job.status === "done") throw new Error(`${jobId} is done; nothing to block`);
  if (!String(note ?? "").trim()) throw new Error("say in plain words what is missing or wrong");
  const proc = loadProcess(job.process), agent = by ?? (proc ? stageOf(proc, job)?.agent : null) ?? null;
  job.status = "blocked"; job.pending_gate = null;
  job.blocked = { reason, note: String(note).slice(0, 500), stage: job.stage, by: agent, at: stamp(now) };
  job.history.push({ at: stamp(now), event: `blocked (${reason}): ${String(note).slice(0, 300)}`, stage: job.stage });
  saveJob(job);
  trace({ kind: "blocked", job: job.id, parent: job.parent, stage: job.stage, agent, reason, note }, now);
  return job;
}
export function unblock(jobId, note, by = null, now = Date.now()) {
  const job = loadJob(jobId); if (!job) throw new Error(`No job ${jobId}`);
  if (job.status !== "blocked") throw new Error(`${jobId} is ${job.status}, not blocked`);
  if (!String(note ?? "").trim()) throw new Error("say what changed so the job can carry on");
  const was = job.blocked, proc = loadProcess(job.process);
  job.status = "in_progress"; job.blocked = null;
  job.history.push({ at: stamp(now), event: `unblocked (was ${was?.reason}): ${String(note).slice(0, 300)}`, stage: job.stage });
  saveJob(job);
  trace({ kind: "stage_start", job: job.id, parent: job.parent, stage: job.stage, agent: by ?? (proc ? stageOf(proc, job)?.agent : null) ?? null, process: job.process, resumed: true, note: `unblocked: ${String(note).slice(0, 200)}` }, now);
  return job;
}

export function describe(job, now = Date.now()) {
  const proc = loadProcess(job.process);
  if (!proc) return `${job.id}  ${job.title}  [${job.process}: process not installed]`;
  const i = proc.stages.findIndex(s => s.id === job.stage), stage = proc.stages[i];
  const where = job.status === "done" ? "done" : `stage ${i + 1} of ${proc.stages.length}: ${stage.name ?? stage.id} (${stage.agent})`;
  const later = job.status === "in_progress" && Number.isFinite(job.not_before) && now < job.not_before ? `  Starts ${stamp(job.not_before)}` : "";
  const stop = job.status === "blocked" ? `  Blocked (${job.blocked?.reason}): ${job.blocked?.note} Ask the owner or send it to the right process.` : "";
  const wait = job.status === "waiting_owner" ? `  Waiting for you: reply "yes ${job.pending_gate.code}" to sign off ${expand(job.folder, stage.makes ?? []).map(f => path.posix.join(job.folder, f)).join(", ")}` : "";
  return `${job.id}  ${job.title}  [${proc.name}]  ${where}${later}${wait}${stop}`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), byAt = args.indexOf("--by"), by = byAt >= 0 ? args[byAt + 1] : null;
  const [cmd, a, b, c, d] = byAt >= 0 ? args.filter((_, i) => i !== byAt && i !== byAt + 1) : args;
  try {
    if (cmd === "new") console.log(describe(newJob(a, b ?? a)));
    else if (cmd === "status") console.log((a ? [loadJob(a)].filter(Boolean) : allJobs()).map(j => describe(j)).join("\n") || "No jobs yet.");
    else if (cmd === "next") {
      const now = Date.now();
      const ready = allJobs().filter(j => j.status === "in_progress" && !(Number.isFinite(j.not_before) && now < j.not_before) && loadProcess(j.process))
        .filter(j => !a || stageOf(loadProcess(j.process), j).agent === a);
      console.log(ready.map(j => describe(j)).join("\n") || "Nothing ready.");
    } else if (cmd === "check") { recordCheck(a, b, c, d ?? "", by); console.log("Recorded."); }
    else if (cmd === "run-check") { const r = runCheck(a, b, c ?? null); console.log(`${r.verdict}: ${r.note}`); process.exit(r.verdict === "PASS" ? 0 : 1); }
    else if (cmd === "submit") {
      const r = submit(a);
      if (r.problems) { console.log("Not finished yet:\n- " + r.problems.join("\n- ")); process.exit(1); }
      if (r.signoff) console.log(`${describe(r.job)}\n\nShow the owner the files above. To sign off exactly these files, they reply: yes ${r.signoff.code}`);
      else console.log(describe(r.job) + ((r.handed_all ?? []).length ? `\nHanded to ${r.handed_all.map(x => `${x.id} (${x.process})`).join(", ")}` : "") + ((r.missing ?? []).length ? `\nNot handed to ${r.missing.join(", ")}: not installed` : ""));
    } else if (cmd === "block") { console.log(describe(block(a, b, c, by))); }
    else if (cmd === "unblock") { console.log(describe(unblock(a, b, by))); }
    else console.log("Commands: new <process> \"<title>\" | status [jobId] | next [agent] | check <jobId> <check> PASS|FIX \"<note>\" --by <reviewer> | run-check <jobId> <check> [\"<full command>\"] | submit <jobId> | block <jobId> <reason> \"<note>\" | unblock <jobId> \"<what changed>\"");
  } catch (e) { console.log(e.message); process.exit(1); }
}
