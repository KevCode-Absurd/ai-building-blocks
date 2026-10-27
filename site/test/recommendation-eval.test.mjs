// Regression floors for recommendations, from the labelled set in fixtures/recommendation-eval.json.
// Full measurement (with the complete page/SKILL.md index): node scripts/evaluate-recommendations.mjs.
// This test uses the quick catalogue index (names, descriptions, jobs) that the library searches first, so it runs in seconds.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildLibrarySearchIndex, searchLibraryIndex } from '../src/lib/library-search-core.ts';
import { rankLibraryResults } from '../src/lib/library-rank.ts';
import { makeSearchDocument } from '../src/lib/search-document.mjs';
import { classificationText } from '../src/lib/catalogue-taxonomy.mjs';
import { reviewedTask } from '../src/lib/task-discovery.ts';
import { decodeCatalogue, freeSelection, startPicks } from '../src/lib/composer-core.ts';
import { planOf } from '../../tools/lib/needs.mjs';

// Measured 2026-10-26 after the ranking, next-link and composer changes (quick index top-5 0.855, MRR 0.742; next 0.738;
// finance 0.979; free 0.757). Each floor is that level minus about 0.03.
// "Start with" picks (free mode, composer-core startPicks), measured 2026-10-27: a labelled step in the top five for 0.857;
// 0.952 after the step-ranking pass (rank fusion, ready workflows lending weight to their steps, "use it when" cues).
const FLOOR = { quickTop5: 0.82, quickMrr: 0.7, nextLenient: 0.7, financeNext: 0.94, startTop5: 0.93, freeCoverage: 0.72 };

const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/recommendation-eval.json', import.meta.url), 'utf8'));
const raw = JSON.parse(fs.readFileSync(new URL('../public/data/blocks.json', import.meta.url), 'utf8'));
const port = p => p.endsWith('?') ? { type: p.slice(0, -1), required: false } : { type: p, required: true };
const blocks = raw.blocks.map(({ inputs, outputs, steps, tested, ...rest }) => ({ name: '', summary: '', task: 'set-up-ai', category: 'general', type: 'skill', role: 'make', usedIn: 0, twin: null, ...rest, headline: rest.headline ?? rest.name, tested: tested ? { result: 'pass' } : null, inputs: (inputs ?? []).map(port), outputs: (outputs ?? []).map(port), steps: (steps ?? []).map(s => typeof s === 'string' ? { uses: s, note: '' } : { uses: s[0], note: s[1] }) }));
const bySlug = Object.fromEntries(blocks.map(b => [b.slug, b]));
const known = new Set(blocks.map(b => b.slug));
const isTested = b => b.tested?.result === 'pass';

test('labelled items still exist in the catalogue', () => {
  const missing = [...fixture.search.flatMap(s => s.expect), ...fixture.goals.flatMap(g => g.steps.flat()), ...fixture.next.flatMap(n => [n.slug, ...n.good])].filter(slug => !known.has(slug));
  // Renames happen; a few missing labels are tolerated, many mean the fixture needs relabelling.
  assert.ok(missing.length <= 15, `Relabel test/fixtures/recommendation-eval.json: ${[...new Set(missing)].join(', ')}`);
});

test('library search keeps its top-5 hit rate on everyday queries', () => {
  const minds = new Map((raw.minds?.roster ?? []).map(m => [m.slug, m]));
  const index = buildLibrarySearchIndex(blocks.map(b => makeSearchDocument(b, b.type === 'mind' ? { when: minds.get(b.slug)?.useCases ?? [] } : {}, { extraText: classificationText(b) })), 'a'.repeat(64));
  let top5 = 0, mrr = 0;
  for (const { q, expect } of fixture.search) {
    const hits = searchLibraryIndex(index, q), suggestion = reviewedTask(q);
    const ranked = rankLibraryResults(blocks.filter(b => hits.has(b.slug) || b.slug === suggestion?.slug), hits, q, { isTested, suggestion: suggestion?.slug }).slice(0, 10);
    const rank = ranked.findIndex(b => expect.includes(b.slug));
    if (rank >= 0 && rank < 5) top5++;
    if (rank >= 0) mrr += 1 / (rank + 1);
  }
  const n = fixture.search.length;
  assert.ok(top5 / n >= FLOOR.quickTop5, `top-5 hit rate ${(top5 / n).toFixed(3)} fell below ${FLOOR.quickTop5}`);
  assert.ok(mrr / n >= FLOOR.quickMrr, `MRR ${(mrr / n).toFixed(3)} fell below ${FLOOR.quickMrr}`);
});

test('what-next links stay on topic, and generated finance items stay in finance', () => {
  const describe = t => ({ label: t.replace(/_/g, ' '), what: t });
  let links = 0, good = 0;
  for (const item of fixture.next) {
    const next = planOf(bySlug[item.slug], bySlug, blocks, describe).next;
    links += next.length; good += next.filter(x => item.good.includes(x.slug) || item.goodTasks.includes(bySlug[x.slug]?.task)).length;
  }
  assert.ok(good / links >= FLOOR.nextLenient, `next-link precision ${(good / links).toFixed(3)} fell below ${FLOOR.nextLenient}`);
  const finance = new Set(fixture.financeTasks);
  const generated = blocks.filter(b => b.inputs.map(p => p.type).join() === 'brief,source_text,spreadsheet' && finance.has(b.task)).slice(0, 60);
  let financeLinks = 0, inFinance = 0;
  for (const b of generated) {
    const plan = planOf(b, bySlug, blocks, describe);
    assert.ok(!plan.chain.some(x => x.slug === 'buyer-brief-writer') && !plan.needed.some(x => x.maker?.slug === 'buyer-brief-writer'), `${b.slug} must not send people to the buyer brief writer`);
    financeLinks += plan.next.length; inFinance += plan.next.filter(x => finance.has(bySlug[x.slug]?.task)).length;
  }
  assert.ok(!generated.length || inFinance / financeLinks >= FLOOR.financeNext, `finance next links in finance jobs: ${(inFinance / financeLinks).toFixed(3)}`);
});

test('reviewed next/before lists replace the worked-out links', () => {
  const describe = t => ({ label: t, what: t });
  const b = bySlug['cold-email-writer'];
  const plan = planOf(b, bySlug, blocks, describe, { next: ['cold-email-pre-send-checker', 'not-a-real-block'], before: ['customer-buying-reasons-finder'] });
  assert.deepEqual(plan.next.map(x => x.slug), ['cold-email-pre-send-checker']);
  assert.deepEqual(plan.chain.map(x => x.slug), ['customer-buying-reasons-finder']);
});

test('free mode starts with a labelled step, and free assembly covers the expected steps', () => {
  const lib = decodeCatalogue(raw), catalogue = { ...raw, blocks, bySlug };
  const expand = steps => steps.flatMap(s => [s, ...(bySlug[s]?.steps ?? []).map(x => x.uses)]);
  const cover = (steps, groups) => groups.filter(g => g.some(s => expand(steps).includes(s))).length / groups.length;
  let start = 0, free = 0;
  for (const { goal, steps } of fixture.goals) {
    const good = new Set(steps.flat());
    start += startPicks(catalogue, goal, 5).tasks.some(p => good.has(p.b.slug)) ? 1 : 0;
    try { free += cover(freeSelection(lib, goal).steps.map(s => s.slug), steps); } catch { /* zero */ }
  }
  const n = fixture.goals.length;
  assert.ok(start / n >= FLOOR.startTop5, `"Start with" top-5 hit rate ${(start / n).toFixed(3)} fell below ${FLOOR.startTop5}`);
  assert.ok(free / n >= FLOOR.freeCoverage, `free assembly step coverage ${(free / n).toFixed(3)} fell below ${FLOOR.freeCoverage}`);
});
