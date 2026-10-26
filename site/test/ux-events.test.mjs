import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { UX_EVENTS, trackUxEvent } from '../src/lib/ux-events.ts';

const script = fs.readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
// Berlin is in a region that is asked first, so nothing is measured until the visitor allows it.
function measurement({ consent = null, path = '/', gpc = false, zone = 'Europe/Berlin' } = {}) {
  const listeners = {}, nodes = new Map(), values = new Map();
  if (consent) values.set('abb:analytics-consent:v2', consent);
  class Element {
    constructor(tag) { this.tag = tag; this.children = []; this.events = {}; }
    appendChild(node) { this.children.push(node); if (node.id) nodes.set(node.id, node); return node; }
    append(...children) { children.forEach(child => this.appendChild(child)); }
    setAttribute() {} addEventListener(name, callback) { this.events[name] = callback; } remove() { nodes.delete(this.id); }
  }
  const document = { readyState: 'complete', referrer: '', cookie: '', head: new Element('head'), body: new Element('body'), documentElement: new Element('html'), createElement: tag => new Element(tag), getElementById: id => nodes.get(id), addEventListener: (name, callback) => { (listeners[name] ??= []).push(callback); } };
  const location = { reload() {} };
  const update = path => Object.assign(location, Object.fromEntries(['href', 'origin', 'hostname', 'pathname', 'search', 'hash'].map(key => [key, new URL(path, 'https://useaiblocks.com')[key]])));
  update(path);
  const window = { addEventListener() {} }, history = { pushState(_a, _b, path) { update(path); }, replaceState(_a, _b, path) { update(path); } };
  vm.runInNewContext(script, { window, document, location, history, navigator: { globalPrivacyControl: gpc }, localStorage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }, Date, URL, URLSearchParams, Intl: { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone: zone }) }) } });
  return { emit: detail => listeners['abb:ux-event'].forEach(fn => fn({ detail })), events: () => Array.from(window.dataLayer || [], args => [...args]).filter(args => args[0] === 'event' && args[1] !== 'page_view'), history, // Withdrawal: the privacy page's "Change your analytics choice" button, then "No thanks" on the banner.
    revoke: () => { listeners.click.forEach(fn => fn({ button: 0, preventDefault() {}, target: { closest: sel => sel.includes('data-analytics-choice') ? {} : null } })); nodes.get('abb-consent').events.click({ target: { closest: () => ({ getAttribute: () => 'denied' }) } }); } };
}
test('UX event transport accepts only fixed names after opt-in', () => {
  for (const consent of [null, 'denied']) { const app = measurement({ consent }); UX_EVENTS.forEach(app.emit); assert.deepEqual(app.events(), []); }
  const app = measurement({ consent: 'granted' });
  app.emit({ name: 'request_copied', text: 'private sample' }); app.emit('private sample');
  assert.deepEqual(app.events(), []);
  app.emit('task_started'); app.emit('request_previewed'); app.emit('request_copied'); app.emit('result_useful');
  assert.deepEqual(app.events().map(event => event[1]), ['task_started', 'request_previewed', 'request_copied', 'result_useful']);
  assert.equal(app.events()[2][2].time_bucket, 'under_30s');
  assert.deepEqual(Object.keys(app.events()[2][2]).sort(), ['page_location', 'page_referrer', 'page_title', 'time_bucket']);
});
test('UX transport excludes private paths, text-bearing URLs, GPC and withdrawal', () => {
  for (const path of ['/compose', '/space', '/s/private-key', '/?q=private-text', '/#build']) {
    const app = measurement({ consent: 'granted', path }); app.emit('request_copied'); assert.deepEqual(app.events(), [], path);
  }
  const app = measurement({ consent: 'granted' }); app.history.pushState(null, '', '/compose'); app.emit('request_copied'); assert.deepEqual(app.events(), []);
  const optedOut = measurement({ consent: 'granted', gpc: true }); optedOut.emit('task_started'); assert.deepEqual(optedOut.events(), []);
  const withdrawn = measurement({ consent: 'granted' }); withdrawn.revoke(); withdrawn.emit('task_started'); assert.deepEqual(withdrawn.events(), []);
  const timed = measurement({ consent: 'granted' }); timed.emit('task_started'); timed.history.pushState(null, '', '/compose'); timed.history.pushState(null, '', '/'); timed.emit('request_copied');
  assert.equal(timed.events().at(-1)[2].time_bucket, undefined, 'Private journeys must not contribute to a public duration bucket.');
});
test('typed helper never forwards arbitrary event objects', () => {
  const previous = globalThis.document, calls = [];
  globalThis.document = { dispatchEvent: event => calls.push(event.detail) };
  try { trackUxEvent('request_copied'); trackUxEvent({ text: 'private sample' }); assert.deepEqual(calls, ['request_copied']); }
  finally { if (previous === undefined) delete globalThis.document; else globalThis.document = previous; }
});
