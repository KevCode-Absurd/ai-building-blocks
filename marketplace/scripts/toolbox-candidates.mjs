// Finds library candidates for a role kit's toolbox.json, so a curator never has to read the whole library.
//
// It indexes every item in catalogue-items/ (skills, prompts, workflows, library agents, minds and AI tool guides),
// leaves out anything in quarantine.yaml, and caches the index in the OS temp folder. Run from the repo root:
//
//   node marketplace/scripts/toolbox-candidates.mjs --role <role-id>          the role brief a curator starts from
//   node marketplace/scripts/toolbox-candidates.mjs --queries q.json [--out results.txt] [--json] [--types a,b] [--limit n]
//                                                                             q.json: [{"id","q","types"?,"limit"?}];
//                                                                             --types and --limit set the batch defaults
//   node marketplace/scripts/toolbox-candidates.mjs --q "contrast check" [--types skill,prompt] [--limit 12]
//   node marketplace/scripts/toolbox-candidates.mjs --item <slug>[,<slug>] [--type skill] [--lines 60]
//                                                                             summary, inputs, outputs, start of method
//   node marketplace/scripts/toolbox-candidates.mjs --role-ids                 every role id, name and department
//   node marketplace/scripts/toolbox-candidates.mjs --stats                    index size by type
//   Add --rebuild to throw the cached index away.
//
// Ranking is BM25 per field with light stemming: the name counts most, then the summary, then tags (job, role,
// when to use, what you get), then the first 300 words of the method. An item that covers every query word, has
// them in its name or summary, or has two query words side by side, moves up. The ideas (field order, stop words,
// "-ise/-ize" as one spelling, doer nouns such as "checker" meeting "check", stand-in words at a discount) follow
// site/src/lib/library-search-core.ts; the code is separate so this script needs nothing built.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { quarantineClosure } from "../../tools/lib/quarantine.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, "..", "..");
export const CATALOGUE = path.join(REPO, "catalogue-items");
export const MARKETPLACE = path.join(REPO, "marketplace");
export const ITEM_TYPES = ["skill", "workflow", "prompt", "agent", "mind", "tool"];
const ITEM_SECTIONS = ["general", "ecommerce", "imported", "orchestrators", "agents"];
const INDEX_VERSION = "toolbox-index/3";
const BODY_WORDS = 300;

// ---------- Words ----------

const STOP = new Set(("a an and the for to of with in on is it how your my i want need help me please can could would like get make do does " +
  "about some this that our we us you am be being someone something anything everything nothing what which why where when should using " +
  "into from so but these those there their them they been have has had who or as at by are was were will its if then than each every any " +
  "all not no very just also up out off over per via during while both such only own same too can't cannot etc").split(" "));
/** Doing words whose "-er" form names the tool that does it ("checker", "planner"). Other "-er" words keep their
 *  ending: a poster is not a post and a banner is not a ban. */
const DOERS = new Set(("check track build find make pick read test draft scan score print plan write rewrite design review audit research map rank " +
  "sort tag tune spot publish summarise organise optimise analyse convert explain remind open start help explore fix size split sharpen " +
  "tighten shorten break catch watch match grade rate schedule trim clean brief price label format compare outline polish translate " +
  "sequence compress extract select detect connect estimate evaluate validate generate calculate simulate edit audit moderate render " +
  "reply respond repurpose forecast budget report recap digest sketch storyboard caption script pitch qualify triage route sync import " +
  "export merge dedupe lint debug refactor deploy migrate monitor profile benchmark localise personalise prioritise").split(" "));
const KEEP = new Set(["news", "canvas", "series", "lens", "ios", "sms", "saas", "gas", "bias", "atlas", "alias", "pros", "analysis", "basis", "thesis", "focus", "status", "bonus", "campus", "always", "across", "less", "business", "process", "access", "success", "address", "press", "class", "glass", "cross", "loss", "boss"]);
/** Words used for one thing. Typing one also finds the others, at a discount so the exact word still wins. */
const SYNONYM_GROUPS = [
  ["ad", "advert", "advertisement"], ["competitor", "rival"], ["customer", "buyer", "shopper"], ["store", "shop"], ["resume", "cv"],
  ["supplier", "vendor"], ["invoice", "bill"], ["hiring", "recruiting", "recruitment"], ["employee", "staff"],
  ["picture", "photo", "image"], ["contract", "agreement"], ["survey", "questionnaire"], ["headline", "title"],
  ["slide", "deck", "presentation"], ["spreadsheet", "excel", "workbook"], ["inventory", "stock"], ["forecast", "projection"],
  ["video", "clip"], ["booking", "appointment", "reservation"], ["series", "sequence", "flow", "drip"], ["flyer", "brochure", "pamphlet"],
  ["sign", "signage"], ["merch", "merchandise"], ["font", "typeface", "typography"], ["logo", "wordmark"], ["outreach", "prospecting"],
  ["onboarding", "welcome"], ["newsletter", "email"], ["checklist", "check"], ["hero", "header"], ["faq", "question"],
  ["testimonial", "review"], ["pricing", "price"], ["proposal", "quote"], ["persona", "avatar"], ["kpi", "metric"], ["sop", "procedure"],
  ["reel", "short"], ["thumbnail", "cover"], ["colour", "palette"], ["accessibility", "wcag"], ["refund", "return"],
];
const STAND_IN = 0.6;

/** One form for the endings that do not change what a word is about: plurals, "-ing", "-ed", "-ise/-ize",
 *  "colour/color", and the doer nouns above. Deliberately lighter than a full Porter stemmer. */
export function stem(word) {
  let w = word;
  if (w === "ads") return "ad";
  if (w.length < 4 || KEEP.has(w)) return w;
  w = w.replace(/^(.{3,}?)([iy])z(e|es|ed|er|ers|ing|ation|ations)$/, "$1$2s$3").replace(/isations?$/, "ise").replace(/^(.{2,})our(s|ed|ing|ful)?$/, "$1or$2");
  if (w.endsWith("ies") && w.length > 4) w = w.slice(0, -3) + "y";
  else if (/(?:ch|sh|x|z|ss)es$/.test(w)) w = w.slice(0, -2);
  else if (w.endsWith("s") && !/(?:ss|us|is)$/.test(w)) w = w.slice(0, -1);
  const doer = /^(.{3,}?)(?:er|or)$/.exec(w);
  if (doer) {
    const base = /([^aeiouylsz])\1$/.test(doer[1]) ? doer[1].slice(0, -1) : doer[1];
    for (const candidate of [base, base + "e", doer[1]]) if (DOERS.has(candidate)) { w = candidate; break; }
  }
  const m = /^(.{3,}?)(?:ing|ed)$/.exec(w);
  if (m && /[aeiouy]/.test(m[1]) && !m[1].endsWith("e")) {
    let s = m[1];
    if (s.length > 3 && /([^aeiouylsz])\1$/.test(s)) s = s.slice(0, -1);
    else if (s.length <= 3 && /[^aeiou][aeiou][^aeiouwxy]$/.test(s)) s += "e";
    w = s;
  }
  if (w.length >= 5 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

/** Every indexable word of a text, stemmed, in order. */
export function tokens(text) {
  const plain = String(text ?? "").normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/<[^>]*>/g, " ").replace(/\ba\/b\b/g, " ab ").replace(/\be-mails?\b/g, " email ").replace(/[’']/g, "");
  const out = [];
  for (const raw of plain.match(/[\p{L}\p{N}]+/gu) ?? []) {
    if (STOP.has(raw)) continue;
    const t = stem(raw);
    if (t !== "make") out.push(t);
  }
  return out;
}

const SYNONYMS = new Map();
for (const group of SYNONYM_GROUPS) {
  const stems = [...new Set(group.map(stem))];
  for (const s of stems) SYNONYMS.set(s, [...new Set([...(SYNONYMS.get(s) ?? []), ...stems.filter(x => x !== s)])]);
}

// ---------- Reading the library ----------

let yamlLib;
function yaml() {
  if (yamlLib) return yamlLib;
  for (const app of ["site", "marketplace"]) {
    try { return yamlLib = createRequire(path.join(REPO, app, "package.json"))("yaml"); } catch { /* try the next install */ }
  }
  throw new Error("toolbox-candidates: the 'yaml' package was not found in site/node_modules or marketplace/node_modules.");
}
const read = file => readFileSync(file, "utf8").replace(/^﻿/, "");
const isDir = p => statSync(p, { throwIfNoEntry: false })?.isDirectory() ?? false;

/** Parses only the named top-level keys of a YAML file. Item pages are long (examples, tests, credits); the index
 *  needs a handful of keys, and one broken block should not lose the item. */
export function pickKeys(text, keys) {
  const out = {};
  // Some files are one single-line mapping ({"slug": ..., "summary": ...}); no key starts a line there, so read it whole.
  if (/^\s*\{/.test(text)) {
    try {
      const v = yaml().parse(text);
      if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).filter(([k]) => keys.has(k)));
    } catch { /* fall through to the line reader */ }
  }
  let key = null, buf = [];
  const flush = () => {
    if (!key || !keys.has(key)) return;
    try { const v = yaml().parse(buf.join("\n")); if (v && typeof v === "object") Object.assign(out, v); } catch { /* skip this block */ }
  };
  for (const line of text.split(/\r?\n/)) {
    if (line === "---" || line === "...") continue;
    const m = /^([A-Za-z_][\w-]*)\s*:/.exec(line);
    if (m) { flush(); key = m[1]; buf = [line]; } else if (key) buf.push(line);
  }
  flush();
  return out;
}
const ITEM_KEYS = new Set(["slug", "name", "summary", "category", "boards", "type", "role", "job", "level", "inputs", "outputs", "uses", "steps"]);
const PAGE_KEYS = new Set(["name", "summary", "job", "headline", "subhead", "explain", "when", "you_give", "you_get"]);
const MIND_KEYS = new Set(["slug", "name", "identity", "area", "also", "known_for", "summary", "use_cases", "seats"]);
const TOOL_KEYS = new Set(["slug", "name", "maker", "promise", "use_cases", "categories", "what_it_does", "benefits", "best_for", "runs_in"]);

export function splitFrontMatter(md) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(md);
  return m ? { front: m[1], body: md.slice(m[0].length) } : { front: "", body: md };
}
/** The item's own method: the SKILL.md body without front matter and without the generated "Before you start" block. */
export function methodText(md) {
  return splitFrontMatter(md).body.replace(/<!-- needs:[\s\S]*?<!-- \/needs -->\s*/g, "").trim();
}
const firstWords = (text, n) => String(text ?? "").split(/\s+/).slice(0, n).join(" ");
const list = v => Array.isArray(v) ? v : v === undefined || v === null ? [] : [v];
const strings = v => list(v).filter(x => typeof x === "string");
const oneLine = text => String(text ?? "").replace(/\s+/g, " ").trim();
const cut = (text, n) => { const s = oneLine(text); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…"; };

function readLibraryItem(root, section, dir) {
  const base = path.join(root, section, dir);
  if (!existsSync(path.join(base, "item.yaml"))) return null;
  const item = pickKeys(read(path.join(base, "item.yaml")), ITEM_KEYS);
  const page = existsSync(path.join(base, "page.yaml")) ? pickKeys(read(path.join(base, "page.yaml")), PAGE_KEYS) : {};
  const md = existsSync(path.join(base, "SKILL.md")) ? read(path.join(base, "SKILL.md")) : "";
  const front = md ? pickKeys(splitFrontMatter(md).front, new Set(["description"])) : {};
  const slug = typeof item.slug === "string" ? item.slug : dir;
  const type = itemType(item);
  const steps = list(item.steps).filter(s => s && typeof s === "object");
  const uses = [...new Set([...strings(item.uses), ...steps.map(s => s.uses).filter(u => typeof u === "string")])];
  const io = rows => list(rows).map(r => typeof r === "string" ? r : r?.type).filter(Boolean).map(t => String(t).replace(/_/g, " "));
  return {
    type, slug, name: oneLine(item.name ?? page.name ?? slug), summary: oneLine(item.summary ?? page.summary ?? ""),
    job: item.job ?? "", role: item.role ?? "", dir: `${section}/${dir}`, uses,
    fields: [
      [item.name, page.name !== item.name ? page.name : "", page.headline !== item.name ? page.headline : "", slug.replace(/-/g, " ")],
      [item.summary, page.summary, page.subhead, front.description],
      [item.job, item.role, page.job, item.category, ...strings(item.boards), ...io(item.outputs), ...strings(page.when), ...strings(page.you_get), ...uses.map(u => u.replace(/-/g, " "))],
      [page.explain, steps.map(s => s.note ?? "").join(" "), firstWords(methodText(md), BODY_WORDS)],
    ],
  };
}

function readMind(root, dir) {
  const base = path.join(root, "minds", dir);
  if (!existsSync(path.join(base, "mind.yaml"))) return null;
  const mind = pickKeys(read(path.join(base, "mind.yaml")), MIND_KEYS);
  const playbookFile = ["playbook.md", "SKILL.md"].map(f => path.join(base, f)).find(existsSync);
  const playbook = playbookFile ? methodText(read(playbookFile)) : "";
  const hire = /^## What to hire[^\n]*\n([\s\S]*?)(?=^## )/m.exec(playbook)?.[1] ?? playbook;
  const seats = list(mind.seats).filter(s => s && typeof s === "object");
  return {
    type: "mind", slug: typeof mind.slug === "string" ? mind.slug : dir, name: oneLine(mind.name ?? dir), summary: oneLine(mind.summary ?? mind.known_for ?? ""),
    job: "", role: "", area: [mind.area, ...strings(mind.also)].filter(Boolean).join(","), dir: `minds/${dir}`, uses: [],
    fields: [[mind.name], [mind.summary, mind.known_for, mind.identity], [mind.area, ...strings(mind.also), ...strings(mind.use_cases), ...seats.flatMap(s => [s.seat, s.asks])], [firstWords(hire, BODY_WORDS)]],
  };
}

function readTool(root, file) {
  const tool = pickKeys(read(path.join(root, "ai-tools", file)), TOOL_KEYS);
  const slug = typeof tool.slug === "string" ? tool.slug : file.replace(/\.yaml$/, "");
  return {
    type: "tool", slug, name: oneLine(tool.name ?? slug), summary: oneLine(tool.promise ?? ""), job: "", role: "",
    area: strings(tool.categories).join(","), dir: `ai-tools/${file}`, uses: [],
    fields: [[tool.name, tool.maker], [tool.promise], [...strings(tool.use_cases).map(u => u.replace(/-/g, " ")), ...strings(tool.categories), ...strings(tool.best_for)], [...strings(tool.what_it_does), ...strings(tool.benefits)]],
  };
}

const itemType = item => item.category === "orchestrator" || item.type === "routine" ? "workflow" : ITEM_TYPES.includes(item.type) ? item.type : "skill";
const quarantineList = root => {
  const file = path.join(root, "quarantine.yaml");
  const listed = existsSync(file) ? yaml().parse(read(file)) ?? {} : {};
  return Array.isArray(listed) ? listed.map(String) : Object.keys(listed);
};

/**
 * Every library slug and the type or types it exists as, plus the quarantined slugs. This is the quick read the
 * checker needs (a second or two): it takes slug, type and category from the top of each file and builds no
 * search index. Only when quarantine.yaml lists something does it also read which items each workflow uses.
 */
export function libraryTypes(root = CATALOGUE) {
  const quarantined = quarantineList(root);
  const field = (text, key) => new RegExp(`^${key}:[ \\t]*(.+?)[ \\t]*$`, "m").exec(text)?.[1].replace(/^(["'])(.*)\1$/, "$2");
  const rows = [];
  for (const section of ITEM_SECTIONS) {
    const dir = path.join(root, section);
    if (!isDir(dir)) continue;
    for (const name of readdirSync(dir)) {
      let text;
      try { text = read(path.join(dir, name, "item.yaml")); } catch { continue; }
      const uses = quarantined.length ? pickKeys(text, new Set(["uses", "steps"])) : {};
      rows.push({ slug: field(text, "slug") ?? name, type: itemType({ type: field(text, "type"), category: field(text, "category") }), uses: strings(uses.uses), steps: list(uses.steps).filter(s => s && typeof s === "object") });
    }
  }
  if (isDir(path.join(root, "minds"))) for (const name of readdirSync(path.join(root, "minds"))) {
    const file = path.join(root, "minds", name, "mind.yaml");
    if (existsSync(file)) rows.push({ slug: field(read(file), "slug") ?? name, type: "mind" });
  }
  if (isDir(path.join(root, "ai-tools"))) for (const file of readdirSync(path.join(root, "ai-tools"))) {
    if (file.endsWith(".yaml") && !file.startsWith("_")) rows.push({ slug: field(read(path.join(root, "ai-tools", file)), "slug") ?? file.replace(/\.yaml$/, ""), type: "tool" });
  }
  const blocked = quarantineClosure(rows, quarantined);
  const types = new Map();
  for (const row of rows) if (!blocked.has(row.slug)) types.set(row.slug, [...new Set([...(types.get(row.slug) ?? []), row.type])]);
  return { types, quarantined: blocked };
}

/** Reads the whole library into a search index. Quarantined items, and workflows or agents that would ship one, are left out. */
export function buildIndex(root = CATALOGUE) {
  const raw = [];
  for (const section of ITEM_SECTIONS) {
    const dir = path.join(root, section);
    if (!isDir(dir)) continue;
    for (const name of readdirSync(dir).sort()) if (isDir(path.join(dir, name))) { const doc = readLibraryItem(root, section, name); if (doc) raw.push(doc); }
  }
  if (isDir(path.join(root, "minds"))) for (const name of readdirSync(path.join(root, "minds")).sort()) {
    if (isDir(path.join(root, "minds", name))) { const doc = readMind(root, name); if (doc) raw.push(doc); }
  }
  if (isDir(path.join(root, "ai-tools"))) for (const file of readdirSync(path.join(root, "ai-tools")).sort()) {
    if (file.endsWith(".yaml") && !file.startsWith("_")) raw.push(readTool(root, file));
  }
  const blocked = quarantineClosure(raw, quarantineList(root));
  const kept = raw.filter(d => !blocked.has(d.slug));

  const docs = [], seq = [], len = [], postings = new Map(), totals = [0, 0, 0, 0];
  kept.forEach((doc, id) => {
    const perField = doc.fields.map(parts => tokens(parts.filter(Boolean).join(" \n ")));
    perField.forEach((toks, f) => {
      len.push(toks.length); totals[f] += toks.length;
      for (const t of toks) {
        let byDoc = postings.get(t); if (!byDoc) postings.set(t, byDoc = new Map());
        let tf = byDoc.get(id); if (!tf) byDoc.set(id, tf = [0, 0, 0, 0]);
        tf[f]++;
      }
    });
    seq.push([` ${perField[0].join(" ")} `, ` ${perField[1].join(" ")} `]);
    docs.push({ type: doc.type, slug: doc.slug, name: doc.name, summary: doc.summary, job: doc.job, role: doc.role, ...(doc.area ? { area: doc.area } : {}), dir: doc.dir });
  });
  const flat = {};
  for (const [term, byDoc] of postings) { const row = []; for (const [id, tf] of byDoc) row.push(id, ...tf); flat[term] = row; }
  return { version: INDEX_VERSION, docs, seq, len, avg: totals.map(t => t / Math.max(1, docs.length)), postings: flat, quarantined: [...blocked].sort() };
}

// ---------- The cached index ----------

/** Git's id for the committed catalogue-items tree. It changes when a commit changes the library, and not when a
 *  curator commits a toolbox.json, so their cached index survives their own commits. */
function catalogueTree(root) {
  try { return execFileSync("git", ["rev-parse", "HEAD:./"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; }
}

/** Cheap to work out: the committed library tree, each item folder's name and folder time, the quarantine list and this
 *  script. It does not open item files, so after editing an item by hand without committing, pass --rebuild. */
export function fingerprint(root = CATALOGUE) {
  const hash = createHash("sha1").update(INDEX_VERSION);
  const stamp = file => { const s = statSync(file, { throwIfNoEntry: false }); return s ? `${Math.round(s.mtimeMs)}:${s.size}` : "none"; };
  hash.update(stamp(fileURLToPath(import.meta.url))).update(catalogueTree(root));
  for (const section of [...ITEM_SECTIONS, "minds", "ai-tools"]) {
    const dir = path.join(root, section);
    if (!isDir(dir)) continue;
    for (const name of readdirSync(dir).sort()) hash.update(`${section}/${name}:${Math.round(statSync(path.join(dir, name), { throwIfNoEntry: false })?.mtimeMs ?? 0)};`);
  }
  hash.update(stamp(path.join(root, "quarantine.yaml")));
  return hash.digest("hex");
}

export function cacheFile(root = CATALOGUE) {
  return path.join(os.tmpdir(), `ai-blocks-toolbox-index-${createHash("sha1").update(path.resolve(root)).digest("hex").slice(0, 12)}.json`);
}

export function loadIndex({ root = CATALOGUE, rebuild = false, cache = true } = {}) {
  const file = cacheFile(root), print = cache ? fingerprint(root) : "";
  if (cache && !rebuild && existsSync(file)) {
    try { const saved = JSON.parse(readFileSync(file, "utf8")); if (saved.fingerprint === print && saved.version === INDEX_VERSION) return withLookup(saved); } catch { /* rebuild below */ }
  }
  const index = buildIndex(root);
  if (cache) {
    index.fingerprint = print;
    try { mkdirSync(path.dirname(file), { recursive: true }); const tmp = `${file}.${process.pid}.tmp`; writeFileSync(tmp, JSON.stringify(index)); renameSync(tmp, file); } catch { /* the cache is only a speed-up */ }
  }
  return withLookup(index);
}

function withLookup(index) {
  const bySlug = new Map();
  index.docs.forEach((doc, id) => { const rows = bySlug.get(doc.slug) ?? []; rows.push(id); bySlug.set(doc.slug, rows); });
  Object.defineProperty(index, "bySlug", { value: bySlug, enumerable: false });
  return index;
}
/** Every index entry with this slug (a mind and a skill could share one), optionally of one type. */
export function findItems(index, slug, type) {
  const ids = (index.bySlug ?? withLookup(index).bySlug).get(slug) ?? [];
  return ids.map(id => index.docs[id]).filter(doc => !type || doc.type === type);
}

// ---------- Search ----------

const WEIGHT = [6, 3, 1.5, 1], LENGTH_NORM = [0.3, 0.5, 0.6, 0.75], K1 = 1.4;

export function search(index, query, { types, limit = 12 } = {}) {
  const want = types?.length ? new Set(types) : null;
  const words = [...new Set(tokens(query))];
  const n = index.docs.length;
  const idf = term => { const df = (index.postings[term]?.length ?? 0) / 5; return df ? Math.log(1 + (n - df + 0.5) / (df + 0.5)) : 0; };
  const score = new Float64Array(n), mass = new Float64Array(n), head = new Uint8Array(n), named = new Uint8Array(n), matched = new Uint8Array(n);
  let total = 0, groups = 0;
  for (const word of words) {
    const variants = [[word, 1], ...(SYNONYMS.get(word) ?? []).map(s => [s, STAND_IN])];
    const groupIdf = Math.max(...variants.map(([term]) => idf(term)));
    if (!groupIdf) continue;
    total += groupIdf; groups++;
    const best = new Map();
    for (const [term, discount] of variants) {
      const rows = index.postings[term];
      if (!rows) continue;
      const termIdf = idf(term) * discount;
      for (let i = 0; i < rows.length; i += 5) {
        const id = rows[i];
        let s = 0;
        for (let f = 0; f < 4; f++) {
          const tf = rows[i + 1 + f];
          if (tf) s += WEIGHT[f] * tf * (K1 + 1) / (tf + K1 * (1 - LENGTH_NORM[f] + LENGTH_NORM[f] * index.len[id * 4 + f] / (index.avg[f] || 1)));
        }
        s *= termIdf;
        const inName = rows[i + 1] > 0, inHead = inName || rows[i + 2] > 0, hit = best.get(id);
        if (!hit) best.set(id, [s, inHead, inName]); else { if (s > hit[0]) hit[0] = s; hit[1] ||= inHead; hit[2] ||= inName; }
      }
    }
    for (const [id, [s, inHead, inName]] of best) { score[id] += s; mass[id] += groupIdf; matched[id]++; if (inHead) head[id]++; if (inName) named[id]++; }
  }
  if (!groups) return [];
  const ranked = [];
  for (let id = 0; id < n; id++) {
    if (!score[id] || want && !want.has(index.docs[id].type)) continue;
    const cover = mass[id] / total;
    ranked.push([id, score[id] * cover * cover * (1 + 0.4 * head[id] / groups) * (named[id] === groups ? 1.25 : 1)]);
  }
  ranked.sort((a, b) => b[1] - a[1]);
  // Two query words side by side in the name or summary are a stronger sign than the same words apart.
  const pairs = [];
  const ordered = tokens(query);
  for (let i = 0; i + 1 < ordered.length; i++) if (ordered[i] !== ordered[i + 1]) pairs.push(` ${ordered[i]} ${ordered[i + 1]} `);
  const top = ranked.slice(0, Math.max(200, limit * 10));
  for (const row of top) for (const pair of pairs) {
    const [name, summary] = index.seq[row[0]];
    row[1] *= name.includes(pair) ? 1.25 : summary.includes(pair) ? 1.1 : 1;
  }
  top.sort((a, b) => b[1] - a[1] || (index.docs[a[0]].slug < index.docs[b[0]].slug ? -1 : 1));
  return top.slice(0, limit).map(([id, s]) => ({ ...index.docs[id], score: Math.round(s * 100) / 100, words: `${matched[id]}/${groups}` }));
}

/** `type | slug | name | summary (max 160 chars) | job/role fields if present`. A result that misses some of the
 *  query's words ends with "words=2/3": treat it as a weak match. */
export function resultLine(doc) {
  const [hit, of] = String(doc.words ?? "").split("/");
  const extra = [doc.job && `job=${doc.job}`, doc.role && `role=${doc.role}`, doc.area && `area=${doc.area}`, hit && hit !== of && `words=${doc.words}`].filter(Boolean).join(" ");
  return [doc.type, doc.slug, doc.name, cut(doc.summary, 160), extra].filter((part, i) => i < 4 || part).join(" | ");
}

/** `defaults` (types, limit) apply to any query that does not set its own. */
export function runQueries(index, queries, defaults = {}) {
  if (!Array.isArray(queries)) throw new Error("The queries file must hold a list: [{\"id\":\"...\",\"q\":\"...\"}]");
  return queries.map((row, i) => {
    if (!row || typeof row.q !== "string" || !row.q.trim()) throw new Error(`Query ${i + 1} needs a "q" string.`);
    const types = row.types === undefined ? defaults.types : list(row.types);
    for (const t of types ?? []) if (!ITEM_TYPES.includes(t)) throw new Error(`Query ${i + 1} (${row.id ?? row.q}): unknown type "${t}". Use ${ITEM_TYPES.join(", ")}.`);
    const asked = row.limit ?? defaults.limit, limit = Number.isInteger(asked) && asked > 0 ? Math.min(asked, 50) : 12;
    return { id: typeof row.id === "string" ? row.id : `q${i + 1}`, q: row.q.trim(), ...(types?.length ? { types } : {}), results: search(index, row.q, { types, limit }) };
  });
}
/** One block per query. An item already printed for an earlier query in the batch is cut to "= slug (see <query id>)",
 *  which keeps a 60-query batch short enough to read in one go. */
export function queriesText(answers) {
  const seen = new Map();
  return answers.map(a => [`## ${a.id}: ${a.q}${a.types ? ` [${a.types.join(",")}]` : ""}`, ...(a.results.length ? a.results.map(doc => {
    const key = `${doc.type}:${doc.slug}`, first = seen.get(key);
    if (first) return `= ${doc.slug} (see ${first})`;
    seen.set(key, a.id);
    return resultLine(doc);
  }) : ["(no match)"])].join("\n")).join("\n\n") + "\n";
}

// ---------- One item, for settling a doubt ----------

export function itemText(index, slug, { root = CATALOGUE, type, lines = 60 } = {}) {
  const found = findItems(index, slug, type);
  if (!found.length) return index.quarantined?.includes(slug) ? `${slug}: quarantined, do not use.\n` : `${slug}: no library item has this slug${type ? ` with type ${type}` : ""}.\n`;
  return found.map(doc => {
    const base = path.join(root, doc.dir), out = [`${doc.type} | ${doc.slug} | ${doc.name}`, `Summary: ${doc.summary}`];
    const io = rows => list(rows).map(r => typeof r === "string" ? r : r?.type ? `${r.type}${r.required ? " (required)" : ""}` : "").filter(Boolean).join(", ");
    let methodFile = "";
    if (doc.type === "tool") {
      const tool = pickKeys(read(base), TOOL_KEYS);
      out.push(`Categories: ${strings(tool.categories).join(", ")}`, `Use cases: ${strings(tool.use_cases).join(", ")}`, "What it does:", ...strings(tool.what_it_does).map(s => `- ${s}`), "Best for:", ...strings(tool.best_for).map(s => `- ${s}`));
    } else if (doc.type === "mind") {
      const mind = pickKeys(read(path.join(base, "mind.yaml")), MIND_KEYS);
      out.push(`Area: ${doc.area ?? ""}`, `Known for: ${oneLine(mind.known_for)}`, "Use cases:", ...strings(mind.use_cases).map(s => `- ${s}`));
      methodFile = ["playbook.md", "SKILL.md"].map(f => path.join(base, f)).find(existsSync) ?? "";
    } else {
      const item = pickKeys(read(path.join(base, "item.yaml")), ITEM_KEYS);
      const page = existsSync(path.join(base, "page.yaml")) ? pickKeys(read(path.join(base, "page.yaml")), PAGE_KEYS) : {};
      out.push(`Job: ${doc.job || "-"}  Role: ${doc.role || "-"}  Level: ${item.level ?? "-"}`, `Inputs: ${io(item.inputs) || "-"}`);
      if (strings(page.you_give).length) out.push(`You give: ${strings(page.you_give).map(oneLine).join("; ")}`);
      out.push(`Outputs: ${io(item.outputs) || "-"}`);
      if (strings(page.you_get).length) out.push(`You get: ${strings(page.you_get).map(oneLine).join("; ")}`);
      const uses = [...new Set([...strings(item.uses), ...list(item.steps).map(s => s?.uses).filter(Boolean)])];
      if (uses.length) out.push(`Uses: ${uses.join(", ")}`);
      methodFile = path.join(base, "SKILL.md");
    }
    if (methodFile && existsSync(methodFile)) {
      const body = methodText(read(methodFile)).split(/\r?\n/).filter((line, i, all) => line.trim() || all[i - 1]?.trim());
      out.push("", `Method (first ${Math.min(lines, body.length)} of ${body.length} lines, ${path.relative(path.dirname(root), methodFile).replace(/\\/g, "/")}):`, ...body.slice(0, lines));
    }
    return out.join("\n");
  }).join("\n\n---\n\n") + "\n";
}

// ---------- Roles ----------

const readJson = file => JSON.parse(read(file));
export function roleIds(packs = path.join(MARKETPLACE, "packs")) {
  const dir = path.join(packs, "roles");
  return isDir(dir) ? readdirSync(dir).filter(id => existsSync(path.join(dir, id, "role.json"))).sort() : [];
}
const dataCache = new Map();
function dataRows(dataDir, prefix) {
  const key = `${dataDir}|${prefix}`;
  if (!dataCache.has(key)) dataCache.set(key, isDir(dataDir) ? readdirSync(dataDir).filter(f => f.startsWith(prefix) && f.endsWith(".json")).sort().flatMap(f => { const rows = readJson(path.join(dataDir, f)); return Array.isArray(rows) ? rows : []; }) : []);
  return dataCache.get(key);
}
const firstSentence = (text, n) => cut(oneLine(text).replace(/^(.*?[.!?])\s.*$/, "$1"), n);

/** The kit's own items as toolbox refs, each with a one-line purpose. */
export function kitItems(kitDir) {
  const out = [];
  const skills = path.join(kitDir, "skills");
  if (isDir(skills)) for (const name of readdirSync(skills).sort()) {
    const file = path.join(skills, name, "SKILL.md");
    if (existsSync(file)) out.push({ ref: `kit:skills/${name}`, kind: "skill", purpose: firstSentence(pickKeys(splitFrontMatter(read(file)).front, new Set(["description"])).description ?? "", 200) });
  }
  for (const [folder, kind, label] of [["prompts", "prompt", /\*\*When to use:\*\*\s*(.+)/], ["workflows", "workflow", /^\*\*(?:Trigger|Cadence|Goal)[^*\n]*:\*\*\s*(.+)/m]]) {
    const dir = path.join(kitDir, folder);
    if (isDir(dir)) for (const file of readdirSync(dir).filter(f => f.endsWith(".md")).sort()) {
      const md = read(path.join(dir, file));
      const title = /^#\s+(.+)$/m.exec(md)?.[1].trim() ?? "", when = firstSentence(label.exec(md)?.[1] ?? "", 150);
      out.push({ ref: `kit:${folder}/${file.replace(/\.md$/, "")}`, kind, purpose: [title, when].filter(Boolean).join(". ").replace(/\.\.$/, ".") });
    }
  }
  return out;
}

/** What a curator needs to know about a role before writing queries, in about 2,500 words at most. */
export function roleBrief(roleId, { index, packs = path.join(MARKETPLACE, "packs"), data = path.join(MARKETPLACE, "src", "modules") } = {}) {
  const kitDir = path.join(packs, "roles", roleId);
  if (!existsSync(path.join(kitDir, "role.json"))) throw new Error(`No role kit at ${path.relative(REPO, kitDir).replace(/\\/g, "/")}. Run --role-ids for the list.`);
  const role = readJson(path.join(kitDir, "role.json"));
  const personas = dataRows(path.join(data, "directory", "data"), "personas-").filter(p => p.role === roleId).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  const jobTitles = new Map(dataRows(path.join(data, "catalogue", "data"), "jobs-").map(j => [j.id, j.title]));
  const kit = kitItems(kitDir);
  const build = ({ outcomes = 8, goodAt = true, libraryNames = true }) => {
    const out = [`ROLE ${roleId}: ${role.name} (${role.department ?? "no department"})`, `Summary: ${oneLine(role.summary)}`, `Also called: ${strings(role.aliases).join(", ") || "-"}`];
    for (const [kind, title] of [["skill", "KIT SKILLS"], ["prompt", "KIT PROMPTS"], ["workflow", "KIT WORKFLOWS"]]) {
      out.push("", `${title} (each must appear in at least one task)`, ...kit.filter(k => k.kind === kind).map(k => `- ${k.ref}: ${k.purpose}`));
    }
    const knowledge = path.join(kitDir, "knowledge.md");
    if (existsSync(knowledge)) {
      const rows = [];
      for (const m of read(knowledge).matchAll(/^(##|###)\s+(.+)$/gm)) { if (m[1] === "##") rows.push([m[2].trim(), []]); else rows.at(-1)?.[1].push(m[2].trim()); }
      out.push("", "KNOWLEDGE.MD HEADINGS", ...rows.map(([h2, h3]) => `- ${h2}${h3.length ? `: ${h3.join("; ")}` : ""}`));
    }
    out.push("", `PERSONAS WITH THIS ROLE (${personas.length})`);
    const jobIds = new Set();
    for (const p of personas) {
      const rows = list(p.profile?.outcomes);
      rows.forEach(o => o?.job_type_id && jobIds.add(o.job_type_id));
      out.push(`- ${p.id} | ${p.title} | ${oneLine(p.tagline)}`, `  outcomes: ${rows.slice(0, outcomes).map(o => oneLine(o?.title)).join("; ") || "-"}`);
      if (goodAt && strings(p.profile?.good_at).length) out.push(`  good at: ${strings(p.profile.good_at).join("; ")}`);
    }
    out.push("", `JOB TYPES THESE PERSONAS LINK TO: ${[...jobIds].sort().map(id => jobTitles.has(id) ? `${id} (${jobTitles.get(id)})` : id).join(", ") || "-"}`);
    const libraryFile = path.join(kitDir, "library.json");
    const rows = existsSync(libraryFile) ? list(readJson(libraryFile)) : [];
    out.push("", `CURRENT LIBRARY.JSON (${rows.length} rows; check each still fits before reusing it)`);
    for (const row of rows) {
      const found = index ? findItems(index, row.slug) : [];
      const state = !index ? "" : found.length ? found.map(d => d.type).join("/") : index.quarantined?.includes(row.slug) ? "QUARANTINED" : "NOT IN LIBRARY";
      out.push(`- ${[state, row.slug, libraryNames ? row.name : ""].filter(Boolean).join(" | ")}`);
    }
    return out.join("\n") + "\n";
  };
  const wordCount = text => text.split(/\s+/).filter(Boolean).length;
  for (const shape of [{}, { goodAt: false }, { goodAt: false, outcomes: 4 }, { goodAt: false, outcomes: 3, libraryNames: false }]) {
    const text = build(shape);
    if (wordCount(text) <= 2500) return text;
  }
  return build({ goodAt: false, outcomes: 2, libraryNames: false });
}

// ---------- Command line ----------

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const m = /^--([a-z-]+)(?:=(.*))?$/.exec(argv[i]);
    if (!m) throw new Error(`Unexpected argument "${argv[i]}".`);
    if (m[2] !== undefined) args[m[1]] = m[2];
    else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) args[m[1]] = argv[++i];
    else args[m[1]] = true;
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  const emit = text => { if (typeof args.out === "string") { writeFileSync(path.resolve(args.out), text); console.log(`Wrote ${args.out} (${text.split(/\s+/).filter(Boolean).length} words).`); } else process.stdout.write(text); };
  if (args["role-ids"]) {
    const rows = roleIds().map(id => { const r = readJson(path.join(MARKETPLACE, "packs", "roles", id, "role.json")); return { id, name: r.name ?? "", department: r.department ?? "" }; });
    return emit(args.json ? JSON.stringify(rows, null, 1) + "\n" : rows.map(r => `${r.id} | ${r.name} | ${r.department}`).join("\n") + "\n");
  }
  const index = loadIndex({ rebuild: args.rebuild === true });
  if (args.stats) {
    const counts = Object.fromEntries(ITEM_TYPES.map(t => [t, index.docs.filter(d => d.type === t).length]));
    return emit(args.json ? JSON.stringify({ total: index.docs.length, ...counts, quarantined: index.quarantined.length }) + "\n"
      : `${index.docs.length} items: ${ITEM_TYPES.map(t => `${counts[t]} ${t}`).join(", ")}; ${index.quarantined.length} quarantined left out; ${Object.keys(index.postings).length} distinct words\nCache: ${cacheFile()}\n`);
  }
  if (typeof args.role === "string") return emit(roleBrief(args.role, { index }));
  if (typeof args.item === "string") {
    const options = { type: typeof args.type === "string" ? args.type : undefined, ...(Number(args.lines) > 0 ? { lines: Number(args.lines) } : {}) };
    return emit(args.item.split(",").map(s => s.trim()).filter(Boolean).map(slug => itemText(index, slug, options)).join("\n---\n\n"));
  }
  const queries = typeof args.queries === "string" ? JSON.parse(read(path.resolve(args.queries))) : typeof args.q === "string" ? [{ id: "q", q: args.q }] : null;
  if (queries) {
    const defaults = { ...(typeof args.types === "string" ? { types: args.types.split(",").map(s => s.trim()).filter(Boolean) } : {}), ...(Number(args.limit) > 0 ? { limit: Number(args.limit) } : {}) };
    for (const t of defaults.types ?? []) if (!ITEM_TYPES.includes(t)) throw new Error(`Unknown type "${t}". Use ${ITEM_TYPES.join(", ")}.`);
    const answers = runQueries(index, queries, defaults);
    return emit(args.json ? JSON.stringify(answers, null, 1) + "\n" : queriesText(answers));
  }
  console.log("Usage: node marketplace/scripts/toolbox-candidates.mjs --role <id> | --queries <file.json> [--out <file>] [--json] | --q \"words\" [--types a,b] [--limit n] | --item <slug> [--type t] | --role-ids | --stats  [--rebuild]");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); } catch (e) { console.error(`toolbox-candidates: ${e.message}`); process.exit(1); }
}
