import fs from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';

export class StoreError extends Error { constructor(status, message) { super(message); this.status = status; } }
const check = (condition, message, status = 400) => { if (!condition) throw new StoreError(status, message); };
const clone = value => structuredClone(value);
const id = prefix => `${prefix}_${randomUUID()}`;
const own = (object, key) => Object.hasOwn(object, key) ? object[key] : undefined;
const integer = (n, min, max) => Number.isSafeInteger(n) && n >= min && n <= max;
const defaults = () => ({ welcome: { enabled: true, channels: ['email','sms'], delayMs: 0, recentBuyerDays: 7 }, cart_abandoned: { enabled: true, channels: ['email','sms'], delayMs: 3600000, recentBuyerDays: 7 }, post_purchase: { enabled: true, channels: ['email','sms'], delayMs: 86400000, recentBuyerDays: 0 } });

// A single process owns this directory. All domain transactions are synchronous;
// atomic file replacement completes before a successful HTTP response is returned.
export class Store {
  constructor({ seed, stateDir }) {
    this.seed = clone(seed); this.stateDir = path.resolve(stateDir);
    check(Array.isArray(seed.products) && seed.products.length, 'Seed needs products');
    const seen = new Set();
    for (const product of seed.products) for (const variant of product.variants) {
      check(!seen.has(variant.id) && integer(variant.price, 1, 1000000000) && integer(variant.stock, 0, 1000000), 'Invalid or duplicate seed variant'); seen.add(variant.id);
    }
    fs.mkdirSync(this.stateDir, { recursive: true });
    this.lockPath = path.join(this.stateDir, 'server.lock');
    try { this.lock = fs.openSync(this.lockPath, 'wx'); fs.writeFileSync(this.lock, String(process.pid)); }
    catch { throw new Error(`State directory is locked: ${this.lockPath}. Stop its owner before removing a stale lock.`); }
  }
  close() { if (this.lock !== undefined) { fs.closeSync(this.lock); fs.unlinkSync(this.lockPath); this.lock = undefined; } }
  filename(dataset) { check(/^ds_[a-f0-9-]{36}$/.test(dataset), 'Invalid dataset', 404); return path.join(this.stateDir, `${dataset}.json`); }
  read(dataset) { const filename = this.filename(dataset); check(fs.existsSync(filename), 'Dataset not found', 404); const state = JSON.parse(fs.readFileSync(filename, 'utf8')); const before = state.audit.length; this.expire(state); if (before !== state.audit.length) { state.revision++; this.save(state); } return state; }
  save(state) { const target = this.filename(state.id); const temp = `${target}.tmp`; fs.writeFileSync(temp, JSON.stringify(state, null, 2)); fs.renameSync(temp, target); }
  create() {
    const state = { id: id('ds'), provider: 'local-store-sandbox', simulated: true, createdAt: Date.now(), offsetMs: 0, revision: 0, products: clone(this.seed.products), customers: {}, carts: {}, reservations: {}, orders: {}, payments: [], refunds: [], events: {}, outbox: [], idempotency: {}, flows: defaults(), audit: [] };
    this.save(state); return { id: state.id, provider: state.provider, simulated: true };
  }
  now(state) { return Date.now() + state.offsetMs; }
  catalog(state) { return { brand: this.seed.brand, tagline: this.seed.tagline, description: this.seed.description, hero: this.seed.hero, logo: this.seed.logo, currency: this.seed.currency || 'INR', products: state.products, simulated: true }; }
  variant(state, variantId) { for (const product of state.products) { const variant = product.variants.find(v => v.id === variantId); if (variant) return { product, variant }; } throw new StoreError(404, 'Variant not found'); }
  customer(state, customerId) { const customer = own(state.customers, customerId); check(customer, 'Customer not found', 404); return customer; }
  cart(state, cartId) { const cart = own(state.carts, cartId); check(cart, 'Cart not found', 404); return cart; }
  audit(state, action, entityId) { state.audit.push({ at: this.now(state), action, entityId }); }
  release(state, reservation) {
    if (reservation.status !== 'held') return;
    for (const item of reservation.items) this.variant(state, item.variantId).variant.stock += item.quantity;
    reservation.status = 'released'; this.audit(state, 'inventory_released', reservation.id);
  }
  expire(state) { for (const reservation of Object.values(state.reservations)) if (reservation.status === 'held' && reservation.expiresAt <= this.now(state)) { this.release(state, reservation); reservation.status = 'expired'; } }
  emit(state, eventId, type, customerId, referenceId) {
    if (own(state.events, eventId)) return own(state.events, eventId);
    const event = { id: eventId, type, customerId, referenceId, at: this.now(state) }; state.events[eventId] = event;
    const flow = state.flows[type];
    for (const channel of flow.channels) state.outbox.push({ id: id('msg'), eventId, type, channel, customerId, referenceId, status: 'pending', dueAt: event.at + flow.delayMs, transport: 'local-only', externalDelivery: false });
    return event;
  }
  runFlows(state) {
    for (const message of state.outbox) {
      if (message.status !== 'pending' || message.dueAt > this.now(state)) continue;
      const customer = this.customer(state, message.customerId), flow = state.flows[message.type];
      let reason = !flow.enabled ? 'flow_disabled' : !flow.channels.includes(message.channel) ? 'channel_disabled' : customer.unsubscribed[message.channel] ? 'unsubscribed' : !customer.consent[message.channel] ? 'no_consent' : !customer[message.channel] ? 'no_destination' : customer.openSupport ? 'open_support' : null;
      if (!reason && message.type !== 'post_purchase' && customer.lastPurchaseAt != null && this.now(state) - customer.lastPurchaseAt < flow.recentBuyerDays * 86400000) reason = 'recent_buyer';
      if (!reason && message.type === 'cart_abandoned') {
        const cart = own(state.carts, message.referenceId), event = state.events[message.eventId];
        if (!cart || cart.status === 'converted') reason = 'cart_converted';
        else if (!cart.items.length) reason = 'cart_empty';
        else if (cart.version !== event.cartVersion) reason = 'cart_updated';
      }
      if (!reason && message.type === 'post_purchase' && own(state.orders, message.referenceId)?.status !== 'paid') reason = 'order_not_paid';
      message.status = reason ? 'suppressed' : 'recorded'; message.reason = reason; message.processedAt = this.now(state);
      if (!reason) {
        message.destination = customer[message.channel];
        message.subject = { welcome: 'Welcome to your test collection', cart_abandoned: 'Your test collection is waiting', post_purchase: 'Thank you for your simulated order' }[message.type];
        message.body = `PRIVATE STORE TEST — ${message.subject}. No purchase or message delivery occurred. Reference: ${message.referenceId || customer.id}.`;
        message.unsubscribePath = `/api/datasets/${state.id}/customers/${customer.id}`;
      }
    }
    return state.outbox;
  }
  // Transactions mutate an in-memory copy, so validation errors cannot leave partial stock changes.
  transact(dataset, operation, payload = {}, key) {
    const state = this.read(dataset); this.expire(state);
    const fingerprint = createHash('sha256').update(JSON.stringify({ operation, payload })).digest('hex');
    if (key) {
      check(typeof key === 'string' && /^[a-zA-Z0-9:_-]{1,120}$/.test(key) && !['__proto__','constructor','prototype'].includes(key), 'Invalid idempotency key');
      const previous = own(state.idempotency, key);
      if (previous) { check(previous.fingerprint === fingerprint, 'Idempotency key reused with different request', 409); return clone(previous.result); }
    }
    const result = this.apply(state, operation, payload);
    state.revision++; this.audit(state, operation, result?.id || dataset);
    if (key) state.idempotency[key] = { fingerprint, result: clone(result) };
    this.save(state); return clone(result);
  }
  apply(state, operation, p) {
    if (operation === 'snapshot') return state;
    if (operation === 'customer.create') {
      check(typeof p.email === 'string' && /^[a-z0-9._+-]+@example\.test$/i.test(p.email), 'Use a synthetic @example.test email');
      check(!p.sms || /^\+1555010\d{4}$/.test(p.sms), 'Use a synthetic +1555010XXXX phone');
      check(!Object.values(state.customers).some(c => c.email === p.email.toLowerCase()), 'Synthetic email already exists', 409);
      const customer = { id: id('customer'), name: 'Test customer', email: p.email.toLowerCase(), sms: p.sms || '', consent: { email: p.consent?.email === true, sms: p.consent?.sms === true }, unsubscribed: { email: false, sms: false }, openSupport: false, lastPurchaseAt: null };
      state.customers[customer.id] = customer; this.emit(state, `welcome:${customer.id}`, 'welcome', customer.id, customer.id); return customer;
    }
    if (operation === 'customer.update') {
      const customer = this.customer(state, p.id);
      for (const field of ['consent','unsubscribed']) if (p[field]) for (const channel of ['email','sms']) if (p[field][channel] !== undefined) { check(typeof p[field][channel] === 'boolean', 'Consent must be boolean'); customer[field][channel] = p[field][channel]; }
      if (p.openSupport !== undefined) { check(typeof p.openSupport === 'boolean', 'openSupport must be boolean'); customer.openSupport = p.openSupport; }
      return customer;
    }
    if (operation === 'cart.create') { this.customer(state, p.customerId); const cart = { id: id('cart'), customerId: p.customerId, items: [], status: 'active', updatedAt: this.now(state), version: 0 }; state.carts[cart.id] = cart; return cart; }
    if (operation === 'cart.update') {
      const cart = this.cart(state, p.id); check(cart.status === 'active', 'Cart is already converted', 409);
      check(!Object.values(state.reservations).some(r => r.cartId === cart.id && r.status === 'held'), 'Cart has an active checkout reservation', 409);
      check(Array.isArray(p.items) && p.items.length <= 30, 'Invalid cart items');
      const seen = new Set();
      cart.items = p.items.map(item => { check(!seen.has(item.variantId) && integer(item.quantity, 1, 20), 'Invalid or duplicate cart item'); seen.add(item.variantId); const { product, variant } = this.variant(state, item.variantId); return { variantId: variant.id, productId: product.id, title: product.title, label: variant.label, quantity: item.quantity, price: variant.price }; });
      cart.version++; cart.updatedAt = this.now(state);
      const event = this.emit(state, `cart:${cart.id}:${cart.version}`, 'cart_abandoned', cart.customerId, cart.id); event.cartUpdatedAt = cart.updatedAt; event.cartVersion = cart.version;
      return cart;
    }
    if (operation === 'reserve') {
      const cart = this.cart(state, p.cartId); check(cart.status === 'active' && cart.items.length, 'Cart must contain items and be active', 409);
      check(!Object.values(state.reservations).some(r => r.cartId === cart.id && r.status === 'held'), 'Cart already reserved', 409);
      for (const item of cart.items) check(this.variant(state, item.variantId).variant.stock >= item.quantity, `Insufficient stock: ${item.variantId}`, 409);
      for (const item of cart.items) this.variant(state, item.variantId).variant.stock -= item.quantity;
      const reservation = { id: id('reservation'), cartId: cart.id, customerId: cart.customerId, items: clone(cart.items), total: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0), status: 'held', expiresAt: this.now(state) + 900000 };
      state.reservations[reservation.id] = reservation; return reservation;
    }
    if (operation === 'payment') {
      check(['approved','declined'].includes(p.outcome), 'Payment outcome must be approved or declined');
      const reservation = own(state.reservations, p.reservationId); check(reservation, 'Reservation not found', 404); check(reservation.status === 'held', 'Reservation is not held', 409);
      const payment = { id: id('payment'), reservationId: reservation.id, outcome: p.outcome, amount: reservation.total, provider: 'local-simulated-payment', at: this.now(state), simulated: true }; state.payments.push(payment);
      if (p.outcome === 'declined') { this.release(state, reservation); return { payment, order: null }; }
      reservation.status = 'committed'; const cart = this.cart(state, reservation.cartId); cart.status = 'converted';
      const order = { id: id('order'), customerId: reservation.customerId, reservationId: reservation.id, paymentId: payment.id, items: clone(reservation.items), total: reservation.total, currency: this.seed.currency || 'INR', status: 'paid', stockRestored: false, createdAt: this.now(state), simulated: true, fulfillment: 'not-shipped-test-only' };
      state.orders[order.id] = order; this.customer(state, order.customerId).lastPurchaseAt = order.createdAt;
      this.emit(state, `purchase:${order.id}`, 'post_purchase', order.customerId, order.id); return { payment, order };
    }
    if (operation === 'reservation.cancel') { const reservation = own(state.reservations, p.id); check(reservation, 'Reservation not found', 404); check(['held','released','expired'].includes(reservation.status), 'Committed reservation requires order refund', 409); this.release(state, reservation); return reservation; }
    if (operation === 'order.refund' || operation === 'order.cancel') {
      const order = own(state.orders, p.id); check(order, 'Order not found', 404);
      if (['refunded','cancelled'].includes(order.status)) return order;
      check(order.status === 'paid', 'Order is not refundable', 409);
      for (const item of order.items) this.variant(state, item.variantId).variant.stock += item.quantity;
      order.stockRestored = true; order.status = operation === 'order.cancel' ? 'cancelled' : 'refunded'; order.refundedAt = this.now(state);
      state.refunds.push({ id: id('refund'), orderId: order.id, amount: order.total, provider: 'local-simulated-payment', simulated: true, at: this.now(state) }); return order;
    }
    if (operation === 'flows.configure') {
      check(own(state.flows, p.type), 'Unknown flow'); const flow = state.flows[p.type];
      if (p.enabled !== undefined) { check(typeof p.enabled === 'boolean', 'enabled must be boolean'); flow.enabled = p.enabled; }
      if (p.channels !== undefined) { check(Array.isArray(p.channels) && p.channels.length <= 2 && p.channels.every(c => ['email','sms'].includes(c)) && new Set(p.channels).size === p.channels.length, 'Invalid channels'); flow.channels = p.channels; }
      if (p.delayMs !== undefined) { check(integer(p.delayMs, 0, 2592000000), 'Invalid delayMs'); flow.delayMs = p.delayMs; }
      if (p.recentBuyerDays !== undefined) { check(integer(p.recentBuyerDays, 0, 365), 'Invalid recentBuyerDays'); flow.recentBuyerDays = p.recentBuyerDays; }
      return state.flows;
    }
    if (operation === 'flows.run') return this.runFlows(state);
    if (operation === 'clock.advance') { check(integer(p.ms, 0, 31536000000), 'Invalid time advance'); state.offsetMs += p.ms; this.expire(state); return { now: this.now(state), offsetMs: state.offsetMs }; }
    if (operation === 'event') {
      check(typeof p.id === 'string' && /^[a-zA-Z0-9:_-]{1,120}$/.test(p.id) && !['__proto__','constructor','prototype'].includes(p.id), 'Invalid event id');
      this.customer(state, p.customerId); check(own(state.flows, p.type), 'Unknown event type');
      if (p.type === 'welcome') check(p.referenceId === p.customerId, 'Welcome reference must be customer id');
      if (p.type === 'post_purchase') check(own(state.orders, p.referenceId)?.customerId === p.customerId, 'Order/customer mismatch');
      if (p.type === 'cart_abandoned') check(own(state.carts, p.referenceId)?.customerId === p.customerId, 'Cart/customer mismatch');
      const previous = own(state.events, p.id);
      if (previous) { check(previous.type === p.type && previous.customerId === p.customerId && previous.referenceId === p.referenceId, 'Event id payload conflict', 409); return previous; }
      // Canonical event IDs prevent duplicate triggers with different caller IDs.
      const canonical = Object.values(state.events).find(e => e.type === p.type && e.customerId === p.customerId && e.referenceId === p.referenceId && (p.type !== 'cart_abandoned' || e.cartVersion === state.carts[p.referenceId].version));
      if (canonical) { state.events[p.id] = { ...clone(canonical), id:p.id, canonicalId:canonical.id }; return state.events[p.id]; }
      const event = this.emit(state, p.id, p.type, p.customerId, p.referenceId);
      if (p.type === 'cart_abandoned') { event.cartUpdatedAt = state.carts[p.referenceId].updatedAt; event.cartVersion = state.carts[p.referenceId].version; }
      return event;
    }
    throw new StoreError(404, 'Unknown operation');
  }
}
