// The search keep rule (scripts/lib/search-keep.mjs): which library pages ask to be in Google after the 8 Nov 2026 drop.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EARNED, decidedByKeepRule, searchKeep } from '../scripts/lib/search-keep.mjs';

test('pages that earned impressions stay indexed, including the old top pages', () => {
  const keep = searchKeep();
  for (const url of ['/tools/file-transfer-time', '/ai-tools/ideogram', '/skills/ten-percent-cutter', '/minds/james-gurney', '/jobs/run-your-store']) {
    assert.ok(keep(url), url);
  }
  assert.ok(EARNED.size > 300, 'the Search Console list is loaded');
  assert.ok([...EARNED].every((u) => u.startsWith('/') && !u.includes(' ')), 'one path per line');
});

test('non-item pages are always indexed: calculators, AI-tool profiles, blog, guides, hubs and core pages', () => {
  const keep = searchKeep();
  for (const url of ['/', '/tools/some-new-calculator', '/ai-tools/some-new-tool', '/blog/any-post', '/guides/any', '/jobs/any-job', '/minds', '/skills', '/how-it-works']) {
    assert.ok(keep(url), url);
    assert.equal(decidedByKeepRule(url), false, url);
  }
});

test('an item page that never earned an impression is left out, unless the home page features it', () => {
  const unseen = '/skills/a-skill-nobody-searched-for';
  assert.equal(searchKeep()(unseen), false);
  assert.equal(searchKeep(new Set([unseen]))(unseen), true);
  for (const kind of ['skills', 'workflows', 'prompts', 'agents', 'roles', 'minds']) assert.ok(decidedByKeepRule(`/${kind}/x`), kind);
});

test('page 2 and on of a list is never indexed', () => {
  const keep = searchKeep(new Set(['/minds/page/2']));
  assert.equal(keep('/minds/page/2'), false);
  assert.equal(keep('/jobs/build-software/2'), false);
  assert.equal(keep('/jobs/build-software'), true);
});
