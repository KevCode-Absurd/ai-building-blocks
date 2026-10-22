// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "print-image-size",
  "name": "Know how large your image can print",
  "short": "Print image size",
  "headline": "Know how large your image can print",
  "summary": "Enter image pixels and a chosen print density. See the print size in inches and centimetres.",
  "question": "Know how large your image can print?",
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
      "label": "Image width in pixels",
      "unit": "count",
      "example": 3600,
      "min": 1,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Use the original file, before a resize.",
      "where": "The image properties in your file manager.",
      "tools": []
    },
    {
      "id": "height",
      "label": "Image height in pixels",
      "unit": "count",
      "example": 2400,
      "min": 1,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Use the pixel height of the same file.",
      "where": "The image properties in your file manager.",
      "tools": []
    },
    {
      "id": "density",
      "label": "Chosen print pixels per inch",
      "unit": "number",
      "example": 300,
      "min": 1,
      "max": 2400,
      "step": 0.1,
      "integer": false,
      "help": "Ask your printer which density suits the material and viewing distance.",
      "where": "Your printer or print supplier.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "widthIn",
      "label": "Print width in inches",
      "unit": "number",
      "formula": "width / density",
      "sum": "{width} pixels ÷ {density} = {=}",
      "means": "The width at your chosen density, without adding pixels.",
      "none": "Not enough data"
    },
    {
      "id": "heightIn",
      "label": "Print height in inches",
      "unit": "number",
      "formula": "height / density",
      "sum": "{height} pixels ÷ {density} = {=}",
      "means": "The height at the same density.",
      "none": "Not enough data"
    },
    {
      "id": "widthCm",
      "label": "Print width in centimetres",
      "unit": "number",
      "formula": "widthIn * 2.54",
      "sum": "{widthIn} inches × 2.54 = {=}",
      "means": "One inch is 2.54 centimetres.",
      "none": "Not enough data"
    },
    {
      "id": "heightCm",
      "label": "Print height in centimetres",
      "unit": "number",
      "formula": "heightIn * 2.54",
      "sum": "{heightIn} inches × 2.54 = {=}",
      "means": "Size before any trim or bleed.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "At {density} pixels per inch, print up to {widthIn} × {heightIn} inches, or {widthCm} × {heightCm} cm."
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
    "This checks dimensions only. Sharpness, viewing distance, paper, bleed and colour still need a print proof."
  ],
  "fixedCurrency": "$"
};
