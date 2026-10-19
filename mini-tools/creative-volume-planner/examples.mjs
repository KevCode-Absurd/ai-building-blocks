// Worked examples, each checked by hand. Practice numbers, not any real business's.

export default [
  {
    name: "A store spending 20,000 a month",
    inputs: { spend: 20000, spendPerAd: 1500, roas: 2.5, margin: 60, revenueGoal: 60000, costImage: 50, costCreator: 300, costEdited: 800 },
    // 20,000 / 1,500 = 13.3, so 14 ads. Revenue per ad 1,500 x 2.5 = 3,750. Goal: 60,000 / 3,750 = 16 ads.
    // One ad leaves 3,750 x 60% - 1,500 = 750. Image 750 - 50 = 700; creator 450; edited -50.
    // Budgets: 14 x 50 = 700; 14 x 300 = 4,200; 14 x 800 = 11,200. Break-even ROAS 100 / 60 = 1.6667.
    expect: { adsForSpend: 14, revenuePerAd: 3750, adsForGoal: 16, profitPerAd: 750, breakEvenRoas: 1.666667, netImage: 700, netCreator: 450, netEdited: -50, budgetImage: 700, budgetCreator: 4200, budgetEdited: 11200 },
    says: "you need about 14 new ads a month",
  },
  {
    name: "Ads that lose money before they're made",
    inputs: { spend: 20000, spendPerAd: 1500, roas: 1.5, margin: 60, revenueGoal: 60000, costImage: 50, costCreator: 300, costEdited: 800 },
    // Revenue 2,250; leaves 2,250 x 60% - 1,500 = -150. Goal 60,000 / 2,250 = 26.7, so 27.
    expect: { revenuePerAd: 2250, profitPerAd: -150, adsForGoal: 27, netImage: -200, netEdited: -950 },
    says: "a typical ad loses $150.00",
  },
  {
    name: "No revenue goal and no spend",
    inputs: { spend: 0, spendPerAd: 1500, roas: 2.5, margin: 60, revenueGoal: 0, costImage: 50, costCreator: 300, costEdited: 800 },
    expect: { adsForSpend: 0, adsForGoal: null, budgetImage: 0, budgetEdited: 0 },
    says: "no ads to plan",
  },
  {
    name: "Ads that bring in nothing",
    inputs: { spend: 5000, spendPerAd: 1000, roas: 0, margin: 50, revenueGoal: 10000, costImage: 50, costCreator: 300, costEdited: 800 },
    // 5 ads. Revenue 0; leaves 0 - 1,000 = -1,000. No number of ads reaches the goal.
    expect: { adsForSpend: 5, revenuePerAd: 0, adsForGoal: null, profitPerAd: -1000, breakEvenRoas: 2 },
    says: "No format pays for itself",
  },
  {
    name: "A 0% margin",
    inputs: { spend: 3000, spendPerAd: 1000, roas: 4, margin: 0, revenueGoal: 0, costImage: 0, costCreator: 0, costEdited: 0 },
    // 3 ads; revenue 4,000 x 0% - 1,000 = -1,000. No return breaks even at a 0% margin.
    expect: { adsForSpend: 3, profitPerAd: -1000, breakEvenRoas: null, netImage: -1000 },
  },
];
