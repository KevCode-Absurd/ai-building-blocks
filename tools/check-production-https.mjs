import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const checks = [];
for (const host of ['useaiblocks.com', 'www.useaiblocks.com']) {
  const url = 'http://' + host + '/compose?security-check=1';
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  const location = response.headers.get('location');
  assert.equal(response.status, 301);
  assert.equal(location, 'https://useaiblocks.com/compose?security-check=1');
  checks.push({ url, status: response.status, location });
}
const report = { checkedOn: new Date().toISOString(), zone: 'useaiblocks.com', setting: 'always_use_https', enabledVia: 'authenticated Cloudflare Edge Certificates UI; switch confirmed on', initialFinding: 'HTTP apex returned200 before the setting was enabled', apiAttempt: 'OAuth zone-settings read returned403; no API setting mutation', status: 'pass', checks };
await fs.writeFile('reports/cloudflare-production-https.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
