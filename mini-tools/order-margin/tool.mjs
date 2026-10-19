// Order margin and break-even. The single source of truth for this mini tool.
//
// Maths: what an order keeps before ads = what the customer pays - goods - shipping - payment fees - refunds - other costs.
// Break-even cost to win an order = what it keeps before ads. Break-even return on ad spend = order value / that.
// Standard contribution margin and break-even ROAS formulas, in our own words.

export default {
  slug: "order-margin",
  name: "Know what each order really leaves you",
  /** The plain name, used where the tool talks about itself. */
  short: "Order margin and break-even",
  headline: "Know what each order leaves you, and the most you can pay for it",
  summary: "Type what an order brings in and what it costs. You get your profit per order and your break-even ad cost.",
  question: "What's left from one order after goods, shipping and fees, and what can I pay to win a customer and still break even?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-19",
  presets: [
    { id: "general", label: "Any business" },
    { id: "ecommerce", label: "Online store" },
  ],
  inputs: [
    {
      id: "orderValue", label: "What the customer pays for one order", unit: "money", example: 80, min: 0.01, max: 1e9, step: 1,
      help: "Your average order value, or the price of one sale, booking or job.",
      where: "Revenue divided by orders for the last 90 days.",
      tools: ["Shopify analytics", "Google Analytics", "Your accounts software"],
    },
    {
      id: "goods", label: "Cost of the goods or service in one order", unit: "money", example: 28, min: 0, max: 1e9, step: 1,
      help: "What you pay for the products in one order, or what it costs you to deliver the work.",
      where: "Your cost of goods report for the last 90 days divided by orders, or your supplier invoices.",
      tools: ["Shopify (cost per item)", "Xero or QuickBooks", "Your supplier invoices"],
    },
    {
      id: "shipping", label: "Shipping and packing per order", unit: "money", example: 7, min: 0, max: 1e9, step: 0.5, boards: ["ecommerce"],
      help: "Postage, boxes and packing fees for one order.",
      where: "Shipping costs for the last 90 days divided by orders.",
      tools: ["Shopify shipping reports", "ShipStation", "Your courier or warehouse invoices"],
    },
    {
      id: "fee", label: "Payment fees", unit: "percent", example: 3, min: 0, max: 50, step: 0.1,
      help: "The share of each payment your payment provider keeps.",
      where: "Your payouts report: fees divided by sales for the last 90 days.",
      tools: ["Shopify Payments", "Stripe", "PayPal", "Square"],
    },
    {
      id: "refunds", label: "Refunds and returns", unit: "percent", example: 5, min: 0, max: 100, step: 0.5, boards: ["ecommerce"],
      help: "The share of your sales you pay back in refunds.",
      where: "Refunds divided by sales for the last 90 days.",
      tools: ["Shopify analytics (returns)", "Your payment provider's refunds report"],
    },
    {
      id: "other", label: "Other costs per order", unit: "money", example: 2, min: 0, max: 1e9, step: 0.5,
      help: "Anything else each order costs you, like booking software, an app fee or a free gift.",
      where: "Monthly costs that grow with each order, divided by orders that month.",
      tools: ["Your accounts software", "A spreadsheet of your costs"],
    },
    {
      id: "adCost", label: "Ad or marketing cost to win one order", unit: "money", example: 20, min: 0, max: 1e9, step: 1,
      help: "What you spend on ads or marketing for each order. Use 0 if you don't pay to win orders.",
      where: "Ad spend for the last 30 days divided by the orders those ads brought in.",
      tools: ["Meta Ads Manager", "Google Ads", "Shopify analytics"],
    },
  ],
  outputs: [
    { id: "feeCost", label: "Payment fees", unit: "money", formula: "orderValue * fee / 100", sum: "{orderValue} × {fee} = {=}", means: "What your payment provider keeps from one order." },
    { id: "refundCost", label: "Refunds, on average", unit: "money", boards: ["ecommerce"], formula: "orderValue * refunds / 100", sum: "{orderValue} × {refunds} = {=}", means: "What an average order loses to refunds." },
    {
      id: "profitBeforeAds", label: "What's left before ads", unit: "money",
      formula: "orderValue - goods - shipping - feeCost - refundCost - other",
      sum: { general: "{orderValue} − {goods} − {feeCost} fees − {other} other = {=}", ecommerce: "{orderValue} − {goods} goods − {shipping} shipping − {feeCost} fees − {refundCost} refunds − {other} other = {=}" },
      means: [
        { if: "profitBeforeAds <= 0", text: "A loss: every order loses {=:abs} before you spend anything to win it." },
        { text: "What one order leaves to pay for ads and your fixed costs." },
      ],
    },
    { id: "marginPct", label: "Margin before ads", unit: "percent", formula: "profitBeforeAds / orderValue * 100", sum: "{profitBeforeAds} ÷ {orderValue} = {=}", means: "The share of each sale you keep before ads." },
    {
      id: "breakEvenCac", label: "Most you can pay to win an order and break even", unit: "money",
      formula: "IF(profitBeforeAds > 0, profitBeforeAds, NA())", none: "Nothing: every order loses money",
      sum: "The same as what's left before ads: {=}",
      means: "Pay more than this in ads for an order and that order loses money.",
    },
    {
      id: "breakEvenRoas", label: "Break-even return on ad spend", unit: "x",
      formula: "IF(profitBeforeAds > 0, orderValue / profitBeforeAds, NA())", none: "No return is enough",
      sum: "{orderValue} ÷ {profitBeforeAds} = {=}",
      means: "Your ads must bring in at least this much for every 1 you spend, or you lose money on each order.",
    },
    {
      id: "profitAfterAds", label: "Profit per order after ads", unit: "money",
      formula: "profitBeforeAds - adCost",
      sum: "{profitBeforeAds} − {adCost} = {=}",
      means: [
        { if: "profitAfterAds < 0", text: "A loss: you lose {=:abs} on every order once you pay to win it." },
        { if: "profitAfterAds = 0", text: "You break even: each order leaves nothing." },
        { text: "What one order leaves after you pay to win it." },
      ],
    },
    {
      id: "roasNow", label: "Your return on ad spend at that cost", unit: "x",
      formula: "IF(adCost > 0, orderValue / adCost, NA())", none: "No ad cost entered",
      sum: "{orderValue} ÷ {adCost} = {=}",
      means: [
        { if: "AND(HAS(roasNow), HAS(breakEvenRoas))", text: "Compare it with your break-even of {breakEvenRoas}. Above it, ads pay. Below it, they cost you." },
        { text: "Revenue for every 1 you spend on ads." },
      ],
    },
    { id: "marginAfterPct", label: "Margin after ads", unit: "percent", formula: "profitAfterAds / orderValue * 100", sum: "{profitAfterAds} ÷ {orderValue} = {=}", means: "The share of each sale you keep after ads." },
  ],
  answer: [
    [
      { if: "profitBeforeAds <= 0", text: "You lose {profitBeforeAds:abs} on every order before you spend anything on ads. Fix your price or costs first." },
      { if: "profitAfterAds < 0", text: "You keep {profitBeforeAds} before ads, but winning the order costs {adCost}, so you lose {profitAfterAds:abs} on every order." },
      { if: "profitAfterAds = 0", text: "You break even: each order leaves nothing after ads. You can pay up to {breakEvenCac} to win an order." },
      { text: "You keep {profitAfterAds} from each order after ads. You break even if winning an order costs up to {breakEvenCac}, a return on ad spend of {breakEvenRoas}." },
    ],
  ],
  next: [
    { if: "profitAfterAds <= 0", slug: "hidden-offer-finder", why: "Find an offer that raises what each order brings in." },
    { slug: "ad-results-report-writer", why: "Paste your ad results and get three next steps, judged against your break-even." },
  ],
  sources: [
    { what: "What's left before ads", how: "Order value minus the costs that come with each order. The standard contribution margin sum." },
    { what: "Break-even return on ad spend", how: "Order value ÷ what's left before ads. The standard break-even ROAS sum." },
  ],
  notes: ["Refunds are counted as money lost from the order. If returned goods can be sold again, your real cost is lower."],
};
