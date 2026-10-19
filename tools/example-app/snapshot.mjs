// Saves a running copy of the Creative Engine app (Mercatura) as static files, so the Apps page can show the
// finished app as a click-through with no server behind it. Run the app first, built with the base path
// /example-app and LLM_MODE=mock (see docs/EXAMPLE-APP.md), then:
//
//   node tools/example-app/snapshot.mjs --base http://localhost:3300/example-app --out <folder>
//
// It opens every screen it can reach from the menus, follows links into a few of each kind of detail page,
// clicks through tabs, and keeps the HTML the server sent plus every file the screen asked for. Files asked
// for with a query string (?w=320) are kept under __q/ and listed in _q/index.json; tools/example-app/finish.mjs
// rewrites the pages to use them and adds the tour bar.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(new URL("../../site/package.json", import.meta.url));
const { chromium } = require("@playwright/test");

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:3300/example-app").replace(/\/$/, "");
const OUT = path.resolve(arg("out", "example-app-raw"));
const CAP = Number(arg("cap", 4));
const MAX = Number(arg("max", 500));
const BRAND = arg("brand", "gruns");
const { origin, pathname: PREFIX } = new URL(BASE);

// How many pages of each kind to keep. A kind is the path with its ids taken out (/scripts/:id).
const CAPS = { "/production?job": 12, "/studio/creator?script": 3, "/references/:id": 16, "/references/:id/make": 2, "/scripts/:id": 8, "/studio/:id": 8, "/guide/:id": 30, "/learning/:id": 12, "/learning/:id/:id": 6, "/formats/:id": 6, "/inspect/call/:id": 2, "/inspect/file/*": 1, "/skills/file/*": 2, "/costs/:id/:id": 2, "/inspect/step/:id": 2, "/inspect/edit/:id": 1, "/skills/change/:id": 1 };
const SKIP = [/\/api\//, /\/_next\//, /\.(png|jpe?g|webp|mp4|pdf|zip|md|json|html?)$/i];
const START = ["/", "/studio", "/scripts", "/concepts", "/insights", "/personas", "/offers", "/sources", "/brand", "/brand/guide", "/brand/founder", "/references", "/references/avatars", "/references/avatars/packs", "/references/competitors", "/production", "/compliance", "/landing", "/seo", "/learning", "/guide", "/lessons", "/settings", "/skills", "/planner", "/organic", "/creators", "/creative-lab", "/creative-quality", "/creative-portfolio", "/copy-builder", "/video-editing", "/builder", "/chat", "/formats", "/costs", "/coverage", "/inspect",
  // Finished videos open in a job's drawer.
  ...["005", "007", "010", "011", "012", "018", "031", "116", "117", "118", "119", "120"].map((j) => `/production?job=job_${j}`)];

const isId = (s) => (/\d/.test(s) && s.length > 3) || /^[a-z]+_[0-9a-z]+$/i.test(s) || /^[0-9a-f-]{16,}$/i.test(s);
function kind(u) {
  const segs = u.pathname.slice(PREFIX.length).split("/").filter(Boolean);
  if (["file"].includes(segs[1]) && ["inspect", "skills"].includes(segs[0])) return `/${segs[0]}/file/*`;
  const k = "/" + segs.map((s, i) => (i > 0 && (isId(s) || ["guide", "learning", "formats", "costs"].includes(segs[0])) ? ":id" : s)).join("/");
  return u.search ? `${k}?${[...u.searchParams.keys()].sort().join("&")}` : k;
}
const hashOf = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const ext = (ct, p) => path.extname(p) || ({ "text/html": ".html", "application/json": ".json", "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "text/css": ".css", "application/javascript": ".js", "text/javascript": ".js", "video/mp4": ".mp4" }[ct.split(";")[0]] ?? ".bin");

// A second run into the same folder adds to it (--start /a,/b --follow 0 re-saves just those screens).
const qFile = path.join(OUT, PREFIX.slice(1), "_q", "index.json");
const queries = fs.existsSync(qFile) ? JSON.parse(fs.readFileSync(qFile, "utf8")) : {};
// Server actions that load data as a screen opens (a job's drawer, a library page) are saved under _a/ with the
// answer they got, keyed by the action and what was sent. tour.js plays them back; anything else stays stopped.
const aFile = path.join(OUT, PREFIX.slice(1), "_a", "index.json");
const actions = fs.existsSync(aFile) ? JSON.parse(fs.readFileSync(aFile, "utf8")) : {};
// The same hash as tour.js: two 32-bit FNV-1a passes.
const fnv = (s, h) => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };
const actionKey = (id, body) => fnv(`${id}|${body}`, 0x811c9dc5) + fnv(`${body}|${id}`, 0x01000193);
const FOLLOW = arg("follow", "1") !== "0";
const VIDEO_MAX = Number(arg("videos", 30));
let videos = 0;
const saved = new Set();
function fileFor(u, ct, doc) {
  const rel = decodeURIComponent(u.pathname);
  // Data addresses with no file extension (/api/avatar-library) go in _q/ too: saved under their own name they'd
  // be a file where a folder is needed (/api/avatar-library/media/...).
  if (u.search || (!doc && !path.posix.extname(rel))) {
    const f = `${PREFIX}/_q/${hashOf(rel + u.search)}${doc ? ".html" : ext(ct, rel)}`;
    queries[rel + u.search] = f;
    return f;
  }
  // A screen is saved as <path>.html (the host serves it at <path>); the start screen as index.html.
  const clean = rel.replace(/\/$/, "");
  return doc ? (clean === PREFIX ? `${PREFIX}/index.html` : `${clean}.html`) : rel;
}
function write(rel, body) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, body);
  saved.add(rel);
}

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addCookies([{ name: "ce_brand", value: BRAND, url: origin }]);
const page = await ctx.newPage();
page.on("dialog", (d) => d.dismiss().catch(() => {}));
// The app writes some file paths without the base path (fetch("/api/..."), <img src="/api/...">). Send them
// to the right place, as the finished tour does (finish.mjs), and save them under the base path.
await page.route((u) => u.origin === origin && /^\/(api|_next)\//.test(u.pathname), (r) => r.continue({ url: BASE + new URL(r.request().url()).pathname + new URL(r.request().url()).search }));
const pending = new Set();
// Server action answers are streamed, so the browser can't hand them over afterwards: fetch them here, keep a copy,
// and pass the same answer on to the page.
await page.route((u) => u.origin === origin && !/^\/(api|_next)\//.test(u.pathname), async (route) => {
  const req = route.request();
  const act = req.method() === "POST" && req.headers()["next-action"];
  if (!act) return route.continue();
  try {
    const res = await route.fetch();
    const body = req.postData() ?? "";
    if (res.status() === 200 && body.length <= 20_000) {
      const key = actionKey(act, body);
      write(`${PREFIX}/_a/${key}.txt`, await res.body());
      actions[key] = { ct: res.headers()["content-type"] ?? "text/x-component", rev: res.headers()["x-action-revalidated"] ?? "" };
    } else log.push(`action ${act} answered ${res.status()}`);
    await route.fulfill({ response: res });
  } catch (e) { log.push(`action ${act} failed: ${String(e).slice(0, 80)}`); await route.abort().catch(() => {}); }
});
page.on("response", (r) => {
  if (process.env.SNAP_DEBUG && r.url().includes(process.env.SNAP_DEBUG)) console.log("RES", r.status(), r.request().method(), r.request().resourceType(), r.url());
  const req = r.request();
  const u = new URL(r.url());
  if (!u.pathname.startsWith(PREFIX)) u.pathname = PREFIX + u.pathname;
  if (u.origin !== origin || req.method() !== "GET" || r.status() !== 200 || req.resourceType() === "document") return;
  if (u.searchParams.has("_rsc") || req.headers()["rsc"]) return;
  const job = (async () => {
    const ct = r.headers()["content-type"] ?? "";
    const rel = fileFor(u, ct, false);
    if (saved.has(rel)) return;
    try { write(rel, await r.body()); } catch { /* streamed or gone */ }
  })();
  pending.add(job); job.finally(() => pending.delete(job));
});

const seen = new Set();
const perKind = {};
const queue = (arg("start") ? arg("start").split(",") : START).map((p) => new URL(BASE + p));
const log = [];
while (queue.length && seen.size < MAX) {
  const u = queue.shift();
  u.hash = "";
  const key = u.pathname.replace(/\/$/, "") + u.search;
  if (seen.has(key)) continue;
  const k = kind(u);
  if ((perKind[k] ?? 0) >= (CAPS[k] ?? (u.search ? 2 : CAP))) continue;
  seen.add(key);
  perKind[k] = (perKind[k] ?? 0) + 1;
  let res;
  // Screens that play video never go quiet on the network: wait for the page, then give it a few seconds.
  try { res = await page.goto(u.href, { waitUntil: "load", timeout: 60_000 }); } catch (e) { log.push(`timeout ${key}`); }
  try { await page.waitForLoadState("networkidle", { timeout: 8000 }); } catch { /* still streaming */ }
  if (!res || res.status() !== 200 || !new URL(page.url()).pathname.startsWith(PREFIX)) { log.push(`skip ${res?.status()} ${key}`); continue; }
  write(fileFor(u, "text/html", true), await res.text());
  // Tabs often load their own data: open each one so that data is saved too.
  const tabs = await page.locator('[role="tab"]:not([aria-selected="true"])').all();
  for (const t of tabs.slice(0, 10)) {
    try { await t.click({ timeout: 2000 }); await page.waitForLoadState("networkidle", { timeout: 5000 }); } catch { /* hidden or detached */ }
  }
  // Scroll through once so lazy lists and grids load what they show, then fetch every picture and video named.
  await page.evaluate(async () => {
    for (let i = 0; i < 14; i++) { window.scrollBy(0, innerHeight); await new Promise((r) => setTimeout(r, 250)); if (innerHeight + scrollY >= document.body.scrollHeight - 2) break; }
    window.scrollTo(0, 0);
  }).catch(() => {});
  try { await page.waitForLoadState("networkidle", { timeout: 5000 }); } catch { /* still loading */ }
  const media = await page.$$eval("img, source, video, link[rel~=icon], link[rel=apple-touch-icon]", (els) => els.flatMap((e) => [e.getAttribute("src"), e.getAttribute("poster"), e.tagName === "LINK" ? e.getAttribute("href") : null, ...(e.getAttribute("srcset") ?? "").split(",").map((s) => s.trim().split(/\s+/)[0])]).filter(Boolean).map((s) => new URL(s, location.href).href));
  for (const m of new Set(media)) {
    const v = new URL(m);
    if (v.origin !== origin) continue;
    if (!v.pathname.startsWith(PREFIX)) v.pathname = PREFIX + v.pathname;
    const probe = fileFor(v, "", false);
    if (saved.has(probe)) continue;
    try {
      const r = await ctx.request.get(v.href, { timeout: 30_000 });
      const body = r.ok() ? await r.body() : null;
      if (!body) continue;
      if (body.length > 20e6) { log.push(`too big ${v.pathname} ${(body.length / 1e6).toFixed(0)} MB`); continue; }
      if (/\.(mp4|webm|mov)$/i.test(v.pathname) && ++videos > VIDEO_MAX) { log.push(`video left out ${v.pathname}`); continue; }
      write(fileFor(v, r.headers()["content-type"] ?? "", false), body);
    } catch { /* gone */ }
  }
  const links = await page.$$eval("a[href]", (as) => as.map((a) => a.href));
  for (const h of FOLLOW ? links : []) {
    let v; try { v = new URL(h); } catch { continue; }
    if (v.origin !== origin || !v.pathname.startsWith(PREFIX) || SKIP.some((r) => r.test(v.pathname))) continue;
    v.hash = "";
    if (!seen.has(v.pathname.replace(/\/$/, "") + v.search)) queue.push(v);
  }
  await Promise.all([...pending]);
  log.push(`ok ${key}`);
  process.stdout.write(`\r${seen.size} pages, ${saved.size} files, ${queue.length} queued   `);
}
await Promise.all([...pending]);
write(`${PREFIX}/_q/index.json`, JSON.stringify(queries, null, 1));
write(`${PREFIX}/_a/index.json`, JSON.stringify(actions));
fs.writeFileSync(path.join(OUT, "snapshot-log.txt"), log.join("\n"));
await browser.close();
console.log(`\nSaved ${seen.size} pages and ${saved.size} files to ${OUT}`);
