// Questions and comments on each skill page. Each comment belongs to one skill (its slug) and stays on that page.
// One handler serves both the live site (a Cloudflare Pages Function with a D1 database, functions/api/comments.ts)
// and the dev server (an in-memory store, vite.config.ts), so the tests exercise the same code that runs live.
//
//   GET    /api/comments?slug=<slug>&also=<old-slug>,...   every visible comment, oldest first
//   POST   /api/comments  {slug, name?, body, parent?}     add one; with the team token it's marked as our answer
//   DELETE /api/comments?id=<id>                           hide one (team token only)
//
// Anyone can post without an account, so the handler keeps it civil: plain text only (the page never makes
// links clickable), a length cap, a hidden field bots fill in, and a limit per visitor. Visitors are told apart
// by a salted hash of their address; the address itself is never stored.

export type Comment = { id: string; slug: string; parent: string | null; name: string; body: string; team: boolean; at: string };
export type Row = Comment & { ipHash: string; hidden: boolean };

export interface Store {
  list(slugs: string[]): Promise<Comment[]>;
  get(id: string): Promise<Row | null>;
  add(row: Row): Promise<void>;
  /** How many comments this visitor posted since the given time. */
  countSince(ipHash: string, since: string): Promise<number>;
  hide(id: string): Promise<boolean>;
}

/** limit: false turns off the per-visitor limit (the dev server, where every test posts from one address). */
export type Options = { ip: string; salt?: string; teamToken?: string; now?: () => Date; limit?: boolean };

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const LIMITS = { body: 2000, name: 40, perTenMinutes: 5, perDay: 30 };

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const oops = (status: number, error: string) => json(status, { error });

async function hash(text: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
const clean = (s: unknown, max: number) => String(s ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);
const isTeam = (req: Request, token?: string) => !!token && req.headers.get("authorization") === `Bearer ${token}`;

export async function handleComments(req: Request, store: Store | null, o: Options): Promise<Response> {
  if (!store) return oops(503, "Comments aren't switched on for this site yet.");
  const url = new URL(req.url);
  const now = (o.now ?? (() => new Date()))();

  if (req.method === "GET") {
    const slugs = [url.searchParams.get("slug") ?? "", ...(url.searchParams.get("also") ?? "").split(",")].filter((s) => SLUG.test(s)).slice(0, 20);
    if (!slugs.length) return oops(400, "Say which skill.");
    return json(200, { comments: await store.list(slugs) });
  }

  if (req.method === "DELETE") {
    if (!isTeam(req, o.teamToken)) return oops(403, "Only the AI Blocks team can remove comments.");
    return (await store.hide(url.searchParams.get("id") ?? "")) ? json(200, { ok: true }) : oops(404, "That comment isn't there.");
  }

  if (req.method !== "POST") return oops(405, "Use GET, POST or DELETE.");
  let input: Record<string, unknown>;
  try { input = await req.json(); } catch { return oops(400, "Send the comment as JSON."); }
  const slug = String(input.slug ?? "");
  if (!SLUG.test(slug)) return oops(400, "Say which skill.");
  const body = clean(input.body, LIMITS.body + 1);
  if (body.length < 2) return oops(400, "Write your question or comment first.");
  if (body.length > LIMITS.body) return oops(400, `Keep it under ${LIMITS.body.toLocaleString("en-US")} characters.`);
  const team = isTeam(req, o.teamToken);
  const name = team ? "AI Blocks team" : clean(input.name, LIMITS.name) || "Someone";
  let parent: string | null = null;
  if (input.parent) {
    const p = await store.get(String(input.parent));
    if (!p || p.hidden || p.slug !== slug) return oops(400, "The comment you're replying to isn't there any more.");
    parent = p.parent ?? p.id; // one level of replies: a reply to a reply joins the same thread
  }
  const comment: Comment = { id: crypto.randomUUID(), slug, parent, name, body, team, at: now.toISOString() };
  // Bots fill in every field, people never see this one: look as if it worked and keep nothing.
  if (String(input.website ?? "").trim()) return json(201, { comment });
  const ipHash = await hash(`${o.salt ?? ""}|${o.ip}`);
  if (!team && o.limit !== false) {
    const recent = await store.countSince(ipHash, new Date(now.getTime() - 10 * 60_000).toISOString());
    const today = await store.countSince(ipHash, new Date(now.getTime() - 24 * 3600_000).toISOString());
    if (recent >= LIMITS.perTenMinutes || today >= LIMITS.perDay) return oops(429, "You've posted a lot just now. Try again in a few minutes.");
  }
  await store.add({ ...comment, ipHash, hidden: false });
  return json(201, { comment });
}

/** Keeps comments in memory: the dev server and tests. They're gone when it stops. */
export function memoryStore(): Store {
  const rows: Row[] = [];
  const pub = ({ ipHash: _i, hidden: _h, ...c }: Row): Comment => c;
  return {
    async list(slugs) { return rows.filter((r) => !r.hidden && slugs.includes(r.slug)).map(pub); },
    async get(id) { return rows.find((r) => r.id === id) ?? null; },
    async add(row) { rows.push(row); },
    async countSince(ipHash, since) { return rows.filter((r) => r.ipHash === ipHash && r.at >= since).length; },
    async hide(id) { const r = rows.find((x) => x.id === id && !x.hidden); if (r) r.hidden = true; return !!r; },
  };
}

/** The parts of Cloudflare's D1 database the store uses. */
type D1 = { prepare(sql: string): { bind(...v: unknown[]): { all<T>(): Promise<{ results: T[] }>; first<T>(): Promise<T | null>; run(): Promise<{ meta?: { changes?: number } }> } } };
type DbRow = { id: string; slug: string; parent: string | null; name: string; body: string; team: number; at: string; ip_hash?: string; hidden?: number };
const fromDb = (r: DbRow): Comment => ({ id: r.id, slug: r.slug, parent: r.parent, name: r.name, body: r.body, team: !!r.team, at: r.at });

/** Keeps comments in a D1 database (table made by migrations/0001_comments.sql). */
export function d1Store(db: D1): Store {
  return {
    async list(slugs) {
      const q = `SELECT id, slug, parent, name, body, team, at FROM comments WHERE hidden = 0 AND slug IN (${slugs.map(() => "?").join(",")}) ORDER BY at LIMIT 500`;
      return (await db.prepare(q).bind(...slugs).all<DbRow>()).results.map(fromDb);
    },
    async get(id) {
      const r = await db.prepare("SELECT * FROM comments WHERE id = ?").bind(id).first<DbRow>();
      return r ? { ...fromDb(r), ipHash: r.ip_hash ?? "", hidden: !!r.hidden } : null;
    },
    async add(c) {
      await db.prepare("INSERT INTO comments (id, slug, parent, name, body, team, hidden, ip_hash, at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)")
        .bind(c.id, c.slug, c.parent, c.name, c.body, c.team ? 1 : 0, c.ipHash, c.at).run();
    },
    async countSince(ipHash, since) {
      return (await db.prepare("SELECT COUNT(*) AS n FROM comments WHERE ip_hash = ? AND at >= ?").bind(ipHash, since).first<{ n: number }>())?.n ?? 0;
    },
    async hide(id) {
      return ((await db.prepare("UPDATE comments SET hidden = 1 WHERE id = ? AND hidden = 0").bind(id).run()).meta?.changes ?? 0) > 0;
    },
  };
}
