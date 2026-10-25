// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "monthly-budget",
  "name": "Monthly budget balance",
  "short": "Monthly budget balance",
  "headline": "Monthly budget balance",
  "summary": "Enter take-home income, regular bills, flexible spending and savings. See your remaining balance and spending shares.",
  "question": "What remains after my planned monthly spending and savings?",
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
      "id": "income",
      "label": "Monthly take-home income",
      "unit": "money",
      "example": 4000,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Income after tax and deductions.",
      "where": "Your payslip or records of money paid in.",
      "tools": []
    },
    {
      "id": "fixed",
      "label": "Regular monthly bills",
      "unit": "money",
      "example": 1800,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Rent or home loan, household bills, debt payments and other fixed costs.",
      "where": "Your account statements.",
      "tools": []
    },
    {
      "id": "variable",
      "label": "Flexible monthly spending",
      "unit": "money",
      "example": 1000,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Food, travel and other spending that changes.",
      "where": "Your last few months of spending.",
      "tools": []
    },
    {
      "id": "saving",
      "label": "Planned monthly savings",
      "unit": "money",
      "example": 600,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Transfers to your savings goals.",
      "where": "Your savings plan.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "allocated",
      "label": "Total planned outgoings",
      "unit": "money",
      "formula": "fixed + variable + saving",
      "sum": "{fixed} + {variable} + {saving} = {=}",
      "means": "All entered spending and saving commitments.",
      "none": "Not enough data"
    },
    {
      "id": "balance",
      "label": "Unallocated monthly balance",
      "unit": "money",
      "formula": "income - allocated",
      "sum": "{income} − {allocated} = {=}",
      "means": "A negative number means the plan exceeds take-home income.",
      "none": "Not enough data"
    },
    {
      "id": "savingShare",
      "label": "Savings as a share of take-home income",
      "unit": "percent",
      "formula": "IF(income > 0, saving / income * 100, NA())",
      "sum": "{saving} ÷ {income} × 100 = {=}",
      "means": "Your entered savings share, without a recommended target.",
      "none": "Income is zero"
    }
  ],
  "answer": [
    [
      {
        "if": "balance < 0",
        "text": "This plan exceeds monthly income by {balance:abs}. Review spending, savings or income before using it."
      },
      {
        "text": "After {allocated} of spending and savings, you have {balance} left each month."
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
    "Average annual or irregular bills into monthly amounts so they are included. This tool does not connect to your bank."
  ]
};

