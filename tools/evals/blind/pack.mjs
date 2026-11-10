#!/usr/bin/env node
// Make blinded packets for judges.
//
//   node tools/evals/blind/pack.mjs --run <dir> [--names "Name One,Name Two"] [--jobs <file>] [--force]
//
// Reads   <run>/<job>/<arm>/...            what each arm delivered
// Writes  <run>/packets/<job>/<CODE>/...   the same files under a random letter code
//         <run>/key/key.json               which arm is behind each code (never printed)
//         <run>/tells.json                 anything that could give an arm away, for the lead to decide
//
// Deliverables are copied byte for byte. Nothing is edited or removed.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { DEFAULT_JOBS, RESERVED, isMain, loadJobs, subDirs, toPosix, writeJson } from './lib.mjs';

// No A to D or F (they read as grades) and no I or O (they read as digits).
export const CODE_LETTERS = 'EGHJKLMNPQRSTUVWXYZ';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'];
const MAIN_FILES = ['deliverable.md', 'deliverable.html'];
const FOLDER_EXTENSIONS = ['.md', '.html', '.htm', '.css', '.txt', '.csv', '.pdf', ...IMAGE_EXTENSIONS];
const TEXT_EXTENSIONS = ['.md', '.html', '.htm', '.css', '.txt', '.csv', '.svg'];
const MIN_ARM_NAME = 3;

/** `count` different random codes, as short as the count allows. */
export function randomCodes(count, randomInt = crypto.randomInt) {
  let length = 1;
  while (CODE_LETTERS.length ** length < count) length += 1;
  const codes = new Set();
  while (codes.size < count) {
    let code = '';
    for (let i = 0; i < length; i += 1) code += CODE_LETTERS[randomInt(CODE_LETTERS.length)];
    codes.add(code);
  }
  return [...codes];
}

const extensionOf = name => path.extname(name).toLowerCase();
const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

/** Which files in an arm's folder go to the judge, and which stay behind. Paths use forward slashes. */
export function listDeliverableFiles(armDir) {
  const files = [];
  const skipped = [];
  const walkFolder = (dir, prefix) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort(byName)) {
      const relative = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walkFolder(path.join(dir, entry.name), relative);
      else if (entry.isFile() && !entry.name.startsWith('.') && FOLDER_EXTENSIONS.includes(extensionOf(entry.name))) files.push(relative);
      else skipped.push(relative);
    }
  };
  for (const entry of fs.readdirSync(armDir, { withFileTypes: true }).sort(byName)) {
    const lower = entry.name.toLowerCase();
    if (entry.isDirectory()) {
      if (lower === 'deliverable') walkFolder(path.join(armDir, entry.name), entry.name);
      else skipped.push(`${entry.name}/`);
    } else if (entry.isFile() && (MAIN_FILES.includes(lower) || IMAGE_EXTENSIONS.includes(extensionOf(lower)))) {
      files.push(entry.name);
    } else {
      skipped.push(entry.name);
    }
  }
  return { files, skipped };
}

const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A pattern for a name that still matches when its words are joined by spaces, hyphens or underscores. */
function phrasePattern(phrase) {
  const words = phrase.trim().split(/[\s_-]+/).filter(Boolean).map(escapeRegex);
  if (!words.length) return null;
  return new RegExp(`(?<![A-Za-z0-9])${words.join('[\\s_-]*')}(?![A-Za-z0-9])`, 'i');
}

/** Everything the tell scan looks for. */
export function tellTerms({ arms = [], names = [] } = {}) {
  const terms = [];
  const add = (kind, term, pattern = phrasePattern(term)) => { if (pattern) terms.push({ kind, term, pattern }); };
  // A one or two letter arm name would match all over normal prose, so those are not scanned for.
  for (const arm of arms.filter(name => name.length >= MIN_ARM_NAME)) add('arm name', arm);
  for (const note of ['DECISIONS.md', 'notes.md', 'knowledge.md']) add('working note', note, new RegExp(`(?<![A-Za-z0-9])${escapeRegex(note)}(?![A-Za-z0-9])`, 'i'));
  add('working note', 'WORK-METHOD');
  add('working note', 'toolbox');
  for (const name of names) add('persona name', name);
  add('AI Blocks', 'AI Blocks', /(?<![A-Za-z0-9])(?:use)?ai[\s_-]*(?:building[\s_-]*)?blocks(?![A-Za-z0-9])/i);
  return terms;
}

/** Find tells in a piece of text. One entry per term per line. */
export function scanText(text, terms) {
  const found = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const { kind, term, pattern } of terms) {
      const match = pattern.exec(line);
      if (!match) continue;
      const start = Math.max(0, match.index - 60);
      const excerpt = line.slice(start, match.index + match[0].length + 60).trim();
      found.push({ line: index + 1, kind, term, excerpt });
    }
  });
  return found;
}

function splitNames(value) {
  return (Array.isArray(value) ? value : [value ?? ''])
    .flatMap(item => String(item).split(','))
    .map(item => item.trim())
    .filter(Boolean);
}

/**
 * Pack a run. Returns a summary that is safe to print: it never pairs an arm with a code.
 * Throws, before writing anything, if the run folder is not ready.
 */
export function pack({ runDir, jobsFile = DEFAULT_JOBS, names = [], force = false, randomInt = crypto.randomInt }) {
  const run = path.resolve(runDir);
  if (!fs.existsSync(run)) throw new Error(`Run folder not found: ${run}`);
  const jobs = loadJobs(jobsFile);
  const jobIds = jobs.map(job => job.id);
  const present = subDirs(run);
  const found = jobs.filter(job => present.includes(job.id));
  const ignored = present.filter(name => !jobIds.includes(name) && !RESERVED.includes(name));
  if (!found.length) throw new Error(`No job folders in ${run}. Expected folders named ${jobIds.join(', ')}, each holding one folder per arm.`);

  const packetsDir = path.join(run, 'packets');
  const keyDir = path.join(run, 'key');
  const verdictsDir = path.join(run, 'verdicts');
  const hasVerdicts = fs.existsSync(verdictsDir) && fs.readdirSync(verdictsDir, { recursive: true }).some(name => /verdict-.*\.json$/i.test(String(name)));
  if (hasVerdicts) throw new Error(`${toPosix(verdictsDir)} already holds verdicts. Packing again makes new codes, so those verdicts would be read against the wrong arms. Move or delete them first.`);
  if ((fs.existsSync(packetsDir) || fs.existsSync(keyDir)) && !force) throw new Error('This run is already packed. Packing again makes new codes. Pass --force to do it anyway.');

  // Read everything first, so a problem stops the run before any file is written.
  const problems = [];
  const warnings = [];
  const skipped = [];
  const plan = [];
  for (const job of found) {
    const arms = subDirs(path.join(run, job.id));
    if (arms.length < 2) problems.push(`${job.id}: needs at least 2 arms, found ${arms.length}`);
    const armFiles = [];
    for (const arm of arms) {
      const listing = listDeliverableFiles(path.join(run, job.id, arm));
      if (!listing.files.length) problems.push(`${job.id}/${arm}: no deliverable files (deliverable.md, deliverable.html, images, or a deliverable/ folder)`);
      else if (job.deliverable && !listing.files.some(file => file.toLowerCase() === job.deliverable || file.toLowerCase() === `deliverable/${job.deliverable}`)) warnings.push(`${job.id}/${arm}: no ${job.deliverable}, which this job asks for`);
      for (const file of listing.skipped) skipped.push({ job: job.id, arm, file });
      armFiles.push({ arm, files: listing.files });
    }
    plan.push({ job, armFiles });
  }
  if (problems.length) throw new Error(`Cannot pack:\n- ${problems.join('\n- ')}`);

  const allArms = [...new Set(plan.flatMap(item => item.armFiles.map(entry => entry.arm)))].sort();
  const personaNames = splitNames(names);
  const terms = tellTerms({ arms: allArms, names: personaNames });

  fs.rmSync(packetsDir, { recursive: true, force: true });
  fs.rmSync(keyDir, { recursive: true, force: true });
  fs.rmSync(path.join(run, 'prompts'), { recursive: true, force: true });

  const key = {};
  const tells = [];
  const summary = [];
  for (const { job, armFiles } of plan) {
    const codes = randomCodes(armFiles.length, randomInt);
    key[job.id] = {};
    let fileCount = 0;
    let tellCount = 0;
    armFiles.forEach(({ arm, files }, index) => {
      const code = codes[index];
      key[job.id][code] = arm;
      for (const file of files) {
        const source = path.join(run, job.id, arm, file);
        const target = path.join(packetsDir, job.id, code, file);
        const bytes = fs.readFileSync(source);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, bytes); // a fresh write, so the copy does not carry the original's timestamp
        fileCount += 1;
        const hits = scanText(file, terms).map(hit => ({ ...hit, line: null, where: 'file name' }));
        if (TEXT_EXTENSIONS.includes(extensionOf(file))) hits.push(...scanText(bytes.toString('utf8'), terms).map(hit => ({ ...hit, where: 'text' })));
        for (const hit of hits) tells.push({ job: job.id, arm, file, where: hit.where, line: hit.line, kind: hit.kind, term: hit.term, excerpt: hit.excerpt });
        tellCount += hits.length;
      }
    });
    // Sort the key by code so its order says nothing about the arms.
    key[job.id] = Object.fromEntries(Object.entries(key[job.id]).sort(([a], [b]) => a.localeCompare(b)));
    summary.push({ job: job.id, arms: armFiles.length, files: fileCount, tells: tellCount });
  }

  writeJson(path.join(keyDir, 'key.json'), {
    note: 'Which arm is behind each code. Keep this away from judges, and do not open it until every verdict is in.',
    jobs: key,
  });
  writeJson(path.join(run, 'tells.json'), {
    note: 'Things in the deliverables that could tell a judge which arm made them. Nothing was changed. The lead decides what to do: fix the source and pack again, or accept it.',
    looked_for: { arm_names: allArms.filter(name => name.length >= MIN_ARM_NAME), arm_names_too_short_to_scan: allArms.filter(name => name.length < MIN_ARM_NAME), persona_names: personaNames, working_notes: ['DECISIONS.md', 'notes.md', 'knowledge.md', 'WORK-METHOD', 'toolbox'], brand: ['AI Blocks'] },
    count: tells.length,
    tells,
    left_out_of_packets: skipped,
  });

  return { run, jobs: summary, tells: tells.length, skipped: skipped.length, warnings, ignored };
}

if (isMain(import.meta.url)) {
  const { values } = parseArgs({ options: {
    run: { type: 'string' },
    jobs: { type: 'string', default: DEFAULT_JOBS },
    names: { type: 'string', multiple: true, default: [] },
    force: { type: 'boolean', default: false },
  } });
  if (!values.run) { console.error('Usage: node tools/evals/blind/pack.mjs --run <dir> [--names "Name One,Name Two"] [--jobs <file>] [--force]'); process.exit(2); }
  try {
    const result = pack({ runDir: values.run, jobsFile: values.jobs, names: values.names, force: values.force });
    for (const job of result.jobs) console.log(`${job.job}: ${job.arms} arms packed, ${job.files} files, ${job.tells} possible tells`);
    for (const warning of result.warnings) console.log(`Note: ${warning}`);
    if (result.ignored.length) console.log(`Ignored folders that are not jobs: ${result.ignored.join(', ')}`);
    console.log(`Packets: ${toPosix(path.join(result.run, 'packets'))}`);
    console.log(`Key: ${toPosix(path.join(result.run, 'key', 'key.json'))} (keep it closed until the tally)`);
    console.log(`Possible tells: ${result.tells}. Files left out of packets: ${result.skipped}. See ${toPosix(path.join(result.run, 'tells.json'))}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
