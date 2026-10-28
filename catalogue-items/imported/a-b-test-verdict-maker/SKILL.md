---
name: ab-test-analysis
description: Rigorous A/B test statistical analysis. Use when analyzing experiment results, calculating statistical significance, checking for sample ratio mismatch, or validating test design before launch.
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A plan** (yours): the goals, steps, constraints and dates for this work.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Supporting material availability

The test-selection guide from the original is not in this copy. Step 4 gives the rule you need. Do not say you read any file you cannot open.

# A/B Test Analysis

# When to use
- An experiment has finished and the team needs a ship / no-ship recommendation
- Results look directionally positive but the team is unsure if they're statistically significant
- A test has been running for weeks without a clear winner and someone needs to decide whether to continue
- A new experiment needs sample-size planning before launch
- Results are disputed and need a rigorous, documented analysis

# Process
1. **Confirm test design** — verify the hypothesis, the control and treatment definitions, the randomisation unit (user/session/device), the primary metric, any guardrail metrics, and the target split ratio.
2. **Check for sample ratio mismatch (SRM)** — run a chi-square test on the actual vs. expected split. If SRM is detected, stop and investigate the randomisation pipeline before interpreting results. Use `scripts/ab_test_analyzer.py --check-srm`.
3. **Calculate per-variant metrics** — compute the rate (or mean) and 95% confidence interval for the primary metric in each variant. Document absolute and relative difference.
4. **Run the significance test** — execute a two-proportion z-test (for rates) or Welch's t-test (for means). Record z-score, p-value, and 95% CI for the effect. Pick the test by data type: two-proportion z-test for rates, Welch's t-test for means.
5. **Check guardrail metrics** — run the same significance test for each guardrail metric. A significant degradation on any guardrail is a blocker regardless of primary metric results.
6. **Produce the recommendation** — synthesise SRM result, power, significance, and guardrail checks into a clear ship / no-ship / extend decision. Quantify the expected business impact if shipped. Record in `assets/ab_test_report_template.md`.

# Inputs the skill needs
- Test plan or hypothesis document (variant definitions, randomisation unit, primary metric)
- Data with at minimum: user_id, variant assignment, primary metric outcome
- Optional: guardrail metric values per user, daily aggregate data for temporal validity checks
- Target split ratio (e.g., 50/50)
- Minimum detectable effect or business threshold for "worth shipping"

# Output
- `scripts/ab_test_analyzer.py` — runs SRM check, significance test, power analysis, and guardrail checks from a CSV or summary stats input
- `references/ab_test_design_guide.md` — SRM causes, power planning, peeking and multiple testing
- `assets/ab_test_report_template.md` — structured report: design, results, checks, recommendation, expected impact

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- **Test the idea with real people** with the [Experiment plan and results reviewer](https://useaiblocks.com/skills/experiment-readout-desk).
- **Read your ad results** with the [A/B test results reader](https://useaiblocks.com/skills/split-run-result-reader).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
