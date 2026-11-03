import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
// Item pages load "Specialists who do this" from public/data/role-links/<first character>.json (build-roles.mjs).
// Every first character a slug can have needs a file, or that page logs a 404.
test('every item slug has a role-links file for its first character', () => {
 const folder=new URL('../public/data/role-links/',import.meta.url);
 const files=new Set(fs.readdirSync(folder));
 for(const c of '0123456789abcdefghijklmnopqrstuvwxyz')assert.ok(files.has(c+'.json'),c+'.json');
 const index=JSON.parse(fs.readFileSync(new URL('../public/data/blocks-index.json',import.meta.url),'utf8'));
 for(const b of index.blocks??index)assert.ok(files.has(b.slug[0]+'.json'),b.slug);
});
