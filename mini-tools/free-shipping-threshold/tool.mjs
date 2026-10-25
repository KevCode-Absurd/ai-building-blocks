// Free shipping threshold. The single source of truth for this mini tool: the site page, the download,
// the spreadsheet, the AI skill and the embed are all built from this file.
//
// Maths: what an order leaves before postage = order value x margin. Postage is covered when that leaves enough:
// the lowest line = postage cost / (margin x the share of margin you let postage take). A line set only there can sit
// below what customers spend now, so it asks nobody to spend more. The line to aim for is the higher of that and your
// average order plus a reachable stretch, rounded up to a whole amount. At the line, postage takes
// postage cost / (line x margin) of the margin.
// These are standard break-even and contribution margin formulas, written in our own words.

export default {
  slug: "free-shipping-threshold",
  name: "Free shipping minimum calculator",
  /** The plain name, used where the tool talks about itself. */
  short: "Free shipping minimum calculator",
  headline: "Free shipping minimum calculator",
  summary: "Enter average order value, margin and postage costs. Calculate a free shipping minimum and the profit left at that level.",
  question: "What order minimum keeps free shipping within my chosen cost limit?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "ecommerce", label: "Online store" }],
  inputs: [
    {
      id: "aov", label: "Average order value", unit: "money", example: 60, min: 0.01, max: 1e9, step: 1,
      help: "What a customer spends in an average order now, before postage.",
      where: "Your average order value for the last 90 days: sales divided by orders, with shipping left out.",
      tools: ["Shopify analytics", "Google Analytics", "Your accounts software"],
    },
    {
      id: "margin", label: "What you keep from an order before postage", unit: "percent", example: 40, min: 0, max: 100, step: 1,
      help: "The share of the order value left after the goods, payment fees and anything else that comes with an order, but before postage and before ads. This is your gross margin.",
      where: "Your profit report: order value minus goods and fees, divided by order value, for the last 90 days.",
      tools: ["Shopify profit reports", "Xero or QuickBooks", "A spreadsheet of your orders"],
    },
    {
      id: "shipping", label: "What postage costs you per order", unit: "money", example: 8, min: 0, max: 1e9, step: 0.5,
      help: "What you pay the carrier for the average parcel, including the box and packing. Use what you pay, not what the customer is charged.",
      where: "Your carrier invoices for the last 90 days divided by the parcels sent.",
      tools: ["Shopify shipping reports", "ShipStation", "Your courier invoices"],
    },
    {
      id: "allowance", label: "Most of your margin that postage may use", unit: "percent", example: 50, min: 1, max: 100, step: 5,
      help: "How much of what an order leaves you before postage you are happy to spend on free postage. 100 means postage can take all of it, so the order only breaks even. 50 means you keep at least half.",
      where: "Your own choice. Start at 50 and see what changes.",
      tools: [],
    },
    {
      id: "stretch", label: "How far above the average order to set the line", unit: "percent", example: 20, min: 0, max: 200, step: 5,
      help: "Customers will add an item to reach free shipping if the gap is small. 20 means a line 20% above your average order. A line far above what people spend now gets ignored.",
      where: "Your own choice. A 10 to 30 stretch is a common place to start. Test it.",
      tools: ["Your order export", "A histogram of order values"],
    },
  ],
  outputs: [
    {
      id: "marginAov", label: "What an average order leaves before postage", unit: "money",
      formula: "aov * margin / 100",
      sum: "{aov} × {margin} = {=}",
      means: "The money an average order has to pay for postage.",
    },
    {
      id: "profitAvgFree", label: "What an average order leaves if postage is free", unit: "money",
      formula: "marginAov - shipping",
      sum: "{marginAov} − {shipping} postage = {=}",
      means: [
        { if: "profitAvgFree < 0", text: "A loss: free postage on an average order costs you {=:abs}. That is why the line has to sit above it." },
        { text: "Free postage on an average order still leaves you this much." },
      ],
    },
    {
      id: "lowestLine", label: "Lowest line where postage stays within your limit", unit: "money",
      about: "Below this order value, free postage takes more of your margin than you want to give.",
      formula: "IF(AND(margin > 0, allowance > 0), shipping / (margin / 100 * allowance / 100), NA())",
      none: "No line works",
      sum: "{shipping} ÷ ({margin} × {allowance}) = {=}",
      means: [
        { if: "NOT(HAS(lowestLine))", text: "An order leaves you nothing before postage, so no minimum can make free postage pay." },
        { if: "lowestLine = 0", text: "Postage costs you nothing, so no line is needed to cover it." },
        { text: "The least an order can be worth for the postage to fit inside your limit." },
      ],
    },
    {
      id: "reachLine", label: "A line customers can reach", unit: "money",
      formula: "aov * (1 + stretch / 100)",
      sum: "{aov} × (100% + {stretch}) = {=}",
      means: "Just above what people spend now, so a customer is one item away.",
    },
    {
      id: "threshold", label: "Free shipping minimum to set", unit: "money",
      formula: "IF(HAS(lowestLine), ROUNDUP(MAX(lowestLine, reachLine), 0), NA())",
      none: "No line works",
      sum: "The higher of {lowestLine} and {reachLine}, rounded up = {=}",
      means: [
        { if: "NOT(HAS(threshold))", text: "No minimum makes free postage pay at these numbers. Look at your margin or your postage cost first." },
        { text: "Set free shipping for orders at or above this. It says nothing about how many customers will add an item to reach it." },
      ],
    },
    {
      id: "extraToAdd", label: "What a customer with an average order adds to reach it", unit: "money",
      formula: "IF(HAS(threshold), threshold - aov, NA())",
      none: "No line works",
      sum: "{threshold} − {aov} = {=}",
      means: [
        { if: "extraToAdd > aov", text: "More than doubling an order is a lot to ask. Expect few customers to reach this line." },
        { text: "The gap between an average order and the line." },
      ],
    },
    {
      id: "postageShare", label: "Share of the margin postage takes at the line", unit: "percent",
      formula: "IF(HAS(threshold), 100 * shipping / (threshold * margin / 100), NA())",
      none: "No line works",
      sum: "{shipping} ÷ ({threshold} × {margin}) = {=}",
      means: "On an order that only just reaches the line. Bigger orders take a smaller share.",
    },
    {
      id: "profitAtLine", label: "What an order at the line leaves after postage", unit: "money",
      formula: "IF(HAS(threshold), threshold * margin / 100 - shipping, NA())",
      none: "No line works",
      sum: "{threshold} × {margin} − {shipping} postage = {=}",
      means: "The least a free-shipping order leaves you. Orders above the line leave more.",
    },
  ],
  answer: [
    [
      { if: "NOT(HAS(threshold))", text: "Orders leave you nothing before postage at these numbers, so no free shipping minimum can pay for itself. Fix your margin first." },
      { if: "shipping = 0", text: "Postage costs you nothing, so you don't need a minimum to cover it. Set one only to lift the size of orders, near {threshold}." },
      { text: "Set free shipping at {threshold}. An order that just reaches it leaves you {profitAtLine} after postage, and postage takes {postageShare} of its margin." },
    ],
    [
      { if: "NOT(HAS(threshold))", text: "Check your margin and your postage cost, then try again." },
      { if: "extraToAdd > aov", text: "That is {extraToAdd} above an average order, more than doubling it. Few customers will get there, so look for cheaper postage or a higher margin." },
      { if: "profitAvgFree < 0", text: "Free postage on an average order would lose you {profitAvgFree:abs}, so the minimum has to sit above the average order." },
      { text: "An average order is {extraToAdd} short of the line, which is a gap one more item can close." },
    ],
  ],
  compare: { input: "stretch", label: "At other stretches above the average order", values: [10, 20, 30], outputs: ["reachLine", "threshold", "postageShare"] },
  next: [
    { slug: "order-threshold-planner", why: "Set the line from your real order values, so it sits just above where customers already stop." },
    { slug: "shipping-rate-planner", why: "Plan your shipping zones and rates, and check each one covers the real postage cost." },
    { if: "NOT(HAS(threshold))", slug: "product-margin-checker", why: "Find where each order loses its margin before you offer free postage." },
  ],
  sources: [
    { what: "What an order leaves before postage", how: "Order value × margin. A standard contribution margin sum." },
    { what: "Lowest line", how: "Postage cost ÷ (margin × the share of margin postage may use). The standard break-even order value for a cost per order." },
    { what: "Line to set", how: "The higher of the lowest line and the average order plus a reachable stretch, rounded up. The stretch idea comes from the order threshold planner skill." },
  ],
  notes: [
    "Postage is one average cost for every order. Heavy or far-away parcels cost more, so check your own zones.",
    "This shows what a free-shipping order leaves you. It does not count the postage you now charge, or the extra orders a free-shipping offer may bring.",
    "A line that is too far above the average order gets ignored. Look at your real order values and test the line.",
  ],
};
