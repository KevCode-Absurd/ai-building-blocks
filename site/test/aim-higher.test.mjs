import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AIM_QUESTIONS, AIM_SKILL, aimHigherPrompt, aimHigherText, hasAim } from '../src/lib/aim-higher.mjs';
import { outcomeMessage } from '../src/outcomes-site/owner-message.ts';
import { methodMarkdown, METHOD_VERSION } from '../src/outcomes/method.mjs';

test('Aim higher asks three short questions and adds only what was answered', () => {
  assert.deepEqual(AIM_QUESTIONS.map(q => q.id), ['next', 'proof', 'not']);
  assert.equal(aimHigherText({}), '');
  assert.equal(hasAim({ next: '   ' }), false);
  assert.equal(aimHigherText({ next: ' More   bookings ', not: 'No discounts' }), 'What should happen after: More bookings\nLeave out: No discounts');
  assert.ok(aimHigherText({ proof: 'x'.repeat(900) }).length < 340, 'answers are capped');
});

test('the better prompt keeps the request, uses the answers and stays better, not bigger', () => {
  const blank = aimHigherPrompt('Write a follow-up email to people who did not book');
  assert.match(blank, /"Write a follow-up email to people who did not book"/);
  assert.match(blank, /best guess so I can say yes or correct it/);
  assert.match(blank, /check, other than you or me/);
  assert.match(blank, /Never make it up/);
  assert.match(blank, /Do not add extra deliverables/);
  const answered = aimHigherPrompt('Write a follow-up email', { next: 'More bookings this month', proof: '5 replies from 50 emails' });
  assert.match(answered, /What should happen after: More bookings this month/);
  assert.match(answered, /Use my answer above\./);
  assert.match(answered, /Start from my answer above\./);
  assert.doesNotMatch(answered, /—/, 'no em dashes in copy');
});

test('the job message carries the answers and asks the AI to aim higher before it plans', () => {
  const message = outcomeMessage('Our ad costs keep going up', { proof: 'Cost per sale back under 20 pounds for 4 weeks' });
  assert.match(message, /How we will know it worked: Cost per sale back under 20 pounds for 4 weeks/);
  assert.match(message, /Aim higher before you plan/);
  assert.doesNotMatch(outcomeMessage('x'), /How we will know it worked/);
});

test('method v3 aims higher and credits the skill it comes from', () => {
  assert.equal(METHOD_VERSION, 3);
  const md = methodMarkdown();
  assert.match(md, /## 2\. Aim higher/);
  assert.match(md, /Better, not bigger/);
  assert.match(md, /Ambition raises the standard, not the permissions/);
  const item = fs.readFileSync(new URL('../../catalogue-items/imported/ambition-planner/item.yaml', import.meta.url), 'utf8');
  assert.match(item, new RegExp(`slug: ${AIM_SKILL.slug}`));
  assert.match(item, /licence: MIT/);
  assert.match(item, /Felix Rieseberg/);
});
