// One-off import of example pictures from a local Creative Engine checkout (read-only).
// The 100 reviewed showcase ads are copied as they are; each format's example picture is resized to WebP.
// Usage: CE_DIR=<path to creative-engine> npm run examples
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CE = process.env.CE_DIR ?? "C:/Users/kevin/Documents/Codex/2026-09-22/https-drive-google-com-drive-u/outputs/creative-engine";
const OUT = "public/examples";
fs.mkdirSync(`${OUT}/ads`, { recursive: true });
fs.mkdirSync(`${OUT}/formats`, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(path.join(CE, "src/lib/sprint/showcase.json"), "utf8"));
const ads = [];
for (const e of manifest.entries) {
  if (e.review?.quality !== "pass") continue;
  for (const suffix of ["", "-thumb"]) {
    fs.copyFileSync(path.join(CE, "public/examples/static-ads", `${e.id}${suffix}.webp`), `${OUT}/ads/${e.id}${suffix}.webp`);
  }
  const { width, height } = await sharp(`${OUT}/ads/${e.id}-thumb.webp`).metadata();
  ads.push({ id: e.id, title: e.title, style: e.style, format: e.format, brand: e.brand, w: width, h: height });
}

const formatDir = path.join(CE, "data/assets/_formats");
const formats = [];
for (const f of fs.readdirSync(formatDir).sort()) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const id = f.replace(/\.[^.]+$/, "");
  const info = await sharp(path.join(formatDir, f)).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}/formats/${id}.webp`);
  formats.push({ id, w: info.width, h: info.height });
}

fs.writeFileSync(`${OUT}/examples.json`, JSON.stringify({ note: "Examples made from public info, not affiliated with the brand shown.", ads, formats }, null, 1));
console.log(`ads ${ads.length}, formats ${formats.length}`);
