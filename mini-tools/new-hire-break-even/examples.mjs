// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (a hire who never pays back).

export default [
  {
    name: "A salesperson who pays back inside a year",
    inputs: { salary: 60000, oncost: 25, oneOff: 3000, rampMonths: 3, margin: 40, revenueMonth: 20000 },
    // Cost a month 60,000 x 1.25 / 12 = 6,250. Sales to cover it 6,250 / 0.4 = 15,625. Adds 20,000 x 40% = 8,000; net 1,750.
    // Still to recover after the ramp: 3,000 + 3 x (6,250 - 4,000) = 9,750. Payback 3 + 9,750 / 1,750 = 8.5714...
    // First year 8,000 x 10.5 - 75,000 - 3,000 = 6,000. Full year 1,750 x 12 = 21,000.
    expect: { costMonth: 6250, breakEvenRevenue: 15625, gainMonth: 8000, netMonth: 1750, holeRamp: 9750, paybackMonths: 8.571429, firstYearNet: 6000, yearNet: 21000 },
    says: "pay back after about 8.6 months",
  },
  {
    name: "A hire who adds less than they cost",
    inputs: { salary: 60000, oncost: 25, oneOff: 3000, rampMonths: 3, margin: 40, revenueMonth: 12000 },
    // Adds 12,000 x 40% = 4,800 against 6,250, so -1,450 a month. Never pays back.
    // Still to recover 3,000 + 3 x (6,250 - 2,400) = 14,550. First year 4,800 x 10.5 - 78,000 = -27,600. Full year -17,400.
    expect: { gainMonth: 4800, netMonth: -1450, holeRamp: 14550, paybackMonths: null, firstYearNet: -27600, yearNet: -17400 },
    says: "lose you $1,450.00 a month",
  },
  {
    name: "A 0% margin: the sales keep nothing",
    inputs: { salary: 60000, oncost: 25, oneOff: 3000, rampMonths: 3, margin: 0, revenueMonth: 20000 },
    // No sales to cover the cost. Adds 0, net -6,250. Still to recover 3,000 + 3 x 6,250 = 21,750. First year -78,000.
    expect: { breakEvenRevenue: null, gainMonth: 0, netMonth: -6250, holeRamp: 21750, paybackMonths: null, firstYearNet: -78000 },
    says: "never pays back",
  },
  {
    name: "A cost-saving hire who pays back during the ramp",
    inputs: { salary: 36000, oncost: 20, oneOff: 1000, rampMonths: 2, margin: 100, revenueMonth: 10000 },
    // Cost 36,000 x 1.2 / 12 = 3,600. Sales to cover it 3,600. Adds 10,000, net 6,400. Half pace is 5,000, above the cost.
    // Still to recover 1,000 + 2 x (3,600 - 5,000) = -1,800, so paid back in the ramp: 1,000 / (5,000 - 3,600) = 0.7142...
    // First year 10,000 x 11 - 43,200 - 1,000 = 65,800. Full year 76,800.
    expect: { costMonth: 3600, breakEvenRevenue: 3600, gainMonth: 10000, netMonth: 6400, holeRamp: -1800, paybackMonths: 0.714286, firstYearNet: 65800, yearNet: 76800 },
    says: "pay back after about 0.7 months",
  },
  {
    name: "No ramp and no one-off cost",
    inputs: { salary: 48000, oncost: 0, oneOff: 0, rampMonths: 0, margin: 50, revenueMonth: 10000 },
    // Cost 4,000. Sales to cover it 8,000. Adds 5,000, net 1,000. Nothing to recover, so payback is 0: from the first month.
    // First year 5,000 x 12 - 48,000 = 12,000.
    expect: { costMonth: 4000, breakEvenRevenue: 8000, gainMonth: 5000, netMonth: 1000, holeRamp: 0, paybackMonths: 0, firstYearNet: 12000, yearNet: 12000 },
    says: "pays for themselves from the first month",
  },
  {
    name: "Exactly covers their cost",
    inputs: { salary: 60000, oncost: 20, oneOff: 0, rampMonths: 0, margin: 50, revenueMonth: 12000 },
    // Cost 60,000 x 1.2 / 12 = 6,000. Adds 12,000 x 50% = 6,000. Net 0, so no payback. First year 0.
    expect: { costMonth: 6000, gainMonth: 6000, netMonth: 0, holeRamp: 0, paybackMonths: null, firstYearNet: 0, yearNet: 0 },
    says: "exactly what they cost",
  },
];
