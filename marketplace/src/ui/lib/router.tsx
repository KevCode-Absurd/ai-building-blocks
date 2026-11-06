// A tiny client router: History API, path params, and <Link>. Pages are registered in src/ui/pages/index.ts.
import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach(l => l());

// Back and forward (the button or a swipe) return to the exact place on every page. Each history entry keeps its
// scroll position, saved as you leave it, and any page state kept with useHistoryState (such as how many agents were
// shown). The browser's own restore is off: it runs before the app has drawn the page, so it lands too high.
type EntryState = Record<string, unknown>;
const entryState = (): EntryState => (history.state && typeof history.state === "object" ? history.state as EntryState : {});
function keepInEntry(values: EntryState) {
  try { history.replaceState({ ...entryState(), ...values }, ""); } catch { /* state too large or blocked: nothing to keep */ }
}
const saveScroll = () => keepInEntry({ scrollY: Math.round(window.scrollY) });

let restoring = 0;
/** Scrolls back to where this entry was left, every 16 ms while the page draws (data may still be loading). A timer, not
 *  requestAnimationFrame, which some browsers pause for pages they think are hidden. Stops
 *  when the place is reached and the page has stopped growing, after 3 seconds, or as soon as the visitor scrolls. */
function restoreScroll() {
  const run = ++restoring;
  const target = Number(entryState().scrollY) || 0;
  const started = performance.now();
  let lastHeight = -1, steadySince = 0;
  const cancel = () => { if (run === restoring) restoring++; };
  const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
  events.forEach(e => window.addEventListener(e, cancel, { once: true, passive: true }));
  const done = () => events.forEach(e => window.removeEventListener(e, cancel));
  const step = () => {
    if (run !== restoring) return done();
    const now = performance.now();
    const height = document.documentElement.scrollHeight;
    window.scrollTo(0, Math.min(target, Math.max(0, height - window.innerHeight)));
    if (height !== lastHeight) { lastHeight = height; steadySince = now; }
    const reached = Math.abs(window.scrollY - target) < 2;
    if ((reached && now - steadySince > 400) || now - started > 3000) return done();
    setTimeout(step, 16);
  };
  setTimeout(step, 0);
}

if (typeof window !== "undefined") {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("popstate", () => { notify(); restoreScroll(); });
  window.addEventListener("pagehide", saveScroll);
  // Saving only on the way out misses reloads in some browsers, so the place is also saved once scrolling pauses
  // (one save per pause keeps well under the browsers' limits on history writes). A running restore keeps its own target.
  let pause = 0;
  window.addEventListener("scroll", () => { clearTimeout(pause); pause = window.setTimeout(saveScroll, 250); }, { passive: true });
  // Coming back to the site from another one (sign-in, a download page) or reloading: the same place again.
  const kind = (performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined)?.type;
  if ((kind === "back_forward" || kind === "reload") && entryState().scrollY) restoreScroll();
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (opts.replace) history.replaceState(null, "", to);
  else { saveScroll(); history.pushState(null, "", to); }
  restoring++;
  window.scrollTo(0, 0);
  notify();
}

/** Like useState, but kept with this history entry, so going back to the page brings the value back too. */
export function useHistoryState<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => (key in entryState() ? entryState()[key] as T : initial));
  const ref = useRef(value);
  const set = (next: T | ((prev: T) => T)) => {
    const v = typeof next === "function" ? (next as (prev: T) => T)(ref.current) : next;
    ref.current = v;
    keepInEntry({ [key]: v });
    setValue(v);
  };
  return [value, set];
}

/** Changes the address of this history entry (a filter, say) and keeps what the entry holds. */
export function replaceAddress(to: string) {
  history.replaceState(history.state, "", to);
}

export function useLocation(): { path: string; query: URLSearchParams } {
  const [, force] = useState(0);
  useEffect(() => { const l = () => force(n => n + 1); listeners.add(l); return () => { listeners.delete(l); }; }, []);
  return { path: location.pathname.replace(/\/+$/, "") || "/", query: new URLSearchParams(location.search) };
}

/** ":name" matches one path segment. A last "*name" matches the rest of the path, slashes included
 *  ("/agents/:id/files/*path"). A value that is not valid percent-encoding matches nothing. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const keys: string[] = [];
  const re = new RegExp("^" + pattern.replace(/\/+$/, "")
    .replace(/:([a-zA-Z_]+)/g, (_m, k) => { keys.push(k); return "([^/]+)"; })
    .replace(/\*([a-zA-Z_]+)$/, (_m, k) => { keys.push(k); return "(.+)"; }) + "/?$");
  const m = re.exec(path === "/" ? "/" : path);
  if (!m) return null;
  try { return Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])); } catch { return null; }
}

export function Link(props: { href: string; children: ComponentChildren; class?: string; "aria-current"?: JSX.AriaAttributes["aria-current"]; "aria-label"?: string; onClick?: (e: MouseEvent) => void }) {
  const external = /^https?:/.test(props.href);
  return (
    <a href={props.href} class={props.class} aria-current={props["aria-current"]} aria-label={props["aria-label"]}
      onClick={(e: MouseEvent) => {
        props.onClick?.(e);
        if (e.defaultPrevented || external || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(props.href);
      }}>
      {props.children}
    </a>
  );
}
