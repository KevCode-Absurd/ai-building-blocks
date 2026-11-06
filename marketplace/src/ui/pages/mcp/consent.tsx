// /oauth/consent: a signed-in buyer approves or denies an AI app's request to connect.
// GET /oauth/authorize validates the request and sends the browser here with ?request=<id> (or ?error=<code>).
import { useState } from "preact/hooks";
import { Button, Card, Loaded, Notice, Page, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";

interface AuthRequest {
  request_id: string;
  client_name: string;
  redirect_host: string;
  scopes: { id: string; label: string; detail: string }[];
  asks_to_order: boolean;
  beta_access: boolean;
  expires_at: string;
}

const ERRORS: Record<string, string> = {
  unknown_client: "We do not know this app. Go back to your AI app, remove the connector and add it again.",
  bad_redirect: "This app's sign-in link does not match how it was set up. Go back to your AI app, remove the connector and add it again.",
  invalid_request: "This sign-in link is not complete. Go back to your AI app and try connecting again.",
};

function Problem(props: { message: string }) {
  return (
    <Page title="We could not connect this app">
      <Notice tone="warn">{props.message}</Notice>
      <p><Button kind="secondary" href="/connect">See how to connect</Button></p>
    </Page>
  );
}

function Decide(props: { req: AuthRequest }) {
  const auth = useAuth();
  const { req } = props;
  const [allowOrder, setAllowOrder] = useState(true);
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  const decide = async (approve: boolean) => {
    setBusy(approve ? "approve" : "deny"); setError(null);
    try {
      const res = await api<{ redirect_url: string }>("/api/oauth/approve", { body: { request_id: req.request_id, approve, allow_order: req.asks_to_order ? allowOrder : false } });
      setLeaving(true);
      window.location.assign(res.redirect_url);
    } catch (e: any) {
      setError(e.message); setBusy(null);
    }
  };

  if (leaving) return <Page title="Sending you back"><p class="lede">Going back to {req.redirect_host}. You can close this tab if nothing happens.</p></Page>;

  const read = req.scopes.find(s => s.id === "marketplace:read");
  const order = req.scopes.find(s => s.id === "marketplace:order");
  return (
    <Page title={`Connect ${req.client_name} to AI Blocks`} intro={`${req.client_name} wants to use AI Blocks Agents for you. After you choose, you go back to ${req.redirect_host}.`}>
      <div class="mcp-consent stack">
        {error && <Notice tone="bad">{error}</Notice>}
        <Card title="It will be able to">
          <ul class="mcp-scopes">
            {read && <li><strong>{read.label}.</strong> {read.detail}</li>}
            {order && (
              <li>
                <label class="mcp-check">
                  <input type="checkbox" checked={allowOrder} onChange={e => setAllowOrder((e.target as HTMLInputElement).checked)} />
                  <span><strong>Let it place orders.</strong> {order.detail} We tell your AI to ask you first every time.</span>
                </label>
              </li>
            )}
          </ul>
          <p class="muted small">It cannot charge you (nothing is charged in the beta), see anyone else's jobs or change your account. You can disconnect it at any time on the Connect your AI page.</p>
        </Card>
        {!req.beta_access && (
          <Notice tone="info" title="You can browse now">To order work, you need an invite code. <a href="/invite?next=/connect">Enter your invite code</a> after you connect.</Notice>
        )}
        <p class="muted small">Signed in as {auth.me?.user.email ?? auth.displayName}. Only approve if you just asked {req.client_name} to connect to AI Blocks.</p>
        <div class="row">
          <Button busy={busy === "approve"} disabled={busy !== null} onClick={() => decide(true)}>Approve</Button>
          <Button kind="secondary" busy={busy === "deny"} disabled={busy !== null} onClick={() => decide(false)}>Deny</Button>
        </div>
      </div>
    </Page>
  );
}

export function Consent(props: { query: URLSearchParams }) {
  const requestId = props.query.get("request") ?? "";
  const errorCode = props.query.get("error");
  const state = useLoad(() => requestId ? api<AuthRequest>(`/api/oauth/requests/${encodeURIComponent(requestId)}`) : Promise.resolve(null), [requestId]);
  if (errorCode || !requestId) return <Problem message={ERRORS[errorCode ?? ""] ?? ERRORS.invalid_request} />;
  if (state.error) return <Problem message={state.error} />;
  return <Loaded state={state}>{req => req ? <Decide req={req} /> : <Problem message={ERRORS.invalid_request} />}</Loaded>;
}
