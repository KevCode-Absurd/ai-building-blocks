// Hire or freelance. The single source of truth for this mini tool.
//
// Maths: employee cost a year = salary x (1 + on-costs). Freelancer cost a year = hourly rate x hours of work needed.
// Hiring pays when the hours needed pass break-even hours = employee cost / freelancer rate.
// Share of a person's year = hours needed / hours one person works a year.
// Standard make-or-buy cost formulas, written in our own words.

export default {
  slug: "hire-or-freelance",
  name: "Employee or freelancer costs",
  /** The plain name, used where the tool talks about itself. */
  short: "Employee or freelancer costs",
  headline: "Employee or freelancer costs",
  summary: "Enter salary, employment costs, workload and freelance rate. Compare yearly costs and the hours at which an employee costs less.",
  question: "Which costs less for this workload: an employee or a freelancer?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "salary", label: "Salary for the role, a year", unit: "money", example: 60000, min: 0, max: 1e9, step: 1000, help: "The yearly pay you would offer, before tax.", where: "Job ads for similar roles, or a pay survey for your area.", tools: ["Job boards", "A pay survey", "Your accountant"] },
    { id: "oncost", label: "Extra costs on top of salary", unit: "percent", example: 25, min: 0, max: 200, step: 5, help: "Employer taxes, benefits, equipment, software and paid time off, as a share of salary. These differ by country, so check with an accountant.", where: "Your accountant, or the employer costs for your country.", tools: ["Your accountant", "Your payroll provider"] },
    { id: "hours", label: "Hours of this work a year", unit: "hours", example: 1200, min: 0, max: 100000, step: 50, help: "How many hours of this work you need in a year.", where: "Time you or your team spend on it now, or what a freelancer billed last year.", tools: ["Toggl or Harvest", "Freelancer invoices", "Your calendar"] },
    { id: "rate", label: "Freelancer's hourly rate", unit: "money", example: 50, min: 0, max: 1e6, step: 5, help: "What a freelancer charges for an hour of this work.", where: "Quotes from two or three freelancers, or past invoices.", tools: ["Freelancer quotes", "Upwork or Fiverr rates", "Past invoices"] },
    { id: "capacity", label: "Hours one employee works a year", unit: "hours", example: 1800, min: 1, max: 5000, step: 50, help: "Hours one employee can work after leave. Use the work pattern and your own calendar.", where: "The contract hours of the role, less time off.", tools: ["Your contract template"] },
  ],
  outputs: [
    { id: "employeeCost", label: "Cost of an employee a year", unit: "money", formula: "salary * (1 + oncost / 100)", sum: "{salary} × (100% + {oncost}) = {=}", means: "You pay this whether the work fills the year or not." },
    { id: "freelanceCost", label: "Cost of a freelancer a year", unit: "money", formula: "rate * hours", sum: "{rate} × {hours} = {=}", means: "You pay only for the hours you use." },
    { id: "gap", label: "Freelancer cost minus employee cost", unit: "money", formula: "freelanceCost - employeeCost", sum: "{freelanceCost} − {employeeCost} = {=}", means: [
      { if: "gap > 0", text: "Positive: hiring costs {=} less a year." },
      { if: "gap < 0", text: "Negative: the freelancer costs {=:abs} less a year." },
      { text: "Both cost the same." },
    ] },
    { id: "breakEven", label: "Hours a year where hiring becomes cheaper", unit: "hours", formula: "IF(rate > 0, employeeCost / rate, NA())", none: "No number of hours", sum: "{employeeCost} ÷ {rate} = {=}", means: [
      { if: "NOT(HAS(breakEven))", text: "With a rate of zero a freelancer is always cheaper." },
      { text: "Above this many hours, the employee costs less. Below it, the freelancer does." },
    ] },
    { id: "fill", label: "Share of one person's year this work fills", unit: "percent", formula: "hours / capacity * 100", sum: "{hours} ÷ {capacity} = {=}", means: "The rest of an employee's year would need other work to be worth paying for." },
    { id: "employeeHourWork", label: "Employee cost per hour of this work", unit: "money", formula: "IF(hours > 0, employeeCost / hours, 0)", sum: "{employeeCost} ÷ {hours} = {=}", means: [
      { if: "hours = 0", text: "No hours of work, so there is no hourly cost to work out." },
      { text: "What each hour costs if only this work fills the employee's year. Compare it to the freelancer's rate." },
    ] },
    { id: "employeeHourFull", label: "Employee cost per working hour", unit: "money", formula: "employeeCost / capacity", sum: "{employeeCost} ÷ {capacity} = {=}", means: "What an hour costs if the employee is busy for the whole year." },
  ],
  answer: [
    [
      { if: "hours = 0", text: "With no hours of work there is nothing to compare. Type the hours of work you need a year." },
      { if: "rate = 0", text: "At a freelancer rate of zero, a freelancer is always cheaper. Type the rate you were quoted." },
      { if: "AND(gap < 0, breakEven > capacity)", text: "A freelancer costs {freelanceCost} a year and an employee {employeeCost}, so the freelancer costs {gap:abs} less. Hiring only pays above {breakEven}, more than one person works in a year." },
      { if: "gap = 0", text: "A freelancer and an employee both cost {employeeCost} a year. Hiring pays above {breakEven}." },
      { if: "gap > 0", text: "An employee costs {employeeCost} a year and a freelancer {freelanceCost}, so hiring costs {gap} less. Hiring pays above {breakEven}, and this work is {fill} of one person's year." },
      { text: "A freelancer costs {freelanceCost} a year and an employee {employeeCost}, so the freelancer costs {gap:abs} less. Hiring pays above {breakEven}, and this work is {fill} of one person's year." },
    ],
  ],
  next: [
    { slug: "job-spec-writer", why: "If you hire, write the job so the right people apply." },
    { slug: "key-hire-gap-finder", why: "Find the one hire that unblocks growth, and how to pay them." },
  ],
  sources: [
    { what: "Cost of an employee", how: "Salary plus the employer's extra costs, as a share of salary. A standard fully loaded cost sum." },
    { what: "Hours where hiring becomes cheaper", how: "Employee cost ÷ freelancer rate. The standard make-or-buy break-even sum." },
  ],
  notes: [
    "Staff costs and the rules on hiring differ by country. Check the costs with your accountant. Ask a lawyer if you need to check whether a role can be freelance.",
    "This leaves out the cost of finding and training a hire, and your time managing either choice.",
    "It says nothing about quality, how fast someone can start, or whether the work will last. Those can matter more than the cost.",
  ],
};
