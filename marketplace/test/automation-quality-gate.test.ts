import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
// @ts-expect-error Portable JavaScript tool is tested at runtime.
import {createReviewTemplate} from '../packs/shared/tools/automation-review.mjs';
const checker=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../packs/shared/tools/quality/qe-check.cjs');
function run(plan:unknown,required=false){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'automation-quality-'));
  try{
    fs.writeFileSync(path.join(dir,'final.txt'),'The local draft is ready for review.');
    if(plan!==undefined)fs.writeFileSync(path.join(dir,'automation-plan.json'),JSON.stringify(plan));
    const child=spawnSync(process.execPath,[checker,path.join(dir,'final.txt'),'--context',dir,'--json',...(required?['--require','automation']:[])],{encoding:'utf8'});
    return {code:child.status,report:JSON.parse(child.stdout)};
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
function external(){const p=createReviewTemplate();p.task={id:'support',owner:'support-lead',workspaceId:'fixture-store',objective:'Draft a response',mode:'assist',successMetric:'Customer issue resolved'};p.actions[0].effect='external';return p;}
test('existing automation plan is checked automatically without claiming approval',()=>{
  const r=run(external());const row=r.report.rows.find((r:any)=>r.name==='automation');
  assert.equal(row.status,'WARN');assert.equal(row.review.status,'BLOCKED');assert.equal(row.review.authorityGranted,false);assert.equal(row.review.externalActionsExecuted,0);
});
test('explicit readiness requirement fails for unresolved external authority',()=>{
  const r=run(external(),true);assert.equal(r.code,1);assert.ok(r.report.failed.includes('automation'));
});
test('invalid automation plan cannot silently pass as an optional diagnostic',()=>{
  const r=run({schema:'invented'});assert.equal(r.code,1);assert.ok(r.report.failed.includes('automation'));
});
test('routine work without an automation plan gets no invented approval step',()=>{
  const r=run(undefined);assert.ok(!r.report.rows.some((r:any)=>r.name==='automation'));
  const required=run(undefined,true);assert.equal(required.code,1);assert.ok(required.report.failed.includes('automation'));
});
test('local draft is ready while no external authority is granted',()=>{
  const p=external();p.actions[0].effect='draft';const r=run(p,true);const row=r.report.rows.find((r:any)=>r.name==='automation');assert.equal(row.status,'PASS');assert.equal(row.review.authorityGranted,false);
});
