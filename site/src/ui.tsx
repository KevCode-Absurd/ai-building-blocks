import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyEvent, type ReactNode } from "react";
import { type Block, kindInfo, pathOf, taskOf } from "./lib/data";
import { Link } from "./lib/router";
import { kits, useStore } from "./lib/store";

/** The mark: a 3 by 3 grid of blocks, like bits. Solid on the corners and centre, faint between. */
export function Logo() {
  const on = [[2, 2], [16, 2], [9, 9], [2, 16], [16, 16]];
  const dim = [[9, 2], [2, 9], [16, 9], [9, 16]];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="logo">
      {on.map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="6" height="6" fill="currentColor" />)}
      {dim.map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="6" height="6" fill="currentColor" opacity="0.32" />)}
    </svg>
  );
}
export const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);
export const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
);

/** Light by default; dark when the person picks it, and the choice is remembered. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(() => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"));
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="icon-btn" aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`} data-testid="theme-toggle"
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

export function BlockCard({ b }: { b: Block }) {
  const kind = kindInfo(b);
  return (
    <Link to={pathOf(b)} className="card" data-testid="block-card" data-slug={b.slug} data-kind={kind.id}>
      <span className="meta"><span className="kind">{kind.name}</span><span className="type">{taskOf(b).name}</span></span>
      <span className="nm">{b.name}</span>
      <span className="sm">{b.summary}</span>
      {b.peek && <span className="peek" aria-hidden="true">{b.peek}</span>}
      <span className="view">{b.category === "orchestrator" ? `View the ${b.steps.length} steps` : `View the ${kind.name.toLowerCase()}`}<ArrowIcon size={12} /></span>
    </Link>
  );
}

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => { if (message) { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); } }, [message, onDone]);
  return message ? <div className="toast" role="status">{message}</div> : null;
}

export function KitMenu({ slug, onChange }: { slug: string; onChange: (msg: string) => void }) {
  const all = useStore((s) => s.kits);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); } };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", esc, true);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc, true); };
  }, [open]);
  const inAny = all.some((k) => k.slugs.includes(slug));
  return (
    <div className="pop" ref={ref}>
      <button className="btn btn-dark" aria-expanded={open} onClick={() => setOpen(!open)}>{inAny ? "In your kits" : "Save to kit"}</button>
      {open && (
        <div className="pop-panel">
          {all.length === 0 && <p className="small">A kit is a set of blocks you use together. Name your first one.</p>}
          {all.map((k) => (
            <label key={k.id}>
              <input type="checkbox" checked={k.slugs.includes(slug)} onChange={() => { const had = k.slugs.includes(slug); kits.toggle(k.id, slug); onChange(had ? `Removed from ${k.name}` : `Saved to ${k.name}`); }} />
              {k.name}<span className="small" style={{ marginLeft: "auto" }}>{k.slugs.length}</span>
            </label>
          ))}
          <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; const k = kits.create(name, [slug]); setName(""); onChange(`Saved to ${k.name}`); }}>
            <input type="text" placeholder="New kit name" value={name} onChange={(e) => setName(e.target.value)} aria-label="New kit name" />
            <button className="btn btn-primary btn-sm" type="submit">Create</button>
          </form>
        </div>
      )}
    </div>
  );
}

/** A right-hand panel over the page. Escape or the scrim closes it; focus moves in and back out. */
export function Drawer({ label, top, onClose, children }: { label: string; top: ReactNode; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; before?.focus?.(); };
  }, [onClose]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true" aria-label={label} ref={ref} tabIndex={-1} data-testid="drawer">
        <div className="drawer-top">{top}<button className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon /></button></div>
        <div className="drawer-body">{children}</div>
      </div>
    </>
  );
}

export type Opt = { value: string; label: string; count?: number };
/** A dropdown that matches the site: a pill that names the filter and its choice, and a list with counts.
 *  Arrow keys move, Enter picks, Escape closes; options with nothing in them are greyed out. */
export function Select({ label, value, options, onChange, testId }: { label: string; value: string; options: Opt[]; onChange: (v: string) => void; testId?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useRef(`sel-${Math.random().toString(36).slice(2, 8)}`).current;
  const current = options.find((o) => o.value === value) ?? options[0];
  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    list.current?.focus();
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const pick = (o: Opt) => { if (o.count === 0 && o.value !== value) return; onChange(o.value); setOpen(false); ref.current?.querySelector("button")?.focus(); };
  const onKey = (e: ReactKeyEvent) => {
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); ref.current?.querySelector("button")?.focus(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(options[active]); }
    else if (e.key === "Tab") setOpen(false);
  };
  useEffect(() => { if (open) list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active, open]);
  const set = value !== options[0]?.value;
  return (
    <div className={`sel${open ? " open" : ""}${set ? " set" : ""}`} ref={ref}>
      <button type="button" className="sel-btn" aria-haspopup="listbox" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} data-testid={testId}
        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); } }}>
        <span className="sel-label">{label}</span>
        <span className="sel-value">{current?.label}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <ul className="sel-list" role="listbox" id={id} tabIndex={-1} ref={list} aria-label={label} aria-activedescendant={`${id}-${active}`} onKeyDown={onKey}>
          {options.map((o, i) => (
            <li key={o.value} id={`${id}-${i}`} data-i={i} role="option" aria-selected={o.value === value} aria-disabled={o.count === 0 && o.value !== value}
              className={i === active ? "active" : undefined} onMouseEnter={() => setActive(i)} onClick={() => pick(o)}>
              <span className="sel-check" aria-hidden="true">{o.value === value ? "●" : ""}</span>
              <span className="sel-name">{o.label}</span>
              {o.count !== undefined && <span className="sel-count">{o.count}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
