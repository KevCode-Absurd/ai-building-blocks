import { spaceKey, spaces } from "./lib/space";
import { Suspense, lazy, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowIcon, BlockCard, Drawer, Logo, PixelIcon, SearchIcon, Select, ThemeToggle, Toast } from "./ui";
import { type Block, type Catalogue, type Kind, AREAS, areasOf, FUNCTIONS, FUNCTION_MOVED, KINDS, LEVELS, TASKS, cap, functionsOf, kindOf, pathOf, taskOf, useCatalogue } from "./lib/data";
import { kits, queueForCanvas, useStore } from "./lib/store";
import { Link, navigate, setSearch, useLocation } from "./lib/router";
import { BusinessDrawer, openBusiness, useBusinessOpener } from "./Business";
import { TailorDrawer, openTailor, useTailorOpener } from "./Tailor";
import { hasBusiness, useBusiness } from "./lib/business";

const Builder = lazy(() => import("./Builder")); // the canvas loads only when someone scrolls near it
const Globe = lazy(() => import("./Globe")); // drawn behind the hero, so the text never waits for it

/** Draws its children only once the spot is close to the screen (or the link points at it). */
function WhenNear({ id, children, fallback }: { id: string; children: ReactNode; fallback: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(() => location.hash === `#${id}`);
  useEffect(() => {
    if (near || !ref.current) return;
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) setNear(true); }, { rootMargin: "800px 0px" });
    io.observe(ref.current);
    const onHash = () => { if (location.hash === `#${id}`) setNear(true); };
    addEventListener("hashchange", onHash);
    return () => { io.disconnect(); removeEventListener("hashchange", onHash); };
  }, [near, id]);
  return near ? <>{children}</> : <div ref={ref}>{fallback}</div>;
}
// The other pages load after the home page has drawn, while the browser is idle, so a click opens them at once.
const PAGES = {
  block: () => import("./BlockPage"),
  guide: () => import("./HowItWorks"),
  tools: () => import("./tools/ToolsPage"),
  apps: () => import("./apps/AppsPage"),
  space: () => import("./space/SpacePage"),
  minds: () => import("./MindsPage"),
  builder: () => import("./Builder"),
};
const BlockPage = lazy(PAGES.block);
const HowItWorks = lazy(PAGES.guide);
const ToolsPage = lazy(PAGES.tools);
const AppsPage = lazy(PAGES.apps);
const SpacePage = lazy(PAGES.space);
const MindsPage = lazy(PAGES.minds);
/**
 * An in-page link (#install) scrolls smoothly, and a page loading in the background can cut that scroll short.
 * Once it has had time to land, finish the jump if the target still isn't on screen.
 */
function useHashLanding() {
  useEffect(() => {
    let t = 0;
    const land = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const el = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
        const top = el?.getBoundingClientRect().top;
        if (el && top !== undefined && (top < 0 || top > innerHeight * 0.6)) el.scrollIntoView({ behavior: "auto" });
      }, 900);
    };
    addEventListener("hashchange", land);
    return () => { window.clearTimeout(t); removeEventListener("hashchange", land); };
  }, []);
}

function useIdlePrefetch() {
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1200));
    const stop = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => Object.values(PAGES).forEach((load) => load().catch(() => {})), { timeout: 4000 });
    return () => stop(id);
  }, []);
}

// Shown first: things most people can use this week.
const START_HERE = ["fact-based-ad-copy-writer", "website-brand-brain-builder", "customer-buying-reasons-finder", "brand-voice-editor", "landing-page-30-point-checker", "video-ad-script-writer-from-customer-quotes", "meta-ads-compliance-checker"];
const PAGE = 12;
const KIND_PATHS: Record<string, Kind> = Object.fromEntries(KINDS.map((k) => [k.path, k.id]));

function Header({ onKits }: { onKits: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const kitCount = useStore((s) => s.kits.length);
  const biz = hasBusiness(useBusiness());
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-in">
        <Link to="/" className="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
        <nav className="nav" aria-label="Sections">
          <Link to="/how-it-works" className="nav-hiw">How it works</Link>
          <Link to="/#library">Library</Link>
          <Link to="/#build">Builder</Link>
          <Link to="/minds" data-testid="nav-minds">Minds</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/apps">Apps</Link>
          <Link to="/space" data-testid="nav-space">My space</Link>
        </nav>
        <div className="header-end">
          <button className="btn btn-ghost btn-sm" onClick={openBusiness} data-testid="open-business"><span>About me</span>{biz && <span className="dot" aria-label="filled in" />}</button>
          <button className="btn btn-ghost btn-sm" onClick={onKits} data-testid="open-kits"><span className="wide-only">My kits</span><span className="narrow-only">Kits</span>{kitCount > 0 && <span className="badge">{kitCount}</span>}</button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

type Filters = { q: string; area: string; fn: string; task: string; kind: Kind | "all"; level: string };
const NONE: Filters = { q: "", area: "", fn: "", task: "", kind: "all", level: "" };

function Library({ c }: { c: Catalogue }) {
  const { search } = useLocation();
  const [f, setF] = useState<Filters>(() => {
    const task = TASKS.some((t) => t.id === search.get("job")) ? search.get("job")! : "";
    const fnId = FUNCTION_MOVED[search.get("fn") ?? ""] ?? search.get("fn");
    const fn = FUNCTIONS.find((x) => x.id === fnId)?.id ?? (task ? FUNCTIONS.find((x) => x.tasks.includes(task))!.id : "");
    const kind = KINDS.some((k) => k.id === search.get("kind")) ? (search.get("kind") as Kind) : "all";
    const area = AREAS.some((a) => a.id === search.get("area")) ? search.get("area")! : "";
    return { ...NONE, q: search.get("q") ?? "", area, fn, task, kind, level: search.get("level") ?? "" };
  });
  const set = (patch: Partial<Filters>) => setF((x) => ({ ...x, ...patch }));
  const [limit, setLimit] = useState(PAGE);
  // Press / anywhere to jump to the search box.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      e.preventDefault();
      const el = document.querySelector<HTMLInputElement>('[data-testid="library-search"]');
      el?.focus(); el?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  useEffect(() => { setLimit(PAGE); setSearch({ q: f.q, area: f.area, fn: f.fn, job: f.task, kind: f.kind === "all" ? "" : f.kind, level: f.level }); }, [f]);

  // Every count reflects all the other choices, so a zero is never a surprise.
  // The list and the counts follow the typing a beat behind, so the search box never waits on them.
  const df = useDeferredValue(f);
  const words = df.q.toLowerCase().split(/\s+/).filter(Boolean);
  const hays = useMemo(() => new Map(c.blocks.map((b) => [b.slug, `${b.name} ${b.slug} ${b.summary} ${b.headline} ${taskOf(b).name} ${functionsOf(b).map((x) => x.name).join(" ")}`.toLowerCase().replace(/[_-]/g, " ")])), [c]);
  const hay = (b: Block) => hays.get(b.slug)!;
  const tests: Record<keyof Filters, (b: Block, v: string) => boolean> = {
    q: (b) => words.every((w) => hay(b).includes(w)),
    area: (b, v) => !v || areasOf(b).includes(v),
    fn: (b, v) => !v || functionsOf(b).some((x) => x.id === v),
    task: (b, v) => !v || b.task === v,
    kind: (b, v) => v === "all" || kindOf(b) === v,
    level: (b, v) => !v || b.level === v,
  };
  const keys = Object.keys(tests) as (keyof Filters)[];
  // Counts are worked out once per settled search, not on every redraw.
  const counted = useMemo(() => new Map<string, number>(), [c, df]); // eslint-disable-line react-hooks/exhaustive-deps
  const count = (over: Partial<Filters>) => {
    const key = JSON.stringify(over);
    if (!counted.has(key)) { const g = { ...df, ...over }; counted.set(key, c.blocks.filter((b) => keys.every((k) => tests[k](b, g[k] as string))).length); }
    return counted.get(key)!;
  };
  const order = (a: Block, b: Block) => Number(START_HERE.includes(b.slug)) - Number(START_HERE.includes(a.slug)) || Number(!!b.headline) - Number(!!a.headline) || KINDS.findIndex((k) => k.id === kindOf(a)) - KINDS.findIndex((k) => k.id === kindOf(b)) || a.name.localeCompare(b.name);
  const results = useMemo(() => c.blocks.filter((b) => keys.every((k) => tests[k](b, df[k] as string))).sort(order), [c, df]); // eslint-disable-line react-hooks/exhaustive-deps
  const filtered = JSON.stringify(f) !== JSON.stringify(NONE);
  const clear = () => setF(NONE);
  const fn = FUNCTIONS.find((x) => x.id === f.fn);
  const activeTask = TASKS.find((t) => t.id === f.task);
  const pickFn = (id: string) => set({ fn: f.fn === id ? "" : id, task: "" });
  const area = AREAS.find((a) => a.id === f.area);
  // An area shows its own groups; areas that so far hold only minds show the minds group.
  const fnsShown = area ? FUNCTIONS.filter((x) => area.fns.includes(x.id) || (x.id === "minds" && count({ area: area.id, fn: "minds", task: "" }) > 0)) : FUNCTIONS;

  return (
    <section className="section wrap" id="library" aria-label="Library">
      <label className="search big"><SearchIcon /><span className="visually-hidden">Search</span><input value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="What do you want to get done?" data-testid="library-search" /><kbd className="kbd" aria-hidden="true">/</kbd></label>

      <div className="areas" role="group" aria-label="Pick an area" data-testid="areas">
        <button className="chip" aria-pressed={!f.area} onClick={() => set({ area: "", fn: "", task: "" })}>Everything</button>
        {AREAS.map((a) => {
          const n = count({ area: a.id, fn: "", task: "" });
          return <button key={a.id} className="chip" aria-pressed={f.area === a.id} disabled={!n && f.area !== a.id} onClick={() => set({ area: f.area === a.id ? "" : a.id, fn: "", task: "" })} data-testid={`area-${a.id}`}>{a.name}<span className="count">{n}</span></button>;
        })}
      </div>
      <h2 className="fn-h">Pick the work you do, or want done</h2>
      <div className="fns" role="group" aria-label="Pick the work">
        {fnsShown.map((x) => {
          const n = count({ fn: x.id, task: "" });
          return (
            <button key={x.id} className="fn" aria-pressed={f.fn === x.id} disabled={!n && f.fn !== x.id} onClick={() => pickFn(x.id)} data-testid={`fn-${x.id}`}>
              <span className="fn-glyph" aria-hidden="true"><PixelIcon id={x.id} /></span>
              <span className="fn-name">{x.name}</span>
              <span className="fn-line">{x.line}</span>
              <span className="count">{String(n).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      {fn && (
        <div className="subjobs" role="group" aria-label={`Jobs under ${fn.name}`} data-testid="subjobs">
          <button className="chip" aria-pressed={!f.task} onClick={() => set({ task: "" })}>Everything<span className="count">{count({ task: "" })}</span></button>
          {fn.tasks.map((id) => {
            const t = TASKS.find((x) => x.id === id)!;
            const n = count({ task: id });
            return <button key={id} className="chip" aria-pressed={f.task === id} disabled={!n && f.task !== id} onClick={() => set({ task: f.task === id ? "" : id })} data-testid={`job-${id}`}>{t.name}<span className="count">{n}</span></button>;
          })}
        </div>
      )}

      <div className="filter-row">
        <div className="kind-tabs" role="tablist" aria-label="Type">
          <button role="tab" aria-selected={f.kind === "all"} onClick={() => set({ kind: "all" })}>All<span className="count">{count({ kind: "all" })}</span></button>
          {KINDS.map((k) => (
            <button key={k.id} role="tab" aria-selected={f.kind === k.id} onClick={() => set({ kind: k.id })} data-testid={`tab-${k.id}`}>{k.plural}<span className="count">{count({ kind: k.id })}</span></button>
          ))}
        </div>
        <div className="filters">
          <Select label="Level" value={f.level} onChange={(v) => set({ level: v })} testId="filter-level"
            options={[{ value: "", label: "Any", count: count({ level: "" }) }, ...LEVELS.map((l) => ({ value: l, label: cap(l), count: count({ level: l }) }))]} />
        </div>
      </div>
      <div className="result-line">
        <span data-testid="result-count">{results.length} result{results.length === 1 ? "" : "s"}{activeTask ? ` for “${activeTask.name}”` : fn ? ` for “${fn.name}”` : ""}{f.kind !== "all" ? `. ${KINDS.find((k) => k.id === f.kind)!.what}` : ""}</span>
        {filtered && <button className="link-btn" onClick={clear}>Clear all</button>}
      </div>
      {results.length ? (
        <>
          <div className="grid">{results.slice(0, limit).map((b) => <BlockCard key={b.slug} b={b} />)}</div>
          {results.length > limit && <div className="more"><button className="btn btn-dark" onClick={() => setLimit(limit + 24)}>Show {Math.min(24, results.length - limit)} more</button></div>}
        </>
      ) : (
        <div className="empty"><h3 className="h3">Nothing matches that yet</h3><p>Try fewer words, or <button className="link-btn" onClick={clear}>clear all</button>.</p></div>
      )}
    </section>
  );
}

function KitsDrawer({ c, onClose, toBuilder, toast }: { c: Catalogue; onClose: () => void; toBuilder: (s: string[], n?: string) => void; toast: (m: string) => void }) {
  const all = useStore((s) => s.kits);
  const kitToSpace = async (k: { id: string; name: string; slugs: string[] }) => {
    if (!spaceKey()) { onClose(); navigate("/space"); return; }
    try { await spaces.add({ kind: "kit", title: k.name, summary: `${k.slugs.length} blocks`, data: { slugs: k.slugs, localId: k.id } }); toast(`Saved “${k.name}” to your space`); }
    catch (e) { toast(e instanceof Error ? e.message : "That didn't save. Try again."); }
  };
  const [name, setName] = useState("");
  return (
    <Drawer label="My kits" top={<span className="mono">saved in this browser</span>} onClose={onClose}>
      <h2 className="title" style={{ marginTop: 0 }}>My kits</h2>
      <p className="small" style={{ marginBottom: 24 }}>Keep the skills you use together. Open a kit in the builder to turn it into a workflow.</p>
      <form className="kit-new" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { kits.create(name); setName(""); } }}>
        <label className="search"><span className="visually-hidden">Kit name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name a new kit" /></label>
        <button className="btn btn-primary btn-sm" style={{ height: 40 }} type="submit">Create</button>
      </form>
      {all.length === 0 && <div className="empty"><h3 className="h3">No kits yet</h3><p>Open any skill and press Save to kit.</p></div>}
      {all.map((k) => (
        <div className="kit" key={k.id} data-testid="kit">
          <div className="kit-head">
            <input value={k.name} onChange={(e) => kits.rename(k.id, e.target.value)} aria-label="Kit name" />
            <button className="btn btn-primary btn-sm" disabled={!k.slugs.length} onClick={() => toBuilder(k.slugs, k.name)}>Open in the builder</button>
            <button className="btn btn-ghost btn-sm" disabled={!k.slugs.length} onClick={() => kitToSpace(k)} data-testid="kit-to-space">Save to my space</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm(`Delete the kit "${k.name}"? Everything in it stays in the library.`)) kits.remove(k.id); }}>Delete</button>
          </div>
          <div className="kit-items">
            {k.slugs.length === 0 && <span className="small">Empty</span>}
            {k.slugs.map((s) => c.bySlug[s] ? <Link key={s} to={pathOf(c.bySlug[s])} onClick={onClose}>{c.bySlug[s].name}</Link> : <span key={s}>{s}</span>)}
          </div>
        </div>
      ))}
    </Drawer>
  );
}

/** Types the subhead out like a terminal. The full sentence is there from the start for screen readers,
 *  and the untyped part holds its space so nothing moves. Reduced motion shows it at once. */
function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(() => (matchMedia("(prefers-reduced-motion: reduce)").matches ? text.length : 0));
  useEffect(() => {
    if (n >= text.length) return;
    const prev = text[n - 1];
    const t = setTimeout(() => setN(n + 1), n === 0 ? 650 : prev === "." ? 420 : prev === "," ? 220 : 22 + Math.random() * 34);
    return () => clearTimeout(t);
  }, [n, text]);
  return (
    <p className="lede typed" data-done={n >= text.length}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}<span className="cursor" /><span className="ghost">{text.slice(n)}</span></span>
    </p>
  );
}

function Home({ c, toast }: { c: Catalogue | null; toast: (m: string) => void }) {
  // A link like /#library opened fresh: jump there once the library has drawn.
  useEffect(() => {
    if (!c || !location.hash) return;
    const id = location.hash.slice(1);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [c]);
  return (
    <main id="top">
      <section className="hero">
        <Suspense fallback={null}><Globe /></Suspense>
        <div className="wrap hero-in">
          <h1 className="h1">Making humanity AI native</h1>
          <Typewriter text="Stop doing the work AI could do for you. Save hours every week, and spend them on the work only you can do. Or at the beach (we won't tell)." />
          <div className="hero-actions">
            <Link to="/#library" className="btn btn-primary">Browse the blocks <ArrowIcon /></Link>
            <Link to="/#build" className="btn btn-dark">Build a workflow</Link>
            <Link to="/how-it-works" className="btn btn-line" data-testid="how-it-works-link">How it works</Link>
          </div>
        </div>
      </section>

      {c ? <Library c={c} /> : <section className="section wrap" id="library"><p className="small">Loading…</p></section>}

      <section className="section wrap" id="build" aria-labelledby="build-h">
        <div className="sec-head">
          <h2 className="h2" id="build-h">Line up skills once, and your AI does the whole job</h2>
          <p className="lede">Add skills in the order they should run, or start from a ready workflow. Download one folder, upload it to Claude, ChatGPT or any AI that reads files, and it works through every step for you.</p>
        </div>
        <WhenNear id="build" fallback={<div className="builder" />}>{c && <Suspense fallback={<div className="builder" />}><Builder c={c} toast={toast} /></Suspense>}</WhenNear>
      </section>
    </main>
  );
}

export default function App() {
  const c = useCatalogue();
  useIdlePrefetch();
  useHashLanding();
  const { path, search } = useLocation();
  const [kitsOpen, setKitsOpen] = useState(false);
  const [bizOpen, setBizOpen] = useState(false);
  const closeBiz = useCallback(() => setBizOpen(false), []);
  const [tailor, setTailor] = useState<string | null>(null);
  const closeTailor = useCallback(() => setTailor(null), []);
  useTailorOpener(useCallback((s: string) => { setKitsOpen(false); setBizOpen(false); setTailor(s); }, []));
  useBusinessOpener(useCallback(() => { setKitsOpen(false); setBizOpen(true); }, []));
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const closeKits = useCallback(() => setKitsOpen(false), []);

  // Old links (/?block=slug) and a page opened under the wrong type go to the right address.
  const parts = path.split("/").filter(Boolean);
  const pageSlug = parts.length === 2 && KIND_PATHS[parts[0]] ? parts[1] : null;
  useEffect(() => {
    if (!c) return;
    // Blocks were renamed to say what they get you; their old names still lead to them.
    const now = (s: string | null) => (s ? c.bySlug[s] ?? c.bySlug[c.renamed?.[s] ?? ""] : undefined);
    const old = now(search.get("block"));
    const here = now(pageSlug);
    if (old) navigate(pathOf(old), { replace: true });
    else if (here && pathOf(here) !== path) navigate(pathOf(here), { replace: true });
  }, [c, search, pageSlug, path]);

  // One address per page for search engines and shared links.
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `https://useaiblocks.com${path}`;
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", link.href);
  }, [path]);

  const toBuilder = useCallback((slugs: string[], asNew?: string) => {
    queueForCanvas(slugs, asNew);
    setKitsOpen(false);
    navigate("/#build");
    setToast(asNew ? `${asNew} is open in the builder` : "Added to the builder");
  }, []);

  return (
    <>
      <Header onKits={() => setKitsOpen(true)} />
      {path === "/tools" || path.startsWith("/tools/") ? (
        <Suspense fallback={<main className="wrap bp-hero"><p className="small">Loading…</p></main>}><ToolsPage path={path} toast={setToast} /></Suspense>
      ) : path === "/apps" || path.startsWith("/apps/") ? (
        <Suspense fallback={<main className="wrap bp-hero"><p className="small">Loading…</p></main>}><AppsPage path={path} toast={setToast} /></Suspense>
      ) : path === "/space" || path === "/people" || path.startsWith("/s/") ? (
        <Suspense fallback={<main className="wrap bp-hero"><p className="small">Loading…</p></main>}><SpacePage path={path} c={c} toast={setToast} /></Suspense>
      ) : path === "/minds" ? (
        c ? <Suspense fallback={<main className="wrap bp-hero"><p className="small">Loading…</p></main>}><MindsPage c={c} toBuilder={toBuilder} /></Suspense> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
      ) : path === "/how-it-works" ? (
        <Suspense fallback={<main className="wrap bp-hero"><p className="small">Loading…</p></main>}><HowItWorks toast={setToast} /></Suspense>
      ) : pageSlug ? (
        c ? <Suspense fallback={<main className="wrap bp-hero"><p className="small">Loading…</p></main>}><BlockPage c={c} slug={pageSlug} toast={setToast} toBuilder={toBuilder} /></Suspense> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
      ) : (
        <Home c={c} toast={setToast} />
      )}
      <footer className="footer">
        <div className="wrap footer-in">
          <span>© 2026 AI Blocks · useaiblocks.com</span>
          <nav aria-label="More">
            <Link to="/tools">Mini tools</Link>
            <Link to="/apps">Apps</Link>
            <Link to="/apps/starter-pack">App starter pack</Link>
            <Link to="/space">My space</Link>
            <Link to="/people">From people</Link>
            <Link to="/how-it-works">How it works</Link>
            <button className="link-btn" onClick={() => openTailor()} data-testid="tailor-footer">Get a skill tailored for you</button>
          </nav>
        </div>
      </footer>
      {bizOpen && <BusinessDrawer onClose={closeBiz} toast={setToast} />}
      {tailor !== null && <TailorDrawer skill={tailor} onClose={closeTailor} toast={setToast} />}
      {c && kitsOpen && <KitsDrawer c={c} onClose={closeKits} toBuilder={toBuilder} toast={setToast} />}
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
