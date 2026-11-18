#!/usr/bin/env node
// Hand-over check (METHOD.md, step 5): run it on the finished deliverable before you hand it over.
//
//   node tools/check-handover.mjs <deliverable> [plain-answer] [--one-page] [--bundle-root <delivered folder>]
//
// 1. Leaks: anything internal or unfinished a reader would see, such as working file names, notes to self,
//    placeholders ([X], [link], TBD, UNKNOWN). For HTML it reads the text a visitor sees and flags elements that look
//    like notes. It also notes (without failing) a run of 6+ words repeated on 3+ lines, such as one stock line in
//    every ad variant.
// 2. Length: the words a reader sees, against the plain answer written from the brief alone. Up to 1.3 times is the
//    aim; over 1.6 times fails unless the brief asked for more. --one-page fails over about 450 words.
// --profile <family> uses the shipped v3 family aim and ceiling. Legacy calls retain their old limits.
// --requested-more records that the brief explicitly requests more; it waives only the ratio ceiling.
// A non-buyer-facing profile treats this unvalidated baseline ratio as a review note,
// not a gate. Explicit owner word/page limits still bind; a short incomplete baseline
// must not force facts or requested analysis out of the delivered work.
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
import { dateOccurrences, sourceDateKeys, dateEvidenceForMatch } from './quality/date-evidence.cjs';

const args = process.argv.slice(2);
if (args.includes("--bundle-help")) {
  console.log([
    "Portable handoff: node tools/check-handover.mjs <delivered entry> --bundle-root <delivered folder>",
    "",
    "Run each separate entry point, then copy/extract the bundle elsewhere and open that relocated copy.",
    "Include the small reproduce/ or verification/ subset promised to the receiver, with its dependencies.",
    "Do not link to working ../context files or pack tools absent from the delivery. Creator-only checks are historical verification.",
    "Private external inputs may stay external: document their input contract, source locator/hash and required access.",
    "Never copy all working context, credentials, customer exports or hidden reasoning just to make links pass.",
    "",
    "The optional check follows reachable static Markdown/HTML/SVG/CSS references. Missing files, absolute local paths,",
    "out-of-folder paths and linked files/directories fail. It does not run delivered code or fetch remote resources.",
    "Reachable MD/Markdown, HTML, CSS, SVG, CSV, TSV, JSON and TXT files must be valid UTF-8 and at most 64 MB each.",
    "JSON must also parse as strict JSON without a leading BOM. Bytes are never rewritten; binary assets are not decoded.",
    "Other file extensions receive path checks only. JSON values and CSV/TSV/TXT contents are not treated as dependency links.",
    "Choose a supported text file as the entry point and link binary/code assets from it; unsupported entry types fail.",
    "These are encoding and JSON syntax checks, not schema, data meaning, image fidelity or visual validation.",
    "Root-relative /assets paths fail the portable-file boundary; use relative paths or test a separately declared hosted artifact.",
    "Remote destinations, including //host/path, are counted without fetching; verify them in the intended hosting environment.",
    "This is not a full Markdown/HTML/CSS parser. JavaScript/module imports, dynamic routes, archive contents, anchor IDs,",
    "remote availability and browser behavior need their relevant independent checks."
  ].join("\n"));
  process.exit(0);
}
const onePage = args.includes("--one-page");
const profileAt = args.indexOf("--profile");
const profileName = profileAt >= 0 ? args[profileAt + 1] : null;
const valueAt = new Set(args.flatMap((a, i) => ["--profile", "--brief", "--numbers", "--date-source", "--bundle-root"].includes(a) ? [i + 1] : []));
const valueOf = flag => { const i = args.indexOf(flag); if (i < 0) return null; const v = args[i + 1]; if (!v || v.startsWith("--")) { console.error(`${flag} needs a value.`); process.exit(2); } return v; };
const briefFile = valueOf("--brief"), numbersFile = valueOf("--numbers"), bundleRoot = valueOf("--bundle-root");
const dateSources = args.flatMap((a, i) => a === '--date-source' ? [args[i + 1]] : []);
if (dateSources.some(f => !f || f.startsWith('--'))) { console.error('--date-source needs a file'); process.exit(2); }
// Unambiguous full source dates match across formats, preserving the year. This occurrence check
// does not authenticate the source or prove the date's meaning in the deliverable.
const sourceDates = new Set();
for (const source of dateSources) {
  try {
    const stat = fs.statSync(source);
    if (!stat.isFile() || stat.size > 4_000_000) throw Error('date source must be a file of at most 4 MB');
    for (const key of sourceDateKeys(fs.readFileSync(source, 'utf8'))) sourceDates.add(key);
  } catch (e) { console.error(`Cannot read date source ${source}: ${e.message}`); process.exit(2); }
}

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
  console.error("Usage: node tools/check-handover.mjs <deliverable> [plain-answer] [--one-page] [--profile <family>] [--requested-more] [--requested-template] [--options-requested] [--bundle-root <delivered folder>] [--brief <brief> [--numbers <numbers.json>]]");
  process.exit(2);
}

const isHtml = f => /\.html?$/i.test(f);
const visibleText = (f, raw) => isHtml(f)
  ? raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, "\n").replace(/&nbsp;/g, " ")
  : raw;
const words = text => (text.replace(/[|#*_>`~-]+/g, " ").match(/[\p{L}\p{N}$%€£₹][^\s]*/gu) ?? []).length;

// Optional static dependency check; never fetch a URL or run delivered code.
// Not a browser, JS/module/package resolver, anchor validator or archive inspector.
function checkBundle(rootName, entryName) {
  const root = path.resolve(rootName), entry = path.resolve(entryName);
  const problems = [], pending = [], visited = new Set(), checked = new Set();
  let references = 0, remote = 0, readable = false, entryText = '';
  const isText = target => /\.(?:md|markdown|html?|css|svg|csv|tsv|json|txt)$/i.test(target);
  const inside = target => { const rel = path.relative(root, target); return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep)); };
  const show = target => path.relative(root, target).split(path.sep).join('/') || '.';
  const issue = message => { if (problems.length < 50) problems.push('bundle: ' + message); };
  const checkFile = (target, from) => {
    if (!inside(target)) { issue(from + ': local dependency leaves the delivered folder'); return false; }
    try {
      let current = root;
      for (const part of ['', ...path.relative(root, target).split(path.sep).filter(Boolean)]) {
        if (part) current = path.join(current, part);
        if (fs.lstatSync(current).isSymbolicLink()) { issue(from + ': linked file or directory is not a portable dependency (' + show(current) + ')'); return false; }
      }
      const rel = path.relative(fs.realpathSync(root), fs.realpathSync(target));
      if (path.isAbsolute(rel) || rel === '..' || rel.startsWith('..' + path.sep)) { issue(from + ': resolved dependency leaves the delivered folder'); return false; }
      if (!fs.statSync(target).isFile()) { issue(from + ': dependency must name an explicit file (' + show(target) + ')'); return false; }
      checked.add(target);
      return true;
    } catch { issue(from + ': missing or unreadable local dependency (' + show(target) + ')'); return false; }
  };
  try {
    if (!fs.lstatSync(root).isDirectory() || fs.lstatSync(root).isSymbolicLink()) throw Error();
  } catch { issue('root must be an existing, unlinked directory'); return { problems, readable, references, remote, files: 0 }; }
  if (!checkFile(entry, 'entry point')) return { problems, readable, references, remote, files: checked.size };
  if (!isText(entry)) {
    issue('entry point must be a supported text file (MD/Markdown, HTML, CSS, SVG, CSV, TSV, JSON or TXT); link binary/code assets from that entry');
    return { problems, readable, references, remote, files: checked.size };
  }
  readable = true; pending.push(entry);
  const decodeHtml = value => value.replace(/&(?:#(x[0-9a-f]+|\d+)|(amp|quot|apos|lt|gt));/gi, (all, numeric, named) => {
    if (!numeric) return ({ amp:'&', quot:'"', apos:"'", lt:'<', gt:'>' })[named.toLowerCase()];
    const point = numeric[0].toLowerCase() === 'x' ? parseInt(numeric.slice(1), 16) : Number(numeric);
    return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : all;
  });
  const follow = (value, source, kind) => {
    references++;
    if (references > 20_000) { if (references === 20_001) issue('reference limit reached; split the handoff into smaller checked entry points'); return; }
    let ref = decodeHtml(value).trim();
    if (!ref || ref.startsWith('#') || ref.startsWith('?')) return;
    const from = show(source) + ' ' + kind;
    if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(ref)) { remote++; return; }
    if (/^(?:file:|[a-z]:[\\/]|[\\/])/i.test(ref)) { issue(from + ': absolute local path is not portable'); return; }
    if (/^[a-z][a-z\d+.-]*:/i.test(ref)) { issue(from + ': unsupported URI scheme; use an explicit local file or a documented remote destination'); return; }
    ref = ref.split(/[?#]/, 1)[0];
    try { ref = decodeURIComponent(ref).replace(/\\([ ()])/g, '$1'); }
    catch { issue(from + ': invalid URL encoding'); return; }
    if (!ref) return;
    if (/[\0\r\n]/.test(ref) || path.isAbsolute(ref) || path.win32.isAbsolute(ref)) { issue(from + ': absolute or invalid local path is not portable'); return; }
    const target = path.resolve(path.dirname(source), ref.replace(/\\/g, path.sep));
    if (checkFile(target, from) && isText(target) && !visited.has(target)) pending.push(target);
  };
  const css = (content, source) => {
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of content.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) follow(m[1] ?? m[2] ?? m[3], source, 'CSS url');
    for (const m of content.matchAll(/@import\s+["']([^"']+)["']/gi)) follow(m[1], source, 'CSS import');
  };
  const html = (content, source) => {
    content = content.replace(/<!--[\s\S]*?-->/g, '');
    for (const m of content.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) css(m[1], source);
    content = content.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>').replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, '$1</style>');
    for (const tag of content.matchAll(/<[a-z][\w:-]*\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)) {
      const name = tag[0].match(/^<([\w:-]+)/)[1].toLowerCase();
      for (const attr of tag[0].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+))/g)) {
        const key = attr[1].toLowerCase(), value = attr[2] ?? attr[3] ?? attr[4];
        if (name === 'base' && key === 'href') { issue(show(source) + ': base href changes resolution; use portable explicit relative links'); continue; }
        if (['href','xlink:href','src','poster'].includes(key) || (name === 'object' && key === 'data')) follow(value, source, name + '[' + key + ']');
        if (key === 'style') css(decodeHtml(value), source);
        if (key === 'srcset') for (const item of value.matchAll(/(?:^|,)\s*(data:[^\s]+|[^,\s]+)(?:\s+[^,]*)?/gi)) follow(item[1], source, name + '[srcset]');
      }
    }
  };
  const markdown = (content, source) => {
    content = content.replace(/^\s{0,3}(\x60{3,}|~{3,})[^\n]*\n[\s\S]*?^\s{0,3}\1[ \t]*$/gm, '').replace(/(\x60+)[^\n]*?\1/g, '');
    const destination = value => {
      const v = value.trim();
      if (v.startsWith('<')) return v.slice(1, v.indexOf('>') < 0 ? undefined : v.indexOf('>'));
      return v.match(/^(?:\\.|[^\s])*/)?.[0] ?? '';
    };
    for (const opening of content.matchAll(/\]\(/g)) {
      const start = opening.index + opening[0].length;
      let end = start, depth = 1, angle = false;
      for (; end < content.length; end++) {
        const c = content[end];
        if (c === '\\') { end++; continue; }
        if (c === '<') angle = true;
        else if (c === '>') angle = false;
        else if (!angle && c === '(') depth++;
        else if (!angle && c === ')' && --depth === 0) break;
      }
      if (depth === 0) follow(destination(content.slice(start, end)), source, 'Markdown link');
    }
    for (const m of content.matchAll(/^\s{0,3}\[(?!\^)[^\]\n]+\]:\s*(<[^>]*>|[^\n]+)/gm)) follow(destination(m[1]), source, 'Markdown reference');
    html(content, source);
  };
  while (pending.length) {
    const source = pending.shift();
    if (visited.has(source)) continue;
    visited.add(source);
    if (visited.size > 2_000) { issue('document limit reached; split the handoff into smaller checked entry points'); break; }
    if (!isText(source)) continue;
    let content;
    try {
      if (fs.statSync(source).size > 64_000_000) throw Error('text file exceeds 64 MB; split or inspect separately');
      const bytes = fs.readFileSync(source);
      if (bytes.length > 64_000_000) throw Error('text file exceeds 64 MB; split or inspect separately');
      // Preserve a BOM for JSON.parse rather than silently accepting bytes strict consumers reject.
      try { content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
      catch { throw Error('text is not valid UTF-8'); }
      if (/\.json$/i.test(source)) {
        if (content.startsWith('\uFEFF')) throw Error('JSON has a leading BOM; deliver UTF-8 JSON without a BOM');
        try { JSON.parse(content); }
        catch { throw Error('invalid JSON syntax'); }
      }
    } catch (error) {
      issue(show(source) + ': ' + error.message);
      if (source === entry) readable = false;
      continue;
    }
    if (source === entry) entryText = content;
    if (/\.css$/i.test(source)) css(content, source);
    else if (/\.(?:md|markdown)$/i.test(source)) markdown(content, source);
    else if (/\.(?:html?|svg)$/i.test(source)) html(content, source);
  }
  return { problems, readable, references, remote, files: checked.size, entryText };
}
const bundle = bundleRoot ? checkBundle(bundleRoot, file) : null;
if (bundle && !bundle.readable) {
  console.log(bundle.problems.join('\n'));
  process.exit(1);
}

const raw = bundle ? bundle.entryText : readFileSync(file, "utf8");
const text = visibleText(file, raw);
const problems = [...(bundle?.problems ?? [])];

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
  const occurrences = dateOccurrences(line);
  for (const [re, pick] of DATE_FINDERS) for (const m of line.matchAll(re)) for (const [d, mo] of pick(m)) {
    const day = +d, month = mo === null ? null : /^\d+$/.test(mo) ? MONTHS[+mo - 1] : mo.slice(0, 3).toLowerCase();
    const evidence = dateEvidenceForMatch(occurrences, m.index, m[0].length);
    if (day >= 1 && day <= 31 && month !== undefined) out.push({ day, month, sourceKey: evidence?.key, text: evidence?.text || m[0].trim().replace(/\.$/, '') });
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
    const invented = [...new Set(datesIn(unbracketed).filter(d => !sourceDates.has(d.sourceKey) && !briefDates.has(`${d.day}-${d.month ?? '*'}`) && !onCalendar(d)).map(d => d.text.trim()))];
    if (invented.length) fails.push(`${where}: date not in the brief "${invented.join('", "')}": for a sourced date, include its year and a --date-source file; for an unprovided schedule, use relative days (Day 1, Week 2). In: ${show}`);
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
  if (!p) notes.push('plain baseline is empty: length comparison NOT_RUN');
  if (ratio > limits.ceiling && !requestedMore && limits.buyer_facing === false) notes.push(`length review: ${ratio.toFixed(2)} times the plain answer; check usefulness and repetition, preserving requested analysis and evidence. This baseline has not been independently checked for completeness.`);
  else if (ratio > limits.ceiling && !requestedMore) problems.push(`length: ${ratio.toFixed(2)} times the plain answer; family ceiling ${limits.ceiling}. Cut toward ${limits.aim} unless the brief asked for more`);
  else if (ratio > limits.aim) lengthNote += `; over the ${limits.aim} aim, so check every part is one the reader will use`;
}
if (onePage && n > 450) problems.push(`length: ${n} words is more than one page (about 450)`);

console.log(`Hand-over check: ${lengthNote}.`);
if (bundle) console.log(`Bundle static check: ${bundle.files} local files, ${bundle.references} references; ${bundle.remote} remote/embedded destinations not fetched. Follows only reachable Markdown/HTML/SVG/CSS references. Checks UTF-8 for recognized MD/Markdown, HTML, CSS, SVG, CSV, TSV, JSON and TXT files (64 MB each), plus JSON syntax without a leading BOM; binary assets are not decoded. This is not schema, semantic or visual validation; not JavaScript imports, dynamic routes, archive contents, anchor IDs, remote availability or browser behavior. Run each separate entry point and open the relocated deliverable.`);
if (briefNote) console.log(briefNote);
if (requestedTemplate) console.log(`Requested-template mode: ${acceptedTemplateFields} intentional field matches accepted; field completion is not claimed.`);
if (optionsRequested) console.log(`Options-requested mode: ${acceptedOptions} alternate matches accepted.`);
if (notes.length) console.log(`Worth a look (does not fail):\n- ${notes.join("\n- ")}`);
if (problems.length) {
  console.log(`${problems.length} to fix:\n- ${problems.join("\n- ")}`);
  process.exitCode = 1;
} else console.log("Clean: nothing internal, unfinished or left for the owner to do.");
