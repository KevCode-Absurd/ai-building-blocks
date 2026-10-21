// Checks the prerendered pages in dist/ the way a search engine sees them: words of unique text per kind of page,
// duplicate or long titles, missing descriptions or canonicals, and pages no other page links to.
// Run after `npm run build`, from site/: node scripts/check-seo.mjs
import fs from "node:fs";
import path from "node:path";

const kinds = ["skills", "workflows", "agents", "minds", "prompts", "tools", "jobs"];
const stats = {}, titles = new Map(), inbound = {}, problems = [], warnings = [];
const pages = [];
for (const k of kinds) {
  const ws = [];
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) { if (k === "jobs") walk(p); continue; }
      if (!f.name.endsWith(".html")) continue;
      const url = "/" + path.relative("dist", p).split(path.sep).join("/").replace(/\.html$/, "");
      const h = fs.readFileSync(p, "utf8");
      const body = (h.match(/data-prerendered>([\s\S]*?)<\/main>/) ?? [, ""])[1];
      ws.push(body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length);
      const t = h.match(/<title>([^<]*)/)?.[1] ?? "";
      if (titles.has(t)) problems.push(`same title: ${titles.get(t)} and ${url}`);
      titles.set(t, url);
      if (t.length > 65) warnings.push(`title over 65 characters (search results will shorten it): ${url}`);
      if (!/<meta name="description" content="[^"]{50,}/.test(h)) problems.push(`short or missing description: ${url}`);
      if (!h.includes(`<link rel="canonical" href="https://useaiblocks.com${url}"`)) problems.push(`canonical isn't this page: ${url}`);
      if ((h.match(/<h1\b/g) ?? []).length !== 1) problems.push(`not one h1: ${url}`);
      for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) if (m[1] !== url) inbound[m[1]] = (inbound[m[1]] ?? 0) + 1;
      if (k !== "jobs" && k !== "tools") pages.push(url);
    }
  };
  walk(path.join("dist", k));
  ws.sort((a, b) => a - b);
  if (ws.length) stats[k] = { pages: ws.length, fewest_words: ws[0], median_words: ws[ws.length >> 1] };
}
// Links from the top-level pages (home, /minds, /jobs, /tools...) count too.
for (const f of fs.readdirSync("dist").filter((f) => f.endsWith(".html"))) for (const m of fs.readFileSync(path.join("dist", f), "utf8").matchAll(/href="(\/[^"#?]*)"/g)) inbound[m[1]] = (inbound[m[1]] ?? 0) + 1;
const orphans = pages.filter((u) => !inbound[u]);
console.table(stats);
console.log(`${titles.size} titles, ${orphans.length} of ${pages.length} pages with no link from another page${orphans.length ? ` (e.g. ${orphans.slice(0, 5).join(", ")})` : ""}`);
if (warnings.length) console.log(`${warnings.length} warnings:\n  ${warnings.slice(0, 10).join("\n  ")}`);
if (problems.length) console.log(`${problems.length} problems:\n  ${problems.slice(0, 30).join("\n  ")}`);
process.exitCode = problems.length ? 1 : 0;
