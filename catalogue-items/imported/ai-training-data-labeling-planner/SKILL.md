---
name: training-data-annotation
description: >-
  Design and improve human annotation programs for machine-learning training,
  validation, and evaluation data, including task and label schemas, active
  acquisition, annotator guidance, calibration, disagreement, adjudication,
  provenance, and cost-quality stopping. Do not use for general statistical
  inference, data storage pipelines, model training, or annotation-interface
  implementation; route those concerns to data-scientist, data-engineering,
  ml-engineering, or product-design-and-ux.
license: MIT
compatibility: Reference-only methodology; no runtime dependency.
metadata:
  spec-version: '1.0'
  tags: annotation, active-learning, labeling, human-review, training-data
---

# Training Data Annotation

Treat annotation as a measurement system and a human workflow. The objective is
useful, auditable labels for a defined downstream decision, not the largest
possible label count.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Your data** (yours): the data files, with their format and where they came from.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, your data. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **A chat AI that can read the bundled reference files:** Use the supplied references and templates for the chosen task. Scripts are optional unless that task specifically needs them.
<!-- /needs -->

## Workflow

1. Define the downstream task, population, label unit, label set, edge cases,
   abstention label, and what constitutes an unusable item. Separate training,
   validation, held-out evaluation, and challenge data before sampling.
2. Write an annotation guide with positive and negative examples, boundary
   rules, source requirements, escalation, and a change log. Have domain owners
   approve consequential definitions.
3. Establish provenance and rights: source, collection time, license/consent,
   transformations, sensitive fields, access, retention/deletion, and dataset
   version. Do not move data into a labeling system until this record is clear.
4. Acquire items using a declared mix of representative sampling and targeted
   acquisition. Uncertainty finds confusing items; diversity and novelty find
   gaps; stratification protects rare or high-risk slices. Keep acquisition
   batches identifiable and retain a representative held-out audit sample.
5. Qualify annotators for the task, train them on calibration items, and measure
   quality and workload. Record role and relevant expertise in restricted
   metadata. Do not use agreement as a universal truth score.
6. Run blinded calibration and periodic blind rechecks. Compare labels with
   adjudicated references where available; preserve meaningful disagreement,
   ambiguity, and abstention instead of forcing consensus.
7. Review disagreement by item, label, slice, annotator, and guide version.
   Adjudicate (settle a disagreement) only with a stated rule and a person qualified to decide. Feed confirmed
   guide defects back into training and re-review affected labels.
8. Stop or continue based on marginal downstream value, coverage, quality,
   cost, and time. An item quota may stop spending but cannot by itself establish sufficient quality. Freeze the
   manifest (lock the list of records and labels so it stops changing, and give it a version) and hand off to data-engineering for storage/orchestration and
   ml-engineering for training use.

## Acquisition guardrails

Never let model confidence define the whole dataset. Sample a representative
held-out audit independently of active-learning selection, and compare active
batch outcomes against it. Track uncertainty method, model/version, seed,
selection scores, slice quotas, and excluded items. If confidence is uncalibrated
or the model is out of distribution (the records are unlike anything it was trained on), treat its ranking as a search heuristic and
increase diversity, novelty, and human review.

## Human and quality guardrails

Design pay, volume, time limits, breaks, and escalation so workers can perform
the task reliably; route employment, compensation, and legal questions to the
appropriate human owner. Blind annotators to model predictions when measuring
independent labels. If preannotations are shown, measure anchoring by a blinded
control or separate review pass. Report agreement by label type and slice with
the uncertainty and prevalence needed to interpret it. A minority label can be
correct when the item is ambiguous; adjudication must explain the rule used.

## Routing and exit

Load [references/task-and-label-design.md](references/task-and-label-design.md)
for schemas and guide design, [references/acquisition-and-stopping.md](references/acquisition-and-stopping.md)
for sampling and stopping, [references/annotator-quality.md](references/annotator-quality.md)
for people and disagreement, and [references/provenance-and-rights.md](references/provenance-and-rights.md)
for dataset authority. Use the templates when a durable record is needed.
For primary methodology sources and transfer limits, read
[references/source-index.md](references/source-index.md).

Route statistical estimators and power to [data-scientist](../data-scientist/SKILL.md),
storage and pipelines to [data-engineering](../data-engineering/SKILL.md), model
training and leakage checks to [ml-engineering](../ml-engineering/SKILL.md), and
labeling-interface interaction design to [product-design-and-ux](../product-design-and-ux/SKILL.md).

## When not to use

Do not use this skill as the primary owner for statistical inference or
experimental design, data platforms, model training, or UI implementation.
Those neighboring skills consume this skill's annotation manifest and quality
evidence.

## Templates

- [annotation guide](templates/annotation-guide.md) — use when recording this stage of the annotation workflow.
- [annotation plan](templates/annotation-plan.md) — use when recording this stage of the annotation workflow.
- [quality report](templates/quality-report.md) — use when recording this stage of the annotation workflow.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Dataset profiler](https://useaiblocks.com/skills/dataset-profiler).
- The [Tabular dataset explorer](https://useaiblocks.com/skills/new-dataset-explorer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
