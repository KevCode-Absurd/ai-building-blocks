# Skill replacement and general free planning

Implemented locally on 2026-10-22.

## Replace a skill

In /compose, right-click a step and choose Replace skill, or expand Edit step instructions and use Replace skill. A visible Replace button also works with touch or a keyboard. In the canvas builder, right-click a block or click it and use Replace skill in its detail panel. On phones, open a step in the numbered list to replace it.

Suggestions combine the current job, request relevance, role and declared output types. General fallback stages suppress weak topical matches; manual search can still select a different repository skill. The preview lists new required inputs and output types that later steps may lose. Matching types are a compatibility hint, not proof of equivalent behavior.

Compose recalculates dependencies, missing inputs and explicit representation adapters. Canvas replacement preserves node identity, position, graph edges and user notes, and clears conversion bindings that depended on the replaced node. Dashed connection warnings and the input checklist expose type mismatches. Review retained instructions that name the old skill or its files.

## Your own skill

Upload a self-contained SKILL.md or .txt, up to 128 KB. Supply a name, role and optional input/output type IDs. Blank contracts remain unverified. Each workflow can retain up to eight uploaded skills and 512 KB of custom definitions. Files are kept as text, never installed, executed or rendered as HTML on upload. They receive isolated custom-* identifiers and cannot override repository skills.

Custom source and contracts survive composer draft restore, editable JSON export/import, pack download, opening in the builder, builder draft restore and compact share links. Each referenced custom skill is bundled under skills/<custom-id>/SKILL.md. Supporting files inside uploaded ZIPs are not supported in this version. Large workflows should be shared as packs; the Share action refuses links over 16,000 characters. Decompressed share payloads are capped at 1 MiB. Custom workflows cannot yet be saved to a cloud Space; the interface explains the local sharing options.

## How free planning generalizes

1. Reject greetings and enforce the 10,000-character request limit.
2. Retain the original brief. Exclude simple negative clauses from positive task matching.
3. Split explicit sequential and parallel deliverable clauses, including action-led conjunctions and newlines.
4. Use existing reviewed domain methods when applicable. Compose additional results in either order.
5. For other clauses, rank specialist skills with lexical topic coverage, requested action/role and artifact contracts. Do not choose a specialist on port compatibility alone.
6. If the specialist match is weak, include a labeled general template: request acceptance brief -> request deliverable drafter -> request acceptance checker. The instructions require named files, exact quantities/languages/formats, supplied evidence, input gaps and at most two repair/recheck passes.
7. Add requirements and acceptance checks around specialist stages assembled by search. Derive actual external inputs and representation adapters from the resulting plan. Disclose clause/step limits.

For example, a wedding budget previously matched ad-budget calculators. It now receives the general requirements/draft/check workflow, with instructions to require real prices, units, currency and assumptions. An incident response runbook uses its relevant specialist skill between the general brief and acceptance check. A combined landing page and wedding budget retains both the landing method and the general budget path.

Free planning runs deterministic code in the browser and incurs $0 planning inference cost. It creates workflow instructions. Creating the actual budget, page or other deliverable requires the user's compatible AI runner and tools. A general template expands coverage; it does not establish 95% specialist quality. The earlier blind-judge scores describe their frozen plan snapshots, not this revised planner.

## Voice

The current browser SpeechRecognition implementation has no transcription API bill to this application. Its five-minute per-visit timer and 10,000-character transcript cap remain. Browser support varies and a browser vendor may process the audio remotely. Review text before submitting; only choosing AI composition sends it to the paid planner.

On-device browser recognition is possible where supported, with language packs. Vosk and whisper.cpp can also run locally. Local processing requires device compute and downloads; server hosting has an operating cost even when the software is free. No paid speech service or new model call was added in this change. Real microphone capture has not been tested in this session; automated voice tests use a simulated recognition API.

Primary references, checked 2026-10-22:

- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/processLocally
- https://alphacephei.com/vosk/
- https://github.com/ggml-org/whisper.cpp

## Evidence

- site/test/composer.test.mjs: deterministic routing across 20 additional broad requests; custom-skill validation, replacement contracts and stale-binding removal.
- site/e2e/skill-replacement.spec.ts: repository and custom replacement, editable JSON/ZIP round trips, builder reload, share links, upload boundaries, mobile layout and 20 full pack exports without model POSTs.
- site/e2e/composer.spec.ts and composer-fresh.spec.ts: existing composer/voice and 20 earlier fresh-request regressions. Recorded paid-plan fixtures incur no new inference cost.
- reports/2026-10-22-general-free-planner.json: actual plans and source hashes for the 20 additional broad requests. These are structural and packaging checks, not a new blind quality evaluation or an execution-success study.
