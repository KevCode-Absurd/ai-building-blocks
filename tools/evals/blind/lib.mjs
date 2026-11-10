// Shared helpers for the blind test harness.
// Node standard library only. Nothing here calls a model or the network.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_JOBS = path.join(HERE, 'jobs.json');

// The five scoring rows. Keys and points are fixed; each job words them its own way.
export const CRITERIA = [
  { key: 'job', points: 25, label: 'Job done' },
  { key: 'grounded', points: 25, label: 'Grounded' },
  { key: 'brand', points: 20, label: 'Brand' },
  { key: 'launchable', points: 20, label: 'Launchable' },
  { key: 'clarity', points: 10, label: 'Clarity' },
];

// Folders pack, prompts and tally make inside a run. A job can never use these names.
export const RESERVED = ['packets', 'key', 'prompts', 'verdicts'];

// Two totals this close count as a tie.
export const TIE_POINTS = 2;

const FAMILIES = { s: 'sonnet', o: 'opus' };

/** True when the module at `metaUrl` is the script Node was started with. */
export function isMain(metaUrl) {
  if (!process.argv[1]) return false;
  const a = path.resolve(process.argv[1]);
  const b = fileURLToPath(metaUrl);
  return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
}

export const toPosix = file => file.split(path.sep).join('/');

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

export function subDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

/** List what is wrong with a jobs file. An empty list means it is fine. */
export function jobProblems(data) {
  const problems = [];
  if (!data || !Array.isArray(data.jobs) || data.jobs.length === 0) return ['no jobs found'];
  const seen = new Set();
  for (const job of data.jobs) {
    const id = job?.id;
    if (typeof id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) { problems.push(`bad job id: ${JSON.stringify(id)}`); continue; }
    if (seen.has(id)) problems.push(`${id}: id used twice`);
    if (RESERVED.includes(id.toLowerCase())) problems.push(`${id}: this name is kept for the harness`);
    seen.add(id);
    for (const field of ['client', 'brief', 'web_check', 'judge_role']) {
      if (typeof job[field] !== 'string' || !job[field].trim()) problems.push(`${id}: missing ${field}`);
    }
    if (!Array.isArray(job.rubric)) { problems.push(`${id}: missing rubric`); continue; }
    const keys = job.rubric.map(row => row?.key).join(',');
    if (keys !== CRITERIA.map(c => c.key).join(',')) problems.push(`${id}: rubric keys must be ${CRITERIA.map(c => c.key).join(', ')} in that order`);
    for (const row of job.rubric) {
      const want = CRITERIA.find(c => c.key === row?.key);
      if (want && row.points !== want.points) problems.push(`${id}: ${row.key} must be worth ${want.points}`);
      if (typeof row?.text !== 'string' || !row.text.trim()) problems.push(`${id}: ${row?.key} has no wording`);
    }
    const sum = job.rubric.reduce((total, row) => total + (Number(row?.points) || 0), 0);
    if (sum !== 100) problems.push(`${id}: rubric adds up to ${sum}, not 100`);
  }
  return problems;
}

export function loadJobs(file = DEFAULT_JOBS) {
  const data = readJson(file);
  const problems = jobProblems(data);
  if (problems.length) throw new Error(`Jobs file ${file} has problems:\n- ${problems.join('\n- ')}`);
  return data.jobs;
}

/** s01 is a Sonnet judge, o03 an Opus judge. Anything else is "other". */
export function familyOf(judgeId) {
  const letters = /^[A-Za-z]+/.exec(String(judgeId ?? ''))?.[0]?.toLowerCase() ?? '';
  return FAMILIES[letters] ?? 'other';
}

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNumber = value => typeof value === 'number' && Number.isFinite(value);

/**
 * Check one verdict against the codes in its job.
 * Errors mean the verdict is left out of the tally. Warnings are reported but the verdict counts.
 */
export function validateVerdict(verdict, { job, codes, judgeId }) {
  const errors = [];
  const warnings = [];
  if (!isObject(verdict)) return { errors: ['the file is not a JSON object'], warnings };

  if (verdict.job !== job) errors.push(`"job" is ${JSON.stringify(verdict.job)} but the file sits in the ${job} folder`);
  if (verdict.judge !== judgeId) warnings.push(`"judge" is ${JSON.stringify(verdict.judge)} but the file name says ${judgeId}`);

  const scores = isObject(verdict.scores) ? verdict.scores : null;
  if (!scores) {
    errors.push('"scores" is missing');
  } else {
    const missing = codes.filter(code => !isObject(scores[code]));
    const extra = Object.keys(scores).filter(code => !codes.includes(code));
    if (missing.length) errors.push(`scores are missing for ${missing.join(', ')}`);
    if (extra.length) errors.push(`scores name unknown code(s) ${extra.join(', ')}`);
    for (const code of codes) {
      const row = scores[code];
      if (!isObject(row)) continue;
      let sum = 0;
      let complete = true;
      for (const { key, points } of CRITERIA) {
        const value = row[key];
        if (!isNumber(value)) { errors.push(`${code}.${key} is not a number`); complete = false; continue; }
        if (value < 0 || value > points) errors.push(`${code}.${key} is ${value}, outside 0 to ${points}`);
        sum += value;
      }
      if (!isNumber(row.total)) errors.push(`${code}.total is not a number`);
      else if (complete && Math.abs(row.total - sum) > 0.01) errors.push(`${code}.total is ${row.total} but the five scores add up to ${sum}`);
    }
  }

  const ranking = verdict.ranking;
  const isPermutation = Array.isArray(ranking) && ranking.length === codes.length && codes.every(code => ranking.includes(code));
  if (!isPermutation) errors.push(`"ranking" must list each of ${codes.join(', ')} once, but it is ${JSON.stringify(ranking ?? null)}`);

  if (!errors.length) {
    for (let high = 0; high < ranking.length; high += 1) {
      for (let low = high + 1; low < ranking.length; low += 1) {
        const gap = scores[ranking[low]].total - scores[ranking[high]].total;
        if (gap > TIE_POINTS) warnings.push(`ranking puts ${ranking[high]} above ${ranking[low]}, but ${ranking[low]} scored ${gap} points more`);
      }
    }
  }

  const sent = verdict.send_unchanged;
  if (sent !== 'none' && !codes.includes(sent)) warnings.push(`"send_unchanged" is ${JSON.stringify(sent ?? null)}; counted as none`);
  const invented = verdict.invented_facts;
  const badInvented = codes.filter(code => !isObject(invented) || !Array.isArray(invented[code]));
  if (badInvented.length) warnings.push(`"invented_facts" has no list for ${badInvented.join(', ')}; counted as 0`);

  return { errors, warnings };
}

/** Turn a valid verdict (by code) into one row of scores by arm. */
export function toRow(verdict, { job, judgeId, codeToArm }) {
  const arms = {};
  for (const [code, arm] of Object.entries(codeToArm)) {
    const score = verdict.scores[code];
    const row = { rank: verdict.ranking.indexOf(code) + 1, total: score.total };
    for (const { key } of CRITERIA) row[key] = score[key];
    row.invented = Array.isArray(verdict.invented_facts?.[code]) ? verdict.invented_facts[code].length : 0;
    row.sent = verdict.send_unchanged === code;
    arms[arm] = row;
  }
  return { job, judge: judgeId, family: familyOf(judgeId), first: codeToArm[verdict.ranking[0]], arms };
}

// ---------- numbers ----------

export const sum = values => values.reduce((total, value) => total + value, 0);
export const mean = values => (values.length ? sum(values) / values.length : null);

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function describe(values) {
  if (!values.length) return { mean: null, median: null, min: null, max: null };
  return { mean: mean(values), median: median(values), min: Math.min(...values), max: Math.max(...values) };
}

export function standardDeviation(values) {
  if (values.length < 2) return 0;
  const centre = mean(values);
  return Math.sqrt(sum(values.map(value => (value - centre) ** 2)) / (values.length - 1));
}

/** Small seeded random number generator, so a bootstrap gives the same answer every time. */
export function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round every number in a value to 4 decimal places, so the saved files stay readable. */
export function rounded(value) {
  if (typeof value === 'number') return Number.isInteger(value) ? value : Math.round(value * 1e4) / 1e4;
  if (Array.isArray(value)) return value.map(rounded);
  if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, rounded(inner)]));
  return value;
}
