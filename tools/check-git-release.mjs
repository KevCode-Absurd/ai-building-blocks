// Scan pending release files against known local credentials without printing values.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { loadWorkflowEnv } from './lib/workflow-env.mjs';
const git = args => execFileSync('git', ['-c', 'core.longpaths=true', ...args], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, windowsHide: true });
const privateValues = new Set();
const add = (key, value) => { if (/SECRET|TOKEN|SALT|API_KEY|JWT_KEY|ownerKey|shareToken/i.test(key) && typeof value === 'string' && value.length >= 20) privateValues.add(value); };
for (const [key, value] of Object.entries(loadWorkflowEnv(process.cwd()))) add(key, value);
for (const file of ['site/.env.local', 'site/.env.clerk.production.local']) if (fs.existsSync(file)) {
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (match) add(match[1], match[2].replace(/^["']|["']$/g, ''));
  }
}
for (const file of ['site/.wrangler/staging-secrets.json', 'site/.wrangler/production-secrets.json', 'site/.wrangler/staging-live-fixtures.json']) if (fs.existsSync(file)) {
  for (const [key, value] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))) add(key, value);
}
const oauthPath = path.join(process.env.APPDATA || '', 'xdg.config/.wrangler/config/default.toml');
if (fs.existsSync(oauthPath)) for (const match of fs.readFileSync(oauthPath, 'utf8').matchAll(/^(oauth_token|refresh_token)\s*=\s*"([^"\r\n]+)"/gm)) add(match[1], match[2]);
const files = [...new Set([...git(['diff', '--name-only', '--diff-filter=ACMRT', 'HEAD', '-z']).split('\0'), ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0')].filter(Boolean))];
const leaks = [], forbidden = [];
let scanned = 0;
for (const file of files) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
  if (/(^|\/)(\.env(?!\.example$)|\.wrangler)(\/|$)|(^|\/)trace\.zip$/.test(file)) forbidden.push(file);
  const bytes = fs.readFileSync(file);
  if (bytes.includes(0)) continue;
  scanned++;
  const text = bytes.toString('utf8');
  if ([...privateValues].some(value => text.includes(value))) leaks.push(file);
}
const report = { checkedOn: new Date().toISOString(), scope: 'modified and untracked release files eligible for Git', candidateFiles: files.length, textFilesScanned: scanned, knownPrivateValuesChecked: privateValues.size, leaks, forbidden, status: leaks.length || forbidden.length ? 'fail' : 'pass', secretValuesPrinted: false };
fs.writeFileSync('reports/git-release-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
assert.equal(leaks.length + forbidden.length, 0, 'Resolve release-file credential findings before publishing.');
