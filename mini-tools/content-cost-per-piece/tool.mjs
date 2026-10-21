// Content cost per piece. The single source of truth for this mini tool.
//
// Maths: hours a month = pieces x hours per piece. Cost of that time = hours x what an hour of your time is worth.
// Total a month = time cost + freelancers + tools. Cost per piece = total / pieces. Cost per view = cost per piece /
// views per piece, and per 1,000 views x 1,000. Cost per result = cost per piece / results per piece.
// Standard unit cost sums, written in our own words.

export default {
  slug: "content-cost-per-piece",
  name: "Know what each post, video or article really costs you",
  /** The plain name, used where the tool talks about itself. */
  short: "Content cost",
  headline: "Know what each post, video or article really costs you, and what you pay for each view",
  summary: "Type how many pieces you make a month, the hours each takes, what your hour is worth, and what you pay freelancers and tools. You get the cost per piece, per 1,000 views and per result.",
  question: "What does each post, video or article cost me to make, once I count my time, tools and freelancers, and what do I pay for each view and each result?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "pieces", label: "Pieces you publish a month", unit: "count", example: 20, min: 0, max: 1e6, step: 1, integer: true, help: "Posts, videos, emails, articles: whatever you count as one piece.", where: "Your content calendar or your channel's post count for the last 30 days.", tools: ["Your content calendar", "Your social or blog dashboard"] },
    { id: "hoursPer", label: "Hours of your team's time per piece", unit: "hours", example: 2, min: 0, max: 1000, step: 0.5, help: "Planning, writing, filming, editing, posting and replying, for one piece. Count everyone in-house.", where: "Time a few pieces from start to finish, or your time tracker.", tools: ["Toggl or Harvest", "Your calendar"] },
    { id: "hourlyValue", label: "What an hour of that time is worth", unit: "money", example: 50, min: 0, max: 1e6, step: 5, help: "Pay plus extra costs per hour, or the rate you would bill a client for the same hour.", where: "Yearly pay with extra costs, divided by hours worked a year. The hourly rate tool works it out for a freelancer.", tools: ["Your payroll", "The hourly rate tool"] },
    { id: "freelance", label: "Paid to freelancers and agencies a month", unit: "money", example: 800, min: 0, max: 1e9, step: 50, help: "Writers, editors, designers, video editors. Use 0 if it is all in-house.", where: "Your invoices for the last 3 months, divided by 3.", tools: ["Your accounts software", "Freelancer invoices"] },
    { id: "tools", label: "Tools and software a month", unit: "money", example: 100, min: 0, max: 1e9, step: 10, help: "Design, scheduling, editing, stock images, AI tools. Spread yearly plans over 12 months.", where: "Your card statements or the billing pages of each tool.", tools: ["Your card statements", "Your accounts software"] },
    { id: "viewsPer", label: "Views an average piece gets", unit: "count", example: 1500, min: 0, max: 1e10, step: 100, help: "Views, reads or opens for one piece, over its life so far.", where: "Your channel's analytics: total views for last month's pieces, divided by the pieces.", tools: ["Your social dashboard", "Google Analytics", "YouTube Studio"] },
    { id: "resultsPer", label: "Results an average piece brings", unit: "number", example: 2, min: 0, max: 1e9, step: 0.5, help: "Leads, sign-ups, sales or replies you can trace to one piece. Use 0 if you do not track it yet.", where: "Your CRM or analytics, with links or codes that mark the piece.", tools: ["Your CRM", "Google Analytics", "Tracked links"] },
  ],
  outputs: [
    { id: "hoursMonth", label: "Hours spent on content a month", unit: "hours", formula: "pieces * hoursPer", sum: "{pieces} × {hoursPer} = {=}", means: "Divide by 8 for the working days it takes." },
    { id: "timeCost", label: "What that time is worth", unit: "money", formula: "hoursMonth * hourlyValue", sum: "{hoursMonth} × {hourlyValue} = {=}", means: "Time priced at your rate. It is not cash out of your account, but it is time you could have sold or spent elsewhere." },
    { id: "totalMonth", label: "What content costs a month", unit: "money", formula: "timeCost + freelance + tools", sum: "{timeCost} + {freelance} + {tools} = {=}", means: "Time, freelancers and tools, added up." },
    { id: "timeShare", label: "Share of the cost that is your time", unit: "percent", formula: "IF(totalMonth > 0, timeCost / totalMonth * 100, 0)", sum: "{timeCost} ÷ {totalMonth} = {=}", means: "When most of the cost is time, handing pieces to a freelancer or a tool can cost less than it looks." },
    { id: "perPiece", label: "Cost per piece", unit: "money", formula: "IF(pieces > 0, totalMonth / pieces, NA())", none: "No pieces yet", sum: "{totalMonth} ÷ {pieces} = {=}", means: "What one post, video or article costs you to put out." },
    { id: "perView", label: "Cost per view", unit: "smallmoney", formula: "IF(AND(HAS(perPiece), viewsPer > 0), perPiece / viewsPer, NA())", none: "No views to divide by", sum: "{perPiece} ÷ {viewsPer} = {=}", means: "Compare it with what your ads pay for a view." },
    { id: "per1000Views", label: "Cost for every 1,000 views", unit: "money", formula: "IF(HAS(perView), perView * 1000, NA())", none: "No views to divide by", sum: "{perView} × 1,000 = {=}", means: "The same number as an ad's cost per 1,000, so you can compare the two." },
    { id: "perResult", label: "Cost per result", unit: "money", formula: "IF(AND(HAS(perPiece), resultsPer > 0), perPiece / resultsPer, NA())", none: "No results tracked", sum: "{perPiece} ÷ {resultsPer} = {=}", means: "What one lead, sign-up or sale from content costs you. Compare it with what a sale from ads costs." },
    { id: "yearCost", label: "What content costs a year", unit: "money", formula: "totalMonth * 12", sum: "{totalMonth} × 12 = {=}", means: "At this pace." },
  ],
  answer: [
    [
      { if: "pieces = 0", text: "You publish nothing yet, so there is no cost per piece. You still spend {totalMonth} a month on freelancers and tools." },
      { if: "totalMonth = 0", text: "At these numbers content costs you nothing. Type what an hour of your time is worth, or what you pay for tools and freelancers." },
      { if: "AND(HAS(per1000Views), HAS(perResult))", text: "Each piece costs you {perPiece}: {totalMonth} a month across {pieces} pieces, with {hoursMonth} of your team's time in it. That is {per1000Views} for every 1,000 views and {perResult} for each result." },
      { if: "HAS(per1000Views)", text: "Each piece costs you {perPiece}: {totalMonth} a month across {pieces} pieces, with {hoursMonth} of your team's time in it. That is {per1000Views} for every 1,000 views. Track results to see what each one costs." },
      { text: "Each piece costs you {perPiece}: {totalMonth} a month across {pieces} pieces, with {hoursMonth} of your team's time in it. Add views and results to see what each one costs." },
    ],
  ],
  next: [
    { slug: "platform-native-content-planner", why: "Plan a month of pieces made for the platform, so each one earns more views for its cost." },
    { if: "timeShare >= 50", slug: "repeat-chore-automation-planner", why: "Most of the cost is time. Find the steps in making content a tool could do." },
    { slug: "expert-content-format-planner", why: "Pick the 2 or 3 formats worth your hours, with a 4-week schedule." },
  ],
  sources: [
    { what: "Cost per piece", how: "Time at your rate + freelancers + tools, ÷ pieces a month. A standard unit cost sum." },
    { what: "Cost per 1,000 views", how: "Cost per piece ÷ views per piece × 1,000. The same shape as an ad's cost per 1,000." },
  ],
  notes: [
    "Time valued at a rate is not cash. It is only a saving if the hours go to work that earns or saves more.",
    "Views keep coming after a piece goes out. Use views over a piece's life so far, not its first day.",
    "Results from content are hard to trace. The number you can track is a floor, not the whole truth.",
  ],
};
