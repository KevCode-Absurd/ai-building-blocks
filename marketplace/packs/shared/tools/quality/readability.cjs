#!/usr/bin/env node
// Readability check for a deliverable. Plain Node, no packages.
// Usage: node readability.cjs <file.md|.txt|.html> [--audience consumer|business|specialist]
// Measures visible prose only: drops script, style, code blocks, inline code, tables, URLs and headings.
// Exit 1 if the Flesch-Kincaid grade is more than 1 over the audience ceiling,
// or more than 15% of sentences are over 30 words. Exit 0 otherwise. Exit 2 on usage error.
// Also prints advisory "Editor targets" (see CLARITY.md); they never change the exit code.
'use strict';
const fs = require('fs');

const CEILING = { consumer: 8, business: 10, specialist: 12 };
const LONG = 30;          // words in a long sentence
const LONG_SHARE = 0.15;  // max share of long sentences

// ---------- args ----------
const args = process.argv.slice(2);
let file = null, audience = 'business';
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--audience') audience = (args[++i] || '').toLowerCase();
  else if (a.startsWith('--audience=')) audience = a.slice(11).toLowerCase();
  else if (!file) file = a;
}
if (!file || !CEILING[audience]) {
  console.error('Usage: node readability.cjs <file> [--audience consumer|business|specialist]');
  process.exit(2);
}
let raw;
try { raw = fs.readFileSync(file, 'utf8'); } catch (e) { console.error('Cannot read ' + file); process.exit(2); }

// ---------- HTML to markdown-ish text ----------
function decodeEntities(s) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '-', ndash: '-',
    hellip: '...', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', middot: ' · ', times: 'x', copy: '(c)', reg: '', trade: '' };
  return s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
          .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
          .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in named ? named[n.toLowerCase()] : ' '));
}
function htmlToText(h) {
  h = h.replace(/<!--[\s\S]*?-->/g, ' ')
       .replace(/<(script|style|head|noscript|template|svg|code|pre|table|textarea|select)\b[\s\S]*?<\/\1\s*>/gi, '\n\n')
       .replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>/gi, (_, t) => '\n\n# ' + t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') + '\n\n')
       .replace(/<li\b[^>]*>/gi, '\n- ')
       .replace(/<(br|hr)\b[^>]*>/gi, '\n')
       .replace(/<\/?(p|div|section|article|header|footer|main|aside|nav|blockquote|ul|ol|dl|dt|dd|figure|figcaption|details|summary|form|label|button|tr)\b[^>]*>/gi, '\n\n')
       .replace(/<[^>]+>/g, ' ');
  return decodeEntities(h);
}

let text = /\.html?$/i.test(file) || /^\s*<(!doctype|html)/i.test(raw) ? htmlToText(raw) : raw;

// ---------- markdown cleanup into blocks ----------
text = text.replace(/\r\n?/g, '\n')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, '\n')       // fenced code
  .replace(/^---\n[\s\S]*?\n---\n/, '');                   // front matter

const blocks = []; let cur = null; let tableBeforeFirst = false; let sawProse = false;
const flush = () => { if (cur && cur.text.trim()) blocks.push(cur); cur = null; };
for (let line of text.split('\n')) {
  // Strip blockquote markers first, so quoted tables, quoted headings and blank quote lines are seen.
  const t = line.trim().replace(/^(>\s*)+/, '').trim();
  if (!t) { flush(); continue; }
  if (/^\|/.test(t) || /^[:\-| ]+\|[:\-| ]*$/.test(t)) { flush(); if (!sawProse) tableBeforeFirst = true; continue; } // tables
  if (/^(\*\s*){3,}$|^(-\s*){3,}$|^(_\s*){3,}$/.test(t)) { flush(); continue; }       // rules
  if (/^#{1,6}\s/.test(t)) { flush(); blocks.push({ heading: true, text: t.replace(/^#+\s*/, '') }); continue; }
  let body = t;
  const isItem = /^([-*+]|\d+[.)])\s+/.test(body);
  if (isItem) { flush(); body = body.replace(/^([-*+]|\d+[.)])\s+/, ''); }
  if (!cur) cur = { heading: false, text: '' }; sawProse = true;
  cur.text += ' ' + body;
  if (isItem) flush();
}
flush();

function cleanInline(s) {
  return s.replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<https?:[^>]+>/g, ' ')
    .replace(/\bhttps?:\/\/\S+/g, ' ')
    .replace(/\bwww\.\S+/g, ' ')
    .replace(/(\*\*|__|\*|~~)/g, '')
    .replace(/(^|\s)_(\S)/g, '$1$2').replace(/(\S)_(\s|$)/g, '$1$2')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

// ---------- sentences ----------
const ABBR = /\b(e\.g|i\.e|etc|vs|approx|est|incl|excl|Mr|Mrs|Ms|Dr|Prof|St|Inc|Ltd|Co|Corp|Jr|Sr|No|Nos|Fig|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|U\.S|U\.K|a\.m|p\.m|D\.N\.J|C\.D|S\.D|N\.D|E\.D|W\.D|Cal|Ill|Mass)\./g;
function splitSentences(s) {
  const P = '\u0001';
  s = s.replace(ABBR, m => m.replace(/\./g, P)).replace(/\b([A-Z])\.(?=[A-Z]\.)/g, '$1' + P);
  return s.split(/(?<=[.!?])["'”’)\]]*\s+(?=["'“‘(\[$£€#]?[A-Z0-9])/)
    .map(x => x.split(P).join('.').trim()).filter(x => /[A-Za-z0-9]/.test(x));
}

function wordsOf(s) {
  return s.split(/\s+/).map(w => w.replace(/^[^A-Za-z0-9$£€]+|[^A-Za-z0-9%]+$/g, '')).filter(w => /[A-Za-z0-9]/.test(w));
}
function syllables(word) {
  if (/^[A-Z]{2,6}\d*s?$/.test(word) && !/^(I|A|OK)$/.test(word)) return Math.min(word.replace(/[^A-Z]/g, '').length, 6); // acronyms read letter by letter
  if (!/[A-Za-z]/.test(word)) return 1; // numbers
  return word.split(/[-‐-—\/]/).reduce((n, part) => {
    let w = part.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return n;
    if (w.length <= 3) return n + 1;
    w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    const m = w.match(/[aeiouy]{1,2}/g);
    return n + (m ? m.length : 1);
  }, 0) || 1;
}

const prose = blocks.filter(b => !b.heading).map(b => cleanInline(b.text)).filter(Boolean);
const sentences = [];
for (const b of prose) for (const s of splitSentences(b)) { const w = wordsOf(s); if (w.length) sentences.push({ s, w }); }


const W = sentences.reduce((n, x) => n + x.w.length, 0);
const S = sentences.length;
const SY = sentences.reduce((n, x) => n + x.w.reduce((m, w) => m + syllables(w), 0), 0);
const grade = S && W ? 0.39 * (W / S) + 11.8 * (SY / W) - 15.59 : 0;
const longS = sentences.filter(x => x.w.length > LONG);
const longShare = S ? longS.length / S : 0;
const longParas = prose.filter(p => wordsOf(p).length > 80).length;

// ---------- phrase hits ----------
const proseText = prose.join('\n');
const HEDGE = [
  /\bit(?: is|'s|’s) (?:important|worth|crucial|essential|critical) (?:to note|noting|to remember|to understand|to highlight)\b/gi,
  /\bit should be noted\b/gi, /\bplease note\b/gi, /\bneedless to say\b/gi,
  /\bleverag(?:e|es|ed|ing)\b/gi, /\brobust\b/gi, /\bin order to\b/gi, /\bcomprehensive\b/gi,
  /\butiliz(?:e|es|ed|ing|ation)\b/gi, /\bseamless(?:ly)?\b/gi, /\bholistic\b/gi, /\bsynerg(?:y|ies)\b/gi,
  /\bcutting[- ]edge\b/gi, /\bbest[- ]in[- ]class\b/gi, /\bworld[- ]class\b/gi, /\bstate[- ]of[- ]the[- ]art\b/gi,
  /\bdelve\b/gi, /\bnavigat(?:e|ing) the\b/gi, /\blandscape\b/gi, /\bactionable\b/gi, /\bgame[- ]changer\b/gi,
  /\bunlock(?:s|ing)?\b/gi, /\bempower(?:s|ing)?\b/gi, /\bstreamlin(?:e|es|ed|ing)\b/gi, /\bfacilitat(?:e|es|ed|ing)\b/gi,
  /\bin terms of\b/gi, /\bat the end of the day\b/gi, /\bmoving forward\b/gi, /\bgoing forward\b/gi,
  /\bkey takeaways?\b/gi, /\ba (?:wide|broad) (?:range|variety) of\b/gi, /\bdue to the fact that\b/gi,
  /\bin the event that\b/gi, /\bwith regard to\b/gi, /\bwith respect to\b/gi, /\bfor the purpose of\b/gi,
  /\bpotentially\b/gi, /\barguably\b/gi, /\bmay (?:potentially|possibly)\b/gi, /\bgenerally speaking\b/gi,
  /\bto some extent\b/gi, /\bit (?:could|may|might) be argued\b/gi, /\bessentially\b/gi, /\bin today's\b/gi,
  /\bfast[- ]paced\b/gi, /\bdeep dive\b/gi, /\bplethora\b/gi, /\bmyriad\b/gi, /\bparamount\b/gi,
];
const METHOD = [
  /\bcontract\.md\b|\bcheck\.md\b|\bresearch\.md\b|\bfacts\.md\b|\bcand-[a-z]\b|\b\w+\.md\b/gi,
  /\b(?:scoring )?rubric\b/gi, /\bscoring criteria\b/gi, /\bcandidate (?:draft|answer)s?\b/gi, /\b(?:merged|final|plain|first) draft\b/gi,
  /\b(?:my|our|the) research\b/gi, /\bI (?:checked|verified|researched|searched|looked up|reviewed|pulled|confirmed|used|assumed)\b/gi,
  /\bwe (?:checked|verified|researched|searched|looked up)\b/gi, /\bchecked live\b/gi, /\bverified (?:live|on|against)\b/gi,
  /\b(?:proposal: )?confirm before use\b/gi, /\[counsel\]/gi, /\bto confirm\b/gi, /\bTBD\b/g, /\bUNKNOWN\b/g,
  /\bplaceholder\b/gi, /\bmethodology\b/gi, /\bthis (?:document|deliverable|answer|response|plan|brief|guide|analysis) (?:covers|is|will|sets out|gives|lays out)\b/gi,
  /\bas (?:you )?requested\b/gi, /\bper (?:the|your) (?:brief|request)\b/gi, /\bI (?:have|'ve) (?:written|drafted|prepared|structured)\b/gi,
];
function hits(list, t) {
  const m = {}; let n = 0;
  for (const re of list) for (const x of t.match(re) || []) { const k = x.toLowerCase(); m[k] = (m[k] || 0) + 1; n++; }
  return { n, top: Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} (${v})`).join(', ') };
}
const hedge = hits(HEDGE, proseText);
const method = hits(METHOD, proseText);

// Density markers (informational): dot separators, slash stacks, parentheses, acronyms.
const dots = (proseText.match(/ · /g) || []).length;
const slashStacks = (proseText.match(/\S+ ?\/ ?\S+ ?\/ ?\S+/g) || []).length;
const parens = (proseText.match(/\(/g) || []).length;
const COMMON = new Set(['I','A','OK','US','UK','EU','AI','CEO','CFO','COO','CTO','FAQ','PDF','URL','USD','GBP','EUR','ET','PT','PM','AM','TV','SMS','API','HR','PR','QA','ID','VAT','GST','DIY','LLC','NYC','SKU','CTA']);
const acr = {};
for (const w of wordsOf(proseText)) if (/^[A-Z][A-Z0-9]{1,4}s?$/.test(w) && /[A-Z].*[A-Z]|[A-Z]\d/.test(w) && !COMMON.has(w.replace(/s$/, ''))) acr[w] = (acr[w] || 0) + 1;
const acrList = Object.entries(acr).sort((a, b) => b[1] - a[1]);

// ---------- report ----------
const ceil = CEILING[audience];
const per100 = n => (W ? (n * 100 / W).toFixed(2) : '0');
const failGrade = grade > ceil + 1;
const failLong = longShare > LONG_SHARE;
const first = sentences.slice(0, 2).map(x => x.s.length > 260 ? x.s.slice(0, 257) + '...' : x.s);

console.log(`File: ${file}`);
console.log(`Audience: ${audience} (grade ceiling ${ceil}, fail above ${ceil + 1})`);
console.log(`Flesch-Kincaid grade: ${grade.toFixed(1)}${failGrade ? '  << OVER CEILING' : ''}`);
console.log(`Words (prose): ${W}   Sentences: ${S}   Avg sentence: ${S ? (W / S).toFixed(1) : 0} words`);
console.log(`Sentences over ${LONG} words: ${longS.length} (${(longShare * 100).toFixed(1)}%)${failLong ? '  << OVER 15%' : ''}`);
console.log(`Paragraphs over 80 words: ${longParas}`);
console.log(`Hedge/filler hits: ${hedge.n} (${per100(hedge.n)} per 100 words)${hedge.top ? ': ' + hedge.top : ''}`);
console.log(`Method-talk hits: ${method.n}${method.top ? ': ' + method.top : ''}`);
console.log(`Density: ${dots} dot separators, ${slashStacks} slash stacks, ${per100(parens)} parentheses per 100 words`);
console.log(`Acronyms (not common): ${acrList.length ? acrList.slice(0, 10).map(([k, v]) => `${k} (${v})`).join(', ') : 'none'}`);
if (tableBeforeFirst) console.log('Note: a table comes before the first prose sentence (tables are not measured).');
console.log('First two sentences:');
first.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
if (longS.length) {
  console.log('Longest sentences:');
  longS.sort((a, b) => b.w.length - a.w.length).slice(0, 3).forEach(x => console.log(`  [${x.w.length}w] ${x.s.length > 200 ? x.s.slice(0, 197) + '...' : x.s}`));
}
// Advisory targets (do not change the exit code). In blind tests these tracked judges' clarity
// scores better than the grade: long-sentence share r=-0.67, parentheses r=-0.63, method talk r=-0.47.
const miss = [];
if (longShare > 0.03) miss.push(`long sentences ${(longShare * 100).toFixed(1)}% (target 3% or less)`);
if (W && parens * 100 / W > 1.5) miss.push(`parentheses ${per100(parens)} per 100 words (target 1.5 or less)`);
if (S && W / S > 14) miss.push(`average sentence ${(W / S).toFixed(1)} words (target 14 or less)`);
if (method.n) miss.push(`method talk ${method.n} (target 0)`);
if (dots > 3 || slashStacks > 3) miss.push(`crammed lists: ${dots} dot separators, ${slashStacks} slash stacks (split into rows or sentences)`);
if (hedge.n) miss.push(`hedge/filler ${hedge.n} (target 0)`);
console.log(`Editor targets: ${miss.length ? 'missed: ' + miss.join('; ') : 'all met'}`);
console.log(`Result: ${failGrade || failLong ? 'FAIL' : 'PASS'}`);
process.exit(failGrade || failLong ? 1 : 0);
