import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../src/worker.ts';
import { itemRoute, twinMarkdown, twinJson } from '../src/server/twins.ts';

const page = {
  headline: 'Plan the angle first', subhead: 'A short brief on how the ad opens, argues and asks.', explain: 'It reads your **buyer** brief.',
  when: ['You have a buyer brief'], not_for: ['You need finished copy'], you_give: ['A buyer brief'], you_get: ['An angle brief under 200 words'],
  output_sample: { input: ['A brief for a skincare brand'], output: [{ name: 'angle.md', contains: 'The opening, the argument and the ask' }] },
  how_to_use: ['Add the skill.', 'Paste your brief.'], judge: ['Under 200 words'],
  plan: { next: [{ name: 'Ad copy writer', url: 'https://useaiblocks.com/skills/ad-copy-writer', label: 'Write the ad from the brief' }] },
  credits: [{ title: 'Breakthrough Advertising', by: 'Eugene Schwartz', url: 'https://example.org/book', used: 'Awareness levels' }],
  tested: { result: 'pass' }, added: '2026-10-27', published: '2026-10-19',
  facts: { name: 'Ad angle planner', summary: 'Plan your ad angle before you write.', kind: 'skill', path: '/skills/ad-angle-planner', job: { id: 'write-ad-copy', name: 'Write ad copy' }, level: 'intermediate', thinking: 'medium',
    inputs: [{ type: 'brief', required: true, label: 'Brief', what: 'a creative brief' }, { type: 'brand_brain', required: false, label: 'Brand brain', what: 'your brand facts' }],
    outputs: [{ type: 'angle_brief', required: true, label: 'Angle brief', what: 'how the ad opens' }], steps: [], hasFiles: false },
};
const skill = '---\nname: ad-angle-planner\ndescription: x\n---\n# Ad angle planner\n\n## Steps\n\n```md\n# not a heading\n```\n';
const assets = (pages = { 'ad-angle-planner': page }) => ({ calls: [], async fetch(request) {
  const path = new URL(request.url).pathname; this.calls.push(path);
  const m = path.match(/^\/data\/pages\/(.+)\.json$/);
  if (m) return pages[m[1]] ? Response.json(pages[m[1]]) : new Response('Missing', { status: 404 });
  if (path === '/skills/ad-angle-planner/SKILL.md') return new Response(skill, { headers: { 'content-type': 'text/markdown' } });
  if (path === '/skills/ad-angle-planner') return new Response('<!doctype html><title>Ad angle planner</title>', { headers: { 'content-type': 'text/html; charset=utf-8', etag: '"html"' } });
  if (path === '/404') return new Response('Custom 404');
  return new Response('Missing', { status: 404 });
} });
const get = (path, headers = {}, env = { ASSETS: assets() }, method = 'GET') => worker.fetch(new Request('https://useaiblocks.com' + path, { method, headers }), env);

test('twin routes: only .md and .json beside an item page, never the page or its skill files', () => {
  assert.equal(itemRoute('/skills/ad-angle-planner'), null);
  assert.deepEqual(itemRoute('/minds/peter-drucker.md'), { kind: 'minds', slug: 'peter-drucker', twin: 'md' });
  assert.deepEqual(itemRoute('/workflows/x.json'), { kind: 'workflows', slug: 'x', twin: 'json' });
  for (const path of ['/skills/ad-angle-planner/SKILL.md', '/skills/ad-angle-planner/x.md', '/skills/ad-angle-planner.zip', '/tools/margin', '/skills/', '/skills/Bad']) assert.equal(itemRoute(path), null, path);
});

test('the Markdown twin carries the page facts and the full instructions, with canonical and cache headers', async () => {
  const response = await get('/skills/ad-angle-planner.md');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.equal(response.headers.get('link'), '<https://useaiblocks.com/skills/ad-angle-planner>; rel="canonical"');
  assert.match(response.headers.get('cache-control'), /max-age=300/);
  assert.equal(response.headers.get('vary'), null, 'a twin URL has one representation');
  assert.match(response.headers.get('etag'), /^"[0-9a-f]{32}"$/);
  const body = await response.text();
  assert.match(body, /^---\ntitle: "Ad angle planner"\ntype: "skill"\nurl: "https:\/\/useaiblocks.com\/skills\/ad-angle-planner"\nupdated: "2026-10-27"\nfirst_published: "2026-10-19"/);
  assert.match(body, /\n# Ad angle planner\n\n> Plan your ad angle before you write\.\n/);
  assert.match(body, /## What you give it\n\n- A buyer brief/);
  assert.match(body, /- \*\*angle\.md\*\*: The opening, the argument and the ask/);
  assert.match(body, /## What to do next\n\n- \[Ad copy writer\]\(https:\/\/useaiblocks.com\/skills\/ad-copy-writer\): Write the ad from the brief/);
  assert.match(body, /\[Breakthrough Advertising\]\(https:\/\/example.org\/book\), Eugene Schwartz: Awareness levels/);
  assert.match(body, /## Instructions \(SKILL\.md\)\n\n## Ad angle planner\n\n### Steps/, 'SKILL.md headings move one level down');
  assert.match(body, /```md\n# not a heading\n```/, 'code blocks are left alone');
  assert.doesNotMatch(body, /name: ad-angle-planner/, 'the frontmatter is not repeated');
  assert.equal(twinMarkdown(page, 'ad-angle-planner', skill), body);
});

test('the JSON twin is one stable shape with every link an AI needs', async () => {
  const response = await get('/skills/ad-angle-planner.json');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  const data = await response.json();
  assert.deepEqual(data, JSON.parse(JSON.stringify(twinJson(page, 'ad-angle-planner'))));
  assert.equal(data.schema, 'aiblocks-page/1');
  assert.equal(data.type, 'skill'); assert.equal(data.tested, true); assert.equal(data.updated, '2026-10-27'); assert.equal(data.first_published, '2026-10-19');
  assert.equal(data.inputs[1].required, false);
  assert.deepEqual(data.links, { page: 'https://useaiblocks.com/skills/ad-angle-planner', markdown: 'https://useaiblocks.com/skills/ad-angle-planner.md', json: 'https://useaiblocks.com/skills/ad-angle-planner.json', instructions: 'https://useaiblocks.com/skills/ad-angle-planner/SKILL.md', api_item: 'https://useaiblocks.com/api/v1/items/ad-angle-planner', api_document: 'https://useaiblocks.com/api/v1/documents/skill/ad-angle-planner', mcp: 'https://useaiblocks.com/mcp' });
});

test('the HTML page is the static asset whatever the client asks for: no negotiation, nothing extra read', async () => {
  for (const accept of ['text/html,*/*;q=0.8', 'text/markdown']) {
    const env = { ASSETS: assets() };
    const html = await get('/skills/ad-angle-planner', { accept }, env);
    assert.equal(html.status, 200);
    assert.equal(await html.text(), '<!doctype html><title>Ad angle planner</title>');
    assert.equal(html.headers.get('vary'), null);
    assert.deepEqual(env.ASSETS.calls, ['/skills/ad-angle-planner']);
  }
  const head = await get('/skills/ad-angle-planner.md', {}, { ASSETS: assets() }, 'HEAD');
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
  const etag = (await get('/skills/ad-angle-planner.md')).headers.get('etag');
  assert.equal((await get('/skills/ad-angle-planner.md', { 'if-none-match': etag })).status, 304);
});

// Cloudflare's run_worker_first globs: "*" matches any characters, "/" included; a "!" pattern wins over the rest.
const glob = (pattern) => new RegExp('^' + pattern.split('*').map((part) => part.replace(/[^\w/!-]/g, (c) => '\\' + c)).join('.*') + '$');
const workerFirst = (patterns, path) => !patterns.filter((p) => p.startsWith('!')).some((p) => glob(p.slice(1)).test(path)) && patterns.filter((p) => !p.startsWith('!')).some((p) => glob(p).test(path));
for (const file of ['wrangler.example.jsonc', 'wrangler.production.jsonc']) {
  test(`${file}: item pages are served straight from assets; twins reach the Worker after the asset miss`, { skip: !fs.existsSync(file) && 'ignored local config' }, () => {
    const { assets: config } = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(glob('/skills/*.md').test('/skills/a/SKILL.md'), true, 'the matcher is deep, as Cloudflare documents');
    for (const path of ['/skills/ad-angle-planner', '/prompts/a', '/workflows/a', '/agents/a', '/minds/a', '/skills/a/SKILL.md', '/skills/a.zip']) assert.equal(workerFirst(config.run_worker_first, path), false, path);
    for (const path of ['/api/v1/search', '/mcp', '/.well-known/ai-catalog.json']) assert.equal(workerFirst(config.run_worker_first, path), true, path);
    // A twin is neither worker-first nor an asset: with not_found_handling unset, the asset miss goes to the Worker.
    for (const path of ['/skills/ad-angle-planner.md', '/minds/a.json']) assert.equal(workerFirst(config.run_worker_first, path), false, path);
    assert.equal(config.not_found_handling, undefined);
  });
}

test('twins under the wrong kind redirect; unknown items and skill files keep the asset behaviour', async () => {
  const wrong = await get('/prompts/ad-angle-planner.md');
  assert.equal(wrong.status, 301);
  assert.equal(wrong.headers.get('location'), 'https://useaiblocks.com/skills/ad-angle-planner.md');
  const missing = await get('/skills/no-such-skill.md');
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), 'Custom 404');
  // A page built before twins existed (no facts) is served as before.
  const old = await get('/skills/ad-angle-planner.md', {}, { ASSETS: assets({ 'ad-angle-planner': { ...page, facts: undefined } }) });
  assert.equal(old.status, 404);
  const request = new Request('https://useaiblocks.com/skills/ad-angle-planner/SKILL.md', { headers: { accept: 'text/markdown' } });
  const file = new Response('# skill', { headers: { 'content-type': 'text/markdown' } });
  assert.equal(await worker.fetch(request, { ASSETS: { async fetch(received) { assert.equal(received, request); return file; } } }), file);
  assert.equal((await get('/skills/ad-angle-planner.md', {}, undefined, 'POST')).status, 404);
});
