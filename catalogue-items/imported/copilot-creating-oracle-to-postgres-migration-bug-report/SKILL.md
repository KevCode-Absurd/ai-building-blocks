---
name: creating-oracle-to-postgres-migration-bug-report
description: 'Creates structured bug reports for defects found during Oracle-to-PostgreSQL migration. Use when documenting behavioral differences between Oracle and PostgreSQL as actionable bug reports with severity, root cause, and remediation steps.'
---

# Creating Bug Reports for Oracle-to-PostgreSQL Migration

## When to Use

- Documenting a defect caused by behavioral differences between Oracle and PostgreSQL
- Writing or reviewing a bug report for an Oracle-to-PostgreSQL migration project

## When Not to Use

- General application bugs with no Oracle-to-PostgreSQL cause: use the team's normal bug report template.
- Work that is not a migration from Oracle to PostgreSQL.

## Steps

1. Gather the evidence. Ask once for anything missing, and never invent it: the seed data, the exact operation or call, the Oracle result, the PostgreSQL result, the failing test name, the affected file paths, and the project name. Mark any field you could not fill as MISSING.
2. Read [references/BUG-REPORT-TEMPLATE.md](references/BUG-REPORT-TEMPLATE.md) and fill each field in order.
3. Choose the severity from the impact: how many users, rows or endpoints it affects, and whether data is wrong or only slow.
4. Remove passwords, customer data and other sensitive values from every SQL excerpt and log.
5. Save the file under the name given in Filename Convention, and show the path.
6. End with the next step: attach the report to the ticket, then re-run the validation steps on both databases once the fix is in.

## Bug Report Format

Use the template in [references/BUG-REPORT-TEMPLATE.md](references/BUG-REPORT-TEMPLATE.md). Each report must include:

- **Status**: ✅ RESOLVED, ⛔ UNRESOLVED, or ⏳ IN PROGRESS
- **Component**: Affected endpoint, repository, or stored procedure
- **Test**: Related automated test names
- **Severity**: Low / Medium / High / Critical — based on impact scope
- **Problem**: Expected Oracle behavior vs. observed PostgreSQL behavior
- **Scenario**: Ordered reproduction steps with seed data, operation, expected result, and actual result
- **Root Cause**: The specific Oracle/PostgreSQL behavioral difference causing the defect
- **Solution**: Changes made or required, with explicit file paths
- **Validation**: Steps to confirm the fix on both databases

## Oracle-to-PostgreSQL Guidance

- **Oracle is the source of truth** — frame expected behavior from the Oracle baseline
- Call out data layer nuances explicitly: empty string vs. NULL, type coercion strictness, collation, sequence values, time zones, padding, constraints
- Client code changes should be avoided unless required for correct behavior; when proposed, document and justify them clearly

## Writing Style

- Plain language, short sentences, clear next actions
- Present or past tense consistently
- Bullets and numbered lists for steps and validations
- Minimal SQL excerpts and logs as evidence; omit sensitive data and keep snippets reproducible
- Stick to existing runtime/language versions; avoid speculative fixes

## Filename Convention

Save bug reports to `.github/oracle-to-postgres-migration/Reports/{ProjectName}/BUG_REPORT_<DescriptiveSlug>.md` where:
- `{ProjectName}` is the project's assembly/folder name with spaces normalized to `-` (e.g. `MyApp.DataAccess`)
- `<DescriptiveSlug>` is a short PascalCase identifier describing the defect (e.g., `EmptyStringNullHandling`, `RefCursorUnwrapFailure`)
