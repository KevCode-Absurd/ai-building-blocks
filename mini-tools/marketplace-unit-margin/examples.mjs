// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no price to divide by).

export default [
  {
    name: "A 30 item with a 15% referral fee",
    inputs: { price: 30, referral: 15, fulfil: 5.5, storage: 0.4, cogs: 8, returnRate: 5, returnCost: 3, adShare: 20 },
    // Referral 4.50; fees 4.50 + 5.50 + 0.40 = 10.40, which is 34.67% of the price. Returns 5% x 3 = 0.15.
    // Before ads 30 - 10.40 - 8 - 0.15 = 11.45 (38.17%). Ads 30 x 20% = 6. Profit 5.45 (18.17%). Break-even ad share 11.45 / 30 = 38.17%.
    expect: { referralFee: 4.5, feesTotal: 10.4, feeShare: 34.666667, returnsCost: 0.15, beforeAds: 11.45, beforeAdsPct: 38.166667, adCost: 6, profit: 5.45, profitPct: 18.166667, breakEvenAdShare: 38.166667 },
    says: "leaves $11.45 before ads and $5.45 after",
  },
  {
    name: "Dear goods and heavy ads turn it into a loss",
    inputs: { price: 30, referral: 15, fulfil: 5.5, storage: 0.4, cogs: 15, returnRate: 5, returnCost: 3, adShare: 30 },
    // Before ads 30 - 10.40 - 15 - 0.15 = 4.45. Ads 9. Profit -4.55 (-15.17%). Break-even ad share 4.45 / 30 = 14.83%.
    expect: { beforeAds: 4.45, adCost: 9, profit: -4.55, profitPct: -15.166667, breakEvenAdShare: 14.833333 },
    says: "you lose $4.55 a unit",
  },
  {
    name: "No price typed",
    inputs: { price: 0, referral: 15, fulfil: 5.5, storage: 0.4, cogs: 8, returnRate: 5, returnCost: 3, adShare: 20 },
    // Referral 0, fees 5.90. Before ads 0 - 5.90 - 8 - 0.15 = -14.05. No shares of a zero price.
    expect: { referralFee: 0, feesTotal: 5.9, feeShare: null, beforeAds: -14.05, beforeAdsPct: null, adCost: 0, profit: -14.05, profitPct: null, breakEvenAdShare: null },
    says: "Type your selling price",
  },
  {
    name: "A loss before any ads",
    inputs: { price: 20, referral: 15, fulfil: 6, storage: 0.5, cogs: 12, returnRate: 0, returnCost: 0, adShare: 0 },
    // Referral 3; fees 9.50 (47.5% of the price). Before ads 20 - 9.50 - 12 = -1.50. No ads. Break-even ad share 0.
    expect: { referralFee: 3, feesTotal: 9.5, feeShare: 47.5, returnsCost: 0, beforeAds: -1.5, profit: -1.5, breakEvenAdShare: 0 },
    says: "No ad budget fixes that",
  },
  {
    name: "No ads and no returns",
    inputs: { price: 50, referral: 8, fulfil: 4, storage: 0.3, cogs: 15, returnRate: 0, returnCost: 0, adShare: 0 },
    // Referral 4; fees 8.30 (16.6%). Before ads 50 - 8.30 - 15 = 26.70 (53.4%). Profit the same. Break-even ad share 53.4%.
    expect: { referralFee: 4, feesTotal: 8.3, feeShare: 16.6, beforeAds: 26.7, beforeAdsPct: 53.4, adCost: 0, profit: 26.7, profitPct: 53.4, breakEvenAdShare: 53.4 },
    says: "Ads can go up to 53.4% of sales",
  },
  {
    name: "Ads at exactly the break-even share",
    inputs: { price: 40, referral: 15, fulfil: 6, storage: 0.5, cogs: 10, returnRate: 10, returnCost: 5, adShare: 42.5 },
    // Referral 6; fees 12.50. Returns 10% x 5 = 0.50. Before ads 40 - 12.50 - 10 - 0.50 = 17 (42.5%). Ads 40 x 42.5% = 17. Profit 0.
    expect: { feesTotal: 12.5, returnsCost: 0.5, beforeAds: 17, beforeAdsPct: 42.5, adCost: 17, profit: 0, profitPct: 0, breakEvenAdShare: 42.5 },
    says: "You break even on each unit",
  },
];
