---
name: ml-pipeline-creation
description: Design, implement, and validate reproducible machine-learning pipelines spanning data preparation, training, evaluation, registry, and deployment gates. Use when the user requests an ML pipeline, needs to turn model scripts into an orchestrated workflow, or provides pipeline components that must be connected safely.
license: MIT
metadata:
  author: awesome-ai-agent-skills contributors
  version: "1.0.0"
---

# ML Pipeline Creation

Build reproducible ML workflows whose inputs, outputs, lineage, and promotion criteria are explicit. Prefer the project's existing orchestrator and conventions; do not introduce a platform merely to demonstrate one.

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

## Required Inputs

- Business objective and measurable model acceptance criteria
- Data sources, ownership, sensitivity, and expected refresh cadence
- Existing preprocessing, training, evaluation, and serving code
- Target environments and available orchestration or CI system
- Compute, cost, latency, reproducibility, and compliance constraints

If critical details are missing, state assumptions and design a platform-neutral pipeline before selecting an implementation.

## Output Contract

Produce:

1. A dependency graph of pipeline stages and artifacts
2. A versioned pipeline definition or implementation
3. Explicit schemas for every stage input and output
4. Data, model, and environment versioning rules
5. Evaluation and promotion gates with failure behavior
6. Observability, retry, backfill, and rollback procedures
7. A verification record showing how the pipeline was tested

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Simple code coach](https://useaiblocks.com/skills/simple-code-coach). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Workflow

1. **Inspect the environment.** Identify the repository language, dependency manager, existing orchestration system, model framework, artifact store, and deployment path. Reuse established tools where possible.
2. **Define the contract.** Record the objective, data snapshot rules, target metric, baseline, acceptance threshold, resource budget, and deployment constraints. Separate offline evaluation from production health metrics.
3. **Model the DAG.** Represent ingestion, validation, splitting, transformation, training, evaluation, registration, and deployment as idempotent stages. Declare every artifact rather than relying on undeclared files or mutable global state.
4. **Implement reproducibility.** Pin dependencies, seed stochastic operations where appropriate, version code and data, capture parameters, and store immutable artifacts with provenance. Prevent train/validation leakage by fitting transformations only on training data.
5. **Add quality gates.** Validate schemas before training, compare metrics with a baseline, fail closed on missing or invalid artifacts, and require explicit approval before production promotion when consequences are material.
6. **Design operations.** Define retries only for transient failures, make reruns idempotent, specify backfill boundaries, emit structured logs and metrics, and document rollback to the last known-good model.
7. **Test incrementally.** Run unit tests for components, a small deterministic end-to-end fixture, and a staging or dry-run execution. Confirm that a failed stage cannot silently publish a model.

## Example

For a batch classifier, define the artifact flow explicitly:

```yaml
pipeline: customer-churn-training
inputs:
  raw_snapshot: data/raw/churn-2026-08-01.parquet
stages:
  - name: prepare-data
    inputs: [raw_snapshot]
    outputs: [train_set, validation_set, test_set, feature_schema]
  - name: train-model
    inputs: [train_set, feature_schema, training_config]
    outputs: [model, training_metrics]
  - name: evaluate-model
    inputs: [model, validation_set, test_set, baseline_metrics]
    outputs: [evaluation_report, promotion_decision]
  - name: register-model
    condition: promotion_decision == "pass"
    inputs: [model, evaluation_report]
    outputs: [registered_model_version]
```

Require `prepare-data` to emit every declared split. Reject the run if `test_set` is absent rather than letting evaluation consume an undeclared path.

## Safety Boundaries

- Treat datasets, credentials, model artifacts, and logs as potentially sensitive.
- Never copy production data into development without authorization and required de-identification.
- Do not deploy, replace a registered model, or alter production infrastructure without explicit approval.
- Present destructive migration or cleanup plans before execution and preserve a rollback path.
- Flag fairness, privacy, security, or regulatory review requirements instead of claiming compliance from pipeline execution alone.

## Verification

- Re-run the fixture twice and confirm identical stage contracts and expected deterministic outputs.
- Force one stage to fail and verify downstream stages do not execute.
- Verify artifact hashes, code revision, parameters, data version, and evaluation results are traceable from the registered model.
- Test retry and backfill behavior without duplicating records or overwriting immutable artifacts.
- Confirm the deployment gate rejects a model below threshold and accepts a known-good fixture.

## Best Practices

- Keep components small, idempotent, and independently testable.
- Separate pipeline orchestration from model business logic.
- Store configuration as versioned data; do not bury thresholds in code.
- Prefer immutable artifacts and explicit lineage over mutable “latest” paths.
- Monitor data quality and model behavior after deployment, not only during training.

## Edge Cases

- **Streaming data:** Use event-time semantics, checkpointing, and replay-safe sinks.
- **Non-deterministic training:** Record seeds and environment details, then validate within an agreed tolerance.
- **Large backfills:** Bound the date range, estimate cost, and test one partition before scaling.
- **Schema drift:** Quarantine incompatible data and require a reviewed schema migration.
- **Partial promotion:** Keep registry, serving configuration, and monitoring changes transactional or explicitly reversible.
