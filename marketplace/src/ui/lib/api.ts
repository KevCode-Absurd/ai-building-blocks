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

// Recent answers about agents (/api/agents...), the same for everyone, kept for a few minutes. Going back to a page
// then draws it at once and at full height, so the router can put the visitor back where they were.
const RECENT_MS = 3 * 60_000, RECENT_MAX = 40;
const recent = new Map<string, { at: number; data: unknown }>();
const isRecentable = (path: string) => path.startsWith("/api/agents");
function remember(path: string, data: unknown) {
  if (!isRecentable(path)) return;
  recent.delete(path);
  recent.set(path, { at: Date.now(), data });
  if (recent.size > RECENT_MAX) recent.delete(recent.keys().next().value!);
}
function recall<T>(path: string): T | undefined {
  const hit = recent.get(path);
  return hit && Date.now() - hit.at < RECENT_MS ? hit.data as T : undefined;
}

/** An answer for this GET path we already have (inside the page, or a recent one), without using it up. */
export function peekBoot<T>(path: string): T | undefined {
  if (typeof document === "undefined") return undefined;
  return (bootData()[path] as T | undefined) ?? recall<T>(path);
}

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const isGet = !opts.method && opts.body === undefined;
  if (isGet && typeof document !== "undefined") {
    const data = bootData();
    if (path in data) { const hit = data[path] as T; delete data[path]; remember(path, hit); return hit; }
    const known = recall<T>(path);
    if (known !== undefined) return known;
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
  if (isGet) remember(path, data);
  return data as T;
}

export const money = (cents: number | null | undefined) =>
  cents === null || cents === undefined ? "" : `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;

export const when = (iso: string | null | undefined) => iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
