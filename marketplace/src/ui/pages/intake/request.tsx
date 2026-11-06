// /requests/:id: answer the questions, check the plan (what the agent delivers, by when, and the checklist), then
// start the job. Hiring is free, so there is no price anywhere on this page.
import { useEffect, useState } from "preact/hooks";
import { Badge, Button, Card, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api, ApiError, when } from "../../lib/api.ts";
import { navigate } from "../../lib/router.tsx";
import { DailyLimitNotice, JobTypeList, QuestionInput, showValue, turnaround, type AnswerValue, type JobSummary, type RequestView } from "./parts.tsx";

const OPEN = new Set(["draft", "quoted"]);

/** One line at the top of the page: where the visitor is and what happens here. */
function context(v: RequestView): string {
  const who = v.persona ? `This is your request to ${v.persona.name}, ${v.persona.title}.` : "This is your request.";
  if (v.status === "quoted") return `${who} Check the plan, then start the job.`;
  if (v.open_request) return `${who} Pick the job that fits best, or wait for our team to reply.`;
  return `${who} Answer the questions, check the plan, then start the job.`;
}

export function RequestPage(props: { params: Record<string, string> }) {
  const id = props.params.id;
  const loaded = useLoad(() => api<{ request: RequestView }>(`/api/requests/${encodeURIComponent(id)}`).then(r => r.request), [id]);
  const [view, setView] = useState<RequestView | null>(null);
  useEffect(() => { setView(loaded.data); }, [loaded.data]);
  const v = view ?? loaded.data;
  const started = !!v && !OPEN.has(v.status) && v.status !== "cancelled";
  useEffect(() => { if (v && started) navigate(v.job_url, { replace: true }); }, [started]);

  if (loaded.error) {
    return (
      <Page title="Request not found" intro="We could not open this request. It may belong to another account, or the link may be wrong.">
        <Notice tone="bad">{loaded.error}</Notice>
        <div class="row"><Button href="/new">Start a new request</Button><Button kind="secondary" href="/jobs">See my jobs</Button></div>
      </Page>
    );
  }
  if (!v) return <Page title="Your request"><Spinner /></Page>;
  if (v.status === "cancelled") {
    return (
      <Page title={v.title || "Your request"} intro="This request is closed. Nothing more will happen with it.">
        <div class="row"><Button href="/new">Start a new request</Button><Button kind="secondary" href="/agents">Browse agents</Button></div>
      </Page>
    );
  }
  if (started) return <Page title={v.title || "Your job"} intro="This job has started. Follow it on the job page."><Button href={v.job_url}>Open the job</Button></Page>;
  return <RequestBody key={v.id} view={v} onView={setView} />;
}

type Busy = null | "answer" | "plan" | "faster" | "goals" | "start" | "job";

function RequestBody(props: { view: RequestView; onView: (v: RequestView) => void }) {
  const v = props.view;
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [goals, setGoals] = useState(v.plan?.goals ?? v.goals ?? "");
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [limited, setLimited] = useState<string | null>(null);
  const [pickJob, setPickJob] = useState(false);

  async function run(kind: Busy, work: () => Promise<void>) {
    setBusy(kind); setError(null); setLimited(null);
    try { await work(); }
    catch (err) {
      if (err instanceof ApiError && err.code === "daily_limit") setLimited(err.message);
      else setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally { setBusy(null); }
  }

  const post = (path: string, body: unknown) => api<{ request: RequestView }>(`/api/requests/${v.id}/${path}`, { body }).then(r => r.request);
  const plan = (faster: boolean, g: string) => post("plan", { faster, goals: g }).then(props.onView);

  function submitAnswers(e: Event) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    for (const q of v.questions) {
      const a = answers[q.field_id];
      if (a === undefined || (Array.isArray(a) ? a.length === 0 : !a.trim())) errs[q.field_id] = "Answer this to see the plan.";
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    void run("answer", async () => {
      const next = await post("answers", { answers });
      props.onView(next);
      if (next.ready) await plan(false, goals);
    });
  }

  const choose = (jobTypeId: string) => run("job", async () => {
    props.onView(await post("answers", { jobTypeId }));
    setAnswers({}); setFieldErrors({}); setPickJob(false);
  });

  const start = () => run("start", async () => {
    const res = await api<{ next: string }>(`/api/requests/${v.id}/start`, { body: {} });
    navigate(res.next);
  });

  return (
    <Page title={v.job_type?.title ?? "Your request"} intro={context(v)}>
      <div class="intake-narrow stack">
        {error && <Notice tone="bad">{error}</Notice>}

        {v.open_request ? (
          <Notice tone="info" title="A person will look at this">
            <p>We could not match your request to one of our jobs. Our team will read it and get back to you.</p>
            <p>If one of these fits, pick it to see the plan now.</p>
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
              <Button type="submit" busy={busy === "answer"}>See the plan</Button>
            </form>
          </Card>
        )}

        {v.status === "draft" && v.ready && (v.expired_plan ? (
          <Card title="Your plan timed out">
            <p>
              You did not start this job within 7 days, so we closed the plan{v.expired_plan.expired_at ? ` on ${when(v.expired_plan.expired_at)}` : ""}.
              We kept your answers and your goals.
            </p>
            <p>Check the plan again, then start the job.</p>
            {/* No faster value: the new plan keeps the faster-delivery choice from the old one. */}
            <Button busy={busy === "plan"} onClick={() => run("plan", () => post("plan", { goals }).then(props.onView))}>Check the plan again</Button>
          </Card>
        ) : (
          <Card title="Ready for the plan">
            <p>We have what we need. See what the agent will deliver and when, then start the job.</p>
            <Button busy={busy === "plan"} onClick={() => run("plan", () => plan(false, goals))}>See the plan</Button>
          </Card>
        ))}

        {v.status === "quoted" && v.plan && (
          <PlanCard view={v} goals={goals} onGoals={setGoals} busy={busy} limited={limited}
            onFaster={faster => run("faster", () => plan(faster, v.plan!.goals))}
            onReplan={() => run("goals", () => plan(v.plan!.faster, goals))}
            onStart={start} />
        )}
        {v.status !== "quoted" && limited && <DailyLimitNotice message={limited} />}
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

/** The plan: what you get, when it is ready, faster delivery, the checklist, your goals, and one button to start. */
function PlanCard(props: {
  view: RequestView; goals: string; busy: Busy; limited: string | null; onGoals: (g: string) => void;
  onFaster: (faster: boolean) => void; onReplan: () => void; onStart: () => void;
}) {
  const v = props.view;
  const p = v.plan!;
  const other = p.faster_option;
  const goalsChanged = props.goals.trim() !== p.goals.trim();
  const who = v.persona?.name;
  return (
    <Card class="intake-plan-card" title={who ? `${who}'s plan` : "The plan"}>
      <dl class="intake-plan">
        {p.deliverable && <div><dt>What you get</dt><dd>{p.deliverable}</dd></div>}
        <div><dt>When it is ready</dt><dd>In about <strong>{turnaround(p.turnaround_hours)}</strong> after you start{p.faster ? ", with faster delivery" : ""}.</dd></div>
        <div><dt>Changes</dt><dd>After delivery you can ask for changes up to {v.revisions_allowed} times.</dd></div>
      </dl>

      {other && (
        <label class="intake-rush">
          <input type="checkbox" checked={p.faster} disabled={props.busy !== null} onChange={() => props.onFaster(!p.faster)} />
          <span>
            {p.faster
              ? <>Faster delivery is on. Turn it off to take the usual {turnaround(other.turnaround_hours)}.</>
              : <>Faster delivery: ready in about {turnaround(other.turnaround_hours)} instead of {turnaround(p.turnaround_hours)}.</>}
          </span>
        </label>
      )}

      <h3 class="intake-sub">What good looks like</h3>
      <p class="muted small">Every draft is checked against this list before you see it.</p>
      <ul class="intake-checklist">
        {p.checklist.map(c => <li>{c.text} {c.source === "buyer" && <Badge tone="info">Your goal</Badge>}</li>)}
      </ul>

      <label class="field" for="intake-goals">
        <span class="field-label">Anything else that matters?</span>
        <textarea id="intake-goals" class="input textarea" rows={3} maxLength={3000} value={props.goals}
          placeholder="For example: mention our free trial, and keep it short."
          onInput={e => props.onGoals((e.target as HTMLTextAreaElement).value)} />
        <span class="field-help">We add up to three of your goals to the list above.</span>
      </label>
      {goalsChanged && <Button kind="secondary" busy={props.busy === "goals"} disabled={props.busy !== null} onClick={props.onReplan}>Add my goals to the plan</Button>}

      {props.limited && <DailyLimitNotice message={props.limited} />}

      {p.expired ? (
        <Notice tone="warn" title="This plan timed out">
          <p>You did not start it within 7 days. Check the plan again, then start the job.</p>
          <Button busy={props.busy === "goals"} onClick={props.onReplan}>Check the plan again</Button>
        </Notice>
      ) : (
        <div class="intake-order">
          <Button busy={props.busy === "start"} disabled={props.busy !== null || goalsChanged} onClick={props.onStart}>{who ? `Start with ${who}` : "Start the job"}</Button>
          {goalsChanged && <span class="small muted">Add your goals to the plan first, so the list includes them.</span>}
          <span class="small muted">Hiring is free. This plan stays open until {when(p.expires_at)}.</span>
        </div>
      )}
    </Card>
  );
}
