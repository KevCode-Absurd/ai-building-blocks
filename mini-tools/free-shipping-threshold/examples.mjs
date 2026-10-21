// Worked examples, each checked by hand. Every way the tool is built (site, download, spreadsheet, AI code)
// must give these answers, or it doesn't ship. Practice numbers, not any real business's.
// null means "no answer" (no line can make free postage pay).

export default [
  {
    name: "A store whose line is set by a reachable stretch",
    inputs: { aov: 60, margin: 40, shipping: 8, allowance: 50, stretch: 20 },
    // An average order leaves 60 x 40% = 24; free postage leaves 24 - 8 = 16.
    // Lowest line: 8 / (0.40 x 0.50) = 8 / 0.20 = 40. Reachable line: 60 x 1.2 = 72. Higher is 72, a whole amount already.
    // Customer adds 72 - 60 = 12. At 72 the order leaves 72 x 0.4 = 28.80; postage takes 8 / 28.80 = 27.78%; leaves 28.80 - 8 = 20.80.
    expect: { marginAov: 24, profitAvgFree: 16, lowestLine: 40, reachLine: 72, threshold: 72, extraToAdd: 12, postageShare: 27.777778, profitAtLine: 20.8 },
    says: "Set free shipping at $72.00",
  },
  {
    name: "Thin margin: the cost of postage sets a high line",
    inputs: { aov: 30, margin: 20, shipping: 9, allowance: 50, stretch: 20 },
    // An average order leaves 30 x 20% = 6; free postage leaves 6 - 9 = -3.
    // Lowest line: 9 / (0.20 x 0.50) = 90. Reachable line: 30 x 1.2 = 36. Higher is 90.
    // Customer adds 90 - 30 = 60, more than double. At 90 the order leaves 18; postage takes 9 / 18 = 50%; leaves 18 - 9 = 9.
    expect: { marginAov: 6, profitAvgFree: -3, lowestLine: 90, reachLine: 36, threshold: 90, extraToAdd: 60, postageShare: 50, profitAtLine: 9 },
    says: "more than doubling it",
  },
  {
    name: "Postage may use all the margin, so the line only breaks even",
    inputs: { aov: 20, margin: 25, shipping: 10, allowance: 100, stretch: 0 },
    // Lowest line: 10 / (0.25 x 1.00) = 40. Reachable line: 20 x 1 = 20. Higher is 40.
    // At 40 the order leaves 10; postage takes 10 / 10 = 100%; leaves 10 - 10 = 0.
    expect: { marginAov: 5, profitAvgFree: -5, lowestLine: 40, reachLine: 20, threshold: 40, extraToAdd: 20, postageShare: 100, profitAtLine: 0 },
    says: "postage takes 100% of its margin",
  },
  {
    name: "The line rounds up to a whole amount",
    inputs: { aov: 47, margin: 40, shipping: 6, allowance: 50, stretch: 10 },
    // Lowest line: 6 / 0.20 = 30. Reachable line: 47 x 1.1 = 51.70, rounded up to 52. Customer adds 5.
    // At 52 the order leaves 20.80; postage takes 6 / 20.80 = 28.846%; leaves 14.80.
    expect: { lowestLine: 30, reachLine: 51.7, threshold: 52, extraToAdd: 5, postageShare: 28.846154, profitAtLine: 14.8 },
  },
  {
    name: "Postage that costs nothing",
    inputs: { aov: 60, margin: 40, shipping: 0, allowance: 50, stretch: 20 },
    // Lowest line: 0 / 0.20 = 0. Reachable line 72. Postage takes 0 of the margin; an order at 72 leaves 28.80.
    expect: { profitAvgFree: 24, lowestLine: 0, threshold: 72, postageShare: 0, profitAtLine: 28.8 },
    says: "Postage costs you nothing",
  },
  {
    name: "Nothing is left from an order before postage",
    inputs: { aov: 60, margin: 0, shipping: 8, allowance: 50, stretch: 20 },
    // 60 x 0% = 0 left, so postage can never be covered: no line.
    expect: { marginAov: 0, profitAvgFree: -8, lowestLine: null, reachLine: 72, threshold: null, extraToAdd: null, postageShare: null, profitAtLine: null },
    says: "no free shipping minimum can pay for itself",
  },
];
