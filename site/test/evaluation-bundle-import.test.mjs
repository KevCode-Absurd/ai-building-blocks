import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { importEvaluationBundle } from '../scripts/lib/import-evaluation-bundle.mjs';

function removeFixture(dir) {
  const target = path.resolve(dir);
  assert.equal(path.dirname(target), path.resolve(os.tmpdir()));
  assert.ok(path.basename(target).startsWith('abb-eval'));
  fs.rmSync(target, { recursive: true, force: true });
}

test('evaluation bundles load from temp paths containing URL-reserved characters', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-eval # percent%-'));
  t.after(() => removeFixture(dir));
  const file = path.join(dir, 'bundle # value%.mjs');
  fs.writeFileSync(file, 'export const result = { score: 0.75, completed: true };\n');
  assert.deepEqual((await importEvaluationBundle(file)).result, { score: 0.75, completed: true });
  assert.equal(fs.existsSync(file), false);
});

test('failed evaluation-module execution retains its error and removes the temporary bundle', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-eval-error # -'));
  t.after(() => removeFixture(dir));
  const file = path.join(dir, 'throws #.mjs');
  fs.writeFileSync(file, 'throw new Error("fixture evaluation failed");\n');
  await assert.rejects(importEvaluationBundle(file), /fixture evaluation failed/);
  assert.equal(fs.existsSync(file), false);
});
