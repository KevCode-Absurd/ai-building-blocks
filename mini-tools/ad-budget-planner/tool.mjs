// Ad budget planner. The single source of truth for this mini tool.
//
// Maths: return on ad spend (ROAS) = sales from ads / ad spend. With a cost per click and a conversion rate,
// ROAS = order value x conversion rate / cost per click; or you type the ROAS you expect. Sales needed = your sales goal,
// or, for a profit goal after ad costs, profit goal / (profit share of a sale - 1 / ROAS). Orders = sales / order value.
// Ad budget = sales / ROAS. Clicks needed = orders / conversion rate. Break-even ROAS = 1 / profit share of a sale.
// Profit after ads = sales x profit share - ad budget. A month is 30.4375 days (365.25 / 12).
// Standard ad budget and ROAS formulas, written in our own words.

export default {
  slug: "ad-budget-planner",
  name: "Ad budget and sales goal planner",
  /** The plain name, used where the tool talks about itself. */
  short: "Ad budget and sales goal planner",
  headline: "Ad budget and sales goal planner",
  summary: "Enter a sales or profit goal, order value and ad results. Estimate spend, clicks, orders and profit after ads.",
  question: "What ad budget would my sales or profit goal need at these results?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    {
      id: "salesGoal", label: "Sales you want from ads each month", unit: "money", example: 20000, min: 0, max: 1e10, step: 500,
      help: "The money you want ads to bring in each month. Leave it at 0 if you use a profit goal below.",
      where: "Your own target. For a start, take the ad-driven sales in your ad report for last month.",
      tools: ["Meta Ads Manager", "Google Ads", "Your store or sales report", "A spreadsheet"],
    },
    {
      id: "profitGoal", label: "Or profit you want from ads each month, after ad costs", unit: "money", example: 0, min: 0, max: 1e10, step: 500,
      help: "Use this instead of a sales goal. When it is above 0, it is used and the sales goal is ignored.",
      where: "Your own target. Check it against last month's profit and loss report.",
      tools: ["Xero or QuickBooks", "A spreadsheet"],
    },
    {
      id: "orderValue", label: "Average order value", unit: "money", example: 50, min: 0.01, max: 1e9, step: 1,
      help: "What a customer pays on one average order, one sale or one booking.",
      where: "Revenue divided by orders for the last 90 days.",
      tools: ["Shopify analytics", "Google Analytics", "Your accounts software", "A spreadsheet of your sales"],
    },
    {
      id: "convRate", label: "Share of clicks that become orders", unit: "percent", example: 2.5, min: 0, max: 100, step: 0.1,
      help: "Of the people who click your ad, the share who buy.",
      where: "Orders from ads divided by ad clicks, for the last 30 days.",
      tools: ["Meta Ads Manager", "Google Ads", "Google Analytics"],
    },
    {
      id: "cpc", label: "Cost per click", unit: "smallmoney", example: 0.5, min: 0, max: 1e6, step: 0.05,
      help: "What one click on your ad costs you. Leave it at 0 if you type a return on ad spend below.",
      where: "Your ad report: cost per link click, or cost per click, for the last 30 days.",
      tools: ["Meta Ads Manager", "Google Ads", "TikTok Ads Manager"],
    },
    {
      id: "roas", label: "Or return on ad spend you expect", unit: "x", example: 0, min: 0, max: 1000, step: 0.1,
      help: "Sales from ads divided by ad spend. When it is above 0 it is used instead of the cost per click.",
      where: "Your ad report: purchase conversion value divided by amount spent, for the last 30 days.",
      tools: ["Meta Ads Manager", "Google Ads", "Your store reports"],
    },
    {
      id: "margin", label: "Share of each sale you keep as profit, before ads", unit: "percent", example: 50, min: 0, max: 100, step: 1,
      help: "What is left of a sale after goods, delivery and fees, as a share of the price.",
      where: "Profit per order divided by order value. The order margin tool works it out.",
      tools: ["The order margin tool", "Xero or QuickBooks", "Shopify analytics"],
    },
  ],
  outputs: [
    {
      id: "roasUsed", label: "Return on ad spend used", unit: "x",
      formula: "IF(roas > 0, roas, IF(AND(cpc > 0, convRate > 0, orderValue > 0), orderValue * convRate / 100 / cpc, NA()))",
      none: "Type a cost per click, or a return on ad spend",
      sum: "{orderValue} × {convRate} ÷ {cpc} per click = {=}",
      means: "Each $1 of ads brings in this much in sales. It comes from your return on ad spend if you typed one.",
    },
    {
      id: "breakEven", label: "Return you need to break even", unit: "x",
      formula: "IF(margin > 0, 100 / margin, NA())", none: "Never: a sale keeps no profit",
      sum: "100% ÷ {margin} = {=}",
      means: "Below this return, each sale costs more in ads than it keeps.",
    },
    {
      id: "salesNeeded", label: "Sales you need each month", unit: "money",
      formula: "IF(profitGoal > 0, IF(AND(HAS(roasUsed), margin > 0), IF(margin / 100 > 1 / roasUsed, profitGoal / (margin / 100 - 1 / roasUsed), NA()), NA()), salesGoal)",
      none: "None: this goal can't be met",
      sum: "{profitGoal} profit ÷ ({margin} kept − 1 ÷ {roasUsed}) = {=}",
      means: "What ads must bring in. With a sales goal, it is your goal.",
    },
    {
      id: "ordersNeeded", label: "Orders you need each month", unit: "count",
      formula: "IF(HAS(salesNeeded), salesNeeded / orderValue, NA())", none: "None",
      sum: "{salesNeeded} ÷ {orderValue} = {=}",
      means: "The sales you need, split into average orders.",
    },
    {
      id: "budget", label: "Ad budget you need each month", unit: "money",
      formula: "IF(AND(HAS(salesNeeded), HAS(roasUsed)), salesNeeded / roasUsed, NA())", none: "None",
      sum: "{salesNeeded} ÷ {roasUsed} = {=}",
      means: "This assumes your return holds as you spend more. It often falls as you scale.",
    },
    {
      id: "dailyBudget", label: "Ad budget a day", unit: "money",
      formula: "IF(HAS(budget), budget / 30.4375, NA())", none: "None",
      sum: "{budget} ÷ 30.4375 days = {=}",
      means: "The daily budget to set on your ad account.",
    },
    {
      id: "clicksNeeded", label: "Clicks you need each month", unit: "count",
      formula: "IF(AND(HAS(ordersNeeded), convRate > 0), ordersNeeded / (convRate / 100), NA())", none: "Type the share of clicks that become orders",
      sum: "{ordersNeeded} ÷ {convRate} = {=}",
      means: "The visitors your ads must send.",
    },
    {
      id: "costPerOrder", label: "Ad cost to win one order", unit: "money",
      formula: "IF(AND(HAS(budget), HAS(ordersNeeded)), IF(ordersNeeded > 0, budget / ordersNeeded, 0), NA())", none: "None",
      sum: "{budget} ÷ {ordersNeeded} = {=}",
      means: "Compare it with the profit one order keeps before ads.",
    },
    {
      id: "profitAfterAds", label: "Profit left after ad costs", unit: "money",
      formula: "IF(HAS(budget), salesNeeded * margin / 100 - budget, NA())", none: "None",
      sum: "{salesNeeded} × {margin} − {budget} = {=}",
      means: [
        { if: "profitAfterAds < 0", text: "A loss: at this return, ads cost more than the sales keep." },
        { text: "What you keep each month, before overheads and tax." },
      ],
    },
  ],
  answer: [
    [
      { if: "AND(profitGoal <= 0, salesGoal <= 0)", text: "Type a sales goal or a profit goal, and this works out the budget." },
      { if: "NOT(HAS(roasUsed))", text: "Type a cost per click and the share of clicks that become orders, or the return on ad spend you expect." },
      { if: "NOT(HAS(salesNeeded))", text: "A profit goal can't be met at these numbers. You need a return above {breakEven} just to break even, and you have {roasUsed}. Raise your return or your profit share." },
      { if: "NOT(HAS(clicksNeeded))", text: "To bring in {salesNeeded} a month, spend {budget} on ads, about {dailyBudget} a day. Type the share of clicks that become orders to see the traffic you need." },
      { if: "profitAfterAds < 0", text: "To bring in {salesNeeded} a month, you would spend {budget} on ads. That is a loss of {profitAfterAds}: each $1 of ads brings in {roasUsed} and you need {breakEven}." },
      { text: "To bring in {salesNeeded} a month, spend {budget} on ads, about {dailyBudget} a day. That needs {clicksNeeded} clicks and {ordersNeeded} orders. You keep {profitAfterAds} after ad costs." },
    ],
  ],
  next: [
    { slug: "break-even-roas-and-cpa-calculator", why: "Test whether your ad costs fit inside what a sale keeps, with a go or fix verdict." },
    { slug: "small-budget-ad-test-planner", why: "Test an ad on a small budget before you spend the full amount." },
    { if: "OR(NOT(HAS(budget)), profitAfterAds < 0)", slug: "channel-budget-mix-planner", why: "Move money to the ad channels that return more." },
  ],
  sources: [
    { what: "Return on ad spend", how: "Sales from ads ÷ ad spend. With clicks: order value × conversion rate ÷ cost per click. A standard ad sum." },
    { what: "Ad budget", how: "Sales needed ÷ return on ad spend. Sales needed for a profit goal: profit ÷ (profit share − 1 ÷ return)." },
    { what: "Traffic", how: "Orders ÷ conversion rate gives the clicks you need." },
  ],
  notes: [
    "The return is held steady. In real life it often falls as you spend more, so treat the budget as a start and check it each week.",
    "It says nothing about whether enough people can see your ads to send that many clicks. Check the reach in your ad account.",
    "Profit is before overheads and tax. Check tax numbers with a qualified person.",
  ],
};
