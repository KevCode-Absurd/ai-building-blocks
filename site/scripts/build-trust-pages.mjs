// Preview and check the How we test and industry pages without a full build. Run from site/ after `npm run index`:
//   node scripts/build-trust-pages.mjs            each page's title, description and picks, then any problem
//   node scripts/build-trust-pages.mjs --json f   also write every pick to f
// The pages themselves are written by scripts/prerender.mjs (npm run build), with the same code (scripts/lib/trust-pages.mjs).
import fs from "node:fs";
import { BROWSER_TOOLS } from "../src/tools/browser-tools.mjs";
import { DESC, TITLE } from "../src/lib/seo-meta.mjs";
import { brokenLinks, hrefOf, trustPages } from "./lib/trust-pages.mjs";

const data = "public/data";
const cat = JSON.parse(fs.readFileSync(`${data}/blocks.json`, "utf8"));
const roles = JSON.parse(fs.readFileSync(`${data}/roles-index.json`, "utf8"));
const { TOOLS } = await import("../../mini-tools/index.mjs");
const tools = [...BROWSER_TOOLS, ...TOOLS];
const readPage = slug => { try { return JSON.parse(fs.readFileSync(`${data}/pages/${slug}.json`, "utf8")); } catch { return {}; } };
const SITE_PATHS = ["/", "/roles", "/jobs", "/compose", "/tools", "/api-and-mcp", "/how-it-works"];

const { pages, problems } = await trustPages({ cat, readPage, roles, tools, routeExists: () => false });
const broken = brokenLinks(pages, { cat, roles, tools, sitePaths: SITE_PATHS });
for (const p of pages) {
  const title = p.documentTitle ?? `${p.title} | AI Blocks`;
  const flag = (n, r) => (n < r.min || n > r.max ? ` (outside ${r.min} to ${r.max})` : "");
  console.log(`\n${p.url}\n  title ${title.length}${flag(title.length, TITLE)}: ${title}\n  description ${p.desc.length}${flag(p.desc.length, DESC)}`);
  if (p.picks) {
    for (const j of p.picks.jobs) console.log(`  - ${j.job}: ${j.items.map(b => b.slug).join(", ") || "(none)"}${j.workflow ? ` | workflow ${j.workflow.slug}` : ""}`);
    console.log(`  specialists: ${p.picks.specialists.map(r => r.id).join(", ")}\n  tools: ${p.picks.miniTools.map(t => t.slug).join(", ")}`);
  }
  if (p.facts?.undescribed?.length) problems.push(`${p.url}: checks with no plain words yet: ${p.facts.undescribed.join(", ")}`);
}
const json = process.argv.indexOf("--json");
if (json > 0) fs.writeFileSync(process.argv[json + 1], JSON.stringify(pages.filter(p => p.picks).map(p => ({ url: p.url, jobs: p.picks.jobs.map(j => ({ job: j.job, items: j.items.map(hrefOf), workflow: j.workflow ? hrefOf(j.workflow) : null })), specialists: p.picks.specialists.map(r => `/roles/${r.id}`), tools: p.picks.miniTools.map(t => `/tools/${t.slug}`) })), null, 2));
const all = [...problems, ...broken.map(l => `link goes nowhere: ${l}`)];
console.log(all.length ? `\n${all.length} problems:\n  ${all.join("\n  ")}` : `\n${pages.length} pages, no problems.`);
if (all.length) process.exitCode = 1;
