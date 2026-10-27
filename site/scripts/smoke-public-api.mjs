// Uses only the catalogue and deterministic preparation routes. Never calls the paid composer.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:5199');
if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) throw Error('This smoke check is local-only; release checks need an explicitly reviewed target.');
const status = await fetch(new URL('/api/v1/status', base));
assert.equal(status.status, 200);
assert.equal((await status.json()).model_calls, false);
const client = new Client({ name: 'ai-blocks-local-smoke', version: '1.0.0' });
try {
  await client.connect(new StreamableHTTPClientTransport(new URL('/mcp', base)));
  assert.equal((await client.listTools()).tools.length, 9);
  const search = await client.callTool({ name: 'search_library', arguments: { query: 'report', type: 'skill', limit: 1, response_format: 'detailed' } });
  assert.ok(!search.isError, JSON.stringify(search));
  const selected = search.structuredContent.items[0]; assert.ok(selected);
  const skill = await client.callTool({ name: 'get_skill', arguments: { slug: selected.slug, revision_sha256: selected.revision_sha256 } });
  assert.ok(!skill.isError, JSON.stringify(skill));
  const chunks = []; let offset = 0;
  do {
    const resource = await client.callTool({ name: 'get_resource', arguments: { slug: selected.slug, path: 'SKILL.md', revision_sha256: selected.revision_sha256, offset } });
    assert.ok(!resource.isError, JSON.stringify(resource));
    assert.equal(resource.structuredContent.encoding, 'utf-8');
    chunks.push(resource.structuredContent.content); offset = resource.structuredContent.next_offset;
  } while (offset !== null);
  assert.equal(createHash('sha256').update(chunks.join('')).digest('hex'), skill.structuredContent.instruction_resource.sha256);
  const proposal = { name: 'Local evidence check', goal: 'Review supplied facts and report unknowns', custom_skills: [{ slug: 'custom-smoke-check', name: 'Check evidence', instructions: '# Check evidence\nUse only supplied facts. Report unknowns.\n' }], steps: [{ id: 's1', slug: 'custom-smoke-check' }] };
  const prepared = await client.callTool({ name: 'prepare_workflow', arguments: proposal });
  assert.ok(!prepared.isError, JSON.stringify(prepared));
  assert.equal(prepared.structuredContent.state, 'NOT_STARTED');
  assert.equal(prepared.structuredContent.execution.model_calls_by_service, 0);
  const approved = await client.callTool({ name: 'prepare_workflow', arguments: { ...proposal, approved_draft_hash: prepared.structuredContent.draft_sha256 } });
  assert.equal(approved.structuredContent.approval.status, 'HOST_REPORTED_APPROVED');
  const changed = await client.callTool({ name: 'prepare_workflow', arguments: { ...proposal, goal: 'A changed goal', approved_draft_hash: prepared.structuredContent.draft_sha256 } });
  assert.equal(changed.isError, true);
  const company = await fetch(new URL('/mcp/company', base), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) });
  assert.equal(company.status, 401); assert.match(company.headers.get('www-authenticate'), /oauth-protected-resource/);
  console.log('Local Worker smoke passed: SDK connection, catalogue search, complete hash-checked skill retrieval, workflow review/revision and private OAuth challenge. No model calls.');
} finally { await client.close(); }
