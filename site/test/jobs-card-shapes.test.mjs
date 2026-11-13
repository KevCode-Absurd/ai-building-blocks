// The card names the deliverable, so it decides the questions, tests, gates and grounding where the kind's defaults
// were written for another case (13 Nov 2026: a one-off support reply was asked who joins the email list, checked for
// merge tags and an exit rule, and told to capture the brand's site and write a taste brief).
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareJobContext, resolveDeliverableKind, resolveMode, cardGates, suggestDeliverableKind } from '../src/jobs/grounding.mjs';
import { cardShape, cardQuestions, shortWordLimit, CARD_SHAPES } from '../src/jobs/card-shapes.mjs';
import { qualityEngineContext } from '../src/jobs/quality-engine.mjs';
import { routeJob } from '../src/jobs/router.mjs';
import { callJobTool } from '../src/jobs/job-mcp.mjs';

const REPLY = "I work on customer experience at Acme Pet (acmepet.com). A customer emailed us: her order of cat food arrived with a torn bag. Please write my email reply, under 150 words. For this exercise, our policy is a free replacement with no return needed. Warm, direct.";
const BRIEF = 'I lead brand at Acme Pet (acmepet.com). Write a one-page creative brief for our agency for a spring launch. Channels: app push, email, Instagram and in-store signage.';
const COLD = 'I sell for Acme Pet (acmepet.com). Write a first-touch email to a pet store owner I met at a trade show, asking for a 15-minute call. Under 120 words.';
const MEMO = 'I am on the finance team at Acme Pet. Write a decision memo on whether to move to annual billing. For this exercise, monthly churn is 4% and annual plans cost 20% less.';

test('a one-off reply gets reply questions, reply tests and reply format checks, not an email series', () => {
  const { annex } = prepareJobContext({ request: REPLY });
  assert.equal(annex.quality_engine.family, 'support-macros');
  assert.equal(annex.deliverable_kind, 'email');
  // The request answers the order facts, the policy and the channel, so nothing is asked.
  assert.deepEqual(annex.questions, []);
  assert.doesNotMatch(JSON.stringify(annex.questions), /sign-up|whole list|discount codes/);
  assert.match(annex.spec_sheet.acceptance_tests[0].test, /first line answer what the customer actually asked/);
  const format = annex.gates.find(g => g.id === 'format_complete').gate;
  assert.doesNotMatch(format, /merge tags|exit rule|one product and one ask/); assert.match(format, /one next step with who acts and when/);
  assert.equal(annex.gates.some(g => g.id === 'buyer_can_act'), false);
  assert.equal(annex.gates.some(g => g.id === 'proven_levers_checked'), false);
  assert.doesNotMatch(annex.craft_rubric[0].test, /email series/);
  assert.equal(annex.quality_engine.depth, 'light');
  assert.equal(annex.mode_default.mode, 'new');
  assert.match(annex.quality_engine.scope_note, /One reply to one customer/);
  assert.doesNotMatch(annex.candidates.family_reference ?? '', /series arcs/);
});

test('a reply rests on the request facts: no site capture, screenshots, competitors or taste brief', () => {
  const { brief, annex } = prepareJobContext({ request: REPLY, site_url: 'https://acmepet.com' });
  assert.match(brief, /No site capture, screenshots or taste brief/); assert.doesNotMatch(brief, /brand-dna\.json|taste-brief/);
  assert.deepEqual(annex.production_gate.requires, { brand_dna: false, data_snapshot: false, taste_brief: false });
  assert.equal(annex.capture, null); assert.equal(annex.taste_brief, null);
  assert.deepEqual(annex.context_requirements.map(r => r.id), ['request_facts', 'public_facts']);
  assert.equal(annex.brand_context.level, 'facts');
});

test('customer copy in a channel keeps its voice lines, still without a look capture', () => {
  const { annex } = prepareJobContext({ request: 'Write 6 push notifications for Acme Pet app users who have not opened the app in 14 days.' });
  assert.equal(annex.quality_engine.family, 'notification-copy');
  assert.equal(annex.brand_context.level, 'voice');
  assert.ok(annex.context_requirements.some(r => r.id === 'voice_lines' && r.required));
  assert.equal(annex.production_gate.requires.brand_dna, false);
});

test('a creative brief that lists channels is one document for one lead, not email work or a team job', () => {
  assert.equal(resolveDeliverableKind(undefined, BRIEF).kind, 'plan');
  assert.equal(resolveDeliverableKind('email', BRIEF).kind, 'email', 'a declared kind always wins');
  assert.equal(routeJob({ request: BRIEF }, {}).mode, 'single');
  const { annex } = prepareJobContext({ request: BRIEF });
  assert.equal(annex.quality_engine.depth, 'standard');
  assert.ok(annex.questions.every(q => !/email/i.test(q.question)));
  assert.match(annex.gates.find(g => g.id === 'format_complete').gate, /single-minded message/);
  // A real page with ads is still mixed work for a team.
  assert.equal(routeJob({ request: 'Build a landing page and 6 Meta ads for our spring launch' }, {}).mode, 'team');
});

test('a first-touch email is one email with one ask; asking for a sequence keeps the sequence shape', () => {
  const one = cardShape('outbound-sales', COLD), many = cardShape('outbound-sales', 'Write a 4-touch cold outbound sequence to pet store owners.');
  assert.match(one.scope_note, /One first-touch email/); assert.equal(one.light, true);
  assert.equal(many.scope_note, undefined); assert.match(many.complete.join(' '), /each touch adds something new/);
  const { annex } = prepareJobContext({ request: COLD });
  assert.equal(annex.quality_engine.depth, 'light'); assert.equal(annex.mode_default.mode, 'new');
});

test('a support staffing plan is a plan: the reply and macro shapes stay out of it', () => {
  assert.equal(cardShape('support-macros', 'Write our holiday support staffing plan for the backlog.'), null);
});

test('a memo with given numbers needs no data snapshot and gets memo tests', () => {
  const { annex } = prepareJobContext({ request: MEMO });
  assert.equal(annex.quality_engine.family, 'analysis-memo');
  assert.equal(annex.production_gate.requires.data_snapshot, false);
  assert.match(annex.spec_sheet.acceptance_tests[0].test, /recommendation and how sure/);
  assert.ok(!annex.questions.some(q => q.id === 'data'), 'the request already gives its numbers');
});

test('"investor update" and "incident update" are things to write, not requests to patch something', () => {
  assert.equal(resolveMode({ request: 'Write our Q3 investor update from these numbers.', kind: 'copy' }).mode, 'new');
  assert.equal(resolveMode({ request: 'Update the hero section of our home page.', kind: 'web_page' }).mode, 'patch');
});

test('questions the request answers are dropped; at most three are asked', () => {
  const shape = cardShape('crisis-response', 'Write a statement about the outage.');
  assert.ok(cardQuestions(shape, 'Write a statement about the outage. Affected customers first by email. Legal approves it.').length < shape.questions.length);
  for (const [card, value] of Object.entries(CARD_SHAPES)) for (const v of [value, ...(value.variants ?? [])]) assert.ok(!v.questions || v.questions.length <= 3, card);
  assert.equal(cardQuestions(null, 'x'), null);
});

test('light depth reads the ask, so a policy mentioned later does not make a short reply a policy document', () => {
  assert.equal(qualityEngineContext(REPLY).depth, 'light');
  assert.equal(qualityEngineContext('Write our refund policy for agents, with exception rules.').depth === 'light', false);
  assert.equal(shortWordLimit('Keep it under 180 words.'), true); assert.equal(shortWordLimit('Under 900 words.'), false);
});

test('the buyer gate stays for work that sells, and goes for cards that sell nothing', () => {
  assert.ok(cardGates('email', { selling: true }).some(g => g.id === 'buyer_can_act'));
  assert.ok(!cardGates('email', { selling: false }).some(g => g.id === 'buyer_can_act'));
  const welcome = prepareJobContext({ request: 'Write a 3-email welcome series for new subscribers to Acme Pet.' }).annex;
  assert.ok(welcome.gates.some(g => g.id === 'buyer_can_act')); assert.match(welcome.gates.find(g => g.id === 'format_complete').gate, /merge tags/);
});

test('start_job with from_context sends no second copy of the brief, questions or rubric', async () => {
  const full = await callJobTool('start_job', { request: REPLY });
  const lean = await callJobTool('start_job', { request: REPLY, from_context: true });
  assert.ok(full.brief && full.rubric && full.next_action.context);
  assert.equal(lean.brief, undefined); assert.equal(lean.rubric, undefined); assert.equal(lean.next_action.context, undefined);
  assert.match(lean.from_context, /annex\.craft_rubric/);
  assert.ok(JSON.stringify(lean).length < JSON.stringify(full).length / 2);
  // The single-lead rubric is the card-fit one.
  assert.ok(!full.rubric.gates.some(g => g.id === 'buyer_can_act'));
});

// 13 Nov 2026: common deliverables got the wrong kind and so the wrong questions and checks.
test('the document a request names decides its kind: an SOP is not code, a product description is not an ops doc', () => {
  assert.equal(suggestDeliverableKind('Write the store SOP for processing phone trade-ins in the app.').kind, 'ops_doc');
  assert.equal(suggestDeliverableKind('Write the product detail page description for our new glasses.').kind, 'copy');
  assert.equal(suggestDeliverableKind('Write the all-hands announcement of our new travel policy.').kind, 'copy');
  assert.equal(suggestDeliverableKind('Build a vendor scorecard to compare three endpoint security tools.').kind, 'plan');
  assert.equal(suggestDeliverableKind('Write the hiring scorecard for a senior designer.').kind === 'plan', false);
  assert.equal(suggestDeliverableKind('Write a 60-second host-read ad script, with a spot for the promo code.').kind, 'copy');
  assert.equal(['ops_doc', 'copy'].includes(resolveDeliverableKind(undefined, 'Write our answer to section 4 of the RFP on data migration.').kind), true);
  assert.equal(resolveDeliverableKind(undefined, 'Write a localisation brief for translating our templates into Japanese.').kind, 'ops_doc');
});

test('a press pitch is one short email to a reporter: pitch tests, no buyer gate or email-series checks', () => {
  const { annex } = prepareJobContext({ request: 'I run PR at Acme Pet. Write a pitch email to a pets reporter at a national paper about our new adoption data, under 200 words.' });
  assert.equal(annex.quality_engine.family, 'press-pitch');
  assert.equal(annex.deliverable_kind, 'email'); assert.equal(annex.quality_engine.depth, 'light');
  assert.match(annex.spec_sheet.acceptance_tests[0].test, /subject line state the story/);
  assert.doesNotMatch(annex.gates.find(g => g.id === 'format_complete').gate, /merge tags|exit rule/);
  assert.equal(annex.gates.some(g => g.id === 'buyer_can_act'), false);
  assert.equal(annex.mode_default.mode, 'new');
});

test('a product description sells: it keeps the buyer gate and copy levers, with no look capture', () => {
  const { annex } = prepareJobContext({ request: 'Write product descriptions for the Acme Pet linen dog bed in four colours, for our Shopify store.' });
  assert.equal(annex.quality_engine.family, 'product-description'); assert.equal(annex.deliverable_kind, 'copy');
  assert.ok(annex.gates.some(g => g.id === 'buyer_can_act')); assert.ok(annex.gates.some(g => g.id === 'proven_levers_checked'));
  assert.match(annex.gates.find(g => g.id === 'format_complete').gate, /lead benefit first/);
  assert.equal(annex.production_gate.requires.brand_dna, false); assert.equal(annex.brand_context.level, 'voice');
});

test('an internal announcement and a policy get their own questions and tests, not help-doc or code defaults', () => {
  const note = prepareJobContext({ request: 'I am in people ops at Acme Pet. Write the all-hands announcement of our new travel policy: what changes on 1 January and who to ask.' }).annex;
  assert.equal(note.quality_engine.family, 'internal-announcement'); assert.equal(note.deliverable_kind, 'copy');
  assert.match(note.spec_sheet.acceptance_tests[0].test, /what changes and when/);
  assert.ok(!note.questions.some(q => q.id === 'change'), 'the request already says what changes and when');
  assert.equal(note.gates.some(g => g.id === 'buyer_can_act'), false);
  const policy = prepareJobContext({ request: 'Draft a policy on staff using personal phones on the Acme Pet shop floor, with the exceptions.' }).annex;
  assert.equal(policy.quality_engine.family, 'policy-doc'); assert.equal(policy.deliverable_kind, 'ops_doc');
  assert.match(policy.spec_sheet.acceptance_tests[0].test, /condition and an action/);
  assert.equal(policy.mode_default.mode, 'new');
});

test('an RFP answer keeps the question numbers and evidence; the section it names is not asked again', () => {
  const { annex } = prepareJobContext({ request: 'Write our answer to section 4 of a university RFP: how we handle data migration from their old CRM, in about 400 words.' });
  assert.equal(annex.quality_engine.family, 'rfp-response');
  assert.ok(!annex.questions.some(q => q.id === 'questions'));
  assert.match(annex.gates.find(g => g.id === 'format_complete').gate, /question's number and wording kept/);
  assert.equal(annex.gates.some(g => g.id === 'proven_levers_checked'), false);
});

test('a status-page update is a short crisis piece; a crisis statement keeps the full shape', () => {
  const status = cardShape('crisis-response', 'Write the status page update for this morning\'s checkout outage.');
  assert.equal(status.light, true); assert.match(status.scope_note, /One status-page update/);
  assert.equal(qualityEngineContext('Write the status page update for this morning\'s checkout outage. We are still investigating.').depth, 'light');
  const statement = cardShape('crisis-response', 'Write our holding statement about the data breach.');
  assert.equal(statement.light, undefined); assert.equal(statement.scope_note, undefined);
  assert.equal(routeJob({ request: 'Write a vendor scorecard comparing three payroll providers, with email support and an API.' }, {}).mode, 'single');
});
