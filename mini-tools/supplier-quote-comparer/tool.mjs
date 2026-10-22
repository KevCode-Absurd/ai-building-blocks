// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "supplier-quote-comparer",
  "name": "Compare supplier quotes at the same order size",
  "short": "Supplier quote comparer",
  "headline": "Compare supplier quotes at the same order size",
  "summary": "Enter two unit prices, shipping, setup and quantity. See delivered totals and the difference per unit.",
  "question": "Compare supplier quotes at the same order size?",
  "category": "operations",
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
      "id": "quantity",
      "label": "Units to buy",
      "unit": "count",
      "example": 500,
      "min": 1,
      "max": 100000000,
      "step": 1,
      "integer": true,
      "help": "Compare quotes for the same usable quantity.",
      "where": "Your purchase plan.",
      "tools": []
    },
    {
      "id": "unitA",
      "label": "Supplier A unit price",
      "unit": "money",
      "example": 8,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the quoted price after discounts.",
      "where": "Supplier A’s quote.",
      "tools": []
    },
    {
      "id": "fixedA",
      "label": "Supplier A shipping and setup",
      "unit": "money",
      "example": 200,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "All fixed costs for this order.",
      "where": "Supplier A’s quote.",
      "tools": []
    },
    {
      "id": "unitB",
      "label": "Supplier B unit price",
      "unit": "money",
      "example": 7.5,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the same currency and tax basis as supplier A.",
      "where": "Supplier B’s quote.",
      "tools": []
    },
    {
      "id": "fixedB",
      "label": "Supplier B shipping and setup",
      "unit": "money",
      "example": 600,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "All fixed costs for this order.",
      "where": "Supplier B’s quote.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "totalA",
      "label": "Supplier A total",
      "unit": "money",
      "formula": "quantity * unitA + fixedA",
      "sum": "{quantity} × {unitA} + {fixedA} = {=}",
      "means": "Total for the order from supplier A.",
      "none": "Not enough data"
    },
    {
      "id": "totalB",
      "label": "Supplier B total",
      "unit": "money",
      "formula": "quantity * unitB + fixedB",
      "sum": "{quantity} × {unitB} + {fixedB} = {=}",
      "means": "Total for the same quantity from supplier B.",
      "none": "Not enough data"
    },
    {
      "id": "difference",
      "label": "Supplier B cost minus supplier A",
      "unit": "money",
      "formula": "totalB - totalA",
      "sum": "{totalB} − {totalA} = {=}",
      "means": "Positive means A costs less. Negative means B costs less.",
      "none": "Not enough data"
    },
    {
      "id": "perUnit",
      "label": "Cost difference per unit",
      "unit": "money",
      "formula": "difference / quantity",
      "sum": "{difference} ÷ {quantity} = {=}",
      "means": "The price difference spread across the same number of units.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "if": "difference > 0",
        "text": "Supplier A costs {totalA}, which is {difference} less than supplier B for this order."
      },
      {
        "if": "difference < 0",
        "text": "Supplier B costs {totalB}, which is {difference:abs} less than supplier A for this order."
      },
      {
        "text": "Both quotes cost {totalA} at this order size."
      }
    ]
  ],
  "next": [
    {
      "slug": "repeat-chore-automation-planner",
      "why": "Turn repeated work into a process someone else can follow."
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
    "Compare quality, delivery, currency, duties and payment terms separately. Add non-recoverable taxes and all fixed costs on the same basis."
  ]
};
