/* Official Crisp full-page embed, kept outside the app document. Website ID is public. */
(() => {
  'use strict';
  const requested = new URLSearchParams(location.search).get('theme');
  const initialTheme = requested === 'light' ? 'light' : 'dark';
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = 'd2a4349f-cd16-4c36-b3c6-e0ec87734eee';
  window.CRISP_RUNTIME_CONFIG = { lock_maximized: true, lock_full_view: true, cross_origin_cookies: true };
  window.$crisp.push(['config', 'color:theme', ['black']]);
  window.$crisp.push(['config', 'sound:mute', [true]]);
  window.$crisp.push(['on', 'session:loaded', () => document.querySelector('p')?.remove()]);
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    window.$crisp.push(['config', 'color:mode', [theme]]);
  }
  setTheme(initialTheme);
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'abb:support-theme') return;
    if (['dark', 'light'].includes(event.data.theme)) setTheme(event.data.theme);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && parent !== window) parent.postMessage({ type: 'abb:support-close' }, location.origin);
  });
  const script = document.createElement('script');
  script.src = 'https://client.crisp.chat/l.js';
  script.async = true;
  document.head.append(script);
})();
