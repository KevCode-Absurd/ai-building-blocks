// /ops/experts: expert applications from the experts module, with Approve / Pause / Reject.
import { useState } from "preact/hooks";
import { Badge, Button, Card, Empty, Field, Notice, Page, Spinner, Tabs, TextArea, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { ExternalLink, NotReady, OpsNav, errorText, notReady, words } from "./shared.tsx";

/** What the experts module's GET /api/experts returns for each expert. Read loosely: that module owns the shape. */
interface ExpertItem {
  id: string;
  status: "applied" | "approved" | "rejected" | "paused";
  display_name?: string;
  headline?: string;
  email?: string | null;
  areas?: string[];
  job_types?: string[];
  application?: { experience?: string; claims?: { text: string; evidence_url: string }[]; sample_links?: string[]; country?: string } | null;
  founding?: boolean;
  invited?: boolean;
  note?: string;
  reviewed_at?: string | null;
  applied_at?: string;
  created_at?: string;
  persona?: { id: string; name: string; status: string } | null;
  agents?: { total: number; live: number };
}

interface ExpertList { experts: ExpertItem[]; counts?: Record<string, number>; founding?: { limit: number; taken: number; left: number } }

const STATUS_TABS = ["applied", "approved", "paused", "rejected", "all"] as const;
const TAB_WORDS: Record<(typeof STATUS_TABS)[number], string> = { applied: "Waiting", approved: "Approved", paused: "Paused", rejected: "Rejected", all: "All" };
const TONE = { applied: "warn", approved: "good", paused: "neutral", rejected: "bad" } as const;

function ExpertCard(props: { expert: ExpertItem; onDone: (message: string) => void }) {
  const e = props.expert;
  const app = e.application ?? {};
  const [note, setNote] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const name = e.display_name || e.email || e.id;
  const decide = async (decision: "approve" | "reject" | "pause") => {
    setBusy(decision); setError(null);
    try {
      await api(`/api/experts/${encodeURIComponent(e.id)}/review`, { body: { decision, note } });
      props.onDone(decision === "approve" ? `${name} is approved.` : decision === "pause" ? `${name} is paused.` : `${name} is rejected.`);
    } catch (err) {
      setError(notReady(err) ? "Reviewing experts is not ready yet. Try again after the next update." : errorText(err));
    } finally { setBusy(null); }
  };
  return (
    <Card title={name} actions={<div class="row"><Badge tone={TONE[e.status] ?? "neutral"}>{words(e.status)}</Badge>{e.invited && <Badge tone="info">Invited</Badge>}{e.founding && <Badge tone="info">Founding expert</Badge>}</div>}>
      {e.headline && <p>{e.headline}</p>}
      <dl class="ops-facts">
        {e.email && <div><dt>Email</dt><dd>{e.email}</dd></div>}
        {app.country && <div><dt>Country</dt><dd>{app.country}</dd></div>}
        {e.areas?.length ? <div><dt>Areas</dt><dd>{e.areas.map(words).join(", ")}</dd></div> : null}
        {e.job_types?.length ? <div><dt>Jobs they want to build agents for</dt><dd>{e.job_types.map(words).join(", ")}</dd></div> : null}
        <div><dt>Applied</dt><dd>{when(e.applied_at ?? e.created_at)}</dd></div>
        {e.reviewed_at && <div><dt>Last decision</dt><dd>{when(e.reviewed_at)}</dd></div>}
        {e.agents && <div><dt>Agents</dt><dd>{e.agents.live} live of {e.agents.total}</dd></div>}
        {e.persona && <div><dt>Profile</dt><dd>{e.persona.name} ({words(e.persona.status)})</dd></div>}
      </dl>
      {app.experience && <><p class="field-label">Experience, in their words</p><div class="ops-request">{app.experience}</div></>}
      {app.claims?.length ? (
        <>
          <p class="field-label">What they say they have done</p>
          <ul class="ops-claims">{app.claims.map(c => <li>{c.text} {c.evidence_url && <ExternalLink href={c.evidence_url}>(proof)</ExternalLink>}</li>)}</ul>
          <p class="muted small">These are their own claims. Open the links before you approve.</p>
        </>
      ) : null}
      {app.sample_links?.length ? <><p class="field-label">Samples</p><ul class="ops-claims">{app.sample_links.map(l => <li><ExternalLink href={l} /></li>)}</ul></> : null}
      {e.note && <p class="ops-meta">Last note: {e.note}</p>}
      {error && <Notice tone="bad">{error}</Notice>}
      <Field label="Note" help="Saved with your decision." id={`ops-note-${e.id}`}>
        <TextArea id={`ops-note-${e.id}`} value={note} onValue={setNote} rows={2} maxLength={2000} />
      </Field>
      {confirmReject ? (
        <div class="row">
          <span>Reject {name}? They get an email.</span>
          <Button kind="danger" small busy={busy === "reject"} onClick={() => decide("reject")}>Yes, reject</Button>
          <Button kind="ghost" small onClick={() => setConfirmReject(false)}>Back</Button>
        </div>
      ) : (
        <div class="row">
          {e.status !== "approved" && <Button small busy={busy === "approve"} disabled={!!busy} onClick={() => decide("approve")}>Approve</Button>}
          {e.status !== "paused" && e.status !== "rejected" && <Button small kind="secondary" busy={busy === "pause"} disabled={!!busy} onClick={() => decide("pause")}>Pause</Button>}
          {e.status !== "rejected" && <Button small kind="danger" disabled={!!busy} onClick={() => setConfirmReject(true)}>Reject</Button>}
        </div>
      )}
    </Card>
  );
}

function OpsExperts() {
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("applied");
  const [message, setMessage] = useState<string | null>(null);
  const state = useLoad(() => api<ExpertList | ExpertItem[]>(`/api/experts?status=${tab}`), [tab]);
  const list: ExpertList | null = state.data ? (Array.isArray(state.data) ? { experts: state.data } : state.data) : null;
  return (
    <Page title="Experts" intro="Approve experts before they can build agents in the studio." wide>
      <OpsNav />
      {message && <Notice tone="good">{message}</Notice>}
      <Tabs tabs={STATUS_TABS.map(s => ({ id: s, label: list?.counts && s !== "all" ? `${TAB_WORDS[s]} (${list.counts[s] ?? 0})` : TAB_WORDS[s] }))} value={tab} onValue={v => { setTab(v as typeof tab); setMessage(null); }} />
      {list?.founding && <p class="muted small">Founding expert places: {list.founding.taken} of {list.founding.limit} taken.</p>}
      {state.error
        ? <NotReady what="The expert list">We could not load applications: {state.error}</NotReady>
        : state.loading && !list ? <Spinner />
          : list && !list.experts.length ? <Empty title={tab === "applied" ? "No applications waiting" : "No experts here"}>New applications show up under Waiting.</Empty>
            : <div class="stack ops-stack">{list?.experts.map(e => <ExpertCard key={`${e.id}-${e.status}`} expert={e} onDone={m => { setMessage(m); state.reload(); }} />)}</div>}
    </Page>
  );
}

export { OpsExperts };
