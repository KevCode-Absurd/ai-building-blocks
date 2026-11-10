// Mixed work gets one maker per kind of work, one independent reviewer, and a fact checker when the work carries claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { proposeTeam, teamBrief, REVIEWER_JOB, MAX_MIXED_MAKERS } from '../src/jobs/propose-team.mjs';
import { startJob, advanceJob } from '../src/jobs/engine.mjs';
import { validateJobDocument } from '../src/jobs/contracts.mjs';
import { engineFixture } from './fixtures/jobs/engine-fixture.mjs';

const sha = 'c'.repeat(64);
const family = (id, name, looks, items) => ({ id, name, what_it_looks_like: looks, items, pickers: [], checks: [], tool_guides: [], supporting_items: [], modality: ['text'], tools_needed: [] });
const jobs = {
  'write-landing-page': { name: 'Write and build a landing page', keywords: ['page', 'landing', 'offer', 'proof'], output_shape_default: 'many_artifacts', families: [family('page-argument', 'Page argument', 'A built landing page', ['page-writer-method'])] },
  'build-websites': { name: 'Build websites and web apps', keywords: ['website', 'site', 'web', 'app'], families: [family('site-build', 'Site build', 'A working website or app', ['site-builder-method'])] },
  'audit-landing-page': { name: 'Audit a landing page', keywords: ['page', 'store', 'fix', 'ranked'], families: [family('page-audit', 'Page audit', 'A ranked fix list for a page or store', ['page-audit-method'])] },
  'make-image-ads': { name: 'Make image ads', keywords: ['image', 'ads'], families: [family('still-ads', 'Still ads', 'Still image ads', ['image-ad-method'])] },
  'write-emails': { name: 'Write emails that get read', keywords: ['email', 'sequence', 'series'], families: [family('email-series', 'Email series', 'An email sequence', ['email-method'])] },
  'brand-file': { name: 'Set up your brand file', keywords: ['brand', 'identity', 'voice'], families: [family('visual-identity', 'Visual identity', 'A style guide and visual identity', ['identity-method'])] },
  'make-video-ads': { name: 'Make video ads', keywords: ['video', 'script'], families: [family('video-scripts', 'Video scripts', 'A video ad script', ['video-method'])] },
};
const slugs = Object.values(jobs).flatMap(job => job.families.flatMap(f => f.items));
const role = (id, name, seats, job, summary) => ({ id, name, summary, department: seats.includes('maker') ? 'marketing' : 'operations', area: 'marketing', seat_suitability: seats, lenses: [id], job, deliverables: [summary], resources: [] });
const maker = ['maker', 'strategist'];
const roles = [
  role('general-coordinator', 'General coordinator', ['coordinator'], 'think-with-minds', 'Scope a job and check the delivery'),
  role('ad-landing-page', 'Ad landing page designer', maker, 'write-landing-page', 'Build a landing page that matches the ad'),
  role('engineering-frontend-developer', 'Frontend developer', maker, 'build-websites', 'Build a working website or app'),
  role('cro-specialist', 'CRO specialist', maker, 'audit-landing-page', 'Audit a store or page and rank the fixes'),
  role('design-specialist', 'Design specialist', maker, 'make-image-ads', 'Design image ads'),
  role('email-writer', 'Email writer', maker, 'write-emails', 'Write an email sequence'),
  role('brand-designer', 'Brand identity designer', maker, 'brand-file', 'Design a brand identity and style guide'),
  role('video-writer', 'Video script writer', maker, 'make-video-ads', 'Write a video script'),
  role('skeptic', 'Sceptic', ['red_team', 'strategist'], null, 'Challenge the plan'),
  role('claim-checker', 'Claim and source checker', ['fact_checker'], null, 'Check each claim against its source'),
  role('work-reviewer', 'Finished work reviewer', ['judge'], null, 'Review the finished work'),
  role('z-second-reviewer', 'Second reviewer', ['judge'], null, 'Review the finished work again'),
  role('brand-critic', 'Brand critic', ['critic'], null, 'Read the work as the client would'),
];
const context = { approaches: { schema: 'ai-blocks-approach-index/1', jobs, revisions: Object.fromEntries(slugs.map(slug => [slug, sha])) }, roles: { roles }, items: slugs.map(slug => ({ slug, type: 'skill', revision_sha256: sha })), manifest: { resources: Object.fromEntries(slugs.map(slug => [slug, { revision_sha256: sha }])) }, personas: [] };
const seatOf = (proposal, id) => proposal.seats.find(seat => seat.role_id === id);
const asPlan = proposal => ({ schema: 'ai-blocks-team-plan/2', goal: proposal.goal, route_options: [{ id: 'team', name: 'Flexible team', reason: 'A task lead coordinates distinct experts against the job rubric.' }], selected_route: 'team', context: [], permissions: [], stages: [], constraints: [], success_checks: [], kpis: [], notes: '', proposal_id: proposal.proposal_id, seats: proposal.seats, lead_seat_id: proposal.lead_seat_id, working_groups: proposal.working_groups, amendments: [], ...(proposal.work ? { work: proposal.work } : {}) });
const valid = (proposal, tier = 'standard') => validateJobDocument('ai-blocks-team-plan/2', asPlan(proposal), { ...context, job: proposal.job, tier });

// [request, the lead, who makes what, whether a separate fact checker sits on the team]
const MIXED = [
  ['Launch our new product: landing page, 6 ads and a 5-email sequence', 'ad-landing-page', { 'ad-landing-page': 'a page', 'design-specialist': '6 ads', 'email-writer': '5 emails' }, true],
  ['new brand identity and a one-page website', 'brand-designer', { 'brand-designer': 'a brand identity', 'engineering-frontend-developer': 'a page' }, true],
  ['audit our store and rewrite the top 5 product pages', 'cro-specialist', { 'cro-specialist': 'an audit', 'ad-landing-page': '5 pages' }, true],
  ['A landing page and a video script', 'ad-landing-page', { 'ad-landing-page': 'a page', 'video-writer': 'video' }, true],
  ['Review our ads and write a new landing page', null, { 'ad-landing-page': 'a page' }, true],
  ['Create two ads and build a landing page on the existing website', null, { 'design-specialist': '2 ads', 'ad-landing-page': 'a page' }, true],
  // Code and images put no claims in front of a buyer, so the reviewer also holds the fact check.
  ['Build an app and make 3 illustrations for it', 'engineering-frontend-developer', { 'engineering-frontend-developer': 'code' }, false],
];

for (const [request, leadRole, makes, factChecker] of MIXED) test(`mixed work: ${request}`, () => {
  const proposal = proposeTeam({ task: request, tier: 'standard' }, context);
  assert.equal(proposal.ok, true, JSON.stringify(proposal.errors)); assert.deepEqual(proposeTeam({ task: request, tier: 'standard' }, context), proposal, 'deterministic');
  const makers = proposal.seats.filter(seat => seat.seat_type === 'maker'), lead = proposal.seats.find(seat => seat.seat_id === proposal.lead_seat_id);
  // One maker per kind of work, each named in the work rows. The first row is the lead.
  assert.equal(makers.length, proposal.work.length); assert.ok(proposal.work.length >= 2);
  assert.deepEqual(proposal.work.map(row => row.maker_seat), makers.map(seat => seat.seat_id)); assert.equal(proposal.work[0].maker_seat, lead.seat_id); assert.equal(proposal.work[0].lead, true);
  if (leadRole) assert.equal(lead.role_id, leadRole);
  for (const [roleId, label] of Object.entries(makes)) { const seat = seatOf(proposal, roleId); assert.ok(seat, `${roleId} is on the team`); assert.equal(proposal.work.find(row => row.maker_seat === seat.seat_id).label, label, roleId); assert.equal(seat.responsibilities.find(line => line.startsWith('Make ')), `Make ${label}`); }
  // Each maker of a published job carries that job's methods, not the lead's.
  for (const row of proposal.work.filter(row => row.job)) { const seat = proposal.seats.find(s => s.seat_id === row.maker_seat); assert.deepEqual(seat.families, jobs[row.job].families.map(f => f.id), row.kind); assert.ok(seat.toolbox.some(pin => jobs[row.job].families[0].items.includes(pin.slug)), row.kind); }
  // One independent reviewer does both outside checks. There is no separate red team, judge and critic.
  const reviewers = proposal.seats.filter(seat => seat.seat_type === 'judge'); assert.equal(reviewers.length, 1);
  assert.ok(reviewers[0].seat_types.includes('red_team') && !reviewers[0].seat_types.includes('maker') && !reviewers[0].seat_types.includes('strategist'));
  assert.match(reviewers[0].responsibilities[0], /^Outside chooser: in a fresh context/); assert.match(reviewers[0].responsibilities[1], /^Client's-eye check: in a new fresh context/);
  assert.equal(proposal.seats.filter(seat => ['red_team', 'critic'].includes(seat.seat_type)).length, 0);
  assert.equal(proposal.seats.filter(seat => seat.seat_type === 'fact_checker').length, factChecker ? 1 : 0); assert.equal(reviewers[0].seat_types.includes('fact_checker'), !factChecker);
  // As small as the work allows: the orchestrator, the makers, the reviewer and the fact checker.
  assert.equal(proposal.seats.length, 1 + makers.length + 1 + (factChecker ? 1 : 0));
  const check = valid(proposal); assert.ok(check.ok, JSON.stringify(check.errors));
  // The brief says who makes what, without telling anyone to search for a helper.
  const brief = teamBrief(proposal, context);
  assert.match(brief.note, new RegExp(`^Proposed\\. ${roles.find(r => r.id === lead.role_id).name} leads and makes `)); assert.match(brief.note, /Confirm or change the seats at the staff step\.$/);
  assert.match(brief.makes, /chooses between the candidates and checks the finished work as the client would/); assert.equal(/traces each claim to its source/.test(brief.makes), factChecker);
  for (const helper of brief.helpers.filter(h => h.seat_type === 'maker')) assert.equal(helper.job, `Makes ${helper.makes}.`);
  assert.ok(brief.helpers.find(h => h.seat_type === 'judge').job.startsWith(REVIEWER_JOB)); assert.doesNotMatch(JSON.stringify(brief), /search|rival first version/);
});

test('a mixed team stays small at every tier the contract allows, and a deep team keeps its full bench', () => {
  const request = MIXED[0][0];
  const quick = proposeTeam({ task: request, tier: 'quick' }, context);
  assert.deepEqual(quick.seats.map(seat => seat.seat_type), ['coordinator', 'maker', 'maker', 'maker', 'judge']); assert.deepEqual(quick.seats.at(-1).seat_types, ['judge', 'fact_checker']);
  assert.ok(valid(quick, 'quick').ok, JSON.stringify(valid(quick, 'quick').errors));
  const deep = proposeTeam({ task: request, tier: 'deep' }, context);
  assert.deepEqual(deep.work.map(row => row.kind), ['page', 'ads', 'email']); assert.equal(deep.seats.filter(seat => seat.seat_type === 'judge').length, 2);
  assert.ok(deep.seats.some(seat => seat.seat_type === 'red_team') && deep.seats.some(seat => seat.seat_type === 'critic') && deep.seats.length >= 8);
  // More kinds than a small team can hold: the first four get a maker and the proposal says so.
  const many = proposeTeam({ task: 'Make a landing page, 6 ads, a 5-email sequence, a video script and a pitch deck', tier: 'standard' }, context);
  assert.equal(many.work.length, MAX_MIXED_MAKERS); assert.ok(many.warnings.some(w => w.path === 'work' && /5 kinds of work/.test(w.message)));
  // One kind of work never gets the mixed team: a batch still uses rival makers and the full bench.
  const batch = proposeTeam({ task: 'Make 25 image ads', job: 'make-image-ads', tier: 'standard' }, context);
  assert.equal(batch.work, undefined); assert.ok(batch.seats.some(seat => seat.seat_type === 'red_team') && batch.seats.some(seat => seat.seat_type === 'critic'));
  assert.match(teamBrief(batch, context).note, /The lead decides which helper does what/);
});

test('the contract accepts the small mixed team and still refuses a judge in the council elsewhere', () => {
  const proposal = proposeTeam({ task: MIXED[1][0], tier: 'standard' }, context), plan = asPlan(proposal), check = (doc, extra = {}) => validateJobDocument('ai-blocks-team-plan/2', doc, { ...context, job: proposal.job, tier: 'standard', ...extra });
  assert.equal(proposal.seats.length, 5); assert.ok(check(plan).ok);
  // Without the work rows the same seats are an ordinary team, where a judge may not also sit in the council.
  const { work, ...ordinary } = plan; assert.match(JSON.stringify(check(ordinary).errors), /the judge must stay out of the council/);
  // The work rows must name real, distinct maker seats, lead first.
  const wrong = structuredClone(plan); wrong.work[1].maker_seat = proposal.seats.find(seat => seat.seat_type === 'judge').seat_id; assert.match(JSON.stringify(check(wrong).errors), /work\[1\]\.maker_seat/);
  const swapped = structuredClone(plan); swapped.work.reverse(); assert.match(JSON.stringify(check(swapped).errors), /the first row is the lead/);
  // Each maker writes the candidates for its own piece, so two kinds of work need two routes, not three.
  const route = (id, seat, word) => ({ route_id: id, owner_seat: seat.seat_id, mix: 'proven', thesis: `${word} first`, differs_on: { first_move: `${word} one`, mechanism: `${word} two`, segment: `${word} three`, horizon: `${word} four` }, evidence: [], expected_effect: 'x', effort: 'low', risks: [], wins_if: 'x' });
  const makers = proposal.seats.filter(seat => seat.seat_type === 'maker'), routes = { schema: 'ai-blocks-routes/1', routes: [route('r0', makers[0], 'identity'), route('r1', makers[1], 'website')] };
  const mixed = validateJobDocument('ai-blocks-routes/1', routes, { team: plan, tier: 'standard' }).errors.filter(e => /needs \d/.test(e.message)), plain = validateJobDocument('ai-blocks-routes/1', routes, { team: ordinary, tier: 'standard' }).errors.filter(e => /needs \d/.test(e.message));
  assert.deepEqual(mixed, []); assert.match(plain[0].message, /needs 3–5 routes/);
});

test('start_job says who makes what for mixed work, and the proposed team passes the staff step', async () => {
  const request = MIXED[0][0], f = engineFixture();
  const started = await startJob({ request, host_capabilities: f.input.host_capabilities }, context);
  assert.equal(started.mode, 'team'); assert.equal(started.phase, 'SCOPE');
  assert.match(started.mode_reason, /^This needs different kinds of work \(a page, ads and emails\), so one lead runs a small team of helpers\. Ad landing page designer leads and makes a page\. Design specialist makes 6 ads\. Email writer makes 5 emails\. Finished work reviewer chooses between the candidates and checks the finished work as the client would\. Claim and source checker traces each claim to its source\.$/);
  assert.ok(started.team.note.includes('Design specialist makes 6 ads. Email writer makes 5 emails.')); assert.equal(started.team.lead.makes, 'a page');
  assert.deepEqual(started.team.helpers.map(helper => [helper.role_id, helper.seat_type]), [['design-specialist', 'maker'], ['email-writer', 'maker'], ['work-reviewer', 'judge'], ['claim-checker', 'fact_checker']]);
  assert.equal(started.estimate.seats, 6);
  // Scope, then accept the proposal: the engine's own validators take the small team and keep its work rows.
  const card = { ...f.card, request_verbatim: request, deliverable_kind: 'web_page', deliverables: [{ kind: 'page', count: 1, format_constraints: [] }, { kind: 'ad', count: 6, format_constraints: [] }, { kind: 'email', count: 5, format_constraints: [] }], dials: { ...f.card.dials, depth: { ...f.card.dials.depth, value: started.tier } } };
  const send = (previous, entry) => advanceJob({ job_id: previous.job_id, state: previous.state, state_digest: previous.state_digest, ...entry }, context);
  const scoped = await send(started, { event: 'scope', document: card }); assert.equal(scoped.phase, 'STAFF');
  assert.deepEqual(scoped.proposal.work.map(row => [row.kind, row.label, row.job]), [['page', 'a page', 'write-landing-page'], ['ads', '6 ads', 'make-image-ads'], ['email', '5 emails', 'write-emails']]);
  const staffed = await send(scoped, { event: 'staff', accept_proposal: true, document: {} }); assert.equal(staffed.phase, 'DIVERGE');
  const team = staffed.state.history.at(-1).document; assert.equal(team.work.length, 3); assert.equal(team.seats.length, 6); assert.equal(team.lead_seat_id, team.work[0].maker_seat);
});

test('real catalogue: mixed requests get a maker whose own job matches each kind of work', { skip: !fs.existsSync(new URL('../public/data/roles-index.json', import.meta.url)) && 'the built role index is absent' }, () => {
  const read = name => JSON.parse(fs.readFileSync(new URL(`../public/data/${name}`, import.meta.url)));
  const real = { approaches: read('approach-index.json'), roles: read('roles-index.json'), items: [], personas: [] }, byId = new Map(real.roles.roles.map(r => [r.id, r]));
  const cases = [
    ['landing page, 6 ads and a 5-email sequence for our launch', [['page', 'write-landing-page'], ['ads', 'make-image-ads'], ['email', 'write-emails']]],
    ['new brand identity and a one-page website', [['brand', 'brand-file'], ['page', 'build-websites']]],
    ['audit our store and rewrite the top 5 product pages', [['audit', 'audit-landing-page'], ['page', 'write-landing-page']]],
    ['A landing page and a video script', [['page', 'write-landing-page'], ['video', 'make-video-ads']]],
    ['Create two ads and build a landing page on the existing website', [['page', 'write-landing-page'], ['ads', 'make-image-ads']]],
    ['Review our ads and write a new landing page', [['audit', 'check-ads'], ['page', 'write-landing-page']]],
  ];
  for (const [request, expected] of cases) {
    const proposal = proposeTeam({ task: request, tier: 'standard' }, real);
    assert.equal(proposal.ok, true, request); assert.deepEqual(proposal.work.map(row => [row.kind, row.job]).sort(), [...expected].sort(), request);
    // The maker for each kind is a specialist in that kind of work: a role whose own job it is, or the designer who is
    // the first choice for image ads in single jobs too.
    for (const row of proposal.work) { const id = proposal.seats.find(seat => seat.seat_id === row.maker_seat).role_id; assert.ok(byId.get(id).job === row.job || (row.job === 'make-image-ads' && id === 'design-specialist'), `${request}: ${row.kind} went to ${id}`); }
    assert.equal(new Set(proposal.seats.map(seat => seat.role_id)).size, proposal.seats.length, request);
    assert.equal(proposal.seats.filter(seat => seat.seat_type === 'judge').length, 1, request); assert.equal(proposal.seats.filter(seat => seat.seat_type === 'fact_checker').length, 1, request);
    assert.equal(proposal.seats.length, expected.length + 3, request);
    assert.match(teamBrief(proposal, real).makes, / leads and makes /, request);
  }
});
