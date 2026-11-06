// /ops/jobs/:id: the full record of one job, with the actions ops can take on it.
import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { Badge, Button, Card, Field, Loaded, Markdown, Notice, Page, Select, Table, Tabs, TextArea, useLoad } from "../../components.tsx";
import { api, money, when } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import type { DraftView, JobRecord, RunView, ScoreView } from "../../../modules/ops/types.ts";
import { Bar, FlagBadges, OpsNav, STATUS_WORDS, StatusBadge, errorText, usd, words } from "./shared.tsx";

type Action = "release" | "rerun" | "assign" | "cancel" | "resolve";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "drafts", label: "Drafts and checks" },
  { id: "runs", label: "Runs and cost" },
  { id: "timeline", label: "Timeline" },
  { id: "notes", label: "Notes" },
];

function Facts(props: { items: [string, ComponentChildren][] }) {
  return <dl class="ops-facts">{props.items.filter(([, v]) => v !== null && v !== undefined && v !== "").map(([k, v]) => <div><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

function valueText(v: unknown): string {
  if (v === null || v === undefined || v === "") return "Not given";
  if (Array.isArray(v)) return v.map(valueText).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

// ---------- Overview ----------

function Overview(props: { r: JobRecord }) {
  const { job, brief, rubric, agent } = props.r;
  const spec = Object.entries(brief?.spec ?? {});
  const answers = Object.entries(brief?.answers ?? {});
  return (
    <div class="stack ops-stack">
      <Card title="The job">
        <Facts items={[
          ["Status", <StatusBadge status={job.status} />],
          ["Buyer", job.buyer_email ?? job.buyer_id],
          ["Job type", job.job_type_title ?? "No job type yet"],
          ["Agent", agent ? `${agent.persona_name ?? agent.name}, version ${job.agent_version ?? agent.live_version ?? "?"} (${words(agent.status)})` : job.agent_id ?? "Not picked yet"],
          ["Price", job.price_cents !== null ? `${money(job.price_cents)} (not charged)` : "Not quoted yet"],
          ["Revisions used", `${job.revisions_used} of ${job.revisions_allowed}`],
          ["Ordered from", words(job.source)],
          ["Created", when(job.created_at)],
          ["Due", when(job.due_at)],
          ["Delivered", when(job.delivered_at)],
          ["Accepts itself on", when(job.auto_accept_at)],
          ["Accepted", when(job.accepted_at)],
          ["Job id", <code>{job.id}</code>],
        ]} />
      </Card>
      <Card title="The brief">
        {brief ? (
          <>
            <p class="field-label">The buyer's words</p>
            <div class="ops-request">{brief.request_text}</div>
            {spec.length > 0 && <>
              <h3 class="ops-sub">What we took from it</h3>
              <Table head={["Field", "Value"]} rows={spec.map(([k, v]) => [words(k), valueText(v)])} />
            </>}
            {answers.length > 0 && <>
              <h3 class="ops-sub">Answers to our questions</h3>
              <Table head={["Question", "Answer"]} rows={answers.map(([k, v]) => [words(k), valueText(v)])} />
            </>}
          </>
        ) : <p class="muted">No brief yet.</p>}
      </Card>
      <Card title="What good looks like" actions={rubric?.frozen_at ? <Badge>Locked {when(rubric.frozen_at)}</Badge> : rubric ? <Badge tone="warn">Not locked yet</Badge> : null}>
        {rubric?.criteria.length ? (
          <ol class="ops-rubric">
            {rubric.criteria.map(c => (
              <li>
                <strong>{c.text}</strong> {c.critical && <Badge tone="bad">Must pass</Badge>} <Badge>Weight {c.weight}</Badge> {c.source === "buyer" && <Badge tone="info">From the buyer</Badge>}
                <div class="ops-meta">Pass when: {c.pass_rule}</div>
              </li>
            ))}
          </ol>
        ) : <p class="muted">No checklist yet. It is written with the quote.</p>}
      </Card>
    </div>
  );
}

// ---------- Drafts and checks ----------

const JUDGE_WORDS: Record<ScoreView["judge"], string> = { rubric: "Checklist", policy: "Policy check", baseline: "Against plain AI", human: "Human review" };

function ScoreBlock(props: { score: ScoreView; rubric: JobRecord["rubric"] }) {
  const s = props.score;
  const res = s.result ?? {};
  const criteria: any[] = Array.isArray(res.criteria) ? res.criteria : [];
  const flags: any[] = Array.isArray(res.flags) ? res.flags : [];
  const label = (id: string) => props.rubric?.criteria.find(c => c.id === id)?.text ?? words(id);
  return (
    <div class="ops-score">
      <div class="ops-item-head">
        <strong>{JUDGE_WORDS[s.judge] ?? s.judge}</strong>
        <Badge tone={s.passed ? "good" : "bad"}>{s.passed ? "Passed" : "Failed"}</Badge>
        {s.score !== null && <Badge>Score {Math.round(s.score * 100)}%</Badge>}
        <span class="ops-meta">{[s.judge_model, s.cost_usd ? usd(s.cost_usd) : null, when(s.created_at)].filter(Boolean).join(" · ")}</span>
      </div>
      {criteria.length > 0 && (
        <Table head={["Item", "Result", "Evidence", "Note"]} rows={criteria.map(c => [
          label(String(c.id)), <Badge tone={c.pass ? "good" : "bad"}>{c.pass ? "Pass" : "Fail"}</Badge>, c.evidence ? <q>{String(c.evidence)}</q> : "", String(c.note ?? ""),
        ])} />
      )}
      {flags.length > 0 && (
        <ul class="ops-flags">{flags.map(f => <li><Badge tone="bad">{String(f.code ?? "flag")}</Badge> {String(f.message ?? "")} {f.excerpt && <q>{String(f.excerpt)}</q>}</li>)}</ul>
      )}
      {s.judge === "policy" && !flags.length && s.passed && <p class="ops-meta">No policy problems found.</p>}
      {s.judge === "baseline" && res.winner && (
        <p class="ops-meta">Winner: {res.winner === "agent" ? "the agent" : res.winner === "baseline" ? "plain AI" : "a tie"}. {String(res.reasons ?? "")}</p>
      )}
    </div>
  );
}

function Drafts(props: { r: JobRecord; onRelease: (d: DraftView) => void }) {
  const { drafts, actions, rubric } = props.r;
  if (!drafts.length) return <p class="muted">No drafts yet. The first one appears when the agent finishes its run.</p>;
  return (
    <div class="stack ops-stack">
      {drafts.map((d, i) => (
        <Card title={`Draft ${d.version}`} actions={
          <div class="row">
            {d.released_at ? <Badge tone="info">Buyer can see it ({when(d.released_at)})</Badge> : <Badge>Buyer cannot see it</Badge>}
            {d.checks_failed && <Badge tone="bad">Checks failed</Badge>}
            {actions.release && !d.released_at && <Button small onClick={() => props.onRelease(d)}>Release this draft</Button>}
          </div>
        }>
          <p class="ops-meta">Written {when(d.created_at)} · run <code>{d.run_id}</code></p>
          {d.scores.length ? d.scores.map(s => <ScoreBlock score={s} rubric={rubric} />) : <p class="muted">No checks on this draft yet.</p>}
          <details class="ops-draft-body" open={i === 0}>
            <summary>Read the draft</summary>
            {d.format === "markdown" ? <Markdown text={d.content} /> : <pre class="ops-pre">{d.content}</pre>}
          </details>
        </Card>
      ))}
    </div>
  );
}

// ---------- Runs and cost ----------

function RunCard(props: { run: RunView }) {
  const r = props.run;
  const feedback = typeof r.input?.feedback === "string" && r.input.feedback ? r.input.feedback : null;
  return (
    <Card title={`${words(r.kind)} run, try ${r.attempt}`} actions={<Badge tone={r.status === "succeeded" ? "good" : r.status === "failed" ? "bad" : "neutral"}>{words(r.status)}</Badge>}>
      <Facts items={[
        ["Agent", r.agent_id ? `${r.agent_id} v${r.agent_version ?? "?"}` : "Plain AI"],
        ["Cost", `${usd(r.cost_usd)} over ${r.model_calls} model calls`],
        ["Tokens", `${r.input_tokens.toLocaleString()} in, ${r.output_tokens.toLocaleString()} out`],
        ["Started", when(r.started_at ?? r.created_at)],
        ["Finished", when(r.finished_at)],
      ]} />
      {feedback && <><p class="field-label">Notes the agent got</p><div class="ops-request">{feedback}</div></>}
      {r.error && <Notice tone="bad" title="Error">{r.error}</Notice>}
      {r.steps.length > 0 && (
        <Table head={["Step", "Status", "Model", "Cost", "Output"]} rows={r.steps.map(s => [
          `${s.seq}. ${words(s.step_id)}`,
          <Badge tone={s.status === "succeeded" ? "good" : s.status === "failed" ? "bad" : "neutral"}>{words(s.status)}</Badge>,
          [s.provider, s.model].filter(Boolean).join(" "),
          usd(s.cost_usd),
          s.error ? <span class="field-error">{s.error}</span> : s.output ? <details class="ops-show"><summary>Show</summary><pre class="ops-pre">{s.output}</pre></details> : "",
        ])} />
      )}
    </Card>
  );
}

function Runs(props: { r: JobRecord }) {
  const { cost, runs } = props.r;
  return (
    <div class="stack ops-stack">
      <Card title="Model cost">
        <p><strong>{usd(cost.total_usd)}</strong> of the {usd(cost.cap_usd)} limit per job, over {cost.calls} model calls.</p>
        <Bar value={cost.cap_usd ? cost.total_usd / cost.cap_usd : 0} label={`${usd(cost.total_usd)} of ${usd(cost.cap_usd)}`} />
        {cost.by_purpose.length > 0 && <Table head={["Used for", "Cost", "Calls"]} rows={cost.by_purpose.map(p => [p.purpose, usd(p.usd), String(p.calls)])} />}
      </Card>
      {runs.length ? [...runs].reverse().map(r => <RunCard run={r} />) : <p class="muted">No runs yet.</p>}
    </div>
  );
}

// ---------- Timeline ----------

const EVENT_WORDS: Record<string, string> = {
  "ops.draft_released": "The team released a draft",
  "ops.rerun_started": "The team started a rerun",
  "ops.agent_assigned": "The team changed the agent",
  "ops.note_added": "The team added a note",
  "ops.resolved": "The team made a decision",
  "draft.released": "The buyer can see the draft",
};

function eventLabel(type: string): string {
  if (EVENT_WORDS[type]) return EVENT_WORDS[type];
  const m = /^job\.(\w+)$/.exec(type);
  if (m && m[1] in STATUS_WORDS) return `Now: ${STATUS_WORDS[m[1] as keyof typeof STATUS_WORDS]}`;
  return words(type.replace(".", ": "));
}

function eventDetails(data: Record<string, unknown>): string {
  const keep = ["from", "reason", "feedback", "note", "outcome", "kind", "version", "agent_id", "draft_id", "run_id"];
  return Object.entries(data).filter(([k, v]) => keep.includes(k) && v !== null && v !== "" && typeof v !== "object")
    .map(([k, v]) => `${words(k)}: ${k === "from" && typeof v === "string" && v in STATUS_WORDS ? STATUS_WORDS[v as keyof typeof STATUS_WORDS] : String(v)}`).join(" · ");
}

function Timeline(props: { r: JobRecord }) {
  const { events, notifications, decisions } = props.r;
  return (
    <div class="stack ops-stack">
      <Card title="What happened">
        <Table empty="Nothing recorded yet." head={["When", "What", "Who", "Details"]} rows={[...events].reverse().map(e => [
          when(e.at), eventLabel(e.type), <span><Badge>{e.actor_kind}</Badge>{e.actor !== e.actor_kind && <> <span class="ops-meta">{e.actor}</span></>}</span>, <span class="ops-meta">{eventDetails(e.data)}</span>,
        ])} />
      </Card>
      <Card title="Buyer decisions">
        <Table empty="The buyer has not decided on a draft yet." head={["When", "Decision", "Reasons", "Rating", "Their edits"]} rows={decisions.map(d => [
          when(d.created_at), words(d.kind),
          <>{d.reasons}{d.failed_criteria.length > 0 && <div class="ops-meta">Failed items: {d.failed_criteria.map(words).join(", ")}</div>}</>,
          d.rating ? `${d.rating} of 5` : "",
          d.edits ? <details class="ops-show"><summary>Show</summary><pre class="ops-pre">{typeof d.edits === "string" ? d.edits : JSON.stringify(d.edits, null, 2)}</pre></details> : "",
        ])} />
      </Card>
      <Card title="Messages sent">
        <Table empty="No messages about this job yet." head={["When", "To", "Subject", "Status"]} rows={notifications.map(n => [
          when(n.created_at), n.to_email ?? n.user_id ?? "", <>{n.subject}<div class="ops-meta">{n.body_text}</div></>,
          <Badge tone={n.status === "sent" ? "good" : n.status === "failed" ? "bad" : "neutral"}>{n.status === "skipped" ? "In app only" : n.status}</Badge>,
        ])} />
      </Card>
    </div>
  );
}

// ---------- Notes ----------

function Notes(props: { r: JobRecord; reload: () => void }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div class="stack ops-stack">
      <Card title="Add a note">
        <form onSubmit={async e => {
          e.preventDefault(); setBusy(true); setError(null);
          try { await api(`/api/ops/jobs/${props.r.job.id}/note`, { body: { body } }); setBody(""); props.reload(); }
          catch (err) { setError(errorText(err)); } finally { setBusy(false); }
        }}>
          <Field label="Note" help="Only the AI Blocks team sees notes." error={error ?? undefined} id="ops-note">
            <TextArea id="ops-note" value={body} onValue={setBody} rows={3} maxLength={4000} />
          </Field>
          <Button type="submit" busy={busy} disabled={!body.trim()}>Save note</Button>
        </form>
      </Card>
      {props.r.notes.length ? props.r.notes.map(n => (
        <Card><p class="ops-note">{n.body}</p><p class="ops-meta">{n.created_by_email ?? n.created_by} · {when(n.created_at)}</p></Card>
      )) : <p class="muted">No notes yet.</p>}
    </div>
  );
}

// ---------- Actions ----------

function ActionPanel(props: { r: JobRecord; action: Action; draft: DraftView | null; onDone: (message: string) => void; onClose: () => void }) {
  const { r, action } = props;
  const unreleased = r.drafts.filter(d => !d.released_at);
  const [draftId, setDraftId] = useState(props.draft?.id ?? unreleased[0]?.id ?? "");
  const [text, setText] = useState("");
  const firstAgent = r.agent_options.find(o => o.id !== r.job.agent_id && o.versions.length) ?? r.agent_options[0];
  const [agentId, setAgentId] = useState(firstAgent?.id ?? "");
  const agent = r.agent_options.find(o => o.id === agentId);
  const [version, setVersion] = useState(String(agent?.live_version ?? agent?.versions[0] ?? ""));
  const [outcome, setOutcome] = useState<"accept" | "rerun" | "cancel">("accept");
  const [tellBuyer, setTellBuyer] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (path: string, body: unknown, message: string) => {
    setBusy(true); setError(null);
    try { await api(`/api/ops/jobs/${r.job.id}/${path}`, { body }); props.onDone(message); }
    catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  };
  const draft = r.drafts.find(d => d.id === draftId);
  const back = <Button kind="ghost" onClick={props.onClose} disabled={busy}>Back</Button>;
  const tell = (
    <label class="ops-check"><input type="checkbox" checked={tellBuyer} onChange={e => setTellBuyer((e.target as HTMLInputElement).checked)} /> Email the buyer about it</label>
  );

  let content: ComponentChildren;
  if (action === "release") {
    content = unreleased.length ? (
      <>
        {unreleased.length > 1 && (
          <Field label="Draft to release" id="ops-draft">
            <Select id="ops-draft" value={draftId} onValue={setDraftId} options={unreleased.map(d => ({ value: d.id, label: `Draft ${d.version}${d.checks_failed ? " (checks failed)" : ""}` }))} />
          </Field>
        )}
        {draft?.checks_failed && <Notice tone="warn">This draft failed its checks. Read the results under Drafts and checks before you release it.</Notice>}
        <p>The buyer gets an email and can see draft {draft?.version} straight away. You cannot take it back.</p>
        <div class="row"><Button busy={busy} disabled={!draftId} onClick={() => run("release", { draft_id: draftId }, `Draft ${draft?.version} is with the buyer now.`)}>Release to buyer</Button>{back}</div>
      </>
    ) : <p class="muted">Every draft is already released.</p>;
  } else if (action === "rerun") {
    content = (
      <>
        <Field label="Notes for the agent" help="Say what to change. The agent reads these notes on the next run." id="ops-feedback">
          <TextArea id="ops-feedback" value={text} onValue={setText} rows={4} maxLength={4000} />
        </Field>
        <div class="row"><Button busy={busy} disabled={!text.trim()} onClick={() => run("rerun", { feedback: text }, "The rerun has started. The new draft will appear here.")}>Start rerun</Button>{back}</div>
      </>
    );
  } else if (action === "assign") {
    content = r.agent_options.length ? (
      <>
        <Field label="Agent" id="ops-agent">
          <Select id="ops-agent" value={agentId} onValue={v => { setAgentId(v); const a = r.agent_options.find(o => o.id === v); setVersion(String(a?.live_version ?? a?.versions[0] ?? "")); }}
            options={r.agent_options.map(o => ({ value: o.id, label: `${o.persona_name ?? o.name} (${words(o.status)}${o.id === r.job.agent_id ? ", current" : ""})` }))} />
        </Field>
        <Field label="Version" id="ops-version" help={agent && !agent.versions.length ? "This agent has no published version yet." : undefined}>
          <Select id="ops-version" value={version} onValue={setVersion} options={(agent?.versions ?? []).map(v => ({ value: String(v), label: `Version ${v}${v === agent?.live_version ? " (live)" : ""}` }))} />
        </Field>
        <p class="muted small">The next run uses this agent. Drafts already written stay as they are.</p>
        <div class="row"><Button busy={busy} disabled={!agentId || !version} onClick={() => run("assign", { agent_id: agentId, version: Number(version) }, "Agent changed. The next run will use it.")}>Assign agent</Button>{back}</div>
      </>
    ) : <p class="muted">No agents do this job type yet. Seed agents on the Agents page first.</p>;
  } else if (action === "cancel") {
    content = (
      <>
        <Field label="Why are you cancelling?" help="Kept in the record. The buyer does not see it." id="ops-reason">
          <TextArea id="ops-reason" value={text} onValue={setText} rows={3} maxLength={2000} />
        </Field>
        {tell}
        <Notice tone="warn">This cannot be undone. The job stops and will not run again.</Notice>
        <div class="row"><Button kind="danger" busy={busy} disabled={!text.trim()} onClick={() => run("cancel", { reason: text, notify_buyer: tellBuyer }, "The job is cancelled.")}>Cancel this job</Button>{back}</div>
      </>
    );
  } else {
    content = (
      <>
        <Field label="Your decision" id="ops-outcome">
          <Select id="ops-outcome" value={outcome} onValue={v => setOutcome(v as typeof outcome)} options={[
            { value: "accept", label: "Accept the work as it is" },
            { value: "rerun", label: "Rerun with notes" },
            { value: "cancel", label: "Cancel the job" },
          ]} />
        </Field>
        <Field label={outcome === "rerun" ? "Notes for the agent" : "Note about your decision"} id="ops-resolve-note"
          help={outcome === "rerun" ? "The agent reads this note on the rerun. It is also saved in Notes." : "Saved in Notes. The buyer does not see it."}>
          <TextArea id="ops-resolve-note" value={text} onValue={setText} rows={3} maxLength={4000} />
        </Field>
        {outcome !== "rerun" && tell}
        {outcome !== "rerun" && <Notice tone="warn">This cannot be undone.</Notice>}
        <div class="row">
          <Button kind={outcome === "cancel" ? "danger" : "primary"} busy={busy} disabled={!text.trim()}
            onClick={() => run("resolve", { outcome, note: text, notify_buyer: tellBuyer }, outcome === "accept" ? "The job is accepted." : outcome === "rerun" ? "The rerun has started." : "The job is cancelled.")}>
            Save decision
          </Button>
          {back}
        </div>
      </>
    );
  }
  const titles: Record<Action, string> = { release: "Release a draft", rerun: "Rerun with notes", assign: "Assign an agent", cancel: "Cancel this job", resolve: "Decide this job" };
  return (
    <Card title={titles[action]} class="ops-panel">
      {error && <Notice tone="bad">{error}</Notice>}
      {content}
    </Card>
  );
}

function ActionBar(props: { r: JobRecord; open: (a: Action) => void }) {
  const a = props.r.actions;
  if (!a.release && !a.rerun && !a.assign && !a.cancel && !a.resolve) return <p class="muted small">This job is closed. There is nothing left to do.</p>;
  return (
    <div class="ops-actions" role="toolbar" aria-label="Job actions">
      {a.release && <Button onClick={() => props.open("release")}>Release this draft</Button>}
      {a.resolve && <Button onClick={() => props.open("resolve")}>Resolve</Button>}
      {a.rerun && <Button kind="secondary" onClick={() => props.open("rerun")}>Rerun with notes</Button>}
      {a.assign && <Button kind="secondary" onClick={() => props.open("assign")}>Assign agent</Button>}
      {a.cancel && <Button kind="danger" onClick={() => props.open("cancel")}>Cancel</Button>}
    </div>
  );
}

function OpsJob(props: { params: Record<string, string>; query: URLSearchParams }) {
  const id = props.params.id;
  const state = useLoad(() => api<JobRecord>(`/api/ops/jobs/${encodeURIComponent(id)}`), [id]);
  const [tab, setTab] = useState(TABS.some(t => t.id === props.query.get("tab")) ? props.query.get("tab")! : "overview");
  const [action, setAction] = useState<Action | null>(null);
  const [draft, setDraft] = useState<DraftView | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const title = state.data?.job.title ?? "Job";
  return (
    <Page title={title} wide intro={state.data ? <>{state.data.job.job_type_title ?? "No job type yet"} for {state.data.job.buyer_email ?? state.data.job.buyer_id}</> : undefined}>
      <OpsNav />
      <p><Link href="/ops" class="ops-back">Back to the queues</Link></p>
      <Loaded state={state}>
        {r => (
          <>
            <div class="row ops-head-badges"><StatusBadge status={r.job.status} /><FlagBadges flags={r.job.flags} />{r.job.persona_name && <Badge>{r.job.persona_name}</Badge>}</div>
            {done && <Notice tone="good">{done}</Notice>}
            <ActionBar r={r} open={a => { setAction(a); setDraft(null); setDone(null); }} />
            {action && <ActionPanel key={`${action}-${draft?.id ?? ""}`} r={r} action={action} draft={draft}
              onClose={() => setAction(null)}
              onDone={message => { setAction(null); setDone(message); state.reload(); }} />}
            <Tabs tabs={TABS} value={tab} onValue={setTab} />
            {tab === "overview" && <Overview r={r} />}
            {tab === "drafts" && <Drafts r={r} onRelease={d => { setDraft(d); setAction("release"); setDone(null); window.scrollTo(0, 0); }} />}
            {tab === "runs" && <Runs r={r} />}
            {tab === "timeline" && <Timeline r={r} />}
            {tab === "notes" && <Notes r={r} reload={state.reload} />}
          </>
        )}
      </Loaded>
    </Page>
  );
}

export { OpsJob };
