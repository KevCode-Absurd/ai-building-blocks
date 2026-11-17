// Reader-visible internal notes, unintended fields and homework left for the owner. Plain Node, no dependencies.
// Usage: node leakcheck.cjs <file> [--requested-template] [--options-requested] [--customer-copy]
//          [--brief <brief>] [--numbers <numbers.json>] [--profile <family>]
// --requested-template accepts intentional fields only when the brief requests a fill-in template.
// --options-requested accepts alternates (a "Runner-up:" line, "(test: ...)" in a subject or headline) only when the
//   brief asks for options.
// --customer-copy treats every line as copy a customer or candidate reads (for the evidence warning).
// --date-source <file> accepts exact ISO dates occurring in a declared evidence file; repeat for multiple files.
// --brief checks the work against the brief it answers. It fails on a calendar date the brief does not give, on a
//   "Bolder move" heading or bold label in a copy job (--profile names a copy family, or --customer-copy), and on
//   describe-not-write lines ("use a real", "a real ticket from the last", "pick one from", "take the quiz", "[X]",
//   "$X"). It warns on a weekday the brief does not give (a rhythm such as "every Monday" passes), and on a money or
//   percentage figure in neither the brief nor the numbers ledger (--numbers, else context/numbers.json if present).
// Finished work holds no homework: no "To confirm" box, no ask for the owner's yes or sign-off, no editor notes.
// Evidence stacks in customer copy ("142 of our 400 reviewers say", correlation figures) warn without failing.
// Exit 0 = clean (warnings allowed), 1 = something to fix, 2 = usage error. check-handover.mjs mirrors the homework
// and brief rules.
const fs = require('fs');
const path = require('path');
const usage = 'Usage: node leakcheck.cjs <file> [--requested-template] [--options-requested] [--customer-copy] [--brief <brief>] [--numbers <numbers.json>] [--profile <family>]';
const args = process.argv.slice(2);
const flags = new Set(), values = {}, files = [], dateSources = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (['--brief', '--numbers', '--profile', '--date-source'].includes(a)) {
    const v = args[++i];
    if (!v || v.startsWith('--')) { console.error(`${a} needs a value\n${usage}`); process.exit(2); }
    if (a === '--date-source') dateSources.push(v); else values[a.slice(2)] = v;
  } else if (a.startsWith('--')) flags.add(a);
  else files.push(a);
}
const file = files[0];
const requestedTemplate = flags.has('--requested-template');
const optionsRequested = flags.has('--options-requested');
const customerCopy = flags.has('--customer-copy');
if (!file) { console.error(usage); process.exit(2); }
let brief = null;
if (values.brief) { try { brief = fs.readFileSync(values.brief, 'utf8'); } catch { console.error('Cannot read the brief ' + values.brief); process.exit(2); } }
if (values.numbers && !fs.existsSync(values.numbers)) { console.error('Cannot read the numbers ledger ' + values.numbers); process.exit(2); }
// Exact source dates are evidence, not invented deadlines. This occurrence check
// does not authenticate the source or prove the date's meaning in the deliverable.
const sourceDates = new Set();
for (const source of dateSources) {
  try {
    const stat = fs.statSync(source);
    if (!stat.isFile() || stat.size > 4_000_000) throw Error('date source must be a file of at most 4 MB');
    for (const m of fs.readFileSync(source, 'utf8').matchAll(/\b20\d{2}-\d{2}-\d{2}\b/g)) sourceDates.add(m[0]);
  } catch (e) { console.error(`Cannot read date source ${source}: ${e.message}`); process.exit(2); }
}
let text;
try { text = fs.readFileSync(file, 'utf8'); }
catch { console.error('Cannot read ' + file); process.exit(2); }
const hits = [];
const warnings = [];
let fields = 0, options = 0;
if (/\.html?$/i.test(file)) {
  const tags = /<([a-z0-9]+)\b[^>]*\b(class|id)\s*=\s*["'][^"']*\b(note|notes|internal|debug|todo|dev|annotation|reviewer|editor|sources-panel|fact-?check)\b[^"']*["'][^>]*>/gi;
  for (const m of text.matchAll(tags)) hits.push('element looks like an internal note: ' + m[0].slice(0, 120));
  text = text.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
}
// Trace-to-brief checks (--brief <file>). Keep in step with check-handover.mjs.
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
    const invented = [...new Set(datesIn(unbracketed).filter(d => !sourceDates.has(d.text.trim()) && !briefDates.has(`${d.day}-${d.month ?? '*'}`) && !onCalendar(d)).map(d => d.text.trim()))];
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

const rules = [
  { re: /\b(facts|market|research|lessons|preferences|contract|check)\.md\b/i },
  { re: /\[INTERNAL[^\]]*\]/i },
  { re: /\b(?:UNKNOWN|UNCONFIRMED|TBD|TODO)\b/ },
  { re: /\bXX+\b/, field: true },
  { re: /\[(insert|fill|placeholder|your|name|date|confirm)[^\]]*\]/i, field: true },
  { re: /\{\{[^}]+\}\}/, field: true },
  { re: /\bcand-[a-d]\b/i },
  { re: /\b(company memory|research file|facts file|the checker|the contract|this workflow|quality engine|draft [A-D]\b)/i },
  { re: /\b(internal notes?|notes? for (the )?(team|reviewer|editor)|not for publication|do not publish|for internal use)\b/i },
  { re: /scratchpad|qbench|[A-Z]:[\\\/]Users[\\\/]/i },
];

// Homework: work handed back to an owner who cannot be asked. Keep these rules in step with check-handover.mjs.
// The label of a line: a heading, a leading bold label, or a short leading "Label:".
const labelOf = line => {
  const s = line.replace(/^\s*>?\s*/, '');
  const m = s.match(/^#{1,6}\s+(.+?)\s*#*\s*$/) || s.match(/^(?:[-*+]\s+)?(?:\*\*|__)(.+?)(?:\*\*|__)/) || s.match(/^(?:[-*+]\s+)?([A-Za-z][\w ,&'-]{0,60}?)\s*:/)
    || s.match(/^([A-Za-z][\w ,&'()-]{0,60}?)\s*$/); // a short bare line, such as an HTML heading
  return m ? m[1].replace(/^\s*(?:\d+[.)]|[A-Z][.)])\s+/, '').replace(/[:.\s]+$/, '') : null;
};
// A box of points to confirm or questions to answer ("To confirm", "Assumptions to confirm", "Open questions").
const HOMEWORK_LABEL = /^(?:(?:assumptions?|items?|points?|things|details|facts|figures|numbers|questions|left|still|and)\s+){0,3}to (?:confirm|be confirmed|approve|check with you)\b(?!\s+(?:your|you|the order|an order|order|it|that you)\b)|^(?:[\w'-]+\s+)?(?:open|outstanding|unanswered|remaining) questions?\b|^questions? (?:for|to) (?:you|the owner|the client)\b|^(?:needs?|awaiting|pending) (?:your )?(?:confirmation|approval|sign-?off|yes)\b/i;
const HOMEWORK = [
  [/\byour (?:yes|go-ahead|sign-?off)\b/i, "an ask for the owner's yes"],
  [/(?<!\b(?:no|without)\s)\b(?:board|owner|founder|product|management|client|final|exec(?:utive)?|leadership)\s+sign[- ]?off\b|\b(?:awaiting|pending)\s+(?:a\s+|the\s+|your\s+)?sign[- ]?off\b/i, 'a sign-off ask'],
  [/\bplease confirm\b(?!\s+(?:your|you|so|by|here|below|the order|order|that you)\b)/i, 'an ask to confirm'],
  [/\bbefore anything (?:goes|is|gets) (?:live|sent|published|launched)\b/i, 'an approval gate inside the plan'],
];
// Alternates the owner must choose between; they pass only with --options-requested.
const ALTERNATES = [
  [/^\s*(?:[-*+>|]\s*)*(?:\*\*|__)?(?:email\s+\d+\s+)?(?:subject(?:\s+line)?|headline|preview(?:\s+text)?|preheader)\b[^:|]{0,20}(?::|\|).*\(\s*(?:test|alt|alternate|alternative|variant|option|or)\s*:/i, 'a test alternate inside a field'],
  [/^\s*(?:[-*+>|]\s*)*(?:\*\*|__)?runner[- ]up\s*(?:\*\*|__)?\s*:/i, 'a runner-up option'],
];
// Editor notes: a line that talks about the copy itself, to the writer rather than to the reader.
const EDITOR = [
  [/^\s*(?:[-*+>]\s*)*(?:\*\*|__|_|\*)?(?:the|this) (?:copy|draft|email)\s+(?:never|doesn'?t|does not|avoids?|leaves out|omits?|steers clear|stays away|deliberately|intentionally|on purpose)\b(?!.*\b(?:because|so that|since)\b)/i, 'an editor note'],
  [/\b(?:editor|writer|designer|copywriter)'?s'? notes?\b|\bnotes? (?:to|for) (?:the )?(?:writer|designer|copywriter)\b/i, 'an editor note'],
];

// Evidence stacks in customer copy: counts of reviewers or customers who say something, and correlation figures.
// A single plain claim ("4.5 stars from 20,000+ reviews") passes. Customer copy means a quoted line, a blockquote,
// a copy field ("Primary text:", "Headline:", "Body:"), brand voice ("of our 400 reviewers"), or any line with --customer-copy.
const PEOPLE = '(?:verified\\s+)?(?:reviewers|reviews|customers|buyers|shoppers|users|owners|members|subscribers|clients|parents|readers)';
const SAY = '(?:say|said|says|mention|mentioned|tell us|told us|call|called|ask|asked|report|reported|agree|write|wrote|note|noted|rave|praise|love|loved|rate|rated|describe|find|found)\\b';
const COUNT = '(?:\\d+\\s+in\\s+\\d+|\\d[\\d,.]*\\+?%?)';
const STACK = new RegExp(`\\b${COUNT}\\s+(?:of\\s+(?:(?:our|the|all)\\s+)?(?:\\d[\\d,]*\\s+)?)?${PEOPLE}\\s+(?:\\w+\\s+){0,2}?${SAY}|\\bof\\s+(?:our|the|all)\\s+\\d[\\d,]*\\s+${PEOPLE},?\\s+${COUNT}\\s+(?:\\w+\\s+){0,2}?${SAY}`, 'i');
const CORRELATION = /\bcorrelat\w*\b|\br\s*=\s*[-−]?0?\.\d+|\b(?:predicted|predicts|tracks?|tracked)\b[^.]{0,80}\(\s*[-−]?0?\.\d+\s*\)/i;
const COPY_FIELD = /^\s*(?:[-*+|]\s*)*(?:\*\*|__)?(?:primary text|headline|body(?: copy)?|description|caption|subject(?: line)?|preview(?: text)?|preheader|hook|script|voice-?over|vo|on-screen(?: text)?|overlay|cta|message|copy|post|answer|a)(?:\s*\d+)?\s*(?:\([^)]*\))?\s*(?:\*\*|__)?\s*:/i;
const quotedSpans = line => [...line.matchAll(/"([^"]{12,})"|“([^”]{12,})”/g)].map(m => m[1] || m[2]);
// Copy a customer reads ("Please confirm so we can pack it.") is not an ask to the owner.
const inCopy = (line, m) => /^\s*>/.test(line) || COPY_FIELD.test(line) || quotedSpans(line).some(q => q.includes(m[0]));
const isCustomerLine = (line, m) => customerCopy || /^\s*>/.test(line) || COPY_FIELD.test(line) || /\bour\b/i.test(m[0]) || quotedSpans(line).some(q => q.includes(m[0]));

text.split(/\r?\n/).forEach((line, i) => {
  const where = `line ${i + 1}`;
  const show = line.trim().slice(0, 120);
  for (const rule of rules) {
    const m = line.match(rule.re);
    if (!m) continue;
    if (requestedTemplate && rule.field) fields++;
    else hits.push(`${where}: "${m[0]}" in: ${show}`);
  }
  const label = labelOf(line);
  if (label && HOMEWORK_LABEL.test(label)) hits.push(`${where}: homework box "${label}": decide each point, or write one assumption line where it changes what to do. In: ${show}`);
  else for (const [re, what] of HOMEWORK) { const m = line.match(re); if (m && !inCopy(line, m)) { hits.push(`${where}: ${what} "${m[0]}": approvals belong outside the deliverable. In: ${show}`); break; } }
  for (const [re, what] of ALTERNATES) {
    if (!re.test(line)) continue;
    if (optionsRequested) options++; else hits.push(`${where}: ${what}: give one final answer unless the brief asks for options. In: ${show}`);
  }
  for (const [re, what] of EDITOR) { const m = line.match(re); if (m) { hits.push(`${where}: ${what} "${m[0].trim()}" in: ${show}`); break; } }
  const stack = line.match(STACK);
  if (stack && isCustomerLine(line, stack)) warnings.push(`${where}: evidence stack "${stack[0]}": in customer copy use a customer's own words or one plain claim. In: ${show}`);
  const corr = line.match(CORRELATION);
  if (corr && isCustomerLine(line, corr)) warnings.push(`${where}: internal figure "${corr[0]}": keep analysis out of customer or candidate copy. In: ${show}`);
});
if (brief !== null) {
  const ledgerFile = values.numbers ?? ['context/numbers.json', path.join(path.dirname(values.brief), 'numbers.json')].find(f => fs.existsSync(f));
  const copy = customerCopy || COPY_FAMILIES.has(values.profile ?? '');
  const r = briefChecks({ lines: text.split(/\r?\n/), brief, ledger: ledgerFile ? ledgerNumbers(ledgerFile) : [], copy });
  hits.push(...r.fails); warnings.push(...r.warns);
  console.log(`Brief mode: checked against ${values.brief}${ledgerFile ? ' and ' + ledgerFile : ''}${copy ? ', as a copy job' : ''}.`);
}
if (requestedTemplate) console.log(`Requested-template mode: ${fields} intentional field matches accepted; field completion is not claimed.`);
if (optionsRequested) console.log(`Options-requested mode: ${options} alternate matches accepted.`);
// Failures print before warnings, so a short report (qe-check keeps the first lines) shows what to fix first.
if (hits.length) console.log(`LEAKS (${hits.length}):\n` + hits.join('\n'));
if (warnings.length) console.log(`WARN (${warnings.length}, does not fail):\n` + warnings.join('\n'));
if (!hits.length) console.log('clean');
process.exitCode = hits.length ? 1 : 0;
