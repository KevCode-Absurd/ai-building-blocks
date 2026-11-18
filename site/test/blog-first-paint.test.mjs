import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { patchBlogFirstPaint } from '../../tools/lib/blog-first-paint.mjs';
import { pageShell } from '../scripts/lib/page-shell.mjs';
import { contentFingerprint } from '../scripts/lib/content-stamps.mjs';

const options = {
  critical: ':root{--bg:#fafafa}.header{display:flex}.wrap{max-width:1200px}',
  cssHref: '/assets/main-Test123.css',
  blogCssHref: '/assets/BlogPage-Test123.css',
  blogCss: '.blog-page h1,.blog-page .page-shell-h1{font:650 34px/1.06 var(--display)}.blog-page .lede{font:400 17px/1.65 var(--sans)}@media(max-width:640px){.post-hero,.blog-hero{padding-top:44px}}',
  supportCss: fs.readFileSync('public/support-chat.css', 'utf8'),
};
function builtPage(kind = 'blog', route = '/blog') {
  const content = `<div class="${kind === 'post' ? 'blog-post' : 'blog-index'}"><header class="${kind}-hero"><p class="eyebrow">Guides</p><h1 id="title">A useful ecommerce guide</h1><p class="lede">Read the complete opening before the application finishes.</p></header><section id="body"><h2>Complete article</h2><p>Unique original content remains available.</p></section></div>`;
  const cover = pageShell({ logo: '<svg></svg>', h1: 'Fallback heading', content, mainClass: 'blog-page' });
  return fs.readFileSync('index.html', 'utf8')
    .replace('<script type="module" src="/src/main.tsx"></script>', '<script type="module" crossorigin src="/assets/main-Test123.js"></script>')
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://useaiblocks.com${route}">`)
    .replace('  </head>', `<link rel="stylesheet" crossorigin href="${options.cssHref}"><link rel="stylesheet" href="${options.blogCssHref}" />\n  </head>`)
    .replace(/(<div id="app-loader"[^>]*>)/, `$1${cover}`)
    .replace('<div id="root"></div>', `<div id="root"><main class="wrap blog-page" data-prerendered>${content}</main></div>`);
}

test('blog and article covers retain the real opening, dimensions and original complete content', () => {
  for (const [kind, route] of [['blog', '/blog'], ['post', '/blog/example'], ['blog', '/guides']]) {
    const before = builtPage(kind, route), after = patchBlogFirstPaint(before, options);
    const cover = after.match(/<!-- PAGE_SHELL_START -->([\s\S]*?)<!-- PAGE_SHELL_END -->/)[1];
    assert.match(cover, /<p class="page-shell-h1">A useful ecommerce guide<\/p>/);
    assert.match(cover, /<p class="lede">Read the complete opening/);
    assert.ok(cover.includes(`class="${kind}-hero"`));
    assert.doesNotMatch(cover, /<h1|id="title"|Unique original/);
    assert.equal((after.match(/<h1\b/g) ?? []).length, 1);
    assert.match(after, /<section id="body"><h2>Complete article<\/h2><p>Unique original content remains available\.<\/p>/);
    assert.equal(contentFingerprint(after), contentFingerprint(before));
  }
});

test('compiled blog rules are complete and inline while full CSS gates hydration and survives without scripts', () => {
  const before = builtPage(), after = patchBlogFirstPaint(before, options);
  assert.ok(after.includes(`<style data-blog-page-css>${options.blogCss}</style>`));
  assert.doesNotMatch(after, /<link rel="stylesheet" href="\/assets\/BlogPage-/);
  assert.ok(after.includes(`<link rel="stylesheet" crossorigin href="${options.cssHref}" media="print" data-item-full-css>`));
  assert.ok(after.includes(`<noscript data-item-full-css><link rel="stylesheet" crossorigin href="${options.cssHref}"></noscript>`));
  assert.match(after, /if \(!itemAppReady \|\| !itemCssReady \|\| itemRevealed\) return;/);
  assert.match(after, /event\.target\.rel === "stylesheet" && event\.target\.hasAttribute\("data-item-full-css"\)/);
  for (const font of ['space-grotesk.woff2', 'jetbrains-mono.woff2']) assert.equal(after.split(font).length, before.split(font).length);
  assert.equal(patchBlogFirstPaint(after, options), after);
});

test('other routes and missing or unsafe compiled styles fail closed', () => {
  assert.throws(() => patchBlogFirstPaint(builtPage('blog', '/account'), options), /Only blog/);
  assert.throws(() => patchBlogFirstPaint(builtPage(), { ...options, blogCss: '.blog-page{}' }), /compiled blog/);
  assert.throws(() => patchBlogFirstPaint(builtPage(), { ...options, blogCss: options.blogCss + '</style>' }), /compiled blog/);
  const css = fs.readFileSync('src/blog.css', 'utf8');
  assert.match(css, /\.blog-page h1, \.blog-page \.page-shell-h1 \{ font: 650 clamp/);
  const build = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts.build;
  assert.ok(build.indexOf('build-item-first-paint.mjs') < build.indexOf('build-blog-first-paint.mjs'));
  assert.ok(build.indexOf('build-blog-first-paint.mjs') < build.indexOf('stamp-content.mjs'));
});
