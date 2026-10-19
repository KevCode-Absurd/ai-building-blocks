// Discount calculator. The single source of truth for this mini tool: the site page, the download,
// the spreadsheet, the AI skill and the embed are all built from this file.
//
// Maths: profit per order = price - costs per order. At a discount the price falls and the costs per order
// stay the same. To keep the same total profit, orders must rise by profit at full price / profit at the
// discount. Break-even return on ad spend = revenue / what an order keeps before ads.
// These are standard margin formulas, written in our own words.

export default {
  slug: "discount-calculator",
  name: "See what a discount does to your profit",
  /** The plain name, used where the tool talks about itself. */
  short: "Discount calculator",
  headline: "See what a discount does to your profit before you run it",
  summary: "Type your price, costs and discount. You get your profit per order, and how many more sales you need to make up for it.",
  question: "What does 10%, 20% or 30% off do to my profit per order, and how much more must I sell to come out even?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-19",
  presets: [
    { id: "general", label: "Any business" },
    { id: "ecommerce", label: "Online store" },
  ],
  inputs: [
    {
      id: "price", label: "Full price of one order", unit: "money", example: 60, min: 0.01, max: 1e9, step: 1,
      help: "What a customer pays for an average order, or one sale or booking, with no discount.",
      where: "Your average order value at full price: revenue divided by orders for the last 90 days, at a time with no sale running.",
      tools: ["Shopify analytics", "Google Analytics", "Your accounts software", "A spreadsheet of your sales"],
    },
    {
      id: "cost", label: "What one order costs you", unit: "money", example: 24, min: 0, max: 1e9, step: 1,
      help: "What you pay for the goods in one order, or to deliver the service.",
      where: "Your cost of goods report, or your supplier invoices divided by the units you sold.",
      tools: ["Shopify (cost per item)", "Xero or QuickBooks", "Your supplier invoices"],
    },
    {
      id: "shipping", label: "Shipping and packing per order", unit: "money", example: 6, min: 0, max: 1e9, step: 0.5, boards: ["ecommerce"],
      help: "Postage, boxes and packing fees for one order. Add any fixed fee your payment provider charges per order here too.",
      where: "Your shipping costs for the last 90 days divided by the number of orders.",
      tools: ["Shopify shipping reports", "ShipStation", "Your courier or warehouse invoices"],
    },
    {
      id: "fee", label: "Payment fees", unit: "percent", example: 3, min: 0, max: 50, step: 0.1, boards: ["ecommerce"],
      help: "The share of each payment your payment provider keeps.",
      where: "Your payouts report: fees divided by sales for the last 90 days.",
      tools: ["Shopify Payments", "Stripe", "PayPal"],
    },
    {
      id: "roas", label: "Return on ad spend", unit: "x", example: 3, min: 0, max: 1000, step: 0.1, boards: ["ecommerce"],
      help: "Revenue from ads for every 1 you spend on them. 3 means 3 back for every 1 spent. Use 0 if you don't pay for ads.",
      where: "Your ads account, last 30 days: revenue from ads divided by ad spend.",
      tools: ["Meta Ads Manager", "Google Ads", "Shopify analytics"],
    },
    {
      id: "discount", label: "Discount", unit: "percent", example: 20, min: 0, max: 100, step: 5,
      help: "The share off the full price. 20 means 20% off.",
      where: "The discount you are thinking of running.",
      tools: [],
    },
  ],
  outputs: [
    {
      id: "adCost", label: "Ad cost to win one order", unit: "money", boards: ["ecommerce"],
      formula: "IF(roas > 0, price / roas, 0)",
      sum: "{price} ÷ {roas} = {=}",
      means: [
        { if: "roas = 0", text: "You don't pay for ads, so this is zero." },
        { text: "What you pay in ads for one order today. We keep it the same at the discount, so the discount alone is what changes." },
      ],
    },
    {
      id: "feeFull", label: "Payment fees at full price", unit: "money", boards: ["ecommerce"],
      formula: "price * fee / 100",
      sum: "{price} × {fee} = {=}",
      means: "What your payment provider keeps from a full-price order.",
    },
    {
      id: "profitFull", label: "Profit per order at full price", unit: "money",
      formula: "price - cost - shipping - feeFull - adCost",
      sum: { general: "{price} − {cost} = {=}", ecommerce: "{price} − {cost} goods − {shipping} shipping − {feeFull} fees − {adCost} ads = {=}" },
      means: [
        { if: "profitFull < 0", text: "A loss: you lose {=:abs} on every order before any discount." },
        { text: "What one order leaves you today, with no discount." },
      ],
    },
    {
      id: "salePrice", label: "Price after the discount", unit: "money",
      formula: "price * (1 - discount / 100)",
      sum: "{price} × (100% − {discount}) = {=}",
      means: "What the customer pays at the discount.",
    },
    {
      id: "feeSale", label: "Payment fees at the discount", unit: "money", boards: ["ecommerce"],
      formula: "salePrice * fee / 100",
      sum: "{salePrice} × {fee} = {=}",
      means: "Fees fall a little, because the customer pays less.",
    },
    {
      id: "keptSale", label: "Left from a discounted order before ads", unit: "money", boards: ["ecommerce"],
      formula: "salePrice - cost - shipping - feeSale",
      sum: "{salePrice} − {cost} goods − {shipping} shipping − {feeSale} fees = {=}",
      means: [
        { if: "keptSale <= 0", text: "Nothing is left to pay for ads, so no return on ad spend can make this order pay." },
        { text: "What a discounted order leaves before you pay for the ad that won it." },
      ],
    },
    {
      id: "profitSale", label: "Profit per order at the discount", unit: "money",
      formula: "salePrice - cost - shipping - feeSale - adCost",
      sum: { general: "{salePrice} − {cost} = {=}", ecommerce: "{keptSale} − {adCost} ads = {=}" },
      means: [
        { if: "profitSale < 0", text: "A loss: you lose {=:abs} on every order at this discount. Selling more makes the loss bigger." },
        { if: "profitSale = 0", text: "You make nothing on each order at this discount." },
        { text: "What one order leaves you at the discount." },
      ],
    },
    {
      id: "profitChange", label: "Change in profit per order", unit: "money", about: "How much less each order makes at the discount than at full price.",
      formula: "profitSale - profitFull",
      sum: "{profitSale} − {profitFull} = {=}",
      means: [
        { if: "profitChange < 0", text: "Each order makes {=:abs} less than it does at full price." },
        { text: "No change to your profit per order." },
      ],
    },
    {
      id: "ordersNeeded", label: "Orders you need for every 100 you sell now", unit: "number",
      formula: "IF(AND(profitFull > 0, profitSale > 0), 100 * profitFull / profitSale, NA())",
      none: "No number of orders is enough",
      sum: "100 × {profitFull} ÷ {profitSale} = {=}",
      means: [
        { if: "NOT(HAS(ordersNeeded))", text: "There is no profit at the discount (or at full price) to make up, so more orders can't bring your profit back." },
        { text: "To make the same profit as 100 full-price orders, you need this many orders at the discount." },
      ],
    },
    {
      id: "extraSales", label: "More sales you need to make the same profit", unit: "percent",
      formula: "IF(HAS(ordersNeeded), ordersNeeded - 100, NA())",
      none: "Selling more can't make it up",
      sum: "{ordersNeeded} − 100 = {=} more",
      means: "How much more you must sell, at the discount, just to stand still.",
    },
    {
      id: "breakEvenRoas", label: "Lowest return on ad spend that breaks even at the discount", unit: "x", boards: ["ecommerce"],
      formula: "IF(keptSale > 0, salePrice / keptSale, NA())",
      none: "No return is enough",
      sum: "{salePrice} ÷ {keptSale} = {=}",
      means: [
        { if: "NOT(HAS(breakEvenRoas))", text: "A discounted order leaves nothing before ads, so no return on ad spend breaks even." },
        { text: "Your ads must bring in at least this much for every 1 you spend, or each discounted order loses money." },
      ],
    },
  ],
  answer: [
    [
      { if: "profitFull <= 0", text: "You lose {profitFull:abs} on every order even at full price. Fix your price or costs before you run any discount." },
      { if: "profitSale < 0", text: "At {discount} off you lose {profitSale:abs} on every order. Selling more only makes the loss bigger." },
      { if: "profitSale = 0", text: "At {discount} off you make nothing on each order, so selling more doesn't help." },
      { if: "discount = 0", text: "With no discount you keep {profitFull} on each order." },
      { text: "At {discount} off you keep {profitSale} an order instead of {profitFull}. To make the same profit, you need to sell {extraSales} more." },
    ],
  ],
  compare: { input: "discount", label: "At other discounts", values: [10, 20, 30], outputs: ["salePrice", "profitSale", "extraSales"] },
  next: [
    { if: "profitSale <= 0", slug: "find-offers-hiding-in-what-you-already-sell", why: "Find an offer that doesn't cost you money on every order." },
    { slug: "get-an-offer-that-answers-your-buyers-doubt", why: "Before you cut the price, try an offer that answers why buyers hold back." },
  ],
  sources: [
    { what: "Profit per order", how: "Price minus the costs of one order (goods, shipping, payment fees and ads). A standard contribution margin sum." },
    { what: "More sales you need", how: "Profit at full price ÷ profit at the discount, minus 1. The standard break-even volume sum for a price cut." },
    { what: "Break-even return on ad spend", how: "Revenue ÷ what an order keeps before ads. The standard break-even ROAS sum." },
  ],
  notes: [
    "Ad cost per order stays the same at the discount. If the discount makes your ads work better, your real cost per order falls.",
    "Costs per order stay the same at the discount. Bigger orders at a sale would change them.",
  ],
};
