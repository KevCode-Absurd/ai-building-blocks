#!/usr/bin/env node
// blind-review.mjs (AI Blocks) - version 2.0.0
// A fair blind pick between 2 to 4 drafts, judged the way the owner who wrote the brief would judge them, by a fresh
// reviewer who has not seen your reasoning. Plain Node 18 or later, no dependencies, no network.
//
// Why: an AI judge often prefers whichever draft it reads first, the longer one, or the one in its own style, and
// asking it more times does not cancel that out, because the bias always leans the same way. So every draft sits in
// every position once (one sheet per draft, a Latin square), a win counts only when every sheet picks the same draft,
// and the sheets never print word counts, so a reviewer is not nudged by length. The length gap is reported after,
// so a longer draft cannot win on length alone. (Stanford CS329Z, lecture 15: LLM-as-judge.) The sheet asks the
// owner's nine questions plus five checks (signals acted on, asks met, whether the signals set the weights, order and
// asks, work left for the owner, rules followed against the owner), because a reviewer who reads only your own spec
// inherits your blind spots.
//
//   node tools/blind-review.mjs prepare --brief <owner-brief.md> draft-1.md draft-2.md [draft-3.md] [draft-4.md] [--out review]
//     --brief is the owner's original brief, word for word, with the data they gave. Never context/spec.md: the
//     spec is your own framing, and the reviewer must judge against what the owner asked.
//     Writes one sheet per draft, review/sheet-1.md to sheet-N.md (the same drafts, each in every position once,
//     letters by position), and review/key.json (which file is which letter on each sheet, and the word counts;
//     never show it to the reviewer).
//   Give each sheet to its own fresh reviewer (or to the same one, each in a new chat). Save each full reply as
//   review/answer-1.md to answer-N.md.
//   node tools/blind-review.mjs tally [--out review] [--json]
//     reads every answer, maps each VERDICT back to its file and prints the result: a winner only when every sheet
//     picks the same draft, else a tie with what each order preferred. It also flags halo scoring (a draft scored
//     within one point on every question) and a length win.
// Each run adds one line to context/job-log.jsonl when that folder exists (tools/log-event.mjs, hashes only).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "2.0.0";
const LETTERS = ["A", "B", "C", "D"];
const words = t => (t.match(/\S+/g) ?? []).length;

/** The owner's nine questions, scored 1 to 10 for each draft. */
export const OWNER_QUESTIONS = [
  "Fit: is it built on my numbers and my situation, and does it act on the signals in my data?",
  "New insight: does it tell me something I did not know, or show a gap in my thinking or my plan?",
  "Priorities: are the highest-leverage, lowest-effort moves first, with a first step I can take this week and what to stop?",
  "Reasoning: does it say why each move fits my case, with no contradictions and the risks named?",
  "Correct: does every number trace to my data with the working shown, with no invented facts, results or reviews?",
  "Clear: can I read it fast and know what to do, with nothing padded?",
  "Voice: does customer copy sound like us and use our customers' own words; is internal work pitched for its reader?",
  "Range: are there real options, with at least one good idea I would not have had?",
  "Ready to use: could I run it tomorrow with small tweaks, with no placeholders and no homework?",
];

/** The five checks that catch what a reviewer of the writer's own spec misses. */
export const OWNER_CHECKS = [
  "Signals. Name the signals in the data the brief gives that change the decision, each with its number: as many as the data holds, or none if it holds none (then say so, and mark any draft that invents one). For each draft, mark each signal acted on fully, partly or not at all. Partly means the draft quotes the signal but still keeps what it says to cut, or plays down what it says to push.",
  "Asks. List every explicit ask in the brief. For each draft, name any ask it drops, only describes instead of delivering, or folds out of sight.",
  "Signal sets the call. Name any weight, order, ask or timing in a draft that cuts against a signal the draft itself quotes: the most weight on the weakest predictor, an ask heavier than the data supports, the fastest money ranked below slower moves, a ranked table that breaks its own rule, timing set by a calendar instead of the trigger.",
  "Left for the owner. List everything each draft hands back to me: questions, confirm lists, requests for my yes or sign-off, alternates I must pick between, placeholders, notes to the writer. A permission the law needs, in one line next to its item, does not count.",
  "Rule over owner. Name any place a draft follows a stock rule or template (one test design for every test, a set metric, a runner-up, a target at the old average, the wrong test group, a bolder move or second recommendation when I asked for one, a section I did not ask for) where my goal and data point the other way.",
];

/**
 * The order of the drafts on each sheet: one sheet per draft, and each draft in each position exactly once.
 * 2 drafts: both orders. 3: the three rotations. 4: a balanced Latin square, so each draft also comes straight after
 * each other draft once (the draft read just before can colour the next one).
 */
export function sheetOrders(n) {
  if (n === 2) return [[0, 1], [1, 0]];
  if (n === 3) return [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
  if (n === 4) return [[0, 1, 3, 2], [1, 2, 0, 3], [2, 3, 1, 0], [3, 0, 2, 1]];
  throw new Error("blind-review takes 2 to 4 drafts");
}

export function sheet(brief, drafts, n) {
  const letters = drafts.map((_, i) => LETTERS[i]).join(" or ");
  const cols = OWNER_QUESTIONS.map((_, i) => i + 1);
  return [
    `# Blind review, sheet ${n}`,
    "",
    "You are the owner who wrote the brief below. You know your business, your data and your customers, and you will live with the result. You have not seen how these drafts were made, and the letters say nothing about who made them or in what order. Judge them only against the brief.",
    "",
    "## Score each draft as the owner (1 to 10)",
    "",
    "A 10 is what the best specialist you could hire would hand you. A 5 is usable only after real rework. Score each question on its own: a draft can be clear and still wrong.",
    "",
    ...OWNER_QUESTIONS.map((q, i) => `${i + 1}. ${q}`),
    "",
    "Put the scores in one table, one row per draft and one column per question:",
    "",
    `| Draft | ${cols.join(" | ")} |`,
    `|---|${cols.map(() => "---").join("|")}|`,
    ...drafts.map((_, i) => `| ${LETTERS[i]} |${cols.map(() => "   |").join("")}`),
    "",
    "## Five checks (quote the words that prove each)",
    "",
    ...OWNER_CHECKS.map((c, i) => `${i + 1}. ${c}`),
    "",
    "## Rules",
    "",
    "1. Do the checks and explain before you decide. Check two or three numbers that drive the main decision against the brief.",
    "2. Length is not quality. Padding, hedging and repetition count against a draft. If a longer draft wins only because it says more, call it a tie.",
    "3. A wrong number that changes a decision, an invented fact (a number, name, price, quote or result the brief does not give) or an off-brand line in customer copy is a serious fault, however good the rest reads. One serious fault can sink a draft: the verdict is not an average.",
    `4. End with one line exactly like this: VERDICT: ${letters} or TIE, naming the draft the owner would rather pay for (TIE only if you would truly pay the same for either), then a line GRAFT: what to take from the others into the winner (or "none").`,
    "",
    "## The brief",
    "",
    brief.trim(),
    "",
    ...drafts.flatMap((d, i) => [`## Draft ${LETTERS[i]}`, "", d.trim(), ""]),
  ].join("\n");
}

/**
 * VERDICT from a reviewer's reply: the last VERDICT line wins; null when there is none or it names no single draft.
 * The line must start with the pick: a letter A to D (or "Draft B") or TIE. "a tie" and "it's a tie" are TIE, never
 * draft A. "A or B" names no single draft, so it is null.
 */
export function verdictOf(answer) {
  const lines = [...String(answer).matchAll(/^\s*[*_]*\s*VERDICT\s*[*_]*\s*:\s*(.*)$/gim)];
  if (!lines.length) return null;
  const v = lines[lines.length - 1][1].replace(/[*_`]/g, "").trim();
  if (/^(?:(?:it'?s|it is)\s+)?(?:a\s+)?tie\b/i.test(v)) return "TIE";
  const m = /^(?:draft\s+)?([A-D])(?![\w'])/i.exec(v);
  if (!m) return null;
  if (/^\s*,?\s*(?:or|and|\/|vs\.?|versus)\s*(?:draft\s+)?[A-D](?![\w'])/i.test(v.slice(m[0].length))) return null;
  return m[1].toUpperCase();
}

/** The 1 to 10 scores in a reviewer's reply, by letter: rows like "| A | 8 | 7 | ... |". */
export function scoresOf(answer) {
  const out = {};
  for (const m of String(answer).matchAll(/^\s*\|\s*(?:draft\s+)?([A-D])\s*\|(.*)$/gim)) {
    const nums = m[2].split("|").map(c => c.trim()).filter(Boolean).map(Number).filter(x => Number.isFinite(x) && x >= 1 && x <= 10);
    if (nums.length >= 3) out[m[1].toUpperCase()] = nums;
  }
  return out;
}

/** The result of every sheet: a winner only when every order picks the same file. */
export function tally(key, answers, texts = {}) {
  const sheets = key.sheets;
  const picks = sheets.map((order, i) => {
    const v = verdictOf(answers[i] ?? "");
    if (!v) return { sheet: i + 1, verdict: null, file: null };
    return { sheet: i + 1, verdict: v, file: v === "TIE" ? "TIE" : order[LETTERS.indexOf(v)] ?? null };
  });
  const missing = picks.filter(p => !p.verdict).map(p => p.sheet);
  const files = picks.map(p => p.file);
  const all = sheets.length === 2 ? "Both orders" : `All ${sheets.length} orders`;
  let result;
  if (missing.length) result = { winner: null, status: "incomplete", note: `No clear VERDICT line in answer ${missing.join(" and ")}: ask the reviewer to end with one line, VERDICT: then one letter or TIE.` };
  else if (files[0] && files[0] !== "TIE" && files.every(f => f === files[0])) result = { winner: files[0], status: "consistent", note: `${all} chose ${files[0]}.` };
  else if (files.every(f => f === "TIE")) result = { winner: null, status: "tie", note: `${all} called it a tie: take the clearer, shorter draft as the base and graft the best part of the other.` };
  else {
    const counts = {};
    for (const f of files) if (f && f !== "TIE") counts[f] = (counts[f] ?? 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const leaning = top && top[1] > sheets.length / 2 ? { file: top[0], sheets: top[1] } : null;
    result = { winner: null, status: "position-dependent", note: `The pick changed with the order (${picks.map(p => `sheet ${p.sheet}: ${p.file}`).join("; ")}). Treat it as a tie: no draft is clearly better.${leaning ? ` It leans to ${leaning.file} (${leaning.sheets} of ${sheets.length} sheets), which is not enough to call it.` : ""} Take the clearer, shorter one as the base and graft, or make one more round.`, ...(leaning ? { leaning } : {}) };
  }
  // Scores, mapped back to files. Halo: one draft's scores all within one point, as if one feeling set them all.
  const scores = {}, halo = [];
  sheets.forEach((order, i) => {
    for (const [letter, nums] of Object.entries(scoresOf(answers[i] ?? ""))) {
      const f = order[LETTERS.indexOf(letter)];
      if (!f) continue;
      (scores[f] ??= []).push(...nums);
      const low = Math.min(...nums), high = Math.max(...nums);
      if (nums.length >= 5 && high - low <= 1) halo.push({ sheet: i + 1, file: f, low, high });
    }
  });
  const meanScores = Object.fromEntries(Object.entries(scores).map(([f, n]) => [f, Math.round((n.reduce((a, b) => a + b, 0) / n.length) * 10) / 10]));
  if (halo.length) result.halo_warning = `Halo: ${halo.map(h => `sheet ${h.sheet} scored ${h.file} ${h.low === h.high ? h.low : `${h.low} to ${h.high}`} on every question`).join("; ")}. The reviewer may be scoring one overall feeling, not each question. Read its checks before you trust the pick.`;
  const lengths = Object.keys(texts).length ? Object.fromEntries(Object.entries(texts).map(([f, t]) => [f, words(t)])) : { ...(key.lengths ?? {}) };
  if (result.winner && Object.keys(lengths).length > 1) {
    const others = Object.entries(lengths).filter(([f]) => f !== result.winner).map(([, w]) => w);
    const ratio = lengths[result.winner] / Math.max(1, Math.max(...others));
    if (ratio > 1.3) result.length_warning = `The winner is ${Math.round((ratio - 1) * 100)}% longer than the next draft. Check it wins on substance, not length: cut it to the shorter draft's length and see if it still wins.`;
  }
  return { picks, ...result, lengths, scores: meanScores, halo };
}

// The job log (tools/log-event.mjs) is optional: a pack without it still runs every command.
let jobLog = null;
try { jobLog = await import("./log-event.mjs"); } catch { /* no log-event.mjs beside this tool */ }
const log = event => { try { jobLog?.logEvent({ tool: "blind-review", version: VERSION, ...event }); } catch { /* never stops the tool */ } };

function main(argv) {
  const cmd = argv[0];
  const opt = (name, dflt) => { const i = argv.indexOf(name); return i > 0 ? argv[i + 1] : dflt; };
  const out = opt("--out", "review");
  if (cmd === "prepare") {
    const briefPath = opt("--brief");
    const files = argv.slice(1).filter((a, i, all) => !a.startsWith("--") && !["--brief", "--out"].includes(all[i - 1]));
    if (!briefPath || files.length < 2 || files.length > 4) { console.error("Usage: node tools/blind-review.mjs prepare --brief <owner-brief.md> <draft-1> <draft-2> [<draft-3> <draft-4>] [--out review]\n--brief is the owner's original brief with their data, never context/spec.md."); return 2; }
    if (/(^|[\\/])spec\.md$/i.test(briefPath)) console.error("Warning: --brief should be the owner's original brief, not your spec. The reviewer must judge against what the owner asked.");
    const brief = readFileSync(briefPath, "utf8");
    const texts = files.map(f => readFileSync(f, "utf8"));
    const orders = sheetOrders(files.length);
    mkdirSync(out, { recursive: true });
    orders.forEach((order, s) => writeFileSync(path.join(out, `sheet-${s + 1}.md`), sheet(brief, order.map(i => texts[i]), s + 1)));
    writeFileSync(path.join(out, "key.json"), `${JSON.stringify({ schema: "ai-blocks-blind-review/2", brief: briefPath, sheets: orders.map(order => order.map(i => files[i])), lengths: Object.fromEntries(files.map((f, i) => [f, words(texts[i])])) }, null, 2)}\n`);
    log({ cmd: "prepare", args: argv.slice(1), inputs: [briefPath, ...files], result: "PASS", counts: { drafts: files.length, sheets: orders.length } });
    const n = orders.length;
    console.log(`Wrote ${out}/sheet-1.md to ${out}/sheet-${n}.md (${n} sheets: each draft in each position once) and ${out}/key.json (keep it from the reviewer).\nGive each sheet to its own fresh reviewer, save the replies as ${out}/answer-1.md to ${out}/answer-${n}.md, then run: node tools/blind-review.mjs tally --out ${out}`);
    return 0;
  }
  if (cmd === "tally") {
    const keyFile = path.join(out, "key.json");
    if (!existsSync(keyFile)) { console.error(`No ${keyFile}: run prepare first.`); return 2; }
    const key = JSON.parse(readFileSync(keyFile, "utf8"));
    const answerFiles = key.sheets.map((_, i) => path.join(out, `answer-${i + 1}.md`));
    const answers = answerFiles.map(f => existsSync(f) ? readFileSync(f, "utf8") : "");
    const texts = Object.fromEntries(key.sheets[0].filter(f => existsSync(f)).map(f => [f, readFileSync(f, "utf8")]));
    const r = tally(key, answers, texts);
    log({ cmd: "tally", args: argv.slice(1), inputs: [keyFile, ...answerFiles], result: r.status === "incomplete" ? "NOT_RUN" : "PASS",
      counts: { sheets: key.sheets.length, outcome: r.status, winner: !!r.winner, halo: r.halo.length, length_warning: !!r.length_warning } });
    console.log(argv.includes("--json") ? JSON.stringify(r, null, 2) : [`Result: ${r.status}${r.winner ? `, winner ${r.winner}` : ""}`, r.note, ...(r.halo_warning ? [r.halo_warning] : []), ...(r.length_warning ? [r.length_warning] : [])].join("\n"));
    return 0;
  }
  console.error("Usage: node tools/blind-review.mjs prepare|tally ... (see the top of this file)");
  return 2;
}

const invoked = !!process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = main(process.argv.slice(2));
