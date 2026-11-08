import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {handleCompanyApi} from '../src/server/company-api.ts';
import {memoryExpertStore} from '../src/server/expert-agent-store.ts';
import {memoryMcpOAuthStore,handleMcpOAuth} from '../src/server/mcp-oauth.ts';
import {memoryLibrary} from '../src/server/account-library.ts';
import {memorySpaces} from '../src/server/spaces.ts';
import {profile,scope,source,proposal} from './fixtures/expert-agent-fixtures.mjs';

const origin='https://production-contract.example.test',workspace='selected_workspace_123456789',company='/mcp/company/'+workspace;
async function fixture(){
 const deps={oauth:memoryMcpOAuthStore(),experts:memoryExpertStore(),spaces:memorySpaces(),library:memoryLibrary(),authenticate:async request=>request.headers.get('authorization')==='Bearer browser-session'?'user-one':new Response('Sign in',{status:401}),verifiedEmails:async()=>['member@example.test']};
 const stamp='2026-11-08T00:00:00Z';await deps.spaces.addSpace({id:'company-one',name:'Synthetic workspace',created:stamp,updated:stamp,userId:'user-one',ownerHash:'not-real',shareToken:workspace,ipHash:'not-real',access:{mode:'invited',emails:['member@example.test'],domain:''}});
 const env={EXPERT_AGENTS_ENABLED:'true',MCP_OAUTH_ENABLED:'true',PUBLIC_API_ENABLED:'true',API_ALLOWED_HOSTS:'production-contract.example.test',API_READ_LIMITER:{limit:async()=>({success:true})},API_WRITE_LIMITER:{limit:async()=>({success:true})},ASSETS:{fetch:async()=>new Response('Missing',{status:404})}};
 const handle=(request,options={})=>handleCompanyApi(request,{...env,...options},deps);
 const post=(path,body,headers={},options={})=>handle(new Request(origin+path,{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'192.0.2.9',...headers},body:JSON.stringify(body)}),options);
 return {deps,env,post};
}
async function grant(f,{path='/mcp/personal',user='user-one',write=true}={}){
 const verifier='v'.repeat(64),resource=origin+path,options={origin,authenticate:async()=>({userId:user}),authorizeResource:async()=>true};
 const send=async(path,data)=>{const response=await handleMcpOAuth(new Request(origin+path,{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(data)}),f.env,f.deps.oauth,options);assert(response.ok);return response.json();};
 const client=await send('/oauth/register',{client_name:'Synthetic production test',redirect_uris:['https://client.example.test/callback']});
 const read=path==='/mcp/personal'?'saved:read':'company:read';
 const authorized=await send('/oauth/authorize',{client_id:client.client_id,redirect_uri:client.redirect_uris[0],response_type:'code',code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256',resource,scope:read+(write?' '+read.replace(':read',':write'):''),state:'synthetic-test',consent:true});
 const tokens=await send('/oauth/token',{grant_type:'authorization_code',client_id:client.client_id,redirect_uri:client.redirect_uris[0],code:new URL(authorized.redirect_uri).searchParams.get('code'),code_verifier:verifier,resource});return {path,...tokens};
}
const rpc=async(f,g,method,params={},options={})=>{const response=await f.post(g.path,{jsonrpc:'2.0',id:1,method,params},{authorization:'Bearer '+g.access_token,accept:'application/json, text/event-stream'},options);return {response,body:await response.json()};};
const call=(f,g,name,args)=>rpc(f,g,'tools/call',{name,arguments:args});
const value=result=>{assert.equal(result.response.status,200);assert(!result.body.error,JSON.stringify(result.body));assert(!result.body.result?.isError,JSON.stringify(result.body));return result.body.result.structuredContent;};
let n=0;const write=(extra={})=>({expected_version:0,idempotency_key:'production-synthetic-'+(++n),confirmed:true,...extra});

test('production personal MCP composes existing library tools with durable exact reviewed judgment and save receipts',async()=>{
 const f=await fixture(),g=await grant(f);
 const tools=(await rpc(f,g,'tools/list')).body.result.tools;
 for(const name of ['get_me','get_saved_item','search_library','begin_expert_capture','review_expert_learning','export_expert_record','delete_expert_record'])assert(tools.some(t=>t.name===name),name);
 const saved=value(await call(f,g,'save_expert_profile',write({profile:profile()})));assert.equal(saved.destination.scope,'personal:user-one');assert.equal(saved.model_training,false);
 value(await call(f,g,'create_expert_agent',write({id:'pm-agent',profile_id:'pm-profile',name:'Private reviewer',scope:scope()})));
 const a=value(await call(f,g,'get_expert_record',{kind:'agent',id:'pm-agent'}));
 value(await call(f,g,'begin_expert_capture',write({id:'capture-one',agent_id:a.id,agent_sha256:a.sha256,mode:'interview',source:source()})));
 value(await call(f,g,'record_expert_capture_answer',write({id:'capture-one',expected_version:1,answer:{question_id:'case',answer:'Repeated support requests can represent a single customer.',artifact_sha256:null}})));
 value(await call(f,g,'propose_expert_learning',write({id:'capture-one',expected_version:2,proposal:proposal()})));
 const preview=value(await call(f,g,'preview_expert_learning',{id:'capture-one',decision:'accept'}));
 assert.equal(value(await call(f,g,'get_expert_record',{kind:'agent',id:'pm-agent'})).data.knowledge.length,0);
 value(await call(f,g,'review_expert_learning',write({id:'capture-one',expected_version:3,expected_agent_version:1,decision:'accept',approved_preview_sha256:preview.preview_sha256})));
 assert.equal(value(await call(f,g,'export_expert_record',{kind:'agent',id:'pm-agent'})).record.sha256,preview.result_agent_sha256);
});

test('production storage is additive and disabled discovery exposes no expert tools',async()=>{
 const f=await fixture(),g=await grant(f),listed=await rpc(f,g,'tools/list',{}, {EXPERT_AGENTS_ENABLED:'false'});
 assert(listed.body.result.tools.some(t=>t.name==='get_me'));assert(!listed.body.result.tools.some(t=>t.name==='save_expert_profile'));
 const disabled=await f.post('/api/v1/personal/expert-agents',{name:'list_expert_records',arguments:{kind:'agent'}},{authorization:'Bearer browser-session'},{EXPERT_AGENTS_ENABLED:'false'});assert.equal(disabled.status,404);
});

test('production read-only and company-member connections cannot advertise or call expert writes',async()=>{
 const f=await fixture(),read=await grant(f,{write:false}),member=await grant(f,{path:company,user:'employee',write:true});
 for(const g of [read,member]){const tools=(await rpc(f,g,'tools/list')).body.result.tools;assert(tools.some(t=>t.name==='get_expert_record'));assert(!tools.some(t=>t.name==='save_expert_profile'));const rejected=await call(f,g,'save_expert_profile',write({profile:profile()}));assert(rejected.body.error||rejected.body.result?.isError);}
 assert.equal((await f.deps.experts.list('personal:user-one','profile')).length,0);
});

test('same-origin website/API saves use the same scoped service; cross-origin and wrong-resource grants fail',async()=>{
 const f=await fixture(),path='/api/v1/personal/expert-agents';
 const saved=await f.post(path,{name:'save_expert_profile',arguments:write({profile:profile()})},{authorization:'Bearer browser-session',origin});assert.equal(saved.status,200);assert.equal((await saved.json()).saved,true);
 const g=await grant(f);assert.equal(value(await call(f,g,'get_expert_record',{kind:'profile',id:'pm-profile'})).storage_version,1);
 const cross=await f.post(path,{name:'list_expert_records',arguments:{kind:'profile'}},{authorization:'Bearer browser-session',origin:'https://foreign.example.test'});assert.equal(cross.status,403);
 const wrong=await f.post('/api/v1/company/'+workspace+'/expert-agents',{name:'list_expert_records',arguments:{kind:'profile'}},{authorization:'Bearer '+g.access_token});assert.equal(wrong.status,401);
 const noSession=await f.post(path,{name:'list_expert_records',arguments:{kind:'profile'}});assert.equal(noSession.status,401);
});
