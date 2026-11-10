// The library's formats in one place: the words every page uses for a skill, a prompt, a workflow, an agent, a mind
// and a tool. The format pages (/skills, /prompts, /workflows, /agents), the "Which one do I need?" page
// (scripts/lib/format-pages.mjs) and the item pages (BlockHeader.tsx, BlockPage.tsx, scripts/lib/item-top.mjs) all
// read from here, so a format is described the same way everywhere. The one-line definition of each kind stays in
// kinds-glossary.ts, shared with the home page and How it works.
import { KIND_GLOSSARY } from "./kinds-glossary.ts";

const define = (id) => KIND_GLOSSARY.find((k) => k.id === id).define;

/** The page that compares the formats. Its name is the same in the menu, the trail and the page title. */
export const WHICH_ONE = { path: "/which-one", label: "Skills, prompts and workflows", question: "Which one do I need?" };
export const AGENTS_SITE = "https://agents.useaiblocks.com";

const PACK_STEPS = (noun, a) => [
  ["Download", `Open ${a} ${noun} and press Download ${noun}. You get a ZIP file with the plan and every skill it uses.`],
  ["Add it to your AI", "Unzip it. Add all the files to a project in Claude or ChatGPT, or attach them to a Gemini chat."],
  ["Ask", "Say: Read START_HERE.txt and follow HANDOFF.md. Those two files hold the plan. Your AI follows it step by step."],
];
const FILE_STEPS = (noun, a) => [
  ["Download", `Open ${a} ${noun} and press Download ${noun}. You get one ZIP file.`],
  ["Add it to your AI", `Add the file to Claude, ChatGPT or Gemini once. Each ${noun}'s page shows the steps for your AI.`],
  ["Ask", noun === "mind" ? "Ask for the mind by name and describe your problem." : `Ask for the ${noun} by name and give it what its page lists. Your AI does the work.`],
];

/** Each format: its address, names, what it is, when to pick it over the others, three steps to use one, and the
 *  slug of a real library item shown as its example (the page falls back to its top item if that one is gone). */
export const FORMATS = [
  {
    id: "skill", path: "/skills", name: "Skill", plural: "Skills", noun: "skill", a: "a", define: define("skill"),
    what: "A skill is a set of saved instructions for one job, such as checking an ad or a spreadsheet. You add it to your AI once. After that you ask for it by name, and your AI follows the same steps and checks its own work.",
    choose: "Use a skill for a job you do more than once. For a quick one-off, a prompt is enough. For a job with several parts, pick a workflow.",
    useWhen: "You do the job more than once and want the same steps each time.",
    steps: FILE_STEPS("skill", "a"), example: "plain-english-editor",
    next: "Then add the file to your AI once and ask for it by name.",
  },
  {
    id: "prompt", path: "/prompts", name: "Prompt", plural: "Prompts", noun: "prompt", a: "a", define: define("prompt"),
    what: "A prompt is one message. You paste it into a chat, add your details under it and send. There is nothing to add to your AI first.",
    choose: "Use a prompt when you need something once, right now. If you do the job every week, a skill saves you pasting it each time.",
    useWhen: "You need something once, right now.",
    steps: [
      ["Download", "Open a prompt and press Download prompt. You get one text file. You can also copy the prompt from its page."],
      ["Add it to your AI", "Open a new chat in Claude, ChatGPT or Gemini. Attach the file, or paste the prompt in."],
      ["Ask", "Add your details under the prompt and send. You get one result back."],
    ],
    example: "ad-claim-sorter",
    next: "Then open a new chat, attach the file or paste it in, add your details and send.",
  },
  {
    id: "workflow", path: "/workflows", name: "Workflow", plural: "Workflows", noun: "workflow", a: "a", define: define("workflow"),
    what: "A workflow is several skills in order. Each step hands its work to the next, so a whole job gets done in one run.",
    choose: "Use a workflow when the job has several parts and the order matters. One example is going from an ad to a page that matches it. If you only need one part, use that skill on its own.",
    useWhen: "The job has several parts and the order matters.",
    steps: PACK_STEPS("workflow", "a"), example: "ad-landing-page",
    next: "Then unzip it, add all the files to your AI and say: Read START_HERE.txt and follow HANDOFF.md.",
  },
  {
    id: "agent", path: "/agents", name: "Agent", plural: "Agents", noun: "agent", a: "an", define: define("agent"),
    what: "An agent is a set of instructions for a whole repeatable job, such as coaching a sales rep from a call transcript. Your AI works through the steps on its own and decides what to do next.",
    choose: "Use an agent when you want to hand over the job and check the result at the end. If you want to steer each step yourself, use a workflow.",
    useWhen: "You want to hand over a whole job and check the result.",
    steps: PACK_STEPS("agent", "an"), example: "agency-sales-coach",
    next: "Then unzip it, add all the files to your AI and say: Read START_HERE.txt and follow HANDOFF.md.",
  },
  {
    id: "mind", path: "/minds", name: "Mind", plural: "Minds", noun: "mind", a: "a", define: define("mind"),
    what: "A mind is how a well-known expert thinks, built from their public work with the sources listed. It is not the person.",
    choose: "Use a mind when you want a second opinion or a new way to look at a problem. For finished work, such as an ad or a report, use a skill or a workflow.",
    useWhen: "You want an expert's view on a decision, a plan or a draft.",
    steps: FILE_STEPS("mind", "a"), example: "warren-buffett",
    next: "Then add the file to your AI once and ask for the mind by name.",
  },
];

/** Tools are not catalogue items: small calculators that run in the browser. They have their own page, /tools. */
export const TOOL_FORMAT = {
  id: "tool", path: "/tools", name: "Tool", plural: "Tools", noun: "tool", a: "a",
  define: "A small calculator or converter that runs in your browser. No AI and no download.",
  what: "A tool is a small calculator or converter that runs in your browser. You type your numbers and read the answer. It needs no AI and no download.",
  choose: "Use a tool when you need a number or a quick conversion. For written work, use a prompt or a skill.",
  useWhen: "You need a number or a quick conversion.",
};

export const formatOfKind = (id) => FORMATS.find((f) => f.id === id) ?? FORMATS[0];
/** The format whose pages live under this folder ("skills" for /skills/<slug>), or undefined. */
export const formatOfPath = (folder) => FORMATS.find((f) => f.path === `/${folder}`);
