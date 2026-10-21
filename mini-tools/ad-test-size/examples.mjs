// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// z values: 1.959964 for 95% confidence (two-sided), 1.644854 for 90%, 0.841621 for 80% power.
// null means "no answer" (a rate the test can't be sized from, or no daily budget).

export default [
  {
    name: "Two ads, a 1% click rate, a 20% lift",
    inputs: { rate: 1, cpm: 10, dailyBudget: 50, versions: 2, lift: 20, confidence: 95, power: 80 },
    // Lifted rate 1.2%, average 1.1%. 1.959964 x sqrt(2 x 0.011 x 0.989) = 0.289106; 0.841621 x sqrt(0.01 x 0.99 + 0.012 x 0.988) = 0.124138.
    // (0.289106 + 0.124138)^2 = 0.170771; divided by 0.002^2 = 42,692.7, so 42,693 views each. x 1% = 426.93 results each.
    // 85,386 views in all; / 1,000 x 10 = 853.86; / 50 a day = 17.08, so 18 days.
    expect: { rate2: 1.2, zAlpha: 1.959964, zBeta: 0.841621, perVersion: 42693, resultsPerVersion: 426.93, total: 85386, cost: 853.86, days: 18 },
    says: "42,693 views on each of 2 versions",
  },
  {
    name: "Three ads at a 3% rate, hunting a 10% lift",
    inputs: { rate: 3, cpm: 8, dailyBudget: 100, versions: 3, lift: 10, confidence: 95, power: 80 },
    // Lifted 3.3%, average 3.15%. 1.959964 x sqrt(2 x 0.0315 x 0.9685) = 0.484137; 0.841621 x sqrt(0.03 x 0.97 + 0.033 x 0.967) = 0.207884.
    // (0.692021)^2 = 0.478893; / 0.003^2 = 53,210.3, so 53,211 each. 159,633 in all; x 8 / 1,000 = 1,277.064; / 100 = 12.77, so 13 days.
    expect: { rate2: 3.3, perVersion: 53211, resultsPerVersion: 1596.33, total: 159633, cost: 1277.064, days: 13 },
    says: "about 13 days",
  },
  {
    name: "A rate of zero can't be tested",
    inputs: { rate: 0, cpm: 10, dailyBudget: 50, versions: 2, lift: 20, confidence: 95, power: 80 },
    // Nothing to lift from, so no size, cost or days.
    expect: { rate2: 0, perVersion: null, resultsPerVersion: null, total: null, cost: null, days: null },
    says: "A rate of 0% can't size a test",
  },
  {
    name: "A lift that goes past 100%",
    inputs: { rate: 60, cpm: 10, dailyBudget: 50, versions: 2, lift: 100, confidence: 95, power: 80 },
    // 60% x 2 = 120%, which no ad can reach. No size.
    expect: { rate2: 120, perVersion: null, total: null, cost: null, days: null },
    says: "goes past 100%",
  },
  {
    name: "No daily budget yet",
    inputs: { rate: 1, cpm: 10, dailyBudget: 0, versions: 2, lift: 20, confidence: 95, power: 80 },
    // Same test as the first example, but no budget to divide by, so no days.
    expect: { perVersion: 42693, total: 85386, cost: 853.86, days: null },
    says: "Type a daily budget",
  },
  {
    name: "A small rate, a big lift, 90% confidence",
    inputs: { rate: 0.5, cpm: 12, dailyBudget: 30, versions: 2, lift: 50, confidence: 90, power: 80 },
    // Lifted 0.75%, average 0.625%. 1.644854 x sqrt(2 x 0.00625 x 0.99375) = 0.183326; 0.841621 x sqrt(0.005 x 0.995 + 0.0075 x 0.9925) = 0.093790.
    // (0.277116)^2 = 0.076793; / 0.0025^2 = 12,286.9, so 12,287 each. x 0.5% = 61.435 results. 24,574 in all; x 12 / 1,000 = 294.888; / 30 = 9.83, so 10 days.
    expect: { rate2: 0.75, zAlpha: 1.644854, perVersion: 12287, resultsPerVersion: 61.435, total: 24574, cost: 294.888, days: 10 },
    says: "about 10 days",
  },
  {
    name: "A high rate needs a tiny test",
    inputs: { rate: 50, cpm: 10, dailyBudget: 50, versions: 2, lift: 20, confidence: 95, power: 80 },
    // Lifted 60%, average 55%. 1.959964 x sqrt(2 x 0.55 x 0.45) = 1.378956; 0.841621 x sqrt(0.25 + 0.24) = 0.589135.
    // (1.968091)^2 = 3.873382; / 0.1^2 = 387.3, so 388 each; 194 results each. 776 in all; 7.76; 0.16 of a day, so 1 day.
    expect: { rate2: 60, perVersion: 388, resultsPerVersion: 194, total: 776, cost: 7.76, days: 1 },
    says: "388 views on each of 2 versions",
  },
];
