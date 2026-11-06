// API calls from the browser. Errors come back as ApiError with the server's plain-words message.
import { authHeaders } from "./auth.tsx";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}

// Answers the Worker put in the page (script#boot, see src/pages.ts), keyed by API path. Each is used once, for the
// first load, so a later visit to the same page asks the server again.
let boot: Record<string, unknown> | null = null;
function bootData(): Record<string, unknown> {
  if (boot) return boot;
  try { boot = JSON.parse(document.getElementById("boot")?.textContent || "{}"); } catch { boot = {}; }
  return boot ?? {};
}

/** The answer for this GET path that came inside the page, without using it up. */
export function peekBoot<T>(path: string): T | undefined {
  return typeof document === "undefined" ? undefined : bootData()[path] as T | undefined;
}

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  if (!opts.method && opts.body === undefined && typeof document !== "undefined") {
    const data = bootData();
    if (path in data) { const hit = data[path] as T; delete data[path]; return hit; }
  }
  const headers: Record<string, string> = { ...(await authHeaders()) };
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  let res: Response;
  try {
    res = await fetch(path, { method: opts.method ?? (opts.body === undefined ? "GET" : "POST"), headers, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
  } catch {
    throw new ApiError(0, "network", "We could not reach AI Blocks. Check your connection and try again.");
  }
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;
  if (!res.ok) throw new ApiError(res.status, data?.error?.code ?? "error", data?.error?.message ?? "Something went wrong. Try again.");
  return data as T;
}

export const money = (cents: number | null | undefined) =>
  cents === null || cents === undefined ? "" : `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;

export const when = (iso: string | null | undefined) => iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
