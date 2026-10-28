---
name: analysis-assumptions-log
description: Track and document analytical assumptions and decisions. Use when making analytical choices, documenting trade-offs, ensuring transparency, or creating audit trails for analytical work.
---

# Analysis Assumptions Log

# When to use
- Starting an analysis with significant scope, method, or data quality choices
- Preparing work for peer review or stakeholder sign-off
- Returning to an old analysis and needing to understand prior decisions
- Working in a regulated environment where auditability is required
- Handing off an analysis to another analyst

# Process
1. **Initialize the log** — create a log entry for the analysis with its name, date, analyst, and the decision it informs. Use `scripts/assumptions_tracker.py` to initialise a structured JSON log.
2. **Enumerate data assumptions** — document representativeness, completeness, how missing values are handled, and any known quality issues. For each assumption, record the rationale and confidence level (high/medium/low). See `references/assumption_categories.md` for the full taxonomy.
3. **Enumerate business logic assumptions** — record metric definitions, time windows, inclusion/exclusion rules, and any definitions provided by stakeholders. Note alternatives considered.
4. **Enumerate statistical assumptions** — record distribution assumptions, independence claims, stationarity, or model assumptions relevant to the methods used.
5. **Assess impact and flag critical assumptions** — for each low-confidence assumption with high impact if wrong, create a validation plan. Run `scripts/assumptions_tracker.py --report` to surface the critical list.
6. **Validate and close** — as validation occurs, update the log with results. Export `assets/assumptions_log_template.md` for peer review sign-off before delivery.

# Inputs the skill needs
- Analysis name and the decision it informs
- Data sources, time period, and population being analysed
- Key methodological choices made (and alternatives considered)
- Stakeholder-provided business rule definitions
- A document of metric definitions, if one exists, such as from the Metric definition writer
- Any known data quality issues

# Output
- `scripts/assumptions_tracker.py` — CLI tool to log assumptions, flag critical ones, and export a summary
- `assets/assumptions_log_template.md` — completed log for peer review and audit trail

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Weekly status update writer](https://useaiblocks.com/prompts/weekly-status-update-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
