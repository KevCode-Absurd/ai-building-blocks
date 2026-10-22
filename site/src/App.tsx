import { spaceKey, spaces } from "./lib/space";
import FeaturedTools, { FeaturedWorkflows } from "./tools/FeaturedTools";
import { syncPageMetadata } from "./lib/page-metadata";
import { Suspense, createContext, lazy, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ArrowIcon, BlockCard, Drawer, Logo, SearchIcon, Select, ThemeToggle, Toast } from "./ui";
import { type Block, type Catalogue, type Kind, AREAS, areasOf, FUNCTIONS, FUNCTION_MOVED, KINDS, LEVELS, TASKS, cap, functionsOf, kindOf, loadPage, pathOf, taskOf, useCatalogue } from "./lib/data";
import { kits, queueForCanvas, useStore } from "./lib/store";
import { Link, navigate, setPrefetch, setSearch, useLocation } from "./lib/router";
import { BusinessDrawer, openBusiness, useBusinessOpener } from "./Business";
import { TailorDrawer, useTailorOpener } from "./Tailor";
import { hasBusiness, useBusiness } from "./lib/business";
import { STARTER_PATHS, isAudienceStarter, starterFor, starterTemplate } from "./lib/audience-starters";
import { infoPage } from "./lib/site-info.mjs";
import SiteFooter from "./SiteFooter";

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
  aitools: () => import("./aitools/AiToolsPage"),
  traction: () => import("./TractionPage"),
  apps: () => import("./apps/AppsPage"),
  space: () => import("./space/SpacePage"),
  minds: () => import("./MindsPage"),
  builder: () => import("./Builder"),
  intake: () => import("./IntakePage"),
  compose: () => import("./ComposePage"),
  info: () => import("./InfoPage"),
};
/** Which section's code a link opens, if it isn't the home page or a block. */
function sectionOf(to: string): keyof typeof PAGES | null {
  const path = to.split(/[?#]/)[0];
  if (path === "/tools/growth-channel-planner") return "traction";
  if (infoPage(path)) return "info";
  if (path === "/tools" || path.startsWith("/tools/")) return "tools";
  if (path === "/ai-tools" || path.startsWith("/ai-tools/")) return "aitools";
  if (path === "/traction") return "traction";
  if (path === "/apps" || path.startsWith("/apps/")) return "apps";
  if (path === "/space" || path === "/people" || path.startsWith("/s/")) return "space";
  if (path === "/minds") return "minds";
  if (path === "/from-a-source") return "intake";
  if (path === "/compose") return "compose";
  if (path === "/how-it-works") return "guide";
  return null;
}
// The readiness marker lives inside the resolved lazy component: Preact can
// commit a sibling effect while a Suspense fallback is still on screen.
const StartupContext = createContext(false);
function startupPage<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  return lazy(async () => {
    const { default: Page } = await load();
    return { default: (props: P) => <><Page {...props} /><StartupReady /></> };
  });
}
const BlockPage = startupPage(PAGES.block);
const HowItWorks = startupPage(PAGES.guide);
const ToolsPage = startupPage(PAGES.tools);
const AiToolsPage = startupPage(PAGES.aitools);
const TractionPage = startupPage(PAGES.traction);
const AppsPage = startupPage(PAGES.apps);
const SpacePage = startupPage(PAGES.space);
const MindsPage = startupPage(PAGES.minds);
const IntakePage = startupPage(PAGES.intake);
const ComposePage = startupPage(PAGES.compose);
const InfoPage = startupPage(PAGES.info);
/** Finish an anchor landing once. Any user scroll cancels the correction. */
function useHashLanding() {
  useEffect(() => {
    let timer = 0;
    const cancel = () => window.clearTimeout(timer);
    const land = () => {
      cancel();
      timer = window.setTimeout(() => {
        const id = location.hash.slice(1);
        const el = id ? document.getElementById(decodeURIComponent(id)) : null;
        if (el && Math.abs(el.getBoundingClientRect().top) > 80) el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
      }, 900);
    };
    const key = (e: KeyboardEvent) => { if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) cancel(); };
    addEventListener("hashchange", land);
    addEventListener("wheel", cancel, { passive: true });
    addEventListener("touchstart", cancel, { passive: true });
    addEventListener("pointerdown", cancel, { passive: true });
    addEventListener("keydown", key);
    return () => {
      cancel(); removeEventListener("hashchange", land); removeEventListener("wheel", cancel);
      removeEventListener("touchstart", cancel); removeEventListener("pointerdown", cancel); removeEventListener("keydown", key);
    };
  }, []);
}

function useIdlePrefetch() {
  useEffect(() => {
    // Pointing at a link warms what it opens: a block's page file, or the code for that section.
    setPrefetch((to) => {
      const m = /^\/(skills|prompts|workflows|agents|minds)\/([a-z0-9-]+)/.exec(to);
      if (m) { void loadPage(m[2]); return; }
      const page = sectionOf(to);
      if (page) void PAGES[page]().catch(() => {});
    });
    // On data saver or a slow phone line, pages load when they're opened instead.
    const net = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (net?.saveData || /(^|-)2g$/.test(net?.effectiveType ?? "")) return;
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1200));
    const stop = window.cancelIdleCallback ?? window.clearTimeout;
    // Warm the common next page on home. Other sections load on pointer intent;
    // loading every calculator and app while a page opens competes with its data.
    const ids: number[] = [];
    ids.push(idle(() => {
      if (location.pathname === "/") PAGES.block().catch(() => {});
    }, { timeout: 4000 }));
    return () => ids.forEach(stop);
  }, []);
}

// Shown first: things most people can use this week.
const byName = new Intl.Collator("en");
const START_HERE = ["website-brand-brain-builder", "landing-page-30-point-checker", "ad-opening-line-batch-writer", "ad-claim-proof-gap-finder", "plain-english-editor", "rough-notes-to-minutes-writer", "executive-email-draft", "week-plan-from-task-list-maker", "customer-buying-reasons-finder", "faq-page-from-questions-writer", "code-explainer-for-newcomers", "bug-evidence-plan-writer", "copilot-eval-driven-dev", "copilot-gtm-0-to-1-launch", "advisory-council", "fact-based-ad-copy-writer"];
const startRank = (slug: string) => { const index = START_HERE.indexOf(slug); return index < 0 ? START_HERE.length : index; };
const PAGE = 16;
const KIND_PATHS: Record<string, Kind> = Object.fromEntries(KINDS.map((k) => [k.path, k.id]));

function Header({ onKits }: { onKits: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const kitCount = useStore((s) => s.kits.length);
  const biz = hasBusiness(useBusiness());
  // Phones get the sections behind a Menu button; it closes again on every page change.
  const [menu, setMenu] = useState(false);
  const { path } = useLocation();
  const [more, setMore] = useState(false);
  useEffect(() => { setMenu(false); setMore(false); }, [path]);
  useEffect(() => {
    if (!more) return;
    const off = () => setMore(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    document.addEventListener("click", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", off); document.removeEventListener("keydown", esc); };
  }, [more]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-in">
        <Link to="/" className="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
        <nav className={`nav${menu ? " open" : ""}`} id="site-nav" aria-label="Sections" onClick={() => setMenu(false)}>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/#library">Library</Link>
          <Link to="/#build">Builder</Link>
          <Link to="/compose" data-testid="nav-compose">Compose workflow</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/apps">Apps</Link>
          <span className={`nav-more${more ? " open" : ""}`} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="nav-more-btn" aria-expanded={more} aria-controls="nav-more-list" onClick={() => setMore((m) => !m)} data-testid="nav-more">More <span aria-hidden="true">▾</span></button>
            <span className="nav-more-list" id="nav-more-list" onClick={() => { setMore(false); setMenu(false); }}>
              <Link to="/ai-tools" data-testid="nav-ai-tools">AI tools</Link>
              <Link to="/tools/growth-channel-planner">Growth planner</Link>
              <Link to="/from-a-source" data-testid="nav-intake">Create skills from content</Link>
              <Link to="/space" data-testid="nav-space">My space</Link>
              <button type="button" className="link-btn" onClick={onKits} data-testid="open-kits">My kits{kitCount > 0 && <span className="badge">{kitCount}</span>}</button>
              <Link to="/support">Help & contact</Link>
            </span>
          </span>
        </nav>
        <div className="header-end">
          <button className="btn btn-ghost btn-sm" onClick={openBusiness} data-testid="open-business"><span className="context-full">Your context</span><span className="context-short">Context</span>{biz && <span className="dot" aria-label="filled in" />}</button>
          <Link to="/minds" className="btn btn-ghost btn-sm" data-testid="nav-minds">Minds</Link>
          <ThemeToggle />
          <button className="btn btn-ghost btn-sm menu-btn" aria-expanded={menu} aria-controls="site-nav" onClick={() => setMenu((m) => !m)} data-testid="menu-btn">{menu ? "Close" : "Menu"}</button>
        </div>
      </div>
    </header>
  );
}

type Filters = { q: string; audience: string; area: string; fn: string; task: string; kind: Kind | "all"; level: string };
const NONE: Filters = { q: "", audience: "", area: "", fn: "", task: "", kind: "all", level: "" };

function Library({ c }: { c: Catalogue }) {
  const { search } = useLocation();
  const [f, setF] = useState<Filters>(() => {
    const task = TASKS.some((t) => t.id === search.get("job")) ? search.get("job")! : "";
    const fnId = FUNCTION_MOVED[search.get("fn") ?? ""] ?? search.get("fn");
    const fn = FUNCTIONS.find((x) => x.id === fnId)?.id ?? (task ? FUNCTIONS.find((x) => x.tasks.includes(task))!.id : "");
    const kind = KINDS.some((k) => k.id === search.get("kind")) ? (search.get("kind") as Kind) : "all";
    const area = AREAS.some((a) => a.id === search.get("area")) ? search.get("area")! : "";
    return { ...NONE, q: search.get("q") ?? "", audience: starterFor(search.get("audience") ?? "")?.id ?? "", area, fn, task, kind, level: LEVELS.some((l) => l === search.get("level")) ? search.get("level")! : "" };
  });
  const set = (patch: Partial<Filters>) => setF((x) => ({ ...x, ...patch }));
  const [limit, setLimit] = useState(PAGE);
  const [moreFilters, setMoreFilters] = useState(() => !!(f.fn || f.task || f.level));
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
  useEffect(() => { setLimit(PAGE); setSearch({ q: f.q, audience: f.audience, area: f.area, fn: f.fn, job: f.task, kind: f.kind === "all" ? "" : f.kind, level: f.level, by: "" }); }, [f]);

  // Every count reflects all the other choices, so a zero is never a surprise.
  // The list and the counts follow the typing a beat behind, so the search box never waits on them.
  const df = useDeferredValue(f);
  const words = df.q.toLowerCase().replace(/[_-]/g, " ").split(/\s+/).filter(Boolean);
  const hays = useMemo(() => new Map(c.blocks.map((b) => [b.slug, `${b.name} ${(b.aliases ?? []).join(" ")} ${b.slug} ${b.summary} ${b.headline} ${taskOf(b).name} ${functionsOf(b).map((x) => x.name).join(" ")}`.toLowerCase().replace(/[_-]/g, " ")])), [c]);
  const hay = (b: Block) => hays.get(b.slug)!;
  // Each block's areas, groups and kind, worked out once, so a few thousand blocks still count fast.
  const facts = useMemo(() => new Map(c.blocks.map((b) => [b.slug, { areas: new Set(areasOf(b)), fns: new Set(functionsOf(b).map((x) => x.id)), kind: kindOf(b) }])), [c]);
  const fact = (b: Block) => facts.get(b.slug)!;
  const tests: Record<keyof Filters, (b: Block, v: string) => boolean> = {
    q: (b) => words.every((w) => hay(b).includes(w)),
    audience: (b, v) => isAudienceStarter(b.slug, v),
    area: (b, v) => !v || fact(b).areas.has(v),
    fn: (b, v) => !v || fact(b).fns.has(v),
    task: (b, v) => !v || b.task === v,
    kind: (b, v) => v === "all" || fact(b).kind === v,
    level: (b, v) => !v || b.level === v,
  };
  const keys = Object.keys(tests) as (keyof Filters)[];
  // Counts are worked out once per settled search, not on every redraw.
  const counted = useMemo(() => new Map<string, number>(), [c, df]); // eslint-disable-line react-hooks/exhaustive-deps
  // The counts never change the search words, so the search runs once and every count works on what it matched.
  const matched = useMemo(() => (words.length ? c.blocks.filter((b) => tests.q(b, df.q)) : c.blocks), [c, df]); // eslint-disable-line react-hooks/exhaustive-deps
  const facets = keys.filter((k) => k !== "q");
  const count = (over: Partial<Filters>) => {
    const key = JSON.stringify(over);
    if (!counted.has(key)) { const g = { ...df, ...over }; counted.set(key, matched.filter((b) => facets.every((k) => tests[k](b, g[k] as string))).length); }
    return counted.get(key)!;
  };
  const order = (a: Block, b: Block) => startRank(a.slug) - startRank(b.slug) || Number(!!b.headline) - Number(!!a.headline) || KINDS.findIndex((k) => k.id === fact(a).kind) - KINDS.findIndex((k) => k.id === fact(b).kind) || byName.compare(a.name, b.name);
  const results = useMemo(() => c.blocks.filter((b) => keys.every((k) => tests[k](b, df[k] as string))).sort(order), [c, df]); // eslint-disable-line react-hooks/exhaustive-deps
  const filtered = JSON.stringify(f) !== JSON.stringify(NONE);
  const clear = () => setF(NONE);
  const fn = FUNCTIONS.find((x) => x.id === f.fn);
  const activeTask = TASKS.find((t) => t.id === f.task);
  const area = AREAS.find((a) => a.id === f.area);
  const audience = starterFor(f.audience);
  // An area shows its own groups; areas that so far hold only minds show the minds group.
  const fnsShown = area ? FUNCTIONS.filter((x) => area.fns.includes(x.id) || x.id === f.fn || (x.id === "minds" && count({ area: area.id, fn: "minds", task: "" }) > 0)) : FUNCTIONS;

  const extraFilters = [f.fn, f.task, f.level].filter(Boolean).length;
  const formats: { id: Kind | "all"; name: string; line: string }[] = [
    { id: "all", name: "All", line: "Explore the library" },
    { id: "prompt", name: "Prompts", line: "Paste into a chat" },
    { id: "skill", name: "Skills", line: "Reuse a proven method" },
    { id: "workflow", name: "Workflows", line: "Connect several steps" },
    { id: "agent", name: "Agents", line: "Delegate a repeatable job" },
    { id: "mind", name: "Minds", line: "Borrow an expert's thinking" },
  ];

  return (
    <section className="section wrap" id="library" aria-label="Library">
      <div className="library-search-head"><h2>What do you want to get done?</h2><Link to="/how-it-works">How it works <span aria-hidden="true">→</span></Link></div>
      <label className="search big"><SearchIcon /><span className="visually-hidden">Search</span><input value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search for a job, such as writing an ad or fixing code" data-testid="library-search" /><kbd className="kbd" aria-hidden="true">/</kbd></label>

      <div className="library-formats" role="tablist" aria-label="Format" onKeyDown={(e) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        const index = formats.findIndex((k) => k.id === f.kind);
        const next = e.key === "Home" ? 0 : e.key === "End" ? formats.length - 1 : (index + (e.key === "ArrowRight" ? 1 : -1) + formats.length) % formats.length;
        set({ kind: formats[next].id });
        e.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
      }}>
        {formats.map((k) => <button key={k.id} id={`format-${k.id}`} type="button" role="tab" aria-selected={f.kind === k.id} aria-controls="library-results" tabIndex={f.kind === k.id ? 0 : -1} onClick={() => set({ kind: k.id })} data-testid={`tab-${k.id}`}>
          <span>{k.name}</span><small>{k.line}</small>
        </button>)}
      </div>
      <div className="library-filters">
        <Select label="Start with" value={f.audience} onChange={(v) => setF({ ...NONE, audience: v })} testId="filter-audience"
          options={[{ value: "", label: "Full library" }, ...STARTER_PATHS.map((a) => ({ value: a.id, label: a.name }))]} />
        <Select label="Domain" value={f.area} onChange={(v) => set({ area: v, fn: "", task: "" })} testId="filter-domain"
          options={[{ value: "", label: "All domains", count: count({ area: "", fn: "", task: "" }) }, ...AREAS.map((a) => ({ value: a.id, label: a.name, count: count({ area: a.id, fn: "", task: "" }) }))]} />
        <button type="button" className="more-filters-btn" aria-expanded={moreFilters} aria-controls="library-more-filters" onClick={() => setMoreFilters((v) => !v)} data-testid="more-filters">More filters{extraFilters > 0 && <span className="badge">{extraFilters}</span>} <span aria-hidden="true">{moreFilters ? "−" : "+"}</span></button>
      </div>
      {audience && <div className="audience-guide small" data-testid="audience-guide">
        <p><strong>{audience.goal}</strong> These are starter picks. Choose Full library to explore every block.</p>
        <p>Bring: {audience.bring}</p>
        <p><button className="link-btn" onClick={openBusiness}>Save your context</button> · <a href={starterTemplate(audience.id)} download>Download a context template</a></p>
        {audience.id === "enterprise" && <p>These packs support your work in your chosen AI tool. Team access controls, company system connections and audit storage need your own implementation.</p>}
      </div>}
      {moreFilters && <div className="library-more-filters" id="library-more-filters" role="group" aria-label="More filters">
        <Select label="Work" value={f.fn} onChange={(v) => set({ fn: v, task: "" })} testId="filter-work"
          options={[{ value: "", label: "All work", count: count({ fn: "", task: "" }) }, ...fnsShown.map((x) => ({ value: x.id, label: x.name, count: count({ fn: x.id, task: "" }) }))]} />
        {fn && <Select label="Task" value={f.task} onChange={(v) => set({ task: v })} testId="filter-task"
          options={[{ value: "", label: "All tasks", count: count({ task: "" }) }, ...fn.tasks.map((id) => ({ value: id, label: TASKS.find((t) => t.id === id)!.name, count: count({ task: id }) }))]} />}
        <Select label="Level" value={f.level} onChange={(v) => set({ level: v })} testId="filter-level"
          options={[{ value: "", label: "Any", count: count({ level: "" }) }, ...LEVELS.map((l) => ({ value: l, label: cap(l), count: count({ level: l }) }))]} />
      </div>}
      <div id="library-results" role="tabpanel" aria-labelledby={`format-${f.kind}`}>
      <div className="result-line">
        <span data-testid="result-count">{results.length} result{results.length === 1 ? "" : "s"}{activeTask ? ` for “${activeTask.name}”` : fn ? ` for “${fn.name}”` : area ? ` in ${area.name}` : ""}{f.kind !== "all" ? `. ${KINDS.find((k) => k.id === f.kind)!.what}` : ""}</span>
        {filtered && <button className="link-btn" onClick={clear}>Clear all</button>}
      </div>
      {results.length ? (
        <>
          <div className="grid">{results.slice(0, limit).map((b) => <BlockCard key={b.slug} b={b} />)}</div>
          {results.length > limit && <div className="more library-more"><button type="button" className="btn btn-dark" onClick={() => setLimit((n) => n + PAGE)} data-testid="show-more">Show {Math.min(PAGE, results.length - limit)} more</button><a href="#build" className="library-builder-link">Build a workflow <ArrowIcon size={12} /></a></div>}
        </>
      ) : (
        <div className="empty"><h3 className="h3">Nothing matches that yet</h3><p>Try fewer words, or <button className="link-btn" onClick={clear}>clear all</button>.</p></div>
      )}
      </div>
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
  useLayoutEffect(() => {
    if (n >= text.length) return;
    const prev = text[n - 1];
    const t = setTimeout(() => setN(n + 1), n === 0 ? 120 : prev === "." ? 140 : prev === "," ? 70 : 8 + Math.random() * 10);
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
  useEffect(() => {
    document.title = "Free AI Skills & Custom Workflow Builder | AI Blocks";
    const description = "Explore free AI skills, prompts and workflows. Build a custom workflow, edit the steps and download a pack to run in your AI. Try free browser tools too.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) document.querySelector(selector)?.setAttribute("content", document.title);
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) document.querySelector(selector)?.setAttribute("content", description);
  }, []);
  // A link like /#library opened fresh: jump there once the library has drawn.
  useEffect(() => {
    if (!c || !location.hash) return;
    const id = location.hash.slice(1);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
  }, [c]);
  return (
    <main id="top">
      <StartupReady />
      <section className="hero">
        <Suspense fallback={null}><Globe /></Suspense>
        <div className="wrap hero-in">
          <h1 className="h1">Use AI like the top 1%</h1>
          <Typewriter text="Turn hours of work into minutes. Spend the time you save on the work only you can do. Or at the beach (we won't tell)." />
          <div className="hero-actions">
            <Link to="/#library" className="btn btn-primary">Browse the blocks <ArrowIcon /></Link>
            <Link to="/#build" className="btn btn-dark">Build a workflow</Link>
          </div>
        </div>
      </section>

      {c ? <Library c={c} /> : <section className="section wrap" id="library"><p className="small">Loading…</p></section>}

      <section className="section wrap" id="build" aria-labelledby="build-h">
        <div className="sec-head">
          <h2 className="h2" id="build-h">Connect skills into a workflow you can run</h2>
          <p className="lede">Choose skills or start from a ready workflow. Review the steps, download one folder and give it to your AI to work through.</p>
        </div>
        <p className="builder-app-link">Want a screen your team can use? <Link to="/apps/starter-pack">Turn your workflow into an app <ArrowIcon size={12} /></Link> <Link to="/apps">See the Mercatura example</Link></p>
        <WhenNear id="build" fallback={<div className="builder" />}>{c && <Suspense fallback={<div className="builder" />}><Builder c={c} toast={toast} /></Suspense>}</WhenNear>
      </section>
      <FeaturedTools />
      {c && <FeaturedWorkflows c={c} />}
    </main>
  );
}

/** Runs only when the home screen or a resolved route has actually committed. */
function StartupReady() {
  const ready = useContext(StartupContext);
  useLayoutEffect(() => {
    if (ready) document.dispatchEvent(new Event("abb:ready"));
  }, [ready]);
  return null;
}

export default function App() {
  useIdlePrefetch();
  useHashLanding();
  const { path, search } = useLocation();
  const [kitsOpen, setKitsOpen] = useState(false);
  const needsCatalogue = !infoPage(path) && !["/ai-tools", "/tools", "/apps", "/how-it-works", "/traction"].some((p) => path === p || path.startsWith(`${p}/`));
  const c = useCatalogue(needsCatalogue || kitsOpen);
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
  // Resolve renamed and legacy addresses before revealing the first page.
  const now = (s: string | null) => (c && s ? c.bySlug[s] ?? c.bySlug[c.renamed?.[s] ?? ""] : undefined);
  const old = now(search.get("block"));
  const here = now(pageSlug);
  const redirectTo = path === "/traction" ? "/tools/growth-channel-planner" : old ? pathOf(old) : here && pathOf(here) !== path ? pathOf(here) : null;
  // Optional library data must not delay the home hero or the space form.
  const waitingForCatalogue = !c && (pageSlug !== null || ["/minds", "/compose", "/from-a-source"].includes(path)
    || search.has("block") || (path === "/" && ["#library", "#build"].includes(location.hash)));
  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true });
  }, [redirectTo]);

  useEffect(() => syncPageMetadata(path), [path]);

  const toBuilder = useCallback((slugs: string[], asNew?: string) => {
    queueForCanvas(slugs, asNew);
    setKitsOpen(false);
    navigate("/#build");
    setToast(asNew ? `${asNew} is open in the builder` : "Added to the builder");
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header onKits={() => setKitsOpen(true)} />
      <div id="main-content" tabIndex={-1}>
      <StartupContext.Provider value={!redirectTo && !waitingForCatalogue}>
        <Suspense fallback={<main className="wrap bp-hero"><p className="small">Loading…</p></main>}>
          {infoPage(path) ? (
            <InfoPage path={path} toast={setToast} />
          ) : path === "/traction" || path === "/tools/growth-channel-planner" ? (
            <TractionPage />
          ) : path === "/tools" || path.startsWith("/tools/") ? (
            <ToolsPage path={path} toast={setToast} />
          ) : path === "/ai-tools" || path.startsWith("/ai-tools/") ? (
            <AiToolsPage path={path} />
          ) : path === "/apps" || path.startsWith("/apps/") ? (
            <AppsPage path={path} toast={setToast} />
          ) : path === "/space" || path === "/people" || path.startsWith("/s/") ? (
            <SpacePage path={path} c={c} toast={setToast} />
          ) : path === "/minds" ? (
            c ? <MindsPage c={c} toBuilder={toBuilder} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
          ) : path === "/compose" ? (
            c ? <ComposePage c={c} toast={setToast} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
          ) : path === "/from-a-source" ? (
            c ? <IntakePage c={c} toast={setToast} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
          ) : path === "/how-it-works" ? (
            <HowItWorks toast={setToast} />
          ) : pageSlug ? (
            c ? <BlockPage c={c} slug={pageSlug} toast={setToast} toBuilder={toBuilder} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
          ) : path === "/" ? (
            <Home c={c} toast={setToast} />
          ) : (
            <main className="wrap bp-hero"><StartupReady /><h1 className="bp-h1">This page doesn't exist</h1><p className="lede">The address may have changed. Find a block in the library or ask us for help.</p><div className="hero-actions"><Link to="/#library" className="btn btn-primary">Browse the library</Link><Link to="/support" className="btn btn-dark">Get help</Link></div></main>
          )}
        </Suspense>
      </StartupContext.Provider>
      </div>
      <SiteFooter />
      {bizOpen && <BusinessDrawer onClose={closeBiz} toast={setToast} />}
      {tailor !== null && <TailorDrawer skill={tailor} onClose={closeTailor} toast={setToast} />}
      {c && kitsOpen && <KitsDrawer c={c} onClose={closeKits} toBuilder={toBuilder} toast={setToast} />}
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
