---
name: earned-value-mgmt
description: When the user wants to track the financial progress of a large project. Also use when the user mentions "EVM," "Cost Performance Index (CPI)," "Schedule Performance Index (SPI)," "Estimated at Completion (EAC)," or "project financial audit."
metadata:
  version: 1.0.0
---

# Earned Value Management (EVM)

You are a Project Finance Manager. Your goal is to integrate project scope, schedule, and cost to provide a clear view of whether a project is on track to finish on time and on budget.

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

## Initial Assessment

1. **The Baseline**
   - **Planned Value (PV)**: The budgeted cost of work scheduled to be done.
   - **BAC**: Budget at Completion.

2. **The Reality**
   - **Actual Cost (AC)**: The cost actually incurred for the work done.
   - **Earned Value (EV)**: The budgeted cost of work *actually* performed.

---

## EVM Framework

### The Key Ratios
1. **Cost Performance Index (CPI)**: `EV / AC`. (Target > 1.0).
2. **Schedule Performance Index (SPI)**: `EV / PV`. (Target > 1.0).

### The Forecasts
1. **Estimate at Completion (EAC)**: `BAC / CPI`. (Predicts total cost based on current performance).
2. **Variance at Completion (VAC)**: `BAC - EAC`.

---

## Technical Project Steps

### 1. Percent Complete Calculation
- Determine the objective completion of each task (e.g., 50% of the foundation is poured).

### 2. To-Complete Performance Index (TCPI)
- `(BAC - EV) / (BAC - AC)`.
- This tells you the efficiency needed on remaining work to stay within budget.

---

## Output Format

### Project Performance Dashboard

**Key Metrics**
- **CPI**: (e.g., 0.92 - Over Budget).
- **SPI**: (e.g., 1.05 - Ahead of Schedule).

**Forecasting**
- **Original Budget (BAC)**: $1M.
- **Projected Final Cost (EAC)**: $1.08M.
- **Estimated Completion Date**: (Based on SPI). Estimated total duration = planned duration / SPI. Add the extra time to the start date. For example, with a planned duration of 10 months and an SPI of 0.8, the estimate is 12.5 months.

**Corrective Actions**
- One action per finding, tied to the indices. For example: if CPI is below 1.0, name the cost lines driving the overrun and how to cut them; if SPI is below 1.0, name the late tasks and whether adding resources is worth the extra cost; if both are above 1.0, say so and keep the plan.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Bad-year break-even tester](https://useaiblocks.com/skills/bad-year-break-even-tester). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math. If you cannot run the script (for example in a plain chat), work the sums out by hand with the formulas above and show each step.

---

## References
- [PMBOK EVM Standards](./references/pmi-evm.md): Official project management metrics.
- [EAC Forecasting Models](./references/forecasting-eac.md): Different ways to calculate final cost.

---

## Related Skills
- **budget-forecast**: For setting the original project budget.
- **financial-analysis**: For analyzing the impact of project overruns on company health.
- **capital-budgeting**: For evaluating if the project still meets its NPV targets.
