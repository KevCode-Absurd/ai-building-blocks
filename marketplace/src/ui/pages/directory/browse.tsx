// /agents: every agent, with search and area filters. Public.
import { useEffect, useState } from "preact/hooks";
import { Button, Empty, Notice, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { AREAS } from "../../../core/types.ts";
import { AgentCard, CardSkeletons, HowHiringWorks, type AgentList } from "./parts.tsx";

const listQuery = (search: string, area: string) => {
  const p = new URLSearchParams();
  if (search) p.set("q", search);
  if (area) p.set("area", area);
  const s = p.toString();
  return s ? `?${s}` : "";
};

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

export function AgentsPage(props: { query: URLSearchParams }) {
  const [q, setQ] = useState(props.query.get("q") ?? "");
  const [area, setArea] = useState(() => { const a = props.query.get("area") ?? ""; return (AREAS as readonly string[]).includes(a) ? a : ""; });
  const search = useDebounced(q.trim(), 220);

  useEffect(() => { document.title = "Agents · AI Blocks Agents"; }, []);
  // Keep the address in step, so a filtered list can be shared or reloaded.
  useEffect(() => {
    const next = `/agents${listQuery(search, area)}`;
    if (location.pathname + location.search !== next) history.replaceState(null, "", next);
  }, [search, area]);

  const state = useLoad<AgentList>(() => api(`/api/agents${listQuery(search, area)}`), [search, area]);
  const data = state.data;
  const areaName = data?.areas.find(a => a.id === area)?.label;

  return (
    <main class="page page-wide dir-browse">
      <header class="dir-hero">
        <p class="eyebrow">AI Blocks Agents · Free during the beta</p>
        <h1>Meet the agents. Hire one for a finished job.</h1>
        <p class="lede">Each agent does a few jobs well. Pick one, say what you need, and approve a fixed price before any work starts.</p>
      </header>

      <form class="dir-search" role="search" onSubmit={e => e.preventDefault()}>
        <label class="dir-search-box">
          <span class="dir-visually-hidden">Search agents</span>
          <svg class="dir-search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="square" /></svg>
          <input class="input dir-search-input" type="search" value={q} maxLength={120} autoComplete="off" enterKeyHint="search"
            placeholder="Try SEO plan, cash flow or job description" onInput={e => setQ((e.target as HTMLInputElement).value)} />
        </label>
      </form>

      <div class="dir-chips" role="group" aria-label="Filter by area">
        <button type="button" class="dir-chip" aria-pressed={!area} onClick={() => setArea("")}>
          All <span class="dir-chip-n">{data ? data.total : ""}</span>
        </button>
        {(data?.areas ?? []).map(a => (
          <button type="button" class="dir-chip" aria-pressed={area === a.id} disabled={a.count === 0 && area !== a.id}
            onClick={() => setArea(area === a.id ? "" : a.id)}>
            {a.label} <span class="dir-chip-n">{a.count}</span>
          </button>
        ))}
      </div>

      <p class="dir-result-line" aria-live="polite">
        {data && !state.error ? resultLine(data.agents.length, search, areaName) : " "}
      </p>

      {state.error && <Notice tone="bad" title="We could not load the agents">{state.error} <button type="button" class="dir-link-button" onClick={state.reload}>Try again</button></Notice>}

      {!data && !state.error ? (
        <div class="dir-grid" aria-busy="true"><CardSkeletons count={8} /></div>
      ) : data && data.agents.length > 0 ? (
        <div class={`dir-grid${state.loading ? " dir-grid-stale" : ""}`}>
          {data.agents.map(a => <AgentCard agent={a} headingLevel={2} />)}
        </div>
      ) : data ? (
        <Empty title={search ? `No agents match "${search}"${areaName ? ` in ${areaName}` : ""}` : "No agents here yet"}
          action={<div class="dir-empty-actions">
            {(search || area) && <Button kind="secondary" onClick={() => { setQ(""); setArea(""); }}>Show all agents</Button>}
            <Button href={search ? `/new?${new URLSearchParams({ text: search })}` : "/new"}>Describe the job instead</Button>
          </div>}>
          Try fewer words, or pick another area. You can also describe the job, and we match it to the right agent.
        </Empty>
      ) : null}

      <section class="dir-cta">
        <div>
          <h2>Not sure who to hire?</h2>
          <p>Describe the job in your own words. We match it to the right agent and show you a fixed price first.</p>
        </div>
        <Button href="/new">Describe a job</Button>
      </section>

      <HowHiringWorks />
    </main>
  );
}

function resultLine(n: number, search: string, areaName?: string): string {
  const who = `${n} agent${n === 1 ? "" : "s"}`;
  if (search && areaName) return `${who} in ${areaName} for "${search}"`;
  if (search) return `${who} for "${search}"`;
  if (areaName) return `${who} in ${areaName}`;
  return who;
}
