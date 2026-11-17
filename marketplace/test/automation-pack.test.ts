import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildPack, filesIndex, oneFileText} from '../src/modules/packs/build.ts';
import {FIXTURE_JOB_TYPES,NOVA} from './fixtures.ts';
const shared=(p:string)=>readFileSync(new URL(`../packs/shared/${p}`,import.meta.url),'utf8');
const templates=Object.fromEntries(['AGENTS.md','METHOD.md','AUTOMATION-PRINCIPLES.md','README.md','LICENSE.md'].map(p=>[p,shared(p)]));
const tools={'automation-review.mjs':shared('tools/automation-review.mjs')};
test('download and connector index expose the actual automation tool and complete principles',async()=>{
 const pack=await buildPack({persona:NOVA,role:null,kit:null,jobTypes:FIXTURE_JOB_TYPES,templates,tools,options:{kind:'agent',version:'test',updated:'2026-11-17'}});
 assert.equal(pack.files.find(f=>f.path==='tools/automation-review.mjs')?.content.trim(),tools['automation-review.mjs'].replace(/\r\n/g,'\n').trim());
 const guide=pack.files.find(f=>f.path==='AUTOMATION-PRINCIPLES.md')?.content;
 for(const term of ['Visibility','Judgment','Skills','Relationships','Human ownership'])assert.ok(guide?.includes(term));
 const index=filesIndex(pack);assert.ok(index.files.some(f=>f.path==='AUTOMATION-PRINCIPLES.md'));assert.ok(index.files.some(f=>f.path==='tools/automation-review.mjs'));
 const text=oneFileText(pack,'https://agents.test');assert.match(text,/Preserve what automation can hide/);assert.doesNotMatch(text,/===== FILE: tools\/automation-review\.mjs =====/);
});
test('minimal builder keeps operative principles when full templates are unavailable',async()=>{
 const pack=await buildPack({persona:NOVA,role:null,kit:null,jobTypes:FIXTURE_JOB_TYPES,templates:{},options:{kind:'agent',version:'test',updated:'2026-11-17'}});
 assert.match(pack.files.find(f=>f.path==='AUTOMATION-PRINCIPLES.md')!.content,/Routine authorized work continues/);
});
