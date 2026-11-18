// Shared UI pieces. Use these instead of one-off styles so every page looks like one product.
import { useEffect, useState } from "preact/hooks";
import { lazy, Suspense } from "preact/compat";
import type { ComponentChildren, JSX } from "preact";
const MarkdownContent = lazy(() => import("./lib/markdown-content.tsx"));
import { Link } from "./lib/router.tsx";

export function Page(props: { title: string; intro?: ComponentChildren; actions?: ComponentChildren; children: ComponentChildren; wide?: boolean }) {
  useEffect(() => { document.title = `${props.title} | AI Blocks`; }, [props.title]);
  return (
    <main class={`page${props.wide ? " page-wide" : ""}`}>
      <header class="page-head">
        <div>
          <h1>{props.title}</h1>
          {props.intro && <p class="lede">{props.intro}</p>}
        </div>
        {props.actions && <div class="page-actions">{props.actions}</div>}
      </header>
      {props.children}
    </main>
  );
}

type ButtonProps = { children: ComponentChildren; onClick?: () => void; href?: string; kind?: "primary" | "secondary" | "ghost" | "danger"; disabled?: boolean; busy?: boolean; type?: "button" | "submit"; small?: boolean };
/** The library's button classes (site/src/styles.css): primary is btn-primary, secondary the outlined btn-line,
 *  ghost btn-ghost, small btn-sm. Danger is the agents site's own outlined red button. */
const BUTTON_KIND = { primary: "btn-primary", secondary: "btn-line", ghost: "btn-ghost", danger: "btn-danger" } as const;
export function Button(p: ButtonProps) {
  const cls = `btn ${BUTTON_KIND[p.kind ?? "primary"]}${p.small ? " btn-sm" : ""}`;
  if (p.href) return <Link href={p.href} class={cls}>{p.children}</Link>;
  return <button type={p.type ?? "button"} class={cls} disabled={p.disabled || p.busy} aria-busy={p.busy} onClick={p.onClick}>{p.busy ? "Working..." : p.children}</button>;
}

export function Card(props: { children: ComponentChildren; title?: ComponentChildren; class?: string; actions?: ComponentChildren }) {
  return (
    <section class={`card ${props.class ?? ""}`}>
      {(props.title || props.actions) && <div class="card-head">{props.title && <h2>{props.title}</h2>}{props.actions}</div>}
      {props.children}
    </section>
  );
}

export function Field(props: { label: string; help?: string; error?: string; children: ComponentChildren; id?: string }) {
  return (
    <label class="field" for={props.id}>
      <span class="field-label">{props.label}</span>
      {props.children}
      {props.help && <span class="field-help">{props.help}</span>}
      {props.error && <span class="field-error" role="alert">{props.error}</span>}
    </label>
  );
}

export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement> & { value?: string | number; onValue?: (v: string) => void }) {
  const { onValue, ...rest } = props;
  return <input class="input" {...rest} onInput={e => onValue?.((e.target as HTMLInputElement).value)} />;
}

export function TextArea(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & { value?: string; onValue?: (v: string) => void; rows?: number }) {
  const { onValue, ...rest } = props;
  return <textarea class="input textarea" rows={props.rows ?? 5} {...rest} onInput={e => onValue?.((e.target as HTMLTextAreaElement).value)} />;
}

export function Select(props: { value: string; options: { value: string; label: string }[]; onValue: (v: string) => void; id?: string }) {
  return (
    <select class="input" id={props.id} value={props.value} onChange={e => props.onValue((e.target as HTMLSelectElement).value)}>
      {props.options.map(o => <option value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Badge(props: { children: ComponentChildren; tone?: "neutral" | "good" | "warn" | "bad" | "info" }) {
  return <span class={`badge badge-${props.tone ?? "neutral"}`}>{props.children}</span>;
}

export function Notice(props: { children: ComponentChildren; tone?: "info" | "good" | "warn" | "bad"; title?: string }) {
  return <div class={`notice notice-${props.tone ?? "info"}`} role={props.tone === "bad" ? "alert" : "status"}>{props.title && <strong>{props.title}</strong>}<div>{props.children}</div></div>;
}

export function Spinner(props: { label?: string }) {
  return <div class="spinner" role="status"><span class="spinner-dot" aria-hidden="true" />{props.label ?? "Loading..."}</div>;
}

export function Empty(props: { title: string; children?: ComponentChildren; action?: ComponentChildren }) {
  return <div class="empty"><h3>{props.title}</h3>{props.children && <p>{props.children}</p>}{props.action}</div>;
}

/** Renders model-written markdown safely (sanitised HTML). */
export function Markdown(props: { text: string; class?: string }) {
  return <Suspense fallback={<div class={`prose ${props.class ?? ""}`} aria-busy="true">Loading the text…</div>}>
    <MarkdownContent {...props} />
  </Suspense>;
}

export function Table(props: { head: ComponentChildren[]; rows: ComponentChildren[][]; empty?: string }) {
  if (!props.rows.length) return <p class="muted">{props.empty ?? "Nothing here yet."}</p>;
  return (
    <div class="table-wrap">
      <table class="table">
        <thead><tr>{props.head.map(h => <th>{h}</th>)}</tr></thead>
        <tbody>{props.rows.map(r => <tr>{r.map(c => <td>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function Tabs(props: { tabs: { id: string; label: string }[]; value: string; onValue: (id: string) => void }) {
  return (
    <div class="tabs" role="tablist">
      {props.tabs.map(t => <button role="tab" aria-selected={t.id === props.value} class={`tab${t.id === props.value ? " tab-on" : ""}`} onClick={() => props.onValue(t.id)}>{t.label}</button>)}
    </div>
  );
}

/** Loads data with a loading and error state. reload() fetches again. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = [], initial?: T): { data: T | null; error: string | null; loading: boolean; reload: () => void } {
  // initial: data that came with the page (peekBoot), so the first paint shows it instead of a spinner.
  const [data, setData] = useState<T | null>(initial ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(initial === undefined);
  const [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    setLoading(true); setError(null);
    load().then(d => { if (live) setData(d); }).catch(e => { if (live) setError(e?.message ?? "Something went wrong."); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [...deps, n]);
  return { data, error, loading, reload: () => setN(x => x + 1) };
}

/** Standard loading / error wrapper around useLoad results. */
export function Loaded<T>(props: { state: { data: T | null; error: string | null; loading: boolean }; children: (data: T) => ComponentChildren }) {
  if (props.state.error) return <Notice tone="bad">{props.state.error}</Notice>;
  if (props.state.loading && !props.state.data) return <Spinner />;
  return <>{props.state.data !== null && props.children(props.state.data)}</>;
}

// ---------- The library's logo, theme switch and arrow (site/src/ui.tsx) ----------

/** The mark: a round world of blocks, like the globe of 0s and 1s on the library's home page. Lit and faint blocks
 *  alternate, like bits. */
const GLOBE = ["..###..", ".#+#+#.", "#+#+#+#", "##+#+##", "#+#+#+#", ".#+#+#.", "..###.."];
function Mark() {
  return (
    <>
      {GLOBE.flatMap((row, y) => [...row].map((c, x) => c === "." ? null : (
        <rect key={`${x}-${y}`} x={x * 3.4 + 0.3} y={y * 3.4 + 0.3} width="2.9" height="2.9" fill="currentColor" opacity={c === "+" ? 0.32 : undefined} />
      )))}
    </>
  );
}

/** The logo stays still, as on the library (site/src/ui.tsx), so the header is calm and recognisable. Sized by CSS (.brand svg). */
export function Logo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" class="logo" data-testid="logo">
      <Mark />
    </svg>
  );
}

export const ArrowIcon = (props: { size?: number }) => {
  const size = props.size ?? 14;
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>;
};
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5" /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" /></svg>
);

/** The library's theme switch. Dark by default (index.html applies a saved choice of light before first paint);
 *  the choice is kept under the library's key, "abb:theme", so both sites agree. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(() => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"));
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button" class="icon-btn" aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`} data-testid="theme-toggle"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("abb:theme", next); } catch { /* private mode: still switches for this visit */ }
        setTheme(next);
      }}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
