import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { callOutcomeTool, catalogueResolver, outcomeMcpTools, OUTCOME_REST_OPERATIONS, OUTCOME_TOOLS } from '../src/outcomes/outcome-mcp.mjs';
import { BRIEF_SCHEMA, EVENT_SCHEMA, PLAN_SCHEMA, RESEARCH_SCHEMA } from '../src/outcomes/outcome-schema.mjs';
import { FIELDS, ValidationError, validatePlan, validateResearch } from '../src/outcomes/plan-contract.mjs';
import { EVENT_FIELDS } from '../src/outcomes/engagement.mjs';
import { WORK_CONTEXT_SCHEMA } from '../src/jobs/work-context.mjs';
import { checkSchema, nearest } from '../src/outcomes/schema-check.mjs';
import example from '../src/outcomes/examples/rising-cpa.mjs';
import { handlePublicMcp, PUBLIC_MCP_INSTRUCTIONS, PUBLIC_MCP_LISTED_TOOLS, PUBLIC_MCP_TOOLS, PUBLIC_MCP_VERSION, RETIRED_MCP_TOOLS } from '../src/server/public-mcp.ts';

const copy = v => JSON.parse(JSON.stringify(v));
const issuesOf = async promise => { try { await promise; } catch (error) { assert.ok(error instanceof ValidationError, String(error)); return error.issues; } assert.fail('Expected the call to be refused.'); };
const started = () => callOutcomeTool('start_outcome', { request: 'Our Meta ads CPA keeps going up', started: '2026-11-02' });
const step = (r, event, options) => callOutcomeTool('advance_outcome', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event }, options);
const briefed = async () => step(await started(), { type: 'brief', brief: example.brief });
const recorded = () => { const dir = new URL('../src/outcomes/evals/recorded/', import.meta.url); return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'))); };

test('outcome tool inputs are typed: events, briefs, research and plans carry their exact shape', () => {
  const advance = outcomeMcpTools.find(t => t.name === 'advance_outcome');
  const event = advance.inputSchema.properties.event;
  assert.deepEqual(event.oneOf.map(b => b.properties.type.const), Object.keys(EVENT_FIELDS));
  for (const branch of event.oneOf) assert.deepEqual(Object.keys(branch.properties).sort(), ['type', 'at', ...EVENT_FIELDS[branch.properties.type.const]].sort(), branch.properties.type.const);
  assert.deepEqual(Object.keys(BRIEF_SCHEMA.properties), FIELDS.brief);
  assert.deepEqual(Object.keys(RESEARCH_SCHEMA.properties), FIELDS.research);
  assert.deepEqual(Object.keys(PLAN_SCHEMA.properties), FIELDS.plan);
  assert.deepEqual(Object.keys(PLAN_SCHEMA.properties.stages.items.properties), FIELDS.stage);
  for (const name of ['record_outcome_decision', 'record_outcome_experiment']) assert.notDeepEqual(Object.keys(outcomeMcpTools.find(t => t.name === name).inputSchema.properties.decision ?? outcomeMcpTools.find(t => t.name === name).inputSchema.properties.experiment), ['type', 'description']);
  // Nothing the validators accept is refused by the schema: the worked example and every recorded run fit it.
  for (const run of [example, ...recorded()]) {
    assert.deepEqual(checkSchema(BRIEF_SCHEMA, run.brief), [], run.case ?? 'example');
    assert.deepEqual(checkSchema(RESEARCH_SCHEMA, run.research), [], run.case ?? 'example');
    assert.deepEqual(checkSchema(PLAN_SCHEMA, run.plan), [], run.case ?? 'example');
  }
  assert.deepEqual(checkSchema(EVENT_SCHEMA, { type: 'plan', research: example.research, plan: example.plan }), []);
  // The registry stays one list: REST routes and MCP definitions come from it.
  assert.deepEqual(Object.values(OUTCOME_REST_OPERATIONS), OUTCOME_TOOLS.map(t => t.name));
});

test('discovery delegates nested retention to the published full contract without hiding accepted fields',()=>{
  const discovery=EVENT_SCHEMA.oneOf.find(branch=>branch.properties.type.const==='complete').properties.work_context;
  assert.deepEqual(Object.keys(discovery.properties),Object.keys(WORK_CONTEXT_SCHEMA.properties));
  assert.deepEqual(discovery.required,WORK_CONTEXT_SCHEMA.required);
  assert.match(discovery.description,/GET \/api\/v1\/schemas\/ai-blocks-work-context\/1\.json/);
  assert.match(discovery.description,/unchanged-artifact retention/);
  // Discovery accepts a nested object; only the full contract is authoritative
  // for its required fields, unknown fields and bounded evidence structures.
  assert.deepEqual(checkSchema(discovery.properties.retention,{}),[]);
  const fullIssues=checkSchema(WORK_CONTEXT_SCHEMA.properties.retention,{});
  assert.deepEqual(fullIssues.map(issue=>issue.path).sort(),['artifacts','criteria','reason','request_review']);
  assert.ok(checkSchema(WORK_CONTEXT_SCHEMA.properties.retention,{unexpected:true}).some(issue=>issue.path==='unexpected'));
});

test('every problem in an event comes back at once, with field paths and the value probably meant', async () => {
  const r = await started();
  const brief = copy(example.brief);
  brief.metric.direction = 'decrese';
  delete brief.data_home;
  brief.deadlin = 'soon';
  brief.connections[0].access = 'write';
  const issues = await issuesOf(step(r, { type: 'brief', brief }));
  const at = path => issues.find(i => i.path === path);
  assert.equal(at('event.brief.metric.direction').suggestion, 'decrease');
  assert.match(at('event.brief.data_home').message, /required/);
  assert.equal(at('event.brief.deadlin').suggestion, 'deadline');
  assert.match(at('event.brief.connections[0].access').message, /"read", "draft", "live"/);
  assert.ok(issues.length >= 4);
  // Unknown arguments name the tool's real arguments.
  const args = await issuesOf(callOutcomeTool('advance_outcome', { engagment: r.engagement, engagement_sha256: r.engagement_sha256, event: { type: 'brief', brief: example.brief } }));
  assert.equal(args.find(i => i.path === 'engagment').suggestion, 'engagement');
  assert.ok(args.some(i => i.path === 'engagement' && /required/.test(i.message)));
  const type = await issuesOf(step(r, { type: 'breif', brief: example.brief }));
  assert.deepEqual(type.map(i => [i.path, i.suggestion]), [['event.type', 'brief']]);
});

test('plan rule breaks are collected together, each against its stage, and controls keep their reasons', async () => {
  const research = validateResearch(example.research);
  const plan = copy(example.plan);
  const stage = id => plan.stages.find(s => s.id === id);
  stage('decision').gate = 'review';
  stage('launch').gate = 'review';
  stage('evidence').from_steps = [];
  stage('context').depends_on = ['intak'];
  let error;
  try { validatePlan(plan, { research, brief: example.brief }); } catch (e) { error = e; }
  assert.ok(error instanceof ValidationError);
  const text = error.message;
  for (const reason of [/decision stage needs owner approval/, /takes live actions/, /must name the research steps/, /refers to unknown intak\. Did you mean "intake"\?/]) assert.match(text, reason);
  const index = plan.stages.findIndex(s => s.id === 'decision');
  assert.ok(error.issues.some(i => i.path === `stages[${index}].gate`));
  // Research problems and plan problems in one event come back in one reply.
  const b = await briefed();
  const badResearch = copy(example.research); badResearch.steps[0].sources = ['nope'];
  const issues = await issuesOf(step(b, { type: 'plan', research: badResearch, plan: example.plan }));
  assert.ok(issues.some(i => i.path.startsWith('event.research.steps[0]') && /unknown nope/.test(i.message)));
});

test('unknown specialists and items get the nearest real id', async () => {
  const roles = [{ id: 'paid-media-specialist', name: 'Paid media specialist', area: 'marketing' }, { id: 'seo-specialist', name: 'SEO specialist', area: 'marketing' }];
  const catalogue = {
    async readResource() { return { contents: [{ uri: 'aiblocks://roles', mimeType: 'application/json', text: JSON.stringify({ roles }) }] }; },
    async callTool(name, args) {
      if (name === 'get_item') { if (args.id === 'ad-angle-planner') return {}; throw Error('missing'); }
      if (name === 'search_library') return { items: [{ id: 'ad-angle-planner' }, { id: 'brief-writer' }] };
      throw Error(name);
    },
  };
  const found = await catalogueResolver(catalogue)({ roles: ['seo-specalist', 'paid-media-specialist'], items: ['ad-angle-planer', 'ad-angle-planner'] });
  assert.deepEqual(found.missing_roles, ['seo-specalist']);
  assert.deepEqual(found.missing_items, ['ad-angle-planer']);
  assert.deepEqual(found.suggestions, { 'seo-specalist': 'seo-specialist', 'ad-angle-planer': 'ad-angle-planner' });
  const b = await briefed();
  const plan = copy(example.plan);
  const owner = plan.stages.findIndex(s => s.kind !== 'intake' && s.owner.role);
  plan.stages[owner].owner = { role: 'seo-specalist' };
  const issues = await issuesOf(step(b, { type: 'plan', research: example.research, plan }, { resolve: async () => ({ missing_roles: ['seo-specalist'], missing_items: [], suggestions: { 'seo-specalist': 'seo-specialist' } }) }));
  assert.deepEqual(issues, [{ path: `event.plan.stages[${owner}].owner.role`, message: 'seo-specalist is not a specialist in the catalogue. Use find_specialist, or record the stage owner as a gap.', suggestion: 'seo-specialist' }]);
  assert.equal(nearest('ads-meta', ['meta-ads', 'seo']), 'meta-ads');
  assert.equal(nearest('zzz', ['meta-ads', 'seo']), null);
});

test('an unknown stage id in an event names the plan stages and the nearest one', async () => {
  const b = await briefed();
  const planned = await step(b, { type: 'plan', research: example.research, plan: example.plan });
  const r = await step(planned, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });
  const issues = await issuesOf(step(r, { type: 'start', stage_id: 'evidnce' }));
  assert.equal(issues[0].path, 'event');
  assert.equal(issues[0].suggestion, 'evidence');
  assert.match(issues[0].message, /Unknown stage evidnce\. The plan's stages: intake, /);
});

const rpcRequest = body => new Request('https://example.test/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-11-25' }, body: JSON.stringify(body) });
const rpc = async (body, service) => (await handlePublicMcp(rpcRequest(body), service)).json();
const roleList = Array.from({ length: 230 }, (_, i) => ({ id: `role-${String(i).padStart(3, '0')}`, name: `Role ${i}`, area: i % 2 ? 'marketing' : 'finance' }));
const library = {
  async callTool() { return { items: [] }; },
  async featuredWorkflows() { return []; }, async listSkills() { return { skills: [] }; }, async getSkill() { return {}; },
  async readResource(uri) { if (uri === 'aiblocks://roles') return { skill: false, contents: [{ uri, mimeType: 'application/json', text: JSON.stringify({ schema: 'ai-blocks-roles/1', areas: [{ id: 'all', name: 'All roles' }, { id: 'finance', name: 'Finance' }, { id: 'marketing', name: 'Marketing' }], roles: roleList.map(r => ({ ...r, uri: `aiblocks://roles/${r.id}`, url: `https://example.test/roles/${r.id}` })) }) }] }; throw Error(uri); },
};

test('MCP argument problems are tool errors the AI can read, not protocol errors', async () => {
  const r = await started();
  const reply = await rpc({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'advance_outcome', arguments: { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event: { type: 'brief', brief: { outcome: 'More bookings' } } } } }, library);
  assert.equal(reply.error, undefined);
  assert.equal(reply.result.isError, true);
  assert.match(reply.result.content[0].text, /^Fix these and call advance_outcome again\. Nothing was executed or saved\.\n/);
  const issues = reply.result.structuredContent.error.issues;
  assert.deepEqual(issues.map(i => i.path).sort(), ['event.brief.data_home', 'event.brief.decides', 'event.brief.deliverable', 'event.brief.done']);
  assert.equal(reply.result.structuredContent.schema, 'ai-blocks-tool-error/1');
  const other = await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'start_outcome', arguments: {} } }, { async callTool(name, args) { return callOutcomeTool(name, args); } });
  assert.equal(other.result.isError, true);
  assert.match(other.result.content[0].text, /request: is required/);
});

test('one front door: a small tool list with titles, short instructions, and clear answers for retired tools', async () => {
  const list = await (await handlePublicMcp(rpcRequest({ jsonrpc: '2.0', id: 1, method: 'tools/list' }), library)).text();
  const tools = JSON.parse(list).result.tools;
  assert.deepEqual(tools.map(t => t.name), PUBLIC_MCP_LISTED_TOOLS.map(t => t.name));
  assert.equal(tools[0].name, 'start_outcome');
  assert.ok(Buffer.byteLength(list) < 60_000, `tools/list is ${Buffer.byteLength(list)} bytes`);
  for (const tool of tools) assert.ok(tool.title, tool.name);
  for (const tool of PUBLIC_MCP_TOOLS) assert.ok(tool.title, tool.name);
  for (const name of ['scope_specialist_request', 'prepare_scoped_specialist_work', 'route_scoped_specialist_work', 'prepare_scoped_specialist_team', 'prepare_recommendation_handoff', 'prepare_specialist_team', 'checkpoint_specialist_team']) {
    assert.ok(!tools.some(t => t.name === name), name);
    assert.ok(PUBLIC_MCP_TOOLS.some(t => t.name === name), `${name} stays on REST`);
    const reply = await rpc({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name, arguments: {} } }, library);
    assert.equal(reply.result.isError, true, name);
    assert.match(reply.result.content[0].text, new RegExp(`${name} is no longer offered on this MCP server\\. .*start_outcome.*POST https://example\\.test${RETIRED_MCP_TOOLS[name].rest.replace(/\//g, '\\/')} `), name);
  }
  assert.ok(PUBLIC_MCP_INSTRUCTIONS.length <= 2200, `instructions are ${PUBLIC_MCP_INSTRUCTIONS.length} characters`);
  assert.match(PUBLIC_MCP_INSTRUCTIONS.slice(0, 512), /start_outcome/);
  assert.doesNotMatch(PUBLIC_MCP_INSTRUCTIONS, /ROAS|CPA|AOV/);
  assert.equal(PUBLIC_MCP_VERSION, '3.0.0');
  const init = await rpc({ jsonrpc: '2.0', id: 4, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 't', version: '1' } } }, library);
  assert.equal(init.result.serverInfo.version, '3.0.0');
});

test('start_outcome sends the method once and the example only when asked', async () => {
  const r = await started();
  assert.equal(r.method, undefined);
  assert.equal(r.example, undefined);
  assert.ok(r.files['METHOD.md'].includes('| Field | Ask | Note | Example |'));
  assert.match(r.files['METHOD.md'], /personal-agent-builder with get_skill/);
  assert.match(r.files['METHOD.md'], /formal engagement or publication is optional/);
  // Method v3's aim-higher section adds about 2.7 KB; still well under the 17.6 KB that sent the method twice.
  assert.ok(Buffer.byteLength(JSON.stringify(r)) < 15_000, `start_outcome is ${Buffer.byteLength(JSON.stringify(r))} bytes`);
  const withExample = await callOutcomeTool('start_outcome', { request: 'x', include_example: true });
  assert.equal(withExample.example.plan.stages[0].kind, 'intake');
});

test('aiblocks://roles is paged and filtered by area, and points to find_specialist', async () => {
  const read = async uri => { const reply = await rpc({ jsonrpc: '2.0', id: 5, method: 'resources/read', params: { uri } }, library); return reply.error ?? JSON.parse(reply.result.contents[0].text); };
  const first = await read('aiblocks://roles');
  assert.equal(first.total, 230); assert.equal(first.pages, 3); assert.equal(first.roles.length, 100); assert.equal(first.next, 'aiblocks://roles?page=2');
  assert.deepEqual(Object.keys(first.roles[0]), ['id', 'name', 'area']);
  assert.match(first.find, /find_specialist/);
  assert.deepEqual(first.areas.map(a => [a.id, a.roles]), [['finance', 115], ['marketing', 115]]);
  const marketing = await read('aiblocks://roles?area=marketing&page=2');
  assert.equal(marketing.total, 115); assert.equal(marketing.roles.length, 15); assert.equal(marketing.next, null);
  assert.ok(marketing.roles.every(r => r.area === 'marketing'));
  assert.equal((await read('aiblocks://roles?area=nope')).code, -32602);
  assert.equal((await read('aiblocks://roles?page=9')).code, -32602);
  assert.equal((await read('aiblocks://roles?sort=name')).code, -32602);
  const templates = await rpc({ jsonrpc: '2.0', id: 6, method: 'resources/templates/list' }, library);
  assert.ok(templates.result.resourceTemplates.some(t => t.uriTemplate === 'aiblocks://roles{?area,page}'));
});
