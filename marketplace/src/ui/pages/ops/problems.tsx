// /ops/problems: problems buyers reported on delivered work. Owner: delivery module (API in src/modules/delivery/problems.ts).
// Open reports come first, oldest at the top. Each one is settled with an outcome and a note that goes to the buyer.
import { useState } from "preact/hooks";
import { Badge, Button, Card, Empty, Field, Loaded, Notice, Page, Tabs, TextArea, useLoad } from "../../components.tsx";
import { api, when } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import type { ProblemReportView } from "../../../modules/delivery/problems.ts";
import type { ProblemOutcome, StoredProblemOutcome } from "../../../modules/delivery/service.ts";
import { OpsNav, StatusBadge, errorText } from "./shared.tsx";
import "./problems.css";

type List = { reports: ProblemReportView[]; counts: { open: number; resolved: number } };

/** Hiring is free, so there is no money outcome. "credit" only shows on reports closed before that. */
function outcomeText(o: StoredProblemOutcome): { label: string; help: string } {
  switch (o) {
    case "rerun": return { label: "Redo the work", help: "The agent runs again with the buyer's report and your note. The new draft goes through the usual checks." };
    case "accept": return { label: "Keep the work", help: "Mark the job as done. The buyer keeps the draft they have." };
    case "cancel": return { label: "Cancel the job", help: "Close the job for good. The buyer can start a new one any time." };
    case "close": return { label: "Close the report", help: "The job was already settled another way. This only closes the report." };
    case "credit": return { label: "Closed the job (old credit outcome)", help: "" };
  }
}

function Resolve(props: { report: ProblemReportView; onDone: () => void }) {
  const r = props.report;
  const [outcome, setOutcome] = useState<ProblemOutcome | null>(r.outcomes.length === 1 ? r.outcomes[0] : null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ready = !!outcome && !!note.trim();
  return (
    <form class="dlv-prb-form" onSubmit={async e => {
      e.preventDefault();
      if (!ready) return;
      if (outcome === "cancel" && !confirm("Close this job for good? You cannot undo this.")) return;
      setBusy(true); setError(null);
      try {
        await api(`/api/ops/problems/${encodeURIComponent(r.id)}/resolve`, { body: { outcome, note } });
        props.onDone();
      } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
    }}>
      {r.job.status !== "disputed" && (
        <Notice tone="info">This job is no longer disputed, so it was settled another way. Close the report with a note for the buyer.</Notice>
      )}
      <fieldset class="dlv-prb-outcomes">
        <legend>What happens next?</legend>
        {r.outcomes.map(o => {
          const t = outcomeText(o);
          return (
            <label class="dlv-prb-outcome">
              <input type="radio" name={`dlv-prb-${r.id}`} value={o} checked={outcome === o} onChange={() => setOutcome(o)} />
              <span><strong>{t.label}</strong><span class="ops-meta">{t.help}</span></span>
            </label>
          );
        })}
      </fieldset>
      <Field label="Note to the buyer" help="We email this to the buyer and keep it on the job record. Say what you found and what happens now." id={`dlv-prb-note-${r.id}`}>
        <TextArea id={`dlv-prb-note-${r.id}`} rows={3} value={note} onValue={setNote} maxLength={4000} />
      </Field>
      {error && <Notice tone="bad">{error}</Notice>}
      <Button type="submit" busy={busy} disabled={!ready}>Close the report</Button>
      {!ready && <p class="muted small">Pick what happens next and write a note.</p>}
    </form>
  );
}

function Report(props: { report: ProblemReportView; onDone: () => void }) {
  const r = props.report;
  const meta = [
    r.buyer.email ?? r.buyer.id,
    r.persona?.name,
    r.draft ? `draft ${r.draft.version}` : null,
    `${r.job.revisionsUsed} of ${r.job.revisionsAllowed} revisions used`,
    `reported ${when(r.createdAt)}`,
  ].filter(Boolean);
  return (
    <Card class="dlv-prb">
      <div class="ops-item-head">
        <Link href={`/ops/jobs/${r.job.id}`} class="ops-item-title">{r.job.title}</Link>
        <StatusBadge status={r.job.status} />
        {r.status === "resolved" && <Badge tone="good">Closed</Badge>}
      </div>
      <p class="ops-meta">{meta.join(" · ")}</p>
      <blockquote class="dlv-prb-quote">{r.reasons}</blockquote>
      {r.status === "resolved" ? (
        <div class="dlv-prb-result">
          <p><strong>{r.outcome ? outcomeText(r.outcome).label : "Closed"}</strong>
            <span class="ops-meta"> · {when(r.resolvedAt)}{r.resolvedBy ? ` by ${r.resolvedBy.email ?? r.resolvedBy.id}` : ""}</span></p>
          {r.note && <p class="dlv-prb-note">Note to the buyer: {r.note}</p>}
        </div>
      ) : <Resolve report={r} onDone={props.onDone} />}
    </Card>
  );
}

export function OpsProblems() {
  const [tab, setTab] = useState<"open" | "resolved">("open");
  const state = useLoad(() => api<List>(`/api/ops/problems?status=${tab}`), [tab]);
  const counts = state.data?.counts;
  return (
    <Page title="Problem reports" wide
      intro="Buyers report problems that a revision cannot fix, such as made-up facts or the wrong job. Each open report needs a decision and a note to the buyer.">
      <OpsNav />
      <Tabs value={tab} onValue={id => setTab(id as "open" | "resolved")} tabs={[
        { id: "open", label: counts ? `Open (${counts.open})` : "Open" },
        { id: "resolved", label: counts ? `Closed (${counts.resolved})` : "Closed" },
      ]} />
      <div class="dlv-prb-list">
        <Loaded state={state}>
          {data => data.reports.length === 0 ? (
            <Empty title={tab === "open" ? "No open reports" : "No closed reports yet"}>
              {tab === "open" ? "When a buyer reports a problem, it shows up here and the team gets an email." : "Reports you close show up here."}
            </Empty>
          ) : (
            <div class="stack">{data.reports.map(r => <Report key={r.id} report={r} onDone={state.reload} />)}</div>
          )}
        </Loaded>
      </div>
    </Page>
  );
}
