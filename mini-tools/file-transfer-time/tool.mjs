// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "file-transfer-time",
  "name": "Estimate how long an upload or backup will take",
  "short": "File transfer time",
  "headline": "Estimate how long an upload or backup will take",
  "summary": "Enter file size, transfer speed and expected efficiency. See the transfer time in minutes and hours.",
  "question": "Estimate how long an upload or backup will take?",
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
      "id": "size",
      "label": "Total transfer size in gigabytes",
      "unit": "number",
      "example": 50,
      "min": 0,
      "max": 100000000,
      "step": 0.1,
      "integer": false,
      "help": "Use the total bytes to send, not compressed size unless already compressed.",
      "where": "Your file properties or backup job report.",
      "tools": []
    },
    {
      "id": "speed",
      "label": "Connection speed in megabits per second",
      "unit": "number",
      "example": 100,
      "min": 0.001,
      "max": 1000000,
      "step": 0.1,
      "integer": false,
      "help": "Use upload speed for uploads and download speed for downloads.",
      "where": "A recent speed test or transfer report.",
      "tools": []
    },
    {
      "id": "efficiency",
      "label": "Expected share of that speed achieved",
      "unit": "percent",
      "example": 80,
      "min": 0.1,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Allow for overhead and contention. Use a measured value when possible.",
      "where": "Your observed transfer rate.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "effective",
      "label": "Effective megabits per second",
      "unit": "number",
      "formula": "speed * efficiency / 100",
      "sum": "{speed} × {efficiency} = {=}",
      "means": "The usable speed under your assumption.",
      "none": "Not enough data"
    },
    {
      "id": "minutes",
      "label": "Transfer time in minutes",
      "unit": "number",
      "formula": "size * 8000 / effective / 60",
      "sum": "{size} × 8,000 ÷ {effective} ÷ 60 = {=}",
      "means": "Decimal GB and Mbps. One byte contains eight bits.",
      "none": "Not enough data"
    },
    {
      "id": "hours",
      "label": "Transfer time in hours",
      "unit": "hours",
      "formula": "minutes / 60",
      "sum": "{minutes} ÷ 60 = {=}",
      "means": "Continuous transfer at the assumed speed.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "At an effective {effective} Mbps, allow about {minutes} minutes, or {hours}, for this transfer."
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
    "Small-file overhead, retries, pauses, provider throttling and encryption may add time. This does not test your connection."
  ],
  "fixedCurrency": "$"
};
