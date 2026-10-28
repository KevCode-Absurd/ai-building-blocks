import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { writeNewWorkflowFiles } from '../../tools/lib/intake-files.mjs';

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-intake-preservation-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return ['item.yaml', 'SKILL.md', 'page.yaml'].map(name => ({ file: path.join(dir, name), text: 'new ' + name }));
}
test('regenerating an intake workflow preserves reviewed generated sources byte for byte', t => {
  const entries = fixture(t), original = 'generated_from: intake/source/skeleton.yaml\r\nreviewed: keep this edit\r\n';
  fs.writeFileSync(entries[0].file, original);
  assert.throws(() => writeNewWorkflowFiles(entries), /regeneration blocked/);
  assert.equal(fs.readFileSync(entries[0].file, 'utf8'), original);
  assert.equal(fs.existsSync(entries[1].file), false);
});
test('an existing polished page blocks creation before another source is written', t => {
  const entries = fixture(t); fs.writeFileSync(entries[2].file, 'reviewed page');
  assert.throws(() => writeNewWorkflowFiles(entries), /regeneration blocked/);
  assert.equal(fs.existsSync(entries[0].file), false);
  assert.equal(fs.readFileSync(entries[2].file, 'utf8'), 'reviewed page');
});
test('a new intake workflow still writes every source and cannot be run over those files', t => {
  const entries = fixture(t); writeNewWorkflowFiles(entries);
  for (const entry of entries) assert.equal(fs.readFileSync(entry.file, 'utf8'), entry.text);
  assert.throws(() => writeNewWorkflowFiles(entries), /regeneration blocked/);
});
