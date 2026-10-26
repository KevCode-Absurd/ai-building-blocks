import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LibrarySync} from '../src/lib/library-sync.ts';
const raw=(name='Kit')=>JSON.stringify({kits:[{id:'kit',name,slugs:['skill'],updated:1}],flows:[{id:'flow',name:'Workflow',nodes:[],edges:[],updated:1,customSkills:[{slug:'private',name:'Private skill',markdown:'Every original instruction'}]}],draft:null,currentFlow:null,recent:[]});
const data=()=>({'abb:v1':raw(),'abb:business':'{"name":"Original details"}'});
const drain=async()=>{for(let i=0;i<40;i++)await Promise.resolve();};
function setup(t,{seed=data(),storageSeed={},fail}={}){
  t.mock.timers.enable({apis:['setTimeout','Date'],now:1800000000000});
  let current={data:seed,revision:1},calls=[];
  const values=new Map(Object.entries(storageSeed));
  const storage={get length(){return values.size;},key:i=>[...values.keys()][i]??null,getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const send=async(_url,options)=>{
    calls.push({method:options.method,at:Date.now(),token:options.headers.authorization});
    const response=await fail?.(options,current,calls);if(response)return response;
    if(options.method==='PUT'){const input=JSON.parse(options.body);if(input.revision!==current.revision)return Response.json({error:'Concurrent save'},{status:409});current={data:input.data,revision:current.revision+1};}
    return Response.json(current);
  };
  const client=new LibrarySync(storage,send,'test');t.after(()=>client.connect(null,null));
  const ready=async(token=async()=> 'alice')=>{client.connect('alice',token);await drain();};
  const retry=async()=>{const at=client.snapshot().retryAt;assert(at>Date.now(),'Retry must be scheduled');t.mock.timers.tick(Math.ceil(at-Date.now()));await drain();};
  return {client,storage,calls,ready,retry,get current(){return current;},set current(value){current=value;}};
}
test('token service failure automatically retries opening the account without a poll or user action',async t=>{
  const x=setup(t);let attempts=0;await x.ready(async()=>{if(++attempts===1)throw Error('Temporary token service failure');return 'alice';});
  assert.equal(x.client.snapshot().status,'error');assert.equal(x.calls.length,0);await x.retry();
  assert.equal(x.client.snapshot().status,'saved');assert.deepEqual(x.client.snapshot().data,data());assert.equal(attempts,2);
});
test('a token request that never settles times out and retries without losing the pending account copy',async t=>{
  const x=setup(t);let attempts=0;await x.ready(()=>++attempts===1?new Promise(()=>{}):Promise.resolve('alice'));
  assert.equal(x.client.snapshot().status,'loading');t.mock.timers.tick(20000);await drain();
  assert.equal(x.client.snapshot().status,'error');assert.equal(x.client.snapshot().failure.stage,'token');assert.equal(x.client.snapshot().failure.code,'TimeoutError');await x.retry();
  assert.equal(x.client.snapshot().status,'saved');assert.deepEqual(x.client.snapshot().data,data());
});
test('automatic retry merges newer local skills and another-device additions without duplicate kits or workflows',async t=>{
  let once=true;const x=setup(t,{fail:options=>{if(options.method==='PUT'&&once){once=false;throw Error('Connection reset');}}});await x.ready();
  x.client.write('abb:v1',raw('My rename'));await x.client.flush();assert.equal(x.client.snapshot().dirty,true);
  const local=JSON.parse(x.client.read('abb:v1'));local.flows[0].customSkills[0].markdown='New complete instructions typed while waiting';x.client.write('abb:v1',JSON.stringify(local));
  const remote=JSON.parse(raw());remote.kits.push({id:'other-kit',name:'Other device kit',slugs:[],updated:2});
  x.current={data:{...data(),'abb:v1':JSON.stringify(remote)},revision:2};await x.retry();
  assert.equal(x.client.snapshot().status,'saved');const saved=JSON.parse(x.current.data['abb:v1']);
  assert.deepEqual(saved.kits.map(k=>k.id),['kit','other-kit']);assert.equal(saved.kits[0].name,'My rename');assert.equal(saved.flows.length,1);
  assert.equal(saved.flows[0].customSkills[0].markdown,local.flows[0].customSkills[0].markdown);
  assert.equal(x.current.data['abb:business'],data()['abb:business']);assert.equal(x.client.snapshot().dirty,false);
});
test('a committed save with a lost response is acknowledged on automatic retry without a second committed revision',async t=>{
  let once=true;const x=setup(t,{fail:(options,current)=>{if(options.method==='PUT'&&once){once=false;current.data=JSON.parse(options.body).data;current.revision++;throw Error('Response lost after commit');}}});await x.ready();
  x.client.write('abb:v1',raw('Committed once'));await x.client.flush();await x.retry();
  assert.equal(x.client.snapshot().status,'saved');assert.equal(x.current.revision,2);assert.equal(JSON.parse(x.current.data['abb:v1']).kits.length,1);
  assert.equal(JSON.parse(x.current.data['abb:v1']).flows[0].customSkills[0].markdown,'Every original instruction');
});
test('automatic retry completes a signup receipt after a lost response without a duplicate import',async t=>{
  let once=true;const x=setup(t,{seed:{},storageSeed:data(),fail:(options,current)=>{if(options.method==='PUT'&&once){once=false;current.data=JSON.parse(options.body).data;current.revision++;throw Error('Response lost after import');}}});
  const handoff=x.client.prepareSignUp();x.client.connect('alice',async()=>'alice',handoff);await drain();assert.equal(x.client.snapshot().status,'error');await x.retry();
  assert.equal(x.client.snapshot().status,'saved');assert(x.client.handoffComplete(handoff));assert.equal(x.current.revision,2);
  const saved=JSON.parse(x.current.data['abb:v1']);assert.equal(saved.kits.length,1);assert.equal(saved.flows.length,1);assert.equal(saved.browserSaves.length,1);
});
for(const status of [429,503])test(`HTML ${status} preserves HTTP Retry-After and waits despite edits and polling`,async t=>{
  let once=true;const x=setup(t,{fail:options=>{if(options.method==='PUT'&&once){once=false;return new Response('<html>Temporarily unavailable</html>',{status,headers:{'retry-after':status===429?'60':new Date(Date.now()+60000).toUTCString()}});}}});await x.ready();
  x.client.write('abb:v1',raw('Retained rename'));await x.client.flush();const failedAt=Date.now(),calls=x.calls.length;
  assert.equal(x.client.snapshot().retryAt,failedAt+60000);assert.equal(x.client.snapshot().dirty,true);
  x.client.write('abb:business','{"name":"Edited during backoff"}');t.mock.timers.tick(15000);await drain();await x.client.syncNow();await x.client.retry();
  assert.equal(x.calls.length,calls);t.mock.timers.tick(44999);await drain();assert.equal(x.calls.length,calls);
  t.mock.timers.tick(1);await drain();assert.equal(x.client.snapshot().status,'saved');assert.equal(x.current.data['abb:business'],'{"name":"Edited during backoff"}');
});
test('cached token rejection gets one forced refresh and saves automatically',async t=>{
  const tokens=[];const x=setup(t,{fail:options=>options.headers.authorization==='Bearer stale'?Response.json({error:'Expired token'},{status:401}):undefined});
  await x.ready(async force=>{tokens.push(force);return force?'fresh':'stale';});assert.equal(x.client.snapshot().status,'saved');assert.deepEqual(tokens,[false,true]);
  x.client.write('abb:v1',raw('Fresh token save'));await x.client.flush();assert.equal(x.client.snapshot().status,'saved');assert.equal(x.current.revision,2);
});
for(const status of [400,403])test(`permanent ${status} retains pending data without endless retries`,async t=>{
  let reject=false;const x=setup(t,{fail:()=>reject?Response.json({error:'Needs attention'},{status}):undefined});await x.ready();reject=true;
  x.client.write('abb:v1',raw('Retained local work'));await x.client.flush();const count=x.calls.length;
  assert.equal(x.client.snapshot().status,'error');assert.equal(x.client.snapshot().dirty,true);assert.equal(x.client.snapshot().retryAt,null);
  t.mock.timers.tick(3600000);await drain();await x.client.syncNow();assert.equal(x.calls.length,count);
  assert.equal(JSON.parse(x.client.read('abb:v1')).kits[0].name,'Retained local work');assert.equal(JSON.parse(x.current.data['abb:v1']).kits[0].name,'Kit');
});
test('temporary repeated session verification failures retry with fresh credentials and keep one complete copy',async t=>{
  let reject=false;const tokens=[];const x=setup(t,{fail:()=>reject?Response.json({error:'Verification unavailable'},{status:401}):undefined});
  await x.ready(async force=>{tokens.push(force);return 'alice';});reject=true;
  x.client.write('abb:v1',raw('Retained during verification outage'));await x.client.flush();
  assert.deepEqual(tokens,[false,false,true]);assert.equal(x.client.snapshot().dirty,true);assert.equal(x.client.snapshot().failure.status,401);
  reject=false;await x.retry();assert.equal(x.client.snapshot().status,'saved');assert.equal(x.current.revision,2);assert.equal(JSON.parse(x.current.data['abb:v1']).kits[0].name,'Retained during verification outage');
});
test('correcting a rejected payload starts a new autosave without needing a settings retry button',async t=>{
  let reject=true;const x=setup(t,{fail:options=>reject&&options.method==='PUT'?Response.json({error:'Invalid or oversized data'},{status:400}):undefined});await x.ready();
  x.client.write('abb:v1',raw('Rejected edit'));await x.client.flush();assert.equal(x.client.snapshot().retryAt,null);
  reject=false;x.client.write('abb:v1',raw('Corrected complete edit'));t.mock.timers.tick(700);await drain();
  assert.equal(x.client.snapshot().status,'saved');assert.equal(x.current.revision,2);assert.equal(JSON.parse(x.current.data['abb:v1']).kits[0].name,'Corrected complete edit');
  assert.equal(JSON.parse(x.current.data['abb:v1']).flows[0].customSkills[0].markdown,'Every original instruction');
});
test('an ended SDK session pauses saving with the local copy intact until authentication returns',async t=>{
  const x=setup(t);let ended=false;await x.ready(async()=>{if(ended)throw Object.assign(Error('Session ended'),{code:'AUTH_SESSION_REQUIRED'});return 'alice';});ended=true;
  x.client.write('abb:v1',raw('Needs verified sign-in'));await x.client.flush();const count=x.calls.length;
  assert.equal(x.client.snapshot().status,'error');assert.equal(x.client.snapshot().dirty,true);assert.equal(x.client.snapshot().retryAt,null);
  t.mock.timers.tick(3600000);await drain();assert.equal(x.calls.length,count);assert.equal(JSON.parse(x.client.read('abb:v1')).kits[0].name,'Needs verified sign-in');
});
test('backoff continues beyond three failures, stays bounded and cancels across account switches',async t=>{
  const x=setup(t,{fail:()=>{throw Error('Offline');}});await x.ready();
  for(let i=0;i<8;i++){const delay=x.client.snapshot().retryAt-Date.now();assert(delay>=800&&delay<=36000);await x.retry();}
  assert.equal(x.calls.length,9);x.client.connect('bob',async()=>'bob');await drain();const count=x.calls.length;
  x.client.connect(null,null);t.mock.timers.tick(3600000);await drain();assert.equal(x.calls.length,count);
  assert.equal(x.client.snapshot().user,null);assert.equal(x.client.snapshot().retryAt,null);
});
test('a concurrent same-field edit after a failed save pauses retries and keeps both copies',async t=>{
  let once=true;const x=setup(t,{fail:options=>{if(options.method==='PUT'&&once){once=false;throw Error('Offline');}}});await x.ready();
  x.client.write('abb:v1',raw('Local pending'));await x.client.flush();x.current={data:{...data(),'abb:v1':raw('Other device winning')},revision:2};await x.retry();
  assert.equal(x.client.snapshot().status,'conflict');assert.equal(x.client.snapshot().retryAt,null);const count=x.calls.length;
  t.mock.timers.tick(120000);await drain();assert.equal(x.calls.length,count);assert.equal(JSON.parse(x.client.read('abb:v1')).kits[0].name,'Local pending');assert.equal(JSON.parse(x.current.data['abb:v1']).kits[0].name,'Other device winning');
});
