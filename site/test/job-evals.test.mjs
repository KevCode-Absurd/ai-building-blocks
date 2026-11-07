import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CASES, NEGATIVE_CONTROLS } from '../src/jobs/evals/cases.mjs';
import { REAL_RECORDING, SYNTHETIC_RECORDING, replayRecording, runControls, summarize, validateCaseSet } from '../src/jobs/evals/score.mjs';

test('team-mode eval set has 20 cases across all shapes, including five vague and five specific briefs', () => {
  assert.deepEqual(validateCaseSet(), { status: 'PASS', errors: [] });
  assert.equal(CASES.filter(c => c.output_shape === 'many_artifacts').length, 8);
  assert.equal(CASES.filter(c => c.output_shape === 'one_decision').length, 8);
  assert.equal(CASES.filter(c => c.output_shape === 'system_build').length, 4);
  assert.equal(validateCaseSet(CASES.slice(1)).status, 'FAIL');
});

test('eight negative controls reject the intended broken rule from a passing baseline', async () => {
  const fixtures = JSON.parse(fs.readFileSync(new URL('./fixtures/jobs/contracts.json', import.meta.url), 'utf8'));
  const controls = await runControls(fixtures);
  assert.deepEqual(controls.map(c => c.id), NEGATIVE_CONTROLS);
  for (const control of controls) {
    assert.equal(control.status, 'PASS', `${control.id}: ${JSON.stringify(control)}`);
    assert.equal(control.provenance, SYNTHETIC_RECORDING);
    assert.equal(control.model_calls, 0);
  }
});

test('missing recordings remain NOT_RUN and synthetic successes never count as real host evidence', () => {
  const controls = NEGATIVE_CONTROLS.map(id => ({ id, status: 'PASS' }));
  const synthetic = CASES.map(c => ({ id: c.id, status: 'SYNTHETIC_ONLY', score: 100, provenance: SYNTHETIC_RECORDING }));
  const report = summarize(synthetic, controls);
  assert.equal(report.status, 'NOT_RUN');
  assert.equal(report.recorded, 0);
  assert.equal(report.average, null);
  assert.equal(report.missing.length, 20);
  assert.equal(report.bakeoff_v2, 'NOT_RUN');
  assert.match(report.quality_claim, /No blind quality or 10x claim/);
});

test('the release score requires every case and every control, and cannot average away a failed run', () => {
  const controls = NEGATIVE_CONTROLS.map(id => ({ id, status: 'PASS' }));
  const results = CASES.map(c => ({ id: c.id, status: 'PASS', score: 100, provenance: REAL_RECORDING }));
  assert.equal(summarize(results, controls).status, 'PASS');
  assert.equal(summarize(results.slice(1), controls).status, 'NOT_RUN');
  assert.equal(summarize(results, controls.slice(1)).status, 'FAIL');
  results[0].status = 'FAIL';
  assert.equal(summarize(results, controls).status, 'FAIL');
});

test('replay refuses unlabelled or changed host records before treating them as evidence', async () => {
  const missing = await replayRecording(CASES[0], null);
  assert.equal(missing.status, 'NOT_RUN');
  const malformed = await replayRecording(CASES[0], { case: CASES[0].id, initial_input: { request: 'Changed brief' }, events: [] });
  assert.equal(malformed.status, 'FAIL');
  assert.ok(malformed.errors.some(error => error.includes('provenance')));
  assert.ok(malformed.errors.some(error => error.includes('shared case request')));
});

test('team-mode pack builds locally under 60 KB and declares single-context review honestly', () => {
  const content = fs.readFileSync(new URL('../src/jobs/pack/TEAM-MODE.md', import.meta.url), 'utf8');
  assert.ok(Buffer.byteLength(content) < 60_000);
  for (const text of ['task-specific lead', 'working groups', 'SAME_CONTEXT_REVIEW', 'CONSENSUS_UNTESTED', 'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED']) assert.ok(content.includes(text), text);
});
