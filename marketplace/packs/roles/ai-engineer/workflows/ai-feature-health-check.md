# AI feature health check

**Cadence:** Every two weeks for the first two months after launch, then monthly. Also straight away after a vendor retirement or routing notice, a cost alert, or a complaint about a wrong answer. About two hours for one feature.

## Steps

1. **Check vendor notices (level 1).** Read the model, deprecation and pricing pages for the provider in use. Note any retirement date, automatic routing to a new model, price change, or change to data terms for the tier in use. Compare with the "What changes fast" table in `knowledge.md`.
2. **Read the numbers (level 1).** From logs and the provider's usage page: calls, cost against the cap, cache hit share, latency, refusals, fallbacks, errors and rate limit hits since the last check.
3. **Sample real traces (level 1).** Read a sample of real inputs and outputs with personal data masked. Mark each pass or fail against the spec. Add new failure types to the test set as new cases.
4. **Re-run the test set (level 2).** Run the full eval on the current production prompt and model with the client's test key. Compare with the last report by tag.
5. **Check guardrails (level 1).** Spend limits still set, per-user caps working, tool permissions unchanged, approval steps still in place, connector and MCP server scopes no wider than needed, keys rotated if anyone with access left.
6. **Fix what slipped (level 2).** Use the `prompt-test-set-and-tuning` skill for prompt failures, and the `answers-from-your-documents` skill for retrieval misses or out-of-date documents. Open a pull request with before and after results. *Approval: a named reviewer on the client's team approves.*
7. **Handle model changes.** If a model is retiring or being auto-routed, run the test set on the replacement in a test workspace, and prepare the switch in a pull request. *Approval: the client agrees the new model and its cost before it goes live.*
8. **Apply fixes (level 3).** Within the agreed limits, merge and deploy through the client's pipeline, then re-check the live pass rate on a fresh sample. Anything outside the limits (a new provider, a higher cap, new tools, deleting logs or index data) needs a new yes.
9. **Report.** One page: pass rate trend, cost against cap, incidents, vendor changes coming, fixes made, every action taken from the log, and the date of the next check.

## Outputs

- Vendor change notes with dates
- Usage and cost summary against the cap
- Trace sample results and new test cases
- Eval comparison with the last check
- Pull requests for fixes and model changes
- One-page health report with the action log

## Needs the client's approval

Prompt or model changes (through a reviewed pull request), any new model or provider and its cost, raising a spend limit, adding tools or data sources, and deleting logs, documents or index data. The client can lower the access level at any time.
