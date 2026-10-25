// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (nothing could pay the deal back).

export default [
  {
    name: "A post that does not pay",
    inputs: { fee: 500, giftCost: 30, views: 40000, clickRate: 1, convRate: 2, orderValue: 50, margin: 45 },
    // Cost 500 + 30 = 530. Clicks 40,000 x 1% = 400. Orders 400 x 2% = 8. Sales 8 x 50 = 400.
    // Profit per order 50 x 45% = 22.50. 8 x 22.50 = 180; 180 - 530 = -350. Sales per 1: 400 / 530 = 0.754717.
    // Per 1,000 views: 530 / 40,000 x 1,000 = 13.25. Orders to break even: 530 / 22.50 = 23.5556.
    // Views: 530 / (0.01 x 0.02 x 22.50) = 530 / 0.0045 = 117,777.78, rounded up to 117,778.
    expect: { totalCost: 530, clicks: 400, orders: 8, revenue: 400, profitPerOrder: 22.5, net: -350, roas: 0.754717, cpm: 13.25, breakEvenOrders: 23.555556, breakEvenViews: 117778 },
    says: "you lose $350.00 on this deal",
  },
  {
    name: "A post that pays",
    inputs: { fee: 200, giftCost: 20, views: 100000, clickRate: 1.5, convRate: 3, orderValue: 80, margin: 50 },
    // Cost 220. Clicks 100,000 x 1.5% = 1,500. Orders 1,500 x 3% = 45. Sales 45 x 80 = 3,600.
    // Profit per order 40. 45 x 40 = 1,800; 1,800 - 220 = 1,580. Sales per 1: 3,600 / 220 = 16.363636.
    // Per 1,000 views: 220 / 100,000 x 1,000 = 2.20. Orders: 220 / 40 = 5.5. Views: 220 / (0.015 x 0.03 x 40) = 220 / 0.018 = 12,222.22, up to 12,223.
    expect: { totalCost: 220, clicks: 1500, orders: 45, revenue: 3600, profitPerOrder: 40, net: 1580, roas: 16.363636, cpm: 2.2, breakEvenOrders: 5.5, breakEvenViews: 12223 },
    says: "you make $1,580.00 profit on this deal",
  },
  {
    name: "A gift-only deal",
    inputs: { fee: 0, giftCost: 25, views: 5000, clickRate: 2, convRate: 4, orderValue: 50, margin: 40 },
    // Cost 25. Clicks 5,000 x 2% = 100. Orders 100 x 4% = 4. Sales 200. Profit per order 20. 4 x 20 = 80; 80 - 25 = 55.
    // Sales per 1: 200 / 25 = 8. Per 1,000 views: 25 / 5,000 x 1,000 = 5. Orders: 25 / 20 = 1.25. Views: 25 / (0.02 x 0.04 x 20) = 25 / 0.016 = 1,562.5, up to 1,563.
    expect: { totalCost: 25, clicks: 100, orders: 4, revenue: 200, profitPerOrder: 20, net: 55, roas: 8, cpm: 5, breakEvenOrders: 1.25, breakEvenViews: 1563 },
    says: "It breaks even at 1,563 views",
  },
  {
    name: "The deal costs nothing",
    inputs: { fee: 0, giftCost: 0, views: 1000, clickRate: 1, convRate: 1, orderValue: 100, margin: 50 },
    // Cost 0. Clicks 10. Orders 0.1. Sales 10. Profit per order 50. 0.1 x 50 = 5; 5 - 0 = 5.
    // Sales per 1 guarded to 0 and per 1,000 views 0. Orders 0 / 50 = 0. Views: 0 / (0.0001 x 50) = 0.
    expect: { totalCost: 0, clicks: 10, orders: 0.1, revenue: 10, profitPerOrder: 50, net: 5, roas: 0, cpm: 0, breakEvenOrders: 0, breakEvenViews: 0 },
    says: "there is no fee or gift cost. Estimated profit is $5.00",
  },
  {
    name: "Nobody clicks",
    inputs: { fee: 300, giftCost: 0, views: 10000, clickRate: 0, convRate: 3, orderValue: 50, margin: 40 },
    // Cost 300. Clicks 0; orders 0; sales 0. Profit per order 20. 0 - 300 = -300. Sales per 1: 0 / 300 = 0.
    // Per 1,000 views: 300 / 10,000 x 1,000 = 30. Orders: 300 / 20 = 15. Views: no answer, because the click rate is zero.
    expect: { totalCost: 300, clicks: 0, orders: 0, revenue: 0, profitPerOrder: 20, net: -300, roas: 0, cpm: 30, breakEvenOrders: 15, breakEvenViews: null },
    says: "No number of views pays this deal back",
  },
  {
    name: "An order that leaves no profit",
    inputs: { fee: 100, giftCost: 10, views: 50000, clickRate: 2, convRate: 5, orderValue: 40, margin: 0 },
    // Cost 110. Clicks 1,000. Orders 50. Sales 2,000. Profit per order 0. 50 x 0 = 0; 0 - 110 = -110.
    // Sales per 1: 2,000 / 110 = 18.181818. Per 1,000 views: 110 / 50,000 x 1,000 = 2.20. Orders and views: no answer.
    expect: { totalCost: 110, clicks: 1000, orders: 50, revenue: 2000, profitPerOrder: 0, net: -110, roas: 18.181818, cpm: 2.2, breakEvenOrders: null, breakEvenViews: null },
    says: "You lose $110.00",
  },
];
