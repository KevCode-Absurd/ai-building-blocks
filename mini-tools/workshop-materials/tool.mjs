// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "workshop-materials",
  "name": "Workshop materials planner",
  "short": "Workshop materials planner",
  "headline": "Workshop materials planner",
  "summary": "Set attendees, items per person, spare allowance and pack size. Get whole packs, total items and cost.",
  "question": "How many whole packs cover our workshop and chosen spares?",
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
      "id": "people",
      "label": "People attending",
      "unit": "count",
      "example": 35,
      "min": 0,
      "max": 10000000,
      "step": 1,
      "integer": true,
      "help": "Count the people leading the session if they need supplies too.",
      "where": "Your registration list.",
      "tools": []
    },
    {
      "id": "each",
      "label": "Items needed per person",
      "unit": "count",
      "example": 2,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "For example, worksheets, cards or items used up during the session.",
      "where": "Your session plan.",
      "tools": []
    },
    {
      "id": "spare",
      "label": "Extra items as a share of the base",
      "unit": "percent",
      "example": 10,
      "min": 0,
      "max": 500,
      "step": 0.1,
      "integer": false,
      "help": "Your own allowance for late arrivals or mistakes.",
      "where": "Your event plan.",
      "tools": []
    },
    {
      "id": "pack",
      "label": "Items in each supplier pack",
      "unit": "count",
      "example": 25,
      "min": 1,
      "max": 1000000,
      "step": 1,
      "integer": true,
      "help": "Whole items per pack.",
      "where": "The supplier listing.",
      "tools": []
    },
    {
      "id": "price",
      "label": "Price per pack",
      "unit": "money",
      "example": 8,
      "min": 0,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the final pack price.",
      "where": "The supplier quote.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "needed",
      "label": "Items needed including spares",
      "unit": "count",
      "formula": "ROUNDUP(people * each * (1 + spare / 100), 0)",
      "sum": "{people} × {each} × (1 + {spare}), rounded up = {=}",
      "means": "Rounds the requirement up to whole items.",
      "none": "Not enough data"
    },
    {
      "id": "packs",
      "label": "Whole packs to order",
      "unit": "count",
      "formula": "ROUNDUP(needed / pack, 0)",
      "sum": "{needed} ÷ {pack}, rounded up = {=}",
      "means": "Only complete packs can be bought.",
      "none": "Not enough data"
    },
    {
      "id": "leftover",
      "label": "Items above the requirement",
      "unit": "count",
      "formula": "packs * pack - needed",
      "sum": "{packs} × {pack} − {needed} = {=}",
      "means": "Extra items created by pack-size rounding, beyond the spare allowance.",
      "none": "Not enough data"
    },
    {
      "id": "cost",
      "label": "Materials cost",
      "unit": "money",
      "formula": "packs * price",
      "sum": "{packs} × {price} = {=}",
      "means": "Before any separate delivery charge.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Order {packs} packs for {cost}. That covers {needed} required items with {leftover} more left from pack rounding."
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
    "This plans one material at a time. Run it again for materials with different quantities or pack sizes."
  ]
};
