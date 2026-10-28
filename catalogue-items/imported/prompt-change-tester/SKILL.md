---
name: ai-prompt-regression-testing
description: 'Use when comparing prompt changes against a fixed evaluation set: record actual model settings, required checks, missing results, judge limitations and case-level regression evidence.'
category: engineering
risk: safe
source: self
source_type: self
date_added: "2026-10-01"
author: Ranjeet2063
tags: [ai, prompt-engineering, testing, evaluation, llm, benchmarking]
tools: []
source_repo: Ranjeet2063/agentic-awesome-skills
---

# AI Prompt Regression Testing

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your prompt** (yours): the full prompt or instructions you give the AI.
- **A test set** (yours): test cases for the AI, each with the answer that counts as a pass.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your prompt, a test set. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- Compare a prompt change with an observed baseline on a fixed evaluation set.
- Detect schema, factuality, refusal, tool-selection or task-completion regressions.
- Record a reviewable decision when results are noisy, missing or contradictory.

## Workflow

1. Define the task, representative cases and forbidden outcomes. Use synthetic
   or approved/redacted data; freeze case IDs and the dataset revision before runs.
2. Record baseline/candidate prompt digests, exact available model/version,
   inference settings, tool versions and evaluation environment. Do not hardcode
   old model-family options or silently change models between comparisons.
3. Predeclare checks and acceptance rules. Use deterministic schema/field checks
   for structured output, behavioral checks for tools and a clear human/rubric
   standard for open text. Similarity does not prove factual or code correctness.
4. Run matched baseline/candidate cases under the same permissions and budget.
   Record latency/cost and repeated runs when variability matters. A timeout,
   missing output or judge error is incomplete, not a pass or a zero-cost result.
5. Treat judge outputs as evidence with limitations. Blind/randomize presentation
   where feasible, calibrate against human-labeled examples, and record judge
   identity/rubric. Do not ask a model to verify private reasoning or accept a
   judge's confidence as an objective correctness measurement.
6. Review differences case by case and report the denominators, failures and
   uncertainty. Keep mandatory safety/schema failures visible even if aggregate
   similarity improves. Use the predeclared rule, not a threshold selected after results.
7. Store a redacted report and exact artifacts at an authorized destination.
   Decide keep/revise/reject for the stated dataset; deployment is separate. Keep means the new prompt can replace the old one. Revise means send the regressions back for changes. Reject means keep the old prompt.

## Regression register

| Field | Type | Example / meaning |
|---|---|---|
| case_id | string | PTEST-001; a textual ID, not SERIAL |
| dataset_revision | immutable reference | exact case inventory, expected checks and labels |
| prompt_revision | string | baseline/candidate digest |
| model_runtime | string | exact available ID/version plus settings |
| check | string | required JSON fields or approved rubric criterion |
| result | enum | pass / fail / incomplete |
| evidence | reference | redacted actual output, tool trace or observed check |
| judge_configuration | optional object | exact judge ID/rubric/version and calibration limits |
| latency_ms | nonnegative number or null | null if not observed; never invented |
| cost | amount/currency or null | actual billing basis; unknown remains unknown |
| run_revision | immutable reference | binds the report to the actual run |

IDs and statuses must have consistent SQL/JSON/CSV representations. Do not store
private prompts, user messages or tokens in a public spreadsheet or Notion register.

## Worked example

Two cases test a support-answer prompt. PTEST-001 requires an answer grounded in
the supplied policy; PTEST-002 requires a structured escalation when the policy
is absent. The candidate sounds more helpful but PTEST-002 has no observed result.
The report is incomplete, not a win. The following Python 3 helper aggregates
already reviewed case statuses; it does not call models or decide correctness.

```python
def summarize_regression(results, expected_case_ids):
    if not isinstance(expected_case_ids, list) or not expected_case_ids:
        return {"status": "incomplete", "reason": "missing case inventory"}
    if any(not isinstance(case, str) or not case for case in expected_case_ids):
        return {"status": "incomplete", "reason": "invalid case IDs"}
    if len(set(expected_case_ids)) != len(expected_case_ids):
        return {"status": "incomplete", "reason": "duplicate expected case IDs"}
    if not isinstance(results, list) or any(not isinstance(row, dict) for row in results):
        return {"status": "incomplete", "reason": "invalid results"}
    by_id = {}
    for row in results:
        case = row.get("case_id")
        if not isinstance(case, str) or case not in expected_case_ids or case in by_id:
            return {"status": "incomplete", "reason": "unexpected or duplicate result"}
        if row.get("result") not in ("pass", "fail", "incomplete"):
            return {"status": "incomplete", "reason": "unknown result"}
        by_id[case] = row["result"]
    failed_cases = [case for case, result in by_id.items() if result == "fail"]
    if set(by_id) != set(expected_case_ids) or "incomplete" in by_id.values():
        return {"status": "incomplete", "reason": "missing or incomplete case",
                "failed_cases": failed_cases, "evaluated": len(by_id)}
    return {"status": "regression" if failed_cases else "checks-passed",
            "failed_cases": failed_cases, "evaluated": len(by_id)}


print(summarize_regression(
    [{"case_id": "PTEST-001", "result": "pass"}],
    ["PTEST-001", "PTEST-002"],
))
```

Expected output: incomplete with reason missing or incomplete case. For all
observed pass statuses the output is checks-passed, meaning only those recorded
checks passed; it is not a release or general quality certificate.

## Limitations

- Exact text match is unsuitable for many valid open-ended outputs; embeddings
  and judges have blind spots and cannot replace mandatory behavioral checks.
- A golden set must be reviewed/versioned; it is not created merely by naming it.
- This entry does not include a provider adapter, judge, dataset or runnable suite.
  Use the project's supplied materials and state what was actually executed.
- A finite test set cannot prove future prompt behavior or absence of injection.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Prompt fixer](https://useaiblocks.com/skills/prompt-fixer). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
