import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { publicBenchmark, renderBenchmarkArticle } from '../scripts/lib/ecommerce-benchmark-article.mjs';
import { readReviewedBenchmarkFiles } from '../scripts/lib/ecommerce-benchmark-files.mjs';

// Deliberately synthetic in-memory validation fixtures, never publication data.
const hash = 'a'.repeat(64), time = '2026-11-18T12:00:00Z';
const judge = () => ({ valid: true, model: 'test-judge', specialistScore: 80, plainScore: 80, specialistStatus: 'PASS', plainStatus: 'PASS', preference: 'tie', reason: 'Synthetic validator fixture.', reportSha256: hash });
function fixture() {
  const cases = Array.from({ length: 80 }, (_, i) => ({ id: `test-role-${i}`, name: `Test ${i}`, role: 'Test role', job: 'Synthetic test brief.', taskKind: 'analysis', fixtureKind: 'synthetic', evidence: 'Synthetic test evidence.', executionLimits: 'Not a measured real output.', inputSha256: hash, originalPrTask: i === 0, selectedAttempt: 1, attempts: [{ sourceRevision: 'a'.repeat(40), packageSha256: hash, changes: [], specialist: { fresh: true, completed: true, model: 'test-model', runId: `s-${i}`, startedAt: time, completedAt: time, artifactSha256: hash }, plain: { fresh: true, completed: true, model: 'test-model', runId: `p-${i}`, startedAt: time, completedAt: time, artifactSha256: hash }, judges: { sol: judge(), terra: judge() } }], outputs: [{ title: 'Test excerpt', attemptNumber: 1, arm: 'specialist', kind: 'redacted-excerpt', excerpt: 'Synthetic output fixture.', sourceArtifactSha256: hash, reviewNote: 'Synthetic test only.' }] }));
  return { schema: 'ecommerce-fresh80-public-v1', status: 'COMPLETE', freshAll80: true, originalPrCompleted: true, sourceRevision: 'a'.repeat(40), runStartedAt: time, runCompletedAt: time, protocolSha256: hash, evidenceManifestSha256: hash, protocol: 'Synthetic test protocol.', rubric: 'Synthetic test rubric.', limitations: ['Not real benchmark results.'], privacyReview: { approved: true, reviewedAt: time, method: 'Synthetic validator test.' }, roster: cases.map(c => c.id), cases };
}

test('refuses incomplete, carried-forward, unreviewed or missing original PR results', () => {
  for (const mutate of [d => d.status = 'PENDING', d => d.freshAll80 = false, d => d.originalPrCompleted = false, d => d.privacyReview.approved = false, d => d.cases.pop(), d => d.cases[0].attempts[0].specialist.fresh = false, d => d.cases[0].originalPrTask = false, d => d.cases[0].attempts[0].judges.terra.valid = false, d => d.cases[0].attempts[0].judges.sol.specialistStatus = 'FAIL']) {
    const data = fixture(); mutate(data); assert.throws(() => publicBenchmark(data), /publication refused/);
  }
});

test('rejects duplicate runs, hidden later failure, invalid numbers and private identifiers', () => {
  for (const mutate of [d => d.cases[1].attempts[0].plain.runId = 'p-0', d => d.cases[0].attempts[0].judges.sol.plainScore = NaN, d => d.cases[0].outputs[0].excerpt = 'Client gehna sales', d => d.cases[0].job = 'Read C:\\private\\file.csv', d => d.cases[0].attempts[0].plain.completedAt = '2020-01-01T00:00:00Z']) {
    const data = fixture(); mutate(data); assert.throws(() => publicBenchmark(data), /publication refused/);
  }
});

test('allowlist excludes unknown private fields and escapes HTML in actual excerpts', () => {
  const data = fixture(); data.privateSource = 'DO NOT PUBLISH'; data.cases[0].privateSource = 'DO NOT PUBLISH'; data.cases[0].outputs[0].excerpt = '<script>alert("x")</script>';
  const result = renderBenchmarkArticle(data, '<h2 id="method">Test method</h2>');
  assert.ok(!JSON.stringify(result.data).includes('DO NOT PUBLISH'));
  assert.ok(result.body.includes('&lt;script&gt;'));
  assert.ok(!result.body.includes('<script>'));
  assert.equal((result.body.match(/class="benchmark-case"/g) ?? []).length, 80);
  assert.equal(result.totals.finalPasses, 80);
  assert.equal(result.totals.sol.tie, 80);
});

test('retains repair history and computes first-attempt pass and model preferences separately', () => {
  const data = fixture(), c = data.cases[0], repaired = structuredClone(c.attempts[0]);
  c.attempts[0].judges.sol.specialistStatus = 'NEEDS_REPAIR';
  repaired.specialist.runId = 's-repair'; repaired.plain.runId = 'p-repair'; repaired.changes = ['Fixed a test-only defect.'];
  repaired.judges.sol.preference = 'plain'; repaired.judges.terra.preference = 'specialist'; c.attempts.push(repaired); c.selectedAttempt = 2;
  c.outputs.push({ ...c.outputs[0], attemptNumber: 2 });
  const result = renderBenchmarkArticle(data, '');
  assert.equal(result.totals.firstAttemptPasses, 79); assert.equal(result.totals.finalPasses, 80); assert.equal(result.totals.repairedCases, 1); assert.equal(result.totals.attempts, 81); assert.equal(result.totals.judgeDisagreements, 1);
  assert.match(result.body, /Attempt 1 \(retained\)/); assert.match(result.body, /NEEDS_REPAIR/);
  c.selectedAttempt = 1; assert.throws(() => publicBenchmark(data), /latest completed attempt/);
});

test('opening summary foregrounds mixed preferences and the overview exposes selected specialist statuses', () => {
  const data = fixture();
  for (const [i, c] of data.cases.entries()) {
    c.attempts[0].judges.sol.preference = i < 38 ? 'specialist' : i < 77 ? 'plain' : 'tie';
    c.attempts[0].judges.terra.preference = i < 38 ? 'specialist' : i < 73 ? 'plain' : 'tie';
  }
  const { body, totals } = renderBenchmarkArticle(data, '');
  const opening = body.slice(0, body.indexOf('<h2 id="results">'));
  assert.match(opening, /Sol preferred the specialist 38 times, the plain model 39 times, and called 3 ties/);
  assert.match(opening, /Terra preferred the specialist 38 times, the plain model 35 times, and called 7 ties/);
  assert.match(opening, /Passing a task does not establish superiority over ordinary Sol/);
  assert.match(opening, /do not measure performance on unseen jobs/);
  assert.equal(totals.finalPasses, 80);
  const overview = body.slice(body.indexOf('aria-label="All 80 agent results"'), body.indexOf('<h2 id="comparison">'));
  assert.match(overview, /<th scope="col">Sol specialist status<\/th>/);
  assert.match(overview, /<th scope="col">Terra specialist status<\/th>/);
  assert.equal((overview.match(/<td>PASS<\/td>/g) ?? []).length, 160);
  for (const status of ['FAIL', 'NEEDS_REPAIR', 'LIMITED_CAPABILITY']) {
    const blocked = structuredClone(data);
    blocked.cases[0].attempts[0].judges.terra.specialistStatus = status;
    assert.throws(() => renderBenchmarkArticle(blocked, ''), /has not passed both judges/);
  }
});

test('retains capability limits and insufficient evidence without counting them as a pass or tie', () => {
  const data = fixture(), c = data.cases[0];
  c.attempts[0].judges.terra.specialistStatus = 'LIMITED_CAPABILITY';
  c.attempts[0].judges.terra.plainStatus = 'LIMITED_CAPABILITY';
  c.attempts[0].judges.terra.preference = 'insufficient_evidence';
  assert.throws(() => publicBenchmark(data), /has not passed both judges/);
  const later = structuredClone(c.attempts[0]);
  later.specialist.runId = 's-supplement'; later.plain.runId = 'p-supplement';
  later.changes = ['Synthetic fixture dependency supplied; original limitation retained.'];
  later.judges.terra.specialistStatus = 'PASS';
  c.attempts.push(later); c.selectedAttempt = 2;
  c.outputs.push({ ...c.outputs[0], attemptNumber: 2 });
  const result = renderBenchmarkArticle(data, '');
  assert.equal(result.totals.firstAttemptPasses, 79);
  assert.equal(result.totals.finalPasses, 80);
  assert.equal(result.totals.terra.insufficient_evidence, 1);
  assert.equal(result.totals.terra.tie, 79);
  assert.match(result.body, /LIMITED_CAPABILITY/);
  assert.match(result.body, /Insufficient evidence/);
  assert.match(result.body, /Terra did so in 1 cases/);
});

test('publication day follows the owner timezone across the UTC midnight boundary', () => {
  const data = fixture(); data.runCompletedAt = '2026-11-18T19:00:00Z';
  const { meta } = renderBenchmarkArticle(data, '');
  assert.equal(meta.published, '2026-11-19');
});

test('output excerpts identify their actual attempt and cannot substitute an older output', () => {
  for (const attemptNumber of [undefined, 0, 2, 1.5]) {
    const data = fixture(); data.cases[0].outputs[0].attemptNumber = attemptNumber;
    assert.throws(() => publicBenchmark(data), /attemptNumber/);
  }
  const data = fixture(), c = data.cases[0], later = structuredClone(c.attempts[0]);
  later.specialist.runId = 'selected-s'; later.plain.runId = 'selected-p';
  c.attempts.push(later); c.selectedAttempt = 2;
  assert.throws(() => publicBenchmark(data), /selected-attempt specialist output/);
  c.outputs.push({ ...c.outputs[0], attemptNumber: 2 });
  const { body } = renderBenchmarkArticle(data, '');
  assert.match(body, /Specialist output, attempt 1 \(retained\)/);
  assert.match(body, /Specialist output, attempt 2 \(selected\)/);
});

test('discloses arithmetic-only judge corrections without inventing another output attempt', () => {
  const data = fixture(), j = data.cases[0].attempts[0].judges.terra;
  j.correction = { kind: 'derived-total-only', originalValidity: 'INVALID_REPORT', sameAuthor: true, substantiveFieldsUnchanged: true, originalReportSha256: 'b'.repeat(64), auditSha256: 'c'.repeat(64), originalSpecialistTotal: 79, originalPlainTotal: 81, reason: 'Synthetic correction audit fixture.' };
  const result = renderBenchmarkArticle(data, '');
  assert.equal(result.totals.judgeTotalCorrections, 1);
  assert.equal(result.totals.attempts, 80);
  assert.equal(result.totals.repairedCases, 0);
  assert.match(result.body, /original report was INVALID_REPORT/);
  assert.match(result.body, /not a count of error-free original judge reports/);
  assert.equal(result.data.cases[0].attempts[0].judges.terra.correction.originalPlainTotal, 81);
  for (const mutation of [c => c.sameAuthor = false, c => c.substantiveFieldsUnchanged = false, c => c.originalValidity = 'VALID_REPORT', c => c.originalReportSha256 = hash, c => c.kind = 'changed-verdict', c => { c.originalSpecialistTotal = 80; c.originalPlainTotal = 80; }]) {
    const invalid = structuredClone(data); mutation(invalid.cases[0].attempts[0].judges.terra.correction);
    assert.throws(() => publicBenchmark(invalid), /publication refused/);
  }
});

test('native output downloads bind to reviewed bytes and reject unsafe public paths', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'benchmark-public-files-'));
  t.after(() => {
    const resolved = fs.realpathSync(directory);
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('benchmark-public-files-'));
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  const bytes = Buffer.from('scenario,cost\nbase,100\n');
  const file = { filename: 'sample-costs.csv', bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), kind: 'download', label: 'Download the actual synthetic costs', reviewNote: 'Synthetic test data; no merchant facts.' };
  const data = fixture(); data.cases[0].outputs[0].files = [file];
  const rendered = renderBenchmarkArticle(data, '');
  assert.match(rendered.body, /sample-costs.csv" download/);
  assert.throws(() => readReviewedBenchmarkFiles(rendered.data), /artifact-dir/);
  fs.writeFileSync(path.join(directory, file.filename), bytes);
  assert.deepEqual(readReviewedBenchmarkFiles(rendered.data, directory)[0].bytes, bytes);
  fs.writeFileSync(path.join(directory, file.filename), Buffer.alloc(bytes.length));
  assert.throws(() => readReviewedBenchmarkFiles(rendered.data, directory), /hash changed/);
  for (const filename of ['../private.csv', 'https://example.com/file.csv', 'results.json', 'active.html', 'image.svg']) {
    file.filename = filename;
    assert.throws(() => publicBenchmark(data), /publication refused/);
  }
});

test('repeated PNG references validate each image size before deduplicating copies', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'benchmark-public-files-'));
  t.after(() => {
    const resolved = fs.realpathSync(directory);
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('benchmark-public-files-'));
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4S8AAAAASUVORK5CYII=', 'base64');
  const file = { filename: 'sample-preview.png', bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), kind: 'download', label: 'Download the test image', reviewNote: 'Synthetic one-pixel fixture.' };
  fs.writeFileSync(path.join(directory, file.filename), bytes);
  const data = fixture();
  data.cases[0].outputs[0].files = [file];
  data.cases[1].outputs[0].files = [{ ...file, kind: 'image', width: 10, height: 10 }];
  assert.throws(() => readReviewedBenchmarkFiles(publicBenchmark(data), directory), /dimensions changed/);
  data.cases[1].outputs[0].files[0].width = 1;
  data.cases[1].outputs[0].files[0].height = 1;
  assert.equal(readReviewedBenchmarkFiles(publicBenchmark(data), directory).length, 1);
  data.cases[0].outputs[0].files = [{ ...file, kind: 'image', width: 1, height: 1 }];
  data.cases[1].outputs[0].files[0].height = 2;
  assert.throws(() => readReviewedBenchmarkFiles(publicBenchmark(data), directory), /dimensions changed/);
  data.cases[1].outputs[0].files = [{ ...file }];
  assert.equal(readReviewedBenchmarkFiles(publicBenchmark(data), directory).length, 1);
});

test('metadata and methodology are ready for normal blog rendering', () => {
  const methodology = fs.readFileSync(new URL('../scripts/data/ecommerce-benchmark-methodology.html', import.meta.url), 'utf8');
  const { body, meta } = renderBenchmarkArticle(fixture(), methodology);
  assert.ok(meta.title.length >= 30 && meta.title.length <= 80);
  assert.ok(`${meta.seoTitle} | AI Blocks`.length >= 50 && `${meta.seoTitle} | AI Blocks`.length <= 60);
  assert.ok(meta.description.length >= 110 && meta.description.length <= 160);
  assert.match(body, /id="faq"/); assert.match(body, /data-copy="benchmark-job-brief"/); assert.match(body, /data-copy="benchmark-review-brief"/);
  assert.ok(!/—|&mdash;|<script|<style|style="/.test(body));
});

test('publishes owner-disclosed non-passing cases as named limitations, never as passes', () => {
  const data = fixture();
  data.cases[3].attempts[0].judges.terra.specialistStatus = 'LIMITED_CAPABILITY';
  data.cases[5].attempts[0].judges.terra.specialistStatus = 'NEEDS_REPAIR';
  assert.throws(() => publicBenchmark(data), /has not passed both judges/);
  data.disclosedLimitations = [{ id: 'test-role-3', summary: 'No real store was available to test in.' }, { id: 'test-role-5', summary: 'No matching slow page was available.' }];
  const { body, totals } = renderBenchmarkArticle(data, '');
  assert.equal(totals.finalPasses, 78);
  assert.equal(totals.limited, 2);
  const opening = body.slice(0, body.indexOf('<h2 id="results">'));
  assert.ok(opening.includes('78 passed on the selected final attempt. <strong>2 did not pass both judges.</strong>'));
  assert.ok(opening.includes('<h2 id="not-passed">The 2 agents that did not pass</h2>'));
  assert.ok(opening.includes('<a href="#case-test-role-3"><strong>Test 3, Test role</strong></a>. No real store was available to test in. Sol passed (80/100); Terra marked it limited by missing tools (80/100).'));
  assert.ok(opening.includes('Terra asked for a repair (80/100)'));
  assert.equal(body.split('Did not pass both judges</strong>').length - 1, 2);
  assert.ok(body.includes('Test 3: Test role (did not pass both judges)</summary>'));
  const limits = body.slice(body.indexOf('<h2 id="limits">'));
  assert.ok(limits.includes('Test 5 (Test role) did not pass both judges. No matching slow page was available.'));
});

test('refuses a disclosed limitation that passed, is unknown, or is listed twice', () => {
  for (const mutate of [
    d => { d.disclosedLimitations = [{ id: 'test-role-1', summary: 'Passed anyway.' }]; },
    d => { d.cases[3].attempts[0].judges.sol.specialistStatus = 'FAIL'; d.disclosedLimitations = [{ id: 'not-an-agent', summary: 'Unknown.' }]; },
    d => { d.cases[3].attempts[0].judges.sol.specialistStatus = 'FAIL'; d.disclosedLimitations = [{ id: 'test-role-3', summary: 'One.' }, { id: 'test-role-3', summary: 'Two.' }]; },
    d => { d.cases[3].attempts[0].judges.sol.specialistStatus = 'FAIL'; d.disclosedLimitations = [{ id: 'test-role-3', summary: '' }]; },
  ]) { const data = fixture(); mutate(data); assert.throws(() => publicBenchmark(data), /publication refused/); }
  const data = fixture();
  assert.equal(renderBenchmarkArticle(data, '').totals.limited, 0);
  assert.ok(!renderBenchmarkArticle(data, '').body.includes('id="not-passed"'));
});
