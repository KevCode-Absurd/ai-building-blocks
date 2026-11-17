const $ = selector => document.querySelector(selector);
const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session = JSON.parse(localStorage.getItem('private-store-session') || 'null');
let catalog, cart, customer, selectedCategory = 'All', noticeTimer, checkoutFlight, checkoutStarting = false;
const save = () => localStorage.setItem('private-store-session', JSON.stringify(session));
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:catalog?.currency || 'INR',maximumFractionDigits:0}).format(n/100);
const key = () => crypto.randomUUID();
async function request(path, method='GET', data, idem) {
  const response = await fetch(path,{method,headers:method==='GET'?{}:{'Content-Type':'application/json',...(idem?{'Idempotency-Key':idem}:{})},body:method==='GET'?undefined:JSON.stringify(data || {})});
  const result = await response.json();
  if (!response.ok) { const error = new Error(result.error); error.status = response.status; throw error; }
  return result;
}
const api = (path, method='GET', data, idem) => request(`/api/datasets/${session.dataset}${path}`, method, data, idem);
const notify = message => { $('#notice').textContent=message; $('#notice').style.display='block'; clearTimeout(noticeTimer); noticeTimer=setTimeout(()=>$('#notice').style.display='none',5000); };
const image = (product, css='') => product.images?.length ? `<img class="${css}" src="${esc(product.images[0])}" alt="${esc(product.title)}">` : '<div class="placeholder" aria-label="Synthetic product illustration">◇</div>';
const findProduct = variantId => catalog.products.find(p=>p.variants.some(v=>v.id===variantId));
// A timeout is not a decline. Keep the exact operation across retry/reload,
// scoped to the original dataset, customer and cart, until its outcome is read back.
function pendingCheckout() {
  const pending = session.pendingCheckout;
  if (!pending) return null;
  if (pending.dataset !== session.dataset || pending.customerId !== session.customer || pending.cartId !== session.cart)
    throw new Error('Pending checkout does not match this test dataset, customer and cart. Restore the original test session before recovering it.');
  return pending;
}
function commitCheckoutSession(next) {
  const encoded = JSON.stringify(next);
  localStorage.setItem('private-store-session', encoded);
  if (localStorage.getItem('private-store-session') !== encoded)
    throw new Error('Checkout recovery state could not be saved. Restore local storage before continuing.');
  session = next; // Publish changes in memory only after the saved snapshot is confirmed.
}
function savePending(pending, changes) {
  if (pendingCheckout() !== pending) throw new Error('Test checkout session changed during recovery.');
  const updated = {...pending, ...changes};
  commitCheckoutSession({...session, pendingCheckout:updated});
  return updated;
}
function clearPending(pending) {
  if (pendingCheckout() !== pending) throw new Error('Test checkout session changed during recovery.');
  const next = {...session}; delete next.pendingCheckout;
  commitCheckoutSession(next);
}
async function resumeCheckout(pending) {
  const scoped = (path, method='GET', data, idem) => {
    if (pendingCheckout() !== pending) throw new Error('Test checkout session changed during recovery.');
    // Recheck persistence before every effect, including retries and reload recovery.
    // A previous failed write must never leave an in-memory-only operation dispatchable.
    if (method !== 'GET') commitCheckoutSession({...session, pendingCheckout:pending});
    return request(`/api/datasets/${pending.dataset}${path}`, method, data, idem);
  };
  if (!pending.payment) {
    let reservation;
    try { reservation = await scoped('/reservations', 'POST', pending.reserve.body, pending.reserve.key); }
    catch (error) {
      // This server atomically rejects these reservation requests before payment.
      if ([400,404,409].includes(error.status)) clearPending(pending);
      throw error;
    }
    pending = savePending(pending, {payment:{key:`pay-${reservation.id}`, body:{reservationId:reservation.id, outcome:pending.outcome}}});
  }
  if (!pending.orderId) {
    let result;
    try { result = await scoped('/payments', 'POST', pending.payment.body, pending.payment.key); }
    catch (error) {
      if (error.status === 409) {
        const reservation = await scoped(`/reservations/${pending.payment.body.reservationId}`);
        const orders = Object.values(await scoped('/orders')).filter(order => order.reservationId === reservation.id && order.customerId === pending.customerId);
        if (orders.length === 1) pending = savePending(pending, {orderId:orders[0].id});
        else if (!orders.length && ['expired','released'].includes(reservation.status)) {
          clearPending(pending);
          return {message:`The earlier test hold ${reservation.status}. No order exists for that attempt. You can start a new attempt.`};
        } else throw error;
      } else throw error;
    }
    if (result) {
      if (result.payment?.outcome === 'declined' && result.order === null) {
        clearPending(pending);
        return {message:'Simulated payment declined. No order was placed; test stock was released. You can try again.'};
      }
      if (!result.order?.id) throw new Error('Test payment outcome is not confirmed. Recover this same attempt before starting another.');
      pending = savePending(pending, {orderId:result.order.id});
    }
  }
  const receipt = await scoped(`/orders/${pending.orderId}/receipt`);
  if (receipt.id !== pending.orderId || receipt.customerId !== pending.customerId || receipt.reservationId !== pending.payment.body.reservationId || !receipt.receiptId)
    throw new Error('Test receipt does not match the pending checkout.');
  clearPending(pending);
  return {orderId:receipt.id};
}
function recoverCheckout(pending) {
  if (!checkoutFlight) checkoutFlight = resumeCheckout(pending).finally(() => { checkoutFlight = null; });
  return checkoutFlight;
}
function recoveryPage(message) {
  return `<div class="page"><h1>Recover your test checkout</h1><p>An earlier submission may have reached the local server. Recover the same attempt before changing the bag or submitting a new one.</p><p role="alert" class="error" id="checkout-error">${esc(message)}</p><button id="recover-checkout">RECOVER SAME ATTEMPT</button><p class="small">Only the local simulated store is contacted. No real money moves.</p></div>`;
}
async function freshDataset() {
  const dataset = await request('/api/datasets','POST'); session={dataset:dataset.id}; save();
  customer=await api('/customers','POST',{email:`visitor-${key().slice(0,8)}@example.test`,sms:'+15550100001',consent:{email:false,sms:false}});
  session.customer=customer.id; cart=await api('/carts','POST',{customerId:customer.id}); session.cart=cart.id; save();
}
async function refresh() {
  [catalog,cart,customer]=await Promise.all([api('/catalog'),api(`/carts/${session.cart}`),api(`/customers/${session.customer}`)]);
  $('#bag-count').textContent=cart.status==='converted'?0:cart.items.reduce((n,i)=>n+i.quantity,0); $('#brand').textContent=catalog.brand; $('#footer-brand').textContent=catalog.brand;
  document.title=`${catalog.brand} · Private test store`;
}
function cards() { return catalog.products.filter(p=>selectedCategory==='All'||p.category===selectedCategory).map(p=>`<a class="product-card" href="#product/${esc(p.id)}">${image(p)}<h3>${esc(p.title)}</h3><p class="price">${money(p.variants[0].price)}</p><p class="muted">Synthetic test price · ${p.variants.some(v=>v.stock>0)?'Test stock available':'Out of test stock'}</p></a>`).join(''); }
function collection() { return `<section class="collection" id="collection"><div class="section-head"><div><span class="eyebrow">The collection</span><h2>Pieces to make your own</h2></div><p class="muted">Real reference designs. Synthetic prices and inventory.</p></div><div class="filters">${['All',...new Set(catalog.products.map(p=>p.category))].map(c=>`<button class="${selectedCategory===c?'selected':''}" data-filter="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="grid">${cards()}</div></section>`; }
function home() { return `<section class="hero"><div class="hero-copy"><span class="eyebrow">A private collection</span><h1>${esc(catalog.tagline)}</h1><p>${esc(catalog.description)}</p><a class="link-button" href="#collection">EXPLORE THE COLLECTION →</a><p class="small">Private test experience · No real orders</p></div>${catalog.hero?`<img src="${esc(catalog.hero)}" alt="Jewellery collection reference">`:image(catalog.products[0])}</section><div class="ribbon"><span>EXPLORE THE DETAILS</span><span>CHOOSE YOUR TEST VARIANT</span><span>TRY A SIMULATED CHECKOUT</span></div>${collection()}`; }
function productPage(productId) {
  const product=catalog.products.find(p=>p.id===productId); if(!product) return '<div class="page"><h1>Product not found</h1></div>';
  return `<div class="page"><p class="breadcrumbs"><a href="#home">Home</a> / <a href="#collection">Collection</a> / ${esc(product.category)}</p><div class="product-detail"><div>${image(product,'main-image')}<div class="thumbs">${(product.images||[]).map((src,i)=>`<button data-image="${esc(src)}" aria-label="View photo ${i+1}"><img src="${esc(src)}" alt="${esc(product.title)} view ${i+1}"></button>`).join('')}</div></div><div><span class="eyebrow">${esc(product.category)}</span><h1>${esc(product.title)}</h1><div class="price-large" id="variant-price">${money(product.variants[0].price)}</div><p class="muted">Synthetic sandbox price · No taxes or shipping charged</p><p>${esc(product.description)}</p><label for="variant">Choose a test variant</label><select id="variant">${product.variants.map(v=>`<option value="${esc(v.id)}">${esc(v.label)}${v.stock?'':' — unavailable'}</option>`).join('')}</select><p id="availability" class="small">${product.variants[0].stock} available in this test dataset</p><button class="wide" id="add-cart" ${product.variants[0].stock?'':'disabled'}>ADD TO TEST BAG</button><span class="badge">Simulated checkout only</span><div class="facts"><h3>Details of this piece</h3><dl>${Object.entries(product.facts||{}).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p class="small muted">Product identity and imagery are reference material. Variant labels, prices and stock are test fixtures. No certification, delivery or offer claim is made.</p></div></div></div></div>`;
}
function cartPage(checkout=false) {
  if(!cart.items.length) return '<div class="page"><h1>Your test bag is waiting</h1><p>Choose a piece to explore the simulated checkout.</p><a class="link-button" href="#collection">Browse the collection →</a></div>';
  const total=cart.items.reduce((n,i)=>n+i.price*i.quantity,0);
  return `<div class="page"><p class="eyebrow">${checkout?'Simulated checkout':'Your collection'}</p><h1>${checkout?'A little closer to yours':'Your test bag'}</h1><div class="checkout-layout"><div>${checkout?`<div class="panel"><h3>Test customer</h3><p class="muted">Only synthetic contact details are accepted.</p><label for="email">Test email</label><input id="email" type="email" value="${esc(customer.email)}" readonly><label for="sms">Test phone</label><input id="sms" type="tel" value="${esc(customer.sms)}" readonly><label><input id="consent-email" type="checkbox" ${customer.consent.email?'checked':''}> I consent to test email messages in the local outbox</label><label><input id="consent-sms" type="checkbox" ${customer.consent.sms?'checked':''}> I consent to test SMS messages in the local outbox</label><p class="small">No real contact, address, card or bank information is collected.</p></div><div class="panel"><h3>Payment simulation</h3><label for="payment-outcome">Choose the test response</label><select id="payment-outcome"><option value="approved">Approved — simulate a successful payment</option><option value="declined">Declined — simulate a payment decline</option></select><p class="small muted">No payment provider is contacted. No money moves.</p><button class="wide" id="pay">PLACE SIMULATED ORDER</button><p role="alert" id="checkout-error" class="error"></p></div>`:cart.items.map(i=>`<div class="cart-row">${image(findProduct(i.variantId))}<div><a href="#product/${esc(i.productId)}">${esc(i.title)}</a><p class="small muted">${esc(i.label)}</p><button data-remove="${esc(i.variantId)}">Remove</button></div><div><label class="small" for="qty-${esc(i.variantId)}">Quantity</label><input id="qty-${esc(i.variantId)}" data-qty="${esc(i.variantId)}" type="number" min="1" max="20" value="${i.quantity}"><p>${money(i.price*i.quantity)}</p></div></div>`).join('')}</div><aside><div class="panel summary"><h3>Your test order</h3>${cart.items.map(i=>`<p class="small">${esc(i.title)} × ${i.quantity}<br>${money(i.price*i.quantity)}</p>`).join('')}<div class="total"><span>Total</span><strong>${money(total)}</strong></div><p class="muted">Synthetic amount · Shipping and tax are not modeled.</p>${checkout?'':`<a class="link-button wide" href="#checkout">CONTINUE TO TEST CHECKOUT →</a>`}<p class="small">Inventory is held for 15 minutes when you submit the simulated order. Declines and expired holds release test stock.</p></div></aside></div></div>`;
}
async function ordersPage(orderId) {
  const orders=await api('/orders'); const list=Object.values(orders).filter(o=>o.customerId===customer.id&&(!orderId||o.id===orderId)).reverse();
  return `<div class="page"><span class="eyebrow">Local server readback</span><h1>${orderId?'Your simulated receipt':'Your test orders'}</h1>${list.length?list.map(o=>`<article class="order-card"><span class="badge">${esc(o.status.toUpperCase())} · SIMULATED</span><h3>${esc(o.id)}</h3><p>${o.items.map(i=>`${esc(i.title)} × ${i.quantity}`).join('<br>')}</p><div class="total"><span>Test total</span><strong>${money(o.total)}</strong></div><p class="small">No payment occurred. No fulfillment will take place.</p><p class="small">${o.stockRestored?'Stock restored to this dataset.':'Test inventory reserved and committed.'}</p>${o.status==='paid'?`<button data-refund="${o.id}">Simulate refund</button><button class="secondary" data-cancel="${o.id}">Cancel test order</button>`:''}<p><a class="small" href="/api/datasets/${session.dataset}/orders/${o.id}/receipt" target="_blank" rel="noopener">Read server receipt JSON ↗</a></p></article>`).join(''):'<p>No test orders yet.</p>'}<a class="link-button" href="#collection">Continue exploring →</a></div>`;
}
async function labPage() {
  const state=await api('/state');
  return `<div class="page"><span class="eyebrow">Private test controls</span><h1>Store test console</h1><p>Provider: <strong>local-store-sandbox</strong>. All messages stay in this outbox. Each new dataset has separate customers, carts, orders and inventory.</p><div class="code">Dataset: ${esc(session.dataset)}<br>Customer: ${esc(customer.id)}<br>Cart: ${esc(cart.id)}<br>State: /api/datasets/${esc(session.dataset)}/state</div><div class="console-grid"><section class="panel"><h3>Contact preferences</h3><label><input id="lab-email" type="checkbox" ${customer.consent.email?'checked':''}> Email consent</label><label><input id="lab-sms" type="checkbox" ${customer.consent.sms?'checked':''}> SMS consent</label><label><input id="lab-unsub-email" type="checkbox" ${customer.unsubscribed.email?'checked':''}> Unsubscribed from email</label><label><input id="lab-unsub-sms" type="checkbox" ${customer.unsubscribed.sms?'checked':''}> Unsubscribed from SMS</label><label><input id="lab-support" type="checkbox" ${customer.openSupport?'checked':''}> Open support case</label><button id="save-preferences">Save preferences</button></section><section class="panel"><h3>Lifecycle flows</h3><p class="small">Edit enabled, channels, delayMs and recentBuyerDays. Changes to delay apply to newly enrolled events.</p><label for="flow-type">Flow</label><select id="flow-type">${Object.keys(state.flows).map(t=>`<option>${t}</option>`).join('')}</select><label for="flow-json">Flow settings (JSON)</label><textarea id="flow-json">${esc(JSON.stringify(state.flows.welcome,null,2))}</textarea><button id="save-flow">Save flow</button></section></div><div class="panel"><h3>Time & delivery simulation</h3><button id="run-flows">Process due messages</button> <button class="secondary" id="advance-hour">Advance 1 hour</button> <button class="secondary" id="advance-day">Advance 1 day</button><p class="muted">The test clock advances only this dataset. Messages are recorded or suppressed locally; nothing is sent.</p><button class="secondary" id="new-dataset">Create a fresh isolated dataset</button><p class="small">The old dataset stays intact for audit and readback.</p></div><h2>Local email / SMS outbox</h2><pre class="code" id="outbox">${esc(JSON.stringify(state.outbox,null,2))}</pre><h2>Server state export</h2><p><a class="link-button" href="/api/datasets/${session.dataset}/state" target="_blank" rel="noopener">OPEN STATE JSON ↗</a></p></div>`;
}
async function newCart() { cart=await api('/carts','POST',{customerId:customer.id});session.cart=cart.id;save(); }
async function render() {
  await refresh(); let route=location.hash.slice(1)||'home', message='';
  try {
    const pending = pendingCheckout();
    if (pending) {
      $('#app').innerHTML='<div class="page"><h1>Recovering your test checkout</h1><p>Checking the original attempt with the local server…</p></div>';
      const result = await recoverCheckout(pending);
      route = result.orderId ? `order/${result.orderId}` : 'checkout';
      history.replaceState(null, '', `#${route}`);
      message = result.message || '';
      await refresh();
    }
  } catch (error) {
    if (session.pendingCheckout) { $('#app').innerHTML=recoveryPage(error.message); bind(); return; }
    route='checkout'; message=error.message;
  }
  if(['cart','checkout'].includes(route)&&cart.status==='converted') await newCart();
  let html;
  if(route==='home') html=home(); else if(route==='collection') html=collection(); else if(route.startsWith('product/')) html=productPage(route.slice(8)); else if(route==='cart'||route==='checkout') html=cartPage(route==='checkout'); else if(route==='orders'||route.startsWith('order/')) html=await ordersPage(route.startsWith('order/')?route.slice(6):null); else if(route==='lab') html=await labPage(); else html='<div class="page"><h1>Page not found</h1><a href="#home">Return home</a></div>';
  $('#app').innerHTML=html; bind();
  if(message && $('#checkout-error')) $('#checkout-error').textContent=message;
}
const action = fn => async event => { try { await fn(event); } catch(error) { notify(error.message); } };
function bind() {
  if($('#recover-checkout')) $('#recover-checkout').onclick=action(async()=>{
    const button=$('#recover-checkout'); button.disabled=true;
    try { await render(); }
    finally { if($('#recover-checkout')===button) button.disabled=false; }
  });
  document.querySelectorAll('[data-filter]').forEach(el=>el.onclick=action(async()=>{selectedCategory=el.dataset.filter;await render()}));
  document.querySelectorAll('[data-image]').forEach(el=>el.onclick=()=>$('.main-image').src=el.dataset.image);
  if($('#variant')) $('#variant').onchange=()=>{const v=catalog.products.flatMap(p=>p.variants).find(v=>v.id===$('#variant').value);$('#variant-price').textContent=money(v.price);$('#availability').textContent=`${v.stock} available in this test dataset`;$('#add-cart').disabled=!v.stock;};
  if($('#add-cart')) $('#add-cart').onclick=action(async()=>{if(cart.status==='converted') await newCart();const variantId=$('#variant').value;const items=cart.items.map(i=>({variantId:i.variantId,quantity:i.quantity}));const old=items.find(i=>i.variantId===variantId);if(old)old.quantity++;else items.push({variantId,quantity:1});cart=await api(`/carts/${cart.id}`,'PATCH',{items});await refresh();notify('Added to your test bag');});
  document.querySelectorAll('[data-remove]').forEach(el=>el.onclick=action(async()=>{await api(`/carts/${cart.id}`,'PATCH',{items:cart.items.filter(i=>i.variantId!==el.dataset.remove).map(({variantId,quantity})=>({variantId,quantity}))});await render()}));
  document.querySelectorAll('[data-qty]').forEach(el=>el.onchange=action(async()=>{await api(`/carts/${cart.id}`,'PATCH',{items:cart.items.map(i=>({variantId:i.variantId,quantity:i.variantId===el.dataset.qty?Number(el.value):i.quantity}))});await render()}));
  if($('#pay')) $('#pay').onclick=action(async()=>{
    if(checkoutStarting) return;
    checkoutStarting=true;
    const button=$('#pay');button.disabled=true;$('#checkout-error').textContent='';
    try {
      const outcome=$('#payment-outcome').value;
      await api(`/customers/${customer.id}`,'PATCH',{consent:{email:$('#consent-email').checked,sms:$('#consent-sms').checked}});
      if (!pendingCheckout()) {
        const pending={dataset:session.dataset,customerId:session.customer,cartId:session.cart,outcome,reserve:{key:`reserve-${key()}`,body:{cartId:session.cart}}};
        commitCheckoutSession({...session,pendingCheckout:pending});
      }
      await render();
    } catch(error) { if($('#checkout-error')) $('#checkout-error').textContent=error.message;button.disabled=false; }
    finally { checkoutStarting=false; }
  });
  for(const verb of ['refund','cancel'])document.querySelectorAll(`[data-${verb}]`).forEach(el=>el.onclick=action(async()=>{await api(`/orders/${el.dataset[verb]}/${verb}`,'POST',{},`${verb}-${el.dataset[verb]}`);await render();notify(`Test order ${verb==='refund'?'refunded':'cancelled'}; stock restored`)}));
  if($('#save-preferences')) $('#save-preferences').onclick=action(async()=>{await api(`/customers/${customer.id}`,'PATCH',{consent:{email:$('#lab-email').checked,sms:$('#lab-sms').checked},unsubscribed:{email:$('#lab-unsub-email').checked,sms:$('#lab-unsub-sms').checked},openSupport:$('#lab-support').checked});await render();notify('Test preferences saved')});
  if($('#flow-type')) $('#flow-type').onchange=action(async()=>{const flows=await api('/flows');$('#flow-json').value=JSON.stringify(flows[$('#flow-type').value],null,2)});
  if($('#save-flow')) $('#save-flow').onclick=action(async()=>{await api(`/flows/${$('#flow-type').value}`,'PATCH',JSON.parse($('#flow-json').value));notify('Flow configuration saved')});
  if($('#run-flows')) $('#run-flows').onclick=action(async()=>{await api('/flows/run','POST');await render();notify('Due messages processed in local outbox')});
  for(const [name,ms] of [['hour',3600000],['day',86400000]])if($(`#advance-${name}`))$(`#advance-${name}`).onclick=action(async()=>{await api('/clock/advance','POST',{ms});await render();notify(`Test clock advanced 1 ${name}`)});
  if($('#new-dataset')) $('#new-dataset').onclick=action(async()=>{await freshDataset();await render();notify('Fresh isolated dataset created')});
}
window.addEventListener('hashchange',action(async()=>{await render();window.scrollTo(0,0)}));
try {
  if(!session) await freshDataset();
  else {
    try { await api('/catalog'); }
    catch(error) {
      // A temporary read failure must not replace a session with an unresolved order.
      if(error.status===404 && !session.pendingCheckout) await freshDataset();
      else throw error;
    }
  }
  await render();
}
catch(error){$('#app').innerHTML=`<div class="page"><h1>Store unavailable</h1><p>${esc(error.message)}</p></div>`;}
