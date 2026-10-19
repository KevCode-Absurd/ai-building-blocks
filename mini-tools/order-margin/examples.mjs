// Worked examples, each checked by hand. Practice numbers, not any real business's.

export default [
  {
    name: "Online store with ads",
    preset: "ecommerce",
    inputs: { orderValue: 80, goods: 28, shipping: 7, fee: 3, refunds: 5, other: 2, adCost: 20 },
    // Fees 80 x 3% = 2.40. Refunds 80 x 5% = 4. Left: 80 - 28 - 7 - 2.40 - 4 - 2 = 36.60, which is 45.75% of 80.
    // Break-even ROAS 80 / 36.60 = 2.1858. After ads 36.60 - 20 = 16.60 (20.75%). ROAS now 80 / 20 = 4.
    expect: { feeCost: 2.4, refundCost: 4, profitBeforeAds: 36.6, marginPct: 45.75, breakEvenCac: 36.6, breakEvenRoas: 2.185792, profitAfterAds: 16.6, roasNow: 4, marginAfterPct: 20.75 },
    says: "You keep $16.60 from each order after ads",
  },
  {
    name: "Any business with no ad cost",
    preset: "general",
    inputs: { orderValue: 80, goods: 28, shipping: 0, fee: 3, refunds: 0, other: 2, adCost: 0 },
    // 80 - 28 - 2.40 - 2 = 47.60 (59.5%). Break-even ROAS 80 / 47.60 = 1.6807. No ad cost, so no ROAS now.
    expect: { profitBeforeAds: 47.6, marginPct: 59.5, breakEvenRoas: 1.680672, profitAfterAds: 47.6, roasNow: null },
  },
  {
    name: "A loss on every order before ads",
    preset: "ecommerce",
    inputs: { orderValue: 20, goods: 15, shipping: 6, fee: 3, refunds: 0, other: 0, adCost: 5 },
    // Fees 0.60. 20 - 15 - 6 - 0.60 = -1.60 (-8%). After ads -6.60.
    expect: { feeCost: 0.6, profitBeforeAds: -1.6, marginPct: -8, breakEvenCac: null, breakEvenRoas: null, profitAfterAds: -6.6, roasNow: 4 },
    says: "You lose $1.60 on every order before you spend anything on ads",
  },
  {
    name: "Ads cost more than the order leaves",
    preset: "ecommerce",
    inputs: { orderValue: 80, goods: 28, shipping: 7, fee: 3, refunds: 5, other: 2, adCost: 40 },
    // 36.60 left before ads; 36.60 - 40 = -3.40. ROAS now 80 / 40 = 2, under the 2.19 break-even.
    expect: { profitBeforeAds: 36.6, profitAfterAds: -3.4, roasNow: 2, marginAfterPct: -4.25 },
    says: "you lose $3.40 on every order",
  },
  {
    name: "Exactly break-even",
    preset: "general",
    inputs: { orderValue: 50, goods: 20, shipping: 0, fee: 0, refunds: 0, other: 0, adCost: 30 },
    // 50 - 20 = 30 before ads; 30 - 30 = 0. Break-even ROAS 50 / 30 = 1.6667, the same as the ROAS now.
    expect: { profitBeforeAds: 30, breakEvenCac: 30, breakEvenRoas: 1.666667, profitAfterAds: 0, roasNow: 1.666667, marginAfterPct: 0 },
    says: "You break even",
  },
  {
    name: "Everything refunded",
    preset: "ecommerce",
    inputs: { orderValue: 40, goods: 10, shipping: 5, fee: 0, refunds: 100, other: 0, adCost: 0 },
    // Refunds 40. 40 - 10 - 5 - 40 = -15.
    expect: { refundCost: 40, profitBeforeAds: -15, breakEvenRoas: null, profitAfterAds: -15 },
    says: "You lose $15.00 on every order",
  },
];
