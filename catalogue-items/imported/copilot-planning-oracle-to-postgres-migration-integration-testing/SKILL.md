---
name: planning-oracle-to-postgres-migration-integration-testing
description: 'Creates an integration testing plan for .NET data access artifacts during Oracle-to-PostgreSQL database migrations. Analyzes a single project to identify repositories, DAOs, and service layers that interact with the database, then produces a structured testing plan. Use when planning integration test coverage for a migrated project, identifying which data access methods need tests, or preparing for Oracle-to-PostgreSQL migration validation.'
---

# Planning Integration Testing for Oracle-to-PostgreSQL Migration

Analyze a single target project to identify data access artifacts that require integration testing, then produce a structured, actionable testing plan.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Oracle to Postgres migration planner](https://useaiblocks.com/skills/copilot-creating-oracle-to-postgres-master-migration-plan). Bring a codebase.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

```
Progress:
- [ ] Step 1: Identify data access artifacts
- [ ] Step 2: Classify testing priorities
- [ ] Step 3: Write the testing plan
```

**Step 1: Identify data access artifacts**

Scope to the target project only. Find classes and methods that interact directly with the database — repositories, DAOs, stored procedure callers, service layers performing CRUD operations.

**Step 2: Classify testing priorities**

Rank artifacts by migration risk. Prioritize methods that use Oracle-specific features (refcursors, `TO_CHAR`, implicit type coercion, `NO_DATA_FOUND`) over simple CRUD.

**Step 3: Write the testing plan**

Write a markdown plan covering:
- List of testable artifacts with method signatures
- Recommended test cases per artifact
- Seed data requirements
- Known Oracle→PostgreSQL behavioral differences to validate
- Coverage mapping that ensures every database touchpoint has at least one test case (or a justified set of cases for high-risk methods)

When defining recommended test cases, explicitly include:
- Text parameter behavior for both empty string and `NULL`/missing values.
- Datetime/timezone assertions, including round-trip and comparison behavior.
- Cases where destination columns use `timestamp without time zone` or `timestamp(0)`, with explicit timezone-application expectations.

## Output

Write the plan to: `.github/oracle-to-postgres-migration/Reports/{TARGET_PROJECT} Integration Testing Plan.md`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Oracle behavior baseline test writer](https://useaiblocks.com/skills/copilot-creating-oracle-to-postgres-migration-integration-tests). It takes the plan.
- The [Oracle migration risk reviewer](https://useaiblocks.com/skills/copilot-reviewing-oracle-to-postgres-migration). It takes the code change and plan.
- The [Postgres performance tuner](https://useaiblocks.com/skills/postgres-performance-tuner). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Key Constraints

- **Single project scope** — only plan tests for artifacts within the target project.
- **Database interactions only** — skip business logic that does not touch the database.
- **Oracle is the golden source** — tests should capture Oracle's expected behavior for comparison against PostgreSQL.
- **No multi-connection harnessing** — migrated applications are copied and renamed (e.g., `MyApp.Postgres`), so each instance targets one database.
