// Creative volume planner. The single source of truth for this mini tool.
//
// Maths, all from your own numbers: new ads a month = ad spend / what one ad spends before you turn it off.
// Revenue one ad brings = its spend x its return on ad spend. What one ad leaves = that revenue x your margin - its spend.
// A format pays for itself when that is more than it costs to make. Production budget = ads x cost to make one.
// Plain arithmetic in our own words. No rule of thumb is built in: every number is one you type.

const FORMATS = [
  { key: "Image", name: "image ad", plural: "Image ads", example: 50 },
  { key: "Creator", name: "creator video", plural: "Creator videos", example: 300 },
  { key: "Edited", name: "edited video", plural: "Edited videos", example: 800 },
];

export default {
  slug: "creative-volume-planner",
  name: "Monthly ad production planner",
  /** The plain name, used where the tool talks about itself. */
  short: "Monthly ad production planner",
  headline: "Monthly ad production planner",
  summary: "Enter ad spend, average ad results and production costs. Estimate monthly ad volume, production budgets and profit by format.",
  question: "How many ads might we need, and what production budget could cover them?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-19",
  presets: [{ id: "ecommerce", label: "Online store" }],
  sections: [
    { id: "numbers", label: "Your ad numbers" },
    { id: "costs", label: "What it costs you to make one ad" },
  ],
  inputs: [
    {
      id: "spend", label: "Ad spend per month", unit: "money", example: 20000, min: 0, max: 1e10, step: 500,
      help: "What you spend on ads in a month, on every platform.",
      where: "Your ads account billing for the last full month.",
      tools: ["Meta Ads Manager", "TikTok Ads Manager", "Google Ads"],
    },
    {
      id: "spendPerAd", label: "What one ad spends before you turn it off", unit: "money", example: 1500, min: 1, max: 1e10, step: 100,
      help: "The average spend each ad gets over its life.",
      where: "In your ads account, look at ads that ran in the last 90 days. Add up their spend and divide by the number of ads.",
      tools: ["Meta Ads Manager", "TikTok Ads Manager", "A spreadsheet export of your ads"],
    },
    {
      id: "roas", label: "Return on ad spend of a typical ad", unit: "x", example: 2.5, min: 0, max: 1000, step: 0.1,
      help: "Revenue for every 1 spent, for an average ad, not your best one.",
      where: "Your ads account, last 90 days: revenue from ads divided by ad spend.",
      tools: ["Meta Ads Manager", "Shopify analytics", "Google Analytics"],
    },
    {
      id: "margin", label: "Gross margin", unit: "percent", example: 60, min: 0, max: 100, step: 1,
      help: "The share of each sale left after goods, shipping and fees, before ads. The order margin tool works it out.",
      where: "Your profit and loss report: revenue minus cost of goods, shipping and fees, divided by revenue.",
      tools: ["Shopify analytics", "Xero or QuickBooks"],
    },
    {
      id: "revenueGoal", label: "New revenue you want from ads each month", unit: "money", example: 60000, min: 0, max: 1e11, step: 1000,
      help: "Use 0 to skip it.",
      where: "Your sales plan for the month.",
      tools: ["A spreadsheet of your sales plan"],
    },
    ...FORMATS.map((f) => ({
      id: `cost${f.key}`, label: `Cost to make one ${f.name}`, unit: "money", example: f.example, min: 0, max: 1e9, step: 10, section: "costs",
      help: `What one finished ${f.name} costs you, including fees, products sent and editing.`,
      where: "Your invoices from designers, creators and editors for the last 90 days, divided by the ads they made.",
      tools: ["Your invoices", "A spreadsheet of your ad costs"],
    })),
  ],
  outputs: [
    {
      id: "adsForSpend", label: "New ads a month to spend your budget", unit: "count",
      formula: "ROUNDUP(spend / spendPerAd, 0)",
      sum: "{spend} ÷ {spendPerAd}, rounded up = {=}",
      means: "Planned ad count at your average spend per ad. Actual ad life and results will vary.",
    },
    { id: "revenuePerAd", label: "Revenue one ad brings in", unit: "money", formula: "spendPerAd * roas", sum: "{spendPerAd} × {roas} = {=}", means: "What a typical ad sells over its life." },
    {
      id: "adsForGoal", label: "New ads a month for your revenue goal", unit: "count",
      formula: "IF(AND(revenueGoal > 0, revenuePerAd > 0), ROUNDUP(revenueGoal / revenuePerAd, 0), NA())",
      none: "No goal entered, or ads bring in nothing",
      sum: "{revenueGoal} ÷ {revenuePerAd}, rounded up = {=}",
      means: "How many typical ads it takes to reach the goal.",
    },
    {
      id: "profitPerAd", label: "What one ad leaves before it's made", unit: "money",
      formula: "revenuePerAd * margin / 100 - spendPerAd",
      sum: "{revenuePerAd} × {margin} − {spendPerAd} spend = {=}",
      means: [
        { if: "profitPerAd < 0", text: "A loss: a typical ad loses {=:abs} before you even pay to make it." },
        { text: "What a typical ad leaves to pay for making it." },
      ],
    },
    {
      id: "breakEvenRoas", label: "Return an ad needs to cover its own spend", unit: "x",
      formula: "IF(margin > 0, 100 / margin, NA())", none: "No return is enough at a 0% margin",
      sum: "100% ÷ {margin} = {=}",
      means: "Below this, an ad loses money on spend alone.",
    },
    ...FORMATS.map((f) => ({
      id: `net${f.key}`, label: `One ${f.name}, after it's made`, unit: "money", group: "Each format", about: `What one ${f.name} leaves after it's paid for. Below zero, ${f.plural.toLowerCase()} don't pay for themselves.`,
      formula: `profitPerAd - cost${f.key}`,
      sum: `{profitPerAd} − {cost${f.key}} to make = {=}`,
      means: [
        { if: `net${f.key} < 0`, text: `${f.plural} don't pay for themselves: each loses {=:abs}.` },
        { text: `${f.plural} pay for themselves, with {=} left each.` },
      ],
    })),
    ...FORMATS.map((f) => ({
      id: `budget${f.key}`, label: `Making budget a month, all ${f.plural.toLowerCase()}`, unit: "money", group: "Each format",
      formula: `adsForSpend * cost${f.key}`,
      sum: `{adsForSpend} ads × {cost${f.key}} = {=}`,
      means: `What it costs to make every ad as ${f.name === "image ad" ? "an" : "a"} ${f.name}.`,
    })),
  ],
  answer: [
    [
      { if: "spend = 0", text: "With no ad spend there are no ads to plan." },
      { if: "profitPerAd < 0", text: "At a {roas} return, a typical ad loses {profitPerAd:abs} before you pay to make it. More ads would lose more, so fix the return or the margin first." },
      { text: "To spend {spend} a month you need about {adsForSpend} new ads a month. A typical ad leaves {profitPerAd} to pay for making it." },
    ],
    [
      { if: "AND(netImage >= 0, netCreator >= 0, netEdited >= 0)", text: "All three formats pay for themselves at these numbers." },
      { if: "AND(netImage < 0, netCreator < 0, netEdited < 0)", text: "No format pays for itself at these numbers." },
      { text: "Some formats pay for themselves and some don't. See each format below." },
    ],
    [{ if: "HAS(adsForGoal)", text: "For {revenueGoal} of new revenue you need about {adsForGoal} new ads a month." }],
  ],
  next: [
    { slug: "know-which-ads-to-make-next", why: "Turn the number of ads into a list of what to make next." },
    { slug: "ad-test-brief-writer", why: "Get three ad ideas, each in three versions, to fill the plan." },
  ],
  sources: [
    { what: "New ads a month", how: "Ad spend ÷ what one ad spends over its life, rounded up." },
    { what: "What one ad leaves", how: "Its revenue × your gross margin, minus its spend. A standard contribution sum." },
  ],
  notes: ["A typical ad is an average. Some ads do far better and most do worse, so read this as a plan, not a promise."],
};
