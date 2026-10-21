// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.

export default [
  {
    name: "Losing 5,000 a month with nothing changing",
    inputs: { cash: 60000, income: 10000, costs: 15000, incomeGrowth: 0, costGrowth: 0, targetMonths: 12, startMonth: 10 },
    // Net now: 10,000 - 15,000 = -5,000. Step: 0. Runway: 60,000 / 5,000 = 12 months.
    // Month: 10 + 12 = 22; 22 - 12 = 10, so October, one calendar year on. Lowest point is month 12: -60,000, so 60,000 covers it: extra 0.
    expect: { netNow: -5000, flatRunway: 12, step: 0, runway: 12, endMonth: 10, yearsAhead: 1, extraNeeded: 0 },
    says: "runs out in October",
  },
  {
    name: "Money in growing 5% of today's figure each month",
    inputs: { cash: 4800, income: 8000, costs: 10000, incomeGrowth: 5, costGrowth: 0, targetMonths: 12, startMonth: 10 },
    // Net now -2,000. Step: 8,000 x 5% = +400 a month. Monthly nets: -2,000, -1,600, -1,200 ... so after 3 months: -4,800. Cash 4,800 gone: 3 months.
    // Check the sum: b = -2,000 - 200 = -2,200; b x b = 4,840,000; 2 x 400 x 4,800 = 3,840,000; disc = 1,000,000; (2,200 - 1,000) / 400 = 3.
    // With no growth: 4,800 / 2,000 = 2.4 months. Month 10 + 3 = 13, so January, one calendar year on.
    // Net turns positive after 2,000 / 400 = 5 months; running total then: -2,000 -1,600 -1,200 -800 -400 = -6,000, so extra = 6,000 - 4,800 = 1,200.
    expect: { netNow: -2000, flatRunway: 2.4, step: 400, disc: 1000000, runway: 3, endMonth: 1, yearsAhead: 1, lowMonth: 5, extraNeeded: 1200 },
    says: "runs out in January",
  },
  {
    name: "Making money now, but costs creep up 1% a month",
    inputs: { cash: 2600, income: 21000, costs: 20000, incomeGrowth: 0, costGrowth: 1, targetMonths: 12, startMonth: 3 },
    // Net now +1,000. Step: -20,000 x 1% = -200. Total after 13 months: 13 x 1,000 - 200 x 13 x 12 / 2 = 13,000 - 15,600 = -2,600, which is the whole 2,600.
    // Check: b = 1,000 + 100 = 1,100; 1,100 x 1,100 = 1,210,000; plus 2 x 200 x 2,600 = 1,040,000; disc = 2,250,000, root 1,500; (-1,100 - 1,500) / -200 = 13.
    // With no growth it never runs out. Month 3 + 13 = 16, so April next year. At month 12 the total is 12,000 - 13,200 = -1,200, under 2,600: extra 0.
    expect: { netNow: 1000, flatRunway: null, step: -200, disc: 2250000, runway: 13, endMonth: 4, yearsAhead: 1, extraNeeded: 0 },
    says: "lasts about 13.0 months",
  },
  {
    name: "No cash at all",
    inputs: { cash: 0, income: 5000, costs: 6000, incomeGrowth: 0, costGrowth: 0, targetMonths: 12, startMonth: 6 },
    // Cash 0, so runway 0 and the month is this one (6), this year. To cover 12 months at -1,000 a month you need 12,000.
    expect: { netNow: -1000, flatRunway: 0, runway: 0, endMonth: 6, yearsAhead: 0, extraNeeded: 12000 },
    says: "already out",
  },
  {
    name: "Making a profit, so it never runs out",
    inputs: { cash: 20000, income: 12000, costs: 9000, incomeGrowth: 0, costGrowth: 0, targetMonths: 12, startMonth: 1 },
    // Net +3,000 and no change: the balance only rises. No run-out date, nothing extra needed.
    expect: { netNow: 3000, flatRunway: null, step: 0, runway: null, endMonth: null, yearsAhead: null, extraNeeded: 0 },
    says: "does not run out",
  },
  {
    name: "Money in doubling its figure each month (100%)",
    inputs: { cash: 3000, income: 1000, costs: 4000, incomeGrowth: 100, costGrowth: 0, targetMonths: 12, startMonth: 1 },
    // Net now -3,000. Step: 1,000 x 100% = +1,000. After 1 month: -3,000, which is all 3,000. Runway 1 month.
    // Check: b = -3,000 - 500 = -3,500; 12,250,000 - 2 x 1,000 x 3,000 = 6,250,000; root 2,500; (3,500 - 2,500) / 1,000 = 1.
    // Month 1 + 1 = 2, so February, this year. Net turns positive after 3 months; the total then: -3,000 -2,000 -1,000 = -6,000, so extra = 3,000.
    expect: { netNow: -3000, flatRunway: 1, step: 1000, disc: 6250000, runway: 1, endMonth: 2, yearsAhead: 0, lowMonth: 3, extraNeeded: 3000 },
    says: "runs out in February",
  },
];
