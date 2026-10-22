// Read-only checks that the deployed HTML, SEO assets and runtime flags match.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const [environment, directory] = process.argv.slice(2);
assert(['staging', 'production'].includes(environment));
const origin = environment === 'staging' ? 'https://ai-building-blocks-staging.kevinmark7498.workers.dev' : 'https://useaiblocks.com';
const assets = path.resolve(directory), checks = [];
const preview = environment === 'staging' ? JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN : null;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function get(route, authenticated = true) {
  return fetch(origin + route, { headers: preview && authenticated ? { 'x-preview-access': preview } : {}, redirect: 'manual', signal: AbortSignal.timeout(30000) });
}
for (const [route, file] of [['/', 'index.html'], ['/space', 'space.html'], ['/people', 'people.html'], ['/compose', 'compose.html'], ['/support', 'support.html'], ['/privacy', 'privacy.html'], ['/tools/growth-channel-planner', 'tools/growth-channel-planner.html'], ['/tools/word-counter', 'tools/word-counter.html'], ['/data/blocks.json', 'data/blocks.json'], ['/metadata/tools.json', 'metadata/tools.json'], ['/metadata/space.json', 'metadata/space.json'], ['/favicon-96.png', 'favicon-96.png'], ['/favicon.ico', 'favicon.ico'], ['/apple-touch-icon.png', 'apple-touch-icon.png'], ['/site.webmanifest', 'site.webmanifest'], ['/sitemap.xml', 'sitemap.xml'], ['/analytics.js', 'analytics.js']]) {
  const response = await get(route); assert.equal(response.status, 200, route);
  assert.equal(sha(Buffer.from(await response.arrayBuffer())), sha(await fs.readFile(path.join(assets, file))), route + ' differs from the frozen release');
  checks.push(route + ' exact frozen bytes');
}
for (const route of ['/space', '/s/unissued-seo-release-check', '/metadata/tools.json']) {
  const response = await get(route); assert.equal(response.status, 200, route);
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/, route);
  checks.push(route + ' noindex header');
}
const ai = await get('/api/compose'); assert.deepEqual(await ai.json(), { enabled: environment === 'production' }); checks.push('AI flag matches approved environment');
const auth = await get('/api/auth'); const config = await auth.json(); assert.equal(config.configured, true); assert.match(config.publishableKey, environment === 'production' ? /^pk_live_/ : /^pk_test_/); checks.push('environment-specific public Clerk configuration preserved');
const redirect = await get('/traction?source=seo-release'); assert.equal(redirect.status, 301); assert.equal(new URL(redirect.headers.get('location'), origin).href, origin + '/tools/growth-channel-planner?source=seo-release'); checks.push('Growth canonical301 preserves query');
if (environment === 'staging') { const denied = await get('/', false); assert([401, 403, 404].includes(denied.status)); checks.push('staging remains private'); }
const report = { checkedOn: new Date().toISOString(), environment, origin, assets, status: 'pass', passed: checks.length, readOnly: true, providerCalls: 0, checks };
await fs.writeFile(`reports/cloudflare-r10-${environment}-frozen-checks.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
