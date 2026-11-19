import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildPack, TOOL_FILES } from '../src/modules/packs/build.ts';
import { housePersonas } from '../src/modules/directory/index.ts';
import { getRole } from '../src/modules/directory/roles.ts';
import { listJobTypes } from '../src/modules/catalogue/index.ts';
// @ts-ignore Portable pack tool.
import { comparePaymentTerms, runCli, LIMITS } from '../packs/shared/tools/payment-terms.mjs';

const fixture = () => ({
  schema: 'payment-terms-v1', currency: 'USD', minorUnitDigits: 2,
  scope: 'Same approved goods and initial deposit event', sourceRefs: ['Synthetic test quotes'],
  before: { basisRef: 'same-spec-and-event', orderQuantity: 1000, depositQuantity: 1000, unitPrice: 8, depositRateBps: 3000 },
  after: { basisRef: 'same-spec-and-event', orderQuantity: 1000, depositQuantity: 1000, unitPrice: 7.6, depositRateBps: 2000 }
});

test('actual deposit-relief regression: full price saving is not deposit price effect', () => {
  const r = comparePaymentTerms(fixture()), c = r.comparison;
  assert.equal(r.before.initialDeposit, 2400); assert.equal(r.after.initialDeposit, 1520);
  assert.equal(c.goodsPriceReduction, 400); assert.equal(c.initialDepositReduction, 880);
  assert.equal(c.remainingGoodsPaymentsChange, 480);
  assert.deepEqual(c.priceFirst, { intermediateDepositAtNewPriceOldRate: 2280, priceEffectOnDeposit: 120, rateEffectOnDeposit: 760 });
  assert.deepEqual(c.rateFirst, { intermediateDepositAtOldPriceNewRate: 1600, rateEffectOnDeposit: 800, priceEffectOnDeposit: 80 });
  assert.notEqual(c.priceFirst.priceEffectOnDeposit, c.goodsPriceReduction);
  assert.notEqual(c.priceFirst.rateEffectOnDeposit, c.initialDepositReduction - c.goodsPriceReduction);
});

test('same-quantity partial release has its own deposit basis and full remaining balance', () => {
  const f = fixture(); f.before.depositQuantity = f.after.depositQuantity = 250;
  const r = comparePaymentTerms(f), c = r.comparison;
  assert.equal(r.before.depositGoodsBasis, 2000); assert.equal(r.after.depositGoodsBasis, 1900);
  assert.equal(r.before.initialDeposit, 600); assert.equal(r.after.initialDeposit, 380);
  assert.equal(c.initialDepositReduction, 220); assert.equal(c.goodsPriceReduction, 400);
  assert.equal(c.remainingGoodsPaymentsChange, -180);
  assert.equal(c.priceFirst.priceEffectOnDeposit, 30); assert.equal(c.priceFirst.rateEffectOnDeposit, 190);
});

test('unequal order quantities, release quantities or scope refuse a savings decomposition', () => {
  for (const mutate of [(f: any) => f.after.orderQuantity = 2000, (f: any) => f.after.depositQuantity = 250, (f: any) => f.after.basisRef = 'different-spec']) {
    const f = fixture(); mutate(f); const r = comparePaymentTerms(f);
    assert.equal(r.status, 'NOT_COMPARABLE'); assert.equal(r.comparison, null);
    assert.ok(r.noncomparabilityReasons.length); assert.ok(r.before.initialDeposit >= 0);
  }
});

test('no change, price-only, rate-only and adverse changes keep signed quantities distinct', () => {
  let f = fixture(); f.after = { ...f.before };
  let c = comparePaymentTerms(f).comparison;
  assert.equal(c.initialDepositReduction, 0); assert.equal(c.goodsPriceReduction, 0);
  f.after.unitPrice = 7.6; c = comparePaymentTerms(f).comparison;
  assert.equal(c.initialDepositReduction, 120); assert.equal(c.priceFirst.rateEffectOnDeposit, 0);
  f = fixture(); f.after.unitPrice = 8; c = comparePaymentTerms(f).comparison;
  assert.equal(c.goodsPriceReduction, 0); assert.equal(c.initialDepositReduction, 800); assert.equal(c.remainingGoodsPaymentsChange, 800);
  f = fixture(); f.after.unitPrice = 9; f.after.depositRateBps = 4000; c = comparePaymentTerms(f).comparison;
  assert.equal(c.goodsPriceReduction, -1000); assert.equal(c.initialDepositReduction, -1200); assert.equal(c.remainingGoodsPaymentsChange, -200);
});

test('deposit rounding is explicit, telescopes, and supports declared currency precision', () => {
  const f = fixture(); f.before.orderQuantity = f.after.orderQuantity = 1; f.before.depositQuantity = f.after.depositQuantity = 1;
  f.before.unitPrice = 0.03; f.after.unitPrice = 0.01; f.before.depositRateBps = 5000; f.after.depositRateBps = 2500;
  const r = comparePaymentTerms(f); assert.equal(r.before.initialDeposit, 0.02); assert.equal(r.after.initialDeposit, 0);
  assert.equal(r.comparison.priceFirst.priceEffectOnDeposit, 0.01); assert.equal(r.comparison.priceFirst.rateEffectOnDeposit, 0.01);
  const yen = fixture(); yen.currency = 'JPY'; yen.minorUnitDigits = 0; yen.after.unitPrice = 7;
  assert.equal(comparePaymentTerms(yen).after.initialDeposit, 1400);
});

test('rejects invalid precision, quantities, rates, mixed currency fields and excessive budgets', () => {
  const mutations = [
    (f: any) => f.before.unitPrice = 1.001, (f: any) => f.before.unitPrice = Infinity,
    (f: any) => f.before.unitPrice = -1, (f: any) => f.before.depositQuantity = 1001,
    (f: any) => f.before.orderQuantity = 0, (f: any) => f.before.orderQuantity = 1.5,
    (f: any) => f.before.depositRateBps = 10001, (f: any) => f.before.depositRateBps = 12.5,
    (f: any) => f.after.currency = 'EUR', (f: any) => f.minorUnitDigits = 5,
    (f: any) => f.currency = '$', (f: any) => f.sourceRefs = [],
    (f: any) => { f.before.orderQuantity = 1000000; f.before.unitPrice = 1000000; },
    (f: any) => Object.defineProperty(f, '__proto__', { value: {}, enumerable: true })
  ];
  for (const mutate of mutations) { const f = fixture(); mutate(f); assert.throws(() => comparePaymentTerms(f)); }
});

function workspace(fn: (root: string) => void) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'wenhao-payment-terms-'));
  try { fs.mkdirSync(path.join(root, 'context')); fs.writeFileSync(path.join(root, 'context/input.json'), JSON.stringify(fixture())); fn(root); }
  finally { assert.equal(path.dirname(root), fs.realpathSync(os.tmpdir())); assert.ok(path.basename(root).startsWith('wenhao-payment-terms-')); fs.rmSync(root, { recursive: true, force: true }); }
}
test('CLI reads bounded contained input without changing files or creating outputs', () => workspace(root => {
  const before = fs.readFileSync(path.join(root, 'context/input.json'));
  const r = runCli(['context/input.json'], root); assert.equal(r.comparison.priceFirst.priceEffectOnDeposit, 120);
  assert.deepEqual(fs.readFileSync(path.join(root, 'context/input.json')), before);
  assert.deepEqual(fs.readdirSync(root), ['context']);
  assert.match(r.inputSha256, /^[a-f0-9]{64}$/);
  for (const s of ['../input.json', 'context/../input.json', 'context/NUL', path.join(root, 'context/input.json')]) assert.throws(() => runCli([s], root));
  fs.writeFileSync(path.join(root, 'context/large.json'), ' '.repeat(LIMITS.inputBytes + 1));
  assert.throws(() => runCli(['context/large.json'], root), /bounded regular file/);
}));
test('CLI rejects junction or symlink input parents', t => workspace(root => {
  try { fs.symlinkSync(path.join(root, 'context'), path.join(root, 'linked'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (e) { const code = (e as NodeJS.ErrnoException).code; if (code && ['EPERM','EACCES','ENOSYS'].includes(code)) { t.skip('Host needs link permission for this check'); return; } throw e; }
  assert.throws(() => runCli(['linked/input.json'], root), /Symlink or junction/);
}));
test('only Wenhao receives payment tools and guidance; other 80 files and manifests unchanged', async () => {
  const scoped = TOOL_FILES.filter(t => t.personaIds?.includes('wenhao-procurement'));
  assert.deepEqual(scoped.map(t => t.name), ['payment-terms.mjs','PAYMENT-TERMS.md','payment-terms-example.json']);
  const extra = Object.fromEntries(scoped.map(t => [t.name, fs.readFileSync(new URL('../packs/shared/tools/' + t.name, import.meta.url), 'utf8')]));
  const personas = housePersonas().filter(p => p.vertical === 'ecommerce' && p.status === 'live'); assert.equal(personas.length, 81);
  for (const persona of personas) {
    const input = { persona, role: getRole(persona.role), kit: null, jobTypes: listJobTypes(), options: { kind: 'agent' as const, version: '2026.11.18', updated: '2026-11-18' } };
    const before = await buildPack({ ...input, tools: {} }), after = await buildPack({ ...input, tools: extra });
    if (persona.id === 'wenhao-procurement') {
      scoped.forEach(t => assert.ok(after.files.some(f => f.path === 'tools/' + t.name)));
      assert.match(after.files.find(f => f.path === 'AGENTS.md')!.content, /Payment-change arithmetic/);
    } else { assert.deepEqual(after.files, before.files, persona.id); assert.deepEqual(after.manifest, before.manifest); }
  }
});
