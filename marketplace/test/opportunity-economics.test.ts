import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPack, packZip } from '../src/modules/packs/build.ts';
import { readZip } from '../src/modules/packs/zip.ts';
import { NOVA, FIXTURE_JOB_TYPES } from './fixtures.ts';
// @ts-ignore Portable standalone Node tool ships without TypeScript declarations.
import { opportunityEconomics } from '../packs/shared/tools/opportunity-economics.mjs';

const stress = { currency: 'USD', price: 12, priceMultiplier: 0.9, landedCost: 4, landedMultiplier: 1.2, handling: 2, feeRate: 0.03, returnLossRate: 0.1, acquisition: 0, otherCosts: 0, minimumAmount: 3, minimumRatio: 0.3 };
test('stress contribution fails both floors and uses discounted revenue as denominator', () => {
  const r = opportunityEconomics(stress);
  assert.ok(Math.abs(r.contribution - 2.596) < 1e-10);
  assert.ok(Math.abs(r.contributionRatio - 2.596 / 10.8) < 1e-10);
  assert.deepEqual(r.gates, { amountPass: false, ratioPass: false, bothPass: false });
  assert.equal(r.status, 'FAIL');
});
test('rounding cannot promote a near-threshold failure and both gates are required', () => {
  const r = opportunityEconomics({ ...stress, price: 10, priceMultiplier: 1, landedCost: 7.005, landedMultiplier: 1, handling: 0, feeRate: 0, returnLossRate: 0, minimumRatio: 0.29 });
  assert.equal(r.contribution.toFixed(2), '3.00');
  assert.deepEqual(r.gates, { amountPass: false, ratioPass: true, bothPass: false });
  assert.equal(opportunityEconomics({ ...stress, minimumAmount: 2, minimumRatio: 0.2 }).status, 'CONDITIONAL_PASS');
});
test('unknown, malformed, zero-denominator and overflowing inputs are rejected', () => {
  for (const patch of [{ handling: undefined }, { acquisition: null }, { feeRate: 3 }, { priceMultiplier: 0 }, { otherCosts: -1 }, { currency: '' }, { price: Number.MAX_VALUE, priceMultiplier: 2 }]) {
    assert.throws(() => opportunityEconomics({ ...stress, ...patch }));
  }
});

test('downloaded pack carries the executable economics tool byte-for-byte', async () => {
  const source = readFileSync(new URL('../packs/shared/tools/opportunity-economics.mjs', import.meta.url), 'utf8');
  const pack = await buildPack({ persona: NOVA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, tools: { 'opportunity-economics.mjs': source }, options: { version: '2026.11.18', updated: '2026-11-18', kind: 'agent' } });
  const tool = pack.files.find(f => f.path === 'tools/opportunity-economics.mjs');
  assert.ok(tool, 'An instruction reference is insufficient without its executable');
  assert.equal(tool.content, source);
  const zip = await readZip(await packZip(pack));
  assert.ok(zip.some(f => f.path.endsWith('/tools/opportunity-economics.mjs')));
});
