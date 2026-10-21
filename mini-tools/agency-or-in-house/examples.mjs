// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (an agency fee that does not move with spend, or no ad spend).

export default [
  {
    name: "A modest ad spend: the agency costs less",
    inputs: { retainer: 3000, agencyShare: 10, adSpend: 20000, salary: 60000, oncost: 25, toolsMonth: 400, hireOneOff: 5000, months: 12 },
    // Agency 3,000 + 2,000 = 5,000 a month (25% of spend), 60,000 a year. Hire 60,000 x 1.25 / 12 + 400 = 6,650 a month; 79,800 + 5,000 = 84,800.
    // Gap 24,800, or 2,066.67 a month. Flip at (6,650 + 416.67 - 3,000) / 0.10 = 40,666.67 of ad spend.
    expect: { agencyMonth: 5000, feeShareOfSpend: 25, agencyTotal: 60000, inHouseMonth: 6650, inHouseTotal: 84800, gap: 24800, gapMonth: 2066.666667, breakEvenSpend: 40666.666667 },
    says: "the agency costs $24,800.00 less",
  },
  {
    name: "A big ad spend: the hire costs less",
    inputs: { retainer: 3000, agencyShare: 10, adSpend: 60000, salary: 60000, oncost: 25, toolsMonth: 400, hireOneOff: 5000, months: 12 },
    // Agency 3,000 + 6,000 = 9,000 a month (15% of spend), 108,000 a year. Hire still 84,800. Gap -23,200, or -1,933.33 a month. Flip still at 40,666.67.
    expect: { agencyMonth: 9000, feeShareOfSpend: 15, agencyTotal: 108000, gap: -23200, gapMonth: -1933.333333, breakEvenSpend: 40666.666667 },
    says: "the hire costs $23,200.00 less",
  },
  {
    name: "A flat retainer with no share of spend",
    inputs: { retainer: 3000, agencyShare: 0, adSpend: 20000, salary: 60000, oncost: 25, toolsMonth: 400, hireOneOff: 5000, months: 12 },
    // Agency 3,000 a month, 36,000 a year. Gap 84,800 - 36,000 = 48,800, or 4,066.67 a month. No spend flips it.
    expect: { agencyMonth: 3000, agencyTotal: 36000, gap: 48800, gapMonth: 4066.666667, breakEvenSpend: null },
    says: "does not move with ad spend",
  },
  {
    name: "No ad spend yet",
    inputs: { retainer: 3000, agencyShare: 10, adSpend: 0, salary: 60000, oncost: 25, toolsMonth: 400, hireOneOff: 5000, months: 12 },
    // Agency 3,000 a month; no share of a zero spend to show. Gap 48,800. Flip at 40,666.67.
    expect: { agencyMonth: 3000, feeShareOfSpend: null, agencyTotal: 36000, gap: 48800, breakEvenSpend: 40666.666667 },
    says: "the agency costs $48,800.00 less",
  },
  {
    name: "Cheaper hire, bigger spend",
    inputs: { retainer: 2000, agencyShare: 10, adSpend: 50000, salary: 60000, oncost: 20, toolsMonth: 0, hireOneOff: 0, months: 12 },
    // Agency 2,000 + 5,000 = 7,000 a month (14%), 84,000. Hire 60,000 x 1.2 / 12 = 6,000 a month, 72,000. Gap -12,000, -1,000 a month.
    // Flip at (6,000 + 0 - 2,000) / 0.10 = 40,000.
    expect: { agencyMonth: 7000, feeShareOfSpend: 14, agencyTotal: 84000, inHouseMonth: 6000, inHouseTotal: 72000, gap: -12000, gapMonth: -1000, breakEvenSpend: 40000 },
    says: "Below $40,000.00 a month of ad spend",
  },
  {
    name: "Comparing over six months",
    inputs: { retainer: 3000, agencyShare: 10, adSpend: 20000, salary: 60000, oncost: 25, toolsMonth: 400, hireOneOff: 5000, months: 6 },
    // Agency 30,000. Hire 6,650 x 6 + 5,000 = 44,900. Gap 14,900, or 2,483.33 a month. Flip at (6,650 + 833.33 - 3,000) / 0.10 = 44,833.33: the one-off cost weighs more over a short period.
    expect: { agencyTotal: 30000, inHouseTotal: 44900, gap: 14900, gapMonth: 2483.333333, breakEvenSpend: 44833.333333 },
    says: "Above $44,833.33 a month of ad spend",
  },
];
