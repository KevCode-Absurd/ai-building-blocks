/* AI Blocks measurement. Public IDs, never credentials. No vendor requests before opt-in. */
(() => {
  'use strict';
  if (window.__aiBlocksAnalytics) return;
  window.__aiBlocksAnalytics = true;
  const GA = 'G-FLLHB8ZGN7';
  const CLARITY = 'z1oj0rgzrv';
  const KEY = 'abb:analytics-consent:v1';
  const MAX_AGE = 180 * 86400000;
  const allowedHost = ['useaiblocks.com', 'www.useaiblocks.com'].includes(location.hostname);
  const optedOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  let running = false, lastPath = '', choice = null, replayStopped = false;
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (stored && ['granted', 'denied'].includes(stored.value) && Date.now() - stored.at < MAX_AGE) choice = stored.value;
  } catch (_) {}
  const publicPath = path => path === '/' || /^\/(skills|prompts|workflows|agents|minds|tools|ai-tools|jobs|apps)(\/[-a-z0-9]+)?\/?$/.test(path) || /^\/(about|support|privacy|cookies|terms|ai-disclaimer|how-it-works|analytics-privacy)(\.html)?\/?$/.test(path);
  // Owner links, search terms, draft input, shared spaces and app routes never reach vendors.
  const safeUrl = url => publicPath(url.pathname) && !url.search && (!url.hash || ['#library', '#main-content'].includes(url.hash));
  const safeHere = () => allowedHost && safeUrl(new URL(location.href));
  const safeReferrer = () => {
    if (!document.referrer) return true;
    try { const ref = new URL(document.referrer); return !ref.search && !ref.hash && (ref.origin !== location.origin || publicPath(ref.pathname)); } catch (_) { return false; }
  };
  // The official tag queues start before downloading its recorder. Gate that
  // command too, so a slow download cannot start on a subsequently private URL.
  function clarityQueue(pending = []) {
    function queued() {
      if (arguments[0] === 'start' && (replayStopped || !safeHere() || !safeReferrer())) return;
      (queued.q = queued.q || []).push(arguments);
    }
    queued.q = pending;
    return queued;
  }
  function stopReplay() {
    if (!window.clarity || replayStopped) return;
    replayStopped = true;
    if (window.clarity.v) window.clarity('stop');
    // stop() replaces the vendor global with a queue. Remove any pending start
    // and keep gating starts if either of the two vendor scripts is still loading.
    const pending = (window.clarity.q || []).filter(args => args[0] !== 'start');
    window.clarity = clarityQueue(pending);
  }
  function gtag() { window.dataLayer.push(arguments); }
  const uxEvents = new Set(['task_started', 'route_accepted', 'request_previewed', 'request_copied', 'pack_download_requested', 'help_opened', 'task_retried', 'result_useful', 'result_needs_work']);
  let taskStartedAt = null;
  document.addEventListener('abb:ux-event', event => {
    // Never forward event.detail objects or arbitrary parameters supplied by app content.
    const name = event.detail;
    if (typeof name !== 'string' || !uxEvents.has(name) || !running || choice !== 'granted' || optedOut || !safeHere()) return;
    if (name === 'task_started') taskStartedAt = Date.now();
    const params = { page_location: location.origin + location.pathname, page_title: location.pathname, page_referrer: '' };
    if (taskStartedAt !== null && ['request_copied', 'pack_download_requested', 'result_useful', 'result_needs_work'].includes(name)) {
      const elapsed = Date.now() - taskStartedAt;
      params.time_bucket = elapsed < 30000 ? 'under_30s' : elapsed < 120000 ? '30s_to_2m' : elapsed < 300000 ? '2m_to_5m' : 'over_5m';
    }
    gtag('event', name, params);
  });
  function pageView() {
    if (!running || !safeHere() || lastPath === location.pathname) return;
    const previous = lastPath;
    lastPath = location.pathname;
    const page = { page_location: location.origin + location.pathname, page_title: location.pathname, page_referrer: previous ? location.origin + previous : '' };
    gtag('config', GA, { ...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    gtag('event', 'page_view', page);
  }
  function start() {
    if (running || choice !== 'granted' || optedOut || !safeHere()) return;
    running = true;
    // Mask all text, form controls and dynamic drawers; heatmaps still show clicks and scrolling.
    document.documentElement.setAttribute('data-clarity-mask', 'true');
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    // Config is queued before loading gtag, with automatic page views disabled.
    pageView();
    const google = document.createElement('script'); google.async = true;
    google.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
    document.head.appendChild(google);
    if (!replayStopped && safeReferrer()) {
      window.clarity = clarityQueue();
      window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
      const clarity = document.createElement('script'); clarity.async = true;
      clarity.src = 'https://www.clarity.ms/tag/' + CLARITY;
      document.head.appendChild(clarity);
    }
  }
  function forgetCookies() {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!/^(_ga(?:_|$)|_gid$|_gat|_clck$|_clsk$)/.test(name)) continue;
      for (const domain of ['', '; domain=' + location.hostname, '; domain=.useaiblocks.com']) {
        document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax; Secure';
      }
    }
  }
  function decide(value) {
    choice = value;
    taskStartedAt = null;
    try { localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() })); } catch (_) {}
    document.getElementById('abb-analytics-choice')?.remove();
    if (value === 'granted') start();
    else {
      if (running) {
        gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        window.clarity?.('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
      }
      forgetCookies();
      if (running) location.reload();
    }
  }
  function preferences() {
    if (document.getElementById('abb-analytics-choice')) return;
    const box = document.createElement('section'); box.id = 'abb-analytics-choice';
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Cookie choices');
    const actions = document.createElement('div'); actions.className = 'abb-analytics-actions';
    for (const [label, value] of [['Reject cookies', 'denied'], ['Accept cookies', 'granted']]) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
      button.disabled = value === 'granted' && optedOut;
      button.addEventListener('click', () => decide(value)); actions.appendChild(button);
    }
    box.appendChild(actions);
    document.body.appendChild(box);
  }
  function boot() {
    if (!allowedHost) return;
    document.addEventListener('abb:cookie-settings', preferences);
    const style = document.createElement('style');
    style.textContent = '#abb-analytics-choice{position:fixed;bottom:56px;left:16px;z-index:2147483000;box-sizing:border-box;width:min(440px,calc(100vw - 32px));max-height:75vh;overflow:auto;background:#151515;color:#f6f6f6;border:1px solid #666;border-radius:12px;padding:20px;box-shadow:0 8px 32px #0006;font:14px/1.5 system-ui,sans-serif}#abb-analytics-choice h2{font-size:18px;margin:0 0 8px}#abb-analytics-choice p{margin:0 0 12px}#abb-analytics-choice a{color:#b6e477;text-decoration:underline}.abb-analytics-actions{display:flex;gap:10px;margin-top:16px}.abb-analytics-actions button,#abb-analytics-settings{font:inherit;cursor:pointer;border:1px solid #888;border-radius:6px;background:#222;color:#fff;padding:10px 12px}.abb-analytics-actions button{flex:1}.abb-analytics-actions button:disabled{opacity:.5;cursor:default}#abb-analytics-settings{position:fixed;bottom:10px;left:12px;z-index:2147482999;font:12px system-ui,sans-serif}#abb-analytics-choice button:focus-visible,#abb-analytics-settings:focus-visible,#abb-analytics-choice a:focus-visible{outline:3px solid #b6e477;outline-offset:3px}';
    document.head.appendChild(style);
    if (!choice && !optedOut && safeHere()) preferences();
    if (optedOut) forgetCookies(); else start();
  }
  // Stop replay before URLs or private app state change. Normal app navigation
  // and typing continue without a reload or loss of focus/drafts.
  document.addEventListener('click', event => {
    if (!running || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]'); if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && !safeUrl(url)) stopReplay();
  }, true);
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (state, unused, target) {
      const url = new URL(target || location.href, location.href);
      if (!safeUrl(url)) taskStartedAt = null;
      if (running && url.origin === location.origin && !safeUrl(url)) stopReplay();
      const result = original.apply(this, arguments);
      if (running) pageView(); else start();
      return result;
    };
  }
  window.addEventListener('popstate', () => {
    if (!safeHere()) taskStartedAt = null;
    if (running && !safeHere()) stopReplay();
    if (running) pageView(); else start();
  });
  window.addEventListener('hashchange', () => { if (running && !safeHere()) stopReplay(); });
  // Stop before even the first keystroke; the search URL often changes while
  // typing, and native input contents must never become recording metadata.
  document.addEventListener('beforeinput', stopReplay, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
