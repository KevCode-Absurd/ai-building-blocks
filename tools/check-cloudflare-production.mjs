// Read-only production smoke: no fixture writes and no provider calls.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const base=new URL(process.argv[2]);
assert(['https://ai-building-blocks.kevinmark7498.workers.dev/','https://useaiblocks.com/'].includes(base.href));
const checks=[];
const stableDist=process.env.CF_RELEASE_DIST||'site/dist';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
async function get(path,init={}){return fetch(new URL(path,base),{...init,redirect:'manual',signal:AbortSignal.timeout(30000)});}
let failure;
try {
 for(const path of ['/','/how-it-works','/minds','/tools','/compose','/space','/people','/skills/website-brand-brain-builder','/example-app/']){
  const response=await get(path); assert.equal(response.status,200,path); assert((await response.text()).includes('<html'),path); checks.push(path+' HTML200');
 }
 for(const path of ['/data/blocks.json','/skills/website-brand-brain-builder/SKILL.md']){
  const response=await get(path); assert.equal(response.status,200,path); assert.equal(sha(Buffer.from(await response.arrayBuffer())),sha(fs.readFileSync(stableDist+path)),path+' build hash'); checks.push(path+' stable bytes');
 }
 const expectedAI=process.env.CF_EXPECT_AI_ENABLED==='true';
 let response=await get('/api/compose'); assert.equal(response.status,200); assert.match(response.headers.get('cache-control')||'',/no-store/); const compose=await response.json();
 assert.deepEqual(Object.keys(compose).sort(),['defaultModel','enabled','models']);
 const approvedModels=[['gpt-6-luna','GPT-6 Luna'],['gpt-6.1-sol','GPT-6.1 Sol'],['claude-haiku-5-5','Claude Haiku']];
 assert(approvedModels.some(([id])=>id===compose.defaultModel)); assert(Array.isArray(compose.models)); assert.equal(compose.models.length,approvedModels.length);
 compose.models.forEach((model,i)=>{assert.deepEqual(Object.keys(model).sort(),['available','id','label']);assert.equal(model.id,approvedModels[i][0]);assert.equal(model.label,approvedModels[i][1]);assert.equal(typeof model.available,'boolean');});
 assert.equal(compose.enabled,expectedAI);assert.equal(compose.enabled,compose.models.some(model=>model.available));
 checks.push('AI '+(expectedAI?'enabled':'disabled')+' as approved; only the allowlisted public model picker is exposed');
 response=await get('/api/security'); assert.equal(response.status,200); const security=await response.json(); assert.equal(security.required,true); assert.equal(typeof security.sitekey,'string'); assert(security.sitekey.length>10); checks.push('real Turnstile public configuration available');
 response=await get('/api/auth'); assert.equal(response.status,200); const auth=await response.json(); assert.equal(typeof auth.configured,'boolean'); assert.deepEqual(Object.keys(auth).sort(),['configured','publishableKey']); if(auth.configured)assert.match(auth.publishableKey,/^pk_live_/);else assert.equal(auth.publishableKey,null); checks.push('account configuration exposes only a live public key or safe disabled state');
 response=await get('/api/auth?usage'); assert([401,503].includes(response.status)); checks.push('account usage rejects anonymous access');
 response=await get('/api/comments?slug=production-read-only-check'); assert.equal(response.status,200); assert(Array.isArray((await response.json()).comments)); checks.push('comments D1 read');
 response=await get('/api/spaces/public'); assert.equal(response.status,200); assert(Array.isArray((await response.json()).items)); checks.push('spaces D1 read');
 response=await get('/api/spaces/me'); assert.equal(response.status,401); checks.push('owner authorization enforced');
 response=await get('/api/unknown'); assert.equal(response.status,404); assert.equal(typeof (await response.json()).error,'string'); checks.push('API JSON404');
 for(const path of ['/__preview/login','/__preview/logout']) { response=await get(path); assert.equal(response.status,404); } checks.push('private staging login is unavailable in production');
 for(const method of ['GET','HEAD']) { response=await get('/apps/mercatura-ads?source=launch-check',{method}); assert.equal(response.status,301); assert.equal(response.headers.get('location'),base.origin+'/apps?source=launch-check'); if(method==='HEAD')assert.equal(await response.text(),''); } checks.push('legacy Apps GET/HEAD redirect preserves query');
 response=await get('/production-missing-page-check'); assert.equal(response.status,404); assert((await response.text()).includes("This page doesn")); checks.push('real custom404');
 response=await get('/example-app/not-a-screen'); assert.equal(response.status,404); assert((await response.text()).includes("This screen isn't in the tour")); response=await get('/example-app/not-a-screen',{method:'HEAD'}); assert.equal(response.status,404); assert.equal(await response.text(),''); checks.push('saved tour retains its own404 for GET and HEAD');
 response=await get('/skills/fact-based-ad-copy-writer?source=launch'); assert.equal(response.status,301); const target=new URL(response.headers.get('location'),base); assert.equal(target.origin,base.origin); assert.equal(target.pathname,'/prompts/fact-based-ad-copy-writer'); assert.equal(target.search,'?source=launch'); checks.push('301 preserves query and origin');
 response=await get('/compose'); assert.match(response.headers.get('permissions-policy')||'',/microphone=\(self\)/); assert.equal(response.headers.get('x-content-type-options'),'nosniff'); checks.push('security and microphone headers');
 response=await get('/example-app/'); assert((await response.text()).includes('noindex')); checks.push('saved tour noindex');
 if(base.hostname==='useaiblocks.com'){
  response=await fetch('https://www.useaiblocks.com/compose?source=launch-check',{redirect:'manual',signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://useaiblocks.com/compose?source=launch-check');checks.push('www TLS and301 preserve path/query');
 }
} catch(error){ failure=String(error.message); }
const report={checkedOn:new Date().toISOString(),origin:base.origin,deployedVersion:process.env.CF_PRODUCTION_VERSION,readOnly:true,providerCalls:0,status:failure?'fail':'pass',passed:checks.length,checks,...(failure?{failure}:{})};
fs.writeFileSync('reports/cloudflare-production-smoke.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failure)process.exitCode=1;
