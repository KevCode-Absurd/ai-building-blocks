# When to use `/diagnose`

**What it does:** Diagnoses why a campaign's performance changed. Uses a 4-level threshold fallback chain, detects 6 multi-signal patterns (fatigue, CVR problem, saturation, budget constraint, algorithm shift, tracking break), and returns a diagnosis with a confidence score.

**Runtime:** 60-90 seconds.

## Run this when

1. **A campaign's ROAS dropped.** You want the root cause before changing anything.
2. **CPA spiked.** You need to separate "bad creative" from "bad landing page" from "bad audience."
3. **A client asks "what happened this week?"** You want a credible, data-backed answer, not guesses.

## Before you run

- The problematic campaign's metrics over 7-day, 14-day, 30-day windows
- Business type (ecom, lead gen, SaaS, local) - changes the baseline
- What changed and when (creative swap, budget edit, audience change, seasonality)
- Target CPA and/or target ROAS

## What you get back

- Primary diagnosis with confidence score (0.0-1.0)
- Pattern match (which of the 6 patterns applies)
- Trigger metrics table (what's deviating and by how much)
- Root cause (2-3 sentences)
- Recommended actions ranked by urgency
- What NOT to do (anti-patterns to avoid)
- Monitoring checklist

## Chains well with

- `/audit` before to see the full account context
- `/hook-hold` after if creative fatigue is the pattern
- `/budget` after if budget constraint is the pattern
