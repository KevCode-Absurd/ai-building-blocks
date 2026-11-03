import { useEffect, useRef, useState } from "react";
import { Logo, ThemeToggle } from "./ui";
import { Link, useLocation } from "./lib/router";
import { usePersistence } from "./AccountPersistence";
import AccountSessionActions from "./AccountSessionActions";
import { openBusiness } from "./Business";
import { rememberVisit } from "./lib/saved-work";
import "./site-header.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
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
  return <header className="header site-header"><div className="wrap header-in">
    <Link to="/" className="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
    <div className="site-menu" ref={menu}>
      <button ref={trigger} type="button" className="btn btn-line site-menu-trigger" aria-expanded={open} aria-controls="site-menu-links" data-testid="menu-btn" onClick={() => setOpen(value => !value)}>{open ? "Close menu" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
      {open && <nav id="site-menu-links" className="site-menu-links" aria-label="Sections" data-testid="site-menu" onClick={event => { if ((event.target as Element).closest('a[href], [data-close-menu]')) setOpen(false); }}>
        <section aria-label="Main sections">
          <Link to="/#library" aria-current={current("/")} data-testid="nav-find">Find a task</Link>
          <Link to="/roles" aria-current={path === "/roles" || path.startsWith("/roles/") ? "page" : undefined} data-testid="nav-roles">Hire an AI specialist</Link>
          <Link to="/compose" aria-current={current("/compose")} data-testid="nav-compose">Plan a job</Link>
          <Link to="/minds" aria-current={current("/minds")} data-testid="nav-minds">Minds</Link>
          <Link to="/tools" aria-current={inTools ? "page" : undefined} data-testid="nav-tools">Tools</Link>
          <Link to="/space" aria-current={current("/space")} data-testid="nav-space">Team space</Link>
        </section>
        <section aria-label="Your AI">
          <Link to="/api-and-mcp" aria-current={current("/api-and-mcp")} data-testid="nav-api-mcp">Connect your AI</Link>
        </section>
        <section className="site-menu-account" aria-label="My account">
          <Link to="/account?view=settings" aria-current={current("/account")} className="site-menu-account-link">My Account{problem && <span className="account-alert-dot" aria-label="Saving needs attention" />}</Link>
          <p className="small">{account.state === "signed-in" ? "Signed in" : account.state === "loading" ? "Opening your account…" : "Your account and browser saves"}</p>
          <Link to="/account" data-testid="open-saved-work">My work</Link>
          <AccountSessionActions onSignedOut={() => setOpen(false)} />
          <button type="button" data-close-menu onClick={openBusiness}>Business details</button>
        </section>
        <div className="site-menu-appearance"><span>Appearance</span><ThemeToggle /></div>
      </nav>}
    </div>
  </div></header>;
}
