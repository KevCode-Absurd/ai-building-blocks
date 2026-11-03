// Groups near-duplicate items in the same job (the unpaid invoice chasers, the ad drop diagnosers, the SEO auditors)
// and marks one "start here" in each group. Writes catalogue-items/siblings.json; the index build turns each group into a
// "Similar items and how they differ" table on every member's page (site/scripts/lib/similar-items.mjs).
//
//   node tools/cluster-siblings.mjs            print the groups, change nothing
//   node tools/cluster-siblings.mjs --write    write catalogue-items/siblings.json
//   node tools/cluster-siblings.mjs --check    fail when siblings.json names an item that no longer has a page
//
// Reads the built catalogue (site/public/data/blocks.json), so run `npm run index` in site first: it uses the same
// names, jobs and outputs the site shows. Items are compared on their name and slug, their summary and their outputs.
// The groups are generated, never hand edited into page.yaml; rerun --write after a big import or rename.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stem } from "./lib/not-for-links.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "catalogue-items", "siblings.json");
const DATA = path.join(ROOT, "site", "public", "data", "blocks.json");
const args = process.argv.slice(2);

// Similarity needed to join a group, and the largest group worth a table.
export const JOIN = 0.35, MAX_GROUP = 6;
const STOP = new Set(("a an and are as at be by can do does each for from get gets give gives how in into is it its of on one or out own "
  + "paste share so that the their them then this to up use using what when which with without you your yours it's per any all "
  + "first plus next new make makes made list lists build builder prompt agency copilot engineering implementation want need know not "
  + "will more most who our out about after before over than been has have had was were").split(" "));
// Words that mean the same job: an investigator, a troubleshooter and a diagnoser all find why something went wrong.
const SAME = Object.fromEntries(Object.entries({
  why: ["diagnos", "diagnosi", "troubleshoot", "investigat", "investigator", "detectiv", "explain", "analyst", "caus", "root"],
  drop: ["declin", "fall", "fell", "dropped", "slump", "dip", "decreas"],
  overdu: ["late", "unpaid", "owe", "owed", "outstanding"],
  remind: ["chas", "chaser", "nudg", "dunning", "follow"],
  audit: ["auditor", "review", "check", "checker", "inspect"],
  ad: ["ads", "advert", "campaign"],
}).flatMap(([to, from]) => from.map((w) => [w, to])));
const tokens = (s) => new Set((String(s ?? "").toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => w.length > 1 && !STOP.has(w)).map(stem).map((w) => SAME[w] ?? w));
const jaccard = (a, b) => { if (!a.size || !b.size) return 0; let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n); };

/** How alike two items are, 0 to 1: their names (and slugs) count most, then their summaries and the words people use
 *  to ask for them (cues), then what they hand back. */
export function similarity(a, b) {
  return 0.35 * jaccard(a.nameTokens, b.nameTokens) + 0.25 * jaccard(a.summaryTokens, b.summaryTokens) + 0.25 * jaccard(a.cueTokens, b.cueTokens) + 0.15 * jaccard(a.outputs, b.outputs);
}

/** The catalogue items that can have siblings: every item with a page except minds. */
export function prepare(blocks) {
  return blocks.filter((b) => b.headline !== "" && (b.type ?? "skill") !== "mind" && b.task).map((b) => ({
    slug: b.slug, name: b.name, task: b.task, type: b.type ?? "skill", origin: b.origin ?? "own", tested: !!b.tested, usedIn: b.usedIn ?? 0, level: b.level ?? "intermediate",
    nameTokens: tokens(`${b.name} ${b.slug.replace(/-/g, " ")} ${(b.aliases ?? []).join(" ")}`),
    summaryTokens: tokens(b.summary),
    cueTokens: tokens(b.cues),
    outputs: new Set((b.outputs ?? []).map((o) => String(o).replace(/\?$/, ""))),
  }));
}

/**
 * Average-link grouping inside each job: start with every item alone, keep joining the two closest groups while
 * their average similarity is at least JOIN and the result has at most MAX_GROUP items. Groups of one are dropped.
 */
export function cluster(items, { join = JOIN, max = MAX_GROUP } = {}) {
  const byTask = new Map();
  for (const it of items) (byTask.get(it.task) ?? byTask.set(it.task, []).get(it.task)).push(it);
  const groups = [];
  for (const [task, list] of [...byTask].sort((a, b) => a[0].localeCompare(b[0]))) {
    list.sort((a, b) => a.slug.localeCompare(b.slug));
    const sim = list.map((a, i) => list.map((b, j) => (i === j ? 1 : similarity(a, b))));
    let parts = list.map((_, i) => [i]);
    for (;;) {
      let best = null;
      for (let x = 0; x < parts.length; x++) for (let y = x + 1; y < parts.length; y++) {
        if (parts[x].length + parts[y].length > max) continue;
        // Only pairs that touch at all are worth averaging.
        let sum = 0, touch = false;
        for (const i of parts[x]) for (const j of parts[y]) { sum += sim[i][j]; if (sim[i][j] >= join) touch = true; }
        if (!touch) continue;
        const avg = sum / (parts[x].length * parts[y].length);
        if (avg >= join && (!best || avg > best.avg)) best = { x, y, avg };
      }
      if (!best) break;
      parts[best.x] = [...parts[best.x], ...parts[best.y]];
      parts.splice(best.y, 1);
    }
    for (const p of parts) if (p.length > 1) {
      const members = p.map((i) => list[i]);
      const centre = (i) => p.reduce((s, j) => s + (i === j ? 0 : sim[i][j]), 0) / (p.length - 1);
      groups.push({ task, members, centre: new Map(p.map((i) => [list[i].slug, centre(i)])) });
    }
  }
  return groups;
}

// The one to start with: the most typical of the group, then tested, our own, made for beginners, a single skill over an
// agent or a workflow,
// then the one other workflows use most. Ties go to the slug, so the pick never flips between runs.
const TYPE_BONUS = { skill: 0.6, prompt: 0.4, workflow: 0.2, agent: 0 };
export function startHere(group) {
  const score = (m) => 2 * group.centre.get(m.slug) + (m.tested ? 0.5 : 0) + (m.origin === "own" ? 0.3 : 0) + (m.level === "beginner" ? 0.2 : 0) + (TYPE_BONUS[m.type] ?? 0) + Math.min(m.usedIn, 5) * 0.05;
  return [...group.members].sort((a, b) => score(b) - score(a) || a.slug.localeCompare(b.slug))[0].slug;
}

/** The siblings.json content for a list of built blocks. */
export function siblingsFile(blocks) {
  const groups = cluster(prepare(blocks)).map((g) => {
    const start = startHere(g);
    return { job: g.task, start, items: [start, ...g.members.map((m) => m.slug).filter((s) => s !== start).sort()] };
  }).sort((a, b) => a.job.localeCompare(b.job) || a.start.localeCompare(b.start));
  return {
    about: "Near-duplicate items in the same job, made by tools/cluster-siblings.mjs. Do not edit by hand: rerun it with --write. Each group shows as Similar items and how they differ on its members' pages, with start first.",
    groups,
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  if (!fs.existsSync(DATA)) { console.error("No site/public/data/blocks.json. Run `npm run index` in site first."); process.exit(1); }
  const cat = JSON.parse(fs.readFileSync(DATA, "utf8"));
  // Only real catalogue items: anything else in the data (search documents for mini tools and the like) has no slug page.
  const blocks = (cat.blocks ?? []).filter((b) => b && typeof b.slug === "string" && typeof b.name === "string");
  if (args.includes("--check")) {
    const live = new Set(blocks.filter((b) => b.headline !== "").map((b) => b.slug));
    const renamed = cat.renamed ?? {};
    const file = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { groups: [] };
    const stale = file.groups.flatMap((g) => g.items.filter((s) => !live.has(renamed[s] ?? s)));
    console.log(`${file.groups.length} groups, ${file.groups.reduce((n, g) => n + g.items.length, 0)} items, ${stale.length} with no page${stale.length ? `: ${stale.join(", ")}` : ""}.`);
    if (stale.length) { console.log("Rerun node tools/cluster-siblings.mjs --write."); process.exit(1); }
    process.exit(0);
  }
  const out = siblingsFile(blocks);
  const sizes = {};
  for (const g of out.groups) sizes[g.items.length] = (sizes[g.items.length] ?? 0) + 1;
  if (!args.includes("--write") || args.includes("--list")) for (const g of out.groups) console.log(`${g.job}: ${g.items.map((s) => (s === g.start ? `*${s}` : s)).join(", ")}`);
  console.log(`\n${out.groups.length} groups covering ${out.groups.reduce((n, g) => n + g.items.length, 0)} items in ${new Set(out.groups.map((g) => g.job)).size} jobs. Sizes: ${Object.entries(sizes).map(([k, v]) => `${v} of ${k}`).join(", ")}.`);
  if (args.includes("--write")) { fs.writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`); console.log(`Wrote ${path.relative(ROOT, OUT)}.`); }
}
