// Turns the raw snapshot (snapshot.mjs) into the tour: every saved page gets the tour script and bar, links and
// pictures point at saved files, large pictures are made smaller, and a page for screens that aren't in the tour.
//
//   node tools/example-app/finish.mjs --raw <snapshot folder> --out example-app-site
//
// Only HTML outside <script> tags is changed. The page data Next.js keeps inside its scripts is left exactly as
// it was, so each screen starts up as the real app does.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const RAW = path.resolve(arg("raw", "example-app-raw"));
const OUT = path.resolve(arg("out", "example-app-site"));
const BASE = "/example-app";
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const require = createRequire(new URL("../../site/package.json", import.meta.url));
let sharp = null;
try { sharp = require("sharp"); } catch { /* pictures stay as they are */ }

const SRC = path.join(RAW, BASE.slice(1));
const DST = path.join(OUT, BASE.slice(1));
const Q = JSON.parse(fs.readFileSync(path.join(SRC, "_q", "index.json"), "utf8"));
const unesc = (s) => s.replace(/&amp;/g, "&");
function fix(v) {
  if (!v.startsWith("/") || v.startsWith("//")) return v;
  const [p, hash] = unesc(v).split("#");
  const full = p === BASE || p.startsWith(BASE + "/") ? p : BASE + p;
  let to = Q[full] ?? Q[decodeURIComponent(full)] ?? full;
  return (to + (hash ? `#${hash}` : "")).replace(/&/g, "&amp;");
}
const ATTR = /\s(href|src|poster|action)="([^"]*)"/g;
const SRCSET = /\s(srcset|imagesrcset)="([^"]*)"/g;
function rewrite(html) {
  return html.split(/(<script\b[\s\S]*?<\/script>)/i).map((part) => {
    if (/^<script/i.test(part)) return part.replace(/^<script\b([^>]*)\bsrc="([^"]*)"/i, (m, a, s) => `<script${a}src="${fix(s)}"`);
    return part
      .replace(ATTR, (m, a, v) => ` ${a}="${fix(v)}"`)
      .replace(SRCSET, (m, a, v) => ` ${a}="${v.split(",").map((s) => { const [u, ...w] = s.trim().split(/\s+/); return [fix(u), ...w].join(" "); }).join(", ")}"`);
  }).join("")
    .replace(/<head>/i, `<head><script src="${BASE}/_tour/tour.js"></script><link rel="stylesheet" href="${BASE}/_tour/tour.css"><meta name="robots" content="noindex">`);
}

let pages = 0, files = 0, before = 0, after = 0;
async function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const from = path.join(dir, e.name);
    const to = path.join(DST, path.relative(SRC, from));
    if (e.isDirectory()) { await walk(from); continue; }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    const size = fs.statSync(from).size;
    before += size;
    if (/\.html$/.test(e.name) && !from.includes(`${path.sep}api${path.sep}`)) {
      fs.writeFileSync(to, rewrite(fs.readFileSync(from, "utf8")));
      pages++;
    } else if (sharp && /\.(png|jpe?g|webp)$/i.test(e.name) && size > 150_000) {
      // Same name, smaller file: browsers read a picture by its content, not its name.
      const img = sharp(fs.readFileSync(from), { failOn: "none" }).rotate().resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true });
      const buf = await img.webp({ quality: 78 }).toBuffer();
      fs.writeFileSync(to, buf.length < size ? buf : fs.readFileSync(from));
    } else {
      fs.copyFileSync(from, to);
    }
    after += fs.statSync(to).size;
    files++;
  }
}
fs.rmSync(DST, { recursive: true, force: true });
await walk(SRC);
// A file asked for with a query is also kept under its plain name, so a request that skips the lookup still works.
for (const [key, file] of Object.entries(Q)) {
  const plain = path.join(DST, key.split("?")[0].slice(BASE.length));
  const saved = path.join(DST, file.slice(BASE.length + 1));
  if (file.endsWith(".html") || fs.existsSync(plain) || !fs.existsSync(saved) || fs.statSync(saved).size > 200_000) continue;
  fs.mkdirSync(path.dirname(plain), { recursive: true });
  fs.copyFileSync(saved, plain);
}
fs.mkdirSync(path.join(DST, "_tour"), { recursive: true });
for (const f of ["tour.js", "tour.css"]) fs.copyFileSync(path.join(HERE, f), path.join(DST, "_tour", f));
fs.copyFileSync(path.join(HERE, "404.html"), path.join(DST, "404.html"));
const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;
console.log(`${pages} pages, ${files} files, ${mb(before)} → ${mb(after)} in ${DST}`);
