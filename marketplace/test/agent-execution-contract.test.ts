import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// @ts-ignore Plain portable Node tool, shipped without dependencies.
import { createAgentContract, validateAgentContract, validateRunReceipt, contractDigest, RECEIPT_SCHEMA } from '../packs/shared/tools/agent-contract.mjs';
import { buildPack, packZip, TOOL_FILES } from '../src/modules/packs/build.ts';
import { readZip } from '../src/modules/packs/zip.ts';
import { NOVA, FIXTURE_JOB_TYPES } from './fixtures.ts';

const root = new URL('../packs/shared/', import.meta.url);
const scope = { owner_id: 'owner-a', workspace_id: 'store-a', task_id: 'task-a', context_ids: ['brief'], memory_ids: ['brand'] };
const host = () => ({ mode: 'portable-host', capabilities: { fileRead: true, localExecution: true }, models: { host: { identity: 'exact', provider: 'test-provider', model: 'test-model-revision', capabilities: { supportsToolCalls: true } } } });
const receipt = (contract = createAgentContract()) => ({
  schema: RECEIPT_SCHEMA, assurance: 'host-reported', run_id: 'session-1', contract_sha256: contractDigest(contract), scope: { ...scope }, host: host(),
  sources: [{ id: 'brief', kind: 'context', owner_id: 'owner-a', workspace_id: 'store-a', task_id: 'task-a', access: 'read' }], children: [], state: 'succeeded',
  events: [{ sequence: 1, state: 'running', steps: 0, turns: 0 }, { sequence: 2, state: 'succeeded', steps: 2, turns: 1, reason: 'session_stop', result: { summary: 'Draft saved for review.', artifacts: [] } }],
});
const codes = (report: any) => report.issues.map((i: any) => i.code);
function expectCode(report: any, code: string) { assert.equal(report.ok, false, JSON.stringify(report)); assert.ok(codes(report).includes(code), JSON.stringify(report)); }

test('shipped contract is the canonical portable template, and advertises no deployed runtime', () => {
  const template = JSON.parse(readFileSync(new URL('AGENT-CONTRACT.json', root), 'utf8'));
  assert.deepEqual(template, createAgentContract());
  assert.equal(validateAgentContract(template, host()).ok, true);
  assert.equal(template.execution.deployedRuntime, 'NOT_IMPLEMENTED');
  assert.equal(template.reference.conformance, 'not-claimed');
});

test('undefined prompts, tools, models, handlers and fallbacks fail before execution', () => {
  for (const [change, code] of [
    [(c: any) => { c.agents[0].sideA.prompt = 'missing'; }, 'missing_prompt'],
    [(c: any) => { c.prompts[0].model = 'missing'; }, 'missing_model'],
    [(c: any) => { c.prompts[0].tools.push('missing'); }, 'missing_tool'],
    [(c: any) => { c.models[0].fallbacks = ['missing']; }, 'missing_model'],
    [(c: any) => { c.agents[0].sideA = { handler: 'missing' }; }, 'missing_handler'],
    [(c: any) => { c.prompts[0].files = ['../other-tenant/secret.md']; }, 'prompt_files'],
  ] as const) {
    const c = createAgentContract(); change(c); expectCode(validateAgentContract(c), code);
  }
});

test('null and malformed registry entries report errors rather than throwing', () => {
  for (const kind of ['agents', 'prompts', 'handlers', 'tools', 'models']) for (const malformed of [null, false, 7, 'invalid', []]) {
    const c = createAgentContract(); c[kind].push(malformed);
    assert.doesNotThrow(() => validateAgentContract(c));
    assert.equal(validateAgentContract(c).ok, false, `${kind}: ${JSON.stringify(malformed)}`);
  }
  assert.equal(validateRunReceipt(null, receipt(), { scope }).ok, false);
});

test('minimum profile distinguishes operational inventory and verifies declared file dependencies', () => {
  const c = createAgentContract();
  assert.equal(c.inventory.perRoleCapabilitiesTested, false);
  const files = ['pack.json', 'AGENTS.md', 'METHOD.md', 'tools/agent-contract.mjs'];
  assert.equal(validateAgentContract(c, undefined, { packFiles: files }).ok, true);
  expectCode(validateAgentContract(c, undefined, { packFiles: files.filter(f => f !== 'METHOD.md') }), 'dependency_file_missing');
  c.tools.push({ name: 'calculate', kind: 'local-script', file: 'tools/calculate.mjs' });
  expectCode(validateAgentContract(c, undefined, { packFiles: files }), 'dependency_file_missing');
  assert.equal(validateAgentContract(c, undefined, { packFiles: [...files, 'tools/calculate.mjs'] }).ok, true);
});

test('malformed backings, human-owned children and unsupported hooks fail closed', () => {
  const c = createAgentContract(); c.agents[0].sideA.human = true;
  expectCode(validateAgentContract(c), 'side_backing');
  delete c.agents[0].sideA.human;
  c.agents[0].sideB.subagents = []; expectCode(validateAgentContract(c), 'unsupported_side_field');
  delete c.agents[0].sideB.subagents;
  c.agents[0].parentHooks = [{ hook: 'unavailable', reason: 'required' }];
  expectCode(validateAgentContract(c), 'unsupported_hooks');
});

test('fallback cycles and ambiguous success/failure bindings fail', () => {
  const c = createAgentContract(); c.models[0].fallbacks.push('host');
  expectCode(validateAgentContract(c), 'fallback_cycle');
  c.models[0].fallbacks = []; c.agents[0].sideA.sessionFail.name = 'finish';
  expectCode(validateAgentContract(c), 'ambiguous_terminal');
});

function composed() {
  const c = createAgentContract();
  c.agents.push({ ...structuredClone(c.agents[0]), name: 'reviewer' });
  c.requires.isolatedChildren = true;
  c.agents[0].sideA.subagents = [{ agent: 'reviewer', as: 'review', maxInstances: 1, parentCommunication: 'implicit', contextIds: ['brief'], memoryIds: [] }];
  return c;
}
test('composition checks dependencies, side ownership, namespace and isolation requirement', () => {
  const c = composed(); assert.equal(validateAgentContract(c).ok, true);
  c.agents[0].sideA.subagents[0].agent = 'missing'; expectCode(validateAgentContract(c), 'missing_agent');
  c.agents[0].sideA.subagents[0].agent = 'reviewer';
  for (const alias of ['finish', 'subagent_create']) { c.agents[0].sideA.subagents[0].as = alias; expectCode(validateAgentContract(c), 'relationship_collision'); }
  c.agents[0].sideA.subagents[0].as = 'review';
  c.agents[0].sideB = structuredClone(c.agents[0].sideA); expectCode(validateAgentContract(c), 'relationship_collision');
  c.agents[0].sideB = { human: true }; c.requires.isolatedChildren = false;
  expectCode(validateAgentContract(c), 'child_isolation_required');
});

test('unknown host/model metadata warns without blocking useful drafts; known missing capability fails', () => {
  const c = createAgentContract();
  const unknown = validateAgentContract(c, { mode: 'portable-host', capabilities: {}, models: { host: { identity: 'unknown' } } });
  assert.equal(unknown.ok, true); assert.ok(codes(unknown).includes('model_unknown')); assert.ok(codes(unknown).includes('capability_unknown'));
  const h = host(); h.models.host.capabilities.supportsToolCalls = false;
  expectCode(validateAgentContract(c, h), 'capability_unavailable');
  h.models.host.model = ''; expectCode(validateAgentContract(c, h), 'model_identity');
});

test('deployed runtime and conformance claims cannot be enabled through metadata', () => {
  const c = createAgentContract();
  expectCode(validateAgentContract(c, { ...host(), mode: 'deployed' }), 'runtime_not_implemented');
  c.reference.conformance = 'complete'; expectCode(validateAgentContract(c), 'conformance_claim');
  c.execution.deployedRuntime = 'READY'; expectCode(validateAgentContract(c), 'runtime_not_implemented');
});

test('receipt binds exact contract and separately supplied trusted scope', () => {
  const c = createAgentContract(), r = receipt(c);
  assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  expectCode(validateRunReceipt(c, r), 'trusted_scope_required');
  const modified = structuredClone(c); modified.limits.maxSteps = 41;
  expectCode(validateRunReceipt(modified, r, { scope }), 'contract_digest');
  r.scope.owner_id = 'other-owner'; expectCode(validateRunReceipt(c, r, { scope }), 'scope_mismatch');
});

test('source scope rejects cross-tenant/workspace/task data and memory writes', () => {
  const c = createAgentContract();
  for (const field of ['owner_id', 'workspace_id', 'task_id']) {
    const r: any = receipt(c); r.sources[0][field] = 'other';
    expectCode(validateRunReceipt(c, r, { scope }), 'source_scope');
  }
  const r: any = receipt(c); r.sources[0] = { id: 'brand', kind: 'memory', owner_id: 'owner-a', workspace_id: 'store-a', access: 'read' };
  assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  r.sources[0].access = 'write'; expectCode(validateRunReceipt(c, r, { scope }), 'memory_write_forbidden');
  r.sources[0].access = 'read'; r.sources[0].id = 'not-approved'; expectCode(validateRunReceipt(c, r, { scope }), 'source_not_allowed');
});

test('child context must fit both relationship and trusted scope on its owning side', () => {
  const c = composed(), r: any = receipt(c);
  r.host.capabilities.isolatedChildren = true;
  r.children = [{ parent_agent: c.entry, side: 'sideA', relationship: 'review', contextIds: ['brief'], memoryIds: [] }];
  assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  r.children[0].memoryIds = ['brand']; expectCode(validateRunReceipt(c, r, { scope }), 'child_scope');
  r.children[0].memoryIds = []; r.children[0].side = 'sideB'; expectCode(validateRunReceipt(c, r, { scope }), 'undeclared_relationship');
});

test('terminal success needs an explicit result, never a side response or error', () => {
  const c = createAgentContract(), r: any = receipt(c);
  r.events[1].reason = 'stop_on_response'; expectCode(validateRunReceipt(c, r, { scope }), 'terminal_result');
  r.events[1].reason = 'session_stop'; r.events[1].error = { code: 'failed_check', message: 'Check failed.' };
  expectCode(validateRunReceipt(c, r, { scope }), 'terminal_result');
  delete r.events[1].error; r.events[1].result.artifacts = [{ path: '../escape.md', sha256: 'a'.repeat(64) }];
  expectCode(validateRunReceipt(c, r, { scope }), 'artifact');
});

test('failure is a valid terminal receipt, and known capability failure never becomes success', () => {
  const c = createAgentContract(), r: any = receipt(c);
  r.host.capabilities.localExecution = false;
  expectCode(validateRunReceipt(c, r, { scope }), 'capability_unavailable');
  r.state = 'failed'; r.events[1] = { sequence: 2, state: 'failed', steps: 0, turns: 0, reason: 'capability_unavailable', error: { code: 'local_execution_missing', message: 'Draft can be written; local checks did not run.' } };
  assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  delete r.events[1].error; expectCode(validateRunReceipt(c, r, { scope }), 'terminal_error');
});

test('waiting is nonterminal; terminal sessions cannot resume or silently exceed limits', () => {
  const c = createAgentContract(), r: any = receipt(c);
  r.events.splice(1, 0, { sequence: 2, state: 'awaiting_human', steps: 1, turns: 1 }, { sequence: 3, state: 'running', steps: 1, turns: 1 });
  r.events[3].sequence = 4;
  assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  r.events.push({ sequence: 5, state: 'running', steps: 3, turns: 2 }); r.state = 'running';
  expectCode(validateRunReceipt(c, r, { scope }), 'state_transition');
  r.events[4].steps = 41; expectCode(validateRunReceipt(c, r, { scope }), 'limit_exceeded');
});

test('cap exhaustion is not success, while explicit success at the cap retains terminal priority', () => {
  const c = createAgentContract(), r: any = receipt(c);
  r.events[1].steps = 40; assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  r.state = 'exhausted'; r.events[1] = { sequence: 2, state: 'exhausted', steps: 40, turns: 1, reason: 'max_steps', error: { code: 'budget', message: 'Step cap reached; review still open.' } };
  assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  r.events[1].steps = 39; expectCode(validateRunReceipt(c, r, { scope }), 'exhaustion');
  r.events[1] = { sequence: 2, state: 'running', steps: 40, turns: 1 }; r.state = 'running';
  expectCode(validateRunReceipt(c, r, { scope }), 'limit_not_terminal');
});

test('cancellation has a structured error, and event order cannot be rewritten', () => {
  const c = createAgentContract(), r: any = receipt(c);
  r.state = 'cancelled'; r.events = [{ sequence: 1, state: 'cancelled', steps: 0, turns: 0, reason: 'cancelled', error: { code: 'owner_cancelled', message: 'Owner cancelled before execution.' } }];
  assert.equal(validateRunReceipt(c, r, { scope }).ok, true);
  r.events[0].sequence = 2; expectCode(validateRunReceipt(c, r, { scope }), 'event_sequence');
});

test('downloaded agent zip includes a persona-specific machine contract and the standalone validator', async () => {
  const tools = Object.fromEntries(['agent-contract.mjs', 'agent-contract-guide.md'].map(name => [name, readFileSync(new URL(`tools/${name}`, root), 'utf8')]));
  assert.ok(TOOL_FILES.some(f => f.name === 'agent-contract.mjs'));
  const pack = await buildPack({ persona: NOVA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, tools, options: { version: '2026.11.17', updated: '2026-11-17', kind: 'agent' } });
  const contract = JSON.parse(pack.files.find(f => f.path === 'AGENT-CONTRACT.json')!.content);
  assert.equal(contract.entry, NOVA.id); assert.equal(validateAgentContract(contract).ok, true);
  assert.equal(validateAgentContract(contract, undefined, { packFiles: pack.files.map(f => f.path) }).ok, true);
  assert.ok(pack.files.some(f => f.path === 'tools/agent-contract.mjs'));
  assert.match(pack.files.find(f => f.path === 'README.md')!.content, /AGENT-CONTRACT.json/);
  const zip = await readZip(await packZip(pack));
  assert.ok(zip.some(f => f.path.endsWith('/AGENT-CONTRACT.json')));
  assert.ok(zip.some(f => f.path.endsWith('/tools/agent-contract.mjs')));
});

test('CLI checks the shipped declaration without network, provider or artifact writes', () => {
  const script = fileURLToPath(new URL('tools/agent-contract.mjs', root));
  const run = spawnSync(process.execPath, [script, 'check', fileURLToPath(new URL('AGENT-CONTRACT.json', root))], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr); assert.equal(JSON.parse(run.stdout).assurance, 'declarations-only-not-runtime-attested');
  const bad = spawnSync(process.execPath, [script, 'receipt'], { encoding: 'utf8' });
  assert.equal(bad.status, 2);
});
