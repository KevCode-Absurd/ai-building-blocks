// A tiny client router: History API, path params, and <Link>. Pages are registered in src/ui/pages/index.ts.
import { useEffect, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach(l => l());
if (typeof window !== "undefined") window.addEventListener("popstate", notify);

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (opts.replace) history.replaceState(null, "", to); else history.pushState(null, "", to);
  window.scrollTo(0, 0);
  notify();
}

export function useLocation(): { path: string; query: URLSearchParams } {
  const [, force] = useState(0);
  useEffect(() => { const l = () => force(n => n + 1); listeners.add(l); return () => { listeners.delete(l); }; }, []);
  return { path: location.pathname.replace(/\/+$/, "") || "/", query: new URLSearchParams(location.search) };
}

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const keys: string[] = [];
  const re = new RegExp("^" + pattern.replace(/\/+$/, "").replace(/:([a-zA-Z_]+)/g, (_m, k) => { keys.push(k); return "([^/]+)"; }) + "/?$");
  const m = re.exec(path === "/" ? "/" : path);
  if (!m) return null;
  return Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
}

export function Link(props: { href: string; children: ComponentChildren; class?: string; "aria-current"?: JSX.AriaAttributes["aria-current"] }) {
  const external = /^https?:/.test(props.href);
  return (
    <a href={props.href} class={props.class} aria-current={props["aria-current"]}
      onClick={(e: MouseEvent) => {
        if (external || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(props.href);
      }}>
      {props.children}
    </a>
  );
}
