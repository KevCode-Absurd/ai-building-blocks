// Inspect the actual upload tree without ever printing a credential or match.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { loadWorkflowEnv } from './lib/workflow-env.mjs';
const assets = path.resolve(process.argv[2] || '');
assert(assets.startsWith(path.resolve('site/.wrangler/releases') + path.sep));
const secrets = new Set(Object.entries(loadWorkflowEnv(process.cwd())).filter(([key, value]) => /API_KEY|SECRET|SALT|JWT_KEY/.test(key) && typeof value === 'string' && value.length >= 20).map(([, value]) => value));
for (const file of ['site/.env.local', 'site/.env.clerk.production.local']) if (fs.existsSync(file)) for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && /API_KEY|SECRET|SALT|JWT_KEY/.test(m[1])) { const value = m[2].replace(/^["']|["']$/g, ''); if (value.length >= 20) secrets.add(value); }
}
for (const file of ['site/.wrangler/staging-secrets.json', 'site/.wrangler/production-secrets.json']) if (fs.existsSync(file)) for (const [key, value] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))) if (/SECRET|TOKEN|API_KEY|SALT|JWT_KEY/.test(key) && typeof value === 'string' && value.length >= 20) secrets.add(value);
let scanned = 0;
for (const file of fs.readdirSync(assets, { recursive: true, withFileTypes: true })) if (file.isFile() && /\.(?:html|js|mjs|json|txt|xml|md|css)$/.test(file.name)) {
  const bytes = fs.readFileSync(path.join(file.parentPath, file.name)); scanned++;
  for (const secret of secrets) assert(!bytes.includes(Buffer.from(secret)), 'A configured private value was found in the client upload tree.');
}
const report = { checkedOn: new Date().toISOString(), status: 'pass', assets, scannedTextAssets: scanned, configuredPrivateValuesChecked: secrets.size, secretValuesPrinted: false };
fs.writeFileSync('reports/client-secrets-check.json', JSON.stringify(report, null, 2) + '\n'); console.log(JSON.stringify(report));
