import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSkillHtml } from '../src/lib/skill-html.mjs';
const render = (html, files = []) => normalizeSkillHtml(html, 'example-task', files);

test('exact included file links and SKILL.md resolve under the canonical skill folder', () => {
  const html = '<p><a class="ref" href="./references/a%20guide.md?mode=read&amp;x=1#checks">Guide</a> <a href="SKILL.md">Instructions</a></p>';
  assert.equal(render(html, ['references/a guide.md']), '<p><a class="ref" href="/skills/example-task/references/a%20guide.md?mode=read&amp;x=1#checks">Guide</a> <a href="/skills/example-task/SKILL.md">Instructions</a></p>');
  assert.equal(render("<a href='scripts/run.py'>Run</a>", ['scripts/run.py']), '<a href="/skills/example-task/scripts/run.py">Run</a>');
});
test('unknown relative source links are readable references, without guessed live destinations', () => {
  const result = render('<a title="original" href="../../../c-level/skills/other/SKILL.md">Other method</a><a href="missing.md">Notes</a>');
  assert(!result.includes('href=')); assert(result.includes('Other method')); assert(result.includes('source reference:'));
  assert(result.includes('../../../c-level/skills/other/SKILL.md')); assert(!result.includes('in the download'));
  assert(!render('<a href="other/run.py">Different folder</a>', ['scripts/run.py']).includes('href='));
});
test('parent traversal, encoded traversal, backslashes and unsafe filenames never become live asset paths', () => {
  for (const path of ['../secret.md', 'references/../secret.md', '%2e%2e/secret.md', '%252e%252e/secret.md', 'references%2f..%2fsecret.md', 'references\\secret.md', '&#46;&#46;/secret.md']) {
    const result = render(`<a href="${path}">Source</a>`, [path, 'secret.md']);
    assert(!result.includes('href='), path);
  }
});
test('external, root, protocol-relative, query and anchor references are byte-for-byte unchanged', () => {
  const html = '<a href="https://docs.example.com/a?q=1&amp;b=2#x">Docs</a><a href="mailto:help@example.com">Mail</a><a href="/skills/other">Other</a><a href="//cdn.example.com/a">CDN</a><a href="#checks">Checks</a><a href="?view=all">View</a><img alt="External" src="https://example.com/pic.png">';
  assert.equal(render(html), html);
});
test('included images resolve exactly and unknown images do not request broken relative URLs', () => {
  assert.equal(render('<img alt="Task diagram" src="assets/my%20diagram.png">', ['assets/my diagram.png']), '<img alt="Task diagram" src="/skills/example-task/assets/my%20diagram.png">');
  const unknown = render('<img alt="Original example" src="../other/example.png">');
  assert(!unknown.includes('<img')); assert(unknown.includes('Original example')); assert(unknown.includes('Image source reference:'));
});
test('literal code examples and source strings remain unchanged; invalid slugs cannot build URLs', () => {
  const source = '&lt;a href="references/guide.md"&gt;Example&lt;/a&gt;';
  assert.equal(render(source, ['references/guide.md']), source);
  const html = '<a href="references/guide.md">Guide</a>';
  assert(!normalizeSkillHtml(html, '../bad', ['references/guide.md']).includes('href='));
  assert.equal(html, '<a href="references/guide.md">Guide</a>');
});

test('attribute-like strings in titles or data attributes are not treated as href or src', () => {
  const external = '<a title="href=references/secret.md" data-href="references/secret.md" href="https://example.com">External</a>';
  assert.equal(render(external, ['references/secret.md']), external);
  const real = '<a title="href=other.md" data-href="other.md" href="references/guide.md">Guide</a>';
  assert.equal(render(real, ['references/guide.md']), '<a title="href=other.md" data-href="other.md" href="/skills/example-task/references/guide.md">Guide</a>');
});

test('only the explicit non-site source/example root paths become labelled references', () => {
  for (const path of ['/features/analytics', '/docs/projects/create', '/docs/webhooks', '/skills/']) {
    const result = render(`<a href="${path}">Source example</a>`);
    assert(!result.includes('href='), path);
    assert(result.includes('source reference:'), path);
    assert(result.includes(`<code>${path}</code>`), path);
  }
  const withSuffix = render('<a href="/docs/webhooks?example=1#setup">Example hook</a>');
  assert(!withSuffix.includes('href='));
  assert(withSuffix.includes('/docs/webhooks?example=1#setup'));
});
test('real root routes and agent paths that the Worker redirects are not rewritten', () => {
  const html = '<a href="/">Home</a><a href="/tools">Tools</a><a href="/compose">Plan</a><a href="/skills/agent-slug">Agent</a><a href="/skills/real-skill#file">Skill</a><a href="/docs/webhooks/another">Other path</a><a href="https://example.com/docs/webhooks">External</a>';
  assert.equal(render(html), html);
});

test('confirmed same-origin absolute source examples become references while external and real absolute routes stay intact', () => {
  for (const path of ['/features/analytics', '/docs/projects/create', '/docs/webhooks', '/skills/']) {
    const target = `https://useaiblocks.com${path}?example=1#source`;
    const result = render(`<a href="${target}">Original source</a>`);
    assert(!result.includes('href=')); assert(result.includes(target)); assert(result.includes('source reference:'));
  }
  const actual = '<a href="https://useaiblocks.com/skills/real-agent">Agent</a><a href="https://other.example/skills/">Other library</a><a href="https://useaiblocks.com.evil.example/skills/">Other host</a><a href="http://useaiblocks.com/skills/">Other origin</a>';
  assert.equal(render(actual), actual);
});
