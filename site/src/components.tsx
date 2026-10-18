import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { type Block, type Role, formatImage, portLabel, roleName } from "./lib/data";
import { kits, useStore } from "./lib/store";

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="3" width="12" height="12" rx="3" fill="var(--ink)" />
      <rect x="17" y="17" width="12" height="12" rx="3" fill="var(--action)" />
      <path d="M15 9h4a4 4 0 0 1 4 4v4" stroke="var(--ink)" strokeWidth="2.4" fill="none" />
    </svg>
  );
}

export const Arrow = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const kitCount = useStore((s) => s.kits.length);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-in">
        <Link to="/" className="brand"><Logo />AI Building Blocks</Link>
        <nav className={`nav${open ? " open" : ""}`} aria-label="Main">
          <NavLink to="/library">Library</NavLink>
          <NavLink to="/library?category=ecommerce">Ecommerce</NavLink>
          <NavLink to="/workflows">Workflows</NavLink>
          <NavLink to="/canvas">Canvas</NavLink>
          <NavLink to="/kits">Kits{kitCount > 0 && <span className="count-pill">{kitCount}</span>}</NavLink>
        </nav>
        <div className="header-end">
          <Link to="/canvas" className="btn btn-primary btn-sm">Build a workflow</Link>
          <button className="btn btn-quiet btn-sm menu-btn" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <hr className="rule" style={{ marginBottom: 56 }} />
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand" style={{ color: "var(--ink)", marginBottom: 14 }}><Logo />AI Building Blocks</Link>
            <p style={{ maxWidth: 360, marginTop: 14 }}>A free library of tested AI building blocks for any business. Built on the ideas in Chip Huyen's <i>AI Engineering</i> (O'Reilly).</p>
          </div>
          <div><h6>Library</h6><ul><li><Link to="/library?category=general">General</Link></li><li><Link to="/library?category=ecommerce">Ecommerce</Link></li><li><Link to="/workflows">Workflows</Link></li></ul></div>
          <div><h6>Make</h6><ul><li><Link to="/canvas">Canvas</Link></li><li><Link to="/kits">Your kits</Link></li></ul></div>
          <div><h6>About</h6><ul><li><a href="https://github.com/KevCode-Absurd/ai-building-blocks">GitHub</a></li><li><Link to="/#testing">How we test</Link></li></ul></div>
        </div>
        <p style={{ marginTop: 56, fontSize: 13 }}>Examples are made from public information and are not affiliated with the brands shown. What you save stays in this browser.</p>
      </div>
    </footer>
  );
}

export function RoleMark({ role, children }: { role: Role; children?: ReactNode }) {
  return <span className={`role-${role}`} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><span className="dot" />{children ?? roleName(role)}</span>;
}

export function BlockCard({ b, showImage = true }: { b: Block; showImage?: boolean }) {
  return (
    <Link to={`/blocks/${b.slug}`} className="card">
      {showImage && b.example && <div className="thumb"><img src={formatImage(b.example)} alt="" loading="lazy" /></div>}
      <div className="meta">
        <RoleMark role={b.role} />
        {b.category === "ecommerce" ? <span className="ecom-tag">Ecommerce</span> : b.addon ? <span className="ecom-tag">+ Ecommerce</span> : null}
        <span className="type">{b.type}</span>
      </div>
      <div className="nm">{b.name}</div>
      <p className="sm">{b.summary}</p>
      <div className="flow">
        <span>{b.inputs.length ? b.inputs.map((p) => portLabel(p.type)).join(", ") : "Your request"}</span>
        <Arrow size={13} />
        <span>{b.outputs.map((p) => portLabel(p.type)).join(", ") || "Output"}</span>
      </div>
    </Link>
  );
}

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => { if (message) { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); } }, [message, onDone]);
  return message ? <div className="toast" role="status">{message}</div> : null;
}

export function KitMenu({ slug, onChange }: { slug: string; onChange?: (msg: string) => void }) {
  const all = useStore((s) => s.kits);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  const inAny = all.some((k) => k.slugs.includes(slug));
  return (
    <div className="pop" ref={ref}>
      <button className="btn btn-quiet" aria-expanded={open} onClick={() => setOpen(!open)}>{inAny ? "In your kits" : "Add to kit"}</button>
      {open && (
        <div className="pop-panel">
          {all.length === 0 && <p className="small" style={{ margin: "8px 10px" }}>Kits group the blocks you use together. Name your first one.</p>}
          {all.map((k) => (
            <label key={k.id}>
              <input type="checkbox" checked={k.slugs.includes(slug)} onChange={() => { kits.toggle(k.id, slug); onChange?.(k.slugs.includes(slug) ? `Removed from ${k.name}` : `Added to ${k.name}`); }} />
              {k.name}<span className="small" style={{ marginLeft: "auto" }}>{k.slugs.length}</span>
            </label>
          ))}
          <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; const k = kits.create(name, [slug]); setName(""); onChange?.(`Added to ${k.name}`); }}>
            <input type="text" placeholder="New kit name" value={name} onChange={(e) => setName(e.target.value)} aria-label="New kit name" />
            <button className="btn btn-primary btn-sm" type="submit">Create</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function useTitle(title: string) {
  useEffect(() => { document.title = title ? `${title} · AI Building Blocks` : "AI Building Blocks"; }, [title]);
}
