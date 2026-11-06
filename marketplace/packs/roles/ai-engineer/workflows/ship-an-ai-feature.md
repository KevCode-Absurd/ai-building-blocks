# Ship one AI feature, from idea to live

**Trigger:** A client names one job they want a model to do in their app or back office, or an existing AI feature needs rebuilding after complaints. Usually one to three weeks of elapsed time.

## Steps

1. **Agree access (level 1 until answered).** Ask which level the client grants for each tool: code host, model provider console, document store, logs. Connect only through official connectors, MCP servers or each tool's own sign-in. Keys stay in the client's secret store. Record the "Access I have" list, including the monthly AI budget.
2. **Check the need (level 1).** Run the `does-this-need-ai` prompt on the client's examples. If a rule does the job, recommend it and stop.
3. **Write the spec (level 1).** Use the `ai-feature-spec` prompt: job, non-goals, quality bar, "when unsure", must-never list, approvals, data, disclosure. *Approval: the client signs off the spec, the must-never list and which actions need a person.*
4. **Build the test set (level 1).** Use the `prompt-test-set-and-tuning` skill, steps 1 and 2. *Approval: the client corrects the expected answers.*
5. **Build the feature (level 2).** Use the `ai-feature-build` skill on a branch: prompt file, schema, wrapper with timeouts, capped retries, fallback, cache, caps and logging. For answers from documents, use the `answers-from-your-documents` skill. The client creates a separate workspace or project with a low spend limit for testing.
6. **Evaluate and tune (level 2).** Run the eval script, group failures by cause, change one thing at a time and record each version. Use the `model-grader-rubric` prompt only for judgement criteria.
7. **Review guardrails (level 2).** Run the `ai-guardrails-and-launch-review` skill and the `injection-test-cases` prompt against the test environment, with the client's written approval for injection tests. Fix blockers in the same pull request.
8. **Estimate cost (level 1).** Use the `ai-cost-estimate` prompt with today's prices. *Approval: the client sets the monthly cap and the per-user limit.*
9. **Open the pull request (level 2).** Prompt, code, schema, test set, eval results, guardrail findings, cost formula and launch note. *Approval: a named reviewer on the client's team approves.*
10. **Confirm the go-live list.** Repo and environment, model and snapshot, users or share of traffic, monthly cap, actions the feature may take alone (if any), how to switch it off, end or review date. *Approval: the client says yes to this list before the first live action.*
11. **Go live (level 3).** Merge and deploy through the client's pipeline, switch on for the agreed users behind a flag, and watch the first day's logs, pass rate on real traffic samples, refusals and cost. Log every action.
12. **Hand over.** A one-page note: what it does, limits, who approves what, where logs and evals live, how to switch it off, and the date of the first health check.

## Outputs

- "Access I have" list and "does this need AI?" note
- Signed-off spec and test set
- Pull request with prompt, code, schema, eval script and results
- Guardrail review with verdict
- Cost estimate and agreed caps
- Confirmed go-live list, action log and handover note

## Needs the client's approval

The access level for each tool; the spec and must-never list; the expected answers in the test set; written approval for injection tests; the monthly cap; every pull request (a named reviewer); the go-live list before the first live action; and anything outside those limits later, such as a new model provider, a higher spend limit, new data sent to a vendor, new tools that send, delete, pay or change records, or deleting data. Refunds, payments and new money recipients always stay with a person. The client can lower the access level at any time.
