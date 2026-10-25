import { authenticateUser, type AuthEnv } from "./auth.ts";
import { securityJson } from "./api-security.ts";
import { validateLibrary, type Library, type LibraryData } from "../lib/library-data.ts";
import { databaseErrorCode } from "../lib/save-diagnostics.ts";
import type { SaveFailureReporter } from "./save-diagnostics.ts";
export type LibraryStore = { get(user: string): Promise<Library>; put(user: string, data: LibraryData, revision: number): Promise<boolean> };
type Database = { prepare(sql: string): { bind(...values: unknown[]): { first<T>(): Promise<T | null>; run(): Promise<unknown> } } };
export function d1Library(db: Database): LibraryStore {
  return {
    async get(user) {
      const row = await db.prepare("SELECT contents, revision FROM account_library WHERE user_id = ?").bind(user).first<{ contents: string; revision: number }>();
      return row ? { data: validateLibrary(JSON.parse(row.contents)), revision: row.revision } : { data: {}, revision: 0 };
    },
    async put(user, data, revision) {
      const result = await db.prepare(`INSERT INTO account_library (user_id, revision, contents, updated_at)
        SELECT ?, 1, ?, ? WHERE ? = 0 OR EXISTS (SELECT 1 FROM account_library WHERE user_id = ? AND revision = ?)
        ON CONFLICT(user_id) DO UPDATE SET contents = excluded.contents, revision = account_library.revision + 1, updated_at = excluded.updated_at
        WHERE account_library.revision = ?`).bind(user, JSON.stringify(data), new Date().toISOString(), revision, user, revision, revision).run();
      return (result as { meta?: { changes?: number } }).meta?.changes === 1;
    },
  };
}
export function memoryLibrary(): LibraryStore {
  const rows = new Map<string, Library>();
  return { async get(user) { return structuredClone(rows.get(user) ?? { data: {}, revision: 0 }); }, async put(user, data, revision) {
    if ((rows.get(user)?.revision ?? 0) !== revision) return false;
    rows.set(user, { data: structuredClone(data), revision: revision + 1 }); return true;
  } };
}
export async function handleLibrary(req: Request, env: AuthEnv, store: LibraryStore | null, report: SaveFailureReporter = () => {}) {
  const user = await authenticateUser(req, env, report); if (user instanceof Response) return user;
  const json = (status: number, body: unknown) => securityJson(status, body, { "cache-control": "private, no-store", vary: "Authorization" });
  const denied = (status: number, code: Parameters<SaveFailureReporter>[1], error: string) => { report("validation", code); return json(status, { error }); };
  if (!["GET", "PUT"].includes(req.method)) return denied(405, "method_rejected", "Use GET or PUT.");
  if (!store) return denied(503, "store_missing", "Account saving is temporarily unavailable. Your device copy is retained.");
  if (req.method === "PUT" && (req.headers.get("sec-fetch-site") === "cross-site" || req.headers.has("origin") && req.headers.get("origin") !== new URL(req.url).origin)) return denied(403, "origin_rejected", "Save from this site.");
  try {
    if (req.method === "GET") return json(200, await store.get(user));
    let data: LibraryData, revision: number;
    try {
      if (!req.headers.get("content-type")?.startsWith("application/json")) throw Error();
      const reader = req.body?.getReader(); if (!reader) throw Error();
      let size = 0; const chunks: Uint8Array[] = [];
      for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 4_000_000) { report("validation", "body_too_large"); await reader.cancel(); return json(400, { error: "Saved data is invalid or exceeds the 4 MB account limit. Export a backup before reducing it." }); } chunks.push(value); }
      const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      const body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
      if (!body || Object.keys(body).some(k => !["data", "revision"].includes(k)) || !Number.isSafeInteger(body.revision) || body.revision < 0) throw Error();
      data = validateLibrary(body.data); revision = body.revision;
    } catch { return denied(400, "invalid_data", "Saved data is invalid or exceeds the 4 MB account limit. Export a backup before reducing it."); }
    if (!await store.put(user, data, revision)) { report("write", "revision_conflict"); return json(409, { error: "Another device saved changes. Your copy is retained. Download it before loading the account copy." }); }
    return json(200, { data, revision: revision + 1 });
  } catch (error) { report(req.method === "GET" ? "read" : "write", databaseErrorCode(error)); return json(503, { error: "Could not save to your account. Your device copy is retained; retry when connected." }); }
}
