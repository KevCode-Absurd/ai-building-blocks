// App frame: header, access checks and the page outlet.
import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { useAuth, type Me } from "./lib/auth.tsx";
import { Link, matchPath, useLocation } from "./lib/router.tsx";
import { Button, Notice, Page, Spinner } from "./components.tsx";
import { NAV, PAGES } from "./pages/index.ts";
import type { Access } from "./pages/types.ts";

function allowed(access: Access, signedIn: boolean, me: Me | null): "ok" | "sign-in" | "invite" | "denied" {
  if (access === "public") return "ok";
  if (!signedIn || !me) return "sign-in";
  if (access === "signed-in") return "ok";
  if (access === "buyer") return me.betaAccess ? "ok" : "invite";
  if (access === "expert") return me.expert?.status === "approved" || me.roles.ops ? "ok" : "denied";
  if (access === "reviewer") return me.roles.reviewer ? "ok" : "denied";
  if (access === "ops") return me.roles.ops ? "ok" : "denied";
  return "denied";
}

function Header() {
  const auth = useAuth();
  const { path } = useLocation();
  const [open, setOpen] = useState(false);
  const main = NAV.filter(n => n.group === "main" && (!n.show || n.show(auth.me)));
  const account = NAV.filter(n => n.group === "account" && (!n.show || n.show(auth.me)));
  return (
    <header class="site-header">
      <Link href="/" class="brand"><img src="/logo.svg" alt="" width={24} height={24} class="brand-logo" /><span>AI Blocks <b>Agents</b></span></Link>
      <nav class={`nav${open ? " nav-open" : ""}`} aria-label="Main">
        {main.map(n => <Link href={n.href} class="nav-link" aria-current={path === n.href || path.startsWith(n.href + "/") ? "page" : undefined}>{n.label}</Link>)}
      </nav>
      <div class="header-end">
        {auth.signedIn ? (
          <details class="account">
            <summary>{auth.displayName || "Account"}</summary>
            <div class="account-menu">
              {account.map(n => <Link href={n.href} class="account-link">{n.label}</Link>)}
              <button class="account-link" onClick={() => auth.signOut()}>Sign out</button>
            </div>
          </details>
        ) : auth.loaded ? <Button small onClick={auth.openSignIn}>Sign in</Button> : null}
        <button class="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      </div>
    </header>
  );
}

function Gate(props: { access: Access; children: JSX.Element }) {
  const auth = useAuth();
  if (!auth.loaded) return <main class="page"><Spinner /></main>;
  const verdict = allowed(props.access, auth.signedIn, auth.me);
  if (verdict === "ok") return props.children;
  if (verdict === "sign-in") return <Page title="Sign in to continue" intro="Use the same account as the AI Blocks library."><Button onClick={auth.openSignIn}>Sign in</Button></Page>;
  if (verdict === "invite") return <Page title="The beta is invite-only" intro="Enter your invite code to order work."><Button href={`/invite?next=${encodeURIComponent(location.pathname + location.search)}`}>Enter invite code</Button></Page>;
  return <Page title="Not available"><Notice tone="warn">This page is not available on your account.</Notice></Page>;
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
      <Header />
      <Gate access={matched!.page.access}><Comp params={matched!.params} query={query} /></Gate>
      <footer class="site-footer">
        <span>AI Blocks Agents · Beta</span>
        <a href="https://useaiblocks.com">Free AI Blocks library</a>
        <a href="https://useaiblocks.com/support">Help & contact</a>
      </footer>
    </>
  );
}
