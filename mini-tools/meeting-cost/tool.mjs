// Meeting cost. The single source of truth for this mini tool.
//
// Maths: pay per hour = yearly pay x (1 + on-costs) / hours worked a year. People-hours per meeting =
// people x (minutes + refocus minutes) / 60. Cost per meeting = people-hours x pay per hour.
// Cost a year = cost per meeting x times it runs. Saving = cost a year x the share you cut.
// Standard people-time cost formulas, written in our own words.

export default {
  slug: "meeting-cost",
  name: "See what a repeating meeting costs you a year",
  /** The plain name, used where the tool talks about itself. */
  short: "Meeting cost",
  headline: "See what a repeating meeting costs in people's time over a year",
  summary: "Type who comes, what they earn, how long it runs and how often. You get the cost each time, the cost a year and what cutting it saves.",
  question: "What does my weekly meeting cost in a year, and what do I save if I cut it in half?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  inputs: [
    { id: "attendees", label: "People in the meeting", unit: "number", example: 6, min: 1, max: 10000, step: 1, integer: true, help: "Everyone who joins, including you.", where: "The invite list on your calendar.", tools: ["Google Calendar", "Outlook", "Zoom"] },
    { id: "pay", label: "Average yearly pay of those people", unit: "money", example: 60000, min: 0, max: 1e9, step: 1000, help: "What each person is paid in a year, on average, before tax. A typical figure for the roles works if you don't want to use real ones.", where: "Your payroll, or a pay range for each role.", tools: ["Your payroll software", "A spreadsheet"] },
    { id: "oncost", label: "Extra costs on top of pay", unit: "percent", example: 25, min: 0, max: 200, step: 5, help: "Taxes, benefits and equipment that an employer pays on top of pay, as a share of pay. Use 0 to count pay only.", where: "Your accountant, or your payroll costs divided by pay.", tools: ["Your accountant", "Your payroll software"] },
    { id: "workHours", label: "Hours each person works a year", unit: "hours", example: 1800, min: 1, max: 5000, step: 50, help: "Hours actually worked, after holidays, public holidays and sick days.", where: "Your contract hours, less time off.", tools: ["Your payroll software", "Your calendar"] },
    { id: "minutes", label: "Length of the meeting", unit: "minutes", example: 60, min: 0, max: 1440, step: 5, help: "How long it runs, in minutes.", where: "The time on the calendar invite.", tools: ["Google Calendar", "Outlook"] },
    { id: "refocus", label: "Minutes lost getting back into work after it", unit: "minutes", example: 0, min: 0, max: 120, step: 5, help: "Time people lose before they are back in focused work. Use 0 to count the meeting only.", where: "Your own guess, or ask two or three people how long it takes.", tools: ["A quick team poll"] },
    { id: "runs", label: "Times it runs a year", unit: "number", example: 48, min: 0, max: 5000, step: 1, help: "Weekly is about 48, daily is about 240 and monthly is 12.", where: "The repeat setting on the calendar invite, less holidays.", tools: ["Google Calendar", "Outlook"] },
    { id: "cut", label: "Share of the meeting you would cut", unit: "percent", example: 50, min: 0, max: 100, step: 5, help: "Cut half by running it every other time, or by halving its length. 50 means half.", where: "The change you are thinking about.", tools: [] },
  ],
  outputs: [
    { id: "hourly", label: "What one person's hour costs", unit: "money", formula: "pay * (1 + oncost / 100) / workHours", sum: "{pay} × (100% + {oncost}) ÷ {workHours} hours = {=}", means: "Pay plus the extra costs, spread over the hours worked." },
    { id: "peopleHours", label: "People-hours used each time", unit: "hours", formula: "attendees * (minutes + refocus) / 60", sum: "{attendees} people × ({minutes} + {refocus} minutes) ÷ 60 = {=}", means: "The hours of work given up each time it runs, added across everyone in it." },
    { id: "costPerMinute", label: "Cost of each minute in the room", unit: "money", formula: "attendees * hourly / 60", sum: "{attendees} × {hourly} ÷ 60 = {=}", means: "What every minute costs while it runs, before any refocus time." },
    { id: "costPerRun", label: "Cost each time it runs", unit: "money", formula: "peopleHours * hourly", sum: "{peopleHours} hours × {hourly} = {=}", means: "The value of the time people spend, not money out of your account." },
    { id: "hoursYear", label: "People-hours a year", unit: "hours", formula: "peopleHours * runs", sum: "{peopleHours} × {runs} = {=}", means: "Divide by 8 for working days given up across the group." },
    { id: "costYear", label: "Cost a year", unit: "money", formula: "costPerRun * runs", sum: "{costPerRun} × {runs} = {=}", means: [
      { if: "costYear = 0", text: "Nothing to count yet. Check that pay, length and times a year are filled in." },
      { text: "What the meeting costs in time over a year. It says nothing about what the meeting is worth." },
    ] },
    { id: "savedYear", label: "Saved a year by cutting it", unit: "money", formula: "costYear * cut / 100", sum: "{costYear} × {cut} = {=}", means: "The time you get back, valued at pay. It is only a real saving if people use it on something useful." },
    { id: "savedHours", label: "Hours given back a year", unit: "hours", formula: "hoursYear * cut / 100", sum: "{hoursYear} × {cut} = {=}", means: "People-hours back in the diary." },
  ],
  answer: [
    [
      { if: "costYear = 0", text: "Nothing to count yet. Type the length, the times it runs a year and what people earn." },
      { if: "cut = 0", text: "This meeting costs {costYear} a year in people's time: {costPerRun} each time, across {hoursYear} hours. You have not cut any of it yet." },
      { text: "This meeting costs {costYear} a year in people's time: {costPerRun} each time, across {hoursYear} hours. Cutting {cut} of it gives back {savedHours} hours, worth {savedYear}." },
    ],
  ],
  next: [
    { slug: "run-a-meeting-worth-holding-from-agenda-to-action-items", why: "If it stays, run it with an agenda, decisions and action items." },
    { slug: "process-and-meeting-cull-planner", why: "List your regular meetings and decide which to keep, shrink or drop." },
  ],
  sources: [
    { what: "Pay per hour", how: "Yearly pay plus the employer's extra costs, divided by the hours worked in a year. A standard fully loaded rate sum." },
    { what: "Meeting cost", how: "People × hours × pay per hour, plus time to get back into focused work. A standard people-time cost sum." },
  ],
  notes: [
    "Time valued at pay is not cash. You only save money if the hours go to work that earns or saves more.",
    "A figure for extra costs differs by country and employer, so check yours with an accountant.",
    "Some meetings are worth far more than they cost. This tool prices the time, not the decisions.",
  ],
};
