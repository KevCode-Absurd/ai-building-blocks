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
  requestAnimationFrame(() => {
    const el = u.hash ? document.getElementById(u.hash.slice(1)) : null;
    if (el) el.scrollIntoView({ behavior: same ? "smooth" : "auto" });
    else if (!same) window.scrollTo(0, 0);
  });
}

/** Replace the query string without adding a history entry (filters, search). */
export function setSearch(params: Record<string, string>) {
  const u = new URL(location.href);
  for (const [k, v] of Object.entries(params)) { if (v) u.searchParams.set(k, v); else u.searchParams.delete(k); }
  history.replaceState(history.state, "", u.pathname + u.search + u.hash);
}

export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={go} {...rest} />;
}
