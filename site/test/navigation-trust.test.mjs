import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isTested, trustLabel } from '../src/lib/verification.ts';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const catalogue = JSON.parse(read('../public/data/blocks.json'));
const kindPath = (b) => (b.type === 'mind' ? 'minds' : b.type === 'agent' ? 'agents' : b.category === 'orchestrator' || b.type === 'workflow' || b.type === 'routine' ? 'workflows' : b.type === 'prompt' ? 'prompts' : 'skills');

test('one label: Tested, or nothing', () => {
  const passed = { result: 'pass', on: '', business: '' };
  assert.equal(trustLabel({ tested: passed }), 'Tested');
  assert.equal(trustLabel({ tested: null }), '');
  assert.equal(isTested({ tested: null }), false);
  for (const f of ['../src/ui.tsx', '../src/BlockPage.tsx', '../src/lib/site-info.mjs', '../src/HowItWorks.tsx']) assert.ok(!/not yet tested/i.test(read(f)), f);
});

test('the menu and footer include Minds while navigation stays short', () => {
  const header = read('../src/SiteHeader.tsx');
  const main = header.slice(header.indexOf('aria-label="Main sections"'), header.indexOf('</section>', header.indexOf('aria-label="Main sections"')));
  const links = [...main.matchAll(/<Link to="([^"]+)"[^>]*>([^<]+)<\/Link>/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(links, [['/#library', 'Find a task'], ['/roles', 'Hire an AI specialist'], ['/compose', 'Build a workflow'], ['/minds', 'Minds'], ['/tools', 'Tools'], ['/space', 'My space']]);
  for (const folded of ['/from-a-source', '/tools/growth-channel-planner', '/apps/starter-pack', '/people', '/ai-tools']) assert.ok(!header.includes(`to="${folded}"`), `${folded} is not a header link`);
  const footer = read('../src/SiteFooter.tsx');
  const listed = [...footer.slice(footer.indexOf('const groups'), footer.indexOf('export default')).matchAll(/\["(\/[^"]*)", "([^"]+)"\]/g)].map((m) => m[1]);
  assert.ok(listed.includes('/minds'), 'Minds remains directly reachable from the footer');
  assert.ok(listed.length <= 9, `footer lists ${listed.length} links`);
  for (const folded of ['/from-a-source', '/tools/growth-channel-planner', '/apps/starter-pack', '/people']) assert.ok(!listed.includes(folded), `${folded} is not a footer link`);
  assert.match(footer, /usePeopleVisible\(\)/);
  assert.match(footer, /people && <Link to="\/people"/);
});

test('From people is hidden until the public list has 20 items, and the page is noindex', () => {
  const people = read('../src/lib/people.ts');
  assert.match(people, /PEOPLE_MIN = 20/);
  assert.match(people, /count >= PEOPLE_MIN/);
  assert.match(read('../scripts/prerender.mjs'), /write\("\/people"[^\n]*\{ noindex: true \}\)\);/);
});

test('old addresses keep working: server redirects and in-app redirects', () => {
  const redirects = read('../public/_redirects');
  assert.match(redirects, /^\/traction \/tools\/growth-channel-planner 301$/m);
  assert.match(redirects, /^\/apps\/starter-pack \/apps 301$/m);
  assert.match(read('../scripts/build-index.mjs'), /"\/apps\/starter-pack \/apps 301"/);
  assert.match(read('../src/App.tsx'), /"\/apps\/starter-pack": "\/apps#starter-pack"/);
  const app = read('../src/App.tsx');
  for (const route of ['/from-a-source', '/tools/growth-channel-planner', '/minds', '/people']) assert.ok(app.includes(`"${route}"`) || app.includes(`path === "${route}"`), `${route} still has a route`);
});

test('imported blocks stay in the sitemap and their pages stay indexable', () => {
  const thin = catalogue.blocks.filter((b) => b.origin === 'imported' && b.headline !== '');
  assert.ok(thin.length > 0);
  const sitemaps = fs.readdirSync(new URL('../public/', import.meta.url)).filter((f) => /^sitemap-.*\.xml$/.test(f)).map((f) => read(`../public/${f}`)).join('');
  for (const b of thin) assert.ok(sitemaps.includes(`<loc>https://useaiblocks.com/${kindPath(b)}/${b.slug}</loc>`), `${b.slug} is missing from the sitemap`);
  assert.ok(!sitemaps.includes('/apps/starter-pack<'));
  const prerender = read('../scripts/prerender.mjs');
  assert.match(prerender, /const html = render\(url, p\);/);
  assert.doesNotMatch(read('../scripts/build-index.mjs'), /isThin/);
});
