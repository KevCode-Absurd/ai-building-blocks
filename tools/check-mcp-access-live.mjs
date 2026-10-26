// Import this runner into the authorized staging operator. Never pass tokens via CLI,
// environment variables, files or printed output. This module performs no work on import.
import { createHash, randomBytes } from 'node:crypto';

const expectedFields = ['workspaceId', 'verifiedEmail', 'visibleItemId', 'hiddenItemId', 'foreignItemId', 'workflowItemId', 'missingReferenceItemId'];
const policy = (mode, emails = [], domain = '') => ({ mode, emails, domain });
class CheckFailure extends Error {
  constructor(label, reason) { super(`${label}: ${reason}`); this.name = 'LiveMcpAccessCheckFailure'; }
}

export async function checkMcpAccessLive({ stagingOrigin, expectedStagingOrigin, companyResource, accessToken, fixture, admin, fetchImpl = fetch }) {
  const origin = new URL(stagingOrigin);
  if (origin.origin !== stagingOrigin || origin.protocol !== 'https:' || origin.origin !== expectedStagingOrigin || !origin.hostname.includes('staging') || /(?:^|\.)useaiblocks\.com$/i.test(origin.hostname)) throw Error('This runner requires an exact explicitly approved staging HTTPS origin. Production is forbidden.');
  const resource = new URL(companyResource);
  if (resource.origin !== origin.origin || resource.search || resource.hash || !/^\/mcp\/company\/[A-Za-z0-9_-]{24,128}$/.test(resource.pathname) || companyResource !== `${origin.origin}${resource.pathname}`) throw Error('Use the exact selected staging company MCP resource.');
  if (typeof accessToken !== 'string' || !/^[a-f0-9]{64}$/.test(accessToken)) throw Error('Supply the real OAuth access token in memory.');
  if (!fixture || expectedFields.some(key => typeof fixture[key] !== 'string' || !fixture[key])) throw Error('Supply all dedicated staging fixture identifiers and its verified email.');
  if (!/^[^@\s]+@[^@\s]+$/.test(fixture.verifiedEmail)) throw Error('The fixture needs the actual verified work email.');
  if (!admin || ['assertFixtureScope', 'snapshot', 'setAccess', 'setShareToken', 'patchItem', 'restore'].some(key => typeof admin[key] !== 'function')) throw Error('Provide scoped fixture-only staging administration hooks.');
  const scope = await admin.assertFixtureScope();
  if (scope?.environment !== 'staging' || scope?.fixtureOnly !== true) throw Error('Fixture administration must explicitly attest staging-only scope.');

  const checks = [], token = resource.pathname.split('/').at(-1), rest = `/api/v1/company/${token}`;
  const email = fixture.verifiedEmail.toLowerCase(), domain = email.split('@')[1];
  let snapshot, mutated = false, restored = false, failure = null, active = 'snapshot';
  const mutate = async (label, operation) => {
    active = label; mutated = true;
    try { await operation(); } catch { throw new CheckFailure(label, 'Scoped staging fixture administration failed.'); }
  };
  const request = async (label, path, expected, body) => {
    active = label;
    let response;
    try { response = await fetchImpl(new URL(path, origin), { method: body === undefined ? 'GET' : 'POST', headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json, text/event-stream', ...(body === undefined ? {} : { 'content-type': 'application/json' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), redirect: 'error', signal: AbortSignal.timeout(25000) }); }
    catch { throw new CheckFailure(label, 'The staging request failed or attempted a redirect.'); }
    const content = await response.text();
    if (response.status !== expected) { checks.push({ check: label, status: 'FAIL', expected_http_status: expected, actual_http_status: response.status }); throw new CheckFailure(label, 'Unexpected HTTP status.'); }
    const cache = response.headers.get('cache-control') ?? '';
    if (!cache.includes('no-store') || !cache.includes('private')) { checks.push({ check: label, status: 'FAIL', reason: 'private no-store response headers missing' }); throw new CheckFailure(label, 'Private response cache protection is missing.'); }
    let json;
    try { json = JSON.parse(content); } catch { throw new CheckFailure(label, 'Expected a structured JSON response.'); }
    checks.push({ check: label, status: 'PASS', http_status: response.status });
    return json;
  };
  const assert = (label, condition, reason) => { if (!condition) { checks.push({ check: label, status: 'FAIL', reason }); throw new CheckFailure(label, reason); } checks.push({ check: label, status: 'PASS' }); };
  const rpc = (method, params = {}) => ({ jsonrpc: '2.0', id: 1, method, params });
  const initialize = () => rpc('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'ai-blocks-staging-access-check', version: '1' } });
  const probeMembership = async (label, expected) => {
    const result = await request(`${label}:native_initialize`, resource.pathname, expected, initialize());
    if (expected === 200) assert(`${label}:initialize_result`, !!result.result?.serverInfo && !result.error, 'Native MCP initialization did not return a successful result.');
    const discovery = await request(`${label}:native_tool_discovery`, resource.pathname, expected, rpc('tools/list'));
    if (expected === 200) assert(`${label}:tool_discovery_result`, Array.isArray(discovery.result?.tools) && discovery.result.tools.some(tool => tool.name === 'get_company_item'), 'Native MCP tool discovery did not return the company tools.');
    await request(`${label}:rest`, `${rest}/items`, expected);
  };
  const getItem = (label, id, status = 200) => request(label, `${rest}/items/${encodeURIComponent(id)}`, status);
  const prepare = (label, item, expected = 200, extra = {}) => request(label, `${rest}/workflow-preparations`, expected, { item_id: item.item_id, revision_sha256: item.revision_sha256, ...extra });
  const read = async (label, item, path) => {
    const entry = item.resources?.find(resource => resource.path === path);
    if (!entry) throw new CheckFailure(label, 'The required fixture resource is absent from its inventory.');
    const chunks = []; let offset = 0, received = 0;
    for (let n = 0; n < 200; n++) {
      const page = await request(`${label}:chunk_${n}`, `${rest}/resources/${encodeURIComponent(item.item_id)}?${new URLSearchParams({ path, revision_sha256: item.revision_sha256, offset: String(offset), limit: '48000' })}`, 200);
      if (page.encoding !== 'base64' || page.offset !== offset || typeof page.content !== 'string' || page.sha256 !== entry.sha256) throw new CheckFailure(label, 'The resource chunk did not match the pinned inventory.');
      const bytes = Buffer.from(page.content, 'base64'); chunks.push(bytes); received += bytes.length;
      if (received > 8_000_000) throw new CheckFailure(label, 'The fixture resource exceeded the bounded test size.');
      if (page.next_offset === null) {
        const complete = Buffer.concat(chunks);
        assert(`${label}:integrity`, page.complete === true && complete.length === entry.bytes && createHash('sha256').update(complete).digest('hex') === entry.sha256, 'Complete fixture resource bytes did not match its pinned hash.');
        return complete.toString('utf8');
      }
      if (!Number.isSafeInteger(page.next_offset) || page.next_offset <= offset) throw new CheckFailure(label, 'Resource chunk pagination did not advance.');
      offset = page.next_offset;
    }
    throw new CheckFailure(label, 'Resource retrieval exceeded its bounded chunk count.');
  };

  try {
    snapshot = await admin.snapshot();
    if (snapshot === undefined) throw new CheckFailure('snapshot', 'A complete restorable staging snapshot is required before any mutation.');
    await mutate('allow_exact_domain', () => admin.setAccess(policy('domain', [], domain)));
    await probeMembership('domain_member', 200);
    const visible = await getItem('visible_item', fixture.visibleItemId);
    const sourcePath = visible.resources?.some(r => r.path === 'SKILL.md') ? 'SKILL.md' : 'source.md';
    const originalSource = await read('visible_resource', visible, sourcePath);

    await mutate('deny_nonmember_domain', () => admin.setAccess(policy('domain', [], 'access-denied.invalid')));
    await probeMembership('domain_nonmember', 403);
    await mutate('allow_verified_invitation', () => admin.setAccess(policy('invited', [email])));
    await probeMembership('invited_member', 200);
    await mutate('remove_verified_invitation', () => admin.setAccess(policy('invited')));
    await probeMembership('invitation_removed', 403);
    await mutate('set_link_only', () => admin.setAccess(policy('link')));
    await probeMembership('link_only_member_denied', 403);
    await mutate('restore_explicit_membership', () => admin.setAccess(policy('invited', [email])));
    await probeMembership('membership_restored', 200);

    const replacement = randomBytes(24).toString('base64url');
    await mutate('rotate_fixture_share_link', () => admin.setShareToken(replacement));
    await probeMembership('old_shared_link_revoked', 403);
    await request('old_grant_cannot_follow_new_resource', `/mcp/company/${replacement}`, 401, initialize());
    await mutate('restore_fixture_share_link', () => admin.setShareToken(token));
    await probeMembership('shared_link_restored', 200);

    await mutate('hide_fixture_item', () => admin.patchItem(fixture.hiddenItemId, { hidden: true }));
    await getItem('hidden_item_denied', fixture.hiddenItemId, 404);
    await getItem('foreign_item_denied', fixture.foreignItemId, 404);
    const toolForeign = await request('native_foreign_item_denied', resource.pathname, 200, rpc('tools/call', { name: 'get_company_item', arguments: { item_id: fixture.foreignItemId } }));
    assert('native_foreign_tool_error', toolForeign.result?.isError === true, 'The native company tool did not reject a foreign item.');

    await mutate('change_fixture_skill_revision', () => admin.patchItem(fixture.visibleItemId, { body: `${originalSource}\n\n<!-- staging access-control revision check -->\n` }));
    await request('stale_resource_revision_denied', `${rest}/resources/${encodeURIComponent(visible.item_id)}?${new URLSearchParams({ path: sourcePath, revision_sha256: visible.revision_sha256 })}`, 409);
    const changedSkill = await getItem('changed_skill_retrievable', fixture.visibleItemId);
    assert('changed_skill_revision', changedSkill.revision_sha256 !== visible.revision_sha256, 'Changing the fixture source did not invalidate its accepted revision.');

    const workflow = await getItem('workflow_before_change', fixture.workflowItemId);
    const workflowData = JSON.parse(await read('workflow_definition', workflow, 'item-data.json'));
    const initialPreparation = await prepare('workflow_initial_preparation', workflow);
    assert('initial_workflow_ready_for_review', initialPreparation.status === 'REVIEW_REQUIRED' && initialPreparation.execution_status === 'NOT_RUN', 'The dedicated baseline workflow must prepare successfully without running.');
    await mutate('change_fixture_workflow_notes', () => admin.patchItem(fixture.workflowItemId, { data: { ...workflowData, notes: `${workflowData.notes ?? ''}\nStaging revision check.` } }));
    await prepare('stale_workflow_revision_denied', workflow, 409);
    const changedWorkflow = await getItem('workflow_after_change', fixture.workflowItemId);
    await prepare('stale_approval_denied', changedWorkflow, 409, { approved_draft_hash: initialPreparation.draft_sha256 });
    const firstNode = workflowData.nodes?.[0];
    assert('fixture_has_declared_step', typeof firstNode?.id === 'string', 'The dedicated workflow must contain an explicit step.');
    await mutate('malform_fixture_graph', () => admin.patchItem(fixture.workflowItemId, { data: { ...workflowData, edges: [...(workflowData.edges ?? []), { id: 'staging-invalid-edge', from: 'staging-missing-step', to: firstNode.id }] } }));
    const malformed = await getItem('malformed_source_retrievable', fixture.workflowItemId);
    const blocked = await prepare('malformed_preparation', malformed);
    assert('malformed_graph_blocks_execution', blocked.status === 'BLOCKED' && blocked.execution_status === 'NOT_RUN' && blocked.steps_run === 0, 'A malformed saved graph did not block execution.');

    const missing = await getItem('missing_reference_source_retrievable', fixture.missingReferenceItemId);
    if (['workflow', 'agent'].includes(missing.kind)) {
      const missingPrepared = await prepare('missing_reference_preparation', missing);
      assert('missing_reference_blocks_execution', missingPrepared.status === 'BLOCKED' && missingPrepared.execution_status === 'NOT_RUN' && missingPrepared.blockers?.some(b => /reference|resource/i.test(b)), 'An unresolved required reference did not block execution.');
    } else await request('missing_reference_denied', `${rest}/resources/${encodeURIComponent(missing.item_id)}?${new URLSearchParams({ path: 'references/staging-missing.md', revision_sha256: missing.revision_sha256 })}`, 404);
  } catch (error) {
    failure = error instanceof CheckFailure ? error.message : `${active}: The scoped staging check failed.`;
    if (!checks.some(check => check.status === 'FAIL')) checks.push({ check: active, status: 'FAIL', reason: 'The scoped staging operation failed.' });
  } finally {
    if (snapshot !== undefined) {
      try { await admin.restore(snapshot); restored = true; checks.push({ check: 'fixture_restored', status: 'PASS' }); }
      catch { failure = 'Fixture restoration failed. Stop release work and restore the dedicated staging snapshot.'; checks.push({ check: 'fixture_restored', status: 'FAIL' }); }
    } else restored = !mutated;
  }
  return { ok: !failure && restored, environment: 'staging', checks, restored, ...(failure ? { error: failure } : {}), credentials_written: false, model_calls: 0 };
}
