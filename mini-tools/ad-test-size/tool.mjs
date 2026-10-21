// Ad test size. The single source of truth for this mini tool.
//
// Maths: the standard sample-size formula for comparing two rates (a two-sided z-test with the normal approximation,
// no continuity correction). People each version needs = (z for confidence x sqrt(2 x p x (1 - p)) + z for power x
// sqrt(p1 x (1 - p1) + p2 x (1 - p2)))^2 / (p2 - p1)^2, where p1 is today's rate, p2 = p1 x (1 + lift) and p is their
// average. Impressions for the whole test = per version x versions. Cost = impressions / 1,000 x cost per 1,000.
// Days = cost / daily budget, rounded up. Written in our own words.

export default {
  slug: "ad-test-size",
  name: "Know how many people each ad needs before you can trust a winner",
  /** The plain name, used where the tool talks about itself. */
  short: "Ad test size",
  headline: "Know how many people each ad version needs, what the test costs and how long it runs",
  summary: "Type your click or sale rate, the lift you want to find, your cost per 1,000 views and daily budget. You get the views each ad needs, the total cost and the days to run.",
  question: "How many people must see each ad version before I can trust the winner, what does the test cost, and how many days will it take?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "Your ads today" },
    { id: "test", label: "The test you want to run" },
  ],
  inputs: [
    { id: "rate", label: "Rate you measure today", unit: "percent", example: 1, min: 0, max: 100, step: 0.1, help: "The share of people who see the ad and do the thing you count: click, sign up or buy. 1 means 1 in 100.", where: "Your ads account, last 30 days: clicks (or results) divided by impressions, as a percentage.", tools: ["Meta Ads Manager", "Google Ads", "TikTok Ads Manager"] },
    { id: "cpm", label: "What 1,000 views cost you", unit: "money", example: 10, min: 0, max: 1e6, step: 0.5, help: "Your cost per 1,000 impressions.", where: "Your ads account, last 30 days: spend divided by impressions, times 1,000.", tools: ["Meta Ads Manager", "Google Ads", "TikTok Ads Manager"] },
    { id: "dailyBudget", label: "Daily budget for the test", unit: "money", example: 50, min: 0, max: 1e9, step: 5, help: "What you will spend a day across all the versions in the test.", where: "Your test budget, or the ad set's daily budget.", tools: ["Your ads account", "Your marketing budget"] },
    { id: "versions", label: "Ad versions in the test", unit: "count", example: 2, min: 2, max: 20, step: 1, integer: true, section: "test", help: "How many ads you are comparing. Each one needs the same number of views.", where: "The test you are planning.", tools: [] },
    { id: "lift", label: "Smallest lift worth finding", unit: "percent", example: 20, min: 0.1, max: 1000, step: 5, section: "test", help: "How much better the new version must be for you to care. 20 means a 1% rate rising to 1.2%. Small lifts need far bigger tests.", where: "Your own call: the smallest change that would be worth switching for.", tools: [] },
    { id: "confidence", label: "Confidence", unit: "percent", example: 95, min: 50, max: 99.9, step: 1, section: "test", help: "How sure you want to be that a winner is not luck. 95 is the usual choice.", where: "Leave it at 95 unless you have a reason.", tools: [] },
    { id: "power", label: "Power", unit: "percent", example: 80, min: 50, max: 99.9, step: 1, section: "test", help: "The chance the test spots a lift that is really there. 80 is the usual choice.", where: "Leave it at 80 unless you have a reason.", tools: [] },
  ],
  outputs: [
    { id: "rate2", label: "Rate the better version must reach", unit: "percent", formula: "rate * (1 + lift / 100)", sum: "{rate} × (100% + {lift}) = {=}", means: "Today's rate plus the smallest lift worth finding." },
    { id: "pAvg", label: "Average of the two rates", unit: "percent", helper: true, formula: "(rate + rate2) / 2", sum: "({rate} + {rate2}) ÷ 2 = {=}", means: "" },
    { id: "zAlpha", label: "z for your confidence", unit: "z", formula: "NORMSINV(1 - (1 - confidence / 100) / 2)", sum: "The normal curve's value at {confidence}, two-sided = {=}", means: "Part of the standard sample-size formula." },
    { id: "zBeta", label: "z for your power", unit: "z", formula: "NORMSINV(power / 100)", sum: "The normal curve's value at {power} = {=}", means: "Part of the standard sample-size formula." },
    {
      id: "perVersion", label: "Views each version needs", unit: "count",
      formula: "IF(AND(rate > 0, rate2 < 100), ROUNDUP((zAlpha * SQRT(2 * (pAvg / 100) * (1 - pAvg / 100)) + zBeta * SQRT((rate / 100) * (1 - rate / 100) + (rate2 / 100) * (1 - rate2 / 100))) ^ 2 / ((rate2 - rate) / 100) ^ 2, 0), NA())",
      none: "Can't size a test from this rate",
      sum: "({zAlpha} × √(2 × {pAvg} × (1 − {pAvg})) + {zBeta} × √({rate} × (1 − {rate}) + {rate2} × (1 − {rate2})))² ÷ ({rate2} − {rate})², rounded up = {=}",
      means: [
        { if: "NOT(HAS(perVersion))", text: "The rate must be above 0, and the lifted rate under 100%, to size a test." },
        { text: "Impressions each ad must get. Halve the lift you want to find and each ad needs about four times as many." },
      ],
    },
    { id: "resultsPerVersion", label: "Clicks or results each version gets, about", unit: "count", formula: "IF(HAS(perVersion), perVersion * rate / 100, NA())", none: "Can't size a test from this rate", sum: "{perVersion} × {rate} = {=}", means: "Decide the size before you start, and do not stop early when one ad looks ahead." },
    { id: "total", label: "Views the whole test needs", unit: "count", formula: "IF(HAS(perVersion), perVersion * versions, NA())", none: "Can't size a test from this rate", sum: "{perVersion} × {versions} versions = {=}", means: "Split evenly across the versions." },
    { id: "cost", label: "What the test costs", unit: "money", formula: "IF(HAS(total), total / 1000 * cpm, NA())", none: "Can't size a test from this rate", sum: "{total} ÷ 1,000 × {cpm} = {=}", means: "Ad spend to reach the views, at today's cost per 1,000." },
    { id: "days", label: "Days to run the test", unit: "days", formula: "IF(AND(HAS(cost), dailyBudget > 0), ROUNDUP(cost / dailyBudget, 0), NA())", none: "No daily budget", sum: "{cost} ÷ {dailyBudget} a day, rounded up = {=}", means: [
      { if: "NOT(HAS(days))", text: "Type a daily budget to see how long the test takes." },
      { if: "days < 7", text: "Under a week. Many people run at least 7 days anyway, so every day of the week is in the test." },
      { text: "At your daily budget, with the whole budget going into the test." },
    ] },
  ],
  answer: [
    [
      { if: "rate = 0", text: "A rate of 0% can't size a test. Type the click or sale rate your ads get today." },
      { if: "NOT(HAS(perVersion))", text: "A {lift} lift from {rate} goes past 100%, so there is nothing to test. Use a smaller lift." },
      { if: "NOT(HAS(days))", text: "To spot a {lift} lift you need {perVersion} views on each of {versions} versions, about {resultsPerVersion} results each. That is {total} views and {cost} of ad spend. Type a daily budget to see how many days it takes." },
      { text: "To spot a {lift} lift you need {perVersion} views on each of {versions} versions, about {resultsPerVersion} results each. That is {total} views, {cost} of ad spend and about {days} at {dailyBudget} a day." },
    ],
  ],
  compare: { input: "lift", label: "At other lifts", values: [10, 20, 50], outputs: ["perVersion", "cost", "days"] },
  next: [
    { slug: "two-version-ad-test-planner", why: "Set one clear difference between the versions and a winner rule before launch." },
    { slug: "ad-test-budget-setter", why: "Turn the cost into a daily budget, a spend limit per ad and a rule for reading it." },
    { if: "days > 30", slug: "small-budget-ad-test-planner", why: "Too long at your budget? Plan a staged test that starts smaller." },
  ],
  sources: [
    { what: "Views each version needs", how: "The standard sample-size formula for comparing two proportions: a two-sided z-test with the normal approximation, no continuity correction." },
    { what: "Cost and days", how: "Views ÷ 1,000 × cost per 1,000; cost ÷ daily budget, rounded up." },
  ],
  notes: [
    "Each version gets an even share of the views. Ad platforms often favour one ad early, so use an even split setting or separate ad sets.",
    "The rate is per view. If you count sales, the rate is small and the test gets big. Test clicks first, then sales.",
    "Impressions are not people: one person can see an ad several times. The sum treats each view alike.",
  ],
};
