// Stock weeks of cover. The single source of truth for this mini tool.
//
// Maths: weekly sales = units sold in the last 4 weeks / 4. Weeks of cover = (units on hand + units on the way) / weekly
// sales. Sell-through = units sold / (units sold + units on hand), over the same 4 weeks. Cash tied up = units on hand x
// unit cost. Units you want = weekly sales x the weeks of cover you want. Extra units = what you have and have coming
// above that; short = what you are missing below it. Weeks to sell down to your target = extra units / weekly sales.
// Standard stock cover and sell-through sums, written in our own words.

export default {
  slug: "stock-weeks-of-cover",
  name: "Know how many weeks your stock lasts and how much is more than you need",
  /** The plain name, used where the tool talks about itself. */
  short: "Weeks of stock",
  headline: "Know how many weeks your stock lasts at today's pace, and how much cash sits in stock you do not need",
  summary: "Type your units on hand, what you sold in the last 4 weeks, what is on the way and the weeks of cover you want. You get weeks of cover, sell-through, the cash tied up and the extra or missing units.",
  question: "How many weeks will my stock last at today's sales pace, how much cash is tied up in it, and how many units are more than I need?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "ecommerce", label: "Online store" }],
  inputs: [
    { id: "onHand", label: "Units on hand", unit: "count", example: 1200, min: 0, max: 1e9, step: 50, integer: true, help: "Sellable units in your warehouse or store today, for one product or one range.", where: "Your inventory report today.", tools: ["Shopify inventory", "Your warehouse system", "A stock count"] },
    { id: "sold4", label: "Units sold in the last 4 weeks", unit: "count", example: 400, min: 0, max: 1e9, step: 10, integer: true, help: "Units of the same product sold in the last 28 days. Use a normal 4 weeks, not a sale.", where: "Your sales report, last 28 days, for the same product.", tools: ["Shopify analytics", "Your seller account", "Your till system"] },
    { id: "incoming", label: "Units on the way", unit: "count", example: 0, min: 0, max: 1e9, step: 50, integer: true, help: "Units you have ordered that have not arrived. Use 0 if nothing is coming.", where: "Your open purchase orders.", tools: ["Your purchase orders", "Your supplier's confirmation"] },
    { id: "targetWeeks", label: "Weeks of cover you want", unit: "weeks", example: 8, min: 0, max: 520, step: 1, help: "How many weeks of sales you want on hand. Supplier lead time plus a safety margin is a common choice.", where: "Your lead time in weeks, plus a buffer. The reorder point tool works out the buffer.", tools: ["The reorder point tool", "Your supplier's lead time"] },
    { id: "unitCost", label: "What one unit cost you", unit: "money", example: 9, min: 0, max: 1e9, step: 0.5, help: "What you paid for one unit, landed.", where: "Your supplier and freight invoices divided by units, or the landed cost tool.", tools: ["The landed cost tool", "Your supplier invoices"] },
  ],
  outputs: [
    { id: "weeklySales", label: "Units you sell a week", unit: "number", formula: "sold4 / 4", sum: "{sold4} ÷ 4 = {=}", means: "Today's pace. Seasons and sales change it, so refresh it often." },
    { id: "cover", label: "Weeks your stock lasts", unit: "weeks", formula: "IF(weeklySales > 0, (onHand + incoming) / weeklySales, NA())", none: "No sales, so it never runs out", sum: "({onHand} + {incoming}) ÷ {weeklySales} a week = {=}", means: [
      { if: "NOT(HAS(cover))", text: "Nothing sold in the last 4 weeks, so at this pace the stock never moves." },
      { text: "What you have and have coming, at today's pace." },
    ] },
    { id: "sellThrough", label: "Sell-through over the last 4 weeks", unit: "percent", formula: "IF(onHand + sold4 > 0, sold4 / (onHand + sold4) * 100, NA())", none: "No stock and no sales", sum: "{sold4} ÷ ({sold4} + {onHand}) = {=}", means: "Of the stock you had 4 weeks ago, the share you sold. Low numbers mean slow stock." },
    { id: "cashTied", label: "Cash tied up in stock on hand", unit: "money", formula: "onHand * unitCost", sum: "{onHand} × {unitCost} = {=}", means: "Money sitting on shelves instead of in the bank." },
    { id: "targetUnits", label: "Units you want to hold", unit: "number", formula: "weeklySales * targetWeeks", sum: "{weeklySales} × {targetWeeks} = {=}", means: "Enough for the weeks of cover you chose, at today's pace." },
    { id: "excessUnits", label: "Units more than you need", unit: "number", formula: "MAX(0, onHand + incoming - targetUnits)", sum: "{onHand} + {incoming} − {targetUnits}, never below 0 = {=}", means: [
      { if: "excessUnits = 0", text: "None: you hold your target or less." },
      { text: "Stock above your target. Candidates for a bundle, a sale or a smaller next order." },
    ] },
    { id: "excessCash", label: "Cash in the units you do not need", unit: "money", formula: "excessUnits * unitCost", sum: "{excessUnits} × {unitCost} = {=}", means: "What you could have in the bank instead." },
    { id: "shortUnits", label: "Units short of your target", unit: "number", formula: "MAX(0, targetUnits - onHand - incoming)", sum: "{targetUnits} − {onHand} − {incoming}, never below 0 = {=}", means: [
      { if: "shortUnits = 0", text: "None: you have at least your target." },
      { text: "Order at least this many to reach the cover you want." },
    ] },
    { id: "weeksToTarget", label: "Weeks until stock is down to your target", unit: "weeks", formula: "IF(weeklySales > 0, excessUnits / weeklySales, NA())", none: "No sales", sum: "{excessUnits} ÷ {weeklySales} a week = {=}", means: "How long before you should reorder, if nothing changes." },
  ],
  answer: [
    [
      { if: "NOT(HAS(sellThrough))", text: "No stock and no sales, so there is nothing to work out. Type your units on hand and what you sold." },
      { if: "NOT(HAS(cover))", text: "You sold nothing in the last 4 weeks, so your {onHand} units ({cashTied}) never run out at this pace. All of it is more than you need." },
      { if: "excessUnits > 0", text: "At {weeklySales} units a week your stock lasts about {cover}. You want {targetWeeks} of cover, so {excessUnits} units ({excessCash}) are more than you need. It takes {weeksToTarget} to sell down to your target." },
      { if: "shortUnits > 0", text: "At {weeklySales} units a week your stock lasts about {cover}, under the {targetWeeks} you want. You are {shortUnits} units short of your target." },
      { text: "At {weeklySales} units a week your stock lasts about {cover}, exactly the {targetWeeks} you want." },
    ],
    [
      { if: "AND(HAS(sellThrough), HAS(cover))", text: "You sold {sellThrough} of the stock you had 4 weeks ago, and {cashTied} is tied up in what is left." },
    ],
  ],
  next: [
    { slug: "inventory-cash-planner", why: "Time your next order and the cash it needs, with a downside case." },
    { if: "excessUnits > 0", slug: "sale-offer-ladder-planner", why: "Turn the extra units into a sale offer with backups, without giving the margin away." },
    { if: "shortUnits > 0", slug: "plan-the-cash-for-your-next-stock-order", why: "Work out the cash for the order that closes the gap, and the terms to ask for." },
    { slug: "cash-lever-ranker", why: "See how freeing this cash ranks against your other cash levers." },
  ],
  sources: [
    { what: "Weeks of cover", how: "Units on hand and on the way ÷ units sold a week. The standard stock cover sum." },
    { what: "Sell-through", how: "Units sold ÷ (units sold + units on hand) over the same period. The standard sell-through rate." },
  ],
  notes: [
    "Four weeks is a short window. If the last 4 weeks had a sale or a holiday, use a normal 4 weeks instead.",
    "The pace stays flat here. Seasonal products need a forecast, not a straight line.",
    "Cash in stock is not lost. It comes back as the units sell, slowly, with storage costs along the way.",
  ],
};
