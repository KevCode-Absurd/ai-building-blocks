import assert from 'node:assert/strict';

/** Keep the usable HTML screen until its first paint, then enhance it once. */
export function patchHomePaintEnhancement(html) {
  assert.equal(typeof html, 'string');
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));
  assert(html.includes('data-home-flow-shell') && html.includes('data-home-enhancement'));
  assert(html.includes('paintObserver.observe({type:"paint",buffered:true})'));
  const importCall = 'import(entry).catch(()=>bootError());';
  const previousImport = '\n        ' + importCall;
  const supportEnd = 'document.head.append(support);}catch{}};';
  assert.equal(html.split(importCall).length, 2, 'Expected exactly one main import');
  assert.equal(html.split(previousImport).length, 2, 'Main import must still be outside the paint callback');
  assert.equal(html.split(supportEnd).length, 2, 'Expected the once-only optional support callback');
  return html.replace(previousImport, '').replace(supportEnd, 'document.head.append(support);}catch{}' + importCall + '};');
}
