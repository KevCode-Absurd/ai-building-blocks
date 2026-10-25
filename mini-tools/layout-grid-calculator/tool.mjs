// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "layout-grid-calculator",
  "name": "Layout column calculator",
  "short": "Layout column calculator",
  "headline": "Layout column calculator",
  "summary": "Set the page width, margins, gaps and columns. See each column width and whether the grid fits.",
  "question": "How wide can each column be within my page?",
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
      "id": "page",
      "label": "Page or container width in pixels",
      "unit": "number",
      "example": 1200,
      "min": 1,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "The full width before side margins.",
      "where": "Your design canvas or browser layout.",
      "tools": []
    },
    {
      "id": "margin",
      "label": "Margin on each side in pixels",
      "unit": "number",
      "example": 48,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "The same margin is used on the left and right.",
      "where": "The layout spacing in your design.",
      "tools": []
    },
    {
      "id": "columns",
      "label": "Number of columns",
      "unit": "count",
      "example": 12,
      "min": 1,
      "max": 100,
      "step": 1,
      "integer": true,
      "help": "Equal width columns in the grid.",
      "where": "Your layout plan.",
      "tools": []
    },
    {
      "id": "gap",
      "label": "Gap between columns in pixels",
      "unit": "number",
      "example": 24,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "There is one fewer gap than columns.",
      "where": "Your layout spacing.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "usable",
      "label": "Width after side margins in pixels",
      "unit": "number",
      "formula": "MAX(0, page - margin * 2)",
      "sum": "{page} − 2 × {margin}, with zero as the floor = {=}",
      "means": "Space inside the two side margins.",
      "none": "Not enough data"
    },
    {
      "id": "gaps",
      "label": "Width used by gaps in pixels",
      "unit": "number",
      "formula": "(columns - 1) * gap",
      "sum": "({columns} − 1) × {gap} = {=}",
      "means": "All the gaps together.",
      "none": "Not enough data"
    },
    {
      "id": "column",
      "label": "Each column width in pixels",
      "unit": "number",
      "formula": "IF(page > margin * 2 + gaps, (page - margin * 2 - gaps) / columns, NA())",
      "sum": "({page} − 2 × {margin} − {gaps}) ÷ {columns} = {=}",
      "means": "A blank answer means the margins and gaps leave no room for columns.",
      "none": "Grid does not fit"
    }
  ],
  "answer": [
    [
      {
        "if": "NOT(HAS(column))",
        "text": "The margins and gaps use the full page width. Reduce them or use fewer columns."
      },
      {
        "text": "Each of your {columns} columns is {column} pixels wide, with {gap} pixels between them."
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
    "Fractional pixel widths can be valid in browser layouts. Check how your design tool rounds them."
  ],
  "fixedCurrency": "$"
};
