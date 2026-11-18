#!/usr/bin/env node
// Read-only checks of the actual Worker, public downloads and browser interactions.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(new URL('../../site/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const origin = arg('--origin') ?? 'http://127.0.0.1:5290';
if (!['http://127.0.0.1:5290', 'https://agents-staging.useaiblocks.com', 'https://agents.useaiblocks.com'].includes(origin)) throw Error('Unapproved origin');
const production = origin === 'https://agents.useaiblocks.com';
// The checked-in local Worker APP_ORIGIN uses localhost, while browser tests use 127.0.0.1.
const canonicalOrigin = origin === 'http://127.0.0.1:5290' ? 'http://localhost:5290' : origin;
const out = path.resolve(arg('--out') ?? 'reports/ecommerce-release');
await fs.mkdir(out, { recursive: true });
const expected = JSON.parse(await fs.readFile(new URL('../../marketplace/src/modules/directory/data/personas-ecommerce.json', import.meta.url), 'utf8')).map(a => a.id).sort();
const report = { startedAt: new Date().toISOString(), origin, expectedAgents: expected.length, status: 'running', scope: 'Read-only deployed Worker, server HTML, public pack metadata and desktop/mobile interactions. No authenticated actions or model calls.', checks: [], screenshots: [], pageErrors: [], failures: [] };
const check = (name, ok, detail) => { report.checks.push({ name, ok: !!ok, detail }); if (!ok) report.failures.push(name); };
async function get(route, method = 'GET') {
  if (!route.startsWith('/') || route.startsWith('//')) throw Error('Expected same-origin route');
  const r = await fetch(origin + route, { method, redirect: 'error', signal: AbortSignal.timeout(60000) });
  if (r.status !== 200) throw Error(`${method} ${route}: ${r.status}`);
  return r;
}
const titleSet = new Set();
async function seo(route) {
  const r = await get(route), html = await r.text();
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  check(route + ': title', title && !titleSet.has(title), title); titleSet.add(title);
  check(route + ': description', /<meta name="description" content="[^"]{30,}"/i.test(html));
  check(route + ': canonical', html.includes(`<link rel="canonical" href="${canonicalOrigin}${route}"`));
  check(route + ': robots', html.includes(`content="${production ? 'index, follow' : 'noindex, follow'}`));
  check(route + ': visible server content', /<h1[ >]/.test(html));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  check(route + ': structured data', schemas.length > 0 && schemas.every(x => { try { return !!JSON.parse(x[1]); } catch { return false; } }));
}
let browser;
try {
  const data = await (await get('/api/agents?vertical=ecommerce')).json();
  check('ecommerce roster', JSON.stringify(data.agents.map(a => a.id).sort()) === JSON.stringify(expected), { actual: data.agents.length });
  const robots = await (await get('/robots.txt')).text(), sitemap = await (await get('/sitemap.xml')).text();
  check('robots environment', production ? robots.includes('Sitemap: ' + origin) && !/Disallow: \/\s*$/m.test(robots) : /Disallow: \/\s*$/m.test(robots));
  await seo('/e-commerce');
  for (const id of expected) {
    await seo('/agents/' + id);
    if (production) check(id + ': sitemap', sitemap.includes(origin + '/agents/' + id + '</loc>'));
    const manifest = await (await get('/packs/' + id + '/files.json')).json();
    check(id + ': pack inventory', Array.isArray(manifest.files) && manifest.files.length > 0);
    // Local asset HEAD responses may omit Content-Length. Check downloaded bytes instead.
    const actual = Buffer.from(await (await get('/packs/' + id + '.zip')).arrayBuffer());
    const built = await fs.readFile(new URL('../../marketplace/dist/packs/' + id + '.zip', import.meta.url));
    const sha = b => createHash('sha256').update(b).digest('hex');
    check(id + ': served ZIP equals candidate', sha(actual) === sha(built), { served: sha(actual), candidate: sha(built) });
  }
  browser = await chromium.launch({ channel: 'chrome', headless: true, chromiumSandbox: true });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
    await context.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
    const page = await context.newPage();
    const requestedScripts = [];
    page.on('request', r => { if (r.resourceType() === 'script') requestedScripts.push(new URL(r.url()).pathname); });
    page.on('pageerror', e => report.pageErrors.push({ width: viewport.width, message: e.message }));
    await page.goto(origin + '/e-commerce', { waitUntil: 'networkidle' });
    await page.locator('#ecom-find').waitFor();
    check('catalogue excludes deferred pages ' + viewport.width, !requestedScripts.some(p => /\/(?:markdown-content|guides|home|agent|agents|job|costs|beta|review|request|new|expert|apply|invite|profile|posts|ops-pages)-[^/]+\.js$/.test(p)), requestedScripts.slice());
    check('initial overflow ' + viewport.width, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const file = `ecommerce-${viewport.width}.png`;
    await page.screenshot({ path: path.join(out, file), fullPage: false }); report.screenshots.push(file);
    await page.locator('#ecom-find').fill('Meta ads');
    await page.waitForFunction(() => location.search.includes('q=Meta'));
    await page.locator('.dir-ecom-found .dir-card').first().waitFor();
    check('search Meta buyer ' + viewport.width, await page.locator('.dir-ecom-found a[href="/agents/lindsey-meta-media-buyer"]').count() > 0);
    await page.locator('#ecom-find').fill('');
    await page.waitForFunction(() => !new URLSearchParams(location.search).has('q'));
    await page.locator('#ecom-tab-agents').focus(); await page.keyboard.press('ArrowRight');
    check('tab arrow navigation ' + viewport.width, await page.locator('#ecom-tab-prompts').getAttribute('aria-selected') === 'true');
    await page.keyboard.press('End');
    check('tab End and focus ' + viewport.width, await page.evaluate(() => document.activeElement?.id === 'ecom-tab-minds' && document.activeElement.getAttribute('aria-selected') === 'true'));
    await page.keyboard.press('ArrowRight');
    check('tab wraparound ' + viewport.width, await page.locator('#ecom-tab-agents').getAttribute('aria-selected') === 'true');
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Home');
    check('tab Home and roving focus ' + viewport.width, await page.evaluate(() => document.activeElement?.id === 'ecom-tab-agents' && document.querySelectorAll('.dir-ecom-tabs [tabindex="0"]').length === 1));
    await page.locator('#ecom-tab-skills').click();
    await page.waitForFunction(() => new URLSearchParams(location.search).get('tab') === 'skills');
    check('skill tab ' + viewport.width, await page.locator('#ecom-panel').getAttribute('aria-labelledby') === 'ecom-tab-skills');
    await page.locator('#ecom-q').fill('When should I refresh my Meta ads?');
    await page.locator('#ecom-ask button[type="submit"]').click();
    await page.waitForFunction(() => { const x = document.querySelector('.dir-ecom-results'); return x && !x.textContent.includes('Looking for cards') && x.textContent.trim(); });
    check('library evidence response ' + viewport.width, await page.locator('.dir-ecom-answer').count() > 0 || await page.getByText('The library has no clear answer to this', { exact: true }).count() > 0);
    await page.goto(origin + '/agents/lindsey-meta-media-buyer', { waitUntil: 'networkidle' });
    await page.locator('#dir-pack').waitFor();
    check('profile overflow ' + viewport.width, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const tabs = page.locator('.dir-start-tabs [role="tab"]');
    await tabs.first().click(); await page.keyboard.press('ArrowRight');
    check('app choice keyboard ' + viewport.width, await tabs.nth(1).getAttribute('aria-selected') === 'true');
    check('download visible ' + viewport.width, await page.locator('#dir-pack a[download]').count() > 0);
    const profileFile = `agent-${viewport.width}.png`;
    await page.screenshot({ path: path.join(out, profileFile), fullPage: false }); report.screenshots.push(profileFile);
    await page.goto(origin + '/guides/use-an-agent-pack', { waitUntil: 'networkidle' });
    await page.locator('.dir-guide-body h1').waitFor();
    check('guide lazy load ' + viewport.width, await page.locator('.dir-guide-body h1').count() === 1 && requestedScripts.some(p => /\/guides-[^/]+\.js$/.test(p)));
    if (origin === 'http://127.0.0.1:5290') {
      for (const gatedPath of ['/ops', '/studio', '/new']) {
        const requests = []; const track = r => requests.push(new URL(r.url()).pathname);
        page.on('request', track);
        await page.goto(origin + gatedPath, { waitUntil: 'networkidle' });
        await page.getByRole('heading', { name: 'Sign in to continue', exact: true }).waitFor();
        check('signed-out gate ' + gatedPath + ' ' + viewport.width, !requests.some(p => /^\/api\/(?:ops|studio|requests)\b/.test(p)), requests);
        page.off('request', track);
      }
    }
    await context.close();
  }
  // Exercise a failed chunk request and recovery without changing the server or an account.
  const retryContext = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await retryContext.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
  const blockGuide = route => route.abort();
  await retryContext.route('**/guides-*.js', blockGuide);
  const retryPage = await retryContext.newPage();
  await retryPage.goto(origin + '/guides/use-an-agent-pack', { waitUntil: 'networkidle' });
  await retryPage.getByRole('heading', { name: 'We could not load this page', exact: true }).waitFor();
  check('failed page has recovery action', await retryPage.getByRole('button', { name: 'Reload the page', exact: true }).isVisible());
  await retryContext.unroute('**/guides-*.js', blockGuide);
  await retryPage.getByRole('button', { name: 'Reload the page', exact: true }).click();
  await retryPage.locator('.dir-guide-body h1').waitFor();
  check('failed chunk recovers on reload', await retryPage.locator('.dir-guide-body h1').count() === 1);
  await retryContext.close();
  // The deferred pack renderer must retain its stricter untrusted-document policy.
  const markdownContext = await browser.newContext({ serviceWorkers: 'block' });
  const externalMedia = [];
  await markdownContext.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).hostname === 'markdown-probe.invalid') { externalMedia.push(request.url()); return route.abort(); }
    return ['GET', 'HEAD', 'OPTIONS'].includes(request.method()) ? route.continue() : route.abort();
  });
  await markdownContext.route('**/packs/lindsey-meta-media-buyer/README.md', route => route.fulfill({
    contentType: 'text/plain; charset=utf-8', body: '# Safe pack document\n\n<script>window.markdownProbe = true</script>\n<img src="https://markdown-probe.invalid/pixel" onerror="window.markdownProbe=true">\n<iframe src="https://markdown-probe.invalid/frame"></iframe>\n<form><input value="unsafe"></form>\n<style>body{display:none}</style>\n<svg onload="window.markdownProbe=true"></svg>\n<a href="javascript:window.markdownProbe=true" onclick="window.markdownProbe=true" style="color:red">Unsafe link</a>\n\n[External reference](https://example.com/reference)\n\n[Browse agents](/e-commerce)'
  }));
  const markdownPage = await markdownContext.newPage();
  markdownPage.on('pageerror', e => report.pageErrors.push({ scope: 'pack Markdown', message: e.message }));
  await markdownPage.goto(origin + '/agents/lindsey-meta-media-buyer/files/README.md', { waitUntil: 'networkidle' });
  await markdownPage.locator('.dir-file-prose h1').waitFor();
  const sanitized = await markdownPage.locator('.dir-file-prose').evaluate(el => ({
    unsafeElements: el.querySelectorAll('script,img,picture,iframe,form,input,style,svg,object,embed').length,
    unsafeAttributes: [...el.querySelectorAll('*')].flatMap(n => [...n.attributes]).filter(a => /^on/i.test(a.name) || a.name === 'style' || /^javascript:/i.test(a.value)).length,
    executed: !!window.markdownProbe,
    external: [...el.querySelectorAll('a')].find(a => a.textContent === 'External reference')?.outerHTML
  }));
  check('pack Markdown removes active content', !sanitized.unsafeElements && !sanitized.unsafeAttributes && !sanitized.executed && !externalMedia.length, { ...sanitized, externalMedia });
  const externalLink = markdownPage.getByRole('link', { name: 'External reference', exact: true });
  check('pack external links are isolated', await externalLink.getAttribute('target') === '_blank' && await externalLink.getAttribute('rel') === 'noopener noreferrer');
  await markdownPage.locator('.dir-file-prose').getByRole('link', { name: 'Browse agents', exact: true }).click();
  await markdownPage.locator('#ecom-find').waitFor();
  check('pack internal link navigation', new URL(markdownPage.url()).pathname === '/e-commerce');
  await markdownContext.close();
  check('no browser errors', report.pageErrors.length === 0, report.pageErrors);
} catch (error) {
  report.failures.push(String(error.stack ?? error));
} finally {
  await browser?.close();
  report.status = report.failures.length ? 'FAIL' : 'PASS'; report.completedAt = new Date().toISOString();
  await fs.writeFile(path.join(out, 'summary.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, checks: report.checks.length, failures: report.failures }));
  process.exitCode = report.status === 'PASS' ? 0 : 1;
}
