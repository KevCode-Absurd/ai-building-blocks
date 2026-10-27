import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync, strToU8 } from 'fflate';
import { SavedLibraryMcpService, savedLibraryMcpTools } from '../src/server/saved-library-mcp.ts';
import { memoryLibrary } from '../src/server/account-library.ts';
import { memoryMinds } from '../src/server/account-minds.ts';
import { memorySpaces } from '../src/server/spaces.ts';
import { PublicApiError } from '../src/server/public-catalogue.ts';
import { meContext } from '../src/lib/me-file.ts';

const mind = { slug: 'my-mind-researcher', name: 'My researcher', specialty: 'Review evidence', voice: 'Clear', principles: 'Verify sources', avoid: 'Invented facts', examples: '' };
const flow = { id: 'saved-flow', name: 'My saved workflow', goal: 'Write a memo', notes: 'Preserve uncertainty', updated: 123, nodes: [{ id: 'write', slug: 'custom-memo', x: 40, y: 110, notes: 'Use my tone' }], edges: [], customSkills: [{ slug: 'custom-memo', name: 'Memo', markdown: '# Memo\nUse the supplied brief.\n', summary: 'Write a memo', role: 'make', inputs: [{ type: 'brief', required: true }], outputs: [{ type: 'memo', required: true }] }] };
const blank = () => ({ kits: [], flows: [], recent: [], currentFlow: null, draft: null });
const rejects = (promise, status, code) => assert.rejects(promise, e => e instanceof PublicApiError && e.status === status && (!code || e.code === code));
async function fixture() {
  const library = memoryLibrary(), spaces = memorySpaces(), minds = memoryMinds();
  const state = { ...blank(), kits: [{ id: 'my-kit', name: 'My saved kit', slugs: ['public-writer', 'public-workflow'], updated: 1 }], flows: [flow], draft: { ...flow, id: 'draft-flow', name: 'My unsent draft' }, recent: ['BROWSING_HISTORY_MUST_NOT_AUTOMATICALLY_SHARE'] };
  await library.put('employee', { 'abb:v1': JSON.stringify(state), 'abb:business': JSON.stringify({ name: 'PRIVATE_BUSINESS_CONTEXT_MUST_NOT_AUTOMATICALLY_SHARE' }) }, 0);
  await library.put('foreign-user', { 'abb:v1': JSON.stringify({ ...blank(), kits: [{ id: 'foreign-kit', name: 'FOREIGN ACCOUNT SECRET', slugs: ['foreign-skill'] }] }) }, 0);
  for (const [id, owner] of [['mine', 'employee'], ['foreign', 'foreign-user']]) await spaces.addSpace({ id, name: id, created: 'stamp', updated: 'stamp', userId: owner, ownerHash: 'OWNER_HASH', shareToken: 'PRIVATE_SHARE_TOKEN', ipHash: 'IP_HASH', access: { mode: 'invited', emails: [], domain: '' } });
  for (const row of [
    { id: 'my-skill', spaceId: 'mine', kind: 'skill', title: 'My private skill', body: '# Method\nRead [support](references/support.md).\n', data: { files: { 'references/support.md': 'Complete company α source.' } } },
    { id: 'my-agent', spaceId: 'mine', kind: 'agent', title: 'My saved agent', body: 'Agent source awaiting complete structured workflow', data: null },
    { id: 'foreign-skill', spaceId: 'foreign', kind: 'skill', title: 'FOREIGN SPACE SECRET', body: 'FOREIGN SPACE SECRET', data: null },
    { id: 'hidden-skill', spaceId: 'mine', kind: 'skill', title: 'HIDDEN SECRET', body: 'Hidden', data: null, hidden: true },
  ]) await spaces.addItem({ ...row, summary: '', created: 'stamp', updated: 'stamp', visibility: 'private', hidden: row.hidden ?? false });
  await minds.put('employee', [mind], 0);
  await minds.put('foreign-user', [{ ...mind, slug: 'my-mind-foreign', name: 'FOREIGN PROFILE SECRET' }], 0);
  const calls = [];
  const publicService = { async callTool(name, args) { calls.push({ name, args }); return { slug: args.slug, revision_sha256: 'a'.repeat(64), resource_validation: { status: 'PASS' } }; } };
  const service = new SavedLibraryMcpService(library, { userId: 'employee', spaces, minds, publicService });
  return { library, spaces, minds, state, calls, service };
}
async function list(f, args = {}) { return f.service.callTool('list_saved_items', args); }
async function named(f, title) { return (await list(f)).items.find(item => item.title === title); }
async function item(f, title) { return f.service.callTool('get_saved_item', { item_id: (await named(f, title)).item_id }); }
async function resource(f, selected, path = 'item-data.json') {
  const value = await f.service.callTool('get_saved_resource', { item_id: selected.item_id, revision_sha256: selected.revision_sha256, path });
  assert.equal(value.encoding, 'base64');
  return Buffer.from(value.content, 'base64').toString('utf8');
}

test('personal saved tools cover existing account kits, flows, draft, own Space skills/agents and account minds only', async () => {
  const f = await fixture(), result = await list(f);
  assert.deepEqual(savedLibraryMcpTools.map(t => t.name), ['list_saved_items', 'get_saved_item', 'get_saved_resource', 'prepare_saved_workflow', 'get_me']);
  assert.deepEqual(result.items.map(i => i.title).sort(), ['Memo', 'Memo', 'My private skill', 'My researcher', 'My saved agent', 'My saved kit', 'My saved workflow', 'My unsent draft'].sort());
  assert.equal(result.scope, 'authenticated-account-saves-only');
  assert.doesNotMatch(JSON.stringify(result), /FOREIGN|HIDDEN|OWNER_HASH|PRIVATE_SHARE_TOKEN|IP_HASH|PRIVATE_BUSINESS|BROWSING_HISTORY/);
  await rejects(f.service.callTool('list_saved_items', { userId: 'foreign-user' }), 400);
  const anonymous = new SavedLibraryMcpService(f.library, { userId: '', spaces: f.spaces });
  await rejects(anonymous.callTool('list_saved_items', {}), 401);
});

test('saved kits preserve membership as unordered package references rather than inventing a workflow', async () => {
  const f = await fixture(), kit = await item(f, 'My saved kit');
  assert.equal(kit.kind, 'kit'); assert.equal(kit.collection.execution_order, null);
  assert.deepEqual(kit.collection.members.map(m => m.slug), ['public-writer', 'public-workflow']);
  assert.equal(kit.collection.members[1].if_workflow.tool, 'get_workflow');
  assert.deepEqual(JSON.parse(await resource(f, kit)).slugs, ['public-writer', 'public-workflow']);
  await rejects(f.service.callTool('prepare_saved_workflow', { item_id: kit.item_id, revision_sha256: kit.revision_sha256 }), 400, 'workflow_required');
});

test('private saved skill files and profiles transfer directly without provider calls or manual attachment', async () => {
  const f = await fixture(), previous = globalThis.fetch;
  globalThis.fetch = async () => { throw Error('No ambient provider call is allowed'); };
  try {
    const skill = await item(f, 'My private skill');
    assert.match(await resource(f, skill, 'references/support.md'), /Complete company α source/);
    assert.ok(skill.resources.every(r => r.retrieve.tool === 'get_saved_resource'));
    const profile = await item(f, 'My researcher');
    assert.match(await resource(f, profile, 'SKILL.md'), /My researcher/);
    assert.equal(JSON.parse(await resource(f, profile)).profile.slug, mind.slug);
  } finally { globalThis.fetch = previous; }
});

test('saved workflow reuse retains custom methods, graph notes and exact host-reported approval', async () => {
  const f = await fixture(), selected = await item(f, 'My saved workflow');
  const args = { item_id: selected.item_id, revision_sha256: selected.revision_sha256 };
  const prepared = await f.service.callTool('prepare_saved_workflow', args);
  assert.equal(prepared.status, 'REVIEW_REQUIRED'); assert.equal(prepared.stored_workflow.notes, flow.notes);
  assert.equal(prepared.stored_workflow.nodes[0].notes, 'Use my tone');
  assert.equal(prepared.resources.find(r => r.path === 'skills/custom-memo/SKILL.md').retrieve.tool, 'get_saved_resource');
  const approved = await f.service.callTool('prepare_saved_workflow', { ...args, approved_draft_hash: prepared.draft_sha256 });
  assert.equal(approved.approval.status, 'HOST_REPORTED_APPROVED'); assert.equal(approved.approval.grants_execution_authority, false);
  assert.equal(approved.execution_status, 'NOT_RUN');
  await f.library.put('employee', { 'abb:v1': JSON.stringify({ ...f.state, flows: [{ ...flow, notes: 'Changed notes' }] }) }, 1);
  await rejects(f.service.callTool('get_saved_resource', { ...args, path: 'item-data.json' }), 409, 'revision_changed');
});

test('personal saved IDs are scoped to their account and removed saved items become unavailable', async () => {
  const f = await fixture(), selected = await item(f, 'My saved kit');
  const foreign = new SavedLibraryMcpService(f.library, { userId: 'foreign-user', spaces: f.spaces, minds: f.minds });
  await rejects(foreign.callTool('get_saved_item', { item_id: selected.item_id }), 404);
  await f.library.put('employee', { 'abb:v1': JSON.stringify(blank()) }, 1);
  await rejects(f.service.callTool('get_saved_item', { item_id: selected.item_id }), 404);
});

test('personal pagination reaches saves beyond the old 300-item Space limit', async () => {
  const library = memoryLibrary();
  await library.put('many', { 'abb:v1': JSON.stringify({ ...blank(), kits: Array.from({ length: 326 }, (_, i) => ({ id: String(i), name: `Kit ${i}`, slugs: ['public-writer'] })) }) }, 0);
  const service = new SavedLibraryMcpService(library, { userId: 'many' });
  const seen = new Set(); let offset = 0;
  do {
    const page = await service.callTool('list_saved_items', { offset, limit: 25 });
    page.items.forEach(i => seen.add(i.item_id));
    if (page.next_offset === null) break;
    offset = page.next_offset;
  } while (true);
  assert.equal(seen.size, 326); assert.ok(offset > 300);
});

test('saved composer edited flowCode takes precedence over its older plan and preserves exact graph instructions', async () => {
  const f = await fixture();
  const packed = { v: 1, n: 'Edited composer', s: ['custom-memo'], p: [[4, 11]], e: [], m: [], g: 'Edited goal', gn: 'Edited notes', o: ['Edited step instruction'], cs: flow.customSkills };
  const code = Buffer.from(deflateSync(strToU8(JSON.stringify(packed)))).toString('base64url');
  await f.library.put('employee', { 'abb:v1': JSON.stringify(blank()), 'abb:composer': JSON.stringify({ format: 'ai-blocks-composition/1', goal: 'Old goal', flowCode: code, customSkills: flow.customSkills, plan: { title: 'Composer result', steps: [{ slug: 'WRONG_OLD_SKILL' }] } }) }, 1);
  const saved = await item(f, 'Composer result');
  const prepared = await f.service.callTool('prepare_saved_workflow', { item_id: saved.item_id, revision_sha256: saved.revision_sha256 });
  assert.equal(prepared.status, 'REVIEW_REQUIRED'); assert.equal(prepared.stored_workflow.goal, 'Edited goal');
  assert.equal(prepared.stored_workflow.nodes[0].notes, 'Edited step instruction');
  assert.equal(prepared.stored_workflow.nodes[0].slug, 'custom-memo');
  assert.equal(prepared.stored_workflow.composition_source.flowCode, code);
  const old = await f.library.get('employee'), source = JSON.parse(old.data['abb:composer']);
  await f.library.put('employee', { ...old.data, 'abb:composer': JSON.stringify({ ...source, flowCode: 'broken' }) }, old.revision);
  const broken = await item(f, 'Composer result');
  const blocked = await f.service.callTool('prepare_saved_workflow', { item_id: broken.item_id, revision_sha256: broken.revision_sha256 });
  assert.equal(blocked.status, 'BLOCKED'); assert.deepEqual(blocked.ordered_step_ids, []);
});

test('saved planner-only compositions and browser receipt workflows are retrievable without inference', async () => {
  const f = await fixture();
  const composition = { format: 'ai-blocks-composition/1', goal: 'Saved planner goal', context: 'Selected composition context', customSkills: flow.customSkills, plan: { title: 'Planner-only workflow', summary: 'My summary', assumptions: ['Ask for the brief'], steps: [{ slug: 'custom-memo', reason: 'Write memo', notes: 'Keep the required evidence' }], dependencies: [], bindings: [] } };
  const state = { ...blank(), browserSaves: [{ id: 'original-browser-receipt', data: { 'abb:v1': JSON.stringify({ ...blank(), flows: [{ ...flow, name: 'Retained browser workflow' }] }) } }] };
  await f.library.put('employee', { 'abb:v1': JSON.stringify(state), 'abb:composer': JSON.stringify(composition) }, 1);
  const selected = await item(f, 'Planner-only workflow');
  const prepared = await f.service.callTool('prepare_saved_workflow', { item_id: selected.item_id, revision_sha256: selected.revision_sha256 });
  assert.equal(prepared.status, 'REVIEW_REQUIRED'); assert.match(prepared.stored_workflow.nodes[0].notes, /Keep the required evidence/);
  assert.equal(prepared.stored_workflow.composition_source.context, composition.context);
  assert.ok((await list(f)).items.some(i => i.title === 'Retained browser workflow'));
});

test('a saved team-only agent retains assigned custom profiles without inventing steps', async () => {
  const f = await fixture();
  const team = { ...flow, name: 'Saved council', nodes: [], edges: [], customSkills: [], customMinds: [mind], team: { mode: 'together', minds: [mind.slug] } };
  await f.library.put('employee', { 'abb:v1': JSON.stringify({ ...blank(), flows: [team] }) }, 1);
  const selected = await item(f, team.name);
  const prepared = await f.service.callTool('prepare_saved_workflow', { item_id: selected.item_id, revision_sha256: selected.revision_sha256 });
  assert.equal(prepared.status, 'REVIEW_REQUIRED'); assert.deepEqual(prepared.ordered_step_ids, []);
  assert.equal(prepared.stored_workflow.team.mode, 'together'); assert.equal(prepared.steps_run, 0);
});

test('personal Space workflow attachments keep their saved private files after account item namespacing', async () => {
  const f = await fixture();
  const source = { nodes: [{ id: 'private-step', slug: 'company-private', x: 0, y: 0 }], edges: [], companySkills: [{ slug: 'company-private', item_id: 'my-skill' }] };
  await f.spaces.addItem({ id: 'attached', spaceId: 'mine', kind: 'workflow', title: 'My attached workflow', summary: '', body: '', data: source, visibility: 'private', hidden: false, created: 'stamp', updated: 'stamp' });
  const selected = await item(f, 'My attached workflow');
  const prepared = await f.service.callTool('prepare_saved_workflow', { item_id: selected.item_id, revision_sha256: selected.revision_sha256 });
  assert.equal(prepared.status, 'REVIEW_REQUIRED');
  const attached = prepared.company_packages[0];
  assert.equal(attached.title, 'My private skill');
  assert.ok(attached.resources.every(r => r.retrieve.tool === 'get_saved_resource'));
  assert.match(await resource(f, attached, 'references/support.md'), /Complete company α source/);
  assert.equal(prepared.stored_workflow.saved_original_data.companySkills[0].item_id, 'my-skill');
});

test('a legal saved Unicode skill larger than the previous byte cap remains completely retrievable', async () => {
  const f = await fixture();
  const body = '技'.repeat(90000);
  await f.spaces.updateItem('my-skill', { body });
  const selected = await item(f, 'My private skill');
  const descriptor = selected.resources.find(r => r.path === 'SKILL.md');
  assert.equal(descriptor.bytes, 270000);
  const first = await f.service.callTool('get_saved_resource', { item_id: selected.item_id, revision_sha256: selected.revision_sha256, path: 'SKILL.md', offset: 0, limit: 48000 });
  const last = await f.service.callTool('get_saved_resource', { item_id: selected.item_id, revision_sha256: selected.revision_sha256, path: 'SKILL.md', offset: 240000, limit: 48000 });
  assert.equal(first.next_offset, 48000); assert.equal(first.complete, false);
  assert.equal(last.complete, true); assert.equal(last.next_offset, null);
  assert.equal(Buffer.from(last.content, 'base64').toString('utf8'), '技'.repeat(10000));
});

test('referenced account profiles absent from a saved workflow resolve directly and bind its portable revision', async () => {
  const f = await fixture();
  const assigned = { ...flow, nodes: [{ ...flow.nodes[0], mind: mind.slug }] };
  await f.library.put('employee', { 'abb:v1': JSON.stringify({ ...blank(), flows: [assigned] }) }, 1);
  const selected = await item(f, flow.name);
  const prepared = await f.service.callTool('prepare_saved_workflow', { item_id: selected.item_id, revision_sha256: selected.revision_sha256 });
  assert.equal(prepared.status, 'REVIEW_REQUIRED');
  assert.deepEqual(prepared.stored_workflow.customMinds.map(m => m.slug), [mind.slug]);
  assert.equal(prepared.stored_workflow.saved_profile_resolution[0].source, 'account-minds');
  assert.match(await resource(f, selected, `skills/${mind.slug}/SKILL.md`), /Verify sources/);
  await f.minds.put('employee', [mind, { ...mind, slug: 'my-mind-unused', name: 'Unassigned private profile' }], 1);
  const unrelated = await item(f, flow.name);
  assert.equal(unrelated.revision_sha256, selected.revision_sha256, 'An unrelated profile change cannot silently alter a selected workflow');
  await f.minds.put('employee', [{ ...mind, principles: 'Changed source-review method' }], 2);
  const changed = await item(f, flow.name);
  assert.notEqual(changed.revision_sha256, selected.revision_sha256);
  await rejects(f.service.callTool('get_saved_resource', { item_id: selected.item_id, revision_sha256: selected.revision_sha256, path: `skills/${mind.slug}/SKILL.md` }), 409, 'revision_changed');
  assert.match(await resource(f, changed, `skills/${mind.slug}/SKILL.md`), /Changed source-review method/);
});

test('an explicit embedded profile overrides a same-slug account profile without revision drift', async () => {
  const f = await fixture();
  const embedded = { ...mind, name: 'Embedded reviewer', principles: 'Preserved embedded method' };
  const assigned = { ...flow, nodes: [{ ...flow.nodes[0], minds: [mind.slug] }], customMinds: [embedded] };
  await f.library.put('employee', { 'abb:v1': JSON.stringify({ ...blank(), flows: [assigned] }) }, 1);
  const selected = await item(f, flow.name);
  assert.match(await resource(f, selected, `skills/${mind.slug}/SKILL.md`), /Preserved embedded method/);
  await f.minds.put('employee', [{ ...mind, principles: 'New account profile method' }], 1);
  const unchanged = await item(f, flow.name);
  assert.equal(unchanged.revision_sha256, selected.revision_sha256);
  assert.doesNotMatch(await resource(f, unchanged, `skills/${mind.slug}/SKILL.md`), /New account profile method/);
});

test('embedded custom skills are individually discoverable and reusable with origin and matching support files', async () => {
  const f = await fixture();
  const markdown = '# Saved memo method\nRead [method](references/method.md).\n';
  const saved = { ...flow, customSkills: [{ ...flow.customSkills[0], markdown }], files: { 'skills/custom-memo/references/method.md': 'Exact saved skill support source.' } };
  await f.library.put('employee', { 'abb:v1': JSON.stringify({ ...blank(), flows: [saved] }) }, 1);
  const matches = await list(f, { kind: 'skill', query: 'Memo' });
  assert.equal(matches.items.length, 1);
  const found = matches.items[0];
  assert.equal(found.saved_origin.workflow_title, flow.name); assert.equal(found.saved_origin.skill_slug, 'custom-memo');
  const selected = await f.service.callTool('get_saved_item', { item_id: found.item_id });
  assert.equal(await resource(f, selected, 'SKILL.md'), markdown);
  assert.equal(await resource(f, selected, 'references/method.md'), 'Exact saved skill support source.');
  const source = JSON.parse(await resource(f, selected));
  assert.deepEqual(source.custom_skill.inputs, flow.customSkills[0].inputs);
  const parent = await f.service.callTool('get_saved_item', { item_id: found.saved_origin.workflow_item_id });
  assert.equal(parent.title, flow.name);
});

// ---- get_me (docs/ME-FILE-PRD.md §6, §6a, §6b): placeholder content only, no invented person ----
const ME = ['# me.md', '', '## Core (as of 2026-10-01)', '', 'CORE_PLACEHOLDER', '', '## Work (as of 2026-10-01)', '', 'WORK_PLACEHOLDER', '',
  '## Projects (as of 2026-09-01, expires 2026-10-01)', '', 'EXPIRED_PROJECT_PLACEHOLDER', '', '## Voice (as of 2026-10-01)', '', 'VOICE_PLACEHOLDER', '',
  '## Preferences (as of 2026-10-01)', '', 'PREFERENCES_PLACEHOLDER', '', '## Background (as of 2026-10-01)', '', 'BACKGROUND_PLACEHOLDER', '',
  '## Never (as of 2026-10-01)', '', 'NEVER_PLACEHOLDER', '', '## Where to look', '', '- Writing: LOOK_PLACEHOLDER', ''].join('\n');
const catalogue = {
  'fact-based-ad-copy-writer': { slug: 'fact-based-ad-copy-writer', name: 'Fact-based ad copy writer', type: 'skill', job: 'copy', task: 'write-ad-copy', inputs: [], outputs: [{ type: 'ad_copy', required: true }] },
  'x-and-linkedin-post-pair-writer': { slug: 'x-and-linkedin-post-pair-writer', name: 'X and LinkedIn post pair writer', type: 'skill', job: 'organic', task: 'grow-social', inputs: [], outputs: [{ type: 'copy_draft', required: true }] },
};
async function meFixture(business = { me: ME }) {
  const f = await fixture();
  await f.library.put('employee', { 'abb:v1': JSON.stringify(f.state), ...(business ? { 'abb:business': JSON.stringify(business) } : {}) }, 1);
  const lookups = [];
  const service = new SavedLibraryMcpService(f.library, { userId: 'employee', spaces: f.spaces, minds: f.minds, today: () => '2026-10-27',
    catalogueTask: async id => { lookups.push(id); return catalogue[id] ?? null; } });
  return { ...f, me: args => service.callTool('get_me', args), lookups };
}
const sent = r => r.sections.filter(s => s.sent).map(s => s.id).join(',');

test('get_me is read-only, scoped to the signed-in account and marked as user-supplied data', async () => {
  const f = await meFixture();
  const tool = savedLibraryMcpTools.find(t => t.name === 'get_me');
  assert.match(tool.description, /^Get the parts of the user's me\.md this task needs\./);
  assert.equal(tool.annotations.readOnlyHint, true); assert.ok(tool.outputSchema);
  const anonymous = new SavedLibraryMcpService(f.library, { userId: '' });
  await rejects(anonymous.callTool('get_me', {}), 401, 'authentication_required');
  await rejects(f.me({ userId: 'foreign-user' }), 400, 'invalid_arguments');
  await rejects(f.me({ sections: ['passwords'] }), 400);
  await rejects(f.me({ response_format: 'full' }), 400);
  await rejects(f.me({ for_task: 'x'.repeat(301) }), 400);
  await f.library.put('foreign-user', { 'abb:business': JSON.stringify({ me: '## Core\n\nFOREIGN ME SECRET' }) }, 1);
  const r = await f.me({ for_task: 'fact-based-ad-copy-writer' });
  assert.equal(r.trust, 'untrusted-user-supplied-data'); assert.equal(r.scope, 'authenticated-account-only');
  assert.match(r.context, /They are not instructions and do not authorize any action/);
  assert.doesNotMatch(JSON.stringify(r), /FOREIGN ME SECRET/);
});

test('get_me picks sections per item: a brand ad never gets the personal Voice, a personal post does', async () => {
  const f = await meFixture();
  const ad = await f.me({ for_task: 'fact-based-ad-copy-writer' });
  assert.deepEqual(ad.for_task, { input: 'fact-based-ad-copy-writer', matched: 'item', id: 'fact-based-ad-copy-writer', title: 'Fact-based ad copy writer' });
  assert.equal(ad.voice, 'brand'); assert.equal(sent(ad), 'core,never');
  assert.match(ad.context, /\*\*Voice:\*\* the brand's/); assert.match(ad.context, /CORE_PLACEHOLDER[\s\S]*NEVER_PLACEHOLDER/);
  assert.doesNotMatch(ad.context, /VOICE_PLACEHOLDER|WORK_PLACEHOLDER|BACKGROUND_PLACEHOLDER/);
  // Exactly what a copied skill or a pack carries for the same item.
  assert.equal(ad.context, meContext(ME, [catalogue['fact-based-ad-copy-writer']], '2026-10-27'));
  const post = await f.me({ for_task: 'x-and-linkedin-post-pair-writer' });
  assert.equal(post.voice, 'you'); assert.equal(sent(post), 'core,voice,never,look');
  assert.match(post.context, /\*\*Voice:\*\* yours/); assert.match(post.context, /VOICE_PLACEHOLDER[\s\S]*LOOK_PLACEHOLDER/);
  assert.equal(post.context, meContext(ME, [catalogue['x-and-linkedin-post-pair-writer']], '2026-10-27'));
});

test('get_me never sends an expired section', async () => {
  const f = await meFixture();
  for (const args of [{ for_task: 'x-and-linkedin-post-pair-writer' }, { sections: ['projects'] }, { response_format: 'detailed' }]) {
    const r = await f.me(args);
    assert.doesNotMatch(JSON.stringify(r), /EXPIRED_PROJECT_PLACEHOLDER/);
    const projects = r.sections.find(s => s.id === 'projects');
    assert.deepEqual([projects.expired, projects.sent, projects.expires, projects.as_of], [true, false, '2026-10-01', '2026-09-01']);
    assert.match(r.context, /Expired on 2026-10-01\. Don't use it\./);
  }
});

test('get_me with no me.md says so and points to the me.md page', async () => {
  const f = await meFixture(null);
  const r = await f.me({ for_task: 'x-and-linkedin-post-pair-writer' });
  assert.equal(r.saved, false); assert.equal(r.source, 'none'); assert.equal(r.context, ''); assert.deepEqual(r.sections, []);
  assert.match(r.next_action, /No me\.md is saved[\s\S]*https:\/\/useaiblocks\.com\/me-md/);
  // The 9 basic fields still count as a saved me.md (the fixture's business name).
  const basic = await (await fixture()).service.callTool('get_me', {});
  assert.equal(basic.saved, true); assert.equal(basic.source, 'basic_fields'); assert.match(basic.context, /PRIVATE_BUSINESS_CONTEXT/);
});

test('get_me with free text builds a task from the words; slugs not in the catalogue fall back to words', async () => {
  const f = await meFixture();
  const post = await f.me({ for_task: 'Write a LinkedIn post about my launch' });
  assert.deepEqual(post.for_task, { input: 'Write a LinkedIn post about my launch', matched: 'text' });
  assert.equal(post.voice, 'you'); assert.equal(sent(post), 'core,voice,never,look');
  assert.deepEqual(f.lookups, [], 'free text is not looked up as an item');
  const plan = await f.me({ for_task: 'weekly plan' });
  assert.equal(plan.voice, null); assert.equal(sent(plan), 'core,preferences,look');
  const unknown = await f.me({ for_task: 'speaker-bio-writer' });
  assert.equal(unknown.for_task.matched, 'text'); assert.deepEqual(f.lookups, ['speaker-bio-writer']);
  assert.match(sent(unknown), /background/);
});

test('get_me returns chosen sections, the Core with a dated list, or the whole file', async () => {
  const f = await meFixture();
  const chosen = await f.me({ sections: ['work', 'Background'] });
  assert.equal(sent(chosen), 'work,background'); assert.doesNotMatch(chosen.context, /CORE_PLACEHOLDER/);
  const core = await f.me({});
  assert.equal(sent(core), 'core'); assert.match(core.next_action, /Core only/);
  assert.deepEqual(core.sections.map(s => [s.id, s.as_of]), [['core', '2026-10-01'], ['work', '2026-10-01'], ['projects', '2026-09-01'], ['voice', '2026-10-01'], ['preferences', '2026-10-01'], ['background', '2026-10-01'], ['never', '2026-10-01'], ['look', null]]);
  assert.doesNotMatch(core.context, /WORK_PLACEHOLDER/);
  const whole = await f.me({ for_task: 'fact-based-ad-copy-writer', response_format: 'detailed' });
  assert.match(whole.context, /^## Your me\.md\n/); assert.match(whole.context, /WORK_PLACEHOLDER[\s\S]*VOICE_PLACEHOLDER[\s\S]*BACKGROUND_PLACEHOLDER/);
  const big = await meFixture({ me: '## Core\n\n' + 'x'.repeat(41000) });
  await rejects(big.me({}), 413, 'me_file_too_large');
});
