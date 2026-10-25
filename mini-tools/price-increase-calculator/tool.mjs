// Price increase calculator. The single source of truth for this mini tool: the site page, the download,
// the spreadsheet, the AI skill and the embed are all built from this file.
//
// Maths: profit per sale = price - cost per sale - fees (a share of the price). A rise lifts the price and the fees
// with it, but the cost per sale stays the same, so each sale keeps more. To make the same total profit, sales can fall
// until sales x new profit per sale = sales x old profit per sale. So the most sales you can lose is
// 1 - old profit per sale / new profit per sale.
// These are standard break-even volume formulas, written in our own words.

export default {
  slug: "price-increase-calculator",
  name: "Price rise profit calculator",
  /** The plain name, used where the tool talks about itself. */
  short: "Price rise profit calculator",
  headline: "Price rise profit calculator",
  summary: "Enter your current price, costs and proposed rise. See how many sales you could lose while keeping the same profit.",
  question: "How would a price rise affect profit if some sales are lost?",
  shelf: ["general", "ecommerce"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    {
      id: "price", label: "Price of one sale today", unit: "money", example: 50, min: 0.01, max: 1e9, step: 1,
      help: "What a customer pays now for one sale, one booking or one average order.",
      where: "Your average order value or your price list. Revenue divided by sales for the last 90 days.",
      tools: ["Shopify analytics", "Stripe", "Your accounts software", "A spreadsheet of your sales"],
    },
    {
      id: "cost", label: "What one sale costs you", unit: "money", example: 20, min: 0, max: 1e9, step: 1,
      help: "The costs that come with each sale: the goods, delivery, packing, or the time and tools to serve one client. Leave out rent and other costs that stay the same however much you sell.",
      where: "Your cost of goods report, or your costs for the last 90 days divided by the sales in the same time.",
      tools: ["Shopify (cost per item)", "Xero or QuickBooks", "Your supplier invoices"],
    },
    {
      id: "fee", label: "Fees that scale with the price", unit: "percent", example: 3, min: 0, max: 50, step: 0.1,
      help: "The share of each payment taken by your payment provider, marketplace or sales commission. Use 0 if there is none.",
      where: "Your payouts report: fees divided by sales for the last 90 days.",
      tools: ["Shopify Payments", "Stripe", "PayPal", "Your marketplace statement"],
    },
    {
      id: "rise", label: "Price rise", unit: "percent", example: 10, min: 0, max: 1000, step: 1,
      help: "How much you plan to add to the price. 10 means a $50 price becomes $55.",
      where: "The rise you are thinking of making.",
      tools: [],
    },
    {
      id: "sales", label: "Sales a month today", unit: "count", example: 200, min: 0, max: 1e10, step: 10,
      help: "How many sales, orders or bookings you make in a normal month.",
      where: "Your sales for each of the last 3 months, averaged.",
      tools: ["Shopify analytics", "Stripe", "Your accounts software"],
    },
    {
      id: "expectedLoss", label: "Share of sales you think you would lose", unit: "percent", example: 10, min: 0, max: 100, step: 1,
      help: "Your own guess at how many fewer sales you would make after the rise. If you have no idea, try 10 and then 20. A small test of the new price shows more than a guess.",
      where: "Your guess, or the sales drop you saw the last time you changed a price.",
      tools: ["Your sales history", "A price test"],
    },
  ],
  outputs: [
    {
      id: "newPrice", label: "New price", unit: "money",
      formula: "price * (1 + rise / 100)",
      sum: "{price} × (100% + {rise}) = {=}",
      means: "What a customer pays after the rise.",
    },
    {
      id: "profitNow", label: "Profit per sale today", unit: "money",
      formula: "price - cost - price * fee / 100",
      sum: "{price} − {cost} cost − fees on {price} = {=}",
      means: [
        { if: "profitNow < 0", text: "A loss: you lose {=:abs} on every sale today." },
        { text: "What one sale leaves you before the rise." },
      ],
    },
    {
      id: "profitNew", label: "Profit per sale after the rise", unit: "money",
      formula: "newPrice - cost - newPrice * fee / 100",
      sum: "{newPrice} − {cost} cost − fees on {newPrice} = {=}",
      means: "The cost of a sale stays the same, so most of the rise lands in your profit. Fees grow with the price.",
    },
    {
      id: "maxLoss", label: "Most sales you can lose and still make the same profit", unit: "percent",
      about: "Lose fewer sales than this and you make more profit. Lose more and you make less.",
      formula: "IF(AND(profitNow > 0, profitNew > 0), 100 * (1 - profitNow / profitNew), NA())",
      none: "No number works out",
      sum: "100% × (1 − {profitNow} ÷ {profitNew}) = {=}",
      means: [
        { if: "NOT(HAS(maxLoss))", text: "You make nothing or lose money on a sale today (or after the rise), so there is no profit to hold on to." },
        { if: "maxLoss = 0", text: "With no rise, you can't lose any sales." },
        { text: "The break-even point. It says nothing about how many sales you will really lose." },
      ],
    },
    {
      id: "salesToHold", label: "Sales a month that make the same profit", unit: "count",
      formula: "IF(HAS(maxLoss), sales * profitNow / profitNew, NA())",
      none: "No number works out",
      sum: "{sales} × {profitNow} ÷ {profitNew} = {=}",
      means: "At the new price, this many sales a month earns what your sales earn today.",
    },
    {
      id: "revenueAtHold", label: "Money coming in at that point", unit: "money",
      formula: "IF(HAS(salesToHold), salesToHold * newPrice, NA())",
      none: "No number works out",
      sum: "{salesToHold} × {newPrice} = {=}",
      means: "Compare it with what you bring in today. Profit can stay the same while the money coming in changes.",
    },
    {
      id: "profitMonthNow", label: "Profit a month today", unit: "money",
      formula: "sales * profitNow",
      sum: "{sales} × {profitNow} = {=}",
      means: "Before fixed costs such as rent. It is the part of your profit that the price and sales change.",
    },
    {
      id: "profitAfterGuess", label: "Profit a month if your guess is right", unit: "money",
      formula: "sales * (1 - expectedLoss / 100) * profitNew",
      sum: "{sales} × (100% − {expectedLoss}) × {profitNew} = {=}",
      means: "Uses the share of sales you typed as your guess.",
    },
    {
      id: "profitChange", label: "Change in profit a month if your guess is right", unit: "money",
      formula: "ROUND(profitAfterGuess - profitMonthNow, 2)",
      sum: "{profitAfterGuess} − {profitMonthNow} = {=}",
      means: [
        { if: "profitChange < 0", text: "You make {=:abs} less a month than today. Your guess is worse than the break-even point." },
        { if: "profitChange = 0", text: "You make the same profit as today." },
        { text: "You make {=} more a month than today." },
      ],
    },
  ],
  answer: [
    [
      { if: "profitNow < 0", text: "You lose {profitNow:abs} on every sale today. A price rise helps, but check your costs first." },
      { if: "profitNow = 0", text: "You make nothing on a sale today, so any rise that keeps some sales can only help." },
      { if: "rise = 0", text: "With no price rise, your profit stays the same." },
      { text: "After a {rise} rise you make the same profit even if you lose {maxLoss} of your sales. That is about {salesToHold} sales a month instead of {sales}." },
    ],
    [
      { if: "NOT(HAS(maxLoss))", text: "No loss of sales is safe at these numbers. Check your price and costs." },
      { if: "rise = 0", text: "Try a rise above zero to see how many sales you can lose." },
      { if: "profitChange < 0", text: "If you lose {expectedLoss} of your sales, you make {profitChange:abs} less a month. Try a smaller rise, or test it first." },
      { if: "profitChange = 0", text: "If you lose {expectedLoss} of your sales, you make the same profit as today." },
      { text: "If you lose {expectedLoss} of your sales, you still make {profitChange} more a month." },
    ],
  ],
  compare: { input: "rise", label: "At other price rises", values: [5, 10, 20], outputs: ["newPrice", "profitNew", "maxLoss"] },
  next: [
    { slug: "pricing-decision-planner", why: "Plan how to raise a live price, and pick the price that makes the most total profit." },
    { if: "profitNow <= 0", slug: "product-margin-checker", why: "Find out where each sale loses its money before you change the price." },
  ],
  sources: [
    { what: "Profit per sale", how: "Price minus the costs of one sale and the fees that scale with the price. A standard contribution margin sum." },
    { what: "Most sales you can lose", how: "1 minus old profit per sale ÷ new profit per sale. The standard break-even volume sum for a price change." },
  ],
  notes: [
    "Cost per sale stays the same after the rise. If the cost changes with the price, work it out with the new cost.",
    "This is the break-even point, not a forecast. It does not say how many customers will leave.",
    "Fixed costs such as rent are left out because they don't change with the rise.",
  ],
};
