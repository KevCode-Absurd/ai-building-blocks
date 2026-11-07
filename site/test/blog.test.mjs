import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CATEGORIES, GUIDES, GUIDE_SECTIONS, ORDER, blogIndexHtml, blogPostHtml, guidesIndexHtml, readingMinutes, sections } from '../src/lib/blog.mjs';
import { grade } from '../../tools/readability.mjs';

const DIR = new URL('../src/content/blog/', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, DIR), 'utf8');
const slugs = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort();
const posts = slugs.map(s => JSON.parse(read(`${s}.json`)));
const bodies = new Map(slugs.map(s => [s, read(`${s}.html`)]));
const text = (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<\/(p|li|h[1-6]|td|th|div|section|blockquote)>/g, '.\n').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\.\s*\./g, '.').replace(/\s+/g, ' ');
// The reader's prose: paragraphs and list items, without prompts, tables and headings. Counting each prompt or table
// line as a sentence would make any article look easier than it reads.
const prose = (html) => [...html.replace(/<(pre|table|script|style|h[1-6]|figcaption)[\s\S]*?<\/\1>/g, ' ').replace(/<div class="prompt-box">[\s\S]*?<\/div>/g, ' ')
  .matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)].map(m => m[2].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
// docs/WRITING.md: words and patterns we never use.
const BANNED = /\b(delve|foster|leverage|utili[sz]e|facilitate|empower|streamline|robust|cutting-edge|game[ -]changer|unlock|supercharge|harness|elevate|seamless|effortless|transformative|revolutioni[sz]e|paradigm|synergy|holistic|ecosystem|best-in-class|world-class|next-level)\b/i;

test('every article in the reading order has its metadata and body, and nothing else is in the folder', () => {
  assert.deepEqual(slugs, [...ORDER].sort());
  for (const s of slugs) assert.ok(fs.existsSync(new URL(`${s}.html`, DIR)), `${s}.html`);
});

test('article metadata is complete and fits search results', () => {
  const names = new Set(CATEGORIES.map(c => c.name));
  for (const p of posts) {
    const where = p.slug;
    assert.equal(`${p.slug}.json`, `${where}.json`);
    assert.ok(p.title.length >= 30 && p.title.length <= 80, `${where}: title is ${p.title.length} characters`);
    const full = `${p.seoTitle} | AI Blocks`;
    assert.ok(full.length >= 50 && full.length <= 60, `${where}: the page title "${full}" is ${full.length} characters; search results show 50 to 60 best`);
    assert.ok(p.description.length >= 110 && p.description.length <= 160, `${where}: description is ${p.description.length} characters`);
    assert.ok(p.lede.split(/\s+/).length >= 20, `${where}: lede is too short`);
    assert.ok(names.has(p.category), `${where}: unknown category ${p.category}`);
    assert.ok(p.keywords?.length >= 2, `${where}: keywords`);
    assert.ok(p.related?.length >= 2 && p.related.every(r => r !== p.slug && slugs.includes(r)), `${where}: related articles must exist`);
    assert.equal(p.minutes, readingMinutes(bodies.get(p.slug)), `${where}: minutes must match the body (run the blog minutes update)`);
    for (const field of [p.title, p.seoTitle, p.description, p.lede]) assert.ok(!/—/.test(field), `${where}: no em dashes`);
  }
});

test('article bodies follow the house rules: sections, prompts, FAQ, plain words, prose at grade 8 to 9', () => {
  for (const [slug, html] of bodies) {
    assert.ok(!/<h1|<script|<style|style="/i.test(html), `${slug}: no h1, script or inline style`);
    const h2 = (html.match(/<h2/g) ?? []).length, ids = sections(html).map(s => s.id);
    assert.equal(ids.length, h2, `${slug}: every h2 needs an id`);
    assert.equal(new Set(ids).size, ids.length, `${slug}: h2 ids are unique`);
    assert.ok(ids.includes('faq'), `${slug}: a FAQ section`);
    const prompts = [...html.matchAll(/<pre id="([^"]+)"/g)].map(m => m[1]);
    assert.ok(prompts.length >= 2, `${slug}: at least two prompts to copy`);
    for (const id of prompts) assert.match(html, new RegExp(`data-copy="${id}"`), `${slug}: copy button for ${id}`);
    assert.ok(!/—|&mdash;/.test(html), `${slug}: no em dashes`);
    const words = text(html);
    assert.ok(!BANNED.test(words), `${slug}: banned word "${words.match(BANNED)?.[0]}"`);
    assert.ok(words.split(' ').length >= 1500, `${slug}: in depth (${words.split(' ').length} words)`);
    const level = grade(prose(html));
    assert.ok(level >= 8 && level <= 9, `${slug}: prose reads at grade ${level}; keep it between 8 and 9`);
  }
});

test('every internal link in an article goes to a real page', () => {
  const pub = new URL('../public/', import.meta.url);
  const maps = fs.readdirSync(pub).filter(f => /^sitemap-.*\.xml$/.test(f));
  if (!maps.length) return; // the sitemaps are built by `npm run index`
  const routes = new Set(maps.flatMap(f => [...fs.readFileSync(new URL(f, pub), 'utf8').matchAll(/<loc>https:\/\/useaiblocks\.com([^<]*)<\/loc>/g)].map(m => m[1] || '/')));
  for (const r of ['/', '/industries', '/how-we-test', '/get-it-done', '/jobs', '/space', '/account']) routes.add(r);
  for (const s of slugs) routes.add(`/blog/${s}`);
  for (const [slug, html] of bodies) for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    const to = href.split(/[?#]/)[0] || '/';
    assert.ok(routes.has(to) || routes.has(to.replace(/\/$/, '')) || fs.existsSync(new URL(`.${to}`, pub)), `${slug}: ${href} is not a page`);
  }
});

test('the index lists every article and every guide, and each article page links back', () => {
  const withMinutes = posts.map(p => ({ ...p }));
  const index = blogIndexHtml(withMinutes);
  for (const p of posts) assert.ok(index.includes(`href="/blog/${p.slug}"`), p.slug);
  for (const g of GUIDES) assert.ok(index.includes(`href="${g.href}"`), g.href);
  assert.equal((index.match(/<h1/g) ?? []).length, 1);
  for (const p of posts) {
    const page = blogPostHtml(p, bodies.get(p.slug), posts, p.minutes);
    assert.equal((page.match(/<h1/g) ?? []).length, 1, p.slug);
    assert.match(page, /href="\/blog"/);
    // BlogPage reads the first article's text back from the built page between these markers, so it draws without moving.
    assert.ok(page.includes(`<!--post-body-->${bodies.get(p.slug)}<!--/post-body-->`), `${p.slug}: body markers`);
  }
});

test('the guides page lists every "Use AI Blocks well" article and the setup guides, each once', () => {
  const html = guidesIndexHtml(posts);
  const own = posts.filter(p => p.category === 'Use AI Blocks well').map(p => p.slug).sort();
  const listed = GUIDE_SECTIONS.flatMap(s => s.items);
  assert.deepEqual(listed.filter(k => !k.startsWith('/')).sort(), own, 'every guide article is on /guides');
  for (const k of listed) {
    const href = k.startsWith('/') ? k : `/blog/${k}`;
    assert.equal(html.split(`href="${href}"`).length - 1, 1, `${href} appears once`);
    if (k.startsWith('/')) assert.ok(GUIDES.some(g => g.href === k), `${k} is a known guide`);
  }
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.ok(html.includes('href="/blog"'));
});
