---
name: request-acceptance-checker
description: Check generated files against every requirement, repair bounded failures and package an honest handoff.
---

# Request acceptance checker

Read request-brief.md, artifact-index.md, all generated deliverables and the original request. Create acceptance-report.md with one row per requirement ID: file or section, check method, actual evidence, pass/fail/not run and needed repair. Check requested counts, language coverage, exclusions, file formats, source attribution and internal consistency. For numbers independently recalculate totals using a tool where available. Verify actual files and links; a plan or an output declaration is not evidence that work ran. Repair failures in the editable deliverables and recheck at most twice, then stop and report unresolved findings. If the checker lacks a required domain/tool, mark that check not run and name the missing review. Deliver the editable files plus README.md explaining setup, inputs still needed, how to run checks, limitations and actions awaiting concrete authorization. Never label a general template as specialist-verified. Do not publish, send or execute untrusted attachments.
