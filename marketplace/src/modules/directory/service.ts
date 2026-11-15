// The agent directory: named agents (personas) buyers browse and hire. Owner: directory module.
// House personas are content in data/personas-*.json, seeded into the personas table; expert personas come from the studio.
import type { Env } from "../../env.ts";
import { AREAS, type Persona, type PersonaProfile } from "../../core/types.ts";
import { all, first, nowIso, parseJson, sha256Hex, stableJson } from "../../core/db.ts";
import { eventStatement } from "../../core/events.ts";
import { houseDataVersion, housePersonas } from "./index.ts";
import { searchPersonas } from "./search.ts";

export interface PersonaRow {
  id: string; kind: "house" | "expert"; expert_id: string | null; name: string; title: string; tagline: string; area: string;
  profile: string; status: "live" | "hidden"; sort: number; content_hash: string; created_at: string; updated_at: string;
}

export interface SeedResult {
  created: number;
  updated: number;
  /** House personas no longer in the data files, now hidden. */
  hidden?: number;
  unchanged?: number;
  /** Ids skipped because they are malformed, repeated, or already belong to an expert persona. */
  skipped?: string[];
}

const SLUG = /^[a-z][a-z0-9-]{2,59}$/;
/** Statements per D1 batch, well under D1's limits even with 4 KB profiles. */
const BATCH = 80;

export function rowToPersona(row: PersonaRow): Persona {
  const extra = row.kind === "house" ? houseExtras(row.id) : undefined;
  return {
    id: row.id, kind: row.kind, expert_id: row.expert_id, name: row.name, title: row.title, tagline: row.tagline,
    area: row.area as Persona["area"], ...(extra?.role ? { role: extra.role } : {}), ...(extra?.mega ? { mega: extra.mega } : {}), ...(extra?.team ? { team: extra.team } : {}),
    ...(extra?.vertical ? { vertical: extra.vertical, ...(extra.modules ? { modules: extra.modules } : {}) } : {}),
    profile: { ...emptyProfile(row.id), ...parseJson<Partial<PersonaProfile>>(row.profile, {}) },
    status: row.status, sort: row.sort,
  };
}

type HouseExtras = Pick<Persona, "role" | "mega" | "team" | "vertical" | "modules">;
let extrasIndex: { list: Persona[]; byId: Map<string, HouseExtras> } | null = null;

/**
 * A house persona's job role, mega settings and vertical (with its knowledge modules), from the data files. The personas table has no columns for them, so
 * a seeded row gets them here; they follow the data files on every deploy, with no reseed. Expert personas have neither.
 */
export function houseExtras(id: string): HouseExtras | undefined {
  const list = housePersonas();
  if (!extrasIndex || extrasIndex.list !== list) {
    extrasIndex = { list, byId: new Map(list.filter(p => p.role || p.mega || p.team || p.vertical).map(p => [p.id, { role: p.role, mega: p.mega, team: p.team, vertical: p.vertical, modules: p.modules }])) };
  }
  return extrasIndex.byId.get(id);
}

/** A house persona's job role id, from the data files (see houseExtras). */
export function houseRoleId(id: string): string | undefined {
  return houseExtras(id)?.role;
}

function emptyProfile(id: string): PersonaProfile {
  return { bio: "", outcomes: [], capabilities: [], good_at: [], not_for: [], samples: [], accent: "#0A0A0A", portrait: `/agents/${id}.webp`, look: "", method: "", source_roles: [] };
}

/** Covers everything a house persona row stores, so any content edit is written and nothing else is. */
export async function personaHash(p: Persona): Promise<string> {
  return sha256Hex(stableJson({ name: p.name, title: p.title, tagline: p.tagline, area: p.area, profile: p.profile, status: p.status, sort: p.sort }));
}

function seedable(p: Persona): boolean {
  return !!p && typeof p.id === "string" && SLUG.test(p.id) && typeof p.name === "string" && !!p.name
    && typeof p.title === "string" && typeof p.tagline === "string" && (AREAS as readonly string[]).includes(p.area)
    && !!p.profile && typeof p.profile === "object" && (p.status === "live" || p.status === "hidden") && Number.isInteger(p.sort);
}

/** Upsert every house persona from data/personas-*.json (idempotent; only rows whose content changed are written). */
export async function seedPersonas(env: Env, actor: string): Promise<SeedResult> {
  const db = env.DB, now = nowIso();
  const existing = new Map((await all<Pick<PersonaRow, "id" | "kind" | "status" | "content_hash">>(db, "SELECT id, kind, status, content_hash FROM personas")).map(r => [r.id, r]));
  const actorKind = actor === "system" ? "system" : "ops";
  const statements: D1PreparedStatement[] = [];
  const result: Required<SeedResult> = { created: 0, updated: 0, hidden: 0, unchanged: 0, skipped: [] };
  const seen = new Set<string>();

  for (const p of housePersonas()) {
    if (!seedable(p) || seen.has(p.id)) { result.skipped.push(String(p?.id ?? "?")); continue; }
    seen.add(p.id);
    const row = existing.get(p.id);
    if (row && row.kind !== "house") { result.skipped.push(p.id); continue; }
    const hash = await personaHash(p);
    if (!row) {
      statements.push(
        db.prepare("INSERT INTO personas (id, kind, expert_id, name, title, tagline, area, profile, status, sort, content_hash, created_at, updated_at) VALUES (?, 'house', NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .bind(p.id, p.name, p.title, p.tagline, p.area, JSON.stringify(p.profile), p.status, p.sort, hash, now, now),
        eventStatement(db, { actor, actorKind, entity: "persona", entityId: p.id, type: "persona.seeded", data: { hash, status: p.status } }, now),
      );
      result.created++;
    } else if (row.content_hash !== hash || row.status !== p.status) {
      statements.push(
        db.prepare("UPDATE personas SET name = ?, title = ?, tagline = ?, area = ?, profile = ?, status = ?, sort = ?, content_hash = ?, updated_at = ? WHERE id = ? AND kind = 'house'")
          .bind(p.name, p.title, p.tagline, p.area, JSON.stringify(p.profile), p.status, p.sort, hash, now, p.id),
        eventStatement(db, { actor, actorKind, entity: "persona", entityId: p.id, type: "persona.updated", data: { hash, status: p.status, previous_status: row.status } }, now),
      );
      result.updated++;
    } else {
      result.unchanged++;
    }
  }

  // House personas taken out of the data stay in the table (jobs may point at them) but stop showing.
  for (const row of existing.values()) {
    if (row.kind !== "house" || seen.has(row.id) || row.status === "hidden") continue;
    statements.push(
      db.prepare("UPDATE personas SET status = 'hidden', updated_at = ? WHERE id = ? AND kind = 'house'").bind(now, row.id),
      eventStatement(db, { actor, actorKind, entity: "persona", entityId: row.id, type: "persona.hidden", data: { reason: "not_in_data" } }, now),
    );
    result.hidden++;
  }

  for (let i = 0; i < statements.length; i += BATCH) await db.batch(statements.slice(i, i + BATCH));
  if (statements.length) forgetPersonas(env);
  return result;
}

async function hasHouseRows(env: Env): Promise<boolean> {
  return !!(await first(env.DB, "SELECT 1 AS ok FROM personas WHERE kind = 'house' LIMIT 1"));
}

const byOrder = (a: Persona, b: Persona) => a.sort - b.sort || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);

/** A live persona of either kind (or a hidden one with includeHidden). Before the first seed, house personas come from the data files. */
export async function getPersona(env: Env, id: string, opts: { includeHidden?: boolean } = {}): Promise<Persona | null> {
  const live = (await livePersonas(env)).byId.get(id);
  if (live) return live;
  // Not in the roster held in memory: hidden, unknown, or written by another instance in the last minute.
  const row = await first<PersonaRow>(env.DB, "SELECT * FROM personas WHERE id = ?", id);
  if (row) return row.status === "live" || opts.includeHidden ? rowToPersona(row) : null;
  if (await hasHouseRows(env)) return null;
  const p = housePersonas().find(x => x.id === id);
  return p && (p.status === "live" || opts.includeHidden) ? p : null;
}

// Search lives in search.ts: what is searched, how a plain request is read and how matches are ranked.
export { searchPersonas, searchTerms } from "./search.ts";

/** Live personas of both kinds, in display order. area filters exactly; q is a plain request or a few words (search.ts). */
export async function listPersonas(env: Env, filter?: { area?: string; q?: string }): Promise<Persona[]> {
  const area = filter?.area || undefined;
  const { list } = await livePersonas(env);
  return searchPersonas(area ? list.filter(p => p.area === area) : list, filter?.q);
}

// ---------- Every live persona, held in memory for a minute ----------
// Each page and most API answers read the whole roster. Reading 505 agents from D1 on every request overloaded it
// when crawlers fetched pages in parallel ("D1 DB is overloaded", 7 Nov 2026). Each Worker instance now reads the
// roster once a minute; requests that arrive together share that one read, and a failed read keeps the last good
// roster for a few seconds. Writes in this app call forgetPersonas, so this instance sees them at once; other
// instances see them within a minute. Callers must not change the personas they get back.

const LIVE_TTL_MS = 60_000;
const LIVE_RETRY_MS = 5_000;
interface LiveSet { list: Persona[]; byId: Map<string, Persona> }
const liveCache = new WeakMap<object, { at: number; data: number; load: Promise<LiveSet> }>();

async function readLive(env: Env): Promise<LiveSet> {
  const rows = await all<PersonaRow>(env.DB, "SELECT * FROM personas WHERE status = 'live'");
  let list = rows.map(rowToPersona);
  // Before the first seed, house personas come from the data files.
  if (!rows.some(r => r.kind === "house") && !(await hasHouseRows(env))) {
    const taken = new Set(list.map(p => p.id));
    list = list.concat(housePersonas().filter(p => p.status === "live" && !taken.has(p.id)));
  }
  return { list, byId: new Map(list.map(p => [p.id, p])) };
}

function livePersonas(env: Env): Promise<LiveSet> {
  const key = env.DB as unknown as object;
  const hit = liveCache.get(key);
  const now = Date.now();
  if (hit && now - hit.at < LIVE_TTL_MS && hit.data === houseDataVersion()) return hit.load;
  const previous = hit?.load;
  const load: Promise<LiveSet> = readLive(env).catch(async err => {
    const old = previous ? await previous.catch(() => null) : null;
    if (liveCache.get(key)?.load !== load) { if (old) return old; throw err; }
    if (!old) { liveCache.delete(key); throw err; }
    liveCache.set(key, { at: Date.now() - LIVE_TTL_MS + LIVE_RETRY_MS, data: houseDataVersion(), load: Promise.resolve(old) });
    return old;
  });
  liveCache.set(key, { at: now, data: houseDataVersion(), load });
  return load;
}

/** Call after any write to the personas table, so the next read in this instance sees it. */
export function forgetPersonas(env: Env): void {
  liveCache.delete(env.DB as unknown as object);
}
