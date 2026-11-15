#!/usr/bin/env node
// Hand-over check (METHOD.md, step 5): run it on the finished deliverable before you hand it over.
//
//   node tools/check-handover.mjs <deliverable> [plain-answer] [--one-page]
//
// 1. Leaks: anything internal or unfinished a reader would see, such as working file names, notes to self,
//    placeholders ([X], [link], TBD, UNKNOWN). For HTML it reads the text a visitor sees and flags elements that look
//    like notes. It also notes (without failing) a run of 6+ words repeated on 3+ lines, such as one stock line in
//    every ad variant.
// 2. Length: the words a reader sees, against the plain answer written from the brief alone. Up to 1.3 times is the
//    aim; over 1.6 times fails unless the brief asked for more. --one-page fails over about 450 words.
// --profile <family> uses the shipped v3 family aim and ceiling. Legacy calls retain their old limits.
// --requested-more records that the brief explicitly requests more; it waives only the ratio ceiling.
// 3. Homework: finished work hands nothing back to the owner. It fails on a "To confirm" or "Open questions" box, an ask
//    for the owner's yes or sign-off, an approval gate inside the plan, editor notes about the copy, and alternates
//    (a "Runner-up:" line, "(test: ...)" inside a subject or headline). --options-requested lets alternates pass when
//    the brief asks for options. These rules mirror quality/leakcheck.cjs.
// 4. Brief: --brief <brief> checks the work against the brief it answers. It fails on a calendar date the brief does
//    not give (a brief that sets its own calendar, such as "today is 14 November", lets dates on that calendar pass),
//    on a "Bolder move" heading or bold label when --profile names a copy family, and on describe-not-write lines
//    ("use a real", "a real ticket from the last", "pick one from", "take the quiz"). It notes a weekday the brief does
//    not give, an unwritten amount such as "$X", and money or percentage figures in neither the brief nor the numbers
//    ledger (--numbers <file>, else context/numbers.json when it exists). These rules mirror quality/leakcheck.cjs.
// It exits 1 when anything fails, so it can gate a hand-over. Plain Node, no packages.
import fs, { readFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const onePage = args.includes("--one-page");
const profileAt = args.indexOf("--profile");
const profileName = profileAt >= 0 ? args[profileAt + 1] : null;
const valueAt = new Set(["--profile", "--brief", "--numbers"].map(f => args.indexOf(f)).filter(i => i >= 0).map(i => i + 1));
const valueOf = flag => { const i = args.indexOf(flag); if (i < 0) return null; const v = args[i + 1]; if (!v || v.startsWith("--")) { console.error(`${flag} needs a value.`); process.exit(2); } return v; };
const briefFile = valueOf("--brief"), numbersFile = valueOf("--numbers");
for (const [f, what] of [[briefFile, "the brief"], [numbersFile, "the numbers ledger"]]) if (f && !fs.existsSync(f)) { console.error(`Cannot read ${what} ${f}`); process.exit(2); }
let limits = { aim: 1.3, ceiling: 1.6 };
if (profileAt >= 0) {
  const profiles = JSON.parse(readFileSync(new URL("./quality/profiles.json", import.meta.url), "utf8"));
  if (!profileName || !Object.hasOwn(profiles, profileName)) {
    console.error("Unknown or missing quality family profile."); process.exit(2);
  }
  limits = profiles[profileName];
}
const requestedMore = args.includes("--requested-more");
const requestedTemplate = args.includes("--requested-template");
const optionsRequested = args.includes("--options-requested");
let acceptedTemplateFields = 0, acceptedOptions = 0;
const [file, plain] = args.filter((a, i) => !a.startsWith("--") && !valueAt.has(i));
if (!file) {
  console.error("Usage: node tools/check-handover.mjs <deliverable> [plain-answer] [--one-page] [--profile <family>] [--requested-more] [--requested-template] [--options-requested] [--brief <brief> [--numbers <numbers.json>]]");
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
// Trace-to-brief checks (--brief <file>). Keep in step with quality/leakcheck.cjs.
// Copy families: the deliverable is words a customer or candidate reads, so it never carries a "Bolder move".
const COPY_FAMILIES = new Set(['paid-social-ads', 'landing-page', 'lifecycle-email', 'notification-copy', 'support-macros', 'outbound-sales', 'review-replies', 'product-description', 'audio-ad-script', 'webinar-script', 'press-pitch', 'product-announcement', 'onboarding-flow', 'job-description', 'creator-brief', 'seo-article', 'help-docs', 'internal-announcement', 'crisis-response']);
const MON = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?';
const DAY = '(\\d{1,2})(?:st|nd|rd|th)?';
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
// Each finder gives [day, month or null]. Month words must be capitalised, so "12 may" is not a date.
const DATE_FINDERS = [
  [new RegExp(`\\b${DAY}\\s+(?:of\\s+)?${MON}(?![a-z])`, 'gi'), m => /^[A-Z]/.test(m[2]) ? [[m[1], m[2]]] : []],
  [new RegExp(`\\b${MON}\\s+${DAY}\\b(?!\\s*(?:%|[-\\u2013]\\s*\\d|days?|weeks?|months?|years?|hours?|minutes?))`, 'gi'), m => /^[A-Z]/.test(m[1]) ? [[m[2], m[1]]] : []],
  [/\b20\d\d-(\d{1,2})-(\d{1,2})\b/g, m => [[m[2], m[1]]]],
  [/\b(\d{1,2})[/.](\d{1,2})[/.](?:20)?\d\d\b/g, m => [[m[1], m[2]], [m[2], m[1]]]],
  // "between the 12th and the 15th", "by the 30th": a day of the month, not "the 2nd email".
  [/\bthe\s+(\d{1,2})(?:st|nd|rd|th)\b(?=\s*(?:$|[,.;:)!?]|of\b|and\b|to\b|or\b|through\b|until\b|[-\u2013]))/gi, m => [[m[1], null]]],
];
const datesIn = line => {
  const out = [];
  for (const [re, pick] of DATE_FINDERS) for (const m of line.matchAll(re)) for (const [d, mo] of pick(m)) {
    const day = +d, month = mo === null ? null : /^\d+$/.test(mo) ? MONTHS[+mo - 1] : mo.slice(0, 3).toLowerCase();
    if (day >= 1 && day <= 31 && month !== undefined) out.push({ day, month, text: m[0].trim().replace(/\.$/, '') });
  }
  return out;
};
const WEEKDAY = /\b(?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b(?!s)/g;
const MULT = { k: 1e3, m: 1e6, mn: 1e6, million: 1e6, bn: 1e9, billion: 1e9, lakh: 1e5, lakhs: 1e5, l: 1e5, crore: 1e7, crores: 1e7, cr: 1e7 };
const SCALE = '(?:\\s?(k|mn|m|bn|million|billion|lakhs?|crores?|cr|L)\\b)?';
const FIGURE = new RegExp(`[₹$£€]\\s?(\\d[\\d,]*(?:\\.\\d+)?)${SCALE}|\\b(\\d[\\d,]*(?:\\.\\d+)?)\\s?%`, 'gi');
const ANY_NUMBER = new RegExp(`(\\d[\\d,]*(?:\\.\\d+)?)${SCALE}`, 'gi');
const numberOf = s => Number(String(s).replace(/,/g, ''));
const ledgerNumbers = file => {
  const out = [];
  const walk = v => {
    if (typeof v === 'number') out.push(v);
    else if (typeof v === 'string') for (const m of v.matchAll(ANY_NUMBER)) out.push(numberOf(m[1]) * (m[2] ? MULT[m[2].toLowerCase()] ?? 1 : 1));
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  try { walk(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch { /* an unreadable ledger adds nothing; numbers.cjs reports it */ }
  return out;
};
// A figure is known when a number in the brief or the ledger rounds to it at the precision shown
// ("₹1.2 lakh" matches 1,21,700; "34%" matches 34.2).
const figureKnown = (m, known) => {
  const digits = m[1] ?? m[3], scale = m[2] ? MULT[m[2].toLowerCase()] ?? 1 : 1;
  const value = numberOf(digits) * scale, step = 10 ** -((digits.split('.')[1] ?? '').length) * scale;
  return known.some(v => Math.abs(Math.abs(v) - value) <= step / 2 + 1e-9);
};
const BOLDER = /^\s*>?\s*(?:#{1,6}\s+(?:\d+[.)]\s+)?(?:\*\*|__)?|(?:[-*+]\s+)?(?:\*\*|__))bolder move\b/i;
// Each pattern passes when the brief itself says it (or, for the quiz, when the brief says the business has one).
const DESCRIBE = [
  [/\b(?:use|pick|choose|insert|add|paste|find|grab|pull)\s+(?:a|an|one)\s+real\b/i],
  [/\ba real (?:[\w-]+\s+){1,2}from (?:the|your|our|last|a|this)\b/i],
  [/\b(?:pick|choose|select) one from\b/i],
  [/\btake (?:the|our|a) (?:\w+\s+)?quiz\b/i, 'quiz'],
  [/\[X\]/],
];
const MONEY_BLANK = /[₹$£€]X\b/;
// A brief sets its own calendar when it gives today's date or two or more dates (a launch day, a plan window).
// Then dates on that calendar pass, from two weeks before its first date to about a quarter after its last.
const briefChecks = ({ lines, brief, ledger, copy }) => {
  const fails = [], warns = [];
  const briefLower = brief.toLowerCase();
  const briefDates = new Set(), calendar = [];
  let today = false;
  for (const line of brief.split(/\r?\n/)) for (const d of datesIn(line)) {
    briefDates.add(`${d.day}-${d.month}`); briefDates.add(`${d.day}-*`);
    if (d.month) { calendar.push(d); if (/\btoday\b/i.test(line)) today = true; }
  }
  const first = calendar.length ? MONTHS.indexOf(calendar[0].month) : 0;
  const dayOf = d => { let m = MONTHS.indexOf(d.month); if (m < first - 3) m += 12; return m * 30.5 + d.day; };
  const span = calendar.map(dayOf);
  const dated = today || new Set(calendar.map(d => `${d.day}-${d.month}`)).size >= 2;
  const onCalendar = d => dated && (d.month === null || (dayOf(d) >= Math.min(...span) - 14 && dayOf(d) <= Math.max(...span) + 92));
  const known = [...ledger];
  for (const m of brief.matchAll(ANY_NUMBER)) { const v = numberOf(m[1]); known.push(v); if (m[2]) known.push(v * (MULT[m[2].toLowerCase()] ?? 1)); }
  const figures = new Map();
  lines.forEach((line, i) => {
    const where = `line ${i + 1}`, show = line.trim().slice(0, 100);
    // A bracketed value such as "[Tue 18 Nov]" is a merge field the system fills, not a date the plan sets.
    const unbracketed = line.replace(/\[[^\]]*\](?!\()/g, ' ');
    const invented = [...new Set(datesIn(unbracketed).filter(d => !briefDates.has(`${d.day}-${d.month ?? '*'}`) && !onCalendar(d)).map(d => d.text.trim()))];
    if (invented.length) fails.push(`${where}: date not in the brief "${invented.join('", "')}": use days relative to the start (Day 1, Week 2) unless the brief gives the date. In: ${show}`);
    for (const m of line.matchAll(WEEKDAY)) {
      const before = line.slice(0, m.index), after = line.slice(m.index + m[0].length);
      if (briefLower.includes(m[0].toLowerCase()) || /\b(?:every|each|per|any)\s+$/i.test(before) || /^\s+(?:after|before)\b/i.test(after)) continue;
      warns.push(`${where}: weekday not in the brief "${m[0]}": keep it only as a rhythm, never as an invented date. In: ${show}`); break;
    }
    if (copy && BOLDER.test(line)) fails.push(`${where}: a "Bolder move" in a copy job: ship the copy that was asked for and nothing beside it. In: ${show}`);
    for (const [re, key] of DESCRIBE) {
      const m = line.match(re);
      if (m && !briefLower.includes(key ?? m[0].toLowerCase())) { fails.push(`${where}: describes instead of writes "${m[0]}": write the piece itself in full. In: ${show}`); break; }
    }
    // "$X" can be a live value ("Add ₹X more for free shipping"), so it warns: name the field and its fallback, or write the number.
    const money = line.match(MONEY_BLANK);
    if (money) warns.push(`${where}: unwritten amount "${money[0]}": write the number, or name the merge field and its fallback. In: ${show}`);
    for (const m of line.matchAll(FIGURE)) {
      const key = m[0].replace(/\s+/g, ''), value = numberOf(m[1] ?? m[3]);
      if (figures.has(key) || value === 0 || (m[3] && value === 100) || figureKnown(m, known)) continue;
      figures.set(key, `"${m[0].trim()}" (line ${i + 1})`);
    }
  });
  if (figures.size) {
    const list = [...figures.values()];
    warns.push(`${list.length} figure${list.length > 1 ? 's' : ''} in neither the brief nor the numbers ledger: ${list.slice(0, 8).join(', ')}${list.length > 8 ? ` and ${list.length - 8} more` : ''}. Trace each in context/numbers.json or cut it.`);
  }
  return { fails, warns };
};

const LEAKS = [
  [/\b(?:facts|market|research|lessons|preferences|spec|contract|DECISIONS|knowledge|taste-brief)\.md\b/i, "a working file name"],
  [/\[(?:INTERNAL|TODO|TBD|CONFIRM|INSERT|FILL|PLACEHOLDER)[^\]]*\]/i, "a placeholder"],
  [/\b(?:TBD|TODO|UNKNOWN|UNCONFIRMED)\b/, "an unfinished marker"],
  [/\[(?:insert|fill|your|add)\b[^\]]*\]/i, "a fill-in blank"],
  [/\bX{3,}\b|\b_{4,}\b/, "a blank to fill"],
  [/(?<!^\s*[-*]\s*)\[(?:X{1,2}|N|#|\?+|\.{3}|…)\](?!\()/, "a blank to fill"],
  [/\[(?:number|amount|price|link|url|name|date|brand|product|code|percent|count)\b[^\]]{0,30}\](?!\()/i, "a fill-in blank"],
  [/\b(?:internal notes?|notes? (?:to self|for (?:the )?(?:team|reviewer|editor))|not for publication|do not publish|for internal use)\b/i, "a note not meant for the reader"],
  [/\b(?:the spec sheet|acceptance tests?|SAME-CONTEXT|the fresh reviewer|the yardstick|candidate [A-D]\b|context\/)/i, "method words"],
];
text.split(/\r?\n/).forEach((line, i) => {
  for (const [re, what] of LEAKS) {
    const m = line.match(re);
    if (m) {
      const field = ["a placeholder", "a fill-in blank", "a blank to fill"].includes(what);
      if (requestedTemplate && field && !/\[(?:INTERNAL|TODO|TBD|CONFIRM)\b/i.test(m[0])) acceptedTemplateFields++;
      else problems.push(`line ${i + 1}: ${what} "${m[0]}": ${line.trim().slice(0, 100)}`);
    }
  }
});

// Homework: work handed back to an owner who cannot be asked. Keep in step with quality/leakcheck.cjs.
const labelOf = line => {
  const s = line.replace(/^\s*>?\s*/, "");
  const m = s.match(/^#{1,6}\s+(.+?)\s*#*\s*$/) || s.match(/^(?:[-*+]\s+)?(?:\*\*|__)(.+?)(?:\*\*|__)/) || s.match(/^(?:[-*+]\s+)?([A-Za-z][\w ,&'-]{0,60}?)\s*:/)
    || s.match(/^([A-Za-z][\w ,&'()-]{0,60}?)\s*$/); // a short bare line, such as an HTML heading
  return m ? m[1].replace(/^\s*(?:\d+[.)]|[A-Z][.)])\s+/, "").replace(/[:.\s]+$/, "") : null;
};
const HOMEWORK_LABEL = /^(?:(?:assumptions?|items?|points?|things|details|facts|figures|numbers|questions|left|still|and)\s+){0,3}to (?:confirm|be confirmed|approve|check with you)\b(?!\s+(?:your|you|the order|an order|order|it|that you)\b)|^(?:[\w'-]+\s+)?(?:open|outstanding|unanswered|remaining) questions?\b|^questions? (?:for|to) (?:you|the owner|the client)\b|^(?:needs?|awaiting|pending) (?:your )?(?:confirmation|approval|sign-?off|yes)\b/i;
const HOMEWORK = [
  [/\byour (?:yes|go-ahead|sign-?off)\b/i, "an ask for the owner's yes"],
  [/(?<!\b(?:no|without)\s)\b(?:board|owner|founder|product|management|client|final|exec(?:utive)?|leadership)\s+sign[- ]?off\b|\b(?:awaiting|pending)\s+(?:a\s+|the\s+|your\s+)?sign[- ]?off\b/i, "a sign-off ask"],
  [/\bplease confirm\b(?!\s+(?:your|you|so|by|here|below|the order|order|that you)\b)/i, "an ask to confirm"],
  [/\bbefore anything (?:goes|is|gets) (?:live|sent|published|launched)\b/i, "an approval gate inside the plan"],
];
const ALTERNATES = [
  [/^\s*(?:[-*+>|]\s*)*(?:\*\*|__)?(?:email\s+\d+\s+)?(?:subject(?:\s+line)?|headline|preview(?:\s+text)?|preheader)\b[^:|]{0,20}(?::|\|).*\(\s*(?:test|alt|alternate|alternative|variant|option|or)\s*:/i, "a test alternate inside a field"],
  [/^\s*(?:[-*+>|]\s*)*(?:\*\*|__)?runner[- ]up\s*(?:\*\*|__)?\s*:/i, "a runner-up option"],
];
const EDITOR = [
  [/^\s*(?:[-*+>]\s*)*(?:\*\*|__|_|\*)?(?:the|this) (?:copy|draft|email)\s+(?:never|doesn'?t|does not|avoids?|leaves out|omits?|steers clear|stays away|deliberately|intentionally|on purpose)\b(?!.*\b(?:because|so that|since)\b)/i, "an editor note"],
  [/\b(?:editor|writer|designer|copywriter)'?s'? notes?\b|\bnotes? (?:to|for) (?:the )?(?:writer|designer|copywriter)\b/i, "an editor note"],
];
// Copy a customer reads ("Please confirm so we can pack it.") is not an ask to the owner.
const COPY_FIELD = /^\s*(?:[-*+|]\s*)*(?:\*\*|__)?(?:primary text|headline|body(?: copy)?|description|caption|subject(?: line)?|preview(?: text)?|preheader|hook|script|voice-?over|vo|on-screen(?: text)?|overlay|cta|message|copy|post|answer|a)(?:\s*\d+)?\s*(?:\([^)]*\))?\s*(?:\*\*|__)?\s*:/i;
const inCopy = (line, m) => /^\s*>/.test(line) || COPY_FIELD.test(line)
  || [...line.matchAll(/"([^"]{12,})"|\u201c([^\u201d]{12,})\u201d/g)].some(q => (q[1] || q[2]).includes(m[0]));
text.split(/\r?\n/).forEach((line, i) => {
  const show = line.trim().slice(0, 100);
  const label = labelOf(line);
  if (label && HOMEWORK_LABEL.test(label)) problems.push(`line ${i + 1}: homework "${label}": decide each point, or write one assumption line where it changes what to do: ${show}`);
  else for (const [re, what] of HOMEWORK) {
    const m = line.match(re);
    if (m && !inCopy(line, m)) { problems.push(`line ${i + 1}: ${what} "${m[0]}": approvals belong outside the deliverable: ${show}`); break; }
  }
  for (const [re, what] of ALTERNATES) {
    if (!re.test(line)) continue;
    if (optionsRequested) acceptedOptions++;
    else problems.push(`line ${i + 1}: ${what}: give one final answer unless the brief asks for options: ${show}`);
  }
  for (const [re, what] of EDITOR) {
    const m = line.match(re);
    if (m) { problems.push(`line ${i + 1}: ${what} "${m[0].trim()}": ${show}`); break; }
  }
});

// Repetition: the same run of 6 or more words in 3 or more separate lines (variants that all lean on one stock line).
// A note, not a failure: a repeated legal line can be right, a repeated price or spec string in every variant rarely is.
const notes = [];
const seen = new Map();
text.split(/\r?\n/).forEach((line, i) => {
  const w = line.replace(/[|*_#>`]/g, " ").toLowerCase().match(/[\p{L}\p{N}₹$%.,']+/gu) ?? [];
  const mine = new Set();
  for (let k = 0; k + 6 <= w.length; k++) mine.add(w.slice(k, k + 6).join(" "));
  for (const g of mine) (seen.get(g) ?? seen.set(g, []).get(g)).push(i + 1);
});
const repeated = [...seen.entries()].filter(([, lines]) => lines.length >= 3)
  .filter(([g], _, all) => !all.some(([h, l]) => h !== g && h.includes(g) && l.length >= 3));
const reported = new Set();
for (const [g, lines] of repeated.sort((a, b) => b[1].length - a[1].length)) {
  const key = lines.join(",");
  if (reported.has(key)) continue; reported.add(key);
  if (reported.size > 5) break;
  notes.push(`"${g}" repeats on ${lines.length} lines (${lines.slice(0, 6).join(", ")}): give each variant its own words or proof unless the repeat is required`);
}

let briefNote = "";
if (briefFile) {
  const ledgerFile = numbersFile ?? ["context/numbers.json", path.join(path.dirname(briefFile), "numbers.json")].find(f => fs.existsSync(f));
  const copy = COPY_FAMILIES.has(profileName ?? "");
  const r = briefChecks({ lines: text.split(/\r?\n/), brief: readFileSync(briefFile, "utf8"), ledger: ledgerFile ? ledgerNumbers(ledgerFile) : [], copy });
  // "[X]" is already reported above as a blank to fill.
  problems.push(...r.fails.filter(f => !f.includes('writes "[X]"')));
  notes.push(...r.warns);
  briefNote = `Brief mode: checked against ${briefFile}${ledgerFile ? " and " + ledgerFile : ""}${copy ? ", as a copy job" : ""}.`;
}

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
if (briefNote) console.log(briefNote);
if (requestedTemplate) console.log(`Requested-template mode: ${acceptedTemplateFields} intentional field matches accepted; field completion is not claimed.`);
if (optionsRequested) console.log(`Options-requested mode: ${acceptedOptions} alternate matches accepted.`);
if (notes.length) console.log(`Worth a look (does not fail):\n- ${notes.join("\n- ")}`);
if (problems.length) {
  console.log(`${problems.length} to fix:\n- ${problems.join("\n- ")}`);
  process.exitCode = 1;
} else console.log("Clean: nothing internal, unfinished or left for the owner to do.");
