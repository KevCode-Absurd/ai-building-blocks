#!/usr/bin/env node
// ask-check.mjs: is a message that asks the owner questions light enough to answer in one go?
// Usage: node tools/quality/ask-check.mjs <message.md>     (the draft of your message to the owner)
// FAIL (exit 1): more than 3 questions in all; a numbered question that asks more than one thing (a second "?",
//   or a sentence starting "Also", "And", "Plus"); the message runs past 300 words.
// WARN (exit 0): over 200 words; more than 3 finding lines before the questions; a question line over 40 words;
//   a question with no default.
// Safe defaults are not questions: say them in one "I'll assume" line instead.
import fs from "node:fs";

const f = process.argv[2];
if (!f) { console.log("Usage: node ask-check.mjs <message.md>"); process.exit(2); }
const text = fs.readFileSync(f, "utf8").replace(/^## .*$/gm, "");
const words = s => (s.match(/[\p{L}\p{N}₹%][\p{L}\p{N}₹%,.'’-]*/gu) || []).length;
const lines = text.split(/\r?\n/);
const res = [];
const fail = (m, fix) => res.push(["FAIL", m, fix]), warn = (m, fix) => res.push(["WARN", m, fix]);

// Split into numbered question blocks: a line starting "1." or "**1." up to the next one or the closing lines.
const blocks = []; let cur = null, before = [];
for (const l of lines) {
  if (/^\s*(\*\*)?\d+[.)]\s/.test(l)) { cur = { head: l, body: [] }; blocks.push(cur); continue; }
  if (cur) { if (/^\S/.test(l) && !/^\s*[a-e]\)/.test(l) && l.trim() && !/^\s*(\*\*)?(also|and|plus)\b/i.test(l)) cur = null; else { cur.body.push(l); continue; } }
  if (!blocks.length) before.push(l);
}
const isOption = l => /^\s*[a-e]\)\s/.test(l);
let total = 0;
for (const [i, b] of blocks.entries()) {
  const ask = [b.head, ...b.body.filter(l => !isOption(l))].join(" ");
  const q = (ask.match(/\?/g) || []).length;
  if (!q) continue; // a numbered finding, not a question
  total += 1;
  const n = i + 1;
  if (q > 1) fail(`Question ${n} asks ${q} things.`, "One thing per question. Make the rest defaults in one \"I'll assume\" line, or drop them.");
  if (/(^|[.?!]\s+|\n\s*)(\*\*)?(also|and|plus)[,:]?\s/i.test(b.body.join("\n"))) fail(`Question ${n} adds a second ask ("Also ...").`, "Cut it, or make it a stated default.");
  if (words(b.head) > 40) warn(`Question ${n} runs ${words(b.head)} words.`, "Say it in one short sentence; the why can be a few words.");
  if (!/default|my pick|recommend|you decide/i.test([b.head, ...b.body].join(" "))) warn(`Question ${n} has no default.`, "Mark the option you'll take if they don't answer.");
}
// Questions outside the numbered list count too.
const loose = before.concat(lines.slice(lines.length)).join(" ").match(/\?/g) || [];
total += loose.length;
if (total > 3) fail(`${total} questions in one message.`, "At most three; ask the ones that change the work most.");
const findings = before.filter(l => /^\s*[-*]\s/.test(l)).length;
if (findings > 3) warn(`${findings} finding lines before the questions.`, "Keep the top three, one line each; the rest go in the work.");
const w = words(text);
if (!total) { /* a hand-over, not an ask: length is the work's business */ }
else if (w > 300) fail(`The message runs ${w} words.`, "Under about 200: one status line, up to three findings, up to three one-part questions, one line on what comes next.");
else if (w > 200) warn(`The message runs ${w} words.`, "Aim for about 200 or fewer.");
const nF = res.filter(r => r[0] === "FAIL").length;
for (const [l, m, fix] of res) console.log(`${l} ${m} Fix: ${fix}`);
console.log(`${nF ? "FAIL" : "PASS"}: ${total} question(s), ${w} words, ${nF} fail, ${res.length - nF} warn.`);
process.exit(nF ? 1 : 0);
