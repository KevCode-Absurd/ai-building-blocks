#!/usr/bin/env node
// Hand-over check (WORK-METHOD.md, step 5): run it on the finished deliverable before you hand it over.
//
//   node tools/check-handover.mjs <deliverable> [plain-answer] [--one-page]
//
// 1. Leaks: anything internal or unfinished a reader would see, such as working file names, notes to self,
//    placeholders, TBD or UNKNOWN. For HTML it reads the text a visitor sees and flags elements that look like notes.
// 2. Length: the words a reader sees, against the plain answer written from the brief alone. Up to 1.3 times is the
//    aim; over 1.6 times fails unless the brief asked for more. --one-page fails over about 450 words.
// --profile <family> uses the shipped v3 family aim and ceiling. Legacy calls retain their old limits.
// --requested-more records that the brief explicitly requests more; it waives only the ratio ceiling.
// It exits 1 when anything fails, so it can gate a hand-over. Plain Node, no packages.
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const onePage = args.includes("--one-page");
const profileAt = args.indexOf("--profile");
const profileName = profileAt >= 0 ? args[profileAt + 1] : null;
let limits = { aim: 1.3, ceiling: 1.6 };
if (profileAt >= 0) {
  const profiles = JSON.parse(readFileSync(new URL("./quality/profiles.json", import.meta.url), "utf8"));
  if (!profileName || !Object.hasOwn(profiles, profileName)) {
    console.error("Unknown or missing quality family profile."); process.exit(2);
  }
  limits = profiles[profileName];
}
const requestedMore = args.includes("--requested-more");
const [file, plain] = args.filter((a, i) => !a.startsWith("--") && !(profileAt >= 0 && i === profileAt + 1));
if (!file) {
  console.error("Usage: node tools/check-handover.mjs <deliverable> [plain-answer] [--one-page]");
  process.exit(2);
}

const isHtml = f => /\.html?$/i.test(f);
const visibleText = (f, raw) => isHtml(f)
  ? raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, "\n").replace(/&nbsp;/g, " ")
  : raw;
const words = text => (text.replace(/[|#*_>`~-]+/g, " ").match(/[\p{L}\p{N}$%€£₹][^\s]*/gu) ?? []).length;

const raw = readFileSync(file, "utf8");
const text = visibleText(file, raw);
const problems = [];

if (isHtml(file)) {
  const noteTag = /<([a-z0-9]+)\b[^>]*\b(?:class|id)\s*=\s*["'][^"']*\b(note|notes|internal|debug|todo|annotation|reviewer|editor|fact-?check)\b[^"']*["'][^>]*>/gi;
  for (const m of raw.matchAll(noteTag)) problems.push(`an element that looks like an internal note: ${m[0].slice(0, 100)}`);
}
const LEAKS = [
  [/\b(?:facts|market|research|lessons|preferences|spec|contract|DECISIONS|knowledge|taste-brief)\.md\b/i, "a working file name"],
  [/\[(?:INTERNAL|TODO|TBD|CONFIRM|INSERT|FILL|PLACEHOLDER)[^\]]*\]/i, "a placeholder"],
  [/\b(?:TBD|TODO|UNKNOWN|UNCONFIRMED)\b/, "an unfinished marker"],
  [/\[(?:insert|fill|your|add)\b[^\]]*\]/i, "a fill-in blank"],
  [/\bX{3,}\b|\b_{4,}\b/, "a blank to fill"],
  [/\b(?:internal notes?|notes? (?:to self|for (?:the )?(?:team|reviewer|editor))|not for publication|do not publish|for internal use)\b/i, "a note not meant for the reader"],
  [/\b(?:the spec sheet|acceptance tests?|SAME-CONTEXT|the fresh reviewer|the yardstick|candidate [A-D]\b|context\/)/i, "method words"],
];
text.split(/\r?\n/).forEach((line, i) => {
  for (const [re, what] of LEAKS) {
    const m = line.match(re);
    if (m) problems.push(`line ${i + 1}: ${what} "${m[0]}": ${line.trim().slice(0, 100)}`);
  }
});

const n = words(text);
let lengthNote = `${n} words`;
if (plain) {
  const p = words(visibleText(plain, readFileSync(plain, "utf8")));
  const ratio = p ? n / p : 0;
  lengthNote += `, ${ratio.toFixed(2)} times the plain answer (${p} words)`;
  if (ratio > limits.ceiling && !requestedMore) problems.push(`length: ${ratio.toFixed(2)} times the plain answer; family ceiling ${limits.ceiling}. Cut toward ${limits.aim} unless the brief asked for more`);
  else if (ratio > limits.aim) lengthNote += `; over the ${limits.aim} aim, so check every part is one the reader will use`;
}
if (onePage && n > 450) problems.push(`length: ${n} words is more than one page (about 450)`);

console.log(`Hand-over check: ${lengthNote}.`);
if (problems.length) {
  console.log(`${problems.length} to fix:\n- ${problems.join("\n- ")}`);
  process.exitCode = 1;
} else console.log("Clean: nothing internal or unfinished found.");
