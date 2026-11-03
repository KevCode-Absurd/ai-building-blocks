import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { zipSync, strToU8 } from 'fflate';
import { buildPublicApiManifest, changedFiles, contentRevision } from '../scripts/build-public-api.mjs';

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

test('API manifest hashes only published content, preserves exact bytes and moves the revision only when instructions or files change', () => fixture(({ directory, write }) => {
  const block = { slug: 'write-report', name: 'Write a report', hasFiles: true };
  const catalogue = () => write('data/blocks.json', JSON.stringify({ blocks: [block] })); catalogue();
  const instructions = '# Report\r\nRead [the guide](references/guide.md).\r\n';
  write('skills/write-report/SKILL.md', instructions);
  write('data/pages/write-report.json', JSON.stringify({ source: { by: 'Original author', licence: 'MIT' } }));
  const archive = guide => write('skills/write-report.zip', zipSync({ 'write-report/SKILL.md': strToU8(instructions.replaceAll('\r\n', '\n')), 'write-report/references/guide.md': strToU8(guide) })); archive('Use the evidence.');
  write('skills/unpublished/SKILL.md', 'Not in the published catalogue.');
  const build = (previous, today = '2026-11-03') => buildPublicApiManifest(directory, { previous, today, catalogueRoot: null });
  const first = build(), entry = first.resources['write-report'];
  assert.deepEqual(Object.keys(first.resources), ['write-report']);
  assert.equal(entry.instruction.sha256, hash(instructions));
  assert.equal(entry.files.find(f => f.path.endsWith('/guide.md')).sha256, hash('Use the evidence.'));
  assert.equal(entry.reference_validation.status, 'PASS');
  assert.equal(entry.page.sha256, hash(fs.readFileSync(path.join(directory, 'data/pages/write-report.json'))));
  assert.equal(entry.revision_sha256, contentRevision(entry));
  assert.equal(entry.history, undefined);
  // A rebuild, a new name or other catalogue metadata, or new page text, leaves the revision alone.
  assert.equal(build(first).resources['write-report'].revision_sha256, entry.revision_sha256);
  block.name = 'Write a checked report'; block.cues = ['new test words']; catalogue();
  write('data/pages/write-report.json', JSON.stringify({ added: '2026-11-02', source: { by: 'Original author', licence: 'MIT' } }));
  const renamed = build(first).resources['write-report'];
  assert.equal(renamed.revision_sha256, entry.revision_sha256);
  assert.equal(renamed.history, undefined);
  // A changed packaged file moves it, and the history says what changed and when.
  archive('Use current evidence.');
  const second = build({ ...first, resources: { 'write-report': { ...entry, updated: '2026-11-02' } } }, '2026-11-04'), changed = second.resources['write-report'];
  assert.notEqual(changed.revision_sha256, entry.revision_sha256);
  assert.deepEqual(changed.history, [{ revision_sha256: entry.revision_sha256, replaced: '2026-11-04', changed: ['references/guide.md'] }]);
  assert.equal(changed.updated, '2026-11-04', 'served bytes changed with no newer source date, so the build day');
  assert.deepEqual(changedFiles(entry, changed), ['references/guide.md']);
  // History carries forward; a revision id under the old formula with the same files records no change.
  const third = build(second).resources['write-report'];
  assert.deepEqual(third.history, changed.history);
  const legacy = build({ ...second, resources: { 'write-report': { ...changed, revision_sha256: 'f'.repeat(64) } } }).resources['write-report'];
  assert.deepEqual(legacy.history[0], { revision_sha256: 'f'.repeat(64), replaced: '2026-11-03', changed: [] });
}));

test('updated is the day SKILL.md or a packaged file last changed, not the day the page or item.yaml changed', () => fixture(({ directory, write }) => {
  write('public/data/blocks.json', JSON.stringify({ blocks: [{ slug: 'dated' }] }));
  write('public/skills/dated/SKILL.md', '# Dated');
  write('public/data/pages/dated.json', JSON.stringify({ added: '2026-10-28' }));
  write('catalogue-items/general/dated/SKILL.md', '# Dated');
  write('catalogue-items/general/dated/page.yaml', 'headline: Newer page text');
  const old = new Date('2026-10-01T12:00:00Z'), page = new Date('2026-10-28T12:00:00Z');
  fs.utimesSync(path.join(directory, 'catalogue-items/general/dated/SKILL.md'), old, old);
  fs.utimesSync(path.join(directory, 'catalogue-items/general/dated/page.yaml'), page, page);
  const manifest = buildPublicApiManifest(path.join(directory, 'public'), { today: '2026-11-03', catalogueRoot: path.join(directory, 'catalogue-items') });
  assert.equal(manifest.resources.dated.updated, '2026-10-01');
  // Without the source, the page's Updated day is the fallback.
  assert.equal(buildPublicApiManifest(path.join(directory, 'public'), { catalogueRoot: null }).resources.dated.updated, '2026-10-28');
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
