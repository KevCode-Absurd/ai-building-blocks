// "Skip it when" lines (page.yaml not_for) often name the item to use instead: "Use the Meta ads compliance checker."
// This finds those names, by an item's current name, an old name (catalogue-items/renamed.json) or its slug written out,
// so the build can show the current name as a link and tools/check-pages.mjs can report the names that are out of date.
// Pure functions, no file access: site/scripts/build-index.mjs, tools/check-pages.mjs and the tests share them.

const STOP_KEY = new Set(["the", "a", "an"]);
// Words as they are compared: lower case, apostrophes dropped ("founder's" and "founders" read the same).
const tokenRe = /[A-Za-z0-9]+(?:['’][A-Za-z]+)*/g;
const norm = (w) => w.toLowerCase().replace(/['’]/g, "");
const wordsOf = (s) => (String(s ?? "").match(tokenRe) ?? []).map(norm).filter((w, i) => i > 0 || !STOP_KEY.has(w));
// A rough stem, only so that "checker" and "check", "ads" and "ad", "planner" and "plan" compare equal.
export function stem(w) {
  let x = w;
  if (x.length > 4 && x.endsWith("ies")) x = `${x.slice(0, -3)}y`;
  else if (x.length > 3 && x.endsWith("s") && !x.endsWith("ss")) x = x.slice(0, -1);
  if (x.length > 5 && /(?:er|or)$/.test(x)) x = x.slice(0, -2);
  else if (x.length > 5 && x.endsWith("ing")) x = x.slice(0, -3);
  x = x.replace(/([b-df-hj-np-tv-z])\1$/, "$1");
  if (x.length > 3 && x.endsWith("e")) x = x.slice(0, -1);
  return x;
}
const exactKey = (words) => words.join(" ");
const stemKey = (words) => words.map(stem).join(" ");
export const slugify = (s) => String(s ?? "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * items: [{ slug, name, href, aliases? }] for every item that has a page; aliases are its earlier names (the page.yaml
 * name that display-copy.yaml replaced, and the aliases listed there). renamed: { oldSlug: newSlug } (renamed.json).
 * Names of one word are left out: too many of them are everyday words.
 */
export function makeNameIndex(items, renamed = {}) {
  const bySlug = new Map(items.filter((i) => i?.slug && i?.name).map((i) => [i.slug, i]));
  const exact = new Map(), old = new Map(), fuzzy = new Map();
  const add = (map, key, slug) => { if (!key) return; const set = map.get(key) ?? new Set(); set.add(slug); map.set(key, set); };
  let maxWords = 2;
  for (const it of bySlug.values()) {
    const w = wordsOf(it.name);
    if (w.length < 2) continue;
    maxWords = Math.max(maxWords, w.length);
    add(exact, exactKey(w), it.slug);
    add(fuzzy, stemKey(w), it.slug);
    for (const a of it.aliases ?? []) {
      const aw = wordsOf(a);
      if (aw.length < 2) continue;
      maxWords = Math.max(maxWords, aw.length);
      add(old, exactKey(aw), it.slug);
      add(fuzzy, stemKey(aw), it.slug);
    }
    const sw = it.slug.split("-").filter(Boolean);
    if (sw.length >= 2) { add(fuzzy, stemKey(sw), it.slug); maxWords = Math.max(maxWords, sw.length); }
  }
  // An old slug names the item it moved to, following a chain of renames.
  const follow = (s) => { const seen = new Set(); while (renamed[s] && !seen.has(s)) { seen.add(s); s = renamed[s]; } return s; };
  for (const from of Object.keys(renamed)) {
    const to = follow(from);
    if (!bySlug.has(to)) continue;
    const ow = from.split("-").filter(Boolean);
    if (ow.length < 2) continue;
    const key = stemKey(ow);
    // A current name always wins over an old one.
    if (fuzzy.has(key) && ![...fuzzy.get(key)].every((s) => s === to)) continue;
    add(fuzzy, key, to);
    maxWords = Math.max(maxWords, ow.length);
  }
  // One item per key. When two items share a name, the one whose slug is that name wins; otherwise the name is left alone.
  const pick = (map) => new Map([...map].map(([key, set]) => {
    if (set.size === 1) return [key, [...set][0]];
    const named = [...set].filter((s) => stemKey(s.split("-")) === key || exactKey(s.split("-")) === key);
    return [key, named.length === 1 ? named[0] : null];
  }));
  // A current name always wins over an earlier name of another item.
  for (const key of exact.keys()) old.delete(key);
  return { bySlug, exact: pick(exact), old: pick(old), fuzzy: pick(fuzzy), maxWords };
}

const SEP = /^[\s\-–&/+]+$/;
/**
 * The item names in one line, left to right, longest first, never overlapping.
 * how: "name" when the line already says the current name (any case), "old" when it says an earlier name or a slug.
 * A name written in lower case counts only right after "the" or "use", so an everyday phrase ("ask a data analyst",
 * "review video ad results") is never taken for an item, linked or rewritten.
 */
export function findItemNames(text, index, selfSlug) {
  const s = String(text ?? "");
  const toks = [...s.matchAll(tokenRe)].map((m) => ({ w: norm(m[0]), start: m.index, end: m.index + m[0].length }));
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    if (STOP_KEY.has(toks[i].w)) continue;
    for (let n = Math.min(index.maxWords, toks.length - i); n >= 2; n--) {
      const part = toks.slice(i, i + n);
      if (part.slice(1).some((t, k) => !SEP.test(s.slice(part[k].end, t.start)))) continue;
      const words = part.map((t) => t.w);
      let slug = index.exact.get(exactKey(words)), how = "name";
      if (slug === undefined) { slug = index.old.get(exactKey(words)); how = "old"; }
      if (slug === undefined) slug = index.fuzzy.get(stemKey(words));
      if (!slug || slug === selfSlug) continue;
      const start = part[0].start, end = part[n - 1].end, said = s.slice(start, end);
      // A name written in lower case counts only right after "the" or "use": "ask a data analyst" means a person.
      if (!/^[A-Z0-9]/.test(said) && !/\b(?:use|the)\s+$/i.test(s.slice(0, start))) continue;
      const item = index.bySlug.get(slug);
      if (how === "name" && said.toLowerCase() !== item.name.toLowerCase()) how = "old";
      if (how === "old" && said.toLowerCase() === item.name.toLowerCase()) how = "name";
      out.push({ start, end, said, slug, name: item.name, href: item.href, how });
      i += n - 1;
      break;
    }
  }
  return out;
}

/**
 * A "use the X" phrase that names no item we know: a pointer we can't resolve. Only capitalised names of 2 to 7 words
 * count, so ordinary advice ("use a spreadsheet") is not reported.
 */
const POINTER = /\b[Uu]se (?:the |our )([A-Z][A-Za-z0-9'’&-]*(?: [A-Za-z0-9'’&-]+){1,6}?)(?=[.,;:()!?]| or | then | and | to | for | first| instead| on | with | before | after |$)/g;
export function unresolvedPointers(text, found) {
  const s = String(text ?? "");
  return [...s.matchAll(POINTER)].filter((m) => {
    const start = m.index + m[0].length - m[1].length, end = start + m[1].length;
    return !found.some((f) => f.start < end && f.end > start);
  }).map((m) => m[1]);
}

/**
 * One page's not_for lines with old names replaced by the current name, plus where each link sits.
 * Lines that are not plain text are left as they are (and skipped), so indexes match the page's own list.
 * Returns { lines, links: [{ line, start, end, href, slug }], fixed: number of old names replaced }.
 */
export function linkNotFor(lines, index, selfSlug) {
  const outLines = [], links = [];
  let fixed = 0;
  (Array.isArray(lines) ? lines : []).forEach((line, li) => {
    if (typeof line !== "string") { outLines.push(line); return; }
    let text = "", at = 0;
    for (const f of findItemNames(line, index, selfSlug)) {
      text += line.slice(at, f.start);
      const shown = f.how === "old" ? f.name : f.said;
      if (f.how === "old") fixed++;
      links.push({ line: li, start: text.length, end: text.length + shown.length, href: f.href, slug: f.slug });
      text += shown;
      at = f.end;
    }
    outLines.push(text + line.slice(at));
  });
  return { lines: outLines, links, fixed };
}

// The page and the prerendered HTML split a line into text and links with site/src/lib/not-for-parts.mjs.
