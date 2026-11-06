// /ops: the beta gate numbers and the work queues.
import { useState } from "preact/hooks";
import { Badge, Button, Card, Empty, Input, Loaded, Notice, Page, Select, useLoad } from "../../components.tsx";
import { api, money } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { JOB_STATUSES } from "../../../core/types.ts";
import type { GateMetrics } from "../../../modules/ops/service.ts";
import type { JobSummary, Queue } from "../../../modules/ops/types.ts";
import { Bar, FlagBadges, OpsNav, STATUS_WORDS, StatusBadge, hoursText, pct, usd } from "./shared.tsx";

function Tile(props: { label: string; value: string; target: string; progress: number; met: boolean; note?: string; empty?: boolean }) {
  return (
    <div class="ops-tile">
      <span class="ops-tile-label">{props.label}</span>
      <span class={`ops-tile-value${props.empty ? " ops-tile-empty" : ""}`}>{props.value}</span>
      <Bar value={props.progress} met={props.met} label={`${props.label}: ${props.value}, target ${props.target}`} />
      <span class="ops-tile-target">Target {props.target} {props.met && <Badge tone="good">Met</Badge>}</span>
      {props.note && <span class="ops-meta">{props.note}</span>}
    </div>
  );
}

function GatePanel() {
  const state = useLoad(() => api<GateMetrics>("/api/ops/gate"), []);
  return (
    <Card title="Beta gate" class="ops-section">
      <p class="muted small">The week 6 targets. We move past the beta when all four are met.</p>
      <Loaded state={state}>
        {g => {
          const rate = (v: number | null, t: number) => (v === null ? 0 : v / t);
          return (
            <>
              <div class="ops-gate">
                <Tile label="Approved experts" value={String(g.experts.approved)} target={String(g.experts.target)}
                  progress={g.experts.approved / g.experts.target} met={g.experts.approved >= g.experts.target} />
                <Tile label="Accepted jobs" value={String(g.jobs.accepted)} target={String(g.jobs.target)}
                  progress={g.jobs.accepted / g.jobs.target} met={g.jobs.accepted >= g.jobs.target}
                  note={`${g.jobs.delivered} delivered so far. Payments are on hold, so we count accepted jobs.`} />
                <Tile label="Blind test wins" value={pct(g.blindWinRate.value)} empty={g.blindWinRate.value === null} target={pct(g.blindWinRate.target)}
                  progress={rate(g.blindWinRate.value, g.blindWinRate.target)} met={g.blindWinRate.value !== null && g.blindWinRate.value >= g.blindWinRate.target}
                  note={`Agent against plain AI, from ${g.blindWinRate.tests} finished tests.`} />
                <Tile label="Repeat buyers" value={pct(g.repeatBuyers.value)} empty={g.repeatBuyers.value === null} target={pct(g.repeatBuyers.target)}
                  progress={rate(g.repeatBuyers.value, g.repeatBuyers.target)} met={g.repeatBuyers.value !== null && g.repeatBuyers.value >= g.repeatBuyers.target}
                  note={`Ordered again within 30 days, out of ${g.repeatBuyers.buyers} buyers.`} />
              </div>
              <dl class="ops-secondary">
                <div><dt>Accepted with no changes</dt><dd>{pct(g.firstPassAcceptance)}</dd></div>
                <div><dt>Median time to first draft</dt><dd>{hoursText(g.medianHoursToFirstDraft)}</dd></div>
                <div><dt>Model cost per accepted job</dt><dd>{usd(g.modelCostPerJobUsd)}</dd></div>
              </dl>
            </>
          );
        }}
      </Loaded>
    </Card>
  );
}

export function JobItem(props: { job: JobSummary }) {
  const j = props.job;
  const meta = [
    j.buyer_email ?? j.buyer_id,
    j.persona_name,
    j.job_type_title ?? "No job type",
    j.price_cents !== null ? money(j.price_cents) : null,
    `${hoursText(j.age_hours)} old`,
    j.status !== "accepted" && j.status !== "cancelled" && j.waiting_hours >= 1 ? `no change for ${hoursText(j.waiting_hours)}` : null,
  ].filter(Boolean);
  return (
    <li class="ops-item">
      <div class="ops-item-head">
        <Link href={`/ops/jobs/${j.id}`} class="ops-item-title">{j.title}</Link>
        <StatusBadge status={j.status} />
        <FlagBadges flags={j.flags} />
      </div>
      <span class="ops-meta">{meta.join(" · ")}</span>
    </li>
  );
}

function JobList(props: { jobs: JobSummary[]; empty: string }) {
  if (!props.jobs.length) return <p class="muted">{props.empty}</p>;
  return <ul class="ops-list">{props.jobs.map(j => <JobItem job={j} />)}</ul>;
}

const QUEUE_CARDS: { queue: Queue; title: string; intro?: string; empty: string; limit?: number }[] = [
  { queue: "review", title: "Needs your OK", intro: "Drafts the buyer cannot see until you release them. Failed checks come first.", empty: "No drafts are waiting." },
  { queue: "problems", title: "Problems", intro: "Rejected, disputed or failed jobs. Each one needs a decision.", empty: "No problems right now." },
  { queue: "requests", title: "Open requests", intro: "Requests we could not match to a job type. Contact the buyer or set the job up by hand.", empty: "No open requests." },
  { queue: "active", title: "In progress", empty: "Nothing in progress." },
  { queue: "done", title: "Recently done", empty: "Nothing finished yet.", limit: 15 },
];

function Queues() {
  const state = useLoad(() => api<{ jobs: JobSummary[] }>("/api/ops/jobs"), []);
  return (
    <Loaded state={state}>
      {({ jobs }) => (
        <div class="stack ops-stack">
          {QUEUE_CARDS.map(c => {
            const list = jobs.filter(j => j.queue === c.queue);
            return (
              <Card title={<>{c.title} <Badge tone={c.queue === "review" && list.length ? "warn" : c.queue === "problems" && list.length ? "bad" : "neutral"}>{list.length}</Badge></>}>
                {c.intro && <p class="muted small">{c.intro}</p>}
                <JobList jobs={c.limit ? list.slice(0, c.limit) : list} empty={c.empty} />
              </Card>
            );
          })}
          <p><Button kind="ghost" small onClick={state.reload}>Refresh</Button></p>
        </div>
      )}
    </Loaded>
  );
}

function SearchResults(props: { q: string; status: string }) {
  const params = new URLSearchParams();
  if (props.q) params.set("q", props.q);
  if (props.status) params.set("status", props.status);
  const state = useLoad(() => api<{ jobs: JobSummary[] }>(`/api/ops/jobs?${params}`), [props.q, props.status]);
  return (
    <Card title="Search results">
      <Loaded state={state}>
        {({ jobs }) => jobs.length
          ? <><p class="muted small">{jobs.length === 200 ? "Showing the 200 newest matches." : `${jobs.length} found.`}</p><JobList jobs={jobs} empty="" /></>
          : <Empty title="No jobs match">Try an email, a job id or a word from the request.</Empty>}
      </Loaded>
    </Card>
  );
}

function OpsHome() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState<{ q: string; status: string } | null>(null);
  return (
    <Page title="Ops" intro="Every draft waits here for your OK before the buyer sees it." wide>
      <OpsNav />
      <GatePanel />
      <form class="ops-search" role="search" onSubmit={e => {
        e.preventDefault();
        const q = text.trim();
        setSearch(q || status ? { q, status } : null);
      }}>
        <Input value={text} onValue={setText} placeholder="Search by email, job id or words in the request" aria-label="Search jobs" />
        <Select value={status} onValue={setStatus} options={[{ value: "", label: "Any status" }, ...JOB_STATUSES.map(s => ({ value: s, label: STATUS_WORDS[s] }))]} />
        <Button type="submit" kind="secondary">Search</Button>
      </form>
      {search
        ? <>
          <p><Button kind="ghost" small onClick={() => { setSearch(null); setText(""); setStatus(""); }}>Back to the queues</Button></p>
          <SearchResults q={search.q} status={search.status} />
        </>
        : <Queues />}
      <Notice tone="info">Payments are on hold during the beta. Prices are recorded, but nothing is charged.</Notice>
    </Page>
  );
}

export { OpsHome };
