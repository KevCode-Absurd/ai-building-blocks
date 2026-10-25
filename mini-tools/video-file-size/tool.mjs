// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "video-file-size",
  "name": "Video storage estimate",
  "short": "Video storage estimate",
  "headline": "Video storage estimate",
  "summary": "Enter video length, file count and the rates used to save sound and picture data. Estimate the storage needed in gigabytes.",
  "question": "How much storage will these video exports need?",
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
      "id": "video",
      "label": "Video bitrate in megabits per second",
      "unit": "number",
      "example": 20,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Use the average target bitrate from export settings.",
      "where": "The export settings in your video editor.",
      "tools": []
    },
    {
      "id": "audio",
      "label": "Audio bitrate in kilobits per second",
      "unit": "number",
      "example": 192,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Use 0 for silent video.",
      "where": "The audio export settings.",
      "tools": []
    },
    {
      "id": "minutes",
      "label": "Length of each video in minutes",
      "unit": "number",
      "example": 10,
      "min": 0,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "Include the complete exported duration.",
      "where": "Your video timeline.",
      "tools": []
    },
    {
      "id": "files",
      "label": "Number of videos of this length",
      "unit": "count",
      "example": 12,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "For mixed lengths, use the average length.",
      "where": "Your export list.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "combined",
      "label": "Combined bitrate in megabits per second",
      "unit": "number",
      "formula": "video + audio / 1000",
      "sum": "{video} + {audio} ÷ 1000 = {=}",
      "means": "Video plus audio bitrate.",
      "none": "Not enough data"
    },
    {
      "id": "perFile",
      "label": "Estimated gigabytes per video",
      "unit": "number",
      "formula": "combined * minutes * 60 / 8 / 1000",
      "sum": "{combined} × {minutes} × 60 ÷ 8 ÷ 1000 = {=}",
      "means": "Uses decimal gigabytes, where one GB is 1,000 MB.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Estimated gigabytes for all videos",
      "unit": "number",
      "formula": "perFile * files",
      "sum": "{perFile} × {files} = {=}",
      "means": "Space for one copy of every export.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "Allow about {perFile} GB per video and {total} GB for {files} exports at these bitrates."
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
    "Container overhead and variable bitrate can change the final size. Keep extra room for source footage and backups."
  ],
  "fixedCurrency": "$"
};
