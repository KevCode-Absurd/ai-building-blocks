import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareScopedRequest } from '../src/intake/request-scope.mjs';
import { createScopeMcpService } from '../src/intake/request-scope-mcp.mjs';
import { outcomeDeliveryInstructions } from '../src/intake/outcome-delivery.mjs';
import { outcomeScope } from './fixtures/outcome-delivery-fixtures.mjs';

const fixture = outcomeScope;
const service = () => createScopeMcpService({ async callTool() { assert.fail('A selection must not execute or contact the catalogue.'); } });

test('chosen recommendations become our orchestrator packet with prerequisites and no unselected prompts', async () => {
  const prepared = await prepareScopedRequest(fixture());
  const handoff = await service().callTool('prepare_recommendation_handoff', { scope: prepared.scope, scope_sha256: prepared.scope_sha256, selected_recommendation_ids: ['R1'] });
  assert.deepEqual(handoff.selected_recommendation_ids, ['R1']);
  assert.deepEqual(new Set(handoff.work_ids), new Set(['audit', 'fix']));
  assert.deepEqual(handoff.prerequisite_work_ids, ['audit']);
  assert.deepEqual(handoff.deferred_recommendation_ids, ['R2']);
  assert(handoff.files['prompts/audit.txt']); assert(handoff.files['prompts/fix.txt']);
  assert.equal(handoff.files['prompts/other-fix.txt'], undefined);
  assert.match(handoff.files['delivery/NEXT-ORCHESTRATOR.md'], /OUR|our next|Continue the selected/);
  assert.equal(handoff.review.grants_execution_authority, false);
  assert.equal(handoff.hosted_execution, false); assert.equal(handoff.stored_by_service, false);
  assert.deepEqual(handoff.next_call.arguments.selected_recommendation_ids, ['R1']);
  assert.deepEqual(handoff.work.find(w => w.id === 'fix').deliverables, prepared.work.find(w => w.id === 'fix').deliverables);
});

test('stale evidence or objective revisions invalidate a selection; a different choice has a different digest', async () => {
  const prepared = await prepareScopedRequest(fixture());
  const invoke = (scope, selected = ['R1']) => service().callTool('prepare_recommendation_handoff', { scope, scope_sha256: prepared.scope_sha256, selected_recommendation_ids: selected });
  const a = await invoke(prepared.scope), b = await invoke(prepared.scope, ['R2']);
  assert.notEqual(a.selection_sha256, b.selection_sha256);
  const changed = structuredClone(prepared.scope); changed.delivery.guardrails.push('A new business constraint.');
  await assert.rejects(() => invoke(changed), /exact scope/);
  await assert.rejects(() => invoke(prepared.scope, ['R99']), /Unknown selected/);
  await assert.rejects(() => invoke(prepared.scope, ['R1', 'R1']), /unique/);
  await assert.rejects(() => invoke(prepared.scope, []), /at least/);
});

test('missing data needs a usable acquisition route; it does not become supplied through selection', async () => {
  const s = fixture();
  s.data_needs = [{ id: 'logs', name: 'Activation logs', why: 'Reproduce the error.', status: 'MISSING', required_for: ['fix'], source_ids: [], alternative: 'A redacted export.' }];
  await assert.rejects(() => prepareScopedRequest(s), /concrete acquisition/);
  s.delivery.data_requests = [{ data_id: 'logs', owner: 'Project owner', route: 'CSV', steps: ['Export activation attempts from the existing system.', 'Save the redacted file into the authorized local project.'], fields: ['event time', 'pseudonymous attempt id', 'result code'], alternative: 'Use an authorized read-only log connector.' }];
  const prepared = await prepareScopedRequest(s);
  assert.equal(prepared.work.find(w => w.id === 'audit').state, 'READY_FOR_PLAN_REVIEW');
  assert.equal(prepared.work.find(w => w.id === 'fix').state, 'NEEDS_INPUT');
  const h = await service().callTool('prepare_recommendation_handoff', { scope: prepared.scope, scope_sha256: prepared.scope_sha256, selected_recommendation_ids: ['R1'] });
  assert(h.work.find(w => w.id === 'fix').blockers.some(x => x.includes('logs')));
  assert.match(h.files['delivery/DATA-REQUESTS.md'], /pseudonymous attempt id/);
  assert.equal(h.state, 'EXECUTION_PROPOSAL_REQUIRES_REVIEW');
});

test('unreliable evidence blocks corrective work, while diagnosis and independent investigations can proceed', async () => {
  const s = fixture(true); s.delivery.evidence_reviews.find(r => r.source_id === 'repo').status = 'UNRELIABLE';
  const prepared = await prepareScopedRequest(s);
  assert.equal(prepared.work.find(w => w.id === 'audit').state, 'READY_FOR_PLAN_REVIEW');
  assert.equal(prepared.work.find(w => w.id === 'fix').state, 'NEEDS_INPUT');
  assert(prepared.work.find(w => w.id === 'fix').blockers.some(x => x.includes('Evidence review')));
  s.delivery.evidence_reviews.find(r => r.source_id === 'repo').status = 'LIMITED';
  assert.equal((await prepareScopedRequest(s)).work.find(w => w.id === 'fix').state, 'READY_FOR_PLAN_REVIEW');
});

test('selection preserves action boundaries and does not convert a missing tool into authorization', async () => {
  const s = fixture(); s.tools = [{ id: 'publish', name: 'Publish', access: 'write', status: 'MISSING', authorization: 'NEEDS_APPROVAL', scope: 'Synthetic live system', source_ids: [] }]; s.work[0].tool_ids = ['publish'];
  const p = await prepareScopedRequest(s);
  const h = await service().callTool('prepare_recommendation_handoff', { scope: p.scope, scope_sha256: p.scope_sha256, selected_recommendation_ids: ['R1'] });
  const fix = h.work.find(w => w.id === 'fix');
  assert.equal(fix.brief.tool_requirements[0].authorization, 'NEEDS_APPROVAL');
  assert(fix.execution_blockers.some(x => x.includes('authorization')));
  assert(fix.execution_blockers.some(x => x.includes('not verified')));
  assert.equal(h.review.grants_execution_authority, false);
});

test('routing honors the recommendation selection and never discovers unselected work', async () => {
  const calls = [], s = fixture(), p = await prepareScopedRequest(s);
  const f = createScopeMcpService({ async callTool(name, args) { calls.push({ name, args }); return { candidates: [] }; } });
  const routed = await f.callTool('route_scoped_specialist_work', { scope: p.scope, scope_sha256: p.scope_sha256, selected_recommendation_ids: ['R1'] });
  assert.deepEqual(new Set(routed.routed.map(x => x.work_id)), new Set(['audit', 'fix']));
  assert.equal(calls.length, 2);
});

test('outcome methods include evidence checks, host-local operation, executable handoff and honest feedback', () => {
  const instructions = outcomeDeliveryInstructions();
  for (const phrase of ['user\'s connected AI', 'authorized local files', 'OUR next orchestrator', 'real tools', 'guardrails', 'feedback', 'ROAS equals attributed AOV divided by CPA']) assert(instructions.includes(phrase), phrase);
});

test('a globally required diagnostic source also needs a concrete acquisition path', async () => {
  const s = fixture(true);
  s.data_needs = [{ id: 'global', name: 'Diagnostic evidence', why: 'Required for the investigation.', status: 'MISSING', source_ids: [], required_for: ['diagnosis'] }];
  await assert.rejects(() => prepareScopedRequest(s), /concrete acquisition/);
});
