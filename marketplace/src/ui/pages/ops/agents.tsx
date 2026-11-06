// /ops/agents: every agent, with filters, Go live / Retire / Bring back (studio endpoints) and the Seed agents button.
import { useState } from "preact/hooks";
import { Badge, Button, Input, Loaded, Notice, Page, Select, Table, useLoad } from "../../components.tsx";
import { ApiError, api } from "../../lib/api.ts";
import type { AgentSummary } from "../../../modules/ops/types.ts";
import { NotReady, OpsNav, errorText, notReady, pct, words } from "./shared.tsx";

const STATUS_TONE = { live: "good", testing: "info", draft: "neutral", retired: "warn" } as const;

function AgentActions(props: { agent: AgentSummary; onDone: (message: string) => void; onError: (err: unknown) => void }) {
  const a = props.agent;
  const [confirming, setConfirming] = useState<"retire" | "unretire" | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const call = async <T,>(path: string, body: unknown, message: (res: T) => string) => {
    setBusy(true);
    try {
      const res = await api<T>(`/api/studio/agents/${encodeURIComponent(a.id)}/${path}`, { body });
      props.onDone(message(res)); setConfirming(null); setReason("");
    } catch (err) { props.onError(err); } finally { setBusy(false); }
  };
  const name = a.persona_name ?? a.name;
  const cancel = () => { setConfirming(null); setReason(""); };
  if (confirming === "retire") {
    return (
      <div class="ops-inline-confirm">
        <Input value={reason} onValue={setReason} placeholder="Why retire it?" aria-label={`Why retire ${name}?`} maxLength={500} />
        <p class="ops-meta">Buyers stop being matched to it. Its versions and past jobs stay.</p>
        <div class="row">
          <Button small kind="danger" busy={busy} disabled={reason.trim().length < 3} onClick={() => call("retire", { reason: reason.trim() }, () => `${name} is retired. Buyers will not be matched to it.`)}>Yes, retire</Button>
          <Button small kind="ghost" onClick={cancel}>Keep it</Button>
        </div>
      </div>
    );
  }
  if (confirming === "unretire") {
    return (
      <div class="ops-inline-confirm">
        <p class="ops-meta">{a.live_version
          ? `It goes back to live on version ${a.live_version}, and buyers can be matched to it again.`
          : "It has no live version, so it goes back to draft. Buyers are not matched to it until a version goes live."}</p>
        <Input value={reason} onValue={setReason} placeholder="Note (optional)" aria-label={`Why bring back ${name}?`} maxLength={500} />
        <div class="row">
          <Button small busy={busy} onClick={() => call<{ status: "live" | "draft"; liveVersion: number | null }>("unretire", { reason: reason.trim() || undefined },
            res => res.status === "live" ? `${name} is back and live on version ${res.liveVersion}.` : `${name} is back as a draft. It is not live.`)}>Yes, bring it back</Button>
          <Button small kind="ghost" onClick={cancel}>Keep it retired</Button>
        </div>
      </div>
    );
  }
  if (a.status === "retired") {
    return <div class="row"><Button small kind="secondary" onClick={() => setConfirming("unretire")}>Bring back</Button></div>;
  }
  const goLiveVersion = a.latest_version && (a.status !== "live" || a.latest_version !== a.live_version) ? a.latest_version : null;
  return (
    <div class="row">
      {goLiveVersion && <Button small busy={busy} onClick={() => call("live", { version: goLiveVersion }, () => `${name} version ${goLiveVersion} is live.`)}>Go live (v{goLiveVersion})</Button>}
      <Button small kind="secondary" onClick={() => setConfirming("retire")}>Retire</Button>
    </div>
  );
}

function OpsAgents() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [kind, setKind] = useState("");
  const state = useLoad(() => api<{ agents: AgentSummary[] }>("/api/ops/agents"), []);
  const [message, setMessage] = useState<string | null>(null);
  const [problem, setProblem] = useState<unknown>(null);
  const [seeding, setSeeding] = useState(false);

  const seed = async () => {
    setSeeding(true); setMessage(null); setProblem(null);
    try {
      const res = await api<{ personas: { created: number; updated: number }; agents: { created: number } }>("/api/ops/seed", { body: {} });
      setMessage(`Done. ${res.personas.created} new agent profiles, ${res.personas.updated} updated, and ${res.agents.created} new house agents.`);
      state.reload();
    } catch (err) { setProblem(err); } finally { setSeeding(false); }
  };

  const needle = q.trim().toLowerCase();
  return (
    <Page title="Agents" intro="Every agent buyers can be matched to. Only live agents get new jobs." wide
      actions={<Button kind="secondary" busy={seeding} onClick={seed}>Seed agents</Button>}>
      <OpsNav />
      <p class="muted small">Seed agents adds the house agent profiles and builds one house agent for each job they offer. It is safe to run again.</p>
      {message && <Notice tone="good">{message}</Notice>}
      {problem !== null && (notReady(problem) && !(problem instanceof ApiError && problem.code === "seed_failed")
        ? <NotReady what="That action" />
        : <Notice tone="bad">{errorText(problem)}</Notice>)}
      <div class="ops-filters">
        <Input value={q} onValue={setQ} placeholder="Search by name, job type or expert" aria-label="Search agents" />
        <Select value={status} onValue={setStatus} options={[{ value: "", label: "Any status" }, { value: "live", label: "Live" }, { value: "testing", label: "Testing" }, { value: "draft", label: "Draft" }, { value: "retired", label: "Retired" }]} />
        <Select value={kind} onValue={setKind} options={[{ value: "", label: "House and expert" }, { value: "house", label: "House" }, { value: "expert", label: "Expert" }]} />
      </div>
      <Loaded state={state}>
        {({ agents }) => {
          const list = agents.filter(a => (!status || a.status === status) && (!kind || a.kind === kind) && (!needle ||
            [a.name, a.id, a.persona_name, a.expert_name, a.job_type_id, a.job_type_title].some(v => v?.toLowerCase().includes(needle))));
          if (!agents.length) return <Notice tone="info" title="No agents yet">Press Seed agents to add the house agents.</Notice>;
          return (
            <>
              <p class="muted small">{list.length} of {agents.length} agents.</p>
              <Table empty="No agents match these filters." head={["Agent", "Job type", "Kind", "Status", "Live version", "Jobs", "Accepted", "Blind test wins", ""]} rows={list.map(a => [
                <><strong>{a.persona_name ?? a.name}</strong><div class="ops-meta"><code>{a.id}</code></div></>,
                a.job_type_title ?? a.job_type_id,
                a.kind === "expert" ? <>Expert{a.expert_name && <div class="ops-meta">{a.expert_name}</div>}</> : "House",
                <Badge tone={STATUS_TONE[a.status] ?? "neutral"}>{words(a.status)}</Badge>,
                a.live_version ? `v${a.live_version}` : "None",
                String(a.jobs),
                a.acceptance_rate === null ? "No decisions yet" : `${pct(a.acceptance_rate)} (${a.accepted})`,
                a.win_rate === null ? "No tests yet" : `${pct(a.win_rate)} of ${a.blind_tests}`,
                <AgentActions agent={a} onDone={m => { setMessage(m); setProblem(null); state.reload(); }} onError={err => { setMessage(null); setProblem(err); }} />,
              ])} />
            </>
          );
        }}
      </Loaded>
    </Page>
  );
}

export { OpsAgents };
