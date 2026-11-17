import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from './server.mjs';

const args=Object.fromEntries(process.argv.slice(2).map((x,i,a)=>x.startsWith('--')?[x.slice(2),a[i+1]]:null).filter(Boolean));
if(!args.playwright||!args.output) throw new Error('Usage: node recovery-ui-test.mjs --playwright <package directory> --output <new private evidence directory>');
const output=path.resolve(args.output);
assert.ok(!fs.existsSync(output),'Preserve previous recovery evidence; use a new output directory');
fs.mkdirSync(output,{recursive:true});
const stateDir=fs.mkdtempSync(path.join(output,'state-'));
const {server}=createServer({stateDir});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const {chromium}=createRequire(import.meta.url)(path.resolve(args.playwright));
let browser;
const cases=[];
const write=(name,value)=>fs.writeFileSync(path.join(output,name),JSON.stringify(value,null,2));
try {
  browser=await chromium.launch({channel:'chrome',chromiumSandbox:true,args:['--no-proxy-server']});
  async function setup(name) {
    const context=await browser.newContext({viewport:{width:390,height:844}});
    const page=await context.newPage(), errors=[], external=[], calls=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{
      if(!request.url().startsWith(origin)) external.push(request.url());
      if(request.method()==='POST' && /\/(reservations|payments)$/.test(request.url())) calls.push({url:request.url(),key:request.headers()['idempotency-key'],body:request.postDataJSON()});
    });
    await page.goto(origin); await page.locator('.hero').waitFor();
    const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')));
    const base=`${origin}/api/datasets/${session.dataset}`;
    const get=async suffix=>{const response=await fetch(base+suffix);assert.equal(response.status,200);return response.json();};
    const post=async(suffix,body)=>{const response=await fetch(base+suffix,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(response.status,200);return response.json();};
    const original=await get('/state'),variant=original.products[0].variants[0];
    await page.locator('.product-card').first().click(); await page.locator('#add-cart').click();
    await page.waitForFunction(()=>document.querySelector('#bag-count').textContent==='1');
    await page.locator('.bag').click(); await page.getByText('CONTINUE TO TEST CHECKOUT →').click();
    await page.locator('#pay').waitFor();
    assert.match(await page.locator('.summary').innerText(),/when you submit the simulated order/);
    return {name,context,page,session,base,get,post,variant,errors,external,calls};
  }
  async function dropAccepted(test,endpoint) {
    let dropped=false;
    await test.page.route(`**/${endpoint}`,async route=>{
      if(route.request().method()!=='POST'||dropped) return route.continue();
      dropped=true;
      const pending=await test.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout);
      assert.equal(pending.dataset,test.session.dataset,'Operation must be persisted before request');
      const persisted=endpoint==='reservations'?pending.reserve:pending.payment;
      assert.equal(persisted.key,route.request().headers()['idempotency-key']);
      assert.deepEqual(persisted.body,route.request().postDataJSON());
      const response=await route.fetch();assert.equal(response.status(),200);
      write(test.name+'-dropped-'+endpoint+'.json',await response.json());
      await route.abort('failed');
    });
  }
  async function paid(test,{reservations=1,payments=1}={}) {
    await test.page.getByRole('heading',{name:'Your simulated receipt'}).waitFor();
    const state=await test.get('/state'),orders=Object.values(state.orders);
    assert.equal(orders.length,1);
    assert.equal(Object.keys(state.reservations).length,reservations);
    assert.equal(state.payments.length,payments);
    assert.equal(state.products[0].variants[0].stock,test.variant.stock-1);
    assert.equal(orders[0].total,test.variant.price);
    const receipt=await test.get('/orders/'+orders[0].id+'/receipt');
    assert.equal(receipt.paid,true); assert.equal(receipt.reservationId,orders[0].reservationId);
    assert.equal(await test.page.locator('#bag-count').textContent(),'0');
    assert.equal(await test.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout??null),null);
    assert.deepEqual(test.errors,[]); assert.deepEqual(test.external,[]);
    await test.page.screenshot({path:path.join(output,test.name+'.png'),fullPage:true});
    write(test.name+'-readback.json',{state,receipt,calls:test.calls});
    cases.push({name:test.name,passed:true,dataset:test.session.dataset,orderId:orders[0].id,reservations,payments});
    await test.context.close();
  }

  const reservation=await setup('lost-reservation-response');
  await dropAccepted(reservation,'reservations');
  await reservation.page.locator('#pay').click(); await reservation.page.locator('#recover-checkout').waitFor();
  await reservation.page.screenshot({path:path.join(output,'pending-recovery.png'),fullPage:true});
  let state=await reservation.get('/state');assert.equal(Object.keys(state.orders).length,0);assert.equal(Object.keys(state.reservations).length,1);
  await reservation.page.locator('#recover-checkout').click();
  await paid(reservation);
  const reserves=reservation.calls.filter(c=>c.url.endsWith('/reservations'));
  assert.equal(reserves.length,2);assert.deepEqual(reserves[0],reserves[1]);

  const payment=await setup('lost-approved-response-reload');
  await dropAccepted(payment,'payments');
  await payment.page.locator('#pay').click();await payment.page.locator('#recover-checkout').waitFor();
  state=await payment.get('/state');assert.equal(Object.keys(state.orders).length,1);
  await payment.page.reload();
  await paid(payment);
  const pays=payment.calls.filter(c=>c.url.endsWith('/payments'));
  assert.equal(pays.length,2);assert.deepEqual(pays[0],pays[1]);

  const retryRead=await setup('recovery-refresh-network-failure');
  await dropAccepted(retryRead,'payments');
  await retryRead.page.locator('#pay').click();await retryRead.page.locator('#recover-checkout').waitFor();
  const pendingBeforeRead=await retryRead.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout);
  const callsBeforeRead=retryRead.calls.length;
  let droppedRefresh=false;
  await retryRead.page.route('**/catalog',route=>{if(droppedRefresh)return route.continue();droppedRefresh=true;return route.abort('failed');});
  await retryRead.page.locator('#recover-checkout').click();
  await retryRead.page.locator('#notice').filter({hasText:/fetch/i}).waitFor();
  await retryRead.page.waitForFunction(()=>document.querySelector('#recover-checkout')?.disabled===false);
  assert.equal(retryRead.calls.length,callsBeforeRead,'Failed refresh must not submit another transaction');
  assert.deepEqual(await retryRead.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout),pendingBeforeRead);
  await retryRead.page.locator('#recover-checkout').click();await paid(retryRead);
  const retryPayments=retryRead.calls.filter(c=>c.url.endsWith('/payments'));
  assert.equal(retryPayments.length,2);assert.deepEqual(retryPayments[0],retryPayments[1]);

  const startup=await setup('pending-payment-startup-network-failure');
  await dropAccepted(startup,'payments');
  await startup.page.locator('#pay').click();await startup.page.locator('#recover-checkout').waitFor();
  const startupSession=await startup.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')));
  let lostCatalog=false, replacementDatasets=0;
  startup.page.on('request',request=>{if(request.method()==='POST'&&request.url()===origin+'/api/datasets') replacementDatasets++;});
  await startup.page.route('**/catalog',route=>{if(lostCatalog)return route.continue();lostCatalog=true;return route.abort('failed');});
  await startup.page.reload();await startup.page.getByRole('heading',{name:'Store unavailable'}).waitFor();
  assert.deepEqual(await startup.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session'))),startupSession);
  assert.equal(replacementDatasets,0,'A temporary catalog failure must preserve pending session');
  await startup.page.reload();await paid(startup);

  const receipt=await setup('lost-receipt-readback-reload');
  let lostReceipt=false;
  await receipt.page.route('**/receipt',async route=>{
    if(lostReceipt) return route.continue();
    lostReceipt=true;const response=await route.fetch();assert.equal(response.status(),200);await route.abort('failed');
  });
  await receipt.page.locator('#pay').click();await receipt.page.locator('#recover-checkout').waitFor();
  assert.ok(await receipt.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout.orderId));
  await receipt.page.reload();await paid(receipt);
  assert.equal(receipt.calls.filter(c=>c.url.endsWith('/payments')).length,1,'Receipt recovery does not resubmit payment');

  const decline=await setup('explicit-decline-new-attempt');
  await decline.page.locator('#payment-outcome').selectOption('declined');
  await decline.page.locator('#pay').click();
  await decline.page.locator('#checkout-error').filter({hasText:'Simulated payment declined'}).waitFor();
  state=await decline.get('/state');assert.equal(Object.keys(state.orders).length,0);assert.equal(state.products[0].variants[0].stock,decline.variant.stock);
  assert.equal(await decline.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout??null),null);
  await decline.page.locator('#payment-outcome').selectOption('approved');
  await decline.page.locator('#pay').click();await paid(decline,{reservations:2,payments:2});
  assert.notEqual(decline.calls.filter(c=>c.url.endsWith('/reservations'))[0].key,decline.calls.filter(c=>c.url.endsWith('/reservations'))[1].key);

  const lostDecline=await setup('lost-decline-response');
  await lostDecline.page.locator('#payment-outcome').selectOption('declined');
  await dropAccepted(lostDecline,'payments');
  await lostDecline.page.locator('#pay').click();await lostDecline.page.locator('#recover-checkout').waitFor();
  state=await lostDecline.get('/state');assert.equal(state.payments.length,1);assert.equal(Object.keys(state.orders).length,0);
  await lostDecline.page.locator('#recover-checkout').click();
  await lostDecline.page.locator('#checkout-error').filter({hasText:'Simulated payment declined'}).waitFor();
  const declinedCalls=lostDecline.calls.filter(c=>c.url.endsWith('/payments'));
  assert.equal(declinedCalls.length,2);assert.deepEqual(declinedCalls[0],declinedCalls[1]);
  await lostDecline.page.locator('#payment-outcome').selectOption('approved');await lostDecline.page.locator('#pay').click();
  await paid(lostDecline,{reservations:2,payments:2});

  const expiry=await setup('lost-reservation-expired-hold');
  await dropAccepted(expiry,'reservations');
  await expiry.page.locator('#pay').click();await expiry.page.locator('#recover-checkout').waitFor();
  await expiry.post('/clock/advance',{ms:16*60*1000});
  await expiry.page.reload();
  await expiry.page.locator('#checkout-error').filter({hasText:'earlier test hold expired'}).waitFor();
  state=await expiry.get('/state');assert.equal(state.payments.length,0);assert.equal(Object.keys(state.orders).length,0);assert.equal(state.products[0].variants[0].stock,expiry.variant.stock);
  await expiry.page.locator('#pay').click();await paid(expiry,{reservations:2,payments:1});

  const double=await setup('repeated-submit');
  await double.page.evaluate(()=>{const pay=document.querySelector('#pay');pay.click();pay.click();});
  await paid(double);
  assert.equal(double.calls.filter(c=>c.url.endsWith('/payments')).length,1);

  const source=await setup('scope-source');
  await dropAccepted(source,'payments');await source.page.locator('#pay').click();await source.page.locator('#recover-checkout').waitFor();
  const pending=await source.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout);
  const sourceBefore=await source.get('/state');
  const target=await setup('cross-dataset-and-cart-scope');
  const targetBefore=await target.get('/state');
  await target.page.evaluate(pending=>{const s=JSON.parse(localStorage.getItem('private-store-session'));s.pendingCheckout=pending;localStorage.setItem('private-store-session',JSON.stringify(s));},pending);
  await target.page.reload();await target.page.locator('#checkout-error').filter({hasText:'does not match'}).waitFor();
  await target.page.locator('#recover-checkout').click();await target.page.locator('#checkout-error').filter({hasText:'does not match'}).waitFor();
  assert.deepEqual(await source.get('/state'),sourceBefore);assert.deepEqual(await target.get('/state'),targetBefore);assert.equal(target.calls.length,0);
  write('cross-scope-readbacks.json',{sourceBefore,targetBefore});
  cases.push({name:'cross-dataset-and-cart-scope',passed:true,sourceDataset:source.session.dataset,targetDataset:target.session.dataset,transactionRequests:0});
  await target.context.close();

  const otherCart=await source.post('/carts',{customerId:source.session.customer});
  const beforeCartMismatch=await source.get('/state'),sourceCalls=source.calls.length;
  await source.page.evaluate(cartId=>{const s=JSON.parse(localStorage.getItem('private-store-session'));s.cart=cartId;localStorage.setItem('private-store-session',JSON.stringify(s));},otherCart.id);
  await source.page.reload();await source.page.locator('#checkout-error').filter({hasText:'does not match'}).waitFor();
  assert.equal(source.calls.length,sourceCalls);assert.deepEqual(await source.get('/state'),beforeCartMismatch);
  cases.push({name:'same-dataset-wrong-cart',passed:true,transactionRequests:0});

  const otherCustomer=await source.post('/customers',{email:'other-check@example.test',consent:{email:false,sms:false}});
  const beforeCustomerMismatch=await source.get('/state');
  await source.page.evaluate(({session,pending,otherCustomer})=>localStorage.setItem('private-store-session',JSON.stringify({...session,customer:otherCustomer,pendingCheckout:pending})),{session:source.session,pending,otherCustomer:otherCustomer.id});
  await source.page.reload();await source.page.locator('#checkout-error').filter({hasText:'does not match'}).waitFor();
  assert.equal(source.calls.length,sourceCalls);assert.deepEqual(await source.get('/state'),beforeCustomerMismatch);
  cases.push({name:'same-dataset-wrong-customer',passed:true,transactionRequests:0});
  await source.page.evaluate(({session,pending})=>localStorage.setItem('private-store-session',JSON.stringify({...session,pendingCheckout:pending})),{session:source.session,pending});
  await source.page.reload();source.name='restored-original-scope';await paid(source);

  // Fail real Storage.setItem at selected lifecycle boundaries, not the request helper.
  function injectStorageFault(stage) {
    const original=Storage.prototype.setItem;
    window.__storageFault={stage,blocked:false};
    Storage.prototype.setItem=function(name,value) {
      if(name==='private-store-session') {
        const fault=window.__storageFault, next=JSON.parse(value), previous=JSON.parse(localStorage.getItem(name)||'null');
        const p=next.pendingCheckout;
        const trigger=(fault.stage==='initial'&&p&&!p.payment)||(fault.stage==='payment'&&p?.payment&&!p.orderId)||(fault.stage==='order'&&p?.orderId)||(fault.stage==='clear'&&previous?.pendingCheckout&&!p)||(fault.stage==='all'&&p);
        if(trigger)fault.blocked=true;
        if(fault.blocked)throw new DOMException('Injected pending-session write failure','QuotaExceededError');
      }
      return original.call(this,name,value);
    };
  }
  const allowStorage=test=>test.page.evaluate(()=>{window.__storageFault.stage=null;window.__storageFault.blocked=false;});
  const initialWrite=await setup('initial-pending-write-failure');
  await initialWrite.page.evaluate(injectStorageFault,'initial');
  for(let attempt=0;attempt<3;attempt++) {
    await initialWrite.page.locator('#pay').click();
    await initialWrite.page.locator('#checkout-error').filter({hasText:'Injected pending-session write failure'}).waitFor();
    assert.equal(initialWrite.calls.length,0,'Repeated clicks must not dispatch an unsaved operation');
    assert.equal(await initialWrite.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout??null),null);
  }
  state=await initialWrite.get('/state');assert.equal(Object.keys(state.reservations).length,0);assert.equal(state.payments.length,0);
  write('initial-write-blocked-readback.json',{state,calls:initialWrite.calls});
  await allowStorage(initialWrite);await initialWrite.page.locator('#pay').click();await paid(initialWrite);

  for(const stage of ['payment','order','clear']) {
    const storage=await setup(stage+'-identity-write-failure');
    await storage.page.evaluate(injectStorageFault,stage);
    await storage.page.locator('#pay').click();await storage.page.locator('#recover-checkout').waitFor();
    const before=await storage.get('/state'), callCount=storage.calls.length;
    const savedBefore=await storage.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout);
    assert.ok(savedBefore,'Failed writes/cleanup retain the prior saved recovery state');
    assert.equal(!!savedBefore.payment,stage!=='payment');
    assert.equal(!!savedBefore.orderId,stage==='clear');
    assert.equal(before.payments.length,stage==='payment'?0:1);
    for(let attempt=0;attempt<2;attempt++) {
      await storage.page.locator('#recover-checkout').click();
      await storage.page.locator('#checkout-error').filter({hasText:'Injected pending-session write failure'}).waitFor();
      assert.equal(storage.calls.length,callCount,'No additional transaction while pending writes fail');
      assert.deepEqual(await storage.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout),savedBefore);
    }
    assert.deepEqual(await storage.get('/state'),before);
    write(stage+'-write-blocked-readback.json',{state:before,calls:storage.calls,pending:savedBefore});
    await allowStorage(storage);await storage.page.locator('#recover-checkout').click();await paid(storage);
  }

  const reloadWrite=await setup('reload-pending-write-failure');
  await dropAccepted(reloadWrite,'payments');await reloadWrite.page.locator('#pay').click();await reloadWrite.page.locator('#recover-checkout').waitFor();
  const savedReload=await reloadWrite.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout), reloadCalls=reloadWrite.calls.length;
  await reloadWrite.page.addInitScript(injectStorageFault,'all');
  await reloadWrite.page.reload();await reloadWrite.page.locator('#checkout-error').filter({hasText:'Injected pending-session write failure'}).waitFor();
  assert.equal(reloadWrite.calls.length,reloadCalls,'Reload must not bypass persistence check');
  assert.deepEqual(await reloadWrite.page.evaluate(()=>JSON.parse(localStorage.getItem('private-store-session')).pendingCheckout),savedReload);
  await allowStorage(reloadWrite);await reloadWrite.page.locator('#recover-checkout').click();await paid(reloadWrite);

  write('recovery-result.json',{passed:true,at:new Date().toISOString(),browser:await browser.version(),provider:'isolated-local-store-sandbox',simulated:true,externalPayments:false,externalMessages:false,stateDir,cases});
  console.log(JSON.stringify({passed:true,cases:cases.length,output},null,2));
} catch(error) {
  write('recovery-failure.json',{passed:false,error:error.stack,cases});throw error;
} finally {
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
