---
name: funnel-truth-and-cost-per-stage
description: Reconcile CRM funnel stage truth, cost buckets, and refresh partitions from complete snapshots and explicit source bindings.
license: MIT
metadata:
  author: Riley Sorenson
  version: "0.1.0"
---

# Funnel truth and cost per stage

Use this skill when a request asks for a trustworthy CRM funnel, cost per stage, cohort or
activity reporting, late CRM corrections, partition refreshes, or reconciliation of CRM and ad
spend. It is for scoped synthetic or native SQL inputs with explicit source identities.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code with the bq command line tool:** It can run the three SQL scripts on your BigQuery data and keep the evidence.
- **Any chat AI:** Good for reading the contract files and drafting your input tables. A chat cannot run the SQL.
<!-- /needs -->

## What you need first

- The three contract files in `references/` (stage, cost, refresh) and the SQL in `references/sql/`.
  This skill does not work from SKILL.md alone. If they are not loaded, say so and ask for them.
- A complete CRM snapshot, spend rows, and the six-field campaign bindings.
- An environment that can run BigQuery Standard SQL. Live runs bill the person's own BigQuery
  project. Without BigQuery, explain the contracts and draft the input tables, and say plainly
  that nothing was run.

## If something is missing

Ask once for each missing boundary (source system and scope, time zone, as-of or report window,
date mode, completeness flags, stage set, bindings). If it is still missing, write
`MISSING: <what>` and stop that step. Never guess a time zone, a stage order or a campaign
binding. Never join on a campaign name. Never mark an incomplete snapshot complete.

## What you hand back

1. Stage ledger: one row per eligible lead and configured stage, with achieved (true, false or
   unknown), the date entered and the value.
2. Cost report: counts, spend and cost per stage in the five buckets. Cost per stage is shown
   only for matched groups. Spend repeats beside each stage by design.
3. Evidence and diagnostics: spend lines, stage values, counts of excluded and undated leads.
4. Refresh plan, only when asked: mode, reasons, target partitions, proposed watermark.

State that cost per stage is a descriptive ratio on the supplied data, not proof that the ads
caused the leads. Show the evidence and diagnostics, not only the headline numbers.

## Workflow

1. Establish stage truth from a complete, as-of snapshot. Validate source scope, configured stage
   order, timezone, completeness flags, and source-native keys. Build one ledger row for every
   eligible lead and configured stage. Keep non-primary rows in the population and keep
   attribution as a separate field.
2. Reconcile cost from the stage ledger. Resolve CRM-to-ad records only through the exact six-field
   binding and `entity_type=campaign`. Use a full outer reconciliation with `matched`, `ambiguous`,
   `unmatched`, `unattributed`, and `spend_only` buckets. Aggregate spend once, then repeat it
   for each configured stage; never add repeated stage spend together.
3. Plan a safe partition refresh. Compare complete prior and current snapshots semantically across
   all rows, select change-feed records inside the overlap and as-of boundary, and target both
   cohort and activity partitions. Replace complete current populations for targeted partitions,
   retain unaffected rows, and advance a checkpoint only with compare-and-swap semantics.

## Truth rules

- A later loss does not erase any eligible win. Aggregate all distinct opportunities before the
  stage spine; retain every winning evidence key and use the earliest eligible winning timestamp.
- Incomplete opportunity feeds make an otherwise unproven won state `unknown`, not false. Unknown
  and mixed currency values have null amounts and explicit statuses. A known zero remains zero.
- A complete snapshot with no win evidence can establish false; future evidence is excluded by the
  as-of boundary and reported diagnostically. Missing or blank qualification status is unknown.
- Cohort and activity dates are independently derived in the declared IANA timezone. Undated
  achieved stages remain in the ledger but do not enter a dated activity bucket.
- Value sums are exact NUMERIC values and are never converted across currencies. Do not infer a
  cross-system join from a bare identifier or from a campaign name.

## Required boundaries

Inputs must declare source system, source scope, as-of or report window, timezone, date mode,
source completeness, and the configured stage set. Cost inputs must include explicit six-field
bindings (`crm_source_system`, `crm_source_scope`, `ad_source_system`, `ad_source_scope`,
`platform`, `entity_type`) and use campaign bindings only. Refresh inputs must include complete
prior/current snapshots, prior and current timezones, watermark, overlap, change-feed status, and
an as-of time.

Use the native SQL contracts in `references/stage-contract.md`, `references/cost-contract.md`,
and `references/refresh-contract.md` as the authoritative input/output definitions. The shared
channel and monetary boundary is in `references/channel-contract.md`.

## Output discipline

For native SQL, return complete ledgers and reconciliation evidence, including nulls, false values,
empty arrays, ordering, diagnostic counts, fallback reasons, target partitions, and proposed
watermark. Evaluation uses a compact projection of those native results and checks every selected
field. Do not
silently substitute current data for a missing snapshot, coerce unknown money to zero, or report a
partial refresh as complete. Native SQL execution belongs to an environment with BigQuery; an
offline fixture check validates literal contracts and does not execute SQL.

For operational use, follow `references/implementation.md`. The fixed evaluation cases in
`references/eval-cases.json` cover stage gaps and multi-opportunity truth, unknown and mixed money,
all five reconciliation buckets, timezone and undated activity, late rewrites, deletion, and
timezone-triggered full refresh. See [evaluation status and revision history](references/eval.md) for completed runs and pending revisions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Conversion funnel analyst](https://useaiblocks.com/skills/conversion-funnel-analyst). It takes the spreadsheet.
- The [Lead source field checker](https://useaiblocks.com/skills/lead-source-field-checker). It takes the spreadsheet.
- The [Lead to ad matcher](https://useaiblocks.com/skills/lead-to-ad-matcher). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
