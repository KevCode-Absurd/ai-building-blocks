import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {itemIndex} from '../scripts/build-item-index.mjs';
import {skillNeighbours} from '../src/lib/skill-neighbours.ts';
import * as fullInfo from '../src/lib/site-info.mjs';
import * as nav from '../src/lib/site-info-nav.mjs';

test('single-item first-open records preserve every published Before/After choice and linked workflow', () => {
  const bytes = fs.readFileSync(new URL('../public/data/blocks.json', import.meta.url)), catalogue = JSON.parse(bytes);
  const hash = createHash('sha256').update(bytes).digest('hex');
  const known = Object.fromEntries(catalogue.blocks.map(b => [b.slug, b]));
  const reverse = new Map();
  for (const flow of catalogue.blocks) for (const step of flow.steps ?? []) { const slug = Array.isArray(step) ? step[0] : step; if (!reverse.has(slug)) reverse.set(slug, []); reverse.get(slug).push(flow.slug); }
  for (const root of catalogue.blocks) {
    const file = new URL('../public/data/pages/' + root.slug + '.json', import.meta.url);
    const page = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : null;
    const index = itemIndex(catalogue, root.slug, page, hash), subset = Object.fromEntries(index.blocks.map(b => [b.slug, b]));
    assert.equal(index.sourceHash, hash); assert.deepEqual(subset[root.slug], root, root.slug);
    assert.deepEqual(skillNeighbours(root.slug, page?.plan, subset), skillNeighbours(root.slug, page?.plan, known), root.slug + ': recommendation parity');
    for (const record of index.blocks) {
      assert.deepEqual(record, known[record.slug]);
      for (const step of record.steps ?? []) { const slug = Array.isArray(step) ? step[0] : step; if (known[slug]) assert(subset[slug], root.slug + ': missing package step ' + slug); }
      for (const slug of record.minds ?? []) if (known[slug]) assert(subset[slug], root.slug + ': missing mind ' + slug);
    }
    const isFlow = ['workflow','agent'].includes(root.type) || root.category === 'orchestrator';
    const containing = root.type === 'mind' ? root.flows ?? [] : isFlow ? [] : reverse.get(root.slug) ?? [];
    for (const slug of [...containing, ...(root.skills ?? []), ...(root.minds ?? [])]) if (known[slug]) assert(subset[slug], root.slug + ': missing visible relation ' + slug);
    assert.deepEqual(index.page, page);
  }
});

test('policy navigation retains the full policy labels, routes and shared contact details', () => {
  assert.deepEqual(nav.INFO_PAGES, fullInfo.INFO_PAGES.map(({path,label}) => ({path,label})));
  for (const key of ['SUPPORT_EMAIL','OPERATOR','POLICY_DATE','SOCIAL_PROFILES']) assert.deepEqual(nav[key], fullInfo[key]);
  assert.equal(nav.emailLink('A question'), fullInfo.emailLink('A question'));
  for (const page of fullInfo.INFO_PAGES) assert.equal(nav.infoPage(page.path).path, page.path);
  assert.equal(nav.infoPage('/not-a-page'), undefined);
});
