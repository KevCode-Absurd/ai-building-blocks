import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

// A tiny router: real paths (/skills/<slug>), the browser's own history, nothing else.
const CHANGE = "abb:navigate";
const subscribe = (fn: () => void) => {
  window.addEventListener("popstate", fn);
  window.addEventListener(CHANGE, fn);
  return () => { window.removeEventListener("popstate", fn); window.removeEventListener(CHANGE, fn); };
};
const snapshot = () => location.pathname + location.search;

let stopLanding: (() => void) | null = null;
/** Wait for a lazy route's real heading, and never pull focus back after the person continues. */
function landAtContent(hash: string, previousHeading: Element | null = null) {
  stopLanding?.();
  const path = location.pathname;
  let observer: MutationObserver | undefined, timer: ReturnType<typeof setTimeout> | undefined, frame = 0;
  let landed: HTMLElement | null = null;
  const cancel = () => {
    observer?.disconnect(); clearTimeout(timer); cancelAnimationFrame(frame);
    for (const event of ["pointerdown", "keydown", "wheel", "touchstart"]) window.removeEventListener(event, cancel);
    if (stopLanding === cancel) stopLanding = null;
  };
  const land = () => {
    if (location.pathname !== path) { cancel(); return; }
    const target = hash ? document.getElementById(decodeHash(hash)) : document.querySelector<HTMLElement>("#main-content main h1, main h1");
    if (!target || target === previousHeading || target === landed) return;
    if (landed) {
      const active = document.activeElement;
      // A loading section may be replaced by the real one. Restore only the focus
      // that replacement removed; never move it away from another active control.
      if (landed.isConnected || active && active !== document.body && active !== document.documentElement && active !== landed) { cancel(); return; }
    }
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    landed = target;
    target.focus({ preventScroll: true });
    if (hash) target.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  };
  stopLanding = cancel;
  for (const event of ["pointerdown", "keydown", "wheel", "touchstart"]) window.addEventListener(event, cancel, { passive: true });
  observer = new MutationObserver(land); observer.observe(document.body, { childList: true, subtree: true });
  timer = setTimeout(cancel, 5000);
  frame = requestAnimationFrame(land);
}
function decodeHash(hash: string) { try { return decodeURIComponent(hash.slice(1)); } catch { return hash.slice(1); } }
let lastPath = location.pathname;
window.addEventListener("popstate", () => {
  if (location.pathname !== lastPath) {
    landAtContent(location.hash, location.hash ? document.getElementById(decodeHash(location.hash)) : document.querySelector("#main-content main h1, main h1"));
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }
  lastPath = location.pathname;
});

export function useLocation() {
  const href = useSyncExternalStore(subscribe, snapshot);
  const u = new URL(href, location.origin);
  return { path: u.pathname, search: u.searchParams };
}

const LIBRARY_RETURN = "abbLibraryReturn";
/** Keep only library choices in a local history entry, including after a reload. */
function libraryUrl(value: unknown) {
  if (typeof value !== "string") return "/#library";
  try {
    const url = new URL(value, location.origin);
    if (url.origin !== location.origin || url.pathname !== "/") return "/#library";
    const query = new URLSearchParams();
    for (const key of ["q", "kind", "area", "fn", "job", "audience", "starred", "scope"]) {
      const text = url.searchParams.get(key);
      if (text) query.set(key, text);
    }
    return `/${query.size ? `?${query}` : ""}#library`;
  } catch { return "/#library"; }
}
let latestLibraryReturn = libraryUrl(history.state?.[LIBRARY_RETURN]);
export function libraryReturnTo() { return libraryUrl(history.state?.[LIBRARY_RETURN] ?? latestLibraryReturn); }
// Native table-of-contents anchors create history entries without our state.
// Carry the current library context into that entry before a possible reload.
window.addEventListener("hashchange", () => {
  const returnTo = libraryReturnTo();
  history.replaceState({ ...history.state, [LIBRARY_RETURN]: returnTo }, "", location.href);
});
window.addEventListener("popstate", () => {
  if (history.state?.[LIBRARY_RETURN] !== undefined) latestLibraryReturn = libraryReturnTo();
});

/** Go to a path. A hash (/#library) scrolls to that section once the page has drawn. */
export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const u = new URL(to, location.origin);
  if (u.origin !== location.origin) { location.assign(u.href); return; }
  const same = u.pathname === location.pathname;
  const previousHeading = u.hash ? document.getElementById(decodeHash(u.hash)) : document.querySelector("#main-content main h1, main h1");
  const returnTo = location.pathname === "/" ? libraryUrl(location.href) : libraryReturnTo();
  latestLibraryReturn = returnTo;
  history[opts.replace ? "replaceState" : "pushState"]({ [LIBRARY_RETURN]: returnTo }, "", u.pathname + u.search + u.hash);
  lastPath = u.pathname;
  window.dispatchEvent(new Event(CHANGE));
  // pushState does not emit hashchange. Lazy sections and the landing correction
  // need the same signal as a native anchor, even when the path stayed the same.
  if (u.hash) window.dispatchEvent(new Event("hashchange"));
  if (!same) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  if (u.hash || !same) landAtContent(u.hash, same ? null : previousHeading);
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
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target && rest.target !== "_self" || rest.download !== undefined || new URL(to, location.origin).origin !== location.origin) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={go} onPointerEnter={warm} onFocus={warm} onTouchStart={warm} {...rest} />;
}
