// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "focus-time",
  "name": "Focus time planner",
  "short": "Focus time planner",
  "headline": "Focus time planner",
  "summary": "Subtract meetings and daily admin from working hours. See how many complete focus blocks can fit in the remaining time.",
  "question": "How many focus blocks could fit after meetings and daily admin?",
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
      "id": "days",
      "label": "Working days in the period",
      "unit": "count",
      "example": 5,
      "min": 0,
      "max": 366,
      "step": 1,
      "integer": true,
      "help": "Use the days you actually plan to work.",
      "where": "Your calendar.",
      "tools": []
    },
    {
      "id": "hours",
      "label": "Working hours per day",
      "unit": "hours",
      "example": 8,
      "min": 0,
      "max": 24,
      "step": 0.1,
      "integer": false,
      "help": "Exclude unpaid breaks if they are outside your workday.",
      "where": "Your work schedule.",
      "tools": []
    },
    {
      "id": "meetings",
      "label": "Total meeting hours in the period",
      "unit": "hours",
      "example": 12,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Add meetings across all the days above.",
      "where": "Your calendar.",
      "tools": []
    },
    {
      "id": "admin",
      "label": "Admin hours each day",
      "unit": "hours",
      "example": 1,
      "min": 0,
      "max": 24,
      "step": 0.1,
      "integer": false,
      "help": "Email, routine tasks and other work outside focus blocks.",
      "where": "A time log or honest estimate.",
      "tools": []
    },
    {
      "id": "block",
      "label": "Length of each focus block in minutes",
      "unit": "number",
      "example": 90,
      "min": 1,
      "max": 1440,
      "step": 0.1,
      "integer": false,
      "help": "Include the full period you want to protect.",
      "where": "Your preferred work session.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "available",
      "label": "Hours left after meetings and admin",
      "unit": "hours",
      "formula": "MAX(0, days * hours - meetings - days * admin)",
      "sum": "{days} × {hours} − {meetings} − {days} × {admin}, with zero as the floor = {=}",
      "means": "Total free time before you choose calendar slots.",
      "none": "Not enough data"
    },
    {
      "id": "blocks",
      "label": "Complete focus blocks that fit in total",
      "unit": "count",
      "formula": "ROUNDDOWN(available * 60 / block, 0)",
      "sum": "{available} × 60 ÷ {block}, rounded down = {=}",
      "means": "A total-hours upper bound. Short gaps may make some of it unusable.",
      "none": "Not enough data"
    },
    {
      "id": "overbooked",
      "label": "Hours commitments exceed the work period",
      "unit": "hours",
      "formula": "MAX(0, meetings + days * admin - days * hours)",
      "sum": "Meetings plus admin minus work hours, with zero as the floor = {=}",
      "means": "Time to remove from the plan before adding focus work.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "if": "overbooked > 0",
        "text": "Meetings and admin exceed your work period by {overbooked}. There is no room for focus blocks yet."
      },
      {
        "text": "You have {available} left in total, enough for up to {blocks} complete {block}-minute blocks if the calendar gaps fit."
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
    "Total free hours are not necessarily one continuous block. Place sessions on the calendar and leave room for breaks and unexpected work."
  ],
  "fixedCurrency": "$"
};
