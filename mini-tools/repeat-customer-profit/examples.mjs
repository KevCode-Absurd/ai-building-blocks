// Worked examples, each checked by hand. Practice numbers, not any real business's.
// A month is 30.4375 days, so 3 months is 91.3125 days, 6 is 182.625 and 12 is 365.25.

export default [
  {
    name: "40% come back every 60 days",
    inputs: { profitPerOrder: 25, cac: 40, daysBetween: 60, comeBack: 40 },
    // 3 months: 91.3125 / 60 = 1 reorder; orders 1 + 0.4 = 1.4; 25 x 1.4 - 40 = -5.
    // 6 months: 3 reorders; 1 + 0.4 + 0.16 + 0.064 = 1.624; 40.60 - 40 = 0.60.
    // 12 months: 6 reorders; (1 - 0.4^7) / 0.6 = 1.663936; 41.5984 - 40 = 1.5984.
    // Pays back: after 2 reorders 25 x 1.56 = 39 (short); after 3, 40.60. So order 4, at 3 x 60 / 30.4375 = 5.9138 months.
    expect: { reorders3: 1, orders3: 1.4, worth3: -5, reorders6: 3, orders6: 1.624, worth6: 0.6, reorders12: 6, orders12: 1.663936, worth12: 1.5984, longRunOrders: 1.666667, longRunWorth: 1.666667, paybackReorders: 3, paybackOrder: 4, paybackMonths: 5.913758 },
    says: "on order 4, after about 5.9 months",
  },
  {
    name: "Half come back every 60 days",
    inputs: { profitPerOrder: 25, cac: 40, daysBetween: 60, comeBack: 50 },
    // Orders: 1.5 at 3 months; 1.875 at 6; (1 - 0.5^7) / 0.5 = 1.984375 at 12.
    // Worth: 37.50 - 40 = -2.50; 46.875 - 40 = 6.875; 49.609375 - 40 = 9.609375. Long run: 2 orders, 10.
    // Pays back on order 3 (25 x 1.75 = 43.75), after 2 x 60 / 30.4375 = 3.9425 months.
    expect: { orders3: 1.5, worth3: -2.5, orders6: 1.875, worth6: 6.875, orders12: 1.984375, worth12: 9.609375, longRunOrders: 2, longRunWorth: 10, paybackOrder: 3, paybackMonths: 3.942505 },
  },
  {
    name: "A customer who never pays back",
    inputs: { profitPerOrder: 25, cac: 40, daysBetween: 60, comeBack: 30 },
    // Long run: 1 / 0.7 = 1.428571 orders, 25 x 1.428571 = 35.71, under the 40 it cost. 12 months: (1 - 0.3^7) / 0.7 = 1.428259; 35.7065 - 40 = -4.2935.
    expect: { orders12: 1.428259, worth12: -4.293525, longRunOrders: 1.428571, longRunWorth: -4.285714, paybackOrder: null, paybackMonths: null },
    says: "never pays back",
  },
  {
    name: "Everyone comes back",
    inputs: { profitPerOrder: 25, cac: 40, daysBetween: 30, comeBack: 100 },
    // 3 months: 91.3125 / 30 = 3 reorders, 4 orders, 100 - 40 = 60. 12 months: 12 reorders, 13 orders, 325 - 40 = 285.
    // Pays back on order 2 (50 covers 40), after 30 / 30.4375 = 0.9856 months. No long-run limit.
    expect: { reorders3: 3, orders3: 4, worth3: 60, reorders12: 12, orders12: 13, worth12: 285, longRunOrders: null, longRunWorth: null, paybackOrder: 2, paybackMonths: 0.985626 },
  },
  {
    name: "Nobody comes back",
    inputs: { profitPerOrder: 25, cac: 40, daysBetween: 60, comeBack: 0 },
    // One order only: 25 - 40 = -15 at every horizon.
    expect: { orders3: 1, worth3: -15, orders12: 1, worth12: -15, longRunOrders: 1, longRunWorth: -15, paybackOrder: null },
    says: "never pays back",
  },
  {
    name: "The first order pays for itself",
    inputs: { profitPerOrder: 25, cac: 20, daysBetween: 60, comeBack: 40 },
    // 25 covers 20 on the first order: 0 reorders, 0 months.
    expect: { paybackReorders: 0, paybackOrder: 1, paybackMonths: 0, worth3: 15 },
    says: "The first order pays back",
  },
  {
    name: "A loss on every order",
    inputs: { profitPerOrder: -5, cac: 40, daysBetween: 60, comeBack: 40 },
    // -5 x 1.4 - 40 = -47 at 3 months. It can never pay back.
    expect: { worth3: -47, paybackOrder: null, paybackMonths: null },
    says: "Each order loses money before ads",
  },
  {
    name: "Orders more than a year apart",
    inputs: { profitPerOrder: 25, cac: 40, daysBetween: 400, comeBack: 40 },
    // 365.25 / 400 = 0 reorders in a year: 1 order, 25 - 40 = -15. Pays back on order 4, after 3 x 400 / 30.4375 = 39.4251 months.
    expect: { reorders12: 0, orders12: 1, worth12: -15, paybackOrder: 4, paybackMonths: 39.425051 },
  },
];
