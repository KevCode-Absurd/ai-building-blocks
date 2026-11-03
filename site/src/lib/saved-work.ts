// Browser side of saved work: calculator numbers and opened specialists, kept through the account library
// (signed in: your account, on every device; signed out: this browser only).
import { libraryStorage } from "./library-storage";
import { WORK_KEY, parseWork, roleFromPath, withRole, withTool, type ToolEntry } from "./saved-work-data";

const read = () => { try { return libraryStorage.getItem(WORK_KEY); } catch { return null; } };
const write = (raw: string) => { try { libraryStorage.setItem(WORK_KEY, raw); } catch { /* storage blocked: keep working for this visit */ } };

/** Saved numbers for one calculator. Falls back to the older browser-only copy ("abb:tool:<slug>") once. */
export function readToolInputs(slug: string): { preset?: string; raw?: Record<string, string> } {
  const entry = parseWork(read()).tools[slug];
  if (entry) return { preset: entry.preset, raw: entry.raw };
  try { const legacy = JSON.parse(localStorage.getItem(`abb:tool:${slug}`) ?? "null"); if (legacy && typeof legacy === "object") return legacy; } catch { /* no older copy */ }
  return {};
}

/** Saves only fields the person changed. Nothing is written for a visit with the starting numbers. */
export function saveToolInputs(slug: string, entry: Omit<ToolEntry, "at">, changed = Object.keys(entry.raw).length > 0) {
  const existing = parseWork(read()).tools[slug];
  if (!changed && !existing) return;
  if (existing && existing.preset === entry.preset && JSON.stringify(existing.raw) === JSON.stringify(entry.raw)) return;
  write(withTool(read(), slug, { ...entry, at: Date.now() }));
}

/** Called on every page change; remembers the specialist when the page is one. */
export function rememberVisit(path: string) {
  const id = roleFromPath(path);
  if (!id) return;
  const work = parseWork(read());
  const newest = Object.entries(work.roles).sort((a, b) => b[1].at - a[1].at)[0];
  // Re-opening the same specialist within a minute is not news worth another account save.
  if (newest && newest[0] === id && Date.now() - newest[1].at < 60_000) return;
  write(withRole(read(), id, Date.now()));
}
