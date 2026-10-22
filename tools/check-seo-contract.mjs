// Exhaustive crawlable-page contract for a frozen build; no network/provider calls.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../site/package.json', import.meta.url));
const sharp = require('sharp');
const root = path.resolve(process.argv[2]);
const SITE = 'https://useaiblocks.com';
const decode = s => (s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const problems = [], urls = new Set(), titles = new Map();
const sitemapFiles = fs.readdirSync(root).filter(f => /^sitemap.*\.xml$/.test(f));
for (const file of sitemapFiles) for (const m of fs.readFileSync(path.join(root, file), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = new URL(decode(m[1]));
  if (url.origin !== SITE) problems.push('Wrong sitemap host: ' + url.href);
  if (url.pathname.endsWith('.xml')) { if (!fs.existsSync(path.join(root, url.pathname))) problems.push('Missing sitemap: ' + url.pathname); continue; }
  if (urls.has(url.pathname)) problems.push('Duplicate sitemap location: ' + url.pathname);
  urls.add(url.pathname);
}
function readHead(route, noindex = false) {
  const file = path.join(root, route === '/' ? 'index.html' : route.slice(1) + '.html');
  if (!fs.existsSync(file)) { problems.push('Missing page: ' + route); return; }
  const html = fs.readFileSync(file, 'utf8');
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1]);
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
  const canonical = decode(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]);
  const robots = [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map(m => decode(m[1]));
  if (!title || !description || description.length < 35) problems.push('Missing/short metadata: ' + route);
  if (canonical !== SITE + route) problems.push('Canonical mismatch: ' + route);
  if (robots.length !== 1 || noindex !== robots[0].includes('noindex')) problems.push('Robots mismatch: ' + route);
  if (!noindex && titles.has(title)) problems.push('Duplicate title: ' + route + ' and ' + titles.get(title));
  if (!noindex) titles.set(title, route);
  if ((html.match(/<h1\b/g) || []).length !== 1) problems.push('Heading mismatch: ' + route);
  for (const [attr, key, expected] of [['property', 'og:title', title], ['property', 'og:description', description], ['property', 'og:url', canonical], ['name', 'twitter:title', title], ['name', 'twitter:description', description]]) {
    const value = decode(html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1]);
    if (value !== expected) problems.push('Social metadata mismatch: ' + route + ' ' + key);
  }
  const record = path.join(root, 'metadata', route === '/' ? 'index.json' : route.slice(1) + '.json');
  if (!fs.existsSync(record)) problems.push('Missing runtime metadata: ' + route);
  else { const data = JSON.parse(fs.readFileSync(record)); if (data.title !== title || data.description !== description || data.canonical !== canonical || data.robots !== robots[0]) problems.push('Runtime/crawler metadata differs: ' + route); }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) try { const j = JSON.parse(m[1]); if (j['@context'] !== 'https://schema.org') problems.push('Wrong schema context: ' + route); } catch { problems.push('Invalid structured data: ' + route); }
  if (!html.includes('href="/favicon-96.png"') || !html.includes('href="/apple-touch-icon.png"')) problems.push('Missing crawlable icons: ' + route);
}
for (const route of urls) { if (/^\/(space(?:\/|$)|s\/|404$|analytics-privacy)/.test(route)) problems.push('Private/error URL in sitemap: ' + route); readHead(route); }
for (const route of ['/space', '/shared-space-shell', '/404']) readHead(route, true);
for (const [file, size] of [['favicon-96.png', 96], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const m = await sharp(path.join(root, file)).metadata(); if (m.width !== size || m.height !== size) problems.push('Wrong square icon size: ' + file);
}
const ico = fs.readFileSync(path.join(root, 'favicon.ico')); assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 4);
const social = await sharp(path.join(root, 'og/default.png')).metadata();
assert.equal(social.width, 1200); assert.equal(social.height, 630);
assert(fs.existsSync(path.join(root, 'og/logo.png')));
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert(robots.includes('Sitemap: ' + SITE + '/sitemap.xml')); assert(!/Disallow:.*favicon/.test(robots));
const report = { checkedOn: new Date().toISOString(), status: problems.length ? 'fail' : 'pass', assets: root, sitemapFiles: sitemapFiles.length, crawlablePages: urls.size, uniqueTitles: titles.size, privateAndErrorPagesNoindex: 3, iconSizes: [96, 180, 192, 512], icoSizes: [16, 32, 48, 96], socialImage: [1200, 630], problems };
fs.writeFileSync('reports/seo-contract.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, problems: problems.slice(0, 25) }, null, 2));
assert.equal(problems.length, 0, 'Resolve frozen-build SEO contract failures.');
