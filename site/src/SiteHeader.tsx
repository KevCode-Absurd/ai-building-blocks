import { useEffect, useRef, useState } from "react";
import { Logo, ThemeToggle } from "./ui";
import { Link, useLocation } from "./lib/router";
import { usePersistence } from "./AccountPersistence";
import AccountSessionActions from "./AccountSessionActions";
import { openBusiness } from "./Business";
import { rememberVisit } from "./lib/saved-work";
import { MAIN_NAV, MENU_GROUPS, isStaticPage } from "./lib/site-nav.mjs";
import "./site-header.css";

const WIDE = "(min-width: 1000px)";
/** Laptop or wider: the main sections sit in the header itself instead of the menu. */
function useWide() {
  const [wide, setWide] = useState(() => typeof matchMedia === "function" && matchMedia(WIDE).matches);
  useEffect(() => { const query = matchMedia(WIDE), on = () => setWide(query.matches); on(); query.addEventListener("change", on); return () => query.removeEventListener("change", on); }, []);
  return wide;
}

// The links live in lib/site-nav.mjs, shared with the plain pages built without the app.
const main = MAIN_NAV.map(([to, label, id]) => ({ to, label, id }));
const MENU = MENU_GROUPS as { id: string; label: string; links: [string, string, string][] }[];
const IN_HEADER = new Set(main.map(item => item.to));

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const wide = useWide();
  const { path } = useLocation();
  const { account, snapshot } = usePersistence();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(path);
  useEffect(() => { if (previousPath.current !== path) { previousPath.current = path; setOpen(false); } }, [path]);
  useEffect(() => rememberVisit(path), [path]);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>('nav a[href]')?.focus();
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  const problem = snapshot.status === "error" || snapshot.status === "conflict";
  // A link is current on its own page; section links (/roles) also cover the pages under them.
  const here = (to: string) => {
    if (to.includes("#")) return to === "/#library" && path === "/" ? "page" as const : undefined;
    return path === to || (["/roles", "/tools", "/ai-tools", "/apps", "/get-it-done", "/minds"].includes(to) && path.startsWith(`${to}/`)) ? "page" as const : undefined;
  };
  const signedIn = account.state === "signed-in";
  // On a laptop the header already shows the main sections, so the menu leaves them out.
  const groups = MENU.map(group => ({ ...group, links: wide ? group.links.filter(([to]) => !IN_HEADER.has(to)) : group.links }));
  return <header className="header site-header"><div className="wrap header-in">
    <Link to="/" className="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
    {wide && <nav className="site-nav" aria-label="Main">{main.map(item => <Link key={item.id} to={item.to} aria-current={here(item.to) ?? (item.to === "/tools" && (path === "/ai-tools" || path.startsWith("/ai-tools/")) ? "page" : undefined)} data-testid={item.id}>{item.label}</Link>)}</nav>}
    {wide && !signedIn && account.state !== "loading" && <Link to="/sign-in" className="btn btn-line btn-sm site-sign-in" data-testid="top-sign-in">Sign in</Link>}
    <div className="site-menu" ref={menu}>
      <button ref={trigger} type="button" className="btn btn-line site-menu-trigger" aria-expanded={open} aria-controls="site-menu-links" data-testid="menu-btn" onClick={() => setOpen(value => !value)}><span className="site-menu-word-phone">{open ? "Close menu" : "Menu"}</span><span className="site-menu-word-wide">{open ? "Close" : "More"}</span><span aria-hidden="true">{open ? "−" : "+"}</span>{problem && <span className="account-alert-dot" aria-label="Saving needs attention" />}</button>
      {open && <nav id="site-menu-links" className="site-menu-links" aria-label="Sections" data-testid="site-menu" onClick={event => { if ((event.target as Element).closest('a[href], [data-close-menu]')) setOpen(false); }}>
        {groups.map(group => <section key={group.id} aria-labelledby={`menu-${group.id}`}>
          <h2 className="site-menu-label" id={`menu-${group.id}`}>{group.label}</h2>
          {group.links.map(([to, label, id]) => isStaticPage(to)
            ? <a key={to} href={to} data-testid={`nav-${id}`}>{label}</a>
            : <Link key={to} to={to} aria-current={here(to)} data-testid={`nav-${id}`}>{label}</Link>)}
        </section>)}
        <section className="site-menu-account" aria-label="Your account">
          <p className="small site-menu-status">{signedIn ? "Signed in" : account.state === "loading" ? "Opening your account…" : "Saved in this browser"}</p>
          <Link to="/account" aria-current={path === "/account" ? "page" : undefined} className="site-menu-account-link" data-testid="open-saved-work">My work{problem && <span className="account-alert-dot" aria-label="Saving needs attention" />}</Link>
          <button type="button" data-close-menu onClick={openBusiness} data-testid="nav-brand-file">Your brand file</button>
          <Link to="/account?view=settings" data-testid="nav-settings">Account settings</Link>
          <AccountSessionActions onSignedOut={() => setOpen(false)} />
        </section>
        <div className="site-menu-appearance"><span>Appearance</span><ThemeToggle /></div>
      </nav>}
    </div>
  </div></header>;
}
