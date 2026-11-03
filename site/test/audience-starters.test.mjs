import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AUDIENCE_STARTERS, STARTER_PATHS, isAudienceStarter, starterFor } from '../src/lib/audience-starters.ts';

test('exactly five audience paths contain complete, published packs, Tested only when the page has its input/output section', () => {
  const cat = JSON.parse(fs.readFileSync('public/data/blocks.json', 'utf8'));
  const bySlug = new Map(cat.blocks.map(b => [b.slug, b]));
  assert.deepEqual(AUDIENCE_STARTERS.map(a => [a.id, a.name]), [['small-business', 'Small businesses'], ['students', 'Students'], ['professionals', 'Professionals'], ['startups', 'Startups'], ['enterprise', 'Enterprise']]);
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
    assert.equal(!!b?.tested, !!JSON.parse(fs.readFileSync(`public/data/pages/${slug}.json`, 'utf8')).output_sample, slug);
    assert.ok(fs.existsSync(`public/skills/${slug}.zip`), `${slug}: missing complete download`);
    const page = JSON.parse(fs.readFileSync(`public/data/pages/${slug}.json`, 'utf8'));
    assert.ok(page.source?.commit && page.source?.licence, `${slug}: missing provenance`);
    assert.ok(page.files.some(f => /LICENSE$/.test(f)), `${slug}: missing license`);
  }
});

test('old audience and task links resolve to one of the five current audiences', () => {
  for (const [old, current] of [['workers', 'professionals'], ['small-businesses', 'small-business'], ['presentations', 'professionals'], ['case-competitions', 'students'], ['research-documents', 'students'], ['equity-research', 'professionals']]) {
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

test('the small business path is for owners and is offered on the home page without More filters', () => {
  const owner = starterFor('small-business');
  assert.equal(owner?.name, 'Small businesses');
  assert.equal(owner.slugs.length, 8);
  for (const slug of ['customer-review-reply-writer', 'invoice-maker', 'cash-forecast-builder']) assert.ok(isAudienceStarter(slug, 'small-business'), slug);
  const home = fs.readFileSync('src/HomePage.tsx', 'utf8');
  const visible = home.indexOf('data-testid="starter-small-business"'), more = home.indexOf('id="library-more-filters"');
  assert.ok(visible > 0 && visible < more, 'the owner path sits outside the More filters group');
});
