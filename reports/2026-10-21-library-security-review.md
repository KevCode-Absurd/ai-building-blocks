# Catalogue security and copy review

Date: 2026-10-21. Scope: the complete local catalogue, including retained items withheld from publication.

## What was checked

- 4,349 block folders, 25,664 files, approximately 232 MB, including skill instructions, supporting scripts, references, SVGs, metadata and evaluation fixtures.
- One bundled tar archive: all 45 files inspected without extraction or execution. No unsafe paths, links, executable members or configured pattern matches.
- Static checks for instruction overrides, concealed actions, approval bypasses, destructive commands, remote shell installers, encoded execution, credential patterns, bidirectional controls, hidden HTML instructions and active SVG content. Symlinks and executable binary formats are checked too.
- SHA-256 fingerprints for every block folder. Individual findings carry the file, line, rule and line digest, without logging potential secret values. See `library-audit.json` and `archive-audit.json`.
- Every published block's files and dependency references are checked by the unit suite. Rendered page HTML is checked for executable elements and unsafe URLs. Adversarial Markdown tests include encoded JavaScript links, raw script tags, data URLs and credential-bearing URLs.

The final scan produced 338 pattern candidates. No executable binary, active SVG, bidirectional-control or structural-path finding was reported. The two credential-shaped strings are test fixtures: an all-placeholder staging key in the memory extractor's demonstration, and AWS's documented example key in the Terraform scanner's deliberately insecure demo input. They are not live credentials discovered in this work.

## Decisions

| Finding class | Review and disposition |
|---|---|
| Image safety bypass | `stable-diffusion-image-maker` recommends disabling a safety checker. Quarantined; no published page, skill text or archive. |
| Git check bypass | `secrets-hygiene-checker` suggests `git commit --no-verify`. Quarantined pending replacement. |
| Dependent workflows | The secrets storage workflow and weekly dependency/security agent depend on the quarantined checker. Both are withheld by dependency closure, rather than shipping broken or risky packs. |
| Prompt override and encoded payload examples | Reviewed in the guardrail, injection-defense, security-auditor and attack-test material. They are attack fixtures or detection examples, not instructions adopted by this task. No example payload was run. |
| Hidden HTML matches | Attack fixtures, lint directives, ordinary code comments, or escaped copies of source text inside evaluation logs. The source remains data; raw HTML is escaped when displayed. |
| Concealed-action matches | Mostly prohibitions against silently changing data or task scope, domain descriptions of unexpected changes, or narration preferences during read-only gathering. No concealed recipient or exfiltration instruction was adopted. |
| Remote installers and destructive command examples | Retained as operational risk, not certified safe automation. They include official installer examples, cache/build cleanup, temporary-directory cleanup and history-rewrite guidance. A future execution still requires review of the specific command, target, permissions and remote dependency. |

`catalogue-items/quarantine.yaml` records the two direct decisions. The build calculates transitive dependencies, removes all four entries and their generated assets, and checks the remaining graph. Product recommendation links to the withheld image skill were also removed.

The published catalogue contains 4,345 entries. Workflow and agent packs include action boundaries: source text cannot grant permissions; sending, spending, deleting, publishing, live-system changes and schedules require authorization for the concrete action. Agent exports retain their coordinator, branch conditions and saved-state rules.

## Source imports

- GitHub's Awesome Copilot collection: 104 curated skills from 435 discovered folders, source revision `613efc8`. All 287 source files compared byte for byte with the clone; no differences. Every import includes its license and provenance. The import map and per-repository report record all selected and skipped folders. This is a curated catalogue expansion, not a mirror of all 435 folders or all upstream agents.
- mgonto's executive-assistant repository: six skills discovered at revision `28f5065`, no redistribution license. No source prose, creator contact details, configuration or scripts were copied. Five portable executive jobs were written independently; existing voice editing covers the sixth job. The original versions expose recipients, separate drafts from sends, keep task completion explicit and handle interrupted actions without blind retries.
- Added 24 workflows and 3 agents with concrete deliverables, conditions, source requirements and resume rules. Creating their files does not activate a schedule or run an external action.

## Customer-facing copy

All catalogue metadata was screened for a clear job/result, missing copy, hard-to-read summaries and thin introductions. Expanded 2,191 introductions using existing job-specific copy, with input, result or method detail. Four summaries were rewritten to replace vague testing/resume language with concrete results. Imported instruction files were left unchanged.

The final metadata scan has one heuristic flag: `teaching-reflection-prompts` uses “help you,” but its summary names the input, questions returned and reflection goal. It was reviewed and retained. All 1,714 pages covered by the existing page-format linter pass. New entries have no model-performance “Tested” badge.

## Limits of this evidence

This is a static security review and application regression pass, not a guarantee that arbitrary model executions are safe or useful. Imported scripts were not executed. Remote installers, external services, model behavior and future dependency changes are outside this snapshot. No paid model evaluation across every skill was run, and static/structural checks were not represented as golden-set performance tests.

## Final refresh, 22 October 2026

Reran the static scan after the display-copy changes. It produced the same counts and candidate set: 4,349 folders, 25,664 files, 338 candidates and no structural findings. Source instruction files remain unchanged. All 4,345 published entries pass the generated-asset, dependency-closure and sanitized-HTML checks. The final dependency audit reports zero known npm advisories; neither result certifies arbitrary future execution as safe.
