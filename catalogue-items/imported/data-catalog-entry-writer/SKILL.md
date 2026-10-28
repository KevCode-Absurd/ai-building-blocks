---
name: data-catalog-entry
description: Create standardized metadata for data assets. Use when documenting new datasets, building data catalogs, improving data discoverability, or creating data dictionaries for teams.
---

# Data Catalog Entry

# When to use
- A new table, view, or dataset has been created and needs to be discoverable
- Analysts keep asking the same questions about a table's meaning or ownership
- A compliance or audit requirement mandates documentation of sensitive data
- Onboarding new team members who need to understand available data assets
- Auditing catalog completeness to find undocumented tables

# When not to use
- A one-off scratch table or an unpublished draft: add a short note in the file or sheet instead.
- Your team has no data catalog: put the entry on a wiki page or in a shared data dictionary.
- You need the table built or fixed: ask your data engineer. This only writes the documentation.

# Process
1. **Extract technical metadata** — pull schema, column names, types, primary keys, foreign keys, and row count from `INFORMATION_SCHEMA` or the source system. Use `scripts/catalog_extractor.py` to automate this for database tables.
2. **Collect business context** — interview the data owner to capture the business purpose, owning team, criticality (critical / high / medium / low), and known use cases. Record the business-friendly display name.
3. **Write column descriptions** — for each column, write a one-sentence plain-language description, note example values, and document any business rules (valid values, constraints, format requirements).
4. **Assess data quality** — calculate from the data completeness, freshness (hours since last update), and duplicate rate. Write "not measured" for any figure you could not check against the data. Never estimate a quality figure. Document known issues and how they affect downstream use.
5. **Document lineage** — record upstream sources (where the data comes from) and downstream consumers (dashboards, models, reports that depend on it).
6. **Add governance details and publish** — specify access level (public/restricted/confidential), sensitivity (PII, financial, health), compliance tags, retention policy, and access instructions. Complete `assets/catalog_entry_template.md` and submit to the catalog.

# Inputs the skill needs
- Connection or export from the database/source system for technical metadata
- Data owner contact for business context interview
- Knowledge of upstream sources and downstream consumers
- Applicable governance policies (PII classification, retention rules)
- Any existing partial documentation or data dictionary

# Output
- `scripts/catalog_extractor.py` — extracts schema and basic stats from a database table
- `assets/catalog_entry_template.md` — completed catalog entry with technical, business, quality, lineage, and governance sections

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shared business record planner](https://useaiblocks.com/skills/shared-business-record-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
