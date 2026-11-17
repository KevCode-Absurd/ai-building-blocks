# Ecommerce output benchmark

This harness freezes all 76 specialist packs and one human-style request for each.
Every numerical merchant record is explicitly illustrative. No fixture describes
Allbirds or another real business's performance. SEO/AEO tasks use public evidence
for Allbirds and must not borrow the synthetic merchant figures.

`prepare.py` extracts a built ZIP per specialist, writes the evidence snapshot and
request, and hashes every input. Initial trials and repair reruns use fresh desktop sub-agent contexts. Later catalogue trials run sequentially in fresh batch agents; these share within-batch context and are explicitly labeled in dispatch/results. They are not independent fresh-context replications.
The generator writes native deliverables and a user-facing answer under `output/`.
No paid API, external account action, message, purchase or publication is authorized.

`dispatch.json` records actual collaboration agent IDs and observed completions.
`record_results.py` checks input integrity and hashes the actual output files.
It does not create model answers or manufacture quality scores. The native host
transcript is the tool trace; any per-case execution note is generator-reported.

`export_traces.py` can export the observable host trace for exactly the dispatched
sub-agent paths beneath the specified parent chat. It retains tool calls/results,
visible messages, observed model identity and lifecycle events. It excludes system
and developer instructions, private reasoning and account metadata; embedded image
bytes become hash references. These local traces support error analysis; they are
not a public dataset and do not replace inspection of actual image artifacts. A batched agent trace is shared across its cases, labeled shared_batch, and includes the full batch; it must not be interpreted as case-specific timing or tool counts.

Hamel Husain and Shreya Shankar's [evals FAQ](https://hamel.dev/blog/posts/evals-faq/)
informs the review process: record concrete failures, distinguish search from
answer quality, and calibrate subjective judgments against domain-expert labels.
This run currently has **no human labels or calibrated automated judge**. Its AI
reviews are provisional discovery evidence. Do not turn self-scorecards into a
validated quality metric, combine separate failure rates into one quality score,
or call repaired development cases held-out tests. Tool/environment failures and
false-positive quality gates belong in the failure log too.

The independent root reviewer reads the artifacts against the original task,
source records and applicable arithmetic. Verdicts are:

- `PASS`: useful requested artifact, no material unsupported claim or calculation
  error found within the reviewed scope; not proof of expert superiority.
- `NEEDS_REPAIR`: a material error, omitted feasible deliverable, unsupported
  completion claim or violated constraint. Record its exact evidence and repair.
- `LIMITED_CAPABILITY`: useful partial work accurately identifies a genuine missing
  input/tool (e.g. no product photos, credentials or live commerce connector).
- `EXECUTION_ERROR`: host/tool failure prevented an evaluable run.
- `NOT_GRADED`: no quality assessment yet, even if execution completed.

Retain first-pass results. Fix the product instruction/tool that caused a failure,
then run a fresh case with the same frozen evidence and corrected pack. Do not
rewrite a failed answer and present it as a fresh model pass. New tasks should be
held out before making generalization claims.

This is one actual task per agent plus documented reruns. It is **not** the earlier
proposed three-arm/three-repeat study, a blinded human panel, a designer comparison,
a production integration test, or evidence of increased sales. Report those limits.

The optional `run_subscription.py` requires a compatible Codex CLI and verifies a
ChatGPT login with forced ChatGPT authentication and removed API-key environment
variables. On this Windows host the login smoke test passed but local tool launch
failed, so that runner is **not** the source of reported output results. Desktop
sub-agents are used instead; sandbox protections were not disabled.

`prepare_baseline.py` freezes seven matched host-only tasks with the exact user request and evidence hashes, excluding specialist pack instructions. Host tools and installed skills remain available. Prepared is not executed. Check the separate baseline dispatch/results for actual trials; no Claude Code arm has run.
