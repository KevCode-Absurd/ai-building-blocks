// Bundle price calculator. The single source of truth for this mini tool.
//
// Maths: the lowest price that keeps your margin = (costs + shipping) / (1 - payment fee - margin you want).
// The price that shows your saving = the products' prices added up x (1 - saving). Set the higher of the two.
// Profit on a bundle = price - costs - shipping - payment fees. A single sale is one product on its own, at the
// average price and cost of the products in the bundle. Bundles needed for every 100 single sales =
// 100 x profit on a single sale / profit on a bundle.
// These are standard margin and break-even formulas, written in our own words.

export default {
  slug: "bundle-price-calculator",
  name: "Bundle price calculator",
  /** The plain name, used where the tool talks about itself. */
  short: "Bundle price calculator",
  headline: "Bundle price calculator",
  summary: "Enter product prices, costs and target margin. Calculate a bundle price, its saving and the bundles needed to match single-sale profit.",
  question: "What bundle price protects my margin, and what saving does it show?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "ecommerce", label: "Online store" }],
  inputs: [
    {
      id: "items", label: "Products in the bundle", unit: "count", example: 2, min: 2, max: 3, step: 1, integer: true,
      help: "Two or three.",
      where: "The bundle you are thinking of selling.",
      tools: [],
    },
    {
      id: "fullTotal", label: "Prices of those products added up", unit: "money", example: 60, min: 0.01, max: 1e9, step: 1,
      help: "What a customer pays if they buy each one on its own.",
      where: "Your product pages. Add up the price of each product in the bundle.",
      tools: ["Shopify products", "Your store admin"],
    },
    {
      id: "cost", label: "What those products cost you added up", unit: "money", example: 18, min: 0, max: 1e9, step: 0.5,
      help: "What you pay to make or buy one of each.",
      where: "Your cost of goods report, or supplier invoices divided by units.",
      tools: ["Shopify (cost per item)", "Xero or QuickBooks", "Your supplier invoices"],
    },
    {
      id: "shipping", label: "Shipping and packing per order", unit: "money", example: 6, min: 0, max: 1e9, step: 0.5,
      help: "One parcel per order. Use the average for a bundle order if it weighs more.",
      where: "Your shipping costs for the last 90 days divided by orders.",
      tools: ["Shopify shipping reports", "ShipStation", "Your courier invoices"],
    },
    {
      id: "fee", label: "Payment fees", unit: "percent", example: 3, min: 0, max: 50, step: 0.1,
      help: "The share of each payment your payment provider keeps.",
      where: "Your payouts report: fees divided by sales.",
      tools: ["Shopify Payments", "Stripe", "PayPal"],
    },
    {
      id: "margin", label: "Profit margin you want to keep on the bundle", unit: "percent", example: 40, min: 0, max: 90, step: 1,
      help: "The share of the bundle price you want left as profit, after goods, shipping and fees.",
      where: "Your margin on single sales today, or your own target.",
      tools: ["Your accounts software", "A spreadsheet"],
    },
    {
      id: "saving", label: "Saving you want the bundle to show", unit: "percent", example: 15, min: 0, max: 100, step: 1,
      help: "The share off the prices added up. 15 means the bundle costs 15% less than buying each on its own.",
      where: "Your own choice. Most shoppers notice 10% or more.",
      tools: [],
    },
  ],
  outputs: [
    {
      id: "floorPrice", label: "Lowest bundle price that keeps your margin", unit: "money",
      formula: "IF(1 - fee / 100 - margin / 100 > 0, (cost + shipping) / (1 - fee / 100 - margin / 100), NA())",
      none: "No price can meet it",
      sum: "({cost} + {shipping}) ÷ (100% − {fee} − {margin}) = {=}",
      means: [
        { if: "NOT(HAS(floorPrice))", text: "Payment fees and the margin you want take 100% or more of the price. Lower one of them." },
        { text: "Charge less than this and you keep less than your margin." },
      ],
    },
    {
      id: "dealPrice", label: "Price that shows your saving", unit: "money",
      formula: "fullTotal * (1 - saving / 100)",
      sum: "{fullTotal} × (100% − {saving}) = {=}",
      means: "The price if you ignore your margin and only chase the saving.",
    },
    {
      id: "bundlePrice", label: "Bundle price to set", unit: "money",
      formula: "IF(HAS(floorPrice), MAX(floorPrice, dealPrice), NA())",
      none: "No price can meet it",
      sum: "The higher of {floorPrice} and {dealPrice} = {=}",
      means: "The higher of the two, so you keep your margin and show as much saving as it allows.",
    },
    {
      id: "shows", label: "Saving the bundle really shows", unit: "percent",
      formula: "IF(HAS(bundlePrice), (1 - bundlePrice / fullTotal) * 100, NA())",
      none: "No price can meet it",
      sum: "100% − {bundlePrice} ÷ {fullTotal} = {=} off",
      means: [
        { if: "NOT(HAS(shows))", text: "No price can meet your margin." },
        { if: "shows < 0", text: "Below zero: your margin needs a price above the products bought apart, so it can't look like a deal." },
        { if: "bundlePrice > dealPrice", text: "Less than the saving you asked for, because your margin comes first." },
        { text: "The share off the products' prices added up." },
      ],
    },
    {
      id: "bundleProfit", label: "Profit on one bundle", unit: "money",
      formula: "IF(HAS(bundlePrice), bundlePrice - cost - shipping - bundlePrice * fee / 100, NA())",
      none: "No price can meet it",
      sum: "{bundlePrice} − {cost} goods − {shipping} shipping − fees = {=}",
      means: "What one bundle leaves you after goods, shipping and payment fees.",
    },
    {
      id: "bundleMargin", label: "Margin on the bundle", unit: "percent",
      formula: "IF(HAS(bundlePrice), IF(bundlePrice > 0, bundleProfit / bundlePrice * 100, 0), NA())",
      none: "No price can meet it",
      sum: "{bundleProfit} ÷ {bundlePrice} = {=}",
      means: "The share of the bundle price you keep as profit. It is at least the margin you asked for.",
    },
    {
      id: "singleProfit", label: "Profit on a single sale today", unit: "money",
      formula: "fullTotal / items - cost / items - shipping - fullTotal / items * fee / 100",
      sum: "One product at the average price ({fullTotal} ÷ {items}), less its cost, shipping and fees = {=}",
      means: [
        { if: "singleProfit <= 0", text: "A single sale makes nothing or loses money, so there is no profit to match." },
        { text: "What one product sold on its own leaves you. It carries a whole parcel's shipping." },
      ],
    },
    {
      id: "per100", label: "Bundles you need for every 100 single sales", unit: "number",
      formula: "IF(HAS(bundleProfit), IF(AND(singleProfit > 0, bundleProfit > 0), 100 * singleProfit / bundleProfit, NA()), NA())",
      none: "Can't compare",
      sum: "100 × {singleProfit} ÷ {bundleProfit} = {=}",
      means: [
        { if: "NOT(HAS(per100))", text: "A bundle or a single sale makes no profit, so the two can't be compared." },
        { text: "To earn what 100 single sales earn, you need this many bundles." },
      ],
    },
    {
      id: "extraBundles", label: "More bundles than single sales you need", unit: "percent",
      formula: "IF(HAS(per100), per100 - 100, NA())",
      none: "Can't compare",
      sum: "{per100} − 100 = {=}",
      means: [
        { if: "NOT(HAS(extraBundles))", text: "Can't compare." },
        { if: "extraBundles < 0", text: "Below zero: you can sell fewer bundles than single sales and earn the same." },
        { text: "How many more bundles than single sales you must sell to earn the same profit." },
      ],
    },
  ],
  answer: [
    [
      { if: "NOT(HAS(bundlePrice))", text: "Payment fees and a {margin} margin take all of the price, so no bundle price works. Lower the margin or the fees." },
      { if: "shows < 0", text: "To keep a {margin} margin, the bundle has to cost {bundlePrice}, more than the {fullTotal} the products cost apart. It can't look like a deal at this margin." },
      { if: "bundlePrice > dealPrice", text: "Set the price at {bundlePrice}. That is the lowest price that keeps your {margin} margin, so it shows {shows} off, not the {saving} you wanted." },
      { text: "Set the price at {bundlePrice}. It shows {shows} off the {fullTotal} the products cost apart, and you keep {bundleProfit} on each bundle." },
    ],
    [
      { if: "NOT(HAS(extraBundles))", text: "A single sale or a bundle makes no profit, so there is no sales comparison." },
      { if: "extraBundles < 0", text: "One bundle makes {bundleProfit} against {singleProfit} on a single sale, so {per100} bundles earn what 100 single sales do." },
      { text: "One bundle makes {bundleProfit} against {singleProfit} on a single sale, so you need {extraBundles} more bundles than single sales to earn the same." },
    ],
  ],
  next: [
    { slug: "bundle-and-quantity-break-builder", why: "Turn the price into bundle tiers, a default choice and a gift." },
    { slug: "discount-impact-checker", why: "Check what your discounts do to profit before you add a bundle." },
  ],
  sources: [
    { what: "Lowest price that keeps a margin", how: "Costs ÷ (1 − fees − margin). The standard price-from-margin sum." },
    { what: "Bundles you need", how: "Profit on a single sale ÷ profit on a bundle. The standard break-even volume sum." },
  ],
  notes: [
    "A single sale here is one product at the average price and cost of the bundle. It says nothing about which products your customers buy.",
    "It assumes the bundle takes sales from single sales and adds none of its own. If bundles bring new customers, you need fewer.",
    "It says nothing about what shoppers will pay. Test the price.",
  ],
};
