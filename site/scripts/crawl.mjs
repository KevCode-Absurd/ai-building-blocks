// Opens every page in the sitemap on a running build and reports the broken ones: no heading, a script error,
// a failed request for our own files, or sideways scroll on a phone-sized screen.
//   npx vite preview --port 4173   (after npm run build), then:
//   node scripts/crawl.mjs [--base http://localhost:4173] [--workers 8] [--only skills]
import fs from "node:fs";
import { chromium } from "@playwright/test";

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg("base", "http://localhost:4173");
const WORKERS = Number(arg("workers", 8));
const ONLY = arg("only", "");
const urls = [...fs.readdirSync("public").filter((f) => /^sitemap-.*.xml$/.test(f)).map((f) => fs.readFileSync(`public/${f}`, "utf8")).join("").matchAll(/<loc>https:\/\/useaiblocks\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/")
  .filter((u) => !ONLY || u.startsWith(`/${ONLY}`));

// Same browser as the tests: the installed Chrome (PW_CHANNEL= for Playwright's own Chromium).
const channel = process.env.PW_CHANNEL ?? "chrome";
const browser = await chromium.launch(channel ? { channel } : {});
const problems = [];
let done = 0, slowest = [];
const t0 = Date.now();

async function worker(queue) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  let errors = [];
  page.on("pageerror", (e) => errors.push(`script error: ${e.message.split("\n")[0]}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 160)}`); });
  page.on("requestfailed", (r) => { if (r.url().startsWith(BASE)) errors.push(`failed: ${r.url().replace(BASE, "")}`); });
  page.on("response", (r) => { if (r.url().startsWith(BASE) && r.status() >= 400 && !/\/data\/pages\//.test(r.url())) errors.push(`${r.status()}: ${r.url().replace(BASE, "")}`); });
  for (let u; (u = queue.shift()) !== undefined;) {
    errors = [];
    const start = Date.now();
    try {
      await page.goto(BASE + u, { waitUntil: "load", timeout: 30000 });
      await page.waitForSelector("h1", { timeout: 10000 });
      await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
      const wide = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (wide > 1) errors.push(`sideways scroll: ${wide}px`);
      const h1 = (await page.textContent("h1"))?.trim();
      if (!h1 || /not found|doesn.t exist/i.test(h1)) errors.push(`heading: "${h1}"`);
      if (await page.locator("[data-prerendered]").count()) errors.push("first screen for search engines was not replaced");
      if (await page.locator("h1").count() > 1) errors.push("more than one h1");
    } catch (e) { errors.push(`load: ${e.message.split("\n")[0]}`); }
    const ms = Date.now() - start;
    slowest.push([ms, u]); slowest = slowest.sort((a, b) => b[0] - a[0]).slice(0, 8);
    if (errors.length) problems.push({ url: u, errors: [...new Set(errors)] });
    if (++done % 250 === 0) console.log(`${done}/${urls.length} pages, ${problems.length} with problems`);
  }
  await ctx.close();
}

const queue = [...urls];
await Promise.all(Array.from({ length: WORKERS }, () => worker(queue)));
await browser.close();
console.log(`\n${urls.length} pages in ${Math.round((Date.now() - t0) / 1000)}s, ${problems.length} with problems.`);
console.log("Slowest:", slowest.map(([ms, u]) => `${u} ${ms}ms`).join(", "));
for (const p of problems.slice(0, 60)) console.log(`✗ ${p.url}\n    ${p.errors.join("\n    ")}`);
fs.writeFileSync("test-results/crawl.json", JSON.stringify(problems, null, 1));
process.exitCode = problems.length ? 1 : 0;
