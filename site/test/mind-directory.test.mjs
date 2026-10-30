import test from 'node:test';
import assert from 'node:assert/strict';
import {mindDirectory, mindDirectoryUrls} from '../scripts/lib/mind-directory.mjs';
const minds = Array.from({length: 505}, (_, index) => ({slug: `mind-${index}`, name: `Mind ${index}`, identity: 'Source-backed thinker', summary: 'Methods for work and learning.'}));
test('the initial directory is bounded and every original profile remains reachable without JavaScript', () => {
  const urls = mindDirectoryUrls(minds);
  assert.equal(urls.length, 22);
  const all = urls.flatMap(url => {
    const page = mindDirectory(url, minds);
    assert.ok(page.rows.length <= 24);
    assert.equal(page.main.numberOfItems, page.rows.length);
    for (const href of urls) if (href !== url) assert.ok(page.body.includes(`href="${href}"`));
    return page.main.itemListElement.map(item => item.url);
  });
  assert.equal(new Set(all).size, minds.length);
  assert.deepEqual(all, minds.map(mind => `https://useaiblocks.com/minds/${mind.slug}`));
  assert.equal(mindDirectory('/minds', minds).rows.length, 24);
  assert.equal(mindDirectory('/minds/page/22', minds).rows.length, 1);
  assert.equal(mindDirectory('/minds/page/2', minds).main.itemListElement[0].position, 25);
});
test('directory pages escape source text and reject aliases, invalid and out-of-range pages', () => {
  assert.ok(mindDirectory('/minds', [{...minds[0], name: '<script>"&', summary: '<img src=x>'}]).body.includes('&lt;script&gt;&quot;&amp;'));
  for (const url of ['/minds/page/1', '/minds/page/0', '/minds/page/02', '/minds/page/23', '/minds/page/no', '/minds/mind-1']) assert.equal(mindDirectory(url, minds), null);
  assert.deepEqual(mindDirectoryUrls([]), []);
});
