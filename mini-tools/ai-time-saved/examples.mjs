// Worked examples, each checked by hand. Practice numbers, not measured savings and not anyone's real figures.
// null means "no answer" (nothing saved, so no payback).

export default [
  {
    name: "A 45-minute task cut to 15, done 40 times a month",
    inputs: { minutesHand: 45, times: 40, hourlyValue: 50, minutesAI: 15, redoShare: 10, toolCost: 25, setupHours: 6 },
    // By hand 45 x 40 / 60 = 30 hours. With AI (15 x 40 + 10% x 40 x 45) / 60 = (600 + 180) / 60 = 13 hours. Saved 17 hours, 56.67%.
    // Worth 850; after the 25 tool 825. Setup 6 x 50 = 300; payback 300 / 825 = 0.3636 months. A year 9,900 - 300 = 9,600. Days back 17 x 12 / 8 = 25.5.
    expect: { hoursHand: 30, hoursAI: 13, hoursSaved: 17, shareSaved: 56.666667, moneySaved: 850, netMonth: 825, setupCost: 300, paybackMonths: 0.363636, yearNet: 9600, daysYear: 25.5 },
    says: "saves 17 hours a month",
  },
  {
    name: "The AI way takes longer",
    inputs: { minutesHand: 45, times: 40, hourlyValue: 50, minutesAI: 50, redoShare: 10, toolCost: 25, setupHours: 6 },
    // With AI (2,000 + 180) / 60 = 36.333 hours against 30 by hand: -6.333 hours, -21.11%. Worth -316.67; net -341.67. No payback. A year -4,100 - 300 = -4,400. Days -9.5.
    expect: { hoursAI: 36.333333, hoursSaved: -6.333333, shareSaved: -21.111111, moneySaved: -316.666667, netMonth: -341.666667, paybackMonths: null, yearNet: -4400, daysYear: -9.5 },
    says: "saves no time",
  },
  {
    name: "A task you never run",
    inputs: { minutesHand: 45, times: 0, hourlyValue: 50, minutesAI: 15, redoShare: 10, toolCost: 25, setupHours: 6 },
    // 0 hours either way, no share to show. Net -25 (the tool), no payback. A year -300 - 300 = -600.
    expect: { hoursHand: 0, hoursAI: 0, hoursSaved: 0, shareSaved: null, moneySaved: 0, netMonth: -25, paybackMonths: null, yearNet: -600, daysYear: 0 },
    says: "do not run this task yet",
  },
  {
    name: "A free tool with no setup and no redos",
    inputs: { minutesHand: 30, times: 100, hourlyValue: 40, minutesAI: 10, redoShare: 0, toolCost: 0, setupHours: 0 },
    // By hand 50 hours. With AI 1,000 / 60 = 16.667 hours. Saved 33.333 hours, 66.67%, worth 1,333.33. Net the same. Setup 0, payback 0. A year 16,000. Days 50.
    expect: { hoursHand: 50, hoursAI: 16.666667, hoursSaved: 33.333333, shareSaved: 66.666667, moneySaved: 1333.333333, netMonth: 1333.333333, setupCost: 0, paybackMonths: 0, yearNet: 16000, daysYear: 50 },
    says: "pays back the $0.00 of setup in 0.0 months",
  },
  {
    name: "Every run has to be redone",
    inputs: { minutesHand: 45, times: 40, hourlyValue: 50, minutesAI: 15, redoShare: 100, toolCost: 25, setupHours: 6 },
    // With AI (600 + 1,800) / 60 = 40 hours against 30: -10 hours. Worth -500; net -525. No payback. A year -6,300 - 300 = -6,600.
    expect: { hoursAI: 40, hoursSaved: -10, moneySaved: -500, netMonth: -525, paybackMonths: null, yearNet: -6600 },
    says: "saves no time",
  },
  {
    name: "A heavy setup that takes a few months to pay back",
    inputs: { minutesHand: 45, times: 40, hourlyValue: 50, minutesAI: 15, redoShare: 10, toolCost: 25, setupHours: 40 },
    // Same 825 net a month as the first example. Setup 40 x 50 = 2,000; payback 2,000 / 825 = 2.4242 months. A year 9,900 - 2,000 = 7,900.
    expect: { netMonth: 825, setupCost: 2000, paybackMonths: 2.424242, yearNet: 7900 },
    says: "in 2.4 months",
  },
];
