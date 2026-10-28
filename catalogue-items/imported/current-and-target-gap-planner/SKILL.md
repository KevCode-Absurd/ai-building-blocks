---
name: gap-analysis
description: >-
  Analyze gaps by comparing a defined current state with a justified target
  state, characterizing causes and uncertainty, prioritizing actionable
  interventions, and producing traceable matrices, roadmaps, and decision
  records. Use for capability, process, compliance, readiness, maturity,
  operating-model, or research-evidence gaps. Do not use for a vague list of
  problems, a standalone root-cause analysis, a generic SWOT, or legal or
  audit certification advice without a governing standard and qualified owner.
license: MIT
compatibility: Platform-agnostic methodology. No runtime dependency; optional Python 3 script uses only the standard library.
metadata:
  tags: gap-analysis, current-state, target-state, capability, maturity, readiness, compliance, evidence, prioritization
---

# Gap Analysis

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, source text. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **A chat AI that can read the bundled reference files:** Use the supplied references and templates for the chosen task. Scripts are optional unless that task specifically needs them.
<!-- /needs -->

## Overview

A gap analysis is a decision method, not a scorecard: define a bounded question, establish an observable current state, justify a desired state, compare them, explain why the difference exists, and decide what to do. A credible result makes evidence, assumptions, uncertainty, ownership, and trade-offs visible.

## When to use

Load this skill when the work compares current and desired performance, capability, controls, process behavior, readiness, maturity, operating model, or research evidence and must produce an actionable artifact. Choose the variant from `references/variants.md`.

### When not to use

Do not use this as a substitute for root-cause analysis, a risk assessment, SWOT, benchmarking, a requirements specification, a regulatory/legal opinion, or an audit/certification conclusion. Route technical capacity questions to `capacity-and-cost-engineering`, governance questions to `ai-governance`, and causal diagnosis to `systematic-debugging` or the relevant domain owner. A gap analysis may expose a need for those disciplines; it does not replace them.

## Core method

1. **Frame the decision.** State the decision or outcome, sponsor, population/system, time horizon, boundary, exclusions, and who will use the result.
2. **Define the criterion.** Make the target observable and source it to a requirement, outcome, benchmark, risk appetite, strategy, or explicitly labeled stakeholder preference. Do not invent a maturity scale or imply that a framework tier is a universal goal.
3. **Specify evidence.** For each dimension, define measure, unit, period, source, sampling, confidence, and acceptance rule before collecting data. Separate observed facts, reported perceptions, inferred causes, and assumptions.
4. **Describe the current state.** Use multiple relevant evidence types: records/metrics, direct observation, interviews, artifacts, tests, or research synthesis. Record missing and contradictory evidence instead of filling it with confidence.
5. **Compare like with like.** For every dimension, show current, target, difference, evidence, confidence, and consequence. A gap is a bounded difference, not merely a bad feeling or an absence of a preferred practice.
6. **Characterize the gap.** Distinguish outcome gap, capability/control gap, process gap, resource gap, knowledge/evidence gap, and decision/ownership gap. Keep root causes and proposed remedies separate from the observed gap.
7. **Prioritize transparently.** Use criteria appropriate to the decision, such as impact, urgency/exposure, reach, feasibility, dependency, cost, confidence, and reversibility. Show the rationale and do not hide value judgments inside a score.
8. **Plan closure.** Convert selected gaps into actions with a measurable closure condition, owner, dependencies, resources, date or review trigger, and residual risk. Assign an accountable decision-maker, not “the team.”
9. **Validate and revisit.** Review findings with affected stakeholders, test high-consequence claims, resolve material contradictions, and schedule a follow-up measurement. Closure means evidence that the target condition is met, not that an action was started.

## Required output shape

Use `templates/gap-register.md` as the canonical row schema, then add only the context artifact needed:

| Context | Add |
|---|---|
| Capability or maturity | `templates/capability-assessment.md` |
| Process or operating model | `templates/process-gap-analysis.md` |
| Compliance or readiness | `templates/compliance-readiness-assessment.md` |
| Research or evidence | `templates/research-evidence-gap.md` |

A useful report normally contains: executive decision, scope and method, target/criteria register, current-state evidence, gap register, prioritization logic, action roadmap, assumptions/unknowns, stakeholder review, and follow-up measure. Label hypothetical examples as hypothetical.

## Quality gates

Before delivery, verify that each material gap has (a) a defined target and source, (b) current evidence or an explicit evidence gap, (c) a stated comparison and consequence, (d) a cause hypothesis distinguished from fact, (e) an owner and closure test, and (f) a priority rationale. Check that the report does not claim compliance, readiness, causation, or improvement without the evidence needed to support that claim.

## Reference routing

| Load this file when... | Reference |
|---|---|
| You need the research-grounded method, evidence taxonomy, or source limits | `references/methodology.md` |
| You need to choose among capability, process, compliance, readiness, maturity, or research variants | `references/variants.md` |
| You need prioritization, scoring, sequencing, or closure controls | `references/prioritization-and-roadmaps.md` |
| You need examples, anti-patterns, or review questions | `references/examples-and-anti-patterns.md` |
| You need source provenance and claims behind this skill | `references/source-index.md` |
| You need a structured checker for a completed JSON register | `scripts/validate-register.py` |

## Completion

Stop when the decision question is answered by a reviewed, traceable artifact, or report the bounded unresolved evidence and the next collection action. Do not convert missing data into a green score or keep researching after the decision-relevant uncertainty is explicit.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Investment decision brief writer](https://useaiblocks.com/skills/yes-no-too-hard-call-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
