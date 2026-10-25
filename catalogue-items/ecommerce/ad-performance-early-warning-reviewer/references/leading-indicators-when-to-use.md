# When to use `/leading-indicators`

**What it does:** Monitors CPM trend, frequency, CTR decay, hook rate drift, and reach saturation to detect performance problems 3-7 days before they show up in ROAS.

**Runtime:** 60-90 seconds.

## Run this when

1. **Weekly performance review.** Part of the Monday morning cadence. Catch issues before they become Friday panic.
2. **ROAS is still healthy but something feels off.** CPM is rising, frequency is climbing. This tells you if it's real.
3. **After a scaling push.** New budget often triggers leading indicators before ROAS catches up. This tells you when to pull back.
4. **Before a client's weekly update.** Know what's coming so you can get ahead of the narrative.

## Before you run

- Daily metrics for the last 14-28 days per campaign: CPM, frequency, CTR, reach, spend
- Hook rate daily (for video campaigns, optional but recommended)
- 4-week baseline data (for comparing current vs baseline)

## What you get back

- Overall risk level (Green / Yellow / Red)
- Which indicators are active and by how much
- Diagnosis (early fatigue, active fatigue, saturation, thumbnail fatigue, etc.)
- Estimated days until ROAS impact
- Priority actions ranked by urgency
- Monitoring schedule for the next 3-7 days

## Chains well with

- `/diagnose` after, if indicators escalate to red and ROAS starts dropping
- `/hook-hold` after, if Hook Rate is the primary indicator
- `/andromeda-check` after, if saturation + clustering risk suggest bigger diversity problem
- `/hook-generator` or `/creative-brief` after, to start building the refresh before fatigue hits
