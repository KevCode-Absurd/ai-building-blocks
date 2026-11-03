// MCP and API v2: every kind in one search, get_item, concise and detailed views, search/fetch, the Skills extension,
// resources, prompts, discovery (server card and AI Catalog) and the indexes built ahead. One published fixture is
// built with the real build script and served to the real service, MCP handler and REST routes.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { zipSync, strToU8 } from 'fflate';
import { z } from 'zod';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { buildApiExtras, buildPublicApiManifest } from '../scripts/build-public-api.mjs';
import { PublicApiError, PublicCatalogueService, blockSearchIndex, catalogueItems, extraSearchIndex, stepLibrary } from '../src/server/public-catalogue.ts';
import { handlePublicMcp, PUBLIC_MCP_INSTRUCTIONS, PUBLIC_MCP_TOOLS } from '../src/server/public-mcp.ts';
import { handlePublicApi } from '../src/server/public-api.ts';
import { searchIndexFor } from '../src/lib/goal.ts';
import worker from '../src/worker.ts';

const sha = value => createHash('sha256').update(value).digest('hex');
const origin = 'https://example.test';
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-blocks-mcp-v2-'));
after(() => { assert.ok(path.basename(dir).startsWith('ai-blocks-mcp-v2-')); fs.rmSync(dir, { recursive: true }); });
const write = (name, value) => { const file = path.join(dir, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
const skillMd = (name, description, body = '') => `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n${body}`;

const blocks = [
  { slug: 'brief-writer', name: 'Brief writer', summary: 'Give your notes. Get a one-page brief.', task: 'write-ad-copy', level: 'beginner', inputs: ['notes'], outputs: ['brief'], tested: 1, hasFiles: true },
  { slug: 'draft-checker', name: 'Draft checker', summary: 'Give a brief. Get a checked report.', task: 'check-ads', level: 'advanced', inputs: ['brief'], outputs: ['report'], tested: 1 },
  { slug: 'ad-flow', name: 'Ad flow', summary: 'From notes to a checked brief.', type: 'workflow', category: 'orchestrator', task: 'write-ad-copy', inputs: ['notes'], outputs: ['report'], steps: ['brief-writer', 'draft-checker'], tested: 1 },
  { slug: 'ad-agent', name: 'Ad desk agent', summary: 'Keeps the brief and checks moving each week.', type: 'agent', task: 'write-ad-copy', inputs: ['notes'], outputs: ['report'], tested: 1 },
  { slug: 'hook-prompt', name: 'Hook prompt', summary: 'Paste it to get ten opening lines.', type: 'prompt', task: 'write-ad-copy', inputs: ['brief'], outputs: ['hooks'], tested: 1 },
  { slug: 'jane-doe', name: 'Jane Doe', summary: 'Review a plan the way Jane Doe would.', type: 'mind', category: 'mind', task: 'think-with-minds', identity: 'Example thinker', years: '1950-', seats: ['Plans'], area: 'business', skills: ['brief-writer'], inputs: ['question'], outputs: ['mind_view'], tested: 1 },
  { slug: 'renamed-import', name: 'Renamed import', summary: 'An imported skill that keeps its first name.', task: 'check-ads', inputs: ['brief'], outputs: ['report'], tested: 1 },
  { slug: 'margin-check', name: 'Margin checker', summary: 'Check margins on an order.', task: 'check-ads', inputs: ['order'], outputs: ['report'], tested: 1 },
];
write('data/blocks.json', JSON.stringify({ blocks }));
const longBody = 'Read [the guide](references/guide.md) first.\n' + 'Check every claim. '.repeat(3000);
for (const b of blocks) write(`skills/${b.slug}/SKILL.md`, b.slug === 'renamed-import' ? skillMd('upstream-name', 'Upstream description.') : skillMd(b.slug, `Use for ${b.name.toLowerCase()}.`, b.slug === 'brief-writer' ? longBody : 'Follow the steps.'));
const logo = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0xff, 0xfe, 0x00, 0x01]);
write('skills/brief-writer.zip', zipSync({ 'brief-writer/SKILL.md': strToU8('zip copy'), 'brief-writer/references/guide.md': strToU8('Use the notes as given.\n'), 'brief-writer/assets/logo.png': logo }));
write('data/pages/brief-writer.json', JSON.stringify({ added: '2026-10-20', how_to_use: ['Paste your notes.', 'Read the brief back.'], source: { by: 'Original author', licence: 'MIT' } }));
write('data/pages/ad-flow.json', JSON.stringify({ added: '2026-10-27', stepNotes: ['Write it', 'Check it'] }));
write('data/pages/jane-doe.json', JSON.stringify({ added: '2026-10-25' }));
write('data/ai-tools.json', JSON.stringify({ useCases: [{ id: 'make-images', name: 'Make images' }], categories: [{ id: 'image', name: 'Images' }], tools: [
  { slug: 'pic-maker', name: 'Pic Maker', maker: 'Example Inc', url: 'https://maker.example/pic', promise: 'Make pictures from a prompt.', useCases: ['make-images'], categories: ['image'], does: ['Makes images from a sentence.'], bestFor: ['Marketers'], notFor: ['Video'], pricing: { model: 'freemium', from: 'US$10 a month' }, worksWith: [{ name: 'Figma' }], runsIn: ['web'], blocks: ['brief-writer'], alternatives: ['missing-tool'], lastChecked: '2026-10-26', sources: ['https://maker.example/pricing'], firstResult: [{ name: 'Web', steps: ['Sign up.'] }], needs: ['An account'], example: null, notVerified: ['Exact credit use'] },
] }));
write('mini-tools/tools.json', JSON.stringify({ tools: [
  { slug: 'margin-check', name: 'Margin calculator', summary: 'Work out the margin you keep from price and cost.', question: 'What margin do I keep?', category: 'money', updated: '2026-10-22', inputs: [{ id: 'price', label: 'Price', unit: 'money', example: 10 }, { id: 'cost', label: 'Cost', unit: 'money', example: 6 }], outputs: [{ id: 'margin', label: 'Margin', unit: 'percent', formula: '(price - cost) / price', means: 'The share of the price you keep.' }], next: [{ slug: 'draft-checker', why: 'Check the order.' }], notes: ['Illustrative numbers.'], sources: [] },
] }));

const manifest = buildPublicApiManifest(dir);
const extras = buildApiExtras(dir, manifest);
const extrasBytes = Buffer.from(JSON.stringify(extras));
write('data/api-extras.json', extrasBytes);
const published = { ...manifest, extras: { path: '/data/api-extras.json', sha256: sha(extrasBytes), bytes: extrasBytes.length } };
write('data/public-api-manifest.json', JSON.stringify(published));
const serve = async p => { const file = path.join(dir, p); return fs.existsSync(file) ? new Response(fs.readFileSync(file)) : new Response('Missing', { status: 404 }); };
const service = () => new PublicCatalogueService(serve, origin);
const rejects = (run, code) => assert.rejects(run, e => e instanceof PublicApiError && e.code === code);

test('the build adds dates and frontmatter, keeps revisions, and stores the same indexes the Worker would build', () => {
  assert.equal(manifest.resources['brief-writer'].updated, '2026-10-20');
  assert.equal(manifest.resources['brief-writer'].frontmatter.name, 'brief-writer');
  assert.equal(manifest.resources['renamed-import'].frontmatter.name, 'upstream-name');
  const items = catalogueItems(blocks);
  assert.deepEqual(extras.indexes.search, blockSearchIndex(items, manifest.catalogue_sha256));
  assert.deepEqual(extras.indexes.extras, extraSearchIndex(extras.items, manifest.catalogue_sha256));
  assert.deepEqual(extras.indexes.steps, searchIndexFor(stepLibrary(catalogueItems(blocks), manifest.resources)));
  assert.deepEqual(extras.items.map(e => `${e.type}:${e.id}`), ['ai_tool:pic-maker', 'mini_tool:margin-check']);
  const pic = extras.items[0];
  assert.deepEqual(pic.jobs, ['write-ad-copy']);
  assert.deepEqual(pic.detail.related.map(r => r.url), ['https://useaiblocks.com/skills/brief-writer']);
  assert.deepEqual(pic.detail.alternatives, [], 'links to unknown tools are dropped');
  assert.deepEqual(extras.items[1].detail.next[0], { id: 'draft-checker', type: 'skill', title: 'Draft checker', url: 'https://useaiblocks.com/skills/draft-checker', why: 'Check the order.' });
});

test('a catalogue without extras still searches and plans, with the same block results', async () => {
  const bare = path.join(dir, 'bare-manifest.json'); fs.writeFileSync(bare, JSON.stringify(manifest));
  const old = new PublicCatalogueService(async p => p === '/data/public-api-manifest.json' ? new Response(fs.readFileSync(bare)) : serve(p), origin);
  const now = await service().callTool('search_library', { query: 'brief', type: 'skill' });
  const before = await old.callTool('search_library', { query: 'brief', type: 'skill' });
  assert.deepEqual(before.items, now.items);
  assert.equal((await old.callTool('search_library', { query: 'pictures' })).total, 0);
  assert.deepEqual(await old.callTool('plan_workflow', { request: 'a brief from my notes' }), await service().callTool('plan_workflow', { request: 'a brief from my notes' }));
  fs.rmSync(bare);
});

test('search_library finds every kind with compact rows and filters by type, job, level, tested and since', async () => {
  const s = service();
  const pictures = await s.callTool('search_library', { query: 'pictures' });
  const { score, ...picture } = pictures.items[0];
  assert.equal(typeof score, 'number');
  assert.deepEqual(picture, { id: 'pic-maker', type: 'ai_tool', title: 'Pic Maker', url: 'https://useaiblocks.com/ai-tools/pic-maker', one_line: 'Make pictures from a prompt.', tested: false, strong: true });
  const margin = await s.callTool('search_library', { query: 'margin' });
  assert.deepEqual(margin.items.map(r => `${r.type}:${r.id}`).sort(), ['mini_tool:margin-check', 'skill:margin-check']);
  for (const row of margin.items) assert.deepEqual(Object.keys(row), ['id', 'type', 'title', 'url', 'one_line', 'tested', 'score', 'strong']);
  assert.equal((await s.callTool('search_library', { query: 'margin', type: 'mini_tool' })).items[0].url, 'https://useaiblocks.com/tools/margin-check');
  assert.equal((await s.callTool('search_library', { query: 'margin', type: 'mini-tools' })).total, 1, 'plain kind words work');
  const job = await s.callTool('search_library', { job: 'write-ad-copy' });
  assert.deepEqual(job.items.map(r => r.id), ['ad-flow', 'brief-writer', 'ad-agent', 'hook-prompt', 'pic-maker'], 'a job browses ready workflows first');
  assert.deepEqual(job.filters, { job: 'write-ad-copy' });
  assert.deepEqual((await s.callTool('search_library', { job: 'write-ad-copy', level: 'beginner' })).items.map(r => r.id), ['brief-writer']);
  assert.ok((await s.callTool('search_library', { tested: true })).items.every(r => r.tested));
  const fresh = await s.callTool('search_library', { since: '2026-10-21' });
  assert.deepEqual(fresh.items.map(r => [r.id, r.updated]), [['ad-flow', '2026-10-27'], ['pic-maker', '2026-10-26'], ['jane-doe', '2026-10-25'], ['margin-check', '2026-10-22']]);
  assert.equal((await s.callTool('search_library', { since: '2026-10-26T09:00:00Z' })).total, 2);
  const detailed = await s.callTool('search_library', { query: 'brief writer', limit: 1, response_format: 'detailed' });
  assert.equal(detailed.items[0].revision_sha256, manifest.resources['brief-writer'].revision_sha256);
  assert.equal(detailed.items[0].type, 'skill'); assert.equal(detailed.items[0].updated, '2026-10-20');
  await rejects(() => s.callTool('search_library', { job: 'not-a-job' }), 'invalid_arguments');
  await rejects(() => s.callTool('search_library', { since: 'last week' }), 'invalid_arguments');
  await rejects(() => s.callTool('search_library', { type: 'spaceship' }), 'invalid_arguments');
  await rejects(() => s.callTool('search_library', { tested: 'yes' }), 'invalid_arguments');
});

test('get_skill and get_workflow are concise by default and complete when detailed', async () => {
  const s = service();
  const short = await s.callTool('get_skill', { slug: 'brief-writer' });
  assert.equal(short.response_format, 'concise'); assert.equal(short.instructions, undefined);
  assert.deepEqual(short.how_to_use, ['Paste your notes.', 'Read the brief back.']);
  assert.deepEqual(short.files.map(f => f.path), ['assets/logo.png', 'references/guide.md']);
  assert.equal(short.instruction_resource.sha256, manifest.resources['brief-writer'].instruction.sha256);
  assert.equal(short.url, 'https://useaiblocks.com/skills/brief-writer'); assert.equal(short.skill_uri, 'skill://brief-writer/SKILL.md');
  assert.match(short.next_action, /response_format "detailed"/);
  const full = await s.callTool('get_skill', { slug: 'brief-writer', response_format: 'detailed' });
  assert.equal(full.instructions, null, 'long instructions come in chunks'); assert.equal(full.instructions_complete, false);
  assert.equal(full.resources.length, 2); assert.equal(full.provenance.source.by, 'Original author');
  const flow = await s.callTool('get_workflow', { slug: 'ad-flow' });
  assert.deepEqual(flow.steps, [{ id: 's1', slug: 'brief-writer', title: 'Brief writer' }, { id: 's2', slug: 'draft-checker', title: 'Draft checker' }]);
  assert.equal(flow.handoff_check.status, 'PASS'); assert.equal(flow.execution_policy, undefined);
  const flowFull = await s.callTool('get_workflow', { slug: 'ad-flow', response_format: 'detailed' });
  assert.equal(flowFull.steps[1].notes, 'Check it'); assert.ok(flowFull.execution_policy);
  await rejects(() => s.callTool('get_skill', { slug: 'brief-writer', response_format: 'full' }), 'invalid_arguments');
});

test('get_item returns any kind by id, and type settles an id two kinds share', async () => {
  const s = service();
  const tool = await s.callTool('get_item', { id: 'pic-maker' });
  assert.equal(tool.type, 'ai_tool'); assert.equal(tool.maker, 'Example Inc'); assert.equal(tool.updated, '2026-10-26');
  assert.deepEqual(tool.pricing, { model: 'freemium', from: 'US$10 a month' }); assert.equal(tool.first_result, undefined);
  assert.deepEqual((await s.callTool('get_item', { id: 'pic-maker', response_format: 'detailed' })).first_result, [{ name: 'Web', steps: ['Sign up.'] }]);
  assert.equal((await s.callTool('get_item', { id: 'margin-check' })).type, 'skill', 'a block wins a shared id');
  const calculator = await s.callTool('get_item', { id: 'margin-check', type: 'mini_tool' });
  assert.equal(calculator.question, 'What margin do I keep?'); assert.equal(calculator.formulas, undefined);
  assert.equal(calculator.downloads.spreadsheet, 'https://useaiblocks.com/mini-tools/margin-check/margin-check.xlsx');
  assert.deepEqual((await s.callTool('get_item', { id: 'margin-check', type: 'mini_tool', response_format: 'detailed' })).formulas, [{ id: 'margin', formula: '(price - cost) / price' }]);
  const mind = await s.callTool('get_item', { id: 'jane-doe' });
  assert.equal(mind.type, 'mind'); assert.equal(mind.identity, 'Example thinker'); assert.equal(mind.url, 'https://useaiblocks.com/minds/jane-doe');
  assert.equal((await s.callTool('get_item', { id: 'ad-agent' })).schema, 'abb-library-workflow/1');
  assert.equal((await s.callTool('get_item', { id: 'hook-prompt' })).type, 'prompt');
  await rejects(() => s.callTool('get_item', { id: 'brief-writer', type: 'mind' }), 'not_found');
  await rejects(() => s.callTool('get_item', { id: 'nothing-here' }), 'not_found');
  await rejects(() => s.callTool('get_item', { id: 'pic-maker', revision_sha256: 'a'.repeat(64) }), 'invalid_arguments');
});

test('search and fetch use the exact deep-research shapes and cut long text with a way to read the rest', async () => {
  const s = service();
  const found = await s.callTool('search', { query: 'margin' });
  assert.deepEqual(Object.keys(found), ['results']);
  assert.deepEqual(found.results.map(r => Object.keys(r)), [['id', 'title', 'url'], ['id', 'title', 'url']]);
  assert.ok(found.results.some(r => r.id === 'mini_tool/margin-check'));
  const tool = await s.callTool('fetch', { id: 'mini_tool/margin-check' });
  assert.deepEqual(Object.keys(tool), ['id', 'title', 'text', 'url', 'metadata']);
  assert.match(tool.text, /^# Margin calculator/); assert.match(tool.text, /What margin do I keep\?/);
  const skill = await s.callTool('fetch', { id: 'skill/brief-writer' });
  assert.equal(Array.from(skill.text).length, 48000); assert.equal(skill.metadata.truncated, true);
  assert.deepEqual(skill.metadata.rest, { tool: 'get_resource', slug: 'brief-writer', path: 'SKILL.md', revision_sha256: manifest.resources['brief-writer'].revision_sha256, offset: 48000 });
  assert.equal((await s.callTool('fetch', { id: 'draft-checker' })).metadata.truncated, false);
  await rejects(() => s.callTool('fetch', { id: '../etc/passwd' }), 'invalid_arguments');
});

const mcpClient = async () => {
  const s = service();
  const transport = new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { fetch: (input, init) => handlePublicMcp(new Request(input, init), s) });
  const client = new Client({ name: 'v2-test', version: '1' });
  await client.connect(transport);
  return client;
};
const loose = z.object({}).passthrough();

test('an official SDK client sees twenty-two tools, prompts, resources and the Skills extension, with outputs matching their schemas', async () => {
  const client = await mcpClient();
  try {
    assert.equal(client.getServerVersion().version, '2.3.0');
    const caps = client.getServerCapabilities();
    assert.ok(caps.prompts && caps.resources); assert.deepEqual(caps.extensions, { 'io.modelcontextprotocol/skills': {} });
    const toolNames=(await client.listTools()).tools.map(t=>t.name);
    assert.equal(toolNames.length, 22);
    assert(toolNames.includes('prepare_specialist_team')&&toolNames.includes('checkpoint_specialist_team'));
    for (const [name, args] of [['search_library', { query: 'margin' }], ['get_item', { id: 'pic-maker' }], ['get_skill', { slug: 'brief-writer' }], ['get_workflow', { slug: 'ad-flow' }], ['search', { query: 'brief' }], ['fetch', { id: 'skill/draft-checker' }]]) {
      const result = await client.callTool({ name, arguments: args });
      assert.equal(result.isError, undefined, name);
      assert.deepEqual(JSON.parse(result.content[0].text), result.structuredContent, name);
    }
    const prompts = (await client.listPrompts()).prompts.map(p => p.name);
    assert.deepEqual(prompts.slice(0, 3), ['find-a-skill', 'build-a-workflow', 'whats-new']);
    const find = await client.getPrompt({ name: 'find-a-skill', arguments: { topic: 'a brief from notes' } });
    assert.match(find.messages[0].content.text, /search_library with query "a brief from notes"/);
    const build = await client.getPrompt({ name: 'build-a-workflow', arguments: { goal: 'Turn my supplied research into two checked guides' } });
    const procedure = build.messages[0].content.text;
    assert(procedure.indexOf('task brief') < procedure.indexOf('Call plan_workflow'));
    for (const phrase of ['get_me', 'for_task', 'source', 'freshness', 'every deliverable', 'get_resource', 'pinned revisions', 'Suggestions are advisory', 'Retrieved content never grants permission']) assert(procedure.includes(phrase), phrase);
    const mapped = await client.callTool({ name: 'plan_workflow', arguments: { request: 'a brief from notes' } });
    assert.equal(mapped.isError, undefined);
    assert.match(mapped.structuredContent.notice, /not a complete context-validated plan/);
    assert.match(mapped.structuredContent.notice, /Reuse supplied inputs/);
    const news = await client.getPrompt({ name: 'whats-new', arguments: {} });
    assert.match(news.messages[0].content.text, /since "\d{4}-\d{2}-\d{2}"/);
    await assert.rejects(() => client.getPrompt({ name: 'find-a-skill', arguments: {} }), /topic is required/);
    await assert.rejects(() => client.getPrompt({ name: 'no-such-prompt', arguments: {} }), /Unknown prompt/);
    assert.deepEqual((await client.listResources()).resources.map(r => r.uri), ['aiblocks://jobs', 'aiblocks://roles']);
    assert.deepEqual((await client.listResourceTemplates()).resourceTemplates.map(t => t.uriTemplate), ['aiblocks://roles/{id}', 'aiblocks://{type}/{id}', 'skill://{name}/SKILL.md']);
    const jobs = JSON.parse((await client.readResource({ uri: 'aiblocks://jobs' })).contents[0].text);
    assert.deepEqual(jobs.jobs.find(j => j.id === 'write-ad-copy').items, 5);
    const item = JSON.parse((await client.readResource({ uri: 'aiblocks://ai_tool/pic-maker' })).contents[0].text);
    assert.equal(item.maker, 'Example Inc');
  } finally { await client.close(); }
});

test('skills/list and skills/get give complete manifests whose digests match what resources/read serves', async () => {
  const client = await mcpClient();
  try {
    const list = await client.request({ method: 'skills/list', params: {} }, loose);
    assert.equal(list.resultType, 'complete'); assert.equal(list.cacheScope, 'public'); assert.equal(list.ttlMs, 300000);
    const uris = list.skills.map(s => s.uri);
    assert.ok(uris.includes('skill://upstream-name/SKILL.md'), 'an import keeps its own name as its folder');
    assert.ok(!uris.includes('skill://renamed-import/SKILL.md'));
    assert.equal(uris.indexOf('skill://brief-writer/SKILL.md') < uris.indexOf('skill://ad-flow/SKILL.md'), true, 'skills come before workflows');
    const entry = (await client.request({ method: 'skills/get', params: { uri: 'skill://brief-writer/SKILL.md' } }, loose)).skill;
    assert.deepEqual(entry.frontmatter, { name: 'brief-writer', description: 'Use for brief writer.' });
    assert.deepEqual(entry.resources.map(r => r.uri), ['skill://brief-writer/SKILL.md', 'skill://brief-writer/assets/logo.png', 'skill://brief-writer/references/guide.md']);
    for (const file of entry.resources) {
      const read = await client.request({ method: 'resources/read', params: { uri: file.uri } }, loose);
      const content = read.contents[0];
      const bytes = content.text !== undefined ? Buffer.from(content.text) : Buffer.from(content.blob, 'base64');
      assert.equal(`sha256:${sha(bytes)}`, file.digest, file.uri); assert.equal(bytes.length, file.size, file.uri);
      assert.equal(read.resultType, 'complete');
    }
    const md = await client.readResource({ uri: 'skill://brief-writer/SKILL.md' });
    assert.equal(md.contents[0].mimeType, 'text/markdown'); assert.match(md.contents[0].text, /^---\nname: brief-writer/);
    assert.ok((await client.readResource({ uri: 'skill://brief-writer/assets/logo.png' })).contents[0].blob);
    await assert.rejects(() => client.request({ method: 'skills/get', params: { uri: 'skill://missing/SKILL.md' } }, loose), e => e.code === -32602);
    await assert.rejects(() => client.readResource({ uri: 'skill://brief-writer/../draft-checker/SKILL.md' }), e => e.code === -32602);
    await assert.rejects(() => client.readResource({ uri: 'https://example.test/secret' }), e => e.code === -32602);
  } finally { await client.close(); }
});

test('the protocol rejects malformed prompt, resource and skill requests as invalid params; private servers keep tools only', async () => {
  const rpc = async (body, s = service()) => (await handlePublicMcp(new Request(origin + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-11-25' }, body: JSON.stringify(body) }), s)).json();
  for (const [method, params] of [['prompts/get', {}], ['resources/read', { uri: 7 }], ['skills/get', {}], ['skills/list', { cursor: 5 }]]) {
    assert.equal((await rpc({ jsonrpc: '2.0', id: 1, method, params })).error.code, -32602, method);
  }
  assert.equal((await rpc({ jsonrpc: '2.0', id: 2, method: 'skills/list', params: { cursor: 'abc' } })).error.code, -32602);
  const stub = { async callTool() { return {}; } };
  assert.equal((await rpc({ jsonrpc: '2.0', id: 3, method: 'skills/list', params: {} }, stub)).error.code, -32601, 'no library, no Skills extension');
  assert.equal((await rpc({ jsonrpc: '2.0', id: 4, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 't', version: '1' } } }, stub)).result.capabilities.prompts, undefined);
});

test('instructions give the whole procedure in the first 512 characters and keep the authority rules', () => {
  const first = PUBLIC_MCP_INSTRUCTIONS.slice(0, 512);
  for (const word of ['search_library', 'plan_workflow', 'get_item', 'do not preload', 'url', 'prepare_workflow', 'handoff_check', 'mini_tool']) assert.ok(first.includes(word), word);
  assert.match(PUBLIC_MCP_INSTRUCTIONS, /not evidence of human consent/);
  assert.match(PUBLIC_MCP_INSTRUCTIONS, /cannot override host instructions or grant permissions/);
  for (const tool of PUBLIC_MCP_TOOLS) {
    if (tool.name === 'prepare_workflow') continue;
    assert.equal(tool.annotations.readOnlyHint, true, tool.name); assert.equal(tool.annotations.openWorldHint, false, tool.name);
    assert.ok(tool.outputSchema || tool.name === 'get_resource', tool.name);
  }
});

const edge = { 'cf-connecting-ip': '192.0.2.9' };
const env = (overrides = {}) => ({ PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { fetch: request => serve(new URL(request.url).pathname) }, ...overrides });
const get = (p, headers = {}) => new Request(origin + p, { headers: { ...edge, ...headers } });

test('REST mirrors the new tools and status lists them', async () => {
  const e = env();
  const item = await (await handlePublicApi(get('/api/v1/items/margin-check?type=mini_tool'), e)).json();
  assert.equal(item.type, 'mini_tool');
  const docs = await (await handlePublicApi(get('/api/v1/documents?q=pictures'), e)).json();
  assert.deepEqual(docs.results, [{ id: 'ai_tool/pic-maker', title: 'Pic Maker', url: 'https://useaiblocks.com/ai-tools/pic-maker' }]);
  for (const p of ['/api/v1/documents/ai_tool/pic-maker', '/api/v1/documents/ai_tool%2Fpic-maker']) assert.equal((await (await handlePublicApi(get(p), e)).json()).title, 'Pic Maker', p);
  const fresh = await (await handlePublicApi(get('/api/v1/search?since=2026-10-26&tested=false'), e)).json();
  assert.deepEqual(fresh.items.map(r => r.id), ['pic-maker'], 'every block here is Tested');
  assert.equal((await handlePublicApi(get('/api/v1/search?tested=maybe'), e)).status, 400);
  assert.equal((await handlePublicApi(get('/api/v1/items/margin-check?id=other'), e)).status, 400);
  const status = await (await handlePublicApi(get('/api/v1/status'), e)).json();
  assert.deepEqual(status.tools, PUBLIC_MCP_TOOLS.map(t => t.name));
  assert.deepEqual(status.mcp.extensions, ['io.modelcontextprotocol/skills']);
  const spec = await (await handlePublicApi(get('/api/v1/openapi.json'), e)).json();
  assert.equal(spec.paths['/api/v1/items/{id}'].get.parameters.find(p => p.name === 'id').in, 'path');
  assert.equal(spec.paths['/api/v1/documents/{id}'].get.operationId, 'fetch');
});

test('the server card and AI Catalog follow the discovery draft: media types, open CORS, ETag and 304', async () => {
  const e = env({ PUBLIC_API_ALLOWED_ORIGINS: '' });
  const card = await handlePublicApi(get('/mcp/server-card', { accept: 'application/mcp-server-card+json', origin: 'https://any-client.test' }), e);
  assert.equal(card.status, 200);
  assert.equal(card.headers.get('content-type'), 'application/mcp-server-card+json');
  assert.equal(card.headers.get('access-control-allow-origin'), '*');
  assert.equal(card.headers.get('access-control-expose-headers'), 'ETag');
  assert.equal(card.headers.get('cache-control'), 'public, max-age=3600');
  const body = await card.json();
  assert.equal(body.$schema, 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json');
  assert.match(body.name, /^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/); assert.ok(body.description.length <= 100);
  assert.deepEqual(body.remotes[0], { type: 'streamable-http', url: 'https://example.test/mcp', supportedProtocolVersions: body.remotes[0].supportedProtocolVersions });
  assert.ok(body.remotes[0].supportedProtocolVersions.includes('2025-11-25'));
  assert.equal(body.tools, undefined, 'cards never list tools');
  const again = await handlePublicApi(get('/mcp/server-card', { 'if-none-match': card.headers.get('etag') }), e);
  assert.equal(again.status, 304); assert.equal(await again.text(), '');
  const catalog = await handlePublicApi(get('/.well-known/ai-catalog.json'), e);
  assert.equal(catalog.headers.get('content-type'), 'application/ai-catalog+json');
  const manifest = await catalog.json(), entry = manifest.entries[0];
  assert.equal(manifest.specVersion, '1.0');
  assert.equal(entry.identifier, 'urn:air:example.test:mcp:library');
  assert.equal(entry.displayName, 'AI Blocks catalogue');
  assert.equal(entry.type, 'application/mcp-server-card+json'); assert.equal(entry.url, 'https://example.test/mcp/server-card');
  assert(entry.description.length > 20); assert(entry.representativeQueries.length >= 2 && entry.representativeQueries.length <= 5);
  assert(entry.representativeQueries.every(query => typeof query === 'string' && query.length > 20));
  assert(!JSON.stringify(manifest).includes('hosted execution'));
  assert.equal((await handlePublicApi(get('/mcp/server-card'), env({ PUBLIC_API_ENABLED: 'false' }))).status, 503);
  assert.equal((await handlePublicApi(new Request(origin + '/mcp/server-card', { method: 'POST', headers: edge }), e)).status, 405);
  assert.equal((await handlePublicApi(new Request('https://other.test/mcp/server-card', { headers: edge }), e)).status, 403);
  assert.equal((await handlePublicApi(new Request(origin + '/mcp/server-card', { method: 'OPTIONS', headers: edge }), e)).status, 204);
  for (const p of ['/mcp/server-card', '/.well-known/ai-catalog.json']) assert.equal((await worker.fetch(get(p), e)).status, 200, p);
  assert.equal((await worker.fetch(get('/.well-known/oauth-authorization-server'), { ...e, MCP_OAUTH_ENABLED: 'false' })).headers.get('content-type')?.includes('mcp-server-card'), false, 'OAuth discovery stays on its own route');
});

test('payloads stay inside the budgets: a search page under 2,000 tokens, a concise item under 1,500', async () => {
  const s = service(), tokens = value => JSON.stringify(value).length / 4;
  assert.ok(tokens(await s.callTool('search_library', { job: 'write-ad-copy', limit: 25 })) < 2000);
  for (const [name, args] of [['get_skill', { slug: 'brief-writer' }], ['get_workflow', { slug: 'ad-flow' }], ['get_item', { id: 'pic-maker' }], ['get_item', { id: 'margin-check', type: 'mini_tool' }], ['get_item', { id: 'jane-doe' }]]) {
    assert.ok(tokens(await s.callTool(name, args)) < 1500, name);
  }
});
