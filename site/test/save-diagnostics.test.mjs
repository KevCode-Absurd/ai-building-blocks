import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { SaveDiagnostics, safeDiagnostic, safeErrorCode, databaseErrorCode, SAVE_DIAGNOSTICS_KEY } from '../src/lib/save-diagnostics.ts';
import { LibrarySync } from '../src/lib/library-sync.ts';
import { saveRequestDiagnostics } from '../src/server/save-diagnostics.ts';
import { onRequest } from '../functions/api/library.ts';
const PRIVATE='PRIVATE-KIT-SKILL-WORKFLOW-email@example.test-secret-token-cookie';
const id='8db61562-bcca-4ab1-a48f-3472d7b8ad33';
const storage=()=>{const values=new Map();return{values,getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};};
const drain=async()=>{for(let i=0;i<60;i++)await Promise.resolve();};
const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const env={CLERK_PUBLISHABLE_KEY:`pk_test_${btoa('clerk.example.test$')}`,CLERK_SECRET_KEY:'sk_test_'+PRIVATE,CLERK_JWT_KEY:publicKey.export({type:'spki',format:'pem'}),API_ALLOWED_HOSTS:'example.test',API_READ_LIMITER:{limit:async()=>({success:true})},API_WRITE_LIMITER:{limit:async()=>({success:true})}};
const encode=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
function token(){const now=Math.floor(Date.now()/1000),body=`${encode({alg:'RS256',typ:'JWT',kid:'test'})}.${encode({iss:'https://clerk.example.test',sub:PRIVATE,sid:PRIVATE,azp:'https://example.test',iat:now,nbf:now-10,exp:now+300,v:2,sts:'active'})}`;return body+'.'+createSign('RSA-SHA256').update(body).sign(privateKey).toString('base64url');}
function req(body){return new Request('https://example.test/api/library?private='+PRIVATE,{method:body?'PUT':'GET',headers:{authorization:'Bearer '+token(),cookie:PRIVATE,'cf-connecting-ip':'192.0.2.30','x-save-request-id':PRIVATE,...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});}
function capture(t){const lines=[];t.mock.method(console,'error',line=>lines.push(line));return lines;}
const noPrivate=value=>assert(!JSON.stringify(value).includes(PRIVATE));
test('the diagnostic schema drops arbitrary fields, identifiers, raw errors and hostile codes',()=>{
 const result=safeDiagnostic({at:Date.now(),operation:PRIVATE,stage:PRIVATE,code:PRIVATE,requestId:PRIVATE,elapsedMs:Infinity,attempt:-4,status:900,error:PRIVATE,token:PRIVATE,stack:PRIVATE,data:PRIVATE,userId:PRIVATE});
 noPrivate(result);assert.equal(result.code,'unknown');assert.equal(result.requestId,null);assert.equal(result.elapsedMs,0);assert.equal(result.status,599);
 assert.equal(safeErrorCode({name:PRIVATE,cause:{code:PRIVATE}}),'unknown');assert.equal(safeErrorCode({get cause(){throw Error(PRIVATE);}}),'unknown');
});
test('known database and transport causes retain only finite codes, never SQL or bound values',()=>{
 assert.equal(databaseErrorCode(Error('D1_ERROR: INSERT INTO account_library VALUES('+PRIVATE+'): SQLITE_BUSY')),'SQLITE_BUSY');
 assert.equal(databaseErrorCode({message:PRIVATE,cause:{message:'SQLITE_FULL '+PRIVATE}}),'SQLITE_FULL');
 assert.equal(safeErrorCode({cause:{code:'ECONNRESET'},message:PRIVATE}),'ECONNRESET');
 assert.equal(databaseErrorCode(Error(PRIVATE)),'Error');
});
test('browser diagnostics survive reload and prune to 50 safe events and 24 hours without reading saved content',t=>{
 t.mock.timers.enable({apis:['Date'],now:1800000000000});const s=storage();const history=new SaveDiagnostics(s);
 s.setItem('abb:v1',PRIVATE);s.setItem(SAVE_DIAGNOSTICS_KEY,JSON.stringify([{at:Date.now()-86400001,code:'TypeError'},{at:Date.now(),code:PRIVATE,message:PRIVATE}]));
 for(let i=0;i<60;i++)history.record({code:'TimeoutError',stage:'transport',requestId:id});
 const report=new SaveDiagnostics(s).export();assert.equal(report.events.length,50);noPrivate(report);assert.equal(s.getItem('abb:v1'),PRIVATE);
 t.mock.timers.tick(86400001);assert.equal(history.export().events.length,0);assert.equal(s.getItem(SAVE_DIAGNOSTICS_KEY),'[]');
});
test('unavailable diagnostic storage never interrupts saving and retains an in-memory report',()=>{
 const history=new SaveDiagnostics({getItem(){throw Error(PRIVATE);},setItem(){throw Error(PRIVATE);}});
 history.record({stage:'storage',code:'QuotaExceededError'});assert.equal(history.export().events[0].code,'QuotaExceededError');noPrivate(history.export());
});
test('client history records a failed save and successful retry with server correlation and no private content',async t=>{
 t.mock.timers.enable({apis:['Date','setTimeout'],now:1800000000000});const s=storage();let current={data:{'abb:business':JSON.stringify({name:PRIVATE})},revision:1},fail=true,commits=0;
 const client=new LibrarySync(s,async(_url,options)=>{
  if(options.method==='PUT'){if(fail){fail=false;return Response.json({error:PRIVATE},{status:503,headers:{'x-save-request-id':id,'x-save-error-code':'SQLITE_BUSY','x-save-error-stage':'write'}});}current={data:JSON.parse(options.body).data,revision:2};commits++;}
  return Response.json(current);
 });t.after(()=>client.connect(null,null));client.connect(PRIVATE,async()=>PRIVATE);await drain();
 client.write('abb:business',JSON.stringify({name:PRIVATE+' changed'}));await client.flush();assert.equal(client.snapshot().dirty,true);
 const failure=client.diagnostics.export().events.at(-1);assert.equal(failure.code,'SQLITE_BUSY');assert.equal(failure.requestId,id);assert.equal(failure.operation,'PUT');noPrivate(failure);
 t.mock.timers.tick(Math.ceil(client.snapshot().retryAt-Date.now()));await drain();assert.equal(client.snapshot().status,'saved');assert.equal(commits,1);
 assert.equal(client.diagnostics.export().events.at(-1).event,'recovered');client.connect(null,null);noPrivate(new SaveDiagnostics(s).export());
});
test('client transport and token errors cannot leak provider error names, codes, messages, tokens or URLs',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date'],now:1800000000000});const client=new LibrarySync(storage(),async()=>{throw Object.assign(Error(PRIVATE),{name:PRIVATE,cause:{code:PRIVATE}});});
 t.after(()=>client.connect(null,null));client.connect(PRIVATE,async()=>{throw Object.assign(Error(PRIVATE),{name:PRIVATE,errors:[{code:PRIVATE}]});});await drain();
 assert.equal(client.diagnostics.export().events.at(-1).stage,'token');noPrivate(client.diagnostics.export());
 client.connect(null,null);client.connect(PRIVATE,async()=>PRIVATE);await drain();assert.equal(client.diagnostics.export().events.at(-1).stage,'transport');noPrivate(client.diagnostics.export());
});
test('server records database write cause and a generated request reference without bodies, URLs or identity',async t=>{
 const lines=capture(t),request=req({data:{'abb:business':JSON.stringify({name:PRIVATE})},revision:0});
 const response=await onRequest({request,env:{...env,COMPOSER:{prepare(){throw Error('D1_ERROR: '+PRIVATE+' SQLITE_BUSY');}}}});
 assert.equal(response.status,503);assert.equal(response.headers.get('x-save-error-code'),'SQLITE_BUSY');assert.equal(lines.length,1);
 const log=JSON.parse(lines[0]);assert.equal(log.stage,'write');assert.equal(log.code,'SQLITE_BUSY');assert.equal(log.requestId,response.headers.get('x-save-request-id'));assert.notEqual(log.requestId,PRIVATE);noPrivate(log);
 assert.deepEqual(Object.keys(log).sort(),Object.keys(safeDiagnostic({})).sort());
});
test('server distinguishes database read failures and request protection failures without raw exceptions',async t=>{
 const lines=capture(t);
 let response=await onRequest({request:req(),env:{...env,COMPOSER:{prepare(){throw Error('SQLITE_FULL '+PRIVATE);}}}});assert.equal(response.status,503);assert.equal(JSON.parse(lines.at(-1)).stage,'read');
 response=await onRequest({request:req(),env:{...env,API_READ_LIMITER:{limit:async()=>{throw Error(PRIVATE);}}}});assert.equal(response.status,503);assert.equal(JSON.parse(lines.at(-1)).code,'limiter_unavailable');
 response=await onRequest({request:req(),env:{...env,API_READ_LIMITER:{limit:async()=>({success:false})}}});assert.equal(response.status,429);assert.equal(response.headers.get('retry-after'),'60');assert.equal(JSON.parse(lines.at(-1)).code,'rate_limited');noPrivate(lines);
});
test('server authentication failures log only an anonymous classification and never sign-in material',async t=>{
 const lines=capture(t);const request=req();request.headers.set('authorization','Bearer '+PRIVATE);
 const response=await onRequest({request,env});assert.equal(response.status,401);assert.equal(lines.length,1);assert.equal(JSON.parse(lines[0]).stage,'auth');noPrivate(lines);
});
test('successful saves are not logged and a broken logger cannot change a failed response',async t=>{
 const lines=capture(t);const response=await onRequest({request:req({data:{'abb:business':JSON.stringify({name:PRIVATE})},revision:0}),env:{...env,COMPOSER:{prepare(){return{bind(){return{run:async()=>({meta:{changes:1}})}}}}}}});
 assert.equal(response.status,200);assert.equal(lines.length,0);assert.match(response.headers.get('x-save-request-id'),/^[a-f0-9-]{36}$/);
 const diagnostics=saveRequestDiagnostics('PUT',()=>{throw Error(PRIVATE);});diagnostics.report('write','SQLITE_BUSY');assert.equal(diagnostics.finish(new Response(null,{status:503})).status,503);
});
