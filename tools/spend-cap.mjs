// A hard cap on Anthropic API spend, shared by every script that calls the API (test-blocks.mjs, screen-items.mjs).
//
// Kevin approved $200 in total, counted from 2026-10-26 on, and raised it by $10 to $210 on 2026-10-28, across every label and script. Nothing goes out when
// spent + this call's estimate would pass the cap minus the headroom ($10), so real spend stays under the cap even when
// an estimate runs low.
//
// "Spent" is the larger of two counts:
// - the ledger (runs/api-spend-2026-10-26.json): every batch is entered with its estimate before it is sent, and the
//   estimate is swapped for the real cost when its results are collected; every direct call is entered with its cost;
// - the records: the usd on every run, grade and screen file written on or after 2026-10-26.
// A batch that was sent but not collected yet counts at its estimate.
//
//   node tools/spend-cap.mjs          print what's spent, what's held for open batches, and what's left
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
export const SINCE = "2026-10-26";
export const CAP_USD = 210;
// A script may keep back less (never under $2) by setting SPEND_HEADROOM_USD, e.g. for the last job before the cap.
export const HEADROOM_USD = Math.max(2, Number(process.env.SPEND_HEADROOM_USD) || 10);
export const LEDGER = path.join(ROOT, "runs", `api-spend-${SINCE}.json`);
const LOCK = LEDGER + ".lock";

// $ per million tokens: input, output, cache read, cache write (5-minute). Batches are half price.
// From the claude-api skill's model table (cached 2026-10-06). Haiku 5.5's price is for prompts up to 100K tokens.
export const PRICE = {
  "claude-fable-5-1": [10, 50, 0.25, 12.5],
  "claude-opus-5-5": [4, 20, 0.2, 5],
  "claude-sonnet-5-5": [2, 10, 0.2, 2.5],
  "claude-haiku-5-5": [0.1, 0.5, 0.01, 0.125],
};

export function cost(model, u, batch) {
  const p = PRICE[model];
  if (!p) throw new Error(`No price for ${model}: add it to PRICE in tools/spend-cap.mjs before spending on it.`);
  const [i, o, cr, cw] = p;
  const usd = ((u.input_tokens || 0) * i + (u.output_tokens || 0) * o + (u.cache_read_input_tokens || 0) * cr + (u.cache_creation_input_tokens || 0) * cw) / 1e6;
  return +(batch ? usd / 2 : usd).toFixed(6);
}

/** A cautious price for one request before it is sent: every input token at the full input price (no cache discount),
 * about 3 characters a token, and `outTokens` of output (thinking included). */
export function estimate(req, outTokens, batch) {
  const chars = JSON.stringify(req.system || "").length + JSON.stringify(req.messages || []).length;
  const [i, o] = PRICE[req.model] || [];
  if (i == null) throw new Error(`No price for ${req.model}.`);
  const usd = ((chars / 3) * i + Math.min(outTokens, req.max_tokens || outTokens) * o) / 1e6;
  return batch ? usd / 2 : usd;
}

const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };

function withLock(fn) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  const t0 = Date.now();
  for (;;) {
    try { fs.closeSync(fs.openSync(LOCK, "wx")); break; }
    catch (e) {
      if (e.code !== "EEXIST") throw e;
      // A lock older than a minute is from a crashed process.
      try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 60_000) fs.rmSync(LOCK, { force: true }); } catch {}
      if (Date.now() - t0 > 30_000) throw new Error("Couldn't lock the spend ledger.");
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }
  }
  try {
    const led = readJSON(LEDGER, { cap_usd: CAP_USD, headroom_usd: HEADROOM_USD, since: SINCE, entries: [] });
    const out = fn(led);
    fs.writeFileSync(LEDGER, JSON.stringify(led, null, 2));
    return out;
  } finally { fs.rmSync(LOCK, { force: true }); }
}

/** usd on every run, grade and screen record written on or after SINCE. */
function recordsSpend() {
  let usd = 0;
  const add = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".json")) continue;
      const r = readJSON(path.join(dir, f));
      if (r?.at && r.at.slice(0, 10) >= SINCE) usd += r.usd || 0;
    }
  };
  for (const base of ["runs/block-tests", "runs/screen", "runs/patches-api"]) {
    const d = path.join(ROOT, base);
    if (!fs.existsSync(d)) continue;
    for (const label of fs.readdirSync(d)) for (const sub of ["runs", "grades", "results", "prep"]) add(path.join(d, label, sub));
  }
  return usd;
}

export function spent() {
  const led = readJSON(LEDGER, { entries: [] });
  let actual = 0, held = 0;
  for (const e of led.entries) { if (e.actual_usd != null) actual += e.actual_usd; else held += e.estimate_usd || 0; }
  const records = recordsSpend();
  const total = Math.max(actual + held, records + held);
  return { actual, held, records, total, left: CAP_USD - HEADROOM_USD - total };
}

/** Throws when spending `usd` more could take total spend past the cap (minus headroom). */
export function guard(usd, what) {
  const s = spent();
  if (s.total + usd > CAP_USD - HEADROOM_USD) {
    throw new Error(`Spend cap: ${what} would cost about $${usd.toFixed(2)}, and $${s.total.toFixed(2)} is already spent or held. ` +
      `The cap is $${CAP_USD} with $${HEADROOM_USD} kept back, so $${Math.max(0, s.left).toFixed(2)} is left. Nothing was sent.`);
  }
  return s;
}

/** Enter a batch at its estimate, before (or right as) it is sent. */
export function reserve(entry) {
  return withLock((led) => { led.entries.push({ ...entry, at: new Date().toISOString(), actual_usd: null }); });
}

/** Swap a batch's estimate for its real cost once its results are in. */
export function settle(id, actualUsd) {
  return withLock((led) => {
    const e = led.entries.find((x) => x.id === id);
    if (e) { e.actual_usd = +actualUsd.toFixed(6); e.settled_at = new Date().toISOString(); }
    else led.entries.push({ id, kind: "batch", note: "collected without a reservation", at: new Date().toISOString(), estimate_usd: actualUsd, actual_usd: +actualUsd.toFixed(6) });
  });
}

/** Enter a direct (non-batch) call at its real cost. */
export function charge(entry, usd) {
  return withLock((led) => { led.entries.push({ ...entry, id: entry.id || `direct-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, at: new Date().toISOString(), estimate_usd: usd, actual_usd: +usd.toFixed(6) }); });
}

export function summary() {
  const s = spent();
  return `Spent $${(s.total - s.held).toFixed(2)} since ${SINCE} (ledger $${s.actual.toFixed(2)}, records $${s.records.toFixed(2)}), ` +
    `$${s.held.toFixed(2)} held for open batches. Cap $${CAP_USD} with $${HEADROOM_USD} kept back: $${Math.max(0, s.left).toFixed(2)} left to send.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(summary());
