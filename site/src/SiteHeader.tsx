import { useEffect, useRef, useState } from "react";
import { Logo, ThemeToggle } from "./ui";
import { Link, useLocation } from "./lib/router";
import { usePersistence } from "./AccountPersistence";
import AccountSessionActions from "./AccountSessionActions";
import { openBusiness } from "./Business";
import "./site-header.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { path } = useLocation();
  const { account, snapshot } = usePersistence();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(path);
  useEffect(() => { if (previousPath.current !== path) { previousPath.current = path; setOpen(false); } }, [path]);
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
  return <header className="header site-header"><div className="wrap header-in">
    <Link to="/" className="brand" aria-label="AI Blocks, home"><Logo />AI Blocks</Link>
    <div className="site-menu" ref={menu}>
      <button ref={trigger} type="button" className="btn btn-line site-menu-trigger" aria-expanded={open} aria-controls="site-menu-links" data-testid="menu-btn" onClick={() => setOpen(value => !value)}>{open ? "Close menu" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
      {open && <nav id="site-menu-links" className="site-menu-links" aria-label="Sections" data-testid="site-menu" onClick={event => { if ((event.target as Element).closest('a[href], [data-close-menu]')) setOpen(false); }}>
        <section className="site-menu-account" aria-label="My account">
          <Link to="/account?view=settings" aria-current={current("/account")} className="site-menu-account-link">My Account{problem && <span className="account-alert-dot" aria-label="Saving needs attention" />}</Link>
          <p className="small">{account.state === "signed-in" ? "Signed in" : account.state === "loading" ? "Opening your account…" : "Your account and browser saves"}</p>
          <Link to="/account" data-testid="open-saved-work">My saved work</Link>
          <AccountSessionActions onSignedOut={() => setOpen(false)} />
        </section>
        <section aria-label="Start a task">
          <Link to="/#library" aria-current={current("/")}>Find a task</Link>
          <Link to="/#build">Workflow Builder</Link>
          <Link to="/compose" aria-current={current("/compose")} data-testid="nav-compose">Plan a workflow</Link>
          <div className="site-menu-types" aria-label="Task formats">{[["prompt", "Prompts"], ["skill", "Skills"], ["workflow", "Workflows"], ["agent", "Agents"]].map(([kind, label]) => <Link key={kind} to={`/?kind=${kind}#library`}>{label}</Link>)}</div>
        </section>
        <section aria-label="Explore">
          <Link to="/community" aria-current={current("/community")}>Community skills & workflows</Link>
          <Link to="/publish" aria-current={current("/publish")}>Submit your skill or workflow</Link>
          <Link to="/minds" aria-current={current("/minds")} data-testid="nav-minds">Minds</Link>
          <Link to="/tools" aria-current={current("/tools")}>Browser tools</Link>
          <Link to="/apps" aria-current={current("/apps")}>Apps</Link>
          <Link to="/ai-tools" aria-current={current("/ai-tools")} data-testid="nav-ai-tools">AI tools</Link>
          <Link to="/tools/growth-channel-planner">Growth planner</Link>
          <Link to="/from-a-source" aria-current={current("/from-a-source")} data-testid="nav-intake">Create skills from content</Link>
          <Link to="/space" aria-current={current("/space")}>My space</Link>
          <button type="button" data-close-menu onClick={openBusiness}>Business details</button>
        </section>
        <div className="site-menu-appearance"><span>Appearance</span><ThemeToggle /></div>
        <section aria-label="Help">
          <Link to="/how-it-works" aria-current={current("/how-it-works")}>How to use AI Blocks</Link>
          <Link to="/api-and-mcp" aria-current={current("/api-and-mcp")} data-testid="nav-api-mcp">API &amp; MCP</Link>
          <Link to="/api-and-mcp#api" data-testid="nav-documentation">Documentation</Link>
          <Link to="/support" aria-current={current("/support")}>Help & contact</Link>
        </section>
      </nav>}
    </div>
  </div></header>;
}
