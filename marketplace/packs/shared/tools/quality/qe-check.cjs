#!/usr/bin/env node
// qe-check: every applicable Quality Engine text check in one command, with one short report.
// Plain Node 18+, no packages. Runs the scripts beside it: wordcount, readability, leakcheck, proof, check-format,
// and, when their inputs exist, numbers (the numbers ledger) and trace-check (the working trace).
// Usage: node qe-check.cjs <final> [--plain <plain>] [--audience consumer|business|specialist]
//          [--sources <file|dir> ...] [--contract <contract.json> | --max-words <n>] [--limit <n> [--fail-above <pct>]]
//          [--brief <brief>] [--profile <family>] [--context <dir>]
//          [--online] [--requested-template] [--options-requested] [--customer-copy]
// Proof runs offline unless --online is given. --max-words writes a one-rule contract for check-format.
// --limit is the owner's word limit, counted raw the way the owner counts (every word, tables included). Only going
// over it fails (--fail-above 95 tightens the fail line when the owner asked for that). There is no target share.
// --brief and --profile pass to leakcheck, which then checks dates, figures, a bolder move in a copy job and
// describe-not-write lines against the brief.
// --context is the working folder (default: context). When <context>/numbers.json exists, numbers.cjs checks it
// against the final; when <context>/trace.md exists, trace-check.cjs checks it (with <context>/spec.md if present).
// If either script is not in this pack, that check is skipped with a note. WARN rows never fail the run.
// Exit 0 = no check failed, 1 = at least one failed, 2 = usage error. Readability stays advisory unless --strict.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');

const argv = process.argv.slice(2);
const opt = { sources: [], audience: 'business', context: 'context', online: false, template: false, options: false, customerCopy: false, strict: false };
const AUDIENCES = ['consumer', 'business', 'specialist'];
const usage = 'Usage: node qe-check.cjs <final> [--plain <plain>] [--audience consumer|business|specialist] [--sources <files...>] [--contract <json> | --max-words <n>] [--limit <n> [--fail-above <pct>]] [--brief <brief>] [--profile <family>] [--context <dir>] [--online] [--requested-template] [--options-requested] [--customer-copy] [--strict]';
const bad = message => { console.error(message + '\n' + usage); process.exit(2); };
let file = null;
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
  else if (inline !== undefined && ['--online', '--requested-template', '--options-requested', '--customer-copy', '--strict'].includes(a)) bad(a + ' takes no value');
  else if (a === '--online') opt.online = true;
  else if (a === '--requested-template') opt.template = true;
  else if (a === '--options-requested') opt.options = true;
  else if (a === '--customer-copy') opt.customerCopy = true;
  else if (a === '--strict') opt.strict = true;
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
if (opt.profile) {
  let profiles = null;
  try { profiles = JSON.parse(fs.readFileSync(path.join(__dirname, 'profiles.json'), 'utf8')); } catch { /* no profiles beside this script: the name is passed on as given */ }
  if (profiles && !Object.hasOwn(profiles, opt.profile)) bad('Unknown quality family profile ' + opt.profile);
}

const here = __dirname, rows = [];
// soft: a check another tool owns (numbers, trace-check). If its script is missing or refuses its arguments, the row
// says so and the run goes on; it never turns into a qe-check usage error.
const run = (name, script, args, { advisory = false, soft = false } = {}) => {
  const target = path.join(here, script);
  if (!fs.existsSync(target)) { rows.push({ name, status: 'NOT_RUN', detail: script + (soft ? ' is not in this pack, so this check was skipped' : ' is not beside qe-check.cjs') }); return; }
  const r = spawnSync(process.execPath, [target, ...args], { encoding: 'utf8', timeout: 120000 });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split(/\r?\n/).filter(Boolean);
  // A passing script that printed a WARN line is a warning: shown in the report, never a failure.
  const warned = r.status === 0 && out.some(l => /^\s*WARN\b/.test(l));
  const status = r.status === 0 ? (warned ? 'WARN' : 'PASS') : r.status === 2 ? (soft ? 'NOT_RUN' : 'ERROR') : advisory && !opt.strict ? 'ADVISORY' : 'FAIL';
  // Keep the report short: the lines that say what failed or warned, else the summary line.
  const worded = out.filter(l => /[A-Za-z]{3}/.test(l));
  const keep = status === 'PASS' ? worded.slice(-1) : worded.slice(0, 8);
  rows.push({ name, status, detail: keep.join('\n    ') });
};

run('wordcount', 'wordcount.cjs', [file, ...(opt.plain ? [opt.plain] : [])]);
run('readability', 'readability.cjs', [file, '--audience', opt.audience], { advisory: true });
if (opt.limit) run('limit', 'wordcount.cjs', [file, '--raw', '--limit', String(opt.limit), ...(opt.failAbove ? ['--fail-above', String(opt.failAbove)] : [])]);
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

for (const r of rows) console.log(`${r.status.padEnd(8)} ${r.name}${r.detail ? '\n    ' + r.detail : ''}`);
// A check script that refused its arguments is a usage error (exit 2), not a failed check.
const errored = rows.filter(r => r.status === 'ERROR');
if (errored.length) { console.log(`qe-check: usage error in ${errored.map(r => r.name).join(', ')}. Fix the arguments and run again.`); process.exit(2); }
const failed = rows.filter(r => r.status === 'FAIL');
console.log(failed.length ? `qe-check: ${failed.length} failed (${failed.map(r => r.name).join(', ')}). Fix them and run again.` : 'qe-check: no failures. Automated checks are diagnostics, not proof of clarity or truth.');
process.exit(failed.length ? 1 : 0);
