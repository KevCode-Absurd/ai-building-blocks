import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const script = fs.readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
function browser({ url = 'https://useaiblocks.com/', referrer = '', consent = 'granted', optedOut = false } = {}) {
  const calls = [], documentEvents = {}, windowEvents = {}, elements = new Map();
  const values = new Map([['abb:kits', 'saved kits']]);
  if (consent) values.set('abb:analytics-consent:v1', JSON.stringify({ value: consent, at: Date.now() }));
  const location = { reload() { calls.push(['reload']); } };
  const setUrl = target => { const u = new URL(target, location.href); Object.assign(location, { href: u.href, origin: u.origin, pathname: u.pathname, search: u.search, hash: u.hash, hostname: u.hostname }); }; setUrl(url);
  const element = tag => ({ tag, setAttribute() {}, appendChild(el) { if (el.id) elements.set(el.id, el); calls.push(['append', tag, el]); }, addEventListener(name, fn) { this[name] = fn; }, remove() { elements.delete(this.id); } });
  const document = { readyState: 'complete', referrer, cookie: '', head: { appendChild(el) { if (el.src) calls.push(['script', el.src]); } }, body: element('body'), documentElement: element('html'), createElement: element, getElementById: id => elements.get(id), addEventListener(name, fn) { documentEvents[name] = fn; } };
  const history = { pushState(_s, _u, target) { setUrl(target); }, replaceState(_s, _u, target) { setUrl(target); } };
  const window = { addEventListener(name, fn) { windowEvents[name] = fn; } };
  const context = { window, document, history, location, URL, URLSearchParams, Date, Set, navigator: { globalPrivacyControl: optedOut }, localStorage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) } };
  vm.runInNewContext(script, context);
  return { ...context, calls, documentEvents, windowEvents, values, elements, interact: () => documentEvents.pointerdown?.({}), events: () => Array.from(window.dataLayer ?? [], args => [...args]), vendors: () => calls.filter(x => x[0] === 'script') };
}
test('latest production measurement configuration retains saved work and denies advertising', () => {
  const b = browser(); b.interact(); assert.equal(b.vendors().length, 2); assert.equal(b.values.get('abb:kits'), 'saved kits');
  const consent = b.events().find(x => x[0] === 'consent' && x[1] === 'default')[2];
  assert.equal(consent.analytics_storage, 'granted'); assert.equal(consent.ad_storage, 'denied');
});
test('seven UTM fields reach GA without replay on query URLs', () => {
  const b = browser({ url: 'https://useaiblocks.com/?utm_source=newsletter&utm_medium=email&utm_campaign=october_launch&utm_id=launch-26&utm_term=ai+skills&utm_content=hero&utm_source_platform=mailchimp#library' });
  assert.equal(b.vendors().length, 1);
  const config = b.events().find(x => x[0] === 'config')[2];
  for (const [key, value] of Object.entries({ campaign_source: 'newsletter', campaign_medium: 'email', campaign_name: 'october_launch', campaign_id: 'launch-26', campaign_term: 'ai skills', campaign_content: 'hero', campaign_source_platform: 'mailchimp' })) assert.equal(config[key], value);
  assert.equal(config.send_page_view, false); assert.equal(config.allow_google_signals, false); assert(!config.page_location.includes('#'));
});
test('unsafe, duplicate and overlong UTM values never reach GA', () => {
  for (const query of ['utm_content=person%40example.test', 'utm_content=https%3A%2F%2Fexample.test%2Fprivate', 'utm_content=1234567890', 'utm_content=' + 'a'.repeat(101), 'utm_content=first&utm_content=second']) {
    const b = browser({ url: 'https://useaiblocks.com/?utm_source=newsletter&' + query });
    const config = b.events().find(x => x[0] === 'config')[2];
    assert.equal(config.campaign_source, 'newsletter'); assert.equal(config.campaign_content, undefined);
    assert.equal(config.page_location, 'https://useaiblocks.com/?utm_source=newsletter');
  }
});
test('private routes and mixed private/campaign queries never load vendors', () => {
  for (const relative of ['/account', '/s/private-key', '/compose?utm_source=email', '/?q=private&utm_source=email', '/?owner=private', '/#build', '/?next=private', '/?workflow=private']) assert.equal(browser({ url: 'https://useaiblocks.com' + relative }).vendors().length, 0, relative);
  assert.equal(browser({ url: 'https://preview.example/' }).vendors().length, 0);
});
test('referral measurement retains only external origins', () => {
  const b = browser({ referrer: 'https://example.test/private/path?email=private@example.test' });
  const page = b.events().find(x => x[0] === 'event' && x[1] === 'page_view')[2];
  assert.equal(page.page_referrer, 'https://example.test/'); assert(!JSON.stringify(b.events()).includes('private')); assert.equal(b.window.clarity, undefined);
});
test('SPA views deduplicate and exclude private transitions', () => {
  const b = browser({ url: 'https://useaiblocks.com/?utm_source=newsletter&utm_medium=email' });
  b.history.pushState(null, '', '/skills/ai-search-audit'); b.history.replaceState(null, '', '/skills/ai-search-audit');
  const n = b.events().filter(x => x[0] === 'event').length;
  b.history.pushState(null, '', '/compose?goal=private'); b.documentEvents['abb:ux-event']({ detail: 'file_download' });
  assert.equal(b.events().filter(x => x[0] === 'event').length, n); assert.equal(b.window['ga-disable-G-FLLHB8ZGN7'], true);
  b.history.pushState(null, '', '/minds'); assert.equal(b.window['ga-disable-G-FLLHB8ZGN7'], false);
  assert.equal(b.events().filter(x => x[0] === 'event' && x[1] === 'page_view').length, 3); assert(!JSON.stringify(b.events()).includes('goal='));
});
test('private SPA URLs stop replay and remove delayed starts', () => {
  const b = browser(); b.interact(); b.window.clarity('start', {}); b.history.replaceState(null, '', '/?q=synthetic-private'); b.window.clarity('start', {});
  assert(!b.window.clarity.q.some(args => args[0] === 'start')); assert.equal(b.window['ga-disable-G-FLLHB8ZGN7'], true); assert(!JSON.stringify(b.events()).includes('synthetic-private'));
});
test('action events accept fixed names and no supplied private parameters', () => {
  const b = browser(); for (const name of ['task_started', 'request_copied', 'file_download']) b.documentEvents['abb:ux-event']({ detail: name });
  b.documentEvents['abb:ux-event']({ detail: { name: 'file_download', email: 'private@example.test' } }); b.documentEvents['abb:ux-event']({ detail: 'private@example.test' });
  assert.equal(b.events().filter(x => x[0] === 'event').length, 4); assert(!JSON.stringify(b.events()).includes('private@example.test'));
});
