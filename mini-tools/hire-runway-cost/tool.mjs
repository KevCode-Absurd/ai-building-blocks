// Hire and runway. The single source of truth for this mini tool.
//
// Maths: net a month now = money in - money out. Runway now = cash / monthly loss (none if you are not losing money).
// The hire costs salary x (1 + on-costs) / 12 a month and adds what they bring in. Net after = net now - hire cost + what
// they add. Cash after the one-off hiring cost = cash - one-off. Runway after = cash after / new monthly loss.
// Months lost = runway now - runway after. To leave the runway unchanged, the hire must add their cost plus the share of
// your monthly loss that the one-off cost took from your cash: hire cost + loss x one-off / cash. If you are not losing
// money today, they must add at least hire cost - today's net to keep it that way.
// Standard cash runway sums with no growth, written in our own words. The cash runway tool adds growth.

export default {
  slug: "hire-runway-cost",
  name: "See how many months of runway a hire costs you",
  /** The plain name, used where the tool talks about itself. */
  short: "Hire and runway",
  headline: "See how many months of runway a hire costs you, and what they must bring in to keep it",
  summary: "Type your cash, what comes in and goes out each month, and the hire's salary and extra costs. You get your runway before and after, the months lost and what the hire must add to keep it.",
  question: "If I make this hire, how many months of cash do I lose, and how much must they bring in each month to keep my runway where it is?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "Your cash today" },
    { id: "hire", label: "The hire" },
  ],
  inputs: [
    { id: "cash", label: "Cash in the bank", unit: "money", example: 120000, min: 0, max: 1e10, step: 1000, help: "The money you could spend today, across all your business accounts.", where: "Your bank balance today, added up across every business account.", tools: ["Your banking app", "Xero or QuickBooks"] },
    { id: "income", label: "Money in each month", unit: "money", example: 10000, min: 0, max: 1e10, step: 500, help: "Cash that lands in your account in a normal month, after refunds and fees.", where: "Your bank deposits for the last 3 months, added up and divided by 3.", tools: ["Your banking app", "Stripe or PayPal", "Xero or QuickBooks"] },
    { id: "costs", label: "Money out each month", unit: "money", example: 15000, min: 0, max: 1e10, step: 500, help: "Everything you pay in a normal month, before this hire. Spread yearly bills over 12 months.", where: "Your bank withdrawals for the last 3 months, added up and divided by 3.", tools: ["Your banking app", "Xero or QuickBooks"] },
    { id: "salary", label: "Salary for the role, a year", unit: "money", example: 60000, min: 0, max: 1e9, step: 1000, section: "hire", help: "The yearly pay you will offer, before tax.", where: "Job ads for similar roles, or a pay survey for your area.", tools: ["Job boards", "A pay survey"] },
    { id: "oncost", label: "Extra costs on top of salary", unit: "percent", example: 25, min: 0, max: 200, step: 5, section: "hire", help: "Employer taxes, benefits, equipment and software, as a share of salary. These differ by country.", where: "Your accountant, or your payroll costs divided by pay.", tools: ["Your accountant", "Your payroll provider"] },
    { id: "oneOff", label: "One-off cost to find and set them up", unit: "money", example: 3000, min: 0, max: 1e9, step: 500, section: "hire", help: "Recruiter or job ad fees, a laptop, training. Use 0 if there are none.", where: "Your quotes and the invoices from your last hire.", tools: ["Your accounts software", "Recruiter quotes"] },
    { id: "addRevenue", label: "Cash the hire brings in each month", unit: "money", example: 2000, min: 0, max: 1e9, step: 500, section: "hire", help: "Extra cash in, or costs saved, each month because of them. Use 0 if you are not counting on any yet.", where: "Your plan for the role, kept cautious. The new hire break-even tool prices it.", tools: ["The new hire break-even tool", "Your sales plan"] },
  ],
  outputs: [
    { id: "netNow", label: "What you keep or lose each month now", unit: "money", formula: "income - costs", sum: "{income} − {costs} = {=}", means: [{ if: "netNow < 0", text: "A loss: you spend {=:abs} more than you bring in each month." }, { if: "netNow = 0", text: "You break even each month." }, { text: "You bring in more than you spend." }] },
    { id: "runwayNow", label: "Months your cash lasts today", unit: "months", formula: "IF(netNow >= 0, NA(), cash / (0 - netNow))", none: "It does not run out", sum: "{cash} ÷ {netNow:abs} = {=}", means: [{ if: "NOT(HAS(runwayNow))", text: "You bring in at least as much as you spend, so your cash does not run out." }, { text: "Cash divided by your monthly loss, with nothing changing." }] },
    { id: "hireCost", label: "What the hire costs a month", unit: "money", formula: "salary * (1 + oncost / 100) / 12", sum: "{salary} × (100% + {oncost}) ÷ 12 = {=}", means: "Pay plus the employer's extra costs, each month." },
    { id: "netAfter", label: "What you keep or lose each month with the hire", unit: "money", formula: "netNow - hireCost + addRevenue", sum: "{netNow} − {hireCost} + {addRevenue} = {=}", means: [{ if: "netAfter < 0", text: "A loss of {=:abs} a month once the hire is paid." }, { text: "You still bring in at least as much as you spend." }] },
    { id: "cashAfter", label: "Cash after the one-off hiring cost", unit: "money", formula: "MAX(0, cash - oneOff)", sum: "{cash} − {oneOff}, never below 0 = {=}", means: "What is left to run on once they are hired." },
    { id: "runwayAfter", label: "Months your cash lasts with the hire", unit: "months", formula: "IF(netAfter >= 0, NA(), cashAfter / (0 - netAfter))", none: "It does not run out", sum: "{cashAfter} ÷ {netAfter:abs} = {=}", means: [{ if: "NOT(HAS(runwayAfter))", text: "With what the hire brings in, you are not losing money." }, { text: "Counted from the day they start." }] },
    { id: "monthsLost", label: "Months of runway the hire costs you", unit: "months", formula: "IF(HAS(runwayAfter), IF(HAS(runwayNow), runwayNow - runwayAfter, NA()), 0)", none: "Your cash now has an end date", sum: "{runwayNow} − {runwayAfter} = {=}", means: [
      { if: "NOT(HAS(monthsLost))", text: "Today your cash does not run out. With the hire, it does." },
      { if: "monthsLost < 0", text: "Below zero: the hire adds {=:abs} of runway, because they bring in more than they cost." },
      { if: "monthsLost = 0", text: "No change to your runway." },
      { text: "What the hire takes off the end of your runway." },
    ] },
    { id: "keepAdd", label: "What the hire must bring in a month to keep your runway", unit: "money", formula: "IF(cash > 0, IF(netNow < 0, hireCost + (0 - netNow) * oneOff / cash, MAX(0, hireCost - netNow)), NA())", none: "No cash to protect", sum: "{hireCost} + {netNow:abs} × {oneOff} ÷ {cash} = {=}", means: [
      { if: "NOT(HAS(keepAdd))", text: "With no cash, there is no runway to keep." },
      { if: "netNow >= 0", text: "Enough to keep you from losing money each month." },
      { text: "Their cost, plus a little more to make up for the one-off cost that left your bank." },
    ] },
  ],
  answer: [
    [
      { if: "cash <= 0", text: "You have no cash, so there is no runway to lose. Type what is in the bank." },
      { if: "AND(NOT(HAS(runwayNow)), NOT(HAS(runwayAfter)))", text: "You bring in more than you spend, before and after the hire, so your cash does not run out either way. The hire takes your monthly net from {netNow} to {netAfter}." },
      { if: "NOT(HAS(runwayNow))", text: "Today your cash does not run out. With the hire you lose {netAfter:abs} a month, so it lasts about {runwayAfter}. The hire must bring in {keepAdd} a month to stop that." },
      { if: "NOT(HAS(runwayAfter))", text: "Today your cash lasts about {runwayNow}. With what this hire brings in you no longer lose money each month, so it stops running out." },
      { if: "monthsLost < 0", text: "Today your cash lasts about {runwayNow}. With the hire it lasts about {runwayAfter}: they add {monthsLost:abs} of runway, because they bring in more than they cost." },
      { text: "Today your cash lasts about {runwayNow}. With the hire it lasts about {runwayAfter}, so the hire costs you {monthsLost} of runway. To keep your runway where it is, the hire must bring in {keepAdd} a month." },
    ],
  ],
  next: [
    { slug: "key-hire-gap-finder", why: "Check this is the one hire that unblocks growth before you spend the runway." },
    { if: "monthsLost > 6", slug: "lean-year-cash-rules-writer", why: "Set cash rules and who to ask early, before the hire eats your buffer." },
    { slug: "forecast-your-startup-runway-and-prepare-a-finance-pack", why: "Go further: a multi-year model with hires, growth and ranges." },
  ],
  sources: [
    { what: "Months your cash lasts", how: "Cash ÷ monthly loss, with nothing growing. The standard cash runway sum." },
    { what: "What the hire must bring in", how: "Their monthly cost, plus the monthly loss × the share of your cash the one-off cost took. Keeps cash ÷ loss where it was." },
  ],
  notes: [
    "Nothing grows here: money in and out stay flat except for the hire. For growth, use the cash runway tool.",
    "The hire's cost starts on day one and what they bring in does too. Most hires take months to add anything, so keep that number cautious.",
    "Employment costs differ by country, so check the extra costs with an accountant.",
  ],
};
