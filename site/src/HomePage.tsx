import FeaturedTools from "./tools/FeaturedTools";
import { HomeMinds, HomeWorkflows, HomeAgents } from "./HomeSections";
import { useLibrarySearch } from "./lib/library-search";
import { rankLibraryResults } from "./lib/library-rank";
import { Suspense, lazy, useDeferredValue, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ArrowIcon, BlockCard, SearchIcon, Select } from "./ui";
import { type Block, type Catalogue, type Kind, AREAS, areasOf, availableTasks, availableFunctions, classificationText, QUICK_JOB_IDS, FUNCTIONS, FUNCTION_MOVED, KINDS, TASKS, taskIdsOf, functionsOf, kindOf, useCatalogueState, workflowEntries } from "./lib/data";
import { queueForCanvas } from "./lib/store";
import { usePersistence } from "./AccountPersistence";
import { reviewedTask } from "./lib/task-discovery";
import { trackUxEvent } from "./lib/ux-events";
import "./simplicity.css";
import "./home-library.css";
import { Link, navigate, setSearch, useLocation, warmRoute } from "./lib/router";
import MindsForSearch from "./MindsForSearch";
import { openBusiness } from "./Business";
import { STARTER_PATHS, isAudienceStarter, starterFor, starterTemplate } from "./lib/audience-starters";
import { useCommunityStars } from "./CommunityStars";
import { isTested } from "./lib/verification";

import {StartupReady} from "./StartupReady";
import LibraryLoading, {LIBRARY_FORMATS} from "./LibraryLoading";
const Builder = lazy(() => import("./Builder"));
const Globe = lazy(() => import("./Globe"));
// Shown first: things most people can use this week.
const byName = new Intl.Collator("en");
const START_HERE = ["website-brand-brain-builder", "landing-page-30-point-checker", "ad-opening-line-batch-writer", "ad-claim-proof-gap-finder", "plain-english-editor", "rough-notes-to-minutes-writer", "executive-email-draft", "week-plan-from-task-list-maker", "customer-buying-reasons-finder", "faq-page-from-questions-writer", "code-explainer-for-newcomers", "bug-evidence-plan-writer", "copilot-eval-driven-dev", "copilot-gtm-0-to-1-launch", "advisory-council", "fact-based-ad-copy-writer"];
const startRank = (slug: string) => { const index = START_HERE.indexOf(slug); return index < 0 ? START_HERE.length : index; };
const PAGE = 16;

// scope "" is the default view: everything, tested blocks first. "tested" shows only blocks whose test passed.
type Filters = { q: string; audience: string; area: string; fn: string; task: string; kind: Kind | "all"; level: string; starred: string; scope: "" | "tested" };
const NONE: Filters = { q: "", audience: "", area: "", fn: "", task: "", kind: "all", level: "", starred: "", scope: "" };
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

export default function Home({ c, toast, error, retry, complete, onNeedFull }: { c: Catalogue | null; toast: (m: string) => void; error: string | null; retry: () => void; complete: boolean; onNeedFull: () => void }) {
  // The first HTML already contains the real introduction. Keep those nodes
  // when the ready app takes over instead of painting the same text twice.
  const [initialHero] = useState(() => document.querySelector<HTMLElement>('#app-loader[data-home-shell] .hero-in'));
  useLayoutEffect(() => {
    if (!initialHero) return;
    const follow = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link || !initialHero.contains(link) || link.target || link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      if (href !== '/#library' && href !== '/#build' && href !== '/api-and-mcp') return;
      event.preventDefault();
      if (href === '/#library' || href === '/#build') onNeedFull();
      if (href === '/#library') trackUxEvent('task_started');
      navigate(href);
      if (href === '/#library') requestAnimationFrame(() => document.querySelector<HTMLInputElement>('[data-testid="library-search"]')?.focus());
    };
    const warm = (event: Event) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      const href = link?.getAttribute('href');
      if (href === '/#library' || href === '/#build' || href === '/api-and-mcp') warmRoute(href);
    };
    initialHero.addEventListener('click', follow);
    initialHero.addEventListener('pointerenter', warm, true);
    initialHero.addEventListener('focusin', warm);
    initialHero.addEventListener('touchstart', warm, {passive: true});
    return () => {
      initialHero.removeEventListener('click', follow);
      initialHero.removeEventListener('pointerenter', warm, true);
      initialHero.removeEventListener('focusin', warm);
      initialHero.removeEventListener('touchstart', warm);
    };
  }, [initialHero, onNeedFull]);
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
      <section className="hero" data-home-hero-host={initialHero ? '' : undefined}>
        {showGlobe && <Suspense fallback={null}><Globe /></Suspense>}
        {!initialHero && <div className="wrap hero-in">
          <h1 className="h1">Use AI like the top 1%</h1>
          <p className="lede typed" data-done="true">Turn hours of work into minutes. Spend the time you save on the work only you can do. Or at the beach (we won't tell).</p>
          <div className="hero-actions">
            <Link to="/#library" className="btn btn-primary" onClick={e => { e.preventDefault(); onNeedFull(); trackUxEvent("task_started"); navigate("/#library"); requestAnimationFrame(() => document.querySelector<HTMLInputElement>('[data-testid="library-search"]')?.focus()); }}>Start with a task <ArrowIcon /></Link>
            <Link to="/#build" className="btn btn-line" data-testid="hero-build-workflow" onClick={onNeedFull}>Build a workflow <ArrowIcon /></Link>
          </div>
          <p className="hero-connect small" data-testid="hero-connect"><Link to="/api-and-mcp">Connect your AI once</Link>. Then it pulls any skill or workflow it needs, when it needs it.</p>
        </div>}
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

/** The home list uses the small catalogue index; the builder reads ports and steps, so it opens on the full catalogue. */
function FullBuilder({ toast }: { toast: (m: string) => void }) {
  const { catalogue, error, retry } = useCatalogueState(true);
  if (catalogue) return <Builder c={catalogue} toast={toast} />;
  return <div className="builder" role="status">{error ? <>{error} <button type="button" className="link-btn" onClick={retry}>Try again</button></> : "Opening the steps…"}</div>;
}
