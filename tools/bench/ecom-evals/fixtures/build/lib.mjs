// Shared helpers for the fixture builders. Plain Node, no packages, no network.
// Every fixture is test data: the file name says "(test data)" and the first line says so too.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const FIXTURES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Seeded random numbers, so a rebuild gives the same files byte for byte.
export function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}
export const round = (x, d = 0) => { const f = 10 ** d; return Math.round(x * f) / f; };
export const sum = a => a.reduce((x, y) => x + y, 0);

const facts = {}; // task id -> planted numbers, for the build report (never copied into run folders)
export function fact(task, name, value) { (facts[task] ??= {})[name] = value; return value; }
export function allFacts() { return facts; }

export function check(cond, msg) { if (!cond) throw new Error(`fixture check failed: ${msg}`); }

function dir(task) { const d = path.join(FIXTURES, task); mkdirSync(d, { recursive: true }); return d; }

function cell(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// CSV with a first comment line that marks it as test data.
export function csv(task, name, brand, note, rows) {
  const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
  const lines = [`# (test data) ${note} Built for an e-commerce eval. Not ${brand}'s real figures.`,
    cols.join(","), ...rows.map(r => cols.map(c => cell(r[c])).join(","))];
  const file = `${name} (test data).csv`;
  writeFileSync(path.join(dir(task), file), lines.join("\n") + "\n");
  return file;
}

export function md(task, name, brand, body) {
  const file = `${name} (test data).md`;
  const head = `> (test data) Built for an e-commerce eval. Not ${brand}'s real figures or documents.\n\n`;
  writeFileSync(path.join(dir(task), file), head + body.trim() + "\n");
  return file;
}

export function json(task, name, brand, obj) {
  const file = `${name} (test data).json`;
  writeFileSync(path.join(dir(task), file), JSON.stringify({ _note: `(test data) Built for an e-commerce eval. Not ${brand}'s real figures.`, ...obj }, null, 1) + "\n");
  return file;
}

// Spread a total over weights, as integers that add up exactly.
export function split(total, weights) {
  const w = sum(weights), raw = weights.map(x => total * x / w), out = raw.map(Math.floor);
  let left = total - sum(out);
  const order = raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; left > 0; k++, left--) out[order[k % order.length][1]]++;
  return out;
}

// Weekly dates (Mondays) ending on or before the given ISO date.
export function weeks(endIso, n) {
  const end = new Date(endIso + "T00:00:00Z"), out = [];
  for (let i = n - 1; i >= 0; i--) { const d = new Date(end); d.setUTCDate(d.getUTCDate() - 7 * i); out.push(d.toISOString().slice(0, 10)); }
  return out;
}
export function days(startIso, n) {
  const s = new Date(startIso + "T00:00:00Z"), out = [];
  for (let i = 0; i < n; i++) { const d = new Date(s); d.setUTCDate(d.getUTCDate() + i); out.push(d.toISOString().slice(0, 10)); }
  return out;
}
