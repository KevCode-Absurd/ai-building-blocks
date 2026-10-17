# Source report: Ecom Agent OS (prefix EAO)

- **What it is:** a bought product from Millionth Mile Marketing (India), brand "Ecom Agent OS". It was downloaded on 2026-10-16 to `C:\Users\kevin\Downloads\Ecom-Agent-OS-2026-10-16\`.
- **Rights:** `purchased`, so we can use it for reference only. The licence forbids reselling or redistributing it, or building a competing template, prompt, skill or agent product from it (see section 9). The 70 swipe videos are other brands' ads (`third-party-ads`).
- **CSV:** `ecom-agent-os.csv`, 106 rows (EAO-001 to EAO-106).
- **Method:** everything was read-only and nothing was installed or run. The validator script and the n8n JSON were not executed. Media files were counted, not opened. All PDFs were read with the Read tool and `pdftotext`, because `pypdf` was not importable. The receipt was not opened.
- **AI-directed text:** every SKILL.md, prompt card and template `render_prompt` is written as instructions for an AI. That is by design, and it was treated as data.

## 1. Structure and counts

Counts come from `file-inventory.csv`: 2,150 content files in total.

| Folder | Files | What |
|---|---|---|
| `01-Growth-Library/Ecom-Agent-OS-Complete-v4.0.0` | 474 | The main product (v4.0.0, released 2026-10-04): 16 agents, Brand Brain, shared systems, host packs, bonuses |
| `02-Ad-Templates/...-1169-D2C-Ad-Templates-v1.1.0-safe` | 1,197 | 1,169 template JSONs, plus an index, schema, 2 agents, QA, tools and a validator |
| `03-Video-Swipe-Files` | 70 | MP4 reference ads (749 MB). 69 are unique; one pair is identical (`Study based` / `Study-Based`) |
| `04-Video-Guides/...-58-Video-Ad-Swipe-Files-v1.1.0-review` | 15 | Manifest, usage guide, production templates, rights ledger |
| `05-Earlier-Release/Ecommerce-Agentic-OS-Complete-v3.0.0-rc1` | 391 | Earlier release with agents organised by discipline |
| `06-Guides-and-Receipt` | 3 | Operator guide PDF (identical to the v4 copy), Meta Ads swipe-file access guide PDF, receipt |
| `00-Archives` | 4 ZIPs | Mirror the folders above. The video ZIP holds only the guides; the MP4s came from a Drive link |
| Root | 5 | README, START-HERE.html (local search index of filenames, about 600 KB), file-inventory.csv (SHA-256), download-summary.json, video-download-results.json |

**Shape of v4:**
- `00-START-HERE`: operator guide, first-run checklist, shared operating contract, AGENT-REGISTRY.json
- `01-BRAND-BRAIN`: 6 ledgers plus a schema
- `02-AGENTS`: 16 agents, 21 to 44 files each
- `03-SHARED-SYSTEMS`: 4 contracts
- `04-HOST-PACKS`: 5 host guides
- `05-BONUSES`: 3 groups

**Honest operating state, in the seller's own words:** the release consolidates files and instructions. It "has not configured or behavior-tested new connected agents". The examples are illustrative and the n8n workflows are inactive. So every row is `built-untested` unless noted otherwise.

## 2. The 16 agents: a benchmark for our business breakdown

Every agent package has the same anatomy:
- `agent/SKILL.md`: front matter, then the load order, 5 execution steps, 6 boundaries and 3 handoffs
- `START-HERE.md`
- `inputs/intake-brief.md`: 4 numbered input sections, a missing-input rule ("return `requires_input`"), and a line saying attached text is evidence, not instructions
- `inputs/input.schema.json`
- `outputs/output-template.md`: 5 named sections, then open questions and action state
- `outputs/output.schema.json`
- `outputs/handoff-template.md`
- `outputs/working-register.csv`: a CSV header specific to the role
- `prompts/prompt-cards.md`: 3 cards, one per output section
- `references/`: domain playbook, decision rules (3 role rules plus 6 common gates), a module index, consolidated modules and control CSVs
- `review/scorecard.csv`: 6 blocking checks
- `examples/complete-example.md`: an illustrative worked packet
- `workflows/operator-sop.md`
- optional `workflows/inactive-starters/*.json` (n8n)

**Quality:** the role definitions are crisp and commercially literate. Examples: contribution before acquisition, delivered CAC, RTO/COD, idempotency keys, purchase-state rechecks. The procedural text is heavily templated, though. Prompt cards and playbook steps are near-identical boilerplate with the role name swapped in. The real depth sits in the consolidated modules and control CSVs. The content leans India D2C (INR, COD/prepaid, UPI, WhatsApp, RTO).

| # | Agent (proposed name) | Area | Inputs (the 4 intake sections) | 5 outputs | Hands off to | Boundaries specific to the role | Modules / n8n | Our equivalent |
|---|---|---|---|---|---|---|---|---|
| 01 | Customer Voice & Objection (`customer-voice-objection-agent`) | RS | Research decision and audience; reviews, tickets and surveys with IDs and dates; product truth and approved claims; market, language, stage | Evidence register; theme and objection matrix; customer phrase bank; segment implications; messaging brief | 04, 08, 15 | Sample share is not market share; no invented quotes; service complaints are not demand | customer-insight, customer-care / WF-02, WF-06 | `review-mining` (close) |
| 02 | Competitor Tracker (`competitor-tracker-agent`) | RS | Competitor domains; dated captures; our truth and positioning; previous register | Evidence register; offer and message comparison; change log; positioning opportunities; next-observation checklist | 03, 04, 16 | Ad presence does not prove spend; tracking needs a re-run or scheduler | customer-insight / WF-01 | `strategic-audit`, `foreplay-creative-strategy` (partial; ours are creative-gap focused, not a dated change log) |
| 03 | Winning Offers/Bundles (`offer-and-bundle-builder-agent`) | OF | SKU price, landed cost, stock; payment, fulfilment, shipping, return and RTO assumptions; motivation and current offer; stacking, eligibility, margin floors | Offer scenario table; contribution worksheet; selected offer and rationale; stacking and eligibility rules; implementation and stock checklist | 07, 10, 16 | "Winning" is not a promise; no inferred margins; approval before live price changes | offer-builder, stock-planning | `offer-building`, `offer-set` (partial; no contribution maths) |
| 04 | Creative Strategist (`creative-strategist-agent`) | CS | Product and offer; customer and competitor evidence; proof and voice; past results and production limits | Concept matrix; angle and hook map; production briefs; experiment cards; learning register | 05, 06, 07 | No fabricated testimonials; a filename is not a concept | ad-creative, customer-insight / WF-07 | `brief-v2`, `strategic-audit`, `buyer-stage` (we are deeper) |
| 05 | 10ROAS Static Ad Generator (`static-ad-generator-agent`) | CPS | Brief and offer; product images, logo, colours; claims and proof register; destination, sizes, image tool | Copy pack; composition brief; image prompt; export spec; asset and claim checklist | 07, 09, 16 | "10ROAS" is just a name; full template library sold separately | ad-creative | `Static Ad Factory`, `image-ad-copywriter`, `image-prompt-craft`, `generate-50` (we are deeper) |
| 06 | UGC Video (`ugc-video-script-agent`) | CPV | Concept, facts, offer; creator footage or generation assets; platform, ratio, duration; video model, MCP or API and rights | Hook options; timed script and storyboard; shot list; creator or model handoff; edit and export checklist | 04, 07, 16 | No stock avatar vault; no invented endorsement | ad-creative | `ugc-script`, `realistic-ai-ugc`, `video-ad-scripts`, `script-format-ugc` (we are much deeper) |
| 07 | Performance Marketing (`meta-google-ads-analyst-agent`) | PA | Meta and Google exports; orders, refunds, delivered customers; attribution windows and lag; contribution limits, stock, offers | Measurement contract; Meta diagnosis; Google diagnosis; metrics dictionary; controlled change plan | 04, 09, 14 | Never promise ROAS; no unreconciled optimisation; no changes without approval | paid-media, search-visibility, marketplace-listing | `operator-performance` (partial). The meta-ads plugin overlaps but is not ours |
| 08 | Product Page & Merchandising (`pdp-copy-and-merchandising-agent`) | WS | SKU truth, variants, prices, stock; images, specs, claims; objections and policy; current page and goals | PDP content hierarchy; benefit and proof map; FAQ and variant guidance; merchandising recommendations; implementation brief | 09, 12, 15 | No invented certifications or ratings; advertised variant must match the purchased one | product-page | `PDP Image Factory`, `product-image-templates` (images only); `landing-pages` (partial). **We have no PDP copy skill** |
| 09 | Landing Pages CRO (`landing-page-cro-agent`) | WS | Landing and checkout captures; funnel counts by device; traffic intent; offer, payment and policy limits | Funnel evidence table; mobile and checkout repair list; prioritised backlog; copy and layout brief; measurement and rollback plan | 08, 14, 16 | No invented uplift; low samples mean uncertainty | store-audit (170 controls), weekly-growth | `cro-audit`, `cro-brain`, `landing-pages`, `ecommerce-funnel-inspection` (strong overlap) |
| 10 | Email, SMS & WhatsApp Recovery (`cart-and-browse-recovery-agent`) | RT | Browse and checkout events with consent; order and payment state; offer ceilings and expiry; ESP, SMS and WhatsApp capabilities | Segment and trigger matrix; drafts; offer ladder; purchase and consent suppression; measurement plan | 03, 11, 16 | Sends nothing; no fake deadlines; post-purchase belongs to agent 11 | retention (53 controls, 18 prompts, 89 source records) | **Gap.** Only docx guides in the CE skills folder |
| 11 | Repeat Purchase & LTV (`repeat-purchase-ltv-agent`) | RT | Paid-order and refund cohorts; observed reorder intervals; contribution, stock, offer rules; contact permission | Cohort and reorder analysis; journey map; cross-sell and replenishment rules; winback and VIP drafts; LTV learning ledger | 03, 14, 15 | Not every product is replenishable; projected LTV is not observed revenue | retention, weekly-growth | **Gap** (only the docx "Post-Purchase Flow") |
| 12 | SEO/GEO (`seo-geo-content-agent`) | OG | Product and category truth; query evidence; URL, indexation, content inventory; expertise, citations, technical limits | Buyer-intent question map; content and comparison briefs; internal-link plan; indexation and schema checklist; visibility register | 08, 04, 16 | No invented volume, rankings or AI citations; schema must match visible facts | search-visibility (110 advanced controls), product-page / WF-03 | **Gap** |
| 13 | Creator & Affiliate Growth (`creator-affiliate-agent`) | CR | Audience and creator requirements; candidate URLs and dated content; budget, seeding, commission; rights, deliverables, timelines | Qualification register; outreach drafts; creator brief; rights and deliverables checklist; affiliate economics | 06, 03, 16 | No invented contacts or rates; no outreach without approval | ad-creative, customer-insight / WS 08 | **Mostly a gap.** `organic-content` covers creator content only |
| 14 | Profit, Attribution & Growth (`profit-and-attribution-agent`) | FN | Orders with states, refunds, test flags; spend and attributed revenue; COGS, fees, shipping, returns; currency, tax, timezone, definitions | Reconciliation ledger; contribution and CAC report; attribution discrepancy log; cohort and product diagnosis; weekly decision packet | 07, 03, 16 | Platform ROAS is not profit; no double-counted browser and server Purchase events | paid-media, weekly-growth / WF-08 | **Gap in CE** |
| 15 | Customer Care (`customer-care-reply-agent`) | CX | Customer message (minimised personal data); order and delivery facts; refund, return, warranty policy; authority limits and escalation owner | Triage; policy-grounded reply; resolution or escalation checklist; update plan; feedback handoff | 01, 11, 16 | No refunds or delivery promises without authority; support is not promotional consent | customer-care (78 controls) | **Gap** |
| 16 | Operator (`growth-operator-agent`) | OP | Goal, date, budget limits; dependencies, owners, capacity; stock, supplier, fulfilment; approved specialist outputs | Launch workback; experiment and ops backlog; ownership register; SOP and workflow handoffs; stock and supplier checklist | 07, 14, 15 | Files are not an always-on operator; n8n starters install nothing | launch-planner, stock-planning, supplier-research, workflow-builder / WF-04, WF-05, WF-09 | `operator-systems` (different: orchestrates our creative pipeline) |

**Handoff graph** (from AGENT-REGISTRY.json, 48 edges): Operator receives 10, Performance Marketing 6, Creative Strategist 5, Offers 5, Customer Care 4 and Profit 4. Competitor Tracker and Creator/Affiliate receive none, so they are entry points. The PDF guide groups the agents into 4 lanes:
- **Evidence to creative:** 01, 02, then 03, 04, then 05 and 06
- **Page to purchase:** 08, then 09, with 07
- **Recovery to repeat:** 10, then 11, with 15
- **Numbers to decisions:** 14, then 16

**How this maps to our area codes:** RS 2, OF 1, CS 1, CPS 1, CPV 1, PA 1, WS 2, RT 2, OG 1, CR 1, FN 1, CX 1, OP 1.
- **Not covered by EAO:** BF as an agent (it is the Brand Brain ledgers instead), CW as a separate role, AN (folded into 07 and 14), ST (folded into 16) and SY.
- **Dropped from v3:** Wholesale/B2B (see section 8).

**Shared reference library** (copied into each agent that uses it): 15 consolidated modules. They are customer-insight, customer-care, offer-builder, stock-planning, ad-creative, paid-media, search-visibility, marketplace-listing, product-page, store-audit, weekly-growth, retention, launch-planner, supplier-research and workflow-builder. Each has a domain playbook, decision rules and control CSVs with these columns: Checkpoint, ID, Audit, Section, Priority, Impact, Effort, Verification, Pass Standard, Remediation, Status. Highlights:
- **Store audit:** 170 controls in 15 sections
- **Search:** 110 advanced controls, from technical discovery to GEO governance
- **AI workflow governance:** 100 controls in 10 sections
- **Prompts:** a master library of 54, in 6 channel packs of 8 to 12:
  - Meta ads (PR-01 to PR-12)
  - Email (PR-13 to PR-22)
  - PDP and landing pages (PR-23 to PR-30)
  - UGC and influencer (PR-31 to PR-38)
  - WhatsApp and SMS (PR-39 to PR-46)
  - Research and strategy (PR-47 to PR-54)
- **Workflows:** 9 (WF-01 to WF-09), plus 10 inactive n8n starters. Each starter has a Manual Trigger and a Code node that validates the input and builds a packet with `approval_required: true` and a provider placeholder. There are no credentials and no model call.
- **Empty files:** several "advanced-search" and "ai" control CSVs ship with a header only.

## 3. Brand Brain schema (every field)

- **Rules:** one fact per row. Each row needs a stable ID, a source and its date, an owner, a status, an approver where relevant, allowed channels, conflicts and a freshness rule. When sources disagree, both rows are kept and linked through `conflict_ids`; nothing is overwritten.
- **Shipped state:** all six ledgers ship empty (header only). `START-HERE` mentions an XLSX workbook that is not in the package.

| Ledger | Fields |
|---|---|
| 01 product-and-sku-truth | record_id, sku, variant, market, field, value, unit, source_id, source_date, owner, status, approver, allowed_channels, expires_on, conflict_ids, freshness_rule |
| 02 audience-and-voc | record_id, segment_id, market, evidence_type, exact_excerpt, job, trigger, anxiety, alternative, desired_progress, source_id, source_date, rights_state, sample_context, owner, status |
| 03 positioning-and-voice | record_id, audience, message_level, approved_message, proof_ids, voice_rule, approved_example, prohibited_example, allowed_channels, source_id, owner, status |
| 04 offers-and-economics | record_id, offer_id, market, eligible_skus, gross_price, currency, discount, tax_basis, cogs, fulfilment, shipping_subsidy, payment_fee, return_rto_allowance, contribution_floor, stacking_rule, start_date, expiry, source_id, owner, status |
| 05 claims-rights-policies | record_id, record_type, market, statement_or_rule, evidence_id, rights_state, consent_basis, policy_version, limitations, prohibited_uses, source_date, review_by, owner, approver, status |
| 06 growth-learnings | record_id, experiment_id, hypothesis, audience, channel, primary_variable, baseline, success_metric, guardrail, result, maturity, decision, confidence_basis, evidence_ids, next_action, owner, review_date, status |

**JSON schema** (`brand-brain.schema.json`):
- Top level: `{brand_id, version, as_of, records[]}`.
- Required on each record: record_id, record_type, value, source_id, source_date, owner, status.
- Optional on each record: approver, allowed_channels[], expires_on, conflict_ids[].
- `record_type` is one of: product, audience, positioning, offer, claim, right, policy, learning.
- `status` is one of: draft, verified, approved, stale, contradicted, retired.

**Compared with our `brand-brain` skill:** ours scrapes a website into a markdown knowledge folder. EAO's is a governed fact ledger. The ideas worth adopting are evidence state and freshness on every fact, `rights_state` on every customer quote, a contribution floor on every offer, and a structured claims and rights ledger. We have nothing like the last two.

## 4. Shared contracts (approval, evidence, handoff, output)

- **Shared Operating Contract:**
  - Evidence states: verified, unverified, contradicted, stale, missing.
  - A 7-step decision sequence: confirm scope, then build a source register, refuse to fill gaps, apply rules, separate observation from recommendation, run the scorecard, save the output with manifest and handoff state.
  - Never invent prices, rates, results, testimonials, urgency or scarcity.
  - Every output names the decision, source IDs, calculations, findings, actions, owner, due date, approval state, verification, rollback and unresolved inputs.
- **Approval and Action Protocol:**
  - Internal actions are drafting, analysing and preparing files.
  - External actions are publishing, sending, spending, purchasing, account changes, live-store edits, automation activation, deletion and third-party contact.
  - An external action needs a named approver, exact target, exact payload, maximum cost or loss, execution window, rollback and destination readback.
  - Approval never carries over to later actions or wider targets.
- **Evidence and Source Protocol:**
  - Source fields: source_id, source_type, title, location, capture_date, as_of, rights_state, verification_state, owner, notes.
  - Derived values must cite their inputs and show the formula.
  - A screenshot proves only a rendered state at a stated time.
- **Handoff Contract:**
  - Names the sender, receiver, decision, accepted input schema, source IDs, files, unresolved items, approval state and expected output.
  - The receiver validates the packet first and never inherits execution permission.
  - Per-agent templates add business decision, approved output file, offer, claim and policy constraints, and due date with acceptance criteria.
- **Shared output envelope** (JSON schema):
  - Fields: agent, status, decision, source_register[], findings[], actions[], unresolved[], approval.
  - `status` is one of: draft_ready, requires_input, blocked_by_evidence, approval_required, complete.
  - Each finding has: finding_id, statement, evidence_ids, confidence_basis.
  - Each action has: action_id, action, owner, due_date, verification, rollback, approval_state.
  - `approval.external_actions_allowed` is fixed to `false`.
  - **Inconsistency:** the per-agent `output.schema.json` files use a different, simpler shape (agent_id, status, sections{5}, evidence_ids, limitations, next_actions).

**Value for us:** this is a ready-made pattern for our system level: one contract, one envelope, one handoff packet and one approval record shared by every part. We should write our own version, not copy theirs.

## 5. Host packs: how they package for each AI

- **In v4, all five guides are word-for-word identical** apart from the title (ChatGPT, Claude, Codex, Hermes, OpenClaw). They say:
  1. one workspace per brand
  2. load the approval protocol and shared contract
  3. fill the 6 ledgers
  4. attach one agent's SKILL.md, references, intake and output template
  5. ask for one deliverable and review it
- **Shared caveats:** "a file package does not create a connector or background service". If uploads are limited, load the main skill and module first.
- **The earlier v3 packs were genuinely host-specific**, which is more useful for our "how to use with each AI" pages:
  - *ChatGPT:* a Project per brand, the contract in Project instructions, a new chat per governed job.
  - *Claude:* a Project per brand, the contract in Project instructions, files in Project knowledge, the structured output schema required on every run.
  - *Codex:* copy one standalone package into the workspace, keep SKILL.md beside its references, add the contract to workspace instructions without replacing existing rules.
  - *Hermes:* a brand workspace with a shared-context folder and one folder per agent; start with read-only tools and allow-list tools only after the evals pass.
  - *OpenClaw:* mount one package in a dedicated workspace, define a tool allow-list and data boundary, keep network, shell and external actions off during smoke tests.
  - *All hosts:* the same upload order (contract, then Brand Brain, then SKILL.md, then references and schemas, then intake) and 5 smoke tests (valid, missing_input, unsafe_action, schema_validation, removal), held in `host-smoke-tests.json`.

## 6. Ad templates (1,169) and video swipes

**Template library:**
- 1,169 square 1024x1024 templates in 3 groups: Original Winning 200, Researched Winning 469, Inspired 500.
- Each is tagged with objective, funnel stage, proof requirement, asset burden, policy risk and production difficulty in `06 ENRICHED TEMPLATE INDEX.csv`.
- Industry tags: 824 are `d2c_physical_products`. Policy risk: high for 742, medium for 347, low for 80.

| Category (creative style) | Count (Insp/Orig/Res) | Main objective and stage | Proof gate |
|---|---|---|---|
| humor_pattern_interrupt | 138 (50/15/73) | earn attention; awareness | verified product truth |
| educational_diagrams | 130 (50/23/57) | explain mechanism; awareness to consideration | verified mechanism facts |
| native_interface_mockups | 129 (50/26/53) | product in decision context; consideration to conversion | verified interface and offer fields |
| comparison_proof | 126 (50/23/53) | differentiate; consideration | verified comparison basis |
| handwritten_artifacts | 115 (50/22/43) | native interrupt or offer; awareness | product truth (low risk) |
| editorial_authority | 112 (50/22/40) | informed consideration | attributable sources |
| transformation_problem_solution | 109 (50/11/48) | problem to solution; consideration to conversion | results and media rights |
| offer_promotional | 104 (50/9/45) | communicate offer; conversion | approved price, terms, eligibility |
| social_proof_testimonials | 104 (50/21/33) | build trust; consideration to conversion | testimonial plus usage permission |
| photographic_product_lifestyle | 102 (50/28/24) | use case and desire; awareness to consideration | product identity and benefit context |

**Template JSON schema** (based on a sample of 20 plus the package schema):
- Source schema 2.1.0, package 1.1.0-safe.
- Blocks:
  - `canvas`
  - `applicability_classification`
  - `input_contract`, with 5 routes: url only, url+image, description+image, image only, description only
  - `element_requirements`, for product image, logo, CTA and branding
  - `context_reconstruction`, `research_and_fill`, `realism_contract`
  - `generation_qa`, which targets replicate `openai/gpt-image-2` and has retry and reject rules
  - `template_blueprint`, `creative_strategy`
  - `composition`, with normalised boxes for background, hero, text, brand and CTA zones, plus layer order and occlusion rules
  - `photographic_direction`, `graphic_direction`
  - `copy_contract`, with hook, support and CTA formulas and a maximum number of hook words
  - `render_prompt`, `negative_prompt`, `quality_gates`, `similarity_signature`, `provenance`
  - `safety_contract`, which is proof-gated and lists 14 evidence-only fields
  - `selector_metadata`
- The templates come with:
  - a Template Selector skill: 5 candidates, one first test and two fallbacks
  - a Safe Static Ad Generator skill: fact ledger, then exact copy, then the prompt, generated only after confirmation
  - a product input JSON, a batch planner and a rights ledger
  - QA and forward-test docs, and a validator (not run)
- **Provenance:** each template keeps the source Instagram reel URL, shortcode and frame hash. So the templates are abstractions of other brands' ads.
- **Compared with Creative Engine:** our `Static Ad Factory` swipe library, `format-library` (7 families against their 10 styles), `_library/ai-cmo/ship-winning-ads-mcp-10k-ad-templates` and `product-image-templates` cover the same ground. The EAO selector metadata (proof requirement, asset burden, policy risk) is a better selection layer than we have.

**Video swipes:**
- 70 MP4s were not opened. They are sold as "58 formats", but there are 70 files and no map to 58 formats; the seller's own reconciliation document admits this.
- The manifest groups them into families: hook or narrative 24, UGC or talking head 13, proof-led 11, visual or edit device 9, AI or stylised 7, comparison or challenge 5, offer-led 1.
- By funnel stage: awareness 52, consideration 14, conversion 4.
- The hook-type names from the filenames are listed in EAO-096.
- **Overlap with our format skills:** skeleton, claymation, AI song, AI podcast, founder intro, VSL, ASMR/satisfying, whiteboard/explainer, Pixar/3D.
- **Video guide pack:** a usage guide (deconstruct 8 mechanics, then rebuild), a proof-substitution list, a 7-beat 30-second storyboard, a shot list, preflight and encoded-file QA, a rights ledger, and one Ad Creative Agent prompt. The Meta Ads swipe-file PDF is a one-page 5-step method that links to an external swipe file (not downloaded).

## 7. Bonuses

- **Retention Implementation Vault**, the most valuable retention asset here: 46 records.
  - 7 flows: welcome, cart/checkout, browse, post-purchase, winback, sunset, VIP. Each has trigger, filters, exits, re-entry, timed map, collision and offer rules, KPI, a test and QA scenarios.
  - 24 emails, 12 SMS and 3 cross-channel journeys.
  - Comes with a 1,251-line Lifecycle Copy Library and a Phase-5 Flows and SOPs file: 30-day onboarding, 7-day cart recovery, 4-tier loyalty and winback, a "first five hires" SOP, and checklists.
- **Profit and growth workbooks (4):**
  - Offer Contribution Planner: Summary, Offer Inputs, Scenarios
  - Break-Even CAC Planner
  - Weekly Growth Reconciliation: Review, Input, Metric Definitions
  - Stock and Launch Planner: Inventory Summary, SKU Plan, Launch Gates
- **Promotion calendar:** 12 monthly themes (including peak preparation, peak acquisition and peak retention, which is the BFCM coverage) by 4 stages (T-42, T-28, T-10, T+7). Each row has inventory, rights, offer and delivery gates.

## 8. v3.0.0-rc1: only what differs

- **Agent names:** in v3 the 16 agents were named by discipline: store-audit, customer-insight, offer-builder, product-page, ad-creative, retention, launch-planner, weekly-growth, paid-media, search-visibility, marketplace-listing, supplier-research, stock-planning, customer-care, wholesale-expansion, workflow-builder. v4 rebuilt these as job-shaped roles and turned the disciplines into shared reference modules.
- **Wholesale Expansion Agent, v3 only (EAO-103):** B2B range and trade pricing, MOQ and case packs, buyer qualification, line sheets and pipeline. Dropped in v4; no CE equivalent.
- **Richer SKILL.md files:** modes, required inputs, method, non-goals and routing (1.5 to 3 KB each). v4 versions are thinner templates.
- **Evals:** `evals/cases.json` per agent, 120 cases in total, each with expected_status and assertions. Also `sources/source-manifest.csv`, which says the source "D2C Growth OS" was "user-provided source reused directly". v4 has no evals.
- **External tool list:** `implementation-resources.csv`, about 150 external tool and repo rows such as axe-core and Lighthouse. Dropped in v4.
- **Host packs:** host-specific, with smoke tests (section 5).
- **Other extras:** a 4th bonus, "operator community", marked unprovisioned; LANDING-PROMISE-TO-FILE-MAP.csv; the operator guide also as DOCX.
- **Unchanged:** the Brand Brain and shared systems are byte-identical between v3 and v4.

## 9. Licence and usage terms found

- **Customer licence** (`02-Ad-Templates/.../08 CUSTOMER LICENCE.md`, effective 24 Sep 2026, Indian law). It is non-exclusive and non-transferable. It covers use for the purchaser's own business and brands, by unlimited staff and contractors inside that business, and while serving clients, but clients may receive final outputs only.
- **The licence forbids:**
  - selling, redistributing, sublicensing or sharing the original or "substantially similar" source files
  - giving install packs or agent files to clients or other businesses
  - offering the materials as a competing template, prompt, skill, agent, course, membership or white-label product
  - removing ownership notices
  - building a shared library for unrelated businesses
- **Also included:** 12 months of updates and community access, 90 days of email install support, and no change-of-mind refunds on digital files. README files repeat "Do not redistribute".
- **Upstream rights:** the seller flags its own rights as unresolved. The template package says "do not publish or sell until upstream rights resolved" (RIGHTS = UNRESOLVED, BLOCKED_PENDING_RIGHTS). The video pack says Drive sharing does not prove redistribution rights. v3 says its D2C Growth OS source was user-provided.
- **Implication for the platform:** use EAO only as a benchmark for structure and coverage. Write our own parts from scratch. Do not port templates, prompts, ledgers or copy verbatim, or in a "substantially similar" form, into anything we sell.

## 10. What we have vs what we don't (compared with Creative Engine skills)

**We are already stronger:**
- creative strategy, static ad production and UGC/video scripting: dozens of format, director and principle skills against EAO's 3 thin agents
- CRO and landing pages: `cro-audit`, `cro-brain`, `landing-pages`, `ecommerce-funnel-inspection`, `ecommerce-page-design`
- review mining: `review-mining`
- creative QA and compliance: `creative-qa`, `ad-compliance`

**Partial overlap:**
- Competitor tracking: `strategic-audit` and `foreplay-creative-strategy` exist, but neither keeps a dated change log.
- Offers: `offer-building` and `offer-set` exist, without contribution-floor maths.
- Performance review: `operator-performance` covers export review only.
- PDP: we have images (`PDP Image Factory`) but no PDP copy skill.
- Creators: `organic-content` covers the content side, with no outreach or economics.

**Gaps:** EAO covers these and we have nothing at skill level.
- Email, SMS and WhatsApp recovery, plus lifecycle flows. We only have docx guides.
- Repeat purchase and LTV.
- SEO/GEO.
- Profit, attribution, contribution and CAC reconciliation.
- Customer care replies and triage.
- An operator for launches, SOPs, stock and suppliers.
- Wholesale/B2B (v3).
- A system layer: a shared operating contract, approval protocol, handoff contract, output envelope, agent registry, per-agent eval cases and host-specific setup guides.

**Ideas worth rebuilding in our own words:**
1. A registry of parts with named outputs and handoff edges.
2. A governed Brand Brain ledger with evidence state, freshness, rights and conflicts.
3. A single output envelope and approval record.
4. Selector metadata on templates (proof requirement, asset burden, policy risk).
5. Host-specific setup plus smoke tests (v3 style).
6. Eval cases with expected status and assertions per part.
