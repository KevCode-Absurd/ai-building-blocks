---
name: prior-elicitation
description: >-
  Elicit and check Bayesian prior assumptions in meaningful units. Use for expert
  quantiles, PreliZ, constrained priors, prior-predictive plausibility and prior
  sensitivity, including power scaling, regularized horseshoe and R2D2 assumptions.
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
<!-- /needs -->

## Supporting material availability

This catalog copy does not include these files:

- `../pymc-modeling/references/extras-model-tools.md`

Do not say you read or ran them. Do those steps by hand, or ask the user for the original file.

# Prior elicitation

What the user gets: priors in real units, checked against the ranges they stated, with simulated predictions and a sensitivity comparison across a few reasonable priors.

Plain words for the terms below. Estimand: the exact number you want to learn. Support: the values the number can take, such as only positive. MCSE: the error left from using a finite number of samples. SBC: a test that a whole fitting method works, which this skill does not do. DataTree: the ArviZ container that holds the simulated results. Optional extras steps that need the missing pymc-modeling file are unavailable in this copy.

A prior is a scientific assumption, not a scale-free default. Work from the
quantity's meaning to a distribution, then check its observable implications.

## Workflow

1. **Define the quantity.** Establish the estimand, population, support, units,
   transformation/link, reference predictor values and information available
   before outcomes. Separate physical bounds from high-probability intervals,
   parameter uncertainty from future-observation variability, and independent
   prior information from outcome-based scaling.
2. **Elicit, do not invent.** Ask for quantiles, probabilities, meaningful predictor
   contrasts and tail judgments; record their source and disagreements. Label
   teaching numbers as illustrative assumptions. Do not tune priors to held-out
   outcomes or fabricate expert answers.
3. **Translate and check.** Use analytic formulas or PreliZ `maxent`/`quartile`.
   Inspect optimizer status and achieved CDFs independently. Maximum entropy is
   conditional on a chosen family and parameterization, not universally
   noninformative. Prefer PreliZ over deprecated `pm.find_constrained_prior`.
4. **Simulate prior predictions.** Use `pm.sample_prior_predictive(draws=...)`;
   access the resulting DataTree with `prior["prior_predictive"]`. Check support,
   conditional scales, dataset extremes and scientific contrasts against stated
   plausibility judgments, beyond observed-range coverage. Revisit assumptions
   when predictions are implausible, preserving support and simulation uncertainty.
   These are plausibility checks, not SBC of an inference implementation.
5. **Assess reasonable alternatives.** Vary plausible scales and tails while
   holding data, likelihood, transformations and estimand fixed for a prior
   sensitivity comparison. Rough exploratory fits can flag which assumptions to
   investigate; diagnose every posterior supporting reported conclusions with
   divergences, rank R-hat, bulk/tail ESS, estimand-specific MCSE and trace/rank plots.
6. **Report the actual sensitivity.** Compare physical-scale effects, meaningful
   event probabilities, uncertainty intervals and new-observation predictions.
   Stable answers over a few priors do not prove data dominance, global robustness
   or model adequacy. Power sensitivity is local and also needs reliable
   importance weights; its heuristic labels are not scientific decisions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Metric drop investigator](https://useaiblocks.com/skills/metric-drop-investigator). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## References

- [Elicitation, PreliZ, prior predictions and sensitivity](references/elicitation.md)
  — a complete prior-predictive example, unit conversions, expert workflow,
  analytic checks and power reweighting.
- [Shrinkage and regularization](references/shrinkage.md) — regularized horseshoe
  scales, R2D2 variance allocation, geometry and interpretation.
- For optional pymc-extras prior factories, serialization, censoring and
  posterior-as-prior transfer, see the extras model tools file from the separate `pymc-modeling` skill.
  That file is not included in this copy, so those optional extras workflows are not available here. Use the two references above.

Use the installed package's version-matched API documentation when adapting the
examples. PreliZ widgets need an interactive notebook; pymc-extras is optional
and needed only for its R2D2 helper or optional factory workflows. The elicitation
and shrinkage references remain usable without another skill.
