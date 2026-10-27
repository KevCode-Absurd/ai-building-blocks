import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { decodeCatalogue } from '../src/lib/composer-core.ts';
import { around, chain, firstSteps } from '../src/lib/step-graph.ts';
import { PublicApiError, PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { handlePublicApi } from '../src/server/public-api.ts';
import { handlePublicMcp } from '../src/server/public-mcp.ts';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const sha = value => createHash('sha256').update(value).digest('hex');
const revision = 'a'.repeat(64);
// A small library with one hand-off line: site facts -> brand profile -> ad copy -> landing page -> page check.
const items = [
  { slug: 'brand-builder', name: 'Brand profile builder', summary: 'Share your website. Get a brand profile with products and buyers.', task: 'brand-file', role: 'source', inputs: ['web_page'], outputs: ['brand_brain'], tested: 1 },
  { slug: 'ad-writer', name: 'Ad copy writer', summary: 'Write ad copy for one product from your brand profile.', task: 'write-ad-copy', inputs: ['brand_brain', 'offer?'], outputs: ['ad_copy'], tested: 1 },
  { slug: 'page-writer', name: 'Landing page writer', summary: 'Write a landing page that matches your ad.', task: 'write-ad-copy', inputs: ['ad_copy', 'brand_brain'], outputs: ['landing_page'], tested: 1 },
  { slug: 'page-checker', name: 'Landing page checker', summary: 'Check a landing page and rank its problems.', task: 'write-ad-copy', role: 'check', inputs: ['landing_page'], outputs: ['audit_report'] },
  { slug: 'ad-page-flow', name: 'Ad and landing page flow', summary: 'Write an ad and a matching landing page, then check the page.', task: 'write-ad-copy', type: 'workflow', category: 'orchestrator', inputs: ['web_page'], outputs: ['audit_report'], steps: ['brand-builder', 'ad-writer', 'page-writer', 'page-checker'] },
  { slug: 'grace-hopper', name: 'Grace Hopper', summary: 'A mind.', type: 'mind', category: 'mind', task: 'set-up-ai' },
];
const library = decodeCatalogue({ blocks: items });

function service() {
  const blocks = JSON.stringify({ blocks: items });
  const assets = new Map([['/data/blocks.json', blocks]]); const resources = {};
  for (const item of items) {
    const md = `# ${item.name}\nFollow the user and verify inputs.\n`;
    assets.set(`/skills/${item.slug}/SKILL.md`, md);
    resources[item.slug] = { revision_sha256: revision, instruction: { path: `/skills/${item.slug}/SKILL.md`, sha256: sha(md), bytes: Buffer.byteLength(md) }, files: [], reference_validation: { status: 'PASS' } };
  }
  assets.set('/data/public-api-manifest.json', JSON.stringify({ schema: 'abb-public-catalogue/1', catalogue_sha256: sha(blocks), resources }));
  const fetchAsset = async path => assets.has(path) ? new Response(assets.get(path)) : new Response('Missing', { status: 404 });
  return { svc: new PublicCatalogueService(fetchAsset, 'https://example.test'), assets };
}
const rejects = (run, code) => assert.rejects(run, e => e instanceof PublicApiError && e.code === code);
const step = (id, slug) => ({ id, slug, revision_sha256: revision });

test('firstSteps puts the step that makes the result first and offers the ready workflow', () => {
  const plan = firstSteps(library, 'write a landing page for my ad', 5);
  assert.equal(plan.steps[0].slug, 'page-writer');
  assert.deepEqual(plan.steps[0].needs, ['ad_copy', 'brand_brain']);
  assert.deepEqual(plan.steps[0].makes, ['landing_page']);
  assert.ok(!plan.steps.some(s => s.slug === 'ad-page-flow' || s.slug === 'grace-hopper'), 'workflows and minds are not single steps');
  assert.deepEqual(plan.workflows.map(w => w.slug), ['ad-page-flow']);
  assert.deepEqual(plan.workflows[0].steps, ['brand-builder', 'ad-writer', 'page-writer', 'page-checker']);
});

test('around names what is handed over before and after a step, and who makes each required input', () => {
  const map = around(library, 'page-writer');
  const before = map.before.find(x => x.slug === 'ad-writer');
  assert.deepEqual(before, { slug: 'ad-writer', name: 'Ad copy writer', ports: ['ad_copy'], required: true, basis: 'ready_workflow' });
  const after = map.after.find(x => x.slug === 'page-checker');
  assert.deepEqual(after.ports, ['landing_page']); assert.equal(after.required, true);
  assert.deepEqual(map.needs, [{ type: 'ad_copy', made_by: ['ad-writer'] }, { type: 'brand_brain', made_by: ['brand-builder'] }]);
  assert.deepEqual(around(library, 'not-a-step'), { before: [], after: [], needs: [] });
});

test('chain finds hand-offs, user inputs, missing inputs and steps out of order', () => {
  const good = chain(library, ['brand-builder', 'ad-writer', 'page-writer', 'page-checker']);
  assert.equal(good.ok, true);
  assert.deepEqual(good.steps[2].inputs.map(p => [p.type, p.status, p.from]), [['ad_copy', 'from_step', 1], ['brand_brain', 'from_step', 0]]);
  assert.deepEqual(good.user_inputs, ['web_page']);
  const missing = chain(library, ['brand-builder', 'page-writer']);
  assert.equal(missing.ok, false);
  assert.equal(missing.problems[0].problem, 'missing'); assert.equal(missing.problems[0].type, 'ad_copy');
  assert.deepEqual(missing.problems[0].makers, ['ad-writer']);
  assert.match(missing.problems[0].message, /Step 2 \(page-writer\) needs ad_copy/);
  assert.equal(chain(library, ['brand-builder', 'page-writer'], { supplied: ['ad_copy'] }).ok, true, 'an input the user gives is not missing');
  const swapped = chain(library, ['brand-builder', 'ad-writer', 'page-checker', 'page-writer']);
  assert.deepEqual(swapped.problems.map(p => [p.problem, p.step, p.made_later_by]), [['out_of_order', 2, 3]]);
  // A custom step with typed ports takes part like a catalogue one.
  const custom = { slug: 'custom-ad-notes', name: 'Ad notes', summary: '', inputs: [], outputs: [{ type: 'ad_copy', required: true }] };
  assert.equal(chain(library, [custom, 'page-writer']).steps[1].inputs[0].status, 'from_step');
});

test('plan_workflow returns compact rows: a first-step plan for a request and a before/after map for a slug', async () => {
  const { svc } = service();
  const plan = await svc.callTool('plan_workflow', { request: 'write a landing page for my ad', limit: 3 });
  assert.equal(plan.schema, 'abb-workflow-plan/1');
  assert.deepEqual(plan.first_steps[0], { id: 'page-writer', type: 'skill', title: 'Landing page writer', url: 'https://useaiblocks.com/skills/page-writer', one_line: 'Write a landing page that matches your ad.', tested: true, needs: ['ad_copy', 'brand_brain'], makes: ['landing_page'] });
  assert.ok(plan.first_steps.length <= 3);
  assert.equal(plan.ready_workflows[0].id, 'ad-page-flow');
  assert.equal(plan.ready_workflows[0].url, 'https://useaiblocks.com/workflows/ad-page-flow');
  assert.equal(plan.ready_workflows[0].tested, false);
  assert.equal(plan.anchor.id, 'page-writer');
  const before = plan.anchor.before.find(x => x.id === 'ad-writer');
  assert.deepEqual(before.passes, ['ad_copy']); assert.equal(before.required, true);
  assert.deepEqual(Object.keys(before), ['id', 'type', 'title', 'url', 'one_line', 'tested', 'passes', 'required', 'basis']);
  assert.match(plan.next_action, /get_workflow/);
  assert.match(plan.notice, /no model was called/);
  const text = JSON.stringify(plan);
  assert.ok(!/instructions"|revision_sha256/.test(text), 'no full instructions or revisions in the plan');
  assert.ok(text.length < 4000, `plan stays small (${text.length} bytes)`);
  // Concise shows 3 steps before and after the best first step; detailed shows 5 and adds optional inputs and reasons.
  const detailed = await svc.callTool('plan_workflow', { request: 'write a landing page for my ad', response_format: 'detailed' });
  assert.equal(detailed.first_steps[0].why, 'Makes what you asked for');
  assert.deepEqual(detailed.first_steps.find(s => s.id === 'ad-writer')?.optional ?? ['offer'], ['offer']);
  assert.equal(plan.first_steps[0].optional, undefined);
  const map = await svc.callTool('plan_workflow', { slug: 'ad-writer' });
  assert.equal(map.schema, 'abb-step-map/1'); assert.equal(map.step.id, 'ad-writer');
  assert.ok(map.after.some(x => x.id === 'page-writer'));
  assert.deepEqual(map.ready_workflows_using_it.map(w => w.id), ['ad-page-flow']);
  const empty = await svc.callTool('plan_workflow', { request: 'zzzz qqqq' });
  assert.equal(empty.anchor, null); assert.match(empty.next_action, /Nothing matched/);
  await rejects(() => svc.callTool('plan_workflow', {}), 'invalid_arguments');
  await rejects(() => svc.callTool('plan_workflow', { request: 'landing page', slug: 'ad-writer' }), 'invalid_arguments');
  await rejects(() => svc.callTool('plan_workflow', { request: 'landing page', response_format: 'full' }), 'invalid_arguments');
  await rejects(() => svc.callTool('plan_workflow', { slug: 'grace-hopper' }), 'not_a_step');
  await rejects(() => svc.callTool('plan_workflow', { slug: 'missing-item' }), 'not_found');
});

test('get_skill carries its step map and get_workflow its hand-offs', async () => {
  const { svc } = service();
  const skill = await svc.callTool('get_skill', { slug: 'page-writer' });
  assert.ok(skill.step_map.before.some(x => x.id === 'ad-writer' && x.url === 'https://useaiblocks.com/skills/ad-writer'));
  assert.ok(skill.step_map.after.some(x => x.id === 'page-checker'));
  const flow = await svc.callTool('get_workflow', { slug: 'ad-page-flow' });
  assert.equal(flow.handoff_check.status, 'PASS');
  assert.deepEqual(flow.handoff_check.handoffs.find(h => h.step === 's3' && h.type === 'ad_copy'), { step: 's3', type: 'ad_copy', from: 's2', required: true });
  assert.deepEqual(flow.handoff_check.user_inputs, [{ step: 's1', type: 'web_page' }]);
});

test('prepare_workflow reports hand-off problems as warnings without blocking or changing the draft', async () => {
  const { svc } = service();
  const draft = { name: 'Page', goal: 'A landing page', steps: [step('brand', 'brand-builder'), step('page', 'page-writer')] };
  const warned = await svc.callTool('prepare_workflow', draft);
  assert.equal(warned.state, 'NOT_STARTED'); assert.equal(warned.approval.status, 'REVIEW_REQUIRED');
  assert.equal(warned.handoff_check.status, 'WARN');
  assert.deepEqual(warned.handoff_check.warnings.map(w => [w.step, w.type, w.problem, w.add_one_of]), [['page', 'ad_copy', 'missing', ['ad-writer']]]);
  assert.match(warned.handoff_check.warnings[0].message, /Step page \(page-writer\) needs ad_copy/);
  assert.equal(warned.checks.find(c => c.id === 'input-handoffs').status, 'WARN');
  assert.match(warned.next_action, /handoff_check/);
  const supplied = await svc.callTool('prepare_workflow', { ...draft, user_inputs: ['ad_copy'] });
  assert.equal(supplied.handoff_check.status, 'PASS');
  assert.equal(supplied.draft_sha256, warned.draft_sha256, 'user_inputs do not change the reviewed draft');
  const swapped = await svc.callTool('prepare_workflow', { name: 'Swapped', goal: 'Check then write', steps: [step('a', 'ad-writer'), step('check', 'page-checker'), step('write', 'page-writer')] });
  // The checker comes before the page it checks; the writer also lacks the brand profile no earlier step makes.
  assert.deepEqual(swapped.handoff_check.warnings.map(w => [w.step, w.problem, w.made_by_later_step ?? w.add_one_of]), [['check', 'out_of_order', 'write'], ['write', 'missing', ['brand-builder']]]);
  const fine = await svc.callTool('prepare_workflow', { name: 'Fine', goal: 'Ad then page', steps: [step('brand', 'brand-builder'), step('ad', 'ad-writer'), step('page', 'page-writer')] });
  assert.equal(fine.handoff_check.status, 'PASS');
  assert.deepEqual(fine.handoff_check.handoffs.map(h => [h.step, h.type, h.from]), [['ad', 'brand_brain', 'brand'], ['page', 'ad_copy', 'ad'], ['page', 'brand_brain', 'brand']]);
  await rejects(() => svc.callTool('prepare_workflow', { ...draft, user_inputs: 'ad_copy' }), 'invalid_arguments');
});

test('REST API serves the plan route and lists plan_workflow', async () => {
  const { assets } = service();
  const env = { PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { async fetch(request) { const file = assets.get(new URL(request.url).pathname); return file === undefined ? new Response('Missing', { status: 404 }) : new Response(file); } } };
  const get = path => new Request('https://example.test' + path, { headers: { 'cf-connecting-ip': '192.0.2.7' } });
  const plan = await handlePublicApi(get('/api/v1/plan?q=' + encodeURIComponent('landing page for my ad')), env);
  assert.equal(plan.status, 200);
  assert.equal((await plan.json()).anchor.id, 'page-writer');
  const bySlug = await (await handlePublicApi(get('/api/v1/plan?slug=ad-writer&limit=2'), env)).json();
  assert.equal(bySlug.schema, 'abb-step-map/1');
  assert.equal((await handlePublicApi(get('/api/v1/plan?q=a&request=b'), env)).status, 400);
  const status = await (await handlePublicApi(get('/api/v1/status'), env)).json();
  assert.ok(status.tools.includes('plan_workflow'));
  const openapi = await (await handlePublicApi(get('/api/v1/openapi.json'), env)).json();
  assert.equal(openapi.paths['/api/v1/plan'].get.operationId, 'plan_workflow');
});

test('an official MCP client gets plan_workflow and the changed tools as structured content that matches their output schemas', async () => {
  const { svc } = service();
  const transport = new StreamableHTTPClientTransport(new URL('https://example.test/mcp'), { fetch: async (input, init) => handlePublicMcp(new Request(input, init), svc) });
  const client = new Client({ name: 'step-graph-test', version: '1.0.0' });
  try {
    await client.connect(transport);
    const instructions = client.getInstructions();
    const head = instructions.slice(0, 512);
    for (const phrase of ['search_library first', 'plan_workflow for a multi-step job', 'load only', 'do not preload', 'url']) assert.ok(head.includes(phrase), `first 512 characters say: ${phrase}`);
    const tool = (await client.listTools()).tools.find(t => t.name === 'plan_workflow');
    assert.equal(tool.annotations.readOnlyHint, true); assert.equal(tool.annotations.openWorldHint, false);
    assert.equal(tool.outputSchema.type, 'object');
    // The client checks structuredContent against each tool's outputSchema; the text block carries the same JSON.
    for (const [name, args] of [['plan_workflow', { request: 'write a landing page for my ad' }], ['plan_workflow', { slug: 'page-writer', response_format: 'detailed' }], ['plan_workflow', { request: 'zzzz qqqq' }], ['get_skill', { slug: 'page-writer' }], ['get_workflow', { slug: 'ad-page-flow' }], ['prepare_workflow', { name: 'Page', goal: 'A page', steps: [step('brand', 'brand-builder'), step('page', 'page-writer')] }]]) {
      const result = await client.callTool({ name, arguments: args });
      assert.equal(result.isError, undefined, name);
      assert.deepEqual(JSON.parse(result.content[0].text), result.structuredContent, name);
    }
  } finally { await client.close(); }
});
