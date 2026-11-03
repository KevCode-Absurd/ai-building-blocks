// Lighter pages and accessibility floors (stream F): which pages skip the catalogue, the hashed catalogue file,
// build-time next-step names for the calculators, card patterns out of the main stylesheet, and the text,
// focus and floating-button rules.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { catalogueAssetName, nextStepLinks } from '../scripts/vite-site-data.mjs';
import { TOOLS } from '../../mini-tools/index.mjs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

test('next-step links come from the catalogue at build time, following renames', () => {
  const tools = [{ next: [{ slug: 'a', why: '' }, { slug: 'old-b', why: '' }, { slug: 'gone', why: '' }] }, { next: [{ slug: 'w', why: '' }] }];
  const catalogue = { renamed: { 'old-b': 'b' }, blocks: [{ slug: 'a', name: 'A skill' }, { slug: 'b', name: 'B prompt', type: 'prompt' }, { slug: 'w', name: 'W', category: 'orchestrator' }] };
  assert.deepEqual(nextStepLinks(tools, catalogue), { a: { name: 'A skill', path: '/skills/a' }, 'old-b': { name: 'B prompt', path: '/prompts/b' }, w: { name: 'W', path: '/workflows/w' } });
  assert.deepEqual(nextStepLinks(tools, null), {});
});

test('every mini tool next step resolves in the built catalogue', { skip: !fs.existsSync(new URL('../public/data/blocks.json', import.meta.url)) && 'run npm run index first' }, () => {
  const catalogue = JSON.parse(read('../public/data/blocks.json'));
  const links = nextStepLinks(TOOLS, catalogue);
  const wanted = new Set(TOOLS.flatMap((t) => (t.next ?? []).map((n) => n.slug)));
  assert.ok(wanted.size > 0);
  for (const slug of wanted) assert.ok(links[slug], `next step ${slug} has a name`);
});

test('the catalogue copy is named by its content', () => {
  const a = catalogueAssetName(Buffer.from('{"blocks":[]}')), b = catalogueAssetName(Buffer.from('{"blocks":[1]}'));
  assert.match(a, /^assets\/blocks-[0-9a-f]{16}\.json$/);
  assert.notEqual(a, b);
  assert.equal(a, catalogueAssetName(Buffer.from('{"blocks":[]}')));
});

test('sign-in, community and calculator pages do not ask for the full catalogue', () => {
  const app = read('../src/App.tsx');
  const line = app.split('\n').find((l) => l.includes('const needsCatalogue ='));
  for (const path of ['/sign-in', '/sign-up', '/community', '/publish', '/my-submissions', '/tools']) assert.ok(line.includes(`"${path}"`), `${path} is excluded`);
  const tools = read('../src/tools/ToolsPage.tsx');
  assert.doesNotMatch(tools, /useCatalogue/);
  assert.match(tools, /virtual:tool-next-steps/);
  assert.match(read('../src/lib/data.ts'), /__CATALOGUE_URL__/);
});

test('card patterns are files, not inline data in the main stylesheet', () => {
  const css = read('../src/dither-masks.css');
  assert.ok(Buffer.byteLength(css) < 20000, `dither-masks.css is ${Buffer.byteLength(css)} bytes`);
  assert.doesNotMatch(css, /--pat-[a-z0-9-]+:url\("data:/);
  const patterns = [...css.matchAll(/--pat-([a-z0-9-]+):url\("\.\/patterns\/([a-z0-9-]+\.svg)"\)/g)];
  assert.ok(patterns.length > 40);
  for (const [, , file] of patterns) assert.match(read(`../src/patterns/${file}`), /^<svg /);
  assert.match(read('../vite.config.ts'), /patterns/);
});

test('signed-in pages load Clerk without remotely hosted extras, and profile opens without UI components', () => {
  const account = read('../src/lib/composer-account.ts');
  assert.match(account, /import\("@clerk\/clerk-js\/no-rhc"\)/);
  assert.doesNotMatch(account, /\.openUserProfile\(/);
  assert.match(account, /redirectToUserProfile/);
});

test('text inputs show a visible focus and no rule hides it', () => {
  const css = read('../src/styles.css') + read('../src/builder-base.css');
  assert.match(css, /\.composer textarea:focus-visible \{[^}]*box-shadow/);
  assert.match(css, /\.search:focus-within \{[^}]*border-color: var\(--text\)/);
  for (const rule of css.match(/[^{}]+\{[^}]*outline: (?:0|none)[^}]*\}/g) ?? []) {
    const selector = rule.split('{')[0].trim();
    // Containers focused by script (the page body, the builder's step panel) need no ring; fields do.
    if (!/:focus\b/.test(selector) || !/input|textarea|flow-name/.test(selector)) continue;
    assert.match(rule, /border-color: var\(--text\)|box-shadow/, `${selector} replaces the outline with something visible`);
  }
});

test('no text in the shared stylesheets is set below 12px', () => {
  for (const file of ['../src/styles.css', '../src/builder-base.css', '../src/minds-browser.css', '../src/tools/tools.css', '../src/teams/teams.css', '../public/support-chat.css']) {
    const css = read(file);
    for (const m of css.matchAll(/(?:font-size:\s*|font:\s*(?:[a-z-]+\s+)*?(?:\d{3}\s+)?)(\d+(?:\.\d+)?)px/g)) assert.ok(Number(m[1]) >= 12, `${file}: ${m[0]}`);
  }
  const gauge = read('../src/Gauge.tsx');
  assert.match(read('../src/styles.css'), /\.gauge \.end \{ font: 400 12px/);
  assert.match(gauge, /viewBox="0 0 120 80"/);
  assert.doesNotMatch(read("../src/styles.css"), /.gauge svg { width: 92px/);
});

test('floating buttons stack on phones and the teams page keeps its side gutter', () => {
  const styles = read('../src/styles.css'), chat = read('../public/support-chat.css'), teams = read('../src/teams/teams.css');
  assert.match(styles, /\.bp\[data-testid="block-page"\] \.cm-tab \{ position: absolute;/);
  assert.match(styles, /\.cm-tab \{ top: auto; bottom: calc\(/);
  assert.match(chat, /:focus/);
  assert.match(teams, /^\.team-page\{padding-block:42px 70px\}/);
  assert.doesNotMatch(teams, /\.team-page\{padding:/);
});
