// AI time saved. The single source of truth for this mini tool.
//
// Maths: hours by hand a month = minutes per task x times a month / 60. Hours with AI = (minutes per task with AI,
// checking included, x times) / 60, plus the runs you redo by hand: share redone x times x minutes by hand / 60.
// Hours saved = by hand - with AI. Money saved = hours saved x what an hour is worth. Net a month = money saved - the
// tool's cost. Setup cost = setup hours x hourly worth. Payback months = setup cost / net a month. A year = 12 x net - setup.
// Standard time-and-cost sums, written in our own words. The numbers in the examples are practice numbers, not measured savings.

export default {
  slug: "ai-time-saved",
  name: "AI workflow time and cost savings",
  /** The plain name, used where the tool talks about itself. */
  short: "AI workflow time and cost savings",
  headline: "AI workflow time and cost savings",
  summary: "Enter manual and AI task times, review and redo rates, usage and costs. Estimate time saved, its value and setup payback.",
  question: "Does this AI workflow save time after checking, redos and setup are counted?",
  shelf: ["general"],
  version: "1.0.0",
  updated: "2026-10-21",
  presets: [{ id: "general", label: "Any business" }],
  sections: [
    { id: "numbers", label: "The task" },
    { id: "ai", label: "The AI workflow" },
  ],
  inputs: [
    { id: "minutesHand", label: "Minutes one run takes by hand", unit: "minutes", example: 45, min: 0, max: 10000, step: 5, help: "From start to finished, the way you do it today.", where: "Time yourself on three runs and take the middle one.", tools: ["A timer", "Toggl or Harvest"] },
    { id: "times", label: "Times you do it a month", unit: "count", example: 40, min: 0, max: 1e6, step: 5, integer: true, help: "How often the task comes up. Weekly is about 4, daily about 20.", where: "Your calendar or task list for the last month.", tools: ["Your calendar", "Your task list"] },
    { id: "hourlyValue", label: "What an hour of that time is worth", unit: "money", example: 50, min: 0, max: 1e6, step: 5, help: "Pay plus extra costs per hour, or the rate you bill for the same hour.", where: "Yearly pay with extra costs, divided by hours worked a year. The hourly rate tool works it out for a freelancer.", tools: ["Your payroll", "The hourly rate tool"] },
    { id: "minutesAI", label: "Minutes one run takes with AI, checking included", unit: "minutes", example: 15, min: 0, max: 10000, step: 5, section: "ai", help: "Writing the prompt, waiting, reading the output and fixing it. Checking is part of the run.", where: "Time yourself on three runs with the workflow, checking included, and take the middle one. These are practice numbers until you have.", tools: ["A timer"] },
    { id: "redoShare", label: "Share of runs you redo by hand", unit: "percent", example: 10, min: 0, max: 100, step: 5, section: "ai", help: "Runs where the AI output was not usable and you did the whole task by hand anyway. 10 means 1 in 10.", where: "Count the failures over your last 20 runs.", tools: ["A tally"] },
    { id: "toolCost", label: "What the AI tool costs a month", unit: "money", example: 25, min: 0, max: 1e6, step: 5, section: "ai", help: "The subscription or usage you pay for this workflow. If one plan covers several workflows, share it between them.", where: "The tool's billing page.", tools: ["Your card statements", "The tool's billing page"] },
    { id: "setupHours", label: "Hours to set the workflow up, once", unit: "hours", example: 6, min: 0, max: 10000, step: 1, section: "ai", help: "Writing the skill or prompt, testing it, teaching the team.", where: "Your time log, or an honest guess doubled.", tools: ["Toggl or Harvest", "Your calendar"] },
  ],
  outputs: [
    { id: "hoursHand", label: "Hours a month by hand", unit: "hours", formula: "minutesHand * times / 60", sum: "{minutesHand} minutes × {times} ÷ 60 = {=}", means: "What the task costs you in time today." },
    { id: "hoursAI", label: "Hours a month with AI, redos included", unit: "hours", formula: "(minutesAI * times + redoShare / 100 * times * minutesHand) / 60", sum: "({minutesAI} × {times} + {redoShare} × {times} × {minutesHand}) ÷ 60 = {=}", means: "Every run with AI, plus the failed runs done again by hand." },
    { id: "hoursSaved", label: "Hours saved a month", unit: "hours", formula: "hoursHand - hoursAI", sum: "{hoursHand} − {hoursAI} = {=}", means: [
      { if: "hoursSaved < 0", text: "Below zero: the AI way takes longer at these numbers." },
      { if: "hoursSaved = 0", text: "No time saved." },
      { text: "Time back in the diary each month." },
    ] },
    { id: "shareSaved", label: "Share of the time saved", unit: "percent", formula: "IF(hoursHand > 0, hoursSaved / hoursHand * 100, NA())", none: "No task yet", sum: "{hoursSaved} ÷ {hoursHand} = {=}", means: "How much of the task's time the workflow removes." },
    { id: "moneySaved", label: "What the saved time is worth a month", unit: "money", formula: "hoursSaved * hourlyValue", sum: "{hoursSaved} × {hourlyValue} = {=}", means: "Time at your rate. It is cash only if the hours go to work that earns or saves money." },
    { id: "netMonth", label: "Net a month after the tool", unit: "money", formula: "moneySaved - toolCost", sum: "{moneySaved} − {toolCost} = {=}", means: [
      { if: "netMonth < 0", text: "Below zero: the tool costs more than the time it saves." },
      { text: "What the workflow leaves each month once the tool is paid for." },
    ] },
    { id: "setupCost", label: "What the setup cost, once", unit: "money", formula: "setupHours * hourlyValue", sum: "{setupHours} × {hourlyValue} = {=}", means: "Your setup time at your rate." },
    { id: "paybackMonths", label: "Months until the setup has paid back", unit: "months", formula: "IF(netMonth > 0, setupCost / netMonth, NA())", none: "Never, at these numbers", sum: "{setupCost} ÷ {netMonth} = {=}", means: [
      { if: "NOT(HAS(paybackMonths))", text: "Nothing is saved each month, so the setup never pays back." },
      { text: "How long before the workflow has earned back the time you spent building it." },
    ] },
    { id: "yearNet", label: "A year, setup included", unit: "money", formula: "netMonth * 12 - setupCost", sum: "{netMonth} × 12 − {setupCost} = {=}", means: "What the workflow is worth over its first year." },
    { id: "daysYear", label: "Working days back a year", unit: "days", formula: "hoursSaved * 12 / 8", sum: "{hoursSaved} × 12 ÷ 8 = {=}", means: "At 8 hours a day." },
  ],
  answer: [
    [
      { if: "times = 0", text: "You do not run this task yet, so there is nothing to save. Type how often it comes up." },
      { if: "hoursSaved <= 0", text: "With AI this task takes {hoursAI} a month against {hoursHand} by hand, so it saves no time at these numbers. Check the minutes with AI and the share you redo." },
      { if: "netMonth <= 0", text: "This workflow saves {hoursSaved} a month, worth {moneySaved}, but the tool costs {toolCost}. You are {netMonth:abs} behind each month. It only pays if the time is worth more than {hourlyValue} an hour." },
      { text: "This workflow saves {hoursSaved} a month, {shareSaved} of the time, worth {moneySaved}. After the {toolCost} tool it leaves {netMonth} a month, pays back the {setupCost} of setup in {paybackMonths}, and gives back about {daysYear} a year." },
    ],
  ],
  compare: { input: "redoShare", label: "At other redo rates", values: [0, 10, 30], outputs: ["hoursAI", "hoursSaved", "netMonth"] },
  next: [
    { slug: "repeat-chore-automation-planner", why: "Find the other weekly chores worth handing to a tool, with steps a new hire can run." },
    { slug: "ai-workflow-handoff-planner", why: "Set up the handoffs and checks so fewer runs need redoing." },
    { if: "hoursSaved <= 0", slug: "role-task-breakdown-for-ai-help", why: "This task may not be the right one. Find the tasks where AI takes the load." },
    { slug: "weekly-time-audit-planner", why: "See where the saved hours go, and win one more back." },
  ],
  sources: [
    { what: "Hours saved", how: "Hours by hand − hours with AI, with failed runs counted as done by hand again. A standard time study sum." },
    { what: "Payback", how: "Setup time at your rate ÷ what the workflow saves a month after the tool. A standard payback sum." },
  ],
  notes: [
    "The example numbers are practice numbers, not a measured saving. Time your own task three times each way before you trust the answer.",
    "Include review and fixes in every AI time estimate. Unchecked errors can make the apparent saving too high.",
    "Time valued at a rate is not cash. The saving is real only if the hours go to work that earns or saves money.",
  ],
};
