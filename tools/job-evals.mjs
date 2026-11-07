#!/usr/bin/env node
// No paid model calls. `check` tests harness readiness; `score` requires real host recordings.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { CASES, JOB_EVAL_VERSION } from '../site/src/jobs/evals/cases.mjs';
import { REAL_RECORDING, replayRecording, runControls, summarize, validateCaseSet } from '../site/src/jobs/evals/score.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [command = 'check', ...args] = process.argv.slice(2);
const option = name => { const index = args.indexOf(`--${name}`); return index < 0 ? undefined : args[index + 1]; };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const fixtures = () => read(path.join(root, 'site/test/fixtures/jobs/contracts.json'));
const print = value => console.log(JSON.stringify(value, null, 2));
const fail = error => { print({ status: 'FAIL', errors: [String(error?.message ?? error)], model_calls: 0 }); process.exitCode = 1; };

function localCatalogue() {
  const data = path.join(root, 'site/public/data');
  const required = ['blocks.json', 'public-api-manifest.json', 'roles-index.json', 'approach-index.json'];
  if (required.some(file => !fs.existsSync(path.join(data, file)))) throw new Error('Build the local site indexes, or include the pinned catalogue snapshot in the recording.');
  const roles = read(path.join(data, 'roles-index.json'));
  roles.profiles = Object.fromEntries(roles.roles.map(role => [role.id, read(path.join(data, 'roles', `${role.id}.json`))]));
  return { items: read(path.join(data, 'blocks.json')).blocks, manifest: read(path.join(data, 'public-api-manifest.json')), roles, approaches: read(path.join(data, 'approach-index.json')), personas: fs.existsSync(path.join(data, 'team-org-chart.json')) ? read(path.join(data, 'team-org-chart.json')).personas : [] };
}

function transcriptCheck(run, runFile) {
  if (run.provenance !== REAL_RECORDING) return;
  const ref = run.transcript_ref;
  if (typeof ref !== 'string' || path.isAbsolute(ref) || /[\\\0]|(?:^|\/)\.{1,2}(?:\/|$)/.test(ref) || !/\.(?:md|json|jsonl|txt)$/.test(ref)) throw new Error('Use a local relative transcript_ref within the recording folder.');
  const base = path.dirname(runFile), target = path.resolve(base, ref);
  if (!target.startsWith(`${base}${path.sep}`)) throw new Error('Transcript must stay inside the recording folder.');
  const stat = fs.statSync(target);
  if (!stat.isFile() || stat.size > 50 * 1024 * 1024) throw new Error('Transcript must be a local file under 50 MB.');
  const hash = createHash('sha256').update(fs.readFileSync(target)).digest('hex');
  if (hash !== run.transcript_sha256) throw new Error('Transcript SHA-256 does not match the saved recording.');
}

async function checkedRun(c, runFile) {
  if (!fs.existsSync(runFile)) return replayRecording(c, null);
  let run;
  try {
    run = read(runFile); transcriptCheck(run, runFile);
    return await replayRecording(c, run, run.catalogue ? {} : localCatalogue());
  } catch (error) { return { id: c.id, status: 'FAIL', provenance: run?.provenance ?? null, score: 0, checks: {}, errors: [String(error.message)], model_calls: 0 }; }
}

try {
  if (command === 'prompt') {
    const c = CASES.find(c => c.id === args[0]);
    if (!c) throw new Error(`Choose a case: ${CASES.map(c => c.id).join(', ')}`);
    console.log(`# Host recording: ${c.id}\n\nRequest: ${c.request}\n\n${c.recording_brief}\n\nUse the user's connected Codex subscription and a parallel profile. Do not call external model APIs or spend provider credits. Record the actual Codex model and host; do not label the run as Opus or Claude. Call start_job with the exact request, then follow every next_action through delivery and feedback. Save the actual ordered advance_job inputs as events. Preserve each document unchanged; retain the catalogue revisions used. Record task-lead and coordinator checks. Never invent a tool call, source or fresh context.\n\nSave {case:"${c.id}",method_version:${JOB_EVAL_VERSION},provenance:"${REAL_RECORDING}",host:"<app, model, effort and profile>",recorded:"<ISO date>",transcript_ref:"transcripts/${c.id}.jsonl",transcript_sha256:"<actual transcript hash>",initial_input:{request:<exact request>,host_capabilities:<actual capabilities>},catalogue:<pinned snapshot>,events:[{event,schema,document}...]}. The transcript must be in the same recording folder or a child folder. A hand-authored fixture must use SYNTHETIC_STRUCTURAL_FIXTURE provenance and cannot pass the real-run gate.\n\nCheck with node tools/job-evals.mjs check <recording.json>. Keep private data out of public artifacts. This harness validates structure; blind quality judging is a separate step.`);
  } else if (command === 'check' && args[0] && !args[0].startsWith('--')) {
    const file = path.resolve(args[0]), run = read(file), c = CASES.find(c => c.id === run.case);
    if (!c) throw new Error('The recording names an unknown case.');
    const result = await checkedRun(c, file); print(result);
    if (!['PASS', 'SYNTHETIC_ONLY'].includes(result.status)) process.exitCode = 1;
  } else if (command === 'check' || command === 'score') {
    const cases = validateCaseSet(), controls = await runControls(fixtures());
    if (command === 'check') {
      const status = cases.status === 'PASS' && controls.every(row => row.status === 'PASS') ? 'PASS' : 'FAIL';
      print({ status, scope: 'DETERMINISTIC_HARNESS_READINESS', cases: { count: CASES.length, ...cases }, controls, real_host_recordings: 'NOT_RUN', bakeoff_v2: 'NOT_RUN', model_calls: 0 });
      if (status !== 'PASS') process.exitCode = 1;
    } else {
      const directory = path.resolve(option('recorded') ?? path.join(root, 'site/src/jobs/evals/recorded'));
      const results = [];
      for (const c of CASES) results.push(await checkedRun(c, path.join(directory, `${c.id}.json`)));
      const report = summarize(results, controls);
      if (cases.status !== 'PASS') { report.status = 'FAIL'; report.errors = cases.errors; }
      if (args.includes('--write')) {
        const output = path.join(root, 'site/src/jobs/evals/scorecard.json');
        fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
      }
      print(report);
      if (report.status !== 'PASS') process.exitCode = report.status === 'NOT_RUN' ? 2 : 1;
    }
  } else throw new Error('Use check [recording.json], score [--recorded folder] [--write], or prompt <case-id>.');
} catch (error) { fail(error); }
