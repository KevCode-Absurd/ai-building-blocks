// Core pages: home, sign-in, invite code, and not found. The directory module owns the agent pages (/agents).
import { useLayoutEffect, useState, useEffect } from "preact/hooks";
import type { NavItem, PageDef } from "./types.ts";
import { ArrowIcon, Button, Card, Field, Input, Notice, Page } from "../components.tsx";
import { safeNext, useAuth } from "../lib/auth.tsx";
import { api } from "../lib/api.ts";
import { Link, navigate } from "../lib/router.tsx";
import { FeaturedAgents } from "./directory/featured.tsx";
import { SignInPage } from "./sign-in.tsx";

const HOME_TITLE = "Free AI agents that work in your own AI | AI Blocks";
const HOME_DESCRIPTION = "Hire a named AI agent for a job role, free. Download it or connect your AI, and it works in Claude, ChatGPT, Gemini, Codex or Cursor, on your own plan.";

/** Types the intro out like a terminal (the library's Typewriter, from site/src/App.tsx). The full sentence is there
 *  from the start for screen readers, and the untyped part holds its space so nothing moves. Reduced motion shows it
 *  at once. */
function Typewriter(props: { text: string }) {
  const { text } = props;
  const [n, setN] = useState(() => (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches ? text.length : 0));
  useLayoutEffect(() => {
    if (n >= text.length) return;
    const prev = text[n - 1];
    const t = setTimeout(() => setN(n + 1), n === 0 ? 120 : prev === "." ? 140 : prev === "," ? 70 : 8 + Math.random() * 10);
    return () => clearTimeout(t);
  }, [n, text]);
  return (
    <p class="lede typed" data-done={n >= text.length ? "true" : "false"}>
      <span class="visually-hidden">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}<span class="cursor" /><span class="ghost">{text.slice(n)}</span></span>
    </p>
  );
}

/**
 * "What do you need done?": a plain request goes to /agents?q=..., where the agents who do that work come first. A
 * real form with a real address, so it works before the app starts and with the Enter key. The same form is in the
 * page the Worker sends (src/pages.ts).
 */
function FindAnAgent() {
  const [q, setQ] = useState("");
  return (
    <form class="dir-home-search" role="search" action="/agents" method="get"
      onSubmit={e => { e.preventDefault(); const ask = q.trim(); navigate(ask ? `/agents?${new URLSearchParams({ q: ask })}` : "/agents"); }}>
      <label class="dir-home-search-label" for="home-q">What do you need done?</label>
      <div class="dir-home-search-row">
        <input class="input dir-home-search-input" id="home-q" name="q" type="search" value={q} maxLength={120} autoComplete="off" enterKeyHint="search"
          placeholder="A landing page for my shop" onInput={e => setQ((e.target as HTMLInputElement).value)} />
        <button type="submit" class="btn btn-primary">Find an agent</button>
      </div>
    </form>
  );
}

function Home() {
  useEffect(() => {
    document.title = HOME_TITLE;
    document.querySelector('meta[name="description"]')?.setAttribute("content", HOME_DESCRIPTION);
  }, []);
  return (
    <main id="top">
      <section class="hero">
        <div class="wrap hero-in">
          <h1 class="h1">Hire an AI agent. It works in your own AI.</h1>
          <Typewriter text="Named AI agents, each built for one job role, and free. Download one, or connect your AI and load it, and it works in the tools you already use." />
          <FindAnAgent />
          <div class="hero-actions">
            <Link href="/agents" class="btn btn-primary">Meet the agents <ArrowIcon /></Link>
            <Link href="/connect" class="btn btn-line">Connect your AI <ArrowIcon /></Link>
          </div>
          <p class="hero-connect small">Part of <a href="https://useaiblocks.com">AI Blocks</a>, so your library account works here too.</p>
        </div>
      </section>
      <div class="wrap">
        <FeaturedAgents />
        <section class="steps" aria-label="How hiring works">
          <div><span class="step-n">1</span><h3>Choose an agent</h3><p>Each one is a named person for one job role, with a method, knowledge, skills and prompts.</p></div>
          <div><span class="step-n">2</span><h3>Add it to your AI</h3><p>Download the files for Claude, ChatGPT, Gemini, Codex or Cursor. Or connect your AI and load the agent in your chat.</p></div>
          <div><span class="step-n">3</span><h3>Say what it can touch</h3><p>It reads first. It drafts or publishes in your tools only when you say so, within your limits, and it logs what it does.</p></div>
        </section>
        <section class="expert-cta">
          <h2>Are you an expert?</h2>
          <p>Teach an agent how you do your work. We help you build it, test it on real jobs and put your name on it.</p>
          <Button kind="secondary" href="/experts/apply">Apply as an expert</Button>
        </section>
      </div>
    </main>
  );
}

/** Only used while INVITE_ONLY is on: the Gate links here then. With open hiring nothing links here. */
function Invite() {
  const auth = useAuth();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = safeNext(new URLSearchParams(location.search).get("next") || "/new");
  if (auth.me?.betaAccess) {
    return (
      <Page title="You can hire agents" intro="Your account can hire any agent. Pick up where you left off.">
        <Button href={next}>Continue</Button>
      </Page>
    );
  }
  return (
    <Page title="Enter your invite code" intro="Hiring needs an invite code right now. Enter the code you were sent, and you can hire any agent.">
      <Card>
        <form onSubmit={async e => {
          e.preventDefault(); setBusy(true); setError(null);
          try { await api("/api/beta/redeem", { body: { code } }); await auth.refreshMe(); navigate(next); }
          catch (err: any) { setError(err.message); } finally { setBusy(false); }
        }}>
          <Field label="Invite code" error={error ?? undefined} id="code"><Input id="code" value={code} onValue={setCode} placeholder="AB-XXXX-XXXX" autoComplete="off" /></Field>
          <Button type="submit" busy={busy} disabled={!code.trim()}>Use code</Button>
        </form>
      </Card>
      <p class="muted small">No code? You can still <Link href="/agents">browse every agent</Link>.</p>
    </Page>
  );
}

function NotFound() {
  return (
    <Page title="Page not found" intro="There is no page at this address on AI Blocks agents. The link may be old, or the page moved.">
      <div class="row">
        <Button href="/agents">Browse agents</Button>
        <Button kind="secondary" href="/">Go to the agents home</Button>
      </div>
      <Notice tone="info">Looking for skills, prompts or workflows? They are in the <a href="https://useaiblocks.com">AI Blocks library</a>.</Notice>
    </Page>
  );
}

export const pages: PageDef[] = [
  { path: "/", access: "public", component: Home },
  { path: "/sign-in", access: "public", component: SignInPage },
  { path: "/invite", access: "signed-in", component: Invite },
  { path: "*", access: "public", component: NotFound },
];

export const nav: NavItem[] = [];
