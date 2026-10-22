import { validateCustomMinds, type CustomMind } from "../lib/custom-minds.ts";
import { authenticateUser, type AuthEnv } from "./auth.ts";
import { securityJson } from "./api-security.ts";

export type MindLibrary = { minds: CustomMind[]; revision: number };
export type MindStore = { get(user: string): Promise<MindLibrary>; put(user: string, minds: CustomMind[], revision: number): Promise<boolean> };
type Database = { prepare(sql: string): { bind(...values: unknown[]): { first<T>(): Promise<T | null>; run(): Promise<unknown> } } };
export function d1Minds(db: Database): MindStore {
  return {
    async get(user) {
      const row = await db.prepare("SELECT profiles, revision FROM account_minds WHERE user_id = ?").bind(user).first<{ profiles: string; revision: number }>();
      return row ? { minds: validateCustomMinds(JSON.parse(row.profiles)), revision: row.revision } : { minds: [], revision: 0 };
    },
    async put(user, minds, revision) {
      // A single atomic statement bounds the whole library and detects edits from another device.
      const result = await db.prepare(`INSERT INTO account_minds (user_id, revision, profiles, updated_at)
        SELECT ?, 1, ?, ? WHERE ? = 0 OR EXISTS (SELECT 1 FROM account_minds WHERE user_id = ? AND revision = ?)
        ON CONFLICT(user_id) DO UPDATE SET profiles = excluded.profiles, revision = account_minds.revision + 1, updated_at = excluded.updated_at
        WHERE account_minds.revision = ?`).bind(user, JSON.stringify(minds), new Date().toISOString(), revision, user, revision, revision).run();
      return (result as { meta?: { changes?: number } }).meta?.changes === 1;
    },
  };
}
export function memoryMinds(): MindStore {
  const rows = new Map<string, MindLibrary>();
  return {
    async get(user) { return structuredClone(rows.get(user) ?? { minds: [], revision: 0 }); },
    async put(user, minds, revision) {
      if ((rows.get(user)?.revision ?? 0) !== revision) return false;
      rows.set(user, { minds: structuredClone(minds), revision: revision + 1 }); return true;
    },
  };
}
async function boundedJson(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw Error("Send JSON.");
  const reader = request.body?.getReader(); if (!reader) throw Error("Missing library.");
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 900000) { await reader.cancel(); throw Error("Library is too large."); } chunks.push(value); }
  const bytes = new Uint8Array(size); let at = 0; for (const chunk of chunks) { bytes.set(chunk, at); at += chunk.length; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
export async function handleAccountMinds(request: Request, env: AuthEnv, store: MindStore | null): Promise<Response> {
  const user = await authenticateUser(request, env); if (user instanceof Response) return user;
  if (!["GET", "PUT"].includes(request.method)) return securityJson(405, { error: "Use GET or PUT." }, { allow: "GET, PUT" });
  if (!store) return securityJson(503, { error: "Your account minds are temporarily unavailable. Your browser-saved minds are unchanged." });
  if (request.method === "PUT" && (request.headers.get("sec-fetch-site") === "cross-site" || request.headers.has("origin") && request.headers.get("origin") !== new URL(request.url).origin)) return securityJson(403, { error: "Open your mind library on this site." });
  const json = (status: number, body: unknown) => securityJson(status, body, { "cache-control": "private, no-store", vary: "Authorization" });
  try {
    if (request.method === "GET") return json(200, await store.get(user));
    let minds: CustomMind[], revision: number;
    try {
      const body = await boundedJson(request);
      if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some(k => !["minds", "revision"].includes(k)) || !Array.isArray(body.minds) || !Number.isSafeInteger(body.revision) || body.revision < 0) throw Error("Invalid library.");
      minds = validateCustomMinds(body.minds); revision = body.revision;
    } catch { return json(400, { error: "Check the mind profiles and library size, then try saving again." }); }
    if (!await store.put(user, minds, revision)) return json(409, { error: "Your minds changed on another device. Refresh the library, review the latest version and save again. Your draft is still here." });
    return json(200, { minds, revision: revision + 1 });
  } catch { return json(503, { error: "Your account minds could not be loaded or saved. Try again; your draft is still here." }); }
}
