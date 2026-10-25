// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "leave-coverage",
  "name": "Team leave coverage checker",
  "short": "Team leave coverage checker",
  "headline": "Team leave coverage checker",
  "summary": "Enter team size, planned leave and minimum cover. See spare cover or the number of people short.",
  "question": "Will enough people be available during this leave period?",
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
      "id": "team",
      "label": "People in the team",
      "unit": "count",
      "example": 12,
      "min": 1,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "People able to do the work in this period.",
      "where": "Your team roster.",
      "tools": []
    },
    {
      "id": "away",
      "label": "People away at the same time",
      "unit": "count",
      "example": 3,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Include other absences as well as holiday.",
      "where": "Your leave calendar.",
      "tools": []
    },
    {
      "id": "minimum",
      "label": "People needed for minimum cover",
      "unit": "count",
      "example": 8,
      "min": 0,
      "max": 100000,
      "step": 1,
      "integer": true,
      "help": "Use the number needed for this shift or period.",
      "where": "Your staffing plan.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "present",
      "label": "People available",
      "unit": "count",
      "formula": "IF(away <= team, team - away, NA())",
      "sum": "{team} − {away} = {=}",
      "means": "People remaining after the planned absences.",
      "none": "Absences exceed team size"
    },
    {
      "id": "spare",
      "label": "People above minimum cover",
      "unit": "count",
      "formula": "IF(HAS(present), MAX(0, present - minimum), NA())",
      "sum": "{present} − {minimum}, with zero as the floor = {=}",
      "means": "Additional absences this simple count could cover.",
      "none": "Not enough data"
    },
    {
      "id": "shortage",
      "label": "People below minimum cover",
      "unit": "count",
      "formula": "IF(HAS(present), MAX(0, minimum - present), NA())",
      "sum": "{minimum} − {present}, with zero as the floor = {=}",
      "means": "People to cover before this plan meets the minimum.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "if": "away > team",
        "text": "People away cannot exceed the team size. Check the counts before using this result."
      },
      {
        "if": "shortage > 0",
        "text": "You have {present} people available, which is {shortage} below minimum cover."
      },
      {
        "text": "You have {present} people available and {spare} above your minimum cover."
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
    "Cover also depends on skills, shift length and local working rules. Confirm those before approving leave."
  ],
  "fixedCurrency": "$"
};
