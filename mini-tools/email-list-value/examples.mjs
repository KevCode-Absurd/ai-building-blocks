// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.

export default [
  {
    name: "A list of 10,000",
    inputs: { listSize: 10000, sends: 8, clickRate: 1.5, convRate: 3, orderValue: 60, margin: 40, stayMonths: 12, toolCost: 300 },
    // 10,000 x 8 = 80,000 emails. x 1.5% = 1,200 clicks. x 3% = 36 orders. x 60 = 2,160 sales.
    // x 40% = 864 profit. 864 - 300 = 564. 2,160 / 80,000 x 1,000 = 27. 864 / 10,000 = 0.0864 a subscriber. x 12 = 1.0368.
    expect: { emailsSent: 80000, ordersMonth: 36, revenueMonth: 2160, profitMonth: 864, profitAfterTool: 564, revenuePer1000: 27, perSubMonth: 0.0864, perSubStay: 1.0368 },
    says: "Your list makes $864.00 profit a month",
  },
  {
    name: "The tool costs more than the list makes",
    inputs: { listSize: 10000, sends: 8, clickRate: 1.5, convRate: 3, orderValue: 60, margin: 40, stayMonths: 12, toolCost: 1000 },
    // Profit 864 as above. 864 - 1,000 = -136.
    expect: { profitMonth: 864, profitAfterTool: -136, perSubStay: 1.0368 },
    says: "-$136.00 once your email tool is paid for",
  },
  {
    name: "Nobody on the list",
    inputs: { listSize: 0, sends: 8, clickRate: 1.5, convRate: 3, orderValue: 60, margin: 40, stayMonths: 12, toolCost: 0 },
    // 0 x 8 = 0 emails; every sum is 0. Guards return 0.
    expect: { emailsSent: 0, ordersMonth: 0, revenueMonth: 0, profitMonth: 0, profitAfterTool: 0, revenuePer1000: 0, perSubMonth: 0, perSubStay: 0 },
    says: "nobody on your list",
  },
  {
    name: "Nobody clicks",
    inputs: { listSize: 5000, sends: 4, clickRate: 0, convRate: 3, orderValue: 60, margin: 40, stayMonths: 12, toolCost: 50 },
    // 5,000 x 4 = 20,000 emails. 0% click = 0 orders, 0 sales, 0 profit. 0 - 50 = -50.
    expect: { emailsSent: 20000, ordersMonth: 0, revenueMonth: 0, profitMonth: 0, profitAfterTool: -50, perSubStay: 0 },
    says: "no profit",
  },
  {
    name: "Everyone clicks, everyone orders, all of it is profit",
    inputs: { listSize: 100, sends: 1, clickRate: 100, convRate: 100, orderValue: 10, margin: 100, stayMonths: 3, toolCost: 0 },
    // 100 emails; 100 clicks; 100 orders; 1,000 sales; 1,000 profit. 1,000 / 100 x 1,000 = 10,000.
    // 1,000 / 100 = 10 a subscriber; x 3 = 30.
    expect: { emailsSent: 100, ordersMonth: 100, revenueMonth: 1000, profitMonth: 1000, profitAfterTool: 1000, revenuePer1000: 10000, perSubMonth: 10, perSubStay: 30 },
    says: "Pay up to $30.00",
  },
];
