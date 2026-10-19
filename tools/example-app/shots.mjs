// Screenshots of the saved example app for the Apps page: site/public/example-app-shots/<id>.webp.
// Run with the site's dev server up (npm --prefix site run dev):  node tools/example-app/shots.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(new URL("../../site/package.json", import.meta.url));
const { chromium } = require("@playwright/test");
const sharp = require("sharp");
const SITE = process.argv[2] ?? "http://localhost:5180";
const OUT = path.resolve("site/public/example-app-shots");
// Kept in step with AREAS in site/src/apps/data.ts, plus the home screen for the big picture.
const data = fs.readFileSync("site/src/apps/data.ts", "utf8");
const areas = [...data.matchAll(/\{ id: "([a-z-]+)", name: "[^"]+", line: "[^"]+", path: "([^"]+)" \}/g)].map((m) => [m[1], m[2]]);
const shots = [["home", ""], ...areas];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const [id, p] of shots) {
  await page.goto(`${SITE}/example-app/${p}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await page.addStyleTag({ content: "#tour-bar, #tour-toast { display: none !important; }" });
  const png = await page.screenshot();
  await sharp(png).resize({ width: id === "home" ? 1440 : 720 }).webp({ quality: 80 }).toFile(path.join(OUT, `${id}.webp`));
  console.log(`${id}: ${p || "/"}`);
}
await browser.close();
