// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "backlog-clearance",
  "name": "Backlog clearance estimate",
  "short": "Backlog clearance estimate",
  "headline": "Backlog clearance estimate",
  "summary": "Enter waiting work, new arrivals and daily completions. See whether the queue can shrink and estimate days to clear it.",
  "question": "Can our daily capacity clear the backlog while new work arrives?",
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
      "id": "backlog",
      "label": "Items currently waiting",
      "unit": "count",
      "example": 300,
      "min": 0,
      "max": 100000000,
      "step": 1,
      "integer": true,
      "help": "Outstanding items at the start of the period.",
      "where": "Your queue report.",
      "tools": []
    },
    {
      "id": "incoming",
      "label": "New items arriving each working day",
      "unit": "number",
      "example": 40,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the average from a normal period of work.",
      "where": "Your recent queue history.",
      "tools": []
    },
    {
      "id": "done",
      "label": "Items completed each working day",
      "unit": "number",
      "example": 60,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Completed items after checking, not merely started.",
      "where": "Your recent completion history.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "net",
      "label": "Daily capacity left for the backlog",
      "unit": "number",
      "formula": "done - incoming",
      "sum": "{done} − {incoming} = {=}",
      "means": "Positive means the queue can shrink.",
      "none": "Not enough data"
    },
    {
      "id": "days",
      "label": "Working days to clear the backlog",
      "unit": "count",
      "formula": "IF(backlog = 0, IF(done >= incoming, 0, NA()), IF(net > 0, ROUNDUP(backlog / net, 0), NA()))",
      "sum": "{backlog} ÷ {net}, rounded up = {=}",
      "means": "Assumes new arrivals and completion stay at these averages.",
      "none": "Backlog will not clear"
    },
    {
      "id": "growth",
      "label": "Daily queue growth if capacity is short",
      "unit": "number",
      "formula": "MAX(0, incoming - done)",
      "sum": "{incoming} − {done}, with zero as the floor = {=}",
      "means": "Items added to the waiting queue each working day.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "if": "growth > 0",
        "text": "The queue grows by {growth} items each working day. It will not clear at this completion rate."
      },
      {
        "if": "NOT(HAS(days))",
        "text": "You complete only the new arrivals. The existing backlog will not shrink."
      },
      {
        "text": "The queue shrinks by {net} items each working day and should clear in about {days} working days."
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
    "Daily averages hide peaks and uneven item sizes. Recheck after capacity changes, and include review or rework in the completion rate."
  ],
  "fixedCurrency": "$"
};
