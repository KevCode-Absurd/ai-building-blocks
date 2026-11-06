// /studio: the expert's agents, with status, version and test results, and "Build a new agent".
import { useState } from "preact/hooks";
import { Badge, Button, Card, Empty, Field, Input, Loaded, Notice, Page, Select, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { navigate } from "../../lib/router.tsx";
import type { AgentSummary } from "../../../modules/studio/service.ts";
import { GUIDE, STATUS } from "./guide.ts";

interface ListResponse { agents: AgentSummary[]; jobTypes: { id: string; title: string; summary: string; taken: boolean }[] }

function AgentCard(props: { a: AgentSummary }) {
  const a = props.a, s = STATUS[a.status];
  const step = a.current ? GUIDE[a.current] : null;
  return (
    <Card class="studio-agent-card">
      <div class="studio-card-top">
        <Badge tone={s.tone}>{s.label}</Badge>
        {a.liveVersion && <Badge tone="good">Live: version {a.liveVersion}</Badge>}
      </div>
      <h2 class="studio-card-title">{a.name}</h2>
      <p class="muted small">{a.jobTypeTitle}</p>
      <dl class="studio-facts">
        <dt>Version</dt>
        <dd>{a.latestVersion ? `${a.latestVersion.version} (${a.latestVersion.status === "published" ? "published" : "draft"})` : "Not built yet"}</dd>
        <dt>Test bench</dt>
        <dd>{a.tests.done ? `${a.tests.done} test draft${a.tests.done === 1 ? "" : "s"}, last run ${when(a.tests.lastRunAt)}` : "Not tested yet"}</dd>
        <dt>Progress</dt>
        <dd>{step ? `Step ${step.n} of 6: ${step.title}` : "All 6 steps done"}</dd>
      </dl>
      <div class="studio-progress" aria-hidden="true"><span style={{ width: `${(a.stepsDone / 6) * 100}%` }} /></div>
      <Button href={`/studio/agents/${a.id}`}>{a.stepsDone ? "Keep building" : "Start"}</Button>
    </Card>
  );
}

function NewAgent(props: { jobTypes: ListResponse["jobTypes"] }) {
  const open = props.jobTypes.filter(j => !j.taken);
  const [jobTypeId, setJobTypeId] = useState(open[0]?.id ?? "");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!props.jobTypes.length) {
    return <Card title="Build a new agent"><Notice tone="warn">Your expert profile has no jobs yet. Contact us and we will add the jobs you want to build agents for.</Notice></Card>;
  }
  if (!open.length) {
    return <Card title="Build a new agent"><p class="muted">You have an agent for every job you were approved for. To add another job, contact us.</p></Card>;
  }
  const chosen = open.find(j => j.id === jobTypeId);
  return (
    <Card title="Build a new agent" class="studio-new">
      <p class="muted small">Pick one of the jobs you were approved for. Each agent does one job.</p>
      <Field label="The job" id="studio-job"><Select id="studio-job" value={jobTypeId} onValue={setJobTypeId} options={open.map(j => ({ value: j.id, label: j.title }))} /></Field>
      {chosen && <p class="small">{chosen.summary}</p>}
      <Field label="Agent name (optional)" help="Leave it empty and we use your name and the job." id="studio-name">
        <Input id="studio-name" value={name} onValue={setName} maxLength={80} />
      </Field>
      {error && <Notice tone="bad">{error}</Notice>}
      <Button busy={busy} disabled={!jobTypeId} onClick={async () => {
        setBusy(true); setError(null);
        try {
          const res = await api<{ agent: AgentSummary }>("/api/studio/agents", { body: { jobTypeId, name: name.trim() || undefined } });
          navigate(`/studio/agents/${res.agent.id}`);
        } catch (e: any) { setError(e.message); } finally { setBusy(false); }
      }}>Start building</Button>
    </Card>
  );
}

export function StudioHome() {
  const state = useLoad(() => api<ListResponse>("/api/studio/agents"), []);
  return (
    <Page title="Your studio" intro="Turn how you work into an agent that buyers can hire. Most experts spend 10 to 15 hours on one agent, spread over a week or two. You can stop at any step and come back later.">
      <Loaded state={state}>
        {data => (
          <div class="stack">
            {data.agents.length
              ? <div class="grid">{data.agents.map(a => <AgentCard a={a} />)}</div>
              : <Empty title="No agents yet">Start with the job you know best. The studio walks you through 6 steps.</Empty>}
            <NewAgent jobTypes={data.jobTypes} />
            <Card title="How it works" class="studio-how">
              <ol class="studio-how-list">
                {Object.values(GUIDE).map(g => <li><strong>{g.title}.</strong> {g.todo} <span class="muted">{g.time}</span></li>)}
              </ol>
            </Card>
          </div>
        )}
      </Loaded>
    </Page>
  );
}
