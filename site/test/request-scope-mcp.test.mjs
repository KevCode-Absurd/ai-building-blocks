import { outcomeScope } from './fixtures/outcome-delivery-fixtures.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { prepareScopedRequest } from '../src/intake/request-scope.mjs';
import { createScopeMcpService, scopeMcpTools } from '../src/intake/request-scope-mcp.mjs';
import { directScope, diagnosticScope, teamFor } from './fixtures/request-scope-fixtures.mjs';

const publicDir = process.env.SCOPE_TEST_CATALOGUE_DIR ?? fileURLToPath(new URL('../public', import.meta.url));
const asset = async uri => { try { return new Response(fs.readFileSync(path.join(publicDir, uri.slice(1)))); } catch { return new Response('Missing', { status: 404 }); } };
function fixture() {
  const actual = new PublicCatalogueService(asset, 'https://example.test'), calls = [];
  return { calls, service: createScopeMcpService({ async callTool(name, args) { calls.push({ name, args }); return actual.callTool(name, args); } }) };
}
function realPlan(prepared) {
  const plan = teamFor(prepared);
  for (const s of plan.stages) {
    const role = JSON.parse(fs.readFileSync(path.join(publicDir, 'data/roles/' + s.role_id + '.json')));
    const method = role.resources.find(r => r.slug === role.lead); assert(method);
    s.methods = [{ slug: method.slug, revision_sha256: method.revision }];
  }
  return plan;
}
const assignments = p => p.work.map(w => ({ work_id: w.id, stage_id: w.id }));

test('declared evidence revisions survive scope normalization and must match selected team context', async () => {
  const f = fixture(), s = directScope(); s.sources[0].revision_sha256 = 'b'.repeat(64);
  const p = await prepareScopedRequest(s), plan = realPlan(p);
  assert.equal(p.scope.sources[0].revision_sha256, s.sources[0].revision_sha256);
  const invoke = () => f.service.callTool('prepare_scoped_specialist_team', { scope: p.scope, scope_sha256: p.scope_sha256, plan, assignments: assignments(p) });
  await assert.rejects(invoke, /source revisions/);
  plan.context[0].revision_sha256 = 'c'.repeat(64); await assert.rejects(invoke, /source revisions/);
  plan.context[0].revision_sha256 = s.sources[0].revision_sha256;
  const r = await invoke(); assert.equal(r.plan.context[0].revision_sha256, s.sources[0].revision_sha256);
  s.sources[0].revision_sha256 = 'c'.repeat(64); assert.notEqual((await prepareScopedRequest(s)).scope_sha256, p.scope_sha256);
  for (const invalid of ['not-a-hash', ['b'.repeat(64)], null]) {
    s.sources[0].revision_sha256 = invalid; await assert.rejects(() => prepareScopedRequest(s), /SHA-256 source/);
  }
});

test('partial team exports only selected prompts and explicitly retains deferred and blocked backlog', async () => {
  const f = fixture(), s = diagnosticScope(); s.findings[0].status = 'HYPOTHESIS';
  s.work.push({ ...structuredClone(s.work[1]), id: 'later-audit', title: 'Optional independent audit' });
  const p = await prepareScopedRequest(s), plan = realPlan(p); plan.stages = plan.stages.filter(s => s.id === 'audit');
  const r = await f.service.callTool('prepare_scoped_specialist_team', { scope: p.scope, scope_sha256: p.scope_sha256, plan, assignments: [{ work_id: 'audit', stage_id: 'audit' }] });
  const selection = JSON.parse(r.files['scope/selection.json']);
  assert.deepEqual(Object.fromEntries(selection.work.map(w => [w.work_id, w.disposition])), { audit: 'SELECTED', fix: 'BLOCKED', 'later-audit': 'DEFERRED' });
  assert(r.files['scope/prompts/audit.txt']); assert.equal(r.files['scope/prompts/fix.txt'], undefined); assert.equal(r.files['scope/prompts/later-audit.txt'], undefined);
  assert.equal(JSON.parse(r.files['scope/scope.json']).work.length, 3); assert(r.files['START_HERE.txt'].includes('must not run'));
});

test('real catalogue matching uses explicit discovery text and preserves private brief separately', async () => {
  const f = fixture(), s = directScope(); s.subject += ' PRIVATE_CONTEXT_SENTINEL';
  const p = await f.service.callTool('prepare_scoped_specialist_work', { scope: s });
  const routed = await f.service.callTool('route_scoped_specialist_work', { scope: s, scope_sha256: p.scope_sha256 });
  assert.deepEqual(routed.routed.map(r => r.work_id), ['audit', 'fix']); assert(routed.routed[0].candidates.some(r => r.id === 'seo-specialist'));
  assert(routed.routed[1].candidates.some(r => r.id === 'coding-specialist'));
  assert(!JSON.stringify(f.calls).includes('PRIVATE_CONTEXT_SENTINEL')); assert(routed.routed[0].prompt.includes('PRIVATE_CONTEXT_SENTINEL'));
  assert.equal(routed.hosted_execution, false);
  assert(routed.routed[0].candidates.every(r => r.area === 'marketing'));
  assert(routed.routed[1].candidates.every(r => r.area === 'engineering'));
});
test('blocked corrective work is never matched; a ready diagnostic producer is matched', async () => {
  const f = fixture(), s = diagnosticScope(); s.findings[0].status = 'HYPOTHESIS';
  const p = await prepareScopedRequest(s), r = await f.service.callTool('route_scoped_specialist_work', { scope: s, scope_sha256: p.scope_sha256 });
  assert.equal(f.calls.length, 1); assert.equal(r.routed[1].state, 'NEEDS_INPUT'); assert.deepEqual(r.routed[1].candidates, []);
});
test('real specialist team preparation validates current methods and binds the exact scope without execution', async () => {
  const f = fixture(), p = await prepareScopedRequest(directScope());
  const plan = realPlan(p); const from = plan.stages[1].inputs[0].from;
  plan.stages[1].inputs[0].from = { output_id: from.output_id, stage_id: from.stage_id };
  const r = await f.service.callTool('prepare_scoped_specialist_team', { scope: p.scope, scope_sha256: p.scope_sha256, plan, assignments: assignments(p) });
  assert.equal(r.source_revisions_checked, true); assert.equal(r.state, 'AWAITING_REVIEW');
  assert.equal(r.scoping.scope_sha256, p.scope_sha256); assert.equal(r.scoping.plan_sha256, r.plan_sha256);
  assert(r.plan.notes.includes(p.scope_sha256)); assert(r.files['scope/prompts/fix.txt']); assert.equal(r.execution.model_calls_by_service, 0);
  assert(r.files['START_HERE.txt'].includes('scope/SCOPE.md')); assert.equal(JSON.parse(r.files['scope/scope.json']).request, p.scope.request);
  assert.equal(r.review.grants_execution_authority, false);
});
test('stale dossiers, removed dependencies, changed outputs and missing evidence stop before team preparation', async () => {
  const f = fixture(), s = directScope(), p = await prepareScopedRequest(s);
  s.goal += ' altered'; await assert.rejects(() => f.service.callTool('route_scoped_specialist_work', { scope: s, scope_sha256: p.scope_sha256 }), /exact scope/);
  const invoke = plan => f.service.callTool('prepare_scoped_specialist_team', { scope: p.scope, scope_sha256: p.scope_sha256, plan, assignments: assignments(p) });
  let plan = realPlan(p); plan.stages[1].depends_on = []; await assert.rejects(() => invoke(plan), /dependencies/);
  plan = realPlan(p); plan.stages[1].outputs[0].name = 'Unrelated output'; await assert.rejects(() => invoke(plan), /deliverables/);
  plan = realPlan(p); plan.context = []; await assert.rejects(() => invoke(plan), /source locators/);
  plan = realPlan(p); plan.stages[1].inputs = []; await assert.rejects(() => invoke(plan), /input handoffs/);
  assert.equal(f.calls.length, 0);
});
test('a team cannot add unscoped authority or promote an unresolved tool permission', async () => {
  const f = fixture(), s = directScope(); s.tools = [{ id: 'deploy', name: 'Deploy preview', access: 'write', status: 'MISSING', authorization: 'NEEDS_APPROVAL', scope: 'Synthetic preview only' }]; s.work[0].tool_ids = ['deploy'];
  const p = await prepareScopedRequest(s), plan = realPlan(p); plan.permissions = [{ id: 'deploy', action: 'Deploy preview', scope: 'Synthetic preview only', status: 'GRANTED', evidence: 'A caller claim is insufficient.' }];
  const invoke = () => f.service.callTool('prepare_scoped_specialist_team', { scope: p.scope, scope_sha256: p.scope_sha256, plan, assignments: assignments(p) });
  await assert.rejects(invoke, /unresolved authority/); assert.equal(f.calls.length, 0);
  plan.permissions[0].status = 'NEEDS_APPROVAL'; const r = await invoke(); assert(r.scoping.execution_blockers.length === 2); assert.equal(r.state, 'AWAITING_REVIEW');
  plan.permissions.push({ id: 'unscoped', action: 'Publish', scope: 'Anywhere', status: 'NEEDS_APPROVAL' }); await assert.rejects(invoke, /unscoped permissions/);
});
test('no-match, unavailable catalogue and undocumented input remain explicit', async () => {
  const p = await prepareScopedRequest(directScope());
  const empty = createScopeMcpService({ callTool: async () => ({ candidates: [] }) });
  const r = await empty.callTool('route_scoped_specialist_work', { scope: p.scope, scope_sha256: p.scope_sha256 }); assert(r.routed.every(r => r.state === 'NO_MATCH'));
  const bad = createScopeMcpService({ callTool: async () => ({ wrong: true }) });
  await assert.rejects(() => bad.callTool('route_scoped_specialist_work', { scope: p.scope, scope_sha256: p.scope_sha256 }), /candidate records/);
  await assert.rejects(() => empty.callTool('scope_specialist_request', { request: 'help', execute: true }), /documented/);
  assert(scopeMcpTools.every(t => t.annotations.readOnlyHint));
});
test('official MCP stdio client completes qualification, scoped matching, source retrieval and exact team preparation', async () => {
  const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../scripts/scoping-mcp-preview.mjs', import.meta.url)), '--catalogue-dir', publicDir], stderr: 'pipe' });
  const client = new Client({ name: 'synthetic-scoping-trial', version: '1' });
  try {
    await client.connect(transport);
    const tools = (await client.listTools()).tools.map(t => t.name);
    assert(tools.includes('scope_specialist_request') && tools.includes('prepare_scoped_specialist_team'));
    assert(!tools.includes('find_specialist') && !tools.includes('prepare_specialist_team'));
    const call = async (name, args) => { const result = await client.callTool({ name, arguments: args }); assert(!result.isError, JSON.stringify(result.content)); return result.structuredContent; };
    const triage = await call('scope_specialist_request', { request: 'My business is failing.' }); assert.equal(triage.state, 'QUALIFICATION_REQUIRED');
    const s = directScope(), p = await call('prepare_scoped_specialist_work', { scope: s });
    const route = await call('route_scoped_specialist_work', { scope: s, scope_sha256: p.scope_sha256 }); assert(route.routed[0].candidates.length);
    const resource = await client.readResource({ uri: 'aiblocks://roles/seo-specialist' }); assert(resource.contents.length);
    const team = await call('prepare_scoped_specialist_team', { scope: s, scope_sha256: p.scope_sha256, plan: realPlan(p), assignments: assignments(p) }); assert.equal(team.state, 'AWAITING_REVIEW'); assert.equal(team.scoping.scope_sha256, p.scope_sha256);
  } finally { await client.close(); }
});

test('selected recommendations require a complete assigned or explicitly deferred work partition and bind the exact choice', async () => {
  const f = fixture(), p = await prepareScopedRequest(outcomeScope()), full = realPlan(p);
  const partial = structuredClone(full); partial.stages = partial.stages.filter(s => s.id !== 'other-fix');
  const chosenAssignments = assignments(p).filter(a => a.work_id !== 'other-fix');
  const invoke = (ids, deferred_work, plan = partial, selectedAssignments = chosenAssignments) => f.service.callTool('prepare_scoped_specialist_team', { scope: p.scope, scope_sha256: p.scope_sha256, plan, assignments: selectedAssignments, selected_recommendation_ids: ids, ...(deferred_work === undefined ? {} : { deferred_work }) });
  await assert.rejects(() => invoke(['R1','R2']), /all selected dependency-closure/);
  assert.equal(f.calls.length, 0);
  const one = await invoke(['R1']);
  const reason = [{ work_id: 'other-fix', reason: 'Explicitly defer this selected branch for the next reviewed phase.' }];
  const two = await invoke(['R1','R2'], reason);
  assert.notEqual(one.plan_sha256, two.plan_sha256);
  assert.notEqual(one.scoping.binding_sha256, two.scoping.binding_sha256);
  const saved = JSON.parse(two.files['scope/selection.json']);
  assert.deepEqual(saved.recommendation_selection.selected_recommendation_ids, ['R1','R2']);
  assert.deepEqual(saved.recommendation_selection.deferred_work, reason);
  assert.equal(saved.recommendation_selection.all_selected_work_assigned, false);
  assert.match(saved.recommendation_selection.selection_sha256, /^[a-f0-9]{64}$/);
  assert(two.plan.notes.includes(reason[0].reason));
  assert.equal(saved.work.find(w=>w.work_id==='other-fix').deferred_reason, reason[0].reason);
  const changed = await invoke(['R1','R2'], [{work_id:'other-fix',reason:'A different reviewed deferral.'}]);
  assert.notEqual(changed.scoping.binding_sha256, two.scoping.binding_sha256);
  await assert.rejects(() => invoke(['R1','R2'], [{work_id:'fix',reason:'Already assigned.'}]), /unique selected, unassigned/);
  await assert.rejects(() => invoke(['R1','R2'], [{work_id:'other-fix',reason:''}]), /explicit reason/);
  await assert.rejects(() => invoke(['R1','R2'], [...reason,...reason]), /unique selected, unassigned/);
  await assert.rejects(() => invoke(['R1'], reason), /unique selected, unassigned/);
  const all = await invoke(['R1','R2'], undefined, full, assignments(p));
  assert.equal(all.scoping.recommendation_selection.all_selected_work_assigned, true);
  assert.deepEqual(all.scoping.recommendation_selection.deferred_work, []);
  assert.equal(all.review.grants_execution_authority, false);
});
