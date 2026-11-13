#!/usr/bin/env node
// make-rubric.mjs (AI Blocks) - version 1.0.0
//
// Turns the owner's intake answers into the rubric the work is judged on, then checks the hand-over scorecard.
//   node tools/make-rubric.mjs template                 print the intake file to fill in (context/intake.md)
//   node tools/make-rubric.mjs [build] [--intake <file>] [--out <file>] [--json]
//                                                       write context/rubric.md from context/intake.md
//   node tools/make-rubric.mjs check <scorecard file> [--rubric <file>]
//                                                       every rubric line has a verdict and where it is met
//
// The rubric puts the owner first: what good looks like to them is half the score, weighted in the order they gave.
// Their asks, "never" items and limits are pass or fail, and so are our gates. Craft is the other half.
// Plain Node 18+. Reads and writes local files only; opens no network connection.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "1.0.0";
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

## Brand brain
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

/** Checks a scorecard against the rubric: each id needs a verdict (met, partly, not met) and a place. */
export function checkScorecard(rubricText, scorecardText) {
  const body = String(rubricText).split(/^## Scorecard at hand-over/m)[0]; // the example row below is not a rubric line
  const want = [...new Set([...body.matchAll(/^\|\s*([GANLQC]\d+)\s*\|/gm)].map(m => m[1]))];
  const rows = new Map();
  for (const m of String(scorecardText).matchAll(/^\|\s*([GANLQC]\d+)\s*\|\s*([^|]*)\|\s*([^|]*)\|/gm)) rows.set(m[1], { verdict: m[2].trim().toLowerCase(), where: m[3].trim() });
  const problems = [];
  for (const id of want) {
    const r = rows.get(id);
    if (!r) { problems.push(`${id}: no row in the scorecard`); continue; }
    if (!/^(met|partly|not met|n\/a)$/.test(r.verdict)) problems.push(`${id}: verdict "${r.verdict}" (use met, partly or not met)`);
    else if (r.verdict !== "n/a" && r.verdict !== "not met" && r.where.length < 3) problems.push(`${id}: say where it is met`);
  }
  const failedGates = [...rows].filter(([id, r]) => /^[ANLQ]/.test(id) && r.verdict === "not met").map(([id]) => id);
  return { ok: !problems.length && !failedGates.length, ids: want, problems, failedGates };
}

// ---------- command line ----------
function args(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") o.json = true; else if (a === "--help" || a === "-h") o.help = true;
    else if (["--intake", "--out", "--rubric", "--today"].includes(a)) o[a.slice(2)] = argv[++i];
    else o._.push(a);
  }
  return o;
}
export function main(argv = process.argv.slice(2), print = console.log) {
  const o = args(argv), cmd = o._[0] && !o._[0].startsWith("-") ? o._[0] : "build";
  if (o.help) { print(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter(l => l.startsWith("//")).slice(0, 12).map(l => l.replace(/^\/\/ ?/, "")).join("\n")); return 0; }
  if (cmd === "template") { print(TEMPLATE); return 0; }
  if (cmd === "build") {
    const file = o.intake || "context/intake.md";
    if (!fs.existsSync(file)) { console.error(`No ${file} yet. Ask the intake questions first (tools/quality/INTAKE.md), then write the answers there. Template: node tools/make-rubric.mjs template`); return 2; }
    const intake = readIntake(fs.readFileSync(file, "utf8"));
    const r = rubricMarkdown(intake, { today: o.today });
    const out = o.out || "context/rubric.md";
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(out, r.text);
    if (o.json) print(JSON.stringify({ out, rows: r.rows }, null, 1));
    else print(`Wrote ${out}: ${r.rows.filter(x => x.kind === "score").length} scored lines, ${r.rows.filter(x => x.kind === "gate").length} pass-or-fail lines.${intake.asks.length ? "" : " No asks listed: add each thing the brief asks for under \"Asks\"."}\nShow the owner the spec sheet and this rubric together and ask: "Go, or change anything?"`);
    return 0;
  }
  if (cmd === "check") {
    const card = o._[1], rubric = o.rubric || "context/rubric.md";
    if (!card || !fs.existsSync(card)) { console.error("Give the scorecard file: node tools/make-rubric.mjs check <scorecard file>"); return 2; }
    if (!fs.existsSync(rubric)) { console.error(`No ${rubric}. Build it first: node tools/make-rubric.mjs`); return 2; }
    const r = checkScorecard(fs.readFileSync(rubric, "utf8"), fs.readFileSync(card, "utf8"));
    if (o.json) print(JSON.stringify(r, null, 1));
    else print([`Scorecard: ${r.ids.length} rubric lines.`, ...r.problems.map(p => `- ${p}`), ...r.failedGates.map(id => `- ${id}: a pass-or-fail line is not met. Repair the work before hand-over.`), `Result: ${r.ok ? "PASS" : "FAIL"}`].join("\n"));
    return r.ok ? 0 : 1;
  }
  console.error(`Unknown command "${cmd}". Use template, build or check.`);
  return 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
