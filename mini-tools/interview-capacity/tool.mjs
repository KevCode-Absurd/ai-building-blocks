// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "interview-capacity",
  "name": "Know how many interviews your team can cover",
  "short": "Interview capacity",
  "headline": "Know how many interviews your team can cover",
  "summary": "Enter interview stages, panel size and candidate count. Compare the hours needed with interviewer availability.",
  "question": "Know how many interviews your team can cover?",
  "category": "hr",
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
      "id": "candidates",
      "label": "Candidates attending this round",
      "unit": "count",
      "example": 20,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Count candidates who reach this stage.",
      "where": "Your applicant tracking sheet.",
      "tools": []
    },
    {
      "id": "minutes",
      "label": "Minutes per interview including notes",
      "unit": "number",
      "example": 60,
      "min": 0,
      "max": 1440,
      "step": 0.1,
      "integer": false,
      "help": "Include preparation and written feedback.",
      "where": "Your interview plan.",
      "tools": []
    },
    {
      "id": "panel",
      "label": "Interviewers in each session",
      "unit": "count",
      "example": 2,
      "min": 1,
      "max": 100,
      "step": 1,
      "integer": true,
      "help": "Count everyone whose time the session needs.",
      "where": "The interview panel.",
      "tools": []
    },
    {
      "id": "available",
      "label": "Total interviewer hours available",
      "unit": "hours",
      "example": 32,
      "min": 0,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "Add each person’s free hours for this round.",
      "where": "The team calendar.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "needed",
      "label": "Interviewer hours needed",
      "unit": "hours",
      "formula": "candidates * minutes * panel / 60",
      "sum": "{candidates} × {minutes} × {panel} ÷ 60 = {=}",
      "means": "People-hours, so a two-person panel costs twice the session length.",
      "none": "Not enough data"
    },
    {
      "id": "gap",
      "label": "Hours above available time",
      "unit": "hours",
      "formula": "MAX(0, needed - available)",
      "sum": "{needed} − {available}, with zero as the floor = {=}",
      "means": "Extra interview time to find or remove from the plan.",
      "none": "Not enough data"
    },
    {
      "id": "capacity",
      "label": "Interviews the available time can cover",
      "unit": "count",
      "formula": "IF(minutes > 0, ROUNDDOWN(available * 60 / (minutes * panel), 0), NA())",
      "sum": "{available} × 60 ÷ ({minutes} × {panel}), rounded down = {=}",
      "means": "Only complete sessions count.",
      "none": "Set a session length"
    }
  ],
  "answer": [
    [
      {
        "if": "minutes = 0",
        "text": "Set a session length to work out interview capacity."
      },
      {
        "text": "This round needs {needed} of interviewer time. Your available hours cover {capacity} interviews, leaving {gap} to find."
      }
    ]
  ],
  "next": [
    {
      "slug": "culture-fit-hiring-planner",
      "why": "Build a hiring plan with evidence and clear checks."
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
    "This adds time across interviewers. It does not check calendar clashes or whether the same people can attend together."
  ],
  "fixedCurrency": "$"
};
