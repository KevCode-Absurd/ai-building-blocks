---
name: impact-quantification
description: Estimate and communicate business impact of insights. Use when sizing opportunities discovered in analysis, calculating ROI of recommended actions, or prioritizing initiatives by potential impact.
---

# When to use

After an analytical finding surfaces a potential action, change, or opportunity. Use to produce a defensible numeric estimate that stakeholders can act on. Also use when prioritizing a backlog of initiatives — quantified impact is the primary ranking signal.

# Process

1. **Classify the impact type** — revenue growth, cost reduction, risk reduction, or efficiency gain. Each type has a different formula family (see `references/impact_quantification_framework.md`).
2. **Gather inputs** — collect baseline metrics, affected population size, expected lift/reduction, time horizon, and confidence level.
3. **Build the point estimate** — paste the baseline, the lift and the time frame into the script call. If your AI cannot run scripts, work the formula by hand from `references/impact_quantification_framework.md` and show each step. Use `scripts/revenue_impact.py` for revenue/growth scenarios or `scripts/cost_savings.py` for cost/efficiency scenarios.
4. **Add uncertainty bounds** — give the script your point estimate and your confidence level. If you cannot run it, set low and high by hand from your own best and worst cases, and say so. Use `scripts/confidence_interval.py` to produce low/base/high estimates. Never deliver a single number without a range.
5. **Document assumptions** — fill in `references/assumption_documentation.md` for every input that is estimated rather than directly measured; note the sensitivity of the output to each.
6. **Package the estimate** — complete `assets/impact_estimate_template.md` with the range, assumptions, confidence, and recommended action; optionally build the full `assets/business_case_template.md` for larger decisions.

# Inputs the skill needs

- Baseline metric value (current state)
- Affected population or volume
- Expected change (lift %, absolute, or rate change)
- Time horizon (monthly / annual)
- Confidence level in inputs (high / medium / low)

# Output

- Impact estimate with low/base/high range
- Assumption log (source and sensitivity for each input)
- Completed `impact_estimate_template.md` or `business_case_template.md`

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->
