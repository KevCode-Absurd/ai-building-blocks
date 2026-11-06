// A D1Database stand-in on Node's built-in SQLite, so tests run the real SQL (migrations, triggers, JSON checks).
// Mirrors the parts of D1 the app uses: prepare/bind/first/all/run/raw, batch (one transaction) and exec.
import { DatabaseSync } from "node:sqlite";

type Param = string | number | bigint | null | Uint8Array;

function toParam(v: unknown): Param {
  if (v === undefined) throw new Error("D1_TYPE_ERROR: undefined is not a supported bind value");
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "bigint" || v instanceof Uint8Array) return v;
  throw new Error(`D1_TYPE_ERROR: unsupported bind value ${typeof v}`);
}

class Statement {
  db: DatabaseSync; sql: string; params: Param[];
  constructor(db: DatabaseSync, sql: string, params: Param[] = []) { this.db = db; this.sql = sql; this.params = params; }
  bind(...values: unknown[]) { return new Statement(this.db, this.sql, values.map(toParam)); }
  private stmt() { return this.db.prepare(this.sql); }
  async first<T>(column?: string): Promise<T | null> {
    const row = this.stmt().get(...this.params) as Record<string, unknown> | undefined;
    if (!row) return null;
    return (column ? row[column] : { ...row }) as T;
  }
  async all<T>() { return this.allSync<T>(); }
  allSync<T>() {
    const s = this.stmt();
    const isRead = /^\s*(select|with|pragma)/i.test(this.sql) || /\breturning\b/i.test(this.sql);
    if (isRead) {
      const rows = s.all(...this.params).map(r => ({ ...(r as object) })) as T[];
      return { results: rows, success: true, meta: { changes: this.changes(), last_row_id: 0, duration: 0 } };
    }
    const info = s.run(...this.params);
    return { results: [] as T[], success: true, meta: { changes: Number(info.changes), last_row_id: Number(info.lastInsertRowid), duration: 0 } };
  }
  private changes() { return Number((this.db.prepare("SELECT changes() AS n").get() as any).n); }
  async run() { return this.allSync(); }
  async raw<T = unknown[]>() { return (this.stmt().all(...this.params) as Record<string, unknown>[]).map(r => Object.values(r)) as T[]; }
}

export class D1Shim {
  db: DatabaseSync;
  constructor() {
    this.db = new DatabaseSync(":memory:");
    this.db.exec("PRAGMA foreign_keys = ON;");
  }
  prepare(sql: string) { return new Statement(this.db, sql); }
  async batch(statements: Statement[]) {
    this.db.exec("BEGIN");
    try {
      const out = statements.map(s => s.allSync());
      this.db.exec("COMMIT");
      return out;
    } catch (err) {
      this.db.exec("ROLLBACK");
      throw err;
    }
  }
  async exec(sql: string) { this.db.exec(sql); return { count: 0, duration: 0 }; }
  async dump(): Promise<ArrayBuffer> { throw new Error("dump is not supported in tests"); }
  withSession() { return this; }
}
