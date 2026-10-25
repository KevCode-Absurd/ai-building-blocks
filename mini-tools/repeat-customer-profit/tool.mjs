// Repeat customer profit. The single source of truth for this mini tool.
//
// Maths: each time a reorder comes round, a share r of the customers who ordered last time order again.
// Over k chances to reorder, one customer places 1 + r + r^2 + ... + r^k orders on average, which is
// (1 - r^(k+1)) / (1 - r) (or k + 1 when everyone comes back). Their worth = profit per order x orders - cost to win them.
// It pays back on the first order where the running total covers the cost to win them. A standard
// customer lifetime value sum with a fixed repeat rate, in our own words. A month is 30.4375 days (365.25 / 12).

const DAYS = 30.4375;
const r = "comeBack / 100";
const orders = (months) => `IF(comeBack = 100, reorders${months} + 1, (1 - (${r}) ^ (reorders${months} + 1)) / (1 - ${r}))`;

const horizon = (m) => [
  { id: `reorders${m}`, label: `Chances to reorder in ${m} months`, unit: "count", formula: `ROUNDDOWN(${m} * ${DAYS} / daysBetween, 0)`, sum: `${m} months × ${DAYS} days ÷ {daysBetween}, rounded down = {=}`, means: "How many times a reorder comes round in that time." },
  { id: `orders${m}`, label: `Orders per customer in ${m} months`, unit: "number", formula: orders(m), sum: `1 + {comeBack} + {comeBack}² + … for {reorders${m}} reorders = {=}`, means: "The first order, plus the share who come back each time." },
  {
    id: `worth${m}`, label: `What a customer leaves after ${m} months`, unit: "money", formula: `profitPerOrder * orders${m} - cac`, sum: `{profitPerOrder} × {orders${m}} − {cac} to win them = {=}`,
    means: [{ if: `worth${m} < 0`, text: `Still a loss: after ${m} months a customer hasn't paid back what they cost to win.` }, { text: `Profit per customer after ${m} months, once you've paid to win them.` }],
  },
];

export default {
  slug: "repeat-customer-profit",
  name: "Repeat customer profit estimate",
  /** The plain name, used where the tool talks about itself. */
  short: "Repeat customer profit estimate",
  headline: "Repeat customer profit estimate",
  summary: "Enter profit per order, reorder timing, repeat rate and customer cost. Estimate profit after 3, 6 and 12 months.",
  question: "What profit might repeat orders leave after the cost of gaining a customer?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-19",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    {
      id: "profitPerOrder", label: "Profit from one order, before ad costs", unit: "money", example: 25, min: -1e9, max: 1e9, step: 1,
      help: "What one order leaves after goods, shipping and fees. The order margin tool works it out.",
      where: "The order margin tool, or your profit and loss report: gross profit divided by orders.",
      tools: ["Shopify analytics", "Xero or QuickBooks", "A spreadsheet of your sales"],
    },
    {
      id: "cac", label: "Cost to win a new customer", unit: "money", example: 40, min: 0, max: 1e9, step: 1,
      help: "Your ad and marketing spend divided by the new customers it brought in.",
      where: "Ad spend for the last 90 days divided by first-time customers in the same days.",
      tools: ["Meta Ads Manager", "Google Ads", "Shopify customer reports"],
    },
    {
      id: "daysBetween", label: "Days between orders", unit: "days", example: 60, min: 1, max: 3650, step: 1,
      help: "How long a repeat customer usually waits before ordering again. For a 30-day supply, about 30.",
      where: "Your customer report. Find the average days between a first and second order.",
      tools: ["Shopify customer reports", "Klaviyo", "A spreadsheet of your orders"],
    },
    {
      id: "comeBack", label: "Share who order again each time", unit: "percent", example: 40, min: 0, max: 100, step: 5,
      help: "Of the customers who ordered last time, the share who order again.",
      where: "Your customer report. Divide customers with two or more orders by all customers over a year.",
      tools: ["Shopify analytics (returning customer rate)", "Klaviyo", "Google Analytics"],
    },
  ],
  outputs: [
    ...horizon(3),
    ...horizon(6),
    ...horizon(12),
    {
      id: "longRunOrders", label: "Orders per customer, in the long run", unit: "number",
      formula: "IF(comeBack < 100, 1 / (1 - comeBack / 100), NA())", none: "No limit: everyone comes back",
      sum: "1 ÷ (100% − {comeBack}) = {=}", means: "The most orders an average customer places, if nothing changes.",
    },
    {
      id: "longRunWorth", label: "The most a customer can be worth", unit: "money",
      formula: "IF(HAS(longRunOrders), profitPerOrder * longRunOrders - cac, NA())", none: "No limit",
      sum: "{profitPerOrder} × {longRunOrders} − {cac} = {=}",
      means: [{ if: "longRunWorth <= 0", text: "A loss: even in the long run, a customer never pays back what they cost to win." }, { text: "A customer's worth if they keep ordering at this rate for good." }],
    },
    {
      id: "paybackReorders", label: "Reorders until a customer pays back", unit: "count", helper: true,
      formula: "IF(profitPerOrder <= 0, NA(), IF(cac <= profitPerOrder, 0, IF(comeBack = 100, ROUNDUP(cac / profitPerOrder - 1, 0), IF(OR(comeBack = 0, cac * (1 - comeBack / 100) >= profitPerOrder), NA(), ROUNDUP(LN(1 - cac * (1 - comeBack / 100) / profitPerOrder) / LN(comeBack / 100) - 1, 0)))))",
      sum: "{=}", means: "",
    },
    {
      id: "paybackOrder", label: "The order that pays back the cost to win them", unit: "count",
      formula: "IF(HAS(paybackReorders), paybackReorders + 1, NA())", none: "Never, at these numbers",
      sum: "The first order where {profitPerOrder} × orders so far is at least {cac}: order {=}",
      means: "Every order after this one is profit.",
    },
    {
      id: "paybackMonths", label: "Time until the cost to win them pays back", unit: "months",
      formula: "IF(HAS(paybackReorders), paybackReorders * daysBetween / 30.4375, NA())", none: "Never, at these numbers",
      sum: "{paybackReorders} reorders × {daysBetween} ÷ 30.4375 days = {=}",
      means: "How long your ad money is tied up in each new customer.",
    },
  ],
  answer: [
    [
      { if: "profitPerOrder <= 0", text: "Each order loses money before ads, so a customer never pays back. Fix your order margin first." },
      { if: "NOT(HAS(paybackOrder))", text: "At these numbers a customer never pays back the {cac} it costs to win them. The most one is worth is {longRunWorth}." },
      { if: "paybackOrder = 1", text: "The first order pays back the {cac} it cost to win the customer. After 12 months, each one leaves you {worth12}." },
      { text: "A customer pays back the {cac} it cost to win them on order {paybackOrder}, after about {paybackMonths}. After 12 months, each one leaves you {worth12}." },
    ],
  ],
  next: [
    { if: "OR(NOT(HAS(paybackOrder)), paybackOrder > 2)", slug: "hidden-offer-finder", why: "Find an offer that brings customers back sooner, so they pay back faster." },
    { slug: "customer-buying-reasons-finder", why: "Learn why your repeat buyers come back, in their own words, and say it in your ads." },
  ],
  sources: [
    { what: "Orders per customer", how: "1 + r + r² + … + r^k = (1 − r^(k+1)) ÷ (1 − r), the sum of a geometric series, with r the share who come back each time." },
    { what: "Customer worth", how: "Profit per order × orders − cost to win them. A standard customer lifetime value sum." },
    { what: "Payback", how: "The first order where the running total of profit covers the cost to win them." },
  ],
  notes: [
    "The share who come back is the same every time. In real life it's often lower after the first order and higher later.",
    "Money now and money in a year count the same here. There's no discount for waiting.",
  ],
};
