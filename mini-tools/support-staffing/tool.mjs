// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "support-staffing",
  "name": "Support workload calculator",
  "short": "Support workload calculator",
  "headline": "Support workload calculator",
  "summary": "Enter ticket count, handling time and usable staff hours. Estimate staffing for that workload, before shift cover and demand peaks.",
  "question": "How much staff time does this support workload need?",
  "category": "operations",
  "shelf": [
    "general"
  ],
  "version": "1.0.0",
  "updated": "2026-10-22",
  "presets": [
    {
      "id": "general",
      "label": "Your own numbers"
    }
  ],
  "inputs": [
    {
      "id": "tickets",
      "label": "Tickets in the period",
      "unit": "count",
      "example": 1000,
      "min": 0,
      "max": 10000000,
      "step": 1,
      "integer": true,
      "help": "Use a day, week or month consistently.",
      "where": "Your help desk report.",
      "tools": []
    },
    {
      "id": "minutes",
      "label": "Average handling minutes per ticket",
      "unit": "number",
      "example": 12,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Include replies, follow-up and case notes.",
      "where": "A help desk time report or a timed sample.",
      "tools": []
    },
    {
      "id": "hours",
      "label": "Paid hours per person in the same period",
      "unit": "hours",
      "example": 160,
      "min": 1,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Use hours for the same day, week or month as tickets.",
      "where": "Your staffing calendar.",
      "tools": []
    },
    {
      "id": "productive",
      "label": "Share of hours available for tickets",
      "unit": "percent",
      "example": 70,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Time after breaks, meetings, training and other duties.",
      "where": "Your staffing records.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "work",
      "label": "Ticket handling hours needed",
      "unit": "hours",
      "formula": "tickets * minutes / 60",
      "sum": "{tickets} × {minutes} ÷ 60 = {=}",
      "means": "Total work from volume and average handling time.",
      "none": "Not enough data"
    },
    {
      "id": "perPerson",
      "label": "Ticket hours per person",
      "unit": "hours",
      "formula": "hours * productive / 100",
      "sum": "{hours} × {productive} = {=}",
      "means": "Productive ticket time per staff member.",
      "none": "Not enough data"
    },
    {
      "id": "staff",
      "label": "Staff equivalents needed",
      "unit": "number",
      "formula": "IF(work = 0, 0, IF(perPerson > 0, work / perPerson, NA()))",
      "sum": "{work} ÷ {perPerson} = {=}",
      "means": "Total work divided by usable hours per person. A result of 1.5 means one person’s time plus half another’s, before planning shifts.",
      "none": "No productive time entered"
    }
  ],
  "answer": [
    [
      {
        "if": "NOT(HAS(staff))",
        "text": "Ticket work needs {work}, but no productive staff time is available. Set the productive share above zero."
      },
      {
        "text": "The queue needs {work} of handling time, equal to {staff} people at the hours and productive share entered."
      }
    ]
  ],
  "next": [
    {
      "slug": "repeat-chore-automation-planner",
      "why": "Turn repeated work into a process someone else can follow."
    }
  ],
  "sources": [
    {
      "what": "Method",
      "how": "Original calculator using the explicit arithmetic shown for each answer. Rates, costs, periods and buffers come from your own inputs."
    }
  ],
  "notes": [
    "The filled-in values are illustrative figures. Replace them with your own records; the result follows your inputs.",
    "This estimates workload. It does not predict waiting time, how many chats one person can handle, busy spells, shift cover or promised response times."
  ],
  "fixedCurrency": "$"
};
