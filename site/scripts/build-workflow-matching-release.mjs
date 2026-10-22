// Freeze the workflow fix on the last published source, retaining published content.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import preact from '@preact/preset-vite';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const release = path.resolve(repo, process.argv[2]);
const previous = path.resolve(repo, process.argv[3]);
assert(release.startsWith(path.join(repo, 'site/.wrangler/releases') + path.sep));
const source = path.join(release, 'source');
const git = args => execFileSync('git', ['-c', 'core.longpaths=true', ...args], { cwd: repo, windowsHide: true, maxBuffer: 32 * 1024 * 1024 });
const commit = git(['rev-parse', 'HEAD']).toString().trim();
const assets = path.join(release, 'assets');
if (!process.argv.includes('--resume')) {
await assert.rejects(fs.stat(release), { code: 'ENOENT' });
await fs.mkdir(source, { recursive: true });
const archive = path.join(release, 'source.tar');
await fs.writeFile(archive, git(['archive', 'HEAD', 'site/src', 'site/functions', 'site/index.html', 'site/tsconfig.json', 'site/wrangler.example.jsonc', 'tools/lib', 'mini-tools']));
execFileSync('tar', ['-xf', archive, '-C', source], { windowsHide: true });
const overlay = ['site/src/lib/composer-core.ts', 'site/src/lib/composer-recipes.ts', 'site/src/lib/composer-intent.ts'];
for (const file of overlay) await fs.copyFile(path.join(repo, file), path.join(source, file));
const pageFile = path.join(source, 'site/src/ComposePage.tsx');
let page = await fs.readFile(pageFile, 'utf8');
const replaceOnce = (needle, replacement) => { assert.equal(page.split(needle).length, 2, needle); page = page.replace(needle, () => replacement); };
const question = '  const questions = questionsFor(goal, choices);';
replaceOnce(question, question + '\n' + `  const hasGeneralTemplate = result?.plan.source === "free" && result.plan.steps.some(s => s.slug === "request-deliverable-drafter");\n  const hasSpecialist = result?.plan.steps.some(s => !["request-acceptance-brief", "request-deliverable-drafter", "request-acceptance-checker"].includes(s.slug));`);
const ui = [
  ['<p className="small">{mode === "free" ?', `        <p className="small">{mode === "free" ? "Match your request to library skills using browser rules. Requests without a match get a general template. Choose AI composition for a tailored plan." : "Create a tailored workflow for free. Sign in to use your daily allowance. No payment details needed."}</p>`],
  ['<div className="compose-result-meta">', '          <div className="compose-result-meta"><span className="mono small">{hasGeneralTemplate ? hasSpecialist ? "PARTIAL LIBRARY MATCH" : "NO SPECIALIST MATCH" : result.model === "free" ? "FREE ASSEMBLY" : "AI COMPOSITION"}</span><span className="small">{result.model === "free" ? "$0 model cost" : `$${result.cost.toFixed(5)} model cost · ${(result.latencyMs / 1000).toFixed(1)}s`}</span></div>'],
];
for (const [marker, newLine] of ui) {
  const oldLine = page.split(/\r?\n/).find(line => line.includes(marker));
  assert(oldLine && newLine); replaceOnce(oldLine, newLine);
}
const heading = page.split(/\r?\n/).find(line => line.includes('<h2 className="h3">{result.plan.title}'));
const notice = `          {hasGeneralTemplate && <div className="compose-match-notice" role="status" data-testid="compose-unmatched"><b>{hasSpecialist ? "Part of your request needs a specialist match" : "Your request did not match a specialist workflow"}</b><p className="small">{hasSpecialist ? "Unmatched parts use" : "The steps below are"} a general brief, draft and check template. Different unmatched requests produce the same steps.</p>{available ? <button className="btn btn-dark btn-sm" onClick={() => { setMode("ai"); setError(""); }}>Use AI composition for this request</button> : <p className="small">AI composition is currently unavailable. You can replace the template steps with skills from the library.</p>}</div>}`;
assert(heading && notice); replaceOnce(heading, heading + '\n' + notice);
await fs.writeFile(pageFile, page);
await fs.appendFile(path.join(source, 'site/src/compose.css'), '\n.compose-match-notice { margin: 20px 0; padding: 16px; border: 1px solid var(--line); }\n.compose-match-notice > b { font-size: 14px; }\n.compose-match-notice p { margin: 10px 0; }\n');

await fs.cp(path.join(previous, 'assets'), assets, { recursive: true });
}
await build({ configFile: false, root: path.join(source, 'site'), publicDir: false, plugins: [preact()], build: { outDir: path.join(release, 'browser'), target: 'es2020', modulePreload: { polyfill: false }, cssCodeSplit: true, emptyOutDir: true } });
const oldHTML = await fs.readFile(path.join(previous, 'assets/index.html'), 'utf8');
const newHTML = await fs.readFile(path.join(release, 'browser/index.html'), 'utf8');
const refs = html => [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\/assets\/[^" ]+)"[^>]*>/g)].map(match => match[1]);
const oldRefs = refs(oldHTML), newRefs = refs(newHTML);
assert.equal(oldRefs.length, 2); assert.equal(newRefs.length, 2);
await fs.cp(path.join(release, 'browser/assets'), path.join(assets, 'assets'), { recursive: true });
let changedHTML = 0;
for (const entry of await fs.readdir(assets, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
  const file = path.join(entry.parentPath, entry.name), original = await fs.readFile(file, 'utf8');
  let updated = original;
  for (let i = 0; i < oldRefs.length; i++) updated = updated.replaceAll(oldRefs[i], newRefs[i]);
  if (updated !== original) { await fs.writeFile(file, updated); changedHTML++; }
}
const dryConfig = JSON.parse(await fs.readFile(path.join(source, 'site/wrangler.example.jsonc'), 'utf8'));
dryConfig.main = path.join(source, 'site/src/worker.ts'); dryConfig.assets.directory = assets;
delete dryConfig.env;
const buildConfigPath = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a163a5-f288-7b63-a7e1-d0230f42b9af/workflow-matching-build.jsonc');
await fs.writeFile(buildConfigPath, JSON.stringify(dryConfig));
async function run(args) {
  const code = await new Promise((resolve, reject) => { const child = spawn(process.execPath, args, { cwd: path.join(repo, 'site'), windowsHide: true, stdio: 'inherit', env: { ...process.env, WRANGLER_LOG_PATH: path.join(release, 'wrangler.log') } }); child.on('error', reject); child.on('exit', resolve); });
  assert.equal(code, 0);
}
await run(['node_modules/typescript/bin/tsc', '-p', path.join(source, 'site/tsconfig.json')]);
await run(['node_modules/wrangler/bin/wrangler.js', 'deploy', '--env=', '--dry-run', '--config', buildConfigPath, '--outdir', path.join(release, 'worker')]);
const config = JSON.parse(await fs.readFile(path.join(previous, 'wrangler.production.jsonc'), 'utf8'));
config.main = path.join(release, 'worker/worker.js'); config.assets.directory = assets; config.no_bundle = true;
await fs.writeFile(path.join(release, 'wrangler.production.jsonc'), JSON.stringify(config, null, 2));
const sha = async file => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const report = { createdAt: new Date().toISOString(), sourceCommit: commit, previous, release, assets, changedHTML, oldRefs, newRefs, workerSha256: await sha(config.main), catalogueSha256: await sha(path.join(assets, 'data/blocks.json')), scope: 'Published source plus workflow matching, ad review routing and explicit general-template notice; published catalogue and downloads retained.' };
await fs.writeFile(path.join(release, 'release-manifest.json'), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(repo, 'reports/workflow-matching-release.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
