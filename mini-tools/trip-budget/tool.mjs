// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "trip-budget",
  "name": "Trip budget planner",
  "short": "Trip budget planner",
  "headline": "Trip budget planner",
  "summary": "Enter nights, shared lodging, daily spending and transport. Get the group total and an equal budget per person.",
  "question": "What is the group travel budget and each person’s equal share?",
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
      "id": "people",
      "label": "People travelling",
      "unit": "count",
      "example": 2,
      "min": 1,
      "max": 1000,
      "step": 1,
      "integer": true,
      "help": "People sharing the costs in this estimate.",
      "where": "Your travel group.",
      "tools": []
    },
    {
      "id": "days",
      "label": "Days of daily spending",
      "unit": "count",
      "example": 5,
      "min": 0,
      "max": 10000,
      "step": 1,
      "integer": true,
      "help": "Include travel days if meals and local travel are needed.",
      "where": "Your itinerary.",
      "tools": []
    },
    {
      "id": "nights",
      "label": "Nights of lodging",
      "unit": "count",
      "example": 4,
      "min": 0,
      "max": 10000,
      "step": 1,
      "integer": true,
      "help": "Usually different from the number of trip days.",
      "where": "Your booking dates.",
      "tools": []
    },
    {
      "id": "room",
      "label": "Total lodging cost per night for the group",
      "unit": "money",
      "example": 120,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "All rooms combined, including fees you expect to pay.",
      "where": "Your accommodation quote.",
      "tools": []
    },
    {
      "id": "daily",
      "label": "Daily spending per person",
      "unit": "money",
      "example": 50,
      "min": 0,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "Food, local travel and activities.",
      "where": "Your own destination budget.",
      "tools": []
    },
    {
      "id": "transport",
      "label": "Total long-distance transport for the group",
      "unit": "money",
      "example": 400,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "All tickets, luggage and booking fees together.",
      "where": "Your transport quotes.",
      "tools": []
    },
    {
      "id": "buffer",
      "label": "Extra budget allowance",
      "unit": "percent",
      "example": 10,
      "min": 0,
      "max": 200,
      "step": 0.1,
      "integer": false,
      "help": "Your chosen contingency on the complete base cost.",
      "where": "Your own travel plan.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "base",
      "label": "Group budget before allowance",
      "unit": "money",
      "formula": "nights * room + people * days * daily + transport",
      "sum": "{nights} × {room} + {people} × {days} × {daily} + {transport} = {=}",
      "means": "Shared lodging, individual daily costs and group transport.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Group budget including allowance",
      "unit": "money",
      "formula": "base * (1 + buffer / 100)",
      "sum": "{base} × (1 + {buffer}) = {=}",
      "means": "The base cost plus your chosen extra allowance.",
      "none": "Not enough data"
    },
    {
      "id": "each",
      "label": "Equal budget per person",
      "unit": "money",
      "formula": "total / people",
      "sum": "{total} ÷ {people} = {=}",
      "means": "An equal share of the total. Your actual split may differ.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Budget {total} for the group, or {each} each, including your {buffer} allowance."
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
    "Use the same currency for every input. Check live travel quotes separately; this tool does not retrieve prices or exchange rates."
  ]
};
