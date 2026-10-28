---
name: audit-integrity
description: "Enforce output quality, evidence verification, and quality gates across security audits. Use this skill when you perform SAST, SCA, threat modeling, or security code reviews. Use this skill to verify code locations and taint traces for all findings. Use this skill to prevent the suppression of valid security findings. Use this skill to evaluate reports against quality thresholds (score ≥ 8/10) before delivery."
license: MIT
metadata:
  version: "1.1"
---

# Audit Integrity Skill

Enforce output quality, intellectual honesty, and continuous improvement across security audits and code reviews.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for an audit report, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** Opens your repository and checks each cited file and line itself.
- **Any good chat AI:** Works if you paste the report and the code lines it cites.
<!-- /needs -->

## When to Use

- Perform security analyses, threat models, code reviews, or quality audits.
- Validate that every finding has verified code evidence and taint flow.
- Prevent the suppression or rationalization of security findings.
- Evaluate draft reports against the quality gate threshold (score ≥ 8/10).
- Record lessons learned and security memories after you complete a scan.

## When not to use

- A full security test of a live system. This skill checks the quality of an audit. It does not scan for new bugs on its own, and it is not a penetration test.
- Reviewing code that is not about security. Use a normal code review.
- Finding new issues in code you have not shared. It can only check claims against files it can read.

## Two ways to use it

- **Review a finished audit.** The user gives a draft report (or a list of findings) and the code or design it covers. You check each claim against the evidence, and score the report.
- **Run an audit with the guard rails on.** The user asks for a security review. You do the review, and apply the rules below as you go.

## Inputs (ask once, never guess)

1. **The audit or findings.** The draft report, a findings list, or a request to run a review. If none, ask.
2. **The code, design or manifests the audit covers.** Files the AI can open, or pasted excerpts. If the AI cannot open them, say so. Mark every claim about code as `NOT VERIFIED (no code access)`. Do not trust the report's own citations.
3. **Scope and policy** (optional): which parts are in scope, and the pass or fail rule (for example "no open High findings"). If missing, ask at most 2 questions (see the clarification protocol), then state your assumptions.

No scanner or special tool is needed. You verify by reading the cited files and tracing each input from where it enters (source) to where it does harm (sink) by hand. If the AI can search the code, use that to check each `file:line`. If not, ask the user to paste the cited lines.

## Components

This skill provides 7 modular capabilities in the `references/` directory. Load each file when you reach its execution phase:

| Component                    | Reference File                                                                           | Purpose                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Clarification Protocol       | [references/clarification-protocol.md](references/clarification-protocol.md)             | Ask a maximum of 2 targeted questions when scope is not clear     |
| Anti-Rationalization Guard   | [references/anti-rationalization-guard.md](references/anti-rationalization-guard.md)     | Prohibited rationalizations and mandatory responses for findings  |
| Self-Critique Loop           | [references/self-critique-loop.md](references/self-critique-loop.md)                     | Mandatory second pass to verify evidence and coverage             |
| Retry Protocol               | [references/retry-protocol.md](references/retry-protocol.md)                             | Tool failure and empty search handling: retry once, then document |
| Non-Negotiable Behaviors     | [references/non-negotiable-behaviors.md](references/non-negotiable-behaviors.md)         | Mandatory rules: do not fabricate, cite evidence, report gaps     |
| Self-Reflection Quality Gate | [references/self-reflection-quality-gate.md](references/self-reflection-quality-gate.md) | Scoring rubric (1–10 scale) with a minimum threshold of 8         |
| Self-Learning System         | [references/self-learning-system.md](references/self-learning-system.md)                 | Templates and rules for lessons and security memories             |

## Execution Flow

Load reference files as you reach each phase:

1. **Before analysis**: If scope or policy is not clear, read [references/clarification-protocol.md](references/clarification-protocol.md). Ask a maximum of 2 targeted questions.
2. **During analysis**: Follow [references/non-negotiable-behaviors.md](references/non-negotiable-behaviors.md). At each triage decision, consult [references/anti-rationalization-guard.md](references/anti-rationalization-guard.md).
3. **On tool or search failure**: Follow [references/retry-protocol.md](references/retry-protocol.md). Do not assume code is secure without verification.
4. **After initial analysis**: Complete a second pass with the checklist in [references/self-critique-loop.md](references/self-critique-loop.md). Verify taint traces and manifest coverage.
5. **Before delivery**: Score the draft report using [references/self-reflection-quality-gate.md](references/self-reflection-quality-gate.md). All categories must score ≥ 8.
6. **Final delivery**: Deliver the report in the output format below. Then, only if the AI can write files and the user agrees, record lessons and memories using [references/self-learning-system.md](references/self-learning-system.md). If it cannot write files, print them in the chat instead.

## Output Format

Deliver an **Audit Integrity Review** with these parts, in order.

1. **Verdict.** `PASS`, `REWORK` or `FLAG AND DELIVER`, with one line of reasoning. Use the thresholds in the quality gate file.
2. **Scope and gaps.** What was reviewed, and any file, phase or language you could not check, with the reason.
3. **Finding check table.**

   | # | Finding (as claimed) | Evidence cited | What you verified | Status | Gap or fix |
   |---|----------------------|----------------|-------------------|--------|------------|

   Status is one of: `Verified`, `Unsupported` (no evidence), `Wrong location` (cited lines do not show it), `Incomplete trace` (source to sink not shown), `Not verified (no code access)`.
4. **Suppressed or downgraded findings.** Any finding the report dropped, softened or called a false positive, with the reason given and whether it holds. Keep every such finding in the list, flagged as a possible false positive when unsure.
5. **Missing coverage.** Flaw categories, STRIDE categories, trust boundaries or manifests the report did not evaluate. Clean categories must say "None detected" or "No gap identified" with a reason.
6. **Quality gate scores.** The 1 to 10 score for each category in the rubric, with one line of evidence each.
7. **What to fix before delivery.** A short ordered list.
8. **Lessons and memories** (optional). Only if the user agreed.

Never invent a finding, a file path, a line number or a CVE. If you cannot confirm a citation, say so.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [ISO 27001 audit planner](https://useaiblocks.com/skills/iso-27001-audit-planner). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
