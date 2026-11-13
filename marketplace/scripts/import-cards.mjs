// Imports extracted knowledge cards into marketplace/knowledge/<vertical>/ (layout: knowledge/README.md).
//
//   node scripts/import-cards.mjs --vertical=ecommerce --from=<folder with batch-*/cards.jsonl and sources.jsonl> [--dry]
//
// The extraction step (one model pass per source document, following the vertical's card brief) writes one JSON
// object per line. This script, with no model:
// 1. gives every source an id (S0001...) by its file name, keeping ids already in sources.json, corrects rights for
//    books and paid courses (always licensed), and marks a source public only when its rights are owned or
//    public_reference;
// 2. normalises each card (module aliases such as DEP to ADC, empty fields to [] or ""), keeps its id when the same
//    source and claim were imported before, and numbers new cards per primary module (LPG-0001...);
// 3. drops near-duplicates inside a module (word-set Jaccard 0.6 or more over claim and body), keeping the better
//    tier, then the one with more numbers and asks;
// 4. validates every card (src/modules/knowledge/cards.ts cardProblems) and holds back any that fail, with the reason
//    in _held.json;
// 5. writes sources.json and cards/<CODE>.json (sorted, 2-space JSON, LF), and prints a report.
//
// --meta=<file.jsonl> merges recovered source metadata ({ file, title, author, url, date, kind, confidence }, one per
// line, from a separate lookup of each source's real page). With high or medium confidence it fills the url, publish
// date, title and author. A source that was tier 4 only because it had no date (the extractor's notes say so) goes
// back to tier 3, the tier of a named practitioner, and so do its cards, except anecdotes.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_RIGHTS, RIGHTS, cardProblems, cardSimilarity } from "../src/modules/knowledge/cards.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = n => process.argv.find(a => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const verticalId = arg("vertical") ?? "ecommerce";
const from = arg("from");
const dry = process.argv.includes("--dry");
if (!from) { console.error("Usage: node scripts/import-cards.mjs --vertical=ecommerce --from=<folder> [--dry]"); process.exit(2); }
const DIR = path.join(ROOT, "knowledge", verticalId);
const vertical = JSON.parse(readFileSync(path.join(DIR, "vertical.json"), "utf8"));
const codes = new Set(vertical.modules.map(m => m.code));
const aliases = vertical.aliases ?? {};

/** Books and paid courses are licensed, whatever their header says (generator contract). */
const BOOKS = /\b(100M Offers|\$100M|Competing Against Luck|Positioning|Designing Brand Identity|This Is Marketing|Influence[_:]? The Psychology|Multipliers|Five Dysfunctions)\b/i;

const readJsonl = f => existsSync(f) ? readFileSync(f, "utf8").split(/\r?\n/).filter(l => l.trim()).flatMap((l, i) => { try { return [JSON.parse(l)]; } catch { console.warn(`skip bad line ${i + 1} in ${f}`); return []; } }) : [];
const batches = readdirSync(from, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => path.join(from, d.name)).sort();
/** Batches wrote paths with either slash. */
const nf = f => String(f ?? "").replace(/\\/g, "/");
const rawSources = batches.flatMap(b => readJsonl(path.join(b, "sources.jsonl"))).map(s => ({ ...s, file: nf(s.file) }));
const rawCards = batches.flatMap(b => readJsonl(path.join(b, "cards.jsonl"))).map(c => ({ ...c, file: nf(c.file) }));
const metaFile = arg("meta");
const meta = new Map((metaFile ? readJsonl(metaFile) : []).filter(m => ["high", "medium"].includes(m.confidence)).map(m => [nf(m.file), m]));
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const restored = new Set();

const arr = v => Array.isArray(v) ? v.map(String).map(s => s.trim()).filter(Boolean) : typeof v === "string" && v.trim() ? [v.trim()] : [];
const str = v => typeof v === "string" ? v.trim() : "";
const mod = c => { const u = String(c).toUpperCase().replace(/^\d+-/, "").slice(0, 3); return u in aliases ? aliases[u] : u; };

// ---------- Sources ----------
const oldSources = existsSync(path.join(DIR, "sources.json")) ? JSON.parse(readFileSync(path.join(DIR, "sources.json"), "utf8")) : [];
const idByFile = new Map(oldSources.map(s => [s.file, s.id]));
let nextSource = Math.max(0, ...oldSources.map(s => Number(s.id.slice(1)))) + 1;
const byFile = new Map();
for (const s of rawSources) if (s.file && !byFile.has(s.file)) byFile.set(s.file, s);
for (const c of rawCards) if (c.file && !byFile.has(c.file)) byFile.set(c.file, { file: c.file });
const sources = [...byFile.values()].sort((a, b) => a.file < b.file ? -1 : 1).map(s => {
  const title = str(s.title) || path.basename(s.file, ".txt");
  let rights = RIGHTS.includes(s.rights) ? s.rights : "study_only";
  if (BOOKS.test(title) || BOOKS.test(s.file)) rights = "licensed";
  const m = meta.get(s.file);
  const date = DATE.test(str(s.date)) ? s.date : m && DATE.test(str(m.date)) ? m.date : "unknown";
  let tier = [1, 2, 3, 4].includes(s.tier) ? s.tier : 4;
  // Tier 4 only for want of a date: with the date found, a named practitioner is tier 3 again.
  const author = str(s.author) && str(s.author) !== "unknown" ? str(s.author) : str(m?.author) || "unknown";
  if (tier === 4 && date !== "unknown" && author !== "unknown" && /\bdate|undated|no.date|tier 4/i.test(str(s.notes))) { tier = 3; restored.add(s.file); }
  const id = idByFile.get(s.file) ?? `S${String(nextSource++).padStart(4, "0")}`;
  const url = /^https?:\/\//.test(str(s.url)) ? s.url : m && /^https?:\/\//.test(str(m.url)) ? m.url : str(s.url) === "offline" || m?.url === "offline" ? "offline" : "unknown";
  return { id, file: s.file, title: m?.title && /^[^_]*$/.test(title) === false ? str(m.title) : title, author, url, date, rights, tier: date === "unknown" ? 4 : tier, modules: arr(s.modules).map(mod).filter(m => m && codes.has(m)), why: str(s.why), cards: 0, public: PUBLIC_RIGHTS.has(rights) };
});
const sourceByFile = new Map(sources.map(s => [s.file, s]));

// ---------- Cards ----------
const oldCards = new Map();
if (existsSync(path.join(DIR, "cards"))) for (const f of readdirSync(path.join(DIR, "cards")).filter(f => f.endsWith(".json"))) for (const c of JSON.parse(readFileSync(path.join(DIR, "cards", f), "utf8"))) oldCards.set(`${c.source}|${c.claim}`, c.id);
const cards = rawCards.map(c => {
  const source = sourceByFile.get(c.file);
  let modules = [...new Set(arr(c.modules).map(mod).filter(m => m && codes.has(m)))];
  if (!modules.length) modules = source?.modules.slice(0, 1) ?? [];
  // A card is never better than its source: a source with no date is tier 4 (ingestion spec).
  const own = [1, 2, 3, 4].includes(c.tier) ? c.tier : 4;
  const tier = Math.max(restored.has(c.file) && own === 4 && c.strength !== "anecdote" ? 3 : own, source?.tier ?? 4);
  return {
    id: "", modules: modules.slice(0, 4), topics: arr(c.topics), claim: str(c.claim).replace(/\s+/g, " "), body: str(c.body),
    conditions: str(c.conditions), fails_when: str(c.fails_when), scope: c.scope === "baseline" ? "baseline" : "growth", tier,
    numbers: arr(c.numbers), asks: arr(c.asks), platforms: arr(c.platforms), platform: arr(c.platform), jurisdiction: arr(c.jurisdiction).map(s => s.toUpperCase() === "GLOBAL" ? "global" : s.toUpperCase()),
    marketplace: arr(c.marketplace).map(s => s.toUpperCase() === "GLOBAL" ? "global" : s.toUpperCase()), mode: str(c.mode),
    source: source?.id ?? "", evidence: { where: str(c.evidence?.where), ...(str(c.evidence?.quote) ? { quote: str(c.evidence.quote) } : {}) },
    strength: str(c.strength), public: !!source?.public,
  };
}).map(c => ({ ...c, body: c.body.replace(/—/g, ", "), claim: c.claim.replace(/—/g, ", ") }));

// Near-duplicates inside a primary module: keep the better one.
const better = (a, b) => a.tier !== b.tier ? a.tier < b.tier : a.numbers.length !== b.numbers.length ? a.numbers.length > b.numbers.length : a.asks.length >= b.asks.length;
const kept = [], dropped = [];
for (const c of cards) {
  const twin = kept.findIndex(k => k.modules[0] === c.modules[0] && cardSimilarity(k, c) >= 0.6);
  if (twin < 0) kept.push(c);
  else if (better(c, kept[twin])) { dropped.push(kept[twin]); kept[twin] = c; }
  else dropped.push(c);
}

// Ids: kept from a previous import of the same source and claim; new ones numbered per module.
const next = {};
for (const id of oldCards.values()) { const [m, n] = id.split("-"); next[m] = Math.max(next[m] ?? 0, Number(n)); }
kept.sort((a, b) => a.modules[0] < b.modules[0] ? -1 : a.modules[0] > b.modules[0] ? 1 : a.source < b.source ? -1 : a.source > b.source ? 1 : a.claim < b.claim ? -1 : 1);
for (const c of kept) c.id = oldCards.get(`${c.source}|${c.claim}`) ?? `${c.modules[0]}-${String(next[c.modules[0]] = (next[c.modules[0]] ?? 0) + 1).padStart(4, "0")}`;

const sourceMap = new Map(sources.map(s => [s.id, s]));
const held = [], good = [];
for (const c of kept) { const p = cardProblems(c, vertical, sourceMap); (p.length ? held : good).push(p.length ? { card: c, problems: p } : c); }
for (const s of sources) s.cards = good.filter(c => c.source === s.id).length;

// ---------- Write ----------
const byModule = {};
for (const c of good) (byModule[c.modules[0]] ??= []).push(c);
if (!dry) {
  mkdirSync(path.join(DIR, "cards"), { recursive: true });
  writeFileSync(path.join(DIR, "sources.json"), `${JSON.stringify(sources, null, 2)}\n`);
  for (const m of vertical.modules) {
    const f = path.join(DIR, "cards", `${m.code}.json`);
    if (byModule[m.code]?.length) writeFileSync(f, `${JSON.stringify(byModule[m.code].sort((a, b) => a.id < b.id ? -1 : 1), null, 2)}\n`);
  }
  writeFileSync(path.join(DIR, "_held.json"), `${JSON.stringify(held, null, 2)}\n`);
}
const publicCards = good.filter(c => c.public).length;
console.log(`import-cards: ${rawSources.length} source lines, ${sources.length} sources (${sources.filter(s => s.public).length} public), ${rawCards.length} cards read, ${dropped.length} near-duplicates dropped, ${held.length} held, ${good.length} kept (${publicCards} public, ${good.length - publicCards} private)`);
console.log(`  by module: ${Object.entries(byModule).map(([m, cs]) => `${m} ${cs.length}`).join(", ")}`);
const reasons = {};
for (const h of held) for (const p of h.problems) { const k = p.replace(/\d+/g, "#"); reasons[k] = (reasons[k] ?? 0) + 1; }
for (const [k, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) console.log(`  held: ${n} x ${k}`);
console.log(`  no asks: ${good.filter(c => !c.asks.length).length}; zero-card sources: ${sources.filter(s => !s.cards).length}; metadata merged for ${sources.filter(s => meta.has(s.file)).length} sources, ${restored.size} back to tier 3; tiers: ${[1, 2, 3, 4].map(t => `${t}:${good.filter(c => c.tier === t).length}`).join(" ")}`);
