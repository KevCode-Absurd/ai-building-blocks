/* AI Blocks measurement. Public IDs, never credentials. Cookie-based public-site measurement.
   Visitors in the EU, EEA, UK and Switzerland are asked first; everyone else is measured from the first page. */
(() => {
  'use strict';
  if (window.__aiBlocksAnalytics) return;
  window.__aiBlocksAnalytics = true;
  const GA = 'G-FLLHB8ZGN7';
  const CLARITY = 'z1oj0rgzrv';
  const allowedHost = ['useaiblocks.com', 'www.useaiblocks.com'].includes(location.hostname);
  let running = false, lastPath = '', replayStopped = false;
  // Region comes from the browser's time zone, so no request leaves the page to find it.
  // It errs towards asking: every Europe/ zone and the EU's outermost regions count.
  const CONSENT_KEY = 'abb:analytics-consent:v2';
  const askFirst = (() => {
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return /^(Europe|Arctic)\//.test(zone) || /^Atlantic\/(Azores|Canary|Madeira|Reykjavik|Faroe)$/.test(zone) || /^(America\/(Guadeloupe|Martinique|Cayenne|St_Barthelemy|Marigot)|Indian\/(Reunion|Mayotte))$/.test(zone);
    } catch (_) { return true; }
  })();
  const choice = () => { try { return localStorage.getItem(CONSENT_KEY) || ''; } catch (_) { return ''; } };
  // A browser's Global Privacy Control signal is a no everywhere.
  const gpc = typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true;
  // Anyone can say no from the analytics page; only the regions above must say yes first.
  const allowed = () => !gpc && (choice() === 'granted' || (!askFirst && choice() !== 'denied'));
  const publicPath = path => path === '/' || /^\/(skills|prompts|workflows|agents|minds|tools|ai-tools|jobs|apps)(\/[-a-z0-9]+)?\/?$/.test(path) || /^\/(about|support|privacy|cookies|terms|ai-disclaimer|how-it-works|analytics-privacy)(\.html)?\/?$/.test(path);
  // Owner links, search terms, draft input, shared spaces and app routes never reach vendors.
  const campaignFields = { utm_source: 'campaign_source', utm_medium: 'campaign_medium', utm_campaign: 'campaign_name', utm_id: 'campaign_id', utm_term: 'campaign_term', utm_content: 'campaign_content', utm_source_platform: 'campaign_source_platform' };
  // Query strings are never forwarded wholesale. Only short campaign labels
  // survive; addresses, URLs, phone-like values, duplicates and arbitrary keys do not.
  const campaignValue = value => typeof value === 'string' && /^[\p{L}\p{N}][\p{L}\p{N} _.-]{0,99}$/u.test(value) && !/\d{7,}/.test(value) ? value : '';
  const campaignParams = url => {
    const params = new URLSearchParams();
    for (const key of Object.keys(campaignFields)) {
      const values = url.searchParams.getAll(key);
      const value = values.length === 1 ? campaignValue(values[0]) : '';
      if (value) params.set(key, value);
    }
    return params;
  };
  const safeUrl = url => publicPath(url.pathname) && [...url.searchParams.keys()].every(key => Object.hasOwn(campaignFields, key)) && (!url.hash || ['#library', '#main-content'].includes(url.hash));
  const measuredUrl = () => {
    const params = campaignParams(new URL(location.href));
    return location.origin + location.pathname + (params.size ? '?' + params.toString() : '');
  };
  const campaign = Object.fromEntries([...campaignParams(new URL(location.href))].map(([key, value]) => [campaignFields[key], value]));
  const incomingReferrer = (() => {
    try { const ref = new URL(document.referrer); return ['https:', 'http:'].includes(ref.protocol) && ref.origin !== location.origin ? ref.origin + '/' : ''; } catch (_) { return ''; }
  })();
  const safeHere = () => allowedHost && safeUrl(new URL(location.href));
  const safeReferrer = () => {
    if (!document.referrer) return true;
    try { const ref = new URL(document.referrer); return !ref.search && !ref.hash && (ref.origin !== location.origin || publicPath(ref.pathname)); } catch (_) { return false; }
  };
  // The official tag queues start before downloading its recorder. Gate that
  // command too, so a slow download cannot start on a subsequently private URL.
  function clarityQueue(pending = []) {
    function queued() {
      if (arguments[0] === 'start' && (replayStopped || !safeHere() || !!location.search || !safeReferrer())) return;
      (queued.q = queued.q || []).push(arguments);
    }
    queued.q = pending;
    return queued;
  }
  function stopReplay() {
    if (replayStopped) return;
    // Stopping before the recorder has loaded keeps it from loading later on this page.
    replayStopped = true;
    if (!window.clarity) return;
    if (window.clarity.v) window.clarity('stop');
    // stop() replaces the vendor global with a queue. Remove any pending start
    // and keep gating starts if either of the two vendor scripts is still loading.
    const pending = (window.clarity.q || []).filter(args => args[0] !== 'start');
    window.clarity = clarityQueue(pending);
  }
  function gtag() { window.dataLayer.push(arguments); }
  const uxEvents = new Set(['task_started', 'route_accepted', 'request_previewed', 'request_copied', 'pack_download_requested', 'file_download', 'help_opened', 'task_retried', 'result_useful', 'result_needs_work', 'search_started', 'support_opened', 'outbound_click']);
  let taskStartedAt = null;
  function track(name) {
    // Never forward arbitrary parameters supplied by app content.
    if (typeof name !== 'string' || !uxEvents.has(name) || !running || !safeHere()) return;
    if (name === 'task_started') taskStartedAt = Date.now();
    const params = { page_location: measuredUrl(), page_title: location.pathname, page_referrer: '' };
    if (taskStartedAt !== null && ['request_copied', 'pack_download_requested', 'file_download', 'result_useful', 'result_needs_work'].includes(name)) {
      const elapsed = Date.now() - taskStartedAt;
      params.time_bucket = elapsed < 30000 ? 'under_30s' : elapsed < 120000 ? '30s_to_2m' : elapsed < 300000 ? '2m_to_5m' : 'over_5m';
    }
    gtag('event', name, params);
  }
  document.addEventListener('abb:ux-event', event => track(event.detail));
  function pageView() {
    if (!running || !safeHere() || lastPath === location.pathname) return;
    const previous = lastPath;
    lastPath = location.pathname;
    const page = { page_location: measuredUrl(), page_title: location.pathname, page_referrer: previous ? location.origin + previous : incomingReferrer };
    gtag('set', { page_location: page.page_location, page_referrer: page.page_referrer });
    gtag('config', GA, { ...campaign, ...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    gtag('event', 'page_view', page);
  }
  function askBanner() {
    if (!document.body || document.getElementById('abb-consent')) return;
    const style = document.createElement('style');
    style.textContent = '#abb-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin:0 auto;padding:16px 18px;background:var(--panel,#fff);color:var(--text,#0a0a0a);border:1px solid var(--line-2,#cfcfcf);border-radius:12px;box-shadow:0 20px 50px -20px rgba(0,0,0,.35);font:15px/1.5 var(--sans,system-ui,sans-serif)}#abb-consent p{margin:0 0 12px}#abb-consent a{color:inherit;text-decoration:underline}#abb-consent div{display:flex;gap:8px;flex-wrap:wrap}#abb-consent button{font:inherit;font-weight:600;padding:8px 16px;border-radius:8px;cursor:pointer;border:1px solid var(--line-2,#cfcfcf);background:var(--btn-2,#ececec);color:var(--text,#0a0a0a)}#abb-consent button[data-choice=granted]{background:var(--btn,#0a0a0a);color:var(--btn-text,#fff);border-color:var(--btn,#0a0a0a)}#abb-consent button:focus-visible{outline:2px solid var(--focus,#0a0a0a);outline-offset:2px}';
    const box = document.createElement('div');
    box.id = 'abb-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Analytics cookies');
    box.innerHTML = '<p>Can we use analytics cookies? They show us which pages help, through Google Analytics and Microsoft Clarity. No ads, and nothing you type. <a href="/analytics-privacy.html">Details</a></p><div><button type="button" data-choice="granted">Allow</button><button type="button" data-choice="denied">No thanks</button></div>';
    box.addEventListener('click', event => {
      const picked = event.target.closest?.('button[data-choice]')?.getAttribute('data-choice');
      if (!picked) return;
      try { localStorage.setItem(CONSENT_KEY, picked); } catch (_) {}
      box.remove(); style.remove();
      if (picked === 'granted') start(true);
      else if (running) { window['ga-disable-' + GA] = true; stopReplay(); running = false; }
    });
    document.head.appendChild(style);
    document.body.appendChild(box);
  }
  // Any element marked data-analytics-choice (on the privacy pages) reopens the question.
  document.addEventListener('click', event => {
    if (!event.target.closest?.('[data-analytics-choice]')) return;
    event.preventDefault();
    try { localStorage.removeItem(CONSENT_KEY); } catch (_) {}
    askBanner();
  });
  function start(chosen = false) {
    if (running || !safeHere()) return;
    if (!allowed()) { if (askFirst && !choice() && !gpc) askBanner(); return; }
    running = true;
    // Mask all text, form controls and dynamic drawers; heatmaps still show clicks and scrolling.
    document.documentElement.setAttribute('data-clarity-mask', 'true');
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('set', 'ads_data_redaction', true);
    gtag('set', 'url_passthrough', false);
    gtag('set', 'ads_data_redaction', true);
    gtag('set', 'url_passthrough', false);
    gtag('js', new Date());
    // Config is queued before loading gtag, with automatic page views disabled.
    pageView();
    // The page view above is queued now; the tag itself downloads after the page has loaded,
    // so it never competes with the page's own code on a slow phone connection.
    const loadGoogle = () => {
      const google = document.createElement('script'); google.async = true;
      if (!running || !safeHere()) return;
      google.fetchPriority = 'low';
      google.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
      document.head.appendChild(google);
    };
    const scheduleGoogle = () => {
      if (window.requestIdleCallback) window.requestIdleCallback(loadGoogle, { timeout: 3000 });
      else loadGoogle();
    };
    if (document.readyState === 'complete') scheduleGoogle();
    else window.addEventListener('load', scheduleGoogle, { once: true });
    if (replayStopped || location.search || !safeReferrer()) return;
    // The recorder is heavy on phones (seconds of main-thread work), so it starts on the first
    // scroll, tap or key press instead of while the page is painting. A click on Allow counts.
    let asked = false;
    const replay = () => {
      if (asked) return;
      asked = true;
      if (replayStopped || !running || !safeHere() || location.search || window.clarity) return;
      window.clarity = clarityQueue();
      window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
      const clarity = document.createElement('script'); clarity.async = true;
      clarity.src = 'https://www.clarity.ms/tag/' + CLARITY;
      document.head.appendChild(clarity);
    };
    if (chosen) replay();
    else for (const name of ['pointerdown', 'keydown', 'scroll', 'touchstart']) document.addEventListener(name, replay, { capture: true, passive: true, once: true });
  }
  function boot() {
    if (!allowedHost) return;
    // Retire only the old analytics preference; preserve kits and account saves.
    try { localStorage.removeItem('abb:analytics-consent:v1'); } catch (_) {}
    start();
  }
  // Stop replay before URLs or private app state change. Normal app navigation
  // and typing continue without a reload or loss of focus/drafts.
  document.addEventListener('click', event => {
    if (!running || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.target.closest?.('.abb-support-launcher')) track('support_opened');
    const link = event.target.closest?.('a[href]'); if (!link || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (['http:', 'https:'].includes(url.protocol) && url.origin !== location.origin) track('outbound_click');
    if (link.target === '_blank') return;
    if (url.origin === location.origin && !safeUrl(url)) { window['ga-disable-' + GA] = true; stopReplay(); }
  }, true);
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (state, unused, target) {
      const url = new URL(target || location.href, location.href);
      if (!safeUrl(url)) taskStartedAt = null;
      if (running && url.origin === location.origin && !safeUrl(url)) { window['ga-disable-' + GA] = true; stopReplay(); lastPath = ''; }
      const result = original.apply(this, arguments);
      if (running) { window['ga-disable-' + GA] = !safeHere(); pageView(); } else start();
      return result;
    };
  }
  window.addEventListener('popstate', () => {
    if (!safeHere()) taskStartedAt = null;
    if (running && (!safeHere() || location.search)) { window['ga-disable-' + GA] = !safeHere(); stopReplay(); lastPath = ''; }
    if (running) { window['ga-disable-' + GA] = !safeHere(); pageView(); } else start();
  });
  window.addEventListener('hashchange', () => { if (!running) return; window['ga-disable-' + GA] = !safeHere(); if (!safeHere()) stopReplay(); });
  // Stop before even the first keystroke; the search URL often changes while
  // typing, and native input contents must never become recording metadata.
  let searchStarted = false;
  document.addEventListener('beforeinput', (event = {}) => {
    if (!searchStarted && event.target?.matches?.('[data-testid="library-search"]') && safeHere()) { track('search_started'); searchStarted = true; }
    stopReplay();
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
