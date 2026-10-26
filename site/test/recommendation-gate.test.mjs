// Search regression gate: runs the real offline evaluation (full index: names, pages and SKILL.md) and fails when
// library search gets worse than the level measured on 2026-10-26, minus 0.02.
//  - Original labelled fixture (test/fixtures/recommendation-eval.json): top-1 0.704, top-5 0.933.
//  - Catalogue-wide keyword search (scripts/keyword-queries.mjs, every 4th item, ~3,900 queries): hit@1 0.882, hit@5 0.979.
// The first run reads every page and SKILL.md (a few minutes); later runs reuse the cached documents (--fast).
// Same as: node scripts/evaluate-recommendations.mjs --only search,keywords --fast --keyword-sample 4
//
// "What next" links gate (same evaluation, --only next, original fixture), measured on 2026-10-26 after the
// job-flow rework of src/lib/next-steps.mjs, minus 0.02:
//  - block page links (tools/lib/needs.mjs planOf): lenient precision 0.904, items with a good link 0.786;
//  - builder suggestions (src/lib/suggest.ts suggestNext): lenient precision 0.904, items with a good link 0.762.
// Every labelled item must still get a link, and generated finance items must keep their links in finance jobs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const MEASURED = { top1: 0.704, top5: 0.933, keywordHit1: 0.882, keywordHit5: 0.979 };
const NEXT_MEASURED = { page: { precisionLenient: 0.904, itemsWithAGoodLink: 0.786 }, builder: { precisionLenient: 0.904, itemsWithAGoodLink: 0.762 } };
const FLOOR = Object.fromEntries(Object.entries(MEASURED).map(([key, value]) => [key, Number((value - 0.02).toFixed(3))]));
const site = path.resolve(import.meta.dirname, '..');

test('library search keeps its keyword and labelled-query hit rates', { timeout: 15 * 60 * 1000 }, t => {
  const out = path.join(os.tmpdir(), `abb-search-gate-${process.pid}.json`);
  t.after(() => fs.rmSync(out, { force: true }));
  execFileSync(process.execPath, ['scripts/evaluate-recommendations.mjs', '--only', 'search,keywords', '--fast', '--keyword-sample', '4', '--out', out], { cwd: site, stdio: 'ignore', maxBuffer: 64 * 1024 * 1024 });
  const { search, keywords } = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.ok(search.top1 >= FLOOR.top1, `original fixture top-1 ${search.top1} fell below ${FLOOR.top1}`);
  assert.ok(search.top5 >= FLOOR.top5, `original fixture top-5 ${search.top5} fell below ${FLOOR.top5}`);
  assert.ok(keywords.hit1 >= FLOOR.keywordHit1, `keyword hit@1 ${keywords.hit1} fell below ${FLOOR.keywordHit1}`);
  assert.ok(keywords.hit5 >= FLOOR.keywordHit5, `keyword hit@5 ${keywords.hit5} fell below ${FLOOR.keywordHit5}`);
});

test('"what next" links keep their precision and coverage', { timeout: 5 * 60 * 1000 }, t => {
  const out = path.join(os.tmpdir(), `abb-next-gate-${process.pid}.json`);
  t.after(() => fs.rmSync(out, { force: true }));
  execFileSync(process.execPath, ['scripts/evaluate-recommendations.mjs', '--only', 'next', '--out', out], { cwd: site, stdio: 'ignore', maxBuffer: 64 * 1024 * 1024 });
  const { next } = JSON.parse(fs.readFileSync(out, 'utf8'));
  for (const [name, got] of [['page', next.pageNext], ['builder', next.builderSuggestNext]]) {
    for (const [metric, value] of Object.entries(NEXT_MEASURED[name])) {
      const floor = Number((value - 0.02).toFixed(3));
      assert.ok(got[metric] >= floor, `${name} next links ${metric} ${got[metric]} fell below ${floor}`);
    }
    assert.equal(got.itemsWithNoLinks, 0, `${name}: ${got.itemsWithNoLinks} labelled items got no next link`);
  }
  assert.ok(next.financeExpansion.nextPrecisionFinanceJobs >= 0.98, `finance items' next links in finance jobs ${next.financeExpansion.nextPrecisionFinanceJobs} fell below 0.98`);
});
