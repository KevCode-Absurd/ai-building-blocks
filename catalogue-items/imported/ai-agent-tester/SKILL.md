---
name: agent-evaluation
description: Design reproducible evaluations for AI agents with representative task sets, explicit rubrics, appropriate graders, baselines, regression gates, and failure analysis. Use when defining agent quality, comparing prompts or models, validating a release, measuring tool-use reliability, investigating regressions, or deciding whether an agent is ready for production.
---

# Agent Evaluation

Build evidence that can inform a release owner, not a showcase of favorable examples or a safety certification.

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

## Use when

- Define quality before building or changing an agent.
- Compare prompts, models, tools, memory strategies, or orchestration patterns.
- Convert production failures into regression cases.
- Establish a repeatable release gate or human-review plan.

## Inputs

Collect the agent objective, users, supported tasks, unacceptable outcomes, current baseline, execution environment, available traces, and evaluation budget. State assumptions when an input is unavailable.

## Output contract

Produce:

1. An evaluation brief with scope, risks, hypotheses, and frozen system versions.
2. A dataset manifest with provenance, categories, splits, and contamination controls.
3. A scoring specification with rubrics, graders, thresholds, and tie-breaking rules.
4. Reproducible run settings, aggregate results, uncertainty, and baseline deltas.
5. A failure taxonomy, representative cases, evidence limits, and a decision memo for the accountable release owner.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- The [GitHub check failure fixer](https://useaiblocks.com/skills/ci-failure-fixer). It takes the test report.
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the test report.
- **Build it** with the [A-Evolve agent improvement loop builder](https://useaiblocks.com/skills/agent-improvement-loop). It takes the test set.
- The [Prompt change tester](https://useaiblocks.com/skills/prompt-change-tester). It takes the test set.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Workflow

1. Define the unit under test and the decision the evaluation must support. Separate model quality from tool, retrieval, policy, and infrastructure failures.
2. Convert user goals and risks into observable criteria. Include task success, safety, latency, cost, and escalation quality only when relevant.
3. Build representative cases from real distributions where permitted. Add boundary, long-tail, malformed-input, tool-failure, and adversarial cases. Keep a holdout set isolated from prompt iteration.
4. Select the least subjective reliable grader. Prefer deterministic checks for structured facts, rubric-bound model graders for semantic quality, and blinded human review for high-impact or disputed cases. Read [evaluation-patterns.md](references/evaluation-patterns.md) when selecting graders or gates.
5. Freeze prompts, model versions, tools, data snapshots, seeds when supported, retries, and timeouts. Run the candidate and baseline under equivalent conditions; repeat stochastic cases.
6. Inspect case-level failures before trusting aggregates. Slice results by task, risk, language, tool, and user cohort where sample sizes permit.
7. Set a release gate that combines minimum critical-case performance, non-regression against baseline, and operational limits. Label underpowered results as inconclusive.
8. Save failed production-like cases as regression fixtures without exposing private data.

Use `python3 scripts/aggregate_results.py results.jsonl --score-min 0 --score-max 1 --require-passed` to validate identities and declared score bounds, then produce a descriptive summary. Add `--baseline old --candidate new` when records use those `variant` labels. Add `--output summary.json` for an atomic file write; the destination must be a new path or regular file and cannot alias the input through spelling, resolution, a symlink, or a hard link. The script reports explicit observed, missing, and total pass-rate denominators plus approximate uncertainty; it does not certify safety, representativeness, significance, or release readiness.

## Safety and permissions

- Do not send private prompts, customer data, credentials, or proprietary outputs to an external grader without authorization and an approved retention policy.
- Do not run evaluations against production systems, spend paid API budget, or trigger state-changing tools without explicit permission.
- Require qualified human review for medical, legal, financial, employment, safety, or access-control decisions.
- Treat grader scores as evidence, not ground truth; disclose model-grader identity and conflicts.

## Verification

- Confirm every release criterion maps to at least one case and every critical risk has a negative test.
- Verify train, development, and holdout cases do not overlap semantically or by source identifier.
- Re-run a sample manually and compare grader decisions against the rubric.
- Check that baseline and candidate used identical conditions and that reported denominators identify all missing pass labels, failures, and timeouts. Use `--require-passed` when every record must contribute to the pass-rate denominator.
- Confirm the report preserves case-level evidence needed to reproduce material claims.

## Failure handling

- If representative data is missing, run a clearly labeled exploratory evaluation and request data before setting a production gate.
- If graders disagree, tighten the rubric, blind the comparison, and adjudicate a stratified sample.
- If results are unstable, increase repetitions, isolate nondeterministic dependencies, and report confidence intervals or ranges.
- If a critical case fails, block the release regardless of the overall average until an authorized owner accepts the risk.

## Example

For “compare two versions of a customer-support agent,” define resolution correctness, citation fidelity, policy compliance, escalation judgment, latency, and cost; create normal, ambiguous, multilingual, prompt-injection, and unavailable-tool cases; blind the version labels; run both versions three times; aggregate by case category; inspect regressions; and return a ship, hold, or limited-rollout decision with evidence.
