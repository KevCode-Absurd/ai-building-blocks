// Returns cost calculator. The single source of truth for this mini tool.
//
// Maths: returns = orders x return rate. Each return costs you its return shipping + handling time (minutes / 60 x
// hourly cost) + the goods you can't resell (cost x (1 - share you can resell)). Cost of returns a month =
// returns x cost per return. Per order = return rate x cost per return. Refunds handed back = returns x share
// refunded x order value; they are money back to customers, not extra cost, so they are shown apart.
// These are standard cost-to-serve formulas, written in our own words.

export default {
  slug: "returns-cost-calculator",
  name: "Product return cost calculator",
  /** The plain name, used where the tool talks about itself. */
  short: "Product return cost calculator",
  headline: "Product return cost calculator",
  summary: "Enter orders, return rate and handling costs. Estimate monthly return costs, cost per order and refunds shown separately.",
  question: "What do product returns cost before refunds are shown separately?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "ecommerce", label: "Online store" }],
  inputs: [
    {
      id: "orders", label: "Orders a month", unit: "count", example: 1000, min: 0, max: 1e9, step: 50, integer: true,
      help: "Orders you ship in an average month.",
      where: "Your orders report for the last 3 months, divided by 3.",
      tools: ["Shopify orders", "Your store admin"],
    },
    {
      id: "aov", label: "Average order value", unit: "money", example: 50, min: 0, max: 1e9, step: 1,
      help: "What a customer pays for an average order.",
      where: "Revenue divided by orders for the last 90 days.",
      tools: ["Shopify analytics", "Google Analytics"],
    },
    {
      id: "cost", label: "What the goods in an average order cost you", unit: "money", example: 20, min: 0, max: 1e9, step: 0.5,
      help: "What you paid for the products in an order, not the price a customer pays.",
      where: "Your cost of goods report, or supplier invoices divided by units.",
      tools: ["Shopify (cost per item)", "Xero or QuickBooks", "Your supplier invoices"],
    },
    {
      id: "returnRate", label: "Share of orders that come back", unit: "percent", example: 10, min: 0, max: 100, step: 0.5,
      help: "Returned orders divided by all orders.",
      where: "Your returns report: returns in a month divided by orders in that month.",
      tools: ["Shopify returns", "Your returns app", "A spreadsheet of returns"],
    },
    {
      id: "refundShare", label: "Share of returns you refund", unit: "percent", example: 80, min: 0, max: 100, step: 5,
      help: "The rest are exchanges or store credit.",
      where: "Your returns report: refunds divided by returns.",
      tools: ["Shopify returns", "Your returns app"],
    },
    {
      id: "returnShip", label: "Return shipping you pay per return", unit: "money", example: 5, min: 0, max: 1e9, step: 0.5,
      help: "The label cost when you pay it. Use 0 if customers pay for return shipping.",
      where: "Your courier or returns app invoices divided by returns.",
      tools: ["Your courier invoices", "Your returns app"],
    },
    {
      id: "handlingMins", label: "Handling time per return, in minutes", unit: "number", example: 6, min: 0, max: 600, step: 1,
      help: "Opening it, checking it, putting it back or writing it off, and updating your records.",
      where: "Time a few returns with a stopwatch, or ask whoever packs them.",
      tools: ["Your warehouse or packing team"],
    },
    {
      id: "hourly", label: "What an hour of that work costs you", unit: "money", example: 20, min: 0, max: 1e6, step: 1,
      help: "Pay plus employer costs for the person doing it, or your own hourly rate.",
      where: "Payroll, or your hourly rate.",
      tools: ["Your payroll", "A spreadsheet"],
    },
    {
      id: "resell", label: "Share of returned stock you can resell", unit: "percent", example: 70, min: 0, max: 100, step: 5,
      help: "Goods that go back on the shelf as new. The rest are damaged, used or past their date.",
      where: "Your returned stock log: items restocked divided by items returned.",
      tools: ["Your inventory system", "A spreadsheet"],
    },
  ],
  outputs: [
    {
      id: "returns", label: "Returns a month", unit: "count",
      formula: "orders * returnRate / 100",
      sum: "{orders} × {returnRate} = {=}",
      means: "How many orders come back in a month.",
    },
    {
      id: "shippingCost", label: "Return shipping a month", unit: "money",
      formula: "returns * returnShip",
      sum: "{returns} × {returnShip} = {=}",
      means: "The labels you pay for.",
    },
    {
      id: "handlingCost", label: "Handling time a month", unit: "money",
      formula: "returns * handlingMins / 60 * hourly",
      sum: "{returns} × {handlingMins} minutes ÷ 60 × {hourly} = {=}",
      means: "Paid time spent on returns, even if the person is you.",
    },
    {
      id: "writeOff", label: "Stock you can't resell, a month", unit: "money",
      formula: "returns * (1 - resell / 100) * cost",
      sum: "{returns} × (100% − {resell}) × {cost} = {=}",
      means: [
        { if: "resell = 100", text: "You resell everything that comes back, so none is lost." },
        { text: "What you paid for goods that can't go back on the shelf." },
      ],
    },
    {
      id: "returnsCost", label: "What returns cost you a month", unit: "money",
      formula: "shippingCost + handlingCost + writeOff",
      sum: "{shippingCost} + {handlingCost} + {writeOff} = {=}",
      means: "Money and goods you don't get back, on top of any refunds.",
    },
    {
      id: "costPerReturn", label: "Cost of one return", unit: "money",
      formula: "returnShip + handlingMins / 60 * hourly + (1 - resell / 100) * cost",
      sum: "{returnShip} + {handlingMins} minutes ÷ 60 × {hourly} + (100% − {resell}) × {cost} = {=}",
      means: "What each returned order costs you, whether or not you refund it.",
    },
    {
      id: "costPerOrder", label: "Cost of returns on every order", unit: "money",
      formula: "returnRate / 100 * costPerReturn",
      sum: "{returnRate} × {costPerReturn} = {=}",
      means: "Spread across all orders, returned or not. Take it off your profit per order.",
    },
    {
      id: "costShare", label: "Cost of returns as a share of sales", unit: "percent",
      formula: "IF(orders * aov > 0, returnsCost / (orders * aov) * 100, 0)",
      sum: "{returnsCost} ÷ ({orders} × {aov}) = {=}",
      means: "How much of your sales goes on returns.",
    },
    {
      id: "refundValue", label: "Refunds handed back a month", unit: "money",
      formula: "returns * refundShare / 100 * aov",
      sum: "{returns} × {refundShare} × {aov} = {=}",
      means: "Sales you give back. It is not an extra cost, but it takes that revenue away.",
    },
    {
      id: "pointCost", label: "What one more point of return rate costs a month", unit: "money",
      formula: "orders / 100 * costPerReturn",
      sum: "{orders} ÷ 100 × {costPerReturn} = {=}",
      means: "Use it to size a fix: cutting the rate by one point saves this much.",
    },
  ],
  answer: [
    [
      { if: "returns = 0", text: "With no returns, nothing is lost. Each return you do get will cost you {costPerReturn}." },
      { text: "Returns cost you {returnsCost} a month. That is {costPerReturn} for each return, and {costPerOrder} on every order you ship." },
    ],
    [
      { if: "returns = 0", text: "Cutting your rate won't save anything until returns start." },
      { text: "You also hand back {refundValue} in refunds. Each point off your return rate saves {pointCost} a month." },
    ],
  ],
  next: [
    { slug: "returns-policy-designer", why: "Set refund timing and keep-it rules with these costs in mind." },
    { slug: "post-purchase-survey-reader", why: "Read what buyers say after they order, to find why they return." },
  ],
  sources: [
    { what: "Cost of a return", how: "Return shipping + handling time + goods you can't resell. A standard cost-to-serve sum." },
  ],
  notes: [
    "Return shipping and handling are real even when you refund the order, which is why refunds are shown apart.",
    "Outbound shipping and payment fees on a returned order are usually not refunded to you. Add them into the return shipping box to count them.",
    "It treats an exchange as a return with no refund and ignores the cost of sending the replacement.",
  ],
};
