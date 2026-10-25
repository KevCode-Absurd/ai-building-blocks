# When to use `/diversification`

**What it does:** Turns an Andromeda gap analysis into a ranked production queue of 5-10 specific creative briefs. Each brief names the format, hook, visual style, opening, body, and CTA with enough detail that a designer or UGC creator can start immediately.

**Runtime:** 2-3 minutes.

## Run this when

1. **Right after `/andromeda-check` shows gaps.** This is the operational bridge between "we have a diversity problem" and "here's what to build Monday."
2. **Planning a production sprint.** Brief queue of 5-10 ads with priority ranking.
3. **The team is asking "what ad should I make?"** Instead of committee debate, the queue answers.
4. **After a creative fatigue diagnosis.** When you know fatigue is hitting, this tells you what concepts to produce next, not just "more ads."

## Before you run

- `/andromeda-check` output OR a manual read of current format/hook/visual distribution
- Brand DNA (brand voice, audience, product, category)
- Production capacity (how many ads per week)
- Constraint mode (fastest-ship vs biggest-gap vs performance-weighted)

## What you get back

- Gap summary (biggest deficits per dimension)
- 5-10 fully specified creative briefs ranked in production order
- Per-brief impact on diversity score
- Projected Andromeda score after the queue ships
- Timeline estimate given production capacity

## Chains well with

- `/andromeda-check` before (input)
- `/creative-brief` after for each individual brief to expand into full production spec
- `/hook-generator` for the hook variants inside each video brief
- `/ugc-script` for the UGC briefs
- `/generate-ad` for the static briefs with existing assets
