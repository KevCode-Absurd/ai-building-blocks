// Tooling self-tests use in-memory services. They never establish real staging, Clerk or Codex compatibility.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { runStagingSmoke, stagingTarget } from './smoke-staging-mcp.mjs';
import { handleCompanyApi } from '../src/server/company-api.ts';
import { memorySpaces } from '../src/server/spaces.ts';
import { memoryMcpOAuthStore } from '../src/server/mcp-oauth.ts';

const sha = text => createHash('sha256').update(text).digest('hex');
const origin = 'https://staging.example.test', workspace = 'fixture-company-workspace-token';
const target = { ...stagingTarget({ MCP_STAGING_ORIGIN: origin, MCP_STAGING_RESOURCE_PATH: '/mcp/company/' + workspace }), environment: 'mocked-http' };

test('staging runner retrieves real service fixtures through the SDK and produces secret-free, honestly labelled evidence', async () => {
  for (const personal of [false, true]) {
  const selectedTarget = personal ? { ...stagingTarget({ MCP_STAGING_ORIGIN: origin, MCP_STAGING_RESOURCE_PATH: '/mcp/personal' }), environment: 'mocked-http' } : target;
  const spaces = memorySpaces(), oauth = memoryMcpOAuthStore(), token = 'a'.repeat(64), stamp = '2026-10-23T00:00:00Z';
  await spaces.addSpace({ id: 'workspace', name: 'SENSITIVE_COMPANY_NAME', ownerHash: 'SENSITIVE_OWNER_HASH', ipHash: 'SENSITIVE_IP_HASH', shareToken: workspace, userId: 'owner', access: { mode: 'domain', emails: [], domain: 'company.test' }, created: stamp, updated: stamp });
  const base = { spaceId: 'workspace', summary: 'SENSITIVE_ITEM_SUMMARY', visibility: 'private', hidden: false, created: stamp, updated: stamp };
  await spaces.addItem({ ...base, id: 'private-skill', kind: 'skill', title: 'SENSITIVE_SKILL_NAME', body: '# Skill\nRead [facts](references/facts.md).\n', data: { files: { 'references/facts.md': 'SENSITIVE_CONTENT α' } } });
  await spaces.addItem({ ...base, id: 'private-flow', kind: 'workflow', title: 'SENSITIVE_FLOW_NAME', body: '# Follow the saved workflow.\n', data: { goal: 'Create a checked draft', nodes: [{ id: 's1', slug: 'company-check', x: 0, y: 0 }], edges: [], companySkills: [{ slug: 'company-check', item_id: 'private-skill' }] } });
  const expires = Math.floor(Date.now() / 1000) + 3600;
  await oauth.issue({ id: 'grant', user_id: personal ? 'owner' : 'employee', client_id: 'client', resource: selectedTarget.resource, scope: selectedTarget.scope, revoked_at: null }, { token_hash: sha(token), grant_id: 'grant', client_id: 'client', kind: 'access', expires_at: expires, consumed_at: null, rotation_target: null }, { token_hash: sha('b'.repeat(64)), grant_id: 'grant', client_id: 'client', kind: 'refresh', expires_at: expires, consumed_at: null, rotation_target: null });
  const env = { PUBLIC_API_ENABLED: 'true', MCP_OAUTH_ENABLED: 'true', API_ALLOWED_HOSTS: 'staging.example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { async fetch() { return new Response(null, { status: 404 }); } } };
  const fetchImpl = async (input, init) => {
    const request = new Request(input, init), headers = new Headers(request.headers); headers.set('cf-connecting-ip', '192.0.2.7');
    return handleCompanyApi(new Request(request, { headers }), env, { spaces, oauth, library: { async get() { return { data: {}, revision: 0 }; } }, authenticate: async () => personal ? 'owner' : 'employee', verifiedEmails: async () => ['employee@company.test'] });
  };
  const evidence = await runStagingSmoke({ target: selectedTarget, accessToken: token, skillItemId: personal ? `saved-${sha('own-space\0private-skill')}` : 'private-skill', workflowItemId: personal ? `saved-${sha('own-space\0private-flow')}` : 'private-flow', fetchImpl, spacing: 0 });
  assert.equal(evidence.environment, 'mocked-http');
  assert(evidence.checks.every(c => c.status === 'PASS'), JSON.stringify(evidence));
  assert(evidence.resources_verified >= 6);
  const serialized = JSON.stringify(evidence);
  for (const forbidden of [token, workspace, 'private-skill', 'private-flow', 'SENSITIVE_', 'references/facts.md']) assert(!serialized.includes(forbidden));
  }
});

test('staging runner refuses production targets and discovery explicitly leaves private checks unrun', async () => {
  for (const address of ['https://useaiblocks.com', 'https://www.useaiblocks.com', 'https://example.com', 'https://user:secret@staging.example.test', 'https://staging.example.test/?token=secret']) assert.throws(() => stagingTarget({ MCP_STAGING_ORIGIN: address }));
  const headers = { 'content-type': 'application/json', 'cache-control': 'private, no-store', vary: 'Authorization' };
  const evidence = await runStagingSmoke({ target, spacing: 0, fetchImpl: async input => {
    const path = new URL(input).pathname;
    if (path === '/.well-known/oauth-authorization-server') return Response.json({ issuer: origin, code_challenge_methods_supported: ['S256'] });
    if (path.startsWith('/.well-known/oauth-protected-resource')) return Response.json({ resource: target.resource, authorization_servers: [origin] });
    return new Response('{}', { status: 401, headers: { ...headers, 'www-authenticate': 'Bearer resource_metadata="https://staging.example.test/.well-known/oauth-protected-resource/mcp/company"' } });
  } });
  assert.equal(evidence.authentication, 'unauthenticated');
  assert.deepEqual(evidence.checks.at(-1), { id: 'authenticated-private-resources', status: 'NOT_RUN' });
});

test('raw server exceptions and private response text never leak into staging evidence', async () => {
  const evidence = await runStagingSmoke({ target, spacing: 0, fetchImpl: async () => { throw Error('SENSITIVE_TOKEN_AND_COMPANY_CONTENT'); } });
  assert.equal(evidence.checks.at(-1).status, 'FAIL');
  assert(!JSON.stringify(evidence).includes('SENSITIVE_TOKEN_AND_COMPANY_CONTENT'));
});
