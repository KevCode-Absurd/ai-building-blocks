import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { CRITERIA, loadJobs, toPosix } from '../lib.mjs';
import { pack } from '../pack.mjs';
import { buildPrompt, writePrompts } from '../prompts.mjs';
import { tally } from '../tally.mjs';
import { tempRun, verdict, write, writeVerdict } from './helpers.mjs';

const jobs = loadJobs();
const job = id => jobs.find(item => item.id === id);
const shapeOf = prompt => JSON.parse(prompt.split('\n').find(line => line.startsWith('{"job"')));

function packets(codes, files = ['deliverable.md']) {
  return codes.map(code => ({ code, dir: path.join('/runs/r1/packets/J1', code), files }));
}
const promptFor = (id, codes, files) => buildPrompt({ job: job(id), packets: packets(codes, files), runDir: '/runs/r1', verdictDir: `/runs/r1/verdicts/${id}` });

test('a three-way prompt keeps the wording of the prototype', () => {
  const prompt = promptFor('J1', ['X', 'Y', 'Z']);
  const lines = prompt.split('\n');
  assert.equal(lines[0], 'You are a blind judge comparing three deliverables made for the same client brief. You do not know who made them and must not try to find out. Judge only what is in the three files and what you can verify on the live web. Judge as a senior paid-social creative lead who is the client\'s trusted adviser.');
  assert.equal(lines[2], `Brief (job J1): "${job('J1').brief}"`);
  assert.deepEqual(lines.slice(4, 8), ['Files:', '- X: /runs/r1/packets/J1/X/deliverable.md', '- Y: /runs/r1/packets/J1/Y/deliverable.md', '- Z: /runs/r1/packets/J1/Z/deliverable.md']);
  assert.match(lines[8], /^Read nothing else in \/runs\/r1: no other folders, notes, keys or other judges' verdicts\.$/);
  assert.ok(prompt.includes('1. Check allbirds.com today for the men\'s Tree Runner'));
  assert.ok(prompt.includes('2. Spot-check at least 5 factual claims in each file. Any invented fact, or a claim the business cannot back, is a serious defect.'));
  assert.ok(prompt.includes('3. Score each file from 0 to 100 on this weighted rubric:'));
  assert.ok(prompt.includes('4. Rank the three, best first, and list every code once. Call two a tie only if they are within 2 points'));
  assert.ok(prompt.includes('5. Say which one you would send to the client unchanged, if any.'));
  assert.ok(prompt.includes('Write your verdict as JSON to /runs/r1/verdicts/J1/verdict-<YOUR JUDGE ID>.json in this shape:'));
  assert.ok(prompt.endsWith('Then reply with the same JSON and nothing else.\n'));
  for (const row of job('J1').rubric) assert.ok(prompt.includes(`   - ${row.text} (${row.points})`), row.key);
});

test('the verdict shape in the prompt lists every code and matches what the tally reads', () => {
  const shape = shapeOf(promptFor('J3', ['K', 'Q', 'T']));
  assert.deepEqual(Object.keys(shape), ['job', 'judge', 'scores', 'ranking', 'send_unchanged', 'invented_facts', 'reasons', 'biggest_flaw', 'best_thing']);
  assert.equal(shape.job, 'J3');
  assert.equal(shape.judge, '<id>');
  assert.deepEqual(Object.keys(shape.scores), ['K', 'Q', 'T']);
  for (const code of ['K', 'Q', 'T']) assert.deepEqual(Object.keys(shape.scores[code]), [...CRITERIA.map(row => row.key), 'total']);
  assert.deepEqual(shape.ranking, ['best', 'second', 'third']);
  assert.equal(shape.send_unchanged, 'K|Q|T|none');
  assert.deepEqual(shape.invented_facts, { K: [], Q: [], T: [] });
  assert.deepEqual(Object.keys(shape.biggest_flaw), ['K', 'Q', 'T']);
  assert.deepEqual(Object.keys(shape.best_thing), ['K', 'Q', 'T']);
});

test('the prompt scales to two, four and twelve arms, and lists codes in order', () => {
  const two = promptFor('J6', ['T', 'G']);
  assert.match(two, /comparing two deliverables/);
  assert.match(two, /Rank the two, best first/);
  assert.ok(two.indexOf('- G:') < two.indexOf('- T:'), 'codes are listed A to Z whatever order they arrive in');
  assert.deepEqual(shapeOf(two).ranking, ['best', 'second']);
  assert.equal(shapeOf(two).send_unchanged, 'G|T|none');

  const four = promptFor('J6', ['E', 'G', 'H', 'J']);
  assert.match(four, /comparing four deliverables/);
  assert.match(four, /Judge only what is in the four files/);
  assert.deepEqual(shapeOf(four).ranking, ['best', 'second', 'third', 'fourth']);

  const twelve = promptFor('J6', ['EE', 'EG', 'EH', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EP', 'EQ', 'ER', 'ES']);
  assert.match(twelve, /comparing 12 deliverables/);
  assert.equal(shapeOf(twelve).ranking.length, 12);
  assert.equal(shapeOf(twelve).ranking[11], 'place 12');
});

test('HTML jobs tell the judge to render at desktop and phone widths, or read the HTML', () => {
  const html = promptFor('J2', ['K', 'Q', 'T'], ['deliverable.html']);
  assert.ok(html.includes('2. For an HTML file: if you have a browser tool, render the file and look at it at desktop width (about 1280 pixels) and at phone width (about 390 pixels). If you have no browser tool, read the HTML.'));
  assert.ok(html.includes('3. Spot-check at least 5 factual claims'));
  assert.ok(html.includes('6. Say which one you would send'));
  const markdown = promptFor('J3', ['K', 'Q', 'T']);
  assert.doesNotMatch(markdown, /browser tool/);
  assert.doesNotMatch(markdown, /image file/);
});

test('deliverables with several files are listed as folders, and images get their own step', () => {
  const prompt = promptFor('J4', ['K', 'Q'], ['deliverable.md', 'deliverable/card-1.png']);
  assert.ok(prompt.includes('- K: every file in /runs/r1/packets/J1/K/ (deliverable.md, deliverable/card-1.png)'));
  assert.ok(prompt.includes('Judge only what is in the two deliverables'));
  assert.ok(prompt.includes('2. Open and look at every image file.'));
  assert.ok(prompt.includes('Spot-check at least 5 factual claims in each deliverable.'));
});

test('every job in the set makes a prompt with its own role, check and rubric', () => {
  for (const item of jobs) {
    const prompt = promptFor(item.id, ['K', 'Q', 'T']);
    assert.ok(prompt.includes(`Judge as ${item.judge_role} who is the client's trusted adviser.`), item.id);
    assert.ok(prompt.includes(`1. ${item.web_check}`), item.id);
    assert.equal(shapeOf(prompt).job, item.id);
    assert.doesNotMatch(prompt, /ai[\s-]*blocks/i, item.id);
  }
});

test('end to end: pack, write prompts, judge by code, tally by arm', t => {
  const run = tempRun(t);
  const arms = { ours: 91, plainmodel: 74, otherteam: 80 };
  for (const id of ['J2', 'J3']) {
    for (const arm of Object.keys(arms)) write(path.join(run, id, arm, id === 'J2' ? 'deliverable.html' : 'deliverable.md'), `<p>work for ${id}</p>\n`);
  }
  pack({ runDir: run });
  const written = writePrompts({ runDir: run });
  assert.deepEqual(written.map(item => [item.job, item.arms]), [['J2', 3], ['J3', 3]]);

  const key = JSON.parse(fs.readFileSync(path.join(run, 'key', 'key.json'), 'utf8')).jobs;
  for (const id of ['J2', 'J3']) {
    const prompt = fs.readFileSync(path.join(run, 'prompts', `${id}-judge-prompt.txt`), 'utf8');
    for (const arm of Object.keys(arms)) assert.ok(!prompt.includes(arm), `the ${id} prompt names arm ${arm}`);
    const codes = Object.keys(key[id]);
    assert.deepEqual(Object.keys(shapeOf(prompt).scores), codes);
    for (const code of codes) {
      const file = toPosix(path.join(run, 'packets', id, code, id === 'J2' ? 'deliverable.html' : 'deliverable.md'));
      assert.ok(prompt.includes(`- ${code}: ${file}`));
      assert.ok(fs.existsSync(file));
    }
    assert.equal(prompt.includes('browser tool'), id === 'J2');
    assert.ok(prompt.includes(toPosix(path.join(run, 'verdicts', id, 'verdict-<YOUR JUDGE ID>.json'))));
    assert.ok(fs.existsSync(path.join(run, 'verdicts', id)), 'the folder judges write to is ready');

    // Stand-in judges: they see only codes, and score each code by a rule the test knows by arm.
    for (const judge of ['s01', 's02', 'o01']) {
      const totals = Object.fromEntries(codes.map(code => [code, arms[key[id][code]] + (judge === 'o01' ? -2 : 0)]));
      writeVerdict(run, id, judge, verdict({ job: id, judge, totals }));
    }
  }

  const { results } = tally({ runDir: run, target: 'ours' });
  assert.equal(results.counts.verdicts_counted, 6);
  assert.equal(results.overall.arms.ours.first_share, 1);
  assert.equal(results.overall.arms.ours.total.mean, 90.3333);
  assert.equal(results.overall.lead.plainmodel.mean, 17);
  assert.equal(results.overall.lead.otherteam.mean, 11);
  assert.deepEqual(results.jobs.J2.best_mean_total, ['ours']);
  assert.deepEqual(Object.keys(results.overall.by_family), ['opus', 'sonnet']);
  assert.equal(results.jobs.J2.title, 'Allbirds: landing page for Meta ad traffic');
});

test('writePrompts needs packets and a matching jobs file', t => {
  const run = tempRun(t);
  assert.throws(() => writePrompts({ runDir: run }), /Run pack\.mjs first/);
  write(path.join(run, 'packets', 'J99', 'K', 'deliverable.md'), 'x');
  assert.throws(() => writePrompts({ runDir: run }), /no job with that id/);
});
