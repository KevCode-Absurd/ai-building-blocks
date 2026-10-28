---
name: scaffolding-oracle-to-postgres-migration-test-project
description: 'Scaffolds an xUnit integration test project targeting Oracle in .NET solutions. Creates the test project, transaction-rollback base class, and seed data manager. Use only during Phase 3, before writing Oracle baseline integration tests. Do not invoke during Phase 6 — the PostgreSQL test project is produced by migrating this project, not by running this skill again.'
---

# Scaffolding an Integration Test Project for Oracle-to-PostgreSQL Migration

Creates a compilable, empty xUnit test project with transaction management and seed data infrastructure for a single target project. Run once per project before writing tests.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

```
Progress:
- [ ] Step 1: Inspect the target project
- [ ] Step 2: Create the xUnit test project
- [ ] Step 3: Implement transaction-rollback base class
- [ ] Step 4: Implement seed data manager
- [ ] Step 5: Verify the project compiles
```

**Step 1: Inspect the target project**

Read the target project's `.csproj` to determine the .NET version and existing package references. Match these versions exactly — do not upgrade.

**Step 2: Create the xUnit test project**

- Target the same .NET version as the application under test.
- Add NuGet packages for Oracle database connectivity (`Oracle.ManagedDataAccess.Core`) and xUnit.
- Add a project reference to the target project only — no other application projects.
- Add an `appsettings.json` configured for Oracle database connectivity.

**Step 3: Implement transaction-rollback base class**

- Create a base test class that opens a transaction before each test and rolls it back after.
- Catch and handle all exceptions to guarantee rollback.
- Make the pattern inheritable by all downstream test classes.

**Step 4: Implement seed data manager**

- Create a global seed manager for loading test data within the transaction scope.
- Do not commit seed data — transactions roll back after each test.
- Do not use `TRUNCATE TABLE` — preserve existing database data.
- Establish a naming convention for seed file location that downstream test creation will follow.

**Step 5: Verify the project compiles**

Build the test project and confirm it compiles with zero errors before finishing.

## Key Constraints

- **Phase 3 only** — this skill scaffolds the Oracle-targeting test project. The PostgreSQL test project (Phase 6) is created by copying and migrating this project; do not run this skill again at that point.
- Oracle is the golden behavior source — scaffold for Oracle only, not PostgreSQL.
- Keep to existing .NET and C# versions; do not introduce newer language or runtime features.
- Output is an empty test project with infrastructure only — no test cases.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Oracle migration risk reviewer](https://useaiblocks.com/skills/copilot-reviewing-oracle-to-postgres-migration). It takes the code change.
- The [Database schema planner](https://useaiblocks.com/skills/database-schema-planner). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
