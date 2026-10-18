import { useEffect, useRef, useState, type ReactNode } from "react";
import { type Block, type Role, portLabel, roleName } from "./lib/data";
import { kits, useStore } from "./lib/store";

export function Logo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" rx="2.2" fill="currentColor" />
      <rect x="13" y="13" width="9" height="9" rx="2.2" fill="currentColor" opacity="0.5" />
      <path d="M11 6.5h3.5a3 3 0 0 1 3 3V13" stroke="currentColor" strokeWidth="1.8" fill="none" />
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

/** Dark or light. A saved choice wins; otherwise the system setting decides. */
export function ThemeToggle() {
  const sys = () => (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const [theme, setTheme] = useState<"dark" | "light">(() => (document.documentElement.dataset.theme as "dark" | "light") || sys());
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

export function RoleMark({ role, children }: { role: Role; children?: ReactNode }) {
  return <span className={`role-mark role-${role}`}><span className="dot" />{children ?? roleName(role)}</span>;
}

export function BlockCard({ b, onOpen }: { b: Block; onOpen: (slug: string) => void }) {
  return (
    <button className="card" onClick={() => onOpen(b.slug)} data-testid="block-card" data-slug={b.slug}>
      <span className="meta">
        <RoleMark role={b.role} />
        {b.category === "ecommerce" ? <span className="tag">Ecommerce</span> : b.addon ? <span className="tag">+ Ecommerce</span> : null}
        <span className="type">{b.type}</span>
      </span>
      <span className="nm">{b.name}</span>
      <span className="sm">{b.summary}</span>
      <span className="flow">
        <span>{b.inputs.length ? b.inputs.filter((p) => p.required).map((p) => portLabel(p.type)).join(", ") || portLabel(b.inputs[0].type) : "Your request"}</span>
        <ArrowIcon size={12} />
        <span>{b.outputs.map((p) => portLabel(p.type)).join(", ") || "Output"}</span>
      </span>
    </button>
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
      <button className="btn btn-dark btn-sm" aria-expanded={open} onClick={() => setOpen(!open)}>{inAny ? "In your kits" : "Save to kit"}</button>
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
