#!/usr/bin/env node
// qe-check: every applicable Quality Engine text check in one command, with one short report.
// Plain Node 18+, no packages. Runs the scripts beside it: wordcount, readability, leakcheck, proof, check-format,
// and, when their inputs exist, numbers (the numbers ledger), trace-check (the working trace) and, with --plain,
// the hand-over check (tools/check-handover.mjs: leaks, homework and length against the plain answer).
// Usage: node qe-check.cjs <final> [--plain <plain>] [--audience consumer|business|specialist]
//          [--sources <file|dir> ...] [--contract <contract.json> | --max-words <n>] [--limit <n> [--fail-above <pct>]]
//          [--brief <brief>] [--profile <family>] [--context <dir>] [--require <check,check>] [--json]
//          [--online] [--requested-template] [--options-requested] [--customer-copy] [--requested-more] [--one-page]
// Proof runs offline unless --online is given. --max-words writes a one-rule contract for check-format.
// --limit is the owner's word limit, counted raw the way the owner counts (every word, tables included). Only going
// over it fails (--fail-above 95 tightens the fail line when the owner asked for that). There is no target share.
// --brief and --profile pass to leakcheck, which then checks dates, figures, a bolder move in a copy job and
// describe-not-write lines against the brief.
// --context is the working folder (default: context). When <context>/numbers.json exists, numbers.cjs checks it
// against the final; when <context>/trace.md exists, trace-check.cjs checks it (with <context>/spec.md if present).
// If either script is not in this pack, that check is skipped with a note. WARN rows never fail the run.
// Required checks: each family in profiles.json names the checks its work cannot skip (buyer-facing work: leakcheck,
// proof, numbers and format). The family comes from --profile, else from the job under way (<context>/job.json).
// --require adds more by name. A required check that did not run FAILS: skipping the ledger or the contract is
// never an easier pass than writing one. Names: wordcount, readability, limit, leakcheck, numbers, trace, proof,
// format, handover.
// --json prints the report as one JSON object (same exit codes). Each run adds one line to <context>/job-log.jsonl
// when that folder exists (tools/log-event.mjs: names, statuses and hashes only, never the text).
// Exit 0 = no check failed, 1 = at least one failed, 2 = usage error. Readability stays advisory unless --strict
// (or required).
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

const VERSION = '1.1.0';
const CHECKS = ['wordcount', 'readability', 'limit', 'leakcheck', 'numbers', 'trace', 'proof', 'format', 'handover'];
// What to do when a required check could not run.
const HOW = {
  limit: 'give --limit <n>, the owner\'s word limit',
  numbers: 'write the numbers ledger <context>/numbers.json ([] when the work quotes no figures) and run again',
  trace: 'write the working trace <context>/trace.md and run again',
  format: 'give --contract <contract.json> or --max-words <n> taken from the brief',
  handover: 'give --plain <plain answer> so the hand-over check can run',
};
const argv = process.argv.slice(2);
const opt = { sources: [], audience: 'business', context: 'context', online: false, template: false, options: false, customerCopy: false, strict: false, require: [], json: false, requestedMore: false, onePage: false };
const AUDIENCES = ['consumer', 'business', 'specialist'];
const usage = 'Usage: node qe-check.cjs <final> [--plain <plain>] [--audience consumer|business|specialist] [--sources <files...>] [--contract <json> | --max-words <n>] [--limit <n> [--fail-above <pct>]] [--brief <brief>] [--profile <family>] [--context <dir>] [--require <check,check>] [--json] [--online] [--requested-template] [--options-requested] [--customer-copy] [--requested-more] [--one-page] [--strict]';
const bad = message => { console.error(message + '\n' + usage); process.exit(2); };
let file = null;
const FLAGS = ['--online', '--requested-template', '--options-requested', '--customer-copy', '--strict', '--json', '--requested-more', '--one-page'];
for (let i = 0; i < argv.length; i++) {
  // Both "--audience consumer" and "--audience=consumer".
  let a = argv[i], inline;
  const eq = a.startsWith('--') ? a.indexOf('=') : -1;
  if (eq > 2) { inline = a.slice(eq + 1); a = a.slice(0, eq); }
  const value = () => {
    if (inline !== undefined) { if (!inline) bad(a + ' needs a value'); return inline; }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) bad(a + ' needs a value');
    i++; return next;
  };
  if (a === '--plain') opt.plain = value();
  else if (a === '--audience') opt.audience = value();
  else if (a === '--sources') { if (inline !== undefined) opt.sources.push(value()); while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opt.sources.push(argv[++i]); }
  else if (a === '--contract') opt.contract = value();
  else if (a === '--max-words') opt.maxWords = Number(value());
  else if (a === '--limit') opt.limit = Number(value());
  else if (a === '--fail-above') opt.failAbove = Number(value());
  else if (a === '--brief') opt.brief = value();
  else if (a === '--profile') opt.profile = value();
  else if (a === '--context') opt.context = value();
  else if (a === '--require') opt.require.push(...value().split(',').map(s => s.trim()).filter(Boolean));
  else if (inline !== undefined && FLAGS.includes(a)) bad(a + ' takes no value');
  else if (a === '--online') opt.online = true;
  else if (a === '--requested-template') opt.template = true;
  else if (a === '--options-requested') opt.options = true;
  else if (a === '--customer-copy') opt.customerCopy = true;
  else if (a === '--strict') opt.strict = true;
  else if (a === '--json') opt.json = true;
  else if (a === '--requested-more') opt.requestedMore = true;
  else if (a === '--one-page') opt.onePage = true;
  else if (!a.startsWith('--') && !file) file = a;
  else bad('Unknown option ' + a);
}
// Usage errors are found here, before any check runs, so they exit 2 and never read as a failed check.
if (!file || !fs.existsSync(file)) bad(file ? 'Cannot read ' + file : 'Name the final file to check.');
if (opt.plain && !fs.existsSync(opt.plain)) bad('Cannot read ' + opt.plain);
if (!AUDIENCES.includes(opt.audience)) bad('--audience must be one of ' + AUDIENCES.join(', '));
if (opt.contract && !fs.existsSync(opt.contract)) bad('Cannot read the contract ' + opt.contract);
for (const source of opt.sources) if (!fs.existsSync(source)) bad('Cannot read the source ' + source);
if (opt.maxWords !== undefined && !(Number.isInteger(opt.maxWords) && opt.maxWords > 0)) bad('--max-words needs a positive whole number');
if (opt.limit !== undefined && !(Number.isInteger(opt.limit) && opt.limit > 0)) bad('--limit needs a positive whole number');
if (opt.failAbove !== undefined && !(opt.failAbove > 0)) bad('--fail-above needs a positive number');
if (opt.failAbove !== undefined && opt.limit === undefined) bad('--fail-above needs --limit');
if (opt.brief && !fs.existsSync(opt.brief)) bad('Cannot read the brief ' + opt.brief);
for (const name of opt.require) if (!CHECKS.includes(name)) bad('--require names an unknown check "' + name + '". Checks: ' + CHECKS.join(', '));
let profiles = null;
try { profiles = JSON.parse(fs.readFileSync(path.join(__dirname, 'profiles.json'), 'utf8')); } catch { /* no profiles beside this script: the name is passed on as given */ }
if (opt.profile && profiles && !Object.hasOwn(profiles, opt.profile)) bad('Unknown quality family profile ' + opt.profile);

// The family whose required checks apply: --profile, else the kind of the job under way.
let family = opt.profile ?? null, familyFrom = family ? '--profile' : null;
if (!family) {
  try {
    const job = JSON.parse(fs.readFileSync(path.join(opt.context, 'job.json'), 'utf8'));
    if (job && typeof job.kind === 'string' && (!profiles || Object.hasOwn(profiles, job.kind))) { family = job.kind; familyFrom = path.join(opt.context, 'job.json'); }
  } catch { /* no job under way */ }
}
const familyRequired = family && profiles && Array.isArray(profiles[family]?.required) ? profiles[family].required.filter(n => CHECKS.includes(n)) : [];
const required = [...new Set([...familyRequired, ...opt.require])];

const here = __dirname, rows = [];
// soft: a check another tool owns (numbers, trace-check, check-handover). If its script is missing or refuses its
// arguments, the row says so and the run goes on; it never turns into a qe-check usage error.
const run = (name, script, args, { advisory = false, soft = false } = {}) => {
  const target = path.join(here, script);
  if (!fs.existsSync(target)) { rows.push({ name, status: 'NOT_RUN', detail: path.basename(script) + (soft ? ' is not in this pack, so this check was skipped' : ' is not beside qe-check.cjs') }); return; }
  const r = spawnSync(process.execPath, [target, ...args], { encoding: 'utf8', timeout: 120000 });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split(/\r?\n/).filter(Boolean);
  // A passing script that printed a WARN line is a warning: shown in the report, never a failure.
  const warned = r.status === 0 && out.some(l => /^\s*WARN\b/.test(l));
  const strict = opt.strict || required.includes(name);
  const status = r.status === 0 ? (warned ? 'WARN' : 'PASS') : r.status === 2 ? (soft ? 'NOT_RUN' : 'ERROR') : advisory && !strict ? 'ADVISORY' : 'FAIL';
  // Keep the report short: the lines that say what failed or warned, else the summary line.
  const worded = out.filter(l => /[A-Za-z]{3}/.test(l));
  const keep = status === 'PASS' ? worded.slice(-1) : worded.slice(0, 8);
  rows.push({ name, status, detail: keep.join('\n    ') });
};

run('wordcount', 'wordcount.cjs', [file, ...(opt.plain ? [opt.plain] : [])]);
run('readability', 'readability.cjs', [file, '--audience', opt.audience], { advisory: true });
if (opt.limit) run('limit', 'wordcount.cjs', [file, '--raw', '--limit', String(opt.limit), ...(opt.failAbove ? ['--fail-above', String(opt.failAbove)] : [])]);
else if (required.includes('limit')) rows.push({ name: 'limit', status: 'NOT_RUN', detail: 'no --limit' });
const ledger = path.join(opt.context, 'numbers.json'), trace = path.join(opt.context, 'trace.md'), spec = path.join(opt.context, 'spec.md');
run('leakcheck', 'leakcheck.cjs', [file, ...(opt.template ? ['--requested-template'] : []), ...(opt.options ? ['--options-requested'] : []), ...(opt.customerCopy ? ['--customer-copy'] : []),
  ...(opt.brief ? ['--brief', opt.brief] : []), ...(opt.brief && fs.existsSync(ledger) ? ['--numbers', ledger] : []), ...(opt.profile ? ['--profile', opt.profile] : [])]);
if (fs.existsSync(ledger)) run('numbers', 'numbers.cjs', [ledger, '--final', file, ...(opt.brief ? ['--brief', opt.brief] : [])], { soft: true });
else rows.push({ name: 'numbers', status: 'NOT_RUN', detail: `no ${ledger}` });
const packRoot = path.resolve(here, '..', '..');
if (fs.existsSync(trace)) run('trace', 'trace-check.cjs', [trace, ...(fs.existsSync(spec) ? ['--spec', spec] : []), ...(fs.existsSync(path.join(packRoot, 'pack.json')) ? ['--pack', packRoot] : []), '--final', file], { soft: true });
else rows.push({ name: 'trace', status: 'NOT_RUN', detail: `no ${trace}` });
run('proof', 'proof.cjs', [file, ...(opt.sources.length ? ['--sources', ...opt.sources] : []), ...(opt.online ? [] : ['--offline'])]);
let contract = opt.contract, temp = null;
if (!contract && opt.maxWords) { temp = path.join(os.tmpdir(), `qe-contract-${process.pid}.json`); fs.writeFileSync(temp, JSON.stringify({ max_words: opt.maxWords })); contract = temp; }
if (contract) run('format', 'check-format.cjs', [file, '--contract', contract]);
else rows.push({ name: 'format', status: 'NOT_RUN', detail: 'no --contract or --max-words from the brief' });
if (temp) fs.rmSync(temp, { force: true });
// The hand-over check (one entry point for every text gate): it needs the plain answer for its length test.
if (opt.plain) run('handover', path.join('..', 'check-handover.mjs'), [file, opt.plain, ...(opt.profile ? ['--profile', opt.profile] : []),
  ...(opt.brief ? ['--brief', opt.brief, ...(fs.existsSync(ledger) ? ['--numbers', ledger] : [])] : []),
  ...(opt.template ? ['--requested-template'] : []), ...(opt.options ? ['--options-requested'] : []), ...(opt.requestedMore ? ['--requested-more'] : []), ...(opt.onePage ? ['--one-page'] : [])], { soft: true });
else if (required.includes('handover')) rows.push({ name: 'handover', status: 'NOT_RUN', detail: 'no --plain answer' });

// A required check that did not run is a failure, never a quiet pass.
const why = familyRequired.length ? `required for ${family}${familyFrom === '--profile' ? '' : ` (the job in ${familyFrom})`}` : 'required';
for (const r of rows) {
  r.required = required.includes(r.name);
  if (r.required && r.status === 'NOT_RUN') {
    r.status = 'FAIL';
    r.not_run = true;
    r.detail = `${opt.require.includes(r.name) && !familyRequired.includes(r.name) ? 'required by --require' : why}, but not run: ${r.detail}.${HOW[r.name] ? ` To run it, ${HOW[r.name]}.` : ''}`;
  }
}

// A check script that refused its arguments is a usage error (exit 2), not a failed check.
const errored = rows.filter(r => r.status === 'ERROR');
const failed = rows.filter(r => r.status === 'FAIL');
const code = errored.length ? 2 : failed.length ? 1 : 0;
const result = errored.length ? 'ERROR' : failed.length ? 'FAIL' : 'PASS';
const summary = errored.length ? `qe-check: usage error in ${errored.map(r => r.name).join(', ')}. Fix the arguments and run again.`
  : failed.length ? `qe-check: ${failed.length} failed (${failed.map(r => r.name).join(', ')}). Fix them and run again.`
  : 'qe-check: no failures. Automated checks are diagnostics, not proof of clarity or truth.';
if (opt.json) console.log(JSON.stringify({ tool: 'qe-check', version: VERSION, file, family, family_from: familyFrom, required, rows, failed: failed.map(r => r.name), result, summary }, null, 1));
else {
  for (const r of rows) console.log(`${r.status.padEnd(8)} ${r.name}${r.required ? ' (required)' : ''}${r.detail ? '\n    ' + r.detail : ''}`);
  console.log(summary);
}

// One line in the job log (tools/log-event.mjs), when the pack has it; logging never changes the result.
const logger = path.join(here, '..', 'log-event.mjs');
const finish = () => { process.exitCode = code; };
if (fs.existsSync(logger)) {
  import(pathToFileURL(logger).href).then(m => m.logEvent({
    tool: 'qe-check', version: VERSION, cmd: 'check', args: argv, context: opt.context, result,
    inputs: [file, opt.plain, opt.brief, opt.contract, fs.existsSync(ledger) ? ledger : null, fs.existsSync(trace) ? trace : null],
    checks: rows.map(r => ({ name: r.name, status: r.status, required: r.required, detail: r.status === 'PASS' ? '' : r.detail })),
    counts: { failed: failed.length, required: required.length, ...(family ? { family } : {}) },
  })).catch(() => {}).finally(finish);
} else finish();
