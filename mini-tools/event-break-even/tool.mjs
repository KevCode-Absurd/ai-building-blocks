// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "event-break-even",
  "name": "Find how many tickets cover your event costs",
  "short": "Event break-even",
  "headline": "Find how many tickets cover your event costs",
  "summary": "Enter fixed costs, ticket price, fees and per-person costs. See break-even attendance and profit at your expected turnout.",
  "question": "Find how many tickets cover your event costs?",
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
      "id": "fixed",
      "label": "Fixed event cost",
      "unit": "money",
      "example": 3000,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "Venue, equipment, speakers and other costs that do not change per guest.",
      "where": "Your event budget.",
      "tools": []
    },
    {
      "id": "price",
      "label": "Ticket selling price",
      "unit": "money",
      "example": 50,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the same currency as all costs.",
      "where": "Your ticket plan.",
      "tools": []
    },
    {
      "id": "fees",
      "label": "Ticket fee as a share of selling price",
      "unit": "percent",
      "example": 5,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Fees you pay, rather than charges added to the customer’s bill.",
      "where": "Your ticket provider terms.",
      "tools": []
    },
    {
      "id": "variable",
      "label": "Cost per attendee",
      "unit": "money",
      "example": 15,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Food, materials and other attendance-based costs.",
      "where": "Your supplier quotes.",
      "tools": []
    },
    {
      "id": "attendees",
      "label": "Expected paid attendees",
      "unit": "count",
      "example": 100,
      "min": 0,
      "max": 10000000,
      "step": 1,
      "integer": true,
      "help": "Paid tickets, excluding free guests whose costs need adding elsewhere.",
      "where": "Your attendance plan.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "contribution",
      "label": "Contribution from each paid ticket",
      "unit": "money",
      "formula": "price * (1 - fees / 100) - variable",
      "sum": "{price} × (1 − {fees}) − {variable} = {=}",
      "means": "Ticket proceeds after percentage fees and per-person costs.",
      "none": "Not enough data"
    },
    {
      "id": "breakEven",
      "label": "Paid tickets needed to break even",
      "unit": "count",
      "formula": "IF(fixed = 0, IF(contribution >= 0, 0, NA()), IF(contribution > 0, ROUNDUP(fixed / contribution, 0), NA()))",
      "sum": "{fixed} ÷ {contribution}, rounded up = {=}",
      "means": "A blank means ticket contribution cannot cover the costs.",
      "none": "No break-even at this price"
    },
    {
      "id": "profit",
      "label": "Profit at expected attendance",
      "unit": "money",
      "formula": "attendees * contribution - fixed",
      "sum": "{attendees} × {contribution} − {fixed} = {=}",
      "means": "Before tax and any costs left out of the inputs.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "if": "NOT(HAS(breakEven))",
        "text": "Each ticket contributes {contribution}. The costs cannot be recovered at this ticket price and fee structure."
      },
      {
        "text": "You need {breakEven} paid tickets to break even. At {attendees} attendees, the estimated profit is {profit}."
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
    "Include fixed per-ticket fees inside the per-attendee cost. Capacity, refunds, taxes, sponsorship and free-guest costs need separate planning."
  ]
};
