---
name: migrating-oracle-to-postgres-stored-procedures
description: 'Migrates Oracle PL/SQL stored procedures to PostgreSQL PL/pgSQL. Translates Oracle-specific syntax, preserves method signatures and type-anchored parameters, leverages orafce where appropriate, and applies explicit collation mapping (`COLLATE "C"` only when appropriate, locale collations when required). Use when converting Oracle stored procedures or functions to PostgreSQL equivalents during a database migration.'
---

# Migrating Stored Procedures from Oracle to PostgreSQL

Translate Oracle PL/SQL stored procedures and functions to PostgreSQL PL/pgSQL equivalents.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code or Copilot in your editor:** They can read your Oracle files and write each PostgreSQL file in place.
- **A PostgreSQL test database:** You need one to compare results with Oracle before you deploy.
<!-- /needs -->

## When Not to Use

- Moving data or table structure. This skill converts procedures and functions only.
- Converting the application code that calls the database.
- Checking finished migration work for risks. Use a migration review skill for that.

## Inputs

The skill expects the Oracle procedures, the Oracle and PostgreSQL table and view definitions, and the project name. The paths below are the default layout. If the files are somewhere else, or only pasted into the chat, ask once for their location and use that. If the PostgreSQL table definitions are missing, say so, translate with the Oracle types, and mark the types as unchecked. Never invent a table or column.

## Workflow

```
Progress:
- [ ] Step 1: Read the Oracle source procedure
- [ ] Step 2: Translate to PostgreSQL PL/pgSQL
- [ ] Step 3: Write the migrated procedure to Postgres output directory
```

**Step 1: Read the Oracle source procedure**

Read the Oracle stored procedure from `.github/oracle-to-postgres-migration/DDL/Oracle/Procedures and Functions/`. Consult the Oracle table/view definitions at `.github/oracle-to-postgres-migration/DDL/Oracle/Tables and Views/` for type resolution.

**Step 2: Translate to PostgreSQL PL/pgSQL**

Apply these translation rules:

- Translate all Oracle-specific syntax to PostgreSQL equivalents.
- Preserve original functionality and control flow logic.
- Keep type-anchored input parameters (e.g., `PARAM_NAME IN table_name.column_name%TYPE`).
- Use explicit types (`NUMERIC`, `VARCHAR`, `INTEGER`) for output parameters passed to other procedures — do not type-anchor these.
- Do not alter method signatures.
- Do not prefix object names with schema names unless already present in the Oracle source.
- Leave exception handling and rollback logic unchanged.
- Do not generate `COMMENT` or `GRANT` statements.
- Apply collation intentionally when ordering text:
  - Use `COLLATE "C"` only when Oracle-compatible binary ordering is required and no other sort order is specified.
  - If Oracle used explicit linguistic sorting (for example `NLS_SORT = French`), map to an explicit PostgreSQL locale collation instead of `"C"`.
  - Use `SELECT collname, collprovider, collcollate, collctype FROM pg_collation ORDER BY collname;` to discover collations in the target environment.
- Treat `UNION ALL` as a review checkpoint. Validate plan quality per branch and restructure if combined-branch planning causes regressions (for example, unexpected sequential scans on large tables).
- Leverage the `orafce` extension when it improves clarity or fidelity.

Consult the PostgreSQL table/view definitions at `.github/oracle-to-postgres-migration/DDL/Postgres/{ProjectName}/Tables and Views/` for target schema details.

**Step 3: Write the migrated procedure to Postgres output directory**

Place each migrated procedure in its own file under `.github/oracle-to-postgres-migration/DDL/Postgres/{ProjectName}/Procedures and Functions/{PACKAGE_NAME_IF_APPLICABLE}/`. One procedure per file.

**After step 3, reply with a short note for each procedure** (not inside the SQL file, since this skill does not generate `COMMENT` statements):

```text
Procedure: <name>
Output: <PostgreSQL file path>
Translated: <Oracle syntax that changed>
Kept the same: <signature, parameter types, error handling>
Sort order: <C, locale name, or not used, and why>
Check before deploy: <UNION ALL queries to plan-check, orafce use, open questions>
```

**Next steps:** run each migrated procedure against a PostgreSQL test database with the same inputs as Oracle, compare the results, and review each flagged behavior change before deploying.

> `{ProjectName}` is the project's assembly/folder name with spaces normalized to `-` (e.g. `MyApp.DataAccess`). This matches the path used by the agent and other migration skills.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Oracle migration risk reviewer](https://useaiblocks.com/skills/copilot-reviewing-oracle-to-postgres-migration). It takes the code change.
- The [Process and behavior change planner](https://useaiblocks.com/skills/structure-behaviour-split). It takes the code change.
- The [Database schema planner](https://useaiblocks.com/skills/database-schema-planner). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
