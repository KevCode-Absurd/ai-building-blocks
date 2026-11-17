// Vertical knowledge: expert knowledge cards for one kind of business (e-commerce first; SaaS and info products
// next), stored in marketplace/knowledge/<vertical>/ and served to any agent. Layout and rules: knowledge/README.md.
//
// A card is one claim an operator can act on, in our own words, with the conditions it holds under, when it fails,
// its numbers, the questions people ask when they need it, and the source it came from (tier, date, rights). The
// card rules are Kevin's ecomOS ingestion spec: one claim per card, conditions near the claim, the discard test
// (nothing a good model would say unprompted), tiers 1 to 4, scope by the counter-case test.
//
// Retrieval (CardIndex) is the per-agent engine (packs/retrieve.ts, Stanford CS329Z lecture 3) over one passage per
// card, plus what the metadata knows: hard filters (jurisdiction, marketplace, Amazon mode, store platform, module),
// a tier prior (platform docs beat practitioners beat opinion), a freshness discount past the module's review window,
// and wild bets never above a baseline card.

import { KnowledgeIndex, MIN_COVERAGE, tokens, type Chunk, type Synonyms } from "../packs/retrieve.ts";

export type Scope = "baseline" | "growth";
export type Rights = "owned" | "public_reference" | "licensed" | "study_only";
export type Tier = 1 | 2 | 3 | 4;

export interface ModuleDef { code: string; name: string; review_due_days: number; required?: string[]; gate?: boolean; never_outranks_baseline?: boolean }
export interface Vertical {
  schema: "ai-blocks-vertical/1"; id: string; name: string; summary: string; updated: string;
  constraints?: Record<string, string>; house_rules?: string[]; tiers: Record<string, string>; modules: ModuleDef[]; aliases?: Record<string, string | null>;
}

export interface Source {
  id: string;                 // S0001
  title: string; author: string; url: string; date: string;   // date: YYYY-MM-DD, YYYY-MM-00 or "unknown"
  rights: Rights; tier: Tier; modules: string[]; why: string;
  cards: number;
  /** False for licensed and study-only sources: their cards stay out of everything published. */
  public: boolean;
}

export interface Card {
  id: string;                 // LPG-0007: primary module and a number
  modules: string[];          // primary first
  topics: string[];
  claim: string;
  body: string;
  conditions: string;
  fails_when: string;
  scope: Scope;
  tier: Tier;
  numbers: string[];
  asks: string[];             // how people ask for it, in their own words (doc2query)
  platforms: string[]; platform: string[]; jurisdiction: string[]; marketplace: string[]; mode: string;
  source: string;             // Source.id
  evidence: { where: string; quote?: string };
  strength: string;
  public: boolean;
  /** The situations the card holds in, by facet (scripts/tag-card-situations.mjs); absent: it holds everywhere. */
  situations?: Partial<Record<"stage" | "model" | "traffic" | "price" | "spend" | "size", string[]>>;
}

export const SCOPES: readonly Scope[] = ["baseline", "growth"];
export const RIGHTS: readonly Rights[] = ["owned", "public_reference", "licensed", "study_only"];
export const PUBLIC_RIGHTS: ReadonlySet<Rights> = new Set(["owned", "public_reference"]);

const words = (s: string) => (s.match(/\S+/g) ?? []).length;

/** Problems with one card: empty means it may be published (if its source is public). */
export function cardProblems(card: Card, vertical: Vertical, sources: Map<string, Source>): string[] {
  const out: string[] = [];
  const codes = new Set(vertical.modules.map(m => m.code));
  if (!/^[A-Z]{3}-\d{4}$/.test(card.id)) out.push("id must be like LPG-0007");
  if (!card.modules.length || card.modules.some(m => !codes.has(m))) out.push(`unknown module in ${card.modules.join(",")}`);
  else if (!card.id.startsWith(`${card.modules[0]}-`)) out.push("id must start with the primary module");
  if (card.modules.length > 4) out.push("at most 4 modules");
  if (!card.claim.trim() || words(card.claim) > 40) out.push("claim must be one sentence of at most 40 words");
  if (words(card.body) < 60 || words(card.body) > 400) out.push(`body has ${words(card.body)} words (60 to 400)`);
  if (!SCOPES.includes(card.scope)) out.push("scope must be baseline or growth");
  if (card.scope === "growth" && !card.fails_when.trim()) out.push("a growth card needs fails_when");
  if (![1, 2, 3, 4].includes(card.tier)) out.push("tier must be 1 to 4");
  if (!sources.has(card.source)) out.push(`source ${card.source} is not in sources.json`);
  const q = card.evidence?.quote ?? "";
  if (q && words(q) >= 15) out.push("evidence quote must be under 15 words");
  if (/—/.test(`${card.claim} ${card.body}`)) out.push("no em dashes");
  const primary = vertical.modules.find(m => m.code === card.modules[0]);
  for (const f of primary?.required ?? []) {
    const v = (card as unknown as Record<string, unknown>)[f];
    if (!(Array.isArray(v) ? v.length : typeof v === "string" && v.trim())) out.push(`${card.modules[0]} cards need ${f}`);
  }
  return out;
}

/** One card as markdown: what an agent reads, and the text retrieval matches against. */
export function cardMarkdown(card: Card, source: Source | undefined, level = 3): string {
  const h = "#".repeat(level);
  const facets = [
    card.jurisdiction.length ? `market ${card.jurisdiction.join(", ")}` : "",
    card.marketplace.length ? `Amazon ${card.marketplace.join(", ")}` : "",
    card.mode ? card.mode.replace(/_/g, " ") : "",
    card.platform.length ? card.platform.join(", ") : "",
    card.platforms.length ? card.platforms.join(", ") : "",
  ].filter(Boolean).join("; ");
  const src = source
    ? `${source.title}${source.author && source.author !== "unknown" ? `, ${source.author}` : ""}${source.date && source.date !== "unknown" ? `, ${source.date}` : ""}${/^https?:/.test(source.url) ? ` (${source.url})` : ""}`
    : card.source;
  return [
    `${h} ${card.claim}`,
    "",
    `Card ${card.id}. Tier ${card.tier}, ${card.scope}${facets ? `, ${facets}` : ""}.`,
    "",
    card.body.trim(),
    "",
    ...(card.conditions.trim() ? [`**Holds when:** ${card.conditions.trim()}`, ""] : []),
    ...(card.fails_when.trim() ? [`**Fails when:** ${card.fails_when.trim()}`, ""] : []),
    ...(fitsLine(card) ? [`**Fits:** ${fitsLine(card)}`, ""] : []),
    ...(card.numbers.length ? [`**Numbers:** ${card.numbers.join("; ")}`, ""] : []),
    ...(card.asks.length ? [`**Asked as:** ${card.asks.join(" | ")}`, ""] : []),
    `**Source:** ${src}. ${card.evidence?.where ? `Where: ${card.evidence.where}.` : ""}`.trim(),
  ].join("\n");
}

/** A card's situations as one line ("stage early, scaling; traffic medium, high"), read back by prepare.ts parseFits. */
export function fitsLine(card: Pick<Card, "situations">): string {
  return Object.entries(card.situations ?? {}).filter(([, v]) => Array.isArray(v) && v.length).map(([k, v]) => `${k} ${v!.join(", ")}`).join("; ");
}

/** A module's cards as one markdown file, for agent packs and the served library (knowledge/<vertical>/<CODE>.md). */
export function moduleMarkdown(vertical: Vertical, code: string, cards: Card[], sources: Map<string, Source>): string {
  const mod = vertical.modules.find(m => m.code === code)!;
  const baseline = cards.filter(c => c.scope === "baseline").length;
  return [
    `# ${vertical.name} knowledge: ${mod.name} (${code})`,
    "",
    `${cards.length} expert knowledge cards on ${mod.name.toLowerCase()}, ${baseline} baseline (true for almost every brand) and ${cards.length - baseline} growth (true under the stated conditions). Each card is one claim in our own words, with when it holds, when it fails and its source. Tier 1 is platform documentation, 2 large-sample research, 3 a named practitioner with receipts, 4 opinion. Re-check anything time-sensitive before a buyer sees it.`,
    "",
    ...cards.flatMap(c => [cardMarkdown(c, sources.get(c.source), 2), ""]),
  ].join("\n");
}

export interface CardQuery {
  modules?: string[];
  jurisdiction?: string;      // IN, US, UK, EU
  marketplace?: string;
  mode?: string;              // dtc_first | amazon_first (AMZ), new_product | expansion (PRD)
  platform?: string;          // shopify | woocommerce
  scope?: Scope;
  k?: number;
  today?: string;
}
export interface CardHit { card: Card; source: Source | null; score: number; stale: boolean; matched: string[] }
export interface CardAnswer { question: string; hits: CardHit[]; coverage: number; enough: boolean; missing: string[]; evidence_scope: "reference_knowledge"; business_data_ready: false }

/**
 * Tier prior on the fused rank score: a tie-breaker toward better sources, not an override of relevance. On the
 * 80-question golden set (13 Nov 2026) 1.3/1.15/1/0.8 cut Hit@5 from 0.83 to 0.66; this light prior keeps Hit@5 0.83
 * and MRR 0.69 (no prior: 0.72).
 */
export const TIER_WEIGHT: Record<Tier, number> = { 1: 1.05, 2: 1.02, 3: 1, 4: 0.98 };
/** Score kept by a card past its module's review window. */
export let STALE_WEIGHT = 0.98;
/** Tuning only (scripts/eval-vertical.mjs). */
export function setStaleWeight(w: number): void { STALE_WEIGHT = w; }

const daysBetween = (a: string, b: string) => {
  const x = Date.parse(`${a.slice(0, 7)}-${a.slice(8, 10) === "00" ? "15" : a.slice(8, 10)}T00:00:00Z`), y = Date.parse(`${b}T00:00:00Z`);
  return Number.isFinite(x) && Number.isFinite(y) ? (y - x) / 86_400_000 : 0;
};

export class CardIndex {
  readonly cards: Card[];
  private byPath = new Map<string, Card>();
  private sources: Map<string, Source>;
  private modules: Map<string, ModuleDef>;
  private index: KnowledgeIndex;
  readonly vertical: Vertical;
  /** `synonyms`: the vertical's owner-words layer (knowledge/<vertical>/synonyms.json); none searches as before. */
  constructor(vertical: Vertical, cards: Card[], sources: Source[], synonyms: Synonyms | null = null) {
    this.vertical = vertical;
    this.cards = cards;
    this.sources = new Map(sources.map(s => [s.id, s]));
    this.modules = new Map(vertical.modules.map(m => [m.code, m]));
    const files = cards.map(c => {
      const path = `cards/${c.id}.md`;
      this.byPath.set(path, c);
      // The situations line is a filter, not words to match: it stays out of the searched text.
      return { path, text: cardMarkdown(c, this.sources.get(c.source)).replace(/^\*\*Fits:\*\* .*\n\n/m, "") };
    });
    this.index = new KnowledgeIndex(files, { synonyms });
  }

  stale(card: Card, today?: string): boolean {
    const src = this.sources.get(card.source);
    const days = this.modules.get(card.modules[0])?.review_due_days ?? 0;
    return !!(today && src && /^\d{4}-\d{2}/.test(src.date) && days && daysBetween(src.date, today) > days);
  }

  /** Hard filters: a card for another market, marketplace, Amazon mode or platform never comes back. */
  fits(card: Card, q: CardQuery): boolean {
    const miss = (have: string[], want?: string) => !!want && have.length > 0 && !have.includes(want) && !have.includes("global");
    if (q.modules?.length && !card.modules.some(m => q.modules!.includes(m))) return false;
    if (miss(card.jurisdiction, q.jurisdiction) || miss(card.marketplace, q.marketplace) || miss(card.platform, q.platform)) return false;
    if (q.mode && card.mode && card.mode !== "both" && card.mode !== q.mode && ["dtc_first", "amazon_first"].includes(q.mode) === ["dtc_first", "amazon_first"].includes(card.mode)) return false;
    if (q.scope && card.scope !== q.scope) return false;
    return true;
  }

  ask(questions: string | string[], q: CardQuery = {}): CardAnswer {
    const k = Math.max(1, Math.min(10, q.k ?? 6));
    const answer = this.index.ask(questions, {
      k,
      uniquePath: true,
      adjust: (chunk: Chunk, score: number) => {
        const card = this.byPath.get(chunk.path);
        if (!card || !this.fits(card, q)) return null;
        return score * TIER_WEIGHT[card.tier] * (this.stale(card, q.today) ? STALE_WEIGHT : 1);
      },
    });
    // One hit per card (a long card can be two passages), wild bets after every baseline card.
    const seen = new Set<string>();
    let hits: CardHit[] = [];
    for (const p of answer.passages) {
      const card = this.byPath.get(p.path);
      if (!card || seen.has(card.id)) continue;
      seen.add(card.id);
      hits.push({ card, source: this.sources.get(card.source) ?? null, score: p.score, stale: this.stale(card, q.today), matched: p.matched });
    }
    const wild = (h: CardHit) => this.modules.get(h.card.modules[0])?.never_outranks_baseline === true;
    if (hits.some(h => h.card.scope === "baseline")) hits = [...hits.filter(h => !wild(h)), ...hits.filter(wild)];
    return { question: answer.question, hits, coverage: answer.coverage, enough: answer.enough && hits.length > 0, missing: answer.missing, evidence_scope: "reference_knowledge", business_data_ready: false };
  }

  /** Cards per module, for pages and pack builders. */
  counts(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const c of this.cards) out[c.modules[0]] = (out[c.modules[0]] ?? 0) + 1;
    return out;
  }
}

/** A card answer as plain text for a chat: each card in full, with its source, then what to do when it is weak. */
export function cardAnswerText(a: CardAnswer, verticalName: string): string {
  if (!a.hits.length) return `The ${verticalName} library has no card on this. Say so, then ask the client or research it, and never answer from memory as if it were the library's.`;
  const head = a.enough
    ? `${a.hits.length} card${a.hits.length === 1 ? "" : "s"} from the ${verticalName} library, best first. Use only what they say, check each card's "Holds when" against this business, and name the card id when you use it. These are reference methods, not this business's current facts or account data; enough measures retrieval relevance only.`
    : `Weak match: the best card covers ${Math.round(a.coverage * 100)}% of the question${a.missing.length ? ` (nothing on: ${a.missing.slice(0, 8).join(", ")})` : ""}. Treat it as not in the library: ask the client or research it, and say which.`;
  return [head, ...a.hits.map((h, i) => `--- ${i + 1}. ${h.card.id} (${h.card.modules.join(", ")})${h.stale ? " STALE: past its review window, recheck before use" : ""} ---\n${cardMarkdown(h.card, h.source ?? undefined)}`)].join("\n\n");
}

/** Near-duplicate test for two cards (word-set Jaccard over claim and body). */
export function cardSimilarity(a: Card, b: Card): number {
  const x = new Set(tokens(`${a.claim} ${a.body}`)), y = new Set(tokens(`${b.claim} ${b.body}`));
  let n = 0;
  for (const w of x) if (y.has(w)) n++;
  return n / (x.size + y.size - n || 1);
}
