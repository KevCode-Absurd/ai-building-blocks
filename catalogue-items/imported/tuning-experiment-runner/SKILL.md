---
name: optim-agent
description: "Guide agent-driven parameter optimization for configurable systems with measurable objectives. Use for HPO, inference tuning, simulations, or RL/control experiments."
category: data
risk: safe
source: community
source_repo: Optim-Agent/optim-agent
source_type: community
date_added: "2026-07-15"
author: Optim-Agent
tags: [optimization, hyperparameter-optimization, experiments, tuning]
tools: [claude, cursor, gemini, codex]
license: MIT
license_source: "https://github.com/Optim-Agent/optim-agent/blob/main/LICENSE"
---

<!-- Licence note: this copy is shown under CC BY 4.0 (see LICENSE-CONTENT). The MIT line in the header above is the original author's, kept as the upstream source. -->

# Optim Agent

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Use this skill to optimize configurable systems against a measurable scalar objective. It helps an agent turn vague tuning requests into bounded experiments with a defined search space, budget, baseline, and evidence-backed recommendation.

## When to Use This Skill

- Use when tuning hyperparameters, prompts, inference settings, simulation parameters, quantitative strategies, or RL/control policies.
- Use when the objective can be measured as a scalar score, loss, accuracy, cost, latency, reward, or risk-adjusted metric.
- Use when the user needs a small-budget optimization loop with trial history, comparisons, and stop criteria.

## Do not use this skill when

- The objective is purely subjective and cannot be scored consistently.
- The user has not provided permission to run experiments or consume compute/API budget.
- The task is a one-shot implementation, debugging, or code review request with no configurable search space.

## Instructions

1. Define the optimization target in one sentence: maximize or minimize one scalar metric.
2. List the tunable parameters, valid ranges, types, defaults, and any forbidden combinations.
3. Establish at least one baseline before proposing agent-guided trials.
4. Set the budget up front: number of trials, time, compute, money, or dataset subsample.
5. Run or request trials one at a time unless the user explicitly approves parallel execution.
6. Record every trial with parameters, metric value, notes, and failure status.
7. Compare the best result against the baseline and a simple search strategy when possible.
8. Stop when the budget is exhausted, the improvement plateaus, or the next trial cannot be justified from evidence.
9. Report the recommended configuration, measured gain, tradeoffs, and any validation still needed before production use.

**Trial log columns** (use the same columns on every run): trial number, settings changed, score, change from baseline, failed (yes or no), failure reason, and a note on why the next trial was chosen.

**Spend check:** before the first trial, estimate the cost of one trial (time, compute or paid API calls) and the total for the budget. Show it to the user and get a yes. Stop the loop if the running total reaches the cap.

## Examples

### Example 1: Hyperparameter optimization

Tune learning rate, regularization, and tree depth for a model. Track validation score for each trial, compare against the default configuration, and recommend the best setting only if it improves the baseline under the agreed trial budget.

### Example 2: Inference tuning

Tune retrieval depth, temperature, and reranker threshold for a RAG workflow. Optimize answer quality under a latency or cost ceiling, then report the best configuration with quality, latency, and cost tradeoffs.

### Example 3: Simulation or control

Tune controller gains or environment parameters for a simulator. Optimize reward or error while logging failed trials separately so unstable configurations do not bias the recommendation.

## Best Practices

- Keep the first run small; expand only after the loop produces useful signal.
- Prefer parameters with clear operational meaning over arbitrary knobs.
- Treat failed trials as data and record why they failed.
- Validate the final configuration on held-out data, a fresh seed, or a separate scenario before calling it robust.
- Ask before running expensive, long, or externally billed experiments.

## Limitations

- This skill does not guarantee a global optimum.
- Results depend on objective quality, noise, search-space design, and experiment reproducibility.
- Use domain review before applying tuned configurations to production, financial, safety-critical, or user-impacting systems.

## Additional Resources

- [Optim-Agent repository](https://github.com/Optim-Agent/optim-agent)
- [Optim-Agent documentation](https://optim-agent.github.io/optim-agent/)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- The [Persistent bug debugger](https://useaiblocks.com/skills/fix-loop-breaker). It takes the test report.
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
