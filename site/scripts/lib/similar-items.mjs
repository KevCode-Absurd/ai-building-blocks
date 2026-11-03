// "Similar items and how they differ": near-duplicates in one job (catalogue-items/siblings.json, made by
// tools/cluster-siblings.mjs) shown side by side on each of their pages, with the one to start with marked.
// The table is built from each item's own page: its summary, what you give it and what you get back.
import fs from "node:fs";
import path from "node:path";

const strs = (v) => (Array.isArray(v) ? v : []).filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim());
const short = (s, n = 90) => (s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, "")}…`);

/** What one item's row says: its first inputs and results, from its built page JSON. */
export function rowFacts(page) {
  const sample = page?.output_sample;
  const outs = (Array.isArray(sample?.output) ? sample.output : []).map((o) => (o && typeof o.name === "string" ? o.name.trim() : "")).filter(Boolean);
  const give = strs(sample?.input).length ? strs(sample.input) : strs(page?.you_give);
  const get = outs.length ? outs : strs(page?.you_get);
  return { give: give.slice(0, 2).map((x) => short(x)), get: get.slice(0, 3).map((x) => short(x, 60)) };
}

/**
 * Reads siblings.json. Returns rowsFor(slug): the group's rows for that page (start-here first), or null when the item
 * is in no group or fewer than two of its group still have a page. Unknown and renamed slugs are skipped or followed.
 */
export function loadSiblings({ root, pagesDir, bySlug, hrefOf, renamed = {} }) {
  const file = path.join(root, "siblings.json");
  if (!fs.existsSync(file)) return () => null;
  const groups = JSON.parse(fs.readFileSync(file, "utf8")).groups ?? [];
  const live = (s) => { const to = renamed[s] ?? s; return bySlug[to]?.headline ? to : null; };
  const groupOf = new Map();
  for (const g of groups) {
    const members = [...new Set((g.items ?? []).map(live).filter(Boolean))];
    if (members.length < 2) continue;
    const start = live(g.start) && members.includes(live(g.start)) ? live(g.start) : members[0];
    const ordered = [start, ...members.filter((s) => s !== start)];
    for (const s of ordered) if (!groupOf.has(s)) groupOf.set(s, { start, members: ordered });
  }
  const facts = new Map();
  const factsOf = (slug) => {
    if (!facts.has(slug)) {
      let page = null;
      try { page = JSON.parse(fs.readFileSync(path.join(pagesDir, `${slug}.json`), "utf8")); } catch { /* no page: no facts */ }
      facts.set(slug, rowFacts(page));
    }
    return facts.get(slug);
  };
  return (slug) => {
    const g = groupOf.get(slug);
    if (!g) return null;
    return g.members.map((s) => ({ slug: s, name: bySlug[s].name, href: hrefOf(bySlug[s]), summary: short(bySlug[s].summary ?? "", 160), ...factsOf(s), ...(s === g.start ? { start: true } : {}) }));
  };
}
