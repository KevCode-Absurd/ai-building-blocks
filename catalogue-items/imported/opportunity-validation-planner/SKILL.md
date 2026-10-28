---
name: product-discovery
description: Use when validating product opportunities, mapping assumptions, planning discovery sprints, or testing problem-solution fit before committing delivery resources.
---

# Product Discovery

Run structured discovery to identify high-value opportunities and de-risk product bets. If you already have a lean canvas, use its risks and assumptions as the starting list to map.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your idea** (yours): the product, app, business or project idea, in a line or a short paragraph.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your idea, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When To Use

Use this skill for:
- Opportunity Solution Tree facilitation
- Assumption mapping and test planning
- Problem validation interviews and evidence synthesis
- Solution validation with prototypes/experiments
- Discovery sprint planning and outputs

## Core Discovery Workflow

1. Define desired outcome
- Set one measurable outcome to improve.
- Establish baseline and target horizon.

2. Build Opportunity Solution Tree (OST)
- Outcome -> opportunities -> solution ideas -> experiments
- Keep opportunities grounded in user evidence, not internal opinions.

3. Map assumptions
- Identify desirability, viability, feasibility, and usability assumptions.
- Score assumptions by risk and certainty.

Use:
```bash
python3 scripts/assumption_mapper.py assumptions.csv
```

4. Validate the problem
- Conduct interviews and behavior analysis.
- Confirm frequency, severity, and willingness to solve.
- Reject weak opportunities early.

5. Validate the solution
- Prototype before building.
- Run concept, usability, and value tests.
- Measure behavior, not only stated preference.

6. Plan discovery sprint
- 1-2 week cycle with explicit hypotheses
- Daily evidence reviews
- End with decision: proceed, pivot, or stop

## Opportunity Solution Tree (Teresa Torres)

Structure:
- Outcome: metric you want to move
- Opportunities: unmet customer needs/pains
- Solutions: candidate interventions
- Experiments: fastest learning actions

Quality checks:
- At least 3 distinct opportunities before converging.
- At least 2 experiments per top opportunity.
- Tie every branch to evidence source.

## Assumption Mapping

Assumption categories:
- Desirability: users want this
- Viability: business value exists
- Feasibility: team can build/operate it
- Usability: users can successfully use it

Prioritization rule:
- High risk + low certainty assumptions are tested first.

## Problem Validation Techniques

- Problem interviews focused on current behavior
- Journey friction mapping
- Support ticket and sales-call synthesis
- Behavioral analytics triangulation

Evidence threshold examples:
- Same pain repeated across multiple target users
- Observable workaround behavior
- Measurable cost of current pain

## Solution Validation Techniques

- Concept tests (value proposition comprehension)
- Prototype usability tests (task success/time-to-complete)
- Fake door or concierge tests (demand signal)
- Limited beta cohorts (retention/activation signals)

## Discovery Sprint Planning

Suggested 10-day structure:
- Day 1-2: Outcome + opportunity framing
- Day 3-4: Assumption mapping + test design
- Day 5-7: Problem and solution tests
- Day 8-9: Evidence synthesis + decision options
- Day 10: Stakeholder decision review

## Tooling

### `scripts/assumption_mapper.py`

CLI utility that:
- reads assumptions from CSV or inline input
- scores risk/certainty priority
- emits prioritized test plan with suggested test types

See `references/discovery-frameworks.md` for framework details.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Minimum experiment planner](https://useaiblocks.com/skills/smallest-test-picker). It takes the plan.
- The [MVP experiment planner](https://useaiblocks.com/skills/mvp-experiment-planner). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
