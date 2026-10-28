---
name: bug-receipt
description: 'Close defects and incidents with a BUG RECEIPT and VERIFIED, PARTIAL, or BLOCKED status after diagnosis, repair, or recovery.'
metadata:
  version: "1.4.1"
---

# Bug Receipt

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A test report** (yours): what was tested, what passed, what failed and why.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A test report** with the [Code and documentation consistency checker](https://useaiblocks.com/skills/copilot-docs-sync-audit). Bring a codebase.
2. **A test report** with the [Software test gap finder](https://useaiblocks.com/skills/copilot-test-gap-audit). Bring a codebase, a test report (optional).
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, a test report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Mandatory closeout output

For every bug or incident closeout decision, return the complete receipt below as the entire user-facing result, even when the user requests a concise reply or does not name this format. Concision shortens field values; it never removes or renames a row. Do not replace the receipt with prose.

```text
BUG RECEIPT · VERIFIED | PARTIAL | BLOCKED

Problem    <observed defect and intended behavior>
Baseline   <failing interaction or command and decisive result; or not run>
Root cause <proven mechanism; or unproven hypothesis>
Change     <responsible change; or none>
Proof      <supplied or executed check: result; include every decisive layer>
Gaps       <none; or exact missing proof and single next experiment/package>
Source     executed now | supplied | mixed
```

Use `not run`, `unproven`, or `none` explicitly. Never omit a row to make the receipt look complete.

Two terms in plain words. The **owner path** is the real route the data takes through the code from the input the user gave to the symptom they saw, not a copy of it in a test. A **decisive layer** is any step on that route where a check could show the bug is gone, such as the screen, the API reply or the stored data. List every one you checked.

## Establish the evidence boundary

Before editing, record the observed problem, intended behavior, strongest direct check, and evidence source: `executed now`, `supplied`, or `mixed`. Never imply that supplied evidence was executed in the current run.

Keep evidence privacy-minimal. Redact credentials, tokens, cookies, personal data, private URLs, and sensitive payloads; preserve only the identifiers and excerpts needed to reproduce or correlate the failure.

Reproduce the failure with the narrowest safe check when possible. If reproduction is unavailable, preserve the evidence obtained and cap the result at `PARTIAL` or `BLOCKED`.

## Trace and repair

1. Follow the live owner path from input to symptom.
2. Separate observed facts, bounded inferences, and gaps.
3. Require a concrete location or runtime transition before naming root cause.
4. Make the smallest responsible change; avoid unrelated cleanup, retries, silent fallbacks, and fixture-specific exceptions.

Do not convert a plausible patch, stale log, source read, or passing build into proof of the user-visible behavior.

## Close the proof loop

Run only checks required by the affected contract:

- original reproduction or direct acceptance check;
- nearest negative or regression check;
- affected build or integration gate;
- real UI, API, persistence, concurrency, or runtime path when the claim crosses that boundary.

Use these decisive boundaries:

| Surface | Required direct proof |
| --- | --- |
| Logic or failing test | Original failing input or focused test now passes |
| UI behavior | Real interaction plus relevant console and network observation |
| API or integration | Request, response, and responsible service behavior |
| Persistence | Write/read or reload round trip through the real owner path |
| Race or lifecycle | Repeated concurrent trigger; zero-or-one success; affected-row and transaction evidence; final invariant |
| Cross-system blocker | One sanitized failing request/response with timestamp or request ID, edge and application logs, and identity-provider logs when the trace reaches that owner |

## Assign status

- `VERIFIED`: observed baseline, concrete cause, responsible change, all declared checks passed, no material gap.
- `PARTIAL`: useful evidence exists, but a required proof layer is missing or inconclusive.
- `BLOCKED`: a specific external condition prevents reproduction, repair, or proof.

For `PARTIAL` or `BLOCKED`, name the single minimal experiment or correlated evidence package that closes the decisive gap. Never invent a command, observation, count, location, or result.

For a machine-readable receipt or CI integration, read [references/receipt-contract.md](references/receipt-contract.md) and conform to its JSON fields, evidence-source marker, compatibility rule, and status invariants.

When a JSON artifact is requested, start from [assets/receipt.template.json](assets/receipt.template.json), write it to a task-owned path, and validate it with `node scripts/validate-receipt.mjs <receipt.json>` from this skill directory. Do not commit the generated receipt unless the user requests it.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test and docs tracker](https://useaiblocks.com/skills/engineering-evidence-keeper). It takes the test report.
- The [Persistent bug debugger](https://useaiblocks.com/skills/fix-loop-breaker). It takes the test report.
- The [Bug root cause finder](https://useaiblocks.com/skills/bug-root-cause-finder). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Source and license

This copy comes from github/awesome-copilot (skills/bug-receipt), under the MIT License. That skill says it was originally published at https://github.com/lMysticl/bug-receipt, also under the MIT License.
