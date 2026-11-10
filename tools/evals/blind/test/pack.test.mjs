import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { CODE_LETTERS, listDeliverableFiles, pack, randomCodes, scanText, tellTerms } from '../pack.mjs';
import { HERE, tempRun, write } from './helpers.mjs';

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 1, 2, 3, 250, 251, 252]);
const ARMS = ['armalpha', 'arm-bravo', 'armcharlie'];

/** A run with two jobs and three arms, with working notes and tells mixed in. */
function sampleRun(t) {
  const run = tempRun(t);
  const at = (...parts) => path.join(run, ...parts);
  write(at('J1', 'armalpha', 'deliverable.md'), '# Six ads\n\nAd 1: Light on your feet.\n');
  write(at('J1', 'armalpha', 'notes.md'), 'private working notes');
  write(at('J1', 'arm-bravo', 'deliverable.md'), '# Six ads\r\n\r\nMade with AI Blocks.\r\nSee DECISIONS.md for why.\r\nLead: Maya Rao. Picked from the toolbox.\r\n');
  write(at('J1', 'arm-bravo', 'DECISIONS.md'), 'why we chose these');
  write(at('J1', 'arm-bravo', 'WORK-METHOD.md'), 'method');
  write(at('J1', 'arm-bravo', 'ad-1.png'), PNG);
  write(at('J1', 'arm-bravo', 'deliverable', 'specs.md'), 'Spec for ad 2\n');
  write(at('J1', 'arm-bravo', 'deliverable', 'img', 'card.JPG'), PNG);
  write(at('J1', 'arm-bravo', 'deliverable', 'build.js'), 'console.log(1)');
  write(at('J1', 'arm-bravo', 'scratch', 'draft.md'), 'draft');
  write(at('J1', 'armcharlie', 'deliverable.md'), '# Six ads\n\nBetter than the Arm Bravo version.\n');
  write(at('J1', 'armcharlie', 'armalpha-ad.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><text>useaiblocks.com</text></svg>');
  write(at('J2', 'armalpha', 'deliverable.html'), '<!doctype html><title>Tree Runner</title><p>Hello</p>');
  write(at('J2', 'arm-bravo', 'deliverable.html'), '<!doctype html><!-- knowledge.md says lead with comfort --><p>Hello</p>');
  write(at('J2', 'armcharlie', 'deliverable.md'), 'A page, described in words.\n');
  write(at('not-a-job', 'readme.txt'), 'ignored');
  return run;
}

function hashTree(dir) {
  const hash = crypto.createHash('sha256');
  for (const name of fs.readdirSync(dir, { recursive: true }).map(String).sort()) {
    const file = path.join(dir, name);
    hash.update(name.replaceAll('\\', '/'));
    if (fs.statSync(file).isFile()) hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex');
}

const readKey = run => JSON.parse(fs.readFileSync(path.join(run, 'key', 'key.json'), 'utf8')).jobs;
const filesIn = dir => fs.readdirSync(dir, { recursive: true }).map(name => String(name).replaceAll('\\', '/')).filter(name => fs.statSync(path.join(dir, name)).isFile()).sort();

test('randomCodes gives distinct letter codes, as short as possible', () => {
  for (let round = 0; round < 50; round += 1) {
    const codes = randomCodes(3);
    assert.equal(new Set(codes).size, 3);
    for (const code of codes) assert.match(code, new RegExp(`^[${CODE_LETTERS}]$`));
  }
  assert.equal(new Set(randomCodes(CODE_LETTERS.length)).size, CODE_LETTERS.length, 'every letter used once');
  const many = randomCodes(25);
  assert.equal(new Set(many).size, 25);
  assert.ok(many.every(code => code.length === 2), 'two letters once one letter is not enough');
  assert.doesNotMatch(CODE_LETTERS, /[ABCDFIO]/, 'no letters that read as grades or digits');
});

test('randomCodes is not a fixed order: three arms see more than one arrangement', () => {
  const seen = new Set();
  for (let round = 0; round < 200; round += 1) seen.add(randomCodes(3).join(''));
  assert.ok(seen.size > 20, `only ${seen.size} arrangements in 200 draws`);
});

test('randomCodes uses the random source it is given', () => {
  let next = 0;
  const codes = randomCodes(3, () => [4, 4, 0, 4, 9][next++]);
  assert.deepEqual(codes, [CODE_LETTERS[4], CODE_LETTERS[0], CODE_LETTERS[9]], 'a repeat is drawn again');
});

test('listDeliverableFiles keeps only deliverable files', t => {
  const run = sampleRun(t);
  const bravo = listDeliverableFiles(path.join(run, 'J1', 'arm-bravo'));
  assert.deepEqual([...bravo.files].sort(), ['ad-1.png', 'deliverable.md', 'deliverable/img/card.JPG', 'deliverable/specs.md']);
  assert.deepEqual([...bravo.skipped].sort(), ['DECISIONS.md', 'WORK-METHOD.md', 'deliverable/build.js', 'scratch/']);
  assert.deepEqual(listDeliverableFiles(path.join(run, 'J1', 'armalpha')), { files: ['deliverable.md'], skipped: ['notes.md'] });
});

test('scanText flags arm names, working notes, persona names and AI Blocks', () => {
  const terms = tellTerms({ arms: ['plain-opus', 'ab'], names: ['Maya Rao'] });
  const kinds = text => scanText(text, terms).map(hit => `${hit.kind}:${hit.term}`);
  assert.deepEqual(kinds('nothing to see here, just a plain shoe'), []);
  assert.deepEqual(kinds('from the Plain Opus run'), ['arm name:plain-opus']);
  assert.deepEqual(kinds('plain_opus and plainopus'), ['arm name:plain-opus']);
  assert.deepEqual(kinds('an ab test of two headlines'), [], 'a two-letter arm name is not scanned for');
  assert.deepEqual(kinds('see DECISIONS.md and notes.md'), ['working note:DECISIONS.md', 'working note:notes.md']);
  assert.deepEqual(kinds('footnotes.md is fine'), []);
  assert.deepEqual(kinds('per knowledge.md'), ['working note:knowledge.md']);
  assert.deepEqual(kinds('follow WORK-METHOD.md'), ['working note:WORK-METHOD']);
  assert.deepEqual(kinds('from my Toolbox:'), ['working note:toolbox']);
  assert.deepEqual(kinds('Written by maya  rao'), ['persona name:Maya Rao']);
  for (const text of ['Built with AI Blocks', 'ai-blocks', 'AIBlocks', 'visit useaiblocks.com', 'agents.useaiblocks.com', 'AI Building Blocks']) {
    assert.deepEqual(kinds(text), ['AI Blocks:AI Blocks'], text);
  }
  assert.deepEqual(kinds('Thai blocks of teak'), []);
  const hits = scanText('line one\nline two mentions AI Blocks here\n', terms);
  assert.equal(hits[0].line, 2);
  assert.match(hits[0].excerpt, /mentions AI Blocks here/);
});

test('pack makes coded packets, keeps the key outside them, and changes no deliverable', t => {
  const run = sampleRun(t);
  const before = { J1: hashTree(path.join(run, 'J1')), J2: hashTree(path.join(run, 'J2')) };
  const result = pack({ runDir: run, names: ['Maya Rao, Arjun Mehta'] });

  assert.deepEqual({ J1: hashTree(path.join(run, 'J1')), J2: hashTree(path.join(run, 'J2')) }, before, 'source deliverables are untouched');
  assert.deepEqual(result.jobs.map(job => [job.job, job.arms]), [['J1', 3], ['J2', 3]]);
  assert.deepEqual(result.ignored, ['not-a-job']);
  assert.deepEqual(result.warnings, ['J2/armcharlie: no deliverable.html, which this job asks for']);

  const key = readKey(run);
  assert.deepEqual(Object.keys(key), ['J1', 'J2']);
  for (const job of ['J1', 'J2']) {
    const codes = Object.keys(key[job]);
    assert.deepEqual(codes, [...codes].sort(), 'the key is listed by code, not by arm');
    assert.deepEqual(Object.values(key[job]).sort(), [...ARMS].sort());
    assert.deepEqual(fs.readdirSync(path.join(run, 'packets', job)).sort(), codes);
    for (const code of codes) assert.match(code, new RegExp(`^[${CODE_LETTERS}]$`));
  }

  // Each packet holds exactly the allowed files, byte for byte.
  const codeOf = (job, arm) => Object.keys(key[job]).find(code => key[job][code] === arm);
  const bravo = path.join(run, 'packets', 'J1', codeOf('J1', 'arm-bravo'));
  assert.deepEqual(filesIn(bravo), ['ad-1.png', 'deliverable.md', 'deliverable/img/card.JPG', 'deliverable/specs.md']);
  assert.deepEqual(fs.readFileSync(path.join(bravo, 'deliverable.md')), fs.readFileSync(path.join(run, 'J1', 'arm-bravo', 'deliverable.md')), 'CRLF line endings survive');
  assert.deepEqual(fs.readFileSync(path.join(bravo, 'ad-1.png')), PNG);
  assert.deepEqual(filesIn(path.join(run, 'packets', 'J1', codeOf('J1', 'armalpha'))), ['deliverable.md']);

  // Nothing in the packets names an arm, and the key is not in there.
  const packetFiles = filesIn(path.join(run, 'packets'));
  assert.ok(!packetFiles.some(name => /key|notes\.md|DECISIONS|WORK-METHOD|build\.js|draft/i.test(name)), packetFiles.join(', '));
  assert.ok(!packetFiles.some(name => ARMS.some(arm => name.split('/').slice(0, 3).includes(arm))));
  assert.ok(fs.existsSync(path.join(run, 'key', 'key.json')));

  // What pack hands back to be printed never pairs an arm with a code.
  assert.ok(!('key' in result));
  assert.deepEqual(Object.keys(result.jobs[0]).sort(), ['arms', 'files', 'job', 'tells']);
});

test('pack reports tells by arm and file, without codes, and lists what it left out', t => {
  const run = sampleRun(t);
  pack({ runDir: run, names: ['Maya Rao, Arjun Mehta'] });
  const report = JSON.parse(fs.readFileSync(path.join(run, 'tells.json'), 'utf8'));
  assert.equal(report.count, report.tells.length);
  assert.deepEqual(report.looked_for.persona_names, ['Maya Rao', 'Arjun Mehta']);
  assert.deepEqual(report.looked_for.arm_names, ['arm-bravo', 'armalpha', 'armcharlie']);

  const seen = report.tells.map(tell => `${tell.job}/${tell.arm}/${tell.file}:${tell.line ?? 'name'} ${tell.kind}=${tell.term}`).sort();
  assert.deepEqual(seen, [
    'J1/arm-bravo/deliverable.md:3 AI Blocks=AI Blocks',
    'J1/arm-bravo/deliverable.md:4 working note=DECISIONS.md',
    'J1/arm-bravo/deliverable.md:5 persona name=Maya Rao',
    'J1/arm-bravo/deliverable.md:5 working note=toolbox',
    'J1/armcharlie/armalpha-ad.svg:1 AI Blocks=AI Blocks',
    'J1/armcharlie/armalpha-ad.svg:name arm name=armalpha',
    'J1/armcharlie/deliverable.md:3 arm name=arm-bravo',
    'J2/arm-bravo/deliverable.html:1 working note=knowledge.md',
  ]);
  const key = readKey(run);
  const codes = new Set(Object.values(key).flatMap(job => Object.keys(job)));
  for (const tell of report.tells) {
    assert.deepEqual(Object.keys(tell).sort(), ['arm', 'excerpt', 'file', 'job', 'kind', 'line', 'term', 'where']);
    assert.ok(!codes.has(tell.file.split('/')[0]));
  }
  assert.deepEqual(report.left_out_of_packets.map(item => `${item.job}/${item.arm}/${item.file}`).sort(), [
    'J1/arm-bravo/DECISIONS.md', 'J1/arm-bravo/WORK-METHOD.md', 'J1/arm-bravo/deliverable/build.js', 'J1/arm-bravo/scratch/', 'J1/armalpha/notes.md',
  ]);
});

test('pack will not quietly make new codes for a run that is already packed or judged', t => {
  const run = sampleRun(t);
  pack({ runDir: run });
  const first = readKey(run);
  assert.throws(() => pack({ runDir: run }), /already packed/);
  assert.deepEqual(readKey(run), first, 'a refused pack leaves the key alone');
  pack({ runDir: run, force: true });
  write(path.join(run, 'verdicts', 'J1', 'verdict-s01.json'), '{}');
  assert.throws(() => pack({ runDir: run, force: true }), /already holds verdicts/);
});

test('pack stops before writing anything when a job is not ready', t => {
  const run = tempRun(t);
  write(path.join(run, 'J1', 'armalpha', 'deliverable.md'), 'only one arm');
  write(path.join(run, 'J3', 'armalpha', 'deliverable.md'), 'fine');
  write(path.join(run, 'J3', 'arm-bravo', 'notes.md'), 'no deliverable here');
  assert.throws(() => pack({ runDir: run }), error => {
    assert.match(error.message, /J1: needs at least 2 arms, found 1/);
    assert.match(error.message, /J3\/arm-bravo: no deliverable files/);
    return true;
  });
  assert.ok(!fs.existsSync(path.join(run, 'packets')));
  assert.ok(!fs.existsSync(path.join(run, 'key')));
  assert.throws(() => pack({ runDir: tempRun(t) }), /No job folders/);
  assert.throws(() => pack({ runDir: path.join(run, 'missing') }), /Run folder not found/);
});

test('pack handles any number of arms', t => {
  const run = tempRun(t);
  const arms = ['one-arm', 'two-arm', 'three-arm', 'four-arm', 'five-arm'];
  for (const arm of arms) write(path.join(run, 'J6', arm, 'deliverable.md'), `audit from somewhere\n`);
  const result = pack({ runDir: run });
  assert.deepEqual(result.jobs, [{ job: 'J6', arms: 5, files: 5, tells: 0 }]);
  assert.deepEqual(Object.values(readKey(run).J6).sort(), [...arms].sort());
  write(path.join(run, 'J7', 'one-arm', 'deliverable.md'), 'plan');
  write(path.join(run, 'J7', 'two-arm', 'deliverable.md'), 'plan');
  pack({ runDir: run, force: true });
  assert.equal(Object.keys(readKey(run).J7).length, 2);
});

test('the pack command never prints an arm next to its code', t => {
  const run = sampleRun(t);
  const out = execFileSync(process.execPath, [path.join(HERE, '..', 'pack.mjs'), '--run', run, '--names', 'Maya Rao'], { encoding: 'utf8' });
  assert.match(out, /J1: 3 arms packed, 7 files, 7 possible tells/);
  assert.match(out, /J2: 3 arms packed, 3 files, 1 possible tells/);
  const key = readKey(run);
  for (const line of out.split('\n')) {
    for (const codes of Object.values(key)) {
      for (const [code, arm] of Object.entries(codes)) {
        assert.ok(!(line.includes(arm) && new RegExp(`(?<![A-Za-z])${code}(?![A-Za-z])`).test(line)), `line pairs ${arm} with ${code}: ${line}`);
      }
    }
  }
  assert.ok(!out.includes('"armalpha"'));
});
