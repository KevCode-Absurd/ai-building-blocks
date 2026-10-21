// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no churn, nothing spent, or nothing kept).

export default [
  {
    name: "A healthy subscription at 5% churn",
    inputs: { price: 30, margin: 80, churn: 5, cac: 150, targetRatio: 3 },
    // Profit a month 30 x 80% = 24. Stay 100 / 5 = 20 months. Sales 30 x 20 = 600. Lifetime value 24 x 20 = 480.
    // Ratio 480 / 150 = 3.2. Payback 150 / 24 = 6.25 months. Most to spend 480 / 3 = 160. Kept after a year 0.95^12 = 0.540360... so 54.04%.
    expect: { profitMonth: 24, lifeMonths: 20, revenueLife: 600, ltv: 480, ratio: 3.2, paybackMonths: 6.25, maxCac: 160, keptYear: 54.036009 },
    says: "meets your 3.00x target",
  },
  {
    name: "Nobody cancels",
    inputs: { price: 30, margin: 80, churn: 0, cac: 150, targetRatio: 3 },
    // No churn, so no average stay, no lifetime value, no ratio and no spending limit. Payback is still 150 / 24 = 6.25 months. Everyone is still here after a year.
    expect: { profitMonth: 24, lifeMonths: null, revenueLife: null, ltv: null, ratio: null, paybackMonths: 6.25, maxCac: null, keptYear: 100 },
    says: "no end",
  },
  {
    name: "They leave before they pay back",
    inputs: { price: 20, margin: 70, churn: 10, cac: 200, targetRatio: 3 },
    // Profit 14 a month. Stay 10 months. Sales 200. Lifetime value 140, under the 200 cost: ratio 0.7. Payback 200 / 14 = 14.2857... months, longer than the stay.
    // Most to spend 140 / 3 = 46.666... Kept after a year 0.9^12 = 0.282429536... so 28.24%.
    expect: { profitMonth: 14, lifeMonths: 10, revenueLife: 200, ltv: 140, ratio: 0.7, paybackMonths: 14.285714, maxCac: 46.666667, keptYear: 28.242954 },
    says: "They leave before they pay back",
  },
  {
    name: "Each payment keeps nothing",
    inputs: { price: 20, margin: 0, churn: 10, cac: 100, targetRatio: 3 },
    // Profit 0. Stay 10 months, sales 200, but lifetime value 0, ratio 0, no payback, most to spend 0.
    expect: { profitMonth: 0, lifeMonths: 10, revenueLife: 200, ltv: 0, ratio: 0, paybackMonths: null, maxCac: 0, keptYear: 28.242954 },
    says: "keeps you nothing",
  },
  {
    name: "Nothing spent to win them",
    inputs: { price: 50, margin: 60, churn: 2, cac: 0, targetRatio: 3 },
    // Profit 30. Stay 50 months. Sales 2,500. Lifetime value 1,500. No ratio with a cost of 0. Payback 0 / 30 = 0. Most to spend 500.
    // Kept after a year 0.98^12 = 0.784716... so 78.47%.
    expect: { profitMonth: 30, lifeMonths: 50, revenueLife: 2500, ltv: 1500, ratio: null, paybackMonths: 0, maxCac: 500, keptYear: 78.471672 },
    says: "You spent nothing to win them",
  },
  {
    name: "Under target but above cost",
    inputs: { price: 30, margin: 80, churn: 8, cac: 150, targetRatio: 3 },
    // Profit 24. Stay 12.5 months. Sales 375. Lifetime value 300. Ratio 2. Payback 6.25 months. Most to spend 100. Kept 0.92^12 = 0.3676664... so 36.77%.
    expect: { profitMonth: 24, lifeMonths: 12.5, revenueLife: 375, ltv: 300, ratio: 2, paybackMonths: 6.25, maxCac: 100, keptYear: 36.766639 },
    says: "under your 3.00x target",
  },
  {
    name: "Everyone leaves after one month",
    inputs: { price: 30, margin: 80, churn: 100, cac: 10, targetRatio: 3 },
    // Stay 100 / 100 = 1 month. Sales 30, lifetime value 24, ratio 2.4, payback 10 / 24 = 0.4166... months, most to spend 8. Nobody is left after a year.
    expect: { lifeMonths: 1, revenueLife: 30, ltv: 24, ratio: 2.4, paybackMonths: 0.416667, maxCac: 8, keptYear: 0 },
    says: "under your 3.00x target",
  },
];
