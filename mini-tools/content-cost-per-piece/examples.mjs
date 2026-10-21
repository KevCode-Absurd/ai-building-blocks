// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no pieces, views or results to divide by).

export default [
  {
    name: "Twenty pieces a month, mostly in-house",
    inputs: { pieces: 20, hoursPer: 2, hourlyValue: 50, freelance: 800, tools: 100, viewsPer: 1500, resultsPer: 2 },
    // 20 x 2 = 40 hours x 50 = 2,000. Total 2,000 + 800 + 100 = 2,900. Time is 2,000 / 2,900 = 68.97%. Per piece 145.
    // Per view 145 / 1,500 = 0.096666...; per 1,000 views 96.666... Per result 145 / 2 = 72.50. A year 34,800.
    expect: { hoursMonth: 40, timeCost: 2000, totalMonth: 2900, timeShare: 68.965517, perPiece: 145, perView: 0.096667, per1000Views: 96.666667, perResult: 72.5, yearCost: 34800 },
    says: "Each piece costs you $145.00",
  },
  {
    name: "Nothing published yet",
    inputs: { pieces: 0, hoursPer: 2, hourlyValue: 50, freelance: 800, tools: 100, viewsPer: 1500, resultsPer: 2 },
    // No hours, no time cost. Still 900 a month on freelancers and tools, 10,800 a year. No per-piece numbers.
    expect: { hoursMonth: 0, timeCost: 0, totalMonth: 900, timeShare: 0, perPiece: null, perView: null, per1000Views: null, perResult: null, yearCost: 10800 },
    says: "publish nothing yet",
  },
  {
    name: "No views or results tracked",
    inputs: { pieces: 20, hoursPer: 2, hourlyValue: 50, freelance: 800, tools: 100, viewsPer: 0, resultsPer: 0 },
    // Same 145 a piece, but nothing to divide it by.
    expect: { perPiece: 145, perView: null, per1000Views: null, perResult: null },
    says: "Add views and results",
  },
  {
    name: "All freelancers, no in-house time",
    inputs: { pieces: 10, hoursPer: 0, hourlyValue: 50, freelance: 3000, tools: 0, viewsPer: 5000, resultsPer: 5 },
    // 0 hours. Total 3,000, none of it time. Per piece 300. Per view 0.06, per 1,000 views 60. Per result 60. A year 36,000.
    expect: { hoursMonth: 0, timeCost: 0, totalMonth: 3000, timeShare: 0, perPiece: 300, perView: 0.06, per1000Views: 60, perResult: 60, yearCost: 36000 },
    says: "Each piece costs you $300.00",
  },
  {
    name: "Everything priced at zero",
    inputs: { pieces: 20, hoursPer: 2, hourlyValue: 0, freelance: 0, tools: 0, viewsPer: 1500, resultsPer: 2 },
    // 40 hours worth 0. Total 0, time share 0 (nothing to share). Per piece 0, per view 0, per result 0.
    expect: { hoursMonth: 40, timeCost: 0, totalMonth: 0, timeShare: 0, perPiece: 0, perView: 0, per1000Views: 0, perResult: 0, yearCost: 0 },
    says: "costs you nothing",
  },
  {
    name: "A busy channel with cheap pieces",
    inputs: { pieces: 60, hoursPer: 1.5, hourlyValue: 40, freelance: 2000, tools: 250, viewsPer: 800, resultsPer: 1 },
    // 60 x 1.5 = 90 hours x 40 = 3,600. Total 5,850; time 61.54%. Per piece 97.50. Per view 0.121875; per 1,000 views 121.875. Per result 97.50. A year 70,200.
    expect: { hoursMonth: 90, timeCost: 3600, totalMonth: 5850, timeShare: 61.538462, perPiece: 97.5, perView: 0.121875, per1000Views: 121.875, perResult: 97.5, yearCost: 70200 },
    says: "$121.88 for every 1,000 views",
  },
];
