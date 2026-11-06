// Shared UI pieces. Use these instead of one-off styles so every page looks like one product.
import { useEffect, useMemo, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Link } from "./lib/router.tsx";

export function Page(props: { title: string; intro?: ComponentChildren; actions?: ComponentChildren; children: ComponentChildren; wide?: boolean }) {
  useEffect(() => { document.title = `${props.title} · AI Blocks Agents`; }, [props.title]);
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
export function Button(p: ButtonProps) {
  const cls = `btn btn-${p.kind ?? "primary"}${p.small ? " btn-small" : ""}`;
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
  const html = useMemo(() => DOMPurify.sanitize(marked.parse(props.text ?? "", { async: false }) as string), [props.text]);
  return <div class={`prose ${props.class ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
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
export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []): { data: T | null; error: string | null; loading: boolean; reload: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

export function Logo(props: { size?: number }) {
  const s = props.size ?? 24;
  return <img src="/logo.svg" alt="" width={s} height={s} class="brand-logo" />;
}
