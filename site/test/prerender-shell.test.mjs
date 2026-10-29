import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readPrerenderShell,injectPrerender} from '../scripts/lib/prerender-shell.mjs';
import {canonicalHtml} from '../scripts/lib/content-stamps.mjs';
const shell='<!doctype html><html><head>\n<title>App</title>\n<script type="module" src="/assets/main.js"></script>\n</head><body><div id="root"></div></body></html>';
const feeds='<link rel="alternate" type="application/feed+json" href="/feed.json"><link rel="alternate" type="application/rss+xml" href="/feed.xml">';
const body='<main data-prerendered><h1>Synthetic page</h1><div><main>Nested source example</main></div></main>';
test('a repeated render recovers the exact pristine shell without inheriting homepage feeds',()=>{
 const home=injectPrerender(shell,feeds,body);assert.equal(readPrerenderShell(home),shell);
 const page=injectPrerender(readPrerenderShell(home),'<meta name="robots" content="index">',body);
 assert.doesNotMatch(page,/feed\.json|feed\.xml/);assert.equal(injectPrerender(readPrerenderShell(home),feeds,body),home);
});
test('owned markers do not change page content fingerprints or compiled scripts',()=>{
 const legacy=shell.replace('</head>',feeds+'\n  </head>').replace('<div id="root"></div>','<div id="root">'+body+'</div>');
 const marked=injectPrerender(shell,feeds,body);assert.equal(canonicalHtml(marked),canonicalHtml(legacy));assert.ok(readPrerenderShell(marked).includes('src="/assets/main.js"'));
});
test('legacy rendered and fully postprocessed homepages fail closed instead of becoming templates',()=>{
 assert.throws(()=>readPrerenderShell(shell.replace('<div id="root"></div>','<div id="root">'+body+'</div>')),/fresh Vite/);
 assert.throws(()=>readPrerenderShell(injectPrerender(shell,feeds,body).replace('/assets/main.js','/assets/main.js" data-home-entry="true')),/fresh Vite/);
});
test('missing or repeated ownership markers cannot silently discard source content',()=>{
 const marked=injectPrerender(shell,feeds,body);
 assert.throws(()=>readPrerenderShell(marked.replace('<!-- AI_BLOCKS_PRERENDER_HEAD_END -->','')),/markers/);
 assert.throws(()=>readPrerenderShell(marked.replace('</head>','<!-- AI_BLOCKS_PRERENDER_HEAD_START --></head>')),/markers/);
});
test('source marker collisions and malformed compiled roots are rejected',()=>{
 assert.throws(()=>injectPrerender(shell,'',body+'<!-- AI_BLOCKS_PRERENDER_BODY_END -->'),/reserved markers/);
 assert.throws(()=>injectPrerender(shell.replace('<div id="root"></div>',''),'meta',body),/one compiled/);
});
