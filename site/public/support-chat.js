/* AI Blocks support. Crisp loads only when a visitor opens the chat. */
(() => {
  'use strict';
  if (document.getElementById('abb-support')) return;
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/support-chat.css';
  document.head.append(style);

  const host = document.createElement('aside');
  host.id = 'abb-support';
  host.setAttribute('aria-label', 'Personal support');
  host.innerHTML = `
    <section id="abb-support-panel" role="dialog" aria-labelledby="abb-support-title" hidden>
      <header class="abb-support-heading">
        <img src="/icon-192.png" width="32" height="32" alt="" />
        <div><strong id="abb-support-title">Support</strong><span>AI Blocks</span></div>
        <button type="button" class="abb-support-close" aria-label="Close support chat">×</button>
      </header>
      <div class="abb-support-conversation"></div>
      <footer><span>Chat with AI Blocks support.</span><a href="mailto:hello@useaiblocks.com">Email instead ↗</a></footer>
    </section>
    <button type="button" class="abb-support-launcher" aria-expanded="false" aria-controls="abb-support-panel" aria-label="Open support chat" title="Support">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 2h14v10H7l-5 4V2Z" stroke="currentColor" stroke-width="1.5"/><path d="M5 6h8M5 9h5" stroke="currentColor" stroke-width="1.5"/></svg>
    </button>`;
  document.body.append(host);
  const panel = host.querySelector('section');
  const launcher = host.querySelector('.abb-support-launcher');
  const closeButton = host.querySelector('.abb-support-close');
  let frame;
  let returnFocus;
  const theme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const sendTheme = () => frame?.contentWindow?.postMessage({ type: 'abb:support-theme', theme: theme() }, location.origin);
  function close() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    (returnFocus?.isConnected ? returnFocus : launcher).focus();
  }
  function open() {
    returnFocus = document.activeElement;
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.title = 'AI Blocks support chat';
      // The fixed frame URL keeps app routes, drafts and private share links out of the embed.
      frame.src = '/support-chat-frame.html?theme=' + theme();
      frame.referrerPolicy = 'no-referrer';
      frame.addEventListener('load', sendTheme);
      host.querySelector('.abb-support-conversation').append(frame);
    }
    closeButton.focus();
  }
  launcher.addEventListener('click', () => panel.hidden ? open() : close());
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) close(); });
  document.addEventListener('abb:support-open', open);
  window.addEventListener('message', event => {
    if (event.origin === location.origin && event.source === frame?.contentWindow && event.data?.type === 'abb:support-close') close();
  });
  new MutationObserver(sendTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
