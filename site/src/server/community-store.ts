import type { CommunitySubmission } from "../lib/community.ts";
export type CommunityStore = {
  get(id: string): Promise<CommunitySubmission | null>;
  list(scope: "published" | "review" | "mine", user: string, offset: number): Promise<CommunitySubmission[]>;
  save(row: CommunitySubmission, previous: number): Promise<boolean>;
  star(user: string, target: string, starred: boolean): Promise<void>;
  stars(user?: string): Promise<{ target: string; count: number }[]>;
  audit(id: string): Promise<unknown[]>;
};
type Statement = { bind(...values: unknown[]): Statement; first<T>(): Promise<T | null>; all<T>(): Promise<{ results: T[] }>; run(): Promise<{ meta?: { changes?: number } }> };
export type CommunityDatabase = { prepare(sql: string): Statement };
type Row = { id: string; owner: string; revision: number; status: CommunitySubmission["status"]; content: string; scan: string | null; note: string; actor: string; created_at: string; updated_at: string; published_at: string | null };
function decode(r: Row): CommunitySubmission { return { id: r.id, owner: r.owner, revision: r.revision, status: r.status, content: JSON.parse(r.content), scan: r.scan ? JSON.parse(r.scan) : null, note: r.note, actor: r.actor, createdAt: r.created_at, updatedAt: r.updated_at, publishedAt: r.published_at }; }
export function d1Community(db: CommunityDatabase): CommunityStore {
  return {
    async get(id) { const r = await db.prepare("SELECT * FROM community_submissions WHERE id = ?").bind(id).first<Row>(); return r ? decode(r) : null; },
    async list(scope, user, offset) {
      const where = scope === "mine" ? "owner = ?" : scope === "review" ? "status = 'pending'" : "status = 'published'";
      const order = scope === "published" ? "(SELECT count(*) FROM community_stars WHERE target = 'community:' || community_submissions.id) DESC, published_at DESC, id" : "updated_at DESC, id";
      const r = await db.prepare(`SELECT * FROM community_submissions WHERE ${where} ORDER BY ${order} LIMIT 24 OFFSET ?`).bind(...(scope === "mine" ? [user, offset] : [offset])).all<Row>();
      return r.results.map(decode);
    },
    async save(r, previous) {
      const result = previous === 0
        ? await db.prepare(`INSERT INTO community_submissions(id,owner,revision,status,content,scan,note,actor,created_at,updated_at,published_at)
            SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT count(*) FROM community_submissions WHERE owner = ?) < 50
            ON CONFLICT(id) DO NOTHING`).bind(r.id, r.owner, r.revision, r.status, JSON.stringify(r.content), r.scan && JSON.stringify(r.scan), r.note, r.actor, r.createdAt, r.updatedAt, r.publishedAt, r.owner).run()
        : await db.prepare(`UPDATE community_submissions SET revision=?,status=?,content=?,scan=?,note=?,actor=?,updated_at=?,published_at=? WHERE id=? AND owner=? AND revision=?`).bind(r.revision, r.status, JSON.stringify(r.content), r.scan && JSON.stringify(r.scan), r.note, r.actor, r.updatedAt, r.publishedAt, r.id, r.owner, previous).run();
      // D1 counts the audit-trigger insertion too. A failed revision predicate
      // changes zero rows; a successful audited mutation changes two.
      return (result.meta?.changes ?? 0) > 0;
    },
    async star(user, target, starred) {
      if (starred) await db.prepare(`INSERT INTO community_stars(user_id,target,created_at)
        SELECT ?,?,? WHERE (SELECT count(*) FROM community_stars WHERE user_id=?) < 5000
        AND (? NOT LIKE 'community:%' OR EXISTS (SELECT 1 FROM community_submissions WHERE id=substr(?,11) AND status='published'))
        ON CONFLICT(user_id,target) DO NOTHING`).bind(user, target, new Date().toISOString(), user, target, target).run();
      else await db.prepare("DELETE FROM community_stars WHERE user_id=? AND target=?").bind(user, target).run();
    },
    async stars(user) {
      const r = await db.prepare(`SELECT target, count(*) AS count FROM community_stars WHERE
        (target NOT LIKE 'community:%' OR EXISTS (SELECT 1 FROM community_submissions WHERE id=substr(target,11) AND status='published'))
        ${user ? "AND user_id=?" : ""} GROUP BY target ORDER BY count DESC, target LIMIT 10000`).bind(...(user ? [user] : [])).all<{ target: string; count: number }>(); return r.results;
    },
    async audit(id) { return (await db.prepare("SELECT revision,status,actor,note,digest,created_at FROM community_audit WHERE submission_id=? ORDER BY revision").bind(id).all()).results; },
  };
}
export function memoryCommunity(): CommunityStore {
  const rows = new Map<string, CommunitySubmission>(), votes = new Map<string, Set<string>>(), events = new Map<string, unknown[]>();
  return {
    async get(id) { return structuredClone(rows.get(id) ?? null); },
    async list(scope, user, offset) {
      const count = (id: string) => [...votes.values()].filter(s => s.has(`community:${id}`)).length;
      return structuredClone([...rows.values()].filter(r => scope === "mine" ? r.owner === user : r.status === (scope === "review" ? "pending" : "published")).sort((a, b) => (scope === "published" ? count(b.id) - count(a.id) || (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") : b.updatedAt.localeCompare(a.updatedAt)) || a.id.localeCompare(b.id)).slice(offset, offset + 24));
    },
    async save(row, previous) {
      if ((rows.get(row.id)?.revision ?? 0) !== previous || !previous && [...rows.values()].filter(r => r.owner === row.owner).length >= 50) return false;
      rows.set(row.id, structuredClone(row)); events.set(row.id, [...events.get(row.id) ?? [], { revision: row.revision, status: row.status, actor: row.actor, note: row.note, digest: row.scan?.digest, created_at: row.updatedAt }]); return true;
    },
    async star(user, target, starred) { const s = votes.get(user) ?? new Set<string>(); if (starred && s.size < 5000 && (!target.startsWith("community:") || rows.get(target.slice(10))?.status === "published")) s.add(target); else if (!starred) s.delete(target); votes.set(user, s); },
    async stars(user) { const counts = new Map<string, number>(); for (const [u, s] of votes) if (!user || user === u) for (const t of s) if (!t.startsWith("community:") || rows.get(t.slice(10))?.status === "published") counts.set(t, (counts.get(t) ?? 0) + 1); return [...counts].map(([target, count]) => ({ target, count })).sort((a, b) => b.count - a.count || a.target.localeCompare(b.target)); },
    async audit(id) { return structuredClone(events.get(id) ?? []); },
  };
}
