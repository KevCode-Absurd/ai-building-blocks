// Page and test calculator. The single source of truth for this mini tool.
//
// Maths:
// - Conversion rate = orders / visitors. Revenue per visitor = orders x average order value / visitors.
// - Visitors each version of an A/B test needs: the standard sample-size formula for comparing two proportions
//   (two-sided z-test, normal approximation, no continuity correction):
//     n = (z_a x sqrt(2 p(1 - p)) + z_b x sqrt(p1(1 - p1) + p2(1 - p2)))^2 / (p2 - p1)^2
//   where p1 is today's rate, p2 = p1 x (1 + lift), p is their average, z_a = NORMSINV(1 - (1 - confidence) / 2)
//   and z_b = NORMSINV(power).
// - Blended rate = share of new visitors x their rate + share of returning visitors x theirs.

export default {
  slug: "page-test-calculator",
  name: "Know if a page test is worth running",
  /** The plain name, used where the tool talks about itself. */
  short: "Page and test calculator",
  headline: "Know what a visitor is worth, and how long a page test takes",
  summary: "Type your visitors, orders and order value. You get revenue per visitor, the visitors an A/B test needs, and what more ad traffic does to your rate.",
  question: "What is each visitor worth, how many visitors does an A/B test need, and what does more cold traffic do to my conversion rate?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-19",
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "Your page" },
    { id: "test", label: "The test you want to run" },
    { id: "mix", label: "New visitors from ads" },
  ],
  inputs: [
    { id: "visitors", label: "Visitors a month", unit: "count", example: 40000, min: 0, max: 1e10, step: 1000, integer: true, help: "People who visit the page or site in a month.", where: "Sessions or visitors for the last full month.", tools: ["Google Analytics", "Shopify analytics", "Your website platform's stats"] },
    { id: "orders", label: "Orders a month", unit: "count", example: 1200, min: 0, max: 1e10, step: 10, integer: true, help: "Orders, sign-ups or bookings from those visitors, in the same month.", where: "Orders for the same month as the visitors.", tools: ["Shopify analytics", "Google Analytics", "Your booking or sales system"] },
    { id: "aov", label: "Average order value", unit: "money", example: 55, min: 0, max: 1e9, step: 1, help: "Revenue divided by orders.", where: "Revenue for the month divided by orders.", tools: ["Shopify analytics", "Google Analytics"] },
    { id: "margin", label: "Margin before ads", unit: "percent", example: 40, min: 0, max: 100, step: 1, help: "The share of each sale left after goods, shipping and fees. The order margin tool works it out.", where: "Your profit and loss report, or the order margin tool.", tools: ["Xero or QuickBooks", "Shopify analytics"] },
    { id: "lift", label: "Smallest lift worth finding", unit: "percent", example: 10, min: 0.1, max: 1000, step: 1, section: "test", help: "How much better the new version must be for you to care. 10 means a 3% rate rising to 3.3%.", where: "Your own call: the smallest change that would be worth the work.", tools: [] },
    { id: "confidence", label: "Confidence", unit: "percent", example: 95, min: 50, max: 99.9, step: 1, section: "test", help: "How sure you want to be that a winner isn't luck. 95 is the usual choice.", where: "Leave it at 95 unless you have a reason.", tools: [] },
    { id: "power", label: "Power", unit: "percent", example: 80, min: 50, max: 99.9, step: 1, section: "test", help: "The chance the test spots a lift that's really there. 80 is the usual choice.", where: "Leave it at 80 unless you have a reason.", tools: [] },
    { id: "coldRate", label: "Conversion rate of new visitors from ads", unit: "percent", example: 1.5, min: 0, max: 100, step: 0.1, section: "mix", help: "People who've never heard of you buy less often.", where: "Your analytics, filtered to new visitors from paid social or search.", tools: ["Google Analytics", "Shopify analytics (sessions by source)"] },
    { id: "warmRate", label: "Conversion rate of everyone else", unit: "percent", example: 5, min: 0, max: 100, step: 0.1, section: "mix", help: "Returning visitors, email, search for your name.", where: "Your analytics, filtered to returning visitors and email.", tools: ["Google Analytics", "Shopify analytics (sessions by source)", "Klaviyo"] },
    { id: "coldShare", label: "Share of visitors new from ads, today", unit: "percent", example: 50, min: 0, max: 100, step: 5, section: "mix", help: "Of all your visitors, the share who are new and came from ads.", where: "Your analytics: new visitors from paid channels divided by all visitors.", tools: ["Google Analytics", "Shopify analytics (sessions by source)"] },
    { id: "coldShareNext", label: "Share of visitors new from ads, if you spend more", unit: "percent", example: 70, min: 0, max: 100, step: 5, section: "mix", help: "Your guess for the share after you raise ad spend.", where: "Your plan for next month.", tools: [] },
  ],
  outputs: [
    { id: "convRate", label: "Conversion rate", unit: "percent", formula: "IF(visitors > 0, orders / visitors * 100, NA())", none: "No visitors yet", sum: "{orders} ÷ {visitors} = {=}", means: "Compare it only with your own past. Rates differ too much between businesses and prices." },
    { id: "rpv", label: "Revenue per visitor", unit: "money", formula: "IF(visitors > 0, orders * aov / visitors, NA())", none: "No visitors yet", sum: "{orders} × {aov} ÷ {visitors} = {=}", means: "The number to judge a page by. A change that raises the rate but lowers order value can lower it." },
    { id: "ppv", label: "Profit per visitor before ads", unit: "smallmoney", formula: "IF(HAS(rpv), rpv * margin / 100, NA())", none: "No visitors yet", sum: "{rpv} × {margin} = {=}", means: "The most you can pay for a visitor and still break even." },
    { id: "p2Rate", label: "Rate the new version must reach", unit: "percent", formula: "IF(HAS(convRate), convRate * (1 + lift / 100), NA())", none: "No rate to start from", sum: "{convRate} × (100% + {lift}) = {=}", means: "Your rate, plus the smallest lift worth finding." },
    { id: "pAvg", label: "Average of the two rates", unit: "percent", helper: true, formula: "IF(HAS(p2Rate), (convRate + p2Rate) / 2, NA())", sum: "({convRate} + {p2Rate}) ÷ 2 = {=}", means: "" },
    { id: "zAlpha", label: "z for your confidence", unit: "z", formula: "NORMSINV(1 - (1 - confidence / 100) / 2)", sum: "The normal curve's value at {confidence}, two-sided = {=}", means: "Part of the standard sample-size formula." },
    { id: "zBeta", label: "z for your power", unit: "z", formula: "NORMSINV(power / 100)", sum: "The normal curve's value at {power} = {=}", means: "Part of the standard sample-size formula." },
    {
      id: "testVisitors", label: "Visitors each version needs", unit: "count",
      formula: "IF(HAS(p2Rate), IF(AND(convRate > 0, p2Rate < 100), ROUNDUP((zAlpha * SQRT(2 * (pAvg / 100) * (1 - pAvg / 100)) + zBeta * SQRT((convRate / 100) * (1 - convRate / 100) + (p2Rate / 100) * (1 - p2Rate / 100))) ^ 2 / ((p2Rate - convRate) / 100) ^ 2, 0), NA()), NA())",
      none: "Can't size a test without orders",
      sum: "({zAlpha} × √(2 × {pAvg} × (1 − {pAvg})) + {zBeta} × √({convRate} × (1 − {convRate}) + {p2Rate} × (1 − {p2Rate})))² ÷ ({p2Rate} − {convRate})², rounded up = {=}",
      means: "The standard sample-size formula for comparing two rates. Halve the lift you want to find and the test needs about four times as many visitors.",
    },
    { id: "testTotal", label: "Visitors the whole test needs", unit: "count", formula: "IF(HAS(testVisitors), testVisitors * 2, NA())", none: "Can't size a test without orders", sum: "{testVisitors} × 2 versions = {=}", means: "Split evenly between the two versions." },
    { id: "testOrders", label: "Orders each version gets, about", unit: "count", formula: "IF(HAS(testVisitors), testVisitors * convRate / 100, NA())", none: "Can't size a test without orders", sum: "{testVisitors} × {convRate} = {=}", means: "Decide the size before you start, and don't stop early when one side looks ahead." },
    { id: "testWeeks", label: "Weeks to run the test", unit: "weeks", formula: "IF(HAS(testTotal), testTotal / (visitors * 12 / 52), NA())", none: "Can't size a test without orders", sum: "{testTotal} ÷ ({visitors} × 12 ÷ 52 weeks) = {=}", means: "At your traffic, sending every visitor into the test." },
    { id: "blendNow", label: "Conversion rate at today's mix", unit: "percent", formula: "coldShare / 100 * coldRate + (1 - coldShare / 100) * warmRate", sum: "{coldShare} × {coldRate} + (100% − {coldShare}) × {warmRate} = {=}", means: "Your overall rate is a mix of the two groups." },
    { id: "blendNext", label: "Conversion rate if you spend more on ads", unit: "percent", formula: "coldShareNext / 100 * coldRate + (1 - coldShareNext / 100) * warmRate", sum: "{coldShareNext} × {coldRate} + (100% − {coldShareNext}) × {warmRate} = {=}", means: "More new visitors pull the overall rate toward theirs." },
    { id: "blendChange", label: "Change in your conversion rate", unit: "points", formula: "blendNext - blendNow", sum: "{blendNext} − {blendNow} = {=}", means: "This change comes from the mix of visitors alone. Nothing on the page changed." },
  ],
  answer: [
    [
      { if: "NOT(HAS(convRate))", text: "With no visitors there's nothing to measure yet. Come back when the page has traffic." },
      { if: "orders = 0", text: "No orders yet, so each visitor is worth nothing so far and a test can't be sized." },
      { text: "Each visitor is worth {rpv} in revenue, at a {convRate} conversion rate." },
    ],
    [{ if: "HAS(testWeeks)", text: "To spot a {lift} lift you need {testVisitors} visitors on each version. At your traffic that's about {testWeeks}." }],
    [{ text: "If new visitors from ads go from {coldShare} to {coldShareNext} of your traffic, your conversion rate moves from {blendNow} to {blendNext}, with no change to the page." }],
  ],
  next: [
    { slug: "ab-test-traffic-checker", why: "Paste your numbers and get a plain read of them, and whether a test can give a trusted answer." },
    { slug: "landing-page-30-point-checker", why: "Find what stops visitors buying, so your test tries a change worth making." },
  ],
  sources: [
    { what: "Revenue per visitor", how: "Orders × average order value ÷ visitors." },
    { what: "Visitors a test needs", how: "The standard sample-size formula for comparing two proportions: a two-sided z-test with the normal approximation, no continuity correction." },
    { what: "Blended rate", how: "A weighted average of the two groups' rates." },
  ],
  notes: [
    "The test sizes assume two versions with visitors split evenly.",
    "A week is 12 ÷ 52 of a month here, so a month's visitors spread evenly over 4.33 weeks.",
  ],
};
