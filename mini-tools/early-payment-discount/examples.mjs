// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no days to scale by, everything off, or free money).

export default [
  {
    name: "2% off for paying 20 days early",
    inputs: { invoice: 10000, discount: 2, daysEarly: 20, borrowRate: 12 },
    // Saving 200; pay 9,800. Yearly rate 2 / 98 x 365 / 20 = 0.020408 x 18.25 = 37.24%. Interest 9,800 x 12% x 20 / 365 = 64.438...
    // Net 200 - 64.44 = 135.56. Smallest discount worth it: r = 0.12 x 20 / 365 = 0.0065753; r / (1 + r) = 0.6532%. Most days: 0.020408 / 0.12 x 365 = 62.07.
    expect: { saving: 200, paid: 9800, yearlyRate: 37.244898, costOfMoney: 64.438356, netGain: 135.561644, breakEvenDiscount: 0.653239, maxDays: 62.07483 },
    says: "like earning 37.24% a year",
  },
  {
    name: "Half a percent for paying 60 days early is not worth it",
    inputs: { invoice: 10000, discount: 0.5, daysEarly: 60, borrowRate: 12 },
    // Saving 50; pay 9,950. Yearly rate 0.5 / 99.5 x 365 / 60 = 0.0050251 x 6.0833 = 3.06%. Interest 9,950 x 12% x 60 / 365 = 196.27.
    // Net -146.27. Smallest discount: r = 0.12 x 60 / 365 = 0.019726; r / (1 + r) = 1.9344%. Most days 0.0050251 / 0.12 x 365 = 15.28.
    expect: { saving: 50, paid: 9950, yearlyRate: 3.056952, costOfMoney: 196.273973, netGain: -146.273973, breakEvenDiscount: 1.934442, maxDays: 15.284757 },
    says: "You come out $146.27 behind",
  },
  {
    name: "No days early: the discount is free money",
    inputs: { invoice: 10000, discount: 2, daysEarly: 0, borrowRate: 12 },
    // Saving 200, no rate to scale, no interest, net 200. Smallest discount 0. Most days still 62.07.
    expect: { saving: 200, yearlyRate: null, costOfMoney: 0, netGain: 200, breakEvenDiscount: 0, maxDays: 62.07483 },
    says: "free money",
  },
  {
    name: "Your money costs nothing",
    inputs: { invoice: 10000, discount: 2, daysEarly: 20, borrowRate: 0 },
    // Interest 0, so net is the whole 200. Smallest discount 0. Any number of days is fine.
    expect: { saving: 200, yearlyRate: 37.244898, costOfMoney: 0, netGain: 200, breakEvenDiscount: 0, maxDays: null },
    says: "you come out $200.00 ahead",
  },
  {
    name: "No discount on offer",
    inputs: { invoice: 10000, discount: 0, daysEarly: 20, borrowRate: 12 },
    // Nothing saved; pay the full 10,000. Rate 0. Interest 10,000 x 12% x 20 / 365 = 65.75. Net -65.75. Most days 0.
    expect: { saving: 0, paid: 10000, yearlyRate: 0, costOfMoney: 65.753425, netGain: -65.753425, breakEvenDiscount: 0.653239, maxDays: 0 },
    says: "There is no discount",
  },
  {
    name: "Everything off",
    inputs: { invoice: 10000, discount: 100, daysEarly: 20, borrowRate: 12 },
    // Saving 10,000, pay 0. No rate (dividing by 1 - 100%). Interest on 0 is 0. Net 10,000. No most-days figure.
    expect: { saving: 10000, paid: 0, yearlyRate: null, costOfMoney: 0, netGain: 10000, maxDays: null },
    says: "pay nothing",
  },
];
