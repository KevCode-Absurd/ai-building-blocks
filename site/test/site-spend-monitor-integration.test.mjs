import{test}from'node:test';import assert from'node:assert/strict';import fs from'node:fs/promises';import path from'node:path';import{execFile}from'node:child_process';import{promisify}from'node:util';import{pathToFileURL}from'node:url';
const repo=path.resolve(import.meta.dirname,'../..'),run=promisify(execFile),fixture=path.join(repo,'site/test/fixtures/spend-monitor-fetch.mjs');
for(const scenario of [{name:'healthy',ai:'0',status:'healthy',pause:false},{name:'warning',ai:'8.5',status:'warning',pause:false},{name:'threshold pause',ai:'10',status:'paused',pause:true},{name:'telemetry failure',ai:'0',status:'error',pause:true,mode:'telemetry-failure'}])test(`isolated monitor: ${scenario.name}`,async(t)=>{
 const parent=path.join(repo,'site/.wrangler/spend-monitor');await fs.mkdir(parent,{recursive:true});
 const root=await fs.mkdtemp(path.join(parent,'integration-'));
 t.after(async()=>{if(!path.resolve(root).startsWith(path.resolve(parent)+path.sep)||!path.basename(root).startsWith('integration-'))throw Error('Unexpected monitor fixture path');await fs.rm(root,{recursive:true,force:true});});
 const args=['--import',pathToFileURL(fixture).href,path.join(repo,'tools/monitor-site-spend.mjs'),'--enforce'];
 const env={...process.env,CLOUDFLARE_API_TOKEN:'test-only-no-network',SITE_SPEND_MONITOR_STATE_DIR:root,MONITOR_TEST_AI_USD:scenario.ai,MONITOR_TEST_MODE:scenario.mode||''};
 async function check(){try{return JSON.parse((await run(process.execPath,args,{cwd:repo,env,windowsHide:true})).stdout);}catch(e){assert.equal(e.code,1);assert(e.stdout?.trim(),e.stderr);return JSON.parse(e.stdout);}}
 const first=await check();assert.equal(first.status,scenario.status);assert.equal(!!first.pauseLatched,scenario.pause);
 if(scenario.pause){assert.equal(first.pauseConfirmed,true);assert.equal(JSON.parse(await fs.readFile(path.join(root,'fake-cloudflare.json'))).enabled,false);}
 if(scenario.status==='warning')assert.equal(first.notify,true);
 const second=await check();assert.equal(second.notify,false,'Unchanged state must not cause repeated alerts');
 if(scenario.pause){assert.equal(second.pause.alreadyPaused,true);assert.equal(JSON.parse(await fs.readFile(path.join(root,'fake-cloudflare.json'))).patches,1,'Never repeatedly mutate an already-paused Worker');}
 if(scenario.status==='paused'){
  const resumed=await run(process.execPath,args,{cwd:repo,env:{...env,MONITOR_TEST_AI_USD:'0'},windowsHide:true});assert.equal(JSON.parse(resumed.stdout).status,'paused','A lower reading must not resume paid features');
 }
});
