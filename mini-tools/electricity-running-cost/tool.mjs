// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "electricity-running-cost",
  "name": "Estimate what an appliance costs to run",
  "short": "Electricity running cost",
  "headline": "Estimate what an appliance costs to run",
  "summary": "Enter watts, hours of use and your electricity unit price. See energy use and cost for your chosen days.",
  "question": "Estimate what an appliance costs to run?",
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
      "id": "watts",
      "label": "Average power used in watts",
      "unit": "number",
      "example": 1000,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Use average power while running. Rated maximum power may overstate use.",
      "where": "The appliance label or a plug-in energy meter.",
      "tools": []
    },
    {
      "id": "hours",
      "label": "Hours used each day",
      "unit": "hours",
      "example": 2,
      "min": 0,
      "max": 24,
      "step": 0.1,
      "integer": false,
      "help": "The time it draws the average power above.",
      "where": "A timer or your usual usage.",
      "tools": []
    },
    {
      "id": "days",
      "label": "Days in the period",
      "unit": "count",
      "example": 30,
      "min": 0,
      "max": 36600,
      "step": 1,
      "integer": true,
      "help": "Use the days you want to budget for.",
      "where": "Your calendar.",
      "tools": []
    },
    {
      "id": "price",
      "label": "Electricity price per kilowatt-hour",
      "unit": "money",
      "example": 0.2,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Use the variable energy charge in the same currency as your bill.",
      "where": "Your current electricity bill.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "daily",
      "label": "Kilowatt-hours used each day",
      "unit": "number",
      "formula": "watts / 1000 * hours",
      "sum": "{watts} ÷ 1000 × {hours} = {=}",
      "means": "Power in kilowatts multiplied by hours.",
      "none": "Not enough data"
    },
    {
      "id": "energy",
      "label": "Kilowatt-hours for the whole period",
      "unit": "number",
      "formula": "daily * days",
      "sum": "{daily} × {days} = {=}",
      "means": "Estimated energy consumed over your chosen days.",
      "none": "Not enough data"
    },
    {
      "id": "cost",
      "label": "Variable electricity cost for the period",
      "unit": "money",
      "formula": "energy * price",
      "sum": "{energy} × {price} = {=}",
      "means": "Energy use multiplied by the entered unit price.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "This use adds about {energy} kWh and {cost} over {days} days, at your entered electricity price."
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
    "Thermostats and standby modes change average power. Fixed supply charges, tariff tiers, time-of-use rates and taxes outside the entered unit price are excluded."
  ]
};
