# Journey map schema (ai-blocks-journey/1)

One JSON file per job family: `marketplace/knowledge/<vertical>/journeys/<id>.json`. The pack build renders each to `journeys/<id>.md` for the agent. The schema is the same for every vertical; only the content changes.

A journey map is what a senior expert carries in their head for one kind of job: what to find out, what data settles which question, which hypotheses to test, which choices to offer the owner, which skill makes each piece, and what to check before it ships. It is not a script to read out.

```json
{
  "schema": "ai-blocks-journey/1",
  "id": "creatives",
  "name": "Ad creatives (static, carousel, video concepts)",
  "vertical": "ecommerce",
  "asked_as": ["make me 10 creatives", "new ads for our bestsellers", "static ads for Diwali"],
  "lead_agents": ["<persona id>"],
  "outcome": "What done looks like, in the owner's terms (one or two sentences).",
  "first_principles": ["3 to 6 lines: how a top expert thinks about this job, the real levers, common traps."],

  "goal": {
    "questions": [
      {
        "id": "scope",
        "ask": "Is this for one product, your bestsellers, or the range?",
        "why": "What it changes in the work.",
        "options": [
          {"label": "Bestsellers", "pro": "...", "con": "..."},
          {"label": "One product", "pro": "...", "con": "..."},
          {"label": "The range", "pro": "...", "con": "..."}
        ],
        "default": "Bestsellers by revenue in the ad data",
        "skip_if": ["brief names a product", "data shows one product is most of revenue"],
        "settle_with_data": "How to settle it from data instead of asking, when possible."
      }
    ]
  },

  "gather": {
    "brand_brain": "required | helpful | not_needed",
    "sources": [{"what": "Past ads and their results", "why": "...", "where": "Meta connector or export", "ask_if_missing": "...", "fallback": "Meta Ad Library (public)"}],
    "setup": [
      {"need": "Image making", "why": "...", "check": "how to tell if they have it",
       "options": [{"label": "HTML design with real product photos", "pro": "no key, exact fonts, real products", "con": "no AI scenes"},
                   {"label": "OpenAI image key", "pro": "...", "con": "cost per image; never draws text or products"}],
       "default": "HTML design with real product photos"}
    ],
    "data_map": [{"question": "Which segment pays best?", "data": "Spend and revenue by age, gender, region, placement", "where": "Meta connector / export", "tool": "node tools/find-insights.mjs <folder>", "if_missing": "what the work rests on instead"}]
  },

  "diagnose": {
    "tools": ["node tools/find-insights.mjs <export> --margin <m>", "..."],
    "look_for": ["Concrete patterns a senior looks for in this job, each one line."],
    "hypothesis_patterns": [
      {"pattern": "An underfunded segment", "evidence": "revenue share well above spend share, 15+ purchases", "bet": "Own creative and budget for it"}
    ]
  },

  "choose": {
    "decisions": [
      {"id": "novelty", "ask": "How different should these be from what runs now?",
       "options": [{"label": "Like your winners", "pro": "...", "con": "...", "when": "..."},
                   {"label": "A mix (my usual pick)", "pro": "...", "con": "...", "when": "..."},
                   {"label": "All new formats", "pro": "...", "con": "...", "when": "..."}],
       "recommend": "How to pick the recommendation from the diagnosis."}
    ]
  },

  "make": {
    "pieces": [{"piece": "Static ads", "skill": "<skill slug from knowledge/<vertical>/skills>", "when": "...", "variety": "how to get real range"}],
    "formats": "formats.json ids to offer, if this job makes creative",
    "rules": ["Job-specific craft rules a senior never breaks (each one line)."]
  },

  "check": {
    "preflight": ["node tools/preflight-meta.mjs <plan.json>", "..."],
    "checks": ["node tools/quality/consistency-check.mjs context/hypotheses.json <deliverable>", "..."],
    "senior_review": ["Questions a senior asks before it ships, each one line."]
  },

  "knowledge": {
    "diagnose": {"modules": ["ADC", "MEA"], "ask": ["Questions to send to prepare-job / ask-knowledge at this stage"]},
    "make": {"modules": ["MCR"], "ask": ["..."]},
    "check": {"modules": ["ADC"], "ask": ["platform specs and policy questions"]},
    "never": ["Brand voice and facts come from the org context, never the library."]
  },

  "handover": {
    "files": ["What the owner gets, as files they can use (e.g. Meta bulk sheet, HTML email, PNGs)."],
    "next_moves": ["2 to 4 one-line next steps to offer"]
  }
}
```

## Rules for writing a journey

- Write for an expert agent, in plain words. No filler.
- Questions pass the question rubric (GUIDE.md): changes the work, can't be found, has a default, has options, one-word answer. Prefer `settle_with_data` over asking.
- At most 4 goal questions and 2 decisions per journey; the guide asks at most 3 at a time.
- Every `skill` must be a real slug in `marketplace/knowledge/ecommerce/skills/` (or `catalogue-items/...` item id). Every module code must exist in `knowledge/ecommerce/cards/`.
- `first_principles` and `look_for` hold the expert depth: the real constraints (profit per order, learning-phase volume, the funnel step with the biggest drop), not generic best practice.
- Never name a real brand's numbers in a journey. Journeys are reusable across stores.
