#!/usr/bin/env node
// Offline review of paired lab observations. Does not measure a page or certify a release.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

const METRICS = ['lcpMs', 'tbtMs', 'cls', 'imageReadyMs'];
const median = values => { const a = [...values].sort((a,b)=>a-b); return a[Math.floor((a.length-1)/2)]/2+a[Math.floor(a.length/2)]/2; };
const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x) && Object.getPrototypeOf(x) === Object.prototype;
const str = x => typeof x === 'string' && x.trim().length > 0 && x.length <= 2000;
const num = x => typeof x === 'number' && Number.isFinite(x) && x >= 0;
function requireThat(ok, message) { if (!ok) throw Error(message); }
function keys(object, allowed, name) { requireThat(plain(object) && Object.keys(object).every(k=>allowed.includes(k)), `${name}: unknown fields or not an object`); }
const stable = x => JSON.stringify(Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])));

export function template() {
  return {
    schema:'performance-review/1',
    protocol:{primaryMetric:'lcpMs', minImprovement:50, guardrails:{cls:0.01,tbtMs:20}, declaredBeforeRuns:true},
    before:{source:{targetId:'product-page',contentId:'same-visible-content-and-behavior',revision:'replace-with-baseline-file-hash',scope:'fixture'},environment:{browser:'replace-with-version',viewport:'390x844',cpu:'replace-with-throttle',network:'replace-with-profile',cache:'cold',interaction:'load-only'},runs:[]},
    after:{source:{targetId:'product-page',contentId:'same-visible-content-and-behavior',revision:'replace-with-candidate-file-hash',scope:'fixture'},environment:{browser:'replace-with-version',viewport:'390x844',cpu:'replace-with-throttle',network:'replace-with-profile',cache:'cold',interaction:'load-only'},runs:[]},
    functionality:{status:'NOT_RUN',evidence:[]},
    notes:['Declare metric and practical threshold before measuring. Append at least five complete pairs; alternate before/after order. Each run: {pair:1,order:1,metrics:{lcpMs:1000,cls:0,tbtMs:0},evidence:"raw/run-1.json"}. Preserve every run, including errors. This template is not measured evidence.'],
  };
}

export function reviewPerformance(input) {
  keys(input,['schema','protocol','before','after','functionality','notes'],'input');
  requireThat(input.schema==='performance-review/1','Unsupported schema');
  const p=input.protocol;
  keys(p,['primaryMetric','minImprovement','guardrails','declaredBeforeRuns'],'protocol');
  requireThat(['lcpMs','tbtMs','cls'].includes(p.primaryMetric),'Choose an actual primary performance metric, not image readiness');
  requireThat(num(p.minImprovement)&&p.minImprovement>0,'Declare a positive practical improvement threshold');
  requireThat(typeof p.declaredBeforeRuns==='boolean','Declare whether the protocol preceded the runs');
  keys(p.guardrails,METRICS,'guardrails');
  requireThat(Object.entries(p.guardrails).every(([k,v])=>k!==p.primaryMetric&&num(v)),'Guardrails must be distinct nonnegative limits');
  requireThat(['lcpMs','tbtMs','cls'].filter(k=>k!==p.primaryMetric).every(k=>Object.hasOwn(p.guardrails,k)), 'Declare regression limits for the other primary lab metrics (LCP, TBT and CLS)');
  if(input.notes!==undefined)requireThat(Array.isArray(input.notes)&&input.notes.length<=30&&input.notes.every(str),'Invalid notes');
  keys(input.functionality,['status','evidence'],'functionality');
  requireThat(['PASS','FAIL','NOT_RUN'].includes(input.functionality.status),'Invalid functionality status');
  requireThat(Array.isArray(input.functionality.evidence)&&input.functionality.evidence.length<=100&&input.functionality.evidence.every(str),'Invalid functionality evidence');
  if(input.functionality.status==='PASS')requireThat(input.functionality.evidence.length>0,'Functionality PASS needs evidence references');
  const required=[p.primaryMetric,...Object.keys(p.guardrails)], versions=['before','after'];
  for(const name of versions) {
    const v=input[name]; keys(v,['source','environment','runs'],name);
    keys(v.source,['targetId','contentId','revision','scope'],`${name}.source`);
    requireThat(['targetId','contentId','revision'].every(k=>str(v.source[k])),`${name}: source identity and revision required`);
    requireThat(Object.values(v.source).every(x=>typeof x!=='string'||!x.includes('replace-with-')),`${name}: replace template source placeholders with observed metadata`);
    requireThat(['fixture','preview','live'].includes(v.source.scope),`${name}: invalid scope`);
    keys(v.environment,['browser','viewport','cpu','network','cache','interaction'],`${name}.environment`);
    requireThat(['browser','viewport','cpu','network','cache','interaction'].every(k=>str(v.environment[k])),`${name}: complete measurement environment required`);
    requireThat(Object.values(v.environment).every(x=>!x.includes('replace-with-')),`${name}: replace template environment placeholders with observed settings`);
    requireThat(Array.isArray(v.runs)&&v.runs.length<=1000,`${name}: runs must be a bounded array`);
    const pairs=new Set();
    for(const r of v.runs) {
      keys(r,['pair','order','metrics','evidence','error','lcpElement'],`${name}.run`);
      requireThat(Number.isSafeInteger(r.pair)&&r.pair>0&&!pairs.has(r.pair),`${name}: duplicate or invalid pair`); pairs.add(r.pair);
      requireThat([1,2].includes(r.order)&&str(r.evidence),`${name}: run order and raw evidence required`);
      if(r.error!==undefined)requireThat(str(r.error),`${name}: invalid error`);
      if(r.lcpElement!==undefined)requireThat(str(r.lcpElement),`${name}: invalid LCP element`);
      keys(r.metrics,METRICS,`${name}.metrics`);
      requireThat(Object.values(r.metrics).every(num),`${name}: nonfinite, negative or nonnumeric measurement`);
      if(r.metrics.lcpMs!==undefined)requireThat(r.metrics.lcpMs>0,`${name}: zero LCP is not an observed paint`);
      if(!r.error)requireThat(required.every(k=>num(r.metrics[k])),`${name}: missing required metric`);
    }
  }
  const findings=[];
  const result=(status,statistics={})=>({schema:'performance-review-result/1',status,scope:input.before.source.scope,primaryMetric:p.primaryMetric,statistics,findings,releaseReady:false,limitations:'Descriptive review of supplied observations and references, not authenticated measurements, statistical significance, real-user Core Web Vitals, causal attribution, sales lift or production approval.'});
  for(const k of ['targetId','contentId','scope'])if(input.before.source[k]!==input.after.source[k])findings.push(`Source ${k} differs; compare the same page, visible content and scope`);
  if(stable(input.before.environment)!==stable(input.after.environment))findings.push('Browser, viewport, CPU, network, cache or interaction settings differ');
  if(findings.length)return result('NOT_COMPARABLE');
  if(!p.declaredBeforeRuns)findings.push('Primary metric and thresholds were not declared before the runs');
  const before=new Map(input.before.runs.map(r=>[r.pair,r])), after=new Map(input.after.runs.map(r=>[r.pair,r]));
  if(before.size!==after.size||[...before.keys()].some(k=>!after.has(k)))findings.push('Unpaired observations: preserve failures and rerun the full pair, without dropping inconvenient runs');
  if([...before.values(),...after.values()].some(r=>r.error))findings.push('One or more observed runs failed; no success verdict can omit these runs');
  if(before.size<5||after.size<5)findings.push('At least five complete pairs are needed for this descriptive comparison');
  if(findings.length)return result('INCONCLUSIVE');
  const orders=[];
  for(const [id,b] of before) {
    if(b.order===after.get(id).order) {findings.push(`Pair ${id} has no distinct before/after order`);return result('NOT_COMPARABLE');}
    orders.push(b.order);
  }
  if(!orders.includes(1)||!orders.includes(2)||Math.abs(orders.filter(x=>x===1).length-orders.filter(x=>x===2).length)>1){findings.push('Before/after order is not balanced across pairs; counterbalance order');return result('INCONCLUSIVE');}
  const statistics={};
  for(const metric of METRICS) {
    if(![...before.values(),...after.values()].every(r=>num(r.metrics[metric])))continue;
    const b=[...before.values()].map(r=>r.metrics[metric]),a=[...after.values()].map(r=>r.metrics[metric]);
    const deltas=[...before].map(([id,r])=>r.metrics[metric]-after.get(id).metrics[metric]);
    statistics[metric]={beforeMedian:median(b),afterMedian:median(a),medianPairedImprovement:median(deltas),improvedPairs:deltas.filter(x=>x>0).length,pairs:deltas.length,beforeRange:[Math.min(...b),Math.max(...b)],afterRange:[Math.min(...a),Math.max(...a)]};
  }
  const primary=statistics[p.primaryMetric];
  let status='INCONCLUSIVE';
  if(primary.afterMedian>primary.beforeMedian||primary.medianPairedImprovement<0) {
    status='REGRESSION';findings.push('Observed primary metric regressed; secondary gains do not establish the requested improvement. Small changes may be noise.');
  } else if(primary.beforeMedian-primary.afterMedian>=p.minImprovement&&primary.medianPairedImprovement>=p.minImprovement&&primary.improvedPairs/primary.pairs>=0.8)status='IMPROVED_LAB';
  else findings.push('Primary improvement is below the declared practical threshold or inconsistent across pairs');
  for(const [metric,limit] of Object.entries(p.guardrails))if(statistics[metric].afterMedian-statistics[metric].beforeMedian>limit) {
    status='REGRESSION';findings.push(`${metric} exceeded its declared regression limit`);
  }
  if(input.functionality.status==='FAIL'){status='REGRESSION';findings.push('Functionality check failed; retain the baseline');}
  else if(input.functionality.status!=='PASS') {if(status==='IMPROVED_LAB')status='INCONCLUSIVE';findings.push('Functional equivalence has not been checked');}
  if(input.before.source.scope==='fixture')findings.push('Fixture observations cannot establish improvement on a different live store or snapshot');
  return result(status,statistics);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    if(process.argv.length!==3)throw Error('Usage: node tools/performance-review.mjs template | observations.json');
    if(process.argv[2]==='template')console.log(JSON.stringify(template(),null,2));
    else {
      const stat=fs.lstatSync(process.argv[2]);
      requireThat(stat.isFile()&&!stat.isSymbolicLink()&&stat.size<=4_000_000,'Input must be a regular non-symlink JSON file under 4 MB');
      const result=reviewPerformance(JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')));
      console.log(JSON.stringify(result,null,2));process.exitCode=result.status==='IMPROVED_LAB'?0:1;
    }
  }catch(e){console.error(JSON.stringify({schema:'performance-review-result/1',status:'INVALID',error:e.message,releaseReady:false}));process.exitCode=2;}
}
