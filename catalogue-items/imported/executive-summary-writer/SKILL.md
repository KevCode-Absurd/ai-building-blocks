---
name: executive-summary-generator
description: Create concise executive summaries from detailed analysis. Use when preparing board decks, executive briefings, or condensing complex analysis into decision-ready formats for senior audiences.
---

# Executive Summary Generator

# When to use
- A detailed analysis needs to be condensed to 1–2 pages for a senior audience
- An executive asks "what's the bottom line?" and a full report won't be read
- Preparing a board deck section that summarises a longer analytical workstream
- A recurring report needs to lead with the key message rather than data tables
- A decision needs to be made by end of day and the executive has 10 minutes

# Process
1. **Extract the top 3–5 insights** — go through the full analysis and identify only the findings that change or reinforce a decision. Filter out interesting-but-not-actionable findings. If you have more than 5 insights, you haven't prioritised yet.
2. **Quantify the business impact of each insight** — every insight must carry a number: revenue at risk, cost saving, users affected, time to payback. Vague impact ("significant") does not belong in an executive summary. See `references/executive_communication.md`.
3. **Write a one-paragraph situation statement** — explain why this analysis was done, what the question was, and why the timing matters. One paragraph, no jargon.
4. **Apply the pyramid principle** — lead each insight with the conclusion (for example, "Mobile churn is causing $[amount] ARR loss" — an illustration of the form only; use only figures that are in the report the user gave you, and never copy this example as a finding), then the evidence, then the supporting detail. Never bury the finding at the end of a paragraph.
5. **State recommendations as specific actions** — each recommendation must name what to do, who is responsible, what the expected outcome is, and by when. "Improve the app" is not a recommendation.
6. **Write the decision block** — the final section names the explicit decision or approval the executive needs to give, the investment or resource required, the expected return, and the deadline. Use `assets/executive_summary_template.md` to assemble the document.

# Inputs the skill needs
- The full analysis or report to be summarised
- Knowledge of the executive audience (role, priorities, decisions they're responsible for)
- Quantified business impact for each major finding
- Recommended actions already identified
- Format constraints (one page, two pages, specific slide count)

# Output
- `references/pyramid_principle_guide.md` — answer-first structure, BLUF writing, how to edit a bottom-up draft into top-down
- `references/executive_communication.md` — adapting tone, removing jargon, quantifying everything, avoiding hedge language
- `assets/executive_summary_template.md` — 1–2 page template: situation, key insights (with impact), recommendations (with outcomes), decision needed

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Say it to the room** with the [Narrative memo checker](https://useaiblocks.com/skills/narrative-memo-checker).
- **Decide what to do** with the [Research evidence checker](https://useaiblocks.com/skills/findings-and-guesses-separator). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
