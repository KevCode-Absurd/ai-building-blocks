// Tells Bing, Yandex, Seznam, Naver and Yep (everyone on IndexNow) about every page in the live sitemap, in one request.
// Google does not use IndexNow: it reads the sitemap, which Search Console has.
// The key is public by design: IndexNow checks it against public/<key>.txt on the site, so the file must be deployed first.
// Usage: node scripts/indexnow.mjs [origin] [--dry-run]     (origin defaults to https://agents.useaiblocks.com)
import { readdirSync } from "node:fs";

const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const origin = (args.find(a => !a.startsWith("--")) ?? "https://agents.useaiblocks.com").replace(/\/+$/, "");
const host = new URL(origin).host;

const keyFile = readdirSync(new URL("../public/", import.meta.url)).find(f => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (32 hex characters + .txt) in public/.");
const key = keyFile.slice(0, -4);

const live = await fetch(`${origin}/${keyFile}`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error(`${origin}/${keyFile} does not serve the key yet: deploy first.`);

const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(u => new URL(u).host === host);
if (!urls.length) throw new Error("The sitemap lists no pages.");
console.log(`${urls.length} pages from ${origin}/sitemap.xml`);
// One request takes up to 10,000 addresses. (No process.exit: on Windows it can crash Node while fetch is closing.)
for (let i = 0; !dry && i < urls.length; i += 10_000) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `${origin}/${keyFile}`, urlList: urls.slice(i, i + 10_000) }),
  });
  // 200 and 202 both mean accepted (202: the key is still being checked).
  console.log(`IndexNow: ${res.status} ${res.statusText} for ${Math.min(10_000, urls.length - i)} pages`);
  if (res.status !== 200 && res.status !== 202) { console.log(await res.text()); process.exitCode = 1; break; }
}
