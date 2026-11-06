// /requests/:id: answer the questions, see the fixed price and the checklist, then order.
import { useEffect, useState } from "preact/hooks";
import { Badge, Button, Card, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api, money, when } from "../../lib/api.ts";
import { navigate } from "../../lib/router.tsx";
import { JobTypeList, QuestionInput, showValue, turnaround, type AnswerValue, type JobSummary, type RequestView } from "./parts.tsx";

const OPEN = new Set(["draft", "quoted"]);

export function RequestPage(props: { params: Record<string, string> }) {
  const id = props.params.id;
  const loaded = useLoad(() => api<{ request: RequestView }>(`/api/requests/${encodeURIComponent(id)}`).then(r => r.request), [id]);
  const [view, setView] = useState<RequestView | null>(null);
  useEffect(() => { setView(loaded.data); }, [loaded.data]);
  const v = view ?? loaded.data;
  const ordered = !!v && !OPEN.has(v.status);
  useEffect(() => { if (v && ordered) navigate(v.job_url, { replace: true }); }, [ordered]);

  if (loaded.error) {
    return <Page title="Your request"><Notice tone="bad">{loaded.error}</Notice><Button href="/new">Start a new request</Button></Page>;
  }
  if (!v) return <Page title="Your request"><Spinner /></Page>;
  if (ordered) return <Page title={v.title || "Your job"}><Notice tone="good">This job is ordered.</Notice><Button href={v.job_url}>Open the job</Button></Page>;
  return <RequestBody key={v.id} view={v} onView={setView} />;
}

type Busy = null | "answer" | "quote" | "rush" | "goals" | "order" | "job";

function RequestBody(props: { view: RequestView; onView: (v: RequestView) => void }) {
  const v = props.view;
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [goals, setGoals] = useState(v.quote?.goals ?? v.goals ?? "");
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickJob, setPickJob] = useState(false);

  async function run(kind: Busy, work: () => Promise<void>) {
    setBusy(kind); setError(null);
    try { await work(); } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong. Try again."); } finally { setBusy(null); }
  }

  const post = (path: string, body: unknown) => api<{ request: RequestView }>(`/api/requests/${v.id}/${path}`, { body }).then(r => r.request);
  const quote = (rush: boolean, g: string) => post("quote", { rush, goals: g }).then(props.onView);

  function submitAnswers(e: Event) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    for (const q of v.questions) {
      const a = answers[q.field_id];
      if (a === undefined || (Array.isArray(a) ? a.length === 0 : !a.trim())) errs[q.field_id] = "Answer this to get your price.";
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    void run("answer", async () => {
      const next = await post("answers", { answers });
      props.onView(next);
      if (next.ready) await quote(false, goals);
    });
  }

  const choose = (jobTypeId: string) => run("job", async () => {
    props.onView(await post("answers", { jobTypeId }));
    setAnswers({}); setFieldErrors({}); setPickJob(false);
  });

  const order = () => run("order", async () => {
    const res = await api<{ next: string }>(`/api/requests/${v.id}/confirm`, { body: {} });
    navigate(res.next);
  });

  return (
    <Page title={v.job_type?.title ?? "Your request"} intro={v.persona ? `With ${v.persona.name}, ${v.persona.title}` : undefined}>
      <div class="intake-narrow stack">
        {error && <Notice tone="bad">{error}</Notice>}

        {v.open_request ? (
          <Notice tone="info" title="A person will look at this">
            <p>We could not match your request to one of our jobs. Our team will read it and get back to you.</p>
            <p>If one of these fits, pick it to get a price now.</p>
          </Notice>
        ) : (
          <p class="intake-jobline">
            {v.job_type!.summary}{" "}
            <button type="button" class="intake-link" onClick={() => setPickJob(!pickJob)} aria-expanded={pickJob}>Not the right job?</button>
          </p>
        )}
        {(v.open_request || pickJob) && <JobChooser view={v} busy={busy === "job"} onPick={choose} />}

        <YourWords view={v} />

        {v.status === "draft" && v.questions.length > 0 && (
          <Card title={v.questions.length === 1 ? "One question" : `${v.questions.length} questions`}>
            <form onSubmit={submitAnswers} noValidate>
              <p class="muted small">So the work fits. This is all we will ask.</p>
              {v.questions.map(q => (
                <QuestionInput q={q} value={answers[q.field_id]} error={fieldErrors[q.field_id]}
                  onValue={val => { setAnswers({ ...answers, [q.field_id]: val }); if (fieldErrors[q.field_id]) setFieldErrors({ ...fieldErrors, [q.field_id]: "" }); }} />
              ))}
              <Button type="submit" busy={busy === "answer"}>Get my quote</Button>
            </form>
          </Card>
        )}

        {v.status === "draft" && v.ready && (
          <Card title="Ready for a price">
            <p>We have what we need. Your price is fixed before any work starts.</p>
            <Button busy={busy === "quote"} onClick={() => run("quote", () => quote(false, goals))}>Get my quote</Button>
          </Card>
        )}

        {v.status === "quoted" && v.quote && (
          <QuoteCard view={v} goals={goals} onGoals={setGoals} busy={busy}
            onRush={rush => run("rush", () => quote(rush, v.quote!.goals))}
            onRequote={() => run("goals", () => quote(v.quote!.rush, goals))}
            onOrder={order} />
        )}
      </div>
    </Page>
  );
}

function JobChooser(props: { view: RequestView; busy: boolean; onPick: (id: string) => void }) {
  const [all, setAll] = useState(false);
  const catalogue = useLoad(() => all ? api<{ job_types: JobSummary[] }>("/api/catalogue").then(r => r.job_types) : Promise.resolve(null), [all]);
  const alts = props.view.alternatives;
  return (
    <Card class="intake-chooser" title="Pick the job that fits best">
      {alts.length > 0 && (
        <div class="intake-alts">
          {alts.map(a => (
            <button type="button" class="intake-job" disabled={props.busy} onClick={() => props.onPick(a.id)}>
              <span class="intake-job-title">{a.title}</span>
              <span class="intake-job-meta">{a.summary}</span>
            </button>
          ))}
        </div>
      )}
      {!all && <Button kind="secondary" small onClick={() => setAll(true)}>See every job</Button>}
      {catalogue.error && <Notice tone="bad">{catalogue.error}</Notice>}
      {all && catalogue.loading && !catalogue.data && <Spinner />}
      {catalogue.data && <JobTypeList jobs={catalogue.data} value={props.view.job_type?.id ?? null} busy={props.busy} onPick={props.onPick} />}
    </Card>
  );
}

function YourWords(props: { view: RequestView }) {
  const v = props.view;
  return (
    <details class="intake-words">
      <summary>What you asked for</summary>
      <blockquote class="intake-quote">{v.request_text}</blockquote>
      {v.details.length > 0 && (
        <>
          <h3 class="intake-sub">What we took from it</h3>
          <dl class="intake-details">
            {v.details.map(d => (
              <div><dt>{d.label.replace(/\?$/, "")}</dt><dd>{showValue(d.value, d.in_request)}</dd></div>
            ))}
          </dl>
        </>
      )}
    </details>
  );
}

function QuoteCard(props: {
  view: RequestView; goals: string; busy: Busy; onGoals: (g: string) => void;
  onRush: (rush: boolean) => void; onRequote: () => void; onOrder: () => void;
}) {
  const v = props.view;
  const q = v.quote!;
  const r = q.rush_option;
  const goalsChanged = props.goals.trim() !== q.goals.trim();
  return (
    <Card class="intake-quote-card">
      <div class="intake-price">
        <span class="intake-price-amount">{money(q.price_cents)}</span>
        <span class="intake-price-note">Fixed price. Free during the beta, so nothing is charged.</span>
      </div>
      <p class="intake-ready">Ready in <strong>{turnaround(q.turnaround_hours)}</strong> after you order.</p>

      {r && (
        <label class="intake-rush">
          <input type="checkbox" checked={q.rush} disabled={props.busy !== null} onChange={() => props.onRush(!q.rush)} />
          <span>
            {q.rush
              ? <>Rush is on. Turn it off to wait {turnaround(r.turnaround_hours)} and pay {money(r.price_cents)}.</>
              : <>Rush: ready in {turnaround(r.turnaround_hours)} for {money(r.price_cents)}.</>}
          </span>
        </label>
      )}

      <details class="intake-breakdown">
        <summary>How we worked out the price</summary>
        <ul>
          {q.breakdown.map(b => <li><span>{b.label}</span><span>{b.cents < 0 ? `-${money(-b.cents)}` : money(b.cents)}</span></li>)}
        </ul>
      </details>

      <h3 class="intake-sub">What good looks like</h3>
      <p class="muted small">Every draft is checked against this list before you see it.</p>
      <ul class="intake-checklist">
        {q.checklist.map(c => <li>{c.text} {c.source === "buyer" && <Badge tone="info">Your goal</Badge>}</li>)}
      </ul>

      <label class="field" for="intake-goals">
        <span class="field-label">Anything else that matters?</span>
        <textarea id="intake-goals" class="input textarea" rows={3} maxLength={3000} value={props.goals}
          placeholder="For example: mention our free trial, and keep it short."
          onInput={e => props.onGoals((e.target as HTMLTextAreaElement).value)} />
        <span class="field-help">We add up to three of your goals to the list above.</span>
      </label>
      {goalsChanged && <Button kind="secondary" busy={props.busy === "goals"} disabled={props.busy !== null} onClick={props.onRequote}>Update my quote</Button>}

      {q.expired ? (
        <Notice tone="warn" title="This quote has expired">
          <p>Get a new quote to see the current price.</p>
          <Button busy={props.busy === "goals"} onClick={props.onRequote}>Get a new quote</Button>
        </Notice>
      ) : (
        <div class="intake-order">
          <Button busy={props.busy === "order"} disabled={props.busy !== null || goalsChanged} onClick={props.onOrder}>Order now, free during the beta</Button>
          {goalsChanged && <span class="small muted">Update your quote first, so the list includes your goals.</span>}
          <span class="small muted">This price holds until {when(q.expires_at)}. After delivery you can ask for changes up to {v.revisions_allowed} times.</span>
        </div>
      )}
    </Card>
  );
}
