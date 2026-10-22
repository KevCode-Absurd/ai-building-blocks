// Attach only this release's verified production Worker to its intended apex.
// Wrangler OAuth remains in memory; output contains public routing metadata only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
assert.equal(process.argv[2], '--attach');
const account='31c814d2c58a11163d3187f505f0b9c5';
const zone='7cecfe8f7b9dae26dfa20e121b4dd43d';
const hostname='useaiblocks.com';
const hostnames=[hostname,'www.useaiblocks.com'];
const service='ai-building-blocks';
const release=JSON.parse(await fs.readFile('reports/cloudflare-live-release.json','utf8'));
assert(release.production.versionId, 'Record the confirmed production deployment first.');
assert.equal(release.staging.verified,true,'Review the completed private staging checks before cutover.');
assert.equal(release.staging.workerSha256,release.production.workerSha256,'Staging and production must contain the same reviewed Worker.');
for(const filename of ['cloudflare-staging-real-writes.json','cloudflare-staging-api-check.json']){
 const check=JSON.parse(await fs.readFile('reports/'+filename,'utf8'));
 assert.equal(check.status,'pass','Complete the real write and positive persistence checks before cutover: '+filename);
 assert.equal(check.deployedVersion,release.staging.versionId,'Positive checks must cover the current staging version: '+filename);
 assert.equal(check.productionTouched,false);
 assert.equal(check.providerCalls,0);
}
const downloads=JSON.parse(await fs.readFile('reports/cloudflare-staging-artifact-downloads.json','utf8'));
assert.equal(downloads.status,'pass');
assert.equal(downloads.origin,'https://ai-building-blocks-staging.kevinmark7498.workers.dev');
assert.equal(downloads.deployedVersion,release.staging.versionId,'Artifact checks must cover the final confirmed staging version.');
const credential=await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');
const token=credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
assert(token,'Wrangler OAuth is unavailable.');
async function api(route,method='GET',body){
 const response=await fetch('https://api.cloudflare.com/client/v4'+route,{method,headers:{authorization:'Bearer '+token,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(60000)});
 const data=await response.json();
 if(!response.ok||!data.success)throw Error(JSON.stringify({status:response.status,errors:data.errors?.map(({code,message})=>({code,message}))}));
 return data.result;
}
const currentDeployments=await Promise.all([release.staging.worker,service].map(worker=>api(`/accounts/${account}/workers/scripts/${worker}/deployments`)));
for(const [index,environment] of ['staging','production'].entries()){
 const latest=(currentDeployments[index].deployments||currentDeployments[index])[0];
 assert.equal(latest.versions.length,1);
 assert.equal(latest.versions[0].percentage,100);
 assert.equal(latest.versions[0].version_id,release[environment].versionId,'Remote deployment changed; review before publication.');
}
const domains=await api(`/accounts/${account}/workers/domains`);
for(const name of hostnames){
 const existing=domains.find(d=>d.hostname===name);
 assert(!existing||existing.service===service,'An intended hostname belongs to another Worker; inspect it before cutover.');
}
const report={checkedOn:new Date().toISOString(),versionId:release.production.versionId,hostname,service,zoneId:zone,domains:[],tlsVerified:false};
for(const name of hostnames){
 const result=await api(`/accounts/${account}/workers/domains`,'PUT',{hostname:name,service,enabled:true,zone_id:zone});
 assert.equal(result.hostname,name);assert.equal(result.service,service);assert.equal(result.enabled,true);
 report.domains.push({hostname:name,domainId:result.id,certificateId:result.cert_id,enabled:result.enabled});
 await fs.writeFile('reports/cloudflare-production-domain.json',JSON.stringify(report,null,2)+'\n');
}
const routes=hostnames.map(pattern=>({pattern,custom_domain:true}));
const activePath='site/wrangler.production.jsonc';
const active=JSON.parse(await fs.readFile(activePath,'utf8'));active.routes=routes;
await fs.writeFile(activePath,JSON.stringify(active,null,2)+'\n');
const frozen=JSON.parse(await fs.readFile('reports/cloudflare-frozen-release.json','utf8'));
const live=JSON.parse(await fs.readFile(frozen.configs.production,'utf8'));live.routes=routes;
await fs.writeFile(path.join(frozen.root,'wrangler.production.live.jsonc'),JSON.stringify(live,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
