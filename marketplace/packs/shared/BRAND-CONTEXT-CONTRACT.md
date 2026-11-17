# One shared brand context

Every specialist uses the same brand evidence, with a task-specific slice. The canonical home is `context/org-context/`, maintained by `tools/org-context.mjs`; `context/MEMORY.md` is its short navigation and continuity summary. Follow `MEMORY-ARCHITECTURE.md` for semantic, episodic, procedural and working memory. This contract adds no database and does not certify that a particular brand is complete.

## Canonical contents

| Existing home | Required detail when relevant to the task |
|---|---|
| `foundation/brand-dna.md`, `facts.json` | Business identity, positioning, differentiators, market and product scope; distinguish owner statements, source observations and proposed interpretations |
| `look.json`, `foundation/design.md` | Exact hex values and roles; font family, weight, size and availability by role; approved logo master/version, clear space, minimum size and variants; composition, product fidelity and accessibility rules. Measured website CSS is an observation, not automatically the master brand guide |
| `voice.md`, `foundation/voice-bank.md`, `foundation/customer-talk.md` | Actual examples with source, date, channel and purpose; vocabulary, sentence rhythm, tone, language/locale, greetings and handling of apologies/refusals. Separate original quotations from generated alternatives; retain approved/rejected examples and why |
| `foundation/customers.md`, `foundation/why-they-buy.md`, `data/segments.md` | Evidence-backed jobs to be done, occasions, objections, buying triggers and customer language; sample size, sampling period and source. Label persona hypotheses. Ad targeting is not proof of who purchases |
| `foundation/claims.md`, `foundation/dos-donts.md`, `facts.json` | Claim text, product/market scope, proof locator, required qualification, expiry, approval status and prohibited wording. Historical ad copy proves wording existed, not that its claim remains true |
| `references.md` and a linked private asset manifest | Asset ID, source/version/hash, SKU/variant mapping, dimensions/aspect ratio/duration, transcript and visual review status, permitted edits, channel/territory/time rights and model/music/logo restrictions. Identify reference-only assets and unreviewed media; filenames do not establish product identity |
| `offers.json`, `foundation/markets.md` | SKU price and currency, discount basis, stock source, eligibility, dates/timezone, exclusions, destination/language, shipping/returns/warranty terms and policy exceptions. An expired offer stays expired even if an old ad is active |
| `data/creatives.md`, `data/funnel.md`, `worked.md` and linked reports | Exact account, period, currency/timezone, event definition, attribution window/model, denominator, gross/net treatment, refunds/tax/shipping/fees, data latency and reconciliation status. Join creative IDs to outcomes before calling an asset a winner |
| `sources.md`, `history/`, source receipts and owner resolutions | Source locator and version/hash, capture time versus effective time, authority and access scope, corrections, revocations and superseded values. Keep contradictory evidence available for review |

Use stable fact keys and source references rather than repeating numbers in many files. Rich design, voice and media files remain canonical in their existing locations; a typed semantic entry can point to them. Episodes record what happened, procedural references explain how to work, and task packets contain temporary selections. Neither a lesson nor a generated summary becomes an approved brand rule by repetition.

## Evidence state and authority

Keep these dimensions separate: **observed** means a source says or shows it; **verified** identifies the specific independent check performed; **approved** names the actual decision and its scope; **historical** records a past period; **inferred** is a hypothesis; **missing** is an unresolved dependency. A hash verifies bytes, not truth or usage rights. A readiness score measures the check's criteria, not factual accuracy or publication readiness.

Preserve already authorized work. Brand knowledge, prior campaigns and connector visibility do not expand the current action grant. Local partition labels are not authenticated owner identity. Shared deployments must enforce tenant/account access before retrieval; never pool private customer, brand or platform-account history into a general method library. Avoid customer identifiers in reusable context.

## Task slices

Every slice includes brand identity, relevant restrictions, source versions, unresolved dependencies and the required deliverable/check. Add only the evidence the role needs:

| Specialist | Additional slice |
|---|---|
| Meta buyer | Meta account/events/attribution, creative-to-result joins, audiences, placements, budget bounds, offer/product evidence and store reconciliation |
| Google buyer | Google account/conversion settings, brand versus nonbrand search, shopping feed/SKU status, query and landing-page intent, attribution and margin evidence |
| Snapchat buyer | Snapchat account/pixel events, audience evidence, placement/format requirements, consent constraints and platform-specific creative/results |
| TikTok buyer | TikTok account/events, creator and music usage rights, video/transcript review, placement requirements and platform-specific creative/results |
| Creative and copy | Exact design tokens, logo/product assets, sourced voice examples, customer language, claims/offer qualifications, intended channel/format and acceptance references |
| SEO, AEO and GEO | Product/category/entity facts, markets/languages, site/indexing evidence, search intent, qualified claims and schema evidence; never invent reviews or citations |
| Retention | Lifecycle/cohort definitions, consent and suppression state, channel voice, eligibility, current offers, frequency constraints and contribution/unsubscribe outcomes |
| Support | Complete relevant policy and exceptions, product instructions, relationship history permitted for this case, escalation boundaries and recurring complaint themes |
| Operations and merchandising | SKU/variant, stock freshness, supplier/lead-time evidence, fulfilment capacity, market restrictions and service commitments |
| Finance and orchestrator | Reconciled metric definitions, source periods, cash/margin/stock constraints, uncertainty, priorities and the evidence that distinguishes a symptom from a root cause |

Platform operating knowledge and account permission never transfer between the four buyers. Fetch current platform requirements where the task depends on them; generic research and another account's results are conditional references.

## Read, refresh, hand back

1. Read the index and relevant reconciled facts, including owner corrections/revocations. Use `org-context.mjs memory` and a task slice; a verified projection requires the host's genuine scope binding. Do not fabricate that binding to bypass missing evidence.
2. Decompose the task into required decisions and retrieve evidence for each. Use `tools/EVIDENCE-PACKETS.md` for source hashes, locators, qualifications and coverage gaps. A whole folder's availability or a search match does not prove the relevant exceptions were read.
3. Refresh volatile facts before dependent actions. The org-context defaults are seven days for fast facts, thirty for data and ninety for foundation/look/voice; these are cache ceilings, not guarantees. Current price, stock, budget, policy or offer validity may require immediate readback. Download time never resets a historical fact's effective date.
4. When sources disagree, preserve both and reconcile the exact measure/scope/date. A later capture does not automatically override an owner correction. Omit unresolved claims from independent drafts; ask only when a consequential dependent decision cannot proceed safely with available evidence and existing authorization.
5. Give each delegate a pinned slice and explicit acceptance checks. The parent checks cross-channel consistency, calculations, actual artifacts and source qualifications. If canonical inputs change, rebuild affected packets rather than silently keeping their old summaries.
6. Write source-backed corrections through the existing ledger; record observable outcomes in the episode and concise continuity notes. Save approved/rejected creative with its reason and measured outcome separately. Read back persistence before claiming it was saved.

Retain customer difficulty and dissent as signals. Summarize repeated complaints, failed searches, policy friction and costly workarounds with samples and follow-up ownership. Keep the human meaning of an exception visible; faster resolution is not evidence that the underlying product problem improved. Review important judgments and preserve purposeful human customer/supplier contact according to the business's operating agreement.
