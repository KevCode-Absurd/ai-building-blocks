import {StartupContext,StartupReady} from "./StartupReady";
import LibraryLoading from "./LibraryLoading";
import ComposePage from "./ComposeRoute";
import MindsRoute from "./MindsRoute";
import RolesRoute from "./RolesRoute";
import BlockRoute from "./BlockRoute";
import {prefetchRole} from "./roles/role-data";
import { spaceKey, spaces } from "./lib/space";
import { syncPageMetadata } from "./lib/page-metadata";
import { Suspense, lazy, useCallback, useEffect, useState, type ComponentType } from "react";
import { Drawer, Toast } from "./ui";
import { type Catalogue, type Kind, KINDS, loadCatalogue, loadPage, pathOf, useCatalogueState, useItemCatalogue, useMindsCatalogue } from "./lib/data";
import { kits, queueForCanvas, useStore } from "./lib/store";
import { SaveHint } from "./AccountPersistence";
import "./simplicity.css";
import "./home-library.css";
import { Link, navigate, setPrefetch, useLocation } from "./lib/router";
import { BusinessDrawer, useBusinessOpener } from "./Business";
import { TailorDrawer, useTailorOpener } from "./Tailor";
import SiteHeader from "./SiteHeader";
import { infoPage } from "./lib/site-info-nav.mjs";
import SiteFooter from "./SiteFooter";
import PageRecovery from "./PageRecovery";
import { initialPageHtml } from "./lib/public-opening";
import {readItemOpening} from "./lib/item-opening";
import { OutcomesRoute, isOutcomePath } from "./outcomes-site/route";


// The other pages load after the home page has drawn, while the browser is idle, so a click opens them at once.
const PAGES = {
  home: () => import("./HomePage"),
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
  teams: () => import("./teams/TeamPage"),
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
  if (path === "/teams") return "teams";
  if (path === "/how-it-works") return "guide";
  return null;
}
// The readiness marker lives inside the resolved lazy component: Preact can
// commit a sibling effect while a Suspense fallback is still on screen.
// ownReady: the page lifts the cover itself once its content is in (a block page waits for its text, so the header
// does not grow under the reader after the cover lifts).
function startupPage<P extends object>(load: () => Promise<{ default: ComponentType<P> }>, ownReady = false) {
  return lazy(async () => {
    const { default: Page } = await load();
    return { default: (props: P) => <><Page {...props} />{!ownReady && <StartupReady />}</> };
  });
}
const Home = startupPage(PAGES.home, true);
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
const TeamPage = startupPage(PAGES.teams,true);
const SpacePage = startupPage(PAGES.space);
const IntakePage = startupPage(PAGES.intake);
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
      if (/^\/roles(?:\/|$)/.test(to)) { const id = /^\/roles\/([a-z0-9-]+)$/.exec(to)?.[1] ?? null; prefetchRole(id, Number(/^\/roles\/page\/([1-9]\d*)$/.exec(to)?.[1] ?? 1)); return; }
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

const KIND_PATHS: Record<string, Kind> = Object.fromEntries(KINDS.map((k) => [k.path, k.id]));

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

/** While a block page's catalogue loads, keep the server's readable page under the loading cover, so a slow
 * load can still show the content (index.html reveals it instead of an error). */
function BlockPending({ path }: { path: string }) {
  const html = initialPageHtml(path);
  return html ? <div data-testid="public-opening" dangerouslySetInnerHTML={{ __html: html }} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>;
}

export default function App() {
  useIdlePrefetch();
  useHashLanding();
  const { path, search } = useLocation();
  const [kitsOpen, setKitsOpen] = useState(false);
  const parts = path.split("/").filter(Boolean);
  const pageSlug = parts.length === 2 && KIND_PATHS[parts[0]] ? parts[1] : null;
  const itemState = useItemCatalogue(pageSlug);
  // Sign-in, community and calculator pages never show catalogue items. My account names the skills in saved
  // kits, so it waits for kits and then needs only the small list index (4 MB less for most visitors).
  const hasKits = useStore(s => s.kits.length > 0);
  const needsCatalogue = !infoPage(path) && !isOutcomePath(path) && !["/roles", "/teams", "/ai-tools", "/tools", "/apps", "/how-it-works", "/traction", "/api-and-mcp", "/api-and-mcp.html", "/me-md", "/sign-in", "/sign-up", "/community", "/publish", "/my-submissions", "/admin/review"].some((p) => path === p || path.startsWith(`${p}/`)) && (path !== "/account" || hasKits);
  const listTier = path === "/" || (path === "/account" && !kitsOpen);
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
  // Prepare the library on request intent; the untouched form needs no full catalogue.
  const [composeRequested, setComposeRequested] = useState(false);
  const requestComposeCatalogue = useCallback(() => { setComposeRequested(true); return loadCatalogue(); }, []);
  const mindsState = useMindsCatalogue(path === "/minds", search.has("q"));
  const catalogueState = useCatalogueState((needsCatalogue && path !== "/minds" && !pageSlug && (!starterFirst || homeCatalogueRequested) && (path !== "/compose" || composeRequested)) || kitsOpen, { starterFirst, tier: listTier ? "index" : "full" });
  // Without starter picks there is nothing light to show, so open the library straight away.
  useEffect(() => { if (catalogueState.starterFailed) requestHomeCatalogue(); }, [catalogueState.starterFailed, requestHomeCatalogue]);
  const c = pageSlug ? itemState.catalogue : path === "/minds" ? mindsState.catalogue : catalogueState.catalogue;
  const pageError = pageSlug ? itemState.error : path === "/minds" ? mindsState.error : catalogueState.error;
  const retryPage = pageSlug ? itemState.retry : path === "/minds" ? mindsState.retry : catalogueState.retry;
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
  // Resolve renamed and legacy addresses before revealing the first page.
  const now = (s: string | null) => (c && s ? c.bySlug[s] ?? c.bySlug[c.renamed?.[s] ?? ""] : undefined);
  const old = now(search.get("block"));
  const here = now(pageSlug);
  const redirectTo = LEGACY_PATHS[path] ?? (old ? pathOf(old) : here && pathOf(here) !== path ? pathOf(here) : null);
  // Optional library data must not delay the home hero or the space form.
  const waitingForCatalogue = !c && !pageError && (pageSlug !== null && !readItemOpening(pageSlug) || ["/from-a-source"].includes(path)
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
          {pageError && !c && (pageSlug !== null || ["/compose", "/from-a-source"].includes(path)) ? <main><StartupReady /><LibraryLoading error={pageError} retry={retryPage} /></main> : infoPage(path) ? (
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
          ) : path === "/teams" ? (
            <TeamPage toast={setToast} />
          ) : path === "/roles" || path.startsWith("/roles/") ? (
            <RolesRoute key={path} path={path} toast={setToast} />
          ) : path === "/minds" ? (
            <MindsRoute c={c} toBuilder={toBuilder} complete={mindsState.complete} onNeedFull={mindsState.requestFull} error={mindsState.error} retry={mindsState.retry} />
          ) : path === "/compose" ? (
            // The builder opens at once; it plans once the task library is here (ComposePage.tsx).
            <ComposePage c={c} toast={setToast} requestCatalogue={requestComposeCatalogue} />
          ) : path === "/from-a-source" ? (
            c ? <IntakePage c={c} toast={setToast} /> : <main className="wrap bp-hero"><p className="small">Loading…</p></main>
          ) : isOutcomePath(path) ? (
            <OutcomesRoute path={path} toast={setToast} />
          ) : ["/api-and-mcp", "/api-and-mcp.html"].includes(path) ? (
            <ApiMcpPage />
          ) : path === "/me-md" ? (
            <MeMdPage />
          ) : path === "/how-it-works" ? (
            <HowItWorks toast={setToast} />
          ) : pageSlug ? (
            parts[0] === "minds" ? (c ? <BlockPage c={c} slug={pageSlug} toast={setToast} toBuilder={toBuilder} /> : <BlockPending path={path} />)
              : <BlockRoute key={pageSlug} c={c} slug={pageSlug} toast={setToast} toBuilder={toBuilder} />
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
      {catalogueState.catalogue && kitsOpen && <KitsDrawer c={catalogueState.catalogue} onClose={closeKits} toBuilder={toBuilder} toast={setToast} />}
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
