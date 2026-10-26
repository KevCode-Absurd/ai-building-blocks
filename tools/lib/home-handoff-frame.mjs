import assert from 'node:assert/strict';

/** Give the styled HTML a rendering opportunity before the live app replaces it. */
export function patchHomeHandoffFrame(html) {
  assert.equal(typeof html, 'string');
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));
  assert(html.includes('data-home-entry fetchpriority="low"'));
  const opening = 'function revealHome(){if(!homeAppReady||!homeCssReady||homeRevealed||bootStyleFailed)return;homeRevealed=true;';
  const following = '\n}\n      document.addEventListener("abb:ready",function(){homeAppReady=true;revealHome();},{once:true});';
  assert.equal(html.split(opening).length, 2, 'Expected one gated homepage reveal');
  assert.equal(html.split(following).length, 2, 'Expected the original readiness listener');
  const start = html.indexOf(opening) + opening.length;
  const end = html.indexOf(following);
  assert(end > start);
  const original = html.slice(start, end);
  const wrapper = '\n        clearTimeout(window.__abbBootTimer);\n        requestAnimationFrame(()=>requestAnimationFrame(()=>{';
  assert(!original.startsWith(wrapper), 'Homepage handoff frame patch already applied');
  assert(original.includes('if (bootStyleFailed) return;'));
  assert(original.includes('const shell=document.getElementById("app-loader"), active=document.activeElement;'));
  return html.slice(0, start) + wrapper + original + '\n        }));' + html.slice(end);
}
