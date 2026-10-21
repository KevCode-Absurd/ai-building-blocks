// Worked examples, each checked by hand. Every way the tool is built (site, download, spreadsheet, AI code)
// must give these answers, or it doesn't ship. Practice numbers, not any real business's.
// null means "no answer" (no profit to hold on to).

export default [
  {
    name: "10% rise, no fees",
    inputs: { price: 50, cost: 20, fee: 0, rise: 10, sales: 200, expectedLoss: 10 },
    // New price 50 x 1.1 = 55. Profit per sale: 50 - 20 = 30 now; 55 - 20 = 35 after.
    // Most sales you can lose: 1 - 30/35 = 1/7 = 14.2857%. Sales to hold: 200 x 30/35 = 171.4286. Money in: 171.4286 x 55 = 9,428.57.
    // Profit a month today 200 x 30 = 6,000. At a 10% loss: 200 x 0.9 x 35 = 6,300, so +300.
    expect: { newPrice: 55, profitNow: 30, profitNew: 35, maxLoss: 14.285714, salesToHold: 171.428571, revenueAtHold: 9428.571429, profitMonthNow: 6000, profitAfterGuess: 6300, profitChange: 300 },
    says: "even if you lose 14.29% of your sales",
  },
  {
    name: "5% rise with 3% fees, and a guess that is too hopeful",
    inputs: { price: 100, cost: 40, fee: 3, rise: 5, sales: 100, expectedLoss: 10 },
    // Today: 100 - 40 - 3 = 57. New price 105, fees 3.15: 105 - 40 - 3.15 = 61.85.
    // Most sales you can lose: 1 - 57/61.85 = 4.85/61.85 = 7.8416%. Sales to hold: 100 x 57/61.85 = 92.1584.
    // Money in: 92.1584 x 105 = 9,676.64. Profit today 5,700. At a 10% loss: 100 x 0.9 x 61.85 = 5,566.50, so -133.50.
    expect: { newPrice: 105, profitNow: 57, profitNew: 61.85, maxLoss: 7.841552, salesToHold: 92.158447, revenueAtHold: 9676.637025, profitMonthNow: 5700, profitAfterGuess: 5566.5, profitChange: -133.5 },
    says: "you make $133.50 less a month",
  },
  {
    name: "No rise changes nothing",
    inputs: { price: 50, cost: 20, fee: 0, rise: 0, sales: 200, expectedLoss: 0 },
    // 30 both ways. 1 - 30/30 = 0, so no sales can be lost. Sales to hold 200. 200 x 50 = 10,000. Change 0.
    expect: { newPrice: 50, profitNow: 30, profitNew: 30, maxLoss: 0, salesToHold: 200, revenueAtHold: 10000, profitChange: 0 },
    says: "With no price rise, your profit stays the same",
  },
  {
    name: "A loss on every sale today",
    inputs: { price: 20, cost: 25, fee: 0, rise: 50, sales: 100, expectedLoss: 20 },
    // Today: 20 - 25 = -5. New price 30: 30 - 25 = 5. Profit today -500. At a 20% loss: 100 x 0.8 x 5 = 400, so +900.
    // With a loss today there is no profit to hold on to, so no most-sales-lost number.
    expect: { newPrice: 30, profitNow: -5, profitNew: 5, maxLoss: null, salesToHold: null, revenueAtHold: null, profitMonthNow: -500, profitAfterGuess: 400, profitChange: 900 },
    says: "You lose $5.00 on every sale today",
  },
  {
    name: "A 100% rise on a thin margin: you can lose most of your sales",
    inputs: { price: 40, cost: 30, fee: 0, rise: 100, sales: 50, expectedLoss: 50 },
    // Today 40 - 30 = 10. New price 80: 80 - 30 = 50. 1 - 10/50 = 80%. Sales to hold 50 x 10/50 = 10. Money in 10 x 80 = 800.
    // Profit today 500. At a 50% loss: 50 x 0.5 x 50 = 1,250, so +750.
    expect: { newPrice: 80, profitNow: 10, profitNew: 50, maxLoss: 80, salesToHold: 10, revenueAtHold: 800, profitMonthNow: 500, profitAfterGuess: 1250, profitChange: 750 },
    says: "even if you lose 80% of your sales",
  },
  {
    name: "A guess that lands exactly on the break-even point",
    inputs: { price: 40, cost: 30, fee: 0, rise: 100, sales: 50, expectedLoss: 80 },
    // Same prices as above. At an 80% loss: 50 x 0.2 x 50 = 500, the same as today's 500, so 0.
    expect: { maxLoss: 80, profitMonthNow: 500, profitAfterGuess: 500, profitChange: 0 },
    says: "you make the same profit as today",
  },
];
