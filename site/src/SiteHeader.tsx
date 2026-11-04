import { useEffect, useRef, useState } from "react";
import { Logo, ThemeToggle } from "./ui";
import { Link, useLocation } from "./lib/router";
import { usePersistence } from "./AccountPersistence";
import AccountSessionActions from "./AccountSessionActions";
import { openBusiness } from "./Business";
import { rememberVisit } from "./lib/saved-work";
import "./site-header.css";

// Every main page is one menu click from anywhere, grouped by what people came to do.
// Each link: [address, label, test id]. Policies and About sit in the footer.
const MENU: { id: string; label: string; links: [string, string, string][] }[] = [
  { id: "find", label: "Find", links: [["/#library", "Find a task", "find"], ["/minds", "Minds", "minds"], ["/tools", "Tools", "tools"], ["/ai-tools", "AI tool guides", "ai-tools"], ["/industries", "AI help by business", "industries"]] },
  { id: "build", label: "Build", links: [["/compose", "Plan a job", "compose"], ["/get-it-done", "Get a whole job done", "get-it-done"], ["/from-a-source", "Turn an article or video into a workflow", "source"], ["/apps", "Turn a workflow into an app", "apps"]] },
  { id: "agents", label: "AI agents", links: [["/roles", "Hire an AI specialist", "roles"], ["/train-your-own-ai-agent", "Train your own AI agent", "train"], ["/teams", "Plan an AI team", "teams"]] },
  { id: "your-ai", label: "Your AI", links: [["/api-and-mcp", "Connect your AI", "api-mcp"], ["/me-md", "Your me.md file", "memd"], ["/space", "Team space", "space"]] },
  { id: "help", label: "Help", links: [["/how-it-works", "How it works", "guide"], ["/how-we-test", "How we test", "how-we-test"], ["/api-and-mcp#api", "Documentation", "documentation"], ["/support", "Help & contact", "support"]] },
];
// Pages built only as plain HTML (scripts/lib/trust-pages.mjs): open them with a normal page load, not the in-app router.
const STATIC_PAGES = ["/industries", "/how-we-test"];

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
  // A link is current on its own page; section links (/roles) also cover the pages under them.
  const here = (to: string) => {
    if (to.includes("#")) return to === "/#library" && path === "/" ? "page" as const : undefined;
    return path === to || (["/roles", "/tools", "/ai-tools", "/apps", "/get-it-done"].includes(to) && path.startsWith(`${to}/`)) ? "page" as const : undefined;
  };
  return <header className="header site-header"><div className="wrap header-in">
    <Link to="/" className="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
    <div className="site-menu" ref={menu}>
      <button ref={trigger} type="button" className="btn btn-line site-menu-trigger" aria-expanded={open} aria-controls="site-menu-links" data-testid="menu-btn" onClick={() => setOpen(value => !value)}>{open ? "Close menu" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
      {open && <nav id="site-menu-links" className="site-menu-links" aria-label="Sections" data-testid="site-menu" onClick={event => { if ((event.target as Element).closest('a[href], [data-close-menu]')) setOpen(false); }}>
        {MENU.map(group => <section key={group.id} aria-labelledby={`menu-${group.id}`}>
          <h2 className="site-menu-label" id={`menu-${group.id}`}>{group.label}</h2>
          {group.links.map(([to, label, id]) => STATIC_PAGES.includes(to)
            ? <a key={to} href={to} data-testid={`nav-${id}`}>{label}</a>
            : <Link key={to} to={to} aria-current={here(to)} data-testid={`nav-${id}`}>{label}</Link>)}
        </section>)}
        <section className="site-menu-account" aria-label="My account">
          <Link to="/account?view=settings" aria-current={current("/account")} className="site-menu-account-link">My Account{problem && <span className="account-alert-dot" aria-label="Saving needs attention" />}</Link>
          <p className="small">{account.state === "signed-in" ? "Signed in" : account.state === "loading" ? "Opening your account…" : "Your account and browser saves"}</p>
          <Link to="/account" data-testid="open-saved-work">My work</Link>
          <AccountSessionActions onSignedOut={() => setOpen(false)} />
          <button type="button" data-close-menu onClick={openBusiness} data-testid="nav-brand-file">Your brand file</button>
        </section>
        <div className="site-menu-appearance"><span>Appearance</span><ThemeToggle /></div>
      </nav>}
    </div>
  </div></header>;
}
