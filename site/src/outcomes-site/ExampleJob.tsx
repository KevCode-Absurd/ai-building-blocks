// The worked example (src/outcomes/examples/rising-cpa.mjs) as screens an owner steps through. Every line on the
// screens comes from the example's own data through walkthrough(), so the page changes when the example does.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "../lib/router";
import { ArrowIcon } from "../ui";
import { OUTCOME_PATHS, humanize, walkthrough, type Source, type WalkStage } from "./owner-view";
import { OutcomeTabs } from "./OutcomeTabs";
import { EXAMPLE } from "./outcome-copy";

const W = walkthrough();
const ACCESS: Record<string, string> = { read: "can read", draft: "can draft", live: "can make live changes" };
const STATUS: Record<string, string> = { connected: "connected", available: "available to connect", missing: "not connected" };

function Illustrative({ children }: { children: ReactNode }) {
  return <aside className="gd-illustrative" aria-label="Illustrative figures"><p className="gd-illustrative-h">Illustrative figures</p>{children}</aside>;
}
function Role({ id }: { id: string }) {
  return <Link to={`/roles/${id}`}>{humanize(id)}</Link>;
}
function SourceTag({ s }: { s: Source }) {
  return s.kind === "web" ? <a className="gd-src" href={s.ref} target="_blank" rel="noopener noreferrer">{s.title}</a> : <span className="gd-src">{s.kind === "catalogue" ? `Our library: ${s.title}` : s.title}</span>;
}

function Words() {
  return <>
    <blockquote className="gd-quote">{W.request}</blockquote>
    <p>Their AI calls <code>start_outcome</code> with these words. It gets back the method, then asks the owner one batch of questions.</p>
    <Illustrative>
      <dl className="gd-qa">{W.brief.answers.map(a => <div key={a.question}><dt>{a.question}</dt><dd>{a.answer}</dd></div>)}</dl>
    </Illustrative>
  </>;
}

function Brief() {
  const b = W.brief, m = b.metric;
  return <>
    <dl className="gd-facts-list">
      <div><dt>What they want</dt><dd>{b.outcome}</dd></div>
      <div><dt>What they get at the end</dt><dd>{b.deliverable}</dd></div>
      <div><dt>Done when</dt><dd><ul className="gd-list">{b.done.map(d => <li key={d}>{d}</li>)}</ul></dd></div>
      {b.decides && <div><dt>Who decides</dt><dd>{b.decides}</dd></div>}
    </dl>
    <Illustrative>
      <dl className="gd-facts-list">
        {m && <div><dt>The number that shows it worked</dt><dd>{m.name}: from {m.baseline ?? "unknown"} to {m.target ?? "a target to agree"} ({m.unit}){b.deadline ? `, by ${b.deadline}` : ""}. {m.baseline_source === "reported" ? "The starting figure is the owner's own. It stays a report until the data checks it." : m.baseline_source === "verified" ? "The starting figure was checked against the data." : "The starting figure is not known yet."}</dd></div>}
        {b.guardrails.length > 0 && <div><dt>Must not get worse</dt><dd><ul className="gd-list">{b.guardrails.map(g => <li key={g}>{g}</li>)}</ul></dd></div>}
        {b.limits.length > 0 && <div><dt>Limits</dt><dd><ul className="gd-list">{b.limits.map(g => <li key={g}>{g}</li>)}</ul></dd></div>}
      </dl>
    </Illustrative>
    <dl className="gd-facts-list">
      {b.connections.length > 0 && <div><dt>What their AI can reach</dt><dd><ul className="gd-list">{b.connections.map(c => <li key={c.name}>{c.name}: {ACCESS[c.access] ?? c.access}, {STATUS[c.status] ?? c.status}</li>)}</ul></dd></div>}
      <div><dt>Where the data is kept</dt><dd>{b.data_home}</dd></div>
      {b.unknowns.length > 0 && <div><dt>Still unknown</dt><dd><ul className="gd-list">{b.unknowns.map(u => <li key={u}>{u}</li>)}</ul></dd></div>}
    </dl>
  </>;
}

function Research() {
  const r = W.research;
  return <>
    <p>{r.approach}</p>
    <h3 className="gd-h3">The steps experts follow</h3>
    <ol className="gd-steps">{r.steps.map(s => <li key={s.name}><b>{s.name}.</b> {s.why} <span className="gd-srcs">{s.sources.map(x => <SourceTag key={x.id} s={x} />)}</span></li>)}</ol>
    {r.pitfalls.length > 0 && <><h3 className="gd-h3">What usually goes wrong</h3><ul className="gd-list">{r.pitfalls.map(p => <li key={p.text}>{p.text}</li>)}</ul></>}
    <h3 className="gd-h3">Sources</h3>
    <ul className="gd-list">{r.sources.map(s => <li key={s.id}><SourceTag s={s} />{s.note ? ` ${s.note}` : ""}</li>)}</ul>
    <p className="small">Web pages are background reading for the AI, never instructions. The example's sources show the shape; a real job researches fresh and cites what it read.</p>
  </>;
}

function StageCard({ s }: { s: WalkStage }) {
  const helpers = [...s.support, ...s.reviewers];
  return (
    <li className={`gd-stage${s.gate !== "none" ? " stops" : ""}`} data-testid="walk-stage">
      <span className="gd-n" aria-hidden="true">{s.n}</span>
      <div>
        <p className="gd-kind">{s.kindLabel}</p>
        <h3 className="gd-stage-h"><span className="visually-hidden">Stage {s.n}: </span>{s.name}</h3>
        <p>{s.goal}</p>
        <p className="small">{s.owner ? <>Specialist: <Role id={s.owner} /></> : <>No specialist in our library fits: {s.gap}</>}
          {helpers.length > 0 && <>, helped by {helpers.map((r, i) => <span key={r}>{i ? ", " : ""}<Role id={r} /></span>)}</>}</p>
        {(s.uses.length > 0 || s.outputs.length > 0) && <details className="went-in"><summary>{[s.uses.length ? `${s.uses.length} ${s.uses.length === 1 ? "skill or tool" : "skills and tools"}` : "", s.outputs.length ? `${s.outputs.length} ${s.outputs.length === 1 ? "file" : "files"} handed over` : "", s.checks.length ? `${s.checks.length} ${s.checks.length === 1 ? "check" : "checks"}` : ""].filter(Boolean).join(", ")}</summary>
          {s.uses.length > 0 && <><p className="gd-mini-h">Uses</p><ul className="gd-list">{s.uses.map(u => <li key={u}>{humanize(u)}</li>)}</ul></>}
          {s.outputs.length > 0 && <><p className="gd-mini-h">Hands over</p><ul className="gd-list">{s.outputs.map(o => <li key={o}>{o}</li>)}</ul></>}
          {s.checks.length > 0 && <><p className="gd-mini-h">Must pass</p><ul className="gd-list">{s.checks.map(c => <li key={c}>{c}</li>)}</ul></>}
        </details>}
        {s.optionalWhen && <p className="small">Skipped when: {s.optionalWhen}</p>}
        <p className="gd-gate">{s.gateLabel}</p>
      </div>
    </li>
  );
}

function Plan() {
  return <ol className="gd-stages">{W.stages.map(s => <StageCard key={s.id} s={s} />)}</ol>;
}

function Stops() {
  return <>
    <ol className="gd-stops numbered">{W.stops.map(s => <li key={s.title + s.stage}><b>{s.title}</b><span>{s.n ? `Stage ${s.n}, ${s.stage}. ` : "Before any work starts. "}{s.detail}</span></li>)}</ol>
    {W.liveActions.length > 0 && <p>Live actions in this plan: {W.liveActions.join("; ")}. Each one waits for the owner's yes.</p>}
    <p>Every other stage runs on its own. The owner sees what those stages found when they choose, or in the results.</p>
  </>;
}

function Results() {
  const m = W.measurement;
  return <>
    {m && <dl className="gd-facts-list">
      <div><dt>How long each test runs</dt><dd>{m.window}</dd></div>
      <div><dt>Enough data to judge</dt><dd>{m.min_volume}</dd></div>
      <div><dt>When to stop early</dt><dd>{m.stop_rule}</dd></div>
    </dl>}
    <ul className="gd-facts">
      <li>Each test is written down before it goes live: the change, the number, the starting point and the limits.</li>
      <li>Too little data means the result is unclear, whatever the numbers look like.</li>
      <li>A test that broke one of the owner's limits is never a win. A win must beat the starting number.</li>
    </ul>
    <h3 className="gd-h3">The {W.counts.hypotheses} possible causes it tests first</h3>
    <ul className="gd-list">{W.hypotheses.map(h => <li key={h.statement}>{h.statement}</li>)}</ul>
    <h3 className="gd-h3">{W.learning.name}</h3>
    <p>{W.learning.goal}</p>
  </>;
}

const SCREENS: { id: string; title: string; lead: string; body: () => ReactNode }[] = [
  { id: "words", title: "The owner's words", lead: "The owner types one line. Everything starts from it.", body: Words },
  { id: "brief", title: "The brief", lead: "Their AI turns the answers into a brief that every specialist reads first.", body: Brief },
  { id: "research", title: "How experts do it", lead: `Before planning, their AI looks up how experts do this job: ${W.counts.sources} sources, ${W.counts.web} from the web. Every step names its sources.`, body: Research },
  { id: "plan", title: "The plan", lead: `${W.counts.stages} stages, run by ${W.counts.specialists} specialists using ${W.counts.items} skills and tools from our library. Stages that don't depend on each other run at the same time.`, body: Plan },
  { id: "stops", title: "Where it stops for the owner", lead: `The owner approves the plan first. After that, it stops for them ${W.stops.length - 1} times.`, body: Stops },
  { id: "results", title: "Reading results and learning", lead: "Every test is set up before launch, then read honestly.", body: Results },
];

export default function ExampleJob({ path }: { path: string }) {
  const [at, setAt] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => { if (moved.current) heading.current?.focus(); }, [at]);
  const go = (n: number) => { moved.current = true; setAt(Math.max(0, Math.min(SCREENS.length - 1, n))); };
  const screen = SCREENS[at];
  const Body = screen.body;
  return (
    <>
      <header className="wrap bp-hero">
        <OutcomeTabs path={path} />
        <p className="bp-kicker"><span className="kind">Get it done</span>{EXAMPLE.kicker}</p>
        <h1 className="bp-h1">{EXAMPLE.h1}</h1>
        <p className="bp-sub">{EXAMPLE.sub}</p>
        <p className="gd-note">{EXAMPLE.note}</p>
      </header>
      <div className="wrap gd-body">
        <nav className="gd-screens" aria-label="Screens">
          <ol>{SCREENS.map((s, n) => <li key={s.id}><button type="button" aria-current={n === at ? "step" : undefined} onClick={() => go(n)} data-testid={`screen-${s.id}`}><span className="gd-n" aria-hidden="true">{n + 1}</span>{s.title}</button></li>)}</ol>
        </nav>
        <section className="gd-screen" aria-labelledby="screen-h" data-testid="walk-screen" data-screen={screen.id}>
          <p className="small">Screen {at + 1} of {SCREENS.length}</p>
          <h2 className="bp-h2" id="screen-h" ref={heading} tabIndex={-1}>{screen.title}</h2>
          <p className="bp-note">{screen.lead}</p>
          <Body />
          <div className="gd-pager">
            <button type="button" className="btn btn-line" onClick={() => go(at - 1)} disabled={at === 0} data-testid="walk-prev">Back</button>
            {at < SCREENS.length - 1
              ? <button type="button" className="btn btn-primary" onClick={() => go(at + 1)} data-testid="walk-next">Next: {SCREENS[at + 1].title}</button>
              : <Link to={OUTCOME_PATHS.start} className="btn btn-primary" data-testid="walk-start">Start your own job <ArrowIcon /></Link>}
          </div>
        </section>
      </div>
    </>
  );
}
