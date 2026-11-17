import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { Store } from './store.mjs';
import { createServer } from './server.mjs';
const fixture = JSON.parse(fs.readFileSync(new URL('./fixture.json', import.meta.url)));

function setup(t) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'store-sandbox-test-'));
  let store=new Store({seed:fixture,stateDir:dir});const dataset=store.create().id;
  t.after(()=>{store.close();fs.rmSync(dir,{recursive:true,force:true})});
  const tx=(op,p={},key)=>store.transact(dataset,op,p,key);
  const customer=(email='buyer@example.test',consent={email:true,sms:true})=>tx('customer.create',{email,sms:'+15550100001',consent});
  const cart=(c,quantity=1,variantId='ring-12')=>{const cart=tx('cart.create',{customerId:c.id});return tx('cart.update',{id:cart.id,items:[{variantId,quantity}]});};
  const buy=(c,quantity=1)=>{const basket=cart(c,quantity);const hold=tx('reserve',{cartId:basket.id});return tx('payment',{reservationId:hold.id,outcome:'approved'}).order;};
  return {dir,dataset,tx,customer,cart,buy,read:()=>store.read(dataset),restart:()=>{store.close();store=new Store({seed:fixture,stateDir:dir});},store};
}
test('reservations prevent oversell, decline releases and approved checkout is idempotent',t=>{
  const s=setup(t),c=s.customer(),a=s.cart(c,2),b=s.cart(c);
  const hold=s.tx('reserve',{cartId:a.id},'hold-one');assert.equal(s.read().products[0].variants[0].stock,0);
  assert.throws(()=>s.tx('reserve',{cartId:b.id},'hold-two'),/Insufficient stock/);
  assert.deepEqual(s.tx('reserve',{cartId:a.id},'hold-one'),hold);
  assert.throws(()=>s.tx('reserve',{cartId:b.id},'hold-one'),/different request/);
  const declined=s.tx('payment',{reservationId:hold.id,outcome:'declined'},'decline');assert.equal(declined.order,null);assert.equal(s.read().products[0].variants[0].stock,2);
  const next=s.tx('reserve',{cartId:b.id},'hold-three');const payment=s.tx('payment',{reservationId:next.id,outcome:'approved'},'pay');
  assert.deepEqual(s.tx('payment',{reservationId:next.id,outcome:'approved'},'pay'),payment);
  assert.equal(Object.keys(s.read().orders).length,1);assert.equal(s.read().products[0].variants[0].stock,1);
  assert.throws(()=>s.tx('payment',{reservationId:next.id,outcome:'approved'},'pay-again'),/not held/);
});
test('atomic validation rolls back bad multi-item carts and stock; unavailable variants fail',t=>{
  const s=setup(t),c=s.customer(),cart=s.cart(c);const before=s.read();
  assert.throws(()=>s.tx('cart.update',{id:cart.id,items:[{variantId:'ring-12',quantity:2},{variantId:'missing',quantity:1}]}),/not found/);
  assert.deepEqual(s.read(),before);
  const out=s.cart(c,1,'ring-14');assert.throws(()=>s.tx('reserve',{cartId:out.id}),/Insufficient stock/);
  assert.throws(()=>s.tx('cart.update',{id:cart.id,items:[{variantId:'ring-12',quantity:1},{variantId:'ring-12',quantity:1}]}),/duplicate/);
});
test('holds expire and cancellation/refund restore stock exactly once across restart',t=>{
  const s=setup(t),c=s.customer(),cart=s.cart(c,2),hold=s.tx('reserve',{cartId:cart.id});
  s.tx('clock.advance',{ms:900001});assert.equal(s.read().reservations[hold.id].status,'expired');assert.equal(s.read().products[0].variants[0].stock,2);
  assert.throws(()=>s.tx('payment',{reservationId:hold.id,outcome:'approved'}),/not held/);
  const order=s.buy(c);s.restart();assert.equal(s.read().orders[order.id].status,'paid');
  s.tx('order.refund',{id:order.id},'refund');s.tx('order.refund',{id:order.id},'refund-again');s.tx('order.cancel',{id:order.id},'cancel-after-refund');
  assert.equal(s.read().refunds.length,1);assert.equal(s.read().products[0].variants[0].stock,2);
  const second=s.buy(c);s.tx('order.cancel',{id:second.id},'cancel');assert.equal(s.read().orders[second.id].status,'cancelled');assert.equal(s.read().products[0].variants[0].stock,2);
});
test('local flows require channel consent and respect unsubscribe/support exclusions',t=>{
  const s=setup(t),a=s.customer('a@example.test',{email:true,sms:false}),b=s.customer('b@example.test'),c=s.customer('c@example.test');
  s.tx('customer.update',{id:b.id,unsubscribed:{email:true}});s.tx('customer.update',{id:c.id,openSupport:true});
  s.tx('flows.run');const box=s.read().outbox;
  assert.equal(box.find(m=>m.customerId===a.id&&m.channel==='email').status,'recorded');
  assert.equal(box.find(m=>m.customerId===a.id&&m.channel==='sms').reason,'no_consent');
  assert.equal(box.find(m=>m.customerId===b.id&&m.channel==='email').reason,'unsubscribed');
  assert.ok(box.filter(m=>m.customerId===c.id).every(m=>m.reason==='open_support'));
  assert.ok(box.every(m=>m.externalDelivery===false&&m.transport==='local-only'));
  const again=s.tx('flows.run');assert.deepEqual(again,box);
});
test('welcome events are idempotent, delay works, cart updates/conversions and recent buyers suppress',t=>{
  const s=setup(t);s.tx('flows.configure',{type:'welcome',delayMs:60000});const c=s.customer();
  s.tx('event',{id:'external-1',type:'welcome',customerId:c.id,referenceId:c.id});s.tx('event',{id:'external-1',type:'welcome',customerId:c.id,referenceId:c.id});
  assert.equal(s.read().outbox.length,2);s.tx('flows.run');assert.ok(s.read().outbox.every(m=>m.status==='pending'));
  assert.throws(()=>s.tx('event',{id:'external-1',type:'cart_abandoned',customerId:c.id,referenceId:'missing'}),/mismatch/);
  const cart=s.cart(c);s.tx('cart.update',{id:cart.id,items:[{variantId:'ring-12',quantity:2}]});s.tx('clock.advance',{ms:3600001});s.tx('flows.run');
  const old=s.read().outbox.filter(m=>m.eventId===`cart:${cart.id}:1`);assert.ok(old.every(m=>m.reason==='cart_updated'));
  assert.ok(s.read().outbox.filter(m=>m.eventId===`cart:${cart.id}:2`).every(m=>m.status==='recorded'));
  s.buy(c);const later=s.cart(c);s.tx('clock.advance',{ms:3600001});s.tx('flows.run');assert.ok(s.read().outbox.filter(m=>m.referenceId===later.id).every(m=>m.reason==='recent_buyer'));
});
test('post-purchase delay, refunded suppression, channel configuration and dataset isolation',t=>{
  const s=setup(t),c=s.customer(),order=s.buy(c);s.tx('flows.run');assert.ok(s.read().outbox.filter(m=>m.type==='post_purchase').every(m=>m.status==='pending'));
  s.tx('order.refund',{id:order.id});s.tx('clock.advance',{ms:86400001});s.tx('flows.run');assert.ok(s.read().outbox.filter(m=>m.type==='post_purchase').every(m=>m.reason==='order_not_paid'));
  s.tx('flows.configure',{type:'post_purchase',channels:['email'],delayMs:0});const second=s.buy(c);s.tx('flows.run');const messages=s.read().outbox.filter(m=>m.referenceId===second.id);assert.equal(messages.length,1);assert.equal(messages[0].status,'recorded');
  const other=s.store.create().id;assert.equal(Object.keys(s.store.read(other).orders).length,0);assert.equal(s.store.read(other).products[0].variants[0].stock,2);
});
test('synthetic PII constraints and state-directory single-writer protection',t=>{
  const s=setup(t);assert.throws(()=>s.customer('person@real-domain.com'),/synthetic/);assert.throws(()=>s.tx('customer.create',{email:'x@example.test',sms:'+919999999999'}),/synthetic/);
  assert.throws(()=>new Store({seed:fixture,stateDir:s.dir}),/locked/);assert.throws(()=>s.store.read('../../x'),/Invalid dataset/);
});
test('HTTP boundaries, independent readback and concurrent stock competition',async t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'store-sandbox-http-'));const {server}=createServer({seed:fixture,stateDir:dir});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(async()=>{await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true})});
  const base=`http://127.0.0.1:${server.address().port}`;
  const call=async(url,method='GET',data={},headers={})=>{const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json',...headers},body:method==='GET'?undefined:JSON.stringify(data)});return {status:r.status,body:await r.json()};};
  assert.equal((await call('/api/ready')).body.provider,'local-store-sandbox');
  assert.equal((await call('/api/datasets','POST',{}, {Origin:'https://evil.example'})).status,403);
  const wrongHost=await new Promise((resolve,reject)=>{const r=http.get(base+'/api/ready',{headers:{host:'evil.example'}},response=>{response.resume();resolve(response.statusCode)});r.on('error',reject)});assert.equal(wrongHost,403);
  assert.equal((await fetch(base+'/assets/seed.json')).status,404);
  const ds=(await call('/api/datasets','POST')).body.id,prefix=`/api/datasets/${ds}`;
  const c=(await call(prefix+'/customers','POST',{email:'http@example.test'})).body;
  const carts=await Promise.all([1,2].map(async()=>{const b=(await call(prefix+'/carts','POST',{customerId:c.id})).body;await call(prefix+'/carts/'+b.id,'PATCH',{items:[{variantId:'ring-12',quantity:2}]});return b;}));
  assert.equal((await call(prefix+'/reservations','POST',{cartId:carts[0].id})).status,400);
  const holds=await Promise.all(carts.map((c,i)=>call(prefix+'/reservations','POST',{cartId:c.id},{'Idempotency-Key':`hold-${i}`})));
  assert.deepEqual(holds.map(h=>h.status).sort(),[200,409]);const hold=holds.find(h=>h.status===200).body;
  assert.equal((await call(prefix+'/reservations/'+hold.id+'/cancel','POST')).status,400);
  assert.equal((await call(prefix+'/state')).body.reservations[hold.id].status,'held');
  const paid=await call(prefix+'/payments','POST',{reservationId:hold.id,outcome:'approved'},{'Idempotency-Key':'paid'});assert.equal(paid.status,200);
  const receipt=await call(prefix+'/orders/'+paid.body.order.id+'/receipt');assert.equal(receipt.body.total,240000);assert.equal(receipt.body.label,'SIMULATED RECEIPT — NO MONEY MOVED');
  assert.equal((await call(prefix+'/state')).body.products[0].variants[0].stock,0);
});
