import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
// @ts-ignore Portable pack script.
import {backlogRecovery} from '../packs/shared/tools/commerce-math.mjs';

const input={backlogOrders:120,arrivalsPerDay:40,baseCapacityPerDay:50,overtimeCapacityPerDay:20,overtimeCostPerDay:60,horizonDays:20,currency:'USD',population:'synthetic paid unshipped orders',unit:'orders',constantRates:true,arrivalsExcludeBacklog:true};
test('backlog recovery conserves the queue, counts arrivals once and prices full overtime days',()=>{
  const r=backlogRecovery(input);
  assert.equal(r.status,'conditional_scenario');assert.equal(r.firstClearanceDay,4);assert.equal(r.overtimeDays,4);assert.equal(r.overtimeCost,240);
  assert.equal(r.endingBacklog,0);assert.equal(r.clearedAndStayedClearThroughHorizon,true);
  assert.equal(r.timeline.length,20);assert.equal(r.timeline[0].closingBacklog,90);
  let previous=120,totalDispatched=0;
  for(const row of r.timeline){
    assert.equal(row.openingBacklog,previous);
    assert.equal(row.arrivals,40);
    assert.equal(row.dispatched,Math.min(row.day<=4?70:50,previous+40));
    assert.equal(row.closingBacklog,previous+40-row.dispatched);
    assert.equal(row.overtimeCost,row.day<=4?60:0);
    totalDispatched+=row.dispatched;previous=row.closingBacklog;
  }
  assert.equal(totalDispatched,120+20*40);
  const base=backlogRecovery({...input,overtimeCapacityPerDay:0});
  assert.equal(base.firstClearanceDay,12);assert.equal(base.overtimeCost,0);
  assert.equal(base.timeline[11].closingBacklog,0);
});
test('partial final day costs a full day; a bounded horizon never invents clearance',()=>{
  const partial=backlogRecovery({...input,backlogOrders:125});
  assert.equal(partial.firstClearanceDay,5);assert.equal(partial.timeline[4].dispatched,45);assert.equal(partial.overtimeCost,300);
  const short=backlogRecovery({...input,horizonDays:3});
  assert.equal(short.firstClearanceDay,null);assert.equal(short.endingBacklog,30);assert.equal(short.overtimeCost,180);assert.equal(short.clearedAndStayedClearThroughHorizon,false);
  const equal=backlogRecovery({...input,arrivalsPerDay:70});
  assert.equal(equal.firstClearanceDay,null);assert.equal(equal.endingBacklog,120);
  const growing=backlogRecovery({...input,arrivalsPerDay:80});
  assert.equal(growing.firstClearanceDay,null);assert.equal(growing.endingBacklog,320);
});
test('day-zero clearance and temporary overtime clearance do not imply sustained capacity',()=>{
  const empty=backlogRecovery({...input,backlogOrders:0,arrivalsPerDay:60,horizonDays:3});
  assert.equal(empty.firstClearanceDay,0);assert.equal(empty.overtimeDays,0);assert.equal(empty.overtimeCost,0);
  assert.equal(empty.baseCapacityCoversArrivals,false);assert.equal(empty.endingBacklog,30);assert.equal(empty.clearedAndStayedClearThroughHorizon,false);
  assert.equal(empty.timeline[0].capacity,50);
  const temporary=backlogRecovery({...input,backlogOrders:10,arrivalsPerDay:60,horizonDays:3});
  assert.equal(temporary.firstClearanceDay,1);assert.equal(temporary.overtimeCost,60);assert.equal(temporary.endingBacklog,20);assert.equal(temporary.clearedAndStayedClearThroughHorizon,false);
  const idle=backlogRecovery({...input,backlogOrders:0,arrivalsPerDay:0});
  assert.equal(idle.firstClearanceDay,0);assert.equal(idle.endingBacklog,0);assert.equal(idle.overtimeCost,0);
});
test('backlog planning rejects omitted inputs, ambiguous populations and unsafe arithmetic',()=>{
  for(const key of Object.keys(input)){
    const missing:any={...input};delete missing[key];
    assert.throws(()=>backlogRecovery(missing),Error,`missing ${key}`);
  }
  for(const invalid of [
    {backlogOrders:-1},{arrivalsPerDay:1.5},{baseCapacityPerDay:Infinity},{overtimeCapacityPerDay:NaN},
    {overtimeCostPerDay:-1},{horizonDays:0},{horizonDays:3651},{horizonDays:1.5},
    {currency:'usd'},{currency:''},{population:' '},{unit:'units'},{constantRates:false},{arrivalsExcludeBacklog:false},
    {backlogOrders:Number.MAX_SAFE_INTEGER,arrivalsPerDay:1},
    {baseCapacityPerDay:Number.MAX_SAFE_INTEGER,overtimeCapacityPerDay:1},
    {overtimeCostPerDay:Number.MAX_VALUE},
  ])assert.throws(()=>backlogRecovery({...input,...invalid}),Error,JSON.stringify(invalid));
});
test('planning CLI exposes backlogRecovery without accepting formulas or an observed-ledger operation name',t=>{
  const root=fs.mkdtempSync(path.join(tmpdir(),'backlog-cli-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const tool=fileURLToPath(new URL('../packs/shared/tools/commerce-math.mjs',import.meta.url)),file=path.join(root,'scenario.json');
  const run=(doc:unknown)=>{fs.writeFileSync(file,JSON.stringify(doc));return spawnSync(process.execPath,[tool,file],{encoding:'utf8'});};
  const good=run({operation:'backlogRecovery',inputs:input});assert.equal(good.status,0,good.stderr);
  assert.equal(JSON.parse(good.stdout).result.firstClearanceDay,4);
  for(const operation of ['backlog_recovery','subtract','formula'])assert.equal(run({operation,inputs:input,formula:'120/(70-40)'}).status,1);
});
