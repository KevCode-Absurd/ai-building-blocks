// /connect: how to connect Claude, ChatGPT or another AI app to AI Blocks and load agents there, the public API, and
// the person's connected apps. Agents run on the person's own AI; AI Blocks runs no work for them.
import { useEffect, useState } from "preact/hooks";
import { Badge, Button, Card, Loaded, Notice, Page, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";
import { CONNECT_TITLE } from "../../../modules/directory/titles.ts";

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
  // The same title the Worker sends (src/pages.ts); this runs after Page sets its own.
  useEffect(() => { document.title = CONNECT_TITLE; }, []);
  return (
    <Page title="Connect your AI" intro="Add AI Blocks to Claude, ChatGPT or another AI app once. Then ask it to find an agent and load it into your chat. The agent is free and works on your own AI plan.">
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
                "Name it AI Blocks agents and paste the address.",
                "Choose Connect. Sign in to AI Blocks, then choose Approve.",
              ]} />
              <p class="muted small">On a Team or Enterprise plan, an owner may need to add the connector first.</p>
            </section>
            <section>
              <h3>ChatGPT</h3>
              <Steps items={[
                "In ChatGPT, open Settings, then Apps (it may say Apps & Connectors).",
                "If there is no way to add your own, turn on developer mode in the advanced settings there.",
                "Create a new app or connector. Name it AI Blocks agents, paste the address and pick OAuth for sign-in.",
                "Sign in to AI Blocks, then choose Approve.",
              ]} />
              <p class="muted small">Some ChatGPT plans do not let you add your own apps yet.</p>
            </section>
            <section>
              <h3>Cursor and other apps</h3>
              <p>Any app that can add a remote MCP server with sign-in can use the same address. MCP is the standard way AI apps connect to other services.</p>
              <p class="muted small">In Cursor, add the address as a remote MCP server in its settings. Cursor opens your browser to sign in, then asks to open Cursor again.</p>
            </section>
          </div>
        </Card>

        <Card title="3. Ask for an agent">
          <ul class="mcp-examples">
            <li>"Find an AI Blocks agent who can plan my SEO."</li>
            <li>"Load Danielle from AI Blocks and plan my next blog post with her."</li>
            <li>"Which AI Blocks agents help with payroll?"</li>
            <li>"Open Danielle's knowledge file and check my draft against it."</li>
          </ul>
          <p class="muted">Your AI loads the agent's instructions, personality, method and rules for your tools. The agent reads first, and asks before it drafts or publishes anything in your tools.</p>
        </Card>

        <div class="mcp-two">
          <Card title="What the connection can do">
            <ul class="mcp-list">
              <li>Show you the agents and what each one delivers.</li>
              <li>Load an agent into your chat, with its method, knowledge, skills and prompts.</li>
              <li>Give you the free download of any agent.</li>
            </ul>
          </Card>
          <Card title="What it cannot do">
            <ul class="mcp-list">
              <li>Run work on AI Blocks. The agent works in your AI, on your own plan.</li>
              <li>See your chats, your files or your other accounts.</li>
              <li>Change your AI Blocks account.</li>
            </ul>
          </Card>
        </div>

        <Card title="Use the API">
          <p>Building your own tool? Every agent is public, so you need no key. Send a GET request to:</p>
          <dl class="mcp-api">
            <dt><code>{location.origin}/api/agents?q=seo</code></dt><dd>Find agents. You can also filter with <code>area</code> or <code>role</code>.</dd>
            <dt><code>{location.origin}/api/agents/&lt;agent-id&gt;</code></dt><dd>One agent's profile.</dd>
            <dt><code>{location.origin}/packs/&lt;agent-id&gt;/files.json</code></dt><dd>Every file in the agent's pack, with a link to each one.</dd>
            <dt><code>{location.origin}/packs/&lt;agent-id&gt;.zip</code></dt><dd>The whole agent as one download.</dd>
          </dl>
          <p class="muted small">Agents are free to use and change, including in your own work, but not to sell or resell.</p>
        </Card>

        {auth.signedIn ? <Connections /> : (
          <Notice title="Disconnect at any time">Sign in here to see the AI apps you connected and turn any of them off. You can also remove the connector in your AI app.</Notice>
        )}
      </div>
    </Page>
  );
}
