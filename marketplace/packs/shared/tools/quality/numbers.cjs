// Numbers ledger check: every figure has one basis, totals match their rows, and verdict labels match their numbers.
// Plain Node 18, no dependencies.
// Usage: node numbers.cjs context/numbers.json [--final <deliverable>] [--brief <brief>]
//
// The ledger (context/numbers.json) is a list of figures, or { "figures": [...] }. Each figure:
//   { "id": "reorder_saving", "value": 41000 | "formula": "returns_saved * margin_each",
//     "inputs": { "returns_saved": 120, "margin_each": "margin_per_order" }, "rows": ["id_a", "id_b"],
//     "unit": "INR", "period": "month", "basis": "gross profit", "source": "brief: returns table", "label": "Hold",
//     "before": 12000 }
// - formula: + - * / and brackets over named inputs, other figure ids and numbers, plus min(), max(), round(), abs().
//   An input is a number, another figure's id, or { "value": n }. Free text is never run as code.
// - rows: the figures this total adds up. value is the total as written; the tool checks it.
// - label: Cut, Pause or Stop mean zero; Trim or Reduce mean lower; Hold or Keep mean the same; Scale or Raise mean
//   higher. value is the new number; before is the old one.
//
// FAIL (exit 1): a written value its formula does not give; a total that does not match its rows; a total that adds
//   two periods or two money bases; a label its number contradicts; a deliverable table whose Total row does not match
//   its rows, whose verdict column contradicts its numbers, or whose one column mixes two periods or two money bases.
// WARN (exit 0): a figure in the deliverable that is in neither the ledger nor the brief; a saving or kept figure
//   valued at revenue; a figure with no source.
// Exit 0 = clean (warnings allowed), 1 = something to fix, 2 = usage error.
'use strict';
const fs = require('fs');

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const ledgerFile = args.find((a, i) => !a.startsWith('--') && !['--final', '--brief'].includes(args[i - 1]));
const finalFile = flag('--final');
const briefFile = flag('--brief');
const usage = 'Usage: node numbers.cjs context/numbers.json [--final <deliverable>] [--brief <brief>]';
if (!ledgerFile) { console.error(usage); process.exit(2); }
const read = (f, what) => { try { return fs.readFileSync(f, 'utf8'); } catch { console.error(`Cannot read ${what} ${f}`); process.exit(2); } };

let raw;
try { raw = JSON.parse(read(ledgerFile, 'ledger')); }
catch (e) { console.error(`The ledger is not valid JSON: ${e.message}`); process.exit(2); }
const list = Array.isArray(raw) ? raw : Array.isArray(raw.figures) ? raw.figures : Array.isArray(raw.entries) ? raw.entries
  : Object.entries(raw).map(([id, v]) => ({ id, ...(typeof v === 'object' ? v : { value: v }) }));
const fails = [], warns = [];
const figures = new Map();
list.forEach((f, i) => {
  if (!f || typeof f !== 'object' || !f.id) { fails.push(`ledger entry ${i + 1} has no id`); return; }
  if (figures.has(f.id)) fails.push(`ledger id "${f.id}" appears twice`);
  figures.set(String(f.id), f);
});

// ---- Shared words ----
const norm = (s, table) => { const t = String(s ?? '').toLowerCase().trim(); if (!t) return null; for (const [re, v] of table) if (re.test(t)) return v; return t; };
const BASES = [[/^(revenue|sales|net revenue|gross revenue|order value|aov|gmv|turnover)$/, 'revenue'], [/^(gross profit|gross margin|gp|margin)$/, 'gross profit'],
  [/^(contribution|contribution margin|cm|contribution profit)$/, 'contribution'], [/^(profit|net profit)$/, 'profit'], [/^(none|n\/a|count|units?|orders?|people|rate|ratio|spend|ad spend|costs?|budget|price|fees?)$/, null]];
const PERIODS = [[/^(day|daily|a day|per day|1 day)$/, 'day'], [/^(week|weekly|a week|per week|7 days?)$/, 'week'], [/^(month|monthly|a month|per month|30 days?)$/, 'month'],
  [/^(quarter|quarterly|90 days?|3 months)$/, 'quarter'], [/^(year|yearly|annual|annually|12 months|365 days?)$/, 'year'], [/^(once|one-off|one off|total|none|n\/a|point in time)$/, null]];
const basisOf = s => norm(s, BASES);
const periodOf = s => norm(s, PERIODS);
// Money bases that disagree; plain "profit" is compatible with gross profit and contribution.
const distinct = set => { const s = new Set([...set].filter(Boolean)); if (s.size > 1) s.delete('profit'); return [...s]; };
const fmt = n => (Math.abs(n) >= 1000 ? Math.round(n).toLocaleString('en-US') : String(Math.round(n * 100) / 100));
const decimals = n => { const m = /\.(\d+)$/.exec(String(n)); return m ? m[1].length : 0; };
const close = (stated, computed, rel = 0.005) => Math.abs(stated - computed) <= Math.max(Math.abs(computed) * rel, 0.5 * 10 ** -decimals(stated));

// ---- Formula: a small arithmetic parser over names (no eval) ----
function parse(src) {
  const toks = [];
  const re = /\s*(?:(\d+(?:\.\d+)?(?:e[+-]?\d+)?)|([A-Za-z_][\w.]*)|(\*\*|[-+*/(),%^]))/gy;
  let m, at = 0;
  while (at < src.length) {
    re.lastIndex = at; m = re.exec(src);
    if (!m) { if (/^\s*$/.test(src.slice(at))) break; throw new Error(`cannot read "${src.slice(at, at + 12)}"`); }
    at = re.lastIndex;
    if (m[1]) toks.push({ t: 'num', v: Number(m[1]) }); else if (m[2]) toks.push({ t: 'name', v: m[2] }); else toks.push({ t: 'op', v: m[3] });
  }
  let p = 0;
  const peek = () => toks[p], take = v => { if (toks[p]?.v === v) { p++; return true; } return false; };
  const expr = () => { let n = term(); for (;;) { if (take('+')) n = { op: '+', a: n, b: term() }; else if (take('-')) n = { op: '-', a: n, b: term() }; else return n; } };
  const term = () => { let n = unary(); for (;;) { if (take('*')) n = { op: '*', a: n, b: unary() }; else if (take('/')) n = { op: '/', a: n, b: unary() }; else return n; } };
  const unary = () => (take('-') ? { op: 'neg', a: unary() } : take('+') ? unary() : power());
  const power = () => { const n = atom(); return take('^') || take('**') ? { op: '^', a: n, b: unary() } : n; };
  const atom = () => {
    const k = toks[p++];
    if (!k) throw new Error('formula ends too early');
    let n;
    if (k.t === 'num') n = { num: k.v };
    else if (k.t === 'name' && peek()?.v === '(') {
      p++; const argsList = [];
      if (!take(')')) { do argsList.push(expr()); while (take(',')); if (!take(')')) throw new Error(`missing ) after ${k.v}(`); }
      n = { fn: k.v.toLowerCase(), args: argsList };
    } else if (k.t === 'name') n = { name: k.v };
    else if (k.v === '(') { n = expr(); if (!take(')')) throw new Error('missing )'); }
    else throw new Error(`unexpected "${k.v}"`);
    return take('%') ? { op: '/', a: n, b: { num: 100 } } : n;
  };
  const tree = expr();
  if (p < toks.length) throw new Error(`unexpected "${toks[p].v}"`);
  return tree;
}
const FNS = { min: a => Math.min(...a), max: a => Math.max(...a), round: a => (a.length > 1 ? Math.round(a[0] * 10 ** a[1]) / 10 ** a[1] : Math.round(a[0])), abs: a => Math.abs(a[0]), sum: a => a.reduce((x, y) => x + y, 0) };

// ---- Compute every figure ----
const computed = new Map(), problems = new Map();
function valueOf(id, stack = []) {
  if (computed.has(id)) return computed.get(id);
  if (problems.has(id)) return undefined;
  const f = figures.get(id);
  if (!f) return undefined;
  if (stack.includes(id)) { problems.set(id, `"${id}" depends on itself (${[...stack, id].join(' > ')})`); return undefined; }
  const next = [...stack, id];
  let out;
  try {
    if (f.formula !== undefined) {
      const inputs = Array.isArray(f.inputs) ? Object.fromEntries(f.inputs.map(x => [x, x])) : (f.inputs || {});
      const lookup = name => {
        let v = Object.prototype.hasOwnProperty.call(inputs, name) ? inputs[name] : name;
        if (v && typeof v === 'object') v = v.value ?? v.id;
        if (typeof v === 'number') return v;
        if (typeof v === 'string' && figures.has(v)) { const r = valueOf(v, next); if (r === undefined) throw new Error(`input "${v}" has no value`); return r; }
        if (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v)) return Number(v);
        throw new Error(`unknown input "${name}"`);
      };
      const ev = n => {
        if ('num' in n) return n.num;
        if (n.name) return lookup(n.name);
        if (n.fn) { if (!FNS[n.fn]) throw new Error(`unknown function ${n.fn}()`); return FNS[n.fn](n.args.map(ev)); }
        const a = ev(n.a);
        if (n.op === 'neg') return -a;
        const b = ev(n.b);
        return n.op === '+' ? a + b : n.op === '-' ? a - b : n.op === '*' ? a * b : n.op === '^' ? a ** b : a / b;
      };
      out = ev(parse(String(f.formula)));
      if (!Number.isFinite(out)) throw new Error('gives no finite number (a division by zero?)');
    }
    if (Array.isArray(f.rows) && f.rows.length) {
      const vals = f.rows.map(r => { const v = valueOf(String(r), next); if (v === undefined) throw new Error(`row "${r}" has no value`); return v; });
      const sum = vals.reduce((a, b) => a + b, 0);
      if (out !== undefined && !close(out, sum)) fails.push(`"${id}": its formula gives ${fmt(out)} but its rows add up to ${fmt(sum)}`);
      out = out ?? sum;
    }
  } catch (e) { if (!problems.has(id)) problems.set(id, `"${id}": ${e.message}`); return undefined; }
  if (out === undefined && typeof f.value === 'number') out = f.value;
  if (out !== undefined) computed.set(id, out);
  return out;
}
for (const id of figures.keys()) valueOf(id);
for (const msg of problems.values()) fails.push(msg);

// ---- Ledger checks ----
const SAVING = /\b(sav(?:e|es|ed|ing|ings)|kept|keeps?|recover(?:s|ed|y)?|avoid(?:s|ed)?|prevent(?:s|ed)?|protect(?:s|ed)?|reduc(?:e|es|ed|tion))\b/i;
const ZERO = /^(cut|pause|paused|stop|stopped|kill|turn off|switch off|off)\b/i, LOWER = /^(trim|reduce|lower|scale down|cut back)\b/i;
const SAME = /^(hold|keep|maintain|steady|no change)\b/i, HIGHER = /^(scale|raise|increase|grow|boost|scale up|add)\b/i;
function labelProblem(label, after, before) {
  const l = String(label).replace(/[*_`]/g, '').trim();
  if (ZERO.test(l)) return after > 0 ? `"${l}" means zero, but the number is ${fmt(after)}` : null;
  if (before === undefined || before === null || Number.isNaN(before)) return null;
  if (LOWER.test(l) && !(after < before)) return `"${l}" means lower, but ${fmt(before)} goes to ${fmt(after)}`;
  if (SAME.test(l) && !close(after, before, 0.02)) return `"${l}" means the same, but ${fmt(before)} goes to ${fmt(after)}`;
  if (HIGHER.test(l) && !(after > before)) return `"${l}" means higher, but ${fmt(before)} goes to ${fmt(after)}`;
  return null;
}
for (const [id, f] of figures) {
  const v = computed.get(id);
  if (typeof f.value === 'number' && v !== undefined && (f.formula !== undefined || f.rows) && !close(f.value, v) && !fails.some(x => x.startsWith(`"${id}": its formula`)))
    fails.push(f.rows && f.formula === undefined ? `"${id}": total ${fmt(f.value)} does not match its rows (${fmt(v)})` : `"${id}": written as ${fmt(f.value)} but its formula gives ${fmt(v)}`);
  if (Array.isArray(f.rows) && f.rows.length) {
    const rows = f.rows.map(r => figures.get(String(r))).filter(Boolean);
    const periods = distinct(new Set(rows.map(r => periodOf(r.period))));
    const bases = distinct(new Set(rows.map(r => basisOf(r.basis))));
    if (periods.length > 1) fails.push(`"${id}": adds rows from two periods (${periods.join(', ')}); convert them to one period first`);
    if (bases.length > 1) fails.push(`"${id}": adds rows on two money bases (${bases.join(', ')}); use one basis`);
  }
  if (f.label && v !== undefined) {
    const before = f.before ?? f.from ?? f.current;
    const b = typeof before === 'string' && figures.has(before) ? computed.get(before) : typeof before === 'number' ? before : undefined;
    const p = labelProblem(f.label, v, b);
    if (p) fails.push(`"${id}": label ${p}`);
  }
  if (basisOf(f.basis) === 'revenue' && SAVING.test(`${id.replace(/_/g, " ")} ${f.label ?? ''} ${f.name ?? ''} ${f.note ?? ''}`))
    warns.push(`"${id}": a saving or kept figure valued at revenue; value it at margin (gross profit or contribution)`);
  if (!f.source) warns.push(`"${id}": no source (a brief line or a card id)`);
}

// ---- Figures in text ----
const MULT = { lakh: 1e5, lac: 1e5, lakhs: 1e5, crore: 1e7, crores: 1e7, cr: 1e7, k: 1e3, m: 1e6, mn: 1e6, million: 1e6, bn: 1e9, billion: 1e9 };
const FIG = /(?<![\w.,])([\u2212\u2013+-](?=\s?(?:[₹$€£]|Rs|\d)))?\s?((?:[₹$€£]|Rs\.?\s?|INR\s?|USD\s?)?)(\d{1,3}(?:,\d{2,3})+(?:\.\d+)?|\d+(?:\.\d+)?)(\s?(?:%|percent\b|lakhs?\b|lac\b|crores?\b|cr\b|million\b|mn\b|billion\b|bn\b|[kK]\b|M\b))?/g;
function figuresIn(text) {
  const out = [];
  for (const m of text.matchAll(FIG)) {
    const digits = m[3].replace(/,/g, '');
    let suf = (m[4] || '').trim().toLowerCase();
    if ((suf === 'k' || suf === 'm') && !m[2]) suf = '';
    out.push({ raw: m[0].trim(), index: m.index, end: m.index + m[0].length, sign: /[\u2212\u2013-]/.test(m[1] || '') ? -1 : 1, cur: m[2].trim(), num: Number(digits), dec: decimals(digits), suf });
  }
  // "₹3.1 to 6.4 lakh", "4 to 8%": a range shares its currency and its unit.
  for (let i = 0; i + 1 < out.length; i++) {
    const a = out[i], b = out[i + 1], gap = text.slice(a.end, b.index);
    if (!/^\s*(?:to|-|\u2013|and)\s*$/i.test(gap)) continue;
    if (!a.suf && b.suf) { a.suf = b.suf; a.raw += b.suf === '%' ? '%' : ` ${b.suf}`; }
    if (!b.cur && a.cur) b.cur = a.cur;
    a.range = b.range = true;
  }
  return out.map(f => {
    const pct = f.suf === '%' || f.suf === 'percent';
    const mult = MULT[f.suf.replace(/s$/, '')] ?? MULT[f.suf] ?? 1;
    return { ...f, value: f.sign * f.num * (pct ? 1 : mult), half: 0.5 * 10 ** -f.dec * (pct ? 1 : mult), kind: pct ? 'pct' : f.cur || mult > 1 ? 'money' : 'count' };
  });
}
const matches = (fig, k) => Math.abs(Math.abs(fig.value) - Math.abs(k)) <= fig.half + Math.abs(k) * 0.005;

const known = [];
const addKnown = v => { if (typeof v === 'number' && Number.isFinite(v)) { known.push(v); if (Math.abs(v) <= 1.5) known.push(v * 100); } };
for (const [id, f] of figures) {
  addKnown(f.value); addKnown(computed.get(id)); addKnown(f.before ?? f.from ?? f.current);
  if (f.inputs && !Array.isArray(f.inputs)) for (const v of Object.values(f.inputs)) addKnown(typeof v === 'object' && v ? v.value : v);
}
if (briefFile) for (const f of figuresIn(read(briefFile, 'brief'))) { addKnown(f.value); if (f.kind === 'pct') addKnown(f.value / 100); }

// ---- Deliverable checks ----
const clean = s => s.replace(/\*\*|__|`/g, '').trim();
const cellsOf = line => line.trim().replace(/^\|/, '').replace(/\|\s*$/, '').split(/(?<!\\)\|/).map(clean);
const RATE = /%|\brate\b|\bshare\b|\bper\b|\beach\b|\baverage\b|\bavg\b|\bcost per\b|\bcp[acmo]\b|\bctr\b|\broas\b|\bmer\b|\bprice\b|\bmargin\b|\bratio\b|break-?even|\bfrequency\b|\bscore\b|\bindex\b|\bmultiple\b|\bpayback\b|\bdays of\b|\bcover\b/i;
const LABEL_HEAD = /^(call|verdict|action|decision|label|move|status|what to do)$/i;
const SPEND_WORDS = /budget|spend|₹|\$|€|£|a day|daily|per day|bid/i;
const BEFORE_HEAD = /\b(now|current|today|before|old|was|existing|prior)\b/i, AFTER_HEAD = /\b(next|new|after|proposed|planned|plan)\b/i;
const CHANGE_HEAD = /\bto\b|→|->|\bchange\b|\bfrom\b/i;
// A period is a rate ("a month", "monthly") or a window ("over 90 days", "90-day"). A band such as "46 to 90 days" is not.
const WINDOW = '(?:\\b(?:over|in|per|every|last|next|for|within|across|first)\\s+(?:the\\s+)?(?:past\\s+)?(\\d+)\\s+days?\\b|\\b(\\d+)-day\\b)';
const PERIOD_TEXT = [[/\b(?:a|per|each|every) day\b|\/day\b|\bdaily\b/i, 'day'], [/\b(?:a|per|each|every) week\b|\/wk\b|\bweekly\b/i, 'week'],
  [/\b(?:a|per|each|every) month\b|\/mo(?:nth)?\b|\bmonthly\b/i, 'month'], [/\b(?:a|per|each|every) quarter\b|\bquarterly\b/i, 'quarter'],
  [/\b(?:a|per|each|every) year\b|\/yr\b|\byearly\b|\bannual(?:ly)?\b/i, 'year'], [new RegExp(WINDOW, 'gi'), 'window']];
const periodsInText = s => {
  const out = new Set();
  for (const [re, p] of PERIOD_TEXT) {
    if (p !== 'window') { if (re.test(s)) out.add(p); continue; }
    for (const m of s.matchAll(re)) out.add(periodOf(`${m[1] ?? m[2]} days`) ?? `${m[1] ?? m[2]} days`);
  }
  return out;
};
const BASIS_TEXT = [[/\b(?:revenue|sales|order value|aov|gmv|turnover)\b/i, 'revenue'], [/\bgross (?:profit|margin)\b/i, 'gross profit'], [/\bcontribution\b/i, 'contribution']];
const basesInText = s => { const out = new Set(); for (const [re, b] of BASIS_TEXT) if (re.test(s)) out.add(b); return out; };
const ledgerBasis = fig => {
  if (Math.abs(fig.value) < 10 && fig.kind !== 'pct') return {};
  const hits = [...figures].filter(([id]) => computed.has(id) && matches(fig, computed.get(id))).map(([, f]) => f);
  const bases = new Set(hits.map(f => (f.basis ? String(f.basis).toLowerCase().trim() : null)).filter(Boolean));
  const periods = new Set(hits.map(f => periodOf(f.period)).filter(Boolean));
  return { basis: bases.size === 1 ? [...bases][0] : undefined, period: periods.size === 1 ? [...periods][0] : undefined };
};

function checkTable(rows, startLine) {
  const [head, ...body] = rows;
  const where = `table at line ${startLine}`;
  const width = head.length;
  const rowWise = head[0] === '' || /^(measure|metric|kpi)s?$/i.test(head[0]);
  const isTotal = r => /^\W*(grand\s+)?total\b/i.test(r[0] || '');
  // One measure per column (or per row, when rows are the measures): one period and one money basis.
  const lanes = rowWise
    ? body.map(r => ({ name: `row "${r[0]}"`, title: r[0], cells: r.slice(1) }))
    : head.slice(1).map((h, c) => ({ name: `column "${h}"`, title: h, cells: body.map(r => r[c + 1] ?? '') }));
  for (const lane of lanes) {
    const periods = new Set(), bases = new Set(), ledgerBases = new Set();
    for (const p of periodsInText(lane.title)) periods.add(p);
    for (const b of basesInText(lane.title)) bases.add(b);
    for (const cell of lane.cells) {
      const figs = figuresIn(cell);
      if (!figs.length) continue;
      for (const p of periodsInText(cell)) periods.add(p);
      for (const b of basesInText(cell)) bases.add(b);
      for (const f of figs) { const lb = ledgerBasis(f); if (lb.basis) ledgerBases.add(lb.basis); if (lb.period) periods.add(lb.period); }
    }
    const p = distinct(periods), b = distinct(new Set([...bases, ...[...ledgerBases].map(x => basisOf(x) ?? x)]));
    if (p.length > 1) fails.push(`${where}, ${lane.name}: mixes two periods (${p.join(', ')}); give one period per column`);
    if (b.length > 1) fails.push(`${where}, ${lane.name}: mixes two money bases (${b.join(', ')}); give one basis per column`);
  }
  if (rowWise) return;
  // A Total row matches the rows above it.
  const total = body.find(isTotal);
  if (total) {
    const items = body.filter(r => r !== total && !isTotal(r));
    for (let c = 1; c < width; c++) {
      const tf = figuresIn(total[c] ?? '');
      if (!tf.length || tf.length > 2 || RATE.test(head[c]) || RATE.test(total[c] ?? '')) continue;
      const cellFigs = items.map(r => figuresIn(r[c] ?? ''));
      if (cellFigs.some(f => f.length > 2) || cellFigs.some(f => f.some(x => x.kind === 'pct'))) continue;
      if (items.some(r => RATE.test(r[c] ?? '') && figuresIn(r[c] ?? '').length)) continue;
      const pick = k => cellFigs.map(f => (f.length === 0 ? 0 : f[Math.min(k, f.length - 1)].value));
      const slack = cellFigs.reduce((s, f) => s + (f[0]?.half ?? 0), 0);
      const ok = (t, sums) => sums.some(s => Math.abs(t.value - s) <= t.half + slack + Math.abs(s) * 0.001);
      const sums = [0, 1].map(k => pick(k).reduce((a, b) => a + b, 0));
      const bad = tf.length === 2 ? !(ok(tf[0], [sums[0]]) && ok(tf[1], [sums[1]])) : !ok(tf[0], sums);
      if (bad) fails.push(`${where}, column "${head[c]}": the total says ${tf.map(t => t.raw).join(' to ')} but the rows add up to ${tf.length === 2 ? `${fmt(sums[0])} to ${fmt(sums[1])}` : fmt(cellFigs.some(f => f.length === 2) ? sums[1] : sums[0])}`);
    }
  }
  // Verdict labels match their numbers.
  const lc = head.findIndex(h => LABEL_HEAD.test(h));
  if (lc < 0) return;
  const change = head.map((h, c) => c !== lc && CHANGE_HEAD.test(h) && !RATE.test(h.replace(/\bper day\b|\ba day\b/i, '')));
  const before = head.findIndex((h, c) => c !== lc && BEFORE_HEAD.test(h) && !CHANGE_HEAD.test(h) && SPEND_WORDS.test(h));
  const after = head.findIndex((h, c) => c !== lc && AFTER_HEAD.test(h) && !CHANGE_HEAD.test(h) && SPEND_WORDS.test(h));
  for (const r of body) {
    const label = r[lc] ?? '';
    if (!label || isTotal(r)) continue;
    const pairs = [];
    change.forEach((yes, c) => { if (!yes) return; const f = figuresIn(r[c] ?? ''); if (f.length === 2 && /\bto\b|→|->/.test(r[c])) pairs.push([f[1].value, f[0].value]); });
    if (after >= 0) { const a = figuresIn(r[after] ?? '')[0]; const b = before >= 0 ? figuresIn(r[before] ?? '')[0] : undefined; if (a) pairs.push([a.value, b?.value]); }
    for (const [a, b] of pairs) { const p = labelProblem(label, a, b); if (p) { fails.push(`${where}, row "${r[0]}": ${p}`); break; } }
  }
}

if (finalFile) {
  const text = read(finalFile, 'deliverable');
  const lines = text.split(/\r?\n/);
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) { inCode = !inCode; continue; }
    if (inCode || !/^\s*\|/.test(lines[i])) continue;
    const start = i, block = [];
    while (i < lines.length && /^\s*\|/.test(lines[i])) block.push(lines[i++]);
    i--;
    const rows = block.filter(l => !/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l)).map(cellsOf);
    if (rows.length >= 2) checkTable(rows, start + 1);
  }
  // Figures from nowhere, and savings valued at revenue.
  const unknown = [];
  lines.forEach((line, i) => {
    for (const f of figuresIn(line)) {
      if (f.kind === 'count' && (Math.abs(f.value) < 100 || (!f.raw.includes(',') && f.value >= 1900 && f.value <= 2100 && !f.dec))) continue;
      if (known.some(k => matches(f, k))) continue;
      unknown.push(`line ${i + 1}: ${f.raw}`);
    }
    if (/\b(sav(?:e|es|ed|ing|ings)|kept|recover(?:s|ed)?)\b/i.test(line) && /\b(revenue|order value|aov|gmv)\b/i.test(line) && figuresIn(line).some(f => f.kind === 'money'))
      warns.push(`line ${i + 1}: a saving valued at revenue; value it at margin. In: ${line.trim().slice(0, 120)}`);
  });
  if (unknown.length) warns.push(`${unknown.length} figure(s) in neither the ledger nor the brief${briefFile ? '' : ' (no --brief given)'}: ${unknown.slice(0, 12).join('; ')}${unknown.length > 12 ? '; ...' : ''}`);
}

console.log(`numbers: ${figures.size} ledger figures, ${computed.size} with a value${finalFile ? `, deliverable ${finalFile}` : ''}`);
if (warns.length) console.log(`WARN (${warns.length}, does not fail):\n` + warns.join('\n'));
console.log(fails.length ? `FAIL (${fails.length}):\n` + fails.join('\n') : 'clean');
process.exitCode = fails.length ? 1 : 0;
