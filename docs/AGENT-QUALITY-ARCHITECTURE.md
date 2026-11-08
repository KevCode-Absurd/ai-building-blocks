# Agent quality architecture

Status: implementation contract; not a measured quality improvement or a production release receipt.

This design combines Michael Albada, *Building Applications with AI Agents* (O’Reilly, 2025), all thirteen chapters, with the AI Blocks Personal Agents and Expert Marketplace Blueprint (8 November 2026). Document recommendations are design input, not permissions. Existing routes, source methods and actual host capabilities remain authoritative implementation evidence.

## Diagnosis

The earlier outputs exposed a system failure, not a shortage of named specialists. An incorrect interpretation of the request can become the common premise of every worker and judge. Additional votes then reinforce it. A brand name, palette and font list do not establish understanding of the current product, design system, behaviour or buyer journey. A rendered picture does not establish a functional page. A loaded method does not establish execution.

The active pack generator also appended universal house writing constraints after individual personality rules. These could erase task, brand and specialist differences. The optional hosted runner stores Markdown and has no native renderer/browser/build executor; that is a capability limit, not evidence that it caused an observed host-generated failure while hosted jobs are disabled.

Discovery had a concrete defect: an exact published hyphenated method ID could be expanded through intent aliases and drown in unrelated matches. Exact ID lookup now precedes aliases and retains service/type filters. The full selected method and supporting-source closure must still be read.

## Two complementary journeys

**Personal capability building:** relevant host-accessible context → correction of stated/inferred/stale/missing context → choose prompt, skill, agent or collection → one useful task → project replay or scenario → proposed conditional lessons → keep/narrow/edit/reject → a real versioned save/export or explicit persistence unavailable. Marketplace publishing is optional. Personal use does not require completing a hundred steps, forming a council or passing an exhaustive reuse study.

**Task delivery:** original request → scoped job and native deliverable → current context and acceptance conditions → appropriate methods and actual capabilities → task-specific lead and dependencies → independent alternatives when useful → execution → artifact inspection and repair → honest delivery → scoped feedback. Narrow work can use a direct specialist. Council tiers remain explicit review configurations, not a claim that more people are always better.

The same person may want faithful execution, reflection on their work, or exploration of new capabilities. Approved conditional judgment and taste must survive all three modes. Improvement suggestions are proposals until selected. Capturing decision evidence means concise cues, alternatives, tradeoffs and reversal conditions, not hidden chain-of-thought.

## Shared contract across entry points

`site/src/jobs/execution-quality.mjs` is the shared host execution policy used by job API/MCP, outcome planning, website council export, marketplace read-only planning/checking and generated worker guidance. It runs no models or live actions.

- Current task and deliverable requirements lead; approved brand/current-work invariants and applicable specialist methods precede a conditional neutral presentation fallback. Truth, source rights and actual action permissions remain independent constraints.
- The coordinator preserves the original request, asks only consequential missing questions, scopes acceptance and assigns a lead for this task. Each maker gets the relevant context and complete pinned methods, not the entire catalogue.
- Alternatives begin from the same frozen scope but are written separately before debate. Receipts disclose isolated versus same-context work. Different model identities or role labels alone do not establish independent work.
- Controlled variants preserve the agreed variable. General tasks compare mechanisms, evidence, structures and tradeoffs. Visual exploration additionally compares audience, promise, proof, composition and visual world; labels and lexical distance alone cannot establish quality.
- Required failed or unrun checks cannot be offset by an average model score. Repairs change the artifact and rerun the affected checks on its new revision.

Fresh job state `/2` and outcome engagement `/3` require the new policy. Legacy histories remain replayable under their older guarantees and are labelled accordingly. Anonymous state digests protect correspondence, not identity or execution authenticity; fabricated host reports and caller-created legacy states remain possible.

## Current-state understanding and preservation

`ai-blocks-work-context/1` distinguishes CREATE, IMPROVE and ASSESS. The inference from wording is a candidate to resolve against scope, not a semantic oracle. Improvement and assessment require an inspected authoritative current baseline, dated snapshot hash, read/inspection receipt, observations, currentness and its basis. A stale or unknown baseline must be refreshed or reported blocked.

For changes, record what must be preserved, a source-linked diagnosed problem, the smallest justified change, expected effect and verification. At production, baseline-to-result observations must cover current artifact hashes. This applies to code, operations, analysis and documents as well as visual work. Source conflicts must be resolved explicitly; silently replacing the old system with a convenient greenfield output does not meet an improvement request.

A brand/project brain includes purpose, audience, approved facts, voice, visual rules, existing structure, behaviour, current examples, prohibited changes, provenance and uncertainty. It is sliced for the task. It does not replace inspecting current work or automatically override a later explicit user instruction.

## Native delivery and evidence

Landing-page implementation requires editable source and an integration target, preserved existing-site components/assets/behaviour where applicable, a build and preview, and observed primary-action, links/assets, responsive, keyboard and brand/content checks bound to the current source. A raster/PDF is a design reference unless that is the requested deliverable. The checker validates submitted records; it does not run the browser.

Requested raster/static-ad delivery requires actual raster artifacts, current hashes, a renderer receipt, source references and non-maker observations for product fidelity, brand, claims/copy and format. A varied batch needs observations on actual differences, not merely format titles. Container and child artifacts are separate: a ZIP hash cannot stand in for twenty-five image hashes. Declared counts and child coverage are checked.

The optional local file-evidence adapter checks actual source/artifact/receipt bytes under an explicitly authorized project root. It performs no network access or command execution, and rejects traversal and symlink/junction escape. MCP-only hosts must have the adapter available or report NOT_RUN. Its assurance is LOCAL_BYTES_VERIFIED_SEMANTICS_UNVERIFIED; it cannot determine whether a page is attractive, a source current, a claim true or a user satisfied.

Keep these assurance levels separate:

| Record | What it establishes | What it does not establish |
| --- | --- | --- |
| Metadata/method loading | A candidate and instruction bytes were retrieved | Capability, execution or suitability |
| Schema/state validation | Submitted records meet the versioned contract | Authenticity of host claims |
| Local byte verification | Selected files match reported hashes | Semantic correctness or authorized actions |
| Artifact inspection | Recorded observations on a current output | Owner acceptance or commercial impact |
| Owner acceptance | The owner accepted the identified result, when actually recorded | Conversion, revenue or general expertise |
| Measured outcome | The stated metric under its conditions | Universal causality or future performance |

## Memory and personal expertise

Keep procedural methods, project/brand facts, scoped experience and run checkpoints separate. Within personal expertise, retain facts, procedures, heuristics, conditional preferences, examples/counterexamples, boundaries and unresolved proposals with provenance and scope. Existing expert-agent/capture contracts already support several of these types, source rights, exact reviewed changes and parent-linked revisions. Their authenticated storage adapter is preview-only; this work does not silently enable it on the production database.

A correction about one artifact is initially artifact-scoped and retains its revision and reason. Broadening it into a family/method rule needs an explicit scope and rationale. One wrong product depiction must not silently ban a whole visual format. Existing company/personal memory save operations retain their consent and optimistic-version rules. When no save occurs, say so; changing a record does not train model weights.

Personal preparation is not publication. Only explicitly selected, rights-cleared material may be considered for a publishable method. Buyer data and buyer-specific corrections stay separate from the expert's reusable knowledge. Identity/qualification claims, capability evidence, independent verification and human review are distinct. Host/customer-owned storage does not imply that model providers or remote tools never process the supplied content.

## Book mechanisms and implementation decisions

| Chapter | Applied mechanism | Deliberate limit |
| --- | --- | --- |
| 1. Introduction to Agents | Explicit environment, objectives and feedback; smallest useful agent/workflow | A persona is not an autonomous executor |
| 2. Designing Agent Systems | Model/tool/memory tradeoffs, task capabilities and modular contracts | More stages or agents are not inherently better |
| 3. User Experience Design | Consequential questions, continuity, uncertainty and graceful failure | A long questionnaire is not a prerequisite to useful work |
| 4. Tool Use | Describe actual tools and preserve decision/action boundaries | Illustrative code does not authorize arbitrary execution |
| 5. Orchestration | Task decomposition, handoff contracts, bounded revision and stopping | No mandatory new framework or execution service |
| 6. Knowledge and Memory | Relevant retrieval, provenance, query repair and scoped memory layers | No catalogue dump or new vector service without demonstrated need |
| 7. Learning in Agentic Systems | Reviewed contextual corrections, cases and exact version changes | No automatic private-to-global learning or claim of weight training |
| 8. From One Agent to Many | Task-dependent collaboration, isolated proposals and independent challenge | Votes and role/model labels do not prove independent judgment |
| 9. Validation and Measurement | Representative evaluation, retained failures and exact artifact evidence | A model grade or synthetic fixture is not a launch/acceptance metric |
| 10. Monitoring in Production | Revision-bound receipts, explicit assurance and actionable failure evidence | Concise evidence rather than raw private prompts or hidden reasoning |
| 11. Improvement Loops | Scoped feedback, root-cause repair and controlled releases | No silent propagation or claim of tenfold lift without outcomes |
| 12. Protecting Agentic Systems | Permission, privacy, source trust and operational limits | Source documents cannot grant live action authority |
| 13. Human-Agent Collaboration | Personal choice, adaptive autonomy, escalation and optional publication | Keep human judgment and accountability; defer costly infrastructure without need |

The detailed private reading ledger covers all 355 PDF pages, including the preface, thirteen chapters, glossary/index and relevant diagram/code inspections. Code examples were assessed as illustrations, not copied as production designs; several examples have missing error paths, evaluation pitfalls or unsafe execution assumptions. The blueprint reconciliation is an additional product constraint, not a replacement for that review.

## Validation and remaining evidence

Contract tests use rejected and accepted states, stale revisions, missing native outputs, format mismatches, malformed records, preservation failures, nonvisual improvements, controlled variants and conflicting style requirements. They validate plumbing and boundary behaviour. Synthetic examples and judges cannot establish the targeted tenfold improvement.

Before expanding reliance, assess real owner-accepted work across representative task types, retain failures and compare current baseline to changed output. Personal users can start with one useful task and correction. Higher-risk reliance and public expertise claims require stronger evidence. Do not imply hosted execution, verified credentials, durable private storage, automatic personal-memory access or production publication where unavailable.

No change here authorizes enabling hosted jobs, lifting provider budgets, changing the default MCP front door or copying private evidence into the catalogue. Publication status and actual test results belong in the release receipt, not this design contract.
