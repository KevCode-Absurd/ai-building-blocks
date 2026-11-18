#!/usr/bin/env node
// Goods-price savings and payment timing are different quantities.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

export const LIMITS = Object.freeze({ inputBytes: 262144, quantity: 1000000, unitPrice: 1000000, totalMinorUnits: 1000000000000 });
const assert = (ok, message) => { if (!ok) throw Error(message); };
const hash = x => createHash('sha256').update(x).digest('hex');
function keys(v, allowed, field) {
  assert(v && typeof v === 'object' && !Array.isArray(v), field + ' must be an object');
  for (const k of Object.keys(v)) assert(allowed.includes(k), field + ': unsupported key ' + k);
}
function label(v, field, maximum = 500) {
  assert(typeof v === 'string' && v.trim() && v.length <= maximum && !/[\u0000-\u001f\u007f]/.test(v), field + ' needs bounded single-line text');
  return v;
}
const roundedDeposit = (basis, rate) => (basis * BigInt(rate) + 5000n) / 10000n;

export function comparePaymentTerms(input) {
  keys(input, ['schema', 'currency', 'minorUnitDigits', 'scope', 'sourceRefs', 'before', 'after'], 'input');
  assert(input.schema === 'payment-terms-v1', 'schema must be payment-terms-v1');
  assert(typeof input.currency === 'string' && /^[A-Z]{3}$/.test(input.currency), 'Declare one three-letter currency; no conversion is performed');
  assert(Number.isInteger(input.minorUnitDigits) && input.minorUnitDigits >= 0 && input.minorUnitDigits <= 4, 'minorUnitDigits must be 0 to 4');
  label(input.scope, 'scope', 1000);
  assert(Array.isArray(input.sourceRefs) && input.sourceRefs.length > 0 && input.sourceRefs.length <= 40, 'Provide 1 to 40 declared source references');
  input.sourceRefs.forEach(s => label(s, 'source reference'));
  const scale = 10 ** input.minorUnitDigits, max = BigInt(LIMITS.totalMinorUnits);
  const amount = n => { assert(n >= -max && n <= max, 'Result exceeds supported monetary range'); return Number(n) / scale; };
  const read = (s, name) => {
    keys(s, ['basisRef', 'orderQuantity', 'depositQuantity', 'unitPrice', 'depositRateBps'], name);
    label(s.basisRef, name + '.basisRef');
    for (const k of ['orderQuantity', 'depositQuantity']) assert(Number.isSafeInteger(s[k]) && s[k] > 0 && s[k] <= LIMITS.quantity, name + '.' + k + ' must be 1 to 1000000 units');
    assert(s.depositQuantity <= s.orderQuantity, 'Deposit quantity cannot exceed order quantity');
    assert(Number.isFinite(s.unitPrice) && s.unitPrice >= 0 && s.unitPrice <= LIMITS.unitPrice, 'unitPrice is out of range');
    assert(Number(s.unitPrice.toFixed(input.minorUnitDigits)) === s.unitPrice, 'Unit price exceeds declared minor-unit precision; reconcile explicitly');
    assert(Number.isInteger(s.depositRateBps) && s.depositRateBps >= 0 && s.depositRateBps <= 10000, 'depositRateBps must be 0 to 10000; 3000 means 30 percent');
    const unit = BigInt(Math.round(s.unitPrice * scale));
    const goods = unit * BigInt(s.orderQuantity), basis = unit * BigInt(s.depositQuantity);
    assert(goods <= max, 'Order exceeds supported monetary range');
    const deposit = roundedDeposit(basis, s.depositRateBps);
    return { unit, goods, basis, deposit, remaining: goods - deposit,
      public: { ...s, goodsValue: amount(goods), depositGoodsBasis: amount(basis), depositRatePercent: s.depositRateBps / 100, initialDeposit: amount(deposit), remainingGoodsPayments: amount(goods - deposit) } };
  };
  const before = read(input.before, 'before'), after = read(input.after, 'after');
  const reasons = [];
  if (input.before.basisRef !== input.after.basisRef) reasons.push('Product/specification, commercial scope or payment event basis differs or is unconfirmed.');
  if (input.before.orderQuantity !== input.after.orderQuantity) reasons.push('Order quantities differ; quantity reduction is not a unit-price saving.');
  if (input.before.depositQuantity !== input.after.depositQuantity) reasons.push('Deposit quantities differ; a partial-release deposit is not comparable to a whole-order deposit.');
  const result = {
    schema: 'payment-terms-result-v1', status: reasons.length ? 'NOT_COMPARABLE' : 'COMPARABLE_DECLARED_BASIS',
    currency: input.currency, minorUnitDigits: input.minorUnitDigits, scope: input.scope, sourceRefs: [...input.sourceRefs],
    rounding: 'Each deposit is rounded half up to the declared currency minor unit. Counterfactual deposits use the same rule; effects are differences of rounded deposits.',
    before: before.public, after: after.public, comparison: null, noncomparabilityReasons: reasons,
    limitations: 'Declared goods-only scope. Source references, equivalent specification, payment event and negotiated acceptance are not authenticated. Excludes freight, tax, fees, financing and other costs. Remaining goods payments are an aggregate, not dated instalments. Deposit reduction is cash timing plus price effect, not profit or verified funding. No overall-report verification or authority to commit.'
  };
  if (reasons.length) return result;
  const newPriceOldRate = roundedDeposit(after.basis, input.before.depositRateBps);
  const oldPriceNewRate = roundedDeposit(before.basis, input.after.depositRateBps);
  result.comparison = {
    goodsPriceReduction: amount(before.goods - after.goods),
    initialDepositReduction: amount(before.deposit - after.deposit),
    remainingGoodsPaymentsChange: amount(after.remaining - before.remaining),
    priceFirst: {
      intermediateDepositAtNewPriceOldRate: amount(newPriceOldRate),
      priceEffectOnDeposit: amount(before.deposit - newPriceOldRate),
      rateEffectOnDeposit: amount(newPriceOldRate - after.deposit)
    },
    rateFirst: {
      intermediateDepositAtOldPriceNewRate: amount(oldPriceNewRate),
      rateEffectOnDeposit: amount(before.deposit - oldPriceNewRate),
      priceEffectOnDeposit: amount(oldPriceNewRate - after.deposit)
    },
    reconciliation: 'Each decomposition sums to initialDepositReduction. initialDepositReduction minus remainingGoodsPaymentsChange equals goodsPriceReduction. Negative reduction means an increase; positive remainingGoodsPaymentsChange means more due later.'
  };
  return result;
}

export function runCli(args, root = process.cwd()) {
  assert(args.length === 1, 'Use node tools/payment-terms.mjs context/terms.json; JSON is written to stdout only');
  const relative = args[0];
  assert(typeof relative === 'string' && relative.length <= 500 && !path.isAbsolute(relative) && !/[\u0000-\u001f<>:"|?*]/.test(relative), 'Use a safe relative input path');
  const parts = relative.replace(/\\/g, '/').split('/');
  assert(parts.every(s => s && s !== '.' && s !== '..' && !/[. ]$/.test(s) && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(s)), 'Unsafe input path component');
  const base = fs.realpathSync(root); let target = base;
  for (const part of parts) {
    target = path.join(target, part);
    const info = fs.lstatSync(target);
    assert(!info.isSymbolicLink(), 'Symlink or junction paths are not supported');
    const rel = path.relative(base, fs.realpathSync(target));
    assert(rel && rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel), 'Input escapes project');
  }
  const stat = fs.statSync(target);
  assert(stat.isFile() && stat.size <= LIMITS.inputBytes, 'Input must be a bounded regular file');
  const bytes = fs.readFileSync(target); assert(bytes.length <= LIMITS.inputBytes, 'Input exceeded read budget');
  return { ...comparePaymentTerms(JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''))), inputSha256: hash(bytes) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { const result = runCli(process.argv.slice(2)); console.log(JSON.stringify(result, null, 2)); if (result.status === 'NOT_COMPARABLE') process.exitCode = 2; }
  catch (error) { console.error(JSON.stringify({ status: 'ERROR', error: error.message })); process.exitCode = 1; }
}
