// Deploy only a fully tested frozen finance content release; retain all bindings.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
const [environment,input,expectedVersion]=process.argv.slice(2);
assert(['staging','production'].includes(environment));assert(expectedVersion);
const root=path.resolve(input??'');assert(root.startsWith(path.resolve('site/.wrangler/releases')+path.sep));
const manifest=JSON.parse(await fs.readFile(path.join(root,'release-manifest.json'),'utf8'));
assert.equal(manifest.workerUnchanged,true);assert.equal(manifest.browserAssetsUnchanged,true);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(manifest.sourceManifestSha256,sha(await fs.readFile('reports/finance-expansion-manifest.json')));
const packs=JSON.parse(await fs.readFile('reports/finance-packs-qa.json','utf8'));assert.equal(packs.passed,210);assert.equal(packs.catalogueSha256,manifest.catalogueSha256);
assert.equal(packs.manifestSha256,manifest.sourceManifestSha256);
const runtime=JSON.parse(await fs.readFile('reports/finance-model-runtime-qa.json','utf8'));assert.equal(runtime.passed,120);assert.equal(runtime.manifestSha256,manifest.sourceManifestSha256);
assert.equal(JSON.parse(await fs.readFile('reports/finance-peer-qa.json','utf8')).independentMethodReviews,210);
const browser=JSON.parse(await fs.readFile('reports/finance-browser-qa.json','utf8'));assert.equal(browser.stats.expected,212);assert.equal(browser.stats.unexpected,0);assert.equal(browser.stats.flaky,0);assert.equal(browser.stats.skipped,0);
assert.equal(sha(await fs.readFile(path.join(root,'worker/worker.js'))),manifest.workerSha256);
assert.equal(sha(await fs.readFile(path.join(root,'assets/data/blocks.json'))),manifest.catalogueSha256);
assert.equal(JSON.parse(await fs.readFile(path.join(root,'frozen-assets-manifest.json'),'utf8')).workerSha256,manifest.workerSha256);
const live=JSON.parse(await fs.readFile('reports/cloudflare-live-release.json','utf8'));assert.equal(live[environment].versionId,expectedVersion);
assert.equal(manifest.workerSha256,live.production.workerSha256,'Production runtime changed after the content-only freeze.');
if(environment==='production'){
  assert.equal(manifest.previousVersionId,expectedVersion,'Production baseline changed after the content-only freeze.');
  const staging=JSON.parse(await fs.readFile('reports/finance-staging-qa.json','utf8'));
  assert.equal(staging.status,'pass');assert.equal(staging.catalogueSha256,manifest.catalogueSha256);assert.equal(staging.releaseRoot,root);
}
const config=JSON.parse(await fs.readFile(path.join(root,`wrangler.${environment}.jsonc`),'utf8'));
const script=environment==='production'?'ai-building-blocks':'ai-building-blocks-staging';assert.equal(config.name,script);
const account=config.account_id;assert(account);
const credential=await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');
const token=credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];assert(token,'Wrangler authorization unavailable.');
async function api(route){const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/${script}${route}`,{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});const data=await response.json();assert(response.ok&&data.success,'Cloudflare state check failed: '+response.status);return data.result;}
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const bindings=settings=>settings.bindings.map(binding=>({name:binding.name,fingerprint:sha(JSON.stringify(canonical(binding)))})).sort((a,b)=>a.name.localeCompare(b.name));
const currentVersion=async()=>{const result=await api('/deployments');const version=(result.deployments??result)[0].versions;assert.equal(version.length,1);assert.equal(version[0].percentage,100);return version[0].version_id;};
assert.equal(await currentVersion(),expectedVersion,'Another release is live; review before proceeding.');
const before=bindings(await api('/settings'));
for(const required of ['ASSETS','COMMENTS','SPACES','COMPOSER','CLERK_SECRET_KEY','TURNSTILE_SECRET_KEY'])assert(before.some(binding=>binding.name===required),'Missing '+required);
const shortConfig=path.resolve(`C:/Users/kevin/.codex/visualizations/2026/10/22/01a16358-342e-75a3-acab-0faec070ecef/finance-${environment}.jsonc`);
await fs.writeFile(shortConfig,JSON.stringify(config,null,2)+'\n');
const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['tools/wrangler-frozen.mjs','deploy','--env=','--keep-vars','--config',shortConfig],{cwd:path.resolve('.'),windowsHide:true,stdio:'inherit',env:{...process.env,CF_FROZEN_ASSET_MANIFEST:path.join(root,'frozen-assets-manifest.json'),WRANGLER_LOG_PATH:path.join(root,`${environment}-deploy.log`)}});child.on('error',reject);child.on('exit',resolve);});
// Inspect actual deployment state even when the CLI reports an uncertain outcome.
const versionId=await currentVersion();assert.deepEqual(bindings(await api('/settings')),before,'Bindings changed unexpectedly.');
assert.notEqual(versionId,expectedVersion,`No new deployment is active; CLI exit ${code}.`);
const report={deployedOn:new Date().toISOString(),status:'deployed-awaiting-public-verification',environment,origin:environment==='production'?'https://useaiblocks.com':'https://ai-building-blocks-staging.kevinmark7498.workers.dev',previousVersionId:expectedVersion,versionId,releaseRoot:root,workerSha256:manifest.workerSha256,catalogueSha256:manifest.catalogueSha256,bindingsPreserved:before.length,cliExitCode:code};
await fs.writeFile(`reports/finance-${environment}-deployment.json`,JSON.stringify(report,null,2)+'\n');
Object.assign(live[environment],report,{assetReleaseRoot:root});live.checkedOn=report.deployedOn;
await fs.writeFile('reports/cloudflare-live-release.json',JSON.stringify(live,null,2)+'\n');console.log(JSON.stringify(report,null,2));
