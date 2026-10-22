import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AUDIENCE_STARTERS, STARTER_PATHS, isAudienceStarter, starterFor } from '../src/lib/audience-starters.ts';

test('exactly four audience paths contain complete, published packs and no new tested claims', () => {
  const cat = JSON.parse(fs.readFileSync('public/data/blocks.json', 'utf8'));
  const bySlug = new Map(cat.blocks.map(b => [b.slug, b]));
  assert.deepEqual(AUDIENCE_STARTERS.map(a => [a.id, a.name]), [['students', 'Students'], ['professionals', 'Professionals'], ['startups', 'Startups'], ['enterprise', 'Enterprise']]);
  assert.equal(STARTER_PATHS, AUDIENCE_STARTERS);
  for (const audience of STARTER_PATHS) {
    assert.equal(new Set(audience.slugs).size, audience.slugs.length);
    for (const slug of audience.slugs) {
      assert.ok(bySlug.has(slug), `${audience.id}: missing ${slug}`);
      assert.ok(fs.statSync(`public/skills/${slug}/SKILL.md`).size > 20);
      assert.ok(isAudienceStarter(slug, audience.id));
    }
  }
  for (const slug of ['topic-learning-roadmap', 'study-understanding-check', 'research-paper-reading-guide', 'research-paper-evidence-review', 'research-literature-comparison', 'resume-job-application-builder', 'procurement-agent-architecture-plan', 'case-competition-slide-deck-builder', 'storyboard-to-powerpoint-deck-builder', 'equity-research-valuation-report-builder']) {
    const b = bySlug.get(slug);
    assert.equal(b?.tested, undefined, slug);
    assert.ok(fs.existsSync(`public/skills/${slug}.zip`), `${slug}: missing complete download`);
    const page = JSON.parse(fs.readFileSync(`public/data/pages/${slug}.json`, 'utf8'));
    assert.ok(page.source?.commit && page.source?.licence, `${slug}: missing provenance`);
    assert.ok(page.files.some(f => /LICENSE$/.test(f)), `${slug}: missing license`);
  }
});

test('old audience and task links resolve to one of the four current audiences', () => {
  for (const [old, current] of [['workers', 'professionals'], ['small-businesses', 'startups'], ['presentations', 'professionals'], ['case-competitions', 'students'], ['research-documents', 'students'], ['equity-research', 'professionals']]) {
    assert.equal(starterFor(old)?.id, current);
    assert.ok(isAudienceStarter(starterFor(current).slugs[0], old));
  }
});

test('invalid audience values cannot open the full library and blank values restore it', () => {
  assert.equal(starterFor('unknown'), undefined);
  assert.equal(isAudienceStarter('anything', 'unknown'), false);
  assert.equal(isAudienceStarter('anything', ''), true);
  assert.equal(isAudienceStarter('ad-claim-proof-gap-finder', 'students'), false);
});

test('the reusable intake asks for source dates, permissions and output checks', () => {
  const text = fs.readFileSync('public/templates/work-context.txt', 'utf8');
  for (const term of ['Source date and version', 'Permission to use', 'Deadline and timezone', 'A good result must', 'Course rules', 'does not itself authorize']) assert.ok(text.includes(term), term);
});
