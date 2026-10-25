// Subscription revenue forecast. The single source of truth for this mini tool.
//
// Maths: each month a share c of subscribers leave and a fixed number join. With keep = 1 - c, subscribers next month =
// subscribers x keep + new. After n months: S(n) = S0 x keep^n + new x (1 - keep^n) / c  (S0 + new x n when nobody leaves).
// Monthly recurring revenue (MRR) = subscribers x price. The count levels off where joiners equal leavers: new / c.
// Months to a goal: the first whole month where S(n) reaches goal / price, n = LN((level - goal subs) / (level - S0)) / LN(keep).
// A subscriber stays about 1 / c months. Standard subscription revenue formulas, written in our own words.

export default {
  slug: "subscription-revenue-forecast",
  name: "Subscription revenue forecast",
  /** The plain name, used where the tool talks about itself. */
  short: "Subscription revenue forecast",
  headline: "Subscription revenue forecast",
  summary: "Enter paying users, new sign-ups, price and the share who leave. Estimate future monthly sales and where growth would level off.",
  question: "How would recurring revenue change if sign-ups and cancellations stayed at these rates?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "subs", label: "Paying subscribers today", unit: "count", example: 500, min: 0, max: 1e9, step: 10, integer: true, help: "People who pay you every month right now. Leave out free trials.", where: "The count of active paying subscriptions in your billing tool today.", tools: ["Stripe", "Shopify subscriptions", "Recharge", "Your billing tool"] },
    { id: "newSubs", label: "New subscribers a month", unit: "count", example: 50, min: 0, max: 1e9, step: 5, help: "How many new paying subscribers you add in a normal month.", where: "Your new subscriptions for the last 3 months, added up and divided by 3.", tools: ["Stripe", "Recharge", "Your billing tool"] },
    { id: "price", label: "Price per subscriber each month", unit: "money", example: 20, min: 0.01, max: 1e9, step: 1, help: "What a subscriber pays each month, on average. For yearly plans, divide the price by 12.", where: "Divide monthly subscription sales by the number of people paying.", tools: ["Stripe", "Your billing tool"] },
    { id: "churn", label: "Subscribers who leave each month", unit: "percent", example: 5, min: 0, max: 100, step: 0.5, help: "The share of subscribers who cancel or stop paying in a month. 5 means 5 in every 100.", where: "Last month: subscribers who left divided by subscribers at the start of the month. Average the last 3 months.", tools: ["Stripe", "Recharge", "Your billing tool"] },
    { id: "months", label: "Months to look ahead", unit: "count", example: 12, min: 1, max: 120, step: 1, integer: true, help: "How far ahead you want to see. 12 gives you a year.", where: "Your own choice.", tools: [] },
    { id: "goal", label: "Monthly recurring revenue you want", unit: "money", example: 15000, min: 0, max: 1e10, step: 500, help: "A target for monthly recurring revenue. We tell you which month you reach it, if you do. Use 0 to skip.", where: "Your own goal, for example the monthly pay and costs you need to cover.", tools: ["A spreadsheet"] },
  ],
  outputs: [
    { id: "mrrNow", label: "Monthly recurring revenue today", unit: "money", formula: "subs * price", sum: "{subs} × {price} = {=}", means: "What your subscribers pay you in a month, before costs." },
    { id: "keep", label: "Share of subscribers who stay each month", unit: "percent", helper: true, formula: "100 - churn", sum: "100% − {churn} = {=}", means: "" },
    { id: "subsLater", label: "Paying subscribers at the end", unit: "count", formula: "IF(churn > 0, subs * (keep / 100) ^ months + newSubs * (1 - (keep / 100) ^ months) / (churn / 100), subs + newSubs * months)", sum: "{subs} × stay rate over {months} months, plus new sign-ups still around = {=}", means: "Joiners each month, less the share who leave, month after month." },
    { id: "mrrLater", label: "Monthly recurring revenue at the end", unit: "money", formula: "subsLater * price", sum: "{subsLater} × {price} = {=}", means: "Your forecast for the last month you chose. It holds only if sign-ups, price and cancellations stay as you typed them." },
    { id: "mrrChange", label: "Change in monthly recurring revenue", unit: "money", formula: "mrrLater - mrrNow", sum: "{mrrLater} − {mrrNow} = {=}", means: [{ if: "mrrChange < 0", text: "It falls: more people leave than join." }, { if: "mrrChange = 0", text: "No change: joiners and leavers cancel out." }, { text: "It grows: more people join than leave." }] },
    { id: "levelSubs", label: "Subscribers where it levels off", unit: "count", formula: "IF(churn > 0, newSubs / (churn / 100), NA())", none: "No limit: nobody leaves", sum: "{newSubs} ÷ {churn} = {=}", means: [{ if: "NOT(HAS(levelSubs))", text: "Nobody leaves, so the count never stops growing while people keep joining." }, { text: "Where the people who join each month match the people who leave." }] },
    { id: "levelMrr", label: "Monthly recurring revenue where it levels off", unit: "money", formula: "IF(HAS(levelSubs), levelSubs * price, NA())", none: "No limit: nobody leaves", sum: "{levelSubs} × {price} = {=}", means: "The ceiling at today's sign-ups, price and cancellations. To lift it, add sign-ups, keep more people or raise the price." },
    { id: "lifeMonths", label: "How long a subscriber stays", unit: "months", formula: "IF(churn > 0, 100 / churn, NA())", none: "For good: nobody leaves", sum: "100 ÷ {churn} = {=}", means: "An average, not a promise. Many leave early and some stay for years." },
    { id: "monthsToGoal", label: "Month you reach your goal", unit: "count", formula: "IF(goal <= mrrNow, 0, IF(churn > 0, IF(goal / price >= levelSubs, NA(), IF(churn >= 100, 1, ROUNDUP(LN((levelSubs - goal / price) / (levelSubs - subs)) / LN(keep / 100), 0))), IF(newSubs > 0, ROUNDUP((goal / price - subs) / newSubs, 0), NA())))", none: "Not at this pace", sum: "The first whole month where subscribers reach {goal} ÷ {price} = {=}", means: [{ if: "goal <= mrrNow", text: "You are already at your goal, or you left it at zero." }, { if: "NOT(HAS(monthsToGoal))", text: "At this pace the count levels off below your goal, or stops growing." }, { text: "The first whole month your recurring revenue reaches the goal." }] },
  ],
  answer: [
    [
      { if: "mrrChange > 0", text: "In {months} months your monthly recurring revenue grows from {mrrNow} to {mrrLater}, with about {subsLater} paying subscribers." },
      { if: "mrrChange < 0", text: "In {months} months your monthly recurring revenue falls from {mrrNow} to {mrrLater}, with about {subsLater} paying subscribers." },
      { text: "In {months} months your monthly recurring revenue stays at {mrrNow}, with about {subsLater} paying subscribers." },
    ],
    [
      { if: "HAS(levelMrr)", text: "It levels off near {levelMrr} a month, about {levelSubs} subscribers, where new sign-ups match the people who leave." },
      { if: "newSubs = 0", text: "Nobody joins and nobody leaves, so it stays the same." },
      { text: "Nobody leaves, so it keeps growing by {newSubs} subscribers a month." },
    ],
    [
      { if: "goal = 0", text: "" },
      { if: "goal <= mrrNow", text: "You are already past {goal} a month." },
      { if: "HAS(monthsToGoal)", text: "You pass {goal} a month in month {monthsToGoal}." },
      { text: "You do not reach {goal} a month at this pace. Add sign-ups, keep more people or raise the price." },
    ],
  ],
  next: [
    { if: "churn >= 5", slug: "subscription-churn-audit", why: "Find where subscribers leave, so more of them stay." },
    { slug: "subscription-payback-checker", why: "Check what you can afford to spend to win each subscriber." },
    { slug: "subscription-offer-designer", why: "Design an offer that brings in more sign-ups or lifts the price." },
  ],
  sources: [
    { what: "Subscribers after n months", how: "Subscribers × stay rate^n plus new sign-ups × (1 − stay rate^n) ÷ churn. The standard subscriber balance sum with a steady churn rate." },
    { what: "Where it levels off", how: "New subscribers a month ÷ monthly churn. The standard steady-state count for a subscription." },
  ],
  notes: [
    "New sign-ups, price and cancellation rates stay fixed in this estimate. Try other rates to see how much the forecast changes.",
    "New subscribers are counted at the end of each month, so they pay from the month after they join.",
    "Monthly recurring revenue is not profit, and it is not cash in the bank. It leaves out costs, refunds and tax.",
  ],
};
