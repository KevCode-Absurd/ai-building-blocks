import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { itemCriticalCss } from '../../tools/lib/item-first-paint.mjs';
import { patchBlogFirstPaint } from '../../tools/lib/blog-first-paint.mjs';

const dist = path.resolve(process.env.BLOG_FIRST_PAINT_DIST ?? 'dist');
const sample = await fs.readFile(path.join(dist, 'blog.html'), 'utf8');
const cssHref = sample.match(/<link rel="stylesheet" crossorigin href="(\/assets\/main-[\w-]+\.css)"/)?.[1];
const blogCssHref = sample.match(/<link rel="stylesheet" href="(\/assets\/BlogPage-[\w-]+\.css)" \/>/)?.[1];
// Already transformed builds still identify their unchanged compiled sources.
const assets = await fs.readdir(path.join(dist, 'assets'));
const mainFile = cssHref ?? '/assets/' + assets.find(name => /^main-[\w-]+\.css$/.test(name));
const blogFile = blogCssHref ?? '/assets/' + assets.find(name => /^BlogPage-[\w-]+\.css$/.test(name));
assert(!mainFile.endsWith('undefined') && !blogFile.endsWith('undefined'), 'Expected compiled main and blog stylesheets');
const critical = itemCriticalCss(await fs.readFile(path.join(dist, mainFile.slice(1)), 'utf8'));
const blogCss = await fs.readFile(path.join(dist, blogFile.slice(1)), 'utf8');
const supportCss = await fs.readFile(path.join(dist, 'support-chat.css'), 'utf8');
const files = ['blog.html', 'guides.html', ...(await fs.readdir(path.join(dist, 'blog'))).filter(name => name.endsWith('.html')).map(name => 'blog/' + name)];
let patched = 0;
for (const name of files) {
  const file = path.join(dist, name), html = await fs.readFile(file, 'utf8');
  const next = patchBlogFirstPaint(html, { critical, cssHref: mainFile, blogCss, blogCssHref: blogFile, supportCss });
  if (next !== html) { await fs.writeFile(file, next); patched++; }
}
console.log(`Blog first paint: ${patched} of ${files.length} pages updated; original fonts and complete blog styles retained.`);
