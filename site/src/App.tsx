import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowIcon, BlockCard, Drawer, Logo, SearchIcon, ThemeToggle, Toast } from "./ui";
import BlockDrawer from "./BlockDrawer";
import { type Block, type Catalogue, type Kind, KINDS, LEVELS, TASKS, cap, kindOf, taskOf, useCatalogue } from "./lib/data";
import { kits, queueForCanvas, useStore } from "./lib/store";

const Builder = lazy(() => import("./Builder")); // the canvas loads after the page is up

// Shown first: things most people can use this week.
const START_HERE = ["brand-knowledge-folder-from-website", "customer-language-to-angle-library", "ad-copy-brand-voice-check", "landing-page-copy-from-ad-and-facts", "video-ad-script-from-customer-research", "meta-ad-policy-check"];
const PAGE = 12;

function Header({ onKits }: { onKits: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const kitCount = useStore((s) => s.kits.length);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-in">
        <a href="#top" className="brand" aria-label="AI Building Blocks, back to top"><Logo />AI Building Blocks</a>
        <nav className="nav" aria-label="Sections">
          <a href="#library">Library</a>
          <a href="#build">Builder</a>
        </nav>
        <div className="header-end">
          <button className="btn btn-ghost btn-sm" onClick={onKits} data-testid="open-kits">My kits{kitCount > 0 && <span className="badge">{kitCount}</span>}</button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Library({ c, onOpen }: { c: Catalogue; onOpen: (s: string) => void }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<Kind | "all">("all");
  const [task, setTask] = useState("");
  const [level, setLevel] = useState("");
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => setLimit(PAGE), [q, kind, task, level]);

  // Counts on each tab and filter reflect the other choices, so a zero is never a surprise.
  const matching = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = (b: Block) => `${b.name} ${b.slug} ${b.summary} ${taskOf(b).name} ${b.inputs.map((p) => p.type).join(" ")} ${b.outputs.map((p) => p.type).join(" ")}`.toLowerCase().replace(/[_-]/g, " ");
    return c.blocks.filter((b) => (!level || b.level === level) && words.every((w) => hay(b).includes(w)));
  }, [c, q, level]);
  const byKind = (k: Kind | "all") => matching.filter((b) => (k === "all" || kindOf(b) === k) && (!task || taskOf(b).id === task));
  const order = (a: Block, b: Block) => Number(START_HERE.includes(b.slug)) - Number(START_HERE.includes(a.slug)) || KINDS.findIndex((k) => k.id === kindOf(a)) - KINDS.findIndex((k) => k.id === kindOf(b)) || a.name.localeCompare(b.name);
  const results = byKind(kind).sort(order);
  const forTasks = matching.filter((b) => kind === "all" || kindOf(b) === kind);
  const filtered = !!(q || task || level || kind !== "all");
  const clear = () => { setQ(""); setKind("all"); setTask(""); setLevel(""); };
  const activeKind = KINDS.find((k) => k.id === kind);

  return (
    <section className="section wrap" id="library" aria-label="Library">
      <label className="search big"><SearchIcon /><span className="visually-hidden">Search</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do you want to get done? Try “video script” or “landing page”" data-testid="library-search" /></label>
      <div className="kind-tabs" role="tablist" aria-label="Type">
        <button role="tab" aria-selected={kind === "all"} onClick={() => setKind("all")}>All<span className="count">{byKind("all").length}</span></button>
        {KINDS.map((k) => (
          <button key={k.id} role="tab" aria-selected={kind === k.id} onClick={() => setKind(k.id)} data-testid={`tab-${k.id}`}>{k.plural}<span className="count">{byKind(k.id).length}</span></button>
        ))}
      </div>
      <div className="filter-row">
        <div className="chips" role="group" aria-label="What do you want to do?">
          {TASKS.map((t) => {
            const n = forTasks.filter((b) => taskOf(b).id === t.id).length;
            if (!n && task !== t.id) return null;
            return <button key={t.id} className="chip-btn" aria-pressed={task === t.id} onClick={() => setTask(task === t.id ? "" : t.id)}>{t.name}<span className="count">{n}</span></button>;
          })}
        </div>
        <select className="select" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level">
          <option value="">Any level</option>
          {LEVELS.map((l) => <option key={l} value={l}>{cap(l)}</option>)}
        </select>
      </div>
      <div className="result-line">
        <span data-testid="result-count">{results.length} result{results.length === 1 ? "" : "s"}{activeKind ? ` · ${activeKind.what}` : ""}</span>
        {filtered && <button className="link-btn" onClick={clear}>Clear all</button>}
      </div>
      {results.length ? (
        <>
          <div className="grid">{results.slice(0, limit).map((b) => <BlockCard key={b.slug} b={b} onOpen={onOpen} />)}</div>
          {results.length > limit && <div className="more"><button className="btn btn-dark" onClick={() => setLimit(limit + 24)}>Show {Math.min(24, results.length - limit)} more</button></div>}
        </>
      ) : kind === "agent" && !q && !task && !level ? (
        <div className="empty"><h3 className="h3">Agents are coming next</h3><p>Until then, a <button className="link-btn" onClick={() => setKind("workflow")}>workflow</button> does the same job with you in charge of each step.</p></div>
      ) : (
        <div className="empty"><h3 className="h3">Nothing matches that yet</h3><p>Try fewer words, or <button className="link-btn" onClick={clear}>clear all</button>.</p></div>
      )}
    </section>
  );
}

function KitsDrawer({ c, onClose, onOpen, toBuilder }: { c: Catalogue; onClose: () => void; onOpen: (s: string) => void; toBuilder: (s: string[], n?: string) => void }) {
  const all = useStore((s) => s.kits);
  const [name, setName] = useState("");
  return (
    <Drawer label="My kits" top={<span className="mono">saved in this browser</span>} onClose={onClose}>
      <h2 className="title" style={{ marginTop: 0 }}>My kits</h2>
      <p className="small" style={{ marginBottom: 24 }}>Keep the things you use together. Open a kit in the builder to turn it into a workflow.</p>
      <form className="kit-new" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { kits.create(name); setName(""); } }}>
        <label className="search"><span className="visually-hidden">Kit name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name a new kit" /></label>
        <button className="btn btn-primary btn-sm" style={{ height: 40 }} type="submit">Create</button>
      </form>
      {all.length === 0 && <div className="empty"><h3 className="h3">No kits yet</h3><p>Open anything in the library and press Save to kit.</p></div>}
      {all.map((k) => (
        <div className="kit" key={k.id} data-testid="kit">
          <div className="kit-head">
            <input value={k.name} onChange={(e) => kits.rename(k.id, e.target.value)} aria-label="Kit name" />
            <button className="btn btn-primary btn-sm" disabled={!k.slugs.length} onClick={() => toBuilder(k.slugs, k.name)}>Open in builder</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm(`Delete the kit "${k.name}"? Everything in it stays in the library.`)) kits.remove(k.id); }}>Delete</button>
          </div>
          <div className="kit-items">
            {k.slugs.length === 0 && <span className="small">Empty</span>}
            {k.slugs.map((s) => <button key={s} onClick={() => onOpen(s)}>{c.bySlug[s]?.name ?? s}</button>)}
          </div>
        </div>
      ))}
    </Drawer>
  );
}

export default function App() {
  const c = useCatalogue();
  const [open, setOpen] = useState<string | null>(() => new URLSearchParams(location.search).get("block"));
  const [kitsOpen, setKitsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  // The open item lives in the URL (?block=slug) so it can be shared and survives a reload.
  useEffect(() => {
    const u = new URL(location.href);
    if (open) u.searchParams.set("block", open); else u.searchParams.delete("block");
    history.replaceState(null, "", u);
  }, [open]);
  const openBlock = useCallback((slug: string) => { setKitsOpen(false); setOpen(slug); }, []);
  const close = useCallback(() => setOpen(null), []);
  const closeKits = useCallback(() => setKitsOpen(false), []);
  const toBuilder = useCallback((slugs: string[], asNew?: string) => {
    queueForCanvas(slugs, asNew);
    setOpen(null); setKitsOpen(false);
    setTimeout(() => document.getElementById("build")?.scrollIntoView({ behavior: "smooth" }), 50);
    setToast(asNew ? `${asNew} is open in the builder` : "Added to the builder");
  }, []);

  return (
    <>
      <Header onKits={() => setKitsOpen(true)} />
      <main id="top">
        <section className="hero wrap">
          <h1 className="h1">Making humanity AI native</h1>
          <p className="lede">Save hours every week with prompts, skills and workflows that work in any AI. Do the work of ten, and become the 10x human.</p>
          <div className="hero-actions">
            <a href="#library" className="btn btn-primary">Browse the blocks <ArrowIcon /></a>
            <a href="#build" className="btn btn-dark">Build a workflow</a>
          </div>
        </section>

        {c ? <Library c={c} onOpen={openBlock} /> : <section className="section wrap" id="library"><p className="small">Loading…</p></section>}

        <section className="section wrap" id="build" aria-labelledby="build-h">
          <div className="sec-head">
            <h2 className="h2" id="build-h">Build a workflow</h2>
            <p className="lede">Add skills in the order you want, or start from a workflow. Then download one file your AI follows step by step.</p>
          </div>
          {c && <Suspense fallback={<div className="builder" />}><Builder c={c} toast={setToast} /></Suspense>}
        </section>
      </main>
      <footer className="footer">
        <div className="wrap footer-in">
          <span>AI Building Blocks · free, and what you save stays in your browser.</span>
          <nav aria-label="Footer"><a href="#library">Library</a><a href="#build">Builder</a><a href="https://github.com/KevCode-Absurd/ai-building-blocks">GitHub</a></nav>
        </div>
      </footer>
      {c && open && <BlockDrawer c={c} slug={open} onOpen={openBlock} onClose={close} toast={setToast} toBuilder={toBuilder} />}
      {c && kitsOpen && <KitsDrawer c={c} onClose={closeKits} onOpen={openBlock} toBuilder={toBuilder} />}
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
