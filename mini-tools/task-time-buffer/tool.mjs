// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "task-time-buffer",
  "name": "Add an honest buffer to a task estimate",
  "short": "Task time buffer",
  "headline": "Add an honest buffer to a task estimate",
  "summary": "Enter the base estimate, number of tasks and buffer. See the hours to reserve and the extra time added.",
  "question": "Add an honest buffer to a task estimate?",
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
      "id": "minutes",
      "label": "Base minutes per task",
      "unit": "number",
      "example": 45,
      "min": 0,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "Time one normal task takes before contingency.",
      "where": "Your time log or a recent sample.",
      "tools": []
    },
    {
      "id": "tasks",
      "label": "Number of tasks",
      "unit": "count",
      "example": 12,
      "min": 0,
      "max": 1000000,
      "step": 1,
      "integer": true,
      "help": "Count tasks with a similar scope.",
      "where": "Your task list.",
      "tools": []
    },
    {
      "id": "buffer",
      "label": "Extra time as a share of the estimate",
      "unit": "percent",
      "example": 25,
      "min": 0,
      "max": 500,
      "step": 0.1,
      "integer": false,
      "help": "Choose your own buffer based on previous overruns.",
      "where": "The difference between past estimates and actual time.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "base",
      "label": "Base hours for all tasks",
      "unit": "hours",
      "formula": "minutes * tasks / 60",
      "sum": "{minutes} × {tasks} ÷ 60 = {=}",
      "means": "Time before the buffer.",
      "none": "Not enough data"
    },
    {
      "id": "extra",
      "label": "Extra hours added",
      "unit": "hours",
      "formula": "base * buffer / 100",
      "sum": "{base} × {buffer} = {=}",
      "means": "Contingency for this batch.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Hours to reserve",
      "unit": "hours",
      "formula": "base + extra",
      "sum": "{base} + {extra} = {=}",
      "means": "The base estimate plus your chosen buffer.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Reserve {total} for the batch: {base} of estimated work and {extra} of buffer."
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
    "A buffer is an allowance, rather than a confidence interval. Re-estimate tasks with different scopes separately."
  ],
  "fixedCurrency": "$"
};
