import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

// A tiny router: real paths (/skills/<slug>), the browser's own history, nothing else.
const CHANGE = "abb:navigate";
const subscribe = (fn: () => void) => {
  window.addEventListener("popstate", fn);
  window.addEventListener(CHANGE, fn);
  return () => { window.removeEventListener("popstate", fn); window.removeEventListener(CHANGE, fn); };
};
const snapshot = () => location.pathname + location.search;

export function useLocation() {
  const href = useSyncExternalStore(subscribe, snapshot);
  const u = new URL(href, location.origin);
  return { path: u.pathname, search: u.searchParams };
}

/** Go to a path. A hash (/#library) scrolls to that section once the page has drawn. */
export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const u = new URL(to, location.origin);
  const same = u.pathname === location.pathname;
  history[opts.replace ? "replaceState" : "pushState"](null, "", u.pathname + u.search + u.hash);
  window.dispatchEvent(new Event(CHANGE));
  // pushState does not emit hashchange. Lazy sections and the landing correction
  // need the same signal as a native anchor, even when the path stayed the same.
  if (u.hash) window.dispatchEvent(new Event("hashchange"));
  const land = () => {
    const el = u.hash ? document.getElementById(u.hash.slice(1)) : null;
    if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    else if (!same) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };
  // Existing sections land now. A queued smooth scroll can otherwise restart after
  // the visitor has already scrolled away. New pages wait for their first render.
  if (same) land(); else requestAnimationFrame(land);
}

/** Replace the query string without adding a history entry (filters, search). */
export function setSearch(params: Record<string, string>) {
  const u = new URL(location.href);
  for (const [k, v] of Object.entries(params)) { if (v) u.searchParams.set(k, v); else u.searchParams.delete(k); }
  history.replaceState(history.state, "", u.pathname + u.search + u.hash);
}

// Set once by the app: starts loading what a link's page needs as soon as a pointer or finger is on it,
// so the page is often ready by the time the click lands.
let prefetch: ((to: string) => void) | null = null;
export const setPrefetch = (fn: (to: string) => void) => { prefetch = fn; };

export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const warm = () => prefetch?.(to);
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={go} onPointerEnter={warm} onFocus={warm} onTouchStart={warm} {...rest} />;
}
