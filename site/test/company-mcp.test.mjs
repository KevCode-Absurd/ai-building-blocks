import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CompanyMcpService, companyMcpTools } from '../src/server/company-mcp.ts';
import { memorySpaces } from '../src/server/spaces.ts';
import { PublicApiError } from '../src/server/public-catalogue.ts';

const stamp = '2026-10-23T00:00:00.000Z';
const token = 'selected-company-workspace-token';
async function fixture(options = {}) {
  const store = memorySpaces();
  await store.addSpace({ id: 'company', name: 'Company source', created: stamp, updated: stamp, userId: 'owner', access: { mode: 'domain', emails: ['invited@partner.test'], domain: 'company.test' }, ownerHash: 'must-not-leak-owner', shareToken: token, ipHash: 'must-not-leak-ip' });
  await store.addSpace({ id: 'other-company', name: 'Other company', created: stamp, updated: stamp, userId: 'other-owner', access: { mode: 'invited', emails: [], domain: '' }, ownerHash: 'other-owner-hash', shareToken: 'other-private-company-token', ipHash: 'other-ip-hash' });
  const add = async (id, kind = 'skill', data = null, body = '# Private method\nUse authorized company evidence.\n', spaceId = 'company', hidden = false) => store.addItem({ id, spaceId, kind, title: id, summary: 'Company source', body, data, visibility: 'private', hidden, created: stamp, updated: stamp });
  await add('private-skill', 'skill', { files: { 'references/evidence.md': 'Internal reference: α evidence.' } }, '# Method\nRead [evidence](references/evidence.md).\n');
  await add('hidden-item', 'skill', null, 'Hidden source', 'company', true);
  await add('foreign-item', 'skill', null, 'FOREIGN COMPANY SECRET', 'other-company');
  await add('text-workflow', 'workflow', null, 'First write a memo, then review it.');
  await add('structured-workflow', 'workflow', { goal: 'Write a company memo', notes: 'Keep source uncertainty', nodes: [{ id: 'write', slug: 'custom-company-memo', x: 0, y: 0, notes: 'Use our tone' }], edges: [], customSkills: [{ slug: 'custom-company-memo', name: 'Company memo', markdown: '# Company memo\nUse the supplied brief.\n', summary: 'Write a memo', inputs: [{ type: 'brief', required: true }], outputs: [{ type: 'memo', required: true }], role: 'make' }] });
  let emails = options.emails ?? ['employee@company.test'];
  let emailCalls = 0;
  const service = new CompanyMcpService(store, { userId: options.userId ?? 'employee', workspaceToken: options.workspaceToken ?? token, async verifiedEmails() { emailCalls++; return emails; }, ...options.serviceOptions });
  return { store, service, add, setEmails(value) { emails = value; }, emailCalls: () => emailCalls };
}
const rejects = (promise, status, code) => assert.rejects(promise, e => e instanceof PublicApiError && e.status === status && (!code || e.code === code));
async function revision(f, id) { return (await f.service.callTool('get_company_item', { item_id: id })).revision_sha256; }

test('company tool discovery never offers writes, execution or global workspace identifiers', () => {
  assert.deepEqual(companyMcpTools.map(t => t.name), ['list_company_items', 'get_company_item', 'get_company_resource', 'prepare_company_workflow']);
  for (const tool of companyMcpTools) {
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.inputSchema.additionalProperties, false);
    for (const forbidden of ['userId', 'verifiedEmails', 'workspaceToken', 'spaceId']) assert.equal(Object.hasOwn(tool.inputSchema.properties, forbidden), false);
  }
});

test('company scope uses current verified exact-domain or invited email rules on every call', async () => {
  const f = await fixture();
  const list = await f.service.callTool('list_company_items', {});
  assert.equal(list.workspace.name, 'Company source');
  assert.ok(list.items.some(i => i.item_id === 'private-skill'));
  assert.ok(!JSON.stringify(list).includes('must-not-leak'));
  assert.ok(!list.items.some(i => ['foreign-item', 'hidden-item'].includes(i.item_id)));
  f.setEmails(['employee@sub.company.test']);
  await rejects(f.service.callTool('list_company_items', {}), 403);
  f.setEmails(['employee@company.test.attacker.test']);
  await rejects(f.service.callTool('get_company_item', { item_id: 'private-skill' }), 403);
  f.setEmails(['invited@partner.test']);
  assert.equal((await f.service.callTool('get_company_item', { item_id: 'private-skill' })).item_id, 'private-skill');
  assert.equal(f.emailCalls(), 4);
});

test('owners can select their own workspace; email-provider outage fails closed for members', async () => {
  const f = await fixture({ userId: 'owner', serviceOptions: { workspaceToken: undefined, verifiedEmails: async () => { throw Error('provider detail'); } } });
  assert.equal((await f.service.callTool('list_company_items', {})).workspace.name, 'Company source');
  const member = await fixture({ serviceOptions: { verifiedEmails: async () => { throw Error('provider detail'); } } });
  await rejects(member.service.callTool('list_company_items', {}), 503, 'email_verification_unavailable');
});

test('legacy link-only workspaces require explicit company membership before employee delegation', async () => {
  const f = await fixture();
  await f.store.updateSpace('company', { access: { mode: 'link', emails: [], domain: '' } });
  await rejects(f.service.callTool('list_company_items', {}), 403, 'company_membership_required');
  const owner = new CompanyMcpService(f.store, { userId: 'owner', workspaceToken: token, verifiedEmails: async () => [] });
  assert.equal((await owner.callTool('list_company_items', {})).workspace.name, 'Company source');
});

test('rotating a workspace link and removing invitations revoke subsequent reads immediately', async () => {
  const f = await fixture({ emails: ['invited@partner.test'] });
  await f.service.callTool('get_company_item', { item_id: 'private-skill' });
  await f.store.updateSpace('company', { access: { mode: 'invited', emails: [], domain: '' } });
  await rejects(f.service.callTool('get_company_item', { item_id: 'private-skill' }), 403);
  await f.store.updateSpace('company', { access: { mode: 'link', emails: [], domain: '' }, shareToken: 'replacement-company-workspace-token' });
  await rejects(f.service.callTool('list_company_items', {}), 403, 'workspace_unavailable');
});

test('global IDs, hidden items and model-supplied identity/scope cannot cross company boundaries', async () => {
  const f = await fixture();
  for (const id of ['foreign-item', 'hidden-item', 'missing']) await rejects(f.service.callTool('get_company_item', { item_id: id }), 404);
  for (const injected of [{ workspaceToken: 'other-private-company-token' }, { userId: 'owner' }, { spaceId: 'other-company' }, { verifiedEmails: ['owner@company.test'] }]) await rejects(f.service.callTool('list_company_items', injected), 400);
  const noIdentity = await fixture({ serviceOptions: { userId: '' } });
  await rejects(noIdentity.service.callTool('list_company_items', {}), 401);
});

test('company files are fetched directly as complete revision-pinned byte chunks without network requests', async () => {
  const f = await fixture();
  const previous = globalThis.fetch;
  globalThis.fetch = async () => { throw Error('Company resource retrieval must not use ambient fetch'); };
  try {
    const item = await f.service.callTool('get_company_item', { item_id: 'private-skill' });
    assert.ok(item.resources.some(r => r.path === 'references/evidence.md'));
    let offset = 0;
    const chunks = [];
    do {
      const result = await f.service.callTool('get_company_resource', { item_id: item.item_id, path: 'references/evidence.md', revision_sha256: item.revision_sha256, offset, limit: 3 });
      chunks.push(Buffer.from(result.content, 'base64'));
      assert.equal(result.offset, offset); assert.equal(result.encoding, 'base64');
      if (result.complete) { assert.equal(result.next_offset, null); break; }
      offset = result.next_offset;
    } while (true);
    assert.equal(Buffer.concat(chunks).toString('utf8'), 'Internal reference: α evidence.');
    await f.store.updateItem('private-skill', { body: 'A changed method', updated: '2026-10-24T00:00:00Z' });
    await rejects(f.service.callTool('get_company_resource', { item_id: item.item_id, path: 'SKILL.md', revision_sha256: item.revision_sha256 }), 409, 'revision_changed');
  } finally { globalThis.fetch = previous; }
});

test('company resources reject traversal, arbitrary URLs, unknown paths and colliding inventories', async () => {
  const f = await fixture(), rev = await revision(f, 'private-skill');
  for (const path of ['../other-company/secret', 'https://attacker.test/secret', 'references\\secret', '/absolute/path', 'a%2fb']) await rejects(f.service.callTool('get_company_resource', { item_id: 'private-skill', path, revision_sha256: rev }), 400);
  await rejects(f.service.callTool('get_company_resource', { item_id: 'private-skill', path: 'references/missing.md', revision_sha256: rev }), 404);
  await f.add('unsafe-files', 'skill', { files: { '../outside.txt': 'unsafe' } });
  await rejects(f.service.callTool('get_company_item', { item_id: 'unsafe-files' }), 400);
  await f.add('collision-files', 'skill', { files: { 'skill.MD': 'replacement' } });
  await rejects(f.service.callTool('get_company_item', { item_id: 'collision-files' }), 400);
});

test('text-only workflow sources remain blocked and never gain invented steps or successful checks', async () => {
  const f = await fixture(), rev = await revision(f, 'text-workflow');
  const prepared = await f.service.callTool('prepare_company_workflow', { item_id: 'text-workflow', revision_sha256: rev });
  assert.equal(prepared.status, 'BLOCKED'); assert.equal(prepared.execution_status, 'NOT_RUN'); assert.equal(prepared.steps_run, 0);
  assert.deepEqual(prepared.ordered_step_ids, []); assert.ok(prepared.blockers.length);
  assert.ok(prepared.checks.every(c => c.status === 'NOT_RUN'));
  assert.equal(prepared.approval.grants_execution_authority, false);
});

test('structured company preparation preserves notes/custom skills and binds host-reported approval to exact content', async () => {
  const f = await fixture(), rev = await revision(f, 'structured-workflow');
  const args = { item_id: 'structured-workflow', revision_sha256: rev };
  const prepared = await f.service.callTool('prepare_company_workflow', args);
  assert.equal(prepared.status, 'REVIEW_REQUIRED'); assert.deepEqual(prepared.ordered_step_ids, ['write']);
  assert.equal(prepared.stored_workflow.notes, 'Keep source uncertainty');
  assert.equal(prepared.stored_workflow.nodes[0].notes, 'Use our tone');
  assert.ok(prepared.resources.some(r => r.path === 'skills/custom-company-memo/SKILL.md'));
  const approved = await f.service.callTool('prepare_company_workflow', { ...args, approved_draft_hash: prepared.draft_sha256 });
  assert.equal(approved.approval.status, 'HOST_REPORTED_APPROVED'); assert.equal(approved.approval.independently_verified, false); assert.equal(approved.approval.grants_execution_authority, false);
  await rejects(f.service.callTool('prepare_company_workflow', { ...args, approved_draft_hash: '0'.repeat(64) }), 409, 'approval_stale');
  const it = await f.store.item('structured-workflow');
  await f.store.updateItem(it.id, { data: { ...it.data, notes: 'Changed instructions' } });
  await rejects(f.service.callTool('prepare_company_workflow', { ...args, approved_draft_hash: prepared.draft_sha256 }), 409, 'revision_changed');
});

test('cycles, missing custom references and unavailable public skills block company execution', async () => {
  const f = await fixture();
  await f.add('cycle', 'workflow', { nodes: [{ id: 'a', slug: 'one', x: 0, y: 0 }, { id: 'b', slug: 'two', x: 300, y: 0 }], edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'a' }] });
  let result = await f.service.callTool('prepare_company_workflow', { item_id: 'cycle', revision_sha256: await revision(f, 'cycle') });
  assert.equal(result.status, 'BLOCKED'); assert.match(result.blockers.join(' '), /cycle/);
  const item = await f.store.item('structured-workflow');
  await f.store.updateItem(item.id, { data: { ...item.data, customSkills: [{ ...item.data.customSkills[0], markdown: '# Method\nRead [missing](references/missing.md).\n' }] } });
  result = await f.service.callTool('prepare_company_workflow', { item_id: item.id, revision_sha256: await revision(f, item.id) });
  assert.equal(result.status, 'BLOCKED'); assert.match(result.blockers.join(' '), /reference/);
});

test('explicit company skill attachments retrieve stored references and revisions without cross-workspace access', async () => {
  const f = await fixture();
  await f.add('attached-workflow', 'workflow', { nodes: [{ id: 'company-step', slug: 'company-evidence', x: 0, y: 0 }], edges: [], companySkills: [{ slug: 'company-evidence', item_id: 'private-skill' }] });
  let prepared = await f.service.callTool('prepare_company_workflow', { item_id: 'attached-workflow', revision_sha256: await revision(f, 'attached-workflow') });
  assert.equal(prepared.status, 'REVIEW_REQUIRED');
  assert.equal(prepared.company_packages[0].item_id, 'private-skill');
  assert.ok(prepared.company_packages[0].resources.some(r => r.path === 'references/evidence.md'));
  const oldHash = prepared.draft_sha256;
  await f.store.updateItem('private-skill', { body: 'Changed company method' });
  await rejects(f.service.callTool('prepare_company_workflow', { item_id: 'attached-workflow', revision_sha256: await revision(f, 'attached-workflow'), approved_draft_hash: oldHash }), 409, 'approval_stale');
  await f.store.updateItem('attached-workflow', { data: { nodes: [{ id: 'company-step', slug: 'company-evidence', x: 0, y: 0 }], edges: [], companySkills: [{ slug: 'company-evidence', item_id: 'foreign-item' }] } });
  prepared = await f.service.callTool('prepare_company_workflow', { item_id: 'attached-workflow', revision_sha256: await revision(f, 'attached-workflow') });
  assert.equal(prepared.status, 'BLOCKED'); assert.doesNotMatch(JSON.stringify(prepared), /FOREIGN COMPANY SECRET/);
});

test('legacy expanded public sequences preserve required governing workflows', async () => {
  const publicCalls = [];
  const publicService = { async callTool(name, args) {
    publicCalls.push({ name, args });
    if (name === 'prepare_workflow') {
      if (!args.governing_skills.some(g => g.slug === 'parent-flow')) throw new PublicApiError(400, 'missing_governance', 'Include the parent-flow governing skill to preserve its gates.');
      return { checks: [] };
    }
    return { slug: args.slug, revision_sha256: 'a'.repeat(64), resource_validation: { status: 'PASS' } };
  } };
  const f = await fixture({ serviceOptions: { publicService } });
  const data = { nodes: [{ id: 'first', slug: 'write', x: 0, y: 0 }, { id: 'second', slug: 'check', x: 300, y: 0 }], edges: [{ from: 'first', to: 'second' }] };
  await f.add('expanded', 'workflow', data);
  let prepared = await f.service.callTool('prepare_company_workflow', { item_id: 'expanded', revision_sha256: await revision(f, 'expanded') });
  assert.equal(prepared.status, 'BLOCKED'); assert.match(prepared.blockers.join(' '), /governing skill/);
  await f.store.updateItem('expanded', { data: { ...data, governingSkills: ['parent-flow'] } });
  prepared = await f.service.callTool('prepare_company_workflow', { item_id: 'expanded', revision_sha256: await revision(f, 'expanded') });
  assert.equal(prepared.status, 'REVIEW_REQUIRED');
  assert.ok(publicCalls.some(c => c.name === 'prepare_workflow' && c.args.governing_skills.some(g => g.slug === 'parent-flow')));
});
