// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "subscription-savings",
  "name": "Check when an annual subscription pays off",
  "short": "Monthly or annual subscription",
  "headline": "Check when an annual subscription pays off",
  "summary": "Compare monthly and annual prices with months you expect to use the service. See the cost difference and break-even.",
  "question": "Check when an annual subscription pays off?",
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
      "id": "monthly",
      "label": "Monthly subscription price",
      "unit": "money",
      "example": 20,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "The final monthly price including relevant taxes.",
      "where": "The pricing page or your bill.",
      "tools": []
    },
    {
      "id": "annual",
      "label": "Annual upfront subscription price",
      "unit": "money",
      "example": 180,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "The full amount due for one year.",
      "where": "The annual plan quote.",
      "tools": []
    },
    {
      "id": "months",
      "label": "Months you expect to need it",
      "unit": "count",
      "example": 8,
      "min": 0,
      "max": 12,
      "step": 1,
      "integer": true,
      "help": "Use up to twelve months for this comparison.",
      "where": "Your project or personal plan.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "payMonthly",
      "label": "Monthly plan cost for expected use",
      "unit": "money",
      "formula": "monthly * months",
      "sum": "{monthly} × {months} = {=}",
      "means": "Assumes the monthly plan can be cancelled before unused months.",
      "none": "Not enough data"
    },
    {
      "id": "saving",
      "label": "Annual plan saving for expected use",
      "unit": "money",
      "formula": "payMonthly - annual",
      "sum": "{payMonthly} − {annual} = {=}",
      "means": "Negative means the annual plan costs more for your expected use.",
      "none": "Not enough data"
    },
    {
      "id": "breakEven",
      "label": "Months of monthly fees equal to annual price",
      "unit": "months",
      "formula": "IF(monthly > 0, annual / monthly, NA())",
      "sum": "{annual} ÷ {monthly} = {=}",
      "means": "At this length of use, both plans cost the same.",
      "none": "Monthly price is zero"
    }
  ],
  "answer": [
    [
      {
        "if": "saving < 0",
        "text": "For {months} months, paying monthly costs {payMonthly}. The annual plan costs {saving:abs} more."
      },
      {
        "text": "For {months} months, the annual plan saves {saving} against {payMonthly} in monthly fees."
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
    "Compare cancellation, renewal and refund terms as well as price. Annual payment ties up cash at the start."
  ]
};

