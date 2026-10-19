// Apps: the top of the ladder. Example apps shown as click-through tours (nothing on them runs),
// and the app starter pack that turns skills and workflows into an app. Loads only when someone opens /apps.
import { useEffect, useState } from "react";
import { ArrowIcon } from "../ui";
import { Code, Section } from "../BlockPage";
import { Link } from "../lib/router";
import { type Catalogue, pathOf } from "../lib/data";
import { download } from "../lib/handoff";
import { APPS, RUNGS, SETUP_STEPS, appOf, type App } from "./data";
import { SCREENS } from "./screens";
import { FILES, STAGES, START_PROMPT, starterZip } from "./starter";
import "./apps.css";

const TITLE = "AI Blocks · Making humanity AI native";
const useTitle = (t: string) => useEffect(() => { document.title = `${t} · AI Blocks`; return () => { document.title = TITLE; }; }, [t]);
const Back = ({ to = "/apps", label = "Apps" }: { to?: string; label?: string }) => <Link to={to} className="back"><span aria-hidden="true">←</span> {label}</Link>;

function Ladder() {
  return (
    <ol className="ap-ladder" data-testid="ladder">
      {RUNGS.map((r, i) => (
        <li key={r.id} className={r.id === "app" ? "top" : ""}>
          <Link to={r.to}><span className="ap-n">{i + 1}</span><b>{r.name}</b><span className="ap-line">{r.line}</span><span className="ap-here">{r.here}</span></Link>
        </li>
      ))}
    </ol>
  );
}

function AppCard({ a }: { a: App }) {
  return (
    <Link to={`/apps/${a.slug}`} className="card ap-card" data-testid="app-card" data-slug={a.slug}>
      <span className="meta"><span className="kind">{a.short.toLowerCase()}</span><span className="type">{a.agents.has ? "Uses an agent" : "No agents"}</span></span>
      <span className="nm">{a.name}</span>
      <span className="ap-peek">{a.headline}</span>
      <span className="view">Take the tour <ArrowIcon size={12} /></span>
    </Link>
  );
}

function AppsIndex() {
  useTitle("Apps");
  const of = (g: App["group"]) => APPS.filter((a) => a.group === g);
  return (
    <main className="bp ap" data-testid="apps-index">
      <header className="wrap bp-hero">
        <Link to="/" className="back"><span aria-hidden="true">←</span> Home</Link>
        <p className="bp-kicker"><span className="kind">Apps</span>The top of the ladder</p>
        <h1 className="bp-h1">Turn the skills you use into an app your team signs in to</h1>
        <p className="bp-sub">Start with one prompt. Save it as a skill, run it on a schedule, chain skills into a workflow. When your team does the same job every week, put it behind a screen with sign-in, saved work and a button for each job. Take the tour of real apps built this way, then build yours with the starter pack.</p>
        <div className="bp-actions">
          <Link to="/apps/starter-pack" className="btn btn-primary">Get the app starter pack <ArrowIcon /></Link>
          <Link to="/apps#examples" className="btn btn-dark">See example apps</Link>
        </div>
      </header>
      <div className="wrap ap-body">
        <Section id="ladder" title="Six steps, from one message to an app" lead="Climb only as far as your job needs. An app doesn't need an agent: none of the apps below uses one." wide>
          <Ladder />
        </Section>

        <Section id="examples" title="Take the tour of a finished app" lead="Click through every screen. Nothing on them runs, so you can't break anything." wide>
          <h3 className="sub-h">Built for a real business</h3>
          <div className="grid">{of("example").map((a) => <AppCard key={a.slug} a={a} />)}</div>
          <h3 className="sub-h">Mercatura: three apps that work on their own</h3>
          <p className="bp-note">Each one does one end job. Install the open-source starter and you get all three.</p>
          <div className="grid">{of("mercatura").map((a) => <AppCard key={a.slug} a={a} />)}</div>
          <h3 className="sub-h">And the same three, combined</h3>
          <p className="bp-note">Build apps on their own first, then combine them so they share one brand brain and one sign-in.</p>
          <div className="grid">{of("combined").map((a) => <AppCard key={a.slug} a={a} />)}</div>
        </Section>

        <Section id="starter" title="Build your own with the app starter pack" lead="A folder you give to Claude Code. It asks you ten questions, writes a one-page brief, then builds one small stage at a time." wide>
          <StageList />
          <p><Link to="/apps/starter-pack" className="btn btn-primary">Get the starter pack <ArrowIcon /></Link></p>
        </Section>
      </div>
    </main>
  );
}

function StageList() {
  return (
    <ol className="ap-stages">
      {STAGES.map((s) => <li key={s.file}><span className="ap-n">{s.n}</span><b>{s.name}</b><span>{s.get}</span></li>)}
    </ol>
  );
}

/** The click-through: a framed screen, the list of screens beside it, and Back / Next. */
function Tour({ a }: { a: App }) {
  const [i, setI] = useState(0);
  const s = a.screens[i];
  const Screen = SCREENS[s.id];
  const app = a.name.replace(/^Mercatura ?/, "") || "All three apps";
  return (
    <div className="ap-tour" data-testid="tour">
      <div className="mc" role="img" aria-label={`${a.name}, the ${s.name} screen, with example data`}>
        <div className="mc-bar" aria-hidden="true"><i /><i /><i /><span className="mc-url">mercatura.example/{a.slug.replace(/^mercatura-?/, "") || "all"}/{s.id}</span></div>
        <div className="mc-app">
          <nav className="mc-side" aria-hidden="true">
            <span className="mc-logo"><span className="mc-serif">Mercatura</span><small>{app}</small></span>
            {a.screens.map((x, n) => <span key={x.id} className={n === i ? "on" : ""}>{x.name}</span>)}
            {a.example && <span className="mc-badge">Example data</span>}
          </nav>
          <div className="mc-main" data-testid="tour-screen" data-screen={s.id}><Screen /></div>
        </div>
      </div>
      <aside className="ap-tour-side">
        <p className="ap-count mono">Screen {i + 1} of {a.screens.length}</p>
        <h3 className="ap-tour-h" data-testid="tour-title">{s.name}</h3>
        <p className="ap-tour-p">{s.purpose}</p>
        <h4>What you can do here</h4>
        <ul>{s.actions.map((x) => <li key={x}>{x}</li>)}</ul>
        <div className="ap-tour-nav">
          <button className="btn btn-dark btn-sm" disabled={i === 0} onClick={() => setI(i - 1)} data-testid="tour-back">Back</button>
          <button className="btn btn-primary btn-sm" disabled={i === a.screens.length - 1} onClick={() => setI(i + 1)} data-testid="tour-next">Next screen <ArrowIcon size={12} /></button>
        </div>
        <div className="ap-jump" role="tablist" aria-label="Screens">
          {a.screens.map((x, n) => <button key={x.id} role="tab" aria-selected={n === i} onClick={() => setI(n)}>{x.name}</button>)}
        </div>
      </aside>
    </div>
  );
}

function AppPage({ a, c }: { a: App; c: Catalogue | null }) {
  useTitle(a.name);
  const blocks = c ? a.blocks.map((s) => c.bySlug[s]).filter(Boolean) : [];
  const parts = (a.parts ?? []).map(appOf).filter(Boolean) as App[];
  const inside = APPS.find((x) => x.parts?.includes(a.slug));
  const toc: [string, string][] = [["tour", "The tour"], ["agents", "Does it use agents?"], ...(parts.length ? [["parts", "The apps inside"] as [string, string]] : []), ["built", "How it was built"], ...(a.repo ? [["install", "Install it"] as [string, string]] : []), ["blocks", "Start smaller"], ...(a.stack.length ? [["stack", "What it runs on"] as [string, string]] : []), ["next", "Build your own"]];
  return (
    <main className="bp ap" data-testid="app-page" data-slug={a.slug}>
      <header className="wrap bp-hero">
        <Back />
        <p className="bp-kicker"><span className="kind">{a.short.toLowerCase()}</span>{a.screens.length} screens to click through{a.repo ? <> · <a href={a.repo} target="_blank" rel="noopener">open source</a></> : null}</p>
        <h1 className="bp-h1">{a.headline}</h1>
        <p className="bp-sub"><b>{a.name}.</b> {a.summary}</p>
        {a.example && <p className="ap-example" data-testid="example-note">Example data. We built this app for a real business, then took out every name, product and number. Sprout is our example business; the numbers are made up to show the screens.</p>}
        {inside && <p className="ap-example">Part of <Link to={`/apps/${inside.slug}`}>{inside.name}</Link>, which combines it with the other two apps.</p>}
      </header>
      <div className="wrap ap-body">
        <section className="bp-sec wide" id="tour" aria-label="The tour"><Tour a={a} /></section>
        <div className="bp-body ap-lower">
          <nav className="bp-toc" aria-label="On this page"><p>On this page</p>{toc.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
          <div className="bp-main">
            <Section id="agents" title={a.agents.has ? "Yes, it uses an agent" : "No, it doesn't use agents"}>
              <p className="prose big" data-testid="agents-answer">{a.agents.why}</p>
              <p className="bp-note">Most apps don't need one. An agent earns its place only when the AI must pick its own next steps.</p>
            </Section>
            {parts.length > 0 && (
              <Section id="parts" title="Three apps, one brand brain" lead="Each one works on its own. Together they share the brand brain, personas, offers, sign-in and spend caps.">
                <div className="grid">{parts.map((p) => <AppCard key={p.slug} a={p} />)}</div>
              </Section>
            )}
            <Section id="built" title="How it was built, step by step" lead="Each step worked on its own before the next one started.">
              <ol className="num-list" data-testid="built-steps">{a.ladder.map((r, n) => <li key={r.step}><span className="n">{n + 1}</span><span><b>{r.step}.</b> {r.what}</span></li>)}</ol>
            </Section>
            {a.repo && (
              <Section id="install" title="Install it on your computer" lead="It runs for one person on your own computer. Mock mode means nothing costs money until you say so.">
                <ol className="num-list">{SETUP_STEPS.map((r, n) => <li key={r.step}><span className="n">{n + 1}</span><span><b>{r.step}.</b> {r.what}</span></li>)}</ol>
                <p><a className="btn btn-primary" href={a.repo} target="_blank" rel="noopener" data-testid="repo-link">Get it on GitHub <ArrowIcon /></a></p>
                <p className="bp-note">Not built yet: hosted team sign-in, roles and billing. Stages 4, 5 and 8 of the starter pack add them.</p>
              </Section>
            )}
            <Section id="blocks" title="Start smaller: the same jobs as blocks" lead="Each of these does one job this app does. Use them in your AI today, no app needed.">
              {blocks.length ? <ul className="ap-blocks">{blocks.map((b) => <li key={b.slug}><Link to={pathOf(b)}>{b.name}</Link><span>{b.summary}</span></li>)}</ul> : <p className="small">Loading…</p>}
            </Section>
            {a.stack.length > 0 && (
              <Section id="stack" title="What it runs on">
                <dl className="ap-stack">{a.stack.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              </Section>
            )}
            <Section id="next" title="Build one like it" lead="The starter pack walks Claude Code through the same steps with your own skills.">
              <p><Link to="/apps/starter-pack" className="btn btn-primary">Get the app starter pack <ArrowIcon /></Link></p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}

function StarterPage({ toast }: { toast: (m: string) => void }) {
  useTitle("App starter pack");
  const get = async () => { download(await starterZip(), "app-starter.zip"); toast("Downloaded app-starter.zip"); };
  return (
    <main className="bp ap" data-testid="starter-page">
      <header className="wrap bp-hero">
        <Back />
        <p className="bp-kicker"><span className="kind">starter pack</span>{FILES.length} files · for Claude Code</p>
        <h1 className="bp-h1">Turn your skills and workflows into an app your team signs in to</h1>
        <p className="bp-sub">Give this folder to Claude Code. It asks you ten questions, writes a one-page brief, and waits for your OK. Then it builds one small stage at a time and stops after each, so you can try it. Sign-in, teams and roles come when you need them. Agents only if the job needs one.</p>
        <div className="bp-actions">
          <button className="btn btn-primary" onClick={get} data-testid="starter-download">Download the starter pack <ArrowIcon /></button>
          <a href="#prompt" className="btn btn-dark">Copy the prompt</a>
        </div>
      </header>
      <div className="wrap bp-body">
        <nav className="bp-toc" aria-label="On this page"><p>On this page</p>{[["how", "How to use it"], ["stages", "The stages"], ["prompt", "The prompt"], ["rules", "Why it stays small"], ["files", "What's in the folder"]].map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
        <div className="bp-main">
          <Section id="how" title="How to use it">
            <ol className="num-list">
              {["Download the folder and unzip it next to your skills: any folder with SKILL.md files, or a workflow you downloaded from the builder.", "Open the folder in Claude Code. In a Claude Project, upload the folder instead.", "Paste the prompt below. Claude lists your skills and asks its questions in one message, each with a suggested answer.", "Read the brief it writes. Say yes, or change it. No code is written before you say yes.", "Try each stage when Claude stops. Say “next stage” when it works."].map((s, n) => <li key={n}><span className="n">{n + 1}</span><span>{s}</span></li>)}
            </ol>
          </Section>
          <Section id="stages" title="Nine stages. Stop at the one that does your job." lead="Many apps stop at stage 3. Stage 5 makes it multiplayer. Stage 7 is optional.">
            <StageList />
          </Section>
          <Section id="prompt" title="The prompt">
            <Code name="START-HERE.md" text={START_PROMPT} toast={toast} />
          </Section>
          <Section id="rules" title="Why the app stays small">
            <ul className="checks">
              <li>Questions first, then a one-page brief you approve. No code before that.</li>
              <li>One stage at a time, each with tests and steps to try it.</li>
              <li>Your skills stay as SKILL.md files the app reads, so a better skill makes a better app.</li>
              <li>Mock mode and spend caps at 0 until you turn them up.</li>
              <li>No keys in the code. It asks before anything paid, public or live.</li>
              <li>Teams are deny by default: a test proves one team can't see another's work.</li>
            </ul>
          </Section>
          <section className="bp-sec terms" id="files" aria-labelledby="files-h">
            <h2 className="bp-h2" id="files-h">What's in the folder</h2>
            <dl>{FILES.map(([k, v]) => <div key={k}><dt><code>{k}</code></dt><dd>{firstLine(v)}</dd></div>)}</dl>
            <p className="hiw-end"><button className="btn btn-primary" onClick={get}>Download the starter pack <ArrowIcon /></button></p>
          </section>
        </div>
      </div>
    </main>
  );
}
/** The line under a file's title, or its "You get" line. */
function firstLine(text: string) {
  const get = /^\*\*You get:\*\* (.+)$/m.exec(text);
  if (get) return get[1];
  const line = text.split("\n").map((l) => l.trim()).find((l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("---"));
  return (line ?? "").replace(/\*\*/g, "");
}

export default function AppsPage({ path, c, toast }: { path: string; c: Catalogue | null; toast: (m: string) => void }) {
  const slug = path.split("/").filter(Boolean)[1];
  if (!slug) return <AppsIndex />;
  if (slug === "starter-pack") return <StarterPage toast={toast} />;
  const a = appOf(slug);
  if (!a) {
    return (
      <main className="wrap bp-missing" data-testid="app-missing">
        <h1 className="bp-h1">That app isn't here</h1>
        <p className="bp-sub">Every app is on the Apps page.</p>
        <Link to="/apps" className="btn btn-primary">See all apps <ArrowIcon /></Link>
      </main>
    );
  }
  return <AppPage key={a.slug} a={a} c={c} />;
}
