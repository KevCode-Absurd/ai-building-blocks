// Intake questions fit the job: up to three, each with a default, none that the request already answers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { intakeQuestions, INTAKE_KINDS, INTAKE_ASK, MAX_INTAKE_QUESTIONS } from '../src/jobs/intake-questions.mjs';
import { DELIVERABLE_KINDS, familyOf } from '../src/jobs/grounding.mjs';

const ids = (deliverableKind, request = '') => intakeQuestions({ deliverableKind, request }).map(q => q.id);
const words = text => (text.match(/\S+/g) ?? []).length;

test('every deliverable kind gets up to three plain questions, each with a stated default', () => {
  assert.equal(MAX_INTAKE_QUESTIONS, 3);
  for (const kind of DELIVERABLE_KINDS) {
    const questions = intakeQuestions({ deliverableKind: kind });
    assert.ok(questions.length >= 3 && questions.length <= MAX_INTAKE_QUESTIONS, kind);
    assert.equal(new Set(questions.map(q => q.id)).size, questions.length, kind);
    for (const q of questions) {
      assert.deepEqual(Object.keys(q), ['id', 'question', 'default'], kind);
      assert.match(q.question, /\?/, q.id); assert.ok(q.default.length > 10, q.id);
      // Short sentences in plain words, and never a price or a "you decide" dead end.
      for (const sentence of `${q.question} ${q.default}`.split(/(?<=[.?])\s+/)) assert.ok(words(sentence) <= 25, `${kind}.${q.id}: ${sentence}`);
      assert.doesNotMatch(`${q.question} ${q.default}`, /brand brain|taste|\$\d/i, q.id);
    }
  }
  assert.ok(INTAKE_KINDS.includes('web_page')); assert.match(INTAKE_ASK, /one short message/); assert.match(INTAKE_ASK, /you decide/);
});

test('the questions are chosen for the job type', () => {
  assert.deepEqual(ids('ad_creative'), ['offer', 'audience', 'placements']);
  assert.deepEqual(ids('web_page'), ['traffic_source', 'one_action', 'proof']);
  assert.deepEqual(ids('email'), ['list_trigger', 'offer_rules', 'reader_action']);
  assert.deepEqual(ids('audit'), ['goal_metric', 'access', 'changed']);
  // Ads and pages no longer share one fixed set.
  assert.notDeepEqual(ids('ad_creative'), ids('web_page'));
  // A plan is asked what a strategy is asked; an unknown kind falls back to its family, then to the general set.
  assert.deepEqual(ids('plan'), ids('strategy'));
  assert.deepEqual(intakeQuestions({ family: 'audit_analysis' }), intakeQuestions({ deliverableKind: 'audit' }));
  assert.deepEqual(intakeQuestions({ deliverableKind: 'landing', family: familyOf('email') }), intakeQuestions({ deliverableKind: 'copy' }));
  assert.deepEqual(intakeQuestions().map(q => q.id), ['result', 'use', 'keep']);
});

test('a question the request already answers is not asked again', () => {
  // The traffic source is in the request, so the next question takes its place.
  assert.deepEqual(ids('web_page', 'Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to'), ['one_action', 'proof', 'offer']);
  assert.deepEqual(ids('web_page', 'Build a sign-up page for our newsletter'), ['traffic_source', 'proof', 'offer']);
  assert.deepEqual(ids('ad_creative', 'Make 6 ads for our 20% off sale, 9:16 for stories'), ['audience', 'tried']);
  assert.deepEqual(ids('ad_creative', 'Give me 5 Meta ad concepts for our running shoe'), ['offer', 'audience', 'placements']);
  assert.deepEqual(ids('email', 'Write a 3-email welcome series'), ['offer_rules', 'reader_action', 'sender']);
  assert.deepEqual(ids('audit', 'Audit our pricing page'), ['goal_metric', 'access', 'changed']);
  assert.deepEqual(ids('audit', 'Audit why our conversion rate fell; you can use GA4'), ['changed', 'use']);
  // A team that is only mentioned does not count as a named audience.
  assert.ok(ids('email', 'Write an onboarding email for our sales team').includes('offer_rules'));
});
