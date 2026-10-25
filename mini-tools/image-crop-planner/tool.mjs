// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "image-crop-planner",
  "name": "Image crop planner",
  "short": "Image crop planner",
  "headline": "Image crop planner",
  "summary": "Enter the source size and target shape. Get the largest crop and the share of pixels removed.",
  "question": "How much of this image will a new shape remove?",
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
      "id": "width",
      "label": "Source width in pixels",
      "unit": "count",
      "example": 4000,
      "min": 1,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Use the image before cropping.",
      "where": "The original image properties.",
      "tools": []
    },
    {
      "id": "height",
      "label": "Source height in pixels",
      "unit": "count",
      "example": 3000,
      "min": 1,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "The height of the same source.",
      "where": "The original image properties.",
      "tools": []
    },
    {
      "id": "ratioW",
      "label": "Target shape width",
      "unit": "number",
      "example": 16,
      "min": 1,
      "max": 1000,
      "step": 0.1,
      "integer": false,
      "help": "For a 16:9 shape, enter 16 here and 9 below.",
      "where": "The size required by your page or platform.",
      "tools": []
    },
    {
      "id": "ratioH",
      "label": "Target shape height",
      "unit": "number",
      "example": 9,
      "min": 1,
      "max": 1000,
      "step": 0.1,
      "integer": false,
      "help": "For a square, enter 1 in both shape fields.",
      "where": "The size required by your page or platform.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "cropW",
      "label": "Largest crop width in pixels",
      "unit": "number",
      "formula": "MIN(width, height * ratioW / ratioH)",
      "sum": "Smaller of {width} and {height} × {ratioW} ÷ {ratioH} = {=}",
      "means": "A geometric fit before rounding to whole pixels.",
      "none": "Not enough data"
    },
    {
      "id": "cropH",
      "label": "Largest crop height in pixels",
      "unit": "number",
      "formula": "cropW * ratioH / ratioW",
      "sum": "{cropW} × {ratioH} ÷ {ratioW} = {=}",
      "means": "Move this crop box to keep the subject in frame.",
      "none": "Not enough data"
    },
    {
      "id": "removed",
      "label": "Pixels removed",
      "unit": "percent",
      "formula": "(1 - cropW * cropH / (width * height)) * 100",
      "sum": "Share outside the {cropW} × {cropH} crop = {=}",
      "means": "The share of the source image area lost.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "A {ratioW}:{ratioH} crop keeps {cropW} × {cropH} pixels and removes {removed} of the image area."
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
    "The crop box is a size guide. It does not find faces or decide which part of a picture to keep. Round crop dimensions to whole pixels in your editor."
  ],
  "fixedCurrency": "$"
};
