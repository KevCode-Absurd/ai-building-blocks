// Core pages: home, invite code, and not found. The directory module owns the agent pages (/agents).
import { useState } from "preact/hooks";
import type { NavItem, PageDef } from "./types.ts";
import { Button, Card, Field, Input, Notice, Page } from "../components.tsx";
import { useAuth } from "../lib/auth.tsx";
import { api } from "../lib/api.ts";
import { navigate } from "../lib/router.tsx";
import { FeaturedAgents } from "./directory/featured.tsx";

function Home() {
  const auth = useAuth();
  return (
    <main class="home">
      <section class="hero">
        <p class="eyebrow">AI Blocks Agents · Beta</p>
        <h1>Hire an AI agent. Get finished work back.</h1>
        <p class="lede">Pick an agent built from real experts' methods, tell them what you need, and get a finished draft. Every draft is checked against your goals and against plain AI before you see it.</p>
        <div class="hero-actions">
          <Button href="/agents">Meet the agents</Button>
          <Button kind="secondary" href="/new">Describe a job</Button>
        </div>
        {!auth.signedIn && <p class="muted small">Free during the beta. You need an invite code to order.</p>}
      </section>
      <FeaturedAgents />
      <section class="steps">
        <div><span class="step-n">1</span><h3>Choose an agent or describe the job</h3><p>In your own words. We ask at most three questions.</p></div>
        <div><span class="step-n">2</span><h3>See a fixed price and a checklist</h3><p>You approve what "good" means before work starts.</p></div>
        <div><span class="step-n">3</span><h3>Get checked work</h3><p>Ask for up to two revisions, then accept it.</p></div>
      </section>
      <section class="expert-cta">
        <h2>Are you an expert?</h2>
        <p>Turn how you work into an AI agent that earns while you sleep. Founding experts get the best rate for life.</p>
        <Button kind="secondary" href="/experts/apply">Apply as an expert</Button>
      </section>
    </main>
  );
}

function Invite() {
  const auth = useAuth();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = new URLSearchParams(location.search).get("next") || "/new";
  if (auth.me?.betaAccess) return <Page title="You are in"><Notice tone="good">You have beta access.</Notice><p><Button href={next}>Continue</Button></p></Page>;
  return (
    <Page title="Enter your invite code" intro="The beta is invite-only while we test every agent with real jobs.">
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
    </Page>
  );
}

function NotFound() {
  return <Page title="Page not found" intro="That page does not exist, or it moved."><Button href="/">Go home</Button></Page>;
}

export const pages: PageDef[] = [
  { path: "/", access: "public", component: Home },
  { path: "/invite", access: "signed-in", component: Invite },
  { path: "*", access: "public", component: NotFound },
];

export const nav: NavItem[] = [];
