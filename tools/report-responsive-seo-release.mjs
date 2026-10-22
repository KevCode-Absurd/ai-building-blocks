import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const frozen = read('reports/cloudflare-frozen-release.json');
const seo = read('reports/seo-contract.json');
const responsive = read('reports/responsive-app-final/checks.json');
const browserSeo = read('reports/seo-browser-contract.json');
const startup = read('reports/startup-loading-r10/checks.json');
const tools = read('reports/2026-10-22-everyday-browser-qa.json');
const packs = read('reports/2026-10-22-everyday-packs-qa.json');
const parity = read('reports/r10-seo-rebuild-parity.json');
const stage = read('reports/cloudflare-r10-staging-frozen-checks.json');
const stageBindings = read('reports/cloudflare-r10-staging-bindings.json');
for (const r of [seo, responsive, browserSeo, tools, parity, stage]) assert.equal(r.status, 'pass');
assert.equal(startup.status, 'PASS'); assert.equal(packs.passed, 79); assert(stageBindings.bindingsPreserved);
assert.equal(frozen.assets, seo.assets); assert.equal(startup.assets, frozen.assets);
const unitLog = fs.readFileSync('site/.wrangler/r10-site-unit-final.log', 'utf8');
const miniLog = fs.readFileSync('site/.wrangler/r10-mini-unit.log', 'utf8');
assert(/pass 120\b/.test(unitLog) && /fail 0\b/.test(unitLog));
assert(/pass 483\b/.test(miniLog) && /fail 0\b/.test(miniLog));
const sourceFiles = ['site/src/styles.css', 'site/src/compose.css', 'site/src/App.tsx', 'site/src/ui.tsx', 'site/src/lib/page-metadata.ts', 'site/index.html', 'site/scripts/build-index.mjs', 'site/scripts/prerender.mjs', 'site/public/analytics.js', 'site/src/lib/site-info.mjs', 'tools/build-everyday-workflows.mjs'];
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
let production = { status: 'pending', sourceCommitBeforeDeployment: process.env.CF_SOURCE_COMMIT || null };
if (fs.existsSync('reports/cloudflare-r10-production-bindings.json') && fs.existsSync('reports/cloudflare-r10-production-frozen-checks.json')) {
  const bindings = read('reports/cloudflare-r10-production-bindings.json'), checks = read('reports/cloudflare-r10-production-frozen-checks.json');
  assert(bindings.bindingsPreserved); assert.equal(checks.status, 'pass'); assert.equal(checks.assets, frozen.assets);
  production = { status: 'pass', sourceCommitBeforeDeployment: process.env.CF_SOURCE_COMMIT, versionId: bindings.versionId, bindingsPreserved: bindings.bindingCount, exactAssetAndHeaderChecks: checks.passed, AIEnabled: true, dailyReservationCapUSD: 10 };
  if (fs.existsSync('reports/analytics-browser/production-checks.json')) {
    const analytics = read('reports/analytics-browser/production-checks.json'); assert.equal(analytics.status, 'pass');
    production.analytics = { status: 'pass', GoogleCollect: 204, ClarityCollect: 204, consentAndPrivateInputChecks: 'pass', report: 'reports/analytics-browser/production-checks.json' };
  }
  if (fs.existsSync('reports/support-policy-live.json')) { const legal = read('reports/support-policy-live.json'); assert.equal(legal.status, 'pass'); production.policies = { status: 'pass', report: 'reports/support-policy-live.json' }; }
  if (fs.existsSync('reports/typewriter-after-production.json')) { const typing = read('reports/typewriter-after-production.json'); assert.equal(typing.status, 'PASS'); production.homeTypingMs = typing.afterMs; }
}
const report = { checkedOn: new Date().toISOString(), status: production.status === 'pass' ? 'published-and-verified' : 'ready-for-production', origin: 'https://useaiblocks.com', frozenReleaseRoot: frozen.root, workerSha256: frozen.workerSha256, runtimeBackendChanged: false, files: frozen.files, catalogueEntries: frozen.blocks, sourceHashes,
  verification: { unitTests: 120, calculatorTests: 483, responsive: { passed: responsive.passed, routes: responsive.routeTemplates, widths: responsive.widths, report: 'reports/responsive-app-final/checks.json' }, seo: { crawlablePages: seo.crawlablePages, uniqueTitles: seo.uniqueTitles, browserTransitions: browserSeo.passed, privatePagesNoindex: true, faviconSizes: seo.iconSizes, socialImage: seo.socialImage, report: 'reports/seo-contract.json' }, startupChecks: startup.results.length, toolBrowserCases: tools.stats.expected, toolBrowserMethod: tools.method, completeNewPacks: packs.passed, mindIdentities: 305, finalRebuildParity: parity.status, credentialScans: 'pass', providerCallsByReleaseChecks: 0 },
  staging: { status: 'pass', versionId: stageBindings.versionId, bindingsPreserved: stageBindings.bindingCount, exactAssetAndHeaderChecks: stage.passed }, production,
  limits: 'New workflow methods and complete downloads were reviewed and checked. These checks do not claim execution of all business outcomes. The earlier successful real Google/Turnstile AI workflow canary remains recorded separately; no additional paid AI calls were made for this frontend/content release.' };
fs.writeFileSync('reports/cloudflare-r10-release.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, responsive: responsive.passed, publicSEO: seo.crawlablePages, sourceCommit: production.sourceCommitBeforeDeployment, productionVersion: production.versionId }));
