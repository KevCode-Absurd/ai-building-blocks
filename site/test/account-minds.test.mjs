import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { d1Minds, handleAccountMinds } from '../src/server/account-minds.ts';
import { MindSync, mergeBrowserMinds } from '../src/lib/mind-sync.ts';
import worker from '../src/worker.ts';

const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const env={CLERK_PUBLISHABLE_KEY:`pk_test_${btoa('clerk.example.test$')}`,CLERK_SECRET_KEY:'sk_test_placeholder',CLERK_JWT_KEY:publicKey.export({type:'spki',format:'pem'})};
const encode=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
function token(user='user_alice',patch={}) { const now=Math.floor(Date.now()/1000), body=`${encode({alg:'RS256',typ:'JWT',kid:'test'})}.${encode({iss:'https://clerk.example.test',sub:user,sid:'sess_test',azp:'https://example.test',iat:now,nbf:now-10,exp:now+300,v:2,sts:'active',...patch})}`;return body+'.'+createSign('RSA-SHA256').update(body).sign(privateKey).toString('base64url'); }
const mind={slug:'my-mind-voice',name:'My voice',specialty:'Customer emails',voice:'Warm and concise',principles:'Check facts',avoid:'Jargon',examples:'A private example.'};
const req=(user='user_alice',body,headers={})=>new Request('https://example.test/api/minds?user_id=user_bob',{method:body===undefined?'GET':'PUT',headers:{authorization:`Bearer ${token(user)}`,...(body===undefined?{}:{'content-type':'application/json'}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
function database() { const db=new DatabaseSync(':memory:');db.exec(fs.readFileSync('migrations/0006_account_minds.sql','utf8'));return {db,store:d1Minds({prepare(sql){return {bind(...values){return {async first(){return db.prepare(sql).get(...values)??null;},async run(){return {meta:{changes:Number(db.prepare(sql).run(...values).changes)}};}};}};}})}; }

test('real-signature authentication and strict account scoping protect both reads and writes',async()=>{
  const {db,store}=database();
  assert.equal((await handleAccountMinds(req('user_alice',{minds:[mind],revision:0}),env,store)).status,200);
  assert.deepEqual(await (await handleAccountMinds(req('user_bob'),env,store)).json(),{minds:[],revision:0});
  assert.deepEqual((await (await handleAccountMinds(req(),env,store)).json()).minds,[mind]);
  for(const headers of [{authorization:'Bearer forged'},{authorization:`Bearer ${token('user_alice',{exp:1})}`},{authorization:'','x-user-id':'user_alice'}]) assert.equal((await handleAccountMinds(req('user_alice',undefined,headers),env,store)).status,401);
  assert.equal((await handleAccountMinds(req('user_alice',{minds:[mind],revision:1,user_id:'user_bob'}),env,store)).status,400);
  assert.equal((await handleAccountMinds(req('user_alice',{minds:[mind],revision:1},{origin:'https://attacker.test'}),env,store)).status,403);
  const read=await handleAccountMinds(req(),env,store);assert.equal(read.headers.get('cache-control'),'private, no-store');assert.equal(read.headers.get('vary'),'Authorization');
  const missing=await worker.fetch(new Request('http://localhost/api/minds'),{...env,SECURITY_LOCAL:'true'});assert.equal(missing.status,401);
  db.close();
});
test('D1 compare-and-swap prevents lost updates and concurrent library-limit bypass',async()=>{
  const {db,store}=database();
  assert.equal(await store.put('alice',[mind],0),true);
  const concurrent=await Promise.all([store.put('alice',[{...mind,voice:'Device A'}],1),store.put('alice',[{...mind,voice:'Device B'}],1)]);
  assert.equal(concurrent.filter(Boolean).length,1);assert.equal((await store.get('alice')).revision,2);
  assert.equal(await store.put('alice',[],0),false);assert.equal(await store.put('new-user',[mind],5),false);
  assert.equal(await store.put('bob',[mind],0),true);assert.equal((await store.get('bob')).revision,1);
  assert.equal((await handleAccountMinds(req('bob',{minds:Array.from({length:13},(_,i)=>({...mind,slug:`my-mind-${i}`})),revision:1}),env,store)).status,400);
  assert.equal((await handleAccountMinds(req('alice',{minds:[],revision:1}),env,store)).status,409);
  assert.equal((await store.get('alice')).minds.length,1);db.close();
});
test('invalid and oversized libraries fail without changing saved profiles or leaking backend errors',async()=>{
  const {db,store}=database();
  for(const body of [{minds:[{...mind,slug:'../escape'}],revision:0},{minds:[{...mind,examples:'x'.repeat(8001)}],revision:0},{minds:[],revision:-1},{minds:[],revision:'0'},{minds:[],revision:0,padding:'x'.repeat(1000000)}]) assert.equal((await handleAccountMinds(req('alice',body),env,store)).status,400);
  const result=await handleAccountMinds(req(),env,{get:async()=>{throw Error('private database detail');}});assert.equal(result.status,503);assert(!JSON.stringify(await result.json()).includes('private database'));
  assert.equal((await handleAccountMinds(req(),env,null)).status,503);assert.deepEqual(await store.get('alice'),{minds:[],revision:0});db.close();
});
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
test('browser profiles never upload automatically; explicit migration preserves collisions and backups',async()=>{
  const local=[mind],remote=[{...mind,voice:'Different remote voice'}];
  const merged=mergeBrowserMinds(remote,local);assert.equal(merged.length,2);assert.notEqual(merged[0].slug,merged[1].slug);assert.deepEqual(mergeBrowserMinds(merged,local),merged);
  let writes=0;const client=new MindSync(local,()=>{throw Error('Cloud profiles must not persist to browser storage');},async(_url,options)=>{if(options.method==='GET')return Response.json({minds:[],revision:0});writes++;const body=JSON.parse(options.body);assert.deepEqual(body.minds,local);return Response.json({minds:body.minds,revision:1});});
  client.connect('alice',async()=>'alice-token');await tick();assert.equal(writes,0);assert.deepEqual(client.snapshot().minds,[]);
  await client.copyBrowserMinds();assert.equal(writes,1);assert.deepEqual(client.snapshot().localMinds,local);assert.deepEqual(client.pendingLocal(),[]);
  client.connect(null,null);assert.deepEqual(client.snapshot().minds,local);
});
test('account switching rejects stale responses and in-flight token acquisition before transmission',async()=>{
  let release,sendCount=0;const pending=new Promise(resolve=>{release=resolve;});
  const client=new MindSync([],()=>{},async(_url,options)=>{sendCount++;if(options.headers.authorization==='Bearer alice')return pending;return Response.json({minds:[],revision:0});});
  client.connect('alice',async()=>'alice');await tick();client.connect('bob',async()=>'bob');await tick();release(Response.json({minds:[mind],revision:1}));await tick();assert.equal(client.snapshot().userId,'bob');assert.deepEqual(client.snapshot().minds,[]);
  client.connect(null,null);assert.deepEqual(client.snapshot().minds,[]);
  let tokenReady;const tokenPromise=new Promise(resolve=>{tokenReady=resolve;});const initialCalls=sendCount;client.connect('alice',()=>tokenPromise);client.connect(null,null);tokenReady('alice');await tick();assert.equal(sendCount,initialCalls);
});
test('failed saves and conflicts retain the last saved library; refreshed stale drafts require review',async()=>{
  let revision=1,voice='Original',fail=true;
  const client=new MindSync([],()=>{},async(_url,options)=>{if(options.method==='PUT'){if(fail)return Response.json({error:'Save failed; draft retained'},{status:503});const body=JSON.parse(options.body);if(body.revision!==revision)return Response.json({error:'Changed on another device'},{status:409});revision++;voice=body.minds[0].voice;}return Response.json({minds:[{...mind,voice}],revision});});
  client.connect('alice',async()=>'token');await tick();await assert.rejects(client.save({...mind,voice:'My draft'},1),/Save failed/);assert.equal(client.snapshot().minds[0].voice,'Original');
  fail=false;revision=2;voice='Other device';await assert.rejects(client.save({...mind,voice:'My draft'},1),/another device/);await client.refresh();await assert.rejects(client.save({...mind,voice:'My draft'},1),/Review|review/);assert.equal(client.snapshot().minds[0].voice,'Other device');
  await client.save({...mind,voice:'Reviewed draft'},2);assert.equal(client.snapshot().minds[0].voice,'Reviewed draft');
});
test('Unicode libraries within existing field limits migrate intact, and removal remains revision protected',async()=>{
  const {db,store}=database();const unicode=Array.from({length:12},(_,i)=>({...mind,slug:`my-mind-${i}`,voice:'ज'.repeat(3000),principles:'ज'.repeat(4000),avoid:'ज'.repeat(2000),examples:'ज'.repeat(8000)}));
  assert.equal((await handleAccountMinds(req('alice',{minds:unicode,revision:0}),env,store)).status,200);
  assert.equal((await store.get('alice')).minds.length,12);
  assert.equal((await handleAccountMinds(req('alice',{minds:[],revision:0}),env,store)).status,409);
  assert.equal((await handleAccountMinds(req('alice',{minds:[],revision:1}),env,store)).status,200);
  assert.equal((await store.get('alice')).minds.length,0);db.close();
});
test('an unauthorized refresh clears cached cloud profiles and cannot fall back to saving them locally',async()=>{
  let unauthorized=false;let localWrites=0;
  const client=new MindSync([],()=>{localWrites++;},async()=>unauthorized?Response.json({error:'Your session expired. Sign in again.'},{status:401}):Response.json({minds:[mind],revision:1}));
  client.connect('alice',async()=>'token');await tick();assert.equal(client.snapshot().minds.length,1);unauthorized=true;await client.refresh();assert.deepEqual(client.snapshot().minds,[]);
  await assert.rejects(client.save(mind),/Refresh/);assert.equal(localWrites,0);client.connect(null,null);assert.deepEqual(client.snapshot().minds,[]);
});
