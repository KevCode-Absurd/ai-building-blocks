---
name: crm-attribution-profiler
description: Profile source-scoped CRM attribution fields against ad-history keys with exact normalized matching, configurable evidence thresholds, and safe verdict diagnostics.
license: MIT
metadata:
  author: Riley Sorenson
  version: "0.1.0"
---

# CRM attribution profiler

Use this skill when a user needs to determine whether CRM fields can support paid
attribution joins. It produces measured `propose`, `corroborate`, `reject`,
`capture_missing`, and `pre_window` verdicts from source-scoped CRM rows and ad-history
rows. It does not prove causal attribution, spend, or identity across systems.

Before running the profiler, provide an explicit `ad_scope_bindings` entry for every CRM
to ad join. The binding names both source systems and scopes, platform, and entity type;
never infer a join from a bare ID. Supply all threshold values in `config.thresholds`.

Read [api.md](references/api.md) for the input/output contract and date/key semantics.
Use [fixtures.json](references/fixtures.json) for synthetic adversarial examples and run
`node scripts/run-checks.mjs` after changes. Run
`node scripts/check-fixture-sensitivity.mjs` after changing fixtures or the harness to
prove that each expected result is actually checked. Use [eval.md](references/eval.md) for
realistic evaluation prompts.

The runtime retains only field descriptors, counts, shape distributions, rates, verdicts,
and stable diagnostic codes in its output. Do not publish raw CRM rows, raw customer
values, emails, or production identifiers.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **Your lead list** (yours): your leads or open deals, exported from your CRM or a sheet.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, your lead list. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Metric drop investigator](https://useaiblocks.com/skills/metric-drop-investigator). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
