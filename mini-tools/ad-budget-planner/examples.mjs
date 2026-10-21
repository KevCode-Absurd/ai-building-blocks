// Worked examples, each checked by hand. Practice numbers, not any real business's.
// A day count uses 30.4375 days to a month.

export default [
  {
    name: "A 20,000 sales goal from clicks",
    inputs: { salesGoal: 20000, profitGoal: 0, orderValue: 50, convRate: 2.5, cpc: 0.5, roas: 0, margin: 50 },
    // Return: 50 x 2.5% = 1.25 per click, / 0.50 a click = 2.5. Break-even: 100 / 50 = 2.
    // Sales 20,000 / 50 = 400 orders. Budget 20,000 / 2.5 = 8,000; / 30.4375 = 262.83 a day.
    // Clicks 400 / 0.025 = 16,000. Cost per order 8,000 / 400 = 20. Profit 20,000 x 0.5 - 8,000 = 2,000.
    expect: { roasUsed: 2.5, breakEven: 2, salesNeeded: 20000, ordersNeeded: 400, budget: 8000, dailyBudget: 262.833676, clicksNeeded: 16000, costPerOrder: 20, profitAfterAds: 2000 },
    says: "spend $8,000.00 on ads",
  },
  {
    name: "A profit goal, with a return typed in",
    inputs: { salesGoal: 99999, profitGoal: 3000, orderValue: 80, convRate: 2, cpc: 0, roas: 4, margin: 50 },
    // The profit goal wins. Sales = 3,000 / (0.5 - 1/4) = 3,000 / 0.25 = 12,000. Orders 12,000 / 80 = 150.
    // Budget 12,000 / 4 = 3,000. Clicks 150 / 0.02 = 7,500. Cost per order 20. Profit 6,000 - 3,000 = 3,000.
    expect: { roasUsed: 4, breakEven: 2, salesNeeded: 12000, ordersNeeded: 150, budget: 3000, dailyBudget: 98.562628, clicksNeeded: 7500, costPerOrder: 20, profitAfterAds: 3000 },
    says: "spend $3,000.00 on ads",
  },
  {
    name: "A profit goal that can't be met",
    inputs: { salesGoal: 0, profitGoal: 2000, orderValue: 80, convRate: 2, cpc: 0, roas: 3, margin: 30 },
    // Break-even return 100 / 30 = 3.333. The return of 3 is below it, so each sale keeps less than the ads cost: no profit at any size.
    expect: { roasUsed: 3, breakEven: 3.333333, salesNeeded: null, budget: null, clicksNeeded: null, profitAfterAds: null },
    says: "can't be met",
  },
  {
    name: "No goal typed yet",
    inputs: { salesGoal: 0, profitGoal: 0, orderValue: 50, convRate: 2.5, cpc: 0.5, roas: 0, margin: 50 },
    // Return is still 2.5. Sales 0 means 0 orders, 0 budget, 0 clicks, 0 cost per order and 0 profit.
    expect: { roasUsed: 2.5, salesNeeded: 0, ordersNeeded: 0, budget: 0, dailyBudget: 0, clicksNeeded: 0, costPerOrder: 0, profitAfterAds: 0 },
    says: "Type a sales goal or a profit goal",
  },
  {
    name: "No cost per click and no return",
    inputs: { salesGoal: 10000, profitGoal: 0, orderValue: 50, convRate: 2, cpc: 0, roas: 0, margin: 40 },
    // Without a click cost or a return there is no way to price the traffic, so there is no budget.
    // Orders 10,000 / 50 = 200; clicks 200 / 0.02 = 10,000. Break-even 100 / 40 = 2.5.
    expect: { roasUsed: null, breakEven: 2.5, salesNeeded: 10000, ordersNeeded: 200, budget: null, clicksNeeded: 10000, profitAfterAds: null },
    says: "Type a cost per click",
  },
  {
    name: "Every click buys and the return is under 1",
    inputs: { salesGoal: 1000, profitGoal: 0, orderValue: 100, convRate: 100, cpc: 0, roas: 0.5, margin: 100 },
    // Break-even 100 / 100 = 1. Orders 1,000 / 100 = 10; clicks 10 / 1.00 = 10. Budget 1,000 / 0.5 = 2,000.
    // Cost per order 200. Profit 1,000 x 1 - 2,000 = -1,000: a loss.
    expect: { roasUsed: 0.5, breakEven: 1, ordersNeeded: 10, budget: 2000, clicksNeeded: 10, costPerOrder: 200, profitAfterAds: -1000 },
    says: "That is a loss",
  },
];
