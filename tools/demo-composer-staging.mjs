// Visible test browser for the user's staging demonstration. No tokens in URLs or files.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(new URL('../site/package.json', import.meta.url));
const { chromium, expect } = require('@playwright/test');
const { unzipSync, strFromU8 } = require('fflate');
if (!process.env.CF_STAGING_VERSION || !process.env.COMPOSER_DEMO_DIR) throw Error('Provide the confirmed staging version and a local demonstration directory.');
const origin = stagingTarget();
const token = JSON.parse(fs.readFileSync(path.join(root, 'site/.wrangler/staging-secrets.json'), 'utf8')).PREVIEW_ACCESS_TOKEN;
assert(typeof token === 'string' && token.length >= 32);
const out = path.resolve(process.env.COMPOSER_DEMO_DIR);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: false });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
context.setDefaultTimeout(30000); context.setDefaultNavigationTimeout(45000);
await context.route('**/*', route => {
  const request = route.request(), headers = { ...request.headers() };
  delete headers['x-preview-access'];
  if (new URL(request.url()).origin === origin) headers['x-preview-access'] = token;
  return route.continue({ headers });
});
const errors = [], cases = [], failedRequests = []; let modelPosts = 0;
context.on('page', page => {
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', req => { if (new URL(req.url()).origin === origin && new URL(req.url()).pathname === '/api/compose' && req.method() === 'POST') modelPosts++; });
  page.on('response', response => { if (response.status() >= 400) failedRequests.push({ path: new URL(response.url()).pathname, status: response.status() }); });
  page.on('requestfailed', req => failedRequests.push({ path: new URL(req.url()).pathname, error: req.failure()?.errorText }));
});
async function start(goal) {
  const page = await context.newPage(); await page.goto(origin + '/compose');
  await page.getByTestId('compose-goal').fill(goal); await page.getByTestId('compose-submit').click();
  await expect(page.getByTestId('compose-steps')).toBeVisible();
  console.log(JSON.stringify({ request: goal, renderedGoal: await page.getByTestId('compose-goal').inputValue(), steps: await page.getByTestId('compose-steps').getByRole('link').allTextContents() }));
  return page;
}
async function pack(page, name) {
  await page.screenshot({ path: path.join(out, name + '-before-download.png'), fullPage: true });
  const promise = page.waitForEvent('download', { timeout: 45000 }); await page.getByTestId('compose-download').click();
  const download = await Promise.race([promise, page.getByRole('alert').waitFor({ state: 'visible', timeout: 45000 }).then(async () => { throw Error(await page.getByRole('alert').innerText()); })]);
  const target = path.join(out, name + '.zip'); await download.saveAs(target);
  const files = unzipSync(fs.readFileSync(target));
  const editable = JSON.parse(strFromU8(files['workflow.edit.json']));
  for (const step of editable.plan.steps) assert(files[`skills/${step.slug}/SKILL.md`], step.slug);
  assert(files['README.md'] && files['HANDOFF.md'] && files['inputs.json']);
  cases.push({ name, request: editable.goal, steps: editable.plan.steps.map(s => s.slug), fileCount: Object.keys(files).length, pack: path.basename(target) });
  return { files, editable };
}
try {
  const free = await start('Create a wedding budget with editable cost categories and leave unknown prices blank');
  assert.equal(await free.getByLabel('Voice language', { exact: true }).count(), 0, 'The final staging demo must use the requested English-only voice UI.');
  await expect(free.getByTestId('compose-steps')).toContainText('Request acceptance checker');
  await pack(free, 'free-general-workflow');
  await free.screenshot({ path: path.join(out, '01-free-general-planner.png'), fullPage: true });
  await free.evaluate(() => window.scrollTo(0, 0));
  await free.screenshot({ path: path.join(out, '00-free-overview.png') });

  const library = await start('Build a landing page from scratch and deliver source code');
  const step = library.getByTestId('compose-steps').locator(':scope > li').filter({ has: library.getByRole('link', { name: 'Technical SEO auditor', exact: true }) });
  await step.click({ button: 'right' }); await library.getByRole('menuitem', { name: 'Replace skill…' }).click();
  const dialog = library.getByRole('dialog');
  await dialog.getByLabel('Search repository skills').fill('on-page-seo-tuner');
  await dialog.getByRole('button').filter({ hasText: 'On-page SEO tuner' }).first().click();
  await library.screenshot({ path: path.join(out, '02-library-replacement-preview.png') });
  await dialog.getByRole('button', { name: 'Replace skill', exact: true }).click();
  await expect(library.getByTestId('compose-steps')).toContainText('On-page SEO tuner');
  const landingPack = await pack(library, 'landing-page-library-replacement');
  const landingSlugs = landingPack.editable.plan.steps.map(s => s.slug);
  assert.equal(landingSlugs.length, 10);
  assert(!landingSlugs.includes('copilot-resx-source-generator-migration'));
  assert(!landingSlugs.includes('website-brand-brain-builder'));
  assert(landingSlugs.includes('on-page-seo-tuner'));
  await library.screenshot({ path: path.join(out, '03-library-skill-replaced.png'), fullPage: true });

  const custom = await start('Create a wedding budget');
  await custom.getByRole('button', { name: 'Replace step 2', exact: true }).click();
  const upload = custom.getByRole('dialog'); await upload.getByText('Upload your own skill', { exact: true }).click();
  const source = '---\nname: My budget drafting skill\ndescription: Draft an editable budget from verified costs.\n---\n# My budget drafting skill\nRead the agreed requirements. Create budget.csv with category, supplier, quantity, unit price, currency and total. Keep unknown prices blank. Use supplied facts only. Include base and contingency scenarios; independently check all totals. Save assumptions.md and list missing inputs. Do not book, send or spend anything.\n';
  await upload.getByLabel('Upload custom skill').setInputFiles({ name: 'SKILL.md', mimeType: 'text/markdown', buffer: Buffer.from(source) });
  await upload.getByLabel('Required input types').fill('plan'); await upload.getByLabel('Output types').fill('document');
  await custom.screenshot({ path: path.join(out, '04-custom-skill-preview.png') });
  await upload.getByRole('button', { name: 'Replace skill', exact: true }).click();
  const result = await pack(custom, 'workflow-with-my-budget-skill');
  const own = result.editable.customSkills.find(s => s.name === 'My budget drafting skill');
  assert(own && strFromU8(result.files[`skills/${own.slug}/SKILL.md`]).includes(source.slice(source.indexOf('# My'))));
  await custom.reload(); await expect(custom.getByTestId('compose-steps')).toContainText('My budget drafting skill');
  await custom.screenshot({ path: path.join(out, '05-custom-skill-restored.png'), fullPage: true });
  await custom.getByRole('button', { name: 'Open in the builder', exact: true }).click();
  const ownNode = custom.getByTestId('flow-node').filter({ hasText: 'My budget drafting skill' });
  await expect(ownNode).toBeVisible();
  await ownNode.scrollIntoViewIfNeeded();
  await custom.screenshot({ path: path.join(out, '06-custom-skill-in-builder.png') });
  await free.bringToFront();
  assert.equal(modelPosts, 0); assert.deepEqual(errors, []);
  const report = { checkedOn: new Date().toISOString(), origin, version: process.env.CF_STAGING_VERSION, status: 'pass', cases, modelPosts, errors, browser: 'Visible Chrome; preview credential attached only to staging requests; no persistent authentication storage.' };
  fs.writeFileSync(path.join(out, 'staging-demo-check.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ status: 'pass', version: report.version, cases: cases.map(c => c.name), modelPosts, errors, output: out, visibleBrowserOpen: true }));
  // Leave the authenticated demonstration available until the user closes this window.
  await new Promise(resolve => browser.once('disconnected', resolve));
} catch (error) {
  const diagnostics = { error: String(error.message).replaceAll(token, '[redacted]'), errors, failedRequests, completedCases: cases.map(c => c.name), ui: [] };
  for (const [i, page] of context.pages().entries()) {
    await page.screenshot({ path: path.join(out, `failure-${i}.png`), fullPage: true }).catch(() => {});
    diagnostics.ui.push({ url: page.url(), goal: await page.getByTestId('compose-goal').inputValue().catch(() => null), steps: await page.getByTestId('compose-steps').getByRole('link').allTextContents().catch(() => []), alerts: await page.getByRole('alert').allTextContents().catch(() => []), button: await page.getByTestId('compose-download').textContent().catch(() => null) });
  }
  fs.writeFileSync(path.join(out, 'demo-failure.json'), JSON.stringify(diagnostics, null, 2));
  console.log(JSON.stringify(diagnostics));
  await browser.close();
  throw Error(String(error.message).replaceAll(token, '[redacted]'));
}
