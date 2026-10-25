// A closed schema, shared by browser history and server logs. Never add free text here.
export const SAVE_DIAGNOSTICS_VERSION = "save-diagnostics/1";
export const diagnosticCodes = ["unknown", "TimeoutError", "AbortError", "TypeError", "SyntaxError", "QuotaExceededError", "SecurityError", "Error", "NetworkError", "ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "UND_ERR_CONNECT_TIMEOUT", "http_error", "invalid_response", "invalid_data", "body_too_large", "revision_conflict", "merge_conflict", "session_required", "auth_config_missing", "auth_inactive", "auth_verification_failed", "store_missing", "method_rejected", "origin_rejected", "security_rejected", "rate_limited", "security_unavailable", "security_config_missing", "security_host_rejected", "security_ip_missing", "limiter_missing", "limiter_unavailable", "preview_rejected", "D1_ERROR", "SQLITE_BUSY", "SQLITE_LOCKED", "SQLITE_FULL", "SQLITE_TOOBIG", "SQLITE_CONSTRAINT", "D1_EXEC_ERROR", "D1_TYPE_ERROR", "recovered"] as const;
export type DiagnosticCode = typeof diagnosticCodes[number];
export type DiagnosticStage = "token" | "transport" | "response" | "security" | "auth" | "read" | "write" | "validation" | "storage" | "merge" | "http";
export type SaveDiagnostic = { schema: typeof SAVE_DIAGNOSTICS_VERSION; at: number; event: "failure" | "recovered"; operation: "GET" | "PUT" | "LOCAL"; stage: DiagnosticStage; code: DiagnosticCode; status: number; requestId: string | null; elapsedMs: number; attempt: number };
const stages: DiagnosticStage[] = ["token", "transport", "response", "security", "auth", "read", "write", "validation", "storage", "merge", "http"];
export const safeCode = (code: unknown): DiagnosticCode => diagnosticCodes.includes(code as DiagnosticCode) ? code as DiagnosticCode : "unknown";
export function safeErrorCode(error: unknown): DiagnosticCode {
  try {
  const e = error as { name?: unknown; cause?: { code?: unknown }; code?: unknown } | null;
  return safeCode([e?.cause?.code, e?.code, e?.name].find(value => typeof value === "string" && diagnosticCodes.includes(value as DiagnosticCode)));
  } catch { return "unknown"; }
}
// D1 messages can contain SQL and bound values. Match only known engine labels;
// neither the original message, stack, cause nor SQL ever leaves this function.
export function databaseErrorCode(error: unknown): DiagnosticCode {
  const e = error as { message?: unknown; cause?: { message?: unknown } } | null;
  const messages = [e?.message, e?.cause?.message];
  for (const code of ["SQLITE_BUSY", "SQLITE_LOCKED", "SQLITE_FULL", "SQLITE_TOOBIG", "SQLITE_CONSTRAINT", "D1_EXEC_ERROR", "D1_TYPE_ERROR", "D1_ERROR"] as const)
    if (messages.some(message => typeof message === "string" && new RegExp(`\\b${code}\\b`).test(message))) return code;
  return safeErrorCode(error);
}
const integer = (v: unknown, max: number) => typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.floor(v))) : 0;
export function safeDiagnostic(value: unknown): SaveDiagnostic {
  const v = value as Partial<SaveDiagnostic> | null;
  return {
    schema: SAVE_DIAGNOSTICS_VERSION, at: integer(v?.at, 8640000000000000),
    event: v?.event === "recovered" ? "recovered" : "failure",
    operation: v?.operation === "GET" || v?.operation === "PUT" ? v.operation : "LOCAL",
    stage: stages.includes(v?.stage as DiagnosticStage) ? v!.stage! : "http", code: safeCode(v?.code),
    status: integer(v?.status, 599),
    requestId: typeof v?.requestId === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(v.requestId) ? v.requestId : null,
    elapsedMs: integer(v?.elapsedMs, 120000), attempt: integer(v?.attempt, 1000),
  };
}
export const SAVE_DIAGNOSTICS_KEY = "abb:save-diagnostics/1";
const MAX_AGE = 24 * 60 * 60 * 1000;
type StorageLike = Pick<Storage, "getItem" | "setItem">;
/** Retain only 50 safe events for 24 hours; never inspect library/account storage. */
export class SaveDiagnostics {
  private storage: StorageLike;
  private events: SaveDiagnostic[] = [];
  constructor(storage: StorageLike) { this.storage = storage; }
  read() {
    let stored: unknown;
    try { const raw = this.storage.getItem(SAVE_DIAGNOSTICS_KEY); stored = raw ? raw.length <= 30000 ? JSON.parse(raw) : [] : null; } catch {}
    this.events = (Array.isArray(stored) ? stored : this.events).slice(-50).map(safeDiagnostic).filter(e => e.at > Date.now() - MAX_AGE && e.at <= Date.now());
    try { this.storage.setItem(SAVE_DIAGNOSTICS_KEY, JSON.stringify(this.events)); } catch {}
    return this.events.slice();
  }
  record(event: Partial<SaveDiagnostic>) {
    try { this.read(); this.events.push(safeDiagnostic({ ...event, at: Date.now() })); this.events = this.events.slice(-50); this.storage.setItem(SAVE_DIAGNOSTICS_KEY, JSON.stringify(this.events)); } catch {}
  }
  export() { return { format: SAVE_DIAGNOSTICS_VERSION, events: this.read() }; }
}
