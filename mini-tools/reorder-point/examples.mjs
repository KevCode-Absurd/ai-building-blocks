// Worked examples, each checked by hand. Practice numbers, not any real figures.
// z values: 90% = 1.2815516, 95% = 1.6448536, 99% = 2.3263479, 50% = 0.

export default [
  {
    name: "A steady seller with a 30-day wait",
    inputs: { dailySales: 20, swing: 6, leadDays: 30, serviceLevel: 95, coverDays: 60, onHand: 900 },
    // Wait demand: 20 x 30 = 600. Safety: 1.6448536 x 6 x sqrt(30) (5.4772256) = 54.06, rounded up to 55.
    // Reorder at 600 + 55 = 655. Order 20 x 60 = 1,200. After landing 55 + 1,200 = 1,255.
    // Orders a year: 20 x 365 / 1,200 = 6.0833. Days to reorder: (900 - 655) / 20 = 12.25.
    expect: { leadDemand: 600, safetyStock: 55, reorderPoint: 655, orderQty: 1200, stockAfterArrival: 1255, ordersPerYear: 6.083333, daysToReorder: 12.25 },
    says: "Reorder when stock falls to 655",
  },
  {
    name: "Already below the reorder point",
    inputs: { dailySales: 10, swing: 0, leadDays: 14, serviceLevel: 95, coverDays: 30, onHand: 100 },
    // No swing, so no spare stock. 10 x 14 = 140 to reorder. Order 10 x 30 = 300. Stock 100 is under 140, so 0 days.
    expect: { leadDemand: 140, safetyStock: 0, reorderPoint: 140, orderQty: 300, daysToReorder: 0 },
    says: "Order now",
  },
  {
    name: "Accepting a stock-out half the time",
    inputs: { dailySales: 5, swing: 4, leadDays: 16, serviceLevel: 50, coverDays: 40, onHand: 300 },
    // 50% gives z = 0, so no spare stock. 5 x 16 = 80. Order 200. Days: (300 - 80) / 5 = 44.
    expect: { zScore: 0, safetyStock: 0, reorderPoint: 80, orderQty: 200, daysToReorder: 44 },
  },
  {
    name: "No sales yet",
    inputs: { dailySales: 0, swing: 0, leadDays: 20, serviceLevel: 95, coverDays: 30, onHand: 50 },
    // Everything is 0 and there is no date to reorder.
    expect: { leadDemand: 0, safetyStock: 0, reorderPoint: 0, orderQty: 0, ordersPerYear: 0, daysToReorder: null },
    says: "nothing to reorder",
  },
  {
    name: "A 99% promise with a short wait",
    inputs: { dailySales: 40, swing: 15, leadDays: 9, serviceLevel: 99, coverDays: 14, onHand: 500 },
    // Wait: 40 x 9 = 360. Safety: 2.3263479 x 15 x 3 = 104.69, rounded up to 105. Reorder at 465. Order 560.
    // After landing 105 + 560 = 665. Days: (500 - 465) / 40 = 0.875.
    expect: { leadDemand: 360, safetyStock: 105, reorderPoint: 465, orderQty: 560, stockAfterArrival: 665, daysToReorder: 0.875 },
  },
  {
    name: "Small numbers round up",
    inputs: { dailySales: 2.5, swing: 1.2, leadDays: 21, serviceLevel: 90, coverDays: 45, onHand: 200 },
    // Wait: 2.5 x 21 = 52.5, up to 53. Safety: 1.2815516 x 1.2 x sqrt(21) (4.5825757) = 7.047, up to 8.
    // Reorder at 61. Order 2.5 x 45 = 112.5, up to 113. Days: (200 - 61) / 2.5 = 55.6.
    expect: { leadDemand: 53, safetyStock: 8, reorderPoint: 61, orderQty: 113, daysToReorder: 55.6 },
  },
];
