// AI run cost. The single source of truth for this mini tool.
//
// Maths: cost of one run = (tokens in x price in + tokens out x price out) / 1,000,000, because labs price per
// million tokens. Cost a month = cost of one run x runs a month.
// Prices: each lab's public pricing page, standard rate (no batch, no caching), read on CHECKED below.
// Every price is an input, so anyone can type in a newer one.

export const CHECKED = "2026-10-19";
const CHECKED_WORDS = "Oct 2026"; // shown on pages: the month only, never a day

/** Models we price, from each lab's public pricing page. Prices are US dollars per million tokens. */
export const MODELS = [
  { id: "fable51", lab: "Anthropic", name: "Claude Fable 5.1", in: 10, out: 50, url: "https://platform.claude.com/docs/en/about-claude/pricing" },
  { id: "opus55", lab: "Anthropic", name: "Claude Opus 5.5", in: 4, out: 20, url: "https://platform.claude.com/docs/en/about-claude/pricing" },
  { id: "sonnet55", lab: "Anthropic", name: "Claude Sonnet 5.5", in: 2, out: 10, url: "https://platform.claude.com/docs/en/about-claude/pricing" },
  { id: "haiku55", lab: "Anthropic", name: "Claude Haiku 5.5", in: 0.1, out: 0.5, note: "For prompts up to 100,000 tokens. Longer prompts cost $0.50 in and $2.50 out.", url: "https://platform.claude.com/docs/en/about-claude/pricing" },
  { id: "gpt6astra", lab: "OpenAI", name: "GPT-6 Astra", in: 10, out: 50, note: "For prompts up to 272,000 tokens.", url: "https://developers.openai.com/api/docs/pricing" },
  { id: "gpt61sol", lab: "OpenAI", name: "GPT-6.1 Sol", in: 2, out: 10, note: "For prompts up to 272,000 tokens.", url: "https://developers.openai.com/api/docs/pricing" },
  { id: "gpt6luna", lab: "OpenAI", name: "GPT-6 Luna", in: 0.1, out: 0.5, note: "For prompts up to 272,000 tokens.", url: "https://developers.openai.com/api/docs/pricing" },
  { id: "gemini4argon", lab: "Google", name: "Gemini 4 Argon", in: 2, out: 10, note: "Price until 30 Nov 2026. From 1 Dec 2026 it is $4 in and $20 out.", url: "https://ai.google.dev/gemini-api/docs/pricing" },
  { id: "gemini38flash", lab: "Google", name: "Gemini 3.8 Flash", in: 0.75, out: 3.75, note: "Price until 31 Dec 2026. From 1 Jan 2027 it is $1.50 in and $7.50 out.", url: "https://ai.google.dev/gemini-api/docs/pricing" },
  { id: "gemini35lite", lab: "Google", name: "Gemini 3.5 Flash-Lite", in: 0.3, out: 2.5, url: "https://ai.google.dev/gemini-api/docs/pricing" },
  { id: "deepseekpro", lab: "DeepSeek", name: "DeepSeek V4 Pro", in: 1.32, out: 3.96, note: "Peak-hours price, without caching. Off-peak hours cost half.", url: "https://api-docs.deepseek.com/quick_start/pricing" },
  { id: "deepseekflash", lab: "DeepSeek", name: "DeepSeek Flash", in: 0.3, out: 1.2, note: "Peak-hours price, without caching. Off-peak hours cost half.", url: "https://api-docs.deepseek.com/quick_start/pricing" },
];

const months = MODELS.map((m) => `${m.id}Month`).join(", ");

export default {
  slug: "ai-run-cost",
  name: "Know what an AI job costs before you run it",
  /** The plain name, used where the tool talks about itself. */
  short: "AI run cost",
  headline: "Know what an AI job costs on each lab, per run and per month",
  summary: "Type how much goes in and comes out, and how often you run it. You get the cost per run and per month on 12 models.",
  question: "What does one run cost on each of the four labs, and what is that a month at my volume?",
  shelf: ["general"],
  /** Lab prices are in US dollars, so this tool always shows dollars. */
  fixedCurrency: "$",
  version: "1.0.0",
  updated: CHECKED,
  checked: CHECKED,
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "Your job" },
    { id: "prices", label: `Prices per million tokens, checked ${CHECKED_WORDS}`, closed: true },
  ],
  inputs: [
    {
      id: "inTokens", label: "Tokens you send each run", unit: "tokens", example: 3000, min: 0, max: 1e9, step: 500, integer: true,
      help: "Everything your AI reads each time: your instructions, files and the chat so far. In English, 1,000 tokens is about 750 words.",
      where: "The usage page of your AI account, or the token count each API reply returns. Divide tokens in by the number of runs.",
      tools: ["Claude Console usage page", "OpenAI usage dashboard", "Google AI Studio", "A word counter (words ÷ 0.75)"],
    },
    {
      id: "outTokens", label: "Tokens you get back each run", unit: "tokens", example: 1000, min: 0, max: 1e9, step: 100, integer: true,
      help: "What the AI writes back, including any thinking it does first, which is billed as output.",
      where: "The same usage page: tokens out divided by runs.",
      tools: ["Claude Console usage page", "OpenAI usage dashboard", "Google AI Studio"],
    },
    {
      id: "runs", label: "Runs a month", unit: "count", example: 500, min: 0, max: 1e10, step: 50, integer: true,
      help: "How many times a month you run the job.",
      where: "Your usage page for last month, or your best guess for a new job.",
      tools: ["Claude Console usage page", "OpenAI usage dashboard", "A spreadsheet"],
    },
    ...MODELS.flatMap((m) => [
      { id: `${m.id}In`, label: `${m.name}, tokens in`, unit: "smallmoney", example: m.in, min: 0, max: 10000, step: 0.01, section: "prices", help: m.note ?? `${m.lab}'s standard price.`, where: `${m.lab}'s pricing page: ${m.url}`, tools: [] },
      { id: `${m.id}Out`, label: `${m.name}, tokens out`, unit: "smallmoney", example: m.out, min: 0, max: 10000, step: 0.01, section: "prices", help: m.note ?? `${m.lab}'s standard price.`, where: `${m.lab}'s pricing page: ${m.url}`, tools: [] },
    ]),
  ],
  outputs: [
    ...MODELS.flatMap((m) => [
      {
        id: `${m.id}Run`, label: `${m.name}, one run`, unit: "smallmoney", group: "By model", row: `${m.name} (${m.lab})`, col: "One run",
        formula: `(inTokens * ${m.id}In + outTokens * ${m.id}Out) / 1000000`,
        sum: `({inTokens} × {${m.id}In} + {outTokens} × {${m.id}Out}) ÷ 1,000,000 = {=}`,
        means: "Prices are per million tokens, so the sum divides by a million.",
      },
      {
        id: `${m.id}Month`, label: `${m.name}, a month`, unit: "money", group: "By model", row: `${m.name} (${m.lab})`, col: "A month",
        formula: `${m.id}Run * runs`,
        sum: `{${m.id}Run} × {runs} runs = {=}`,
        means: "One run's cost times your runs a month.",
      },
    ]),
    { id: "cheapestMonth", label: "Cheapest model here, a month", unit: "money", formula: `MIN(${months})`, sum: "The lowest monthly cost in the table = {=}", means: "Cheapest isn't always best: test the cheap model on your own job before you switch." },
    { id: "dearestMonth", label: "Dearest model here, a month", unit: "money", formula: `MAX(${months})`, sum: "The highest monthly cost in the table = {=}", means: "What the same job costs on the priciest model listed." },
  ],
  answer: [
    [
      { if: "runs = 0", text: "With no runs a month, the job costs nothing yet. Type how often you'll run it." },
      { text: "At {runs} runs a month, the cheapest model here costs {cheapestMonth} a month and the dearest costs {dearestMonth}." },
    ],
    [{ text: `Prices are each lab's standard rate, checked in ${CHECKED_WORDS}. You can change any price under "Prices per million tokens".` }],
  ],
  next: [
    { slug: "ai-image-fix-rules", why: "Cut repeat runs by keeping a record of what went wrong last time." },
    { slug: "old-vs-new-ad-prompt-scorer", why: "Check a cheaper model or a shorter prompt still does the job, before you switch." },
  ],
  sources: [
    { what: "Cost of one run", how: "(Tokens in × price in + tokens out × price out) ÷ 1,000,000. Labs price per million tokens." },
    ...[...new Set(MODELS.map((m) => m.lab))].map((lab) => ({ what: `${lab} prices`, how: `${MODELS.find((m) => m.lab === lab).url}, checked ${CHECKED_WORDS}.` })),
  ],
  notes: [
    "Prices are in US dollars, at the standard rate: no batch discount and no caching. Caching and batch runs cost less.",
    "Prices change often. Check the lab's page before you budget.",
  ],
};
