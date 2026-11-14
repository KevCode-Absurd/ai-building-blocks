#!/usr/bin/env node
// brand-brain.mjs (AI Blocks, brand-dna-capture) - version 2.1.1
//
// Builds the two layers every buyer-facing job stands on, inside context/brand-file/ next to the brand file:
//   foundation/  how the brand talks and looks, what it can claim, who buys and why (slow: fresh for 90 days)
//     voice-bank.md     real lines by kind, from the site, ads, emails, captions and reviews; vocabulary; rhythm
//     messaging.md      pillars, proof bank (each claim with a source), offers allowed, claims not allowed
//     personas.md       2 to 5 buyers, each from evidence
//     why-they-buy.md   reasons, occasions and objections, counted from reviews and comments
//     design.md         the look of the site and of the ads
//     dos-donts.md      do and don't lines, each with its source
//   data/        what the numbers say (fast: fresh for 30 days)
//     segments.md       spend share, revenue share and ROAS index by age, gender, region, placement, device
//     creatives.md      ads joined to their results: what won, what lost, and the pattern
//     funnel.md         click to purchase, with the biggest leak
//   sources.md   every source: provided by the client or public, with its date and whether access worked
//
// Usage:
//   node brand-brain.mjs build --from <folder> [--site <folder of saved pages>]   one command: finds the site pages,
//                      ads, reviews and breakdowns in a folder and fills every part a tool can fill
//   node brand-brain.mjs check [--for <kind>] [--json]     score out of 100, what is missing, where to get it
//   node brand-brain.mjs gate --for <kind>                 pass or fail before buyer-facing work starts and at hand-over
//   node brand-brain.mjs ask [--for <kind>]                 the intake questions, only for what is missing
//   node brand-brain.mjs source <what> <where> --status provided|public|no-access [--note "<fix>"]
//   node brand-brain.mjs ads <file.json|csv> --source library|account|competitor:<name>
//   node brand-brain.mjs reviews <file.json|csv>
//   node brand-brain.mjs segments <breakdown.csv> [more.csv ...]
//   node brand-brain.mjs creatives <ad_results.csv> [--copy <creatives.json|csv>]
//   node brand-brain.mjs plan --n <count> [--out <file>]     the creative matrix: each creative from a segment and a number
//   node brand-brain.mjs voice-check <draft file> [--ads]    each line against the brand's real lines
// Options:
//   --dir <folder>     the context folder (default: ./context)
//   --for <kind>       ad_creative, copy, email, web_page, audit, strategy, plan, analysis, code, ops_doc, other;
//                      plain words work too (ads, page, homepage, email, dashboard); an unknown word asks everything
//   --today <date>     YYYY-MM-DD, for tests
//
// It reads and writes files in the context folder only. It opens no network connection. Needs Node 18+.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const VERSION = '2.1.1';
export const FOLDER = 'brand-file';
const DAY = 864e5;

/** The parts of the brain, what each is worth out of 100, how fresh it must be, and where to get it. */
export const PARTS = Object.freeze([
  { id: 'voice-bank', file: 'foundation/voice-bank.md', layer: 'foundation', points: 15, min: 40, unit: 'real lines', days: 90,
    from: 'the website (capture-brand-dna.mjs), the Ad Library and past ads (ads), emails and Instagram captions', ask: 'old ad copy, emails or captions' },
  { id: 'customer-words', file: 'foundation/why-they-buy.md', layer: 'foundation', points: 10, min: 10, unit: 'customer lines', days: 90,
    from: 'reviews on the site, a reviews export, ad comments (reviews)', ask: 'a reviews export' },
  { id: 'messaging', file: 'foundation/messaging.md', layer: 'foundation', points: 10, min: 5, unit: 'claims with a source', days: 90,
    from: 'facts.json, the site and the ads: write each pillar and claim with its source', ask: 'claims you can and cannot make, and offer limits' },
  { id: 'personas', file: 'foundation/personas.md', layer: 'foundation', points: 10, min: 2, unit: 'personas', days: 90,
    from: 'why-they-buy.md, data/segments.md and store data: write 2 to 5, each citing its evidence', ask: 'who your best customers are' },
  { id: 'design', file: 'foundation/design.md', layer: 'foundation', points: 10, min: 5, unit: 'rules', days: 90,
    from: 'look.json plus the ad images in the Ad Library: text amount and place, framing, fonts and colours in ads', ask: 'a creative folder or Drive link' },
  { id: 'dos-donts', file: 'foundation/dos-donts.md', layer: 'foundation', points: 5, min: 5, unit: 'rules', days: 90,
    from: 'the brand guide, worked.md and the owner', ask: 'anything we must never say or show' },
  { id: 'segments', file: 'data/segments.md', layer: 'data', points: 15, min: 3, unit: 'segments', days: 30,
    from: 'the ad account breakdowns by age, gender, region, placement (segments)', ask: 'read access to the ad account, or an export' },
  { id: 'creatives', file: 'data/creatives.md', layer: 'data', points: 10, min: 5, unit: 'ads with results', days: 30,
    from: 'ad-level results joined to their copy (creatives)', ask: 'read access to the ad account, or an export' },
  { id: 'funnel', file: 'data/funnel.md', layer: 'data', points: 5, min: 1, unit: 'funnel read', days: 30,
    from: 'the account or store numbers: click, view, cart, checkout, purchase', ask: 'store data (Shopify, GA4 or a dashboard)' },
  { id: 'sources', file: 'sources.md', layer: 'foundation', points: 10, min: 3, unit: 'sources', days: null,
    from: 'record each source with source <what> <where> --status', ask: null },
]);

/** Which parts a kind of job needs. A job is never blocked by a part it does not use. */
export const NEEDS = Object.freeze({
  ad_creative: ['voice-bank', 'customer-words', 'messaging', 'personas', 'design', 'dos-donts', 'segments', 'creatives'],
  copy: ['voice-bank', 'customer-words', 'messaging', 'personas', 'dos-donts'],
  email: ['voice-bank', 'customer-words', 'messaging', 'personas', 'dos-donts'],
  web_page: ['voice-bank', 'customer-words', 'messaging', 'personas', 'design', 'dos-donts', 'funnel'],
  audit: ['messaging', 'segments', 'creatives', 'funnel'],
  strategy: ['messaging', 'personas', 'segments', 'creatives', 'customer-words'],
  plan: ['messaging', 'personas', 'segments'],
  analysis: ['segments', 'creatives', 'funnel'],
});
const BUYER_FACING = new Set(['ad_creative', 'copy', 'email', 'web_page']);
/** Plain names agents use for a job, mapped to a kind. An unknown name is treated as buyer-facing, never as "no need". */
const KIND_ALIASES = Object.freeze({
  ad: 'ad_creative', ads: 'ad_creative', creative: 'ad_creative', creatives: 'ad_creative', static: 'ad_creative', statics: 'ad_creative', campaign: 'ad_creative', social: 'ad_creative', post: 'ad_creative', posts: 'ad_creative', video: 'ad_creative',
  page: 'web_page', pages: 'web_page', landing: 'web_page', landing_page: 'web_page', homepage: 'web_page', home_page: 'web_page', website: 'web_page', site: 'web_page', store: 'web_page', product_page: 'web_page',
  emails: 'email', newsletter: 'email', sms: 'email', flow: 'email', flows: 'email',
  caption: 'copy', captions: 'copy', script: 'copy', blog: 'copy', article: 'copy',
  report: 'analysis', dashboard: 'analysis', analytics: 'analysis', data: 'analysis', review: 'audit', cro: 'audit',
});
const NO_BRAND = new Set(['code', 'ops_doc', 'other']);
/** The kind a job name means, and whether it was a name the tool did not know. */
export function kindOf(name) {
  if (!name) return { kind: null, unknown: false };
  const k = String(name).toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (NEEDS[k] || NO_BRAND.has(k)) return { kind: k, unknown: false };
  if (KIND_ALIASES[k]) return { kind: KIND_ALIASES[k], unknown: false };
  return { kind: 'ad_creative', unknown: true };
}
const KINDS_LINE = `Kinds: ${[...Object.keys(NEEDS), ...NO_BRAND].join(', ')} (or a plain word such as ads, page, email, dashboard).`;

// ---------- small helpers ----------
const words = (s) => (String(s || '').match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
const day = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
const brain = (ctx) => path.join(ctx, FOLDER);
const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
const write = (f, text) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text.endsWith('\n') ? text : `${text}\n`); };
const cut = (s, n) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t; };
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const num = (v) => { if (v === null || v === undefined || v === '') return null; if (typeof v === 'number') return Number.isFinite(v) ? v : null; const n = Number(String(v).replace(/[,₹$€£\s]/g, '')); return Number.isFinite(n) ? n : null; };
const median = (a) => { const s = [...a].sort((x, y) => x - y); if (!s.length) return 0; const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const stamp = (now) => `Updated ${day(now)} by brand-brain.mjs ${VERSION}.`;
/** Lines of a brain file that hold content: bullets and table rows, not headings, notes or the header row. */
const contentLines = (text) => (text || '').split('\n').filter((l) => /^\s*(- |\* |\d+\. |\| (?!-|#|Segment|Ad |Theme|Rule|Claim))/.test(l) && !/^\s*- \(/.test(l));
const updatedOf = (text) => { const m = /Updated (\d{4}-\d{2}-\d{2})/.exec(text || ''); return m ? m[1] : null; };

/** Reads CSV text into rows of objects. Handles quotes, commas and newlines inside quotes. */
export function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  const s = String(text || '').replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; continue; }
    if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\n' || c === '\r') { if (c === '\r' && s[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim() !== ''));
  if (!head) return [];
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i] ?? ''])));
}
/** Reads a JSON or CSV file into rows. JSON may be an array, or an object holding one ({data: [...]}, {ads: [...]}). */
export function readRows(file) {
  const text = read(file); if (text === null) throw new Error(`Cannot read ${file}.`);
  if (/\.csv$/i.test(file)) return parseCsv(text);
  const doc = JSON.parse(text);
  if (Array.isArray(doc)) return doc;
  for (const k of ['data', 'ads', 'results', 'rows', 'items', 'reviews', 'insights']) if (Array.isArray(doc?.[k])) return doc[k];
  const arr = Object.values(doc || {}).find(Array.isArray);
  return arr || [];
}
/** The first field of a row whose name matches, flattened to text (arrays, {text}, {body} and nested values). */
function field(row, names) {
  for (const n of names) {
    const key = Object.keys(row).find((k) => k.toLowerCase() === n);
    if (key === undefined) continue;
    const v = flat(row[key]); if (v.length) return v;
  }
  return [];
}
function flat(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v.flatMap(flat);
  if (typeof v === 'object') return flat(v.text ?? v.body ?? v.value ?? v.title ?? v.name ?? null);
  const t = String(v).trim(); return t && t !== '{{product.name}}' ? [t] : [];
}

// ---------- check and ask ----------
/** What the brain has, part by part, scored out of 100, with what to fill and from where. */
export function checkBrain(ctx, { now = new Date(), kind: asked = null } = {}) {
  const kind = kindOf(asked).kind;
  const need = kind && NEEDS[kind] ? new Set(NEEDS[kind]) : null;
  const parts = PARTS.map((p) => {
    const fileAt = path.join(brain(ctx), p.file), text = read(fileAt);
    const have = text === null ? 0 : p.id === 'personas' ? (text.match(/^## /gm) || []).length : ['voice-bank', 'customer-words'].includes(p.id) ? (text.match(/^- "/gm) || []).length : contentLines(text).length;
    // A file written by hand has no stamp: its saved date counts.
    const updated = updatedOf(text) || (text !== null ? day(fs.statSync(fileAt).mtime) : null);
    const age = updated ? Math.floor((now.getTime() - Date.parse(updated)) / DAY) : null;
    const stale = text !== null && p.days !== null && (age === null || age > p.days);
    const state = text === null || have === 0 ? 'missing' : have < p.min ? 'thin' : stale ? 'stale' : 'ok';
    const got = state === 'ok' ? p.points : state === 'missing' ? 0 : Math.round(p.points * Math.min(1, have / p.min) * (stale ? 0.5 : 1));
    return { id: p.id, file: p.file, layer: p.layer, state, have, min: p.min, unit: p.unit, updated, points: got, of: p.points, needed: need ? need.has(p.id) : true, from: p.from, ask: p.ask };
  });
  const score = parts.reduce((n, p) => n + p.points, 0);
  const gaps = parts.filter((p) => p.needed && p.state !== 'ok');
  return { score, parts, gaps, ready: gaps.length === 0, kind, exists: fs.existsSync(brain(ctx)) };
}
export function checkText(r) {
  const out = [`BRAND BRAIN: ${r.score}/100${r.kind ? ` | for ${r.kind.replace('_', ' ')}` : ''} | ${r.ready ? 'READY' : `${r.gaps.length} part${r.gaps.length === 1 ? '' : 's'} to fill first`}`, ''];
  for (const layer of ['foundation', 'data']) {
    out.push(layer === 'foundation' ? 'FOUNDATION (how they talk, look, prove and who buys)' : 'DATA (what the numbers say)');
    for (const p of r.parts.filter((x) => x.layer === layer)) {
      const mark = p.state === 'ok' ? 'ok   ' : p.state === 'missing' ? 'MISS ' : p.state === 'thin' ? 'THIN ' : 'STALE';
      out.push(`  ${mark} ${p.id.padEnd(15)} ${String(p.have).padStart(3)}/${p.min} ${p.unit}${p.updated ? `, ${p.updated}` : ''}${p.needed ? '' : ' (not needed for this job)'}`);
    }
    out.push('');
  }
  if (r.gaps.length) {
    out.push('FILL, IN THIS ORDER (what the client gave you first, then public sources):');
    r.gaps.forEach((g, i) => out.push(`  ${i + 1}. ${g.file}: from ${g.from}.`));
    out.push('', 'Never fill a gap with a guess: a part you cannot fill stays missing and the work says what it lacked.');
  }
  return out.join('\n');
}

/** The intake questions about the brand brain and the client's material: only what is missing, at most four. */
export function askBrain(ctx, { now = new Date(), kind: asked = null } = {}) {
  const { kind, unknown } = kindOf(asked);
  if (kind && NO_BRAND.has(kind)) return { ask: false, questions: [], text: `No brand brain is needed for ${kind.replace('_', ' ')}. Leave it out of your questions.` };
  const r = checkBrain(ctx, { now, kind });
  // Each question only when this kind of job needs the part it fills: an analysis is never asked for a brand brain.
  const q = [], needs = (id) => r.parts.find((p) => p.id === id).needed, gapIds = new Set(r.gaps.map((g) => g.id));
  const foundation = r.parts.some((p) => p.layer === 'foundation' && p.id !== 'sources' && p.needed);
  if (foundation && !r.exists) q.push('Do you have a brand brain (a brand file, guide or folder) I should use? a) Yes: attach it or paste a link b) No: I will build one from your site, ads and reviews, and keep it for every later job');
  else if (foundation && !r.ready) q.push(`I have your brand brain (${r.score}/100). It is missing ${r.gaps.slice(0, 3).map((g) => g.id.replace('-', ' ')).join(', ')}. Shall I a) fill the gaps in place b) make a copy and improve that c) leave it as it is`);
  if ((BUYER_FACING.has(kind) || !kind) && ['voice-bank', 'design', 'customer-words'].some((id) => gapIds.has(id)))
    q.push('What do you already have that I can learn your voice and look from? Any of: old ad copy, a creative folder or Drive link, email exports, a reviews export. Or say "use public" and I will take them from your Ad Library, website and Instagram.');
  if (['segments', 'creatives', 'funnel'].some((id) => needs(id) && gapIds.has(id)))
    q.push('For the numbers, what can I use? a) read access to your ad account or store data (a connector), level 1, I change nothing b) an export you send c) none: I work from public data and say so');
  if (['dos-donts', 'messaging'].some((id) => needs(id) && gapIds.has(id))) q.push('Anything I must never say or show, and the most discount I may offer? (or "you decide")');
  const questions = q.slice(0, 4);
  const note = unknown ? `"${asked}" is not a kind this tool knows, so it asked as for buyer-facing work. ${KINDS_LINE}

` : '';
  const text = questions.length
    ? ['Put these in your one intake message, with the job\'s own questions (five in all at most):', ...questions.map((x, i) => `${i + 1}. ${x}`), '', 'Before you ask, look: files they attached, the project folder, a claude.ai Project, and a brand brain saved to their AI Blocks account. Ask only for what you did not find.', 'Test every link they send. If it does not open, say which one and how to share it (for example "set the Drive folder to anyone with the link"), once. Then use the public fallback and record it with source.']
      .join('\n')
    : `The brand brain is ready for this job (${r.score}/100). Do not ask about it; say in one line that you will use it.`;
  return { ask: questions.length > 0, questions, text: note + text, score: r.score, kind };
}

// ---------- sources ----------
export function addSource(ctx, what, where, { status = 'provided', note = '', now = new Date() } = {}) {
  if (!['provided', 'public', 'no-access'].includes(status)) throw new Error('--status is provided, public or no-access.');
  const f = path.join(brain(ctx), 'sources.md');
  const head = ['# Sources', '', 'Every source the brand brain was built from. provided = the client gave it; public = read from a public page; no-access = asked, could not open.', ''];
  const lines = (read(f) || '').split('\n').filter((l) => /^- /.test(l));
  const line = `- ${what} | ${where} | ${status} | ${day(now)}${note ? ` | ${note}` : ''}`;
  const keep = lines.filter((l) => !l.startsWith(`- ${what} | ${where} |`));
  write(f, [...head, line, ...keep, '', stamp(now)].join('\n'));
  return line;
}

// ---------- ads: copy, hooks and patterns ----------
const HINDI = /\b(aap|aapki|aapke|hai|hain|ka|ki|ke|ko|se|mein|kya|bhi|nahi|sirf|abhi|shaadi|rishta|pyaar|maa|beti|dulhan|tyohar|apna|apni|sabse|naya|nayi|khaas|zaroor|bas)\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;
/** One ad as the tool keeps it: its lines, dates and how long it ran. */
export function adOf(row, now) {
  const body = field(row, ['body', 'primary_text', 'message', 'ad_creative_bodies', 'ad_creative_body', 'text', 'ad_text']);
  const title = field(row, ['title', 'headline', 'ad_creative_link_titles', 'ad_creative_link_title', 'name_headline']);
  const desc = field(row, ['description', 'link_description', 'ad_creative_link_descriptions', 'ad_creative_link_description']);
  const cta = field(row, ['cta', 'call_to_action_type', 'call_to_action', 'cta_type', 'cta_text']);
  const id = field(row, ['ad_archive_id', 'ad_id', 'id', 'library_id'])[0] || '';
  const start = field(row, ['ad_delivery_start_time', 'start_time', 'start_date', 'created_time', 'first_shown'])[0] || '';
  const stop = field(row, ['ad_delivery_stop_time', 'stop_time', 'end_time', 'end_date', 'last_shown'])[0] || '';
  const s = Date.parse(start), e = stop ? Date.parse(stop) : now.getTime();
  const days = Number.isNaN(s) ? null : Math.max(1, Math.round((e - s) / DAY) + 1);
  return { id: String(id), body: [...new Set(body)], title: [...new Set(title)], desc: [...new Set(desc)], cta: [...new Set(cta)], start: Number.isNaN(s) ? '' : day(new Date(s)), active: !stop, days };
}
/** What the brand's ads have in common: length, hooks, CTAs, language, emoji, prices. Numbers, not adjectives. */
export function adPatterns(ads) {
  const bodies = ads.flatMap((a) => a.body);
  const firsts = bodies.map((b) => b.split(/\n|(?<=[.!?])\s/)[0]).filter(Boolean);
  const share = (re, list = bodies) => (list.length ? list.filter((b) => re.test(b)).length / list.length : 0);
  const ctas = {}; for (const a of ads) for (const c of a.cta) ctas[c] = (ctas[c] || 0) + 1;
  const openers = {}; for (const f of firsts) { const k = f.split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ''); if (k) openers[k] = (openers[k] || 0) + 1; }
  return {
    ads: ads.length, bodies: bodies.length,
    body_words_median: median(bodies.map(words)), first_line_words_median: median(firsts.map(words)),
    title_words_median: median(ads.flatMap((a) => a.title).map(words)),
    question_hooks: share(/\?/, firsts), emoji: share(EMOJI), price_shown: share(/(₹|rs\.?\s?\d|inr)/i), hindi_words: share(HINDI), line_breaks: share(/\n/),
    caps_words: share(/\b[A-Z]{4,}\b/), discount: share(/(\d+\s?%|off\b|sale\b|flat\s+\d)/i),
    ctas: Object.entries(ctas).sort((a, b) => b[1] - a[1]).slice(0, 6),
    openers: Object.entries(openers).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, 8),
    proven: ads.filter((a) => (a.days || 0) >= 30).length,
  };
}
/** Takes ads into the voice bank (word for word) and writes their patterns. Long-running ads are marked proven. */
export function ingestAds(ctx, rows, { source = 'library', now = new Date() } = {}) {
  const competitor = /^competitor:/.test(source) ? source.slice('competitor:'.length) : null;
  const ads = rows.map((r) => adOf(r, now)).filter((a) => a.body.length || a.title.length);
  const p = adPatterns(ads);
  const runs = (a) => (a.days ? `${a.days} days${a.active ? ', still running' : ''}${a.days >= 30 ? ', PROVEN' : ''}` : 'dates unknown');
  const ranked = [...ads].sort((a, b) => (b.days || 0) - (a.days || 0));
  const summary = [
    `- ${p.ads} ads, ${p.proven} ran 30 days or more (likely winners: advertisers keep what sells).`,
    `- Primary text: median ${p.body_words_median} words; first line median ${p.first_line_words_median} words; headline median ${p.title_words_median} words.`,
    `- ${pct(p.question_hooks)} open with a question; ${pct(p.emoji)} use emoji; ${pct(p.line_breaks)} use line breaks; ${pct(p.caps_words)} use a word in capitals.`,
    `- ${pct(p.price_shown)} show a price; ${pct(p.discount)} mention a discount or sale; ${pct(p.hindi_words)} use Hindi words in Latin script.`,
    p.ctas.length && `- CTA buttons: ${p.ctas.map(([c, n]) => `${c} (${n})`).join(', ')}.`,
    p.openers.length && `- Repeated openers: ${p.openers.map(([o, n]) => `"${o}" (${n})`).join(', ')}.`,
  ].filter(Boolean);
  if (competitor) {
    const f = path.join(brain(ctx), 'foundation', 'competitors.md');
    const old = (read(f) || '# Competitor ads\n\nWhat others in the category say, to stand apart from, never to copy.\n').split(/\n## /)[0];
    const keep = (read(f) || '').split(/\n(?=## )/).filter((s) => s.startsWith('## ') && !s.startsWith(`## ${competitor}\n`));
    const block = [`## ${competitor}`, ...summary, '', 'Longest-running lines:', ...ranked.slice(0, 8).flatMap((a) => a.body.slice(0, 1).map((b) => `- "${cut(b, 220)}" (${runs(a)})`))].join('\n');
    write(f, [old.trimEnd(), '', ...keep, block, '', stamp(now)].join('\n'));
    return { ads: ads.length, file: 'foundation/competitors.md', patterns: p };
  }
  const f = path.join(brain(ctx), 'foundation', 'voice-bank.md');
  const bank = readBank(f);
  const label = source === 'account' ? 'past ad (ad account)' : 'ad (Ad Library)';
  for (const a of ranked) {
    for (const b of a.body) addBank(bank, 'Ad primary text', b, `${label}${a.id ? ` ${a.id}` : ''}, ${a.start || 'no date'}, ${runs(a)}`);
    for (const t of a.title) addBank(bank, 'Ad headlines', t, `${label}${a.id ? ` ${a.id}` : ''}, ${runs(a)}`);
    for (const d of a.desc) addBank(bank, 'Ad descriptions', d, `${label}${a.id ? ` ${a.id}` : ''}`);
  }
  bank.patterns[source] = summary;
  writeBank(f, bank, now);
  return { ads: ads.length, file: 'foundation/voice-bank.md', patterns: p };
}

// ---------- the voice bank file ----------
const BANK_SECTIONS = ['Website lines', 'Ad primary text', 'Ad headlines', 'Ad descriptions', 'Emails', 'Captions', 'Customer words'];
function readBank(f) {
  const text = read(f) || '';
  const bank = { sections: Object.fromEntries(BANK_SECTIONS.map((s) => [s, []])), patterns: {}, notes: [] };
  let cur = null, pat = null;
  for (const l of text.split('\n')) {
    const h = /^## (.+)$/.exec(l);
    if (h) { cur = h[1].trim(); pat = /^Patterns: (.+)$/.exec(cur)?.[1] ?? null; continue; }
    if (!/^- /.test(l)) continue;
    if (pat) (bank.patterns[pat] ||= []).push(l);
    else if (cur === 'Notes') bank.notes.push(l);
    else if (cur) (bank.sections[cur] ||= []).push(l);
  }
  return bank;
}
const bankKey = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
function addBank(bank, section, text, source) {
  const t = String(text || '').replace(/\s*\n\s*/g, ' / ').trim(); if (words(t) < 2) return;
  const list = (bank.sections[section] ||= []), key = bankKey(t);
  if (list.some((l) => bankKey(/^- "(.*)" \|/.exec(l)?.[1] || '') === key)) return;
  list.push(`- "${t.replaceAll('"', '”')}" | ${source}`);
}
function writeBank(f, bank, now) {
  const all = Object.values(bank.sections).flat();
  const vocab = vocabulary(all.map((l) => /^- "(.*)" \|/.exec(l)?.[1] || ''));
  const out = ['# Voice bank', '', 'Real lines, word for word, each with its source. Match them by ear; never paste one as new copy. Add lines; never reword one.', '',
    `## Vocabulary`, `- Words this brand uses most (not counting common words): ${vocab.slice(0, 40).join(', ') || 'none yet'}`, ''];
  for (const s of Object.keys(bank.sections)) if (bank.sections[s].length) out.push(`## ${s}`, ...bank.sections[s], '');
  for (const [src, lines] of Object.entries(bank.patterns)) out.push(`## Patterns: ${src}`, ...lines, '');
  if (bank.notes.length) out.push('## Notes', ...bank.notes, '');
  out.push(stamp(now));
  write(f, out.join('\n'));
}
const STOP = new Set('a an and are as at be by for from has have i in is it its of on or our so that the this to was we with you your yours us my me will can just more all not no now get one their they them what when who how which into out up do does make made also very than then there here these those it\'s you\'re we\'re let\'s am been being had were would could should may might each every any some'.split(' '));
export function vocabulary(lines) {
  const n = {};
  for (const l of lines) for (const w of new Set((String(l).toLowerCase().match(/[\p{L}][\p{L}'’-]{2,}/gu) || []).filter((x) => !STOP.has(x)))) n[w] = (n[w] || 0) + 1;
  return Object.entries(n).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([w]) => w);
}

// ---------- reviews: customer words, reasons, occasions, objections ----------
export const THEMES = Object.freeze({
  occasion: /\b(gift|gifted|gifting|birthday|anniversary|wedding|marriage|engagement|festival|festive|diwali|rakhi|karwa|eid|christmas|valentine|mother|mom|wife|husband|daughter|sister|friend|daily wear|everyday|office|work wear|party)\b/i,
  quality: /\b(quality|finish|finishing|shine|shiny|polish|weight|heavy|light ?weight|hallmark|hallmarked|certified|certificate|genuine|real|pure|purity|craft|craftsmanship|detail|sturdy|durable)\b/i,
  look: /\b(beautiful|gorgeous|stunning|elegant|pretty|lovely|cute|classy|design|look(?:s|ed)?|style|compliments?|exactly as|same as (?:the )?(?:picture|photo|image))\b/i,
  service: /\b(delivery|delivered|shipping|on time|fast|quick|packag(?:e|ing)|packed|box|support|customer service|team|response|helpful|exchange|return(?:ed)?|refund)\b/i,
  value: /\b(price|priced|worth|value|money|expensive|affordable|cost|cheap|budget|discount|offer|deal)\b/i,
  fit: /\b(size|fit|fits|comfortable|comfort|length|small|big|tight|loose|clasp|lock|screw|irritat\w*|allerg\w*)\b/i,
  trust: /\b(trust|trusted|first time|again|repeat|second|third|recommend|reliable|safe|genuine|cod|cash on delivery)\b/i,
});
const NEGATIVE = /\b(not|never|didn'?t|doesn'?t|disappoint\w*|bad|poor|broke|broken|damaged|late|delay\w*|worst|fake|small(?:er)? than|refund|return(?:ed)?|issue|problem)\b/i;
export function ingestReviews(ctx, rows, { now = new Date() } = {}) {
  const reviews = rows.map((r) => ({
    text: field(r, ['text', 'review', 'body', 'content', 'comment', 'review_text', 'message'])[0] || '',
    rating: num(field(r, ['rating', 'stars', 'score'])[0]),
    date: field(r, ['date', 'created_at', 'created_time', 'review_date'])[0] || '',
    product: field(r, ['product', 'product_title', 'product_name', 'item'])[0] || '',
  })).filter((r) => words(r.text) >= 3);
  const neg = (r) => (r.rating !== null ? r.rating <= 3 : NEGATIVE.test(r.text) && !/\b(not disappointed|no complaints?|never disappoint)/i.test(r.text));
  const themes = Object.entries(THEMES).map(([id, re]) => {
    const hits = reviews.filter((r) => re.test(r.text));
    return { id, n: hits.length, share: reviews.length ? hits.length / reviews.length : 0, pos: hits.filter((r) => !neg(r)), neg: hits.filter(neg) };
  }).sort((a, b) => b.n - a.n);
  const occasions = {};
  for (const r of reviews) for (const m of r.text.toLowerCase().matchAll(new RegExp(THEMES.occasion.source, 'gi'))) occasions[m[0]] = (occasions[m[0]] || 0) + 1;
  const q = (r) => `- "${cut(r.text, 200).replaceAll('"', '”')}"${r.rating !== null ? ` (${r.rating}★` : ' ('}${r.product ? `, ${cut(r.product, 40)}` : ''}${r.date ? `, ${String(r.date).slice(0, 10)}` : ''})`;
  const out = ['# Why they buy', '', `From ${reviews.length} reviews or comments. Counted, not guessed. These are the customers' words, not the brand's: use them for hooks and proof, quoted or close to it.`, '',
    '## Reasons, by how often they come up', '| Theme | Reviews | Share | Negative |', '|---|---|---|---|',
    ...themes.filter((t) => t.n).map((t) => `| ${t.id} | ${t.n} | ${pct(t.share)} | ${t.neg.length} |`), '',
    '## Occasions named', ...Object.entries(occasions).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([o, n]) => `- ${o}: ${n}`), '',
    '## Customer words, by theme'];
  for (const t of themes.filter((x) => x.pos.length)) out.push(`### ${t.id}`, ...t.pos.slice(0, 5).map(q));
  out.push('', '## Objections and complaints (answer these in copy and on the page)', ...themes.flatMap((t) => t.neg.slice(0, 3).map((r) => `${q(r)} [${t.id}]`)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 12), '', stamp(now));
  write(path.join(brain(ctx), 'foundation', 'why-they-buy.md'), out.join('\n'));
  const bf = path.join(brain(ctx), 'foundation', 'voice-bank.md'), bank = readBank(bf);
  for (const r of reviews.filter((x) => !neg(x)).slice(0, 60)) addBank(bank, 'Customer words', cut(r.text, 240), `review${r.rating !== null ? ` ${r.rating}★` : ''}${r.date ? `, ${String(r.date).slice(0, 10)}` : ''}`);
  writeBank(bf, bank, now);
  return { reviews: reviews.length, themes: themes.map((t) => ({ id: t.id, n: t.n })), occasions };
}

// ---------- segments: who pays, and where money is over or under spent ----------
// Ad accounts first, then the breakdowns of any business's own data: store, CRM, billing, course or content exports.
const DIMENSIONS = ['age', 'gender', 'region', 'country', 'dma', 'publisher_platform', 'platform_position', 'impression_device', 'device_platform', 'hourly_stats_aggregated_by_advertiser_time_zone', 'campaign_name', 'adset_name', 'ad_name', 'format', 'state', 'city',
  'channel', 'source', 'medium', 'utm_source', 'utm_campaign', 'plan', 'tier', 'cohort', 'segment', 'industry', 'company_size', 'persona', 'course', 'product_type', 'category', 'topic', 'platform', 'location', 'service'];
const SPEND = ['spend', 'amount_spent', 'cost', 'amount_spent_inr', 'ad_spend', 'cac_spend'];
const REVENUE = ['omni_purchase_values', 'purchase_values', 'website_purchase_values', 'action_values', 'purchase_value', 'purchases_value', 'action_values_purchase', 'action_values_offsite_conversion.fb_pixel_purchase', 'omni_purchase_value', 'revenue', 'conversion_value', 'value', 'purchase_conversion_value', 'website_purchase_value', 'sales', 'net_sales', 'mrr', 'arr', 'bookings', 'deal_value'];
const PURCHASES = ['purchases', 'purchase', 'actions_purchase', 'actions_offsite_conversion.fb_pixel_purchase', 'omni_purchase', 'website_purchases', 'conversions', 'results', 'orders', 'customers', 'signups', 'enrolments', 'enrollments', 'deals_won', 'bookings_count'];
const pick = (row, names) => { for (const n of names) { const k = Object.keys(row).find((x) => x.toLowerCase() === n); if (k !== undefined) { const v = num(row[k]); if (v !== null) return v; } } return null; };
export function segmentRows(rows) {
  if (!rows.length) return { dims: [], rows: [] };
  const dims = DIMENSIONS.filter((d) => Object.keys(rows[0]).some((k) => k.toLowerCase() === d));
  const map = new Map();
  for (const r of rows) {
    const key = dims.map((d) => String(r[Object.keys(r).find((k) => k.toLowerCase() === d)] ?? '').trim() || 'unknown').join(' / ');
    const m = map.get(key) || { segment: key, spend: 0, revenue: 0, purchases: 0 };
    const sp = pick(r, SPEND) || 0, roasCol = pick(r, ['purchase_roas', 'website_purchase_roas', 'roas']);
    m.spend += sp; m.revenue += pick(r, REVENUE) ?? (roasCol !== null ? roasCol * sp : 0); m.purchases += pick(r, PURCHASES) || 0;
    map.set(key, m);
  }
  return { dims, rows: [...map.values()] };
}
/** Spend share, revenue share and ROAS index for each segment, with the flags a media buyer acts on. */
export function scoreSegments(rows, { minPurchases = 10 } = {}) {
  const spend = rows.reduce((n, r) => n + r.spend, 0), revenue = rows.reduce((n, r) => n + r.revenue, 0), roas = spend ? revenue / spend : 0;
  return rows.map((r) => {
    const sShare = spend ? r.spend / spend : 0, rShare = revenue ? r.revenue / revenue : 0, segRoas = r.spend ? r.revenue / r.spend : 0;
    const index = roas ? Math.round((segRoas / roas) * 100) : 0;
    const small = r.purchases < minPurchases || !revenue;
    const flag = !revenue ? 'no revenue column: add one' : small ? 'too small to judge' : index >= 120 && sShare < 0.25 ? 'UNDER-SPENT WINNER: give it more' : index <= 80 && sShare >= 0.05 ? 'OVER-SPENT: cut or fix' : index >= 100 ? 'pays its way' : 'below average';
    return { ...r, spend_share: sShare, revenue_share: rShare, roas: segRoas, index, cpa: r.purchases ? r.spend / r.purchases : null, flag };
  }).sort((a, b) => b.revenue - a.revenue);
}
export function ingestSegments(ctx, files, { now = new Date() } = {}) {
  const f = path.join(brain(ctx), 'data', 'segments.md'), jf = path.join(brain(ctx), 'data', 'segments.json');
  const prev = read(jf) ? JSON.parse(read(jf)) : { tables: {} };
  const tables = { ...prev.tables };
  for (const file of files) {
    const { dims, rows } = segmentRows(readRows(file));
    if (!dims.length) throw new Error(`${path.basename(file)} has no breakdown column (one of ${DIMENSIONS.slice(0, 8).join(', ')}).`);
    tables[dims.join(' x ')] = { file: path.basename(file), read: day(now), rows: scoreSegments(rows) };
  }
  const money = (v) => (v >= 1e7 ? `${(v / 1e7).toFixed(2)} Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(2)} L` : Math.round(v).toLocaleString('en-IN'));
  const out = ['# Segments', '', 'Who pays, from the ad account. Index = segment ROAS / account ROAS x 100. Spend share above revenue share means money is going where it earns less.', ''];
  for (const [dim, t] of Object.entries(tables)) {
    const tot = t.rows.reduce((a, r) => ({ s: a.s + r.spend, v: a.v + r.revenue, p: a.p + r.purchases }), { s: 0, v: 0, p: 0 });
    out.push(`## By ${dim} (${t.file}, read ${t.read}; spend ${money(tot.s)}, revenue ${money(tot.v)}, ROAS ${(tot.s ? tot.v / tot.s : 0).toFixed(2)})`,
      '| Segment | Spend share | Revenue share | ROAS | Index | Purchases | CPA | Read |', '|---|---|---|---|---|---|---|---|',
      ...t.rows.filter((r) => r.spend > 0 || r.revenue > 0).slice(0, 25).map((r) => `| ${r.segment} | ${pct(r.spend_share)} | ${pct(r.revenue_share)} | ${r.roas.toFixed(2)} | ${r.index} | ${Math.round(r.purchases)} | ${r.cpa === null ? '-' : money(r.cpa)} | ${r.flag} |`), '');
  }
  const winners = Object.values(tables).flatMap((t) => t.rows.filter((r) => /WINNER/.test(r.flag)).map((r) => r.segment));
  const over = Object.values(tables).flatMap((t) => t.rows.filter((r) => /OVER/.test(r.flag)).map((r) => r.segment));
  out.push('## What to act on', `- Under-spent winners: ${winners.join('; ') || 'none'}`, `- Over-spent: ${over.join('; ') || 'none'}`, '', stamp(now));
  write(f, out.join('\n'));
  write(jf, JSON.stringify({ updated: day(now), tables }, null, 2));
  return { tables: Object.keys(tables), winners, over };
}

// ---------- creatives: results joined to copy ----------
export function ingestCreatives(ctx, file, { copyFile = null, now = new Date(), minSpendShare = 0.002 } = {}) {
  const rows = readRows(file);
  const copy = new Map();
  if (copyFile) for (const r of readRows(copyFile)) { const a = adOf(r, now); const id = field(r, ['ad_id', 'id'])[0]; if (id) copy.set(String(id), a); }
  const ads = rows.map((r) => {
    const id = String(field(r, ['ad_id', 'id'])[0] || ''), name = field(r, ['ad_name', 'name'])[0] || id;
    const roasCol = pick(r, ['purchase_roas', 'website_purchase_roas', 'roas']);
    const spend = pick(r, SPEND) || 0, revenue = pick(r, REVENUE) ?? (roasCol !== null ? roasCol * spend : 0), purchases = pick(r, PURCHASES) || 0;
    const imp = pick(r, ['impressions']) || 0, clicks = pick(r, ['inline_link_clicks', 'link_clicks', 'link_click', 'clicks']) || 0, v3 = pick(r, ['video_3_sec_watched_actions', 'video_play_actions', '3_second_video_plays', 'video_3s_views']) || 0;
    return { id, name, spend, revenue, purchases, roas: spend ? revenue / spend : 0, ctr: imp ? clicks / imp : 0, hook: imp && v3 ? v3 / imp : null, copy: copy.get(id) || null, format: field(r, ['format', 'creative_type', 'object_type'])[0] || '' };
  });
  const spend = ads.reduce((n, a) => n + a.spend, 0), revenue = ads.reduce((n, a) => n + a.revenue, 0), roas = spend ? revenue / spend : 0;
  const real = ads.filter((a) => spend && a.spend / spend >= minSpendShare && a.purchases >= 3);
  const ranked = [...real].sort((a, b) => b.roas - a.roas);
  const line = (a) => `| ${cut(a.name, 50)} | ${pct(spend ? a.spend / spend : 0)} | ${a.roas.toFixed(2)} | ${roas ? Math.round((a.roas / roas) * 100) : 0} | ${pct(a.ctr)} | ${a.hook === null ? '-' : pct(a.hook)} | ${Math.round(a.purchases)} | ${a.copy ? cut([...a.copy.title, ...a.copy.body].join(' / '), 120) : '-'} |`;
  const head = ['| Ad | Spend share | ROAS | Index | CTR | Hook rate | Purchases | Copy |', '|---|---|---|---|---|---|---|---|'];
  const n = Math.min(10, Math.ceil(ranked.length / 3));
  const out = ['# Creatives', '', `${ads.length} ads in ${path.basename(file)}; ${real.length} had enough spend and purchases to judge (at least ${pct(minSpendShare)} of spend and 3 purchases). Account ROAS ${roas.toFixed(2)}.`, '',
    '## Winners', ...head, ...ranked.slice(0, n).map(line), '', '## Losers (with real spend)', ...head, ...ranked.slice(-n).reverse().filter((a) => !ranked.slice(0, n).includes(a)).map(line), '',
    '## The pattern (write it, from the rows above)', '- What the winners share that the losers lack: hook, product, offer, format, person or not, text amount.', '- Write each pattern with the ads it comes from. A pattern with one ad is a hunch, not a rule.', '', stamp(now)];
  write(path.join(brain(ctx), 'data', 'creatives.md'), out.join('\n'));
  return { ads: ads.length, judged: real.length, winners: ranked.slice(0, n).map((a) => a.name) };
}

// ---------- plan: the creative matrix ----------
/** Splits n creatives across segments by the numbers: most to proven segments, a share to under-spent winners, a few to tests. */
export function planCreatives(ctx, { n = 20, now = new Date() } = {}) {
  const jf = path.join(brain(ctx), 'data', 'segments.json');
  const tables = read(jf) ? JSON.parse(read(jf)).tables : {};
  const pickTable = Object.entries(tables).sort((a, b) => b[0].split(' x ').length - a[0].split(' x ').length || (/age|gender/.test(b[0]) ? 1 : 0) - (/age|gender/.test(a[0]) ? 1 : 0))[0];
  const personas = (read(path.join(brain(ctx), 'foundation', 'personas.md')) || '').match(/^## (.+)$/gm)?.map((h) => h.slice(3)) || [];
  const rows = pickTable ? pickTable[1].rows.filter((r) => !/too small/.test(r.flag)) : [];
  // Proven: pays at or above the account average, biggest revenue first. Never a segment flagged over-spent.
  const proven = rows.filter((r) => r.index >= 100).slice(0, 4), winners = rows.filter((r) => /WINNER/.test(r.flag)).slice(0, 3);
  const fallback = rows.filter((r) => !/OVER/.test(r.flag)).slice(0, 3);
  const slots = [];
  const share = (k) => Math.max(1, Math.round(n * k));
  const take = (list, count, why) => { for (let i = 0; i < count && list.length; i++) { const r = list[i % list.length]; slots.push({ segment: r.segment, why: `${why}: ROAS ${r.roas.toFixed(2)}, index ${r.index}, ${pct(r.revenue_share)} of revenue on ${pct(r.spend_share)} of spend` }); } };
  if (rows.length) {
    take(proven.length ? proven : fallback, share(winners.length ? 0.55 : 0.8), 'Proven');
    take(winners, winners.length ? share(0.3) : 0, 'Under-spent winner');
    while (slots.length < n) slots.push({ segment: 'test: a new angle or a segment with too little data', why: 'Test: keep about 15% of a set for learning' });
  } else while (slots.length < n) slots.push({ segment: 'MISSING: run segments first', why: 'No account data: plan from personas and reviews, and say so' });
  const out = ['# Creative plan', '', `${n} creatives, each from a segment and a number. Fill every blank from the brand brain: the insight from why-they-buy.md or data/creatives.md, the proof from messaging.md, the words from voice-bank.md. A creative with no insight is cut.`,
    pickTable ? `Segments from: data/segments.md, by ${pickTable[0]}.` : 'No segments yet.', personas.length ? `Personas: ${personas.join('; ')}.` : 'No personas yet: write foundation/personas.md first.', '',
    '| # | Segment | Why this segment (the number) | Persona | Insight (their words or a result) | Angle | Format | Proof line (source) | Hook (first 5 to 8 words) |', '|---|---|---|---|---|---|---|---|---|',
    ...slots.slice(0, n).map((s, i) => `| ${i + 1} | ${s.segment} | ${s.why} |  |  |  |  |  |  |`), '',
    'Rules: no two creatives share both an angle and a format. At least 4 different formats, 3 of them native (a notes list, a chat, a comparison table, an explainer, a review card). One local or seasonal moment for each segment the data names. A button on the image in the brand\'s own style from its real ads. Headlines in the brand\'s own font files, passing check-creative-set.mjs probe. Every hook passes voice-check.', '', stamp(now)];
  return { slots: slots.slice(0, n), text: out.join('\n') };
}

// ---------- voice-check: does each line sound like this brand, and like a person? ----------
export const AI_TELLS = Object.freeze([
  [/—|–/, 'a dash: use a full stop or comma'], [/\bfair warning\b/i, '"fair warning" opener'], [/\bwhether you'?re\b/i, '"whether you\'re" formula'],
  [/\b(?:isn'?t|is not|not) just\b[^.]*\bit'?s\b/i, '"not just X, it\'s Y" formula'], [/\b(elevate|elevated|unlock|unleash|delve|tapestry|testament|seamless(?:ly)?|game[- ]changer|look no further|in today'?s|in a world where|curated for you|meticulously|effortless(?:ly)?)\b/i, 'an AI verb or cliché'],
  [/\bsomeone is (?:likely|bound|sure) to ask\b/i, 'a predicted-compliment formula'], [/\b(?:entirely|totally) up to you\b/i, 'a coy aside'], [/\bwe(?:'ve| have) got you covered\b/i, 'a stock line'],
  [/\b(?:say goodbye to|say hello to)\b/i, 'a stock before-after line'], [/\b(?:perfect|ideal) for (?:any|every) occasion\b/i, 'a generic benefit any brand could claim'],
]);
/** Claims about a whole range ("every stone we set", "all our pieces") are where a true-sounding line turns false. */
export const ABSOLUTE_CLAIM = /\b(?:every|all)\s+(?:of\s+)?(?:[\p{L}'’]+\s+){0,2}?(?:stones?|pieces?|gems?|gemstones?|diamonds?|products?|items?|orders?|designs?|rings?|customers?|ingredients?|batch(?:es)?|plans?|users?|clients?|materials?)\b|\b(?:100\s?%|guaranteed|the only|no one else|purest)\b/iu;
export function voiceCheck(ctx, draftText, { ads = false } = {}) {
  const bankText = read(path.join(brain(ctx), 'foundation', 'voice-bank.md')) || '';
  const bankLines = [...bankText.matchAll(/^- "(.*)" \|/gm)].map((m) => m[1]).filter((l) => !/review/.test(l));
  const vocab = new Set(vocabulary(bankLines).slice(0, 300));
  const never = (read(path.join(brain(ctx), 'foundation', 'dos-donts.md')) || '').split('\n').filter((l) => /^- (never|don'?t|avoid)\b/i.test(l))
    .flatMap((l) => [...l.matchAll(/"([^"]{2,40})"/g)].map((m) => m[1].toLowerCase()));
  const sentences = bankLines.flatMap((l) => l.split(/(?<=[.!?])\s+| \/ /)).filter((s) => words(s) >= 2);
  const typical = median(sentences.map(words)) || 12;
  const lines = String(draftText || '').split(/\n+/).map((l) => l.replace(/^\s*(?:[-*>]|\d+\.)\s*/, '').trim()).filter((l) => words(l) >= 3 && !/^#/.test(l) && !/^\|/.test(l));
  const results = lines.map((line) => {
    const fails = [], warns = [];
    for (const [re, why] of AI_TELLS) if (re.test(line)) fails.push(why);
    for (const w of never) if (line.toLowerCase().includes(w)) fails.push(`a never-say from dos-donts.md: "${w}"`);
    const sents = line.split(/(?<=[.!?])\s+/).filter((s) => words(s));
    const longest = Math.max(...sents.map(words));
    if (longest > Math.max(18, typical * 1.8)) warns.push(`a ${longest}-word sentence; this brand's lines run about ${Math.round(typical)} words`);
    const content = (line.toLowerCase().match(/[\p{L}][\p{L}'’-]{2,}/gu) || []).filter((w) => !STOP.has(w));
    const shared = content.filter((w) => vocab.has(w)).length;
    if (vocab.size >= 20 && content.length >= 6 && shared === 0) warns.push('uses none of the brand\'s own words: it could be any brand');
    if (ads && words(sents[0] || '') > 14) warns.push(`the first line is ${words(sents[0])} words; the hook must land in the first 8 to 12`);
    if ((line.match(/,/g) || []).length >= 4 && words(line) > 30) warns.push('a list sentence: split it or cut it');
    const abs = line.match(ABSOLUTE_CLAIM); if (abs) warns.push(`an absolute claim ("${abs[0]}"): check it against the whole range, such as a lab-grown or budget line, and name the source, or soften it`);
    return { line: cut(line, 160), fails, warns, shared, words: words(line) };
  });
  const failed = results.filter((r) => r.fails.length), warned = results.filter((r) => r.warns.length);
  const text = [`VOICE CHECK: ${results.length} lines | ${failed.length} fail | ${warned.length} to look at | brand lines in the bank: ${bankLines.length}${bankLines.length < 40 ? ' (THIN: fill the voice bank first, or this check is weak)' : ''}`,
    ...results.filter((r) => r.fails.length || r.warns.length).map((r) => `${r.fails.length ? 'FAIL' : 'LOOK'} "${r.line}"\n     ${[...r.fails, ...r.warns].join('; ')}`),
    '', 'Then read each line aloud next to 5 real lines from the voice bank. If it would not sit among them, rewrite it.'].join('\n');
  return { ok: failed.length === 0, results, text, bank: bankLines.length };
}


// ---------- build: one command that fills every part a tool can fill ----------
const SKIP_DIRS = /^(node_modules|\.git|images?|screenshots|assets|thumbs?|history|output|helpers|tools|skills|toolbox|knowledge|prompts|workflows|brand-file)$/i;
function walkFiles(dir, out = []) {
  let list = []; try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of list) { const p = path.join(dir, e.name); if (e.isDirectory()) { if (!SKIP_DIRS.test(e.name)) walkFiles(p, out); } else out.push(p); }
  return out;
}
const decode = (t) => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|&#8217;/g, '’').replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/&#8377;|&#x20b9;/gi, '₹').replace(/&[a-z#0-9]+;/gi, ' ');
/** The lines a visitor reads on a saved page: headings, buttons and short paragraphs, word for word. */
export function pageLines(html) {
  const body = String(html || '').replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ');
  const out = [];
  const meta = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i.exec(body); if (meta) out.push({ kind: 'meta', text: decode(meta[1]) });
  for (const m of body.matchAll(/<(h[1-3]|button|a|p|li|figcaption|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(), n = words(text), tag = m[1].toLowerCase();
    if (/^h/.test(tag) ? n >= 2 && n <= 16 : tag === 'button' || tag === 'a' ? n >= 2 && n <= 6 : n >= 5 && n <= 45) out.push({ kind: /^h/.test(tag) ? 'headline' : tag === 'button' || tag === 'a' ? 'button' : 'body', text });
  }
  const seen = new Set(); return out.filter((l) => !/cookie|javascript|©|all rights reserved|log ?in|sign ?in|password/i.test(l.text) && !seen.has(l.text.toLowerCase()) && seen.add(l.text.toLowerCase()));
}
/** The funnel from an account or store summary: each step's rate and the biggest leak. */
export function funnelOf(rows) {
  const STEPS = [['impressions', ['impressions']], ['link clicks', ['link_click', 'inline_link_clicks', 'link_clicks', 'clicks']], ['landing page views', ['landing_page_view', 'landing_page_views']],
    ['add to cart', ['omni_add_to_cart', 'add_to_cart', 'adds_to_cart']], ['checkout started', ['omni_initiated_checkout', 'initiate_checkout', 'checkouts']], ['purchases', PURCHASES]];
  const tot = STEPS.map(([name, keys]) => ({ name, n: rows.reduce((a, r) => a + (pick(r, keys) || 0), 0) })).filter((s) => s.n > 0);
  const steps = tot.map((s, i) => ({ ...s, rate: i ? s.n / tot[i - 1].n : null }));
  const leak = steps.slice(2).reduce((w, s) => (w === null || s.rate < w.rate ? s : w), null);
  return { steps, leak };
}
const STARTERS = {
  'foundation/messaging.md': ['# Messaging', '', '<!-- Write from facts.json, the site, the ads and the reviews. Every claim needs its source in brackets. -->', '', '## Pillars (3 to 5: what the brand stands for, in its own words)', '', '## Proof bank (each claim with its source and date)', '', '## Offers allowed', '', '## Claims not allowed'],
  'foundation/personas.md': ['# Personas', '', '<!-- 2 to 5 buyers. One "## Name: who" heading each. Under it: the evidence (segment numbers from data/segments.md, review quotes from why-they-buy.md), what they buy and for which occasion, the words they use, what stops them. -->'],
  'foundation/design.md': ['# Design', '', '<!-- From look.json (the site) AND the ad images. Numbers, not adjectives: colours with their share, fonts by role, how much text an ad carries and where, product framing (model, flat lay, close-up), logo place, what the best-running ads look like. -->'],
  'foundation/dos-donts.md': ['# Dos and don\'ts', '', '<!-- One rule a line, each with where it came from. Quote never-words so voice-check catches them: - Never: "cheap" (brand guide). -->'],
};
export function buildBrain(ctx, { from, site = null, now = new Date() } = {}) {
  if (!from || !fs.existsSync(from)) throw new Error('build --from <folder>: the folder with the client\'s material (exports, saved pages, ads, reviews).');
  const files = walkFiles(path.resolve(from)), rel = (f) => path.relative(path.resolve(from), f).replace(/\\/g, '/');
  const done = [], skipped = [];
  const tryDo = (what, fn) => { try { const r = fn(); if (r) done.push(`${what}: ${r}`); } catch (err) { skipped.push(`${what}: ${err.message}`); } };
  // The site: saved pages in --site or any folder named website/site/pages.
  const pages = files.filter((f) => /\.html?$/i.test(f) && (site ? path.resolve(f).startsWith(path.resolve(site)) : /(^|\/)(website|site|pages?)\//i.test(rel(f))));
  if (pages.length) tryDo('site pages', () => {
    const bf = path.join(brain(ctx), 'foundation', 'voice-bank.md'), bank = readBank(bf); let n = 0;
    for (const f of pages) for (const l of pageLines(read(f))) { const before = bank.sections['Website lines'].length; addBank(bank, 'Website lines', l.text, `site ${path.basename(f)} (${l.kind})`); n += bank.sections['Website lines'].length - before; }
    writeBank(bf, bank, now); addSource(ctx, 'website pages', `${pages.length} saved pages`, { status: 'provided', now }); return `${n} lines from ${pages.length} pages`;
  });
  // Ads: the brand's Ad Library, competitors, and the account's own creatives.
  // One export may come as both CSV and JSON: read the JSON and skip its CSV twin.
  const twin = (x) => /\.csv$/i.test(x) && files.includes(x.replace(/\.csv$/i, '.json'));
  for (const f of files.filter((x) => /(^|\/)ads\.(json|csv)$/i.test(rel(x)) && /ad-?library/i.test(rel(x)) && !twin(x))) {
    const m = /competitors?\/([^/]+)\//i.exec(rel(f)), source = m ? `competitor:${m[1]}` : 'library';
    tryDo(`ads ${rel(f)}`, () => { const r = ingestAds(ctx, readRows(f), { source, now }); addSource(ctx, m ? `competitor ads (${m[1]})` : 'Ad Library ads', rel(f), { status: 'public', now }); return `${r.ads} ads`; });
  }
  const copyFile = files.find((x) => /(^|\/)creatives\.json$/i.test(rel(x))) || files.find((x) => /(^|\/)creatives\.csv$/i.test(rel(x)));
  if (copyFile) tryDo(`past ads ${rel(copyFile)}`, () => { const r = ingestAds(ctx, readRows(copyFile), { source: 'account', now }); addSource(ctx, 'past ad copy (ad account)', rel(copyFile), { status: 'provided', now }); return `${r.ads} ads`; });
  const adResults = files.find((x) => /(^|\/)ad_totals\.csv$/i.test(rel(x))) || files.find((x) => /(^|\/)ads?_(results|insights)\.csv$/i.test(rel(x)));
  if (adResults) tryDo(`ad results ${rel(adResults)}`, () => { const r = ingestCreatives(ctx, adResults, { copyFile, now }); return `${r.judged} of ${r.ads} ads judged`; });
  // Reviews and comments.
  for (const f of files.filter((x) => /reviews?|comments?|testimonials?/i.test(path.basename(x)) && /\.(csv|json)$/i.test(x)).slice(0, 1))
    tryDo(`reviews ${rel(f)}`, () => { const r = ingestReviews(ctx, readRows(f), { now }); addSource(ctx, 'reviews', rel(f), { status: 'provided', now }); return `${r.reviews} reviews`; });
  // Breakdowns: who pays.
  const breakdowns = files.filter((x) => /breakdown_.*\.csv$/i.test(x) && !/campaign_x|hour/i.test(x));
  if (breakdowns.length) tryDo('segments', () => { const r = ingestSegments(ctx, breakdowns, { now }); addSource(ctx, 'ad account breakdowns', breakdowns.map(rel).join(', '), { status: 'provided', now }); return `${r.tables.length} tables, ${r.winners.length} under-spent winners, ${r.over.length} over-spent`; });
  // The funnel, from a monthly or total summary.
  const summary = files.find((x) => /account_monthly\.csv$/i.test(x)) || files.find((x) => /(account|totals?)\.csv$/i.test(path.basename(x)));
  if (summary) tryDo('funnel', () => {
    const f = funnelOf(readRows(summary)); if (f.steps.length < 3) throw new Error('not enough funnel columns');
    write(path.join(brain(ctx), 'data', 'funnel.md'), ['# Funnel', '', `From ${rel(summary)}.`, '', '| Step | Count | Rate from the step before |', '|---|---|---|',
      ...f.steps.map((s) => `| ${s.name} | ${Math.round(s.n).toLocaleString('en-IN')} | ${s.rate === null ? '-' : pct(s.rate)} |`), '',
      `- Biggest leak after the click: ${f.leak ? `${f.leak.name} (${pct(f.leak.rate)} of the step before)` : 'not enough steps'}.`, '', stamp(now)].join('\n'));
    return `${f.steps.length} steps`;
  });
  // The parts a person writes: start each file so the agent fills it, never leaves it.
  for (const [file, lines] of Object.entries(STARTERS)) { const f = path.join(brain(ctx), file); if (!fs.existsSync(f)) { write(f, lines.join('\n')); done.push(`started ${file}: write it now`); } }
  return { done, skipped, check: checkBrain(ctx, { now, kind: 'ad_creative' }) };
}

// ---------- gate: pass or fail before buyer-facing work ----------
/** The parts buyer-facing work cannot go without. Anything else thin is listed, not blocking. */
const GATE = Object.freeze({ ad_creative: ['voice-bank', 'customer-words', 'messaging', 'personas', 'design'], copy: ['voice-bank', 'customer-words', 'messaging'], email: ['voice-bank', 'customer-words', 'messaging', 'personas'], web_page: ['voice-bank', 'customer-words', 'messaging', 'design'] });
export function gateBrain(ctx, { now = new Date(), kind: asked = null } = {}) {
  const { kind } = kindOf(asked);
  if (!GATE[kind]) return { ok: true, text: `GATE: pass. ${kind ? kind.replace('_', ' ') : 'This job'} is not buyer-facing, so it does not wait on the brand brain.` };
  const r = checkBrain(ctx, { now, kind });
  const block = r.parts.filter((p) => GATE[kind].includes(p.id) && p.state === 'missing');
  const thin = r.parts.filter((p) => p.needed && p.state !== 'ok' && !block.includes(p));
  const lines = [`GATE: ${block.length ? 'FAIL' : 'pass'} for ${kind.replace('_', ' ')} | brand brain ${r.score}/100`];
  if (block.length) lines.push(`Missing: ${block.map((p) => p.file).join(', ')}. Write no buyer-facing line until each exists: run build --from <the client's material>, then write the starter files. A part with no material at all: write what the public sources give, mark it "public", and say so.`);
  if (thin.length) lines.push(`Thin or stale, fill when you can: ${thin.map((p) => `${p.id} ${p.have}/${p.min}`).join(', ')}.`);
  return { ok: block.length === 0, text: lines.join('\n'), score: r.score };
}

// ---------- the command line ----------
function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x.startsWith('--')) { const k = x.slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; a[k] = v; } else a._.push(x);
  }
  return a;
}
const HELP = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(0, 39).map((l) => l.replace(/^\/\/ ?/, '')).join('\n');
export function main(argv = process.argv.slice(2), print = console.log) {
  const a = parseArgs(argv), [cmd, ...rest] = a._;
  const ctx = path.resolve(String(a.dir || 'context')), now = a.today ? new Date(`${a.today}T12:00:00Z`) : new Date(), kind = typeof a.for === 'string' ? a.for : null;
  try {
    switch (cmd) {
      case 'build': { const r = buildBrain(ctx, { from: typeof a.from === 'string' ? a.from : null, site: typeof a.site === 'string' ? a.site : null, now }); print(['BUILT:', ...r.done.map((d) => `- ${d}`), ...(r.skipped.length ? ['SKIPPED:', ...r.skipped.map((d) => `- ${d}`)] : []), '', checkText(r.check)].join('\n')); return 0; }
      case 'gate': { const r = gateBrain(ctx, { now, kind }); print(r.text); return r.ok ? 0 : 1; }
      case 'check': { const r = checkBrain(ctx, { now, kind }); print(a.json ? JSON.stringify(r, null, 2) : checkText(r)); return r.ready ? 0 : 1; }
      case 'ask': { const r = askBrain(ctx, { now, kind }); print(r.text); return 0; }
      case 'source': { if (rest.length < 2) throw new Error('source <what> <where> --status provided|public|no-access'); print(addSource(ctx, rest[0], rest[1], { status: String(a.status || 'provided'), note: typeof a.note === 'string' ? a.note : '', now })); return 0; }
      case 'ads': { if (!rest[0]) throw new Error('ads <file> --source library|account|competitor:<name>'); const r = ingestAds(ctx, readRows(rest[0]), { source: String(a.source || 'library'), now }); print(`Took ${r.ads} ads into ${r.file}. ${r.patterns.proven} ran 30 days or more. Median primary text ${r.patterns.body_words_median} words.`); return 0; }
      case 'reviews': { if (!rest[0]) throw new Error('reviews <file>'); const r = ingestReviews(ctx, readRows(rest[0]), { now }); print(`Read ${r.reviews} reviews into foundation/why-they-buy.md and the voice bank. Top themes: ${r.themes.slice(0, 4).map((t) => `${t.id} ${t.n}`).join(', ')}.`); return 0; }
      case 'segments': { if (!rest.length) throw new Error('segments <breakdown.csv> [more.csv ...]'); const r = ingestSegments(ctx, rest, { now }); print(`Wrote data/segments.md: ${r.tables.join('; ')}. Under-spent winners: ${r.winners.length}. Over-spent: ${r.over.length}.`); return 0; }
      case 'creatives': { if (!rest[0]) throw new Error('creatives <ad_results.csv> [--copy <creatives file>]'); const r = ingestCreatives(ctx, rest[0], { copyFile: typeof a.copy === 'string' ? a.copy : null, now }); print(`Wrote data/creatives.md: ${r.judged} of ${r.ads} ads had enough data to judge.`); return 0; }
      case 'plan': { const r = planCreatives(ctx, { n: Number(a.n) || 20, now }); if (typeof a.out === 'string') { write(path.resolve(a.out), r.text); print(`Wrote ${a.out}: ${r.slots.length} rows to fill.`); } else print(r.text); return 0; }
      case 'voice-check': { if (!rest[0]) throw new Error('voice-check <draft file> [--ads]'); const r = voiceCheck(ctx, read(rest[0]) ?? '', { ads: !!a.ads }); print(r.text); return r.ok ? 0 : 1; }
      default: print(HELP); return cmd ? 2 : 0;
    }
  } catch (err) { print(`brand-brain: ${err.message}`); return 2; }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
