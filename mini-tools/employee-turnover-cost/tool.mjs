// Original tool. All numbers shown are illustrative figures, not a real person’s results.
export default {
  "slug": "employee-turnover-cost",
  "name": "See the cost of replacing a team member",
  "short": "Employee turnover cost",
  "headline": "See the cost of replacing a team member",
  "summary": "Add hiring, cover, onboarding and ramp-up costs. Get a transparent replacement cost from your own assumptions.",
  "question": "See the cost of replacing a team member?",
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
      "id": "hiring",
      "label": "Recruitment and hiring cash cost",
      "unit": "money",
      "example": 3000,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Include recruiter fees, listings and assessments.",
      "where": "Hiring invoices and your recruitment budget.",
      "tools": []
    },
    {
      "id": "cover",
      "label": "Temporary cover or overtime cost",
      "unit": "money",
      "example": 2000,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Count only the extra cost during the vacancy.",
      "where": "Your cover plan and payroll.",
      "tools": []
    },
    {
      "id": "onboard",
      "label": "Manager and buddy hours",
      "unit": "hours",
      "example": 40,
      "min": 0,
      "max": 10000,
      "step": 0.1,
      "integer": false,
      "help": "Time spent helping the replacement get started.",
      "where": "Your onboarding plan.",
      "tools": []
    },
    {
      "id": "hourly",
      "label": "Employer cost of a support hour",
      "unit": "money",
      "example": 40,
      "min": 0,
      "max": 100000,
      "step": 0.1,
      "integer": false,
      "help": "The average cost of manager and buddy time.",
      "where": "Your finance team.",
      "tools": []
    },
    {
      "id": "ramp",
      "label": "Other measured ramp-up cost",
      "unit": "money",
      "example": 1500,
      "min": 0,
      "max": 10000000,
      "step": 0.1,
      "integer": false,
      "help": "Enter an evidenced estimate. Use 0 if you cannot support one.",
      "where": "Your own output or service records.",
      "tools": []
    }
  ],
  "outputs": [
    {
      "id": "support",
      "label": "Cost of onboarding support time",
      "unit": "money",
      "formula": "onboard * hourly",
      "sum": "{onboard} × {hourly} = {=}",
      "means": "Time spent by the people supporting the new starter.",
      "none": "Not enough data"
    },
    {
      "id": "cash",
      "label": "Hiring and cover cash cost",
      "unit": "money",
      "formula": "hiring + cover",
      "sum": "{hiring} + {cover} = {=}",
      "means": "The direct cash amounts you entered.",
      "none": "Not enough data"
    },
    {
      "id": "total",
      "label": "Total replacement cost estimate",
      "unit": "money",
      "formula": "cash + support + ramp",
      "sum": "{cash} + {support} + {ramp} = {=}",
      "means": "All four cost groups added once.",
      "none": "Not enough data"
    }
  ],
  "answer": [
    [
      {
        "text": "The replacement costs about {total}: {cash} in hiring and cover, {support} in support time, and {ramp} in other ramp-up cost."
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
    "Do not count the same hours in support time and ramp-up cost. This estimate does not prove an individual’s value or justify a staffing decision."
  ]
};
