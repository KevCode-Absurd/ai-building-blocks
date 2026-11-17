import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
// @ts-expect-error Portable tool is JavaScript and tested at runtime.
import {template,reviewPerformance} from '../packs/shared/tools/performance-review.mjs';

function fixture() {
 const x=template();x.protocol.minImprovement=50;x.functionality={status:'PASS',evidence:['browser-checks.json']};
 for(const version of ['before','after']){x[version].source.revision=version==='before'?'a'.repeat(64):'b'.repeat(64);Object.assign(x[version].environment,{browser:'Chrome130',cpu:'4x',network:'1.6Mbps150ms'});}
 for(let pair=1;pair<=5;pair++)for(const version of ['before','after'])x[version].runs.push({pair,order:version==='before'?(pair%2?1:2):(pair%2?2:1),metrics:{lcpMs:version==='before'?1000+pair:800+pair,cls:0,tbtMs:20,imageReadyMs:version==='before'?600:500},evidence:`raw/${version}-${pair}.json`,lcpElement:'h1'});
 return x;
}
test('repeated comparable improvement remains a lab observation, never release approval',()=>{
 const r=reviewPerformance(fixture());assert.equal(r.status,'IMPROVED_LAB');assert.equal(r.statistics.lcpMs.medianPairedImprovement,200);assert.equal(r.releaseReady,false);assert.match(r.findings.join(' '),/Fixture observations cannot/);assert.match(r.limitations,/not authenticated/);
});
test('historical Arjun error: faster image cannot hide slower heading LCP',()=>{
 const x=fixture();x.protocol.minImprovement=5;for(const r of x.before.runs){r.metrics.lcpMs=264;r.metrics.imageReadyMs=401.7;}for(const r of x.after.runs){r.metrics.lcpMs=284;r.metrics.imageReadyMs=279.3;}
 const r=reviewPerformance(x);assert.equal(r.status,'REGRESSION');assert.equal(r.statistics.lcpMs.medianPairedImprovement,-20);assert.ok(r.statistics.imageReadyMs.medianPairedImprovement>122);assert.match(r.findings.join(' '),/secondary gains/);
});
test('heavy live snapshot cannot be paired with a lightweight fixture',()=>{
 const x=fixture();x.after.source.scope='preview';x.after.source.contentId='2.4mb-hero';assert.equal(reviewPerformance(x).status,'NOT_COMPARABLE');
});
test('warm cache, network and browser differences prevent a comparison',()=>{
 for(const key of ['cache','network','browser']){const x=fixture();x.after.environment[key]='different';assert.equal(reviewPerformance(x).status,'NOT_COMPARABLE');}
});
test('unpaired observations, failures and insufficient repetitions cannot pass',()=>{
 for(const mutate of [(x:any)=>x.after.runs.pop(),(x:any)=>x.after.runs[0].error='navigation failed',(x:any)=>{x.before.runs=x.before.runs.slice(0,3);x.after.runs=x.after.runs.slice(0,3);}]){const x=fixture();mutate(x);assert.equal(reviewPerformance(x).status,'INCONCLUSIVE');}
});
test('order is counterbalanced and duplicate pair identifiers are rejected',()=>{
 const x=fixture();for(const r of x.before.runs)r.order=1;for(const r of x.after.runs)r.order=2;assert.equal(reviewPerformance(x).status,'INCONCLUSIVE');x.before.runs.push(x.before.runs[0]);assert.throws(()=>reviewPerformance(x),/duplicate/);
});
test('same pair order cannot count as two measured versions',()=>{const x=fixture();x.after.runs[0].order=x.before.runs[0].order;assert.equal(reviewPerformance(x).status,'NOT_COMPARABLE');});
test('a median hides inconsistent paired outcomes unless enough pairs improve',()=>{
 const x=fixture();x.after.runs[0].metrics.lcpMs=1010;x.after.runs[1].metrics.lcpMs=1020;assert.equal(reviewPerformance(x).status,'INCONCLUSIVE');
});
test('a small change below the declared useful threshold stays inconclusive',()=>{const x=fixture();for(let i=0;i<5;i++)x.after.runs[i].metrics.lcpMs=x.before.runs[i].metrics.lcpMs-10;assert.equal(reviewPerformance(x).status,'INCONCLUSIVE');});
test('CLS regressions and broken behavior veto a faster primary metric',()=>{
 const x=fixture();for(const r of x.after.runs)r.metrics.cls=0.2;assert.equal(reviewPerformance(x).status,'REGRESSION');const y=fixture();y.functionality.status='FAIL';assert.equal(reviewPerformance(y).status,'REGRESSION');
});
test('unrun functionality and retrospectively selected targets do not pass',()=>{
 const x=fixture();x.functionality.status='NOT_RUN';assert.equal(reviewPerformance(x).status,'INCONCLUSIVE');const y=fixture();y.protocol.declaredBeforeRuns=false;assert.equal(reviewPerformance(y).status,'INCONCLUSIVE');
});
test('malformed measurements, unsupported primary metrics and evidence-free success reject',()=>{
 for(const mutate of [(x:any)=>x.after.runs[0].metrics.lcpMs=NaN,(x:any)=>x.after.runs[0].metrics.lcpMs=-1,(x:any)=>delete x.after.runs[0].metrics.lcpMs,(x:any)=>x.protocol.primaryMetric='imageReadyMs',(x:any)=>x.functionality.evidence=[]]){const x=fixture();mutate(x);assert.throws(()=>reviewPerformance(x));}
});
test('CLI returns machine-readable invalid status and nonzero exit for invalid input',()=>{
 const root=mkdtempSync(path.join(tmpdir(),'performance-review-'));
 try {const file=path.join(root,'input.json');writeFileSync(file,'{"schema":"wrong"}');const cli=fileURLToPath(new URL('../packs/shared/tools/performance-review.mjs',import.meta.url));const r=spawnSync(process.execPath,[cli,file],{encoding:'utf8'});assert.equal(r.status,2);assert.equal(JSON.parse(r.stderr).status,'INVALID');}finally{rmSync(root,{recursive:true,force:true});}
});
test('removing secondary guardrails cannot turn an unassessed regression into improvement',()=>{const x=fixture();x.protocol.guardrails={};for(const r of x.after.runs)r.metrics.cls=0.5;assert.throws(()=>reviewPerformance(x),/regression limits/);});
test('unedited source and environment placeholders are not observations',()=>{const x=fixture();x.before.source.revision='replace-with-baseline-file-hash';assert.throws(()=>reviewPerformance(x),/placeholders/);const y=fixture();y.after.environment.cpu='replace-with-throttle';assert.throws(()=>reviewPerformance(y),/placeholders/);});
