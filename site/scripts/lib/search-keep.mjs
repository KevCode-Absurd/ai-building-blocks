// Which library pages ask to be in Google (search recovery plan, 17 Nov 2026: docs/seo-recovery/PLAN.md, kept outside
// git). After about 8,300 URLs went up in four weeks, Google stopped showing even the strong pages (impressions fell
// from about 90 a day to under 10 on 8 Nov 2026). So the library asks Google to index only the pages that have earned
// it, and serves every other page as before, linked and followed, with `noindex, follow` and out of the sitemaps.
// Nothing is deleted, and a page comes back by adding it to search-keep/extra.txt once it gets a real upgrade (an
// example from a real run, facts no other page has).
//
// A page is indexed when any of these is true:
//   1. it earned a Google impression from 21 Oct to 17 Nov 2026 (search-keep/impressions.txt, from Search Console);
//   2. it is not an item page: the home page, calculators (/tools), AI-tool profiles (/ai-tools), the blog, guides,
//      industries, job hubs (their own rule: 3 items or more) and the other core pages;
//   3. the home page features it (passed in by the build);
//   4. it is in search-keep/extra.txt.
// A blog article can ask to stay out of Google with "noindex": true in its JSON (src/content/blog/<slug>.json). It is
// still served, linked from the blog and followed, but served noindex, follow, out of the sitemaps and out of llms.txt.
// Pagination (/minds/page/2, /jobs/<job>/2) is never indexed: page 1 is the page.
import fs from "node:fs";

const ITEM = /^\/(skills|workflows|prompts|agents|roles|minds)\/[^/]+$/;
const PAGINATION = /^\/(minds\/page\/\d+|jobs\/[^/]+\/\d+)$/;

const listFile = (name) => {
  const file = new URL(`./search-keep/${name}`, import.meta.url);
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).map((l) => l.replace(/#.*$/, "").trim()).filter((l) => l.startsWith("/"));
};

export const EARNED = new Set(listFile("impressions.txt"));

const BLOG_DIR = new URL("../../src/content/blog/", import.meta.url);
/** Blog articles whose metadata asks to stay out of Google. */
export const BLOG_NOINDEX = new Set(fs.existsSync(BLOG_DIR)
  ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(new URL(f, BLOG_DIR), "utf8"))).filter((p) => p.noindex === true).map((p) => `/blog/${p.slug}`)
  : []);
export const EXTRA = new Set(listFile("extra.txt"));

/** The keep rule for one URL path. `featured` holds the item paths the home page features. */
export function searchKeep(featured = new Set()) {
  return (url) => {
    if (PAGINATION.test(url) || BLOG_NOINDEX.has(url)) return false;
    if (!ITEM.test(url)) return true;
    return EARNED.has(url) || EXTRA.has(url) || featured.has(url);
  };
}

/** Whether a path is an item page or pagination page the keep rule decides (the rest are always indexed). */
export const decidedByKeepRule = (url) => ITEM.test(url) || PAGINATION.test(url) || BLOG_NOINDEX.has(url);
