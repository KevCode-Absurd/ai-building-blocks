---
name: prioritize-assumptions
description: "Prioritize assumptions using an Impact × Risk matrix and suggest experiments for each. Use when triaging a list of assumptions, deciding what to test first, or applying the assumption prioritization canvas."
---

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

**ICE** works well for assumption prioritization: Impact (Opportunity Score × # Customers) × Confidence (1–10) × Ease (1–10). Opportunity Score = Importance × (1 − Satisfaction), normalized to 0–1 (Dan Olsen). **RICE** splits Impact into Reach × Impact separately: (R × I × C) / E. See the `prioritization-frameworks` skill for full formulas and templates.

### Instructions

The user will provide a list of assumptions to prioritize. Apply the following framework:

1. **For each assumption**, score two dimensions, each from 1 (low) to 5 (high). Scores are the AI's estimates unless the user gave real numbers. Mark each score "estimate" or "from your data". Never present an estimate as a measured figure, and never invent customer counts or percentages:
   - **Impact**: The value created by validating this assumption AND the number of customers affected (in ICE: Impact = Opportunity Score × # Customers)
   - **Risk**: Defined as (1 - Confidence) × Effort

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
