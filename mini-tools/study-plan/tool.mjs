// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "study-plan",
  "name": "Study time planner",
  "short": "Study time planner",
  "headline": "Study time planner",
  "summary": "Enter lessons, lesson time, practice and weeks remaining. Compare required weekly hours with your available time.",
  "question": "Does my course workload fit the study hours I have left?",
  "category": "personal",
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
      "id": "lessons",
      "label": "Lessons left",
      "unit": "count",
      "example": 24,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Count the lessons or chapters still to finish.",
      "where": "Your course outline.",
      "tools": []
    },
    {
      "id": "minutes",
      "label": "Minutes for each lesson",
      "unit": "number",
      "example": 30,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Use an average if lengths differ.",
      "where": "The lesson lengths or a timed sample.",
      "tools": []
    },
    {
      "id": "practice",
      "label": "Practice minutes per lesson",
      "unit": "number",
      "example": 45,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Allow time to apply and review the lesson.",
      "where": "Your study plan or a past session.",
      "tools": []
    },
    {
      "id": "weeks",
      "label": "Weeks remaining",
      "unit": "number",
      "example": 8,
      "min": 1,
      "max": 1000,
      "step": 0.1,
      "integer": false,
      "help": "Time before the course or exam deadline.",
      "where": "Your calendar.",
      "tools": []
    },
    {
      "id": "available",
      "label": "Study hours available each week",
      "unit": "hours",
      "example": 4,
      "min": 0,
      "max": 168,
      "step": 0.1,
      "integer": false,
      "help": "Hours you can protect after other commitments.",
      "where": "Your weekly calendar.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "total",
      "label": "Total learning hours left",
      "unit": "hours",
      "formula": "lessons * (minutes + practice) / 60",
      "sum": "{lessons} × ({minutes} + {practice}) ÷ 60 = {=}",
      "means": "Lessons and practice counted together.",
      "none": "Not enough data"
    },
    {
      "id": "weekly",
      "label": "Weekly study hours needed",
      "unit": "hours",
      "formula": "total / weeks",
      "sum": "{total} ÷ {weeks} = {=}",
      "means": "An even pace across the remaining weeks.",
      "none": "Not enough data"
    },
    {
      "id": "gap",
      "label": "Extra hours needed each week",
      "unit": "hours",
      "formula": "MAX(0, weekly - available)",
      "sum": "{weekly} − {available}, with zero as the floor = {=}",
      "means": "Weekly hours to add, or work to remove from scope.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "The course needs {total} in total, or {weekly} each week. Compared with your calendar, you need {gap} extra each week."
      }
    ]
  ],
  "next": [
    {
      "slug": "weekly-time-audit-planner",
      "why": "Use your real week to make room for the next step."
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
    "This checks time, rather than mastery. Keep review and rest in the plan, and update the estimate after a few real sessions."
  ],
  "fixedCurrency": "$"
};
