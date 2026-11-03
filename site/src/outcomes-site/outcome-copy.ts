// The words on the owner pages, kept in one place so the app, the prerendered HTML and the reading-level test use the
// same copy. Plain words for an owner who has never used AI for work (docs/WRITING.md, brand/COPYWRITING.md).
import { OUTCOME_PATHS } from "./owner-message.ts";

export const START = {
  kicker: "For a whole job, not one task",
  h1: "Hand your AI a whole job, and keep every decision",
  sub: "Say the job in your own words. Your AI asks a few questions, finds out how experts do it and builds a plan from our specialists. It stops for your yes before anything runs.",
  // Jobs in an owner's words. They only fill the box; nothing is sent anywhere.
  starters: [
    "Our ad costs keep going up and profit is shrinking",
    "Get more of our website visitors to buy",
    "Win back customers who stopped ordering",
    "Close last month's books and show me where the money went",
  ],
  steps: [
    ["Your AI asks one batch of questions.", "What finished looks like, the one number that shows it worked, your limits and what your AI can reach. It skips what it already knows."],
    ["It finds out how experts do this job.", "It reads what your business learned before, our tested workflows and the web. Every step in the plan names where it came from."],
    ["It builds a plan from our specialists and tools.", "Each stage gets a specialist, the skills it uses, the files it must hand over and the checks it must pass. We check the plan against our rules and our library before you see it."],
    ["You approve the plan.", "Nothing runs until you say yes. Ask for changes and your AI rebuilds it."],
    ["The specialists do the work, and you make the calls.", "Stages that don't depend on each other run at the same time. Your AI stops for you at the points below."],
    ["Results are read honestly.", "Each test is set up before it goes live. Too little data is marked unclear, and a test that broke one of your limits never counts as a win. What was learned is saved for next time."],
  ] as [string, string][],
  stopsLead: "Each stop costs you time, so a plan stops only where your judgement changes the result. Plans are built to stop 3 to 5 times.",
  stops: [
    ["Approve the plan", "Before any work starts."],
    ["Choose what to do", "You pick from ranked options. Each one shows the finding behind it, the effort and the risk."],
    ["Look over the work", "When you need to see something before it is used, like new ads."],
    ["Approve each live action", "Anything that spends money, publishes or changes a live account waits for your yes, one action at a time."],
  ] as [string, string][],
  facts: [
    ["Your AI does the work.", "It uses its own model, your accounts and the files in your project. AI Blocks never calls a model and never touches your accounts."],
    ["We give it the method and check its plan.", "Our tools tell your AI how to pin the job down, research it and build the plan. Then they check the plan against our rules and our library."],
    ["Your job's files stay with you.", "Your AI saves the brief, the plan and each result in an outcomes folder in your project. Any AI can pick the job up later."],
    ["We can't promise a result.", "We make sure every result is measured honestly, against the number you chose."],
  ] as [string, string][],
  pasteHint: "Paste it into Claude, ChatGPT or another AI that has AI Blocks connected. What you type stays on this page until you copy it. We don't send it anywhere.",
};

export const EXAMPLE = {
  kicker: "Worked example",
  h1: "See a whole job from start to finish",
  sub: "An owner's ad costs keep rising. Follow what their AI does with the job: the brief, the research, the plan built from our specialists, the times it stops for the owner and how results are read.",
  note: "This is the worked example our tools give every AI as the standard to meet. The screens are built from the example itself, so they change when it does. The numbers are illustrative, not a real business's.",
};

export const STATUS = {
  kicker: "Where my job stands",
  h1: "See where your job stands",
  sub: "Pick your job's folder, or drop it here. You see what's done, what waits on you and what comes next.",
  folder: "Your AI keeps each job in a folder: outcomes, then a folder named after the job. Pick that folder or drop it here.",
  privacy: "Read in this browser only. Nothing is uploaded or saved. Close the tab and it's gone.",
};

/** What a search result shows: the title (50 to 60 characters, brand last) and the description (120 to 155). */
export const SEO: Record<string, [string, string]> = {
  [OUTCOME_PATHS.start]: ["Hand your AI a whole job and keep every call | AI Blocks", "Say the job in your own words. Your AI asks a few questions, finds out how experts do it and builds a plan from our specialists. Nothing runs without you."],
  [OUTCOME_PATHS.example]: ["Worked example: a whole job, screen by screen | AI Blocks", "Follow one job from start to finish: the owner's brief, research with sources, a plan built from our specialists, the owner's stops and honest results."],
  [OUTCOME_PATHS.status]: ["See where your AI job stands, from its folder | AI Blocks", "Pick or drop your job's outcomes folder. See which stages are done, what waits on you and what comes next. Files are read in your browser, never uploaded."],
};
