#!/usr/bin/env node
// make-rubric.mjs (AI Blocks) - version 1.1.0
//
// Turns the owner's intake answers into the rubric the work is judged on, then checks the hand-over scorecard.
//   node tools/make-rubric.mjs template                 print the intake file to fill in (context/intake.md)
//   node tools/make-rubric.mjs [build] [--intake <file>] [--out <file>] [--json]
//                                                       write context/rubric.md from context/intake.md
//   node tools/make-rubric.mjs check <scorecard file> [--rubric <file>] [--qe <qe-check --json file>] [--by fresh|same]
//                                                       every rubric line has a verdict and where it is met
//
// The check is strict, because the writer often fills the scorecard about its own work:
// - a pass-or-fail line (A, N, L, Q) passes only when "met" with where, or "n/a" with the reason it does not apply;
//   "partly" or "not met" fails, and so does a bare "n/a".
// - a scored line worth more than 10 points marked "not met" fails; the weighted score is printed (met counts in
//   full, partly half, n/a lines left out).
// - a Q or limit line marked "met" fails when the last qe-check run found that check failed (from --qe, or else the
//   job log, context/job-log.jsonl).
// - "Scored by:" in the scorecard (or --by) says who scored it. Unless a fresh reader did, the result is labelled
//   SAME-CONTEXT: the maker graded its own work, so the label goes in the hand-over.
//
// The rubric puts the owner first: what good looks like to them is half the score, weighted in the order they gave.
// Their asks, "never" items and limits are pass or fail, and so are our gates. Craft is the other half.
// Plain Node 18+. Reads and writes local files only; opens no network connection.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "1.1.0";
export const SECTIONS = Object.freeze({ good: "Good looks like", never: "Never", asks: "Asks", limits: "Limits" });
export const GATES = Object.freeze([
  "Every fact a buyer or the owner reads has a source; nothing is invented",
  "Every piece the owner asked for is delivered in full, none dropped or watered down",
  "The format is finished: every field, count and link the channel needs",
  "No placeholders, brackets, working notes or questions inside the work",
]);
export const CRAFT = Object.freeze([
  ["Does the job for the buyer or the decision", 30],
  ["Own material: ideas or proof drawn from this owner's data that a generic answer would lack", 10],
  ["Clear and no longer than its use needs", 10],
]);
export const TEMPLATE = `# Intake

Fill this from the owner's answers, one line each, in their words. Leave a section empty if they said "you decide".

## ${SECTIONS.good}
- (most important first, up to three)

## ${SECTIONS.never}
- (anything they never want to see)

## ${SECTIONS.asks}
- (each thing the brief asks for, with its count and format)

## ${SECTIONS.limits}
- (length, dates, budget, channels, must-include)

## Org context
- (saved / imported from <file or link> / built from <store URL> / not needed)
`;

const clean = l => l.replace(/^[-*]\s+/, "").replace(/^\[[ x]\]\s*/i, "").trim();
const placeholder = l => /^\(.*\)$/.test(l) || /^you decide\.?$/i.test(l);

/** The intake file's sections as lists of lines (template hints and "you decide" dropped). */
export function readIntake(text) {
  const out = { good: [], never: [], asks: [], limits: [], brand: [] };
  let key = null;
  for (const raw of String(text).split(/\r?\n/)) {
    const h = /^#{2,3}\s+(.+?)\s*$/.exec(raw);
    if (h) {
      const t = h[1].toLowerCase();
      key = t.startsWith("good") ? "good" : t.startsWith("never") ? "never" : t.startsWith("ask") ? "asks" : t.startsWith("limit") ? "limits" : t.startsWith("brand") ? "brand" : null;
      continue;
    }
    if (!key || !/^\s*[-*]\s+/.test(raw)) continue;
    const line = clean(raw.trim());
    if (line && !placeholder(line)) out[key].push(line);
  }
  return out;
}

/** Weights for the owner's items, in their order: 50 points, the first worth the most. */
export function ownerWeights(n) {
  if (!n) return [];
  const raw = Array.from({ length: n }, (_, i) => n - i), sum = raw.reduce((a, b) => a + b, 0);
  const w = raw.map(r => Math.round((r / sum) * 50));
  w[0] += 50 - w.reduce((a, b) => a + b, 0);
  return w;
}

/** The rubric as rows: id, kind (score or gate), weight, text. */
export function rubricRows(intake) {
  const rows = [];
  const good = intake.good.slice(0, 5), w = ownerWeights(good.length);
  good.forEach((t, i) => rows.push({ id: `G${i + 1}`, kind: "score", weight: w[i], part: "What good looks like to you", text: t }));
  intake.asks.forEach((t, i) => rows.push({ id: `A${i + 1}`, kind: "gate", weight: null, part: "Every ask", text: t }));
  intake.never.forEach((t, i) => rows.push({ id: `N${i + 1}`, kind: "gate", weight: null, part: "Never", text: t }));
  intake.limits.forEach((t, i) => rows.push({ id: `L${i + 1}`, kind: "gate", weight: null, part: "Limits", text: t }));
  GATES.forEach((t, i) => rows.push({ id: `Q${i + 1}`, kind: "gate", weight: null, part: "Our gates", text: t }));
  const craftScale = good.length ? 1 : 2; // with no owner items, craft carries the whole 100
  CRAFT.forEach(([t, n], i) => rows.push({ id: `C${i + 1}`, kind: "score", weight: n * craftScale, part: "Craft", text: t }));
  return rows;
}

export function rubricMarkdown(intake, { today = new Date().toLocaleDateString("en-CA") } = {}) {
  const rows = rubricRows(intake), parts = [...new Set(rows.map(r => r.part))];
  const out = [`# Rubric`, "", `Written ${today} from context/intake.md by make-rubric.mjs ${VERSION}. The work is checked against every line before hand-over.`, ""];
  if (!intake.good.length) out.push("The owner left \"what good looks like\" to us, so craft carries all 100 points.", "");
  for (const p of parts) {
    const rs = rows.filter(r => r.part === p), scored = rs[0].kind === "score";
    out.push(`## ${p}${scored ? "" : " (pass or fail)"}`, "", scored ? "| Id | Points | Line |" : "| Id | Line |", scored ? "|---|---|---|" : "|---|---|");
    for (const r of rs) out.push(scored ? `| ${r.id} | ${r.weight} | ${r.text} |` : `| ${r.id} | ${r.text} |`);
    out.push("");
  }
  out.push("## Scorecard at hand-over", "", "In your own message, after the work and never inside it, give one row per id above:", "", "| Id | Met? | Where |", "|---|---|---|", "| G1 | met | Email 1 subject and opening line |", "", `Then run: node tools/make-rubric.mjs check <scorecard file>. A gate that is not met goes back for repair (two rounds at most).`, "");
  return { text: out.join("\n"), rows };
}

/** Which qe-check rows can prove a pass-or-fail line wrong. Limit lines are matched only when they are about length. */
export const QE_PROOF = Object.freeze({ Q1: ["proof", "numbers"], Q3: ["format"], Q4: ["leakcheck", "handover"], L: ["limit"] });
const VERDICT = /^(met|partly|not met|n\/a)$/;
const normVerdict = v => String(v).replace(/[*_`]/g, "").replace(/[.!]+$/, "").trim().toLowerCase().replace(/^na$/, "n/a").replace(/^not-met$/, "not met");
const noReason = w => w.replace(/[*_`]/g, "").trim().length < 3 || /^(n\/a|na|none|-+|tbd|\?)$/i.test(w.trim());

/** Who scored the card: "fresh" only when the card (or --by) says a fresh reader did; anything else is same-context. */
export function scoredBy(scorecardText, by) {
  const said = by ?? (/^\s*\**\s*scored by\s*\**\s*:\s*\**\s*(.+)$/im.exec(String(scorecardText))?.[1] ?? "");
  const t = String(said).toLowerCase();
  if (/\b(same|maker|me|myself|self|writer|i did)\b/.test(t)) return "same";
  return /\b(fresh|second|independent|another|new chat|sub-?agent|reviewer|owner)\b/.test(t) ? "fresh" : "same";
}

/** Checks a scorecard against the rubric: each id needs a verdict (met, partly, not met, n/a) and a place or reason. */
export function checkScorecard(rubricText, scorecardText, { qe = null, by } = {}) {
  const body = String(rubricText).split(/^## Scorecard at hand-over/m)[0]; // the example row below is not a rubric line
  const want = [...new Set([...body.matchAll(/^\|\s*([GANLQC]\d+)\s*\|/gm)].map(m => m[1]))];
  const weights = new Map([...body.matchAll(/^\|\s*([GC]\d+)\s*\|\s*(\d+)\s*\|/gm)].map(m => [m[1], Number(m[2])]));
  const texts = new Map([...body.matchAll(/^\|\s*([GANLQC]\d+)\s*\|(?:\s*\d+\s*\|)?\s*([^|]*)\|/gm)].map(m => [m[1], m[2].trim()]));
  const rows = new Map();
  for (const m of String(scorecardText).matchAll(/^\|\s*([GANLQC]\d+)\s*\|\s*([^|]*)\|\s*([^|]*)\|/gm)) rows.set(m[1], { verdict: normVerdict(m[2]), where: m[3].trim() });
  const problems = [], failedGates = [], failedLines = [], reasons = {};
  const qeRows = new Map((qe ?? []).map(r => [r.name, r.status]));
  for (const id of want) {
    const r = rows.get(id), gate = /^[ANLQ]/.test(id);
    if (!r) { problems.push(`${id}: no row in the scorecard`); continue; }
    if (!VERDICT.test(r.verdict)) { problems.push(`${id}: verdict "${r.verdict}" (use met, partly, not met or n/a)`); continue; }
    if (r.verdict === "n/a" && noReason(r.where)) { problems.push(`${id}: n/a with no reason. Say why this line does not apply, or mark it met or not met`); continue; }
    if (r.verdict !== "n/a" && r.verdict !== "not met" && r.where.length < 3) problems.push(`${id}: say where it is met`);
    if (gate && (r.verdict === "partly" || r.verdict === "not met")) { failedGates.push(id); reasons[id] = `marked ${r.verdict}; a pass-or-fail line passes only when met`; continue; }
    if (!gate && r.verdict === "not met" && (weights.get(id) ?? 0) > 10) { failedLines.push(id); reasons[id] = `marked not met and worth ${weights.get(id)} points`; continue; }
    if (gate && r.verdict === "met" && qeRows.size) {
      const proof = id.startsWith("L") ? (/\b(words?|length|long|characters?|chars?|pages?)\b/i.test(texts.get(id) ?? "") ? QE_PROOF.L : []) : QE_PROOF[id] ?? [];
      const failed = proof.filter(n => qeRows.get(n) === "FAIL");
      if (failed.length) { failedGates.push(id); reasons[id] = `marked met, but qe-check ${failed.join(" and ")} failed`; }
    }
  }
  // Weighted score: met counts in full, partly half, not met nothing; n/a lines are left out and the rest rescaled.
  let got = 0, of = 0;
  for (const [id, w] of weights) {
    const v = rows.get(id)?.verdict;
    if (v === "n/a") continue;
    of += w;
    got += v === "met" ? w : v === "partly" ? w / 2 : 0;
  }
  const score = of ? Math.round((got / of) * 100) : null;
  const who = scoredBy(scorecardText, by);
  return { ok: !problems.length && !failedGates.length && !failedLines.length, ids: want, problems, failedGates, failedLines, reasons, score, scoredBy: who, sameContext: who !== "fresh" };
}

/** The check rows of a qe-check report: its --json output, or a job-log line from qe-check. */
export function qeRowsOf(report) {
  if (!report) return null;
  const rows = report.rows ?? report.checks;
  return Array.isArray(rows) ? rows.map(r => ({ name: String(r.name), status: String(r.status) })) : null;
}

// ---------- command line ----------
// The job log (tools/log-event.mjs) is optional: a pack without it still runs every command.
let jobLog = null;
try { jobLog = await import("./log-event.mjs"); } catch { /* no log-event.mjs beside this tool */ }
const log = (event) => { try { jobLog?.logEvent({ tool: "make-rubric", version: VERSION, ...event }); } catch { /* never stops the tool */ } };

function args(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") o.json = true; else if (a === "--help" || a === "-h") o.help = true;
    else if (["--intake", "--out", "--rubric", "--today", "--qe", "--by"].includes(a)) o[a.slice(2)] = argv[++i];
    else o._.push(a);
  }
  return o;
}
export function main(argv = process.argv.slice(2), print = console.log) {
  const o = args(argv), cmd = o._[0] && !o._[0].startsWith("-") ? o._[0] : "build";
  if (o.help) { print(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 23).map(l => l.replace(/^\/\/ ?/, "")).join("\n")); return 0; }
  if (cmd === "template") { print(TEMPLATE); return 0; }
  if (cmd === "build") {
    const file = o.intake || "context/intake.md";
    if (!fs.existsSync(file)) { console.error(`No ${file} yet. Ask the intake questions first (METHOD.md step 0), then write the answers there. Template: node tools/make-rubric.mjs template`); return 2; }
    const intake = readIntake(fs.readFileSync(file, "utf8"));
    const r = rubricMarkdown(intake, { today: o.today });
    const out = o.out || "context/rubric.md";
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(out, r.text);
    log({ cmd: "build", args: argv, inputs: [file, out], result: "PASS", context: path.dirname(out), counts: { scored: r.rows.filter(x => x.kind === "score").length, gates: r.rows.filter(x => x.kind === "gate").length } });
    if (o.json) print(JSON.stringify({ out, rows: r.rows }, null, 1));
    else print(`Wrote ${out}: ${r.rows.filter(x => x.kind === "score").length} scored lines, ${r.rows.filter(x => x.kind === "gate").length} pass-or-fail lines.${intake.asks.length ? "" : " No asks listed: add each thing the brief asks for under \"Asks\"."}\nShow the owner the spec sheet and this rubric together and ask: "Go, or change anything?"`);
    return 0;
  }
  if (cmd === "check") {
    const card = o._[1], rubric = o.rubric || "context/rubric.md";
    if (!card || !fs.existsSync(card)) { console.error("Give the scorecard file: node tools/make-rubric.mjs check <scorecard file>"); return 2; }
    if (!fs.existsSync(rubric)) { console.error(`No ${rubric}. Build it first: node tools/make-rubric.mjs`); return 2; }
    if (o.by && !/^(fresh|same)$/i.test(o.by)) { console.error("--by is fresh (a reader who has not seen your reasoning scored it) or same (you scored your own work)."); return 2; }
    const context = path.dirname(rubric);
    let qe = null, qeFrom = null;
    if (o.qe) {
      try { qe = qeRowsOf(JSON.parse(fs.readFileSync(o.qe, "utf8"))); qeFrom = o.qe; } catch { console.error(`Cannot read ${o.qe} as a qe-check --json report.`); return 2; }
    } else if (jobLog) {
      const last = jobLog.readLog(context).filter(e => e.tool === "qe-check").at(-1);
      if (last) { qe = qeRowsOf(last); qeFrom = `the last qe-check run in the job log (${last.ts})`; }
    }
    const r = checkScorecard(fs.readFileSync(rubric, "utf8"), fs.readFileSync(card, "utf8"), { qe, by: o.by?.toLowerCase() });
    log({ cmd: "check", args: argv, inputs: [rubric, card, o.qe], result: r.ok ? "PASS" : "FAIL", context,
      checks: [...r.failedGates, ...r.failedLines].map(id => ({ name: id, status: "FAIL", detail: r.reasons[id] })),
      counts: { score: r.score ?? -1, lines: r.ids.length, problems: r.problems.length, same_context: r.sameContext, qe_checked: !!qe } });
    if (o.json) { print(JSON.stringify({ ...r, qeFrom }, null, 1)); return r.ok ? 0 : 1; }
    print([
      `Scorecard: ${r.ids.length} rubric lines.${qeFrom ? ` Gates checked against ${qeFrom}.` : ""}`,
      ...r.problems.map(p => `- ${p}`),
      ...r.failedGates.map(id => `- ${id}: a pass-or-fail line is ${r.reasons[id]}. Repair the work before hand-over.`),
      ...r.failedLines.map(id => `- ${id}: ${r.reasons[id]}. Repair the work before hand-over.`),
      `Weighted score: ${r.score === null ? "no scored lines" : `${r.score} of 100`} (met in full, partly half, n/a left out).`,
      r.sameContext
        ? "Scored by: the maker (SAME-CONTEXT). A fresh reader who has not seen your reasoning should score it. Until one does, say SAME-CONTEXT next to this scorecard in your hand-over."
        : "Scored by: a fresh reader.",
      `Result: ${r.ok ? "PASS" : "FAIL"}${r.ok && r.sameContext ? " (SAME-CONTEXT)" : ""}`,
    ].join("\n"));
    return r.ok ? 0 : 1;
  }
  console.error(`Unknown command "${cmd}". Use template, build or check.`);
  return 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
