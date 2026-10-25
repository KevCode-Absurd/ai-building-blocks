// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "data-retention-storage",
  "name": "Data retention storage estimate",
  "short": "Data retention storage estimate",
  "headline": "Data retention storage estimate",
  "summary": "Enter daily records, average size, days kept and copies. Estimate storage once the full period is filled, plus monthly storage cost.",
  "question": "How much storage does our chosen record-keeping period need?",
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
      "id": "records",
      "label": "New records each day",
      "unit": "count",
      "example": 10000,
      "min": 0,
      "max": 1000000000,
      "step": 1,
      "integer": true,
      "help": "Use the average volume at the stage you want to plan for.",
      "where": "Your system usage report.",
      "tools": []
    },
    {
      "id": "size",
      "label": "Average record size in kilobytes",
      "unit": "number",
      "example": 20,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "Use stored size after any expected compression.",
      "where": "A sample of stored records.",
      "tools": []
    },
    {
      "id": "days",
      "label": "Chosen retention period in days",
      "unit": "count",
      "example": 365,
      "min": 0,
      "max": 36500,
      "step": 1,
      "integer": true,
      "help": "Enter an approved period. The tool does not choose one.",
      "where": "Your approved retention schedule.",
      "tools": []
    },
    {
      "id": "copies",
      "label": "Total retained copies",
      "unit": "count",
      "example": 3,
      "min": 1,
      "max": 1000,
      "step": 1,
      "integer": true,
      "help": "Include the primary copy plus replicas or backups counted here.",
      "where": "Your storage architecture.",
      "tools": []
    },
    {
      "id": "price",
      "label": "Cost per gigabyte per month",
      "unit": "money",
      "example": 0.02,
      "min": 0,
      "max": 100000,
      "step": 0.001,
      "integer": false,
      "help": "Use the storage provider price for this class.",
      "where": "Your current provider quote.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "one",
      "label": "Gigabytes for one full retained copy",
      "unit": "number",
      "formula": "records * size * days / 1000000",
      "sum": "{records} × {size} × {days} ÷ 1,000,000 = {=}",
      "means": "Uses decimal storage units and assumes old records are deleted on time.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Gigabytes across all copies",
      "unit": "number",
      "formula": "one * copies",
      "sum": "{one} × {copies} = {=}",
      "means": "Full-size retained copies at steady state.",
      "none": "Not enough data"
    },
    {
      "id": "monthly",
      "label": "Estimated monthly storage charge",
      "unit": "money",
      "formula": "total * price",
      "sum": "{total} × {price} = {=}",
      "means": "Storage only at your entered unit price.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "At the chosen {days}-day retention period, allow {total} GB across {copies} copies, costing about {monthly} a month for storage."
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
    "This estimates storage, not how long records should be kept. Your policy must cover the rules that apply, consent, records that must stay for a legal case and deletion. Indexes, logs, old versions, requests and transfer charges are not counted."
  ]
};
