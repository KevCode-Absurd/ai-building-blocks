// Worked examples, each checked by hand. Practice numbers, not any real business's.

export default [
  {
    name: "A store with 1,000 orders and 10% returns",
    inputs: { orders: 1000, aov: 50, cost: 20, returnRate: 10, refundShare: 80, returnShip: 5, handlingMins: 6, hourly: 20, resell: 70 },
    // Returns: 1,000 x 10% = 100. Shipping 100 x 5 = 500. Handling 100 x 6 / 60 x 20 = 200. Written off 100 x 30% x 20 = 600.
    // Cost 500 + 200 + 600 = 1,300. Per return 5 + 2 + 6 = 13. Per order 10% x 13 = 1.30. Share of sales 1,300 / 50,000 = 2.6%.
    // Refunds 100 x 80% x 50 = 4,000. One more point: 1,000 / 100 x 13 = 130.
    expect: { returns: 100, shippingCost: 500, handlingCost: 200, writeOff: 600, returnsCost: 1300, costPerReturn: 13, costPerOrder: 1.3, costShare: 2.6, refundValue: 4000, pointCost: 130 },
    says: "Returns cost you $1,300.00 a month",
  },
  {
    name: "No returns",
    inputs: { orders: 1000, aov: 50, cost: 20, returnRate: 0, refundShare: 80, returnShip: 5, handlingMins: 6, hourly: 20, resell: 70 },
    // No returns, so every monthly cost is 0. A return would still cost 5 + 2 + 6 = 13, and one point is 1,000 / 100 x 13 = 130.
    expect: { returns: 0, returnsCost: 0, costPerReturn: 13, costPerOrder: 0, costShare: 0, refundValue: 0, pointCost: 130 },
    says: "With no returns, nothing is lost",
  },
  {
    name: "Every order comes back and nothing can be resold",
    inputs: { orders: 200, aov: 40, cost: 15, returnRate: 100, refundShare: 100, returnShip: 4, handlingMins: 10, hourly: 18, resell: 0 },
    // Returns 200. Shipping 800. Handling 200 x 10 / 60 x 18 = 600. Written off 200 x 15 = 3,000. Cost 4,400.
    // Per return 4 + 3 + 15 = 22; per order 22. Share 4,400 / 8,000 = 55%. Refunds 200 x 40 = 8,000. One point 200 / 100 x 22 = 44.
    expect: { returns: 200, shippingCost: 800, handlingCost: 600, writeOff: 3000, returnsCost: 4400, costPerReturn: 22, costPerOrder: 22, costShare: 55, refundValue: 8000, pointCost: 44 },
    says: "That is $22.00 for each return",
  },
  {
    name: "No orders",
    inputs: { orders: 0, aov: 0, cost: 20, returnRate: 10, refundShare: 80, returnShip: 5, handlingMins: 6, hourly: 20, resell: 70 },
    // No orders, so no returns and no cost. A single return would still cost 13.
    expect: { returns: 0, returnsCost: 0, costPerReturn: 13, costShare: 0, refundValue: 0, pointCost: 0 },
    says: "With no returns, nothing is lost",
  },
  {
    name: "Everything is resold and exchanged",
    inputs: { orders: 500, aov: 80, cost: 30, returnRate: 20, refundShare: 0, returnShip: 7, handlingMins: 15, hourly: 16, resell: 100 },
    // Returns 500 x 20% = 100. Shipping 700. Handling 100 x 15 / 60 x 16 = 400. Written off 0. Cost 1,100.
    // Per return 7 + 4 = 11; per order 20% x 11 = 2.20. Share 1,100 / 40,000 = 2.75%. No refunds. One point 500 / 100 x 11 = 55.
    expect: { returns: 100, writeOff: 0, returnsCost: 1100, costPerReturn: 11, costPerOrder: 2.2, costShare: 2.75, refundValue: 0, pointCost: 55 },
    says: "You also hand back $0.00 in refunds",
  },
];
