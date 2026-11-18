import assert from 'node:assert/strict';
import { patchItemFirstPaint } from './item-first-paint.mjs';

// Blog text was waiting for the entire shared stylesheet and its separate small
// route stylesheet. Reuse the established cover/readiness flow, keeping the full
// compiled blog rules inline and the unchanged shared stylesheet non-blocking.
export function patchBlogFirstPaint(html, { critical, cssHref, blogCss, blogCssHref, supportCss }) {
  assert(/<link rel="canonical" href="https:\/\/useaiblocks\.com\/(?:blog(?:\/[a-z0-9-]+)?|guides)"/.test(html), 'Only blog and guides pages use this transform');
  assert(html.includes('<div class="wrap blog-page">'), 'Expected the real blog hero in the loading cover');
  assert(blogCss.includes('.blog-page') && blogCss.includes('.page-shell-h1') && blogCss.length < 20000 && !/<\/style/i.test(blogCss), 'Expected the complete, bounded compiled blog stylesheet');
  let next = html;
  if (!next.includes('data-blog-page-css')) {
    const tag = `<link rel="stylesheet" href="${blogCssHref}" />`;
    assert.equal(next.split(tag).length, 2, 'Expected one blog route stylesheet');
    next = next.replace(tag, `<style data-blog-page-css>${blogCss}</style>`);
  }
  return patchItemFirstPaint(next, { critical, cssHref, supportCss });
}
