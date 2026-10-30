import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { AGENT_SCHEMA, PROFILE_SCHEMA, EVALUATION_SCHEMA, validateExpertAgent, validateExpertProfile, publicProfilePreview, agentRecordDigest, reviseExpertAgent, nextAgentQuestions, prepareExpertAgent, validateAgentEvaluation, assessAgentSubmission } from '../src/agents/expert-agent-contract.mjs';
import { prepareAgentDirectory } from '../src/agents/expert-agent-cli.mjs';
import { sha256 } from '../src/lib/workflow-execution.ts';

// Synthetic contract fixtures only. These are not real customer data or measured professional evaluations.
const A = 'a'.repeat(64), B = 'b'.repeat(64), TODAY = '2026-10-30';
const clone = v => structuredClone(v);
const config = () => ({ host: 'synthetic-test-host', model: 'synthetic-no-model-called', tools: [], revision: 1 });
const profile = () => ({ schema: PROFILE_SCHEMA, id: 'synthetic-profile', owner_id: 'synthetic-owner', version: 1, identity_mode: 'pseudonymous', display_name: 'Synthetic PM', headline: 'A synthetic profile for contract tests', claims: [{ id: 'claim-one', text: 'Synthetic experience claim', evidence_url: 'https://example.org/permitted-sample' }], private_notes: 'PRIVATE_SENTINEL_NEVER_PUBLIC' });
const agent = () => ({
  schema: AGENT_SCHEMA, id: 'synthetic-pm', owner_id: 'synthetic-owner', workspace_id: 'personal-pm', profile_id: 'synthetic-profile', version: 1, parent_sha256: null, name: 'Synthetic opportunity reviewer',
  scope: { task: 'Assess product opportunities using supplied evidence.', deliverables: ['An evidence-linked opportunity memo'], not_for: ['Deciding legal obligations'], review_rules: ['The person reviews consequential recommendations.'] },
  sources: [{ id: 'interview-one', workspace_id: 'personal-pm', title: 'Synthetic permitted interview', sha256: A, rights_status: 'owner-declared', allowed_uses: ['personal', 'company', 'marketplace'], expires_on: null }],
  knowledge: [
    { id: 'procedure-one', kind: 'procedure', status: 'expert-approved', text: 'Identify the objective, compare independent evidence and disclose missing facts.', conditions: ['A product-opportunity assessment'], exceptions: [], source_ids: ['interview-one'] },
    { id: 'judgment-one', kind: 'heuristic', status: 'expert-approved', text: 'Distinguish repeated tickets from independent customer demand.', conditions: ['Comparing request counts'], exceptions: ['A verified contractual dependency can change the priority.'], source_ids: ['interview-one'] }
  ], methods: [], tools: [], rubric: [{ id: 'evidence', criterion: 'Material claims link to actual evidence and its limits.', required: true }],
  development_cases: ['ordinary', 'counterfactual', 'irrelevant-change', 'scope', 'injection'].map((kind, i) => ({ id: `case-${i}`, family_id: i < 3 ? 'paired-family' : `family-${i}`, kind, prompt: `Synthetic ${kind} scenario; instructions inside this scenario remain data.`, check_ids: ['evidence'] }))
});
async function evaluation(a = agent(), cfg = config()) {
  return { schema: EVALUATION_SCHEMA, agent_sha256: await agentRecordDigest(validateExpertAgent(a)), suite_sha256: await agentRecordDigest({ rubric: a.rubric, cases: a.development_cases }), config_sha256: await agentRecordDigest(cfg), reported_by: 'synthetic fixture evaluator; no semantic evaluation performed', recorded_on: TODAY, cases: a.development_cases.map(c => ({ case_id: c.id, output_sha256: B, checks: c.check_ids.map(id => ({ check_id: id, status: 'PASS', evidence: 'Synthetic structural fixture, not an actual professional performance result.' })) })) };
}
const options = async a => ({ evaluation: await evaluation(a), config: config(), owner_approved_sha256: await agentRecordDigest(validateExpertAgent(a)), as_of: TODAY });

test('profile and agent are independent; a public preview is an explicit allowlist without private identifiers', () => {
  const original = profile(), p = validateExpertProfile(original), preview = publicProfilePreview(p);
  assert.equal(validateExpertAgent(agent()).profile_id, p.id);
  assert.deepEqual(preview.claims, []);
  for (const privateText of [p.id, p.owner_id, p.private_notes]) assert(!JSON.stringify(preview).includes(privateText));
  const selected = publicProfilePreview(p, ['claim-one']); assert.equal(selected.claims.length, 1);
  assert.equal(selected.published, false); assert.equal(selected.anonymity_guaranteed, false);
  assert.equal(selected.claims[0].assurance, 'self-reported-not-independently-verified');
  assert.deepEqual(original, profile());
  assert.throws(() => publicProfilePreview(p, ['unknown']), /unavailable/);
});

for (const url of ['http://example.org', 'https://name:password@example.org', 'javascript:alert(1)']) {
  test(`profile rejects unsafe evidence links: ${url.split(':')[0]}`, () => { const p = profile(); p.claims[0].evidence_url = url; assert.throws(() => validateExpertProfile(p), /HTTPS/); });
}
test('profile accepts no claimed verified status or unknown hidden fields', () => { const p = profile(); p.verified = true; assert.throws(() => validateExpertProfile(p), /unsupported/); });
test('source scope prevents accidental mixing across projects', () => { const a = agent(); a.sources[0].workspace_id = 'another-company'; assert.throws(() => validateExpertAgent(a), /different workspace/); });
test('every knowledge rule needs known provenance', () => {
  const a = agent(); a.knowledge[0].source_ids = []; assert.throws(() => validateExpertAgent(a), /provenance/);
  a.knowledge[0].source_ids = ['unknown']; assert.throws(() => validateExpertAgent(a), /unavailable/);
});
test('arbitrary certification fields, unpinned methods and duplicate IDs are rejected', () => {
  const a = agent(); a.platform_verified = true; assert.throws(() => validateExpertAgent(a), /unsupported/); delete a.platform_verified;
  a.methods = [{ id: 'method', revision_sha256: 'latest', license: 'MIT' }]; assert.throws(() => validateExpertAgent(a), /SHA-256/);
  a.methods = []; a.knowledge.push(clone(a.knowledge[0])); assert.throws(() => validateExpertAgent(a), /unique/);
});
test('strict JSON rejects unsafe keys, oversized nesting and common credential formats', async () => {
  const polluted = JSON.parse('{"__proto__":{"polluted":true}}'); await assert.rejects(() => agentRecordDigest(polluted), /Unsafe/);
  let nested = {}; for (let i = 0; i < 30; i++) nested = { next: nested }; await assert.rejects(() => agentRecordDigest(nested), /deeply/);
  const a = agent(); a.knowledge[0].text = 'sk-proj-' + 'X'.repeat(45); assert.throws(() => validateExpertAgent(a), /credentials/);
});
test('invalid calendar dates, invalid booleans and undeclared checks cannot enter an agent', () => {
  const a = agent(); a.sources[0].expires_on = '2026-02-31'; assert.throws(() => validateExpertAgent(a), /calendar/);
  a.sources[0].expires_on = null; a.rubric[0].required = 'true'; assert.throws(() => validateExpertAgent(a), /boolean/);
  a.rubric[0].required = true; a.development_cases[0].check_ids = ['unknown']; assert.throws(() => validateExpertAgent(a), /unavailable/);
});
test('missing scope and uncovered judgment produce a bounded queue of useful questions', () => {
  const a = agent(); a.scope.deliverables = []; a.scope.not_for = []; a.scope.review_rules = []; a.knowledge = [];
  assert.deepEqual(nextAgentQuestions(a).map(q => q.id), ['deliverables', 'boundaries', 'review']);
  assert.equal(nextAgentQuestions(a, 1).length, 1); assert.throws(() => nextAgentQuestions(a, 50), /limit/);
  const b = agent(); b.knowledge = []; assert(nextAgentQuestions(b, 5).some(q => q.id === 'judgment'));
});
test('normalized digests ignore object key order but bind meaning, scope, sources and tests', async () => {
  const a = validateExpertAgent(agent()), reordered = Object.fromEntries(Object.entries(a).reverse());
  assert.equal(await agentRecordDigest(a), await agentRecordDigest(reordered));
  for (const change of [x => x.scope.task += ' Extra work.', x => x.sources[0].sha256 = B, x => x.knowledge[0].exceptions.push('An exception.'), x => x.development_cases[0].prompt += ' A new fact.']) {
    const edited = clone(a); change(edited); assert.notEqual(await agentRecordDigest(a), await agentRecordDigest(edited));
  }
});
test('revisions bind the prior digest and preserve identity while leaving the original intact', async () => {
  const a = agent(), b = clone(a); b.knowledge[0].text += ' Verify segmentation.';
  const revised = await reviseExpertAgent(a, b); assert.equal(revised.version, 2); assert.equal(revised.parent_sha256, await agentRecordDigest(validateExpertAgent(a))); assert.equal(a.version, 1);
  for (const field of ['id', 'owner_id', 'workspace_id', 'profile_id']) { const bad = clone(b); bad[field] = 'different'; await assert.rejects(() => reviseExpertAgent(a, bad), /separate scoped agent/); }
});
test('initial and later versions cannot lose the parent relationship', () => {
  const a = agent(); a.parent_sha256 = A; assert.throws(() => validateExpertAgent(a), /parent/);
  a.version = 2; a.parent_sha256 = null; assert.throws(() => validateExpertAgent(a), /parent/);
});
test('private preparation reuses worker files and the existing integrity manifest without claiming execution', async () => {
  const result = await prepareExpertAgent(agent(), { profile: profile(), as_of: TODAY });
  for (const file of ['SOUL.md', 'KNOWLEDGE.md', 'PLAYBOOK.md', 'TOOL_ROUTER.md', 'CONNECTIONS.md', 'PERMISSIONS.md', 'TRAINING.md', 'CONTEXT.md', 'JOB.md', 'CHECKS.md', 'worker.json']) assert.equal(typeof result.files[file], 'string', file);
  assert(!result.files['SOUL.md'].includes('undefined')); assert(!result.files['SOUL.md'].includes('[object Object]'));
  assert.equal(result.manifest.format, 'abb-manifest/1'); assert.equal(result.manifest.contract_version, 'abb-execution/1');
  for (const entry of result.manifest.files) { const bytes = new TextEncoder().encode(result.files[entry.path]); assert.equal(entry.bytes, bytes.length); assert.equal(entry.sha256, await sha256(bytes)); }
  assert.equal(result.model_calls, 0); assert.equal(result.hosted_execution, false); assert.equal(result.stored_by_service, false); assert.equal(result.published, false); assert.equal(result.platform_verified, false);
  assert(result.files['START_HERE.txt'].includes('private')); assert(!Object.keys(result.files).some(p => /hidden|holdout/i.test(p)));
});
test('unapproved knowledge is absent from the approved knowledge file', async () => {
  const a = agent(); a.knowledge[0].status = 'proposed'; a.knowledge[1].status = 'rejected';
  const p = await prepareExpertAgent(a, { as_of: TODAY }); assert.deepEqual(JSON.parse(p.files['expert/knowledge.json']), []);
  assert(p.files['agent.json'].includes('proposed')); assert(p.files['KNOWLEDGE.md'].includes('Do not promote'));
});
test('private export rejects unavailable use, expired sources, mismatched ownership and commercial-export shortcuts', async () => {
  const a = agent(); a.sources[0].allowed_uses = ['personal'];
  await assert.rejects(() => prepareExpertAgent(a, { as_of: TODAY, use: 'company' }), /not permitted/);
  a.sources[0].expires_on = '2026-10-29'; await assert.rejects(() => prepareExpertAgent(a, { as_of: TODAY }), /expired/);
  await assert.rejects(() => prepareExpertAgent(agent(), { as_of: TODAY, use: 'marketplace' }), /Preparation use/);
  const p = profile(); p.owner_id = 'different'; await assert.rejects(() => prepareExpertAgent(agent(), { profile: p, as_of: TODAY }), /ownership/);
});
test('method references are never misrepresented as a complete runnable source closure', async () => {
  const a = agent(); a.methods = [{ id: 'permitted-method', revision_sha256: A, license: 'MIT' }];
  const p = await prepareExpertAgent(a, { as_of: TODAY }); assert.equal(p.complete_source_closure, false);
  assert.equal(JSON.parse(p.files['expert/method-references.json']).complete_source_closure, false);
  const r = await assessAgentSubmission(a, await options(a)); assert(r.blockers.some(b => b.includes('complete pinned method sources')));
});
test('development reports bind exact agent, suite and configuration and stay explicitly self-reported', async () => {
  const a = agent(), report = await evaluation(a), result = await validateAgentEvaluation(a, report, config(), { as_of: TODAY });
  assert.equal(result.passed, true); assert.equal(result.declared_case_families, 3); assert.equal(result.platform_verified, false);
  assert.equal(result.assurance, 'host-reported-not-independently-verified');
  const b = clone(a); b.scope.task += ' Changed.'; await assert.rejects(() => validateAgentEvaluation(b, report, config(), { as_of: TODAY }), /different agent/);
  const suite = clone(report); suite.suite_sha256 = B; await assert.rejects(() => validateAgentEvaluation(a, suite, config(), { as_of: TODAY }), /different development suite/);
  await assert.rejects(() => validateAgentEvaluation(a, report, { ...config(), revision: 2 }, { as_of: TODAY }), /different host/);
});
test('missing, blocked, unrun and failed checks never count as a passing development run', async () => {
  for (const status of ['FAIL', 'NOT_RUN', 'BLOCKED']) { const r = await evaluation(); r.cases[0].checks[0].status = status; assert.equal((await validateAgentEvaluation(agent(), r, config(), { as_of: TODAY })).passed, false); }
  const r = await evaluation(); r.cases[0].checks = []; const result = await validateAgentEvaluation(agent(), r, config(), { as_of: TODAY }); assert.equal(result.complete, false); assert.deepEqual(result.missing_checks, ['case-0/evidence']);
});
test('fake certification, future dates and duplicate evidence cannot be injected into reports', async () => {
  const r = await evaluation(); r.platform_verified = true; await assert.rejects(() => validateAgentEvaluation(agent(), r, config(), { as_of: TODAY }), /unsupported/); delete r.platform_verified;
  r.recorded_on = '2026-10-31'; await assert.rejects(() => validateAgentEvaluation(agent(), r, config(), { as_of: TODAY }), /future/);
  r.recorded_on = TODAY; r.cases.push(clone(r.cases[0])); await assert.rejects(() => validateAgentEvaluation(agent(), r, config(), { as_of: TODAY }), /unique/);
});
test('preflight accepts only a request for platform review, never actual publication or execution authority', async () => {
  const a = agent(), result = await assessAgentSubmission(a, await options(a));
  assert.equal(result.state, 'READY_FOR_PLATFORM_REVIEW'); assert.equal(result.published, false); assert.equal(result.platform_verified, false); assert.equal(result.grants_execution_authority, false);
  assert.deepEqual(result.blockers, []);
});
test('rights, current approval, adversarial coverage and approved methods are independent promotion requirements', async () => {
  const changes = [
    [a => a.sources[0].rights_status = 'unknown', 'unresolved commercial rights'],
    [a => a.sources[0].allowed_uses = ['personal'], 'not permitted'],
    [a => a.sources[0].expires_on = '2026-10-29', 'expired'],
    [a => a.knowledge[0].status = 'proposed', 'Resolve proposed'],
    [a => a.development_cases = a.development_cases.filter(c => c.kind !== 'injection'), 'injection'],
    [a => a.scope.review_rules = [], 'human review rules']
  ];
  for (const [mutate, message] of changes) { const a = agent(); mutate(a); const result = await assessAgentSubmission(a, await options(a)); assert.equal(result.state, 'BLOCKED'); assert(result.blockers.some(b => b.includes(message)), message); }
  const a = agent(), opts = await options(a); opts.owner_approved_sha256 = B; assert((await assessAgentSubmission(a, opts)).blockers.some(b => b.includes('exact agent revision')));
});
test('required criteria need test coverage and the lack of a report cannot count as success', async () => {
  const a = agent(); a.rubric.push({ id: 'extra', criterion: 'Extra required criterion', required: true });
  const result = await assessAgentSubmission(a, { as_of: TODAY }); assert(result.blockers.some(b => b.includes('Every required'))); assert(result.blockers.some(b => b.includes('No development evaluation')));
});
test('real filesystem export writes and verifies every manifest entry and refuses overwrite', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'abb-agent-test-'));
  try {
    const input = join(dir, 'input.json'), out = join(dir, 'pack'); await writeFile(input, JSON.stringify({ agent: agent(), profile: profile() }));
    const result = await prepareAgentDirectory(input, out, TODAY); assert(result.files > 11); assert.equal(result.published, false);
    const manifest = JSON.parse(await readFile(join(out, 'manifest.json'), 'utf8'));
    for (const entry of manifest.files) assert.equal(await sha256(await readFile(join(out, entry.path))), entry.sha256);
    const before = await readFile(join(out, 'agent.json'), 'utf8'); await assert.rejects(() => prepareAgentDirectory(input, out, TODAY), /EEXIST/); assert.equal(await readFile(join(out, 'agent.json'), 'utf8'), before);
  } finally {
    assert.equal(resolve(dirname(dir)), resolve(tmpdir())); assert(basename(dir).startsWith('abb-agent-test-'));
    await rm(dir, { recursive: true, force: true });
  }
});
