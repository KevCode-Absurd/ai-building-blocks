// Pages for the delivery module: /jobs (the buyer's jobs) and /jobs/:id (status, draft, checklist and decisions).
import { useEffect, useRef, useState } from "preact/hooks";
import type { NavItem, PageDef } from "../types.ts";
import type { BuyerJobView, JobListItem, PersonaBrief } from "../../../modules/delivery/service.ts";
import type { JobStatus } from "../../../core/types.ts";
import { Badge, Button, Card, Empty, Field, Loaded, Markdown, Notice, Page, Spinner, TextArea, useLoad } from "../../components.tsx";
import { api, money, when } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import "./delivery.css";

type Tone = "neutral" | "good" | "warn" | "bad" | "info";
type View = BuyerJobView;
type DraftView = View["drafts"][number];
type Criterion = View["criteria"][number];

const POLL_MS = 10_000;

function statusTone(status: JobStatus): Tone {
  if (status === "delivered" || status === "draft" || status === "quoted") return "info";
  if (status === "accepted") return "good";
  if (status === "rejected") return "bad";
  if (status === "failed" || status === "disputed") return "warn";
  return "neutral";
}

function StatusBadge(props: { status: JobStatus; label: string }) {
  return <Badge tone={statusTone(props.status)}>{props.label}</Badge>;
}

function Portrait(props: { persona: PersonaBrief | null; size: number }) {
  const [broken, setBroken] = useState(false);
  const p = props.persona;
  const bg = p?.accent ? `color-mix(in srgb, ${p.accent} 30%, var(--panel))` : undefined;
  return (
    <span class="dlv-portrait" aria-hidden="true" style={{ width: `${props.size}px`, height: `${props.size}px`, fontSize: `${Math.round(props.size / 2.4)}px`, background: bg }}>
      {p?.portrait && !broken
        ? <img src={p.portrait} alt="" width={props.size} height={props.size} loading="lazy" onError={() => setBroken(true)} />
        : <span>{(p?.name || "A").slice(0, 1).toUpperCase()}</span>}
    </span>
  );
}

const agentLine = (p: PersonaBrief | null) => (p ? `${p.name}, ${p.title}` : "AI Blocks agent");

// ---------- /jobs ----------

function JobsList() {
  const state = useLoad(() => api<{ jobs: JobListItem[] }>("/api/jobs"), []);
  return (
    <Page title="My jobs" intro="Every job you ordered, newest first. Open one to read the draft and decide what happens next."
      actions={<Button kind="secondary" href="/agents">Hire an agent</Button>}>
      <Loaded state={state}>
        {data => data.jobs.length === 0 ? (
          <Empty title="No jobs yet" action={<Button href="/agents">Meet the agents</Button>}>
            Pick an agent and tell them what you need. Your jobs show up here, and each draft appears when it is ready.
          </Empty>
        ) : (
          <div class="dlv-list">
            {data.jobs.map(j => (
              <Link href={j.href} class="dlv-card">
                <Portrait persona={j.persona} size={48} />
                <div class="dlv-card-body">
                  <div class="dlv-card-top">
                    <strong class="dlv-card-title">{j.title}</strong>
                    <StatusBadge status={j.status} label={j.statusLabel} />
                  </div>
                  <p class="dlv-card-meta">{agentLine(j.persona)}{j.jobType && j.jobType.title !== j.title ? ` · ${j.jobType.title}` : ""}</p>
                  <p class="dlv-card-meta muted">
                    {j.needsYou && <span class="dlv-needs">{j.status === "delivered" ? "Waiting for your decision · " : "Waiting for you · "}</span>}
                    Updated {when(j.updatedAt)}{j.priceCents !== null ? ` · ${money(j.priceCents)}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Loaded>
    </Page>
  );
}

// ---------- /jobs/:id ----------

/** Loads one job and polls every 10 seconds while work is in progress. A failed poll keeps the page as it was. */
function useJob(id: string) {
  const [state, setState] = useState<{ data: View | null; error: string | null; stale: boolean }>({ data: null, error: null, stale: false });
  const live = useRef(true);
  const load = async () => {
    try {
      const data = await api<View>(`/api/jobs/${encodeURIComponent(id)}`);
      if (live.current) setState({ data, error: null, stale: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      if (live.current) setState(s => (s.data ? { ...s, stale: true } : { data: null, error: message, stale: false }));
    }
  };
  useEffect(() => {
    live.current = true;
    setState({ data: null, error: null, stale: false });
    void load();
    return () => { live.current = false; };
  }, [id]);
  const working = !!state.data?.job.working;
  useEffect(() => {
    if (!working) return;
    const timer = setInterval(() => { if (!document.hidden) void load(); }, POLL_MS);
    return () => clearInterval(timer);
  }, [working, id]);
  return { ...state, set: (data: View) => setState({ data, error: null, stale: false }) };
}

const STEPS = ["Ordered", "Working", "Checking", "Final check", "Ready for you", "Done"];

function stepIndex(status: JobStatus): number {
  switch (status) {
    case "confirmed": return 0;
    case "running": case "revising": case "failed": return 1;
    case "checking": return 2;
    case "in_review": return 3;
    case "delivered": case "rejected": case "disputed": return 4;
    case "accepted": return 6;
    default: return -1;
  }
}

function Progress(props: { status: JobStatus }) {
  const now = stepIndex(props.status);
  if (now < 0 || props.status === "cancelled") return null;
  const warn = props.status === "failed" || props.status === "rejected" || props.status === "disputed";
  return (
    <ol class="dlv-steps" aria-label="Progress">
      {STEPS.map((label, i) => {
        const cls = i < now ? "dlv-step-done" : i === now ? `dlv-step-now${warn ? " dlv-step-warn" : ""}` : "";
        return (
          <li class={`dlv-step ${cls}`} aria-current={i === now ? "step" : undefined}>
            {label}<span class="dlv-sr">{i < now ? " (done)" : i === now ? " (now)" : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}

const fileName = (title: string, version: number, many: boolean) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "draft"}${many ? `-v${version}` : ""}.md`;

function downloadText(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Draft(props: { title: string; drafts: DraftView[]; index: number; onIndex: (i: number) => void }) {
  const d = props.drafts[props.index];
  const many = props.drafts.length > 1;
  const [copy, setCopy] = useState<"idle" | "done" | "failed">("idle");
  useEffect(() => { setCopy("idle"); }, [d.id]);
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(d.content); setCopy("done"); } catch { setCopy("failed"); }
  };
  return (
    <Card class="dlv-draft" title={many ? `Draft ${props.index + 1} of ${props.drafts.length}` : "Your draft"}
      actions={<div class="dlv-draft-tools">
        <Button small kind="secondary" onClick={doCopy}>{copy === "done" ? "Copied" : "Copy text"}</Button>
        <Button small kind="secondary" onClick={() => downloadText(fileName(props.title, d.version, many), d.content)}>Download as .md</Button>
      </div>}>
      {many && (
        <div class="dlv-versions" role="group" aria-label="Drafts">
          {props.drafts.map((x, i) => (
            <Button small kind={i === props.index ? "primary" : "ghost"} onClick={() => props.onIndex(i)}>
              {i === props.drafts.length - 1 ? `Draft ${i + 1} (latest)` : `Draft ${i + 1}`}
            </Button>
          ))}
        </div>
      )}
      {copy === "failed" && <p class="dlv-copy-note" role="status">Copy did not work here. Select the text and copy it, or download the file.</p>}
      <div class="dlv-draft-body">
        {d.format === "markdown" ? <Markdown text={d.content} /> : <pre class="dlv-plain">{d.content}</pre>}
      </div>
      {d.releasedAt && <p class="dlv-copy-note">Ready for you {when(d.releasedAt)}</p>}
    </Card>
  );
}

function Checklist(props: { criteria: Criterion[]; check: DraftView["check"] }) {
  const marks = new Map((props.check?.criteria ?? []).map(c => [c.id, c.pass]));
  const met = props.criteria.filter(c => marks.get(c.id) === true).length;
  if (!props.criteria.length) return null;
  return (
    <Card title="Your checklist">
      <p class="muted small">
        {props.check ? `${met} of ${props.criteria.length} met in our check of this draft.` : "We check the draft against each item before you see it."}
      </p>
      <ul class="dlv-checklist">
        {props.criteria.map(c => {
          const pass = marks.get(c.id);
          return (
            <li class={pass === true ? "dlv-pass" : pass === false ? "dlv-fail" : ""}>
              <span class="dlv-mark" aria-hidden="true">{pass === true ? "✓" : pass === false ? "✗" : "·"}</span>
              <span>
                {c.text}
                <span class="dlv-sr">{pass === true ? " (met)" : pass === false ? " (not met)" : " (not checked yet)"}</span>
                {c.critical && <><br /><span class="dlv-critical">Must pass</span></>}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Ticks(props: { legend: string; criteria: Criterion[]; value: string[]; onValue: (v: string[]) => void }) {
  if (!props.criteria.length) return null;
  return (
    <fieldset class="dlv-fieldset">
      <legend>{props.legend}</legend>
      {props.criteria.map(c => (
        <label class="dlv-tick">
          <input type="checkbox" checked={props.value.includes(c.id)}
            onChange={e => props.onValue((e.target as HTMLInputElement).checked ? [...props.value, c.id] : props.value.filter(x => x !== c.id))} />
          <span>{c.text}</span>
        </label>
      ))}
    </fieldset>
  );
}

function EditBox(props: { summary: string; help: string; original: string; value: string; onValue: (v: string) => void; id: string }) {
  return (
    <details class="dlv-more">
      <summary>{props.summary}</summary>
      <Field label="Your version" help={props.help} id={props.id}>
        <TextArea id={props.id} rows={12} value={props.value} onValue={props.onValue} />
      </Field>
      {props.value !== props.original && <Button small kind="ghost" onClick={() => props.onValue(props.original)}>Undo my edits</Button>}
    </details>
  );
}

/** Sends one decision; the API answers with the updated job view. */
function useSend(jobId: string, onDone: (v: View) => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const send = async (action: "accept" | "revise" | "reject" | "report", body: Record<string, unknown>) => {
    setBusy(true); setError(null);
    try { onDone(await api<View>(`/api/jobs/${encodeURIComponent(jobId)}/${action}`, { body })); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong. Try again."); }
    finally { setBusy(false); }
  };
  return { busy, error, send };
}

function AcceptForm(props: { view: View; draft: DraftView; onDone: (v: View) => void }) {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [edited, setEdited] = useState(props.draft.content);
  const { busy, error, send } = useSend(props.view.job.id, props.onDone);
  return (
    <form onSubmit={e => {
      e.preventDefault();
      void send("accept", { rating, note, editedContent: edited !== props.draft.content ? edited : undefined });
    }}>
      <fieldset class="dlv-fieldset">
        <legend>How good is it?</legend>
        <div class="dlv-stars">
          {[1, 2, 3, 4, 5].map(n => (
            <button type="button" class={`dlv-star${n <= rating ? " dlv-star-on" : ""}`} aria-pressed={n === rating} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}>
              {n <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      </fieldset>
      <Field label="Anything to tell us? (optional)" id="dlv-note">
        <TextArea id="dlv-note" rows={3} value={note} onValue={setNote} maxLength={2000} />
      </Field>
      <EditBox id="dlv-accept-edit" summary="I changed the text myself (optional)" help="Paste or edit your final version. We save only what you changed."
        original={props.draft.content} value={edited} onValue={setEdited} />
      {error && <Notice tone="bad">{error}</Notice>}
      <Button type="submit" busy={busy} disabled={!rating}>Accept the work</Button>
      {!rating && <p class="muted small">Pick 1 to 5 stars to accept.</p>}
    </form>
  );
}

function ReviseForm(props: { view: View; draft: DraftView; onDone: (v: View) => void }) {
  const v = props.view;
  const [reasons, setReasons] = useState("");
  const [failed, setFailed] = useState<string[]>([]);
  const [edited, setEdited] = useState(props.draft.content);
  const { busy, error, send } = useSend(v.job.id, props.onDone);
  if (v.revisionsLeft <= 0) {
    return <Notice tone="warn" title="No revisions left">You used all {v.job.revisionsAllowed} revisions on this job. Accept the work, or reject it and our team will follow up.</Notice>;
  }
  const ready = !!reasons.trim() || failed.length > 0;
  return (
    <form onSubmit={e => {
      e.preventDefault();
      void send("revise", { reasons, failedCriteria: failed, editedContent: edited !== props.draft.content ? edited : undefined });
    }}>
      <p class="dlv-left">You have {v.revisionsLeft} of {v.job.revisionsAllowed} revisions left. {props.view.persona?.name ?? "The agent"} starts on your changes right away.</p>
      <Field label="What should change?" id="dlv-reasons" help="Be specific. For example: make the headline shorter and use our price, $29 a month.">
        <TextArea id="dlv-reasons" rows={4} value={reasons} onValue={setReasons} maxLength={4000} />
      </Field>
      <Ticks legend="Tick the checklist items that are not met" criteria={v.criteria} value={failed} onValue={setFailed} />
      <EditBox id="dlv-revise-edit" summary="Edit the text yourself (optional)" help="The agent keeps your edits and works from them."
        original={props.draft.content} value={edited} onValue={setEdited} />
      {error && <Notice tone="bad">{error}</Notice>}
      <Button type="submit" busy={busy} disabled={!ready}>Ask for changes</Button>
      {!ready && <p class="muted small">Say what should change, or tick at least one checklist item.</p>}
    </form>
  );
}

function RejectForm(props: { view: View; onDone: (v: View) => void }) {
  const [reasons, setReasons] = useState("");
  const [failed, setFailed] = useState<string[]>([]);
  const { busy, error, send } = useSend(props.view.job.id, props.onDone);
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!confirm("Reject this work? You cannot undo this.")) return;
      void send("reject", { reasons, failedCriteria: failed });
    }}>
      <Notice tone="info">Nothing was charged, so there is nothing to refund. Our team reads every rejection and gets back to you.</Notice>
      <Field label="Why are you rejecting it?" id="dlv-reject">
        <TextArea id="dlv-reject" rows={4} value={reasons} onValue={setReasons} maxLength={4000} />
      </Field>
      <Ticks legend="Which checklist items are not met? (optional)" criteria={props.view.criteria} value={failed} onValue={setFailed} />
      {error && <Notice tone="bad">{error}</Notice>}
      <Button type="submit" kind="danger" busy={busy} disabled={!reasons.trim()}>Reject the work</Button>
    </form>
  );
}

function Decide(props: { view: View; draft: DraftView; onDone: (v: View) => void }) {
  const [mode, setMode] = useState<"accept" | "revise" | "reject">("accept");
  const choices = [
    { id: "accept" as const, label: "Accept" },
    { id: "revise" as const, label: props.view.revisionsLeft > 0 ? `Ask for changes (${props.view.revisionsLeft} left)` : "Ask for changes" },
    { id: "reject" as const, label: "Reject" },
  ];
  return (
    <Card title="What do you think?">
      <div class="dlv-choices" role="group" aria-label="Your decision">
        {choices.map(c => (
          <button type="button" class={`dlv-choice${mode === c.id ? " dlv-choice-on" : ""}`} aria-pressed={mode === c.id} onClick={() => setMode(c.id)}>{c.label}</button>
        ))}
      </div>
      {mode === "accept" && <AcceptForm view={props.view} draft={props.draft} onDone={props.onDone} />}
      {mode === "revise" && <ReviseForm view={props.view} draft={props.draft} onDone={props.onDone} />}
      {mode === "reject" && <RejectForm view={props.view} onDone={props.onDone} />}
    </Card>
  );
}

function ReportProblem(props: { view: View; onDone: (v: View) => void }) {
  const [open, setOpen] = useState(false);
  const [reasons, setReasons] = useState("");
  const { busy, error, send } = useSend(props.view.job.id, props.onDone);
  return (
    <div class="dlv-report">
      <button type="button" class="dlv-link" aria-expanded={open} onClick={() => setOpen(!open)}>Report a problem</button>
      {open && (
        <Card title="Report a problem">
          <p class="muted small">For something a revision cannot fix, such as made-up facts or the wrong job. Our team looks into it, and we will not accept the work for you while we do.</p>
          <form onSubmit={e => { e.preventDefault(); void send("report", { reasons }); }}>
            <Field label="What is the problem?" id="dlv-problem">
              <TextArea id="dlv-problem" rows={4} value={reasons} onValue={setReasons} maxLength={4000} />
            </Field>
            {error && <Notice tone="bad">{error}</Notice>}
            <div class="row">
              <Button type="submit" busy={busy} disabled={!reasons.trim()}>Send to our team</Button>
              <Button kind="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

function Decisions(props: { view: View }) {
  const byId = new Map(props.view.criteria.map(c => [c.id, c.text]));
  if (!props.view.decisions.length) return null;
  return (
    <Card title="Your decisions">
      <ul class="dlv-decisions">
        {props.view.decisions.map(d => (
          <li>
            <strong>{d.label}</strong>
            <span class="dlv-when">{when(d.createdAt)}</span>
            {d.rating !== null && <span aria-label={`${d.rating} of 5 stars`}>{"★".repeat(d.rating)}{"☆".repeat(5 - d.rating)}</span>}
            {d.reasons && <p class="dlv-quote">{d.reasons}</p>}
            {d.failedCriteria.length > 0 && <p class="dlv-quote muted">Not met: {d.failedCriteria.map(id => byId.get(id) ?? id).join("; ")}</p>}
            {d.editStats && <p class="dlv-quote muted">You changed the text ({d.editStats.removed} lines out, {d.editStats.added} lines in).</p>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Timeline(props: { view: View }) {
  if (!props.view.timeline.length) return null;
  return (
    <Card title="Timeline">
      <ol class="dlv-timeline">
        {props.view.timeline.map(t => <li><span>{t.label}</span><time dateTime={t.at}>{when(t.at)}</time></li>)}
      </ol>
    </Card>
  );
}

function Details(props: { view: View }) {
  const j = props.view.job;
  return (
    <Card title="Details">
      <dl class="dlv-facts">
        <dt>Agent</dt><dd>{agentLine(props.view.persona)}</dd>
        {props.view.jobType && <><dt>Job</dt><dd>{props.view.jobType.title}</dd></>}
        {j.priceCents !== null && <><dt>Price</dt><dd>{money(j.priceCents)}. Nothing is charged during the beta.</dd></>}
        <dt>Ordered</dt><dd>{when(j.createdAt)}</dd>
        <dt>Revisions</dt><dd>{j.revisionsUsed} of {j.revisionsAllowed} used</dd>
      </dl>
      {props.view.request && (
        <details class="dlv-more" style={{ marginTop: "16px", marginBottom: 0 }}>
          <summary>What you asked for</summary>
          <p class="dlv-request">{props.view.request}</p>
        </details>
      )}
    </Card>
  );
}

function JobPage(props: { params: Record<string, string> }) {
  const job = useJob(props.params.id);
  const [index, setIndex] = useState(-1);
  const count = job.data?.drafts.length ?? 0;
  useEffect(() => { setIndex(count - 1); }, [count]);
  if (job.error) return <Page title="Job"><Notice tone="bad">{job.error}</Notice><Button href="/jobs">Back to my jobs</Button></Page>;
  if (!job.data) return <main class="page"><Spinner /></main>;
  const v = job.data, j = v.job;
  const i = index >= 0 && index < count ? index : count - 1;
  const draft = count ? v.drafts[i] : null;
  const latest = count ? v.drafts[count - 1] : null;
  return (
    <Page title={j.title} intro={agentLine(v.persona)}
      actions={<div class="dlv-head-actions">
        <StatusBadge status={j.status} label={j.statusLabel} />
        <Button small kind="secondary" href={v.orderAgain}>Order again</Button>
      </div>}>
      {job.stale && <Notice tone="warn">We could not refresh this page. We will try again in a few seconds.</Notice>}
      <Card class="dlv-status">
        <Portrait persona={v.persona} size={56} />
        <div>
          <h2>{v.next.title}</h2>
          <p>{v.next.text}</p>
          {j.status === "delivered" && j.autoAcceptAt && <p class="dlv-auto">If you do nothing, we accept it for you on {when(j.autoAcceptAt)}.</p>}
          {j.working && <p class="dlv-auto">This page checks for news every 10 seconds.</p>}
        </div>
      </Card>
      <Progress status={j.status} />
      {(j.status === "draft" || j.status === "quoted") && (
        <Notice tone="info" title="Your order is not finished">
          <p>Finish the questions and confirm the quote to start the work.</p>
          <Button small href={`/requests/${j.id}`}>Finish your order</Button>
        </Notice>
      )}
      <div class="split">
        <div class="stack dlv-col">
          {draft ? <Draft title={j.title} drafts={v.drafts} index={i} onIndex={setIndex} />
            : j.working ? <Card><p class="muted" style={{ margin: 0 }}>The draft shows here when it is ready. We email you too.</p></Card> : null}
          {v.actions.accept && latest && <Decide view={v} draft={latest} onDone={job.set} />}
          {v.actions.report && <ReportProblem view={v} onDone={job.set} />}
          {j.status === "accepted" && <p class="muted small">Need something else? <Link href={v.orderAgain}>Order again</Link> or <Link href="/agents">hire another agent</Link>.</p>}
        </div>
        <aside class="stack dlv-col">
          <Checklist criteria={v.criteria} check={draft?.check ?? null} />
          <Decisions view={v} />
          <Timeline view={v} />
          <Details view={v} />
        </aside>
      </div>
    </Page>
  );
}

export const pages: PageDef[] = [
  { path: "/jobs", access: "buyer", component: JobsList },
  { path: "/jobs/:id", access: "buyer", component: JobPage },
];

export const nav: NavItem[] = [
  { label: "My jobs", href: "/jobs", group: "main", order: 30, show: me => !!me },
];
