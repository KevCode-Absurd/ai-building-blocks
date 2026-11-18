import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const script = new URL('../scripts/build-team-directory.mjs', import.meta.url);

function snapshot(root, relative = '') {
  return fs.readdirSync(path.join(root, relative), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const file = path.join(relative, entry.name);
      return entry.isDirectory() ? snapshot(root, file) : [[file, fs.readFileSync(path.join(root, file))]];
    });
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-team-build-'));
  t.after(() => {
    const target = path.resolve(root);
    assert.equal(path.dirname(target), path.resolve(os.tmpdir()));
    assert.ok(path.basename(target).startsWith('abb-team-build-'));
    fs.rmSync(target, { recursive: true, force: true });
  });
  const run = path.join(root, 'site/scripts/build-team-directory.mjs');
  const source = path.join(root, 'marketplace/src/modules/directory/data/team-org-chart.json');
  const profile = path.join(path.dirname(source), 'personas-ecommerce.json');
  const role = path.join(root, 'marketplace/packs/roles/example/TEAM.md');
  for (const f of [run, source, role]) fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.copyFileSync(script, run);
  fs.writeFileSync(profile, '[{"id":"example","team":{"families":["curated-only"]}}]\n');
  fs.writeFileSync(role, '# Curated role\nDo not regenerate during a site build.\n');
  return { root, run, source, profile, role, output: path.join(root, 'site/public/data/team-org-chart.json') };
}

test('site team build publishes exact curated bytes without rewriting marketplace inputs', t => {
  const f = fixture(t);
  const text = JSON.stringify({ schema: 'ai-blocks-org-chart/1', personas: [{ id: 'example', families: ['curated-only'] }], departments: [] }, null, 2) + '\n';
  fs.writeFileSync(f.source, text);
  const marketplace = path.join(f.root, 'marketplace');
  const before = snapshot(marketplace);
  execFileSync(process.execPath, [f.run], { stdio: 'pipe' });
  assert.deepEqual(fs.readFileSync(f.output), Buffer.from(text));
  assert.deepEqual(snapshot(marketplace), before);
  const timestamp = new Date('2026-01-01T00:00:00Z');
  fs.utimesSync(f.output, timestamp, timestamp);
  execFileSync(process.execPath, [f.run], { stdio: 'pipe' });
  assert.equal(fs.statSync(f.output).mtime.toISOString(), timestamp.toISOString());
  assert.deepEqual(snapshot(marketplace), before);
});

test('invalid curated directory stops before publication and leaves inputs intact', t => {
  const f = fixture(t);
  fs.writeFileSync(f.source, '{"schema":"unsupported","personas":[],"departments":[]}');
  const original = fs.readFileSync(f.source);
  assert.throws(() => execFileSync(process.execPath, [f.run], { stdio: 'pipe' }), /Command failed/);
  assert.equal(fs.existsSync(f.output), false);
  assert.deepEqual(fs.readFileSync(f.source), original);
});

test('ordinary site builds publish snapshots and leave source regeneration explicit', () => {
  const { scripts } = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.ok(scripts.index.split(' && ').includes('node scripts/build-team-directory.mjs'));
  for (const name of ['index', 'build', 'dev']) assert.doesNotMatch(scripts[name], /build-seat-briefs/);
  assert.equal(scripts['team:regenerate'], 'node ../marketplace/scripts/build-seat-briefs.mjs');
});
