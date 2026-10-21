// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.

export default [
  {
    name: "Nobody joins and nobody leaves",
    inputs: { subs: 400, newSubs: 0, price: 30, churn: 0, months: 12, goal: 20000 },
    // 400 x 30 = 12,000. Nothing changes: still 400 subscribers and 12,000. No level-off, no average stay, and the goal can't be reached.
    expect: { mrrNow: 12000, subsLater: 400, mrrLater: 12000, mrrChange: 0, levelSubs: null, levelMrr: null, lifeMonths: null, monthsToGoal: null },
    says: "Nobody joins and nobody leaves",
  },
  {
    name: "A steady shop-style subscription",
    inputs: { subs: 500, newSubs: 50, price: 20, churn: 5, months: 12, goal: 15000 },
    // Today 500 x 20 = 10,000. Level-off: 50 / 0.05 = 1,000 subscribers = 20,000. Stay rate 0.95; 0.95^12 = 0.5403600877.
    // After 12 months: 1,000 - (1,000 - 500) x 0.5403600877 = 729.8199562 subscribers x 20 = 14,596.40. A subscriber stays 100 / 5 = 20 months.
    // Goal 15,000 is 750 subscribers: month 13 gives 1,000 - 500 x 0.95^13 = 743.3 (short); month 14 gives 756.2 (past). So month 14.
    expect: { mrrNow: 10000, subsLater: 729.819956, mrrLater: 14596.399123, mrrChange: 4596.399123, levelSubs: 1000, levelMrr: 20000, lifeMonths: 20, monthsToGoal: 14 },
    says: "grows from $10,000.00 to $14,596.40",
  },
  {
    name: "Nobody leaves",
    inputs: { subs: 200, newSubs: 20, price: 15, churn: 0, months: 12, goal: 9000 },
    // 200 + 20 x 12 = 440 subscribers x 15 = 6,600; today 3,000. Goal 9,000 is 600 subscribers: (600 - 200) / 20 = 20 months.
    expect: { mrrNow: 3000, subsLater: 440, mrrLater: 6600, mrrChange: 3600, levelSubs: null, levelMrr: null, lifeMonths: null, monthsToGoal: 20 },
    says: "keeps growing by 20 subscribers a month",
  },
  {
    name: "Everyone leaves each month (100%)",
    inputs: { subs: 300, newSubs: 40, price: 25, churn: 100, months: 12, goal: 5000 },
    // Today 300 x 25 = 7,500. Each month all leave and 40 join, so it is 40 subscribers = 1,000, and level-off is 40 / 1 = 40. A subscriber stays 1 month.
    // The goal 5,000 is under today's 7,500, so it is already past.
    expect: { mrrNow: 7500, subsLater: 40, mrrLater: 1000, mrrChange: -6500, levelSubs: 40, levelMrr: 1000, lifeMonths: 1, monthsToGoal: 0 },
    says: "falls from $7,500.00 to $1,000.00",
  },
  {
    name: "No new sign-ups, so it shrinks",
    inputs: { subs: 100, newSubs: 0, price: 50, churn: 10, months: 12, goal: 10000 },
    // Today 100 x 50 = 5,000. 0.9^12 = 0.2824295365, so 28.24295365 subscribers x 50 = 1,412.15. Level-off is 0 / 0.1 = 0.
    // The goal 10,000 is 200 subscribers, which is above the level-off, so it can't be reached.
    expect: { mrrNow: 5000, subsLater: 28.242954, mrrLater: 1412.147682, mrrChange: -3587.852318, levelSubs: 0, levelMrr: 0, lifeMonths: 10, monthsToGoal: null },
    says: "levels off near $0.00 a month",
  },
  {
    name: "Starting small and growing toward a goal",
    inputs: { subs: 100, newSubs: 60, price: 20, churn: 20, months: 12, goal: 4000 },
    // Today 100 x 20 = 2,000. Level-off: 60 / 0.2 = 300 subscribers = 6,000. 0.8^12 = 0.068719477, so 300 - 200 x 0.068719477 = 286.2561047 x 20 = 5,725.12.
    // Goal 4,000 = 200 subscribers. By hand: month 1 = 140, 2 = 172, 3 = 197.6, 4 = 218.08. Month 4 is the first past 200. A subscriber stays 5 months.
    expect: { mrrNow: 2000, subsLater: 286.256105, mrrLater: 5725.122093, mrrChange: 3725.122093, levelSubs: 300, levelMrr: 6000, lifeMonths: 5, monthsToGoal: 4 },
    says: "You pass $4,000.00 a month in month 4",
  },
];
