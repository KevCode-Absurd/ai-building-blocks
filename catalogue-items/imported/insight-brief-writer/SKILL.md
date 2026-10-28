---
name: insight-synthesis
description: Transform data findings into compelling insights. Use when converting analysis results into actionable insights, connecting findings to business impact, or preparing insights for stakeholder communication.
---

# Insight Synthesis

# When to use
- An analysis has produced many statistics but no clear "so what"
- The team has findings but is struggling to prioritise which ones to act on
- Stakeholders are asking "what does this mean for us?" rather than "what did you find?"
- Multiple analyses need to be synthesised into a unified set of recommendations
- Preparing an insight briefing for a team that doesn't have time to review the full analysis

# Process
1. **List all findings** — enumerate every statistically meaningful finding: trends, comparisons, correlations, anomalies, surprises. Write each as a factual statement. Don't interpret yet.
2. **Apply So What → Why → Now What to each finding** — convert each fact into an insight by answering: So what (why does this matter to the business?), Why (what is the most likely explanation?), Now what (what specific action should follow?). See `references/insight_framework.md`.
3. **Quantify business impact** — for each insight, estimate the financial, customer, or operational magnitude. An insight without a number is an observation. If precise data is not available, give an order-of-magnitude estimate, label it an estimate, state its assumption and which input it came from, or write "not sized" if there is no data to base it on. Never invent a figure.
4. **Prioritise by impact × confidence × actionability** — score each insight on these three dimensions (1–3 scale). Insights that score high on all three are the ones to lead with. Deprioritise insights that are high-impact but low-confidence until validated.
5. **Group and resolve conflicts** — cluster related insights and check for contradictions. If two findings point in opposite directions, document the tension and state what additional data would resolve it.
6. **Produce the insight brief** — present the top 3–5 insights in priority order, each with the finding, So What / Why / Now What, business impact, and confidence level. Use `assets/insight_brief_template.md`.

# Inputs the skill needs
- All analysis findings (statistics, charts, model outputs, anomalies)
- Business context: current goals, OKRs, strategic priorities
- Audience who will act on the insights (role and decision authority)
- Confidence levels for the findings (based on sample size, method, data quality)
- Known constraints on action (budget, timeline, team capacity)

# Output
- `references/insight_framework.md` — So What / Why / Now What pattern, insight quality rubric, prioritisation matrix
- `references/prioritization_guide.md` — scoring insights by impact, confidence, and actionability; how to present trade-offs
- `assets/insight_brief_template.md` — structured brief: top insights in priority order, each with impact, explanation, recommendation, and confidence level

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, your question, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [A/B test results analyst](https://useaiblocks.com/skills/a-b-test-verdict-maker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
