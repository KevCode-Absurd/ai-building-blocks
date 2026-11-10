// Small builders for test runs. Everything is made in a temp folder and removed after each test.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CRITERIA } from '../lib.mjs';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURE_RUN = path.join(HERE, 'fixtures', 'p1');

export function tempRun(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blindtest-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

export function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

/** Five scores and their total. Pass a total to split it by the rubric weights, or the five scores. */
export function score(value) {
  if (typeof value === 'object') return { ...value, total: CRITERIA.reduce((sum, { key }) => sum + value[key], 0) };
  const row = {};
  let left = value;
  for (const { key, points } of CRITERIA) {
    row[key] = Math.floor((value * points) / 100);
    left -= row[key];
  }
  // Hand out what rounding left over, one point at a time, to rows that still have room.
  for (const { key, points } of CRITERIA) {
    if (left > 0 && row[key] < points) { row[key] += 1; left -= 1; }
  }
  return { ...row, total: value };
}

/** A well-formed verdict. `totals` maps code to a total or to five scores; ranking follows the totals unless given. */
export function verdict({ job, judge, totals, ranking, send = 'none', invented = {} }) {
  const scores = Object.fromEntries(Object.entries(totals).map(([code, value]) => [code, score(value)]));
  const codes = Object.keys(scores);
  return {
    job,
    judge,
    scores,
    ranking: ranking ?? [...codes].sort((a, b) => scores[b].total - scores[a].total),
    send_unchanged: send,
    invented_facts: Object.fromEntries(codes.map(code => [code, invented[code] ?? []])),
    reasons: 'test',
    biggest_flaw: Object.fromEntries(codes.map(code => [code, ''])),
    best_thing: Object.fromEntries(codes.map(code => [code, ''])),
  };
}

export function writeKey(run, jobs) {
  write(path.join(run, 'key', 'key.json'), JSON.stringify({ jobs }, null, 2));
}

export function writeVerdict(run, job, judge, body) {
  write(path.join(run, 'verdicts', job, `verdict-${judge}.json`), typeof body === 'string' ? body : JSON.stringify(body));
}
