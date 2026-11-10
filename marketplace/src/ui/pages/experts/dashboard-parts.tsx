// Parts of the approved expert's dashboard (/expert): the setup checklist, the public page and share link, the
// agreement, and jobs from businesses that match the expert.
import { useEffect, useState } from "preact/hooks";
import { Badge, Button, Card, Field, Input, Loaded, Notice, TextArea, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { CopyButton, longDate, type Agreement, type ChecklistView, type ExpertView, type MyProfile, type PostView } from "./shared.tsx";

/** Scroll to #exp-... once the part has loaded (links from the checklist and from emails). */
function useHashScroll(id: string, ready: boolean) {
  useEffect(() => { if (ready && location.hash === `#${id}`) document.getElementById(id)?.scrollIntoView(); }, [ready]);
}

export function Checklist(props: { version: number }) {
  const state = useLoad(() => api<{ checklist: ChecklistView }>("/api/experts/me/checklist"), [props.version]);
  return (
    <Loaded state={state}>{({ checklist: c }) => c.done === c.total ? (
      <Notice tone="good" title="You are all set up">Every step is done. Keep sharing your link and improving your agents in the studio.</Notice>
    ) : (
      <Card title="Get set up" actions={<span class="muted small">{c.done} of {c.total} done</span>}>
        <div class="exp-progress" role="progressbar" aria-valuemin={0} aria-valuemax={c.total} aria-valuenow={c.done} aria-label="Setup steps done">
          <span style={{ width: `${(c.done / c.total) * 100}%` }} />
        </div>
        <ol class="exp-checklist">
          {c.steps.map(s => (
            <li class={s.done ? "exp-check-done" : ""}>
              <span class="exp-check-mark" aria-hidden="true">{s.done ? "✓" : ""}</span>
              <span class="exp-check-text">
                <b>{s.done ? s.label : <Link href={s.href}>{s.label}</Link>}</b>
                <span class="visually-hidden">{s.done ? " (done)" : " (to do)"}</span>
                {!s.done && <span class="muted small">{s.help}</span>}
              </span>
            </li>
          ))}
        </ol>
      </Card>
    )}</Loaded>
  );
}

export function ProfileCard(props: { onSaved: () => void }) {
  const state = useLoad(() => api<{ profile: MyProfile }>("/api/experts/me/profile"), []);
  useHashScroll("exp-profile", !!state.data);
  useHashScroll("exp-share", !!state.data);
  return (
    <Loaded state={state}>{({ profile }) => <ProfileBody profile={profile} onSaved={() => { state.reload(); props.onSaved(); }} />}</Loaded>
  );
}

function ProfileBody(props: { profile: MyProfile; onSaved: () => void }) {
  const p = props.profile;
  const [headline, setHeadline] = useState(p.headline);
  const [bio, setBio] = useState(p.bio);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const save = async (e: Event) => {
    e.preventDefault();
    setBusy(true); setError(null); setSaved(false);
    try { await api("/api/experts/me/profile", { body: { headline, bio } }); setSaved(true); props.onSaved(); }
    catch (err: any) { setError(err?.message ?? "We could not save that. Try again."); }
    finally { setBusy(false); }
  };
  return (
    <>
      <section id="exp-profile">
        <Card title="Your public page" actions={p.public ? <Badge tone="good">Public</Badge> : <Badge>Not public yet</Badge>}>
          <p class="muted">
            {p.public
              ? <>Anyone can see your page at <Link href={`/experts/${p.slug}`}>{p.url.replace(/^https?:\/\//, "")}</Link>.</>
              : "Your page goes public once one of your agents is live. Write your headline and bio now so it is ready."}
          </p>
          <form class="exp-form exp-profile-form" onSubmit={save} noValidate>
            <Field label="Headline" id="exp-p-headline" help={`One line on what you do and who for. Up to ${p.limits.headline.max} characters.`}>
              <Input id="exp-p-headline" value={headline} onValue={setHeadline} maxLength={p.limits.headline.max} />
            </Field>
            <Field label="Short bio" id="exp-p-bio" help={`Two or three sentences about your work, in your own words. ${bio.trim().length} of ${p.limits.bio.max} characters.`}>
              <TextArea id="exp-p-bio" value={bio} onValue={setBio} rows={4} maxLength={p.limits.bio.max} />
            </Field>
            {error && <Notice tone="bad">{error}</Notice>}
            {saved && <Notice tone="good">Saved. Your page shows the new words.</Notice>}
            <div class="row"><Button type="submit" busy={busy}>Save your page</Button></div>
          </form>
        </Card>
      </section>

      <section id="exp-share">
        <Card title="Your share link">
          <p class="muted">Send this link to people you work with. It opens your page and lets us count who came through you.</p>
          <div class="exp-share-row">
            <code class="exp-share-link">{p.share.url}</code>
            <CopyButton text={p.share.url} />
          </div>
          <div class="exp-stats exp-share-stats">
            <ShareStat label="Visits" value={p.share.visits} />
            <ShareStat label="Sign-ups" value={p.share.signups} />
            <ShareStat label="Agent downloads" value={p.share.downloads} />
          </div>
          <p class="muted small exp-help">We count a visit once per browser. A sign-up counts when someone makes an account within 90 days of opening your link.</p>
        </Card>
      </section>
    </>
  );
}

function ShareStat(props: { label: string; value: number }) {
  return <div class="exp-stat"><span class="exp-stat-label">{props.label}</span><span class="exp-stat-value">{props.value}</span></div>;
}

export function AgreementCard(props: { expert: ExpertView; onAccepted: () => void }) {
  const e = props.expert;
  const agreement = useLoad(() => api<{ agreement: Agreement }>("/api/experts/agreement"), []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  useHashScroll("exp-agreement", !!agreement.data);
  const current = e.agreement.current || done;
  const accept = async () => {
    setBusy(true); setError(null);
    try { await api("/api/experts/me/agreement", { body: { version: e.agreement.current_version } }); setDone(true); props.onAccepted(); }
    catch (err: any) { setError(err?.message ?? "We could not save that. Reload and try again."); }
    finally { setBusy(false); }
  };
  return (
    <section id="exp-agreement">
      <Card title="Your agreement" actions={current ? <Badge tone="good">Agreed</Badge> : <Badge tone="warn">New version</Badge>}>
        <p class="muted">{current
          ? `You agreed to the founding expert agreement${e.agreement.accepted_at && !done ? ` on ${longDate(e.agreement.accepted_at)}` : ""}.`
          : "The agreement changed since you agreed to it. Read the new version and agree to keep building."}</p>
        {agreement.data && (
          <details class="exp-agreement" open={!current}>
            <summary>Read the agreement (draft)</summary>
            <Notice tone="warn" title="This is a draft">{agreement.data.agreement.draft_notice}</Notice>
            {agreement.data.agreement.sections.map(s => <div class="exp-agreement-part"><h3>{s.heading}</h3><p>{s.body}</p></div>)}
          </details>
        )}
        {error && <Notice tone="bad">{error}</Notice>}
        {!current && <Button busy={busy} onClick={accept}>I agree to the new version</Button>}
      </Card>
    </section>
  );
}

type MatchingPost = PostView & { my_reply: { note: string; created_at: string } | null };

export function MatchingPosts() {
  const state = useLoad(() => api<{ posts: MatchingPost[] }>("/api/experts/me/posts"), []);
  useHashScroll("exp-posts", !!state.data);
  return (
    <section id="exp-posts">
      <Card title="Jobs from businesses">
        <p class="muted">Businesses post jobs in your areas. Reply with a short note on why you fit. If they pick you, you both get each other's email. We email you about new jobs at most once a day.</p>
        <Loaded state={state}>{({ posts }) => posts.length === 0
          ? <p class="muted">No open jobs match your areas right now.</p>
          : <ul class="exp-posts">{posts.map(p => <MatchingPostItem post={p} />)}</ul>}</Loaded>
      </Card>
    </section>
  );
}

function MatchingPostItem(props: { post: MatchingPost }) {
  const p = props.post;
  const [reply, setReply] = useState(p.my_reply);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const send = async (e: Event) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try { const res = await api<{ reply: { note: string; created_at: string } }>(`/api/job-posts/${encodeURIComponent(p.id)}/replies`, { body: { note } }); setReply(res.reply); setOpen(false); }
    catch (err: any) { setError(err?.message ?? "We could not send that. Try again."); }
    finally { setBusy(false); }
  };
  return (
    <li class="exp-post">
      <div class="row">
        <h3 class="exp-post-title">{p.title}</h3>
        {reply && <Badge tone="good">You replied</Badge>}
      </div>
      <p class="muted small">{p.area_label}{p.job_type ? ` · ${p.job_type.title}` : ""} · {p.needed_by_label} · Posted {when(p.created_at)} · {p.reply_count} {p.reply_count === 1 ? "reply" : "replies"}</p>
      {p.brief && <p class="exp-quote">{p.brief}</p>}
      {p.website_url && <p class="small">Website: <a href={p.website_url} target="_blank" rel="noopener noreferrer nofollow">{p.website_url}</a></p>}
      {reply ? (
        <p class="small"><b>Your reply:</b> {reply.note}</p>
      ) : open ? (
        <form class="stack" onSubmit={send} noValidate>
          <Field label="Your note" id={`exp-reply-${p.id}`} help={`Why you are a good fit, in a few sentences. ${note.trim().length} of 600 characters. Your profile link goes with it.`}>
            <TextArea id={`exp-reply-${p.id}`} value={note} onValue={setNote} rows={3} maxLength={600} />
          </Field>
          {error && <Notice tone="bad">{error}</Notice>}
          <div class="row">
            <Button type="submit" small busy={busy}>Send reply</Button>
            <Button kind="ghost" small onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div class="row"><Button small kind="secondary" onClick={() => setOpen(true)}>Reply</Button></div>
      )}
    </li>
  );
}
