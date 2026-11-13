import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { qualityEngineContext } from '../src/jobs/quality-engine.mjs';
import { QUALITY_PROFILES } from '../src/jobs/quality-profiles.mjs';
import { prepareJobContext } from '../src/jobs/grounding.mjs';

test('short risky replies keep light drafting while retaining proof and delivery gates', () => {
  const q = qualityEngineContext('Write a short angry customer reply about a refund', 'copy');
  assert.equal(q.depth, 'light');
  assert.equal(q.family, 'review-replies');
  assert.deepEqual(q.drafts, ['expert', 'plain']);
  assert.ok(q.checks.includes('dated claim sources'));
  assert.match(q.precedence, /existing truth, access and delivery gates still apply/);
  assert.match(q.precedence, /same-context review is never independent/);
});

test('mixed deliverables get a lead; a reviewer alone does not create a writing team', () => {
  assert.equal(qualityEngineContext('Build a landing page and welcome emails').depth, 'team');
  assert.equal(qualityEngineContext('Write an expense policy and have legal review it').depth, 'standard');
  assert.equal(qualityEngineContext('Make three distinct concepts for paid social ads').depth, 'full');
  assert.equal(qualityEngineContext('Write a leadership update').family, 'investor-update');
  assert.equal(qualityEngineContext('Help organize a cupboard').family, '_any');
});

test('job context exposes the portable v3 method and its one check command without executing a model', () => {
  const context = prepareJobContext({request: 'Build a procurement landing page', deliverable_kind: 'web_page'});
  assert.equal(context.model_calls, 0);
  assert.equal(context.stored_by_service, false);
  assert.equal(context.annex.quality_engine.version, '3.4');
  assert.equal(context.annex.quality_engine.final_choice.material_usefulness_below_plain, 'VETO');
  assert.match(context.annex.quality_engine.final_choice.edit_base, /useful content of the fresh plain draft/);
  assert.equal(context.annex.quality_engine.family, 'landing-page');
  assert.match(context.annex.quality_engine.tool_urls['qe-check'], /\/tools\/quality\/qe-check\.cjs$/);
  assert.equal(context.annex.quality_engine.tool_urls.files.length, 8);
  for (const file of context.annex.quality_engine.tool_urls.files) assert.ok(fs.existsSync(new URL(`../../marketplace/packs/shared/tools/quality/${file}`, import.meta.url)), file);
  assert.match(context.brief, /annex.quality_engine/);
  assert.equal(context.annex.quality_engine.profile.ceiling, QUALITY_PROFILES['landing-page'].ceiling);
  assert.ok(context.annex.production_gate.requires.brand_dna);
});

test('qe-check exits 2 on a usage error, its own or a check script\'s, and never reports one as a failed check', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qe-check-')), at = name => path.join(dir, name);
  fs.writeFileSync(at('final.md'), 'Your order ships today. Reply to this email if anything is wrong.\n');
  fs.writeFileSync(at('bad.json'), '{not json');
  const script = fileURLToPath(new URL('../../marketplace/packs/shared/tools/quality/qe-check.cjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [script, at('final.md'), ...args], { encoding: 'utf8', timeout: 60000 });
  try {
    for (const args of [['--audience'], ['--audience', 'nobody'], ['--contract', at('missing.json')], ['--max-words='], ['--online=yes']]) assert.equal(run(...args).status, 2, args.join(' '));
    const broken = run('--contract', at('bad.json'));
    assert.equal(broken.status, 2); assert.doesNotMatch(broken.stdout, /1 failed/); assert.match(broken.stdout, /usage error in format/);
    const inline = run('--audience=consumer', '--max-words=60');
    assert.notEqual(inline.status, 2, inline.stdout + inline.stderr); assert.match(inline.stdout, /qe-check: /);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('transport profiles match the resources carried in downloadable packs', () => {
  const file = new URL('../../marketplace/packs/shared/tools/quality/profiles.json', import.meta.url);
  assert.deepEqual(QUALITY_PROFILES, JSON.parse(fs.readFileSync(file, 'utf8')));
  for (const [family, profile] of Object.entries(QUALITY_PROFILES)) {
    assert.ok(profile.aim > 0 && profile.ceiling >= profile.aim, family);
    assert.ok(fs.existsSync(new URL(`../../marketplace/packs/shared/tools/quality/cards/${family}.md`, import.meta.url)), family);
  }
});
