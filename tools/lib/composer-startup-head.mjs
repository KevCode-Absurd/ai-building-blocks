import assert from 'node:assert/strict';

/** Use the widget's own frozen rules before its asynchronously requested stylesheet arrives. */
export function composerStartupCriticalCss(supportCss) {
  assert.equal(typeof supportCss, 'string');
  const lines = supportCss.split(/\r?\n/);
  const prefixes = ['#abb-support {', '#abb-support *,', '#abb-support [hidden]', '#abb-support .abb-support-launcher {'];
  const selected = prefixes.map(prefix => {
    const matches = lines.filter(line => line.startsWith(prefix));
    assert.equal(matches.length, 1, 'Missing or ambiguous frozen support rule: ' + prefix);
    return matches[0];
  });
  const mobile = supportCss.match(/@media \(max-width: 600px\) \{\r?\n(  #abb-support \{[^\r\n]+\})/);
  assert(mobile, 'Frozen mobile support positioning rule missing.');
  return selected.join('\n') + '\n@media (max-width: 600px) {\n' + mobile[1] + '\n}\n';
}

/** Composer-only public configuration preload and stable support-button geometry. */
export function patchComposerStartupHead(html, { supportCss }) {
  assert.equal(typeof html, 'string');
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/compose"'), 'Only the composer page may receive this patch.');
  assert(!html.includes('data-composer-startup='), 'Composer startup head was already patched.');
  const anchor = '<meta charset="UTF-8" />';
  assert.equal(html.split(anchor).length, 2, 'Expected one head charset anchor.');
  const preload = '<link rel="preload" href="/api/auth" as="fetch" crossorigin="anonymous" fetchpriority="high" data-composer-startup="public-auth">';
  const style = '<style data-composer-startup="support-geometry">\n' + composerStartupCriticalCss(supportCss) + '</style>';
  const patched = html.replace(anchor, anchor + '\n    ' + preload + '\n    ' + style);
  assert.equal(patched.slice(patched.indexOf('</head>')), html.slice(html.indexOf('</head>')), 'Composer body must remain byte-exact.');
  return patched;
}
