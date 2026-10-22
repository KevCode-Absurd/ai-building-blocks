# Portable workflow execution contracts

Implemented 22 October 2026 against Workflow_Execution_Implementation_Specification.txt, version 1.0.

This application composes and downloads workflows. It does not execute the downloaded work. This release implements the portable-package phase of the specification. A package cannot guarantee file discovery, obedience, output quality or identical generation across arbitrary hosts. No 99.95% reliability claim has been measured or made.

## What users receive

Manual canvas workflows, free and AI compositions, library workflows, agents, growth plans, source-authoring packs and structured workflows saved in My Space use `buildHandoffZip`. Each includes:

- `START_HERE.txt`, `HANDOFF.md`, `EXECUTION.md` and a goal-specific `OPTIONAL_USER_PROMPT.txt`. Essential input, order and evidence rules are in the entry documents even when no prompt is pasted.
- `workflow.json` with an additive `abb-execution/1` contract, stable step IDs, dependencies, input policies, output/check obligations, unknown capabilities, and portable assurance.
- `inputs.json` with one unaccepted record per consumer/input, including optional inputs and unresolved upstream artifact revisions. Saved context and planning choices remain unvalidated. A producer candidate is not an accepted artifact.
- Original selected skill text, the complete supplied support-file archives, assigned minds, and the governing parent workflow when library steps are expanded. Step notes remain in the workflow contract, separate from source skills.
- `manifest.json` with byte lengths and SHA-256 hashes, `requirements.json` with global rules and explicitly pending skill coverage, `reference-links.json`, `export-checks.json`, and `templates/execution-report.json`.

The exporter checks actual workflow cycles, missing endpoints, duplicate IDs, input binding declarations, missing skill assets, safe archive metadata and sizes, case-colliding paths, Windows reserved names, symlinks, concrete local reference/template links, known credential patterns, and archive round-trip hashes. Reciprocal catalogue support links are resource relationships; bundling their closure does not schedule their execution.

Concrete Markdown links to local reference/template directories count as resolved only when their contents are present. Prose paths, conditional activation, examples, external resources and the meaning of instructions require skill preflight. The exporter does not certify complete semantic compatibility. The credential scan covers known token patterns and is not a comprehensive secret audit.

## How execution is requested

The shared rules require the host assistant to read the entry documents, apply each full skill and active reference before its action, search authorized existing context, and ask for missing required material. When useful optional files are absent, it asks whether to attach or create them with a suitable existing skill and offers proceeding without them. A new preparation step needs a visible amendment; an AI draft never becomes human confirmation.

For a required brand file, the instructions specifically identify `00-start-here.md`, commonly inside `brand-brain/`, and direct the host to the relevant indexed files. A host without file access must explain that limitation and ask for attachments or pasted content. The website itself does not search a user's local disk or private chat history.

The declared numbered sequence is the default. Reusing an existing artifact does not waive the step or its checks. Parallel candidates require authorization. Conflicts, missing required tools, failed checks and pending required review block the affected path. The report separates output quality from instruction compliance and binds evidence to artifact revisions. All exported run states start unexecuted and all execution checks start NOT_RUN.

The top download controls have a matching optional Copy AI instructions control. It uses the saved goal without rewriting its meaning or inventing a confirmed goal. Unsaved goals retain `[MY GOAL]`. Clipboard errors expose selectable text and never report a successful copy.

## Authoring and migration

The authoring model is the saved Flow plus the shared execution policy. Prose and JSON are generated together from it; the export inventory hashes their actual bytes. The existing `abb-workflow/1` format is retained with additive contract fields. Old saved workflows receive the current contract on their next export; existing downloaded ZIPs do not change.

Expanded library workflows retain `governingSkills` through the canvas, saved state, and shared editable links (`gs`). A legacy workflow with an exact library name and step sequence can recover its parent governance on export. The parent instructions remain visible; conflicts with an edited sequence require resolution at preflight. Shared/editable imports reject unavailable steps, over-limit plans, oversized instructions, invalid dependencies, missing assigned minds and invalid bindings rather than silently dropping or truncating them. An invalid share does not open a previously saved workflow as a substitute.

Source-authoring uses the same exporter. `AUTHORING.md` preserves the three authoring passes and requires approval of the actual numbered skeleton. Its framework tells the host to carry these execution rules into the resulting workflow and to obtain full reused skills and references. Writing a new workflow is distinct from executing it. A library description is not a bundled skill.

My Space and shared/public Space item cards now offer the same workflow download and copy controls. Saving or moving a structured workflow preserves its goal, notes, governing skills, assigned team, overseer and step configuration. Opening it in the builder validates the original graph before link serialization; unavailable steps or invalid edges produce a persistent error. A valid workflow too large for a builder link can still download as a complete package. Unrelated private profiles are excluded. Older items cannot recover fields that were never stored; absent information remains unresolved.

A Space item containing only text downloads as an unverified source bundle. Its entry documents, shared rules, original `source.md`, optional prompt, manifest and `SOURCE_STATUS.json` identify execution as BLOCKED. It does not invent a workflow definition, skill files, confirmations or execution evidence. The host must obtain and verify the actual workflow and required resources before execution. Source privacy and semantic review remain NOT_RUN. The Space tests use mocked account/Space APIs with actual browser interactions and downloaded ZIPs; deployment verification is recorded separately.

Mind collections distinguish standalone skills from workflows, routines and agents. Workflow entries remain visible as links to their complete workflow pages and download through the central exporter. The standalone mind-and-skills bundler rejects workflow entries before loading files; it cannot quietly ship a workflow as one incomplete skill. This closes 33 workflow links found in the catalogue's mind skill lists without inventing an execution sequence for a collection of separate jobs.

## Specification coverage and acceptance mapping

| Specification sections | Implementation and verification | Remaining limits |
| --- | --- | --- |
| 1–4: promise, invariants, authority, modes | Shared policy, portable assurance, entry/handoff prompt parity; unit tests for no invented acceptance | No enforced execution mode or cross-model success measurement |
| 5: layout and export | Shared exporter, Space workflow/source wrappers, inventory, archive inspection, round-trip hashes; export and browser tests | No general package ZIP importer, trusted signatures or comprehensive secret scan |
| 6: composition and registry | Full selected resources, support closure, parent governance, original source hashes | Legacy capability/license semantics are not inferred or certified |
| 7: requirement extraction | Stable global rule IDs, source inventory and explicit pending coverage | Full skill/reference obligation extraction and semantic classification are NOT_RUN |
| 8–9: inputs and intake | Required/optional definitions, per-consumer records, producer candidates, unvalidated saved context, search/ask policies | No authoritative acceptance service or field-level human decision store |
| 10–11: steps and order | IDs, graph checks, bindings, exact ordering, optional authorized parallel candidates | Skill-internal branches/loops require host interpretation and review |
| 12–13: quality and evidence | Full original skill criteria, output/check contracts, distinct quality/compliance report, revision rules | No domain evaluator service; host evidence remains assistant-reported |
| 14–16: states and runner | Honest NOT_STARTED/NOT_RUN templates and prerequisite instructions | No execution scheduler, transition enforcement, immutable artifact store or tool broker |
| 17: context | Complete bundled instructions/resources and truncation rules | No model-invocation read receipts, token-budget enforcement or complete source classification |
| 18–20: capabilities, permission, recovery | Unknown capabilities, scoped action rules, stale-review rules and interrupted-action reconciliation instructions | No capability adapters, durable checkpoints or external action retries are executed by this app |
| 21–22: identity and providers | File-byte hashes, fixed ZIP timestamps/order, common provider-neutral prompt | No artifact replay service or provider behavior certification |
| 23–24: UX and optional prompt | Top downloads/prompt including Space item cards, selectable fallback, input reminders, persistent import errors, entry documents; desktop/mobile browser tests | Reminder checkboxes do not accept inputs; file access depends on the host |
| 25: safety | Archive path/count/size/ratio/attribute checks, secret-pattern check, source/data boundaries | This is not a complete hostile-package security assessment |
| 26: tests | Actual exporter contract tests, malformed input/archive tests, real browser ZIP/copy/mobile tests | No live ChatGPT/Claude/Gemini attachment-only outcome study |
| 27–28: rollout and acceptance | Additive migration, portable phase only, explicit pending checks | Runner-dependent acceptance items remain unimplemented rather than marked passed |
| 29: worked examples | General contracts plus representative custom, source and library export checks | Financial, spreadsheet, render and external-action examples are not executed by this product |
| 30–32: deliverables and references | This mapping, source changes, tests, report and limitations | Companion ZIP/templates were not supplied; no companion scenarios were claimed executed |

The specification's INV-01–03, 05–09, 11–16 are expressed as portable instructions and metadata. INV-04 and INV-10 cannot be enforced during execution without an application-controlled runner. Package validation can block an invalid export; it cannot make another assistant's execution state trustworthy. Invariant coverage during model execution is therefore unverified.

## Verification and next work

Run the unit suite from `site/` with `npm run test:unit`, and TypeScript with `npx tsc -b`. The focused browser suite uses `playwright.execution.config.ts`; set `EXECUTION_TEST_URL` to a running local preview. This configuration does not regenerate assets or deploy. Browser connectivity may require running both preview and browser outside the localhost-restricted sandbox.

The focused tests cover original skill bytes and hashes, deterministic ZIPs, missing/optional/upstream inputs, graph and binding failures, unsafe ZIP paths/attributes, missing concrete references, source-injection text remaining unapproved data, reciprocal support links, exact prompt copying, denied clipboard, mobile overflow and source-authoring approval. Space-specific tests also cover context retention, complete workflow and agent archives, blocked source-only bundles, privacy scope, large workflows, and persistent missing-skill errors. They do not simulate a real user's confirmation or run the downloaded skills.

Future enforcement requires a real execution backend: trusted input acceptance, persistent step state, immutable revisions, tool authorization, validator evidence and human decision events. Full semantic source coverage and repeated cross-provider evaluation are separate required work before making stronger assurance claims.

A known content blocker was exposed by the new guard: `event-tracking-planner/SKILL.md` links to `references/retention-measurement-patterns.md`, which is absent from the supplied catalogue files. Workflows depending on it, including `weekly-product-funnel-watcher`, stop at export with the missing path. The reference was not invented and the guard was not relaxed. Resume those exports only after recovering the actual permitted reference or explicitly amending the affected workflow. This is an unresolved source-material issue, not a passing compatibility check.
