// /e-commerce: the home of the e-commerce team. Public. The team lead and the specialists (GET /api/agents?vertical=
// ecommerce, lead first), the expert library's totals (GET /api/knowledge/ecommerce), "Ask the library" (GET
// /api/knowledge/ecommerce/ask) and how to start. The Worker sends the first two answers inside the page (src/pages.ts),
// so the team and the library paint at once. Agents run in the visitor's own AI; nothing here runs a model.
import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { Badge, Button, Field, Notice, Select, useLoad } from "../../components.tsx";
import { api, ApiError, peekBoot } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { ECOMMERCE_TITLE } from "../../../modules/directory/titles.ts";
import { AgentCard, CardSkeletons, hireHref, Portrait, WorkLine, type AgentCardData } from "./parts.tsx";

const VERTICAL = "ecommerce";
const TEAM_PATH = `/api/agents?vertical=${VERTICAL}`;
const LIBRARY_PATH = `/api/knowledge/${VERTICAL}`;
const MIN_Q = 3, MAX_Q = 300;

/** GET /api/agents?vertical=ecommerce: the team in team order, lead first. */
interface TeamList { total: number; vertical: string; agents: AgentCardData[] }

/** GET /api/knowledge/ecommerce: what the library holds. A 404 means it is not built yet. */
interface Library {
  id: string; name: string; summary: string; updated: string;
  cards: number; sources: number; baseline: number;
  modules: { code: string; name: string; cards: number }[];
  tiers: Record<string, string>;
}

interface AskCard {
  id: string; modules: string[]; claim: string; body: string; conditions: string; fails_when: string;
  scope: string; tier: number; numbers: string[]; stale: boolean;
  source: { title: string; author: string; url: string | null; date: string; tier: number } | null;
}
/** GET /api/knowledge/ecommerce/ask: the best cards for a question. enough is false when none answers it well. */
interface AskAnswer { enough: boolean; coverage: number; missing: string[]; cards: AskCard[] }

const MARKETS = [
  { value: "", label: "Any market" },
  { value: "IN", label: "India (IN)" },
  { value: "US", label: "US" },
];

/** The trust levels, in a few words each (knowledge/ecommerce/vertical.json has the full rule). */
const TIER_SHORT: Record<number, string> = { 1: "platform's own guide", 2: "large study", 3: "named seller with proof", 4: "opinion" };

/** What useLoad returns. */
type LoadState<T> = { data: T | null; error: string | null; loading: boolean; reload: () => void };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** "2026-11-13" -> "13 Nov 2026"; "2026-06" or a day of "00" -> "Jun 2026". Anything else as it is. */
function dateWords(iso: string): string {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(iso ?? "");
  if (!m) return iso ?? "";
  const month = new Date(Date.UTC(+m[1], +m[2] - 1, 1)).toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  return m[3] && m[3] !== "00" ? `${+m[3]} ${month} ${m[1]}` : `${month} ${m[1]}`;
}

/** A link to a section of this page: scrolls there without adding a history entry (the router would scroll to the
 *  top), and works as a plain anchor without scripts. */
function JumpLink(props: { to: string; class?: string; focus?: string; children: ComponentChildren }) {
  return (
    <a href={`#${props.to}`} class={props.class} onClick={(e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const target = document.getElementById(props.to);
      if (!target) return;
      e.preventDefault();
      const still = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      if (props.focus) document.getElementById(props.focus)?.focus({ preventScroll: true });
    }}>{props.children}</a>
  );
}

export function EcommercePage() {
  useEffect(() => { document.title = ECOMMERCE_TITLE; }, []);
  const team = useLoad<TeamList>(() => api(TEAM_PATH), [], peekBoot<TeamList>(TEAM_PATH));
  // A 404 is a library that is not built yet: a calm note, not an error.
  const bootLibrary = peekBoot<Library>(LIBRARY_PATH);
  const library = useLoad<{ library: Library | null }>(
    () => api<Library>(LIBRARY_PATH).then(l => ({ library: l }), e => { if (e instanceof ApiError && e.status === 404) return { library: null }; throw e; }),
    [], bootLibrary ? { library: bootLibrary } : undefined);
  const lead = team.data?.agents[0] ?? null;

  return (
    <main class="page page-wide dir-ecom">
      <header class="dir-hero">
        <p class="eyebrow">For online stores · Free</p>
        <h1>AI agents for your online store</h1>
        <p class="lede">A team that knows e-commerce, built from expert sources, free to use in your own AI. Made for Shopify stores in India and the US, with Amazon as a second place to sell.</p>
        <div class="dir-ecom-actions">
          {lead
            ? <Button href={`/agents/${lead.id}`}>Meet {lead.name}, the team lead</Button>
            : <JumpLink to="ecom-team" class="btn btn-primary">Meet the team</JumpLink>}
          <JumpLink to="ecom-ask" focus="ecom-q" class="btn btn-line">Ask the library</JumpLink>
        </div>
      </header>

      <section class="dir-section" id="ecom-team" aria-labelledby="ecom-team-title">
        <div class="dir-section-head">
          <h2 id="ecom-team-title">The team</h2>
          {team.data && team.data.total > 0 && <span class="dir-files-total">{plural(team.data.total, "agent")}</span>}
        </div>
        <TeamSection state={team} />
      </section>

      <section class="dir-section" id="ecom-library" aria-labelledby="ecom-library-title">
        <h2 id="ecom-library-title">The library</h2>
        <p class="dir-ecom-lede">Every agent on the team draws on one expert library. A card is one tested idea from a trusted source, with when it holds and when it fails.</p>
        <LibrarySection state={library} />
      </section>

      <AskSection lead={lead} library={library.data?.library ?? null} />

      <section class="dir-how" aria-labelledby="ecom-start-title">
        <h2 id="ecom-start-title">How to start</h2>
        <ol class="dir-how-steps">
          <li><span class="step-n">1</span><h3>Pick an agent</h3><p>Start with {lead ? <Link href={`/agents/${lead.id}`} class="dir-inline-link">{lead.name}, the team lead</Link> : "the team lead"}, or pick the specialist for the job. Every agent is free.</p></li>
          <li><span class="step-n">2</span><h3>Load it in your AI</h3><p>Download it, or connect your AI and load it there. It works on your own AI plan. <Link href="/guides/use-an-agent-pack" class="dir-inline-link">Read the guide</Link> or <Link href="/connect" class="dir-inline-link">connect your AI</Link>.</p></li>
          <li><span class="step-n">3</span><h3>Ask your first job</h3><p>Say what you need in your own words, like "write a product page for my best seller". The agent asks only for what is missing.</p></li>
        </ol>
      </section>
    </main>
  );
}

function OnItsWay(props: { title: string; children: ComponentChildren }) {
  return <div class="dir-ecom-note" role="status"><strong>{props.title}</strong><p>{props.children}</p></div>;
}

function TeamSection(props: { state: LoadState<TeamList> }) {
  const { data, error, reload } = props.state;
  if (error && !data) return (
    <OnItsWay title="We could not load the team just now">
      Check your connection, then <button type="button" class="dir-link-button" onClick={reload}>try again</button>. Or <Link href="/agents" class="dir-inline-link">browse every agent</Link>.
    </OnItsWay>
  );
  if (!data) return <div class="dir-grid" aria-busy="true"><CardSkeletons count={4} /></div>;
  if (!data.agents.length) return (
    <OnItsWay title="The team is on its way">
      The e-commerce agents are not listed yet. In the meantime, <Link href="/agents" class="dir-inline-link">browse every agent</Link>.
    </OnItsWay>
  );
  const [lead, ...specialists] = data.agents;
  return (
    <>
      <TeamLead agent={lead} specialists={specialists.length} />
      {specialists.length > 0 && (
        <>
          <h3 class="dir-ecom-subhead">The specialists</h3>
          <div class="dir-grid">{specialists.map(a => <AgentCard agent={a} headingLevel={3} />)}</div>
        </>
      )}
    </>
  );
}

/** The team lead, larger than the cards: portrait beside what they do and what they deliver. */
function TeamLead(props: { agent: AgentCardData; specialists: number }) {
  const a = props.agent;
  const profile = `/agents/${a.id}`;
  return (
    <article class="dir-ecom-lead" style={`--dir-accent:${a.accent}`}>
      <Portrait name={a.name} src={a.portrait} accent={a.accent} size="large" />
      <div class="dir-ecom-lead-body">
        <p class="eyebrow">Team lead</p>
        <h3 class="dir-ecom-lead-name"><Link href={profile}>{a.name}</Link></h3>
        <p class="dir-card-title">{a.title}</p>
        {a.does && <WorkLine does={a.does} />}
        <p class="dir-ecom-lead-tagline">{a.tagline}</p>
        {props.specialists > 0 && <p class="dir-ecom-lead-team">Hands each part of the work to one of {plural(props.specialists, "specialist")}.</p>}
        {a.outcomes.length > 0 && (
          <ul class="dir-card-outcomes dir-ecom-lead-outcomes" aria-label={`What ${a.name} delivers`}>
            {a.outcomes.map(o => <li>{o}</li>)}
          </ul>
        )}
        <div class="dir-ecom-actions">
          <Button href={hireHref(a.id)}>Hire {a.name}</Button>
          <Link href={profile} class="dir-card-more">About {a.name}</Link>
        </div>
      </div>
    </article>
  );
}

function LibrarySection(props: { state: LoadState<{ library: Library | null }> }) {
  const { data, error, reload } = props.state;
  if (error && !data) return (
    <OnItsWay title="We could not load the library just now">
      Check your connection, then <button type="button" class="dir-link-button" onClick={reload}>try again</button>.
    </OnItsWay>
  );
  if (!data) return <p class="dir-result-line" aria-busy="true">Opening the library…</p>;
  const lib = data.library;
  if (!lib || lib.cards === 0) return (
    <OnItsWay title="The library is on its way">
      We are still adding the first cards. The agents already know their work, and you can use them today.
    </OnItsWay>
  );
  const modules = lib.modules.filter(m => m.cards > 0);
  return (
    <>
      <ul class="dir-bring-counts" aria-label="What the library holds">
        <li><b>{lib.cards}</b> {lib.cards === 1 ? "card" : "cards"}</li>
        <li><b>{lib.sources}</b> {lib.sources === 1 ? "source" : "sources"}</li>
        {lib.baseline > 0 && <li><b>{lib.baseline}</b> true for almost every store</li>}
        {lib.updated && <li>Updated {dateWords(lib.updated)}</li>}
      </ul>
      <ul class="dir-ecom-modules" aria-label="Cards by part of the store">
        {modules.map(m => <li><span class="dir-ecom-module-name">{m.name}</span><span class="dir-ecom-module-n">{plural(m.cards, "card")}</span></li>)}
      </ul>
      <p class="dir-ecom-tiers">Each card has a trust level from 1 to 4: 1 is the platform's own guides, 2 is large studies, 3 is a named seller with proof, 4 is opinion.</p>
    </>
  );
}

type AskState =
  | { status: "idle" }
  | { status: "loading"; asked: string }
  | { status: "done"; asked: string; answer: AskAnswer }
  | { status: "error"; message: string };

function AskSection(props: { lead: AgentCardData | null; library: Library | null }) {
  const [q, setQ] = useState("");
  const [market, setMarket] = useState("");
  const [hint, setHint] = useState("");
  const [state, setState] = useState<AskState>({ status: "idle" });
  const latest = useRef(0);
  const moduleName = (code: string) => props.library?.modules.find(m => m.code === code)?.name ?? code;

  // Asks only when the visitor presses Enter or the button, never on every key.
  const ask = (e: Event) => {
    e.preventDefault();
    const question = q.trim();
    if (question.length < MIN_Q) { setHint("Ask a question of a few words, like \"how many new ads should I test each week\"."); return; }
    setHint("");
    const run = ++latest.current;
    setState({ status: "loading", asked: question });
    const params = new URLSearchParams({ q: question.slice(0, MAX_Q), k: "5" });
    if (market) params.set("jurisdiction", market);
    api<AskAnswer>(`/api/knowledge/${VERTICAL}/ask?${params}`).then(
      answer => { if (run === latest.current) setState({ status: "done", asked: question, answer }); },
      err => {
        if (run !== latest.current) return;
        const message = err instanceof ApiError && err.status === 404
          ? "The library is not open yet. Ask an agent on the team instead: it works in your own AI."
          : err?.message || "We could not reach the library. Try again in a moment.";
        setState({ status: "error", message });
      });
  };

  const lead = props.lead;
  const askLead = lead
    ? <>Ask <Link href={`/agents/${lead.id}`} class="dir-inline-link">{lead.name}</Link> to research it in your own AI, and to say which sources it used.</>
    : <>Ask an agent on the team to research it in your own AI, and to say which sources it used.</>;

  return (
    <section class="dir-section" id="ecom-ask" aria-labelledby="ecom-ask-title">
      <h2 id="ecom-ask-title">Ask the library</h2>
      <p class="dir-ecom-lede">Ask a question about your store in your own words. You get the cards that answer it, with their sources.</p>
      <form class="dir-ecom-ask" role="search" onSubmit={ask}>
        <label class="dir-search-box dir-ecom-ask-box">
          <span class="dir-visually-hidden">Your question</span>
          <svg class="dir-search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="square" /></svg>
          <input id="ecom-q" class="input dir-search-input" type="search" value={q} maxLength={MAX_Q} autoComplete="off" enterKeyHint="search"
            placeholder="When should I refresh my ads?" onInput={e => { setQ((e.target as HTMLInputElement).value); if (hint) setHint(""); }} />
        </label>
        <div class="dir-ecom-ask-row">
          <Field label="Market" id="ecom-market"><Select id="ecom-market" value={market} options={MARKETS} onValue={setMarket} /></Field>
          <Button type="submit" busy={state.status === "loading"}>Ask</Button>
        </div>
      </form>
      {hint && <p class="field-error dir-ecom-hint" role="alert">{hint}</p>}

      <div class="dir-ecom-results" aria-live="polite">
        {state.status === "loading" && <p class="dir-result-line">Looking for cards on "{state.asked}"…</p>}
        {state.status === "error" && <Notice tone="info" title="No answer this time">{state.message}</Notice>}
        {state.status === "done" && (() => {
          const { answer, asked } = state;
          const missing = answer.missing.slice(0, 6);
          return (
            <>
              {answer.enough ? (
                <p class="dir-result-line">{plural(answer.cards.length, "card")} for "{asked}", best match first</p>
              ) : (
                <Notice tone="info" title="The library has no clear answer to this">
                  {missing.length > 0 && <>It has nothing yet on {missing.join(", ")}. </>}{askLead}
                </Notice>
              )}
              {!answer.enough && answer.cards.length > 0 && <h3 class="dir-ecom-subhead">The closest cards, a weak match</h3>}
              {answer.cards.length > 0 && (
                <ol class="dir-ecom-answers">
                  {answer.cards.map(c => <li><AnswerCard card={c} moduleName={moduleName} /></li>)}
                </ol>
              )}
            </>
          );
        })()}
      </div>
    </section>
  );
}

function AnswerCard(props: { card: AskCard; moduleName: (code: string) => string }) {
  const c = props.card;
  const s = c.source;
  return (
    <article class="dir-ecom-answer">
      <div class="dir-ecom-answer-tags">
        <Badge>Tier {c.tier}: {TIER_SHORT[c.tier] ?? "source"}</Badge>
        {c.modules[0] && <Badge>{props.moduleName(c.modules[0])}</Badge>}
        {c.stale && <Badge tone="warn">STALE</Badge>}
      </div>
      <h3>{c.claim}</h3>
      <p class="dir-ecom-answer-body">{c.body}</p>
      {c.numbers.length > 0 && <p class="dir-ecom-answer-numbers"><b>Numbers:</b> {c.numbers.join("; ")}</p>}
      {(c.conditions || c.fails_when) && (
        <dl class="dir-ecom-when">
          {c.conditions && <div><dt>Holds when</dt><dd>{c.conditions}</dd></div>}
          {c.fails_when && <div><dt>Fails when</dt><dd>{c.fails_when}</dd></div>}
        </dl>
      )}
      {c.stale && <p class="dir-ecom-stale">Past its review date. Check it before you rely on it.</p>}
      {s && (
        <p class="dir-ecom-source">
          Source: {s.url ? <a href={s.url} target="_blank" rel="noopener">{s.title}</a> : s.title}
          {s.author ? `, ${s.author}` : ""}{s.date ? ` (${dateWords(s.date)})` : ""}
        </p>
      )}
    </article>
  );
}
