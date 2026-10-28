import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { connectLines, feedItems, jobHubDates, jsonFeed, newest, pageFacts, rssFeed, sitemapIndex, twinPaths, urlset } from '../scripts/lib/crawl-files.mjs';
import { gitDates } from '../scripts/lib/git-dates.mjs';

const blocks = [
  { slug: 'old-skill', name: 'Old skill', summary: 'Older.', headline: 'Old', type: 'skill', category: 'general', task: 'write-ad-copy', added: '2026-10-20', published: '2026-10-01' },
  { slug: 'new-flow', name: 'New & shiny flow', summary: 'Brand <new>.', headline: 'New', type: 'workflow', category: 'orchestrator', task: 'write-ad-copy', added: '2026-10-27', published: '2026-10-27' },
  { slug: 'changed-mind', name: 'A mind', summary: 'Changed.', headline: 'Mind', type: 'mind', category: 'mind', task: 'think-with-minds', added: '2026-10-25', published: '2026-10-02' },
  { slug: 'no-page', name: 'Hidden', summary: '', headline: '', type: 'skill', task: 'write-ad-copy', added: '2026-10-28' },
];
const taskName = (t) => ({ 'write-ad-copy': 'Write ad copy' })[t];

test('the sitemap index gives each child the newest lastmod of its pages, and leaves out dates it cannot vouch for', () => {
  assert.equal(newest(['2026-10-20', '', 'not-a-date', '2026-10-27', '2026-10-21']), '2026-10-27');
  assert.equal(newest([]), '');
  const index = sitemapIndex([{ name: 'skills', lastmod: '2026-10-27' }, { name: 'pages', lastmod: '' }]);
  assert.match(index, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(index, /<sitemap><loc>https:\/\/useaiblocks\.com\/sitemap-skills\.xml<\/loc><lastmod>2026-10-27<\/lastmod><\/sitemap>/);
  assert.match(index, /<sitemap><loc>https:\/\/useaiblocks\.com\/sitemap-pages\.xml<\/loc><\/sitemap>/);
  const set = urlset(['/skills/a', '/about?x=1&y=2'], { '/skills/a': '2026-10-19', '/about?x=1&y=2': 'yesterday' });
  assert.match(set, /<url><loc>https:\/\/useaiblocks\.com\/skills\/a<\/loc><lastmod>2026-10-19<\/lastmod><\/url>/);
  assert.match(set, /<url><loc>https:\/\/useaiblocks\.com\/about\?x=1&amp;y=2<\/loc><\/url>/, 'escaped, and no made-up date');
  const hubs = jobHubDates(blocks);
  assert.deepEqual(hubs, { all: '2026-10-27', byTask: { 'write-ad-copy': '2026-10-27' } }, 'minds and pages without a page are left out');
});

test('page facts give the twins names, kinds, ports and steps without blocks.json', () => {
  const bySlug = { 'old-skill': blocks[0] };
  const facts = pageFacts({ ...blocks[1], level: 'advanced', inputs: [{ type: 'brief', required: true }, { type: 'brand_brain', required: false }], outputs: [{ type: 'ad_copy', required: true }], steps: [{ uses: 'old-skill' }, { uses: 'gone' }], files: ['a.md'] },
    { bySlug, describe: (t) => ({ label: t.replace(/_/g, ' '), what: `the ${t}` }), taskName });
  assert.equal(facts.kind, 'workflow'); assert.equal(facts.path, '/workflows/new-flow');
  assert.deepEqual(facts.job, { id: 'write-ad-copy', name: 'Write ad copy' });
  assert.deepEqual(facts.inputs[1], { type: 'brand_brain', required: false, label: 'brand brain', what: 'the brand_brain' });
  assert.deepEqual(facts.steps, [{ slug: 'old-skill', name: 'Old skill', path: '/skills/old-skill', summary: 'Older.' }]);
  assert.equal(facts.hasFiles, true);
  assert.deepEqual(twinPaths(blocks[2]), { markdown: '/minds/changed-mind.md', json: '/minds/changed-mind.json' });
});

test('the JSON Feed is valid 1.1 with the newest items by real dates', () => {
  const items = feedItems(blocks);
  assert.deepEqual(items.map((b) => b.slug), ['new-flow', 'changed-mind', 'old-skill'], 'newest change first; items without a page left out');
  assert.equal(feedItems(blocks, 1).length, 1);
  const feed = jsonFeed(items, { taskName });
  assert.equal(feed.version, 'https://jsonfeed.org/version/1.1');
  for (const key of ['title', 'home_page_url', 'feed_url']) assert.equal(typeof feed[key], 'string');
  assert.equal(feed.feed_url, 'https://useaiblocks.com/feed.json');
  const ids = new Set();
  for (const item of feed.items) {
    assert.equal(typeof item.id, 'string'); assert(!ids.has(item.id)); ids.add(item.id);
    assert(item.content_text || item.content_html, 'every item has content');
    for (const d of [item.date_published, item.date_modified].filter(Boolean)) assert.match(d, /^\d{4}-\d{2}-\d{2}T00:00:00Z$/);
    assert(Object.keys(item).every((k) => !k.startsWith('_') || k === '_aiblocks'), 'extensions start with an underscore');
  }
  assert.deepEqual(feed.items[0].tags, ['new', 'workflow', 'Write ad copy']);
  assert.deepEqual(feed.items[1].tags, ['updated', 'mind']);
  assert.equal(feed.items[0].url, 'https://useaiblocks.com/workflows/new-flow');
  assert.equal(feed.items[0]._aiblocks.markdown, 'https://useaiblocks.com/workflows/new-flow.md');
  assert.deepEqual(jsonFeed(items, { taskName }), feed, 'the same input makes the same feed: no build time inside');
});

test('the RSS feed is well formed RSS 2.0 with escaped text and RFC 822 dates', () => {
  const xml = rssFeed(feedItems(blocks), { taskName });
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<rss version="2\.0" xmlns:atom="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(xml, /<atom:link href="https:\/\/useaiblocks\.com\/feed\.xml" rel="self" type="application\/rss\+xml" \/>/);
  assert.match(xml, /<lastBuildDate>Tue, 27 Oct 2026 00:00:00 \+0000<\/lastBuildDate>/);
  assert.match(xml, /<title>New &amp; shiny flow<\/title>/);
  assert.match(xml, /<description>Brand &lt;new&gt;\.<\/description>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/useaiblocks\.com\/workflows\/new-flow<\/guid>/);
  assert.equal((xml.match(/<item>/g) ?? []).length, 3);
  // Well formed: every element opened is closed in order, and no raw ampersand is left.
  const stack = [];
  for (const [, close, name, selfClose] of xml.replace(/<\?xml[^>]*\?>/, '').matchAll(/<(\/?)([a-zA-Z:]+)[^>]*?(\/?)>/g)) {
    if (selfClose) continue;
    if (close) assert.equal(stack.pop(), name); else stack.push(name);
  }
  assert.deepEqual(stack, []);
  assert.doesNotMatch(xml, /&(?!amp;|lt;|gt;|quot;|apos;)/);
});

test('llms.txt opens with how to connect', () => {
  const lines = connectLines(blocks[0]).join('\n');
  assert.match(lines, /^## Connect your AI\n/);
  for (const url of ['https://useaiblocks.com/mcp', '/mcp/server-card', '/.well-known/ai-catalog.json', '/api/v1/openapi.json', '/skills/old-skill.md', '/skills/old-skill.json', '/feed.json', '/feed.xml']) assert(lines.includes(url), url);
  assert.match(lines, /"Use AI Blocks to get old-skill\."/);
});

test('lastmod comes from git: a rebuild, a touch or a fresh clone never moves it; uncommitted edits use the file time', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-dates-'));
  const git = (...args) => execFileSync('git', ['-c', 'core.longpaths=true', '-C', dir, ...args], { stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_DATE: '2026-10-01T10:00:00Z', GIT_COMMITTER_DATE: process.env.TEST_DATE ?? '2026-10-01T10:00:00Z' } });
  git('init', '-q'); git('config', 'user.email', 't@example.test'); git('config', 'user.name', 'Test'); git('config', 'commit.gpgsign', 'false');
  fs.mkdirSync(path.join(dir, 'a'));
  for (const f of ['item.yaml', 'SKILL.md']) fs.writeFileSync(path.join(dir, 'a', f), f);
  git('add', '.'); git('commit', '-qm', 'one');
  fs.writeFileSync(path.join(dir, 'a', 'SKILL.md'), 'changed');
  execFileSync('git', ['-c', 'core.longpaths=true', '-C', dir, 'commit', '-qam', 'two'], { stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_DATE: '2026-10-05T10:00:00Z', GIT_COMMITTER_DATE: '2026-10-05T10:00:00Z' } });
  const files = ['item.yaml', 'SKILL.md', 'page.yaml'].map((f) => path.join(dir, 'a', f));
  const first = gitDates(dir);
  assert.equal(first.usable, true);
  const observed = first.modified(files);
  assert.equal(observed, '2026-10-05', 'the newest committed change; a missing page.yaml is skipped' + (observed === '2026-10-05' ? '' : dateFixtureDiagnostics(dir, files, first)));
  assert.equal(first.published(files), '2026-10-01');
  // Touching files (a checkout, a copy, a formatter that changes nothing) does not move the date.
  const later = new Date('2030-01-01T00:00:00Z');
  for (const f of files.slice(0, 2)) fs.utimesSync(f, later, later);
  assert.equal(gitDates(dir).modified(files), '2026-10-05');
  // A fresh clone has new file times and the same dates.
  const clone = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-clone-'));
  execFileSync('git', ['-c', 'core.longpaths=true', 'clone', '-q', dir, clone], { stdio: 'pipe' });
  assert.equal(gitDates(clone).modified(['item.yaml', 'SKILL.md'].map((f) => path.join(clone, 'a', f))), '2026-10-05');
  // An uncommitted edit is a real change: it uses the file's own time until it is committed.
  fs.writeFileSync(path.join(dir, 'a', 'item.yaml'), 'edited');
  const edited = new Date('2026-10-09T12:00:00Z');
  fs.utimesSync(path.join(dir, 'a', 'item.yaml'), edited, edited);
  assert.equal(gitDates(dir).modified(files), '2026-10-09');
  // Outside git: file times, as before.
  const plain = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-plain-'));
  fs.writeFileSync(path.join(plain, 'SKILL.md'), 'x'); fs.utimesSync(path.join(plain, 'SKILL.md'), edited, edited);
  const none = gitDates(plain);
  assert.equal(none.usable, false);
  assert.equal(none.modified([path.join(plain, 'SKILL.md')]), '2026-10-09');
  for (const d of [dir, clone, plain]) fs.rmSync(d, { recursive: true, force: true });
});

test('Git dates resolve filesystem aliases before looking up committed file times', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-date-path-')), real = path.join(root, 'real'), alias = path.join(root, 'alias');
  fs.mkdirSync(real); const hooks = path.join(root, 'empty-hooks'); fs.mkdirSync(hooks);
  t.after(() => {
    if (!path.resolve(root).startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(root).startsWith('abb-date-path-')) throw Error('Unexpected fixture path');
    if (fs.existsSync(alias)) { if (!fs.realpathSync(alias).startsWith(fs.realpathSync(root) + path.sep)) throw Error('Fixture alias escaped its root'); fs.unlinkSync(alias); }
    fs.rmSync(root, { recursive: true, force: true });
  });
  const git = (...args) => execFileSync('git', ['-c', 'core.longpaths=true', '-c', 'core.autocrlf=false', '-c', `core.hooksPath=${hooks}`, '-c', 'commit.gpgsign=false', '-c', 'user.name=QA Fixture', '-c', 'user.email=qa@example.invalid', '-C', real, ...args], { stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_DATE: '2026-10-05T10:00:00Z', GIT_COMMITTER_DATE: '2026-10-05T10:00:00Z' } });
  git('init', '--initial-branch=codex/date-path-fixture');
  fs.writeFileSync(path.join(real, 'SKILL.md'), '# Synthetic date fixture\n');
  git('add', '--', 'SKILL.md'); git('commit', '-m', 'Synthetic date fixture\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>');
  const future = new Date('2030-01-01T00:00:00Z'); fs.utimesSync(path.join(real, 'SKILL.md'), future, future);
  fs.symlinkSync(real, alias, 'junction');
  const dates = gitDates(alias);
  assert.equal(dates.usable, true);
  const observed = dates.modified([path.join(alias, 'SKILL.md')]);
  assert.equal(observed, '2026-10-05', observed === '2026-10-05' ? '' : dateFixtureDiagnostics(alias, [path.join(alias, 'SKILL.md')], dates));
  assert.equal(dates.published([path.join(alias, 'SKILL.md')]), '2026-10-05');
});

// Bounded diagnostics of this synthetic repository only, evaluated only if an unchanged date assertion fails.
// No environment values, source contents, author details or credential configuration are printed.
function dateFixtureDiagnostics(dir, files, dates) {
  const run = args => { try { return execFileSync('git', ['-c', 'core.longpaths=true', '-C', dir, '-c', 'core.quotePath=false', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return 'diagnostic unavailable'; } };
  return '\nSynthetic date fixture: ' + JSON.stringify({
    platform: process.platform, node: process.version, dir, realRoot: fs.realpathSync(dir),
    lookup: { usable: dates.usable, shallow: dates.shallow, dirty: dates.dirty },
    files: files.map(file => ({ file, realPath: fs.existsSync(file) ? fs.realpathSync(file) : null })),
    version: run(['--version']), top: run(['rev-parse', '--show-toplevel']),
    log: run(['log', '-2', '--format=@%cI', '--name-only', '--no-renames', '--', '.']),
    status: run(['status', '--porcelain', '-z', '--untracked-files=all', '--', '.']),
  });
}

test('Git dates resolve Windows 8.3 path aliases before matching history', { skip: process.platform !== 'win32' }, t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'abb-date-short-alias-'));
  t.after(() => { const target = path.resolve(root); assert.equal(path.dirname(target), path.resolve(os.tmpdir())); assert.match(path.basename(target), /^abb-date-short-alias-/); fs.rmSync(target, { recursive: true, force: true }); });
  // A constant read-only command obtains this owned fixture's 8.3 path without interpolating any path into shell text.
  const short = execFileSync('cmd.exe', ['/d', '/c', 'for %I in (.) do @echo %~sI'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  if (!/~\d/.test(short)) { t.skip('This filesystem does not provide an 8.3 alias.'); return; }
  assert.equal(fs.realpathSync.native(short), fs.realpathSync.native(root));
  const git = (...args) => execFileSync('git', ['-c', 'core.longpaths=true', '-c', 'core.autocrlf=false', '-c', 'commit.gpgsign=false', '-c', 'user.name=QA Fixture', '-c', 'user.email=qa@example.invalid', '-C', root, ...args], { stdio: 'pipe', env: { ...process.env, GIT_AUTHOR_DATE: '2026-10-05T10:00:00Z', GIT_COMMITTER_DATE: '2026-10-05T10:00:00Z' } });
  git('init', '--initial-branch=codex/date-short-fixture');
  fs.writeFileSync(path.join(root, 'SKILL.md'), '# Synthetic 8.3 date fixture\n'); git('add', '--', 'SKILL.md');
  git('commit', '-m', 'Synthetic 8.3 date fixture\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>');
  const future = new Date('2030-01-01T00:00:00Z'); fs.utimesSync(path.join(root, 'SKILL.md'), future, future);
  const file = path.join(short, 'SKILL.md');
  assert.equal(gitDates(short).modified([file]), '2026-10-05');
  assert.equal(gitDates(root).modified([file]), '2026-10-05');
  assert.equal(gitDates(short).published([path.join(root, 'SKILL.md')]), '2026-10-05');
});
