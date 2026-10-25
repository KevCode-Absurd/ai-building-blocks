// Creator deal calculator. The single source of truth for this mini tool.
//
// Maths: what the deal costs = fee + the cost of the gift (the product and its postage). Clicks = views x click rate.
// Orders = clicks x the share of clickers who order. Profit per order = order value x margin.
// Profit from the post = orders x profit per order - what the deal cost. It breaks even when orders x profit per order
// equals the cost, so the orders you need = cost / profit per order, and the views you need = that orders
// divided by (click rate x order rate). Views are rounded up. Standard break-even and cost-per-thousand-views sums,
// standard sponsorship return formulas, written in our own words.

export default {
  slug: "creator-deal-calculator",
  name: "Creator post profit calculator",
  /** The plain name, used where the tool talks about itself. */
  short: "Creator post profit calculator",
  headline: "Creator post profit calculator",
  summary: "Enter the fee, gift costs and expected views, clicks and sales. Estimate deal profit and the views needed to break even.",
  question: "How many views and orders would cover this creator deal’s cost?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "fee", label: "Fee for the post", unit: "money", example: 500, min: 0, max: 1e9, step: 50, help: "What you pay the creator. Use 0 for a gift-only deal.", where: "The price in your creator's quote or contract.", tools: ["Your creator's email or contract", "Your agency's quote"] },
    { id: "giftCost", label: "Cost of the gift", unit: "money", example: 30, min: 0, max: 1e9, step: 5, help: "What the product you send costs you, plus postage. It is your cost, not the shop price.", where: "Your cost of goods for the product, plus the courier fee.", tools: ["Your supplier invoices", "Shopify (cost per item)", "Your courier invoices"] },
    { id: "views", label: "Views you expect", unit: "count", example: 40000, min: 0, max: 1e10, step: 1000, help: "The views you expect the post to get. Use the creator's recent average, not their best post.", where: "The creator's last 10 posts of the same kind: add the views and divide by 10.", tools: ["The creator's profile", "Their media kit", "A social analytics tool"] },
    { id: "clickRate", label: "Share of viewers who click your link", unit: "percent", example: 1, min: 0, max: 100, step: 0.1, help: "Use the share of viewers who click your link, based on relevant past posts if available.", where: "Your past creator posts: link clicks divided by views. If you have none, start low.", tools: ["Your link tracker", "Google Analytics", "Shopify analytics"] },
    { id: "convRate", label: "Share of clickers who order", unit: "percent", example: 2, min: 0, max: 100, step: 0.1, help: "Out of everyone who clicks, the share who buy.", where: "Your store's conversion rate for social traffic, for the last 30 days.", tools: ["Shopify analytics", "Google Analytics"] },
    { id: "orderValue", label: "Average order value", unit: "money", example: 50, min: 0, max: 1e9, step: 1, help: "What an order from this post brings in.", where: "Your revenue divided by orders for the last 90 days.", tools: ["Shopify analytics", "Your accounts software"] },
    { id: "margin", label: "Profit margin on an order", unit: "percent", example: 45, min: 0, max: 100, step: 1, help: "The share of each order you keep after goods, shipping and fees, before the cost of this deal.", where: "The order margin tool, or your profit and loss report.", tools: ["Xero or QuickBooks", "Shopify analytics", "A spreadsheet of your sales"] },
  ],
  outputs: [
    { id: "totalCost", label: "What the deal costs you", unit: "money", formula: "fee + giftCost", sum: "{fee} fee + {giftCost} gift = {=}", means: "The money you are out before a single order comes in." },
    { id: "clicks", label: "Clicks to your link", unit: "count", formula: "views * clickRate / 100", sum: "{views} × {clickRate} = {=}", means: "People who view the post and then visit you." },
    { id: "orders", label: "Orders you expect", unit: "number", formula: "clicks * convRate / 100", sum: "{clicks} × {convRate} = {=}", means: "Orders from the post. It can be a fraction, because it is an average." },
    { id: "revenue", label: "Sales from the post", unit: "money", formula: "orders * orderValue", sum: "{orders} × {orderValue} = {=}", means: "What the post brings in before any costs." },
    { id: "profitPerOrder", label: "Profit from one order", unit: "money", formula: "orderValue * margin / 100", sum: "{orderValue} × {margin} margin = {=}", means: "What each order leaves you, before the cost of the deal." },
    { id: "net", label: "Profit or loss on the deal", unit: "money", formula: "orders * profitPerOrder - totalCost", sum: "{orders} × {profitPerOrder} − {totalCost} = {=}", means: [{ if: "net < 0", text: "A loss: the post does not earn back what the deal costs at these numbers." }, { if: "net = 0", text: "You break even exactly." }, { text: "What is left once the orders have paid for the fee and the gift." }] },
    { id: "roas", label: "Sales for every 1 the deal costs", unit: "x", formula: "IF(totalCost > 0, revenue / totalCost, 0)", sum: "{revenue} ÷ {totalCost} = {=}", means: [{ if: "totalCost = 0", text: "The deal costs nothing, so this is zero." }, { text: "Sales, not profit. Compare it with the return your ads need to pay." }] },
    { id: "cpm", label: "Cost for every 1,000 views", unit: "money", formula: "IF(views > 0, totalCost / views * 1000, 0)", sum: "{totalCost} ÷ {views} × 1,000 = {=}", means: "Use it to compare creators with each other and with your ads." },
    { id: "breakEvenOrders", label: "Orders needed to pay back the deal", unit: "number", formula: "IF(profitPerOrder > 0, totalCost / profitPerOrder, NA())", none: "No number of orders is enough", sum: "{totalCost} ÷ {profitPerOrder} = {=}", means: [{ if: "NOT(HAS(breakEvenOrders))", text: "An order leaves you no profit, so no number of orders pays the deal back." }, { text: "Fewer orders than this and the deal loses money." }] },
    { id: "breakEvenViews", label: "Views needed to break even", unit: "count", formula: "IF(AND(profitPerOrder > 0, clickRate > 0, convRate > 0), ROUNDUP(totalCost / (clickRate / 100 * convRate / 100 * profitPerOrder), 0), NA())", none: "No number of views is enough", sum: "{totalCost} ÷ ({clickRate} click × {convRate} order × {profitPerOrder} profit), rounded up = {=}", means: [{ if: "NOT(HAS(breakEvenViews))", text: "Nobody clicks, nobody orders, or an order leaves no profit, so no number of views pays the deal back." }, { text: "Compare it with the views you expect. The post has to beat this to pay." }] },
  ],
  answer: [
    [
      { if: "totalCost = 0", text: "At the costs you entered, there is no fee or gift cost. Estimated profit is {net}." },
      { if: "NOT(HAS(breakEvenViews))", text: "No number of views pays this deal back, because clicks, orders or profit per order are zero. You lose {totalCost}." },
      { if: "net < 0", text: "At {views} views you lose {net:abs} on this deal. It needs {breakEvenViews} views to break even." },
      { if: "net = 0", text: "At {views} views you break even. Any fewer views and you lose money." },
      { text: "At {views} views you make {net} profit on this deal. It breaks even at {breakEvenViews} views." },
    ],
  ],
  next: [
    { slug: "creator-pay-planner", why: "Work out a fair fee from the creator's views and your ad costs." },
    { slug: "creator-ad-roster-builder", why: "Plan a gifting funnel and a roster of creators to test." },
    { slug: "creator-equity-deal-planner", why: "Plan a deal that pays in a share instead of a fee." },
  ],
  sources: [
    { what: "Break-even views", how: "Cost of the deal ÷ (click rate × order rate × profit per order). A standard break-even sum for a sponsored post." },
    { what: "Cost per 1,000 views", how: "Cost of the deal ÷ views × 1,000. The standard cost-per-mille sum." },
  ],
  notes: [
    "It counts the first order only. Customers who come back and order again are worth more, so a deal that loses here can still pay over a year.",
    "Views, click rate and order rate are guesses until you run the post. Run the numbers at a low guess and a high guess.",
  ],
};
