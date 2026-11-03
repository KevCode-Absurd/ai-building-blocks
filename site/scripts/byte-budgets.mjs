#!/usr/bin/env node
// Release gate: the files every visit downloads must not quietly grow. Measures the production build in site/dist:
// the main code and styles that index.html loads on every page, and the data file each kind of page fetches first.
// Budgets are raw bytes, set 10-25% above the 3 Nov 2026 build (main code 168 KB, styles 273 KB, catalogue 4,373 KB),
// so pages that get lighter pass more easily. Raise one only on purpose, in the same change that makes the file
// bigger, and say why. It also checks that every inline script in a sample of built pages has its sha256 in the
// Content-Security-Policy-Report-Only header (public/_headers), and prints any missing hash to add there.
// Prints a JSON report; exits 1 when a file is over budget or missing, or a script hash is missing.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const KB = 1024;
// [name, what to measure, budget in bytes]. A pattern measures the largest matching file in that folder.
export const BUDGETS = [
  ['Main code (entry script)', {entry: 'script'}, 200 * KB],
  ['Main styles', {entry: 'style'}, 310 * KB],
  ['Home: starter picks', {file: 'data/starter-blocks.json'}, 80 * KB],
  ['Home: library list', {file: 'data/blocks-index.json'}, 2_400 * KB],
  ['Catalogue pages: full catalogue', {dir: 'data', pattern: /^blocks(\.[\w-]+)?\.json$/}, 4_800 * KB],
  ['Item page: largest item data', {dir: 'data/items', pattern: /\.json$/}, 260 * KB],
  ['Roles: first page', {file: 'data/roles-starter.json'}, 270 * KB],
  ['Role page: largest role data', {dir: 'data/role-views', pattern: /\.json$/}, 50 * KB],
  ['Minds: first page', {file: 'data/minds-starter.json'}, 320 * KB],
];

/** The hashed entry script and stylesheets that dist/index.html loads on every page. */
export function entryFiles(dist) {
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  // Most pages start the entry as a module script; the home page preloads it and starts it later (build-home-initial-shell).
  const script = [
    ...html.matchAll(/<script\b[^>]*type="module"[^>]*\ssrc="(\/assets\/[^"]+\.js)"/g),
    ...html.matchAll(/<link\b[^>]*rel="modulepreload"[^>]*href="(\/assets\/[^"]+\.js)"[^>]*data-home-entry/g),
  ].map(m => m[1]);
  const style = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"/g)].map(m => m[1]);
  return {script: [...new Set(script)], style: [...new Set(style)]};
}

function measure(dist, target, entries) {
  if (target.entry) {
    const files = entries[target.entry];
    if (!files.length) return {error: 'index.html loads no ' + target.entry};
    const bytes = files.map(file => fs.readFileSync(path.join(dist, file)));
    return {files, bytes: bytes.reduce((sum, b) => sum + b.length, 0), brotli: bytes.reduce((sum, b) => sum + zlib.brotliCompressSync(b).length, 0)};
  }
  if (target.file) {
    const file = path.join(dist, target.file);
    return fs.existsSync(file) ? {files: ['/' + target.file], bytes: fs.statSync(file).size} : {error: 'missing /' + target.file};
  }
  const dir = path.join(dist, target.dir);
  if (!fs.existsSync(dir)) return {error: 'missing /' + target.dir};
  let largest = null;
  for (const name of fs.readdirSync(dir)) {
    if (!target.pattern.test(name)) continue;
    const size = fs.statSync(path.join(dir, name)).size;
    if (!largest || size > largest.bytes) largest = {files: [`/${target.dir}/${name}`], bytes: size};
  }
  return largest ?? {error: `no file in /${target.dir}`};
}

/** Measure every budget. Returns the rows and whether all passed. */
export function checkBudgets(dist, budgets = BUDGETS) {
  const entries = entryFiles(dist);
  const rows = budgets.map(([name, target, budget]) => {
    const result = measure(dist, target, entries);
    const ok = !result.error && result.bytes <= budget;
    return {name, ok, budget, ...result, ...(result.error ? {} : {headroom: budget - result.bytes})};
  });
  return {ok: rows.every(row => row.ok), rows};
}

/** Inline scripts in a sample of built pages whose sha256 is missing from the report-only policy in dist/_headers. */
export function missingScriptHashes(dist, pages = ['index.html', '404.html', 'tools.html', 'compose.html']) {
  const headers = fs.readFileSync(path.join(dist, '_headers'), 'utf8');
  const policy = /Content-Security-Policy-Report-Only:([^\r\n]*)/.exec(headers)?.[1] ?? '';
  const allowed = new Set([...policy.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map(m => m[1]));
  const sample = [...pages];
  const skills = path.join(dist, 'skills');
  if (fs.existsSync(skills)) {
    // One item page; opendir reads a single entry instead of listing thousands.
    const dir = fs.opendirSync(skills);
    for (let entry = dir.readSync(); entry; entry = dir.readSync()) if (entry.name.endsWith('.html')) { sample.push('skills/' + entry.name); break; }
    dir.closeSync();
  }
  const missing = [];
  let checked = 0;
  for (const page of sample) {
    const file = path.join(dist, page);
    if (!fs.existsSync(file)) continue;
    for (const [, attrs = '', code] of fs.readFileSync(file, 'utf8').matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
      if (/\ssrc=/.test(attrs) || /type="(?!module|text\/javascript)/.test(attrs)) continue;
      checked++;
      const hash = `'sha256-${createHash('sha256').update(code).digest('base64')}'`;
      if (!allowed.has(hash.slice(8, -1)) && !missing.some(m => m.hash === hash)) missing.push({page, hash});
    }
  }
  return {checked, missing};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dist = path.resolve(fileURLToPath(new URL('../dist', import.meta.url)));
  const {ok, rows} = checkBudgets(dist);
  console.log(JSON.stringify(rows.map(({name, ok, bytes, brotli, budget, headroom, error, files}) => ({name, ok, kb: bytes && Math.round(bytes / KB), brotliKb: brotli && Math.round(brotli / KB), budgetKb: Math.round(budget / KB), headroomKb: headroom !== undefined ? Math.round(headroom / KB) : undefined, error, files: files?.length > 3 ? files.length : files})), null, 2));
  if (!ok) { console.error('Over budget: ' + rows.filter(row => !row.ok).map(row => row.name + (row.error ? ` (${row.error})` : '')).join('; ')); process.exitCode = 1; }
  const scripts = missingScriptHashes(dist);
  console.log(JSON.stringify({inlineScriptsChecked: scripts.checked, missingHashes: scripts.missing}));
  if (scripts.missing.length) { console.error('Add these to script-src in the Content-Security-Policy-Report-Only line of site/public/_headers: ' + scripts.missing.map(m => m.hash).join(' ')); process.exitCode = 1; }
}
