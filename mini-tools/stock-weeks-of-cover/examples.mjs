// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no sales to divide by, or no stock and no sales).

export default [
  {
    name: "Twelve weeks of stock when eight would do",
    inputs: { onHand: 1200, sold4: 400, incoming: 0, targetWeeks: 8, unitCost: 9 },
    // 400 / 4 = 100 a week. Cover 1,200 / 100 = 12 weeks. Sell-through 400 / 1,600 = 25%. Cash 1,200 x 9 = 10,800.
    // Target 100 x 8 = 800 units. Extra 400 units = 3,600. Short 0. 400 / 100 = 4 weeks to the target.
    expect: { weeklySales: 100, cover: 12, sellThrough: 25, cashTied: 10800, targetUnits: 800, excessUnits: 400, excessCash: 3600, shortUnits: 0, weeksToTarget: 4 },
    says: "400 units ($3,600.00) are more than you need",
  },
  {
    name: "Running short even with a delivery coming",
    inputs: { onHand: 300, sold4: 400, incoming: 200, targetWeeks: 8, unitCost: 9 },
    // 100 a week. Cover (300 + 200) / 100 = 5 weeks. Sell-through 400 / 700 = 57.14%. Cash 2,700. Target 800. Extra 0. Short 800 - 500 = 300. 0 weeks to the target.
    expect: { weeklySales: 100, cover: 5, sellThrough: 57.142857, cashTied: 2700, targetUnits: 800, excessUnits: 0, excessCash: 0, shortUnits: 300, weeksToTarget: 0 },
    says: "You are 300 units short",
  },
  {
    name: "Nothing sold in four weeks",
    inputs: { onHand: 1200, sold4: 0, incoming: 0, targetWeeks: 8, unitCost: 9 },
    // 0 a week, so no cover. Sell-through 0 / 1,200 = 0%. Cash 10,800. Target 0 units, so all 1,200 are extra (10,800). No weeks to the target.
    expect: { weeklySales: 0, cover: null, sellThrough: 0, cashTied: 10800, targetUnits: 0, excessUnits: 1200, excessCash: 10800, shortUnits: 0, weeksToTarget: null },
    says: "a useful sell-down time cannot be estimated",
  },
  {
    name: "No stock and no sales",
    inputs: { onHand: 0, sold4: 0, incoming: 0, targetWeeks: 8, unitCost: 9 },
    // Nothing to divide by anywhere.
    expect: { weeklySales: 0, cover: null, sellThrough: null, cashTied: 0, excessUnits: 0, shortUnits: 0, weeksToTarget: null },
    says: "No stock and no sales",
  },
  {
    name: "Exactly on target",
    inputs: { onHand: 800, sold4: 400, incoming: 0, targetWeeks: 8, unitCost: 9 },
    // 100 a week, cover 8 weeks, sell-through 400 / 1,200 = 33.33%. Cash 7,200. Target 800, extra 0, short 0.
    expect: { cover: 8, sellThrough: 33.333333, cashTied: 7200, excessUnits: 0, shortUnits: 0, weeksToTarget: 0 },
    says: "exactly the 8 weeks you want",
  },
  {
    name: "A big order on the way for a slow seller",
    inputs: { onHand: 500, sold4: 200, incoming: 1000, targetWeeks: 6, unitCost: 4.5 },
    // 50 a week. Cover 1,500 / 50 = 30 weeks. Sell-through 200 / 700 = 28.57%. Cash on hand 2,250. Target 300. Extra 1,200 = 5,400. 24 weeks to the target.
    expect: { weeklySales: 50, cover: 30, sellThrough: 28.571429, cashTied: 2250, targetUnits: 300, excessUnits: 1200, excessCash: 5400, shortUnits: 0, weeksToTarget: 24 },
    says: "1,200 units ($5,400.00) are more than you need",
  },
];
