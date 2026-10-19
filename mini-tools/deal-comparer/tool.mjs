// Deal comparer. The single source of truth for this mini tool.
//
// Maths: a "buy X, get Y" deal is a discount on the whole order: 1 - what they pay / full price of every item.
// Each deal's profit = what the customer pays - goods - shipping - payment fees - anything given away.
// Credit next time costs only the goods it's spent on: credit x share that gets spent x (item cost / item price).
// Money off now costs the amount, less the payment fee you no longer pay on it. Plain arithmetic, in our own words.

export default {
  slug: "deal-comparer",
  name: "Pick the deal that keeps the most profit",
  /** The plain name, used where the tool talks about itself. */
  short: "Deal comparer",
  headline: "Pick the deal that keeps more of each order",
  summary: "Compare buy-some-get-some against money off, a gift against a deeper cut, and credit next time against money off now.",
  question: "Is \"buy 2, get 1 free\" better than 30% off? A gift or a deeper cut? Credit next time or money off now?",
  shelf: ["ecommerce"],
  version: "1.0.0",
  updated: "2026-10-19",
  presets: [{ id: "ecommerce", label: "Online store" }],
  sections: [
    { id: "numbers", label: "Your item" },
    { id: "bogo", label: "Buy some, get some" },
    { id: "gift", label: "A gift, or a deeper discount" },
    { id: "credit", label: "Credit next time, or money off now" },
  ],
  inputs: [
    { id: "price", label: "Full price of one item", unit: "money", example: 30, min: 0.01, max: 1e9, step: 1, help: "The price on your site, before any deal.", where: "Your product page or product list.", tools: ["Shopify products", "Your store admin"] },
    { id: "cost", label: "What one item costs you", unit: "money", example: 9, min: 0, max: 1e9, step: 0.5, help: "What you pay to make or buy one.", where: "Your cost of goods report, or supplier invoices divided by units.", tools: ["Shopify (cost per item)", "Xero or QuickBooks", "Your supplier invoices"] },
    { id: "shipping", label: "Shipping and packing per order", unit: "money", example: 6, min: 0, max: 1e9, step: 0.5, help: "One parcel per order. If more items cost more to post, use the average for the deal order.", where: "Shipping costs for the last 90 days divided by orders.", tools: ["Shopify shipping reports", "ShipStation", "Your courier invoices"] },
    { id: "fee", label: "Payment fees", unit: "percent", example: 3, min: 0, max: 50, step: 0.1, help: "The share of each payment your payment provider keeps.", where: "Your payouts report: fees divided by sales.", tools: ["Shopify Payments", "Stripe", "PayPal"] },
    { id: "buy", label: "Items they pay full price for", unit: "count", example: 2, min: 1, max: 100, step: 1, integer: true, section: "bogo", help: "In \"buy 2, get 1 free\", this is 2.", where: "The deal you're thinking of running.", tools: [] },
    { id: "extra", label: "Items they get at a lower price", unit: "count", example: 1, min: 1, max: 100, step: 1, integer: true, section: "bogo", help: "In \"buy 2, get 1 free\", this is 1.", where: "The deal you're thinking of running.", tools: [] },
    { id: "extraOff", label: "Discount on those items", unit: "percent", example: 100, min: 0, max: 100, step: 5, section: "bogo", help: "100 means free. 50 means half price.", where: "The deal you're thinking of running.", tools: [] },
    { id: "deep", label: "The deeper discount", unit: "percent", example: 30, min: 0, max: 100, step: 5, section: "gift", help: "Money off on its own, like 30% off.", where: "The discount you'd run instead of a gift.", tools: [] },
    { id: "light", label: "The lighter discount, with a gift", unit: "percent", example: 15, min: 0, max: 100, step: 5, section: "gift", help: "The smaller discount you'd give with the gift. Use 0 for a gift with no discount.", where: "The deal you're thinking of running.", tools: [] },
    { id: "giftCost", label: "What the gift costs you", unit: "money", example: 4, min: 0, max: 1e9, step: 0.5, section: "gift", help: "What you pay for the gift, not what it sells for.", where: "Your cost of goods for the gift item.", tools: ["Shopify (cost per item)", "Your supplier invoices"] },
    { id: "credit", label: "Amount, as money off or credit", unit: "money", example: 10, min: 0, max: 1e9, step: 1, section: "credit", help: "The same amount, given either way.", where: "The deal you're thinking of running.", tools: [] },
    { id: "creditUsed", label: "Share of credit that gets spent", unit: "percent", example: 60, min: 0, max: 100, step: 5, section: "credit", help: "Some credit is never spent. Until you have your own number, try a few to see how much it matters.", where: "Your store credit or gift card report: credit spent divided by credit given.", tools: ["Shopify gift cards report", "Your loyalty app"] },
  ],
  outputs: [
    { id: "fullProfit", label: "Profit on one item at full price", unit: "money", formula: "price - cost - shipping - price * fee / 100", sum: "{price} − {cost} − {shipping} shipping − {fee} fees = {=}", means: "The order every deal is compared with." },
    { id: "dealItems", label: "Items in the deal order", unit: "count", group: "Buy some, get some", formula: "buy + extra", sum: "{buy} + {extra} = {=}", means: "All of them go in one parcel." },
    { id: "dealPays", label: "They pay for the deal", unit: "money", group: "Buy some, get some", formula: "price * (buy + extra * (1 - extraOff / 100))", sum: "{price} × ({buy} + {extra} × (100% − {extraOff})) = {=}", means: "What the customer pays for the whole deal." },
    { id: "dealOff", label: "The deal works out at", unit: "percent", group: "Buy some, get some", formula: "(1 - dealPays / (price * dealItems)) * 100", sum: "100% − {dealPays} ÷ ({price} × {dealItems}) = {=} off", means: "The deal as a plain discount on everything in the order." },
    {
      id: "dealProfit", label: "Profit on the deal order", unit: "money", group: "Buy some, get some",
      formula: "dealPays - cost * dealItems - shipping - dealPays * fee / 100",
      sum: "{dealPays} − {dealItems} × {cost} − {shipping} shipping − {fee} fees = {=}",
      means: [{ if: "dealProfit < 0", text: "A loss: the deal loses {=:abs} on every order." }, { text: "What the deal order leaves you." }],
    },
    { id: "flatPays", label: "The same discount on one item: they pay", unit: "money", group: "Buy some, get some", formula: "price * (1 - dealOff / 100)", sum: "{price} × (100% − {dealOff}) = {=}", means: "One item at the same share off, for a fair comparison." },
    {
      id: "flatProfit", label: "Profit on one item at that discount", unit: "money", group: "Buy some, get some",
      formula: "flatPays - cost - shipping - flatPays * fee / 100",
      sum: "{flatPays} − {cost} − {shipping} shipping − {fee} fees = {=}",
      means: [{ if: "flatProfit < 0", text: "A loss: {dealOff} off one item loses {=:abs} an order." }, { text: "What one discounted item leaves you." }],
    },
    { id: "dealVsFlat", label: "The deal keeps this much more", unit: "money", group: "Buy some, get some", formula: "dealProfit - flatProfit", sum: "{dealProfit} − {flatProfit} = {=}", means: "Both cut the price by the same share. The deal sells more items for one shipping cost." },
    {
      id: "deepProfit", label: "Profit at the deeper discount", unit: "money", group: "A gift, or a deeper discount",
      formula: "price * (1 - deep / 100) * (1 - fee / 100) - cost - shipping",
      sum: "{price} × (100% − {deep}) less {fee} fees − {cost} − {shipping} shipping = {=}",
      means: [{ if: "deepProfit < 0", text: "A loss: {deep} off loses {=:abs} on every order." }, { text: "What one item leaves you at the deeper discount." }],
    },
    {
      id: "giftProfit", label: "Profit at the lighter discount, with the gift", unit: "money", group: "A gift, or a deeper discount",
      formula: "price * (1 - light / 100) * (1 - fee / 100) - cost - shipping - giftCost",
      sum: "{price} × (100% − {light}) less {fee} fees − {cost} − {shipping} shipping − {giftCost} gift = {=}",
      means: [{ if: "giftProfit < 0", text: "A loss: the gift deal loses {=:abs} on every order." }, { text: "What one item and the gift leave you." }],
    },
    { id: "giftGain", label: "The gift keeps this much more", unit: "money", about: "How much more the gift deal keeps than the deeper discount. Below zero, the deeper discount keeps more.", group: "A gift, or a deeper discount", formula: "giftProfit - deepProfit", sum: "{giftProfit} − {deepProfit} = {=}", means: [{ if: "giftGain < 0", text: "Below zero: the deeper discount keeps more." }, { text: "Above zero: the gift keeps more. Name the gift and its price, so buyers can see its worth." }] },
    { id: "cashCost", label: "Money off now costs you", unit: "money", group: "Credit next time, or money off now", formula: "credit * (1 - fee / 100)", sum: "{credit} less the {fee} fee you no longer pay on it = {=}", means: "Money off comes straight out of this order." },
    { id: "creditCost", label: "Credit next time costs you", unit: "money", group: "Credit next time, or money off now", formula: "credit * creditUsed / 100 * cost / price", sum: "{credit} × {creditUsed} spent × ({cost} ÷ {price}) = {=}", means: "Credit is paid in goods, at what they cost you. Credit that's never spent costs nothing." },
    { id: "creditSaves", label: "Credit saves you", unit: "money", group: "Credit next time, or money off now", formula: "cashCost - creditCost", sum: "{cashCost} − {creditCost} = {=}", means: "Credit also brings the buyer back. Put an end date on it." },
  ],
  answer: [
    [
      { if: "dealProfit < 0", text: "Buy {buy}, get {extra} loses {dealProfit:abs} on every order." },
      { if: "dealVsFlat > 0", text: "Buy {buy}, get {extra} keeps {dealVsFlat} more an order than {dealOff} off one item." },
      { if: "dealVsFlat < 0", text: "{dealOff} off one item keeps {dealVsFlat:abs} more an order than buy {buy}, get {extra}." },
      { text: "Buy {buy}, get {extra} keeps the same as {dealOff} off one item." },
    ],
    [
      { if: "AND(giftProfit < 0, deepProfit < 0)", text: "The gift deal and {deep} off both lose money on every order." },
      { if: "giftGain > 0", text: "The gift with {light} off keeps {giftGain} more an order than {deep} off." },
      { if: "giftGain < 0", text: "{deep} off keeps {giftGain:abs} more an order than the gift with {light} off." },
      { text: "The gift and the deeper discount keep the same." },
    ],
    [{ text: "Credit next time costs you {creditCost}. The same money off now costs {cashCost}." }],
    [{ if: "MIN(dealProfit, flatProfit, deepProfit, giftProfit) < 0", text: "Some of these deals lose money on every order. Each loss is marked in the working below." }],
  ],
  next: [{ slug: "offer-builder-that-answers-buyer-doubts", why: "Turn the deal that wins into an offer that answers why buyers hold back." }],
  sources: [
    { what: "A deal as a discount", how: "1 − what they pay ÷ full price of every item. Plain arithmetic." },
    { what: "Profit on each deal", how: "What the customer pays minus goods, shipping, payment fees and anything given away. The standard contribution sum." },
    { what: "Cost of credit", how: "Credit × share spent × item cost ÷ item price: credit is paid in goods." },
  ],
  notes: [
    "Shipping is one parcel per order, whatever the deal.",
    "Credit next time leaves out the profit from the second order it brings in, so credit may be worth more than shown.",
  ],
};
