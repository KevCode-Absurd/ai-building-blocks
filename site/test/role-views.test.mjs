import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import{createHash}from'node:crypto';
import{loadFullRole}from'../src/roles/role-profile.ts';
const read=p=>fs.readFileSync(new URL('../public/data/'+p,import.meta.url)),sha=b=>createHash('sha256').update(b).digest('hex');
const view=id=>JSON.parse(read('role-views/'+id+'.json'));
test('every lightweight role view retains its complete public remit and binds the unchanged full profile',()=>{
 const index=JSON.parse(read('roles-index.json'));let fullBytes=0,viewBytes=0;
 for(const row of index.roles){const bytes=read('roles/'+row.id+'.json'),{worker,instructions,core,extended,...fields}=JSON.parse(bytes),v=view(row.id);assert.deepEqual(v,{...fields,schema:'ai-blocks-role-view/1',sourceProfile:{path:'/data/roles/'+row.id+'.json',bytes:bytes.length,sha256:sha(bytes)}},row.id);assert(worker);const size=read('role-views/'+row.id+'.json').length;assert(size<50_000,row.id);fullBytes+=bytes.length;viewBytes+=size;}
 assert(viewBytes<fullBytes*.5,'Display views must remove at least half of the profile bytes, and each stays under 50 KB, without truncating the remit.');
});
test('full task setup is retrieved once per exact revision; failed or changed downloads remain retryable',async()=>{
 const previous=globalThis.fetch;let calls=0,fail=true;const id='design-specialist',v=view(id),bytes=read('roles/'+id+'.json');
 try{
  globalThis.fetch=async()=>{calls++;return fail?new Response('unavailable',{status:503}):new Response(bytes,{headers:{'content-type':'application/json'}});};
  await assert.rejects(()=>loadFullRole(v),/could not load/);fail=false;
  const [first,second]=await Promise.all([loadFullRole(v),loadFullRole(v)]);assert.strictEqual(first,second);assert.deepEqual(first,JSON.parse(bytes));assert.equal(calls,2);
  const different={...v,sourceProfile:{...v.sourceProfile,sha256:'a'.repeat(64)}};
  await assert.rejects(()=>loadFullRole(different),/changed during download/);assert.equal(calls,3);
  globalThis.fetch=async()=>new Response(Buffer.from(bytes.toString().replace(v.sourceHash,'b'.repeat(64))),{headers:{'content-type':'application/json'}});
  await assert.rejects(()=>loadFullRole({...v,sourceHash:'new-revision'}),/changed during download/);
 }finally{globalThis.fetch=previous;}
});
