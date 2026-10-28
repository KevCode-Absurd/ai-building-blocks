import test from 'node:test';
import assert from 'node:assert/strict';
import { needsOf, BRAND_BRAIN } from '../../tools/lib/needs.mjs';

const brain = { slug: BRAND_BRAIN, name: 'Brand brain builder', task: 'brand-file', inputs: [], outputs: [{ type: 'brand_brain' }] };
const step = { slug: 'draft-step', task: 'write-emails', inputs: ['brand_brain', 'persona', 'product_data'].map(type => ({ type, required: false })), outputs: [{ type: 'copy_draft' }] };
const bySlug = { [brain.slug]: brain, [step.slug]: step, 'buyer-brief-writer': { slug: 'buyer-brief-writer', task: 'understand-customers' }, 'competitor-ad-swipe-file-builder': { slug: 'competitor-ad-swipe-file-builder', task: 'study-competitors' } };
test('hiring and pricing steps cannot add a brand folder to otherwise unrelated starting material', () => {
  for (const task of ['hire-people', 'set-prices']) {
    const b = { slug: 'flow', task, inputs: [{ type: 'question', required: true }], steps: [{ uses: step.slug }] };
    assert.deepEqual(needsOf(b, bySlug).helps, []);
  }
});
test('pricing product facts stay product facts; an explicitly requested brand folder stays available', () => {
  const b = { slug: 'pricing-flow', task: 'set-prices', inputs: [{ type: 'product_data', required: true }] };
  assert.equal(needsOf(b, bySlug).needed[0].key, 'product_data');
  b.inputs.push({ type: 'brand_brain', required: false });
  assert.equal(needsOf(b, bySlug).helps[0].key, BRAND_BRAIN);
});
test('a work brief, plan and shortlist do not demand a buyer brief or competitor ad research', () => {
  const b = { slug: 'hiring-flow', task: 'hire-people', inputs: ['brief', 'plan', 'shortlist'].map(type => ({ type, required: true })) };
  const inputs = needsOf(b, bySlug).needed;
  assert.deepEqual(inputs.map(p => p.label), ['A brief', 'A plan', 'A shortlist']);
  assert.ok(inputs.every(p => !p.maker));
  assert.ok(inputs.every(p => !/buyer|competitor|ad swipe/i.test(p.what)));
});
