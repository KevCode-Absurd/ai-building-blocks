import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildPack,filesIndex,packZip,normalizeText} from '../src/modules/packs/build.ts';
import {readZip} from '../src/modules/packs/zip.ts';
import {FIXTURE_JOB_TYPES,NOVA} from './fixtures.ts';
const names=['performance-review.mjs','integration-readback.mjs','integration-readback-guide.md','media-delivery.mjs'];
const tools=Object.fromEntries(names.map(name=>[name,readFileSync(new URL(`../packs/shared/tools/${name}`,import.meta.url),'utf8')]));
test('completion tools are actual source bytes in download ZIP and connector index',async()=>{
 const pack=await buildPack({persona:NOVA,role:null,kit:null,jobTypes:FIXTURE_JOB_TYPES,templates:{},tools,options:{kind:'agent',version:'test',updated:'2026-11-17'}});
 const index=filesIndex(pack),zip=await readZip(await packZip(pack));
 for(const name of names){
   const source=normalizeText(tools[name]);
   assert.equal(pack.files.find(f=>f.path===`tools/${name}`)?.content,source);
   const indexed=index.files.find(f=>f.path===`tools/${name}`);assert.ok(indexed,`${name} inventoried`);
   assert.equal(indexed.sha256,createHash('sha256').update(source).digest('hex'));
   assert.equal(indexed.bytes,Buffer.byteLength(source));
   const entry=zip.find(e=>e.path.endsWith(`/tools/${name}`));assert.ok(entry,`${name} in ZIP`);
   assert.equal(new TextDecoder().decode(entry.data),source);
 }
});
