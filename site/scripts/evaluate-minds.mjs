// Scores how well minds are matched, against independent labels:
//   topics  test/fixtures/mind-topics.json: a topic someone types ("negotiation") and the minds they should see.
//           Measured on the Minds page search (MindsPage.tsx: library search hits ranked by lib/library-rank.ts, then
//           mind-match.ts mindSearchOrder), on the library order alone (libraryOnly, the page before 28 Oct) and on
//           mindsFor alone (the "minds who know this" row on a library search).
//   steps   test/fixtures/mind-steps.json: a workflow step and the minds that fit it, scored on crew.ts suggestMinds
//           (the step panel's suggestions).
// Odd ids are dev, even ids are test: tune on dev only. No model calls and no network.
// Usage: node scripts/evaluate-minds.mjs [--split dev|test|all] [--verbose]
//   hit1 / hit3: an expected mind first / among the first three; recall5: share of the expected minds in the first five.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from 'esbuild';

const SITE = path.resolve(import.meta.dirname, '..');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
const split = arg('--split') ?? 'dev', verbose = process.argv.includes('--verbose');
const half = id => Number(id.replace(/\D/g, '')) % 2 ? 'dev' : 'test';
const out = path.join(os.tmpdir(), `abb-minds-eval-${process.pid}.mjs`);
await build({ stdin: { contents: ["export { suggestMinds } from './src/lib/crew.ts';", "export { mindsFor, stepTopic, mindSearchOrder, TOPIC_PROMINENCE } from './src/lib/mind-match.ts';", "export { publicSearchDocuments } from './src/lib/library-search.ts';", "export { buildLibrarySearchIndex, searchLibraryIndex } from './src/lib/library-search-core.ts';", "export { rankLibraryResults } from './src/lib/library-rank.ts';", "export { classificationText } from './src/lib/catalogue-taxonomy.mjs';", "export { decodeWire } from './src/lib/data.ts';"].join('\n'), resolveDir: SITE, loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', jsx: 'automatic' });
let m;
try { m = await import('file://' + out.replace(/\\/g, '/')); } finally { fs.rmSync(out, { force: true }); }
const c = m.decodeWire(JSON.parse(fs.readFileSync(path.join(SITE, 'public/data/blocks.json'), 'utf8')));
const topics = JSON.parse(fs.readFileSync(path.join(SITE, 'test/fixtures/mind-topics.json'), 'utf8')).queries.filter(q => split === 'all' || half(q.id) === split);
const steps = JSON.parse(fs.readFileSync(path.join(SITE, 'test/fixtures/mind-steps.json'), 'utf8')).steps.filter(s => (split === 'all' || half(s.id) === split) && c.bySlug[s.slug]);
const index = m.buildLibrarySearchIndex(m.publicSearchDocuments(c, m.classificationText), '0'.repeat(64));
const round = n => Number(n.toFixed(3));
const score = (rows) => ({ n: rows.length, hit1: round(rows.filter(r => r.expect.includes(r.got[0])).length / rows.length), hit3: round(rows.filter(r => r.got.slice(0, 3).some(s => r.expect.includes(s))).length / rows.length), recall5: round(rows.reduce((n, r) => n + r.expect.filter(s => r.got.slice(0, 5).includes(s)).length / r.expect.length, 0) / rows.length) });
const page = q => { const hits = m.searchLibraryIndex(index, q); const minds = c.blocks.filter(b => b.type === 'mind' && hits.has(b.slug)); return m.rankLibraryResults(minds, hits, q, { isTested: () => false }).map(b => b.slug); };
const topicRows = { libraryOnly: topics.map(q => ({ ...q, got: page(q.q) })), page: topics.map(q => ({ ...q, got: m.mindSearchOrder(c, q.q, page(q.q)) })), mindsFor: topics.map(q => ({ ...q, got: m.mindsFor(c, [[q.q, 1]], 5, 0, m.TOPIC_PROMINENCE).map(x => x.mind.slug) })) };
const stepRows = steps.map(s => ({ ...s, got: m.suggestMinds(c, c.bySlug[s.slug], 5).map(b => b.slug) }));
const report = { split, topics: { libraryOnly: score(topicRows.libraryOnly), page: score(topicRows.page), mindsFor: score(topicRows.mindsFor) }, steps: { all: score(stepRows), strong: score(stepRows.filter(s => !s.weak)) } };
console.log(JSON.stringify(report, null, 1));
if (verbose && split === 'dev') {
  for (const r of topicRows.page.filter(r => !r.got.slice(0, 3).some(s => r.expect.includes(s)))) console.log(`topic ${r.id} "${r.q}" want ${r.expect.join(', ')} got ${r.got.join(', ')}`);
  for (const r of stepRows.filter(r => !r.got.slice(0, 3).some(s => r.expect.includes(s)))) console.log(`step ${r.id} ${r.slug}${r.weak ? ' (weak)' : ''} want ${r.expect.join(', ')} got ${r.got.join(', ')}`);
}
// The "minds who know this" row on a library search: how often it shows for a topic (and is right), and how often it
// shows for an ordinary task request (workflow bench goals of the same half), by the top mind's score.
const bench = JSON.parse(fs.readFileSync(path.join(SITE, 'test/fixtures/workflow-bench.json'), 'utf8')).goals.filter(g => split === 'all' || half(g.id) === split);
const top = q => m.mindsFor(c, [[q, 1]], 3, 0, m.TOPIC_PROMINENCE);
const rowAt = floor => ({ floor, topicsShown: round(topics.filter(q => (top(q.q)[0]?.score ?? 0) >= floor).length / topics.length), topicsRight: round(topics.filter(q => top(q.q).filter(x => x.score >= floor).some(x => q.expect.includes(x.mind.slug))).length / topics.length), tasksShown: round(bench.filter(g => (top(g.request)[0]?.score ?? 0) >= floor).length / bench.length) });
console.log(JSON.stringify({ row: [0.6, 0.8, 1].map(rowAt) }));
