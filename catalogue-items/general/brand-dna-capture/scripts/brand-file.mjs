#!/usr/bin/env node
// brand-file.mjs (AI Blocks, brand-dna-capture) - version 1.0.0
//
// Keeps one brand file for a business in its own project folder, and hands each job only the part it needs.
//   context/brand-file/index.md        one screen: what is here, how fresh each part is, what is missing
//   context/brand-file/facts.json      lasting facts: the business, proof, policies, customers
//   context/brand-file/offers.json     what changes weekly: prices, promotions, stock, shipping
//   context/brand-file/look.json       palette, type, shapes, buttons, imagery (from the capture)
//   context/brand-file/voice.md        real lines, each with its source and date
//   context/brand-file/references.md   admired, avoided and competitors, kept between jobs
//   context/brand-file/worked.md       what the client kept, killed or asked for more of, by job and date
//   context/brand-file/history/        dated snapshots, and changes.md
// context/brand-dna.json stays the raw capture these files are built from.
//
// Usage:
//   node brand-file.mjs status [--for <kind>] [--json]
//   node brand-file.mjs slice <none|facts|voice|look|full> [--for <kind>]
//   node brand-file.mjs learn --job <name> --kept "<...>" --killed "<...>" --more "<...>"
//   node brand-file.mjs migrate [--from <old brand folder>]
// Options:
//   --dir <folder>     the context folder (default: ./context)
//   --for <kind>       web_page, ad_creative, copy, email, audit, analysis, strategy, plan, code, ops_doc or other
//   --today <date>     read the file as of this date (YYYY-MM-DD), for tests
//
// Freshness: prices, offers, stock and shipping go stale after 7 days; look, voice and other facts after 90 days;
// anything with no date is stale. A stale line is listed for a recheck, never handed over as a fact.
// It reads and writes files in the context folder only. It opens no network connection. Needs Node 18+.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const VERSION = '1.0.0';
export const SCHEMA = 'ai-blocks-brand-file/1';
export const FOLDER = 'brand-file';
export const INDEX_FILE = 'index.md';
/** Days a line stays fresh, by its `volatile` class. `fixed` never ages, but still needs a date. */
export const FRESH_DAYS = Object.freeze({ fast: 7, slow: 90, fixed: null });
export const FAST_KINDS = Object.freeze(['price', 'offer', 'stock', 'shipping']);
export const SLICES = Object.freeze(['none', 'facts', 'voice', 'look', 'full']);
export const SLICE_PARTS = Object.freeze({ none: [], facts: ['offers', 'facts'], voice: ['offers', 'facts', 'voice'], look: ['offers', 'facts', 'look'], full: ['offers', 'facts', 'voice', 'look'] });
export const SLICE_WORDS = Object.freeze({ none: 40, facts: 600, voice: 600, look: 600, full: 1500 });
export const SLICE_BY_KIND = Object.freeze({ web_page: 'full', ad_creative: 'full', copy: 'voice', email: 'voice', audit: 'facts', analysis: 'none', strategy: 'facts', plan: 'facts', code: 'none', ops_doc: 'none', other: 'none' });
/** Kinds that sell something: their prices and stock are rechecked before anything else. */
export const SELLING_KINDS = Object.freeze(['web_page', 'ad_creative', 'copy', 'email']);
export const PARTS = Object.freeze([
  { id: 'offers', file: 'offers.json', holds: 'Prices, promotions, stock and shipping', fresh: 'fast' },
  { id: 'facts', file: 'facts.json', holds: 'Lasting facts: the business, proof, policies, customers', fresh: 'slow' },
  { id: 'look', file: 'look.json', holds: 'Palette, type, shapes, buttons and imagery', fresh: 'slow' },
  { id: 'voice', file: 'voice.md', holds: 'Real lines, each with its source', fresh: 'slow' },
  { id: 'references', file: 'references.md', holds: 'Admired, avoided and competitors', fresh: null },
  { id: 'worked', file: 'worked.md', holds: 'What the client kept, killed or asked for more of', fresh: null },
]);
// How many words each block of a slice may use. Words a block does not use pass to the next one.
const CAPS = {
  facts: { worked: 70, offers: 200, facts: 160, recheck: 100, unconfirmed: 30 },
  voice: { worked: 60, offers: 110, facts: 90, voice: 170, references: 50, recheck: 60, unconfirmed: 20 },
  look: { worked: 60, offers: 100, facts: 70, look: 220, references: 50, recheck: 50, unconfirmed: 10 },
  full: { worked: 120, offers: 270, facts: 220, voice: 210, look: 290, references: 140, recheck: 130, unconfirmed: 40 },
};
const VOICE_HEAD = ['# Voice', '', 'Real lines, word for word, each with where it was read and when. Add lines; never reword one.', 'Format: - "line" | kind | source | date', ''];
const VOICE_SECTIONS = ['Brand lines', 'Button words', 'Customer words', 'Notes'];
const REF_HEAD = ['# References', '', 'Kept between jobs. Add to it; do not start again.', 'Format: - name or URL | what to take or avoid | source | date', ''];
const REF_SECTIONS = ['Admired', 'Avoid', 'Competitors', 'Notes'];
const WORKED_HEAD = ['# What worked', '', 'What this client kept, killed or asked for more of, newest first. Read it before you write the next spec.', ''];
const OLD_INDEX = ['00-start-here.md', '00-index.md', 'INDEX.md'];
const OLD_FILES = ['business.md', 'offers.md', 'customers.md', 'proof-and-claims.md', 'voice-and-look.md', 'market.md', 'log.md'];

// ---------- small helpers ----------
const slash = (p) => String(p).split(path.sep).join('/');
const slug = (s, n = 60) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, n);
const words = (s) => String(s || '').split(/\s+/).filter(Boolean).length;
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const cut = (s, n) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; };
const pct = (n) => `${Math.round((n || 0) * 1000) / 10}%`;
const aJob = (kind) => `${/^[aeiou]/.test(kind) ? 'an' : 'a'} ${kind} job`;
export const day = (d) => { const t = d instanceof Date ? d : new Date(d); return Number.isNaN(t.getTime()) ? null : t.toISOString().slice(0, 10); };
/** Whole days between a date and now. null when the date is missing or unreadable. */
export function ageDays(date, now) { const t = Date.parse(date || ''); return Number.isNaN(t) ? null : Math.max(0, Math.floor((now.getTime() - t) / 864e5)); }
export const volatileOf = (kind) => (FAST_KINDS.includes(kind) ? 'fast' : 'slow');
/** A line is stale with no date, or when it is older than its class allows. */
export function isStale(rec, now) {
  const age = ageDays(rec?.captured_at, now); if (age === null) return true;
  const limit = FRESH_DAYS[rec.volatile in FRESH_DAYS ? rec.volatile : volatileOf(rec.kind)];
  return limit !== null && age > limit;
}
const shortSource = (s) => cut(String(s || 'no source').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''), 70);
const isUrl = (s) => /^https?:\/\//i.test(String(s || ''));
const readText = (f) => { try { return fs.readFileSync(f, 'utf8').replace(/^﻿/, ''); } catch { return null; } };
const readJson = (f) => { const t = readText(f); if (t === null) return null; try { return JSON.parse(t); } catch { return null; } };
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
/** The first date written in a line: 2026-11-09, 9 Nov 2026 or Nov 9, 2026. Returned as YYYY-MM-DD. */
export function findDate(s) {
  const t = String(s || ''), two = (n) => String(n).padStart(2, '0');
  let m = /\b(20\d{2})-(\d{2})-(\d{2})(?:T[\d:.]+Z?)?/.exec(t); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+(20\d{2})\b/i.exec(t); if (m) return `${m[3]}-${two(MONTHS[m[2].toLowerCase()])}-${two(m[1])}`;
  m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d{2})\b/i.exec(t); if (m) return `${m[3]}-${two(MONTHS[m[1].toLowerCase()])}-${two(m[2])}`;
  return null;
}
const PRICE = /(?:[$£€₹¥]|\b(?:USD|EUR|GBP|INR|AUD|CAD|Rs\.?)\s?)\d|\b\d[\d,.]*\s?(?:USD|EUR|GBP|INR|rupees|dollars|pounds|euros)\b|\bper (?:month|year)\b|\/\s?(?:mo|month|yr|year)\b/i;
/** The kind of a written fact, from its words. Lines that change weekly win over lines that last. */
export function kindOf(line, fallback = 'fact') {
  const t = String(line || '');
  if (/\b(?:out of stock|in stock|sold out|back in stock|low stock|pre-?order)\b/i.test(t)) return 'stock';
  if (/\b\d{1,2}\s?% off\b|\bsale\b|\bdiscount|\bcoupon\b|\bpromo|\buse code\b|\bbuy \d+ get\b|\bfree gift\b|\bbogo\b|\boffer ends\b|\blimited[- ]time\b/i.test(t)) return 'offer';
  if (/\bshipping\b|\bdelivery\b|\bdeliver(?:s|ed)\b|\bdispatch|\bships?\b|\bcourier\b/i.test(t)) return 'shipping';
  if (PRICE.test(t)) return 'price';
  if (/guarantee|warrant|\breturns?\b|\brefund|\bexchange\b|money[- ]back/i.test(t)) return 'guarantee';
  if (/\breviews?\b|\bratings?\b|\brated\b|\bstars?\b|★/i.test(t)) return 'review';
  return fallback;
}
const record = (kind, id, value, source, captured_at, extra = {}) => ({ id, kind, value: cut(value, 240), source: source || null, captured_at: captured_at || null, volatile: volatileOf(kind), status: 'live', ...extra });

// ---------- markdown files: a head, then sections of "- " lines ----------
function readMd(file, head, sections) {
  const text = readText(file), doc = { head: [...head], sections: sections.map((title) => ({ title, lines: [] })) };
  if (text === null) return doc;
  let cur = null; const top = [];
  for (const line of text.split(/\r?\n/)) {
    const h = /^##\s+(.+?)\s*$/.exec(line);
    if (h) { cur = doc.sections.find((s) => s.title.toLowerCase() === h[1].toLowerCase()); if (!cur) { cur = { title: h[1], lines: [] }; doc.sections.push(cur); } continue; }
    if (cur) { if (line.trim()) cur.lines.push(line); } else top.push(line);
  }
  if (top.some((l) => l.trim())) doc.head = top.join('\n').trimEnd().split('\n').concat('');
  return doc;
}
const writeMd = (doc) => [...doc.head, ...doc.sections.flatMap((s) => [`## ${s.title}`, '', ...s.lines, ''])].join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
const sectionOf = (doc, title) => doc.sections.find((s) => s.title.toLowerCase() === title.toLowerCase()) || (doc.sections.push({ title, lines: [] }), doc.sections.at(-1));
/** A line written as - "text" | kind | source | date. Anything else is kept as it is, with no date. */
export function parseEntry(line) {
  const parts = String(line).replace(/^\s*[-*]\s+/, '').split(' | ');
  const unq = (s) => s.trim().replace(/^["“](.*)["”]$/, '$1');
  if (parts.length >= 4) return { text: unq(parts.slice(0, -3).join(' | ')), kind: parts.at(-3).trim(), source: parts.at(-2).trim(), date: findDate(parts.at(-1)) };
  return { text: unq(parts.join(' | ')), kind: null, source: null, date: findDate(line) };
}
const entryLine = (e) => `- "${e.text}" | ${e.kind || 'line'} | ${e.source || 'no source'} | ${e.date || 'no date'}`;
/** Add or re-date entries in a section. Nothing is removed. Returns how many were new. */
function upsertEntries(sec, entries) {
  let added = 0;
  for (const e of entries) {
    const at = sec.lines.findIndex((l) => parseEntry(l).text === e.text);
    if (at < 0) { sec.lines.push(entryLine(e)); added++; } else if (e.date) sec.lines[at] = entryLine({ ...parseEntry(sec.lines[at]), ...e });
  }
  return added;
}

// ---------- the raw capture (context/brand-dna.json) into brand file parts ----------
/** Pages of a capture, whether the script wrote it (pages) or the snippet did (one page at the top level). */
function capturePages(dna) {
  if (Array.isArray(dna?.pages)) return dna.pages.filter((p) => p.desktop && !p.desktop.error).map((p) => ({ url: p.url || dna.source, path: p.path || '/', captured_at: p.captured_at || dna.captured_at || null, d: p.desktop }));
  if (dna?.palette && dna?.facts) return [{ url: dna.page?.url || dna.source, path: dna.page?.path || '/', captured_at: dna.captured_at || null, d: dna }];
  return [];
}
const STOCK = (a) => { const t = String(a || '').split('/').pop(); return /^InStock$/i.test(t) ? 'in stock' : /^(OutOfStock|SoldOut)$/i.test(t) ? 'out of stock' : t.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(); };
/** Every dated line a capture holds, as brand file records. */
export function recordsFromCapture(dna) {
  const offers = [], facts = [], seen = new Set();
  const push = (r) => { if (!r.value || seen.has(r.id)) return; seen.add(r.id); (FAST_KINDS.includes(r.kind) ? offers : facts).push({ ...r, from: 'capture' }); };
  for (const p of capturePages(dna)) {
    const f = p.d.facts || {}, page = slug(p.path) || 'home', at = p.captured_at || f.captured_at;
    const named = (f.structured || []).some((s) => s.name && s.price != null && s.price !== '');
    for (const s of f.structured || []) {
      if (s.type === 'meta' && named) continue; // the product's own entry already gives this page's price
      const name = s.name || (s.type === 'meta' ? `Page price (${p.path})` : null), key = slug(name) || page;
      if (name && s.price != null && s.price !== '') push(record('price', `price:${key}`, `${name}: ${[s.currency, s.price].filter(Boolean).join(' ')}`, p.url, at));
      if (name && s.availability) push(record('stock', `stock:${key}`, `${name}: ${STOCK(s.availability)}`, p.url, at));
      if (name && s.rating != null) push(record('review', `review:${key}`, `${name}: rated ${s.rating}${s.review_count ? ` from ${s.review_count} reviews` : ''}`, p.url, at));
    }
    const byLine = new Map();
    for (const [group, kind] of [['offers', 'offer'], ['shipping', 'shipping'], ['prices', 'price'], ['guarantees', 'guarantee'], ['reviews', 'review']]) {
      for (const v of f[group] || []) { const text = typeof v === 'string' ? v : v?.text; if (text && !byLine.has(text)) byLine.set(text, kind); }
    }
    for (const [text, kind] of byLine) push(record(kind, `${kind}:${page}:${slug(text)}`, text, p.url, at));
  }
  return { offers, facts };
}
/** The look, cut down from the capture to what a maker reads. The full numbers stay in context/brand-dna.json. */
export function lookFromCapture(dna) {
  const pages = capturePages(dna), b = dna?.brand || pages[0]?.d; if (!b?.palette) return null;
  const role = (r) => (r ? { family: r.family, weight: r.weight, size: r.size, transform: r.transform && r.transform !== 'none' ? r.transform : undefined, font_loaded: r.font_loaded } : undefined);
  const btn = (s) => (s ? { bg: s.bg || null, color: s.color, radius: s.radius, transform: s.transform, font: s.font, weight: s.weight, size: s.size, examples: (s.examples || []).slice(0, 4) } : null);
  const roles = b.type?.roles || {};
  return {
    captured_at: pages[0]?.captured_at || dna.captured_at || null, source: pages[0]?.url || dna.source || null,
    palette: (b.palette || []).slice(0, 10).map((c) => ({ hex: c.hex, area_share: c.area_share, text_share: c.text_share || undefined, roles: c.roles })),
    pixel_palette: b.pixel_palette?.colors ? { image_share: b.pixel_palette.image_share, colors: b.pixel_palette.colors.slice(0, 6) } : undefined,
    type: { roles: Object.fromEntries(['h1', 'h2', 'body', 'button', 'nav', 'price'].filter((k) => roles[k]).map((k) => [k, role(roles[k])])), families: (b.type?.families || []).slice(0, 4).map((f) => ({ family: f.family, char_share: f.char_share })), font_css: b.type?.font_css || undefined, font_files: (b.type?.font_files || []).slice(0, 8) },
    shape: b.shape ? { radius: (b.shape.radius || []).slice(0, 4), shadows: (b.shape.shadows || []).slice(0, 2).map((s) => s.value), square_elements: b.shape.square_elements, painted_elements: b.shape.painted_elements } : undefined,
    buttons: { primary: btn((b.buttons?.styles || []).find((s) => s.primary) || (b.buttons?.styles || [])[0]), primary_text: b.buttons?.primary?.text || undefined, others: (b.buttons?.styles || []).filter((s) => !s.primary).slice(0, 2).map(btn) },
    links: Array.isArray(b.links) ? b.links.slice(0, 2) : b.links || undefined,
    nav: b.nav ? { items: (b.nav.items || []).slice(0, 12).map((i) => i.text || i), hamburger: !!b.nav.hamburger, has_cart: b.nav.has_cart || undefined } : undefined,
    footer: b.footer ? { columns: (b.footer.columns || []).map((c) => c.heading || '(untitled)'), link_count: b.footer.link_count } : undefined,
    imagery: Object.fromEntries(pages.map((p) => [p.path, { count: p.d.images?.count, per_1000px: p.d.images?.per_1000px, area_share: p.d.images?.area_share }])),
    sections: Object.fromEntries(pages.map((p) => [p.path, (p.d.sections || []).slice(0, 14).map((s) => s.kind + (s.heading ? ` "${cut(s.heading, 40)}"` : ''))])),
  };
}
function voiceFromCapture(dna) {
  const lines = [], buttons = [];
  for (const p of capturePages(dna)) {
    const date = day(p.captured_at || '') || null;
    for (const s of p.d.voice?.samples || []) if (s.kind !== 'cta') lines.push({ text: cut(s.text, 220), kind: s.kind === 'headline' ? 'headline' : 'body', source: p.url, date });
    for (const c of (p.d.voice?.ctas || []).slice(0, 10)) buttons.push({ text: cut(c, 60), kind: 'button', source: p.url, date });
  }
  return { lines, buttons };
}
/** One line for a captured competitor or reference site: its look and headline lines only, never its prices. */
function referenceLine(r) {
  const look = [(r.look?.palette || []).slice(0, 4).map((c) => `${c.hex} ${pct(c.area_share)}`).join(', '), r.look?.h1 && `headlines ${r.look.h1}`, r.look?.body && `body ${r.look.body}`, r.look?.button && `button ${r.look.button}`].filter(Boolean).join('; ');
  const lines = (r.headlines || []).slice(0, 5).map((h) => `"${cut(h, 90)}"`).join(' / ');
  return `- ${r.url} | look: ${look || 'not measured'}${lines ? ` | lines: ${lines}` : ''}${r.note ? ` | ${r.note}` : ''} | capture-brand-dna.mjs | ${day(r.captured_at || '') || 'no date'}`;
}

// ---------- merging: new values go in, old ones are kept with their dates ----------
const CHANGE_GONE = { price: 'Price no longer shown', offer: 'Offer ended', stock: 'Stock line gone', shipping: 'Shipping line removed' };
/**
 * Merge incoming records into the ones on file. A record whose value changed keeps the old value in `was`. A record
 * the capture read from a page, which is no longer there when that page is read again, is marked ended. A line a
 * person wrote is never ended by a capture. Nothing is deleted.
 * `report` is false on the first build, when everything would be "new".
 */
export function mergeRecords(existing, incoming, { recaptured = new Set(), now = new Date(), report = true, known = null } = {}) {
  const out = (existing || []).map((r) => ({ ...r })), byId = new Map(out.map((r) => [r.id, r])), changes = [], got = new Set(), newPages = new Map();
  const note = (text, source) => { if (report) changes.push({ at: day(now), text, source: source || null }); };
  for (const r of incoming) {
    got.add(r.id); const old = byId.get(r.id);
    if (!old) {
      out.push({ ...r, first_seen: r.captured_at }); byId.set(r.id, out.at(-1));
      // A page read for the first time is one change, not one per line on it.
      if (known && isUrl(r.source) && !known.has(r.source)) newPages.set(r.source, (newPages.get(r.source) || 0) + 1); else note(`New ${r.kind}: ${r.value}`, r.source);
      continue;
    }
    if (old.value !== r.value) {
      const [a, b] = [old.value, r.value], head = a.includes(': ') && b.startsWith(a.slice(0, a.indexOf(': ') + 2)) ? a.slice(0, a.indexOf(': ')) : null;
      note(`${cap(r.kind)} changed: ${head ? `${head}, ${a.slice(head.length + 2)} → ${b.slice(head.length + 2)}` : `${a} → ${b}`}`, r.source);
      old.was = { value: old.value, captured_at: old.captured_at };
    } else if (old.status === 'ended') note(`Back on the page: ${r.value}`, r.source);
    Object.assign(old, { kind: r.kind, value: r.value, source: r.source, captured_at: r.captured_at || old.captured_at, volatile: old.volatile === 'fixed' ? 'fixed' : r.volatile, status: r.status || 'live', ...(r.from ? { from: r.from } : {}) });
    delete old.ended_at;
  }
  for (const r of out) {
    if (got.has(r.id) || r.status !== 'live' || r.from !== 'capture' || !recaptured.has(r.source)) continue;
    r.status = 'ended'; r.ended_at = now.toISOString();
    note(`${CHANGE_GONE[r.kind] || 'No longer on the page'}: ${r.value}`, r.source);
  }
  return { records: out, changes, newPages };
}

// ---------- written facts and the old eight-file folder ----------
// A tag a person writes after a line. confirmed and approved are checked; banned is a claim never to use; the rest are not facts yet.
const TAG = /\[(confirmed|approved|inferred|disputed|unknown|pending|banned)(?::\s*([^\]]*))?\]/i;
/** One written line as a record: its tag, source and date are read from the line; a missing date stays missing. */
export function recordFromLine(raw, { file, fallbackKind = 'fact', topic = null, fileDate = null } = {}) {
  let line = String(raw).replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '').replace(/^\|\s*|\s*\|$/g, '').replace(/\s*\|\s*/g, ' | ').replace(/\*\*/g, '').trim();
  if (!line || /^[-:| ]+$/.test(line) || line.length < 4) return null;
  const tag = TAG.exec(line), url = /https?:\/\/[^\s)\]|]+/i.exec(line), said = /\(?\bsource:\s*([^)|]+)\)?/i.exec(line);
  const date = findDate(line) || fileDate, status = !tag || /confirmed|approved/i.test(tag[1]) ? 'live' : /banned/i.test(tag[1]) ? 'banned' : 'unconfirmed';
  const source = url?.[0] || said?.[1]?.trim() || (tag?.[2] ? tag[2].replace(/,?\s*(?:20\d{2}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]{3,9}\s+20\d{2})\s*$/, '').trim() || file : file);
  const value = line.replace(TAG, '').replace(/\(?\bsource:\s*[^)|]+\)?/i, '').split(' | ')
    .filter((cell) => !/^\s*(?:https?:\/\/\S+|20\d{2}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]{3,9}\.?\s+20\d{2})\s*$/.test(cell)).join(' | ').replace(/\s{2,}/g, ' ').replace(/[\s|,;]+$/, '').trim();
  if (value.length < 4) return null;
  const kind = kindOf(value, fallbackKind), full = topic && !value.toLowerCase().includes(topic.toLowerCase()) ? `${topic}: ${value}` : value;
  return record(kind, `${kind}:${slug(full)}`, full, source, date, status === 'live' ? {} : { status, note: tag[0] });
}
/** Records from a markdown file of facts. A date in the first lines (for example "Captured 9 Nov 2026") dates lines that have none. */
export function recordsFromMarkdown(text, opts = {}) {
  const lines = String(text || '').split(/\r?\n/), fileDate = findDate(lines.slice(0, 6).join(' ')), out = []; let topic = null, fenced = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; continue; }
    if (fenced || /^<!--/.test(line.trim())) continue;
    const h = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (h) { topic = h[1].length >= 2 ? h[2].replace(/[*`]/g, '') : null; continue; }
    if (!/^s*(?:[-*+|]|d+[.)])/.test(line) && words(line) <= 6 && findDate(line)) continue; // a dateline such as "Captured 9 Nov 2026."
    const r = recordFromLine(line, { ...opts, topic, fileDate }); if (r) out.push(r);
  }
  return out;
}
function findOldFolder(ctx, from) {
  const root = path.dirname(ctx), dirs = from ? [path.resolve(from)] : [path.join(root, 'brand-brain'), path.join(ctx, 'brand-brain'), path.join(root, 'brand-file')];
  return dirs.find((d) => fs.existsSync(d) && (OLD_INDEX.some((f) => fs.existsSync(path.join(d, f))) || OLD_FILES.filter((f) => fs.existsSync(path.join(d, f))).length >= 3)) || null;
}

// ---------- reading the brand file as of a date ----------
export const brandDir = (ctx) => path.join(ctx, FOLDER);
function readAll(ctx) {
  const dir = brandDir(ctx);
  const facts = readJson(path.join(dir, 'facts.json')), offers = readJson(path.join(dir, 'offers.json')), look = readJson(path.join(dir, 'look.json'));
  const has = (f) => fs.existsSync(path.join(dir, f));
  return { dir, exists: fs.existsSync(dir) && PARTS.some((p) => has(p.file)), facts, offers, look,
    voice: has('voice.md') ? readMd(path.join(dir, 'voice.md'), VOICE_HEAD, VOICE_SECTIONS) : null,
    references: has('references.md') ? readMd(path.join(dir, 'references.md'), REF_HEAD, REF_SECTIONS) : null,
    worked: has('worked.md') ? readMd(path.join(dir, 'worked.md'), WORKED_HEAD, []) : null,
    changes: readText(path.join(dir, 'history', 'changes.md')) };
}
const live = (list) => (list || []).filter((r) => !['ended', 'unconfirmed', 'banned'].includes(r.status));
const newest = (dates) => dates.filter(Boolean).sort().at(-1) || null;
const levelFor = (kind, level) => (SLICES.includes(level) ? level : kind ? SLICE_BY_KIND[kind] ?? 'none' : 'full');

/** What exists, how old each part is, what is stale and what is missing, as of `now`. */
export function statusOf(ctx, { now = new Date(), kind = null, level = null } = {}) {
  const all = readAll(ctx), need = levelFor(kind, level), needed = SLICE_PARTS[need], stale = [], parts = [];
  for (const p of PARTS) {
    const row = { id: p.id, file: p.file, exists: false, state: 'missing', count: 0, stale_count: 0, newest: null, age_days: null, limit_days: p.fresh ? FRESH_DAYS[p.fresh] : null, needed: needed.includes(p.id) };
    if (p.id === 'offers' || p.id === 'facts') {
      const doc = all[p.id];
      if (doc) {
        const recs = live(doc[p.id]), old = recs.filter((r) => isStale(r, now));
        Object.assign(row, { exists: true, count: recs.length, stale_count: old.length, newest: day(newest([...recs.map((r) => r.captured_at), doc.checked_at]) || '') });
        row.state = recs.length ? (old.length ? 'stale' : 'fresh') : isStale({ captured_at: doc.checked_at, volatile: p.fresh }, now) ? 'stale' : 'empty';
        for (const r of old) stale.push({ part: p.id, id: r.id, kind: r.kind, value: r.value, source: r.source, captured_at: r.captured_at, age_days: ageDays(r.captured_at, now) });
      }
    } else if (p.id === 'look') {
      if (all.look) { Object.assign(row, { exists: true, count: (all.look.palette || []).length, newest: day(all.look.captured_at || '') }); row.state = isStale({ captured_at: all.look.captured_at, volatile: 'slow' }, now) ? 'stale' : 'fresh'; }
    } else if (p.id === 'voice') {
      if (all.voice) {
        const lines = sectionOf(all.voice, 'Brand lines').lines.map(parseEntry), undated = lines.filter((e) => !e.date).length;
        Object.assign(row, { exists: true, count: lines.length, stale_count: undated, newest: newest(lines.map((e) => e.date)) });
        row.state = !lines.length ? 'missing' : isStale({ captured_at: row.newest, volatile: 'slow' }, now) ? 'stale' : 'fresh';
      }
    } else {
      const doc = all[p.id];
      if (doc) { const lines = doc.sections.flatMap((s) => [s.title, ...s.lines]); Object.assign(row, { exists: true, count: doc.sections.reduce((n, s) => n + s.lines.filter((l) => /^- /.test(l)).length, 0), newest: newest(lines.map(findDate)), state: 'kept' }); }
      else row.state = 'none yet';
    }
    row.age_days = row.newest ? ageDays(row.newest, now) : null;
    parts.push(row);
  }
  const blocking = parts.filter((p) => p.needed && (p.state === 'missing' || p.state === 'stale'));
  const business = all.facts?.business || all.offers?.business || null, site = all.facts?.site || all.offers?.site || all.look?.source || null;
  // A capture saved by hand (the browser snippet) that the brand file has not taken in yet.
  const raw = Date.parse(readJson(path.join(ctx, 'brand-dna.json'))?.captured_at || ''), taken = Date.parse(all.offers?.checked_at || all.facts?.checked_at || '');
  const unsynced = all.exists && !Number.isNaN(raw) && (Number.isNaN(taken) || raw > taken);
  return { schema: SCHEMA, dir: slash(path.relative(process.cwd(), all.dir) || all.dir), exists: all.exists, business, site, today: day(now), kind, level: need, needed,
    parts, stale, missing: parts.filter((p) => p.needed && p.state === 'missing').map((p) => p.id), stale_parts: parts.filter((p) => p.needed && p.state === 'stale').map((p) => p.id), unsynced,
    ok: need === 'none' || (all.exists && blocking.length === 0 && !unsynced), next: nextSteps({ all, ctx, need, kind, parts, stale, unsynced }) };
}
const toolPath = (name) => { const rel = slash(path.join(path.relative(process.cwd(), HERE) || '.', name)); return rel.startsWith('../../') || path.isAbsolute(rel) ? slash(path.join(HERE, name)) : rel; };
function nextSteps({ all, ctx, need, kind, parts, stale, unsynced }) {
  if (need === 'none') return [`No brand file is needed for ${kind ? aJob(kind) : 'this job'}. Skip capture and work from the system, files or data.`];
  const capture = `node ${toolPath('capture-brand-dna.mjs')}`, out = [], needed = parts.filter((p) => p.needed);
  if (!all.exists) {
    const old = findOldFolder(ctx), raw = ['brand-dna.json', 'facts.md', 'voice.md'].filter((f) => fs.existsSync(path.join(ctx, f)));
    if (old || raw.length) return [`Build the brand file from what is already here (${[...raw.map((f) => `context/${f}`), old && slash(path.relative(process.cwd(), old))].filter(Boolean).join(', ')}): node ${toolPath('brand-file.mjs')} migrate`];
    return [`First job for this business: build the brand file once. Run: ${capture} <site url> <1 to 3 paths that matter>`, 'No website yet: write facts.json and voice.md by hand from what the client gives you, each line with its source and date.'];
  }
  if (unsynced) return [`context/brand-dna.json is newer than the brand file. Take it in first: node ${toolPath('brand-file.mjs')} migrate`, 'Then run status again.'];
  const fast = stale.filter((s) => FAST_KINDS.includes(s.kind)), pages = [...new Set(fast.map((s) => s.source).filter(isUrl))];
  const offers = needed.find((p) => p.id === 'offers');
  if (fast.length || offers?.state === 'stale' || offers?.state === 'missing') out.push(`${SELLING_KINDS.includes(kind) || !kind ? 'First, refresh' : 'Refresh'} prices, offers, stock and shipping (${fast.length} stale): ${capture} ${pages.length ? pages.slice(0, 4).join(' ') : `${all.facts?.site || all.look?.source || '<site url>'} <the pages with prices>`}`);
  const slow = needed.filter((p) => ['look', 'voice'].includes(p.id) && (p.state === 'stale' || p.state === 'missing')).map((p) => p.id);
  if (slow.length) out.push(`Refresh the ${slow.join(' and ')}: ${capture} ${all.facts?.site || all.look?.source || '<site url>'}`);
  const told = stale.filter((s) => !FAST_KINDS.includes(s.kind) && !isUrl(s.source));
  const read = stale.filter((s) => !FAST_KINDS.includes(s.kind) && isUrl(s.source));
  if (read.length && !slow.length) out.push(`Read ${read.length} older fact${read.length === 1 ? '' : 's'} again at the source: ${capture} ${[...new Set(read.map((s) => s.source))].slice(0, 4).join(' ')}`);
  if (told.length) out.push(`Confirm ${told.length} fact${told.length === 1 ? '' : 's'} with no date or an old one with the client, then set captured_at in ${slash(path.join(FOLDER, 'facts.json'))}. Until then they are not facts.`);
  if (needed.some((p) => p.id === 'facts' && p.state === 'missing')) out.push(`facts.json is missing: ${capture} <site url>, or write it by hand with a source and date on every line.`);
  out.push(`${out.length ? 'Then take' : 'Take'} only your slice: node ${toolPath('brand-file.mjs')} slice ${need}${kind ? ` --for ${kind}` : ''}`);
  return out;
}
function statusText(s) {
  if (!s.exists) return [`No brand file yet at ${s.dir}.`, ...s.next.map((n) => `- ${n}`), s.ok ? 'Result: READY (nothing needed)' : 'Result: NOT READY'].join('\n');
  const pad = (v, n) => String(v ?? '').padEnd(n), rows = s.parts.map((p) => `${pad(p.id, 11)}${pad(p.file, 15)}${pad(p.state, 10)}${pad(p.newest || '-', 12)}${pad(p.age_days === null ? '-' : `${p.age_days}d`, 6)}${p.count} ${p.id === 'look' ? 'colour' : 'line'}${p.count === 1 ? '' : 's'}${p.stale_count ? `, ${p.stale_count} ${p.id === 'voice' ? 'undated' : 'stale'}` : ''}${p.limit_days ? `, fresh for ${p.limit_days} days` : ''}${p.needed ? '' : ', not needed here'}`);
  const out = [`Brand file: ${s.business || s.site || 'unnamed'} (${s.dir}) as of ${s.today}${s.kind ? `, for ${aJob(s.kind)}: needs ${s.level}` : ''}`, '', `${pad('part', 11)}${pad('file', 15)}${pad('state', 10)}${pad('newest', 12)}${pad('age', 6)}notes`, ...rows];
  if (s.stale.length) out.push('', `Stale, recheck before use (${s.stale.length}):`, ...s.stale.slice(0, 12).map((x) => `- ${x.kind}: ${cut(x.value, 90)} (${shortSource(x.source)}, ${x.captured_at ? `${day(x.captured_at)}, ${x.age_days} days old` : 'no date'})`), ...(s.stale.length > 12 ? [`- and ${s.stale.length - 12} more`] : []));
  if (s.missing.length) out.push('', `Missing: ${s.missing.join(', ')}`);
  out.push('', 'Next:', ...s.next.map((n) => `- ${n}`), '', `Result: ${s.ok ? 'READY' : 'NOT READY'}`);
  return out.join('\n');
}

// ---------- index.md: the one screen ----------
function indexMarkdown(ctx, now) {
  const s = statusOf(ctx, { now }), all = readAll(ctx);
  const changes = (all.changes || '').split(/\r?\n/).filter((l) => /^(## |- )/.test(l)), nextBlock = changes.findIndex((l, i) => i > 0 && l.startsWith('## '));
  const firstBlock = changes.slice(0, Math.min(9, nextBlock < 0 ? changes.length : nextBlock));
  const worked = (all.worked?.sections || []).slice(0, 2).flatMap((x) => [`- ${x.title}: ${x.lines.map((l) => l.replace(/^- /, '')).join('; ')}`]);
  return [
    `# Brand file: ${s.business || s.site || 'unnamed'}`, '',
    `${s.site ? `Site: ${s.site}. ` : ''}Written ${s.today} by brand-file.mjs ${VERSION}. Ages are as of that day; run \`brand-file.mjs status\` for today's.`, '',
    '| Part | File | Holds | Newest | State |', '|---|---|---|---|---|',
    ...s.parts.map((p) => `| ${p.id} | ${p.file} | ${PARTS.find((x) => x.id === p.id).holds} | ${p.newest || '-'} | ${p.state}${p.stale_count ? ` (${p.stale_count} ${p.id === 'voice' ? 'undated' : 'stale'} of ${p.count})` : p.exists ? ` (${p.count})` : ''} |`), '',
    `Missing: ${s.parts.filter((p) => p.state === 'missing').map((p) => p.file).join(', ') || 'nothing'}.`,
    `Stale: ${s.stale.length ? `${s.stale.length} line${s.stale.length === 1 ? '' : 's'}, starting with ${s.stale.slice(0, 3).map((x) => `"${cut(x.value, 50)}"`).join(', ')}` : 'nothing'}.`, '',
    ...(firstBlock.length ? ['Changed at the last capture:', ...firstBlock.map((l) => l.replace(/^## /, '- On ').replace(/^- (?!On )/, '  - ')), ''] : []),
    ...(worked.length ? ['Latest from worked.md:', ...worked, ''] : []),
    'How to use it:', '- Take a slice, never the whole file: `brand-file.mjs slice <none|facts|voice|look|full> --for <kind>`.',
    '- Prices, offers, stock and shipping are fresh for 7 days. Look, voice and other facts for 90. A line with no date is stale.',
    '- A stale line is not a fact until it is read again at its source.',
    '- The raw capture is `context/brand-dna.json`; screenshots are in `context/screenshots/`. Old versions are in `history/`.', '',
  ].join('\n');
}
function writeIndex(ctx, now) { try { fs.writeFileSync(path.join(brandDir(ctx), INDEX_FILE), indexMarkdown(ctx, now)); } catch { /* a read-only folder still gets its status */ } }

// ---------- build and update ----------
const stamp = (now) => now.toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
/** Write a JSON part. The version it replaces is kept in history/ first. */
function writeJsonPart(dir, file, doc, now, written) {
  const target = path.join(dir, file), next = JSON.stringify(doc, null, 1) + '\n', prev = readText(target);
  if (prev === next) return;
  if (prev !== null) { fs.mkdirSync(path.join(dir, 'history'), { recursive: true }); fs.writeFileSync(path.join(dir, 'history', `${stamp(now)}-${file}`), prev); }
  fs.writeFileSync(target, next); written.push(file);
}
function logChanges(dir, changes, now) {
  if (!changes.length) return;
  const file = path.join(dir, 'history', 'changes.md'), old = (readText(file) || '# Changes\n\nWhat each capture found different from the one before, newest first.\n').trimEnd().split('\n');
  const at = old.findIndex((l) => l.startsWith('## ')), head = at < 0 ? old : old.slice(0, at), rest = at < 0 ? [] : old.slice(at);
  const block = [`## ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC`, '', ...changes.slice(0, 20).map((c) => `- ${c.text}${c.source ? ` (${shortSource(c.source)})` : ''}`), ...(changes.length > 20 ? [`- and ${changes.length - 20} more`] : []), ''];
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, [...head, ...(head.at(-1) === '' ? [] : ['']), ...block, ...rest].join('\n').trimEnd() + '\n');
}
/**
 * Build or update the brand file from what the context folder holds: the raw capture, and (with `everything`)
 * the older written files and an old eight-file folder. New values are merged in; nothing on file is overwritten.
 */
export function syncBrandFile(ctx, { now = new Date(), dna, everything = false, from = null, recaptured = null } = {}) {
  const dir = brandDir(ctx), before = readAll(ctx), written = [], mapping = [], changes = [];
  fs.mkdirSync(path.join(dir, 'history'), { recursive: true });
  dna = dna === undefined ? readJson(path.join(ctx, 'brand-dna.json')) : dna;
  const pages = capturePages(dna), site = (dna && (dna.source || pages[0]?.url)) || before.facts?.site || null;
  const read = recaptured ? new Set(recaptured) : new Set(pages.map((p) => p.url));
  let offers = before.offers?.offers || [], facts = before.facts?.facts || [];
  const known = new Set([...offers, ...facts].filter((r) => r.from === 'capture').map((r) => r.source));
  const merge = (incoming, label, opts = {}) => {
    const inOffers = incoming.filter((r) => FAST_KINDS.includes(r.kind)), inFacts = incoming.filter((r) => !FAST_KINDS.includes(r.kind));
    const a = mergeRecords(offers, inOffers, { now, known, recaptured: opts.recaptured, report: !!before.offers && opts.report !== false });
    const b = mergeRecords(facts, inFacts, { now, known, recaptured: opts.recaptured, report: !!before.facts && opts.report !== false });
    offers = a.records; facts = b.records; changes.push(...a.changes, ...b.changes);
    if (before.offers && opts.report !== false) for (const url of new Set([...a.newPages.keys(), ...b.newPages.keys()])) { const n = (a.newPages.get(url) || 0) + (b.newPages.get(url) || 0); changes.push({ at: day(now), text: `New page read, ${n} line${n === 1 ? '' : 's'} added`, source: url }); }
    mapping.push(`${label} -> ${inOffers.length} line${inOffers.length === 1 ? '' : 's'} in offers.json, ${inFacts.length} in facts.json${incoming.some((r) => !r.captured_at) ? ` (${incoming.filter((r) => !r.captured_at).length} with no date: stale until rechecked)` : ''}`);
  };
  const voice = readMd(path.join(dir, 'voice.md'), VOICE_HEAD, VOICE_SECTIONS), refs = readMd(path.join(dir, 'references.md'), REF_HEAD, REF_SECTIONS);
  let voiceTouched = false, refsTouched = false, look = before.look;
  if (pages.length) {
    const fromCapture = recordsFromCapture(dna);
    merge([...fromCapture.offers, ...fromCapture.facts], 'context/brand-dna.json', { recaptured: read });
    const v = voiceFromCapture(dna), nv = upsertEntries(sectionOf(voice, 'Brand lines'), v.lines) + upsertEntries(sectionOf(voice, 'Button words'), v.buttons);
    voiceTouched = v.lines.length + v.buttons.length > 0; mapping.push(`context/brand-dna.json -> voice.md (${v.lines.length} lines, ${v.buttons.length} button words, ${nv} new)`);
    const fresh = lookFromCapture(dna);
    if (fresh) {
      const was = before.look, h1 = (l) => l?.type?.roles?.h1?.family, fill = (l) => l?.buttons?.primary?.bg, top = (l) => l?.palette?.[0]?.hex;
      if (was) for (const [name, get] of [['Headline font', h1], ['Primary button fill', fill], ['Largest colour', top]]) if (get(was) && get(fresh) && get(was) !== get(fresh)) changes.push({ at: day(now), text: `${name} changed: ${get(was)} → ${get(fresh)}`, source: fresh.source });
      look = { schema: SCHEMA, part: 'look', site, raw: 'context/brand-dna.json', screenshots: 'context/screenshots/', ...fresh, notes: was?.notes || [] };
      mapping.push('context/brand-dna.json -> look.json (palette, type, shape, buttons, menu, footer, imagery, section order)');
    }
  }
  for (const r of dna?.references || []) {
    const sec = sectionOf(refs, r.kind === 'avoid' ? 'Avoid' : r.kind === 'admire' ? 'Admired' : 'Competitors'), at = sec.lines.findIndex((l) => l.startsWith(`- ${r.url} |`));
    if (at < 0) sec.lines.push(referenceLine(r)); else sec.lines[at] = referenceLine(r);
    refsTouched = true;
  }
  if (dna?.references?.length) mapping.push(`context/brand-dna.json references -> references.md (${dna.references.length} site${dna.references.length === 1 ? '' : 's'}: look and headline lines only)`);
  if (everything) {
    const carry = (doc, title, text) => { const sec = sectionOf(doc, title); for (const l of String(text).split(/\r?\n/).map((x) => x.trimEnd()).filter((x) => x.trim() && !/^#\s/.test(x))) { const line = /^\s*[-*]\s/.test(l) ? l.replace(/^\s*[*-]\s+/, '- ') : /^#{2,}\s/.test(l) ? `- ${l.replace(/^#+\s+/, '')}:` : `- ${l.trim()}`; if (!sec.lines.includes(line)) sec.lines.push(line); } };
    const md = (name) => readText(path.join(ctx, name));
    // context/facts.md may be a slice this tool printed for an earlier job: that is output, not a source.
    const factsMd = /^BRAND FILE SLICE:/.test(md('facts.md') || '') ? null : md('facts.md'); if (factsMd) merge(recordsFromMarkdown(factsMd, { file: 'context/facts.md' }), 'context/facts.md', { report: false });
    const voiceMd = md('voice.md');
    if (voiceMd) {
      const fileDate = findDate(voiceMd.split(/\r?\n/).slice(0, 6).join(' ')); let customer = false; const mine = [], theirs = [];
      for (const l of voiceMd.split(/\r?\n/)) { if (/^#/.test(l)) { customer = /customer|review|buyer|their/i.test(l); continue; } const t = l.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '').trim(); if (t.length < 4) continue; const quoted = /["“]([^"”]{4,})["”]/.exec(t); (customer ? theirs : mine).push({ text: cut(quoted ? quoted[1] : t.replace(/\s*\((?:source|from)[^)]*\)\s*$/i, ''), 220), kind: customer ? 'customer' : 'line', source: /https?:\/\/[^\s)|]+/.exec(t)?.[0] || 'context/voice.md', date: findDate(t) || fileDate }); }
      upsertEntries(sectionOf(voice, 'Brand lines'), mine); upsertEntries(sectionOf(voice, 'Customer words'), theirs); voiceTouched = true;
      mapping.push(`context/voice.md -> voice.md (${mine.length} brand lines, ${theirs.length} customer lines)`);
    }
    const refMd = md('references.md'); if (refMd) { carry(refs, 'Notes', refMd); refsTouched = true; mapping.push('context/references.md -> references.md (kept under Notes)'); }
    const taste = md('taste-brief.md');
    if (taste) {
      for (const l of taste.split(/\r?\n/).map((x) => x.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '').trim()).filter((x) => x.length > 3 && !/^#/.test(x))) {
        const title = /\bavoid|\bnot like\b|\bstay away\b/i.test(l) ? 'Avoid' : /\badmire|\breference|\blike\b|\binspir/i.test(l) ? 'Admired' : 'Notes', line = `- ${l} | context/taste-brief.md | ${findDate(l) || findDate(taste.slice(0, 300)) || 'no date'}`;
        const sec = sectionOf(refs, title); if (!sec.lines.includes(line)) sec.lines.push(line);
      }
      refsTouched = true; mapping.push('context/taste-brief.md -> references.md (admired, avoid, and brand codes under Notes)');
    }
    const old = findOldFolder(ctx, from);
    if (old) {
      const rel = slash(path.relative(process.cwd(), old) || old), keep = path.join(dir, 'history', `${stamp(now)}-${path.basename(old)}`), text = (f) => readText(path.join(old, f));
      fs.mkdirSync(keep, { recursive: true });
      for (const f of [...OLD_INDEX, ...OLD_FILES]) { const t = text(f); if (t !== null) fs.writeFileSync(path.join(keep, f), t); }
      for (const [f, kind] of [['business.md', 'fact'], ['offers.md', 'product'], ['customers.md', 'customer'], ['proof-and-claims.md', 'claim']]) { const t = text(f); if (t) merge(recordsFromMarkdown(t, { file: `${rel}/${f}`, fallbackKind: kind }), `${rel}/${f}`, { report: false }); }
      const vl = text('voice-and-look.md');
      if (vl) {
        const lookNotes = [], voiceNotes = [];
        for (const l of vl.split(/\r?\n/).map((x) => x.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '').trim()).filter((x) => x.length > 3 && !/^#/.test(x))) (/#[0-9a-f]{3,8}\b|\bcolou?r|\bfont|\btypeface|\blogo\b|\bphoto|\bimage|\bradius|\bbutton/i.test(l) ? lookNotes : voiceNotes).push(l);
        look = look || { schema: SCHEMA, part: 'look', site, captured_at: null, source: `${rel}/voice-and-look.md`, palette: [], notes: [] };
        look.notes = [...new Set([...(look.notes || []), ...lookNotes.map((l) => `${l} (${rel}/voice-and-look.md)`)])];
        const sec = sectionOf(voice, 'Notes'); for (const l of voiceNotes) if (!sec.lines.includes(`- ${l}`)) sec.lines.push(`- ${l}`); voiceTouched = true;
        mapping.push(`${rel}/voice-and-look.md -> ${lookNotes.length} look notes in look.json, ${voiceNotes.length} voice notes in voice.md`);
      }
      const market = text('market.md'); if (market) { carry(refs, 'Competitors', market); refsTouched = true; mapping.push(`${rel}/market.md -> references.md (Competitors)`); }
      const log = text('log.md');
      if (log) {
        const worked = readMd(path.join(dir, 'worked.md'), WORKED_HEAD, []), title = `Carried over from ${rel}/log.md`;
        if (!worked.sections.some((x) => x.title === title)) { carry(worked, title, log); fs.writeFileSync(path.join(dir, 'worked.md'), writeMd(worked)); written.push('worked.md'); }
        mapping.push(`${rel}/log.md -> worked.md`);
      }
      mapping.push(`${rel}/${OLD_INDEX.find((f) => text(f) !== null) || '(no start file)'} -> replaced by ${FOLDER}/${INDEX_FILE}; the old folder is copied to ${FOLDER}/history/${path.basename(keep)}/`);
    }
  }
  const business = before.facts?.business || (site && isUrl(site) ? new URL(site).hostname.replace(/^www\./, '') : null), checked = pages.length ? now.toISOString() : null;
  if (pages.length || offers.length || before.offers) writeJsonPart(dir, 'offers.json', { schema: SCHEMA, part: 'offers', business, site, checked_at: checked || before.offers?.checked_at || null, offers }, now, written);
  if (pages.length || facts.length || before.facts) writeJsonPart(dir, 'facts.json', { schema: SCHEMA, part: 'facts', business, site, checked_at: checked || before.facts?.checked_at || null, facts }, now, written);
  if (look) writeJsonPart(dir, 'look.json', look, now, written);
  const writeDoc = (file, doc, touched) => { const next = writeMd(doc); if (touched && readText(path.join(dir, file)) !== next) { fs.writeFileSync(path.join(dir, file), next); written.push(file); } };
  writeDoc('voice.md', voice, voiceTouched); writeDoc('references.md', refs, refsTouched);
  logChanges(dir, changes, now); writeIndex(ctx, now);
  return { dir: slash(path.relative(process.cwd(), dir) || dir), written: [...new Set(written)], mapping, changes };
}
/** Record what the client kept, killed or asked for more of on one job. Newest first. */
export function learn(ctx, { job, kept, killed, more, now = new Date() } = {}) {
  if (!job || !String(job).trim()) throw new Error('learn needs --job <name>.');
  if (![kept, killed, more].some((v) => v && String(v).trim())) throw new Error('learn needs at least one of --kept, --killed or --more.');
  const dir = brandDir(ctx), file = path.join(dir, 'worked.md'); fs.mkdirSync(dir, { recursive: true });
  const doc = readMd(file, WORKED_HEAD, []), one = (v) => String(v).replace(/\s+/g, ' ').trim();
  doc.sections.unshift({ title: `${day(now)} | ${one(job)}`, lines: [kept && `- Kept: ${one(kept)}`, killed && `- Killed: ${one(killed)}`, more && `- More of: ${one(more)}`].filter(Boolean) });
  fs.writeFileSync(file, writeMd(doc)); writeIndex(ctx, now);
  return { file: slash(path.relative(process.cwd(), file) || file), entry: doc.sections[0] };
}

// ---------- slices: only what the job needs, newest first, stale lines set apart ----------
const recLine = (r) => `- ${r.kind}: ${cut(r.value, 150)} (${shortSource(r.source)}, ${day(r.captured_at || '') || 'no date'})`;
function lookLines(look) {
  if (!look) return [];
  const r = look.type?.roles || {}, role = (k) => (r[k] ? `${k} ${[r[k].family, r[k].weight, r[k].size, r[k].transform].filter(Boolean).join(' ')}${r[k].font_loaded === false ? ' (font did not load)' : ''}` : null), p = look.buttons?.primary;
  const accent = (look.palette || []).find((c) => (c.roles || []).includes('accent'));
  return [
    (look.palette || []).length && `- Colour by page area: ${look.palette.slice(0, 6).map((c) => `${c.hex} ${pct(c.area_share)} ${(c.roles || []).slice(0, 2).join('/')}`).join('; ')}.${accent ? ` Accent ${accent.hex} stays near ${pct(accent.area_share)}.` : ''}`,
    look.pixel_palette && `- Photos cover ${pct(look.pixel_palette.image_share)} of the page.`,
    ['h1', 'h2', 'body', 'button', 'nav'].some((k) => r[k]) && `- Type: ${['h1', 'h2', 'body', 'button', 'nav'].map(role).filter(Boolean).join('; ')}.${look.type.font_css ? ` Fonts load from ${cut(look.type.font_css, 80)}.` : ''}`,
    look.shape && `- Shape: radius ${(look.shape.radius || []).map((x) => `${x.value} x${x.count}`).join(', ') || 'square'}; shadows ${(look.shape.shadows || []).length ? look.shape.shadows.map((s) => cut(s, 40)).join(' / ') : 'none'}; ${look.shape.square_elements ?? '?'} of ${look.shape.painted_elements ?? '?'} elements square.`,
    p && `- Primary button: ${p.bg || 'no'} fill, ${p.color} text, radius ${p.radius}${p.transform && p.transform !== 'none' ? `, ${p.transform}` : ''}, ${[p.font, p.weight, p.size].filter(Boolean).join(' ')}${(p.examples || []).length ? `, e.g. "${p.examples.slice(0, 2).join('", "')}"` : ''}.`,
    look.nav && `- Menu: ${(look.nav.items || []).slice(0, 10).join(' / ') || 'icons only'}${look.nav.hamburger ? ' (menu button)' : ''}. Footer: ${look.footer ? `${look.footer.columns.length} columns: ${look.footer.columns.slice(0, 6).join(' / ')}` : 'not found'}.`,
    ...Object.entries(look.imagery || {}).slice(0, 3).map(([k, v]) => v?.count != null && `- Imagery ${k}: ${v.count} images, ${v.per_1000px} per 1000 px, ${pct(v.area_share)} of area.`),
    ...Object.entries(look.sections || {}).slice(0, 2).map(([k, v]) => v.length && `- Section order ${k}: ${v.join(' > ')}.`),
    ...(look.notes || []).slice(0, 6).map((n) => `- Note: ${cut(n, 160)}`),
  ].filter(Boolean);
}
/** The text of one slice. Stale and unconfirmed lines are listed apart, so they are rechecked and not used as facts. */
export function sliceText(ctx, level, { now = new Date(), kind = null } = {}) {
  if (!SLICES.includes(level)) throw new Error(`Unknown slice "${level}". Use one of: ${SLICES.join(', ')}.`);
  if (level === 'none') return { ok: true, text: `BRAND FILE SLICE: none${kind ? ` (for ${aJob(kind)})` : ''}\nThis job needs no brand file. Skip capture. Work from the system, files or data.` };
  const all = readAll(ctx), s = statusOf(ctx, { now, kind, level });
  if (!all.exists) return { ok: false, text: [`BRAND FILE SLICE: ${level}`, `There is no brand file at ${s.dir} yet, so there is nothing to take.`, ...s.next.map((n) => `- ${n}`)].join('\n') };
  const caps = CAPS[level], sells = SELLING_KINDS.includes(kind), rank = (r) => (sells ? ['stock', 'price', 'offer', 'shipping'].indexOf(r.kind) : 0);
  // Newest day first. Within a day: a named product line, then a full sentence, then bare prices and menu labels.
  const weight = (r) => (/^(price|stock|review):[^:]+$/.test(r.id || '') ? 0 : words(r.value) >= 4 ? 1 : 2);
  const byNewest = (a, b) => String(day(b.captured_at || '') || '').localeCompare(String(day(a.captured_at || '') || '')) || weight(a) - weight(b) || rank(a) - rank(b);
  const once = (list) => { const seen = new Set(); return [...list].sort(byNewest).filter((r) => !seen.has(r.value) && seen.add(r.value)); };
  const offers = once(live(all.offers?.offers)), facts = once(live(all.facts?.facts)), stale = [...offers, ...facts].filter((r) => isStale(r, now));
  const unconfirmed = [...(all.offers?.offers || []), ...(all.facts?.facts || [])].filter((r) => r.status === 'unconfirmed' || r.status === 'banned');
  const blocks = [];
  const add = (id, head, lines, file) => { if (lines.length && caps[id]) blocks.push({ id, head, lines, file }); };
  add('worked', 'WHAT WORKED BEFORE (read first; worked.md, newest first)', (all.worked?.sections || []).slice(0, 4).map((x) => `- ${x.title}: ${x.lines.map((l) => l.replace(/^- /, '')).join('; ')}`), 'worked.md');
  add('offers', 'LIVE OFFERS: prices, promotions, stock, shipping (fresh for 7 days)', offers.filter((r) => !isStale(r, now)).sort(byNewest).map((r) => recLine(r, now)), 'offers.json');
  add('facts', 'FACTS (fresh for 90 days)', facts.filter((r) => !isStale(r, now)).sort(byNewest).map((r) => recLine(r, now)), 'facts.json');
  if (all.voice && caps.voice) {
    const sec = (t) => sectionOf(all.voice, t).lines.map(parseEntry), lines = sec('Brand lines').sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    const dated = lines.filter((e) => e.date && !isStale({ captured_at: e.date, volatile: 'slow' }, now)), old = lines.filter((e) => !dated.includes(e));
    const full = (list) => [...list.filter((e) => words(e.text) >= 3), ...list.filter((e) => words(e.text) < 3)]; // one-word menu labels last
    const pick = [...full(dated.filter((e) => e.kind === 'headline')).slice(0, 4), ...full(dated.filter((e) => e.kind !== 'headline')).slice(0, 5)];
    add('voice', 'VOICE: real lines to match by ear, never to paste as new copy', [
      ...pick.map((e) => `- "${e.text}" (${e.kind}, ${shortSource(e.source)}, ${e.date})`),
      sec('Button words').length && `- Button words: ${sec('Button words').slice(0, 10).map((e) => e.text).join(' / ')}`,
      ...sec('Customer words').slice(0, 3).map((e) => `- Customer, not the brand: "${cut(e.text, 140)}" (${shortSource(e.source)}, ${e.date || 'no date'})`),
      ...sec('Notes').slice(0, 5).map((e) => `- Note: ${cut(e.text, 140)}`),
      old.length && `- ${old.length} older or undated line${old.length === 1 ? '' : 's'} left out: read the page again before you lean on them.`,
    ].filter(Boolean), 'voice.md');
  }
  if (all.look && caps.look) add('look', `LOOK (measured ${day(all.look.captured_at || '') || 'on no known date'} from ${shortSource(all.look.source)}${isStale({ captured_at: all.look.captured_at, volatile: 'slow' }, now) ? '; STALE, capture the site again before you design from it' : ''}; full numbers in context/brand-dna.json, screenshots in context/screenshots/)`, lookLines(all.look), 'look.json');
  if (caps.references) {
    const kept = (all.references?.sections || []).flatMap((x) => x.lines.filter((l) => /^- /.test(l)).slice(0, 4).map((l) => `- ${x.title}: ${cut(l.replace(/^- /, ''), 200)}`));
    add('references', 'REFERENCES (kept between jobs; add new ones to references.md)', kept.length ? kept : ['- None kept yet. Add the sites the client admires and avoids to references.md, or capture them with --admire, --avoid or --competitor, so the next job has them.'], 'references.md');
  }
  add('recheck', `RECHECK BEFORE USE: stale or undated, so not facts yet (${stale.length})`, stale.sort(byNewest).map((r) => `- STALE ${r.kind}: ${cut(r.value, 110)} (${shortSource(r.source)}, ${r.captured_at ? `${day(r.captured_at)}, ${ageDays(r.captured_at, now)} days old` : 'no date'})`), 'offers.json and facts.json');
  add('unconfirmed', 'NOT CONFIRMED: never use as fact', unconfirmed.map((r) => `- ${r.status === 'banned' ? 'BANNED: ' : ''}${cut(r.value, 100)} ${r.status === 'banned' ? '' : r.note || ''}`.trim()), 'facts.json');
  const head = [`BRAND FILE SLICE: ${level}${kind ? ` for ${aJob(kind)}` : ''} | ${s.business || s.site || 'unnamed'} | read ${s.today}`, 'Use only what is below. Every line has its source and the date it was read.'];
  const fastStale = stale.filter((r) => FAST_KINDS.includes(r.kind)).length;
  if (fastStale && sells) head.push(`STOP: ${fastStale} price, offer, stock or shipping line${fastStale === 1 ? ' is' : 's are'} stale. ${s.next[0]}`);
  const missing = SLICE_PARTS[level].filter((id) => s.parts.find((p) => p.id === id).state === 'missing');
  if (missing.length) head.push(`MISSING: ${missing.join(', ')}. ${s.next.find((n) => /capture|by hand/i.test(n)) || ''}`.trim());
  const out = [...head]; let left = SLICE_WORDS[level] - words(head.join(' ')), carry = 0;
  for (const b of blocks) {
    let room = Math.min(left, caps[b.id] + carry) - words(b.head), shown = 0; if (room < 12) continue;
    const lines = [];
    for (const l of b.lines) { const w = words(l); if (w > room - 6) break; lines.push(l); room -= w; shown++; }
    if (!shown) continue;
    if (shown < b.lines.length) { lines.push(`- (${b.lines.length - shown} more in ${b.file})`); room -= 5; }
    const used = words(b.head) + lines.reduce((n, l) => n + words(l), 0);
    carry = Math.max(0, caps[b.id] + carry - used); left -= used; out.push('', b.head, ...lines);
  }
  return { ok: true, text: out.join('\n'), words: words(out.join(' ')) };
}

// ---------- command line ----------
function parseArgs(argv) {
  const o = { _: [], dir: 'context' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') o.help = true; else if (a === '--json') o.json = true;
    else if (['--dir', '--for', '--today', '--job', '--kept', '--killed', '--more', '--from'].includes(a)) { if (argv[i + 1] === undefined) throw new Error(`${a} needs a value.`); o[a.slice(2)] = argv[++i]; }
    else if (a.startsWith('--')) throw new Error(`Unknown option ${a}. Run with --help.`);
    else o._.push(a);
  }
  return o;
}
const HELP = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(0, 26).map((l) => l.replace(/^\/\/ ?/, '')).join('\n');
export function main(argv = process.argv.slice(2), print = console.log) {
  let o; try { o = parseArgs(argv); } catch (e) { console.error(e.message); return 2; }
  const cmd = o._[0];
  if (o.help || !cmd) { print(HELP); return o.help ? 0 : 2; }
  const ctx = path.resolve(o.dir), asOf = o.today, now = asOf ? new Date(/T/.test(asOf) ? asOf : `${asOf}T12:00:00Z`) : new Date();
  if (Number.isNaN(now.getTime())) { console.error('--today must be a date such as 2026-11-10.'); return 2; }
  if (o.for && !(o.for in SLICE_BY_KIND)) { console.error(`Unknown kind "${o.for}". Use one of: ${Object.keys(SLICE_BY_KIND).join(', ')}.`); return 2; }
  try {
    if (cmd === 'status') {
      const s = statusOf(ctx, { now, kind: o.for || null });
      if (s.exists) writeIndex(ctx, now);
      print(o.json ? JSON.stringify(s, null, 1) : statusText(s)); return s.ok ? 0 : 1;
    }
    if (cmd === 'slice') {
      const level = o._[1] || (o.for ? SLICE_BY_KIND[o.for] : null);
      if (!level) { console.error(`Say which slice: ${SLICES.join(', ')}. Or give --for <kind> and the right one is chosen.`); return 2; }
      const r = sliceText(ctx, level, { now, kind: o.for || null }); print(r.text); return r.ok ? 0 : 1;
    }
    if (cmd === 'learn') { const r = learn(ctx, { job: o.job, kept: o.kept, killed: o.killed, more: o.more, now }); print(`Added to ${r.file}:\n## ${r.entry.title}\n${r.entry.lines.join('\n')}`); return 0; }
    if (cmd === 'migrate') {
      const r = syncBrandFile(ctx, { now, everything: true, from: o.from || null });
      if (!r.mapping.length) { print(`Nothing to build from in ${slash(path.relative(process.cwd(), ctx) || ctx)}: no brand-dna.json, facts.md, voice.md, references.md, taste-brief.md or old brand folder.`); return 1; }
      print([`Brand file at ${r.dir} (${r.written.length ? `wrote ${r.written.join(', ')}` : 'already up to date'}). What went where:`, ...r.mapping.map((m) => `- ${m}`), ...(r.changes.length ? ['Changed since last time:', ...r.changes.slice(0, 12).map((c) => `- ${c.text}`)] : []), `Now run: node ${toolPath('brand-file.mjs')} status`].join('\n')); return 0;
    }
    console.error(`Unknown command "${cmd}". Use status, slice, learn or migrate.`); return 2;
  } catch (e) { console.error(e.message); return 2; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
