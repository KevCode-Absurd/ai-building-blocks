#!/usr/bin/env node
// teardown-shots.mjs: screenshots for a teardown report, so the owner sees the competitor's pages and ads.
//
//   node tools/teardown-shots.mjs pages <dir> [--max 6] [--urls url1,url2]   capture landing pages (needs Playwright)
//   node tools/teardown-shots.mjs add <dir> <image> --kind meta_ads|google_ads|tiktok_ads|page|email|social
//                                 --caption "..." --source <url> [--note "..."]     add a screenshot you took
//   node tools/teardown-shots.mjs look <dir>     read the homepage's real colours and fonts (also done by "pages")
//   node tools/teardown-shots.mjs list <dir>
//
// "pages" opens the homepage, the hero product pages, landing-style pages and hidden offer products from
// evidence.json in a headless browser at phone and desktop width and saves the first screens as JPEGs. It names
// itself in the user agent, obeys robots.txt and skips anything disallowed. It never clicks buy, adds to cart or
// fills a form; it closes pop-ups only by pressing Escape. Playwright comes from the project (npm i playwright) or
// NODE_PATH. Ad libraries (Meta disallows automated reading) are captured by you in a browser, then added with "add".
//
// Writes <dir>/shots/*.jpg and <dir>/shots/shots.json; teardown-report.mjs render shows them in the report.
// "look" saves <dir>/shots/look.json: the colours and fonts the browser actually drew on the homepage, which the
// report uses for its theme. It is more exact than colours and fonts read from the store's CSS files.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : d; };
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0 Safari/537.36 AIBlocksTeardown/1.0 (+https://agents.useaiblocks.com)";
const KINDS = ["meta_ads", "google_ads", "tiktok_ads", "page", "email", "social", "other"];

function manifest(dir) { const p = path.join(dir, "shots", "shots.json"); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : { shots: [] }; }
function saveManifest(dir, m) { fs.mkdirSync(path.join(dir, "shots"), { recursive: true }); fs.writeFileSync(path.join(dir, "shots", "shots.json"), JSON.stringify(m, null, 1)); }
const slug = (s) => s.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "page";

function loadPlaywright() {
  const tries = [process.cwd(), ...(process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean).map((p) => path.join(p, ".."))];
  for (const base of tries) { try { return createRequire(path.join(base, "noop.js"))("playwright"); } catch { /* next */ } }
  for (const p of (process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean)) { try { return createRequire(path.join(p, "noop.js"))(path.join(p, "playwright")); } catch { /* next */ } }
  return null;
}

// robots.txt, the same rules as teardown-collect.mjs
const robotsCache = new Map();
async function allowed(url) {
  const u = new URL(url); if (!robotsCache.has(u.host)) {
    let rules = [];
    try { const r = await fetch(`${u.origin}/robots.txt`, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000) }); if (r.ok) { const t = await r.text(); let cur = null, last = false; const groups = []; for (const raw of t.split(/\r?\n/)) { const line = raw.replace(/#.*/, "").trim(); const i = line.indexOf(":"); if (i < 0) continue; const k = line.slice(0, i).trim().toLowerCase(), v = line.slice(i + 1).trim(); if (k === "user-agent") { if (!cur || !last) { cur = { a: [], r: [] }; groups.push(cur); } cur.a.push(v.toLowerCase()); last = true; continue; } last = false; if ((k === "allow" || k === "disallow") && cur && v) cur.r.push({ allow: k === "allow", p: v }); } const mine = groups.filter((g) => g.a.some((a) => a !== "*" && "aiblocksteardown".includes(a))); rules = (mine.length ? mine : groups.filter((g) => g.a.includes("*"))).flatMap((g) => g.r); } } catch { /* no robots: allowed */ }
    robotsCache.set(u.host, rules);
  }
  const p = u.pathname + u.search; let best = null;
  for (const r of robotsCache.get(u.host)) { const re = new RegExp("^" + r.p.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\$$/, "$")); if (re.test(p) && (!best || r.p.length > best.p.length || (r.p.length === best.p.length && r.allow))) best = r; }
  return !best || best.allow;
}

function pickPages(dir, max) {
  const ev = JSON.parse(fs.readFileSync(path.join(dir, "evidence.json"), "utf8"));
  const origin = ev.target.origin.replace(/\/$/, ""); const home = ev.evidence.find((e) => e.id === ev.ids?.home)?.url || origin + "/";
  const list = [{ url: home, label: "Homepage", why: "first impression and the offer they lead with" }];
  for (const id of [].concat(ev.ids?.pdps || [])) { const e = ev.evidence.find((x) => x.id === id); if (e?.url) list.push({ url: e.url, label: `Product page: ${e.data?.title || ""}`.trim(), why: "hero product page anatomy", evidence: id }); }
  const sm = ev.evidence.find((e) => e.id === ev.ids?.sitemap)?.data?.page_signals || {};
  for (const p of [...(sm.landing_like || []), ...(sm.quiz || []).slice(0, 1), ...(sm.comparison || []).slice(0, 1)]) list.push({ url: origin + p, label: `Page: ${p}`, why: "landing, quiz or comparison page", evidence: ev.ids?.sitemap });
  const cat = ev.evidence.find((e) => e.id === ev.ids?.catalogue)?.data;
  for (const h of (cat?.hidden_or_offer_only?.products || cat?.hidden_or_offer_only?.examples || []).slice(0, 3)) if (h.handle) list.push({ url: `${origin}/products/${h.handle}`, label: `Hidden offer: ${h.title}`, why: "an offer product not in the menus, often an ad landing page", evidence: ev.ids?.catalogue });
  const extra = (opt("urls", "") || "").split(",").map((u) => u.trim()).filter(Boolean).map((u) => ({ url: u, label: `Page: ${new URL(u).pathname}`, why: "added by hand" }));
  const seen = new Set(); return [...extra, ...list].filter((x) => !seen.has(x.url) && seen.add(x.url)).slice(0, max + extra.length);
}

// What the browser drew: the largest background colours and the font, weight and colour of headings, text and buttons.
async function readLook(page) {
  return page.evaluate(() => {
    const cs = (el) => getComputedStyle(el); const area = {};
    for (const el of document.querySelectorAll("body, main, section, div, header")) { const r = el.getBoundingClientRect(); if (r.width < 600 || r.height < 120) continue; const c = cs(el).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && !/rgba\([^)]*, 0\.\d+\)/.test(c)) area[c] = (area[c] || 0) + r.width * Math.min(r.height, 1600); }
    const role = {}; for (const sel of ["h1", "h2", "h3", "p", "a", "button"]) { const el = [...document.querySelectorAll(sel)].find((e) => e.offsetParent && e.textContent.trim().length > 3); if (el) { const c = cs(el); role[sel] = { family: c.fontFamily.split(",")[0].replace(/["']/g, "").trim(), weight: c.fontWeight, color: c.color, size: c.fontSize }; } }
    return { backgrounds: Object.entries(area).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c), roles: role };
  });
}

async function look(dir, existing) {
  const pw = existing || loadPlaywright(); if (!pw) { console.error("Playwright is not installed."); process.exit(2); }
  const ev = JSON.parse(fs.readFileSync(path.join(dir, "evidence.json"), "utf8")); const url = ev.evidence.find((e) => e.id === ev.ids?.home)?.url || ev.target.origin;
  if (!(await allowed(url))) return null;
  let browser; try { browser = await pw.chromium.launch({ channel: "chrome" }); } catch { browser = await pw.chromium.launch(); }
  const page = await browser.newPage({ viewport: { width: 1366, height: 860 }, userAgent: UA, locale: "en-US", colorScheme: "light" });
  let out = null;
  try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }); await page.waitForTimeout(3500); out = { url, read_at: new Date().toISOString(), ...(await readLook(page)) }; fs.mkdirSync(path.join(dir, "shots"), { recursive: true }); fs.writeFileSync(path.join(dir, "shots", "look.json"), JSON.stringify(out, null, 1)); } catch (e) { out = { error: String(e.message || e).split("\n")[0] }; }
  await browser.close(); if (!existing) console.log(JSON.stringify(out, null, 1)); return out;
}

async function pages(dir) {
  const pw = loadPlaywright(); if (!pw) { console.error("Playwright is not installed. Run `npm i playwright` (or set NODE_PATH to a node_modules with it), or take the screenshots yourself and use `add`."); process.exit(2); }
  const max = Number(opt("max", 6)); const list = pickPages(dir, max); const m = manifest(dir); fs.mkdirSync(path.join(dir, "shots"), { recursive: true });
  let browser; try { browser = await pw.chromium.launch({ channel: "chrome" }); } catch { browser = await pw.chromium.launch(); }
  const out = [];
  for (const item of list) {
    if (!(await allowed(item.url))) { out.push({ url: item.url, skipped: "robots.txt disallows it" }); continue; }
    for (const [vp, w, h] of [["phone", 390, 844], ["desktop", 1366, 860]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: vp === "phone" ? 2 : 1, userAgent: UA, isMobile: vp === "phone", hasTouch: vp === "phone", locale: "en-US", colorScheme: "light" });
      const page = await ctx.newPage();
      try {
        const res = await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 30000 }); await page.waitForTimeout(3500); await page.keyboard.press("Escape").catch(() => {}); await page.waitForTimeout(600);
        if (!res || res.status() >= 400) { out.push({ url: item.url, viewport: vp, skipped: `HTTP ${res?.status() ?? "no response"}` }); await ctx.close(); continue; }
        const file = `page-${slug(item.url)}-${vp}.jpg`;
        await page.screenshot({ path: path.join(dir, "shots", file), type: "jpeg", quality: 72, clip: { x: 0, y: 0, width: w, height: vp === "phone" ? 844 * 1.6 : 860 }, fullPage: true });
        const entry = { file, kind: "page", viewport: vp, caption: item.label, why: item.why, source: item.url, evidence: item.evidence || null, captured_at: new Date().toISOString(), by: "teardown-shots pages" };
        m.shots = m.shots.filter((s) => s.file !== file); m.shots.push(entry); out.push({ url: item.url, viewport: vp, file });
      } catch (e) { out.push({ url: item.url, viewport: vp, skipped: String(e.message || e).split("\n")[0] }); }
      await ctx.close();
    }
  }
  await browser.close(); saveManifest(dir, m); await look(dir, pw); console.log(JSON.stringify({ shots: out }, null, 1));
}

function add(dir, image) {
  const kind = opt("kind", "other"); if (!KINDS.includes(kind)) throw new Error(`--kind must be one of ${KINDS.join(", ")}`);
  if (!image || !fs.existsSync(image)) throw new Error(`No image at ${image}`);
  const caption = opt("caption", null); const source = opt("source", null); if (!caption || !source) throw new Error("--caption and --source are required: say what it shows and where it came from.");
  const m = manifest(dir); fs.mkdirSync(path.join(dir, "shots"), { recursive: true });
  const ext = path.extname(image).toLowerCase() || ".png"; const file = `${kind}-${String(m.shots.filter((s) => s.kind === kind).length + 1).padStart(2, "0")}${ext}`;
  fs.copyFileSync(image, path.join(dir, "shots", file));
  m.shots.push({ file, kind, caption, source, note: opt("note", null), captured_at: new Date().toISOString(), by: "added by hand" }); saveManifest(dir, m);
  console.log(JSON.stringify({ added: file }));
}

const [cmd, dir, img] = args;
try {
  if (cmd === "pages") await pages(dir);
  else if (cmd === "add") add(dir, img);
  else if (cmd === "look") await look(dir);
  else if (cmd === "list") console.log(JSON.stringify(manifest(dir), null, 1));
  else console.log("teardown-shots.mjs pages <dir> [--max 6] [--urls a,b] | add <dir> <image> --kind meta_ads --caption \"...\" --source <url> | list <dir>");
} catch (e) { console.error(e.message); process.exit(1); }
