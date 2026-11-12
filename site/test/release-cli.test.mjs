import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {gateSteps,runSteps,validateDeploymentConfig,verifyOrRollBack,liveVersion,carryForwardAssets,rememberAssets,buildInventory,checkHeaders,headerRules,ASSET_KEEP_MS} from '../../tools/release.mjs';
const flags={PUBLIC_API_ENABLED:'true',MCP_OAUTH_ENABLED:'true',WORKFLOW_COMPOSER_ENABLED:'true'};
test('release stops on the first failed command and never reaches later work',async()=>{
 const ran=[];await assert.rejects(runSteps([['first'],['broken'],['never']],step=>{ran.push(step[0]);return {status:step[0]==='broken'?1:0};}),/Stopped at: broken/);assert.deepEqual(ran,['first','broken']);
});
test('an interrupted or unlaunchable release command also stops the sequence',async()=>{
 for(const result of [{status:null},{error:new Error('fixture')},undefined]){const ran=[];await assert.rejects(runSteps([['first'],['never']],step=>{ran.push(step[0]);return result;}));assert.deepEqual(ran,['first']);}
});
test('release order retains all old gates, including both indices and the generated check before units',()=>{
 assert.deepEqual(gateSteps.map(step=>step[0]),['Build minds','Index catalogue','Generate Before and After','Reindex catalogue','Check generated sections','Search relevance','Check source','Unit tests','Outcome evals scorecard','Team job structural controls','Production build','Byte budgets','SEO','Production file audit','Browser checks']);
 assert.ok(gateSteps.every(step=>!step[2].some(arg=>/lighthouse|--all|--baseline|deploy|screen-items/.test(arg))));
 assert.deepEqual(gateSteps.at(-1)[2],['playwright','test','--config','playwright.context.config.ts']);
});
test('deployment requires the actual API, OAuth and AI settings, ignoring comments',()=>{
 validateDeploymentConfig('// A valid JSONC comment\n'+JSON.stringify({vars:flags}),{pauseLatched:false});
 for(const name of Object.keys(flags))assert.throws(()=>validateDeploymentConfig('// "'+name+'": "true"\n'+JSON.stringify({vars:{...flags,[name]:'false'}}),null),/must stay enabled/);
 assert.throws(()=>validateDeploymentConfig('{bad',null),/invalid/);assert.throws(()=>validateDeploymentConfig(JSON.stringify({vars:{...flags,PUBLIC_API_ENABLED:true}}),null),/must stay enabled/);
});
test('a latched or malformed spending state cannot be resumed by deploying',()=>{
 const config=JSON.stringify({vars:flags});assert.throws(()=>validateDeploymentConfig(config,{pauseLatched:true}),/must not be resumed/);
 for(const state of [{},'unknown',{pauseLatched:'false'},[]])assert.throws(()=>validateDeploymentConfig(config,state),/unreadable/);
 validateDeploymentConfig(config,null);
});
const V1='11111111-1111-4111-8111-111111111111',V2='22222222-2222-4222-8222-222222222222';
test('a live check that passes on a retry keeps the new version and never rolls back',async()=>{
 let checks=0;const rolled=[],slept=[];
 const live=await verifyOrRollBack({previous:V1,check:async()=>{if(++checks<2)throw Error('Live check failed: / HTTP 503');return {urls:3};},rollBack:id=>{rolled.push(id);return {status:0};},sleep:async ms=>{slept.push(ms);}});
 assert.deepEqual(live,{urls:3});assert.equal(checks,2);assert.deepEqual(rolled,[]);assert.deepEqual(slept,[15000]);
});
test('a live check that keeps failing rolls production back to the version that was live before',async()=>{
 const rolled=[];let checks=0;
 await assert.rejects(verifyOrRollBack({previous:V1,check:async()=>{checks++;throw Error('Live content differs from build: /index.html');},rollBack:(id,failure)=>{rolled.push([id,failure.message]);return {status:0};},sleep:async()=>{}}),new RegExp('differs from build: /index.html. Production was rolled back to version '+V1));
 assert.equal(checks,3);assert.deepEqual(rolled,[[V1,'Live content differs from build: /index.html']]);
});
test('a failed rollback stops the release with the exact command to run by hand',async()=>{
 for(const result of [{status:1},{status:null},undefined])
  await assert.rejects(verifyOrRollBack({previous:V1,attempts:1,check:async()=>{throw Error('Live check failed: /mcp HTTP 500');},rollBack:()=>result}),new RegExp('Automatic rollback failed: run npx wrangler rollback '+V1+' -c wrangler.production.jsonc'));
});
test('the rollback target is the single version serving all traffic, or nothing is deployed',()=>{
 assert.equal(liveVersion(JSON.stringify({id:'d',versions:[{version_id:V1,percentage:100}]})),V1);
 for(const text of ['','not json','{}',JSON.stringify({versions:[{version_id:V1,percentage:50},{version_id:V2,percentage:50}]}),JSON.stringify({versions:[{version_id:'v1; rm -rf',percentage:100}]})])
  assert.throws(()=>liveVersion(text),/nothing was deployed|single version/);
});
test("a deploy carries only the previous build's own code files, for at most 7 days",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'release-assets-'));const assets=path.join(root,'site/dist/assets');
 const build=(...names)=>{fs.rmSync(assets,{recursive:true,force:true});fs.mkdirSync(assets,{recursive:true});for(const name of names)fs.writeFileSync(path.join(assets,name),name);};
 const history=()=>fs.readdirSync(path.join(root,'site/.wrangler/asset-history'));
 try{
  const now=Date.UTC(2026,10,3);
  build('a-1.js','shared.css');assert.equal(rememberAssets(root,V1,now-1000),2);
  build('b-2.js','shared.css');
  const carried=carryForwardAssets(root,now);
  assert.deepEqual(carried,{files:1,builds:1,names:['a-1.js']});
  assert.deepEqual(fs.readdirSync(assets).sort(),['a-1.js','b-2.js','shared.css']);
  // The next snapshot holds only build 2's own files, so old catalogues and chunks never pile up.
  assert.equal(rememberAssets(root,V2,now,carried.names),2);
  assert.equal(history().length,1);assert.deepEqual(fs.readdirSync(path.join(root,'site/.wrangler/asset-history',history()[0])).sort(),['b-2.js','shared.css']);
  build('c-3.js');assert.deepEqual(carryForwardAssets(root,now+1000).names,['b-2.js','shared.css']);
  build('d-4.js');assert.deepEqual(carryForwardAssets(root,now+ASSET_KEEP_MS+5000),{files:0,builds:0,names:[]},'a previous build older than 7 days is not carried');
  const inventory=buildInventory(root);assert.equal(inventory.limit,95000);assert.equal(inventory.headroom,95000-inventory.entries);assert.match(inventory.used,/^\d+(\.\d)?%$/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('the live header check fails on a missing or weakened security header',async()=>{
 const good={'/':{'strict-transport-security':'max-age=31536000; includeSubDomains','content-security-policy-report-only':"default-src 'self'; script-src 'self'; report-uri /api/client-error",'x-content-type-options':'nosniff'},
  '/sign-in':{'x-frame-options':'DENY','content-security-policy':"frame-ancestors 'none'"},'/account':{'x-frame-options':'DENY','content-security-policy':"frame-ancestors 'none'"},
  '/connect-mcp':{'x-frame-options':'DENY','content-security-policy':"frame-ancestors 'none'; base-uri 'self'; form-action 'self'"},
  '/support-chat-frame':{'x-frame-options':'SAMEORIGIN','content-security-policy':"frame-ancestors 'self'; base-uri 'self'"},
  '/skills/sample':{'cache-control':'public, max-age=300, stale-while-revalidate=600'}};
 const fetcher=headers=>async url=>new Response('ok',{headers:headers[new URL(url).pathname]??{}});
 assert.equal(await checkHeaders(fetcher(good),headerRules('/skills/sample')),5);
 assert(!headerRules(null).some(([route])=>route.startsWith('/connect-mcp')),'a bare GET of the consent page is a 400, so it is not a live check');
 for(const [route,name,value] of [['/','strict-transport-security','max-age=300'],['/sign-in','x-frame-options','SAMEORIGIN'],['/support-chat-frame','x-frame-options','DENY'],['/skills/sample','cache-control','public, max-age=300, stale-while-revalidate=86400'],['/','content-security-policy-report-only',null]]){
  const headers=structuredClone(good);if(value===null)delete headers[route][name];else headers[route][name]=value;
  await assert.rejects(checkHeaders(fetcher(headers),headerRules('/skills/sample')),new RegExp(`header check failed: ${route} ${name}`));
 }
});
test('a deploy reads the live version first, then verifies or rolls back, before any state is saved',()=>{
 const source=fs.readFileSync(new URL('../../tools/release.mjs',import.meta.url),'utf8');const body=source.slice(source.indexOf('export async function release('));
 const order=["carryForwardAssets(root)","buildInventory(root)","'Read live version'","'Deploy production'","verifyOrRollBack({check:()=>checkPublishedBuild(","rememberAssets(root,version,Date.now(),carried?.names)","'Notify IndexNow of changed URLs'","git(root,['commit'"].map(text=>body.indexOf(text));
 assert(order.every(index=>index>0),'every step is present');assert.deepEqual([...order].sort((a,b)=>a-b),order);
 assert.match(body,/\['wrangler','rollback',id,'-c','wrangler\.production\.jsonc','-m','live-check-failed','-y'\]/);
});
test('search scoring writes its reports to a temporary folder, never into the repo',()=>{
 const source=fs.readFileSync(new URL('../../tools/release.mjs',import.meta.url),'utf8');
 assert.match(source,/CATALOGUE_EVAL_REPORTS:process\.env\.CATALOGUE_EVAL_REPORTS\|\|path\.join\(os\.tmpdir\(\),'aiblocks-search-eval'\)/);
 assert.deepEqual(gateSteps.find(step=>step[0]==='Search relevance').slice(2),[['scripts/evaluate-catalogue-search.mjs','--check'],'site']);
});
