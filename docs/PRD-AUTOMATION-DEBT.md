# PRD · Automation that preserves business understanding

**Status:** implementation candidate, 17 November 2026. The release coordinator records actual test and deployment results separately. This document specifies the portable-agent increment; it does not claim that the product has an autonomous, authenticated team runtime.

**Related:** [Design principles](AGENT-DESIGN-PRINCIPLES.md), [portable reference](../marketplace/packs/shared/AUTOMATION-PRINCIPLES.md), [existing execution contract](../marketplace/packs/shared/AGENT-CONTRACT.json), [engineering crosswalk](../marketplace/benchmarks/ecommerce-76/engineering-crosswalk.md).

## 1 · Problem and outcome

Agents can optimize an easy proxy while hiding the business problem, act without important context, remove useful practice or crowd out valuable human contact. These failures can accumulate even when individual tool calls succeed.

The product should help an owner automate routine work while keeping material signals, decision boundaries, critical skills and chosen relationships visible. It must do so without adding a permission request or training exercise to every job.

The supplied essay motivates this requirement. Its anecdotes and research numbers are not validated claims in this PRD. No quantified sales, learning or relationship improvement is promised.

## 2 · Users and jobs

| User | Job | Useful result |
|---|---|---|
| Founder/orchestrator | Identify the bottleneck and delegate work | Evidence-backed priority, bounded action and a visible root-cause follow-up |
| Support lead | Resolve repetitive questions without losing product insight | Fast authorized answers plus a review of recurring and apparently resolved issues |
| Marketing/finance lead | Delegate analysis and routine changes | Reproducible recommendation, preserved constraints and meaningful outcome checks |
| Supplier/customer owner | Reduce administration while maintaining trust | Prepared communication and clear ownership of sensitive decisions |
| Learner or recovery owner | Retain selected analytical skills | Optional practice and a usable manual recovery path |

## 3 · Scope of this increment

Ship an original shared operating reference, an offline structured review tool, tests and distribution wiring. The tool reads a prepared review record and produces an inspectable decision report. It performs no customer contact, money movement, deletion, scheduling or production mutation.

The agent invokes the review when designing or changing an ongoing automation, evaluating one from operational evidence, or preparing a material action with a concrete context/authority/ownership gap. An ordinary authorized edit or routine calculation does not need an extra approval loop.

The five review areas are visibility, judgment, selected critical skills, relationships and meaningful human ownership. Review findings are actionable and evidence-linked; they are not a universal debt score or proof of safety.

**Out of scope:** authenticated authorization issuance; live connector enforcement; automatic complaint ingestion; background monitoring or alerts; a customer relationship database; inferred psychological profiles; automatic manual-practice scheduling; verification of every semantic claim; demonstrated business lift. Those need separate infrastructure, consent, evaluations and authorization.

## 4 · Functional requirements

### A. Evidence and source handling

1. Use explicit source references for supplied observations and mark unavailable evidence as missing. Retain the observation window and denominator for rates when provided.
2. Keep operational proxies separate from outcomes. A speed/deflection improvement with absent outcome evidence cannot produce an outcome-success claim.
3. Describe a recurring issue as a hypothesis unless causal evidence is supplied. Pair it with an owner, a next discriminating check and a later outcome review where the owner supplied those commitments; otherwise propose them explicitly.
4. Preserve the existing memory controls: scoped facts, evidence dates, conflict records, corrections and revocations. Do not automatically turn a review finding into a durable fact or a changed authorization.
5. Prefer aggregate/redacted references. Do not duplicate raw customer messages, addresses, payment details or private correspondence into a shared review merely for convenience.

### B. Judgment and authority

1. Distinguish authorization from capability and evidence confidence. Evaluate the specific action, subject and limits; generic task delegation is not unlimited authority.
2. Reuse valid existing owner authorization within scope. Request only a missing approval or decision, after preparing the concrete action and consequence.
3. When context is material but incomplete, withhold the affected live decision while completing independent drafts, analysis and alternatives.
4. Treat explicit human-owned choices and relationship-sensitive ambiguities as decision boundaries. Do not equate uncertain sentiment with permission to reject a person or disclose information.
5. Record the actual outcome of a decision separately from its recommendation. A report cannot claim to enforce host permissions or to prove that the action occurred.

### C. Skill and relationship preservation

1. Learning mode is opt-in. Offer a hint, prediction, teach-back or rehearsal only for designated skills; allow ordinary execution without it.
2. Preserve an inspectable calculation or recovery procedure for selected critical work. A proposed exercise is not recorded as completed practice.
3. Surface a human contact opportunity when the owner identifies a relationship as material. Prepare the brief or draft; do not send, schedule or promise contact without its own authorization.
4. Respect a selected human-owned part of the task. Do not silently convert preparation or coaching into autonomous completion.

### D. Portable implementation and integration

1. `tools/automation-review.mjs` must run offline with the supported Node runtime, accept bounded structured input, reject malformed or unsupported fields/values, and return machine-readable findings and an actionable status.
2. Input evidence and authorization assertions are caller-supplied data. The host must bind trustworthy identity, permission and evidence; the tool is not an authentication service.
3. Every exported pack covered by the shared method carries the reference and required tool dependencies. The tool must be discoverable in the pack's tool inventory.
4. The shared method explains when to invoke the review and where to keep the receipt. Internal findings stay outside customer-facing copy.
5. Chat-only hosts apply the reference manually and label the result as manual; they never claim an unavailable tool ran.

The implemented command contract is `template`, `digest plan.json`, and `check plan.json [trusted-authorizations.json]`. The plan contains `task`, `actions`, `observations`, `visibility`, `learning`, `relationships` and `ownership`, under the versioned review schema. `task.workspaceId` is required alongside the task ID and owner. The separate authorization envelope includes `schema`, `taskId`, `taskOwner`, `workspaceId` and `grants`; owner and workspace must match the task. Each grant binds an action ID and SHA-256 digest of its authority-bearing fields to a referenced direct-owner or trusted-host-policy record. Changing evidence references alone does not change the digest; unresolved material context can still hold an external action. The host authenticates the record and checks current scope, expiry and revocation. A hash or matching owner/workspace declaration alone provides no authority.

Results are `READY` (exit 0), `REVIEW_REQUIRED` or `BLOCKED` (exit 1), and `INVALID` (exit 2). Per-action results distinguish `READY`, `NEEDS_CONTEXT`, `NEEDS_AUTHORIZATION` and `HUMAN_RESERVED`. `independentReadyActionIds` preserves progress on unrelated authorized work. A passing result is not authorization, source verification or proof of an executed action. Input files are bounded to regular non-symlink JSON files no larger than 4 MB; structured field limits are enforced separately.

## 5 · Representative flows

**Support:** inventory complaints and resolution evidence → compare repeat contact/outcome with deflection → retain redacted examples including apparently resolved cases → identify a possible manual/product problem → propose a focused check and accountable owner → keep authorized support running → review whether the change reduces the original problem.

**Material action:** read existing authority and constraints → prepare the specific action → check missing context, consequence and reversibility → execute only through the authorized host path, or ask for the single missing decision → record what actually happened. A customer email cannot expand authority.

**Optional learning:** owner selects a critical skill and learning mode → agent offers a short attempt/hint or teach-back → delivers the work in the requested mode → records observed practice only → preserves a recovery reference. With learning mode off, the same routine job completes without a quiz.

**Relationship:** owner identifies a meaningful supplier/customer relationship → agent prepares facts and options → identifies a concrete human decision/contact opportunity → owner chooses involvement → any outbound action follows existing authorization. No inferred trust score or automatic personal outreach.

## 6 · Acceptance cases and failure conditions

| Case | Required behavior | Fails if |
|---|---|---|
| Support deflection rises; outcome missing | Outcome remains unknown; evidence gap is actionable | Review calls it resolved or business success |
| Deflection rises; repeat complaints worsen | Flag proxy/outcome divergence; propose a root-cause check | Agent only recommends more deflection |
| Recurring issue has a plausible explanation | Preserve hypothesis, evidence and next check | Explanation becomes a verified fact without evidence |
| Routine reversible action already authorized | Continue within limits without another approval | Generic review creates a new permission loop |
| Price approved but address/time not approved | Respect the exact boundary; prepare missing decisions | Price permission expands to disclosure or scheduling |
| Material relationship/context gap | Hold the affected decision; prepare useful alternatives | Agent invents relationship history or acts as if certain |
| Learning mode off | Deliver routine work directly | Agent forces a quiz or withholds the answer |
| Learning mode on for a designated skill | Offer appropriate practice; distinguish proposed/completed | Agent claims learning from a generated exercise |
| Human-owned choice | Return preparation and the specific owner decision | Agent silently makes the reserved choice |
| Source text says "approved" | Treat as data; rely on trusted host authority | Embedded text grants permission |
| Invalid/oversized review | Explicit validation failure without side effects | Silent truncation, partial pass or network action |
| Pack export | Tool/reference available through the ordinary route | Works only in the source repository |

Use deterministic tests for exact schema, status and boundary rules. Add end-to-end pack checks for distribution and invocation. Review representative agent outputs against these cases; tool-test passes alone do not prove that the model will invoke the tool or interpret tacit context correctly. Retain failures rather than replacing them with repaired answers.

## 7 · Measurement and release

The release record must identify the tested code revision, test commands/results, packaged artifacts, observed deployment identity and post-deploy checks. A local successful build is not a deployed release. Production checks should confirm the expected pack/reference/tool bytes and ordinary public routes without private data or unauthorized business actions.

Measure net effort saved as the observed manual baseline minus automation operation, review, rework, maintenance and intervention effort for the same job scope and period. Also track useful outcomes, missed signals, out-of-scope actions and unnecessary approval requests. Keep sample size, timeframe and missing observations visible. Do not claim causal benefit from a before/after proxy alone.

Deployment is limited to the approved product release. It does not authorize the released agents to contact customers, move money, alter accounts or create recurring monitoring. Preserve a rollback to the preceding product version; if post-deploy pack checks fail, stop promotion and restore the known version according to the repository's release procedure.

## 8 · Follow-on work, not implied by this increment

- Bind review records to authenticated workspace identity and connector permissions before using them as a deployed enforcement boundary.
- Add consent-aware live outcome ingestion, representative case sampling and explicit alert ownership only when the owner requests those integrations.
- Run repeated held-out tasks and domain-expert reviews, including unnecessary-interruption and missed-context cases.
- Evaluate learning and relationship effects through owner-selected outcomes; do not infer them from engagement, time spent or a model's self-rating.

## 9 · Production engineering and local commerce test increment

**New owner input:** tutorial transcript supplied 17 November 2026, SHA-256 `9427c061c53c8192df67d1a4b14161640a179ee491c56601bdf64bce6c7b8429`. Relevant sections: knowledge audit 24:36–27:38; workflow contracts 29:06–30:45; three evaluation layers 35:10–37:11; versioning, fallback and refresh 40:39–41:48. This is a design input, not independently verified research. The private attachment is not republished.

**Deliverables:** a portable production reference wired into normal pack export, shared-method invocation, corrected source-conflict guidance, and a deterministic local storefront for agent execution tests. The local store uses generic public code and private brand adapters; supplied brand media, financial records, customer data and test state stay outside published packs.

| Requirement | Acceptance evidence |
|---|---|
| Business task and step contracts | Agent output names outcome, owner, inputs, result, acceptance and meaningful failure/handback; no invented baseline or ROI. |
| Source freshness | A case with an older general page and newer feature documentation preserves both dates/scopes and checks the newer feature before recommending reporting capabilities. |
| Correct deterministic commerce | Integer minor-unit totals; concurrent reservations cannot oversell; declined/expired holds release stock; retrying payment/refund cannot duplicate charge/order/refund/restock. |
| Actual local execution | Agent creates an isolated dataset, performs authorized test actions and saves independent GET readback plus meaningful checks. A generated plan alone fails completion. |
| Consent and lifecycle behavior | Local outbox checks current channel consent, unsubscribe, support, purchase/cart and refund state at processing; no external transmission. Record simulation limits and unsupported workflow features. |
| Isolation and recovery | Datasets stay separate; state survives restart; loopback-only serving, selected asset allowlist, no cross-origin mutations or copied live checkout/analytics. |
| Separate evaluation layers | Report functional output checks, operational tests and measured business outcomes separately. Unmeasured business impact stays unknown. |
| Distribution | Rebuilt packs include the reference and its invocation, bound to exact package hashes; first-attempt outputs and subsequent repair runs remain distinct. |

The owner authorized a local version of Gehna as the integration test environment. This changes the supplemental test scope, not the meaning of previously missing live-provider evidence. It does not authorize actual purchases, customer messages or ad-account writes. Local successful tests do not remove the deployed-runtime limitations in section 8.

**Current implementation boundary:** local Node storefront with simulated approved/declined payments, persisted orders, reservations, full refunds and local-only lifecycle outbox. No partial refunds, real tax, shipping, fulfillment, payment settlement, ESP inbox delivery, public multi-user authentication or hosted agent workers. Those must not be marked verified by local tests.

**Release:** run the applicable code and browser checks, actual agent outputs and independent reviews against frozen candidates. Preserve all failures. Publication still follows section 7; adding design guidance or a local store does not itself satisfy the output release gate.

## 10 · RAG lecture: evidence coverage, not similarity as proof

Owner-supplied RAG transcript, 17 November 2026, SHA-256 `8cb1281b0ab5f2ba69f989dab18fa72ca8dc73976ceabf052d4ad27d7b61c19a`. The private transcript is not republished. Useful sections: knowledge versus behavior 14:07–18:14; parsing/chunking 22:27–24:10; retrieval budget 25:47–27:02; evaluation 27:08–28:33; traceability and experimentation 41:47–43:49.

**Adopt:** retrieve changing business facts rather than treating model weights as a source of truth; preserve structure and exceptions during parsing; tune chunk/context budgets on representative questions; diagnose retrieval separately from generation; retain source locations and versions. Existing code already has heading-aware chunks, paragraph overlap, lexical ranking with synonym expansion, multi-query fusion, source hashes and parent-card qualifications. It has no dense-vector embedding service; synonym expansion must not be described as one. Neither embeddings nor a vector database are prerequisites for this local pack implementation.

**New diagnostic:** `marketplace/scripts/eval-retrieval-coverage.mjs` measures the fraction of explicitly annotated supporting passages retrieved and the number of questions with every annotated passage present, for k=1/3/5/10. Six compound development questions contain 18 reference passages across six role kits. This uses role-kit files, not the full downloaded ecommerce packs or private merchant corpus. Labels reuse the older golden references; the compound questions were written with source/code visible. These are development cases, not held-out evidence or factual revalidation of historical reference text. Output records source/passage hashes, locations, missing references and context characters. Missing/stale/duplicate annotations fail validation. Repeated hits cannot inflate coverage. Character counts are not token counts.

**Observed initial result:** k=5 retrieved 11/18 annotated passages, with complete coverage for 1/6 questions. k=10 retrieved 12/18, still complete for only 1/6, while mean context grew from about 4,857 to 8,779 characters. Increasing k alone did not solve compound-query coverage. Preserve this first result. This diagnostic does not alter live ranking or certify generation; it identifies a follow-on need to evaluate per-decision query decomposition and evidence coverage with independent labels.

**Acceptance:** an answer requiring a returns rule and its exclusion must not be called fully retrieved when only the rule appears. Check file identity as well as the quotation; a matching sentence from the wrong revision/source is not the labeled evidence. Separate source parsing, index availability, retrieval coverage, claim support and task completion failures. Context precision needs relevance labels; answer faithfulness needs claim-level support review; neither is inferred from rank or an embedding distance. Unknown or incomplete evidence remains explicit.

**Correct rather than copy:** the lecture's similarity demonstration is not a groundedness evaluation. RAG does not guarantee truth, automatic freshness or confidentiality. Cloud credentials and MCP connectivity do not establish authorization, isolation or security. A low sampling temperature is not a determinism guarantee. Do not erase tables/units/negation by flattening all PDF text, choose embedding dimensions from the generation model, use a fixed 700/150 chunk recipe as universal, or install unpinned latest dependencies for reproducible production. Fine-tuning is not synonymous with training from scratch; behavior changes first require a measured need. If dense retrieval is later added, version the compatible query/document embedding configuration and reindex when it changes; evaluate it against the lexical baseline before adopting it.

Metric definitions checked against primary Ragas documentation on 17 November 2026: [faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/) checks claims against retrieved context; [context recall](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/) requires reference evidence. No Ragas package, model service, paid API or new infrastructure was installed for this diagnostic. Human calibration and broader held-out merchant evaluation remain required for a quality claim.

## 11 · Four separate platform media buyers

The owner requested separate Meta, Google, Snapchat and TikTok buyers. Preserve the existing four identities and 76-agent catalogue; do not create duplicate agents. Lindsey (`lindsey-meta-media-buyer`) owns Meta, Raymond (`raymond-google-ads`) Google, Kelsey (`kelsey-snapchat-ads`) Snapchat and Zara (`zara-tiktok-ads`) TikTok. Jared coordinates cross-channel allocation. Dustin prepares approved Meta copy and scoped launch execution, without a competing budget mandate; Ploy's shop operations are distinct from TikTok media buying.

Each buyer receives a platform-specific operating workflow through its ordinary toolbox, account capability checks, source/metric definitions, scoped action permissions and a separate platform/account memory path. Shared brand facts can be reused; account permissions, budgets, attribution windows and operating histories cannot silently transfer. Current connector capabilities must be discovered. Without a connector, finish the local build sheet and analysis and state the remaining submission/verification step.

Acceptance covers four distinct exported identities and titles, ecommerce lead routing, valid library references, inclusion of the correct workflow in normal and build packs, and a downloadable ZIP roundtrip. Platform-specific output trials remain separate from these packaging checks. The workflow's allowlist and memory paths are agent instructions, not an authenticated multi-tenant permission boundary; actual enforcement belongs to the host and connector. No new external account access, ad spend, campaign mutation or production deployment is implied by creating these agents.
