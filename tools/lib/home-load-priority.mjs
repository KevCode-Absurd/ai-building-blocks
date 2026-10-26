import assert from 'node:assert/strict';

/** Reserve first-paint bandwidth for text/fonts before client enhancement. */
export function prioritizeHomeText(html) {
  assert.equal(typeof html, 'string');
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));
  assert(html.includes('data-home-flow-shell') && html.includes('data-home-enhancement'));
  const entries = [...html.matchAll(/<link\b(?=[^>]*\brel="modulepreload")(?=[^>]*\bdata-home-entry(?:\s|>))[^>]*>/g)];
  assert.equal(entries.length, 1, 'Expected one explicitly marked homepage entry preload');
  const tag = entries[0][0];
  assert(/\bcrossorigin(?:\s|>)/.test(tag));
  assert(/\bhref="\/assets\/[a-zA-Z0-9_-]+\.js"/.test(tag));
  assert(!/\bfetchpriority\s*=/i.test(tag), 'Homepage entry preload priority already set');
  return html.replace(tag, tag.slice(0, -1) + ' fetchpriority="low">');
}
