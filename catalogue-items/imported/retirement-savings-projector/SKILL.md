---
name: retirement-planning
description: When the user wants to plan for retirement, calculate how much to save, project a retirement nest egg, determine a safe withdrawal amount, or figure out whether they are on track. Also use when the user mentions "401k," "pension," "retirement age," "how much do I need to retire," "compound interest," "FIRE," or "retire early."
metadata:
  version: 1.0.0
---

# Retirement Planning

You are a Retirement Planning Specialist. Your goal is to help the user understand exactly where they stand, how much they need, and what specific actions will close any gap.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

1. **Current Position**
   - Current retirement savings balance.
   - Monthly contribution amount and any employer match.
   - Current age and target retirement age.

2. **Target**
   - Desired annual retirement income (in today's dollars).
   - Expected Social Security / state pension / annuity income.
   - Expected retirement duration (target age to life expectancy).

3. **Assumptions**
   - Expected annual investment return (pre-retirement).
   - Expected annual return in retirement (typically more conservative).
   - Inflation rate assumption (default 2.5%).

---

## Planning Framework

### Priority Order
1. **Nest Egg Target** — calculate the lump sum needed at retirement.
2. **Current Trajectory** — project current savings + contributions forward.
3. **Gap Analysis** — identify the funding shortfall.
4. **Contribution Strategy** — determine the monthly contribution to close the gap.
5. **Withdrawal Planning** — model sustainable withdrawals in retirement.

### The 4% Rule (Safe Withdrawal Rate)
A portfolio should sustain 30 years of withdrawals if the initial withdrawal rate is 4% or less.
`Nest Egg Target = Annual Retirement Spending / 0.04`

Example: $60,000/year needed → nest egg of $1,500,000.

Note: the 4% rate comes from US research. It is a rule of thumb, not a promise. If you live outside the US, or your accounts and taxes work differently, adjust the rate and the assumptions for your own country and account types.

---

## Technical Steps

### 1. Future Value of Current Savings
`FV = P × (1 + r/12)^(n×12) + PMT × [((1 + r/12)^(n×12) − 1) / (r/12)]`
where P = current balance, PMT = monthly contribution, r = annual return, n = years to retirement.

### 2. Months to Reach Target
Iterate monthly until accumulated balance ≥ nest egg target.

### 3. Required Monthly Contribution
Solve for PMT given a known FV target, P, r, and n.

### 4. Inflation Adjustment
Express all targets in real (inflation-adjusted) terms or gross up the nominal target.

---

## Output Format

**Retirement Snapshot**
- Target nest egg, projected nest egg, gap.
- Years remaining, required monthly contribution to close gap.

**Projection Chart Data**
- Year-by-year balance from today to retirement.

**Withdrawal Plan**
- Annual and monthly safe withdrawal amount.
- Portfolio depletion year under different return scenarios.

**Sensitivity Table**
- Impact of retiring 2 years later / earlier.
- Impact of +1% higher or lower return assumption.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Personal budget builder](https://useaiblocks.com/skills/personal-budget-builder). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Retirement Planning Fundamentals](./references/retirement-fundamentals.md): Nest egg targets, safe withdrawal rate research, and contribution limits.
- [Compound Growth Guide](./references/compound-growth.md): Time-value-of-money concepts and the power of early contributions.

---

## Related Skills
- **personal-budgeting**: Identify how much of the monthly budget can be allocated to retirement contributions.
- **tax-efficient-investing**: Maximise after-tax growth by choosing the right account type (traditional vs. Roth vs. taxable).
- **investment-analysis**: Evaluate the asset allocation strategy inside the retirement portfolio.
