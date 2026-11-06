// /agents/:id: one agent's profile, what they deliver and how to hire them. Public.
import { useEffect } from "preact/hooks";
import { Button, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api, ApiError } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { AgentCard, HowHiringWorks, Portrait, hireHref, turnaround, usd, type AgentCardData, type AgentOutcome, type AgentProfile } from "./parts.tsx";

interface ProfileResponse { agent: AgentProfile; related: AgentCardData[] }

/** Errors keep their status so a missing agent shows a page, not a red box. */
async function loadProfile(id: string): Promise<ProfileResponse | { missing: true }> {
  try { return await api<ProfileResponse>(`/api/agents/${encodeURIComponent(id)}`); }
  catch (e) { if (e instanceof ApiError && e.status === 404) return { missing: true }; throw e; }
}

export function AgentProfilePage(props: { params: Record<string, string> }) {
  const state = useLoad(() => loadProfile(props.params.id), [props.params.id]);
  const data = state.data;
  if (state.error) return <Page title="Agent"><Notice tone="bad" title="We could not load this agent">{state.error} <button type="button" class="dir-link-button" onClick={state.reload}>Try again</button></Notice></Page>;
  // While moving from one profile to another, the old one is not shown under the new address.
  if (!data || (state.loading && !("agent" in data && data.agent.id === props.params.id))) return <main class="page"><Spinner label="Loading the agent..." /></main>;
  if ("missing" in data) return (
    <Page title="We could not find that agent" intro="It may have a new name, or it is no longer offered.">
      <div class="row"><Button href="/agents">See all agents</Button><Button kind="secondary" href="/new">Describe a job instead</Button></div>
    </Page>
  );
  return <Profile agent={data.agent} related={data.related} />;
}

function Profile(props: { agent: AgentProfile; related: AgentCardData[] }) {
  const a = props.agent;
  useEffect(() => { document.title = `${a.name}, ${a.title} · AI Blocks Agents`; }, [a.id]);
  const priced = a.outcomes.filter(o => o.job);
  return (
    <main class="page dir-profile" style={`--dir-accent:${a.accent}`}>
      <Link href="/agents" class="dir-back">&larr; All agents</Link>

      <header class="dir-profile-hero">
        <Portrait name={a.name} src={a.portrait} accent={a.accent} size="large" eager />
        <div class="dir-profile-intro">
          <p class="eyebrow">{a.area_label}{a.kind === "expert" ? " · Built by an expert" : ""}</p>
          <h1>{a.name}</h1>
          <p class="dir-profile-title">{a.title}</p>
          <p class="lede">{a.tagline}</p>
          {a.bio && <p class="dir-profile-bio">{a.bio}</p>}
          <div class="dir-profile-actions">
            <Button href={hireHref(a.id)}>Hire {a.name}</Button>
            <a class="btn btn-secondary" href="#dir-deliver">See what I deliver</a>
          </div>
          <p class="muted small">
            {a.price_from_usd !== null ? <>Jobs from {usd(a.price_from_usd)}. </> : null}
            Free during the beta. You approve a fixed price before any work starts.
          </p>
        </div>
      </header>

      <section class="dir-section" id="dir-deliver" aria-labelledby="dir-deliver-title">
        <h2 id="dir-deliver-title">What I can deliver for you</h2>
        <div class="dir-outcomes">
          {a.outcomes.map(o => <OutcomeCard agent={a} outcome={o} />)}
        </div>
        {priced.length < a.outcomes.length && (
          <p class="muted small">Jobs without a listed price get a fixed quote after you describe them. You still approve it before work starts.</p>
        )}
      </section>

      {a.capabilities.length > 0 && (
        <section class="dir-section" aria-labelledby="dir-tools-title">
          <h2 id="dir-tools-title">What I work with</h2>
          <ul class="dir-tags">{a.capabilities.map(c => <li>{c}</li>)}</ul>
        </section>
      )}

      <div class="dir-fit">
        {a.good_at.length > 0 && (
          <section class="dir-fit-card" aria-labelledby="dir-good-title">
            <h2 id="dir-good-title">Good at</h2>
            <ul class="dir-list dir-list-yes">{a.good_at.map(x => <li>{x}</li>)}</ul>
          </section>
        )}
        {a.not_for.length > 0 && (
          <section class="dir-fit-card" aria-labelledby="dir-not-title">
            <h2 id="dir-not-title">Not for</h2>
            <ul class="dir-list dir-list-no">{a.not_for.map(x => <li>{x}</li>)}</ul>
          </section>
        )}
      </div>

      {a.samples.length > 0 && (
        <section class="dir-section" aria-labelledby="dir-try-title">
          <h2 id="dir-try-title">Try asking me</h2>
          <p class="muted">Pick one to start a job with it filled in. You can change every word.</p>
          <div class="dir-samples">
            {a.samples.map(s => (
              <Link href={hireHref(a.id, { job: s.job_type_id, text: s.brief })} class="dir-sample">
                <span class="dir-sample-title">{s.title}</span>
                <span class="dir-sample-brief">"{s.brief}"</span>
                <span class="dir-sample-go">Use this request &rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <HowHiringWorks name={a.name} />

      <section class="dir-hire-band">
        <Portrait name={a.name} src={a.portrait} accent={a.accent} size="small" />
        <div>
          <h2>Ready when you are</h2>
          <p>Tell {a.name} what you need. You see the price and the checklist before anything starts.</p>
        </div>
        <Button href={hireHref(a.id)}>Hire {a.name}</Button>
      </section>

      {props.related.length > 0 && (
        <section class="dir-section" aria-labelledby="dir-related-title">
          <div class="dir-section-head">
            <h2 id="dir-related-title">More agents in {a.area_label}</h2>
            <Link href={`/agents?${new URLSearchParams({ area: a.area })}`} class="dir-card-more">See all</Link>
          </div>
          <div class="dir-grid dir-grid-related">
            {props.related.map(r => <AgentCard agent={r} compact />)}
          </div>
        </section>
      )}
    </main>
  );
}

function OutcomeCard(props: { agent: AgentProfile; outcome: AgentOutcome }) {
  const { agent: a, outcome: o } = props;
  const href = o.job ? hireHref(a.id, { job: o.job.id }) : hireHref(a.id, { text: o.title });
  return (
    <article class="dir-outcome">
      <h3>{o.title}</h3>
      <p class="dir-outcome-get"><span class="dir-outcome-label">You get</span> {o.deliverable}</p>
      <dl class="dir-outcome-meta">
        {o.job ? (
          <>
            <div><dt>Price</dt><dd>From {usd(o.job.price_from_usd)}</dd></div>
            <div><dt>Ready in</dt><dd>About {turnaround(o.job.turnaround_hours)}</dd></div>
          </>
        ) : (
          <div><dt>Price</dt><dd>Quoted for your job</dd></div>
        )}
      </dl>
      <Button href={href} small kind={o.job ? "primary" : "secondary"}>Hire me for this</Button>
    </article>
  );
}
