import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiExecutionPolicy } from '../src/server/api-execution.ts';
import { executionPolicy } from '../src/lib/workflow-execution.ts';
import { CompanyMcpService } from '../src/server/company-mcp.ts';
import { memorySpaces } from '../src/server/spaces.ts';

test('API delivery reads its actual definitions and pinned resources without requiring nonexistent export-entry files', () => {
  const policy = apiExecutionPolicy(), rules = policy.rules.slice(0, 2).map(r => r.text).join('\n');
  assert.equal(policy.delivery, 'api'); assert.equal(policy.delivery_version, 'abb-api-execution/1');
  assert.doesNotMatch(rules, /START_HERE\.txt|HANDOFF\.md|workflow\.json/);
  assert.match(rules, /selected API workflow definition/);
  assert.match(rules, /saved graph or declared steps/);
  assert.match(rules, /revision-pinned resource inventory/);
  assert.match(rules, /complete ordered chunks/);
  assert.match(rules, /offset unit and encoding/);
  assert.match(rules, /required definition or resource blocks the affected path/);
  assert.match(rules, /Do not substitute discovery summaries or fabricate missing files/);
});

test('the API adapter preserves every other shared execution rule, hook and assurance without mutating archive delivery', () => {
  const core = executionPolicy(), api = apiExecutionPolicy();
  assert.deepEqual(api.rules.slice(2), core.rules.slice(2));
  assert.deepEqual(api.rules.map(r => ({ id: r.id, hook: r.hook })), core.rules.map(r => ({ id: r.id, hook: r.hook })));
  const { rules: _rules, delivery: _delivery, delivery_version: _version, ...metadata } = api;
  const { rules: _coreRules, ...coreMetadata } = core;
  assert.deepEqual(metadata, coreMetadata);
  assert.match(executionPolicy().rules[0].text, /HANDOFF\.md/);
  assert.match(executionPolicy().rules[1].text, /START_HERE\.txt/);
});

test('company API preparations actually carry the delivery adapter while execution and required checks remain unrun', async () => {
  const store = memorySpaces();
  await store.addSpace({ id: 'owned', name: 'Owned', userId: 'user', ownerHash: '', shareToken: '', ipHash: '', created: 'stamp', updated: 'stamp' });
  await store.addItem({ id: 'workflow', spaceId: 'owned', kind: 'workflow', title: 'Workflow', summary: '', body: '', data: { nodes: [{ id: 'step', slug: 'custom-method', x: 0, y: 0 }], edges: [], customSkills: [{ slug: 'custom-method', markdown: '# Method\nVerify the evidence.' }] }, visibility: 'private', hidden: false, created: 'stamp', updated: 'stamp' });
  const service = new CompanyMcpService(store, { userId: 'user', verifiedEmails: async () => [] });
  const item = await service.callTool('get_company_item', { item_id: 'workflow' });
  const prepared = await service.callTool('prepare_company_workflow', { item_id: 'workflow', revision_sha256: item.revision_sha256 });
  assert.deepEqual(prepared.execution_policy, apiExecutionPolicy());
  assert.equal(prepared.execution_status, 'NOT_RUN'); assert.equal(prepared.steps_run, 0);
  assert.ok(prepared.checks.every(check => check.status === 'NOT_RUN'));
  assert.doesNotMatch(JSON.stringify(prepared.execution_policy.rules), /START_HERE\.txt|HANDOFF\.md|workflow\.json/);
});
