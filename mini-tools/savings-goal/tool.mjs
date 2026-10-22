// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "savings-goal",
  "name": "Find the monthly amount for a savings goal",
  "short": "Savings goal",
  "headline": "Find the monthly amount for a savings goal",
  "summary": "Enter the target, current savings and months remaining. See the monthly amount and your budget gap.",
  "question": "Find the monthly amount for a savings goal?",
  "category": "finance",
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
      "id": "target",
      "label": "Savings target",
      "unit": "money",
      "example": 6000,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "The total amount you want by the deadline.",
      "where": "Your goal or purchase budget.",
      "tools": []
    },
    {
      "id": "saved",
      "label": "Already saved for this goal",
      "unit": "money",
      "example": 1200,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "Count only money allocated to this goal.",
      "where": "Your savings account or goal tracker.",
      "tools": []
    },
    {
      "id": "months",
      "label": "Months until the deadline",
      "unit": "count",
      "example": 12,
      "min": 0,
      "max": 1200,
      "step": 1,
      "integer": true,
      "help": "Number of monthly deposits you can make before the deadline.",
      "where": "Your calendar.",
      "tools": []
    },
    {
      "id": "budget",
      "label": "Monthly saving amount available",
      "unit": "money",
      "example": 300,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "What your budget can support each month.",
      "where": "Your monthly budget.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "gap",
      "label": "Amount left to save",
      "unit": "money",
      "formula": "MAX(0, target - saved)",
      "sum": "{target} − {saved}, with zero as the floor = {=}",
      "means": "The amount needed after your current savings.",
      "none": "Not enough data"
    },
    {
      "id": "required",
      "label": "Required saving each month",
      "unit": "money",
      "formula": "IF(gap = 0, 0, IF(months > 0, gap / months, NA()))",
      "sum": "{gap} ÷ {months} = {=}",
      "means": "Equal monthly deposits, without interest.",
      "none": "Deadline has arrived"
    },
    {
      "id": "projected",
      "label": "Savings at the deadline",
      "unit": "money",
      "formula": "saved + budget * months",
      "sum": "{saved} + {budget} × {months} = {=}",
      "means": "What your stated monthly budget would build.",
      "none": "Not enough data"
    },
    {
      "id": "shortfall",
      "label": "Shortfall at your monthly budget",
      "unit": "money",
      "formula": "MAX(0, target - projected)",
      "sum": "{target} − {projected}, with zero as the floor = {=}",
      "means": "Extra money needed if the target and deadline stay fixed.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "if": "gap = 0",
        "text": "Your current savings already meet the target."
      },
      {
        "if": "months = 0",
        "text": "The deadline has arrived and {gap} remains. A future monthly deposit cannot close this deadline’s gap."
      },
      {
        "text": "Save {required} each month to reach {target}. At your current budget, the deadline shortfall is {shortfall}."
      }
    ]
  ],
  "next": [
    {
      "slug": "get-your-personal-money-in-order-with-room-for-error",
      "why": "Turn your figures into a personal money plan with room for unexpected costs."
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
    "This is cash arithmetic. Interest, fees, inflation and changes in income are outside the estimate."
  ]
};

