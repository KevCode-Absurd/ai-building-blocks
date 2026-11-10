// /experts/invite/:token: a founding invite. Greets the person by name, says what a founding expert does, and leads
// to the application with the invite's details filled in. Public: the token in the address is the key.
import { Button, Card, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { useAuth } from "../../lib/auth.tsx";
import { AREA_LABELS, type PublicInviteView } from "./shared.tsx";
import type { Area } from "../../../core/types.ts";

interface InviteAnswer { invite: PublicInviteView; founding: { limit: number; taken: number; left: number }; review_time: string }

export function InvitePage(props: { params: Record<string, string> }) {
  const token = props.params.token ?? "";
  const state = useLoad(() => api<InviteAnswer>(`/api/experts/invites/${encodeURIComponent(token)}`), [token]);
  if (state.error) return (
    <Page title="This invite link does not work" intro="Check that you copied the whole link from your email.">
      <Notice tone="info">{state.error}</Notice>
      <div class="row"><Button href="/experts/apply">Apply without an invite</Button></div>
    </Page>
  );
  if (!state.data) return <Page title="Your invitation"><Spinner /></Page>;
  return <Invite token={token} data={state.data} />;
}

function Invite(props: { token: string; data: InviteAnswer }) {
  const { invite, founding } = props.data;
  const auth = useAuth();
  const applyHref = `/experts/apply?${new URLSearchParams({ invite: props.token })}`;
  const used = invite.state === "used";
  if (invite.state === "revoked") return (
    <Page title={`Hi ${invite.first_name}`} intro="This invite has been withdrawn.">
      <Notice tone="info">If you think this is a mistake, contact us through <a href="https://useaiblocks.com/support">Help & contact</a>. You can still apply without the invite.</Notice>
      <div class="row"><Button href="/experts/apply">Apply as an expert</Button></div>
    </Page>
  );
  return (
    <Page title={`Hi ${invite.first_name}, you are invited`} intro="We would like you to be one of the founding experts on AI Blocks.">
      <div class="exp-points">
        <Card>
          <h3>Build agents from your method</h3>
          <p>In our studio, you answer questions about how you work, add past work, and mark up plain AI drafts. That becomes an AI agent that works the way you do.</p>
        </Card>
        <Card>
          <h3>It stays yours</h3>
          <p>You keep ownership of your method and your examples. Your public page shows your name, your work and the agents you built.</p>
        </Card>
        <Card>
          <h3>Be one of the first {founding.limit}</h3>
          <p>Founding experts are the first experts businesses see on AI Blocks.</p>
          <p class="muted small">{founding.left > 0 ? `${founding.left} of ${founding.limit} founding spots are left.` : `All ${founding.limit} founding spots are taken. You can still apply.`}</p>
        </Card>
      </div>

      <div class="stack">
      {(invite.areas.length > 0 || invite.job_types.length > 0) && (
        <Card title="What we had in mind for you">
          {invite.areas.length > 0 && <p>Areas: {invite.areas.map(a => AREA_LABELS[a as Area] ?? a).join(", ")}</p>}
          <p class="muted small">These are filled in on your application. You can change them.</p>
        </Card>
      )}

      <Card title="How it works">
        <ol class="exp-steps">
          <li><b>Send a short application.</b><span>Your name and areas are filled in. Add your experience and links that show your work.</span></li>
          <li><b>We read it within {props.data.review_time}.</b><span>Invited applications are read first.</span></li>
          <li><b>Build your first agent.</b><span>Your dashboard walks you through each step, from the agreement to going live.</span></li>
        </ol>
      </Card>

      {used
        ? <Notice tone="good" title="You have applied">We have your application. <a href="/expert">See your status</a>.</Notice>
        : (
          <div class="row exp-actions">
            <Button href={applyHref}>Start your application</Button>
            {!auth.signedIn && <span class="muted small">You sign in or make a free account first.</span>}
          </div>
        )}
      </div>
    </Page>
  );
}
