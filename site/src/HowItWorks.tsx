// How it works: what prompts, skills, workflows, agents and apps are, how to use each one,
// and how to use the builder. Written to the plain-writing skill: grade 10 at most, every step true.
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { ArrowIcon } from "./ui";
import { Code, Section } from "./BlockPage";
import { Link } from "./lib/router";
import "./contextual-help.css";

const KINDS: { id: string; n: number; name: string; line: string; here: boolean }[] = [
  { id: "prompt", n: 1, name: "Prompt", line: "One message. You paste it in and get one result.", here: true },
  { id: "skill", n: 2, name: "Skill", line: "Saved instructions for a job you do again, with steps and checks.", here: true },
  { id: "routine", n: 3, name: "Routine", line: "A skill or workflow you schedule in your AI or another tool.", here: true },
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
  ["Kit", "Your saved list of tasks. Guests save in this browser. Sign in to keep an account copy."],
];

const Steps = ({ items }: { items: ReactNode[] }) => (
  <ol className="num-list">{items.map((s, i) => <li key={i}><span className="n">{i + 1}</span><span>{s}</span></li>)}</ol>
);
const Box = ({ title, items }: { title: string; items: ReactNode[] }) => (
  <div className="when-box"><h3>{title}</h3><ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
);
const Status = ({ here }: { here: boolean }) => <span className={`hiw-status${here ? " here" : ""}`}>{here ? "On this site" : "Not in the library yet"}</span>;

const TOC: [string, string][] = [
  ["start", "Start with one task"],
  ["use-in-ai", "Use your request or files"],
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
  ["trust", "How we build and review"],
  ["words", "Words you'll see"],
];

export default function HowItWorks({ toast }: { toast: (m: string) => void }) {
  useEffect(() => { document.title = "How it works · AI Blocks"; return () => { document.title = "Free AI Skills & Custom Workflow Builder | AI Blocks"; }; }, []);
  return (
    <main className="bp hiw" data-testid="how-it-works">
      <header className="wrap bp-hero">
        <Link to="/#library" className="back"><span aria-hidden="true">←</span> Find a task</Link>
        <p className="bp-kicker"><span className="kind">Guide</span>Start below. Look up more when you need it.</p>
        <h1 className="bp-h1">How AI Blocks work</h1>
        <p className="bp-sub">Choose a job, bring the details it needs and get instructions for your AI to follow. This guide explains skills, workflows and apps, what each one gives you, and how to start.</p>
        <p className="small hiw-connect" data-testid="hiw-connect">Use one AI for most of your work? <Link to="/api-and-mcp">Connect it to AI Blocks once</Link>. Then it can find, plan and get any skill or workflow when it needs one.</p>
      </header>
      <div className="wrap bp-body">
        <nav className="bp-toc" aria-label="On this page">
          <p>On this page</p>
          {TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="bp-main">
          <Section id="start" title="Start with one task" lead="Use this path for your first job. The full reference is below.">
            <Steps items={[
              <>Choose what you want to do in <Link to="/#library">Find a task</Link>. Try meeting notes or an email reply.</>,
              "Add the details the task asks for. Optional details can wait.",
              "Copy the request into your AI chat, or give your AI the downloaded files. Send it to start the work.",
            ]} />
            <p className="small">Browser tools make their result on this site. Requests and downloaded files are used in your AI.</p>
            <p><Link to="/#library" className="btn btn-primary">Find a task <ArrowIcon /></Link></p>
          </Section>
          <Section id="use-in-ai" title="Use your request or files in your AI" lead="Choose the help that matches what you have. You do not need to read the whole guide.">
            <p className="small">Your AI makes the result in your chat or workspace.</p>
            <nav className="ai-guide-links" aria-label="Choose your AI"><a href="#guide-chatgpt">ChatGPT</a><a href="#guide-claude">Claude</a><a href="#guide-claude-code">Claude Code</a><a href="#guide-codex">Codex</a></nav>
            <div className="ai-setup-guide" id="guide-chatgpt" data-testid="guide-chatgpt"><h3>ChatGPT</h3><Steps items={[
              "For a quick start, copy the skill and paste it into a new chat. Add your goal and the details it needs.",
              "If the skill has supporting files, download and unzip it. Attach SKILL.md and the needed files to the chat. Ask ChatGPT to follow SKILL.md for your task.",
              "To reuse it, add the files to a ChatGPT project's Sources. In the project instructions, ask ChatGPT to use those files for this job.",
            ]} /><p className="small">A file upload adds reference material. It does not install a coding skill. <a href="https://learn.chatgpt.com/docs/projects" target="_blank" rel="noopener noreferrer">ChatGPT project guide ↗</a></p></div>
            <div className="ai-setup-guide" id="guide-claude" data-testid="guide-claude"><h3>Claude</h3><Steps items={[
              "For a quick start, paste the copied skill into a new chat with your task details. Attach any supporting files.",
              "To save a reusable skill, download its ZIP. Open Customize → Skills in Claude, then choose + → Create skill → Upload a skill.",
              "Upload the ZIP and turn the skill on. Start a chat and describe the job you want it to do.",
            ]} /><p className="small">Your organization's settings may limit skill uploads. <a href="https://support.claude.com/en/articles/12512180-use-skills-in-claude" target="_blank" rel="noopener noreferrer">Claude skill guide ↗</a></p></div>
            <div className="ai-setup-guide" id="guide-claude-code" data-testid="guide-claude-code"><h3>Claude Code</h3><Steps items={[
              "Download and unzip the skill. Keep SKILL.md and its supporting files in the same skill folder.",
              <>In your local project, put that folder in <code>.claude/skills/</code>. The file should be at <code>.claude/skills/skill-name/SKILL.md</code>.</>,
              <>Open Claude Code in that project. Type <code>/skill-name</code> and add your task details. For all your projects, use <code>~/.claude/skills/</code> instead.</>,
            ]} /><p className="small"><a href="https://code.claude.com/docs/en/skills" target="_blank" rel="noopener noreferrer">Claude Code skill guide ↗</a></p></div>
            <div className="ai-setup-guide" id="guide-codex" data-testid="guide-codex"><h3>Codex</h3><Steps items={[
              "Download and unzip the skill. Keep all its supporting files beside SKILL.md.",
              <>Put the skill folder in your project's <code>.agents/skills/</code> folder. The file should be at <code>.agents/skills/skill-name/SKILL.md</code>. For all projects, use <code>~/.agents/skills/</code>.</>,
              "Open the project in Codex and ask it to use the skill by name for your task. If the new skill does not appear, restart Codex.",
            ]} /><p className="small"><a href="https://developers.openai.com/codex/skills/" target="_blank" rel="noopener noreferrer">Codex skill guide ↗</a></p></div>
            <p className="small"><b>Downloaded a workflow or agent?</b> Keep the whole pack together. Open it in your AI and ask it to follow START_HERE.txt and HANDOFF.md. In a chat, attach every file it needs. A workflow pack contains several skills; it is not a single skill upload.</p>
            <details className="context-help" data-testid="help-copied-request"><summary>I copied a request</summary>
              <Steps items={[
                "Open a new chat in your AI assistant.",
                "Paste the complete request. Add any files it asks for, then send it.",
                "Read the result. Ask for changes in the same chat if it missed something.",
              ]} />
              <p className="small">If copying did not work, select and copy the text shown below the copy button.</p>
            </details>
            <details className="context-help" data-testid="help-downloaded-files"><summary>I downloaded files</summary>
              <Steps items={[
                "Unzip the download. Keep all its files and folders together.",
                "In a coding assistant, open that folder. In a chat, attach the files. If your AI cannot read a zip, unzip it first; check that it can read every needed file.",
                "Follow START_HERE.txt or the README in the pack. For a workflow, say “Follow HANDOFF.md”. Add your goal and the material the task needs.",
              ]} />
              <p className="small">“Copy AI instructions” gives you a first message. It does not replace the downloaded files. Your AI must be able to read them and use the tools the job needs.</p>
            </details>
            <p className="small">Need the result here instead? <Link to="/tools">Open browser tools</Link>. <Link to="/apps">App tours</Link> show example screens; a tour does not run your work.</p>
          </Section>
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
              "Start a new chat in your AI assistant.",
              "Paste it in. Fill in the parts in [square brackets] with your own details.",
              "Send it. Read the answer, then ask for changes in the same chat.",
            ]} />
            <p className="bp-note">Here's what a short prompt looks like:</p>
            <Code name="a-prompt.txt" text={PROMPT} toast={toast} />
          </Section>

          <Section id="skill" title="A skill: saved steps for a repeat job">
            <div className="prose big">
              <p>A skill is a set of instructions saved in a file called SKILL.md. It tells your AI how to do a job, such as review a CV, plan a lesson or draft a customer reply. Save it in an AI tool that supports skills, or paste it into a chat when you need it.</p>
              <p>Read the page before you download. The name tells you the job. The description tells you what to share, what steps the AI follows and what comes back. Some jobs need extra software or access to an account; check the page and skill file for those details.</p>
            </div>
            <div className="give-get">
              <div><h3>A prompt</h3><ul><li>You paste it in every time.</li><li>Best for a job you do once.</li><li>Short: a few lines.</li></ul></div>
              <div><h3>A skill</h3><ul><li>Keep the file and reuse its instructions.</li><li>Best for a job you do again and again.</li><li>Longer: steps, rules and checks.</li></ul></div>
            </div>
            <h3 className="sub-h">Add a skill to your AI</h3>
            <Steps items={[
              "Open a skill and read what it needs.",
              "Use “Copy the request” if it is offered, or download the complete files. Keep supporting files with the skill.",
              <>Follow <a href="#use-in-ai">the steps for your request or files</a>. Save the instructions for reuse if your AI supports that.</>,
            ]} />
            <h3 className="sub-h">Use it</h3>
            <Steps items={[
              <>Start a chat and ask for it by name, like “use the meta-ads-compliance-checker skill”. Attach its SKILL.md file if it is not already available.</>,
              "Paste in what it asks for. Each skill's page lists what to give it.",
              "Read the result and the checks the skill asks for. Confirm any facts, figures or changes before you use them.",
            ]} />
            <p className="bp-note">Skill files use plain text. This example shows the main parts; files from other authors may use different headings.</p>
            <Code name="SKILL.md" text={SKILL} toast={toast} />
          </Section>

          <Section id="routine" title="A routine: a skill that runs on a schedule">
            <div className="prose big">
              <p>A routine is a skill or a workflow with a time or a trigger. “Every Monday at 9, read last week's ad results and tell me what to cut.” You set it up once, and it runs without you starting it.</p>
              <p>You set up the schedule in your AI or another tool. Downloading instructions here does not start a schedule.</p>
            </div>
            <h3 className="sub-h">Set one up</h3>
            <Steps items={[
              "Pick a skill or workflow that already works when you start it by hand.",
              "Use your AI's scheduling feature if it has one, or a scheduler connected to your coding assistant.",
              "Say when it runs, what it reads and where the result goes.",
              "Read the first few results. Make the skill clearer before you stop checking.",
            ]} />
            <Box title="Keep it safe" items={["Start with routines that only read and report.", "Have it ask you before it sends, posts or spends anything."]} />
          </Section>

          <Section id="workflow" title="A workflow: several skills, one after another">
            <div className="prose big">
              <p>A workflow joins several skills to finish a bigger job. Each step gives the next one what it needs. You might turn meeting notes into tasks and a follow-up email, or turn customer research into an ad and check its claims.</p>
              <p>A workflow download contains the plan and the skill files. Give it to an AI assistant with the tools it needs, then ask it to follow the plan. Downloading the pack prepares the job; your AI carries it out when you start it.</p>
            </div>
            <div className="hiw-flow" aria-label="An example workflow">
              {[["Brand profile builder", "brand file"], ["Buyer brief writer", "brief"], ["Fact-based ad copy writer", "ad copy"], ["Meta ads compliance checker", ""]].map(([step, carry], i) => (
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
              "Give the folder to an AI assistant that can read its files. Check that it has the tools each step needs.",
              "Say “Follow HANDOFF.md step by step.” Your AI runs each step in order. When something is missing, it writes MISSING or stops to ask you.",
            ]} />
            <section className="bp-sec terms hiw-terms" aria-label="What's in the folder">
              <h3>What's in the folder</h3>
              <dl>{FOLDER.map(([t, d]) => <div key={t}><dt><code>{t}</code></dt><dd>{d}</dd></div>)}</dl>
            </section>
          </Section>

          <Section id="agent" title="An agent: an AI that does the steps on its own">
            <div className="prose big">
              <p>A chat AI writes. An agent can also act. It can open files, search the web and use other tools when they are available. You give it a goal. It works through the steps and may pause for missing details or your approval.</p>
              <p>In a chat, you start each step and read each answer. An agent can run a whole workflow while you do something else. Some can start on their own, for example every Monday morning.</p>
            </div>
            <Box title="Try it with what's here" items={[
              "Pick a ready-made agent from the library. Give its files to an AI assistant with the tools the job needs, then give it your goal and your files. It runs its workflows in order and decides what to do between them.",
              "Any of our workflows works with an agent too. Give the downloaded folder to an AI that can read files and use the required tools, and it can run every step.",
              "Stay in charge. Our workflow files tell your AI to ask you before it publishes, sends, spends money or changes a live account.",
            ]} />
            <p className="hiw-now"><Status here /> <Link to="/?kind=agent#library">See the ready-made agents</Link>.</p>
          </Section>

          <Section id="app" title="An app: a finished tool with its own screen">
            <div className="prose big">
              <p>An app puts a workflow behind a form and a button. You fill in your details, press the button, and get the result. There's no chat and no files to upload, so anyone on your team can use it.</p>
              <p>An app is worth it when many people do the same job the same way, many times. For a job you do now and then, a skill is enough.</p>
              <p>An app doesn't need an agent. Some apps use AI; others do not. The app tours here show examples. They do not run work with your files.</p>
            </div>
            <p className="hiw-now"><Status here /> <Link to="/apps">Take the tour of a finished app</Link>, or <Link to="/apps#starter-pack">get the app starter pack</Link> to build your own.</p>
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
              "Pick a ready workflow, add skills in the builder, or use “Plan a workflow” to ask AI for a plan.",
              "Read the list from top to bottom. Diagram view shows the same plan as connected steps.",
              "Click a step to see what it needs. “You give it this” means you bring it. “Comes from step 1” means an earlier step makes it.",
              "In Diagram view, check dashed lines. They warn that steps may not pass the right material between them. Review the step's inputs and change the connection if needed.",
              <>Press <b>Preview the steps</b> to see the plan and sample results. This does not run your work.</>,
              <>Press <b>Save</b> to keep it, or <b>Share</b> to send it as a link.</>,
              <>Press <b>Download the workflow</b>. Gather what the list asks for, then upload the folder to your AI.</>,
            ]} />
            <Box title="Tips" items={[
              "Start with the facts the job needs, such as a brief, a document or a brand profile.",
              "End with a check that fits the job, such as a facts review or an ad rules check.",
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
              <li data-testid="hiw-me-md"><Link to="/me-md">Make your me.md once. Every task then fits you.</Link> It's a short private file about you, added to what you copy and download.</li>
              <li data-testid="hiw-train-agent"><Link to="/train-your-own-ai-agent">Train your own AI agent for a job you do often.</Link> Each edit you make becomes a rule it follows next time.</li>
              <li>Set up your brand file once. Run “Brand profile builder” first, and every later step can use it.</li>
              <li>Start a new chat for a new job. Long chats about many things get muddled.</li>
              <li>Read the result before you use it, most of all prices, claims and anything legal.</li>
              <li>When a workflow writes MISSING, add what's missing and run that step again.</li>
              <li>Make the skill fit you. It's a plain text file. Change it once and every run after fits better.</li>
            </ul>
          </Section>

          <Section id="trust" title="How we build and review">
            <ul className="checks">
              <li>Kevin Mark runs AI Blocks. Each page says what you give the item, what you get back and when to skip it.</li>
              <li>Some items are rebuilt by us in our own words from public sources, which the page credits. Others are imported from open-licence collections, with the author, source and licence on the page.</li>
              <li>“Tested” means the item passed our safety check for harmful or hidden instructions, and its page lists what goes in and what you get.</li>
            </ul>
            <p className="small"><Link to="/about#how-built">Read more about how we build and review</Link></p>
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
