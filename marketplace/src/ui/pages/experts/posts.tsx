// Job posts for businesses: /job-posts (your posts), /job-posts/new (post a job), /job-posts/:id (one post, the
// experts' replies, pick one, close or delete). Signed in. No prices: the business and the expert agree terms between them.
import { useMemo, useState } from "preact/hooks";
import { AREAS, type Area } from "../../../core/types.ts";
import { Badge, Button, Card, Empty, Field, Input, Loaded, Notice, Page, Select, Spinner, TextArea, useLoad } from "../../components.tsx";
import { api, ApiError, when } from "../../lib/api.ts";
import { Link, navigate } from "../../lib/router.tsx";
import { AREA_LABELS, NEEDED_BY_OPTIONS, longDate, type CatalogueList, type PostView, type ReplyView } from "./shared.tsx";

const STATUS: Record<PostView["status"], { label: string; tone: "good" | "info" | "neutral" | "warn" }> = {
  open: { label: "Open", tone: "info" },
  picked: { label: "Expert picked", tone: "good" },
  closed: { label: "Closed", tone: "neutral" },
  deleted: { label: "Deleted", tone: "neutral" },
  expired: { label: "Expired", tone: "neutral" },
};

function HowItWorks() {
  return (
    <ol class="exp-steps">
      <li><b>Describe the job.</b><span>What you need done, in plain words. No budget needed.</span></li>
      <li><b>Experts who do this work reply.</b><span>Only approved experts in that area see your post. Each sends one short note.</span></li>
      <li><b>Pick one.</b><span>You both get each other's email, and you agree the details between you.</span></li>
    </ol>
  );
}

export function MyPostsPage() {
  const state = useLoad(() => api<{ posts: PostView[] }>("/api/job-posts"), []);
  return (
    <Page title="Your job posts" intro="Post a job, and experts who do that work reply. You pick the one you want." actions={<Button href="/job-posts/new">Post a job</Button>}>
      <Loaded state={state}>{({ posts }) => posts.length === 0 ? (
        <div class="stack">
          <Empty title="No posts yet" action={<Button href="/job-posts/new">Post a job</Button>}>Describe a job, and experts in that area can reply.</Empty>
          <Card title="How it works"><HowItWorks /></Card>
        </div>
      ) : (
        <ul class="exp-posts">
          {posts.map(p => (
            <li class="exp-post">
              <div class="row">
                <h2 class="exp-post-title"><Link href={`/job-posts/${p.id}`}>{p.title || "Post with its text removed"}</Link></h2>
                <Badge tone={STATUS[p.status].tone}>{STATUS[p.status].label}</Badge>
                {p.hidden && <Badge tone="warn">Hidden by our team</Badge>}
              </div>
              <p class="muted small">{p.area_label}{p.job_type ? ` · ${p.job_type.title}` : ""} · Posted {when(p.created_at)} · {p.reply_count} {p.reply_count === 1 ? "reply" : "replies"}</p>
            </li>
          ))}
        </ul>
      )}</Loaded>
    </Page>
  );
}

const LIMITS = { title: 120, brief: 3000 };

export function NewPostPage() {
  const catalogue = useLoad(() => api<CatalogueList>("/api/catalogue"), []);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [area, setArea] = useState<Area | "">("");
  const [jobType, setJobType] = useState("");
  const [website, setWebsite] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const jobs = useMemo(() => (catalogue.data?.job_types ?? []).filter(j => j.area === area).sort((a, b) => a.title.localeCompare(b.title)), [catalogue.data, area]);

  function check() {
    const e: Record<string, string> = {};
    if (title.trim().length < 5) e.title = "Add a short title: what the job is, in a few words.";
    if (brief.trim().length < 40) e.brief = "Say a bit more about what you need done: a few sentences is enough.";
    if (!area) e.area = "Pick the area the job is in.";
    if (website.trim() && !/^https:\/\/[^\s/]+\.[^\s]+$/.test(website.trim())) e.website = "Use a full link that starts with https://, or leave it empty.";
    if (!neededBy) e.neededBy = "Say when you need it.";
    return e;
  }

  async function submit(ev: Event) {
    ev.preventDefault();
    const found = check();
    setErrors(found); setServerError(null);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const res = await api<{ post: PostView }>("/api/job-posts", { body: { title: title.trim(), brief: brief.trim(), area, job_type_id: jobType || null, website_url: website.trim(), needed_by: neededBy } });
      navigate(`/job-posts/${res.post.id}`);
    } catch (err: any) {
      setServerError(err?.message ?? "We could not post that. Try again.");
    } finally { setBusy(false); }
  }

  return (
    <Page title="Post a job" intro="Describe what you need. Experts who do this kind of work can reply, and you pick one.">
      <form class="exp-form" onSubmit={submit} noValidate>
        <Notice tone="warn" title="Keep it safe">Do not paste passwords, keys or logins, or personal details about your customers. Experts only need to know what the job is.</Notice>
        <Card title="The job">
          <Field label="Title" id="post-title" help="A few words, for example: New landing page for our spring range." error={errors.title}>
            <Input id="post-title" value={title} onValue={setTitle} maxLength={LIMITS.title} />
          </Field>
          <Field label="What you need done" id="post-brief" help={`Plain text. What the job is, who it is for, and what a good result looks like. ${brief.trim().length} of ${LIMITS.brief} characters.`} error={errors.brief}>
            <TextArea id="post-brief" value={brief} onValue={setBrief} rows={7} maxLength={LIMITS.brief} />
          </Field>
          <Field label="Area" id="post-area" error={errors.area}>
            <Select id="post-area" value={area} onValue={v => { setArea(v as Area); setJobType(""); }}
              options={[{ value: "", label: "Pick an area" }, ...AREAS.map(a => ({ value: a, label: AREA_LABELS[a] }))]} />
          </Field>
          <Field label="Type of job (optional)" id="post-job" help={area ? "Pick the closest match from our job menu, or leave it empty." : "Pick an area first."}>
            {catalogue.loading && !catalogue.data ? <Spinner label="Loading the job menu..." /> : (
              <Select id="post-job" value={jobType} onValue={setJobType}
                options={[{ value: "", label: area ? "Any job in this area" : "Pick an area first" }, ...jobs.map(j => ({ value: j.id, label: j.title }))]} />
            )}
          </Field>
          <Field label="Your website (optional)" id="post-site" help="So experts can see your business. Starts with https://." error={errors.website}>
            <Input id="post-site" value={website} onValue={setWebsite} maxLength={500} inputMode="url" type="url" placeholder="https://" />
          </Field>
          <Field label="When do you need it?" id="post-when" error={errors.neededBy}>
            <Select id="post-when" value={neededBy} onValue={setNeededBy} options={[{ value: "", label: "Pick one" }, ...NEEDED_BY_OPTIONS]} />
          </Field>
        </Card>
        <Card title="What happens next"><HowItWorks /></Card>
        {Object.keys(errors).length > 0 && <Notice tone="bad">Fix the items marked in red, then post again.</Notice>}
        {serverError && <Notice tone="bad">{serverError}</Notice>}
        <div class="row exp-actions">
          <Button type="submit" busy={busy}>Post the job</Button>
          <span class="muted small">You can close or delete it at any time. We delete the text after 60 days.</span>
        </div>
      </form>
    </Page>
  );
}

interface PostAnswer { post: PostView; replies: ReplyView[] | null; my_reply: { note: string; created_at: string } | null; owner: boolean }

async function loadPost(id: string): Promise<PostAnswer | { missing: true }> {
  try { return await api<PostAnswer>(`/api/job-posts/${encodeURIComponent(id)}`); }
  catch (e) { if (e instanceof ApiError && e.status === 404) return { missing: true }; throw e; }
}

export function PostPage(props: { params: Record<string, string> }) {
  const id = props.params.id ?? "";
  const state = useLoad(() => loadPost(id), [id]);
  if (state.error) return <Page title="Job post"><Notice tone="bad">{state.error}</Notice></Page>;
  if (!state.data) return <Page title="Job post"><Spinner /></Page>;
  if ("missing" in state.data) return (
    <Page title="We could not find that post" intro="It may have been deleted, or it belongs to someone else.">
      <Button href="/job-posts">See your posts</Button>
    </Page>
  );
  return <PostBody data={state.data} reload={state.reload} />;
}

function PostBody(props: { data: PostAnswer; reload: () => void }) {
  const { post: p, replies, owner } = props.data;
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const act = async (what: string, run: () => Promise<unknown>, done: string) => {
    setBusy(what); setError(null);
    try { await run(); setMessage(done); props.reload(); }
    catch (err: any) { setError(err?.message ?? "Something went wrong. Try again."); }
    finally { setBusy(null); }
  };
  const remove = () => act("delete", async () => { await api(`/api/job-posts/${encodeURIComponent(p.id)}`, { method: "DELETE" }); navigate("/job-posts"); }, "Deleted.");
  const s = STATUS[p.status];
  return (
    <Page title={p.title || "Post with its text removed"} intro={<>{p.area_label}{p.job_type ? ` · ${p.job_type.title}` : ""} · {p.needed_by_label}</>}
      actions={owner ? <Button kind="secondary" href="/job-posts">All your posts</Button> : undefined}>
      <div class="stack exp-form">
        <p class="row"><Badge tone={s.tone}>{s.label}</Badge><span class="muted small">Posted {longDate(p.created_at)}.{p.text_deleted ? "" : ` We delete the text on ${longDate(p.expires_at)}.`}</span></p>
        {message && <Notice tone="good">{message}</Notice>}
        {p.hidden && <Notice tone="warn" title="Our team hid this post">Experts cannot see it.{p.hidden_note ? ` Reason: ${p.hidden_note}` : ""}</Notice>}
        <Card title="What you asked for">
          {p.brief ? <p class="exp-quote">{p.brief}</p> : <p class="muted">The text of this post has been deleted.</p>}
          {p.website_url && <p class="small">Website: <a href={p.website_url} target="_blank" rel="noopener noreferrer nofollow">{p.website_url}</a></p>}
        </Card>

        {props.data.my_reply && (
          <Card title="Your reply">
            <p class="exp-quote">{props.data.my_reply.note}</p>
            <p class="muted small">Sent {when(props.data.my_reply.created_at)}. If the business picks you, we email you their address.</p>
          </Card>
        )}

        {replies && (
          <Card title={`Replies from experts (${replies.length})`}>
            {replies.length === 0
              ? <p class="muted">{p.status === "open" ? "No replies yet. We tell experts in this area about new jobs once a day, so give it a day or two." : "No experts replied."}</p>
              : <ul class="exp-posts">{replies.map(r => (
                <li class={`exp-post${r.picked ? " exp-post-picked" : ""}`}>
                  <div class="row">
                    <h3 class="exp-post-title">{r.expert.profile_url ? <Link href={r.expert.profile_url}>{r.expert.name}</Link> : r.expert.name}</h3>
                    {r.picked && <Badge tone="good">You picked this expert</Badge>}
                  </div>
                  <p class="muted small">{r.expert.headline}{r.expert.areas.length ? ` · ${r.expert.areas.join(", ")}` : ""}</p>
                  {r.note && <p class="exp-quote">{r.note}</p>}
                  <div class="row">
                    {r.expert.profile_url && <Button small kind="secondary" href={r.expert.profile_url}>See their page</Button>}
                    {owner && p.status === "open" && <Button small busy={busy === r.id} disabled={!!busy} onClick={() => act(r.id, () => api(`/api/job-posts/${encodeURIComponent(p.id)}/pick`, { body: { reply_id: r.id } }), `You picked ${r.expert.name}. We emailed you both each other's address.`)}>Pick {r.expert.name.split(/\s+/)[0]}</Button>}
                  </div>
                </li>
              ))}</ul>}
            {p.status === "open" && replies.length > 0 && <p class="muted small exp-help">When you pick an expert, we email you both each other's address and close the post.</p>}
          </Card>
        )}

        {error && <Notice tone="bad">{error}</Notice>}
        {owner && (
          <Card title="Close or delete">
            <p class="muted">Close the post to stop new replies. Delete it to remove its text now.</p>
            {confirmDelete ? (
              <div class="row">
                <span>Delete this post? Its text is removed and cannot come back.</span>
                <Button kind="danger" small busy={busy === "delete"} onClick={remove}>Yes, delete</Button>
                <Button kind="ghost" small onClick={() => setConfirmDelete(false)}>Back</Button>
              </div>
            ) : (
              <div class="row">
                {p.status === "open" && <Button small kind="secondary" busy={busy === "close"} disabled={!!busy} onClick={() => act("close", () => api(`/api/job-posts/${encodeURIComponent(p.id)}/close`, { body: {} }), "Closed. Experts can no longer reply.")}>Close the post</Button>}
                <Button small kind="danger" disabled={!!busy} onClick={() => setConfirmDelete(true)}>Delete the post</Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </Page>
  );
}
