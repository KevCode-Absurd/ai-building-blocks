import { useEffect, useRef, useState } from "react";
import { Logo, ThemeToggle } from "./ui";
import { Link, useLocation } from "./lib/router";
import { usePersistence } from "./AccountPersistence";
import AccountSessionActions from "./AccountSessionActions";
import { openBusiness } from "./Business";
import { rememberVisit } from "./lib/saved-work";
import "./site-header.css";

const WIDE = "(min-width: 1000px)";
/** Laptop or wider: the main sections sit in the header itself instead of the menu. */
function useWide() {
  const [wide, setWide] = useState(() => typeof matchMedia === "function" && matchMedia(WIDE).matches);
  useEffect(() => { const query = matchMedia(WIDE), on = () => setWide(query.matches); on(); query.addEventListener("change", on); return () => query.removeEventListener("change", on); }, []);
  return wide;
}

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
  const current = (target: string) => path === target ? "page" as const : undefined;
  const inTools = path === "/tools" || path.startsWith("/tools/") || path === "/ai-tools" || path.startsWith("/ai-tools/");
  const inRoles = path === "/roles" || path.startsWith("/roles/");
  // One name per destination: the same words appear in this header, the menu, the footer and each page title.
  const main = [
    { to: "/#library", label: "Find a task", id: "nav-find", on: path === "/" },
    { to: "/roles", label: "Hire an AI specialist", id: "nav-roles", on: inRoles },
    { to: "/compose", label: "Build a workflow", id: "nav-compose", on: path === "/compose" },
    { to: "/tools", label: "Tools", id: "nav-tools", on: inTools },
    { to: "/minds", label: "Minds", id: "nav-minds", on: path === "/minds" || path.startsWith("/minds/") },
  ];
  const signedIn = account.state === "signed-in";
  return <header className="header site-header"><div className="wrap header-in">
    <Link to="/" className="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
    {wide && <nav className="site-nav" aria-label="Main">{main.map(item => <Link key={item.id} to={item.to} aria-current={item.on ? "page" : undefined} data-testid={item.id}>{item.label}</Link>)}</nav>}
    {wide && !signedIn && account.state !== "loading" && <Link to="/sign-in" className="btn btn-line btn-sm site-sign-in" data-testid="top-sign-in">Sign in</Link>}
    <div className="site-menu" ref={menu}>
      <button ref={trigger} type="button" className="btn btn-line site-menu-trigger" aria-expanded={open} aria-controls="site-menu-links" data-testid="menu-btn" onClick={() => setOpen(value => !value)}><span className="site-menu-word-phone">{open ? "Close menu" : "Menu"}</span><span className="site-menu-word-wide">{open ? "Close" : "More"}</span><span aria-hidden="true">{open ? "−" : "+"}</span>{problem && <span className="account-alert-dot" aria-label="Saving needs attention" />}</button>
      {open && <nav id="site-menu-links" className="site-menu-links" aria-label="Sections" data-testid="site-menu" onClick={event => { if ((event.target as Element).closest('a[href], [data-close-menu]')) setOpen(false); }}>
        <section aria-label="Main sections" className="site-menu-main">
          {!wide && main.map(item => <Link key={item.id} to={item.to} aria-current={item.on ? "page" : undefined} data-testid={item.id}>{item.label}</Link>)}
          <Link to="/space" aria-current={current("/space")} data-testid="nav-space">Team space</Link>
          <Link to="/api-and-mcp" aria-current={current("/api-and-mcp")} data-testid="nav-api-mcp">Connect your AI</Link>
        </section>
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
