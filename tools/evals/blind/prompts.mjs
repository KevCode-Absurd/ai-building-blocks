#!/usr/bin/env node
// Write one judge prompt per job, for however many arms were packed.
//
//   node tools/evals/blind/prompts.mjs --run <dir> [--jobs <file>]
//
// Reads   <run>/packets/<job>/<CODE>/...   (never the key)
// Writes  <run>/prompts/<job>-judge-prompt.txt
//
// Give the same prompt to every judge of a job, plus one line with its judge id:
// s01 to s10 for Sonnet judges, o01 to o04 for Opus judges.
// Each judge saves <run>/verdicts/<job>/verdict-<judge id>.json.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { CRITERIA, DEFAULT_JOBS, isMain, loadJobs, subDirs, toPosix } from './lib.mjs';

const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const PLACE_WORDS = ['best', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const IMAGE = /\.(png|jpe?g|webp|gif|svg|avif)$/i;
const HTML = /\.html?$/i;

function filesUnder(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .flatMap(entry => (entry.isDirectory()
      ? filesUnder(path.join(dir, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`]));
}

/**
 * The prompt text for one job.
 * `packets` is a list of { code, dir, files }, where `dir` is the code's folder and `files` are paths inside it.
 */
export function buildPrompt({ job, packets, runDir, verdictDir }) {
  const sorted = [...packets].sort((a, b) => a.code.localeCompare(b.code));
  const codes = sorted.map(packet => packet.code);
  const count = COUNT_WORDS[codes.length] ?? String(codes.length);
  const singleFiles = sorted.every(packet => packet.files.length === 1);
  const noun = singleFiles ? 'file' : 'deliverable';
  const anyHtml = sorted.some(packet => packet.files.some(file => HTML.test(file)));
  const anyImage = sorted.some(packet => packet.files.some(file => IMAGE.test(file)));

  const fileLines = sorted.map(({ code, dir, files }) => (files.length === 1
    ? `- ${code}: ${toPosix(path.join(dir, files[0]))}`
    : `- ${code}: every file in ${toPosix(dir)}/ (${files.join(', ')})`));

  const steps = [job.web_check];
  if (anyHtml) steps.push('For an HTML file: if you have a browser tool, render the file and look at it at desktop width (about 1280 pixels) and at phone width (about 390 pixels). If you have no browser tool, read the HTML.');
  if (anyImage) steps.push('Open and look at every image file.');
  steps.push(`Spot-check at least 5 factual claims in each ${noun}. Any invented fact, or a claim the business cannot back, is a serious defect.`);
  steps.push([
    `Score each ${noun} from 0 to 100 on this weighted rubric:`,
    ...job.rubric.map(row => `   - ${row.text} (${row.points})`),
    '   Each total must equal the sum of its five scores.',
  ].join('\n'));
  steps.push(`Rank the ${count}, best first, and list every code once. Call two a tie only if they are within 2 points, and say so in "reasons".`);
  steps.push('Say which one you would send to the client unchanged, if any.');

  const zeroScore = Object.fromEntries([...CRITERIA.map(criterion => [criterion.key, 0]), ['total', 0]]);
  const shape = {
    job: job.id,
    judge: '<id>',
    scores: Object.fromEntries(codes.map(code => [code, zeroScore])),
    ranking: codes.map((_, index) => PLACE_WORDS[index] ?? `place ${index + 1}`),
    send_unchanged: [...codes, 'none'].join('|'),
    invented_facts: Object.fromEntries(codes.map(code => [code, []])),
    reasons: '3-5 sentences on what separated them',
    biggest_flaw: Object.fromEntries(codes.map(code => [code, ''])),
    best_thing: Object.fromEntries(codes.map(code => [code, ''])),
  };

  return [
    `You are a blind judge comparing ${count} deliverables made for the same client brief. You do not know who made them and must not try to find out. Judge only what is in the ${count} ${noun}s and what you can verify on the live web. Judge as ${job.judge_role} who is the client's trusted adviser.`,
    '',
    `Brief (job ${job.id}): "${job.brief}"`,
    '',
    'Files:',
    ...fileLines,
    `Read nothing else in ${toPosix(runDir)}: no other folders, notes, keys or other judges' verdicts.`,
    '',
    'How to judge:',
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    `Write your verdict as JSON to ${toPosix(path.join(verdictDir, 'verdict-<YOUR JUDGE ID>.json'))} in this shape:`,
    JSON.stringify(shape),
    'Then reply with the same JSON and nothing else.',
    '',
  ].join('\n');
}

/** Write a prompt for every packed job. Returns what was written. */
export function writePrompts({ runDir, jobsFile = DEFAULT_JOBS }) {
  const run = path.resolve(runDir);
  const packetsDir = path.join(run, 'packets');
  const packed = subDirs(packetsDir);
  if (!packed.length) throw new Error(`No packets in ${toPosix(packetsDir)}. Run pack.mjs first.`);
  const jobs = loadJobs(jobsFile);
  const written = [];
  for (const id of packed) {
    const job = jobs.find(item => item.id === id);
    if (!job) throw new Error(`Packets hold job ${id}, but the jobs file has no job with that id.`);
    const packets = subDirs(path.join(packetsDir, id)).map(code => {
      const dir = path.join(packetsDir, id, code);
      return { code, dir, files: filesUnder(dir) };
    });
    const verdictDir = path.join(run, 'verdicts', id);
    fs.mkdirSync(verdictDir, { recursive: true });
    const file = path.join(run, 'prompts', `${id}-judge-prompt.txt`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buildPrompt({ job, packets, runDir: run, verdictDir }));
    written.push({ job: id, arms: packets.length, file });
  }
  return written;
}

if (isMain(import.meta.url)) {
  const { values } = parseArgs({ options: { run: { type: 'string' }, jobs: { type: 'string', default: DEFAULT_JOBS } } });
  if (!values.run) { console.error('Usage: node tools/evals/blind/prompts.mjs --run <dir> [--jobs <file>]'); process.exit(2); }
  try {
    for (const item of writePrompts({ runDir: values.run, jobsFile: values.jobs })) console.log(`${item.job}: ${item.arms}-way prompt at ${toPosix(item.file)}`);
    console.log('Give each judge its prompt plus one line: "Your judge id is s01." (s01 to s10 for Sonnet, o01 to o04 for Opus).');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
