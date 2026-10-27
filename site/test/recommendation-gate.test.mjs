// Search regression gate: runs the real offline evaluation (full index: names, pages and SKILL.md) and fails when
// library search gets worse than the level measured on 2026-10-27 (keyword ranking pass), minus 0.02.
//  - Original labelled fixture (test/fixtures/recommendation-eval.json): top-1 0.704, top-5 0.933.
//  - Catalogue-wide keyword search (scripts/keyword-queries.mjs, every 4th item, ~3,900 queries): hit@1 0.917, hit@5 0.984.
// The first run reads every page and SKILL.md (a few minutes); later runs reuse the cached documents (--fast).
// Same as: node scripts/evaluate-recommendations.mjs --only search,keywords --fast --keyword-sample 4
//
// "What next" links gate (same evaluation, --only next, original fixture), measured on 2026-10-27 after the
// hand-off rework of src/lib/next-steps.mjs (required hand-offs first, siblings only without real hand-offs), minus 0.02:
//  - block page links (tools/lib/needs.mjs planOf): strict precision 0.444, lenient 0.908, items with a good link 0.786;
//  - builder suggestions (src/lib/suggest.ts suggestNext): strict precision 0.434, lenient 0.91, items with a good link 0.786.
// Raised later on 2026-10-27 (step-ranking pass: any real hand-off within a job links, another maker of the same thing is
// not a next step, the builder never fills its list with siblings that take nothing; the two job description writers'
// labels gained the interview designer and the 30-60-90 onboarding planner, which read the job description): builder
// strict precision 0.455, lenient 0.917; page links measured 0.442 / 0.898, so their floors stay.
// Every labelled item must still get a link, and generated finance items must keep their links in finance jobs.
//
// Catalogue-wide hand-off gate (scripts/check-next-handoffs.mjs --sample 4 --no-builder, every 4th item), measured
// on 2026-10-27: 75.4% of page next links take something the item makes (59.3% before the rework), 40.5% as a
// required input, 24.6% hand nothing over, every "Takes the …" label names a real match, 2.5% of items have no link;
// 95.9% of "Before you start" steps make an input of the item, all in the same line of work.
// After the step-ranking pass (same day): 93.9% take something the item makes, 46.6% as a required input, 6.1% hand
// nothing over, 0.2% of items have no link; 95.2% of "Before you start" steps make an input (floor kept at 95.9 - 2).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const MEASURED = { top1: 0.704, top5: 0.933, keywordHit1: 0.917, keywordHit5: 0.984 };
const NEXT_MEASURED = { page: { precisionStrict: 0.444, precisionLenient: 0.908, itemsWithAGoodLink: 0.786 }, builder: { precisionStrict: 0.455, precisionLenient: 0.917, itemsWithAGoodLink: 0.786 } };
const HANDOFF_MEASURED = { takesSomethingItMakes: 0.939, asRequiredInput: 0.466, noHandoff: 0.061, itemsWithNoLinks: 0.002, chainMakesAnInput: 0.959 };
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

test('"what next" links hand over what the item makes, across the catalogue', { timeout: 5 * 60 * 1000 }, t => {
  const out = path.join(os.tmpdir(), `abb-handoff-gate-${process.pid}.json`);
  t.after(() => fs.rmSync(out, { force: true }));
  execFileSync(process.execPath, ['scripts/check-next-handoffs.mjs', '--sample', '4', '--no-builder', '--out', out], { cwd: site, stdio: 'ignore', maxBuffer: 64 * 1024 * 1024 });
  const { page, chain } = JSON.parse(fs.readFileSync(out, 'utf8')).groups.all;
  const M = HANDOFF_MEASURED;
  assert.ok(page.takesSomethingItMakes >= M.takesSomethingItMakes - 0.02, `next links taking something the item makes ${page.takesSomethingItMakes} fell below ${M.takesSomethingItMakes - 0.02}`);
  assert.ok(page.asRequiredInput >= M.asRequiredInput - 0.02, `next links taking it as a required input ${page.asRequiredInput} fell below ${M.asRequiredInput - 0.02}`);
  assert.ok(page.noHandoff <= M.noHandoff + 0.02, `next links handing nothing over ${page.noHandoff} rose above ${M.noHandoff + 0.02}`);
  assert.ok(page.itemsWithNoLinks <= M.itemsWithNoLinks + 0.01, `items with no next link ${page.itemsWithNoLinks} rose above ${M.itemsWithNoLinks + 0.01}`);
  assert.equal(page.labelAccurate, 1, 'every "Takes the …" label names an input the next item really takes from this one');
  assert.ok(page.genericPortOnlyOtherFamily <= 0.01, `generic-only hand-offs into another line of work ${page.genericPortOnlyOtherFamily} rose above 0.01`);
  assert.ok(chain.makesAnInputOfThis >= M.chainMakesAnInput - 0.02, `"Before you start" steps making an input ${chain.makesAnInputOfThis} fell below ${M.chainMakesAnInput - 0.02}`);
  assert.ok(chain.sameFamily >= 0.99, `"Before you start" steps in the same line of work ${chain.sameFamily} fell below 0.99`);
});
