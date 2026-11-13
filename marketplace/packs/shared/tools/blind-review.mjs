#!/usr/bin/env node
// blind-review.mjs: a fair blind pick between 2 to 4 drafts, for a fresh reviewer who has not seen your reasoning.
// Plain Node 18 or later, no dependencies, no network.
//
// Why: an AI judge often prefers whichever draft it reads first, the longer one, or the one in its own style, and
// asking it more times does not cancel that out, because the bias always leans the same way. Showing the drafts in
// both orders and counting a win only when both orders agree removes position bias; the length gap is reported so a
// longer draft cannot win on length alone. (Stanford CS329Z, lecture 15: LLM-as-judge.)
//
//   node tools/blind-review.mjs prepare --brief context/spec.md draft-1.md draft-2.md [draft-3.md] [--out review]
//     writes review/sheet-1.md and review/sheet-2.md (the same drafts, opposite orders, letters by position) and
//     review/key.json (which file is which letter on each sheet; never show it to the reviewer).
//   Give sheet-1.md to one fresh reviewer and sheet-2.md to another (or to the same one in a new chat). Save each
//   full reply as review/answer-1.md and review/answer-2.md.
//   node tools/blind-review.mjs tally [--out review]
//     reads both answers, maps each VERDICT back to its file and prints the result: a winner only when both orders
//     pick the same draft, else a tie with what each order preferred.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LETTERS = ["A", "B", "C", "D"];
const words = t => (t.match(/\S+/g) ?? []).length;

export function sheet(brief, drafts, n) {
  return [
    `# Blind review, sheet ${n}`,
    "",
    "You are a fresh reviewer. You have not seen how these drafts were made, and the letters say nothing about who made them or in what order. Judge them only against the brief below.",
    "",
    "Rules:",
    "1. For each acceptance test in the brief (or, if it lists none, each thing the brief asks for), write one line per draft: pass or fail, quoting the words that prove it. Explain before you decide.",
    "2. Then name each draft's weakest part and why a buyer or the client would skip it.",
    "3. Length is not quality. If a longer draft wins only because it says more, call it a tie. Prefer the draft the client could use today with the least editing.",
    "4. A draft with an invented fact (a number, name, price, quote or result the brief and its sources do not give) fails, however good it reads.",
    `5. End with one line exactly like this: VERDICT: ${drafts.map((_, i) => LETTERS[i]).join(" or ")} or TIE, then a line GRAFT: what to take from the others into the winner (or "none").`,
    "",
    "## The brief",
    "",
    brief.trim(),
    "",
    ...drafts.flatMap((d, i) => [`## Draft ${LETTERS[i]} (${words(d)} words)`, "", d.trim(), ""]),
  ].join("\n");
}

/** VERDICT: X from a reviewer's reply: the last such line wins; null when there is none. */
export function verdictOf(answer) {
  const all = [...answer.matchAll(/^\s*\**\s*VERDICT\s*\**\s*:\s*\**\s*([A-D]|TIE)\b/gim)];
  return all.length ? all[all.length - 1][1].toUpperCase() : null;
}

/** The result of both sheets: a winner only when both orders agree on the same file. */
export function tally(key, answers, texts = {}) {
  const picks = answers.map((a, i) => {
    const v = verdictOf(a);
    if (!v) return { sheet: i + 1, verdict: null, file: null };
    return { sheet: i + 1, verdict: v, file: v === "TIE" ? "TIE" : key.sheets[i][LETTERS.indexOf(v)] ?? null };
  });
  const missing = picks.filter(p => !p.verdict).map(p => p.sheet);
  let result;
  if (missing.length) result = { winner: null, status: "incomplete", note: `No VERDICT line in answer ${missing.join(" and ")}: ask the reviewer to end with one.` };
  else if (picks[0].file === picks[1].file && picks[0].file !== "TIE") result = { winner: picks[0].file, status: "consistent", note: `Both orders chose ${picks[0].file}.` };
  else if (picks.every(p => p.file === "TIE")) result = { winner: null, status: "tie", note: "Both orders called it a tie: take the clearer, shorter draft as the base and graft the best part of the other." };
  else result = { winner: null, status: "position-dependent", note: `The pick changed with the order (${picks.map(p => `sheet ${p.sheet}: ${p.file}`).join("; ")}). Treat it as a tie: no draft is clearly better. Take the clearer, shorter one as the base and graft, or make one more round.` };
  const lengths = Object.fromEntries(Object.entries(texts).map(([f, t]) => [f, words(t)]));
  if (result.winner && Object.keys(lengths).length > 1) {
    const others = Object.entries(lengths).filter(([f]) => f !== result.winner).map(([, w]) => w);
    const ratio = lengths[result.winner] / Math.max(1, Math.max(...others));
    if (ratio > 1.3) result.length_warning = `The winner is ${Math.round((ratio - 1) * 100)}% longer than the next draft. Check it wins on substance, not length: cut it to the shorter draft's length and see if it still wins.`;
  }
  return { picks, ...result, lengths };
}

function main(argv) {
  const cmd = argv[0];
  const opt = (name, dflt) => { const i = argv.indexOf(name); return i > 0 ? argv[i + 1] : dflt; };
  const out = opt("--out", "review");
  if (cmd === "prepare") {
    const briefPath = opt("--brief");
    const files = argv.slice(1).filter((a, i, all) => !a.startsWith("--") && !["--brief", "--out"].includes(all[i - 1]));
    if (!briefPath || files.length < 2 || files.length > 4) { console.error("Usage: node tools/blind-review.mjs prepare --brief <brief.md> <draft-1> <draft-2> [<draft-3> <draft-4>] [--out review]"); return 2; }
    const brief = readFileSync(briefPath, "utf8");
    const texts = files.map(f => readFileSync(f, "utf8"));
    const order1 = files.map((_, i) => i);
    const order2 = [...order1].reverse();
    mkdirSync(out, { recursive: true });
    writeFileSync(path.join(out, "sheet-1.md"), sheet(brief, order1.map(i => texts[i]), 1));
    writeFileSync(path.join(out, "sheet-2.md"), sheet(brief, order2.map(i => texts[i]), 2));
    writeFileSync(path.join(out, "key.json"), `${JSON.stringify({ schema: "ai-blocks-blind-review/1", brief: briefPath, sheets: [order1.map(i => files[i]), order2.map(i => files[i])] }, null, 2)}\n`);
    console.log(`Wrote ${out}/sheet-1.md and ${out}/sheet-2.md (opposite orders) and ${out}/key.json (keep it from the reviewer).\nGive each sheet to a fresh reviewer, save the replies as ${out}/answer-1.md and ${out}/answer-2.md, then run: node tools/blind-review.mjs tally --out ${out}`);
    return 0;
  }
  if (cmd === "tally") {
    const keyFile = path.join(out, "key.json");
    if (!existsSync(keyFile)) { console.error(`No ${keyFile}: run prepare first.`); return 2; }
    const key = JSON.parse(readFileSync(keyFile, "utf8"));
    const answers = [1, 2].map(n => { const f = path.join(out, `answer-${n}.md`); return existsSync(f) ? readFileSync(f, "utf8") : ""; });
    const texts = Object.fromEntries(key.sheets[0].filter(f => existsSync(f)).map(f => [f, readFileSync(f, "utf8")]));
    const r = tally(key, answers, texts);
    console.log(argv.includes("--json") ? JSON.stringify(r, null, 2) : [`Result: ${r.status}${r.winner ? `, winner ${r.winner}` : ""}`, r.note, ...(r.length_warning ? [r.length_warning] : [])].join("\n"));
    return 0;
  }
  console.error("Usage: node tools/blind-review.mjs prepare|tally ... (see the top of this file)");
  return 2;
}

const invoked = !!process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = main(process.argv.slice(2));
