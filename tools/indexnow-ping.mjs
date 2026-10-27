#!/usr/bin/env node
// Tells Bing, Yandex and the other IndexNow engines (Bing feeds ChatGPT search and Copilot) which pages are new or
// changed in the build just deployed, so they re-crawl only those (docs/ME-FILE-PRD.md §12, docs/AI-HUB-PRD.md §9).
//
// Run it by hand AFTER a production deploy, from the repo root. It never runs during a build.
//   node tools/indexnow-ping.mjs --dry-run      what would be sent, and nothing else
//   node tools/indexnow-ping.mjs                ping, then remember this build as the last one pinged
//
// It reads the sitemaps of the deployed build (site/dist by default) and compares every URL and lastmod with the copy it
// kept after the last ping (tools/indexnow-state.json). A URL is sent when it is new or its lastmod changed; nothing else.
// The first run has no copy to compare with: use --baseline to save one without pinging (or --all to send every URL).
// Options: --new <dir|origin> (default site/dist), --old <dir|origin|state.json> (default the state file),
// --state <file>, --endpoint <url> (default https://api.indexnow.org/indexnow).
// The key is the public file site/public/<key>.txt (a verification key, not a secret). No Search Console, no sitemap
// submissions: Google finds changes by re-reading the sitemap it already has.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE = "https://useaiblocks.com";
export const ENDPOINT = "https://api.indexnow.org/indexnow";
export const BATCH = 10_000;
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");

const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
/** Every <url> in a urlset as [loc, lastmod or ""]. */
export const parseUrlset = (xml) => [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => [decode(body.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim() ?? ""), body.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim() ?? ""]).filter(([loc]) => loc);
/** The child sitemap addresses in a sitemap index. */
export const parseIndex = (xml) => [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([\s\S]*?)<\/loc>[\s\S]*?<\/sitemap>/g)].map((m) => decode(m[1].trim()));

/** URL → lastmod for a whole build, read from a folder (dist or public) or a live origin. */
export async function readSitemaps(source, { warn = console.warn } = {}) {
  const remote = /^https?:\/\//.test(source);
  const read = async (name) => {
    if (remote) { const r = await fetch(new URL(name, source)); if (!r.ok) throw Error(`${name}: HTTP ${r.status}`); return r.text(); }
    return fs.readFileSync(path.join(source, name), "utf8");
  };
  const urls = new Map();
  for (const child of parseIndex(await read("sitemap.xml"))) {
    const name = new URL(child).pathname.replace(/^\//, "");
    let xml;
    try { xml = await read(name); } catch (e) { warn(`skipped ${name}: ${e.message.split("\n")[0]}`); continue; }
    for (const [loc, lastmod] of parseUrlset(xml)) urls.set(loc, lastmod);
  }
  return urls;
}

/** The URLs to send: new ones, and ones whose lastmod changed. Removed ones are only counted. */
export function diffSitemaps(previous, next, { site = SITE } = {}) {
  const changed = [], added = [];
  for (const [url, lastmod] of next) {
    if (!url.startsWith(`${site}/`) && url !== site) continue;
    if (!previous.has(url)) added.push(url);
    else if (previous.get(url) !== lastmod) changed.push(url);
  }
  const removed = [...previous.keys()].filter((u) => !next.has(u));
  return { added, changed, removed, send: [...added, ...changed] };
}
export const batches = (list, size = BATCH) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));

/** The key from site/public/<key>.txt: 32 hex characters, and the file holds exactly its own name. */
export function findKey(publicDir = path.join(repo, "site/public")) {
  const keys = fs.readdirSync(publicDir).filter((f) => /^[a-f0-9]{32}\.txt$/.test(f) && fs.readFileSync(path.join(publicDir, f), "utf8").trim() === f.slice(0, -4));
  if (keys.length !== 1) throw Error(`expected one IndexNow key file in ${publicDir}, found ${keys.length}`);
  return keys[0].slice(0, -4);
}
export const payload = (key, urlList, site = SITE) => ({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList });

const readState = (file) => new Map(Object.entries(JSON.parse(fs.readFileSync(file, "utf8")).urls ?? {}));
const writeState = (file, urls) => fs.writeFileSync(file, JSON.stringify({ note: "The sitemap URLs and lastmod of the last build pinged by tools/indexnow-ping.mjs. Written after a successful ping.", saved: new Date().toISOString(), count: urls.size, urls: Object.fromEntries([...urls].sort(([a], [b]) => a.localeCompare(b))) }, null, 1) + "\n");

export async function main(argv = process.argv.slice(2), { log = console.log, env = process.env, post = fetch } = {}) {
  if (["build", "prebuild", "postbuild", "index", "dev", "predeploy"].includes(env.npm_lifecycle_event)) throw Error("indexnow-ping runs by hand after a deploy, never as part of a build");
  const arg = (name, fallback) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : fallback; };
  const dryRun = argv.includes("--dry-run"), all = argv.includes("--all"), baseline = argv.includes("--baseline");
  const state = path.resolve(arg("--state", path.join(repo, "tools/indexnow-state.json")));
  const dist = path.join(repo, "site/dist");
  const next = await readSitemaps(arg("--new", fs.existsSync(path.join(dist, "sitemap.xml")) ? dist : path.join(repo, "site/public")));
  const oldSource = arg("--old", null);
  let previous;
  if (oldSource && !oldSource.endsWith(".json")) previous = await readSitemaps(oldSource);
  else if (fs.existsSync(oldSource ?? state)) previous = readState(oldSource ?? state);
  else if (baseline) { if (!dryRun) writeState(state, next); log(`baseline: ${next.size} URLs ${dryRun ? "would be" : ""} saved to ${path.relative(repo, state)}; nothing pinged`); return { send: [] }; }
  else if (all) previous = new Map();
  else throw Error(`no record of the last ping (${path.relative(repo, state)}). Run with --baseline to save this build without pinging, or --all to send every URL.`);
  const diff = diffSitemaps(previous, next);
  const key = findKey(arg("--public", path.join(repo, "site/public")));
  const endpoint = arg("--endpoint", ENDPOINT);
  log(`${next.size} URLs in the new sitemaps: ${diff.added.length} new, ${diff.changed.length} changed, ${diff.removed.length} gone (not sent).`);
  const groups = batches(diff.send);
  if (dryRun) {
    log(`dry run: would send ${diff.send.length} URLs in ${groups.length} request(s) to ${endpoint} with key ${key}`);
    for (const u of diff.send.slice(0, 20)) log(`  ${u}`);
    if (diff.send.length > 20) log(`  … and ${diff.send.length - 20} more`);
    return diff;
  }
  for (const [i, urlList] of groups.entries()) {
    const response = await post(endpoint, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(payload(key, urlList)) });
    // 200 = received, 202 = received and the key is still being checked. Anything else stops the run.
    if (![200, 202].includes(response.status)) throw Error(`IndexNow request ${i + 1}/${groups.length} failed: HTTP ${response.status} ${await response.text().catch(() => "")}`.trim());
    log(`sent ${urlList.length} URLs (request ${i + 1}/${groups.length}): HTTP ${response.status}`);
  }
  writeState(state, next);
  log(`saved this build's sitemap to ${path.relative(repo, state)}`);
  return diff;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(`indexnow-ping: ${e.message}`); process.exitCode = 1; });
}
