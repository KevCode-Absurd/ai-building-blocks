// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.

export default [
  {
    name: "Part-time work: the freelancer wins",
    inputs: { salary: 60000, oncost: 25, hours: 1200, rate: 50, capacity: 1800 },
    // Employee: 60,000 x 1.25 = 75,000. Freelancer: 50 x 1,200 = 60,000. Gap: 60,000 - 75,000 = -15,000.
    // Break-even: 75,000 / 50 = 1,500 hours. Fill: 1,200 / 1,800 = 66.6667%.
    // Employee per hour of work: 75,000 / 1,200 = 62.5. Per working hour: 75,000 / 1,800 = 41.6667.
    expect: { employeeCost: 75000, freelanceCost: 60000, gap: -15000, breakEven: 1500, fill: 66.666667, employeeHourWork: 62.5, employeeHourFull: 41.666667 },
    says: "the freelancer costs $15,000.00 less",
  },
  {
    name: "Near full-time work: hiring wins",
    inputs: { salary: 60000, oncost: 25, hours: 1700, rate: 50, capacity: 1800 },
    // Employee 75,000. Freelancer: 50 x 1,700 = 85,000. Gap: +10,000. Break-even 1,500 hours.
    // Fill: 1,700 / 1,800 = 94.4444%. Employee per hour of work: 75,000 / 1,700 = 44.1176.
    expect: { employeeCost: 75000, freelanceCost: 85000, gap: 10000, breakEven: 1500, fill: 94.444444, employeeHourWork: 44.117647 },
    says: "hiring costs $10,000.00 less",
  },
  {
    name: "Exactly at break-even",
    inputs: { salary: 60000, oncost: 25, hours: 1500, rate: 50, capacity: 1800 },
    // Employee 75,000. Freelancer 50 x 1,500 = 75,000. Gap 0. Fill: 1,500 / 1,800 = 83.3333%. Per hour of work: 50.
    expect: { employeeCost: 75000, freelanceCost: 75000, gap: 0, breakEven: 1500, fill: 83.333333, employeeHourWork: 50 },
    says: "both cost $75,000.00 a year",
  },
  {
    name: "No hours of work",
    inputs: { salary: 60000, oncost: 25, hours: 0, rate: 50, capacity: 1800 },
    // Freelancer: 50 x 0 = 0. Employee 75,000. Gap: -75,000. Break-even 1,500. Fill 0. No hours, so hourly cost 0.
    expect: { employeeCost: 75000, freelanceCost: 0, gap: -75000, breakEven: 1500, fill: 0, employeeHourWork: 0 },
    says: "nothing to compare",
  },
  {
    name: "Freelancer rate of zero",
    inputs: { salary: 60000, oncost: 25, hours: 1200, rate: 0, capacity: 1800 },
    // Freelancer: 0 x 1,200 = 0. Gap: 0 - 75,000 = -75,000. Break-even: no answer (rate is 0).
    expect: { employeeCost: 75000, freelanceCost: 0, gap: -75000, breakEven: null },
    says: "a freelancer is always cheaper",
  },
  {
    name: "A cheap freelancer beats a full year",
    inputs: { salary: 90000, oncost: 30, hours: 1800, rate: 40, capacity: 1800 },
    // Employee: 90,000 x 1.3 = 117,000. Freelancer: 40 x 1,800 = 72,000. Gap: -45,000.
    // Break-even: 117,000 / 40 = 2,925 hours, more than the 1,800 one person works. Fill: 100%. Per hour of work: 65.
    expect: { employeeCost: 117000, freelanceCost: 72000, gap: -45000, breakEven: 2925, fill: 100, employeeHourWork: 65, employeeHourFull: 65 },
    says: "more than one person works in a year",
  },
];
