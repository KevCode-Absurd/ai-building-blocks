// Apps: the top of the ladder. One finished example app to click through (a saved copy at /example-app/, where
// nothing runs), and the app starter pack that turns skills and workflows into an app. Loads only when someone opens /apps.
import { useEffect } from "react";
import { ArrowIcon } from "../ui";
import { Code, Section } from "../BlockPage";
import { Link } from "../lib/router";
import { download } from "../lib/handoff";
import { AREAS, REPO, SETUP_STEPS, TOUR, type Area } from "./data";
import { FILES, STAGES, START_PROMPT, starterZip } from "./starter";
import "./apps.css";

const TITLE = "Free AI Skills & Custom Workflow Builder | AI Blocks";
const useTitle = (t: string) => useEffect(() => { document.title = `${t} · AI Blocks`; return () => { document.title = TITLE; }; }, [t]);
const Back = () => <Link to="/apps" className="back"><span aria-hidden="true">←</span> Apps</Link>;

function AreaCard({ a }: { a: Area }) {
  return (
    <a href={`${TOUR}${a.path}/`} target="_blank" rel="noopener" className="ap-area" data-testid="app-area" data-area={a.id}>
      <img src={`/example-app-shots/${a.id}.webp`} alt={`The ${a.name.toLowerCase()} screen of the example app`} loading="lazy" width={720} height={450} />
      <span className="ap-area-t"><b>{a.name}</b><span>{a.line}</span></span>
    </a>
  );
}

function AppsIndex() {
  useTitle("Apps");
  return (
    <main className="bp ap" data-testid="apps-index">
      <header className="wrap bp-hero">
        <Link to="/" className="back"><span aria-hidden="true">←</span> Home</Link>
        <p className="bp-kicker"><span className="kind">Apps</span>The top of the ladder</p>
        <h1 className="bp-h1">See a finished AI app, then build your own</h1>
        <p className="bp-sub">Mercatura is the app we built from these skills to make ads, landing pages and SEO for one brand. Click through all of it with its saved study data: customer research, scripts, image ads, avatars, reference ads and pages. Then build yours with the starter pack.</p>
        <div className="bp-actions">
          <a href={TOUR} target="_blank" rel="noopener" className="btn btn-primary" data-testid="tour-open">Open the example app <ArrowIcon /></a>
          <Link to="/apps/starter-pack" className="btn btn-dark">Get the app starter pack</Link>
        </div>
      </header>
      <div className="wrap ap-body">
        <a href={TOUR} target="_blank" rel="noopener" className="ap-shot" data-testid="tour-shot">
          <img src="/example-app-shots/home.webp" alt="The home screen of the example app: what to make next for the brand, and the work waiting for you" width={1440} height={900} />
        </a>
        <p className="ap-example" data-testid="example-note">The app opens in a new tab and works like the real thing, but nothing runs: you can click every screen, and nothing is made or saved. Its example brand is Grüns, a greens gummy we used as a study brand. The customer research is simulated; the scripts, ads and pages are what the app made from it. We're not connected with Grüns.</p>

        <Section id="workflow-to-app" title="Put your workflow behind a form and a button" lead="Use the builder to choose the job first. The starter pack then gives your AI a plan for the software around it." wide>
          <ol className="num-list">{[
            ["Choose and try the workflow.", "Download it from the builder. Run it with a small set of your own facts and check that the result is useful."],
            ["Build the smallest screen.", "Put that workflow folder next to the app starter pack. Ask your coding AI to read HANDOFF.md and workflow.json, then make one form and a results screen."],
            ["Save and run the steps.", "The app stores your inputs, runs the skills on its server and shows each result. Failed steps can be retried; actions that need approval wait."],
            ["Connect one data source.", "Start with an uploaded file. Later, connect an account through the service's supported API. The app reads the data it needs and records when it was refreshed."],
          ].map(([title, text], n) => <li key={title}><span className="n">{n + 1}</span><span><b>{title}</b> {text}</span></li>)}</ol>
          <p className="bp-note">Mercatura shows what this can look like for marketing. Its example is a saved tour. Your own app needs a running server and your own connections before it can make work or read live data.</p>
          <div className="bp-actions"><Link to="/#build" className="btn btn-dark">Choose a workflow</Link><Link to="/apps/starter-pack" className="btn btn-primary">Build your app</Link></div>
        </Section>

        <Section id="inside" title="What's inside" lead="Open any part of the app straight away." wide>
          <div className="ap-areas">{AREAS.map((a) => <AreaCard key={a.id} a={a} />)}</div>
        </Section>

        <Section id="starter" title="Build your own with the app starter pack" lead="A folder you give to your AI coding assistant. It asks you ten questions, writes a one-page brief, then builds one small stage at a time." wide>
          <StageList />
          <p><Link to="/apps/starter-pack" className="btn btn-primary" data-testid="starter-link">Get the starter pack <ArrowIcon /></Link></p>
        </Section>

        <Section id="install" title="Or start from our open-source app" lead="The Mercatura starter is the same kind of app with no brand in it. It runs for one person on your own computer, in mock mode, so nothing costs money until you say so." wide>
          <ol className="num-list">{SETUP_STEPS.map((r, n) => <li key={r.step}><span className="n">{n + 1}</span><span><b>{r.step}.</b> {r.what}</span></li>)}</ol>
          <p><a className="btn btn-dark" href={REPO} target="_blank" rel="noopener" data-testid="repo-link">Get it on GitHub <ArrowIcon /></a></p>
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

function StarterPage({ toast }: { toast: (m: string) => void }) {
  useTitle("App starter pack");
  const get = async () => { download(await starterZip(), "app-starter.zip"); toast("Downloaded app-starter.zip"); };
  return (
    <main className="bp ap" data-testid="starter-page">
      <header className="wrap bp-hero">
        <Back />
        <p className="bp-kicker"><span className="kind">starter pack</span>{FILES.length} files · for your AI coding assistant</p>
        <h1 className="bp-h1">Turn your skills and workflows into an app your team signs in to</h1>
        <p className="bp-sub">Open this folder in an AI coding assistant that can read and edit files. It asks you ten questions, writes a one-page brief, and waits for your OK. Then it builds one small stage at a time and stops after each, so you can try it. Sign-in, teams and roles come when you need them. Agents only if the job needs one.</p>
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
              {["Download the folder and unzip it next to your skills: any folder with SKILL.md files, or a workflow you downloaded from the builder.", "Open the folder in your AI coding assistant, or upload its files to a chat that supports attachments.", "Paste the prompt below. Your AI lists your skills and asks its questions in one message, each with a suggested answer.", "Read the brief it writes. Say yes, or change it. No code is written before you say yes.", "Try each stage when your AI stops. Say “next stage” when it works."].map((s, n) => <li key={n}><span className="n">{n + 1}</span><span>{s}</span></li>)}
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

export default function AppsPage({ path, toast }: { path: string; toast: (m: string) => void }) {
  const slug = path.split("/").filter(Boolean)[1];
  if (slug === "starter-pack") return <StarterPage toast={toast} />;
  // The old tour pages (/apps/mercatura-ads and others) all lead here now.
  return <AppsIndex />;
}
