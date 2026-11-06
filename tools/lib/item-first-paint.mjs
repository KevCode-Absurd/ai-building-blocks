import assert from 'node:assert/strict';
import { homeSupportCriticalCss } from './home-initial-shell.mjs';

// Item pages (skills, prompts, workflows, agents, minds) paint their loading cover before the full stylesheet arrives,
// the way the home page does (tools/lib/home-initial-shell.mjs).
//
// Why: the cover was styled by the one render-blocking stylesheet, so by the time a phone could paint anything every
// script and data file had already started downloading. Lighthouse's phone model then put the page's main paint after
// all of them (mobile LCP 3 to 7 s, against 2.3 s on home). Now the cover's few rules are inline, the full stylesheet
// loads without blocking, and the app replaces the cover only once both the app and the full stylesheet are ready.

export const ITEM_KINDS = ['skills', 'prompts', 'workflows', 'agents', 'minds'];
export const FULL_CSS_ATTR = 'data-item-full-css';

// The cover is the site header and the item's heading and opening line (scripts/lib/page-shell.mjs). Keep exactly the
// compiled rules whose selector starts with what the cover uses; never invent declarations.
const KEEP = /^(?::root|\*|html\b|body\b|\.wrap\b|\.btn\b|\.btn-line\b|\.header\b|\.header-in\b|\.brand\b|\.logo\b|\.site-header\b|\.site-menu\b|\.site-menu-trigger\b|\.bp-hero\b|\.bp-h1\b|\.bp-sub\b|\.page-shell)/;

/** Complete compiled rules whose selector matches `keep`, inside their original @media, @supports or @layer blocks. */
export function selectRules(css, keep = KEEP) {
  function selected(input) {
    let result = '', start = 0;
    while (start < input.length) {
      const open = input.indexOf('{', start); if (open < 0) break;
      const head = input.slice(start, open).trim(); let depth = 1, end = open + 1, quote = '';
      for (; end < input.length && depth; end++) {
        const ch = input[end];
        if (quote) { if (ch === '\\') end++; else if (ch === quote) quote = ''; }
        else if (ch === '"' || ch === "'") quote = ch; else if (ch === '{') depth++; else if (ch === '}') depth--;
      }
      assert.equal(depth, 0, 'Unbalanced compiled CSS');
      const body = input.slice(open + 1, end - 1);
      if (/^@(?:media|supports|layer)\b/.test(head)) { const nested = selected(body); if (nested) result += head + '{' + nested + '}'; }
      else if (!head.startsWith('@') && keep.test(head)) result += head + '{' + body + '}';
      start = end;
    }
    return result;
  }
  return selected(css);
}

export function itemCriticalCss(css) {
  const out = selectRules(css);
  for (const rule of ['.bp-h1{', '.bp-sub{', '.site-menu-trigger{', '.header-in{', ':root{']) assert(out.includes(rule), `Critical cover CSS lost ${rule}`);
  assert(out.length < 16000, `Critical cover CSS grew to ${out.length} characters`);
  return out;
}

const READY_OPEN = 'document.addEventListener("abb:ready", function () {';
const READY_CLOSE = '      }, { once: true });';

/** One built item page: inline the cover's rules, load the full stylesheet without blocking, gate the swap on it, start
 *  the app after the cover can paint, and start the help widget after it. Each step is skipped when already applied. */
export function patchItemFirstPaint(html, { critical, cssHref, supportCss }) {
  let next = html;
  if (!next.includes(FULL_CSS_ATTR)) next = inlineItemCss(next, { critical, cssHref });
  if (!next.includes('data-item-entry')) next = deferItemEntry(next);
  if (!next.includes('fetchpriority="low" data-item-entry')) next = next.replace(' data-item-entry>', ' fetchpriority="low" data-item-entry>');
  if (supportCss && !next.includes('data-item-support-critical')) next = deferItemSupport(next, { supportCss });
  assert(next.includes(`media="print" ${FULL_CSS_ATTR}`) && next.includes('function revealItem()') && next.includes('fetchpriority="low" data-item-entry'));
  return next;
}

function inlineItemCss(html, { critical, cssHref }) {
  assert(html.includes('<div class="page-shell" inert>'), 'Item page without a cover picture');
  const tag = `<link rel="stylesheet" crossorigin href="${cssHref}">`;
  assert.equal(html.split(tag).length, 2, 'Expected the one full stylesheet link');
  let next = html.replace(tag, `<style data-item-critical>${critical}</style>${tag.replace('>', ` media="print" ${FULL_CSS_ATTR}>`)}<noscript ${FULL_CSS_ATTR}>${tag}</noscript>`);
  const start = next.indexOf(READY_OPEN), end = next.indexOf(READY_CLOSE, start);
  assert(start >= 0 && end > start, 'Expected the first-paint ready handler');
  const body = next.slice(start + READY_OPEN.length, end);
  assert(body.includes('document.documentElement.dataset.boot = "ready";'));
  const gated = `let itemAppReady = false, itemCssReady = false, itemRevealed = false;
      function itemCssLoaded() { const link = document.querySelector("link[${FULL_CSS_ATTR}]"); if (!link || itemCssReady) return; link.media = "all"; itemCssReady = true; revealItem(); }
      function revealItem() {
        if (!itemAppReady || !itemCssReady || itemRevealed) return;
        itemRevealed = true;${body}}
      document.addEventListener("abb:ready", function () { itemAppReady = true; revealItem(); }, { once: true });
      // The full stylesheet may finish before or after this script runs; either way the swap waits for it.
      document.addEventListener("load", function (event) { if (event.target instanceof HTMLLinkElement && event.target.hasAttribute("${FULL_CSS_ATTR}")) itemCssLoaded(); }, true);
      document.addEventListener("DOMContentLoaded", function () { if (document.querySelector("link[${FULL_CSS_ATTR}]")?.sheet) itemCssLoaded(); });`;
  next = next.slice(0, start) + gated + next.slice(end + READY_CLOSE.length);
  // Only the page's own stylesheet failing means an unstyled page; the help widget's stylesheet is optional.
  const fatalStyle = 'event.target instanceof HTMLLinkElement && event.target.rel === "stylesheet"';
  assert.equal(next.split(fatalStyle).length, 2, 'Expected one stylesheet failure check');
  return next.replace(fatalStyle, fatalStyle + ` && event.target.hasAttribute("${FULL_CSS_ATTR}")`);
}

/** Fetch the app at once at low priority, but start it two frames after the cover can paint (as deferHomeEnhancement
 *  and prioritizeHomeText do for home). Started from the head at high priority, its download, its work and the files it
 *  asks for all came before the cover's paint in Lighthouse's phone model. */
export function deferItemEntry(html) {
  const scripts = [...html.matchAll(/<script\b(?=[^>]*type="module")(?=[^>]*src="([^"]+)")[^>]*><\/script>/g)];
  assert.equal(scripts.length, 1, 'Expected exactly one external module entry');
  const [tag, entry] = scripts[0];
  assert(/^\/assets\/[\w-]+\.js$/.test(entry) && tag.includes('crossorigin'));
  let next = html.replace(tag, `<link rel="modulepreload" crossorigin href="${entry}" fetchpriority="low" data-item-entry>`);
  const bootstrap = `<script type="module" data-item-enhancement>
      const entry=document.querySelector('link[rel="modulepreload"][data-item-entry]')?.href;
      if(!entry)bootError();
      else requestAnimationFrame(()=>requestAnimationFrame(()=>{import(entry).catch(()=>bootError());}));
    </script>`;
  assert.equal(next.split('</body>').length, 2);
  // No new whitespace outside the script: content fingerprints (and so sitemap dates) must not change.
  return next.replace('</body>', bootstrap + '</body>');
}

/** The help widget's script added a top-priority stylesheet before the cover's first paint. Start it after that paint
 *  instead, with the closed launcher's own rules inline so it never moves (the same frozen rules home uses). */
export function deferItemSupport(html, { supportCss }) {
  const supportTag = '<script defer src="/support-chat.js"></script>';
  assert.equal(html.split(supportTag).length, 2, 'Expected the help widget script once');
  const initializer = 'else requestAnimationFrame(()=>requestAnimationFrame(()=>{import(entry).catch(()=>bootError());}));';
  assert.equal(html.split(initializer).length, 2, 'Expected the item app starter');
  const afterPaint = `else requestAnimationFrame(()=>requestAnimationFrame(()=>{
        let supportStarted=false,paintObserver;
        const startSupport=()=>{if(supportStarted)return;supportStarted=true;paintObserver?.disconnect();try{const support=document.createElement("script");support.src="/support-chat.js";support.async=true;document.head.append(support);}catch{}};
        try{
          if(performance.getEntriesByName("first-contentful-paint").length)startSupport();
          else if(typeof PerformanceObserver==="function"&&PerformanceObserver.supportedEntryTypes?.includes("paint")){
            paintObserver=new PerformanceObserver(list=>{if(list.getEntries().some(item=>item.name==="first-contentful-paint"))startSupport();});
            paintObserver.observe({type:"paint",buffered:true});
          }else requestAnimationFrame(()=>requestAnimationFrame(startSupport));
        }catch{paintObserver?.disconnect();requestAnimationFrame(()=>requestAnimationFrame(startSupport));}
        import(entry).catch(()=>bootError());
      }));`;
  const next = html.replace(supportTag, '').replace(initializer, afterPaint);
  return next.replace('</head>', '<style data-item-support-critical>\n' + homeSupportCriticalCss(supportCss) + '</style></head>');
}
