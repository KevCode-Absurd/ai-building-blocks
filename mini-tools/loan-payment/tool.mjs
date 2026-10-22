// Original tool. All numbers shown are illustrative figures, not a real person’s results.
// Below 0.0001% annual nominal interest, use the payment series through r^2
// (r = annual / 1200). This avoids subtracting two nearly equal doubles.
// Across the allowed principal/month bounds the omitted terms are below a cent.
// Interest uses the increment directly so tiny positive interest stays positive.
export default {
  "slug": "loan-payment",
  "name": "Estimate a fixed loan’s monthly payment",
  "short": "Loan payment estimate",
  "headline": "Estimate a fixed loan’s monthly payment",
  "summary": "Enter the amount, fixed yearly interest and monthly payment count. See instalments and total interest before fees.",
  "question": "Estimate a fixed loan’s monthly payment?",
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
      "id": "principal",
      "label": "Amount borrowed",
      "unit": "money",
      "example": 12000,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "The starting loan balance.",
      "where": "The lender quote.",
      "tools": []
    },
    {
      "id": "annual",
      "label": "Fixed annual nominal interest rate",
      "unit": "percent",
      "example": 12,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Use the nominal rate, before fees. This is divided by 12 for a monthly rate.",
      "where": "The lender’s interest terms.",
      "tools": []
    },
    {
      "id": "months",
      "label": "Number of monthly payments",
      "unit": "count",
      "example": 24,
      "min": 1,
      "max": 1200,
      "step": 1,
      "integer": true,
      "help": "Payments are assumed to fall at the end of each month.",
      "where": "The repayment schedule.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "rate",
      "label": "Monthly interest rate",
      "unit": "percent",
      "formula": "annual / 12",
      "sum": "{annual} ÷ 12 = {=}",
      "means": "Nominal yearly interest divided into twelve equal periods.",
      "none": "Not enough data"
    },
    {
      "id": "payment",
      "label": "Estimated monthly payment",
      "unit": "money",
      "formula": "IF(annual < 0.0001, principal / months * (1 + (months + 1) * annual / 2400 + (months ^ 2 - 1) * (annual / 1200) ^ 2 / 12), principal * (annual / 1200) / (1 - (1 + annual / 1200) ^ (0 - months)))",
      "sum": "Fixed payment on {principal} over {months} months at {annual} a year = {=}",
      "means": "The standard equal-payment loan formula. The final lender payment may differ after rounding.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Total repaid before fees",
      "unit": "money",
      "formula": "payment * months",
      "sum": "{payment} × {months} = {=}",
      "means": "All estimated monthly payments added together.",
      "none": "Not enough data"
    },
    {
      "id": "interest",
      "label": "Total interest before fees",
      "unit": "money",
      "formula": "IF(annual < 0.0001, principal * ((months + 1) * annual / 2400 + (months ^ 2 - 1) * (annual / 1200) ^ 2 / 12), total - principal)",
      "sum": "{total} − {principal} = {=}",
      "means": "Does not include arrangement charges or other fees.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "The estimated payment is {payment} a month. Total repayment is {total}, including {interest} in interest before fees."
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
    "Estimate for a fixed nominal rate, monthly compounding and payments at month end. It does not calculate APR, daily interest, fees, insurance, variable rates or early repayments. Confirm the lender’s repayment schedule."
  ]
};

