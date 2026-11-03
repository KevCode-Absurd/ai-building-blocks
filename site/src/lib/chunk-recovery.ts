// A deploy replaces the hashed code files. A page opened before it can still ask for an old file, which then fails
// to load. Reloading once fetches the new page and its new files. A short guard stops a reload loop when the
// failure has another cause (offline, a blocked file): the second failure shows the page's recovery screen instead.
import { safeErrorText } from "./safe-error-text.ts";

const RELOAD_KEY = "abb:chunk-reload";
const GUARD_MS = 60_000;
const REPORT_URL = "/api/client-error";
const CHUNK_MESSAGE = /dynamically imported module|importing a module script failed|error loading dynamically imported module|unable to preload css|failed to load module script|loading (css )?chunk [\w-]+ failed/i;

type StorageLike = Pick<Storage, "getItem" | "setItem">;
export type ClientErrorKind = "chunk" | "boundary" | "error";

/** True when an error means a code or style file could not be fetched, which a fresh page fixes. */
export function isChunkError(error: unknown): boolean {
  const e = error as { name?: unknown; message?: unknown } | null;
  return !!e && (e.name === "ChunkLoadError" || (typeof e.message === "string" && CHUNK_MESSAGE.test(e.message)));
}

/** Reload at most once a minute. Without storage there is no guard, so it never reloads. */
export function shouldReload(storage: StorageLike | null, now = Date.now()): boolean {
  if (!storage) return false;
  try {
    const last = Number(storage.getItem(RELOAD_KEY));
    if (Number.isFinite(last) && last > 0 && now - last < GUARD_MS) return false;
    storage.setItem(RELOAD_KEY, String(now));
    return storage.getItem(RELOAD_KEY) === String(now);
  } catch { return false; }
}

function session(): StorageLike | null {
  try { return window.sessionStorage; } catch { return null; }
}

// Set once a reload is under way, so the errors it leaves behind are not reported twice.
let reloading = false;

/** Tell the server a page broke. Fire and forget: it never throws and never sends the page's address details. */
export function reportClientError(kind: ClientErrorKind, error: unknown): void {
  if (reloading) return;
  try {
    const e = error as { name?: unknown; message?: unknown } | null;
    const body = JSON.stringify({
      kind, route: location.pathname.slice(0, 200),
      name: typeof e?.name === "string" ? e.name.slice(0, 40) : "Error", message: safeErrorText(e?.message),
    });
    // text/plain keeps this a simple request that sendBeacon always accepts.
    const blob = new Blob([body], { type: "text/plain" });
    if (navigator.sendBeacon?.(REPORT_URL, blob)) return;
    void fetch(REPORT_URL, { method: "POST", body, keepalive: true, headers: { "content-type": "text/plain" } }).catch(() => {});
  } catch { /* reporting must never break the page */ }
}

/** Report the failure and reload once. Returns false when the guard says a reload already happened. */
export function recoverFromChunkError(error: unknown, reload: () => void = () => location.reload()): boolean {
  if (reloading) return true;
  if (!shouldReload(session())) return false;
  reportClientError("chunk", error);
  reloading = true;
  reload();
  return true;
}

let installed = false;
/** Listen for failed code loads from anywhere in the app. Call once, before the app renders. */
export function installChunkRecovery(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  // Vite fires this when a lazy page's code or styles fail to load. Cancelling it stops the error only when we reload.
  window.addEventListener("vite:preloadError", event => {
    if (recoverFromChunkError((event as Event & { payload?: unknown }).payload)) event.preventDefault();
  });
  window.addEventListener("unhandledrejection", event => {
    if (isChunkError(event.reason) && recoverFromChunkError(event.reason)) event.preventDefault();
  });
}
