import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JOB_SCHEMAS, getJobSchema, validateJobDocument, canonicalJobJSON, jobDocumentDigest, routeTextSimilarity, checkJobSchema } from '../src/jobs/contracts.mjs';
import { JOB_TIERS, VARIETY_CONFIG } from '../src/jobs/variety-config.mjs';

const fixtures = JSON.parse(fs.readFileSync(new URL('./fixtures/jobs/contracts.json', import.meta.url), 'utf8'));
const schema = name => `ai-blocks-${name}/1`;
const sample = name => structuredClone(fixtures.find(f => f.schema === (name.includes('/') ? name : schema(name))).valid[0].document);
const check = (name, value, context = {}) => validateJobDocument(name.includes('/') ? name : schema(name), value, context);
const rejects = (name, value, pattern, context = {}) => { const r = check(name, value, context); assert.equal(r.ok, false, JSON.stringify(r)); assert.ok(r.errors.some(e => pattern.test(`${e.path}: ${e.message}`)), JSON.stringify(r.errors)); return r; };

for (const group of fixtures) {
  test(`${group.schema}: published schema and minimum fixture coverage`, () => {
    assert.ok(group.valid.length >= 3); assert.ok(group.invalid.length >= 5);
    const published = getJobSchema(group.schema);
    assert.equal(published.$schema, 'https://json-schema.org/draft/2020-12/schema');
    assert.equal(published.properties.schema.const, group.schema);
  });
  for (const fixture of group.valid) test(`${group.schema}: ${fixture.name}`, () => assert.equal(check(group.schema, fixture.document).ok, true, JSON.stringify(check(group.schema, fixture.document).errors)));
  for (const fixture of group.invalid) test(`${group.schema}: refuses ${fixture.name}`, () => assert.equal(check(group.schema, fixture.document).ok, false));
}

test('all registered schemas have fixture groups and unknown schemas fail safely', () => {
  assert.deepEqual(Object.keys(JOB_SCHEMAS).sort(), fixtures.map(f => f.schema).sort());
  assert.equal(getJobSchema('unknown'), null);
  assert.equal(check('unknown/1', {}).ok, false);
});

test('untrusted values, cycles, huge documents, unsafe keys and deep nesting never throw', () => {
  const cycle = {}; cycle.self = cycle;
  let deep = {}; for (let i = 0; i < 35; i++) deep = { next: deep };
  for (const value of [undefined, null, 1, NaN, Infinity, 1n, () => {}, Symbol('x'), new Date(), cycle, deep, { huge: 'x'.repeat(270000) }, JSON.parse('{"__proto__":{"polluted":true}}')]) {
    assert.doesNotThrow(() => check('job-card', value));
    assert.equal(check('job-card', value).ok, false);
  }
  assert.equal({}.polluted, undefined);
});

test('returns independent errors with exact field paths', () => {
  const d = sample('job-card'); d.audience = ''; d.questions_asked = Array(6).fill({ q: 'Why?', answer: 'Because', by: 'owner' }); d.dials.risk.source = 'guessed';
  const r = check('job-card', d);
  assert.ok(r.errors.some(e => e.path === 'audience'));
  assert.ok(r.errors.some(e => e.path === 'questions_asked'));
  assert.ok(r.errors.some(e => e.path === 'dials.risk.source'));
});

test('request dials require a traceable owner statement or explicit dial input', () => {
  const d = sample('job-card'); d.dials.volume.source = 'request';
  rejects('job-card', d, /dials.volume.source/);
  d.dials.volume.source_ref = 'six'; assert.equal(check('job-card', d).ok, true);
  delete d.dials.volume.source_ref;
  assert.equal(check('job-card', d, { explicit_dials: { volume: 6 } }).ok, true);
  assert.equal(check('job-card', d, { explicit_dials: { volume: 7 } }).ok, false);
  d.questions_asked = [{ q: 'How many?', answer: '6', by: 'owner' }]; assert.equal(check('job-card', d).ok, true);
});

test('recommended defaults are flagged and acceptance thresholds are measurable', () => {
  const d = sample('job-card'), r = check('job-card', d);
  assert.equal(r.warnings.length, 7);
  d.acceptance[0].threshold = 'nice enough'; rejects('job-card', d, /measurable/);
});

test('mix percentages, named presets and focused family choice are enforced', () => {
  const d = sample('job-card'); d.dials.variety_mix.proven = 90;
  const r = rejects('job-card', d, /add up to 100/); assert.ok(r.errors.some(e => /balanced requires/.test(e.message)));
  d.dials.variety_mix = { preset: 'focused', proven: 100, new: 0, outlier: 0, source: 'recommended' };
  rejects('job-card', d, /exactly one family/);
  d.dials.families.value = ['plain-guide']; assert.equal(check('job-card', d).ok, true);
});

test('staffing permits compatible roles and requires independent judges and fact checking', () => {
  const d = sample('ai-blocks-team-plan/2'); assert.equal(check(d.schema, d).ok, true);
  d.seats[5].seat_types.push('maker'); rejects(d.schema, d, /cannot also be makers|judge must stay/);
  d.seats[5].seat_types = ['judge', 'strategist']; rejects(d.schema, d, /stay out of the council/);
});

test('tier caps, red teams, unique lenses and reasoned amendments are checked', () => {
  const d = sample('ai-blocks-team-plan/2'); d.seats[3].seat_types = ['strategist']; d.seats[3].seat_type = 'strategist';
  rejects(d.schema, d, /needs a red_team/);
  d.seats[2].lens = d.seats[1].lens; rejects(d.schema, d, /distinct lenses/);
  d.amendments = [{ change: 'Swap a role', reason: '' }]; rejects(d.schema, d, /amendments\[0\].reason/);
  rejects(d.schema, sample(d.schema), /quick needs/, { tier: 'quick' });
});

test('task lead and group reporting cannot name missing seats, a maker judge or a cycle', () => {
  const d = sample('ai-blocks-team-plan/2'); d.lead_seat_id = 's6'; rejects(d.schema, d, /lead_seat_id/);
  d.lead_seat_id = 's2'; d.working_groups[0].reports_to = 'production'; rejects(d.schema, d, /cycle/);
  d.working_groups[0].reports_to = 'missing'; rejects(d.schema, d, /existing group or seat/);
});

test('pinned toolboxes reject stale revisions and methods outside their palette', () => {
  const d = sample('ai-blocks-team-plan/2');
  const catalogue = [{ slug: 'sample-method', revision_sha256: 'b'.repeat(64) }];
  rejects(d.schema, d, /pinned catalogue revision/, { catalogue });
  const roles = d.seats.map(s => ({ id: s.role_id, resources: [{ slug: 'other-method' }] }));
  rejects(d.schema, d, /does not belong/, { roles });
});

function wideSpread() {
  const d = sample('spread'); d.variety_mix = { preset: 'wide', proven: 20, new: 50, outlier: 30 };
  d.slots = Array.from({ length: 10 }, (_, i) => ({ ...structuredClone(d.slots[0]), slot_id: `d${i}`, family: `family-${i % 5}`, maker_seat: `s${i % 2 + 2}`, items: [{ slug: `method-${i % 5}`, revision_sha256: 'a'.repeat(64) }], mix: i < 2 ? 'proven' : i < 7 ? 'new' : 'outlier' }));
  return d;
}

test('wide spreads require real families, concentration limits and at most two slots per family', () => {
  const d = wideSpread(); assert.equal(check('spread', d).ok, true);
  d.slots[4].family = d.slots[0].family; rejects('spread', d, /at least 5|at most two/);
  d.slots.forEach(s => s.family = 'same-family'); const r = rejects('spread', d, /exceeds 30%/); assert.ok(r.errors.length >= 2);
});

test('focused work and small spreads avoid irrelevant cross-family quota failures', () => {
  const d = sample('spread'); d.variety_mix = { preset: 'focused', proven: 100, new: 0, outlier: 0 }; d.slots.forEach(s => { s.family = 'same-family'; s.items = d.slots[0].items; s.mix = 'proven'; });
  assert.equal(check('spread', d).ok, true);
  d.slots[1].family = 'different'; rejects('spread', d, /one selected family/);
  const small = sample('spread'); small.slots = small.slots.slice(0, 4); small.slots[2].mix = 'new'; small.slots[3].mix = 'outlier'; small.slots.forEach(s => s.family = 'one-family');
  assert.equal(check('spread', small).ok, true);
});

test('spread checks output count, maker independence, methods, mix and outliers', () => {
  const d = sample('spread'); const card = sample('job-card'); card.deliverables[0].count = 7;
  rejects('spread', d, /all 7 requested/, { card });
  d.slots.forEach(s => s.maker_seat = 's2'); rejects('spread', d, /at least two maker/);
  d.slots.forEach(s => s.items = d.slots[0].items); rejects('spread', d, /distinct methods/);
  d.slots.forEach(s => s.mix = 'proven'); const r = rejects('spread', d, /agreed mix/); assert.ok(r.errors.some(e => /at least one outlier/.test(e.message)));
});

test('multiple media tools need a real modality spread unless the job restricts output', () => {
  const d = sample('spread'), host_capabilities = { tools: ['image', 'video'] };
  rejects('spread', d, /two available modalities/, { host_capabilities });
  const card = sample('job-card'); assert.equal(check('spread', d, { card, host_capabilities }).ok, true);
  d.slots[1].modality = 'video'; assert.equal(check('spread', d, { host_capabilities }).ok, true);
});

test('routes reject duplicates after punctuation, case and token-order normalization', () => {
  const d = sample('routes'); assert.equal(routeTextSimilarity('CHECK source records.', 'source RECORDS check'), 1);
  d.routes[1].differs_on = Object.fromEntries(Object.entries(d.routes[0].differs_on).map(([k, v]) => [k, v.toUpperCase() + '!!!']));
  rejects('routes', d, /too similar/);
  d.routes[1].differs_on.mechanism = 'Redesign the product architecture'; assert.equal(check('routes', d).ok, true);
});

test('routes have distinct qualified owners and known evidence references', () => {
  const d = sample('routes'); d.routes[1].owner_seat = d.routes[0].owner_seat; rejects('routes', d, /owner_seat.*unique/);
  d.routes[1].owner_seat = 's6'; rejects('routes', d, /strategist seat/, { team: sample('ai-blocks-team-plan/2') });
  d.routes[0].evidence = ['invented']; rejects('routes', d, /unknown evidence/, { evidence: { claims: [] } });
});

test('standard routes need new and outlier alternatives when the dial calls for them', () => {
  const d = sample('routes'), card = sample('job-card'); d.routes.forEach(r => r.mix = 'proven');
  rejects('routes', d, /new route/, { card });
});

test('council requires two distinct quoted non-owner critiques for every proposal', () => {
  const d = sample('council'); d.critiques[0].by_seat = 's2'; rejects('council', d, /own proposal/);
  d.critiques[0].by_seat = 'c2'; rejects('council', d, /two distinct/);
  d.critiques[0].flaw_quote = 'words absent from the proposal'; rejects('council', d, /does not appear/);
});

test('council rejects self ranking, unknown choices and false Borda results', () => {
  const d = sample('council'); d.ranking.ballots[0].by_seat = 's2'; rejects('council', d, /rank its own/);
  d.ranking.ballots[0].by_seat = 'c1'; d.ranking.result = ['B', 'A']; rejects('council', d, /Borda scores/);
  d.decision.chosen = ['invented']; rejects('council', d, /unknown proposal/);
});

test('untested consensus forces a second red-team pass and records its status honestly', () => {
  const d = sample('council'); d.critiques.filter(c => c.on === 'A').forEach(c => c.flaw = '');
  rejects('council', d, /CONSENSUS_UNTESTED/);
  d.status = 'CONSENSUS_UNTESTED'; rejects('council', d, /both red-team passes/);
  d.red_team.push({ ...d.red_team[0], pass: 2 }); assert.equal(check('council', d).ok, true);
});

test('council dissent can be omitted only after unanimous ballots and two red-team passes', () => {
  const d = sample('council'); delete d.decision.dissent; rejects('council', d, /strongest dissent/);
  d.red_team.push({ ...d.red_team[0], pass: 2 }); assert.equal(check('council', d).ok, true);
});

test('independent judge cannot participate in council or fact-check its own work', () => {
  const team = sample('ai-blocks-team-plan/2'), d = sample('council'); d.ranking.ballots[0].by_seat = 's6';
  rejects('council', d, /independent judge/, { team });
  const e = sample('evidence'); e.claims[0].checked_by = 's2'; rejects('evidence', e, /independent fact checker/, { team });
});

test('review needs a fresh judge, source quotes, all rubric criteria and revision limits', () => {
  const d = sample('review'), team = sample('ai-blocks-team-plan/2'); d.judge_seat = 's2'; rejects('review', d, /independent judge/, { team });
  d.judge_seat = 's6'; d.judge_saw_council = true; rejects('review', d, /judge_saw_council/);
  d.judge_saw_council = false; delete d.items[0].scores.truth; rejects('review', d, /scores.truth/);
  d.items[0].scores.truth = 8; d.loop = 2; rejects('review', d, /revision allowance/, { tier: 'standard' });
  assert.equal(check('review', d, { tier: 'deep' }).ok, true);
});

test('review cannot pass low scores, unquoted work or missing critical acceptance checks', () => {
  const d = sample('review'); Object.keys(d.items[0].scores).forEach(k => d.items[0].scores[k] = 1); rejects('review', d, /below the rubric threshold/);
  Object.keys(d.items[0].scores).forEach(k => d.items[0].scores[k] = 8);
  const production = sample('production'); production.artifacts[0].producer_note = 'Different content'; rejects('review', d, /does not appear/, { production });
  rejects('review', d, /critical acceptance check/, { card: sample('job-card') });
  d.critical_checks = [{ id: 'complete', passed: false, quote: 'A source-backed recommendation' }]; rejects('review', d, /critical check complete failed/, { card: sample('job-card') });
});

test('producer manifests require all planned artifacts, pinned items, evidence and budget reasons', () => {
  const d = sample('production'); d.artifacts[0].budget = { used: 1, allowance: 10 }; rejects('production', d, /less than 60%/);
  d.artifacts[0].budget.reason = 'The cached source was sufficient'; assert.equal(check('production', d).ok, true);
  d.artifacts[0].claims = ['made-up']; rejects('production', d, /missing from the ledger/);
  d.artifacts[0].path = '../outside'; rejects('production', d, /safe relative/);
});

test('delivery requires every pack file, safe paths, exact hashes and unresolved flags', () => {
  const d = sample('job-delivery'); d.files.pop(); rejects('job-delivery', d, /run.json/);
  d.files.push({ path: 'delivery/run.json', sha256: 'a'.repeat(64) }); assert.equal(check('job-delivery', d).ok, true);
  d.files[0].path = 'C:/outside.txt'; rejects('job-delivery', d, /safe relative/);
  const r = sample('review'); r.items[0].verdict = 'REVISE'; r.items[0].notes = 'Fix the issue';
  rejects('job-delivery', sample('job-delivery'), /unresolved review failures/, { review: r });
});

test('preferences enforce workspace scope, no contradictory families and bounded history', () => {
  const d = sample('job-preferences'); rejects('job-preferences', d, /authenticated person/, { owner_scope: 'account:user/workspace' });
  d.general.families = { prefer: ['plain-guide'], avoid: ['plain-guide'] }; rejects('job-preferences', d, /both preferred and avoided/);
  d.history = Array(51).fill({ at: '2026-11-07T00:00:00Z', change: 'Set a default', by: 'explicit_edit' }); rejects('job-preferences', d, /at most 50/);
});

test('approach coverage separates honest gaps from the release completeness requirement', () => {
  const d = sample('approach-index'); d.jobs['write-documents'].families = []; d.jobs['write-documents'].coverage = { status: 'GAP' };
  assert.equal(check('approach-index', d).ok, true);
  rejects('approach-index', d, /at least four families/, { make_counts: { 'write-documents': 10 } });
});

test('approach index rejects missing items, empty families and excessive family memberships', () => {
  const d = sample('approach-index'); rejects('approach-index', d, /unknown catalogue item/, { catalogue: [] });
  d.jobs['write-documents'].families[0].items = []; rejects('approach-index', d, /at least 1 entries/);
  const base = sample('approach-index').jobs['write-documents'].families[0];
  d.jobs['write-documents'].families = Array.from({ length: 4 }, (_, n) => ({ ...base, id: `family-${n}` })); rejects('approach-index', d, /more than three families/);
});

test('rubric weights and pass threshold cannot be weakened by the host', () => {
  const d = sample('rubric'); d.standard[2].weight = 0; rejects('rubric', d, /range must carry weight 15/);
  d.pass.overall = 0.1; rejects('rubric', d, /threshold is 0.75/);
});

test('canonical digests ignore property order and change after a document is edited', async () => {
  assert.equal(canonicalJobJSON({ b: 2, a: 1 }), canonicalJobJSON({ a: 1, b: 2 }));
  assert.equal(await jobDocumentDigest({ a: 1, b: 2 }), await jobDocumentDigest({ b: 2, a: 1 }));
  assert.notEqual(await jobDocumentDigest({ a: 1 }), await jobDocumentDigest({ a: 2 }));
  assert.match(await jobDocumentDigest(sample('job-card')), /^[a-f0-9]{64}$/);
});

test('schema evaluator enforces unique arrays and typed object maps', () => {
  const s = { type: 'object', additionalProperties: { type: 'array', uniqueItems: true, items: { type: 'integer', minimum: 0 } } };
  assert.equal(checkJobSchema(s, { a: [1, 2] }).length, 0);
  assert.equal(checkJobSchema(s, { a: [-1, -1] }).length, 3);
  assert.equal(JOB_TIERS.standard.max_seats, 7); assert.equal(VARIETY_CONFIG.presets.balanced.new, 30);
});
