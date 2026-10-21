// Subscriber lifetime value. The single source of truth for this mini tool.
//
// Maths: profit a month from one subscriber = price x margin. With a steady monthly churn, the average subscriber stays
// 1 / churn months (100 / churn when churn is a percentage). Lifetime value = profit a month x months they stay.
// Lifetime value to cost ratio = lifetime value / cost to win one. Payback months = cost to win / profit a month.
// Most to spend to keep your target ratio = lifetime value / target. Share still here after 12 months = (1 - churn)^12.
// Standard subscription lifetime value sums, written in our own words.

export default {
  slug: "subscriber-lifetime-value",
  name: "Know what a subscriber is worth over their whole stay",
  /** The plain name, used where the tool talks about itself. */
  short: "Lifetime value",
  headline: "Know what a subscriber is worth over their whole stay, and if that covers what they cost to win",
  summary: "Type your monthly price, margin, churn and what a subscriber costs to win. You get how long they stay, their lifetime value, the ratio to cost and the most to spend.",
  question: "How long does a subscriber stay at my churn rate, what are they worth over that time, and is it enough against what they cost to win?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "price", label: "What a subscriber pays a month", unit: "money", example: 30, min: 0, max: 1e9, step: 1, help: "The average monthly payment across your plans. For yearly plans, divide the yearly price by 12.", where: "Monthly recurring revenue divided by active subscribers.", tools: ["Stripe", "Your billing tool", "A spreadsheet"] },
    { id: "margin", label: "Share of each payment you keep", unit: "percent", example: 80, min: 0, max: 100, step: 1, help: "What is left after the cost to serve one subscriber: hosting, payment fees, support, goods shipped. Do not take marketing off here.", where: "Your profit and loss report: gross profit divided by revenue.", tools: ["Xero or QuickBooks", "Your accountant"] },
    { id: "churn", label: "Share of subscribers who cancel each month", unit: "percent", example: 5, min: 0, max: 100, step: 0.5, help: "Cancellations in a month divided by the subscribers you started the month with. 5 means 5 in 100 leave each month.", where: "Your billing tool's churn report, averaged over the last 3 months.", tools: ["Stripe", "Your billing tool", "Your subscription app"] },
    { id: "cac", label: "Cost to win one subscriber", unit: "money", example: 150, min: 0, max: 1e9, step: 5, help: "Marketing and sales spend divided by the new subscribers it brought in.", where: "Ad and marketing spend for the last 90 days divided by new subscribers in the same days.", tools: ["Meta Ads Manager", "Google Ads", "A spreadsheet"] },
    { id: "targetRatio", label: "Profit you want for every 1 spent to win one", unit: "x", example: 3, min: 0.1, max: 100, step: 0.5, help: "Many subscription businesses aim for 3: a subscriber brings three times what they cost to win.", where: "Your own target. 3 is a common rule of thumb.", tools: [] },
  ],
  outputs: [
    { id: "profitMonth", label: "Profit from one subscriber a month", unit: "money", formula: "price * margin / 100", sum: "{price} × {margin} = {=}", means: "What each month of a subscription leaves you, before marketing." },
    { id: "lifeMonths", label: "Months an average subscriber stays", unit: "months", formula: "IF(churn > 0, 100 / churn, NA())", none: "No end, at 0% churn", sum: "100 ÷ {churn} = {=}", means: [
      { if: "NOT(HAS(lifeMonths))", text: "Nobody cancels, so there is no average stay to work out. Use the churn you saw in your last 3 months." },
      { text: "At a steady churn, the average stay is 1 divided by the churn rate." },
    ] },
    { id: "revenueLife", label: "Sales from one subscriber over their stay", unit: "money", formula: "IF(HAS(lifeMonths), price * lifeMonths, NA())", none: "No limit, at 0% churn", sum: "{price} × {lifeMonths} = {=}", means: "Everything they pay you, before costs." },
    { id: "ltv", label: "Lifetime value: profit from one subscriber over their stay", unit: "money", formula: "IF(HAS(lifeMonths), profitMonth * lifeMonths, NA())", none: "No limit, at 0% churn", sum: "{profitMonth} × {lifeMonths} = {=}", means: "What one subscriber leaves you in all, before what it cost to win them." },
    { id: "ratio", label: "Lifetime value for every 1 spent to win them", unit: "x", formula: "IF(AND(HAS(ltv), cac > 0), ltv / cac, NA())", none: "Nothing spent to win them", sum: "{ltv} ÷ {cac} = {=}", means: [
      { if: "NOT(HAS(ratio))", text: "With no cost to win them, or no churn, there is no ratio to check." },
      { if: "ratio < 1", text: "Below 1: a subscriber brings back less than they cost to win." },
      { if: "ratio < targetRatio", text: "Above 1 but under your target of {targetRatio}." },
      { text: "At or above your target of {targetRatio}." },
    ] },
    { id: "paybackMonths", label: "Months until a subscriber has paid back what they cost", unit: "months", formula: "IF(profitMonth > 0, cac / profitMonth, NA())", none: "Never, at these numbers", sum: "{cac} ÷ {profitMonth} = {=}", means: [
      { if: "NOT(HAS(paybackMonths))", text: "Each month keeps nothing, so the cost to win them is never paid back." },
      { if: "AND(HAS(lifeMonths), paybackMonths > lifeMonths)", text: "Longer than the {lifeMonths} an average subscriber stays, so most leave before they have paid back." },
      { text: "How long your marketing money is tied up in each new subscriber." },
    ] },
    { id: "maxCac", label: "Most to spend to win one and keep your target", unit: "money", formula: "IF(HAS(ltv), ltv / targetRatio, NA())", none: "No limit, at 0% churn", sum: "{ltv} ÷ {targetRatio} = {=}", means: "Spend more than this and a subscriber brings back less than your target for every 1 spent." },
    { id: "keptYear", label: "Share of new subscribers still here after 12 months", unit: "percent", formula: "(1 - churn / 100) ^ 12 * 100", sum: "(100% − {churn})¹² = {=}", means: "Of 100 people who join this month, this many are still paying a year from now." },
  ],
  answer: [
    [
      { if: "profitMonth <= 0", text: "Each month a subscriber keeps you nothing, so they never pay back the {cac} it cost to win them. Fix the price or the cost to serve first." },
      { if: "NOT(HAS(ltv))", text: "At 0% churn nobody leaves, so a subscriber's worth has no end. Each one pays back the {cac} it cost to win them in {paybackMonths}. Use the churn you saw in your last 3 months to get a real figure." },
      { if: "cac = 0", text: "A subscriber stays about {lifeMonths} and leaves {ltv} of profit. You spent nothing to win them, so there is no ratio to check." },
      { if: "paybackMonths > lifeMonths", text: "A subscriber stays about {lifeMonths} and leaves {ltv} of profit, less than the {cac} it cost to win them. They leave before they pay back. Spend no more than {maxCac} to win one, or cut churn." },
      { if: "ratio < targetRatio", text: "A subscriber stays about {lifeMonths} and leaves {ltv} of profit, {ratio} what they cost to win. That is under your {targetRatio} target. Spend no more than {maxCac} to win one, or cut churn." },
      { text: "A subscriber stays about {lifeMonths} and leaves {ltv} of profit, {ratio} what they cost to win. That meets your {targetRatio} target, and each one pays back in {paybackMonths}. You could spend up to {maxCac} to win one." },
    ],
  ],
  compare: { input: "churn", label: "At other churn rates", values: [2, 5, 10], outputs: ["lifeMonths", "ltv", "ratio"] },
  next: [
    { if: "churn >= 5", slug: "subscription-churn-audit", why: "Find where subscribers leave, so each one stays longer and is worth more." },
    { slug: "subscription-payback-checker", why: "Check your cost to win a subscriber against your cash, with a score." },
    { slug: "prepaid-plan-ltv-modeler", why: "See if a prepaid plan would beat month-to-month at your churn." },
  ],
  sources: [
    { what: "Months they stay", how: "1 ÷ monthly churn rate. The standard average customer lifetime sum, for a steady churn." },
    { what: "Lifetime value", how: "Profit a month × months they stay. The standard simple lifetime value sum, with no discount for waiting." },
    { what: "Ratio to cost", how: "Lifetime value ÷ cost to win one. The standard LTV to CAC ratio." },
  ],
  notes: [
    "Churn is the same every month here. Real churn is often highest in the first months, so use a rate from a group who joined at least 6 months ago.",
    "Money now and money later count the same. There is no discount for waiting.",
    "Lifetime value is an average. Half your subscribers are worth less than it.",
  ],
};
