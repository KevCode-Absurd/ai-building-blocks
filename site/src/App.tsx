import { spaceKey, spaces } from "./lib/space";
import FeaturedTools from "./tools/FeaturedTools";
import { HomeMinds, HomeWorkflows, HomeAgents } from "./HomeSections";
import { useLibrarySearch } from "./lib/library-search";
import { rankLibraryResults } from "./lib/library-rank";
import { syncPageMetadata } from "./lib/page-metadata";
import { Suspense, createContext, lazy, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useState, type ComponentType } from "react";
import { ArrowIcon, BlockCard, Drawer, SearchIcon, Select, Toast } from "./ui";
import { type Block, type Catalogue, type Kind, AREAS, areasOf, availableTasks, availableFunctions, classificationText, QUICK_JOB_IDS, FUNCTIONS, FUNCTION_MOVED, KINDS, TASKS, taskIdsOf, functionsOf, kindOf, loadPage, pathOf, useCatalogueState, workflowEntries } from "./lib/data";
import { kits, queueForCanvas, useStore } from "./lib/store";
import { SaveHint, usePersistence } from "./AccountPersistence";
import { reviewedTask } from "./lib/task-discovery";
import { trackUxEvent } from "./lib/ux-events";
import "./simplicity.css";
import "./home-library.css";
import { Link, navigate, setPrefetch, setSearch, useLocation } from "./lib/router";
import MindsForSearch from "./MindsForSearch";
import { BusinessDrawer, openBusiness, useBusinessOpener } from "./Business";
import { TailorDrawer, useTailorOpener } from "./Tailor";
import SiteHeader from "./SiteHeader";
import { STARTER_PATHS, isAudienceStarter, starterFor, starterTemplate } from "./lib/audience-starters";
import { infoPage } from "./lib/site-info.mjs";
import SiteFooter from "./SiteFooter";
import PageRecovery from "./PageRecovery";
import { initialPageHtml } from "./lib/public-opening";
import { useCommunityStars } from "./CommunityStars";
import { isTested } from "./lib/verification";

const Builder = lazy(() => import("./Builder")); // the canvas loads only when someone scrolls near it
const Globe = lazy(() => import("./Globe")); // drawn behind the hero, so the text never waits for it

// The other pages load after the home page has drawn, while the browser is idle, so a click opens them at once.
const PAGES = {
  docs: () => import("./ApiMcpPage"),
  memd: () => import("./MeMdPage"),
  community: () => import("./CommunityPage"),
  account: () => import("./AccountPage"),
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
  if (["/api-and-mcp", "/api-and-mcp.html"].includes(path)) return "docs";
  if (path === "/me-md") return "memd";
  if (["/publish", "/my-submissions", "/admin/review", "/community"].includes(path) || path.startsWith("/community/")) return "community";
  if (["/account", "/sign-up", "/sign-in"].includes(path)) return "account";
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
// ownReady: the page lifts the cover itself once its content is in (a block page waits for its text, so the header
// does not grow under the reader after the cover lifts).
function startupPage<P extends object>(load: () => Promise<{ default: ComponentType<P> }>, ownReady = false) {
  return lazy(async () => {
    const { default: Page } = await load();
    return { default: (props: P) => <><Page {...props} />{!ownReady && <StartupReady />}</> };
  });
}
const BlockPage = startupPage(PAGES.block, true);
const CommunityPage = startupPage(PAGES.community);
const HowItWorks = startupPage(PAGES.guide);
const ApiMcpPage = startupPage(PAGES.docs);
const MeMdPage = startupPage(PAGES.memd);
async function loadToolPage(to: string) {
  const slug = to.split(/[?#]/)[0].split("/")[2];
  if (!slug) return PAGES.tools();
  const { BROWSER_TOOLS } = await import("./tools/browser-tools.mjs");
  return BROWSER_TOOLS.some(tool => tool.slug === slug) ? import("./tools/BrowserToolPage") : PAGES.tools();
}
type ToolPageProps = { path: string; toast: (message: string) => void };
const toolRoutes = new Map<string, ComponentType<ToolPageProps>>();
function ToolsPage({ path, toast }: ToolPageProps) {
  // Keep the lazy component identity outside a suspended first render. A memo
  // created in that render can be discarded and restart loading indefinitely.
  let Page = toolRoutes.get(path);
  if (!Page) { Page = startupPage<ToolPageProps>(() => loadToolPage(path)); toolRoutes.set(path, Page); }
  return <Page path={path} toast={toast} />;
}
const AiToolsPage = startupPage(PAGES.aitools);
const TractionPage = startupPage(PAGES.traction);
const AppsPage = startupPage(PAGES.apps);
const SpacePage = startupPage(PAGES.space);
const MindsPage = startupPage(PAGES.minds);
const IntakePage = startupPage(PAGES.intake);
const ComposePage = startupPage(PAGES.compose);
const InfoPage = startupPage(PAGES.info);
const AccountPage = startupPage(PAGES.account);
// Pages folded into another page. The old address still works: it sends you to the new one. (The same two are 301s in public/_redirects.)
const LEGACY_PATHS: Record<string, string> = { "/traction": "/tools/growth-channel-planner", "/apps/starter-pack": "/apps#starter-pack" };
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
      if (page === "tools") { void loadToolPage(to).catch(() => {}); return; }
      if (page) void PAGES[page]().catch(() => {});
    });
    // On the homepage, do not compete with first paint for the most common next page.
    // Links still warm their destination on pointer/focus intent through setPrefetch above.
    if (location.pathname === "/") return;
    // On data saver or a slow phone line, pages load when they're opened instead.
    const net = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (net?.saveData || /(^|-)2g$/.test(net?.effectiveType ?? "")) return;
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1200));
    const stop = window.cancelIdleCallback ?? window.clearTimeout;
    // Warm the next section on non-home pages only; on home, explicit link intent is enough.
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

// scope "" is the default view: everything, tested blocks first. "tested" shows only blocks whose test passed.
type Filters = { q: string; audience: string; area: string; fn: string; task: string; kind: Kind | "all"; level: string; starred: string; scope: "" | "tested" };
const NONE: Filters = { q: "", audience: "", area: "", fn: "", task: "", kind: "all", level: "", starred: "", scope: "" };
const LIBRARY_FORMATS: { id: Kind | "all"; name: string; line: string }[] = [
  { id: "all", name: "All", line: "Explore the library" },
  { id: "prompt", name: "Prompts", line: "Paste into a chat" },
  { id: "skill", name: "Skills", line: "Run the same steps every time" },
  { id: "workflow", name: "Workflows", line: "Connect several steps" },
  { id: "agent", name: "Agents", line: "Delegate a repeatable job" },
  { id: "mind", name: "Minds", line: "Borrow an expert's thinking" },
];
const librarySearchContext = classificationText;
function libraryFilters(search: URLSearchParams): Filters {
  const task = TASKS.some(t => t.id === search.get("job")) ? search.get("job")! : "";
  const fnId = FUNCTION_MOVED[search.get("fn") ?? ""] ?? search.get("fn");
  const fn = FUNCTIONS.find(x => x.id === fnId)?.id ?? "";
  return { ...NONE, q: search.get("q") ?? "", starred: search.get("starred") === "1" ? "1" : "", scope: search.get("scope") === "tested" ? "tested" : "", audience: starterFor(search.get("audience") ?? "")?.id ?? "", area: AREAS.some(a => a.id === search.get("area")) ? search.get("area")! : "", fn, task, kind: KINDS.some(k => k.id === search.get("kind")) ? search.get("kind") as Kind : "all" };
}

/** `complete` is false while home shows only the starter picks; any search or filter asks for the full list. */
function Library({ c, complete = true, error = "", retry, onNeedFull }: { c: Catalogue; complete?: boolean; error?: string; retry?: () => void; onNeedFull?: () => void }) {
  const { ranked, starred, loading: starsLoading, loadError, reload } = useCommunityStars();
  const { account } = usePersistence();
  const popularity = useMemo(() => new Map(ranked.map((target, index) => [target, index])), [ranked]);
  const [f, setF] = useState<Filters>(() => libraryFilters(new URLSearchParams(location.search)));
  useEffect(() => {
    const syncNavigation = () => {
      const next = libraryFilters(new URLSearchParams(location.search));
      setF(current => JSON.stringify(current) === JSON.stringify(next) ? current : next);
    };
    // Search replaces its URL silently. Only actual navigation should restore
    // filters; a deferred render must never restore yesterday's keystroke.
    window.addEventListener("popstate", syncNavigation);
    window.addEventListener("abb:navigate", syncNavigation);
    return () => { window.removeEventListener("popstate", syncNavigation); window.removeEventListener("abb:navigate", syncNavigation); };
  }, []);
  const applyFilters = (next: Filters) => {
    if (!complete) onNeedFull?.();
    setSearch({ q: next.q, audience: next.audience, area: next.area, fn: next.fn, job: next.task, kind: next.kind === "all" ? "" : next.kind, level: "", by: "", starred: next.starred, scope: next.scope });
    setF(next);
  };
  const set = (patch: Partial<Filters>) => applyFilters({ ...f, ...patch });
  const [limit, setLimit] = useState(PAGE);
  const [moreFilters, setMoreFilters] = useState(() => !!(f.audience || f.fn));
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
  useEffect(() => { setLimit(PAGE); }, [f]);

  // Every count reflects all the other choices, so a zero is never a surprise.
  // The list and the counts follow the typing a beat behind, so the search box never waits on them.
  const df = useDeferredValue(f);
  const suggestion = reviewedTask(df.q);
  const searchState = useLibrarySearch(c, complete ? df.q : "", { extraText: librarySearchContext });
  const hasQuery = !!df.q.trim();
  // Each block's areas, groups and kind, worked out once, so a few thousand blocks still count fast.
  const facts = useMemo(() => new Map(c.blocks.map((b) => [b.slug, { areas: new Set(areasOf(b)), fns: new Set(functionsOf(b).map((x) => x.id)), tasks: new Set(taskIdsOf(b)), kind: kindOf(b) }])), [c]);
  const fact = (b: Block) => facts.get(b.slug)!;
  const tests: Record<keyof Filters, (b: Block, v: string) => boolean> = {
    q: (b) => !hasQuery || b.slug === suggestion?.slug || searchState.hits.has(b.slug),
    audience: (b, v) => isAudienceStarter(b.slug, v),
    area: (b, v) => !v || fact(b).areas.has(v),
    fn: (b, v) => !v || fact(b).fns.has(v),
    task: (b, v) => !v || fact(b).tasks.has(v),
    kind: (b, v) => v === "all" || fact(b).kind === v,
    level: (b, v) => !v || b.level === v,
    starred: (b, v) => !v || starred.has(`catalogue:${b.slug}`),
    scope: (b, v) => v !== "tested" || isTested(b),
  };
  const keys = Object.keys(tests) as (keyof Filters)[];
  // Counts are worked out once per settled search, not on every redraw.
  const counted = useMemo(() => new Map<string, number>(), [c, df, searchState.hits, starred]); // eslint-disable-line react-hooks/exhaustive-deps
  // The counts never change the search words, so the search runs once and every count works on what it matched.
  const matched = useMemo(() => (hasQuery ? c.blocks.filter((b) => tests.q(b, df.q)) : c.blocks), [c, df, searchState.hits, starred]); // eslint-disable-line react-hooks/exhaustive-deps
  const facets = keys.filter((k) => k !== "q");
  const count = (over: Partial<Filters>) => {
    const key = JSON.stringify(over);
    if (!counted.has(key)) { const g = { ...df, ...over }; counted.set(key, matched.filter((b) => facets.every((k) => tests[k](b, g[k] as string))).length); }
    return counted.get(key)!;
  };
  const order = (a: Block, b: Block) => { const tested = Number(isTested(b)) - Number(isTested(a)); return (hasQuery ? (searchState.hits.get(b.slug)?.score ?? 0) - (searchState.hits.get(a.slug)?.score ?? 0) : tested || (popularity.get(`catalogue:${a.slug}`) ?? ranked.length) - (popularity.get(`catalogue:${b.slug}`) ?? ranked.length)) || tested || Number(b.slug === suggestion?.slug) - Number(a.slug === suggestion?.slug) || startRank(a.slug) - startRank(b.slug) || Number(!!b.headline) - Number(!!a.headline) || KINDS.findIndex((k) => k.id === fact(a).kind) - KINDS.findIndex((k) => k.id === fact(b).kind) || byName.compare(a.name, b.name); };
  // A search is ordered by lib/library-rank.ts (measured offline by scripts/evaluate-recommendations.mjs).
  const results = useMemo(() => { const shown = c.blocks.filter((b) => keys.every((k) => tests[k](b, df[k] as string))); return hasQuery ? rankLibraryResults(shown, searchState.hits, df.q, { isTested, suggestion: suggestion?.slug }) : shown.sort(order); }, [c, df, searchState.hits, popularity, starred]); // eslint-disable-line react-hooks/exhaustive-deps
  const clear = () => applyFilters({ ...NONE, q: f.q, scope: f.scope });
  // With "Tested only" on, say how many untested blocks are left out, and let people bring them back.
  const hidden = df.scope === "tested" ? count({ scope: "" }) - count({ scope: "tested" }) : 0;
  const fn = FUNCTIONS.find((x) => x.id === f.fn);
  const activeTask = TASKS.find((t) => t.id === f.task);
  const area = AREAS.find((a) => a.id === f.area);
  const audience = starterFor(f.audience);
  const fnsShown = useMemo(() => availableFunctions(c.blocks, f.area), [c, f.area]);

  const extraFilters = [f.audience, f.fn].filter(Boolean).length;
  const useCases = useMemo(() => availableTasks(c.blocks, { area: f.area, fn: f.fn }), [c, f.area, f.fn]);
  const quickJobs = [{ id: "", name: "All work" }, ...QUICK_JOB_IDS.map(id => AREAS.find(area => area.id === id)!)];
  const shownResults = results.slice(0, limit);
  const hasFilters = f.kind !== "all" || !!f.starred || !!(f.audience || f.area || f.fn || f.task);
  const formats = LIBRARY_FORMATS;

  return (
    <section className="section wrap" id="library" aria-label="Library">
      <h2 className="visually-hidden">Find a task</h2>
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
      <div className="search big library-search-field"><SearchIcon /><label className="visually-hidden" htmlFor="task-search">What do you want to get done?</label><input id="task-search" value={f.q} onFocus={() => { if (!complete) onNeedFull?.(); }} onChange={e => set({ q: e.target.value })} placeholder="What do you want to get done?" title="Try SEO, AEO, meeting notes or a product launch" data-testid="library-search" />{f.q ? <button type="button" className="library-search-clear" aria-label="Clear search" onClick={() => { set({ q: "" }); document.getElementById("task-search")?.focus(); }}><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="m5 5 8 8M13 5l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button> : <kbd className="kbd" aria-hidden="true">/</kbd>}</div>
      {!complete && (error
        ? <p className="small" role="alert">{error} <button type="button" className="library-retry" onClick={retry}>Try the full library again</button></p>
        : <p className="small" role="status">Showing starter picks. Search or scroll to open the full library.</p>)}
      <fieldset className="library-job-functions"><legend>Job function</legend><div className="library-job-options" role="group" aria-label="Common job functions">{quickJobs.map(job => <button type="button" key={job.id} aria-pressed={f.area === job.id} onClick={() => set({ area: job.id, fn: "", task: "" })} data-testid={`job-${job.id || "all"}`}>{job.name}</button>)}</div></fieldset>
      <div className="library-use-case">
        <Select label="Job function" value={f.area} onChange={value => set({ area: value, fn: "", task: "" })} testId="filter-domain" options={[{ value: "", label: "All job functions" }, ...AREAS.map(area => ({ value: area.id, label: area.name, count: count({ area: area.id, fn: "", task: "" }) }))]} />
        <Select label="Use case" value={f.task} onChange={value => set({ task: value })} testId="filter-task" options={[{ value: "", label: "All use cases" }, ...useCases.map(task => ({ value: task.id, label: task.name, count: count({ task: task.id }) }))]} />
      </div>
      <div className="library-toolbar">
        <button type="button" className="library-star-filter" aria-pressed={!!f.starred} onClick={() => set({ starred: f.starred ? "" : "1" })}><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill={f.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-3-5.6 3 1-6.2L3 9.6l6.2-.9Z" /></svg>Starred</button>
        <button type="button" className="more-filters-btn" aria-expanded={moreFilters} aria-controls="library-more-filters" onClick={() => setMoreFilters((v) => !v)} data-testid="more-filters">More filters{extraFilters > 0 && <span className="badge">{extraFilters}</span>} <span aria-hidden="true">{moreFilters ? "−" : "+"}</span></button>
        <button type="button" className="library-star-filter library-scope-toggle" aria-pressed={f.scope === "tested"} onClick={() => set({ scope: f.scope === "tested" ? "" : "tested" })} data-testid="scope-toggle">Tested only</button>
        <Link to="/minds" className="btn btn-ghost btn-sm" data-testid="library-minds-link">Minds and advisory council <span aria-hidden="true">→</span></Link>
        <Link to="/how-it-works" className="btn btn-ghost btn-sm">How it works <span aria-hidden="true">→</span></Link>
      </div>
      <p className="small library-me-step" data-testid="home-me-step"><Link to="/me-md">Make your me.md once.</Link> Every task then fits you.</p>
      {audience && <div className="audience-guide small" data-testid="audience-guide">
        <p><strong>{audience.goal}</strong> These are starter picks. Clear this filter to explore all tasks.</p>
        <p>Bring: {audience.bring}</p>
        <p><button className="link-btn" onClick={openBusiness}>Add your me.md</button> · <a href={starterTemplate(audience.id)} download>Download a details template</a></p>
        {audience.id === "enterprise" && <p>These packs support your work in your chosen AI tool. Team access controls, company system connections and audit storage need your own implementation.</p>}
      </div>}
      {moreFilters && <div className="library-more-filters" id="library-more-filters" role="group" aria-label="More filters">
        <Select label="Start with" value={f.audience} onChange={(v) => set({ audience: v })} testId="filter-audience" options={[{ value: "", label: "Full library" }, ...STARTER_PATHS.map(a => ({ value: a.id, label: a.name }))]} />
        <Select label="Specialty" value={f.fn} onChange={(v) => set({ fn: v, task: "" })} testId="filter-work"
          options={[{ value: "", label: "All work", count: count({ fn: "", task: "" }) }, ...fnsShown.map((x) => ({ value: x.id, label: x.name, count: count({ fn: x.id, task: "" }) }))]} />
      </div>}
      <div id="library-results" role="tabpanel" aria-labelledby={`format-${f.kind}`}>
      <div className="result-line">
        {complete && <span data-testid="result-count" role="status" aria-atomic="true">{results.length} result{results.length === 1 ? "" : "s"}{activeTask ? ` for “${activeTask.name}”` : fn ? ` for “${fn.name}”` : area ? ` in ${area.name}` : ""}</span>}
        {hasFilters && <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>Clear filters</button>}
      </div>
      {hasQuery && complete && f.kind !== "mind" && <MindsForSearch c={c} q={df.q} />}
      {hidden > 0 && <p className="small library-scope-note" data-testid="scope-note">Showing tested blocks only. {hidden.toLocaleString("en-US")} block{hidden === 1 ? " hasn't" : "s haven't"} been tested yet. <button type="button" className="link-btn" onClick={() => set({ scope: "" })} data-testid="scope-show-all">Show all</button></p>}
      {hasQuery && searchState.loading && <p className="small" role="status">Searching full instructions…</p>}
      {hasQuery && searchState.error && <p className="small" role="alert">Full instructions could not be searched. These results use titles and descriptions. <button type="button" className="link-btn" onClick={searchState.retry}>Try full search again</button></p>}
      {f.starred && account.state !== "signed-in" ? <div className="empty"><h3 className="h3">Your starred library</h3><p>Sign in to keep useful skills and workflows close, across devices.</p><button className="btn btn-dark" onClick={() => void account.signIn()}>Sign in to see your stars</button></div> : f.starred && loadError ? <div className="empty"><h3 className="h3">Your stars could not be loaded</h3><p>Please try again to see your saved stars.</p><button className="btn btn-dark" onClick={reload}>Try again</button></div> : f.starred && starsLoading ? <p role="status">Loading your stars...</p> : results.length ? (
        <>
          {!!shownResults.length && <div className="grid">{shownResults.map((b) => <BlockCard key={b.slug} b={b} workflowBuilder />)}</div>}
          {results.length > limit && <div className="more library-more"><button type="button" className="btn btn-dark" onClick={() => setLimit(n => n + PAGE)} data-testid="show-more">Show {Math.min(PAGE, results.length - limit)} more</button></div>}
        </>
      ) : f.starred && starred.size === 0 ? <div className="empty"><h3 className="h3">Keep your next good find</h3><p>Open a skill or workflow and select Star. It will appear here.</p><button className="btn btn-dark" onClick={() => set({ starred: "" })}>Explore the library</button></div> : !searchState.loading && (
        <div className="empty"><h3 className="h3">We couldn't find that task</h3><p>Your search is still here. Try the job name, such as “meeting notes” or “email reply”.</p>{hidden > 0 && <p><button className="link-btn" onClick={() => set({ scope: "" })}>Include {hidden.toLocaleString("en-US")} block{hidden === 1 ? "" : "s"} not tested yet</button></p>}{hasFilters && <p><button className="link-btn" onClick={clear}>Search again without filters</button></p>}<button className="btn btn-dark" onClick={() => document.querySelector<HTMLInputElement>('[data-testid="library-search"]')?.focus()}>Edit my search</button></div>
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
    <Drawer label="My kits" top={<span className="mono">My kits</span>} onClose={onClose}>
      <h2 className="title" style={{ marginTop: 0 }}>My kits</h2>
      <SaveHint subject="kits" onNavigate={onClose} />
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

function LibraryLoading({ error, retry }: { error: string | null; retry: () => void }) {
  return <section className="section wrap library-recovery" id="library" aria-label="Task library"><h2 className="visually-hidden">Find a task</h2><div className="library-formats library-formats-loading">{LIBRARY_FORMATS.map(format => <Link key={format.id} to={`/?kind=${format.id === "all" ? "" : format.id}#library`}><span>{format.name}</span><small>{format.line}</small></Link>)}</div><label className="search big"><SearchIcon /><span className="visually-hidden">What do you want to get done?</span><input disabled placeholder="What do you want to get done?" data-testid="library-search" /></label>{error ? <><p role="alert">{error}</p><button className="btn btn-primary" onClick={retry}>Try again</button><p className="small">You can still use the public guides and browser tools.</p><Link to="/tools">Open browser tools →</Link></> : <p role="status" className="small">Opening the task library…</p>}</section>;
}

function Home({ c, toast, error, retry, complete, onNeedFull }: { c: Catalogue | null; toast: (m: string) => void; error: string | null; retry: () => void; complete: boolean; onNeedFull: () => void }) {
  const { search } = useLocation();
  const selectedWorkflow = search.get("workflow") ?? "";
  const [buildOpen, setBuildOpen] = useState(() => location.hash === "#build");
  const [showGlobe, setShowGlobe] = useState(false);
  useEffect(() => {
    // Keep the decorative globe and its CPU work out of first paint. Start after
    // the hero has been visible for a moment, then wait for an idle browser slot.
    let idleId = 0;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const timer = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) idleId = idleWindow.requestIdleCallback(() => setShowGlobe(true), { timeout: 1800 });
      else idleId = window.setTimeout(() => setShowGlobe(true), 250);
    }, 1000);
    return () => {
      window.clearTimeout(timer);
      if (idleWindow.cancelIdleCallback && idleId) idleWindow.cancelIdleCallback(idleId);
      else if (idleId) window.clearTimeout(idleId);
    };
  }, []);
  useEffect(() => {
    // The starter picks are enough for a first visit. Load the library list
    // when the visitor starts browsing, not while the hero is painting.
    const onScroll = () => {
      if (window.scrollY < 1) return;
      const section = document.getElementById("library");
      if (!section || section.getBoundingClientRect().top > window.innerHeight * 1.35) return;
      window.removeEventListener("scroll", onScroll);
      onNeedFull();
    };
    if (window.scrollY > 0) onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onNeedFull]);
  useEffect(() => { const hash = () => { setBuildOpen(location.hash === "#build"); if (location.hash === "#library" || location.hash === "#build") onNeedFull(); }; addEventListener("hashchange", hash); return () => removeEventListener("hashchange", hash); }, [onNeedFull]);
  useEffect(() => {
    if (!c || !complete || !selectedWorkflow) return;
    const workflow = c.bySlug[c.renamed[selectedWorkflow] ?? selectedWorkflow];
    if (workflow && kindOf(workflow) === "workflow") { queueForCanvas(workflowEntries(workflow), workflow.name); setBuildOpen(true); }
    else toast("That workflow could not be opened. Choose another from the library.");
    setSearch({ workflow: "" });
  }, [c, complete, selectedWorkflow, toast]);
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
        {showGlobe && <Suspense fallback={null}><Globe /></Suspense>}
        <div className="wrap hero-in">
          <h1 className="h1">Use AI like the top 1%</h1>
          <p className="lede typed" data-done="true">Turn hours of work into minutes. Spend the time you save on the work only you can do. Or at the beach (we won't tell).</p>
          <div className="hero-actions">
            <Link to="/#library" className="btn btn-primary" onClick={e => { e.preventDefault(); onNeedFull(); trackUxEvent("task_started"); navigate("/#library"); requestAnimationFrame(() => document.querySelector<HTMLInputElement>('[data-testid="library-search"]')?.focus()); }}>Start with a task <ArrowIcon /></Link>
            <Link to="/#build" className="btn btn-line" data-testid="hero-build-workflow" onClick={onNeedFull}>Build a workflow <ArrowIcon /></Link>
          </div>
          <p className="hero-connect small" data-testid="hero-connect"><Link to="/api-and-mcp">Connect your AI once</Link>. Then it pulls any skill or workflow it needs, when it needs it.</p>
        </div>
      </section>

      {c ? <Library c={c} complete={complete} error={error ?? ""} retry={retry} onNeedFull={onNeedFull} /> : <LibraryLoading error={error} retry={retry} />}

      {c && complete && <HomeMinds c={c} />}
      {c && complete && <HomeWorkflows c={c}>{buildOpen && <section className="home-builder" id="build" aria-labelledby="build-h">
        <div className="sec-head">
          <h2 className="h2" id="build-h">Connect skills into a workflow you can run</h2>
          <p className="lede">Choose skills or start from a ready workflow. Review the steps, download one folder and give it to your AI to work through.</p>
        </div>
        <p className="builder-app-link"><Link className="btn btn-dark btn-sm" to="/apps#starter-pack">Turn your workflow into an app <ArrowIcon size={12} /></Link><Link className="btn btn-ghost btn-sm" to="/apps">See an example →</Link><Link className="btn btn-ghost btn-sm" to="/from-a-source" data-testid="build-from-source">Start from a link or document →</Link></p>
        {c && complete && <Suspense fallback={<div className="builder" role="status">Opening the steps…</div>}><FullBuilder toast={toast} /></Suspense>}
      </section>}</HomeWorkflows>}
      {c && complete && <HomeAgents c={c} />}
      <FeaturedTools />
    </main>
  );
}

/** While a block page's catalogue loads, keep the server's readable page under the loading cover, so a slow
 * load can still show the content (index.html reveals it instead of an error). */
function BlockPending({ path }: { path: string }) {
  const html = initialPageHtml(path);
  return html ? <div data-testid="public-opening" dangerouslySetInnerHTML={{ __html: html }} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>;
}

/** The home list uses the small catalogue index; the builder reads ports and steps, so it opens on the full catalogue. */
function FullBuilder({ toast }: { toast: (m: string) => void }) {
  const { catalogue, error, retry } = useCatalogueState(true);
  if (catalogue) return <Builder c={catalogue} toast={toast} />;
  return <div className="builder" role="status">{error ? <>{error} <button type="button" className="link-btn" onClick={retry}>Try again</button></> : "Opening the steps…"}</div>;
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
  const needsCatalogue = !infoPage(path) && !["/ai-tools", "/tools", "/apps", "/how-it-works", "/traction", "/api-and-mcp", "/api-and-mcp.html", "/me-md"].some((p) => path === p || path.startsWith(`${p}/`));
  // Home only lists cards, so it loads the small list index; other catalogue pages need the full file.
  // A first visit to home shows the starter picks; the list index waits until the visitor starts browsing.
  const starterFirst = path === "/" && !search.has("block") && !search.has("workflow");
  const hasHomeLibraryIntent = starterFirst && (location.hash === "#library" || location.hash === "#build" || ["q", "kind", "area", "fn", "job", "audience", "starred", "scope"].some(key => search.has(key)));
  const [homeCatalogueRequested, setHomeCatalogueRequested] = useState(hasHomeLibraryIntent);
  const requestHomeCatalogue = useCallback(() => setHomeCatalogueRequested(true), []);
  useEffect(() => {
    if (path !== "/") setHomeCatalogueRequested(false);
    else if (hasHomeLibraryIntent) setHomeCatalogueRequested(true);
  }, [path, hasHomeLibraryIntent]);
  // The builder paints its request form first and only then fetches the task library (about 1 MB), so on a phone the
  // page shows at once instead of waiting behind the download.
  const [builderPainted, setBuilderPainted] = useState(false);
  useEffect(() => {
    if (path !== "/compose" || builderPainted) return;
    let timers: number[] = [];
    const done = () => setBuilderPainted(true);
    // A short pause after the cover lifts, so the form paints before the download starts; nothing needs the library
    // until a request is sent.
    const painted = () => { timers.push(window.setTimeout(done, 300)); };
    if (document.documentElement.dataset.boot === "ready") painted(); else document.addEventListener("abb:ready", painted, { once: true });
    return () => { document.removeEventListener("abb:ready", painted); timers.forEach(clearTimeout); timers = []; };
  }, [path, builderPainted]);
  const catalogueState = useCatalogueState((needsCatalogue && (!starterFirst || homeCatalogueRequested) && (path !== "/compose" || builderPainted)) || kitsOpen, { starterFirst, tier: path === "/" ? "index" : "full" });
  // Without starter picks there is nothing light to show, so open the library straight away.
  useEffect(() => { if (catalogueState.starterFailed) requestHomeCatalogue(); }, [catalogueState.starterFailed, requestHomeCatalogue]);
  const c = catalogueState.catalogue;
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
  const redirectTo = LEGACY_PATHS[path] ?? (old ? pathOf(old) : here && pathOf(here) !== path ? pathOf(here) : null);
  // Optional library data must not delay the home hero or the space form.
  const waitingForCatalogue = !c && !catalogueState.error && (pageSlug !== null || ["/minds", "/from-a-source"].includes(path)
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
      <SiteHeader />
      <div id="main-content" tabIndex={-1}>
      <StartupContext.Provider value={!redirectTo && !waitingForCatalogue}>
        <PageRecovery key={path}><Suspense fallback={<main className="wrap bp-hero"><p className="small" role="status">Opening this page…</p></main>}>
          {catalogueState.error && !c && (pageSlug !== null || ["/minds", "/compose", "/from-a-source"].includes(path)) ? <main><StartupReady /><LibraryLoading error={catalogueState.error} retry={catalogueState.retry} /></main> : infoPage(path) ? (
            <InfoPage path={path} toast={setToast} />
          ) : ["/publish", "/my-submissions", "/admin/review", "/community"].includes(path) || path.startsWith("/community/") ? (
            <CommunityPage key={path} path={path} />
          ) : ["/account", "/sign-up", "/sign-in"].includes(path) ? (
            <AccountPage c={c} onKits={() => setKitsOpen(true)} />
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
            // The builder opens at once; it plans once the task library is here (ComposePage.tsx).
            <ComposePage c={c} toast={setToast} />
          ) : path === "/from-a-source" ? (
            c ? <IntakePage c={c} toast={setToast} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
          ) : ["/api-and-mcp", "/api-and-mcp.html"].includes(path) ? (
            <ApiMcpPage />
          ) : path === "/me-md" ? (
            <MeMdPage />
          ) : path === "/how-it-works" ? (
            <HowItWorks toast={setToast} />
          ) : pageSlug ? (
            c ? <BlockPage c={c} slug={pageSlug} toast={setToast} toBuilder={toBuilder} /> : <BlockPending path={path} />
          ) : path === "/" ? (
            <Home c={c ?? catalogueState.starterCatalogue} complete={catalogueState.complete} toast={setToast} error={catalogueState.error} retry={catalogueState.retry} onNeedFull={requestHomeCatalogue} />
          ) : (
            <main className="wrap bp-hero"><StartupReady /><h1 className="bp-h1">This page doesn't exist</h1><p className="lede">The address may have changed. Find a block in the library or ask us for help.</p><div className="hero-actions"><Link to="/#library" className="btn btn-primary">Browse the library</Link><Link to="/support" className="btn btn-dark">Get help</Link></div></main>
          )}
        </Suspense></PageRecovery>
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
