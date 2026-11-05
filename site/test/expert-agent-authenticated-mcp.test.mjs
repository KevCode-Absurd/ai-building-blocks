import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {handleExpertAgentMcp} from '../src/server/expert-agent-mcp.ts';
import {memoryExpertStore} from '../src/server/expert-agent-store.ts';
import {memoryMcpOAuthStore,handleMcpOAuth} from '../src/server/mcp-oauth.ts';
import {memorySpaces} from '../src/server/spaces.ts';
import {profile,scope,source,proposal,NOW} from './fixtures/expert-agent-fixtures.mjs';
const origin='https://expert-preview.example.test',workspaceToken='company_preview_workspace_123456789',companyPath='/mcp/company/'+workspaceToken;
const env=()=>({EXPERT_AGENTS_ENABLED:'true',MCP_OAUTH_ENABLED:'true',PUBLIC_API_ENABLED:'true',API_ALLOWED_HOSTS:'expert-preview.example.test',API_READ_LIMITER:{limit:async()=>({success:true})},API_WRITE_LIMITER:{limit:async()=>({success:true})}});
async function fixture(){
 const deps={oauth:memoryMcpOAuthStore(),experts:memoryExpertStore(),spaces:memorySpaces(),now:NOW};let emails=['member@example.test'];deps.verifiedEmails=async()=>emails;
 await deps.spaces.addSpace({id:'company-one',name:'Synthetic company',created:NOW().toISOString(),updated:NOW().toISOString(),userId:'user-one',ownerHash:'synthetic-not-a-real-key',shareToken:workspaceToken,ipHash:'synthetic',access:{mode:'invited',emails:['member@example.test'],domain:''}});
 return {deps,setEmails:v=>emails=v};
}
async function grant(deps,{user='user-one',path='/mcp/personal',write=true}={}){
 const verifier='v'.repeat(64),resource=origin+path,options={origin,authenticate:async()=>({userId:user}),authorizeResource:async()=>true};
 const invoke=async(path,data)=>{const r=await handleMcpOAuth(new Request(origin+path,{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(data)}),env(),deps.oauth,options);assert.equal(r.status<400,true);return r.json();};
 const client=await invoke('/oauth/register',{client_name:'Synthetic expert preview',redirect_uris:['https://synthetic-client.example.test/callback']});
 const read=path==='/mcp/personal'?'saved:read':'company:read',scope=read+(write?' '+read.replace(':read',':write'):'');
 const auth=await invoke('/oauth/authorize',{client_id:client.client_id,redirect_uri:client.redirect_uris[0],response_type:'code',code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256',resource,scope,state:'synthetic-csrf-state',consent:true});
 const tokens=await invoke('/oauth/token',{grant_type:'authorization_code',client_id:client.client_id,redirect_uri:client.redirect_uris[0],code:new URL(auth.redirect_uri).searchParams.get('code'),code_verifier:verifier,resource});
 return {...tokens,client_id:client.client_id,path};
}
async function rpc(f,g,method,params={},options={}){
 const request=new Request(origin+(options.path??g?.path??'/mcp/personal'),{method:'POST',headers:{'content-type':'application/json',accept:'application/json, text/event-stream','mcp-protocol-version':'2025-03-26','cf-connecting-ip':'192.0.2.20',...(g?{authorization:'Bearer '+g.access_token}:{}),...options.headers},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});
 const response=await handleExpertAgentMcp(request,options.env??env(),f.deps);return {response,body:response?await response.json():null};
}
const call=(f,g,name,args)=>rpc(f,g,'tools/call',{name,arguments:args});
let count=0;const write=extra=>({expected_version:0,idempotency_key:'http-test-request-'+(++count),confirmed:true,...extra});
const value=result=>{assert.equal(result.response.status,200);assert(!result.body.error,JSON.stringify(result.body.error));assert(!result.body.result?.isError,JSON.stringify(result.body.result));return result.body.result.structuredContent;};

test('real OAuth PKCE and MCP HTTP persist profile, guided answers, proposals and exact accepted agent across requests',async()=>{
 const f=await fixture(),g=await grant(f.deps);
 const initialized=await rpc(f,g,'initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'Synthetic test',version:'1'}});assert.equal(initialized.body.result.serverInfo.name,'ai-blocks-expert-agent-preview');
 const listed=await rpc(f,g,'tools/list');assert(listed.body.result.tools.some(t=>t.name==='begin_expert_capture'));
 value(await call(f,g,'save_expert_profile',write({profile:profile()})));
 value(await call(f,g,'create_expert_agent',write({id:'pm-agent',profile_id:'pm-profile',name:'Synthetic product reviewer',scope:scope()})));
 const first=value(await call(f,g,'get_expert_record',{kind:'agent',id:'pm-agent'}));assert.equal(first.data.owner_id,'user-one');assert(first.data.workspace_id.startsWith('ea_'));
 value(await call(f,g,'begin_expert_capture',write({id:'capture-one',agent_id:first.id,agent_sha256:first.sha256,mode:'interview',source:source()})));
 const next=value(await call(f,g,'get_expert_record',{kind:'capture',id:'capture-one'}));assert.equal(next.question.id,'case');
 value(await call(f,g,'record_expert_capture_answer',write({id:'capture-one',expected_version:1,answer:{question_id:'case',answer:'Synthetic case: repeated tickets are not independent demand.',artifact_sha256:null}})));
 value(await call(f,g,'propose_expert_learning',write({id:'capture-one',expected_version:2,proposal:proposal()})));
 const p=value(await call(f,g,'preview_expert_learning',{id:'capture-one',decision:'accept'}));
 assert.equal(value(await call(f,g,'get_expert_record',{kind:'agent',id:'pm-agent'})).data.knowledge.length,0);
 const reviewed=value(await call(f,g,'review_expert_learning',write({id:'capture-one',expected_version:3,expected_agent_version:1,decision:'accept',approved_preview_sha256:p.preview_sha256})));
 assert.equal(reviewed.records.length,2);assert.equal(reviewed.evaluation_status,'NOT_RUN');
 const updated=value(await call(f,g,'get_expert_record',{kind:'agent',id:'pm-agent'}));assert.equal(updated.sha256,p.result_agent_sha256);assert.equal(updated.data.knowledge[0].status,'expert-approved');
 assert.equal(listed.response.headers.get('cache-control'),'private, no-store');assert.equal(listed.response.headers.get('x-robots-tag'),'noindex, nofollow');
});
test('read-only grants never advertise or execute writes; spoofed identities cannot change scope',async()=>{
 const f=await fixture(),g=await grant(f.deps,{write:false});const result=await rpc(f,g,'tools/list');assert(result.body.result.tools.every(t=>t.annotations.readOnlyHint));
 const denied=await call(f,g,'save_expert_profile',write({profile:profile()}));assert(denied.body.error);assert.equal((await f.deps.experts.list('personal:user-one','profile')).length,0);
 const writable=await grant(f.deps),bad=await call(f,writable,'save_expert_profile',write({profile:profile(),owner_id:'another-user'}));
 // Refused either as a protocol error or, as the shared MCP layer now does for bad arguments, as a tool error; nothing is stored.
 assert(bad.body.error||bad.body.result?.isError===true);assert.equal((await f.deps.experts.list('personal:another-user','profile')).length,0);assert.equal((await f.deps.experts.list('personal:user-one','profile')).length,0);assert(!JSON.stringify(bad.body).includes('PRIVATE_PROFILE_SENTINEL'));
});
test('anonymous, revoked and different-audience requests cannot initialize or read stored expert context',async()=>{
 const f=await fixture(),g=await grant(f.deps);value(await call(f,g,'save_expert_profile',write({profile:profile()})));
 assert.equal((await rpc(f,null,'initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'Unknown',version:'1'}})).response.status,401);
 const wrong=await rpc(f,g,'tools/list',{}, {path:companyPath});assert.equal(wrong.response.status,401);
 const foreign=await grant(f.deps,{user:'other-user'}),read=await call(f,foreign,'get_expert_record',{kind:'profile',id:'pm-profile'});assert.equal(read.body.result.isError,true);assert(!JSON.stringify(read.body).includes('PRIVATE_PROFILE_SENTINEL'));
 await f.deps.oauth.revoke(createHash('sha256').update(g.access_token).digest('hex'),g.client_id,Math.floor(Date.now()/1000));assert.equal((await rpc(f,g,'tools/list')).response.status,401);
});
test('company access is checked afresh; only its current owner has write tools even with a stale write grant',async()=>{
 const f=await fixture(),owner=await grant(f.deps,{path:companyPath}),member=await grant(f.deps,{path:companyPath,user:'employee',write:true});
 value(await call(f,owner,'save_expert_profile',write({profile:profile()})));
 const list=await rpc(f,member,'tools/list');assert(list.body.result.tools.every(t=>t.annotations.readOnlyHint));
 const read=value(await call(f,member,'get_expert_record',{kind:'profile',id:'pm-profile'}));assert.equal(read.data.id,'pm-profile');
 assert((await call(f,member,'save_expert_profile',write({profile:profile()}))).body.error);
 f.setEmails([]);assert.equal((await rpc(f,member,'tools/list')).response.status,403);
 assert.equal((await rpc(f,member,'initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'Former member',version:'1'}})).response.status,403);
 // Owner access is account-bound and remains valid without employee email membership.
 assert.equal((await rpc(f,owner,'tools/list')).response.status,200);
});
test('edge guards, per-grant rate limits, body limits and feature switch fail closed without leaking private data',async()=>{
 const f=await fixture(),g=await grant(f.deps);
 assert.equal((await rpc(f,g,'tools/list',{}, {env:{...env(),EXPERT_AGENTS_ENABLED:'false'}})).response,null);
 assert.equal((await rpc(f,g,'tools/list',{}, {headers:{origin:'https://untrusted.example.test'}})).response.status,403);
 assert.equal((await rpc(f,g,'tools/list',{}, {env:{...env(),API_WRITE_LIMITER:undefined}})).response.status,503);
 let calls=0;const limited={...env(),API_WRITE_LIMITER:{limit:async()=>({success:++calls<2})}};assert.equal((await rpc(f,g,'tools/list',{}, {env:limited})).response.status,429);assert.equal(calls,2);
 assert.equal((await rpc(f,g,'tools/call',{name:'save_expert_profile',arguments:write({profile:{...profile(),private_notes:'x'.repeat(65000)}})})).response.status,413);
 const preflight=await handleExpertAgentMcp(new Request(origin+'/mcp/personal',{method:'OPTIONS',headers:{'cf-connecting-ip':'192.0.2.20'}}),env(),f.deps);assert.equal(preflight.status,204);
});
