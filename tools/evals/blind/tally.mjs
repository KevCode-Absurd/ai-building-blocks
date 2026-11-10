#!/usr/bin/env node
// Add up the judges' verdicts and say whether the target arm met the pass mark.
//
//   node tools/evals/blind/tally.mjs --run <dir> --target <arm> [--seed 8] [--resamples 2000] [--jobs <file>]
//
// Reads   <run>/key/key.json and <run>/verdicts/<job>/verdict-<judge id>.json
// Writes  <run>/RESULTS.md and <run>/results.json
//
// Run this only when judging is over: the results name the arms.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  CRITERIA, DEFAULT_JOBS, TIE_POINTS, describe, isMain, mean, mulberry32, readJson, rounded,
  standardDeviation, subDirs, sum, toPosix, toRow, validateVerdict, writeJson,
} from './lib.mjs';

export const PASS_MARK = { first_share: 0.8, jobs_won: 6, jobs_in_set: 7, lead: 10 };
const VERDICT_FILE = /^verdict-(.+)\.json$/i;
const EPSILON = 1e-9;

// ---------- reading ----------

/** Read the key and every verdict. Bad verdicts are listed, never thrown. */
export function readRun(runDir) {
  const run = path.resolve(runDir);
  const keyFile = path.join(run, 'key', 'key.json');
  if (!fs.existsSync(keyFile)) throw new Error(`No key at ${toPosix(keyFile)}. Run pack.mjs first.`);
  const key = readJson(keyFile).jobs ?? {};
  const rows = [];
  const bad = [];
  const warned = [];
  const verdictsDir = path.join(run, 'verdicts');
  const jobIds = [...new Set([...Object.keys(key), ...subDirs(verdictsDir)])].sort();
  for (const job of jobIds) {
    const dir = path.join(verdictsDir, job);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(name => VERDICT_FILE.test(name)).sort() : [];
    for (const name of files) {
      const judgeId = VERDICT_FILE.exec(name)[1];
      const file = `verdicts/${job}/${name}`;
      if (!key[job]) { bad.push({ file, job, judge: judgeId, errors: ['the key has no job with this name'] }); continue; }
      let verdict;
      try {
        verdict = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8').replace(/^﻿/, ''));
      } catch (error) {
        bad.push({ file, job, judge: judgeId, errors: [`not valid JSON: ${error.message}`] });
        continue;
      }
      const { errors, warnings } = validateVerdict(verdict, { job, codes: Object.keys(key[job]), judgeId });
      if (!/^[A-Za-z]+\d+$/.test(judgeId)) warnings.push(`judge id "${judgeId}" is not a letter plus a number (s01, o01); its model family is counted as "other"`);
      if (errors.length) { bad.push({ file, job, judge: judgeId, errors }); continue; }
      if (warnings.length) warned.push({ file, job, judge: judgeId, warnings });
      rows.push(toRow(verdict, { job, judgeId, codeToArm: key[job] }));
    }
  }
  return { run, key, rows, bad, warned };
}

// ---------- sums ----------

function armStats(rows, arm) {
  const mine = rows.filter(row => row.arms[arm]).map(row => row.arms[arm]);
  const firsts = rows.filter(row => row.arms[arm] && row.first === arm).length;
  return {
    verdicts: mine.length,
    total: describe(mine.map(score => score.total)),
    criteria: Object.fromEntries(CRITERIA.map(({ key }) => [key, describe(mine.map(score => score[key]))])),
    first_count: firsts,
    first_share: mine.length ? firsts / mine.length : null,
    mean_rank: mean(mine.map(score => score.rank)),
    invented_facts: sum(mine.map(score => score.invented)),
    send_unchanged: mine.filter(score => score.sent).length,
  };
}

/** Head to head on totals. A gap of TIE_POINTS or less is a tie and counts half. */
export function pairwise(rows, arm, other) {
  const both = rows.filter(row => row.arms[arm] && row.arms[other]);
  let wins = 0;
  let ties = 0;
  for (const row of both) {
    const gap = row.arms[arm].total - row.arms[other].total;
    if (Math.abs(gap) <= TIE_POINTS) ties += 1;
    else if (gap > 0) wins += 1;
  }
  const losses = both.length - wins - ties;
  return { verdicts: both.length, wins, ties, losses, share: both.length ? (wins + ties / 2) / both.length : null };
}

const armsIn = rows => [...new Set(rows.flatMap(row => Object.keys(row.arms)))].sort();

function core(rows, arms = armsIn(rows)) {
  return {
    verdicts: rows.length,
    judges: [...new Set(rows.map(row => row.judge))].sort(),
    arms: Object.fromEntries(arms.map(arm => [arm, armStats(rows, arm)])),
    pairwise: Object.fromEntries(arms.map(arm => [arm, Object.fromEntries(arms.filter(other => other !== arm).map(other => [other, pairwise(rows, arm, other)]))])),
  };
}

function byJob(rows) {
  const groups = new Map();
  for (const row of rows) groups.set(row.job, [...(groups.get(row.job) ?? []), row]);
  return groups;
}

/** How much the judges agree: on the winner, and on the total for the same file. */
export function agreement(rows) {
  let pairs = 0;
  let agree = 0;
  const spreads = [];
  for (const [job, group] of byJob(rows)) {
    for (let a = 0; a < group.length; a += 1) {
      for (let b = a + 1; b < group.length; b += 1) {
        pairs += 1;
        if (group[a].first === group[b].first) agree += 1;
      }
    }
    for (const arm of new Set(group.flatMap(row => Object.keys(row.arms)))) {
      const totals = group.filter(row => row.arms[arm]).map(row => row.arms[arm].total);
      if (totals.length < 2) continue;
      spreads.push({ job, arm, judges: totals.length, range: Math.max(...totals) - Math.min(...totals), sd: standardDeviation(totals) });
    }
  }
  const widest = spreads.reduce((best, item) => (!best || item.range > best.range ? item : best), null);
  return {
    winner_pairs: pairs,
    winner_pairs_agreeing: agree,
    winner_agreement: pairs ? agree / pairs : null,
    total_spread: {
      files: spreads.length,
      mean_range: mean(spreads.map(item => item.range)),
      mean_sd: mean(spreads.map(item => item.sd)),
      widest_range: widest ? { job: widest.job, arm: widest.arm, range: widest.range } : null,
    },
  };
}

/**
 * Mean lead of `target` over `other`, in points, with a bootstrap 95% interval.
 * Each resample draws judges again, with replacement, inside each job, then takes the mean lead over all of them.
 */
export function lead(rows, target, other, { seed = 8, resamples = 2000 } = {}) {
  const groups = [...byJob(rows.filter(row => row.arms[target] && row.arms[other])).values()]
    .map(group => group.map(row => row.arms[target].total - row.arms[other].total));
  const all = groups.flat();
  if (!all.length) return { verdicts: 0, mean: null, low: null, high: null };
  const random = mulberry32(seed);
  const means = [];
  for (let i = 0; i < resamples; i += 1) {
    let total = 0;
    for (const group of groups) {
      for (let draw = 0; draw < group.length; draw += 1) total += group[Math.floor(random() * group.length)];
    }
    means.push(total / all.length);
  }
  means.sort((a, b) => a - b);
  const at = share => means[Math.min(means.length - 1, Math.max(0, Math.round(share * (means.length - 1))))];
  return { verdicts: all.length, mean: mean(all), low: at(0.025), high: at(0.975) };
}

/** The full set of numbers for a group of rows: one job, or all of them. */
export function summarise(rows, { target = null, seed = 8, resamples = 2000, arms = armsIn(rows) } = {}) {
  const summary = core(rows, arms);
  const families = [...new Set(rows.map(row => row.family))].sort();
  summary.by_family = Object.fromEntries(families.map(family => [family, core(rows.filter(row => row.family === family), arms)]));
  summary.agreement = agreement(rows);
  const ranked = Object.entries(summary.arms).filter(([, stats]) => stats.verdicts).sort(([, a], [, b]) => b.total.mean - a.total.mean);
  // The arm with the best mean total. More than one arm here means a tie.
  summary.best_mean_total = ranked.filter(([, stats]) => Math.abs(stats.total.mean - ranked[0][1].total.mean) < EPSILON).map(([arm]) => arm);
  if (target && summary.arms[target]) {
    summary.lead = Object.fromEntries(Object.keys(summary.arms).filter(arm => arm !== target).map(other => [other, lead(rows, target, other, { seed, resamples })]));
  }
  return summary;
}

/** The pass mark, check by check. */
export function passMark(overall, jobs, target) {
  const mine = overall.arms[target];
  const others = Object.keys(overall.arms).filter(arm => arm !== target);
  const jobIds = Object.keys(jobs);
  const judged = jobIds.filter(id => jobs[id].verdicts > 0);
  const won = judged.filter(id => jobs[id].best_mean_total.length === 1 && jobs[id].best_mean_total[0] === target);
  const needJobs = Math.ceil((judged.length * PASS_MARK.jobs_won) / PASS_MARK.jobs_in_set);
  const leads = others.map(other => ({ arm: other, mean: overall.lead?.[other]?.mean ?? null }));
  const clarity = others.map(other => ({ arm: other, mean: overall.arms[other].criteria.clarity.mean }));
  const myClarity = mine?.criteria.clarity.mean ?? null;
  const checks = [
    {
      id: 'ranked_first',
      pass: Boolean(mine?.verdicts) && mine.first_share >= PASS_MARK.first_share - EPSILON,
      text: `Ranked first by ${mine?.verdicts ? percent(mine.first_share) : 'no'} of judges overall (${mine?.first_count ?? 0} of ${mine?.verdicts ?? 0} verdicts; needs at least ${percent(PASS_MARK.first_share)})`,
    },
    {
      id: 'jobs_won',
      pass: judged.length > 0 && won.length >= needJobs,
      text: `Won ${won.length} of ${judged.length} jobs on mean total (needs at least ${needJobs}${judged.length === PASS_MARK.jobs_in_set ? '' : `, which is ${PASS_MARK.jobs_won} of ${PASS_MARK.jobs_in_set} scaled to ${judged.length} jobs`})`,
      won,
    },
    {
      id: 'mean_lead',
      pass: leads.length > 0 && leads.every(item => item.mean !== null && item.mean >= PASS_MARK.lead - EPSILON),
      text: `Mean lead over each other arm: ${leads.map(item => `${signed(item.mean)} over ${item.arm}`).join(', ') || 'no other arm'} (needs at least ${PASS_MARK.lead} points over each)`,
    },
    {
      id: 'clarity',
      pass: myClarity !== null && clarity.every(item => item.mean === null || myClarity >= item.mean - EPSILON),
      text: `Clarity ${fixed(myClarity)} against ${clarity.map(item => `${fixed(item.mean)} for ${item.arm}`).join(', ') || 'no other arm'} (must not be lower than any other arm)`,
    },
  ];
  return {
    target,
    pass: checks.every(check => check.pass),
    full_set: judged.length === PASS_MARK.jobs_in_set,
    jobs_judged: judged.length,
    checks,
  };
}

// ---------- the whole tally ----------

export function tally({ runDir, target = null, seed = 8, resamples = 2000, jobsFile = DEFAULT_JOBS }) {
  const { run, key, rows, bad, warned } = readRun(runDir);
  const arms = [...new Set(Object.values(key).flatMap(codes => Object.values(codes)))].sort();
  if (target && !arms.includes(target)) throw new Error(`Target arm "${target}" is not in the key. Arms: ${arms.join(', ')}`);

  // The jobs file only gives each job a title here, so a missing or partial file is fine.
  let titles = {};
  try {
    titles = Object.fromEntries(readJson(jobsFile).jobs.filter(job => job?.id && job.title).map(job => [job.id, job.title]));
  } catch { /* no titles */ }

  const options = { target, seed, resamples };
  const jobs = {};
  for (const id of Object.keys(key).sort()) {
    const jobArms = [...new Set(Object.values(key[id]))].sort();
    jobs[id] = { title: titles[id] ?? id, ...summarise(rows.filter(row => row.job === id), { ...options, arms: jobArms }) };
  }
  const overall = summarise(rows, { ...options, arms });

  const results = rounded({
    run: path.basename(run),
    target,
    settings: { seed, resamples, tie_points: TIE_POINTS, pass_mark: PASS_MARK },
    counts: { jobs: Object.keys(key).length, arms: arms.length, judges: overall.judges.length, verdicts_counted: rows.length, verdicts_left_out: bad.length },
    arms,
    pass_mark: target ? passMark(overall, jobs, target) : null,
    overall,
    jobs,
    bad_verdicts: bad,
    warnings: warned,
  });
  return { run, results, markdown: renderMarkdown(results) };
}

// ---------- the report ----------

function fixed(value, digits = 1) { return value === null || value === undefined ? 'n/a' : value.toFixed(digits); }
function signed(value) { return value === null || value === undefined ? 'n/a' : `${value >= 0 ? '+' : ''}${value.toFixed(1)}`; }
function percent(value) { return value === null || value === undefined ? 'n/a' : `${Math.round(value * 100)}%`; }
function table(head, body) {
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...body.map(cells => `| ${cells.join(' | ')} |`)].join('\n');
}
const spread = stats => (stats.mean === null ? 'n/a' : `${fixed(stats.mean)} / ${fixed(stats.median)} / ${stats.min} / ${stats.max}`);

function totalsTable(summary) {
  return table(
    ['Arm', 'Verdicts', 'Mean total', 'Median', 'Min', 'Max', 'Ranked first', 'Mean rank', 'Invented-fact entries', 'Would send unchanged'],
    Object.entries(summary.arms).map(([arm, stats]) => [
      arm, stats.verdicts, fixed(stats.total.mean), fixed(stats.total.median), stats.total.min ?? 'n/a', stats.total.max ?? 'n/a',
      `${percent(stats.first_share)} (${stats.first_count})`, fixed(stats.mean_rank, 2), stats.invented_facts, stats.send_unchanged,
    ]),
  );
}

function criteriaTable(summary) {
  return table(
    ['Arm', ...CRITERIA.map(criterion => `${criterion.label} (${criterion.points})`)],
    Object.entries(summary.arms).map(([arm, stats]) => [arm, ...CRITERIA.map(({ key }) => spread(stats.criteria[key]))]),
  );
}

function pairwiseTable(summary) {
  const arms = Object.keys(summary.arms);
  return table(
    ['Row beats column', ...arms],
    arms.map(arm => [arm, ...arms.map(other => {
      if (other === arm) return '-';
      const cell = summary.pairwise[arm][other];
      return cell.verdicts ? `${percent(cell.share)} (${cell.wins}W ${cell.ties}T ${cell.losses}L)` : 'n/a';
    })]),
  );
}

function leadTable(summary, target) {
  return table(
    [`Lead of ${target} over`, 'Verdicts', 'Mean lead', '95% interval'],
    Object.entries(summary.lead).map(([other, item]) => [other, item.verdicts, signed(item.mean), item.mean === null ? 'n/a' : `${signed(item.low)} to ${signed(item.high)}`]),
  );
}

function familyTable(summary) {
  const body = [];
  for (const [family, part] of Object.entries(summary.by_family)) {
    for (const [arm, stats] of Object.entries(part.arms)) {
      const others = Object.entries(part.pairwise[arm]).map(([other, cell]) => `${percent(cell.share)} v ${other}`).join(', ');
      body.push([
        family, arm, stats.verdicts, fixed(stats.total.mean), fixed(stats.total.median), stats.total.min ?? 'n/a', stats.total.max ?? 'n/a',
        `${percent(stats.first_share)} (${stats.first_count})`, fixed(stats.mean_rank, 2), fixed(stats.criteria.clarity.mean), others,
      ]);
    }
  }
  return table(['Judge model', 'Arm', 'Verdicts', 'Mean total', 'Median', 'Min', 'Max', 'Ranked first', 'Mean rank', 'Mean clarity', 'Head-to-head win share'], body);
}

function agreementLines(summary) {
  const { winner_pairs: pairs, winner_pairs_agreeing: agree, winner_agreement: share, total_spread: gap } = summary.agreement;
  const lines = [];
  lines.push(pairs
    ? `- Two judges of the same job picked the same winner in ${agree} of ${pairs} pairs (${percent(share)}).`
    : '- Fewer than two judges per job, so there is no agreement figure.');
  if (gap.files) {
    lines.push(`- For the same file, the highest and lowest judge were ${fixed(gap.mean_range)} points apart on average (standard deviation ${fixed(gap.mean_sd)}). The widest gap was ${gap.widest_range.range} points (job ${gap.widest_range.job}, arm ${gap.widest_range.arm}).`);
  }
  return lines.join('\n');
}

function section(summary, target, depth) {
  const h = '#'.repeat(depth);
  if (!summary.verdicts) return 'No valid verdicts.';
  const parts = [
    `${h} Totals`, totalsTable(summary),
    `${h} By criterion (mean / median / min / max)`, criteriaTable(summary),
    `${h} Head to head on totals (ties within ${TIE_POINTS} points count half)`, pairwiseTable(summary),
  ];
  if (target && summary.lead) parts.push(`${h} Lead of ${target} (bootstrap 95% interval)`, leadTable(summary, target));
  parts.push(`${h} Split by judge model`, familyTable(summary), `${h} Judge agreement`, agreementLines(summary));
  return parts.join('\n\n');
}

export function renderMarkdown(results) {
  const { counts, target, pass_mark: mark, settings } = results;
  const out = ['# Blind test results', ''];
  out.push(`Run \`${results.run}\`: ${counts.verdicts_counted} verdicts counted from ${counts.judges} judges, across ${counts.jobs} jobs and ${counts.arms} arms (${results.arms.join(', ')}). ${counts.verdicts_left_out} bad verdicts left out.`);
  out.push('');
  out.push(`Overall figures pool every counted verdict. Intervals come from ${settings.resamples} bootstrap resamples of judges within each job (seed ${settings.seed}), so the same verdicts always give the same numbers.`);
  out.push('', '## Pass mark', '');
  if (mark) {
    out.push(`**${mark.pass ? 'PASS' : 'FAIL'}** for target arm \`${target}\`${mark.full_set ? '' : ` (only ${mark.jobs_judged} of ${settings.pass_mark.jobs_in_set} jobs judged, so this is not the full test)`}`, '');
    for (const check of mark.checks) out.push(`- ${check.pass ? 'PASS' : 'FAIL'}: ${check.text}`);
  } else {
    out.push('No target arm was named, so the pass mark was not checked. Run again with `--target <arm>`.');
  }
  out.push('', '## Overall', '', section(results.overall, target, 3));
  for (const [id, job] of Object.entries(results.jobs)) {
    const best = job.best_mean_total ?? [];
    const winner = !job.verdicts ? '' : best.length === 1 ? ` Best mean total: ${best[0]}.` : ` Best mean total: tie between ${best.join(' and ')}.`;
    out.push('', `## Job ${id}: ${job.title}`, '', `${job.verdicts} verdicts from judges ${job.judges.join(', ') || 'none'}.${winner}`, '', section(job, target, 3));
  }
  out.push('', '## Bad verdicts (left out)', '');
  if (results.bad_verdicts.length) for (const item of results.bad_verdicts) out.push(`- \`${item.file}\`: ${item.errors.join('; ')}`);
  else out.push('None.');
  out.push('', '## Warnings (verdict still counted)', '');
  if (results.warnings.length) for (const item of results.warnings) out.push(`- \`${item.file}\`: ${item.warnings.join('; ')}`);
  else out.push('None.');
  out.push('');
  return out.join('\n');
}

if (isMain(import.meta.url)) {
  const { values } = parseArgs({ options: {
    run: { type: 'string' },
    target: { type: 'string' },
    seed: { type: 'string', default: '8' },
    resamples: { type: 'string', default: '2000' },
    jobs: { type: 'string', default: DEFAULT_JOBS },
  } });
  if (!values.run) { console.error('Usage: node tools/evals/blind/tally.mjs --run <dir> --target <arm> [--seed 8] [--resamples 2000] [--jobs <file>]'); process.exit(2); }
  try {
    const { run, results, markdown } = tally({ runDir: values.run, target: values.target ?? null, seed: Number(values.seed), resamples: Number(values.resamples), jobsFile: values.jobs });
    fs.writeFileSync(path.join(run, 'RESULTS.md'), markdown);
    writeJson(path.join(run, 'results.json'), results);
    console.log(`${results.counts.verdicts_counted} verdicts counted, ${results.counts.verdicts_left_out} left out as bad.`);
    for (const item of results.bad_verdicts) console.log(`Bad: ${item.file}: ${item.errors.join('; ')}`);
    if (results.pass_mark) {
      console.log(`Pass mark for ${results.target}: ${results.pass_mark.pass ? 'PASS' : 'FAIL'}${results.pass_mark.full_set ? '' : ` (only ${results.pass_mark.jobs_judged} of ${PASS_MARK.jobs_in_set} jobs judged)`}`);
      for (const check of results.pass_mark.checks) console.log(`  ${check.pass ? 'PASS' : 'FAIL'}: ${check.text}`);
    } else {
      console.log('No --target given, so the pass mark was not checked.');
    }
    console.log(`Wrote ${toPosix(path.join(run, 'RESULTS.md'))} and results.json`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
