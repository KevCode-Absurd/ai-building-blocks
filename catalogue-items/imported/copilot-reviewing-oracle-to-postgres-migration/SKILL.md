---
name: reviewing-oracle-to-postgres-migration
description: 'Identifies Oracle-to-PostgreSQL migration risks by cross-referencing code against known behavioral differences (empty strings, refcursors, type coercion, sorting/collations, UNION ALL planner risks, materialized-view refresh requirements, timestamps, concurrent transactions, etc.). Use when planning a database migration, reviewing migration artifacts, or validating that integration tests cover Oracle/PostgreSQL differences.'
---

# Oracle-to-PostgreSQL Database Migration

Surfaces migration risks and validates migration work against known Oracle/PostgreSQL behavioral differences documented in the `references/` folder.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A code change** with the [Oracle behavior baseline test writer](https://useaiblocks.com/skills/copilot-creating-oracle-to-postgres-migration-integration-tests). Bring a codebase, a plan (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, a code change, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code or Copilot in your editor:** They can read your procedures, calling code and tests together.
- **A PostgreSQL test database:** You need one to run the migration scripts and integration tests.
<!-- /needs -->

## When to use

1. **Planning** — Before starting migration work on a procedure, trigger, query, or refcursor client. Identify which reference insights apply so risks are addressed up front.
2. **Validating** — After migration work is done, confirm every applicable insight was addressed and integration tests cover the new PostgreSQL semantics.

## When not to use

- Schema-only or single-query checks with no procedural code, or a general SQL speed review.
- Moves to a database other than PostgreSQL. The references cover Oracle to PostgreSQL only.

## Inputs to gather first

Ask once for anything missing. Do not guess what the code does.

- The procedures, triggers, queries or views in scope.
- The application code that calls them.
- For validating: the migration changes or diff, and the Oracle source if you have it.
- The existing integration tests.

## Output

Return a table, then a verdict:

```text
| Difference | Applies to (file, line) | Risk | Recommended fix | Test status |
|---|---|---|---|---|
| <reference name> | <where> | <what could go wrong> | <fix pattern> | covered / missing / not applicable |
```

Then list **Decisions needed** (risks that need a design choice) and a **Verdict**: each applicable difference marked addressed or not, scripts run (yes or no), tests pass (yes or no). Say "not run" when you could not run anything. Never mark a test as passing without seeing it pass.

**Next steps:** fix each open risk, add the missing tests, then run this again in validating mode.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Process and behavior change planner](https://useaiblocks.com/skills/structure-behaviour-split). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Workflow

Determine the task type:

**Planning a migration?** Follow the risk assessment workflow.
**Validating completed work?** Follow the validation workflow.

### Risk assessment workflow (planning)

```
Risk Assessment:
- [ ] Step 1: Identify the migration scope
- [ ] Step 2: Screen each insight for applicability
- [ ] Step 3: Document risks and recommended actions
```

**Step 1: Identify the migration scope**

List the affected database objects (procedures, triggers, queries, views) and the application code that calls them.

**Step 2: Screen each insight for applicability**

Review the reference index in [references/REFERENCE.md](references/REFERENCE.md). For each entry, determine whether the migration scope contains patterns affected by that insight. Read the full reference file only when the insight is potentially relevant.

**Step 3: Document risks and recommended actions**

For each applicable insight, note the specific risk and the recommended fix pattern from the reference file. Flag any insight that requires a design decision (e.g., whether to preserve Oracle empty-string-as-NULL semantics or adopt PostgreSQL behavior).

### Validation workflow (post-migration)

```
Validation:
- [ ] Step 1: Map the migration artifact
- [ ] Step 2: Cross-check applicable insights
- [ ] Step 3: Verify integration test coverage
- [ ] Step 4: Gate the result
```

**Step 1: Map the migration artifact**

Identify the migrated object and summarize the change set.

**Step 2: Cross-check applicable insights**

For each reference in [references/REFERENCE.md](references/REFERENCE.md), confirm the behavior or test requirement is acknowledged and addressed in the migration work.

**Step 3: Verify integration test coverage**

Confirm tests exercise both the happy path and the failure scenarios highlighted in applicable insights (exceptions, sorting, `UNION ALL` behavior/performance risks, refcursor consumption, concurrent transactions, timestamps, materialized-view freshness, etc.).

**Step 4: Gate the result**

Return a checklist asserting each applicable insight was addressed, migration scripts run, and integration tests pass.
