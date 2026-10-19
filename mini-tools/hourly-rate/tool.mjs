// Hourly rate. The single source of truth for this mini tool.
//
// Maths: profit you need before tax = (take-home + savings) / (1 - tax rate). Money to bring in = that + business costs.
// Hours you can bill = weeks x hours a week x share you can bill. Hourly rate = money to bring in / hours you can bill.
// A standard cost-plus rate sum, in our own words.

export default {
  slug: "hourly-rate",
  name: "Know the least to charge per hour",
  /** The plain name, used where the tool talks about itself. */
  short: "Hourly rate",
  headline: "Know the least to charge per hour to meet your goals",
  summary: "Type what you want to take home, your costs and your working hours. You get the lowest hourly and day rate that covers them.",
  question: "What should I charge per hour to cover my costs, my working hours and a savings goal?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-19",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "takeHome", label: "What you want to take home a year, after tax", unit: "money", example: 50000, min: 0, max: 1e10, step: 1000, help: "The pay you want to live on.", where: "Your yearly living costs: your bank statements for the last 12 months, or a budget.", tools: ["Your banking app", "A budgeting app", "A spreadsheet"] },
    { id: "savings", label: "Savings goal a year", unit: "money", example: 6000, min: 0, max: 1e10, step: 500, help: "Pension, a rainy-day fund, time off between clients.", where: "Your own goal.", tools: ["A spreadsheet"] },
    { id: "businessCosts", label: "Business costs a year", unit: "money", example: 8000, min: 0, max: 1e10, step: 500, help: "Software, equipment, insurance, an accountant, a desk.", where: "Your business expenses for the last 12 months.", tools: ["Xero or QuickBooks", "Your business bank account"] },
    { id: "taxRate", label: "Tax on your profit", unit: "percent", example: 25, min: 0, max: 95, step: 1, help: "The share of your profit that goes to tax, on average. Ask your accountant for your own figure.", where: "Last year's tax return: tax paid divided by profit.", tools: ["Your tax return", "Your accountant"] },
    { id: "weeks", label: "Weeks you work a year", unit: "weeks", example: 46, min: 1, max: 52, step: 1, help: "52 weeks, less holidays, public holidays and sick days.", where: "Your calendar for last year.", tools: ["Your calendar"] },
    { id: "hoursWeek", label: "Hours you work a week", unit: "hours", example: 40, min: 1, max: 100, step: 1, help: "All your working hours, billed or not.", where: "Your calendar or time tracker.", tools: ["Toggl or Harvest", "Your calendar"] },
    { id: "billable", label: "Share of hours you can bill", unit: "percent", example: 60, min: 1, max: 100, step: 5, help: "The rest goes on admin, sales and finding clients.", where: "Your time tracker: billed hours divided by all hours, for the last 3 months.", tools: ["Toggl or Harvest", "Your invoices"] },
  ],
  outputs: [
    { id: "profitNeeded", label: "Profit you need before tax", unit: "money", formula: "(takeHome + savings) / (1 - taxRate / 100)", sum: "({takeHome} + {savings}) ÷ (100% − {taxRate}) = {=}", means: "Tax comes out of profit, so you need this much to keep your take-home and savings." },
    { id: "revenueNeeded", label: "Money you need to bring in a year", unit: "money", formula: "profitNeeded + businessCosts", sum: "{profitNeeded} + {businessCosts} costs = {=}", means: "Your sales target for the year." },
    { id: "billableHours", label: "Hours you can bill a year", unit: "hours", formula: "weeks * hoursWeek * billable / 100", sum: "{weeks} × {hoursWeek} × {billable} = {=}", means: "The hours your rate has to pay for everything." },
    { id: "hourlyRate", label: "Least to charge per hour", unit: "money", formula: "revenueNeeded / billableHours", sum: "{revenueNeeded} ÷ {billableHours} = {=}", means: "Charge less and you miss your goal. It says nothing about what clients will pay." },
    { id: "dayRate", label: "Day rate, for a full day of billed work", unit: "money", formula: "hourlyRate * hoursWeek / 5", sum: "{hourlyRate} × {hoursWeek} ÷ 5 days = {=}", means: "For a 5-day week." },
    { id: "monthlyRevenue", label: "Money to bring in each month", unit: "money", formula: "revenueNeeded / 12", sum: "{revenueNeeded} ÷ 12 = {=}", means: "Check it against what you invoice in a month." },
  ],
  answer: [
    [
      { if: "revenueNeeded = 0", text: "With nothing to cover, any rate meets your goal. Type what you want to take home." },
      { text: "Charge at least {hourlyRate} an hour, or {dayRate} a day. That covers {takeHome} take-home, {savings} savings, tax and {businessCosts} of costs over {billableHours} you can bill." },
    ],
  ],
  next: [{ slug: "selling-points-writer", why: "Explain what clients get for your rate, in reasons they care about." }],
  sources: [
    { what: "Hourly rate", how: "(Take-home + savings) ÷ (1 − tax rate) + business costs, divided by billable hours. A standard cost-plus rate sum." },
  ],
  notes: [
    "Tax is one average rate on your profit. Real tax has bands and allowances, so check with your accountant.",
    "This is the least that meets your goal. What the market pays is a separate question.",
  ],
};
