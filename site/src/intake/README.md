# Request scoping before specialist selection

This stateless layer turns a one-line request into a host-authored, evidence-linked scope, selectable recommendations and ordered specialist work. The shared MCP/REST catalogue exposes preparation; the host AI supplies reasoning, local files and actual execution. Existing context intake and the exact team-plan protocol remain the downstream gates. No OAuth grants, private storage or hosted execution are added. See docs/public-mcp/outcome-delivery.md for the complete lifecycle.

## Native conversation

1. `scope_specialist_request`: preserve the original request and ask only unanswered relevant questions. The route hint is lexical retrieval guidance, not an intent classifier or diagnosis. The user's AI assesses meaning and reuses supplied context.
2. Qualify the subject, observable outcome, diagnostic versus direct route, concrete deliverables and completion checks. Ask about constraints, time window, budget, exclusions and review limits when they matter. Do not demand a full business brief for a repository repair.
3. For broad symptoms, reuse or build the relevant business/project context. Ask which permitted exports or read connections are available, why each matters and what alternative would suffice. Read the actual evidence; a URL or a source status alone is not proof that it was read. Retain dates, disagreements and missing measurements.
4. Map the relevant end-to-end pipeline with source-linked stages, nested subprocesses and handoffs. Explicit feedback edges can form loops; flow edges and parent hierarchies must be acyclic. Do not force every domain into a marketing funnel. For software, the pipeline might be a request lifecycle; for operations, a service delivery process.
5. Record supported observations separately from hypotheses and unknowns. Preserve alternative explanations, limits and the next discriminating test. A symptom or correlation is not a verified causal root cause. The host supplies analysis; these tools only validate declared structure and references.
6. Prepare prioritized diagnostic, corrective and measurement jobs. Each needs a task, explicit nonprivate discovery summary (`routing_task`), native deliverables, acceptance checks, source/data/tool requirements and real producer dependencies. Choose `specialist_area` from the current role directory when the required discipline is known (for example engineering for a diagnosed software fault, even if the original symptom was business performance); otherwise it defaults to `all`. State why it is P0–P4, considering impact, urgency, effort, uncertainty and constraints. Unknown ROI remains unknown; do not invent a numerical return. Dependencies take precedence over priority labels.
7. `prepare_scoped_specialist_work`: receive unresolved questions, blockers, a pipeline diagram, detailed task prompts and portable files. `READY_FOR_PLAN_REVIEW` means structurally prepared for review, not semantically proven, approved or ready to execute. Tool connection and authority gaps are separate execution blockers.
8. `route_scoped_specialist_work`: submit the exact dossier digest. Only ready work is matched against the real catalogue; no match remains explicit. Only the host-selected discovery summary is used for local matching; do not put private facts in that summary. Compare full remits and complete methods before choosing specialists.
9. Author the smallest sufficient existing `ai-blocks-team-plan/1`, then `prepare_scoped_specialist_team` with one stage per selected work item. More stages require first splitting the work into meaningful jobs. The bridge preserves scoped outputs, required checks, source locators, input handoffs, dependencies and declared tool scopes. The catalogue then checks current role/method revisions. Selection remains a host judgment, not a competence certificate.
10. Show the original request versus scoped goal, findings, uncertainties, priorities and actual ordered plan. Incorporate edits and get review of that exact plan through the existing team protocol. The returned team file map includes the dossier, evidence and work prompts under `scope/`; read them alongside the plan. Scope approval does not approve a team plan, verify human identity or grant permission to send, spend, publish or change live systems. The host performs real work, accepts producer artifacts and records actual check evidence.

Missing data blocks dependent work and its consumers, while independent investigations can continue. A hypothesis can route diagnostic work; diagnostic-route fixes require a pipeline-linked supported finding. Reported supplied evidence or tool authority is not independently verified. Sources can carry an optional `revision_sha256` for a host-inspected snapshot. The service preserves it in the dossier digest and requires an identical team-context revision; it does not fetch or hash the source itself. Changing the normalized dossier invalidates its digest; source content should be re-read and the dossier revised when facts change.

## Local MCP preview

Use Node 24 with the locked `site` dependencies. `site/scripts/scoping-mcp-preview.mjs` is a stdio server for a native AI host. It exposes five scoping tools including prepare_recommendation_handoff, public source retrieval and existing checkpoint tools. The local inventory has 15 unique tools; the complete public registry has 18. Direct specialist discovery/preparation is kept behind the scoped tools in this preview. It has no private storage, model client, hosted executor or marketplace actions.

```powershell
node site/scripts/scoping-mcp-preview.mjs
```

By default it reads public catalogue assets with HTTPS GET from `https://useaiblocks.com`. Private scope data stays in the local process; it is not posted to that origin. Model inference and task execution remain in the host AI. For offline/local trials, pass `--catalogue-dir PATH_TO_GENERATED_SITE_PUBLIC`. A separately deployed catalogue can be selected with `--catalogue-origin HTTPS_ORIGIN`. Normal source hash/revision checks still apply. No production configuration is changed by starting this local server.

In a host's MCP settings, choose stdio, set the command to the absolute Node 24 executable, and pass the absolute path to `site/scripts/scoping-mcp-preview.mjs` as its argument. No API key is required for public catalogue reads. This PR supplies the entry point; it does not install it into the user's global settings or claim that a live Codex conversation has completed the workflow.

## Records and exports

The dossier schema is `ai-blocks-request-scope/1`: original request, domain/route, subject, goal/symptom, deliverables/checks, constraints/exclusions, source declarations, data needs, tool requirements, pipeline, findings and work. `SUPPLIED`, `MISSING` and `DISPUTED` describe host-reported evidence availability, not truth. `SUPPORTED`, `HYPOTHESIS` and `UNKNOWN` describe host-reported findings. Source locators are HTTPS URLs without embedded credentials or project-relative paths.

Exports include `scope.json`, `SCOPE.md`, `review.json`, `evidence.json`, `findings.json`, `pipeline.mermaid` and `prompts/<work-id>.txt`. A selected team packet adds `scope/selection.json` with SELECTED, DEFERRED or BLOCKED dispositions for every dossier job. Only selected jobs have prompts in that team packet; the full dossier remains background/backlog. Dossier input is bounded to 120 KB, prepared scope output to 1 MB and the scoped team response to 2 MB, with at most 30 work items, 60 pipeline stages and four next questions per batch. Common credential patterns and unsafe keys are rejected; this is not a comprehensive secret detector. Hashes use sorted-key application JSON serialization, not an RFC 8785 claim. Buyer-specific dossiers stay in their authorized job/project; do not copy them into a reusable expert agent or marketplace portfolio without separate rights and consent.

## Verification and limits

```powershell
node --test site/test/request-scope.test.mjs site/test/request-scope-mcp.test.mjs
node site/scripts/demo-request-scoping.mjs --catalogue-dir site/public --output NEW_EXISTING_PARENT/NEW_DIRECTORY
```

The integration checks require generated catalogue assets, as the existing specialist API checks do. `SCOPE_TEST_CATALOGUE_DIR` can select an existing read-only generated catalogue for local tests. CI generates `site/public` before unit checks. Tests cover actual catalogue matching/current source validation and an official MCP SDK stdio client, plus missing evidence, causal uncertainty, dependencies, authority, stale digests and bounded exports. Synthetic examples do not prove diagnostic quality or business improvement.

Shared MCP/REST integration and outcome-first host/worker instructions are included here. Deployment, native-host availability and measured diagnostic quality require their own receipts. Local files are the default; authenticated dossier storage and marketplace execution remain separate work. Keep this isolated until the additive release passes its checks and review. The draft expert-agent storage stack and its remote preview remain separate; this local stateless scoping preview does not replace them.
