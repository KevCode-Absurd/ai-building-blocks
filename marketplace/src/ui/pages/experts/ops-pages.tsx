// Ops pages owned by the experts module: /ops/invites (founding invites) and /ops/job-posts (businesses' job posts).
import { useState } from "preact/hooks";
import { AREAS, type Area } from "../../../core/types.ts";
import { Badge, Button, Card, Empty, Field, Input, Notice, Page, Spinner, Tabs, TextArea, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { OpsNav, errorText } from "../ops/shared.tsx";
import { AREA_LABELS, CopyButton, type CatalogueList, type InviteStatus, type OpsInviteView, type PostView } from "./shared.tsx";

// ---------- Invites ----------

const INVITE_WORDS: Record<InviteStatus, { label: string; tone: "neutral" | "info" | "warn" | "good" | "bad" }> = {
  created: { label: "Not opened", tone: "neutral" },
  opened: { label: "Opened", tone: "info" },
  applied: { label: "Applied", tone: "warn" },
  approved: { label: "Approved", tone: "good" },
  rejected: { label: "Rejected", tone: "bad" },
  paused: { label: "Paused", tone: "neutral" },
  revoked: { label: "Revoked", tone: "neutral" },
};
const INVITE_ORDER: InviteStatus[] = ["created", "opened", "applied", "approved", "rejected", "paused", "revoked"];

interface InviteList { invites: OpsInviteView[]; counts: Record<InviteStatus, number>; total: number; founding: { limit: number; taken: number; left: number } }

export function OpsInvites() {
  const state = useLoad(() => api<InviteList>("/api/ops/invites"), []);
  const [filter, setFilter] = useState<"all" | InviteStatus>("all");
  const [message, setMessage] = useState<string | null>(null);
  const list = state.data;
  const shown = list ? list.invites.filter(i => filter === "all" || i.status === filter) : [];
  return (
    <Page wide title="Founding invites" intro="Invite people to be founding experts. Each invite has its own link. Copy it, or send it by email.">
      <OpsNav />
      {message && <Notice tone="good">{message}</Notice>}
      <NewInvite onDone={(m) => { setMessage(m); state.reload(); }} />
      {state.error ? <Notice tone="bad">{state.error}</Notice> : !list ? <Spinner /> : (
        <>
          <p class="muted small">Founding expert places: {list.founding.taken} of {list.founding.limit} taken. {list.total} {list.total === 1 ? "invite" : "invites"} so far.</p>
          <Tabs value={filter} onValue={v => setFilter(v as typeof filter)}
            tabs={[{ id: "all", label: `All (${list.total})` }, ...INVITE_ORDER.map(s => ({ id: s, label: `${INVITE_WORDS[s].label} (${list.counts[s] ?? 0})` }))]} />
          {shown.length === 0
            ? <Empty title="No invites here">New invites show here with their status.</Empty>
            : <div class="stack ops-stack">{shown.map(i => <InviteCard invite={i} onDone={m => { setMessage(m); state.reload(); }} />)}</div>}
        </>
      )}
    </Page>
  );
}

function NewInvite(props: { onDone: (message: string) => void }) {
  const catalogue = useLoad(() => api<CatalogueList>("/api/catalogue"), []);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [made, setMade] = useState<OpsInviteView | null>(null);
  const jobs = (catalogue.data?.job_types ?? []).filter(j => areas.includes(j.area));
  const toggle = <T,>(list: T[], v: T, max: number) => (list.includes(v) ? list.filter(x => x !== v) : list.length >= max ? list : [...list, v]);
  const submit = async (e: Event) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res = await api<{ invite: OpsInviteView }>("/api/ops/invites", { body: { name, email: email.trim() || null, areas, job_types: jobTypes.filter(id => jobs.some(j => j.id === id)), note } });
      setMade(res.invite);
      setName(""); setEmail(""); setAreas([]); setJobTypes([]); setNote("");
      props.onDone(`Invite for ${res.invite.name} is ready. Copy the link below.`);
    } catch (err) { setError(errorText(err)); }
    finally { setBusy(false); }
  };
  if (!open) return (
    <div class="stack">
      {made && <Card title={`Link for ${made.name}`}><div class="exp-share-row"><code class="exp-share-link">{made.link}</code><CopyButton text={made.link} /></div></Card>}
      <div class="row"><Button onClick={() => { setOpen(true); setMade(null); }}>New invite</Button></div>
    </div>
  );
  return (
    <Card title="New invite">
      <form class="stack" onSubmit={submit} noValidate>
        <Field label="Their name" id="inv-name"><Input id="inv-name" value={name} onValue={setName} maxLength={80} autoComplete="off" /></Field>
        <Field label="Their email (optional)" id="inv-email" help="Only used if you click Send invite email."><Input id="inv-email" type="email" value={email} onValue={setEmail} maxLength={200} autoComplete="off" /></Field>
        <fieldset class="exp-fieldset">
          <legend class="field-label">Areas (optional, up to 3)</legend>
          <div class="exp-chips">
            {AREAS.map(a => <button type="button" class="exp-chip" aria-pressed={areas.includes(a)} disabled={!areas.includes(a) && areas.length >= 3} onClick={() => setAreas(l => toggle(l, a, 3))}>{AREA_LABELS[a]}</button>)}
          </div>
        </fieldset>
        {jobs.length > 0 && (
          <fieldset class="exp-fieldset">
            <legend class="field-label">Jobs (optional, up to 10)</legend>
            <div class="exp-chips">
              {jobs.map(j => <button type="button" class="exp-chip" aria-pressed={jobTypes.includes(j.id)} disabled={!jobTypes.includes(j.id) && jobTypes.length >= 10} onClick={() => setJobTypes(l => toggle(l, j.id, 10))}>{j.title}</button>)}
            </div>
          </fieldset>
        )}
        <Field label="Private note (optional)" id="inv-note" help="Only the team sees this."><TextArea id="inv-note" value={note} onValue={setNote} rows={2} maxLength={2000} /></Field>
        {error && <Notice tone="bad">{error}</Notice>}
        <div class="row">
          <Button type="submit" busy={busy}>Make the invite</Button>
          <Button kind="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

function InviteCard(props: { invite: OpsInviteView; onDone: (message: string) => void }) {
  const i = props.invite;
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const w = INVITE_WORDS[i.status];
  const run = async (what: "email" | "revoke") => {
    setBusy(what); setError(null);
    try {
      if (what === "email") {
        const res = await api<{ sent: boolean }>(`/api/ops/invites/${encodeURIComponent(i.id)}/email`, { body: {} });
        props.onDone(res.sent ? `Invite email sent to ${i.email}.` : "The email could not go out from here (email sending is not set up). Copy the link instead.");
      } else {
        await api(`/api/ops/invites/${encodeURIComponent(i.id)}/revoke`, { body: {} });
        props.onDone(`The invite for ${i.name} is revoked. Its link no longer works.`);
      }
    } catch (err) { setError(errorText(err)); }
    finally { setBusy(null); }
  };
  const usable = i.status === "created" || i.status === "opened";
  return (
    <Card title={i.name} actions={<Badge tone={w.tone}>{w.label}</Badge>}>
      <dl class="ops-facts">
        {i.email && <div><dt>Email</dt><dd>{i.email}</dd></div>}
        {i.areas.length > 0 && <div><dt>Areas</dt><dd>{i.areas.map(a => AREA_LABELS[a as Area] ?? a).join(", ")}</dd></div>}
        <div><dt>Created</dt><dd>{when(i.created_at)}</dd></div>
        <div><dt>Opened</dt><dd>{i.opened_at ? when(i.opened_at) : "Not yet"}</dd></div>
        <div><dt>Applied</dt><dd>{i.applied_at ? when(i.applied_at) : "Not yet"}</dd></div>
        {i.decided_at && <div><dt>Decided</dt><dd>{when(i.decided_at)}</dd></div>}
        {i.emailed_at && <div><dt>Emailed</dt><dd>{when(i.emailed_at)}</dd></div>}
        {i.revoked_at && <div><dt>Revoked</dt><dd>{when(i.revoked_at)}</dd></div>}
        {i.expert && <div><dt>Application</dt><dd><Link href={`/ops/experts?expert=${encodeURIComponent(i.expert.id)}`}>{i.expert.name}</Link></dd></div>}
      </dl>
      {i.note && <p class="ops-meta">Note: {i.note}</p>}
      {usable && <div class="exp-share-row"><code class="exp-share-link">{i.link}</code><CopyButton text={i.link} /></div>}
      {error && <Notice tone="bad">{error}</Notice>}
      {usable && (confirmRevoke ? (
        <div class="row">
          <span>Revoke this invite? Its link stops working.</span>
          <Button kind="danger" small busy={busy === "revoke"} onClick={() => run("revoke")}>Yes, revoke</Button>
          <Button kind="ghost" small onClick={() => setConfirmRevoke(false)}>Back</Button>
        </div>
      ) : (
        <div class="row">
          {i.email && <Button small kind="secondary" busy={busy === "email"} disabled={!!busy} onClick={() => run("email")}>{i.emailed_at ? "Send the invite email again" : "Send invite email"}</Button>}
          <Button small kind="danger" disabled={!!busy} onClick={() => setConfirmRevoke(true)}>Revoke</Button>
        </div>
      ))}
    </Card>
  );
}

// ---------- Job posts ----------

const POST_TABS = ["open", "picked", "closed", "hidden", "expired", "deleted", "all"] as const;
const POST_WORDS: Record<(typeof POST_TABS)[number], string> = { open: "Open", picked: "Expert picked", closed: "Closed", hidden: "Hidden", expired: "Expired", deleted: "Deleted", all: "All" };
type OpsPost = PostView & { owner_email: string | null };

export function OpsPosts() {
  const [tab, setTab] = useState<(typeof POST_TABS)[number]>("open");
  const [message, setMessage] = useState<string | null>(null);
  const state = useLoad(() => api<{ posts: OpsPost[]; counts: Record<string, number> }>(`/api/ops/job-posts?status=${tab}`), [tab]);
  const list = state.data;
  return (
    <Page wide title="Job posts" intro="Jobs businesses posted for experts. Hide a post that breaks the rules: experts stop seeing it, and the business sees your note.">
      <OpsNav />
      {message && <Notice tone="good">{message}</Notice>}
      <Tabs value={tab} onValue={v => { setTab(v as typeof tab); setMessage(null); }}
        tabs={POST_TABS.map(s => ({ id: s, label: list?.counts && s !== "all" ? `${POST_WORDS[s]} (${list.counts[s] ?? 0})` : POST_WORDS[s] }))} />
      {state.error ? <Notice tone="bad">{state.error}</Notice> : !list ? <Spinner /> : list.posts.length === 0
        ? <Empty title="No posts here">New posts show under Open.</Empty>
        : <div class="stack ops-stack">{list.posts.map(p => <OpsPostCard key={`${p.id}-${p.hidden}`} post={p} onDone={m => { setMessage(m); state.reload(); }} />)}</div>}
    </Page>
  );
}

function OpsPostCard(props: { post: OpsPost; onDone: (message: string) => void }) {
  const p = props.post;
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggle = async () => {
    setBusy(true); setError(null);
    try {
      await api(`/api/ops/job-posts/${encodeURIComponent(p.id)}/hide`, { body: { hidden: !p.hidden, note } });
      props.onDone(p.hidden ? "The post is visible to experts again." : "The post is hidden from experts.");
    } catch (err) { setError(errorText(err)); }
    finally { setBusy(false); }
  };
  return (
    <Card title={p.title || "Text removed"} actions={<div class="row"><Badge>{p.status}</Badge>{p.hidden && <Badge tone="warn">Hidden</Badge>}</div>}>
      <dl class="ops-facts">
        <div><dt>Business</dt><dd>{p.owner_email ?? "No email"}</dd></div>
        <div><dt>Area</dt><dd>{p.area_label}{p.job_type ? ` · ${p.job_type.title}` : ""}</dd></div>
        <div><dt>Needed</dt><dd>{p.needed_by_label}</dd></div>
        <div><dt>Posted</dt><dd>{when(p.created_at)}</dd></div>
        <div><dt>Replies</dt><dd>{p.reply_count}</dd></div>
      </dl>
      {p.brief && <div class="ops-request">{p.brief}</div>}
      {p.website_url && <p class="small">Website: <a href={p.website_url} target="_blank" rel="noopener noreferrer nofollow">{p.website_url}</a></p>}
      {p.hidden && p.hidden_note && <p class="ops-meta">Hidden because: {p.hidden_note}</p>}
      <p><Link href={`/job-posts/${p.id}`}>Open the post and its replies</Link></p>
      {error && <Notice tone="bad">{error}</Notice>}
      {!p.text_deleted && (
        <div class="stack">
          {!p.hidden && (
            <Field label="Why you are hiding it" id={`post-note-${p.id}`} help="The business sees this note.">
              <TextArea id={`post-note-${p.id}`} value={note} onValue={setNote} rows={2} maxLength={500} />
            </Field>
          )}
          <div class="row"><Button small kind={p.hidden ? "secondary" : "danger"} busy={busy} onClick={toggle}>{p.hidden ? "Show it to experts again" : "Hide from experts"}</Button></div>
        </div>
      )}
    </Card>
  );
}
