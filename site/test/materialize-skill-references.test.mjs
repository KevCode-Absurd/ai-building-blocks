import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { zipSync, strToU8 } from 'fflate';
import { materializeSkillReferences } from '../scripts/materialize-skill-references.mjs';

async function fixture(t, file = 'notes/readme.md') {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'simplicity-support-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const assets = path.join(root, 'assets'), source = path.join(root, 'public');
  for (const dir of ['data/pages', 'metadata/skills', 'skills']) await fs.mkdir(path.join(assets, dir), { recursive: true });
  await fs.writeFile(path.join(assets, 'data/blocks.json'), JSON.stringify({ blocks: [{ slug: 'sample' }] }));
  await fs.writeFile(path.join(assets, 'data/pages/sample.json'), JSON.stringify({ files: [file] }));
  await fs.writeFile(path.join(assets, 'metadata/skills/sample.json'), '{}');
  await fs.writeFile(path.join(assets, 'skills/sample.html'), `<a href="/skills/sample/${file}">Read</a>`);
  const archive = zipSync({ [`sample/${file}`]: strToU8('exact verified bytes\n') });
  await fs.writeFile(path.join(assets, 'skills/sample.zip'), archive);
  return { root, assets, source, archive };
}
test('copies only exact referenced archive bytes and retains the archive', async t => {
  const f = await fixture(t), result = await materializeSkillReferences(f.assets, f.source);
  assert.equal(result.count, 1);
  assert.equal(result.mapping['skills/sample/notes/readme.md'].entry, 'sample/notes/readme.md');
  assert.equal(await fs.readFile(path.join(f.source, 'skills/sample/notes/readme.md'), 'utf8'), 'exact verified bytes\n');
  assert.deepEqual(await fs.readFile(path.join(f.assets, 'skills/sample.zip')), Buffer.from(f.archive));
});
test('active supporting documents stay inside the archive', async t => {
  const f = await fixture(t, 'preview.svg');
  await assert.rejects(materializeSkillReferences(f.assets, f.source), /Active supporting documents/);
});
test('missing exact ZIP entries fail instead of inventing output', async t => {
  const f = await fixture(t);
  await fs.writeFile(path.join(f.assets, 'skills/sample.zip'), zipSync({ 'sample/other.md': strToU8('other') }));
  await assert.rejects(materializeSkillReferences(f.assets, f.source), /absent from the exact verified ZIP/);
});
test('selected ZIP symlinks are rejected before decompression', async t => {
  const f = await fixture(t), bytes = Buffer.from(f.archive);
  const central = bytes.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  assert(central >= 0);
  bytes.writeUInt32LE((0o120777 << 16) >>> 0, central + 38);
  await fs.writeFile(path.join(f.assets, 'skills/sample.zip'), bytes);
  await assert.rejects(materializeSkillReferences(f.assets, f.source), /not a regular file/);
});
