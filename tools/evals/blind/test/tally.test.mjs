import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { toRow } from '../lib.mjs';
import { agreement, lead, pairwise, passMark, summarise, tally } from '../tally.mjs';
import { FIXTURE_RUN, HERE, tempRun, verdict, writeKey, writeVerdict } from './helpers.mjs';

const FIXTURE_JOBS = path.join(FIXTURE_RUN, 'jobs.json');
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 0.001, `${message ?? ''} expected ${expected}, got ${actual}`);

/** Rows for one job from a table of judge -> { arm: total }. */
function rows(job, table) {
  return Object.entries(table).map(([judge, totals]) => toRow(verdict({ job, judge, totals }), {
    job, judgeId: judge, codeToArm: Object.fromEntries(Object.keys(totals).map(arm => [arm, arm])),
  }));
}

// ---------- the 12 real verdicts from the prototype, with a fake key ----------

test('fixtures: 12 prototype verdicts tally to the hand-checked numbers', () => {
  const { results } = tally({ runDir: FIXTURE_RUN, target: 'arm-z', jobsFile: FIXTURE_JOBS });
  assert.deepEqual(results.counts, { jobs: 3, arms: 3, judges: 4, verdicts_counted: 12, verdicts_left_out: 0 });
  assert.deepEqual(results.bad_verdicts, []);
  assert.deepEqual(results.warnings, []);

  const { overall, jobs } = results;
  // Totals: X 1005/12, Y 936/12, Z 1013/12.
  near(overall.arms['arm-x'].total.mean, 83.75);
  near(overall.arms['arm-y'].total.mean, 78);
  near(overall.arms['arm-z'].total.mean, 84.4167);
  assert.deepEqual([overall.arms['arm-x'].total.min, overall.arms['arm-x'].total.max, overall.arms['arm-x'].total.median], [81, 88, 82.5]);
  assert.deepEqual([overall.arms['arm-y'].total.min, overall.arms['arm-y'].total.max], [69, 86]);

  // Who was ranked first: Z six times, X four, Y two.
  assert.deepEqual(['arm-x', 'arm-y', 'arm-z'].map(arm => overall.arms[arm].first_count), [4, 2, 6]);
  near(overall.arms['arm-z'].first_share, 0.5);
  near(overall.arms['arm-z'].mean_rank, 19 / 12);

  // Job J4: X 84, 85, 82, 87. Y 79, 79, 69, 73. Z 87, 84, 84, 78.
  assert.deepEqual(jobs.J4.arms['arm-x'].total, { mean: 84.5, median: 84.5, min: 82, max: 87 });
  assert.deepEqual(jobs.J4.arms['arm-y'].total, { mean: 75, median: 76, min: 69, max: 79 });
  assert.deepEqual(jobs.J4.arms['arm-z'].total, { mean: 83.25, median: 84, min: 78, max: 87 });
  assert.deepEqual(jobs.J4.arms['arm-y'].criteria.launchable, { mean: 14, median: 14, min: 14, max: 14 });
  // X against Z in J4: 84 v 87 lost, 85 v 84 tie, 82 v 84 tie (exactly 2 apart), 87 v 78 won.
  assert.deepEqual(jobs.J4.pairwise['arm-x']['arm-z'], { verdicts: 4, wins: 1, ties: 2, losses: 1, share: 0.5 });
  assert.deepEqual(jobs.J4.pairwise['arm-x']['arm-y'], { verdicts: 4, wins: 4, ties: 0, losses: 0, share: 1 });
  assert.deepEqual(['arm-x', 'arm-y', 'arm-z'].map(arm => jobs.J4.arms[arm].invented_facts), [2, 10, 10]);
  assert.equal(overall.arms['arm-z'].send_unchanged, 3);

  // Best mean total per job. J7 is a dead heat between X and Z at 83.
  assert.deepEqual(jobs.J4.best_mean_total, ['arm-x']);
  assert.deepEqual(jobs.J6.best_mean_total, ['arm-z']);
  assert.deepEqual(jobs.J7.best_mean_total, ['arm-x', 'arm-z']);

  // Judge agreement on the winner: J4 2 of 6 pairs, J6 3 of 6, J7 1 of 6.
  assert.deepEqual([jobs.J4, jobs.J6, jobs.J7].map(job => job.agreement.winner_pairs_agreeing), [2, 3, 1]);
  assert.equal(overall.agreement.winner_pairs, 18);
  near(overall.agreement.winner_agreement, 6 / 18);
  assert.deepEqual(overall.agreement.total_spread.widest_range, { job: 'J4', arm: 'arm-y', range: 10 });
  assert.equal(overall.agreement.total_spread.files, 9);

  // Split by judge model: two Sonnet and two Opus judges per job.
  assert.deepEqual(Object.keys(overall.by_family), ['opus', 'sonnet']);
  assert.equal(overall.by_family.sonnet.verdicts, 6);
  near(overall.by_family.sonnet.arms['arm-y'].total.mean, 75.5);
  near(overall.by_family.opus.arms['arm-y'].total.mean, 80.5);
  assert.deepEqual(overall.by_family.opus.judges, ['o1', 'o2']);
  // Opus judges, Z against Y: four clear wins, and two ties in J7 (82 v 81 and 84 v 86).
  assert.deepEqual(overall.by_family.opus.pairwise['arm-z']['arm-y'], { verdicts: 6, wins: 4, ties: 2, losses: 0, share: 0.8333 });

  // Lead of Z: +8/12 over X and +77/12 over Y, each inside its interval.
  near(overall.lead['arm-x'].mean, 8 / 12);
  near(overall.lead['arm-y'].mean, 77 / 12);
  for (const other of ['arm-x', 'arm-y']) {
    assert.ok(overall.lead[other].low <= overall.lead[other].mean && overall.lead[other].mean <= overall.lead[other].high);
  }
  assert.ok(overall.lead['arm-y'].low > 0, 'Z clearly leads Y');
  assert.ok(overall.lead['arm-x'].low < 0 && overall.lead['arm-x'].high > 0, 'Z against X is too close to call');

  // Pass mark: Z fails three checks and passes clarity (8.58 against 8.17 and 8.08).
  assert.equal(results.pass_mark.pass, false);
  assert.equal(results.pass_mark.full_set, false);
  assert.deepEqual(results.pass_mark.checks.map(check => [check.id, check.pass]), [['ranked_first', false], ['jobs_won', false], ['mean_lead', false], ['clarity', true]]);
  assert.deepEqual(results.pass_mark.checks[1].won, ['J6']);
});

test('fixtures: the same seed gives the same report, byte for byte', () => {
  const first = tally({ runDir: FIXTURE_RUN, target: 'arm-z', jobsFile: FIXTURE_JOBS });
  const second = tally({ runDir: FIXTURE_RUN, target: 'arm-z', jobsFile: FIXTURE_JOBS });
  assert.equal(first.markdown, second.markdown);
  assert.deepEqual(first.results, second.results);
  const other = tally({ runDir: FIXTURE_RUN, target: 'arm-z', jobsFile: FIXTURE_JOBS, seed: 99 });
  assert.notDeepEqual(other.results.overall.lead, first.results.overall.lead, 'another seed draws other resamples');
  assert.equal(other.results.overall.lead['arm-x'].mean, first.results.overall.lead['arm-x'].mean, 'the mean itself does not depend on the seed');
});

test('fixtures: the report names the pass mark, every job and no bad verdicts', () => {
  const { markdown } = tally({ runDir: FIXTURE_RUN, target: 'arm-z', jobsFile: FIXTURE_JOBS });
  assert.match(markdown, /\*\*FAIL\*\* for target arm `arm-z` \(only 3 of 7 jobs judged/);
  assert.match(markdown, /## Job J4: Prototype: Allbirds, 5 Meta ad concepts/);
  assert.match(markdown, /Best mean total: tie between arm-x and arm-z\./);
  assert.match(markdown, /\| arm-z \| 12 \| 84\.4 \| 84\.5 \| 78 \| 89 \| 50% \(6\) \| 1\.58 \| 23 \| 3 \|/);
  assert.match(markdown, /## Bad verdicts \(left out\)\n\nNone\./);
});

test('without a target the pass mark and leads are skipped', () => {
  const { results, markdown } = tally({ runDir: FIXTURE_RUN, jobsFile: FIXTURE_JOBS });
  assert.equal(results.pass_mark, null);
  assert.equal(results.overall.lead, undefined);
  assert.match(markdown, /No target arm was named/);
});

test('a target that is not in the key is refused', () => {
  assert.throws(() => tally({ runDir: FIXTURE_RUN, target: 'nobody' }), /Target arm "nobody" is not in the key/);
});

// ---------- ties ----------

test('pairwise: a gap of 2 or less is a tie and counts half', () => {
  const table = rows('J1', {
    s01: { a: 80, b: 78 }, // 2 apart: tie
    s02: { a: 80, b: 77 }, // 3 apart: a wins
    s03: { a: 70, b: 72 }, // 2 apart: tie
    s04: { a: 70, b: 73 }, // 3 apart: b wins
    o01: { a: 75, b: 75 }, // level: tie
  });
  assert.deepEqual(pairwise(table, 'a', 'b'), { verdicts: 5, wins: 1, ties: 3, losses: 1, share: 0.5 });
  assert.deepEqual(pairwise(table, 'b', 'a'), { verdicts: 5, wins: 1, ties: 3, losses: 1, share: 0.5 });
  const lopsided = rows('J1', { s01: { a: 80, b: 78 }, s02: { a: 90, b: 60 } });
  assert.equal(pairwise(lopsided, 'a', 'b').share, 0.75);
  assert.equal(pairwise(lopsided, 'b', 'a').share, 0.25);
  assert.equal(pairwise([], 'a', 'b').share, null);
});

test('a dead heat on mean total is nobody\'s job win', () => {
  const summary = summarise(rows('J1', { s01: { a: 80, b: 70 }, s02: { a: 70, b: 80 } }), { target: 'a' });
  assert.deepEqual(summary.best_mean_total, ['a', 'b']);
  const mark = passMark(summary, { J1: summary }, 'a');
  assert.deepEqual(mark.checks.find(check => check.id === 'jobs_won').won, []);
});

// ---------- agreement ----------

test('agreement counts pairs of judges inside each job only', () => {
  const table = [
    ...rows('J1', { s01: { a: 90, b: 70 }, s02: { a: 88, b: 72 }, o01: { a: 60, b: 80 } }),
    ...rows('J2', { s01: { a: 50, b: 70 }, s02: { a: 55, b: 75 } }),
  ];
  const result = agreement(table);
  assert.equal(result.winner_pairs, 4); // 3 pairs in J1 and 1 in J2
  assert.equal(result.winner_pairs_agreeing, 2);
  assert.equal(result.winner_agreement, 0.5);
  assert.deepEqual(result.total_spread.widest_range, { job: 'J1', arm: 'a', range: 30 });
  assert.equal(result.total_spread.files, 4);
  assert.equal(agreement(rows('J1', { s01: { a: 90, b: 70 } })).winner_agreement, null, 'one judge cannot agree with anyone');
});

// ---------- bootstrap ----------

test('lead: the bootstrap is seeded, and a steady lead has a zero-width interval', () => {
  const steady = [...rows('J1', { s01: { a: 90, b: 78 }, s02: { a: 80, b: 68 } }), ...rows('J2', { s01: { a: 70, b: 58 } })];
  assert.deepEqual(lead(steady, 'a', 'b'), { verdicts: 3, mean: 12, low: 12, high: 12 });

  const mixed = [
    ...rows('J1', { s01: { a: 90, b: 70 }, s02: { a: 80, b: 78 }, s03: { a: 70, b: 75 }, o01: { a: 85, b: 60 } }),
    ...rows('J2', { s01: { a: 60, b: 70 }, s02: { a: 88, b: 66 }, s03: { a: 77, b: 71 }, o01: { a: 92, b: 80 } }),
  ];
  const first = lead(mixed, 'a', 'b', { seed: 8, resamples: 2000 });
  assert.deepEqual(first, lead(mixed, 'a', 'b', { seed: 8, resamples: 2000 }));
  assert.notDeepEqual(first, lead(mixed, 'a', 'b', { seed: 9, resamples: 2000 }));
  assert.equal(first.mean, 9);
  assert.ok(first.low < first.mean && first.mean < first.high);
  // Leads run from -10 to +25, so no resample mean can fall outside that.
  assert.ok(first.low >= -10 && first.high <= 25);
  const back = lead(mixed, 'b', 'a', { seed: 8, resamples: 2000 });
  assert.equal(back.mean, -9);
  assert.deepEqual(lead([], 'a', 'b'), { verdicts: 0, mean: null, low: null, high: null });
});

// ---------- pass mark, on a full 7-job run ----------

const JOBS = ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7'];
const JUDGES = ['s01', 's02', 's03', 'o01', 'o02'];

function fullRun(t, scoreFor) {
  const run = tempRun(t);
  writeKey(run, Object.fromEntries(JOBS.map(job => [job, { K: 'ours', Q: 'plain' }])));
  for (const job of JOBS) {
    for (const judge of JUDGES) writeVerdict(run, job, judge, verdict({ job, judge, totals: scoreFor(job, judge) }));
  }
  return run;
}
const checks = results => Object.fromEntries(results.pass_mark.checks.map(check => [check.id, check.pass]));
const OURS = { job: 23, grounded: 23, brand: 18, launchable: 17, clarity: 9 }; // 90
const PLAIN = { job: 19, grounded: 19, brand: 15, launchable: 15, clarity: 7 }; // 75

test('pass mark: a clear winner on all four checks passes', t => {
  const { results, markdown } = tally({ runDir: fullRun(t, () => ({ K: OURS, Q: PLAIN })), target: 'ours' });
  assert.deepEqual(checks(results), { ranked_first: true, jobs_won: true, mean_lead: true, clarity: true });
  assert.equal(results.pass_mark.pass, true);
  assert.equal(results.pass_mark.full_set, true);
  assert.match(markdown, /\*\*PASS\*\* for target arm `ours`\n/);
  assert.equal(results.overall.lead.plain.mean, 15);
  // The other arm, judged by the same mark, fails.
  assert.equal(tally({ runDir: fullRun(t, () => ({ K: OURS, Q: PLAIN })), target: 'plain' }).results.pass_mark.pass, false);
});

test('pass mark: lower clarity alone fails it', t => {
  const murky = { ...OURS, launchable: 20, clarity: 6 }; // still 90
  const { results } = tally({ runDir: fullRun(t, () => ({ K: murky, Q: PLAIN })), target: 'ours' });
  assert.deepEqual(checks(results), { ranked_first: true, jobs_won: true, mean_lead: true, clarity: false });
  assert.equal(results.pass_mark.pass, false);
});

test('pass mark: clarity level with the other arm is allowed', t => {
  const level = { ...OURS, launchable: 19, clarity: 7 }; // still 90, clarity 7 like the plain arm
  const { results } = tally({ runDir: fullRun(t, () => ({ K: level, Q: PLAIN })), target: 'ours' });
  assert.equal(results.overall.arms.ours.criteria.clarity.mean, results.overall.arms.plain.criteria.clarity.mean);
  assert.deepEqual(checks(results), { ranked_first: true, jobs_won: true, mean_lead: true, clarity: true });
});

test('pass mark: exactly 80% ranked first and exactly 10 points ahead pass; just under fails', t => {
  // 2 arms, 7 jobs, 5 judges. Ours is ranked first by 4 of 5 judges in every job: exactly 80%.
  const a = { job: 22, grounded: 22, brand: 17, launchable: 17, clarity: 8 }; // 86
  const b = { job: 18, grounded: 18, brand: 14, launchable: 14, clarity: 8 }; // 72
  const exact = fullRun(t, (job, judge) => (judge === 'o02' ? { K: b, Q: { ...a, job: 24 } } : { K: { ...a, job: 25, grounded: 25, brand: 20 }, Q: b }));
  const first = tally({ runDir: exact, target: 'ours' }).results;
  assert.equal(first.overall.arms.ours.first_share, 0.8);
  assert.equal(checks(first).ranked_first, true);
  assert.equal(checks(first).jobs_won, true);

  const under = fullRun(t, (job, judge) => (judge === 'o02' || (job === 'J1' && judge === 'o01') ? { K: b, Q: a } : { K: a, Q: b }));
  const second = tally({ runDir: under, target: 'ours' }).results;
  assert.equal(second.overall.arms.ours.first_count, 27);
  assert.equal(checks(second).ranked_first, false);

  const tenAhead = fullRun(t, () => ({ K: { ...b, job: 23, grounded: 23 }, Q: b })); // 82 v 72
  assert.equal(tally({ runDir: tenAhead, target: 'ours' }).results.overall.lead.plain.mean, 10);
  assert.equal(checks(tally({ runDir: tenAhead, target: 'ours' }).results).mean_lead, true);
  const nineAhead = fullRun(t, (job, judge) => ({ K: { ...b, job: job === 'J1' && judge === 's01' ? 22 : 23, grounded: 23 }, Q: b }));
  assert.equal(checks(tally({ runDir: nineAhead, target: 'ours' }).results).mean_lead, false);
});

test('pass mark: winning 5 of 7 jobs is not enough, 6 of 7 is', t => {
  const lose = jobs => fullRun(t, job => (jobs.includes(job) ? { K: PLAIN, Q: { ...PLAIN, job: 22 } } : { K: OURS, Q: PLAIN }));
  const five = tally({ runDir: lose(['J3', 'J6']), target: 'ours' }).results;
  assert.equal(checks(five).jobs_won, false);
  assert.deepEqual(five.pass_mark.checks.find(check => check.id === 'jobs_won').won, ['J1', 'J2', 'J4', 'J5', 'J7']);
  const six = tally({ runDir: lose(['J3']), target: 'ours' }).results;
  assert.equal(checks(six).jobs_won, true);
});

test('pass mark: the lead must hold over every other arm, not just on average', t => {
  const run = tempRun(t);
  writeKey(run, Object.fromEntries(JOBS.map(job => [job, { K: 'ours', Q: 'plain', T: 'close' }])));
  for (const job of JOBS) {
    for (const judge of JUDGES) writeVerdict(run, job, judge, verdict({ job, judge, totals: { K: OURS, Q: { ...PLAIN, job: 5 }, T: { ...OURS, job: 18 } } }));
  }
  const { results } = tally({ runDir: run, target: 'ours' });
  assert.equal(results.overall.lead.plain.mean, 29);
  assert.equal(results.overall.lead.close.mean, 5);
  assert.deepEqual(checks(results), { ranked_first: true, jobs_won: true, mean_lead: false, clarity: true });
});

// ---------- bad verdicts ----------

test('bad verdicts are reported and left out, and the tally still runs', t => {
  const run = tempRun(t);
  writeKey(run, { J1: { K: 'ours', Q: 'plain', T: 'third' }, J2: { K: 'plain', Q: 'third', T: 'ours' } });
  const ok = (job, judge) => verdict({ job, judge, totals: { K: 90, Q: 80, T: 70 } });
  writeVerdict(run, 'J1', 's01', ok('J1', 's01'));
  writeVerdict(run, 'J1', 's02', '{"job":"J1", this is not json');
  const range = ok('J1', 's03'); range.scores.K.grounded = 40; range.scores.K.total += 40 - 22;
  writeVerdict(run, 'J1', 's03', range);
  const total = ok('J1', 's04'); total.scores.Q.total = 99;
  writeVerdict(run, 'J1', 's04', total);
  const missing = ok('J1', 'o01'); delete missing.scores.T;
  writeVerdict(run, 'J1', 'o01', missing);
  const ranking = ok('J1', 'o02'); ranking.ranking = ['K', 'K', 'Q'];
  writeVerdict(run, 'J1', 'o02', ranking);
  writeVerdict(run, 'J1', 'o03', '[]');
  writeVerdict(run, 'J2', 'o01', ok('J2', 'o01'));
  writeVerdict(run, 'J9', 's01', ok('J9', 's01'));
  const oddJudge = ok('J2', 'judge-b'); oddJudge.send_unchanged = 'all';
  writeVerdict(run, 'J2', 'judge-b', oddJudge);
  fs.writeFileSync(path.join(run, 'verdicts', 'J1', 'notes.txt'), 'not a verdict file');

  const { results, markdown } = tally({ runDir: run, target: 'ours' });
  assert.equal(results.counts.verdicts_counted, 3);
  assert.equal(results.counts.verdicts_left_out, 7);
  const errors = Object.fromEntries(results.bad_verdicts.map(item => [item.file, item.errors.join('; ')]));
  assert.match(errors['verdicts/J1/verdict-s02.json'], /not valid JSON/);
  assert.match(errors['verdicts/J1/verdict-s03.json'], /K\.grounded is 40, outside 0 to 25/);
  assert.match(errors['verdicts/J1/verdict-s04.json'], /Q\.total is 99 but the five scores add up to 80/);
  assert.match(errors['verdicts/J1/verdict-o01.json'], /scores are missing for T/);
  assert.match(errors['verdicts/J1/verdict-o02.json'], /"ranking" must list each of K, Q, T once/);
  assert.match(errors['verdicts/J1/verdict-o03.json'], /not a JSON object/);
  assert.match(errors['verdicts/J9/verdict-s01.json'], /the key has no job with this name/);
  assert.equal(results.warnings.length, 1);
  assert.match(results.warnings[0].warnings.join('; '), /send_unchanged.*counted as none.*judge id "judge-b"/);
  assert.match(markdown, /`verdicts\/J1\/verdict-s02\.json`: not valid JSON/);

  // Codes map to different arms in each job: K is ours in J1 and plain in J2.
  assert.equal(results.jobs.J1.arms.ours.total.mean, 90);
  assert.equal(results.jobs.J2.arms.ours.total.mean, 70);
  assert.equal(results.jobs.J2.arms.plain.total.mean, 90);
  assert.deepEqual(Object.keys(results.jobs.J2.by_family), ['opus', 'other']);
});

test('a run with a key but no verdicts yet gives an empty report, not a crash', t => {
  const run = tempRun(t);
  writeKey(run, { J1: { K: 'ours', Q: 'plain' } });
  const { results, markdown } = tally({ runDir: run, target: 'ours' });
  assert.equal(results.counts.verdicts_counted, 0);
  assert.equal(results.pass_mark.pass, false);
  assert.match(markdown, /No valid verdicts\./);
  assert.throws(() => tally({ runDir: tempRun(t) }), /No key at/);
});

// ---------- the command ----------

test('the command writes RESULTS.md and results.json and prints the pass line', t => {
  const run = tempRun(t);
  fs.cpSync(FIXTURE_RUN, run, { recursive: true });
  const out = execFileSync(process.execPath, [path.join(HERE, '..', 'tally.mjs'), '--run', run, '--target', 'arm-z', '--jobs', path.join(run, 'jobs.json')], { encoding: 'utf8' });
  assert.match(out, /12 verdicts counted, 0 left out as bad\./);
  assert.match(out, /Pass mark for arm-z: FAIL \(only 3 of 7 jobs judged\)/);
  const saved = JSON.parse(fs.readFileSync(path.join(run, 'results.json'), 'utf8'));
  assert.equal(saved.overall.arms['arm-z'].total.mean, 84.4167);
  assert.equal(saved.settings.seed, 8);
  assert.equal(saved.settings.resamples, 2000);
  assert.equal(fs.readFileSync(path.join(run, 'RESULTS.md'), 'utf8'), tally({ runDir: FIXTURE_RUN, target: 'arm-z', jobsFile: FIXTURE_JOBS }).markdown.replace('Run `p1`', `Run \`${path.basename(run)}\``));
});
