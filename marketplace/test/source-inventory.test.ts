import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
// @ts-expect-error Portable plain-JavaScript pack tool, exercised at runtime below.
const load=()=>import('../packs/shared/tools/source-inventory.mjs');
test('locates cohort evidence in a supplied file without pretending metadata proves performance',async()=>{
  const {inventorySources}=await load(),dir=mkdtempSync(path.join(tmpdir(),'sources-'));
  writeFileSync(path.join(dir,'customers.json'),JSON.stringify({cohorts:[{new_customers:100,repeat_within_60d:30}]}));
  writeFileSync(path.join(dir,'.env'),'SECRET=not-indexed');
  const r=inventorySources(dir);assert.equal(r.complete,true);assert.equal(r.files.length,1);
  assert.ok(r.files[0].fields.includes('cohorts[].repeat_within_60d'));assert.match(r.files[0].sha256,/^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(r).includes('not-indexed'));
});
test('malformed and oversized evidence is unresolved, never silently missing',async()=>{
  const {inventorySources}=await load(),dir=mkdtempSync(path.join(tmpdir(),'sources-'));
  writeFileSync(path.join(dir,'broken.json'),'{bad');writeFileSync(path.join(dir,'large.txt'),'x'.repeat(100));
  const r=inventorySources(dir,{maxBytes:50});assert.equal(r.complete,false);
  assert.deepEqual(r.files.map((f:any)=>f.status),['unreadable','too_large_to_read']);
});
test('sampled heterogeneous rows cannot imply complete field coverage',async()=>{
  const {inventorySources}=await load(),dir=mkdtempSync(path.join(tmpdir(),'sources-'));
  writeFileSync(path.join(dir,'rows.json'),JSON.stringify([...Array(100).fill({a:1}),{late_only:2}]));
  assert.equal(inventorySources(dir).files[0].coverage,'sampled_fields');
});
