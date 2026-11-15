// Serves a vertical's knowledge library in the Worker: the built index (/packs/knowledge/<vertical>/index.json, made
// by scripts/build-packs.mjs from knowledge/<vertical>/) is read once per Worker and version, and searched with
// CardIndex. Used by the MCP tool ask_vertical_knowledge and by GET /api/knowledge/<vertical>/ask, which the
// /e-commerce page uses. No model, no network beyond the static asset.
import type { Env } from "../../env.ts";
import { CardIndex, type Card, type CardAnswer, type CardQuery, type Source, type Vertical } from "./cards.ts";
import { SHELF_KINDS, SHELF_SCHEMA, ShelfSearch, type ShelfFile, type ShelfItem, type ShelfKind } from "./shelf.ts";

export const VERTICAL_ID = /^[a-z][a-z0-9-]{1,39}$/;
export const JURISDICTIONS = ["IN", "US", "UK", "EU"] as const;

interface IndexFile { schema: string; vertical: Vertical; counts: Record<string, number>; sources: Source[]; cards: Card[] }
const cache = new Map<string, Promise<{ file: IndexFile; index: CardIndex } | null>>();

/** The vertical's index, or null when it is not built (or not a vertical). Failures are not cached. */
export function verticalIndex(env: Env, id: string): Promise<{ file: IndexFile; index: CardIndex } | null> {
  if (!VERTICAL_ID.test(id)) return Promise.resolve(null);
  const hit = cache.get(id);
  if (hit) return hit;
  const load = (async () => {
    if (!env.ASSETS) return null;
    const res = await env.ASSETS.fetch(new Request(new URL(`/packs/knowledge/${id}/index.json`, env.APP_ORIGIN)));
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
    const file = await res.json() as IndexFile;
    if (file?.schema !== "ai-blocks-vertical-index/1" || !Array.isArray(file.cards)) return null;
    return { file, index: new CardIndex(file.vertical, file.cards, file.sources) };
  })();
  load.then(v => { if (!v) cache.delete(id); }, () => cache.delete(id));
  cache.set(id, load);
  return load;
}

/** Tests only. */
export function forgetVerticals(): void { cache.clear(); shelves.clear(); }

// ---------- Shelves: the prompts, skills, tools and minds (shelf.ts) ----------

export interface LoadedShelf { file: ShelfFile; search: Record<ShelfKind, ShelfSearch> }
const shelves = new Map<string, Promise<LoadedShelf | null>>();

/** The vertical's shelves (/packs/knowledge/<vertical>/shelf.json), or null when they are not built. */
export function verticalShelf(env: Env, id: string): Promise<LoadedShelf | null> {
  if (!VERTICAL_ID.test(id)) return Promise.resolve(null);
  const hit = shelves.get(id);
  if (hit) return hit;
  const load = (async () => {
    if (!env.ASSETS) return null;
    const res = await env.ASSETS.fetch(new Request(new URL(`/packs/knowledge/${id}/shelf.json`, env.APP_ORIGIN)));
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
    const file = await res.json() as ShelfFile;
    if (file?.schema !== SHELF_SCHEMA) return null;
    const search = Object.fromEntries(SHELF_KINDS.map(k => [k, new ShelfSearch(k, (file[k] ?? []) as ShelfItem[])])) as Record<ShelfKind, ShelfSearch>;
    return { file, search };
  })();
  load.then(v => { if (!v) shelves.delete(id); }, () => shelves.delete(id));
  shelves.set(id, load);
  return load;
}

/** One item's full text from its built file, or null. */
export async function shelfText(env: Env, path: string): Promise<string | null> {
  // Skill files are SKILL.md, so the file part allows capitals. No ".." anywhere: the path stays inside the library.
  if (!env.ASSETS || path.includes("..") || !/^\/packs\/knowledge\/[a-z0-9-]+\/[A-Za-z0-9/._-]+\.(md|txt)$/.test(path)) return null;
  const res = await env.ASSETS.fetch(new Request(new URL(path, env.APP_ORIGIN)));
  return res.ok ? res.text() : null;
}

/** Reads the query options from loose input (URL parameters or tool arguments), dropping anything not allowed. */
export function cardQuery(v: Vertical, raw: Record<string, unknown>): CardQuery {
  const codes = new Set(v.modules.map(m => m.code));
  const list = (x: unknown) => (Array.isArray(x) ? x : typeof x === "string" ? x.split(",") : []).map(s => String(s).trim().toUpperCase()).filter(s => codes.has(s)).slice(0, 23);
  const one = (x: unknown, allowed: readonly string[]) => { const s = typeof x === "string" ? x.trim() : ""; return allowed.includes(s) ? s : undefined; };
  const k = Number(raw.k);
  return {
    modules: list(raw.modules ?? raw.module),
    jurisdiction: one(typeof raw.jurisdiction === "string" ? raw.jurisdiction.toUpperCase() : raw.jurisdiction, JURISDICTIONS),
    marketplace: one(typeof raw.marketplace === "string" ? raw.marketplace.toUpperCase() : raw.marketplace, JURISDICTIONS),
    mode: one(raw.mode, ["dtc_first", "amazon_first", "new_product", "expansion"]),
    platform: one(raw.platform, ["shopify", "woocommerce"]),
    scope: one(raw.scope, ["baseline", "growth"]) as CardQuery["scope"],
    k: Number.isInteger(k) && k >= 1 && k <= 10 ? k : 6,
  };
}

/** A card answer for JSON: the cards with their sources, nothing private. */
export function answerJson(a: CardAnswer) {
  return {
    question: a.question, enough: a.enough, coverage: a.coverage, missing: a.missing,
    cards: a.hits.map(h => ({
      id: h.card.id, modules: h.card.modules, claim: h.card.claim, body: h.card.body, conditions: h.card.conditions, fails_when: h.card.fails_when,
      scope: h.card.scope, tier: h.card.tier, numbers: h.card.numbers, jurisdiction: h.card.jurisdiction, marketplace: h.card.marketplace, mode: h.card.mode,
      stale: h.stale, score: h.score,
      source: h.source ? { id: h.source.id, title: h.source.title, author: h.source.author, url: /^https?:/.test(h.source.url) ? h.source.url : null, date: h.source.date, tier: h.source.tier } : null,
    })),
  };
}
