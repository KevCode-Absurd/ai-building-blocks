// Marketplace unit margin. The single source of truth for this mini tool.
//
// Maths: the marketplace's referral fee = price x referral rate. Fees in all = referral fee + fulfilment fee + storage
// per unit. Returns cost per unit = share returned x cost of one return. What a unit leaves before ads = price - fees -
// landed cost of the goods - returns cost. Ad cost per unit = price x ad spend as a share of sales. Profit = before ads
// - ad cost. The most you can spend on ads, as a share of sales, before a unit loses money = what it leaves before ads /
// price. Standard unit economics sums, written in our own words.

export default {
  slug: "marketplace-unit-margin",
  name: "Know what one unit leaves you after marketplace fees and ads",
  /** The plain name, used where the tool talks about itself. */
  short: "Marketplace fee",
  headline: "Know what one unit leaves you after the marketplace's fees, fulfilment and ads",
  summary: "Type your price, the referral fee, fulfilment and storage per unit, what the goods cost you and your ad spend. You get the profit per unit, the margin and the most you can spend on ads.",
  question: "After the marketplace's fees, fulfilment and ads, what does one unit leave me, and what is the most I can spend on ads for every 100 of sales?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "ecommerce", label: "Online store" }],
  inputs: [
    { id: "price", label: "Selling price of one unit", unit: "money", example: 30, min: 0, max: 1e9, step: 1, help: "What the buyer pays, before any sales tax the marketplace collects for you.", where: "Your listing.", tools: ["Your seller account"] },
    { id: "referral", label: "Referral fee", unit: "percent", example: 15, min: 0, max: 100, step: 0.5, help: "The share of the price the marketplace keeps for the sale. It differs by category.", where: "The marketplace's fee schedule for your category, or your settlement report.", tools: ["Your seller account's fee schedule", "Your settlement report"] },
    { id: "fulfil", label: "Fulfilment fee per unit", unit: "money", example: 5.5, min: 0, max: 1e6, step: 0.25, help: "What the marketplace charges to pick, pack and ship one unit. If you ship it yourself, type your own shipping and packing cost.", where: "The marketplace's fee calculator for your item's size and weight, or your settlement report.", tools: ["Your seller account's revenue calculator", "Your settlement report"] },
    { id: "storage", label: "Storage per unit", unit: "money", example: 0.4, min: 0, max: 1e6, step: 0.1, help: "Monthly storage fees spread over the units you sell. Use 0 if you store stock yourself.", where: "Last month's storage fees divided by units sold.", tools: ["Your seller account's storage report"] },
    { id: "cogs", label: "What one unit costs you, landed", unit: "money", example: 8, min: 0, max: 1e9, step: 0.5, help: "What you paid for the unit plus freight, duty and inbound shipping to the warehouse. The landed cost tool works it out.", where: "Your supplier and freight invoices, divided by units.", tools: ["The landed cost tool", "Your supplier invoices"] },
    { id: "returnRate", label: "Share of units sent back", unit: "percent", example: 5, min: 0, max: 100, step: 1, help: "Returns divided by units sold.", where: "Your returns report for the last 90 days.", tools: ["Your seller account's returns report"] },
    { id: "returnCost", label: "What one return costs you", unit: "money", example: 3, min: 0, max: 1e6, step: 0.5, help: "Return processing fees, plus the value of stock you can't resell, per return.", where: "Your returns report and the fee schedule.", tools: ["Your seller account's returns report"] },
    { id: "adShare", label: "Ad spend for every 100 of sales", unit: "percent", example: 20, min: 0, max: 1000, step: 1, help: "Your advertising cost of sales: ad spend divided by the sales it brings, as a percentage. 20 means 20 spent for every 100 sold.", where: "Your ads dashboard, last 30 days.", tools: ["Your seller account's ads dashboard"] },
  ],
  outputs: [
    { id: "referralFee", label: "Referral fee on one unit", unit: "money", formula: "price * referral / 100", sum: "{price} × {referral} = {=}", means: "The marketplace's cut of the sale." },
    { id: "feesTotal", label: "All marketplace fees on one unit", unit: "money", formula: "referralFee + fulfil + storage", sum: "{referralFee} + {fulfil} + {storage} = {=}", means: "Referral, fulfilment and storage, before ads." },
    { id: "feeShare", label: "Share of the price the marketplace keeps", unit: "percent", formula: "IF(price > 0, feesTotal / price * 100, NA())", none: "No price", sum: "{feesTotal} ÷ {price} = {=}", means: "Before ads. Cheap items give up a bigger share, because fulfilment is a flat fee." },
    { id: "returnsCost", label: "Returns cost spread over every unit", unit: "money", formula: "returnRate / 100 * returnCost", sum: "{returnRate} × {returnCost} = {=}", means: "What returns cost you on an average unit sold." },
    { id: "beforeAds", label: "What one unit leaves before ads", unit: "money", formula: "price - feesTotal - cogs - returnsCost", sum: "{price} − {feesTotal} fees − {cogs} goods − {returnsCost} returns = {=}", means: [
      { if: "beforeAds < 0", text: "A loss of {=:abs} before you spend anything on ads." },
      { if: "beforeAds = 0", text: "Nothing left for ads or profit." },
      { text: "What is left to pay for ads and to keep." },
    ] },
    { id: "beforeAdsPct", label: "Margin before ads", unit: "percent", formula: "IF(price > 0, beforeAds / price * 100, NA())", none: "No price", sum: "{beforeAds} ÷ {price} = {=}", means: "The share of the price you keep before ads." },
    { id: "adCost", label: "Ad cost on one unit", unit: "money", formula: "price * adShare / 100", sum: "{price} × {adShare} = {=}", means: "At your ad spend as a share of sales." },
    { id: "profit", label: "Profit on one unit", unit: "money", formula: "beforeAds - adCost", sum: "{beforeAds} − {adCost} = {=}", means: [
      { if: "profit < 0", text: "A loss: every unit sold costs you {=:abs}." },
      { if: "profit = 0", text: "You break even on each unit." },
      { text: "What one unit leaves you after everything." },
    ] },
    { id: "profitPct", label: "Margin after ads", unit: "percent", formula: "IF(price > 0, profit / price * 100, NA())", none: "No price", sum: "{profit} ÷ {price} = {=}", means: "The share of the price you keep after ads." },
    { id: "breakEvenAdShare", label: "Most to spend on ads for every 100 of sales", unit: "percent", formula: "IF(price > 0, MAX(0, beforeAds) / price * 100, NA())", none: "No price", sum: "{beforeAds} ÷ {price}, never below 0 = {=}", means: [
      { if: "breakEvenAdShare = 0", text: "Nothing: a unit already loses money before ads." },
      { text: "Spend more than this share of sales on ads and every unit loses money. Your break-even advertising cost of sales." },
    ] },
  ],
  answer: [
    [
      { if: "price <= 0", text: "With no price there is nothing to work out. Type your selling price." },
      { if: "beforeAds <= 0", text: "Before any ads, one unit at {price} loses {beforeAds:abs}: the marketplace keeps {feesTotal} and the goods cost {cogs}. No ad budget fixes that. Raise the price or cut the landed cost." },
      { if: "profit < 0", text: "One unit at {price} leaves {beforeAds} before ads ({beforeAdsPct}). At {adShare} of sales on ads you lose {profit:abs} a unit. Keep ads under {breakEvenAdShare} of sales to break even." },
      { if: "profit = 0", text: "One unit at {price} leaves {beforeAds} before ads, and your ads take all of it. You break even on each unit." },
      { text: "One unit at {price} leaves {beforeAds} before ads and {profit} after ({profitPct}). The marketplace keeps {feeShare} of the price. Ads can go up to {breakEvenAdShare} of sales before a unit loses money." },
    ],
  ],
  compare: { input: "adShare", label: "At other ad spends", values: [10, 20, 30], outputs: ["adCost", "profit", "profitPct"] },
  next: [
    { slug: "amazon-fee-and-margin-checker", why: "Check every fee for your item's size and category, with a score." },
    { slug: "amazon-unit-profit-checker", why: "Paste your settlement report and get profit per unit and break-even ad cost from real fees." },
    { if: "profit > 0", slug: "amazon-ppc-launch-builder", why: "Build ad campaigns with bids that stay under your break-even ad share." },
  ],
  sources: [
    { what: "Profit per unit", how: "Price − marketplace fees − landed cost − returns cost − ad cost. A standard unit economics sum." },
    { what: "Most to spend on ads", how: "What a unit leaves before ads ÷ price. The standard break-even advertising cost of sales." },
  ],
  notes: [
    "Fees differ by marketplace, category, size and season. Check yours in the fee schedule, and look at a real settlement report.",
    "Storage is spread over units sold. Slow sellers pay far more per unit, and long-term storage fees are not counted here.",
    "Sales tax the marketplace collects and passes on is left out of the price.",
  ],
};
