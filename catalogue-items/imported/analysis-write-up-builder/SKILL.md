---
name: analysis-documentation
description: Structured, reproducible analysis documentation. Use when documenting analysis findings, creating analysis notebooks, ensuring reproducibility, or building analysis archives for future reference.
---

# Analysis Documentation

# When to use
- Finalising an analysis before sharing it with stakeholders
- Handing off an analysis to another team member or to a future self
- Archiving recurring analyses so they can be run again consistently
- Preparing for peer review or a formal audit
- Converting an exploratory notebook into a reference document

# Process
1. **Confirm audience and scope** — determine whether the primary reader is technical (data team), business (stakeholders), or both. For mixed audiences, use a tiered structure. See `references/audience_depth_guide.md` for calibration.
2. **Write the business context section** — state the business question, the stakeholders who requested the analysis, the decisions it informs, and the success criteria.
3. **Document data sources** — for each source, record the table or file, date range, row count, key columns, and any known quality issues or exclusions applied.
4. **Write the methodology section** — describe the analytical approach, tools and library versions, key assumptions, and important decisions made (and alternatives considered). Reference the assumptions log if one exists.
5. **Record results** — include key metrics and statistics, embed or link visualisations with descriptive captions, and present findings in order of importance.
6. **Write the insights, recommendations, and reproducibility section** — connect each finding to a business implication and a next action. Document the steps required to reproduce the analysis (data access, environment, execution order). Use `assets/analysis_doc_template.md` as the structure.

7. **Never guess a detail.** If a row count, date range, tool version or data quality issue is not in the material the user pasted, write MISSING in its place and list it for the user to fill in. Do not estimate it.

# Inputs the skill needs
- Final code (SQL, Python, notebook) and outputs (charts, tables)
- Business question and stakeholder context
- Key findings and recommendations already identified
- Data source details (tables, date ranges, sample sizes)
- Library and tool versions used

# Output
- `assets/analysis_doc_template.md` — completed analysis document covering context, data, methodology, results, and reproducibility
- Linked or embedded visualisations and code references

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Analysis assumptions logger](https://useaiblocks.com/skills/analysis-assumptions-logger). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
