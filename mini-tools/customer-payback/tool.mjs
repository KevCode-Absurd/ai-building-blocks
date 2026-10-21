// Customer payback. The single source of truth for this mini tool.
//
// Maths: profit per order = order value x profit share. The first order is placed on day one, and after that a customer
// places a steady number of orders a month (an average over everyone who bought, those who leave included).
// Profit after m months = profit per order x (1 + orders a month x m) - cost to win them. Payback months =
// (cost to win / profit per order - 1) / orders a month, or 0 if the first order covers the cost. Most you can pay to win a
// customer who must pay back in t months = profit per order x (1 + orders a month x t).
// Standard customer acquisition cost payback formulas, written in our own words.
// This is the steady pace view. The repeat customer profit tool uses a share who come back each time instead.

export default {
  slug: "customer-payback",
  name: "Know how many months a new customer takes to pay back",
  /** The plain name, used where the tool talks about itself. */
  short: "Customer payback",
  headline: "Know how many months a new customer takes to pay back what they cost to win",
  summary: "Type what a customer costs to win, their order value, your margin and how often they buy. You get the months to pay back, and the most you can spend.",
  question: "How many months until a new customer has paid back what it cost to win them, and what is the most I can spend to win one?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    {
      id: "cac", label: "Cost to win a new customer", unit: "money", example: 45, min: 0, max: 1e9, step: 1,
      help: "Your ad and marketing spend divided by the new customers it brought in.",
      where: "Ad and marketing spend for the last 90 days divided by first-time customers in the same days.",
      tools: ["Meta Ads Manager", "Google Ads", "Shopify customer reports", "A spreadsheet"],
    },
    {
      id: "orderValue", label: "Average order value", unit: "money", example: 60, min: 0, max: 1e9, step: 1,
      help: "What a customer pays on one average order, one sale or one booking.",
      where: "Revenue divided by orders for the last 90 days.",
      tools: ["Shopify analytics", "Google Analytics", "Your accounts software", "A spreadsheet of your sales"],
    },
    {
      id: "margin", label: "Share of each order you keep as profit", unit: "percent", example: 40, min: 0, max: 100, step: 1,
      help: "What is left of an order after goods, delivery and fees, as a share of the price. Do not take ad costs off here.",
      where: "Profit per order divided by order value. The order margin tool works it out.",
      tools: ["The order margin tool", "Xero or QuickBooks", "Shopify analytics"],
    },
    {
      id: "ordersMonth", label: "Orders a customer places each month after the first", unit: "number", example: 0.25, min: 0, max: 100, step: 0.05,
      help: "Count everyone who bought, including those who never came back. One order every 4 months is 0.25.",
      where: "Orders after each customer's first, divided by the customers and the months you watched them. Use a group who bought at least 6 months ago.",
      tools: ["Shopify customer reports", "Klaviyo", "A spreadsheet of your orders"],
    },
    {
      id: "target", label: "Months you want to pay back within", unit: "count", example: 6, min: 0, max: 120, step: 1,
      help: "How long you can wait to get your ad money back. Many small shops use 3 to 6 months.",
      where: "Your own limit: how long your cash can stay tied up.",
      tools: ["Your cash flow forecast", "Your accountant"],
    },
  ],
  outputs: [
    {
      id: "profitPerOrder", label: "Profit from one order, before ads", unit: "money",
      formula: "orderValue * margin / 100",
      sum: "{orderValue} × {margin} = {=}",
      means: "What each order adds toward paying back the cost to win.",
    },
    {
      id: "gap", label: "Still to win back after the first order", unit: "money",
      formula: "MAX(cac - profitPerOrder, 0)",
      sum: "{cac} − {profitPerOrder}, never below 0 = {=}",
      means: [
        { if: "gap = 0", text: "Nothing: the first order pays for the customer." },
        { text: "This is what later orders have to cover." },
      ],
    },
    {
      id: "ordersToPay", label: "Orders until a customer pays back", unit: "count",
      formula: "IF(cac <= profitPerOrder, 1, IF(AND(profitPerOrder > 0, ordersMonth > 0), ROUNDUP(cac / profitPerOrder, 0), NA()))", none: "Never, at these numbers",
      sum: "{cac} ÷ {profitPerOrder}, rounded up = {=}",
      means: "Counting the first order.",
    },
    {
      id: "paybackMonths", label: "Months until a customer pays back", unit: "months",
      formula: "IF(cac <= profitPerOrder, 0, IF(AND(profitPerOrder > 0, ordersMonth > 0), (cac / profitPerOrder - 1) / ordersMonth, NA()))", none: "Never, at these numbers",
      sum: "({cac} ÷ {profitPerOrder} − 1) ÷ {ordersMonth} a month = {=}",
      means: "How long your ad money is tied up in each new customer.",
    },
    {
      id: "worth3", label: "What a customer leaves after 3 months", unit: "money",
      formula: "profitPerOrder * (1 + ordersMonth * 3) - cac",
      sum: "{profitPerOrder} × (1 + {ordersMonth} × 3) − {cac} = {=}",
      means: [{ if: "worth3 < 0", text: "Still a loss at 3 months." }, { text: "Profit after 3 months, once you have paid to win them." }],
    },
    {
      id: "worth6", label: "What a customer leaves after 6 months", unit: "money",
      formula: "profitPerOrder * (1 + ordersMonth * 6) - cac",
      sum: "{profitPerOrder} × (1 + {ordersMonth} × 6) − {cac} = {=}",
      means: [{ if: "worth6 < 0", text: "Still a loss at 6 months." }, { text: "Profit after 6 months, once you have paid to win them." }],
    },
    {
      id: "worth12", label: "What a customer leaves after 12 months", unit: "money",
      formula: "profitPerOrder * (1 + ordersMonth * 12) - cac",
      sum: "{profitPerOrder} × (1 + {ordersMonth} × 12) − {cac} = {=}",
      means: [{ if: "worth12 < 0", text: "Still a loss at 12 months." }, { text: "Profit after a year, once you have paid to win them." }],
    },
    {
      id: "maxCac", label: "Most to spend to win a customer and pay back in time", unit: "money",
      formula: "profitPerOrder * (1 + ordersMonth * target)",
      sum: "{profitPerOrder} × (1 + {ordersMonth} × {target}) = {=}",
      means: "Spend more than this and a customer takes longer than your limit to pay back.",
    },
  ],
  answer: [
    [
      { if: "profitPerOrder <= 0", text: "Each order keeps nothing before ads, so a customer never pays back the {cac}. Fix your order margin first." },
      { if: "cac <= profitPerOrder", text: "The first order pays back the {cac} it cost to win the customer. You can spend up to {maxCac} and still pay back within {target} months." },
      { if: "NOT(HAS(paybackMonths))", text: "A customer never pays back the {cac} at these numbers, because they do not order again. Each one leaves {worth12} after a year." },
      { if: "paybackMonths > target", text: "A customer pays back the {cac} after about {paybackMonths}, on order {ordersToPay}. That is longer than your {target} months limit. To fit it, spend no more than {maxCac}." },
      { text: "A customer pays back the {cac} after about {paybackMonths}, on order {ordersToPay}. That is inside your {target} months limit. You could spend up to {maxCac}." },
    ],
  ],
  next: [
    { slug: "cac-payback-checker", why: "Check whether your payback is safe enough to keep scaling ad spend." },
    { slug: "ltgp-to-cac-checker", why: "Rate the profit each customer brings against what they cost to win." },
    { if: "OR(NOT(HAS(paybackMonths)), paybackMonths > target)", slug: "store-ltv-payback-reader", why: "Read your customer reports to see why payback is slow." },
  ],
  sources: [
    { what: "Profit per order", how: "Order value × profit share, before ad costs." },
    { what: "Payback", how: "Months until profit per order × orders so far covers the cost to win the customer. A standard customer acquisition cost payback sum." },
    { what: "Most to spend", how: "Profit per order × (1 + orders a month × months you can wait)." },
  ],
  notes: [
    "The order pace is the same every month. In real life it often slows over time, so use a group of customers you have watched for 6 months or more.",
    "Money now and money later count the same here. There is no discount for waiting.",
    "To model a share of customers who come back each time, use the repeat customer profit tool.",
  ],
};
