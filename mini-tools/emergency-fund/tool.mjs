// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "emergency-fund",
  "name": "Emergency savings planner",
  "short": "Emergency savings planner",
  "headline": "Emergency savings planner",
  "summary": "Choose the months of expenses you want covered. See the target, current gap and months to save it.",
  "question": "How much remains to save for my chosen cash buffer?",
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
      "id": "essential",
      "label": "Essential monthly expenses",
      "unit": "money",
      "example": 2000,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Include the costs you would keep paying during an income gap.",
      "where": "Your recent bank statements.",
      "tools": []
    },
    {
      "id": "months",
      "label": "Months of expenses you want covered",
      "unit": "months",
      "example": 4,
      "min": 0,
      "max": 120,
      "step": 0.1,
      "integer": false,
      "help": "Choose the buffer that suits your own circumstances.",
      "where": "Your own cash buffer goal.",
      "tools": []
    },
    {
      "id": "saved",
      "label": "Cash already set aside",
      "unit": "money",
      "example": 3000,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "Count accessible savings reserved for this goal.",
      "where": "Your savings balance.",
      "tools": []
    },
    {
      "id": "monthly",
      "label": "Amount you can add each month",
      "unit": "money",
      "example": 500,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Use an amount left after regular commitments.",
      "where": "Your monthly budget.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "target",
      "label": "Cash buffer target",
      "unit": "money",
      "formula": "essential * months",
      "sum": "{essential} × {months} = {=}",
      "means": "Essential expenses for your chosen number of months.",
      "none": "Not enough data"
    },
    {
      "id": "gap",
      "label": "Amount still to save",
      "unit": "money",
      "formula": "MAX(0, target - saved)",
      "sum": "{target} − {saved}, with zero as the floor = {=}",
      "means": "The remaining gap to your chosen target.",
      "none": "Not enough data"
    },
    {
      "id": "time",
      "label": "Monthly deposits needed",
      "unit": "count",
      "formula": "IF(gap = 0, 0, IF(monthly > 0, ROUNDUP(gap / monthly, 0), NA()))",
      "sum": "{gap} ÷ {monthly}, rounded up = {=}",
      "means": "Assumes you add the same amount each month and earn no interest.",
      "none": "Set a monthly saving amount"
    }
  ],
  "answer": [
    [
      {
        "if": "gap = 0",
        "text": "Your {saved} cash already covers the {target} target you chose."
      },
      {
        "if": "monthly = 0",
        "text": "Your target is {target}, with {gap} still to save. Add a monthly saving amount to estimate the time."
      },
      {
        "text": "Your target is {target}. Save {gap} more over {time} monthly deposits of {monthly}."
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
    "This follows the target you choose. It does not recommend a buffer size or include interest, inflation or investment returns."
  ]
};

