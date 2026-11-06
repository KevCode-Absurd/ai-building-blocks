// Item-page postprocess (after prerender): paint the loading cover from inline rules and load the full stylesheet
// without blocking. See tools/lib/item-first-paint.mjs for why. Run from site/ after `vite build` and prerender.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { ITEM_KINDS, itemCriticalCss, patchItemFirstPaint } from '../../tools/lib/item-first-paint.mjs';

const dist = path.resolve(process.env.ITEM_FIRST_PAINT_DIST ?? 'dist');
const sample = await fs.readFile(path.join(dist, 'skills', (await fs.readdir(path.join(dist, 'skills'))).find(f => f.endsWith('.html'))), 'utf8');
const cssHref = sample.match(/<link rel="stylesheet" crossorigin href="(\/assets\/main-[\w-]+\.css)">/)?.[1];
assert(cssHref, 'Item pages load no main stylesheet');
const critical = itemCriticalCss(await fs.readFile(path.join(dist, cssHref), 'utf8'));
const supportCss = await fs.readFile(path.join(dist, 'support-chat.css'), 'utf8');

let patched = 0, skipped = 0, already = 0;
for (const kind of ITEM_KINDS) {
  const dir = path.join(dist, kind);
  for (const name of (await fs.readdir(dir)).filter(f => f.endsWith('.html'))) {
    const file = path.join(dir, name), html = await fs.readFile(file, 'utf8');
    // A page without a cover picture (none today) keeps the plain stylesheet.
    if (!html.includes('<div class="page-shell" inert>')) { skipped++; continue; }
    const next = patchItemFirstPaint(html, { critical, cssHref, supportCss });
    if (next !== html) { await fs.writeFile(file, next); patched++; } else already++;
  }
}
assert(patched + already > 1000 || process.env.ITEM_FIRST_PAINT_DIST, `Only ${patched + already} item pages paint their cover first`);
console.log(`Item first paint: ${patched} pages patched (${already} already were) to paint their cover from ${critical.length} characters of inline CSS; ${skipped} without a cover.`);
