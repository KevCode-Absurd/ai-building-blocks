// Cash runway. The single source of truth for this mini tool.
//
// Maths: what you keep each month now = money in - money out. Growth is a straight line, not compounding: each month,
// money in rises by a set share of today's money in, and money out rises by a set share of today's money out.
// So your monthly net changes by the same step every month: step = (in x in-growth - out x out-growth) / 100.
// After n months the cash you added or lost is n x net now + step x n x (n - 1) / 2, so your balance is
// cash + n x net now + step x n x (n - 1) / 2. Your cash runs out when that reaches zero. That is a quadratic in n,
// and the first positive answer is (-b - SQRT(b x b - 2 x step x cash)) / step, with b = net now - step / 2.
// With no growth step is zero and it is plain cash / monthly loss. To find the cash needed for a target, take the lowest
// point of the balance inside the target months: with a rising net it is the month the net turns positive; otherwise the last month.
// Standard cash runway formulas, written in our own words.

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default {
  slug: "cash-runway",
  name: "Cash balance and runway forecast",
  /** The plain name, used where the tool talks about itself. */
  short: "Cash balance and runway forecast",
  headline: "Cash balance and runway forecast",
  summary: "Enter cash, monthly income and spending, plus growth assumptions. Estimate how long cash lasts and any extra amount needed for your target.",
  question: "How long might our cash last under these income and spending assumptions?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "cash", label: "Cash in the bank", unit: "money", example: 60000, min: 0, max: 1e10, step: 1000, help: "The money you could spend today, in all your business accounts. Leave out money owed to you that has not arrived.", where: "Your bank balance today, added up across every business account.", tools: ["Your banking app", "Xero or QuickBooks", "A spreadsheet"] },
    { id: "income", label: "Money in each month", unit: "money", example: 10000, min: 0, max: 1e10, step: 500, help: "Cash that lands in your account in a normal month, after refunds and fees.", where: "Your bank deposits for the last 3 months, added up and divided by 3.", tools: ["Your banking app", "Stripe or PayPal", "Xero or QuickBooks"] },
    { id: "costs", label: "Money out each month", unit: "money", example: 15000, min: 0, max: 1e10, step: 500, help: "Everything you pay in a normal month: pay, rent, software, stock, ads, loan payments and tax. Spread yearly bills over 12 months.", where: "Your bank withdrawals for the last 3 months, added up and divided by 3.", tools: ["Your banking app", "Xero or QuickBooks", "Your card statements"] },
    { id: "incomeGrowth", label: "Growth in money in, each month", unit: "percent", example: 0, min: 0, max: 100, step: 0.5, help: "How much more comes in each month, as a share of today's money in. 5 means 5% of today's figure is added every month. Use 0 if you expect no growth.", where: "Your money in over the last 6 months: the rise from the first month to the last, divided by 5, as a share of the first month.", tools: ["Your banking app", "A spreadsheet"] },
    { id: "costGrowth", label: "Growth in money out, each month", unit: "percent", example: 0, min: 0, max: 100, step: 0.5, help: "How much more you pay out each month, as a share of today's money out. Include hires you have planned. Use 0 if your costs stay flat.", where: "Your money out over the last 6 months, worked out the same way, plus any planned hires or price rises.", tools: ["Your banking app", "A spreadsheet", "Your hiring plan"] },
    { id: "targetMonths", label: "Months you want your cash to last", unit: "count", example: 12, min: 1, max: 120, step: 1, integer: true, help: "Choose the period you want to cover with cash, using your own cash plan.", where: "Your own goal. Many people use the time it takes to raise money or turn a profit.", tools: [] },
    { id: "startMonth", label: "The month you are in now", unit: "count", example: 10, min: 1, max: 12, step: 1, integer: true, help: "1 is January and 12 is December. It is only used to name the month your cash runs out.", where: "Your calendar.", tools: ["Your calendar"] },
  ],
  outputs: [
    { id: "netNow", label: "What you keep or lose each month now", unit: "money", formula: "income - costs", sum: "{income} − {costs} = {=}", means: [{ if: "netNow < 0", text: "A loss: you spend {=:abs} more than you bring in each month." }, { if: "netNow = 0", text: "You break even each month." }, { text: "You bring in more than you spend." }] },
    { id: "flatRunway", label: "Months your cash lasts with no growth", unit: "months", formula: "IF(cash <= 0, 0, IF(netNow >= 0, NA(), cash / (0 - netNow)))", none: "It does not run out", sum: "{cash} ÷ {netNow:abs} = {=}", means: [{ if: "NOT(HAS(flatRunway))", text: "You bring in at least as much as you spend, so with no growth your cash does not run out." }, { text: "Cash divided by your monthly loss. The simplest answer, with growth left out." }] },
    { id: "step", label: "Change in your monthly net, each month", unit: "money", formula: "(income * incomeGrowth - costs * costGrowth) / 100", sum: "({income} × {incomeGrowth} − {costs} × {costGrowth}) ÷ 100 = {=}", means: [{ if: "step > 0", text: "Your monthly net improves by this much every month." }, { if: "step < 0", text: "Your monthly net gets worse by this much every month." }, { text: "No change: growth in and out cancel, or you expect none." }] },
    { id: "disc", label: "Working number for the runway sum", unit: "number", helper: true, formula: "(netNow - step / 2) ^ 2 - 2 * step * cash", sum: "({netNow} − {step} ÷ 2)² − 2 × {step} × {cash} = {=}", means: "" },
    { id: "runway", label: "Months your cash lasts", unit: "months", formula: "IF(cash <= 0, 0, IF(AND(netNow >= 0, step >= 0), NA(), IF(step = 0, cash / (0 - netNow), IF(disc < 0, NA(), (0 - (netNow - step / 2) - SQRT(disc)) / step))))", none: "It does not run out", sum: "Cash, plus the monthly net and its change, worked out until the balance reaches zero = {=}", means: [{ if: "cash <= 0", text: "You have no cash, so you are out now." }, { if: "NOT(HAS(runway))", text: "Money in stays ahead of money out, or catches up before the cash is gone." }, { text: "Counted from the start of this month. It says nothing about late payments or surprise bills." }] },
    { id: "endMonth", label: "Month your cash runs out", unit: "count", formula: "IF(HAS(runway), startMonth + ROUNDDOWN(runway, 0) - 12 * ROUNDDOWN((startMonth + ROUNDDOWN(runway, 0) - 1) / 12, 0), NA())", none: "It does not run out", sum: "Month {startMonth} plus the whole months in {runway}, wrapped round the year = {=} (1 is January)", means: "1 is January and 12 is December." },
    { id: "yearsAhead", label: "Calendar years after this one", unit: "count", formula: "IF(HAS(runway), ROUNDDOWN((startMonth + ROUNDDOWN(runway, 0) - 1) / 12, 0), NA())", none: "It does not run out", sum: "Whole years in the months from the start of this year = {=}", means: [{ if: "yearsAhead = 0", text: "It runs out in the year you are in now." }, { if: "yearsAhead = 1", text: "It runs out next calendar year." }, { text: "It runs out several calendar years from now." }] },
    { id: "lowMonth", label: "Month the balance is at its lowest", unit: "count", helper: true, formula: "IF(step > 0, IF(netNow < 0, MIN(targetMonths, ROUNDUP((0 - netNow) / step, 0)), 0), targetMonths)", sum: "The month your net turns positive, or the last month you want covered = {=}", means: "" },
    { id: "extraNeeded", label: "More cash you need to last your target", unit: "money", formula: "MAX(0, 0 - (cash + MIN(0, lowMonth * netNow + step * lowMonth * (lowMonth - 1) / 2)))", sum: "The most cash you lose before month {targetMonths}, less your {cash} = {=}", means: [{ if: "extraNeeded > 0", text: "Raise this much, or cut costs, to be covered for the months you chose." }, { text: "Your cash already covers the months you chose." }] },
  ],
  answer: [
    [
      { if: "cash <= 0", text: "You have no cash, so you are already out. Type what is in the bank to see how long it lasts." },
      { if: "NOT(HAS(runway))", text: "Your cash does not run out at this pace. Money in stays ahead of money out, or catches up before the cash is gone." },
      ...MONTHS.map((name, k) => ({ if: `endMonth = ${k + 1}`, text: `Your {cash} lasts about {runway} and runs out in ${name}.` })),
    ],
    [
      { if: "AND(HAS(runway), cash > 0, yearsAhead = 0)", text: "That is this calendar year." },
      { if: "AND(HAS(runway), cash > 0, yearsAhead = 1)", text: "That is next calendar year." },
      { if: "AND(HAS(runway), cash > 0)", text: "That is {yearsAhead} calendar years after this one." },
    ],
    [
      { if: "extraNeeded > 0", text: "To be covered for {targetMonths} months you need {extraNeeded} more cash, or lower costs." },
      { text: "Your cash covers the {targetMonths} months you chose." },
    ],
  ],
  next: [
    { if: "extraNeeded > 0", slug: "lean-year-cash-rules-writer", why: "Turn the gap into a cash buffer, who to ask early and a clear request." },
    { slug: "cash-versus-earnings-checker", why: "Check whether your profit is turning into cash you can spend." },
    { slug: "forecast-your-startup-runway-and-prepare-a-finance-pack", why: "Go further: a multi-year model and a cash-out date with ranges." },
  ],
  sources: [
    { what: "Months your cash lasts", how: "Cash ÷ monthly loss when nothing changes. With steady growth, the first month where cash plus the running total of monthly gains and losses reaches zero. Standard cash runway sums." },
    { what: "More cash you need", how: "The lowest the balance falls before your target month, less the cash you have. A standard funding gap sum." },
  ],
  notes: [
    "Growth here is a steady step each month, not compounding. It suits the next year or so better than five years out.",
    "Money in and out are monthly averages. Real months bunch up: yearly bills, tax, late invoices and stock orders can move your date.",
    "The month it runs out is counted from the start of this month. Keep a safety margin, because few plans hold exactly.",
    "This is a sum, not advice on what to do with your money. For tax, loans or investors, check with a qualified person.",
  ],
};
