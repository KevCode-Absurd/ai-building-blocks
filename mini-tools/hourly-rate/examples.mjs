// Worked examples, each checked by hand. Practice numbers, not anyone's real figures.

export default [
  {
    name: "A freelancer taking home 50,000",
    inputs: { takeHome: 50000, savings: 6000, businessCosts: 8000, taxRate: 25, weeks: 46, hoursWeek: 40, billable: 60 },
    // (50,000 + 6,000) / 0.75 = 74,666.67; + 8,000 = 82,666.67. Hours: 46 x 40 x 60% = 1,104.
    // 82,666.67 / 1,104 = 74.879 an hour; x 40 / 5 = 599.03 a day; 82,666.67 / 12 = 6,888.89 a month.
    expect: { profitNeeded: 74666.666667, revenueNeeded: 82666.666667, billableHours: 1104, hourlyRate: 74.879227, dayRate: 599.033816, monthlyRevenue: 6888.888889 },
    says: "Charge at least $74.88 an hour",
  },
  {
    name: "No tax",
    inputs: { takeHome: 50000, savings: 6000, businessCosts: 8000, taxRate: 0, weeks: 46, hoursWeek: 40, billable: 60 },
    // 56,000 + 8,000 = 64,000; 64,000 / 1,104 = 57.971.
    expect: { profitNeeded: 56000, revenueNeeded: 64000, hourlyRate: 57.971014 },
  },
  {
    name: "Every hour billed",
    inputs: { takeHome: 40000, savings: 0, businessCosts: 0, taxRate: 20, weeks: 50, hoursWeek: 40, billable: 100 },
    // 40,000 / 0.8 = 50,000. 50 x 40 = 2,000 hours. 25 an hour, 200 a day.
    expect: { profitNeeded: 50000, revenueNeeded: 50000, billableHours: 2000, hourlyRate: 25, dayRate: 200 },
  },
  {
    name: "Nothing to cover",
    inputs: { takeHome: 0, savings: 0, businessCosts: 0, taxRate: 25, weeks: 46, hoursWeek: 40, billable: 60 },
    expect: { revenueNeeded: 0, hourlyRate: 0, dayRate: 0 },
    says: "any rate meets your goal",
  },
  {
    name: "Few billable hours push the rate up",
    inputs: { takeHome: 30000, savings: 0, businessCosts: 6000, taxRate: 0, weeks: 40, hoursWeek: 20, billable: 25 },
    // 36,000 / (40 x 20 x 25% = 200 hours) = 180 an hour; x 20 / 5 = 720 a day.
    expect: { billableHours: 200, hourlyRate: 180, dayRate: 720, monthlyRevenue: 3000 },
  },
];
