#!/usr/bin/env node
// job.mjs (AI Blocks) - version 1.0.0
//
// The step tracker for one job. The method's steps live here as data, so the order is kept by code, not memory:
//   node tools/job.mjs start --depth <light|standard|full|team|one-shot> --kind <family> [--brief <file>] [--force]
//                          writes context/job.json: the depth, the kind of work and the steps for that depth
//   node tools/job.mjs next                       the next open step: what to do, the exact command, the proof
//   node tools/job.mjs done <step> [--evidence <file>] [--skip "<reason>"]
//                          marks a step done once its proof is there, or skipped with the reason said out loud
//                          (node tools/job.mjs skip <step> "<reason>" is the same as done <step> --skip "<reason>")
//   node tools/job.mjs status [--json]            what is done, what is left, which checks ran, repair rounds used
//
// --kind is a family from tools/quality/profiles.json (paid-social-ads, lifecycle-email, analysis-memo, ...). It
// decides whether the work is buyer-facing (then the org context step is in at every depth) and which checks
// qe-check requires. A step's proof is a file it writes, a passing tool run in the job log (context/job-log.jsonl,
// written by the tools themselves), or an --evidence file. "done" refuses a step whose proof is missing, so a check
// cannot be marked as run when it did not run. Any step can be skipped with a reason; the reason shows in status
// and belongs in the hand-over.
// Loop limits: two repair rounds per check, then stop and hand over with the gap labelled. The same check failing
// on the same thing twice in a row is stuck: stop editing that part and label the gap. Fresh reviews are capped by
// depth.
// Plain Node 18+. Reads and writes local files only; opens no network connection.
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "1.0.0";

/**
 * The method as data: every step once, then the steps each depth runs, in order. Keep this in line with
 * METHOD.md (one step table per depth). Step fields:
 *   title    a short name
 *   do       what to do, in plain words
 *   run      the command, if a tool does it ({kind}, {brief}, {final}, {plain} are filled in where known)
 *   proof    what "done" needs: { file } a file in the context folder; { log, cmd } a passing run of that tool (or of
 *            an old name for it in `also`) in
 *            the job log since the job started; { evidence: true } an --evidence file. No proof: done is your word.
 *   when     "buyer-facing": only in jobs whose kind is buyer-facing
 *   fresh    true: a fresh review (counts toward the depth's cap)
 *   repair   true: a check that sends the work back for repair (counts repair rounds)
 */
export const METHOD = Object.freeze({
  repair_rounds: 2,
  steps: {
    intake: {
      title: "Ask or start",
      do: "Run the readiness check in METHOD.md. A specific brief starts; a gap that would change the work gets questions first (each with a default). Write the owner's answers, in their words, in context/intake.md.",
      run: "node tools/make-rubric.mjs template",
      proof: { file: "intake.md" },
    },
    assume: {
      title: "Decide the open points",
      do: "Nobody can reply, so ask nothing. Write context/intake.md from the brief alone, deciding each open point the way a top practitioner would. Work at level 1 (read and draft): nothing is sent, spent or published.",
      run: "node tools/make-rubric.mjs template",
      proof: { file: "intake.md" },
    },
    frame: {
      title: "Spec sheet",
      do: "Write context/spec.md, one screen: the job, each deliverable with its count and format, the signals in the owner's data that change the decision (as many as the data holds, or none), the depth, assumptions that change what to do, and the mode (patch, extend or new).",
      run: null,
      proof: { file: "spec.md" },
    },
    rubric: {
      title: "Rubric",
      do: "Turn the intake into the rubric the work is judged on.",
      run: "node tools/make-rubric.mjs",
      proof: { file: "rubric.md" },
    },
    brand: {
      title: "Org context gate",
      do: "Buyer-facing work never skips the org context. Build or check it, then run the gate and save its output as the evidence.",
      run: "node tools/org-context.mjs gate --for {kind}",
      proof: { log: "org-context", also: ["brand-brain"], cmd: "gate", evidence: true },
      when: "buyer-facing",
    },
    ground: {
      title: "Ground",
      do: "Gather only what the decision needs from the owner's data and your pack's knowledge. Write the facts with a source and a date in context/facts.md.",
      run: "node tools/prepare-job.mjs {brief}",
      proof: { file: "facts.md" },
    },
    draft: {
      title: "Expert draft and plain draft",
      do: "Write the expert draft from the job skill and its card, and a plain one-pass answer from the brief alone (the yardstick). No third draft at this depth.",
      run: null,
      proof: null,
    },
    "draft-full": {
      title: "Expert, creative and plain drafts",
      do: "Write the expert draft, one distinct creative draft (only when a real alternative could beat the playbook), and a plain one-pass answer from the brief alone.",
      run: null,
      proof: null,
    },
    choose: {
      title: "Fresh pick between drafts",
      do: "A fresh reviewer who has not seen your reasoning picks the base draft and names grafts. Give each sheet to its own fresh reader.",
      run: "node tools/blind-review.mjs prepare --brief {brief} <draft-1> <draft-2> [<draft-3>]  then  node tools/blind-review.mjs tally",
      proof: { log: "blind-review", cmd: "tally" },
      fresh: true,
    },
    parts: {
      title: "Helpers write their parts",
      do: "Brief each helper with the context to read, the decisions already fixed, the done-test and the shape to return. Check every return against its done-test. A handover never raises any helper's access.",
      run: "node tools/check-team.mjs",
      proof: { log: "check-team", evidence: true },
    },
    integrate: {
      title: "Merge into one piece",
      do: "Merge the parts into one voice and one length budget, and write the plain answer from the brief alone beside it.",
      run: null,
      proof: null,
    },
    finish: {
      title: "Finish the format",
      do: "Finish the native piece: every field, count and link the channel needs, the owner's limit kept, then a clarity edit (short sentences, nothing padded).",
      run: null,
      proof: null,
    },
    check: {
      title: "Run the checks",
      do: "Run every text check on the final. Fix each failure and run it again: two repair rounds at most.",
      run: "node tools/quality/qe-check.cjs {final} --profile {kind} --brief {brief} --plain {plain}",
      proof: { log: "qe-check", cmd: "check" },
      repair: true,
    },
    pick: {
      title: "Fresh final pick",
      do: "A fresh reader chooses between the anonymous final and the plain answer. If plain wins with no fact errors, ship plain, edited. With no fresh reader, skip with the reason SAME-CONTEXT and say so in the hand-over.",
      run: "node tools/blind-review.mjs prepare --brief {brief} {final} {plain}  then  node tools/blind-review.mjs tally",
      proof: { log: "blind-review", cmd: "tally" },
      fresh: true,
    },
    scorecard: {
      title: "Scorecard",
      do: "Score the final against every rubric line (a fresh reader scores it if you have one; write \"Scored by:\" on the card).",
      run: "node tools/make-rubric.mjs check <scorecard file>",
      proof: { log: "make-rubric", cmd: "check" },
      repair: true,
    },
    handover: {
      title: "Hand over",
      do: "The native work first. For a multi-file handoff, check each delivered entry with tools/check-handover.mjs <entry> --bundle-root <delivered folder>, then open a relocated copy. Include the small reproduce/verification files promised to the receiver; do not link to absent working context or pack tools. Document private external inputs by contract/source/hash without copying sensitive working data; creator-only checks remain historical verification. The static check does not replace browser or dynamic-dependency checks. In your own message, never inside the work: the scorecard, any SAME-CONTEXT label, and every skipped step with its reason. Save a lesson only with an outside signal (the owner's answer, a check that failed then passed, a blind-review loss).",
      run: "node tools/job.mjs status",
      proof: null,
    },
  },
  depths: {
    light: { fresh_reviews: 1, steps: ["intake", "frame", "rubric", "brand", "ground", "draft", "finish", "check", "pick", "scorecard", "handover"] },
    standard: { fresh_reviews: 1, steps: ["intake", "frame", "rubric", "brand", "ground", "draft", "finish", "check", "pick", "scorecard", "handover"] },
    full: { fresh_reviews: 2, steps: ["intake", "frame", "rubric", "brand", "ground", "draft-full", "choose", "finish", "check", "pick", "scorecard", "handover"] },
    team: { fresh_reviews: 2, steps: ["intake", "frame", "rubric", "brand", "ground", "parts", "integrate", "choose", "finish", "check", "pick", "scorecard", "handover"] },
    "one-shot": { fresh_reviews: 1, access_level: 1, steps: ["assume", "frame", "rubric", "brand", "draft", "finish", "check", "pick", "scorecard", "handover"] },
  },
});

export const DEPTHS = Object.freeze(Object.keys(METHOD.depths));
const JOB_SCHEMA = "ai-blocks-job/1";
const here = path.dirname(fileURLToPath(import.meta.url));

/** The quality families (tools/quality/profiles.json), or null when the pack has none. */
export function loadProfiles(dir = here) {
  try { return JSON.parse(fs.readFileSync(path.join(dir, "quality", "profiles.json"), "utf8")); } catch { return null; }
}

/** The step ids a job runs: the depth's list, with buyer-facing steps kept only for buyer-facing work. */
export function planSteps(depth, buyerFacing) {
  const d = METHOD.depths[depth];
  if (!d) throw new Error(`Unknown depth "${depth}"`);
  return d.steps.filter(id => METHOD.steps[id].when !== "buyer-facing" || buyerFacing);
}

/** A new job record. */
export function newJob({ depth, kind, buyerFacing, brief = null, now = new Date(), id } = {}) {
  return {
    schema: JOB_SCHEMA,
    tool_version: VERSION,
    id: id ?? `${now.toISOString().slice(0, 10)}-${randomBytes(3).toString("hex")}`,
    started: now.toISOString(),
    updated: now.toISOString(),
    depth,
    kind,
    buyer_facing: !!buyerFacing,
    access_level: METHOD.depths[depth].access_level ?? null,
    brief,
    fresh_reviews_cap: METHOD.depths[depth].fresh_reviews,
    repair_rounds_cap: METHOD.repair_rounds,
    steps: planSteps(depth, buyerFacing).map(id => ({ id, status: "open" })),
    finished: null,
  };
}

/** The log lines that belong to this job: tagged with its id, or untagged and written after it started. */
export function jobEvents(job, events) {
  return events.filter(e => e.job === job.id || (!e.job && e.ts >= job.started));
}

/** Repair rounds per check tool, the stuck flag, and the fresh reviews used, from the job's log lines. */
export function loopState(job, events) {
  const mine = jobEvents(job, events);
  const repairTools = [...new Set(Object.values(METHOD.steps).filter(s => s.repair && s.proof?.log).map(s => `${s.proof.log}:${s.proof.cmd ?? ""}`))];
  const rounds = {}, stuck = [];
  for (const key of repairTools) {
    const [tool, cmd] = key.split(":");
    const runs = mine.filter(e => e.tool === tool && (!cmd || e.cmd === cmd));
    const fails = runs.filter(e => e.result === "FAIL");
    rounds[tool] = fails.length;
    // Stuck: the last two runs both failed on the same thing (same failing checks, same hits).
    const last = runs.slice(-2);
    if (last.length === 2 && last.every(e => e.result === "FAIL")) {
      const sig = e => JSON.stringify((e.checks ?? []).filter(c => c.status === "FAIL").map(c => [c.name, c.hit ?? ""]).sort());
      if (sig(last[0]) === sig(last[1]) && sig(last[0]) !== "[]") stuck.push(tool);
    }
  }
  const fresh = mine.filter(e => e.tool === "blind-review" && e.cmd === "prepare").length;
  return { rounds, stuck, fresh, over: Object.entries(rounds).filter(([, n]) => n > job.repair_rounds_cap).map(([t]) => t) };
}

/** Whether a step's proof is there. Returns { ok, why, evidence }. */
export function checkProof(job, stepId, { context = "context", events = [], evidence = null } = {}) {
  const step = METHOD.steps[stepId], proof = step?.proof;
  if (!proof) return { ok: true, why: "no proof needed" };
  // An evidence file stands in only where the step allows it. It never stands in for a file the step must write or
  // for a check tool that logs its own runs: those prove themselves.
  if (evidence) {
    if (!fs.existsSync(evidence)) return { ok: false, why: `the evidence file ${evidence} does not exist` };
    if (proof.evidence) return { ok: true, why: `evidence ${evidence}` };
  }
  if (proof.file) {
    const f = path.join(context, proof.file);
    return fs.existsSync(f) ? { ok: true, why: `${f} exists` } : { ok: false, why: `${f} does not exist yet` };
  }
  if (proof.log) {
    const runs = jobEvents(job, events).filter(e => (e.tool === proof.log || (proof.also ?? []).includes(e.tool)) && (!proof.cmd || e.cmd === proof.cmd));
    const last = runs.at(-1);
    if (last?.result === "PASS") return { ok: true, why: `${proof.log}${proof.cmd ? ` ${proof.cmd}` : ""} passed at ${last.ts}` };
    if (last) return { ok: false, why: `the last ${proof.log}${proof.cmd ? ` ${proof.cmd}` : ""} run ${last.result === "FAIL" ? "failed" : `ended ${last.result}`} (${last.ts}). Repair the work, run it again, then mark the step done` };
    if (proof.evidence) return { ok: false, why: `no ${proof.log} run in the job log since the job started. Run it, or give --evidence <file> with its saved output` };
    return { ok: false, why: `no ${proof.log}${proof.cmd ? ` ${proof.cmd}` : ""} run in the job log since the job started. Run it first` };
  }
  return { ok: false, why: "give --evidence <file>" };
}

/** A step's command with what the job knows filled in. */
export function commandFor(job, stepId) {
  const run = METHOD.steps[stepId]?.run;
  if (!run) return null;
  return run.replaceAll("{kind}", job.kind).replaceAll("{brief}", job.brief?.file ?? "<owner brief>").replaceAll("{final}", "<final>").replaceAll("{plain}", "<plain answer>");
}

/** What to do next, as lines of text. */
export function nextText(job, events) {
  const loop = loopState(job, events);
  const open = job.steps.filter(s => s.status === "open");
  const lines = [];
  // Loop warnings only while the step that runs that tool is still open.
  const openTool = t => open.some(s => METHOD.steps[s.id].proof?.log === t);
  loop.stuck = loop.stuck.filter(openTool);
  loop.over = loop.over.filter(t => openTool(t) && !loop.stuck.includes(t));
  for (const t of loop.stuck) lines.push(`Stuck: ${t} failed twice in a row on the same thing. Stop editing that part. Hand over with the gap labelled in your own message, and mark the step skipped with that reason.`);
  for (const t of loop.over) lines.push(`Repair limit: ${t} has failed ${loop.rounds[t]} times; the limit is ${job.repair_rounds_cap} repair rounds. Stop editing. Hand over with the gap labelled, and mark the step skipped with that reason.`);
  const freshLimit = job.fresh_reviews_cap + job.repair_rounds_cap;
  if (loop.fresh > freshLimit) lines.push(`Fresh reviews: ${loop.fresh} used. At ${job.depth} depth the limit is ${job.fresh_reviews_cap}, plus ${job.repair_rounds_cap} rechecks after repairs. Do not start another; decide with what you have.`);
  if (!open.length) {
    lines.push(`All ${job.steps.length} steps are closed${job.steps.some(s => s.status === "skipped") ? `, ${job.steps.filter(s => s.status === "skipped").length} of them skipped (say each reason in the hand-over)` : ""}.`);
    return lines;
  }
  const s = open[0], step = METHOD.steps[s.id], n = job.steps.indexOf(s) + 1;
  lines.push(`Next: step ${n} of ${job.steps.length}, ${s.id} (${step.title})`, `Do: ${step.do}`);
  const cmd = commandFor(job, s.id);
  if (cmd) lines.push(`Run: ${cmd}`);
  if (step.repair && loop.rounds[step.proof.log]) lines.push(`Repair round ${Math.min(loop.rounds[step.proof.log], job.repair_rounds_cap)} of ${job.repair_rounds_cap} used for ${step.proof.log}.`);
  const p = step.proof;
  lines.push(`Proof: ${!p ? "none needed; done is your word" : p.file ? `context/${p.file}` : p.log ? `a passing ${p.log}${p.cmd ? ` ${p.cmd}` : ""} run in the job log${p.evidence ? ", or --evidence <file>" : ""}` : "--evidence <file>"}`);
  lines.push(`Then: node tools/job.mjs done ${s.id}`);
  return lines;
}

// ---------- files ----------
const jobFile = context => path.join(context, "job.json");
export function readJob(context = "context") {
  try { return JSON.parse(fs.readFileSync(jobFile(context), "utf8")); } catch { return null; }
}
function writeJob(context, job) {
  fs.mkdirSync(context, { recursive: true });
  const tmp = `${jobFile(context)}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(job, null, 2)}\n`);
  fs.renameSync(tmp, jobFile(context));
}

// The job log (tools/log-event.mjs) is optional: without it, steps proved by a tool run need --evidence or --skip.
let jobLog = null;
try { jobLog = await import("./log-event.mjs"); } catch { /* no log-event.mjs beside this tool */ }
const readEvents = context => { try { return jobLog?.readLog(context) ?? []; } catch { return []; } };
const hashOf = file => { try { return jobLog?.hashFile(file) ?? { file }; } catch { return { file }; } };
const log = (context, event) => { try { jobLog?.logEvent({ tool: "job", version: VERSION, context, ...event }); } catch { /* never stops the tool */ } };

// ---------- command line ----------
function parse(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const eq = a.startsWith("--") ? a.indexOf("=") : -1;
    const name = eq > 0 ? a.slice(0, eq) : a, inline = eq > 0 ? a.slice(eq + 1) : undefined;
    if (["--depth", "--kind", "--brief", "--evidence", "--skip", "--context"].includes(name)) {
      const v = inline ?? argv[++i];
      if (v === undefined || (inline === undefined && v.startsWith("--"))) throw new Error(`${name} needs a value`);
      o[name.slice(2)] = v;
    } else if (["--json", "--force", "--buyer-facing", "--help", "-h"].includes(name)) o[name.replace(/^-+/, "")] = true;
    else if (a.startsWith("--")) throw new Error(`Unknown option ${a}`);
    else o._.push(a);
  }
  return o;
}

const USAGE = "Usage: node tools/job.mjs start --depth <light|standard|full|team|one-shot> --kind <family> [--brief <file>] [--force]\n       node tools/job.mjs next | status [--json]\n       node tools/job.mjs done <step> [--evidence <file>] [--skip \"<reason>\"]\n       node tools/job.mjs skip <step> \"<reason>\"";

export function main(argv = process.argv.slice(2), print = console.log, error = console.error) {
  let o;
  try { o = parse(argv); } catch (e) { error(`${e.message}\n${USAGE}`); return 2; }
  const cmd = o._[0], context = o.context ?? "context";
  if (o.help || o.h || !cmd) { print(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1).filter((l, i, all) => all.slice(0, i + 1).every(x => x.startsWith("//"))).map(l => l.replace(/^\/\/ ?/, "")).join("\n")); return cmd || o.help || o.h ? 0 : 2; }

  if (cmd === "start") {
    if (!o.depth || !DEPTHS.includes(o.depth)) { error(`--depth must be one of ${DEPTHS.join(", ")}.\n${USAGE}`); return 2; }
    if (!o.kind) { error(`--kind names the family of work (tools/quality/profiles.json).\n${USAGE}`); return 2; }
    const profiles = loadProfiles();
    if (profiles && !Object.hasOwn(profiles, o.kind)) { error(`Unknown kind "${o.kind}". Families: ${Object.keys(profiles).join(", ")}`); return 2; }
    if (o.brief && !fs.existsSync(o.brief)) { error(`Cannot read the brief ${o.brief}`); return 2; }
    const old = readJob(context);
    if (old && !old.finished && !o.force) { error(`A job is under way in ${jobFile(context)} (${old.id}, ${old.depth}, ${old.kind}). Finish it, or start again with --force (the old one is kept as job-${old.id}.json).`); return 2; }
    if (old && o.force) { try { fs.renameSync(jobFile(context), path.join(context, `job-${old.id}.json`)); } catch { /* nothing to keep */ } }
    const buyerFacing = !!o["buyer-facing"] || !!profiles?.[o.kind]?.buyer_facing;
    const job = newJob({ depth: o.depth, kind: o.kind, buyerFacing, brief: o.brief ? hashOf(o.brief) : null });
    writeJob(context, job);
    log(context, { cmd: "start", args: argv.slice(1), inputs: [o.brief], result: "PASS", counts: { depth: o.depth, kind: o.kind, steps: job.steps.length, buyer_facing: buyerFacing } });
    print([`Started job ${job.id}: ${job.depth} depth, ${job.kind}${buyerFacing ? " (buyer-facing)" : ""}, ${job.steps.length} steps. Wrote ${jobFile(context)}.`,
      ...(job.access_level === 1 ? ["One-shot: work at level 1 (read and draft). Nothing is sent, spent or published."] : []),
      `Steps: ${job.steps.map(s => s.id).join(", ")}.`, "", ...nextText(job, readEvents(context))].join("\n"));
    return 0;
  }

  const job = readJob(context);
  if (!job) { error(`No job under way: ${jobFile(context)} does not exist. Start one: node tools/job.mjs start --depth <depth> --kind <family>`); return 2; }
  const events = readEvents(context);

  if (cmd === "next") { print(nextText(job, events).join("\n")); return 0; }

  // "skip <step> <reason>" is the same as "done <step> --skip <reason>".
  if (cmd === "skip") {
    if (o.skip === undefined) o.skip = o._.slice(2).join(" ");
  }
  if (cmd === "done" || cmd === "skip") {
    const id = o._[1];
    const entry = job.steps.find(s => s.id === id);
    if (!id || !entry) { error(`Name a step of this job: ${job.steps.map(s => s.id).join(", ")}.\n${USAGE}`); return 2; }
    const now = new Date().toISOString();
    if (o.skip !== undefined) {
      const reason = String(o.skip).trim();
      if (reason.length < 8) { error("Say why the step is skipped, in a few words the owner would understand (--skip \"<reason>\")."); return 2; }
      Object.assign(entry, { status: "skipped", at: now, reason, ...(o.evidence ? { evidence: [hashOf(o.evidence)] } : {}) });
    } else {
      const p = checkProof(job, id, { context, events, evidence: o.evidence });
      if (!p.ok) {
        log(context, { cmd: "done", args: [id], result: "FAIL", counts: { step: id } });
        error(`Not done: ${id} needs its proof: ${p.why}.\nIf it truly cannot be done, skip it with the reason: node tools/job.mjs done ${id} --skip "<reason>"`);
        return 1;
      }
      Object.assign(entry, { status: "done", at: now, proof: p.why, ...(o.evidence ? { evidence: [hashOf(o.evidence)] } : {}) });
      delete entry.reason;
    }
    job.updated = now;
    const earlier = job.steps.slice(0, job.steps.indexOf(entry)).filter(s => s.status === "open").map(s => s.id);
    if (job.steps.every(s => s.status !== "open")) job.finished = now;
    writeJob(context, job);
    log(context, { cmd: entry.status === "skipped" ? "skip" : "done", args: [id], inputs: [o.evidence], result: "PASS", counts: { step: id } });
    print([`${entry.status === "skipped" ? "Skipped" : "Done"}: ${id}${entry.status === "skipped" ? ` (${entry.reason})` : ""}.`,
      ...(earlier.length ? [`Note: earlier steps are still open: ${earlier.join(", ")}.`] : []), "", ...nextText(job, readEvents(context))].join("\n"));
    return 0;
  }

  if (cmd === "status") {
    const loop = loopState(job, events);
    const mine = jobEvents(job, events).filter(e => e.tool !== "job");
    if (o.json) { print(JSON.stringify({ ...job, loop, runs: mine.map(e => ({ ts: e.ts, tool: e.tool, cmd: e.cmd, result: e.result })), next: job.steps.find(s => s.status === "open")?.id ?? null }, null, 1)); return 0; }
    const mark = s => (s.status === "done" ? "[x]" : s.status === "skipped" ? "[-]" : "[ ]");
    const lines = [
      `Job ${job.id}: ${job.depth} depth, ${job.kind}${job.buyer_facing ? " (buyer-facing)" : ""}, started ${job.started}${job.finished ? `, closed ${job.finished}` : ""}.`,
      ...(job.access_level === 1 ? ["Access: level 1 only (read and draft)."] : []),
      ...job.steps.map(s => `${mark(s)} ${s.id.padEnd(10)} ${METHOD.steps[s.id].title}${s.status === "skipped" ? `  (skipped: ${s.reason})` : ""}`),
      `Tool runs logged for this job: ${mine.length ? mine.map(e => `${e.tool}${e.cmd ? ` ${e.cmd}` : ""} ${e.result}`).join("; ") : "none"}.`,
      `Repair rounds: ${Object.entries(loop.rounds).map(([t, n]) => `${t} ${n} of ${job.repair_rounds_cap}`).join(", ")}.${loop.stuck.length ? ` Stuck: ${loop.stuck.join(", ")}.` : ""}`,
      `Fresh reviews: ${loop.fresh} (the step table sets ${job.fresh_reviews_cap} at ${job.depth} depth; a recheck after a repair counts as a repair round).`,
      "",
      ...nextText(job, events),
      "",
      "If this chat is summarised, carry forward: the depth, the kind, the access level, the open steps, and the files context/job.json, context/intake.md, context/spec.md and context/rubric.md.",
    ];
    print(lines.join("\n"));
    return 0;
  }

  error(`Unknown command "${cmd}".\n${USAGE}`);
  return 2;
}

const invoked = !!process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = main();
