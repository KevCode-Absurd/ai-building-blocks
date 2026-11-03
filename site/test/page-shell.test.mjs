import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {pageShell,withoutPageShell,PAGE_SHELL_START,PAGE_SHELL_END} from '../scripts/lib/page-shell.mjs';
import {contentFingerprint} from '../scripts/lib/content-stamps.mjs';

test('the cover shows the header and the page heading, without an h1, ids or labels', () => {
 const out=pageShell({logo:'<svg></svg>',h1:'Free everyday tools',body:'<main><h1 class="bp-h1">Free everyday tools</h1><p class="bp-sub">Calculate and convert in your browser.</p><p class="bp-sub">Second</p></main>'});
 assert.ok(out.startsWith(PAGE_SHELL_START)&&out.endsWith(PAGE_SHELL_END));
 assert.match(out,/<div class="page-shell" inert><header class="header site-header">/);
 assert.match(out,/<p class="bp-h1 page-shell-h1">Free everyday tools<\/p><p class="bp-sub">Calculate and convert in your browser.<\/p><\/div>/);
 assert.doesNotMatch(out,/<h1|Second/);
});

test('a guide page reuses its own hero section, with the heading turned into a styled p', () => {
 const content=fs.readFileSync(new URL('../src/content/train-agent.html',import.meta.url),'utf8');
 const out=pageShell({logo:'',h1:'x',content,mainClass:'agent-guide'});
 assert.match(out,/<div class="wrap agent-guide"><section class="hero">/);
 assert.match(out,/<p class="page-shell-h1">How to train your own AI agent, step by step<\/p>/);
 assert.doesNotMatch(out,/<h1|\sid="|aria-labelledby/);
 assert.doesNotMatch(out,/On this page/,'only the hero, not the rest of the guide');
});

test('no heading means no picture, and the picture never changes a page fingerprint', () => {
 assert.equal(pageShell({logo:'',h1:''}),'');
 const page='<html><body><div id="app-loader">LOADER</div><div id="root"><main><h1>T</h1></main></div></body></html>';
 const withShell=page.replace('LOADER',pageShell({logo:'',h1:'T',body:'<p class="bp-sub">S</p>'})+'LOADER');
 assert.notEqual(withShell,page);
 assert.equal(withoutPageShell(withShell),page);
 assert.equal(contentFingerprint(withShell),contentFingerprint(page));
});
