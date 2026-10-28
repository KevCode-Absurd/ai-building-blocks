---
name: data-storytelling
description: "Transform raw data into compelling narratives that drive decisions and inspire action."
risk: safe
source: community
date_added: "2026-02-27"
---

# Data Storytelling

Transform raw data into compelling narratives that drive decisions and inspire action.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Do not use this skill when

- The task is unrelated to data storytelling
- You need a different domain or tool outside this scope

## Instructions

- Clarify goals, constraints, and required inputs.
- Apply relevant best practices and validate outcomes.
- Provide actionable steps and verification.
- Use the frameworks and examples below; verify calculations against the supplied source data.

## Use this skill when

- Presenting analytics to executives
- Creating quarterly business reviews
- Building investor presentations
- Writing data-driven reports
- Communicating insights to non-technical audiences
- Making recommendations based on data

## Core Concepts

### 1. Story Structure

```
Setup → Conflict → Resolution

Setup: Context and baseline
Conflict: The problem or opportunity
Resolution: Insights and recommendations
```

### 2. Narrative Arc

```
1. Hook: Grab attention with surprising insight
2. Context: Establish the baseline
3. Rising Action: Build through data points
4. Climax: The key insight
5. Resolution: Recommendations
6. Call to Action: Next steps
```

### 3. Three Pillars

| Pillar        | Purpose  | Components                       |
| ------------- | -------- | -------------------------------- |
| **Data**      | Evidence | Numbers, trends, comparisons     |
| **Narrative** | Meaning  | Context, causation, implications |
| **Visuals**   | Clarity  | Charts, diagrams, highlights     |

## Story Frameworks

Every figure in the stories below is a placeholder in [square brackets]. They are teaching shapes, not observed results or benchmarks. Fill each one only from the user's own data, show your assumptions, and separate association from causation. If the user gives you no figure for a slot, leave it empty and say so. Recalculate totals before recommending spending or forecasting impact.

### Framework 1: The Problem-Solution Story

```markdown
# [Problem name] Analysis

## The Hook

"We're losing [AMOUNT] a year to [PROBLEM]."

## The Context

- Current rate: [RATE] (benchmark: [BENCHMARK, with its source])
- Average customer lifetime value: [VALUE]
- [COUNT] customers lost last quarter

## The Problem

Analysis of the lost customers reveals a pattern:

- [SHARE]% left within [PERIOD]
- Common factor: [FACTOR FROM THE DATA]
- [SECOND PATTERN FROM THE DATA]

## The Insight

[Show chart of the pattern]
[GROUP A] are [MULTIPLE]x more likely to leave than [GROUP B].

## The Solution

1. [ACTION 1]
2. [ACTION 2]
3. [ACTION 3]

## Expected Impact

- [EXPECTED CHANGE, with the assumption behind it]
- [ANNUAL VALUE, with the calculation shown]
- Payback period: [PERIOD]

## Call to Action

Approve [BUDGET] for [ACTION].
```

### Framework 2: The Trend Story

```markdown
# [Period] Performance Analysis

## Where We Started

[PERIOD] ended with [METRIC VALUE], [GAP] against target.

## What Changed

[Timeline chart]

- [MONTH]: [CHANGE 1]
- [MONTH]: [CHANGE 2]
- [MONTH]: [CHANGE 3]

## The Transformation

[Before/after comparison chart]
| Metric | [PERIOD 1] | [PERIOD 2] | Change |
|----------------|--------|--------|--------|
| [METRIC 1] | [VALUE] | [VALUE] | [CHANGE] |
| [METRIC 2] | [VALUE] | [VALUE] | [CHANGE] |
| [METRIC 3] | [VALUE] | [VALUE] | [CHANGE] |

## Key Insight

[WHAT THE DATA SHOWS, in one sentence, and whether it shows cause or only a link]

## Going Forward

[NEXT STEP]. Target: [TARGET] by [DATE].
```

### Framework 3: The Comparison Story

```markdown
# [Decision] Analysis

## The Question

Should we choose [OPTION A] or [OPTION B] first?

## The Comparison

[Side-by-side analysis]

### [OPTION A]

- [FACTOR 1]: [VALUE AND SOURCE]
- [FACTOR 2]: [VALUE AND SOURCE]
- [FACTOR 3]: [VALUE AND SOURCE]

### [OPTION B]

- [FACTOR 1]: [VALUE AND SOURCE]
- [FACTOR 2]: [VALUE AND SOURCE]
- [FACTOR 3]: [VALUE AND SOURCE]

## The Analysis

[Weighted scoring matrix]

| Factor | Weight | [OPTION A] score | [OPTION B] score |
| ----------- | ------ | ---------- | ---------- |
| [FACTOR 1] | [WEIGHT]% | [SCORE] | [SCORE] |
| [FACTOR 2] | [WEIGHT]% | [SCORE] | [SCORE] |
| [FACTOR 3] | [WEIGHT]% | [SCORE] | [SCORE] |
| **Total** | 100% | **[TOTAL]** | **[TOTAL]** |

Weights and scores are the user's judgement. Say who set them.

## The Recommendation

[OPTION] first, because [REASON FROM THE TABLE].

## Risk Mitigation

- [RISK 1]: [HOW TO REDUCE IT]
- [RISK 2]: [HOW TO REDUCE IT]
```

## Visualization Techniques

### Technique 1: Progressive Reveal

```markdown
Start simple, add layers:

Slide 1: "[METRIC] is growing" [single line chart]
Slide 2: "But growth is slowing" [add growth rate overlay]
Slide 3: "Driven by one segment" [add segment breakdown]
Slide 4: "Which is saturating" [add market share]
Slide 5: "We need new segments" [add opportunity zones]
```

### Technique 2: Contrast and Compare

```markdown
Before/After:
┌─────────────────┬─────────────────┐
│ BEFORE │ AFTER │
│ │ │
│ Process: [N] days │ Process: [N] days │
│ Errors: [N]% │ Errors: [N]% │
│ Cost: [AMOUNT]/unit │ Cost: [AMOUNT]/unit │
└─────────────────┴─────────────────┘

This/That (emphasize difference):
┌─────────────────────────────────────┐
│ GROUP A vs GROUP B │
│ ┌──────────┐ ┌──────────┐ │
│ │ ████████ │ │ ██ │ │
│ │ [VALUE] │ │ [VALUE] │ │
│ │ [METRIC] │ │ [METRIC] │ │
│ └──────────┘ └──────────┘ │
│ [GROUP A LABEL] [GROUP B LABEL] │
└─────────────────────────────────────┘
```

### Technique 3: Annotation and Highlight

```python
import matplotlib.pyplot as plt
import pandas as pd

fig, ax = plt.subplots(figsize=(12, 6))

# Plot the main data
ax.plot(dates, revenue, linewidth=2, color='#2E86AB')

# Add annotation for key events (use the real event name and the real change)
ax.annotate(
    '[EVENT NAME]\n[CHANGE FROM THE DATA]',
    xy=(event_date, event_revenue),
    xytext=(event_date, event_revenue * 1.2),
    fontsize=10,
    arrowprops=dict(arrowstyle='->', color='#E63946'),
    color='#E63946'
)

# Highlight a region
ax.axvspan(growth_start, growth_end, alpha=0.2, color='green',
           label='Growth Period')

# Add threshold line
ax.axhline(y=target, color='gray', linestyle='--',
           label=f'Target: {target:,.0f}')

ax.set_title('[Metric] Story', fontsize=14, fontweight='bold')
ax.legend()
```

## Presentation Templates

### Template 1: Executive Summary Slide

```
┌─────────────────────────────────────────────────────────────┐
│  KEY INSIGHT                                                │
│  ══════════════════════════════════════════════════════════│
│                                                             │
│  "[GROUP A] have [MULTIPLE]x higher [METRIC]                │
│   than [GROUP B]"                                           │
│                                                             │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│  THE DATA            │  THE IMPLICATION                     │
│                      │                                      │
│  [GROUP A]:          │  ✓ [ACTION 1]                        │
│  • [METRIC 1]: [VALUE]│  ✓ [ACTION 2]                       │
│  • [METRIC 2]: [VALUE]│  ✓ [ACTION 3]                       │
│  • [METRIC 3]: [VALUE]│                                     │
│                      │  Investment: [AMOUNT]                │
│  [GROUP B]:          │  Expected return: [RETURN, with its │
│  • [METRIC 1]: [VALUE]│  assumptions]                       │
│  • [METRIC 2]: [VALUE]│                                     │
│  • [METRIC 3]: [VALUE]│                                     │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

### Template 2: Data Story Flow

```
Slide 1: THE HEADLINE
"[Main finding, with its number]"

Slide 2: THE CONTEXT
Current state metrics
Benchmarks (only with a named source)
Gap analysis

Slide 3: THE DISCOVERY
What the data revealed
Surprising finding
Pattern identification

Slide 4: THE DEEP DIVE
Root cause analysis
Segment breakdowns
Statistical significance (only if a test was run)

Slide 5: THE RECOMMENDATION
Proposed actions
Resource requirements
Timeline

Slide 6: THE IMPACT
Expected outcomes
Return calculation with assumptions shown
Risk assessment

Slide 7: THE ASK
Specific request
Decision needed
Next steps
```

### Template 3: One-Page Dashboard Story

```markdown
# [Period] Business Review

## THE HEADLINE

[Main finding in one sentence, with its number]

## KEY METRICS AT A GLANCE

┌────────┬────────┬────────┬────────┐
│ [METRIC 1] │ [METRIC 2] │ [METRIC 3] │ [METRIC 4] │
│ [VALUE] │ [VALUE] │ [VALUE] │ [VALUE] │
│ [CHANGE] │ [CHANGE] │ [CHANGE] │ [CHANGE] │
└────────┴────────┴────────┴────────┘

## WHAT'S WORKING

✓ [WIN 1, with its number]
✓ [WIN 2, with its number]
✓ [WIN 3, with its number]

## WHAT NEEDS ATTENTION

✗ [PROBLEM 1, with its number]
✗ [PROBLEM 2, with its number]
✗ [PROBLEM 3, with its number]

## ROOT CAUSE

[Mini chart of the cause]
[WHAT THE DATA SHOWS, and how sure you are]

## RECOMMENDATION

1. [ACTION 1]
2. [ACTION 2]
3. [ACTION 3]

## NEXT PERIOD'S FOCUS

- [FOCUS 1]
- [FOCUS 2]
- [FOCUS 3]
```

## Writing Techniques

### Headlines That Work

```markdown
BAD: "[Period] Sales Analysis"
GOOD: "[Period] Sales Beat Target by [X]% - Here's Why"

BAD: "Customer Churn Report"
GOOD: "We're Losing [AMOUNT] to [CAUSE]"

BAD: "Marketing Performance"
GOOD: "[Channel] Delivers [X]x Return vs. [Other Channel]"

Formula:
[Specific Number] + [Business Impact] + [Actionable Context]
```

The numbers in a headline must come from the user's data. Never use a number you cannot trace to it.

### Transition Phrases

```markdown
Building the narrative:
• "This leads us to ask..."
• "When we dig deeper..."
• "The pattern becomes clear when..."
• "Contrast this with..."

Introducing insights:
• "The data reveals..."
• "What surprised us was..."
• "The inflection point came when..."
• "The key finding is..."

Moving to action:
• "This insight suggests..."
• "Based on this analysis..."
• "The implication is clear..."
• "Our recommendation is..."
```

### Handling Uncertainty

```markdown
Acknowledge limitations:
• "With [XX]% confidence, we can say..." (only if a test gave that figure)
• "The sample size of [N] shows..."
• "While correlation is strong, causation requires..."
• "This trend holds for [segment], though [caveat]..."

Present ranges:
• "Impact estimate: [LOW] to [HIGH]"
• "Confidence interval: [LOW]% to [HIGH]% improvement"
• "Best case: [X], Conservative: [Y]"
```

## Best Practices

### Do's

- **Start with the "so what"** - Lead with insight
- **Use the rule of three** - Three points, three comparisons
- **Show, don't tell** - Let data speak
- **Make it personal** - Connect to audience goals
- **End with action** - Clear next steps

### Don'ts

- **Don't data dump** - Curate ruthlessly
- **Don't bury the insight** - Front-load key findings
- **Don't use jargon** - Match audience vocabulary
- **Don't show methodology first** - Context, then method
- **Don't forget the narrative** - Numbers need meaning

## Resources

- [Storytelling with Data (Cole Nussbaumer)](https://www.storytellingwithdata.com/)
- [The Pyramid Principle (Barbara Minto)](https://www.amazon.com/Pyramid-Principle-Logic-Writing-Thinking/dp/0273710516)
- [Resonate (Nancy Duarte)](https://www.duarte.com/resonate/)

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Presentation builder](https://useaiblocks.com/skills/presentation-builder). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
