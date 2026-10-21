// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (shares that add up to 0).

export default [
  {
    name: "Three tiers beat one price",
    inputs: { p1: 29, c1: 5, s1: 30, p2: 59, c2: 10, s2: 55, p3: 129, c3: 30, s3: 15, buyers: 100, single: 49, singleCost: 10 },
    // Tier profits 24, 49, 99. Shares add to 100. Average price (870 + 3,245 + 1,935) / 100 = 60.50. Average cost (150 + 550 + 450) / 100 = 11.50.
    // Average profit 49. One price 49 - 10 = 39. Gain 10 a buyer, 1,000 a month. Top tier sales 1,935 / 6,050 = 31.98%.
    expect: { profit1: 24, profit2: 49, profit3: 99, avgPrice: 60.5, avgCost: 11.5, avgProfit: 49, topShare: 31.983471, singleProfit: 39, gain: 10, monthGain: 1000 },
    says: "$10.00 more a buyer",
  },
  {
    name: "Shares typed as order counts (they add to 150)",
    inputs: { p1: 29, c1: 5, s1: 60, p2: 59, c2: 10, s2: 60, p3: 129, c3: 30, s3: 30, buyers: 100, single: 49, singleCost: 10 },
    // Scaled by 150. Average price (1,740 + 3,540 + 3,870) / 150 = 61. Average cost (300 + 600 + 900) / 150 = 12. Profit 49, gain 10, 1,000 a month.
    // Top tier 3,870 / 150 = 25.80 of the 61 average = 42.30%.
    expect: { avgPrice: 61, avgCost: 12, avgProfit: 49, topShare: 42.295082, gain: 10, monthGain: 1000 },
    says: "$10.00 more a buyer",
  },
  {
    name: "No shares typed",
    inputs: { p1: 29, c1: 5, s1: 0, p2: 59, c2: 10, s2: 0, p3: 129, c3: 30, s3: 0, buyers: 100, single: 49, singleCost: 10 },
    // Nothing to average. Tier profits still show.
    expect: { profit1: 24, avgPrice: null, avgCost: null, avgProfit: null, topShare: null, singleProfit: 39, gain: null, monthGain: null },
    says: "add up to 0",
  },
  {
    name: "A high single price wins",
    inputs: { p1: 29, c1: 5, s1: 30, p2: 59, c2: 10, s2: 55, p3: 129, c3: 30, s3: 15, buyers: 100, single: 79, singleCost: 10 },
    // Tiers still leave 49 a buyer. One price 79 - 10 = 69. Gain -20, so -2,000 a month.
    expect: { avgProfit: 49, singleProfit: 69, gain: -20, monthGain: -2000 },
    says: "One price makes $20.00 more a buyer",
  },
  {
    name: "Everyone picks the cheapest tier",
    inputs: { p1: 29, c1: 5, s1: 100, p2: 59, c2: 10, s2: 0, p3: 129, c3: 30, s3: 0, buyers: 100, single: 49, singleCost: 10 },
    // Average is the basic tier: 29 paid, 5 cost, 24 profit. One price leaves 39. Gain -15, -1,500 a month. Top tier brings 0% of sales.
    expect: { avgPrice: 29, avgCost: 5, avgProfit: 24, topShare: 0, gain: -15, monthGain: -1500 },
    says: "One price makes $15.00 more a buyer",
  },
  {
    name: "No buyers yet",
    inputs: { p1: 29, c1: 5, s1: 30, p2: 59, c2: 10, s2: 55, p3: 129, c3: 30, s3: 15, buyers: 0, single: 49, singleCost: 10 },
    // Same 10 a buyer gain, but nobody buys, so 0 a month.
    expect: { gain: 10, monthGain: 0 },
    says: "$0.00 a month at 0 buyers",
  },
];
