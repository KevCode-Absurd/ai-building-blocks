// New hire break-even. The single source of truth for this mini tool.
//
// Maths: cost of the hire a month = salary x (1 + on-costs) / 12. What they add a month at full pace = the extra sales they
// bring x your margin (for a hire who saves costs, use a margin of 100 and the savings as the sales). Net a month = added
// - cost. Sales they must bring to cover their cost = cost / margin. During the ramp months they add half their full pace.
// What is still to recover when the ramp ends = one-off cost + ramp months x (cost - half the added amount). Payback months =
// ramp months + that amount / net a month; if the ramp already paid it back, one-off cost / (half the added amount - cost).
// First-year result = added x (12 - ramp / 2) - 12 x cost - one-off cost.
// Standard fully loaded cost and payback sums, written in our own words.

export default {
  slug: "new-hire-break-even",
  name: "Know what a new hire must bring in to pay for themselves",
  /** The plain name, used where the tool talks about itself. */
  short: "Hire break-even",
  headline: "Know what a new hire must bring in to pay for themselves, and when",
  summary: "Type the salary, extra costs, ramp time and what the hire adds a month. You get the sales they must bring in, the month they pay back and their first-year result.",
  question: "How much must a new hire bring in each month to cover what they cost, and how many months until they have paid back the hire?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "salary", label: "Salary for the role, a year", unit: "money", example: 60000, min: 0, max: 1e9, step: 1000, help: "The yearly pay you will offer, before tax.", where: "Job ads for similar roles, or a pay survey for your area.", tools: ["Job boards", "A pay survey", "Your accountant"] },
    { id: "oncost", label: "Extra costs on top of salary", unit: "percent", example: 25, min: 0, max: 200, step: 5, help: "Employer taxes, benefits, equipment and software, as a share of salary. These differ by country, so check with an accountant.", where: "Your accountant, or your payroll costs divided by pay.", tools: ["Your accountant", "Your payroll provider"] },
    { id: "oneOff", label: "One-off cost to find and set them up", unit: "money", example: 3000, min: 0, max: 1e9, step: 500, help: "Recruiter or job ad fees, a laptop, training. Use 0 if there are none.", where: "Your quotes and the invoices from your last hire.", tools: ["Your accounts software", "Recruiter quotes"] },
    { id: "rampMonths", label: "Months before they work at full pace", unit: "count", example: 3, min: 0, max: 12, step: 1, integer: true, help: "We count half their full pace during these months. Use 0 if they are productive from day one.", where: "Ask people in the same role how long it took them. Many sales roles take 3 to 6 months.", tools: ["Your team", "Your last hire's first months"] },
    { id: "margin", label: "Share of the sales they bring that you keep", unit: "percent", example: 40, min: 0, max: 100, step: 1, help: "What is left of each sale after goods, delivery and fees. For a hire who saves costs instead of selling, use 100.", where: "Your profit and loss report, or the order margin tool.", tools: ["Xero or QuickBooks", "The order margin tool"] },
    { id: "revenueMonth", label: "Extra sales they bring in a month, at full pace", unit: "money", example: 20000, min: 0, max: 1e9, step: 1000, help: "Sales the business would not make without them. For a hire who saves costs, type the monthly saving here.", where: "What a person in the role sells today, or your plan for the role.", tools: ["Your CRM", "Your sales reports", "A spreadsheet"] },
  ],
  outputs: [
    { id: "costMonth", label: "What the hire costs a month", unit: "money", formula: "salary * (1 + oncost / 100) / 12", sum: "{salary} × (100% + {oncost}) ÷ 12 = {=}", means: "Pay plus the employer's extra costs, each month, whether they bring anything in or not." },
    { id: "breakEvenRevenue", label: "Sales they must bring in a month to cover their cost", unit: "money", formula: "IF(margin > 0, costMonth / (margin / 100), NA())", none: "No amount of sales", sum: "{costMonth} ÷ {margin} = {=}", means: [
      { if: "NOT(HAS(breakEvenRevenue))", text: "At a 0% margin the sales keep nothing, so no amount covers the hire." },
      { text: "Below this, the hire costs more than they add. It is the floor, not a target." },
    ] },
    { id: "gainMonth", label: "What they add a month, at full pace", unit: "money", formula: "revenueMonth * margin / 100", sum: "{revenueMonth} × {margin} = {=}", means: "The profit on the sales they bring, or the costs they save." },
    { id: "netMonth", label: "Net a month, at full pace", unit: "money", formula: "gainMonth - costMonth", sum: "{gainMonth} − {costMonth} = {=}", means: [
      { if: "netMonth < 0", text: "A loss: the hire costs {=:abs} a month more than they add." },
      { if: "netMonth = 0", text: "They cover their cost exactly, with nothing left over." },
      { text: "What the hire leaves you each month once they are up to speed." },
    ] },
    { id: "holeRamp", label: "Still to recover when the ramp ends", unit: "money", formula: "oneOff + rampMonths * (costMonth - gainMonth / 2)", sum: "{oneOff} + {rampMonths} × ({costMonth} − {gainMonth} ÷ 2) = {=}", means: [
      { if: "holeRamp < 0", text: "Below zero: the hire paid back the one-off cost before the ramp ended." },
      { if: "holeRamp = 0", text: "Nothing to recover." },
      { text: "The one-off cost, plus the months on half pace, that later months must earn back." },
    ] },
    { id: "paybackMonths", label: "Months until the hire has paid back", unit: "months", formula: "IF(netMonth <= 0, NA(), IF(holeRamp <= 0, IF(gainMonth / 2 - costMonth > 0, oneOff / (gainMonth / 2 - costMonth), 0), rampMonths + holeRamp / netMonth))", none: "Never, at these numbers", sum: "{rampMonths} ramp months + {holeRamp} ÷ {netMonth} a month = {=}", means: [
      { if: "NOT(HAS(paybackMonths))", text: "The hire never adds more than they cost, so there is no payback." },
      { if: "paybackMonths = 0", text: "They pay for themselves from the first month." },
      { text: "Counted from their first day." },
    ] },
    { id: "firstYearNet", label: "First-year result", unit: "money", formula: "gainMonth * (12 - rampMonths / 2) - costMonth * 12 - oneOff", sum: "{gainMonth} × (12 − {rampMonths} ÷ 2) − 12 × {costMonth} − {oneOff} = {=}", means: [
      { if: "firstYearNet < 0", text: "A loss in year one of {=:abs}, once the ramp and the one-off cost are counted." },
      { text: "What the hire leaves after their first 12 months, with the ramp and the one-off cost counted." },
    ] },
    { id: "yearNet", label: "A full year at full pace", unit: "money", formula: "netMonth * 12", sum: "{netMonth} × 12 = {=}", means: "What a normal year looks like once they are up to speed." },
  ],
  answer: [
    [
      { if: "margin <= 0", text: "At a 0% margin the sales they bring keep nothing, so this hire costs {costMonth} a month and never pays back. Type the share of each sale you keep." },
      { if: "netMonth < 0", text: "At full pace this hire adds {gainMonth} a month and costs {costMonth}, so they lose you {netMonth:abs} a month. They would need to bring in {breakEvenRevenue} a month in sales to cover their cost." },
      { if: "AND(netMonth = 0, holeRamp <= 0)", text: "At full pace this hire adds {gainMonth} a month, exactly what they cost. They cover themselves, with nothing left over." },
      { if: "netMonth = 0", text: "At full pace this hire adds {gainMonth} a month, exactly what they cost. The {holeRamp} spent to hire them and on the ramp is never paid back." },
      { if: "paybackMonths = 0", text: "This hire adds {gainMonth} a month against {costMonth} of cost, so {netMonth} a month, and pays for themselves from the first month. First year: {firstYearNet}." },
      { text: "At full pace this hire adds {gainMonth} a month against {costMonth} of cost, so {netMonth} a month. Counting the {oneOff} to hire them and {rampMonths} months of ramp, they pay back after about {paybackMonths} and leave {firstYearNet} in their first year." },
    ],
  ],
  next: [
    { slug: "key-hire-gap-finder", why: "Check this is the hire that unblocks growth, and how to pay them." },
    { if: "netMonth > 0", slug: "plan-a-year-of-hiring-and-what-it-will-cost", why: "Put the hire in a year's people budget, role by role." },
    { slug: "hire-the-person-who-unblocks-growth-and-hand-over-the-work", why: "Write the results you expect, so the hire and you agree what full pace means." },
  ],
  sources: [
    { what: "Cost of the hire", how: "Salary plus the employer's extra costs, spread over 12 months. A standard fully loaded cost sum." },
    { what: "Payback", how: "The one-off cost plus the ramp months at half pace, divided by what the hire adds each month at full pace. A standard payback sum." },
  ],
  notes: [
    "The ramp counts half pace for every ramp month. Real ramps start slower and speed up, so treat the payback month as a rough one.",
    "Employment costs differ by country, so check the extra costs with an accountant.",
    "This prices one hire. It says nothing about the time you spend managing them, or what you could do with the same money instead.",
  ],
};
