#!/usr/bin/env node
// End-to-end test of everything a person's own AI can do with AI Blocks: the public MCP server (plain JSON-RPC over
// HTTP, as ChatGPT, Claude and Cursor send it) and the REST API. Read-only: it never writes, runs or saves anything,
// and it makes no model calls. Works against a local `wrangler dev` and production.
//
// Usage: node tools/test-mcp-api-e2e.mjs --origin <url> [--out report.json] [--delay-ms 0] [--only <check-prefix>]
//   --origin   http://127.0.0.1:5183 (local Worker) or https://useaiblocks.com
//   --out      write every check with its status, time and note as JSON
//   --delay-ms wait between requests (production limits bursts; 1200 keeps well inside them). Default: 0 locally,
//              1200 for any other origin.
// A 429 is retried once after its retry-after, and every 429 must carry retry-after (the rate-limit check).
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
const { inflateSync, strFromU8 } = createRequire(path.join(import.meta.dirname, '../site/package.json'))('fflate');

const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : fallback; };
const ORIGIN = (arg('--origin') ?? '').replace(/\/+$/, '');
if (!/^https?:\/\/[^/]+$/.test(ORIGIN)) { console.error('Use --origin http://127.0.0.1:5183 or --origin https://useaiblocks.com'); process.exit(2); }
const LOCAL = /^http:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(ORIGIN);
const DELAY = Number(arg('--delay-ms', LOCAL ? '0' : '1200'));
const OUT = arg('--out'), ONLY = arg('--only');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- HTTP with pacing and 429 handling ----
const limits = { seen: 0, with_retry_after: 0 };
let last = 0, requests = 0;
async function http(path, init = {}) {
  for (let attempt = 0; ; attempt++) {
    const wait = last + DELAY - Date.now(); if (wait > 0) await sleep(wait);
    last = Date.now(); requests++;
    const res = await fetch(path.startsWith('http') ? path : ORIGIN + path, { redirect: 'manual', signal: AbortSignal.timeout(60_000), ...init });
    if (res.status !== 429 || attempt) return res;
    limits.seen++;
    const after = Number(res.headers.get('retry-after'));
    if (after > 0) limits.with_retry_after++;
    await sleep(Math.min(after > 0 ? after : 60, 65) * 1000);
  }
}
const getJson = async (path, expected = 200, headers = {}) => {
  const res = await http(path, { headers: { accept: 'application/json', ...headers } });
  const text = await res.text();
  if (res.status !== expected) throw new Error(`${path}: HTTP ${res.status}, expected ${expected}: ${text.slice(0, 200)}`);
  return { res, body: text ? JSON.parse(text) : null };
};

// ---- MCP over HTTP: JSON-RPC POSTs, as hosts send them ----
let rpcId = 0, protocol = null;
async function rpc(method, params, { raw = false, notification = false } = {}) {
  const message = { jsonrpc: '2.0', method, ...(params === undefined ? {} : { params }), ...(notification ? {} : { id: ++rpcId }) };
  const res = await http('/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(protocol ? { 'mcp-protocol-version': protocol } : {}) }, body: JSON.stringify(message) });
  const text = await res.text();
  if (notification) return { status: res.status };
  // Hosts accept either a JSON body or an event stream; read both.
  const body = /^\s*\{/.test(text) ? JSON.parse(text) : JSON.parse(text.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5)).join('') || 'null');
  if (raw) return { status: res.status, body };
  if (res.status !== 200 || !body) throw new Error(`${method}: HTTP ${res.status} ${text.slice(0, 200)}`);
  if (body.error) throw Object.assign(new Error(`${method}: ${body.error.code} ${body.error.message}`), { rpc: body.error });
  return body.result;
}
async function tool(name, args, { allowError = false } = {}) {
  const result = await rpc('tools/call', { name, arguments: args });
  if (result.isError && !allowError) throw new Error(`${name} returned isError: ${result.content?.[0]?.text?.slice(0, 200)}`);
  if (!result.isError) {
    if (!result.structuredContent) throw new Error(`${name}: no structuredContent`);
    if (JSON.stringify(JSON.parse(result.content[0].text)) !== JSON.stringify(result.structuredContent)) throw new Error(`${name}: text and structured content differ`);
  }
  return allowError ? result : result.structuredContent;
}

// ---- checks ----
const results = [];
function ok(cond, message) { if (!cond) throw new Error(message); }
async function check(name, fn) {
  if (ONLY && !name.startsWith(ONLY)) return;
  const started = Date.now();
  try { const note = await fn(); results.push({ check: name, status: 'PASS', ms: Date.now() - started, note: note ?? '' }); }
  catch (error) { results.push({ check: name, status: 'FAIL', ms: Date.now() - started, note: String(error?.message ?? error).slice(0, 300) }); }
}
/** Mermaid as our diagrams write it: a flowchart header, defined nodes, links between them. */
function mermaidOk(text, label) {
  ok(typeof text === 'string' && /^flowchart (LR|TD)\n/.test(text), `${label}: no flowchart header`);
  const nodes = new Set([...text.matchAll(/^ {2}([a-z]+\d*|legend)(?:\(\[|\[|\{\{)"/gm)].map(m => m[1]));
  for (const m of text.matchAll(/^ {2}(\w+) (?:-->|-\.->|~~~)(?:\|"[^"|]*"\|)? (\w+)$/gm)) ok(nodes.has(m[1]) && nodes.has(m[2]), `${label}: link to an undefined node ${m[0].trim()}`);
  ok(nodes.has('s1'), `${label}: no step nodes`);
  return nodes.size;
}
const decodeBuilder = url => {
  const code = new URL(url).searchParams.get('flow');
  return JSON.parse(strFromU8(inflateSync(Uint8Array.from(atob(code.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)))));
};

const KINDS = ['skill', 'workflow', 'agent', 'prompt', 'mind', 'ai_tool', 'mini_tool'];
const ids = {};
const GOALS = ['write a landing page for my ad', 'get a late invoice paid without losing the customer', 'plan a month of social media posts for my bakery', 'find out why my Facebook ads stopped selling', 'hire my first freelance designer'];

console.log(`AI Blocks MCP and API end-to-end test against ${ORIGIN} (delay ${DELAY} ms)`);

await check('mcp_initialize', async () => {
  const r = await rpc('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'ai-blocks-e2e', version: '1.0.0' } });
  protocol = r.protocolVersion;
  ok(r.serverInfo?.name && r.capabilities?.tools && r.capabilities?.prompts && r.capabilities?.resources, 'missing capabilities');
  ok(r.capabilities.extensions?.['io.modelcontextprotocol/skills'], 'no Skills extension');
  ok(/search_library/.test(r.instructions ?? ''), 'instructions do not name search_library');
  await rpc('notifications/initialized', undefined, { notification: true });
  return `protocol ${protocol}, server ${r.serverInfo.name} ${r.serverInfo.version}`;
});

let toolList = [];
await check('mcp_tools_list', async () => {
  toolList = (await rpc('tools/list', {})).tools;
  const names = toolList.map(t => t.name);
  for (const n of ['search_library', 'plan_workflow', 'get_skill', 'get_workflow', 'get_resource', 'prepare_workflow', 'get_item', 'search', 'fetch']) ok(names.includes(n), `missing ${n}`);
  ok(names.length <= 10, `${names.length} tools: keep 10 or fewer`);
  for (const t of toolList) ok(t.annotations?.readOnlyHint === true, `${t.name} not read only`);
  for (const n of ['get_workflow', 'plan_workflow', 'prepare_workflow']) ok(/diagram you can show the user/.test(toolList.find(t => t.name === n).description), `${n} does not mention the diagram`);
  return names.join(', ');
});

// Real ids for every kind, found the way an AI finds them.
for (const kind of KINDS) {
  await check(`search_library_type_${kind}`, async () => {
    const r = await tool('search_library', { type: kind, limit: 3 });
    ok(r.items.length > 0, `no ${kind}`); ok(r.items.every(i => i.type === kind), 'type filter leaked');
    ids[kind] = r.items[0].id;
    return `${r.total} ${kind}s; using ${ids[kind]}`;
  });
}
ids.workflow = 'ad-landing-page';

await check('search_library_query', async () => {
  const r = await tool('search_library', { query: 'landing page for my ad', limit: 5 });
  ok(r.items.length && r.items.every(i => i.id && i.url.startsWith('https://useaiblocks.com/')), 'bad rows');
  return r.items.map(i => i.id).slice(0, 3).join(', ');
});
await check('search_library_job_browse', async () => {
  const jobs = JSON.parse((await rpc('resources/read', { uri: 'aiblocks://jobs' })).contents[0].text).jobs;
  const job = jobs.find(j => j.id === 'write-landing-page') ?? jobs[0];
  const r = await tool('search_library', { job: job.id, limit: 5 });
  ok(r.filters.job === job.id && r.items.length, 'job browse empty');
  return `${job.id}: ${r.total} items`;
});
await check('search_library_since', async () => {
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const r = await tool('search_library', { since, limit: 5 });
  ok(r.items.every(i => !i.updated || i.updated >= since), 'item older than since');
  return `${r.total} since ${since}`;
});
await check('search_library_tested', async () => {
  const r = await tool('search_library', { query: 'ad copy', tested: true, limit: 5, response_format: 'detailed' });
  ok(r.items.length && r.items.every(i => i.tested === true), 'untested row');
  return `${r.total} tested`;
});

await check('get_skill', async () => {
  const r = await tool('get_skill', { slug: ids.skill });
  ok(r.revision_sha256 && r.step_map && r.instruction_resource, 'incomplete skill');
  const full = await tool('get_skill', { slug: ids.skill, response_format: 'detailed', revision_sha256: r.revision_sha256 });
  ok(typeof full.instructions === 'string' || full.instructions_complete === false, 'no instructions');
  return `${ids.skill} ${r.revision_sha256.slice(0, 12)}`;
});
let flow;
await check('get_workflow_diagram', async () => {
  flow = await tool('get_workflow', { slug: ids.workflow });
  const n = mermaidOk(flow.diagram?.mermaid, 'get_workflow');
  ok(flow.handoff_check && flow.steps.length > 1, 'no steps');
  ok(flow.diagram.outline === undefined, 'concise should be Mermaid only');
  ok(/^https:\/\/useaiblocks\.com\/\?workflow=/.test(flow.open_in_builder), 'no builder link');
  const detailed = await tool('get_workflow', { slug: ids.workflow, response_format: 'detailed' });
  ok(typeof detailed.diagram.outline === 'string' && detailed.diagram.outline.includes('1. '), 'detailed has no outline');
  return `${flow.steps.length} steps, ${n} nodes, handoff ${flow.handoff_check.status}`;
});
await check('get_resource_full_read', async () => {
  const skill = await tool('get_skill', { slug: ids.skill });
  const parts = []; let offset = 0;
  for (let i = 0; i < 50; i++) {
    const page = await tool('get_resource', { slug: ids.skill, path: 'SKILL.md', revision_sha256: skill.revision_sha256, offset });
    parts.push(page.content); if (page.next_offset === null) break; offset = page.next_offset;
  }
  const bytes = Buffer.from(parts.join(''));
  ok(sha(bytes) === skill.instruction_resource.sha256, 'SKILL.md hash mismatch');
  return `${bytes.length} bytes verified`;
});
for (const kind of KINDS) {
  await check(`get_item_${kind}`, async () => {
    const r = await tool('get_item', { id: ids[kind], type: kind });
    ok(r.id === ids[kind] && r.type === kind && r.url, 'wrong item');
    return `${ids[kind]} (${r.schema})`;
  });
}

for (const [i, goal] of GOALS.entries()) {
  await check(`plan_workflow_goal_${i + 1}`, async () => {
    const r = await tool('plan_workflow', { request: goal });
    ok(r.first_steps.length || r.ready_workflows.length, 'nothing planned');
    if (r.diagram) mermaidOk(r.diagram.mermaid, 'plan');
    ok(r.diagram && r.open_in_builder, 'no diagram or builder link');
    return `${goal}: ${r.diagram.shows.kind} ${r.diagram.shows.id ?? r.diagram.shows.anchor} (${r.diagram.shows.steps.length} steps)`;
  });
}
await check('plan_workflow_slug', async () => {
  const step = flow?.steps?.[1]?.slug ?? 'ad-matched-landing-page-writer';
  const r = await tool('plan_workflow', { slug: step });
  ok(r.schema === 'abb-step-map/1' && Array.isArray(r.before) && Array.isArray(r.after), 'no step map');
  mermaidOk(r.diagram.mermaid, 'plan slug');
  return `${step}: ${r.before.length} before, ${r.after.length} after`;
});

await check('prepare_workflow_broken_draft_suggestions', async () => {
  const s = (flow?.steps ?? []).map(x => x.slug);
  ok(s.length >= 3, 'need the workflow steps');
  // Break it: last step first, the first step removed, the second listed twice.
  const broken = [s[s.length - 1], s[1], ...s.slice(2, -1), s[1]];
  const r = await tool('prepare_workflow', { goal: 'Check a broken copy of a ready workflow', slugs: broken });
  ok(r.handoff_check.status === 'WARN', 'broken draft passed');
  const kinds = new Set(r.suggestions.map(x => x.kind));
  ok(kinds.has('remove') && kinds.has('reorder'), `missing remove/reorder: ${[...kinds]}`);
  ok(r.suggestions.every(x => x.message), 'suggestion without a reason');
  ok(r.step_checks.length === broken.length, 'step checks');
  mermaidOk(r.diagram.mermaid, 'prepare'); ok(/:::bad/.test(r.diagram.mermaid), 'no red problem in diagram');
  const packed = decodeBuilder(r.open_in_builder);
  ok(JSON.stringify(packed.s) === JSON.stringify(r.proposed.slugs), 'builder link differs from the proposal');
  const again = await tool('prepare_workflow', { slugs: r.proposed.slugs, user_inputs: flow.handoff_check.user_inputs.map(u => u.type) });
  return `${r.suggestions.length} suggestions (${[...kinds].join(', ')}); proposal ${r.proposed.handoff_status}, rechecked ${again.handoff_check.status}`;
});
await check('prepare_workflow_swap_step_2', async () => {
  const s = flow.steps.map(x => x.slug);
  const first = await tool('prepare_workflow', { slugs: s, response_format: 'detailed' });
  ok(first.governing_added?.includes(ids.workflow), 'ready workflow not kept as governing skill');
  const option = first.step_checks[1].swap_options.find(o => o.fits) ?? first.step_checks[1].swap_options[0];
  ok(option, 'no swap option for step 2');
  const swapped = await tool('prepare_workflow', { slugs: s.map((x, i) => i === 1 ? option.slug : x), user_inputs: flow.handoff_check.user_inputs.map(u => u.type) });
  mermaidOk(swapped.diagram.mermaid, 'swapped');
  return `step 2 ${s[1]} -> ${option.slug}: ${swapped.handoff_check.status}`;
});
await check('prepare_workflow_full_steps_and_approval', async () => {
  const skill = await tool('get_skill', { slug: ids.skill });
  const draft = { name: 'E2E draft', goal: 'Prepare only; never run.', steps: [{ id: 'one', slug: ids.skill, revision_sha256: skill.revision_sha256 }] };
  const a = await tool('prepare_workflow', draft);
  ok(a.state === 'NOT_STARTED' && a.approval.status === 'REVIEW_REQUIRED' && a.execution.model_calls_by_service === 0, 'not a review draft');
  const b = await tool('prepare_workflow', { ...draft, approved_draft_hash: a.draft_sha256 });
  ok(b.approval.status === 'HOST_REPORTED_APPROVED' && b.approval.grants_execution_authority === false, 'approval binding');
  return a.draft_sha256.slice(0, 12);
});

await check('search_and_fetch', async () => {
  const r = await tool('search', { query: 'landing page checker' });
  ok(r.results.length && r.results[0].id.includes('/'), 'no type/id results');
  const doc = await tool('fetch', { id: r.results[0].id });
  ok(doc.text.length > 50 && doc.url && doc.metadata, 'empty fetch');
  const extra = await tool('fetch', { id: `ai_tool/${ids.ai_tool}` });
  ok(extra.metadata.type === 'ai_tool', 'ai tool fetch');
  return `${r.results.length} results; fetched ${r.results[0].id}`;
});

await check('prompts_list_and_get', async () => {
  const list = (await rpc('prompts/list', {})).prompts;
  const names = list.map(p => p.name);
  for (const n of ['find-a-skill', 'build-a-workflow', 'whats-new']) ok(names.includes(n), `missing ${n}`);
  const build = await rpc('prompts/get', { name: 'build-a-workflow', arguments: { goal: 'a landing page for my ad' } });
  ok(/prepare_workflow/.test(build.messages[0].content.text) && /diagram/.test(build.messages[0].content.text), 'build-a-workflow does not check and show the diagram');
  await rpc('prompts/get', { name: 'find-a-skill', arguments: { topic: 'ad copy' } });
  await rpc('prompts/get', { name: 'whats-new', arguments: {} });
  const featured = list.find(p => !['find-a-skill', 'build-a-workflow', 'whats-new'].includes(p.name));
  if (featured) await rpc('prompts/get', { name: featured.name, arguments: {} });
  return `${list.length} prompts`;
});
await check('resources', async () => {
  const listed = (await rpc('resources/list', {})).resources;
  ok(listed.some(r => r.uri === 'aiblocks://jobs'), 'jobs not listed');
  const templates = (await rpc('resources/templates/list', {})).resourceTemplates.map(t => t.uriTemplate);
  ok(templates.includes('aiblocks://{type}/{id}') && templates.includes('skill://{name}/SKILL.md'), 'templates');
  for (const kind of KINDS) {
    const r = await rpc('resources/read', { uri: `aiblocks://${kind}/${ids[kind]}` });
    ok(JSON.parse(r.contents[0].text).id === ids[kind], `aiblocks://${kind}`);
  }
  const skill = await tool('get_skill', { slug: ids.skill });
  ok(skill.skill_uri, 'no skill_uri');
  const md = await rpc('resources/read', { uri: skill.skill_uri });
  ok(md.contents[0].text?.length > 20, 'empty SKILL.md');
  return `aiblocks:// for ${KINDS.length} kinds and ${skill.skill_uri}`;
});
await check('skills_extension', async () => {
  const page = await rpc('skills/list', {});
  ok(page.skills.length === 50 && page.nextCursor && page.ttlMs && page.cacheScope === 'public', 'skills/list page');
  const next = await rpc('skills/list', { cursor: page.nextCursor });
  ok(next.skills.length, 'second page');
  const one = await rpc('skills/get', { uri: page.skills[0].uri });
  ok(one.skill.uri === page.skills[0].uri && one.skill.resources.length, 'skills/get');
  const file = await rpc('resources/read', { uri: one.skill.resources[0].uri });
  const bytes = file.contents[0].text !== undefined ? Buffer.from(file.contents[0].text) : Buffer.from(file.contents[0].blob, 'base64');
  ok(`sha256:${sha(bytes)}` === one.skill.resources[0].digest, 'skill file digest');
  return `${page.skills.length} + ${next.skills.length} listed; ${one.skill.uri} verified`;
});

await check('discovery_server_card', async () => {
  const { res, body } = await getJson('/mcp/server-card', 200, { accept: 'application/mcp-server-card+json', origin: 'https://any-client.example' });
  ok(res.headers.get('content-type')?.startsWith('application/mcp-server-card+json'), 'media type');
  ok(res.headers.get('access-control-allow-origin') === '*', 'CORS');
  ok(body.remotes?.[0]?.url === `${ORIGIN}/mcp`, 'remote url');
  const etag = res.headers.get('etag');
  const again = await http('/mcp/server-card', { headers: { 'if-none-match': etag } });
  ok(again.status === 304, `ETag revalidation gave ${again.status}`);
  return `${body.name} ${body.version}`;
});
await check('discovery_ai_catalog', async () => {
  const { res, body } = await getJson('/.well-known/ai-catalog.json');
  ok(res.headers.get('content-type')?.startsWith('application/ai-catalog+json'), 'media type');
  ok(body.entries?.[0]?.url === `${ORIGIN}/mcp/server-card`, 'entry');
  return body.entries[0].identifier;
});

await check('twins_md_and_json', async () => {
  const notes = [];
  for (const kind of ['skill', 'workflow', 'prompt', 'agent', 'mind']) {
    const id = ids[kind], page = new URL((await tool('get_item', { id, type: kind })).url).pathname;
    const md = await http(`${page}.md`); const text = await md.text();
    ok(md.status === 200 && /text\/markdown/.test(md.headers.get('content-type') ?? '') && text.startsWith('---'), `${page}.md gave ${md.status}`);
    const js = await http(`${page}.json`);
    ok(js.status === 200 && (await js.json()).id === id, `${page}.json gave ${js.status}`);
    notes.push(page);
  }
  return notes.join(', ');
});

await check('rest_every_openapi_route', async () => {
  const { body: spec } = await getJson('/api/v1/openapi.json');
  const skill = await tool('get_skill', { slug: ids.skill });
  const fill = { '{slug}': p => p.includes('workflows') ? ids.workflow : ids.skill, '{id}': p => p.includes('documents') ? `skill/${ids.skill}` : ids.skill };
  const query = { '/api/v1/search': '?q=ad+copy&type=skill&limit=3', '/api/v1/plan': '?q=landing+page+for+my+ad', '/api/v1/documents': '?q=landing+page', '/api/v1/resources/{slug}': `?path=SKILL.md&revision_sha256=${skill.revision_sha256}&limit=200` };
  const done = [];
  for (const [path, ops] of Object.entries(spec.paths)) {
    let url = path; for (const [k, f] of Object.entries(fill)) url = url.replace(k, f(path));
    url += query[path] ?? '';
    if (ops.get) { const { body } = await getJson(url); ok(body && typeof body === 'object', url); if (path === '/api/v1/workflows/{slug}') mermaidOk(body.diagram.mermaid, 'REST workflow'); if (path === '/api/v1/plan') mermaidOk(body.diagram.mermaid, 'REST plan'); }
    if (ops.post) {
      const res = await http(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ goal: 'REST check', slugs: flow.steps.map(s => s.slug).reverse() }) });
      const body = await res.json(); ok(res.status === 200 && body.suggestions && body.diagram, `${url} gave ${res.status}`);
      const mcp = await tool('prepare_workflow', { goal: 'REST check', slugs: flow.steps.map(s => s.slug).reverse() });
      ok(mcp.draft_sha256 === body.draft_sha256, 'REST and MCP drafts differ');
    }
    done.push(`${ops.get ? 'GET' : 'POST'} ${path}`);
  }
  const { body: status } = await getJson('/api/v1/status');
  ok(status.model_calls === false && status.hosted_execution === false && status.tools.length === toolList.length, 'status');
  return `${done.length} routes + status`;
});

await check('errors_mcp', async () => {
  const unknown = await tool('get_skill', { slug: 'no-such-skill-e2e' }, { allowError: true });
  ok(unknown.isError === true, 'unknown id should be a tool error');
  const bad = await rpc('tools/call', { name: 'get_skill', arguments: { slug: 'Bad Slug!' } }, { raw: true });
  ok(bad.body.error?.code === -32602, `bad input gave ${JSON.stringify(bad.body).slice(0, 120)}`);
  const noTool = await rpc('tools/call', { name: 'no_such_tool', arguments: {} }, { raw: true });
  ok(noTool.body.error?.code === -32602, 'unknown tool');
  const both = await rpc('tools/call', { name: 'prepare_workflow', arguments: { slugs: [ids.skill], steps: [] } }, { raw: true });
  ok(both.body.error?.code === -32602, 'slugs and steps together');
  const batch = await http('/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify([{ jsonrpc: '2.0', id: 1, method: 'tools/list' }]) });
  ok(batch.status === 400, 'batch accepted');
  const get = await http('/mcp'); ok(get.status === 405, `GET /mcp gave ${get.status}`);
  const resource = await rpc('resources/read', { uri: 'aiblocks://skill/no-such-skill-e2e' }, { raw: true });
  ok(resource.body.error, 'unknown resource');
  return 'unknown id, bad input, unknown tool, batch, GET and unknown resource rejected';
});
await check('errors_rest', async () => {
  const cases = [['/api/v1/skills/no-such-skill-e2e', 404, 'not_found'], ['/api/v1/search?limit=abc', 400, 'invalid_arguments'], ['/api/v1/search?q=a&q=b', 400, 'invalid_arguments'], ['/api/v1/items/' + ids.skill + '?type=nonsense', 400, 'invalid_arguments'], ['/api/v1/nope', 404, 'not_found'], [`/api/v1/workflows/${ids.skill}`, 400, 'not_a_workflow']];
  for (const [path, status, code] of cases) {
    const res = await http(path); const body = await res.json();
    ok(res.status === status && body.error?.code === code, `${path} gave ${res.status} ${body.error?.code}`);
    ok((res.headers.get('cache-control') ?? '').includes('no-store'), `${path} cacheable`);
  }
  const post = await http('/api/v1/workflow-preparations', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' });
  ok(post.status === 415, 'wrong media type accepted');
  const badJson = await http('/api/v1/workflow-preparations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
  ok(badJson.status === 400, 'bad JSON accepted');
  return `${cases.length + 2} error responses`;
});
await check('rate_limit_headers', async () => {
  // Every 429 met during the run must say when to retry; responses are never cached.
  ok(limits.seen === limits.with_retry_after, `${limits.seen - limits.with_retry_after} 429s without retry-after`);
  const res = await http('/api/v1/status');
  ok(res.headers.get('x-content-type-options') === 'nosniff' && (res.headers.get('cache-control') ?? '').includes('no-store'), 'headers');
  return limits.seen ? `${limits.seen} 429s, all with retry-after` : `no 429 in ${requests} requests${LOCAL ? ' (local Worker skips limiters)' : ''}`;
});

// ---- report ----
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const width = Math.max(...results.map(r => r.check.length), 10);
console.log(`\n${pad('check', width)}  status  ms     note`);
console.log(`${'-'.repeat(width)}  ------  -----  ${'-'.repeat(60)}`);
for (const r of results) console.log(`${pad(r.check, width)}  ${pad(r.status, 6)}  ${pad(r.ms, 5)}  ${r.note}`);
const failed = results.filter(r => r.status === 'FAIL').length;
console.log(`\n${results.length - failed} passed, ${failed} failed, ${requests} requests`);
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ origin: ORIGIN, ran_at: new Date().toISOString(), passed: results.length - failed, failed, requests, rate_limits: limits, results }, null, 2) + '\n');
process.exit(failed ? 1 : 0);
