---
name: constrained-optimization
description: >-
  Define, compare, and audit constrained optimization decisions with explicit
  variables, units, hard and soft constraints, feasibility, Pareto tradeoffs, and
  honest solver evidence. Do not use for statistical modeling or ML fitting, which
  belong to data-scientist or ml-engineering, or for operating a named solver.
license: MIT
---

# Constrained optimization

Use this methodology to turn an optimization request into a defensible decision record.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Frame the decision.** Name the decision maker, feasible action window, variable domains (continuous, integer, categorical, binary), bounds, units, and whether each variable is controllable.
2. **State objectives.** Write objective direction, units, aggregation, baseline, and acceptable tradeoffs. Keep multiple objectives separate until a decision maker chooses weights, lexicographic priority, epsilon constraints, or a Pareto review.
3. **Classify constraints.** Mark each as hard (must hold), soft (preference with an explicit penalty or relaxation), or informational. Define equality/inequality tolerance, feasibility predicate, and how violations are measured. Never hide a hard violation in a penalty score.
4. **Establish baselines.** Validate a known feasible incumbent, a simple exact or bounded baseline where available, and a heuristic baseline when exact solving is impractical. State what each baseline proves and does not prove.
5. **Choose the method.** Match solver family to domains, smoothness, scale, and proof needs. An exact solver can establish optimality or a bound when its status and gap support it; a heuristic supplies a candidate and empirical evidence. Do not call timeout or unknown an infeasible result.
6. **Run a fair comparison.** Fix an objective/constraint implementation, feasibility checker, compute budget, stopping rule, and reporting schema. For stochastic methods, use equal budgets and declared seeds/repeats. Keep solver configuration separate from the formulation.
7. **Independently validate.** Recompute objective and every constraint from the returned decision using an independent implementation or checker. Report feasible-best, violation magnitude, bound/gap, status, runtime, and unresolved unknowns separately.
8. **Decide and monitor.** Select a feasible solution or Pareto set with the tradeoff rationale, sensitivity/robustness evidence, owner, and rollback/re-optimization trigger. Record “infeasible under these constraints” only when infeasibility is proven or independently certified.

## Routing and exit

Load `references/formulation-and-evidence.md` for formulation, feasibility, solver status, bounds/gaps, and comparison rules. Load `references/multiobjective-and-robustness.md` for Pareto decisions and stochastic sensitivity. Use [the formulation record](templates/formulation-record.md) to define the problem before solving, and [the solution audit](templates/solution-audit.md) to verify a returned candidate.

This skill owns decision formulation and evidence. Route statistical estimation, causal questions, and uncertainty models to `data-scientist`; route ML hyperparameter/model training optimization to `ml-engineering`; route operation of a named solver or cloud service to its tool skill. Stop when variables, objective units, hard constraints, feasibility checker, or budget are undefined. Complete when the formulation and solution audit record the decision, supporting evidence, unresolved limits, and owner.

For the official solver-result references and their version/applicability limits, read [the source index](references/source-index.md).

## When not to use

Do not use this skill for inferential statistics, causal inference, or statistical model fitting. Do not use it for ML training/model selection methodology or for solver-specific installation and runbooks.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Decision checklist runner](https://useaiblocks.com/skills/decision-checklist-runner). It takes the plan and audit report.
- The [Decision backup planner](https://useaiblocks.com/skills/decision-tripwire-planner). It takes the audit report.
- The [Third option finder](https://useaiblocks.com/skills/third-option-finder). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
