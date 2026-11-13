#!/usr/bin/env node
// qe-check: every applicable Quality Engine text check in one command, with one short report.
// Plain Node 18+, no packages. Runs the scripts beside it: wordcount, readability, leakcheck, proof, check-format.
// Usage: node qe-check.cjs <final> [--plain <plain>] [--audience consumer|business|specialist]
//          [--sources <file|dir> ...] [--contract <contract.json> | --max-words <n>] [--online] [--requested-template]
// Proof runs offline unless --online is given. --max-words writes a one-rule contract for check-format.
// Exit 0 = no check failed, 1 = at least one failed, 2 = usage error. Readability stays advisory unless --strict.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');

const argv = process.argv.slice(2);
const opt = { sources: [], audience: 'business', online: false, template: false, strict: false };
let file = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--plain') opt.plain = argv[++i];
  else if (a === '--audience') opt.audience = argv[++i];
  else if (a === '--sources') { while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opt.sources.push(argv[++i]); }
  else if (a === '--contract') opt.contract = argv[++i];
  else if (a === '--max-words') opt.maxWords = Number(argv[++i]);
  else if (a === '--online') opt.online = true;
  else if (a === '--requested-template') opt.template = true;
  else if (a === '--strict') opt.strict = true;
  else if (!a.startsWith('--') && !file) file = a;
  else { console.error('Unknown option ' + a); process.exit(2); }
}
const usage = 'Usage: node qe-check.cjs <final> [--plain <plain>] [--audience consumer|business|specialist] [--sources <files...>] [--contract <json> | --max-words <n>] [--online] [--requested-template] [--strict]';
if (!file || !fs.existsSync(file)) { console.error(file ? 'Cannot read ' + file : usage); process.exit(2); }
if (opt.plain && !fs.existsSync(opt.plain)) { console.error('Cannot read ' + opt.plain); process.exit(2); }
if (opt.maxWords !== undefined && !(Number.isInteger(opt.maxWords) && opt.maxWords > 0)) { console.error('--max-words needs a positive whole number'); process.exit(2); }

const here = __dirname, rows = [];
const run = (name, script, args, { advisory = false } = {}) => {
  const target = path.join(here, script);
  if (!fs.existsSync(target)) { rows.push({ name, status: 'NOT_RUN', detail: script + ' is not beside qe-check.cjs' }); return; }
  const r = spawnSync(process.execPath, [target, ...args], { encoding: 'utf8', timeout: 120000 });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split(/\r?\n/).filter(Boolean);
  const status = r.status === 0 ? 'PASS' : r.status === 2 ? 'ERROR' : advisory && !opt.strict ? 'ADVISORY' : 'FAIL';
  // Keep the report short: the lines that say what failed, else the summary line.
  const worded = out.filter(l => /[A-Za-z]{3}/.test(l));
  const keep = status === 'PASS' ? worded.slice(-1) : worded.slice(0, 8);
  rows.push({ name, status, detail: keep.join('\n    ') });
};

run('wordcount', 'wordcount.cjs', [file, ...(opt.plain ? [opt.plain] : [])]);
run('readability', 'readability.cjs', [file, '--audience', opt.audience], { advisory: true });
run('leakcheck', 'leakcheck.cjs', [file, ...(opt.template ? ['--requested-template'] : [])]);
run('proof', 'proof.cjs', [file, ...(opt.sources.length ? ['--sources', ...opt.sources] : []), ...(opt.online ? [] : ['--offline'])]);
let contract = opt.contract, temp = null;
if (!contract && opt.maxWords) { temp = path.join(os.tmpdir(), `qe-contract-${process.pid}.json`); fs.writeFileSync(temp, JSON.stringify({ max_words: opt.maxWords })); contract = temp; }
if (contract) run('format', 'check-format.cjs', [file, '--contract', contract]);
else rows.push({ name: 'format', status: 'NOT_RUN', detail: 'no --contract or --max-words from the brief' });
if (temp) fs.rmSync(temp, { force: true });

for (const r of rows) console.log(`${r.status.padEnd(8)} ${r.name}${r.detail ? '\n    ' + r.detail : ''}`);
const failed = rows.filter(r => r.status === 'FAIL' || r.status === 'ERROR');
console.log(failed.length ? `qe-check: ${failed.length} failed (${failed.map(r => r.name).join(', ')}). Fix them and run again.` : 'qe-check: no failures. Automated checks are diagnostics, not proof of clarity or truth.');
process.exit(failed.length ? 1 : 0);
