// The card names the deliverable, so it decides the questions, tests, gates and grounding where the kind's defaults
// were written for another case (13 Nov 2026: a one-off support reply was asked who joins the email list, checked for
// merge tags and an exit rule, and told to capture the brand's site and write a taste brief).
import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareJobContext, resolveDeliverableKind, resolveMode, cardGates, suggestDeliverableKind, specSheet, validateGrounding, jobFit } from '../src/jobs/grounding.mjs';
import { cardShape, cardQuestions, jobShape, shortWordLimit, CARD_SHAPES } from '../src/jobs/card-shapes.mjs';
import { qualityEngineContext } from '../src/jobs/quality-engine.mjs';
import { routeJob } from '../src/jobs/router.mjs';
import { callJobTool } from '../src/jobs/job-mcp.mjs';
import { startJob, advanceJob } from '../src/jobs/engine.mjs';
import { proposeTeam } from '../src/jobs/propose-team.mjs';
import { engineFixture } from './fixtures/jobs/engine-fixture.mjs';

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

// 13 Nov 2026 review of v3.4: a card's kind override turned audits, analyses, strategies and code into emails or copy.
test('a card corrects only a guessed writing kind; an audit, analysis, strategy or code request keeps its kind', () => {
  const keep = {
    'Audit our help desk replies from last month and tell us what is going wrong.': 'audit',
    'Analyze our Trustpilot reviews from the last quarter and tell us the top complaint themes.': 'analysis',
    'Build an outbound sales strategy for our B2B SaaS for next year.': 'strategy',
    'Analyze our cold email reply rates by industry.': 'analysis',
    'Build the in-app message banner component in React': 'code',
  };
  for (const [request, kind] of Object.entries(keep)) {
    assert.equal(resolveDeliverableKind(undefined, request).kind, kind, request);
    const { annex } = prepareJobContext({ request });
    assert.equal(annex.deliverable_kind, kind, request);
    assert.notEqual(annex.quality_engine.depth, 'light', request);
    assert.equal(annex.quality_engine.scope_note, undefined, request);
  }
  // The channel words in a brief are still corrected: it is a plan, not email work.
  assert.equal(resolveDeliverableKind(undefined, 'Write a creative brief for our spring campaign. Channels: push, email').kind, 'plan');
  // Push messages to app users are copy, not code because of the word "app".
  assert.equal(suggestDeliverableKind('Write 6 push notifications for app users who have not opened the app in 14 days.').kind, 'copy');
});

test('a job whose kind is outside the card shape gets no shape: its own questions, tests, depth and grounding', () => {
  const request = 'Audit our help desk replies from last month and tell us what is going wrong.';
  assert.equal(jobShape('support-macros', request, 'audit'), null);
  assert.ok(jobShape('support-macros', 'Write a reply to a customer who emailed about a late order.', 'email'));
  const { annex } = prepareJobContext({ request, deliverable_kind: 'audit' });
  assert.equal(annex.deliverable_kind, 'audit');
  assert.ok(!annex.questions.some(q => ['case_facts', 'allowed', 'sender'].includes(q.id)), 'no support-reply questions');
  assert.doesNotMatch(annex.spec_sheet.acceptance_tests[0].test, /customer actually asked/);
  assert.equal(annex.production_gate.requires.data_snapshot, true);
  assert.notEqual(annex.quality_engine.depth, 'light');
  assert.equal(resolveMode({ request, kind: 'audit' }).mode, 'patch');
  assert.equal(qualityEngineContext(request, 'audit').scope_note, undefined);
});

const MARIA = 'Use a team to write a reply to Maria, a customer who emailed that her box arrived damaged. Assume our policy is a free reship within 30 days.';
test('a team job on a shaped card is grounded and checked as prepare_job_context says: no capture or taste brief', async () => {
  // Structure: the same grounding rule on both paths.
  const fit = jobFit(MARIA, 'email');
  assert.equal(fit.family, 'support-macros'); assert.ok(fit.shape?.context); assert.equal(fit.selling, false);
  assert.deepEqual(validateGrounding(undefined, 'email', { shape: fit.shape }), []);
  assert.ok(validateGrounding(undefined, 'email').length, 'without the shape an email still needs its capture');
  // The team path end to end.
  const f = engineFixture(), host = f.input.host_capabilities;
  f.card.request_verbatim = MARIA; f.input.request = MARIA;
  f.team.proposal_id = proposeTeam({ task: MARIA, job: 'write-documents', job_card: f.card, tier: 'standard', host_capabilities: host }, f.context).proposal_id;
  const started = await startJob(f.input, f.context);
  assert.equal(started.mode, 'team'); assert.equal(started.state.base.deliverable.kind, 'email');
  assert.doesNotMatch(started.next_action.instruction, /brand-dna\.json|taste-brief\.md|context\/screenshots/);
  assert.match(started.next_action.instruction, /facts in the request first/);
  const card = JSON.parse(started.files.find(file => file.path === 'templates/JOB-CARD.json').content);
  assert.equal(card.grounding, undefined);
  const send = (previous, entry) => advanceJob({ job_id: previous.job_id, state: previous.state, state_digest: previous.state_digest, ...entry }, f.context);
  f.card.deliverable_kind = 'email';
  let at = started; for (const entry of f.events.slice(0, 4)) at = await send(at, entry);
  assert.equal(at.phase, 'PRODUCE'); assert.doesNotMatch(at.next_action.instruction, /brand_dna|taste_brief/);
  // The rubric is the card's: reply format checks, no buyer gate, no email-series checks.
  const gates = at.rubric.craft.gates;
  assert.ok(!gates.some(g => g.id === 'buyer_can_act'));
  assert.match(gates.find(g => g.id === 'format_complete').gate, /one next step with who acts and when/);
  assert.doesNotMatch(JSON.stringify(gates), /merge tags|exit rule/);
  // PRODUCE is not refused for a missing brand capture or taste brief.
  const produced = await send(at, f.events[4]);
  assert.equal(produced.phase, 'REVIEW');
});

test('a document keeps one lead and standard depth only when the channels are its subject, not extra deliverables', () => {
  const extra = 'Write a creative brief for our spring campaign, plus 3 Meta ads and a landing page';
  assert.equal(routeJob({ request: extra }, {}).mode, 'team');
  assert.equal(qualityEngineContext(extra, resolveDeliverableKind(undefined, extra).kind).depth, 'team');
  const subject = 'Write a creative brief for our spring campaign. Channels: a landing page, Meta ads and email.';
  assert.equal(routeJob({ request: subject }, {}).mode, 'single');
  assert.notEqual(prepareJobContext({ request: subject }).annex.quality_engine.depth, 'team');
  const launch = 'Write a launch plan for our new app. Channels: landing page, Meta ads and email.';
  assert.equal(routeJob({ request: launch }, {}).mode, 'single');
  const { annex } = prepareJobContext({ request: launch });
  assert.equal(annex.deliverable_kind, 'plan'); assert.notEqual(annex.quality_engine.depth, 'team');
  assert.equal(annex.production_gate.requires.brand_dna, false);
});

test('a cold call script or an email series is not a first-touch email', () => {
  const call = cardShape('outbound-sales', 'Write a cold call script for reaching restaurant owners.');
  assert.doesNotMatch(call.complete.join(' '), /subject line/); assert.equal(call.scope_note, undefined);
  const callJob = prepareJobContext({ request: 'Write a cold call script for reaching restaurant owners.' }).annex;
  assert.doesNotMatch(callJob.gates.find(g => g.id === 'format_complete').gate, /subject line/);
  assert.doesNotMatch(callJob.quality_engine.scope_note ?? '', /first-touch email/);
  for (const ask of ['Write 4 outbound emails to the same prospect, one per week.', 'Write a first-touch email and a follow up for the same buyer.', 'Write one cold email a week for a month to our top prospect.']) {
    const shape = cardShape('outbound-sales', ask);
    assert.equal(shape.scope_note, undefined, ask); assert.ok(!shape.complete.includes('a subject line, and an alternate if asked'), ask);
  }
  assert.match(cardShape('outbound-sales', COLD).scope_note, /One first-touch email/);
});

test('a reply about a schedule keeps the reply shape; scripts for agents are a macro set', () => {
  const reply = 'Write a reply to a customer who emailed asking why her delivery schedule changed.';
  assert.match(cardShape('support-macros', reply).scope_note, /One reply to one customer/);
  const { annex } = prepareJobContext({ request: reply });
  assert.equal(annex.deliverable_kind, 'email'); assert.equal(annex.quality_engine.depth, 'light');
  assert.match(annex.spec_sheet.acceptance_tests[0].test, /customer actually asked/);
  assert.equal(cardShape('support-macros', 'Write next month\'s agent schedule for the support team.'), null);
  const scripts = cardShape('support-macros', 'Write chat scripts our agents can use to respond to refund requests.');
  assert.equal(scripts.scope_note, undefined); assert.match(scripts.complete.join(' '), /when to use and when not to/);
  const macros = prepareJobContext({ request: 'Write chat scripts our agents can use to respond to refund requests.' }).annex;
  assert.ok(macros.questions.some(q => q.id === 'cases')); assert.ok(!macros.questions.some(q => q.id === 'case_facts'));
});

test('a reply asks for the policy and case facts unless the request states them', () => {
  const ids = request => prepareJobContext({ request }).annex.questions.map(q => q.id);
  assert.deepEqual(ids('Write a reply to a customer who emailed asking for a refund on her order.').filter(id => id !== 'sender'), ['case_facts', 'allowed']);
  assert.ok(!ids('Write a reply to a customer whose order arrived damaged. Our policy is a free reship within 30 days.').some(id => id === 'allowed' || id === 'case_facts'));
  assert.ok(!ids('Write a reply to a customer who emailed. Assume we offer store credit only.').includes('allowed'));
});

test('a reply that mentions a policy is still light; asking for the policy itself is not', () => {
  assert.equal(prepareJobContext({ request: 'Write a reply to a customer who emailed wanting a refund outside our 30-day return policy.' }).annex.quality_engine.depth, 'light');
  assert.equal(qualityEngineContext('Write a reply to a customer who emailed wanting a refund outside our 30-day return policy.', 'email').depth, 'light');
  assert.notEqual(qualityEngineContext('Write our refund policy for support agents to apply.', 'ops_doc').depth, 'light');
  assert.notEqual(qualityEngineContext('Write a support guide for replying to refund requests.').depth, 'light');
});

test('cold emails and partnership pitches sell no stock at a link, and no annex points at a capture it lacks', () => {
  const cold = prepareJobContext({ request: COLD }).annex;
  assert.equal(cold.gates.some(g => g.id === 'buyer_can_act'), false); assert.equal(cold.buyer_can_act, null);
  const pitch = prepareJobContext({ request: 'Write a partnership pitch email to the head of partnerships at a pet insurance company, proposing co-marketing.' }).annex;
  assert.equal(pitch.quality_engine.family, 'partnership-pitch'); assert.equal(pitch.gates.some(g => g.id === 'buyer_can_act'), false);
  for (const request of [COLD, REPLY, 'Write product descriptions for the Acme Pet linen dog bed in four colours, for our Shopify store.', 'Build a landing page for our new dog bed.']) {
    const { annex } = prepareJobContext({ request });
    if (annex.candidates.compare_with) assert.ok(annex.capture?.tools.some(t => t.file === 'compare-candidates.mjs'), request);
  }
  assert.ok(prepareJobContext({ request: 'Build a landing page for our new dog bed.' }).annex.candidates.compare_with, 'a page that sells still names the side-by-side tool');
});

test('an update for investors is new work on the investor card; the spec sheet works on its own', () => {
  assert.equal(resolveMode({ request: 'Write an update for our investors on Q3.' }).mode, 'new');
  assert.equal(resolveMode({ request: 'Write an update for our investors on Q3.', kind: resolveDeliverableKind(undefined, 'Write an update for our investors on Q3.').kind }).mode, 'new');
  assert.equal(qualityEngineContext('Write an update for our investors on Q3.').family, 'investor-update');
  assert.equal(resolveMode({ request: 'Update our pricing page with the new plans.', kind: 'web_page' }).mode, 'patch');
  const alone = specSheet({ request: 'Write 3 subject lines for our spring sale.', kind: 'email', mode: { mode: 'new' } });
  assert.equal(alone.deliverables[0].in_client_words, 'Write 3 subject lines for our spring sale.');
  assert.equal(prepareJobContext({ request: 'Write 3 subject lines for our spring sale.' }).annex.spec_sheet.deliverables[0].in_client_words, 'annex.request_verbatim');
});

// 13 Nov 2026, after the blind run: three new-set requests still missed their card or went to a team.
test('a pitch email with a length aside, a one-page exception policy and a negated noun route right', () => {
  const pitch = 'I work in PR. Write a pitch email, under 180 words, to a food reporter at a national newspaper about our open day.';
  assert.equal(qualityEngineContext(pitch, 'email').family, 'press-pitch');
  const policy = 'Agents keep making different calls, so I need a one-page refund-exception policy they can apply mid-call.';
  assert.equal(qualityEngineContext(policy, 'ops_doc').family, 'policy-doc');
  const ad = 'We bought host-read ads on a cooking podcast and need a 60-second script. The host should sound like a person, not like they are reading our packaging.';
  assert.equal(routeJob({ request: ad }).mode, 'single');
});
