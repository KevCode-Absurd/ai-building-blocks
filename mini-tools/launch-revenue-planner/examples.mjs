// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.
// null means "no answer" (no sign-ups, or sign-ups worth nothing).

export default [
  {
    name: "A 500 sign-up webinar that makes a small profit",
    inputs: { signups: 500, showRate: 40, buyRate: 5, price: 497, refundRate: 10, deliverCost: 30, adSpend: 2500, fixedCost: 500 },
    // 500 x 40% = 200 see it; x 5% = 10 buyers; x 497 = 4,970; refunds 497; after refunds 4,473. Delivery 10 x 30 = 300.
    // Profit 4,473 - 300 - 2,500 - 500 = 1,173. Ads per sign-up 2,500 / 500 = 5. A sign-up is worth 0.4 x 0.05 x (447.3 - 30) = 8.346.
    // Break even: 3,000 / 8.346 = 359.45, so 360 sign-ups.
    expect: { attendees: 200, buyers: 10, grossSales: 4970, refunds: 497, netSales: 4473, deliveryCost: 300, profit: 1173, costPerSignup: 5, valuePerSignup: 8.346, breakEvenSignups: 360 },
    says: "leaving $1,173.00 after ads and costs",
  },
  {
    name: "Nobody buys",
    inputs: { signups: 500, showRate: 40, buyRate: 0, price: 497, refundRate: 10, deliverCost: 30, adSpend: 2500, fixedCost: 500 },
    // 0 buyers, 0 sales. Profit -3,000. A sign-up is worth 0, so no number of sign-ups breaks even.
    expect: { buyers: 0, grossSales: 0, profit: -3000, costPerSignup: 5, valuePerSignup: 0, breakEvenSignups: null },
    says: "a sign-up is worth nothing",
  },
  {
    name: "Too few sign-ups to cover the ads",
    inputs: { signups: 200, showRate: 40, buyRate: 5, price: 497, refundRate: 10, deliverCost: 30, adSpend: 2500, fixedCost: 500 },
    // 80 see it; 4 buyers; 1,988 sales; 198.80 refunds; 1,789.20 after. Delivery 120. Profit 1,789.20 - 120 - 3,000 = -1,330.80.
    // Ads per sign-up 12.50, more than the 8.346 a sign-up is worth. Break even still 360.
    expect: { attendees: 80, buyers: 4, grossSales: 1988, refunds: 198.8, netSales: 1789.2, deliveryCost: 120, profit: -1330.8, costPerSignup: 12.5, valuePerSignup: 8.346, breakEvenSignups: 360 },
    says: "the launch loses $1,330.80",
  },
  {
    name: "A bigger, cheaper launch",
    inputs: { signups: 2000, showRate: 50, buyRate: 8, price: 199, refundRate: 5, deliverCost: 10, adSpend: 6000, fixedCost: 1000 },
    // 1,000 see it; 80 buyers; 15,920 sales; 796 refunds; 15,124 after. Delivery 800. Profit 15,124 - 800 - 6,000 - 1,000 = 7,324.
    // Ads per sign-up 3. A sign-up is worth 0.5 x 0.08 x (189.05 - 10) = 7.162. Break even 7,000 / 7.162 = 977.4, so 978.
    expect: { attendees: 1000, buyers: 80, grossSales: 15920, refunds: 796, netSales: 15124, deliveryCost: 800, profit: 7324, costPerSignup: 3, valuePerSignup: 7.162, breakEvenSignups: 978 },
    says: "You break even at 978 sign-ups",
  },
  {
    name: "Everyone refunds",
    inputs: { signups: 500, showRate: 40, buyRate: 5, price: 497, refundRate: 100, deliverCost: 30, adSpend: 2500, fixedCost: 500 },
    // 10 buyers, 4,970 sales, all refunded: 0 after refunds. Delivery 300 is still spent. Profit -3,300.
    // A sign-up is worth 0.02 x (0 - 30) = -0.6, so no break-even.
    expect: { netSales: 0, deliveryCost: 300, profit: -3300, valuePerSignup: -0.6, breakEvenSignups: null },
    says: "a sign-up is worth nothing",
  },
  {
    name: "No sign-ups yet",
    inputs: { signups: 0, showRate: 40, buyRate: 5, price: 497, refundRate: 10, deliverCost: 30, adSpend: 2500, fixedCost: 500 },
    // Nothing to plan from. The costs are still a loss of 3,000, and there is no ad cost per sign-up.
    expect: { attendees: 0, buyers: 0, profit: -3000, costPerSignup: null, valuePerSignup: 8.346, breakEvenSignups: 360 },
    says: "no sign-ups",
  },
];
