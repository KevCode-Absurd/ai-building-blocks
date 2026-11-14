// /agents/:id: one agent's profile, what they deliver and how to hire them: download the agent or load it into your
// own AI (#dir-pack). Public.
import { useEffect, useState } from "preact/hooks";
import { Button, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api, ApiError, peekBoot } from "../../lib/api.ts";
import { Link, useHistoryState } from "../../lib/router.tsx";
import { AgentCard, HowHiringWorks, Portrait, WorkLine, type AgentCardData, type AgentOutcome, type AgentProfile } from "./parts.tsx";
import { SOUL_SECTIONS, splitVoice } from "../../../modules/directory/soul.ts";
import { agentTitle } from "../../../modules/directory/titles.ts";
import { groupByNature, lowerFirst, TASKS_SHOWN } from "../../../modules/directory/work.ts";
import { PackContents, PackDownloads } from "./pack-parts.tsx";
import { fileNames, loadPack, viewerHref, type PackFile, type PackInfo } from "./packs.ts";

interface ProfileResponse { agent: AgentProfile; related: AgentCardData[] }

/** Errors keep their status so a missing agent shows a page, not a red box. */
async function loadProfile(id: string): Promise<ProfileResponse | { missing: true }> {
  try { return await api<ProfileResponse>(`/api/agents/${encodeURIComponent(id)}`); }
  catch (e) { if (e instanceof ApiError && e.status === 404) return { missing: true }; throw e; }
}

export function AgentProfilePage(props: { params: Record<string, string> }) {
  const state = useLoad(() => loadProfile(props.params.id), [props.params.id], peekBoot<ProfileResponse>(`/api/agents/${encodeURIComponent(props.params.id)}`));
  const data = state.data;
  if (state.error) return (
    <Page title="We could not load this agent" intro="This is an agent's profile page. Check your connection, then try again.">
      <Notice tone="bad">{state.error} <button type="button" class="dir-link-button" onClick={state.reload}>Try again</button></Notice>
      <Button kind="secondary" href="/agents">See all agents</Button>
    </Page>
  );
  // While moving from one profile to another, the old one is not shown under the new address.
  if (!data || (state.loading && !("agent" in data && data.agent.id === props.params.id))) return <main class="page"><Spinner label="Loading the agent..." /></main>;
  if ("missing" in data) return (
    <Page title="We could not find that agent" intro="It may have a new name, or it is no longer offered. See every agent to find another one.">
      <div class="row"><Button href="/agents">See all agents</Button></div>
    </Page>
  );
  return <Profile agent={data.agent} related={data.related} />;
}

function Profile(props: { agent: AgentProfile; related: AgentCardData[] }) {
  const a = props.agent;
  useEffect(() => { document.title = agentTitle(a.name, a.title); }, [a.id]);
  // The free download (dist/packs). Missing before a local build, and for experts' agents, which have none.
  const pack = useLoad(() => loadPack(a.id), [a.id]);
  const files = pack.data?.files ?? [];
  // "Hire" links from other pages land on #dir-pack, which only exists once the pack has loaded.
  useEffect(() => { if (!pack.loading && location.hash === "#dir-pack") document.getElementById("dir-pack")?.scrollIntoView(); }, [pack.loading, a.id]);
  return (
    <main class="page dir-profile" style={`--dir-accent:${a.accent}`}>
      <Link href="/agents" class="dir-back">&larr; All agents</Link>

      <header class="dir-profile-hero">
        <Portrait name={a.name} src={a.portrait} accent={a.accent} size="large" eager />
        <div class="dir-profile-intro">
          <p class="eyebrow">{a.area_label}{a.kind === "expert" ? " · Built by an expert" : ""}</p>
          <h1>{a.name}</h1>
          <p class="dir-profile-title">{a.title}</p>
          {a.role && <p class="dir-profile-role">Job role: <Link href={`/agents?${new URLSearchParams({ role: a.role.id })}`}>{a.role.name}</Link></p>}
          {a.does && <WorkLine does={a.does} class="dir-profile-does" />}
          {a.does_not && <p class="dir-profile-not"><b>Not for:</b> {lowerFirst(a.does_not)}</p>}
          <p class="lede">{a.tagline}</p>
          {a.bio && <p class="dir-profile-bio">{a.bio}</p>}
          <div class="dir-profile-actions">
            {a.kind === "house" && <a class="btn btn-primary" href="#dir-pack">Hire {a.name}</a>}
            <a class="btn btn-secondary" href="#dir-deliver">See what I deliver</a>
          </div>
          <p class="muted small">{a.kind === "house"
            ? <>Hiring is free. {a.name} works in your own AI: download the files, or <Link href="/connect">connect your AI</Link> and load {a.name} there.</>
            : <>{a.name} was built by an expert and is not available to download yet.</>}</p>
        </div>
      </header>

      <section class="dir-section" id="dir-deliver" aria-labelledby="dir-deliver-title">
        <h2 id="dir-deliver-title">What I can deliver for you</h2>
        <div class="dir-outcomes">
          {a.outcomes.map(o => <OutcomeCard agent={a} outcome={o} files={files} />)}
        </div>
      </section>

      {a.tasks.length > 0 && <CanDo agent={a} />}

      {a.brings.length > 0 && <Brings agent={a} files={files} />}

      {a.team.length > 0 && <ChannelTeam agent={a} />}

      {a.soul && <Personality agent={a} soul={a.soul} />}

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
          <p class="muted">Once I am in your AI, try one of these. Copy it, then change any word.</p>
          <div class="dir-samples">
            {a.samples.map(s => <SampleRequest title={s.title} brief={s.brief} />)}
          </div>
        </section>
      )}

      <HowHiringWorks name={a.name} />

      {pack.data && <PackDownloads agentId={a.id} name={a.name} title={a.title} area={a.area} role={a.role} pack={pack.data} />}
      {pack.data && pack.data.files.length > 0 && <PackInside agent={a} pack={pack.data} />}
      {!pack.loading && !pack.data && a.kind === "house" && (
        <section class="dir-section dir-pack" id="dir-pack" aria-labelledby="dir-pack-title">
          <h2 id="dir-pack-title">Start {a.name} in your AI</h2>
          <p class="muted">{a.name}'s free download is not ready yet. Check back soon.</p>
        </section>
      )}

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

/** "What's inside": every file in the download, grouped by kind, each opening in the file viewer. */
function PackInside(props: { agent: AgentProfile; pack: PackInfo }) {
  const { agent: a, pack } = props;
  return (
    <section class="dir-section" id="dir-inside" aria-labelledby="dir-inside-title">
      <div class="dir-section-head">
        <h2 id="dir-inside-title">What's inside</h2>
        <span class="dir-files-total">{pack.files.length} files{pack.version ? ` · version ${pack.version}` : ""}</span>
      </div>
      <p class="muted">Every file in {a.name}'s download. Open one to read it here.</p>
      <PackContents agentId={a.id} files={pack.files} names={fileNames(a)} />
    </section>
  );
}

/**
 * "What I can do": the tasks this job role is hired for, in plain words, grouped by what they are (things I make,
 * plan, or check). The tasks closest to this agent's own outcomes come first. The first few show at once; "Show
 * all" opens the rest, and the choice stays with this history entry, so going back returns to the same place.
 */
function CanDo(props: { agent: AgentProfile }) {
  const a = props.agent;
  const [all, setAll] = useHistoryState("tasks-all", false);
  const more = a.tasks.length - TASKS_SHOWN;
  const groups = groupByNature(all || more <= 0 ? a.tasks : a.tasks.slice(0, TASKS_SHOWN));
  return (
    <section class="dir-section dir-can" id="dir-can" aria-labelledby="dir-can-title">
      <div class="dir-section-head">
        <h2 id="dir-can-title">What I can do</h2>
        <span class="dir-files-total">{a.tasks.length} tasks</span>
      </div>
      <p class="muted">{a.role ? `The jobs people bring to a ${lowerFirst(a.role.name)}.` : "The jobs people bring me."} Ask for any of them in your own words.</p>
      <div class="dir-can-groups" id="dir-can-list">
        {groups.map(g => (
          <div class="dir-can-group">
            <h3>{g.heading}</h3>
            <ul class="dir-list dir-list-yes">{g.tasks.map(t => <li>{t.task}</li>)}</ul>
          </div>
        ))}
      </div>
      {more > 0 && (
        <p class="dir-can-more">
          <button type="button" class="btn btn-secondary btn-sm" aria-expanded={all} aria-controls="dir-can-list" onClick={() => setAll(!all)}>
            {all ? "Show fewer tasks" : `Show all ${a.tasks.length} tasks`}
          </button>
        </p>
      )}
    </section>
  );
}

/**
 * "What I bring": how many skills, prompts, workflows, tools, thinking lenses and helper agents the agent works
 * with, then each one by its plain name. The agent's own files open in the file viewer (when the download holds
 * them), library items open on the AI Blocks library, and helper agents open that job role's agents here.
 */
function Brings(props: { agent: AgentProfile; files: PackFile[] }) {
  const a = props.agent;
  const inPack = new Set(props.files.map(f => f.path));
  return (
    <section class="dir-section dir-bring" id="dir-bring" aria-labelledby="dir-bring-title">
      <h2 id="dir-bring-title">What I bring</h2>
      <p class="muted">What I work with, by name. I pick what fits your job.</p>
      <ul class="dir-bring-counts" aria-label="What I bring, by kind">
        {a.brings.map(g => <li><b>{g.items.length}</b> {g.items.length === 1 ? g.one : g.label.toLowerCase()}</li>)}
      </ul>
      <div class="dir-bring-groups">
        {a.brings.map(g => (
          <details class="dir-bring-group" open={g.items.length <= 12}>
            <summary><span class="dir-bring-label">{g.label}</span> <span class="dir-files-n">{g.items.length}</span></summary>
            <ul>
              {g.items.map(item => (
                <li>
                  {item.file && inPack.has(item.file) ? <Link href={viewerHref(a.id, item.file)}>{item.name}</Link>
                    : item.href && item.href.startsWith("/") ? <Link href={item.href}>{item.name}</Link>
                    : item.href ? <a href={item.href} target="_blank" rel="noopener">{item.name}</a>
                    : item.name}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}

/** A mega agent's team: one line for each channel specialist it leads, and the method it is built on. */
function ChannelTeam(props: { agent: AgentProfile }) {
  const a = props.agent;
  return (
    <section class="dir-section dir-team" id="dir-team" aria-labelledby="dir-team-title">
      <div class="dir-section-head">
        <h2 id="dir-team-title">My channel team</h2>
        <span class="dir-files-total">{a.team.length} specialists</span>
      </div>
      <p class="dir-team-lede">I test the channels most likely to work for your kind of business, then focus on the one that works. Each specialist on my team knows one channel.</p>
      <ol class="dir-team-list">
        {a.team.map(m => (
          <li class="dir-team-member">
            <span class="dir-team-name">{m.name}</span>
            {m.job !== m.name && <span class="dir-team-job">{m.job}</span>}
          </li>
        ))}
      </ol>
      <p class="dir-team-credit">Built on the Bullseye method from <cite>Traction</cite> by Gabriel Weinberg and Justin Mares. The authors are not involved with AI Blocks.</p>
    </section>
  );
}

/**
 * One outcome. "See how I do this" opens the skill that does it: the one the profile data names (outcome.how, matched
 * by what the outcome is, not by its job type alone), and only when the download really holds that file. A job
 * type's own skill sits in a "-job" folder when the role kit has a skill of the same name.
 */
function OutcomeCard(props: { agent: AgentProfile; outcome: AgentOutcome; files: PackFile[] }) {
  const { agent: a, outcome: o } = props;
  const how = o.how;
  const skill = how ? props.files.find(f => f.path === how.path) ?? props.files.find(f => f.path === how.path.replace(/\/SKILL\.md$/, "-job/SKILL.md")) : undefined;
  return (
    <article class="dir-outcome">
      <h3>{o.title}</h3>
      <p class="dir-outcome-get"><span class="dir-outcome-label">You get</span> {o.deliverable}</p>
      {skill && how && <Link href={viewerHref(a.id, skill.path)} class="dir-card-more" aria-label={`See how I do this: ${how.name}`}>See how I do this</Link>}
    </article>
  );
}

/** A sample request to paste into the person's own AI once the agent is loaded there. */
function SampleRequest(props: { title: string; brief: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(props.brief); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* No clipboard here: the text stays on the page to select by hand. */ }
  };
  return (
    <div class="dir-sample">
      <span class="dir-sample-title">{props.title}</span>
      <span class="dir-sample-brief">"{props.brief}"</span>
      <button type="button" class="dir-sample-go dir-link-button" onClick={copy}>{copied ? "Copied" : "Copy this request"}</button>
    </div>
  );
}

type Soul = NonNullable<AgentProfile["soul"]>;

/** The agent's personality (its soul.md): the essence as the lead line, then the six plain-label parts. */
function Personality(props: { agent: AgentProfile; soul: Soul }) {
  const { agent: a, soul } = props;
  const parts = SOUL_SECTIONS.filter(({ key }) => { const v = soul[key]; return Array.isArray(v) ? v.length > 0 : !!v; });
  return (
    <section class="dir-section dir-soul" id="dir-soul" aria-labelledby="dir-soul-title">
      <div class="dir-section-head">
        <h2 id="dir-soul-title">Personality</h2>
        <a class="dir-soul-file" href={`/agents/${encodeURIComponent(a.id)}/soul.md`} title={`${a.name}'s personality as a plain text file`}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" /><path d="M9.5 1.5V5H13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" /></svg>
          soul.md
        </a>
      </div>
      <p class="dir-soul-lead">{soul.essence}</p>
      {parts.length > 0 && (
        <dl class="dir-soul-grid">
          {parts.map(({ key, label }) => (
            <div class={`dir-soul-part dir-soul-${key}`}>
              <dt>{label}</dt>
              <dd><SoulValue field={key} value={soul[key]} /></dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

function SoulValue(props: { field: (typeof SOUL_SECTIONS)[number]["key"]; value: string | string[] }) {
  const v = props.value;
  if (Array.isArray(v)) return <ul class="dir-soul-list">{v.map(x => <li>{x}</li>)}</ul>;
  if (props.field === "voice") {
    const { text, example } = splitVoice(v);
    return (
      <>
        {text && <p>{text}</p>}
        {example && <blockquote class="dir-soul-quote"><p>{example}</p></blockquote>}
      </>
    );
  }
  return <p>{v}</p>;
}
