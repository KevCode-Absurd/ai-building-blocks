---
name: schema-mapper
description: Document column-level mappings between source and target schemas. Use when integrating data from multiple systems, designing ETL transformations, or documenting how raw fields become analytical assets.
---

# Schema Mapper

# When to use
- Integrating a new data source and need to map its fields to the existing data model
- Designing an ETL or dbt transformation and need to document the logic
- Auditing what happened to a field during a migration
- Onboarding a new analyst who needs to understand where columns come from
- Preparing a data catalog entry that requires lineage at the column level

# Process
1. **Collect the source schema** — list every column name, data type, nullable flag, and a brief description. Pull from `INFORMATION_SCHEMA`, a data dictionary, or the source API documentation.
2. **Collect the target schema** — same structure for the destination table or model. If the target doesn't exist yet, draft it based on the analytical requirements.
3. **Map source columns to target columns** — for each target column, identify the source column(s) that feed it. Record direct mappings (rename only) and derived mappings (calculation, type cast, lookup join). Use `scripts/schema_compare.py` to automate direct-name matches.
4. **Document transformation rules** — for each derived mapping, write the exact transformation (e.g., `CAST(amount_cents AS FLOAT) / 100.0`, `COALESCE(first_name, email)`).
5. **Flag gaps** — identify target columns with no source (need to be created or defaulted) and source columns with no target (dropped or deferred). Record a decision for each.
6. **Produce the mapping document** — complete `assets/schema_mapping_template.md` with the full column inventory and share for review before implementation.

# Inputs the skill needs
- Source schema: table name, column names, data types, and descriptions
- Target schema: same, or the analytical requirements that define it
- Any existing transformation logic (SQL, dbt models, Python code)
- Business rules that govern how values should be transformed or defaulted
- Stakeholder who can resolve ambiguous fields

# Output
- `scripts/schema_compare.py` — compares two schemas and finds direct-name matches and type mismatches
- `assets/schema_mapping_template.md` — completed column-by-column mapping with transformation rules, gaps, and decisions
- Optional: transformation SQL or dbt YAML generated from the mapping

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Data catalog entry writer](https://useaiblocks.com/skills/data-catalog-entry-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
