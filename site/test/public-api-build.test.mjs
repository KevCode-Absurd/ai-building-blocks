import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { zipSync, strToU8 } from 'fflate';
import { buildPublicApiManifest } from '../scripts/build-public-api.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function fixture(run) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-blocks-api-manifest-'));
  const write = (name, value) => { const file = path.join(directory, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
  try { return run({ directory, write }); }
  finally {
    const resolved = path.resolve(directory), expectedParent = path.resolve(os.tmpdir());
    assert.equal(path.dirname(resolved), expectedParent); assert.ok(path.basename(resolved).startsWith('ai-blocks-api-manifest-'));
    fs.rmSync(resolved, { recursive: true });
  }
}

test('API manifest hashes only published content, preserves exact bytes and invalidates revision on metadata or reference changes', () => fixture(({ directory, write }) => {
  const block = { slug: 'write-report', name: 'Write a report', hasFiles: true };
  const catalogue = () => write('data/blocks.json', JSON.stringify({ blocks: [block] })); catalogue();
  const instructions = '# Report\r\nRead [the guide](references/guide.md).\r\n';
  write('skills/write-report/SKILL.md', instructions);
  write('data/pages/write-report.json', JSON.stringify({ source: { by: 'Original author', licence: 'MIT' } }));
  const archive = guide => write('skills/write-report.zip', zipSync({ 'write-report/SKILL.md': strToU8(instructions.replaceAll('\r\n', '\n')), 'write-report/references/guide.md': strToU8(guide) })); archive('Use the evidence.');
  write('skills/unpublished/SKILL.md', 'Not in the published catalogue.');
  const first = buildPublicApiManifest(directory), entry = first.resources['write-report'];
  assert.deepEqual(Object.keys(first.resources), ['write-report']);
  assert.equal(entry.instruction.sha256, hash(instructions));
  assert.equal(entry.files.find(f => f.path.endsWith('/guide.md')).sha256, hash('Use the evidence.'));
  assert.equal(entry.reference_validation.status, 'PASS');
  assert.equal(entry.page.sha256, hash(fs.readFileSync(path.join(directory, 'data/pages/write-report.json'))));
  archive('Use current evidence.');
  const second = buildPublicApiManifest(directory); assert.notEqual(second.resources['write-report'].revision_sha256, entry.revision_sha256);
  block.name = 'Write a checked report'; catalogue();
  assert.notEqual(buildPublicApiManifest(directory).resources['write-report'].revision_sha256, second.resources['write-report'].revision_sha256);
}));

test('manifest withholds unsafe or missing packages, and blocks unresolved concrete references without certifying semantics', () => fixture(({ directory, write }) => {
  write('data/blocks.json', JSON.stringify({ blocks: [{ slug: 'unsafe', hasFiles: true }, { slug: 'missing' }, { slug: 'broken-reference' }] }));
  write('skills/unsafe/SKILL.md', '# Instructions');
  write('skills/unsafe.zip', zipSync({ 'unsafe/../escape.md': strToU8('No.') }));
  write('skills/broken-reference/SKILL.md', 'Read [required file](references/missing.md).');
  const manifest = buildPublicApiManifest(directory);
  assert.deepEqual(manifest.unavailable.map(x => x.slug), ['unsafe', 'missing']);
  assert.equal(manifest.resources['broken-reference'].reference_validation.status, 'BLOCKED');
  assert.equal(manifest.resources.unsafe, undefined);
}));
