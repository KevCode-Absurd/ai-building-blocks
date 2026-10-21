// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (cash that does not run out, or no cash to protect).

export default [
  {
    name: "A hire that takes a year off the runway",
    inputs: { cash: 120000, income: 10000, costs: 15000, salary: 60000, oncost: 25, oneOff: 3000, addRevenue: 2000 },
    // Net now -5,000; runway 120,000 / 5,000 = 24 months. Hire 60,000 x 1.25 / 12 = 6,250. Net after -5,000 - 6,250 + 2,000 = -9,250.
    // Cash after 117,000; runway after 117,000 / 9,250 = 12.6486... Lost 24 - 12.6486 = 11.3513... To keep it: 6,250 + 5,000 x 3,000 / 120,000 = 6,375.
    expect: { netNow: -5000, runwayNow: 24, hireCost: 6250, netAfter: -9250, cashAfter: 117000, runwayAfter: 12.648649, monthsLost: 11.351351, keepAdd: 6375 },
    says: "costs you 11.4 months of runway",
  },
  {
    name: "A hire who brings in more than they cost",
    inputs: { cash: 120000, income: 10000, costs: 15000, salary: 60000, oncost: 25, oneOff: 3000, addRevenue: 8000 },
    // Net after -5,000 - 6,250 + 8,000 = -3,250. Runway after 117,000 / 3,250 = 36. Lost 24 - 36 = -12: a year gained.
    expect: { runwayNow: 24, netAfter: -3250, runwayAfter: 36, monthsLost: -12, keepAdd: 6375 },
    says: "add 12.0 months of runway",
  },
  {
    name: "Profitable today, losing money with the hire",
    inputs: { cash: 120000, income: 20000, costs: 15000, salary: 60000, oncost: 25, oneOff: 3000, addRevenue: 0 },
    // Net now +5,000, so no end date today. Net after 5,000 - 6,250 = -1,250. Runway after 117,000 / 1,250 = 93.6 months.
    // Months lost has no answer (there was no end date). To stay profitable the hire must add 6,250 - 5,000 = 1,250.
    expect: { netNow: 5000, runwayNow: null, netAfter: -1250, runwayAfter: 93.6, monthsLost: null, keepAdd: 1250 },
    says: "Today your cash does not run out",
  },
  {
    name: "Profitable before and after",
    inputs: { cash: 120000, income: 20000, costs: 15000, salary: 60000, oncost: 25, oneOff: 3000, addRevenue: 3000 },
    // Net after 5,000 - 6,250 + 3,000 = 1,750. No end date either way, so 0 months lost. To stay profitable: 1,250.
    expect: { netNow: 5000, runwayNow: null, netAfter: 1750, runwayAfter: null, monthsLost: 0, keepAdd: 1250 },
    says: "does not run out either way",
  },
  {
    name: "No cash in the bank",
    inputs: { cash: 0, income: 10000, costs: 15000, salary: 60000, oncost: 25, oneOff: 3000, addRevenue: 2000 },
    // Runway 0 / 5,000 = 0 today. Cash after the one-off cost is 0, not negative, so 0 months after too. Nothing to protect.
    expect: { runwayNow: 0, cashAfter: 0, runwayAfter: 0, monthsLost: 0, keepAdd: null },
    says: "no cash",
  },
  {
    name: "No one-off cost and nothing brought in",
    inputs: { cash: 120000, income: 10000, costs: 15000, salary: 60000, oncost: 25, oneOff: 0, addRevenue: 0 },
    // Net after -11,250. Runway after 120,000 / 11,250 = 10.6666... Lost 24 - 10.6667 = 13.3333... To keep it: 6,250 + 0 = 6,250.
    expect: { netAfter: -11250, cashAfter: 120000, runwayAfter: 10.666667, monthsLost: 13.333333, keepAdd: 6250 },
    says: "costs you 13.3 months of runway",
  },
];
