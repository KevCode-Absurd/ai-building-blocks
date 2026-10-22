import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionsFor, plannerPrompt } from '../src/lib/composer-core.ts';
test('workflow questions reuse supplied context and respect explicit choices', () => {
  assert(questionsFor('Build a landing page').includes('delivery'));
  assert.deepEqual(questionsFor('Build a landing page', {}, 'Create from scratch in React with an original design.'), []);
  assert.deepEqual(questionsFor('Build a landing page', { mode: 'existing', reference: 'reference', delivery: 'code' }), []);
});
test('planner checks supplied context before intake and never claims access to other sessions', () => {
  const prompt = plannerPrompt('Build a landing page', 'An approved brand brain is supplied.', {}, []);
  assert.match(prompt.system, /Reuse confirmed context/);
  assert.match(prompt.system, /Do not claim access to another/);
  assert.match(prompt.user, /approved brand brain/);
});
