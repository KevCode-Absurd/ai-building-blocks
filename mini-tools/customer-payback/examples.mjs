// Worked examples, each checked by hand. Practice numbers, not any real business's.

export default [
  {
    name: "A 45 customer who pays back in a few months",
    inputs: { cac: 45, orderValue: 60, margin: 40, ordersMonth: 0.25, target: 6 },
    // Profit per order 60 x 40% = 24. Gap after the first order 45 - 24 = 21. 45 / 24 = 1.875, so 2 orders.
    // Months (1.875 - 1) / 0.25 = 3.5. After 3 months 24 x (1 + 0.75) - 45 = -3. After 6: 24 x 2.5 - 45 = 15. After 12: 24 x 4 - 45 = 51.
    // Most to spend for a 6 month payback: 24 x 2.5 = 60.
    expect: { profitPerOrder: 24, gap: 21, ordersToPay: 2, paybackMonths: 3.5, worth3: -3, worth6: 15, worth12: 51, maxCac: 60 },
    says: "after about 3.5 months",
  },
  {
    name: "The first order pays for the customer",
    inputs: { cac: 20, orderValue: 60, margin: 40, ordersMonth: 0.25, target: 6 },
    // Profit per order 24 covers the 20 cost to win. Gap 0, 1 order, 0 months. After 3 months 24 x 1.75 - 20 = 22. Most to spend 60.
    expect: { profitPerOrder: 24, gap: 0, ordersToPay: 1, paybackMonths: 0, worth3: 22, maxCac: 60 },
    says: "The first order pays back",
  },
  {
    name: "Nobody orders again",
    inputs: { cac: 45, orderValue: 60, margin: 40, ordersMonth: 0, target: 6 },
    // One order only: 24 - 45 = -21 at every point. Never pays back. Most to spend stays 24.
    expect: { gap: 21, ordersToPay: null, paybackMonths: null, worth3: -21, worth6: -21, worth12: -21, maxCac: 24 },
    says: "never pays back",
  },
  {
    name: "Orders that keep nothing",
    inputs: { cac: 45, orderValue: 60, margin: 0, ordersMonth: 0.25, target: 6 },
    // Profit per order 0. Gap 45. A customer leaves 0 x 1.75 - 45 = -45 at 3 months. Most to spend 0.
    expect: { profitPerOrder: 0, gap: 45, ordersToPay: null, paybackMonths: null, worth3: -45, maxCac: 0 },
    says: "Each order keeps nothing",
  },
  {
    name: "Every sale is profit and a customer orders monthly",
    inputs: { cac: 125, orderValue: 50, margin: 100, ordersMonth: 1, target: 3 },
    // Profit per order 50. Gap 75. 125 / 50 = 2.5, so 3 orders. Months (2.5 - 1) / 1 = 1.5.
    // After 3 months 50 x 4 - 125 = 75; 6: 50 x 7 - 125 = 225; 12: 50 x 13 - 125 = 525. Most to spend for 3 months 50 x 4 = 200.
    expect: { profitPerOrder: 50, gap: 75, ordersToPay: 3, paybackMonths: 1.5, worth3: 75, worth6: 225, worth12: 525, maxCac: 200 },
    says: "inside your 3 months limit",
  },
  {
    name: "A slow customer who takes over two years",
    inputs: { cac: 90, orderValue: 60, margin: 40, ordersMonth: 0.1, target: 12 },
    // Profit per order 24. 90 / 24 = 3.75, so 4 orders. Months (3.75 - 1) / 0.1 = 27.5.
    // After 3 months 24 x 1.3 - 90 = -58.8; 6: 24 x 1.6 - 90 = -51.6; 12: 24 x 2.2 - 90 = -37.2. Most to spend for 12 months 24 x 2.2 = 52.8.
    expect: { gap: 66, ordersToPay: 4, paybackMonths: 27.5, worth3: -58.8, worth6: -51.6, worth12: -37.2, maxCac: 52.8 },
    says: "longer than your 12 months limit",
  },
];
