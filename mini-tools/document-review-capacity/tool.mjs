// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "document-review-capacity",
  "name": "Budget time for a document review queue",
  "short": "Document review capacity",
  "headline": "Budget time for a document review queue",
  "summary": "Enter documents, review time, rework and reviewer hours. See the effort, capacity and hours still needed.",
  "question": "Budget time for a document review queue?",
  "category": "compliance",
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
      "id": "documents",
      "label": "Documents to review",
      "unit": "count",
      "example": 120,
      "min": 0,
      "max": 10000000,
      "step": 1,
      "integer": true,
      "help": "Count the documents in this review batch.",
      "where": "Your review register.",
      "tools": []
    },
    {
      "id": "minutes",
      "label": "First review minutes per document",
      "unit": "number",
      "example": 15,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Use an average from similar completed reviews.",
      "where": "A timed sample or review log.",
      "tools": []
    },
    {
      "id": "rework",
      "label": "Share needing a second review",
      "unit": "percent",
      "example": 20,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Your observed share, or an explicit planning assumption.",
      "where": "Your previous review records.",
      "tools": []
    },
    {
      "id": "second",
      "label": "Minutes for each second review",
      "unit": "number",
      "example": 10,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Extra reviewer time after revisions.",
      "where": "Your review log.",
      "tools": []
    },
    {
      "id": "available",
      "label": "Reviewer hours available",
      "unit": "hours",
      "example": 30,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Across everyone assigned to this batch.",
      "where": "The reviewers’ calendar.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "extra",
      "label": "Expected second-review documents",
      "unit": "number",
      "formula": "documents * rework / 100",
      "sum": "{documents} × {rework} = {=}",
      "means": "An expected volume, which can be fractional.",
      "none": "Not enough data"
    },
    {
      "id": "needed",
      "label": "Total reviewer hours needed",
      "unit": "hours",
      "formula": "(documents * minutes + extra * second) / 60",
      "sum": "({documents} × {minutes} + {extra} × {second}) ÷ 60 = {=}",
      "means": "First and expected second reviews combined.",
      "none": "Not enough data"
    },
    {
      "id": "gap",
      "label": "Reviewer hours still needed",
      "unit": "hours",
      "formula": "MAX(0, needed - available)",
      "sum": "{needed} − {available}, with zero as the floor = {=}",
      "means": "Capacity to add or scope to reschedule.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "This batch needs about {needed} of review time, including {extra} second reviews. You need {gap} beyond the hours available."
      }
    ]
  ],
  "next": [
    {
      "slug": "checklist-upkeep-planner",
      "why": "Give each review checklist an owner and a date to check it again."
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
    "This schedules review effort. It does not assess compliance, replace qualified review or establish a legal deadline."
  ],
  "fixedCurrency": "$"
};
