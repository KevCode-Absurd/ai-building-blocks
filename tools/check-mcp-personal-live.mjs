// Staging-only real personal-library acceptance. OAuth credentials stay in memory.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { browserOAuth, stagingTarget } from '../site/scripts/smoke-staging-mcp.mjs';
import { validateLibrary } from '../site/src/lib/library-data.ts';
import { validateCustomMinds } from '../site/src/lib/custom-minds.ts';

const tables = { account_library: 'contents', account_minds: 'profiles' };
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const hash = value => createHash('sha256').update(Buffer.isBuffer(value) ? value : JSON.stringify(canonical(value))).digest('hex');
const same = (a, b) => hash(a) === hash(b);
const blank = () => ({ kits: [], flows: [], recent: [], currentFlow: null, draft: null });
const ensure = (value, check) => { if (!value) { const error = new Error(check); error.check = check; throw error; } };

export function buildPersonalFixtureData(libraryRow, mindsRow, runId) {
  ensure(/^[a-f0-9]{12}$/.test(runId), 'valid-fixture-run-id');
  const data = validateLibrary(libraryRow ? JSON.parse(libraryRow.contents) : {});
  const oldMinds = mindsRow ? JSON.parse(mindsRow.profiles) : [];
  validateCustomMinds(oldMinds);
  ensure(oldMinds.length < 12, 'room-for-one-additive-synthetic-profile');
  const state = JSON.parse(data['abb:v1'] ?? 'null') ?? blank();
  const label = `MCP staging ${runId}`, profileSlug = `my-mind-staging-${runId}`, skillSlug = `custom-staging-${runId}`;
  const profile = { slug: profileSlug, name: `${label} account reviewer`, specialty: 'Review synthetic arithmetic evidence', voice: 'Clear and concise', principles: 'Account profile: verify every synthetic arithmetic claim.', avoid: 'Invented inputs and external actions', examples: '' };
  const custom = { slug: skillSlug, name: `${label} embedded skill`, summary: 'Read the complete saved synthetic fixture and check its arithmetic.', markdown: '# Synthetic personal margin method\n\nRead [the saved fixture](references/fixture.json) completely. Use only those synthetic values. Calculate net as revenue minus expenses and margin percent as net divided by revenue times 100. On review, independently verify the prior arithmetic. Report arithmetic evidence, currency, revision and missing inputs. Do not send messages or change external accounts.\n', role: 'make', inputs: [{ type: 'fixture', required: true }], outputs: [{ type: 'calculation', required: true }] };
  const facts = { synthetic: true, currency: 'USD', revenue: 3200, expenses: 2200 };
  const flow = { id: `staging-flow-${runId}`, name: `${label} saved workflow`, updated: Date.now(), goal: 'Calculate and check synthetic margin in the user AI environment.', notes: 'Synthetic read-only saved personal workflow. API preparation does not execute it.', nodes: [{ id: 'calculate', slug: skillSlug, x: 0, y: 0, notes: 'Calculate with the saved fixture.', mind: profileSlug }, { id: 'verify', slug: skillSlug, x: 0, y: 160, notes: 'Verify the prior arithmetic with evidence.', minds: [profileSlug] }], edges: [{ id: 'calculate-to-verify', from: 'calculate', to: 'verify' }], customSkills: [custom], files: { [`skills/${skillSlug}/references/fixture.json`]: JSON.stringify(facts) } };
  const agent = { ...flow, id: `staging-agent-${runId}`, name: `${label} saved agent`, kind: 'agent' };
  const override = { ...flow, id: `staging-override-${runId}`, name: `${label} embedded override`, customMinds: [{ ...profile, principles: 'Embedded snapshot: preserve this specific review method.' }] };
  const draft = { ...flow, id: `staging-draft-${runId}`, name: `${label} saved draft` };
  const receiptFlow = { ...flow, id: `staging-receipt-flow-${runId}`, name: `${label} retained browser workflow` };
  const receiptDraft = { ...draft, id: `staging-receipt-draft-${runId}`, name: `${label} retained browser draft` };
  const kit = { id: `staging-kit-${runId}`, name: `${label} saved kit`, slugs: ['report-outline-builder'], updated: Date.now() };
  const merged = { ...state, kits: [...state.kits, kit], flows: [...state.flows, flow, agent, override], draft: state.draft ?? draft, browserSaves: [...(state.browserSaves ?? []), { id: `staging-receipt-${runId}`, capturedAt: Date.now(), data: { 'abb:v1': JSON.stringify({ ...blank(), flows: [receiptFlow], draft: receiptDraft }) } }] };
  const result = { ...data, 'abb:v1': JSON.stringify(merged) }, profiles = [...oldMinds, profile];
  validateLibrary(result); validateCustomMinds(profiles);
  ensure(Buffer.byteLength(JSON.stringify(result)) <= 4_000_000, 'additive-fixture-fits-account-limit');
  return { data: result, profiles, labels: { label, workflow: flow.name, agent: agent.name, override: override.name, draft: draft.name, receiptFlow: receiptFlow.name, receiptDraft: receiptDraft.name, kit: kit.name, skill: custom.name, profile: profile.name }, profileSlug, skillSlug, facts };
}

export async function readPersonalRow(query, table, userId) {
  ensure(Object.hasOwn(tables, table), 'scoped-table');
  const column = tables[table];
  const rows = (await query(`SELECT user_id,revision,${column},updated_at FROM ${table} WHERE user_id=?`, [userId]))[0].results;
  ensure(rows.length <= 1, 'single-scoped-account-row');
  return rows[0] ?? null;
}

/** Compare every original field; concurrent account changes are never overwritten. */
export async function casPersonalRow(query, table, userId, expected, desired) {
  ensure(Object.hasOwn(tables, table), 'scoped-table'); const column = tables[table];
  let sql, params;
  if (!expected && desired) {
    sql = `INSERT INTO ${table}(user_id,revision,${column},updated_at) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM ${table} WHERE user_id=?)`;
    params = [userId, desired.revision, desired[column], desired.updated_at, userId];
  } else if (expected && !desired) {
    sql = `DELETE FROM ${table} WHERE user_id=? AND revision=? AND ${column}=? AND updated_at=?`;
    params = [userId, expected.revision, expected[column], expected.updated_at];
  } else if (expected && desired) {
    sql = `UPDATE ${table} SET revision=?,${column}=?,updated_at=? WHERE user_id=? AND revision=? AND ${column}=? AND updated_at=?`;
    params = [desired.revision, desired[column], desired.updated_at, userId, expected.revision, expected[column], expected.updated_at];
  } else return true;
  const result = await query(sql, params);
  return result[0].meta.changes === 1;
}

export async function restorePersonalRows(query, userId, rows) {
  const results = [];
  for (const table of ['account_minds', 'account_library']) {
    const { original, expected, candidates = [] } = rows[table];
    try {
      let current = await readPersonalRow(query, table, userId);
      if (!same(current, original)) {
        ensure([expected, ...candidates].some(candidate => same(current, candidate)), 'concurrent-staging-account-edit-preserved');
        ensure(await casPersonalRow(query, table, userId, current, original), 'staging-restore-cas-conflict');
      }
      current = await readPersonalRow(query, table, userId);
      ensure(same(current, original), 'staging-snapshot-restored-exactly');
      results.push({ source: table, status: 'PASS' });
    } catch { results.push({ source: table, status: 'FAIL', reason: 'Restore failed or a concurrent edit was preserved. Operator review is required.' }); }
  }
  return { restored: results.every(r => r.status === 'PASS'), results };
}

export async function runPersonalLive({ admin, note = () => {}, fetchImpl = fetch }) {
  const { stagingOrigin, assertStaging, selectedIdentity, query, previewCredential, privateRoot, repo } = admin;
  ensure(stagingOrigin === 'https://ai-building-blocks-staging.kevinmark7498.workers.dev', 'exact-isolated-staging-target');
  const settings = await assertStaging();
  ensure(settings.bindings.find(binding => binding.name === 'COMPOSER')?.id === settings.bindings.find(binding => binding.name === 'SPACES')?.id, 'personal-and-space-bindings-use-the-verified-staging-database');
  const identity = await selectedIdentity(), preview = await previewCredential(), runId = randomBytes(6).toString('hex');
  ensure(identity.verifiedEmail === 'hello@useaiblocks.com', 'selected-real-verified-work-account');
  const target = stagingTarget({ MCP_STAGING_ORIGIN: stagingOrigin, MCP_STAGING_RESOURCE_PATH: '/mcp/personal' });
  const evidence = { schema: 'abb-personal-live-evidence/1', checkedOn: new Date().toISOString(), environment: 'real-staging', checks: [], resourcesVerified: 0, modelCalls: 0, tokensWritten: false, productionChanged: false };
  const passed = check => evidence.checks.push({ check, status: 'PASS' });
  let active = 'snapshot', issued, client, recoveryFile;
  const rows = {};
  let last = 0;
  const http = async (input, init = {}, token) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
    ensure(url.origin === stagingOrigin, 'no-credential-forwarding');
    const pause = Math.max(0, last + 2600 - Date.now()); if (pause) await new Promise(resolve => setTimeout(resolve, pause)); last = Date.now();
    const headers = new Headers(input instanceof Request ? input.headers : undefined); new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    headers.set('x-preview-access', preview); if (token) headers.set('authorization', `Bearer ${token}`);
    return fetchImpl(input, { ...init, headers, redirect: 'error', signal: AbortSignal.timeout(25000) });
  };
  const privateJson = async (response, status = 200) => { ensure(response.status === status, active); ensure(/private/.test(response.headers.get('cache-control') ?? '') && /no-store/.test(response.headers.get('cache-control') ?? ''), 'private-no-store'); return response.json(); };
  try {
    for (const table of Object.keys(tables)) { const original = await readPersonalRow(query, table, identity.userId); rows[table] = { original, expected: original }; }
    const fixture = buildPersonalFixtureData(rows.account_library.original, rows.account_minds.original, runId), now = new Date().toISOString();
    const desired = { account_library: { user_id: identity.userId, revision: (rows.account_library.original?.revision ?? 0) + 1, contents: JSON.stringify(fixture.data), updated_at: now }, account_minds: { user_id: identity.userId, revision: (rows.account_minds.original?.revision ?? 0) + 1, profiles: JSON.stringify(fixture.profiles), updated_at: now } };
    recoveryFile = path.join(privateRoot, `personal-fixture-recovery-${runId}.json`);
    await fs.writeFile(recoveryFile, JSON.stringify({ environment: 'isolated-staging', userId: identity.userId, rows, desired }), { flag: 'wx', mode: 0o600 });
    for (const table of Object.keys(tables)) {
      active = `seed-${table}`; rows[table].expected = desired[table];
      ensure(await casPersonalRow(query, table, identity.userId, rows[table].original, desired[table]), 'additive-seed-cas-conflict');
      ensure(same(await readPersonalRow(query, table, identity.userId), desired[table]), 'additive-seed-verified');
    }
    passed('existing-saved-data-preserved-by-additive-cas-merge'); note('Personal synthetic staging fixtures are ready; requesting real work-account consent.');
    active = 'real-browser-oauth'; issued = await browserOAuth(target, http, note); passed('real-work-account-sign-in-consent-and-pkce');
    const require = createRequire(path.join(repo, 'site/package.json'));
    const { Client } = await import(pathToFileURL(require.resolve('@modelcontextprotocol/sdk/client/index.js')).href);
    const { StreamableHTTPClientTransport } = await import(pathToFileURL(require.resolve('@modelcontextprotocol/sdk/client/streamableHttp.js')).href);
    client = new Client({ name: 'ai-blocks-real-personal-staging-acceptance', version: '1' });
    await client.connect(new StreamableHTTPClientTransport(new URL(target.resource), { fetch: (input, init) => http(input, init, issued.access) }));
    const names = (await client.listTools()).tools.map(t => t.name);
    ensure(['list_saved_items', 'get_saved_item', 'get_saved_resource', 'prepare_saved_workflow', 'search_library', 'get_skill', 'get_workflow', 'get_resource', 'prepare_workflow'].every(n => names.includes(n)), 'combined-personal-and-public-tools'); passed('official-sdk-combined-public-and-personal-tools');
    const call = async (name, args, errorExpected = false) => { active = name; const result = await client.callTool({ name, arguments: args }); ensure(errorExpected ? result.isError === true : !result.isError && result.structuredContent, `tool-${name}`); return result.structuredContent; };
    const listing = await call('list_saved_items', { query: fixture.labels.label, limit: 25 });
    const found = title => { const item = listing.items?.find(i => i.title === title); ensure(item, 'all-added-saved-types-discoverable'); return item; };
    const workflow = await call('get_saved_item', { item_id: found(fixture.labels.workflow).item_id });
    const agent = await call('get_saved_item', { item_id: found(fixture.labels.agent).item_id }); ensure(agent.kind === 'agent', 'saved-agent-kind-retained');
    const receipt = found(fixture.labels.receiptFlow), draft = found(fixture.labels.receiptDraft), kit = await call('get_saved_item', { item_id: found(fixture.labels.kit).item_id });
    ensure(receipt.saved_source.includes('browser-receipt') && draft.saved_source.endsWith('/draft'), 'retained-browser-workflow-and-draft-discovery');
    ensure(kit.collection?.execution_order === null && kit.collection.members.some(m => m.slug === 'report-outline-builder'), 'saved-kit-membership-without-invented-order');
    passed('saved-kits-workflows-agents-drafts-and-browser-receipts-discovered');
    const read = async (item, entry) => {
      const chunks = []; let offset = 0;
      for (let count = 0; count < 100; count++) {
        const page = await call('get_saved_resource', { item_id: item.item_id, revision_sha256: item.revision_sha256, path: entry.path, offset, limit: 48000 });
        ensure(page.encoding === 'base64' && page.offset === offset && page.sha256 === entry.sha256, 'pinned-byte-chunk-binding');
        const bytes = Buffer.from(page.content, 'base64'); chunks.push(bytes);
        if (page.next_offset === null) { const all = Buffer.concat(chunks); ensure(page.complete && all.length === entry.bytes && createHash('sha256').update(all).digest('hex') === entry.sha256, 'complete-saved-resource-hash'); evidence.resourcesVerified++; return all.toString('utf8'); }
        ensure(page.next_offset === offset + bytes.length, 'ordered-byte-chunks'); offset = page.next_offset;
      }
      ensure(false, 'bounded-resource-chunks');
    };
    const resources = new Map(); for (const entry of workflow.resources) resources.set(entry.path, await read(workflow, entry));
    const definition = JSON.parse(resources.get('item-data.json'));
    ensure(definition.customMinds?.some(m => m.slug === fixture.profileSlug) && definition.saved_profile_resolution?.some(r => r.slug === fixture.profileSlug && r.source === 'account-minds'), 'assigned-account-profile-resolved-directly');
    const facts = JSON.parse(resources.get(`skills/${fixture.skillSlug}/references/fixture.json`));
    ensure(facts.revenue - facts.expenses === 1000 && (facts.revenue - facts.expenses) / facts.revenue * 100 === 31.25, 'synthetic-support-facts-preserved');
    passed('complete-workflow-instructions-assigned-profile-and-support-hashes');
    const embedded = listing.items.find(i => i.title === fixture.labels.skill && i.saved_origin?.workflow_item_id === workflow.item_id);
    ensure(embedded, 'embedded-custom-skill-discoverable-with-origin');
    const skill = await call('get_saved_item', { item_id: embedded.item_id });
    const support = skill.resources.find(r => r.path === 'references/fixture.json'); ensure(support, 'embedded-skill-support-inventory');
    ensure(same(JSON.parse(await read(skill, support)), fixture.facts), 'standalone-embedded-skill-support-matches-workflow');
    passed('embedded-custom-skill-discovery-origin-and-complete-support');
    const overridden = await call('get_saved_item', { item_id: found(fixture.labels.override).item_id });
    const overridePrep = await call('prepare_saved_workflow', { item_id: overridden.item_id, revision_sha256: overridden.revision_sha256 });
    ensure(overridePrep.stored_workflow.customMinds.some(m => m.slug === fixture.profileSlug && m.principles.startsWith('Embedded snapshot:')), 'embedded-profile-override-retained'); passed('embedded-profile-overrides-current-account-profile');
    const args = { item_id: workflow.item_id, revision_sha256: workflow.revision_sha256 };
    const first = await call('prepare_saved_workflow', args), second = await call('prepare_saved_workflow', args);
    ensure(first.status === 'REVIEW_REQUIRED' && first.execution_status === 'NOT_RUN' && first.steps_run === 0 && first.draft_sha256 === second.draft_sha256 && first.execution_policy.delivery === 'api', 'repeat-saved-workflow-preparation-binding');
    active = 'personal-rest-preparation';
    const rest = await privateJson(await http(new URL('/api/v1/personal/workflow-preparations', stagingOrigin), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(args) }, issued.access));
    ensure(rest.draft_sha256 === first.draft_sha256, 'personal-rest-mcp-preparation-parity');
    const approved = await call('prepare_saved_workflow', { ...args, approved_draft_hash: first.draft_sha256 }); ensure(approved.approval.status === 'HOST_REPORTED_APPROVED' && !approved.approval.grants_execution_authority, 'host-reported-approval-only');
    await call('prepare_saved_workflow', { ...args, approved_draft_hash: '0'.repeat(64) }, true);
    passed('same-connection-repeat-preparation-rest-parity-and-approval-binding');
    const agentPrep = await call('prepare_saved_workflow', { item_id: agent.item_id, revision_sha256: agent.revision_sha256 }); ensure(agentPrep.status === 'REVIEW_REQUIRED', 'saved-agent-preparation'); passed('existing-saved-agent-reuse');
    active = 'changed-referenced-account-profile';
    const seededMinds = rows.account_minds.expected;
    const changedProfiles = fixture.profiles.map(m => m.slug === fixture.profileSlug ? { ...m, principles: 'Changed synthetic account-profile review method.' } : m);
    const changed = { ...seededMinds, revision: seededMinds.revision + 1, profiles: JSON.stringify(changedProfiles), updated_at: new Date().toISOString() };
    rows.account_minds.candidates = [seededMinds, changed];
    rows.account_minds.expected = changed;
    ensure(await casPersonalRow(query, 'account_minds', identity.userId, seededMinds, changed), 'referenced-profile-change-cas');
    const changedWorkflow = await call('get_saved_item', { item_id: workflow.item_id }); ensure(changedWorkflow.revision_sha256 !== workflow.revision_sha256, 'referenced-profile-change-invalidates-workflow');
    await call('get_saved_item', { item_id: workflow.item_id, revision_sha256: workflow.revision_sha256 }, true);
    const sameOverride = await call('get_saved_item', { item_id: overridden.item_id }); ensure(sameOverride.revision_sha256 === overridden.revision_sha256, 'embedded-profile-override-does-not-drift');
    ensure(await casPersonalRow(query, 'account_minds', identity.userId, changed, seededMinds), 'restore-synthetic-profile-cas'); rows.account_minds.expected = seededMinds;
    const restoredWorkflow = await call('get_saved_item', { item_id: workflow.item_id }); ensure(restoredWorkflow.revision_sha256 === workflow.revision_sha256, 'restored-profile-restores-exact-source-revision');
    const repeated = await call('prepare_saved_workflow', args); ensure(repeated.draft_sha256 === first.draft_sha256, 'restored-profile-repeat-preparation-identical');
    passed('referenced-profile-change-stales-only-dependent-workflow-and-exact-restore');
  } catch (error) { evidence.checks.push({ check: typeof error?.check === 'string' ? error.check : active, status: 'FAIL' }); }
  finally {
    try { await client?.close(); } catch {}
    if (issued) {
      try {
        active = 'revoke-personal-test-grant';
        ensure((await http(new URL('/oauth/revoke', stagingOrigin), { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: issued.clientId, token: issued.refresh, token_type_hint: 'refresh_token' }) })).status === 200, 'revoke-personal-test-grant');
        const denied = await http(target.resource, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }, issued.access);
        ensure(denied.status === 401, 'revoked-personal-access-rejected'); passed('temporary-personal-oauth-grant-revoked-and-access-denied');
      } catch { evidence.checks.push({ check: 'temporary-personal-grant-cleanup-requires-review', status: 'FAIL' }); }
    }
    if (Object.keys(rows).length === 2) {
      const restoration = await restorePersonalRows(query, identity.userId, rows); evidence.savedRowsRestored = restoration.restored;
      evidence.checks.push(...restoration.results.map(r => ({ check: `${r.source}-original-row-restored-exactly`, status: r.status })));
      if (restoration.restored && recoveryFile) { try { await fs.unlink(recoveryFile); } catch { evidence.checks.push({ check: 'private-recovery-file-cleanup', status: 'FAIL' }); } }
    }
    evidence.ok = evidence.checks.length > 0 && evidence.checks.every(c => c.status === 'PASS') && evidence.savedRowsRestored === true;
  }
  return evidence;
}

async function main() {
  const admin = await import('./lib/mcp-release-admin.mjs');
  const result = await runPersonalLive({ admin, note: message => process.stdout.write(message + '\n') });
  const file = path.join(admin.repo, 'reports', `2026-10-23-mcp-personal-live-${Date.now()}.json`);
  await fs.writeFile(file, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write(JSON.stringify({ ...result, report: path.relative(admin.repo, file) }, null, 2) + '\n');
  process.exitCode = result.ok ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(() => { process.stderr.write('Personal staging acceptance could not start safely. No credentials or private saved data were printed.\n'); process.exitCode = 1; });
