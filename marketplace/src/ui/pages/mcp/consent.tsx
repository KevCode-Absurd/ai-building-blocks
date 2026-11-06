// /oauth/consent: a signed-in buyer approves or denies an AI app's request to connect.
// GET /oauth/authorize validates the request and sends the browser here with ?request=<id> (or ?error=<code>).
import { useState } from "preact/hooks";
import { Button, Card, Loaded, Notice, Page, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";

interface AuthRequest {
  request_id: string;
  client_name: string;
  /** claude.ai for a website, localhost:33418 for an app on this computer, cursor:// for an app's own link type. */
  redirect_host: string;
  redirect_kind?: "web" | "local" | "app";
  redirect_uri?: string;
  scopes: { id: string; label: string; detail: string }[];
  asks_to_order: boolean;
  can_hire: boolean;
  /** Jobs run on AI Blocks (HOSTED_JOBS "on"). Off, a connection only finds and loads agents. */
  hosted_jobs?: boolean;
  expires_at: string;
}

const ERRORS: Record<string, string> = {
  unknown_client: "We do not know this app. Go back to your AI app, remove the connector and add it again.",
  bad_redirect: "This app's sign-in link does not match how it was set up. Go back to your AI app, remove the connector and add it again.",
  invalid_request: "This sign-in link is not complete. Go back to your AI app and try connecting again.",
};

/** Where the person goes after they choose, in words. */
function destination(req: AuthRequest): string {
  if (req.redirect_kind === "app") return `the app on your computer that opens ${req.redirect_host} links`;
  if (req.redirect_kind === "local") return `an app on your computer (${req.redirect_host})`;
  return req.redirect_host;
}

function Problem(props: { message: string }) {
  return (
    <Page title="We could not connect this app">
      <Notice tone="warn">{props.message}</Notice>
      <p><Button kind="secondary" href="/connect">See how to connect</Button></p>
    </Page>
  );
}

/** The full address the app gets the answer at. Apps on the computer can claim local and app links, so show all of it. */
function Destination(props: { req: AuthRequest }) {
  const { req } = props;
  return (
    <div class="mcp-destination">
      <p class="small"><strong>After you choose, we send you to:</strong></p>
      <code class="mcp-redirect">{req.redirect_uri ?? req.redirect_host}</code>
      {req.redirect_kind === "app" && (
        <Notice tone="warn" title="Check this is your app">
          This is a {req.redirect_host} link. It opens an app on your computer, not a website. Any app you installed can ask to open links like this. Only approve if you just started connecting from {req.client_name} yourself.
        </Notice>
      )}
      {req.redirect_kind === "local" && (
        <p class="muted small">This address is on your own computer, where {req.client_name} waits for the answer. Only approve if you just started connecting from it yourself.</p>
      )}
    </div>
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

  if (leaving) {
    return (
      <Page title="Sending you back">
        <p class="lede">Going back to {destination(req)}.</p>
        {req.redirect_kind === "app"
          ? <p class="muted">Your browser may ask if it can open the app. Say yes. You can close this tab once the app opens.</p>
          : <p class="muted">You can close this tab if nothing happens.</p>}
      </Page>
    );
  }

  const read = req.scopes.find(s => s.id === "marketplace:read");
  const order = req.scopes.find(s => s.id === "marketplace:order");
  return (
    <Page title={`Connect ${req.client_name} to AI Blocks`} intro={`${req.client_name} wants to find and load AI Blocks agents for you. After you choose, you go back to ${destination(req)}.`}>
      <div class="mcp-consent stack">
        {error && <Notice tone="bad">{error}</Notice>}
        <Card title="It will be able to">
          <ul class="mcp-scopes">
            {read && <li><strong>{read.label}.</strong> {read.detail}</li>}
            {order && (
              <li>
                <label class="mcp-check">
                  <input type="checkbox" checked={allowOrder} onChange={e => setAllowOrder((e.target as HTMLInputElement).checked)} />
                  <span><strong>Let it start jobs.</strong> {order.detail} We tell your AI to ask you first every time.</span>
                </label>
              </li>
            )}
          </ul>
          <p class="muted small">Agents are free. It cannot see anyone else's work or change your account. You can disconnect it at any time on the Connect your AI page.</p>
        </Card>
        <Destination req={req} />
        {req.hosted_jobs && !req.can_hire && (
          <Notice tone="info" title="You can browse now">Hiring needs an invite code right now. <a href="/invite?next=/connect">Enter your invite code</a> after you connect.</Notice>
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
