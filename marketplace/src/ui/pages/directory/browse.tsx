// /agents: every agent, with search and area filters. /agents?role=<id>: the agents in one job role. Public.
import { useEffect, useState } from "preact/hooks";
import { Button, Empty, Notice, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { AREAS } from "../../../core/types.ts";
import { AgentCard, CardSkeletons, HowHiringWorks, type AgentList } from "./parts.tsx";

const ROLE_ID = /^[a-z][a-z0-9-]{2,59}$/;

const listQuery = (search: string, area: string, role = "") => {
  const p = new URLSearchParams();
  if (role) p.set("role", role);
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
  // ?role=<id>: one job role (from a profile's role link). The list says the role's name and what it does.
  const [role, setRole] = useState(() => { const r = props.query.get("role")?.trim() ?? ""; return ROLE_ID.test(r) ? r : ""; });
  const search = useDebounced(q.trim(), 220);

  // Keep the address in step, so a filtered list can be shared or reloaded.
  useEffect(() => {
    const next = `/agents${listQuery(search, area, role)}`;
    if (location.pathname + location.search !== next) history.replaceState(null, "", next);
  }, [search, area, role]);

  const state = useLoad<AgentList>(() => api(`/api/agents${listQuery(search, area, role)}`), [search, area, role]);
  const data = state.data;
  const areaName = data?.areas.find(a => a.id === area)?.label;
  const roleInfo = role && data?.role?.id === role ? data.role : null;
  useEffect(() => { document.title = roleInfo ? `${roleInfo.name} agents · AI Blocks` : "Agents · AI Blocks"; }, [roleInfo?.id]);
  const showAll = () => { setQ(""); setArea(""); setRole(""); };

  return (
    <main class="page page-wide dir-browse">
      {role ? (
        <header class="dir-hero dir-hero-role">
          <p class="eyebrow">Job role</p>
          <h1>{roleInfo?.name ?? (state.error ? "Agents" : " ")}</h1>
          {roleInfo && <p class="lede">{roleInfo.summary}</p>}
          <p class="dir-role-all"><button type="button" class="dir-link-button" onClick={() => setRole("")}>See agents in every role</button></p>
        </header>
      ) : (
        <header class="dir-hero">
          <p class="eyebrow">Agents · Free to hire</p>
          <h1>Meet the agents. Hire one to work in your AI.</h1>
          <p class="lede">These are AI agents, each built for one job role. Pick one, then download it or load it into your own AI. It is free, and it works on your own AI plan.</p>
        </header>
      )}

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
        {data && !state.error ? resultLine(data.agents.length, search, areaName, roleInfo?.name) : " "}
      </p>

      {state.error && <Notice tone="bad" title="We could not load the agents">{state.error} {role
        ? <button type="button" class="dir-link-button" onClick={showAll}>Show all agents</button>
        : <button type="button" class="dir-link-button" onClick={state.reload}>Try again</button>}</Notice>}

      {!data && !state.error ? (
        <div class="dir-grid" aria-busy="true"><CardSkeletons count={8} /></div>
      ) : data && data.agents.length > 0 ? (
        <div class={`dir-grid${state.loading ? " dir-grid-stale" : ""}`}>
          {data.agents.map(a => <AgentCard agent={a} headingLevel={2} />)}
        </div>
      ) : data ? (
        <Empty title={search ? `No agents match "${search}"${areaName ? ` in ${areaName}` : ""}` : "No agents here yet"}
          action={<div class="dir-empty-actions">
            {(search || area || role) && <Button kind="secondary" onClick={showAll}>Show all agents</Button>}
          </div>}>
          Try fewer words, or pick another area.
        </Empty>
      ) : null}

      <section class="dir-cta">
        <div>
          <h2>Use agents from your AI</h2>
          <p>Connect Claude, ChatGPT or another AI app once. Then ask it to find an agent and load it into your chat.</p>
        </div>
        <Button href="/connect">Connect your AI</Button>
      </section>

      <HowHiringWorks />
    </main>
  );
}

function resultLine(n: number, search: string, areaName?: string, roleName?: string): string {
  const who = `${n} ${roleName ? `${roleName} ` : ""}agent${n === 1 ? "" : "s"}`;
  if (search && areaName) return `${who} in ${areaName} for "${search}"`;
  if (search) return `${who} for "${search}"`;
  if (areaName) return `${who} in ${areaName}`;
  return who;
}
