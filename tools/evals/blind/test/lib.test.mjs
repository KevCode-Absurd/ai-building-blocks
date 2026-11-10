import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CRITERIA, DEFAULT_JOBS, describe, familyOf, jobProblems, loadJobs, median, mulberry32, readJson, rounded, toRow, validateVerdict,
} from '../lib.mjs';
import { score, verdict } from './helpers.mjs';

const CODES = ['K', 'Q', 'T'];
const context = { job: 'J1', codes: CODES, judgeId: 's01' };
const good = () => verdict({ job: 'J1', judge: 's01', totals: { K: 90, Q: 80, T: 70 } });

test('the rubric rows add up to 100', () => {
  assert.equal(CRITERIA.reduce((sum, row) => sum + row.points, 0), 100);
  assert.deepEqual(CRITERIA.map(row => [row.key, row.points]), [['job', 25], ['grounded', 25], ['brand', 20], ['launchable', 20], ['clarity', 10]]);
});

test('jobs.json holds the 7-job set with a full rubric each', () => {
  const data = readJson(DEFAULT_JOBS);
  assert.deepEqual(jobProblems(data), []);
  const jobs = loadJobs();
  assert.deepEqual(jobs.map(job => job.id), ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7']);
  assert.deepEqual(jobs.map(job => job.client), ['Allbirds', 'Allbirds', 'Gehna', 'Gehna', 'Plausible Analytics', 'Plausible Analytics', 'Gehna']);
  assert.deepEqual(jobs.filter(job => job.deliverable === 'deliverable.html').map(job => job.id), ['J2', 'J5']);
  for (const job of jobs) {
    assert.equal(job.rubric.reduce((sum, row) => sum + row.points, 0), 100, job.id);
    assert.deepEqual(job.rubric.map(row => row.key), CRITERIA.map(row => row.key), job.id);
    assert.match(job.judge_role, /^a senior /, job.id);
    const sentences = job.brief.split(/[.?!](?=\s|$)/).filter(part => part.trim()).length;
    assert.ok(sentences >= 2 && sentences <= 3, `${job.id} brief has ${sentences} sentences`);
    assert.ok(!job.brief.includes('"'), `${job.id} brief has a double quote, which would break the prompt`);
    const words = [job.brief, job.web_check, ...job.rubric.map(row => row.text)].join(' ');
    assert.doesNotMatch(words, /ai[\s-]*blocks/i, `${job.id} must not name AI Blocks`);
  }
});

test('jobProblems reports a broken rubric', () => {
  const data = structuredClone(readJson(DEFAULT_JOBS));
  data.jobs[0].rubric[0].points = 30;
  data.jobs[1].rubric.pop();
  data.jobs[2].id = 'packets';
  delete data.jobs[3].brief;
  const problems = jobProblems(data).join('\n');
  assert.match(problems, /J1: job must be worth 25/);
  assert.match(problems, /J1: rubric adds up to 105, not 100/);
  assert.match(problems, /J2: rubric keys must be/);
  assert.match(problems, /packets: this name is kept for the harness/);
  assert.match(problems, /J4: missing brief/);
  assert.deepEqual(jobProblems({ jobs: [] }), ['no jobs found']);
});

test('judge ids map to a model family', () => {
  assert.equal(familyOf('s01'), 'sonnet');
  assert.equal(familyOf('s10'), 'sonnet');
  assert.equal(familyOf('o04'), 'opus');
  assert.equal(familyOf('O2'), 'opus');
  assert.equal(familyOf('x1'), 'other');
  assert.equal(familyOf(''), 'other');
});

test('a well-formed verdict has no errors or warnings', () => {
  assert.deepEqual(validateVerdict(good(), context), { errors: [], warnings: [] });
});

test('scores out of range are errors', () => {
  const over = good();
  over.scores.K = { job: 26, grounded: 25, brand: 20, launchable: 20, clarity: 10, total: 101 };
  assert.match(validateVerdict(over, context).errors.join('\n'), /K\.job is 26, outside 0 to 25/);

  const under = good();
  under.scores.Q = { ...under.scores.Q, clarity: -1, total: under.scores.Q.total - under.scores.Q.clarity - 1 };
  assert.match(validateVerdict(under, context).errors.join('\n'), /Q\.clarity is -1, outside 0 to 10/);

  const edge = good();
  edge.scores.K = score({ job: 25, grounded: 25, brand: 20, launchable: 20, clarity: 10 });
  edge.scores.T = score({ job: 0, grounded: 0, brand: 0, launchable: 0, clarity: 0 });
  assert.deepEqual(validateVerdict(edge, context).errors, [], 'the top and bottom of each range are allowed');
});

test('a total that is not the sum of the five scores is an error', () => {
  const bad = good();
  bad.scores.Q.total += 1;
  assert.match(validateVerdict(bad, context).errors.join('\n'), /Q\.total is 81 but the five scores add up to 80/);
});

test('scores that are not numbers are errors', () => {
  const bad = good();
  bad.scores.T.brand = '14';
  delete bad.scores.K.total;
  const errors = validateVerdict(bad, context).errors.join('\n');
  assert.match(errors, /T\.brand is not a number/);
  assert.match(errors, /K\.total is not a number/);
});

test('missing and unknown codes are errors', () => {
  const missing = good();
  delete missing.scores.T;
  assert.match(validateVerdict(missing, context).errors.join('\n'), /scores are missing for T/);

  const empty = good();
  empty.scores.Q = {};
  assert.match(validateVerdict(empty, context).errors.join('\n'), /Q\.job is not a number/);

  const extra = good();
  extra.scores.Z = score(50);
  assert.match(validateVerdict(extra, context).errors.join('\n'), /scores name unknown code\(s\) Z/);

  assert.match(validateVerdict({ job: 'J1', judge: 's01', ranking: CODES }, context).errors.join('\n'), /"scores" is missing/);
});

test('a ranking that is not a permutation of the codes is an error', () => {
  for (const ranking of [['K', 'Q'], ['K', 'K', 'T'], ['K', 'Q', 'Z'], ['K', 'Q', 'T', 'K'], 'K,Q,T', undefined, ['best', 'second', 'third']]) {
    const bad = good();
    bad.ranking = ranking;
    assert.match(validateVerdict(bad, context).errors.join('\n'), /"ranking" must list each of K, Q, T once/, JSON.stringify(ranking));
  }
});

test('a verdict filed under the wrong job is an error, and odd extras are warnings', () => {
  const wrongJob = good();
  wrongJob.job = 'J2';
  assert.match(validateVerdict(wrongJob, context).errors.join('\n'), /"job" is "J2" but the file sits in the J1 folder/);

  const odd = good();
  odd.judge = 's02';
  odd.send_unchanged = 'maybe';
  delete odd.invented_facts.T;
  const result = validateVerdict(odd, context);
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.length, 3);
});

test('a ranking that goes against the totals by more than 2 points is a warning', () => {
  const close = verdict({ job: 'J1', judge: 's01', totals: { K: 80, Q: 82, T: 70 }, ranking: ['K', 'Q', 'T'] });
  assert.deepEqual(validateVerdict(close, context).warnings, [], 'within 2 points is a fair tie call');
  const far = verdict({ job: 'J1', judge: 's01', totals: { K: 80, Q: 83, T: 70 }, ranking: ['K', 'Q', 'T'] });
  assert.match(validateVerdict(far, context).warnings.join('\n'), /ranking puts K above Q, but Q scored 3 points more/);
});

test('things that are not verdict objects are errors, not crashes', () => {
  for (const value of [null, [], 'text', 7]) assert.deepEqual(validateVerdict(value, context).errors, ['the file is not a JSON object']);
});

test('toRow maps codes to arms', () => {
  const row = toRow(verdict({ job: 'J1', judge: 'o02', totals: { K: 70, Q: 90, T: 80 }, send: 'Q', invented: { K: ['a', 'b'] } }), {
    job: 'J1', judgeId: 'o02', codeToArm: { K: 'plain', Q: 'ours', T: 'third' },
  });
  assert.equal(row.family, 'opus');
  assert.equal(row.first, 'ours');
  assert.deepEqual([row.arms.ours.rank, row.arms.third.rank, row.arms.plain.rank], [1, 2, 3]);
  assert.equal(row.arms.plain.invented, 2);
  assert.equal(row.arms.ours.sent, true);
  assert.equal(row.arms.plain.sent, false);
  assert.equal(row.arms.ours.total, 90);
});

test('number helpers', () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.deepEqual(describe([82, 84, 85, 87]), { mean: 84.5, median: 84.5, min: 82, max: 87 });
  assert.deepEqual(describe([]), { mean: null, median: null, min: null, max: null });
  assert.deepEqual(rounded({ a: 1 / 3, b: [2 / 3, 5], c: null, d: 'x' }), { a: 0.3333, b: [0.6667, 5], c: null, d: 'x' });
  const a = mulberry32(8);
  const b = mulberry32(8);
  const c = mulberry32(9);
  const first = [a(), a(), a()];
  assert.deepEqual(first, [b(), b(), b()], 'same seed, same numbers');
  assert.notDeepEqual(first, [c(), c(), c()]);
  assert.ok(first.every(value => value >= 0 && value < 1));
});
