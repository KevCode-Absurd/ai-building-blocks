import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handoffLink, nextSteps, previousSteps } from '../../site/src/lib/next-steps.mjs';

const base = { type: 'skill', category: 'general', task: 'write-ad-copy', outputs: [] };
const brain = { ...base, slug: 'website-brand-brain-builder', name: 'Brand profile builder', summary: 'Build an org context from your website.', task: 'brand-file', inputs: [{ type: 'web_page', required: true }], outputs: [{ type: 'brand_brain' }] };
const hooks = { ...base, slug: 'hook-writer', name: 'Hook writer', summary: 'Write opening lines for an ad.', inputs: [{ type: 'brief', required: true }], outputs: [{ type: 'hooks' }] };
const copy = { ...base, slug: 'ad-copy-writer', name: 'Ad copy writer', summary: 'Write ad copy from the opening lines.', inputs: [{ type: 'hooks', required: true }, { type: 'product_data', required: true }], outputs: [{ type: 'ad_copy' }] };
const optional = { ...base, slug: 'ad-headline-writer', name: 'Ad headline writer', summary: 'Write ad headlines.', inputs: [{ type: 'brief', required: true }, { type: 'hooks', required: false }], outputs: [{ type: 'ad_copy' }] };
const all = [brain, hooks, copy, optional];

test('a required hand-off ranks above an optional one, and takes lists only real matches', () => {
  const next = nextSteps(hooks, all);
  assert.equal(next[0].x.slug, copy.slug);
  assert.deepEqual(next[0].takes, ['hooks']);
  assert(handoffLink(hooks, copy, all).score > handoffLink(hooks, optional, all).score);
});

test('the before side uses the same ranking: makers of what the step reads, never a sibling', () => {
  const before = previousSteps(copy, all);
  assert.deepEqual(before.map(s => s.x.slug), [hooks.slug]);
  assert.deepEqual(before[0].takes, ['hooks']);
  // A named maker of a shared input (product facts in the org context) is listed whatever its subject.
  const named = previousSteps(copy, all, { makers: [brain.slug] });
  assert.deepEqual(named.map(s => s.x.slug), [hooks.slug, brain.slug]);
  assert.deepEqual(named[1].takes, ['product_data']);
});
