import assert from 'node:assert/strict';

// The initial screen occupies the same document flow as the live header/hero.
// Hide the unready app so it cannot leave a second, invisible layout below it.
const flowCss = `html[data-boot] #app-loader[data-home-shell]{position:static;inset:auto;z-index:auto;overflow:visible;transition:none}
html[data-boot="loading"] body,html[data-boot="error"] body{overflow:visible}
html[data-boot="loading"] #root,html[data-boot="error"] #root{display:none}
html[data-boot="ready"] #app-loader[data-home-shell]{display:none}`;

/** Apply only after the three existing homepage startup transforms. */
export function patchHomeFlow(html) {
  assert.equal(typeof html, 'string');
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));
  assert(html.includes('data-home-shell') && html.includes('data-home-enhancement'));
  assert(html.includes('data-home-support-critical'));
  assert(!html.includes('data-home-flow-shell'), 'Homepage flow patch already applied');
  assert.equal(html.split('</head>').length, 2, 'Expected one complete homepage head');
  return html.replace('</head>', '<style data-home-flow-shell>\n' + flowCss + '\n</style>\n  </head>');
}
