import {test} from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error Portable plain-JavaScript pack tool, exercised at runtime below.
const load=()=>import('../packs/shared/tools/commerce-math.mjs');
test('a two-week plan cannot turn a twelve-hour weekly developer into sixteen hours',async()=>{
  const {capacityPlan}=await load();
  const availability=[1,2].flatMap(w=>[{owner:'developer',period:`week-${w}`,hours:12,source:'capacity.json#/developer'},{owner:'marketer',period:`week-${w}`,hours:16,source:'capacity.json#/marketer'}]);
  const assignments=[1,2].flatMap(w=>[{owner:'developer',period:`week-${w}`,hours:16,task:'delivery'},{owner:'marketer',period:`week-${w}`,hours:16,task:'delivery'}]);
  const invalid=capacityPlan({availability,assignments});assert.equal(invalid.feasible,false);assert.equal(invalid.violations.length,2);
  assert.equal(invalid.violations[0].remaining,-4);
  for(const row of assignments)if(row.owner==='developer')row.hours=12;
  assert.equal(capacityPlan({availability,assignments}).feasible,true);
});
test('missing owner capacity and duplicate task allocations cannot pass',async()=>{
  const {capacityPlan}=await load(), availability=[{owner:'developer',period:'week-1',hours:12,source:'owner'}];
  assert.throws(()=>capacityPlan({availability,assignments:[{owner:'unknown',period:'week-1',hours:1,task:'x'}]}),/no sourced availability/);
  const task={owner:'developer',period:'week-1',hours:1,task:'x'};
  assert.throws(()=>capacityPlan({availability,assignments:[task,task]}),/Repeated/);
});
