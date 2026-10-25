// Reorder point. The single source of truth for this mini tool.
//
// Maths: demand while you wait = daily sales x supplier lead time (days). Safety stock = z x daily swing x the square root of
// the lead time, where z comes from how often you can afford to run out (the normal curve). Reorder point = demand while you
// wait + safety stock. Order size = daily sales x the days of sales each order should cover. Stock just after an order lands =
// safety stock + order size. Days until you reorder = (stock now - reorder point) / daily sales.
// Standard reorder point and safety stock formulas, written in our own words.

export default {
  slug: "reorder-point",
  name: "Stock reorder planner",
  /** The plain name, used where the tool talks about itself. */
  short: "Stock reorder planner",
  headline: "Stock reorder planner",
  summary: "Enter daily sales, sales variation and delivery time. Estimate spare stock, a reorder point and the quantity to order.",
  question: "At what stock level should I review a reorder, and how many units cover my target?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [
    { id: "general", label: "Any business" },
    { id: "ecommerce", label: "Online store" },
  ],
  inputs: [
    {
      id: "dailySales", label: "Units you sell on an average day", unit: "number", example: 20, min: 0, max: 1e7, step: 1,
      help: "Your usual sales for one item, in units a day. Use a normal stretch, not a sale week.",
      where: "Units sold in the last 90 days, divided by 90.",
      tools: ["Shopify inventory reports", "Amazon Business Reports", "Your sales export in a spreadsheet"],
    },
    {
      id: "swing", label: "Daily sales spread", unit: "number", example: 6, min: 0, max: 1e7, step: 0.5,
      help: "Use the standard deviation of daily unit sales over a normal period. A spreadsheet can calculate it. Use 0 if sales never vary.",
      where: "Put your daily units for the last 90 days in a spreadsheet and use its STDEV function.",
      tools: ["A spreadsheet (STDEV)", "Shopify inventory reports", "Your sales export"],
    },
    {
      id: "leadDays", label: "Days from placing an order to stock on your shelf", unit: "days", example: 30, min: 1, max: 365, step: 1, integer: true,
      help: "Count the whole wait: making, shipping, customs and getting it booked in.",
      where: "Your last two or three orders: the date you ordered and the date it was ready to sell.",
      tools: ["Your purchase orders", "Your supplier emails", "Your shipment tracker"],
    },
    {
      id: "serviceLevel", label: "Chance of not running out while you wait", unit: "percent", example: 95, min: 50, max: 99.9, step: 0.5,
      help: "How often you want stock to last until the next order lands. 95 means you accept running out about 1 wait in 20.",
      where: "Your own choice. A higher number means more spare stock and more cash tied up.",
      tools: ["A spreadsheet"],
    },
    {
      id: "coverDays", label: "Days of sales each order should cover", unit: "days", example: 60, min: 1, max: 730, step: 1, integer: true,
      help: "How long one order should last. Bigger orders mean fewer orders and more cash in stock.",
      where: "Your supplier's minimum order and how much cash you can tie up.",
      tools: ["Your supplier quote", "A spreadsheet"],
    },
    {
      id: "onHand", label: "Units in stock now, plus any already on order", unit: "count", example: 900, min: 0, max: 1e9, step: 10, integer: true,
      help: "Everything you own or have coming, minus anything already sold but not shipped.",
      where: "Your stock count today and your open purchase orders.",
      tools: ["Shopify inventory", "Your warehouse report", "Your purchase orders"],
    },
  ],
  outputs: [
    {
      id: "zScore", label: "Safety factor for your chance", unit: "z",
      formula: "NORMSINV(serviceLevel / 100)",
      sum: "The normal curve's value at {serviceLevel} = {=}",
      means: "The standard safety factor. It grows as you ask for a lower chance of running out.",
    },
    {
      id: "leadDemand", label: "Units you expect to sell while you wait", unit: "count",
      formula: "ROUNDUP(dailySales * leadDays, 0)",
      sum: "{dailySales} × {leadDays} = {=}",
      means: "Stock you need just to last until the order lands, if sales stay average.",
    },
    {
      id: "safetyStock", label: "Spare stock for busy days", unit: "count",
      formula: "ROUNDUP(zScore * swing * SQRT(leadDays), 0)",
      sum: "{zScore} × {swing} × the square root of {leadDays} = {=}",
      means: [
        { if: "safetyStock = 0", text: "Your sales don't swing, or you accept running out half the time, so no spare stock is added." },
        { text: "Extra units kept for days that sell more than average." },
      ],
    },
    {
      id: "reorderPoint", label: "Reorder when stock falls to", unit: "count",
      formula: "leadDemand + safetyStock",
      sum: "{leadDemand} + {safetyStock} spare = {=}",
      means: "Place your next order when your stock, counting units on order, reaches this number.",
    },
    {
      id: "orderQty", label: "Units to order", unit: "count",
      formula: "ROUNDUP(dailySales * coverDays, 0)",
      sum: "{dailySales} × {coverDays} = {=}",
      means: "Check it against your supplier's minimum order and the cash you can spare.",
    },
    {
      id: "stockAfterArrival", label: "Most stock you hold just after an order lands", unit: "count",
      formula: "safetyStock + orderQty",
      sum: "{safetyStock} spare + {orderQty} ordered = {=}",
      means: "Roughly what your shelf or warehouse needs room for.",
    },
    {
      id: "ordersPerYear", label: "Orders you place in a year", unit: "number",
      formula: "IF(orderQty > 0, dailySales * 365 / orderQty, 0)",
      sum: "{dailySales} × 365 ÷ {orderQty} = {=}",
      means: "More orders cost more in admin and freight. Fewer, bigger orders tie up more cash.",
    },
    {
      id: "daysToReorder", label: "Days until you reorder", unit: "days",
      formula: "IF(dailySales > 0, MAX(0, (onHand - reorderPoint) / dailySales), NA())",
      none: "No sales, so no date",
      sum: "({onHand} − {reorderPoint}) ÷ {dailySales} a day = {=}",
      means: [
        { if: "NOT(HAS(daysToReorder))", text: "With no sales, your stock never runs down." },
        { if: "daysToReorder = 0", text: "Your stock is at or below the reorder point. Order now." },
        { text: "How long until stock reaches the reorder point, if sales stay at your average." },
      ],
    },
  ],
  answer: [
    [
      { if: "dailySales = 0", text: "With no daily sales there is nothing to reorder. Type how many units you sell on an average day." },
      { if: "daysToReorder = 0", text: "Order now. You hold {onHand}, which is at or below the reorder point of {reorderPoint}. Order {orderQty} units." },
      { text: "Reorder when stock falls to {reorderPoint}, which is {daysToReorder} from now. Order {orderQty} units. That covers {leadDemand} units while you wait and {safetyStock} spare for busy days." },
    ],
  ],
  compare: { input: "serviceLevel", label: "At other chances of not running out", values: [90, 95, 99], outputs: ["safetyStock", "reorderPoint"] },
  next: [
    { slug: "inventory-cash-planner", why: "Turn this order into the cash you need and when it leaves your account." },
    { slug: "store-revenue-forecast-builder", why: "Plan ahead for a season when your daily sales will not stay average." },
  ],
  sources: [
    { what: "Reorder point", how: "Sales while you wait plus safety stock. The standard reorder point formula." },
    { what: "Safety stock", how: "Safety factor × daily swing × the square root of the lead time. The standard safety stock formula for steady supplier lead times." },
  ],
  notes: [
    "Assumes daily sales vary at random and the delivery time stays fixed. A late delivery, launch, sale or season can make the estimate too low. Update those assumptions before ordering.",
    "Each result rounds up to a whole unit.",
    "It says nothing about what your cash can afford. Check the order size against your cash first.",
  ],
};
