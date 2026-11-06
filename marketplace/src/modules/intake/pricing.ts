// Fixed prices from a job type's price band. Pure functions, so the maths is easy to test.
// Price = base + size adjuster (units above what the base includes x per-unit price), then rush, clamped to min / max.
import type { JobType } from "../../core/types.ts";

export interface PriceResult {
  price_cents: number;
  breakdown: { label: string; cents: number }[];
  turnaround_hours: number;
  rush: boolean;
  rush_available: boolean;
}

/** Rush is offered when the band has a multiplier above 1. */
export const rushAvailable = (jt: JobType) => (jt.price.rush_multiplier ?? 1) > 1;

/** Rush halves the turnaround (rounded up, at least one hour). */
export const rushHours = (hours: number) => Math.max(1, Math.ceil(hours / 2));

export function plural(word: string, n: number): string {
  if (n === 1) return word;
  if (/[^aeiou]y$/i.test(word)) return word.slice(0, -1) + "ies";
  if (/(s|x|z|ch|sh)$/i.test(word)) return word + "es";
  return word + "s";
}

const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
const usd = (amount: number) => `$${amount.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })}`;

/** The numeric spec value the size adjuster reads, when there is one. */
export function sizeValue(jt: JobType, spec: Record<string, unknown>): number | null {
  const field = jt.price.size?.field;
  if (!field) return null;
  const raw = spec[field];
  const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw.replace(/,/g, "")) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function priceFor(jt: JobType, spec: Record<string, unknown>, rushWanted: boolean): PriceResult {
  const band = jt.price;
  const rush = rushWanted && rushAvailable(jt);
  const breakdown: { label: string; cents: number }[] = [];
  const size = band.size;
  const unit = size ? size.unit.replace(/^extra\s+/i, "") : "";

  const base = Math.round(band.base_usd * 100);
  breakdown.push({ label: size ? `Base price, includes ${num(size.included)} ${plural(unit, size.included)}` : "Base price", cents: base });
  let total = base;

  const value = sizeValue(jt, spec);
  if (size && value !== null && value > size.included) {
    const extra = Math.ceil(value - size.included);
    const cents = Math.round(extra * size.per_unit_usd * 100);
    if (cents > 0) {
      breakdown.push({ label: `${num(extra)} extra ${plural(unit, extra)} at ${usd(size.per_unit_usd)} each`, cents });
      total += cents;
    }
  }

  if (rush) {
    const cents = Math.round(total * (band.rush_multiplier - 1));
    breakdown.push({ label: `Rush: ready in half the time (${num(band.rush_multiplier)} times the price)`, cents });
    total += cents;
  }

  const min = Math.round(band.min_usd * 100), max = Math.round(band.max_usd * 100);
  if (total > max) {
    breakdown.push({ label: "Capped at the most we charge for this job", cents: max - total });
    total = max;
  } else if (total < min) {
    breakdown.push({ label: "Raised to the lowest price for this job", cents: min - total });
    total = min;
  }

  return {
    price_cents: total,
    breakdown,
    turnaround_hours: rush ? rushHours(jt.turnaround_hours) : jt.turnaround_hours,
    rush,
    rush_available: rushAvailable(jt),
  };
}
