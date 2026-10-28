---
name: prioritize-assumptions
description: "Prioritize assumptions using an Impact × Risk matrix and suggest experiments for each. Use when triaging a list of assumptions, deciding what to test first, or applying the assumption prioritization canvas."
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini:** A plain chat is enough, since you paste in a list and read back a table.
<!-- /needs -->

## Prioritize Assumptions

Triage assumptions using an Impact × Risk matrix and suggest targeted experiments.

### Context

You are helping prioritize assumptions for the product or idea the user names.

If the user provides files with assumptions or research data, read them first.

### What to ask for first

1. The list of assumptions (required). If there is no list, ask for one. Do not make assumptions up for them.
2. What the product or idea is, in a sentence (required).
3. Customer counts, survey results or research notes (optional).

If an optional input is missing, carry on and say that scores are estimates.

### Domain Context

**ICE** works well for assumption prioritization: Impact (Opportunity Score × # Customers) × Confidence (1–10) × Ease (1–10). Opportunity Score = Importance × (1 − Satisfaction), normalized to 0–1 (Dan Olsen). **RICE** splits Impact into Reach × Impact separately: (R × I × C) / E. See the `prioritization-frameworks` skill for full formulas and templates. This is background only: in this skill, do not use the ICE or RICE 1 to 10 scales. Score Impact and Risk from 1 to 5 as set out below.

### Instructions

The user will provide a list of assumptions to prioritize. Apply the following framework:

1. **For each assumption**, score two dimensions, each from 1 (low) to 5 (high). Scores are the AI's estimates unless the user gave real numbers. Mark each score "estimate" or "from your data". Never present an estimate as a measured figure, and never invent customer counts or percentages:
   - **Impact** (1 to 5): the value created by validating this assumption and how many customers it touches. If the user gave no customer counts, judge the reach in words (few, some, most customers), keep the score an estimate, and never turn it into a number of customers.
   - **Risk** (1 to 5): how unsure you are that it is true, weighed against how hard or costly it is to find out. A guess that is costly to check scores 5. A near-certain fact that is easy to check scores 1.
   - **Box rule**: a score of 4 or 5 is high; 1 to 3 is low. Impact and Risk together pick the box below.

2. **Categorize each assumption** using the Impact × Risk matrix:
   - **Low Impact, Low Risk** → Defer testing until higher-priority assumptions are addressed
   - **High Impact, Low Risk** → Proceed to implementation (low risk, high reward)
   - **Low Impact, High Risk** → Reject the idea (not worth the investment)
   - **High Impact, High Risk** → Design an experiment to test it

3. **For each assumption requiring testing**, suggest an experiment that:
   - Maximizes validated learning with minimal effort
   - Measures actual behavior, not opinions
   - Has a clear success metric and threshold

4. **Present results** in this order:
   - **Scored list**: a table with assumption, impact (1 to 5), risk (1 to 5), box, and whether the scores are estimates or from the user's data. A score of 4 or 5 counts as high; 1 to 3 counts as low.
   - **Four-box matrix**: the same assumptions grouped by box.
   - **Experiments**: for each High Impact, High Risk assumption, the test, the one metric and the pass line.
   - **What to do next**: test, build, wait or drop for each, with the one or two to run first.

If the user's list is longer than 15 assumptions, score them all but design experiments for the top five only.

Think step by step. Save as markdown if the output is substantial. End by telling the user to run the first test before building, and offer to design that test in more detail.

---

### Further Reading

- [Assumption Prioritization Canvas: How to Identify And Test The Right Assumptions](https://www.productcompass.pm/p/assumption-prioritization-canvas)
- [Continuous Product Discovery Masterclass (CPDM)](https://www.productcompass.pm/p/cpdm) (video course)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Business assumption test planner](https://useaiblocks.com/prompts/plan-guess-ranker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
