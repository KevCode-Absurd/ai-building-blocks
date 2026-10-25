// Early payment discount. The single source of truth for this mini tool.
//
// Maths: the saving = invoice x discount. What you pay = invoice - saving. The discount as a yearly rate = discount /
// (1 - discount) x 365 / days early: what the money earns by being paid early, scaled to a year (the standard
// cost-of-trade-credit sum, simple interest). The cost of paying early = what you pay x your yearly cost of money x
// days early / 365. Net = saving - that cost. The smallest discount worth taking for those days = r / (1 + r), where
// r = yearly cost of money x days / 365. The most days early you would pay for this discount = discount / (1 - discount)
// / yearly cost of money x 365. Written in our own words.

export default {
  slug: "early-payment-discount",
  name: "Early payment discount comparison",
  /** The plain name, used where the tool talks about itself. */
  short: "Early payment discount comparison",
  headline: "Early payment discount comparison",
  summary: "Enter the invoice, discount, days paid early and yearly interest cost. Compare the discount saving with the cost of paying sooner.",
  question: "Does the invoice discount exceed the interest cost of paying early?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "invoice", label: "Invoice amount", unit: "money", example: 10000, min: 0, max: 1e10, step: 500, help: "The full amount before any discount.", where: "The invoice.", tools: ["Your accounts software", "The invoice"] },
    { id: "discount", label: "Discount for paying early", unit: "percent", example: 2, min: 0, max: 100, step: 0.5, help: "2 means 2% off. Terms like 2/10 net 30 mean 2% off if you pay within 10 days instead of 30.", where: "The payment terms on the invoice or contract.", tools: ["The invoice", "Your supplier agreement"] },
    { id: "daysEarly", label: "Days earlier you pay to get it", unit: "count", example: 20, min: 0, max: 3650, step: 1, integer: true, help: "The normal due date minus the early date. For 2/10 net 30, that is 20 days.", where: "The payment terms: due date minus discount date.", tools: ["The invoice"] },
    { id: "borrowRate", label: "What your money costs you a year", unit: "percent", example: 12, min: 0, max: 1000, step: 1, help: "The yearly interest on your overdraft or loan, or the yearly return the cash earns elsewhere in your business. 12 means 12% a year.", where: "Your loan or overdraft statement, or the return you expect on cash in the business.", tools: ["Your bank", "Your accountant"] },
  ],
  outputs: [
    { id: "saving", label: "The discount saves", unit: "money", formula: "invoice * discount / 100", sum: "{invoice} × {discount} = {=}", means: "Money off the invoice for paying early." },
    { id: "paid", label: "What you pay", unit: "money", formula: "invoice - saving", sum: "{invoice} − {saving} = {=}", means: "The early amount." },
    { id: "yearlyRate", label: "The discount as a yearly rate", unit: "percent", formula: "IF(AND(discount < 100, daysEarly > 0), discount / (100 - discount) * 365 / daysEarly * 100, NA())", none: "Nothing to scale", sum: "{discount} ÷ (100% − {discount}) × 365 ÷ {daysEarly} days = {=}", means: [
      { if: "NOT(HAS(yearlyRate))", text: "With no days early, or everything off, there is no rate to work out." },
      { text: "What paying early earns on the money, scaled to a year. Compare it with your loan rate. For the one offering the discount, this is what it costs them." },
    ] },
    { id: "costOfMoney", label: "What paying early costs you in interest", unit: "money", formula: "paid * borrowRate / 100 * daysEarly / 365", sum: "{paid} × {borrowRate} × {daysEarly} ÷ 365 = {=}", means: "Interest on the early amount for those days, at your yearly cost of money." },
    { id: "netGain", label: "Net gain from paying early", unit: "money", formula: "saving - costOfMoney", sum: "{saving} − {costOfMoney} = {=}", means: [
      { if: "netGain > 0", text: "Above zero: the discount exceeds the interest cost you entered." },
      { if: "netGain < 0", text: "Below zero: interest costs more than the discount saves at your figures." },
      { text: "A wash." },
    ] },
    { id: "breakEvenDiscount", label: "Smallest discount worth taking for these days", unit: "percent", formula: "(borrowRate / 100 * daysEarly / 365) / (1 + borrowRate / 100 * daysEarly / 365) * 100", sum: "r ÷ (1 + r), where r = {borrowRate} × {daysEarly} ÷ 365 = {=}", means: "Any discount above this beats your cost of money for paying this many days early." },
    { id: "maxDays", label: "Most days early you would pay for this discount", unit: "count", formula: "IF(AND(discount < 100, borrowRate > 0), discount / (100 - discount) / (borrowRate / 100) * 365, NA())", none: "Any number of days", sum: "{discount} ÷ (100% − {discount}) ÷ {borrowRate} × 365 = {=}", means: [
      { if: "NOT(HAS(maxDays))", text: "With free money, or everything off, any number of days early is fine." },
      { text: "Beyond this many days early, the interest outweighs the discount." },
    ] },
  ],
  answer: [
    [
      { if: "discount = 0", text: "There is no discount, so paying {daysEarly} days early only costs you {costOfMoney} in interest. Pay on the due date." },
      { if: "daysEarly = 0", text: "You pay on the same day either way, so the {saving} off is free money. Take it." },
      { if: "NOT(HAS(yearlyRate))", text: "Everything is off the invoice, so you pay nothing. Take it." },
      { if: "netGain > 0", text: "Paying {daysEarly} days early for {discount} off is like earning {yearlyRate} a year on the money. Against your {borrowRate} cost of money, you come out {netGain} ahead on this invoice. Take it, unless the cash is tight." },
      { if: "netGain < 0", text: "Paying {daysEarly} days early for {discount} off is like earning {yearlyRate} a year on the money, less than your {borrowRate} cost of money. You come out {netGain:abs} behind. Only take a discount above {breakEvenDiscount} for {daysEarly} days early." },
      { text: "Paying {daysEarly} days early for {discount} off earns exactly your cost of money. It makes no difference either way." },
    ],
    [
      { if: "AND(HAS(yearlyRate), discount > 0)", text: "If you are the one offering it, you give up {saving} to be paid {daysEarly} days sooner, which costs you {yearlyRate} a year on that money." },
    ],
  ],
  compare: { input: "daysEarly", label: "At other days early", values: [10, 20, 60], outputs: ["yearlyRate", "costOfMoney", "netGain"] },
  next: [
    { slug: "cut-your-product-cost-and-turn-supplier-terms-into-cash", why: "Ask suppliers for terms that free cash, with a negotiation plan." },
    { slug: "cash-lever-ranker", why: "See how payment terms rank against your other cash levers." },
    { slug: "client-fee-and-cap-setter", why: "If you are the one offering it, set fees and billing terms that cover your costs." },
  ],
  sources: [
    { what: "The discount as a yearly rate", how: "Discount ÷ (1 − discount) × 365 ÷ days early. The standard cost-of-trade-credit sum, simple interest." },
    { what: "Cost of paying early", how: "Amount paid × yearly cost of money × days ÷ 365. Simple interest for the days." },
  ],
  notes: [
    "Uses simple interest. The saving is scaled to one year without adding interest on interest.",
    "If paying early would leave you unable to pay something else, the cash matters more than the sum.",
    "This is a sum on the numbers given, not financial advice. Check tax and accounting treatment with your accountant.",
  ],
};
