---
name: request-acceptance-checker
description: Check generated files against every requirement, repair bounded failures and package an honest handoff.
---

# Request acceptance checker

Read request-brief.md, artifact-index.md, all generated deliverables and the original request. Create acceptance-report.md with one row per requirement ID: file or section, check method, actual evidence, pass/fail/not run and needed repair. Check requested counts, language coverage, exclusions, file formats, source attribution and internal consistency. For numbers independently recalculate totals using a tool where available. Verify actual files and links; a plan or an output declaration is not evidence that work ran. Repair failures in the editable deliverables and recheck at most twice, then stop and report unresolved findings. If the checker lacks a required domain/tool, mark that check not run and name the missing review. Deliver the editable files plus README.md explaining setup, inputs still needed, how to run checks, limitations and actions awaiting concrete authorization. Never label a general template as specialist-verified. Do not publish, send or execute untrusted attachments.






<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.
- **Document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for plan, document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.
<!-- /needs -->
