---
name: creating-oracle-to-postgres-master-migration-plan
description: 'Discovers all projects in a .NET solution, classifies each for Oracle-to-PostgreSQL migration eligibility, and produces a persistent master migration plan. Use when starting a multi-project Oracle-to-PostgreSQL migration, creating a migration inventory, or assessing which .NET projects contain Oracle dependencies.'
---

# Creating an Oracle-to-PostgreSQL Master Migration Plan

Analyze a .NET solution, classify every project for Oracle→PostgreSQL migration eligibility, and write a structured plan that downstream agents and skills can parse.

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
- [ ] Step 1: Discover projects in the solution
- [ ] Step 2: Classify each project
- [ ] Step 3: Confirm with user
- [ ] Step 4: Write the plan file
```

**Step 1: Discover projects**

Find the Solution File (it has a `.sln` or `.slnx` extension) in the workspace root (ask the user if multiple exist). Parse it to extract all `.csproj` project references. For each project, note the name, path, and type (class library, web API, console, test, etc.).

**Step 2: Classify each project**

Scan every non-test project for Oracle indicators:

- NuGet references: `Oracle.ManagedDataAccess`, `Oracle.EntityFrameworkCore` (check `.csproj` and `packages.config`)
- Config entries: Oracle connection strings in `appsettings.json`, `web.config`, `app.config`
- Code usage: `OracleConnection`, `OracleCommand`, `OracleDataReader`
- DDL cross-references under `.github/oracle-to-postgres-migration/DDL/Oracle/` (if present)

Assign one classification per project:

| Classification | Meaning |
|---|---|
| **MIGRATE** | Has Oracle interactions requiring conversion |
| **SKIP** | No Oracle indicators (UI-only, shared utility, etc.) |
| **ALREADY_MIGRATED** | A `-postgres` or `.Postgres` duplicate exists and appears processed |
| **TEST_PROJECT** | Test project; handled by the testing workflow |

**Step 3: Confirm with user**

Present the classified list. Let the user adjust classifications or migration ordering before finalizing.

**Step 4: Write the plan file**

Save to: `.github/oracle-to-postgres-migration/Reports/MasterMigrationPlan.md`

Use this exact template — downstream consumers depend on the structure:

````markdown
# Master Migration Plan

**Solution:** {solution file name}
**Solution Root:** {REPOSITORY_ROOT}
**Created:** {timestamp}
**Last Updated:** {timestamp}

## DDL Artifacts

**Location:** {path to DDL artifacts, e.g., `.github/oracle-to-postgres-migration/DDL/`}
**External tool used:** {Yes / No} — {If Yes, name the tool (e.g., `ora2pg`) and note that Phase 4 (Schema & DDL Migration) can be skipped; PostgreSQL DDL artifacts already exist.}

## Solution Summary

| Metric | Count |
|--------|-------|
| Total projects in solution | {n} |
| Projects requiring migration | {n} |
| Projects already migrated | {n} |
| Projects skipped (no Oracle usage) | {n} |
| Test projects (handled separately) | {n} |

## Project Inventory

| # | Project Name | Path | Classification | Notes |
|---|---|---|---|---|
| 1 | {name} | {relative path} | MIGRATE | {notes} |
| 2 | {name} | {relative path} | SKIP | No Oracle dependencies |

## Migration Order

1. **{ProjectName}** — {rationale, e.g., "Core data access library; other projects depend on it."}
2. **{ProjectName}** — {rationale}
````

Order projects so that shared/foundational libraries are migrated before their dependents.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Oracle to Postgres migration test planner](https://useaiblocks.com/skills/copilot-planning-oracle-to-postgres-migration-integration-testing). It takes the plan.
- The [Oracle migration risk reviewer](https://useaiblocks.com/skills/copilot-reviewing-oracle-to-postgres-migration). It takes the code change and plan.
- The [Oracle behavior baseline test writer](https://useaiblocks.com/skills/copilot-creating-oracle-to-postgres-migration-integration-tests). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
