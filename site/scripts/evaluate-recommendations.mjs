// Offline recommendation evaluation: library search, "what next" links and workflow step choice.
// Labels: test/fixtures/recommendation-eval.json (hand-labelled from the catalogue, not from search output).
// No model calls and no network. Usage:
//   node scripts/evaluate-recommendations.mjs [--fixture test/fixtures/x.json] [--out ../reports/x.json] [--legacy-order] [--only search|keywords|next|composer[,...]] [--keyword-sample N] [--verbose]
// --only keywords: catalogue-wide keyword search, queries derived mechanically from every item's name (scripts/keyword-queries.mjs);
//   hit@1 / hit@5 by item type and query kind. --keyword-sample N scores about 1 in N items, picked by slug hash (quicker). Not part of the default run.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { build } from 'esbuild';
import crypto from 'node:crypto';
import { buildLibrarySearchIndex, searchLibraryIndex } from '../src/lib/library-search-core.ts';
import { makeSearchDocument } from '../src/lib/search-document.mjs';
import { classificationText } from '../src/lib/catalogue-taxonomy.mjs';
import { decodeCatalogue, freeSelection, candidatesFor, startPicks } from '../src/lib/composer-core.ts';

const SITE = path.resolve(import.meta.dirname, '..');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] ?? true; };
const onlyArg = arg('--only'), verbose = process.argv.includes('--verbose'), legacy = process.argv.includes('--legacy-order');
const modes = typeof onlyArg === 'string' ? new Set(onlyArg.split(',')) : null, wants = mode => mode === 'keywords' ? !!modes?.has(mode) : !modes || modes.has(mode);
// --fixture test/fixtures/recommendation-holdout.json scores the held-out set that ranking was not tuned on.
const fixture = JSON.parse(fs.readFileSync(path.join(SITE, arg('--fixture') || 'test/fixtures/recommendation-eval.json'), 'utf8'));
const publicRoot = path.join(SITE, 'public');
const raw = JSON.parse(fs.readFileSync(path.join(publicRoot, 'data/blocks.json'), 'utf8'));

// The browser's Block shape (lib/data.ts unwire), so ranking sees what the library page sees.
const port = p => p.endsWith('?') ? { type: p.slice(0, -1), required: false } : { type: p, required: true };
const unwire = ({ inputs, outputs, steps, tested, ...rest }) => ({
  name: '', summary: '', task: 'set-up-ai', category: 'general', type: 'skill', role: 'make', job: 'ops', level: 'intermediate', thinking: 'medium',
  boards: [], uses: [], origin: 'own', version: '1.0.0', twin: null, minds: [], usedIn: 0, tested: tested ? { on: '', result: 'pass', business: '' } : null,
  ...rest, headline: rest.headline ?? rest.name,
  inputs: (inputs ?? []).map(port), outputs: (outputs ?? []).map(port), steps: (steps ?? []).map(s => typeof s === 'string' ? { uses: s, note: '' } : { uses: s[0], note: s[1] }),
});
const blocks = raw.blocks.map(unwire);
const bySlug = Object.fromEntries(blocks.map(b => [b.slug, b]));
const catalogue = { ...raw, blocks, bySlug };

// Browser-only helpers (lib/data.ts pulls in React state) are bundled once for Node.
async function bundle(entry) {
  const out = path.join(os.tmpdir(), `abb-eval-${path.basename(entry, '.ts')}-${process.pid}.mjs`);
  await build({ entryPoints: [path.join(SITE, entry)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', jsx: 'automatic' });
  try { return await import('file://' + out.replace(/\\/g, '/')); } finally { fs.rmSync(out, { force: true }); }
}

const round = (n, d = 3) => Number(n.toFixed(d));
const report = { measuredOn: new Date().toISOString(), fixture: { search: fixture.search.length, goals: fixture.goals.length, next: fixture.next.length }, catalogue: { blocks: blocks.length, built: raw.built } };

// ---------------- Search ----------------
let searchOne;
if (wants('search') || wants('keywords')) {
  const started = performance.now();
  const minds = new Map((raw.minds?.roster ?? []).map(m => [m.slug, m]));
  const metadata = buildLibrarySearchIndex(blocks.map(b => makeSearchDocument(b, b.type === 'mind' ? { when: minds.get(b.slug)?.useCases ?? [] } : {}, { extraText: classificationText(b) })), 'a'.repeat(64));
  // The same documents build-library-search.mjs indexes (page fields, page HTML and SKILL.md). Other agents may be
  // rebuilding public/ while this runs, so missing files are read as empty. --fast reuses documents and the built
  // index from an earlier run; query handling and ranking always come from the current source.
  const fast = process.argv.includes('--fast');
  // --fast reuses the built full index while the indexing rules (tokens, intents, documents) are unchanged.
  const rules = crypto.createHash('sha256').update(fs.readFileSync(path.join(SITE, 'src/lib/library-search-core.ts'), 'utf8').split('/** A query')[0] + buildLibrarySearchIndex.toString() + fs.readFileSync(path.join(SITE, 'src/lib/library-search-intents.ts'), 'utf8') + fs.readFileSync(path.join(SITE, 'src/lib/search-document.mjs'), 'utf8')).digest('hex').slice(0, 16);
  const indexCache = path.join(os.tmpdir(), `abb-eval-full-index-${rules}.json`);
  const docsCache = path.join(os.tmpdir(), 'abb-eval-search-documents.json');
  const readDocuments = () => {
    if (fast && fs.existsSync(docsCache)) return JSON.parse(fs.readFileSync(docsCache, 'utf8'));
    const strings = v => typeof v === 'string' ? v.replace(/<[^>]*>/g, ' ') : Array.isArray(v) ? v.map(strings).join(' ') : v && typeof v === 'object' ? Object.values(v).map(strings).join(' ') : '';
    const fields = ['when', 'not_for', 'worked_example', 'you_give', 'you_get', 'how_to_use', 'how_it_works', 'output_shape', 'tweaks', 'judge', 'test', 'improve', 'terms', 'thinkingWhy', 'stepNotes'];
    const read = file => { try { return fs.readFileSync(path.join(publicRoot, file), 'utf8'); } catch { return ''; } };
    const page = slug => { try { return JSON.parse(read(`data/pages/${slug}.json`) || '{}'); } catch { return {}; } };
    const documents = raw.blocks.map(b => { const p = page(b.slug); return makeSearchDocument(b, p, { body: `${fields.map(f => strings(p[f])).join(' ')} ${strings(p.html?.skill)} ${read(`skills/${b.slug}/SKILL.md`)}` }); });
    fs.writeFileSync(docsCache, JSON.stringify(documents));
    return documents;
  };
  const full = fast && fs.existsSync(indexCache) ? JSON.parse(fs.readFileSync(indexCache, 'utf8')) : buildLibrarySearchIndex(readDocuments(), 'a'.repeat(64));
  if (fast && !fs.existsSync(indexCache)) fs.writeFileSync(indexCache, JSON.stringify(full));
  const { reviewedTask } = await import('../src/lib/task-discovery.ts');
  const rankModule = fs.existsSync(path.join(SITE, 'src/lib/library-rank.ts')) && !legacy ? await import('../src/lib/library-rank.ts') : null;
  const isTested = b => b.tested?.result === 'pass';
  const legacyOrder = (hits, suggestion) => (a, b) => {
    const tested = Number(isTested(b)) - Number(isTested(a));
    return (hits.get(b.slug)?.score ?? 0) - (hits.get(a.slug)?.score ?? 0) || tested || Number(b.slug === suggestion?.slug) - Number(a.slug === suggestion?.slug) || Number(!!b.headline) - Number(!!a.headline) || a.name.localeCompare(b.name);
  };
  const indexTerms = full.terms.length;
  searchOne = query => {
    const hits = searchLibraryIndex(metadata, query);
    for (const [slug, hit] of searchLibraryIndex(full, query)) { const old = hits.get(slug); if (!old || hit.score > old.score) hits.set(slug, hit); }
    const suggestion = reviewedTask(query);
    const matched = blocks.filter(b => hits.has(b.slug) || b.slug === suggestion?.slug);
    return rankModule ? rankModule.rankLibraryResults(matched, hits, query, { isTested, suggestion: suggestion?.slug }) : matched.sort(legacyOrder(hits, suggestion));
  };
  if (wants('search')) {
  const rows = [], timings = [];
  for (const item of fixture.search) {
    const t = performance.now(), ranked = searchOne(item.q); timings.push(performance.now() - t);
    const top = ranked.slice(0, 10).map(b => b.slug), expected = new Set(item.expect);
    const first = top.findIndex(s => expected.has(s));
    const top5 = top.slice(0, 5);
    rows.push({ id: item.id, q: item.q, area: item.area, audience: item.audience, rank: first < 0 ? null : first + 1, top1: first === 0, top5: first >= 0 && first < 5, matches: ranked.length, top: top5, distinctTop5: new Set(top5.map(s => bySlug[s]?.name.toLowerCase().replace(/\b(writer|planner|checker|builder|maker|reviewer)\b/g, '').trim())).size });
  }
  const n = rows.length;
  const byArea = {};
  for (const r of rows) { const a = (byArea[r.area] ??= { n: 0, top5: 0, mrr: 0 }); a.n++; a.top5 += r.top5; a.mrr += r.rank && r.rank <= 10 ? 1 / r.rank : 0; }
  for (const a of Object.values(byArea)) { a.top5 = round(a.top5 / a.n); a.mrr = round(a.mrr / a.n); }
  timings.sort((a, b) => a - b);
  report.search = {
    order: rankModule ? 'library-rank.ts' : 'legacy App.tsx order (score, then tested)',
    queries: n,
    top1: round(rows.filter(r => r.top1).length / n), top5: round(rows.filter(r => r.top5).length / n),
    mrr10: round(rows.reduce((s, r) => s + (r.rank && r.rank <= 10 ? 1 / r.rank : 0), 0) / n),
    zeroResults: rows.filter(r => !r.matches).length,
    medianQueryMs: round(timings[Math.floor(n / 2)], 2), p95QueryMs: round(timings[Math.floor(n * 0.95)], 2),
    indexTerms, buildMs: Math.round(performance.now() - started),
    byArea, misses: rows.filter(r => !r.top5).map(r => ({ id: r.id, q: r.q, top: r.top })), rows: verbose ? rows : undefined,
  };
  }
}

// ---------------- Keywords (whole catalogue) ----------------
if (wants('keywords')) {
  const { keywordQueries, scoreKeywords } = await import('./keyword-queries.mjs');
  const sample = Number(arg('--keyword-sample')) || 1;
  // Sampled by a hash of the slug, not catalogue position: adding one item reshuffled every position sample after
  // it, which moved hit@1 between 0.893 and 0.910 with no ranking change (2026-11-03). Hash buckets stay at 0.901-0.904.
  const bucket = slug => crypto.createHash('sha256').update(slug).digest()[0] % sample;
  const queries = keywordQueries(blocks).filter(q => bucket(q.slug) === 0);
  const timings = [];
  const result = scoreKeywords(blocks, queries, q => { const t = performance.now(), ranked = searchOne(q).map(b => b.slug); timings.push(performance.now() - t); return ranked; });
  timings.sort((a, b) => a - b);
  report.keywords = { items: new Set(queries.map(q => q.slug)).size, sample, ...result, medianQueryMs: round(timings[Math.floor(timings.length / 2)] ?? 0, 2), misses: verbose ? result.misses : result.misses.slice(0, 40), notFirst: verbose ? result.notFirst : undefined };
}

// ---------------- Next links ----------------
if (wants('next')) {
  const { planOf } = await import('../../tools/lib/needs.mjs');
  const { suggestNext } = await bundle('src/lib/suggest.ts');
  const describe = t => ({ label: t.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()), what: String(raw.portTypes?.[t] ?? t).replace(/\.$/, '') });
  const score = (list, item) => {
    const good = new Set(item.good), tasks = new Set(item.goodTasks);
    const strict = list.filter(s => good.has(s)).length, lenient = list.filter(s => good.has(s) || tasks.has(bySlug[s]?.task)).length;
    return { strict, lenient, n: list.length };
  };
  const agg = () => ({ links: 0, strict: 0, lenient: 0, empty: 0, recall: 0 });
  const page = agg(), builder = agg(), rows = [];
  for (const item of fixture.next) {
    const b = bySlug[item.slug]; if (!b) continue;
    const next = planOf(b, bySlug, blocks, describe).next.map(x => x.slug);
    const sugg = suggestNext(catalogue, item.slug, new Set([item.slug]), 5).map(x => x.b.slug);
    for (const [list, a] of [[next, page], [sugg, builder]]) {
      const s = score(list, item); a.links += s.n; a.strict += s.strict; a.lenient += s.lenient; a.empty += !s.n;
      a.recall += list.some(x => item.good.includes(x)) ? 1 : 0;
    }
    rows.push({ slug: item.slug, page: next, builder: sugg });
  }
  const fin = a => ({ links: a.links, precisionStrict: round(a.strict / Math.max(1, a.links)), precisionLenient: round(a.lenient / Math.max(1, a.links)), itemsWithAGoodLink: round(a.recall / fixture.next.length), itemsWithNoLinks: a.empty });
  // Generated finance items (tools/finance-expansion) share generic ports; their links must stay in finance work.
  const financeTasks = new Set(fixture.financeTasks ?? []), finance = [];
  const walk = dir => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'item.yaml' && fs.readFileSync(p, 'utf8').includes('generated_from: tools/finance-expansion')) finance.push(path.basename(dir)); } };
  walk(path.resolve(SITE, '../catalogue-items'));
  const f = { items: 0, nextLinks: 0, nextInFinance: 0, chainLinks: 0, chainInFinance: 0, buyerBriefChains: 0, itemsWithNext: 0 };
  for (const slug of finance) {
    const b = bySlug[slug]; if (!b) continue;
    const plan = planOf(b, bySlug, blocks, describe); f.items++;
    f.nextLinks += plan.next.length; f.nextInFinance += plan.next.filter(x => financeTasks.has(bySlug[x.slug]?.task)).length; f.itemsWithNext += plan.next.length > 0;
    f.chainLinks += plan.chain.length; f.chainInFinance += plan.chain.filter(x => financeTasks.has(bySlug[x.slug]?.task)).length;
    f.buyerBriefChains += plan.chain.some(x => x.slug === 'buyer-brief-writer') || plan.needed.some(x => x.maker?.slug === 'buyer-brief-writer');
  }
  const financeNext = { ...f, nextPrecisionFinanceJobs: round(f.nextInFinance / Math.max(1, f.nextLinks)), chainPrecisionFinanceJobs: round(f.chainInFinance / Math.max(1, f.chainLinks)) };
  report.next = { items: fixture.next.length, pageNext: fin(page), builderSuggestNext: fin(builder), financeExpansion: financeNext, rows: verbose ? rows : rows.slice(0, 12) };
}

// ---------------- Composer ----------------
if (wants('composer')) {
  const lib = decodeCatalogue(raw);
  // A ready workflow or coordinator kept as one node runs its own steps, so those count as covered.
  const expand = steps => [...new Set(steps.flatMap(s => [s, ...(bySlug[s]?.steps ?? []).map(x => x.uses)]))];
  const cover = (steps, item) => { const all = expand(steps); return item.steps.filter(group => group.some(s => all.includes(s))).length / item.steps.length; };
  // "Start with" (free mode): does a labelled step lead the picks (top1), or appear among the first five (top5)?
  const agg = { start1: 0, start5: 0, noPicks: 0, free: 0, candidates: 0, freeFull: 0, freeGeneral: 0 }, rows = [];
  for (const item of fixture.goals) {
    const picks = startPicks(catalogue, item.goal, 5).tasks.map(p => p.b.slug), good = new Set(item.steps.flat());
    let freeSteps = [];
    try { freeSteps = freeSelection(lib, item.goal).steps.map(s => s.slug); } catch { /* counted as zero coverage */ }
    const cands = candidatesFor(lib, item.goal).map(b => b.slug);
    const f = cover(freeSteps, item), c = cover(cands, item);
    agg.start1 += good.has(picks[0]); agg.start5 += picks.some(s => good.has(s)); agg.noPicks += !picks.length;
    agg.free += f; agg.candidates += c; agg.freeFull += f === 1; agg.freeGeneral += freeSteps.includes('request-deliverable-drafter');
    rows.push({ id: item.id, goal: item.goal, startPicks: picks, free: round(f, 2), candidates: round(c, 2), freeSteps });
  }
  const n = fixture.goals.length;
  report.composer = {
    goals: n,
    startPicks: { top1: round(agg.start1 / n), top5: round(agg.start5 / n), noPicks: agg.noPicks, note: 'Free mode: a labelled step first, or among the first five "Start with" picks (composer-core startPicks).' },
    freeAssembly: { stepCoverage: round(agg.free / n), fullyCovered: agg.freeFull, usedGeneralTemplate: agg.freeGeneral },
    aiCandidatePool: { stepRecall: round(agg.candidates / n), note: 'Share of expected steps present in the deterministic candidate list sent to the model (no model call made).' },
    rows,
  };
}

const out = arg('--out');
const text = JSON.stringify(report, null, 2);
if (typeof out === 'string') { fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(path.resolve(out), text + '\n'); }
const brief = { keywords: report.keywords && { hit1: report.keywords.hit1, hit5: report.keywords.hit5, queries: report.keywords.n, byType: report.keywords.byType, byKind: report.keywords.byKind, medianQueryMs: report.keywords.medianQueryMs }, search: report.search && { top1: report.search.top1, top5: report.search.top5, mrr10: report.search.mrr10, medianQueryMs: report.search.medianQueryMs, misses: report.search.misses.length }, next: report.next && { page: report.next.pageNext, builder: report.next.builderSuggestNext, finance: report.next.financeExpansion }, composer: report.composer && { start: report.composer.startPicks, free: report.composer.freeAssembly, candidates: report.composer.aiCandidatePool.stepRecall } };
console.log(JSON.stringify(brief, null, 2));
