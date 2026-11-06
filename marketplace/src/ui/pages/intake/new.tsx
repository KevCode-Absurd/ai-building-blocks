// /new: the buyer describes a job in their own words, for a chosen agent (?persona=) or for anyone.
// ?job=<job type id> picks the outcome; ?text= fills the box. Hiring is free: no prices here.
import { useState } from "preact/hooks";
import { Button, Card, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api, ApiError } from "../../lib/api.ts";
import { navigate } from "../../lib/router.tsx";
import { AgentCard, DailyLimitNotice, JobTypeList, turnaround, type AgentInfo, type JobSummary, type RequestView } from "./parts.tsx";

/** The parts of GET /api/catalogue/:id this page uses. */
interface JobDetail { id: string; title: string; summary: string; deliverable: string; turnaround_hours: number; sample_briefs: { text: string }[] }

const MIN_TEXT = 10;

/** Loads a thing that may not exist: 404 means "missing", other errors are left to the server to explain on submit. */
async function maybe<T>(load: () => Promise<T>): Promise<{ value: T | null; missing: boolean }> {
  try { return { value: await load(), missing: false }; }
  catch (err) { return { value: null, missing: err instanceof ApiError && err.status === 404 }; }
}

export function NewRequestPage(props: { query: URLSearchParams }) {
  const personaId = props.query.get("persona");
  const [jobId, setJobId] = useState<string | null>(props.query.get("job"));
  const [text, setText] = useState(props.query.get("text") ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limited, setLimited] = useState<string | null>(null);

  const agentState = useLoad(() => personaId
    ? maybe(() => api<{ agent: AgentInfo }>(`/api/agents/${encodeURIComponent(personaId)}`).then(r => r.agent))
    : Promise.resolve({ value: null, missing: false }), [personaId]);
  const jobState = useLoad(() => jobId
    ? maybe(() => api<{ job_type: JobDetail }>(`/api/catalogue/${encodeURIComponent(jobId)}`).then(r => r.job_type))
    : Promise.resolve({ value: null, missing: false }), [jobId]);
  const catalogue = useLoad(() => pickerOpen ? api<{ job_types: JobSummary[] }>("/api/catalogue").then(r => r.job_types) : Promise.resolve(null), [pickerOpen]);

  const agent = agentState.data?.value ?? null;
  const agentMissing = !!agentState.data?.missing;
  const job = jobState.data?.value ?? null;
  const jobMissing = !!jobState.data?.missing;
  const outcomes = (agent?.outcomes ?? []).filter(o => o.job_type_id);
  const sample = job?.sample_briefs?.[0]?.text;
  const placeholder = sample ? `For example: ${sample}` : "Say what you need, who it is for, and any facts, numbers or links we should use.";

  async function submit(e: Event) {
    e.preventDefault();
    if (text.trim().length < MIN_TEXT) { setError("Tell us a little more: what you need, who it is for, and any facts we should use."); return; }
    setBusy(true); setError(null); setLimited(null);
    try {
      const body: Record<string, string> = { text };
      if (jobId && !jobMissing) body.jobTypeId = jobId;
      if (personaId && !agentMissing) body.personaId = personaId;
      const res = await api<{ request: RequestView }>("/api/requests", { body });
      navigate(`/requests/${res.request.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === "daily_limit") setLimited(err.message);
      else setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setBusy(false);
    }
  }

  const title = agent ? `Hire ${agent.name}` : "Describe your job";
  const intro = agent
    ? `Tell ${agent.name} what you need. You answer at most three questions, check the plan, then start. Hiring is free.`
    : "Say what you need in your own words. We match it to the right agent and ask at most three questions. Then you check the plan and start. Hiring is free.";

  return (
    <Page title={title} intro={intro}>
      <div class="intake-narrow">
        {personaId && agentState.loading && !agentState.data && <Spinner label="Loading the agent..." />}
        {agent && (
          <Card class="intake-hire">
            <AgentCard agent={agent} />
            {outcomes.length > 0 && (
              <div class="intake-outcomes" role="group" aria-label={`What you want from ${agent.name}`}>
                <span class="field-label">What do you want from {agent.name}?</span>
                <div class="intake-options">
                  {outcomes.map(o => (
                    <button type="button" class={`intake-option${jobId === o.job_type_id ? " intake-option-on" : ""}`} aria-pressed={jobId === o.job_type_id} onClick={() => setJobId(o.job_type_id)}>
                      {o.title}
                    </button>
                  ))}
                  <button type="button" class={`intake-option${!jobId ? " intake-option-on" : ""}`} aria-pressed={!jobId} onClick={() => setJobId(null)}>Something else</button>
                </div>
              </div>
            )}
            {job && <JobLine job={job} />}
          </Card>
        )}
        {agentMissing && <Notice tone="warn">We could not find that agent. Describe the job below and we will match it to the right one.</Notice>}
        {jobMissing && <Notice tone="warn">We do not offer that job yet. Describe what you need and we will match it.</Notice>}

        <form class="intake-form" onSubmit={submit}>
          <label class="field" for="intake-text">
            <span class="field-label intake-big-label">{agent ? `Tell ${agent.name} what you need` : "What do you need done?"}</span>
            <textarea id="intake-text" class="input textarea intake-big" rows={8} maxLength={60000} value={text} placeholder={placeholder}
              onInput={e => setText((e.target as HTMLTextAreaElement).value)} />
            <span class="field-help">Say what it is for, who it is for, and any facts we should use. Paste notes or numbers if you have them.</span>
          </label>

          {!agent && (
            <details class="intake-picker" open={pickerOpen} onToggle={e => setPickerOpen((e.currentTarget as HTMLDetailsElement).open)}>
              <summary>{job ? `Job: ${job.title}` : "Or pick a job type (optional)"}</summary>
              <p class="muted small">Skip this if you are not sure. We will match your words to the right job.</p>
              {catalogue.error && <Notice tone="bad">{catalogue.error}</Notice>}
              {catalogue.loading && !catalogue.data && <Spinner />}
              {catalogue.data && <JobTypeList jobs={catalogue.data} value={jobId} onPick={id => setJobId(id === jobId ? null : id)} />}
            </details>
          )}
          {!agent && job && (
            <div class="intake-chosen">
              <JobLine job={job} />
              <Button kind="ghost" small onClick={() => setJobId(null)}>Clear</Button>
            </div>
          )}

          {error && <Notice tone="bad">{error}</Notice>}
          {limited && <DailyLimitNotice message={limited} />}
          <div class="intake-actions">
            <Button type="submit" busy={busy}>Continue</Button>
            <span class="muted small">Free to hire. You see the plan before any work starts.</span>
          </div>
        </form>
      </div>
    </Page>
  );
}

function JobLine(props: { job: JobDetail }) {
  const j = props.job;
  return (
    <p class="intake-jobline small">
      <strong>{j.title}</strong> · ready in about {turnaround(j.turnaround_hours)}
      <br /><span class="muted">You get: {j.deliverable}</span>
    </p>
  );
}
