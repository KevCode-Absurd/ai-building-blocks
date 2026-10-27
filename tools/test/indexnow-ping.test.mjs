import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { batches, diffSitemaps, findKey, main, parseIndex, parseUrlset, payload } from '../indexnow-ping.mjs';

const script = fileURLToPath(new URL('../indexnow-ping.mjs', import.meta.url));
const S = 'https://useaiblocks.com';
const index = (names) => `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${names.map((n) => `  <sitemap><loc>${S}/sitemap-${n}.xml</loc><lastmod>2026-10-27</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`;
const urlset = (rows) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.map(([u, d]) => `  <url><loc>${S}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
function build(dir, children) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), index(Object.keys(children)));
  for (const [name, rows] of Object.entries(children)) fs.writeFileSync(path.join(dir, `sitemap-${name}.xml`), urlset(rows));
}
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
  const pub = path.join(root, 'public'); fs.mkdirSync(pub);
  const key = 'a'.repeat(32);
  fs.writeFileSync(path.join(pub, `${key}.txt`), key);
  fs.writeFileSync(path.join(pub, `${'b'.repeat(32)}.txt`), 'not its own name'); // ignored: content must match
  build(path.join(root, 'old'), { skills: [['/skills/same', '2026-10-20'], ['/skills/changed', '2026-10-20'], ['/skills/gone', '2026-10-20']], pages: [['/', '']] });
  build(path.join(root, 'new'), { skills: [['/skills/same', '2026-10-20'], ['/skills/changed', '2026-10-27'], ['/skills/added', '2026-10-27']], pages: [['/', ''], ['/me-md', '']], jobs: [['/jobs', '2026-10-27']] });
  return { root, pub, key };
}

test('parses sitemap indexes and urlsets, including escaped addresses', () => {
  assert.deepEqual(parseIndex(index(['skills', 'jobs'])), [`${S}/sitemap-skills.xml`, `${S}/sitemap-jobs.xml`]);
  assert.deepEqual(parseUrlset(urlset([['/a', '2026-10-01'], ['/b?x=1&amp;y=2', '']])), [[`${S}/a`, '2026-10-01'], [`${S}/b?x=1&y=2`, '']]);
});

test('sends only new URLs and URLs whose lastmod changed', () => {
  const previous = new Map([[`${S}/same`, '2026-10-20'], [`${S}/changed`, '2026-10-20'], [`${S}/gone`, '2026-10-20'], [`${S}/undated`, '']]);
  const next = new Map([[`${S}/same`, '2026-10-20'], [`${S}/changed`, '2026-10-27'], [`${S}/added`, ''], [`${S}/undated`, ''], ['https://elsewhere.example/x', '2026-10-27']]);
  const diff = diffSitemaps(previous, next);
  assert.deepEqual(diff.added, [`${S}/added`]);
  assert.deepEqual(diff.changed, [`${S}/changed`]);
  assert.deepEqual(diff.removed, [`${S}/gone`]);
  assert.deepEqual(diff.send, [`${S}/added`, `${S}/changed`], 'other hosts are never sent; removed pages are not pinged');
  assert.deepEqual(diffSitemaps(next, next).send, [], 'a rebuild with no changes sends nothing');
});

test('batches stay within 10,000 URLs and the payload names the key file at the site root', () => {
  const urls = Array.from({ length: 23_456 }, (_, i) => `${S}/skills/s${i}`);
  assert.deepEqual(batches(urls).map((b) => b.length), [10_000, 10_000, 3_456]);
  assert.deepEqual(batches([]), []);
  assert.deepEqual(payload('k'.repeat(32), ['x']), { host: 'useaiblocks.com', key: 'k'.repeat(32), keyLocation: `${S}/${'k'.repeat(32)}.txt`, urlList: ['x'] });
});

test('the committed key file is a 32-character hex key that holds its own name', () => {
  const key = findKey();
  assert.match(key, /^[a-f0-9]{32}$/);
  const { root, pub } = fixture();
  assert.equal(findKey(pub), 'a'.repeat(32));
  fs.rmSync(root, { recursive: true, force: true });
});

test('--dry-run reports what would be sent and changes nothing', async () => {
  const { root, pub, key } = fixture();
  const state = path.join(root, 'state.json');
  const out = execFileSync(process.execPath, [script, '--dry-run', '--new', path.join(root, 'new'), '--old', path.join(root, 'old'), '--public', pub, '--state', state], { encoding: 'utf8' });
  assert.match(out, /6 URLs in the new sitemaps: 3 new, 1 changed, 1 gone \(not sent\)\./);
  assert.match(out, new RegExp(`would send 4 URLs in 1 request\\(s\\) to https://api.indexnow.org/indexnow with key ${key}`));
  assert.match(out, /https:\/\/useaiblocks\.com\/skills\/added/);
  assert.doesNotMatch(out, /skills\/same/);
  assert.equal(fs.existsSync(state), false, 'a dry run writes no state');
  fs.rmSync(root, { recursive: true, force: true });
});

test('a real run posts each batch, then remembers the build; the next run sends nothing', async () => {
  const { root, pub, key } = fixture();
  const state = path.join(root, 'state.json'), sent = [], log = () => {};
  const post = async (url, init) => { sent.push({ url, body: JSON.parse(init.body) }); return new Response('', { status: 202 }); };
  await assert.rejects(main(['--new', path.join(root, 'new'), '--public', pub, '--state', state], { log, post, env: {} }), /--baseline/);
  await main(['--baseline', '--new', path.join(root, 'old'), '--public', pub, '--state', state], { log, post, env: {} });
  assert.equal(sent.length, 0, 'a baseline pings nothing');
  const diff = await main(['--new', path.join(root, 'new'), '--public', pub, '--state', state], { log, post, env: {} });
  assert.deepEqual(diff.send.sort(), [`${S}/jobs`, `${S}/me-md`, `${S}/skills/added`, `${S}/skills/changed`]);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, 'https://api.indexnow.org/indexnow');
  assert.equal(sent[0].body.key, key); assert.equal(sent[0].body.host, 'useaiblocks.com');
  const again = await main(['--new', path.join(root, 'new'), '--public', pub, '--state', state], { log, post, env: {} });
  assert.deepEqual(again.send, []);
  // A failed ping keeps the old record, so the next run tries the same URLs again.
  build(path.join(root, 'newer'), { skills: [['/skills/added', '2026-10-28']] });
  const before = fs.readFileSync(state, 'utf8');
  await assert.rejects(main(['--new', path.join(root, 'newer'), '--public', pub, '--state', state], { log, env: {}, post: async () => new Response('bad key', { status: 403 }) }), /HTTP 403/);
  assert.equal(fs.readFileSync(state, 'utf8'), before);
  fs.rmSync(root, { recursive: true, force: true });
});

test('it refuses to run as part of a build', async () => {
  for (const event of ['build', 'index']) await assert.rejects(main(['--dry-run'], { env: { npm_lifecycle_event: event }, log: () => {} }), /never as part of a build/);
});
