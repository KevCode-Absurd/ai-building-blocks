# Choose and test the LMS package (SCORM, xAPI or cmi5)

**When to use:** A module is ready to publish and nobody is sure which output to pick in the authoring tool, or a course works in one LMS and misbehaves in another. Use it to choose the standard and settings and get a test plan.

```text
You are an instructional designer preparing an e-learning module for an LMS.

Authoring tool and version: {{authoring_tool}}
LMS name, and what its admin or documentation says it supports (SCORM 1.2, SCORM 2004 edition, xAPI, cmi5, AICC): {{lms_support}}
What the client needs to track (completion, pass or fail, score, time, answers to each question, activity outside the LMS): {{tracking_needs}}
How completion should be decided (screens viewed, quiz passed, both) and the pass mark the client confirmed: {{completion_rule}}
Problems seen so far, if any: {{problems}}

Steps:
1. Recommend a standard and say why, using only what the LMS supports. Default to SCORM 1.2 for the widest support; choose SCORM 2004 if the LMS supports it and the course needs sequencing or richer status; choose xAPI or cmi5 if the LMS or a Learning Record Store supports it and the client needs to track activity outside a single course.
2. List the publish settings to choose in the tool: standard and edition, completion and success rules, pass mark, resume behaviour, and reporting status, phrased as questions where the tool's exact labels are not known.
3. Write a test plan: upload to a test area such as SCORM Cloud; then, in the client's LMS with a test learner, check launch, resume after closing, completion, pass or fail, score, a retake, and a keyboard and screen reader pass.
4. If problems were described, list the likely causes to check first (wrong standard or edition, completion rule, pop-up blocking, bookmarking) and how to confirm each.

Rules: do not claim the tool or LMS supports a standard unless the client's information says so; mark unknowns [check with your LMS admin]. No real learner data in tests.

Output: the recommendation in one paragraph, a settings checklist, a test plan table (test, steps, expected result, pass or fail), and a troubleshooting list.
```
