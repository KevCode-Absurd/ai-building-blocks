// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "commute-cost",
  "name": "Commute time and cost",
  "short": "Commute time and cost",
  "headline": "Commute time and cost",
  "summary": "Enter office days, return travel time and daily cost. Compare the monthly total with fewer office days.",
  "question": "How much time and travel cost would fewer office days save?",
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
      "label": "Office days each month",
      "unit": "count",
      "example": 20,
      "min": 0,
      "max": 31,
      "step": 1,
      "integer": true,
      "help": "Use actual expected days after holidays and remote work.",
      "where": "Your work calendar.",
      "tools": []
    },
    {
      "id": "minutes",
      "label": "Return commute minutes each day",
      "unit": "number",
      "example": 80,
      "min": 0,
      "max": 1440,
      "step": 0.1,
      "integer": false,
      "help": "Both directions together, including waiting.",
      "where": "Time a normal door-to-door journey.",
      "tools": []
    },
    {
      "id": "cost",
      "label": "Return travel cost each day",
      "unit": "money",
      "example": 12,
      "min": 0,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "Both directions. Add parking or tolls if relevant.",
      "where": "Your fares or mileage and parking records.",
      "tools": []
    },
    {
      "id": "reduce",
      "label": "Office days removed each month",
      "unit": "count",
      "example": 4,
      "min": 0,
      "max": 31,
      "step": 1,
      "integer": true,
      "help": "A scenario to compare with your current schedule.",
      "where": "Your proposed work schedule.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "hours",
      "label": "Commute hours each month",
      "unit": "hours",
      "formula": "days * minutes / 60",
      "sum": "{days} × {minutes} ÷ 60 = {=}",
      "means": "Total door-to-door travel time.",
      "none": "Not enough data"
    },
    {
      "id": "cash",
      "label": "Commute spending each month",
      "unit": "money",
      "formula": "days * cost",
      "sum": "{days} × {cost} = {=}",
      "means": "At the daily cost entered.",
      "none": "Not enough data"
    },
    {
      "id": "hoursBack",
      "label": "Hours saved by the change",
      "unit": "hours",
      "formula": "MIN(days, reduce) * minutes / 60",
      "sum": "Fewer office days, capped at {days}, × {minutes} ÷ 60 = {=}",
      "means": "You cannot remove more office days than you currently have.",
      "none": "Not enough data"
    },
    {
      "id": "cashBack",
      "label": "Travel cost saved by the change",
      "unit": "money",
      "formula": "MIN(days, reduce) * cost",
      "sum": "Fewer office days, capped at {days}, × {cost} = {=}",
      "means": "Assumes costs fall with each trip removed.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Your commute uses {hours} and {cash} each month. The proposed change gives back {hoursBack} and {cashBack}."
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
    "A prepaid travel pass, parking contract or fixed car cost may not fall when trips fall. Use avoidable daily costs to estimate cash saved."
  ]
};
