// Spaces: each person's own place for skills, prompts, workflows, kits and agents, shared with a private link.
// One handler serves the live site (a Cloudflare Pages Function with a D1 database, functions/api/spaces/[[path]].ts)
// and the dev server (an in-memory store, vite.config.ts), so the tests run the code that runs live.
//
// There are no accounts yet. Making a space gives back two secrets:
//   - the owner key: it opens the space to change it. The browser keeps it; only its hash is stored.
//   - the share link token: anyone with the link can read the space, nothing more. The owner can replace it,
//     and the old link stops working.
// An item can also be made public: it then shows on the "From people" page, marked as not checked by us.
//
//   POST   /api/spaces                         {name}              make a space -> {space, ownerKey, shareToken}
//   GET    /api/spaces/me                      (owner key)         the space and every item in it
//   PATCH  /api/spaces/me                      {name}              rename it
//   POST   /api/spaces/me/link                 (owner key)         a new share link; the old one stops working
//   POST   /api/spaces/me/items                {kind, title, ...}  add an item
//   PATCH  /api/spaces/me/items/<id>           {...}               change an item
//   DELETE /api/spaces/me/items/<id>                               delete an item
//   GET    /api/spaces/shared/<token>                              read a shared space
//   GET    /api/spaces/public                                      public items, newest first (no bodies)
//   GET    /api/spaces/public/<id>                                 one public item
//   DELETE /api/spaces/public/<id>             (team token)        take a public item down

export const KINDS = ["skill", "prompt", "workflow", "kit", "agent"] as const;
export type Kind = (typeof KINDS)[number];
export type Visibility = "private" | "public";
export type Space = { id: string; name: string; created: string; updated: string };
export type SpaceRow = Space & { ownerHash: string; shareToken: string; ipHash: string };
export type Item = { id: string; spaceId: string; kind: Kind; title: string; summary: string; body: string; data: unknown; visibility: Visibility; created: string; updated: string };
export type ItemRow = Item & { hidden: boolean };
/** What the public list shows: no body, and the space only by name. */
export type PublicItem = Omit<Item, "body" | "spaceId" | "data"> & { space: string };

export interface SpaceStore {
  addSpace(row: SpaceRow): Promise<void>;
  spaceByOwner(ownerHash: string): Promise<SpaceRow | null>;
  spaceByShare(token: string): Promise<SpaceRow | null>;
  updateSpace(id: string, patch: Partial<Pick<SpaceRow, "name" | "shareToken" | "updated">>): Promise<void>;
  spacesSince(ipHash: string, since: string): Promise<number>;
  items(spaceId: string): Promise<ItemRow[]>;
  item(id: string): Promise<ItemRow | null>;
  addItem(row: ItemRow): Promise<void>;
  updateItem(id: string, patch: Partial<ItemRow>): Promise<void>;
  deleteItem(id: string): Promise<void>;
  publicItems(limit: number): Promise<(ItemRow & { spaceName: string })[]>;
}

export type Options = { ip: string; salt?: string; teamToken?: string; now?: () => Date; limit?: boolean };
export const LIMITS = { name: 60, title: 80, summary: 240, body: 100_000, data: 60_000, items: 300, spacesPerDay: 10 };

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const oops = (status: number, error: string) => json(status, { error });

async function sha(text: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
/** A secret nobody can guess: 24 random bytes, written with letters, digits, - and _. */
function secret() {
  const b = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const clean = (s: unknown, max: number) => String(s ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, max);
const ownerKeyOf = (req: Request) => (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
const pub = ({ hidden: _h, ...i }: ItemRow): Item => i;
const spaceOut = ({ id, name, created, updated }: SpaceRow): Space => ({ id, name, created, updated });

/** Checks an item's fields; returns the cleaned fields or an error message. */
function readItem(input: Record<string, unknown>, partial: boolean): { ok: Partial<Item> } | { error: string } {
  const out: Partial<Item> = {};
  if (!partial || input.kind !== undefined) {
    if (!KINDS.includes(input.kind as Kind)) return { error: `Say what it is: ${KINDS.join(", ")}.` };
    out.kind = input.kind as Kind;
  }
  if (!partial || input.title !== undefined) {
    out.title = clean(input.title, LIMITS.title);
    if (!out.title) return { error: "Give it a name." };
  }
  if (!partial || input.summary !== undefined) out.summary = clean(input.summary, LIMITS.summary);
  if (!partial || input.body !== undefined) {
    const body = String(input.body ?? "").replace(/\r\n?/g, "\n");
    if (body.length > LIMITS.body) return { error: "That file is too long. Keep it under 100,000 characters." };
    out.body = body;
  }
  if (!partial || input.data !== undefined) {
    const data = input.data ?? null;
    if (JSON.stringify(data).length > LIMITS.data) return { error: "That workflow or kit is too big to save." };
    out.data = data;
  }
  if (!partial || input.visibility !== undefined) {
    if (input.visibility !== undefined && input.visibility !== "private" && input.visibility !== "public") return { error: "Choose private or public." };
    out.visibility = (input.visibility as Visibility) ?? "private";
  }
  return { ok: out };
}

export async function handleSpaces(req: Request, store: SpaceStore | null, o: Options): Promise<Response> {
  if (!store) return oops(503, "Spaces aren't switched on for this site yet.");
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/api\/spaces\/?/, "").split("/").filter(Boolean);
  const now = (o.now ?? (() => new Date()))().toISOString();
  const body = async () => { try { return (await req.json()) as Record<string, unknown>; } catch { return null; } };

  // Make a space.
  if (parts.length === 0) {
    if (req.method !== "POST") return oops(405, "Use POST to make a space.");
    const input = (await body()) ?? {};
    const ipHash = await sha(`${o.salt ?? ""}|${o.ip}`);
    if (o.limit !== false && (await store.spacesSince(ipHash, new Date(Date.parse(now) - 24 * 3600_000).toISOString())) >= LIMITS.spacesPerDay) {
      return oops(429, "You've made a lot of spaces today. Try again tomorrow.");
    }
    const ownerKey = secret();
    const row: SpaceRow = { id: crypto.randomUUID(), name: clean(input.name, LIMITS.name) || "My space", created: now, updated: now, ownerHash: await sha(ownerKey), shareToken: secret(), ipHash };
    await store.addSpace(row);
    return json(201, { space: spaceOut(row), ownerKey, shareToken: row.shareToken });
  }

  // Read a shared space: the link is the permission.
  if (parts[0] === "shared") {
    if (req.method !== "GET") return oops(405, "A shared space can only be read.");
    const space = parts[1] ? await store.spaceByShare(parts[1]) : null;
    if (!space) return oops(404, "This link doesn't open a space. It may have been replaced; ask for the new one.");
    return json(200, { space: { name: space.name, updated: space.updated }, items: (await store.items(space.id)).filter((i) => !i.hidden).map(pub) });
  }

  // Public items, from every space.
  if (parts[0] === "public") {
    if (parts[1] && req.method === "DELETE") {
      if (!o.teamToken || ownerKeyOf(req) !== o.teamToken) return oops(403, "Only the AI Blocks team can take items down.");
      const it = await store.item(parts[1]);
      if (!it) return oops(404, "That item isn't there.");
      await store.updateItem(it.id, { hidden: true });
      return json(200, { ok: true });
    }
    if (req.method !== "GET") return oops(405, "Use GET.");
    if (parts[1]) {
      const it = await store.item(parts[1]);
      if (!it || it.hidden || it.visibility !== "public") return oops(404, "That item isn't public, or it was taken down.");
      return json(200, { item: pub(it) });
    }
    const list = await store.publicItems(100);
    return json(200, { items: list.map(({ body: _b, spaceId: _s, data: _d, hidden: _h, spaceName, ...i }) => ({ ...i, space: spaceName })) });
  }

  // Everything else is the owner's own space.
  if (parts[0] !== "me") return oops(404, "Not a spaces address.");
  const key = ownerKeyOf(req);
  const space = key ? await store.spaceByOwner(await sha(key)) : null;
  if (!space) return oops(401, "That space key doesn't open a space.");

  if (parts.length === 1) {
    if (req.method === "GET") return json(200, { space: spaceOut(space), shareToken: space.shareToken, items: (await store.items(space.id)).map(pub) });
    if (req.method === "PATCH") {
      const input = (await body()) ?? {};
      const name = clean(input.name, LIMITS.name);
      if (!name) return oops(400, "Give your space a name.");
      await store.updateSpace(space.id, { name, updated: now });
      return json(200, { space: { ...spaceOut(space), name, updated: now } });
    }
    return oops(405, "Use GET or PATCH.");
  }

  if (parts[1] === "link" && req.method === "POST") {
    const shareToken = secret();
    await store.updateSpace(space.id, { shareToken, updated: now });
    return json(200, { shareToken });
  }

  if (parts[1] !== "items") return oops(404, "Not a spaces address.");
  if (parts.length === 2) {
    if (req.method !== "POST") return oops(405, "Use POST to add an item.");
    const input = await body();
    if (!input) return oops(400, "Send the item as JSON.");
    const read = readItem(input, false);
    if ("error" in read) return oops(400, read.error);
    if ((await store.items(space.id)).length >= LIMITS.items) return oops(400, `A space holds up to ${LIMITS.items} items.`);
    const row = { ...(read.ok as Item), id: crypto.randomUUID(), spaceId: space.id, created: now, updated: now, hidden: false };
    await store.addItem(row);
    await store.updateSpace(space.id, { updated: now });
    return json(201, { item: pub(row) });
  }
  const it = await store.item(parts[2]);
  if (!it || it.spaceId !== space.id) return oops(404, "That item isn't in your space.");
  if (req.method === "DELETE") {
    await store.deleteItem(it.id);
    await store.updateSpace(space.id, { updated: now });
    return json(200, { ok: true });
  }
  if (req.method === "PATCH") {
    const input = await body();
    if (!input) return oops(400, "Send the changes as JSON.");
    const read = readItem(input, true);
    if ("error" in read) return oops(400, read.error);
    const patch = { ...read.ok, updated: now };
    await store.updateItem(it.id, patch);
    await store.updateSpace(space.id, { updated: now });
    return json(200, { item: pub({ ...it, ...patch }) });
  }
  return oops(405, "Use PATCH or DELETE.");
}

/** Keeps spaces in memory: the dev server and tests. They're gone when it stops. */
export function memorySpaces(): SpaceStore {
  const spaces: SpaceRow[] = [];
  const items: ItemRow[] = [];
  return {
    async addSpace(row) { spaces.push({ ...row }); },
    async spaceByOwner(h) { return spaces.find((s) => s.ownerHash === h) ?? null; },
    async spaceByShare(t) { return spaces.find((s) => s.shareToken === t) ?? null; },
    async updateSpace(id, patch) { const s = spaces.find((x) => x.id === id); if (s) Object.assign(s, patch); },
    async spacesSince(ipHash, since) { return spaces.filter((s) => s.ipHash === ipHash && s.created >= since).length; },
    async items(spaceId) { return items.filter((i) => i.spaceId === spaceId).sort((a, b) => b.updated.localeCompare(a.updated)).map((i) => ({ ...i })); },
    async item(id) { const i = items.find((x) => x.id === id); return i ? { ...i } : null; },
    async addItem(row) { items.push({ ...row }); },
    async updateItem(id, patch) { const i = items.find((x) => x.id === id); if (i) Object.assign(i, patch); },
    async deleteItem(id) { const n = items.findIndex((x) => x.id === id); if (n >= 0) items.splice(n, 1); },
    async publicItems(limit) {
      return items.filter((i) => i.visibility === "public" && !i.hidden).sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, limit)
        .map((i) => ({ ...i, spaceName: spaces.find((s) => s.id === i.spaceId)?.name ?? "" }));
    },
  };
}

/** The parts of Cloudflare's D1 database the store uses. */
type D1 = { prepare(sql: string): { bind(...v: unknown[]): { all<T>(): Promise<{ results: T[] }>; first<T>(): Promise<T | null>; run(): Promise<unknown> } } };
type DbSpace = { id: string; name: string; owner_hash: string; share_token: string; ip_hash: string; created: string; updated: string };
type DbItem = { id: string; space_id: string; kind: Kind; title: string; summary: string; body: string; data: string | null; visibility: Visibility; hidden: number; created: string; updated: string; space_name?: string };
const fromSpace = (r: DbSpace): SpaceRow => ({ id: r.id, name: r.name, ownerHash: r.owner_hash, shareToken: r.share_token, ipHash: r.ip_hash, created: r.created, updated: r.updated });
const fromItem = (r: DbItem): ItemRow => ({ id: r.id, spaceId: r.space_id, kind: r.kind, title: r.title, summary: r.summary, body: r.body, data: r.data ? JSON.parse(r.data) : null, visibility: r.visibility, hidden: !!r.hidden, created: r.created, updated: r.updated });
const SPACE_COLS: Record<string, string> = { name: "name", shareToken: "share_token", updated: "updated" };
const ITEM_COLS: Record<string, string> = { kind: "kind", title: "title", summary: "summary", body: "body", data: "data", visibility: "visibility", hidden: "hidden", updated: "updated" };
const dbValue = (k: string, v: unknown) => (k === "data" ? JSON.stringify(v ?? null) : k === "hidden" ? (v ? 1 : 0) : v);

/** Keeps spaces in a D1 database (tables made by migrations/0002_spaces.sql). */
export function d1Spaces(db: D1): SpaceStore {
  const set = (cols: Record<string, string>, patch: Record<string, unknown>) => {
    const keys = Object.keys(patch).filter((k) => cols[k]);
    return { sql: keys.map((k) => `${cols[k]} = ?`).join(", "), values: keys.map((k) => dbValue(k, patch[k])) };
  };
  return {
    async addSpace(r) {
      await db.prepare("INSERT INTO spaces (id, name, owner_hash, share_token, ip_hash, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(r.id, r.name, r.ownerHash, r.shareToken, r.ipHash, r.created, r.updated).run();
    },
    async spaceByOwner(h) { const r = await db.prepare("SELECT * FROM spaces WHERE owner_hash = ?").bind(h).first<DbSpace>(); return r ? fromSpace(r) : null; },
    async spaceByShare(t) { const r = await db.prepare("SELECT * FROM spaces WHERE share_token = ?").bind(t).first<DbSpace>(); return r ? fromSpace(r) : null; },
    async updateSpace(id, patch) {
      const { sql, values } = set(SPACE_COLS, patch);
      if (sql) await db.prepare(`UPDATE spaces SET ${sql} WHERE id = ?`).bind(...values, id).run();
    },
    async spacesSince(ipHash, since) { return (await db.prepare("SELECT COUNT(*) AS n FROM spaces WHERE ip_hash = ? AND created >= ?").bind(ipHash, since).first<{ n: number }>())?.n ?? 0; },
    async items(spaceId) { return (await db.prepare("SELECT * FROM space_items WHERE space_id = ? ORDER BY updated DESC").bind(spaceId).all<DbItem>()).results.map(fromItem); },
    async item(id) { const r = await db.prepare("SELECT * FROM space_items WHERE id = ?").bind(id).first<DbItem>(); return r ? fromItem(r) : null; },
    async addItem(i) {
      await db.prepare("INSERT INTO space_items (id, space_id, kind, title, summary, body, data, visibility, hidden, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)")
        .bind(i.id, i.spaceId, i.kind, i.title, i.summary, i.body, JSON.stringify(i.data ?? null), i.visibility, i.created, i.updated).run();
    },
    async updateItem(id, patch) {
      const { sql, values } = set(ITEM_COLS, patch as Record<string, unknown>);
      if (sql) await db.prepare(`UPDATE space_items SET ${sql} WHERE id = ?`).bind(...values, id).run();
    },
    async deleteItem(id) { await db.prepare("DELETE FROM space_items WHERE id = ?").bind(id).run(); },
    async publicItems(limit) {
      const q = "SELECT space_items.*, spaces.name AS space_name FROM space_items JOIN spaces ON spaces.id = space_items.space_id WHERE visibility = 'public' AND hidden = 0 ORDER BY space_items.updated DESC LIMIT ?";
      return (await db.prepare(q).bind(limit).all<DbItem>()).results.map((r) => ({ ...fromItem(r), spaceName: r.space_name ?? "" }));
    },
  };
}
