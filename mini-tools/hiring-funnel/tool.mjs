// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "hiring-funnel",
  "name": "Hiring volume planner",
  "short": "Hiring volume planner",
  "headline": "Hiring volume planner",
  "summary": "Set your hiring goal and the share passing each stage. Estimate applications, interviews and offers needed.",
  "question": "How many applications, interviews and offers might our hiring goal need?",
  "category": "hr",
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
      "id": "hires",
      "label": "Hires you need",
      "unit": "count",
      "example": 3,
      "min": 0,
      "max": 10000,
      "step": 1,
      "integer": true,
      "help": "The number of accepted starts you are planning for.",
      "where": "Your hiring plan.",
      "tools": []
    },
    {
      "id": "accept",
      "label": "Share of offers accepted",
      "unit": "percent",
      "example": 75,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Use your actual recent acceptance rate.",
      "where": "Your recruitment records.",
      "tools": []
    },
    {
      "id": "offer",
      "label": "Share of interviews receiving an offer",
      "unit": "percent",
      "example": 25,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Use complete interview processes, rather than each round.",
      "where": "Your recruitment records.",
      "tools": []
    },
    {
      "id": "interview",
      "label": "Share of applicants reaching interview",
      "unit": "percent",
      "example": 20,
      "min": 0,
      "max": 100,
      "step": 0.1,
      "integer": false,
      "help": "Use the same role or a comparable hiring process.",
      "where": "Your applicant tracking system.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "offers",
      "label": "Offers to plan for",
      "unit": "count",
      "formula": "IF(hires = 0, 0, IF(accept > 0, ROUNDUP(hires / (accept / 100), 0), NA()))",
      "sum": "{hires} ÷ acceptance share, rounded up = {=}",
      "means": "Offers are rounded up to whole people.",
      "none": "A positive acceptance rate is needed"
    },
    {
      "id": "interviews",
      "label": "Interviews to plan for",
      "unit": "count",
      "formula": "IF(hires = 0, 0, IF(AND(HAS(offers), offer > 0), ROUNDUP(offers / (offer / 100), 0), NA()))",
      "sum": "{offers} ÷ offer share, rounded up = {=}",
      "means": "Complete interview processes needed at the entered offer rate.",
      "none": "Not enough data"
    },
    {
      "id": "applicants",
      "label": "Applicants to plan for",
      "unit": "count",
      "formula": "IF(hires = 0, 0, IF(AND(HAS(interviews), interview > 0), ROUNDUP(interviews / (interview / 100), 0), NA()))",
      "sum": "{interviews} ÷ interview share, rounded up = {=}",
      "means": "A planning count. It cannot promise enough people with the skills you need.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "if": "hires = 0",
        "text": "With no planned hires, this funnel needs no applicants."
      },
      {
        "if": "NOT(HAS(applicants))",
        "text": "Each stage needs a rate above zero to estimate a path to the planned hires."
      },
      {
        "text": "Plan for about {applicants} applicants, {interviews} interviews and {offers} offers to reach {hires} hires."
      }
    ]
  ],
  "next": [
    {
      "slug": "culture-fit-hiring-planner",
      "why": "Build a hiring plan with evidence and clear checks."
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
    "Past rates can change by role and hiring conditions. These stage totals round up at each handoff."
  ],
  "fixedCurrency": "$"
};
