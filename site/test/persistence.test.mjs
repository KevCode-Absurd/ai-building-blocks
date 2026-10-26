import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { d1Library, handleLibrary } from '../src/server/account-library.ts';
import { LibrarySync } from '../src/lib/library-sync.ts';
import { d1Spaces, handleSpaces } from '../src/server/spaces.ts';
import { readAccess, emailAllowed } from '../src/server/space-access.ts';
import { browserSaves, mergeSignUpSaves } from '../src/lib/signup-saves.ts';
import { mergeLibraries } from '../src/lib/merge-library.ts';

const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const env={CLERK_PUBLISHABLE_KEY:`pk_test_${btoa('clerk.example.test$')}`,CLERK_SECRET_KEY:'sk_test_placeholder',CLERK_JWT_KEY:publicKey.export({type:'spki',format:'pem'})};
const encode=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
function token(user='alice',patch={}) { const now=Math.floor(Date.now()/1000), body=`${encode({alg:'RS256',typ:'JWT',kid:'test'})}.${encode({iss:'https://clerk.example.test',sub:user,sid:'sess_test',azp:'https://example.test',iat:now,nbf:now-10,exp:now+300,v:2,sts:'active',...patch})}`;return body+'.'+createSign('RSA-SHA256').update(body).sign(privateKey).toString('base64url'); }
function database() {
  const db=new DatabaseSync(':memory:');
  for (const file of fs.readdirSync('migrations').sort()) db.exec(fs.readFileSync(`migrations/${file}`,'utf8'));
  const adapter={prepare(sql){return {bind(...values){return {async all(){return {results:db.prepare(sql).all(...values)};},async first(){return db.prepare(sql).get(...values)??null;},async run(){return {meta:{changes:Number(db.prepare(sql).run(...values).changes)}};}};}};}};
  return {db,adapter,store:d1Library(adapter),spaces:d1Spaces(adapter)};
}
const state=(name='Launch')=>JSON.stringify({kits:[{id:'k',name,slugs:['writer'],updated:1}],flows:[{id:'f',name:'Workflow',nodes:[{id:'n',slug:'writer',notes:'Keep this instruction'}],edges:[],updated:1}],recent:[],currentFlow:'f',draft:null});
const data={'abb:v1':state(),'abb:business':JSON.stringify({name:'Alice'})};
const req=(user='alice',body,headers={})=>new Request('https://example.test/api/library?user=bob',{method:body===undefined?'GET':'PUT',headers:{authorization:`Bearer ${token(user)}`,...(body===undefined?{}:{'content-type':'application/json'}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});

test('account library verifies signed sessions, scopes by account and rejects cross-site or malformed writes',async()=>{
  const {db,store}=database();
  assert.equal((await handleLibrary(req('alice',{data,revision:0}),env,store)).status,200);
  assert.deepEqual(await (await handleLibrary(req('bob'),env,store)).json(),{data:{},revision:0});
  assert.deepEqual((await (await handleLibrary(req(),env,store)).json()).data,data);
  for(const headers of [{authorization:'Bearer forged'},{authorization:`Bearer ${token('alice',{exp:1})}`},{authorization:'','x-user-id':'alice'}]) assert.equal((await handleLibrary(req('alice',undefined,headers),env,store)).status,401);
  for(const body of [{data,revision:1,user:'bob'},{data,revision:-1},{data:{unknown:'{}'},revision:1},{data:{'abb:v1':'broken'},revision:1},{data:{'abb:business':JSON.stringify({more:'x'.repeat(4_000_000)})},revision:1}]) assert.equal((await handleLibrary(req('alice',body),env,store)).status,400);
  assert.equal((await handleLibrary(req('alice',{data,revision:1},{origin:'https://attacker.test'}),env,store)).status,403);
  const response=await handleLibrary(req(),env,store);assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal(response.headers.get('vary'),'Authorization');
  assert.equal((await handleLibrary(req(),env,null)).status,503);db.close();
});

test('atomic revisions preserve the winning device and reject stale deletions',async()=>{
  const {db,store}=database();await store.put('alice',data,0);
  const results=await Promise.all([store.put('alice',{'abb:v1':state('Device A')},1),store.put('alice',{},1)]);
  assert.equal(results.filter(Boolean).length,1);assert.equal((await store.get('alice')).revision,2);
  assert.equal((await handleLibrary(req('alice',{data:{},revision:1}),env,store)).status,409);
  assert.equal((await store.get('alice')).data['abb:v1'],state('Device A'));db.close();
});

const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
function memoryStorage(initial={}) { const values=new Map(Object.entries(initial));return {values,get length(){return values.size;},key:i=>[...values.keys()][i]??null,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}; }
function transport() {let current={data:{},revision:0},offline=false;return {get current(){return current;},set offline(value){offline=value;},send:async(_url,options)=>{
  if(offline)throw Error('Offline; device copy retained');
  if(options.method==='PUT'){const input=JSON.parse(options.body);if(input.revision!==current.revision)return Response.json({error:'Changed on another device'},{status:409});current={data:input.data,revision:current.revision+1};}return Response.json(current);
}};}

test('signup merges colliding kits, custom workflow skills and drafts without replacing any account item',()=>{
  const accountState=JSON.parse(state('Account kit')),guestState=JSON.parse(state('Browser kit'));
  accountState.draft={...accountState.flows[0],id:'draft',name:'Account draft'};
  guestState.flows[0]={...guestState.flows[0],name:'Browser workflow',customSkills:[{slug:'custom-one',name:'My skill',markdown:'Keep every instruction'}]};
  guestState.draft={...guestState.flows[0],id:'draft',name:'Browser draft'};
  const account={'abb:v1':JSON.stringify(accountState),'abb:business':JSON.stringify({name:'Account facts'}),'abb:composer':JSON.stringify({plan:{title:'Account plan'}})};
  const guest={'abb:v1':JSON.stringify(guestState),'abb:business':JSON.stringify({name:'Browser facts'}),'abb:composer':JSON.stringify({plan:{title:'Browser plan'},customSkills:guestState.flows[0].customSkills})};
  const incoming={id:'signup-one',capturedAt:1,data:guest};
  const merged=mergeSignUpSaves(account,incoming),saved=JSON.parse(merged['abb:v1']);
  assert.deepEqual(saved.kits[0],accountState.kits[0]);assert.deepEqual(saved.flows[0],accountState.flows[0]);assert.deepEqual(saved.draft,accountState.draft);
  assert.equal(new Set(saved.kits.map(k=>k.id)).size,2);assert.equal(saved.flows.length,3);
  assert.deepEqual(saved.flows.find(f=>f.name==='Browser workflow').customSkills,guestState.flows[0].customSkills);
  assert.equal(merged['abb:business'],account['abb:business']);assert.equal(merged['abb:composer'],account['abb:composer']);
  assert.deepEqual(browserSaves(merged)[0].data,guest);assert.deepEqual(mergeSignUpSaves(merged,incoming),merged);
});

test('signup transfers automatically and a reload never restores kits deleted after the transfer',async()=>{
  const storage=memoryStorage(data),server=transport(),client=new LibrarySync(storage,server.send,'tab');
  const id=client.prepareSignUp();client.connect('alice',async()=>'alice',id);await tick();await tick();
  assert.equal(client.snapshot().status,'saved');assert.equal(client.handoffComplete(id),true);
  assert.equal(JSON.parse(server.current.data['abb:v1']).kits[0].name,'Launch');assert.equal(browserSaves(server.current.data).length,1);
  assert.equal(storage.getItem('abb:v1'),data['abb:v1']);assert.equal(storage.getItem(`abb:signup-saves/1:${id}`),null);
  const edited=JSON.parse(client.read('abb:v1'));edited.kits=[];client.write('abb:v1',JSON.stringify(edited));await client.flush();
  const reopened=new LibrarySync(storage,server.send,'new-tab');reopened.connect('alice',async()=>'alice',id);await tick();await tick();
  assert.deepEqual(JSON.parse(reopened.read('abb:v1')).kits,[]);assert.equal(browserSaves(reopened.snapshot().data).length,1);
});

test('signup rebases on simultaneous account edits instead of replacing the winning save',async()=>{
  const storage=memoryStorage(data);let current={data:{'abb:v1':state('Account original')},revision:1},puts=0;
  const client=new LibrarySync(storage,async(_url,options)=>{
    if(options.method==='PUT') { const input=JSON.parse(options.body);puts++;
      if(puts===1){current={data:{'abb:v1':state('Other device winning edit')},revision:2};return Response.json({error:'Revision changed'},{status:409});}
      assert.equal(input.revision,2);current={data:input.data,revision:3};
    }return Response.json(current);
  });
  const id=client.prepareSignUp();client.connect('alice',async()=>'alice',id);await tick();await tick();
  assert.equal(client.snapshot().status,'saved');assert.equal(puts,2);
  assert.deepEqual(JSON.parse(current.data['abb:v1']).kits.map(k=>k.name),['Other device winning edit','Launch']);
});

test('repeat sign-ins with fresh nonces do not duplicate snapshots or restore deleted account items',async()=>{
  const storage=memoryStorage(data),server=transport(),client=new LibrarySync(storage,server.send,'tab');
  const first=client.prepareSignUp();client.connect('alice',async()=>'alice',first);await tick();await tick();
  const edited=JSON.parse(client.read('abb:v1'));edited.kits=[];edited.flows=[];client.write('abb:v1',JSON.stringify(edited));await client.flush();
  const revision=server.current.revision;
  client.connect(null,null);const next=client.prepareSignUp();assert.notEqual(next,first);
  client.connect('alice',async()=>'alice',next);await tick();await tick();
  assert.equal(client.snapshot().status,'saved');assert(client.handoffComplete(next));
  assert.equal(server.current.revision,revision);assert.equal(browserSaves(server.current.data).length,1);
  assert.deepEqual(JSON.parse(client.read('abb:v1')).kits,[]);assert.deepEqual(JSON.parse(client.read('abb:v1')).flows,[]);
  client.connect(null,null);
});

test('a later sign-in imports new browser items without restoring previously merged deletions',()=>{
  const guest={'abb:v1':state('Original browser kit')},one=mergeSignUpSaves({}, {id:'one',capturedAt:1,data:guest});
  const account=JSON.parse(one['abb:v1']);account.kits=[];account.flows=[];one['abb:v1']=JSON.stringify(account);
  const changed=JSON.parse(guest['abb:v1']);changed.kits.push({id:'new',name:'New browser kit',slugs:['new-skill'],updated:2});
  changed.flows.push({...changed.flows[0],id:'new-flow',name:'New workflow',customSkills:[{slug:'custom',markdown:'Exact skill'}]});
  const merged=JSON.parse(mergeSignUpSaves(one,{id:'two',capturedAt:2,data:{'abb:v1':JSON.stringify(changed)}})['abb:v1']);
  assert.deepEqual(merged.kits.map(k=>k.name),['New browser kit']);assert.deepEqual(merged.flows.map(f=>f.name),['New workflow']);
  assert.deepEqual(merged.flows[0].customSkills,changed.flows[1].customSkills);assert.equal(merged.browserSaves.length,2);
});

test('repeat sign-in compares snapshot JSON by content regardless of property order',()=>{
  const incoming={id:'one',capturedAt:1,data},merged=mergeSignUpSaves({},incoming);
  const reverse=Object.fromEntries(Object.entries(data).reverse().map(([key,raw])=>[key,JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(raw)).reverse()))]));
  assert.equal(mergeSignUpSaves(merged,{id:'two',capturedAt:2,data:reverse}),merged);
});

test('signup recovers an acknowledged-lost save exactly once after reload',async()=>{
  const storage=memoryStorage(data);let current={data:{},revision:0},puts=0;
  const send=async(_url,options)=>{if(options.method==='PUT'){puts++;current={data:JSON.parse(options.body).data,revision:1};throw Error('Response lost');}return Response.json(current);};
  const client=new LibrarySync(storage,send,'tab'),id=client.prepareSignUp();client.connect('alice',async()=>'alice',id);await tick();await tick();
  assert.equal(client.snapshot().status,'error');client.connect(null,null);
  const reopened=new LibrarySync(storage,send,'new-tab');reopened.connect('alice',async()=>'alice',id);await tick();await tick();
  assert.equal(reopened.snapshot().status,'saved');assert.equal(puts,1);assert.equal(browserSaves(current.data).length,1);assert(reopened.handoffComplete(id));
});

test('a signup handoff is claimed by one account and cannot leak during account switching',async()=>{
  const storage=memoryStorage(data);let alicePuts=0,bobPuts=0;
  const client=new LibrarySync(storage,async(_url,options)=>{
    if(options.method==='PUT'){if(options.headers.authorization==='Bearer alice'){alicePuts++;throw Error('Offline');}bobPuts++;}
    return Response.json({data:{},revision:0});
  });
  const id=client.prepareSignUp();client.connect('alice',async()=>'alice',id);await tick();await tick();
  assert.equal(alicePuts,1);client.connect('bob',async()=>'bob',id);await tick();await tick();
  assert.equal(bobPuts,0);assert.deepEqual(client.snapshot().data,{});client.connect(null,null);
});

test('a claimed signup resumes in another tab without a return-link nonce',async()=>{
  const storage=memoryStorage(data),server=transport(),client=new LibrarySync(storage,server.send,'first');
  const id=client.prepareSignUp();let block=true;
  const send=async(url,options)=>{if(options.method==='PUT'&&block)throw Error('Offline');return server.send(url,options);};
  const first=new LibrarySync(storage,send,'old');first.connect('alice',async()=>'alice',id);await tick();await tick();first.connect(null,null);
  block=false;const reopened=new LibrarySync(storage,send,'new');reopened.connect('alice',async()=>'alice');await tick();await tick();
  assert.equal(reopened.snapshot().status,'saved');assert.equal(JSON.parse(server.current.data['abb:v1']).kits[0].name,'Launch');assert(reopened.handoffComplete(id));
});
test('guest import, offline edits, reload and re-login preserve work without crossing accounts',async()=>{
  const storage=memoryStorage(data),server=transport(),client=new LibrarySync(storage,server.send,'tab');
  client.connect('alice',async()=>'alice');await tick();assert.deepEqual(server.current.data,{});
  client.importGuest();await client.flush();assert.deepEqual(server.current.data,data);assert.equal(storage.getItem('abb:v1'),data['abb:v1']);
  server.offline=true;client.write('abb:v1',state('Offline kit'));await client.flush();assert.equal(client.snapshot().status,'error');
  client.connect('bob',async()=>'bob');await tick();assert.equal(client.read('abb:v1'),null);
  client.connect(null,null);assert.equal(client.read('abb:v1'),data['abb:v1']);
  server.offline=false;const resumed=new LibrarySync(storage,server.send,'tab');resumed.connect('alice',async()=>'alice');await tick();await tick();
  assert.equal(server.current.data['abb:v1'],state('Offline kit'));assert.equal(resumed.snapshot().status,'saved');
});
test('concurrent clients keep conflicting local work, never silently overwrite remote data',async()=>{
  const server=transport(),a=new LibrarySync(memoryStorage(),server.send,'a'),b=new LibrarySync(memoryStorage(),server.send,'b');
  a.connect('alice',async()=>'token');b.connect('alice',async()=>'token');await tick();
  a.write('abb:v1',state('A'));await a.flush();b.write('abb:v1',state('B'));await b.flush();
  assert.equal(b.snapshot().status,'conflict');assert.equal(b.read('abb:v1'),state('B'));assert.equal(server.current.data['abb:v1'],state('A'));
  await b.retry();assert.equal(server.current.data['abb:v1'],state('A'));
  await b.loadAccountCopy();assert.equal(b.read('abb:v1'),state('A'));
});
test('a new tab recovers offline edits after the original tab was closed',async()=>{
  const storage=memoryStorage(),server=transport(),closed=new LibrarySync(storage,server.send,'closed-tab');
  closed.connect('alice',async()=>'alice');await tick();server.offline=true;closed.write('abb:v1',state('Recovered after restart'));await closed.flush();
  server.offline=false;closed.connect(null,null);
  const reopened=new LibrarySync(storage,server.send,'new-tab');reopened.connect('alice',async()=>'alice');await tick();await tick();
  assert.equal(reopened.read('abb:v1'),state('Recovered after restart'));assert.equal(server.current.data['abb:v1'],state('Recovered after restart'));
  reopened.connect(null,null);
});
test('edits made while a save is in flight are sent with the next revision',async()=>{
  let release,puts=0,current={data:{},revision:0};
  const client=new LibrarySync(memoryStorage(),async(_url,options)=>{
    if(options.method==='GET')return Response.json(current);
    const input=JSON.parse(options.body);assert.equal(input.revision,current.revision);puts++;
    if(puts===1)await new Promise(resolve=>release=resolve);
    current={data:input.data,revision:current.revision+1};return Response.json(current);
  });
  client.connect('alice',async()=>'token');await tick();client.write('abb:v1',state('First'));const saving=client.flush();await tick();client.write('abb:v1',state('Second'));release();await saving;await tick();
  assert.equal(current.data['abb:v1'],state('Second'));assert.equal(current.revision,2);assert.equal(client.snapshot().dirty,false);client.connect(null,null);
});
test('late responses and token acquisition cannot expose or send the previous account',async()=>{
  let release,requests=0;const pending=new Promise(resolve=>release=resolve);
  const client=new LibrarySync(memoryStorage(),async(_url,options)=>{requests++;return options.headers.authorization==='Bearer alice'?pending:Response.json({data:{},revision:0});});
  client.connect('alice',async()=>'alice');await tick();client.connect('bob',async()=>'bob');await tick();release(Response.json({data,revision:1}));await tick();
  assert.equal(client.snapshot().user,'bob');assert.equal(client.read('abb:v1'),null);
  let ready;const tokenPromise=new Promise(resolve=>ready=resolve),before=requests;client.connect('alice',()=>tokenPromise);client.connect(null,null);ready('alice');await tick();assert.equal(requests,before);
});

test('release migration preserves existing comments, legacy space keys and every saved item',async()=>{
  const db=new DatabaseSync(':memory:');
  db.exec(fs.readFileSync('migrations/0001_comments.sql','utf8'));db.exec(fs.readFileSync('migrations/0002_spaces.sql','utf8'));
  db.exec("INSERT INTO comments(id,slug,parent,name,body,team,hidden,ip_hash,at) VALUES('c','old-slug',NULL,'Sam','Keep this comment',0,0,'hash','2026-01-01'); INSERT INTO spaces VALUES('s','Original','owner-hash','share-token','ip','2026','2026'); INSERT INTO space_items VALUES('i','s','kit','My kit','','','{}','private',0,'2026','2026');");
  const comments=JSON.stringify(db.prepare('SELECT * FROM comments').all()),items=JSON.stringify(db.prepare('SELECT * FROM space_items').all());
  db.exec(fs.readFileSync('migrations/0007_persistence_and_access.sql','utf8'));
  assert.equal(JSON.stringify(db.prepare('SELECT * FROM comments').all()),comments);assert.equal(JSON.stringify(db.prepare('SELECT * FROM space_items').all()),items);
  const old=db.prepare('SELECT * FROM spaces').get();assert.equal(old.owner_hash,'owner-hash');assert.equal(JSON.parse(old.access_policy).mode,'link');db.close();
});
test('workspace access enforces verified email allowlists, exact domains, revocation and account ownership',async()=>{
  const {db,spaces:store}=database();
  const call=async(method,path,{user,emails=[],body,key,legacy}={})=>{
    const request=new Request('https://example.test/api/spaces'+path,{method,headers:{...(key?{authorization:'Bearer '+key}:user?{authorization:'Bearer session'}:{}),...(legacy?{'x-space-key':legacy}:{}),'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
    const response=await handleSpaces(request,store,{ip:'127.0.0.1',authenticate:async()=>user??Response.json({error:'Sign in'},{status:401}),verifiedEmails:async()=>emails});
    return {status:response.status,data:await response.json()};
  };
  const made=(await call('POST','',{user:'owner',body:{name:'Company'}})).data;
  await call('POST','/me/items',{user:'owner',body:{kind:'workflow',title:'Private workflow',body:'private'}});
  const path='/shared/'+made.shareToken;
  assert.equal((await call('GET',path)).status,401);assert.equal((await call('GET',path,{user:'other',emails:['person@company.com']})).status,403);
  assert.equal((await call('PUT','/me/access',{user:'owner',body:{mode:'domain',emails:['guest@partner.com'],domain:'company.com'}})).status,200);
  for(const email of ['person@company.com','PERSON@COMPANY.COM','guest@partner.com']) assert.equal((await call('GET',path,{user:'member',emails:[email]})).status,200);
  for(const email of ['person@evilcompany.com','person@company.com.evil.test','person@sub.company.com']) assert.equal((await call('GET',path,{user:'member',emails:[email]})).status,403);
  assert.equal((await call('GET',path,{user:'unverified',emails:[],body:undefined})).status,403);
  assert.equal((await call('GET','/me',{key:made.ownerKey})).status,401,'old key cannot bypass claimed account');
  assert.equal((await call('PUT','/me/access',{user:'member',body:{mode:'link',emails:[],domain:''}})).status,404);
  await call('PUT','/me/access',{user:'owner',body:{mode:'invited',emails:[],domain:''}});
  assert.equal((await call('GET',path,{user:'member',emails:['guest@partner.com']})).status,403);
  assert.equal((await call('GET',path,{user:'owner'})).status,200);
  const legacy=(await call('POST','',{body:{name:'Legacy'}})).data;
  assert.equal((await call('POST','/me/claim',{user:'new-owner',legacy:legacy.ownerKey})).status,200);
  assert.equal((await call('GET','/me',{user:'new-owner'})).status,200);
  assert.equal((await call('POST','/me/claim',{user:'attacker',legacy:legacy.ownerKey})).status,403);
  const rotated=(await call('POST','/me/link',{user:'owner'})).data.shareToken;assert.notEqual(rotated,made.shareToken);assert.equal((await call('GET',path,{user:'owner'})).status,404);db.close();
});
test('access validation rejects wildcards and malformed domains and emails',()=>{
  for(const policy of [{mode:'domain',emails:[],domain:'*.company.com'},{mode:'domain',emails:[],domain:'https://company.com'},{mode:'invited',emails:['not an email'],domain:''}]) assert.throws(()=>readAccess(policy));
  assert.equal(emailAllowed(readAccess({mode:'invited',emails:['Person@Company.com'],domain:''}),['person@company.com']),true);
});

test('sign-out saves immediately and a separate device restores every library key and custom skill',async()=>{
  const server=transport(),first=new LibrarySync(memoryStorage(),server.send,'device-one');
  first.connect('alice',async()=>'alice');await tick();
  const saved=JSON.parse(state('Cross-device kit'));saved.flows[0].customSkills=[{slug:'private',name:'Private skill',markdown:'Every exact instruction'}];saved.draft={...saved.flows[0],id:'draft',name:'Open draft'};
  const complete={'abb:v1':JSON.stringify(saved),'abb:business':JSON.stringify({name:'Exact context'}),'abb:composer':JSON.stringify({plan:{title:'Exact plan'},customSkills:saved.flows[0].customSkills}),'aib-council-draft':JSON.stringify(['mind-one'])};
  for(const [key,raw] of Object.entries(complete))first.write(key,raw);
  await first.saveBeforeSignOut('alice');assert.equal(first.snapshot().dirty,false);first.connect(null,null);
  const second=new LibrarySync(memoryStorage(),server.send,'device-two');second.connect('alice',async()=>'alice');await tick();
  assert.deepEqual(second.snapshot().data,complete);assert.equal(second.snapshot().status,'saved');second.connect(null,null);
});

test('sign-out waits for in-flight saves and includes edits made during that save',async()=>{
  let release,current={data:{},revision:0},puts=0;
  const client=new LibrarySync(memoryStorage(),async(_url,options)=>{
    if(options.method==='PUT'){const input=JSON.parse(options.body);if(++puts===1)await new Promise(resolve=>release=resolve);assert.equal(input.revision,current.revision);current={data:input.data,revision:current.revision+1};}return Response.json(current);
  });
  client.connect('alice',async()=>'alice');await tick();client.write('abb:v1',state('First'));
  const saving=client.flush();await tick();let ended=false;const ending=client.saveBeforeSignOut('alice').then(()=>ended=true);
  client.write('abb:v1',state('Last edit'));await tick();assert.equal(ended,false);release();await saving;await ending;
  assert.equal(current.data['abb:v1'],state('Last edit'));assert.equal(puts,2);assert.equal(client.snapshot().dirty,false);client.connect(null,null);
});

test('failed sign-out saving retains local work and succeeds after reconnection',async()=>{
  const storage=memoryStorage(),server=transport(),client=new LibrarySync(storage,server.send);
  client.connect('alice',async()=>'alice');await tick();server.offline=true;client.write('abb:v1',state('Offline last edit'));
  await assert.rejects(client.saveBeforeSignOut('alice'),/still signed in/);assert.equal(client.snapshot().user,'alice');assert(client.snapshot().dirty);assert.deepEqual(server.current.data,{});
  server.offline=false;await client.saveBeforeSignOut('alice');assert.equal(server.current.data['abb:v1'],state('Offline last edit'));client.connect(null,null);
});

test('sign-out refuses stale device conflicts without replacing the other device',async()=>{
  const server=transport(),first=new LibrarySync(memoryStorage(),server.send,'one'),second=new LibrarySync(memoryStorage(),server.send,'two');
  first.connect('alice',async()=>'alice');second.connect('alice',async()=>'alice');await tick();
  first.write('abb:v1',state('Other device winner'));await first.flush();second.write('abb:v1',state('This device pending'));
  await assert.rejects(second.saveBeforeSignOut('alice'),/Both devices/);assert.equal(second.snapshot().status,'conflict');assert.equal(second.read('abb:v1'),state('This device pending'));assert.equal(server.current.data['abb:v1'],state('Other device winner'));
  first.connect(null,null);second.connect(null,null);
});

test('sign-out cannot finish for a different account while a save is pending',async()=>{
  let release;const pending=new Promise(resolve=>release=resolve);
  const client=new LibrarySync(memoryStorage(),async()=>pending);
  client.connect('alice',async()=>'alice');const ending=client.saveBeforeSignOut('alice');client.connect('bob',async()=>'bob');
  release(Response.json({data:{},revision:0}));await assert.rejects(ending,/account changed/i);client.connect(null,null);
});

test('two signed-in devices receive additions, custom skill edits and deletions without reconnecting',async()=>{
  const server=transport(),a=new LibrarySync(memoryStorage(),server.send,'a'),b=new LibrarySync(memoryStorage(),server.send,'b');
  a.connect('alice',async()=>'alice');b.connect('alice',async()=>'alice');await tick();
  const content=JSON.parse(state('Live kit'));content.flows[0].customSkills=[{slug:'private',name:'Private skill',markdown:'Exact private instructions'}];
  a.write('abb:v1',JSON.stringify(content));await a.flush();let updates=0;b.onRemote(()=>updates++);await b.syncNow();
  assert.equal(b.snapshot().user,'alice');assert.equal(b.read('abb:v1'),a.read('abb:v1'));assert.equal(updates,1);
  await b.syncNow();assert.equal(updates,1);assert.equal(server.current.revision,1);
  content.kits=[];content.flows[0].customSkills[0].markdown='Updated instructions';a.write('abb:v1',JSON.stringify(content));await a.flush();await b.syncNow();
  assert.deepEqual(JSON.parse(b.read('abb:v1')).kits,[]);assert.equal(JSON.parse(b.read('abb:v1')).flows[0].customSkills[0].markdown,'Updated instructions');assert.equal(server.current.revision,2);
  a.connect(null,null);b.connect(null,null);
});

test('concurrent additions from signed-in devices rebase automatically with no duplicate items',async()=>{
  const server=transport(),a=new LibrarySync(memoryStorage(),server.send,'a'),b=new LibrarySync(memoryStorage(),server.send,'b');
  a.connect('alice',async()=>'alice');b.connect('alice',async()=>'alice');await tick();
  const first=JSON.parse(state('A')),second=JSON.parse(state('B'));second.kits[0].id='different-kit';second.flows=[];
  a.write('abb:v1',JSON.stringify(first));b.write('abb:v1',JSON.stringify(second));await a.flush();await b.flush();await a.syncNow();
  assert.equal(b.snapshot().status,'saved');assert.deepEqual(JSON.parse(server.current.data['abb:v1']).kits.map(k=>k.name),['A','B']);
  assert.equal(a.read('abb:v1'),b.read('abb:v1'));await b.syncNow();assert.equal(server.current.revision,2);a.connect(null,null);b.connect(null,null);
});

test('three-way merge combines independent edits inside kits and workflow custom skills',()=>{
  const base={'abb:v1':state('Original')},local=JSON.parse(base['abb:v1']),remote=JSON.parse(base['abb:v1']);
  local.kits[0].name='Renamed';local.kits[0].updated=3;remote.kits[0].slugs.push('new-skill');remote.kits[0].updated=4;
  local.flows[0].nodes[0].notes='Changed exact notes';remote.flows[0].customSkills=[{slug:'custom',markdown:'Complete custom skill'}];
  const merged=JSON.parse(mergeLibraries(base,{'abb:v1':JSON.stringify(local)},{'abb:v1':JSON.stringify(remote)})['abb:v1']);
  assert.equal(merged.kits.length,1);assert.equal(merged.kits[0].name,'Renamed');assert.deepEqual(merged.kits[0].slugs,['writer','new-skill']);
  assert.equal(merged.flows.length,1);assert.equal(merged.flows[0].nodes[0].notes,'Changed exact notes');assert.deepEqual(merged.flows[0].customSkills,remote.flows[0].customSkills);
});

test('offline edits recover their acknowledged baseline and merge other-device additions after restart',async()=>{
  const storage=memoryStorage(),server=transport(),a=new LibrarySync(memoryStorage(),server.send,'a'),b=new LibrarySync(storage,server.send,'old');
  a.connect('alice',async()=>'alice');await tick();a.write('abb:v1',state('Original'));await a.flush();b.connect('alice',async()=>'alice');await tick();
  const local=JSON.parse(b.read('abb:v1'));local.kits.push({id:'offline-new',name:'Offline kit',slugs:[],updated:2});server.offline=true;b.write('abb:v1',JSON.stringify(local));await b.flush();b.connect(null,null);
  server.offline=false;const remote=JSON.parse(a.read('abb:v1'));remote.kits.shift();remote.flows[0].customSkills=[{slug:'custom',markdown:'Other device skill'}];a.write('abb:v1',JSON.stringify(remote));await a.flush();
  const reopened=new LibrarySync(storage,server.send,'new');reopened.connect('alice',async()=>'alice');await tick();await tick();
  assert.equal(reopened.snapshot().status,'saved');const merged=JSON.parse(server.current.data['abb:v1']);assert.deepEqual(merged.kits.map(k=>k.name),['Offline kit']);assert.deepEqual(merged.flows[0].customSkills,remote.flows[0].customSkills);
  a.connect(null,null);reopened.connect(null,null);
});

test('a deletion versus an edit is retained as a conflict rather than restored or silently removed',()=>{
  const base={'abb:v1':state('Original')},local=JSON.parse(base['abb:v1']),remote=JSON.parse(base['abb:v1']);local.kits=[];remote.kits[0].name='Other device edit';
  assert.throws(()=>mergeLibraries(base,{'abb:v1':JSON.stringify(local)},{'abb:v1':JSON.stringify(remote)}),/Both devices/);
  remote.kits[0].name='Original';assert.deepEqual(JSON.parse(mergeLibraries(base,{'abb:v1':JSON.stringify(local)},{'abb:v1':JSON.stringify(remote)})['abb:v1']).kits,[]);
});

test('refresh captures pending editor changes before fetching and again before applying a response',async()=>{
  const server=transport();let hold=false,release;
  const a=new LibrarySync(memoryStorage(),server.send,'a'),b=new LibrarySync(memoryStorage(),async(route,options)=>{
    const response=await server.send(route,options);
    if(hold&&options.method==='GET'){hold=false;await new Promise(resolve=>release=resolve);}return response;
  },'b');
  a.connect('alice',async()=>'alice');b.connect('alice',async()=>'alice');await tick();
  const first=JSON.parse(state('Remote'));first.flows=[];a.write('abb:v1',JSON.stringify(first));await a.flush();
  const local=JSON.parse(state('Pending editor'));local.kits[0].id='pending';local.flows=[];let pending=JSON.stringify(local);
  b.beforeSync(()=>{if(pending){const captured=pending;pending=null;b.write('abb:v1',captured);}});
  await b.syncNow();await tick();await a.syncNow();assert.deepEqual(JSON.parse(a.read('abb:v1')).kits.map(k=>k.name),['Remote','Pending editor']);
  const incoming=JSON.parse(a.read('abb:v1'));incoming.kits[0].slugs.push('remote-added-skill');a.write('abb:v1',JSON.stringify(incoming));await a.flush();
  hold=true;const pulling=b.refresh();await tick();assert.equal(typeof release,'function');
  const typed=JSON.parse(b.read('abb:v1'));typed.kits[1].name='Typed while fetching';pending=JSON.stringify(typed);release();await pulling;await tick();await a.syncNow();
  const merged=JSON.parse(a.read('abb:v1'));assert.deepEqual(merged.kits.map(k=>k.name),['Remote','Typed while fetching']);assert(merged.kits[0].slugs.includes('remote-added-skill'));
  assert.equal(b.snapshot().dirty,false);a.connect(null,null);b.connect(null,null);
});

test('an old dirty cache without a baseline never guesses a merge over newer account data',async()=>{
  const server=transport(),writer=new LibrarySync(memoryStorage(),server.send);writer.connect('alice',async()=>'alice');await tick();writer.write('abb:v1',state('Latest account'));await writer.flush();
  const storage=memoryStorage({'abb:account-library/1:alice:old':JSON.stringify({data:{'abb:v1':state('Unacknowledged old copy')},revision:0,dirty:true,at:1})});
  const resumed=new LibrarySync(storage,server.send,'new');resumed.connect('alice',async()=>'alice');await tick();
  assert.equal(resumed.snapshot().status,'conflict');assert.equal(server.current.data['abb:v1'],state('Latest account'));assert.equal(resumed.read('abb:v1'),state('Unacknowledged old copy'));writer.connect(null,null);resumed.connect(null,null);
});

test('independent workflow reordering and remote note edits both survive a merge',()=>{
  const baseline=JSON.parse(state());baseline.flows[0].nodes.push({id:'n2',slug:'other'},{id:'n3',slug:'last'});
  const local=structuredClone(baseline),remote=structuredClone(baseline);local.flows[0].nodes.reverse();remote.flows[0].nodes[0].notes='Remote exact note';
  const saved=JSON.parse(mergeLibraries({'abb:v1':JSON.stringify(baseline)},{'abb:v1':JSON.stringify(local)},{'abb:v1':JSON.stringify(remote)})['abb:v1']);
  assert.deepEqual(saved.flows[0].nodes.map(n=>n.id),['n3','n2','n']);assert.equal(saved.flows[0].nodes[2].notes,'Remote exact note');
});

test('concurrent additions retain their relative positions without duplicates',()=>{
  const baseline=JSON.parse(state());baseline.kits[0].slugs=['a','b'];
  const local=structuredClone(baseline),remote=structuredClone(baseline);local.kits[0].slugs=['local','a','b'];remote.kits[0].slugs=['a','remote','b'];
  const saved=JSON.parse(mergeLibraries({'abb:v1':JSON.stringify(baseline)},{'abb:v1':JSON.stringify(local)},{'abb:v1':JSON.stringify(remote)})['abb:v1']);
  assert.deepEqual(saved.kits[0].slugs,['local','a','remote','b']);
});
