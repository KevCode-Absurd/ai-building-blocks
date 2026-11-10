import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isTested, trustLabel } from '../src/lib/verification.ts';
import { roleSeeds, sameJobAgentPages } from '../src/roles/role-definitions.mjs';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const catalogue = JSON.parse(read('../public/data/blocks.json'));
const kindPath = (b) => (b.type === 'mind' ? 'minds' : b.type === 'agent' ? 'agents' : b.category === 'orchestrator' || b.type === 'workflow' || b.type === 'routine' ? 'workflows' : b.type === 'prompt' ? 'prompts' : 'skills');

test('one label: Safety checked, or nothing', () => {
  const passed = { result: 'pass', on: '', business: '' };
  assert.equal(trustLabel({ tested: passed }), 'Safety checked');
  assert.equal(trustLabel({ tested: null }), '');
  assert.equal(isTested({ tested: null }), false);
  for (const f of ['../src/ui.tsx', '../src/BlockPage.tsx', '../src/lib/site-info.mjs', '../src/HowItWorks.tsx']) assert.ok(!/not yet tested/i.test(read(f)), f);
});

test('the menu reaches every main page in a few grouped links, and the footer stays short', async () => {
  const { MAIN_NAV, MENU_GROUPS, FOOTER_GROUPS } = await import('../src/lib/site-nav.mjs');
  // The main sections and the blog show in the laptop header; the grouped menu reaches every main page.
  assert.deepEqual(MAIN_NAV.map(([to, label]) => [to, label]), [['/#library', 'Find a task'], ['/roles', 'Hire an AI specialist'], ['/compose', 'Build a workflow'], ['/tools', 'Tools'], ['/minds', 'Minds'], ['/blog', 'Blog']]);
  const links = MENU_GROUPS.flatMap((g) => g.links.map(([to]) => to));
  for (const page of ['/#library', '/which-one', '/minds', '/tools', '/ai-tools', '/compose', '/get-it-done', '/from-a-source', '/apps', '/roles', '/train-your-own-ai-agent', '/blog', '/teams', '/api-and-mcp', '/me-md', '/space', '/how-it-works', '/support']) assert.ok(links.includes(page), `${page} is in the menu`);
  assert.ok(links.length <= 20, `menu lists ${links.length} links`);
  for (const unfinished of ['/community', '/publish', '/people']) assert.ok(!links.includes(unfinished), `${unfinished} is not a menu link`);
  // The app header and the plain pages' header read the same lists.
  assert.match(read('../src/SiteHeader.tsx'), /from "\.\/lib\/site-nav\.mjs"/);
  assert.match(read('../scripts/lib/site-chrome.mjs'), /from "\.\.\/\.\.\/src\/lib\/site-nav\.mjs"/);
  const listed = FOOTER_GROUPS.flatMap((g) => g.links.map(([to]) => to));
  assert.ok(listed.includes('/minds'), 'Minds remains directly reachable from the footer');
  assert.ok(FOOTER_GROUPS.length <= 3 && listed.length <= 14, `footer lists ${listed.length} links in ${FOOTER_GROUPS.length} columns`);
  for (const folded of ['/from-a-source', '/tools/growth-channel-planner', '/apps/starter-pack', '/people']) assert.ok(!listed.includes(folded), `${folded} is not a footer link`);
  const footer = read('../src/SiteFooter.tsx');
  assert.match(footer, /usePeopleVisible\(\)/);
  assert.match(footer, /people && <Link to="\/people"/);
  assert.match(read('../scripts/lib/site-chrome.mjs'), /FOOTER_GROUPS\.map/);
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
  // An agency agent page that is the same job as a role page names the role as canonical; the role is listed instead.
  const sameJob = sameJobAgentPages(roleSeeds(catalogue.blocks), catalogue.blocks);
  assert.equal(sameJob.size, 282);
  for (const b of thin) { const own = `/${kindPath(b)}/${b.slug}`, listed = sameJob.get(own) ?? own; assert.ok(sitemaps.includes(`<loc>https://useaiblocks.com${listed}</loc>`), `${b.slug} is missing from the sitemap`); if (sameJob.has(own)) assert.ok(!sitemaps.includes(`<loc>https://useaiblocks.com${own}</loc>`), `${own} is listed although its canonical is ${listed}`); }
  assert.ok(!sitemaps.includes('/apps/starter-pack<'));
  const prerender = read('../scripts/prerender.mjs');
  assert.match(prerender, /const html = render\(url, p\);/);
  assert.doesNotMatch(read('../scripts/build-index.mjs'), /isThin/);
});
