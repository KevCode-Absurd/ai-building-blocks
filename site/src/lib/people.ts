// The "From people" page lists items that other people made public. It stays out of the menus and the footer
// until the public list is long enough to be worth opening. The count only exists on the server, so the
// check runs in the browser: once per hour per tab, after the page has drawn, and a failure counts as "not yet".
import { useEffect, useState } from "react";
import { spaces } from "./space";

/** Show the From people links once at least this many public items exist. */
export const PEOPLE_MIN = 20;
const KEY = "abb:people-count";
const HOUR = 60 * 60 * 1000;

export const enoughPeople = (count: number) => count >= PEOPLE_MIN;

function cached(): number | null {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as { n: number; at: number } | null;
    return v && Number.isFinite(v.n) && Date.now() - v.at < HOUR ? v.n : null;
  } catch { return null; }
}

let pending: Promise<number> | null = null;
/** How many public items there are right now (0 when the list can't be read). */
export function loadPublicCount(): Promise<number> {
  pending ??= spaces.publicList()
    .then((r) => (Array.isArray(r?.items) ? r.items.length : 0), () => 0)
    .then((n) => { try { sessionStorage.setItem(KEY, JSON.stringify({ n, at: Date.now() })); } catch { /* private mode: asked again next visit */ } return n; });
  return pending;
}

/** True once the public list has at least PEOPLE_MIN items. Starts false, so nothing flashes in for a visitor on a quiet site. */
export function usePeopleVisible(): boolean {
  const [count, setCount] = useState(() => cached() ?? 0);
  useEffect(() => {
    if (cached() !== null) return;
    let live = true;
    const run = () => { void loadPublicCount().then((n) => { if (live) setCount(n); }); };
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1500));
    const stop = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(run, { timeout: 5000 });
    return () => { live = false; stop(id); };
  }, []);
  return enoughPeople(count);
}
