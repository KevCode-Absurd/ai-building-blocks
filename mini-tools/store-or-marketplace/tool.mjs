// Store or marketplace. The single source of truth for this mini tool.
//
// Maths: on your own store an order costs you payment fees (price x fee rate) + shipping and packing + the ads to win it.
// On a marketplace it costs the marketplace's fee (price x fee rate) + its fulfilment or shipping fee + the ads there.
// What each channel keeps = price - goods - that channel's costs. The gap is your store's kept minus the marketplace's,
// and a month's gap is that x orders. The marketplace fee at which both keep the same =
// (price - goods - marketplace fulfilment - marketplace ads - what your store keeps) / price.
// Standard contribution margin sums, written in our own words.

export default {
  slug: "store-or-marketplace",
  name: "See whether an order keeps more on your store or on a marketplace",
  /** The plain name, used where the tool talks about itself. */
  short: "Channel margin",
  headline: "See whether an order keeps more on your own store or on a marketplace, fees and ads counted",
  summary: "Type your price and cost of goods, then each channel's fees, shipping and ad cost per order. You get what an order keeps on each, the gap a month and the marketplace fee that would make them equal.",
  question: "Does an order keep more on my own store or on a marketplace, once fees, shipping and ads are counted, and what is that worth a month?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "ecommerce", label: "Online store" }],
  sections: [
    { id: "numbers", label: "The order" },
    { id: "store", label: "On your own store" },
    { id: "market", label: "On the marketplace" },
  ],
  inputs: [
    { id: "price", label: "Price of one order", unit: "money", example: 40, min: 0, max: 1e9, step: 1, help: "What the buyer pays, the same on both channels for a fair comparison.", where: "Your average order value, or the item's price.", tools: ["Shopify analytics", "Your seller account"] },
    { id: "cogs", label: "What the goods in one order cost you", unit: "money", example: 12, min: 0, max: 1e9, step: 0.5, help: "What you paid for the products, landed. The same on both channels.", where: "Your cost of goods report, or supplier invoices divided by units.", tools: ["Shopify (cost per item)", "The landed cost tool"] },
    { id: "orders", label: "Orders a month", unit: "count", example: 300, min: 0, max: 1e9, step: 10, integer: true, help: "How many orders you are deciding about. The sum uses the same number on both channels.", where: "Your orders for the last 3 months, divided by 3.", tools: ["Shopify orders", "Your seller account"] },
    { id: "storeFee", label: "Payment fees on your store", unit: "percent", example: 3, min: 0, max: 100, step: 0.1, section: "store", help: "The share of each payment your payment provider keeps.", where: "Your payouts report: fees divided by sales.", tools: ["Shopify Payments", "Stripe", "PayPal"] },
    { id: "storeShip", label: "Shipping and packing per order on your store", unit: "money", example: 6, min: 0, max: 1e6, step: 0.5, section: "store", help: "Postage, box and packing for one order, less what the customer pays for shipping.", where: "Your shipping costs for the last 90 days divided by orders.", tools: ["Shopify shipping reports", "Your courier invoices"] },
    { id: "storeAd", label: "Ad cost to win one order on your store", unit: "money", example: 10, min: 0, max: 1e6, step: 1, section: "store", help: "Your ad spend divided by the orders it brought. Use 0 if your store orders come free.", where: "Your ads accounts: spend divided by orders, last 30 days.", tools: ["Meta Ads Manager", "Google Ads"] },
    { id: "marketFee", label: "Marketplace fee", unit: "percent", example: 15, min: 0, max: 100, step: 0.5, section: "market", help: "The share of the price the marketplace keeps for the sale, including its payment handling.", where: "The marketplace's fee schedule for your category.", tools: ["Your seller account's fee schedule"] },
    { id: "marketFulfil", label: "Fulfilment or shipping per order on the marketplace", unit: "money", example: 7, min: 0, max: 1e6, step: 0.5, section: "market", help: "What the marketplace charges to pick, pack and ship one order, or your own shipping cost if you ship it.", where: "The marketplace's fee calculator for your item.", tools: ["Your seller account's revenue calculator"] },
    { id: "marketAd", label: "Ad cost to win one order on the marketplace", unit: "money", example: 4, min: 0, max: 1e6, step: 0.5, section: "market", help: "Your ad spend on the marketplace divided by the orders it brought. Use 0 if you do not advertise there.", where: "The marketplace's ads dashboard: spend divided by orders.", tools: ["Your seller account's ads dashboard"] },
  ],
  outputs: [
    { id: "storeCosts", label: "What your store costs per order", unit: "money", group: "Your own store", formula: "price * storeFee / 100 + storeShip + storeAd", sum: "{price} × {storeFee} + {storeShip} + {storeAd} = {=}", means: "Payment fees, shipping and ads on your store." },
    { id: "storeKept", label: "What an order keeps on your store", unit: "money", group: "Your own store", formula: "price - cogs - storeCosts", sum: "{price} − {cogs} − {storeCosts} = {=}", means: [{ if: "storeKept < 0", text: "A loss of {=:abs} on every order." }, { text: "Profit on one order on your own store." }] },
    { id: "storePct", label: "Margin on your store", unit: "percent", group: "Your own store", formula: "IF(price > 0, storeKept / price * 100, NA())", none: "No price", sum: "{storeKept} ÷ {price} = {=}", means: "The share of the price you keep on your store." },
    { id: "marketCosts", label: "What the marketplace costs per order", unit: "money", group: "The marketplace", formula: "price * marketFee / 100 + marketFulfil + marketAd", sum: "{price} × {marketFee} + {marketFulfil} + {marketAd} = {=}", means: "The marketplace's fee, fulfilment and ads there." },
    { id: "marketKept", label: "What an order keeps on the marketplace", unit: "money", group: "The marketplace", formula: "price - cogs - marketCosts", sum: "{price} − {cogs} − {marketCosts} = {=}", means: [{ if: "marketKept < 0", text: "A loss of {=:abs} on every order." }, { text: "Profit on one order on the marketplace." }] },
    { id: "marketPct", label: "Margin on the marketplace", unit: "percent", group: "The marketplace", formula: "IF(price > 0, marketKept / price * 100, NA())", none: "No price", sum: "{marketKept} ÷ {price} = {=}", means: "The share of the price you keep on the marketplace." },
    { id: "gap", label: "Your store keeps this much more per order", unit: "money", group: "Side by side", about: "What your store keeps minus what the marketplace keeps, per order. Below zero, the marketplace keeps more.", formula: "storeKept - marketKept", sum: "{storeKept} − {marketKept} = {=}", means: [
      { if: "gap > 0", text: "Above zero: your store keeps more on each order." },
      { if: "gap < 0", text: "Below zero: the marketplace keeps {=:abs} more on each order." },
      { text: "Both keep the same." },
    ] },
    { id: "gapMonth", label: "The gap, a month", unit: "money", group: "Side by side", formula: "gap * orders", sum: "{gap} × {orders} orders = {=}", means: "With the same orders on either channel. In practice each channel brings its own buyers." },
    { id: "matchFee", label: "Marketplace fee at which both keep the same", unit: "percent", group: "Side by side", formula: "IF(price > 0, (price - cogs - marketFulfil - marketAd - storeKept) / price * 100, NA())", none: "No price", sum: "({price} − {cogs} − {marketFulfil} − {marketAd} − {storeKept}) ÷ {price} = {=}", means: "Above this fee, your store wins. Below it, the marketplace does. Handy when fees change." },
  ],
  answer: [
    [
      { if: "price <= 0", text: "With no price there is nothing to compare. Type the price of one order." },
      { if: "AND(storeKept <= 0, marketKept <= 0)", text: "Neither channel keeps anything: your store loses {storeKept:abs} an order and the marketplace loses {marketKept:abs}. Fix the price or the costs before you pick a channel." },
      { if: "gap > 0", text: "Your own store keeps {storeKept} an order ({storePct}) and the marketplace {marketKept} ({marketPct}), so your store keeps {gap} more: {gapMonth} a month at {orders} orders. The marketplace only matches it with a fee under {matchFee}." },
      { if: "gap < 0", text: "The marketplace keeps {marketKept} an order ({marketPct}) and your own store {storeKept} ({storePct}), so the marketplace keeps {gap:abs} more: {gapMonth:abs} a month at {orders} orders. If the marketplace fee rose above {matchFee}, your store would win." },
      { text: "Your own store and the marketplace both keep {storeKept} an order. Pick on who owns the customer and the data, since the money is the same." },
    ],
  ],
  next: [
    { slug: "amazon-fee-and-margin-checker", why: "Check the marketplace's real fees for your item's size and category." },
    { slug: "one-channel-plan", why: "Pick the one way to reach customers first and plan it properly." },
    { if: "gap > 0", slug: "ad-and-page-match-checker", why: "Your store wins on margin. Make sure the ads and the page it lands on match, so the ad cost stays low." },
  ],
  sources: [
    { what: "What an order keeps", how: "Price − goods − that channel's fees, shipping and ads. A standard contribution margin sum." },
    { what: "Fee at which both keep the same", how: "(Price − goods − marketplace fulfilment − marketplace ads − what your store keeps) ÷ price. A standard break-even sum." },
  ],
  notes: [
    "The same orders are counted on both channels. A marketplace often brings buyers you would never reach, and your store gives you their email. Neither is priced here.",
    "Returns, storage and fixed fees are left out. The marketplace unit margin tool counts returns and storage.",
    "Fees differ by category and change over time. Check yours in the fee schedule.",
  ],
};
