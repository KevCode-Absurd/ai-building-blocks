import { memo, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyEvent, type ReactNode } from "react";
import { B8, ICONS } from "./lib/pixel";
import { type Block, formatOf, kindInfo, loadPage, paidService, pathOf, taskOf } from "./lib/data";
import { Link } from "./lib/router";
import { ThinkBars } from "./Gauge";
import PixelFace from "./PixelFace";
import { kits, useStore } from "./lib/store";

/** The mark: a round world of blocks, like the globe of 0s and 1s on the home page. Lit and faint blocks alternate, like bits. */
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

// What the blocks build, on a 6 by 6 grid, top row first. Each one goes up from the bottom, a block at a time.
const BUILDS: string[][] = [
  ["..##..", ".####.", "######", ".####.", ".#.##.", ".#.##."], // house
  ["..##..", ".####.", ".#..#.", ".####.", "######", "#.##.#"], // rocket
  ["..##..", ".####.", "######", ".####.", "..##..", "..##.."], // tree
  [".####.", "#.##.#", "######", ".####.", ".#..#.", ".#..#."], // robot
  [".#..#.", "######", "######", ".####.", "..##..", "......"], // heart
  ["#.#..#", "######", ".####.", ".#..#.", ".####.", ".####."], // castle
];
const cellsOf = (rows: string[]) => {
  const out: [number, number][] = [];
  for (let y = rows.length - 1; y >= 0; y--) for (let x = 0; x < 6; x++) if (rows[y][x] === "#") out.push([x, y]);
  return out;
};
const BUILT = BUILDS.map(cellsOf);

/** The logo. It shows the mark, then stacks blocks into a house, a rocket, a tree, a robot, a heart and a castle,
 *  and comes back to the mark. Still for anyone who asks for reduced motion. */
export function Logo() {
  const [frame, setFrame] = useState({ build: -1, n: 0, clearing: false });
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let t: number;
    const step = (f: typeof frame) => {
      setFrame(f);
      let next: typeof frame, wait: number;
      if (f.build === -1) { next = { build: 0, n: 0, clearing: false }; wait = 3200; }
      else if (f.clearing) { next = { build: f.build + 1 < BUILT.length ? f.build + 1 : -1, n: 0, clearing: false }; wait = 380; }
      else if (f.n < BUILT[f.build].length) { next = { ...f, n: f.n + 1 }; wait = 70; }
      else { next = { ...f, clearing: true }; wait = 1500; }
      t = window.setTimeout(() => step(next), wait);
    };
    step({ build: -1, n: 0, clearing: false });
    return () => window.clearTimeout(t);
  }, []);
  const { build, n, clearing } = frame;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`logo${build >= 0 ? " building" : ""}${clearing ? " clearing" : ""}`} data-testid="logo">
      {build < 0 ? <Mark /> : BUILT[build].slice(0, n).map(([x, y]) => (
        <rect key={`${build}-${x}-${y}`} className="drop" x={x * 4 + 0.3} y={y * 4 + 0.3} width="3.4" height="3.4" fill="currentColor" />
      ))}
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

/** A job function's 8 by 8 pixel icon. Unlit pixels show faintly, like an LCD; on hover the icon redraws in dither order. */
export function PixelIcon({ id }: { id: string }) {
  const rows = ICONS[id];
  if (!rows) return null;
  return (
    <svg viewBox="0 0 8 8" className="px" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((r, y) => [...r].map((ch, x) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={ch === "#" ? "on" : "off"} style={{ "--d": B8[y][x] } as CSSProperties} />
      )))}
    </svg>
  );
}

/** Card summaries remain readable while hovering and scrolling. */
function Peek({ text }: { text: string }) {
  return <span className="peek" data-done="true">{text}</span>;
}

/** Who made a block: us (own or rebuilt), or the company an imported skill came from. Anyone else counts as the community. */
export type Maker = "ai-blocks" | "anthropic" | "openai" | "community";
export const makerOf = (b: Block): Maker => {
  if (b.origin !== "imported") return "ai-blocks";
  const by = (b.source?.by ?? "").trim().toLowerCase();
  return by === "anthropic" ? "anthropic" : by === "openai" ? "openai" : "community";
};
export const MAKERS: { id: Maker; name: string }[] = [
  { id: "ai-blocks", name: "AI Blocks" }, { id: "anthropic", name: "Anthropic" }, { id: "openai", name: "OpenAI" }, { id: "community", name: "Community" },
];
/** "From Anthropic", "From OpenAI" or "From the community"; nothing for our own blocks. */
export const fromLabel = (b: Block) => { const m = makerOf(b); return m === "ai-blocks" ? "" : m === "community" ? "From the community" : `From ${m === "openai" ? "OpenAI" : "Anthropic"}`; };

// Memoised: typing in the search box redraws the list, not every card in it.
export const BlockCard = memo(function BlockCard({ b }: { b: Block }) {
  const kind = kindInfo(b);
  const fmt = formatOf(b);
  // Pointing at a card starts fetching its page, so the click opens it without a wait.
  const wake = () => { void loadPage(b.slug); };
  const view = b.category === "orchestrator" || b.type === "agent" ? `View the ${b.steps.length} steps` : `View the ${kind.name.toLowerCase()}`;
  return (
    <Link to={pathOf(b)} className="card" data-testid="block-card" data-slug={b.slug} data-kind={kind.id} onMouseEnter={wake} onFocus={wake}
      style={{ "--pat": `var(--pat-${taskOf(b).id})` } as CSSProperties}>
      <span className="meta"><span className="kind">{kind.name}</span>{b.thinking && <ThinkBars level={b.thinking} />}{b.origin === "imported" && <span className="from" data-testid="from-label">{fromLabel(b)}</span>}{b.warnings?.includes("scrapes") && <span className="from warn" data-testid="scrapes-label" title="Collects data from websites">Scrapes sites</span>}{paidService(b) && <span className="from warn" data-testid="paid-label" title={`Needs a paid ${paidService(b)} account`}>Needs a paid account</span>}<span className="type">{fmt ? (fmt === "image" ? "Image ad" : "Video ad") : taskOf(b).name}</span></span>
      <span className="nm">{b.type === "mind" && <PixelFace face={b.face} area={b.area} slug={b.slug} size={32} className="card-face" />}{b.name}</span>
      <Peek text={b.summary} />
      <span className="view">{view}<ArrowIcon size={12} /></span>
    </Link>
  );
});

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
