// App frame: the library's header and footer, access checks and the page outlet.
// The header, menu and footer are ports of the library's own (site/src/SiteHeader.tsx, SiteFooter.tsx and
// site/src/lib/site-nav.mjs): same markup, class names and CSS (site-header.css, styles.css), so moving between
// useaiblocks.com and this site feels like one product. "Agents" is this site's section in that header.
import type { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { signInHref, useAuth, type Me } from "./lib/auth.tsx";
import { Link, matchPath, useLocation } from "./lib/router.tsx";
import { Button, Logo, Notice, Page, Spinner, ThemeToggle } from "./components.tsx";
import { NAV, PAGES } from "./pages/index.ts";
import type { Access, NavItem } from "./pages/types.ts";
import { NotificationBell } from "./pages/delivery/notifications.tsx";
import "./site-header.css";

function allowed(access: Access, signedIn: boolean, me: Me | null): "ok" | "sign-in" | "invite" | "own-ai" | "denied" {
  if (access === "public") return "ok";
  if (!signedIn || !me) return "sign-in";
  if (access === "signed-in") return "ok";
  // Job pages (describe a job, my jobs) work only while jobs run here: HOSTED_JOBS "on", or the AI Blocks team.
  if (access === "buyer") return !me.hostedJobs ? "own-ai" : me.betaAccess ? "ok" : "invite";
  if (access === "expert") return me.expert?.status === "approved" || me.roles.ops ? "ok" : "denied";
  if (access === "reviewer") return me.roles.reviewer ? "ok" : "denied";
  if (access === "ops") return me.roles.ops ? "ok" : "denied";
  return "denied";
}

// ---------- The library's links (copied from site/src/lib/site-nav.mjs; keep them in step with that file) ----------

export const LIBRARY_URL = "https://useaiblocks.com";
/** A library path as a full address: "/roles" -> "https://useaiblocks.com/roles". */
const lib = (to: string) => `${LIBRARY_URL}${to}`;

/** The main sections: in the header on a laptop, at the top of their menu groups on a phone. [address, label] */
const MAIN_NAV: [string, string][] = [
  ["/#library", "Find a task"],
  ["/roles", "Hire an AI specialist"],
  ["/compose", "Build a workflow"],
  ["/tools", "Tools"],
  ["/minds", "Minds"],
  ["/blog", "Blog"],
];

/** Every main library page, one menu click from anywhere, grouped by what people came to do. */
const MENU_GROUPS: { id: string; label: string; links: [string, string][] }[] = [
  { id: "find", label: "Find", links: [["/#library", "Find a task"], ["/minds", "Minds"], ["/tools", "Tools"], ["/ai-tools", "AI tool guides"]] },
  { id: "build", label: "Build", links: [["/compose", "Build a workflow"], ["/get-it-done", "Get a whole job done"], ["/from-a-source", "Turn an article or video into a workflow"], ["/apps", "Turn a workflow into an app"]] },
  { id: "ai-agents", label: "AI agents", links: [["/roles", "Hire an AI specialist"], ["/teams", "Plan an AI team"]] },
  { id: "blog", label: "Blog", links: [["/blog", "All articles and guides"], ["/train-your-own-ai-agent", "Train your own AI agent"], ["/industries", "AI help by business"], ["/how-we-test", "How we test"]] },
  { id: "your-ai", label: "Your AI", links: [["/api-and-mcp", "Connect your AI"], ["/me-md", "Your me.md file"], ["/space", "Team space"]] },
  { id: "help", label: "Help", links: [["/how-it-works", "How it works"], ["/api-and-mcp#api", "Documentation"], ["/support", "Help & contact"]] },
];

/** The footer: three short columns, then the policies in the bottom row. */
const FOOTER_GROUPS: { label: string; links: [string, string][] }[] = [
  { label: "Explore", links: [["/#library", "Find a task"], ["/roles", "Hire an AI specialist"], ["/compose", "Build a workflow"], ["/tools", "Tools"], ["/minds", "Minds"], ["/industries", "AI help by business"]] },
  { label: "Your AI", links: [["/api-and-mcp", "Connect your AI"], ["/space", "Team space"], ["/api-and-mcp#api", "Documentation"]] },
  { label: "Help", links: [["/blog", "Blog"], ["/how-it-works", "How it works"], ["/how-we-test", "How we test"], ["/support", "Help & contact"], ["/about", "About AI Blocks"]] },
];
const FOOTER_LINE = "Reusable AI skills and workflows for the work you do.";
const SUPPORT_EMAIL = "hello@useaiblocks.com";
const POLICIES: [string, string][] = [["/privacy", "Privacy policy"], ["/terms", "Terms of service"], ["/cookies", "Cookies & storage"], ["/ai-disclaimer", "AI disclaimer"]];

/** This site's section in the library's header. It sits second, after "Find a task", like the library hero's
 *  "Find an agent" button. */
const AGENTS_HOME = "/agents";

/** Laptop or wider: the main sections sit in the header itself instead of the menu. The library switches at
 *  1000px; this header also holds "Agents" and the messages bell, so it switches a little later. */
const WIDE = "(min-width: 1100px)";
function useWide() {
  const [wide, setWide] = useState(() => typeof matchMedia === "function" && matchMedia(WIDE).matches);
  useEffect(() => { const query = matchMedia(WIDE), on = () => setWide(query.matches); on(); query.addEventListener("change", on); return () => query.removeEventListener("change", on); }, []);
  return wide;
}

/** This site's own links, as NAV allows for the visitor: hiring first, then the account and staff pages. */
function siteLinks(me: Me | null): NavItem[] {
  const visible = NAV.filter(n => !n.show || n.show(me));
  return [...visible.filter(n => n.group === "main"), ...visible.filter(n => n.group === "account")];
}

/** The library's header (site/src/SiteHeader.tsx): mark and name, the main links on a laptop, Sign in, then one
 *  menu ("More" on a laptop, "Menu" on a phone, where it also holds the main links). The messages bell sits just
 *  before the menu once someone is signed in. */
function SiteHeader() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const wide = useWide();
  const { path } = useLocation();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(path);
  useEffect(() => { if (previousPath.current !== path) { previousPath.current = path; setOpen(false); } }, [path]);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>("nav a[href]")?.focus();
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  // A link is current on its own page; the Agents section also covers each agent's page.
  const here = (to: string) => (path === to || (to === AGENTS_HOME && path.startsWith(`${to}/`)) ? "page" as const : undefined);
  const signedIn = auth.signedIn;
  const signIn = signInHref();
  const own = siteLinks(auth.me).filter(n => n.href !== "/jobs");
  // On a laptop the header already shows the main sections, so the menu leaves them out.
  const inHeader = new Set(MAIN_NAV.map(([to]) => to));
  const groups = MENU_GROUPS.map(group => ({ ...group, links: wide ? group.links.filter(([to]) => !inHeader.has(to)) : group.links }));
  const agents = wide ? own.filter(n => n.href !== AGENTS_HOME) : own;
  const status = signedIn ? (auth.displayName ? `Signed in as ${auth.displayName}` : "Signed in") : auth.loaded ? "Not signed in" : "Opening your account…";
  const main: [string, string][] = [MAIN_NAV[0], [AGENTS_HOME, "Agents"], ...MAIN_NAV.slice(1)];
  return <header class="header site-header"><div class="wrap header-in">
    <Link href="/" class="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
    {wide && <nav class="site-nav" aria-label="Main">{main.map(([to, label]) => to === AGENTS_HOME
      ? <Link href={to} aria-current={here(to)}>{label}</Link>
      : <a href={lib(to)}>{label}</a>)}</nav>}
    {wide && !signedIn && auth.loaded && <Link href={signIn} class="btn btn-line btn-sm site-sign-in">Sign in</Link>}
    <NotificationBell />
    <div class="site-menu" ref={menu}>
      <button ref={trigger} type="button" class="btn btn-line site-menu-trigger" aria-expanded={open} aria-controls="site-menu-links" onClick={() => setOpen(value => !value)}><span class="site-menu-word-phone">{open ? "Close menu" : "Menu"}</span><span class="site-menu-word-wide">{open ? "Close" : "More"}</span><span aria-hidden="true">{open ? "−" : "+"}</span></button>
      {open && <nav id="site-menu-links" class="site-menu-links" aria-label="Sections" onClick={(event: MouseEvent) => { if ((event.target as Element).closest("a[href], [data-close-menu]")) setOpen(false); }}>
        {agents.length > 0 && <section aria-labelledby="menu-agents">
          <h2 class="site-menu-label" id="menu-agents">Agents</h2>
          {agents.map(n => <Link href={n.href} aria-current={here(n.href)}>{n.label}</Link>)}
        </section>}
        {groups.map(group => group.links.length > 0 && <section aria-labelledby={`menu-${group.id}`}>
          <h2 class="site-menu-label" id={`menu-${group.id}`}>{group.label}</h2>
          {group.links.map(([to, label]) => <a href={lib(to)}>{label}</a>)}
        </section>)}
        <section class="site-menu-account" aria-label="Your account">
          <p class="small site-menu-status">{status}</p>
          {signedIn && auth.me?.hostedJobs && <Link href="/jobs" aria-current={here("/jobs")} class="site-menu-account-link">My jobs</Link>}
          {signedIn
            ? <div class="account-session-actions"><button type="button" class="btn btn-line btn-sm" data-close-menu onClick={() => { void auth.signOut(); }}>Sign out</button></div>
            : auth.loaded ? <div class="account-session-actions"><Link href={signIn} class="btn btn-line btn-sm">Sign in</Link></div> : null}
        </section>
        <div class="site-menu-appearance"><span>Appearance</span><ThemeToggle /></div>
      </nav>}
    </div>
  </div></header>;
}

/** The library's footer (site/src/SiteFooter.tsx): name, one line and the support address, short columns of links,
 *  then the year and the policies. This site adds an "Agents" column first. */
function SiteFooter() {
  const auth = useAuth();
  const jobs = !!auth.me?.hostedJobs;
  return <footer class="footer">
    <div class="wrap">
      <div class="footer-grid"><div class="footer-brand"><Link href="/" class="footer-name">AI Blocks</Link><p>{FOOTER_LINE}</p><a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("AI Blocks support")}`} class="footer-email">{SUPPORT_EMAIL}</a><span class="small">Support, feedback and privacy requests</span></div>
        <nav aria-label="Footer agents"><h2>Agents</h2>
          <Link href="/agents">Browse agents</Link>
          {jobs && <Link href="/new">Describe a job</Link>}
          {jobs && <Link href="/jobs">My jobs</Link>}
          <Link href="/connect">Connect your AI</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/job-posts/new">Post a job for experts</Link>
          <Link href="/experts/apply">Apply as an expert</Link>
          <a href={LIBRARY_URL}>AI Blocks library</a>
        </nav>
        {FOOTER_GROUPS.map(group => <nav aria-label={`Footer ${group.label.toLowerCase()}`}><h2>{group.label}</h2>
          {group.links.map(([to, label]) => <a href={lib(to)}>{label}</a>)}
        </nav>)}
      </div>
      <div class="footer-bottom"><span>© {new Date().getFullYear()} AI Blocks</span><nav aria-label="Policies">{POLICIES.map(([to, label]) => <a href={lib(to)}>{label}</a>)}</nav></div>
    </div>
  </footer>;
}

/** Pages that need an account or a role say where the visitor is, why they cannot see it yet, and what to do next. */
function Gate(props: { access: Access; children: JSX.Element }) {
  const auth = useAuth();
  if (!auth.loaded) return <main class="page"><Spinner label="Opening your account…" /></main>;
  const verdict = allowed(props.access, auth.signedIn, auth.me);
  if (verdict === "ok") return props.children;
  if (verdict === "sign-in") {
    return (
      <Page title="Sign in to continue" intro="This page needs an account. It is the same account as useaiblocks.com.">
        <div class="row"><Button href={signInHref()}>Sign in</Button><Button kind="secondary" href="/agents">Browse agents first</Button></div>
      </Page>
    );
  }
  if (verdict === "own-ai") {
    return (
      <Page title="Our agents work in your own AI" intro="We do not run jobs on this site. Every agent is free: download it, or connect your AI and load it there. It then works in Claude, ChatGPT, Gemini, Codex or Cursor, on your own plan.">
        <div class="row"><Button href="/agents">Find an agent</Button><Button kind="secondary" href="/connect">Connect your AI</Button></div>
      </Page>
    );
  }
  if (verdict === "invite") {
    return (
      <Page title="You need an invite code" intro="Hiring needs an invite code right now. Enter your code, then you can hire any agent.">
        <div class="row"><Button href={`/invite?next=${encodeURIComponent(location.pathname + location.search)}`}>Enter invite code</Button><Button kind="secondary" href="/agents">Browse agents</Button></div>
      </Page>
    );
  }
  return (
    <Page title="Not available" intro="This page is for the AI Blocks team or for approved experts, so your account cannot open it.">
      <Notice tone="warn">If you think you should see this page, write to {SUPPORT_EMAIL}.</Notice>
      <Button href="/agents">Browse agents</Button>
    </Page>
  );
}

export function App() {
  const { path, query } = useLocation();
  let matched: { page: (typeof PAGES)[number]; params: Record<string, string> } | null = null;
  for (const page of PAGES) {
    const params = page.path === "*" ? {} : matchPath(page.path, path);
    if (params) { matched = { page, params }; break; }
  }
  const Comp = matched!.page.component;
  return (
    <>
      <a class="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <div id="main-content" tabIndex={-1}>
        <Gate access={matched!.page.access}><Comp params={matched!.params} query={query} /></Gate>
      </div>
      <SiteFooter />
    </>
  );
}
