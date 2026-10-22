// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "reading-time",
  "name": "See how long your draft takes to read",
  "short": "Reading time",
  "headline": "See how long your draft takes to read",
  "summary": "Enter words, reading pace and any pause time. Get a duration for an article, speech or lesson.",
  "question": "See how long your draft takes to read?",
  "category": "design",
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
      "id": "words",
      "label": "Words in the draft",
      "unit": "count",
      "example": 1200,
      "min": 0,
      "max": 10000000,
      "step": 1,
      "integer": true,
      "help": "Use the actual draft word count.",
      "where": "The word count in your writing app.",
      "tools": []
    },
    {
      "id": "pace",
      "label": "Words read or spoken each minute",
      "unit": "number",
      "example": 200,
      "min": 1,
      "max": 1000,
      "step": 0.1,
      "integer": false,
      "help": "Time a sample for your reader or speaker. Slower material needs a lower pace.",
      "where": "A timed sample of the draft.",
      "tools": []
    },
    {
      "id": "pause",
      "label": "Extra minutes for pauses or exercises",
      "unit": "number",
      "example": 2,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Add time for images, questions or practice.",
      "where": "Your agenda or a rehearsal.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "textMinutes",
      "label": "Minutes for the words",
      "unit": "number",
      "formula": "words / pace",
      "sum": "{words} ÷ {pace} = {=}",
      "means": "At the pace you entered.",
      "none": "Not enough data"
    },
    {
      "id": "totalMinutes",
      "label": "Total minutes including pauses",
      "unit": "number",
      "formula": "textMinutes + pause",
      "sum": "{textMinutes} + {pause} = {=}",
      "means": "The estimated complete duration.",
      "none": "Not enough data"
    },
    {
      "id": "hourTotal",
      "label": "Total duration in hours",
      "unit": "hours",
      "formula": "totalMinutes / 60",
      "sum": "{totalMinutes} ÷ 60 = {=}",
      "means": "Useful for longer lessons or scripts.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "The words take about {textMinutes} minutes. With pauses, allow {totalMinutes} minutes in total."
      }
    ]
  ],
  "next": [
    {
      "slug": "landing-page-design-planner",
      "why": "Turn your layout requirements into a design plan you can use."
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
    "The pace is your assumption. This is a duration estimate, rather than a measure of how well a reader understands the draft."
  ],
  "fixedCurrency": "$"
};
