import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { zipSync, unzipSync } from 'fflate';
import { publishedSourceBytes } from '../scripts/lib/published-source-bytes.mjs';
import { buildPublicApiManifest } from '../scripts/build-public-api.mjs';
import { nextVersion } from '../src/roles/role-versions.mjs';

test('LF and CRLF source checkouts export identical served/ZIP bytes, revisions and role versions', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'published-source-bytes-'));
  const source = { 'SKILL.md': '# Example\nRead [guide](references/guide.md).\n', 'references/guide.md': '# Guide\nUse evidence.\n', 'LICENSE': 'Copyright owner\nMIT\n', 'scripts/check.mjs': 'const message = "test";\nconsole.log(message);\n' };
  const snapshots = [];
  try {
    for (const style of ['lf', 'crlf']) {
      const out = path.join(root, style); fs.mkdirSync(path.join(out, 'data'), { recursive: true }); fs.mkdirSync(path.join(out, 'skills/example'), { recursive: true });
      const original = Object.fromEntries(Object.entries(source).map(([p, text]) => [p, Buffer.from(style === 'crlf' ? text.replaceAll('\n', '\r\n') : text)]));
      const inputs = Object.fromEntries(Object.entries(original).map(([p, b]) => [p, Buffer.from(b)]));
      const tree = Object.fromEntries(Object.entries(inputs).map(([p, b]) => ['example/' + p, publishedSourceBytes(p, b)]));
      const zip = zipSync(tree, { level: 6, mtime: new Date('2020-01-01T00:00:00Z') });
      fs.writeFileSync(path.join(out, 'skills/example/SKILL.md'), tree['example/SKILL.md']);
      fs.writeFileSync(path.join(out, 'skills/example.zip'), zip);
      fs.writeFileSync(path.join(out, 'data/blocks.json'), JSON.stringify({ blocks: [{ slug: 'example', hasFiles: true }] }));
      const manifest = buildPublicApiManifest(out, { catalogueRoot: null, today: '2026-11-19' });
      assert.deepEqual(inputs, original, 'source bytes remain untouched');
      assert.deepEqual(Buffer.from(unzipSync(zip)['example/SKILL.md']), fs.readFileSync(path.join(out, 'skills/example/SKILL.md')));
      assert.equal(manifest.unavailable.length, 0);
      assert.equal(manifest.resources.example.reference_validation.status, 'PASS');
      snapshots.push({ zip: Buffer.from(zip), resource: manifest.resources.example });
    }
    assert.deepEqual(snapshots[0], snapshots[1]);
    const parts = { remit: 'scope', expertise: 'rules', checks: 'checks', example: 'example', methods: ['example@' + snapshots[0].resource.revision_sha256.slice(0, 12)] };
    const v = nextVersion(undefined, parts, '2026-11-19');
    assert.equal(nextVersion(v, { ...parts, methods: ['example@' + snapshots[1].resource.revision_sha256.slice(0, 12)] }, '2026-11-20'), v);
  } finally {
    assert.equal(path.dirname(root), fs.realpathSync(os.tmpdir())); assert.ok(path.basename(root).startsWith('published-source-bytes-'));
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('binary, unknown formats and invalid UTF-8 stay exact; UTF-8 BOM and textual content survive', () => {
  for (const [name, bytes] of [['asset.bin', Buffer.from('a\r\nb')], ['asset.png', Buffer.from([0, 13, 10, 255])], ['bad.md', Buffer.from([255, 13, 10])], ['utf16.txt', Buffer.from([65, 0, 13, 0, 10, 0])]]) assert.deepEqual(publishedSourceBytes(name, bytes), bytes);
  assert.deepEqual(publishedSourceBytes('guide.md', Buffer.from('\uFEFFé\r\n©\r')), Buffer.from('\uFEFFé\n©\n'));
});

test('both ordinary skills and minds use the same exported primary bytes for serving and ZIPs', () => {
  const script = fs.readFileSync(new URL('../scripts/build-index.mjs', import.meta.url), 'utf8');
  assert.equal((script.match(/const publishedSkill = publishedSourceBytes\('SKILL.md'/g) ?? []).length, 2);
  assert.equal((script.match(/"SKILL.md"\), publishedSkill\)/g) ?? []).length, 2);
  assert.equal((script.match(/\/SKILL.md`\]: publishedSkill/g) ?? []).length, 2);
  assert.equal((script.match(/publishedSourceBytes\(f, fs.readFileSync\(path.join\(folder, f\)\)\)/g) ?? []).length, 2);
});
