// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "invoice-payment-fees",
  "name": "Price an invoice to receive your target after fees",
  "short": "Payment fee gross-up",
  "headline": "Price an invoice to receive your target after fees",
  "summary": "Enter the amount you need to receive, percentage fee and fixed fee. See the gross charge and fees.",
  "question": "Price an invoice to receive your target after fees?",
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
      "label": "Net amount you want to receive",
      "unit": "money",
      "example": 1000,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "The amount after the entered transaction fees.",
      "where": "Your invoice or pricing target.",
      "tools": []
    },
    {
      "id": "rate",
      "label": "Processor fee as a share of the charge",
      "unit": "percent",
      "example": 3,
      "min": 0,
      "max": 99,
      "step": 0.1,
      "integer": false,
      "help": "Use the actual rate for this payment method.",
      "where": "Your processor’s current fee schedule.",
      "tools": []
    },
    {
      "id": "fixed",
      "label": "Fixed transaction fee",
      "unit": "money",
      "example": 0.3,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "The fixed fee charged once for this payment.",
      "where": "Your processor’s current fee schedule.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "charge",
      "label": "Charge needed, rounded up to cents",
      "unit": "money",
      "formula": "ROUNDUP((target + fixed) / (1 - rate / 100), 2)",
      "sum": "({target} + {fixed}) ÷ (1 − {rate}), rounded up = {=}",
      "means": "Rounds up so the modelled net is at least the target.",
      "none": "Not enough data"
    },
    {
      "id": "fee",
      "label": "Estimated transaction fee",
      "unit": "money",
      "formula": "charge * rate / 100 + fixed",
      "sum": "{charge} × {rate} + {fixed} = {=}",
      "means": "Percentage fee plus the fixed fee, before processor rounding.",
      "none": "Not enough data"
    },
    {
      "id": "net",
      "label": "Net received before processor rounding",
      "unit": "money",
      "formula": "charge - fee",
      "sum": "{charge} − {fee} = {=}",
      "means": "Actual processor rounding can change the result by a small amount.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Charge {charge} to receive about {net} after {fee} in transaction fees."
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
    "This models one payment with a percentage fee and fixed charge. It does not determine whether a surcharge is allowed; check your contract and applicable rules before changing a customer’s charge."
  ]
};

