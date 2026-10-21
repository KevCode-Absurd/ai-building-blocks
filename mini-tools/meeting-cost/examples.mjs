// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.

export default [
  {
    name: "A weekly hour for six people",
    inputs: { attendees: 6, pay: 60000, oncost: 25, workHours: 1800, minutes: 60, refocus: 0, runs: 48, cut: 50 },
    // One hour: 60,000 x 1.25 / 1,800 = 41.6667. People-hours: 6 x 60 / 60 = 6. Each time: 6 x 41.6667 = 250.
    // Minute: 6 x 41.6667 / 60 = 4.1667. Year: 250 x 48 = 12,000; hours 6 x 48 = 288. Cut half: 6,000 and 144 hours.
    expect: { hourly: 41.666667, peopleHours: 6, costPerMinute: 4.166667, costPerRun: 250, hoursYear: 288, costYear: 12000, savedYear: 6000, savedHours: 144 },
    says: "This meeting costs $12,000.00 a year",
  },
  {
    name: "Time lost getting back into work",
    inputs: { attendees: 4, pay: 72000, oncost: 0, workHours: 1800, minutes: 30, refocus: 15, runs: 100, cut: 50 },
    // One hour: 72,000 / 1,800 = 40. People-hours: 4 x (30 + 15) / 60 = 3. Each time: 3 x 40 = 120.
    // Year: 120 x 100 = 12,000; hours 3 x 100 = 300. Minute: 4 x 40 / 60 = 2.6667. Cut half: 6,000 and 150 hours.
    expect: { hourly: 40, peopleHours: 3, costPerMinute: 2.666667, costPerRun: 120, hoursYear: 300, costYear: 12000, savedYear: 6000, savedHours: 150 },
  },
  {
    name: "Cut all of it",
    inputs: { attendees: 10, pay: 90000, oncost: 30, workHours: 2000, minutes: 90, refocus: 0, runs: 12, cut: 100 },
    // One hour: 90,000 x 1.3 / 2,000 = 58.5. People-hours: 10 x 90 / 60 = 15. Each time: 15 x 58.5 = 877.5.
    // Year: 877.5 x 12 = 10,530; hours 15 x 12 = 180. Cut 100%: saves all of both.
    expect: { hourly: 58.5, peopleHours: 15, costPerRun: 877.5, hoursYear: 180, costYear: 10530, savedYear: 10530, savedHours: 180 },
  },
  {
    name: "Nothing cut yet",
    inputs: { attendees: 2, pay: 52000, oncost: 20, workHours: 1800, minutes: 30, refocus: 0, runs: 50, cut: 0 },
    // One hour: 52,000 x 1.2 / 1,800 = 34.6667. People-hours: 2 x 30 / 60 = 1. Each time: 34.6667.
    // Year: 34.6667 x 50 = 1,733.33; hours 50. Cut 0: saves nothing.
    expect: { hourly: 34.666667, peopleHours: 1, costPerRun: 34.666667, hoursYear: 50, costYear: 1733.333333, savedYear: 0, savedHours: 0 },
    says: "You have not cut any of it yet",
  },
  {
    name: "A meeting that never runs",
    inputs: { attendees: 5, pay: 60000, oncost: 25, workHours: 1800, minutes: 60, refocus: 0, runs: 0, cut: 50 },
    // 0 runs a year: every yearly figure is 0. One hour is still 41.6667; each time is 5 x 41.6667 = 208.3333.
    expect: { costPerRun: 208.333333, hoursYear: 0, costYear: 0, savedYear: 0, savedHours: 0 },
    says: "Nothing to count yet",
  },
];
