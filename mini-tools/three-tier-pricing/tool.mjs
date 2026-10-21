// Three-tier pricing. The single source of truth for this mini tool.
//
// Maths: with three prices on the page, the average buyer pays the weighted average of the three prices, weighted by the
// share of buyers who pick each tier (the shares are scaled so they add to 100). Average cost works the same way.
// Average profit a buyer = average price - average cost. One price for everyone leaves price - cost. The gain a buyer
// is the difference, and a month's gain is that x buyers a month, with the same number of buyers either way.
// Standard weighted average and price mix sums, written in our own words.

export default {
  slug: "three-tier-pricing",
  name: "See what three price tiers make per buyer against one price",
  /** The plain name, used where the tool talks about itself. */
  short: "Price tiers",
  headline: "See what three price tiers make per buyer, and whether they beat one price for everyone",
  summary: "Type your three prices, what each costs you and the share of buyers who pick each. You get the average price and profit a buyer, and the gain against a single price.",
  question: "With three prices on the page, what do I make per buyer on average, and does it beat one price for everyone?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "Your three tiers" },
    { id: "single", label: "One price instead" },
  ],
  inputs: [
    { id: "p1", label: "Price of the basic tier", unit: "money", example: 29, min: 0, max: 1e9, step: 1, help: "The cheapest option.", where: "Your pricing page or plan.", tools: [] },
    { id: "c1", label: "What the basic tier costs you per buyer", unit: "money", example: 5, min: 0, max: 1e9, step: 1, help: "Goods, delivery, fees or hours to serve one buyer on this tier.", where: "Your cost of goods or the hours it takes, priced at your rate.", tools: ["Xero or QuickBooks", "A spreadsheet"] },
    { id: "s1", label: "Share of buyers who pick the basic tier", unit: "percent", example: 30, min: 0, max: 100, step: 5, help: "Of everyone who buys, the share on this tier. The three shares are scaled to add up to 100.", where: "Orders by plan or product, last 90 days. For a new page, start with 30, 55 and 15 and test.", tools: ["Your checkout", "Stripe", "Shopify analytics"] },
    { id: "p2", label: "Price of the middle tier", unit: "money", example: 59, min: 0, max: 1e9, step: 1, help: "The option you want most people to pick.", where: "Your pricing page or plan.", tools: [] },
    { id: "c2", label: "What the middle tier costs you per buyer", unit: "money", example: 10, min: 0, max: 1e9, step: 1, help: "Goods, delivery, fees or hours to serve one buyer on this tier.", where: "Your cost of goods or the hours it takes, priced at your rate.", tools: ["Xero or QuickBooks", "A spreadsheet"] },
    { id: "s2", label: "Share of buyers who pick the middle tier", unit: "percent", example: 55, min: 0, max: 100, step: 5, help: "Of everyone who buys, the share on this tier.", where: "Orders by plan or product, last 90 days.", tools: ["Your checkout", "Stripe", "Shopify analytics"] },
    { id: "p3", label: "Price of the top tier", unit: "money", example: 129, min: 0, max: 1e9, step: 1, help: "The dearest option. It makes the middle one look sensible.", where: "Your pricing page or plan.", tools: [] },
    { id: "c3", label: "What the top tier costs you per buyer", unit: "money", example: 30, min: 0, max: 1e9, step: 1, help: "Goods, delivery, fees or hours to serve one buyer on this tier.", where: "Your cost of goods or the hours it takes, priced at your rate.", tools: ["Xero or QuickBooks", "A spreadsheet"] },
    { id: "s3", label: "Share of buyers who pick the top tier", unit: "percent", example: 15, min: 0, max: 100, step: 5, help: "Of everyone who buys, the share on this tier.", where: "Orders by plan or product, last 90 days.", tools: ["Your checkout", "Stripe", "Shopify analytics"] },
    { id: "buyers", label: "Buyers a month", unit: "count", example: 100, min: 0, max: 1e9, step: 10, integer: true, help: "How many people buy in a month. The sum keeps this the same with tiers or one price.", where: "Orders for the last 3 months, divided by 3.", tools: ["Your checkout", "Shopify analytics"] },
    { id: "single", label: "The one price you would charge instead", unit: "money", example: 49, min: 0, max: 1e9, step: 1, section: "single", help: "If there were only one option.", where: "Your current price, or the price you are thinking of.", tools: [] },
    { id: "singleCost", label: "What that one option costs you per buyer", unit: "money", example: 10, min: 0, max: 1e9, step: 1, section: "single", help: "Goods, delivery, fees or hours to serve one buyer.", where: "Your cost of goods or the hours it takes, priced at your rate.", tools: ["Xero or QuickBooks", "A spreadsheet"] },
  ],
  outputs: [
    { id: "shareTotal", label: "The three shares added up", unit: "percent", helper: true, formula: "s1 + s2 + s3", sum: "{s1} + {s2} + {s3} = {=}", means: "" },
    { id: "profit1", label: "Profit on one basic buyer", unit: "money", group: "Each tier", formula: "p1 - c1", sum: "{p1} − {c1} = {=}", means: "What one buyer on the basic tier leaves." },
    { id: "profit2", label: "Profit on one middle buyer", unit: "money", group: "Each tier", formula: "p2 - c2", sum: "{p2} − {c2} = {=}", means: "What one buyer on the middle tier leaves." },
    { id: "profit3", label: "Profit on one top buyer", unit: "money", group: "Each tier", formula: "p3 - c3", sum: "{p3} − {c3} = {=}", means: "What one buyer on the top tier leaves." },
    { id: "avgPrice", label: "What the average buyer pays", unit: "money", group: "Three tiers together", formula: "IF(shareTotal > 0, (p1 * s1 + p2 * s2 + p3 * s3) / shareTotal, NA())", none: "No shares typed", sum: "({p1} × {s1} + {p2} × {s2} + {p3} × {s3}) ÷ {shareTotal} = {=}", means: [
      { if: "NOT(HAS(avgPrice))", text: "The three shares add up to 0, so there is no mix to average." },
      { text: "Your prices, weighted by who picks what." },
    ] },
    { id: "avgCost", label: "What the average buyer costs you", unit: "money", group: "Three tiers together", formula: "IF(shareTotal > 0, (c1 * s1 + c2 * s2 + c3 * s3) / shareTotal, NA())", none: "No shares typed", sum: "({c1} × {s1} + {c2} × {s2} + {c3} × {s3}) ÷ {shareTotal} = {=}", means: "Your costs, weighted the same way." },
    { id: "avgProfit", label: "Profit on the average buyer, with three tiers", unit: "money", group: "Three tiers together", formula: "IF(HAS(avgPrice), avgPrice - avgCost, NA())", none: "No shares typed", sum: "{avgPrice} − {avgCost} = {=}", means: "What a typical buyer leaves you when they can choose." },
    { id: "topShare", label: "Share of sales from the top tier", unit: "percent", group: "Three tiers together", formula: "IF(AND(HAS(avgPrice), avgPrice > 0), p3 * s3 / shareTotal / avgPrice * 100, NA())", none: "No sales", sum: "{p3} × {s3} ÷ {shareTotal} ÷ {avgPrice} = {=}", means: "Few people pick the top tier, but it can carry a big share of the money." },
    { id: "singleProfit", label: "Profit on one buyer, at one price", unit: "money", group: "One price instead", formula: "single - singleCost", sum: "{single} − {singleCost} = {=}", means: "What every buyer leaves if there is only one option." },
    { id: "gain", label: "Three tiers make this much more per buyer", unit: "money", group: "One price instead", about: "How much more a buyer leaves with three tiers than at one price. Below zero, one price makes more.", formula: "IF(HAS(avgProfit), avgProfit - singleProfit, NA())", none: "No shares typed", sum: "{avgProfit} − {singleProfit} = {=}", means: [
      { if: "gain < 0", text: "Below zero: one price makes {=:abs} more a buyer than the tiers." },
      { if: "gain = 0", text: "The same either way." },
      { text: "Above zero: the tiers make more a buyer." },
    ] },
    { id: "monthGain", label: "More a month from the tiers", unit: "money", group: "One price instead", formula: "IF(HAS(gain), gain * buyers, NA())", none: "No shares typed", sum: "{gain} × {buyers} buyers = {=}", means: "With the same number of buyers either way. Tiers often change how many buy, which this sum leaves out." },
  ],
  answer: [
    [
      { if: "NOT(HAS(avgPrice))", text: "The three shares add up to 0, so there is no mix to work out. Type the share of buyers who pick each tier." },
      { if: "gain > 0", text: "With three tiers the average buyer pays {avgPrice} and leaves {avgProfit}, against {singleProfit} at one price of {single}. That is {gain} more a buyer, or {monthGain} a month at {buyers} buyers." },
      { if: "gain < 0", text: "With three tiers the average buyer pays {avgPrice} and leaves {avgProfit}, against {singleProfit} at one price of {single}. One price makes {gain:abs} more a buyer, or {monthGain:abs} a month at {buyers} buyers." },
      { text: "With three tiers the average buyer pays {avgPrice} and leaves {avgProfit}, the same as one price of {single}. It is a wash on profit." },
    ],
    [
      { if: "AND(HAS(topShare), topShare > 0)", text: "The top tier brings {topShare} of your sales." },
    ],
  ],
  next: [
    { slug: "pricing-decision-planner", why: "Set three test prices from your costs and the buyer's gain, with a plan to raise them." },
    { slug: "bundle-tier-layout-planner", why: "Lay the three tiers out on the page, with the savings wording and a test plan." },
    { slug: "price-against-value-checker", why: "Check each tier's price against what the buyer gets, so the middle one is the obvious pick." },
  ],
  sources: [
    { what: "Average price and cost", how: "Each tier's figure × the share of buyers who pick it, added up, ÷ the shares added up. A standard weighted average." },
    { what: "Gain against one price", how: "Average profit a buyer with tiers − profit a buyer at one price. A standard price mix comparison." },
  ],
  notes: [
    "The number of buyers is the same with tiers or one price. In practice tiers can raise or lower how many buy, so test it.",
    "The shares are scaled to add up to 100, so you can type them as counts of orders instead of percentages.",
    "A top tier few people pick still does a job: it makes the middle tier look reasonable. This sum only counts the money it brings in directly.",
  ],
};
