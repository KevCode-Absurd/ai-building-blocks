// How it works: what prompts, skills, workflows, agents and apps are, how to use each one,
// and how to use the builder. Written to the plain-writing skill: grade 10 at most, every step true.
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { ArrowIcon } from "./ui";
import { Code, Section } from "./BlockPage";
import { Link } from "./lib/router";

const KINDS: { id: string; n: number; name: string; line: string; here: boolean }[] = [
  { id: "prompt", n: 1, name: "Prompt", line: "One message. You paste it in and get one result.", here: true },
  { id: "skill", n: 2, name: "Skill", line: "Instructions you add to your AI once. It follows them every time.", here: true },
  { id: "routine", n: 3, name: "Routine", line: "A skill or workflow that runs on a schedule, like every Monday at 9.", here: true },
  { id: "workflow", n: 4, name: "Workflow", line: "Several skills in order. Each one hands its work to the next.", here: true },
  { id: "agent", n: 5, name: "Agent", line: "An AI that works through the steps on its own, using tools. Optional.", here: true },
  { id: "app", n: 6, name: "App", line: "A screen your team signs in to. Fill in a form, press a button.", here: true },
];

const PROMPT = `Write 10 headlines for a Facebook ad.

Product: [what you sell, and the price]
Buyer: [who buys it, and what bothers them]
Offer: [the deal, if there is one]

Keep each headline under 40 characters.
Use only the facts above. Don't make up claims.`;

const SKILL = `---
name: meta-ads-compliance-checker
description: Use before launching ads on Facebook or Instagram, to check the words, images and video scripts against Meta's published Advertising Standards.
---

# Meta ads compliance checker

## What you need
## Steps
## What you hand back
## Check before you hand it back
## If something is missing
## Avoid`;

const FOLDER: [string, string][] = [
  ["HANDOFF.md", "The plan. Every step in order, what each one reads, and the rules your AI follows."],
  ["skills/", "One folder per step, each with its SKILL.md."],
  ["workflow.json", "The same plan, written for software to read."],
  ["README.txt", "Three lines on how to start."],
];

const CHOOSE: [string, string, string][] = [
  ["I need something once, right now", "Prompt", "prompt"],
  ["I do this job every week", "Skill", "skill"],
  ["It should run by itself on a schedule", "Routine", "routine"],
  ["The job has several parts", "Workflow", "workflow"],
  ["I want it done while I do something else", "Agent", "agent"],
  ["My team should do it without learning AI", "App", "app"],
];

const WORDS: [string, string][] = [
  ["Brand file", "A short file about you or your business: what you do, who it's for, how you talk. Your AI reads it before each job."],
  ["SKILL.md", "The file a skill lives in. It's plain text, so you can read it and change it."],
  ["HANDOFF.md", "The plan inside a downloaded workflow. Your AI follows it step by step."],
  ["Step", "One skill inside a workflow."],
  ["Input", "What you give a step, like your reviews or a link to your website."],
  ["Result", "What a step gives back, like an ad, a script or a checklist."],
  ["Check", "A step that looks over work before it goes out, and says what to fix."],
  ["Kit", "Your saved list of skills and prompts. It's kept in this browser."],
];

const Steps = ({ items }: { items: ReactNode[] }) => (
  <ol className="num-list">{items.map((s, i) => <li key={i}><span className="n">{i + 1}</span><span>{s}</span></li>)}</ol>
);
const Box = ({ title, items }: { title: string; items: ReactNode[] }) => (
  <div className="when-box"><h3>{title}</h3><ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
);
const Status = ({ here }: { here: boolean }) => <span className={`hiw-status${here ? " here" : ""}`}>{here ? "On this site" : "Not in the library yet"}</span>;

const TOC: [string, string][] = [
  ["kinds", "The six kinds"],
  ["prompt", "Prompts"],
  ["skill", "Skills"],
  ["routine", "Routines"],
  ["workflow", "Workflows"],
  ["agent", "Agents"],
  ["app", "Apps"],
  ["council", "Advisory councils"],
  ["choose", "Which one to use"],
  ["builder", "Using the builder"],
  ["results", "Getting good results"],
  ["words", "Words you'll see"],
];

export default function HowItWorks({ toast }: { toast: (m: string) => void }) {
  useEffect(() => { document.title = "How it works · AI Blocks"; return () => { document.title = "AI Blocks · Use AI like the top 1%"; }; }, []);
  return (
    <main className="bp hiw" data-testid="how-it-works">
      <header className="wrap bp-hero">
        <Link to="/" className="back"><span aria-hidden="true">←</span> Home</Link>
        <p className="bp-kicker"><span className="kind">Guide</span>About 6 minutes to read</p>
        <h1 className="bp-h1">How AI Blocks work</h1>
        <p className="bp-sub">Everything here is a set of written instructions for your AI. This guide explains the six kinds, how to use each one, and how to build a workflow, in plain words.</p>
      </header>
      <div className="wrap bp-body">
        <nav className="bp-toc" aria-label="On this page">
          <p>On this page</p>
          {TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="bp-main">
          <Section id="kinds" title="Six kinds, from one message to an app" lead="Each one does more than the one before. Start with the smallest one that does your job." wide>
            <ol className="hiw-ladder">
              {KINDS.map((k) => (
                <li key={k.id} style={{ "--i": k.n } as CSSProperties}>
                  <a href={`#${k.id}`}>
                    <span className="hiw-n">{k.n}</span>
                    <b>{k.name}</b>
                    <span className="hiw-line">{k.line}</span>
                    <Status here={k.here} />
                  </a>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="prompt" title="A prompt: one message for one quick result">
            <div className="prose big">
              <p>A prompt is a message you paste into a chat with your AI. It asks for one thing, like ten headlines for an ad, and you get one answer back.</p>
            </div>
            <Box title="Use a prompt when" items={["You need something once.", "You want to try an idea fast.", "The whole job fits in one message."]} />
            <h3 className="sub-h">How to use one</h3>
            <Steps items={[
              "Open a prompt in the library and copy it.",
              "Start a new chat in Claude, ChatGPT, Gemini or any other AI.",
              "Paste it in. Fill in the parts in [square brackets] with your own details.",
              "Send it. Read the answer, then ask for changes in the same chat.",
            ]} />
            <p className="bp-note">Here's what a short prompt looks like:</p>
            <Code name="a-prompt.txt" text={PROMPT} toast={toast} />
          </Section>

          <Section id="skill" title="A skill: instructions your AI follows every time">
            <div className="prose big">
              <p>A skill is a longer set of instructions, saved in a file called SKILL.md. You add it to your AI once. After that, you start it by name in any chat, and it works through the same steps every time. Before it hands the work back, it checks it.</p>
            </div>
            <div className="give-get">
              <div><h3>A prompt</h3><ul><li>You paste it in every time.</li><li>Best for a job you do once.</li><li>Short: a few lines.</li></ul></div>
              <div><h3>A skill</h3><ul><li>You add it once, then ask for it by name.</li><li>Best for a job you do again and again.</li><li>Longer: steps, rules and checks.</li></ul></div>
            </div>
            <h3 className="sub-h">Add a skill to your AI</h3>
            <Steps items={[
              <>Open a skill and press <b>Add it to your AI</b>.</>,
              "Pick the AI you use: Claude, Claude Code, ChatGPT, Gemini or another one. The steps are different for each.",
              "Follow the steps shown. It takes about two minutes, and you only do it once.",
            ]} />
            <h3 className="sub-h">Use it</h3>
            <Steps items={[
              <>Start a chat and ask for it by name, like “use the meta-ads-compliance-checker skill”. In Claude Code, type <code>/</code> and its name.</>,
              "Paste in what it asks for. Each skill's page lists what to give it.",
              "Read what comes back. The skill has already checked it, but you're the final check.",
            ]} />
            <p className="bp-note">Every skill file has the same parts, in plain text. This is the top of a real one:</p>
            <Code name="SKILL.md" text={SKILL} toast={toast} />
          </Section>

          <Section id="routine" title="A routine: a skill that runs on a schedule">
            <div className="prose big">
              <p>A routine is a skill or a workflow with a time or a trigger. “Every Monday at 9, read last week's ad results and tell me what to cut.” You set it up once, and it runs without you starting it.</p>
            </div>
            <h3 className="sub-h">Set one up</h3>
            <Steps items={[
              "Pick a skill or workflow that already works when you start it by hand.",
              "Use your AI's scheduled tasks. Claude and ChatGPT both have them. In Claude Code, use a routine or your computer's scheduler.",
              "Say when it runs, what it reads and where the result goes.",
              "Read the first few results. Make the skill clearer before you stop checking.",
            ]} />
            <Box title="Keep it safe" items={["Start with routines that only read and report.", "Have it ask you before it sends, posts or spends anything."]} />
          </Section>

          <Section id="workflow" title="A workflow: several skills, one after another">
            <div className="prose big">
              <p>A workflow runs skills in order. Each step saves its result and hands it to the next step. For example: teach your AI your brand, work out who you're writing for, write the ad, then check it against Meta's ad rules.</p>
            </div>
            <div className="hiw-flow" aria-label="An example workflow">
              {[["Website brand brain builder", "brand file"], ["Buyer brief writer", "brief"], ["Fact-based ad copy writer", "ad copy"], ["Meta ads compliance checker", ""]].map(([step, carry], i) => (
                <div className="hiw-flow-step" key={step}>
                  <span className="hiw-flow-box"><span className="hiw-n">{i + 1}</span>{step}</span>
                  {carry && <span className="hiw-carry">{carry}</span>}
                </div>
              ))}
            </div>
            <h3 className="sub-h">Run a workflow</h3>
            <Steps items={[
              <>Open a ready workflow, or <Link to="/#build">build your own</Link>.</>,
              <>Press <b>Download the workflow</b>. You get one folder.</>,
              "Gather what the list asks for, like your reviews or a link to your website.",
              "Upload the whole folder to your AI. Claude, ChatGPT or any AI that can read files will work.",
              "Say “Follow HANDOFF.md step by step.” Your AI runs each step in order. When something is missing, it writes MISSING or stops to ask you.",
            ]} />
            <section className="bp-sec terms hiw-terms" aria-label="What's in the folder">
              <h3>What's in the folder</h3>
              <dl>{FOLDER.map(([t, d]) => <div key={t}><dt><code>{t}</code></dt><dd>{d}</dd></div>)}</dl>
            </section>
          </Section>

          <Section id="agent" title="An agent: an AI that does the steps on its own">
            <div className="prose big">
              <p>A chat AI writes. An agent can also act. It can open files, search the web, use other tools and decide what to do next. You give it a goal, and it keeps going until the job is done. Then it tells you what it did.</p>
              <p>In a chat, you start each step and read each answer. An agent can run a whole workflow while you do something else. Some can start on their own, for example every Monday morning.</p>
            </div>
            <Box title="Try it with what's here" items={[
              "Pick a ready-made agent from the library. Add it to Claude Code or Claude like a skill, then give it your goal and your files. It runs its workflows in order and decides what to do between them.",
              "Any of our workflows works with an agent too. Give the downloaded folder to an AI that can read files and use tools, like Claude Code, and it can run every step.",
              "Stay in charge. Our workflow files tell your AI to ask you before it publishes, sends, spends money or changes a live account.",
            ]} />
            <p className="hiw-now"><Status here /> <Link to="/?kind=agent#library">See the ready-made agents</Link>.</p>
          </Section>

          <Section id="app" title="An app: a finished tool with its own screen">
            <div className="prose big">
              <p>An app puts a workflow behind a form and a button. You fill in your details, press the button, and get the result. There's no chat and no files to upload, so anyone on your team can use it.</p>
              <p>An app is worth it when many people do the same job the same way, many times. For a job you do now and then, a skill is enough.</p>
              <p>An app doesn't need an agent. Most apps run fixed steps, with one AI call per button.</p>
            </div>
            <p className="hiw-now"><Status here /> <Link to="/apps">Take the tour of a finished app</Link>, or <Link to="/apps/starter-pack">get the app starter pack</Link> to build your own.</p>
          </Section>

          <Section id="council" title="An advisory council: different views on one decision">
            <p>Choose three to five minds with different strengths, such as customers, money and design. Each uses ideas from their public work to review the same facts. The council compares their answers, keeps the strongest disagreement and gives you a recommendation with next steps.</p>
            <Steps items={[
              <>Go to <Link to="/minds">Minds</Link> and use “Seat on council” on the people you want.</>,
              "Open your council in the builder. Set one question, the options, the facts and your limits.",
              "Download the workflow. Give the folder to your AI and ask it to follow HANDOFF.md.",
              "Read what they disagree about and what facts would change the recommendation. You have the final say.",
            ]} />
            <p className="small">Minds are AI interpretations, not the people themselves. Several voices in one AI are not independent evidence. You can also put a mind on one workflow step, or add a team in Start to split the work or review it together.</p>
            <p><Link to="/minds" className="btn btn-primary">Choose your council <ArrowIcon /></Link></p>
          </Section>

          <Section id="choose" title="Which one to use" lead="Start with the smallest one that does the job. You can always move up.">
            <div className="hiw-choose" role="table" aria-label="Which one to use">
              <div role="row" className="hiw-choose-head"><span role="columnheader">If you…</span><span role="columnheader">Use</span></div>
              {CHOOSE.map(([want, use, id]) => (
                <div role="row" key={id}><span role="cell">{want}</span><span role="cell"><a href={`#${id}`}>{use}</a></span></div>
              ))}
            </div>
          </Section>

          <Section id="builder" title="Build a workflow in the builder, the right way">
            <Steps items={[
              "Start from a goal. Type the result you want, like “a landing page for my best ad”, and the builder lays out the steps. Or pick a ready workflow.",
              "Read it in order. Steps run left to right, then on to the next row. The label on each line says what passes to the next step.",
              "Click a step to see what it needs. “You give it this” means you bring it. “Comes from step 1” means an earlier step makes it.",
              "Fix dashed lines. A dashed line means the next step can't use what the last one made. Move or swap a step until the line is solid.",
              <>Press <b>Preview</b> to watch the steps run in order.</>,
              <>Press <b>Save</b> to keep it, or <b>Share</b> to send it as a link.</>,
              <>Press <b>Download the workflow</b>. Gather what the list asks for, then upload the folder to your AI.</>,
            ]} />
            <Box title="Tips" items={[
              "Put “Brand profile builder” first. Most steps read your brand file.",
              "End with a check, like “Meta ads compliance checker”.",
              "Start with three to five steps. Add more once it works.",
              "Made a mistake? Press Ctrl+Z to undo it.",
              "On a phone, the builder shows a list. Use the arrows to change the order.",
            ]} />
            <p><Link to="/#build" className="btn btn-primary">Open the builder <ArrowIcon /></Link></p>
          </Section>

          <Section id="results" title="Get better results from all of them">
            <ul className="checks">
              <li>Try one skill on a small real job first. Check whether it uses your facts, gives the promised result and follows its own checklist. Keep it if the result helps; adapt it if it misses your needs.</li>
              <li>Give it real facts. Your AI only knows what you tell it. When it has to guess, it can make things up.</li>
              <li>Set up your brand file once. Run “Brand profile builder” first, and every later step can use it.</li>
              <li>Start a new chat for a new job. Long chats about many things get muddled.</li>
              <li>Read the result before you use it, most of all prices, claims and anything legal.</li>
              <li>When a workflow writes MISSING, add what's missing and run that step again.</li>
              <li>Make the skill fit you. It's a plain text file. Change it once and every run after fits better.</li>
            </ul>
          </Section>

          <section className="bp-sec terms" id="words" aria-labelledby="words-h">
            <h2 className="bp-h2" id="words-h">Words you'll see</h2>
            <dl>{WORDS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
          </section>

          <p className="hiw-end"><Link to="/#library" className="btn btn-primary">Browse the blocks <ArrowIcon /></Link></p>
        </div>
      </div>
    </main>
  );
}
