// Code-only staging update using Cloudflare's documented keep_assets and strict
// binding inheritance. This never uploads assets or changes triggers/secrets.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const account='31c814d2c58a11163d3187f505f0b9c5',script='ai-building-blocks-staging';
const root='C:/Users/kevin/.codex/visualizations/2026/10/22/01a161bf-0b97-7cf2-97f3-74eb6d30d1e4/release-2026-10-22';
const release=JSON.parse(await fs.readFile('reports/cloudflare-live-release.json','utf8'));
assert.equal(release.staging.versionId,'444596ce-8262-4c41-8066-00fc4adf294f');
const credential=await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');
const token=credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
assert(token,'Wrangler OAuth is unavailable.');
async function api(route,init={}){
 const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/${script}${route}`,{...init,headers:{authorization:'Bearer '+token,...init.headers},signal:AbortSignal.timeout(60000)});
 const body=await response.json();
 if(!response.ok||!body.success)throw Error(JSON.stringify({status:response.status,errors:body.errors?.map(({code,message})=>({code,message}))}));
 return body.result;
}
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(canonical(value))??'null').digest('hex');
const bindingsHash=settings=>hash([...settings.bindings].sort((a,b)=>a.name.localeCompare(b.name)));
const before=await api('/settings');
const names=before.bindings.map(binding=>binding.name);
for(const name of ['ASSETS','COMMENTS','SPACES','COMPOSER','API_READ_LIMITER','API_WRITE_LIMITER','AI_LIMITER','PREVIEW_PROTECTED','PREVIEW_ACCESS_TOKEN','TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY'])assert(names.includes(name),'Required staging binding absent: '+name);
const code=await fs.readFile(path.join(root,'worker-r2/worker.js'));
const form=new FormData();
form.set('metadata',JSON.stringify({main_module:'worker.js',keep_assets:true,bindings:names.map(name=>({name,type:'inherit'})),compatibility_date:before.compatibility_date,compatibility_flags:before.compatibility_flags,annotations:{'workers/message':'Preserve the saved tour custom404; retain frozen launch assets and security bindings'}}));
form.set('worker.js',new Blob([code],{type:'application/javascript+module'}),'worker.js');
await api('?bindings_inherit=strict',{method:'PUT',body:form});
const after=await api('/settings');
assert.equal(bindingsHash(after),bindingsHash(before),'Staging bindings changed during the code-only update.');
assert.equal(hash(after.assets),hash(before.assets),'Asset configuration changed during the code-only update.');
const deployments=await api('/deployments');
const latest=(deployments.deployments||deployments)[0];
assert.equal(latest.versions.length,1);
assert.equal(latest.versions[0].percentage,100);
const versionId=latest.versions[0].version_id;
assert(/^[a-f0-9-]{36}$/.test(versionId));
assert.notEqual(versionId,release.staging.versionId);
const preview=JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json','utf8')).PREVIEW_ACCESS_TOKEN;
const base='https://ai-building-blocks-staging.kevinmark7498.workers.dev';
let response=await fetch(base+'/',{redirect:'manual',signal:AbortSignal.timeout(30000)});
assert.equal(response.status,403,'Private staging must remain gated.');
response=await fetch(base+'/example-app/not-a-screen',{headers:{'x-preview-access':preview},redirect:'manual',signal:AbortSignal.timeout(30000)});
assert.equal(response.status,404);
assert((await response.text()).includes("This screen isn't in the tour"));
const report={checkedOn:new Date().toISOString(),script,previousVersion:release.staging.versionId,versionId,workerSha256:crypto.createHash('sha256').update(code).digest('hex'),assetsRetained:true,bindingNamesPreserved:names.length,assetConfigPreserved:true,privatePreviewVerified:true,tour404Verified:true};
await fs.writeFile('reports/cloudflare-staging-worker-update.json',JSON.stringify(report,null,2)+'\n');
release.staging.previousVersionId=release.staging.versionId;release.staging.versionId=versionId;release.staging.status='tour-routing fix deployed; full live checks pending';release.staging.workerSha256=report.workerSha256;release.checkedOn=report.checkedOn;
await fs.writeFile('reports/cloudflare-live-release.json',JSON.stringify(release,null,2)+'\n');
for(const environment of ['staging','production']){
 const configPath=path.join(root,`wrangler.${environment}.jsonc`);
 const config=JSON.parse(await fs.readFile(configPath,'utf8'));
 config.main=path.join(root,'worker-r2/worker.js');
 await fs.writeFile(path.join(root,`wrangler.${environment}-r2.jsonc`),JSON.stringify(config,null,2)+'\n');
}
console.log(JSON.stringify(report,null,2));
