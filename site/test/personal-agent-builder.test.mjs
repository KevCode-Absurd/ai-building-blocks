import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import YAML from 'yaml';
import { checkInputContract } from '../../tools/qa/contract-evidence.mjs';
import { PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { handlePublicApi } from '../src/server/public-api.ts';
import { handlePublicMcp } from '../src/server/public-mcp.ts';
import { publishedSourceBytes } from '../scripts/lib/published-source-bytes.mjs';

const id = 'personal-agent-builder';
const source = new URL(`../../catalogue-items/general/${id}/`, import.meta.url);
const readSource = name => fs.readFileSync(new URL(name, source), 'utf8');
const publicAsset = pathname => fs.readFileSync(new URL('../public' + pathname, import.meta.url));
const assetFetch = async pathname => {
  try { return new Response(publicAsset(pathname)); }
  catch (error) { if (error.code === 'ENOENT') return new Response('Missing', { status: 404 }); throw error; }
};
const service = () => new PublicCatalogueService(assetFetch, 'https://example.test');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const env = () => ({
  PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test',
  API_READ_LIMITER: { async limit() { return { success: true }; } },
  API_WRITE_LIMITER: { async limit() { return { success: true }; } },
  ASSETS: { fetch: request => assetFetch(new URL(request.url).pathname) }
});
const get = path => new Request('https://example.test' + path, { headers: { 'cf-connecting-ip': '192.0.2.7' } });

test('personal builder starts from a request and has traceable optional-document input review', () => {
  const item = YAML.parse(readSource('item.yaml'));
  assert.deepEqual(item.inputs, [{ type: 'question', required: true }, { type: 'document', required: false }]);
  assert.deepEqual(item.outputs, [{ type: 'document', required: true }]);
  const page = YAML.parse(readSource('page.yaml'));
  assert.equal(page.new_slug, id);
  assert.equal(page.job, 'set-up-ai');
  const registry = JSON.parse(fs.readFileSync(new URL('../../tools/qa/catalogue-review.json', import.meta.url)));
  assert.deepEqual(checkInputContract(item, readSource('SKILL.md'), registry.inputs[`catalogue-items/general/${id}/item.yaml`]), []);
});

test('actual generated catalogue discovers personal builder by job and judgment vocabulary', async () => {
  const s = service();
  for (const query of ['personal agent builder', 'tacit judgment', 'editable dossier', 'conditional taste']) {
    const result = await s.callTool('search_library', { query, type: 'skill', limit: 25 });
    const found = result.items.find(row => row.id === id);
    assert.ok(found, `Missing from generated search for ${query}; regenerate the catalogue before running this integration check.`);
    assert.equal(found.url, `https://useaiblocks.com/skills/${id}`);
    assert.equal(found.tested, false, 'A reviewed instruction outline is not an executed sample or quality test.');
  }
  const response = await handlePublicApi(get(`/api/v1/search?q=personal%20agent%20builder&type=skill`), env());
  assert.equal(response.status, 200);
  assert.ok((await response.json()).items.some(row => row.id === id));
});

test('REST, MCP resource and complete source retrieval expose the same real private-builder method', async () => {
  const s = service();
  const response = await handlePublicApi(get(`/api/v1/skills/${id}?response_format=detailed`), env());
  assert.equal(response.status, 200, 'The real generated personal-builder package must be indexed.');
  const rest = await response.json();
  const detail = await s.callTool('get_skill', { slug: id, response_format: 'detailed', revision_sha256: rest.revision_sha256 });
  assert.equal(detail.url, `https://useaiblocks.com/skills/${id}`);
  assert.equal(detail.skill_uri, `skill://${id}/SKILL.md`);
  // Public resources use canonical UTF-8 text bytes regardless of checkout EOLs.
  // Compare all complete retrieval paths and the digest against that exact export.
  const actual = publishedSourceBytes('SKILL.md', fs.readFileSync(new URL('SKILL.md', source))).toString('utf8');
  assert.equal(detail.instructions_complete, true);
  assert.equal(detail.instructions, actual);
  assert.equal(rest.instructions, actual);
  assert.equal(detail.instruction_resource.sha256, sha(Buffer.from(actual)));
  const resource = await s.readResource(`skill://${id}/SKILL.md`);
  assert.equal(resource.contents[0].text, actual);
  const mcp = await handlePublicMcp(new Request('https://example.test/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-11-25' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: `skill://${id}/SKILL.md` } })
  }), s);
  assert.equal(mcp.status, 200);
  assert.equal((await mcp.json()).result.contents[0].text, actual);
  let assembled = '', offset = 0;
  do {
    const chunk = await s.callTool('get_resource', { slug: id, path: 'SKILL.md', revision_sha256: rest.revision_sha256, offset, limit: 3000 });
    assembled += chunk.content;
    offset = chunk.next_offset;
  } while (offset !== null);
  assert.equal(assembled, actual, 'Chunked hosts must receive the complete reviewed method, not only discovery text.');
});
