import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { canonicalHtml, contentFingerprint, selectLastmod, stampHtmlDate, validLastmod } from '../scripts/lib/content-stamps.mjs';
import { fingerprints, stampContent } from '../scripts/stamp-content.mjs';
import { diffSitemaps, main, readFingerprints, SITE } from '../../tools/indexnow-ping.mjs';
const page = (text = 'Use the actual source.', asset = 'old') => `<html><head><link rel="stylesheet" href="/assets/${asset}.css"><script type="module" src="/assets/${asset}.js"></script><script type="application/ld+json">${JSON.stringify({ '@graph': [{ '@type': 'WebPage', dateModified: '2026-10-20' }, { '@type': 'CreativeWork', dateModified: '2026-10-19', author: 'Source author', license: 'MIT' }] })}</script></head><body><h1>A real skill</h1><p>${text}</p></body></html>`;
test('fingerprints ignore rebuilt asset names and date stamps, but retain real content and packages', () => {
  assert.equal(contentFingerprint(page()), contentFingerprint(page(undefined, 'new')));
  assert.equal(contentFingerprint(page()), contentFingerprint(page().replaceAll('2026-10-20', '2026-10-21')));
  assert.notEqual(contentFingerprint(page()), contentFingerprint(page('A changed method.')));
  assert.notEqual(contentFingerprint(page(), 'package-a'), contentFingerprint(page(), 'package-b'));
  assert.match(canonicalHtml(page()), /Source author/);
});
test('lastmod accepts real past calendar dates and timestamps, rejects impossible or future ones', () => {
  const now = Date.parse('2026-10-29T00:00:00Z');
  for (const date of ['2024-02-29', '2026-10-28T18:04:03Z', '2026-10-28T18:04:03.123+05:30']) assert.equal(validLastmod(date, now), true, date);
  for (const date of ['2025-02-29', '2026-04-31', '2026-10-28T24:00:00Z', '2026-10-28T18:60:00Z', '2026-10-28T18:00:60Z', '2026-10-28T18:00:00+24:00', '2026-10-30', 'today']) assert.equal(validLastmod(date, now), false, date);
});
test('unchanged pages retain their published stamp, changed pages use a known source time', () => {
  assert.equal(selectLastmod({ hash: 'a', previousHash: 'a', previousDate: '2026-10-20', sourceTime: '2026-10-28T12:00:00Z' }), '2026-10-20');
  assert.equal(selectLastmod({ hash: 'b', previousHash: 'a', sourceTime: '2026-10-28T12:00:00Z' }), '2026-10-28T12:00:00.000Z');
  assert.equal(selectLastmod({ hash: 'b', previousHash: 'a' }), '', 'no build-time fallback');
});
test('stamping the publication date preserves the source work author, licence and dates', () => {
  const stamped = stampHtmlDate(page(), '2026-10-28T12:00:00Z');
  const graph = JSON.parse(stamped.match(/application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph[0].dateModified, '2026-10-28T12:00:00Z');
  assert.deepEqual(graph[1], { '@type': 'CreativeWork', dateModified: '2026-10-19', author: 'Source author', license: 'MIT' });
  assert.equal(stampHtmlDate(stamped, '2026-10-28T12:00:00Z'), stamped);
});
test('same-day and same-second changes are detected from content hashes, without mass migration pings', () => {
  const urls = new Map([[`${SITE}/skills/a`, '2026-10-28']]);
  assert.deepEqual(diffSitemaps(urls, urls, { previousHashes: { [`${SITE}/skills/a`]: 'a' }, nextHashes: { [`${SITE}/skills/a`]: 'b' } }).changed, [`${SITE}/skills/a`]);
  assert.deepEqual(diffSitemaps(urls, urls, { nextHashes: { [`${SITE}/skills/a`]: 'a' } }).send, []);
});
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-stamps-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'data')); fs.mkdirSync(path.join(dir, 'skills'));
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), `<sitemapindex><sitemap><loc>${SITE}/sitemap-skills.xml</loc></sitemap></sitemapindex>`);
  fs.writeFileSync(path.join(dir, 'sitemap-skills.xml'), `<urlset><url><loc>${SITE}/skills/a</loc><lastmod>2026-10-20</lastmod></url></urlset>`);
  fs.writeFileSync(path.join(dir, 'skills/a.html'), page());
  fs.writeFileSync(path.join(dir, 'data/public-api-manifest.json'), JSON.stringify({ resources: { a: { revision_sha256: 'package-a' } } }));
  return dir;
}
test('package-only edits change the page fingerprint; missing child sitemap fails closed', t => {
  const dir = fixture(t), first = fingerprints(dir).hashes;
  fs.writeFileSync(path.join(dir, 'data/public-api-manifest.json'), JSON.stringify({ resources: { a: { revision_sha256: 'package-b' } } }));
  assert.notEqual(fingerprints(dir).hashes[`${SITE}/skills/a`], first[`${SITE}/skills/a`]);
  fs.unlinkSync(path.join(dir, 'sitemap-skills.xml'));
  assert.throws(() => fingerprints(dir), /ENOENT/);
});
test('stamping unchanged content is idempotent and keeps child and index dates in sync', t => {
  const dir = fixture(t), state = path.join(dir, 'state.json');
  fs.writeFileSync(state, JSON.stringify({ urls: { [`${SITE}/skills/a`]: '2026-10-20' }, fingerprints: fingerprints(dir).hashes }));
  stampContent({ dist: dir, state });
  const before = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8');
  stampContent({ dist: dir, state });
  assert.equal(fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8'), before);
  assert.match(before, /<lastmod>2026-10-20<\/lastmod>/);
  assert.match(fs.readFileSync(path.join(dir, 'skills/a.html'), 'utf8'), /2026-10-20/);
});
test('fingerprint manifests must match all sitemap entries', async t => {
  const dir = fixture(t), urls = fingerprints(dir).urls;
  fs.writeFileSync(path.join(dir, 'data/content-fingerprints.json'), JSON.stringify({ schema: 'abb-content-fingerprints/1', source_commit: 'a'.repeat(40), dirty: false, urls: {} }));
  await assert.rejects(readFingerprints(dir, urls), /Invalid content fingerprint/);
});
test('publication refuses missing or dirty fingerprints and leaves saved state intact', async t => {
  const dir = fixture(t), state = path.join(dir, 'state.json');
  const initial = JSON.stringify({ urls: Object.fromEntries(fingerprints(dir).urls), fingerprints: fingerprints(dir).hashes });
  fs.writeFileSync(state, initial);
  await assert.rejects(main(['--new', dir, '--state', state], { env: {}, log() {} }), /no fingerprints/);
  fs.writeFileSync(path.join(dir, 'data/content-fingerprints.json'), JSON.stringify({ schema: 'abb-content-fingerprints/1', source_commit: null, dirty: true, urls: Object.fromEntries([...fingerprints(dir).urls].map(([url, lastmod]) => [url, { sha256: 'a'.repeat(64), lastmod }])) }));
  await assert.rejects(main(['--new', dir, '--state', state], { env: {}, log() {} }), /uncommitted source/);
  assert.equal(fs.readFileSync(state, 'utf8'), initial);
});
test('failed submission retains previous hashes; successful submission records the new ones', async t => {
  const dir = fixture(t), state = path.join(dir, 'state.json'), url = `${SITE}/skills/a`;
  const initial = JSON.stringify({ urls: Object.fromEntries(fingerprints(dir).urls), fingerprints: { [url]: 'b'.repeat(64) } });
  fs.writeFileSync(state, initial);
  const stamps = { schema: 'abb-content-fingerprints/1', source_commit: 'c'.repeat(40), dirty: false, urls: { [url]: { sha256: 'a'.repeat(64), lastmod: '2026-10-20' } } };
  fs.writeFileSync(path.join(dir, 'data/content-fingerprints.json'), JSON.stringify(stamps));
  const args = ['--new', dir, '--state', state];
  await assert.rejects(main(args, { env: {}, log() {}, post: async () => new Response('unavailable', { status: 503 }) }), /HTTP 503/);
  assert.equal(fs.readFileSync(state, 'utf8'), initial);
  const result = await main(args, { env: {}, log() {}, post: async () => new Response('', { status: 200 }) });
  assert.deepEqual(result.changed, [url]);
  assert.equal(JSON.parse(fs.readFileSync(state, 'utf8')).fingerprints[url], 'a'.repeat(64));
  assert.deepEqual((await main(args, { env: {}, log() {}, post: async () => { throw Error('Unchanged content should not submit'); } })).send, []);
});
