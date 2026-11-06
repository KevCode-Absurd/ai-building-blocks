// /expert: the expert's status page. Before approval it says what happens next; once approved it is the dashboard.
import { Badge, Button, Card, Empty, Notice, Page, Spinner, Table, useLoad, Loaded } from "../../components.tsx";
import { api, money, when } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import {
  AGENT_STATUS, AREA_LABELS, JOB_STATUS_LABELS, WhatNext, canApplyAgain, firstName, longDate, pct,
  type ExpertDashboard, type ExpertMe, type ExpertView,
} from "./shared.tsx";
import type { Area } from "../../../core/types.ts";

export function ExpertHome() {
  const state = useLoad(() => api<ExpertMe>("/api/experts/me"), []);
  if (state.error) return <Page title="Expert dashboard"><Notice tone="bad">{state.error}</Notice></Page>;
  if (!state.data) return <Page title="Expert dashboard"><Spinner /></Page>;
  const { expert } = state.data;
  if (!expert) return <Invitation me={state.data} />;
  if (expert.status === "applied") return <Waiting expert={expert} reviewTime={state.data.review_time} />;
  if (expert.status === "rejected") return <Rejected expert={expert} />;
  if (expert.status === "paused") return <Paused expert={expert} />;
  return <Dashboard expert={expert} />;
}

function Invitation(props: { me: ExpertMe }) {
  const f = props.me.founding;
  return (
    <Page title="Build an AI agent from how you work" intro="Apply as an expert. If we approve you, you turn your method into an agent that buyers can hire.">
      <div class="exp-points">
        <Card>
          <h3>Your method stays yours</h3>
          <p>You keep ownership of your method and your examples.</p>
        </Card>
        <Card>
          <h3>See how your agent does</h3>
          <p>Your dashboard shows each job your agent does, how buyers rated it, and how it did against plain AI.</p>
        </Card>
        <Card>
          <h3>A founding rate</h3>
          <p>Payments are on hold during the beta. When they go live, you earn 70% of the net amount from each job. The first {f.limit} approved experts get 75%.</p>
          <p class="muted small">{f.left > 0 ? `${f.left} of ${f.limit} founding spots are left.` : `All ${f.limit} founding spots are taken.`}</p>
        </Card>
      </div>
      <div class="row exp-actions"><Button href="/experts/apply">Apply as an expert</Button></div>
    </Page>
  );
}

function Waiting(props: { expert: ExpertView; reviewTime: string }) {
  const e = props.expert;
  return (
    <Page title="Your application is in" intro={`Thanks, ${firstName(e.display_name)}. We will email you within ${props.reviewTime}.`}>
      <p><Badge tone="info">Waiting for review</Badge> <span class="muted small">Sent {longDate(e.applied_at)}</span></p>
      <Card title="What happens next"><WhatNext reviewTime={props.reviewTime} /></Card>
      <Card title="What you sent">
        <dl class="exp-facts">
          <dt>Headline</dt><dd>{e.headline}</dd>
          <dt>Areas</dt><dd>{e.areas.map(a => AREA_LABELS[a as Area] ?? a).join(", ")}</dd>
          <dt>Jobs</dt><dd>{e.job_types.length} picked</dd>
          <dt>Claims</dt><dd>{e.application?.claims.length ?? 0} with links</dd>
        </dl>
      </Card>
    </Page>
  );
}

function Rejected(props: { expert: ExpertView }) {
  const e = props.expert;
  const now = canApplyAgain(e);
  return (
    <Page title="We could not approve your application" intro="Thank you for applying. Here is what our team said.">
      {e.note && <Notice tone="info" title="Note from our team">{e.note}</Notice>}
      {now ? (
        <>
          <p>You can apply again now. Your last answers will be filled in for you.</p>
          <Button href="/experts/apply">Apply again</Button>
        </>
      ) : (
        <p>You can apply again from <b>{longDate(e.can_reapply_at)}</b>. Use the time to add what the note asks for.</p>
      )}
    </Page>
  );
}

function Paused(props: { expert: ExpertView }) {
  return (
    <Page title="Your expert account is on hold" intro="Your agent page is hidden from buyers for now.">
      {props.expert.note && <Notice tone="warn" title="Note from our team">{props.expert.note}</Notice>}
      <p>Contact us through <a href="https://useaiblocks.com/support">Help & contact</a> if you have questions.</p>
    </Page>
  );
}

function Dashboard(props: { expert: ExpertView }) {
  const state = useLoad(() => api<ExpertDashboard>("/api/experts/me/dashboard"), []);
  const e = props.expert;
  return (
    <Page wide title="Expert dashboard" intro="How your agents are doing with buyers."
      actions={<Button href="/studio">Build an agent</Button>}>
      <p class="row exp-badges">
        {e.founding ? <Badge tone="good">Founding expert · 75% rate</Badge> : <Badge>Expert · 70% rate</Badge>}
        <span class="muted small">Payouts are not live yet.</span>
      </p>
      <Loaded state={state}>{d => <DashboardBody d={d} />}</Loaded>
    </Page>
  );
}

const OUTCOME: Record<string, { label?: string; tone: "good" | "bad" | "info" | "warn" }> = {
  accepted: { tone: "good" },
  auto_accepted: { label: "Accepted automatically", tone: "good" },
  rejected: { tone: "bad" },
  open: { tone: "info" },
  stopped: { tone: "warn" },
};

function DashboardBody(props: { d: ExpertDashboard }) {
  const { d } = props;
  const t = d.totals;
  const finished = t.accepted + t.rejected;
  const persona = d.personas[0];
  return (
    <div class="stack exp-dash">
      <div class="exp-stats">
        <Stat label="Live agents" value={String(t.live_agents)} sub={`of ${t.agents} ${t.agents === 1 ? "agent" : "agents"}`} />
        <Stat label="Jobs handled" value={String(t.jobs)} sub={`${t.revision_requests} ${t.revision_requests === 1 ? "change" : "changes"} asked for`} />
        <Stat label="Accepted" value={pct(t.acceptance_rate)} sub={finished ? `${t.accepted} of ${finished} finished jobs` : "No finished jobs yet"} />
        <Stat label="Average rating" value={t.avg_rating === null ? "–" : `${t.avg_rating} / 5`} sub={`${t.ratings} ${t.ratings === 1 ? "rating" : "ratings"}`} />
        <Stat label="Estimated work value" value={money(d.work_value.estimated_share_cents)} sub="An estimate. Not paid yet." />
      </div>

      {persona && (
        <Notice tone={persona.status === "live" ? "good" : "info"}>
          {persona.status === "live"
            ? <>Buyers can find you as <Link href={`/agents/${persona.id}`}>{persona.name}, {persona.title}</Link>.</>
            : <>Your agent page ({persona.name}, {persona.title}) is hidden until one of your agents is live.</>}
        </Notice>
      )}

      <Card title="Your agents" actions={<Button small kind="secondary" href="/studio">Open the studio</Button>}>
        {d.agents.length === 0 ? (
          <Empty title="No agents yet" action={<Button href="/studio">Build an agent</Button>}>
            Build your first agent in the studio. Once it is live, buyers can hire it and its results show here.
          </Empty>
        ) : (
          <>
            <Table
              head={["Agent", "Job", "Status", "Versions", "Jobs", "Accepted", "Rating", "Blind tests"]}
              rows={d.agents.map(a => {
                const s = AGENT_STATUS[a.status] ?? { label: a.status, tone: "neutral" as const };
                return [
                  <b>{a.name}</b>,
                  a.job_type_title,
                  <Badge tone={s.tone}>{s.label}</Badge>,
                  a.versions.length ? a.versions.map(v => `v${v.version}${v.version === a.live_version ? " live" : v.status === "draft" ? " draft" : ""}`).join(", ") : "–",
                  String(a.stats.jobs),
                  a.stats.acceptance_rate === null ? "–" : `${pct(a.stats.acceptance_rate)} (${a.stats.accepted})`,
                  a.stats.avg_rating === null ? "–" : `${a.stats.avg_rating} / 5`,
                  a.win_rate ? `${pct(a.win_rate.rate)} won · ${a.win_rate.tests} ${a.win_rate.tests === 1 ? "test" : "tests"}` : "No tests yet",
                ];
              })}
            />
            <p class="muted small exp-help">
              In a blind test, reviewers compare your agent's draft with plain AI on the same brief, without knowing which is which.
              {!d.win_rates_available && " Blind test results are not available right now. Check back later."}
            </p>
          </>
        )}
      </Card>

      <Card title="Jobs your agents handled">
        <Table
          empty="No jobs yet. Jobs show here once buyers hire one of your live agents."
          head={["Job", "Agent", "Status", "Rating", "Price", "Started"]}
          rows={d.jobs.map(j => {
            const o = OUTCOME[j.outcome] ?? OUTCOME.open!;
            return [
              <span>{j.title}<span class="muted small exp-sub">{j.job_type_title}</span></span>,
              <span>{j.agent_name}{j.agent_version ? <span class="muted small"> v{j.agent_version}</span> : null}</span>,
              <Badge tone={o.tone}>{o.label ?? JOB_STATUS_LABELS[j.status] ?? j.status}</Badge>,
              j.rating === null ? "–" : `${j.rating} / 5`,
              j.price_cents === null ? "–" : money(j.price_cents),
              when(j.created_at),
            ];
          })}
        />
      </Card>

      <Card title="What buyers asked to change">
        {d.feedback.length === 0 ? <p class="muted">Nothing yet. When buyers ask for changes, reject a draft or edit it, you see it here.</p> : (
          <ul class="exp-feedback">
            {d.feedback.map(f => <FeedbackItem f={f} />)}
          </ul>
        )}
      </Card>

      <Card title="Estimated work value">
        <p class="exp-big">{money(d.work_value.estimated_share_cents)}</p>
        <p>
          {d.work_value.accepted_jobs} accepted {d.work_value.accepted_jobs === 1 ? "job" : "jobs"}, worth {money(d.work_value.accepted_value_cents)} in job prices.
          At your {pct(d.work_value.rate)} rate, your share would be about {money(d.work_value.estimated_share_cents)}.
        </p>
        <Notice tone="warn" title="Not paid yet">{d.work_value.note}</Notice>
      </Card>
    </div>
  );
}

function Stat(props: { label: string; value: string; sub?: string }) {
  return (
    <div class="exp-stat">
      <span class="exp-stat-label">{props.label}</span>
      <span class="exp-stat-value">{props.value}</span>
      {props.sub && <span class="muted small">{props.sub}</span>}
    </div>
  );
}

const FEEDBACK_KIND = {
  revise: { label: "Asked for changes", tone: "warn" },
  reject: { label: "Rejected", tone: "bad" },
  accept: { label: "Accepted", tone: "good" },
} as const;

function FeedbackItem(props: { f: ExpertDashboard["feedback"][number] }) {
  const f = props.f;
  const k = FEEDBACK_KIND[f.kind];
  return (
    <li class="exp-fb">
      <div class="row">
        <Badge tone={k.tone}>{f.kind === "accept" && f.has_edits ? "Accepted with edits" : k.label}</Badge>
        <b>{f.job_title}</b>
        <span class="muted small">{when(f.at)}</span>
        {f.rating !== null && <span class="muted small">Rated {f.rating} / 5</span>}
      </div>
      {f.reasons.trim() && <p class="exp-quote">{f.reasons}</p>}
      {f.failed_checks.length > 0 && (
        <div>
          <p class="small muted">Checks the buyer said it missed:</p>
          <ul class="exp-checks">{f.failed_checks.map(c => <li>{c.text}</li>)}</ul>
        </div>
      )}
      {f.has_edits && (f.edits_shared
        ? <details class="exp-edits-wrap"><summary>See the buyer's edits</summary><Edits value={f.edits} /></details>
        : <p class="small muted">The buyer edited this draft. Their edits are private, so we cannot show them.</p>)}
    </li>
  );
}

function Edits(props: { value: unknown }) {
  const v = props.value;
  if (typeof v === "string") return <pre class="exp-edits">{v}</pre>;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.diff === "string") {
      return (
        <>
          {typeof o.reason === "string" && o.reason && <p class="small">Why: {o.reason}</p>}
          <pre class="exp-edits">{o.diff}</pre>
        </>
      );
    }
  }
  return <pre class="exp-edits">{JSON.stringify(v, null, 2)}</pre>;
}
