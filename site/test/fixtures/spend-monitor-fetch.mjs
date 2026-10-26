// Loaded only by the isolated subprocess integration test; every HTTP request is mocked.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.env.SITE_SPEND_MONITOR_STATE_DIR;assert(root?.includes('integration-'));
const stateFile=path.join(root,'fake-cloudflare.json');
let state;try{state=JSON.parse(await fs.readFile(stateFile));}catch{state={enabled:true,patches:0};}
const bindings=()=>[{name:'COMPOSER',type:'d1',id:'fake-database'},{name:'WORKFLOW_COMPOSER_ENABLED',type:'plain_text',text:String(state.enabled)},{name:'WORKFLOW_DAILY_CAP_USD',type:'plain_text',text:'10'},{name:'SECRET',type:'secret_text'}];
const success=result=>Response.json({success:true,result});
globalThis.fetch=async(url,init={})=>{
 const u=new URL(url);
 if(u.hostname==='useaiblocks.com'){assert(['/api/compose','/api/transcribe'].includes(u.pathname));return Response.json({enabled:state.enabled});}
 assert.equal(u.hostname,'api.cloudflare.com');
 if(u.pathname.endsWith('/graphql')){
  if(process.env.MONITOR_TEST_MODE==='telemetry-failure')return new Response('Unavailable',{status:503});
  return Response.json({errors:null,data:{viewer:{accounts:[{workers:[{sum:{requests:0,cpuTimeUs:0}}],d1:[{sum:{rowsRead:0,rowsWritten:0}}],d1Storage:[],r2:[],r2Storage:[]}]}}});
 }
 if(u.pathname.endsWith('/query'))return success([{success:true,results:[{usd:Number(process.env.MONITOR_TEST_AI_USD||0)}]}]);
 if(u.pathname.endsWith('/deployments'))return success({deployments:[{versions:[{version_id:state.enabled?'integration-before':'integration-paused',percentage:100}]}]});
 if(u.pathname.endsWith('/settings')){
  if(init.method==='PATCH'){
   const requested=JSON.parse(await init.body.get('settings').text());
   assert.deepEqual(requested.bindings,[{name:'COMPOSER',type:'inherit'},{name:'WORKFLOW_COMPOSER_ENABLED',type:'plain_text',text:'false'},{name:'WORKFLOW_DAILY_CAP_USD',type:'inherit'},{name:'SECRET',type:'inherit'}]);
   state.enabled=false;state.patches++;await fs.writeFile(stateFile,JSON.stringify(state));
  }
  return success({bindings:bindings(),limits:{cpu_ms:1000},usage_model:'standard'});
 }
 throw Error('Unexpected mock URL');
};
