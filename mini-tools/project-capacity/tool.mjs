// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "project-capacity",
  "name": "Project capacity checker",
  "short": "Project capacity checker",
  "headline": "Project capacity checker",
  "summary": "Set team hours, weeks and time available for the project. Compare capacity with the estimate and your extra time allowance.",
  "question": "Does our project estimate fit the team’s available hours?",
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
      "id": "people",
      "label": "People assigned",
      "unit": "count",
      "example": 4,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Count people with the same weekly hours and project share.",
      "where": "Your project roster.",
      "tools": []
    },
    {
      "id": "weekly",
      "label": "Hours per person each week",
      "unit": "hours",
      "example": 40,
      "min": 0,
      "max": 168,
      "step": 0.1,
      "integer": false,
      "help": "Hours before the project share is applied.",
      "where": "Your team schedule.",
      "tools": []
    },
    {
      "id": "weeks",
      "label": "Weeks available",
      "unit": "number",
      "example": 6,
      "min": 0,
      "max": 1000,
      "step": 0.1,
      "integer": false,
      "help": "The work window before the target delivery.",
      "where": "Your project calendar.",
      "tools": []
    },
    {
      "id": "share",
      "label": "Share of those hours for this project",
      "unit": "percent",
      "example": 60,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "After meetings, leave and other work.",
      "where": "Your resource plan.",
      "tools": []
    },
    {
      "id": "estimate",
      "label": "Base project estimate in hours",
      "unit": "hours",
      "example": 500,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Total people-hours of planned work.",
      "where": "Your work breakdown.",
      "tools": []
    },
    {
      "id": "buffer",
      "label": "Extra time allowance",
      "unit": "percent",
      "example": 20,
      "min": 0,
      "max": 500,
      "step": 0.1,
      "integer": false,
      "help": "Your chosen extra allowance on the base estimate.",
      "where": "Your past project overruns or plan.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "capacity",
      "label": "Available project hours",
      "unit": "hours",
      "formula": "people * weekly * weeks * share / 100",
      "sum": "{people} × {weekly} × {weeks} × {share} = {=}",
      "means": "Team time available within the stated work window.",
      "none": "Not enough data"
    },
    {
      "id": "required",
      "label": "Estimated hours including allowance",
      "unit": "hours",
      "formula": "estimate * (1 + buffer / 100)",
      "sum": "{estimate} × (1 + {buffer}) = {=}",
      "means": "Total planned demand on the team.",
      "none": "Not enough data"
    },
    {
      "id": "gap",
      "label": "Hours above available capacity",
      "unit": "hours",
      "formula": "MAX(0, required - capacity)",
      "sum": "{required} − {capacity}, with zero as the floor = {=}",
      "means": "Work to remove or capacity to add.",
      "none": "Not enough data"
    },
    {
      "id": "spare",
      "label": "Capacity after the estimate",
      "unit": "hours",
      "formula": "MAX(0, capacity - required)",
      "sum": "{capacity} − {required}, with zero as the floor = {=}",
      "means": "Time left if the work fits.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "The team has {capacity} available against {required} of planned work. The gap is {gap}, and spare capacity is {spare}."
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
    "Total hours cannot prove that task order, specialist skills or dependencies fit the deadline. Check those in the project plan."
  ],
  "fixedCurrency": "$"
};
