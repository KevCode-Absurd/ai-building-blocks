// The Grounded Job Protocol in the library MCP and the team-mode engine. Synthetic structural data only.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { prepareJobContext, suggestDeliverableKind, resolveDeliverableKind, resolveMode, normalizePatterns, defaultsFor, validateGrounding, substanceOverlap, skillPreamble, skillPreambleKind, craftRubric, gatesFor, CRAFT_RUBRICS, tasteQuestions, EMBEDDED_DEFAULT_PATTERNS } from '../src/jobs/grounding.mjs';
import { buildExecutionPlan } from '../src/jobs/execution-quality.mjs';
import { resolveDials, namesOneDeliverable } from '../src/jobs/dials.mjs';
import { assembleRubric, scoreReview } from '../src/jobs/rubric.mjs';
import { startJob, advanceJob } from '../src/jobs/engine.mjs';
import { jobMcpTools, callJobTool, JOB_REST_OPERATIONS } from '../src/jobs/job-mcp.mjs';
import { proposeTeam } from '../src/jobs/propose-team.mjs';
import { validateJobDocument } from '../src/jobs/contracts.mjs';
import { engineFixture } from './fixtures/jobs/engine-fixture.mjs';

const send = (previous, entry, context) => advanceJob({ job_id: previous.job_id, state: previous.state, state_digest: previous.state_digest, ...entry }, context);
const h = c => c.repeat(64);
const brandGrounding = () => ({
  brand_dna: { path: 'context/brand-dna.json', sha256: h('c'), source: 'https://www.tanishq.co.in', captured_at: '2026-11-09', method: 'capture-brand-dna.mjs' },
  taste_brief: { path: 'context/taste-brief.md', sha256: h('d'), brand_codes: ['Serif display type over generous white space'], references_admired: ['Cartier product pages', 'Mejuri editorial'], reference_avoid: ['Discount marketplace grids'], defaults_to_avoid: ['web-template-stack', 'web-generic-font'], conventions_break: ['No price-led hero'] },
});

test('prepare_job_context returns a short brief and a structured annex for each kind, with no model calls', () => {
  const page = prepareJobContext({ request: 'Build a landing page for my jewellery brand', site_url: 'https://www.tanishq.co.in' });
  assert.equal(page.schema, 'ai-blocks-job-context/1'); assert.equal(page.model_calls, 0); assert.equal(page.stored_by_service, false);
  assert.ok(page.brief.length <= 1500, `brief is ${page.brief.length}`);
  for (const word of ['GROUND', 'https://www.tanishq.co.in', 'context/brand-dna.json', 'TASTE', 'price point', 'admire', 'AVOID', 'DIVERGE', 'CHECK']) assert.ok(page.brief.includes(word), word);
  const a = page.annex;
  assert.equal(a.deliverable_kind, 'web_page'); assert.equal(a.kind_source, 'suggested'); assert.equal(a.family, 'web_page');
  assert.equal(a.mode_default.mode, 'extend');
  assert.deepEqual(a.protocol.map(s => s.id), ['frame', 'ground', 'taste', 'diverge', 'build', 'check', 'record']);
  assert.ok(a.context_requirements.some(r => r.id === 'brand_dna' && r.required));
  assert.deepEqual(a.capture.tools.map(t => t.file), ['capture-brand-dna.mjs', 'brand-dna-snippet.js', 'check-brand-fidelity.mjs']);
  for (const tool of a.capture.tools) { assert.equal(tool.get_skill.response_format, 'detailed'); assert.match(tool.marketplace_url, /^https:\/\/agents\.useaiblocks\.com\/tools\//); assert.equal(tool.status, 'CHECK_GET_SKILL'); }
  assert.equal(a.taste_brief.questions.length, 3); assert.equal(a.taste_brief.path, 'context/taste-brief.md');
  assert.equal(a.craft_rubric.reduce((n, c) => n + c.weight, 0), 100);
  assert.ok(a.gates.some(g => g.id === 'primary_action_works'));
  assert.ok(a.defaults_to_avoid.some(d => d.id === 'web-template-stack')); assert.equal(a.defaults_source, 'embedded:DESIGN.md AI-default list');
  assert.deepEqual(a.production_gate.requires, { brand_dna: true, data_snapshot: false, taste_brief: true });
  const audit = prepareJobContext({ request: 'audit my Meta ad account' });
  assert.equal(audit.annex.deliverable_kind, 'audit'); assert.equal(audit.annex.mode_default.mode, 'patch');
  assert.match(audit.brief, /read level/); assert.match(audit.brief, /hypotheses/); assert.doesNotMatch(audit.brief, /brand-dna/);
  assert.deepEqual(audit.annex.production_gate.requires, { brand_dna: false, data_snapshot: true, taste_brief: false });
  assert.deepEqual(audit.annex.defaults_to_avoid.map(d => d.id), ['audit-fixed-checklist']);
  const declared = prepareJobContext({ request: 'Help with our homepage', deliverable_kind: 'copy', has_existing_asset: true });
  assert.equal(declared.annex.kind_source, 'declared'); assert.equal(declared.annex.deliverable_kind, 'copy'); assert.equal(declared.annex.mode_default.mode, 'patch');
  assert.equal(prepareJobContext({ request: 'Launch a new brand from scratch', deliverable_kind: 'web_page' }).annex.mode_default.mode, 'new');
  for (const kind of ['web_page', 'ad_creative', 'copy', 'email', 'audit', 'analysis', 'strategy', 'plan', 'code', 'ops_doc', 'other']) assert.ok(prepareJobContext({ request: 'A long request '.repeat(200), deliverable_kind: kind, site_url: 'https://example.com/' + 'x'.repeat(1800) }).brief.length <= 1500, kind);
});

test('catalogue patterns.json and published scripts replace the embedded fallback when present', () => {
  const patterns = { patterns: [{ id: 'web-centred-hero', family: 'web', description: 'Centred hero over a gradient.', why: 'The model average.' }, { id: 'ad-same-look', surface: ['ads'], text: 'All concepts in one style.' }, { id: 'bad id!', family: 'web', description: 'dropped' }, { id: 'no-family', description: 'dropped' }] };
  assert.deepEqual(normalizePatterns(patterns).map(p => p.id), ['web-centred-hero', 'ad-same-look']);
  assert.deepEqual(normalizePatterns({ web: [{ id: 'grouped', description: 'Grouped by family key.' }] }).map(p => p.group), ['web']);
  const scripts = [{ file: 'capture-brand-dna.mjs', slug: 'brand-dna-capture', path: 'scripts/capture-brand-dna.mjs', revision_sha256: h('e'), resource_url: 'https://example.test/api/v1/resources/brand-dna-capture?path=scripts%2Fcapture-brand-dna.mjs&revision_sha256=' + h('e') }];
  const r = prepareJobContext({ request: 'Build a landing page', deliverable_kind: 'web_page' }, { patterns, scripts });
  assert.equal(r.annex.defaults_source, 'catalogue:ai-default-patterns/patterns.json'); assert.deepEqual(r.annex.defaults_to_avoid.map(d => d.id), ['web-centred-hero']);
  const tool = r.annex.capture.tools.find(t => t.file === 'capture-brand-dna.mjs');
  assert.equal(tool.status, 'PUBLISHED'); assert.equal(tool.get_resource.revision_sha256, h('e')); assert.equal(tool.resource_url, scripts[0].resource_url);
  assert.equal(defaultsFor('ad_creative', EMBEDDED_DEFAULT_PATTERNS)[0].id, 'ads-one-look');
});

test('prepare_job_context is a listed job tool with a REST mirror and validated inputs', async () => {
  const tool = jobMcpTools.find(t => t.name === 'prepare_job_context');
  assert.ok(tool); assert.equal(jobMcpTools[0].name, 'prepare_job_context'); assert.equal(tool.annotations.readOnlyHint, true);
  assert.deepEqual(tool.inputSchema.required, ['request']); assert.deepEqual(Object.keys(tool.inputSchema.properties), ['request', 'deliverable_kind', 'site_url', 'has_existing_asset', 'category']);
  assert.equal(JOB_REST_OPERATIONS['/api/v1/job-context'], 'prepare_job_context');
  const r = await callJobTool('prepare_job_context', { request: 'Write a welcome email', deliverable_kind: 'email' });
  assert.equal(r.annex.family, 'copy_email');
  await assert.rejects(() => callJobTool('prepare_job_context', { request: 'x', deliverable_kind: 'landing' }), /deliverable_kind/);
  await assert.rejects(() => callJobTool('prepare_job_context', { request: 'x', site_url: 'not a url' }), /site_url/);
  const start = jobMcpTools.find(t => t.name === 'start_job');
  for (const field of ['deliverable_kind', 'site_url', 'has_existing_asset']) assert.ok(start.inputSchema.properties[field], field);
});

test('the deliverable kind is declared; the word guess is a suggestion and audits never become image ads', () => {
  for (const [request, kind] of [['audit my Meta ad account', 'audit'], ['Why did my ROAS drop last month?', 'analysis'], ['Review my homepage and suggest fixes', 'audit'], ['Make 6 image ads for our candles', 'ad_creative'], ['Build a landing page for my jewellery brand', 'web_page'], ['Write landing page copy', 'copy'], ['Write a welcome email', 'email'], ['Plan our Q1 content calendar', 'plan']]) assert.equal(suggestDeliverableKind(request).kind, kind, request);
  const audit = buildExecutionPlan({ request: 'audit my Meta ad account' });
  assert.equal(audit.task_type, 'general'); assert.equal(audit.images.required, false); assert.equal(audit.deliverable.kind, 'audit'); assert.equal(audit.deliverable.source, 'suggested');
  assert.ok(audit.gates.some(g => /data snapshot/.test(g)));
  assert.equal(buildExecutionPlan({ request: 'audit my Meta ad account', deliverable_kind: 'audit' }).deliverable.source, 'declared');
  // A declared kind overrides the words both ways.
  assert.equal(buildExecutionPlan({ request: 'Help me with our Meta ads', deliverable_kind: 'analysis' }).task_type, 'general');
  assert.equal(buildExecutionPlan({ request: 'Help me with our summer launch', deliverable_kind: 'ad_creative' }).task_type, 'image_ads');
  assert.equal(buildExecutionPlan({ request: 'Make 6 image ads for our candles' }).task_type, 'image_ads');
  assert.equal(buildExecutionPlan({ request: 'Make ads', card: { deliverable_kind: 'copy' } }).task_type, 'general');
  assert.deepEqual(resolveDeliverableKind('not-a-kind', 'Write a welcome email').source, 'suggested');
});

test('a request naming one deliverable defaults to one output, not the approach default', () => {
  const approachJob = { default_volume: 10 };
  assert.deepEqual(resolveDials({ request: 'Build a landing page for my jewellery brand', approachJob }).dials.volume, { value: 1, source: 'request', source_ref: 'Build a landing page' });
  assert.equal(resolveDials({ request: 'Write ads for our site', approachJob }).dials.volume.value, 10, 'a context noun is not the deliverable');
  assert.equal(resolveDials({ request: 'Write an email to win back lapsed customers', approachJob }).dials.volume.value, 1);
  assert.deepEqual(resolveDials({ request: 'audit my Meta ad account', approachJob }).dials.volume, { value: 1, source: 'recommended' });
  assert.equal(resolveDials({ request: 'Make 6 image ads', approachJob }).dials.volume.value, 6);
  assert.equal(resolveDials({ request: 'Write a welcome email sequence', approachJob }).dials.volume.value, 10);
  assert.equal(resolveDials({ request: 'Make ads for my candle shop', approachJob }).dials.volume.value, 10);
  assert.equal(namesOneDeliverable('a landing page and 5 ads'), null);
  // The single-output dial stays traceable to the request, so the job card validates.
  const f = engineFixture(); f.card.request_verbatim = 'Build a landing page for my jewellery brand'; f.card.dials.volume = resolveDials({ request: f.card.request_verbatim, approachJob }).dials.volume;
  assert.equal(validateJobDocument('ai-blocks-job-card/1', f.card).errors.filter(e => e.path.startsWith('dials.volume')).length, 0);
});

test('start_job states the dials in one line and spends the questions on taste and position', async () => {
  const f = engineFixture();
  const r = await startJob({ ...f.input, request: 'Write a welcome email for our jewellery store', deliverable_kind: 'email' }, f.context);
  assert.equal(r.phase, 'SCOPE'); assert.equal(r.dials, undefined); assert.equal(r.dial_questions, undefined);
  assert.match(r.dials_line, /^Using a balanced mix, 1 output and a (standard|quick|deep) review; say if you want otherwise\.$/);
  assert.deepEqual(r.taste_questions.map(q => q.id), ['position', 'never_change', 'references']);
  assert.ok(r.brief.length <= 1500); assert.equal(Object.keys(r)[1], 'brief');
  assert.match(r.next_action.instruction, /taste_questions/); assert.match(r.next_action.instruction, /context\/brand-dna\.json/);
  assert.equal(r.state.base.deliverable.kind, 'email'); assert.equal(r.state.base.deliverable.source, 'declared'); assert.equal(r.state.base.brief, undefined);
  const card = JSON.parse(r.files.find(file => file.path === 'templates/JOB-CARD.json').content);
  assert.equal(card.deliverable_kind, 'email'); assert.ok(card.grounding.brand_dna && card.grounding.taste_brief);
  // Context bloat: the full plan lives in its file; the top level has a summary and no repeated dials.
  assert.equal(r.execution_plan.file, 'EXECUTION-PLAN.json'); assert.equal(r.execution_plan.gates, undefined);
  assert.ok(r.files.some(file => file.path === 'EXECUTION-PLAN.json' && JSON.parse(file.content).gates.length));
  const asked = await startJob({ ...f.input, dials: { ...f.input.dials, ask_before_start: 'ask_dials' } }, f.context);
  assert.ok(asked.dial_questions.length > 0);
});

test('production is refused until grounding is reported for brand and audit jobs', async () => {
  for (const kind of ['copy', 'audit']) {
    const f = engineFixture(); f.input.deliverable_kind = kind;
    let r = await startJob(f.input, f.context);
    for (const entry of f.events.slice(0, 4)) r = await send(r, entry, f.context);
    assert.equal(r.phase, 'PRODUCE');
    await assert.rejects(() => send(r, { event: 'produce', document: f.production }, f.context), kind === 'audit' ? /data snapshot/ : /context\/brand-dna\.json and context\/taste-brief\.md/);
    if (kind === 'copy') {
      const thin = brandGrounding(); thin.taste_brief.references_admired = ['Only one'];
      await assert.rejects(() => send(r, { event: 'produce', document: { ...f.production, grounding: thin } }, f.context), /references_admired/);
      const noCapture = brandGrounding(); delete noCapture.brand_dna;
      await assert.rejects(() => send(r, { event: 'produce', document: { ...f.production, grounding: noCapture } }, f.context), /brand_dna/);
      const outside = brandGrounding(); outside.brand_dna.path = '../brand-dna.json';
      await assert.rejects(() => send(r, { event: 'produce', document: { ...f.production, grounding: outside } }, f.context), /brand_dna/);
      assert.equal((await send(r, { event: 'produce', document: { ...f.production, grounding: brandGrounding() } }, f.context)).phase, 'REVIEW');
    } else {
      const grounding = { data_snapshot: { path: 'context/data-snapshot.json', sha256: h('f'), source: 'Meta Ads connector, read level', captured_at: '2026-11-09' } };
      assert.equal((await send(r, { event: 'produce', document: { ...f.production, grounding } }, f.context)).phase, 'REVIEW');
    }
  }
  // Grounding reported at scope satisfies the gate too; a document-only ops job needs none.
  const f = engineFixture(); f.input.deliverable_kind = 'copy'; f.card.grounding = brandGrounding();
  let r = await startJob(f.input, f.context);
  for (const entry of f.events.slice(0, 5)) r = await send(r, entry, f.context);
  assert.equal(r.phase, 'REVIEW');
  assert.deepEqual(validateGrounding(undefined, 'ops_doc'), []);
  const bad = engineFixture(); bad.input.deliverable_kind = 'web_page'; bad.card.grounding = { brand_dna: { path: 'context/brand-dna.json' } };
  const started = await startJob(bad.input, bad.context);
  await assert.rejects(() => send(started, { event: 'scope', document: bad.card }, bad.context), /grounding\.brand_dna/);
});

test('the rubric adds per-family craft criteria with the spec weights, and gates never average away', () => {
  for (const [family, rows] of Object.entries(CRAFT_RUBRICS)) assert.equal(rows.reduce((n, c) => n + c.weight, 0), 100, family);
  const web = craftRubric('web_page');
  assert.deepEqual(Object.fromEntries(web.map(c => [c.id, c.weight])), { job_conversion: 20, brand_fidelity: 25, launchability: 20, specificity: 15, distinctiveness: 10, clarity: 10 });
  assert.ok(craftRubric('email').some(c => c.id === 'brand_fidelity' && c.weight === 25) && craftRubric('copy').some(c => c.id === 'distinctiveness'));
  assert.ok(craftRubric('audit').some(c => c.id === 'diagnosis' && c.weight === 25));
  assert.equal(gatesFor('web_page').length, 11); assert.equal(gatesFor('audit').length, 6); assert.equal(gatesFor('analysis').length, 5);
  // Every kind gets the hand-over budget; conversion work also gets the proven-levers gate.
  for (const kind of ['web_page', 'ad_creative', 'copy', 'email', 'audit', 'analysis', 'strategy', 'plan', 'code', 'ops_doc', 'other']) {
    assert.ok(gatesFor(kind).some(g => g.id === 'hand_over_budget'), kind);
    assert.equal(gatesFor(kind).some(g => g.id === 'proven_levers_checked'), ['web_page', 'ad_creative', 'copy', 'email', 'audit'].includes(kind), kind);
    const ctx = prepareJobContext({ request: 'x', deliverable_kind: kind });
    assert.ok(ctx.annex.hand_over.word_budget.length > 20, kind);
    // 10 Nov rerun: the hand-over stands on its own and never sends the client to working files.
    assert.deepEqual(ctx.annex.hand_over.detail_goes_to, ['an appendix inside the deliverable'], kind);
    assert.match(ctx.brief, /never in a file the client does not have/, kind);
  }
  assert.match(prepareJobContext({ request: 'x', deliverable_kind: 'plan' }).annex.hand_over.word_budget, /10,000 words/);
  assert.ok(prepareJobContext({ request: 'Improve our product page', deliverable_kind: 'web_page' }).annex.proven_levers.some(l => /reviews and ratings/.test(l)));
  assert.match(prepareJobContext({ request: 'Improve our product page', deliverable_kind: 'web_page' }).brief, /AVOID unless chosen on purpose/, 'the defaults to avoid still fit in the brief');
  const legacy = assembleRubric({}); assert.equal(legacy.craft, undefined);
  const rubric = assembleRubric({}, [], { kind: 'web_page' }); assert.equal(rubric.craft.family, 'web_page');
  assert.equal(validateJobDocument('ai-blocks-rubric/1', rubric).ok, true);
  const standard = Object.fromEntries(rubric.standard.map(c => [c.id, 10])), craft = Object.fromEntries(web.map(c => [c.id, 10]));
  const gates = gatesFor('web_page').map(g => ({ id: g.id, status: 'PASS', evidence: 'Observed in the browser.' }));
  const review = items => ({ items, set_checks: { count_met: true, variety_contract: 'PASS', decision_record: 'PASS' } });
  assert.equal(scoreReview(review([{ slot_id: 'a', scores: standard, craft_scores: craft, gates, verdict: 'PASS' }]), rubric).pass, true);
  const failedGate = gates.map(g => g.id === 'nav_footer_kept' ? { ...g, status: 'FAIL' } : g);
  const scored = scoreReview(review([{ slot_id: 'a', scores: standard, craft_scores: craft, gates: failedGate, verdict: 'PASS' }]), rubric);
  assert.equal(scored.pass, false); assert.deepEqual(scored.items[0].failed_gates, ['nav_footer_kept']);
  assert.equal(scoreReview(review([{ slot_id: 'a', scores: standard, craft_scores: craft, gates: gates.filter(g => g.id !== 'primary_action_works'), verdict: 'PASS' }]), rubric).pass, false);
  assert.equal(scoreReview(review([{ slot_id: 'a', scores: standard, craft_scores: { ...craft, brand_fidelity: 4 }, gates, verdict: 'PASS' }]), rubric).pass, false, 'a weak craft criterion is not averaged away');
  assert.equal(scoreReview(review([{ slot_id: 'a', scores: standard, craft_scores: Object.fromEntries(web.map(c => [c.id, 6])), gates, verdict: 'PASS' }]), rubric).pass, false, 'craft below 70%');
  assert.equal(scoreReview(review([{ slot_id: 'a', scores: standard, gates, verdict: 'PASS' }]), rubric).pass, false);
});

test('rival routes that share more than 60% of pinned methods or references are refused', async () => {
  const pin = n => ({ slug: `method-${n}`, revision_sha256: h('a') });
  assert.deepEqual(substanceOverlap([{ route_id: 'a', methods: [pin(0), pin(1)], references: ['Cartier'] }, { route_id: 'b', methods: [pin(2)], references: ['Mejuri'] }], { requireReferences: true }), []);
  assert.match(substanceOverlap([{ route_id: 'a', methods: [pin(0), pin(1), pin(2)] }, { route_id: 'b', methods: [pin(0), pin(1), pin(3)] }])[0].message, /67% of its pinned methods/);
  assert.match(substanceOverlap([{ route_id: 'a', methods: [pin(0)], references: ['https://www.cartier.com/'] }, { route_id: 'b', methods: [pin(1)], references: ['cartier.com'] }])[0].message, /references/);
  assert.match(substanceOverlap([{ route_id: 'a', methods: [pin(0)] }, { route_id: 'b', methods: [pin(1)] }], { requireReferences: true })[0].message, /Cite the reference/);
  assert.match(substanceOverlap([{ route_id: 'a' }])[0].message, /Pin the 1 to 6 methods/);
  // Through the engine: the fixture's routes differ; collapsing them onto one method fails, and focused work is exempt.
  const f = engineFixture(); let r = await startJob(f.input, f.context);
  r = await send(r, f.events[0], f.context); r = await send(r, f.events[1], f.context);
  const same = structuredClone(f.events[2].document); same.routes.routes.forEach(route => { route.methods = [pin(0)]; });
  await assert.rejects(() => send(r, { event: 'diverge', document: same }, f.context), /share|Shares/);
  const foreign = structuredClone(f.events[2].document); foreign.routes.routes[0].methods = [{ slug: 'not-in-toolbox', revision_sha256: h('a') }];
  await assert.rejects(() => send(r, { event: 'diverge', document: foreign }, f.context), /not pinned in the owner seat/);
  assert.equal((await send(r, f.events[2], f.context)).phase, 'DELIBERATE');
});

test('each seat gets at most six ranked focus methods with a reason, and makers are steered apart', () => {
  const f = engineFixture(), slugs = Array.from({ length: 12 }, (_, n) => `landing-page-method-${n}`);
  for (const role of f.context.roles.roles) role.extended = slugs.map(slug => ({ slug, revision_sha256: h('a') }));
  const proposal = proposeTeam({ task: 'Build a landing page for a jewellery brand', job: 'write-documents', tier: 'standard' }, f.context);
  assert.ok(proposal.ok);
  for (const seat of proposal.seats) { assert.ok(seat.focus_methods.length <= 6 && seat.focus_methods.length > 0); for (const m of seat.focus_methods) { assert.ok(m.why.length > 0 && m.why.length <= 300); assert.ok(seat.toolbox.some(pin => pin.slug === m.slug)); } }
  const makers = proposal.seats.filter(seat => seat.seat_types.includes('maker'));
  const shared = makers[0].focus_methods.filter(m => makers[1].focus_methods.some(n => n.slug === m.slug)).length;
  assert.ok(shared <= 3, `makers share ${shared} focus methods`);
  const team = { ...f.team, seats: proposal.seats.map(seat => ({ ...seat })) };
  assert.deepEqual(validateJobDocument('ai-blocks-team-plan/2', team).errors.filter(e => /focus_methods/.test(e.path)), []);
});

test('get_skill preamble qualifies creative, page, ad, copy, email, audit and analysis skills deterministically', () => {
  assert.equal(skillPreambleKind({ slug: 'conversion-landing-page-designer', task: 'write-landing-page' }), 'create');
  assert.equal(skillPreambleKind({ slug: 'meta-ads-30-check-account-auditor', task: 'check-ads' }), 'assess');
  assert.equal(skillPreambleKind({ slug: 'welcome-flow', name: 'Welcome flow', job: 'email' }), 'create');
  assert.equal(skillPreambleKind({ slug: 'cohort-reader', job: 'analysis' }), 'assess');
  assert.equal(skillPreambleKind({ slug: 'docker-compose-setter', task: 'ship-and-host' }), null);
  const create = skillPreamble({ slug: 'store-hero-section-writer', task: 'write-landing-page' });
  assert.equal(create.title, 'Before you run this'); assert.equal(create.lines.length, 5);
  for (const pattern of [/GROUND/, /taste questions/, /defaults you will avoid/, /2 or 3 directions/, /independent pass/]) assert.ok(create.lines.some(line => pattern.test(line)), String(pattern));
  assert.equal(create.tool.name, 'prepare_job_context');
  const assess = skillPreamble({ slug: 'ad-account-audit', task: 'read-ad-results' });
  assert.ok(assess.lines.some(line => /real account or data/.test(line)) && assess.lines.some(line => /competing hypotheses/.test(line)));
  assert.equal(skillPreamble({ slug: 'docker-compose-setter', task: 'ship-and-host' }), null);
});

test('get_skill detailed puts the preamble before the method text on the real catalogue', { skip: !fs.existsSync(new URL('../public/data/public-api-manifest.json', import.meta.url)) && 'built catalogue data is absent' }, async () => {
  const { PublicCatalogueService } = await import('../src/server/public-catalogue.ts');
  const read = p => fs.readFileSync(new URL('../public' + p, import.meta.url));
  const service = new PublicCatalogueService(async p => { try { return new Response(read(p)); } catch { return new Response('Missing', { status: 404 }); } }, 'https://example.test');
  const page = await service.callTool('get_skill', { slug: 'conversion-landing-page-designer', response_format: 'detailed' });
  const keys = Object.keys(page);
  assert.equal(page.before_you_run.kind, 'create'); assert.ok(keys.indexOf('before_you_run') < keys.indexOf('instructions'));
  assert.match(page.next_action, /^Run before_you_run first/);
  const concise = await service.callTool('get_skill', { slug: 'conversion-landing-page-designer' });
  assert.equal(concise.before_you_run, undefined);
  const context = await service.callTool('prepare_job_context', { request: 'Build a landing page for my jewellery brand', site_url: 'https://www.tanishq.co.in' });
  assert.ok(context.brief.length <= 1500); assert.equal(context.model_calls, 0);
});

test('the catalogue service reads patterns.json and script URLs from the published GJP skills', async () => {
  const { PublicCatalogueService } = await import('../src/server/public-catalogue.ts');
  const service = new PublicCatalogueService(async () => new Response('Missing', { status: 404 }), 'https://example.test');
  const file = path => ({ path, sha256: h('1'), bytes: 200 });
  service.catalogue = async () => ({ manifest: { resources: { 'brand-dna-capture': { revision_sha256: h('2'), files: [file('brand-dna-capture/scripts/capture-brand-dna.mjs'), file('brand-dna-capture/scripts/brand-dna-snippet.js')] }, 'ai-default-patterns': { revision_sha256: h('3'), files: [file('ai-default-patterns/patterns.json')] } } }, items: [] });
  service.packaged = async () => new TextEncoder().encode(JSON.stringify([{ id: 'web-from-catalogue', family: 'web', description: 'A pattern published by the library.', why: 'Test.' }]));
  const r = await service.callTool('prepare_job_context', { request: 'Build a landing page', deliverable_kind: 'web_page' });
  assert.deepEqual(r.annex.defaults_to_avoid.map(d => d.id), ['web-from-catalogue']);
  const capture = r.annex.capture.tools.find(t => t.file === 'capture-brand-dna.mjs');
  assert.equal(capture.status, 'PUBLISHED'); assert.match(capture.resource_url, /\/api\/v1\/resources\/brand-dna-capture\?path=scripts%2Fcapture-brand-dna\.mjs&revision_sha256=2{64}$/);
  assert.equal(r.annex.capture.tools.find(t => t.file === 'check-brand-fidelity.mjs').status, 'CHECK_GET_SKILL');
  // A broken catalogue never blocks grounding.
  service.catalogue = async () => { throw new Error('down'); };
  assert.equal((await service.callTool('prepare_job_context', { request: 'audit my Meta ad account' })).annex.deliverable_kind, 'audit');
});

test('taste questions replace dial questions for every family', () => {
  for (const kind of ['web_page', 'audit', 'strategy', 'code']) { const q = tasteQuestions(kind); assert.equal(q.length, 3); assert.ok(q.every(row => row.question.length > 10 && row.why.length > 0)); }
  assert.equal(resolveMode({ request: 'Improve our product page', kind: 'web_page' }).mode, 'patch');
  assert.equal(resolveMode({ request: 'Make a page', kind: 'web_page', has_existing_asset: false }).mode, 'new');
  assert.equal(resolveMode({ request: 'Make a page', kind: 'web_page' }).confirm, true);
});

test('REST mirrors prepare_job_context at POST /api/v1/job-context', async () => {
  const { handlePublicApi } = await import('../src/server/public-api.ts');
  const asset = async () => new Response('Missing', { status: 404 });
  const env = { PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { fetch: asset } };
  const response = await handlePublicApi(new Request('https://example.test/api/v1/job-context', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.9' }, body: JSON.stringify({ request: 'audit my Meta ad account', deliverable_kind: 'audit' }) }), env);
  const body = await response.json();
  assert.equal(response.status, 200, JSON.stringify(body)); assert.equal(body.schema, 'ai-blocks-job-context/1'); assert.equal(body.annex.kind_source, 'declared');
  const bad = await handlePublicApi(new Request('https://example.test/api/v1/job-context', { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.9' }, body: JSON.stringify({ request: 'x', deliverable_kind: 'poster' }) }), env);
  assert.equal(bad.status, 400);
});
