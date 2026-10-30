// Build-only publication metadata. Never loaded by the application.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CONTENT_SCHEMA, contentFingerprint, newestLastmod, sha256, stableJson, selectLastmod, stampHtmlDate } from './lib/content-stamps.mjs';
import { parseIndex, parseUrlset, SITE } from '../../tools/indexnow-ping.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const git = (...args) => execFileSync('git', ['-c', 'core.longpaths=true', ...args], { cwd: root, encoding: 'utf8', maxBuffer: 16 << 20 });
export function localPath(dist, url) {
  const parsed = new URL(url);
  if (parsed.origin !== SITE || parsed.search || parsed.hash || /%|\\/.test(parsed.pathname)) throw Error('Invalid publication URL');
  const file = path.resolve(dist, '.' + parsed.pathname);
  if (file !== path.resolve(dist) && !file.startsWith(path.resolve(dist) + path.sep)) throw Error('Publication path escaped dist');
  return file;
}
function htmlFile(dist, url) {
  const file = localPath(dist, url);
  return fs.existsSync(file + '.html') ? file + '.html' : path.join(file, 'index.html');
}
export function readPublication(dist) {
  const children = parseIndex(fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8'));
  if (!children.length) throw Error('Empty sitemap index');
  const maps = children.map(url => ({ url, file: localPath(dist, url) }));
  const entries = maps.flatMap(map => parseUrlset(fs.readFileSync(map.file, 'utf8')));
  if (new Set(entries.map(([url]) => url)).size !== entries.length) throw Error('Duplicate publication URL');
  return { maps, urls: new Map(entries) };
}
export function fingerprints(dist) {
  const publication = readPublication(dist);
  const manifest = readJson(path.join(dist, 'data/public-api-manifest.json'));
  const resources = manifest.resources;
  const toolDir = path.join(root, 'site/src/tools');
  // These tool pages share code. Include the imported agency helpers and UI, not only their short metadata rows.
  const toolSource = sha256(fs.readdirSync(toolDir).filter(name => /\.(?:mjs|tsx?|css)$/.test(name)).sort().map(name => `${name}\n${fs.readFileSync(path.join(toolDir, name), 'utf8')}`).join('\n'));
  const hashes = {};
  for (const [url] of publication.urls) {
    const file = htmlFile(dist, url);
    const html = fs.readFileSync(file, 'utf8'), pathname = new URL(url).pathname;
    const slug = pathname.split('/').at(-1), own = /^\/(skills|workflows|agents|prompts|minds)\//.test(pathname) ? resources[slug]?.revision_sha256 : '';
    const extras = {};
    if (/^\/roles(?:\/|$)/.test(pathname)) {
      if (pathname === '/roles' || pathname.startsWith('/roles/page/')) extras.roles = sha256(fs.readFileSync(path.join(dist, 'data/roles-index.json')));
      else extras.role = sha256(fs.readFileSync(path.join(dist, 'data/roles', slug + '.json')));
      extras.roleMembers = [...html.matchAll(/href="\/(?:skills|workflows|agents|prompts|minds)\/([a-z0-9-]+)"/g)].map(m=>m[1]).filter(s=>resources[s]).sort().map(s=>[s,resources[s].revision_sha256]);
    }
    // Collection pages inherit their listed package changes, even when their short card text is unchanged.
    if (/^\/jobs(?:\/|$)/.test(pathname) || /^\/(skills|workflows|agents|prompts|minds)$/.test(pathname) || /^\/minds\/page\/[1-9]\d*$/.test(pathname)) {
      extras.members = [...html.matchAll(/href="\/(?:skills|workflows|agents|prompts|minds)\/([a-z0-9-]+)"/g)].map(match => match[1]).filter(name => resources[name]).sort().map(name => [name, resources[name].revision_sha256]);
    }
    if (/^\/tools\//.test(pathname)) {
      extras.browserToolCode = toolSource;
      extras.downloads = [...new Set([...html.matchAll(/href="(\/mini-tools\/[^"?#]+)"/g)].map(match => match[1]))].sort().map(url => [url, sha256(fs.readFileSync(localPath(dist, SITE + url)))]);
    }
    hashes[url] = contentFingerprint(html, own, extras);
  }
  return { ...publication, hashes };
}
export function stampContent({ dist = path.join(root, 'site/dist'), state = path.join(root, 'tools/indexnow-state.json') } = {}) {
  const previous = readJson(state), publication = fingerprints(dist);
  if (!previous.fingerprints) throw Error('Content fingerprint baseline required before stamping; see tools/baseline-content.mjs');
  const sourceCommit = git('rev-parse', 'HEAD').trim(), sourceTime = git('show', '-s', '--format=%cI', 'HEAD').trim();
  const dirty = git('status', '--porcelain', '--untracked-files=all').split(/\r?\n/).filter(line => line && line.slice(3) !== 'tools/indexnow-state.json').length > 0;
  const urls = {};
  for (const [url, hash] of Object.entries(publication.hashes)) {
    const lastmod = selectLastmod({ hash, previousHash: previous.fingerprints[url], previousDate: previous.urls[url] ?? '', sourceTime: dirty ? '' : sourceTime });
    urls[url] = { sha256: hash, lastmod };
    const file = htmlFile(dist, url);
    fs.writeFileSync(file, stampHtmlDate(fs.readFileSync(file, 'utf8'), lastmod));
  }
  for (const map of publication.maps) {
    const xml = fs.readFileSync(map.file, 'utf8').replace(/<url>([\s\S]*?)<\/url>/g, (all, body) => {
      const [[url]] = parseUrlset(all), lastmod = urls[url].lastmod;
      return `<url>${body.replace(/<lastmod>[\s\S]*?<\/lastmod>/g, '')}${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    });
    fs.writeFileSync(map.file, xml);
  }
  const indexFile = path.join(dist, 'sitemap.xml');
  fs.writeFileSync(indexFile, fs.readFileSync(indexFile, 'utf8').replace(/<sitemap>([\s\S]*?)<\/sitemap>/g, (all, body) => {
    const [url] = parseIndex(`<sitemap>${body}</sitemap>`), file = localPath(dist, url);
    const lastmod = newestLastmod(parseUrlset(fs.readFileSync(file, 'utf8')).map(([, date]) => date));
    return `<sitemap>${body.replace(/<lastmod>[\s\S]*?<\/lastmod>/g, '')}${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</sitemap>`;
  }));
  fs.writeFileSync(path.join(dist, 'data/content-fingerprints.json'), stableJson({ schema: CONTENT_SCHEMA, source_commit: dirty ? null : sourceCommit, source_time: dirty ? null : sourceTime, dirty, urls }) + '\n');
  console.log(`Content stamps: ${Object.keys(urls).length} URLs; ${dirty ? 'preview (uncommitted source)' : sourceCommit.slice(0, 9)}.`);
  return urls;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) stampContent();
