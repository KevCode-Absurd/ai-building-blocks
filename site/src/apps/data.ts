// The apps on /apps: two kinds of example. Mercatura Ads was built for a real client; every name, product,
// person and number on its screens is replaced with Sprout, our example business (docs/APPS-PRD.md §5).
// The three Mercatura apps are the open-source starter, split into the standalone jobs it does, plus the combined app.

export type Screen = { id: string; name: string; purpose: string; actions: string[] };
export type Rung = { step: string; what: string };
export type App = {
  slug: string;
  name: string;
  short: string; // the card's label
  headline: string; // what it gets you
  summary: string;
  example: boolean; // shows the "Example data" note
  group: "example" | "mercatura" | "combined";
  agents: { has: boolean; why: string };
  screens: Screen[];
  ladder: Rung[];
  blocks: string[]; // library blocks that do the same jobs, smallest first
  stack: [string, string][];
  parts?: string[]; // for the combined app: the standalone apps inside it
  repo?: string;
};

export const REPO = "https://github.com/KevCode-Absurd/mercatura-client-starter";

const SETUP: Rung[] = [
  { step: "Install", what: "Node.js 22 or newer and pnpm. Run pnpm install --frozen-lockfile." },
  { step: "Settings", what: "Copy .env.example to .env. Leave mock mode on and every spend cap at 0 while you look around." },
  { step: "Start", what: "Run pnpm run setup, then pnpm dev, and open 127.0.0.1:3000/onboarding." },
  { step: "First brand", what: "Add one brand, its approved facts and photos. Make a small batch and approve it before a big one." },
];

export const APPS: App[] = [
  {
    slug: "mercatura-ads",
    name: "Mercatura Ads",
    short: "Example app",
    headline: "See which ads make money, and what to make next",
    summary: "One screen for the owner, the creative team and the media buyer. It shows every ad with its results, says which to scale or cut, writes this week's tests, and turns a winning ad into new versions.",
    example: true,
    group: "example",
    agents: { has: false, why: "Every verdict, ranking and alert is a rule in code. The AI is called once per button press: to explain an ad, or to make new versions of it. Nothing runs on its own except the data refresh, which calls no AI." },
    screens: [
      { id: "overview", name: "Overview", purpose: "The whole business on one screen: website sales first, ads under them.", actions: ["Pick the dates and compare with the period before", "Leave out big one-off orders so they don't skew the average", "Jump to the screen behind any tile"] },
      { id: "gallery", name: "Ad gallery", purpose: "Every ad as a card, with its results and a verdict: scale, watch or cut.", actions: ["Sort by spend or by return", "Filter by format, verdict or campaign", "Tick up to four ads to compare", "Export the list as a spreadsheet"] },
      { id: "ad", name: "One ad, up close", purpose: "Why one ad worked, how it's tiring, and new versions to test.", actions: ["Ask the AI why it performed this way", "Make new versions from the real ad image", "Leave a note for the team"] },
      { id: "plan", name: "Action plan", purpose: "This week's tests, ranked, each with a budget, a win rule and a stop rule.", actions: ["Add a test to the tracker", "Copy the brief for the creative team", "Make the creative for a test"] },
      { id: "buyer", name: "Buyer desk", purpose: "The media buyer's morning screen: where to move budget today, and why.", actions: ["See which campaigns to lean into, watch or cut", "Copy the changes to make in Ads Manager", "Check ads that need a fix"] },
      { id: "health", name: "Account health", purpose: "Five weekly checks: tracking, tired ads, changes, set-up and what sells.", actions: ["Compare website orders with what the ad platform counted", "See ads people have seen too often", "Read the change log and what each change did"] },
      { id: "studio", name: "Creative studio", purpose: "The brand kit and playbook every new ad is made from.", actions: ["Keep the voice, claims and words to avoid in one place", "Drop in a reference ad and borrow its layout", "Track every test from brief to result"] },
      { id: "rivals", name: "Competitors", purpose: "What rival brands run right now, side by side.", actions: ["Compare how many ads each runs and for how long", "See the ideas worth borrowing, scored", "Send a rival's layout to the AI as a reference"] },
      { id: "report", name: "Client report", purpose: "A plain report for the owner, made from the same numbers.", actions: ["Add your agency's name and a cover note", "Switch between the client view and the team view", "Download it to print as a PDF"] },
    ],
    ladder: [
      { step: "By hand", what: "Export results from the ad platform into a spreadsheet and read it." },
      { step: "Paste into AI", what: "Paste the export into Claude and ask which ads work and why." },
      { step: "Connect the data", what: "Claude reads the ad account through a connector, so there's nothing to export." },
      { step: "A gallery page", what: "A small local page shows the top 30 ads with their pictures, from a saved snapshot." },
      { step: "Rules in code", what: "A year of daily data, a date picker, targets, verdicts and tired-ad flags. All plain code, no AI." },
      { step: "AI on a button", what: "Explain this ad. Make new versions. Write this week's tests. One AI call each." },
      { step: "Live refresh", what: "One button pulls fresh ad, sales and traffic data from the APIs." },
      { step: "Team app", what: "Hosted, with invite codes, owner and member roles, shared notes and daily AI limits per person." },
    ],
    blocks: ["ad-sales-drop-analyst", "know-which-ads-to-make-next", "borrowed-idea-video-script-writer", "image-ad-gap-finder", "competitor-ad-study-board-builder", "competitor-ad-gap-finder", "meta-ads-compliance-checker"],
    stack: [
      ["Screens", "Plain HTML and JavaScript, no framework"],
      ["Server", "A small Python server"],
      ["Data", "Read-only: the ad platform's API, the store's sales and web traffic. Nothing ever writes to the ad account."],
      ["AI", "Claude for words, an image model that edits the real ad or product photo"],
      ["Team", "Invite codes, signed sessions, owner and member roles, daily limits per person"],
      ["Hosting", "One web service with a small disk for notes and images"],
    ],
  },
  {
    slug: "mercatura-creative-studio",
    name: "Mercatura Creative Studio",
    short: "Mercatura app",
    headline: "Go from a brand's website to approved scripts, image ads and videos",
    summary: "Build a brand brain once, then make scripts, image sets and videos from it. Every piece is checked against the brand's real claims and waits for your approval before anything paid runs.",
    example: false,
    group: "mercatura",
    agents: { has: false, why: "Each step is one AI call with a fixed format, and the order is set in code. The chat box maps what you ask to a fixed list of actions; it doesn't plan its own steps." },
    screens: [
      { id: "cs-home", name: "Home", purpose: "Say what you want to make, and see what needs you.", actions: ["Type or say a request", "Pick the product, buyer, angle, offer and format", "Pick up where you left off"] },
      { id: "cs-brain", name: "Brand brain", purpose: "Everything every writer is told about the brand, built from its website.", actions: ["Read the website", "Paste what you already have written down", "See how complete the brain is"] },
      { id: "cs-insights", name: "Insights", purpose: "What customers say, grouped into themes, every quote linked to its source.", actions: ["Bring in reviews, tickets, calls and surveys", "Rank themes by how often and how strongly they come up", "Turn a theme into a persona or an angle"] },
      { id: "cs-scripts", name: "Scripts", purpose: "Scripts made from six choices, each checked before you see it.", actions: ["Write scripts from a product, buyer, angle, offer, format and count", "Read the checks each script failed", "Compare scripts from different models"] },
      { id: "cs-create", name: "Create", purpose: "Image sets and a batch of 100 static ads from one plan.", actions: ["Plan the next ads", "Approve the plan before anything is made", "Review image sets"] },
      { id: "cs-production", name: "Production", purpose: "A board that moves each video from brief to approved.", actions: ["Move a piece through brief, script, images, storyboard and clips", "Approve or reject at each gate", "Export a handoff pack"] },
    ],
    ladder: [
      { step: "Prompt", what: "Ask an AI for ten ad scripts." },
      { step: "Skill", what: "A script skill with rules, checks and the brand's facts." },
      { step: "Workflow", what: "Brand file, customer words, script, check: in order." },
      { step: "One screen", what: "A form with six choices and a Write button, reading the same SKILL.md files." },
      { step: "Saved work", what: "A database keeps every script, version and approval." },
      { step: "A production board", what: "Paid steps queue as jobs and wait at approval gates, with spend caps." },
    ],
    blocks: ["website-brand-file-builder", "customer-buying-reasons-finder", "customer-quote-video-ad-script-writer", "ad-script-format-finder", "word-perfect-image-prompt-writer", "meta-ads-compliance-checker"],
    stack: [],
    repo: REPO,
  },
  {
    slug: "mercatura-landing-pages",
    name: "Mercatura Landing Pages",
    short: "Mercatura app",
    headline: "Get a landing page that keeps your ad's promise",
    summary: "Start from the ad that brings people in. Get two versions of the page side by side, see it on a laptop and a phone, check it, and export it to your store.",
    example: false,
    group: "mercatura",
    agents: { has: false, why: "The page is written in fixed steps: the argument, the sections, the checks. Checks like page speed and message match are plain code." },
    screens: [
      { id: "lp-intake", name: "What are we improving?", purpose: "Start from a page, an ad or a product.", actions: ["Paste the page or pick the ad", "Open a recent project"] },
      { id: "lp-bench", name: "Workbench", purpose: "Two versions of each section side by side, on a laptop and a phone.", actions: ["Swap a section for version B", "Preview at laptop and phone width", "Read the page's argument in one line per section"] },
      { id: "lp-match", name: "Ad to page match", purpose: "Checks the page says what the ad promised, in the same words.", actions: ["See each ad promise and where the page keeps it", "Fix the lines that break the promise"] },
      { id: "lp-export", name: "Checks and export", purpose: "Run the checks, then export the page to the store.", actions: ["Run page speed, security and claims checks", "Export to Shopify"] },
    ],
    ladder: [
      { step: "Skill", what: "Find what stops visitors buying, with quick checks." },
      { step: "Workflow", what: "Ad, then page, then checks, in order." },
      { step: "One screen", what: "A workbench with version A and B and a preview." },
      { step: "Export", what: "The approved page goes straight to the store as a theme section." },
    ],
    blocks: ["landing-page-30-point-checker", "get-a-checked-landing-page-for-your-best-ad", "landing-page-auditor", "proof-backed-sales-copy-writer", "shopify-landing-page-builder"],
    stack: [],
    repo: REPO,
  },
  {
    slug: "mercatura-seo",
    name: "Mercatura SEO",
    short: "Mercatura app",
    headline: "Get found by people and by AI answers when they search for what you sell",
    summary: "A growth plan, page audits and articles with a reason to exist. It also checks how AI assistants describe your product, and readies your pages for AI shopping tools.",
    example: false,
    group: "mercatura",
    agents: { has: false, why: "Plans, audits and articles are fixed steps. Checking AI answers uses the AI's own web search with a set limit, then stops." },
    screens: [
      { id: "seo-overview", name: "Overview", purpose: "Your next best actions, in order.", actions: ["See the three things to do this week", "Open the plan behind each one"] },
      { id: "seo-audit", name: "Audits", purpose: "What each page gets wrong, and the fix.", actions: ["Audit a page", "Sort fixes by effect"] },
      { id: "seo-blog", name: "Blog studio", purpose: "Articles that answer a real search, in the brand's voice.", actions: ["Pick a search to answer", "Write, check and approve an article"] },
      { id: "seo-ai", name: "AI answers", purpose: "How AI assistants describe you, and what they get wrong.", actions: ["Check what AI says about your product", "Fix pages so AI shopping tools can check your facts"] },
    ],
    ladder: [
      { step: "Prompt", what: "Ask an AI what to write about." },
      { step: "Skill", what: "An article skill that reads the brand file and the search." },
      { step: "One screen", what: "A plan, an audit list and a blog studio." },
      { step: "Routine", what: "Check AI answers about your brand every week." },
    ],
    blocks: ["website-brand-file-builder", "customer-buying-reasons-finder", "unanswered-customer-question-finder"],
    stack: [],
    repo: REPO,
  },
  {
    slug: "mercatura",
    name: "Mercatura",
    short: "Combined app",
    headline: "Run ads, pages and SEO from one brand brain",
    summary: "The three Mercatura apps behind one sign-in. They share the brand brain, the personas, the offers and the spend caps, so a fact fixed once is right everywhere. This is the open-source starter you can install today.",
    example: false,
    group: "combined",
    agents: { has: false, why: "It's the three apps together, and none of them uses an agent. Combining apps is about sharing data, not adding AI." },
    parts: ["mercatura-creative-studio", "mercatura-landing-pages", "mercatura-seo"],
    screens: [
      { id: "m-onboarding", name: "Start with your first client", purpose: "Add a brand. Everything after reads from it.", actions: ["Add a brand", "Follow the five-step checklist", "See which connections are ready"] },
      { id: "m-switch", name: "Switch apps", purpose: "Move between Creative Studio, Landing Pages and SEO without losing the brand.", actions: ["Switch apps", "Switch brands", "Open shared context: brand brain, personas, offers"] },
      { id: "m-shared", name: "What they share", purpose: "One brand brain, one set of personas and offers, read by every app.", actions: ["Fix a fact once, and every app uses it", "See which app reads which part"] },
      { id: "m-settings", name: "Settings", purpose: "Which model runs each step, and the spend caps for all three apps.", actions: ["Pick a model per step", "Set text, image and video caps", "Switch between Normal and Advanced"] },
    ],
    ladder: [
      { step: "One app", what: "Build Creative Studio on its own first." },
      { step: "A second app", what: "Build Landing Pages on its own, reading its own copy of the brand." },
      { step: "Move what's shared", what: "Move the brand brain, personas and offers into one place both apps read." },
      { step: "One sign-in", what: "Put both behind one sign-in and one set of spend caps. Add SEO the same way." },
    ],
    blocks: ["website-brand-file-builder", "customer-buying-reasons-finder", "hidden-offer-finder"],
    stack: [
      ["Screens", "Next.js and React, with Tailwind and Radix parts"],
      ["Data", "SQLite on your computer, through Drizzle"],
      ["AI", "Claude, Gemini, OpenAI or DeepSeek, picked per step, with a structured answer each time"],
      ["Skills", "Plain SKILL.md files the app reads. Improve a skill and the app improves."],
      ["Safety", "Mock mode by default, spend caps at 0, contact details never sent to an AI"],
      ["Not yet", "Hosted team sign-in, roles, hosted billing. The starter pack shows how to add them."],
    ],
    repo: REPO,
  },
];

export const SETUP_STEPS = SETUP;
export const appOf = (slug: string) => APPS.find((a) => a.slug === slug);

/** The six rungs, from one message to an app your team signs in to. */
export const RUNGS: { id: string; name: string; line: string; to: string; here: string }[] = [
  { id: "prompt", name: "Prompt", line: "One message. Paste it in, get one result.", to: "/?kind=prompt#library", here: "In the library" },
  { id: "skill", name: "Skill", line: "Instructions you add to your AI once. It follows them every time.", to: "/?kind=skill#library", here: "In the library" },
  { id: "routine", name: "Routine", line: "A skill or workflow that runs on a schedule, like every Monday at 9.", to: "/how-it-works#routine", here: "How to set one up" },
  { id: "workflow", name: "Workflow", line: "Several skills in order. Each hands its work to the next.", to: "/?kind=workflow#library", here: "In the library" },
  { id: "agent", name: "Agent", line: "An AI that picks its next step and uses tools on its own. Optional.", to: "/how-it-works#agent", here: "How they work" },
  { id: "app", name: "App", line: "A screen your team signs in to, with saved work and a button for each job.", to: "/apps#examples", here: "Examples below" },
];
