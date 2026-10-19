// Worked examples, each checked by hand. Practice numbers, not any real business's.
// Test sizes were worked through the formula on a calculator: z for 95% two-sided is 1.959964, for 80% power 0.841621,
// for 90% two-sided 1.644854 and for 90% power 1.281552.
const mix = { coldRate: 1.5, warmRate: 5, coldShare: 50, coldShareNext: 70 };
const usual = { lift: 10, confidence: 95, power: 80 };

export default [
  {
    name: "40,000 visitors and 1,200 orders",
    inputs: { visitors: 40000, orders: 1200, aov: 55, margin: 40, ...usual, ...mix },
    // Rate 1,200 / 40,000 = 3%. Revenue per visitor 1,200 x 55 / 40,000 = 1.65; profit 1.65 x 40% = 0.66.
    // Test: p1 = 0.03, p2 = 0.033, average 0.0315.
    // (1.959964 x sqrt(2 x 0.0315 x 0.9685) + 0.841621 x sqrt(0.03 x 0.97 + 0.033 x 0.967))^2 / 0.003^2
    // = (1.959964 x 0.247013 + 0.841621 x 0.247004)^2 / 0.000009 = 0.692021^2 / 0.000009 = 53,210.3, so 53,211 each.
    // Both versions 106,422. A week is 40,000 x 12 / 52 = 9,230.77 visitors, so 11.53 weeks. Orders each: 53,211 x 3% = 1,596.33.
    // Mix: 50% x 1.5 + 50% x 5 = 3.25%; 70% x 1.5 + 30% x 5 = 2.55%; down 0.7 points.
    expect: { convRate: 3, rpv: 1.65, ppv: 0.66, p2Rate: 3.3, pAvg: 3.15, zAlpha: 1.959964, zBeta: 0.841621, testVisitors: 53211, testTotal: 106422, testOrders: 1596.33, testWeeks: 11.529050, blendNow: 3.25, blendNext: 2.55, blendChange: -0.7 },
    tol: 2e-6,
    says: "you need 53,211 visitors on each version",
  },
  {
    name: "Looking for a bigger lift needs far fewer visitors",
    inputs: { visitors: 40000, orders: 1200, aov: 55, margin: 40, ...usual, lift: 20, ...mix },
    // p2 = 0.036: 13,913.6, so 13,914 each; 27,828 in all; 27,828 / 9,230.77 = 3.0147 weeks.
    expect: { testVisitors: 13914, testTotal: 27828, testWeeks: 3.0147 },
  },
  {
    name: "90% confidence and 90% power on a small site",
    inputs: { visitors: 2000, orders: 100, aov: 40, margin: 50, lift: 10, confidence: 90, power: 90, ...mix },
    // Rate 5%, p2 5.5%: 34,077.96, so 34,078 each; 68,156 in all; a week is 461.54 visitors, so 147.67 weeks.
    expect: { convRate: 5, rpv: 2, zAlpha: 1.644854, zBeta: 1.281552, testVisitors: 34078, testWeeks: 147.671333 },
  },
  {
    name: "Zero visitors",
    inputs: { visitors: 0, orders: 0, aov: 55, margin: 40, ...usual, ...mix },
    expect: { convRate: null, rpv: null, ppv: null, p2Rate: null, testVisitors: null, testWeeks: null, blendNow: 3.25 },
    says: "With no visitors there's nothing to measure yet",
  },
  {
    name: "Visitors but no orders",
    inputs: { visitors: 1000, orders: 0, aov: 55, margin: 40, ...usual, ...mix },
    expect: { convRate: 0, rpv: 0, ppv: 0, testVisitors: null, testWeeks: null },
    says: "No orders yet",
  },
  {
    name: "A lift past 100% can't be tested",
    inputs: { visitors: 1000, orders: 600, aov: 55, margin: 40, lift: 100, confidence: 95, power: 80, ...mix },
    // 60% x 2 = 120%: no rate can reach it.
    expect: { convRate: 60, p2Rate: 120, testVisitors: null },
  },
  {
    name: "A high rate and a big lift need few visitors",
    inputs: { visitors: 1000, orders: 600, aov: 55, margin: 40, lift: 50, confidence: 95, power: 80, coldRate: 1.5, warmRate: 5, coldShare: 0, coldShareNext: 100 },
    // p1 0.6, p2 0.9: 31.5, so 32 each; 64 in all; a week is 230.77 visitors: 0.2773 weeks.
    // Mix: 0% new gives 5%; 100% new gives 1.5%.
    expect: { testVisitors: 32, testTotal: 64, testWeeks: 0.277333, blendNow: 5, blendNext: 1.5, blendChange: -3.5 },
  },
];
