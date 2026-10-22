import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script = fs.readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
const key = 'abb:analytics-consent:v1';
function browser({ url = 'https://useaiblocks.com/', consent = null, gpc = false, dnt = null } = {}) {
  const nodes = new Map(), calls = [], windowEvents = {}, documentEvents = {}, values = new Map();
  if (consent) values.set(key, JSON.stringify({ value: consent, at: Date.now() }));
  const location = { assign(target) { calls.push(['assign', target]); }, reload() { calls.push(['reload']); } };
  const setUrl = target => { const u = new URL(target, location.href); Object.assign(location, { href: u.href, origin: u.origin, pathname: u.pathname, search: u.search, hash: u.hash, hostname: u.hostname }); };
  setUrl(url);
  class Element {
    constructor(tag) { this.tagName = tag; this.children = []; this.events = {}; this.attrs = {}; }
    append(...items) { items.forEach(item => this.appendChild(item)); }
    appendChild(item) { this.children.push(item); if (item.id) nodes.set(item.id, item); if (item.tagName === 'script') calls.push(['script', item.src]); return item; }
    setAttribute(name, value) { this.attrs[name] = value; }
    addEventListener(name, fn) { this.events[name] = fn; }
    remove() { nodes.delete(this.id); }
  }
  const document = { readyState: 'complete', cookie: '_ga=synthetic; _clck=synthetic', head: new Element('head'), body: new Element('body'), documentElement: new Element('html'), createElement: tag => new Element(tag), getElementById: id => nodes.get(id), addEventListener: (name, fn) => { documentEvents[name] = fn; } };
  const history = { pushState(_s, _u, target) { setUrl(target); }, replaceState(_s, _u, target) { setUrl(target); } };
  const window = { addEventListener: (name, fn) => { windowEvents[name] = fn; } };
  const context = { window, document, location, history, navigator: { globalPrivacyControl: gpc, doNotTrack: dnt }, localStorage: { getItem: name => values.get(name), setItem: (name, value) => values.set(name, value) }, URL, Date };
  vm.runInNewContext(script, context);
  const clickChoice = label => { const node = nodes.get('abb-analytics-choice'); assert(node, 'consent choices visible'); const button = node.children.find(x => x.className === 'abb-analytics-actions').children.find(x => x.textContent === label); assert(button && !button.disabled); button.events.click(); };
  const vendors = () => calls.filter(c => c[0] === 'script');
  const events = () => (window.dataLayer || []).map(args => [...args]);
  return { ...context, calls, nodes, vendors, events, clickChoice, documentEvents, windowEvents, values };
}

test('no vendor requests before consent or after a saved decline', () => {
  const fresh = browser(); assert.equal(fresh.vendors().length, 0); assert(fresh.nodes.has('abb-analytics-choice'));
  fresh.clickChoice('Reject cookies'); assert.equal(fresh.vendors().length, 0); assert.equal(JSON.parse(fresh.values.get(key)).value, 'denied');
  assert.equal(browser({ consent: 'denied' }).vendors().length, 0);
});
test('opt-in loads exactly the intended vendors, masks all text and denies advertising', () => {
  const b = browser(); b.clickChoice('Accept cookies');
  assert.deepEqual(b.vendors().map(c => c[1]), ['https://www.googletagmanager.com/gtag/js?id=G-FLLHB8ZGN7', 'https://www.clarity.ms/tag/z1oj0rgzrv']);
  assert.equal(b.document.documentElement.attrs['data-clarity-mask'], 'true');
  const page = b.events().find(args => args[0] === 'event' && args[1] === 'page_view')[2];
  assert.equal(page.page_location, 'https://useaiblocks.com/'); assert.equal(page.page_referrer, '');
  const config = b.events().find(args => args[0] === 'config')[2]; assert.equal(config.send_page_view, false); assert.equal(config.allow_google_signals, false);
  const consent = b.events().find(args => args[0] === 'consent' && args[1] === 'update')[2]; assert.equal(consent.ad_storage, 'denied'); assert.equal(consent.ad_user_data, 'denied');
});
test('private, query-bearing and builder URLs never load vendors even with saved consent', () => {
  for (const path of ['/space', '/s/synthetic-share-key', '/compose', '/from-a-source', '/example-app/', '/?owner=synthetic-owner-key', '/?q=synthetic-private-input', '/#build', '/#synthetic-owner-key', '/tools/growth-channel-planner?goal=synthetic']) {
    const b = browser({ url: 'https://useaiblocks.com' + path, consent: 'granted' }); assert.equal(b.vendors().length, 0, path);
  }
  assert.equal(browser({ url: 'https://preview.example/', consent: 'granted' }).vendors().length, 0);
});
test('SPA page views are deduplicated, private transitions stop replay without reloading', () => {
  const b = browser({ consent: 'granted' });
  b.history.pushState(null, '', '/skills/ad-angle-multiplier'); b.history.replaceState(null, '', '/skills/ad-angle-multiplier');
  const views = b.events().filter(args => args[0] === 'event' && args[1] === 'page_view'); assert.equal(views.length, 2);
  assert.equal(views[1][2].page_location, 'https://useaiblocks.com/skills/ad-angle-multiplier');
  b.window.clarity('start', { projectId: 'z1oj0rgzrv' });
  b.history.pushState(null, '', '/s/synthetic-private-key'); assert.equal(b.location.pathname, '/s/synthetic-private-key');
  assert.equal(b.calls.some(c => c[0] === 'assign' || c[0] === 'reload'), false);
  assert.equal(b.events().filter(args => args[0] === 'event').length, 2);
  assert.equal(b.window.clarity.q.some(args => args[0] === 'start'), false);
});
test('private link navigation stops replay while preserving the normal SPA click', () => {
  const b = browser({ consent: 'granted' }); let blocked = 0;
  b.documentEvents.click({ button: 0, target: { closest: () => ({ href: 'https://useaiblocks.com/compose', target: '', hasAttribute: () => false }) }, preventDefault() { blocked++; }, stopImmediatePropagation() { blocked++; } });
  assert.equal(blocked, 0); assert.equal(b.calls.some(c => c[0] === 'assign'), false);
  b.window.clarity('start', {}); assert.equal(b.window.clarity.q.some(args => args[0] === 'start'), false);
});
test('search typing stops active replay before history changes without losing focus or reloading', () => {
  const b = browser({ consent: 'granted' }); const commands = [];
  b.window.clarity = (method) => {
    commands.push([method, b.location.href]);
    if (method === 'stop') { b.window.clarity = function () { (b.window.clarity.q ||= []).push(arguments); }; }
  };
  b.window.clarity.v = 'synthetic-vendor';
  b.documentEvents.beforeinput();
  b.history.replaceState(null, '', '/?q=synthetic-private-search');
  assert.deepEqual(commands, [['stop', 'https://useaiblocks.com/']]);
  assert.equal(b.location.search, '?q=synthetic-private-search');
  assert.equal(b.calls.some(c => c[0] === 'reload' || c[0] === 'assign'), false);
  b.window.clarity('start', {}); assert.equal(b.window.clarity.q.some(args => args[0] === 'start'), false);
});
test('a late vendor download cannot queue start after entering a private flow', () => {
  const b = browser({ consent: 'granted' });
  b.history.pushState(null, '', '/compose');
  // Emulate the official tag arriving after the user has navigated away.
  b.window.clarity('metadata', () => {}); b.window.clarity('start', { projectId: 'z1oj0rgzrv' });
  b.window.clarity.q.unshift(b.window.clarity.q.pop());
  assert.equal(b.window.clarity.q.some(args => args[0] === 'start'), false);
});
test('revocation persists denial, signals both vendors and reloads', () => {
  const b = browser({ consent: 'granted' }); b.nodes.get('abb-analytics-settings').events.click(); b.clickChoice('Reject cookies');
  assert.equal(JSON.parse(b.values.get(key)).value, 'denied'); assert.equal(b.calls.at(-1)[0], 'reload');
  const updates = b.events().filter(args => args[0] === 'consent' && args[1] === 'update'); assert.equal(updates.at(-1)[2].analytics_storage, 'denied');
  assert.equal([...b.window.clarity.q.at(-1)][1].analytics_Storage, 'denied');
});
test('GPC and Do Not Track override stored opt-in', () => {
  for (const options of [{ gpc: true }, { dnt: '1' }]) { const b = browser({ consent: 'granted', ...options }); assert.equal(b.vendors().length, 0); }
});
