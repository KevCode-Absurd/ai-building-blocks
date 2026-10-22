// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "training-budget",
  "name": "Budget for training with staff time included",
  "short": "Training budget",
  "headline": "Budget for training with staff time included",
  "summary": "Enter learners, course fees and study hours. See cash spending and the value of paid learning time.",
  "question": "Budget for training with staff time included?",
  "category": "hr",
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
      "id": "learners",
      "label": "People taking the training",
      "unit": "count",
      "example": 10,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Count the full group.",
      "where": "Your learning plan.",
      "tools": []
    },
    {
      "id": "fee",
      "label": "Course fee per person",
      "unit": "money",
      "example": 200,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the final fee including non-recoverable taxes.",
      "where": "The training provider quote.",
      "tools": []
    },
    {
      "id": "hours",
      "label": "Paid study hours per person",
      "unit": "hours",
      "example": 8,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Include lessons and practice during working hours.",
      "where": "The course outline.",
      "tools": []
    },
    {
      "id": "hourly",
      "label": "Average employer cost per hour",
      "unit": "money",
      "example": 30,
      "min": 0,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "Use pay plus employer costs per working hour.",
      "where": "Your payroll or finance team.",
      "tools": []
    },
    {
      "id": "shared",
      "label": "Other shared cash costs",
      "unit": "money",
      "example": 300,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "For example travel, room hire or materials.",
      "where": "Your event or purchasing plan.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "cash",
      "label": "Cash budget",
      "unit": "money",
      "formula": "learners * fee + shared",
      "sum": "{learners} × {fee} + {shared} = {=}",
      "means": "Fees plus shared cash costs.",
      "none": "Not enough data"
    },
    {
      "id": "timeValue",
      "label": "Value of staff study time",
      "unit": "money",
      "formula": "learners * hours * hourly",
      "sum": "{learners} × {hours} × {hourly} = {=}",
      "means": "Paid time used for learning.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Cash and staff time together",
      "unit": "money",
      "formula": "cash + timeValue",
      "sum": "{cash} + {timeValue} = {=}",
      "means": "A planning cost including staff time, rather than extra cash alone.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Plan for {cash} in cash and {timeValue} in staff time, a combined cost of {total}."
      }
    ]
  ],
  "next": [
    {
      "slug": "culture-fit-hiring-planner",
      "why": "Build a hiring plan with evidence and clear checks."
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
    "This budgets cost. Measure the learning outcome separately before claiming a return on training."
  ]
};
