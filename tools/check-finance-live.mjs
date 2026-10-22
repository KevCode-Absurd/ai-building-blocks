// Read-only exact-byte checks against the final deployed finance release.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
assert(process.argv[2],'Pass the frozen deployed asset directory.');
const environment=process.argv[3]??'production';assert(['staging','production'].includes(environment));
const assets=path.resolve(process.argv[2]),origin=environment==='production'?'https://useaiblocks.com':'https://ai-building-blocks-staging.kevinmark7498.workers.dev';
const preview=environment==='staging'?JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json','utf8')).PREVIEW_ACCESS_TOKEN:null;
const manifestPath='reports/finance-expansion-manifest.json';
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
assert.deepEqual(manifest.counts,{skills:120,workflows:60,agents:30,total:210});
assert.equal(manifest.items.length,210);
const targets=manifest.items.flatMap(item=>{
  const section=item.type==='skill'?'skills':item.type==='workflow'?'workflows':'agents';
  return[
    {route:`/${section}/${item.slug}`,file:`${section}/${item.slug}.html`,kind:item.type},
    {route:`/skills/${item.slug}/SKILL.md`,file:`skills/${item.slug}/SKILL.md`,kind:'governing-instructions'},
    {route:`/skills/${item.slug}.zip`,file:`skills/${item.slug}.zip`,kind:'source-pack'},
  ];
});
targets.push({route:'/data/blocks.json',file:'data/blocks.json',kind:'catalogue'});
assert.equal(targets.length,631);assert.equal(new Set(targets.map(target=>target.route)).size,631);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
// Fail locally if any frozen candidate is missing, before making public requests.
for(const target of targets)target.expectedSha256=sha(await fs.readFile(path.join(assets,target.file)));
const checks=new Array(targets.length),cacheKey=Date.now().toString();let next=0;
async function worker(){while(next<targets.length){const index=next++,target=targets[index];try{
  const response=await fetch(`${origin}${target.route}?finance-release-check=${cacheKey}`,{redirect:'manual',signal:AbortSignal.timeout(30000),headers:{'cache-control':'no-cache',...(preview?{'x-preview-access':preview}:{})}});
  const actualSha256=sha(Buffer.from(await response.arrayBuffer()));
  checks[index]={...target,status:response.status,actualSha256,passed:response.status===200&&actualSha256===target.expectedSha256};
}catch(error){checks[index]={...target,passed:false,error:error.message};}}}
await Promise.all(Array.from({length:6},worker));
let stagingPrivate;
if(environment==='staging'){const denied=await fetch(origin+'/',{redirect:'manual',signal:AbortSignal.timeout(30000)});stagingPrivate=[401,403,404].includes(denied.status);assert(stagingPrivate,'Staging privacy changed.');}
const failed=checks.filter(check=>!check.passed),report={checkedOn:new Date().toISOString(),environment,origin,assets,releaseRoot:path.dirname(assets),catalogueSha256:targets.find(target=>target.kind==='catalogue').expectedSha256,...(environment==='staging'?{stagingPrivate}:{}),
  checkerSha256:sha(await fs.readFile(import.meta.filename)),manifestSha256:sha(await fs.readFile(manifestPath)),
  status:failed.length?'fail':'pass',passed:checks.length-failed.length,failed:failed.length,readOnly:true,providerCalls:0,
  scope:'All 210 finance pages, 210 governing methods, 210 source ZIPs and catalogue match the frozen release bytes. Source truth, business outcomes and actual Microsoft Excel execution are separate.',checks};
const reportPath=environment==='staging'?'reports/finance-staging-qa.json':'reports/finance-live-qa.json';
await fs.writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,passed:report.passed,failed:failed.map(({route,status,error})=>({route,status,error})),report:reportPath},null,2));
if(failed.length)process.exitCode=1;
