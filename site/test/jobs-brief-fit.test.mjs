// The job brief fits the job it is for. On 12 Nov 2026 a request for three Duolingo push lines got a stock-and-price
// check, required competitors, a question about where the copy appears, a "first-time site visitor" default, an
// order for about three candidates (against the Quality Engine's two drafts) and a warning against lists of three.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { prepareJobContext, GJP_STEPS, requestedCount } from '../src/jobs/grounding.mjs';
import { intakeQuestions } from '../src/jobs/intake-questions.mjs';
import { qualityEngineContext } from '../src/jobs/quality-engine.mjs';

const PUSH = "Write 3 push notification lines for Duolingo's new math streak feature, aimed at adults who lapsed for a week.";

test('short non-selling copy gets no stock check, no required competitors and no three-candidate reference', () => {
  const { brief, annex } = prepareJobContext({ request: PUSH, deliverable_kind: 'copy', site_url: 'https://www.duolingo.com' });
  assert.equal(annex.quality_engine.family, 'notification-copy');
  assert.equal(annex.quality_engine.depth, 'light');
  assert.equal(annex.buyer_can_act, null);
  assert.doesNotMatch(brief, /in stock/);
  assert.equal(annex.context_requirements.find(row => row.id === 'competitors').required, false);
  assert.equal(annex.candidates.family_reference, undefined);
  assert.match(brief, /BUILD: reframe true facts/);
});

test('selling copy keeps the buyer-can-act check and the competitor references', () => {
  const { brief, annex } = prepareJobContext({ request: 'Write the product page copy for our new running shoe at $105', deliverable_kind: 'copy', site_url: 'https://www.allbirds.com' });
  assert.ok(annex.buyer_can_act);
  assert.match(brief, /in stock/);
  assert.equal(annex.context_requirements.find(row => row.id === 'competitors').required, true);
});

test('questions the request already answers are not asked again', () => {
  const ids = request => intakeQuestions({ deliverableKind: 'copy', request }).map(row => row.id);
  assert.deepEqual(ids(PUSH), ['proof', 'never_say']);
  assert.deepEqual(ids('Write new copy'), ['where_used', 'reader_action', 'proof']);
  const reader = intakeQuestions({ deliverableKind: 'copy', request: 'Write new copy' }).find(row => row.id === 'reader_action');
  assert.doesNotMatch(reader.default, /first-time visitor/);
});

test('mixed means a web page plus ads or emails, not a one-page brief or an emailed customer', async () => {
  const { isMixedRequest } = await import('../src/jobs/quality-engine.mjs');
  assert.equal(isMixedRequest('Build a landing page plus 3 Meta ads and a welcome email'), true);
  assert.equal(isMixedRequest('Write a page and 3 emails'), true);
  assert.equal(isMixedRequest('Write a one-page creative brief. Channels: app push, email, Instagram and in-store signage.'), false);
  assert.equal(isMixedRequest('A subscriber emailed us. She can pause from her account page. Write my email reply.'), false);
});

test('a requested count of three is the client\'s choice, not the rule-of-three habit', () => {
  assert.equal(requestedCount('Write 3 push notification lines'), 3);
  const ids = request => prepareJobContext({ request, deliverable_kind: 'copy' }).annex.defaults_to_avoid.map(row => row.id);
  assert.equal(ids(PUSH).includes('copy-rule-of-three'), false);
  assert.equal(ids('Write the homepage hero copy').includes('copy-rule-of-three'), true);
});

test('drafts follow the Quality Engine depth, and every depth lists the expert edge', () => {
  const diverge = GJP_STEPS.find(step => step.id === 'diverge').do;
  assert.doesNotMatch(diverge, /about 3 candidates/);
  assert.match(diverge, /annex\.quality_engine\.drafts/);
  assert.match(diverge, /expert edge/);
  const choice = qualityEngineContext(PUSH, 'copy').final_choice;
  assert.match(choice.tie, /^EXPERT_IF_VERIFIED_EDGE/);
  assert.match(choice.expert_edge, /edge items/);
  const method = fs.readFileSync(new URL('../../marketplace/packs/shared/tools/quality/QUALITY-ENGINE-v3.md', import.meta.url), 'utf8');
  assert.match(method, /\*\*Expert edge\.\*\*/);
  assert.match(method, /Ship the plain draft unchanged only when no edge item survives/);
});
