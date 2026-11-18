// Conditional per-unit scenario, not an observed ledger or permission to spend.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function opportunityEconomics(input) {
  const keys = ['price', 'priceMultiplier', 'landedCost', 'landedMultiplier', 'handling', 'feeRate', 'returnLossRate', 'acquisition', 'otherCosts', 'minimumAmount', 'minimumRatio'];
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Explicit scenario object required');
  if (!/^[A-Z]{3}$/.test(input.currency ?? '')) throw Error('One explicit currency code required');
  for (const key of keys) {
    if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < 0) throw Error(`Explicit finite nonnegative ${key} required`);
  }
  for (const key of ['feeRate', 'returnLossRate', 'minimumRatio']) if (input[key] > 1) throw Error(`${key} must be a fraction from zero to one`);
  const revenue = input.price * input.priceMultiplier;
  if (!(revenue > 0)) throw Error('Positive scenario revenue required for ratio denominator');
  const costs = {
    landed: input.landedCost * input.landedMultiplier,
    handling: input.handling,
    fees: revenue * input.feeRate,
    returnLoss: revenue * input.returnLossRate,
    acquisition: input.acquisition,
    other: input.otherCosts,
  };
  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const contribution = revenue - totalCost;
  const contributionRatio = contribution / revenue;
  if (![revenue, totalCost, contribution, contributionRatio, ...Object.values(costs)].every(Number.isFinite)) throw Error('Scenario arithmetic overflow');
  const amountPass = contribution >= input.minimumAmount;
  const ratioPass = contributionRatio >= input.minimumRatio;
  return {
    schema: 'opportunity-economics/1', currency: input.currency, inputs: { ...input },
    revenue, costs, totalCost, contribution, contributionRatio,
    gates: { amountPass, ratioPass, bothPass: amountPass && ratioPass },
    status: amountPass && ratioPass ? 'CONDITIONAL_PASS' : 'FAIL',
    basis: 'One sold unit; percentage fee and modeled return loss use scenario revenue after the price multiplier. Gate comparisons use unrounded values.',
    limitations: 'A scenario is not verified contribution or purchase approval. Zero costs require an explicit supported exclusion or labeled assumption; missing costs must not be silently set to zero. Return loss is a modeled allowance, not an observed refund ledger. Source coverage, cash, demand, compliance and supplier gates remain separate.',
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw Error('Usage: node tools/opportunity-economics.mjs scenario.json');
    process.stdout.write(JSON.stringify(opportunityEconomics(JSON.parse(readFileSync(process.argv[2], 'utf8'))), null, 2) + '\n');
  } catch (error) {
    process.stderr.write(String(error.message) + '\n');
    process.exitCode = 1;
  }
}
