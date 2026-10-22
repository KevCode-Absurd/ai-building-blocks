// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "split-bill",
  "name": "Split a shared bill with tip and charges",
  "short": "Split a bill",
  "headline": "Split a shared bill with tip and charges",
  "summary": "Enter the bill, extra charges, tip and people. Get an equal per-person share and a rounded collection total.",
  "question": "Split a shared bill with tip and charges?",
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
      "id": "bill",
      "label": "Bill before extra charges",
      "unit": "money",
      "example": 180,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the amount you want to divide.",
      "where": "Your receipt.",
      "tools": []
    },
    {
      "id": "charges",
      "label": "Extra fixed charges",
      "unit": "money",
      "example": 20,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Any tax or service charge not already in the bill.",
      "where": "Your receipt.",
      "tools": []
    },
    {
      "id": "tip",
      "label": "Tip on the bill before charges",
      "unit": "percent",
      "example": 10,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "The tip applies only to the bill amount above. Use 0 if included.",
      "where": "Your chosen tip amount.",
      "tools": []
    },
    {
      "id": "people",
      "label": "People sharing equally",
      "unit": "count",
      "example": 6,
      "min": 1,
      "max": 10000,
      "step": 1,
      "integer": true,
      "help": "Each person pays the same share.",
      "where": "Your group.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "tipAmount",
      "label": "Tip amount",
      "unit": "money",
      "formula": "bill * tip / 100",
      "sum": "{bill} × {tip} = {=}",
      "means": "Tip calculated before the extra fixed charges.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Total to share",
      "unit": "money",
      "formula": "bill + charges + tipAmount",
      "sum": "{bill} + {charges} + {tipAmount} = {=}",
      "means": "The bill, charges and tip together.",
      "none": "Not enough data"
    },
    {
      "id": "perPerson",
      "label": "Each person pays, rounded up to cents",
      "unit": "money",
      "formula": "ROUNDUP(total / people, 2)",
      "sum": "{total} ÷ {people}, rounded up to cents = {=}",
      "means": "Rounds up so collecting the same amount from everyone covers the bill.",
      "none": "Not enough data"
    },
    {
      "id": "extra",
      "label": "Extra collected due to rounding",
      "unit": "money",
      "formula": "MAX(0, perPerson * people - total)",
      "sum": "{perPerson} × {people} − {total} = {=}",
      "means": "Return or allocate this small excess within your group.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Each person pays {perPerson}. The bill total is {total}, with {extra} extra collected from rounding."
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
    "The equal split uses two decimal places. Some currencies use a different smallest unit. Check whether the bill already includes a service charge before adding another tip."
  ]
};

