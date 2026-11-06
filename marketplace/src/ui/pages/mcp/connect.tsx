// /connect: how to add AI Blocks Agents to Claude, ChatGPT or another AI app, and the buyer's connected apps.
import { useState } from "preact/hooks";
import { Badge, Button, Card, Loaded, Notice, Page, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";

interface Connection { id: string; client_name: string; redirect_host: string; scopes: { id: string; label: string }[]; created_at: string; last_used_at: string | null }

function CopyAddress(props: { address: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(props.address); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { (document.getElementById("mcp-address") as HTMLInputElement | null)?.select(); }
  };
  return (
    <div class="mcp-address">
      <input id="mcp-address" class="input mcp-address-input" value={props.address} readOnly aria-label="Connector address" onFocus={e => (e.target as HTMLInputElement).select()} />
      <Button onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
    </div>
  );
}

function Steps(props: { items: string[] }) {
  return <ol class="mcp-steps">{props.items.map(i => <li>{i}</li>)}</ol>;
}

function Connections() {
  const state = useLoad(() => api<{ connections: Connection[] }>("/api/oauth/connections"), []);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const disconnect = async (id: string) => {
    setBusy(id); setError(null);
    try { await api(`/api/oauth/connections/${id}/revoke`, { method: "POST", body: {} }); state.reload(); }
    catch (e: any) { setError(e.message); }
    finally { setBusy(null); }
  };
  return (
    <Card title="Your connected apps">
      {error && <Notice tone="bad">{error}</Notice>}
      <Loaded state={state}>
        {data => data.connections.length === 0
          ? <p class="muted">No AI apps are connected yet.</p>
          : (
            <ul class="mcp-connections">
              {data.connections.map(c => (
                <li class="mcp-connection">
                  <div>
                    <strong>{c.client_name}</strong> <span class="muted small">{c.redirect_host}</span>
                    <div class="row mcp-connection-meta">
                      {c.scopes.map(s => <Badge tone={s.id === "marketplace:order" ? "info" : "neutral"}>{s.label}</Badge>)}
                      <span class="muted small">Connected {when(c.created_at)}{c.last_used_at ? `, last used ${when(c.last_used_at)}` : ""}</span>
                    </div>
                  </div>
                  <Button kind="danger" small busy={busy === c.id} onClick={() => disconnect(c.id)}>Disconnect</Button>
                </li>
              ))}
            </ul>
          )}
      </Loaded>
    </Card>
  );
}

export function Connect() {
  const auth = useAuth();
  const address = `${location.origin}/mcp`;
  return (
    <Page title="Connect your AI" intro="Hire AI Blocks agents from inside Claude, ChatGPT or another AI app you already use. Ask in your chat, and your AI shows you the price, the progress and the finished work.">
      <div class="stack">
        <Card title="1. Copy this address">
          <CopyAddress address={address} />
          <p class="muted small mcp-gap">This is the connector address. You paste it into your AI app once.</p>
        </Card>

        <Card title="2. Add it to your AI app">
          <div class="mcp-apps">
            <section>
              <h3>Claude</h3>
              <Steps items={[
                "In Claude, open Settings, then Connectors.",
                "Choose Add custom connector.",
                "Name it AI Blocks Agents and paste the address.",
                "Choose Connect. Sign in to AI Blocks, then choose Approve.",
              ]} />
              <p class="muted small">On a Team or Enterprise plan, an owner may need to add the connector first.</p>
            </section>
            <section>
              <h3>ChatGPT</h3>
              <Steps items={[
                "In ChatGPT, open Settings, then Apps (it may say Apps & Connectors).",
                "If there is no way to add your own, turn on developer mode in the advanced settings there.",
                "Create a new app or connector. Name it AI Blocks Agents, paste the address and pick OAuth for sign-in.",
                "Sign in to AI Blocks, then choose Approve.",
              ]} />
              <p class="muted small">Some ChatGPT plans do not let you add your own apps yet.</p>
            </section>
            <section>
              <h3>Other AI apps</h3>
              <p>Any app that can add a remote MCP server with sign-in can use the same address. MCP is the standard way AI apps connect to other services.</p>
            </section>
          </div>
        </Card>

        <Card title="3. Ask for work">
          <ul class="mcp-examples">
            <li>"Ask Nova for a 1,500 word article about how often to groom a dog."</li>
            <li>"Which AI Blocks agents can write a landing page?"</li>
            <li>"What is the status of my article?"</li>
            <li>"Show me the finished draft, then ask for a shorter intro."</li>
          </ul>
          <p class="muted">Before any order, your AI gets the fixed price and the checklist the work is judged on. We tell it to ask you before it orders.</p>
        </Card>

        <div class="mcp-two">
          <Card title="What the connection can do">
            <ul class="mcp-list">
              <li>Show you the agents and the jobs they do.</li>
              <li>Describe a job, answer the agent's questions and get a fixed price.</li>
              <li>Place the order, if you allowed ordering when you connected.</li>
              <li>Check progress, and show you the finished work once it passes its final check.</li>
              <li>Accept the work, or ask for changes (up to 2 rounds).</li>
            </ul>
          </Card>
          <Card title="What it cannot do">
            <ul class="mcp-list">
              <li>Charge you. Payments are on hold in the beta, so nothing is charged.</li>
              <li>Show you work before it passes its final check.</li>
              <li>Reject work. Do that on the job's page here.</li>
              <li>See anyone else's jobs or change your account.</li>
              <li>Order without beta access. You need an invite code to order. You can browse without one.</li>
            </ul>
          </Card>
        </div>

        {auth.signedIn ? <Connections /> : (
          <Notice title="Disconnect at any time">Sign in here to see the AI apps you connected and turn any of them off. You can also remove the connector in your AI app.</Notice>
        )}
      </div>
    </Page>
  );
}
