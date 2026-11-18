#!/usr/bin/env node
// org-context.mjs (AI Blocks, brand-dna-capture) - version 3.1.0
//
// Keeps one org context for a business in its own project folder: context/org-context/. Every agent applies its
// knowledge, its rules and its craft to it. It was called the brand brain and the brand file; brand-brain.mjs and
// brand-file.mjs still work and forward here. An older context/brand-file/ folder is still read: move it with migrate.
//
// The sections, and the file that holds each one:
//   1 Brand DNA                  foundation/brand-dna.md      what the org is and stands for: mission, pillars, story
//   2 Customers and avatars      foundation/customers.md      2 to 5 avatars from evidence (was personas.md)
//                                foundation/why-they-buy.md   reasons, occasions and objections, counted from reviews
//   3 Voice and writing style    foundation/voice-bank.md     real lines by kind, own words, never-words, rhythm
//                                voice.md                     real lines from the site, each with its source and date
//   4 How we speak to customers  foundation/customer-talk.md  by channel: greeting, sign-off, how formal, sorry and no
//   5 Design language            foundation/design.md         fonts, colours, logo, layout, imagery, the ads' look
//                                look.json                    palette, type, shapes, buttons (from the capture)
//   6 Markets                    foundation/markets.md        countries, languages, currency, channels, seasons, rules
//   7 Claims allowed and banned  foundation/claims.md         each claim with the proof it needs (was messaging.md)
//   8 Do's and don'ts            foundation/dos-donts.md      one rule a line, each with its source
//   Facts and offers             facts.json, offers.json      lasting facts; prices, offers, stock, shipping (7 days)
//   References and results       references.md, worked.md     admired, avoided, competitors; what the client kept
//   Data                         data/segments.md, data/creatives.md, data/funnel.md   who pays, what won (30 days)
//   Sources                      sources.md                   every source: provided, public or no-access, dated
//   index.md is the one screen; history/ keeps old versions. Store numbers and lessons stay in context/MEMORY.md.
//
// Usage:
//   node org-context.mjs template                    the sections, to fill by hand where Node cannot run
//   node org-context.mjs status [--for <kind>] [--json]
//   node org-context.mjs slice <none|facts|voice|look|full> [--for <kind>] [--out <file>]
//   node org-context.mjs build --from <folder> [--site <folder of saved pages>]   finds the site pages, ads,
//                      reviews and breakdowns in a folder and fills every part a tool can fill
//   node org-context.mjs check [--for <kind>] [--json]     score out of 100, what is missing, where to get it
//   node org-context.mjs gate --for <kind>                 pass or fail before buyer-facing work starts and at hand-over
//   node org-context.mjs ask [--for <kind>]                the intake questions, only for what is missing
//   node org-context.mjs learn --job <name> --kept "<...>" --killed "<...>" --more "<...>"
//   node org-context.mjs migrate [--from <old folder>]     moves context/brand-file/ here; builds from a capture
//   node org-context.mjs import <file or folder>           keep a brand guide, file or folder the client has
//   node org-context.mjs source <what> <where> --status provided|public|no-access [--note "<fix>"]
//   node org-context.mjs bind --owner <id> --workspace <id>  bind this folder; legacy facts still need review
//   node org-context.mjs remember <record.json> --owner <id> --workspace <id>  append scoped source evidence
//   node org-context.mjs resolve --key <fact-key> --action correct|revoke --source <direct-owner-reference>
//                       [--value <corrected-fact>] [--supersedes <decision-id>] --owner <id> --workspace <id>
//   node org-context.mjs memory --owner <id> --workspace <id> [--keys <comma-separated-fact-keys>] [--json]
//   node org-context.mjs intervention-check <jobs/run/intervention.json> --owner <id> --workspace <id>
//                       --brand <id> --platform <name> --account <id>   read-only evidence eligibility
//   node org-context.mjs ads <file.json|csv> --source library|account|competitor:<name>
//   node org-context.mjs reviews <file.json|csv>
//   node org-context.mjs segments <breakdown.csv> [more.csv ...]
//   node org-context.mjs creatives <ad_results.csv> [--copy <creatives.json|csv>]
//   node org-context.mjs plan --n <count> [--out <file>]     the creative matrix: each creative from a segment and a number
//   node org-context.mjs voice-check <draft file> [--ads]    each line against the brand's real lines
// Options:
//   --dir <folder>     the context folder (default: ./context)
//   --for <kind>       ad_creative, copy, email, web_page, support, proposal, audit, strategy, plan, analysis, code, ops_doc, other;
//                      plain words work too for build, check, gate and ask (ads, page, email, dashboard)
//   --today <date>     YYYY-MM-DD, for tests
//   --owner, --workspace  trusted caller identity, required when this context is bound
//   --verified         scoped facts only in a slice; legacy source notes remain on disk
//   --keys <keys>      fact keys this job depends on; other conflicts do not block local drafts
//
// Freshness: prices, offers, stock and shipping go stale after 7 days; data after 30; look, voice and the
// foundation after 90; anything with no date is stale. A stale line is rechecked, never handed over as a fact.
// It reads and writes files in the context folder only. It opens no network connection. Needs Node 18+.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const VERSION = '3.1.0';
/** The folder new work writes. The old one is still read, and migrate moves it. */
export const FOLDER = 'org-context';
export const OLD_FOLDER = 'brand-file';
const ORG_FOLDER = FOLDER;
/** Where the org context is: context/org-context/, or an older context/brand-file/ until it is moved. One home, never two. */
export function orgDir(ctx) {
  const now = path.join(ctx, FOLDER), old = path.join(ctx, OLD_FOLDER);
  return !fs.existsSync(now) && fs.existsSync(old) ? old : now;
}
/** The line that says how to move an older folder, or null when there is none to move. */
export function moveNote(ctx) {
  if (orgDir(ctx) === path.join(ctx, FOLDER)) return null;
  return `Your org context is in the old folder ${path.basename(ctx)}/${OLD_FOLDER}/. It still works. Move it with: node tools/org-context.mjs migrate (it becomes ${path.basename(ctx)}/${FOLDER}/).`;
}
/** Files renamed inside the folder: the new name, then the old one that is still read. */
export const RENAMED_FILES = Object.freeze({ 'foundation/claims.md': 'foundation/messaging.md', 'foundation/customers.md': 'foundation/personas.md' });
/** Reads a part by its new name, or by its old name in a folder made before the rename. */
const readPart = (ctx, file) => { const dir = orgDir(ctx); for (const f of [file, RENAMED_FILES[file]].filter(Boolean)) { try { return { text: fs.readFileSync(path.join(dir, f), 'utf8'), at: path.join(dir, f) }; } catch { /* try the old name */ } } return { text: null, at: path.join(dir, file) }; };
/** Moves an older context/brand-file/ folder to context/org-context/, and renames the two renamed files in it. */
export function moveOldFolder(ctx) {
  const to = path.join(ctx, FOLDER), from = path.join(ctx, OLD_FOLDER), done = [];
  if (!fs.existsSync(from)) return { moved: false, done, note: null };
  if (fs.existsSync(to)) return { moved: false, done, note: `Both ${path.basename(ctx)}/${FOLDER}/ and the old ${path.basename(ctx)}/${OLD_FOLDER}/ exist. The tools use ${FOLDER}/. Copy anything you still need from ${OLD_FOLDER}/ by hand, then delete it.` };
  fs.renameSync(from, to); done.push(`${path.basename(ctx)}/${OLD_FOLDER}/ -> ${path.basename(ctx)}/${FOLDER}/`);
  for (const [now, old] of Object.entries(RENAMED_FILES)) if (fs.existsSync(path.join(to, old)) && !fs.existsSync(path.join(to, now))) { fs.renameSync(path.join(to, old), path.join(to, now)); done.push(`${old} -> ${now}`); }
  return { moved: true, done, note: null };
}
/** The org context's sections, in the order an agent reads them. The template and index.md come from this list. */
export const SECTIONS = Object.freeze([
  { n: 1, title: 'Brand DNA', files: ['foundation/brand-dna.md'], holds: 'What the org is and stands for: its mission, 3 to 5 pillars in its own words, its personality, its story, and what must never change.' },
  { n: 2, title: 'Customers and avatars', files: ['foundation/customers.md', 'foundation/why-they-buy.md'], holds: '2 to 5 avatars, each from evidence (segments, reviews, store data): who they are, what they buy and for which occasion, the words they use, what stops them. Why they buy: reasons, occasions and objections, counted from reviews.' },
  { n: 3, title: 'Voice and writing style', files: ['foundation/voice-bank.md', 'voice.md'], holds: '40 or more real lines, word for word, by kind. The brand\'s own words, the words it never uses, sentence length, reading level and language mix.' },
  { n: 4, title: 'How we speak to customers', files: ['foundation/customer-talk.md'], holds: 'By channel (ads, site, email and SMS, support replies, social comments, chat): how we address customers, greet and sign off, how formal we are, how we say sorry or no, and the words we use for them.' },
  { n: 5, title: 'Design language', files: ['foundation/design.md', 'look.json'], holds: 'Fonts by role, colours with their share, the logo and where it sits, layout, imagery and framing, and what the ads look like. Numbers, not adjectives.' },
  { n: 6, title: 'Markets', files: ['foundation/markets.md'], holds: 'Where they sell (countries, regions, cities), languages, currency, channels (own store, marketplaces, shops), seasons and occasions, and the local rules per market.' },
  { n: 7, title: 'Claims allowed and banned', files: ['foundation/claims.md'], holds: 'Each claim they may make, with the proof it needs and the proof on file (source and date). Each claim they must not make, and why. Offers allowed and the most discount.' },
  { n: 8, title: 'Do\'s and don\'ts', files: ['foundation/dos-donts.md'], holds: 'One rule a line, each with where it came from. Never-words in quotes, so voice-check catches them.' },
  { n: null, title: 'Facts and offers', files: ['facts.json', 'offers.json'], holds: 'Lasting facts: the business, proof, policies. Prices, promotions, stock and shipping, fresh for 7 days.' },
  { n: null, title: 'References and results', files: ['references.md', 'worked.md'], holds: 'Sites admired, avoided and competing. What the client kept, killed or asked for more of, by job and date.' },
  { n: null, title: 'Data', files: ['data/segments.md', 'data/creatives.md', 'data/funnel.md'], holds: 'Who pays and where money is over or under spent, what won and lost, and the biggest funnel leak. Fresh for 30 days.' },
  { n: null, title: 'Sources', files: ['sources.md'], holds: 'Every source: provided by the client, public, or no access, with its date.' },
]);
/** The template: the sections and what goes in each, for a chat app or a first build by hand. */
export function templateText() {
  return ['# Org context: <business name>', '', 'One home for what every agent needs to know about this business. Every line carries its source and date. Store numbers and lessons are not copied here: they live in context/MEMORY.md.', '',
    ...SECTIONS.flatMap((s) => [`## ${s.n ? `${s.n}. ` : ''}${s.title}`, `File: context/${FOLDER}/${s.files.join(`, context/${FOLDER}/`)}`, s.holds, '']),
    '## Store memory', 'File: context/MEMORY.md (MEMORY-TEMPLATE.md). Link it; never copy its numbers or lessons here.'].join('\n');
}
const ORG_HELP = (() => { const t = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n'); return t.slice(1, t.findIndex((l) => l.startsWith('import '))).filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'); })();
const DAY = 864e5;

/** The parts of the org context, what each is worth out of 100, how fresh it must be, and where to get it. */
export const PARTS = Object.freeze([
  { id: 'brand-dna', file: 'foundation/brand-dna.md', layer: 'foundation', points: 5, min: 4, unit: 'lines', days: 90,
    from: 'the about page, the founder story, facts.json and the owner: mission, 3 to 5 pillars in their words, personality, what never changes', ask: 'what your business stands for, in your words' },
  { id: 'voice-bank', file: 'foundation/voice-bank.md', layer: 'foundation', points: 12, min: 40, unit: 'real lines', days: 90,
    from: 'the website (capture-brand-dna.mjs), the Ad Library and past ads (ads), emails and Instagram captions', ask: 'old ad copy, emails or captions' },
  { id: 'customer-words', file: 'foundation/why-they-buy.md', layer: 'foundation', points: 10, min: 10, unit: 'customer lines', days: 90,
    from: 'reviews on the site, a reviews export, ad comments (reviews)', ask: 'a reviews export' },
  { id: 'claims', file: 'foundation/claims.md', layer: 'foundation', points: 10, min: 5, unit: 'claims with a source', days: 90,
    from: 'facts.json, the site and the ads: write each claim with the proof it needs and the proof on file, and each banned claim with why', ask: 'claims you can and cannot make, and offer limits' },
  { id: 'customers', file: 'foundation/customers.md', layer: 'foundation', points: 8, min: 2, unit: 'avatars', days: 90,
    from: 'why-they-buy.md, data/segments.md and store data: write 2 to 5, each citing its evidence', ask: 'who your best customers are' },
  { id: 'customer-talk', file: 'foundation/customer-talk.md', layer: 'foundation', points: 5, min: 5, unit: 'rules', days: 90,
    from: 'support replies, emails, social comment replies and chat: how they greet, sign off, say sorry or no, by channel', ask: 'a few real replies you sent to customers' },
  { id: 'design', file: 'foundation/design.md', layer: 'foundation', points: 8, min: 5, unit: 'rules', days: 90,
    from: 'look.json plus the ad images in the Ad Library: text amount and place, framing, fonts and colours in ads', ask: 'a creative folder or Drive link' },
  { id: 'dos-donts', file: 'foundation/dos-donts.md', layer: 'foundation', points: 5, min: 5, unit: 'rules', days: 90,
    from: 'the brand guide, worked.md and the owner', ask: 'anything we must never say or show' },
  { id: 'markets', file: 'foundation/markets.md', layer: 'foundation', points: 5, min: 2, unit: 'markets', days: 90,
    from: 'the site (shipping, currency, languages), store orders by country and region, data/segments.md: each market with its language, currency, channels, seasons and rules', ask: 'where you sell and ship' },
  { id: 'segments', file: 'data/segments.md', layer: 'data', points: 12, min: 3, unit: 'segments', days: 30,
    from: 'the ad account breakdowns by age, gender, region, placement (segments)', ask: 'read access to the ad account, or an export' },
  { id: 'creatives', file: 'data/creatives.md', layer: 'data', points: 10, min: 5, unit: 'ads with results', days: 30,
    from: 'ad-level results joined to their copy (creatives)', ask: 'read access to the ad account, or an export' },
  { id: 'funnel', file: 'data/funnel.md', layer: 'data', points: 5, min: 1, unit: 'funnel read', days: 30,
    from: 'the account or store numbers: click, view, cart, checkout, purchase', ask: 'store data (Shopify, GA4 or a dashboard)' },
  { id: 'sources', file: 'sources.md', layer: 'foundation', points: 5, min: 3, unit: 'sources', days: null,
    from: 'record each source with source <what> <where> --status', ask: null },
]);

/** Which parts a kind of job needs. A job is never blocked by a part it does not use. */
export const NEEDS = Object.freeze({
  ad_creative: ['brand-dna', 'voice-bank', 'customer-words', 'claims', 'customers', 'customer-talk', 'design', 'markets', 'dos-donts', 'segments', 'creatives'],
  copy: ['brand-dna', 'voice-bank', 'customer-words', 'claims', 'customers', 'customer-talk', 'dos-donts'],
  email: ['brand-dna', 'voice-bank', 'customer-words', 'claims', 'customers', 'customer-talk', 'dos-donts'],
  support: ['customer-talk', 'claims', 'dos-donts', 'sources'],
  proposal: ['brand-dna', 'customer-talk', 'claims', 'dos-donts', 'sources'],
  web_page: ['brand-dna', 'voice-bank', 'customer-words', 'claims', 'customers', 'customer-talk', 'design', 'markets', 'dos-donts', 'funnel'],
  audit: ['claims', 'segments', 'creatives', 'funnel'],
  strategy: ['brand-dna', 'claims', 'customers', 'markets', 'segments', 'creatives', 'customer-words'],
  plan: ['claims', 'customers', 'markets', 'segments'],
  analysis: ['segments', 'creatives', 'funnel'],
});
const BUYER_FACING = new Set(['ad_creative', 'copy', 'email', 'web_page', 'support', 'proposal']);
/** Plain names agents use for a job, mapped to a kind. An unknown name is treated as buyer-facing, never as "no need". */
const KIND_ALIASES = Object.freeze({
  ad: 'ad_creative', ads: 'ad_creative', creative: 'ad_creative', creatives: 'ad_creative', static: 'ad_creative', statics: 'ad_creative', campaign: 'ad_creative', social: 'ad_creative', post: 'ad_creative', posts: 'ad_creative', video: 'ad_creative',
  page: 'web_page', pages: 'web_page', landing: 'web_page', landing_page: 'web_page', homepage: 'web_page', home_page: 'web_page', website: 'web_page', site: 'web_page', store: 'web_page', product_page: 'web_page',
  emails: 'email', newsletter: 'email', sms: 'email', flow: 'email', flows: 'email',
  caption: 'copy', captions: 'copy', script: 'copy', blog: 'copy', article: 'copy',
  report: 'analysis', dashboard: 'analysis', analytics: 'analysis', data: 'analysis', review: 'audit', cro: 'audit',
  customer_support: 'support', customer_response: 'support', support_reply: 'support', support_replies: 'support',
  commercial_proposal: 'proposal', tender_answers: 'proposal',
  operations_document: 'ops_doc', sop: 'ops_doc', scope_and_sow: 'ops_doc',
});
const NO_BRAND = new Set(['code', 'ops_doc', 'other']);
/** The kind a job name means, and whether it was a name the tool did not know. */
export function kindOf(name) {
  if (!name) return { kind: null, unknown: false };
  const k = String(name).toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (Object.hasOwn(NEEDS, k) || NO_BRAND.has(k)) return { kind: k, unknown: false };
  if (Object.hasOwn(KIND_ALIASES, k)) return { kind: KIND_ALIASES[k], unknown: false };
  return { kind: 'ad_creative', unknown: true };
}
const KINDS_LINE = `Kinds: ${[...Object.keys(NEEDS), ...NO_BRAND].join(', ')} (or a plain word such as ads, page, email, dashboard).`;

// ---------- small helpers ----------
const words = (s) => (String(s || '').match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
const day = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
const brain = (ctx) => orgDir(ctx);
const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
const write = (f, text) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text.endsWith('\n') ? text : `${text}\n`); };
const cut = (s, n) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t; };
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const num = (v) => { if (v === null || v === undefined || v === '') return null; if (typeof v === 'number') return Number.isFinite(v) ? v : null; const n = Number(String(v).replace(/[,₹$€£\s]/g, '')); return Number.isFinite(n) ? n : null; };
const median = (a) => { const s = [...a].sort((x, y) => x - y); if (!s.length) return 0; const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const stamp = (now) => `Updated ${day(now)} by org-context.mjs ${VERSION}.`;
/** Lines of an org context file that hold content: bullets and table rows, not headings, notes or the header row. */
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
/** What the org context has, part by part, scored out of 100, with what to fill and from where. */
export function checkBrain(ctx, { now = new Date(), kind: asked = null } = {}) {
  const kind = kindOf(asked).kind;
  const need = kind && NEEDS[kind] ? new Set(NEEDS[kind]) : null;
  const parts = PARTS.map((p) => {
    const { text } = readPart(ctx, p.file);
    const have = text === null ? 0 : p.id === 'customers' ? (text.match(/^## /gm) || []).length : ['voice-bank', 'customer-words'].includes(p.id) ? (text.match(/^- "/gm) || []).length : contentLines(text).length;
    // A copied or freshly saved file is not newly checked evidence. Require its explicit review date.
    const updated = updatedOf(text);
    const age = updated ? Math.floor((now.getTime() - Date.parse(updated)) / DAY) : null;
    const stale = text !== null && p.days !== null && (age === null || !Number.isFinite(age) || age < 0 || age > p.days);
    const state = text === null || have === 0 ? 'missing' : stale ? 'stale' : have < p.min ? 'thin' : 'ok';
    const got = state === 'ok' ? p.points : state === 'missing' ? 0 : Math.round(p.points * Math.min(1, have / p.min) * (stale ? 0.5 : 1));
    return { id: p.id, file: p.file, layer: p.layer, state, have, min: p.min, unit: p.unit, updated, points: got, of: p.points, needed: need ? need.has(p.id) : true, from: p.from, ask: p.ask };
  });
  const score = parts.reduce((n, p) => n + p.points, 0);
  const gaps = parts.filter((p) => p.needed && p.state !== 'ok');
  return { score, parts, gaps, ready: gaps.length === 0, kind, exists: fs.existsSync(brain(ctx)) };
}
export function checkText(r) {
  const out = [`ORG CONTEXT: ${r.score}/100${r.kind ? ` | for ${r.kind.replace('_', ' ')}` : ''} | ${r.ready ? 'READY' : `${r.gaps.length} part${r.gaps.length === 1 ? '' : 's'} to fill first`}`, ''];
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

/** The intake questions about the org context and the client's material: only what is missing, at most four. */
export function askBrain(ctx, { now = new Date(), kind: asked = null } = {}) {
  const { kind, unknown } = kindOf(asked);
  if (kind && NO_BRAND.has(kind)) return { ask: false, questions: [], text: `No org context is needed for ${kind.replace('_', ' ')}. Leave it out of your questions.` };
  const r = checkBrain(ctx, { now, kind });
  // Each question only when this kind of job needs the part it fills: an analysis is never asked for an org context.
  const q = [], needs = (id) => r.parts.find((p) => p.id === id).needed, gapIds = new Set(r.gaps.map((g) => g.id));
  const foundation = r.parts.some((p) => p.layer === 'foundation' && p.id !== 'sources' && p.needed);
  const serviceJob = kind === 'support' || kind === 'proposal';
  if (foundation && !r.exists && serviceJob) q.push(kind === 'support'
    ? 'Do you have current support policies, approved replies and escalation rules I should use? I will use the supplied case evidence and record its sources; omit unsupported promises from drafts.'
    : 'Do you have the buyer brief, approved proposal examples and current commercial terms I should use? I will record the sources and leave unapproved commitments out of drafts.');
  else if (foundation && !r.exists) q.push('Do you have an org context (a brand guide, brand file or folder about your business) I should use? a) Yes: attach it or paste a link b) No: I will build one from your site, ads and reviews, and keep it for every later job');
  else if (foundation && !r.ready) q.push(`I have your org context (${r.score}/100). It is missing ${r.gaps.slice(0, 3).map((g) => g.id.replace('-', ' ')).join(', ')}. Shall I a) fill the gaps in place b) make a copy and improve that c) leave it as it is`);
  if ((BUYER_FACING.has(kind) || !kind) && ['voice-bank', 'design', 'customer-words'].some((id) => gapIds.has(id)))
    q.push('What do you already have that I can learn your voice and look from? Any of: old ad copy, a creative folder or Drive link, email exports, a reviews export. Or say "use public" and I will take them from your Ad Library, website and Instagram.');
  if (['segments', 'creatives', 'funnel'].some((id) => needs(id) && gapIds.has(id)))
    q.push('For the numbers, what can I use? a) read access to your ad account or store data (a connector), level 1, I change nothing b) an export you send c) none: I work from public data and say so');
  if (serviceJob && needs('customer-talk') && gapIds.has('customer-talk')) q.push('Which approved replies or communication rules show how to address this customer, explain a limit and escalate? Use the relevant channel and protect private customer details.');
  if (['dos-donts', 'claims'].some((id) => needs(id) && gapIds.has(id))) q.push(serviceJob
    ? 'Which claims, policy exceptions, refunds, discounts or commitments are approved, and which need owner authorization? Include privacy restrictions and the source for each rule; missing approval is not permission.'
    : 'Anything I must never say or show, and the most discount I may offer? (or "you decide")');
  if (serviceJob && gapIds.has('sources')) q.push('Which dated policy, case or commercial records support this work? Record the actual sources and any access gaps; do not create examples to reach a count.');
  const questions = q.slice(0, 4);
  const note = unknown ? `"${asked}" is not a kind this tool knows, so it asked as for buyer-facing work. ${KINDS_LINE}

` : '';
  const fallback = serviceJob ? 'Use supplied case and policy evidence first. Public sources may fill public business facts, never private case facts or owner authorization.' : 'Then use the public fallback and record it with source.';
  const text = questions.length
    ? ['Put these in your one intake message, with the job\'s own questions (five in all at most):', ...questions.map((x, i) => `${i + 1}. ${x}`), '', 'Before you ask, look: files they attached, the project folder, a claude.ai Project, and an org context saved to their AI Blocks account. Ask only for what you did not find.', `Test every link they send. If it does not open, say which one and request an accessible copy appropriate to its privacy, once. ${fallback}`]
      .join('\n')
    : `The org context is ready for this job (${r.score}/100). Do not ask about it; say in one line that you will use it.`;
  return { ask: questions.length > 0, questions, text: note + text, score: r.score, kind };
}

// ---------- sources ----------
export function addSource(ctx, what, where, { status = 'provided', note = '', now = new Date() } = {}) {
  if (!['provided', 'public', 'no-access'].includes(status)) throw new Error('--status is provided, public or no-access.');
  const f = path.join(brain(ctx), 'sources.md');
  const head = ['# Sources', '', 'Every source the org context was built from. provided = the client gave it; public = read from a public page; no-access = asked, could not open.', ''];
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
    long_running: ads.filter((a) => (a.days || 0) >= 30).length,
    // Legacy field retained, but duration alone can never establish a winner.
    proven: 0, performance_status: 'unknown',
  };
}
/** Takes ads into the voice bank (word for word) and writes their patterns. Long-running ads are observations, never proof of performance. */
export function ingestAds(ctx, rows, { source = 'library', now = new Date() } = {}) {
  const competitor = /^competitor:/.test(source) ? source.slice('competitor:'.length) : null;
  const ads = rows.map((r) => adOf(r, now)).filter((a) => a.body.length || a.title.length);
  const p = adPatterns(ads);
  const runs = (a) => (a.days ? `${a.days} days${a.active ? ', still running' : ''}${a.days >= 30 ? ', LONG-RUNNING; performance unknown' : ''}` : 'dates unknown');
  const ranked = [...ads].sort((a, b) => (b.days || 0) - (a.days || 0));
  const summary = [
    `- ${p.ads} ads, ${p.long_running} ran 30 days or more; duration does not establish sales, profit or a winning creative.`,
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
  for (const r of reviews.filter((x) => !neg(x)).slice(0, 60)) addBank(bank, 'Customer words', String(r.text || '').trim(), `review${r.rating !== null ? ` ${r.rating}★` : ''}${r.date ? `, ${String(r.date).slice(0, 10)}` : ''}`);
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
  const personas = (readPart(ctx, 'foundation/customers.md').text || '').match(/^## (.+)$/gm)?.map((h) => h.slice(3)) || [];
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
  const out = ['# Creative plan', '', `${n} creatives, each from a segment and a number. Fill every blank from the org context: the insight from why-they-buy.md or data/creatives.md, the proof from claims.md, the words from voice-bank.md. A creative with no insight is cut.`,
    pickTable ? `Segments from: data/segments.md, by ${pickTable[0]}.` : 'No segments yet.', personas.length ? `Avatars: ${personas.join('; ')}.` : 'No avatars yet: write foundation/customers.md first.', '',
    '| # | Segment | Why this segment (the number) | Persona | Insight (their words or a result) | Angle | Format | Proof line (source) | Hook (first 5 to 8 words) |', '|---|---|---|---|---|---|---|---|---|',
    ...slots.slice(0, n).map((s, i) => `| ${i + 1} | ${s.segment} | ${s.why} |  |  |  |  |  |  |`), '',
    'Rules: no two creatives share both an angle and a format. At least half image-led (the product, or a real person wearing it); text cards (a notes list, a chat, a comparison table, an explainer, a review card) are the rest, 40 words or fewer each, and a set of 10 or more uses 3 of them. A set of 5 or more has at least one piece for people who already know the store, or one with a real offer. One local or seasonal moment for each segment the data names. A button on the image in the brand\'s own style from its real ads. Headlines in the site\'s own heading font, never a hairline stand-in, passing check-creative-set.mjs probe. Every date, pay-later, ranking, policy and price line carries its source and terms in the manifest. Every hook passes voice-check.', '', stamp(now)];
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
// Promises a buyer holds the store to (round 6: "Wedding in February?" on a plan that ships in May; "#1 most added"
// overstating a site tag). The ad must carry the source; check-creative-set.mjs fails a creative without it.
export const STORE_PROMISES = [
  [/\b(?:in|by|before|for)\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|diwali|christmas|eid|the wedding|your wedding|the weekend)\b|\bin time for\b/i, 'a date promise: work out when the buyer really gets it under the offer terms (a pay-first plan ships after the last payment)'],
  [/\b(?:emi|instal(?:l)?ments?|pay (?:over|monthly|later)|per month|book (?:it )?at today'?s price)\b/i, 'a pay-later line: copy the plan terms from the store, and say when it ships'],
  [/#\s?\d+\b|\btop\s?\d+\b|\bbest[- ]?sell(?:er|ing)\b|\bmost[- ](?:added|loved|popular|bought)\b/i, 'a ranking: quote the store\'s own tag and the date you checked it'],
  [/\b(?:refunds?|free (?:shipping|delivery|returns?)|cash on delivery|warranty|money[- ]back|\d+[- ]day (?:returns?|exchange))\b/i, 'a policy promise: quote the policy and its conditions'],
];
export function voiceCheck(ctx, draftText, { ads = false } = {}) {
  const bankText = read(path.join(brain(ctx), 'foundation', 'voice-bank.md')) || '';
  const bankLines = [...bankText.matchAll(/^- "(.*)" \|/gm)].map((m) => m[1]).filter((l) => !/review/.test(l));
  const vocab = new Set(vocabulary(bankLines).slice(0, 300));
  const never = (read(path.join(brain(ctx), 'foundation', 'dos-donts.md')) || '').split('\n').filter((l) => /^- (never|don'?t|avoid)\b/i.test(l))
    .flatMap((l) => [...l.matchAll(/"([^"]{2,40})"/g)].map((m) => m[1].toLowerCase()));
  const sentences = bankLines.flatMap((l) => l.split(/(?<=[.!?])\s+| \/ /)).filter((s) => words(s) >= 2);
  const typical = median(sentences.map(words)) || 12;
  // Check short headlines, headings and table cells too. Markdown is a normal copy deliverable.
  const lines = String(draftText || '').replace(/<!--[\s\S]*?-->/g, '').split(/\n+/).flatMap((line) => {
    const l = line.trim();
    if (!l || /^(```|~~~)/.test(l) || /^\|?[\s:|\-]+\|?$/.test(l)) return [];
    const cells = /^\|/.test(l) ? l.replace(/^\||\|$/g, '').split(/(?<!\\)\|/) : [l];
    return cells.map((c) => c.replace(/^\s*(?:#{1,6}\s+|[-*>]\s+|\d+\.\s+)/, '').replace(/\*\*|__|`/g, '').trim()).filter((c) => words(c) > 0);
  });
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
    for (const [re, why] of STORE_PROMISES) { const m = line.match(re); if (m) warns.push(`${why} ("${m[0]}")`); }
    return { line: cut(line, 160), fails, warns, shared, words: words(line) };
  });
  const failed = results.filter((r) => r.fails.length), warned = results.filter((r) => r.warns.length);
  const text = [`VOICE CHECK: ${results.length} lines | ${failed.length} fail | ${warned.length} to look at | brand lines in the bank: ${bankLines.length}${bankLines.length < 40 ? ' (THIN: fill the voice bank first, or this check is weak)' : ''}`,
    ...results.filter((r) => r.fails.length || r.warns.length).map((r) => `${r.fails.length ? 'FAIL' : 'LOOK'} "${r.line}"\n     ${[...r.fails, ...r.warns].join('; ')}`),
    '', 'Then read each line aloud next to 5 real lines from the voice bank. If it would not sit among them, rewrite it.'].join('\n');
  return { ok: results.length > 0 && failed.length === 0, status: results.length ? (failed.length ? 'FAIL' : 'CHECKED') : 'NOT_RUN', results, text: results.length ? text : `VOICE CHECK: NOT_RUN; no copy found.\n${text}`, bank: bankLines.length };
}


// ---------- build: one command that fills every part a tool can fill ----------
const SKIP_DIRS = /^(node_modules|\.git|images?|screenshots|assets|thumbs?|history|output|helpers|tools|skills|toolbox|knowledge|prompts|workflows|brand-file|org-context)$/i;
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
  'foundation/brand-dna.md': ['# Brand DNA', '', '<!-- What the org is and stands for, in its own words, each line with its source. Mission in one line; 3 to 5 pillars; its personality in three words; its story; what must never change. -->', '', '## Mission', '', '## Pillars (3 to 5: what the brand stands for, in its own words)', '', '## Personality', '', '## Story', '', '## Never changes'],
  'foundation/claims.md': ['# Claims allowed and banned', '', '<!-- Write from facts.json, the site, the ads and the reviews. One claim a line: - claim | the proof it needs | the proof on file (source, date). A claim with no proof on file is not allowed yet. -->', '', '## Claims allowed (each with the proof it needs and the proof on file)', '', '## Claims banned (and why)', '', '## Offers allowed (and the most discount)'],
  'foundation/customers.md': ['# Customers and avatars', '', '<!-- 2 to 5 avatars. One "## Name: who" heading each. Under it: the evidence (segment numbers from data/segments.md, review quotes from why-they-buy.md), what they buy and for which occasion, the words they use, what stops them. -->'],
  'foundation/design.md': ['# Design language', '', '<!-- From look.json (the site) AND the ad images. Numbers, not adjectives: colours with their share, fonts by role (the site heading and body fonts first: an ad headline uses the site heading font unless the brand ad font file is in hand, never a "closest open" hairline face), how much text an ad carries and where, product framing (model, flat lay, close-up), logo place, what the best-running ads look like. -->', '', '## Fonts', '', '## Colours', '', '## Logo', '', '## Layout', '', '## Imagery', '', '## Ads'],
  'foundation/customer-talk.md': ['# How we speak to customers', '', '<!-- One rule a line, each with where it came from (a real reply, email or comment). By channel: how we address them (first name, you), greet and sign off, how formal, how we say sorry or no, words we use for them and words we never use. -->', '', '## Every channel', '', '## Ads and site', '', '## Email and SMS', '', '## Support replies and chat', '', '## Social comments'],
  'foundation/markets.md': ['# Markets', '', '<!-- One line per market: - country or region | language | currency | channels (own store, marketplaces, shops) | seasons and occasions | local rules | source and date. Where most orders come from first. -->', '', '## Where we sell', '', '## Seasons and occasions', '', '## Local rules'],
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
  for (const [file, lines] of Object.entries(STARTERS)) { const f = path.join(brain(ctx), file); if (readPart(ctx, file).text === null) { write(f, lines.join('\n')); done.push(`started ${file}: write it now`); } }
  return { done, skipped, check: checkBrain(ctx, { now, kind: 'ad_creative' }) };
}

// ---------- gate: pass or fail before buyer-facing work ----------
/** Require the task's foundation to be present, sufficiently filled and explicitly reviewed. Data gaps remain separate. */
const GATE = Object.freeze(Object.fromEntries([...BUYER_FACING].map((kind) => [kind, NEEDS[kind].filter((id) => PARTS.find((p) => p.id === id)?.layer === 'foundation')])));
export function gateBrain(ctx, { now = new Date(), kind: asked = null, scope = null, requiredKeys = [] } = {}) {
  const memory = readFactMemory(ctx, { now, scope, requiredKeys });
  if (memory.scope_error) return { ok: false, local_draft_allowed: false, text: `GATE: FAIL. ${memory.scope_error}`, blocking: [{ id: 'scope', state: 'mismatch' }] };
  const conflicts = [...memory.unresolved, ...memory.restrictions].filter((r) => r.needed);
  if (conflicts.length) return { ok: false, local_draft_allowed: true, draft_conditions: 'Omit unresolved or revoked facts; retain policy and privacy restrictions. No sending, refunds, commitments or other external actions are authorized.', text: `GATE: FAIL for dependent claims: ${conflicts.map((r) => `${r.fact_key} (${r.state})`).join(', ')}. Continue local drafts that omit these facts.`, blocking: conflicts, memory };
  const { kind } = kindOf(asked);
  if (!GATE[kind]) return { ok: true, text: `GATE: pass. ${kind ? kind.replace('_', ' ') : 'This job'} is not buyer-facing, so it does not wait on the org context.` };
  const r = checkBrain(ctx, { now, kind });
  const block = r.parts.filter((p) => GATE[kind].includes(p.id) && p.state !== 'ok');
  const thin = r.parts.filter((p) => p.needed && p.state !== 'ok' && !block.includes(p));
  const lines = [`GATE: ${block.length ? 'FAIL' : 'pass'} for ${kind.replace('_', ' ')} | org context ${r.score}/100`];
  if (block.length) lines.push(`Not ready: ${block.map((p) => `${p.file} (${p.state})`).join(', ')}. Refresh dated evidence and fill the required sections before final buyer-facing work. A restricted draft may omit unsupported claims; never invent examples to meet a count.`);
  if (thin.length) lines.push(`Other context gaps (do not use affected evidence as fact): ${thin.map((p) => `${p.id} ${p.have}/${p.min}`).join(', ')}.`);
  return { ok: block.length === 0, local_draft_allowed: true, draft_conditions: 'Use supported task facts only, retain policy and privacy restrictions, omit unsupported promises and label evidence gaps. Foundation readiness does not authorize sending, refunds, commitments or other external actions.', text: lines.join('\n'), score: r.score, blocking: block.map((p) => ({ id: p.id, file: p.file, state: p.state })) };
}

/** Complete task foundation, including restrictions. Never silently compress a business rule away. */
export function foundationSlice(ctx, level, { now = new Date(), kind: asked = null } = {}) {
  const kind = kindOf(asked).kind;
  if (level === 'none') return { blocks: [], missing: [], stale: [], thin: [], included: [] };
  const ids = new Set(['claims', 'dos-donts']);
  if (level === 'full') for (const p of PARTS.filter((p) => p.layer === 'foundation' && p.id !== 'sources')) ids.add(p.id);
  if (level === 'voice') for (const id of ['voice-bank', 'customer-talk', 'brand-dna']) ids.add(id);
  if (level === 'look') ids.add('design');
  for (const id of NEEDS[kind] || []) if (PARTS.find((p) => p.id === id)?.layer === 'foundation') ids.add(id);
  const checked = checkBrain(ctx, { now, kind });
  const selected = [...ids].map((id) => checked.parts.find((p) => p.id === id));
  const blocks = selected.flatMap((p) => {
    const { text } = readPart(ctx, p.file);
    if (text === null) return [];
    return [{ id: p.id, file: p.file, state: p.state, text: `FOUNDATION ${p.id}: ${p.file} | ${p.state.toUpperCase()} | checked ${p.updated || 'unknown'}\n${p.state === 'stale' ? 'RECHECK factual assertions before use. Keep restrictions in force until the owner resolves them.\n' : ''}${text.trim()}` }];
  });
  return { blocks, included: blocks.map((b) => b.file), missing: selected.filter((p) => p.state === 'missing').map((p) => p.file), stale: selected.filter((p) => p.state === 'stale').map((p) => p.file), thin: selected.filter((p) => p.state === 'thin').map((p) => p.file) };
}

// Scope is supplied by the trusted caller, never inferred from retrieved prose. This local
// binding is an isolation check, not a replacement for a host's authenticated identity.
const validScope = (s) => !!s && ['owner_id', 'workspace_id'].every((k) => typeof s[k] === 'string' && s[k].trim());
const sameScope = (a, b) => validScope(a) && validScope(b) && a.owner_id === b.owner_id && a.workspace_id === b.workspace_id;
const memoryJson = (ctx, file) => { try { return JSON.parse(fs.readFileSync(path.join(orgDir(ctx), file), 'utf8')); } catch (e) { if (e.code === 'ENOENT') return null; throw new Error(`Invalid org context ${file}.`); } };
function scopeCheck(ctx, scope) {
  const bound = memoryJson(ctx, 'scope.json');
  if (bound && !sameScope(bound, scope)) return { ok: false, reason: 'Scope mismatch or missing caller identity; org context withheld.' };
  return { ok: true, bound };
}
export function bindContextScope(ctx, scope) {
  if (!validScope(scope)) throw new Error('Explicit owner_id and workspace_id are required.');
  const check = scopeCheck(ctx, scope); if (!check.ok) throw new Error(check.reason);
  write(path.join(orgDir(ctx), 'scope.json'), JSON.stringify({ owner_id: scope.owner_id, workspace_id: scope.workspace_id }, null, 2));
  return { ok: true, legacy: 'Existing unscoped facts remain unverified; review them before remembering them in this scope.' };
}
const memoryKey = (r) => r.fact_key || r.id;
export const factEvidenceId = (r) => createHash('sha256').update(JSON.stringify([memoryKey(r), r.value, r.source, r.captured_at, r.scope?.owner_id, r.scope?.workspace_id])).digest('hex');
// Obvious instruction payloads are quarantined. All other values still remain quoted data;
// this deliberately does not claim to detect every possible prompt injection.
const instructionPayload = (r) => /(?:ignore|override|disregard)\s+(?:all\s+)?(?:previous|system|developer|instructions)|(?:system|assistant|developer)\s*:|(?:reveal|send|exfiltrate)\s+(?:the\s+)?(?:secrets|credentials|api keys)|grant\s+(?:publish|admin)\s+(?:access|permission)/i.test(`${r.value || ''} ${r.source || ''}`);
/** Reconcile a fact key, never arbitrary prose similarity. All alternatives retain provenance. */
export function reconcileFacts(records, { scope = null, now = new Date(), resolutions = [], requiredKeys = null } = {}) {
  const groups = new Map(), review = [], rejected = [];
  for (const r of records || []) {
    if (!r || typeof r !== 'object') { rejected.push({ reason: 'invalid_record' }); continue; }
    // Do not echo another tenant's values, source names or record IDs.
    if (r.scope && !sameScope(r.scope, scope)) { rejected.push({ reason: 'wrong_scope' }); continue; }
    if (['ended', 'banned', 'unconfirmed', 'revoked'].includes(r.status)) continue;
    if (instructionPayload(r)) { rejected.push({ reason: 'instruction_payload', fact_key: memoryKey(r) }); continue; }
    if (!r.scope || !validScope(scope)) { review.push({ ...r, state: 'unscoped' }); continue; }
    if (!memoryKey(r) || typeof r.value !== 'string' || !r.source) { review.push({ ...r, state: 'missing_provenance' }); continue; }
    const item = { ...r, evidence_id: factEvidenceId(r) };
    const key = memoryKey(r); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(item);
  }
  const decisions = resolutions.filter((r) => sameScope(r.scope, scope));
  for (const d of decisions) if (!groups.has(d.fact_key)) groups.set(d.fact_key, []);
  const facts = [], unresolved = [], restrictions = [];
  for (const [key, rows] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    const active = decisions.filter((d) => d.fact_key === key && !decisions.some((later) => later.fact_key === key && later.supersedes === d.id));
    const alternatives = [...new Map(rows.map((r) => [r.evidence_id, r])).values()].sort((a, b) => a.evidence_id.localeCompare(b.evidence_id));
    const needed = requiredKeys === null || requiredKeys.includes(key);
    if (active.length > 1) { unresolved.push({ fact_key: key, state: 'conflicting_owner_decisions', needed, alternatives }); continue; }
    if (active.length === 1) {
      const d = active[0];
      if (d.action === 'revoke') { restrictions.push({ fact_key: key, state: 'revoked', needed, source: d.source, decision_id: d.id }); continue; }
      const corrected = { ...d, id: d.id, value: d.value, kind: d.kind || 'fact', status: 'live', captured_at: d.at, source: d.source, volatile: d.volatile, evidence_id: d.id };
      if (isStale(corrected, now)) unresolved.push({ fact_key: key, state: 'stale_owner_correction', needed, alternatives: [corrected] });
      else facts.push(corrected);
      continue;
    }
    const current = alternatives.filter((r) => !isStale(r, now));
    const stale = alternatives.filter((r) => isStale(r, now));
    review.push(...stale.map((r) => ({ ...r, state: 'stale' })));
    const values = new Set(current.map((r) => r.value.trim().replace(/\s+/g, ' ')));
    if (values.size > 1) unresolved.push({ fact_key: key, state: 'contradiction', needed, alternatives: current });
    else if (current.length) facts.push({ ...current[0], provenance: current.map((r) => ({ evidence_id: r.evidence_id, source: r.source, captured_at: r.captured_at })) });
    else if (stale.length) unresolved.push({ fact_key: key, state: 'stale', needed, alternatives: stale });
  }
  for (const key of requiredKeys || []) if (!facts.some((r) => memoryKey(r) === key) && !unresolved.some((r) => r.fact_key === key) && !restrictions.some((r) => r.fact_key === key)) unresolved.push({ fact_key: key, state: 'missing_scoped_evidence', needed: true, alternatives: [] });
  return { facts, unresolved, restrictions, review, rejected, ready: ![...unresolved, ...restrictions].some((r) => r.needed), local_draft_allowed: true };
}
export function readFactMemory(ctx, options = {}) {
  const checked = scopeCheck(ctx, options.scope);
  if (!checked.ok) return { facts: [], unresolved: [], restrictions: [], review: [], rejected: [{ reason: 'wrong_scope' }], ready: false, scope_error: checked.reason, local_draft_allowed: true };
  const records = [...(memoryJson(ctx, 'facts.json')?.facts || []), ...(memoryJson(ctx, 'offers.json')?.offers || [])];
  return reconcileFacts(records, { ...options, resolutions: memoryJson(ctx, 'owner-resolutions.json')?.resolutions || [] });
}
/** Trusted caller operation: source text cannot manufacture an owner decision. Append only. */
export function resolveFact(ctx, { scope, factKey, action, value, source, kind = null, supersedes = null, now = new Date() } = {}) {
  if (!validScope(scope) || !scopeCheck(ctx, scope).bound) throw new Error('Bind the context to the explicit owner/workspace before resolving a fact.');
  if (!scopeCheck(ctx, scope).ok) throw new Error('Scope mismatch.');
  if (!factKey || !source || !['correct', 'revoke'].includes(action) || (action === 'correct' && (typeof value !== 'string' || !value.trim()))) throw new Error('A fact key, direct owner source, and correct/value or revoke are required.');
  if (instructionPayload({ value, source })) throw new Error('Instruction payload cannot become a business fact.');
  const priorEvidence = [...(memoryJson(ctx, 'facts.json')?.facts || []), ...(memoryJson(ctx, 'offers.json')?.offers || [])].find((r) => memoryKey(r) === factKey && sameScope(r.scope, scope));
  kind = priorEvidence?.kind || kind || factKindOf(value || '');
  const file = 'owner-resolutions.json', doc = memoryJson(ctx, file) || { resolutions: [] };
  const active = doc.resolutions.filter((d) => d.fact_key === factKey && sameScope(d.scope, scope) && !doc.resolutions.some((n) => n.supersedes === d.id));
  if (active.length && (active.length !== 1 || active[0].id !== supersedes)) throw new Error('Explicitly supersede the current owner decision; no latest-write-wins.');
  if (supersedes && !active.some((d) => d.id === supersedes)) throw new Error('Unknown superseded owner decision.');
  const decision = { fact_key: factKey, action, ...(action === 'correct' ? { value } : {}), source, kind, scope, at: now.toISOString(), supersedes };
  decision.id = createHash('sha256').update(JSON.stringify(decision)).digest('hex');
  doc.resolutions.push(decision); write(path.join(orgDir(ctx), file), JSON.stringify(doc, null, 2));
  return decision;
}
export function rememberFact(ctx, record, { scope, now = new Date() } = {}) {
  const checked = scopeCheck(ctx, scope);
  if (!checked.ok || !checked.bound || !validScope(scope)) throw new Error('A matching bound owner/workspace is required.');
  if (record.scope && !sameScope(record.scope, scope)) throw new Error('Record scope mismatch.');
  if (!['fact', 'price', 'offer', 'stock', 'shipping', 'guarantee', 'review'].includes(record.kind)) throw new Error('Explicit kind required: fact, price, offer, stock, shipping, guarantee or review.');
  const keyedKind = String(memoryKey(record) || '').split(':')[0];
  if (FAST_KINDS.includes(keyedKind) && record.kind !== keyedKind) throw new Error('A volatile fact key must retain its matching kind and freshness window.');
  if (!memoryKey(record) || typeof record.value !== 'string' || !record.source || !record.captured_at || instructionPayload(record)) throw new Error('A fact key, value, source and evidence date are required; instruction payloads are rejected.');
  const row = { id: record.id || record.fact_key, fact_key: memoryKey(record), value: record.value, kind: record.kind, source: record.source, captured_at: record.captured_at, scope: { owner_id: scope.owner_id, workspace_id: scope.workspace_id }, status: 'live' };
  const file = FAST_KINDS.includes(row.kind) ? 'offers.json' : 'facts.json', part = file.slice(0, -5), doc = memoryJson(ctx, file) || { [part]: [] };
  if (!doc[part].some((r) => factEvidenceId(r) === factEvidenceId(row))) doc[part].push(row);
  write(path.join(orgDir(ctx), file), JSON.stringify(doc, null, 2));
  return { evidence_id: factEvidenceId(row), state: isStale(row, now) ? 'stale' : 'recorded' };
}

// ---------- the store part (was brand-file.mjs): facts, offers, look, voice, references, worked ----------
const jobKindOf = kindOf;
const store = (() => {
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA = 'ai-blocks-org-context/1';
const FOLDER = ORG_FOLDER;
const INDEX_FILE = 'index.md';
/** Days a line stays fresh, by its `volatile` class. `fixed` never ages, but still needs a date. */
const FRESH_DAYS = Object.freeze({ fast: 7, slow: 90, fixed: null });
const FAST_KINDS = Object.freeze(['price', 'offer', 'stock', 'shipping']);
const SLICES = Object.freeze(['none', 'facts', 'voice', 'look', 'full']);
const SLICE_PARTS = Object.freeze({ none: [], facts: ['offers', 'facts'], voice: ['offers', 'facts', 'voice'], look: ['offers', 'facts', 'look'], full: ['offers', 'facts', 'voice', 'look'] });
const SLICE_WORDS = Object.freeze({ none: 40, facts: 600, voice: 600, look: 600, full: 1500 });
const SLICE_BY_KIND = Object.freeze({ web_page: 'full', ad_creative: 'full', copy: 'voice', email: 'voice', support: 'facts', proposal: 'facts', audit: 'facts', analysis: 'none', strategy: 'facts', plan: 'facts', code: 'none', ops_doc: 'none', other: 'none' });
/** Kinds that sell something: their prices and stock are rechecked before anything else. */
const SELLING_KINDS = Object.freeze(['web_page', 'ad_creative', 'copy', 'email']);
const PARTS = Object.freeze([
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
const day = (d) => { const t = d instanceof Date ? d : new Date(d); return Number.isNaN(t.getTime()) ? null : t.toISOString().slice(0, 10); };
/** Whole days between a date and now. null when the date is missing or unreadable. */
function ageDays(date, now) { const t = Date.parse(date || ''); return Number.isNaN(t) ? null : Math.floor((now.getTime() - t) / 864e5); }
const volatileOf = (kind) => (FAST_KINDS.includes(kind) ? 'fast' : 'slow');
/** A line is stale with no date, or when it is older than its class allows. */
function isStale(rec, now) {
  const age = ageDays(rec?.captured_at, now); if (age === null || age < 0) return true;
  const limit = FRESH_DAYS[rec.volatile in FRESH_DAYS ? rec.volatile : volatileOf(rec.kind)];
  return limit !== null && age > limit;
}
const shortSource = (s) => cut(String(s || 'no source').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''), 70);
const isUrl = (s) => /^https?:\/\//i.test(String(s || ''));
const readText = (f) => { try { return fs.readFileSync(f, 'utf8').replace(/^﻿/, ''); } catch { return null; } };
const readJson = (f) => { const t = readText(f); if (t === null) return null; try { return JSON.parse(t); } catch { return null; } };
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
/** The first date written in a line: 2026-11-09, 9 Nov 2026 or Nov 9, 2026. Returned as YYYY-MM-DD. */
function findDate(s) {
  const t = String(s || ''), two = (n) => String(n).padStart(2, '0');
  let m = /\b(20\d{2})-(\d{2})-(\d{2})(?:T[\d:.]+Z?)?/.exec(t); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+(20\d{2})\b/i.exec(t); if (m) return `${m[3]}-${two(MONTHS[m[2].toLowerCase()])}-${two(m[1])}`;
  m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d{2})\b/i.exec(t); if (m) return `${m[3]}-${two(MONTHS[m[1].toLowerCase()])}-${two(m[2])}`;
  return null;
}
const PRICE = /(?:[$£€₹¥]|\b(?:USD|EUR|GBP|INR|AUD|CAD|Rs\.?)\s?)\d|\b\d[\d,.]*\s?(?:USD|EUR|GBP|INR|rupees|dollars|pounds|euros)\b|\bper (?:month|year)\b|\/\s?(?:mo|month|yr|year)\b/i;
/** The kind of a written fact, from its words. Lines that change weekly win over lines that last. */
function kindOf(line, fallback = 'fact') {
  const t = String(line || '');
  if (/\b(?:out of stock|in stock|sold out|back in stock|low stock|pre-?order)\b/i.test(t)) return 'stock';
  if (/\b\d{1,2}\s?% off\b|\bsale\b|\bdiscount|\bcoupon\b|\bpromo|\buse code\b|\bbuy \d+ get\b|\bfree gift\b|\bbogo\b|\boffer ends\b|\blimited[- ]time\b/i.test(t)) return 'offer';
  if (/\bshipping\b|\bdelivery\b|\bdeliver(?:s|ed)\b|\bdispatch|\bships?\b|\bcourier\b/i.test(t)) return 'shipping';
  if (PRICE.test(t)) return 'price';
  if (/guarantee|warrant|\breturns?\b|\brefund|\bexchange\b|money[- ]back/i.test(t)) return 'guarantee';
  if (/\breviews?\b|\bratings?\b|\brated\b|\bstars?\b|★/i.test(t)) return 'review';
  return fallback;
}
const record = (kind, id, value, source, captured_at, extra = {}) => ({ id, kind, value: String(value || '').trim(), source: source || null, captured_at: captured_at || null, volatile: volatileOf(kind), status: 'live', ...extra });

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
function parseEntry(line) {
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

// ---------- the raw capture (context/brand-dna.json) into org context parts ----------
/** Pages of a capture, whether the script wrote it (pages) or the snippet did (one page at the top level). */
function capturePages(dna) {
  if (Array.isArray(dna?.pages)) return dna.pages.filter((p) => p.desktop && !p.desktop.error).map((p) => ({ url: p.url || dna.source, path: p.path || '/', captured_at: p.captured_at || dna.captured_at || null, d: p.desktop }));
  if (dna?.palette && dna?.facts) return [{ url: dna.page?.url || dna.source, path: dna.page?.path || '/', captured_at: dna.captured_at || null, d: dna }];
  return [];
}
const STOCK = (a) => { const t = String(a || '').split('/').pop(); return /^InStock$/i.test(t) ? 'in stock' : /^(OutOfStock|SoldOut)$/i.test(t) ? 'out of stock' : t.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(); };
/** Every dated line a capture holds, as org context records. */
function recordsFromCapture(dna) {
  const offers = [], facts = [], seen = new Set();
  const push = (r) => { const identity = JSON.stringify([r.id, r.source, r.value, r.captured_at]); if (!r.value || seen.has(identity)) return; seen.add(identity); (FAST_KINDS.includes(r.kind) ? offers : facts).push({ ...r, from: 'capture' }); };
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
    for (const [text, kind] of byLine) push(record(kind, `${kind}:${page}:${slug(text)}`, text, p.url, at,
      f.capture?.truncated ? { status: 'unconfirmed', note: 'Source capture reached its limit; full policy/offer context must be reviewed before use.', capture_truncated: true } : {}));
  }
  return { offers, facts };
}
/** The look, cut down from the capture to what a maker reads. The full numbers stay in context/brand-dna.json. */
function lookFromCapture(dna) {
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
    for (const s of p.d.voice?.samples || []) if (s.kind !== 'cta') lines.push({ text: String(s.text || '').trim(), kind: s.kind === 'headline' ? 'headline' : 'body', source: p.url, date });
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
function mergeRecords(existing, incoming, { recaptured = new Set(), now = new Date(), report = true, known = null } = {}) {
  const identity = (r) => JSON.stringify([r.id, r.source, r.scope?.owner_id, r.scope?.workspace_id]);
  const out = (existing || []).map((r) => ({ ...r })), byId = new Map(out.map((r) => [identity(r), r])), changes = [], got = new Set(), newPages = new Map();
  const note = (text, source) => { if (report) changes.push({ at: day(now), text, source: source || null }); };
  for (const r of incoming) {
    got.add(identity(r)); const old = byId.get(identity(r));
    if (!old) {
      out.push({ ...r, first_seen: r.captured_at }); byId.set(identity(r), out.at(-1));
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
    if (got.has(identity(r)) || r.status !== 'live' || r.from !== 'capture' || !recaptured.has(r.source)) continue;
    r.status = 'ended'; r.ended_at = now.toISOString();
    note(`${CHANGE_GONE[r.kind] || 'No longer on the page'}: ${r.value}`, r.source);
  }
  return { records: out, changes, newPages };
}

// ---------- written facts and the old eight-file folder ----------
// A tag a person writes after a line. confirmed and approved are checked; banned is a claim never to use; the rest are not facts yet.
const TAG = /\[(confirmed|approved|inferred|disputed|unknown|pending|banned)(?::\s*([^\]]*))?\]/i;
/** One written line as a record: its tag, source and date are read from the line; a missing date stays missing. */
function recordFromLine(raw, { file, fallbackKind = 'fact', topic = null, fileDate = null } = {}) {
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
function recordsFromMarkdown(text, opts = {}) {
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

// ---------- reading the org context as of a date ----------
const brandDir = (ctx) => orgDir(ctx);
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
const levelFor = (kind, level) => (SLICES.includes(level) ? level : kind ? SLICE_BY_KIND[kind] ?? 'full' : 'full');
const serviceKind = kind => kind === 'support' || kind === 'proposal';

/** What exists, how old each part is, what is stale and what is missing, as of `now`. */
function statusOf(ctx, { now = new Date(), kind = null, level = null, scope = null, requiredKeys = [] } = {}) {
  kind = jobKindOf(kind).kind;
  const memory = readFactMemory(ctx, { now, scope, requiredKeys });
  if (memory.scope_error) return { ok: false, exists: false, dir: slash(brandDir(ctx)), next: [memory.scope_error], parts: [], memory };
  const all = readAll(ctx), need = levelFor(kind, level), taskFacts = serviceKind(kind) && need === 'facts';
  // A policy/case packet can live in reviewed foundation sections and scoped memory.
  // It does not need marketing offers or a duplicate facts.json just to be present.
  const needed = taskFacts ? [] : SLICE_PARTS[need], foundation = taskFacts ? checkBrain(ctx, { now, kind }) : null, stale = [], parts = [];
  for (const part of ['facts', 'offers']) if (all[part]) all[part][part] = (all[part][part] || []).filter((r) => !r.scope || sameScope(r.scope, scope));
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
  // A capture saved by hand (the browser snippet) that the org context has not taken in yet.
  const raw = Date.parse(readJson(path.join(ctx, 'brand-dna.json'))?.captured_at || ''), taken = Date.parse(all.offers?.checked_at || all.facts?.checked_at || '');
  const unsynced = all.exists && !Number.isNaN(raw) && (Number.isNaN(taken) || raw > taken);
  const exists = all.exists || !!foundation?.exists;
  return { schema: SCHEMA, dir: slash(path.relative(process.cwd(), all.dir) || all.dir), exists, business, site, today: day(now), kind, level: need, needed,
    parts, stale, missing: parts.filter((p) => p.needed && p.state === 'missing').map((p) => p.id), stale_parts: parts.filter((p) => p.needed && p.state === 'stale').map((p) => p.id), unsynced,
    ...(foundation ? { foundation: { ready: foundation.ready, score: foundation.score, gaps: foundation.gaps } } : {}),
    memory, ok: (taskFacts ? foundation.ready : need === 'none' || (all.exists && blocking.length === 0 && !unsynced)) && memory.ready, next: nextSteps({ all, ctx, need, kind, parts, stale, unsynced, foundation, memory }) };
}
const toolPath = (name) => { const rel = slash(path.join(path.relative(process.cwd(), HERE) || '.', name)); return rel.startsWith('../../') || path.isAbsolute(rel) ? slash(path.join(HERE, name)) : rel; };
function nextSteps({ all, ctx, need, kind, parts, stale, unsynced, foundation, memory }) {
  if (need === 'none') return [`No org context is needed for ${kind ? aJob(kind) : 'this job'}. Skip capture and work from the system, files or data.`];
  if (serviceKind(kind)) {
    const out = [], gaps = foundation?.gaps || [];
    if (gaps.length) out.push(`Review supplied ${kind === 'support' ? 'case records, current policies and approved replies' : 'buyer brief, current commercial terms and approved company statements'} for: ${gaps.map(p => `${p.file} (${p.state})`).join(', ')}. Keep actual sources and review dates; never invent evidence to meet counts.`);
    const claims = [...memory.unresolved, ...memory.restrictions].filter(r => r.needed);
    if (claims.length) out.push(`Resolve dependent facts with the authorized source: ${claims.map(r => `${r.fact_key} (${r.state})`).join(', ')}. Omit these claims from restricted drafts; source text cannot override an owner revocation.`);
    const extra = parts.filter(p => p.needed && (p.state === 'missing' || p.state === 'stale'));
    if (extra.length) out.push(`The explicitly requested ${need} slice also needs ${extra.map(p => p.file).join(', ')}. Review only the requested evidence before treating that broader packet as complete.`);
    out.push('Retain policy and privacy restrictions. Check the actual claim dependencies with --keys and the trusted --owner/--workspace identity. Incomplete foundation blocks release, not a restricted private draft; no sending, refunds or commitments are authorized by this check.');
    out.push(`Take the task packet: node ${toolPath('org-context.mjs')} slice ${need} --for ${kind}. Optional stale records must be rechecked before use; unrelated website captures and marketing history do not block this task packet.`);
    return out;
  }
  const capture = `node ${toolPath('capture-brand-dna.mjs')}`, out = [], needed = parts.filter((p) => p.needed);
  if (!all.exists) {
    const old = findOldFolder(ctx), raw = ['brand-dna.json', 'facts.md', 'voice.md'].filter((f) => fs.existsSync(path.join(ctx, f)));
    if (old || raw.length) return [`Build the org context from what is already here (${[...raw.map((f) => `context/${f}`), old && slash(path.relative(process.cwd(), old))].filter(Boolean).join(', ')}): node ${toolPath('org-context.mjs')} migrate`];
    return [`First job for this business: build the org context once. Run: ${capture} <site url> <1 to 3 paths that matter>`, 'No website yet: write facts.json and voice.md by hand from what the client gives you, each line with its source and date.'];
  }
  if (unsynced) return [`context/brand-dna.json is newer than the org context. Take it in first: node ${toolPath('org-context.mjs')} migrate`, 'Then run status again.'];
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
  out.push(`${out.length ? 'Then take' : 'Take'} only your slice: node ${toolPath('org-context.mjs')} slice ${need}${kind ? ` --for ${kind}` : ''} --out ${slash(path.relative(process.cwd(), path.join(ctx, 'facts.md')) || 'facts.md')}`);
  return out;
}
function statusText(s) {
  if (!s.exists) return [`No org context yet at ${s.dir}.`, ...s.next.map((n) => `- ${n}`), s.ok ? 'Result: READY (nothing needed)' : 'Result: NOT READY'].join('\n');
  const pad = (v, n) => String(v ?? '').padEnd(n), rows = s.parts.map((p) => `${pad(p.id, 11)}${pad(p.file, 15)}${pad(p.state, 10)}${pad(p.newest || '-', 12)}${pad(p.age_days === null ? '-' : `${p.age_days}d`, 6)}${p.count} ${p.id === 'look' ? 'colour' : 'line'}${p.count === 1 ? '' : 's'}${p.stale_count ? `, ${p.stale_count} ${p.id === 'voice' ? 'undated' : 'stale'}` : ''}${p.limit_days ? `, fresh for ${p.limit_days} days` : ''}${p.needed ? '' : ', not needed here'}`);
  const out = [`Org context: ${s.business || s.site || 'unnamed'} (${s.dir}) as of ${s.today}${s.kind ? `, for ${aJob(s.kind)}: needs ${s.level}` : ''}`, '', `${pad('part', 11)}${pad('file', 15)}${pad('state', 10)}${pad('newest', 12)}${pad('age', 6)}notes`, ...rows];
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
    `# Org context: ${s.business || s.site || 'unnamed'}`, '',
    `${s.site ? `Site: ${s.site}. ` : ''}Written ${s.today} by org-context.mjs ${VERSION}. Ages are as of that day; run \`org-context.mjs status\` for today's.`, '',
    '| Part | File | Holds | Newest | State |', '|---|---|---|---|---|',
    ...s.parts.map((p) => `| ${p.id} | ${p.file} | ${PARTS.find((x) => x.id === p.id).holds} | ${p.newest || '-'} | ${p.state}${p.stale_count ? ` (${p.stale_count} ${p.id === 'voice' ? 'undated' : 'stale'} of ${p.count})` : p.exists ? ` (${p.count})` : ''} |`), '',
    `Missing: ${s.parts.filter((p) => p.state === 'missing').map((p) => p.file).join(', ') || 'nothing'}.`,
    `Stale: ${s.stale.length ? `${s.stale.length} line${s.stale.length === 1 ? '' : 's'}, starting with ${s.stale.slice(0, 3).map((x) => `"${cut(x.value, 50)}"`).join(', ')}` : 'nothing'}.`, '',
    ...(firstBlock.length ? ['Changed at the last capture:', ...firstBlock.map((l) => l.replace(/^## /, '- On ').replace(/^- (?!On )/, '  - ')), ''] : []),
    ...(worked.length ? ['Latest from worked.md:', ...worked, ''] : []),
    ...sectionLines(ctx, now),
    'How to use it:', '- Take a slice, never the whole file: `org-context.mjs slice <none|facts|voice|look|full> --for <kind>`.',
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
 * Build or update the org context from what the context folder holds: the raw capture, and (with `everything`)
 * the older written files and an old eight-file folder. New values are merged in; nothing on file is overwritten.
 */
function syncBrandFile(ctx, { now = new Date(), dna, everything = false, from = null, recaptured = null } = {}) {
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
    const factsMd = /^(?:ORG CONTEXT|BRAND FILE) SLICE:/.test(md('facts.md') || '') ? null : md('facts.md'); if (factsMd) merge(recordsFromMarkdown(factsMd, { file: 'context/facts.md' }), 'context/facts.md', { report: false });
    const voiceMd = md('voice.md');
    if (voiceMd) {
      const fileDate = findDate(voiceMd.split(/\r?\n/).slice(0, 6).join(' ')); let customer = false; const mine = [], theirs = [];
      for (const l of voiceMd.split(/\r?\n/)) { if (/^#/.test(l)) { customer = /customer|review|buyer|their/i.test(l); continue; } const t = l.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '').trim(); if (t.length < 4) continue; const quoted = /["“]([^"”]{4,})["”]/.exec(t); (customer ? theirs : mine).push({ text: (quoted ? quoted[1] : t.replace(/\s*\((?:source|from)[^)]*\)\s*$/i, '')).trim(), kind: customer ? 'customer' : 'line', source: /https?:\/\/[^\s)|]+/.exec(t)?.[0] || 'context/voice.md', date: findDate(t) || fileDate }); }
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
function learn(ctx, { job, kept, killed, more, now = new Date() } = {}) {
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
function sliceText(ctx, level, { now = new Date(), kind = null, scope = null, requiredKeys = [], verifiedOnly = false } = {}) {
  if (!SLICES.includes(level)) throw new Error(`Unknown slice "${level}". Use one of: ${SLICES.join(', ')}.`);
  kind = jobKindOf(kind).kind;
  const memory = readFactMemory(ctx, { now, scope, requiredKeys });
  if (memory.scope_error) return { ok: false, text: memory.scope_error, memory };
  if (level === 'none') {
    const rules = ['foundation/dos-donts.md', 'foundation/claims.md'].map((f) => readPart(ctx, f).text).filter(Boolean).join('\n');
    const bans = [...(readAll(ctx).facts?.facts || []), ...(readAll(ctx).offers?.offers || [])].filter((r) => r.status === 'banned' && (!r.scope || sameScope(r.scope, scope)));
    return { ok: memory.ready, text: [`ORG CONTEXT SLICE: none${kind ? ` (for ${aJob(kind)})` : ''}`, 'This job needs no org context. Skip capture. Standing restrictions still apply.', ...(rules ? ['MANDATORY RESTRICTIONS', rules] : []), ...bans.map((r) => `- BANNED: ${r.value}`), ...memory.restrictions.map((r) => `- REVOKED FACT: ${r.fact_key}`)].join('\n'), memory };
  }
  const all = readAll(ctx), s = statusOf(ctx, { now, kind, level, scope, requiredKeys }), foundation = foundationSlice(ctx, level, { now, kind });
  if (!all.exists && !foundation.included.length) return { ok: false, text: [`ORG CONTEXT SLICE: ${level}`, `There is no org context at ${s.dir} yet, so there is nothing to take.`, ...s.next.map((n) => `- ${n}`)].join('\n') };
  const caps = CAPS[level], sells = SELLING_KINDS.includes(kind), rank = (r) => (sells ? ['stock', 'price', 'offer', 'shipping'].indexOf(r.kind) : 0);
  // Newest day first. Within a day: a named product line, then a full sentence, then bare prices and menu labels.
  const weight = (r) => (/^(price|stock|review):[^:]+$/.test(r.id || '') ? 0 : words(r.value) >= 4 ? 1 : 2);
  const byNewest = (a, b) => String(day(b.captured_at || '') || '').localeCompare(String(day(a.captured_at || '') || '')) || weight(a) - weight(b) || rank(a) - rank(b);
  const once = (list) => { const seen = new Set(); return [...list].sort(byNewest).filter((r) => !seen.has(r.value) && seen.add(r.value)); };
  const ownerDecided = new Set([...memory.restrictions.map((r) => r.fact_key), ...memory.facts.filter((r) => r.action === 'correct').map(memoryKey), ...memory.unresolved.filter((r) => /owner/.test(r.state)).map((r) => r.fact_key)]);
  const usableLegacy = (rows) => verifiedOnly ? [] : live(rows).filter((r) => !r.scope && !instructionPayload(r) && !ownerDecided.has(memoryKey(r)));
  const offers = once(usableLegacy(all.offers?.offers)), facts = once(usableLegacy(all.facts?.facts)), stale = [...offers, ...facts].filter((r) => isStale(r, now));
  const unconfirmed = [...(all.offers?.offers || []), ...(all.facts?.facts || [])].filter((r) => (r.status === 'unconfirmed' || r.status === 'banned') && (!r.scope || sameScope(r.scope, scope)));
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
    add('voice', 'VOICE: match tone, never paste as new copy; recheck implied SKU, size/range and offer facts', [
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
  const head = [`ORG CONTEXT SLICE: ${level}${kind ? ` for ${aJob(kind)}` : ''} | ${s.business || s.site || 'unnamed'} | read ${s.today}`, 'Use dated, supported facts only. Read coverage gaps and recheck stale assertions; restrictions still apply.'];
  if (memory.review.some((r) => r.state === 'unscoped')) head.push('LEGACY UNSCOPED EVIDENCE: legacy FACTS/LIVE OFFERS below are readable local source notes, not verified durable facts. Review ownership before cross-job reuse. Use --verified for scoped facts only.');
  const safe = (value) => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
  const memoryLines = [
    ...memory.facts.map((r) => `VERIFIED FACT DATA: ${safe({ key: memoryKey(r), value: r.value, source: r.source, captured_at: r.captured_at, evidence_id: r.evidence_id, provenance: r.provenance })}`),
    ...memory.unresolved.map((r) => `UNRESOLVED ${r.needed ? 'DEPENDENT' : 'OPTIONAL'} FACT: ${safe({ key: r.fact_key, state: r.state, alternatives: r.alternatives.map((a) => ({ value: a.value, source: a.source, captured_at: a.captured_at, evidence_id: a.evidence_id })) })}. Omit this claim; unrelated local drafts can proceed.`),
    ...memory.restrictions.map((r) => `REVOKED FACT: ${safe(r)}. Do not use until an explicit owner correction supersedes this decision.`),
    ...(memory.rejected.length ? [`WITHHELD: ${memory.rejected.length} out-of-scope or instruction-bearing records; no content imported as authority.`] : []),
  ];
  const fastStale = stale.filter((r) => FAST_KINDS.includes(r.kind)).length;
  if (fastStale && sells) head.push(`STOP: ${fastStale} price, offer, stock or shipping line${fastStale === 1 ? ' is' : 's are'} stale. ${s.next[0]}`);
  const missing = s.needed.filter((id) => s.parts.find((p) => p.id === id).state === 'missing');
  if (missing.length) head.push(`MISSING: ${missing.join(', ')}. ${s.next.find((n) => /capture|by hand/i.test(n)) || ''}`.trim());
  // Mandatory foundation and all disallowed facts precede optional compact legacy context.
  const restrictions = unconfirmed.filter((r) => r.status === 'banned').map((r) => `- ${String(r.status).toUpperCase()}: ${r.value}${r.note ? ` (${r.note})` : ''}`);
  const out = [...head, ...foundation.blocks.flatMap((b) => ['', b.text]), ...memoryLines, ...(restrictions.length ? ['', 'MANDATORY RESTRICTIONS (never treat as live facts)', ...restrictions] : [])];
  if (foundation.missing.length || foundation.stale.length || foundation.thin.length) out.push('', `FOUNDATION GAPS: ${[...foundation.missing.map((f) => `${f} missing`), ...foundation.stale.map((f) => `${f} stale`), ...foundation.thin.map((f) => `${f} thin`)].join('; ')}. Retrieve or refresh these before relying on them.`);
  const mandatoryWords = words(out.join(' '));
  let left = Math.max(0, SLICE_WORDS[level] - mandatoryWords), carry = 0;
  const omitted = [];
  for (const b of blocks) {
    let room = Math.min(left, caps[b.id] + carry) - words(b.head), shown = 0; if (room < 12) { omitted.push({ file: b.file, lines: b.lines.length }); continue; }
    const lines = [];
    for (const l of b.lines) { const w = words(l); if (w > room - 6) break; lines.push(l); room -= w; shown++; }
    if (!shown) { omitted.push({ file: b.file, lines: b.lines.length }); continue; }
    if (shown < b.lines.length) { omitted.push({ file: b.file, lines: b.lines.length - shown }); lines.push(`- (${b.lines.length - shown} more in ${b.file})`); room -= 5; }
    const used = words(b.head) + lines.reduce((n, l) => n + words(l), 0);
    carry = Math.max(0, caps[b.id] + carry - used); left -= used; out.push('', b.head, ...lines);
  }
  const overflow = mandatoryWords > SLICE_WORDS[level];
  if (overflow) out.push('', `CONTEXT OVERFLOW: required foundation is ${mandatoryWords} words, above the ${SLICE_WORDS[level]}-word compact budget. It is retained in full; narrow task scope or use the full files. Do not discard restrictions.`);
  return { ok: s.ok && !foundation.missing.length && !foundation.stale.length && !foundation.thin.length && !overflow, text: out.join('\n'), words: words(out.join(' ')), memory, coverage: { included: foundation.included, missing: foundation.missing, stale: foundation.stale, thin: foundation.thin, omitted }, overflow };
}

// ---------- ask and import: the org context question at intake ----------
/** What to put in the intake message about the org context: nothing, a note that the saved one is used, or the question. */
function askText(ctx, { now = new Date(), kind = null } = {}) {
  const s = statusOf(ctx, { now, kind }), imports = importsOf(ctx);
  if (s.level === 'none') return { ask: false, text: `No org context is needed for ${kind ? aJob(kind) : 'this job'}. Leave it out of your questions.` };
  if (s.exists || imports.length) {
    const name = s.business || s.site || (imports.length ? imports[0] : 'this business');
    const stale = s.stale_parts.length ? ` Its ${s.stale_parts.join(' and ')} ${s.stale_parts.length === 1 ? 'is' : 'are'} out of date: ask "Your ${s.stale_parts.join(' and ')} were last checked a while ago. Still right, or should I check the site again?"` : '';
    return { ask: !!stale, text: `An org context is saved for ${name}${s.exists ? ` (newest line ${newest(s.parts.map((p) => p.newest)) || 'undated'})` : ''}. Do not ask whether they have one. Say in one line that you will use it.${stale}${imports.length && !s.exists ? ` Imported and not yet sorted: ${imports.join(', ')}. Read it and move each fact into facts.json and voice.md, with "imported" as the source and the date it was given.` : ''}` };
  }
  return { ask: true, text: ['Put this question in your intake message, as written:', '', 'Do you have an org context (a brand guide, brand file or folder about your business) I should use?', '  a) Yes: attach the file or folder, or paste a link', '  b) No: send your store URL and I will build one now and keep it for every later job', '', `If (a): save what they give you and run node ${toolPath('org-context.mjs')} import <file or folder>. A link: open it, save the page as a file, then import it.`, `If (b): node ${toolPath('capture-brand-dna.mjs')} <store url>, then node ${toolPath('org-context.mjs')} migrate.`].join('\n') };
}
function importsOf(ctx) { const d = path.join(orgDir(ctx), 'imported'); return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => !f.startsWith('.')).sort() : []; }
/** Keeps what the client already has. An org-context or brand-file folder (facts.json, voice.md...) is taken in whole; any other file is kept under imported/. */
function importBrand(ctx, src, { now = new Date(), scope = null } = {}) {
  const destination = scopeCheck(ctx, scope); if (!destination.ok) throw new Error(destination.reason);
  if (!src) throw new Error('Say what to import: node org-context.mjs import <file or folder>.');
  if (/^https?:\/\//i.test(src)) throw new Error('This tool opens no network connection. Open the link, save the page or file, then import that. If the link is the store itself, run capture-brand-dna.mjs on it instead.');
  const from = path.resolve(src);
  if (!fs.existsSync(from)) throw new Error(`Nothing at ${src}.`);
  const dir = orgDir(ctx), stamp = day(now), done = [];
  fs.mkdirSync(dir, { recursive: true });
  const known = PARTS.map((p) => p.file);
  if (fs.statSync(from).isDirectory()) {
    const inner = [FOLDER, OLD_FOLDER].map((f) => path.join(from, f)).find((d) => fs.existsSync(d)) || from;
    const sourceScope = readJson(path.join(inner, 'scope.json'));
    if (fs.existsSync(path.join(inner, 'scope.json')) && !sameScope(sourceScope, scope)) throw new Error('Imported org context scope mismatch; no source content copied.');
    const parts = fs.readdirSync(inner).filter((f) => known.includes(f));
    if (parts.length) {
      for (const f of parts) { const to = path.join(dir, f); if (fs.existsSync(to)) { fs.mkdirSync(path.join(dir, 'history'), { recursive: true }); fs.copyFileSync(to, path.join(dir, 'history', `${stamp}-before-import-${f}`)); } fs.copyFileSync(path.join(inner, f), to); done.push(f); }
    } else {
      fs.mkdirSync(path.join(dir, 'imported'), { recursive: true });
      for (const f of fs.readdirSync(from).filter((x) => fs.statSync(path.join(from, x)).isFile())) { fs.copyFileSync(path.join(from, f), path.join(dir, 'imported', f)); done.push(`imported/${f}`); }
    }
  } else {
    fs.mkdirSync(path.join(dir, 'imported'), { recursive: true });
    const name = path.basename(from); fs.copyFileSync(from, path.join(dir, 'imported', name)); done.push(`imported/${name}`);
  }
  fs.mkdirSync(path.join(dir, 'history'), { recursive: true });
  fs.appendFileSync(path.join(dir, 'history', 'changes.md'), `\n## ${stamp}: imported from the client\n${done.map((f) => `- ${f} (from ${path.basename(from)})`).join('\n')}\n`);
  const whole = done.some((f) => known.includes(f));
  return { dir: slash(path.relative(process.cwd(), dir) || dir), done, next: whole ? `Run node ${toolPath('org-context.mjs')} status to see what is fresh.` : `Read ${done.join(', ')} and move each fact into facts.json and each real brand line into voice.md, with "imported: <file>" as the source and today's date. Then run status.` };
}

// ---------- command line ----------
function parseArgs(argv) {
  const o = { _: [], dir: 'context' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') o.help = true; else if (a === '--json') o.json = true; else if (a === '--verified') o.verified = true;
    else if (['--dir', '--for', '--today', '--job', '--kept', '--killed', '--more', '--from', '--out', '--owner', '--workspace', '--keys'].includes(a)) { if (argv[i + 1] === undefined) throw new Error(`${a} needs a value.`); o[a.slice(2)] = argv[++i]; }
    else if (a.startsWith('--')) throw new Error(`Unknown option ${a}. Run with --help.`);
    else o._.push(a);
  }
  return o;
}
const HELP = ORG_HELP;
function storeMain(argv = process.argv.slice(2), print = console.log) {
  let o; try { o = parseArgs(argv); } catch (e) { console.error(e.message); return 2; }
  const cmd = o._[0];
  if (o.help || !cmd) { print(HELP); return o.help ? 0 : 2; }
  const ctx = path.resolve(o.dir), asOf = o.today, now = asOf ? new Date(/T/.test(asOf) ? asOf : `${asOf}T12:00:00Z`) : new Date();
  const scope = o.owner && o.workspace ? { owner_id: o.owner, workspace_id: o.workspace } : null, requiredKeys = o.keys ? o.keys.split(',').filter(Boolean) : [];
  if (Number.isNaN(now.getTime())) { console.error('--today must be a date such as 2026-11-10.'); return 2; }
  if (o.for) {
    const resolved = jobKindOf(o.for);
    if (resolved.unknown || !Object.hasOwn(SLICE_BY_KIND, resolved.kind)) { console.error(`Unknown kind "${o.for}". Use one of: ${Object.keys(SLICE_BY_KIND).join(', ')}.`); return 2; }
    o.for = resolved.kind;
  }
  try {
    if (cmd === 'status') {
      const s = statusOf(ctx, { now, kind: o.for || null, scope, requiredKeys });
      if (s.exists && !scope) writeIndex(ctx, now);
      print(o.json ? JSON.stringify(s, null, 1) : statusText(s)); return s.ok ? 0 : 1;
    }
    if (cmd === 'slice') {
      const level = o._[1] || (o.for ? SLICE_BY_KIND[o.for] : null);
      if (!level) { console.error(`Say which slice: ${SLICES.join(', ')}. Or give --for <kind> and the right one is chosen.`); return 2; }
      const r = sliceText(ctx, level, { now, kind: o.for || null, scope, requiredKeys, verifiedOnly: !!o.verified });
      if (!o.out || !r.ok) { print(r.text); return r.ok ? 0 : 1; }
      // --out writes the slice as UTF-8 itself, so a shell redirect cannot change its encoding.
      fs.mkdirSync(path.dirname(path.resolve(o.out)), { recursive: true }); fs.writeFileSync(path.resolve(o.out), `${r.text}\n`);
      print(`Wrote the ${level} slice to ${slash(o.out)} (${r.words ?? words(r.text)} words). Read that file, not the whole org context.`);
      return 0;
    }
    if (cmd === 'learn') { const r = learn(ctx, { job: o.job, kept: o.kept, killed: o.killed, more: o.more, now }); print(`Added to ${r.file}:\n## ${r.entry.title}\n${r.entry.lines.join('\n')}`); return 0; }
    if (cmd === 'migrate') {
      const r = syncBrandFile(ctx, { now, everything: true, from: o.from || null });
      if (!r.mapping.length) { print(`Nothing to build from in ${slash(path.relative(process.cwd(), ctx) || ctx)}: no brand-dna.json, facts.md, voice.md, references.md, taste-brief.md or old brand folder.`); return 1; }
      print([`Org context at ${r.dir} (${r.written.length ? `wrote ${r.written.join(', ')}` : 'already up to date'}). What went where:`, ...r.mapping.map((m) => `- ${m}`), ...(r.changes.length ? ['Changed since last time:', ...r.changes.slice(0, 12).map((c) => `- ${c.text}`)] : []), `Now run: node ${toolPath('org-context.mjs')} status`].join('\n')); return 0;
    }
    if (cmd === 'ask') { const r = askText(ctx, { now, kind: o.for || null }); print(o.json ? JSON.stringify(r, null, 1) : r.text); return 0; }
    if (cmd === 'import') { const r = importBrand(ctx, o._[1], { now, scope }); print([`Kept in ${r.dir}: ${r.done.join(', ') || 'nothing'}.`, r.next].join('\n')); return r.done.length ? 0 : 1; }
    console.error(`Unknown command "${cmd}". Use status, slice, learn, migrate, ask or import.`); return 2;
  } catch (e) { console.error(e.message); return 2; }
}

return { SCHEMA, INDEX_FILE, FRESH_DAYS, FAST_KINDS, SLICES, SLICE_PARTS, SLICE_WORDS, SLICE_BY_KIND, SELLING_KINDS, PARTS, day, ageDays, volatileOf, isStale, findDate, kindOf, parseEntry, recordsFromCapture, lookFromCapture, mergeRecords, recordFromLine, recordsFromMarkdown, brandDir, statusOf, syncBrandFile, learn, sliceText, askText, importBrand, storeMain, writeIndex };
})();
export const { SCHEMA, INDEX_FILE, FRESH_DAYS, FAST_KINDS, SLICES, SLICE_PARTS, SLICE_WORDS, SLICE_BY_KIND, SELLING_KINDS, PARTS: STORE_PARTS, day: dateOf, ageDays, volatileOf, isStale, findDate, kindOf: factKindOf, parseEntry, recordsFromCapture, lookFromCapture, mergeRecords, recordFromLine, recordsFromMarkdown, brandDir, statusOf, syncBrandFile, learn, sliceText, askText, importBrand, storeMain, writeIndex } = store;

/** The sections of index.md: each one's files and state, and the link to the store memory (never copied here). */
const PARTS_IN_TABLE = new Set(['facts.json', 'offers.json', 'references.md', 'worked.md']);
function sectionLines(ctx, now) {
  const r = checkBrain(ctx, { now }), byFile = new Map(r.parts.map((p) => [p.file, p]));
  const state = (f) => { const p = byFile.get(f); if (p) return p.state; return fs.existsSync(path.join(orgDir(ctx), f)) ? 'kept' : 'missing'; };
  // Facts, offers, references and results are in the table above, so they are not listed twice.
  const listed = SECTIONS.filter((s) => s.n || !s.files.some((f) => PARTS_IN_TABLE.has(f)));
  return [`Sections (score ${r.score}/100; \`org-context.mjs check\` says what to fill, \`template\` what each holds):`,
    ...listed.map((s) => `- ${s.n ? `${s.n}. ` : ''}${s.title} (${s.files.join(', ')}): ${s.files.map(state).join(', ')}`), '',
    'Store numbers and lessons: ../MEMORY.md (the store memory). They are linked here, never copied.', ''];
}

// Intervention-memory design informed by NotFair, deed0436d0c68cbc20a78523fffc67edd12aa25c.
// MIT License
//
// Copyright (c) 2026 Toprank Contributors
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// This validates local evidence consistency, not connector authenticity, causal impact or permissions.
export function validateInterventionEpisode(episode, { scope, root, now = new Date() } = {}) {
  const issues = [], artifacts = {}, fields = ['owner_id', 'workspace_id', 'brand_id', 'platform', 'account_id'];
  const text = value => typeof value === 'string' && value.trim().length > 0;
  // Date.parse normalizes impossible days and accepts ambiguous local times; neither is evidence.
  const date = value => {
    if (typeof value !== 'string') return false;
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
    if (!m) return false;
    const [, y, mo, d, h, mi, se, offset] = m, year = +y, month = +mo;
    const days = [31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year < 1 || month < 1 || month > 12 || +d < 1 || +d > days[month - 1] || +h > 23 || +mi > 59 || +se > 59) return false;
    if (offset !== 'Z' && (+offset.slice(1, 3) > 14 || +offset.slice(4) > 59 || (+offset.slice(1, 3) === 14 && +offset.slice(4) !== 0))) return false;
    return Number.isFinite(Date.parse(value));
  };
  const timezone = value => { try { if (!text(value)) return false; new Intl.DateTimeFormat('en', { timeZone: value }); return true; } catch { return false; } };
  const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const target = value => object(value) && text(value.type) && text(value.id);
  const matchesTarget = value => target(value) && target(episode.change?.target) && value.type === episode.change.target.type && value.id === episode.change.target.id;
  const stateMatches = (expected, observed, depth = 0) => {
    if (depth > 20) return false;
    if (expected === null || typeof expected !== 'object') return expected === observed && (typeof expected !== 'number' || Number.isFinite(expected));
    if (Array.isArray(expected)) return Array.isArray(observed) && expected.length === observed.length && expected.every((v, i) => stateMatches(v, observed[i], depth + 1));
    return object(observed) && Object.keys(expected).every(key => Object.hasOwn(observed, key) && stateMatches(expected[key], observed[key], depth + 1));
  };
  const sameScope = value => fields.every(key => text(scope?.[key]) && value?.[key] === scope[key]);
  const issue = (code, detail) => issues.push({ code, detail });
  if (!Number.isFinite(+now)) throw new Error('A valid review time is required.');
  if (!fields.every(key => text(scope?.[key]))) throw new Error('Explicit owner, workspace, brand, platform and account scope is required.');
  if (!episode || typeof episode !== 'object' || Array.isArray(episode)) throw new Error('An intervention record is required.');
  if (!sameScope(episode.scope)) return { schema_version: 'intervention-review/v1', episode_id: null, eligible_for_review: false,
    status: 'unresolved', issues: [{ code: 'scope_mismatch', detail: 'Episode does not match the requested client and account; content withheld.' }],
    source_hashes: {}, confounders: [], counterevidence: [], lesson_status: 'proposed', limitation: 'Foreign-scope evidence was not inspected or disclosed.' };
  if (episode.schema_version !== 'intervention/v1') issue('invalid_schema', 'Expected intervention/v1.');
  for (const key of ['id', 'hypothesis', 'success_metric', 'guardrail_metric']) if (!text(episode[key])) issue('missing_field', key);
  for (const key of ['summary', 'authorization_ref']) if (!text(episode.change?.[key])) issue('missing_field', `change.${key}`);
  if (!target(episode.change?.target)) issue('invalid_target', 'change.target requires explicit type and id.');
  if (!object(episode.change?.expected) || !Object.keys(episode.change.expected).length || !stateMatches(episode.change.expected, episode.change.expected)) issue('invalid_expected_state', 'change.expected requires a nonempty bounded JSON object.');
  if (!date(episode.change?.at) || Date.parse(episode.change.at) > +now) issue('invalid_change_date', 'Change time is invalid or in the future.');
  if (!date(episode.maturity?.not_before) || !text(episode.maturity?.rule)) issue('invalid_maturity', 'An explicit outcome maturity date and rule are required.');
  else if (Date.parse(episode.maturity.not_before) < Date.parse(episode.change?.at)) issue('invalid_maturity', 'Maturity cannot precede the change.');
  else if (Date.parse(episode.maturity.not_before) > +now) issue('immature', 'The outcome review date has not arrived.');
  for (const key of ['confounders', 'counterevidence']) if (!Array.isArray(episode[key]) || !episode[key].every(text)) issue('missing_review', `${key} must be an array; [] explicitly records none observed.`);
  if (episode.lesson?.status && episode.lesson.status !== 'proposed') issue('unreviewed_promotion', 'An episode cannot promote a lesson or change semantic memory.');
  const base = root ? fs.realpathSync(root) : null;
  for (const kind of ['baseline', 'receipt', 'readback', 'outcome']) {
    const ref = episode.evidence?.[kind];
    try {
      if (!base || !ref || !/^[a-f0-9]{64}$/.test(ref.sha256 ?? '')) throw new Error('A pinned local artifact and SHA-256 are required.');
      if (typeof ref.path !== 'string' || path.isAbsolute(ref.path) || ref.path.includes('\\') || ref.path.includes(':') || ref.path.split('/').some(p => !p || p === '.' || p === '..' || p.startsWith('.'))) throw new Error('Artifact must be a safe relative path inside this job.');
      let file = base;
      for (const part of ref.path.split('/')) { file = path.join(file, part); if (fs.lstatSync(file).isSymbolicLink()) throw new Error('Artifact links are not followed.'); }
      const relative = path.relative(base, fs.realpathSync(file));
      if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.statSync(file).isFile() || fs.statSync(file).size > 1024 * 1024) throw new Error('Artifact must be a regular bounded job file.');
      const raw = fs.readFileSync(file);
      if (createHash('sha256').update(raw).digest('hex') !== ref.sha256) throw new Error('Artifact hash changed.');
      const data = JSON.parse(raw.toString('utf8'));
      if (!sameScope(data.scope)) throw new Error('Artifact client/account scope does not match.');
      if (data.intervention_id !== episode.id || !matchesTarget(data.target)) throw new Error('Artifact intervention or target does not match this change.');
      if (!text(data.source?.locator) || !date(data.source?.captured_at) || Date.parse(data.source.captured_at) > +now) throw new Error('Artifact source locator and valid capture time are required.');
      artifacts[kind] = data;
    } catch (error) { issue('invalid_artifact', `${kind}: ${error.message}`); }
  }
  if (artifacts.receipt) for (const key of ['accepted', 'success', 'partial_failure']) {
    if (Object.hasOwn(artifacts.receipt, key) && typeof artifacts.receipt[key] !== 'boolean') issue('invalid_receipt_status', `${key} must be a boolean when present.`);
  }
  if (artifacts.receipt && (artifacts.receipt.accepted !== true || artifacts.receipt.success === false || artifacts.receipt.partial_failure === true)) issue('change_not_accepted', 'A change ID alone does not establish acceptance; failed or partial writes need separate episodes.');
  if (artifacts.receipt && Date.parse(artifacts.receipt.source.captured_at) < Date.parse(episode.change?.at)) issue('receipt_before_change', 'An older receipt cannot verify this intervention.');
  if (artifacts.readback && (artifacts.readback.matches_expected !== true || !stateMatches(episode.change?.expected, artifacts.readback.observed) || Date.parse(artifacts.readback.source.captured_at) < Date.parse(episode.change?.at))) issue('readback_unverified', 'Fresh object readback must match the expected change.');
  for (const kind of ['baseline', 'outcome']) {
    const data = artifacts[kind]; if (!data) continue;
    const window = data.window;
    if (!date(window?.start) || !date(window?.end) || Date.parse(window.start) >= Date.parse(window.end) || Date.parse(window.end) > Date.parse(data.source.captured_at) || !timezone(window?.timezone)) issue('invalid_window', `${kind}: valid offset timestamps and reporting timezone required.`);
    if (kind === 'baseline' && Date.parse(window?.end) > Date.parse(episode.change?.at)) issue('baseline_after_change', 'Baseline must precede the intervention.');
    if (kind === 'outcome' && Date.parse(window?.start) < Date.parse(episode.change?.at)) issue('outcome_before_change', 'Outcome window must follow the intervention.');
    if (kind === 'outcome' && (data.mature !== true || Date.parse(data.source.captured_at) < Date.parse(episode.maturity?.not_before))) issue('immature', 'Outcome data is not demonstrated mature at its capture time.');
    const coverage = data.coverage;
    if (coverage?.complete !== true || !Number.isFinite(coverage?.represented) || !Number.isFinite(coverage?.total) || coverage.total <= 0 || coverage.represented !== coverage.total) issue('partial_data', `${kind}: partial or unknown coverage requires further evidence before outcome review.`);
    for (const key of [episode.success_metric, episode.guardrail_metric]) {
      const metric = data.metrics?.[key];
      if (!Number.isFinite(metric?.value) || !text(metric?.unit) || !text(metric?.definition)) issue('missing_metric', `${kind}.${key}: finite value, unit and definition required; undefined ratios are not zero.`);
    }
  }
  if (artifacts.baseline && artifacts.outcome) {
    if (artifacts.baseline.window?.timezone !== artifacts.outcome.window?.timezone) issue('incomparable_windows', 'Timezone differs; normalize before review.');
    for (const key of [episode.success_metric, episode.guardrail_metric]) {
      const a = artifacts.baseline.metrics?.[key], b = artifacts.outcome.metrics?.[key];
      if (a?.unit !== b?.unit || a?.definition !== b?.definition) issue('incomparable_metric', key);
    }
  }
  return { schema_version: 'intervention-review/v1', episode_id: episode.id ?? null, eligible_for_review: issues.length === 0,
    status: issues.length ? 'unresolved' : 'review_ready', issues, source_hashes: Object.fromEntries(Object.keys(artifacts).map(key => [key, episode.evidence[key].sha256])),
    confounders: episode.confounders ?? [], counterevidence: episode.counterevidence ?? [], lesson_status: 'proposed',
    limitation: 'Local consistency and hash checks only. No connector authenticity, causal improvement, permission grant or lesson promotion is established. Keep raw receipts and review confounders; persist corrections as new episode revisions.' };
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
const STORE_COMMANDS = new Set(['status', 'slice', 'learn', 'migrate', 'import']);
export const COMMANDS = Object.freeze(['template', 'status', 'slice', 'build', 'check', 'gate', 'ask', 'learn', 'migrate', 'import', 'source', 'ads', 'reviews', 'segments', 'creatives', 'plan', 'voice-check', 'bind', 'remember', 'resolve', 'memory', 'intervention-check']);
export function main(argv = process.argv.slice(2), print = console.log) {
  const a = parseArgs(argv), [cmd, ...rest] = a._;
  if (a.help || a.h) { print(ORG_HELP); return 0; }
  const ctx = path.resolve(String(a.dir || 'context')), now = a.today ? new Date(`${a.today}T12:00:00Z`) : new Date(), kind = typeof a.for === 'string' ? a.for : null;
  const scope = typeof a.owner === 'string' && typeof a.workspace === 'string' ? { owner_id: a.owner, workspace_id: a.workspace } : null, requiredKeys = typeof a.keys === 'string' ? a.keys.split(',').filter(Boolean) : [];
  // An older context/brand-file/ folder keeps working; say once how to move it (on stderr, so --json stays clean).
  const note = cmd && cmd !== 'migrate' && cmd !== 'template' ? moveNote(ctx) : null;
  if (note) console.error(note);
  try {
    // A bound context never exposes or modifies another owner's material through the CLI.
    if (!['template', 'bind'].includes(cmd)) { const checked = scopeCheck(ctx, scope); if (!checked.ok) throw new Error(checked.reason); }
    if (cmd === 'migrate') {
      const m = moveOldFolder(ctx);
      if (m.moved) print(['MOVED:', ...m.done.map((d) => `- ${d}`), ''].join('\n'));
      if (m.note) print(m.note);
      const code = storeMain(argv, m.moved ? (line) => { if (!/^Nothing to build from/.test(line)) print(line); } : print);
      return m.moved ? 0 : code;
    }
    if (STORE_COMMANDS.has(cmd)) return storeMain(argv, print);
    switch (cmd) {
      case 'intervention-check': {
        if (!rest[0]) throw new Error('intervention-check <jobs/run/intervention.json>');
        const file = path.resolve(rest[0]);
        const result = validateInterventionEpisode(JSON.parse(fs.readFileSync(file, 'utf8')), { scope: { ...scope, brand_id: a.brand, platform: a.platform, account_id: a.account }, root: path.dirname(file), now });
        print(JSON.stringify(result, null, 2)); return result.eligible_for_review ? 0 : 1;
      }
      case 'bind': print(JSON.stringify(bindContextScope(ctx, scope))); return 0;
      case 'remember': { if (!rest[0]) throw new Error('remember <record.json>'); print(JSON.stringify(rememberFact(ctx, JSON.parse(fs.readFileSync(rest[0], 'utf8')), { scope, now }))); return 0; }
      case 'resolve': print(JSON.stringify(resolveFact(ctx, { scope, now, factKey: a.key, action: a.action, value: a.value, source: a.source, kind: a.kind || null, supersedes: a.supersedes || null }))); return 0;
      case 'memory': { const memory = readFactMemory(ctx, { scope, now, requiredKeys }); print(JSON.stringify(memory, null, 2)); return memory.ready ? 0 : 1; }
      case 'template': print(templateText()); return 0;
      case 'build': { const r = buildBrain(ctx, { from: typeof a.from === 'string' ? a.from : null, site: typeof a.site === 'string' ? a.site : null, now }); print(['BUILT:', ...r.done.map((d) => `- ${d}`), ...(r.skipped.length ? ['SKIPPED:', ...r.skipped.map((d) => `- ${d}`)] : []), '', checkText(r.check)].join('\n')); return 0; }
      case 'gate': { const r = gateBrain(ctx, { now, kind, scope, requiredKeys }); print(r.text); return r.ok ? 0 : 1; }
      case 'check': { const r = checkBrain(ctx, { now, kind }); print(a.json ? JSON.stringify(r, null, 2) : checkText(r)); return r.ready ? 0 : 1; }
      case 'ask': { const r = askBrain(ctx, { now, kind }); print(a.json ? JSON.stringify(r, null, 1) : r.text); return 0; }
      case 'source': { if (rest.length < 2) throw new Error('source <what> <where> --status provided|public|no-access'); print(addSource(ctx, rest[0], rest[1], { status: String(a.status || 'provided'), note: typeof a.note === 'string' ? a.note : '', now })); return 0; }
      case 'ads': { if (!rest[0]) throw new Error('ads <file> --source library|account|competitor:<name>'); const r = ingestAds(ctx, readRows(rest[0]), { source: String(a.source || 'library'), now }); print(`Took ${r.ads} ads into ${r.file}. ${r.patterns.long_running} ran 30 days or more; performance is unknown. Median primary text ${r.patterns.body_words_median} words.`); return 0; }
      case 'reviews': { if (!rest[0]) throw new Error('reviews <file>'); const r = ingestReviews(ctx, readRows(rest[0]), { now }); print(`Read ${r.reviews} reviews into foundation/why-they-buy.md and the voice bank. Top themes: ${r.themes.slice(0, 4).map((t) => `${t.id} ${t.n}`).join(', ')}.`); return 0; }
      case 'segments': { if (!rest.length) throw new Error('segments <breakdown.csv> [more.csv ...]'); const r = ingestSegments(ctx, rest, { now }); print(`Wrote data/segments.md: ${r.tables.join('; ')}. Under-spent winners: ${r.winners.length}. Over-spent: ${r.over.length}.`); return 0; }
      case 'creatives': { if (!rest[0]) throw new Error('creatives <ad_results.csv> [--copy <creatives file>]'); const r = ingestCreatives(ctx, rest[0], { copyFile: typeof a.copy === 'string' ? a.copy : null, now }); print(`Wrote data/creatives.md: ${r.judged} of ${r.ads} ads had enough data to judge.`); return 0; }
      case 'plan': { const r = planCreatives(ctx, { n: Number(a.n) || 20, now }); if (typeof a.out === 'string') { write(path.resolve(a.out), r.text); print(`Wrote ${a.out}: ${r.slots.length} rows to fill.`); } else print(r.text); return 0; }
      case 'voice-check': { if (!rest[0]) throw new Error('voice-check <draft file> [--ads]'); const r = voiceCheck(ctx, read(rest[0]) ?? '', { ads: !!a.ads }); print(r.text); return r.ok ? 0 : 1; }
      default: print(ORG_HELP); return 2;
    }
  } catch (err) { print(`org-context: ${err.message}`); return 2; }
}
/** Runs a renamed tool name (brand-brain.mjs, brand-file.mjs): one line to say so, then the same command here. */
export function forward(oldName, argv = process.argv.slice(2), print = console.log) {
  console.error(`renamed: org-context.mjs (${oldName} still works and runs it)`);
  return main(argv, print);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
