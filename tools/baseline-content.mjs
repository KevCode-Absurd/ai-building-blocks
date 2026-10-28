// One-time, read-only live comparison before adopting content hashes. No submission is sent.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fingerprints } from '../site/scripts/stamp-content.mjs';
import { sha256 } from '../site/scripts/lib/content-stamps.mjs';
import { readSitemaps, SITE } from './indexnow-ping.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', ['-c', 'core.longpaths=true', ...args], { cwd: root, encoding: 'utf8', maxBuffer: 16 << 20 }).trim();
export async function baselineContent({ source, get = fetch, write = false } = {}) {
  if (!/^[a-f0-9]{9,40}$/.test(source ?? '')) throw Error('An explicitly verified published --source revision is required');
  const published = git('rev-parse', source), head = git('rev-parse', 'HEAD');
  const lastFiles = git('diff-tree', '--no-commit-id', '--name-only', '-r', head);
  if (lastFiles !== 'tools/indexnow-state.json' || git('rev-parse', 'HEAD^') !== published) throw Error('HEAD must be the published source followed by its state-only commit');
  const inputs = ['catalogue-items', 'mini-tools', 'tools/orchestrator-pages', 'site/src/tools', 'site/src/lib/seo-meta.mjs', 'site/src/lib/site-info.mjs', 'site/src/lib/catalogue-taxonomy.mjs', 'site/scripts/prerender.mjs', 'site/scripts/build-usability-help.mjs', 'site/scripts/build-home-initial-shell.mjs'];
  if (git('diff', published, '--', ...inputs) || git('ls-files', '--others', '--exclude-standard', '--', ...inputs)) throw Error('Published renderer or content inputs changed; baseline cannot be inferred');
  const dist = path.join(root, 'site/dist'), stateFile = path.join(root, 'tools/indexnow-state.json');
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  if (state.fingerprints && (state.source_commit || state.fingerprint_baseline?.source_commit !== published)) throw Error('A later publication baseline already exists');
  const response = await get(`${SITE}/data/public-api-manifest.json`);
  if (!response.ok) throw Error(`Published manifest HTTP ${response.status}`);
  const live = Buffer.from(await response.arrayBuffer()), local = fs.readFileSync(path.join(dist, 'data/public-api-manifest.json'));
  if (sha256(live) !== sha256(local)) throw Error('Local package manifest differs from production');
  const remote = await readSitemaps(SITE, { warn: message => { throw Error(message); } });
  const publication = fingerprints(dist);
  if (remote.size !== publication.urls.size || remote.size !== Object.keys(state.urls).length || [...remote].some(([url, date]) => publication.urls.get(url) !== date || state.urls[url] !== date)) throw Error('Published sitemaps, local build and saved state differ');
  const next = { ...state, fingerprints: publication.hashes, fingerprint_baseline: { source_commit: published, manifest_sha256: sha256(live), verified_at: new Date().toISOString(), method: 'Exact published manifest and sitemap match; unchanged published renderer/content inputs.' } };
  if (write) fs.writeFileSync(stateFile, JSON.stringify(next, null, 1) + '\n');
  console.log(`${write ? 'Saved' : 'Verified'} published baseline for ${remote.size} URLs; no URLs submitted.`);
  return next;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) baselineContent({ source: process.argv[process.argv.indexOf('--source') + 1], write: process.argv.includes('--write') }).catch(error => { console.error(error.message); process.exitCode = 1; });
