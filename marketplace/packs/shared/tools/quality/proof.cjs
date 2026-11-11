#!/usr/bin/env node
'use strict';
// proof.cjs v1 - prove it, don't say it.
// Checks a finished deliverable: (a) every link is live, (b) every figure is backed by a source file,
// (c) table totals and simple inline sums add up, (d) HTML basics. Plain Node 18+, no packages.
// Usage: node proof.cjs <deliverable> [--sources <file|dir> ...] [--offline] [--allow-external]
//        [--timeout <s>] [--verbose] [--json]
// Exit 0 = no FAIL (WARNs may remain), 1 = at least one FAIL, 2 = usage error.
const fs = require('fs'), path = require('path');

// ---------------------------------------------------------------- args
function usage() {
  console.log(`usage: node proof.cjs <deliverable.(md|html|txt|csv)> [--sources <file|dir> ...]
  --sources <f...>  research / memory files the figures should come from (repeatable; a dir adds its text files)
  --offline         skip fetching links
  --allow-external  the page is meant to load external scripts or stylesheets
  --timeout <s>     per-link timeout in seconds (default 10)
  --verbose         also list passing links and backed figures
  --json            machine-readable output`);
}
const argv = process.argv.slice(2);
const opt = { sources: [], offline: false, json: false, verbose: false, allowExternal: false, timeout: 10000 };
let file = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--sources' || a === '-s') { while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opt.sources.push(argv[++i]); }
  else if (a === '--offline' || a === '--no-links') opt.offline = true;
  else if (a === '--json') opt.json = true;
  else if (a === '--verbose' || a === '-v') opt.verbose = true;
  else if (a === '--allow-external') opt.allowExternal = true;
  else if (a === '--timeout') opt.timeout = Math.max(1, +argv[++i] || 10) * 1000;
  else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
  else if (!file) file = a;
  else { console.error('unexpected argument: ' + a); usage(); process.exit(2); }
}
if (!file) { usage(); process.exit(2); }
if (!fs.existsSync(file)) { console.error('no such file: ' + file); process.exit(2); }
const TEXT_EXT = /\.(md|markdown|txt|html?|csv|tsv|json|ya?ml)$/i;
const srcFiles = [];
for (const s of opt.sources) {
  if (!fs.existsSync(s)) { console.error('no such source: ' + s); process.exit(2); }
  if (fs.statSync(s).isDirectory()) { for (const f of fs.readdirSync(s)) { const p = path.join(s, f); if (fs.statSync(p).isFile() && TEXT_EXT.test(f)) srcFiles.push(p); } }
  else srcFiles.push(s);
}

// ---------------------------------------------------------------- text helpers
const isHtmlFile = f => /\.html?$/i.test(f);
const blank = s => s.replace(/[^\n]/g, ' ');
const lineStarts = s => { const a = [0]; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) === 10) a.push(i + 1); return a; };
const lineOf = (ls, off) => { let lo = 0, hi = ls.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (ls[mid] <= off) lo = mid; else hi = mid - 1; } return lo + 1; };
const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', times: '×', divide: '÷', minus: '−', euro: '€', pound: '£', yen: '¥', cent: '¢', copy: '©', reg: '®', trade: '™', deg: '°', middot: '·', bull: '•', rarr: '→', larr: '←', thinsp: ' ', ensp: ' ', emsp: ' ', le: '≤', ge: '≥', asymp: '≈', plusmn: '±', frac12: '½', frac14: '¼', frac34: '¾', laquo: '«', raquo: '»', shy: '', zwj: '', zwnj: '', sect: '§', para: '¶', micro: 'µ', check: '✓', dagger: '†', Dagger: '‡' };
function decodeEnt(e) {
  const m = e.match(/^&(?:#x([0-9a-f]+)|#(\d+)|([a-z][a-z0-9]*));$/i); if (!m) return e;
  try { if (m[1]) return String.fromCodePoint(parseInt(m[1], 16)); if (m[2]) return String.fromCodePoint(+m[2]); } catch { return e; }
  return m[3] in ENT ? ENT[m[3]] : e;
}
const decodeAll = s => s.replace(/&(?:#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, decodeEnt);
const BLOCK = /^(p|div|li|ul|ol|h[1-6]|tr|td|th|table|section|article|header|footer|main|nav|aside|br|hr|figure|figcaption|blockquote|pre|dt|dd|dl|form|label|button|summary|details|caption|thead|tbody|tfoot|option|title|text|tspan)$/i;

// Visible text of an HTML page, with a map back to source offsets (for line numbers).
function htmlVisible(src) {
  const re = /<!--[\s\S]*?-->|<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>|<head\b[^>]*>[\s\S]*?<\/head\s*>|<!doctype[^>]*>|<\/?([a-zA-Z][\w:-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>|&(?:#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi;
  const out = [], pos = []; let last = 0, m;
  const pushText = (s, p) => { for (let i = 0; i < s.length; i++) { out.push(s[i]); pos.push(p + i); } };
  const pushRep = (s, p) => { for (let i = 0; i < s.length; i++) { out.push(s[i]); pos.push(p); } };
  while ((m = re.exec(src))) {
    pushText(src.slice(last, m.index), last);
    if (m[0][0] === '&') pushRep(decodeEnt(m[0]), m.index);
    else pushRep(m[2] && BLOCK.test(m[2]) ? '\n' : ' ', m.index);
    last = m.index + m[0].length;
  }
  pushText(src.slice(last), last);
  return { text: out.join(''), pos };
}
// Visible text of markdown / plain text: URLs, comments and inline tags blanked so offsets stay the same.
function mdVisible(src) {
  const t = src.replace(/<!--[\s\S]*?-->/g, blank).replace(/https?:\/\/[^\s<>"'`|]+/gi, blank).replace(/<\/?[a-zA-Z][^>\n]*>/g, blank);
  return { text: t, pos: null };
}
function visibleOf(src, html) { return html ? htmlVisible(src) : mdVisible(src); }

// ---------------------------------------------------------------- figure extraction
const NUM = '(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?';
const SUFW = '(?:k|K|mm|MM|m|M|bn|BN|b|B|tn|million|billion|thousand|trillion|crore|cr|lakhs?)';
const CURS = '(?:US\\$|A\\$|C\\$|NZ\\$|HK\\$|S\\$|R\\$|\\$|€|£|¥|₹|(?:USD|EUR|GBP|INR|AUD|CAD|JPY|CHF|Rs\\.?)\\s?)';
const MON = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const MEAS = ['mcg', 'µg', 'μg', 'ug', 'mg', 'kg', 'g', 'grams?', 'kilograms?', 'lbs?', 'fl\\.? ?oz', 'oz', 'ounces?', 'mL', 'ml', 'liters?', 'litres?', 'L', 'kcal', 'Cal', 'cal', 'calories', 'IU', 'km', 'kilometers?', 'kilometres?', 'miles?', 'mi', 'ft', 'feet', 'inches', 'cm', 'mm', 'meters?', 'metres?', 'sq\\.? ?ft', 'square feet', 'acres?', 'GB', 'MB', 'TB', 'KB', 'kB', 'ms', 'Mbps', 'kWh', 'MWh', 'MW', 'kW', '°F', '°C', 'degrees'].join('|');
const TIME = ['seconds?', 'secs?', 'minutes?', 'mins?', 'hours?', 'hrs?', 'hr', 'days?', 'weeks?', 'wks?', 'wk', 'months?', 'mos?', 'mo', 'years?', 'yrs?', 'yr', 'quarters?', 'decades?', 'nights?', 'weekdays?', 'business days?'];
const THINGS = TIME.concat(['people', 'persons?', 'adults?', 'children', 'kids?', 'men', 'women', 'users?', 'customers?', 'clients?', 'members?', 'subscribers?', 'buyers?', 'shoppers?', 'consumers?', 'patients?', 'participants?', 'respondents?', 'employees?', 'staff', 'engineers?', 'developers?', 'designers?', 'founders?', 'investors?', 'teams?', 'companies', 'company', 'businesses', 'business', 'brands?', 'organi[sz]ations?', 'startups?', 'stores?', 'retailers?', 'doors', 'locations?', 'outlets?', 'countries', 'country', 'markets?', 'cities', 'states', 'reviews?', 'ratings?', 'stars?', 'votes?', 'orders?', 'purchases?', 'transactions?', 'visits?', 'visitors?', 'sessions?', 'downloads?', 'installs?', 'followers?', 'views?', 'impressions?', 'clicks?', 'leads?', 'sign-?ups?', 'accounts?', 'seats?', 'licen[cs]es?', 'integrations?', 'studies', 'study', 'trials?', 'surveys?', 'hires?', 'roles?', 'openings?', 'candidates?', 'applicants?', 'units?', 'items?', 'products?', 'skus?', 'ingredients?', 'nutrients?', 'vitamins?', 'minerals?', 'strains?', 'servings?', 'packs?', 'packets?', 'capsules?', 'tablets?', 'pills?', 'doses?', 'scoops?', 'bottles?', 'boxes', 'box', 'cans?', 'bags?', 'flavou?rs?', 'languages?', 'offices?', 'factories', 'warehouses?', 'partners?', 'suppliers?', 'vendors?', 'competitors?', 'creators?', 'lawsuits?', 'complaints?', 'refunds?', 'shipments?']).join('|');
const MULT = { k: 1e3, thousand: 1e3, m: 1e6, mm: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9, tn: 1e12, trillion: 1e12, lakh: 1e5, lakhs: 1e5, crore: 1e7, cr: 1e7 };
const numv = (n, s) => parseFloat(String(n).replace(/,/g, '')) * (s ? (MULT[String(s).toLowerCase()] || 1) : 1);
const decs = s => { const m = String(s).replace(/,/g, '').match(/\.(\d+)/); return m ? m[1].length : 0; };
const vk = v => String(Number(Math.abs(v).toPrecision(12)));
const monIdx = s => ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(s.slice(0, 3).toLowerCase()) + 1;
const y4 = y => (String(y).length === 2 ? 2000 + +y : +y);
const pad = n => String(n).padStart(2, '0');
function unitStem(u) {
  let s = String(u).toLowerCase().replace(/[.\s-]+/g, '');
  const syn = { sec: 'second', secs: 'second', seconds: 'second', min: 'minute', mins: 'minute', minutes: 'minute', hr: 'hour', hrs: 'hour', hours: 'hour', days: 'day', businessdays: 'businessday', wk: 'week', wks: 'week', weeks: 'week', mo: 'month', mos: 'month', months: 'month', yr: 'year', yrs: 'year', years: 'year', gram: 'g', grams: 'g', kilogram: 'kg', kilograms: 'kg', lbs: 'lb', ounce: 'oz', ounces: 'oz', liter: 'l', liters: 'l', litre: 'l', litres: 'l', calories: 'kcal', cal: 'kcal', μg: 'mcg', µg: 'mcg', ug: 'mcg', kilometers: 'km', kilometres: 'km', miles: 'mi', mile: 'mi', feet: 'ft', sqft: 'sqft', squarefeet: 'sqft', meters: 'm', metres: 'm', meter: 'm', metre: 'm', '×': 'x' };
  if (syn[s]) return syn[s];
  if (/ies$/.test(s)) return s.slice(0, -3) + 'y';
  if (/(ches|shes|xes|sses)$/.test(s)) return s.slice(0, -2);
  if (/[^s]s$/.test(s) && s.length > 3) return s.slice(0, -1);
  return s;
}
function dateKeys(y, m, d) {
  if (y && m && d) return { keys: ['ymd:' + y + '-' + pad(m) + '-' + pad(d)], loose: ['md:' + pad(m) + '-' + pad(d)], idx: ['ymd:' + y + '-' + pad(m) + '-' + pad(d), 'ym:' + y + '-' + pad(m), 'md:' + pad(m) + '-' + pad(d)] };
  if (y && m) return { keys: ['ym:' + y + '-' + pad(m)], loose: [], idx: ['ym:' + y + '-' + pad(m)] };
  return { keys: ['md:' + pad(m) + '-' + pad(d)], loose: [], idx: ['md:' + pad(m) + '-' + pad(d)] };
}
const capMonth = s => /^[A-Z]/.test(s); // months are capitalised in prose; avoids "these 3 may help"
const RX = [
  { kind: 'date', pri: 7, re: new RegExp(`\\b((?:19|20)\\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b`, 'g'), parse: m => ({ y: +m[1], ...dateKeys(+m[1], +m[2], +m[3]) }) },
  { kind: 'date', pri: 6, re: new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MON})\\.?(?![a-z])(?:,?\\s+((?:19|20)\\d{2})(?!\\d))?`, 'gi'), parse: m => capMonth(m[2]) && +m[1] >= 1 && +m[1] <= 31 ? { y: m[3] ? +m[3] : null, ...dateKeys(m[3] ? +m[3] : null, monIdx(m[2]), +m[1]) } : null },
  { kind: 'date', pri: 6, re: new RegExp(`\\b(${MON})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?![\\d:.,]\\d|\\d|\\s?%)(?:,?\\s+((?:19|20)\\d{2})(?!\\d))?`, 'gi'), parse: m => capMonth(m[1]) && +m[2] >= 1 && +m[2] <= 31 ? { y: m[3] ? +m[3] : null, ...dateKeys(m[3] ? +m[3] : null, monIdx(m[1]), +m[2]) } : null },
  { kind: 'date', pri: 6, re: new RegExp(`\\b(${MON})\\.?,?\\s+((?:19|20)\\d{2})(?!\\d)`, 'gi'), parse: m => capMonth(m[1]) ? { y: +m[2], ...dateKeys(+m[2], monIdx(m[1]), null) } : null },
  { kind: 'date', pri: 6, re: /\b(\d{1,2})\/(\d{1,2})\/((?:19|20)\d{2}|\d{2})\b/g, parse: m => { const y = y4(m[3]), a = dateKeys(y, +m[1], +m[2]), b = dateKeys(y, +m[2], +m[1]); return { y, keys: a.keys.concat(b.keys), loose: a.loose.concat(b.loose), idx: a.idx.concat(b.idx) }; } },
  { kind: 'date', pri: 6, re: /\b(Q[1-4]|H[12])\s?(?:FY\s?)?'?((?:19|20)\d{2}|\d{2})\b/g, parse: m => { const k = 'q:' + m[1].toUpperCase() + '-' + y4(m[2]); return { y: y4(m[2]), keys: [k], loose: [], idx: [k] }; } },
  { kind: 'date', pri: 6, re: /\bFY\s?'?((?:19|20)\d{2}|\d{2})\b/g, parse: m => { const k = 'fy:' + y4(m[1]); return { y: y4(m[1]), keys: [k], loose: [], idx: [k] }; } },
  { kind: 'money', pri: 5, re: new RegExp(`(?<![\\w$])[-−]?${CURS}\\s?[-−]?(${NUM})(?:\\s?(${SUFW})(?![\\w]))?`, 'g'), parse: m => ({ value: numv(m[1], m[2]), dec: decs(m[1]), unit: '' }) },
  { kind: 'money', pri: 5, re: new RegExp(`(?<![\\w.$])(${NUM})(?:\\s?(${SUFW}))?\\s?(?:USD|EUR|GBP|INR|AUD|CAD|JPY|CHF|dollars|euros|rupees)(?![\\w])`, 'g'), parse: m => ({ value: numv(m[1], m[2]), dec: decs(m[1]), unit: '' }) },
  { kind: 'percent', pri: 4, re: new RegExp(`(?<![\\w.])[-+−]?(${NUM})\\s?(%|percent(?![\\w])|per\\s?cent(?![\\w])|percentage points?(?![\\w])|pp(?![\\w])|bps(?![\\w])|basis points?(?![\\w]))`, 'gi'), parse: m => ({ value: numv(m[1]), dec: decs(m[1]), unit: /^(pp|percentage)/i.test(m[2]) ? 'pp' : /^b/i.test(m[2]) ? 'bps' : '%' }) },
  { kind: 'count', pri: 3, re: new RegExp(`(?<![\\w.])(${NUM})[x×](?![\\w])`, 'gi'), parse: m => ({ value: numv(m[1]), dec: decs(m[1]), unit: 'x' }) },
  { kind: 'count', pri: 3, re: new RegExp(`(?<![\\w.$€£¥₹])(${NUM})(?:\\s?-\\s?|\\s)?(${MEAS})(?![\\w])`, 'g'), parse: m => ({ value: numv(m[1]), dec: decs(m[1]), unit: unitStem(m[2]) }) },
  { kind: 'count', pri: 3, re: new RegExp(`(?<![\\w.$€£¥₹])(${NUM})(?:(k|K|M|bn)|\\s(million|billion|thousand))?\\+?(?:\\s?-\\s?|\\s)(?:([a-z][a-z-]{2,14})\\s)??(${THINGS})(?![\\w])`, 'gi'), parse: m => ({ value: numv(m[1], m[2] || m[3]), dec: decs(m[1]), unit: unitStem(m[5]) }) },
  { kind: 'rating', pri: 3, re: /(?<![\w.])(\d(?:\.\d{1,2})?)\s?(?:\/|out of)\s?(5|10)(?![\w.\d%])/gi, parse: m => ({ value: numv(m[1]), dec: decs(m[1]), unit: '/' + m[2] }) },
  { kind: 'figure', pri: 2, re: /(?<![\w.,$€£¥₹])\d{1,3}(?:,\d{3})+(?:\.\d+)?\+?(?![\w%]|[.,]\d)/g, parse: m => ({ value: numv(m[0].replace('+', '')), dec: decs(m[0]), unit: '' }) },
  // long bare numbers, but not identifiers such as "ISO 12345" or "No. 12345"
  { kind: 'figure', pri: 2, re: /(?<![\w.,$€£¥₹#])(?<!\b[A-Z]{2,}[ -]|\bNo\.? ?|\bID:? ?)\d{5,}(?:\.\d+)?(?![\w%]|[.,]\d)/g, parse: m => ({ value: numv(m[0]), dec: decs(m[0]), unit: '' }) },
  { kind: 'figure', pri: 2, re: /(?<![\w.$€£¥₹])(\d+(?:\.\d+)?)(k|K|M|bn)\+?(?![\w])/g, parse: m => ({ value: numv(m[1], m[2]), dec: decs(m[1]), unit: '' }) },
  { kind: 'figure', pri: 2, re: /(?<![\w.,$€£¥₹\/:#])\d+\.\d+(?![\w%]|[.,]\d|\s?%)/g, parse: m => ({ value: numv(m[0]), dec: decs(m[0]), unit: '' }) },
  { kind: 'year', pri: 1, re: /(?<![\w.,$€£¥₹\/#])(?:19|20)\d{2}(?![\w%]|[.,]\d)/g, parse: m => ({ y: +m[0], value: +m[0], dec: 0, unit: '' }) },
];
function extractFigures(text) {
  const cands = [];
  for (const r of RX) {
    r.re.lastIndex = 0; let m;
    while ((m = r.re.exec(text))) {
      if (!m[0]) { r.re.lastIndex++; continue; }
      const it = r.parse(m); if (!it) continue;
      const lead = m[0].length - m[0].trimStart().length;
      Object.assign(it, { kind: r.kind, pri: r.pri, start: m.index + lead, end: m.index + m[0].trimEnd().length, raw: m[0].trim() });
      cands.push(it);
    }
  }
  cands.sort((a, b) => b.pri - a.pri || (b.end - b.start) - (a.end - a.start) || a.start - b.start);
  const taken = new Uint8Array(text.length + 1), out = [];
  for (const c of cands) {
    let free = true; for (let i = c.start; i < c.end; i++) if (taken[i]) { free = false; break; }
    if (!free) continue; for (let i = c.start; i < c.end; i++) taken[i] = 1; out.push(c);
  }
  return out.sort((a, b) => a.start - b.start);
}

// ---------------------------------------------------------------- source index
function buildIndex(files) {
  const S = { keys: new Set(), vals: new Set(), years: new Set(), sorted: {} };
  const addSorted = (k, v) => (S.sorted[k] = S.sorted[k] || []).push(Math.abs(v));
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    const text = isHtmlFile(f) ? htmlVisible(raw).text : raw;
    for (const it of extractFigures(text)) {
      if (it.kind === 'date') { it.idx.forEach(k => S.keys.add(k)); if (it.y) S.years.add(it.y); continue; }
      if (it.kind === 'year') { S.years.add(it.y); S.vals.add(vk(it.value)); continue; }
      S.vals.add(vk(it.value)); addSorted('any', it.value);
      if (it.kind === 'money') { S.keys.add('money|' + vk(it.value)); addSorted('money', it.value); }
      if (it.kind === 'percent') { S.keys.add('percent|' + it.unit + '|' + vk(it.value)); addSorted('percent|' + it.unit, it.value); }
      if (it.kind === 'count') { S.keys.add('count|' + it.unit + '|' + vk(it.value)); addSorted('count|' + it.unit, it.value); }
    }
    // every bare number too (tables often hold a value without its unit)
    const re = new RegExp(`(?<![\\d.])(${NUM})(?:\\s?(million|billion|thousand|trillion|bn|k|K|M|B)(?![a-zA-Z]))?`, 'g'); let m;
    while ((m = re.exec(raw))) { S.vals.add(vk(numv(m[1]))); if (m[2]) S.vals.add(vk(numv(m[1], m[2]))); }
  }
  for (const k in S.sorted) S.sorted[k].sort((a, b) => a - b);
  return S;
}
function hasInRange(arr, lo, hi) { if (!arr) return false; let a = 0, b = arr.length; while (a < b) { const m = (a + b) >> 1; if (arr[m] < lo) a = m + 1; else b = m; } return a < arr.length && arr[a] <= hi; }
function backed(it, S) {
  const v = vk(it.value), big = Math.abs(it.value) >= 100 || it.dec > 0;
  const rounded = k => it.dec > 0 && hasInRange(S.sorted[k], Math.abs(it.value) - 0.5 * 10 ** -it.dec - 1e-9, Math.abs(it.value) + 0.5 * 10 ** -it.dec + 1e-9);
  switch (it.kind) {
    case 'date': if (it.keys.some(k => S.keys.has(k))) return 'exact'; if (it.loose.some(k => S.keys.has(k)) && S.years.has(it.y)) return 'loose'; return null;
    case 'year': return S.years.has(it.y) || S.vals.has(v) ? 'exact' : null;
    case 'money': if (S.keys.has('money|' + v)) return 'exact'; if ((big || it.value >= 10) && S.vals.has(v)) return 'loose'; return rounded('money') ? 'rounded' : null;
    case 'percent': if (S.keys.has('percent|' + it.unit + '|' + v)) return 'exact'; if (it.dec > 0 && S.vals.has(v)) return 'loose'; return rounded('percent|' + it.unit) ? 'rounded' : null;
    case 'count': if (S.keys.has('count|' + it.unit + '|' + v)) return 'exact'; if (big && S.vals.has(v)) return 'loose'; return rounded('count|' + it.unit) ? 'rounded' : null;
    default: if (S.vals.has(v)) return 'exact'; return rounded('any') ? 'rounded' : null;
  }
}
// A missing figure may be a calculation from backed figures in the same deliverable: suggest one.
// Only for figures shown with decimals (whole numbers match too many pairs by chance).
function deriveHint(t, operands) {
  if (!['money', 'percent'].includes(t.kind) || t.dec === 0) return null;
  const T = Math.abs(t.value); if (!T) return null;
  const tol = 0.5 * 10 ** -t.dec + 1e-9, same = o => o.kind === t.kind, notPct = o => o.kind !== 'percent';
  const ops = t.kind === 'percent'
    ? [['% change from', (a, b) => (a - b) / b * 100, (A, B) => notPct(A) && A.kind === B.kind], ['as % of', (a, b) => a / b * 100, (A, B) => notPct(A) && A.kind === B.kind], ['−', (a, b) => a - b, (A, B) => same(A) && same(B)]]
    : [['/', (a, b) => a / b, A => same(A)], ['×', (a, b) => a * b, (A, B) => same(A) || same(B)], ['−', (a, b) => a - b, (A, B) => same(A) && same(B)], ['+', (a, b) => a + b, (A, B) => same(A) && same(B)]];
  for (const [name, f, ok] of ops) for (const A of operands) for (const B of operands) {
    const a = A.v, b = B.v;
    if (A === B || b === 0 || a === T || b === T || (name === '/' && b === 1) || !ok(A, B)) continue;
    const r = f(a, b); if (!isFinite(r) || (t.kind === 'percent' && Math.abs(r) > 1e4)) continue;
    if (Math.abs(Math.abs(r) - T) <= tol) {
      const fmt = x => String(Number(x.toPrecision(8)));
      return name === '% change from' ? `${fmt(a)} vs ${fmt(b)} = ${fmt(r)}% change` : name === 'as % of' ? `${fmt(a)} / ${fmt(b)} = ${fmt(r)}%` : `${fmt(a)} ${name} ${fmt(b)} = ${fmt(r)}`;
    }
  }
  return null;
}

// ---------------------------------------------------------------- links
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const NS_URL = /^https?:\/\/www\.w3\.org\/(2000\/svg|1999\/xlink|1999\/xhtml|XML\/1998\/namespace|1998\/Math\/MathML)/i;
function extractUrls(raw, html) {
  let t = raw.replace(/\sxmlns(?::\w+)?\s*=\s*("[^"]*"|'[^']*')/gi, m => blank(m));
  // connection hints name an origin, not a page: not links
  if (html) t = t.replace(/<link\b(?:[^>"']|"[^"]*"|'[^']*')*\brel\s*=\s*["']?(?:preconnect|dns-prefetch)\b[^"'>]*["']?(?:[^>"']|"[^"]*"|'[^']*')*>/gi, m => blank(m));
  const ls = lineStarts(raw), re = /https?:\/\/[^\s<>"'`|\\]+(?:\\[_*()[\]#~][^\s<>"'`|\\]*)*/gi, found = new Map(); let m;
  while ((m = re.exec(t))) {
    let u = m[0].replace(/\\([_*()[\]#~])/g, '$1');
    if (html) u = decodeAll(u);
    for (;;) {
      const before = u;
      u = u.replace(/[.,;:!?*_~'"\]}>]+$/, '');
      if (u.endsWith(')') && (u.match(/\(/g) || []).length < (u.match(/\)/g) || []).length) u = u.slice(0, -1);
      if (u === before) break;
    }
    let host; try { host = new URL(u).hostname; } catch { continue; }
    if (!host || (!host.includes('.') && host !== 'localhost')) continue;
    if (NS_URL.test(u)) continue;
    if (!found.has(u)) found.set(u, { url: u, line: lineOf(ls, m.index), count: 0 });
    found.get(u).count++;
  }
  return [...found.values()];
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function checkUrl(u) {
  const target = u.split('#')[0];
  let host = ''; try { host = new URL(target).hostname; } catch {}
  if (/(^|\.)example\.(com|org|net)$/i.test(host) || /\.(example|invalid|test)$/i.test(host)) return { sev: 'WARN', status: 'placeholder', note: 'reserved example domain: replace with the real link' };
  for (let attempt = 0; attempt < 2; attempt++) {
    const ac = new AbortController(), tm = setTimeout(() => ac.abort(), opt.timeout);
    try {
      const r = await fetch(target, { method: 'GET', redirect: 'follow', signal: ac.signal, headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' } });
      clearTimeout(tm);
      const st = r.status, final = r.url, cf = r.headers.get('cf-mitigated'), server = (r.headers.get('server') || '').toLowerCase();
      try { await r.body?.cancel(); } catch {}
      if (st >= 500 && !cf && attempt === 0) { await sleep(1500); continue; }
      const res = { status: st, final: final !== target ? final : undefined };
      if (st >= 200 && st < 400) {
        res.sev = 'ok';
        if (res.final) {
          try {
            const a = new URL(target), b = new URL(final);
            const deep = a.pathname.replace(/\/+$/, '') !== '';
            if (deep && (b.pathname === '/' || b.pathname === '') && a.hostname.replace(/^www\./, '') === b.hostname.replace(/^www\./, '')) { res.sev = 'WARN'; res.note = 'redirects to the home page: the page may be gone'; }
            else if (/(^|\/)(404|not-?found|page-?not-?found|error)(\/|$|\.)/i.test(b.pathname)) { res.sev = 'WARN'; res.note = 'redirects to an error page'; }
            else if (/(^|\/)(login|log-in|signin|sign-in|sign_in|auth|sso)(\/|$|\?)/i.test(b.pathname + b.search) && !/(login|signin|sign-in|auth)/i.test(a.pathname)) { res.sev = 'WARN'; res.note = 'redirects to a sign-in page: readers without an account cannot open it'; }
          } catch {}
        }
      } else if (st === 401 || st === 403 || st === 429 || st === 999 || ((st === 503 || st === 403) && (cf || server.includes('cloudflare')))) {
        res.sev = 'WARN'; res.note = cf ? 'bot challenge: open it in a browser to confirm' : 'blocked or needs sign-in (bot blocking?): open it in a browser to confirm';
      } else { res.sev = 'FAIL'; res.note = st >= 500 ? 'server error' : 'dead link'; }
      return res;
    } catch (e) {
      clearTimeout(tm);
      const code = e.name === 'AbortError' ? 'TIMEOUT' : (e.cause && (e.cause.code || e.cause.name)) || e.message;
      if (attempt === 0 && /TIMEOUT|ECONNRESET|UND_ERR_SOCKET|EAI_AGAIN/.test(code)) { await sleep(1000); continue; }
      if (/ENOTFOUND|EAI_AGAIN|EAI_NONAME/.test(code)) return { sev: 'FAIL', status: 'DNS', note: 'domain does not resolve', net: true };
      if (/ECONNREFUSED/.test(code)) return { sev: 'FAIL', status: 'REFUSED', note: 'connection refused', net: true };
      if (code === 'TIMEOUT') return { sev: 'WARN', status: 'TIMEOUT', note: `no answer in ${opt.timeout / 1000}s: open it in a browser`, net: true };
      return { sev: 'WARN', status: String(code).slice(0, 40), note: 'could not connect (TLS or network): open it in a browser', net: true };
    }
  }
}
async function checkLinks(urls) {
  const out = new Array(urls.length); let next = 0;
  async function worker() { while (next < urls.length) { const i = next++; out[i] = Object.assign({}, urls[i], await checkUrl(urls[i].url)); } }
  await Promise.all(Array.from({ length: Math.min(6, urls.length) }, worker));
  if (out.length >= 2 && out.every(r => r.net)) out.forEach(r => { r.sev = 'WARN'; r.note = 'network looks down (every link failed before HTTP): re-run online'; });
  return out;
}

// ---------------------------------------------------------------- arithmetic
const SP = '[ \\t\\u00a0\\u2009\\u202f]';
const TOK = `(?:[-−]${SP}?)?(?:${CURS})?${SP}?${NUM}(?:${SP}?(?:k|K|M|bn|B|million|billion)(?![\\w]))?${SP}?%?`;
const TOKW = `${TOK}(?:[a-zA-Zµ°]{1,6}(?![\\w]))?(?:${SP}+[A-Za-z][A-Za-z-]*){0,3}`;
function tokVal(s) {
  const m = s.match(new RegExp(`([-−])?${SP}?(${CURS})?${SP}?(${NUM})(?:${SP}?(k|K|M|bn|B|million|billion)(?![\\w]))?${SP}?(%)?`));
  if (!m) return null;
  return { v: (m[1] ? -1 : 1) * numv(m[3], m[4]), pct: !!m[5], dec: decs(m[3]), cur: !!m[2] };
}
// within 1% of the stated figure, or within the rounding of n figures shown to `dec` decimals
const near = (calc, stated, dec, n = 1) => Math.abs(calc - stated) <= Math.max(0.01 * Math.abs(stated), dec > 0 ? n * 0.5 * 10 ** -dec : 0) + 1e-9;
function evalExpr(parts) { // parts: [val, op, val, op, val...]; × and ÷ first
  const vals = [parts[0]], ops = [];
  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i], b = parts[i + 1];
    if (/[×x*\/÷]/.test(op)) { const a = vals.pop(); vals.push(/[\/÷]/.test(op) ? a / b : a * b); } else { ops.push(op); vals.push(b); }
  }
  let r = vals[0]; ops.forEach((op, i) => { r = op === '+' ? r + vals[i + 1] : r - vals[i + 1]; });
  return r;
}
// Bracket-aware evaluator for plain arithmetic text: numbers (with $, commas, %), + − × ÷ and ( ). Returns null if it cannot parse.
function evalArith(s) {
  const toks = [], re = /[ \t ]*(?:([$€£¥₹]?\d[\d,]*(?:\.\d+)?%?)|([()+\-−–×x*\/÷]))[ \t ]*/y; let i = 0; s = s.trim();
  while (i < s.length) { re.lastIndex = i; const m = re.exec(s); if (!m) return null; i = re.lastIndex; if (m[1]) toks.push({ n: parseFloat(m[1].replace(/[$€£¥₹,%]/g, '')) / (m[1].endsWith('%') ? 100 : 1) }); else toks.push({ o: m[2].replace(/[−–]/, '-').replace(/[×x]/, '*').replace('÷', '/') }); }
  let p = 0; const peek = () => toks[p];
  const factor = () => { const t = toks[p++]; if (!t) return null; if (t.n !== undefined) return t.n; if (t.o === '(') { const v = expr(); if (v === null || !peek() || peek().o !== ')') return null; p++; return v; } if (t.o === '-') { const v = factor(); return v === null ? null : -v; } return null; };
  const term = () => { let v = factor(); while (v !== null && peek() && (peek().o === '*' || peek().o === '/')) { const o = toks[p++].o, r = factor(); if (r === null) return null; v = o === '*' ? v * r : v / r; } return v; };
  const expr = () => { let v = term(); while (v !== null && peek() && (peek().o === '+' || peek().o === '-')) { const o = toks[p++].o, r = term(); if (r === null) return null; v = o === '+' ? v + r : v - r; } return v; };
  const v = expr(); return p === toks.length && v !== null && isFinite(v) ? v : null;
}
function inlineArithmetic(vis, ls, posMap) {
  const res = [];
  const lines = vis.split('\n'); let off = 0;
  const reExpr = new RegExp(`(?<![\\w.,])(${TOKW}(?:${SP}+[+\\-−–×x*\\/÷]${SP}+${TOKW})+)${SP}*(=|≈|~=)${SP}*(${TOK})`, 'g');
  const reOf = new RegExp(`(?<![\\w.])(${NUM})${SP}?%${SP}+of${SP}+(${TOK})${SP}*(?:(?:=|is|equals|comes to|gives|→|->|≈)${SP}*(?:about${SP}+|roughly${SP}+|around${SP}+|~|≈)?(${TOK})|\\(${SP}*(?:about${SP}+|~|≈|=)?${SP}*(${TOK})${SP}*\\))`, 'gi');
  const GAP = `,?${SP}*(?:\\(|an?${SP}+|or${SP}+|up${SP}+|down${SP}+|which is${SP}+|that is${SP}+|that's${SP}+|=${SP}*|:${SP}*)?(?:about${SP}+|roughly${SP}+|nearly${SP}+|almost${SP}+|over${SP}+|just${SP}+)?`;
  const reChg = [new RegExp(`from${SP}+(${TOK})${SP}+to${SP}+(${TOK})(${GAP})(?<![\\w.])([-+−]?${NUM})${SP}?%`, 'gi'), new RegExp(`(${TOK})${SP}*(?:→|->)${SP}*(${TOK})${SP}*\\(${SP}*()([-+−]?${NUM})${SP}?%${SP}*\\)`, 'g')];
  for (const rawLine of lines) {
    const L = rawLine.replace(/\*\*|__|`|~~/g, '');
    const lineNo = lineOf(ls, posMap ? posMap[Math.min(off, posMap.length - 1)] ?? 0 : off);
    let m; const done = new Set();
    reExpr.lastIndex = 0;
    while ((m = reExpr.exec(L))) {
      const rhs = tokVal(m[3]); if (!rhs) continue;
      const before = L.slice(0, m.index).replace(/[ \t ]+$/, '');
      let calc = null, n = 0, text = m[0].trim(), unitful = false;
      if (/(?:[)+\-−–×*\/÷]|\sx)$/.test(before)) {
        // part of a longer expression, e.g. "(1 + 1) ÷ 0.025 − 1 = 79": extend left and evaluate with brackets
        const ext = before.match(/[0-9.,$€£¥₹%()+\-−–×x*\/÷ \t]*$/)[0];
        let start = 0; while (start < ext.length && !/[($€£¥₹0-9]/.test(ext[start])) start++;
        const exprText = ext.slice(start) + ' ' + m[1];
        calc = evalArith(exprText); if (calc === null) continue;
        n = (exprText.match(/\d[\d,]*(?:\.\d+)?/g) || []).length; text = (exprText + ' ' + m[2] + ' ' + m[3]).replace(/\s+/g, ' ').trim();
      } else {
        const pieces = m[1].split(new RegExp(`${SP}+([+\\-−–×x*\\/÷])${SP}+`));
        const vals = []; let ok = true;
        for (let i = 0; i < pieces.length; i++) {
          if (i % 2) { vals.push(pieces[i].replace(/[−–]/, '-')); continue; }
          const t = tokVal(pieces[i]); if (!t) { ok = false; break; }
          if (/\d[^\d\s,.%$€£¥₹]*[ \t]*[A-Za-zµ°]/.test(pieces[i].replace(/(k|K|M|bn|B|million|billion)(?![\w])/, ''))) unitful = true;
          const prevOp = pieces[i - 1] || '', nextOp = pieces[i + 1] || '';
          vals.push(t.pct && (/[×x*\/÷]/.test(prevOp) || /[×x*\/÷]/.test(nextOp)) ? t.v / 100 : t.v); n++;
        }
        if (!ok) continue;
        calc = evalExpr(vals);
        if (rhs.pct && pieces.some((p, i) => i % 2 && /[\/÷]/.test(p)) && Math.abs(calc) < 1.5 && Math.abs(rhs.v) > 1.5) calc *= 100;
      }
      const pass = near(calc, rhs.v, rhs.dec, n);
      // a mismatch with units in the operands ("$49.99 / 4 wk") may be a unit conversion: WARN, not FAIL
      res.push({ sev: pass ? 'ok' : unitful ? 'WARN' : 'FAIL', line: lineNo, text, note: pass ? '' : `works out to ${Number(calc.toPrecision(8))}${unitful ? ' (operands carry units: check the conversion)' : ''}` });
      done.add(m.index + m[0].indexOf('=', m[1].length));
    }
    // bracketed sums the pattern above cannot see, e.g. "(2 + 2) × 3 = 12"
    const reEq = new RegExp(`(=)${SP}*(${TOK})`, 'g');
    while ((m = reEq.exec(L))) {
      if (done.has(m.index)) continue;
      const left = L.slice(0, m.index).match(/[0-9.,$€£¥₹%()+\-−–×x*\/÷ \t ]*$/)[0];
      let start = 0; while (start < left.length && !/[($€£¥₹0-9]/.test(left[start])) start++;
      const exprText = left.slice(start).trim();
      if (!/[()]/.test(exprText) || !/\d[^\d]*[+\-−–×x*\/÷][^\d]*\d/.test(exprText)) continue;
      const calc = evalArith(exprText), rhs = tokVal(m[2]); if (calc === null || !rhs) continue;
      const n = (exprText.match(/\d[\d,]*(?:\.\d+)?/g) || []).length, pass = near(calc, rhs.v, rhs.dec, n);
      res.push({ sev: pass ? 'ok' : 'FAIL', line: lineNo, text: `${exprText} = ${m[2].trim()}`, note: pass ? '' : `works out to ${Number(calc.toPrecision(8))}` });
    }
    reOf.lastIndex = 0;
    while ((m = reOf.exec(L))) {
      const p = numv(m[1]), y = tokVal(m[2]), z = tokVal(m[3] || m[4]); if (!y || !z || z.pct) continue;
      const calc = p / 100 * y.v, pass = near(calc, z.v, z.dec, 2);
      res.push({ sev: pass ? 'ok' : 'FAIL', line: lineNo, text: m[0].trim(), note: pass ? '' : `${m[1]}% of ${y.v} is ${Number(calc.toPrecision(8))}` });
    }
    for (const re of reChg) {
      re.lastIndex = 0;
      while ((m = re.exec(L))) {
        const a = tokVal(m[1]), b = tokVal(m[2]), x = Math.abs(numv(m[4].replace(/[-+−]/, ''))); if (!a || !b || !a.v) continue;
        const rel = Math.abs((b.v - a.v) / a.v * 100), abs = Math.abs(b.v - a.v), xd = decs(m[4]);
        const pass = near(rel, x, xd, 2) || (a.pct && b.pct && near(abs, x, xd, 2));
        res.push({ sev: pass ? 'ok' : 'WARN', line: lineNo, text: m[0].trim().slice(0, 140), note: pass ? '' : `change is ${Number(rel.toPrecision(4))}%${a.pct && b.pct ? ` (${Number(abs.toPrecision(4))} points)` : ''}; check the % refers to this change` });
      }
    }
    off += rawLine.length + 1;
  }
  return res;
}
const stripCell = s => decodeAll(String(s).replace(/<[^>]+>/g, ' ')).replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*|__|`|~~/g, '').replace(/^\*|\*$/g, '').replace(/\s+/g, ' ').trim();
function parseCell(s) {
  let t = stripCell(s);
  if (!t || /^(—|–|-|n\/?a|none|nil|tbd|\?|…|0)$/i.test(t)) return t === '0' ? { value: 0, kind: 'num', dec: 0 } : { empty: true };
  let neg = false; const p = t.match(/^\((.*)\)$/);
  if (p && new RegExp(`^${SP}*(?:${CURS})?${SP}*${NUM}${SP}*$`).test(p[1])) { neg = true; t = p[1].trim(); }
  const m = t.match(new RegExp(`^(?:~|≈|about\\s+|approx\\.?\\s+|c\\.\\s?)?([-−+])?\\s*(${CURS})?\\s*([-−])?\\s*(${NUM})\\s*(${SUFW}(?![\\w]))?\\s*(%|pp(?![\\w]))?`));
  if (!m) return { text: true };
  const rest = t.slice(m[0].length).replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
  if (/\d/.test(rest)) return { ambiguous: true };
  if (/^\s*[-–—]\s*\S/.test(rest) || /^\s*(to|or)\s/i.test(rest)) return { ambiguous: true };
  let v = numv(m[4], m[5]); if (neg || /[-−]/.test(m[1] || '') || /[-−]/.test(m[3] || '')) v = -v;
  return { value: v, kind: m[2] ? 'money' : m[6] ? 'pct' : 'num', dec: decs(m[4]) };
}
const TOTAL_LABEL = /\b(total|totals|sum|subtotal|sub-total)\b/i;
const BARE_TOTAL = /^(grand\s+|sub-?\s?)?(total|sum)s?(\s*\(.*\))?:?$/i;
const NON_ADDITIVE = /\b(avg|average|mean|median|rate|ratio|per|margin|share|price|cpa|cpc|cpm|ctr|roas|cac|ltv|conversion|growth|change|index|score|rating|yield|%|percent|each|unit)\b/i;
function checkTable(tb) {
  const res = [], hdr = tb.header.map(stripCell);
  const label = r => { const c = r.cells.map(stripCell); const i = c.findIndex(x => x !== ''); return i < 0 ? '' : c[i]; };
  const isTot = r => { const l = label(r); return TOTAL_LABEL.test(l) && l.split(/\s+/).length <= 6 && parseCell(l).text; };
  const ncol = Math.max(hdr.length, ...tb.rows.map(r => r.cells.length));
  tb.rows.forEach((row, ri) => {
    if (!isTot(row)) return;
    const lab = label(row), bare = BARE_TOTAL.test(lab), sub = /^sub/i.test(lab);
    let segStart = 0; for (let j = ri - 1; j >= 0; j--) if (isTot(tb.rows[j])) { segStart = j + 1; break; }
    for (let c = 1; c < ncol; c++) {
      const tc = parseCell(row.cells[c] || ''); if (tc.value === undefined) continue;
      const seg = [], all = [], subs = []; let bad = false;
      tb.rows.slice(0, ri).forEach((r, j) => {
        const pc = parseCell(r.cells[c] || '');
        if (pc.text || pc.ambiguous) { if (j >= segStart) bad = true; return; }
        if (pc.value === undefined) return;
        if (isTot(r)) { subs.push(pc); return; }
        all.push(pc); if (j >= segStart) seg.push(pc);
      });
      if (bad || seg.length < 2) continue;
      if (seg.some(x => x.kind !== tc.kind && x.kind !== 'num' && tc.kind !== 'num')) continue;
      const sum = a => a.reduce((s, x) => s + x.value, 0);
      const cands = [[sum(seg), seg.length]]; if (!sub && segStart > 0) { cands.push([sum(all), all.length]); if (subs.length >= 2) cands.push([sum(subs), subs.length]); }
      const pass = cands.some(([s, n]) => near(s, tc.value, tc.dec, Math.max(n, 2)));
      if (pass) { res.push({ sev: 'ok', line: row.line, text: `${lab} / ${hdr[c] || 'column ' + (c + 1)}`, note: `adds up (${Number(cands[0][0].toPrecision(10))})` }); continue; }
      const soft = !bare || NON_ADDITIVE.test(hdr[c] || '') || tc.kind === 'pct';
      res.push({ sev: soft ? 'WARN' : 'FAIL', line: row.line, text: `${lab} / ${hdr[c] || 'column ' + (c + 1)}: stated ${stripCell(row.cells[c])}`, note: `rows above add to ${Number(cands[0][0].toPrecision(10))}${soft ? ' (column may not be a plain sum: check)' : ''}` });
    }
  });
  // a "Total" column should be the sum (or product of two) of the other numbers in its row
  hdr.forEach((h, c) => {
    if (c === 0 || !BARE_TOTAL.test(h)) return;
    tb.rows.forEach(row => {
      const tc = parseCell(row.cells[c] || ''); if (tc.value === undefined) return;
      const others = row.cells.map((x, i) => (i > 0 && i !== c && !NON_ADDITIVE.test(hdr[i] || '') ? parseCell(x) : {})).filter(x => x.value !== undefined);
      if (others.length < 2) return;
      const s = others.reduce((a, x) => a + x.value, 0), pr = others.length === 2 ? others[0].value * others[1].value : NaN;
      const pass = near(s, tc.value, tc.dec, others.length) || near(pr, tc.value, tc.dec, 2);
      res.push({ sev: pass ? 'ok' : 'WARN', line: row.line, text: `row "${label(row)}" / ${h}: stated ${stripCell(row.cells[c])}`, note: pass ? 'adds up' : `other cells sum to ${Number(s.toPrecision(10))}` });
    });
  });
  return res;
}
function mdTables(src) {
  const lines = src.split(/\r?\n/), tables = []; let cur = null;
  const split = l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(s => s.trim());
  lines.forEach((l, i) => {
    if (/^\s*\|.*\|\s*$/.test(l)) {
      const cells = split(l);
      if (!cur) { cur = { header: cells, rows: [], sep: false }; tables.push(cur); return; }
      if (!cur.sep && cells.every(c => /^:?-{2,}:?$/.test(c))) { cur.sep = true; return; }
      cur.rows.push({ cells, line: i + 1 });
    } else cur = null;
  });
  return tables.filter(t => t.sep);
}
function htmlTables(src) {
  const ls = lineStarts(src), tables = [], tre = /<table\b[\s\S]*?<\/table\s*>/gi; let m;
  while ((m = tre.exec(src))) {
    const rows = [], rre = /<tr\b[^>]*>([\s\S]*?)(?=<tr\b|<\/table|$)/gi; let r;
    while ((r = rre.exec(m[0]))) {
      const cells = [], cre = /<t([hd])\b[^>]*>([\s\S]*?)(?=<t[hd]\b|<\/tr|$)/gi; let c, allTh = true;
      while ((c = cre.exec(r[1]))) { cells.push(c[2].replace(/<\/t[hd]>\s*$/i, '')); if (c[1].toLowerCase() !== 'h') allTh = false; }
      if (cells.length) rows.push({ cells, line: lineOf(ls, m.index + r.index), allTh });
    }
    if (!rows.length) continue;
    const hasHead = rows[0].allTh; tables.push({ header: hasHead ? rows[0].cells : [], rows: hasHead ? rows.slice(1) : rows });
  }
  return tables;
}

// ---------------------------------------------------------------- HTML checks
const VOID = new Set('area base br col embed hr img input link meta param source track wbr keygen'.split(' '));
const OPT = new Set('p li dt dd tr td th thead tbody tfoot option optgroup colgroup caption rb rt rtc rp html head body'.split(' '));
const PCLOSE = new Set('address article aside blockquote details dialog div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split(' '));
function attrsOf(s) { const o = {}, re = /([^\s=\/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g; let m; while ((m = re.exec(s))) o[m[1].toLowerCase()] = decodeAll(m[2] ?? m[3] ?? m[4] ?? ''); return o; }
function htmlChecks(src) {
  const out = [], add = (sev, line, msg) => out.push({ sev, line, msg }), ls = lineStarts(src);
  const t = src.replace(/<!--[\s\S]*?-->/g, blank).replace(/(<(script|style|textarea|title)\b[^>]*>)([\s\S]*?)(<\/\2\s*>)/gi, (m, a, _n, b, c) => a + blank(b) + c);
  const tagRe = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  const stack = [], ids = new Map(), names = new Set(), labelsFor = new Set(), inputs = [], anchors = [], h1 = [];
  let viewport = null, title = false, lang = null; let m;
  while ((m = tagRe.exec(t))) {
    const close = m[1] === '/', name = m[2].toLowerCase(), a = attrsOf(m[3]), self = m[4] === '/', line = lineOf(ls, m.index);
    const top = () => stack[stack.length - 1];
    if (close) {
      let k = stack.length - 1; while (k >= 0 && stack[k].name !== name) k--;
      if (k < 0) { if (!OPT.has(name) || name === 'p') add('WARN', line, `stray </${name}> with no open <${name}>`); continue; }
      for (let j = stack.length - 1; j > k; j--) if (!OPT.has(stack[j].name)) add('WARN', stack[j].line, `<${stack[j].name}> (line ${stack[j].line}) is not closed before </${name}> on line ${line}: misnested`);
      stack.length = k; continue;
    }
    if (name === 'html') lang = a.lang ?? '';
    if (name === 'title') title = true;
    if (a.id !== undefined) { if (ids.has(a.id)) add('WARN', line, `duplicate id="${a.id}" (first on line ${ids.get(a.id)})`); else ids.set(a.id, line); }
    if (name === 'a' && a.name) names.add(a.name);
    if (name === 'label' && a.for) labelsFor.add(a.for);
    if (name === 'h1') h1.push(line);
    if (name === 'meta' && /^viewport$/i.test(a.name || '')) viewport = a.content || '';
    if (name === 'img' && !('alt' in a)) add('WARN', line, `<img${a.src ? ' src="' + a.src.slice(0, 60) + '"' : ''}> has no alt text`);
    if ((name === 'input' || name === 'select' || name === 'textarea')) {
      const type = (a.type || 'text').toLowerCase();
      if (!(name === 'input' && /^(hidden|submit|button|reset|image)$/.test(type))) inputs.push({ name, type, id: a.id, line, wrapped: stack.some(e => e.name === 'label'), aria: !!(a['aria-label'] || a['aria-labelledby'] || a.title) });
    }
    if ((name === 'a' || name === 'area') && a.href !== undefined) {
      const h = a.href.trim();
      if (h.startsWith('#')) anchors.push({ id: h.slice(1), line });
      else if (h === '') add('WARN', line, '<a href=""> goes nowhere');
      else if (!/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(h)) add('WARN', line, `relative link "${h.slice(0, 60)}" will not work in a stand-alone file`);
    }
    const ext = u => /^(https?:)?\/\//i.test(u || '');
    if (name === 'script' && ext(a.src)) add(opt.allowExternal ? 'ok' : 'WARN', line, `external script ${a.src.slice(0, 90)}`);
    if (name === 'link' && ext(a.href) && /stylesheet|preload|modulepreload|icon/i.test(a.rel || '')) add(opt.allowExternal ? 'ok' : 'WARN', line, `external ${/stylesheet/i.test(a.rel) ? 'stylesheet' : a.rel} ${a.href.slice(0, 90)}`);
    if ((name === 'img' || name === 'iframe' || name === 'video' || name === 'audio' || name === 'source') && ext(a.src)) add(opt.allowExternal ? 'ok' : 'WARN', line, `external ${name} ${a.src.slice(0, 90)} (page is not self-contained)`);
    const foreign = stack.some(e => e.name === 'svg' || e.name === 'math');
    if (VOID.has(name)) continue;
    if (self) { if (foreign || name === 'svg' || name === 'math') continue; add('WARN', line, `<${name}/> is not self-closing in HTML: the element stays open`); }
    if (!foreign) {
      if (PCLOSE.has(name) && top() && top().name === 'p') stack.pop();
      if (name === 'li' && top() && top().name === 'li') stack.pop();
      if ((name === 'dt' || name === 'dd') && top() && /^d[td]$/.test(top().name)) stack.pop();
      if (name === 'option' && top() && top().name === 'option') stack.pop();
      if ((name === 'td' || name === 'th') && top() && /^t[dh]$/.test(top().name)) stack.pop();
      if (name === 'tr') { while (top() && /^t[dh]$/.test(top().name)) stack.pop(); if (top() && top().name === 'tr') stack.pop(); }
      if (/^(thead|tbody|tfoot)$/.test(name)) while (top() && /^(t[dh]|tr|thead|tbody|tfoot)$/.test(top().name)) stack.pop();
    }
    stack.push({ name, line });
  }
  for (const e of stack) if (!OPT.has(e.name)) add('WARN', e.line, `<${e.name}> opened on line ${e.line} is never closed`);
  // styles that pull in outside files
  const sre = /<style\b[^>]*>([\s\S]*?)<\/style>/gi; let s;
  while ((s = sre.exec(src))) { const u = s[1].match(/@import\s+(?:url\()?["']?(https?:)?\/\/[^"')\s]+|url\(\s*["']?(https?:)?\/\/[^"')\s]+/gi); if (u) u.forEach(x => add(opt.allowExternal ? 'ok' : 'WARN', lineOf(ls, s.index), `stylesheet loads an outside file: ${x.slice(0, 90)}`)); }
  for (const an of anchors) {
    let id = an.id; try { id = decodeURIComponent(id); } catch {}
    if (id === '') add('WARN', an.line, 'href="#" goes nowhere');
    else if (!ids.has(id) && !names.has(id)) add(id.toLowerCase() === 'top' ? 'WARN' : 'FAIL', an.line, `in-page link #${id} has no element with that id`);
  }
  for (const i of inputs) if (!i.wrapped && !i.aria && !(i.id && labelsFor.has(i.id))) add('WARN', i.line, `<${i.name}${i.name === 'input' ? ' type=' + i.type : ''}> has no label`);
  if (viewport === null) add('FAIL', 1, 'no <meta name="viewport">: the page will render zoomed out on phones');
  else if (!/width\s*=\s*device-width/i.test(viewport)) add('WARN', 1, 'viewport meta lacks width=device-width');
  if (h1.length === 0) add('FAIL', 1, 'no <h1>');
  else if (h1.length > 1) add('WARN', h1[1], `${h1.length} <h1> elements (lines ${h1.join(', ')}): use exactly one`);
  if (!title) add('WARN', 1, 'no <title>');
  if (lang === '' || lang === null) add('WARN', 1, '<html> has no lang attribute');
  return out;
}

// ---------------------------------------------------------------- main
(async () => {
  const raw = fs.readFileSync(file, 'utf8'), html = isHtmlFile(file), ls = lineStarts(raw);
  const vis = visibleOf(raw, html);
  const at = off => lineOf(ls, vis.pos ? vis.pos[Math.min(off, vis.pos.length - 1)] ?? 0 : off);
  const R = { file: path.resolve(file), sources: srcFiles.map(f => path.resolve(f)), links: [], numbers: [], arithmetic: [], html: [] };

  // (a) links
  const urls = extractUrls(raw, html);
  R.links = opt.offline ? urls.map(u => ({ ...u, sev: 'skip', status: 'offline' })) : await checkLinks(urls);

  // (b) numbers
  const S = buildIndex(srcFiles);
  const figs = extractFigures(vis.text).map(f => ({ ...f, line: at(f.start) }));
  const seen = new Map();
  for (const f of figs) {
    const key = f.kind + '|' + f.raw.replace(/\s+/g, ' ');
    if (seen.has(key)) { seen.get(key).count++; continue; }
    f.count = 1; f.status = srcFiles.length ? backed(f, S) : null; seen.set(key, f);
  }
  const uniq = [...seen.values()];
  const operands = [], opk = new Set();
  for (const f of uniq) if (f.status && f.kind !== 'date' && f.kind !== 'year' && f.value && !opk.has(f.kind + vk(f.value)) && operands.length < 400) { opk.add(f.kind + vk(f.value)); operands.push({ v: Math.abs(f.value), kind: f.kind === 'rating' ? 'figure' : f.kind }); }
  { // bare whole numbers in the text that the sources also hold (e.g. a divisor such as days of supply)
    const re = new RegExp(`(?<![\\w.,$€£¥₹%])(${NUM})(?![\\w%]|[.,]\\d)`, 'g'); let m;
    const inDate = i => figs.some(f => (f.kind === 'date' || f.kind === 'year') && i >= f.start && i < f.end);
    while ((m = re.exec(vis.text)) && operands.length < 500) {
      if (inDate(m.index)) continue; const v = numv(m[1]); if (v > 1 && v < 1e6 && !(v >= 1900 && v <= 2100) && S.vals.has(vk(v)) && !opk.has('figure' + vk(v))) { opk.add('figure' + vk(v)); operands.push({ v, kind: 'figure' }); } }
  }
  for (const f of uniq) { f.sev = srcFiles.length === 0 ? 'WARN' : f.status ? 'ok' : 'WARN'; if (!f.status && srcFiles.length) f.hint = deriveHint(f, operands); }
  R.numbers = uniq.map(({ kind, raw, value, unit, line, count, status, sev, hint }) => ({ kind, raw, value, unit, line, count, status, sev, hint }));

  // (c) arithmetic
  for (const tb of html ? htmlTables(raw) : mdTables(raw)) R.arithmetic.push(...checkTable(tb));
  R.arithmetic.push(...inlineArithmetic(vis.text, ls, vis.pos));
  R.arithmetic.sort((a, b) => a.line - b.line);

  // (d) html
  if (html) R.html = htmlChecks(raw);

  const all = [...R.links, ...R.numbers, ...R.arithmetic, ...R.html];
  R.fail = all.filter(x => x.sev === 'FAIL').length; R.warn = all.filter(x => x.sev === 'WARN').length;
  if (opt.json) { console.log(JSON.stringify(R, null, 1)); process.exitCode = R.fail ? 1 : 0; return; }

  const P = s => console.log(s), V = opt.verbose;
  P(`PROOF  ${path.basename(file)}   sources: ${srcFiles.length ? srcFiles.map(f => path.basename(path.dirname(f)) + '/' + path.basename(f)).join(', ') : 'none (every figure is unbacked)'}`);
  const cnt = (arr, s) => arr.filter(x => x.sev === s).length;
  P(`\n[a] LINKS  ${R.links.length} unique${opt.offline ? ' (offline: not fetched)' : `: ${cnt(R.links, 'ok')} ok, ${cnt(R.links, 'WARN')} WARN, ${cnt(R.links, 'FAIL')} FAIL`}`);
  for (const l of R.links) if (l.sev !== 'ok' || V) P(`  ${l.sev.padEnd(4)} ${String(l.status).padEnd(9)} ${l.url}  (line ${l.line})${l.note ? '  - ' + l.note : ''}${l.final && (V || l.sev !== 'ok') ? '  -> ' + l.final : ''}`);
  const nOk = R.numbers.filter(n => n.sev === 'ok'), nW = R.numbers.filter(n => n.sev === 'WARN');
  P(`\n[b] NUMBERS  ${R.numbers.length} distinct figures in the visible text: ${nOk.length} found in sources, ${nW.length} not (WARN: confirm live, correct, or label as estimate/proposal)`);
  for (const n of R.numbers) if (n.sev === 'WARN' || V) P(`  ${n.sev.padEnd(4)} line ${String(n.line).padEnd(4)} ${n.kind.padEnd(7)} ${n.raw}${n.count > 1 ? ` (x${n.count})` : ''}${n.status && n.status !== 'exact' ? '  [' + n.status + ' match]' : ''}${n.hint ? '  maybe derived: ' + n.hint : ''}`);
  P(`\n[c] ARITHMETIC  ${R.arithmetic.length} checked: ${cnt(R.arithmetic, 'ok')} ok, ${cnt(R.arithmetic, 'WARN')} WARN, ${cnt(R.arithmetic, 'FAIL')} FAIL`);
  for (const a of R.arithmetic) if (a.sev !== 'ok' || V) P(`  ${a.sev.padEnd(4)} line ${String(a.line).padEnd(4)} ${a.text}${a.note ? '  - ' + a.note : ''}`);
  if (html) {
    P(`\n[d] HTML  ${cnt(R.html, 'WARN')} WARN, ${cnt(R.html, 'FAIL')} FAIL`);
    for (const h of R.html) if (h.sev !== 'ok' || V) P(`  ${h.sev.padEnd(4)} line ${String(h.line).padEnd(4)} ${h.msg}`);
  }
  P(`\nRESULT: ${R.fail ? 'FAIL' : 'PASS'}  (${R.fail} FAIL, ${R.warn} WARN)${R.fail ? '  - fix every FAIL' : ''}${R.warn ? '  - resolve every WARN: confirm live, correct, or label' : ''}`);
  process.exitCode = R.fail ? 1 : 0;
})().catch(e => { console.error('proof.cjs crashed: ' + (e && e.stack || e)); process.exitCode = 2; });
