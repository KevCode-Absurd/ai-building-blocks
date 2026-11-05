// "Did it work?" on each item page: one Yes or No per visitor per item, shown as totals.
// One handler serves the live site (D1, functions/api/votes.ts) and the dev server (in memory, vite.config.ts).
//
//   GET  /api/votes?slug=<slug>                 { yes, no, mine }   mine is true, false or null for this visitor
//   POST /api/votes  {slug, worked}             worked: true or false sets your answer, null takes it back
//
// No account is needed. Visitors are told apart by a salted hash of their address, so changing your answer
// replaces it instead of adding another. The address itself is never stored, and no text is kept.

export type Tally = { yes: number; no: number };
export type Vote = { slug: string; voter: string; worked: boolean; at: string };

export interface VoteStore {
  tally(slug: string): Promise<Tally>;
  mine(slug: string, voter: string): Promise<boolean | null>;
  set(vote: Vote): Promise<void>;
  remove(slug: string, voter: string): Promise<void>;
  /** How many answers this visitor gave or changed since the given time. */
  countSince(voter: string, since: string): Promise<number>;
}

/** limit: false turns off the per-visitor limit (the dev server, where every test votes from one address). */
export type VoteOptions = { ip: string; salt?: string; now?: () => Date; limit?: boolean };

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const VOTE_LIMITS = { perDay: 60 };

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const oops = (status: number, error: string) => json(status, { error });

async function hash(text: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function handleVotes(req: Request, store: VoteStore | null, o: VoteOptions): Promise<Response> {
  if (!store) return oops(503, "Answers aren't switched on for this site yet.");
  const voter = await hash(`${o.salt ?? ""}|${o.ip}`);
  const now = (o.now ?? (() => new Date()))();
  const answer = async (slug: string) => json(200, { ...(await store.tally(slug)), mine: await store.mine(slug, voter) });

  if (req.method === "GET") {
    const slug = new URL(req.url).searchParams.get("slug") ?? "";
    if (!SLUG.test(slug)) return oops(400, "Say which item.");
    return answer(slug);
  }
  if (req.method !== "POST") return oops(405, "Use GET or POST.");
  let input: Record<string, unknown>;
  try { input = await req.json(); } catch { return oops(400, "Send your answer as JSON."); }
  const slug = String(input.slug ?? "");
  if (!SLUG.test(slug)) return oops(400, "Say which item.");
  if (input.worked !== true && input.worked !== false && input.worked !== null) return oops(400, "Answer yes or no.");
  // Bots fill in every field, people never see this one: answer as if it counted and keep nothing.
  if (String(input.website ?? "").trim()) return json(200, { ...(await store.tally(slug)), mine: input.worked });
  if (o.limit !== false && (await store.countSince(voter, new Date(now.getTime() - 24 * 3600_000).toISOString())) >= VOTE_LIMITS.perDay)
    return oops(429, "You've answered a lot today. Try again tomorrow.");
  if (input.worked === null) await store.remove(slug, voter);
  else await store.set({ slug, voter, worked: input.worked, at: now.toISOString() });
  return answer(slug);
}

/** Keeps answers in memory: the dev server and tests. They're gone when it stops. */
export function memoryVotes(): VoteStore {
  const rows = new Map<string, Vote>();
  const key = (slug: string, voter: string) => `${slug}|${voter}`;
  return {
    async tally(slug) { let yes = 0, no = 0; for (const v of rows.values()) if (v.slug === slug) v.worked ? yes++ : no++; return { yes, no }; },
    async mine(slug, voter) { return rows.get(key(slug, voter))?.worked ?? null; },
    async set(v) { rows.set(key(v.slug, v.voter), v); },
    async remove(slug, voter) { rows.delete(key(slug, voter)); },
    async countSince(voter, since) { return [...rows.values()].filter((v) => v.voter === voter && v.at >= since).length; },
  };
}

/** The parts of Cloudflare's D1 database the store uses. */
type D1 = { prepare(sql: string): { bind(...v: unknown[]): { first<T>(): Promise<T | null>; run(): Promise<unknown> } } };

/** Keeps answers in a D1 database (table made by migrations/0012_item_votes.sql). */
export function d1Votes(db: D1): VoteStore {
  return {
    async tally(slug) {
      const r = await db.prepare("SELECT COALESCE(SUM(worked), 0) AS yes, COUNT(*) - COALESCE(SUM(worked), 0) AS no FROM item_votes WHERE slug = ?").bind(slug).first<Tally>();
      return { yes: Number(r?.yes ?? 0), no: Number(r?.no ?? 0) };
    },
    async mine(slug, voter) {
      const r = await db.prepare("SELECT worked FROM item_votes WHERE slug = ? AND voter = ?").bind(slug, voter).first<{ worked: number }>();
      return r ? !!r.worked : null;
    },
    async set(v) {
      await db.prepare("INSERT INTO item_votes (slug, voter, worked, at) VALUES (?, ?, ?, ?) ON CONFLICT (slug, voter) DO UPDATE SET worked = excluded.worked, at = excluded.at")
        .bind(v.slug, v.voter, v.worked ? 1 : 0, v.at).run();
    },
    async remove(slug, voter) { await db.prepare("DELETE FROM item_votes WHERE slug = ? AND voter = ?").bind(slug, voter).run(); },
    async countSince(voter, since) {
      return Number((await db.prepare("SELECT COUNT(*) AS n FROM item_votes WHERE voter = ? AND at >= ?").bind(voter, since).first<{ n: number }>())?.n ?? 0);
    },
  };
}
