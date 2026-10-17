# Ecommerce OS folder (source EOS): inventory report

Source: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\`. Everything was covered except `skool\`. Inventoried 17 Oct 2026, read-only.
Rows: `ecommerce-os.csv`, which uses the same IDs as the tables below.

## Row index (CSV)

| Block | IDs | Rows |
|---|---|---|
| AI CMO | EOS-001 to EOS-048 | 48 |
| Docs: product blueprint set | EOS-049 to EOS-051 | 3 |
| Docs: architecture set | EOS-052 to EOS-055 | 4 |
| Docs: lifecycle set | EOS-056 to EOS-059 | 4 |
| Docs: business-in-a-box set | EOS-060 to EOS-065 | 6 |
| Docs: financial set | EOS-066 to EOS-071 | 6 |
| gehna brand brain + tmp | EOS-072 to EOS-089 | 18 |
| **Total** | | **89** |

## 0. What is in this folder

| Folder | Files | What it is | Catalogue value |
|---|---|---|---|
| `AI CMO\` | ~17,000 (~12 GB, mostly images) | 32 skill folders plus 14 .docx guides from the paid AI CMO community, unzipped as is | **Duplicate**: every item also exists in Creative Engine `skills\`. See §2. |
| `Docs\` | 16 (14 PDF, 2 DOCX) | The "Ecommerce OS" planning library (3-18 Sep 2026), produced by Kevin with Codex. It covers the business model, lifecycle, finance, architecture and engineering. | **Highest knowledge value.** It is the master map of business parts (§1). |
| `output\` | 11 | Markdown sources and PDF twins of 6 of the Docs, plus the "Ecommerce Operating System Blueprint" .docx | md twins of the Docs; the .docx is unique |
| `tmp\` | 650 (mostly page renders) | Codex build pipelines (reportlab/docx/pptx), markdown sources, QA, `backlog.json` (300 financial opportunities), `simulate.py` (24 rule tests) | Build intermediates. Exceptions: `backlog.json` (structured data) and `simulate.py` (decision-rule logic). |
| `Presentations\` | 1 pptx (12 MB) | "Ecommerce OS: A business in a box" v2 deck, 32 slides with notes | Pitch and strategy narrative |
| `.chart-data-*\` (3) | 6 | Candidate copies of the same deck plus chart snapshots | Junk/intermediate (~36 MB) |
| `gehna brand brain\` | 1,370 (1,180 jpg, 170 png, 9 md, 1 html) | A complete real brand brain for Gehna (Chennai fine jeweller) plus a Diwali offer playbook | **Reference instance of the `brand_brain` data contract** (§3). Confidential client data. |

All Docs are AI-generated planning documents. None of the systems they describe is built, so every Docs row has status `draft` and rights `own`. Several documents exist in 2-4 copies (PDF in Docs, PDF in output\pdf, .md in output, content.md in tmp). The CSV keeps one row per document and lists the twins in `notes`/`duplicate_of`.

### Source short-names used for citations below

| Tag | Document (main file) | Date | Size |
|---|---|---|---|
| **IDEAMAPS** | Docs\Ecommerce idea maps.pdf, "The Full Idea Map" (35-idea stack rank) | 7 Sep | 21 pp |
| **DECKv2** | Docs\Ecommerce-OS-Deck-v2.pdf (pitch deck) | 3 Sep | 34 slides |
| **USOPP** | Docs\Ecommerce_OS_US_Opportunity_Architecture_v1.0.pdf (178 items, 20 domains) | 5 Sep | 35 pp |
| **FINMAP** | Docs\Ecommerce-OS-Financial-Operating-Map.pdf (India-first, by statement line) | 7 Sep | 17 pp |
| **FSOS** | Docs\Ecommerce_OS_Financial_Statement_Operating_System.pdf (+ .docx twin) (447 levers) | 7 Sep | 23 pp |
| **FINPLAY-US / -GL** | output\Ecommerce_OS_(US_)Financial_Opportunity_Playbook.md (+ PDFs) (300 opportunities; `tmp\pdfs\(us\)backlog.json`) | 7 Sep | ~44 pp |
| **BIAB-DOCX** | Docs\Ecommerce_OS_Business_in_a_Box_Blueprint.docx (17 capability areas, routines R01-R24) | 8 Sep | 37 pp |
| **BIAB-DECK** | Presentations\Ecommerce_OS_Business_in_a_Box_v2.pptx | 8 Sep | 32 slides |
| **LIFECYCLE** | Docs\Ecommerce_OS_Complete_Lifecycle_Blueprint.pdf (22 playbooks, I01-I40 image and V01-V16 video formats) | 9 Sep | 56 pp |
| **BIAB-PDF / -US** | Docs\ecommerce-business-in-a-box-blueprint(.pdf / (1).pdf) (India / US editions) (M01-M21, gates G01-G11, 24-step Disciplined Entrepreneurship map) | 10 Sep | 95 pp |
| **EOSBP** | output\ecommerce-blueprint\Ecommerce Operating System Blueprint.docx (Meta-first implementation blueprint) | 16 Sep | ~20 pp |
| **ARCH-A** | tmp\pdfs\final_blueprint\input\ecommerce-os-architecture.txt ("knowledge engine" Rev A; no PDF in Docs) | 16 Sep | ~29 pp |
| **DEH** | Docs\Ecommerce_OS_Data_and_Engineering_Handbook (1).pdf (= output .md) (**M01-M25 modules**, B01-B21, R01-R12 refs) | 16 Sep | 58 pp |
| **DELIGHT** | Docs\Ecommerce_OS_Customer_Delight_Architecture.pdf v1.1 (§1-§39, 12 domain orchestrators) | 16 Sep | 40 pp |
| **WGLL** | Docs\ecommerce-os-what-good-looks-like (1).pdf (stages S0-S5, 62 baseline checks, 18 modules, 124 sub-agents) | 16 Sep | 22 pp |
| **SPLIT** | Docs\ecommerce-os-build-split (1).pdf (Part A Kevin knowledge, Part B Colin engineering, 15 audit detectors) | 16 Sep | 27 pp |
| **CPB** | output\Ecommerce_OS_Complete_Product_Blueprint.md (+ PDF) (the **consolidated v1.0**, maps all the others) | 16 Sep | 97 pp |
| **BACKEND** | Docs\Ecommerce_OS_Backend_Architecture.pdf Rev C (latest: planes, vocabulary, ~35 agents, 5-month build) | 18 Sep | 42 pp |

**How the documents evolved.** They grew in this order:
1. IDEAMAPS, DECKv2 and USOPP: an India/COD-first service "idea stack" with GPP as the north star.
2. FINMAP, FSOS and FINPLAY: financial-statement re-cuts. FINPLAY has the corrected accounting.
3. BIAB-DOCX/DECK, then BIAB-PDF: "business in a box", with 4 entry paths.
4. LIFECYCLE and DELIGHT: the full customer and business lifecycle.
5. DEH, WGLL, SPLIT and EOSBP: work manuals for Kevin and Colin.
6. CPB (consolidation), then BACKEND (latest architecture).

When documents disagree, **CPB/BACKEND supersede the earlier ones** on the north star, stage gating and publishing rights. **FINPLAY-US supersedes FINMAP/FSOS** on accounting definitions.

---

# 1. The ecommerce business model: master outline of parts

This section merges the 18 documents into one map. Each part carries citations to the documents above. The full per-document outlines are in **Appendices A-E** (A = CPB/WGLL/SPLIT, B = BACKEND/DEH/EOSBP, C = LIFECYCLE/DELIGHT/IDEAMAPS/DECKv2, D = BIAB, E = finance). Use the appendices when you need every sub-item.

**Recommended catalogue spine:** the **25 modules M01-M25** [DEH; CPB]. They are stable IDs, already crosswalked to WGLL modules 1-18, SPLIT 3-letter codes, BIAB-PDF M01-M21, BIAB-DOCX areas 1-17 and LIFECYCLE playbooks 01-22 (see §1.4). Warning: **BIAB-PDF also uses "M01-M21" with different meanings**, and "24" means the Disciplined Entrepreneurship steps in BIAB-PDF but routines R01-R24 in BIAB-DOCX. The catalogue should prefix them (`DEH-M08` vs `BIAB-M09`).

## 1.1 What the operating model is (cross-cutting principles)

- **One machine, three views.** The business turns cash -> inventory -> traffic -> orders -> collected cash. The P&L shows whether each cycle made a profit. The balance sheet shows how much cash is trapped. Cash flow shows whether growth is self-funded. [FINMAP p1]
- **North star.** Kept gross profit / contribution dollars plus cash, never ROAS. [FSOS §0; USOPP §1; FINMAP §5.1]
  - Early docs: gross profit per purchase (GPP) [IDEAMAPS 1.2; WGLL intro; ARCH-A].
  - CPB revises this to "no single metric": a three-beneficiary scorecard (end customer / founder / agency) and, per workflow, 1 primary decision metric + diagnostics + guardrails [CPB VISION/02 p4; BACKEND §10].
  - LIFECYCLE: "retained CM2 dollars subject to cash, CX and quality constraints" [LIFECYCLE Economics p6].
- **Two journeys, one record.** The business journey (discover -> make viable -> position -> acquire -> convert -> deliver -> activate -> retain) runs alongside the customer journey [LIFECYCLE System map p3; CPB VISION/04 p6].
  - Feedback paths: returns -> research; support -> conversion; inventory -> acquisition; retention -> offer design; profit -> priorities [LIFECYCLE p3; DELIGHT §4; USOPP §5].
- **Universal baseline + stage-specific methods.** Baseline standards (e.g. working checkout, accurate images, tracking) apply at every size. Stage cards only add methods. Eligibility is "eligible / ineligible / unknown" based on real prerequisites (traffic, conversions, cost data), not revenue labels. [DELIGHT §2, §6; DEH A02; CPB OM/02 p8; BACKEND §6 p16; WGLL §3.2]
- **The 9-step loop every workflow completes** [CPB OM/01 p7]:
  1. frame the decision;
  2. establish the foundation;
  3. gather evidence;
  4. explain the opportunity;
  5. create an option portfolio;
  6. select a testable brief;
  7. produce and review;
  8. execute and verify;
  9. measure and learn.
  - Variants: connect -> audit -> propose -> run -> report [DECKv2; FSOS]; the 12-step experiment loop [BIAB-PDF §17].
- **Capability hierarchy = catalogue levels.** Tool -> Skill -> Routine -> Workflow -> Agent -> Platform [BIAB-DOCX §6; BIAB-DECK s20]. LIFECYCLE codes these as H/P/S/R/L/A: Human, Prompt, Skill, Routine, Loop, Agentic workflow. It adds a decision rule for picking the lowest level that works, plus automation economics [LIFECYCLE Execution model p4].
- **Standard routine contract.** Every routine declares: outcome, audience, trigger, inputs, freshness, procedure, output schema, tools, spend boundary, comms policy, approvals, success test, failure handling, recovery, owner, version. Each run logs inputs, actions, evidence, cost, time and outcome. [BIAB-DOCX §6] This is ready to use as the catalogue item schema.
- **Autonomy ladder** (promotion per action class):
  - Observe -> Prepare -> Execute with approval -> Execute within policy -> Coordinate a bounded objective [BIAB-DOCX §9; BIAB-DECK s27; DELIGHT §8].
  - WGLL/SPLIT: "AI has upload rights, never publish rights". CPB softens this to standing authority with limits later [WGLL §1.2; CPB VISION/03].
- **Always human.** Physical quality checks, samples, supplier contracts/POs/bank details, pricing policy and guarantees, capital/financing, negotiation, fraud/unusual refunds, creator relationships, publishing authority, hedging. [LIFECYCLE §03-§05, §10, §15; DELIGHT §30; BIAB-DECK s27]
- **Never.** Fabricated proof, testimonials or scarcity; incentives tied to positive reviews; FX/commodity trades by agents; contact without permission. [LIFECYCLE §05, §13, §15, §20; BIAB-DOCX area 15; BACKEND §10]
- **Moat.** The traceable outcome ledger: problem -> evidence -> intervention -> approval -> execution -> result. [BIAB-PDF §4; CPB VISION/02; WGLL §3; SPLIT §B.12]

## 1.2 Entry paths and the launch -> grow -> scale ladder

**Entry paths** [BIAB-PDF cover, §2 p5, §8 p14; BIAB-DOCX §3-4; BIAB-DECK s4-s7; CPB VISION/04]:
1. **Sell without storing** (dropship). The supplier ships each order; stock, delivery promise, packaging and returns need verification.
2. **Buy and hold inventory.** Cash is committed before sales; purchasing and replenishment become critical.
3. **Create your own product.** ODM / supplier customisation / private label / full custom; adds gates for specs, samples, tooling, IP and QC.
4. **Connect an existing store.** Starts with data quality, current economics and constraint diagnosis.

Paths 1-3 converge once the product, offer, supply plan, store and measurement baseline are approved. A mature brand launching a new SKU re-enters the low-data route for that SKU. Agencies are a further workspace type: a portfolio view with no blending of client evidence.

**Stage ladder (merged).** For each master stage: the size markers [WGLL S0-S5], what good looks like and the docs' guidance, then the gate and phase labels from the other docs.

- **0. Explore / prelaunch** (S0: 0 orders)
  - **What good looks like:** pick a winnable category and a sourceable product; store live in <30 days; no brand book or 12-month plan yet; validate demand and supply.
  - **Gates / phases:** LIFECYCLE G1 Demand, G2 Supply; DELIGHT CRO.STAGE.01; BIAB stages 0-3 (intake, discover, source & make, offer & economics; gates G01-G04).
- **1. Launch / first traction** (S1: 1-30 orders/mo, <1.5k sessions, <$50/day ads)
  - **What good looks like:** prove a stranger will pay. 30 cold orders with positive contribution on at least 1 angle. 1 product, 2-3 avatars, 1 landing page, 4-8 creatives/mo, 3 email flows. No split tests, SEO or expansion.
  - **Gates / phases:** LIFECYCLE G3 Launch (checkout, tracking, stock, delivery promise verified); DELIGHT STAGE.02 early/low traffic; BIAB stages 4-6 (brand & build, measure, launch & acquire; G05-G08); FINMAP Day 1-Week 1.
- **2. Grow / proof → repeatable demand** (S2: 30-300 orders/mo, 1.5k-12k sessions, $50-500/day)
  - **What good looks like:** find the repeatable angle, an avatar + offer pair that holds margin while spend doubles. Creative volume engine, offer testing, first real landing-page work, sequential tests only.
  - **Gates / phases:** LIFECYCLE G4 Scale (contribution and cash survive the downside case); DELIGHT STAGE.03; BIAB stages 7-8 (operate & fulfil, improve); FINMAP Weeks 2-3 and Month 2; FSOS waves 1-2.
- **3. Scale** (S3: 300-3,000 orders/mo, 12k-100k sessions, $500-5k/day)
  - **What good looks like:** systems, not luck. 3-5 avatars each with their own page and creative line; 40-80 new creatives/mo; real A/B tests (CPB: only where sample size allows); email >25% of revenue; first serious COGS/BOM work.
  - **Gates / phases:** LIFECYCLE G5 Retain; DELIGHT STAGE.04; BIAB stage 9 (finance & admin); FINMAP Month 3; FSOS wave 3.
- **4. Growth company** (S4: 3k-20k orders/mo, $5k-50k/day)
  - **What good looks like:** defend margin while adding products and channels. SEO/AEO pays back, supplier renegotiation, retention carries growth, multivariate tests, incrementality/geo holdouts.
  - **Gates / phases:** BIAB stage 10 (scale & expand); FINMAP Month 4+; FSOS wave 4 (working capital, pricing, financing).
- **5. Large** (S5: 20k+ orders/mo, $50k+/day)
  - **What good looks like:** marginal 1% gains, portfolio decisions, measurement quality, experiment throughput, governance across teams, markets and agencies.
  - **Gates / phases:** DELIGHT v1.0 "Large/$50M+" and §36 (multi-market, agencies).

Capability gates (stage layer only; the baseline is never gated) [WGLL §2.3; corrected by CPB M15/2]:
- Classic page A/B test: about 400+ conversions/mo. CPB replaces this with an explicit sample-size calculation, e.g. 3.0% vs 3.6% needs 27,828 observations.
- Creative volume engine: S2.
- SEO/AEO build-out: S2, with 6 months of runway.
- Product expansion: S3.
- COGS/BOM renegotiation: S3.
- Multi-armed testing and incrementality: S4.

## 1.3 Departments / functions: the master list (with catalogue area codes)

Ordered along the business journey. Each line: **function** {area}, then sub-parts, then sources. The DEH/CPB module number is first where one exists.

### A. Direction, research and strategy
- **M01 Business intake & stage diagnosis** {ST}
  - Sub-parts: founder goals and constraints, countries/currency, category, traffic/orders/margins, cost availability, inventory, team, budget, systems; route choice; unknown ≠ zero; routing table that explains eligibility.
  - Sources: [DEH M01; CPB M01; BIAB-PDF M01; BIAB-DOCX §3 step 0; WGLL "audit run"; DECKv2 s10 Connect/Audit].
- **M02 Market research & demand validation** {RS}
  - Sub-parts: market definition, problem interviews, bottom-up sizing, search intent, seasonality, willingness to pay, substitutes and "do nothing".
  - Outputs: market landscape, decision memo (reject / investigate / sample / launch).
  - Sources: [DEH M02; LIFECYCLE §01; BIAB-PDF M02; DELIGHT §10; IDEAMAPS 3.1; DECKv2 P01].
- **M03 Product-category research** {RS}
  - Sub-parts: category trees, price tiers, buying criteria, operating burdens (fragile, fit returns, shelf life, warranty).
  - Outputs: weighted scorecard with hard exclusions.
  - Sources: [DEH M03; BIAB-PDF M03; DELIGHT §11; WGLL Module 2].
- **M04 Product research, spec & validation** {OF}
  - Sub-parts: review mining, competitor teardowns, spec templates, concept tests, prototypes, sample acceptance, landed-cost/MOQ/cash feasibility. Validation is per dimension.
  - Sources: [DEH M04; LIFECYCLE §02; BIAB-PDF M04; DELIGHT §12; IDEAMAPS 2.1 sample-to-launch].
- **M05 Expansion for an existing brand** {ST}
  - Sub-parts: portfolio audit, assortment gaps, basket/cohort, adjacency, new markets, cannibalisation. Always compared against doing more with the current range.
  - Sources: [DEH M05; DELIGHT §13; BIAB-DOCX area 17; FINPLAY 1.2; LIFECYCLE §21 new-product launch].
- **M06 Customer intelligence: avatars, VOC, JTBD** {RS}
  - Sub-parts: purchase interviews, review/ticket/search mining, VOC coding, trigger / job / pain / outcome / alternative / objection / proof requirement, buyer vs user. Avatars must trace to evidence.
  - Sources: [DEH M06; LIFECYCLE §06; BIAB-PDF M08; DELIGHT §15; FINPLAY 1.1 M001-M010; IDEAMAPS 3.1; DECKv2 P01].
- **M07 Untapped situations, uses & creative angles** {CS}
  - Sub-parts: workarounds, off-label uses, non-consumption, counter-positioning, angle matrix, suitability/claim gate.
  - Sources: [DEH M07; CPB M07; LIFECYCLE §06 matrix; DELIGHT §16; IDEAMAPS 3.1 angle map].

### B. Product, supply and cost (business side, "before the customer")
- **Manufacturing / make-vs-buy** {OP}: ODM vs customisation vs private label vs full custom; specs, tooling, IP. [LIFECYCLE §03; BIAB-DOCX area 2; BIAB-PDF §8]
- **Supplier discovery & qualification** {OP}: marketplaces, agents, local makers; manufacturer vs trader vs intermediary; shortlist; standard RFQ; quote comparison; document register. [BIAB-PDF M05; BIAB-DOCX area 3; LIFECYCLE §04]
- **Samples & product quality** {OP}: sample plan, defect classes, approved reference sample, pilot vs production batch inspection. [BIAB-DOCX area 4; LIFECYCLE §03]
- **Negotiation & purchasing** {OP/FN}: normalised quotes, quantity bands, deposits/staged shipment, written mandate with walk-away terms, PO, payment milestones, tooling/IP terms. Human-only. [BIAB-PDF M06; BIAB-DOCX area 5]
- **M24 BOM, suppliers & cost improvement** {OP}: BOM, RFQ, should-cost, supplier scorecards (OTIF, lead-time variance), MOQ/Incoterms/terms; quoted vs contracted vs realised savings. [DEH M24; CPB M24; FINPLAY 1.21 O017-O024; USOPP §21]
- **Input-cost / FX / commodity exposure** {FN}: material price bands, hedging decisions (human only). [LIFECYCLE §05; IDEAMAPS 2.2; FSOS §4.7]
- **Inbound logistics & inventory receiving** {OP}: pickup, freight, customs/duty, receiving, inspection, SKU/barcode mapping, landed-cost allocation; sellable vs damaged/quarantined/reserved/returned stock. [BIAB-DOCX area 6; LIFECYCLE §04; IDEAMAPS 2.3]
- **Ops leanness / app and SaaS audit** {SY}: app decision sheet, SaaS waste. [LIFECYCLE §08; IDEAMAPS 2.5; FSOS wave 1; USOPP §25]

### C. Offer, brand and store foundation
- **M08 Offers, bundles & commercial economics** {OF}
  - Sub-parts: value proposition, bundles, good-better-best ladder, guarantees, shipping thresholds, subscriptions, gifting, price bands.
  - Separates conversion lift from contribution. Offer congruence across ad, page, checkout, email and package (the offer is one versioned record).
  - Sources: [DEH M08; LIFECYCLE §07; BIAB-PDF M09; DELIGHT §17; FINPLAY 1.2, 1.14, 1.18; IDEAMAPS 2.2].
  - Worked example: `gehna-offer-playbook.html`.
- **M09 Brand strategy, voice & visual identity** {BF}: positioning, brand audit, voice do/don't, visual system, asset/claim registry, change approval. [DEH M09; BIAB-PDF M10; DELIGHT §18; BIAB-DOCX area 7] Worked example: Gehna `brand-guidelines.md`.
- **M10 Domain, email & first-store setup** {SY/WS}
  - Sub-parts: domain, storefront, business email (SPF/DKIM/DMARC), payments, shipping, policies, admin recovery, test checkout.
  - Also the account register: Business Manager, ad accounts, Merchant Center, analytics, lifecycle platform.
  - Sources: [DEH M10; BIAB-PDF M11; BIAB-DOCX area 8; LIFECYCLE §08].

### D. Storefront, conversion and measurement
- **M11 Landing pages, PDP & copy** {WS}
  - Page types: PDP, campaign page, advertorial, listicle, comparison, quiz.
  - Sub-parts: section-purpose library, copy rubric, page brief; message match to the ad; reference/inspiration library [BIAB-PDF M13].
  - Sources: [DEH M11; LIFECYCLE §09; BIAB-PDF M12-M13; DELIGHT §19; IDEAMAPS 3.6; FINPLAY 1.11; USOPP §8].
- **M11/COMMERCE Commerce assistance** {WS}: on-site search, navigation, variant chooser, fit guides, assisted selling/chat. [CPB M11/COMMERCE; FINPLAY 1.16; DELIGHT §19]
- **M12 Product imagery & catalogue assets** {CPS}
  - Image roles: hero, dimensions, use, construction, contents, comparison, proof, care.
  - Fidelity rubric: an inaccurate image fails. LIFECYCLE image formats I01-I40.
  - Sources: [DEH M12; DELIGHT §20; LIFECYCLE Image library p40-47; IDEAMAPS 3.6 catalogue refresh; FINMAP Day 1 "top 50 SKUs"].
- **M13 Site speed & technical performance** {WS}: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75; field vs lab; template inventory; app residue; regression checks. [DEH M13; DELIGHT §21; IDEAMAPS 3.5; USOPP §7]
- **M14 Tracking, attribution & event quality** {FN/AN}
  - Sub-parts: event dictionary, purchase value/currency, deduplication, order reconciliation, UTMs, consent, pixel/CAPI health, server-side events, refunds, attribution windows vs incrementality.
  - Profit-aware signals back to ad platforms.
  - Sources: [DEH M14; CPB M14; BIAB-PDF M15; FINPLAY F4, 1.23; FSOS wave 1; IDEAMAPS 1.4; DECKv2 s24].
- **M15 CRO diagnostics & experiment design** {WS}
  - Repair vs investigate vs test; sample size/MDE/SRM/stopping rules; low-traffic alternatives.
  - 5 analysis outcomes: win, loss, inconclusive, invalid, operational stop.
  - Sources: [DEH M15; LIFECYCLE L1-L3; BIAB-PDF §17; DELIGHT §22; IDEAMAPS 3.7 and App A].
- **Cart, checkout, payments & fraud** {WS}
  - Sub-parts: guest checkout, wallets/UPI/BNPL, full charges shown, ETA, COD confirmation and RTO risk tiers (India), partial COD, chargebacks.
  - Sources: [LIFECYCLE §10; IDEAMAPS 3.8; DECKv2 P07; FINPLAY 1.13, 1.20; USOPP §10].
- **M16 Shopify implementation, testing & release** {WS}: theme/section/app-extension work, unpublished previews, test orders, rollback (Checkout UI extensions need Plus). [DEH M16; CPB M16]
- **Analytics foundation & business dashboard** {AN/FN}
  - The owner's "Monday" view: GP per purchase plus movers, running experiments, waiting-on-you, findings, blocked.
  - Daily, weekly, monthly and quarterly rhythm.
  - Sources: [BIAB-PDF M15-M16 §16; WGLL §1.1; FSOS App B (14 dashboards); FINPLAY rhythm].

### E. Creative, acquisition and discovery
- **M17 Ad references, creative strategy & matched copy** {CS / CW}
  - Sub-parts: reference capture (hook, tension, proof, format, pacing, offer, CTA, destination); psychological-mechanism taxonomy; winner/loser library; element tagging; concept briefs; low-cost concept screening; fatigue diagnosis; creative diversity; claims and rights checks; hook/proof/price/offer-wording tests.
  - Rule: "a long-running visible ad is not proof of profitability".
  - Sources: [DEH M17; CPB M17 (6 creative sub-workflows); LIFECYCLE §11; BIAB-PDF M17; DELIGHT §24; FINPLAY 1.3-1.4 M021-M040; IDEAMAPS 3.2; DECKv2 P02; EOSBP §9 META01].
  - **This is where AI CMO / Creative Engine skills plug in.**
- **M18 Scripts, sequential video & editing** {CPV}: script -> scenes -> candidates -> reviewer picks -> next scene uses the chosen reference -> edit; continuity checklist; real-footage alternative; LIFECYCLE video formats V01-V16. [DEH M18; CPB M18; DELIGHT §25; LIFECYCLE Video library p48-51]
- **M19 Meta campaign operations** {PA}
  - Sub-parts: account audit, naming/structure, objectives, budgets, creative test design, prospecting vs retargeting, suppression, profit-aware allocation, value-based bids, negative signals, stock-aware ads, pause/kill rules.
  - Rule: don't fight platform-native bidding with constant edits.
  - Sources: [DEH M19; LIFECYCLE §11, §13; BIAB-PDF M18; FINPLAY 1.5, 1.23-1.24; FINMAP Month 2; IDEAMAPS 3.3; DECKv2 P03].
- **M20 Google Ads, search intent & product feeds** {PA}: intent taxonomy, query-to-page map, search-term waste, feed attribute completeness, Shopping titles, price/availability parity, margin-based product groups, branded vs incremental. [DEH M20; LIFECYCLE §12; FINPLAY 1.6; BIAB-DOCX area 11]
- **Other paid surfaces** {PA}: TikTok, Snapchat, YouTube, each with its own channel adapter (hook timing, safe zones, pacing). [BACKEND §7.2]
- **Marketplaces & catalogues/feeds** {PA/OG}: listing repair, marketplace ad economics, channel offer consistency. [BIAB-DOCX area 11; FINPLAY M057-M060; DECKv2 s32]
- **M22 SEO, AEO, GEO & organic content** {OG}
  - Sub-parts: crawl/indexation, collection architecture, faceted navigation, structured data, internal links, buying guides, comparison and care content, page decay.
  - AEO = presence in answer surfaces; GEO = citation rate on a weekly 40-60 question panel. These are three separate jobs with separate metrics.
  - Sources: [DEH M22; CPB M22/SEO, M22/AEO; LIFECYCLE §14; BACKEND §7.5; FINPLAY 1.7-1.8; USOPP §22].
- **Organic social & community** {OG}: format-native posts, reels, carousels; education pipeline. [CPB M17/ORGANIC; FINPLAY 1.9; USOPP §15]
- **Creators, influencers, affiliates, partnerships** {CR}: creator fit evidence, briefs, usage rights/whitelisting, disclosure, affiliate kits, co-marketing. [LIFECYCLE §15; BACKEND §7.2; FINPLAY 1.10; USOPP §23] **Thin elsewhere:** BIAB has no CR module.

### F. Post-purchase, retention and customer care
- **M21 Email/SMS/WhatsApp lifecycle & seasonal campaigns** {RT}
  - Flows: welcome, browse/cart/checkout recovery, order/delivery, activation/first use, replenishment, cross-sell, VIP, service recovery, win-back, sunset.
  - Also: collision rules, frequency caps, permission state checked at send time, seasonal calendar (BFCM/Diwali), holdouts.
  - LIFECYCLE §17 lists 13 state-based triggers; BIAB-DOCX defines 9 message families.
  - Sources: [DEH M21; LIFECYCLE §16-§17; BIAB-PDF M19; BIAB-DOCX area 12; DELIGHT §27; FINPLAY 1.15-1.17; IDEAMAPS 3.10; DECKv2 P08].
- **Fulfilment & delivery (outbound)** {OP}
  - Sub-parts: self-fulfil vs 3PL vs supplier vs warehouse; rate comparison; SLA; carrier/courier routing; NDR (failed-delivery) handling; tracking communications; WISMO reduction; packaging spec.
  - KPI: cost per delivered and kept order.
  - Sources: [LIFECYCLE §18; BIAB-DOCX area 14; IDEAMAPS 2.6, 3.9; FINPLAY 1.22; DECKv2 P09].
- **M23 Customer delight: delivery, unboxing & first use** {CX/RT}: 20 unboxing "wow" candidates (cost-tracked), quick-start/QR guides, SKU-specific activation steps, common mistakes, care. [DEH M23; CPB M23/DELIGHT; LIFECYCLE §19; DELIGHT §29]
- **Support, returns, disputes** {CX}
  - Sub-parts: first-line triage with order context, complex exceptions, returns/exchanges/warranty, return-reason taxonomy, root cause back to product/batch/supplier/creative/page, service recovery, chargebacks.
  - Sources: [CPB M23/SUPPORT; LIFECYCLE §20; BIAB-DOCX area 15; FINPLAY 1.19-1.20; IDEAMAPS 3.11; USOPP §17-18].
- **Retention, VIP, loyalty, referral, subscription** {RT}: VIP by retained contribution; referral and loyalty only if the numbers pay; second-order acceleration; reactivation ads. [LIFECYCLE §21; FINPLAY 1.15; IDEAMAPS 3.10; DECKv2 s20]
- **Reviews & feedback** {CX/RT}: neutral review request after real use; no sentiment-conditioned incentives. [LIFECYCLE §17, §20] **Conflict:** IDEAMAPS/DECKv2 reward photo reviews.

### G. Operations, finance and the business itself
- **M25 Profit, inventory & operating priorities** {FN/OP}: metric dictionary, contribution by order/SKU/campaign/channel, reorder points, lead times, stock cover, demand forecast, ABC/XYZ, stock-outs on the top 20 SKUs, cash in stock. Missing costs block profit claims. [DEH M25; LIFECYCLE §22; IDEAMAPS 2.4; FINPLAY 2.2-2.3]
- **Finance planning & admin** {FN}: monthly financial bridge, rolling 13-week cash forecast, commitment register, scenarios, payables, payout/settlement reconciliation; company setup, registrations, insurance, contracts, sales tax (US). [BIAB-DOCX area 16; FSOS §4-§5; FINPLAY Stage 2-3] See §1.6.
- **People, roles, incentives, adoption** {ST}: role scorecards (designer, media buyer, CRM), incentive changes run as experiments, playbook training, team workbenches. [USOPP Part IV; IDEAMAPS Part 4; LIFECYCLE Rollout p38; DECKv2 s26-s29]
- **AI operator platform** {SY}: orchestration, records, controls, approvals, evals, cost per run. [BACKEND; DEH Part II; DELIGHT §7-§8, §32-§37; BIAB-PDF §12-§18] See §1.7.

## 1.4 Numbering crosswalk (the same department across docs)

| DEH/CPB | SPLIT | WGLL module | BIAB-PDF | BIAB-DOCX area | LIFECYCLE playbook | Area |
|---|---|---|---|---|---|---|
| M01 Intake | - | audit run | M01 | §3 step 0 | Foundation | ST |
| M02 Market | MKT | 1 | M02 | 1 | 01 | RS |
| M03 Category | CAT | 2 | M03 | 1/2 | (01/02) | RS |
| M04 Product | PRD | 3 | M04 | 1/2 | 02 | OF |
| M05 Expansion | EXP | 4 | - | 17 | (21) | ST |
| M06 Avatars/VOC | AVT | 5 | M08 | 1 | 06 | RS |
| M07 Untapped angles | AVT | 5 | - | - | 06 | CS |
| M08 Offers | OFF | 6 | M09 | 2/16 | 07 | OF |
| M09 Brand | BRD | 7 | M10 | 7 | - | BF |
| M10 Setup | SET | 8 | M11 | 8 | 08 | SY/WS |
| M11 Pages & copy | LPG | 9 | M12, M13 | 7 | 09 | WS |
| M12 Imagery | LPG | 9 | - | 7 | image library | CPS |
| M13 Speed | SPD | 10 | M14 | 9 | 09 | WS |
| M14 Measurement | MEA | baseline | M15 | 8 | econ p9-10 | FN/AN |
| M15 CRO | CRO | 11 | M21 | 9 | L1-L3 | WS |
| M16 Store release | - | 11 | - | - | - | WS |
| M17 Creative | MCR | 12 | M17 | 10 | 11 | CS |
| M18 Video | - | - | M17 | 10 | video library | CPV |
| M19 Meta ops | ADC | 13 | M18 | 10 | 11, 13 | PA |
| M20 Google | GAD | 14 | M18 | 11 | 12 | PA |
| M21 Email/lifecycle | EML | 15 | M19 | 12 | 16, 17 | RT |
| M22 SEO/AEO | SEO | 16 | M20 | 13 | 14 | OG |
| M23 Delight/support | CXP | 17 | (A10) | 15 | 18-21 | CX |
| M24 Sourcing/cost | COG | 18 | M05-M07 | 3-6, 14 | 03-05 | OP |
| M25 Profit/inventory | - | - | M16 | 16 | 22 | FN |
| (no M) Creators | - | - | - | (13, 17) | 15 | CR |
| (no M) Fulfilment | - | - | M07 | 14 | 18 | OP |

## 1.5 Customer lifecycle (end-customer side, 15 steps)

[merged from LIFECYCLE p3, §01-§22; BIAB-PDF §28H (15-stage journey); USOPP Part III (13 stages); FINPLAY-US F1; CPB VISION/04; BACKEND §2 awareness levels]

| # | Step | Customer question [CPB] | Business work / catalogue parts | Proof metrics |
|---|---|---|---|---|
| 1 | Need / trigger (unaware → problem aware) | Does anyone understand this problem? | research, VOC, trigger map | evidence-backed assumptions |
| 2 | Discovery / awareness (ad, organic, creator, search, AI answer) | Why should I choose this option? | creative, media, SEO/AEO/GEO, creators | CTR, hook rate, CM2/1,000 impressions, nGPP |
| 3 | Click & landing | (does it load and make sense) | speed, message match | arrival rate, LCP/INP/CLS |
| 4 | Evaluation (PDP, catalogue, reviews, fit) | Is this product suitable for me? Can I decide confidently? | PDP, imagery, comparison, assistance | PDP CVR, ATC |
| 5 | Cart & offer decision | - | bundles, thresholds, cross-sell | cart → checkout, AOV |
| 6 | Checkout & payment | Can I buy without friction? | checkout, payments, COD/BNPL, fraud | checkout completion, payment success, RTO, chargebacks |
| 7 | Confirmation & post-purchase upsell | - | thank-you page, order comms | upsell take rate |
| 8 | Waiting / fulfilment | Will I receive what was promised? | release, pick/pack, carrier, tracking, NDR | dispatch on time, WISMO rate |
| 9 | Delivery & unboxing | - | packaging, inserts, wow moments | on-time delivery, damage |
| 10 | Activation / first use | Can I get the intended benefit? | onboarding flows, quick-start, care | activation rate |
| 11 | Support / problem | - | triage, returns, exchanges, disputes | FCR, effort, avoidable returns |
| 12 | Review / feedback | - | neutral review ask, VOC loop back to step 1 | review rate, sentiment by SKU/batch |
| 13 | Retention (replenish, cross-sell, subscription) | Should I buy again? | lifecycle flows, next product | 2nd-purchase rate, 90/180-day GP, LTV, payback |
| 14 | VIP / loyalty / referral / advocacy | Should I recommend? | VIP tiers, referral, UGC | referral GP, retained contribution |
| 15 | Lapse / win-back / sunset | - | at-risk triggers, win-back, suppression | reactivation rate, deliverability |

Money pipeline that runs in parallel [FINPLAY-US F1]: marketing cash paid → order booked → revenue recognised → deductions → COGS matched → fulfilment/selling costs → contribution earned → payout receivable → bank cash → replenishment funded. India variant [FINMAP §1.1]: impression → … → COD confirmed → delivered (not RTO) → kept (not returned) → repeat.

## 1.6 Financial map (P&L, balance sheet, cash flow)

[FINPLAY-US F5 is the corrected base; FINMAP p4; FSOS §0, §3-§5; USOPP. Full detail: Appendix E.]

**Income statement waterfall.** About two-thirds of all levers sit here; FINPLAY has 240 of its 300 opportunities in this stage.
1. **Gross revenue** = qualified traffic × conversion × order value × purchase frequency [FINMAP p4]. Levers: research, positioning/launches, creative, copy/video, paid media, search/Shopping/marketplaces, SEO, content/AEO, social, creators/affiliates, CRO/speed, catalogue/merchandising, cart/checkout, AOV, pre-purchase CRM, post-purchase experience, retention/loyalty/subscription, support-assisted conversion [FINPLAY groups 1.1-1.17, M001-M170].
2. **minus discounts/promotions**: discount leakage, offer architecture, promo incrementality [1.18].
3. **minus returns, RTO, refunds, cancellations**: these hit margin twice; addressed with a return taxonomy and source quality [1.19].
4. **minus chargebacks/payment loss** [1.20].
5. **= Net revenue**, reconciled to the ledger.
6. **minus landed COGS**: product, inbound freight, duty, packaging, defects [1.21]. **= Gross profit.**
7. **minus variable selling costs**: outbound shipping, pick-pack, payment/marketplace fees, variable service, COD fees [1.22]. **= CM1.**
8. **minus assigned marketing**: media, creative, CRM, agency [1.23-1.24]. **= CM2** ("did this order make money"). The older GPP ≈ CM2 per order.
9. **minus fixed opex**: people, software/SaaS, facilities, G&A [1.25]. **= EBITDA**; then minus D&A = EBIT; then minus finance and tax = net profit.
- Every order, SKU, campaign and channel carries its own mini P&L [FINMAP p4].
- Order of work: grow demand → stop leakage → keep revenue → lower landed cost → lower variable cost → productive marketing → remove fixed waste [FSOS §3].

**Balance sheet ("where cash hides")** [FINPLAY Stage 2, B001-B036; FSOS §4]:
- cash and restricted cash;
- receivables and float: payout/settlement timing, COD remittance, BNPL, marketplace payouts, wholesale DSO;
- **inventory**, the biggest trapped-cash line: ABC/XYZ, dead stock, buy planning, multi-location;
- prepaids/deposits;
- payables (supplier terms as free financing);
- customer obligations: gift cards, deferred revenue, reserves, sales tax;
- debt/equity/working-capital financing;
- intangibles the OS accumulates.

**Cash flow ("profit is opinion, cash is fact")** [FINPLAY Stage 3, C001-C024; FSOS §5]:
- operating cash and liquidity control (13-week forecast, headroom);
- marketing cash discipline (cash-aware media throttle, scale-affordability gate);
- inventory cash flow;
- investing;
- financing and capital allocation;
- scenario engine.
- **Cash conversion cycle:** CCC = DIO + DSO − DPO. Use the correct daily bases (COGS for DIO, sales for DSO, credit purchases for DPO). Worked example: −5 DIO, −2 DSO, +3 DPO frees about $24k of working capital, which is not profit [FINPLAY-US].

**KPI tree, 10 layers** [FINMAP §5.1; USOPP Part VI]:
1. north star (GP$, CM$, GP/order);
2. growth quality (nGPP, 90/180-day GP, payback);
3. acquisition (CAC, marginal CAC, GP/spend);
4. commerce (session/PDP CVR, ATC, checkout, AOV);
5. retention;
6. quality/loss (returns, RTO, refunds, chargebacks);
7. operations;
8. balance sheet and cash (CCC, 13-week cash);
9. learning speed (tests/month, win rate);
10. adoption.

**Guardrails:**
- ROAS is a diagnostic only.
- A conversion win cannot ship if returns, margin, cash or complaints deteriorate.
- One initiative has one benefits record, so there is no double counting.

**Diagnostic tools** [FINMAP §1.1, 7 tools]:
- funnel leak map;
- profit waterfall;
- unit-economics teardown ("good ROAS, negative GP");
- cohort/retention leak;
- cash-trap map;
- plus FSOS's 14 dashboards and FINPLAY's 8 decision tools.

**Commercial model ideas for Ecommerce OS itself:**
- Profit-share: paid only from the GP lift [FINMAP §4.3].
- 30-day "Profit and Conversion Sprint" concierge (INR 30,000 / USD 3,000) [BIAB-PDF §22].
- Onboarding fee + subscription + later stage fees [BIAB-DOCX].

## 1.7 The system that runs it (platform parts)

[BACKEND Rev C is the latest. DEH Part II and BIAB-PDF §12-§18 are earlier. Full detail: Appendix B.]
- **Three faces:**
  - a visible reference library of "exhibits" (real ads, pages, emails, posts, each analysed);
  - a hidden expert knowledge base (cards and plays, base vs conditional);
  - the brand workspace (connected data, history, experiments).
  - The demo action is **"apply this to my brand"** [BACKEND §0, §9].
- **Five planes:** knowledge, exhibit, brand (per tenant), graph, execution. Plus a controlled vocabulary (awareness levels, channels, objections, ...) and an 11-stage intake pipeline (source → segment → route → card) [BACKEND §1-§6].
- **Message layer:** one message object per brand, rendered through ~15 channel adapters: Meta, TikTok, Snap, YouTube, Google Search, Shopping/PMax, SEO, AEO, GEO, content, email/SMS, organic social, influencer, partnership, affiliate [BACKEND §7].
- **Agents:**
  - BACKEND roster, about 35: e.g. voice-corpus builder, avatar, offer, page, channel workers, validators;
  - BIAB-PDF AI roles A01-A10 and creative roles C01-C09;
  - DELIGHT business orchestrator → 12 domain orchestrators → specialist workers → validators;
  - WGLL 124 sub-agents across 18 modules;
  - DECKv2 11 pillar agents.
- **Brand profile fields:** stage, category, aov_band, margin_profile, signal_quality, stack[], constraints, archetype [BACKEND §5.3]. Compare with the Gehna brand brain (§3), which is the practical, file-based version of this.
- **Build plans:**
  - BACKEND: 5-month Kevin/Colin plan, wedge = customer evidence → message → page + 3 marketing surfaces, for 1 product, with 3 pilot brands;
  - DEH: milestones E01-E06;
  - ARCH-A: 18 weeks;
  - EOSBP: 6 phases;
  - BIAB-PDF: 6 phases + 12-month plan;
  - The wedge shifts across docs: Meta → SEO/AEO → PDP foundation → evidence-message-page.
- **Validation:** `tmp\pdfs\final_blueprint\simulate.py` runs 24 synthetic rule tests (24/24 pass) of the CPB decision rules [CPB VALIDATION]. It is the only executable logic in the folder.

## 1.8 Named workflow / agent library the docs propose (candidate catalogue items, counts)

Not built. These are specifications, and good seeds for catalogue rows at level `workflow`/`agent`, status `draft`.

| Source | What it proposes | Count | Appendix |
|---|---|---|---|
| DEH / CPB | Modules M01-M25, each with decision, collect list, base vs stage cards, handoff, build, acceptance test | 25 (+ COMMERCE, ORGANIC, AEO, DELIGHT, SUPPORT sub-modules) | A, B |
| CPB | Top-level workflows / creative sub-workflows / feature ideas / system parts | ~30 / 12 / 81 / 26 | A |
| WGLL | Universal baseline checks (Blocker/Major/Minor) and sub-agents | 62 / 124 | A |
| SPLIT | First audit detectors, in build order | 15 | A |
| LIFECYCLE | Playbooks 01-22; routines R1-R3; loops L1-L3; agents A1-A4; 13 lifecycle triggers; 20 unboxing moments; image formats I01-I40; video formats V01-V16; prompts G01-G03, P01-P06 | ~150 parts | C |
| DELIGHT | Sections 1-39; 12 domain orchestrators | 39 / 12 | C |
| IDEAMAPS / DECKv2 | 35 stack-ranked ideas; 11 pillar agents (P01-P11) | 35 / 11 | C |
| BIAB-PDF | Modules M01-M21; gates G01-G11; AI roles A01-A10; creative roles C01-C09; starter experiment backlog | 21 / 11 / 19 | D |
| BIAB-DOCX | Capability areas 1-17; routines R01-R24 (first 8 = "first operating loop") | 17 / 24 | D |
| BACKEND | Agents (~35); 14-step "apply to my brand" workflow; 15 channel adapters | ~35 / 14 / 15 | B |
| EOSBP | Channel procedures (Meta META01, video, image, email, Google, CRO) | ~7 | B |
| FINPLAY | 300 opportunities (M001-M200 marketing, O001-O040 operations, B001-B036 balance sheet, C001-C024 cash), each with owner + proof metric; machine-readable in `backlog.json` | 300 | E |
| USOPP | 178 opportunities in 20 domains, scored visibility × lever; 90 hybrid / 74 software / 14 done-for-you | 178 | E |
| FSOS | Levers; control tower with 20 agents; 14 dashboards | 447 / 20 / 14 | E |


---

# 2. AI CMO vs Creative Engine skills

**Bottom line:** `AI CMO\` is a redundant ~12.6 GB older copy (22-29 Sep 2026) of material Creative Engine already holds.
- CE rewrote all 30 skill folders on 5-13 Oct (CE newer/better).
- The 14 .docx guides and Winning Ad Examples are byte-identical in CE.
- Every AI CMO original is archived verbatim in CE `skills/_library/ai-cmo/`.
- **Only `flow-chart-v2.png` exists solely here.** Copy it to CE before archiving this folder.
- Flags to fix in CE:
  - `brand-brain/SKILL.md` §3.2 tells the agent to run checks "silently" and not tell the user (still present in CE, line ~115).
  - Some skills tell the agent to run remote installers (`curl … | sh`).
  - A `cookies-cmo.json` sits at the CE repo root. It was not opened; keep it out of any shared package.


Source A: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\AI CMO\`  
Compared with: `C:\Users\kevin\Documents\Codex\2026-09-22\https-drive-google-com-drive-u\outputs\creative-engine\skills\` (live skills) and `skills\_library\ai-cmo\` (CE's verbatim archive of the skool "AI CMO/All Skills" handover, 2026-10-04).  
Method: md5 of every non-media file, difflib on each SKILL.md, file/media counts per folder. Media were counted, never opened. All files were readable (0 cloud-only placeholders).  
Scripts: `C:\Users\kevin\AppData\Local\Temp\eos_inv\scripts\aicmo_*.py`. Inventoried 2026-10-17.

### Item table

| Item | AI CMO SKILL.md (bytes / date) | CE SKILL.md (bytes / date) | Files A / CE | Media A / CE | Verdict | Key differences |
|---|---|---|---|---|---|---|
| 15 Avatar Hooks.docx | (docx) 318,225 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| 5 Buyer Segments For Creative & CRO.docx | (docx) 8,489 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| 50 Email Copy Frameworks.docx | (docx) 184,272 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| Context Questions For Brand Brain.docx | (docx) 7,761 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| Find Your Brand Enemy Worksheet.docx | (docx) 7,651 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| Klaviyo Audit Checklist.docx | (docx) 7,654 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| Must-Haves and Best Practices.docx | (docx) 10,656 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| PDP Image Factory | 12,314 / 2026-09-29 | 11,036 / 2026-10-05 | 1699 / 1955 | 1573 / 1828 | CE newer/better | CE rewrote SKILL.md (judged on "the product is the one the buyer receives", rests on production-principles) and all 11 refs; tools and library images same; CE adds CARD.md and 255 more thumbs. |
| Photoshoot Factory | 15,148 / 2026-09-23 | 11,433 / 2026-10-05 | 10008 / 10009 | 9974 / 9974 | CE newer/better | CE rewrote SKILL.md + 9 refs and CHANGELOG (97% same); library and 14 MB BREAKDOWN.json identical; CE adds CARD.md. |
| Product Page Checklist (PDP).docx | (docx) 319,086 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| Shopify CRO Checklist - 30 Settings.docx | (docx) 7,695 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| Static Ad Factory | 14,655 / 2026-09-22 | 19,006 / 2026-10-05 | 3919 / 7803 | 3883 / 7766 | CE newer/better | CE extended SKILL.md (+64/-23: judged-on criteria, fact rules, "design file" handover); 5 refs edited; teardown files identical; CE adds CARD.md + 3,883 _thumbs. |
| TOF_MOF_BOF Content Framework.docx | (docx) 11,466 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| The 5-Test Ad Creative Checklist.docx | (docx) 9,936 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| The Complete Email and SMS Flow Guide.docx | (docx) 185,131 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| The Perfect Meta Ad Structure (Avatar Hook Method).docx | (docx) 7,774 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| The Post-Purchase Flow That Builds Repeat Buyers.docx | (docx) 10,889 / 2026-09-23 | (docx) same md5 / 2026-09-23 | 1 / 1 | 0 / 0 | identical | Byte-identical. |
| Winning Ad Examples | README only | README only | 1087 / 1087 | 1084 / 1084 | identical | Same 1,084 ads (491 mp4, 551 jpg, 42 png) by path and size; README identical. |
| advertorial-v1 | 16,602 / 2026-09-23 | 14,508 / 2026-10-09 | 6 / 7 | 0 / 0 | CE newer/better | CE rewrite (410 to 141 lines, long lines): harness portability, "what it is judged on", points to landing-pages module; template-example.html same. |
| ai-copy-blacklist.md | (md) 4,136 / 2026-09-23 | (md) 590 / 2026-10-08 | 1 / 1 | 0 / 0 | CE superseded (stub); AI CMO has the full list | CE file is now a pointer to skills/copy-craft/parts/tells.md plus code checks; original archived in _library. |
| ai-satisfying-hooks | 11,106 / 2026-09-23 | 10,852 / 2026-10-05 | 8 / 6 | 0 / 0 | CE newer/better; AI CMO has extra | CE v0.3.0: hook is 4-5 s wordless clip, rests on production-principles; 4 refs rewritten; 3 AI CMO refs (brand-brain-template, folder-structure, overlay-instagram-style) dropped. |
| ai-ugc-hooks | 9,618 / 2026-09-23 | 10,395 / 2026-10-13 | 7 / 7 | 0 / 0 | CE newer/better; AI CMO has extra | CE v0.3.0: 6-8 s talking hook with 1 fictional adult presenter; avatar-catalog.md replaced by presenter.md; INSTALL.md dropped. |
| asset-generator-cmo | 31,754 / 2026-09-23 | 14,031 / 2026-10-05 | 3 / 4 | 0 / 0 | CE newer/better | CE cut 31.7 KB to 14 KB: removed Gemini API/npm setup and ShipWinningAds MCP steps; keeps the 6-part reference read. |
| brand-brain | 49,450 / 2026-09-23 | 66,979 / 2026-10-09 | 3 / 3 | 0 / 0 | CE newer/better | CE grew 49 to 67 KB (+198 lines): 9-file output, "look before you describe" (Phase 4.3), harness portability. |
| brand-guide | 5,481 / 2026-09-23 | 8,475 / 2026-10-05 | 8 / 8 | 0 / 0 | CE newer/better | CE rewrite aimed at outside designers/creators; example HTML unchanged. |
| brief-v2 | 14,679 / 2026-09-23 | 13,623 / 2026-10-09 | 22 / 23 | 0 / 0 | CE newer/better | CE rewrite: 3 concepts each built on a belief, CARD.md short form; all 8 refs edited. |
| claymation-ads | 12,796 / 2026-09-23 | 11,092 / 2026-10-08 | 3 / 5 | 0 / 0 | CE newer/better | CE rewrite with "what it is judged on" (sound-off test), adds references/prompts.md. |
| comic-book-ad | 9,022 / 2026-09-23 | 12,232 / 2026-10-05 | 8 / 9 | 0 / 0 | CE newer/better; AI CMO has extra | CE rewrite; worked-example-ai-cmo.md (16 KB) replaced by a generic 6 KB worked-example.md. |
| cro-audit | 13,954 / 2026-09-23 | 15,649 / 2026-10-09 | 5 / 5 | 0 / 0 | CE newer/better | CE rewrite: buyer-on-a-phone lens, 5 phases, accept/reject stops for the CRO app; capture.js and 3 refs edited. |
| cro-brain | 5,023 / 2026-09-23 | 6,912 / 2026-10-05 | 2 / 2 | 0 / 0 | CE newer/better | CE adds purpose framing; master KB edited. |
| five-reasons-lp | 19,812 / 2026-09-23 | 26,612 / 2026-10-09 | 2 / 2 | 0 / 0 | CE newer/better | CE marks it superseded by five-reasons-lp-pro; otherwise small additions. |
| five-reasons-lp-pro | 22,591 / 2026-09-23 | 30,624 / 2026-10-09 | 7 / 7 | 0 / 0 | CE newer/better | CE adds harness portability + "supersedes five-reasons-lp"; 6 reference files identical. |
| flash-photography | 14,408 / 2026-09-23 | 14,025 / 2026-10-05 | 1 / 2 | 0 / 0 | CE newer/better | CE reworded throughout (adult casting, physical-product scope, product truth sheet). |
| flow-chart-v2.png | (png) 1,558,776 / 2026-09-23 | absent | 1 / 0 | 1 / 0 | CE missing | Not in CE at all (live or _library). |
| foreplay-ad-board | 46,547 / 2026-09-23 | 50,596 / 2026-10-09 | 1 / 1 | 0 / 0 | CE newer/better | CE adds "what this needs, and what works without it" + portability; body mostly same. |
| foreplay-creative-strategy | 29,225 / 2026-09-23 | 34,171 / 2026-10-09 | 8 / 8 | 0 / 0 | CE newer/better | CE adds requirements section (paid Foreplay + Gemini); 4 files edited, 3 identical. |
| generate-50 | 26,005 / 2026-09-23 | 8,206 / 2026-10-05 | 2 / 3 | 0 / 0 | CE newer/better | CE cut 26 KB to 8 KB "50-ad sprint" with 2 approvals; original kept as reference/original-skill.md. |
| gpt-image-ads | 11,288 / 2026-09-23 | 13,381 / 2026-10-05 | 1 / 1 | 0 / 0 | CE newer/better | CE marks RETIRED 2026-10-05; body kept for the record. |
| instant-photoshoot | 14,293 / 2026-09-23 | 10,945 / 2026-10-05 | 13 / 14 | 0 / 0 | CE newer/better | CE rewrite around one colour world/light/prop kit, frames chosen by product kind; 2 refs edited, scripts same. |
| podcast-ad | 11,961 / 2026-09-23 | 18,029 / 2026-10-13 | 10 / 11 | 0 / 0 | CE newer/better; AI CMO has extra | CE rewrite (fictional hosts, no real show copied); seedance-prompt-template.md replaced by clip-prompt.md. |
| realistic-ai-ugc | 12,661 / 2026-09-23 | 28,547 / 2026-10-13 | 6 / 7 | 0 / 0 | CE newer/better; AI CMO has extra | CE grew 12.7 to 28.5 KB: starts from an approved script (script-format-ugc), presenter rules; ugc-script-template.md replaced by clip-prompt.md. |
| recreate-winning-ads | 18,583 / 2026-09-23 | 12,424 / 2026-10-05 | 1 / 2 | 0 / 0 | CE newer/better | CE cut 18.6 to 12.4 KB; 6 DNA dimensions, static-remix recipe in the app. |
| scroll-stopper-static-ads | 42,715 / 2026-09-23 | 16,628 / 2026-10-05 | 59 / 60 | 23 / 23 | CE newer/better | CE cut 42.7 to 16.6 KB; craft kept (5 levers, 14 metaphor types, 8 headline formulas), planner gets CARD.md; tof-statics succeeds it. |
| shopify-liquid-themes | 11,681 / 2026-09-23 | 17,241 / 2026-10-05 | 24 / 24 | 0 / 0 | CE newer/better | CE adds ~40 lines of operator/filter reference; 10 reference files identical. |
| strategic-audit | 9,421 / 2026-09-23 | 12,334 / 2026-10-05 | 14 / 14 | 0 / 0 | CE newer/better | CE rewrite "what the brand has not tried"; all 5 refs edited. |
| talking-object-ad | 6,387 / 2026-09-23 | 11,495 / 2026-10-08 | 6 / 8 | 0 / 0 | CE newer/better | CE rewrite: object is not the product, 10-30 s monologue, adds references/prompts.md; evals.json edited. |
| ugc-script | 9,929 / 2026-09-23 | 8,310 / 2026-10-13 | 3 / 5 | 0 / 0 | CE newer/better | CE v0.3.0: word rules moved to script-format-ugc; adds creator-brief-template.md. |
| zack-d-films-ads | 15,790 / 2026-09-23 | 12,735 / 2026-10-08 | 35 / 36 | 6 / 6 | CE newer/better | CE renames the format "CGI explainer" (creator name removed), shorter SKILL.md; FORMAT.md edited; scripts, audio, font identical. |

"Files" counts include `__MACOSX` and `.DS_Store` junk. "Media" excludes `__MACOSX` resource forks but includes generated `_thumbs`.

### Totals

- AI CMO: **16,997 files, 12.56 GB** (12.56 GB decimal, ~11.7 GiB).
- Media: **16,544** image/video files (14,055 jpg/jpeg, 1,925 png, 72 webp, 492 mp4), of which **5,469 are generated `_thumbs`** (PDP 548, Photoshoot 4,921). Real reference media: ~11,075.
- Where the bulk is: Static Ad Factory 5.57 GB (3,883 swipe ads), Winning Ad Examples 3.08 GB (1,084 ads), Photoshoot Factory 2.20 GB (~5,050 photos + thumbs), PDP Image Factory 1.69 GB (~1,025 PDP references + thumbs). The 28 other skill folders together are < 30 MB.
- Text: 131 .md, 59 .txt, 58 .json, 41 .py, 7 .html, 2 .sh, 1 .js, 1 .liquid, 1 .csv, 14 .docx, plus 2 .wav and 1 .ttf (zack-d-films-ads).
- 48 catalogue rows: 32 skill/asset folders, 14 .docx guides, ai-copy-blacklist.md, flow-chart-v2.png.

### Does AI CMO hold anything CE lacks?

Of 320 non-media files in AI CMO, every one is either byte-identical in the CE live skills or kept verbatim in `skills/_library/ai-cmo/`. The 3 exceptions:

1. **`flow-chart-v2.png`**: not in CE anywhere. This is the only file that exists only here. **Copy it into CE** (e.g. `skills/_library/ai-cmo/`) if the course map is wanted. Not opened, so its content is unconfirmed.
2. **`cro-audit/reference/capture.js`** (6,509 B) and **`talking-object-ad/evals/evals.json`** (5,033 B): CE has edited, newer versions (Oct 5). The _library archive did not take the AI CMO versions because it copied only .md/.json/.txt and evals.json was missing from the skool export. Low value; keep CE's.

**Content missing from the live CE skill but archived in CE `_library`.** Nothing needs copying, but these are worth a quick review when tuning the CE skill:
- `ai-satisfying-hooks`: references/brand-brain-template.md, folder-structure.md, overlay-instagram-style.md (an Instagram-style text-overlay recipe with Pillow, the only practical one; consider re-adding).
- `ai-ugc-hooks`: INSTALL.md, references/avatar-catalog.md (Higgsfield preset avatar list; CE replaced it with presenter.md rules).
- `comic-book-ad`: references/worked-example-ai-cmo.md (16 KB full worked package vs CE's 6 KB generic example).
- `podcast-ad`: references/seedance-prompt-template.md (10.8 KB; CE clip-prompt.md is 6.8 KB, only ~15% similar).
- `realistic-ai-ugc`: references/ugc-script-template.md (moved conceptually into script-format-ugc).
- `ai-copy-blacklist.md`: full 4 KB list; CE now keeps the rules in copy-craft/parts/tells.md and code.
- Large SKILL.md cuts to spot-check: asset-generator-cmo (31.7 to 14.0 KB), scroll-stopper-static-ads (42.7 to 16.6 KB), generate-50 (26.0 to 8.2 KB; original kept in its reference/), recreate-winning-ads (18.6 to 12.4 KB), Photoshoot Factory (15.1 to 11.4 KB).

**Verdict:** CE is the newer, better library for all 30 skill folders (every SKILL.md rewritten 2026-10-05 to 10-13; this folder is from 2026-09-22/23, PDP 09-29). The 14 docx and Winning Ad Examples are byte-identical. This folder can be treated as a **redundant 12.6 GB copy**: keep `flow-chart-v2.png`, then archive or delete it.

**Gap the other way.** The skool "All Skills" export archived in CE `_library/ai-cmo` has 5 sets this desktop folder lacks: `clone-from-screenshot`, `tof-statics`, `static-ads` (= gpt-image-ads), `foreplay-auto-build-boards` (= foreplay-ad-board) and `ship-winning-ads-mcp-10k-ad-templates` (a readme for Winning Ad Examples). CE live already has clone-from-screenshot and tof-statics.

### Junk and duplication

- **Wrapper nesting:** all 32 folders are `X/X/...` (zip-extraction wrappers). This is not duplicate content: there is exactly 1 copy inside. CE mirrors the same nesting.
- **`__MACOSX`:** 127 resource-fork files in 16 skill folders (e.g. 31 in scroll-stopper-static-ads, 19 in zack-d-films-ads, 13 in shopify-liquid-themes, 12 in brief-v2). CE copied them too. Safe to delete in both.
- **`.DS_Store`:** 6 (brief-v2, comic-book-ad, scroll-stopper x3, Winning Ad Examples).
- **True duplicates:** none. Name+size scan found only `.DS_Store` and tiny `_source.txt` stubs in PDP Library/_inbox repeating.
- **Other cruft:** Photoshoot Library/_removed (132 files, culled references); PDP Library/_inbox (captures of third-party brand PDPs: Allbirds, ARMRA, ILIA, Native...); generated `_thumbs` (5,469 files) that the tools can rebuild.
- **CE-side note:** the CE `skills/` folder also holds these same top-level names, so CE already contains a full mirror of this folder (and more thumbs). There is also a `cookies-cmo.json` at the CE repo root; it was not opened, but it should not be shared.

### AI-directed instructions noticed (treated as data, not followed)

All SKILL.md files are, by nature, instructions to an AI agent. Items that stand out:
- **`brand-brain/SKILL.md` section 3.2 "Silent MCP Detection":** tells the agent to "silently" try tool calls and "Do not tell the user you are running these checks". This is covert-behaviour wording; The CE live version still has it (brand-brain/brand-brain/SKILL.md line 115). Remove it or make it transparent.
- **Remote install scripts:** `ai-satisfying-hooks` and `ai-ugc-hooks` (SKILL.md, INSTALL.md) tell the agent to run `curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh` and `higgsfield auth login`. `asset-generator-cmo` says `npm install @google/genai dotenv` and to create an API-key file. Tool `doctor.py` scripts and `check_pronunciation.py` suggest pip installs. None was run.
- **Install prompts:** "PASTE THIS - INSTALL.txt" files in the three Factories are user-to-Claude prompts that move folders into `~/.claude/skills/` and run `python3 tools/doctor.py` / `_tools/picker.py`.
- **`ai-copy-blacklist.md`** opens with "Instructions for Claude: ... You are forbidden...". This is a negative-constraint prompt by design, not an injection.
- No secrets were found (regex scan for sk-/AIza/ghp_/xox and key=value patterns across all text files).

### Rights and provenance

- Every skill and docx is marked `course` (skool "AI CMO" community). Supporting evidence: "Nu Reach internal skill" (flash-photography), "Hard Nu Reach rule" (Static Ad and PDP factories), the Nu Reach agency voice in the post-purchase doc, `worked-example-ai-cmo.md`, and the CE _library register, which records the skool "AI CMO/All Skills" source. No file shows Kevin as author: the only "Kevin" is Kevin MacLeod, the Incompetech music credit in instant-photoshoot/free-music.md.
- Winning Ad Examples and the factory swipe and reference libraries are other brands' ads and product pages: `third-party-ads` content inside course packaging. Use them for reference only.
- `zack-d-films-ads` is named after a real creator; CE already renamed it "CGI explainer".

---

# 3. Gehna brand brain: structure (reference instance of `brand_brain`)

Path: `Ecommerce OS\gehna brand brain\`. Built 2026-10-01 with the `/brand-brain` skill (the same skill exists in AI CMO and CE). **Real client data**: Gehna is a 20-year-old Chennai fine jeweller, and the brain holds Jan-Sep 2026 sales (Rs 6.35 crore, 2,172 items) and Meta results. Treat it as confidential and only use an anonymised version as a catalogue example.

**Inputs the build used** (README "Data Sources"):
- website scrape (homepage, 16 collections, 8 PDPs, FAQ, shipping/returns, customise, store pages);
- Meta Ads account, last 90 days;
- sales dashboard JSON exports, 9 months;
- 35 Google reviews.

```
gehna brand brain/
├─ brand-brain/                     ← the brain (load into any AI session)
│  ├─ .claude/CLAUDE.md             auto-load + session rules + guardrails (operating prompt)
│  ├─ README.md                     file map, when to load what, refresh cadence, data sources
│  ├─ recent-changes.md             dated change log: launches, promos, out-of-stock (READ FIRST)
│  ├─ brain.md                      living learnings (ALWAYS LOAD)
│  ├─ brand-guidelines.md           foundation (ALWAYS LOAD)
│  ├─ products-and-positioning.md   catalogue + economics
│  ├─ customer-avatars.md           personas grounded in reviews
│  ├─ competitors.md                competitor set + gaps
│  ├─ winning-ads.md                proven Meta angles (read by /generate-50)
│  └─ assets/<202 product folders>/ 675 images (590 jpg, 85 png, 60 MB) auto-pulled from the store
├─ Products/                        exact duplicate of assets/ (675 files, 60 MB): drop
└─ gehna-offer-playbook.html        Diwali offer strategy, 22 ranked offers (example output of an offer workflow)
```

**Fields per file.** These are the de facto `brand_brain` schema:

| File | Sections / fields |
|---|---|
| `brain.md` | About This Brand · **Brand Diagnosis** (anchor sentence + market awareness level, market sophistication, creative diversity, highest-intensity persona, biggest opportunity) · Key Decisions (date / decision / why) · What We Know Works (ads by angle with ROAS and purchases; products) · Open Questions · Ideas to Explore · What to Avoid · Product Notes |
| `brand-guidelines.md` | Brand Overview · Voice & Tone (Do's, Don'ts, Tone by Context) · Visual Identity (Color Palette, Typography, Photography & Imagery Style, Imagery Do's/Don'ts) · Unique Selling Propositions · Target Audience Summary · Brand Guardrails · Key Phrases & Taglines |
| `products-and-positioning.md` | Pricing Summary (+ catalogue count by price band) · Sales Mix (by metal, by product type, by gemstone, payment/ordering behaviour) · Best Sellers · Product Catalog (~20 hero entries: price, features, positioning angle, sales) · Bundles & Offers · Seasonal/Limited · Positioning Notes |
| `customer-avatars.md` | How These Were Built · per avatar (3 + 1 to validate): Grounded In (verbatim evidence) · Who They Are · What They Care About · Why They Buy · What Almost Stops Them (objections) · How to Talk to Them |
| `competitors.md` | Competitive Landscape (5 named) · Differentiation Summary · Gaps Worth Owning · Where Competitors Are Stronger · Competitor Ads & Messaging (to populate) |
| `winning-ads.md` | Summary · per winning ad (6): angle, format, metrics, why it worked · What Has Not Worked (90 days) |
| `recent-changes.md` | How to Use · Change Log (date, change) |
| `.claude/CLAUDE.md` | What This Brand Does · file priority table · Connected Integrations (Meta: active account; sales via manual JSON export) · Session Rules (before / during / at end + routing table: learning → file → section) · Guardrails (never invent offers, never assume stock, never quote fixed prices, no investment claims, follow voice, test new angles alongside winners, no em dashes) |

**Why it matters for the catalogue:**
- It is a *tested* end-to-end output of a skill. Every downstream creative skill (generate-50, static ads, PDP, offer building) consumes these files.
- The CLAUDE.md "write-back routing table" is a reusable **brain-maintenance routine**.
- The diagnosis block (awareness, sophistication, diversity, persona intensity, biggest opportunity) is the bridge to creative strategy.
- Compared with the BACKEND brand-profile spec (stage, category, aov_band, margin_profile, signal_quality, stack, constraints, archetype), the Gehna brain is **missing**:
  - explicit stage/size;
  - margin/COGS profile;
  - tracking or signal health;
  - tech stack list;
  - offer records;
  - a claim register;
  - review/VOC corpus as data (only quoted).
- AI-directed instructions found: `.claude/CLAUDE.md` is by design an operating prompt (session rules, writing to files without asking). It was treated as data and nothing was executed.

---

# 4. Gaps, conflicts and recommendations

**Gaps in the business model (no doc covers them well):**
- **Creators/influencers/affiliates.** Only LIFECYCLE §15, the BACKEND channel adapters and FINPLAY 1.10 cover them. There is no DEH M-module and no BIAB module. Needs a module (suggest `M26 Creators & affiliates`, area CR).
- **Customer care as a department.** Spread across M23 SUPPORT / LIFECYCLE §20; there is no helpdesk integration spec (Gorgias/Zendesk) and no reviews-platform integration.
- **Seasonal / BFCM / festival planning.** Only a "seasonal calendar" inside M21 and FINPLAY M019. There is no dedicated ST playbook. Gehna's Diwali playbook is the only worked example.
- **Marketplaces (Amazon/Flipkart).** Treated as optional everywhere; no module.
- **Wholesale/B2B, subscriptions, international expansion.** Conditional mentions only.
- **Pricing of Ecommerce OS itself** is inconsistent: profit-share [FINMAP], $3k sprint [BIAB-PDF], fee + subscription [BIAB-DOCX]. BACKEND leaves it open.
- **Undefined references.** BACKEND module codes (OFF, AVT, LPG, ADC, CXP, MEA, MCR…) are never tabulated. The "15 detectors" are referenced in BACKEND but listed only in SPLIT. CPB cites an 18-page WGLL but the Docs copy has 22 pages, so it may be a different version.

**Conflicts to resolve before the catalogue copies the docs' rules:**
- North star: GPP [IDEAMAPS, DECKv2, WGLL, ARCH-A] vs no single metric / a per-workflow primary metric [CPB, BACKEND] vs retained CM2 [LIFECYCLE]. **Use CPB.**
- Accounting: "GPP" in IDEAMAPS/DECKv2/FINMAP ≈ CM2 per order. FINMAP/FSOS treat EBITDA as operating profit and inventory buying as investing cash. **Use FINPLAY-US definitions.**
- Reviews: IDEAMAPS/DECKv2 reward photo reviews and treat long-running ads as proof. LIFECYCLE/DEH forbid sentiment incentives and reject "visible = profitable". **Use LIFECYCLE.**
- Publishing rights: never publish [WGLL/SPLIT] vs standing authority later [CPB]. **Use the autonomy ladder.**
- First wedge moves Meta creative [EOSBP] → SEO/AEO [ARCH-A] → PDP foundation [DEH] → evidence → message → page + 3 surfaces [BACKEND]. Memory note: the platform-of-parts decision (2026-10-17) already fixes direction on Creative Engine. Treat these as history.
- Numbering: DEH M01-M25 ≠ BIAB-PDF M01-M21; "24" = DE steps (BIAB-PDF) ≠ routines R01-R24 (BIAB-DOCX). Prefix IDs.

**Folder hygiene (no action taken; read-only):**
- `AI CMO\` (~12 GB) duplicates Creative Engine skills. See §2 for which items, if any, carry extra content.
- Removable duplicates and intermediates:
  - `gehna brand brain\Products\` = `brand-brain\assets\` (60 MB);
  - the 3 root `.chart-data-*` folders and `tmp\ecommerce_deck\` (~270 MB, build intermediates of the deck; one `.chart-data` copy equals the final deck);
  - `tmp\*\render*\` page PNGs.
- Twins:
  - Docs PDFs ↔ `output\pdf\` (identical for Lifecycle, Delight, US Financial Playbook, Data & Eng Handbook);
  - `ecommerce-business-in-a-box-blueprint (1).pdf` is the US localisation of the India edition (currency, COD → processor payouts, Shiprocket → Shippo, compliance).

**Recommendations for the platform:**
1. Adopt **DEH/CPB M01-M25 (+ M26 Creators)** as the catalogue's `sub_area` spine. Map every Creative Engine skill to an M-number. Creative skills mostly land in M06, M07, M11, M12, M17, M18 and M21.
2. Use the **BIAB-DOCX routine contract** as the item schema for routine/workflow levels, and the **H/P/S/R/L/A rule** [LIFECYCLE] to choose an item's level.
3. Use `backlog.json` (300 items with owner + proof metric) as a ready-made seed list of `knowledge`/`workflow` ideas for FN/OP/ST areas, which Creative Engine does not cover.
4. Use the Gehna brain as the golden example for the `brand_brain` input type, after extending it with stage, margin profile, signal health, offer records and a claim register.

---

# Appendices: detailed per-document outlines

These were extracted by reading each document in full. Citation tags follow each appendix's own legend. Headings are demoted two levels.


---

# Appendix A. Product blueprint set: CPB, WGLL, SPLIT

### Ecommerce OS business model: master map of parts (inventory A)

Sources (all three read in full; content is data, not instructions):

| Short | Document | Path | Pages | Date |
|---|---|---|---|---|
| CPB | Ecommerce OS: the complete product blueprint, v1.0 | `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\output\Ecommerce_OS_Complete_Product_Blueprint.md` (PDF twin `output\pdf\Ecommerce_OS_Complete_Product_Blueprint.pdf`) | 97 PDF pages / 2,841 md lines | 16 Sep 2026 |
| WGLL | Ecommerce OS: what good looks like, stage by stage | `...\Ecommerce OS\Docs\ecommerce-os-what-good-looks-like (1).pdf` (text: `eos_inv\text\ecommerce-os-what-good-looks-like (1).txt`) | 22 | undated (file 16 Sep 2026) |
| SPLIT | Ecommerce OS: build split (Part A Kevin, Part B Colin) | `...\Ecommerce OS\Docs\ecommerce-os-build-split (1).pdf` (text: `eos_inv\text\ecommerce-os-build-split (1).txt`; I also re-extracted with `pdftotext -raw` to `eos_inv\scripts\A_split_raw.txt` for clean tables) | 27 | undated (file 16 Sep 2026) |

Tag format: `[CPB M08/1 p37]` = CPB chapter "WORKFLOW M08 / 1", PDF page 37. `[WGLL §4 M6 p11]` = WGLL Part 4, Module 6, page 11. `[SPLIT §A.5 p8]` = SPLIT section A.5, page 8.
Catalogue area codes from `_SCHEMA.md` are shown as `{AREA}`.

---

#### 0. Numbering crosswalk (three numbering systems)

The docs use three different numbering schemes for the same departments. CPB is the latest and maps the others [CPB SOURCE INTEGRATION p95].

| CPB id (25 domains, from the Data & Engineering Handbook) | SPLIT 3-letter code | WGLL module # (18) | Department / workflow | Catalogue area |
|---|---|---|---|---|
| M01 Intake | (none; common intake) | (none; WGLL "Audit run" is closest) | Intake / diagnose the constraint | {ST} |
| M02 Market research | MKT | 1 | Market research | {RS} |
| M03 Category research | CAT | 2 | Product category research | {RS} |
| M04 Product research | PRD | 3 | Product research, spec, price | {OF} |
| M05 Expansion | EXP | 4 | Expansion research for existing brands | {OF} (strategic: {ST}) |
| M06 Customer intelligence | AVT | 5 | Avatars & jobs to be done | {RS} |
| M07 Untapped situations | AVT (untapped/off-label sub-agents) | 5 (Untapped avatar, Off-label use) | Exploration of overlooked situations | {RS} |
| M08 Offers | OFF | 6 | Offers | {OF} |
| M09 Brand | BRD | 7 | Brand basics + brand book | {BF} |
| M10 Setup | SET | 8 | Store & domain setup | {WS} |
| M11 Pages & copy | LPG | 9 | Landing pages / PDP | {WS} |
| M11/COMMERCE Commerce assistance | LPG (partial) | 9 (partial) | On-site search, navigation, cart, checkout help | {WS} |
| M12 Product imagery | LPG (image planner/generator) | 9 (image template) | PDP image set | {CPS} |
| M13 Speed | SPD | 10 | Page speed | {WS} |
| M14 Measurement | MEA (cross-cutting) | (baseline "Tracking & measurement") | Tracking, metric dictionary, reconciliation | {FN} |
| M15 CRO | CRO | 11 | CRO & experiment engine | {WS} |
| M16 Store release | (part of LPG/CRO deploy) | 11 (deploy/test purchase) | Draft-stage-verify-publish of store changes | {WS} |
| M17 Creative intelligence | MCR | 12 | Meta creative (patterns, briefs, image pipeline) | {CS} |
| M17/ORGANIC Organic content | (none) | (none) | Organic content / education pipeline | {OG} |
| M18 Video & audio production | MCR | 12 (video pipeline) | Sequential scene-by-scene video | {CPV} |
| M19 Meta operations | ADC | 13 | Ad copy & (paused) deployment, Meta ops | {PA} |
| M20 Google Ads | GAD | 14 | Google Ads / Shopping / feed | {PA} |
| M21 Lifecycle | EML | 15 | Email & lifecycle | {RT} |
| M22/SEO SEO | SEO | 16 | SEO & content | {OG} |
| M22/AEO Answer discovery | SEO (AEO agent) | 16 (AEO agent) | AEO / AI-answer accuracy | {OG} |
| M23/DELIGHT Delivery & first use | CXP | 17 | Post-purchase experience & delight | {RT} |
| M23/SUPPORT Support & returns | CXP (issue recovery) | 17 (issue recovery) | Support, returns, root-cause | {CX} |
| M24 Sourcing & cost | COG | 18 | COGS & supplier | {OP} |
| M25 Economics & inventory | MEA (economics) | (baseline "Economics") | Contribution, cash, stock, forecasting | {FN} (stock: {OP}) |

Note: CPB says M01-M25 "retain the handbook's module IDs" (Ecommerce_OS_Data_and_Engineering_Handbook.pdf); the handbook ids are not listed with titles in CPB except by these chapter headings. CPB skips nothing: M17-M18 = creative walkthrough; M22 and M23 each split in two; Commerce and Organic are "connected workflows" attached to M11 and M17 [CPB NAVIGATION p2].

WGLL ordering: modules run roughly in sequence 1-18 for a new brand; an existing brand enters at Module 4 or later and Modules 1-3 become the expansion path [WGLL §4 intro p7].

---

#### 1. Purpose, north star and success definitions

##### 1.1 Product promise / thesis
- Promise to the user: understand my business; show me the most useful next action; give me something I can use; explain why it fits; help me deliver it; learn whether it helped my customers and my business [CPB VISION p1].
- System pattern (from Kevin's creative example, generalised to the whole business): start with own evidence -> inspect outside examples -> identify plausible mechanism -> create original alternatives -> review -> execute appropriate test -> remember what happened [CPB VISION p1].
- Six central ideas [CPB VISION/01 p3]:
  1. Start with the actual brand (products, customers, best/worst executions, constraints, prior decisions).
  2. Learn from patterns beyond the brand (competitor ads, organic, pages, offers, discussions; record observed vs explanation).
  3. Explore relationships, not folders (graph: job -> objection -> proof -> creative pattern -> offer -> page -> experiment -> outcome).
  4. Produce both ideas and finished work (concepts, briefs, designer packets, scripts, prompts, assets, draft pages, operational changes; human and AI routes in one workflow).
  5. Personalise to the situation (needs, buying context, fit, journey stage; demographics only as hypotheses).
  6. Learn across the whole experience (delivery, first use, returns, support, repeat, effort).
- WGLL target experience "the owner's Monday": log in, see 5 things (GP/purchase vs last week + 3 movers; experiments running; waiting on you = drafts ranked by expected profit; what the system found; blocked), spend 30-60 min approving/rejecting/reordering; never write copy, build pages, cut video [WGLL §1.1 p1].
- Safety rule: AI has upload rights, never publish rights: pages as drafts, ads paused, emails unscheduled, code in a theme copy; permanent for anything that spends money, changes a live page or reaches a customer [WGLL §1.2 p1; SPLIT §B.1 p18]. CPB softens: draft-first initially; later routine actions may use explicit standing authority with limits, verification and audit trail [CPB VISION/03 p5].

##### 1.2 North star and metrics
- WGLL: north star is gross profit per purchase; every module must trace back to it; every recommendation carries expected effect on gross profit [WGLL intro p1; §3 p4].
- CPB revises: no single metric; maximising GP per purchase can reject useful growth; build around customer outcomes + sustainable business contribution, agency efficiency third [CPB VISION/02 p4].
- CPB three-beneficiary scorecard [CPB VISION/02 p4]:
  - Brand customer: task success, expectation mismatch, delivery reliability, customer effort, product-specific returns, repeat behaviour.
  - Founder/brand team: mature contribution, cash exposure, retained customers, accepted work, time to verified result.
  - Agency owner/team: review time, rework, on-time delivery, cost per accepted outcome, client retention.
- Each workflow: one primary decision metric + diagnostics + explicit guardrails (e.g., creative test: contribution per eligible visitor or acquisition cost under margin constraint; hook rate diagnostic; returns/misleading-expectation complaints guardrail) [CPB VISION/02 p4].
- Money definitions [CPB OM/07 p13]: net revenue = recognised sales after discounts and relevant refunds (tax treatment stated); gross profit = net revenue - COGS (brand accounting policy); contribution = also minus variable costs in scope (fulfilment, payment fees, service/returns, marketing where applicable); never double-subtract; show totals and per-order/per-visitor; record currency, date basis, new-vs-existing scope, outcome maturity; forecast repeat separately from realised; profit != cash.
- Keep CPA / cost per purchase / CAC distinct (event, attribution scope, new-customer denominator, cost scope) [CPB VISION/03 p5] vs SPLIT ingestion stage 5 collapsing them to one term [SPLIT §B.4 p22].
- Constraint: never hide customer harm in averaged profit; essential help available to every customer; loyalty benefits can vary [CPB VISION/02 p4].
- Compounding asset: traceable record of decisions/executions/failures/outcomes (CPB) = "outcome ledger", the only part competitors cannot copy (WGLL/SPLIT) [CPB VISION/02 p4; WGLL §3 p4; SPLIT §B.12 p26].

---

#### 2. Business lifecycle: launch -> grow -> scale

##### 2.1 WGLL stage model S0-S5 [WGLL §2.1 p2]
Computed from Shopify orders, GA4 sessions, ad-platform spend averaged over 90 days, recomputed weekly, history stored.

| Stage | Name | Orders/mo | Sessions/mo | Ad spend/day |
|---|---|---|---|---|
| S0 | Pre-launch | 0 | 0 | 0 |
| S1 | First traction | 1-30 | <1,500 | <$50 |
| S2 | Proof | 30-300 | 1,500-12,000 | $50-500 |
| S3 | Scale | 300-3,000 | 12,000-100,000 | $500-5,000 |
| S4 | Growth company | 3,000-20,000 | 100k-600k | $5k-50k |
| S5 | Large | 20,000+ | 600k+ | $50k+ |

##### 2.2 What good looks like per stage [WGLL §2.2 p3]
- S0 pre-launch: pick a winnable category + sourceable product, store live in <30 days; no brand book/content calendar/12-month plan; risk = researching 6 months and never launching.
- S1 first traction: prove a stranger will pay; 30 orders from cold traffic with positive contribution on >=1 angle; 1 product, 2-3 avatars, 1 landing page, 4-8 creatives/mo, 3 email flows; no split testing, SEO or expansion.
- S2 proof: find the repeatable angle; 1 avatar+offer pair that holds margin while spend doubles; creative volume, offer testing, first real LP work; sequential testing only.
- S3 scale: systems not luck; 3-5 avatars each with own page + creative line; 40-80 new creatives/mo; real A/B testing; email >25% of revenue; first serious COGS look ("where the product earns its highest fee").
- S4 growth company: defend margin while adding products/channels; product + category expansion, SEO/AEO paying back, supplier renegotiation, retention economics carrying growth.
- S5 large: marginal 1% gains, portfolio decisions; measurement quality, experiment throughput, protecting owner from noise.

##### 2.3 Capability gates (stage layer only; baseline never gated) [WGLL §2.3 p3]
- Classic page A/B test: 400+ conversions/mo (~200 conversions/variant to detect 20% lift at 95%).
- Sequential before/after test: S1.
- Creative volume engine: S2 (below, offer is the bottleneck).
- Audience & angle expansion: S2.
- SEO & AEO build-out: S2 with 6 months runway (payback 6-12 months).
- Product expansion: S3.
- COGS/BOM renegotiation: S3 (leverage ~1,000-unit orders).
- Multi-variant / multi-armed testing: S4.
- Incrementality & geo-holdout tests: S4.
- Per-module stage gates are listed in Part 5 below.

##### 2.4 CPB reconciliation of stages [CPB VISION/03 p5]
- Stage labels help navigation only; actual data, capability, economics and operational readiness govern eligibility; no universal 400-conversion cutoff (worked example: 3.0% vs 3.6% needs ~13,914 obs/arm = 27,828 total; 279 days at 100/day, 14 days at 2,000/day) [CPB M15/2 p52; VALIDATION/05 p92].
- Eligibility outcomes are eligible / ineligible / unknown, each with reason and next useful action [CPB OM/02 p8].
- Two entry routes, one system [CPB VISION/04 p6]:
  - New brand: founder constraints + customer evidence -> validate product -> establish foundation -> bounded launch; no owned winners, show provisional hypotheses.
  - Existing brand: ingest approved facts/history -> repair material defects -> locate current constraint -> compare improvement vs expansion (a mature brand's new product may still need the low-data route).
  - Agency workspace adds portfolio view + role boundaries, never blends private client evidence.
- Conditional subgraphs (situational method sets): prelaunch validation, low-data learning, repeatable acquisition, complex catalogue operations, market-specific requirements, channel capabilities, controlled experimentation [CPB OM/02 p8].

##### 2.5 Customer journey <-> business work (the spine of the model) [CPB VISION/04 p6]
| Customer's question | Business work | Shared record carried forward |
|---|---|---|
| Does anyone understand this problem? | Market, category, customer research | Customer situation, alternatives, unmet need |
| Is this product suitable for me? | Product validation, positioning, discovery | Verified spec, fit limits, reason to believe |
| Why should I choose this option? | Creative, organic, search, offers | Message, evidence, offer, destination |
| Can I decide confidently? | PDP, images, comparison, assistance | Objections answered, selection, truthful terms |
| Can I buy without friction? | Speed, checkout, payment, tracking | Order, price, availability, measurement state |
| Will I receive what was promised? | Inventory, fulfilment, delivery comms | Promise, shipment, exceptions, accountable owner |
| Can I get the intended benefit? | Instructions, first-use education, support | Activation milestone, unresolved obstacles |
| Should I return, recommend or buy again? | Fair recovery, lifecycle, next products | Experience, preferences, permission, mature outcome |

Shared dependencies: campaign brief -> approved offer -> current product facts & stock -> landing page same promise -> post-purchase education teaches the use shown in the ad -> support traces complaint to ad/offer/batch where link is known [CPB VISION/04 p6].

Customer lifecycle stages for messaging: discovery, consideration, cart, purchase, shipment, delivery, first use, ongoing use, replenishment (where relevant), recovery [CPB M21/1 p59]. Operational events: order accepted, packed, shipped, delayed, delivered, service exception [CPB M23/D1 p65].

---

#### 3. Shared operating model (the "spine" every department uses)

##### 3.1 The 9-step loop every workflow completes [CPB OM/01 p7]
1. Frame the decision (customer outcome, business question, scope, constraints, decision owner; load product/brand/offer/journey facts; name the missing fact that could change the answer).
2. Establish the foundation (applicable standards & dependencies; repair confirmed defects; mark unverified; say which gaps block this action).
3. Gather evidence (owned outcomes, customer observations, competitor refs, expert methods, platform constraints; dates, denominators, rights, locators).
4. Explain the opportunity (observed fact vs mechanism; similar + contradictory cases; what would make it wrong).
5. Create a portfolio of options (conservative improvement, adjacent alternative, exploratory option; vary one dimension for diagnostics).
6. Select a testable brief (what's made, what changes/stays fixed, who it serves, evidence used, result that justifies next step; match volume to review/test capacity).
7. Produce and review (generate/assemble/delegate/draft; check product truth, usefulness, commercial consistency, quality; targeted corrections).
8. Execute and verify (supported platform capability + authority; baseline before exposure; verify external result; partial failure/rollback).
9. Measure and learn (operational success vs association vs causal evidence; wait for maturity; record losses/inconclusive alongside wins).
- Two linked pipelines: idea pipeline (ends in approved hypotheses & briefs) and execution pipeline (ends in verified artifacts/actions + scheduled learning step) [CPB OM/01 p7].

##### 3.2 WGLL "spine" (5 parts) [WGLL §3 p4]
1. Cards: single claims with scope (baseline/conditional), evidence tier, source.
2. Plays: named procedure with preconditions, ordered steps, tool calls, 1 metric, justifying cards. Agents run plays, never invent them (CPB: exploration may propose a new play which returns to review [CPB VISION/03 p5; OM/06 p12]).
3. Orchestrator: reads brand state, picks/sequences/budgets plays, collects output, routes to human.
4. Sub-agents: each owns 1 job and watches 1 metric; cheap models extract/format, flagship models judge (CPB: one bounded responsibility + primary metric + guardrails, interactions checked centrally).
5. Outcome ledger: baseline, result, entry tagged by brand archetype.
- Rules: every output claim cites a card ID or data row (uncited flagged); every recommendation carries expected GP effect.

##### 3.3 Two knowledge layers and two run modes [WGLL §1.3 p1-2; §3.1 p4]
- Layer 1 baseline: true for every brand at every size, pass/fail, never A/B tested; ~80-120 baseline cards cover all 18 modules vs 1,500-3,000 conditional (about 5% of library carrying ~40% of first-90-day value).
- Layer 2 stage/conditional: answer changes with size (split tests, creatives/month, expansion, SEO, avatar count).
- Counter-case test: "can you describe a real brand where the opposite advice is correct?" yes -> stage layer; no -> baseline.
- Audit run: checks baseline; pass/fail + severity + fix; ordered by severity (Blocker = money leaking now or measurement wrong; Major = known conversion cost with clear fix; Minor = do when in that file); runs at connect then weekly.
- Growth run: stage layer; ranked experiments with expected effect on GP/purchase.
- Rule: no growth run until baseline blockers are cleared.
- CPB equivalent: baseline graph (product truth, understandable offers, useful descriptive info, functioning transactions, reliable measurement, appropriate access, accessible help, honest evidence) + conditional subgraphs; states are applicable/not, evidence state (pass / failing / unverified / awaiting setup) and readiness [CPB OM/02 p8; VALIDATION/02 p89].

##### 3.4 Knowledge graph vocabulary [CPB OM/03 p9]
| Node family | Examples | Relationships |
|---|---|---|
| Business context | brand, market, product, variant, batch, offer | sold_in, fulfills_job, has_constraint, uses_specification |
| Customer understanding | situation, job, objection, observation, permission | experiences, expresses, requires_proof, contradicts |
| Knowledge | source version, evidence, principle, method, play | supports, requires, applies_when, supersedes |
| Production | pattern, reference, concept, script, scene, image, page | illustrates, derived_from, demonstrates, variant_of |
| Operations | task, approval, release, experiment, outcome, issue | approves_version, tests, measures, invalidates, causes_review |
- Two graphs: knowledge graph (standards, methods, evidence) and brand operating graph (merchant products, customers, artifacts, runs, outcomes), bridged by a creative reference library via authorised pattern links.
- Edges carry their own evidence (who asserted, source, date, scope, status); hypothesis edges vs tested edges kept separate.
- Agent traversal: resolve brand & task -> load baseline standards -> inspect prerequisites -> enter eligible subgraphs -> retrieve evidence & patterns -> expand dependencies -> bounded decision packet [CPB OM/02 p8].
- Example path: shared-table observation -> job -> portability objection -> setup demonstration -> owned creative -> matched LP section -> experiment -> first-use outcome.
- Implementation: ordinary records + typed relationship tables first; graph DB later.

##### 3.5 Evidence model [CPB OM/05 p11; SPLIT §A.2 p4-5]
- CPB: separate dimensions for source authority, study design, applicability, freshness, permitted use; T0-T4 only a shortcut.
- What each source can establish: owned operational records; controlled tests (causal within design); interviews/support (hypotheses, not prevalence); platform docs (behaviour for version/scope); expert methods; competitor observations; benchmarks.
- Observation -> explanation -> action -> validation route stored separately.
- Full case record fields: source identity/version, locator, capture date, publication date, product, audience context, market, execution, denominator, comparator, timeframe, costs, failures, caveats.
- Conflict resolution: check definitions/time/scope/measurement; keep both conditional cases; retire stale with reason; merge duplicates with lineage; keep genuine disagreements visible + propose test.
- SPLIT tiers: T0 own measured outcomes (from ledger, later); T1 platform primary (Google Search Central, Meta dev/business help, Shopify dev, web.dev, Chrome blog, API changelogs); T2 large-sample research/benchmarks (Baymard, Ehrenberg-Bass, cross-account creative studies, academic pricing); T3 named practitioner with account-level receipts (most YouTube); T4 opinion without name/receipts (Reddit, listicles, agency blogs). Rules: nothing below T1 contradicts T1 on platform facts; T4 = hypothesis fuel; undated -> T4; tier by cost of being wrong.
- SPLIT 4 contradiction resolutions: scope conflict (55-65%, add conditions), staleness (valid_to), definitional (fix vocabulary, merge), genuine conflict (mark contested, generate test) [SPLIT §A.7 p17-18].
- WGLL card review dates by domain: creative & paid social 6 months; SEO 12; CRO & email fundamentals 36; offer psychology 60 [WGLL §8 p22].

##### 3.6 From knowledge to plays: 7-step pipeline [CPB OM/06 p12]
1. Register (identity, version, locators, format, allowed uses, reason; private merchant data outside shared library).
2. Extract and segment (tables, units, captions, qualifications; sub-sources -> evidence chunks).
3. Draft cards (principle, observation, diagnostic, method, example, platform constraint; scope, prerequisites, failure cases, conflicts).
4. Review (Kevin = meaning/applicability; Colin = structure/locators/versioning; risk-based sampling).
5. Author plays (decision, inputs, baseline dependencies, ordered steps, tool capabilities, human decisions, output contract, verification, learning plan).
6. Retrieve and run (access, validity, eligibility, foundation coverage, supporting + contradictory material, task packet; log versions used).
7. Improve (classify failure: missing evidence, extraction, meaning, applicability, retrieval, reasoning, production, execution).
- Example of a bounded play: "for this product and customer situation, diagnose missing fit information, prepare an accurate dimensions section, preview it, verify mobile readability and track fit-related questions".

##### 3.7 Prioritisation [CPB OM/07 p13]
- Three priority lanes: (1) restore trust and function (transaction failures, false promises, unavailable products sold as available, missing remedies, corrupted measurement; severity & exposure lead); (2) reduce important uncertainty (decision value, cost of being wrong); (3) improve a functioning journey (ranges & assumptions; no opaque universal score).
- Shared benefit accounting: one initiative, one baseline; never sum independently guessed lifts.
- Portfolio capacity: limit WIP; optional exploration slot; no universal exploration %.
- Decision packet fields: opportunity, customer benefit, evidence, downside, required work, expected cost, outcome measures, decision owner, next milestone.
- WGLL/SPLIT alternative: rank by expected gross profit impact / effort, not metric lift [SPLIT §B.8 p24]; approval stack ranked by expected profit and capped at ~10 items [WGLL §8 p22].

##### 3.8 Personalisation ladder [CPB OM/08 p14]
- Context (match ad/query promise to destination) -> declared choice (shopper picks use case, size, budget) -> relationship (authorised returning-customer state) -> aggregate insight (message by audience/placement group). Each level has a fallback.
- Age/gender/placement: only authorised aggregate breakdowns; never join marginal reports into invented intersections; concentrations are hypotheses; no stereotyping; no sensitive-trait inference; measure if personalisation earned its complexity.

##### 3.9 Operating rhythm and queues [CPB CS/06 p82]
- Three queues: discovery (questions, gaps, exploratory hypotheses), production (approved briefs, assets, pages, flows, operational changes), learning (experiments, physical tests, outcomes waiting to mature). WIP limited by real capacity.
- Rhythm: urgent customer/transaction problems as they occur; production selections at team cadence; periodic mature-outcome review; knowledge refresh on change with time-based backstop.
- Agents get bounded jobs (question, facts, approved methods, tools, budget, output contract); coordinator sequences; critic checks support/arithmetic/consistency/scope; deterministic validation for calculations/schemas; human for meaning/taste; real-world verification for outcomes.
- Learn from corrections by layer: off-brand -> examples/guidance; wrong product feature -> facts/fidelity checks; missing card -> retrieval; source lacks evidence -> collection.

---

#### 4. Universal baseline ("what good looks like" standards)

##### 4.1 WGLL universal baseline checklist, in full, with severity [WGLL §3.2 p4-7]
(Severities read from `pdftotext -raw`; the layout-mode text file garbles the severity column.)
- Tracking and measurement {FN}
  - View, add to cart, begin checkout, purchase events all fire - Blocker
  - No duplicate purchase events across pixel and server side - Blocker
  - Order value and currency passed correctly - Blocker
  - Server-side events configured with good match quality - Major
  - GA4 ecommerce events complete and named to spec - Major
  - Consent mode configured for markets served - Major
  - UTM parameters survive full funnel incl. app redirects - Major
  - A test purchase appears correctly in every connected system - Blocker
- Speed {WS}
  - LCP element identified and preloaded - Major
  - Images in modern format and sized to display size - Major
  - No render-blocking third-party script above the fold - Major
  - Fonts subset and preloaded, no FOIT - Minor
  - No app scripts loading on pages that do not use them - Major
  - CLS under 0.1 on mobile - Major
- Page structure {WS}
  - Above the fold states what it is, who it is for, price, CTA, 1 proof element - Major
  - Benefits before specifications - Minor
  - Social proof within first 2 screens - Major
  - Top objections answered on the page - Major
  - Guarantee/risk reversal visible without scrolling to footer - Major
  - FAQ covers 5 most common pre-purchase questions - Minor
  - 1 primary CTA, repeated, no competing actions next to it - Major
  - Sticky add to cart on mobile - Minor
- Product images {CPS}
  - At least 6 images - Major
  - Hero on clean background - Major
  - At least 1 in use / in context - Major
  - Scale or size reference present - Minor
  - What is in the box shown - Minor
  - Text on image readable at thumbnail size - Major
  - All images load, correct aspect ratio, alt text present - Blocker
- Trust and friction {WS}
  - Shipping cost and delivery estimate visible before checkout - Blocker
  - Return policy reachable in 1 click - Major
  - Real contact method visible - Major
  - Accepted payment methods near CTA - Minor
  - Guest checkout, no forced account - Blocker
  - Mobile tap targets >= 44px - Minor
  - Checkout works on 3 most-used browsers and mobile - Blocker
- Offer congruence {OF}
  - Ad promise matches page headline - Blocker
  - Any discount stated in an ad exists on the page - Blocker
  - LP matches avatar and angle of the ad pointing at it - Major
  - Site offer and email offer agree - Major
  - No expired promotion visible anywhere - Major
- Email {RT}
  - SPF, DKIM, DMARC set correctly - Blocker
  - Welcome flow live - Major
  - Abandoned checkout flow live - Major
  - Unsubscribe works and is honoured - Blocker
  - Transactional emails branded, accurate, delivering - Major
- Ad accounts {PA}
  - Optimisation event correct and deduplicated - Blocker
  - Naming convention carries avatar, angle, offer - Major
  - Product catalogue connected and error-free - Major
  - No audiences competing against each other for same buyer - Major
  - Placements and formats not silently excluded - Minor
  - Brand and non-brand search reported separately - Major
- SEO {OG}
  - Indexable pages indexed / non-indexable blocked - Major
  - Unique title + meta description per page - Minor
  - 1 H1 per page - Minor
  - Valid product schema - Major
  - Sitemap submitted and clean - Minor
  - No broken internal links - Minor
  - HTTPS everywhere, no mixed content - Major
- Economics {FN}
  - True landed cost per unit known (freight, duty, handling) - Blocker
  - Return rate measured and subtracted from contribution margin - Blocker
  - Gross profit per purchase computable from connected data, not estimated - Blocker
- Count: 62 checks across 10 areas (WGLL says "roughly 80 to 120 baseline cards cover all 18 modules"; SPLIT expects 100-130 baseline cards in a 1,900-card library, >200 = mis-sorting [SPLIT §A.8 p18]).

##### 4.2 First 15 audit detectors, in build order [SPLIT §B.7 p23-24] (candidate "audit check" skills)
1 Purchase event fires and is deduplicated; 2 Order value & currency correct; 3 Test purchase completes and appears in every connected system; 4 Shipping cost visible before checkout; 5 Guest checkout available; 6 All product images load with correct aspect ratio; 7 LCP element identified and preloaded; 8 App scripts loading on pages that do not use them; 9 Above the fold contains the 5 required elements; 10 Social proof within first 2 screens; 11 Return policy reachable in 1 click; 12 Ad promise matches page headline for live ads; 13 Email authentication records set; 14 Welcome and abandoned checkout flows live; 15 GP per purchase computable from connected data. Blockers = 1-5 and 15 ("ship those 6 first if you need something in a week").
- Detector contract: `detector(brand, snapshots, params) -> Finding` (pass | fail | na + evidence: exact value, threshold, where measured); runs on snapshots never live calls; na with reason when a connection is missing; a baseline card without a detector is advisory only and not in the audit; findings ordered by severity then module, never by expected profit; owner can mark n/a with reason [SPLIT §B.7 p23; WGLL §8 p22].

##### 4.3 CPB reframing of the baseline [CPB VISION/03 p5; OM/02 p8; VALIDATION/02 p89]
- Keeps a compact explicit foundation checklist, but: universal standards still need a relevant surface (checkout check needs a checkout); missing evidence = unverified, not pass; prelaunch checks become launch dependencies ("awaiting setup"); an observed defect stays failing until evidence closes it.
- Rejects forced layouts as baseline: image standard = customers can understand important fit and use info; "no universal ten-image rule" [CPB M12/1 p45] (contrast WGLL ">= 6 images" + 10-slot template).
- Foundation vs Conditional lines per module are given in Part 5.

---

#### 5. Departments / modules: full detail

Anatomy. Each CPB workflow chapter: Decision -> 6 steps -> Interface & outputs -> Foundation vs Conditional -> Human decision / Customer benefit / Measure -> Handoff or Failure to avoid; then 3 "Ideas" (product features) -> Fictional Foldwell example -> Test & learn (what Kevin collects + search strings; what Colin builds) -> Pass condition. WGLL modules: Goal, Inputs, Orchestrator, Sub-agents (owns/outputs), Output, Baseline, Human decision, Stage gate, Failure mode. SPLIT per-module collection briefs: why, search keywords, where to look, capture specifically, baseline candidates, volume, skip, done-when.

##### 5.0 M01 Intake: discover the constraint worth solving {ST} [CPB M01/1-2 p23-24]
- Decision: where should this business focus next? UX: short conversation -> evidence-backed map of business, journey, next actions.
- Steps: (1) business brief (goals, products, markets, team, cash, time, capacity, constraints, founder's explanation; stated vs verified); (2) import what exists (catalogue, orders, costs, stock, brand assets, feedback, channel data; upload/manual fallback; freshness & coverage); (3) reconstruct journey (discover/evaluate/buy/receive/use; missing links, inconsistent promises, measurement gaps); (4) run applicable foundation (prelaunch -> launch dependencies); (5) compare competing diagnoses (sales decline = fewer qualified visits / stock / product / broken purchase path / acquisition mix); (6) propose bounded next step (repair vs investigation vs growth experiment, each with owner + completion condition).
- Outputs: brand brief, capability map, journey map, evidence-gap list, opportunity queue (each linked to a downstream module with same product/offer versions).
- Human decision: confirm goal, choose next work package. Measure: time to credible decision, avoidable questions, accepted priority. Failure: asking for every integration before giving any help.
- Ideas: disagreement view (founder belief vs evidence); next best question (ask only the missing question that changes the decision); compare three futures (repair-first / acquisition-first / expansion-first scenarios).
- Kevin collects diagnostic case studies, intake examples, rejected hypotheses; Colin builds linked fact states, capability checks, explanation trace.
- WGLL equivalent: "Audit run" at account connect + stage score [WGLL §3.1 p4]; SPLIT has no intake module.

##### 5.1 LAUNCH / RESEARCH PHASE

###### M02 Market research (MKT; WGLL Module 1) {RS}
- CPB decision: which customer problem and market deserve investment, personalised to founder capabilities [CPB M02/1 p25].
- CPB steps: define search space (geography, situation, problem, alternatives incl. doing nothing/borrowing/repairing/improvising, price context, founder advantages); gather demand evidence (interviews, communities, search, category activity, paid datasets; Google Trends = relative interest only); map recurring tensions (progress sought, disappointments, frequency, cost, who controls purchase); compare market patterns across adjacent industries; several entry theses (narrow situation / improved delivery model / more suitable product / simpler buying) each with evidence, counterevidence, assumptions, next test; test the most consequential assumption (problem interviews, prototype observation, truthful concept page; interest vs try vs purchase).
- Outputs: landscape map + comparison table + decision memo (reject / investigate / prototype / bounded launch). Handoff to M03: job, alternatives, operating constraints, unresolved questions.
- Ideas [CPB M02/2 p26]: workaround atlas; objection to entry (skeptical companion per thesis: reachable demand, channel economics, founder access, supply difficulty, why incumbents avoid it); founder advantage map.
- WGLL Module 1 [WGLL §4 M1 p7-8]: goal = narrow to 3-5 markets this person can win. Inputs: owner interview, resume/LinkedIn, capital, time, geography, refused/attracted categories, skills, supplier/audience access. Orchestrator: "Market scout" (the only orchestrator WGLL names). Sub-agents: Demand trend (24-60 month demand curve), Market size (size & growth with source), Competitive density (density score + top 10 players; ad load, CAC pressure), Margin structure (AOV, COGS, shipping, return rate -> contribution margin band), Regulatory & risk (claims rules, certifications, restricted categories, ad policy -> pass/caution/block), Operator fit (fit score vs owner profile). Output: 3-5 market shortlist, 1-page brief each (why it fits, demand curve, margin band, main risk, entry requirements, drop conditions). Human: pick 1-2. Gate: S0 only; S4+ for new market entry. Failure: generic market report -> operator-fit agent is the fix.
- SPLIT collection: MKT/CAT/PRD/EXP collected together (weeks 16-22); 40-60 sources, 200-300 cards; skip dropshipping content; done when a category can be scored on 8 criteria with defended weights [SPLIT §A.5 p15-16].

###### M03 Category research (CAT; WGLL Module 2) {RS}
- CPB decision: which type of solution best fits the need and the business's ability to deliver [CPB M03/1 p27]. Steps: solution tree (direct categories, substitutes, combinations); comparable evidence (price bands, complaints, purchase frequency, shipping burden, fit risk, maintenance, durability, support, supplier requirements; normalised); reference patterns of strong category operators; hard exclusions (quality risk, unsuitable use, unaffordable MOQ, unresolved requirement); feasible category comparison (visible scorecard, founder-weighted, sensitivity); validation brief to M04 with decision gate.
- Outputs: category tree with job overlays + price/benefit comparison; no forced composite score. Failure: assuming crowded = no opportunity or empty = attractive.
- Ideas [CPB M03/2 p28]: complaint-to-category switch; tradeoff frontier (e.g., portability x durability x delivered cost; later a truthful buying guide); hidden operating burden profile (inspection, storage, shipping, returns, education, support).
- WGLL Module 2 [p8]: goal = category with best demand + margin + defensibility. Sub-agents: Category mapper (tree with demand per node), Price ladder (price band map & gaps), Review miner (ranked complaint list with frequency), Saturation (score per node: ad presence, review counts on top sellers), Supply (sourcing difficulty: MOQ, lead time, customs class), Repeat potential (consumable vs durable; repeat-rate band). Output: ranked categories + scorecard; "unresolved complaints in a crowded category are the single best entry signal". Human: pick 1. Gate: S0; S3+ for expansion. Failure: picking on demand alone; repeat-potential agent gates the score (1-time low-AOV purchase cannot pay for paid acquisition).

###### M04 Product research (PRD; WGLL Module 3) {OF}
- CPB decision: what to build/source and what evidence is needed before promising it [CPB M04/1 p29]. Steps: translate job into measurable requirements (dimensions, materials, compatibility, capacity, care, contents, use); map candidates & supplier options (actual specs vs marketing claims vs estimates); product concepts (incremental / rearranged / simpler focused); model feasibility (landed cost, packaging, freight, MOQ, tooling, lead time, inspection, service burden, cash); test real samples against a pre-written acceptance protocol (qualified safety/compliance review); promote only verified facts (supplier-stated / sample-verified / production-verified) into brand/offer/page/creative/support.
- Outputs: product dossier (requirements-to-evidence graph, candidate comparison, sample checklist, photo refs, cost model, decision log). Handoff: approved product fact pack + claim limits. "A failed physical test cannot be overridden by attractive creative performance."
- Ideas [CPB M04/2 p30]: living requirement map (complaint -> spec field; communication vs product problem); design variants with explicit tradeoffs; sample-to-claim gate.
- WGLL Module 3 [p9]: goal = specific product, spec, price ("where the 40-60 page knowledge base gets used hardest": sourcing, spec writing, differentiation, pricing, bundling, first-product failure patterns). Sub-agents: Product shortlist (10-20 candidates), Differentiation (spec changes answering real complaints), Unit economics (P&L per unit at 3 price points), Sourcing (3-5 suppliers: MOQ, sample cost, lead time, certifications), Compliance (certifications, labelling, import rules, claim limits -> required documents list), Launch risk (fragility, size/weight, return rate, seasonality -> top 3 risks). Output: 3 product options (spec, supplier path, landed cost, price, margin at 3 prices) + launch plan for the winner. Human: pick product & price. Gate: S0; S3+ for line extension. Failure: optimistic shipping and no returns (force category return rate from Module 2).

###### M05 Expansion (EXP; WGLL Module 4) {OF}/{ST}
- CPB decision: improve current business, add product, adjacent category or new market? [CPB M05/1 p31]. Steps: map current portfolio (products, variants, situations, contribution, returns, stock, supplier capacity, requests; stock effects vs durable demand); adjacency signals (buy next, search, ask support, assemble from other brands); graph traversal (job -> missing capability -> current product -> adjacent product -> supply/fulfilment; reuse M02-M04); options across levels (fix existing / accessory / bundle / category / localise / "do not expand yet"); model incremental value & burden (cannibalisation, stock, tooling, service, content, marketing, localisation, complexity, cost of delay); validate in stages.
- Outputs: portfolio map, ranked adjacency hypotheses, cost/cash scenarios, decision memo. Handoff: approved concepts -> M04; existing issues keep owners.
- Ideas [CPB M05/2 p32]: next unsolved job; assortment simplifier (consolidate confusing variants, migration plan); capability reuse map.
- WGLL Module 4 [p9-10]: inputs: website, full catalogue, 12-24 months orders, ad accounts, review corpus. Sub-agents: Catalog mapper (category map with revenue & margin per node), Customer demand (adjacent demand from orders, tickets, reviews, on-site search), Trend scan (24-month slope near catalogue), Competitor catalog (gap list with evidence they work), Allied category (1 step away, same buyer), Fit and cost (go/no-go, cost to enter). Output: 4-section report (current map, allied products, allied categories, new markets), each option with expected revenue, margin, cost to enter, time to first sale, ranked by GP added per dollar invested. Human: pick 1-2. Gate: S3+. Failure: expanding with an unprofitable acquisition engine -> hard precondition: core contribution margin positive for 90 days.

###### M06 Customer intelligence / avatars & JTBD (AVT; WGLL Module 5) {RS}
- CPB decision: who needs the product, in what situation, for what progress, with what concerns; evidence not fictional biographies [CPB M06/1 p33]. Steps: balanced corpus (interviews, reviews, support, surveys, communities, search queries, behavioural data; buyers, nonbuyers, switchers, disappointed); preserve original observation (quote, locator, date, product, situation, permission; said vs inferred); code buying situation (trigger, desired progress, previous solution, tradeoff, objection, proof need, buyer vs user, choose/reject reason); provisional segments by situation; connect to outcomes (fit, repeat, returns, support by cohort); action-ready profiles (offer value, proof, page questions, creative angles, first-use support, unsuitable uses).
- Outputs: customer evidence board (quotes vs jobs; split/merge with history). Handoff: versioned job/profile records -> offers, pages, creative, CX; change flags dependent drafts.
- Ideas [CPB M06/2 p34]: question-to-proof map; misunderstood customer queue; contradiction explorer.
- WGLL Module 5 ("the revenue driver") [p10-11]: goal = avatars with pains, goals, desires, fears, trigger moment, job hired for. Sub-agents: Evidence gather (reviews, tickets, Reddit, forums, YouTube comments, surveys -> VOC corpus with sources), Existing avatar (live brands: ad-level data, best copy, GA4 demographics, orders -> who buys now ranked by profit), Avatar builder (4-8 avatars tied to quotes), Jobs to be done (job statements with trigger moment), Off-label use (alternate jobs with evidence of real use, e.g., baking soda for skin care), Untapped avatar (nobody targets; deliberately different prompt; owner kills most), Competitor avatar (from ad library -> competitor avatar map + gap). Output: avatar table (name, demographic sketch, pains, goals, desires, fears, trigger moment, JTBD, objections, words they use, proof needed, status proven/testing/untested). Baseline: every avatar carries quoted evidence + trigger moment + job statement. Human: which avatars get offers. Gate: S1+; new brands 2-3 avatars. Failure: demographic avatars with no job.
- SPLIT AVT brief [p7-8]: "everything downstream is only as good as this"; keywords incl. JTBD interview technique, switch interview timeline, VOC method, review mining, Amazon review mining, Schwartz awareness levels, market sophistication, pain-point framework, survey questions, psychographic segmentation, untapped segments, competitor audience via Meta Ad Library, off-label uses; sources Breakthrough Advertising, The Mom Test, JTBD literature, Reddit/review corpora (T4 for language); capture method step by step, how many interviews/reviews are enough, good vs garbage questions, real job vs stated preference, usable avatar record structure; 25-35 sources, 120-180 cards; skip demographic persona templates; done when a stranger could produce an acceptable avatar from the method.

###### M07 Untapped situations / exploration {RS} [CPB M07/1-2 p35-36] (WGLL Module 5 off-label + untapped sub-agents)
- Decision: which overlooked situations/angles deserve investigation; exploration gets its own lane.
- Steps: inspect edges of current use (workarounds, unusual requests, non-consumption, adjacent categories, rejected concepts); distinguish novelty (new to brand / uncommon in sample / genuinely uncertain); retrieve analogous mechanisms from other categories; generate hypotheses (situation, unmet need, product role, evidence, why overlooked, why it could fail; incl. education/distribution ideas); check suitability & claims; smallest useful investigation.
- Outputs: exploration board (evidence-backed / weak signals / rejected). Handoff: validated situation -> M06; physical requirement -> M04; message idea -> M17.
- Ideas: nonbuyer obstacle map (price, fit, effort, distrust, no need); cross-category pattern transfer; disconfirmation brief ("why this may be wrong").

##### 5.2 OFFER, BRAND AND STORE SETUP

###### M08 Offers (OFF; WGLL Module 6) {OF}
- CPB decision: what combination of product, terms, support and price serves the situation; "the offer is a promise that flows through the entire journey" [CPB M08/1 p37]. Steps: inventory current promises across ads, pages, checkout, email, packaging, support (versioned facts); identify value gap (lower risk, better fit, easier setup, complete solution, faster availability; discount = one mechanism); retrieve offer patterns under similar economics; meaningful alternatives (education, bundle, service add, guarantee, subscription only where consumption supports it); calculate scenarios (price, discounts, COGS, fulfilment, fees, returns/service, marketing, take rate; downside; stock/cash/capacity); consistent offer packet (terms, page copy, ad copy, checkout, lifecycle, service instructions on one offer version).
- Outputs: offer builder (customer value, terms, contribution scenarios side by side; changed component shows affected assets). Failure: higher-converting offer that ignores margin, cannibalisation, post-purchase promise.
- Ideas [CPB M08/2 p38]: value-component library; promise consistency monitoring (find old terms across ads, pages, cart, email, macros); reversible offer experiment (inventory & service caps; education vs discount). Worked arithmetic: 10,000 visits -> 300 orders x $30 = $9,000 vs discount 360 x $22 = $7,920.
- WGLL Module 6 [p11]: avatars and offers are 2 linked documents (avatar parent, offers child rows; one avatar holds 5-10 offers over its life). Sub-agents: Current offer audit (inventory with performance), Congruence check (score + exact mismatches), Offer builder (offer cards: mechanism, price, terms), Guarantee & risk reversal (options with cost), Bundle & AOV (bundles, tiers, upsells with margin impact), Offer economics (margin model at expected take rate; veto power). Offer card fields: promise, mechanism, price & terms, guarantee, objection it kills, expected effect on CVR and AOV, margin math. Baseline: congruence. Human: which offers enter the test queue, in what order. Gate: S1+. Failure: offers that raise CVR and destroy margin.
- SPLIT OFF brief [p8]: keywords incl. value equation, grand slam offer, risk reversal, guarantee impact, bundle pricing, free-shipping threshold, discount depth, subscription, post-purchase upsell, BOGO vs %, anchoring, decoy pricing, payment plans, first vs repeat order offer; capture mechanics, CVR and AOV separately, margin, objection killed, guarantee cost % of orders, upsell/bundle take rates; 20-30 sources, 100-150 cards; done when >= 12 distinct offer mechanics each with cost, take-rate range and objection answered.

###### M09 Brand (BRD; WGLL Module 7) {BF}
- CPB decision: what stays recognisable vs what varies by situation [CPB M09/1 p39]. Steps: extract existing identity (intended vs inconsistent history); connect positioning to evidence (job, competitive frame, product truth, promise, reasons to believe; provisional identity for new brands); structured brand record (voice examples, vocabulary, claims, visual assets, layout/image principles, accessibility, market adaptations; every rule paired with examples); fixed vs flexible elements; expression alternatives (taste separate from performance); validate across touchpoints (ad, page, checkout, email, packaging, support).
- Outputs: living brand workspace + consistency map + change history; every production packet loads the current version. "A PDF brand book alone is not the integration."
- Ideas [CPB M09/2 p40]: brand expression sandbox (one proposition as page opening, static ad, script, support reply); contradiction map (promise vs touchpoints); memory of deliberate choices.
- WGLL Module 7 [p11-12]: split in 2: Brand basics at setup (name, domain, logo, 3 colours, 2 fonts, tone in 5 adjectives) and Brand book after avatars & offers. Sub-agents: Brand extractor (current identity with screenshots), Consistency audit (inconsistencies ranked by visibility), Verbal identity (tone, vocabulary, banned words, claim limits, reading level -> voice guide with 20 real examples), Visual identity (colour, type, layout, photography direction with rationale), Positioning (vs named competitors, with proof), Asset generator (logo variants, colour tokens, templates). Output: brand book as required structured context for every copy & image agent. Gate: basics S0, full book S1+. Failure: brand book nobody reads.
- SPLIT BRD brief [p14-15]: brand guidelines structure, voice guide, positioning, distinctive brand assets, category entry points, How Brands Grow, brand vs performance split, DTC naming, packaging; Ehrenberg-Bass at T2; capture the fields a brand book needs to be usable as AI context; 12-18 sources, 50-80 cards; skip colour psychology; done when a brand book schema exists that an agent can consume.

###### M10 Store & domain setup (SET; WGLL Module 8) {WS}
- CPB decision: what must be established and verified before transacting reliably [CPB M10/1 p41]. Steps: ownership & scope (merchant-owned domain, accounts, admin roles, recovery, renewal; agency gets delegated access only); product & commercial basics (catalogue, variants, price, availability, payment, shipping, policies; tax/legal owners); communication & measurement (business email, authentication, order notifications, consent-aware events, analytics); first truthful buying path; test representative paths (variant change, cart, shipping, payment success/failure, notifications, events; test-mode limits); confirm readiness, launch, verify live.
- Outputs: launch board (dependencies, next actions, evidence of completion; "awaiting verification" until evidence). Failure: zero-price order taken as proof of payment capture.
- Ideas [CPB M10/2 p42]: completion receipt for every step; capability-aware checklist (plan, market, payment options, permissions); launch rehearsal (discovery -> confirmation -> help; mobile, unavailable variant, failed payment).
- WGLL Module 8 [p12]: new brands only. Sub-agents: Domain & email setup, Store setup, Payments & tax, Shipping & fulfilment, Tracking & analytics, Legal pages. Output: step-by-step click guide (what to click/enter/what done looks like); system does what it can via API, hands over the rest with screenshots. Human: approve spend & sign up. Gate: S0 only. Failure: tracking set up wrong -> verify with a real test purchase before marking done.
- SPLIT SET brief [p11]: Shopify setup checklist, domain & business email, tax, shipping profiles, GA4, Meta pixel + CAPI, legal pages, checkout settings, payment gateway; capture click paths, wrong-order breakages, verification steps; 10-15 sources, 40-60 cards, all baseline; skip >18 months old; done when a new brand could go live following only the cards.

##### 5.3 WEBSITE, CONVERSION AND RELEASE

###### M11 Pages & copy / landing pages (LPG; WGLL Module 9) {WS}
- CPB decision: what should this visitor understand and do next [CPB M11/1 p43]. Steps: load context (situation, entry message/query, awareness, product facts, offer, brand, destination constraints); diagnose current page (verified defect vs layout preference); retrieve page patterns (PDPs, comparison, educational, advertorials, selectors; inspect each section's role); propose arguments & structures (fit-first / demonstration-first / comparison-first; choose page type first); build draft (specific copy, approved proof, image briefs, accurate terms, limitations, CTAs, accessible mobile; no fake testimonials, false urgency, unsupported numbers); review & hand off (beside originating ad and offer record; design/dev packet or preview).
- Outputs: side-by-side workspace (current, proposed, rationale per section). Handoff: M12 visuals, M16 release, M15 experiments, M23 expectation problems.
- Ideas [CPB M11/2 p44]: argument map (objection -> section -> evidence); promise continuity preview (ad -> page -> cart -> confirmation); guided fit selector.
- WGLL Module 9 ("half of the core product; the other half is ads") [p12-13]. Sub-agents: Page auditor (findings ranked by profit impact), Structure selector (page type + section order), Section builder (from template library), Copy agent (headlines, body, captions, CTAs in brand voice), Image planner (brief per slot), Image generator (images + designer brief), Code agent (Shopify theme changes as a draft theme; app setup; schema), Mobile agent (mobile fixes, tap targets), QA agent (broken links, layout, alt text, claim compliance). Structure library = the asset: page types standard PDP, advertorial, listicle, quiz funnel, comparison page, long-form sales page (section order, section jobs, copy principles, avatar/offer fit; "extract the principles, not the words"). Output: draft page in draft theme with preview link, change list, expected effect. Human: approve/edit/reject, then publish. Gate: build S1, test S2, A/B S3. Failure: structurally correct but emotionally flat -> direct-response cards + real examples; QA rejects generic AI copy.
- SPLIT LPG brief [p9]: PDP structure, PDP/Baymard UX research, above the fold, advertorial, listicle funnel, quiz funnel, long-form sales page, product image sequence, product photography, social proof placement, objection handling, DR copywriting, headline formulas, mobile PDP, sticky ATC, comparison page, LP teardown; 25-35 sources, 150-220 cards (25-35 baseline); skip design trends; done when 6 page types with section orders and avatar/offer fit can be described.

###### M11/COMMERCE Commerce assistance: help the shopper choose and complete the purchase {WS} [CPB CONNECTED M11/COMMERCE/1-2 p73-74]
- Steps: inspect in-store discovery (search terms, zero-result queries, filters, category paths, comparisons, support questions); identify decision obstacles (similar variants, unclear compatibility, hidden total cost, unavailable stock, confusing shipping, failed payment); retrieve patterns (guided filters, comparison tables, contextual explanations, simpler grouping, cart summaries, error recovery); create options (navigation label, product selector, honest out-of-stock alternative, cost visibility, simpler checkout instruction); produce & verify (edge cases, mobile, keyboard, error states; M16 release, M15 tests); learn across purchase (task completion, wrong-product orders, payment failures, support, returns).
- Outputs: shopper-task board; product assistant (if built) reads approved catalogue facts, states limitations, hands off to support; cannot invent compatibility or terms.
- Ideas: no-result recovery path; explainable recommendations; cart promise check (variant, inclusions, discount, delivery expectation, total).
- Handoff: failed searches -> research; fit questions -> imagery; payment failures -> repairs; unsuitable purchases -> customer intelligence.

###### M12 Product imagery {CPS} [CPB M12/1-2 p45-46; WGLL §4 M9 p13]
- CPB decision: what must the customer see to understand this exact product and variant (PDP imagery's job differs from ad imagery; same approved fact pack). Steps: audit current asset set (loading, variant match, fidelity, crops, mobile readability, dimensions, inclusions, use info); information map (buying question -> image role: hero, use, size, construction, contents, comparison, care, limitation); inspect references; shot/asset plan (exact product, variant, facts, measurements, text, setting, proof; real photo vs design vs illustration vs generation); produce & verify (geometry, features, scale, labels, colour, inclusion boundaries); publish via controlled release (variant mapping, restorable previous version, limited rollout).
- Outputs: image-role board ("question answered" + "evidence required" per slot); asset library grouped by variant with exact SKU identity. Failure: rendered image treated as evidence of an unverified feature.
- Ideas: missing-information detector (support/return reasons -> contents/dimensions brief); variant-aware asset inheritance; product-truth review alongside preview.
- WGLL 10-slot product image template: 1 hero clean background; 2 in use / in context; 3 main benefit shown not stated; 4 before/after or comparison; 5 what's in the box; 6 size & scale reference; 7 social proof (real review as graphic); 8 objection killer; 9 guarantee & risk reversal; 10 bundle or upsell. Generator takes brand book + product photos + slot brief; same system runs catalogue images in bulk.

###### M13 Speed (SPD; WGLL Module 10) {WS}
- CPB decision: which performance problems materially impede customers [CPB M13/1 p47]. Steps: establish affected journey (templates, devices, markets, interactions, recent changes); measure (field for real experience, lab for diagnosis; LCP/INP/CLS at p75); find cause (images, fonts, render blocking, interaction work, app scripts, layout shifts, network, platform); repair options (simplest safe fix vs deeper; apps may add value); two outputs (founder explanation + developer packet with reproduction, component, change, verification); verify repair.
- Outputs: performance issue board by journey/template with owner and before/after evidence.
- Ideas [CPB M13/2 p48]: app value-versus-friction review; release-linked regression map; persistent repair queue.
- WGLL Module 10 [p13-14]: "find what is slow, explain it twice, fix it, prove the fix". Sub-agents: Field monitor (CrUX p75 weekly per template), Lab tester (Lighthouse + waterfall), App auditor (script weight per app, keep/cut), Asset auditor (oversized images, fonts, third-party tags), Theme auditor (render-blocking code, layout-shift sources), Fix agent (code diff in draft theme), Verifier (before/after delta). Two reports: founder (plain English, cost in orders/month) and developer (file names, line numbers, waterfall, exact change, verification). Weekly nag loop on unfixed items. Baseline: nearly all speed. Gate: S1+; app audit S2+. Failure: chasing Lighthouse scores instead of p75 field data.
- SPLIT SPD brief [p9-10]: CWV conversion impact, LCP/INP/CLS on Shopify, theme audit, app script bloat, third-party scripts, WebP/AVIF, font loading, render blocking, CrUX vs Lighthouse, JS bundle size; 12-18 sources, 50-80 cards mostly baseline; done when the 15 most common Shopify speed problems can be ranked by profit impact.

###### M14 Measurement (MEA, cross-cutting) {FN} [CPB M14/1-2 p49-50; SPLIT §0.2 p2, §A.5 p6-7]
- CPB decision: which observations can the business trust for this task. Steps: event & metric dictionary (trigger, parameters, identity, value, currency, timezone, source, destination; cost per purchase vs new-customer CAC vs platform-attributed return); validate transaction path (purchase event, dedup, values, refunds; test traffic excluded); reconcile compatible totals (store vs analytics vs ad platform; explain expected differences); inspect reporting limitations (missing events, consent, sampling, thresholding, unsupported breakdowns, delays); freeze decision snapshots + append restatements; assign measurement readiness (healthy / usable with limits / unverified / unsuitable; block only dependent conclusions).
- Outputs: data-health view on every metric (formula, denominator, period, source, attribution scope, freshness, caveats) + reconciliation report. Failure: summing Meta + Google attributed revenue as unique revenue; missing cost filled with zero.
- Ideas: a receipt behind every number; measurement incident workflow (analytics purchases double but orders don't -> check events, dedup, currency, test traffic, windows; pause affected claims/tests); history of restatements.
- SPLIT MEA: not a product module but a collection domain (tracking + unit economics knowledge needed by almost every module, gathered once); collected first (weeks 1-2); keywords incl. CAPI setup, Meta EMQ, pixel/CAPI dedup, GA4 ecommerce spec, Meta 7-day click, MER vs ROAS, contribution margin formula, GP per order, incrementality, geo holdout, blended CAC, landed cost, return-rate margin impact, consent mode v2, UTM loss at checkout redirect; sources Meta/GA/Shopify dev docs (T1), Common Thread Collective, Northbeam, Triple Whale, Evan Miller; 15-20 sources, 60-90 cards (25-35 baseline); skip attribution vendor comparisons; done when the exact list of things that must be true before the system trusts a number exists, each sourced.

###### M15 CRO & experiments (CRO; WGLL Module 11) {WS}
- CPB decision: fix a known defect, investigate uncertainty, or compare alternatives; never make a repair wait for a test [CPB M15/1 p51]. Steps: diagnose friction; hypothesis (situation, change, mechanism, primary outcome, failure conditions, comparator); choose method (functional verification / interviews & usability / controlled test / labelled observational monitoring); plan eligibility & analysis (baseline rate, MDE, power, error control, assignment unit, duration, outcome delay, interactions); produce & release (exact variants, verify allocation & events, baseline, stopping rules); read out & decide (supported improvement / harm / inconclusive / invalid / stopped; check sample ratio mismatch first).
- Outputs: experiment board (question, preview, method, readiness, exposure, maturity, next decision; "not enough evidence" is a state). Failure: peeking; week-over-week changes treated as randomised.
- Ideas [CPB M15/2 p52]: research-to-test ladder; interaction map (tests sharing audiences/offers/pages/inventory); decision-focused readout (adopt / retain / gather more / investigate guardrail / stop).
- WGLL Module 11 [p14-15]: owner flow: ranked list (hypothesis, change, expected lift, expected profit, runtime) -> preview -> deploy to non-production theme -> automated tests (page loads, ATC, checkout with test order, tracking fires, mobile renders, no console errors) -> evidence -> publish -> dashboard. Sub-agents: Hypothesis builder, Test designer, Significance watcher, Deployment agent, Test purchase agent, Rollback agent, Readout writer; one sub-agent per test watching 1 metric. Statistical discipline: min sample, min runtime over full weekly cycles, stopping rule; below 400 conversions/mo refuse classic A/B, use sequential. Gate: sequential S1, classic A/B S3, multi-arm S4. Failure: calling winners on noise.
- SPLIT CRO brief [p10-11]: sample size, significance thresholds, full business cycle, sequential low traffic, Bayesian vs frequentist, peeking, ICE/PIE, CRO research process, checkout research, cart abandonment reasons, MDE, bandits; 15-20 sources, 70-100 cards; baseline = broken things get fixed not tested; done when exact traffic/conversion thresholds per test type can be stated.

###### M16 Store release {WS} [CPB M16/1-2 p53-54; SPLIT §B.11 p25]
- CPB decision: is this exact artifact ready for this destination. Steps: resolve capabilities (store, theme, plan, app dependencies, permissions, surface); build reviewable version (preview/draft + requirement, input versions, expected behaviour, recovery plan); review content & behaviour (truthful product/offer, links, mobile, accessibility, variants, stock, discounts, shipping, payment); verify measurement; bind authority to the version (artifact, destination, action, scope, limits; standing authority for routine actions); release once and read back (reconcile timeouts before retry; verify live path; rollback/compensate).
- Outputs: release packet (preview, differences, checks, limitations, decision); states published / externally verified / measuring.
- Ideas: impact preview; customer-path rehearsal; recovery-ready release log.
- SPLIT draft -> stage -> verify -> publish loop: (1) artifact created as draft; (2) owner reviews change, reasoning, cards cited; (3) deploy -> staged (draft theme + preview URL); (4) automated verification (page loads, ATC, checkout with test order, tracking events in snapshot, mobile, no console errors); (5) owner sees evidence not a green tick; (6) publish -> baseline snapshot -> experiment registers. Test purchase agent: Playwright + test payment method or 100% discount code created and deleted inside the run; verify order in Shopify and purchase event in Meta & GA4 snapshots ("catches more real problems than any other piece of the system").

##### 5.4 CREATIVE INTELLIGENCE, PRODUCTION AND PAID ACQUISITION

###### M17 Creative intelligence (MCR; WGLL Module 12) {CS} - CPB's extended "creative walkthrough" (6 sub-workflows) [CPB p15-22]
- M17/1 Past-creative intelligence layer {AN} [p15]: ingest owned ads, organic posts, approved assets; losers and abandoned tests as carefully as winners. Steps: (1) reconstruct asset family (campaign, ad set, ad, creative, media, copy, LP versions via reliable IDs; duplicates kept as delivery records, grouped by concept; dynamic-combination attribution limits labelled); (2) freeze comparable reporting windows (objective, optimisation event, spend, impressions, clicks, purchases, attribution window, currency, geography, dates); (3) add available breakdowns (age, gender, platform, placement, device as optional dimensions; record what the API supports; unknown/unavailable shown); (4) annotate execution (hook, situation, objection, benefit, proof, format, pacing, audio, visual sequence, offer, destination; strategist can correct); (5) link downstream evidence (returns, fulfilment, service, repeat by cohort). Founder view: gallery with badges promising / provisionally strong / tested in this context / fatigued / inconclusive / insufficient data (no permanent winner badge). Outputs: creative history map, neglected concept families, poorly addressed objections, promising patterns, contradictory cases; may conclude weakness is really page/offer/measurement/stock.
- M17/2 Reference retrieval: find five useful contenders from 200 references {CS} [p16]: retrieval question = "which approaches could address the same customer problem or uncertainty in a fresh, credible way?" Steps: anchor on brand evidence; retrieve foundation (product truth, offer consistency, asset permissions, destination); search several paths (same objection/other proof; same principle/other format; same situation/adjacent category; contradictory example); filter & diversify (exclude unsupported/ineligible/unavailable; group near-duplicates; small differentiated slate). Foldwell contender types: close-up demonstration; before/after sequence; objection-led explainer; customer routine story; still-image decision guide. Acceptance: user can explain why all five, why they differ, which first; rejected contenders recorded.
- M17/3 Variant portfolio & briefs {CS} [p17]: "two similar and three different" initial slate as a configurable choice: A close iteration (new hook in customer phrasing), B close iteration (fit info earlier), C new format same mechanism (still-image sequence), D new argument order (objection first), E exploration (new approved situation). Segment adaptation is a separate dimension; adapt layout/captions/sound/pacing per placement. Required brief fields: customer situation; product/offer versions; concept & parent references; observed evidence; hypothesised mechanism; elements fixed & varied; proof & approved claims; image/video/audio needs; matched page; production route; reviewer; cost/time estimate; primary outcome; guardrails; next decision after result. Decisions: founder selects slate & spend/production envelope; agency allocates creators & review capacity.
- M17/4 Image production with equivalent designer route {CPS} [p18]: (1) assemble approved pack (views, dimensions, materials, colours, packaging, inclusions, variant mapping, brand rules, offer, permitted claims, immutable attributes); (2) communication brief (single customer question, focal detail, proof, headline, secondary text, CTA, difference from parent); (3) choose production route (existing photo + layout / new photography / generated environment around verified product / illustration / fully generated where fidelity verifiable); (4) generate or delegate (prompt: scene, composition, framing, lighting, allowed transformations, product constraints, text treatment; designer packet = same brief + editable assets + acceptance criteria; no unauthorised competitor media as input); (5) layered review (physical truth, variant identity, readable text, interpretation, brand, placement crop; overlays/human finishing for dimensions, logos, labels); (6) export & connect (master + placement variants, stable IDs, parent concept, prompt/brief version, reviewer selection, matched copy & destination, provenance metadata). Example "prompt contract" given for Foldwell. Reviewer tags: wrong product detail / weak hierarchy / off-brand -> regenerate only the affected component.
- M17/5 Organic & competitor observation -> ideas {CS}/{RS} [p21]: curated watchlist (competitors, adjacent categories, creators, communities via permitted sources). Pipeline: capture context (source, account, URL, date, market, type, format, wording, product, offer, engagement); classify role (teaching, demonstrating, entertaining, comparing, answering objection, announcing offer, supporting customers); extract candidate mechanism + alternative explanation; find transfer opportunities; produce original brief (what transfers, what doesn't, evidence needed, validation step; route to organic / paid / education / page). Evidence labels: publicly observed reference / author-reported result / owned measured result / controlled result. Source-access reality: YouTube caption download needs edit permission; Reddit commercial API needs agreement; Meta Ad Library coverage must be verified. Output: short annotated opportunity digest with ready-to-review briefs.
- M17/6 Creative learning & testing {AN} [p22]: before exposure (register hypothesis, parent, differences, eligible population, assignment, attribution definitions, primary metric, guardrails, analysis plan, budget, stop conditions; check page/offer/stock/measurement); during delivery (technical failure, unusual spend, destination problems, customer guardrails; hook/click = diagnostics; no "48-hour" winner calls); readout (supported improvement / supported harm / inconclusive / invalid measurement / operationally stopped; effect, uncertainty, exposure, cost, maturity); write back cautiously (link to exact creative, pattern, product, situation, play version; store wins and losses; later return spike can revise interpretation); next slate (continue / adapt / investigate / retire / explore; fatigue as hypothesis).
- WGLL Module 12 Meta creative [p15-16]: goal = ad creative at volume from patterns that work, tailored to 1 avatar + 1 offer each. "Store patterns, not competitor assets." Pattern record fields: format, duration band, hook type, beat structure, psychological principle, works-under conditions, fails-under conditions, evidence. Image pipeline (7 steps): select patterns for avatar/offer/funnel stage -> angle matrix (pattern x angle x awareness level) -> image brief per cell incl. exact claim of each element -> generate with brand product photo + brand book -> 5-10 variants per brief -> human picks -> designer or ship. Video pipeline (9 steps): script agent writes full script from winning structures, tied to 1 avatar + 1 offer -> human edits/approves -> split into beats, each a prompt -> beat 1 generates 3 variations, human picks 1 -> chosen clip is reference for beat 2 (generate 3, pick 1) -> repeat (45s ad = ~3-5 beats) -> approved clips to edit folder -> edit agent assembles to shot list, captions, music, aspect variants -> QA agent checks claims vs what the brand may legally say. Sub-agents: Pattern selector, Angle builder, Script writer, Prompt writer, Variant generator, Selection interface, Edit agent, Claim checker. Baseline: ad account hygiene. Human: script approval + clip selection per beat (taste, stays manual). Gate: S1+ low volume; volume engine S2+. Failure: generation quality & continuity -> build for retry; ship the script engine first ("scripts alone are worth paying for").
- SPLIT MCR brief [p11-12]: "hardest module to keep current; half has a working life under 12 months"; keywords: UGC ad structure, hook rate benchmark, thumbstop rate, creative testing framework, fatigue frequency threshold, ad creative psychology, static ad design, video ad script structure, 3-second hooks, Meta Ad Library research method, creative brief template, angle vs format, awareness-level creative mapping, winning ad teardown, creative volume per month; capture pattern structures beat by beat, hook types and when each works, benchmarks with sample, fatigue thresholds, volume by spend level, psychological principle (the part that doesn't go stale); 30-40 sources, 150-220 cards + start of the creative pattern library; skip swipe files with no analysis; done when 25-40 named creative patterns exist, each with structure, works-when and fails-when.

###### M18 Video & audio production, one approved scene at a time {CPV} [CPB M18/1-2 p19-20]
- Steps: (1) approve the story (hook, situation, demonstration, proof, objection handling, CTA; per beat spoken words, on-screen text, shot description, duration, product action, factual claim; no fixed beat count); (2) define continuity (product version, presenter/character, setting, lighting, props, camera conventions, colour, pronunciation, audio style; consent & permitted use for real people, voices, music); (3) produce scene one (small candidate set or real footage; reviewer chooses / targeted revision / changes route; unselected clip never becomes default); (4) next scene (approved references + continuity pack; independent shots in parallel, dependent wait); (5) review audio & image together (product action, labels, lip sync, voice clarity, pronunciation, music balance, truth of spoken claims; silent/captioned version); (6) assemble selected material (edit to argument, captions, controlled text, transitions, placement versions; keep stems); (7) review the final ad on intended device/placement.
- Equivalent human route: export script, shot list, product references, claim limits, continuity notes, pronunciation guide, aspect ratios, delivery requirements; creator returns footage into the same review states.
- Storyboard states: planned, producing, awaiting selection, approved, needs revision, invalidated. Review screen: side-by-side candidates, time-range marking, separate product accuracy / claim accuracy / continuity / audio / brand fit / taste; structured feedback ("keep this shot, replace the narration").
- Dependency invalidation: early scene change invalidates later dependent scenes/exports only; offer change invalidates copy, CTA, narration, LP promise, export approvals.
- Cost & latency controls: planned routes, candidate count, cost range, review demand, retry allowance, max spend, fallback; repeated fidelity failure -> switch route. Production-ready != campaign-ready.
- Acceptance demo: pause after scene 1, resume, replace reference, preserve unrelated selections, rebuild export from approved versions; reconcile provider timeouts before retry (no double billing).

###### M19 Meta operations (ADC; WGLL Module 13 ad copy & deployment) {PA} (copy sub-skills {CW})
- CPB decision: how should approved concepts be delivered, evaluated and funded within constraints [CPB M19/1 p55]. Steps: audit account context (objectives, optimisation events, structure, spend, delivery, creative families, destinations, measurement health; no universal structure); diagnose the constraint (weak attention, mismatched traffic, poor page comprehension, unsuitable offer, stock, measurement, economics); select play (bounded launch, creative investigation, budget adjustment proposal, destination repair, experiment); prepare campaign packet (assets, copy, product/offer versions, destination, naming/IDs, objective, budget, dates, targeting/placement, guardrails; policy & feature check); review & launch within authority (paused/draft first; states submitted, approved, delivering, stopped); monitor & learn (spend, delivery, measurement, stock, customer issues; mature outcomes).
- Outputs: campaign board linked to concepts and outcomes. Failure: scaling a cheap-purchase ad whose customers return the product; treating a favourable age breakdown as targeting proof.
- Ideas [CPB M19/2 p56]: concept coverage board (situations, objections, proof types, formats in current spend); fatigue investigation (exposure, audience mix, offer, stock, seasonality, page changes, measurement before new creative); cash-and-stock-aware plan.
- WGLL Module 13 [p16]: goal = write copy for each creative and push to ad account paused. Copy agent context: brand book, avatar, offer, creative, LP, past winning copy. Sub-agents: Primary text writer, Headline writer, Description writer, Policy checker, Naming convention agent, Deployment agent, Budget guard. Naming convention: every ad carries avatar, angle, pattern, offer (else no attribution, empty ledger). Deployment: structure built, creative uploaded, copy attached, targeting & budget set, everything paused; owner starts. Human: what goes live, at what budget. Gate: S1+. Failure: policy rejections that lock an account -> policy checker before upload, strict on health, finance, before/after.
- SPLIT ADC brief [p12-13]: account structure, Advantage+ Shopping, CBO vs ABO, budget scaling rules, consolidation vs testing campaigns, naming convention, health-claim policy, before/after policy, primary text length, DR copy frameworks, audience overlap, retargeting structure; capture structure rules, scaling percentages & cooldowns, policy limits by category, naming; 20-25 sources, 90-130 cards; skip structure content older than 18 months; done when account structure rules for 3 spend bands can be written and defended.

###### M20 Google Ads (GAD; WGLL Module 14) {PA}
- CPB decision: which demand to serve, with which product and destination [CPB M20/1 p57]. Steps: validate product representation (feed identity, variants, titles, images, prices, availability, destinations; Merchant Center consistency); intent map (brand, category, use-case, comparison, compatibility, informational; observed query vs inferred intent); inspect owned performance (campaign/query/product outcomes, cost, customer type, stock, contribution; captured vs incremental demand); find improvements (feed errors, product distinctions, destination fit, exclusions, missing content); controlled change (feed edits, copy/assets, settings, destination drafts + measurement plan); verify & measure (acceptance, served state, disapprovals; improved platform return != incrementality).
- Outputs: intent-to-product map, feed issue queue, query opportunity board, change packet. Handoff: query questions -> M11/M22; feed/product problems -> M12/M24; stock -> M25.
- Ideas [CPB M20/2 p58]: query-to-proof builder; feed improvement with explanation; demand-capture diagnostic (branded vs non-branded, then incrementality).
- WGLL Module 14 [p16]: sub-agents: Feed auditor, Shopping structure, Search term miner, Negative keyword agent, Match type strategy, Bidding strategy, PMax asset group builder, Brand vs non-brand separator. Good = non-brand cost per purchase reported separately (brand search hides the truth). Gate: S2+ (below, Meta is better use of money).
- SPLIT GAD brief [p16]: Shopping feed optimisation, PMax asset group structure, brand vs non-brand reporting, negative keywords, search term analysis, match types, shopping priority structure, PMax vs standard Shopping; collected with SEO last (weeks 22+).

##### 5.5 RETENTION, DISCOVERY AND POST-PURCHASE

###### M21 Lifecycle / email (EML; WGLL Module 15) {RT}
- CPB decision: what should this customer receive now, if anything [CPB M21/1 p59]. Steps: map lifecycle (discovery, consideration, cart, purchase, shipment, delivery, first use, ongoing use, replenishment, recovery; events, permission, timing, exits, unknown states); audit current messages (collisions, stale offers, post-purchase sends, reminders during unresolved problems, inconsistent facts; usefulness as well as attributed revenue); retrieve patterns by job, usage cycle, consideration, service need (durable product != consumable replenishment); create message alternatives (education, proof, fit help, care, replenishment, relevant offer; general fallback); simulate the flow (profiles, purchase exits, duplicate events, contact limits, complaint states, changed offers); release & measure (reachability, engagement, complaints, success, mature contribution; attributed != incremental).
- Outputs: visual journey with previews & branches; contact calendar of competing flows/campaigns. Handoff: replies & repeated questions -> M06/M23; product fact changes invalidate messages; campaign demand -> inventory planning.
- Ideas [CPB M21/2 p60]: first-success sequence; message collision resolver (unresolved delivery issue suppresses promos); useful next-purchase recommender ("nothing needed now" outcome).
- WGLL Module 15 [p16-17]: goal = flows, then calendar, then personalisation. Flows in build order: (1) Welcome, (2) Abandoned checkout, (3) Abandoned cart, (4) Browse abandon, (5) Post-purchase education, (6) Review request, (7) Replenishment, (8) Winback, (9) VIP. Sub-agents: Flow builder, Segmentation agent, Campaign calendar, Content writer, Deliverability monitor, List health agent, Revenue attribution agent. Post-purchase education "underbuilt everywhere", tied to Module 5 job-to-be-done. Campaign calendar: category seasonality (Module 2) + order history + retail dates -> 12-month calendar with brief per campaign. Baseline: authentication, welcome flow, abandoned checkout flow, working unsubscribe. Human: approve flows & calendar; emails arrive as unscheduled drafts. Gate: S1+; 3 flows at S1, full set by S3. Failure: sending more, earning less -> list health agent caps frequency per segment.
- SPLIT EML brief [p13]: Klaviyo flow structure, welcome, abandoned checkout timing, browse abandonment, post-purchase education, winback timing/offer, replenishment calculation, VIP segmentation, SPF/DKIM/DMARC, sunset policy, RFM, retail calendar, email revenue % benchmark, SMS vs email; 18-25 sources, 90-130 cards; skip subject-line listicles; done when all 9 flows are specified message by message with timing and conditions.

###### M22/SEO SEO & content (SEO; WGLL Module 16) {OG}
- CPB decision: what should customers be able to find, and which technical/content gaps prevent it [CPB M22/SEO/1 p61]. Steps: discovery foundation (crawlability, indexability, accurate product/category content, navigation, availability, working destinations); map intent & owned evidence (queries/pages, on-site search, questions, support issues, content); inspect outside coverage (competitor pages, guides, independent references; unanswered questions, original evidence; don't copy length); content & repair portfolio (product/category page, fit guide, testing documentation, care answer, technical fix); reviewed changes (verified facts, internal links, accurate structured data; redirects/consolidation context-specific); publish, observe, maintain.
- Outputs: query-question-product map, technical issue queue, editorial briefs (reader, original value, sources, destination, maintenance owner), linked content calendar. Failure: mass generic keyword pages.
- Ideas [CPB M22/SEO/2 p62]: answer coverage map (questions answered only in private support); proof-based editorial studio; content maintenance through the graph.
- WGLL Module 16 [p17]: goal = channel paying back over 6-12 months. Sub-agents: Technical crawler, Index & cannibalisation agent, On-page agent, Entity & topic gap agent, Content brief writer, Internal linking agent, Schema agent, Off-page agent, AEO agent. Baseline: technical health (indexability, unique titles, 1 H1, valid product schema, clean sitemap, no broken links) from day 1. Gate: S2+ with 6 months runway. Failure: publishing volume with no distribution (every brief states how it will be found).
- SPLIT SEO brief [p16]: ecommerce technical SEO checklist, collection page SEO, product schema, cannibalisation, internal linking, faceted navigation; 25-35 sources (GAD+SEO), 120-180 cards; done when the technical checklist is complete and AEO is honest about unknowns. Example of a "sharp" card: competing collection pages lose roughly 8-25% of impressions; consolidation takes ~60 days to show [SPLIT §A.1 p4].

###### M22/AEO Answer discovery (AEO agent in WGLL Module 16) {OG} [CPB M22/AEO/1-2 p63-64]
- Decision: can people and answer systems find an accurate, useful account of the brand and products (no guaranteed citations). Steps: define a question panel (category, comparison, suitability, care, purchase; locale, language, date, surface; include unsuitable-use questions); inspect observed answers (correctness, cited sources, omissions); trace information gaps (missing specs, contradictory pages, unclear entity, outdated offers, absent original evidence); produce improvements (product tables, explanations, demonstrations, comparisons, consistent merchant info; structured data = visible facts; no special-file shortcuts); re-observe & assess (observation study).
- Outputs: question-to-answer evidence board linked to product facts and correction tasks.
- Ideas: product truth discrepancy queue; evidence completeness view; suitability-first comparison library.
- WGLL AEO agent: entity clarity, complete structured data, extractable spec tables, direct Q&A coverage, third-party corroboration; metric = whether the brand gets cited by assistants for category questions. SPLIT: AEO sources thin and contested; revisit every 6 months; keywords answer engine optimisation, cited by AI assistants, LLM visibility, entity SEO.

###### M17/ORGANIC Organic content: owned learning & education pipeline {OG} [CPB CONNECTED M17/ORGANIC/1-2 p75-76]
- Steps: define the content job (discovery, explanation, trust, product use, customer story, community, service); gather owned & outside signals (posts, comments, questions, support, search, permitted creator observations; reach context); build recurring content families (demonstrations, comparisons, care, behind-the-scenes decisions, misunderstood facts, authorised customer experiences); small editorial slate (adapt an explanation across formats + one new question/format); produce & review via the same production pipeline as paid; publish, respond, learn (route service cases to support).
- Outputs: editorial board linked to graph: question -> concept -> asset -> publication -> response -> next task.
- Ideas: question becomes a content series; structured organic-to-paid bridge (paid concept from organic mechanism, retested); product-development listening board.

###### M23/DELIGHT Delivery & first use (CXP; WGLL Module 17) {RT}
- CPB decision: what helps the customer receive the right product and achieve the intended benefit; delight starts with reliability and reduced effort [CPB M23/DELIGHT/1 p65]. Steps: reconstruct the promise (product, variant, inclusions, delivery expectation, demonstrated use, choices); map operational events (accepted, packed, shipped, delayed, delivered, exception; owners); define first success (product-specific milestone; likely obstacles from returns/support/use); create the experience (updates, packaging/instructions, setup content, help, optional progress check; coordinate with lifecycle); design optional delight (insert, care tip, surprise, returning-customer recognition; cost, complexity, benefit; essential service never VIP-only); observe outcome (delivery reliability, first-use questions, returns, satisfaction, repeat).
- Outputs: promise-to-experience map with exceptions and first-success milestones. Failure: sending a gift while the delivery/product problem is unresolved; assuming every product should drive frequent repeats.
- Ideas [CPB M23/DELIGHT/2 p66]: first-success companion; promise monitor (delivery state vs promise; never call an estimate confirmed); useful loyalty laboratory (early access, guidance, accessory, convenient service, recognition vs points/gifts).
- WGLL Module 17 [p17-18]: goal = design experience from purchase to repeat customer. Sub-agents: Journey mapper (touchpoints order -> repeat, gaps), Unboxing designer (insert, note, gift, packaging options with cost), Comms agent (shipping & delivery message set with timing), Delight moments (ranked moments with cost per order), VIP agent (tier rules & benefits from order data; 5th order != 1st), Issue recovery (recovery playbooks with cost caps), Review engine (ask timing & format). "Delight is part of the offer": each item has cost per order and expected repeat-rate effect (a $1.20 insert paying back 4% repeat rate is worth it; a $6 gift is not). Baseline: accurate shipping/delivery messages, findable return policy, working review request, recovery path. Human: what the brand will pay per order. Gate: S2+. Failure: delight costing more than repeat revenue created.
- SPLIT CXP brief [p13-14]: post-purchase experience, packaging inserts, unboxing cost per order, shipping notification sequence, delivery satisfaction, returns process, review request timing, loyalty structure, VIP tiers, service recovery playbook, repeat purchase rate, subscription retention; 15-20 sources, 70-100 cards; skip delight ideas with no cost; done when every tactic has a cost per order and expected repeat-rate effect.

###### M23/SUPPORT Support & returns {CX} [CPB M23/SUPPORT/1-2 p67-68] (WGLL Module 17 "Issue recovery")
- Decision: correct, fair next action and what the business should learn; ticket closure is intermediate, resolution & prevention are outcomes. Steps: understand issue (message, authorised order/product context, prior contact, delivery state, policy; ask only remedy-changing questions); retrieve right procedure (troubleshooting, return/exchange, warranty, service; scope & authority); propose useful resolution (explanation, troubleshooting, replacement, refund, exchange, escalation; no endless retention scripts); review or execute within limits (standing policy for routine; decision packet for exceptions; confirm external action); verify customer outcome ("response sent" != "problem solved"); route cause upstream (spec, batch, supplier, image, page, offer, creative, fulfilment; prevention task with owner).
- Outputs: support workspace (context, proposed answer, policy/evidence, actions) + cause board grouping repeated issues. Failure: deflection optimised so unresolved customers vanish from the dashboard.
- Ideas: return-reason evidence map ("too small" = imagery / dimensions / wrong variant / preference); batch & promise anomaly watch; resolution rehearsal (wrong item, delayed parcel, damaged, unclear instructions, repeat contact).

##### 5.6 OPERATIONS AND FINANCE

###### M24 Sourcing & cost (COG; WGLL Module 18) {OP}
- CPB decision: which supply/cost change preserves customer value and improves the business; quoted vs realised savings; supplier claims vs verified quality [CPB M24/1 p69]. Steps: establish spec & cost basis (components, materials, quantities, units, tolerances, packaging, tooling, process; cost, terms, currency, freight, inspection, defects, lead time); normalise alternatives (equivalent spec & scope); generate improvement paths (payment terms, simpler packaging, waste, redesign, consolidated orders, lead-time flexibility, another supplier); assess quality & cash (samples, inspection, reliability, MOQ, inventory exposure, switching burden); negotiation or trial packet (evidence-based questions, comparable terms, tradeoffs, walk-away constraints, sample acceptance; never invent competing quotes); verify actual result (agreed terms, received quality, delivered costs, late shipments, downstream returns).
- Outputs: spec-linked cost tree, normalised quote comparison, negotiation drafts, sample/inspection board. Failure: cheaper quote reported as realised profit.
- Ideas [CPB M24/2 p70]: specification-to-cost map; comparable quote assistant; savings maturity ledger (proposed / quoted / agreed / realised).
- WGLL Module 18 [p18]: goal = cut landed cost without cutting quality; "an allied capability, not the core"; build after website + ads engine. Sub-agents: BOM builder (full BOM, cost per line), Cost benchmark (target cost per line with source), Supplier finder (alternates incl. upstream, capability evidence), Landed cost (freight, duty, insurance, handling, storage per route), Negotiation agent (negotiation brief + email drafts), Quality risk (risks, mitigation, sample plan). Good = BOM with target price + reason per line; negotiation brief with ask, trades, walk-away; customs data shows what competitors pay & who they buy from. Human: renegotiate / dual source / switch. Gate: S3+. Failure: cutting cost and raising returns -> gate on sample approval + 90-day return-rate watch. (CPB warns against treating shipment records as competitor purchase prices [CPB M24/2 p70].)
- SPLIT COG brief [p17]: BOM cost breakdown, should-cost, supplier negotiation, MOQ price breaks, Incoterms (FOB/EXW/DDP), landed cost, dual sourcing, customs-data supplier research, factory audit, QC inspection, tooling amortisation; 12-18 sources, 60-90 cards; done when a BOM with defended target price per line can be built.

###### M25 Economics & inventory {FN} (stock/ops {OP}) [CPB M25/1-2 p71-72; WGLL baseline "Economics"; SPLIT MEA]
- CPB decision: what can the business responsibly do next with its cash, stock and capacity; "the common commercial view used by every other module". Steps: reconcile actuals (orders, discounts, refunds, COGS, fulfilment, payment fees, service/returns, marketing; missing vs estimated vs actual; join costs by effective date and variant); map stock & commitments (inventory, reservations, incoming, lead-time uncertainty, supplier capacity, cash obligations; forecast receipt != stock); demand & service patterns (seasonality, promotions, channel changes, stockout-censored sales, returns, fulfilment limits); operating scenarios (maintain, grow, discount, replenish, defer, redirect demand); coordinate across modules (budgets, offers, recommendations, lifecycle, supplier tasks, delivery expectations; one initiative baseline); observe & update (forecast vs actual; preserve old forecasts).
- Outputs: contribution/cash/stock view with scenario controls and actionable queue. Failure: GP presented as cash, projected repeats as realised, unknown COGS as zero.
- Ideas [CPB M25/2 p72]: promotion feasibility preview; shared opportunity ledger (one initiative, one baseline); forecast learning view. Worked arithmetic: $18 contribution x 500 orders = $9,000 but needs $20,000 inventory payment now.

---

#### 6. Connected system (how the departments interlock)

##### 6.1 Events that create downstream work [CPB CONNECTED SYSTEM/02 p78] (candidate routines/triggers)
| Event | Work triggered | Control |
|---|---|---|
| Product specification changes | Review claims, images, pages, instructions, feeds, support answers | Only affected versions invalidated |
| Offer changes | Update ads, page, checkout, lifecycle, service terms | Authority tied to exact artifacts |
| Stock becomes constrained | Review campaign scope, recommendations, promotion, delivery promise | Incoming inventory != available |
| Returns rise for a cohort | Inspect fit, promise, product/batch, fulfilment evidence | Correlation != cause |
| Customer question recurs | Research, content, image, instruction proposals | Preserve context & privacy |
| Tracking becomes unreliable | Pause dependent conclusions & readouts; repair measurement | Independent research/drafts continue |
| Approved scene changes | Re-review dependent scenes & exports | Unrelated material stays approved |
| Source or permission withdrawn | Remove retrieval/use; review derived dependencies | Keep only permitted audit metadata |
- Shared work-item contract: owner, trigger, scope, input versions, required evidence, next action, completion condition, downstream dependencies; waiting reasons (access, review, physical sample, platform processing, outcome maturity). Avoid circular work (track producing event/version, dedupe).

##### 6.2 Worked journeys
- New brand with no owned winners (8 steps) [CPB CS/03 p79]: intake clarifies decision -> M02-M03 research tests need -> M04 + M24 verify solution & supply -> M06/M08/M09 define promise -> M10-M16 build first buying path -> M17 creative from hypotheses ("provisional concepts") -> bounded launch produces evidence -> first customers shape next work, M25 reconciles cash.
- Existing brand improving complete experience (8 steps) [CPB CS/04 p80]: M01 + M14 reconstruct evidence -> apparent pattern -> M23/M11/M12 inspect whole journey -> M17 retrieves five references -> coordinated initiative (2 close + 3 exploratory briefs + fit page section + accurate image) -> produce with review (image fidelity, video scene selection, creator can replace AI) -> M15/M16/M19 release & test chosen question (one baseline) -> later outcomes (returns) can change the decision.
- Follow one decision through the graph [CPB CS/01 p77]: baseline standards + conditional eligibility + brand evidence + reference patterns -> hypothesis & brief -> artifact & verified release -> customer outcome -> scoped evidence & next decision.

##### 6.3 The owner/founder/agency screens
- WGLL single screen, 5 blocks [WGLL §7 p21-22]: (1) Profit: GP/purchase this week vs last + 3 biggest movers; (2) Running: every live experiment (days running, progress to call, current read, expected profit if it wins, "not enough data yet"); (3) Waiting on you: approval stack ranked by expected profit, rows expand to draft + reasoning + cards cited + approve/edit/reject; deploy -> staging -> tests -> publish; (4) Found: new avatar candidates, competitor angles, demand shifts, slower page, supplier benchmark moved; (5) Blocked: missing permission, broken tracking, disconnected account, needed decision. Loop "look, approve, reorder, leave" <= 45 min/week.
- CPB founder home [CPB CS/05 p81]: business & customer health (contribution, cash/stock constraints, customer-experience measures with data-quality labels); needs a decision (bounded stack); in progress; new evidence; blocked (dependency + who resolves). Ranked by customer impact, commercial relevance, urgency, effort.
- CPB agency workspace: client status, deadlines, capacity, review queues, cost per useful output, results; roles strategist, researcher, designer, developer, account manager, client approver; private data scoped; cross-client learning only via permitted aggregation.
- Decision card: problem, evidence, proposed action, preview, customer benefit, commercial assumptions, cost, risks, scope, reviewer, next step; actions approve / edit / reject / defer / ask for evidence, with reason recorded.
- Creative workspace tabs: Our results, Outside references, Patterns, Ideas, In production, Learning [CPB OM/04 p10]. Graph interactions: click pattern -> examples; click objection -> ads/pages/support addressing it; "show different formats using this principle"; "show failures"; "what depends on this claim?".

---

#### 7. Data objects (records the system keeps)

##### 7.1 CPB essential records [CPB BUILD PATH/01 p83]
Source & source version; sub-source & evidence chunk; reviewed card & play; brand / product / variant / offer; customer observation & job; pattern / reference / concept; script / scene / asset / page; task / run / approval / release; experiment / outcome; issue & constraint. Stable IDs, explicit relationships, revisions.
- System layers: Experience (workspaces, gallery, graph, previews, review, learning views); Workflow (play selection, bounded workers, human waits, production, release, recovery); Knowledge (sources, chunks, cards, plays, patterns, conflicts, review); Brand data (products, offers, customer context, assets, events, snapshots, costs); Learning (experiments, operational results, customer outcomes, revised interpretations).
- Storage: reliable storage for originals/artifacts/snapshots; transactional records for identity/state/authority; searchable indexes (rebuildable); graph views derived from typed relationships.
- Connector contract: actual read / draft / write / verify capabilities per connected account, with version, permissions, rate limits, data semantics, fallback; import/export & human handoff; "MCP can expose tools; it does not replace storage, snapshots or reliable action handling".

##### 7.2 SPLIT data model (Postgres tables) [SPLIT §B.3 p19-22]
- sources (id like AVT-0042, modules[], title, author, org, url, url_hash, platform, format, published_at, captured_at, tier 0-4, length, language, why_included, likely_baseline, kevin_confidence, raw_path, content_hash, status, processed_at, card_count, error)
- sub_sources (source_id, ordinal, heading, text, char/time spans)
- claims (sub_source_id, text, stated_conditions, spans, extracted_by, status new/carded/rejected)
- cards (id like crd_lpg_0412, module, scope baseline|conditional, version, claim, mechanism, metric, conditions jsonb, expected_effect jsonb {direction, range, horizon, confidence}, effort, reversibility, risk, tier, claim_ids, source_ids, supersedes, superseded_by, open_conflicts, valid_from/to, review_due, tags, embedding, status draft/review/active/retired, reviewer)
- checks (baseline cards with code: card_id, module, severity blocker|major|minor, detector_key, params, message_template, fix_template, requires_connection [shopify, ga4, meta], status)
- conflicts (card_a, card_b, kind scope|stale|definitional|genuine, status, resolution, reviewer)
- plays (id, version, module, goal, watches = exactly 1 metric, preconditions, fallback_play_id, steps, expected_effect, cost_estimate, card_ids, outcome_ids, status, approved_by)
- brands; brand_profile (stage, stage history, category, aov_band, margin_profile, signal_quality, stack, constraints, archetype)
- connections (provider, scopes, status, last_sync, credentials_ref pointer only)
- snapshots (provider, dataset, pulled_at, params_hash, row_count, storage_path)
- runs (mode audit|growth, play_id/version, context_hash = card ids + versions + snapshot ids, tokens, cost_usd); run_steps (agent, tool, model, refs, tokens, status)
- findings (audit output: check_id, pass|fail|na, severity, evidence, fix_ref, owner_marked_na, na_reason)
- artifacts (type page|ad|email|report|code|creative, payload_ref, preview_url, status draft|approved|rejected|staged|published, expected_profit, approver)
- experiments (artifact_id, play_id, hypothesis, metric, design, baseline, started/readout, result, decision)
- outcomes ("the asset"; append-only; archetype, play_id/version, effect_size, confidence, superseded_by)
- patterns (creative pattern library: format, duration_band, hook_archetype, structure, principle, works_when, fails_when, evidence, reference_ids pointing to an internal study bucket that generation pipelines cannot read)
- Source drop format: `/ecomos-sources/sources.csv` + `/{MODULE}/{MODULE}-{0001}/source.md + meta.yaml + /assets/` [SPLIT §0.3 p2-3].

##### 7.3 Business-object schemas named in WGLL/CPB
- Avatar record (WGLL §4 M5): name, demographic sketch, pains, goals, desires, fears, trigger moment, JTBD, objections, words they use, proof needed, status.
- Offer card (WGLL §4 M6): promise, mechanism, price & terms, guarantee, objection killed, expected CVR & AOV effect, margin math (child of avatar).
- Brand book (WGLL §4 M7): structured fields (voice guide w/ 20 examples, banned words, claim limits, reading level, visual rules, positioning, asset pack).
- Page structure library entry (WGLL §4 M9): page type, section order, section jobs, copy principles, suited avatar & offer.
- Creative pattern (WGLL §4 M12): format, duration band, hook type, beat structure, principle, works-under, fails-under, evidence.
- Creative brief (CPB M17/3): 15 required fields listed in 5.4.
- Approved product pack (CPB M17/4): views, dimensions, materials, colours, packaging, inclusions, variant mapping, brand rules, offer, permitted claims, immutable attributes.
- Decision packet (CPB OM/07) and decision card (CPB CS/05); work item (CPB CS/02); play (CPB OM/06 / SPLIT); metric dictionary (SPLIT Part C; CPB M14).
- Stage score (WGLL §2.1) and brand archetype (SPLIT brand_profile.archetype).

---

#### 8. Build split: human vs AI vs software

##### 8.1 Who owns what
- SPLIT core rule: Kevin owns what is true (knowledge collection, judgment, tiers, contradictions, stage thresholds, metric definitions); Colin owns how it runs (ingestion, cards, retrieval, agents, connectors, app) [SPLIT p1].
- Decision rights table [SPLIT §0.4 p3]: sources ingested - Kevin; source tier - Kevin; baseline vs conditional - Kevin from Colin's suggestion; contradiction resolution - Kevin; stage thresholds & capability gates - Kevin; metric definitions - Kevin; first module - both (Kevin value, Colin feasibility); DB schema, retrieval design, model routing & cost, what ships and when - Colin; card schema - Kevin meaning, Colin types.
- What neither does [SPLIT §0.5 p3]: Kevin writes only the first 50 gold cards by hand; Colin does not auto-resolve contradictions until >= 300 labelled decisions (then only definitional merges & staleness); no baseline check ships without a code detector + Kevin's counter-case review.
- Weekly rhythm [SPLIT §0.6 p4]: Mon Kevin drops source pack / Colin kicks intake; Tue collect / pipeline runs; Wed collect / build; Thu Kevin clears review queue 2-3h / build; Fri joint eval review 45 min / ship + eval report. Friday metrics: sources ingested, cards written, conflicts raised/cleared, golden-set eval scores, acceptance rate at approval gate per play, cost per run. Blocked protocol: what, who can unblock, cost per day; nothing blocked silently > 3 days.
- CPB Kevin's work (6 steps) [CPB BUILD PATH/02 p84]: scope one useful workflow; assemble an evidence pack (sources with locators & allowed use, platform procedures, owned facts, good & bad executions, counterexamples); write the dossier (purpose, foundation, conditional methods, procedure, inputs, outputs, examples, failure cases, unknowns, evaluation questions); draft a small reference set (exemplary cards, one complete play, good/bad outputs); review candidate knowledge (approve, correct, split, merge, reject, mark contested); evaluate output (specificity, usefulness, commercial logic, factual support, edits; label earliest failure). Collect first for pilot: M01/M14/M25 definitions; M06 situations; M08/M09 promise & brand; M11/M12 page & imagery; M17/M18 creative patterns & production examples; M23 expectation/return evidence. Handoff: dossier, source register, permitted originals, annotated examples, open questions, expected outputs, evaluation cases.
- CPB Colin's work (7 steps) [CPB BUILD PATH/03 p85]: record & access foundation (stable IDs, versions, tenant boundaries, allowed uses, unknowns; credentials outside knowledge & context); ingestion & review; graph & retrieval behaviour (baseline coverage, eligibility, typed relationships, access filtering, explanations); one complete production path (brief -> artifact -> review -> handoff/preview -> verification; human & AI routes share contract); durable action handling (persistent state, version-bound authority, budgets, idempotency, read-back, recovery); measurement & learning records; operate & test (costs, quality, freshness, errors, drift, review burden). Joint: scope, acceptance criteria, release readiness; merchant retains authority over publication, spend, commitments.
- Human decisions retained in every workflow (CPB "Human decision" lines and WGLL "Human decision"): goal and next work package (M01); thesis/market/category/product/price choice (M02-M04); expansion commitment (M05); which situations/avatars guide work (M06-M07); offer terms & test scope (M08); brand direction (M09); accounts, commercial configuration, launch authority (M10); argument & final page approval (M11); factual image accuracy (M12); tradeoffs/app removal (M13); measurement interpretation or repair (M14); test priority & adoption (M15); exact release authority (M16); slate & spend envelope, script approval & per-scene clip selection (M17-M18); strategy & spend (M19-M20); message purpose, tone, offers, contact policy (M21); SEO priorities, original expertise, publication (M22); experience design, remedy authority, per-order spend (M23); ambiguous/sensitive support cases & policy (M23); supplier engagement, sample acceptance, commitments (M24); purchase commitments, budgets, risk (M25).
- AI does (per WGLL): extraction, formatting, drafting, ranking, generation of options, audits, verification; cheap models extract/format, flagship models judge [WGLL §3 p4].
- Software does (per SPLIT): durable workflows, snapshots, detectors, scope-whitelisted writes, tenancy, eval harness.

##### 8.2 SPLIT non-negotiables [SPLIT §B.1 p18]
1 Upload rights, never publish rights (enforced in connector scope whitelist, not prompt); 2 every output cites card IDs or data rows (critic flags); 3 agents run plays, never invent them (plays are versioned approved rows); 4 reason over snapshots, never live calls; 5 no growth run until baseline blockers clear; 6 tenant isolation from day 1.

##### 8.3 Stack [SPLIT §B.2 p19]
Python 3.12; FastAPI; Postgres 16 + pgvector (no warehouse until 50 brands); S3 or R2 object storage; Temporal or equivalent durable workflow engine ("single most important stack choice": growth runs pause at human gates for days and wait 60 days for readouts); Redis; Playwright (crawling, speed audits, test purchases); Next.js app (review queue, audit report, approval stack); flagship vs small models. CPB defers all technology selection until pilot behaviour is clear [CPB BUILD PATH/01 p83].

##### 8.4 Ingestion pipeline: 10 stages [SPLIT §B.4 p22]
1 Intake (validate meta, dedupe url_hash/content_hash, raw to storage; no model); 2 Normalize (clean transcript artefacts, strip sponsors, keep numbers/timestamps; small); 3 Segment (sub-sources by topic; small); 4 Extract claims (assertion + nearby condition + char spans; small; "where quality is won or lost"); 5 Vocabulary (rewrite against metric dictionary; small); 6 Write cards (1 claim per card, 350-500 tokens; mid); 7 Classify scope (counter-case prompt vs Kevin's flag; mid); 8 Embed; 9 Detect conflicts (nearest 20 active cards same module & metric; flagship); 10 Queue (conflicts, scope disagreements, 10% random sample to Kevin).
- Kevin's capture workflow (6 steps, 15-25 min/source, keep ~1 in 4): find, screen (numbers, sequences, conditions in first 2 minutes), capture (transcript/article -> source.md), log (meta.yaml, tier, modules, reason), flag (likely_baseline), drop [SPLIT §A.3 p5]. "Would a good model already say this? If yes, skip it."; capture specific numbers, sequences, conditions, exceptions, recency [SPLIT §A.1 p4]. 50 gold cards (15 baseline, 35 conditional; MEA/AVT/OFF/LPG): one claim, one mechanism, one metric, explicit conditions or baseline mark, a number, a named source [SPLIT §A.6 p17].
- Review queue screen [SPLIT §B.5 p22-23]: side-by-side cards, tier/author/date visible, model's conflict-kind suggestion, 4 buttons (add scope, supersede, merge, mark contested) with shortcuts, sort by impact, target 60-100 decisions/hour.

##### 8.5 Retrieval [SPLIT §B.6 p23]
1 SQL filter (module, active, all baseline + conditional cards whose conditions match brand profile); 2 freshness & tier (drop past valid_to, demote past review_due, sort T0-T4); 3 size check (<40 cards -> pass all, no vector search); 4 hybrid BM25 + vector; 5 cross-encoder rerank, cap 12-15 conditional + all relevant baseline; 6 return IDs for citation. (CPB replaces fixed counts with measured context budget + required coverage; validity, access, use permission precede ranking; diversity in the selection objective [CPB VISION/03 p5; VALIDATION/03 p90].)

##### 8.6 Orchestrator & play runner (12 steps) [SPLIT §B.8 p24]
1 load brand state (profile, connections, recent runs, open experiments, rejected recommendations); 2 compute/refresh stage; 3 check baseline blockers (growth mode stops); 4 select plays whose preconditions are met (fallback plays otherwise); 5 rank by expected GP impact / effort; 6 sequence by dependency (no CRO before tracking verified; no scaling before creative volume); 7 allocate token & wall-clock budget per step; 8 execute steps (sub-agent or tool calls); 9 critic pass (citations, arithmetic, policy, consistency); 10 route to human gate (workflow sleeps, possibly days); 11 on approval execute writes / on rejection record reason as training data; 12 snapshot baseline, register experiment, schedule readout. Orchestrator never authors plays, improvises steps, calls external tools directly, writes customer-facing copy, or concludes below thresholds ("not enough data yet" is valid).

##### 8.7 Model routing [SPLIT §B.9 p24-25]
Flagship (conflict adjudication, play selection, anomaly interpretation, final synthesis, critic) 10-15% of tokens; Mid (long document reading, card writing, briefs, copy drafts, creative scripts) 25%; Small (claim extraction, tagging, classification, tool-call formatting, diffs, metric watching) 60%; Dedicated (embeddings, reranking). Cost rule: growth run cost must be <= monthly fee / 20.

##### 8.8 Connectors (build order) [SPLIT §B.10 p25]
1 Shopify (orders, products, COGS, themes, discounts; draft-theme writes via Asset API); 2 GA4; 3 Playwright crawler; 4 PageSpeed Insights + CrUX; 5 Meta Marketing API (creative-level performance + PAUSED creation); 6 Google Search Console; 7 Klaviyo (drafts); 8 Google Ads (later). Interface `pull(params) -> Snapshot`; replay mode for tests; write paths behind scope whitelist that cannot call publish endpoints; audit log every write.

##### 8.9 Outcome ledger, eval, security [SPLIT §B.12-B.14 p26]
- Ledger: append-only; baseline snapshot before change; result at play's horizon on its 1 metric; tagged with archetype not brand name; failures recorded; feeds play ranking, card confidence, contradiction resolution, archetype priors.
- Eval harness (week 4): 30-50 golden tasks per pipeline (anonymised snapshots + Kevin's expert output); runs on every prompt/card/play/model change; scores coverage, precision, citation validity, factual safety vs T1, condition capture; key production number = acceptance rate at the human gate per play per version.
- Security: Postgres row-level security on brand_id; secret store; no cross-tenant retrieval; aggregation only via archetype layer; full write audit log; real deletion path.
- Definition of done per component [SPLIT §B.16 p27]: connector (pull, snapshot, replay, rate limits, typed errors); detector (pass/fail/na on 3 fixture stores with evidence); audit run (Kevin agrees with list for unseen store); ingestion (folder drop -> reviewed cards in < 1 hour of Kevin's time); retrieval (Kevin's picks on 80% of golden tasks); orchestrator (survives 5-day human-gate pause); draft & publish (no code path publishes without an approval row); outcome ledger (a readout changed a play ranking automatically).

##### 8.10 Build sequences (three versions)
- WGLL phases [WGLL §6 p20-21]: wedge = persona -> page -> ad. Phase 1 (wk 1-3) foundation: metric dictionary, card/play/brand profile/avatar/offer schemas, evidence tiers, stage model, 50 hand-written cards, 3 complete plays. Phase 2a (wk 3-5) baseline layer + audit run (80-120 baseline cards; "connect Shopify + GA4, get a real list of broken things in under 10 minutes" = demo, onboarding, first paid product). Phase 2b (wk 5-8) card factory for Modules 5, 6, 9 only (400-700 conditional cards). Phase 3 (wk 7-13) wedge end to end: connect Shopify, GA4, Meta; Modules 5, 6, 9 with orchestrator, 6-8 sub-agents, critic, draft/approve; 3 design partners at S2/S3; done at >70% acceptance. Phase 4 (wk 13-18) Module 12 script engine & image pipeline, Module 13 paused deployment, Module 11 experiment engine with test-purchase loop; ledger starts filling. Phase 5 (wk 18-26) Modules 10, 15, 7, 17. Phase 6 (wk 26+) Modules 1-4, 14, 16, 18, multi-tenant & agency layer. Cut from first 6 months: video generation & stitching, data warehouse, all 18 modules (ship 6), self-serve signup (onboard first 20 by hand).
- SPLIT collection order [SPLIT §A.4 p5-6]: wk 1-2 MEA baseline + 50 gold cards; 2-5 AVT, OFF, LPG (wedge); 5-8 SPD, CRO, SET (site side); 8-12 MCR, ADC (ads side); 12-16 EML, CXP, BRD (retention); 16-22 MKT, CAT, PRD, EXP (research); 22+ GAD, SEO, COG. Running totals [SPLIT §A.8 p18]: gold+MEA 20 sources/140 cards wk2; wedge 100/600 wk5; site 140/780 wk8; ads 190/1,050 wk12; retention 240/1,300 wk16; research 300/1,600 wk22; full library 340/1,900 wk26.
- SPLIT engineering build sequence [SPLIT §B.15 p26-27]: wk 1-2 schema, migrations, storage, secrets, tenancy, Shopify + GA4 connectors with snapshots; 2-4 detector framework, 6 blocker detectors, crawler, PSI, audit run end-to-end; 4-6 eval harness, ingestion 1-5, review queue; 6-8 card writer, scope classifier, embeddings, conflict detection, remaining 9 detectors; 8-11 retrieval, Temporal, orchestrator, first 3 specialists, critic, draft/stage/verify/publish; 11-14 growth run for wedge, approval stack UI, experiment registration; 14-18 outcome ledger, Meta paused creation, pattern library, script engine; 18-26 email, speed, brand book, post-purchase, agency layer. Part C first 2 weeks: Kevin metric dictionary (wk1) + 50 gold cards & baseline list as cards (wk2); Colin schema + connectors (wk1), detector framework + 6 blockers + plain-text audit report (wk2); both run the audit on a real store.
- CPB build path [CPB BUILD PATH/04-05 p86-87]: completion gates not calendars. 7 steps (Kevin prepares / Colin makes possible): 1 choose the pilot; 2 establish truth; 3 create reviewed knowledge; 4 diagnose & propose; 5 produce usable work (page/imagery packet, creative scripts, designer route, optional generation); 6 verify a supported change; 7 learn from the result. Proposed pilot: customer evidence -> page and creative (one existing product; page improvement + production-ready creative briefs; human creator route first; tenant boundaries from first record); alternative: new-brand research pilot or SEO pilot. Exit gate: complete example, evidence, correction, verified result, stated learning. Expansion sequence: (1) deepen creative intelligence; (2) improve production (images, sequential scenes, audio, creator handoffs, retries); (3) close the operating loop (campaign execution, experiments, lifecycle, support/returns, inventory); (4) broaden discovery & growth (Google Ads, organic, SEO/AEO, research, expansion, sourcing); (5) scale collaboration & self-service (agency capacity, permissions, shared methods, onboarding, billing, analytics). Gate questions for every capability: reuses facts & lineage? actionable output? explains missing evidence? human can take over? customer benefit visible? quality & cost measurable? no unsupported platform assumptions? Defer: elaborate graph viz, graph DB, warehouse, automatic cross-client learning, unrestricted autonomous publishing, high-volume video generation.

##### 8.11 Productisation of the OS itself [CPB PRODUCT DECISIONS p94]
- Package around complete jobs: customer-to-page-and-creative service; verified storefront improvement loop; creative intelligence & production workspace. Measure own economics (onboarding, source review, model & generation cost, human correction, support, storage, integration maintenance; cost per accepted artifact and per verified workflow). No outcome-based guarantee initially.
- Decisions before implementation: first customer type & pilot job; data/fact access; first reviewable artifact; outcomes & failure conditions; which actions stay manual; research/production/review envelope.
- WGLL: "S3 is where the product earns its highest fee"; audit is the first paid product; first 3 design partners at S2/S3; "what I need from you next": product research KB (40-60 pages) + avatar/offer/LP material, metric vocabulary, design partner confirmation [WGLL §2.2 p3; §6 p20; end p22].

---

#### 9. Data sources to plug in [WGLL §5 p19-20]
- Demand & trends: Google Trends (free, unofficial API: slope, seasonality, regional), Google Keyword Planner (API with ads account: volume, intent), Amazon best sellers & movers (scrape/3rd-party API), Keepa-style rank & price history (paid API), Jungle Scout / Helium 10 (paid API: revenue per listing), Exploding Topics (paid), TikTok Creative Center (free/scrape), Reddit (official API, paid tiers: complaints, language, off-label uses), YouTube comments (API).
- Competitive: Meta Ad Library (what competitors run & for how long), Google Ads Transparency Center, SimilarWeb (traffic mix), Semrush/Ahrefs (keywords, backlinks, gaps), Shopify app store reviews (apps competitors depend on), Wayback Machine (page change history). (Access column garbled in extraction.)
- Supply & cost: ImportYeti / Panjiva (who competitors buy from, volumes), Alibaba & 1688 (supplier discovery, price bands), freight rate indices (landed cost), customs tariff schedules (duty by HS code).
- Owned account data: Shopify (orders, COGS, margins, customer history), GA4 (sessions, behaviour, funnels), Google Search Console, Meta Marketing API (creative-level performance), Google Ads API, Klaviyo, CrUX & PageSpeed Insights (free), Gorgias/Zendesk ("best voice of customer source most brands ignore"), review platforms.
- Benchmarks: category, platform, payment provider reports = tier 2 priors replaced by own data.
- CPB access cautions: Google Trends relative only [R01]; GA thresholding [R02]; YouTube captions need edit rights [R07]; Reddit commercial API agreement [R08]; Meta Ad Library/insights breakdown coverage unverified [CPB REFERENCES/2 p97].

---

#### 10. Validation, stress tests and failure modes

##### 10.1 CPB synthetic stress tests T01-T24 (all passed on a 24-case reference model; 200 synthetic references) [CPB VALIDATION/02-04 p89-91] (useful as catalogue acceptance tests)
- Foundation/readiness/economics: T01 broken image fails at $0 and $100M revenue; T02 no storefront -> awaiting setup; T03 surface exists, evidence missing -> unverified; T04 large brand new SKU 1,400 obs -> research/redesign route; T05 invalid purchase measurement -> dependent experiment to repair; T06 missing cost -> contribution unknown; T07 300->360 orders, $9,000 -> $7,920; T08 sample size 13,914/arm.
- Retrieval: T09 separate age/gender & placement reports -> no combined segment; T10 Simpson's-paradox reversal detected; T11 public engagement = reference not winner; T12 adaptive delivery stays observational; T13 study-only permission excludes generation; T14 other tenant records removed pre-ranking; T15 inactive/unapproved excluded; T16 157 of 200 survive filters, 5 distinct families selected (REF-109 guide, REF-009 demonstration, REF-044 routine, REF-179 objection, REF-114 contrast).
- Coordination: T17 scene-one change flags scenes 2-3 & export, keeps music; T18 offer change hits script, copy, page, email, media; T19 v1 approval invalid for v2; T20 unresolved complaint suppresses promo; T21 stock 3 < 10-unit commitment blocked; T22 later quality failure blocks winner status; T23 duplicate action -> one write; T24 one $1,200 shared benefit, not $3,600.
- Numerical trap (Simpson's paradox) [CPB VALIDATION/05 p92]: A beats B in both groups (3.0% vs 2.5%; 0.9% vs 0.8%) but aggregate B 2.31% > A 1.60%.
- Future evidence levels: component checks -> workflow evaluation across domains -> usability & production testing -> controlled operational pilot (read-only first) -> customer & business validation [CPB VALIDATION/06 p93].

##### 10.2 WGLL "what will go wrong" [WGLL §8 p22]
Generic output (biggest risk; quoted evidence, card/data citations, critic rejects uncited); knowledge that ages (review dates per domain); mis-sorting the 2 layers (counter-case test; owner can mark n/a); calling winners on noise (stopping rules); owner overwhelm (approval stack capped: show 10 not 100); attribution restatement (snapshot every number); scope (18 modules described, ship 6).

##### 10.3 Per-module failure modes (catalogue guardrails)
Collected in Part 5 ("Failure" lines). Most reusable: offer raises CVR but destroys margin; demographic avatars without jobs; Lighthouse chasing; calling winners on noise; policy rejections locking ad account; sending more earning less; volume content without distribution; delight costing more than repeat revenue; cheaper quote reported as realised saving; GP presented as cash; attributed revenue summed across platforms.

---

#### 11. Where the three docs disagree (CPB is the latest and explicitly overrides) [CPB VISION/03 p5]
| Topic | WGLL / SPLIT position | CPB consolidated decision |
|---|---|---|
| North star | Gross profit per purchase, every rec carries GP effect | No single metric; contribution, customer outcomes, agency efficiency; per-workflow primary metric + guardrails |
| Stages | Fixed S0-S5 thresholds gate channels/tests; 400 conv/mo for A/B | Stage labels for navigation only; eligibility by actual data/capability/economics; eligible/ineligible/unknown |
| Baseline | Pass/fail with no conditions | Independent of revenue but needs a relevant surface; missing evidence = unverified |
| Generic knowledge | Skip what a good model already knows [SPLIT §A.1] | Keep a compact explicit foundation checklist; model memory is not a completion record |
| Evidence tiers | T0 own outcomes outrank; undated -> T4 | Separate dimensions; claim-by-claim relevance; missing date triggers review, not automatic worthlessness |
| Metric vocabulary | Collapse CPA/cost per purchase/CAC to 1 term [SPLIT §B.4] | Keep event, attribution scope, new-customer denominator, cost scope explicit |
| Agents | One agent one metric; agents never invent plays | Bounded responsibility + primary metric + guardrails; exploration may propose plays that return to review |
| Retrieval | Pass all if <40, cap 12-15 conditional | Measured context budget + required coverage; test retrieval choices |
| Publishing | Upload never publish, permanently | Draft-first initially; later explicit standing authority with limits, verification, audit trail |
| Timelines | 18/26-week phased plans; numeric targets (70% acceptance, 60-100 decisions/h, 55-65% scope conflicts) | Completion gates; numbers treated as planning hypotheses |
| First pilot | Persona -> page -> ad wedge (Modules 5, 6, 9) after baseline audit | Foundation audit + customer-to-page-and-creative pilot (SEO or new-brand research as alternatives) |
| Images | >= 6 images; fixed 10-slot template | Image roles chosen per buying question; no universal count |
| Competitor customs data | "Single strongest lever" (what competitors pay) [WGLL M18] | Shipment/directory records are not evidence of competitor purchase prices [CPB M24/2] |

---

### Proposed workflow/agent library in these docs

Everything below is named in the docs and is a candidate catalogue item. "Level" is my suggested catalogue level (prompt/skill/routine/workflow/agent/system). Proposed names are kebab-case suggestions.

#### A. Top-level workflows (CPB M01-M25 + connected workflows) - level: workflow
| CPB id | Proposed name | Area | Source | One line |
|---|---|---|---|---|
| M01 | business-intake-constraint-finder | ST | CPB M01 p23 | Brief + imports + journey + foundation + competing diagnoses -> prioritised opportunity queue |
| M02 | market-research-entry-theses | RS | CPB M02 p25; WGLL M1 | Demand evidence, tensions, entry theses, cheapest disconfirming test |
| M03 | category-research-solution-tree | RS | CPB M03 p27; WGLL M2 | Solution tree, comparable evidence, exclusions, scorecard -> product brief |
| M04 | product-research-spec-and-sample | OF | CPB M04 p29; WGLL M3 | Requirements -> concepts -> feasibility -> sample protocol -> verified fact pack |
| M05 | expansion-vs-improvement | OF | CPB M05 p31; WGLL M4 | Portfolio map, adjacency hypotheses, cost/cash scenarios, "do not expand yet" |
| M06 | customer-intelligence-jtbd | RS | CPB M06 p33; WGLL M5 | VOC corpus -> coded buying situations -> evidence-backed job profiles/avatars |
| M07 | untapped-situation-explorer | RS | CPB M07 p35; WGLL M5 | Workarounds, off-label and nonbuyer evidence -> exploratory hypotheses |
| M08 | offer-builder-and-economics | OF | CPB M08 p37; WGLL M6 | Promise inventory, value gap, alternatives, contribution scenarios, consistent offer packet |
| M09 | brand-system-builder | BF | CPB M09 p39; WGLL M7 | Extract identity, positioning, structured brand record, fixed vs flexible, touchpoint validation |
| M10 | store-launch-setup | WS | CPB M10 p41; WGLL M8 | Ownership, catalogue, payments, shipping, comms, tracking, tested buying path, launch |
| M11 | landing-page-builder | WS | CPB M11 p43; WGLL M9 | Context -> diagnose -> page patterns -> argument -> draft -> review/handoff |
| M11-C | shopper-assistance-commerce | WS | CPB p73 | On-site search, navigation, selectors, cart/checkout clarity |
| M12 | pdp-image-set-planner | CPS | CPB M12 p45; WGLL M9 | Buying-question -> image role map, shot plan, fidelity checks, controlled release |
| M13 | site-speed-repair-loop | WS | CPB M13 p47; WGLL M10 | Field+lab measure, cause, repair options, founder+dev reports, verify |
| M14 | measurement-health-and-reconciliation | FN | CPB M14 p49; SPLIT MEA | Metric dictionary, transaction validation, reconciliation, snapshots, readiness |
| M15 | cro-experiment-engine | WS | CPB M15 p51; WGLL M11 | Diagnose, hypothesis, method choice, power plan, release, decision readout |
| M16 | store-release-verify | WS | CPB M16 p53; SPLIT B.11 | Capability check, preview, review, measurement check, version-bound authority, read-back |
| M17 | creative-intelligence-pipeline | CS | CPB p15-22; WGLL M12 | Past creatives -> references -> variant briefs -> production -> learning |
| M17-O | organic-content-education-pipeline | OG | CPB p75 | Content jobs, families, editorial slate, publish/respond/learn |
| M18 | sequential-video-scene-production | CPV | CPB M18 p19; WGLL M12 | Script -> continuity pack -> scene-by-scene generate & select -> assemble -> final review |
| M19 | meta-campaign-operations | PA | CPB M19 p55; WGLL M13 | Account audit, constraint diagnosis, play, campaign packet, paused launch, monitor |
| M20 | google-ads-intent-to-product | PA | CPB M20 p57; WGLL M14 | Feed validation, intent map, owned performance, controlled changes, brand/non-brand split |
| M21 | lifecycle-flow-designer | RT | CPB M21 p59; WGLL M15 | Lifecycle map, message audit, alternatives, flow simulation, release & measure |
| M22-S | seo-discovery-program | OG | CPB M22 p61; WGLL M16 | Technical foundation, intent map, content/repair portfolio, maintain |
| M22-A | aeo-answer-accuracy | OG | CPB M22 p63; WGLL M16 | Question panel, observed answers, gap tracing, improvements, re-observe |
| M23-D | post-purchase-delight-first-use | RT | CPB M23 p65; WGLL M17 | Promise reconstruction, ops events, first-success milestone, optional delight |
| M23-S | support-returns-root-cause | CX | CPB M23 p67; WGLL M17 | Understand, procedure, resolution, execute within limits, verify, route cause upstream |
| M24 | sourcing-cost-reduction | OP | CPB M24 p69; WGLL M18 | Spec & cost basis, normalised quotes, improvement paths, negotiation packet, realised savings |
| M25 | economics-cash-inventory-planner | FN | CPB M25 p71 | Reconciled actuals, stock & commitments, scenarios, cross-module constraints |
| - | baseline-store-audit | ST | WGLL §3; SPLIT B.7 | Audit run: 62 pass/fail checks with severity & fix (first paid product) |
| - | growth-run-experiment-ranking | ST | WGLL §3.1; SPLIT B.8 | Stage-layer run producing ranked experiments (after blockers cleared) |

#### B. Creative sub-workflows (M17/M18) - level: workflow/skill
| Name | Level | Area | Source | One line |
|---|---|---|---|---|
| past-creative-intelligence-layer | workflow | AN | CPB M17/1 p15 | Reconstruct asset families, freeze windows, breakdowns, annotate, link downstream outcomes |
| reference-contender-shortlist (5 from 200) | skill | CS | CPB M17/2 p16 | Multi-path retrieval + diversity -> 5 differentiated contenders with transfer rationale |
| variant-portfolio-briefs (2 close + 3 different) | skill | CS | CPB M17/3 p17 | Five briefs A-E with the 15 required brief fields |
| image-ad-production-with-designer-route | workflow | CPS | CPB M17/4 p18; WGLL M12 | Product pack -> communication brief -> route -> generate/delegate -> layered review -> export |
| angle-matrix-builder | skill | CS | WGLL M12 p15 | Pattern x angle x awareness level matrix -> image brief per cell |
| competitor-organic-observation-digest | routine | CS | CPB M17/5 p21 | Watchlist capture -> role -> mechanism -> transfer -> original brief digest |
| creative-test-readout-and-writeback | workflow | AN | CPB M17/6 p22 | Pre-registration, delivery monitoring, readout categories, cautious write-back, next slate |
| video-script-engine | skill | CW | WGLL M12 p15-16 | Full script tied to 1 avatar + 1 offer ("ship first; scripts alone worth paying for") |
| beat-by-beat-video-generation | workflow | CPV | WGLL M12; CPB M18 | 3 variations per beat, human picks, chosen clip references next beat |
| storyboard-review-and-invalidation | skill | CPV | CPB M18/2 p20 | Scene states, structured feedback, dependency invalidation, cost/retry controls |
| creator-handoff-packet | prompt | CPV | CPB M18/1 p19 | Script, shot list, product refs, claim limits, continuity, pronunciation, ratios |
| ad-claim-checker | skill | CW | WGLL M12/M13 | QA claims vs what the brand may legally say; strict on health/finance/before-after |

#### C. CPB "Ideas" (3 per chapter = product features; each is a candidate skill) - level: skill unless noted
- M01 {ST}: disagreement-view; next-best-question; compare-three-futures.
- M02 {RS}: workaround-atlas; objection-to-entry (skeptical companion); founder-advantage-map.
- M03 {RS}: complaint-to-category-switch; tradeoff-frontier; hidden-operating-burden-profile.
- M04 {OF}: living-requirement-map; design-variants-with-tradeoffs; sample-to-claim-gate.
- M05 {OF}: next-unsolved-job; assortment-simplifier; capability-reuse-map.
- M06 {RS}: question-to-proof-map; misunderstood-customer-queue; contradiction-explorer.
- M07 {RS}: nonbuyer-obstacle-map; cross-category-pattern-transfer; disconfirmation-brief.
- M08 {OF}: value-component-library (asset); promise-consistency-monitor (routine); reversible-offer-experiment.
- M09 {BF}: brand-expression-sandbox; brand-contradiction-map; deliberate-choices-memory (asset).
- M10 {WS}: setup-completion-receipts; capability-aware-setup-checklist; launch-rehearsal.
- M11 {WS}: page-argument-map; promise-continuity-preview (ad -> page -> cart -> confirmation); guided-fit-selector.
- M11/COMMERCE {WS}: no-result-search-recovery; explainable-recommendations; cart-promise-check.
- M12 {CPS}: missing-information-image-detector; variant-aware-asset-inheritance; product-truth-image-review.
- M13 {WS}: app-value-vs-friction-review; release-linked-regression-map; persistent-repair-queue (routine).
- M14 {FN}: metric-receipt (calculation provenance); measurement-incident-workflow (workflow); restatement-history.
- M15 {WS}: research-to-test-ladder; experiment-interaction-map; decision-focused-readout.
- M16 {WS}: release-impact-preview; customer-path-rehearsal; recovery-ready-release-log.
- M19 {PA}: concept-coverage-board; creative-fatigue-investigation; cash-and-stock-aware-media-plan.
- M20 {PA}: query-to-proof-builder; feed-improvement-with-explanation; demand-capture-diagnostic (brand vs non-brand).
- M21 {RT}: first-success-sequence; message-collision-resolver (routine); next-purchase-recommender.
- M22/SEO {OG}: answer-coverage-map; proof-based-editorial-studio; content-maintenance-via-graph (routine).
- M22/AEO {OG}: product-truth-discrepancy-queue (routine); evidence-completeness-view; suitability-first-comparison-library.
- M23/DELIGHT {RT}: first-success-companion; delivery-promise-monitor (routine); loyalty-benefit-lab.
- M23/SUPPORT {CX}: return-reason-evidence-map; batch-and-promise-anomaly-watch (routine); resolution-rehearsal.
- M24 {OP}: spec-to-cost-map; comparable-quote-assistant; savings-maturity-ledger.
- M25 {FN}: promotion-feasibility-preview; shared-opportunity-ledger; forecast-learning-view.
- M17/ORGANIC {OG}: question-to-content-series; organic-to-paid-bridge; product-development-listening-board.

#### D. WGLL sub-agents per module (with WGLL module #) - level: agent (most are single-job skills run by an orchestrator)
- M1 Market research {RS} (orchestrator "Market scout"): demand-trend; market-size; competitive-density; margin-structure; regulatory-and-risk; operator-fit.
- M2 Category research {RS}: category-mapper; price-ladder; review-miner (complaint list with frequency); saturation; supply (sourcing difficulty); repeat-potential.
- M3 Product research {OF}: product-shortlist; differentiation; unit-economics (P&L at 3 prices) {FN}; sourcing {OP}; compliance; launch-risk.
- M4 Expansion {OF}: catalog-mapper; customer-demand; trend-scan; competitor-catalog; allied-category; fit-and-cost.
- M5 Avatars & JTBD {RS}: evidence-gather (VOC corpus); existing-avatar (who buys now by profit); avatar-builder; jobs-to-be-done; off-label-use; untapped-avatar; competitor-avatar.
- M6 Offers {OF}: current-offer-audit; congruence-check; offer-builder; guarantee-and-risk-reversal; bundle-and-aov; offer-economics (veto).
- M7 Brand {BF}: brand-extractor; consistency-audit; verbal-identity (voice guide, 20 examples); visual-identity; positioning; asset-generator.
- M8 Store setup {WS}: domain-and-email-setup; store-setup; payments-and-tax; shipping-and-fulfilment; tracking-and-analytics {FN}; legal-pages.
- M9 Landing pages {WS}: page-auditor; structure-selector; section-builder; copy-agent {CW}; image-planner {CPS}; image-generator {CPS}; code-agent (draft theme); mobile-agent; qa-agent.
- M10 Speed {WS}: field-monitor (CrUX p75, routine); lab-tester; app-auditor; asset-auditor; theme-auditor; fix-agent; verifier.
- M11 CRO {WS}: hypothesis-builder; test-designer; significance-watcher (routine); deployment-agent; test-purchase-agent {SY}; rollback-agent; readout-writer.
- M12 Meta creative {CS/CPS/CPV}: pattern-selector; angle-builder; script-writer {CW}; prompt-writer; variant-generator; selection-interface; edit-agent {CPV}; claim-checker.
- M13 Ad copy & deployment {CW/PA}: primary-text-writer; headline-writer; description-writer; policy-checker; naming-convention-agent; deployment-agent (paused); budget-guard.
- M14 Google ads {PA}: feed-auditor; shopping-structure; search-term-miner; negative-keyword-agent; match-type-strategy; bidding-strategy; pmax-asset-group-builder; brand-vs-nonbrand-separator.
- M15 Email & lifecycle {RT}: flow-builder; segmentation-agent; campaign-calendar (12-month); content-writer {CW}; deliverability-monitor (routine); list-health-agent (routine); revenue-attribution-agent.
  - Nine flows (each a candidate workflow/asset, build order): welcome; abandoned-checkout; abandoned-cart; browse-abandon; post-purchase-education; review-request; replenishment; winback; vip.
- M16 SEO/AEO/content {OG}: technical-crawler; index-and-cannibalisation; on-page; entity-and-topic-gap; content-brief-writer; internal-linking; schema-agent; off-page; aeo-agent.
- M17 Post-purchase & delight {RT/CX}: journey-mapper; unboxing-designer; comms-agent (shipping/delivery messages); delight-moments; vip-agent; issue-recovery {CX}; review-engine.
- M18 COGS & supplier {OP}: bom-builder; cost-benchmark; supplier-finder; landed-cost {FN}; negotiation-agent; quality-risk.
- Count: 124 named sub-agents across the 18 modules (+ 1 named orchestrator, "Market scout") + 9 flows.

#### E. System/platform agents & components (SPLIT, CPB) {SY}
| Name | Level | Source | One line |
|---|---|---|---|
| orchestrator / play-runner | agent | SPLIT B.8; WGLL §3 | 12-step durable run: state, stage, blockers, play selection, rank, sequence, budget, critic, human gate, write, snapshot |
| critic | agent | SPLIT B.8/B.9; CPB CS/06 | Checks citations, arithmetic, policy, consistency, scope before owner sees output |
| coordinator (bounded workers) | agent | CPB CS/06 p82 | Sequences dependencies and reconciles competing worker recommendations |
| stage-score-calculator | routine | WGLL §2.1 | 90-day Shopify/GA4/ad-spend stage S0-S5, recomputed weekly |
| audit detectors x15 (+ 62-check baseline) | skill/routine | SPLIT B.7; WGLL §3.2 | Pass/fail/na checks with evidence, severity, fix |
| test-purchase-agent | skill | SPLIT B.11 | Playwright test order; verifies Shopify order + Meta & GA4 purchase events |
| draft-stage-verify-publish loop | workflow | SPLIT B.11; CPB M16 | Shared artifact release loop with approval rows |
| ingestion pipeline (10 stages) | workflow | SPLIT B.4 | Intake, normalise, segment, extract claims, vocabulary, write cards, classify scope, embed, detect conflicts, queue |
| claim-extractor | skill | SPLIT B.4 stage 4 | Extract assertion + nearby conditions with spans |
| card-writer | skill | SPLIT B.4 stage 6 | 1 claim per card, 350-500 tokens, all fields |
| scope-classifier (counter-case test) | skill | SPLIT B.4 stage 7; WGLL §1.3 | Baseline vs conditional classification |
| conflict-detector | skill | SPLIT B.4 stage 9 | Classify conflict kind (scope/stale/definitional/genuine) vs nearest 20 cards |
| review-queue | system (screen) | SPLIT B.5 | Kevin's 4-button adjudication UI |
| retrieval-service | skill | SPLIT B.6 | SQL filter -> freshness/tier -> size check -> hybrid -> rerank -> IDs |
| knowledge-to-play pipeline (7 steps) | workflow | CPB OM/06 | Register, extract, draft cards, review, author plays, retrieve & run, improve |
| outcome-ledger | system | SPLIT B.12; WGLL §3 | Append-only archetype-tagged outcomes |
| eval-harness | system | SPLIT B.13 | 30-50 golden tasks per pipeline; acceptance rate per play |
| connectors (Shopify, GA4, Playwright crawler, PSI/CrUX, Meta, GSC, Klaviyo, Google Ads) | skill | SPLIT B.10 | pull -> snapshot; scope-whitelisted draft writes |
| event-to-work-item router | routine | CPB CS/02 p78 | 8 event types create bounded downstream tasks with invalidation rules |
| source-capture workflow (Kevin) | workflow | SPLIT A.3 | Find, screen, capture, log, flag, drop (15-25 min/source) |
| metric-dictionary | asset | SPLIT Part C; CPB M14 | Every term defined once with synonyms |
| 50 gold cards | asset | SPLIT A.6; WGLL §6 | Hand-written reference/eval set |
| creative pattern library | asset | SPLIT B.3; WGLL M12; MCR brief | 25-40 named patterns with works/fails conditions |
| page structure library | asset | WGLL M9 | 6 page types with section orders |
| founder-home / owner-monday screen | system | WGLL §7; CPB CS/05 | 5-block approval dashboard |
| agency-workspace | system | CPB CS/05 | Multi-client roles, queues, capacity, scoped data |

#### F. Templates/assets named in the docs - level: asset
- 10-slot PDP image template (WGLL M9); 6 page types (standard PDP, advertorial, listicle, quiz funnel, comparison page, long-form sales page) (WGLL M9; SPLIT LPG); avatar table schema; offer card schema; brand basics kit (name, domain, logo, 3 colours, 2 fonts, 5 tone adjectives) (WGLL M7); 15-field creative brief (CPB M17/3); image prompt contract example (CPB M17/4); creator handoff packet (CPB M18/1); decision card; work-item contract; meta.yaml/source.md drop format (SPLIT §0.3); 12-month campaign calendar (WGLL M15); founder report + developer report pair (WGLL M10; CPB M13); per-module search-keyword lists (SPLIT A.5) and per-workflow search prompts (CPB "Kevin collects ... Search:" lines) = research prompt assets {SY/RS}.

---

### Doc notes

#### CPB - Ecommerce_OS_Complete_Product_Blueprint (v1.0, 16 Sep 2026)
- Path: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\output\Ecommerce_OS_Complete_Product_Blueprint.md` (246 KB, 2,841 lines; one `# ` heading per PDF page plus `*PDF page N*` markers). PDF twin `output\pdf\Ecommerce_OS_Complete_Product_Blueprint.pdf` (322 KB, 16 Sep 22:56; not re-read, assumed rendered from same content). Build source `Ecommerce OS\tmp\pdfs\final_blueprint\content.md` (2,247 lines) with `build.py` and 14 contact-sheet JPGs: same text using `@@PAGE` markers (97 pages), `@@TOC` and `@@GRAPH` placeholders; my diff shows the only text differences are the expanded page-range TOC list (15 lines) and one graph caption line that exist in the output .md but not in content.md. Not materially different -> no separate row.
- Purpose: consolidated product reference for Ecommerce OS, merging four earlier PDFs (Data & Engineering Handbook 58 pp, build-split 27 pp, what-good-looks-like 18 pp, architecture 30 pp = 133 pp), reconciling their conflicts, adding the graph interface, a deep creative walkthrough, cross-domain ideas and customer-outcome emphasis.
- Audience: Kevin (customer problem, evidence, ideas, outputs, evaluation) and Colin (records, graph, states, review points, handoffs, failures).
- Structure (97 pages): Vision (p1-6) -> Navigation -> Operating model 01-08 (p7-14) -> Creative walkthrough M17/1-6 + M18/1-2 (p15-22) -> Workflows M01-M16, M19-M25 each in 2 pages (main + ideas) (p23-72) -> Connected workflows Commerce & Organic (p73-76) -> Connected system 01-06 (p77-82) -> Build path 01-05 (p83-87) -> Validation 01-06 incl. T01-T24 (p88-93) -> Product decisions (p94) -> Source integration (p95) -> References R01-R10 (p96-97).
- Quality: very high consistency and depth; disciplined about evidence, uncertainty, customer harm and platform limits; every workflow has steps, outputs, human decision, measures, failure, three ideas, a fictional Foldwell example, research search strings and a pass condition. Weaknesses for a parts catalogue: abstract and cautious; few concrete numbers, templates or prompts; names no specific agents (deliberately "bounded workers"); all examples fictional (Foldwell); no real data. AI-generated (Codex) planning doc; it says no merchant account was connected and no real experiment run.
- Overlaps: supersedes WGLL and SPLIT on rules (see Part 11); keeps their module coverage via the M-id mapping. Its "Kevin collects / Colin builds" lines echo SPLIT's split. Other docs in `output\pdf` (Complete_Lifecycle_Blueprint, Customer_Delight_Architecture, Data_and_Engineering_Handbook, Financial_Opportunity_Playbooks) are separate documents, not twins.
- Notable: CPB's source register says it read what-good-looks-like at 18 pages; the copy in Docs is 22 pages -> the Docs WGLL may be a later or differently rendered version than the one CPB consolidated (dates: WGLL PDF 16 Sep 16:14, SPLIT 16 Sep 20:47, CPB 16 Sep 22:56). The "ecommerce-os-architecture.pdf" CPB cites (30 pp) is not in `Docs\` (may be `Ecommerce_OS_Backend_Architecture.pdf`; not verified).

#### WGLL - ecommerce-os-what-good-looks-like (1).pdf
- Path: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\Docs\ecommerce-os-what-good-looks-like (1).pdf` (126 KB, 22 pages). Text: `C:\Users\kevin\AppData\Local\Temp\eos_inv\text\ecommerce-os-what-good-looks-like (1).txt` (layout mode; table severity columns scrambled on p4-7 and data-source access column on p19; I re-extracted those pages with `pdftotext -raw` to stdout for the severities).
- Purpose: define "good" for the owner, the 2-layer knowledge base (baseline vs stage), the S0-S5 stage model and capability gates, the shared spine, the full universal baseline checklist, 18 journey modules (goal, orchestrator, sub-agents, inputs, outputs, human decision, gate, failure), data sources, build order, the owner screen and risks.
- Audience: Kevin and Colin (ends "What I need from you next" addressed to Kevin, so written by the builder side/AI to Kevin). Undated.
- Structure: Part 1 what good looks like (owner's Monday, upload-not-publish rule, two layers, stage personalisation); Part 2 stage model; Part 3 spine + run modes + baseline checklist; Part 4 18 modules; Part 5 data sources; Part 6 build phases; Part 7 the screen; Part 8 what will go wrong; next steps.
- Quality: the most concrete and catalogue-ready of the three: named sub-agents per module, explicit numbers, templates (10 image slots, 9 flows, 6 page types), severities. Weakness: many unsupported numeric thresholds (400 conversions, 80-120 cards, "5% carrying 40% of value", $1.20 insert vs 4% repeat) that CPB later downgrades to hypotheses; GP/purchase single north star. Strongly commercial, Shopify/Meta/GA4/Klaviyo-centric.
- Overlaps: SPLIT uses WGLL's 18 modules (as 3-letter codes) and its baseline list ("section 3.2 of the previous document"); CPB consolidates it (as an 18-page version) and revises its rules.

#### SPLIT - ecommerce-os-build-split (1).pdf
- Path: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\Docs\ecommerce-os-build-split (1).pdf` (196 KB, 27 pages). Text: `C:\Users\kevin\AppData\Local\Temp\eos_inv\text\ecommerce-os-build-split (1).txt` (layout); raw re-extraction `C:\Users\kevin\AppData\Local\Temp\eos_inv\scripts\A_split_raw.txt` (same word count, cleaner tables).
- Purpose: a shared working document dividing the work: Kevin collects and judges knowledge, Colin builds the machine. Defines vocabulary, module codes, the source drop/handoff contract, decision rights, weekly rhythm, source tiers, capture workflow, collection order and per-module collection briefs (search keywords, where to look, what to capture, volumes, done-when), gold cards, review queue; then engineering: non-negotiables, stack, full Postgres data model, ingestion pipeline, review queue, retrieval, audit engine & first 15 detectors, orchestrator, model routing, connectors, draft/stage/verify/publish, outcome ledger, eval harness, security, build sequence, definitions of done, first 2 weeks.
- Audience: Kevin (Part A) and Colin (Part B); both Part 0 and Part C. Undated (meta example captured_at 2026-09-16).
- Quality: high, very operational; the best source for the knowledge-ingestion system and for "how to research each department" (search keyword lists = ready research prompts). Weaknesses: engineering choices hard-coded (Temporal, pgvector, retrieval caps) and several rules later revised by CPB; volumes/targets are guesses.
- Overlaps: depends on WGLL (module list, baseline section 3.2); consolidated into CPB (Kevin/Colin ownership, cards vs plays, durable runs, draft/verify/release, outcome records).

#### Cross-doc observations for the catalogue
- The three docs together give a complete department map: research (market, category, product, expansion, customer, exploration) -> offer & brand -> store setup -> pages, imagery, speed, measurement, CRO, release -> creative intelligence & production (static, video) -> paid (Meta, Google) -> lifecycle, SEO/AEO, organic -> post-purchase delight, support/returns -> sourcing/COGS -> economics/cash/inventory, with a cross-cutting baseline audit, knowledge pipeline and orchestrator.
- Best per-department sources: WGLL for sub-agent decomposition and checklists; CPB for step-by-step workflow logic, outputs, guardrails and handoffs; SPLIT for research briefs and system components.
- None of the three contains working prompts, code or tested outputs; all are planning knowledge (status draft).


---

# Appendix B. Architecture set: BACKEND, DEH, EOSBP, ARCH-A

### Ecommerce OS: master map of parts (inventory model B)

Inventory agent B, 17 Oct 2026. Read-only extraction from three Ecommerce OS planning documents (plus one predecessor note I skimmed). Everything here is what the documents *propose*. None of it is built. All three are AI-generated planning documents that Kevin commissioned (Codex/AI), so their status is `draft`.

#### Source keys used in tags

| Key | Document | Date | Size | Location |
|---|---|---|---|---|
| **BACKEND** | *Ecommerce OS: backend architecture*, Revision C | 18 Sep 2026 | 42 pages, §0-§15 | `Ecommerce OS\Docs\Ecommerce_OS_Backend_Architecture.pdf` (text: `%TEMP%\eos_inv\text\Ecommerce_OS_Backend_Architecture.txt`) |
| **ARCH-A** | *The knowledge engine behind the Ecommerce OS*, Revision A (predecessor that BACKEND "builds on"; skimmed only) | 16 Sep 2026 | about 29 pages, §01-§18 | `Ecommerce OS\tmp\pdfs\final_blueprint\input\ecommerce-os-architecture.txt` |
| **DEH** | *Ecommerce OS: Data Collection and Engineering Handbook* v1.0 | 16 Sep 2026 | 58 PDF pages; Part I (A01-A08, M01-M25), Part II (B01-B21, R01-R12) | `Ecommerce OS\output\Ecommerce_OS_Data_and_Engineering_Handbook.md` |
| **EOSBP** | *Ecommerce Operating System Blueprint* (docx) | 16 Sep 2026 | about 20 pages, §1-§20 plus "Decisions" | `Ecommerce OS\output\ecommerce-blueprint\Ecommerce Operating System Blueprint.docx` |

Tag format: `[BACKEND p12 §4.4]`, `[DEH M14]`, `[DEH B17]`, `[EOSBP §9]`, `[ARCH-A §07]`. Area codes come from `_SCHEMA.md` (BF RS OF CS CPS CPV CW PA AN WS RT OG CR CX OP FN ST SY).

---

#### 0. How the three documents relate (chronology and drift)

- **EOSBP (16 Sep, earliest).** A general implementation blueprint. Its wedge is **Meta creative strategy and production first**, then SEO/AEO, content, email, Google Ads, landing pages and CRO. It defines 5 persistent records, 6 agent roles, 6 build phases and one worked Meta run (META01). [EOSBP §1, §17]
- **ARCH-A (16 Sep).** A knowledge-engine note. Its spine is raw source -> graded card -> play -> run -> outcome. It uses T0-T4 evidence tiers, a 10-agent specialist roster and an 18-week plan with phases 0-5. It proposes **SEO/AEO first** and Meta creative second. North star: **gross profit per purchase**. [ARCH-A p1, §07, §16]
- **DEH (16 Sep).** A work manual that turns the "Customer Delight Architecture v1.1" into a collection and engineering plan. It splits the work: **Kevin owns knowledge, his brother (Colin) owns the system**. It defines **25 stable modules, M01-M25**, covering the whole ecommerce journey, with 200 search queries. It splits knowledge into universal **base** cards and **stage** cards. Its first workflow is a **product-page foundation repair**, and it sets 6 engineering milestones (E01-E06). [DEH Working reference, A08, B19]
- **BACKEND (18 Sep, latest, Rev C).** Restates Kevin's architecture and adds 6 corrections. It defines 5 planes, a controlled vocabulary, an 11-stage intake, 2 libraries (hidden knowledge plus visible exhibits), a graph, a **message layer covering about 14 marketing channels**, the agent roster and a **5-month build plan**. The wedge widens to **avatar -> offer -> landing page -> marketing (60-70% of effort)**, piloted with 3 brands. It says it "builds on the blueprint, the idea engine, the architecture note, the build split and the data handbook". [BACKEND p1]
- **Drift to note for the catalogue:**
  - The **first wedge changes three times**: Meta creative [EOSBP] -> SEO/AEO [ARCH-A] -> product-page foundation [DEH] -> customer evidence -> message -> page plus 3 marketing surfaces [BACKEND].
  - The **north star moves** from gross profit per purchase [ARCH-A] to one primary metric per workflow with guardrails, plus acceptance rate at the human gate [BACKEND §10, §11].
  - **Evidence grading moves** from T0-T4 tiers [ARCH-A] to `evidence_role` [BACKEND §5.1].
  - **Card size**: 400-500 tokens [EOSBP §4], 300-800 tokens per chunk [DEH B05], and "meaning not token count" [BACKEND §3 stage 5].

---

#### 1. Business model: what Ecommerce OS is

##### 1.1 Product definition
- An AI operating system or service for running ecommerce brands. It combines a reviewed expert knowledge library, each brand's own data, orchestrated specialist agents and human approval at consequential steps. [EOSBP §1] [BACKEND §0]
- Core promise: convert trusted expert material (videos, blogs, books, courses, teardowns) into small, cited, condition-aware knowledge cards. Agents must cite those cards when they apply advice to a brand's real data. [EOSBP §1] [ARCH-A §01]
- The product has 3 visible faces [BACKEND §0, §2]:
  1. **Visible creative/reference library ("exhibits").** Real landing pages, ads, emails, organic posts, articles, creator collaborations and copy, each with a structured analysis. Browsable by customers.
  2. **Hidden expert knowledge base ("cards", "plays").** Sources cut into cards and split into baseline and conditional knowledge. Not visible to customers.
  3. **Brand workspace / warehouse.** Everything the brand connects or uploads: experiments, ad data, prior creative strategy, performance, blogs and brand documents.
- **The selling interaction (the demo).** A founder browses the library, finds an exhibit and clicks **"apply this to my brand"**, with a surface picker. The system combines the exhibit, its annotation, expert cards and the brand context to produce a real improvement. Two secondary buttons: "show different formats using this principle" and "show where this fails". [BACKEND §0 item 8, §9 p27-29]

##### 1.2 Customers and segments
- **Brand owners vs agencies.** This is an open decision: if agencies come first, permissions, roles and portfolio views move from month 5 to month 1. [BACKEND §15 decision 1] [ARCH-A §10 "agency axis"] [DEH B18 "Agency and team access"]
- **Brand stage segments.** Launch and traction vs growth and established brands. These are handled as preconditions on plays, not as separate products. [ARCH-A §10] [EOSBP §3] [DEH A02]
- **Pilots.** 3 design-partner brands for 1 product. "3 launch brands and 3 scaled brands need almost different products." [BACKEND §11, §15 decision 5]
- **Onboarding.** The first 20 customers are onboarded by hand; no self-serve signup. [BACKEND §12] [ARCH-A §16]

##### 1.3 Value wedge
- 60-70% of build effort goes to **avatar, offer, landing page and marketing as a whole**. "Marketing" means every surface: Meta, Google Search and Shopping, TikTok, Snapchat, YouTube, organic social, SEO, AEO, GEO, content, email, SMS, influencer/creator, partnerships and affiliates. [BACKEND §0 item 9]
- The wedge path: **customer evidence -> message -> page plus 3 marketing surfaces, for 1 product, for 3 pilot brands.** [BACKEND §11 "The wedge"]

##### 1.4 Team and ownership
- **Kevin (founder) owns knowledge**: source selection, dossiers, vocabulary, annotation schema, business meaning, review queue, claim registers and pattern library. **Colin (brother) owns the system**: intake, extraction, segmentation, cards pipeline, retrieval, connectors, workflow engine and evals. [DEH Working reference, A01, B01] [BACKEND §11 Kevin/Colin columns]
- Pilot roles: domain reviewer (knowledge quality), product owner (workflow decisions), engineer (data and execution reliability) and creative reviewer (production acceptance). One person may hold several roles. [EOSBP §17 "Who owns the work"]

##### 1.5 Commercial measures and unit economics
- **North star.** ARCH-A ranks plays by "expected gross profit impact ÷ effort" [ARCH-A §07]. BACKEND keeps gross profit per purchase as the main commercial measure but not the only one. Each workflow gets 1 primary decision metric, diagnostics and guardrails, with totals shown alongside per-order measures. [BACKEND §10 p30, §15 decision 7]
- **System health metric.** Acceptance rate at the human gate, per play and per version. "When acceptance drops after a card update, the update was wrong." [BACKEND §11 p38] [ARCH-A §07]
- **Cost.** Track cost per run from day 1 [BACKEND §8.3]. Track cost per accepted deliverable, including tokens, generation, rendering, storage and human review [EOSBP §18]. Plays carry `cost_estimate` so gross margin per run is known before pricing [ARCH-A §06].
- **Customer delight as structural properties** [BACKEND §10 p29]:
  - The product in the ad is the product that arrives (product fidelity review).
  - Claims are true (claim register).
  - Fit and use information is shown before purchase (baseline standard).
  - Ad, page, checkout and email are consistent (offer is 1 record).
  - The customer's actual worry is answered (objection IDs).
  - Disclosure is shown when content is partnered or affiliate.
  - No contact without permission (permission state checked at execution time).
  - The same answer appears everywhere (message object).
  - Checkout and returns work (foundation blockers).
  - Unsuitable products are not sold (tradeoffs surfaced).

---

#### 2. The ecommerce business lifecycle: functions and modules

##### 2.1 The 25 modules (canonical function map) [DEH Navigation, M01-M25]
Module IDs M01-M25 are stable across source folders, cards, engineering tasks and evals. Each module has: a decision to support, what to collect, a base layer, stage cards, Kevin's handoff, what the brother builds, and a joint acceptance test. [DEH Navigation]

**Stage A: Research and strategy (pre-launch and new direction).** Engineering is in DEH B13.
- **M01 Business intake and stage diagnosis** [DEH M01 p9]. Area **ST**.
  - Decision: what is true about this business, which universal checks apply, which workflows are appropriate now.
  - Collect: intake forms, audit procedures, stage definitions, constraint diagnosis, prioritisation.
  - Inputs: countries, currency, goals, category, product stage, traffic, orders, margin and cost availability, inventory, team capacity, budget, existing systems.
  - Base: accurate context and visible unknowns. Stage cards: prelaunch research, early-demand learning, repeatable acquisition, portfolio coordination.
  - Handoff: compact intake form, field definitions, routing table, 3 worked diagnoses.
  - Builds: context schema, intake/import UI, unknown-vs-zero handling, routing output that explains eligibility.
  - Test: revenue alone cannot remove broken images or checkout from the required checks.
- **M02 Market research and demand validation** [DEH M02 p10]. Area **RS**.
  - Methods: market definition, problem interviews, bottom-up sizing, search intent, seasonality (Google Trends is relative interest only), willingness to pay. Covers competitors, substitutes and doing nothing.
  - Outputs: research-plan template, market landscape, interview guide, demand calculation, decision memo (reject / investigate / sample / launch).
- **M03 Product-category research** [DEH M03 p11]. Area **RS** (could also be OF).
  - Category trees, substitutes, price tiers, buying criteria, operating burdens (fragile shipping, fit returns, shelf life, warranty).
  - Weighted scorecard with hard exclusions and sensitivity analysis; produces a shortlist and leads into the product brief.
- **M04 Product research, specification and validation** [DEH M04 p12]. Area **OF**.
  - Review mining, competitor teardowns, spec templates, concept tests, prototypes, sample acceptance.
  - Captures materials, dimensions, tolerances and variants, plus economic feasibility: price, landed cost, shipping, returns, MOQ, cash.
  - "Validated" status is per dimension, not a single label. It references "the trusted 40-60 page research collection".
- **M05 Expansion for an existing brand** [DEH M05 p13]. Area **ST**.
  - Portfolio audit, assortment, basket/cohort, adjacency, market entry, cannibalisation.
  - Always compares the expansion against doing more with the current range.
- **M06 Avatars, voice of customer and jobs to be done** [DEH M06 p14]. Area **RS**.
  - Purchase interviews, JTBD, VOC coding, objection analysis, cohorts.
  - Captures trigger, job, pain, desired outcome, alternative, tradeoff, objection, proof requirement and buyer vs user.
  - Outputs: interview guide, coding dictionary, avatar template, mapping from observation to message, offer and CX. Avatars must trace to evidence.
- **M07 Untapped situations, uses and creative angles** [DEH M07 p15]. Area **CS**.
  - Workarounds, alternative uses, non-consumption, counter-positioning.
  - Labels: new-to-brand, underdeveloped-in-category, exploratory.
  - Outputs: hypothesis-card template, illustrative angles, rejection criteria. A suitability and claim gate sits before any angle is approved (relevant to health claims; see FTC [R06]).
- **M08 Offers, bundles and commercial economics** [DEH M08 p16]. Area **OF**.
  - Value propositions, bundles, guarantees, shipping thresholds, subscriptions, personalisation.
  - Separates conversion lift from contribution improvement.
  - Outputs: offer anatomy, cost worksheet, congruence facts across ad, page, checkout, email and package.
  - Builds: versioned offer records and congruence checks. Changing an offer flags dependent assets.
- **M09 Brand strategy, voice and visual identity** [DEH M09 p17]. Area **BF**.
  - Positioning, brand audit, voice guide, visual system, migration.
  - Outputs: brand-document template, voice do/don't list, touchpoint audit, change-approval procedure. Approved brand versions plus an asset/claim registry.

**Stage B: Launch setup**
- **M10 Domain, email and first-store setup** [DEH M10 p18]. Area **SY** (could also be OP).
  - Domains, storefront connection, business email (SPF/DKIM/DMARC), admin access, recovery, payments, shipping, launch settings, test checkout.
  - Guided setup tasks with capability detection and evidence of completion. Merchant-owned steps stay separate.

**Stage C: Storefront and conversion.** Engineering is in DEH B14.
- **M11 Landing pages, copy and reference templates** [DEH M11 p19]. Area **WS**.
  - Page types: PDP, campaign page, advertorial, listicle, comparison, quiz funnel.
  - Each reference records entry channel, awareness, price, offer, proof, objections, structure, CTA and device.
  - Outputs: page-type taxonomy, section-purpose library, copy rubric, page brief.
- **M12 Descriptive product images and catalog assets** [DEH M12 p20]. Area **CPS**.
  - Image roles: hero, dimensions, use, construction, contents, comparison, proof, care.
  - Covers the reference-pack checklist, fidelity rubric and human-design handoff. An inaccurate image fails.
- **M13 Site speed and technical performance** [DEH M13 p21]. Area **WS**.
  - LCP, INP and CLS, field vs lab data, template inventory, diagnostic tree, regression checklist, founder and developer report pair. A repair closes only after verification.
- **M14 Tracking, attribution and event quality** [DEH M14 p22]. Area **FN** (measurement; could also be AN).
  - Event dictionary, purchase value and currency, deduplication, order reconciliation, UTMs, consent, refunds, timezone, attribution windows vs incrementality.
  - Outputs: mismatch diagnostic, reconciliation spec.
- **M15 CRO diagnostics and experiment design** [DEH M15 p23]. Area **WS**.
  - Repair vs investigate vs test. Covers sample size, MDE, SRM, stopping rules and low-traffic alternatives.
  - 5 analysis cases: win, loss, inconclusive, invalid measurement, operational stop.
- **M16 Shopify implementation, testing and release** [DEH M16 p24]. Area **WS** (could also be SY).
  - Theme, section and app-extension work; unpublished-theme previews; test orders; rollback.
  - Checkout UI extensions in some steps require Shopify Plus [R08, R09].
  - Outputs: test-case matrix, deployment decision packet.

**Stage D: Acquisition and creative.** Engineering is in DEH B14 and B15.
- **M17 Ad references, concepts and matched copy** [DEH M17 p25]. Area **CS** (copy is CW).
  - Each reference records hook, tension, proof, format, pacing, offer, CTA and destination.
  - Outputs: psychological-mechanism taxonomy, concept brief, image-prompt fields, copy rubric. "A long-running visible ad is not proof of profitability."
- **M18 Scripts, sequential video and editing** [DEH M18 p26]. Area **CPV**.
  - Script -> scenes -> candidates -> reviewer selection -> next scene uses the selected reference -> edit.
  - Includes a continuity checklist, a real-footage alternative, and a paused/resumable scene workflow.
- **M19 Meta campaign operations and learning** [DEH M19 p27]. Area **PA**.
  - Account audit, naming and structure, objectives, budgets, creative test design, attribution, pause rules.
  - Outputs: account-audit template, campaign decision packet, naming dictionary, budget and stock rules.
- **M20 Google Ads, search intent and product feeds** [DEH M20 p28]. Area **PA**.
  - Intent taxonomy, query-to-page map, feed field dictionary, price and availability parity, branded vs incremental demand.
- **M21 Email, lifecycle flows and seasonal campaigns** [DEH M21 p29]. Area **RT**.
  - Flows: welcome, browse/cart recovery, order/delivery, activation, replenishment, cross-sell, VIP, service recovery, win-back.
  - Covers collision rules, a seasonal planning template, seed-profile tests and holdouts.
- **M22 SEO, AEO and useful organic content** [DEH M22 p30]. Area **OG**.
  - Crawl and indexation, canonicals and redirects, internal linking, structured data, buying guides, care pages.
  - AEO is bounded by Google's AI-features guidance [R12]; no ranking or citation guarantees.

**Stage E: Post-purchase, operations and finance.** Engineering is in DEH B15.
- **M23 Customer delight, support and retention** [DEH M23 p31]. Area **CX**.
  - Order-to-delivery journey map, packaging and instructions, first use, delivery exceptions, triage, service recovery, returns, VIP.
  - Root-cause links back to product, batch, supplier, creative and page.
- **M24 BOM, suppliers and cost improvement** [DEH M24 p32]. Area **OP**.
  - BOM, RFQ, quote comparison, should-cost, samples, supplier performance, negotiation (MOQ, payment terms, Incoterms).
  - Distinguishes quoted, contracted and realised savings.
- **M25 Profit, inventory and operating priorities** [DEH M25 p33]. Area **FN** (inventory is OP).
  - Net revenue, COGS, gross profit, contribution, cash; reorder, lead time, stock coverage, forecasts.
  - Outputs: metric dictionary, prioritisation memo. Missing costs block confident profit claims.

##### 2.2 BACKEND module codes (topic buckets for cards)
BACKEND routes claims into module codes; the worked examples are on p11 §4.2-4.3. Inferred meanings, with a likely M-number mapping:

| Code | Likely meaning | Likely M-number |
|---|---|---|
| OFF | offers | M08 |
| AVT | avatar | M06 |
| LPG | landing pages | M11 |
| ADC | ad creative | M17 |
| CXP | customer experience | M23 |
| MEA | measurement | M14 |
| MCR | unclear (probably Meta campaign; not defined in the doc) | M19? |
| CRO | conversion | M15 |
| EML | email | M21 |

- "All 25 modules" appears in the cut list ("Ship the wedge. 4 done properly prove the architecture"). [BACKEND §12 p39]
- **Gap:** BACKEND never prints a code table. The 3-letter codes and DEH's M-numbers need reconciling in the catalogue.

##### 2.3 Brand stage models (four slightly different versions)
- **ARCH-A** brand_profile.maturity: `launch | traction | growth | established`. Derived from orders/month, spend/day, sessions, catalogue size, months live and data completeness. Launch and traction brands get "install the baseline": prescriptive, sequenced plays from T2 priors and archetype T0, with no statistical plays. Growth and established brands get "interpret the data": a ranked experiment queue. [ARCH-A §10]
- **DEH** stage subsections: prelaunch, early sales or low traffic, repeatable demand, scaled or complex operations. Gating uses real prerequisites (live store, eligible observations, cost data, platform feature, purchase volume), not revenue. [DEH A02, A06, B08]
- **EOSBP** has new vs established brand columns: starting evidence, objective, creative selection, search content, experiment design, confidence. Brand age is only one input. [EOSBP §3]
- **BACKEND**: "gate on the actual thing rather than the label". Eligibility has 3 outcomes (eligible, ineligible, unknown). Example: a brand with 40,000 orders/month launching a SKU with 60 visitors/week does not qualify for a page test on that SKU. [BACKEND §6 p16]
- **Brand profile fields**:
  - BACKEND: stage, category, aov_band, margin_profile, signal_quality, stack[], constraints, archetype. [BACKEND §5.3]
  - ARCH-A adds examples: capi_health, match_rate, no_discounting, regulated_claims, archetype "mid_aov_considered_purchase_single_geo". [ARCH-A §10]

##### 2.4 Customer lifecycle and journey (end-customer side)
Assembled from the docs. No single doc draws this end to end; DEH M01-M25 comes closest.
- **Discovery and awareness.** Paid social (Meta, TikTok, Snap, YouTube), search (Google Search and Shopping/PMax), SEO, AEO, GEO, organic social, content, creators, partnerships, affiliates. [BACKEND §7.2]
- **Awareness levels** (vocab_awareness): unaware, problem, solution, product, most aware. [BACKEND §2 p7]
- **Consideration.** Landing page or PDP, advertorial, listicle, quiz, comparison, longform; objections answered; proof; offer; fit and use information. [BACKEND §5.2] [DEH M11-M12]
- **Purchase.** Checkout, payment, shipping and returns visible; tracking events. [DEH M10, M14, M16]
- **Post-purchase.** Order and delivery communications, delivery exceptions, unboxing and instructions, first-use education, support, returns, service recovery. [DEH M23]
- **Retention.** Lifecycle email/SMS (welcome, cart, post-purchase, replenishment, cross-sell, VIP, win-back), loyalty. [DEH M21] [EOSBP §13]
- **Feedback loop.** Reviews, tickets, search terms and comments become the voice corpus, which becomes objection weights and then messages. [BACKEND §8.2 "Voice corpus builder"]

##### 2.5 Marketing channels (BACKEND message layer) [BACKEND §7.2 p18-19, vocab_channel p7]

| Channel (vocab ID) | Surface artifacts | What the adapter adds |
|---|---|---|
| Meta (CHN-meta) | video ad, static, carousel, primary text, headline | hook archetype, beat structure, aspect ratios, crop-safe areas, sound-off captions, category policy |
| TikTok (CHN-tiktok) | short vertical video, Spark post, on-screen text pass | native pacing, creator voice, heavy on-screen text, trend adjacency with a staleness clock |
| Snapchat (CHN-snap) | vertical video, story ad | sub-2-second hook, sound-off, tighter safe area, younger-audience policy |
| YouTube (CHN-youtube) | pre-roll script, long-form script, companion asset | skip-point logic (survive a 5-second cut), longer proof |
| Google Search (CHN-google-search) | RSA headline and description sets, sitelinks, callouts | query intent class, character limits, consistency with the destination page |
| Google Shopping / PMax (CHN-google-shopping) | feed attributes, title structure, asset group | attribute completeness, price and availability parity checked at execution time |
| SEO (CHN-seo) | article, collection copy, internal-link plan, redirect map | target query, entity coverage, cannibalisation check, a required distribution plan |
| AEO (CHN-aeo) | Q&A block, spec table, comparison table, schema markup | extractability, unit completeness, entity clarity, third-party corroboration |
| GEO (CHN-geo) | the same assets plus a citation-panel target list | which questions to win citations for, and who is cited now |
| Content (CHN-content) | guide, newsletter, video, comparison piece | format, length, where it will be found, which objection it retires |
| Email/SMS (CHN-email, CHN-sms) | flow beat, campaign, subject and preview | trigger, timing, suppression, permission state, frequency cap, deliverability |
| Organic social (CHN-organic-social) | post, reel, carousel, story | cadence, format-native structure, no paid-amplification assumption |
| Influencer/creator (CHN-influencer) | creator brief, deliverable spec, usage rights, whitelisting terms | creator fit evidence, disclosure, rights window, what may be improvised |
| Partnership / co-marketing (CHN-partnership) | co-branded page, bundle, newsletter swap, joint offer | partner terms, dual approval, attribution, exclusivity |
| Affiliate (CHN-affiliate) | creative kit, approved copy block, tracked link set, terms sheet | what affiliates may and may not say |

- **SEO, AEO and GEO are 3 separate jobs** with separate plays, metrics and cards. SEO is measured on non-brand impressions, position and clicks; AEO on presence in answer surfaces; GEO on citation rate from a citation panel of 40-60 questions run weekly. The **specification table** serves all 3 at once. [BACKEND §7.5 p20-21]
- EOSBP runs SEO and AEO through one backlog. AEO is "an evidence and discoverability workflow" measured with a repeatable prompt panel. [EOSBP §12]

---

#### 3. System architecture

##### 3.1 Planes and persistent records
- **BACKEND: 5 planes** [BACKEND §2 p6]. Each plane is replaceable on its own.

| Plane | Visible to | Holds | Guarantee |
|---|---|---|---|
| Intake | Kevin only | uploads, captures, connector pulls, originals, hashes, rights tier, processing state | nothing lost; every object traces to an exact locator |
| Knowledge | hidden | sources, versions, segments, claims, cards, plays, conflicts, review decisions | candidate is never served as approved |
| Exhibit | customer-visible | pages, ads, emails, organic posts, articles, answer citations, creator collabs, partnership assets, offers, copy, each with annotation, channel and rights tier | rights enforced; annotation is structured and card-linked |
| Brand | that tenant only | products, offers, avatars, objections, brand book, snapshots, artifacts, experiments, outcomes | tenant isolation; "unknown is not zero" |
| Execution | partly visible | orchestrator, workers, tool gateway, review states, releases, run records, costs | durable across day-long waits; no publish without an approval row |

- **ARCH-A: 4 planes**: Interface (what the operator sees), Execution, Knowledge, and Data plus Outcome ledger. [ARCH-A §03]
- **EOSBP: 5 persistent records** [EOSBP §2]:
  - Knowledge: sources, cards, disagreements, decisions, playbook versions.
  - Brand context: products, audiences, positioning, economics, constraints, approved claims, accounts.
  - Evidence: dated exports, crawls, observations, calculations.
  - Work: plans, task status, artifacts, approvals, tool actions, costs.
  - Learning: experiments, results, proposed guidance changes.
- **DEH B02: 8 components**: intake/source registry; extraction worker; segmentation/card worker; review/knowledge registry; search/eligibility; context/orchestration; tool gateway/connectors; outcomes/observability.
- **DEH A02: library vs live data.** The reusable expert library, the merchant business record and live operating data are kept separate.

##### 3.2 The 6 corrections (BACKEND §1, p2-5)
1. **§1.1 Route segments, not files.** One upload can become many cards, exhibits and discards; lineage is kept.
2. **§1.2 Exhibit analysis is a form, not an essay.** A fixed schema filled from the controlled vocabulary. The agent proposes new terms and never invents them. Prose is generated from the fields.
3. **§1.3 Rights tiers at intake.** A required field with no default. Enforced with separate storage buckets and credentials. "The durable asset is the annotation, not the asset."
4. **§1.4 Two libraries are one pipeline with 2 output types**: 1 intake, 1 vocabulary, 1 graph, 2 visibility levels.
5. **§1.5 Don't build a warehouse or buy a graph database.** Use Postgres per-tenant record and snapshot stores, object storage, and typed relationship tables.
6. **§1.6 Separate the message from the surface.** A channel-free message object fans out into surface artifacts (`message_id` FK).
- Non-negotiable: the **controlled vocabulary is the spine**. Build it in week 1, by hand. [BACKEND p5]

##### 3.3 Controlled vocabulary (shared spine) [BACKEND §2 p7]

| Table | ID prefix | Examples |
|---|---|---|
| vocab_objection | OBJ | OBJ-0112 "will it fit a standard door frame" |
| vocab_section_type | SEC | SEC-hero, SEC-proof-strip, SEC-comparison, SEC-objection-block |
| vocab_proof_type | PRF | PRF-ugc-video, PRF-third-party-cert, PRF-before-after, PRF-spec-table |
| vocab_hook_archetype | HOK | HOK-voiced-objection, HOK-pattern-interrupt, HOK-problem-demo |
| vocab_offer_mechanic | OFM | OFM-risk-reversal, OFM-threshold-shipping, OFM-bundle-tier |
| vocab_awareness | AWR | unaware, problem, solution, product, most |
| vocab_industry | IND | IND-home-safety, IND-supplements, IND-apparel (2 levels max) |
| vocab_page_type | PGT | pdp, advertorial, listicle, quiz, comparison, longform |
| vocab_channel | CHN | 15 channels (see §2.5) |
| vocab_surface_format | SUR | video-vertical-9x16, static-1x1, carousel, rsa-headline, feed-title, article-section, email-beat, qa-block, spec-table, creator-brief, cobrand-page |
| vocab_distribution | DST | paid-placement, owned-list, owned-social, search-index, answer-surface, partnered-audience, affiliate-network |
| Patterns | PAT | PAT-advertorial-problem-first [§4.1] (a pattern library, not a vocab table) |

- Rules:
  - Every term has an ID, definition, owner and status.
  - Terms enter only through review; agents may propose, never create.
  - Start with about 120 terms, expect about 400. At 4,000 "it has become free text".
- The doc says "8 tables" but lists 11 table names. It should be reconciled.
- **Metric dictionary**: every term defined once, with the synonyms it collapses (CPA, CAC and cost per purchase stay distinct). It is Kevin's month-1 deliverable. [BACKEND §11 m1] [ARCH-A phase 0] [DEH M25] [EOSBP §16]
- DEH has a related **shared vocabulary**: Source, Sub-source, Chunk, Card, Dossier. [DEH Navigation]

##### 3.4 Intake: from anything to routed segments
**BACKEND 11 stages** [§3 p7-10]. Stages 1-8 run unattended; stage 9 feeds the review queue.
1. **Receive.** 4 entry points (upload, URL, connector, bulk). Creates an `intake_items` row with a state machine. The `declared_kind` hint acts as a prior.
2. **Identify.** Deterministic detection first, a model second (with confidence). Below the threshold the item is held with a question.
3. **Preserve.** Original goes to the bucket for its rights tier; hash dedupe; versions are kept.
4. **Normalise, per format.** Produces text, a media manifest and a locator scheme. Per-format table [p8]:

| Format | Normalisation |
|---|---|
| Live landing page URL | headless capture at 2 widths, DOM, section boundaries, copy, image inventory, fold line, load metrics |
| Landing page screenshot | vision bands plus OCR; DOM facts flagged unavailable |
| HTML file | rendered like a live URL |
| Ad video | timestamped transcript, scene cuts, keyframes, OCR, speech vs music |
| Static ad | OCR with positions, layout regions, product and logo regions |
| YouTube or podcast | authorised transcript; visual-only content flagged |
| Blog or article | body only; tables and footnotes kept |
| Book or long PDF | chapter hierarchy; OCR uncertainty labelled |
| Email capture | subject, preview, body, CTAs, sender, date |
| Ad library export | run duration labelled a weak signal, "never as performance" |
| Spreadsheet or account export | sent to the brand plane |

   Quality checks stop the item on garble, missing pages, lost minus signs, separated table footnotes or unclear units.
5. **Segment** by meaning. Keep a principle with its scope and exception, procedure steps together, tables with units, and results with baseline, sample and window. Use parent/child segments. Overlap shares a `lineage_id`.
6. **Classify segment role**: claim, exhibit, both, or discard. "500 sharp cards beat 5,000 mushy ones."
   - 7a. **Claim path**: extract (with conditions) -> normalise vocabulary against the metric dictionary -> draft card -> classify scope (counter-case test: baseline vs conditional).
   - 7b. **Exhibit path**: fill the annotation schema. Every field is a vocab ID, number, enum or short verbatim quote. Only `reviewer_note` is free text, and only a human writes it.
8. **Link into the graph**: typed, evidenced edges.
9. **Detect conflicts and queue.** A flagship model compares the new card with the nearest cards. The queue holds conflicts, scope disagreements, proposed terms, low-confidence annotations and a sample (sample rate follows measured error).
10. **Review** and 11. **Publish**. Decisions: approve, edit, reject, merge, split, request evidence, defer. Each decision writes a row.
- Failure states are named (unreadable scan, no timestamps, visual-only, inaccessible, unclear units, ambiguous rights). "A failed import is not a completed source."
- **Worked examples** [BACKEND §4 p11-12]:
  - 4.1 Competitor advertorial URL: 14 sections, exhibit plus children, PAT link.
  - 4.2 Hormozi *$100M Offers* (licensed): 218 segments, 94 approved cards (OFF 61, AVT 14, LPG 9, ADC 6, CXP 4), 31 offer exhibits shown as structured summaries only.
  - 4.3 A 90-minute masterclass (study_only): 23 cards across 7 modules, 3 exhibits, 1 conflict, 2 held segments.
  - 4.4 A brand connects Shopify and Meta: tenant-scoped; creative is rebuilt into asset families (campaign -> ad set -> ad -> creative -> media -> copy -> destination); owned exhibits use the same schema.
- **DEH intake state machine** [B02]: received -> metadata checked -> access checked -> extracted -> extraction reviewed -> segmented -> candidate cards drafted -> founder review -> approved -> indexed -> retrieval tested. Rejected, quarantined, needs-info and superseded are also states.
- **DEH module progress states** [Navigation]: scoped, collecting, ready for ingestion, technically processed, awaiting knowledge review, approved, retrieval-tested, usable in a workflow.
- **DEH extraction contract** [B04]: per-format extraction (PDFs, HTML, video/audio, threads, spreadsheets) with a failure-handling table. "Extraction completion requires outputs, not an API success response."
- **DEH segmentation** [B05]: roughly 300-800 tokens per chunk as a starting point. Bad/good examples are given.
- **EOSBP library build** [§4]: keep the mega-doc as an immutable import -> split by source -> register -> extract -> claims -> atomic cards -> applicability and contradiction review -> publish -> index.
- **Kevin's collection workflow** [DEH A03-A06]: a 7-step research session (scope, discover, triage, read, challenge, synthesise, queue).
  - Source package fields: identity, dates, relevance, context, locators, evidence, access/use, review.
  - Folder convention: `sources/SRC-000123/`, `modules/M13-site-performance/dossier.md`.
  - Per-format capture rules (blogs, YouTube [R01, R02], Reddit [R03], private interviews).
  - The **dossier has 8 sections**: purpose; universal foundation; stage subsections; methods; evidence and examples; inputs and outputs; gaps and refresh; evaluation questions.
  - Quality gate [A07] and a first-cycle collection order [A08].

##### 3.5 Knowledge plane (hidden library)
- **Schema** [BACKEND §5.1 p13]:
  - `sources(id, canonical_url, url_hash, title, author, org, platform, format, rights_tier, modules[], why_included, owner, created_at)`
  - `source_versions`
  - `segments(... role, lineage_id, locator jsonb, extraction_quality, issues[])`
  - `claims(id, segment_id, text, stated_conditions, span, status)`
  - `cards(id, module, card_type, scope baseline|conditional, version, claim, mechanism, metric, conditions jsonb, expected_effect jsonb, effort, reversibility, risk, evidence_role, segment_ids[], source_ids[], supersedes[], superseded_by, open_conflicts[], valid_from, valid_to, review_due, vocab_refs[], embedding, status, reviewed_by, reviewed_at)`
  - `plays(id, version, module, decision, watches, profit_path, preconditions jsonb, fallback_play_id, steps jsonb, output_contract jsonb, verification jsonb, card_ids[], cost_estimate jsonb, status, approved_by)`
  - `conflicts(id, card_a, card_b, kind, detected_at, status, resolution, note, resolved_by)`
- **Card types**:
  - BACKEND: principle, observation, diagnostic, method, example, platform constraint.
  - DEH B06: principle, procedure, diagnostic, experiment, example/reference, platform constraint.
- **DEH card field groups** [B06]: Identity, Meaning, Applicability, Evidence, Relationships (requires, extends, example_of, conflicts_with, supersedes), Operation, Maintenance. Stable IDs such as `M12.BASE.IMAGE-FIDELITY` and `M15.STAGE.CONTROLLED-TEST`.
- **EOSBP card field groups** [§4]: identity and scope; decision content; applicability; evidence; governance. Target 400-500 tokens.
- **Evidence grading**:
  - ARCH-A tiers: T0 own outcomes; T1 platform docs; T2 large studies; T3 named practitioners with receipts; T4 unsourced opinion.
  - BACKEND replaces them with `evidence_role` (platform_doc, controlled_test, owned_record, practitioner, benchmark, observation). Tiers stay only as a display shortcut.
  - DEH A02 knowledge classes: universal principle, conditional method, platform procedure, expert framework, customer observation, case study, merchant fact.
- **Plays**: "knowledge that can run". About 120-200 plays and 1,500-3,000 cards at maturity; "a good play is worth about fifty mediocre cards". [ARCH-A §06, p12]
- **Contradictions**:
  - EOSBP §5 review fields: conflict ID, evidence on both sides, comparison, decision (keep both with conditions, supersede, combine, test, unresolved), publication record. An unresolved critical conflict blocks the recommendation. Review cadence: monthly for platform procedures, quarterly for principles.
  - ARCH-A §05 "Contradictions as conditions".
  - BACKEND: resolve by adding scope; automate only after a few hundred labelled resolutions. [§12]
- **Lifecycle** [DEH B09]: draft -> awaiting review -> approved -> indexed -> retrieval-tested -> active, plus superseded, withdrawn and expired. Workflows pin card and index versions. A change-propagation table and a module release packet are defined.

##### 3.6 Exhibit plane (visible library)
- **Schema** [BACKEND §5.2 p14]:
  - `exhibits(id, kind, channel_id, surface_format_id, tenant_scope, rights_tier, source_url, captured_at, advertiser_or_brand, industry_ids[], market, language, storage_keys, outcome_data (owned only), annotation_version, annotation_status, reviewer_note, published)`
  - Exhibit kinds: page, ad_video, ad_static, ad_carousel, email, sms, organic_post, article, answer_citation, creator_collab, partnership_asset, offer, copy_block.
  - `exhibit_sections(... section_type_id, above_fold, proof_type_id, objection_ids[], verbatim_headline, verbatim_cta, media_count, word_count, annotation_confidence, card_ids[])`
  - `exhibit_annotations(exhibit_id, field, value_vocab_id, value_num, value_enum, confidence, asserted_by, card_id, status proposed|approved|corrected|rejected)`
- **Landing page annotation fields** [p14]: page_type, awareness_level, industry, price_band, section_order (the structural fingerprint), above_fold_contents, objections_answered, proof_types_used, offer_mechanics, cta_count/positions, image_count/roles (hero, in use, scale reference, comparison, contents, proof), word_count, reading_level, mobile_specific_differences, foundation_findings, unavailable_fields.
- **Ad video schema** [p15]: hook archetype, beat structure, duration band, claim inventory per beat, proof types, objection, format, sound dependence, on-screen text density, destination type.
- **Universal message annotation** [BACKEND §7.6 p21-22]: a channel-free core (objections, proof types, offer mechanics, awareness, industry, promise quote, claim types, distribution mechanic, market/language, unavailable fields) plus channel extensions:
  - Video: hook, beats, duration, sound, text density.
  - Static: layout archetype, hierarchy, focal region, text-to-image ratio.
  - Page: the full section schema.
  - Search: intent class, headline structure, extensions.
  - Email: trigger, flow position, subject structure, CTA count.
  - Article: query target, entity coverage, tables, internal links.
  - Creator: format, disclosure, product handling, improvisation share.
- **Prose summary**: 3-5 sentences generated from the fields; it regenerates when a field is corrected. [p15]
- **Customer filters**: industry, page type, awareness, price band, objection, proof type, offer mechanic, section present, section-order fingerprint, above-fold contents, format, market, capture date, owned vs reference, plus free-text search on headlines and CTAs. [p15]
- **Badges** [§9 p27]: promising, tested in this context, fatigued, inconclusive, insufficient data. There is no permanent winner badge.
- **EOSBP creative record** [§9]: creative_id, source, permission, brand access, industry, product, funnel stage, format, placement, date, hook, angle, offer, proof style, visual structure, CTA, transcript/OCR, asset location, embeddings. Performance is linked only for owned or shared data.

##### 3.7 Rights tiers [BACKEND §1.3 p3-4] [DEH B03, B18]

| Tier | Covers | What the product may do |
|---|---|---|
| `owned` | the brand's own or permissioned assets | render in full, use as generation input, export |
| `public_reference` | public pages and ads, with URL and date | thumbnail or bounded capture with attribution and link-out; annotation shown in full; never a generation input |
| `study_only` | unclear provenance or paywalled | visible to Kevin and Colin only; never rendered to customers or used as input; may produce vocabulary and patterns |
| `licensed` | books, courses, paid research | produces cards; original never rendered or quoted at length; cards carry the citation |

- Enforcement is by separate buckets and credentials. The generation service can only read `owned`.
- DEH: rights and trust are separate. Restrictions are recorded per operation (storage, indexing, display, sharing, model training), and withdrawal propagates to derived material.

##### 3.8 Brand plane (per tenant) [BACKEND §5.3 p15]
- Entities:
  - `brands`, `brand_profile`
  - `products`, `variants`, `offers`, `claims_register`
  - `avatars`, `objections` (brand-scoped, referencing the global vocab)
  - `connections(provider, scopes, status, credentials_ref)`: a pointer, never the secret
  - `snapshots(provider, dataset, pulled_at, params_hash, row_count, storage_key)`
  - owned `exhibits`
  - `artifacts(type, payload_ref, preview_url, status, expected_effect, approved_by)`
  - `experiments`, `outcomes` (append-only, archetype-tagged)
  - `issues`, `constraints`
- Row-level security on `brand_id`, enforced in the database. Cross-tenant aggregation happens only through the archetype layer on approved outcomes. [BACKEND §5.3] [EOSBP §18 ref 7]
- EOSBP intake fields [§3]: product/variant data, price, markets, languages, customer problems, offer, voice, visual assets, approved claims and proof, stock limits, shipping/returns, channel objectives, approval owners, margin, acquisition limits, budgets. Unknowns are explicit. A dated brand brief carries a context version.
- EOSBP readiness checks [§3]: account identity, timezone, currency, event definitions, conversion tracking, freshness, reconciliation with the store.

##### 3.9 The graph [BACKEND §6 p15-17]
- **Edges table**: `edges(id, from_type, from_id, to_type, to_id, edge_type, asserted_by, evidence_ref, scope, confidence, status proposed|approved|rejected|retired, created_at, reviewed_by)`.
- **Edge types**:
  - `instance_of`: exhibit section -> vocab term (the backbone of faceted search).
  - `answers`: artifact -> objection.
  - `uses_pattern`: exhibit -> pattern.
  - `shares_principle_with`: pattern -> pattern across formats.
  - `variant_of`: artifact -> artifact (same mechanic, different execution).
  - `supports`: card -> annotation or pattern.
  - `requires`: a hard dependency.
  - `fails_with`: pattern or method -> brand condition (pruned before ranking).
  - `illustrates`: exhibit -> card (automatic when one segment produced both).
  - `tests` / `measures`: experiment -> artifact, outcome -> experiment.
  - `supersedes`: staleness.
  - `hypothesis_for`: a proposed causal explanation, kept separate from `supports`.
- **Baseline vs conditional**:
  - Baseline nodes are always loaded and cannot be ranked out. Check results are pass, fail or **unverified**.
  - Conditional subgraphs have eligibility outcomes of eligible, ineligible or **unknown**, each with a reason and next action. [p16] [DEH B08]
- **12-step traversal** [p16]: resolve -> access -> validity -> foundation (in full, never truncated) -> eligibility -> anchor (brand's winner, current page, top objections) -> walk 1 hop -> prune `fails_with` -> diversify -> expand dependencies and contradictions -> package -> cite.
- Vector search: "filter first, embed second". Once facets cut candidates to about 30, pass all 30. [p17] [ARCH-A §08]

##### 3.10 Retrieval and context assembly
- **DEH 9-step retrieval** [B10]: resolve scope -> enforce access -> enforce validity -> load foundation -> evaluate conditions -> lexical plus semantic search -> rerank -> expand -> package.
  - Result contract: card/version IDs, evidence IDs, inclusion reasons, eligibility, base coverage, omitted candidates with reasons, index revision.
- **EOSBP retrieval policy** [§6]: filter by tenant, approved status, platform, language and applicability. Hybrid keyword plus embeddings (Postgres pgvector) -> up to 30 candidates -> rerank -> 4-8 cards. A verifier checks citations. Missing evidence returns a knowledge gap.
- **ARCH-A retrieval order** [§08]: SQL filter on conditions -> tier and freshness -> (pass all if about 30) -> ... -> citation rule.
- **Context packet** [DEH B11]: task objective and output contract, merchant facts with dates, authority limits, base checklist, conditional methods, evidence and contradictions, workflow state. Illustrative 10,000-token allocation: 1,500 / 2,000 / 2,000 / 2,500 / 1,000 / 1,000. Safe-compression and stale-memory rules apply.

##### 3.11 Marketing layer: 1 message, many surfaces [BACKEND §7 p18-23]
- **Message object** [§7.1]: `messages(id, brand_id, version, avatar_id, objection_ids[], offer_id, promise, mechanism, awareness_id, claim_ids[] (from the claim register only), proof_refs, market, language, status draft|approved|retired, approved_by/at, parent_message_id, supersedes)`.
- **Surface artifact**: `surface_artifacts(id, message_id, brand_id, channel_id, surface_format_id, payload_ref, preview_url, adapted_fields, policy_check, disclosure_required, disclosure_text, status draft|in_review|approved|staged|live|paused|retired|invalidated, approval_ref, external_id, outcome_ref)`.
- **Two rules**:
  1. A surface may not assert anything its message lacks.
  2. A material message change (claim, price, guarantee, availability, promise) invalidates every derived artifact.
- **The 3 dimensions that differ per channel** [§7.3]. Each is data, not a code branch:
  - Placement constraints (aspect ratios, character limits, safe areas).
  - Policy and disclosure regime.
  - Measurement shape (deterministic vs modelled, view-through, per-asset cost, breakdowns).
- **Cross-channel measurement**: one initiative with one baseline; never sum independently guessed lifts. When effects can't be isolated, use a "bundled comparison". [§7.3]
- **Partnered channels** [§7.4]:
  - `partners(id, brand_id, kind creator|affiliate|brand_partner|publisher, handle, platforms[], audience_evidence, category_fit_inputs, rights_window, disclosure_required, comp_model, exclusivity, status, owner)`
  - `outreach(id, partner_id, message_id, brand_id, state identified|shortlisted|contacted|negotiating|agreed|briefed|delivered|live|settled|declined, terms, drafts, next_owner, next_action_due, notes)`
  - The system prepares; a human sends. It never sends, negotiates, agrees or publishes. Creator fit is scored on evidence, and follower count is a reach input only.
- **Brief route vs connector route** [§7.7]. Every channel gets a brief route from day 1: a human-executable packet with the message, constraints, claim limits, asset requirements, acceptance criteria and next owner. Connector routes are added by value per week.
  - Test: adding Snapchat should take 1 vocab row, 1 constraints table, 1 policy set, 1 adapter and 1 connector.

##### 3.12 Execution: orchestrator, workers, workflow engine
- **The orchestrator is a durable workflow**, not a free loop. [BACKEND §8.1 p24] [ARCH-A §07]
  - Does: loads brand state, computes eligibility, stops on foundation blockers, selects plays (with fallbacks), ranks by contribution vs effort with visible ranges, sequences by dependency, budgets tokens and time per step, routes to human gates, writes the run record (card, play and snapshot versions).
  - Never: authors or improvises a play, calls tools directly (everything goes through the tool gateway), writes customer copy, or concludes below thresholds. "Not enough data yet" is a valid output.
  - Exploration workers may propose new procedures; these go back to review.
- **ARCH-A run lifecycle** [§07 Plate 5]: actors are Orchestrator, Specialists, Tool layer, Critic and Human, across the phases Frame -> Plan -> Gather -> Produce -> Close.
- **EOSBP task contract** [§7]: run_id, task_id, tenant_id, brand_context_version, objective, inputs, dependencies, allowed tools, knowledge version, output schema, acceptance criteria, cost limit, time limit.
  - States: queued, running, awaiting input, awaiting approval, approved, executing, completed, failed, cancelled.
- **DEH work-item contract and states** [B17]: requested -> scoped -> gathering/building -> validating -> ready for decision -> approved -> executing -> verifying -> measuring -> learned, plus paused, rejected, failed and blocked.
- **DEH action classes** [B17]:

| Action class | Default handling |
|---|---|
| Read/analyze | run within scope |
| Prepare drafts | automatic |
| Reversible internal change | standing authority, with undo recorded |
| Publish/spend/contact | specific or standing authority, checked against the exact action |
| New commitment/exception | escalate with a packet |

- **Model routing** [BACKEND §8.3 p27] [ARCH-A §07]:

| Tier | Share of tokens | Jobs |
|---|---|---|
| Flagship | 10-15% | conflicts, play selection, anomalies, synthesis, critic |
| Mid | 25% | long reading, cards, briefs, copy, scripts |
| Small | 60% | extraction, tagging, annotation, classification, tool formatting, diffs, metric watching |
| Vision | separate line | screenshots, keyframes, OCR, product fidelity |
| Dedicated | separate line | embeddings, reranking |

##### 3.13 Storage and infrastructure
- Postgres (records, relationships, statuses, approvals, row-level security; full-text search plus pgvector), object storage for originals and artifacts, a durable job queue, and a derived, rebuildable search index. Normalised reporting tables come first; a warehouse later. [EOSBP §8] [DEH B02] [BACKEND §1.5]
- Move to ClickHouse or BigQuery when needed: "Postgres carries you to 50 brands". [ARCH-A §09]
- APIs vs MCP: direct adapters for sync and critical writes. MCP wrappers are optional; MCP "does not supply a database, data quality or approval policy". [EOSBP §8] [ARCH-A §09 "Where MCP actually fits"]
- One contract for CSV and API data: account, entity ID, date, timezone, currency, metric definition, attribution window, source, fetched_at, completeness flags. [EOSBP §8]
- Shared event model: order placed, payment failed, order refunded, shipment delayed, stock unavailable, offer changed, claim withdrawn, experiment matured. Must be idempotent and tolerate out-of-order arrival. [DEH B15]

##### 3.14 Security, access and safety
- Tenant row-level security is enforced before retrieval; there are cross-tenant leak tests. [BACKEND §14] [DEH B18] [EOSBP §18]
- Source content is never authority: prompt injection inside uploads is red-teamed in month 2. [BACKEND §14] [DEH B18] [EOSBP §6]
- Credentials live in a secret store, never in cards, prompts or logs. [DEH B18] [BACKEND §5.3]
- Approval is bound to artifact version or checksum, destination, action type, spend limit, audience, approver and expiry. [DEH B17] [EOSBP §1, §18]
- Agency and team roles: who can submit sources, approve knowledge, review brand assets, view finance, authorise spend and publish. [DEH B18]

##### 3.15 Measurement, learning and evaluation
- **Experiment registry** [EOSBP §16]: Hypothesis, Design, Execution, Result, Decision (adopt / stop / iterate / inconclusive), Learning scope (brand vs candidate general).
- **Outcome ledger** [ARCH-A §14]: play run -> baseline snapshot -> result -> ledger entry -> evidence updated (T0 cards).
- **Measurement worker**: baseline before exposure, registration, scheduled readouts, maturity. Outcomes are append-only and tagged by archetype and message_id. [BACKEND §8.2, §11 m5]
- **Measurement loop** [DEH B15]: platform attribution for operations, reconciled records for finance, controlled experiments for causal claims.
- **Metric formulas** [EOSBP §16]:
  - CPA = spend ÷ attributed acquisitions; ROAS = attributed revenue ÷ spend.
  - Keep currency, timezone and window. Return undefined when the denominator is 0.
  - Never sum platform-attributed conversions across channels.
- **Losers teach**: a readout with no effect must write at least one `fails_with`; log rejections against a fixed taxonomy. [BACKEND §14]
- **Layered evals** [DEH B12]: extraction, segmentation/cards, retrieval, context, output, execution.
  - Required hard cases: $0 vs $100M brand with the same defect; low-traffic SKU; missing cost; outdated docs; conflicting experts; synthetic fixture; wrong currency; revoked access; malicious instructions; source withdrawal; interrupted video workflow; duplicate webhook; profitable-looking offer with high returns.
  - Failure attribution names the earliest failing layer.
- **Release criteria** [EOSBP §18]: grounding (0 unsupported critical claims), retrieval, isolation (0 cross-brand exposure), execution, artifacts, operations (cost, duration, error).
- **Definition of done per component** [BACKEND §13 p39-40]: intake, vocabulary, annotator, exhibit library, card pipeline, retrieval, apply path, connector, detector, orchestrator, publish path, learning.
- **Operating queues and health** [DEH B20]:
  - Queues: new sources, extraction issues, card review, conflicts, stale guidance, retrieval failures, failed actions, coverage gaps.
  - Health areas: collection, processing, knowledge, retrieval, workflow, commercial value.

---

#### 4. Data objects / entities (master list)

| Entity | One-line description | Source |
|---|---|---|
| intake_item | Any received file, URL, connector pull or bulk drop, with state machine and rights tier | [BACKEND §3 p7] |
| source / source_version | An original item and its dated captured edition with hash | [BACKEND §5.1] [DEH B03] |
| source section / segment | Meaning-bearing unit with locator, role and lineage_id | [BACKEND §5.1] [DEH B03, B05] |
| evidence chunk | Retrievable extract of a section (300-800 tokens to start) | [DEH B03, B05] |
| claim / claim observation | Discrete assertion plus stated conditions and span | [BACKEND §5.1] [DEH B03] |
| card | Reviewed unit of knowledge (claim, mechanism, metric, scope, evidence, conditions) | [BACKEND §5.1] [DEH B06] [EOSBP §4] |
| play | Executable procedure: preconditions, steps, output contract, verification, cost, fallback | [BACKEND §5.1] [ARCH-A §06] |
| conflict | Pair of cards in disagreement, with resolution | [BACKEND §5.1] [EOSBP §5] |
| review decision | Approve, edit, reject, merge, split, request evidence or defer; reason and reviewer | [BACKEND §3] [DEH B09] |
| vocab term (11 tables) | Controlled IDs: OBJ, SEC, PRF, HOK, OFM, AWR, IND, PGT, CHN, SUR, DST | [BACKEND §2] |
| pattern | Named abstraction (PAT-*) with structure, works_when, fails_when, evidence | [BACKEND §4.1, §11 m4] |
| metric dictionary entry | One definition per metric with collapsed and kept synonyms | [BACKEND §11] [DEH M25] |
| exhibit / exhibit_section / exhibit_annotation | Visible library item, its sections and per-field structured labels | [BACKEND §5.2] |
| creative reference record | EOSBP variant of exhibit (hook, angle, offer, proof style, CTA...) | [EOSBP §9] |
| dossier | Kevin's long-form module synthesis (8 sections) | [DEH A06] |
| module (M01-M25) | Stable unit of work across sources, cards, tasks, evals | [DEH Navigation] |
| brand / brand_profile | Tenant and derived profile (stage, category, AOV band, margin, signal quality, stack, constraints, archetype) | [BACKEND §5.3] [ARCH-A §10] |
| brand brief / context version | Dated snapshot of brand facts that tasks pin to | [EOSBP §3] |
| product / variant | Catalogue truth; verified product assets for fidelity | [BACKEND §5.3] [DEH M04, M12] |
| offer | Versioned commercial proposition referenced by ad, page, checkout and email | [BACKEND §5.3, §10] [DEH M08] |
| claims_register | Every claim a brand may make, with substantiation, markets, expiry | [BACKEND §5.3, §11 m4] |
| avatar | Evidence-backed buying situation / job | [BACKEND §5.3] [DEH M06] |
| objection (brand + global) | First-class customer worry, weighted from evidence | [BACKEND §5.3, §10] |
| voice corpus observation | Reviews, tickets, search terms, comments turned into objection candidates with quotes | [BACKEND §8.2] |
| connection | Provider, scopes, status, credentials_ref (pointer) | [BACKEND §5.3] [DEH B16] |
| snapshot | Persisted connector pull with params hash and row count | [BACKEND §4.4, §5.3] |
| asset family | campaign -> ad set -> ad -> creative -> media -> copy -> destination | [BACKEND §4.4] |
| message | Channel-free approved statement for 1 customer situation | [BACKEND §7.1] |
| surface_artifact | Message rendered for a channel/format, with policy check and status | [BACKEND §7.1] |
| artifact | Produced output (page draft, copy, script, image) with lineage | [BACKEND §5.3] [DEH B14] |
| concept / script / shot / edit version | Video lineage concept_id -> script -> shot -> edit -> exported asset -> ad_id | [EOSBP §10] [DEH M18] |
| creative brief | Objective, audience, funnel stage, message, SKU, claim evidence, refs, exact text, dimensions, acceptance | [EOSBP §11] |
| partner / outreach | Creator, affiliate, brand partner or publisher record and its outreach state machine | [BACKEND §7.4] |
| experiment / outcome | Registered test and append-only results tagged by archetype and message | [BACKEND §5.3] [EOSBP §16] |
| issue / constraint / foundation finding | Detector result (pass, fail, unverified) with evidence and severity | [BACKEND §5.3, §8.2] |
| run record / task / work item | Run with exact versions, budget, state, owner, next action | [BACKEND §8.1] [EOSBP §7] [DEH B17] |
| approval record | Binds approval to artifact version, destination, action, limits, approver, expiry | [DEH B17] [EOSBP §18] |
| edge | Typed graph relationship with provenance | [BACKEND §6] |
| event (shared model) | Order, payment, refund, shipment, stock, offer change, claim withdrawn, experiment matured | [DEH B15] |
| citation panel result | Weekly 40-60 category questions run through assistants, plus cited sources | [BACKEND §7.5] |
| calendar slot | Content, organic or email slot with brief and capacity limit | [BACKEND §8.2] |
| BOM / quote / supplier milestone | Cost and specification records for sourcing | [DEH M24] |
| inventory / forecast record | Stock coverage, lead time, purchase commitments | [DEH M25] |

---

#### 5. Integrations

**Connector order** [BACKEND §7.7 p23]

| # | Connector | Why and what it unlocks |
|---|---|---|
| 1 | Shopify | commerce truth: orders, products, COGS, themes, discounts |
| 2 | GA4 | sessions, funnels, landing-page behaviour, scroll and exit (the "stall map") |
| 3 | Meta Marketing API | creative-level read, paused write |
| 4 | Klaviyo (or equivalent) | flows and campaigns as drafts |
| 5 | Google Search Console | query-by-page data; feeds SEO, AEO and the objection corpus |
| 6 | Google Ads | search terms, feed integrity, RSA drafts |
| 7 | TikTok Ads | validates the adapter pattern |
| 8 | Organic social scheduling | or export plus manual posting |
| 9 | Snapchat and the rest | once the pattern is proven |
| none | Influencer, partnership, affiliate, PR | packet plus human, permanently |

- **ARCH-A connection tiers** [§09 p17]:
  - Read-only analytics: GSC, GA4, PSI (PageSpeed Insights).
  - Commerce: Shopify. "The only way to compute gross profit per purchase."
  - Write access: Meta, Ads, Klaviyo, theme edits. Needs scope plus an approval gate on every write.
  - Also: crawler; ClickHouse or BigQuery later.
- **DEH initial order** [B16]: file intake and read-only exports -> catalogue and order reads plus storefront preview -> measurement and performance data -> publication and ad/lifecycle writes.
- **DEH capability record** [B16]: access, operations, data semantics, reliability, testing, fallback.
- **Platform realities** [DEH B16, R01-R12]:
  - YouTube captions API needs edit permission.
  - Reddit commercial API needs an agreement.
  - Shopify theme vs checkout UI extensions (checkout extensions need Plus).
  - Google Ads API and Klaviyo Flows API are version-specific.
  - GA4 thresholding.
  - Google Trends is normalised.
  - FTC health-claims guidance.
  - Web Vitals thresholds: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 [EOSBP §15].
  - GSC returns top rows only [EOSBP §8].
- **Tool and infrastructure references**: Postgres plus pgvector, row-level security, MCP, headless browser capture, OCR, transcription, scene-cut detection, a durable workflow engine, a secret store. [EOSBP §20] [BACKEND §3]
- **Generation providers** (image and video): optional and constrained. Product fidelity is reviewed as a separate layer. Video generation is cut from the 5 months; the provider is chosen after a capability test. [BACKEND §11 m4, §12] [EOSBP Decisions]
- **Rule**: an agent may only call operations the gateway authorises, never a capability "because a card mentions the task". [BACKEND §7.7] [DEH B16]

---

#### 6. Agents and roles

##### 6.1 BACKEND roster (latest) [§8.1-8.2 p24-26]
- **Orchestrator** (durable workflow). See §3.12.
- **Intake workers** (run on upload):
  - Type identifier: deterministic detection, model fallback -> format and capture route.
  - Normaliser (per format): capture, transcription, OCR, DOM, scene cuts -> text, media manifest, locators.
  - Segmenter: meaning-based cuts that preserve dependencies.
  - Role classifier: claim, exhibit, both or discard, with confidence.
  - Claim extractor: assertions plus nearby conditions, with spans.
  - Vocabulary normaliser: metric dictionary and term collapsing.
  - Card writer: 1 claim per card -> candidate cards.
  - Scope classifier: counter-case test -> baseline or conditional.
  - Annotator: fills the exhibit schema from the vocabulary only -> annotation rows with confidence.
  - Vocabulary proposer: new terms go to the review queue.
  - Conflict detector: nearest cards on the same module and metric -> conflict rows.
- **Brand workers** (run on connection and on a schedule):
  - Profile builder: stage, category, AOV, margin, signal quality, archetype; recomputed weekly.
  - Foundation inspector: detectors against snapshots -> pass, fail or unverified, ranked by severity. Starts from "the 15 detectors already specified in your earlier documents" [§11 m1].
  - Asset family reconstructor: ad accounts -> owned exhibits annotated with the shared schema.
  - Voice corpus builder: reviews, tickets, search terms, comments -> weighted objection candidates with quotes.
- **Production workers** (run inside plays):
  - Diagnostician: finds the constraint -> ranked findings.
  - Brief writer: testable brief with fixed and varied elements.
  - Copy worker: headlines, body, CTAs, using the claim register only; claim IDs attached.
  - Page builder: section order from objection weights; theme code -> draft theme plus preview URL.
  - Image planner and producer: slot briefs, generation, or a designer packet.
  - Script worker: beat-by-beat, with a claim per beat.
  - Scene producer: candidates per scene, continuity pack -> approved clips.
  - Deployment worker: campaign structure, naming and budget, all paused -> paused objects plus read-back.
- **Marketing layer workers**:
  - Message author: channel-free message draft.
  - Channel adapter (1 per channel family): surface artifact plus `adapted_fields` log.
  - Policy and disclosure checker: pass, or a block naming the rule; runs before upload.
  - Feed integrity worker: shopping and catalogue attributes, price and availability parity.
  - Entity and schema worker: structured data, spec tables, Q&A coverage.
  - Citation panel worker: weekly question panel -> citation rate plus a source-gap list.
  - Creator fit worker: shortlist with evidence; never contacts anyone.
  - Outreach drafter: approach, brief and terms as drafts plus an outreach state row.
  - Calendar worker: content, organic and email schedule against seasonality, capacity and frequency caps.
- **Cross-cutting**:
  - Critic: citations, claim register, arithmetic, policy, product truth, consistency. "A checker, not an optimiser."
  - Measurement worker: baselines, registration, readouts, maturity.

##### 6.2 ARCH-A specialist roster (predecessor) [§07 p14]

| Agent | Watches |
|---|---|
| Technical SEO | indexed pages serving non-brand impressions |
| Content & AEO | non-brand organic sessions, assistant citations |
| Speed | field LCP at p75 |
| CRO | session-to-purchase rate |
| Paid social creative | hook rate, then cost per purchase |
| Paid social account | gross profit per purchase |
| Paid search | non-brand cost per purchase |
| Lifecycle | repeat purchase rate |
| Measurement | signal quality score |
| Critic | nothing (it is a checker) |

##### 6.3 EOSBP roles [§7] and channel specialists [§9-§15]
- Generic roles: Orchestrator (plan), Analyst (data and deterministic calculations), Domain specialist (cited strategy, audit, brief), Creator (copy, page drafts, scripts, asset instructions), Verifier (pass, revise or block), Execution service (scoped tool actions, external IDs, receipts).
- Named specialists in the workflows:
  - Strategist, script specialist, image specialist, editor, claim verifier [§10, §11, §19].
  - Technical, on-page and content SEO specialists [§12].
  - Research specialist, brief specialist, writer, publishing service [§13].
  - Lifecycle specialist, copy specialist [§13].
  - CRO specialist [§15].
- "They are roles that can share a model, rather than a separate always-running agent for every topic."

##### 6.4 DEH domain workflow agents [B13-B15]
- A common **research orchestrator** with reusable workers. The worker contract: question, evidence cutoff, domain cards, permitted sources, budget, return schema. [B13]
- An **exploratory worker** for angles (M07), with a suitability and claim gate. [M07]
- Per-module workers named implicitly: catalogue and expansion workers (M05), lifecycle, Meta and Google adapters, CX root-cause classification, sourcing calculation tools, economics reconciliation. [B13-B15]

---

#### 7. Workflows (named procedures in the docs)

##### 7.1 Knowledge pipeline workflows (internal, SY)
- **Source intake to reviewed cards** (11 stages). Done when a source goes from drop to reviewed cards in under 1 hour of Kevin's time. [BACKEND §3, §13] [ARCH-A phase 1 "card factory"] [DEH B02-B09] [EOSBP §4]
- **Exhibit capture and annotation** (page and ad paths). [BACKEND §3 stage 7b, §11 m2]
- **Conflict detection and resolution.** [BACKEND §3 stage 9] [EOSBP §5] [ARCH-A §05]
- **Review queue** (weekly). [BACKEND §11 m3] [DEH A08 recurring reviews: intake, card, workflow, maintenance]
- **Module dossier research session** (Kevin, 7 steps), **source packaging**, **module quality gate** and **module release packet**. [DEH A03-A07, B09]
- **Refresh and change propagation.** [DEH B09, B20] [EOSBP §5]
- **Eval harness reruns** on every prompt, card, play, model or connector change. [BACKEND §11 m5] [DEH B12]

##### 7.2 Customer-facing and brand workflows
- **Apply-this-to-my-brand (the apply path)**, 14 steps [BACKEND §9 p28]:
  1. resolve
  2. foundation (repairs outrank improvements)
  3. structured diff
  4. filter: (a) a card supports it and its conditions match; (b) the brand has the inputs; (c) no brand-constraint conflict. Failures are shown as "not applicable here".
  5. rank (ranges)
  6. packet
  7. message (draft one if none covers this)
  8. produce (adapt to the surface)
  9. critic
  10. present side by side (each change carries a card ID and exhibit)
  11. gate (approve, edit or reject per change)
  12. stage (surface-specific verification: page preview and test order; ad created paused and read back; email seed test; creator packet to a named human)
  13. publish (owner acts; baseline snapshot; experiment registered)
  14. learn (readout at the play horizon on 1 metric, with message ID)

  The doc says "all 13 steps" elsewhere [§11 m3, §15 next item 4]. This is an inconsistency.
- **Show different formats using this principle**: `uses_pattern` -> `shares_principle_with` -> exhibits in other channels. [BACKEND §9]
- **Show where this fails**: walks `fails_with`. [BACKEND §9]
- **Find 5 similar** / contender retrieval and variant portfolio across channels. [BACKEND §1.2, §11 m4]
- **Brand connection and onboarding**: connect Shopify and Meta -> snapshots -> asset-family reconstruction -> owned exhibits. [BACKEND §4.4] [EOSBP §3 intake and readiness]
- **Foundation inspection** (baseline detectors, pass/fail/unverified). [BACKEND §8.2] [DEH M01, B08]
- **Product-page foundation workflow** (DEH's first useful outcome): retrieve universal checks -> inspect the store -> identify issues -> propose a repair -> verify. [DEH Working reference, A08]
- **Message authoring and fan-out** with invalidation propagation. [BACKEND §7.1-7.2, §11 m4]
- **Brief route packet** per channel (designer, editor, creator, agency packets with acceptance criteria). [BACKEND §7.7, §11 m4] [DEH B14 human route]
- **Partner and creator workflow**: shortlist -> fit scoring -> outreach drafts -> brief -> state tracking across weeks. It must survive 3 weeks of silence. [BACKEND §7.4, §11 m5]
- **Citation panel** (GEO baseline): weekly from week 17. [BACKEND §7.5, §11 m5]
- **Draft -> stage -> verify -> publish path**: draft theme, preview URL, real test order, no publish without an approval row. [BACKEND §11 m5, §13]
- **Measurement and readout**: baseline, registration, scheduled readouts, readout changes play ranking. [BACKEND §11 m5] [ARCH-A §14] [EOSBP §16]

##### 7.3 Channel workflows (EOSBP §9-§15; ARCH-A §11-§13 worked pipelines)
- **META01: Meta strategy and creative library** [EOSBP §9, §19]: read settings, exports and pages -> validate tracking -> segment results by cohort -> retrieve cards -> propose changes, concepts, budgets and success criteria -> approval before writes.
- **Video creative production** [EOSBP §10] [DEH M18] [BACKEND scene producer]: two paths from one script (creator production pack, AI generation). Bounded variants per shot -> reviewer selects -> versioned edit plan -> final export approval. Lineage runs concept -> script -> shot -> edit -> asset -> ad_id.
- **Image creative production** [EOSBP §11] [DEH M12]:
  1. Retrieve references.
  2. Write the concept brief, naming the test variable.
  3. Assemble the reference bundle.
  4. Generate distinct compositions.
  5. Review product accuracy and overlay exact text and logo.
  6. Export placements and review crops.
- **SEO audit to execution** [EOSBP §12] [ARCH-A §11] [DEH M22]: crawl, inventory, GSC, analytics -> blockers -> intent mapping -> content and internal links -> new content -> validate -> publish -> record the release.
- **AEO evidence and discoverability workflow** [EOSBP §12]: question set from customer needs -> clear answers with facts -> structured data validated -> prompt panel measurement.
- **Content marketing production** [EOSBP §13]: research specialist -> strategist -> brief specialist -> writer -> verifier -> human -> publishing service -> measure.
- **Email and lifecycle** [EOSBP §13] [DEH M21]: events, eligibility, consent and suppression -> lifecycle specialist designs the flow -> copy specialist -> validation (payloads, segments, fallbacks, rendering, unsubscribe, frequency) -> test sends -> activation approval.
- **Google Ads strategy and execution** [EOSBP §14] [DEH M20]: import -> verify -> retrieve -> plan -> generate assets -> approve, create, verify and monitor.
- **Landing page creation and optimisation** [EOSBP §15] [DEH M11]: traffic source, intent, offer, claims -> page brief and outline -> copy and implementation draft -> review -> publish with rollback.
- **Conversion experiments** [EOSBP §15] [DEH M15]: bottleneck -> hypothesis -> design (unit, control, MDE, stopping rule) -> approve -> deploy -> read. Low-traffic alternatives apply.
- **Page speed workflow** [EOSBP §15] [DEH M13] [ARCH-A §13]: group pages by template and device -> lab plus field data -> responsible assets -> fixes -> staging -> compare after release. CRO and speed are coordinated in one release plan.
- **Meta creative worked pipeline** [ARCH-A §12]: pattern library, script engine, variant matrix, selection gate.
- **Meta campaign operations** [DEH M19]: account audit -> campaign decision packet -> authority check -> publish and read back -> monitoring.
- **Store release** [DEH M16, B14]: preview -> test -> approve the exact change -> publish once -> verify -> recover.
- **CX journey and root cause** [DEH M23, B15]; **sourcing quote comparison and negotiation prep** [DEH M24, B15]; **economics reconciliation and prioritisation** [DEH M25, B15].
- **Research and strategy reports** (M01-M09) with decision gates: reject, investigate, sample, validate demand, bounded launch. [DEH B13]

---

#### 8. Human approval gates (consolidated)

- **Rights tier choice at intake**: required, no default; "friction on purpose". [BACKEND §1.3, §15 decision 4]
- **Review queue**: cards, conflicts, scope disagreements, vocabulary proposals, low-confidence annotations, samples. Candidate items are never served. [BACKEND §3] [DEH B09]
- **Vocabulary terms**: only via review; there must be an owner. [BACKEND §2, §15 decision 3]
- **Founder knowledge sign-off, brother processing sign-off, joint workflow sign-off.** None substitutes for another. [DEH A07, B21]
- **Message approval**: once, channel-free. A material change re-triggers review of all surfaces. [BACKEND §7.1]
- **Per-change approval** in the apply path: approve, edit or reject each change, "not all or nothing". [BACKEND §9]
- **Approval stack** ranked and capped: "Show 10 things, not 100". [BACKEND §14]
- **Publish, spend or contact**: no code path without an approval row bound to the exact artifact version. The owner publishes, starts, schedules or sends. Autonomous publishing is cut for the 5 months. [BACKEND §9 step 13, §12, §13] [DEH B17] [EOSBP §1, §18]
- **Script approval is not render approval.** A meaning change in the edit needs new approval; the final export checksum is approved. Concepts are approved before expensive video. [EOSBP §7, §10]
- **Separate launch decision**: account, assets, changes, schedule, budget limit. [EOSBP §19]
- **Experiment approval** before the variant is created. [EOSBP §15]
- **Email activation approval**: audience definition, schedule, exact content versions. [EOSBP §13]
- **Partner and creator actions**: always human (send, negotiate, agree, publish). The gateway has no send tool. [BACKEND §7.4, §14]
- **Standing authority**: reversible internal changes and routine actions can run within limits, with undo. New commitments or exceptions escalate. [DEH B17, M19]
- **Physical-world milestones** (samples, inspections, supplier replies, commitments) have human owners. [DEH B15]
- **Merchant-owned setup steps** (purchases, account creation, identity, financial settings). [DEH M10]
- **Human veto of plays and approval of anything irreversible or public.** [ARCH-A §07 Plate 5]

---

#### 9. Metrics referenced

- **Commercial**: gross profit per purchase (north star in ARCH-A), contribution, cash, net revenue, COGS, total contribution alongside per-order measures. [BACKEND §10] [DEH M25] [ARCH-A]
- **System**: acceptance rate at the human gate (per play and version), cost per run, cost per accepted deliverable, review time, annotator agreement rate, time to find 5 different exhibits (<30s), source-to-reviewed-cards time (<1h). [BACKEND §11, §13] [EOSBP §18] [DEH B20]
- **Channel**:
  - Hook rate, cost per purchase, CPA, ROAS (with stated definitions).
  - Non-brand impressions, position and clicks (SEO); answer-surface presence (AEO); citation rate (GEO).
  - Session-to-purchase rate; LCP, INP and CLS at p75.
  - Repeat purchase rate; delivered, clicks, conversions, unsubscribes, complaints (opens are a limited signal).
  - Non-brand cost per purchase; signal quality score (CAPI health, match rate); field LCP.
  - [ARCH-A §07] [BACKEND §7.5] [EOSBP §13-§16]
- **Customer**: returns, support contacts, customer effort, delivery exceptions; customer-value tradeoffs exposed, not averaged away. [BACKEND §10] [DEH M23]

---

#### 10. Build phases and roadmaps (the three plans compared)

##### 10.1 BACKEND: 5-month plan (Rev C, latest) [§11 p31-38]
Ordered by dependency; "exit gates are the real control".

**Month 1 (weeks 1-4): the spine**
- Kevin: metric dictionary; vocabulary v1 (about 120 terms); annotation schema for pages and ads; foundation checklist (15 detectors).
- Colin: records and access foundation; intake for 3 formats; segmenter and role classifier (evaluated on 20 hand-marked segments); brand workspace shell.
- Exit: drop a URL or PDF and walk back to exact locators; vocabulary agreed.

**Month 2 (weeks 5-8): the visible library**
- Kevin: hand-annotate 30 landing pages (the eval set); use the review queue; decide the facet set; capture 50-80 more pages and 40 ads.
- Colin: annotator worker; review-queue screen; gallery with facets, exhibit page and summaries; rights enforced in the render path; ad exhibit path.
- Exit: annotator agreement rate; 5 genuinely different pages for an objection plus proof type in <30s.

**Month 3 (weeks 9-12): knowledge and the apply path**
- Kevin: wedge source pack (customer evidence, offers, pages) plus 1 end-to-end play; clear the queue weekly; voice corpus for 3 pilot brands; acceptance standard for apply output.
- Colin: claim path; conflict detection (flagship model); retrieval service; Shopify and GA4 connectors with snapshot and replay; foundation detectors; the full apply path.
- Exit: an unseen brand connects Shopify -> output "you would send to a client".

**Month 4 (weeks 13-16): message layer and first 3 surfaces**
- Kevin: claim register for 3 pilots; pattern library (25-40 patterns, losers included); placement constraint tables and policy/disclosure rules; brief standard per channel; review 3 rounds.
- Colin: message object, fan-out and invalidation; 3 adapters (paid social video, email beat, organic post); Meta connector; marketing workspace (tabs: our results, outside references, patterns, messages, in production, learning); contender retrieval; script worker; designer and creator packets; optional constrained image generation.
- Exit: 1 message -> 3 executable artifacts; changing a claim invalidates all 3. "Ship the brief route before any generation route."

**Month 5 (weeks 17-20): execution, learning, pilot**
- Kevin: run the loop with 3 design partners; interpret readouts; citation panel; shortlist creators by hand; pick the next adapter from pilot demand.
- Colin: durable workflow engine; draft/stage/verify/publish; search and discovery surfaces (GSC, Google Ads feed and RSA, entity/schema worker, spec tables); partnered route; measurement and learning records; eval harness.
- Exit: 3 owners accept with light edits; a readout changes ranking; resume and no-duplicate tests pass; 1 message measured on more than 1 surface.

**Cut list** [§12 p38-39]: video generation and stitching; data warehouse; graph database; elaborate graph visualisation; deep connectors on more than 4 channels; a product per channel; all 25 modules; self-serve signup; automatic conflict resolution; autonomous publishing.

**Next deliverables offered** [p42]: vocabulary v1 tables; annotation schema; intake state machine spec; apply-path play definition; 15 hand annotations.

##### 10.2 ARCH-A: 18-week phases (predecessor) [§16 p27]

| Phase | Weeks | Ships |
|---|---|---|
| 0 Vocabulary | 1-2 | metric dictionary, schemas, 50 gold cards |
| 1 Card factory | 2-6 | ingestion, conflicts, review, 300-600 SEO cards, 15-25 SEO plays |
| 2 Vertical slice | 6-11 | GSC, GA4, crawler and PSI connectors, orchestrator, 3 specialists, critic, run store, audit report; acceptance above 70% |
| 3 Ledger | 11-15 | experiments, baselines, readouts, T0 cards, archetypes |
| 4 Second channel | 14-19 | pattern library, Meta connector, script engine, variant matrix, selection gate |
| 5 Platform | 19+ | multi-tenant, agency rollup, self-serve, remaining channels |

##### 10.3 DEH: engineering milestones [B19]
- E01 Intake and evidence -> E02 Cards and review -> E03 Retrieval and routing -> E04 Useful artifact (one diagnostic workflow plus a page/asset/developer packet) -> E05 Verified execution -> E06 Learning and expansion.
- Collection cycles 1-4 [A08]:
  1. Contract.
  2. First connected pack: M01, M06, M08, M11-M16.
  3. Test with real questions.
  4. Expand: M09, M17-M21, then M02-M05 and M07, then M22-M25.

##### 10.4 EOSBP: 6 phases [§17]
1. Knowledge foundation.
2. Meta strategy pilot.
3. Creative production.
4. AI video and integrations.
5. Additional channels (SEO/AEO, content, email, Google Ads, landing pages, CRO).
6. Scale and learning.

First vertical slice: 1 brand, Meta sources, 1 account export -> 3 concepts, 1 image set, 1 creator-ready script.

---

#### 11. Failure modes ("what will break this") [BACKEND §14 p40-41] [ARCH-A §02] [DEH B12]

- Annotations turn into essays.
- The library fills with mush.
- Conditions are dropped at extraction.
- A rights letter arrives.
- A source instructs the system (prompt injection).
- A cross-tenant leak.
- Delivery artifacts are read as insight.
- Individual journeys are invented from aggregate reports.
- Duplicate commercial actions.
- The brand says 11 different things.
- Disclosure or permission failures.
- An agent contacts a creator.
- Trend references age into the library.
- Owner overwhelm.
- Only winners teach.

#### 12. Open decisions [BACKEND §15 p41-42] [EOSBP "Decisions to record"]

- **BACKEND**:
  1. Brands or agencies first?
  2. Structured annotations or prose?
  3. Who owns the vocabulary?
  4. What is the default rights tier for competitor captures (recommendation: none)?
  5. Which 3 pilot brands, and at what stage?
  6. Which 3 adapters in month 4 (recommendation: paid social, email, organic)?
  7. Does gross profit per purchase stay the single north star?
- **EOSBP**: pilot brand and sources; knowledge and creative reviewers; first import format; permitted writes and approval owners; quality and cost limits; hosting and generation providers.

---

#### Proposed workflow/agent library in these docs

Format: **name** (kebab-case proposal) | level | area | one line | source. Levels follow the catalogue: skill, routine, workflow, agent, system, knowledge, asset.

##### A. System-level and orchestration
- **ecommerce-os-platform** | system | SY | The whole multi-tenant OS: 5 planes, vocabulary, 2 libraries, graph, message layer, orchestrator, workers, gateway. [BACKEND]
- **play-orchestrator** | agent | ST | Durable workflow that selects, sequences, budgets and gates plays from brand state and eligibility. [BACKEND §8.1] [ARCH-A §07] [EOSBP §7]
- **research-orchestrator** | agent | RS | Common orchestrator for M01-M09 research workers, which it consolidates and challenges. [DEH B13]
- **critic-verifier** | agent | ST | Checks citations, claim register, arithmetic, policy, product truth and consistency; pass or block. [BACKEND §8.2] [EOSBP §7 Verifier] [ARCH-A]
- **tool-gateway** | system | SY | Owns schemas, auth, quotas, retries, snapshotting and capability records for every connector. [BACKEND §8.1] [DEH B16]
- **durable-workflow-engine** | system | SY | Persists runs across multi-day human waits, resumes, budgets per step, idempotent writes. [BACKEND §11 m5] [DEH B17]

##### B. Knowledge pipeline (internal tooling, SY unless noted)
- **intake-type-identifier** | skill | SY | Deterministic plus model format detection, with confidence and a held state. [BACKEND §3 s2, §8.2]
- **format-normaliser** (page-capture, screenshot-ocr, ad-video-normaliser, static-ad-ocr, transcript-normaliser, article-extractor, book-pdf-extractor, email-capture, ad-library-export, account-export) | skill set | SY | Per-format text, media manifest and locators. [BACKEND §3 s4] [DEH B04]
- **meaning-segmenter** | skill | SY | Cuts by meaning, keeping conditions, steps, tables and baselines. [BACKEND §3 s5] [DEH B05]
- **segment-role-classifier** | skill | SY | claim, exhibit, both or discard. [BACKEND §3 s6]
- **claim-extractor** | skill | SY | Assertions plus nearby conditions with spans. [BACKEND §3 s7a]
- **vocabulary-normaliser** | skill | SY | Rewrites against the metric dictionary without flattening CPA, CAC and cost per purchase. [BACKEND §8.2]
- **card-writer** | skill | SY | One claim per card, all fields. [BACKEND §8.2] [DEH B06] [EOSBP §4]
- **scope-classifier** | skill | SY | Counter-case test: baseline vs conditional. [BACKEND §3 s7a]
- **exhibit-annotator** | skill | CS | Fills page, ad and email annotation schemas from the vocabulary only. [BACKEND §3 s7b, §5.2]
- **vocabulary-proposer** | skill | SY | Proposes missing terms to the review queue. [BACKEND §8.2]
- **conflict-detector** | skill | SY | Flagship-model comparison against the nearest cards; conflict kind. [BACKEND §3 s9] [EOSBP §5]
- **review-queue** | system | SY | Approve, edit, reject, merge, split, request evidence, defer, with reasons. [BACKEND §3 s10] [DEH B09]
- **retrieval-service / context-packet-builder** | skill | SY | Filter-first retrieval, foundation never truncated, 3-valued eligibility, diversification, coverage report. [BACKEND §6] [DEH B10, B11]
- **eval-harness** | system | SY | Layered tests rerun on every change. [DEH B12] [BACKEND §11 m5]
- **module-dossier** (template) | asset | ST | 8-section research dossier per module. [DEH A06]
- **source-package** (template) | asset | SY | Source ID, dates, relevance, locators, evidence, access, review. [DEH A04]
- **controlled-vocabulary-v1** | asset | SY | About 120 terms across the OBJ/SEC/PRF/HOK/OFM/AWR/IND/PGT/CHN/SUR/DST tables. [BACKEND §2]
- **metric-dictionary** | asset | FN | One definition per metric. [BACKEND §11] [DEH M25] [EOSBP §16]

##### C. Brand workers
- **brand-profile-builder** | routine | ST | Weekly recompute of stage, AOV band, margin, signal quality, archetype. [BACKEND §8.2] [ARCH-A §10]
- **foundation-inspector** | routine | WS | Baseline detectors on snapshots -> pass, fail, unverified. 15 detectors referenced (defined in earlier docs). [BACKEND §8.2, §11 m1]
- **asset-family-reconstructor** | skill | AN | Rebuilds the ad account into campaign -> ad set -> ad -> creative -> copy -> destination; annotates owned exhibits. [BACKEND §4.4, §8.2]
- **voice-corpus-builder** | routine | RS | Reviews, tickets, search terms, comments -> weighted objections with quotes. [BACKEND §8.2]
- **brand-intake-and-readiness-check** | workflow | ST | Intake fields plus data readiness (timezone, currency, events, reconciliation). [EOSBP §3] [DEH M01]

##### D. Production workers
- **diagnostician** | skill | ST | Finds the real constraint, ranked with evidence. [BACKEND §8.2]
- **testable-brief-writer** | skill | CS | Brief with fixed and varied elements. [BACKEND §8.2] [EOSBP §11 brief contract]
- **claim-bound-copy-worker** | skill | CW | Headlines, body and CTAs from the claim register, with claim IDs. [BACKEND §8.2]
- **objection-weighted-page-builder** | skill | WS | Section order from objection weights; draft Shopify theme plus preview. [BACKEND §8.2] [DEH M11, M16]
- **image-slot-planner-producer** | skill | CPS | Image slot briefs, generation or designer packet. [BACKEND §8.2] [EOSBP §11] [DEH M12]
- **beat-by-beat-script-worker** | skill | CW | Shot list, spoken words, on-screen text, claim per beat. [BACKEND §8.2] [EOSBP §10]
- **sequential-scene-producer** | workflow | CPV | Per-scene candidates, continuity pack, selection, edit. [BACKEND §8.2] [DEH M18] [EOSBP §10]
- **paused-deployment-worker** | skill | PA | Builds campaign structure, naming and budget, all paused, plus read-back. [BACKEND §8.2]

##### E. Marketing layer
- **message-author** | skill | CS | Channel-free message from avatar, objection, offer and claim register. [BACKEND §7.1, §8.2]
- **channel-adapter** (meta, tiktok, snap, youtube, google-search-rsa, shopping-feed, seo-article, aeo-qa-block, email-beat, organic-post, creator-brief, partnership-packet, affiliate-kit) | skill set | PA/OG/RT/CR | Renders a message into a surface artifact under placement constraints. [BACKEND §7.2]
- **policy-disclosure-checker** | skill | PA | Category and platform policy, disclosure, permission state before upload. [BACKEND §7.3, §8.2]
- **feed-integrity-worker** | routine | PA | Shopping attributes, title structure, price and availability parity. [BACKEND §8.2] [DEH M20]
- **entity-schema-worker** | skill | OG | Structured data, spec tables, Q&A coverage. [BACKEND §8.2]
- **citation-panel-tracker** | routine | OG | Weekly 40-60 question GEO panel -> citation rate and source-gap list. [BACKEND §7.5, §8.2] [EOSBP §12 prompt panel]
- **creator-fit-scorer** | skill | CR | Shortlist on topical overlap, audience objection language and past brand work. [BACKEND §7.4]
- **partner-outreach-drafter** | workflow | CR | Drafts approach, brief and terms; outreach state machine; never sends. [BACKEND §7.4]
- **marketing-calendar-worker** | routine | ST | Content, organic and email calendar against seasonality, capacity and frequency caps. [BACKEND §8.2] [DEH M21 seasonal]
- **measurement-worker** | routine | AN | Baseline, experiment registration, readouts, maturity. [BACKEND §8.2] [EOSBP §16]

##### F. Customer-facing workflows
- **apply-exhibit-to-my-brand** | workflow | WS (any surface) | The 14-step apply path. [BACKEND §9]
- **show-formats-using-this-principle** | skill | CS | Pattern traversal across channels. [BACKEND §9]
- **show-where-this-fails** | skill | CS | `fails_with` traversal. [BACKEND §9]
- **find-5-similar-exhibits** | skill | CS | Structured-field similarity with diversification. [BACKEND §1.2]
- **reference-library-gallery** | system | CS | Faceted visible library with rights-aware rendering. [BACKEND §5.2, §11 m2]
- **brief-route-packet** | workflow | ST | Human-executable packet for any channel. [BACKEND §7.7]
- **product-page-foundation-repair** | workflow | WS | DEH first useful outcome. [DEH Working reference]

##### G. Channel workflows (EOSBP, ARCH-A, DEH)
- **meta-strategy-and-creative-test** (META01) | workflow | PA | Diagnosis -> concepts -> scripts and images -> review -> launch decision -> registry. [EOSBP §9, §19] [DEH M19]
- **video-creative-production** | workflow | CPV | Creator pack plus AI generation path, selection, edit plan, export approval. [EOSBP §10]
- **static-image-creative-production** | workflow | CPS | Reference bundle -> distinct compositions -> fidelity review -> crops. [EOSBP §11]
- **seo-audit-to-execution** | workflow | OG | Crawl -> blockers -> intent map -> content -> validate -> release log. [EOSBP §12] [ARCH-A §11]
- **aeo-answer-readiness** | workflow | OG | Question set -> clear answers -> structured data -> prompt panel. [EOSBP §12]
- **content-marketing-production** | workflow | OG | Research -> strategist -> brief -> writer -> verifier -> publish. [EOSBP §13]
- **lifecycle-email-flow-builder** | workflow | RT | Trigger, eligibility, suppression, sequence, copy, validation, test send, activation. [EOSBP §13] [DEH M21]
- **google-ads-strategy-execution** | workflow | PA | Import -> verify -> plan -> assets -> approve -> create -> verify. [EOSBP §14] [DEH M20]
- **landing-page-build-optimise** | workflow | WS | Brief -> outline -> copy and implementation draft -> review -> publish with rollback. [EOSBP §15] [DEH M11]
- **cro-experiment-design** | workflow | WS | Hypothesis, unit, MDE, stopping rule; low-traffic alternatives. [EOSBP §15] [DEH M15]
- **page-speed-diagnosis-fix** | workflow | WS | Template and device grouping, lab plus field data, staged fix, compare. [EOSBP §15] [DEH M13] [ARCH-A §13]
- **tracking-event-audit-reconcile** | workflow | FN | Event dictionary, dedupe, reconciliation vs orders. [DEH M14]
- **shopify-release-verify** | workflow | WS | Preview, test order, approve exact change, publish once, read-back, rollback. [DEH M16]
- **cx-journey-root-cause** | workflow | CX | Delivery, use and support events -> root cause -> upstream owner. [DEH M23]
- **supplier-quote-comparison-negotiation-prep** | workflow | OP | BOM and quote normalisation, should-cost, sample protocol, savings verification. [DEH M24]
- **profit-inventory-prioritisation** | workflow | FN | Reconciled contribution, cash and stock constraints -> priorities. [DEH M25]
- **market-demand-validation** | workflow | RS | [DEH M02]. **category-scorecard** | workflow | RS | [DEH M03]. **product-spec-validation** | workflow | OF | [DEH M04]. **existing-brand-expansion** | workflow | ST | [DEH M05]. **avatar-voc-jtbd** | workflow | RS | [DEH M06]. **untapped-angle-explorer** | agent | CS | [DEH M07]. **offer-economics-designer** | workflow | OF | [DEH M08]. **brand-strategy-voice** | workflow | BF | [DEH M09]. **store-setup-guide** | workflow | SY | [DEH M10].

##### H. ARCH-A specialist agents (predecessor roster; map onto the above)
- technical-seo-agent (OG), content-aeo-agent (OG), speed-agent (WS), cro-agent (WS), paid-social-creative-agent (CS), paid-social-account-agent (PA), paid-search-agent (PA), lifecycle-agent (RT), measurement-agent (AN), critic (ST). [ARCH-A §07]

##### I. Knowledge assets the docs say to create (not yet built)
- **pattern-library**: 25-40 named patterns, losers included [BACKEND §11 m4].
- **claim-register** per brand [BACKEND §11 m4].
- **placement-constraint-tables** per surface format [BACKEND §7.3].
- **policy-disclosure-rule-set** per channel [BACKEND §7.3].
- **brief-standard** per channel [BACKEND §11 m4].
- **foundation-checklist** (15 detectors) [BACKEND §11 m1].
- **30-page hand-annotation eval set** [BACKEND §11 m2].
- **200-query research bank across M01-M25** [DEH].
- **module evaluation packs** of about 10 questions each [DEH A07].
- **apply-path acceptance standard** [BACKEND §11 m3].

---

#### Doc notes

##### BACKEND: *Ecommerce OS: backend architecture*, Rev C
- **Path**: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\Docs\Ecommerce_OS_Backend_Architecture.pdf`, 154,800 bytes, 18 Sep 2026, 42 pages. I read it from the pdftotext extract (Windows-1252 encoded; tables collapse into narrow columns, which makes several tables hard to read: rights tiers, edge types, workers, connector order, model routing).
- **Purpose**: restates Kevin's described backend and gives a verdict ("the shape is right"), 6 corrections and a full data model. It specifies the marketing-wide message layer, the agent roster, the 5-month Kevin/Colin build plan, the cut list, definitions of done, failure modes and the decisions needed.
- **Audience**: Kevin and Colin (the builders). It addresses Kevin as "you".
- **Structure**: §0 restated architecture plus verdict; §1 6 corrections; §2 5 planes and vocabulary; §3 intake (11 stages); §4 worked intake examples; §5 the 2 libraries plus brand plane; §6 graph and traversal; §7 marketing layer (message, fan-out, channel dimensions, partners, SEO/AEO/GEO, universal annotation, brief vs connector route); §8 agent roster and model routing; §9 the apply interaction; §10 customer-delight principles and metric correction; §11 5-month plan; §12 cuts; §13 definition of done; §14 what will break; §15 decisions; "what I would produce next".
- **Quality**: high. It is the most concrete and internally consistent of the set, with schema-level detail (SQL-like tables) and explicit exit gates.
- **Small inconsistencies**:
  - "8 tables" vs 11 vocab tables listed.
  - "13 steps" vs 14 apply steps.
  - Module codes (OFF, AVT, LPG, ADC, CXP, MEA, MCR, CRO, EML) are never defined.
  - "15 detectors" refers to earlier docs and is not listed here.
- **Overlaps**:
  - Supersedes ARCH-A (same orchestrator rules, model routing, filter-first retrieval, warehouse advice, cut list).
  - Absorbs DEH's base/stage split, 3-valued eligibility, retrieval sequence and connector rules.
  - Adds what neither has: exhibits, rights tiers, vocabulary, graph edges, message layer, partners/outreach, SEO/AEO/GEO split.
- **Related file check**: `Ecommerce OS\tmp\pdfs\final_blueprint\input\ecommerce-os-architecture.txt` is **not** the same document. It is the **predecessor "architecture note"**, *The knowledge engine behind the Ecommerce OS*, Revision A, 16 Sep 2026 (about 29 pages, §01-§18). It is SEO-first, uses T0-T4 tiers, a 4-plane model, a 10-specialist roster, an 18-week 6-phase plan, and the gross-profit-per-purchase north star. No PDF of it was found in `Docs\`.
  - Its sibling inputs in that folder (`ecommerce-os-build-split.txt`, `ecommerce-os-what-good-looks-like.txt`, and a handbook .txt) feed `output\Ecommerce_OS_Complete_Product_Blueprint.md/.pdf`, which is outside my scope.
- **Rights**: own (Kevin with AI). It mentions processing third-party books (Hormozi) as `licensed`, but contains no copyrighted text.

##### DEH: *Ecommerce OS: Data Collection and Engineering Handbook* v1.0
- **Path**: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\output\Ecommerce_OS_Data_and_Engineering_Handbook.md`, 152,493 bytes, 1,620 lines, dated 16 Sep 2026.
- **Twins**:
  - `Docs\Ecommerce_OS_Data_and_Engineering_Handbook (1).pdf` and `output\pdf\Ecommerce_OS_Data_and_Engineering_Handbook.pdf` are **byte-identical** (md5 b8418014…, 213,045 bytes, 58 pages).
  - `tmp\pdfs\build_handbook\content.md` (151,220 bytes) is the **same text** in the PDF build markup (`@@PAGE` headers, `Q:` query prefixes, `~` callouts), with no substantive content differences.
  - `tmp\pdfs\final_blueprint\input\Ecommerce_OS_Data_and_Engineering_Handbook.txt` is a pdftotext of the PDF.
- **Purpose**: the shared work manual dividing the work between Kevin (collection: dossiers, sources, business meaning) and his brother (engineering: pipeline, cards, retrieval, connectors, workflows). It "translates the Customer Delight Architecture v1.1 into a collection and implementation plan".
- **Audience**: Kevin ("you") and his brother.
- **Structure**:
  - Working reference and navigation.
  - Part I: A01-A06 collection method; M01-M25 module pages (decision, collect, 8 queries, base/stage, handoff, builds, joint acceptance); A07 quality gate; A08 first cycle.
  - Part II: B01-B21 engineering (scope, architecture, records, extraction, segmentation, card schema, worked fixture, routing, review/versioning, retrieval, context, evals, research/storefront/commercial workflows, connectors, durable workflows, access, milestones E01-E06, operations, joint acceptance).
  - References R01-R12 (official docs checked 16 Sep 2026).
- **Quality**: high and careful, with the most complete *function map* of an ecommerce business (25 modules from intake to profit and inventory). It is hedged throughout ("proposals, not standards"). It is weaker on concrete schemas than BACKEND and has no channel/message layer.
- **Overlaps**: base/stage, 3-valued eligibility, retrieval sequence, review states and connector rules are reused almost verbatim in BACKEND. Its module numbering (M01-M25) is the best candidate for the catalogue's area/sub_area map.
- **Rights**: own. The search queries reference public sites; there is no third-party content.

##### EOSBP: *Ecommerce Operating System Blueprint* (docx)
- **Path**: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\output\ecommerce-blueprint\Ecommerce Operating System Blueprint.docx`, 150,752 bytes, 16 Sep 2026 (file time 09:21), about 20 pages. It has 3 embedded figures (system, retrieval and video flow diagrams), which I did not open.
- I read it from `%TEMP%\eos_inv\text\EOS_Blueprint_docx.txt`. The text extract stops at the "Decisions to record before implementation" heading; I recovered that final paragraph from the docx XML.
- **Possible twin or review**: `Ecommerce OS\tmp\ecommerce-blueprint\blueprint-review.pdf` and `architecture.png` (not opened).
- **Different document, despite similar names**: `Docs\Ecommerce_OS_Business_in_a_Box_Blueprint.docx` and the `ecommerce-business-in-a-box-blueprint*.pdf` files.
- **Purpose**: the first implementation plan, recommending "build this system", starting with Meta creative strategy and production.
- **Audience**: Kevin as founder/product owner.
- **Structure**:
  - §1 recommendation and 5 decisions.
  - §2-§8 shared system: 5 records, new vs established brands, knowledge library and card schema, contradictions, retrieval, orchestration (6 roles, task contract, states), storage and integrations.
  - §9-§15 channel workflows: Meta, video, image, SEO/AEO, content and email, Google Ads, landing pages/CRO/speed.
  - §16 measurement and learning; §17 6 phases; §18 quality controls; §19 a complete META01 example; §20 references [1]-[7]; decisions to record.
- **Quality**: good and concise. It has the best *channel workflow* step lists and creative-production lineage. It is generic on data model and vocabulary, with no exhibits, rights tiers or message layer.
- **Overlaps**: largely superseded by BACKEND (architecture) and DEH (modules), but it is the unique source for META01, the video and image production procedures, the email activation checklist, the Google Ads process and the experiment-registry fields.
- **Rights**: own.

##### Cross-document observations for the catalogue
- **Best master taxonomy**: DEH M01-M25 (business functions) crossed with BACKEND §7.2 channels (marketing surfaces) crossed with BACKEND §8.2 workers (agents).
- **Reconcile in the catalogue**:
  - BACKEND 3-letter module codes vs M-numbers.
  - The 4 versions of brand-stage labels.
  - Card-type lists (BACKEND vs DEH).
  - The 3 roadmaps (ARCH-A 18 weeks, EOSBP 6 phases, DEH E01-E06, BACKEND 5 months; BACKEND is current).
- **Missing across all three**:
  - The 15 foundation detectors are referenced but not listed.
  - No pricing or packaging of Ecommerce OS itself.
  - Thin on SMS, marketplaces (Amazon is absent), wholesale/retail and international/tax specifics.
  - Customer support tooling (helpdesk integrations such as Gorgias are not named).
  - Reviews platforms are not named as connectors, even though reviews feed the voice corpus.
  - Subscription apps are absent.
- None of the docs contain instructions aimed at an AI that would conflict with this task. They are written to Kevin and Colin.


---

# Appendix C. Lifecycle set: LIFECYCLE, DELIGHT, IDEAMAPS, DECKv2

### Ecommerce Business Model - Master Map of Parts (source set C)

Inventory agent C. Read-only extraction from four Ecommerce OS planning documents. Purpose: the master map of
ecommerce business parts (stages, functions, lifecycle, delight moments, workflows, KPIs, human vs AI roles,
idea maps) for the prompt -> skill -> routine -> workflow -> agent -> system parts catalogue.

#### Source short-names and page tagging

| Tag | Document (main path under `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\Docs\`) | Date / version | Pages | Text used |
|---|---|---|---|---|
| LIFECYCLE | Ecommerce_OS_Complete_Lifecycle_Blueprint.pdf | 9 Sep 2026, v1.0, "Prepared for Kevin" | 56 | `tmp\pdfs\lifecycle_content.md` (build source) |
| DELIGHT | Ecommerce_OS_Customer_Delight_Architecture.pdf | 16 Sep 2026, v1.1 | 40 | `tmp\pdfs\customer_delight\content.md`; diffed vs `before_v1_1.md` (v1.0) |
| IDEAMAPS | Ecommerce idea maps.pdf | 7 Sep 2026 | 21 | `eos_inv\text\Ecommerce idea maps.txt` |
| DECKv2 | Ecommerce-OS-Deck-v2.pdf | 3 Sep 2026 | 34 slides | `eos_inv\text\Ecommerce-OS-Deck-v2.txt` |

Tag conventions:
- `[LIFECYCLE §07 p18]` = playbook number as printed + PDF page (PDF page = build-file page ordinal + 1; page 1 is the cover).
  Unnumbered pages use the page title, e.g. `[LIFECYCLE Economics p6]`.
- `[DELIGHT §17]` = section number as printed in the page kicker (PDF page = § + 1; page 1 is the cover).
  `[DELIGHT v1.0 §2]` = content only in the prior version (before_v1_1.md).
- `[IDEAMAPS 3.8 p13-14]` = the doc's own Part/section number + PDF page (from form-feed page breaks).
- `[DECKv2 s19]` = slide number.

---

### PART A. CROSS-DOC SYNTHESIS (the spine of the master map)

#### A1. Stage model: launch -> grow -> scale

The four docs use different but compatible stage ladders. Combined:

| Master stage | DELIGHT v1.0 maturity stage [DELIGHT v1.0 §2] | DELIGHT v1.1 CRO stage card [DELIGHT §2] | LIFECYCLE gate [LIFECYCLE System map p3] | LIFECYCLE rollout phase [LIFECYCLE Rollout p38] | IDEAMAPS/DECK switch-on [IDEAMAPS Part 7 p19; DECKv2 s31] |
|---|---|---|---|---|---|
| 0 Explore / prelaunch | Exploring / prelaunch: specific problem, product hypothesis, supply route, next validation decision. Defer catalogs, automation, cosmetic split tests | CRO.STAGE.01 Prelaunch: preview review, usability tasks, test orders | G1 Demand; G2 Supply | Foundation (context, owners, finance definitions, data pack, decision authority) | (not covered: IDEAMAPS/DECK assume an existing selling brand) |
| 1 Launch / first sales, low traffic | First sales / low traffic: reliable checkout, clear promise, feedback; qualitative learning before fine CRO | CRO.STAGE.02 Early, low traffic: interviews, objection analysis, offer learning | G3 Launch (checkout, tracking, stock, delivery promise verified) | Useful manual system (skills run with files, prompts for first creatives) | Day 1 catalog images; Week 1 speed + weekly report + pixel/CAPI + daily log |
| 2 Grow / repeatable demand | Repeatable demand: measured acquisition + fulfilment, mature cost/return data; improve strongest offer/creative/lifecycle | CRO.STAGE.03 Repeatable demand: controlled page/offer experiments | G4 Scale (contribution and cash survive downside case) | Reliable routines (imports, checks, delivery messages, lifecycle eligibility, experiment/cost/stock routines) | Week 2 COGS + GPP + research pass; Week 3 creative loop; Month 2 COD/RTO, negative signals, bid rules, abandoned cart, app audit, incentives |
| 3 Scale / complexity rising | Scaling: incremental growth without margin/service/cash loss; experiment portfolio, adjacencies, segmentation, supplier economics | CRO.STAGE.04 Scaled operations: experiment coordination, segment analysis, incrementality | G5 Retain (product use + service support repeat purchase) | Selective agents (one adaptive investigator/coordinator per recurring unresolved problem) | Month 3 CRO system, courier routing/NDR, return loop, sequence personalisation, support tracking, AEO/content, influencers |
| 4 Large / $50M+ | Large: coordination across categories/markets/teams/agencies; governance, forecasting, incrementality, cost engineering, market expansion | (covered by STAGE.04 + DELIGHT §36 multi-market/agency) | - | - | Month 4+ inventory forecasting, supplier scorecards, material bands, video loop, new channels, marketplaces, loyalty |

Rules that cut across stages:
- Universal base standards apply at every revenue level; stage cards only add methods [DELIGHT §2, §6].
- Existing brands enter at the earliest unreliable gate; a new brand should not automate an unvalidated model [LIFECYCLE System map p3].
- "Visibility first, lever second": high-visibility wins buy trust for high-lever changes [IDEAMAPS scoring p1].
- Low traffic = big swings / qualitative research; high traffic = element-level tests [IDEAMAPS 3.7 p13; DELIGHT §22].
- Revenue is a descriptor, not a routing rule; route by business, market, product and workflow maturity [DELIGHT v1.0 §2].

#### A2. Two journeys, one operating system (lifecycle spine) [LIFECYCLE System map p3]

| # | Stage | Business journey | Customer journey | Customer-lifecycle label | Matching IDEAMAPS / DECK part |
|---|---|---|---|---|---|
| 1 | Discover | Find demand, segments, unmet needs, viable products | Recognise a need; look for a credible solution | Pre-awareness / need | IDEAMAPS 3.1 research; DECK P01 |
| 2 | Make viable | Validate product, supply route, landed cost, working capital | See a product that fits the real use case | (business side) | IDEAMAPS 2.1-2.4; DECK P10 |
| 3 | Position | Select avatar, problem, angle, proof, offer | Understand relevance, benefits, trade-offs | Awareness | IDEAMAPS 3.1-3.2 |
| 4 | Acquire | Build store, landing pages, channel content | Discover, click, compare, build trust | Awareness -> consideration | IDEAMAPS 3.2-3.6; DECK P02-P06 |
| 5 | Convert | Remove friction; bundles, payment choices | Choose variant; understand full cost; pay | Purchase | IDEAMAPS 3.7-3.8; DECK P04, P07 |
| 6 | Deliver | Pick, pack, ship, communicate, resolve exceptions | Know what happens next; receive on time | Delivery | IDEAMAPS 2.6, 3.9; DECK P09 |
| 7 | Activate | Teach setup, care, successful use | Experience promised result with little effort | Onboarding / first use | LIFECYCLE §19-20; DELIGHT §29 |
| 8 | Retain | Recover problems, replenish, cross-sell, develop products | Continued value; return and recommend | Support -> retention -> advocacy | IDEAMAPS 3.10-3.11; DECK P08 |

Five feedback paths [LIFECYCLE System map p3]: returns -> research; support -> conversion; inventory -> acquisition;
retention -> offer design; profit -> priorities. Four feedback loops [DELIGHT §4]: CX -> product and promise;
experiments -> avatars and offers; economics -> acquisition; research -> portfolio.

#### A3. Master function / department list (union of all four docs, with schema area code)

| Function | Area | LIFECYCLE | DELIGHT | IDEAMAPS | DECKv2 |
|---|---|---|---|---|---|
| Business context, onboarding, decision authority | ST/SY | Foundation p5 | §5 | Part 6 | s10 Connect/Audit |
| Market research | RS | §01 p12 | §10 | 3.1 | P01 |
| Category research | RS | (in §01/§02) | §11 | - | - |
| Product research / product development | OF | §02 p13 | §12 | 2.1 sample-to-launch | - |
| Existing-brand expansion / portfolio | ST | §21 new-product launch | §13 | 3.4 marketplaces | - |
| Manufacturing / make-vs-buy | OP | §03 p14 | §30 (BOM) | - | - |
| Supplier sourcing & management | OP | §04 p15 | §30 | 2.1 | P10 supplier tracking |
| Input-cost / FX / commodity exposure | FN | §05 p16 | - | 2.2 | - |
| Inbound logistics / landed cost | OP/FN | §04 landed cost | §30 | 2.3 | P10 landed cost |
| Customer intelligence / avatars / VOC | RS | §06 p17 | §15 | 3.1 VOC, personas | P01 personas |
| Opportunity discovery / angles | CS | §06 matrix | §16 | 3.1 angle map | P01 angle map |
| Offers & pricing | OF | §07 p18 | §17 | 2.2 pricing bands | - |
| Brand foundations & launch setup (domain, email) | BF | (Prompt foundation p39 brand context) | §18 | - | - |
| Store build & apps | WS | §08 p19 | §19, §23 | 2.5 app audit | P04 |
| Landing pages / PDP / CRO | WS | §09 p20 | §19, §22 | 3.6, 3.7 | P04 (s16) |
| Product imagery / catalog | CPS | Image library p40-47 | §20 | 3.6 catalog refresh | P06 |
| Site performance / speed | WS | §09 speed | §21 | 3.5 | P04 (s15) |
| Experimentation | AN/WS | Measurement strategy p11, L1-L3 | §22 | 3.7, App A | s8 pattern |
| Cart, checkout, payments, COD | WS | §10 p21 | §23 commerce tests | 3.8 | P07 |
| Meta acquisition / creative | PA/CS | §11 p22 | §24, §26 | 3.2, 3.3 | P02, P03 |
| Video production | CPV | Video library p48-51 | §25 | 3.2 video loop | P02 video next |
| Google acquisition (Search, Shopping, PMax, YouTube) | PA | §12 p23 | §26 | 3.3 new channel pilots | P03 pilots |
| Ad optimization / media buying rules | PA/AN | §13 p24 | §26 controls | 3.3 | P03 |
| SEO / AEO / content / organic social | OG | §14 p25 | §28 | 3.4 | P05 |
| Influencers & partners | CR | §15 p26 | - | 3.4 influencer outreach | - |
| Marketplaces | PA/OG | Scope note p2 (optional channel) | §14 (data source) | 3.4 | s32 India marketplaces |
| Owned channels (email/SMS/push/chat/WhatsApp) | RT | §16 p27 | §27 | 3.10 | P08 |
| Lifecycle communications (state-based) | RT | §17 p28 | §27 | 3.9, 3.10 | P08 |
| Fulfilment & delivery / couriers | OP | §18 p29 | §29 | 2.6, 3.9 | P09 |
| Unboxing & wow moments | CX | §19 p30 | §29 | 3.9 packaging insert | - |
| Use, support, returns, disputes | CX | §20 p31 | §29 | 3.9, 3.11 | P09 return loop |
| Retention, VIP, loyalty, referral, subscription | RT | §21 p32 | §27, §29 | 3.10 | P08 |
| Inventory, cash, alignment | OP/FN | §22 p33 | §31 cash exposure | 2.4 | P10 |
| Ops leanness (apps, SaaS) | SY | §08 app decision sheet | - | 2.5 | - |
| Economics / profit / attribution / reporting | FN/AN | Economics p6-p11 | §31 | Part 1, Part 5 | Foundation s23-s24 |
| Data foundation / events / tracking QA | AN/SY | p9-p10 | §23, §32, §37 | 1.4 CAPI | s24 pixel/CAPI |
| People, roles, incentives, adoption | ST | §22 incentives, Rollout roles p38 | §36 team | Part 4 | s26-s29 |
| AI operating platform (orchestration, records, controls) | SY | Execution model p4, agents p37 | §7, §8, §32, §35-37 | Part 6 | s4-s10 |

#### A4. Full customer lifecycle (awareness -> purchase -> delivery -> support -> retention -> advocacy)

1. Need recognition / research (pre-awareness): job, trigger, current alternative [LIFECYCLE §01 p12; DELIGHT §10, §15; IDEAMAPS 3.1 behaviour trigger map p8].
2. Awareness - seeing the ad / organic / creator / search / AI answer [LIFECYCLE §11-§15; IDEAMAPS 3.2-3.4; DECKv2 P02, P05].
3. Click and arrival - landing speed, message match [LIFECYCLE §09 p20; IDEAMAPS 3.5; DECKv2 s15].
4. Evaluation / browsing - PDP, catalog, navigation, reviews, fit guide, variant chooser [LIFECYCLE §09; DELIGHT §19-§20; IDEAMAPS 3.6].
5. Cart - editable variant/qty, compatibility, subtotal, delivery estimate, threshold, cross-sell [LIFECYCLE §10 p21; IDEAMAPS 3.8 cart nudges].
6. Checkout & payment - guest flow, wallets/UPI, full charges, ETA, COD confirmation, RTO risk tiering, partial COD [LIFECYCLE §10; IDEAMAPS 3.8; DECKv2 P07].
7. Order confirmation & post-purchase upsell [LIFECYCLE §10; IDEAMAPS 3.9 thank-you page].
8. Waiting / fulfilment - release, pick/pack, carrier, tracking, exceptions, NDR [LIFECYCLE §17-§18; IDEAMAPS 3.9; DECKv2 P09].
9. Delivery & unboxing - 20 wow candidates, quick-start, QR guide [LIFECYCLE §19 p30; DELIGHT §29 unboxing].
10. Activation / first use - SKU steps, common mistakes, care [LIFECYCLE §17 first-use window, §20; DELIGHT §27 product activation].
11. Support / problem - first-line, complex exception, returns/exchanges, disputes [LIFECYCLE §20 p31; IDEAMAPS 3.11; DELIGHT §29 "a problem"].
12. Feedback / review - neutral review request after real use, no sentiment incentive [LIFECYCLE §17, §20; IDEAMAPS 3.10 review ask].
13. Retention - replenishment, cross-sell, next product, subscription, winback [LIFECYCLE §21 p32; IDEAMAPS 3.10; DECKv2 P08].
14. VIP / loyalty / referral / advocacy - VIP by retained contribution; referral only if numbers pay [LIFECYCLE §21; IDEAMAPS 3.10; DECKv2 s20].
15. Lapse / at-risk / sunset [LIFECYCLE §17 at-risk; DELIGHT §27 recovery/win-back].

#### A5. KPI spine per stage (union)

- North star: retained CM2 dollars subject to cash, CX and quality constraints [LIFECYCLE Economics p6]; IDEAMAPS/DECK north star = gross profit per purchase (GPP) and monthly GP/contribution margin [IDEAMAPS 1.2 p2-3; DECKv2 s24]. Note: IDEAMAPS "GPP" deducts ad cost, so it is closer to LIFECYCLE CM2 per order than to LIFECYCLE GP.
- Research: cost/time to decision, % assumptions evidence-backed, paid-demand test outcomes [LIFECYCLE §01]; CTR and nGPP of research-born tests [IDEAMAPS 3.1].
- Product/supply: willingness to buy, sample failure rate, use success, landed COGS/sellable unit, first-pass yield, supplier OTIF, lead-time variance [LIFECYCLE §02-§04; IDEAMAPS 2.1].
- Acquisition: outbound CTR, landing arrival rate, new-customer CAC, mature CM2, CM2 per 1,000 impressions, frequency/fatigue [LIFECYCLE Measurement p7, §11]; nGPP, CAC, MER, share of spend on positive-GPP campaigns, RTO of paid orders, test velocity, win rate [IDEAMAPS 3.2-3.3].
- Conversion: product engagement, ATC rate, cart-to-checkout, checkout completion, website conversion, payment success, GP per session [LIFECYCLE p7]; checkout-to-purchase, RTO rate, prepaid share, chargeback rate, net GPP/order [IDEAMAPS 3.8]; Core Web Vitals LCP<=2.5s, INP<=200ms, CLS<=0.1 at p75 [LIFECYCLE §09; DELIGHT §21].
- Delivery: order accuracy, dispatch on time, delivery on time, order-to-delivery median/p90, WISMO contact rate, first-scan lag, RTO, damage [LIFECYCLE Measurement p8, §18]; NDR-to-delivered rate [IDEAMAPS 3.9].
- Activation/support: activation rate, first-contact resolution, customer effort, resolution time, return/dispute rates, avoidable returns [LIFECYCLE p8, §20]; follow-up rate, conversation-to-order rate, ticket volume by reason [IDEAMAPS 3.11].
- Retention: second-purchase rate, contribution LTV at X days, cash payback, repeat-order probability, time to second purchase [LIFECYCLE p8, §21]; repeat purchase rate, 90/180-day GP per customer, flow revenue per recipient, deliverability [IDEAMAPS 3.10].
- Inventory/cash: sellable stock cover, inventory return (GMROI-like), stock-out days top 20 SKUs, cash tied in stock, cash forecast accuracy [LIFECYCLE p8, §22; IDEAMAPS 2.4].
- Founder/product delight (the OS itself): time to first useful decision, approval-to-verified-release time, review minutes per change, completed improvement cycles, correction rate, repeated use [DELIGHT §3].

#### A6. Human vs AI split - the shared execution vocabulary

- LIFECYCLE codes [Execution model p4]: H Human | P Prompt | S Skill | R Routine | L Loop | A Agentic workflow. Decision rule: quick human access step -> prompt if inputs present -> skill if repeated -> routine if predictable -> loop if needs iteration -> agent only if evidence picks the next step.
- Automation economics: Net value/month = labour saved + measured incremental contribution - tool - review - maintenance - expected error/rework cost [LIFECYCLE p4].
- DELIGHT autonomy ladder [§8]: read & analyse -> prepare drafts -> execute reversible internal work -> release within standing limits -> escalate new financial commitments/exceptional risk.
- DELIGHT layers [§7]: business orchestrator -> 12 domain orchestrators -> specialist workers -> validators; deterministic code for calculations/permissions/joins/API ops; models for interpretation, synthesis, creative options, adaptive investigation.
- IDEAMAPS/DECK: "AI has no taste. That's your job" - humans approve, pick angles, judge creative; agents do setup, research, execution, monitoring; nothing goes live without OK [DECKv2 s7, s10; IDEAMAPS 3.2 intake trigger word].
- Always-human (all docs): physical checks, samples, supplier relationships/contracts/POs/bank details, price policy & guarantees, capital/funding decisions, negotiation, fraud/unusual refunds, creator relationships, publishing authority, hedging decisions [LIFECYCLE §03-§05, §10, §15; DELIGHT §30].
- Never (per docs): agents executing FX/commodity trades, deposits/contracts, unsolicited outreach without authority, fabricated proof/testimonials/scarcity, fighting platform-native bidding with continuous edits [LIFECYCLE §05, §13, §15, A2].

---

### PART B. LIFECYCLE - Complete Lifecycle Blueprint (56 pp) - detailed outline

#### B1. Front matter and system foundations
- Cover: "From market opportunity to repeat purchase" - 01 start with profit and customer outcomes; 02 simplest reliable execution method; 03 measure, learn and improve the whole journey [LIFECYCLE cover p1].
- Read first [p2]: purpose (physical-product ecommerce, first hypothesis -> profitable repeat purchase); operating principle (people for access/physical/relationships/judgment; P/S/R/L/A by fit); scope (own store, Meta+Google first; SEO, organic, influencers, email/SMS/push, fulfilment, support, returns, retention, inventory, cash; marketplaces optional; manufacturing and subscriptions when relevant); country-neutral, USD examples; reading routes; evidence limits; definition of success = more retained contribution + healthier cash + fewer founder hours + better customer outcomes.
- System map [p3]: 8-stage two-journey table (A2), 5 feedback paths, decision gates G1 Demand, G2 Supply, G3 Launch, G4 Scale, G5 Retain.
- Execution model [p4]: H/P/S/R/L/A table with examples; 5-step decision rule; automation net-value formula; worked example (3-minute export vs 2-hour integration).
- Foundation - minimum input pack [p5]:
  - Inputs: business brief; product and cost files; sales and service exports; marketing exports; customer evidence; brand facts.
  - Shared object chain: opportunity -> product -> supplier/specification -> avatar -> problem -> angle -> offer -> creative -> page -> experiment -> order -> shipment -> customer cohort (stable IDs).
  - Evidence record fields; version record (flags dependents when a dimension changes).
  - Data handling: merchant owns accounts; role-limited access; no payment details/credentials in model context.
  - Owner decisions set once: risk capital, minimum contribution, max cash exposure, discount floor, allowable service credits, channel contact policy, publishing authority, emergency stop rights.
  - Starting packs: new brand (brief, 3 candidate products, customer evidence, preliminary costs) vs existing brand (+ full trading period + older orders).

#### B2. Economics and measurement (pp 6-11)
- Economics [p6]: Net revenue; Gross profit (GP); GP per purchase; CM1 (GP - payment, outbound fulfilment, packaging, service/return); CM2 (CM1 - acquisition & retention marketing); Operating profit; Cash available. Worked order ($70 -> $65 net -> $40 GP -> $28 CM1 -> $9 CM2). Allowable new-customer CAC ceiling ($22 example). EBIT-led price planning as feasibility constraint. Primary objective: maximise retained CM2.
- Acquisition & checkout metric dictionary [p7]: outbound click rate; landing arrival rate; product engagement; ATC rate; cart-to-checkout; checkout completion; website conversion; payment success; GP per session; GP per 1,000 views; CM2 per 1,000 impressions; "what a view means" denominator rules; ownership (growth=traffic defs, ecommerce=funnel, finance=GP/CM, analytics=joins).
- Delivery, retention and business health [p8]: order accuracy; dispatch on time; delivery on time; order-to-delivery median/p90; WISMO rate; activation; return/dispute rates; second-purchase rate; contribution LTV at X; cash payback; sellable stock cover; inventory return. Four dashboard views: Founder, Growth, Operations, Finance/data. Daily numbers provisional; publish cohort maturity.
- Data foundation [p9]: CMP vs CAPI roles; data path (store + orders + consent -> validated events -> adapters + reporting -> profit joins -> reconciliation -> dashboards); event groups (identity/context; shopping behaviour; purchase; refund/cancellation; operational outcome; internal economics); acceptance checks (uniqueness, completeness, reconciliation orders->payments->refunds->payouts->bank, timeliness, privacy). Owner/output: signed-off event dictionary, reconciliation report, exceptions queue.
- Platform verification [p10]: Meta Pixel + CAPI (dedup by event name + ID); Google purchase (transaction ID, one primary goal); enhanced conversions; cart data + COGS (Merchant Center); CMP and tags (accept/reject/partial/withdrawal). 12 minimum test cases (normal, discounted multi-item, shipping/tax, alt currency, failed payment, confirmation reload, wallet/redirect, partial refund, cancellation, post-purchase upsell, browser+server, denied consent). Deliverable: test-case log. Split: human setup access, routine repeat checks, agent investigates unexplained failures.
- Measurement strategy [p11]: attribution vs incrementality; configure windows deliberately (Meta March 2026 link-click change noted); touchpoint distribution (never a universal number); 5-step improvement loop (diagnose -> hypothesis -> predefine sample/effect/spend cap -> randomise with holdout -> compare incremental contribution and decide ship/iterate/stop/inconclusive); low-volume guidance; priority formula = expected incremental CM2 x confidence / effort, constrained by cash and risk.

#### B3. The 22 lifecycle playbooks (each: decision, customer question, owner, tasks with method codes, deliverable, metrics, gate)

##### 01 Market research [LIFECYCLE §01 p12]
- Decision: which market/segment/unmet need deserves the next research dollar. Owner: founder/product lead.
- Tasks: Map the market (S, segment map); Map demand (S, search terms/reviews/forums/tickets/competitor offers with provenance); Investigate an evidence gap (A, bounded research brief); Test the need (H+S, interviews on recent behaviour); Rank opportunities (S, score urgency, buying evidence, reachable demand, differentiation, economics, operational difficulty).
- Deliverable: opportunity brief per segment (job, alternative, dissatisfaction, price corridor, trigger, channels, barriers, evidence IDs, unknowns, cheapest disconfirming test).
- Metrics: cost/time to decision; % assumptions evidenced; demand test outcomes. Gate: small shortlist + stop reason. Anti-pattern: agent browsing for a report the founder already has.

##### 02 Product research [§02 p13]
- Decision: sell existing / customise / bundle / develop new. Owner: product lead.
- Tasks: Candidate discovery (S, A only for genuine gap); Product gap analysis (S, review-to-feature matrix, failure modes); Route comparison (S, capital, MOQ, lead time, quality); Concept and specification (P concepts, S requirements + claims register); Validation (H+L, prototypes, fit checks, limited demand tests).
- Innovation hierarchy: instructions, packaging, sizing clarity, accessory, bundle -> materials, mechanisms, tooling.
- Product brief fields; validation ladder (problem interviews -> concept -> sample -> usability/quality -> small commercial test -> repeatable supply); pre-order honesty.
- Metrics: willingness to buy, sample failure, use success, expected contribution, inventory required, time to validated supply; return-driver scoring pre-launch. Gate + no-go list.

##### 03 Manufacturing / make-vs-buy [§03 p14]
- Costed BOM and process (material grade, qty, cost, supplier, yield/scrap, MOQ, lead time + labour, machine time, QC, packaging; variable vs fixed).
- Tasks: Normalize BOM and quotes (S); Compare scenarios (S, low/base/high); Identify process risks (S + H); Track batches (R); Improve yield (L).
- Break-even example ($60k / ($18-$12) = 10,000 units). Deliverables: BOM, process route, acceptance tests, make/buy model, tooling ownership, capacity plan, cash schedule.
- Metrics: landed COGS per sellable unit, first-pass yield, rework rate, lead time, utilisation, on-time completion, WIP cash. Human-led: process design, sample sign-off, equipment, supplier accountability.

##### 04 Supplier sourcing [§04 p15]
- Tasks: Prepare RFQ (S); Find candidates (H shortlist / A bounded discovery); Compare quotations (S normalise currency, Incoterm, MOQ, tooling, packaging, inspection, freight, duty, lead time, payment); Negotiate (P/S brief; A for authorised follow-ups); Validate and select (H+S samples, capability checks, scorecard).
- RFQ/negotiation checklist; negotiate the whole deal (MOQ, staged qty, terms, defect credits, spares); comparable landed cost formula; Alibaba Trade Assurance caveat.
- Metrics: landed cost variance, quote completeness, sample pass rate, supplier OTIF, batch defects, lead-time variation, concentration, working capital. Gate: primary + contingency supplier, signed spec, costed order.

##### 05 Input-cost exposure / hedging [§05 p16]
- Exposure register: FX payable; material/commodity; freight and fuel; supplier interruption; demand/inventory risk - each with first practical response + automation allocation.
- 5-step decision test (measure net exposure; stress CM2/cash; compare accept vs operational vs hedge; hedge only within policy; reconcile hedge + purchase). Example 10% FX move on $100k payable. No agent executes trades.

##### 06 Avatar and angles [§06 p17]
- Avatar = pattern of circumstances, goals, buying behaviour (functional goals, emotional desires, social aspirations, alternatives, barriers, triggers, objections, language, evidence strength).
- Worked matrix (drawer dividers): 5 rows avatar/context -> problem/desire -> angle -> proof -> landing path.
- Allocation: H evidence; S cluster avatars/problems/objections; P angles/hooks from one row; L message tests; A only for unexplained differences.
- Rule: each creative brief = one row, one promise, one proof unit, one offer, one destination. Metrics: contribution per landing visitor by matrix row, return reasons, message complaints. Output: avatar/problem/angle matrix + message-to-page map.

##### 07 Offers and pricing [§07 p18]
- Offer structures: single product; volume/tiered; bundle/kit; good/better/best; subscription/replenishment; gift/threshold shipping; launch/seasonal.
- Offer as complete object (price, inclusions, exclusions, variant, tax display, threshold, delivery range, guarantee, savings basis, eligibility, dates, inventory dependency) + separate upsell/cross-sell/post-purchase map.
- Methods: P concepts; S deterministic calculator; R price/discount consistency across store/feed/ads/email; L offer vs control; H price policy approval. Two-pack worked example (+$6 CM1). No fake countdowns/invented savings/preselected extras.
- Output: offer sheet, economics model, compatible product map, customer-facing terms, test brief.

##### 08 Store and apps [§08 p19]
- Capabilities: catalog & theme; checkout & payments; reviews & proof; email & service; bundles/subscriptions; consent & measurement - "start with" vs "add complexity only when".
- Launch checklist: product truth; commerce; experience/accessibility; operations; data (p10 matrix).
- App decision sheet (problem, native alternative, cost, data access, performance impact, owner, removal plan). Metrics: checkout success, responsiveness, payment success, support burden, app cost per order, contribution per visitor.

##### 09 Landing pages and CRO [§09 p20]
- Page architecture: ad promise -> matched headline/visual -> situation -> mechanism -> demonstration/proof -> fit/spec -> offer -> delivery/returns -> objections/FAQ -> purchase.
- Personalisation by campaign/angle parameters with neutral fallback.
- Tasks: Message-match audit (S); Page generation (P/S); Page QA (R); CRO (L); Unexplained failure (A).
- Page speed: CWV thresholds, field vs lab, prioritise hero media, scripts, layout shift. Output: page/angle map, page modules, mismatch backlog, performance report, experiment decision.

##### 10 Cart to post-purchase [§10 p21]
- Touchpoints: Cart; Cross-sell; Checkout; Order confirmation; Post-purchase upsell; Recovery (cart/checkout reminders).
- Route rules (stock, compatibility, prior purchases, region, open service issues); order amendment hygiene (no second full-basket purchase event).
- Payment options comparison; COD markets track confirmed/dispatched/delivered/collected/RTO separately.
- Gate: customer can explain what they bought, total charge, arrival, help route.

##### 11 Meta acquisition [§11 p22]
- Account structure as hypothesis; separate testing vs scaling where useful; broad/automated vs inputs as testable choices; new vs existing customer separation.
- Creative brief pipeline: avatar -> problem -> angle -> claim/proof -> format -> hook -> visual/script -> offer -> CTA -> page; asset IDs, rights, version, hypothesis.
- Splits: P hooks/images; S brand/evidence/layout rules; H real footage, rights, claim approval; R naming, resizing, export checks, performance joins; L experiments; A cross-system diagnosis.
- Placement QA (Reels 9:16, captions, safe zones); learning sequence (few distinct concepts, then hook/proof/offer). Weekly keep/iterate/stop brief.

##### 12 Google acquisition [§12 p23]
- Workstreams: Search (brand vs nonbrand; product/problem/comparison/informational intent); Shopping/feed; Performance Max; YouTube/Demand Gen; Remarketing.
- RSA limits (15 headlines/4 descriptions, 30/90 chars); feed and profit setup (item IDs match; COGS != CM2 bidding). Output: account map, feed exception report, conversion goal record, experiment backlog.

##### 13 Ad optimization [§13 p24]
- Diagnostic table: clicks up/arrivals down; arrivals stable/cart down; carts stable/purchases down; ROAS up/CM2 down; CAC worse/CTR holds; orders grow/cash tightens.
- Daily routine (freshness, spend vs limits, checkout health, feed/stock exceptions); weekly loop (reconcile -> bottleneck -> changes -> inventory/cash check -> execute -> wait lag -> evaluate -> record).
- Scaling rule (marginal contribution, cash, supply; permitted change size, review interval, rollback). Automation boundary: don't fight native bidding. Output: decision log.

##### 14 SEO and organic [§14 p25]
- Workstreams: technical SEO; product/category pages; educational content; structured product data; organic social/video; distribution and refresh.
- Content engine: question -> evidence -> brief -> draft -> footage -> expert review -> publish -> link -> observe -> update. Agent only for persistent organic decline diagnosis.

##### 15 Influencers and partners [§15 p26]
- Tasks: build shortlist; outreach and terms; product experience; content review; commercial evaluation.
- Brief without manufacturing endorsements; FTC disclosure; rights record (ownership, channels, territories, duration, paid amplification, edits, likeness/music, expiry - routine flags expiry).
- Measurement: codes incomplete; holdouts/geo designs; separate distribution value vs licensed-creative value. Stop conditions. Output: creator brief, contract/rights register, review log, continue/stop decision.

##### 16 Owned channels [§16 p27]
- Message types: founder email; transactional; marketing; content/education; chatbot/conversational; SMS; web/app push - each with workflow and primary measure.
- One orchestration layer: consent -> state -> exclusions/frequency -> priority -> inventory/offer -> send once (idempotency key) -> log -> stop/reroute.
- Deliverability (SPF/DKIM/DMARC, one-click unsubscribe); measure beyond opens; holdouts.

##### 17 Lifecycle communications [§17 p28] - 13 state triggers
1. New subscriber - welcome, chooser guide, preferences.
2. Product viewed, no purchase - helpful fit/proof answer.
3. Cart/checkout abandoned - item reminder, full cost, help (not always a discount).
4. Order accepted - itemised confirmation, expectation, help route.
5. Order processing - preparation/setup content if wait is long.
6. Carrier handoff - tracking, real dispatch, ETA.
7. Shipment exception - explanation, updated expectation, remedy; pause cross-sell.
8. Delivery confirmed - arrival, unboxing/setup guide, problem reporting.
9. First-use window - SKU steps, mistakes, care, assistance.
10. Enough time to use - neutral review request/feedback.
11. Replenishment window - reorder prompt with skip/adjust.
12. Next relevant product - complement/upgrade.
13. At-risk / lapsed - reason to return, preference check, sunset.
- Contact policy (global cap, channel limits, priority order); flow specification fields (trigger, fields, eligibility, delays, branches, content version, exits, suppressions, owner, cost, holdout, success metric).

##### 18 Fulfilment and delivery [§18 p29]
- Stages: order release; pick and pack; carrier selection; handoff and tracking; delivery exceptions; invoice and claims audit.
- Customer communication rules; pre-arrival education; cost improvement without service damage (packaging tests, carrier by zone/SKU, consolidation).
- Output: service promise matrix, routing rules, packing SOP, exception queue, carrier scorecard.

##### 19 Unboxing and wow [§19 p30] - 20 delight moment candidates (all test candidates, cost-tracked)
1 Quick-start card; 2 SKU-specific QR guide; 3 Captioned setup video; 4 Troubleshooting card; 5 Care card;
6 Fit/measurement aid; 7 Labelled parts; 8 Spare small component; 9 Useful accessory gift; 10 Sample of a related item;
11 Reusable pouch; 12 Easy-open packaging; 13 Founder thank-you; 14 Personalised name note; 15 Gift-ready message;
16 Progress/use checklist; 17 Direct help route; 18 Replacement-parts guide; 19 Recycling/disposal guide; 20 Next-use inspiration.
- Workflow: H choose moments + check samples -> P copy -> S SKU instructions/print specs -> R insert selection per order -> H pack -> L test/control cohorts.
- QR requirements (brand-owned destination, mobile, fallback; help never gated on signup/review).

##### 20 Use, support and returns [§20 p31]
- Workstreams: education; first-line support; complex exception (A, bounded); returns/exchanges; disputes (S packet + R deadlines + H submission); product learning (cluster reasons by SKU/batch/claim/page/avatar).
- Define observable first-use outcome; reviews and feedback rules (no sentiment-conditioned incentives); cost decomposition of returns.
- Output: product-use guide library, support KB, return/dispute SOP, monthly root-cause report.

##### 21 Retention and VIPs [§21 p32]
- Strategies: replenishment; complementary cross-sell (product graph); VIP experience (by retained contribution); loyalty/referral; subscription; winback; new-product launch to existing customers.
- Segment for usefulness (RFM + contribution + first-order experience + interest); launch-to-existing-customers sequence; category differences (durables vs consumables).
- Measurement: same-length cohorts, repeat probability, time to second purchase, contribution LTV, cash payback, beat a holdout. Output: next-product map, segment rules, VIP economics, launch checklist, cohort learning report.

##### 22 Inventory, cash and alignment [§22 p33]
- Tasks: forecast demand (S/H/R); replenish (R + H commitment); manage assortment (S + L); plan cash (S/R + H); audit costs (S/R + H); align teams (R + H decision meeting).
- Weekly business review (finance -> growth -> operations -> CX -> founder ranked intervention list). Decision rights. Incentives (no pay on ROAS/gross revenue alone; contribution basis, baseline, holdouts, lag).
- Output: weekly business decision packet + coordinated calendar (campaigns, launches, POs, fulfilment, cash).

#### B4. Implementation layer (pp 34-38)
- Worked journey [p34]: Discovery -> Evaluation -> Cart/purchase -> Waiting -> Arrival/first use -> Feedback/recovery -> Repeat/advocacy (drawer dividers); funnel economics (100k impressions -> 2,000 sessions -> 200 carts -> 100 checkouts -> 60 orders; CM2 $720; checkout intervention +$162; insert $0.30 break-even); "do not add every projected lift together".
- Build priorities - the first twelve reusable capabilities [p35]:
  1. Profit truth (S + H finance sign-off) - reconciled GP/CM1/CM2 with confidence flags.
  2. Purchase QA (H + S) - verified event matrix and defects.
  3. Customer evidence (S) - avatar/problem/objection matrix.
  4. Offer economics (S + H) - viable offer sheet and downside case.
  5. Ad-to-page match (S + H) - mismatches and corrected briefs.
  6. Delivery exceptions (R + H) - prioritised cases and message drafts.
  7. First-use education (P/S + H) - quick-start, QR page, timed messages.
  8. Creative production (P then S + H) - reviewable image/copy/script.
  9. Retention flows (R + L + H) - state-based lifecycle journeys.
  10. Weekly growth review (S/R + H) - ranked interventions, decision log.
  11. Returns-to-root-cause (S + L + H) - corrective-action queue.
  12. Cash and stock guard (S/R + H) - constraints and replenishment proposals.
  - Do first with prompts: hooks, founder emails, customer summaries, a creative format, FAQ rewrites, RFQ wording. Package as skills: quote normalisation, avatar mapping, offer costing, feed QA, journey audits. Routines: imports, data checks, consent/eligibility, shipment updates, scorecards. Avoid first: login-scraping agent, autonomous negotiator, ad-budget agent before profit truth, mass creative before review capacity.
- Routine and loop catalog [p36]:
  - R1 Daily commercial reconciliation (finance/data).
  - R2 Shipment exception handling (ops/service).
  - R3 Lifecycle message orchestration (lifecycle).
  - L1 Creative learning (growth, weekly).
  - L2 Landing-page improvement (ecommerce).
  - L3 Product-experience improvement (product/CX).
  Each with trigger, inputs, steps, owner, stop, done, metric.
- Bounded agent catalog [p37]:
  - A1 Opportunity evidence investigator (product; max 2 research rounds).
  - A2 Supplier coordination assistant (sourcing; approved recipients, contact cap, no deposits/contracts).
  - A3 Profit-drop investigator (finance/growth; read-only, max 3 diagnostic branches).
  - A4 Launch readiness coordinator (launch lead; no silent publication/spend/commitments).
  - Common controls: persistent task state, logs, allowed sources, validation, unique action IDs, retry limits, change previews, budget caps, escalation, resume from last verified step.
- Rollout and ownership [p38]: 4 phases (Foundation; Useful manual system; Reliable routines; Selective agents) with exit evidence; skill specification template (name/purpose, trigger, inputs/schema, references, method, deterministic calcs, output template, acceptance, missing-data behaviour, prohibited inventions, owner, version/update trigger); weekly owner packet (health page, exceptions page, ranked interventions, decisions with drafts, maturing experiments, cash/inventory constraints); operating roles (founder=objectives/capital; product/sourcing=specs/supply; growth=acquisition; ecommerce=purchase experience; lifecycle=retention; ops/CX=fulfilment/service; finance/data=numbers); revalidation triggers; acceptance standard.

#### B5. Content production library (pp 39-54)
- Prompt foundation [p39]: CONTEXT packet (brand, product, market, audience, problem, outcome, mechanism, approved proof, offer, destination, assets/rights, avoid, version, unknowns); master image prompt; master video/script prompt; 4-step library use (H select -> S checks -> R record IDs -> L evaluate); evidence statuses: untested hypothesis -> technically usable -> tested in this account -> provisionally promising -> replicated winner for a defined context -> fatigue/retest.
- Image formats I01-I40 [p40-47] (each = mechanism + example + FORMAT prompt):
  - 01-05 problem & demonstration [p40]: I01 Problem in the scene; I02 Same-scene before/after; I03 Product in action; I04 Detail that explains the mechanism; I05 Three-step quick demonstration.
  - 06-10 proof & credibility [p41]: I06 Verified customer quote; I07 Evidence snapshot; I08 Material and workmanship; I09 Founder rationale; I10 Behind the product.
  - 11-15 objection handling [p42]: I11 Common question, visible answer; I12 Myth vs product fact; I13 Fits / does not fit; I14 Effort made clear; I15 What's included / optional.
  - 16-20 offers & value [p43]: I16 Single-product value card; I17 Complete-the-job bundle; I18 Good/better/best chooser; I19 Volume price ladder; I20 Useful gift with purchase.
  - 21-25 alternatives & choice [p44]: I21 Side-by-side alternative comparison; I22 The current workaround; I23 Cost per use with assumptions; I24 Choose by situation; I25 Where the value comes from.
  - 26-30 context & relevance [p45]: I26 Seasonal use case; I27 Gift for a specific recipient need; I28 A moment in the daily routine; I29 The buyer's chosen identity; I30 Avoid a common setup mistake.
  - 31-35 visual storytelling [p46]: I31 Educational infographic; I32 Problem-to-solution carousel; I33 Brand-owned editorial card; I34 Annotated real-life photograph; I35 One product, several verified uses.
  - 36-40 catalog & lifecycle [p47]: I36 Back in stock; I37 New-product introduction; I38 Variant chooser; I39 Catalog card with useful context; I40 Unresolved objection reminder.
  - Maintaining a current format library: weekly ad-library exports by human; skill records format/hook/proof; loop promotes on mature results; agent only for a specific creative gap.
- Video formats V01-V16 [p48-51] (each = structure + example hook + VIDEO FORMAT prompt + why test + watch):
  - 01-04 show the product working [p48]: V01 Immediate demonstration (30s); V02 Problem, failed workaround, solution (35s); V03 Founder explains a design choice (35s); V04 Creator use diary (30-45s).
  - 05-08 make buying easier [p49]: V05 One objection answered; V06 Fair side-by-side comparison; V07 Honest unboxing; V08 Three-step how-to.
  - 09-12 teach & explain [p50]: V09 Myth corrected with evidence; V10 Mechanism explainer; V11 Three verified use cases; V12 Respond to a real question.
  - 13-16 offer & experience [p51]: V13 Bundle walkthrough; V14 Gift-use story; V15 Real customer testimonial with proof; V16 Silent hands / sensory demonstration.
- Worked creative [p52]: 30s V01 script with timecodes; 3 hook variants; matched Meta primary text/headline/CTA; matched page hero; reuse footage post-purchase (delivered-customer message, packaging card); joint test.
- Google production kit [p53]: G01 Responsive Search Ad generation prompt; G02 Feed and Shopping preparation prompt; G03 YouTube/Demand Gen adaptation prompt.
- Operational prompt kit [p54]: P01 Research synthesis; P02 Comparable supplier quotes; P03 Avatar-to-page map; P04 Offer economics; P05 Journey friction audit; P06 Weekly profit and action brief. Default output contract.
- Sources [p55-56]: S1 Google consent mode; S2 GA4 ecommerce events; S3 Shopify Meta data sharing; S4 Meta dedup (access errors noted); S5 Google transaction ID; S6 Enhanced conversions; S7 Cart data + COGS; S8 Conversion adjustments; S9 Value-based bidding (Demand Gen); S10 Meta attribution change (Mar 2026); S11 Alibaba Trade Assurance; S12 FX risk (ITA); S13 Core Web Vitals; S14 Meta Reels; S15 RSAs; S16 Merchant Center spec; S17 Product structured data; S18 FTC endorsements/reviews; S19 Gmail sender guidelines. Checked 9 Sep 2026. Explicitly: no format proven profitable.

---

### PART C. DELIGHT - Customer Delight Architecture v1.1 (40 pp) - detailed outline

Cover: "Built around customer delight. From first product to a $50M brand." Stage-aware research; connected avatars and offers; brand-consistent pages, ads, lifecycle; execution loop that remembers what works. 16 Sep 2026, v1.1.

#### C1. Product promise and personalisation (§1-§6)
- §1 Product promise: founder sees business moving forward (opportunities investigated, few consequential decisions ready, approved work completed, results tied to profit + CX). New founder path vs established brand diagnosis. Design decisions: two-layer guidance; avatars separate from offers then linked; brand foundations early, expression after positioning; common execution loop Diagnose -> propose -> prepare -> verify -> release -> measure -> learn; optimise retained contribution and delight together. First release = one valuable improvement from evidence to measured outcome.
- §2 Personalisation - universal foundation, tailored playbooks (v1.1 rewrite):
  - Universal base cards: CRO.BASE.01 Speed; CRO.BASE.02 Measurement; CRO.BASE.03 Images; CRO.BASE.04 Page essentials; CRO.BASE.05 Function (mobile, links, cart, checkout, accessibility).
  - Stage cards: CRO.STAGE.01 Prelaunch; CRO.STAGE.02 Early/low traffic; CRO.STAGE.03 Repeatable demand; CRO.STAGE.04 Scaled operations.
  - Ineligible cards stay discoverable with unlock conditions; base layer never filtered by size.
  - [DELIGHT v1.0 §2] replaced: 5-stage maturity table (Exploring/prelaunch; First sales/low traffic; Repeatable demand; Scaling; Large e.g. $50M) + routing calculation (hard constraints first, then expected contribution range, evidence strength, customer benefit, time to learning, effort, reversibility) + relevance test.
- §3 Founder experience - home screen: Decisions ready (max 3 cards: evidence, value range, customer impact, cost, uncertainty, preview; approve/edit/delegate/defer); Work in progress; Results and learning; Business health (v1.1: foundation checklist verified/failing/unverified/awaiting setup + eligible stage opportunities); Ask the business. Worked experiment "Clarify fit before purchase on the commuter bag page" (v1.1: broken baseline becomes a repair; uncertain improvement becomes a test). Founder-delight metrics. Team and agency mode (separate contexts and permissions; cross-client reuse only of methods/templates).
- §4 Connected journeys: new-brand path vs existing-brand path -> shared outputs (business context & stage profile; opportunity dossier & product decision; avatar & JTBD records; approved brand/claims/offer versions; verified customer journey; experiments, learning, next priorities). Dependencies: product truth before claims; commercial feasibility before scale; brand and offer before production. Four feedback loops. Handoff = object ID, version, evidence, constraints, owner, acceptance test.
- §5 Business context - context layers: founder & company; product & operations; customers & demand; commercial activity; brand & permissions. First useful session (new founder one-page decision brief; existing brand inventory + reconcile + opportunity map). Keep context fresh (origin, effective date, confidence, owner). Task-specific context packet. Routing output (v1.1): base standards + status; eligible stage cards + reasons; locked cards + unlock conditions.
- §6 Expert knowledge layer (v1.1 rewrite): hierarchy domain -> universal base document -> stage-specific subsection cards -> merchant execution records, across CRO, research, offers, brand, acquisition, lifecycle, CX, sourcing. Card fields: identity/hierarchy; principle/rationale; applicability; execution; verification; dependencies/unlock; limits. Retrieve base first then stage. Base status (verified/failing/unverified/awaiting setup/not applicable); stage status (eligible/locked/active/completed). Acceptance test: identical faults at $0 and $100M trigger same base standards.
  - [DELIGHT v1.0 §6] replaced: method-card ingestion (identity/provenance, applicability, procedure, decision logic, limitations, validation); retrieve-apply-challenge; preserve expert disagreement; "sources to add" list (customer interviews/JTBD, direct-response copy, offer economics, product design & quality, sourcing & negotiation, usability & accessibility, causal experimentation, lifecycle, fulfilment & service recovery).

#### C2. Orchestration and runtime (§7-§8)
- §7 Orchestration: durable workflow engine with bounded agents. Architecture diagram: FOUNDER/TEAM (decide, review, delegate, learn) -> BUSINESS ORCHESTRATOR (universal base + stage cards + context + workflow state) -> DISCOVER (market/product/avatars) | CREATE & EXECUTE (offers/store/creative) | MEASURE & IMPROVE (experiments/CX/margin) -> SHARED FOUNDATION (evidence + business records + connectors + controls).
  - Business orchestrator (checks universal foundation, selects eligible stage cards, prioritises by customer impact).
  - 12 domain orchestrators: research & expansion; customer intelligence; offers; brand; store & copy; performance; creative; paid acquisition; lifecycle; organic discovery; CX; sourcing.
  - Shared services: source retrieval; catalog normalisation; economics; evidence evaluation; claim review; design rendering; experimentation; connector execution.
- §8 Runtime contract: Input (task/merchant IDs, objective, stage, scope, base-card versions, stage-card IDs, evidence cutoff, constraints, acceptance); Allowed work; Output; Verification; Completion (complete / needs information / failed / blocked). Workflow states: requested -> scoped -> researching/building -> validating -> ready for decision -> approved -> executing -> verifying -> measuring -> learned (+ rejected, paused, failed). Reliability: dedup keys, save before external action, read-back, rollback/compensating action, external content is data, credentials out of prompts. Autonomy ladder.

#### C3. Research, product, avatars, offers, brand (§9-§18)
- §9 Research orchestration - three questions (need/market; category; specific product). Workers: Brief and method planner; Demand and trend researcher; Customer evidence researcher; Competition and channel researcher; Category and product analyst; Economics and supply analyst; Skeptic and evidence validator. Final decision packet (recommendation, findings, ranked shortlist, rejected alternatives, evidence ledger, downside economics, unknowns, validation plan; base/downside/reversal conditions). Completion gate.
- §10 Market research - 5-step sequence: 1 Frame the need; 2 Map existing spending; 3 Study change (Trends is relative); 4 Learn from customers; 5 Test commercial access. Deliverables: market landscape & demand map; customer problem evidence; entry thesis & downside case; validation plan.
- §11 Category research - category tree (job, form, setting, price tier, cadence; operational vs customer taxonomy); 6 evaluation lenses (customer fit, demand quality, competitive structure, economics, operational feasibility, strategic fit); proposed weights (need 25, economics 25, differentiation 20, feasibility 15, founder/brand fit 15); hard exclusions; output and gate (existing brand adds customer overlap, cross-sell, supply overlap, cannibalisation).
- §12 Product research - parallel specialists: VOC analyst; product & competitor analyst; supplier & quality analyst; economics analyst; concept validation analyst. Product dossier: proposition; specification; commercial case; customer delight (first-use success, ease of use, instructions, packaging utility, service recovery); validation. Next-commitment gate: reject / investigate / sample / validate demand / approve bounded launch.
- §13 Existing-brand expansion - expansion orchestrator; reconstruct portfolio (recruiter vs repeat-driver products, co-purchase, dissatisfaction). Expansion options: same market/improved product; same market/adjacent product; same market/adjacent category; new market/current product; new market/new category. Trend discovery & synthesis. Final gate vs improving current business.
- §14 Research inputs - source families: merchant records; Search/Trends; Amazon/marketplaces (SP-API); Reddit/communities (commercial API terms); ad & landing-page libraries; reports/official statistics; interviews/product trials. Evidence ledger fields; confidence labels (first-party observed / multiple independent / plausible hypothesis / unknown); freshness rule.
- §15 Customer intelligence - customer-intelligence orchestrator with workers (first-party cohorts, VOC coding, purchase interviews, competitor positioning, JTBD, synthesis) + validator. Avatar fields: situation & trigger; job & desired progress; pain/goals/aspirations; alternatives & objections; decision & proof; product & commercial links; confidence & validation. New vs existing brand. Output: core avatar library, ad/offer-to-avatar map, performance summaries, new avatar tests.
- §16 Opportunity discovery - alternative-use and counter-positioning worker. Three kinds: untapped by this brand; underdeveloped in the category; exploratory. Discovery method (workarounds, support Qs, negative reviews, neighbouring industries; vary context, user, frequency, location, ability, gifting, lifecycle stage). Hypothesis card: proposed job; evidence & novelty; product suitability; commercial relevance; validation. Health-claim caution (FTC).
- §17 Offer architecture - offer orchestrator: offer strategist; economics worker; merchandising worker; CX worker; congruence validator. Offer components: core outcome; package; commercial terms; risk reduction; delight; economics & operation. Universal offer standard + stage cards. Hypothetical economics ($70 -> $15 contribution; $3 gift). Implementation packet (copy, assets, page structure, config, segments, inventory rules, lifecycle changes, experiment, rollback). Congruence definition.
- §18 Brand and launch foundations - brand orchestrator workers: audit touchpoints; synthesise positioning; verbal identity; visual identity; consistency check. Brand document: strategy; voice; visual system; rationale; governance. Existing-brand audit (classify inconsistency by impact). New-founder setup workflow: name + domain, conflicts, register in merchant ownership, connect storefront, HTTPS, renewals, business email, email authentication/DNS (Gmail S06), payments/shipping/taxes with specialists. Completion gate.

#### C4. Store, creative, acquisition, lifecycle, organic, CX, sourcing (§19-§30)
- §19 Store and copy - store orchestrator; specialists: journey analyst; information architect; copy worker; designer; storefront worker; validator. Page formats: PDP; campaign landing page; advertorial; listicle/comparison; quiz funnel. Universal page essentials + stage cards. Copy quality rules. Reference library tagging. Deliverable: outline, annotated copy, asset briefs, responsive preview, code/config, app capabilities, test checklist, experiment card.
- §20 Product imagery - catalog-asset orchestrator: product-fidelity worker; visual strategist; image production worker; copy/layout worker; quality reviewer. Ten-image system: 1 Hero; 2 In context; 3 Primary benefit; 4 How it works; 5 Fit/dimensions; 6 Materials/construction; 7 Comparison; 8 Proof; 9 Contents/offer; 10 Use/care/reassurance. Asset pipeline (product pack -> brief -> references -> draft -> fidelity review -> brand/claim review -> mobile/layout -> export/compression -> catalog mapping -> preview -> release). Catalog rollout in batches; providers interchangeable.
- §21 Site performance - performance orchestrator: site/template inventory worker; field-data analyst; lab-diagnostic worker; code-fix worker; regression tester. CWV thresholds; field vs lab; founder report vs developer report; loop capture baseline -> rank -> fix -> test -> release -> remeasure -> close/reopen; fixed != verified.
- §22 Experimentation - experiment contract fields; traffic reality example (2.0% -> 2.4% needs ~21,100 per arm; 422 days at 100/day); low-traffic vs sufficient-traffic playbooks; decision layers (commercial objective, diagnostics, guardrails); decision states adopt/continue/reject/revise/inconclusive.
- §23 Store execution - two paths (developer packet vs authorised storefront connection); Shopify path (theme app extensions; checkout UI extensions need Shopify Plus); 7-step release sequence: Snapshot, Prepare, Preview, Verify, Authorize, Publish, Recover. Test groups: content & design; commerce; measurement; integrations. Universal release gate.
- §24 Meta creative - creative orchestrator (reference analysis, concept development, scripting, visual production, copy, QA, packaging). Learn from references without copying (awareness, tension, hook, proof, demo, objection, narrative, pacing, offer). Controlled concept matrix: avatar/situation; job/angle; proof; format; offer. Copy matched to actual asset. Final creative packet.
- §25 Video production - video orchestrator: script, storyboard, continuity, generation, editing, review workers. 5-step production sequence (script; storyboard; generate scene one with variations + human pick; continue conditionally; edit). Review lenses: product fidelity; continuity; persuasion; accessibility/placement; rights & claims. Provider capability registry.
- §26 Paid acquisition - paid-media orchestrator. Meta first (account audit, draft campaign, approval packet, controlled publication, read-back). Google next (search-intent worker, product-feed worker, campaign builder, measurement analyst). Controls: budget & stock; tracking; performance; changes; failure. Learning loop; channel sequencing.
- §27 Lifecycle communication - lifecycle orchestrator (segmentation, event mapping, copy, flow design, deliverability, measurement). Flows: Welcome; Browse/cart recovery; Order/delivery; Product activation; Replenishment; Cross-sell/VIP; Recovery/win-back. Base + launch/mature/scaled cards; seasonal campaign calendar; Klaviyo Flows API caveat; measurement beyond attributed revenue.
- §28 Organic discovery - organic-discovery orchestrator (technical SEO, intent research, content planning, editorial production, product information, external authority). Technical / on-page / content / external visibility. Artifacts: search opportunity map; editorial brief; technical ticket; measurement record. AEO promise bounded (Google: no special requirements for AI features). Release loop. Delight connection (guides prevent wrong-size purchases).
- §29 Customer experience - CX orchestrator (journey map, exception monitoring, education, service recovery, delight experiments). Six delight moments:
  1. Immediately after purchase - confidence -> accurate confirmation, terms, setup expectations.
  2. Before delivery - predictability -> real tracking, proactive exceptions, revised expectations.
  3. Unboxing - recognition, clarity, intact product -> useful packaging, correct contents, instructions, personal touch.
  4. First use - quick success -> product-specific education, accessible help, troubleshooting.
  5. A problem - fair, low-effort resolution -> context-aware support, owned follow-up, remedy within authority.
  6. Continued relationship - relevant value and recognition -> replenishment, cross-sell, loyalty, feedback requests.
  - Define delight before adding gifts (universal base: correct product, honest delivery promise, easy setup, clear help, fair resolution). VIP rules. Experience intelligence routing: confusing instruction -> education; misleading promise -> copy/creative; recurring failure -> product/sourcing; delivery delay -> constrain acquisition promises. Measures.
- §30 Sourcing and cost - sourcing orchestrator (spec/BOM, quote normalisation, should-cost, negotiation prep, quality, cash impact). Cost record: BOM; production cost; landed cost; supplier terms; performance. Negotiation options (consolidation, packaging simplification, alternative components, forecast commitments, lead-time flexibility, payment terms, second supplier). True-saving validation ($0.40 x 200k units = $80k gross; $45k net). Quoted vs contracted vs realised savings.

#### C5. Measurement, records, journeys, build plan, engineering (§31-§39)
- §31 Measurement - net revenue; gross profit; contribution before marketing; contribution after marketing; cash exposure; customer outcome. Attribution vs incrementality (three views). Provisional vs mature contribution. Portfolio prioritisation (range, cost, cash, learning value, customer impact, confidence; vs doing nothing).
- §32 Shared business records - object families: business/stage/policy; evidence/method/card; opportunity/product; avatar/job/angle; brand/claim/offer; asset/page/flow/ad; experiment/outcome; workflow/action/issue. Execution envelope fields (merchant_id, workflow_id, task_id, objective, base_card_ids, stage_card_ids, input_versions, evidence_ids, artifact_ids, policy_version, status, owner, next_action + idempotency key, approval ref, expected state change, platform response, read-back). Events: product facts changed, offer approved, artifact ready, release verified, stock unavailable, order refunded, experiment matured. Example: supplier changes bag dimensions -> flag fit images, PDPs, feed, ad claims. Ownership & tenant separation.
- §33 Worked journey A - founder from zero (travel accessories, 60 daily visitors): 1 clarify and explore; 2 validate product and supply; 3 choose customer and proposition; 4 prepare a complete launch (PDP, image set, 3 creative concepts, ad copy, essential flows, domain/email); 5 learn at the right scale.
- §34 Worked journey B - $50M bags brand: 1 locate the current constraint; 2 coordinate a connected improvement (fit guidance); 3 verify and measure; 4 explore expansion in parallel; 5 realise cost and experience improvements. Founder review: ready to decide / moving / learned. Agency value.
- §35 Build plan part one - narrow promise: help an established Shopify brand identify, prepare, release and measure one useful improvement. Phases: 0 design partners (wk 1-2, 3-5 brands); 1 foundation (wk 3-6); 2 complete workflow (wk 7-10); 3 pilot reliability (wk 11-14). First workflow to ship: audit one product's ad-to-page-to-offer consistency + objections -> evidence-backed change -> preview -> verify -> release. Own immediately: business record, evidence & method library, workflow state, approvals, artifact versions, learning history.
- §36 Build plan part two - expansions: acquisition & lifecycle (wk 15-20); research & launch; portfolio & sourcing; multi-market/agency/scale. Recommended initial team (product lead, senior engineer, integration/storefront engineering, applied-AI/eval owner, design/research + domain experts). Build vs buy (build decision model, coordination, business graph, evaluation, UX; integrate commodity systems). Platform economics: cost per completed and adopted workflow.
- §37 Engineering and evaluation - components: connector adapters behind tool gateway, durable workflow service, versioned business-record service, evidence/retrieval layer, artifact storage, review interface. Connector release contract. Evaluation families: research quality; two-layer routing; congruence & fidelity; commercial correctness; execution reliability; access & isolation. Benchmark set; launch gate (release blockers: unsupported claims, unauthorised actions, cross-merchant leakage, duplicate writes).
- §38-§39 Source register: S01 Google Trends; S02 Amazon SP-API Reports; S03 Reddit Data API terms; S04 GA reporting thresholds; S05 FTC health claims; S06 Gmail sender; S07 Web Vitals; S08 Shopify theme app extensions; S09 Shopify checkout UI extensions; S10 Google Ads API; S11 Klaviyo Flows API; S12 Google AI features. Checked 16 Sep 2026. Provenance: primary input = a founder voice transcript; continuity from the lifecycle blueprint and business-in-a-box draft. Next input pack: expert product-research collection (40-60 pp, not found), 3-5 pilot brands, markets, data access, one workflow to prove.

#### C6. v1.0 -> v1.1 changes (by diff only; 26 pages changed per changed_pages.json)
- Core change: replaced revenue/maturity routing with a two-layer model - universal base cards (never waived by size) + stage-specific subsection cards with eligibility/unlock conditions. Touches §1 design decision, §2 (fully rewritten), §3 business health panel, §5 routing output, §6 (method-card ingestion -> base/stage card hierarchy), §7 business orchestrator role, §8 runtime contract (adds base-card versions, stage-card IDs, base-standard checks).
- Domain pages (§9, §11, §16, §18, §20-§24, §27-§36, §38) gained "two layers" / "universal X / stage-specific cards" paragraphs; §21 loop rewritten; §22 experimentation reframed as universal CRO checks vs conditional testing cards; §23 adds universal release gate; §32 execution envelope adds base_card_ids/stage_card_ids; §33-§34 worked journeys reframed around the same base checklist; §35 phase 1 now "universal base documents, linked stage cards, eligibility rules"; §37 evaluation adds "two-layer routing" family.
- Lost in v1.1 (only in before_v1_1.md): the explicit 5-stage maturity table with "what good looks like / first priorities / defer", the routing calculation, "at 50-200 daily visitors" guidance, the relevance test, and the "sources to add beyond product research" list. Worth keeping in the catalogue as the stage ladder.

---

### PART D. IDEAMAPS - "Ecommerce OS: The Full Idea Map" (21 pp) - opportunity tree

Purpose: every place in an ecommerce business where value can be added, business side then customer side; per idea: today, what's missing, what we do, tests, metric; scored Visibility 1-5 and Lever 1-5 [IDEAMAPS p1].

#### D0. Part 0 - master stack rank (35 ideas) [IDEAMAPS Part 0 p1-2]
| # | Idea | Area (doc) | Vis | Lever | When | Schema area |
|---|---|---|---|---|---|---|
| 1 | Catalog image refresh, top 50 sellers | Store | 5 | 3 | Day 1 | CPS |
| 2 | Site speed: WebP, dead-app removal, script cleanup | Store | 5 | 3 | Week 1 | WS |
| 3 | Weekly report auto-generated into client's sheet | Reporting | 5 | 2 | Week 1 | AN |
| 4 | Pixel and CAPI health audit and fix | Tracking | 4 | 4 | Week 1 | AN |
| 5 | Gross profit per purchase live (COGS upload, campaigns re-scored) | Metrics | 4 | 5 | Week 2 | FN |
| 6 | Slack/Drive -> Meta creative pipeline with variations | Ads | 5 | 4 | Week 2-3 | CS/PA |
| 7 | Research pass: personas, angle map, keyword-CTR map, competitor folder | Research | 4 | 4 | Week 2 | RS |
| 8 | COD confirmation + RTO risk scoring | Checkout | 4 | 5 | Week 3-4 | WS/OP |
| 9 | Returns/RTO/chargebacks to Meta as negative signals | Tracking | 3 | 4 | Week 3-4 | AN/PA |
| 10 | Value-based bid rules by segment (age, city, device, pincode) | Media buying | 3 | 4 | Month 2 | PA |
| 11 | Abandoned cart flow rebuilt and A/B tested (WhatsApp first) | Retention | 4 | 4 | Month 2 | RT |
| 12 | Landing page test system (sub-agent per test) | CRO | 3 | 5 | Month 2-3 | WS |
| 13 | Spend shifted toward high-margin SKUs | Media buying | 3 | 5 | Month 2 | PA |
| 14 | Software and app subscription audit | Ops | 4 | 2 | Month 2 | SY |
| 15 | Courier rate benchmark and pincode-level routing | Logistics | 3 | 3 | Month 2-3 | OP |
| 16 | NDR follow-up automation | Logistics | 4 | 3 | Month 2-3 | OP |
| 17 | Purchase-sequence personalisation | Retention | 2 | 4 | Month 3 | RT |
| 18 | Media buyer daily log -> daily/weekly report | People | 5 | 2 | Week 1 | AN |
| 19 | Support call reason mapping and weekly report | Support | 3 | 3 | Month 2 | CX |
| 20 | AEO: structured product data, FAQs, citation tracking | Search | 2 | 3 | Month 3 | OG |
| 21 | Content engine: buying-question posts on a calendar | Search | 2 | 3 | Month 3 | OG |
| 22 | Influencer outreach automation | Acquisition | 3 | 3 | Month 3 | CR |
| 23 | Demand forecast, reorder alerts, dead stock plan | Inventory | 2 | 4 | Month 3 | OP |
| 24 | Landed cost per SKU (true margin) | Inventory | 2 | 4 | Month 2 | FN |
| 25 | Supplier scorecard and re-sourcing suggestions | Sourcing | 1 | 4 | Month 4+ | OP |
| 26 | Raw-material-linked pricing bands and hedging prompts | Sourcing | 1 | 3 | Month 4+ | FN/OF |
| 27 | Return-reason loop -> catalog/product fixes | Returns | 3 | 3 | Month 3 | CX |
| 28 | Post-purchase upsell/cross-sell (thank-you page, order flow) | Retention | 3 | 3 | Month 3 | RT |
| 29 | Email deliverability and list hygiene | Retention | 2 | 3 | Month 3 | RT |
| 30 | Employee gross-profit incentive scheme | People | 3 | 4 | Month 2 | ST |
| 31 | New channel pilots (Google Shopping, YouTube, Pinterest) | Media buying | 3 | 3 | Month 3+ | PA |
| 32 | Chargeback and fraud risk scoring by area | Checkout | 2 | 3 | Month 3 | FN |
| 33 | Video creative loop (720p drafts -> 2K winners) | Ads | 3 | 4 | Month 3+ | CPV |
| 34 | Loyalty/referral (only if numbers say yes) | Retention | 2 | 2 | Month 4+ | RT |
| 35 | Marketplace listing quality and price parity monitor | Channels | 3 | 3 | Month 4+ | OG/PA |

#### D1. Part 1 - Metrics layer (foundation) [IDEAMAPS Part 1 p2-4] - Vis 4 / Lever 5
- 1.1 What brands look at today: Ads Manager ROAS, Shopify revenue, CPA/CPC/CPM/CTR, mixed "orders".
- 1.2 Standard numbers: GPP (price - COGS - packaging - shipping - gateway fee - return/RTO allocation - ad cost); nGPP (first orders); repeat GPP; 90/180-day customer GP; CAC (per new customer); nGP:CAC ratio; MER; contribution margin per month; RTO/return/chargeback rates (by product, pincode, campaign, payment method); prepaid share; diagnostic ad metrics (CPM, CTR, CPC, cost per ATC, cost per initiated checkout, checkout-to-purchase).
- 1.3 Cost side: COGS file upload; shipping per order from courier; gateway fees; returns/RTO matched to orders; automatic re-scoring of every order/product/campaign/ad.
- 1.4 Signals back to ad platforms: GP as value parameter; negative signals (RTO refusals, returns, cancellations, chargebacks); prepaid vs COD property; confirmed-COD event; repeat purchase events; offline events (marketplace, WhatsApp, store); match quality (phone, email, name, city, pincode hashed).
- 1.5 Dashboards: owner view; media buyer view; product view (push/kill); geography view (pincode); "three things to do this week" box.

#### D2. Part 2 - Business side (before the customer) [IDEAMAPS Part 2 p4-7]
- 2.1 Supplier sourcing & management (Vis 1 / Lever 4): supplier scorecard; alternative supplier scan (top 20 SKUs); renegotiation prep brief; MOQ vs cash; sample-to-launch tracking. Tests: dual-source a SKU; order-size scenarios. Metric: landed cost/unit, defect rate, lead-time variance.
- 2.2 Raw material exposure & pricing (Vis 1 / Lever 3, 5 for material-heavy): margin-at-risk monitor; pricing bands (e.g. +/-4%); silent levers before visible ones (discount depth, free-shipping threshold, spend shift, list price last); hedging prompt (not advice; point to CA/broker); buy-timing suggestions. Metric: realised vs planned margin per SKU.
- 2.3 Inbound logistics (Vis 2 / Lever 3): landed cost per SKU; freight consolidation; freight rate benchmark; inbound tracking (ETA per PO, stock-out effect); inward quality check log.
- 2.4 Inventory & cash (Vis 2 / Lever 4): demand forecast by SKU (incl. ad performance); reorder alerts (lead time + safety stock); ad-inventory link (warn/shift spend under N days stock); dead stock plan (bundle, discount, marketplace clearance, stop reorder); cash tied in stock; launch & festive planning; pre-order logic for late hero SKUs. Metric: stock-out days top 20, days of inventory, cash tied.
- 2.5 Operations leanness - apps/subscriptions/software (Vis 4 / Lever 2): app & subscription audit; consolidation suggestions; tech-stack cost per order; renewal calendar.
- 2.6 Outbound logistics & couriers (Vis 3 / Lever 3): rate benchmark by weight slab/zone; courier performance by pincode + routing; serviceability sync at checkout; weight & packaging audit; delivery promise by pincode at checkout; actual shipping-cost allocation into GPP. Tests: courier A vs B; packaging vs damage; "delivered by [date]" badge.

#### D3. Part 3 - Customer journey step by step [IDEAMAPS Part 3 p7-16]
- 3.1 Before they've heard of you - research (Vis 4 / Lever 4) [p7-8]; sub-agents writing to a shared research folder:
  - Competitor teardown agent (ads + run length, landing pages, offers, pricing, bundles, shipping, review counts; weekly; "ten things they do that you don't").
  - Voice-of-customer agent (own + competitor reviews, Reddit, Quora, YouTube/Instagram comments, tickets, WhatsApp; ranked language bank).
  - Persona builder (3-5 situation personas).
  - Angle map (tried angles with CTR/CVR, competitor angles, unused angles; buyer != user, occasion, giver, replacement/upgrade, fear vs aspiration, "for people who hate X").
  - Keyword-CTR map (words correlating with CTR/CVR; clickbait detection; feeds copy agent).
  - Behaviour trigger map (life event, season, problem, gift occasion, social trigger -> audience + angle).
  - Audience segment drafts (age, city, device, income proxy, interest, time-of-day value segments -> bid rules).
  - "Working right now" feed (operators on YouTube, newsletters, communities, Ad Library + pilot plan).
  - Price and offer map (competitor prices, bundles, discount patterns, free-shipping thresholds).
  - Output: research folder + monthly "three angles to test".
- 3.2 Seeing the ad - creative engine (Vis 5 / Lever 4) [p8-9]; 11-step workflow:
  1 Intake (human trigger word/emoji in Slack/Drive); 2 Download & organise (naming product_angle_format_date_version, creative library metadata); 3 Compare to winners (winners library from day one with spend, CTR, CPA, GPP); 4 Break into elements (hook, headline, visual style, product presentation, offer, social proof, CTA, format, aspect ratio); 5 Generate variations (swap one element; one-line hypothesis each); 6 Resolution ladder (720p/low-res first, full-res only for ticked); 7 Copy (5-10 variants from language bank, stack-ranked); 8 Review screen (replaces Meta UI for review); 9 Upload (campaign/ad set, naming, budgets, UTMs; human clicks publish); 10 Watch (sub-agent per test until significance; keep/kill written back); 11 Fatigue watch (frequency, CTR decline, CPM rise -> refresh proposals).
  - Also: low-fi briefs for designers; video loop (scripts from winning hooks, storyboards, 720p drafts, UGC cutdowns, 2K winners); format coverage (feed, story, reel, catalog); compliance pre-check.
  - Metric: creative testing velocity, win rate, CTR and nGPP of new creatives vs account average.
- 3.3 Account structure & media buying (Vis 3 / Lever 5) [p10]: account structure audit; audience architecture (new: broad/interest/lookalike from high-GPP buyers; engaged; excluded: recent buyers, RTO refusers, high-return customers); value-based bid rules by segment; profit-weighted budget allocation; scale and kill rules; testing calendar; bid strategy tests; new channel pilots with written pass/fail; marketplace ad spend on GPP basis; anomaly alerts (spend/CPM spike, CTR crash, tracking drop, disapproval, stuck learning).
- 3.4 Other ways people find you (Vis 2-3 / Lever 3) [p10-11]: SEO; AEO (schema, FAQ, comparison pages, consistent facts, machine-readable reviews, citation tracking); content engine (buying-question posts; sub-agent tracks buyers per post); Instagram & organic social (ideas from angle map; comment/DM buying-intent routing; winning organic -> ad candidates); influencer outreach automation (score by fit, outreach + follow-ups, samples, codes, GPP per creator); marketplaces (listing quality, price parity, review velocity, ad spend; marketplace vs website profitability); referrals -> 3.10.
- 3.5 Landing on the site - speed (Vis 5 / Lever 3) [p11-12]: plain-English speed report; written fix list; batch WebP/AVIF conversion; dead app & script removal; staging first; weekly regression watch sub-agent; third-party script budget.
- 3.6 Browsing - PDPs, catalog, navigation (Vis 5 / Lever 3) [p12]: catalog image refresh (top 50, template per product, overnight generation, human review, push to store + ad feed); descriptions that sell and rank; above-the-fold audit (headline, hero, price/offer, social proof, delivery promise, COD/UPI shown early, sticky ATC); review placement & quality; site search fixes (synonyms, misspellings, zero-result queries); navigation by problem/occasion/person; bundles & FBT from purchase-sequence data; feed quality (Shopping + Meta catalog); catalog health monitor (OOS still advertised, price mismatches, broken variants, missing images).
- 3.7 CRO - the system, not the tweak (Vis 3 / Lever 5) [p12-13]: show-don't-tell competitor side-by-side; skill-backed top-ten test list; sized to traffic; one-tap approval; sub-agent per test; winning structures roll forward; standing backlog.
- 3.8 Checkout and the COD problem (Vis 4 / Lever 5) [p13-14]:
  - Friction: checkout friction audit (steps, fields, guest, autofill, UPI placement, trust, delivery date, coupon field); express payments; cart nudges (free-shipping progress bar, delivery date, COD availability by pincode).
  - COD/RTO: RTO risk score per order; WhatsApp/IVR order confirmation (confirmed event = Meta purchase); prepaid nudges by segment; partial COD token; address quality; verification tiering (low sail / medium WhatsApp confirm / high prepaid-only).
  - Chargebacks & fraud: risk by area/pattern (feeds risk score + bid rules); dispute evidence packs.
- 3.9 Just after the order - transactional, delivery, returns (Vis 4 / Lever 3) [p14-15]: order update flow (confirmed -> packed -> shipped -> out for delivery -> delivered on WhatsApp + email); NDR follow-up automation (WhatsApp + call within the hour); post-delivery check-in; return & exchange flow (specific reason capture, exchange before refund); return-reason loop (sizing -> size chart; colour -> photo; damaged -> packaging/courier; not as described -> description; weekly report); return policy tests; thank-you page upsell + packaging insert (review request, WhatsApp opt-in, reorder code).
- 3.10 Retention - second order and beyond (Vis 3-4 / Lever 4) [p15-16]: flows (abandoned cart 3 touches WhatsApp-first; abandoned browse; welcome by persona; post-purchase; replenishment; win-back; VIP top 10% by GP, early access, no discounts); purchase-sequence personalisation (what is bought second and when; first product predicting best 180-day GP; "bought A -> B after N days"; co-purchase bundles; steer first-order mix in ads); campaigns (calendar tied to launches/festivals/stock; segmented; subject/send-time tests; tone tests); deliverability & hygiene (auth, list cleaning, sunset, complaint monitoring, WhatsApp quality rating); loyalty & referral (model first).
- 3.11 Customer support as a data source (Vis 3 / Lever 3) [p16]: log and tag every conversation (reason + outcome); follow-up tracking; call reason mapping; pre-purchase question mining -> FAQ/PDP/ad angles; complaint clustering; reply drafting with order context; sales-assist (high-intent flagged with one-tap checkout link).

#### D4. Part 4 - People, workflows and adoption [IDEAMAPS Part 4 p16-18]
- 4.1 Workflows per role:
  - Media buyer: morning brief (yesterday's GPP, anomalies, one decision); creative review screen; daily 3-line log -> daily + weekly report; proposals to approve.
  - Designer: briefs with winning reference, hypothesis, sizes, low-fi draft; scored feedback on wins.
  - Marketing team: content calendar, drafts, "three things this week"; flow results in plain language.
  - Ops/support: NDR and return dashboards, follow-up queues, reason tags, reply drafts.
  - Owner/founder: one-page dashboard, weekly report, monthly "ten tests", phone approvals.
  - Agency account manager: all clients on one screen sorted by attention; client-ready reports.
- 4.2 Aligning everyone on gross profit (Vis 3 / Lever 4): brand pays from lift; agency share of GP lift; media buyer share of agency share; designer share tied to creative win rate; marketing/product/support leads tied to their number (repeat GP, return rate, follow-up-to-order); founder keeps largest share. Adoption A/B test (incentive on vs off). Guardrails: GP not revenue/ROAS; written baseline; paid quarterly.

#### D5. Parts 5-7 and appendices
- Part 5 Reporting & dashboards (Vis 5 / Lever 2) [p18]: automated weekly report into client's Google Sheet (three paragraphs: what moved, why, what we're doing); daily report from buyer log; monthly review (ten tests, next calendar, three biggest opportunities); owner, product, geography dashboards; alerts not reports (tracking, spend, stock, fatigue, deliverability); read-only by design.
- Part 6 Two delivery models [p18-19]: Done-with-you service (connect, audit, switch on by stack rank, run 90 days, hand over; priced from GP lift) vs Platform SaaS (self-serve, agents, review screens, dashboards, test system, playbook; per brand + share of lift, or per seat for agencies). "If gross profit doesn't go up, nobody pays."
- Part 7 Switch-on order [p19]: Day 1 catalog images; Week 1 speed, weekly report, pixel/CAPI, daily log; Week 2 COGS + GPP + research pass; Week 3 creative pipeline + stack-ranked tests; Month 2 COD/RTO, negative signals, bid rules, high-margin spend, abandoned cart, app audit, incentive scheme; Month 3 CRO, courier routing/NDR, return loop, sequence personalisation, support tracking, AEO/content, influencer outreach; Month 4+ inventory forecasting, supplier scorecards, material bands, video loop, new channels, marketplaces, loyalty.
- Appendix A Test backlog by stage [p19-20]: research & angles; creative (incl. 720p vs 2K); copy (incl. Hindi/regional); media buying; speed & site; product page; checkout; post-purchase; retention; logistics; people (incentive on/off). "One variable, one sub-agent, one metric."
- Appendix B Metric glossary [p20-21]: CPM, CTR, CPC, CPA, CAC, ROAS, MER, COGS, landed cost, GPP, nGPP, 90/180-day GP, RTO, NDR, prepaid share, contribution margin, CAPI, AEO, CRO.

---

### PART E. DECKv2 - "Ecommerce OS" pitch deck v2 (34 slides)

- s1 Cover: "A 24/7 AI workforce that runs, tests and improves every step of your ecommerce business." For brand owners and performance agencies; India first; paid only from profit created; working name, proposal for feedback.
- s2 The problem - six leaks: ads shipped blind; slow site quietly; catalogs that don't sell; COD orders that come back; ROAS that lies; reports nobody acts on. "There is no playbook."
- s3 Part One divider: why this works now.
- s4 The economics: AI as capex not subscription - 24/7 automated workforce; inference costs collapsing; recursive self-improvement; front-loaded cost, compounding return.
- s5 The cost curve: 01 setup and learning (flagship models read history) -> 02 routing and refining (cheapest model that gets 95%) -> 03 compounding (refined playbooks, cheap sub-agents).
- s6 Model routing table: read history & build strategy (flagship, one-time); design a test with hypothesis (flagship); plain-English speed report (mid-tier, <Rs30/report); value-based bid rules (mid-tier, Rs10-15/run); watch bounce/CTR on one page (small sub-agent, fractions of a rupee); catalog images at scale (subsidised image model, few rupees/image; ~1,500 images per Rs8,000 credits). Client-level API keys.
- s7 Humans + AI: reason first, then test; low-fi briefs for your designers; taste is the last moat; collaboration not replacement.
- s8 The pattern: Hypothesis -> One change -> Sub-agent watches -> Significance check -> Playbook updated. Examples: landing page hero; keyword reuse; bid rule for 35-45 age group.
- s9 The map: one OS, ten pillars - 01 Research & Strategy; 02 Ads & Creative; 03 Media Buying; 04 Website & Speed; 05 Search & AI Visibility; 06 Catalog; 07 Checkout & COD; 08 Post-Purchase & Retention; 09 Shipping & Returns; 10 Sourcing & Inventory. Underneath: Tracking, Attribution & Reporting (pixel/CAPI health, GPP instead of ROAS, self-writing reports).
- s10 How it works: 1 Connect (Shopify, Meta, Google, WhatsApp, email, courier, Drive, Slack, analytics; read-only) -> 2 Audit (every pillar vs playbook, gaps sized in money) -> 3 Propose (ranked tests/fixes with hypothesis, upside, needs) -> 4 Run (approve; agent builds, ships; sub-agent watches; staging first) -> 5 Report (daily team, weekly owner; learnings to playbook). Guardrails: spend caps, approval rules, read-only default, change log, one-click undo. Living playbook (skills from best operators + own 6+ years).
- s11 Part Two divider: the ten pillars in detail.
- s12 Pillar 01 - Agent: The Researcher - reads Meta Ad Library (run length), own and competitor reviews, Reddit/Quora/YouTube/Instagram comments, own account history, top operators; builds personas from data, angle & keyword map, competitor folder, "working right now" feed. Tests: persona A vs B; 3 new angles/month; reuse top-CTR keywords.
- s13 Pillar 02 - Agent: The Creative Director - Drive/Slack intake -> compare to winners -> break into elements -> variations (one element at a time, stack-ranked with hypothesis) -> uploaded to Meta (human publishes); headlines and copy too (5-10 variants); generation nearly free; video next. Tests: hook vs hook, offer swaps, static vs carousel, price shown vs hidden.
- s14 Pillar 03 - Agent: The Media Buyer - campaign setup done (structure, audiences, placements, budgets, naming, UTMs); value-based bid rules; scale and kill rules; new channel pilots (Google Shopping, YouTube, Pinterest); push what's profitable (margin-weighted spend); testing cadence. Tests: broad vs interest; cost cap vs lowest cost; Advantage+ vs manual; segment caps; dayparting.
- s15 Pillar 04 - Agent: The Site Doctor (speed) - plain-English report -> fix written out -> images batch-converted -> staging then live; "~3s -> <1s" on own store; mobile-first on mid-range Android. Tests: fewer apps, lazy-load, deferral; verified by sub-agent.
- s16 Pillar 04 - The Site Doctor (landing page tests) - show-don't-tell; skill-backed suggestions; sized to traffic; one-tap approval; sub-agent monitors; above the fold; path to checkout; dynamic structure roll-forward.
- s17 Pillar 05 - Agent: The Visibility Agent - AEO (structure pages/FAQs/product data, track AI citations); SEO that pays; blog posts built to convert. "Do these three this week" rule.
- s18 Pillar 06 - Agent: The Catalog Manager - top 50 sellers first; one template per product; images generated overnight; human review and push to store + ad feed; descriptions that convert and rank; feed quality; catalog health monitor. "Why first": hours -> minutes, day-one visible trust builder.
- s19 Pillar 07 - Agent: The Checkout Agent - RTO risk scoring; order confirmation (WhatsApp/IVR); prepaid nudges; partial COD; address and pincode checks; checkout friction audit. Tests: confirmation copy/timing, prepaid discount 3% vs 5% vs free shipping, token Rs49 vs Rs99.
- s20 Pillar 08 - Agent: The Retention Manager - abandoned cart (3 touches); order updates; review request (photo reviews rewarded, fed to ads/pages); cross-sell & replenish; win-back; loyalty & referrals (only if it pays). Tests: timing, channel order, discount, tone, review day 3 vs 7.
- s21 Pillar 09 - Agent: The Ops Agent - courier rate comparison; courier performance by pincode + auto-routing; NDR follow-up within the hour; return reasons closed loop (to Catalog agent); return policy tests; delivery promise at checkout.
- s22 Pillar 10 - Agent: The Inventory Agent - demand forecast by SKU; reorder alerts (lead time-based); cash locked in stock + dead stock plan; landed cost & true margin; supplier tracking; launch & festive planning (Diwali, sale and wedding seasons). Tests: safety stock, bundle pricing for slow movers, pre-order for late hero SKUs.
- s23 Foundation - Agent: The Analyst (reports) - Ads Manager + Metabase/GA/Shopify pulled read-only -> client's Google Sheet -> three-paragraph write-up -> sent Thursday; read-only by design; buyer's daily log; cross-platform one view.
- s24 Foundation - The Analyst (GPP) - "the only number that matters"; friend's-brand example (4x ROAS losing money on low-margin SKUs); COGS upload once; repeat GP 90/180 days; pixel & CAPI health daily; returns fed back to Meta as negative signals.
- s25 Part Three divider: team, rhythm, deal.
- s26 The team: 8 named agents - The Researcher; The Creative Director; The Media Buyer; The Site Doctor; The Catalog Manager; The Retention Manager; The Ops Agent (checkout, COD, couriers, returns, stock); The Analyst. Agents talk to each other (Analyst -> Media Buyer profitability; Ops -> Catalog return reasons; Researcher -> Creative Director angles); cheap sub-agents watch one metric each.
- s27 The rhythm: every morning 3-minute brief; whenever creatives land (test ready within the hour); end of day 3-line log; Thursday weekly report; monthly "ten tests" + calendar + three biggest opportunities.
- s28 For agencies: all clients one dashboard; same playbook every account; onboard a client in a day; catch it before the client does; client-ready reports; more clients per buyer.
- s29 Incentives: brand, agency, media buyer all paid on brand's GP; worked example (Rs10 lakh/month lift -> 20% agency Rs2 lakh -> quarter to buyer Rs50,000 -> brand keeps Rs8 lakh).
- s30 The offer: if GP doesn't go up you don't pay; baseline, fund and run initiatives, share of increase; retainers optional; platform vs done-with-you (90 days).
- s31 Start small, compound: Day 1 catalog images; Week 1 speed & reporting; Week 2 research pass; Week 3 creative loop; Month 2 profit and bids (COGS, GPP, value-based bids, CAPI returns feedback); Month 3+ full journey (LP tests, COD/RTO, retention flows, couriers, inventory). "Proven on our own brand first. Then one client. Then the roster."
- s32 India first: COD/partial COD/RTO first-class; WhatsApp primary channel; pincode routing & serviceability; UPI-first, mid-range Android, patchy networks; festive calendar; marketplace awareness (Amazon, Flipkart, Myntra, quick commerce); Hindi/regional creatives and flows. Going global: India modules switch off per market; same core loop; regional add-ons (payment, tax, courier, marketplace connectors).
- s33 Why us: 6+ years operator side; own brand live on the playbook (five figures/day); pilot agent systems shipped in other industries (incl. investment-advisor onboarding); know the leaks; done model-routing work; willing to spend to learn.
- s34 Next step: 30-minute call -> connect accounts read-only (audit with numbers) -> first wins live in 7 days (catalog refreshed, site faster, Thursday report automated).

---

### PART F. PROPOSED WORKFLOW / AGENT LIBRARY IN THESE DOCS

Format: `name` | level | area | source | one line. Levels follow the catalogue vocabulary (prompt / skill / routine / workflow / agent / system). Where a doc names a "loop", it is filed as routine (scheduled/triggered) with learning; where a doc names an "orchestrator", it is filed as agent.

#### F1. Systems and platform-level parts
- `ecommerce-os-platform` | system | SY | DECKv2 s9-s10; IDEAMAPS Part 6; DELIGHT §7 | The whole OS: connect -> audit -> propose -> run -> report across ten pillars + tracking foundation.
- `business-orchestrator` | agent | ST | DELIGHT §7 | Owns objective, context, dependencies, decision queue; checks universal base cards, selects eligible stage cards.
- `founder-home-screen` | system | SY | DELIGHT §3 | Decisions ready (max 3), work in progress, results & learning, business health, ask-the-business.
- `ask-the-business` | agent | AN | DELIGHT §3 | Q&A over the business record with citations and prepared actions.
- `base-and-stage-card-library` | asset | ST | DELIGHT §2, §6 | Domain -> universal base doc -> stage subsection cards -> merchant execution records (e.g. CRO.BASE.01-05, CRO.STAGE.01-04).
- `runtime-work-contract` | asset | SY | DELIGHT §8, §32 | Input/allowed work/output/verification/completion contract + execution envelope + workflow states.
- `shared-business-record` | system | SY | DELIGHT §32; LIFECYCLE Foundation p5 | Versioned object graph from evidence to outcome; dependency events flag downstream work.
- `connector-gateway-and-release-contract` | system | SY | DELIGHT §37 | Tool gateway, scopes, rate limits, fallbacks; read-only first, writes after verification.
- `agent-evaluation-benchmark` | workflow | SY | DELIGHT §37 | Research quality, two-layer routing, congruence, commercial correctness, reliability, isolation tests.
- `model-routing-policy` | knowledge | SY | DECKv2 s5-s6 | Flagship for strategy/test design, mid-tier for judgement reports, small sub-agents for single-metric watching, subsidised image models for volume.
- `sub-agent-per-test-pattern` | routine | AN | DECKv2 s8; IDEAMAPS 3.2, 3.7, App A | Hypothesis -> one change -> sub-agent watches one metric -> significance -> keep/kill -> playbook updated.
- `agency-multi-client-console` | system | SY | DECKv2 s28; IDEAMAPS 4.1; DELIGHT §3 team/agency mode | All clients on one screen, sorted by attention, isolated tenant data.
- `gp-lift-incentive-scheme` | knowledge | ST | IDEAMAPS 4.2; DECKv2 s29-s30; LIFECYCLE §22 | Everyone paid on GP lift vs written baseline; guardrails against ROAS/revenue pay.

#### F2. Named agents (DECKv2 team + pillars; DELIGHT domain orchestrators)
- `researcher-agent` | agent | RS | DECKv2 s12, s26 | Market, competitors, personas, angles, keywords, "working now" feed.
- `creative-director-agent` | agent | CS | DECKv2 s13, s26 | Winners library comparison, element breakdown, variations, copy, upload.
- `media-buyer-agent` | agent | PA | DECKv2 s14, s26 | Campaign setup, value-based bid rules, scale/kill rules, pilots, margin-weighted spend.
- `site-doctor-agent` | agent | WS | DECKv2 s15-s16 | Speed reports and fixes, image conversion, staging, landing-page tests.
- `visibility-agent` | agent | OG | DECKv2 s17 | SEO, AEO citation tracking, buying-question content (not on the s26 team slide).
- `catalog-manager-agent` | agent | CPS | DECKv2 s18 | Image refresh, descriptions, feed quality, catalog health monitor.
- `checkout-agent` | agent | WS | DECKv2 s19 | RTO risk scoring, COD confirmation, prepaid nudges, partial COD, address checks (folded into Ops Agent on s26).
- `retention-manager-agent` | agent | RT | DECKv2 s20 | Abandoned cart, order updates, reviews, cross-sell/replenish, win-back, loyalty.
- `ops-agent` | agent | OP | DECKv2 s21, s26 | Courier rates/performance/routing, NDR, return reasons, return policy tests, delivery promise.
- `inventory-agent` | agent | OP | DECKv2 s22 | Forecast, reorder alerts, dead stock, landed cost, supplier tracking, festive planning (not on s26 team slide).
- `analyst-agent` | agent | AN | DECKv2 s23-s24 | Read-only reporting, GPP scoring, pixel/CAPI health, negative signals.
- `research-and-expansion-orchestrator` | agent | RS | DELIGHT §7, §9, §13 | Market/category/product research and portfolio expansion decision packets.
- `customer-intelligence-orchestrator` | agent | RS | DELIGHT §15-§16 | Cohorts, VOC coding, interviews, JTBD, avatar library, alternative-use worker.
- `offer-orchestrator` | agent | OF | DELIGHT §17 | Strategist, economics, merchandising, CX workers + congruence validator.
- `brand-orchestrator` | agent | BF | DELIGHT §18 | Touchpoint audit, positioning, verbal/visual identity, consistency, governance.
- `store-and-copy-orchestrator` | agent | WS | DELIGHT §19, §23 | Journey analyst, IA, copy, design, storefront worker, validator; preview + release packet.
- `catalog-asset-orchestrator` | agent | CPS | DELIGHT §20 | Ten-image system with product-fidelity and quality review.
- `performance-orchestrator` | agent | WS | DELIGHT §21 | Template inventory, field/lab diagnosis, code fix, regression testing.
- `experiment-orchestrator` | agent | AN | DELIGHT §22 | Experiment contracts, eligibility, guardrails, decision records.
- `creative-orchestrator` | agent | CS | DELIGHT §24 | Reference analysis -> concept matrix -> scripts/visuals -> copy -> QA -> campaign packet.
- `video-orchestrator` | agent | CPV | DELIGHT §25 | Script -> storyboard -> scene-by-scene generation with human picks -> edit -> review.
- `paid-media-orchestrator` | agent | PA | DELIGHT §26 | Meta then Google drafts, approval packets, controls, learning loop.
- `lifecycle-orchestrator` | agent | RT | DELIGHT §27 | Segmentation, event mapping, flows, deliverability, measurement.
- `organic-discovery-orchestrator` | agent | OG | DELIGHT §28 | Technical SEO, intent, editorial, product info, authority, AEO.
- `cx-orchestrator` | agent | CX | DELIGHT §29 | Post-order journey, exceptions, education, service recovery, delight experiments.
- `sourcing-orchestrator` | agent | OP | DELIGHT §30 | BOM, quote normalisation, should-cost, negotiation prep, quality, cash impact.
- `opportunity-evidence-investigator` (A1) | agent | RS | LIFECYCLE p37 | Bounded research to close a decision-critical evidence gap.
- `supplier-coordination-assistant` (A2) | agent | OP | LIFECYCLE p37 | Authorised RFQ follow-ups, comparison updates, sample routing; no commitments.
- `profit-drop-investigator` (A3) | agent | FN | LIFECYCLE p37 | Read-only decomposition of unexplained CM2 deviations.
- `launch-readiness-coordinator` (A4) | agent | ST | LIFECYCLE p37 | Checks spec, stock, catalog, page, feed, creative, tracking, service readiness.

#### F3. Research and strategy workflows / skills
- `market-research-sprint` | workflow | RS | LIFECYCLE §01; DELIGHT §10 | Frame need -> map spending -> study change -> customer interviews -> commercial access -> opportunity brief.
- `category-research-scorecard` | skill | RS | DELIGHT §11 | Category tree + six lenses + weighted scoring with hard exclusions.
- `product-dossier-builder` | workflow | OF | LIFECYCLE §02; DELIGHT §12 | VOC, competitor, supplier, economics, validation specialists -> product dossier + next commitment.
- `existing-brand-expansion-analysis` | workflow | ST | DELIGHT §13 | Portfolio reconstruction + expansion option matrix vs improving current business.
- `evidence-ledger` | asset | RS | LIFECYCLE p5; DELIGHT §14 | Source, date, market, observation, sample, rights, bias, confidence, affected decisions.
- `competitor-teardown` | skill (agent in doc) | RS | IDEAMAPS 3.1; DECKv2 s12 | Weekly competitor ads/pages/offers/pricing -> "ten things they do".
- `voc-language-bank` | skill | RS | IDEAMAPS 3.1; DELIGHT §12, §15 | Mine reviews, forums, comments, tickets, chats -> ranked customer phrases.
- `persona-builder` | skill | RS | IDEAMAPS 3.1; DECKv2 s12; DELIGHT §15 | 3-5 situation-based personas/avatars with evidence.
- `angle-map` | skill | CS | IDEAMAPS 3.1; LIFECYCLE §06 | Tried/competitor/unused angles with performance; gap angles.
- `keyword-ctr-map` | skill | CW | IDEAMAPS 3.1; DECKv2 s12 | Words correlating with CTR/CVR; clickbait flags.
- `behaviour-trigger-map` | skill | RS | IDEAMAPS 3.1 | Purchase triggers -> audiences and angles.
- `audience-segment-drafts` | skill | PA | IDEAMAPS 3.1 | Value segments feeding bid rules.
- `working-right-now-feed` | routine | CS | IDEAMAPS 3.1; DECKv2 s12 | Weekly digest of market tactics with pilot plans.
- `price-and-offer-map` | skill | OF | IDEAMAPS 3.1 | Competitor prices, bundles, discount patterns, thresholds.
- `avatar-problem-angle-matrix` | skill | CS | LIFECYCLE §06, P03 | Evidence-linked matrix + message-to-page map.
- `opportunity-hypothesis-cards` | skill | CS | DELIGHT §16 | Untapped/underdeveloped/exploratory jobs with falsification test.
- `research-synthesis` (P01) | prompt | RS | LIFECYCLE p54 | Segment/opportunity matrix from a supplied evidence pack.
- `avatar-to-page-map` (P03) | prompt | CS | LIFECYCLE p54 | Avatar/problem/angle/proof/offer/page matrix with stable IDs.

#### F4. Product, sourcing, cost
- `bom-and-make-vs-buy-model` | skill | OP | LIFECYCLE §03; DELIGHT §30 | Costed BOM, scenarios, break-even, capacity and cash schedule.
- `batch-tracking` | routine | OP | LIFECYCLE §03 | Material use, yield, defects, actual cost per batch.
- `rfq-and-quote-normalisation` | skill | OP | LIFECYCLE §04, P02; DELIGHT §30 | Comparable landed cost from supplier quotes.
- `supplier-scorecard` | routine | OP | IDEAMAPS 2.1; DECKv2 s22 | Price, lead time promised vs actual, defects, MOQ, terms.
- `alternative-supplier-scan` | workflow | OP | IDEAMAPS 2.1 | Periodic indicative pricing for top-20 SKUs.
- `renegotiation-brief` | prompt | OP | IDEAMAPS 2.1; DELIGHT §30 | One-page ask before each reorder; negotiation options.
- `sample-to-launch-tracker` | routine | OF | IDEAMAPS 2.1 | Samples ordered/landed/tested/decided.
- `savings-verification-record` | skill | FN | DELIGHT §30 | Quoted vs contracted vs realised savings.
- `input-cost-exposure-register` | skill | FN | LIFECYCLE §05 | FX/commodity/freight/supplier/demand exposures with 5-step decision test.
- `margin-at-risk-monitor` | routine | FN | IDEAMAPS 2.2 | Per-SKU margin at today's material cost vs set price; floor alerts.
- `pricing-bands` | skill | OF | IDEAMAPS 2.2 | Planned price moves only when material leaves the band; silent levers first.
- `landed-cost-per-sku` | skill | FN | IDEAMAPS 2.3, 1.3; DECKv2 s22 | Product + freight + duties + clearing + handling per unit.
- `inbound-po-tracking` | routine | OP | IDEAMAPS 2.3 | ETA per PO, delays, stock-out impact; inward QC log.

#### F5. Offer, brand, store, CRO
- `offer-economics-calculator` (P04) | skill | OF | LIFECYCLE §07, p54; DELIGHT §17 | GP/CM1/CM2 per offer under scenarios; cannibalisation and cash flags.
- `offer-consistency-check` | routine | OF | LIFECYCLE §07 | Price/discount consistency across store, feed, ads, email.
- `offer-implementation-packet` | workflow | OF | DELIGHT §17 | Copy, assets, page, config, segments, inventory, lifecycle, experiment, rollback.
- `brand-document` | asset | BF | DELIGHT §18; LIFECYCLE p39 | Strategy, voice, visual system, rationale, governance.
- `new-founder-setup` | workflow | BF | DELIGHT §18 | Name, domain, storefront, HTTPS, business email, DNS auth, payments/shipping/tax.
- `store-launch-checklist` | skill | WS | LIFECYCLE §08 | Product truth, commerce, experience, operations, data.
- `app-decision-sheet-and-audit` | skill | SY | LIFECYCLE §08; IDEAMAPS 2.5 | App/SaaS cost, usage, overlap, removal plan, renewal calendar, tech cost per order.
- `message-match-audit` | skill | WS | LIFECYCLE §09, priority 5 | Ad vs page vs product truth vs offer mismatches.
- `journey-friction-audit` (P05) | prompt | WS | LIFECYCLE p54 | Ad -> page -> cart -> checkout -> messages -> insert -> guide as one journey.
- `page-builder-packet` | workflow | WS | DELIGHT §19 | PDP / campaign LP / advertorial / listicle / quiz funnel with preview and test checklist.
- `above-the-fold-audit` | skill | WS | IDEAMAPS 3.6; DECKv2 s16 | Headline, hero, price, proof, delivery promise, COD/UPI, sticky ATC.
- `cro-test-system` | workflow | WS | IDEAMAPS 3.7; DECKv2 s16; LIFECYCLE L2 | Competitor side-by-side, skill-backed top-10 tests sized to traffic, one-tap approval, sub-agent per test, roll-forward.
- `site-speed-doctor` | workflow | WS | IDEAMAPS 3.5; DECKv2 s15; DELIGHT §21 | Plain-English report, fix list, WebP batch, dead scripts, staging, weekly regression watch.
- `storefront-release-sequence` | workflow | WS | DELIGHT §23 | Snapshot, prepare, preview, verify, authorise, publish, recover.
- `site-search-fixes` | routine | WS | IDEAMAPS 3.6 | Synonyms, misspellings, zero-result queries weekly.
- `checkout-friction-audit` | skill | WS | IDEAMAPS 3.8; DECKv2 s19; LIFECYCLE §10 | Steps, fields, guest, payments, trust, coupon field, delivery date.
- `cart-and-post-purchase-offer-rules` | routine | WS | LIFECYCLE §10; IDEAMAPS 3.9 | Eligibility-checked cross-sell, thank-you page upsell, order amendment hygiene.
- `rto-risk-scoring-and-cod-confirmation` | workflow | WS | IDEAMAPS 3.8; DECKv2 s19 | Per-order risk score, WhatsApp/IVR confirm, verification tiering, prepaid nudges, partial COD.
- `address-and-serviceability-checks` | routine | OP | IDEAMAPS 2.6, 3.8 | Address correction, block non-serviceable pincodes at checkout.
- `chargeback-risk-and-dispute-packs` | routine | FN | IDEAMAPS 3.8; LIFECYCLE §20 | Risk by area/pattern; evidence packs and deadlines.

#### F6. Creative and acquisition
- `context-packet` | asset | BF | LIFECYCLE p39 | One versioned brand/product/offer/proof context for all generation.
- `master-image-prompt` | prompt | CPS | LIFECYCLE p39 | Fidelity-preserving image generation with QA checklist.
- `master-video-script-prompt` | prompt | CPV | LIFECYCLE p39 | Timecoded script with evidence per claim and 3 hooks.
- `image-format-library-I01-I40` | asset | CS | LIFECYCLE p40-47 | 40 image/carousel format cards in 8 families.
- `video-format-library-V01-V16` | asset | CS | LIFECYCLE p48-51 | 16 video structures in 4 families.
- `ten-image-pdp-system` | skill | CPS | DELIGHT §20 | Hero, context, benefit, how it works, fit, materials, comparison, proof, contents, care.
- `catalog-image-refresh` | workflow | CPS | IDEAMAPS 3.6; DECKv2 s18 | Top-50 first, template per product, overnight generation, human review, push to store + feed.
- `pdp-description-rewriter` | skill | CW | IDEAMAPS 3.6; DECKv2 s18 | Voice + language bank; benefits, objections, specs; SEO/AEO readable.
- `meta-creative-pipeline` | workflow | CS | IDEAMAPS 3.2 (11 steps); DECKv2 s13 | Intake -> organise -> compare to winners -> elements -> variations -> resolution ladder -> copy -> review screen -> upload -> watch -> fatigue.
- `winners-library` | asset | AN | IDEAMAPS 3.2; DECKv2 s13 | Every ad from day one with spend, CTR, CPA, GPP and reasons.
- `creative-fatigue-watch` | routine | AN | IDEAMAPS 3.2 | Frequency, CTR decline, CPM rise -> refresh proposals.
- `low-fi-designer-brief` | skill | CS | IDEAMAPS 3.2, 4.1; DECKv2 s7 | Rough version + hypothesis + sizes + winning reference.
- `ad-compliance-precheck` | skill | CW | IDEAMAPS 3.2 | Flag claims likely to be rejected before upload.
- `concept-matrix` | skill | CS | DELIGHT §24 | Avatar x job/angle x proof x format x offer, pruned to distinct hypotheses.
- `sequential-video-production` | workflow | CPV | DELIGHT §25; IDEAMAPS 3.2 video loop | Script -> storyboard -> scene 1 variations + pick -> continuity scenes -> edit -> review lenses.
- `creative-learning-loop` (L1) | routine | AN | LIFECYCLE p36 | Weekly concept test with mature contribution keep/iterate/stop.
- `meta-account-structure-audit` | skill | PA | IDEAMAPS 3.3; LIFECYCLE §11; DELIGHT §26 | Prospecting/retargeting, consolidation, learning phase, naming/UTMs.
- `audience-architecture` | skill | PA | IDEAMAPS 3.3 | New / engaged / excluded (RTO refusers, high-return) audiences; high-GPP lookalikes.
- `value-based-bid-rules` | routine | PA | IDEAMAPS 3.3; DECKv2 s14 | Segment CPA caps/adjustments refreshed monthly.
- `profit-weighted-budget-allocation` | routine | PA | IDEAMAPS 3.3; DECKv2 s14 | Shift spend to best-GPP SKUs/campaigns.
- `scale-and-kill-rules` | routine | PA | IDEAMAPS 3.3; DECKv2 s14; LIFECYCLE §13 scaling rule | Written rules applied daily with permitted change size.
- `ad-anomaly-alerts` | routine | AN | IDEAMAPS 3.3, Part 5 | Spend/CPM spike, CTR crash, tracking drop, disapproval, stuck learning.
- `ad-optimization-diagnostic` | skill | AN | LIFECYCLE §13 | Six-pattern diagnostic table before changing spend; decision log.
- `meta-campaign-approval-packet` | workflow | PA | DELIGHT §26 | Draft campaign, previews, settings, pause rules; controlled publish + read-back.
- `new-channel-pilot` | workflow | PA | IDEAMAPS 3.3; DECKv2 s14 | Small time-boxed pilot with written pass/fail.
- `google-search-rsa-generator` (G01) | prompt | CW | LIFECYCLE p53, §12 | Intent clusters, 10 headlines <=30 chars, 4 descriptions <=90 chars.
- `merchant-feed-audit` (G02) | prompt | PA | LIFECYCLE p53; IDEAMAPS 3.6 feed quality | Feed vs page facts, errors by item, no invented GTINs.
- `youtube-demand-gen-adapter` (G03) | prompt | CPV | LIFECYCLE p53 | Adapt a V-format to YouTube/Demand Gen with hooks and hypotheses.
- `influencer-program` | workflow | CR | LIFECYCLE §15; IDEAMAPS 3.4 | Shortlist scorecard, outreach/terms, product experience, content review, rights register, GPP per creator.
- `creator-rights-expiry-watch` | routine | CR | LIFECYCLE §15 | Flag expiring usage rights before continued ad use.

#### F7. Organic and marketplaces
- `seo-technical-audit` | skill | OG | LIFECYCLE §14; DELIGHT §28; IDEAMAPS 3.4 | Crawl, index, canonicals, variants, redirects, links, sitemap, OOS handling.
- `aeo-structured-data-and-citation-tracking` | routine | OG | IDEAMAPS 3.4; DECKv2 s17; DELIGHT §28 | Schema, FAQs, comparison pages, consistent facts; track AI citations (bounded promise).
- `buying-question-content-engine` | workflow | OG | IDEAMAPS 3.4; LIFECYCLE §14; DECKv2 s17 | Question -> brief -> draft -> review -> publish -> track buyers per post -> refresh.
- `organic-social-intent-routing` | routine | OG | IDEAMAPS 3.4 | Post ideas from angle map; route buying-intent comments/DMs; flag ad candidates.
- `marketplace-listing-and-parity-monitor` | routine | OG | IDEAMAPS 3.4, #35 | Listing quality, price parity, review velocity, marketplace vs website GPP.

#### F8. Lifecycle, retention, CX
- `contact-orchestration-layer` (R3) | routine | RT | LIFECYCLE §16, p36 | Consent -> state -> suppressions -> priority/cap -> idempotent send -> log -> exit.
- `state-based-lifecycle-flows` | workflow | RT | LIFECYCLE §17 (13 triggers); DELIGHT §27 (7 flows) | Welcome, browse/cart recovery, order/delivery, activation, replenishment, cross-sell/VIP, recovery/win-back.
- `abandoned-cart-whatsapp-first` | workflow | RT | IDEAMAPS 3.10, #11; DECKv2 s20 | 3 touches, WhatsApp then email, timing/offer tests.
- `order-update-flow` | routine | RT | IDEAMAPS 3.9; DECKv2 s20 | Confirmed -> packed -> shipped -> out for delivery -> delivered on WhatsApp + email.
- `purchase-sequence-personalisation` | workflow | RT | IDEAMAPS 3.10, #17 | Mine second-purchase patterns; "bought A -> B after N days"; co-purchase bundles.
- `review-request-timing` | routine | RT | LIFECYCLE §17, §20; IDEAMAPS 3.10; DECKv2 s20 | Neutral ask after real use; no sentiment incentive (note: DECK/IDEAMAPS "photo reviews rewarded" must stay sentiment-neutral).
- `vip-segment-program` | workflow | RT | LIFECYCLE §21; IDEAMAPS 3.10; DELIGHT §29 | VIP by retained contribution/GP; early access, no discounts.
- `loyalty-referral-model-first` | skill | RT | LIFECYCLE §21; IDEAMAPS 3.10 | Model economics before launching points/tiers/referrals.
- `winback-and-sunset` | workflow | RT | LIFECYCLE §17, §21; IDEAMAPS 3.10 | Lapse diagnosis, recovery offer, sunset policy.
- `deliverability-and-list-hygiene` | routine | RT | LIFECYCLE §16; IDEAMAPS 3.10, #29; DELIGHT §18 | SPF/DKIM/DMARC, list cleaning, complaints, WhatsApp quality rating.
- `founder-email-drafter` | prompt | RT | LIFECYCLE §16, p35 | Real founder view drafts for voice/fact review.
- `seasonal-campaign-calendar` | workflow | ST | DELIGHT §27; IDEAMAPS 2.4, 3.10; DECKv2 s22, s32 | Launches, festivals, stock and margin planned together.
- `unboxing-delight-kit` | workflow | CX | LIFECYCLE §19 (20 moments) | Choose moments, copy, SKU instructions, routine insert selection, test vs control.
- `first-use-education` | workflow | CX | LIFECYCLE §20, priority 7; DELIGHT §27 activation | Quick-start, QR page, timed messages, observable first-use outcome.
- `support-conversation-tagging` | routine | CX | IDEAMAPS 3.11, #19 | Reason + outcome tags, follow-up tracking, call reason weekly report.
- `support-reply-drafter` | skill | CX | IDEAMAPS 3.11; LIFECYCLE §20 | Brand-voice replies with order context from approved sources.
- `pre-purchase-question-mining` | skill | RS | IDEAMAPS 3.11; LIFECYCLE System map feedback | Questions -> FAQ, PDP content, ad angles.
- `sales-assist-routing` | routine | CX | IDEAMAPS 3.11 | High-intent chats flagged with one-tap checkout link.
- `returns-exchange-flow` | workflow | CX | IDEAMAPS 3.9; LIFECYCLE §20 | Self-serve, specific reason capture, exchange before refund.
- `return-reason-root-cause-loop` | routine | CX | IDEAMAPS 3.9, #27; DECKv2 s21; LIFECYCLE L3, priority 11; DELIGHT §29 | Route reasons to size chart, photos, packaging/courier, description, product/sourcing.
- `product-experience-improvement` (L3) | routine | CX | LIFECYCLE p36 | Isolate cause, change guide/product/packaging, test cohorts.
- `service-recovery-and-complex-exceptions` | agent | CX | LIFECYCLE §20; DELIGHT §29 | Bounded investigation across product, payment, carrier, contacts; human beyond policy.

#### F9. Operations, inventory, finance, reporting
- `shipment-exception-handling` (R2) | routine | OP | LIFECYCLE p36, §18 | Classify exception, update case, factual message, route remedy.
- `ndr-follow-up-automation` | routine | OP | IDEAMAPS 3.9, #16; DECKv2 s21 | WhatsApp + call within the hour of a failed attempt; reattempt.
- `courier-benchmark-and-pincode-routing` | workflow | OP | IDEAMAPS 2.6, #15; DECKv2 s21; LIFECYCLE §18 | Rate benchmark, performance by pincode/zone, best-courier routing, carrier scorecard.
- `packaging-and-weight-audit` | skill | OP | IDEAMAPS 2.6; LIFECYCLE §18 | Billed slabs vs actual; packaging vs damage tests.
- `freight-invoice-audit-and-claims` | routine | OP | LIFECYCLE §18 | Billed weights/surcharges vs rates; recovery claims.
- `delivery-promise-at-checkout` | skill | OP | IDEAMAPS 2.6; DECKv2 s21; LIFECYCLE §18 | Real ETA by pincode; honesty guardrail.
- `demand-forecast-and-reorder` | routine | OP | LIFECYCLE §22; IDEAMAPS 2.4; DECKv2 s22 | Low/base/high SKU demand, lead-time-based reorder proposals.
- `ad-inventory-link` | routine | PA | IDEAMAPS 2.4; LIFECYCLE System map feedback | Warn/shift spend when SKU cover < N days.
- `dead-stock-plan` | skill | OP | IDEAMAPS 2.4; DECKv2 s22 | Bundle, discount, marketplace clearance, stop reorder; cash freed.
- `cash-and-stock-guard` | routine | FN | LIFECYCLE priority 12, §22 | Constraints and replenishment proposals from stock, inbound, spend, payouts.
- `profit-truth-reconciliation` (R1) | routine | FN | LIFECYCLE p36, priority 1, p6 | Daily orders/payments/refunds/spend/costs/payouts reconciliation with exceptions.
- `gpp-scoring` | routine | FN | IDEAMAPS 1.2-1.3, #5; DECKv2 s24 | COGS upload once; every order/product/campaign/ad scored on GPP/nGPP.
- `metric-dictionary` | asset | AN | LIFECYCLE p6-p8; IDEAMAPS App B; DELIGHT §31 | Shared definitions (GP, CM1, CM2, GPP, nGPP, MER, CAC, LTV, payback...).
- `event-architecture-and-purchase-qa` | workflow | AN | LIFECYCLE p9-p10, priority 2; IDEAMAPS #4 | Event dictionary, 12 test cases, Pixel/CAPI/Google/consent verification.
- `capi-value-and-negative-signals` | routine | AN | IDEAMAPS 1.4, #9; DECKv2 s24 | GP as value, RTO/returns/chargebacks as negative events, confirmed-COD, offline events, match quality (verify platform effect per LIFECYCLE p10 caution).
- `attribution-and-incrementality-design` | skill | AN | LIFECYCLE p11; DELIGHT §31 | Separate finance, platform-attributed and experimental views; holdouts.
- `experiment-contract` | skill | AN | DELIGHT §22; LIFECYCLE p11 | Hypothesis, unit, population, metric, guardrails, MDE, sample, duration, stop rule.
- `weekly-report-auto` | routine | AN | IDEAMAPS Part 5, #3; DECKv2 s23 | Read-only pulls into client's sheet; three-paragraph write-up sent Thursday.
- `media-buyer-daily-log` | routine | AN | IDEAMAPS 4.1, #18; DECKv2 s23, s27 | Three-line log -> daily and weekly report.
- `morning-brief` | routine | AN | IDEAMAPS 4.1; DECKv2 s27 | Yesterday's GP, fires, what works, one decision today.
- `monthly-ten-tests-review` | routine | AN | IDEAMAPS Part 5; DECKv2 s27 | Ten tests and learnings, next calendar, three biggest opportunities.
- `owner-product-geography-dashboards` | system | AN | IDEAMAPS 1.5, Part 5; LIFECYCLE p8 four views | Owner, media buyer, product push/kill, geography (pincode) views with "three things this week".
- `weekly-profit-action-brief` (P06) | prompt | FN | LIFECYCLE p54, priority 10 | GP/CM1/CM2/cash bridge with max three interventions.
- `weekly-business-review` | workflow | ST | LIFECYCLE §22, p38 owner packet | Finance -> growth -> ops -> CX -> founder ranked intervention list.
- `employee-gp-incentive-scheme` | knowledge | ST | IDEAMAPS 4.2, #30; DECKv2 s29 | GP-lift shares by role with adoption A/B test.
- `test-backlog-by-stage` | asset | AN | IDEAMAPS App A | Flat one-variable test list across research, creative, copy, buying, site, PDP, checkout, post-purchase, retention, logistics, people.

---

### PART G. DOC NOTES

#### G1. LIFECYCLE - Ecommerce_OS_Complete_Lifecycle_Blueprint.pdf
- Purpose: planning and implementation manual for a physical-product ecommerce business from first market hypothesis to profitable repeat purchase, with the division of work between people and P/S/R/L/A automation.
- Audience: Kevin ("Prepared for Kevin") as founder/operator and builder of Ecommerce OS; usable by operators, agencies, and as a spec for the catalogue.
- Date / version: 9 Sep 2026, v1.0. 56 pages (cover + 55 content pages). Built by `tmp\pdfs\build_lifecycle.py` from `lifecycle_content.md`.
- Structure: Read first (p2) -> system map, execution model, input pack (p3-5) -> economics, metrics, events, platform QA, attribution (p6-11) -> 22 lifecycle playbooks 01-22 (p12-33) -> worked journey (p34) -> 12 build priorities, R1-R3/L1-L3, A1-A4, rollout (p35-38) -> prompt foundation, I01-I40, V01-V16, worked creative, Google kit G01-G03, operational prompts P01-P06 (p39-54) -> sources S1-S19 (p55-56).
- Quality: very high. Most complete and internally consistent of the four; every playbook has decision/owner/tasks/method code/deliverable/metrics/gate; strong guardrails (no fabricated proof, consent, incrementality, cohort maturity). Country-neutral, USD examples. Recommendations, thresholds and timings are labelled as proposals; creative formats labelled as untested hypotheses. Sources checked 9 Sep 2026 (S4 Meta dedup page was inaccessible, flagged).
- Overlaps: DELIGHT reorganises much of it into an orchestrated product (DELIGHT §38 cites the lifecycle blueprint for continuity); IDEAMAPS/DECK cover the same lifecycle with an India/COD lens and GPP metric. Unique here: manufacturing/make-vs-buy, input-cost hedging, 20 unboxing moments, 13 lifecycle state triggers, 40 image + 16 video format cards, G/P prompt kits, R/L/A catalog.
- Twins: `Ecommerce OS\output\pdf\Ecommerce_OS_Complete_Lifecycle_Blueprint.pdf` (identical MD5); source `tmp\pdfs\lifecycle_content.md`; text extract `eos_inv\text\Ecommerce_OS_Complete_Lifecycle_Blueprint.txt`.
- Catalogue value: the best master map for stages/functions and the strongest source of ready prompts (I/V/G/P cards) and routine/agent specs.

#### G2. DELIGHT - Ecommerce_OS_Customer_Delight_Architecture.pdf
- Purpose: product and system blueprint for Ecommerce OS as software: founder experience, personalisation, expert knowledge layer, orchestration, runtime contracts, domain orchestrators, shared records, worked journeys, build plan, engineering and evaluation. "Built around customer delight. From first product to a $50M brand."
- Audience: Kevin as product owner and the build team (product lead, engineers, applied-AI/eval owner, domain experts); also design partners.
- Date / version: 16 Sep 2026, v1.1. 40 pages (cover + §1-§39). Built by `tmp\pdfs\customer_delight\build_pdf.py`; v1.1 produced by `revise_v1_1.py`; prior version `before_v1_1.md` / `before_v1_1.pdf`; `changed_pages.json` lists 26 changed pages.
- Structure: §1-§9 promise, personalisation, founder home screen, connected journeys, business context, expert knowledge layer, orchestration (architecture diagram), runtime contract, research orchestration -> §10-§18 market, category, product, expansion, research inputs, customer intelligence, opportunity discovery, offers, brand -> §19-§30 store/copy, imagery, speed, experimentation, store execution, Meta creative, video, paid acquisition, lifecycle, organic/AEO, CX, sourcing -> §31-§37 measurement, shared records, worked journeys A and B, build plan 1 and 2, engineering/evaluation -> §38-§39 sources S01-S12 and provenance.
- v1.1 change summary: introduced universal base cards + stage-specific subsection cards (base standards never waived by revenue; stage cards gated by traffic/data/complexity with unlock conditions), replacing v1.0's maturity-stage routing table and method-card ingestion page; propagated "two layers" paragraphs into most domain pages, runtime contract, execution envelope, worked journeys, build plan and evaluation. v1.0's 5-stage maturity table is the clearest launch->grow->scale ladder and is preserved in Part A1 above.
- Quality: high, architecture-grade; consistent guardrails; honest scope notes (no merchant connected; the referenced 40-60 page expert product-research collection was not found; Meta publishing capability unverified). Primary input was a founder voice transcript. Delight content is mostly about CX moments (§29) and founder delight (§3), not a separate "delight moments" catalogue - LIFECYCLE §19 holds the 20 concrete moments.
- Overlaps: re-uses LIFECYCLE economics, CWV, event, lifecycle and sourcing logic; domain list mirrors DECKv2 pillars but with US/Shopify framing. Unique here: orchestrator/worker/validator design per domain, base/stage card model, runtime contract and workflow states, shared business record schema, worked journeys A/B, phased build plan and evaluation families, new-founder domain/email setup, ten-image PDP system, sequential video workflow.
- Twins: `Ecommerce OS\output\pdf\Ecommerce_OS_Customer_Delight_Architecture.pdf` (identical MD5); `tmp\pdfs\customer_delight\content.md` (v1.1 source); `before_v1_1.md` + `before_v1_1.pdf` (v1.0).
- Catalogue value: blueprint for the agent/system levels and the platform skeleton (orchestrators, contracts, records, eval).

#### G3. IDEAMAPS - Ecommerce idea maps.pdf
- Purpose: "The Full Idea Map" - every value-add opportunity across an ecommerce business (business side + customer side) with today / what we do / tests / metric and Visibility x Lever scores; explicitly "not an implementation plan".
- Audience: internal (Kevin and partners) for prioritising what to build/sell; written for an Indian D2C context (COD, RTO, NDR, pincodes, WhatsApp, UPI, festivals, Hindi creatives).
- Date: 7 Sep 2026 (PDF mtime). 21 pages. No version stated.
- Structure: scoring + Part 0 stack rank of 35 ideas -> Part 1 metrics layer (GPP etc.) -> Part 2 business side 2.1-2.6 -> Part 3 customer journey 3.1-3.11 -> Part 4 people/roles/incentives -> Part 5 reporting -> Part 6 two delivery models -> Part 7 switch-on order -> Appendix A test backlog -> Appendix B glossary.
- Quality: medium-high. Concrete, operator-voice, very actionable; strong opportunity tree and prioritisation. Weaker on evidence discipline than LIFECYCLE/DELIGHT: some assertive claims ("long-running = working", "20-35% of COD orders come back", GP-as-value optimisation, "photo reviews rewarded") would need the LIFECYCLE/DELIGHT guardrails (ad longevity is not proof; review incentives must not be sentiment-conditioned; platform value-optimisation effects must be verified). Its "gross profit per purchase" deducts ad cost, so terminology differs from LIFECYCLE GP/CM2. Text extract is Windows-1252 with arrows/+- lost.
- Overlaps: near 1:1 source for DECKv2 (same pillars, tests, switch-on order, incentive model, delivery models); overlaps LIFECYCLE on lifecycle flows, returns loop, inventory, sourcing. Unique here: COD/RTO/NDR mechanics, pincode routing, raw-material pricing bands, ops-leanness app audit, per-role workflows, Visibility/Lever stack rank, flat test backlog.
- Twins: `tmp\pdfs\Ecommerce idea maps.txt` and `.compact.txt`; `eos_inv\text\Ecommerce idea maps.txt`.
- Catalogue value: the opportunity tree and prioritisation layer (which parts to build first, with test ideas and metrics).

#### G4. DECKv2 - Ecommerce-OS-Deck-v2.pdf
- Purpose: pitch/feedback deck for "Ecommerce OS - a 24/7 AI workforce that runs, tests and improves every step of your ecommerce business"; positions the GP-lift business model and the ten-pillar agent team.
- Audience: brand owners and performance-marketing agencies (India first); prospective clients/partners.
- Date: 3 Sep 2026 (PDF mtime). 34 slides. "Working name. Everything in this deck is a proposal."
- Structure: s1-s2 cover and problem -> Part One s3-s10 (AI economics, cost curve, model routing, humans+AI, sub-agent pattern, ten-pillar map, how it works) -> Part Two s11-s24 (pillars 01-10 with agent personas + Analyst foundation) -> Part Three s25-s34 (team, rhythm, agencies, incentives, offer, rollout, India first, why us, next step).
- Quality: medium. Persuasive, clear, consistent with IDEAMAPS; light on evidence and guardrails; contains specific cost claims (rupee costs per task, ~1,500 images per Rs8,000 credits, "~3s -> <1s") and self-reported credentials that are not verified here. Inconsistency: ten pillars/eleven agents in Part Two but the s26 team slide lists eight agents (Visibility and Inventory agents missing; Checkout merged into Ops). Text extract is a PDF layout dump (columns interleaved), Windows-1252.
- Overlaps: condensed, client-facing version of IDEAMAPS (same switch-on order and tests). Predates LIFECYCLE and DELIGHT. A different later strategy deck exists at `Ecommerce OS\tmp\ecommerce_deck\` (candidate-v2.pptx, 8 Sep, "One platform carries the work forward") - related, not a duplicate.
- Twins: `tmp\pdfs\Ecommerce-OS-Deck-v2.txt` and `.compact.txt`; `eos_inv\text\Ecommerce-OS-Deck-v2.txt`.
- Catalogue value: naming of agent personas, pillar taxonomy, the sub-agent-per-test pattern, model-routing cost logic, and the commercial offer (GP-lift pricing).

#### G5. Cross-doc observations for the catalogue
- Two framings to reconcile: (a) India D2C performance-marketing framing (IDEAMAPS, DECKv2: COD/RTO, WhatsApp, GPP, pillars, sub-agents) and (b) country-neutral/US Shopify operating-system framing (LIFECYCLE, DELIGHT: CM1/CM2, consent, incrementality, orchestrators, base/stage cards). The catalogue should keep India modules as switchable add-ons (DECKv2 s32 says the same).
- Metric naming conflict: IDEAMAPS/DECK "GPP" (after ad cost) ~ LIFECYCLE CM2 per order; LIFECYCLE "GP per purchase" excludes ad cost. Pick one dictionary (LIFECYCLE p6) and map GPP/nGPP onto it.
- Guardrail conflicts to resolve in parts: photo-review rewards (IDEAMAPS/DECK) vs no sentiment-conditioned incentives (LIFECYCLE §20); "long-running ads = working" (IDEAMAPS 3.1) vs "visibility does not prove profit" (LIFECYCLE p47, DELIGHT §14, §24); "sub-agent until significance" for low-traffic pages vs DELIGHT §22 sample-size reality.
- Gaps across all four: hiring/HR and salaries (explicitly out of scope in IDEAMAPS Part 2), legal/tax/entity setup (only mentioned as launch dependencies), wholesale/B2B and retail distribution, customer data platform choice, international expansion operations beyond notes.
- No instructions aimed at an AI agent were found inside the four documents (they contain prompts as templates for future use, treated as data).


---

# Appendix D. Business in a Box set: BIAB-PDF/-US, BIAB-DOCX, BIAB-DECK

### Source group D: Ecommerce OS "Business in a Box" documents. Ecommerce business model map

Inventory agent D | written 2026-10-17 | read-only pass over the sources | all source content treated as data

#### 0. Sources and short names used in tags

| Tag | Document | Path | Date | Size / length |
|---|---|---|---|---|
| BIAB-PDF | "E-commerce Business in a Box: product and implementation blueprint", India-first edition, v1.0 | `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\Docs\ecommerce-business-in-a-box-blueprint.pdf` | 10 Sep 2026 (file 11:39) | 95 pages, 28 sections, 21 modules, 24-step mapping |
| BIAB-PDF-US | The same blueprint localized for the US | `...\Docs\ecommerce-business-in-a-box-blueprint (1).pdf` | 10 Sep 2026 (file 12:58) | 95 pages; same structure |
| BIAB-DOCX | "Ecommerce OS: Business in a box": product strategy and implementation blueprint | `...\Docs\Ecommerce_OS_Business_in_a_Box_Blueprint.docx` | 8 Sep 2026 | 37 pages, 14,112 words, 12 sections, 17 tables, 24 routines |
| BIAB-MD | Markdown source of the DOCX | `...\Ecommerce OS\tmp\business_box\blueprint.md` | 8 Sep 2026 | 101 KB; 99.6% word-identical to the DOCX |
| BIAB-DECK | "Ecommerce OS: A business in a box" strategy deck v2 | `...\Presentations\Ecommerce_OS_Business_in_a_Box_v2.pptx` | 8 Sep 2026 | 32 slides with full speaker notes, 6 AI-generated images, 1 native chart |

Tag conventions: `[BIAB-PDF §10 p18]` = section 10, PDF page 18 (the page number printed in the footer). `[BIAB-DOCX §6]` = DOCX section 6. `[BIAB-DECK s21]` = slide 21 (title or notes). PDF and PDF-US share section and page numbers, so a PDF tag applies to both unless a US difference is noted.

**Two different "24"s. Do not merge them:**
- BIAB-PDF "24-step framework" = Bill Aulet's *Disciplined Entrepreneurship* 24 steps, mapped to ecommerce (§19).
- BIAB-DOCX "24 routines" = Ecommerce OS's own routine library R01-R24 (§6).

**Two different module systems:**
- BIAB-PDF uses **M01-M21 modules**. Their numbering comes from Kevin's original "master prompt" (R0, "Pasted markdown.md", which is not in these folders).
- BIAB-DOCX uses **17 capability areas** (§4) plus **R01-R24 routines** (§6).

The crosswalk is in Part 1.5.

---

### PART 1: The ecommerce business model these documents describe

#### 1.0 Framing concepts (they shape every later part)

- **Two businesses to validate** [BIAB-PDF §1 p4; §16 p53; §19 p60]:
  - (a) the merchant's ecommerce business;
  - (b) Kevin's platform or service business.
  - Each is measured separately. A good store launch does not prove product-market fit for the platform.
- **Product promise**:
  - PDF: "A clear plan for your store, grounded in your numbers, with the work and guidance to act on it" [BIAB-PDF §4 p8].
  - DOCX: "turn an established brand's data into a small number of executed, measurable improvements every week" [BIAB-DOCX §1; BIAB-DECK s12].
- **Core asset / moat hypothesis**: a trustworthy linked record of the business. It runs from problem to evidence, intervention, approval, execution and result. Prompts, models and agents can be swapped out; this record cannot [BIAB-PDF §4 p8; BIAB-DOCX §2; BIAB-DECK s30].
- **Delivery model**:
  - The platform starts as a guided service provider. The merchant owns the store, inventory, customers, vendor accounts and commitments.
  - The platform is not a marketplace, importer of record, escrow or merchant of record [BIAB-PDF §2 p5].
  - Three ownership levels unfold over time: unified control (connected accounts), then native operating modules, then managed partner infrastructure (supplier network, procurement, embedded payments, fulfilment, native storefront) [BIAB-DOCX §2; BIAB-DECK s31].
- **Execution vocabulary** [BIAB-PDF §2 p5]:
  - *automatic*: deterministic, within granted access;
  - *assisted*: AI prepares an artifact;
  - *approved execution*: permitted action after a recorded decision;
  - *expert execution*: a person inspects, negotiates or judges;
  - *manual*: no verified integration.
- **Capability hierarchy**. This maps directly onto the catalogue levels [BIAB-DOCX §6; BIAB-DECK s20]:

  | DOCX layer | Meaning | Example | Catalogue level |
  |---|---|---|---|
  | Tool | permitted action or calculation against a system | fetch orders, resize asset, calc landed cost | (below prompt; connector/tool) |
  | Skill | instructions and methods for a bounded task | audit a product page; compare supplier quotes | skill (prompt = its single instruction) |
  | Routine | repeatable sequence with trigger and completion test | each morning validate fresh data, prepare exceptions | routine |
  | Workflow | connected routines with branches, persistent state, waits | research, then source, sample, qualify, purchase, launch | workflow |
  | Agent | bounded decision-maker choosing the next action | investigate why a product's contribution deteriorated | agent |
  | Platform | shared interface, records, permissions, integrations, ops | one workspace coordinating the business | system |

  Deck s20 example chain: Skill "review the clarity of a product page", then Routine "review priority pages every week and draft fixes", then Workflow "approve, publish, verify and measure the change"; the agent picks the next permitted step.
- **Standard routine contract** [BIAB-DOCX §6]. Each routine declares: business outcome, audience, trigger, required inputs, data freshness, procedure, output schema, authorized tools, spending boundary, external-communication policy, approval needs, success test, failure handling, recovery method, owner, version. Each run stores input versions, tool results, exact action, evidence, cost, elapsed time, outcome. **This is a ready-made catalogue item schema.**
- **AI-role contract** [BIAB-PDF §12 p31]. Every AI role inherits:
  - data access (tenant-scoped, allowlisted);
  - versioned prompt/skill with JSON output schema;
  - workflow: validate input, retrieve, draft, schema-check, at most 2 revisions, then operator;
  - confidence = evidence-completeness 0-1, not a probability;
  - audit fields;
  - feedback (accept/edit/reject plus reason; prompt changes evaluated on held-out examples).
- **Graduated autonomy ladder** [BIAB-DOCX §9; BIAB-DECK s27]:

  | Level | Platform authority | Early examples | Promotion requirement |
  |---|---|---|---|
  | Observe | read and report | connection health, profit calc, opportunity audit | reliable access, accepted definitions |
  | Prepare | draft concrete work | creative batch, quote comparison, store preview | output review, factual accuracy |
  | Execute with approval | apply a specific reviewed action | publish a page, activate a flow, launch a capped test | exact action authority and verification |
  | Execute within policy | repeat approved classes of action within limits | known catalogue corrections, routine exceptions | measured reliability, aggregate limits, recovery |
  | Coordinate a bounded objective | replan across approved capabilities | weekly contribution improvement within constraints | mature evaluations, outcome evidence |

  Promotion is per action class. People keep: business direction, physical quality judgement, material commitments, unusual exceptions [BIAB-DECK s27].

#### 1.1 The four entry paths

Source: BIAB-PDF cover p1, §2 p5. The DOCX and deck collapse these into 2 journeys plus 3 supply routes.

| # | PDF name (cover / §2) | Customer-facing explanation | What makes it different | DOCX / Deck equivalent |
|---|---|---|---|---|
| 01 | **Sell without storing** (dropship): "Supplier ships each order" | Promote and sell; supplier packs and ships direct to the customer | Supplier stock, delivery promise, packaging control and returns need verification before launch | DOCX §4 route "Dropshipping"; Deck s7 "Dropshipping: lower initial stock commitment / partner delivery dependence" |
| 02 | **Buy and hold inventory**: "Own stock and manage fulfilment" | Buy from local or international suppliers, hold stock yourself or at a 3PL, fulfil orders | Cash committed before sales; purchasing, stock and replenishment become critical | DOCX "Existing product with inventory"; Deck s7 "Stock an existing product: control of inventory / cash tied up in stock" |
| 03 | **Create your own product**: "Design, validate and manufacture" | Design or customize, work with manufacturers, build a brand | Specs, samples, tooling, ownership and production quality need additional gates | DOCX "Custom or manufactured product" (also distinguishes ODM, supplier customization, private label, full custom); Deck s7 "Manufacture: differentiation / development and quality work" |
| 04 | **Connect an existing store**: "Diagnose, improve and learn" | Connect store and tools, see the biggest obstacles, decide what to improve first | Starts with data quality, current economics and operating constraints | DOCX "existing owner routine" [§3]; Deck s4 "I want to improve", s12-s15 |

- Paths 1-3 converge once product, offer, supply plan, store and measurement baseline are approved. Path 4 enters at that operating baseline. A mature business adds a new product by opening a launch workflow inside its existing workspace, without re-onboarding [BIAB-PDF §2 p5; Fig. 2 p15; BIAB-DOCX §2; BIAB-DECK s4].
- **Agencies** are a third audience. They are a second commercial route once multi-brand isolation works: shared audit, routine library, review queue, client result history [BIAB-DOCX §11; BIAB-DECK s4, s18].

##### 1.1.1 How the three supply paths differ [BIAB-PDF §8 p14]

| Topic | Without storing | Buy and hold stock | Create own product |
|---|---|---|---|
| Early evidence | Supplier reliably delivers the actual product to the target country | Saleable stock can be bought and replenished with acceptable cash exposure | Prototype solves the need and can be manufactured consistently |
| Additional inputs | Supplier stock feed, packing, customer data handling, return address | Storage location, batch size, inbound freight, inventory financing | Specification, tolerances, materials, ownership, tooling, approval samples |
| Required physical test | Sample ordered through the actual fulfilment route | Receive and inspect a sample or pilot batch | Prototype tests, then a production-equivalent sample |
| Cash planning | Payment capture, supplier payment, disputes, refund buffer | Deposit and balance, freight, import costs, stockholding, reorder overlap | Development and tooling, failed iterations, minimum runs, longer lead times |
| Launch limiter | Truthful delivery promise and confirmed availability | Saleable units after defects and safety stock | Quality acceptance and production readiness |
| Failure response | Pause affected offers; explain delays; use approved backup | Quarantine defects, revise demand plan, avoid panic reordering | Stop tooling or scale-up; correct spec and retest |

DOCX supply-route table [BIAB-DOCX §4 "Supply route and product design"]:

| Route | What the platform prepares | Required proof before scaling |
|---|---|---|
| Dropshipping | supplier SKU mapping, stock and price checks, order routing, tracking, returns process | real sample and test shipment, stable order handling, service and contribution viability |
| Existing product with inventory | supplier comparison, PO, inventory plan, receiving checklist, warehouse setup | approved sample, landed cost, reorder assumptions, storage and delivery readiness |
| Custom or manufactured | technical brief, validated BOM, prototype plan, tooling and production milestones | feasibility review, tested prototype, approved spec, pilot production and inspection |

##### 1.1.2 New-business situations and the first valuable output [BIAB-PDF §5 p9]

| Founder situation | First valuable output | Validation evidence | Next commitment |
|---|---|---|---|
| No product idea | 3 feasible customer/problem/category combinations | interviews, accessible demand signals | research time plus a small test budget |
| Has a product idea | demand and unit-economics risk report | willingness to pay, alternatives, sample or quote | samples or prototype |
| Has a supplier | supplier comparison plus landed-cost scenarios | identity, references, inspected samples, written terms | limited first order after review |
| Has a custom design | spec plus production-validation plan | prototype usability, material checks, production quote | pilot production run |
| Ready to launch | approved store, fulfilment plan, measurement checklist | test order, delivery/return process, purchase-event reconciliation | capped acquisition test |

- Success measures: time to a pursue/change/stop decision; share of critical assumptions tested; cash required through first replenishment; delivered orders with acceptable contribution. "Stopping an unsuitable product is a valid outcome."
- Scope boundary: incorporation, certification, quality acceptance, tax registration, physical inspection and import decisions need named humans. The platform never says "legally cleared".

##### 1.1.3 Existing-business diagnostic signals [BIAB-PDF §6 p10]

| Initial signal | Plausible explanations | Required next evidence |
|---|---|---|
| ROAS rises but gross profit falls | lower-margin mix, refunds, attribution changes, discounting | SKU contribution, refund cohort, acquisition mix |
| Clicks grow but landing visits don't | tracking differences, slow pages, accidental clicks, redirects | matched definitions, browser traces, landing-speed evidence |
| Checkout conversion falls | payment failures, shipping surprise, delivery availability, traffic change | payment logs, checkout segments, test order |
| Repeat purchases weaken | young cohorts, durable product, fulfilment problems, weak fit | cohort maturity, purchase cycle, support and usage interviews |
| Revenue grows but cash tightens | inventory purchases, receivables, COD remittance delay (US: processor payout delay), tax/payment timing | cash forecast, POs, settlements, stock ageing |

Output: a **bottleneck report**. It covers current state, evidence quality, 3 ranked opportunities, impact range, dependencies, effort and next decision, and explains why other attractive actions rank lower.

#### 1.2 Lifecycle stages: Launch, then Grow, then Scale (synthesized)

The documents never use the literal words "launch / grow / scale". The stages below are synthesized from the PDF new-business journey (9 stages), the PDF existing-business journey (8 steps), the DOCX new-entrepreneur steps (9) and existing-owner stages (6), the DOCX expansion section, and the deck's 4-stage expansion [BIAB-DECK s25].

##### 1.2.1 LAUNCH: the new-business journey, PDF version (9 stages) [BIAB-PDF §8 p13]

| Stage | Founder sees and provides | Modules and saved output | Gate / verification |
|---|---|---|---|
| L1 Set limits | budget, weekly time, country, interests, exclusions | M01: constraints and route recommendation; profile v1 | founder confirms cash at risk and model (G01) |
| L2 Choose a customer and category | 3 evidenced opportunities plus research questions; founder adds experience and interviews | M02-M04, M08: market/category cards, provisional beachhead | founder picks one segment; evidence includes real customer contact |
| L3 Test the problem and offer | interview guide, prototype or transparent test page; founder supplies responses | M04/M09: hypotheses, costs, experiment outcomes | enough willingness-to-pay evidence for the next small test (G02) |
| L4 Validate supply | comparable quotes, preferred and backup candidates, sample checklist | M05-M07: quotations, sample evidence, lead times, landed-cost ranges | founder accepts product/sample; specialist resolves category/import questions (G03) |
| L5 Commit to the first offer | price, bundle, downside scenario, cash calendar | M09: offer v1, unit economics, purchase cap | founder approves offer, supplier and any purchase separately (G04) |
| L6 Prepare brand and store | brand directions, page previews, setup tasks | M10-M14: brand pack, infrastructure checklist, staged pages | brand owner approves; test purchase and mobile QA pass (G05, G06) |
| L7 Establish measurement | event checks, costs, reporting definitions | M15/M16: verified baseline, metric version | orders, refunds and spend reconcile; missing data bounded |
| L8 Launch a limited test | creative, channel, duration, spend ceiling | M17-M20: approved assets, campaign and flow drafts | founder approves publication and budgets; claim/consent checks (G07, G08) |
| L9 Deliver and learn | orders, delivery issues, reviews, result readout | M07/M21: operations, cohorts, next experiment | continue / change / stop from economics plus customer evidence |

Note: research and customer interviews start together. M08 runs alongside M02 and is not left until after sourcing [BIAB-PDF §8 p13; §19 p66 "tension 1"].

##### 1.2.2 LAUNCH: the new-entrepreneur routine, DOCX version (9 steps) [BIAB-DOCX §3; BIAB-DECK s5-s11]

0. **Intake**. Free-text or voice idea, e.g. "I want to sell something that makes small apartments easier to organize". The system extracts customer, problem, product area and constraints. It asks only the questions that change a decision: country, max capital at risk, time, excluded categories.
1. **Turn the idea into opportunities**. Up to 10 distinct opportunities, with a shortlist of 3 when evidence supports it. Each has: problem, product, differentiation, evidence, capital range, route, main uncertainty, cheapest next test. Rejected options are stored with reasons. [Deck s6]
2. **Validate customer and commercial premise**. Interviews via authorized channels, concept or landing test, paid test with cap and decision rule. Purchases are kept apart from clicks and signups. A small prototype stage is allowed if needed.
3. **Select supply route**. Dropship vs inventory vs manufacture, traded off on lead time, control, capital, margin, reliability and differentiation. [Deck s7]
4. **Build specification and source the product**. Sourcing spec, or BOM plus technical brief with engineering validation; quotes compared on a common landed-cost basis.
5. **Request samples and qualify quality**. Sample requests, costs, inspection checklists; a qualified person records findings. [Deck s8]
6. **Finalize economics and commitments**. Volume bands, payment milestones, freight, downside case, exact commitment record. [Deck s9 landed-cost example]
7. **Build launch assets and account infrastructure**. Brand brief, storefront, PDPs, photography plan, creatives, catalogue, lifecycle messages, CS knowledge. Accounts: store, payments, domain, ad accounts, FB Page, IG, Google Ads, Merchant Center, analytics, email. [Deck s10]
8. **Verify launch readiness**. Test order end to end (payment, confirmation, fulfilment, shipment, notification, cancel/refund, reporting); stock, shipping promises, returns policy, claims, checkout, events, cost coverage, capped acquisition plan. [Deck s10: "customer can buy / business can deliver / owner can measure / test order completes"]
9. **Launch in a controlled scope**. Limited range, region and budget. Review early orders, support, fulfilment and contribution, then transition to daily operations and weekly improvement routines. [Deck s11: "The first purchase begins the next cycle"]

Illustrative capital envelope for an $8,000 launch [BIAB-DOCX §7 Workflow B]:

| Use | Amount |
|---|---|
| Research and validation | $800 |
| Samples and testing | $1,200 |
| Initial goods and inbound | $3,000 |
| Store and creative | $1,000 |
| Launch ads | $800 |
| Contingency | $1,200 |

##### 1.2.3 LAUNCH readiness record (8 items) [BIAB-DOCX §12]

1. Customer problem and product hypothesis have adequate evidence for the planned capital commitment.
2. Spec, samples, tests, claims and supplier terms have accountable acceptance.
3. Cost model, available capital, open commitments and downside plan are current.
4. Inventory or supplier availability, outbound delivery, returns and service responsibility are operational.
5. Store, catalogue, assets, prices, account connections, domain and payments are ready.
6. Regional business, product, privacy and customer-contact tasks are addressed by their owners.
7. Test order, event checks, essential messages, fulfilment, cancel/refund and reporting are verified.
8. Initial campaign scope, budget, stop rules, owner decisions and incident responsibility are recorded.

##### 1.2.4 GROW: the existing-business / operate journey, PDF version (8 steps) [BIAB-PDF §9 p16]

- Pre-step, **fit and access check**: platform, category, regions, order volume, channels, reason for help, ability to change the store, who signs off spend and publication. Data asked for: 90 days of orders, refunds and spend, or 6-12 months for seasonality and retention. Shopify defaults to 60 days of order history.

| Step | User experience | System / saved record | Exit condition |
|---|---|---|---|
| G-1 Connect | read access or upload; see purpose and scope | store, catalogue, orders, costs, inventory, ads and analytics mapped into source records | store identity, timezone and currency confirmed |
| G-2 Extend context | add email/SMS, support, accounting, reviews, assets, CRM, fulfilment | connection coverage matrix plus manual gaps | evidence for the current decision available |
| G-3 Reconcile | review conflicts: refunds, missing costs, duplicate events, unknown SKUs | data-quality report; source-of-truth decisions; immutable baseline snapshot | blockers resolved or output explicitly limited |
| G-4 Diagnose | plain-language explanation of the largest constraints | funnel, product-mix, cohort, traffic, creative, speed and operations analysis | evidence supports a ranked shortlist |
| G-5 Decide | compare impact range, confidence, effort, cost, time to learn | approved experiment or ops task with owner | founder picks one priority and its limits |
| G-6 Implement | preview; instructions or approved supported execution | asset diff, execution receipt, rollback pointer | QA passes; action verified in source platform |
| G-7 Evaluate | outcome, uncertainty, guardrail effects | result with causal classification, costs, caveats | adopt / revert / extend once / close inconclusive |
| G-8 Recalculate | "What matters next?" | updated economics, constraints, ranked backlog | next action reflects new state |

**Ranking method** [BIAB-PDF §9 p17]:
1. Remove blocked or unsafe items.
2. Estimate a 30-day gross-profit impact range.
3. Subtract incremental ad, fulfilment, discount and support costs to get the contribution impact.
4. Score = (expected contribution impact x evidence confidence) / (effort units + cash cost / agreed cost unit).
5. Break near ties on time to learn, reversibility and dependencies.
6. A critical payment failure can outrank a larger speculative marketing opportunity.

##### 1.2.5 GROW: the existing-owner routine, DOCX version (6 stages) [BIAB-DOCX §3; BIAB-DECK s12-s15]

| Stage | Platform work | Output | Completion |
|---|---|---|---|
| Connect | inventory accounts, permissions, currencies, teams, tools | connection map plus missing-input list | data accessible or assigned for import |
| Reconcile | match orders, refunds, costs, spend, fulfilment, settlements | baseline with coverage and discrepancies | finance/owner accepts definitions and gaps |
| Diagnose | trace product, acquisition, funnel, retention, service and cash bottlenecks | ranked opportunities with evidence | owner can choose an action and understand its cost |
| Repair | fix critical measurement/ops defects first | verified repair record | independent checks show it is resolved |
| Improve | small set of compatible experiments or ops changes | published change plus experiment record | live, tracked, outcome date assigned |
| Review | compare results, reconcile later refunds, update plan | weekly owner brief plus next priorities | every open action has status and owner |

- Onboarding target: first meaningful finding within 2 working days of usable data.
- Deck s13 baseline = 4 data pillars: Orders, Product costs, Acquisition, Delivery costs.
- Deck s14 worked case: the return reason "smaller than I expected" improves PDP plus ad creative, or goes back to supplier/spec if it is a physical defect.

##### 1.2.6 GROW: growth as a continuous operating programme [BIAB-DECK s16-s17]

1. **Attract the right people**: research, creative, paid media, search and content.
2. **Help them decide**: product pages, speed, catalogues, conversion tests.
3. **Earn the next purchase**: useful service, lifecycle email, replenishment.

Stock and delivery shape the growth plan. Inventory availability and delivery reliability gate acquisition [s17; BIAB-DOCX §4 "Creative research and paid acquisition" gate].

##### 1.2.7 SCALE: expansion and channels

- **Scaling rules for paid media** [BIAB-PDF M18 p26]:
  - Scaling needs stable economics, data freshness, stock cover, and a new approval or a bounded standing policy.
  - Stop rules: hard cumulative spend, tracking failure, unavailable stock, disapproved claims, mature-cohort contribution loss.
- **Expansion and additional channels** [BIAB-DOCX §4]:
  - New marketplace, social commerce, geography, wholesale, subscription or category, opened only after modelling economics, operations and capital.
  - Live shopping, creator collaborations, events, offline and print ads share one experiment record.
  - Output: a channel launch brief (rationale, integrations, service model, budget, compliance, ownership, stop conditions). Routine R24.
- **Disciplined Entrepreneurship steps 14 (follow-on TAM) and 18 (scalable revenue engine)**: expand only after beachhead gates pass, and grow demand and fulfilment together "without founder heroics" [BIAB-PDF §19 p63-64].
- **Deck 4-stage expansion** [BIAB-DECK s25]:
  1. Prove the loop (paid pilots, repeat weekly work);
  2. Connect the work (growth and retention, service and operations);
  3. New products (sourcing and samples, existing brands first);
  4. New businesses (guided creation for new entrepreneurs).
- **Platform-level scale**: other verticals come only after sustained paid retention, positive delivery contribution and declining operator effort. The reusable core is goals, connections, evidence, workflow state, artifacts, permissions, budgets, verification and outcome measurement [BIAB-DOCX §11].

##### 1.2.8 Synthesized master stage map (for the catalogue)

| Stage | Sub-stages | Key modules (PDF) | Key routines (DOCX) | Gates |
|---|---|---|---|---|
| **0 Intake and direction** | founder constraints, route choice | M01 | (intake) | G01 |
| **1 Discover** | market, category, product, customer research and validation | M02, M03, M04, M08 | R09, R10 | G02 |
| **2 Source and make** | supply route, spec/BOM, supplier discovery, RFQ/negotiation, samples/QC, purchasing | M05, M06, M07 | R11-R15 | G03, G04 |
| **3 Offer and economics** | offer design, unit economics, cash plan | M09 | R02, R23 | G04 |
| **4 Brand and build** | brand, infrastructure, website/funnel, references, speed | M10-M14 | R05, R17 | G05, G06, G11 |
| **5 Measure** | analytics foundation, dashboard | M15, M16 | R01, R02, R03 | (reconciliation gate) |
| **6 Launch and acquire** | creative, paid ads, lifecycle, SEO/content, catalogue/feeds | M17-M20 | R06, R07, R17, R18 | G07, G08 |
| **7 Operate and fulfil** | inventory, inbound/outbound logistics, warehouse, fulfilment exceptions, CX, returns | M07 (+A10) | R16, R19, R20, R21, R22 | G04, G10 |
| **8 Improve (grow)** | journey diagnosis, experiments, weekly review | M21 (+M15/M16) | R04, R05, R06, R07, R08 | G09 |
| **9 Finance and admin** | contribution, 13-week cash, commitments, admin and compliance | M09, M16 | R02, R23 | G04 |
| **10 Scale and expand** | new channels, geographies, products; agencies | (M02 re-run, M18 scaling) | R24 | G07 plus a business case |

#### 1.3 The 21 modules M01-M21 [BIAB-PDF §10 pp18-27]

Contract shared by every module: "User sees and provides / Platform and AI / Save and connect (entities) / Verify and decide / Artifact and acceptance". Every artifact inherits business ID, owner, source links, dates, assumptions, version, verification state, confidence and approval history.

##### M01. Founder constraints and business goals [p18]
- **Does**: guided written or voice intake capturing home and selling countries, cash, max acceptable loss, hours/week, skills, industries in or out, risk tolerance, revenue goal, launch date, storage capacity, fulfilment willingness, brand intent, legal/ethical exclusions.
- **AI / rules**: deterministic rules reject incompatible combinations; AI explains trade-offs and proposes a path plus one alternative.
- **Entities**: business_profile, constraint, goal, route_decision. Voice-derived fields stay provisional.
- **Gate**: founder approves route and research allowance (G01); unlocks M02/M08.
- **Artifact**: **Founder Brief** (1 page).
- **Area**: ST.

##### M02. Market research and market selection [p18-19]
- **Does**: builds a market evidence matrix across size, growth, demand, frequency, competition, price, margin, returns, fragility, shipping, seasonality, regulation, marketplace dependence, ad competition, repeat, differentiation. Weights total 100, with alternative weightings for capital preservation vs brand-building.
- **Entities**: market, market_segment, evidence, research_assumption.
- **Gate**: founder picks a provisional beachhead.
- **Artifact**: **shortlist of 3 markets** (pursue/reject, gaps, cheapest next test).
- **Area**: RS.

##### M03. Product-category research [p19]
- **Does**: category cards comparing problems, demand, competition, price ranges, gross margin, repeat, shipping, fulfilment, returns, regulatory issues, supplier availability, differentiation, and fit for each of the 3 supply paths. Separates observed retail from net price, and catalogue price from landed cost.
- **Entities**: category, category_score, route_fit.
- **Artifact**: **Category Decision Sheet** (plus a reserve category).
- **Area**: RS (OF overlap).

##### M04. Product research and validation [p19]
- **Does**: ranked product hypotheses from demand indicators, complaints, unmet needs, alternatives, positioning, target price, landed-cost and margin ranges, return/defect risk, bundles and upsells. Sources: marketplaces, reviews, search exports, social, Reddit (with rights), ad libraries, supplier catalogues.
- **Validation tests**: interviews, sample, prototype usability, waitlist, transparent landing page, capped ad test, limited-stock sale, pre-orders with truthful terms.
- **Entities**: product_candidate, claim, evidence, validation_experiment.
- **Artifact**: **Product Validation Memo** (pursue/change/stop, next max commitment). Never "winning product".
- **Area**: RS / OF.

##### M05. Supplier discovery and comparison [p20]
- **Does**: researches local and international suppliers, directories, manufacturers, sourcing agents and logistics partners. Normalizes identity, location, verification, spec, unit cost, MOQ, sample and tooling fees, lead times, shipping, payment terms, certifications, private label, defect policy, communication quality, total landed cost.
- **Checks**: counterparty, quote validity, bank beneficiary, certificate scope, references, Incoterm (EXW/FOB/delivered).
- **Entities**: supplier, supplier_product, quotation, due_diligence, source_rights.
- **Artifact**: **Supplier Comparison and Due-Diligence Pack** (preferred plus backup). Gate G03.
- **Area**: OP.

##### M06. Supplier communication and negotiation [p20]
- **Does**: drafts enquiries, sample requests, quality/packaging requirements, MOQ and price-break negotiation, lead-time options, defects and replacements, exclusivity, payment schedules, scaling and backup onboarding. Bilingual, with an English verification copy beside each translation. Builds a **should-cost sheet**: materials, components, labour, packaging, QC, freight, duties, taxes, storage, fulfilment, fees, returns.
- **Entities**: communication_draft, negotiation_version, BOM, cost_assumption.
- Sending is manual in the MVP.
- **Artifact**: **bilingual RFQ/negotiation pack plus term comparison** (template in Appendix C).
- **Area**: OP.

##### M07. Supply chain, inventory and fulfilment [p20-21]
- **Does**: supply plan for supplier-direct, import, local stock, manufacturing, self-fulfilment or 3PL. Covers sample/QC checklists, PO drafts, inbound milestones, customs tasks, demand scenarios, reorder and safety stock, warehouse costs, delivery tracking, return disposition, supplier scorecards.
- **Formulas**:
  - inventory position = saleable on-hand + confirmed inbound - reserved/backordered;
  - reorder point = demand during lead time + safety stock.
- **Entities**: inventory_snapshot, purchase_order, shipment, inspection, return, supplier_performance.
- **Artifact**: **Supply Readiness Pack plus rolling cash and reorder plan**.
- India: record COD remittance and RTO separately from returns. US: record processor payouts and carrier return-to-sender.
- **Area**: OP.

##### M08. Customer and avatar research [p21]
- **Does**: synthesizes context, JTBD, problems, fears, desired outcomes, alternatives, triggers, objections, urgent moments, willingness to pay, channels, before/after. Verbatim quotes stay separate from AI interpretation. Avatars are ranked by urgency, accessibility, WTP, CAC hypothesis, GP potential, fit, repeat, size, evidence strength.
- **Entities**: customer_language, interview, avatar, persona_evidence.
- No fabricated quotes; a synthetic persona stays provisional.
- **Artifact**: **Customer Evidence and Beachhead Brief**. Runs alongside M02 and is revisited after sales and support data.
- **Area**: RS.

##### M09. Offer development and unit economics [p21-22]
- **Does**: alternative offers (bundles, volume discounts, accessories, gifts, downloads, consultations, onboarding, guarantees, subscriptions/replenishment, upsells, cross-sells, loyalty, surprises). Each has cost, eligibility and fulfilment owner. A deterministic calculator gives net revenue, COGS, GP, fulfilment, payment fees, returns, CM1, break-even CAC and target CAC. Base, downside and upside scenarios plus cash-through-replenishment.
- **Entities**: offer_version, offer_item, cost_version, economics_scenario.
- **Artifact**: **Offer and Economics Sheet**.
- **Area**: OF (FN overlap).

##### M10. Brand strategy [p22]
- **Does**: 2-3 brand directions covering purpose, positioning, promise, differentiation, personality, tone, key messages, claims and substantiation, naming, domain options, colours, typography, visual/photo/video direction, packaging, trust elements, do/don't examples.
- **Entities**: brand_document, claim_register, design_token, asset_license.
- **Artifact**: **Brand Guide v1, claim register, visual tokens** (G05). A changed promise makes downstream copy and creative stale.
- **Area**: BF.

##### M11. Domain and business infrastructure [p22-23]
- **Does**: plain-language checklist and provider-specific instructions covering domain, DNS, branded inbox, SPF/DKIM/DMARC, store setup, payment onboarding, tax and shipping settings, privacy/consent/cookies, terms, support.
- **Entities**: infrastructure_asset, configuration_check, policy_version, secret references.
- **Artifact**: **Infrastructure Readiness Sheet**. Launch is blocked if payment, policies or support aren't ready.
- **Area**: SY / WS.

##### M12. Website and funnel creation [p23]
- **Does**: drafts homepage, PDP, landing/sales page, listicle, labelled advertorial, comparison/bundle page, quiz, cart, checkout and post-purchase pages. Maps awareness levels to message type:

  | Awareness level | Message |
  |---|---|
  | unaware | problem education |
  | problem-aware | explanation |
  | solution-aware | comparison |
  | product-aware | proof |
  | most-aware | direct offer |

- **Entities**: page, section, copy_version, design_variant, deployment.
- **Artifact**: **approved page spec, staged assets, deployment instructions** (G06).
- **Area**: WS.

##### M13. Website inspiration and experimentation library [p23]
- **Does**: searchable reference library tagged by industry, product, avatar, funnel stage, page type, awareness, traffic source, section, offer, copy pattern, style, conversion mechanism. Patterns: hero, problem, benefit, demo, comparison, review, FAQ, guarantee, bundle, cart, checkout, post-purchase. Keeps "interesting example" separate from "tested in this store".
- **Entities**: reference, reference_section, pattern_analysis, rights_record.
- **Artifact**: **Reference Board with adaptation notes** (not cloned pages).
- **Area**: WS (CS overlap). **Asset-type item.**

##### M14. Website performance and checkout optimization [p24]
- **Does**: scheduled deterministic checks covering Core Web Vitals, load time, images, lazy-loading, script weight, third-party apps, mobile, ATC/cart latency, checkout friction, broken links, tracking failures. Lab and field data kept separate.
- **Entities**: performance_run, issue, change_proposal, test_evidence.
- **Artifact**: **Performance Fix Pack** (before/after evidence plus a separate business hypothesis).
- DOCX thresholds: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 [BIAB-DOCX §4].
- **Area**: WS.

##### M15. Analytics and data foundation [p24]
- **Does**: brings together store, GA4, GTM, pixels/server events, consent, CRM, email/SMS, orders/refunds, costs, shipping, ads, support and accounting. Normalizes SKU/order IDs, currency, timezone, refunds, taxes, first-order identity and cost validity. Verifies event accuracy, dedup, attribution assumptions and consent.
- **Entities**: raw snapshots, mapping versions, canonical facts, quality_check, metric_definition.
- **Artifact**: **Measurement Readiness Report, event dictionary, reproducible baseline**. Profit-led optimization is blocked when costs are missing.
- **Area**: AN (FN overlap).

##### M16. Business dashboard and metrics [p24-25]
- **Does**: shows tiles for "Money earned", "Money kept", "Customers", "Stock and delivery", "What changed". Computes revenue, net revenue, GP, CM1, CM2, new-customer GP, CAC, GP/CAC, ROAS, MER, AOV, CVR, refunds, repeat, cohort LTV, turnover, stockouts, fulfilment and support metrics, with a cash view beside accrual.
- **Entities**: metric_snapshot, cohort, dashboard_view, insight.
- **Artifact**: **dashboard plus weekly decision brief**. A missing denominator shows "unavailable", never zero.
- **Area**: AN / FN.

##### M17. Creative strategy and production [p25]
- **Does**: creative board by product, audience, awareness, angle, stage. Roles: research, concepts, scripts, image gen, video gen, ad copy, QC, compliance, publishing (C01-C09).
- **Formats**: review-led, demos, before/after, comparisons, founder stories, authorized UGC-style, objection handling, problem/solution, numerical hooks, educational, product-focused.
- **Entities**: creative_concept, hook, script, asset_version, rights_record, creative_performance.
- **Artifact**: **campaign creative pack** (assets, scripts, rights, test hypotheses). No fake testimonials.
- **Area**: CS (CPS/CPV/CW split by role).

##### M18. Paid advertising [p25-26]
- **Does**: separate Meta and Google workflows: structure, audiences/keywords, feeds, exclusions, retargeting, test design. Search, Shopping and PMax are separate choices. Feed QA covers titles, identifiers, price, currency, availability, images, URLs, shipping. Uses Merchant API.
- **Entities**: campaign_draft, ad_version, feed_issue, budget_envelope, ad_daily_fact.
- **Artifact**: **approved media test plan plus execution receipt** (G07). Platform ROAS = diagnostic only.
- **Area**: PA.

##### M19. Email and SMS lifecycle marketing [p26]
- **Flows**: welcome, education, browse/cart/checkout abandonment, post-purchase onboarding, usage, review request, cross-sell/upsell, replenishment, repeat, win-back, VIP, launch.
- **Suppression**: exclude purchased, refunded, complained, unsubscribed, no consent.
- **Entities**: lifecycle_flow, flow_step, message_version, consent_record, suppression, channel_performance.
- **Artifact**: **flow spec, message pack, test recipients, launch checklist** (G08). Holdout for incrementality.
- **Area**: RT.

##### M20. SEO, content and AI-search visibility [p26-27]
- **Does**: indexability, canonicals, on-page, internal links, PDP/PLP, structured data, speed, duplicate variants. Content briefs, useful content, update tasks, digital-PR drafts. Search Console plus dated manual AI-answer observations.
- **Entities**: seo_issue, query_group, content_brief, content_version, search_performance, visibility_observation.
- **Artifact**: **prioritized SEO/content backlog plus drafts**.
- **Area**: OG.

##### M21. Customer journey and revenue optimization [p27]
- **Does**: maps 15 stages (see 1.8). For each stage: intent, friction, drop-off definition, metric, experiment, economic pathway, evidence need, effort. Diagnoses across traffic quality, creative fatigue, page performance, AOV, margin, mix, refunds, retention, inventory and tracking.
- **Entities**: journey_stage, friction, bottleneck, experiment, result, constraint_change.
- **Artifact**: **journey map, ranked experiment backlog, recurring result brief** (G09). Closes the loop to product, avatar, offer and constraint.
- **Area**: WS / AN (CRO).

**Module dependency figure** [BIAB-PDF Fig. 3 p28]:
- Goals + customer evidence, plus supplier + sample evidence, feed verified costs and the approved offer.
- That feeds two branches: (a) brand, store and creative (acquisition); (b) cash, stock and fulfilment.
- Both feed measurement and learning, which revisits all upstream nodes.

**Concierge core subset** [BIAB-PDF §22 p70]: M15 + M16 + M21 are the core; M09 supplies economics; one of M12 / M14 / M19, or a simple ops fix, supplies the implementation. **Follow-on new-business service** = M01-M09.

#### 1.4 DOCX capability map: 17 areas of running an ecommerce business [BIAB-DOCX §4]

Each area follows the pattern Work / Outputs / New owners vs Existing owners / Measures / Gate / handoff.

1. **Market and customer research**. Problems, occasions, alternatives, concepts, WTP, acquisition routes; public research, interviews, reviews, tickets, searches, returns. Outputs: opportunity cards, customer problem brief, competitor/substitute map, evidence register, positioning options, validation plan. (RS)
2. **Supply route and product design**. Sellable unit, variants, packaging, dimensions, claims, target price and cost, delivery promise; ODM vs customization vs private label vs full custom. Outputs: versioned spec, SKU rules, BOM (component, revision, grade, qty, UoM, waste, supplier ref, substitutes, cost source), quality criteria, route. (OF / OP)
3. **Supplier discovery and qualification**. Marketplaces, sourcing partners, local manufacturers, incumbents. Records manufacturer vs trader vs distributor vs intermediary. Outputs: shortlist, standard RFQ, quote comparison, document register, risk notes. Existing owners: benchmark incumbents, consolidate, test alternates. (OP)
4. **Samples and product quality**. Sample plan, tracking, defect classification, approved reference sample. Prototype review vs production sample vs pilot batch vs later batch inspection. Outputs: sample scorecard, inspection evidence, change request. (OP)
5. **Negotiation and purchasing**. Normalized quotes, quantity bands, deposit/staged shipment scenarios, negotiation from a written mandate with walk-away terms. Outputs: negotiation brief, correspondence, landed-cost scenarios, PO, payment milestones, terms (tooling ownership, change control, IP). (OP / FN)
6. **Inbound logistics and inventory**. Production completion, pickup, freight, destination handling, receipt, inspection. Outputs: inbound plan, arrival range, receiving instructions, SKU/barcode mapping, landed-cost allocation, replenishment schedule; sellable vs damaged/quarantined/reserved/returned stock. (OP)
7. **Brand and storefront creation**. Positioning, tone, visuals, PDPs, collections, nav, search, FAQ, checkout, policies, photo/video briefs. Existing owners: improve high-traffic templates while keeping URLs and tracking. (BF / WS)
8. **Account infrastructure and measurement setup**. Store, domain, payments, business manager, ad account, FB Page, IG, Google Ads, Merchant Center, analytics, search tools, catalogue, tracking, email domain, lifecycle platform. Outputs: dependency map, account owner register, event dictionary, consent config, recovery instructions. (SY / AN)
9. **Site speed and conversion optimization**. Templates, images, video, scripts, app residue, fonts, mobile, trust, shipping visibility, cart, checkout. Primary KPI: contribution per eligible visitor. (WS)
10. **Creative research and paid acquisition**. Concepts, hooks, scripts, statics, video briefs, demos, landing variants, offers. Each creative tagged by customer, problem, promise, proof, format, concept; new concepts kept apart from minor variations. Outputs: research brief, creative batch, claims checklist, rights record, campaign draft, capped budget, outcome report. (CS / PA)
11. **Catalogues, feeds and marketplace retailing**. Titles, attributes, identifiers, images, availability, price, shipping. Feed rejections; marketplace listings only where the channel fits. Outputs: canonical product record, channel mappings, rejection queue, listing drafts, channel contribution view. (PA / WS)
12. **Lifecycle marketing and customer communications**. Transactional vs promotional, across email, consented SMS, WhatsApp, push and support; a shared contact policy; send-time eligibility re-check. 9 message families (see 1.8.3). (RT)
13. **SEO, content, social and discovery through AI search**. Intent-to-page mapping, crawlability, structured data, freshness; repurposing into social posts, short video, creator briefs, community responses. "AEO" defined as making content discoverable in answer engines. (OG; CR overlap for creator briefs)
14. **Outbound logistics and warehouse decisions**. Self-fulfil vs 3PL vs supplier fulfilment vs warehouse rental. Quote components: receiving, storage, picks, packaging, postage, surcharges, minimums, returns, exit costs. Outputs: fulfilment model, rate comparison, SLA, carrier routing, warehouse instructions, packaging spec, label workflow, exception queue. KPI: total cost per successfully delivered and kept order. (OP)
15. **Post-purchase service, returns and advocacy**. Delivery, use, issue resolution, returns, exchanges, warranty. Support drafts with order context; complaints grouped by product, batch, lane, expectation failure. **Delight experiments**: gifts, inserts, QR codes, loyalty invites, referrals, educational follow-ups. Never condition gifts on positive reviews. (CX / RT)
16. **Finance planning and business administration**. Management contribution, cash forecasts, inventory commitments, payables, payout receivables, settlement discrepancies, channel costs, SaaS subscriptions; company setup, registrations, insurance, contracts. Outputs: order/SKU economics, monthly financial bridge, **rolling 13-week cash forecast**, commitment register, scenarios. (FN)
17. **Expansion and additional channels**. New marketplace, social commerce, geography, wholesale, subscription, category; live shopping, creators, events, offline/print. Output: channel launch brief. (ST)

#### 1.5 Crosswalk: PDF modules, DOCX capability areas, DOCX routines, area codes

| PDF module | DOCX capability area (§4) | DOCX routine | Schema area |
|---|---|---|---|
| M01 Founder constraints | (intake, §3 step 0) | - | ST |
| M02 Market research | 1 Market and customer research | R09 | RS |
| M03 Category research | 1 / 2 | R09 | RS |
| M04 Product research and validation | 1 | R09, R10 | RS |
| M05 Supplier discovery | 3 Supplier discovery and qualification | R13 | OP |
| M06 Supplier negotiation | 5 Negotiation and purchasing | R13, R15 | OP |
| M07 Supply chain, inventory, fulfilment | 4 Samples, 6 Inbound, 14 Outbound/warehouse | R14, R16, R19, R20 | OP |
| M08 Customer/avatar research | 1 | R10 | RS |
| M09 Offer and unit economics | 2 (target price) / 16 Finance | R02, R11, R23 | OF |
| M10 Brand strategy | 7 Brand and storefront | R17 | BF |
| M11 Domain and infrastructure | 8 Account infrastructure | R17 | SY |
| M12 Website and funnel | 7 Brand and storefront | R05, R17 | WS |
| M13 Inspiration library | (none) | - | WS |
| M14 Performance and checkout | 9 Site speed and CRO | R05 | WS |
| M15 Analytics foundation | 8 (measurement setup), §5 data foundation | R01, R02, R03 | AN |
| M16 Dashboard and metrics | §5, 16 Finance | R02, R08 | AN / FN |
| M17 Creative | 10 Creative and paid acquisition | R06 | CS |
| M18 Paid advertising | 10, 11 Catalogues/feeds | R06 | PA |
| M19 Email/SMS lifecycle | 12 Lifecycle marketing | R07 | RT |
| M20 SEO/content/AI search | 13 SEO, content, social, AI search | R18 | OG |
| M21 Journey and revenue optimization | 9 / 15 | R04, R21 | WS / AN |
| (none) | 15 Post-purchase service, returns, advocacy | R20, R21, R22 | CX |
| (none) | 16 Finance planning and admin | R23 | FN |
| (none) | 17 Expansion and channels | R24 | ST |

Gaps:
- The PDF has no dedicated module for customer care/returns. It is covered by agent A10 plus M07/M21.
- The PDF has no dedicated finance/cash module; it is spread across M09/M16 and §16.
- The DOCX has no reference/inspiration library equivalent of M13.
- Neither document has a creators/influencers/affiliates module. CR appears only as "creator briefs" [DOCX §4 area 13] and "creator collaborations" [DOCX §4 area 17].

#### 1.6 The 24 routines R01-R24 [BIAB-DOCX §6; BIAB-DECK s21]

##### First eight routines (initial product library; the "first operating loop") [BIAB-DOCX §6]

| ID | Routine | Trigger | Inputs | Procedure / output | Completion / recovery / KPIs | Area |
|---|---|---|---|---|---|---|
| R01 | Connection and data health | connection added; daily | scopes, account identity, last sync, event lag, missing objects | verify access and freshness, flag redacted/missing fields; connection status plus owned exceptions | every source has status and owner; stop writes on revoked access; usable-connection rate, time to resolution, false alerts | SY |
| R02 | Order contribution and reconciliation | daily after order/cost/refund/spend/fulfilment updates | approved metric definitions, matching currency and time | match lines to effective costs; order contribution waterfall; reconcile; one accepted baseline plus discrepancy queue | finance accepts mappings; quarantine conflicts; unexplained variance, cost coverage, corrections after close | FN |
| R03 | Tracking and event verification | onboarding; after store/tracking change; event health drop | event dictionary, test purchase, consent, analytics, store | check presence, IDs, values, currency, duplicates, consent; defect record plus repair proposal | independent verification; revert faulty config; event completeness, duplicate events | AN |
| R04 | Bottleneck diagnosis and opportunity ranking | weekly or on meaningful change | trusted contribution, funnel, inventory, support, channel data | locate constrained stage, compare explanations, rank interventions with ranges, effort, time to evidence, cash, confidence; WIP cap | top 3 with next action and owner; accepted opportunities, time to action, prediction accuracy | ST |
| R05 | Product page, catalogue and speed improvement | approved opportunity | spec, traffic, theme, images, feed errors | diagnose, preview, check facts and mobile, publishable change plus verification plan; catalogue hygiene batched separately from experiments | read back live change, test purchase path; contribution/visitor, performance, rejected products | WS |
| R06 | Creative experiment | approved problem | customer evidence, creative results, product facts, inventory, test budget | few distinct concepts, assets plus rights, claims review, campaign draft, experiment design | verify publication, monitor spend, report after window; failed launch = repair task | CS / PA |
| R07 | Lifecycle gap and flow repair | onboarding plus periodic | order events, flows, templates, suppressions, deliverability | find missing journeys, broken triggers, duplicate transactional sends, timing, frequency; one highest-value repair tested with test profiles | right message to right test recipient; pause unhealthy flow; eligible reach, incremental contribution, complaints | RT |
| R08 | Owner operating review | weekly | validated measures, action records, experiments, cash, exceptions | what changed, why, what was completed, immature results, next decisions; separates cash released / recurring savings / incremental profit | every item has state, next action, owner; owner time, approval latency, workflow completion | ST |

Build sequencing:
- R01-R04 and R08 go into software first (Phase 1).
- R05-R07 run with operator review plus limited adapters [BIAB-DOCX §10; Deck s21].

##### Expansion routine library R09-R24 [BIAB-DOCX §6 table]

| ID | Routine | Trigger | Main output | Expansion dependency | Area |
|---|---|---|---|---|---|
| R09 | Opportunity discovery | new idea or category review | evidence-backed product shortlist | research source and evidence controls | RS |
| R10 | Customer validation | selected opportunity | interview or demand-test findings | authorized recruitment and test budget | RS |
| R11 | Supply route comparison | validated problem or new product | route and capital decision | product requirements and cost model | OF |
| R12 | Specification and bill of materials | selected route | versioned product and manufacturing brief | supplier or engineering verification | OF |
| R13 | Supplier quotation | approved spec | comparable quotes and shortlist | partner access and communication authority | OP |
| R14 | Samples and inspection | selected suppliers | quality evidence and acceptance record | physical recipient and qualified inspection | OP |
| R15 | Negotiation and purchase | accepted sample and economics | final terms and PO | mandate, budget, commitment approval | OP |
| R16 | Inventory and replenishment | forecast cycle or stock event | reorder proposal plus cash impact | reliable stock, lead times, open orders | OP |
| R17 | Store and channel launch | approved launch plan | store, catalogue, assets, launch checks | accounts, product facts, service readiness | WS |
| R18 | Search and content plan | customer question or content cycle | reviewed content plus publication plan | claims evidence, publishing access | OG |
| R19 | Carrier and warehouse comparison | renewal or fulfilment bottleneck | comparable total cost plus service plan | shipment profile, current quotes | OP |
| R20 | Fulfilment exception | delay, failed delivery, damage | assigned recovery action | order, tracking, contact policy | OP / CX |
| R21 | Returns and promise gap | return or complaint pattern | root cause plus corrective work | product, batch, creative and support joins | CX |
| R22 | Customer recovery and delight | eligible service or loyalty event | gift, service, referral or QR action | budget, eligibility, fulfilment | CX / RT |
| R23 | Cash and commitments | weekly forecast or proposed spend | 13-week forecast plus constraints | settlements, payables, stock, budgets | FN |
| R24 | Channel expansion | approved growth hypothesis | channel launch and test package | proven core operation and capital | ST |

Worked routine spec in the DOCX: **"Compare outbound fulfilment quotes"**, with full fields (outcome, trigger, inputs, procedure, output, authority, completion test, failure handling, owner, outcome check) [BIAB-DOCX §12]. This is the template for writing catalogue routines.

##### Operating cadence [BIAB-DOCX §6]

| Cadence | What runs |
|---|---|
| Event-driven | connection failures, order changes, delivery exceptions, urgent service |
| Daily | refresh data, verify health, flag material deviations |
| Weekly | select priorities, review experiments, reconcile provisional outcomes, update cash |
| Monthly | cohorts, catalogue and creative strategy, supplier and carrier performance, software cost |
| Quarterly | product portfolio, commercial agreements, channel expansion |

Cadence scales with volume: no hourly recommendations for low-volume brands.

#### 1.7 The 24-step framework: Disciplined Entrepreneurship mapped to ecommerce [BIAB-PDF §19 pp60-66]

- The framework is applied twice: to each merchant venture and to the platform as a venture. Steps 1-23 come from the D2 preview (pp. 36-41); step 24 from the D1 roadmap.
- Pre-steps named in the expanded edition: **step 0 Getting started**; **step 1A Primary market research**; **step 13A Windows of opportunity and triggers** [p66].
- Columns below: merchant application / platform application / responsible module / output artifact / gate or common failure.

**Steps 1-4: customer, focus, market size [p60-61]**
1. **Market segmentation**. Segment by problem, purchase trigger, access and economics. Platform: compare existing founders vs beginners vs agencies. Modules M01, M02, M08. Output: evidence-based segment matrix. Failure: broad demographics mistaken for a market.
2. **Beachhead market**. Pick one reachable customer/problem/product context. Platform: founder-led domestic Shopify home/lifestyle stores. M02, M08. Output: Beachhead Decision Memo. Failure: pursuing all four paths equally at launch.
3. **End-user profile**. Who, context, needs, buying frequency, constraints. Platform: the person making weekly store decisions. M08. Output: evidence-backed end-user profile. Failure: an invented persona treated as evidence.
4. **Beachhead TAM**. Eligible buyers x annual category purchases x net price. Platform: eligible businesses x annual platform fee, not GMV. M02, M09. Output: bottom-up TAM range plus sensitivity.

**Steps 5-8: concrete customer and value [p61-62]**

5. **Persona**. A real consenting buyer. Platform: an actual pilot founder (buyer, user and approver may differ). M08. Output: persona and priority record.
6. **Full life-cycle use case**. Discovery, purchase, delivery, use, return, repeat, disposal. Platform: discovery, payment, data access, diagnosis, approval, implementation, renewal, exit. M07, M21. Output: complete journey and responsibility map. Failure: optimizing checkout while delivery fails.
7. **High-level specification**. Sample/spec plus truthful offer/store mockup. Platform: onboarding screen, baseline report, decision card, readout. M10-M12. Output: product/service storyboard.
8. **Quantified value proposition**. A supported product outcome. Platform: time to useful decision, operator effort, economic outcome. M09, M16, M21. Output: before/after value model. Failure: "guaranteed revenue lift".

**Steps 9-12: repeatability, core, buying roles [p62-63]**

9. **Next ten customers**. Ten reachable target buyers. Platform: ten qualified prospect records. M08, M21. Output: ten-customer evidence register.
10. **Core**. Product quality/design, supply capability or expertise. Platform: reliable context-to-decision-to-outcome records plus delivery discipline. M04-M10. Output: core capability thesis. Failure: "AI agents" claimed as a moat.
11. **Competitive position**. Compare on the buyer's top criteria. Platform: compare agency, spreadsheet, analytics, AI workflow. M02, M08. Output: customer-priority comparison.
12. **Decision-making unit**. User, payer, gift buyer, household influencer, business purchaser. Platform: founder/economic buyer, marketer/operator, finance reviewer, technical gatekeeper. M08, M21. Output: buying and approval map.

**Steps 13-16: acquisition, expansion, model, price [p63-64]**

13. **Process to acquire a paying customer**. Trigger, channel, proof, purchase, delivery promise. Platform: intro, then qualification, discovery, sample report, proposal, payment, access. M12, M17-M21. Output: acquisition/revenue journey.
14. **Follow-on TAM**. Adjacent buyers and categories after validation. Platform: WooCommerce, other categories, new founders, later countries. M02. Output: sequenced expansion memo.
15. **Business model**. One-off, replenishment, bundle or subscription. Platform: fixed paid sprint, then recurring optimization, then a software tier later. M09. Output: model and incentive comparison. Failure: unlimited service hidden in cheap software.
16. **Pricing framework**. Test price vs WTP and contribution. Platform: test INR 30,000 (US: USD 3,000) pilot offers. M09. Output: price tests plus scope sheet.

**Steps 17-20: economics, repeatable sales, uncertainty [p64-65]**

17. **LTV**. Cohort contribution after fulfilment/returns, with a declared horizon. Platform: fee contribution after delivery, support and model costs. M09, M16. Output: realized/forecast contribution LTV.
18. **Scalable revenue engine**. Creative, channels, conversion, stock, repeat. Platform: founder sales, then referrals/partners, then scalable acquisition. M17-M21. Output: demand-to-delivery capacity plan.
19. **CoCA**. Media, creative, commissions, acquisition labour. Platform: founder sales time, demos, failed prospects. M16. Output: fully loaded CAC model.
20. **Key assumptions**. Demand, WTP, supplier quality, returns, lead time, contribution. Platform: data access, insight value, renewal, margin, API access. M01-M21. Output: ranked assumption register.

**Steps 21-24: tests, paid value, sequencing [p65-66]**

21. **Test key assumptions**. Interviews, samples, transparent offers, limited inventory. Platform: paid concierge sprints, import trials, decision cards. M04, M07, M21. Output: test result plus decision.
22. **Minimum viable business product**. Real product/offer with reliable fulfilment. Platform: paid baseline, bottleneck decision, bounded improvement, readout. M09, M12, M15, M21. Output: paid offer with acceptance criteria.
23. **Demonstrate adoption, value and payment**. Delivered paid orders, satisfaction, repeat. Platform: paid pilots, implemented recommendations, renewal. M16, M21. Output: cohort evidence pack.
24. **Product plan**. Expand only when demand, cash and operations support it. Platform: concierge, then internal workflows, portal, connections, controlled execution. All modules. Output: gated development roadmap. Failure: "implementing all 21 modules at once".

**Four tensions the PDF resolves** [p66]:
1. Run M08 early.
2. Four paths = the long-term market, not the beachhead.
3. A full platform is not the MVBP; concierge is.
4. AI assistance does not make entrepreneurship deterministic; keep the ability to stop.

#### 1.8 Customer lifecycle

##### 1.8.1 15-stage journey (M21 and Appendix H) [BIAB-PDF §10 p27; §28H pp89-90]

| # | Stage / intent | Friction and metric | Potential experiment | Evidence and effort |
|---|---|---|---|---|
| 1 | Impression: notice relevance | wrong promise/audience; reach, qualified exposure | clearer real-product concept | creative/audience context; medium |
| 2 | Click: explore | misleading hook, accidental click; outbound CTR | align hook with product reality | placement, traffic quality; low/medium |
| 3 | Landing view: orient | slow load, broken redirect; views/clicks with matched definitions | fix verified loading/redirect | browser traces; medium |
| 4 | Product exploration: assess fit | missing size/use/compatibility; engaged product visits | accurate demonstration | interviews, product facts; medium |
| 5 | Add to cart: choose | variant confusion, out of stock; adds/eligible visits | clarify variant selection | event QA, stock history; medium |
| 6 | Cart: understand total | shipping surprise; checkout starts/carts | show accurate totals | cost/availability checks; medium |
| 7 | Checkout: pay | payment/address failure; purchases/checkouts | correct reproduced error | payment logs, test orders; high if platform-limited |
| 8 | Purchase: confirm | ambiguous confirmation, duplicate event; paid orders | improve confirmation/measurement | store/payment reconciliation; medium |
| 9 | Post-purchase offer: add value | irrelevant upsell, delivery delay; incremental CM1 | useful accessory | inventory, handling, holdout; medium |
| 10 | Delivery: receive | late/damaged/failed (COD); delivery time, damage, RTO | packaging/courier pilot | comparable regions/batches; medium/high |
| 11 | Usage: succeed | unclear instructions, poor fit; support contacts | helpful usage guide | consented interviews; low/medium |
| 12 | Review: share | bad timing, intrusive ask; honest review participation | ask after realistic use time | consent, neutral ask; low |
| 13 | Repeat purchase: solve next need | no reason/timing; mature repeat contribution | relevant replenishment/adjacent product | cohort age, product cycle, holdout; medium |
| 14 | Referral: recommend | unclear value, incentive abuse; referred-customer contribution | transparent referral proposition | anti-abuse, reward cost; medium |
| 15 | Win-back: reconsider | unresolved bad experience, irrelevant discount; incremental returning CM1 | resolve issue, then invite | consent, service history, holdout; medium |

Rule: a test that raises conversion but lowers contribution per eligible visitor is not the winner.

##### 1.8.2 Lifecycle flows (M19) [BIAB-PDF p26]

Welcome, then education, browse abandonment, cart abandonment, checkout abandonment, post-purchase onboarding, usage, review request, cross-sell/upsell, replenishment, repeat purchase, win-back, VIP, launch.

##### 1.8.3 Message families [BIAB-DOCX §4 area 12]

| Family | Trigger / purpose | Main checks | Useful outcome |
|---|---|---|---|
| Transactional order | payment, acceptance, cancel, refund | actual order state, amount, recipient | accurate essential info |
| Transactional fulfilment | shipment, delay, attempt, pickup, delivery | current tracking, realistic promise | fewer avoidable failures and contacts |
| Product service | setup, care, safety, warranty | relevant product, timing, classification | successful use |
| Welcome and education | subscription / explicit interest | permission, segment, purchase state, frequency | qualified first purchase |
| Browse, cart and checkout | eligible abandonment after delay | identity, consent, purchase suppression | incremental recovered contribution |
| Post-purchase marketing | delivered order plus elapsed use time | complaint/return suppression, fit | incremental cross-sell / repeat |
| Replenishment and win-back | expected depletion or lapse by cohort | product cycle, repeat history, incentives | incremental retained contribution |
| VIP, loyalty and referral | verified relationship and eligibility | reward cost, abuse, fair terms | profitable retention, referrals |
| Calendar campaigns | launch, restock, seasonal, editorial | stock, consent, exclusions, frequency | incremental contribution after cost |

##### 1.8.4 Post-purchase delight and advocacy [BIAB-DOCX §4 area 15; BIAB-DECK s11]

- Gifts, packaging inserts, QR codes (setup/support, campaign IDs, no secrets), loyalty invitations, referral offers, educational follow-ups.
- Each is budgeted and measured. No rewards for positive reviews.
- Loop: quality failures go back to suppliers; misleading expectations go back to PDP, ads and policies.

##### 1.8.5 Customer value phases (deck framing) [BIAB-DECK s16]

Attract, then Decide, then Earn the next purchase.

#### 1.9 Departments, functions and roles

##### 1.9.1 Founder navigation, i.e. the departments as the merchant sees them [BIAB-PDF §7 p11]

| Nav item | Contents | Main action |
|---|---|---|
| Today | current priority, missing inputs, pending approvals, recent results | complete next useful step |
| My business | goals, countries, products, suppliers, costs, customers, offers, brand | confirm/correct facts |
| Plan and launch | market decisions, samples, store setup, launch readiness | review next launch gate |
| Store and content | pages, copy, listings, email, creative versions | compare and approve a draft |
| Improve | bottlenecks, experiment backlog, active tests, learnings | choose one improvement |
| Orders and operations | inventory risks, delivery, returns, supplier performance | resolve exception |
| Results | profit, cash, funnel, metric definitions | understand a change |
| Connections | permissions, coverage, sync, errors, imports | fix a data gap |

- Persistent controls: workspace switcher, search, notifications, Approvals, Help, export, account/billing.
- Task states: Not started, Needs input, Draft ready, Needs verification, Awaiting approval, In progress, Completed, Blocked, Stale.
- Controls: Edit, Compare, Request evidence, Approve, Decline, Defer [p12].
- DOCX states: planned, working, waiting for owner, waiting for partner, verifying, complete, needs repair [§3].

##### 1.9.2 Business functions the platform coordinates [BIAB-DOCX §1; BIAB-DECK s2]

Sourcing, marketing, inventory, fulfilment, service, finance. Deck s2 adds customer research, product quality and storefront. Deck s2's five owner questions:
- What should I sell?
- Can the supplier deliver?
- Which campaign should run?
- Will the order arrive on time?
- Did the business keep any money?

##### 1.9.3 AI business roles A01-A10 [BIAB-PDF §12 pp31-33]

| ID | Role | Trigger | Skill id | Output | Gate | Area |
|---|---|---|---|---|---|---|
| A01 | Research analyst | new market/product/customer question; stale evidence | research.v1 | market/product/avatar cards with linked claims | G01/G02 | RS |
| A02 | Sourcing assistant | approved product/spec | sourcing.v1 | normalized quotes, ranked qualified options, bilingual RFQ (no payment tools) | G03/G04 | OP |
| A03 | Offer and brand strategist | customer/product evidence or changed economics | offer_brand.v1 | offer alternatives, scenario calcs, brand artifacts | G05 | OF / BF |
| A04 | Website assistant | approved offer/design or diagnosed issue | storefront.v1 | spec, draft, preview, test report, change diff plus rollback (staging only) | G06/G11 | WS |
| A05 | Diagnosis and experiment analyst | accepted baseline, scheduled review, closed test | diagnose_test.v1 | ranked bottlenecks, preregistered test, result explanation | G09 | AN |
| A06 | Meta planner | approved channel objective/creative | meta_plan.v1 | campaign proposal, audience/creative mapping, budget envelope, paused/draft payload | G07 | PA |
| A07 | Google planner | approved Search/Shopping/PMax objective | google_plan.v1 | campaign type, feed check, keywords/assets, budget plan | G07 | PA |
| A08 | Lifecycle assistant | approved lifecycle need or cohort issue | lifecycle.v1 | eligibility/suppression rules, flow map, exact messages | G08 | RT |
| A09 | SEO/content assistant | search issue or approved brief | seo_content.v1 | prioritized issues, original brief/content, internal links | G06/G08 | OG |
| A10 | Operations and CX assistant | stock, delivery, return, support exception | operations_cx.v1 | exception explanation, options, draft response or reorder rec | G04/G08/G10 | OP / CX |

##### 1.9.4 Connected creative roles C01-C09 [BIAB-PDF §12 pp33-35]

| ID | Role | Skill id | Output | Area |
|---|---|---|---|---|
| C01 | Creative researcher | creative_research.v1 | angle/evidence board (observations vs hypotheses) | CS |
| C02 | Concept developer | creative_concept.v1 | 3 distinct concepts (message, visual mechanism, format, test question) | CS |
| C03 | Scriptwriter | creative_script.v1 | timed script: hook, scene/action, dialogue, captions, proof, CTA | CW |
| C04 | Image producer | creative_image.v1 | image variants plus provider settings/provenance | CPS |
| C05 | Video producer | creative_video.v1 | storyboard, generated/assembled video, captions, transcript | CPV |
| C06 | Ad copywriter | creative_copy.v1 | hooks, primary text, headlines, CTAs (character-count validator) | CW |
| C07 | Quality-control worker (deterministic) | creative_qa.v1 | pass/fail checklist (file, OCR, captions, dimensions) | CPS / CPV |
| C08 | Claims and compliance assistant | creative_claims.v1 | claim/likeness-to-evidence map, unresolved-risk checklist | CS |
| C09 | Publishing worker (deterministic) | creative_publish.v1 | publish approved or paused entity, read back, receipt | PA |

Evaluation corpus before release [p35]:
- Realistic store cases: missing costs, false supplier claims, weak evidence, wrong currency, prompt-injection in retrieved content.
- Metrics: reviewer correction rate, grounded-claim rate, delivery time, cost per accepted artifact.

##### 1.9.5 Human team capabilities [BIAB-PDF §25 p80; BIAB-DOCX §10]

- PDF capability list (10):
  - Founder (product and sales);
  - Ecommerce operator;
  - Data analyst / finance reviewer;
  - Full-stack engineer;
  - Integration/data engineer;
  - Designer / creative specialist;
  - QA / release and security;
  - Sourcing / quality specialist;
  - Legal / tax / claims adviser;
  - Experimentation specialist.
- Phase-0 team: founder + 1 operator + fractional data/specialist.
- DOCX team: founder + 2 engineers + 1 ecommerce operator + fractional design/finance/quality/sourcing/legal.
- Capacity gates [PDF p80]: cases per operator, hours per accepted artifact, backlog age, connectors per engineer, rework, incidents.

#### 1.10 Approval gates and governance

##### 1.10.1 Gates G01-G11 [BIAB-PDF §11 pp29-30]

| Gate | Decision owner | Required evidence | Approval permits | Invalidated by |
|---|---|---|---|---|
| G01 Business direction | founder | confirmed constraints plus path comparison | research within allowance | material budget/country/category change |
| G02 Product choice | founder | customer evidence, initial economics, risk memo | samples or a limited test | changed product, claims, test budget |
| G03 Supplier and sample | founder + quality reviewer | comparable quotes, identity checks, inspected sample | supplier qualification, accepted sample/spec | different manufacturer/materials/spec |
| G04 Commercial commitment | authorized signatory | exact PO/contract, qty, terms, beneficiary, cash plan | only that purchase/payment/contract | price, qty, bank, terms, recipient change |
| G05 Brand and claims | brand owner; specialist for regulated claims | rights, naming review, substantiation | use of approved brand/claim version | new unsupported claim, expired proof |
| G06 Store publication | store owner / delegated publisher | preview, test order, QA, rollback | publish exact page/config | changed code, destination, offer |
| G07 Advertising | budget owner | creative, audience, countries, duration, limits, economics | approved campaign plus bounded budget | scope change, stale data, stock/claim failure |
| G08 Customer communications | marketing/support owner | exact content, recipient rules, consent, suppressions | a message or lifecycle policy | changed content/segment, withdrawn consent |
| G09 Experiment | experiment owner + business approver | hypothesis, metric, sample/duration, exposure, stop rules | implementation plus measurement | variant/population/metric/spend change |
| G10 Refund or operations | authorized ops owner | order facts, policy, amount, impact | specific refund/routing/stock action | different order/amount/supplier/policy |
| G11 Production deployment | technical release owner | review, tests, backup, recovery | versioned release to a named environment | artifact/config change, failed gate |

##### 1.10.2 Approval mechanics

- **Approval payload** [p30]: action ID, business ID, artifact hash/version, source account, destination, parameters, amount/currency, hard limits, assumptions, approver identity/role, timestamp, expiry, preconditions, rollback.
- **Execution protocol** [p30]: validate approval and role, then recheck stock/data/consent, take a lock, set an idempotency key, act, read back, save provider ID and receipt, notify. On an uncertain timeout, reconcile before retrying.
- **Approval loop figure** [Fig. 4 p30]: concrete proposal, then evidence/policy checks, human approval, recheck and execute, verify external outcome, receipt/audit feeding the next decision. A revision needs a new approval.
- **DOCX action contract** [§8]: business ID, actor, workflow/step IDs, action type, target provider/object, expected version, input/evidence versions, requested changes, budget exposure, authority, approval ID or standing policy, expiry, duplicate-prevention key, verification method.
- **Standing policies**: reusable, with explicit limits, expiry and revocation; aggregate period caps [PDF p29; DOCX §8].
- **Decision interface** [BIAB-DOCX §3; Deck s19]:
  - Content: proposed action, reason, evidence, expected range, budget exposure, affected products/channels, reversibility, success criteria.
  - Buttons: approve / edit / defer / reject.
  - Voice can create the intent, but commitments need an action record.
- **Workflow lifecycle** [BIAB-DOCX §7; Deck s22]: intent received, then inputs checked, evidence gathered, proposal created, authorization checked, execution requested, external state verified, outcome observed, learning recorded. Deck short form: Prepare, then Authorize, Execute, Verify.

##### 1.10.3 Reliability scenarios [BIAB-DOCX §8]

Duplicate event; timeout after write; account disconnected; stale approval; competing price/budget edits; partial launch; missing costs/refunds; failed model/provider. Each comes with a required behaviour and a verification.

##### 1.10.4 Production gates [BIAB-DOCX §9]

| Area | Gate |
|---|---|
| Financial data | 7 daily reconciliations, <1% unexplained variance, ≥95% cost coverage |
| Authority | zero unauthorized actions |
| External changes | every write verified-success / verified-failure / explicit-uncertain |
| Recovery | duplicate, timeout, revoke, partial, restart scenarios demonstrated |
| Routine completion | ≥95% within window over 2 weeks |
| Output review | ≥80% of sampled outputs need only minor edits |
| Customer impact | accepted baseline + ≥1 executed measurable intervention + willingness to continue |

#### 1.11 Experimentation and learning system [BIAB-PDF §17 pp54-57; BIAB-DOCX §5]

##### 1.11.1 Twelve-step operating loop [p54]

1. Establish baseline;
2. Identify constraint;
3. Form hypothesis;
4. Recommend experiment;
5. Size and schedule;
6. Check guardrails;
7. Obtain approval (G09 + G06/G07/G08/G11);
8. Implement;
9. Measure;
10. Store outcome;
11. Update knowledge;
12. Re-rank.

Figure 6 cycle: Baseline, then Constraint + hypothesis, Design + approval, Implement + measure, Review results, Learn + re-rank.

##### 1.11.2 Statistical design

- Preregistration; stable visitor assignment; customer-level holdout for email; SRM and contamination checks; no peeking.
- Example: 2.0% to 2.4% CVR needs about 21,109 observations per arm, about 43 days at 1,000 per day [p55].

##### 1.11.3 Evidence types and permitted conclusions [p55-56]

| Evidence type | Use / permitted conclusion |
|---|---|
| Verified operational correction | defect reproduced and corrected |
| Qualitative customer test | behaviour described; no lift claim |
| Controlled randomized test | effect with uncertainty |
| Quasi-experimental | conditional effect |
| Before/after observation | causality unproven |
| Invalid / inconclusive | (no conclusion) |

##### 1.11.4 Starter experiment backlog [p56-57]

| Area | Example hypothesis | Guardrail |
|---|---|---|
| Advertising | separate low-margin products to improve CM2 | |
| Creative | real product demo resolves an objection | |
| Copy | state dimensions clearly | wrong-size returns |
| Offers | relevant bundle improves CM1/order | |
| Pricing | price change improves contribution | |
| Landing pages | match ad promise to a dedicated page | |
| Product pages | fit/scale demonstration | |
| Cart | show delivery cost earlier | |
| Checkout | fix verified payment issue | |
| Post-purchase | useful accessory | |
| Email | product-use guidance improves repeat contribution | holdout |
| SMS | consented replenishment message | |
| SEO | category content and internal links | |
| Content | answer repeated product-selection question | |
| Retention | resolve delivery/usage issue before discounts | |
| Operations | packaging change to reduce damage | |
| Fulfilment | route a region to a better courier | |
| Customer experience | improve a high-volume support answer | |

##### 1.11.5 Feedback, transfer and cross-tenant learning

- Store the intervention and its exposure, and make bounded belief updates. Cross-tenant benchmarks are deferred [p57].
- Knowledge promotion to platform-wide use needs rights review, documented context, replication and aggregation [§15 p50].

#### 1.12 Metrics and economics

##### 1.12.1 Metric dictionary [BIAB-PDF §16 pp51-52]

**Gross sales**: merchandise value before discounts/refunds, excluding tax.

**Net revenue**: gross sales - discounts - revenue refunds + customer shipping charges.

**COGS**: cost assigned to goods sold, with a documented return/restock policy; landed components counted once.

**Gross profit / margin**: net revenue - COGS; GP / net revenue.

**CM1 (contribution before acquisition)**: GP - variable fulfilment - payment fees - incremental returns/RTO handling - other variable servicing. Do not deduct refund revenue again.

**CM2 (contribution after acquisition)**: CM1 - allocated acquisition/marketing. This is not net profit.

**New-customer GP and GP/CAC**: first-order GP / new customers, then divided by CAC.

**CAC**: defined acquisition spend / verified new customers. Media-only and fully loaded versions are shown separately.

**Break-even CAC / target CAC**: expected first-order CM1 per new customer; the target subtracts the desired retained contribution.

**ROAS**: a platform's attributed revenue / that platform's spend. Always label the window and basis.

**MER**: canonical net revenue / total marketing spend.

**AOV**: order revenue / included orders.

**Conversion rate**: purchases / eligible sessions or visitors, with one fixed denominator.

**Refund and RTO rates**: refunded orders or value / original eligible cohort; RTO / shipped orders.

**Repeat-purchase rate**: customers with a 2nd order within X days / customers with ≥X days observed.

**Contribution LTV**: discounted expected future CM1 per acquired customer over a declared horizon, with CAC subtracted separately.

**Inventory turnover**: annualized COGS / average inventory.

**Stockout rate**: unavailable SKU-location hours / eligible selling hours.

**Fulfilment and support**: median/p90 paid-to-dispatched and dispatched-to-delivered; contacts per 100 orders; resolution time; complaint rate.

**DOCX additions** [§5]: gross profit per purchase, operating profit, available cash (bank cash less restricted balances and near-term obligations), customer cohort contribution at equal cohort ages.

##### 1.12.2 Worked unit economics

**PDF India, INR per order** [Appendix E p87-88]: display 1,499 less 99 discount = 1,400 billed.

| Line | Amount (INR) |
|---|---|
| Refunds (4%) | 56 |
| Net revenue | 1,344 |
| Landed COGS (factory 380 + packaging 30 + freight 40 + charges 50) | 500 |
| GP | 844 |
| Outbound fulfilment | 100 |
| Payment fees (3%) | 42 |
| Reverse handling | 30 |
| CM1 / break-even CAC | 672 |
| Target CAC | 420 |
| Contribution after acquisition | 252 |
| Target net-revenue ROAS | 3.20 |

Sensitivity (CM1 / contribution at CAC 420):

| Case | CM1 | Contribution |
|---|---|---|
| Refunds 10% + handling 75 | 543 | 123 |
| COGS 650 | 522 | 102 |
| Both | 393 | -27 (not viable) |

Cash example: 100-unit batch = 50,000 + 30,000 ad test + 20,000 reserve = INR 100,000. Use a weekly cash calendar.

**PDF US**: identical arithmetic in USD at one tenth scale (149.90 less 9.90 = 140.00; CM1 67.20; target CAC 42.00; ROAS 3.20; cash need USD 10,000) [BIAB-PDF-US Appendix E].

**DOCX, USD per order** [§5; Deck s15]:

| Line | Amount (USD) |
|---|---|
| Product value | 100 |
| Discount | -10 |
| Net revenue | 90 |
| COGS | 28 |
| GP | 62 |
| Fulfilment | 9 |
| Payment | 3 |
| Service/returns | 2 |
| CM1 | 48 |
| Acquisition | 30 |
| CM2 | 18 |

Break-even CAC is $48; revenue-to-acquisition ratio is 1.875.

**Landed-cost comparison** [BIAB-DOCX §12; Deck s9], at 500 units:

| Supplier | Factory price | Freight | Landed per unit |
|---|---|---|---|
| A | $6.00 | $900 | $7.80 |
| B | $5.60 | $1,300 | $8.20 |

The cheaper factory price is more expensive once freight is included.

##### 1.12.3 Sources of record

- PDF [§14 p47]:
  - store = order identity/status;
  - approved finance records = COGS;
  - provider invoices/settlements = cash and fees;
  - ad platforms = spend plus their own attribution;
  - warehouse = derived metrics;
  - merchant-approved profile = strategy.
- DOCX [§5]: a table of 9 business facts with authoritative record and reconciliation needs: ordered items, payment/settlement, product cost, ad spend, shipment/service, consent, accounting totals, experiment outcome.

##### 1.12.4 Reconciliation and data gates

- PDF [p52]: every top SKU has an approved cost; ≥95% of order-line revenue has cost coverage; unexplained variance <1%.
- DOCX [§5]: 7 consecutive daily reconciliations, <1% variance, ≥95% cost coverage weighted by net revenue.
- DOCX measurement acceptance checklist (6 steps) [§5]:
  1. Mappings validated with test transactions.
  2. Purchase events fire once at the right state.
  3. Order counts and revenue reconcile.
  4. Cost coverage and return maturity measured.
  5. Consent and permissions checked.
  6. Replay, partial refund, cancel, edit and revoke tested.

##### 1.12.5 Dashboard and alerts [BIAB-PDF §16 p53]

- Top row: net revenue, GP, CM2, cash availability, upcoming inventory commitments.
- Below that: what changed, confidence/freshness, bottleneck, active experiment, next approval.
- Alerts: cost change, missing purchase events, refund/RTO movement, staleness, negative contribution, stockout, cash shortfall.

##### 1.12.6 Merchant success vs platform success

- **Merchant success measures** [BIAB-DOCX §1; Deck s29]: retained contribution, cash and commitments, customer experience (orders arrive as promised), owner time. Revenue, ROAS, content count and task count are supporting measures only.
- **Platform metrics** [BIAB-PDF §16 p53; §27 p84]: paid-pilot conversion, fully loaded sales cost, delivery hours, delivery gross margin, time to value, renewal, contribution LTV.
- **Weekly commercial review** [PDF p84]: prospects, paid conversion, cash collected, capacity, time to accepted baseline, overdue decisions, incidents. Monthly: margin, CAC, adoption, renewals, cancellations. Quarterly: beachhead, core, expansion.
- **Product and business scorecard** [BIAB-DOCX §11]:

  | Dimension | Measures |
  |---|---|
  | Activation | connections, accepted baseline, time to first intervention |
  | Retention | weekly decision use, repeated workflows, renewal, churn reasons |
  | Merchant economics | mature contribution, cash, service, owner effort, fee burden |
  | Execution quality | verified completion, defects, approval latency, uncertain writes, recovery |
  | Delivery economics | cost per brand, human minutes per workflow, generation cost, support |
  | Expansion | paid modules, new product projects, referrals, partners |

#### 1.13 Concierge MVP playbook (first paid service)

##### 1.13.1 PDF: "Profit and Conversion Sprint" [BIAB-PDF §22 pp69-70]

**Offer**:
- 30 days, one existing store, one country/currency, one bounded improvement.
- Price hypothesis INR 30,000 (US: USD 3,000), excluding taxes, ad spend, product costs, subscriptions, paid production and complex engineering.

**Deliverables**:
1. Reconciled baseline plus missing-data report;
2. Product/offer economics sheet;
3. Three prioritized bottlenecks;
4. One approved change or experiment with exact scope;
5. Implementation support within the agreed limit;
6. Final readout with uncertainty and next action.

No statistical winner is promised.

**Qualification**:
- Owner can provide order, refund and cost records; has authority; has time.
- Initial filter: ≥300 monthly fulfilled orders and about 90 days of records.
- Very small stores get a qualitative/operational variant.
- Excluded: specialist claims, unresolved account ownership, missing data, guaranteed-return expectations.

**30-day delivery playbook**:

| Timing | Work | Output / acceptance |
|---|---|---|
| Before day 1 | qualification, scope, price, data agreement, payment | named buyer/approver, data checklist |
| Days 1-5 | intake call, secure file transfer, mapping, gap resolution | identity, currency, costs, coverage confirmed |
| Days 6-8 | reconcile orders/refunds/spend; product mix and fulfilment | accepted baseline |
| Days 9-10 | diagnose 3 opportunities; review with founder | founder picks one |
| Days 11-14 | design change/test; asset and guardrails | exact scope, owner, budget, approvals |
| Days 15-20 | stage and implement, or hand over instructions; verify | QA evidence plus receipt |
| Days 21-30 | measure mature outcomes; economics and learning | adopt / revert / continue / inconclusive plus next recommendation |

The clock pauses on access delays.

**Tooling**: intake form, shared evidence folder, canonical workbook/DB, reviewed templates, existing AI drafting tools, a human ecommerce lead.

**Delivery hours (20 per pilot)**:

| Task | Hours |
|---|---|
| Intake | 2 |
| Data cleaning / reconciliation | 5 |
| Diagnosis | 4 |
| Change prep | 3 |
| Specialist review | 2 |
| Implementation QA | 2 |
| Readout | 2 |

**Delivery economics**:

| | INR | US version |
|---|---|---|
| Rate / tool cost | 750/hr + 2,000 tools | 75/hr + 200 tools |
| Delivery cost | 17,000 | |
| Contribution | 13,000 (43.3%) | 1,300 |
| Contribution at 30 hrs | 5,500 (18.3%) | |

80 hours/month supports 4 pilots.

**Validation gates**:
- 5 paid pilots;
- ≥3 adopt a recommendation;
- ≥3 pay for a next cycle;
- median delivery margin ≥40%;
- no material reconciliation or unauthorized-action incident.

**Stop or revise if**: buyers want free reports, can't supply data, don't act, reject the viable price, or need out-of-scope work. If only diagnosis has value, test a diagnostic-only product.

**Follow-on "Product and Launch Validation" service**:
- Covers M01-M09, an initial store concept and a capped validation plan.
- One supply path, one country.
- Charged for research and decision support; samples, inventory and ads are paid by the merchant.

##### 1.13.2 DOCX: Phase 0 operator-led pilots [BIAB-DOCX §10-11]

- 3-5 established brands; run the first 8 routines manually or assisted, in the final input/output formats.
- Deliver baseline, backlog and ≥1 completed intervention per pilot; record time per activity.
- Pilot screening range: about 300-5,000 monthly orders.
- Distribution: founder-led sales, ecommerce relationships, referral partners; agencies second.

#### 1.14 Pricing and packaging of the Ecommerce OS service

- **PDF pricing**:
  - Fixed-price pilot (INR 30,000 / USD 3,000), then optional recurring optimization; software tier later [§3 p7; §19 step 15-16].
  - Illustrative next monthly cycle: INR 15,000 (USD 1,500) with 6,500 variable cost gives 8,500 contribution.
  - Illustrative platform CAC: INR 90,000 / 6 customers = INR 15,000 (US USD 9,000 / 6 = 1,500) [§27 p84].
- **DOCX pricing** [§11; Deck s28]:
  1. Paid onboarding or diagnostic fee;
  2. Recurring subscription or supported-operations fee with usage limits for generation and specialist work;
  3. Later stage-based fees for research, sourcing, sample coordination and launch support.
  - Inventory and ad spend are visible pass-throughs.
  - Avoid pure profit share initially. If performance fees are added later, define the counterfactual, window, refund maturity, caps and dispute process.
- **DOCX platform economics example**: a $1,000/month account less $120 model/infra, $180 review/support and $100 other direct cost leaves $600 contribution before overhead. A $400 price leaves nothing.
- **Deck packaging** [s28]: 01 Paid onboarding (baseline plus first action plan); 02 Recurring operation (agreed routines plus review); 03 Later launch services (charged by stage, clear external costs).
- **Customer segments / editions**:
  - Owner-led Shopify brands (first);
  - Agencies (second; multi-brand);
  - New entrepreneurs (later, staged programme with capital and scope limits) [BIAB-DOCX §10-11; Deck s4, s18, s32].
  - Category editions later: regulated/safety/spoilage categories [BIAB-DOCX §2].
- **Strategic trade-off decisions** [BIAB-DOCX §11]:

  | Choice | Decision |
  |---|---|
  | Existing brands vs new founders | existing first, test launches inside them |
  | Service vs self-serve | paid supported pilots with reusable routines |
  | Unify vs replace providers | unify interface, replace selectively |
  | General agents vs workflows | durable workflows with bounded agents |
  | Many categories vs focus | one market, narrow category profile |
  | Fixed vs outcome fees | recurring fees first, careful performance components later |

#### 1.15 Roadmaps and the 12-month plan

##### 1.15.1 PDF product roadmap: 6 phases [BIAB-PDF §23 pp71-76]

| Phase | Timing | Core | Automation | Integrations | Complexity | Validation milestone |
|---|---|---|---|---|---|---|
| 0 Concierge validation | weeks 1-8 | intake, files, baseline, diagnosis, one improvement, readout | spreadsheets, templates, AI drafts; no unattended actions | merchant exports only | 1/5 | 5 paid pilots, renewal, margin |
| 1 Internal operating system | months 3-4 | case workspace, canonical entities, importer, metric engine, evidence/approval records, report generator | parsing, formulas, reports, stale alerts | uploads; read-only sandbox spikes | 2/5 | 30% faster prep across 10 cases |
| 2 Customer-facing guided product | months 5-6 | tenant onboarding, voice/text intake, profile, reports, approvals, tasks, exports | uploads, validation, status, notifications | ≤1 read connector | 3/5 | 80% complete tasks unaided |
| 3 Connected optimization platform | months 7-9 | store + 1 ad platform + analytics, reconcile, profit/funnel, experiment backlog | OAuth, backfill/webhooks, health, metrics, weekly explanations | Shopify, GA4, Meta or Google | 4/5 | 95% refreshes on target |
| 4 Controlled execution | months 10-12 | action proposals, diff, approvals, draft/paused creation, receipts, stop, rollback | approval verification, dispatch, idempotency, readback | one write adapter | 5/5 | zero unauthorized writes; 20 reviewed executions |
| 5 Learning operating system | after month 12, conditional | closed-loop hypotheses, cross-module updates, experiment retrieval, business playbooks | evidence refresh, belief updates | proven connectors plus partners | 5/5 | beats fresh-context baseline in blinded review |

##### 1.15.2 PDF twelve-month execution plan [BIAB-PDF §27 pp83-84] (Month 1 = Sep 2026)

| Month | Work (owner) | Deliverable | Exit signal |
|---|---|---|---|
| 1 | segment interviews, workflow observation, price/scope offers (founder) | segment/DMU register, sample report, five-pilot recruitment plan | one beachhead with willingness to pay |
| 2 | deliver first paid cohort (founder + operator + analyst) | five case files, records, time ledger | adoption, next-cycle demand, margin |
| 3 | standardize metrics, imports, playbooks (operator + engineer) | canonical schema, importer v1, reconciliation and report templates | repeated tasks identified |
| 4 | run internal OS across more cases (engineer + operator) | versioned artifacts, approvals, experiment registry, time savings | faster prep, no quality loss |
| 5 | design/test portal and onboarding (product + designer) | intake/report/approval flow, exports, tenant model | customers can correct facts |
| 6 | release guided product to invited payers (product + engineer) | portal, notifications, deletion/export, recovery test | returning decision use |
| 7 | Shopify read adapter (integration owner) | backfill, webhooks, cost matching, connector health | records reconcile |
| 8 | GA4 + most demanded ad reporting adapter | unified baseline, separate attribution | freshness supports diagnosis |
| 9 | validate recurring optimization economics (founder + analyst) | cohort adoption/renewal, CAC/margin, bottleneck history | deepen / revise / pause |
| 10 | one draft/paused-entity workflow (engineer + release owner) | approval hashes, write adapter, readback, idempotency, runbooks | safe in test accounts |
| 11 | bounded live execution pilot (operator + release owner) | reconciled action ledger, incident/rollback evidence | authority, recovery, value hold |
| 12 | consolidate and select next path (founder + team) | annual evidence pack, roadmap, staffing/runway, optional new-business pilot plan | fund from retained paid value |

**First two weeks** [p84]:
- Days 1-3: questions plus a sample baseline/decision card.
- Days 4-7: interviews.
- Days 8-10: present the paid offer.
- Days 11-14: begin paid cases.

##### 1.15.3 DOCX roadmap: 5 phases [BIAB-DOCX §10; Deck s25-s26]

| Phase | Timing | Scope |
|---|---|---|
| 0 Prove the work with operators | weeks 1-4 | (see 1.13.2) |
| 1 Minimum viable operating platform | months 2-3 | R01-R04 and R08 in software; one country, Shopify, 1 paid platform, cost import, 1 lifecycle provider |
| 2 Expand coordinated growth and retention | months 4-6 | catalogue/feeds, deeper CRO and creative, lifecycle execution, content, support intelligence |
| 3 Supply chain and product launch pilots | months 7-12 | R09-R17 plus ops routines; launches within existing brands first |
| 4 Complete business launch experience | month 12+ | voice/chat new-entrepreneur journey, country/category configs, partner ordering |

**First 90 days** [§10]:

| Days | Work |
|---|---|
| 1-14 | country/segment, pilots, measures |
| 15-30 | operator-run routines, first interventions |
| 31-45 | productize connections, reconciliation, owner view |
| 46-60 | previews, approvals, adapters, readback, recovery: one change type end to end |
| 61-75 | weekly cycles, add lifecycle/creative |
| 76-90 | review economics, renewal, decide |

Deck s26 condenses this to weeks 1-2 / 3-4 / 5-8 / 9-12.

**Build backlog in dependency order** [§10]:
- **P0**: workspace and identity; connection inventory/health; order cost and contribution model; routine run/action history; policy, approval and budget service; preview and exact action review; external verification and recovery.
- **P1**: owner review and opportunity queue; creative, storefront and lifecycle adapters; evaluation and incident console.
- **P2**: new product and sourcing modules; partner and channel expansion.

**PDF MVP backlog** [Appendix K p92-93]:

| Item | Phase |
|---|---|
| File intake and mapping | 0-1 |
| Economics calculator | 1 |
| Baseline report | 1 |
| Decision card | 1-2 |
| Canonical profile | 1-2 |
| Tenant portal | 2 |
| Experiment registry | 2-3 |
| Read connector | 3 |
| Approved write worker | 4 |
| Learning retrieval | 5 |

##### 1.15.4 Prioritized recommendations [BIAB-PDF §21 p68]

1. Select a beachhead plus 5 paid pilots;
2. Metric and cost contract;
3. One manual improvement cycle;
4. Measure delivery hours and rework;
5. Standardize approvals and canonical context;
6. Internal imports and reports;
7. Small customer portal;
8. Shopify, then one acquisition/analytics connector;
9. Drafts, then narrow approved writes;
10. Expand into new-business concierge.

**Postpone**: supplier marketplace, automated negotiation commitments, unrestricted financial actions, manufacturing automation, many countries, social scraping, cross-tenant optimization.

#### 1.16 Data, integrations and knowledge (platform layer, briefly)

- **PDF entity registry** [§14 pp44-47]:
  - Common contract: id, tenant, business, versions, source system/ID/observed time, verification, evidence IDs, supersedes. Money stored as integer minor units.
  - Entities: markets, categories, products, suppliers, quotations, BOMs, customer language, avatars, offers, brand documents, landing references, page sections, copy examples, creative examples, creative performance, experiments, ad performance, customer journeys, orders, product costs, gross profit, retention, operational performance.
  - Permissions T/F/R/P/G; retention classes R1-R6.
  - Domain events: profile.confirmed, quote.expired, cost.approved, artifact.approved, order.refunded, connector.stale, experiment.closed, product_cost.changed [§14 p47; §24 p78].
- **DOCX core entities** [§5]: Business, Market, AccountConnection, Goal, CustomerProblem, Opportunity, Product, Variant, Specification, BOMRevision, Supplier, Quote, Sample, Inspection, PurchaseOrder, InventoryLot, Shipment, Order, OrderLine, Payment, Refund, CostRecord, Creative, Campaign, Journey, Consent, SupportCase, Experiment, WorkflowRun, Action, Approval, Evidence.
- **Integration matrix**:
  - PDF [§13 pp36-43], codes O/C/U/M/P/N: Shopify, WooCommerce, Meta Marketing/CAPI, Google Ads, Merchant Center/Merchant API, GA4 Data API, GTM, Microsoft Clarity, Klaviyo, supplier directories (Alibaba/AliExpress), marketplaces incl. Amazon, Shipping/3PL (Shiprocket in India; Shippo in US), Stripe (Razorpay India), Cloudflare DNS, email provider (Google Workspace), Gorgias, Zoho Books, Search Console, Reddit/social listening, Adobe Firefly, BigQuery, Metabase, CRM, voice transcription. Plus a connector release checklist.
  - DOCX [§8]: Shopify, Meta, Google Ads/Merchant Center, analytics/search, Klaviyo, Alibaba/AliExpress, supplier/inspection partners, payments/accounting, carriers/fulfilment, social/marketplaces.
- **Knowledge-library classes** [BIAB-PDF §15 pp49-50]: platform-wide knowledge (playbooks, templates, metric definitions, patterns); tenant business knowledge; customer personal data; licensed third-party data; public information; generated content.
  - Reusable-pattern record fields: context, mechanism hypothesis, conditions, contraindications, examples, evidence grade, compatible modules, last review, owner, versions. **This maps directly onto catalogue "knowledge" items.**
- **Technical architecture** [BIAB-PDF §24 pp77-79]: frontend, auth/orgs, API, workflow engine (state machines), agent orchestration (task router, bounded skills), prompt management (versioned with evals), retrieval, Postgres-style DB, object storage, event tracking, integration layer, jobs/queues, pipelines, warehouse, metrics, experiment DB, audit/approvals, notifications, billing, secrets, monitoring, backup. Read-first integration; separate write worker. Example internal API routes are listed.
- **Security** [BIAB-PDF §18 pp58-59]:
  - Boundaries: identity, tenant, secrets, AI/tool access (prompt-injection from supplier PDFs), external actions, personal data, payments, uploads, availability.
  - Country readiness: India covers consumer disclosures, grievance, GST, DGFT IEC, DPDP. US covers federal/state, sales-tax nexus, CBP, FTC, CCPA.
  - Voice policy: audio ≤24h. Recovery targets: RTO 8h / RPO 24h.

#### 1.17 Gaps and risks registers

**Gaps in the original concept (13)** [BIAB-PDF §20 p67]:
1. Beachhead not selected;
2. Primary customer/persona missing;
3. Buying/approval unit undefined;
4. Full life-cycle responsibility unclear;
5. Quantified value untested;
6. Competitive position/core unproven;
7. Acquisition/sales process absent;
8. Unit economics incomplete (COD/RTO, stockholding, labour, data cleanup);
9. MVBP thresholds unspecified;
10. Pricing/scope untested;
11. Product sequencing too broad;
12. Data rights/connector access assumed;
13. Working capital under-represented; attribution and low sample sizes unresolved; exit and ownership undefined. (The PDF lists these as 3 further rows; the count of 13 folds them into one item here.)

**Risks (14)** [BIAB-PDF §26 pp81-82]: buyers don't pay; product too broad; bad profit advice; working-capital failure; supplier/product failure; unsupported integration; unauthorized/duplicate action; privacy/tenant leak; false causal claim; harmful optimization; service-margin collapse; weak retention; vendor/model dependence; shared-learning misuse. Each has an early indicator, mitigation/owner and stop condition.

#### 1.18 Templates and appendices (asset candidates)

**PDF appendices** [§28 pp85-95]:
- A. Founder intake and confirmed-profile template (field groups: business/geography, cash/time, skills/constraints, customer/offer, existing-store context, authority/access, confirmation).
- B. Research evidence and assumption template.
- C. Supplier RFQ email plus negotiation topics (MOQ, price breaks, lead time, quality/packaging, payment schedule, exclusivity/scaling, backup onboarding).
- D. Supplier comparison plus sample-acceptance record.
- E. Worked product economics and cash.
- F. Existing-store bottleneck output plus recommendation card.
- G. Experiment charter and result template.
- H. Full customer-journey inspection template.
- I. Canonical schema JSON (business profile, approval).
- J. Approval and audit record template.
- K. MVP backlog.
- L. Research and source register.
- Master-prompt coverage index.

**DOCX §12 reusable specs**: opportunity card spec; supplier quotation comparison spec; sample inspection record spec; experiment spec; routine spec example (compare outbound fulfilment quotes); launch-readiness record; founder decisions list.

---

### PART 2: Proposed workflow / module / agent library in these docs

Level per the schema: prompt | skill | routine | workflow | agent | system | knowledge | asset. All entries are **draft** (proposed in planning documents; nothing has been built or tested). Proposed kebab names are the suggested catalogue slugs.

#### 2.1 Modules M01-M21 (PDF), as workflows (each is "a reusable workflow with an owner and an artifact")

| Doc ID | Proposed catalogue name | Level | Area | Sub-area | One line | Source |
|---|---|---|---|---|---|---|
| M01 | founder-constraints-intake | workflow | ST | intake / route choice | Turn founder cash, time, country and exclusions into a Founder Brief and route decision | BIAB-PDF §10 p18 |
| M02 | market-research-and-selection | workflow | RS | market selection | Weighted market evidence matrix, giving a 3-market shortlist and beachhead | p18-19 |
| M03 | product-category-research | workflow | RS | category scoring | Category cards scored for margin, shipping, returns and route fit, giving a Category Decision Sheet | p19 |
| M04 | product-research-and-validation | workflow | RS | product validation | Ranked product hypotheses plus a low-cost validation test, giving a Product Validation Memo | p19 |
| M05 | supplier-discovery-and-comparison | workflow | OP | sourcing | Normalize supplier quotes and due diligence, giving a preferred plus backup supplier pack | p20 |
| M06 | supplier-rfq-and-negotiation | workflow | OP | sourcing comms | Bilingual RFQ/negotiation drafts plus a should-cost sheet | p20 |
| M07 | supply-inventory-and-fulfilment-plan | workflow | OP | inventory / fulfilment | QC, PO, inbound, reorder and safety-stock plan, giving a Supply Readiness Pack plus cash and reorder plan | p20-21 |
| M08 | customer-avatar-research | workflow | RS | VOC / persona | Evidence-grounded avatars from interviews, reviews and support, giving a Beachhead Brief | p21 |
| M09 | offer-and-unit-economics | workflow | OF | offer / pricing | Offer alternatives plus a deterministic CM1/CAC calculator, giving an Offer and Economics Sheet | p21-22 |
| M10 | brand-strategy | workflow | BF | brand guide | 2-3 brand directions, giving Brand Guide v1 plus a claim register | p22 |
| M11 | domain-and-business-infrastructure | workflow | SY | store / email / payments setup | Domain, DNS, email auth, payments, tax and policies checklist, giving an Infrastructure Readiness Sheet | p22-23 |
| M12 | website-and-funnel-builder | workflow | WS | pages / funnels | Awareness-mapped home/PDP/landing/advertorial/quiz pages, giving a staged page spec | p23 |
| M13 | website-inspiration-library | asset | WS | reference library | Rights-aware tagged library of page patterns plus adaptation notes | p23 |
| M14 | site-speed-and-checkout-optimization | workflow | WS | CRO / performance | Core Web Vitals and checkout friction checks, giving a Performance Fix Pack | p24 |
| M15 | analytics-data-foundation | workflow | AN | tracking / reconciliation | Normalize and reconcile store, ads, analytics and costs, giving a Measurement Readiness Report | p24 |
| M16 | business-dashboard-and-metrics | system | AN | dashboard | Money earned/kept, customers, stock, what changed, plus a weekly decision brief | p24-25 |
| M17 | creative-strategy-and-production | workflow | CS | creative pipeline | Research, concept, script, image/video, copy, QC, claims, publish chain | p25 |
| M18 | paid-advertising-meta-google | workflow | PA | media buying | Economically bounded Meta/Google test plans, feeds, stop and scale rules | p25-26 |
| M19 | email-sms-lifecycle | workflow | RT | flows | Consent-safe welcome-to-VIP flows with holdouts | p26 |
| M20 | seo-content-ai-search | workflow | OG | SEO / GEO | Technical SEO, content briefs, AI-answer observations, giving a backlog | p26-27 |
| M21 | customer-journey-revenue-optimization | workflow | WS | journey / CRO | 15-stage journey friction map, giving a ranked experiment backlog | p27 |

#### 2.2 Routines R01-R24 (DOCX)

| Doc ID | Proposed name | Level | Area | One line | Source |
|---|---|---|---|---|---|
| R01 | connection-data-health-check | routine | SY | Daily check of scopes, freshness and missing fields, giving owned exceptions | BIAB-DOCX §6 |
| R02 | order-contribution-reconciliation | routine | FN | Daily order contribution waterfall plus discrepancy queue | §6 |
| R03 | tracking-event-verification | routine | AN | Verify purchase events, IDs, dedup and consent, giving a repair proposal | §6 |
| R04 | bottleneck-opportunity-ranking | routine | ST | Weekly constraint diagnosis, giving top-3 interventions | §6 |
| R05 | pdp-catalog-speed-improvement | routine | WS | Approved opportunity, then previewed PDP/catalogue/speed change plus verification | §6 |
| R06 | creative-experiment | routine | CS | Distinct concepts, rights, claims and campaign draft, then a measured test | §6 |
| R07 | lifecycle-gap-flow-repair | routine | RT | Find missing/broken flows, repair one, test inclusions and exclusions | §6 |
| R08 | owner-weekly-operating-review | routine | ST | Weekly brief: changes, completed work, immature results, decisions | §6 |
| R09 | opportunity-discovery | routine | RS | Idea or category review, giving an evidence-backed product shortlist | §6 table |
| R10 | customer-validation | routine | RS | Interviews and demand tests for a selected opportunity | §6 table |
| R11 | supply-route-comparison | routine | OF | Dropship vs stock vs manufacture route and capital decision | §6 table |
| R12 | product-spec-and-bom | routine | OF | Versioned spec, BOM and manufacturing brief | §6 table |
| R13 | supplier-quotation | routine | OP | Comparable quotes and shortlist on a landed-cost basis | §6 table |
| R14 | samples-and-inspection | routine | OP | Sample tracking plus quality acceptance record | §6 table |
| R15 | negotiation-and-purchase-order | routine | OP | Final terms and PO under mandate and approval | §6 table |
| R16 | inventory-replenishment | routine | OP | Reorder proposal plus cash impact | §6 table |
| R17 | store-and-channel-launch | routine | WS | Store, catalogue, assets and launch checks | §6 table |
| R18 | search-and-content-plan | routine | OG | Reviewed content plus publication plan | §6 table |
| R19 | carrier-warehouse-comparison | routine | OP | Total-cost and service comparison of 3PL/carriers | §6 table, §12 example |
| R20 | fulfilment-exception-handling | routine | OP | Delay, damage or failed delivery, then an assigned recovery action | §6 table |
| R21 | returns-promise-gap-analysis | routine | CX | Return/complaint pattern, then root cause plus corrective work | §6 table |
| R22 | customer-recovery-and-delight | routine | CX | Gifts, service, referral or QR actions for eligible events | §6 table |
| R23 | cash-and-commitments-forecast | routine | FN | 13-week cash forecast plus spend constraints | §6 table |
| R24 | channel-expansion | routine | ST | Channel launch and test package | §6 table |

#### 2.3 Named workflows (DOCX worked examples, PDF journeys and loops)

| Doc ID | Proposed name | Level | Area | One line | Source |
|---|---|---|---|---|---|
| WF-A | improve-established-brand-contribution | workflow | ST | R01, R02, R04, then R05/R06 or R21; publish, verify, R08 ("increase contribution without raising ad budget") | BIAB-DOCX §7 |
| WF-B | launch-new-product | workflow | ST | R09, R10, R11, R12-R15, R17, R03, R07, R19, R20, R23 under an $8k capital envelope | BIAB-DOCX §7 |
| WF-C | select-fulfilment-provider | workflow | OP | R19 quote request, normalize, limited test, R20 tracking, migrate | BIAB-DOCX §7 |
| J-NEW | new-business-launch-journey | workflow | ST | 9-stage set-limits-to-learn path across M01-M21 | BIAB-PDF §8 p13 |
| J-EXIST | existing-store-diagnose-improve-loop | workflow | ST | Connect, extend, reconcile, diagnose, decide, implement, evaluate, recalculate | BIAB-PDF §9 p16 |
| LOOP-12 | experiment-learning-loop | workflow | AN | 12-step baseline-to-re-rank experiment cycle | BIAB-PDF §17 p54 |
| SPRINT-30 | profit-and-conversion-sprint | system | ST | 30-day paid concierge service (M15+M16+M21+M09+one implementation module) | BIAB-PDF §22 p69 |
| PLV | product-and-launch-validation-service | system | ST | Follow-on concierge covering M01-M09 for new businesses | BIAB-PDF §22 p70 |
| DE-24 | disciplined-entrepreneurship-ecom-mapping | knowledge | ST | 24-step framework applied to merchant and platform | BIAB-PDF §19 |

#### 2.4 Agents and skills (PDF §12)

| Doc ID | Proposed name | Level | Area | Skill id | Source |
|---|---|---|---|---|---|
| A01 | research-analyst-agent | agent | RS | research.v1 | BIAB-PDF p31 |
| A02 | sourcing-assistant-agent | agent | OP | sourcing.v1 | p32 |
| A03 | offer-and-brand-strategist-agent | agent | OF | offer_brand.v1 | p32 |
| A04 | website-assistant-agent | agent | WS | storefront.v1 | p32 |
| A05 | diagnosis-experiment-analyst-agent | agent | AN | diagnose_test.v1 | p32 |
| A06 | meta-planner-agent | agent | PA | meta_plan.v1 | p32 |
| A07 | google-ads-planner-agent | agent | PA | google_plan.v1 | p33 |
| A08 | lifecycle-assistant-agent | agent | RT | lifecycle.v1 | p33 |
| A09 | seo-content-assistant-agent | agent | OG | seo_content.v1 | p33 |
| A10 | operations-cx-assistant-agent | agent | CX | operations_cx.v1 | p33 |
| C01 | creative-researcher | skill | CS | creative_research.v1 | p33 |
| C02 | ad-concept-developer | skill | CS | creative_concept.v1 | p34 |
| C03 | ad-scriptwriter | skill | CW | creative_script.v1 | p34 |
| C04 | ad-image-producer | skill | CPS | creative_image.v1 | p34 |
| C05 | ad-video-producer | skill | CPV | creative_video.v1 | p34 |
| C06 | ad-copywriter | skill | CW | creative_copy.v1 | p34 |
| C07 | creative-qc-checker | skill | CPS | creative_qa.v1 (deterministic) | p34 |
| C08 | claims-compliance-checker | skill | CS | creative_claims.v1 | p35 |
| C09 | ad-publishing-worker | skill | PA | creative_publish.v1 (deterministic) | p35 |

#### 2.5 Governance and policy items

| Doc ID | Proposed name | Level | Area | One line | Source |
|---|---|---|---|---|---|
| G01-G11 | approval-gates-register | knowledge | SY | 11 decision gates with owner, evidence, scope, invalidation | BIAB-PDF §11 |
| AUTON | graduated-autonomy-ladder | knowledge | SY | Observe, Prepare, Execute-with-approval, Execute-within-policy, Coordinate | BIAB-DOCX §9 |
| RC | routine-contract-spec | asset | SY | Standard fields every routine must declare | BIAB-DOCX §6 |
| AIC | ai-role-contract | asset | SY | Inherited data, prompt, workflow, confidence, audit and feedback controls for AI roles | BIAB-PDF §12 p31 |
| ACT | action-approval-payload-spec | asset | SY | Approval payload plus execution protocol | BIAB-PDF §11 p30; DOCX §8 |
| PRODGATES | production-readiness-gates | knowledge | SY | Financial, authority, recovery, completion and review gates | BIAB-DOCX §9 |

#### 2.6 Templates and knowledge assets

| Doc ID | Proposed name | Level | Area | Source |
|---|---|---|---|---|
| T-A | founder-intake-template | asset | ST | BIAB-PDF App. A |
| T-B | research-evidence-assumption-template | asset | RS | App. B |
| T-C | supplier-rfq-email-and-negotiation-template | asset | OP | App. C |
| T-D | supplier-comparison-and-sample-acceptance-template | asset | OP | App. D; DOCX §12 |
| T-E | product-economics-and-cash-worked-example | knowledge | FN | App. E; DOCX §5 |
| T-F | bottleneck-recommendation-card | asset | ST | App. F |
| T-G | experiment-charter-template | asset | AN | App. G; DOCX §12 |
| T-H | customer-journey-inspection-template | asset | WS | App. H |
| T-I | canonical-business-profile-schema | asset | SY | App. I |
| T-J | approval-audit-record-template | asset | SY | App. J |
| T-OPP | opportunity-card-spec | asset | RS | DOCX §12 |
| T-LR | launch-readiness-checklist | asset | ST | DOCX §12 |
| T-MET | ecommerce-metric-dictionary | knowledge | FN | PDF §16; DOCX §5 |
| T-MAC | measurement-acceptance-checklist | asset | AN | DOCX §5 |
| T-SXB | starter-experiment-backlog | knowledge | AN | PDF §17 p56-57 |
| T-INT | ecommerce-integration-api-matrix | knowledge | SY | PDF §13; DOCX §8 |
| T-MSG | lifecycle-message-family-matrix | knowledge | RT | DOCX §4 |
| T-SUP | supply-path-comparison | knowledge | OP | PDF §8 p14; DOCX §4 |

---

### PART 3: Doc notes

#### 3.1 BIAB-PDF (India-first edition)

- **Path**: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\Docs\ecommerce-business-in-a-box-blueprint.pdf` (404,822 bytes). Text extract: `...\Temp\eos_inv\text\ecommerce-business-in-a-box-blueprint.txt` (4,615 lines).
- **Title / date**: "E-commerce Business in a Box: a practical blueprint for helping founders launch, operate and improve an online store". Prepared for Kevin Mark, 10 September 2026, Version 1.0. Footer: "Product and implementation blueprint | September 2026".
- **Purpose**: product strategy plus customer experience plus implementation spec translating Kevin's master prompt (R0 "Pasted markdown.md", not present in these folders) into a buildable product. It also recommends a sellable concierge MVP first.
- **Audience** (reader guide p2):
  - founders: §1-6, 19-23;
  - designers: §7-11, 28;
  - engineers: §12-18, 24;
  - delivery teams: module contracts, gates, concierge, 12-month plan.
- **Structure**: 95 pages, 28 sections (contents p3), 8 figures, many tables. Section numbers deliberately match the master prompt's requested deliverable spec. Evidence labels: Requirement / Proposal / Assumption / Verified documentation / Pending verification.
- **External framework**: maps Bill Aulet's *Disciplined Entrepreneurship* (D1 = 3-page Summaries.com summary; D2 = a 41-page Wiley 2024 preview). Steps and meanings are paraphrased. Rights: the ecommerce adaptation is Kevin's own; the underlying 24-step framework belongs to a third-party book and should be treated as reference only in any resale.
- **Quality**: very high.
  - Rigorous and internally consistent: formulas checked, sample-size math, honest caveats ("planning assumptions, not benchmarks").
  - Strong governance design (gates, payloads, idempotency).
  - The densest source in the library for the module, agent and gate model.
- **Weaknesses**:
  - Text extraction scrambles some multi-column tables (§3, §16 metric table, §25, §26, §27 months 10-12, starter backlog p57). They were reconstructed above.
  - There is no dedicated CX/returns module or creator/influencer module.
  - It is platform-builder oriented more than operator-playbook oriented: little channel-tactics content (e.g. no creative angle library, no ad account structure detail).
- **Overlaps**:
  - Same vision as BIAB-DOCX/DECK (2 days earlier) but a different taxonomy (M01-M21 vs R01-R24) and a different first-market framing (India / INR vs a USD example market).
  - Likely overlaps `Docs\Ecommerce_OS_Complete_Lifecycle_Blueprint.pdf` (9 Sep, not in my scope) and the earlier `Ecommerce-OS-Deck-v2.pdf` / `Ecommerce idea maps.pdf` (cited as internal context by the DOCX).
- **Status**: draft (AI-generated planning document; nothing validated).
- **Duplicate status**: canonical India edition. BIAB-PDF-US is a localized variant.

#### 3.2 BIAB-PDF-US (US-localized variant)

- **Path**: `...\Docs\ecommerce-business-in-a-box-blueprint (1).pdf` (405,565 bytes; saved 12:58, about 80 minutes after the India file). Text: `...ecommerce-business-in-a-box-blueprint (1).txt` (4,611 lines).
- **Relationship**: same 95 pages, 28 sections, same modules, gates, agents, roadmap and all structure. Word-level diff shows **only localization changes**:
  1. Beachhead: "India-based" becomes "US-based founder-led Shopify business"; §3 "India-first" becomes "US market confirmed / specified by the user; test the remaining choices in the first month". The open-questions table now says "US confirmed; category/language after interviews".
  2. Currency: every INR amount is converted to USD at a **1:10 planning scale**, not an exchange rate. The document says explicitly that "These USD figures are illustrative US planning assumptions, not exchange-rate conversions or validated market prices". Examples: pilot INR 30,000 to USD 3,000; INR 750/hr to USD 75/hr; delivery cost 17,000 to 1,700; monthly cycle INR 15,000 to USD 1,500; worked order 1,499/99 to 149.90/9.90; cash need INR 100,000 to USD 10,000; profile JSON country IN/INR/Asia/Kolkata to US/USD/America/New_York, test_budget_minor 3,000,000 to 300,000.
  3. Cash-on-delivery concepts replaced: "COD remittance delay" becomes "payment-processor payout delay"; "return-to-origin (RTO)" becomes "return-to-sender"; "uncollected COD order" becomes "authorized but uncaptured payment"; gap row "Returns, COD/RTO" becomes "Returns, payment disputes, failed deliveries".
  4. Integrations: Shiprocket becomes **Shippo** (separate test/live keys; live labels incur charges); "Razorpay/local providers" becomes "Other US payment providers".
  5. Compliance (§18, source register L01-L02): India items (consumer disclosures, grievance handling, packaged-goods labels, GST/invoicing, DGFT IEC, MeitY/DPDP) are replaced by US federal and state requirements (complaints, product labels, sales-tax nexus and collection, CBP importing guidance, FTC data-security guidance, California CCPA, noting that a US location alone doesn't make CCPA apply, SBA obligations). "Do not clone India's tax..." becomes "do not clone US tax...".
  6. Minor: knowledge-retrieval test question "Indian paid ad" becomes "US paid ad"; the §18 pilot heading becomes "US-market pilot".
- **Quality**: same as India edition. The US version reads slightly cleaner on compliance.
- **Duplicate status**: variant of BIAB-PDF. Keep both only if a country-pack concept matters, which the doc itself recommends ("new country pack"). Otherwise one canonical copy plus a localization note.
- **Status**: draft.

#### 3.3 BIAB-DOCX (and its markdown source BIAB-MD)

- **Path**: `...\Docs\Ecommerce_OS_Business_in_a_Box_Blueprint.docx` (622,084 bytes). Extract `...\Temp\eos_inv\text\BiaB_docx.txt` (875 lines).
- **Markdown source**: `...\Ecommerce OS\tmp\business_box\blueprint.md` (101,009 bytes, 846 lines).
  - **Equivalence check**: word-level SequenceMatcher ratio 0.9955.
  - The only differences: the DOCX adds a cover metadata block (Status Proposed / Owner Founder / Last updated 8 Sep 2026 / Purpose / Audience / Related docs / Scope) and a "Figure 1" caption; the MD keeps hyperlink URLs inline where the DOCX shows link text.
  - **The MD is complete and content-identical.**
- **Build folder**: `tmp\business_box` (build_blueprint.py, inspect_template.py, render_word.ps1, word_normalized.docx, rendered_text.txt, page_audit.json, final_qa.json, blueprint_review.pdf, architecture.png/pdf, reference_render/, final_render/).
  - final_qa.json: 37 pages, 12 main sections, 24 routines, 12 source links, all pages visually reviewed, opens in Word without repair.
  - The build used an OpenAI-curated "artifact-template-system-design" reference.docx template (artifact.md). That confirms it was produced in a Codex session.
- **Title / date**: "Ecommerce OS: Business in a box". Product strategy and implementation blueprint; status Proposed; 8 Sep 2026; audience: founder, product engineering, operations teams.
- **Purpose**: platform strategy for "Ecommerce OS". Start with established brands (weekly measured improvements), then reuse capabilities for a guided new-business launch.
- **Structure** (12 sections):
  1. Executive recommendation (5-step build sequence: skills, routines, workflows, bounded agents, platform);
  2. Scope and business model;
  3. Two guided journeys;
  4. Complete business capability map (17 areas);
  5. Data foundation and economic measures;
  6. Skills to routines (capability hierarchy, routine contract, R01-R24, cadence);
  7. Coordinated workflows A/B/C;
  8. Architecture and integration boundaries;
  9. Authority, security, readiness (autonomy ladder, production gates);
  10. Implementation roadmap (phases 0-4, 90 days, P0-P2 backlog, team);
  11. Commercial strategy (offer, pricing, platform economics, scorecard, trade-offs, other verticals);
  12. Reusable specs (opportunity card, quote comparison, sample inspection, experiment, routine example, launch readiness, founder decisions) plus sources S1-S10.
- **Quality**: high.
  - Concise and operator-friendly; the **capability hierarchy and routine contract align almost exactly with the catalogue's prompt to system levels**. It is the best source for routine definitions.
  - Thinner than the PDF on agents, gates and 24-step mapping.
  - Uses USD illustrations and "one country" without naming it.
- **Overlaps**:
  - The PDF (same concept, different taxonomy, 2 days later); the PDF does not cite the DOCX.
  - The DECK is built directly from this DOCX's blueprint.md.
  - Cites internal context: "Ecommerce OS US Financial Opportunity Playbook", "Ecommerce OS Deck v2", "Ecommerce idea maps".
- **Duplicate status**: canonical. blueprint.md is the same content (variant / source).
- **Status**: draft.

#### 3.4 BIAB-DECK

- **Path**: `...\Presentations\Ecommerce_OS_Business_in_a_Box_v2.pptx` (12,105,296 bytes; sha256 9a080e7f…). 32 slides, 6 embedded AI-generated images (cover, founder, sample, customer, fulfilment, agency), 1 native chart (slide 15 contribution waterfall).
- **Storyline**: `tmp\ecommerce_deck\story_and_notes.json` (32 entries: number, title, notes). Its titles match the slides.
  1. Ecommerce OS
  2. The owner connects the business by hand
  3. One platform carries the work forward
  4. Two starting points, one OS
  5. A new entrepreneur can begin with a vague idea
  6. Research turns a vague idea into choices
  7. The supply route shapes the business
  8. Samples turn promises into evidence
  9. The lowest factory price can cost more
  10. Launch readiness means a working customer journey
  11. The first purchase begins the next cycle
  12. Existing brands begin with a weekly improvement
  13. The first useful output is a trusted baseline
  14. One return reason can improve several parts
  15. Contribution shows what the order keeps
  16. Growth is a continuous operating program
  17. Growth depends on keeping the delivery promise
  18. Agencies can run one method across many clients
  19. The owner keeps control of important decisions
  20. Skills become routines, then workflows
  21. Eight routines form the first operating loop
  22. A workflow ends with a verified result
  23. Every decision uses the same business record
  24. The first product has a focused scope
  25. Expansion follows evidence
  26. The first 90 days
  27. Human judgement stays where evidence demands it
  28. Customers pay for useful work that keeps happening
  29. Success means a healthier business
  30. The advantage grows with completed work
  31. The platform can own more as it matures
  32. The owner sets the direction; Ecommerce OS carries the work forward
- **Purpose / audience**: pitch-style strategy narrative for discussing the first pilot customer. Owner, investor or partner audience. Speaker notes disclaim "not a shipped product, validated traction or guaranteed results".
- **Source**: visual-review.json states source = `tmp/business_box/blueprint.md`, status "Ready for delivery".
- **Quality**: polished.
  - Every slide's notes cite the blueprint. The numbers are checked (landed cost, waterfall).
  - Generated imagery is disclosed with its prompts. Slide 5 depicts an AI-generated person, labelled illustrative.
  - Adds little new content beyond the DOCX. Slide framings that are useful for the catalogue: Attract / Decide / Earn; Prepare / Authorize / Execute / Verify; 4 baseline pillars; 4 expansion stages; 3-tier packaging.
  - The extract `BiaB_pptx.txt` captured only table text plus notes. Slide body text was re-extracted read-only from the slide XML for this report.
- **Duplicate status**: derivative of BIAB-DOCX. Not a duplicate of any other file except its build intermediates.
- **Status**: draft.

#### 3.5 Deck build intermediates (asset row)

All are by-products of the Codex PPTX build on 8 Sep 2026. Size and hash check (sha256 prefix):

| Item | Size | Hash / identity |
|---|---|---|
| `Ecommerce OS\.chart-data-29eRGs\candidate.pptx` | 12,105,296 | 9a080e7fda54cc38 = **identical to the final deck** |
| `.chart-data-4pgyZk\candidate.pptx` | 12,105,324 | 9ce74fba838a034d (pre-final candidate) |
| `.chart-data-Q7qAkj\candidate.pptx` | 12,105,324 | 58bd1bfaf3ed9aec = **identical to `tmp\ecommerce_deck\superseded-final-v1.pptx`** |
| `tmp\ecommerce_deck\candidate.pptx` | 12,104,185 | 6d40f4ef1783ab55 (v1 build) |
| `tmp\ecommerce_deck\candidate-v2.pptx` | 12,104,147 | 358dbfba479b5e0f (v2 build, pre-finalize) |
| `tmp\ecommerce_deck\native_chart_test.pptx` | 12,186,586 | 15190ced14fbce72 (chart-edit test copy) |

- Each `.chart-data-*` folder also holds a 1 KB chart-data-snapshot.json.
- The rest of `tmp\ecommerce_deck` (total ~235 MB): build_deck.mjs, finalize.mjs, render_powerpoint.ps1; presentation.json (157 MB serialized deck); *.inspect.ndjson; final-validation(-v2).json; visual-review.json; assets/ (6 PNG source images); renders/, powerpoint_render/, powerpoint_render_v2/ (slide PNGs plus review.pdf); a node_modules symlink into the Codex runtime cache.
- Not read deeply, as instructed. No unique content: everything is superseded by the final deck. **Candidates for archive or deletion** (about 70 MB of duplicate pptx in the root plus about 235 MB in tmp). Deletion is Kevin's call; this inventory is read-only.

#### 3.6 Cross-document observations for the catalogue

1. **Taxonomy reconciliation needed**. The PDF (M01-M21 modules, A/C agents, G gates) and the DOCX (17 capability areas, R01-R24 routines) describe the same business from two angles. The crosswalk in 1.5 is the proposed merge: modules become workflows; routines become routines; A/C roles become agents/skills.
2. **The DOCX capability hierarchy equals the catalogue's level ladder.** Adopt the DOCX "standard routine contract" (§6) plus the PDF "AI-role contract" (§12) as the catalogue item spec.
3. **Missing parts of the ecommerce model, to fill from other sources**:
   - creators/influencers/affiliates (CR);
   - a dedicated CX/helpdesk module (only A10, R20-R22);
   - a creative angle/hook libraries (the documents are governance-heavy, tactic-light);
   - BFCM/seasonal planning (only "calendar campaigns" and "seasonality");
   - marketplace operations (Amazon only as a research source);
   - wholesale/B2B;
   - subscriptions in depth.
4. **The "24" naming collision** (DE steps vs routines) should be disambiguated in catalogue naming.
5. **Lineage gaps**: the master prompt "Pasted markdown.md" (R0) that generated the PDF, and the Disciplined Entrepreneurship PDFs (D1, D2), are not in the inventoried folders. They may sit in a Codex session folder.
6. Neither document contains instructions aimed at an AI beyond normal spec language. No secrets were found.


---

# Appendix E. Financial set: FINMAP, FSOS, FINPLAY-US/-GL, USOPP, backlog.json

### Inventory E -- Ecommerce OS financial business model (master map of parts)

Scope: the four financial-architecture documents in the Ecommerce OS library (plus the non-US playbook variant and the two backlog datasets). Goal: extract the ecommerce business model these docs describe -- P&L, balance sheet, cash flow, unit economics, KPI trees, bottleneck diagnosis, data trust, departments and stages -- as the master map of parts for the prompt -> skill -> routine -> workflow -> agent -> system catalogue.

All source documents are AI-generated planning/strategy documents (Codex/AI, for Kevin, 5-7 Sep 2026). None contains implementation code; every "agent", "dashboard" or "tool" below is a specification-level idea, not a built part. Content in the files was treated as data; the US playbook explicitly says the source PDFs' "instructions to agents" and commercial terms were not adopted, and nothing in these four documents tried to instruct this inventory agent.

#### 0. Source legend (short names used in tags)

| Tag | Document | Form | Pages / size | Date |
| --- | --- | --- | --- | --- |
| FINMAP | Ecommerce-OS-Financial-Operating-Map.pdf (Docs) | PDF, India-first, rupee framing | 17 pp | 7 Sep 2026 |
| FSOS | Ecommerce_OS_Financial_Statement_Operating_System.pdf (+ .docx twin) (Docs) | PDF/DOCX, general/market-neutral, $ framing | 23 pp | 7 Sep 2026 |
| FINPLAY-US | output\Ecommerce_OS_US_Financial_Opportunity_Playbook.md (+ 2 identical PDFs) | Markdown, US/USD, US GAAP | 132 KB md, ~44 pp PDF | 7 Sep 2026 |
| FINPLAY-GL | output\Ecommerce_OS_Financial_Opportunity_Playbook.md (+ PDF) | Markdown, neutral currency units (CU), IFRS | 127 KB md | 7 Sep 2026 |
| BACKLOG | tmp\pdfs\us\backlog.json (US) and tmp\pdfs\backlog.json (GL) | JSON, 300 records each | 142 KB / 141 KB | 7 Sep 2026 |
| USOPP | Ecommerce_OS_US_Opportunity_Architecture_v1.0.pdf (Docs) | PDF, US-first stack-ranked portfolio | 35 pp | 5 Sep 2026 |

Tag formats: [FINMAP p3] = page; [FSOS §3.12 p11] = section + page; [FINPLAY-US F5] = foundation section; [FINPLAY-US 1.18 / M175] = opportunity group / item ID; [USOPP §19 p17] = domain section + page; [USOPP #6] = rank in the 178-item master backlog.

Lineage: USOPP (5 Sep) is the earliest; FINMAP re-cuts the idea maps + USOPP by statement (India-first); FSOS reorganises idea map + USOPP + deck into a general financial-statement OS and adds working-capital/financing modules; FINPLAY-GL then FINPLAY-US (7 Sep, 11:25 then 11:31) synthesise idea maps + USOPP + deck + FINMAP into 300 numbered opportunities with corrected accounting.

---

#### 1. Core thesis and design principles (the operating model)

- **One machine, three views.** An ecommerce business is one machine turning cash -> inventory -> traffic -> orders -> collected cash. Income statement = did each cycle make a profit; balance sheet = how much cash is trapped in the machine now; cash flow = is the machine funding its own growth or starving. [FINMAP p1]
- **North star = profitable growth**: gross profit dollars, contribution margin dollars and cash generation -- not ROAS or platform-reported vanity metrics. [FSOS §0 p2] [USOPP §1 p2] [FINMAP §5.1 p14]
- **Optimise the business, not a channel.** Product margin, pricing, speed, merchandising, checkout, chargebacks, returns, shipping, inventory, retention and team cadence all matter; a higher ROAS is irrelevant if orders carry poor margin or come back as refunds. [USOPP §1 p2]
- **Two overlapping maps**: business value chain (sourcing -> margin realisation) x customer journey (discovery -> repeat/referral); opportunities sit at the overlap. [USOPP §1 p2]
- **Operating loop**: connect data -> reconcile financial truth -> diagnose the biggest leak -> propose a ranked action -> get approval -> execute or assist -> monitor a narrow test -> write learning back into the playbook. [FSOS §0 p2] (Deck lineage: connect -> audit -> propose -> run -> report.) [FSOS source basis p23]
- **Every lever maps to >=1 statement line and >=1 operating metric**; local metrics explain the path, financial metrics decide whether it mattered. [FSOS §0 p2]
- **Diagnose before you optimise**: size every leak in money, close the biggest one first with the smallest, most-watched change; output three actions, not forty. [FINMAP p1-2] [FINPLAY-US F3]
- **Win the right to make bigger changes**: start safe, visible, economically legible; then move to offers, budget allocation, pricing, inventory, policy. Every improvement shows its economic chain (faster page -> higher completion -> more retained orders -> higher GP). [USOPP §5 p4]
- **Closed loop is the moat**: research informs creative, creative informs media, media + customer quality inform GP, returns inform catalogue, support informs content, inventory constrains media. [USOPP §5 p4]
- **Human judgment at high-leverage decision points**; the system removes hunting, formatting, copying, monitoring, repetitive analysis. [USOPP §5 p4] Reporting agents read-only by design. [FINMAP p3] Read-only by default, scoped writes, approval thresholds, spend caps. [FSOS §6.1 p20]
- **Marketing emphasis**: ~two-thirds of levers are growth/marketing (FINMAP "~two-thirds"; FSOS "roughly two-thirds"; FINPLAY exactly 200/300 = 66.7%). [FINMAP p1] [FSOS §3 p5] [FINPLAY-US intro]
- **Proof sequence**: proven on own brand first, then one client, then the roster. [FINMAP §5.3 p15]
- **Commercial model (FINMAP only)**: profit-share -- the OS funds and runs initiatives and is paid only from the gross-profit lift; "if it doesn't lift, nobody pays". [FINMAP §4.3 p13] FINPLAY treats these terms as options, not assumptions. [FINPLAY-US operating rhythm]

---

#### 2. Diagnostic layer -- find the bottleneck before building

##### 2.1 The two pipelines (gate chains)

- **Demand pipeline (customer gates), India-first**: Impression -> Click -> Landing -> Product view -> Add to cart -> Checkout started -> Order placed -> COD confirmed -> Shipped -> Delivered (not RTO) -> Kept (not returned) -> Repeat order. [FINMAP §1.1 p2]
- **Money pipeline (rupee gates)**: Ad spent -> Attributed revenue -> Collected revenue -> Net of returns/chargebacks -> Gross profit -> Contribution margin -> Operating profit. [FINMAP §1.1 p2]
- **Funnel waterfall (FSOS)**: impressions -> clicks -> sessions -> PDP views -> ATC -> checkout -> purchase -> retained order -> repeat order; proof = step conversion, lost GP by step. [FSOS §1.1 p3]
- **Customer pipeline (US)**: need/trigger -> discovery -> click -> loaded landing page -> product evaluation -> cart -> checkout -> payment/order -> shipment -> delivery -> kept product -> second purchase -> advocacy. [FINPLAY-US F1]
- **Money pipeline (US, dated states)**: marketing cash paid -> order booked -> revenue recognised -> deductions established -> COGS matched -> fulfilment and selling costs matched -> contribution earned -> payout receivable -> bank cash -> replenishment and obligations funded. Keep event dates separate; an order can pass one pipeline and fail the other. [FINPLAY-US F1]
- **Customer journey, 13 stages** with OS value and proof metrics: (1) demand before the click, (2) first impression, (3) page loads and makes sense, (4) product discovery, (5) product evaluation, (6) cart and offer decision, (7) checkout and payment, (8) confirmation and anticipation, (9) delivery experience, (10) product experience, (11) return/support path, (12) next purchase, (13) advocacy. [USOPP Part III p24-25]

##### 2.2 Diagnostic tool sets (three overlapping versions)

**FINMAP (7 tools)** [FINMAP §1.1 p2]
- Funnel leak map (gate CVR vs category benchmark, gap sized "worth X/month")
- Profit waterfall (gross revenue stepped to net profit, biggest eaters first)
- Unit-economics teardown (every SKU/campaign/ad has a mini P&L; finds "good ROAS, negative GP")
- Cohort/retention leak (first -> second order failure, value of a recovered second order)
- Cash-trap map (inventory, COD-in-transit float, gateway/marketplace settlement)
- Anomaly and leak detection (spend, CVR, refunds, fees, stock, tracking; metric = time-to-detection)
- Single output: "Your biggest leak this month is X, worth Y. Fix order: X, then Z, then W."

**FSOS (25 core diagnostic modules, each with a proof metric)** [FSOS §1.1 p3]
- Financial waterfall (daily gross -> net -> GP -> CM -> cash collected; leakage $)
- Funnel waterfall (lost GP by step)
- Unit-economics sanity check (GP/order, CM/order, negative-margin order rate)
- Revenue quality (booked vs delivered/retained/settled; return-adjusted revenue)
- Data reliability score (freshness, completeness, duplication, reconciliation, join quality)
- Tracking health (missing/duplicate events, broken UTMs, match quality)
- Channel-to-finance reconciliation (ads, store, processors, marketplaces, refunds)
- SKU margin heatmap (GP/session, CM, return-adjusted margin, stock health)
- Campaign profit heatmap (GP/spend, marginal GP, nGP/CAC)
- Customer cohort diagnostic (90d/180d GP, payback by source/first product/discount/geo)
- Creative diagnostic (hook/claim/proof/offer/visual/CTA -> GP/1k impressions)
- Offer leakage diagnostic (stacking, affiliate interception, free-shipping over-subsidy)
- Return root-cause diagnostic (reason codes x product/variant/creative promise/source/lot/delivery)
- Chargeback root-cause diagnostic (reason, processor, product, geo, delivery proof)
- Inventory constraint diagnostic (stockouts, aged, in-transit, safety-stock breaches, cash trapped)
- Working-capital diagnostic (inventory days + settlement days - payable days -> CCC, financing need)
- Supplier diagnostic (unit cost, MOQ, terms, lead-time variance, defects, OTIF)
- Shipping economics diagnostic (cost, surcharge, damage, delivery time by lane/service/carrier)
- Site performance diagnostic (LCP/INP/CLS prioritised by revenue impact)
- Lifecycle diagnostic (missing/weak flows, oversending, discount dependence, deliverability)
- Organic discovery diagnostic (commercial demand, coverage, rankings, product data, AI-answer readiness)
- Support diagnostic (pre-purchase questions, post-purchase issues, SLA, conversation-to-order)
- Software/Opex diagnostic (tools, contracts, seats, duplicate capability, speed cost)
- Bottleneck score (Economic Impact x Confidence x Speed / Effort)
- Owner action queue (3-10 sentence-level actions with owner, due date, impact, approval state, result)

**FINPLAY-US (12-row diagnostic toolkit)** [FINPLAY-US F2]
- Data confidence gate; Demand and traffic mix map; Funnel gate map (rank by lost expected CM1); Order profit waterfall (gross sales -> CM2 by SKU/order/source/cohort); Price-volume-mix bridge; Creative saturation map; Retention maturity map (same-age cohorts); Product promise gap (ad/page promises vs support/cancel/return causes); Inventory constraint map; Settlement and cash trap map; Thirteen-week liquidity stress test; Workflow capacity audit (is execution capacity the real bottleneck?).
- Segmentation rule: by product/variant, channel, new vs repeat, device, payment method, fulfilment route, cohort age; aggregate sparse segments; benchmark against own periods and controlled tests first. [FINPLAY-US F2]

##### 2.3 Sizing and ranking the bottleneck (formulas)

- **Funnel opportunity** = eligible entrants x feasible absolute gate improvement x downstream kept-order probability x expected CM1 per kept order - extra media/incentive/execution cost (never apply loss probability twice). Worked: 20,000 checkout starts x 2 pp x 90% kept x $25 CM1 = $9,000/month. [FINPLAY-US F3]
- **Cost opportunity** = eligible units x avoidable cost/unit - implementation and ongoing cost - service/demand harm. **Working-capital opportunity** = reduction in asset balance or increase in sustainable liabilities, reported separately from recurring profit ("a $50,000 inventory release is a cash event, not $50,000 of profit"). [FINPLAY-US F3]
- **Opportunity card fields**: statement line; symptom; affected volume; baseline; plausible change range; contribution upside; cash required/released; evidence confidence; dependency; effort; owner; time to learning; stop condition. Tie-breaker = confidence-weighted contribution upside / effort. Pick **three active actions** (biggest evidenced bottleneck, its data dependency, one cheap learning experiment); urgent outages/settlement failures/liquidity gaps jump the queue; do not sum overlapping funnel gains. [FINPLAY-US F3]
- **FSOS bottleneck score** = Economic Impact x Confidence x Speed / Effort [FSOS §1.1 p3]; **FSOS prioritisation formula** = (Impact x Confidence x Speed) / (Effort x Risk), then hard guardrails for data quality and liquidity; factors: economic impact (annualised GP/CM/cash), confidence, speed to proof, effort, risk, dependency. [FSOS §7.1 p21]
- **USOPP composite priority** = 60% business lever + 40% visibility (1-5 scales: 5 = proof in days-2 weeks / moves GP across most orders ... 1 = long horizon / small). [USOPP §2 p2]
- **USOPP 2x2**: high-vis/high-lever "start here" (tracking health, checkout friction, cart/checkout recovery, top-SKU profit truth, above-the-fold, creative winner library, site speed, OOS suppression); low-vis/high-lever "build foundations early" (90/180-day GP, continuous CRO, incrementality, demand planning, return-source quality, profit-aware budget steering); high-vis/moderate "trust builders" (catalogue refresh, app cleanup, address validation, asset resizing, exec reporting, daily action summary); low-vis/moderate "keep selective" (supplier risk, community flywheel, advanced content scaling, loyalty redesign, material hedging). [USOPP §4 p4]

---

#### 3. Data layer -- the one honest number system (data trust)

##### 3.1 Unit-economics definitions (three generations; FINPLAY corrects the earlier two)

**FINMAP definitions (India-first)** [FINMAP §1.2 p2]
- GPP (gross profit per purchase) = selling price - landed COGS - packaging - outbound shipping - payment fee - return/RTO allocation - ad cost for that order. "This is the number."
- nGPP (first orders) vs repeat GPP -- separates acquisition from retention economics.
- CAC = ad spend / new customers (not orders); nGP-to-CAC tested at first order and at 90 days.
- 90/180-day customer GP -- sets allowable acquisition cost.
- Contribution margin = monthly GP after all variable costs and all ad spend ("is the business growing" line).
- MER = total revenue / total ad spend (blended sanity check).
- Loss rates: RTO, return, chargeback sliced by SKU, pincode, campaign, payment method; prepaid share as first-class margin metric.
- Standard ad metrics (CPM, CTR, CPC, cost/ATC, cost/checkout, checkout-to-purchase) = diagnostics only.

**FSOS Appendix A (core metric definitions)** [FSOS App A p22]
- Gross revenue; net revenue; GPP (operating view; ad cost optional/separate; keep formula stable); new-customer GPP; repeat GPP; 90/180-day customer GP; CAC; nGP/CAC; MER; GP/spend; contribution margin; return-adjusted revenue; inventory days; cash conversion cycle; cash payback; marginal CAC/marginal GP.
- Accounting note: preserve statutory classification, keep a separate stable contribution-economics view; tax/legal/hedging need qualified review.

**FINPLAY-US F5 (corrected, recommended canonical set)** [FINPLAY-US F5] [FINPLAY-US corrections]
- Gross merchandise revenue = recognised units x pre-discount price, excluding sales tax; booked demand shown separately.
- Net revenue = GMR + recognised shipping/service revenue - discounts - returns/allowances - chargeback principal (as revenue reversal).
- COGS = carrying cost of goods sold incl. eligible landed costs; reverse recoverable cost for restocked returns.
- **GP = net revenue - COGS** (correction: anything that also deducts shipping/fees/ads is a contribution measure, not GP; stop calling all three "GPP").
- **CM1** (before marketing) = GP - variable fulfilment, payment, marketplace, service and loss costs.
- **CM2** (after marketing) = CM1 - assigned marketing (media + specified creative/CRM/agency).
- **EBITDA** = CM2 - remaining cash overhead; **EBIT** = EBITDA - D&A; **net profit** = EBIT +/- non-operating - net finance expense - income tax (correction: operating profit != EBITDA).
- Paid CAC (acquisition media / new customers; != CPA); Fully loaded CAC (media + creative + agency + acquisition labour); customer contribution at 90/180 days; payback (cohort age where cumulative contribution covers CAC; cash-payback variant); ROAS and MER (label gross/net basis, neither proves incrementality); incremental return (additional CM1 / additional marketing cost).
- Rules: every cost appears once (fixed management mapping + ledger bridge); chargeback principal separate from dispute fees and recoveries; pre-recognition cancellations are lost demand, not a revenue reduction.

**Worked order economics (US)** [FINPLAY-US F6]
- $100 GMR - $10 discount - $5 expected refunds = $85 net revenue; COGS $30 -> GP $55 (64.7% gross margin); shipping $7 + pick-pack/packaging $3 + payment fees $3 + reverse-logistics/loss $2 = $15 -> CM1 $40; marketing $25 -> CM2 $15.
- Platform ROAS on $90 = 3.6x vs management net-revenue ratio 3.4x; neither equals gross margin.
- **Offer simulator**: required units to preserve contribution = baseline units x baseline unit contribution / promotional unit contribution. $100 price, $60 variable cost -> 10% discount needs +33.3% units; if cost rises to $65 -> +60%. Required price for target margin rate m with proportional fees f and other unit costs C = C / (1 - m - f).

##### 3.2 Cost loading (how the cost side gets in) [FINMAP p3] [FSOS §2.1 p4]
- Owner uploads COGS file once (SKU, cost, packaging); shipping cost from courier/carrier data; gateway fees from the payment provider; returns/RTO matched to orders; landed cost built once and maintained; every order/product/campaign/ad re-scored automatically; SKUs with no cost flagged. [FINMAP p3]
- "Missing COGS is unknown, never zero"; date-effective COGS; actual vs estimated flags; conservative estimates for recent orders replaced by actuals with visible revision; operational cohort view beside posted ledger view. [FINPLAY-US F4]

##### 3.3 Data products and contracts (FSOS, 25) [FSOS §2.1 p4]
- Canonical order table; Order-line economics table; SKU cost master (incl. BOM/material exposure); Customer identity graph; Customer cohort table; Marketing spend ledger; Creative asset registry; Attribution bridge (platform vs finance-blended vs incrementality view); Server-side event layer; Profit-weighted conversion value; Negative outcome feedback; Payment/settlement ledger; Marketplace settlement ledger; Inventory ledger (SKU-location states); Purchase-order ledger; Supplier master; Fulfilment ledger; Returns ledger; Support reason-code ledger; Discount and promotion ledger; Experiment registry; Decision log; Metric contract registry; Data quality monitors; Role-level semantic views.

##### 3.4 Data objects and quality rules (FINPLAY, 10 objects) [FINPLAY-US F4]
- Objects (grain, fields, source/refresh): order and order line; refund/cancellation/dispute; product and cost history (SKU/BOM version, supplier/lot, effective dates); fulfilment and service cost; marketing spend and assets; customer and lifecycle (consent by channel, experiment assignment); inventory and purchasing; settlement and bank; general ledger and obligations; experiment and action register.
- Quality rules: unique order-line keys; idempotent events; common timezone and FX policy; returns attached to original sale; gross-to-net checks; date-effective COGS; partial refunds and split shipments explicit; unmatched records held visibly.
- Attribution is an explanatory model, not an accounting source: multiple views, unattributed bucket, never sum overlapping platform-reported sales; shared spend allocated once and reconciled to invoices.

##### 3.5 Reconciliation and quality gates
- Platform-reported vs bank-collected vs store revenue reconciled to one truth; pixel/CAPI health checked daily (missing/duplicate/low-match events); duplicates removed. [FINMAP p3]
- Data reliability score, tracking health, channel-to-finance reconciliation as first diagnostics. [FSOS §1.1 p3]
- Metric contract registry (define each metric once: formula, sources, exclusions, refresh, owner; proof = metric disagreement count); data quality monitors (freshness, row counts, schema change, duplicate orders, missing COGS, impossible values). [FSOS §2.1 p4]
- First diagnostic step = reconcile one recent period from orders through payout/bank, plus a definitions sheet; gate: no missing-cost SKU treated as profitable. [FINPLAY-US shortlist #1]
- Confidence strip on every dashboard: last refresh, cost coverage, reconciliation exceptions, cohort maturity, estimate share. [FINPLAY-US owner screen]

##### 3.6 Feedback to ad platforms (profit-aware signals, "CAPI and beyond")
- FINMAP (aspirational): GP as the value parameter instead of revenue; negative signals (RTO refusals, returns, cancellations, chargebacks) as distinct events so lookalikes learn who not to find; prepaid vs COD as event property; confirmed-COD event only after WhatsApp/IVR confirmation; repeat and offline events on schedule; match quality (phone, email, name, city, pincode hashed). [FINMAP p3]
- FSOS: server-side event layer; profit-weighted conversion value "where platform policies permit"; negative outcome feedback as labelled downstream outcomes; media-profit feedback loop (yesterday's customer quality changes today's spend). [FSOS §2.1 p4] [FSOS §3.2 p6]
- FINPLAY-US F7 (corrected 6-step return-to-acquisition loop): (1) join purchase -> product/lot -> campaign/creative -> delivery -> return/dispute -> recovery via stable IDs; (2) mature source/SKU cohorts + pending-loss estimates; (3) feed internal decisions first (fix promises, suppress unavailable, revise SKU economics, source-level spend proposals); (4) preserve canonical purchase revenue, test profit-value optimisation with bounded budget; (5) Google conversion restatement/retraction; Meta matching/dedup/coverage/freshness -- do not assume a refund event trains a negative preference; (6) judge on incremental retained contribution. Correction: platform feedback is a capability to validate; "CAC API / CAPT" in the brief = profit-aware advertising feedback. [FINPLAY-US F7] [FINPLAY-US corrections]

---

#### 4. Income statement -- the P&L waterfall (largest section, ~2/3 of levers)

##### 4.0 The P&L formats (compare)

| Line | FINMAP (contribution format) [p4] | FSOS [§0 p2] | FINPLAY-US (corrected) [F5] |
| --- | --- | --- | --- |
| Top | Gross revenue = orders x ASP | Gross revenue = traffic x conversion x orders x units/order x price | Gross merchandise revenue (+ shipping/service revenue) |
| Contra | - discounts/coupons/promo; - returns & RTO; - chargebacks | - discounts/promotions; - cancellations/returns/refunds/chargebacks | - discounts; - returns/allowances; - chargeback principal |
| = | Net revenue | Net revenue | Net revenue |
| COGS | - landed COGS | - landed COGS (product + inbound freight + duty + packaging + loss/defect) | - COGS (carrying cost incl. eligible landed costs) |
| = | Gross profit | Gross profit | GP (gross margin = GP / net revenue) |
| Variable | - variable selling costs (outbound shipping, gateway fees, packaging, pick-pack, COD fees) = CM pre-marketing | - variable fulfilment/payment/service (fees, shipping, pick-pack, variable support, affiliate commissions) | - variable fulfilment, payment, marketplace, service, loss = **CM1** |
| Marketing | - marketing/acquisition = CM post-marketing ("did this order make money") | - performance marketing = contribution margin | - assigned marketing (media + creative/CRM/agency) = **CM2** |
| Fixed | - opex (software, apps, tools, fixed ops) = operating profit/EBITDA | - fixed opex (people, software, facilities, G&A) = operating profit/EBITDA view | - cash overhead = EBITDA; - D&A = EBIT; - finance, tax = net profit |

- Two P&Ls at once: the monthly business P&L and the same structure per order, per SKU, per campaign, per channel ("every order carries its own income statement"). [FINMAP p4]
- Order of work follows the waterfall: grow gross demand, control commercial leakage, retain revenue, lower landed cost, lower variable cost, make marketing productive, remove fixed waste. [FSOS §3 p5]

##### 4.1 Line 1 -- Gross revenue (four multipliers: qualified traffic x conversion x order value x purchase frequency) [FINMAP p4]

###### 4.1.1 Customer and market research (feeds acquisition)
- FINMAP: angle/keyword/persona map from account history; VoC language bank (reviews, competitor reviews, Reddit, Quora, YouTube/IG comments, tickets); competitor teardown weekly ("ten things they do that you don't"); angle whitespace / JTBD map; "working right now" feed with pilot plan. [FINMAP §1.1 p4]
- FSOS 3.1 (12): VoC mining; JTBD map; persona evidence packs; angle whitespace map; competitor ad monitor; competitor offer monitor; objection library; research-to-test pipeline; search-demand mining; review gap mining; purchase-sequence mining; profitability-segment research. [FSOS §3.1 p5]
- FINPLAY 1.1 (M001-M010) e.g. voice-of-customer bank, purchase-trigger map, buyer-vs-user research, lost-customer interviews, first-product cohort research, research-to-test handoff. [FINPLAY-US 1.1]
- USOPP §13 (8 areas; vis 3.5 / lever 4.6): VoC mining (#31), angle whitespace (#52), JTBD (#60), persona evidence packs (#63), research-to-test pipeline (#68), competitor ad/offer monitor, objection library, offer benchmark database. [USOPP §13 p11-12]

###### 4.1.2 Positioning, assortment and launches
- FINPLAY 1.2 (M011-M020): benefit hierarchy test, good-better-best ladder, use-case landing sets, gifting proposition, launch demand probes, launch readiness gate, entry-product strategy, assortment gap proposals, US seasonal demand calendar, product sunset migration. [FINPLAY-US 1.2]
- FSOS: new-product launch scorecard (judge on margin, returns, acquisition efficiency, repeat intent). [FSOS §3.5 p8]

###### 4.1.3 Creative as the growth engine (creative, copy, video)
- FINMAP: winning-creative repository (every ad with spend/CTR/CPA/GPP); creative decomposition (hook/headline/visual/offer/proof/CTA/format); hypothesis-ranked briefs; low-fidelity variation factory; **resolution ladder** (720p/small first, only human-ticked winners rendered full-res); copy/headline bank (5-10 variants); fatigue detection (frequency, CTR decline, CPM rise); format expansion (feed/story/reel/catalogue). [FINMAP §1.1 p4]
- FSOS 3.3 (21): adds hook library by customer state, offer-creative congruence test, creator asset performance library, creative cost capitalisation view, UGC proof mining, product-demo variation tests, price shown vs hidden, benefit vs specification, UGC vs polished, static vs motion, social-proof variation, production QA agent, asset resizing/versioning agent, creative learning journal. [FSOS §3.3 p6-7]
- FINPLAY 1.3 creative production system (M021-M030: asset intake and naming, winner-and-loser library, element tagging, hypothesis-ranked briefs, low-cost concept screening, placement adaptation, fatigue diagnosis, proof and rights checks, creative diversity board, learning journal) and 1.4 copy/video/message testing (M031-M040: opening hook, demo sequence, problem-vs-outcome, proof format, price transparency, short-vs-long copy, offer wording, video pacing, market-language adaptation, creative-to-page congruence). [FINPLAY-US 1.3-1.4]
- USOPP §12 (10; vis 4.6 / lever 4.1): winning-creative repository is a top-10 item (#10, 5.0). [USOPP §12 p10-11]

###### 4.1.4 Paid media and media buying (grows revenue and protects margin)
- FINMAP: campaign structure cleanup; audience architecture (lookalikes from high-GPP buyers; exclude recent buyers, RTO refusers, high-return customers); value-based bid rules by segment (age, city, device, pincode, time); profit-weighted budget allocation ("4x ROAS, negative GPP" caught); daily scale/kill/refresh rules; new-channel pilots with written pass/fail; incrementality/holdouts; anomaly alerts within the hour. [FINMAP p5]
- FSOS 3.2 (22): adds inventory-aware suppression and boost, profit-weighted audience values, high-GP lookalike seeds, downstream-quality exclusions, geo steering, daypart economics, audience saturation monitor, marginal CAC curve, new-customer-only reporting, retargeting incrementality guardrail, branded search cannibalisation test, bid strategy experiment library, budget pacing agent, media anomaly agent, ad-stock alignment, media-profit feedback loop. [FSOS §3.2 p5-6]
- FINPLAY 1.5 (M041-M050): campaign structure audit, prospecting-vs-retargeting split, high-contribution customer seeds, suppression freshness, landing destination selection, creative-audience matching, new-channel learning budget, ZIP-code service-aware growth, reactivation advertising. [FINPLAY-US 1.5]
- USOPP §11 (10; vis 3.3 / lever 4.4). [USOPP §11 p9-10]
- Tests listed: persona A/B; occasion vs problem angle; hook vs hook; static vs carousel; price shown vs hidden; broad vs interest; cost-cap vs lowest-cost; Advantage+ vs manual; segment bid caps; dayparting; LAL from high-GPP vs all buyers. Dashboards: acquisition board (nGPP, CAC, MER, % spend on positive-GPP campaigns), creative velocity/win-rate, geo profitability. [FINMAP p5]

###### 4.1.5 Search, Shopping and marketplace demand
- FINPLAY 1.6 (M051-M060): commercial search segmentation, search-term waste queue, feed attribute completeness, Shopping title experiments, feed-to-store consistency, margin-based product groups, marketplace listing repair, US marketplace advertising economics, channel offer consistency, marketplace acquisition quality. [FINPLAY-US 1.6]
- FINMAP: marketplace listing quality and price parity. [FINMAP p5] FSOS: feed title/taxonomy optimisation. [FSOS §3.5 p8]

###### 4.1.6 Organic search, content and AI discovery (AEO)
- FINMAP: SEO on commercial pages, technical hygiene, category pages above products; **AEO** (structure product data, FAQs, comparison pages so ChatGPT/Gemini/Perplexity can cite the brand; "almost no brand is here yet"); content engine on buying questions with a sub-agent tracking which posts bring buyers. [FINMAP p5]
- FSOS 3.6 (12): commercial keyword map, category/collection strategy, technical SEO, product structured data, content refresh engine, AEO readiness, buying-guide content, programmatic content guardrails, internal-link profit routing, content-to-inventory sync, digital PR map, search-to-PDP feedback. [FSOS §3.6 p8]
- FINPLAY 1.7 technical and commercial SEO (M061-M070) and 1.8 content, authority and AI discovery (M071-M080, incl. AI referral and mention sampling, scaled-content quality gate). Correction: no report should promise AI recommendations; Google states no special AI schema is required. [FINPLAY-US 1.7-1.8] [FINPLAY-US corrections R4]
- USOPP §22 (9; vis 3.2 / lever 4.1). [USOPP §22 p19-20]

###### 4.1.7 Organic social and community
- FINPLAY 1.9 (M081-M090): social content pillar map, organic concept scouting, buying-intent conversation queue, community question digest, customer story pipeline, live demonstration trials, social shopping path audit, launch community activation, advocacy participation design, conversation outcome tagging. [FINPLAY-US 1.9]
- FINMAP: organic social with buying-intent DMs/comments routed to sales. [FINMAP p5] USOPP: community/advocacy flywheel (#177, DFY). [USOPP §15 p14]

###### 4.1.8 Creators, affiliates, referral and partnerships
- FINMAP: influencer outreach by audience fit, fit scoring, outreach + follow-up automation, GPP per creator, kill what doesn't pay. [FINMAP p5]
- FSOS 3.7 (10): creator discovery/fit scoring, research-derived creator briefs, outreach pipeline, usage-rights economics, affiliate incrementality scoring, affiliate payout by contribution, partnership opportunity map, sample seeding ROI, creator-to-media feedback, referral economics. [FSOS §3.7 p8-9]
- FINPLAY 1.10 (M091-M100) incl. commission margin bands, creator portfolio reallocation, complementary-brand bundles. [FINPLAY-US 1.10]
- USOPP §23 (7; vis 3.1 / lever 4.1): brief generation from research (#12, 4.6), creator asset performance library (#17, 4.6). [USOPP §23 p20-21]

###### 4.1.9 Conversion rate -- speed, landing pages, CRO
- FINMAP: site speed (WebP/AVIF, dead-app/script removal, lazy-load, font/script deferral, third-party tag budget, verified on mid-range Android) -- "often the single biggest visible win"; above-the-fold clarity; continuous CRO backlog (one sub-agent per test, sized to traffic); PDP rewrite; on-site search; trust and risk-reversal; checkout friction audit; payment-failure recovery; address validation; personalised landing. Tests: WebP vs original, app removal, hero image vs video, reviews above vs below fold, guest checkout, coupon field visible vs hidden, delivery date shown. [FINMAP §1.2 p5-6]
- FSOS 3.4 (25): above-the-fold, CRO backlog, low-traffic big-swing policy, message-match landing pages, personalised landing, sticky purchase controls, social proof placement, trust system, navigation/collection findability, on-site search, mobile speed, image compression, dead app removal, third-party tag governance, theme audit, real-device QA, shipping-cost visibility, delivery-date display test, coupon-field test, cart threshold progress, checkout field reduction, express wallet placement, payment failure recovery, address validation, checkout upsell discipline. [FSOS §3.4 p7]
- FINPLAY 1.11 store speed and landing conversion (M101-M110, incl. accessibility purchase-path review). [FINPLAY-US 1.11]
- USOPP §7 website speed (8; vis 4.8 / lever 3.6) and §8 landing pages & conversion (10; vis 3.8 / lever 4.4; above-the-fold clarity is #1 overall). [USOPP §7-8 p6-7]

###### 4.1.10 Catalogue, merchandising and product pages
- FSOS 3.5 (15): top-SKU image refresh, product data completeness, PDP rewrite, variant clarity, margin-aware ranking, bundle discovery from baskets, feed title/taxonomy, dead-SKU rationalisation, launch scorecard, back-in-stock capture, preorder/backorder merchandising, comparison module, margin-aware recommendations, return-risk content flags, internal inventory-health badges. [FSOS §3.5 p7-8]
- FINPLAY 1.12 (M111-M120): high-value page refresh, variant clarity, fit and compatibility aids, review placement, site search synonyms, search result ranking, collection navigation, merchandising profitability, substitute recommendations, new-product page learning. [FINPLAY-US 1.12]
- USOPP §9 (10; vis 3.9 / lever 4.2). FINMAP sequence starts with "Day 1 -- catalogue images (top 50)". [USOPP §9 p7-8] [FINMAP §5.3 p14]

###### 4.1.11 Cart, checkout, payments and fraud balance
- FINPLAY 1.13 (M121-M130): total-price transparency, guest checkout, card and digital-wallet checkout, payment failure recovery, US address and serviceability validation, cart persistence, checkout error monitoring, assisted product selection, conversation recovery, buy-now-pay-later economics (US) / conditional COD design (GL). [FINPLAY-US 1.13]
- USOPP §10 (8; vis 4.1 / lever 4.2): checkout friction audit (#5, 5.0), shipping-cost surprise reduction (#28), express wallet placement (#40, DFY), fraud/chargeback risk scoring, payment failure recovery, checkout upsell discipline, address validation, high-risk order verification. [USOPP §10 p8-9]

###### 4.1.12 Order value (AOV / basket economics)
- FINMAP 1.3: bundles from co-purchase data priced on attach probability x unit margin; threshold/free-gift/free-shipping threshold tuned to order margin; thank-you-page upsell; cross-sell sequencing ("bought A, offer B after N days"); volume tiers / FBT; checkout upsell discipline. Dashboards: AOV, GP/order, attach rate, bundle GP. [FINMAP §1.3 p6]
- FINPLAY 1.14 (M131-M140): co-purchase bundle discovery, complement recommendation, premium upgrade, quantity pack, build-your-own bundle, cart cross-sell placement, post-purchase add-on, reorder convenience, service/accessory packaging, basket margin guard. [FINPLAY-US 1.14]

###### 4.1.13 Lifecycle CRM -- pre-purchase (lead capture, abandonment)
- FINPLAY 1.15 (M141-M150): capture timing, non-discount signup value, welcome education, preference capture, browse abandonment, cart recovery, checkout-specific recovery, back-in-stock messaging, price/offer interest alerts, US email and SMS orchestration. [FINPLAY-US 1.15]
- USOPP §14 email, SMS & lifecycle CRM (11; vis 3.8 / lever 4.5): cart abandonment (#3) and checkout abandonment (#4) both 5.0; welcome series (#32). [USOPP §14 p12-13]

###### 4.1.14 Transactional and post-purchase experience
- FINPLAY 1.16 (M151-M160; financial line "gross revenue and future retention"): order confirmation clarity, pre-dispatch education, shipping milestone updates, US shipping-promise exception handling (FTC Mail Order Rule), parcel delivery exception recovery, arrival check-in, product adoption sequence, review request timing, packaging-to-digital journey, transactional vs promotional message controls (CAN-SPAM). [FINPLAY-US 1.16]

###### 4.1.15 Purchase frequency -- retention, loyalty, subscription
- FINMAP 1.4: every lifecycle flow tested forever (abandoned cart 3 touches WhatsApp-first, browse/checkout, welcome, post-purchase, replenishment, win-back by lapse stage, VIP no-discount); purchase-sequence personalisation ("what people like you actually did"); second-order acceleration (first 30-90 days); replenishment timed to consumption; channel orchestration and WhatsApp quality rating; loyalty/referral only if incremental; cohort profitability. Dashboards: repeat rate, time-to-second-order, 90/180-day GP, flow revenue/recipient, deliverability. Tests: send at 30 min vs 2 h; WhatsApp vs email first; discount vs none; sequence cross-sell vs generic; review ask day 3 vs 7. [FINMAP §1.4 p6]
- FSOS 3.8 (22): cart, checkout and browse abandonment; welcome; post-purchase education; cross-sell sequencing; replenishment; second-order acceleration; win-back 60/120/240 days; VIP; deliverability; channel orchestration; promo calendar governance; discount necessity model; product-use milestone messaging; review request optimisation; referral ask timing; churn/lapse risk score; subscription suitability; loyalty ROI audit; cohort-specific offer ladder (reminder -> benefit -> bundle -> incentive); lifecycle holdouts. [FSOS §3.8 p9-10]
- FINPLAY 1.17 (M161-M170): second-order acceleration, purchase-sequence recommendations, consumption-based replenishment, lapse-stage win-back, VIP service benefits, loyalty reward economics, subscription suitability, subscription flexibility, failed renewal recovery, feedback-to-retention loop. [FINPLAY-US 1.17]
- USOPP §15 retention, loyalty & referral (8; vis 2.8 / lever 4.2 -- lowest visibility domain). [USOPP §15 p13-14]

###### 4.1.16 Customer support and assisted conversion (revenue-side CX)
- USOPP §18 (8; vis 4.1 / lever 3.8): pre-purchase question capture (#44), reason-code discipline (#46), sales-assist routing, abandoned conversation follow-up, support-to-content loop, escalation/SLA alerts, conversation-to-order attribution, support quality calibration. [USOPP §18 p16]
- FSOS: support diagnostic; support reason-code ledger; variable support deflection; support quality calibration. [FSOS §1.1 p3] [FSOS §2.1 p4] [FSOS §3.13 p12] [FSOS §3.15 p13]

##### 4.2 Line 2 -- Discounts, coupons, promotions (contra-revenue)
- Goal: offers that lift the bottom line, not just the top; model the trade-off before running. [FINMAP Line 2 p6]
- FINMAP: discount leakage audit (codes, stacking, affiliate coupons, employee codes, refunds -- "usually finds real money month one"); structural offers in preference order (gift-with-purchase > % off; free shipping over threshold > blanket discount; bundle discount > sitewide; prepaid-only discount; first-order vs repeat discipline); margin-break / buy-more-save-more above a CM floor; **cut-cost-vs-volume simulator** (CM bridge before an offer; also "if COGS rises Y%"); promo incrementality and post-promo dip; elasticity tests; coupon-field placement; dynamic markdown for aged stock. Dashboards: discount rate, leaked GP, promo incrementality, CM after promo. [FINMAP Line 2 p6-7]
- FSOS 3.9 (15): adds free-gift economics, volume-break optimisation, segmented promo eligibility, new-customer offer guardrail (cap by 90-day GP), returning-customer no-discount tests, free-shipping threshold, affiliate coupon governance, markdown ladder, price sensitivity tests, offer architecture library (bundle, threshold, gift, warranty, financing, shipping, scarcity). [FSOS §3.9 p10]
- FINPLAY 1.18 (M171-M180; owner commercial/finance lead): discount leakage audit, margin-break quantity tiers, gift-vs-discount test, free-shipping threshold, bundle discount allocation, selective incentive eligibility, price-volume break-even tool, price elasticity experiments, promotion pull-forward analysis, markdown-vs-bundle choice. [FINPLAY-US 1.18]
- USOPP §19 pricing, promotions & margin management (10; vis 3.3 / lever 4.5): discount leakage audit (#6) and SKU contribution-margin map (#9) both 5.0. [USOPP §19 p17]

##### 4.3 Line 3 -- Returns, RTO, refunds, cancellations (hits margin twice)
- FINMAP (India-first): RTO risk scoring per COD order (pincode history, address quality, past behaviour, phone validity) with verification tiering (low sails, medium WhatsApp confirm, high prepaid-only); WhatsApp/IVR order confirmation (unconfirmed orders held; confirmed event goes to Meta); prepaid nudges and partial COD; **return-reason taxonomy closed loop** (sizing -> size chart, colour -> photo, "not as described" -> description, damaged -> packaging/courier; weekly "what changed because of returns"); SKU-level return risk; acquisition-source return quality (to media buying and CAPI); pre-return rescue (fit help, exchange-first, store credit); NDR follow-up within the hour. Tests: confirmation message A/B; confirm within 5 vs 30 min; partial COD token 49 vs 99; return fee on/off; exchange-first vs refund-first. [FINMAP Line 3 p7]
- FSOS 3.10 (16): return reason taxonomy, SKU return-risk score, acquisition-source return quality, expectation-gap detection (ad/PDP claims vs return reasons), pre-return rescue, exchange-first economics, return-policy experimentation, restockability grading, reverse-logistics routing, refund status communication, fraud/chargeback risk scoring, chargeback evidence automation, dispute-prevention alerts, refund/chargeback feedback to acquisition, cancellation root-cause loop, quality/defect lot tracing. [FSOS §3.10 p10-11]
- FINPLAY 1.19 (O001-O008; owner CX/operations): return reason taxonomy, return-to-promise feedback, exchange and assistance options, return disposition routing, return freight optimisation, refund reconciliation, policy economics experiment, pre-fulfilment cancellation prevention. [FINPLAY-US 1.19]
- USOPP §17 (8; vis 3.5 / lever 4.4): return reason taxonomy #8 (5.0). [USOPP §17 p15-16]

##### 4.4 Line 4 -- Chargebacks and payment loss (reduce, fight, feed back)
- FINMAP: chargeback/fraud risk scoring (step-up only where expected loss justifies friction); dispute evidence automation (delivery proof + communication log per dispute); chargeback-heavy pincodes/methods into bid rules and CAPI; prevention comms (clear billing descriptor, proactive updates); refund-fast where cheaper. Dashboards: chargeback rate by area/method, win rate, false-positive rate, net GP after chargebacks. [FINMAP Line 4 p8]
- FINPLAY 1.20 (O009-O016; owner payments/risk): dispute intake and deadlines, evidence pack assembly, fight-or-accept economics, descriptor and receipt clarity, refund-before-dispute, risk verification calibration, source-quality loss board, recovery accounting loop. [FINPLAY-US 1.20]
- Dispute workbench tool (reason codes, deadlines, evidence -> evidence draft + expected net recovery; decision: fight, resolve or accept). [FINPLAY-US tools]

##### 4.5 = Net revenue -- quality and reconciliation
- "Net revenue = the honest top line ... most brands never see this number cleanly; the OS makes it the default." [FINMAP p8]
- FSOS 3.11 (10): retained-revenue dashboard (booked -> fulfilled -> delivered -> refunded -> retained by source), gross-to-net bridge, settlement-adjusted revenue, revenue recognition exception queue, return-adjusted CAC, source quality score, promo-quality score, first-order product quality score (180d GP by first SKU), revenue anomaly monitor, owner gross-to-net narrative. [FSOS §3.11 p11]

##### 4.6 Line 5 -- Landed COGS -> Gross profit (sourcing to inbound in scope)
- FINMAP: landed cost truth per SKU (product + inbound freight + duty + brokerage + inspection + packaging + inward handling) -- "the margin on most brands' sheets is wrong without it"; supplier price variance; supplier scorecard (price over time, lead time promised vs actual, defect/return rate, MOQ, terms, fill rate); alternative-supplier scan + renegotiation prep brief; MOQ economics; RFQ normalisation; inbound freight mode (parcel/LTL/air/ocean), consolidation, lane rate benchmark; defect feedback by lot; input-cost/raw-material/FX watch with margin-at-risk monitor, pricing bands, silent levers before visible price hikes, hedging decision support (visibility only, not advice); packaging/dim-weight audit; dual-source/concentration risk map. This line produces the "true margin per product" Lines 1 and 2 depend on. [FINMAP Line 5 p8-9]
- FSOS 3.12 (20): adds BOM cost monitor, order-size optimisation, lead-time variability buffer, inbound loss/damage tracking, purchase timing decision support, cost-change attribution (COGS bridge: price, mix, freight, FX, duty, waste, supplier). [FSOS §3.12 p11-12]
- FINPLAY 1.21 (O017-O024; owner procurement/finance; line "COGS and gross profit; inventory before sale"): BOM and landed-cost ledger, supplier quote comparison, negotiation preparation, MOQ and bulk purchasing simulator, material and FX exposure board, cost-shock response ladder, inbound mode and consolidation, supplier quality and resilience. [FINPLAY-US 1.21]
- USOPP §21 sourcing, procurement & inbound logistics (10; vis 3.3 / lever 4.2): landed-cost truth by SKU #21. [USOPP §21 p18-19]

##### 4.7 Line 6 -- Variable selling costs -> Contribution margin before marketing (CM1)
- FINMAP: actual shipping cost per order allocated into GPP; carrier benchmark by weight/zone/service/surcharge; carrier performance by lane; dynamic service selection; split-shipment control; free-shipping threshold on order margin; payment/gateway fee optimisation (UPI cheaper than cards, MDR negotiation, COD-fee reduction); pick-pack cost and packaging rationalisation to drop a weight slab; delivery-promise accuracy. Dashboards: shipping cost/order, CM/order pre-marketing, fees % revenue, on-time rate. [FINMAP Line 6 p9]
- FSOS 3.13 (15): adds dimensional-weight audit, free-shipping subsidy map, exception recovery, payment fee routing, payment processor rate audit, soft-decline recovery, variable support deflection, 3PL pick-pack audit, affiliate/creator commission true-up. [FSOS §3.13 p12]
- FINPLAY 1.22 (O025-O032; owner operations): US parcel total-cost comparison (USPS/UPS/FedEx/regional, ZIP zones), service routing proposals, dim-weight and surcharge audit, split-shipment reduction, pick-pack productivity, payment cost optimisation, shipping claim recovery, variable service cost allocation. [FINPLAY-US 1.22]
- USOPP §16 shipping, fulfilment & delivery (8; vis 3.4 / lever 4.2): free-shipping threshold optimisation #18. [USOPP §16 p14-15]

##### 4.8 Line 7 -- Marketing -> Contribution margin after marketing (CM2)
- FINMAP: the same spend as a cost line; profit-aware allocation (spend follows GPP), marginal-CAC discipline, geo/segment steering, kill low-GPP campaigns; the line that matters most = CM per order after marketing, per order/SKU/campaign/channel. Dashboards: CM-after-marketing by order/SKU/campaign/channel, % spend on positive-CM campaigns, marginal GP per rupee. [FINMAP Line 7 p9]
- FSOS 3.14 "= Contribution margin -- the main operating decision layer" (14): true GP per order/SKU/campaign, new-customer GPP, 90/180-day GP payback, marginal contribution dashboard, break-even CAC calculator, break-even ROAS by SKU, MER overlay, paid/organic mix economics, contribution by channel, by geography, by cohort, spend guardrails, scenario allocator (under stock and cash constraints), daily profit narrative. [FSOS §3.14 p12-13]
- FINPLAY 1.23 marketing measurement and attribution (M181-M190): browser/server event health, conversion value dictionary, attribution comparison board, new-customer identity controls, mature acquisition cohorts, retargeting holdouts, brand-search incrementality, owned-channel holdouts, supported conversion adjustments, experiment validity monitor. 1.24 marketing cost allocation and scale decisions (M191-M200): fully loaded marketing ledger, marginal budget response, bounded scale-pause rules, inventory-aware media pacing, cash-aware acquisition ceiling, creative production economics, CRM delivery cost optimisation, agency and vendor fee audit, spend anomaly detection, marketing portfolio review. [FINPLAY-US 1.23-1.24]

##### 4.9 Line 8 -- Operating expenses -> Operating profit / EBITDA -> Net profit
- FINMAP: software/app/subscription audit (cost, last used, function; dead apps also slow the store); capability overlap map, tool ROI scorecard, renewal calendar, usage-based cancellation queue, tech-stack cost per order; integration reliability monitor; people/workflow leverage (role workbenches, approval inbox, decision log, daily action summary, automated handoffs) so opex per order falls; "AI as capex, not subscription" (FINPLAY corrects this, see §5.9). North star restated: even when revenue is flat, are GP and CM rising. [FINMAP Line 8 p9-10]
- FSOS 3.15 (18): SaaS spend inventory, usage-based cancellation queue, capability overlap map, tool ROI scorecard, vendor renegotiation calendar, integration reliability monitor, approval inbox, automated handoffs (research -> creative, returns -> catalogue, margin -> media, stock -> CRM), daily role action summary, SOP playbooks, training from account history, support quality calibration, exception-based operations, contract/renewal anomaly alerts, cost-per-order overhead tracker, warehouse labour productivity, return processing productivity, profit-linked team scorecards. [FSOS §3.15 p13]
- FINPLAY 1.25 (O033-O040; line "operating expenses, D&A, finance expense and taxes"): software and renewal register, workflow labour productivity, **agent run-cost controls**, integration reliability board, fixed-capacity utilisation, expense and accrual close, asset and financing expense bridge, US entity-tax and profit bridge. [FINPLAY-US 1.25]
- USOPP §24 team workflow, adoption & incentives (10; vis 3.8 / lever 4.5; approval inbox #2 = 5.0) and §25 software stack & operating cost (6; vis 4.2 / lever 3.3). [USOPP §24-25 p21-23]

---

#### 5. Balance sheet -- where cash goes to hide

Framing: in D2C the heavy lines are inventory, receivables (COD float, settlements), payables (supplier terms = free financing) and intangible assets the OS builds. [FINMAP Part 3 p11] Dominant questions: cash availability, processor/marketplace settlements, inventory productivity, supplier terms, refund/chargeback reserves, financing needs. [FSOS §4 p14] Assets = liabilities + equity; ledger balances for reporting, reconciled operating subledger for decisions; releases of cash are not equal profit. [FINPLAY-US Stage 2]

##### 5.1 Cash and restricted cash
- FSOS 4.1 (7): minimum liquidity floor (payroll, taxes, committed POs, ad commitments, volatility), cash-by-bank/processor view, restricted cash/reserve tracking, excess cash rule, daily cash anomaly alerts, cash concentration risk, treasury calendar. [FSOS §4.1 p14]
- FINPLAY 2.1 (B001-B006): bank-to-payout reconciliation, settlement aging, reserve release tracking, wholesale receivables queue, US marketplace deduction recovery (GL: COD remittance ledger), cash concentration visibility. [FINPLAY-US 2.1]

##### 5.2 Receivables and float (earned but not held)
- FINMAP (India): COD cash-in-transit with courier until remittance; marketplace payout reconciliation and aging (Amazon/Flipkart); gateway settlement timing T+1 vs T+2; **prepaid share as the cleanest balance-sheet win** (collapses receivable to zero). Dashboards: days of sales in COD float, unremitted COD, settlement variance. [FINMAP §3.2 p11]
- FSOS 4.2 (8): processor settlement aging, marketplace receivable aging, chargeback reserve forecasting, B2B/wholesale receivable aging, failed payout recovery, settlement fee audit, receivable concentration, expected-cash date per order. [FSOS §4.2 p14]
- US correction: a successful card/wallet payment is not cash in the bank (processor holds/reserves); BNPL customer instalments need not equal merchant payout schedule. [FINPLAY-US corrections] [FINPLAY-US US assumptions]

##### 5.3 Inventory -- the biggest trapped-cash line
- FINMAP 3.1: SKU demand forecast (history, planned ad spend, seasonality, festivals, current ad momentum -- "a SKU winning in ads this week needs stock in three weeks"); reorder point/safety stock from lead-time variability; inventory-aware ad suppression/boost (under N days of stock -> buyer warned, spend shifts on approval); aged-inventory action queue (bundle, discount, marketplace clearance, stop reorder; cash freed reported); dead-SKU rationalisation / assortment productivity; stockout cost estimation; pre-order/backorder, launch buy and seasonality planning. Dashboards: turns, days of inventory, cash tied in stock (one owner number), stockout days on top-20, forecast error. [FINMAP §3.1 p11]
- FSOS 4.3 (20): inventory truth by state, SKU demand forecast, reorder point, days-of-cover, aged queue, stockout cost, assortment productivity, inventory-aware media control, launch buy, seasonality/event, preorder/backorder, in-transit visibility, returned-inventory recovery, write-down risk, MOQ cash impact, supplier lead-time risk, multi-location rebalancing, dead-SKU stop-reorder rule, ABC/XYZ segmentation, inventory financing suitability. [FSOS §4.3 p14-15]
- FINPLAY 2.2 availability and throughput (B007-B012: sellable-stock truth, demand forecast with marketing inputs, lead-time-based reorder points, allocation across locations, hero-SKU stockout economics, launch and seasonal buy sizing) and 2.3 recovery and valuation (B013-B018: aged-stock action queue, expiry/obsolescence watch, return-to-stock acceleration, US inventory valuation review (LCNRV/LCM), assortment capital productivity, shrink and variance investigation). [FINPLAY-US 2.2-2.3]
- Ratios: inventory turns = COGS / average inventory; GMROI = GP / average inventory at cost. [FINPLAY-US connecting]
- USOPP §20 inventory, assortment & demand planning (9; vis 3.0 / lever 4.3). [USOPP §20 p18]

##### 5.4 Prepaids, deposits and other operating assets
- FSOS 4.4 (5): prepaid SaaS/contract inventory, supplier deposit tracker, ad-platform prepaid balance, insurance/prepaid opex schedule, recoverable deposit register. [FSOS §4.4 p15]
- FINPLAY 2.4 (B019-B024): supplier deposit milestones, prepaid service utilisation, US supplier credits and claims register, equipment utilisation and payback, US software capitalisation evidence (ASU 2025-06), operating knowledge register. [FINPLAY-US 2.4]

##### 5.5 Payables and working capital (supplier terms as free financing)
- FINMAP 3.3: payment terms modelled (deposit %, net-30/60, early-pay discount vs cash need); MOQ vs cash; reorder timing aligned to payables ("sell before you pay"). Dashboards: DPO, financing cost/benefit of terms, deposit exposure. [FINMAP §3.3 p11]
- FSOS 4.5 (12): AP aging by strategic importance, terms normalisation, terms/working-capital analysis, early-pay discount optimiser (annualised return vs cash value), supplier payment calendar, PO-to-invoice match, duplicate invoice detection, freight accrual reconciliation, vendor concentration risk, renegotiation trigger, dynamic payment priority, AP anomaly agent (bank-detail change fraud). [FSOS §4.5 p15]
- FINPLAY 2.5 (B025-B030): three-way invoice matching, supplier term scenarios, payment scheduling, refund and loyalty obligations, gift card and preorder ledger, US sales-tax and accrual calendar. [FINPLAY-US 2.5]
- Correction: ordinary trade credit is operating working capital, not automatically financing cash flow. [FINPLAY-US corrections R1]

##### 5.6 Customer obligations, reserves, taxes and accruals
- FSOS 4.6 (8): returns reserve model, chargeback reserve model, gift card/store credit liability, loyalty reward liability, tax payable dashboard (sales tax/GST/VAT), accrued marketing liability, accrued fulfilment liability, customer compensation reserve. [FSOS §4.6 p15-16]

##### 5.7 Debt, equity and working-capital financing
- FSOS 4.7 (8): working-capital line utilisation (bridge timing, not subsidise negative unit economics), inventory financing comparison, debt covenant monitor, debt maturity calendar, interest allocation to working-capital decisions, borrow-vs-discount decision, processor advance / merchant cash analysis (effective APR), debt-funded growth guardrail. [FSOS §4.7 p16]
- FINPLAY 2.6 (B031-B036): debt and lease register, covenant headroom monitor, working-capital cycle board, growth funding requirement, equity movement reconciliation, distribution capacity review. [FINPLAY-US 2.6]

##### 5.8 The cash conversion cycle -- the synthesis
- FINMAP: CCC = DIO + DRO - DPO; compress so the same rupee funds more cycles (faster turns cut DIO, prepaid share cuts DRO, better terms lift DPO); dashboard "rupees freed per day of CCC compression". [FINMAP §3.4 p12]
- FINPLAY (corrected formulas): DIO = avg inventory / COGS x days; DSO = avg receivables / corresponding sales x days; DPO = avg trade payables / credit purchases x days; CCC = DIO + DSO - DPO. Separate card/wallet and BNPL settlement days, marketplace payout days, wholesale DSO (GL: also COD remittance days). One day of DIO releases daily COGS, DSO daily sales, DPO daily credit purchases -- different bases; do not multiply total CCC change by daily revenue. Worked: COGS and credit purchases $730k, sales $1.46m -> -5 DIO ~$10k, -2 DSO ~$8k, +3 DPO ~$6k = $24k working-capital cash (not profit); a write-down alone releases no cash. [FINPLAY-US connecting]
- FSOS 5.2 CCC bridge and working-capital sensitivity (+/-5 days). [FSOS §5.2 p17]

##### 5.9 Intangible assets the OS accumulates (and the correction)
- FINMAP: playbook (every test written back), creative winners library, research/VoC language bank, customer/COGS/landed-cost ledger (data moat), trained skills/models and harnesses -- "capex that compounds"; run-rate falls while output rises as model prices drop. [FINMAP §3.5 p12]
- FINPLAY correction: useful knowledge is not automatically a recognised asset; track operating knowledge as a management capability register; US: assess software/implementation costs under ASU 2025-06 (internal-use software); GL: IAS 38. AI setup does not become capex merely because it benefits future periods. [FINPLAY-US corrections R2] [FINPLAY-GL corrections R2]

---

#### 6. Cash flow -- profit is opinion, cash is fact

Framing: a brand can be profitable and still choke on timing (inventory bought before COD remits). [FINMAP Part 4 p13] Advertising paid today, inventory months earlier, customer cash days later, refunds/chargebacks after the sale. [FSOS §5 p17] Ordinary inventory purchases, advertising and supplier payments are operating cash flows, not investing. [FINPLAY-US Stage 3 R1]

##### 6.1 Operating cash flow and liquidity control
- FINMAP 4.1: CCC compression = biggest OCF lever; prepaid share up; faster COD remittance and courier reconciliation; discount/return/chargeback reduction; growth-vs-cash tension (model collection lag of acquisition). Dashboard: rolling 13-week cash forecast, OCF trend, runway. [FINMAP §4.1 p13]
- FSOS 5.1 (11): 13-week cash forecast, daily cash nowcast, order-to-cash curve (by payment method/channel/processor), refund/chargeback cash curve, inventory purchase calendar, marketing cash calendar, tax calendar, payroll/opex calendar, debt service calendar, liquidity alert bands (green/amber/red with predefined actions), cash forecast narrative. [FSOS §5.1 p17]
- FINPLAY 3.1 (C001-C006): rolling thirteen-week forecast, US payment receipt timing model, inventory payment timing, marketing cash timing, returns and dispute cash reserve, profit-to-cash bridge. [FINPLAY-US 3.1]

##### 6.2 Marketing and growth cash discipline
- FSOS 5.3 (8): cash-aware media throttle, payback-window budgets, promotion cash test, prepaid incentive economics, subscription cash profile, creator payment term optimiser, affiliate payout timing (after return windows), campaign-to-inventory funding link. [FSOS §5.3 p17-18]
- FINPLAY 3.2 liquidity resilience (C007-C012): downside scenario engine, **scale affordability gate**, cash release verification, commitment calendar, emergency action scenarios, cash buffer calibration. [FINPLAY-US 3.2]
- FINMAP 4.4 cash diagnostic: cash-trap map; 13-week forecast with festival and launch spikes; **"can we afford to scale?" gate** (does the next rupee of ad spend have the runway to survive its collection lag). [FINMAP §4.4 p13]

##### 6.3 Inventory cash flow
- FSOS 5.4 (10): buy quantity cash optimiser, deposit negotiation model, freight speed vs cash model, aged stock liquidation ladder (bundle, marketplace, outlet, wholesale, markdown), dead stock stop-buy control, supplier consolidation vs diversification cash view, seasonal build funding plan, inventory financing payoff schedule, return inventory cash recovery, inventory-to-marketing handoff. [FSOS §5.4 p18]

##### 6.4 Investing cash flow
- FINMAP 4.2: inventory purchases sized by forecast and CCC; AI as capex with payback curve; reinvest freed cash into highest-GPP levers. (FINPLAY reclassifies inventory as operating cash and corrects AI-as-capex.) [FINMAP §4.2 p13]
- FSOS 5.5 (6): automation investment ROI (setup, run-rate, labour saved, GP uplift), warehouse equipment ROI, storefront rebuild ROI, data infrastructure ROI, product tooling/mould ROI, capex approval queue. [FSOS §5.5 p18]
- FINPLAY 3.3 (C013-C018): equipment investment case, build-versus-buy appraisal, qualifying development cash plan, asset disposal recovery, investment stage gates, post-investment audit. [FINPLAY-US 3.3]

##### 6.5 Financing cash flow and capital allocation
- FINMAP 4.3: supplier terms as cheapest working capital; profit-share model as self-funding growth; underwriting inputs on tap (nGPP, payback, 90/180-day GP for lenders/investors). Dashboard: financing sources and cost of capital, self-funded growth ratio. [FINMAP §4.3 p13]
- FSOS 5.6 (7): funding need forecast, financing source comparison (bank line, term loan, supplier finance, inventory finance, equity, merchant advances), debt draw timing, refinancing alert, equity vs debt scenario, distribution/dividend guardrail, capital allocation scorecard (next dollar into acquisition vs inventory vs debt vs capex vs cash). [FSOS §5.6 p18-19]
- FINPLAY 3.4 (C019-C024): funding option comparison, drawdown and repayment planning, refinancing calendar, equity funding scenario, distribution cash schedule, US financing movement reconciliation. [FINPLAY-US 3.4]

##### 6.6 Scenario engine and risk management
- FSOS 5.7 (10): base/upside/downside cash scenarios; COGS shock; ad-cost shock; return-rate shock; processor hold; stockout; demand spike; supplier failure; promotion scenario; expansion/channel scenario. [FSOS §5.7 p19]

##### 6.7 Transactions across all three statements (teaching table) [FINPLAY-US connecting]
- Buy stock for cash (inventory up, cash down, operating outflow, no COGS yet); buy on trade credit (inventory + payables, no cash flow yet); sell $100 item with $60 cost (revenue, COGS, GP $40; operating receipt); processor withholds (receivable/reserve until payout); preorder $100 (cash + customer obligation; revenue on performance); restock a refund; write down obsolete stock (non-cash); pay for equipment (investing outflow, depreciation); borrow working capital (financing inflow); owner capital (financing inflow, not revenue).

---

#### 7. Connecting the statements -- metric tree / KPI hierarchy and guardrails

##### 7.1 Metric tree (10 layers) [FINMAP §5.1 p14] [USOPP Part VI p28]
- **North star**: gross profit $, contribution margin $, GPP, nGPP (USOPP: GP $, CM $, GP/order, GP/new customer -- "did the business keep more money after variable costs?").
- **Growth quality**: nGPP, 90/180-day GP, payback, repeat GP, return-adjusted revenue ("is growth high-quality enough to scale?").
- **Acquisition**: spend, CPM, CTR, CPC, CVR, CAC, marginal CAC, GP/spend ("are we buying profitable demand?").
- **Commerce**: session CVR, PDP CVR, ATC, checkout start/complete, AOV ("where does the journey leak?").
- **Retention**: second-order rate, time-to-second-order, revenue/recipient, GP/recipient, churn/lapse.
- **Quality/loss**: return, RTO, refund, chargeback, damage, cancellation ("how much apparent revenue disappears?").
- **Operations**: shipping cost/order, on-time, stockouts, inventory days, landed cost, defect rate.
- **Balance sheet and cash** (FINMAP only): cash tied in stock, CCC and parts, 13-week cash, prepaid share.
- **Learning speed**: tests/month, idea-to-live, time-to-significance, win rate, learning reuse.
- **Adoption**: weekly active users, approved actions, time saved, action closure, playbook usage.

##### 7.2 Guardrails
- ROAS stays a channel diagnostic, never the decision metric; GP uses a written, agreed formula that does not change month to month; tests that move conversion and downstream economics in opposite directions are decided on net contribution. [FINMAP §5.1 p14] [USOPP Part VI p28]
- No protected-class targeting; only platform-permitted, legally appropriate signals for bidding/personalisation. [USOPP Part VI p28]
- Guardrail monitor: a conversion win cannot ship if return rate, margin, cash or complaints deteriorate beyond limits. [FSOS §6.1 p20]
- Double counting: one initiative = one owner and one benefits record; a $5,000 return reduction is not simultaneously a $5,000 marketing, CX and finance win; overlap-adjusted benefits register tied to financial close. [FINPLAY-US connecting]

##### 7.3 Connected operating loops (evidence -> action -> profit effect -> cash effect -> linked IDs) [FINPLAY-US connecting]
- Misleading creative drives returns -> correct promise, test next cohort (M010, M040, O002, M185).
- Hero SKU will stock out -> pace demand, substitutes, review reorder (M119, M194, B008-B012, C008).
- Input costs rise -> compare supplier, BOM, offer, price responses (O017-O023, M171-M179, C003).
- Paid channel looks profitable on revenue -> attach landed cost, mature losses, full marketing cost (M181-M185, M191-M195, C004-C010).
- Customers do not buy twice -> adoption, next product, timing (M157, M161-M164, M188, C008).
- Slow inventory consumes capital -> recovery path, stop excess reorders (M180, B013-B018, C009).
- Good profit, poor cash -> reconcile working capital, renegotiate timing, stage growth (B001-B006, B026-B028, C001-C012).
- FSOS automated handoffs: research -> creative, returns -> catalogue, margin -> media, stock -> CRM. [FSOS §3.15 p13]

---

#### 8. Dashboards and control tower

##### 8.1 Owner dashboard (all three statements, one screen)
- FINMAP strips: P&L strip (GP, CM, GPP, nGPP, repeat GPP as trend lines); loss strip (return/RTO/chargeback rates, prepaid share); balance-sheet strip (cash tied in stock, inventory days, CCC); cash strip (13-week forecast, runway, "can we afford to scale"); top box always = three highest-value actions this week, sized in money, in sentences. Role views: media buyer (GPP, CAC, RTO by campaign, "which one is quietly losing money"), product (true margin, ad-cost share, return rate, stock days -- push/kill list), geography (GPP, RTO, chargebacks, courier by pincode). [FINMAP §5.2 p14]
- FINPLAY six connected views: profit waterfall; acquisition and demand; customer journey; product and service economics; working capital; liquidity and commitments. Each view tops with three decisions (what changed, money at stake, evidence range, action, owner, due date, confirming measure) + confidence strip. SKU/campaign drill-down columns: gross conversion value, net revenue, COGS, GP, gross margin, variable costs, CM1, marketing cost, CM2, new-customer share, return/chargeback rates, stock days, cash payback, allocated-cost labels and unattributed reconciliation row. [FINPLAY-US owner screen]

##### 8.2 FSOS control tower and agent architecture (20) [FSOS §6.1 p20]
- Owner control tower; P&L drilldown (price, volume, mix, discount, COGS, fulfilment, return, marketing effects); balance-sheet drilldown; cash-flow drilldown.
- Role workbenches: media buyer, CRM, merchandising, CX/returns, procurement, finance.
- Approval inbox (impact, risk, dependencies, owner, rollback); sub-agent watcher (narrow watcher per changed variable until evidence suffices); experiment significance gate; guardrail monitor; playbook memory; anomaly-to-action agent; narrative reporting agent; integration monitor; change log/rollback; access and risk controls.

##### 8.3 Master dashboard set (FSOS Appendix B, 14) [FSOS App B p22-23]
- Owner one-page; profit waterfall; media profit; creative learning; CRO funnel; lifecycle; SKU/merchandising; returns/quality; fulfilment; procurement; working capital; 13-week cash; experiment operating system; action/approval inbox.

##### 8.4 Decision tools (FINPLAY, 8) [FINPLAY-US tools]
- Bottleneck ranker; offer and margin simulator; input-cost exposure tool (BOM/FX; decision support, no derivative recommended); acquisition quality board; inventory throughput tool; cash scale gate; dispute workbench; experiment register.
- Initial product set: profit and diagnostic workspace; growth experiment workspace; acquisition/lifecycle quality workspace; inventory/cash workspace. [FINPLAY-US agents]

##### 8.5 Per-line dashboards named in FINMAP
- Acquisition board; creative velocity/win-rate; geo profitability; funnel CVR by step / PDP CVR by SKU / checkout completion / payment failure; AOV/GP-order/attach; repeat/time-to-second/90-180 GP/flow rev per recipient/deliverability; discount rate/leaked GP/promo incrementality/CM after promo; return and RTO by SKU/pincode/campaign/payment method + prepaid share; chargeback rate/win rate/false-positive/net GP; landed cost/SKU, margin variance, margin-at-risk, defect rate by supplier/lot; shipping cost/order, CM pre-marketing, fees %, on-time; CM-after-marketing; monthly software cost/apps used/opex %/integration uptime; inventory turns/days/cash in stock/stockout days/forecast error; COD float/unremitted/settlement variance; DPO/terms value/deposit exposure; CCC trend + money freed per day; 13-week cash/OCF/runway; capex vs freed cash/payback/run-rate curve; financing sources/self-funded ratio. [FINMAP p5-13]

---

#### 9. Test library (experiments named in the docs)

- Acquisition/creative: persona A/B; occasion vs problem angle; hook vs hook; static vs carousel; price shown vs hidden; broad vs interest; cost-cap vs lowest-cost; Advantage+ vs manual; segment bid caps on/off; dayparting (COD-heavy); LAL from high-GPP vs all buyers. [FINMAP p5] FSOS adds UGC vs polished, static vs motion, benefit vs spec, demo variations, social-proof modules, offer-creative congruence. [FSOS §3.3 p6-7] FINPLAY 1.4 message tests M031-M040. [FINPLAY-US 1.4]
- Conversion: WebP vs original; app removal vs keep; hero image vs video; reviews above vs below fold; guest checkout on/off; coupon field visible vs hidden; delivery date shown vs not. [FINMAP p6]
- AOV: bundle vs single; free gift vs % off; threshold X vs Y; thank-you upsell vs none. [FINMAP p6]
- Retention: send after 30 min vs 2 h; WhatsApp vs email first; discount vs none; sequence-based cross-sell vs generic; review ask day 3 vs 7. [FINMAP p6]
- Offers: gift vs discount; threshold vs flat %; prepaid-only discount on/off; band width vs conversion. [FINMAP p7]
- Returns/RTO: confirmation message A/B; confirm within 5 vs 30 min; partial COD token 49 vs 99; return fee on/off; exchange-first vs refund-first. [FINMAP p7]
- COGS: dual-source one high-volume SKU; order-size vs unit-price scenarios; pricing-band width vs conversion. [FINMAP p9]
- Holdouts: geo/audience/time holdouts, retargeting, branded search, lifecycle holdouts, owned-channel holdouts. [FSOS §3.2 p6] [FSOS §3.8 p10] [FINPLAY-US 1.23]
- **Measurement discipline** (FINPLAY): one primary economic outcome (e.g. CM1 per eligible session); define exposure/randomisation before launch; MDE, sample, horizon, loss cap set in advance (fixed-horizon or valid sequential); include cancellations/returns/chargebacks/costs; low traffic -> bigger changes + qualitative evidence; before/after = directional only; do not stack isolated lifts. [FINPLAY-US measurement]
- Standard opportunity card (implementation spec): ID/owner, decision, trigger, inputs (grain, fields, freshness, DQ gate), output, economics, execution (reviewer, scope, limits, rollback), proof (control, exposure unit, duration, sample, loss maturity, stop rules). Worked example M175 bundle discount allocation. [FINPLAY-US card]

---

#### 10. Functional departments / owners mapped to statement lines

| Department / role (FINPLAY owner) | Statement lines | FINPLAY groups (count) | FSOS sections / workbench | USOPP domains |
| --- | --- | --- | --- | --- |
| Growth/research lead | Gross revenue | 1.1 (10) | 3.1 | §13 research |
| Product marketing lead | Gross revenue | 1.2 (10) | 3.5 launch scorecard | -- |
| Creative lead; creative/copy lead | Gross revenue | 1.3, 1.4 (20) | 3.3 | §12 creative |
| Paid media lead | Gross revenue / CM2 | 1.5 (10) | 3.2; media buyer workbench | §11 paid media |
| Search/marketplace lead | Gross revenue | 1.6 (10) | 3.5 feeds | -- |
| SEO lead; content/SEO lead | Gross revenue | 1.7, 1.8 (20) | 3.6 | §22 organic/AEO |
| Social/community lead | Gross revenue | 1.9 (10) | -- | §15 community flywheel |
| Partnerships lead | Gross revenue | 1.10 (10) | 3.7 | §23 creators |
| Ecommerce/CRO lead; ecommerce lead | Gross revenue | 1.11, 1.13 (20) | 3.4 | §7 speed, §8 landing, §10 checkout |
| Merchandising lead; merchandising/growth lead | Gross revenue | 1.12, 1.14 (20) | 3.5; merchandising workbench | §9 catalogue |
| Lifecycle lead; lifecycle/CX lead; retention lead | Gross revenue, retention | 1.15, 1.16, 1.17 (30) | 3.8; CRM workbench | §14 CRM, §15 retention |
| Commercial/finance lead | Discounts, net revenue | 1.18 (10) | 3.9 | §19 pricing |
| CX/operations lead | Returns/allowances | 1.19 (8) | 3.10; CX/returns workbench | §17 returns, §18 support |
| Payments/risk lead | Chargebacks | 1.20 (8) | 3.10 | §10 fraud |
| Procurement/finance lead | COGS / GP | 1.21 (8) | 3.12; procurement workbench | §21 sourcing |
| Operations lead | Variable costs / CM1 | 1.22 (8) | 3.13 | §16 shipping |
| Marketing analytics lead; growth/finance lead | Marketing / CM2 | 1.23, 1.24 (20) | 3.14 | §6 profit truth |
| Finance/operations lead | Opex, D&A, finance, tax | 1.25 (8) | 3.15 | §24 team, §25 software |
| Finance/collections lead | Cash, receivables | 2.1 (6) | 4.1-4.2; finance workbench | -- |
| Inventory/planning lead; inventory/finance lead | Inventory | 2.2, 2.3 (12) | 4.3 | §20 inventory |
| Finance/procurement lead | Prepaids, deposits, fixed assets | 2.4 (6) | 4.4 | -- |
| Finance lead | Payables, accruals, taxes, deferred revenue | 2.5 (6) | 4.5-4.6 | -- |
| Owner/finance lead | Debt/equity; liquidity; investing; financing | 2.6, 3.2, 3.3, 3.4 (24) | 4.7, 5.2-5.7 | -- |
| Finance/treasury lead | Operating cash | 3.1 (6) | 5.1 | -- |

- FINPLAY six agent-assisted workstreams: analyst (reconciliation, diagnostics, cohorts, report drafts); research and creative; media and lifecycle; ecommerce and merchandising; CX and operations; planning and treasury. Rule: automate deterministic joins/calcs/validation first; LLMs for interpretation and drafts with evidence; material pricing/spend/policy/payment/procurement/financing decisions stay within explicit rules; reporting access separated from transaction-changing access. [FINPLAY-US agents]
- USOPP role scorecards: designer owns throughput, hit rate, fatigue response, GP from shipped assets; media buyer owns marginal GP on spend, testing cadence, tracking health; CRM owns repeat GP and deliverability; incentive changes are experiments. [USOPP Part IV p26]

---

#### 11. Stages and sequencing (OS rollout waves, and launch -> grow -> scale mapping)

##### 11.1 Rollout sequences in the docs (for an existing brand)
- **FINMAP 7 steps by statement line** [FINMAP §5.3 p14-15]: (1) Day 1 catalogue images top 50 (Line 1 CVR); (2) Week 1 speed, weekly report, pixel/CAPI audit, daily log; (3) Week 2 COGS uploaded, GPP live, research pass (Line 5 truth); (4) Week 3 creative pipeline, first stack-ranked tests; (5) Month 2 COD confirmation + RTO scoring, negative signals to Meta, value-based bids, spend to high-margin SKUs, abandoned cart, app audit, incentive scheme (Lines 3, 4, 7, 8 + prepaid share); (6) Month 3 CRO system, courier routing + NDR, return-reason loop, purchase-sequence personalisation, support tracking, AEO, content (Lines 1, 3, 6 + retention); (7) Month 4+ inventory forecasting, supplier scorecards, material pricing bands, video loop, marketplaces, loyalty if it pays (Line 5 + BS + CF).
- **FSOS waves 0-4** [FSOS §7 p20-21]: Wave 0 baseline and contracts (days 1-7); Wave 1 visible proof (days 1-14: tracking health, exec profit dashboard, mobile speed, top-SKU PDP/image, checkout friction, cart/checkout recovery, SaaS waste, approval inbox); Wave 2 connect money to decisions (weeks 2-6: landed cost, true GP/CM, new-customer economics, return/chargeback attribution, profit-aware allocation, creative winner memory, stock-aware ads); Wave 3 compounding growth (months 2-3: CRO, creative test engine, lifecycle, cohort profitability, second-order, SEO/AEO, shipping economics, forecast/reorder); Wave 4 working-capital and strategic margin (Q2+: promo incrementality, price tests, supplier/MOQ, dynamic fulfilment, advanced fraud, CCC, financing, material/FX).
- **USOPP waves 1-4** [USOPP Part V p27]: same shape without Wave 0; Wave 4 adds personalised landing, holdouts, subscription suitability.
- **FINPLAY 15-step first diagnostic shortlist** (audit order, not fixed calendar) [FINPLAY-US shortlist]: reconcile money/event definitions; top-SKU economics (O017, M191); checkout (M121-M130); discounts (M171-M180); returns/disputes (O001-O016); cash view (C001-C012); demand-to-stock (M194, B007-B012); creative evidence (M021-M040); high-intent recovery (M141-M150); high-value page (M101-M120); marginal acquisition (M192-M195); trapped cash (B001-B006, B013-B018); post-purchase/repeat (M151-M170); organic demand (M061-M100); suppliers and cost-to-serve (O017-O032).
- **Operating rhythm** [FINPLAY-US rhythm]: daily (outages, spend anomalies, sellable stock, disputes, settlement failures, cash risk); weekly (three active decisions, experiment maturity, 13-week forecast, overdue handoffs); monthly (reconcile waterfall to ledger, cohort revisions, PVM, benefits register); quarterly (channel incrementality, assortment capital productivity, supplier terms, investments, capacity).

##### 11.2 Mapping to a launch -> grow -> scale lifecycle (inference for the catalogue)
None of the four docs is organised by business lifecycle; they assume an operating brand. Mapping the parts by when a brand needs them:
- **Launch (pre-revenue to first orders)**: definitions sheet and metric contracts; landed-cost ledger and SKU cost master; offer/margin simulator and break-even CAC/ROAS by SKU; positioning and launch items (M011-M020: launch demand probes, launch readiness gate, entry-product strategy, good-better-best ladder, gifting); launch buy planning (B012 / FSOS 4.3); new-product launch scorecard; tracking health (server-side events); checkout and trust basics; welcome/cart flows; VoC/JTBD research; first creative tests with low-fi variation; 13-week cash with stock deposits.
- **Grow (product-market fit, scaling acquisition)**: creative engine and winner library; profit-aware media allocation, nGPP and 90/180-day GP; CRO backlog; lifecycle CRM and second-order acceleration; discount leakage and offer architecture; returns taxonomy and source quality; demand forecast/reorder; shipping economics; SEO/AEO and creators; support-to-content loop.
- **Scale (multi-channel, capital-intensive)**: marginal CAC curve and incrementality/holdouts; cash-aware media throttle and scale affordability gate; marketplaces and new channels; multi-location rebalancing, ABC/XYZ, inventory financing; supplier terms, MOQ, dual-source, BOM/FX exposure; processor reserves and settlement aging; debt/equity/financing comparisons, covenants, distribution guardrails; scenario engine; capital allocation scorecard; team scorecards, workbenches, playbooks, training from history; SaaS/opex control.

---

#### 12. Opportunity architecture

##### 12.1 FINPLAY 300-opportunity catalogue (counted from BACKLOG via Python)
- Split: **Stage 1 Income statement 240** (M001-M200 marketing/growth = 200; O001-O040 operations = 40), **Stage 2 Balance sheet 36** (B001-B036), **Stage 3 Cash flow 24** (C001-C024). Marketing 200 (66.7%) vs operations/BS/CF 100 (33.3%). 35 groups: 25 income-statement groups (20 marketing groups of 10, 5 ops groups of 8), 6 balance-sheet groups of 6, 4 cash-flow groups of 6. [BACKLOG] [FINPLAY-US intro]
- Record schema: id, stage, group, line (financial line), title, action (1-2 sentences), measure (proof metric), owner (32 distinct owner roles). [BACKLOG]
- Financial-line distribution: gross revenue 160; marketing expense and CM2 20; gross revenue and future retention 10; discounts and net revenue 10; returns/allowances 8; chargebacks 8; COGS/GP 8; variable selling costs and CM1 8; opex/D&A/finance/tax 8; then 6 each for cash/receivables, inventory, inventory valuation, prepaids/fixed/intangibles, payables/accruals/tax/deferred revenue, borrowings/equity/working capital, operating cash, cash headroom, investing, financing. [BACKLOG]
- Most common owner: owner/finance lead (24). [BACKLOG]
- Every one of the 300 measures is an economic/proof metric (CM1/session, CM2, retained contribution, cash released, etc.), consistent with the GP/CM1/CM2 definitions.

Full group list with IDs and item titles (titles only; actions/measures live in BACKLOG):

###### Stage 1 - Income statement (240 opportunities)

- **1.1 Customer research and demand diagnosis** -- 10 items, M001-M010 [FINPLAY-US 1.1]
  - Financial line: Gross revenue; owner: Growth/research lead
  - Inputs: Reviews, surveys, search queries, order cohorts and support conversations. Build: Evidence bank with dated sources, recurring objections and a ranked test queue
  - Items: M001 Voice-of-customer bank; M002 Purchase-trigger map; M003 Buyer-versus-user research; M004 Objection frequency board; M005 Lost-customer interviews; M006 First-product cohort research; M007 Competitive offer archive; M008 Search-intent gap map; M009 Customer-language copy signals; M010 Research-to-test handoff
- **1.2 Positioning, assortment and launches** -- 10 items, M011-M020 [FINPLAY-US 1.2]
  - Financial line: Gross revenue; owner: Product marketing lead
  - Inputs: Product economics, customer research, stock plans and launch history. Build: Launch decision board with audience, offer, stock and learning milestones
  - Items: M011 Benefit hierarchy test; M012 Good-better-best ladder; M013 Use-case landing sets; M014 Gifting proposition; M015 Launch demand probes; M016 Launch readiness gate; M017 Entry-product strategy; M018 Assortment gap proposals; M019 US seasonal demand calendar (US-localised); M020 Product sunset migration
- **1.3 Creative production system** -- 10 items, M021-M030 [FINPLAY-US 1.3]
  - Financial line: Gross revenue; owner: Creative lead
  - Inputs: Asset files, usage rights, campaign performance and research briefs. Build: Searchable creative library and production queue tied to retained order economics
  - Items: M021 Asset intake and naming; M022 Winner-and-loser library; M023 Creative element tagging; M024 Hypothesis-ranked briefs; M025 Low-cost concept screening; M026 Placement adaptation; M027 Creative fatigue diagnosis; M028 Proof and rights checks; M029 Creative diversity board; M030 Creative learning journal
- **1.4 Copy, video and message testing** -- 10 items, M031-M040 [FINPLAY-US 1.4]
  - Financial line: Gross revenue; owner: Creative/copy lead
  - Inputs: Brand voice, customer language, footage and creative performance. Build: Message test matrix with a linked post-click and post-return outcome view
  - Items: M031 Opening-hook test; M032 Product demonstration sequence; M033 Problem-versus-outcome framing; M034 Proof format comparison; M035 Price transparency creative; M036 Short-versus-long copy; M037 Offer wording clarity; M038 Video pacing variants; M039 Market-language adaptation; M040 Creative-to-page congruence
- **1.5 Paid audience and campaign growth** -- 10 items, M041-M050 [FINPLAY-US 1.5]
  - Financial line: Gross revenue; owner: Paid media lead
  - Inputs: Ad delivery, spend, creative, order and mature loss data. Build: Campaign decision board showing acquisition contribution and test uncertainty
  - Items: M041 Campaign structure audit; M042 Prospecting-versus-retargeting split; M043 Audience approach pilots; M044 High-contribution customer seeds; M045 Suppression freshness; M046 Landing destination selection; M047 Creative-audience matching; M048 New-channel learning budget; M049 ZIP-code service-aware growth (US-localised); M050 Reactivation advertising
- **1.6 Search, Shopping and marketplace demand** -- 10 items, M051-M060 [FINPLAY-US 1.6]
  - Financial line: Gross revenue; owner: Search/marketplace lead
  - Inputs: Search terms, product feeds, listing data, spend and order costs. Build: Query and listing profitability workbench
  - Items: M051 Commercial search segmentation; M052 Search-term waste queue; M053 Feed attribute completeness; M054 Shopping title experiments; M055 Feed-to-store consistency; M056 Margin-based product groups; M057 Marketplace listing repair; M058 US marketplace advertising economics (US-localised); M059 Channel offer consistency; M060 Marketplace acquisition quality
- **1.7 Technical and commercial SEO** -- 10 items, M061-M070 [FINPLAY-US 1.7]
  - Financial line: Gross revenue; owner: SEO lead
  - Inputs: Search performance, crawl/index data, product catalog and page analytics. Build: Search opportunity queue prioritized by commercially relevant demand
  - Items: M061 Commercial keyword-to-page map; M062 Collection page architecture; M063 Indexation defect monitoring; M064 Faceted navigation control; M065 Internal linking opportunities; M066 Product structured-data accuracy; M067 Discontinued-page strategy; M068 Out-of-stock search continuity; M069 Organic page decay watch; M070 US regional search and product clarity (US-localised)
- **1.8 Content, authority and AI discovery** -- 10 items, M071-M080 [FINPLAY-US 1.8]
  - Financial line: Gross revenue; owner: Content/SEO lead
  - Inputs: Buyer questions, product facts, search evidence and referral data. Build: Editorial backlog linked to purchase decisions and evidence quality
  - Items: M071 Buying guides; M072 Comparison content; M073 Usage education content; M074 Original evidence library; M075 Editorial calendar economics; M076 Content repurposing workflow; M077 Answer clarity audit; M078 AI referral and mention sampling; M079 Editorial partnership research; M080 Scaled-content quality gate
- **1.9 Organic social and community** -- 10 items, M081-M090 [FINPLAY-US 1.9]
  - Financial line: Gross revenue; owner: Social/community lead
  - Inputs: Social content, inbound questions, referral tags and order cohorts. Build: Content and conversation board tied to qualified demand
  - Items: M081 Social content pillar map; M082 Organic concept scouting; M083 Buying-intent conversation queue; M084 Community question digest; M085 Customer story pipeline; M086 Live demonstration trials; M087 Social shopping path audit; M088 Launch community activation; M089 Advocacy participation design; M090 Conversation outcome tagging
- **1.10 Creators, affiliates and partnerships** -- 10 items, M091-M100 [FINPLAY-US 1.10]
  - Financial line: Gross revenue; owner: Partnerships lead
  - Inputs: Creator assets, contracts, samples, codes, clicks and settled orders. Build: Partner pipeline and net contribution scorecard
  - Items: M091 Creator fit research; M092 Creator brief personalization; M093 Sample-to-content tracking; M094 Partner follow-up workbench; M095 Creator rights economics; M096 Affiliate incrementality checks; M097 Commission margin bands; M098 Creator portfolio reallocation; M099 Complementary-brand bundles; M100 Referral reward design
- **1.11 Store speed and landing conversion** -- 10 items, M101-M110 [FINPLAY-US 1.11]
  - Financial line: Gross revenue; owner: Ecommerce/CRO lead
  - Inputs: Page performance, device data, error logs, traffic and experiments. Build: Page bottleneck board ranked by eligible traffic and expected contribution
  - Items: M101 Real-user performance map; M102 Image delivery cleanup; M103 Third-party script audit; M104 Theme and interaction repair; M105 First-screen clarity test; M106 Ad-specific landing page; M107 Trust information placement; M108 Mobile purchase controls; M109 Accessibility purchase-path review; M110 Low-traffic experiment design
- **1.12 Product pages and merchandising** -- 10 items, M111-M120 [FINPLAY-US 1.12]
  - Financial line: Gross revenue; owner: Merchandising lead
  - Inputs: Catalog attributes, search logs, baskets, margins and returns. Build: SKU page scorecard and merchandising test queue
  - Items: M111 High-value page refresh; M112 Variant clarity; M113 Fit and compatibility aids; M114 Review placement; M115 Site search synonyms; M116 Search result ranking; M117 Collection navigation; M118 Merchandising profitability; M119 Substitute recommendations; M120 New-product page learning
- **1.13 Cart, checkout and assisted purchase** -- 10 items, M121-M130 [FINPLAY-US 1.13]
  - Financial line: Gross revenue; owner: Ecommerce lead
  - Inputs: Funnel events, payment failures, shipping quotes and support. Build: Checkout defect and recovery queue with whole-order economics
  - Items: M121 Total-price transparency; M122 Guest checkout improvement; M123 Card and digital-wallet checkout (US-localised); M124 Payment failure recovery; M125 US address and serviceability validation (US-localised); M126 Cart persistence; M127 Checkout error monitoring; M128 Assisted product selection; M129 Conversation recovery; M130 Buy-now-pay-later economics (US-localised)
- **1.14 Basket value and cross-sell** -- 10 items, M131-M140 [FINPLAY-US 1.14]
  - Financial line: Gross revenue; owner: Merchandising/growth lead
  - Inputs: Basket/order-line history, product costs, fulfillment rules and stock. Build: Basket simulator showing total contribution and conversion effects
  - Items: M131 Co-purchase bundle discovery; M132 Complement recommendation; M133 Premium upgrade test; M134 Quantity pack design; M135 Build-your-own bundle; M136 Cart cross-sell placement; M137 Post-purchase add-on; M138 Reorder convenience; M139 Service or accessory packaging; M140 Basket margin guard
- **1.15 Lead capture and pre-purchase lifecycle** -- 10 items, M141-M150 [FINPLAY-US 1.15]
  - Financial line: Gross revenue; owner: Lifecycle lead
  - Inputs: Consent records, visitor intent, CRM events and order history. Build: Flow map with eligibility, suppression and incremental contribution
  - Items: M141 Capture timing test; M142 Non-discount signup value; M143 Welcome education sequence; M144 Preference capture; M145 Browse abandonment; M146 Cart recovery sequence; M147 Checkout-specific recovery; M148 Back-in-stock messaging; M149 Price or offer interest alerts; M150 US email and SMS orchestration (US-localised)
- **1.16 Transactional and post-purchase experience** -- 10 items, M151-M160 [FINPLAY-US 1.16]
  - Financial line: Gross revenue and future retention; owner: Lifecycle/CX lead
  - Inputs: Order, shipment, delivery, support and consent events. Build: Event-triggered journey with accurate status and next-best service action
  - Items: M151 Order confirmation clarity; M152 Pre-dispatch education; M153 Shipping milestone updates; M154 US shipping-promise exception handling (US-localised); M155 Parcel delivery exception recovery (US-localised); M156 Arrival check-in; M157 Product adoption sequence; M158 Review request timing; M159 Packaging-to-digital journey; M160 US transactional and promotional message controls (US-localised)
- **1.17 Retention, loyalty and subscriptions** -- 10 items, M161-M170 [FINPLAY-US 1.17]
  - Financial line: Gross revenue; owner: Retention lead
  - Inputs: Mature customer cohorts, consumption patterns, rewards and subscription events. Build: Customer value board with incremental retention economics
  - Items: M161 Second-order acceleration; M162 Purchase-sequence recommendations; M163 Consumption-based replenishment; M164 Lapse-stage win-back; M165 VIP service benefits; M166 Loyalty reward economics; M167 Subscription suitability; M168 Subscription flexibility; M169 Failed renewal recovery; M170 Customer feedback-to-retention loop
- **1.18 Discounts, pricing and promotion design** -- 10 items, M171-M180 [FINPLAY-US 1.18]
  - Financial line: Discounts and net revenue; owner: Commercial/finance lead
  - Inputs: Order-level discounts, costs, offer rules, stock and experiment cohorts. Build: Offer simulator and promotion contribution scorecard
  - Items: M171 Discount leakage audit; M172 Margin-break quantity tiers; M173 Gift-versus-discount test; M174 Free-shipping threshold; M175 Bundle discount allocation; M176 Selective incentive eligibility; M177 Price-volume break-even tool; M178 Price elasticity experiments; M179 Promotion pull-forward analysis; M180 Markdown-versus-bundle choice
- **1.19 Returns and revenue retention** -- 8 items, O001-O008 [FINPLAY-US 1.19]
  - Financial line: Returns/allowances and related variable costs; owner: CX/operations lead
  - Inputs: Order-line returns, reasons, disposition, refunds and source cohorts. Build: Loss-cause board with accountable fixes and net recovery economics
  - Items: O001 Return reason taxonomy; O002 Return-to-promise feedback; O003 Exchange and assistance options; O004 Return disposition routing; O005 Return freight optimization; O006 Refund reconciliation; O007 Policy economics experiment; O008 Pre-fulfillment cancellation prevention (US-localised)
- **1.20 Chargebacks and payment loss** -- 8 items, O009-O016 [FINPLAY-US 1.20]
  - Financial line: Chargeback principal, dispute fees and recoveries; owner: Payments/risk lead
  - Inputs: Processor disputes, payment evidence, delivery records and support. Build: Dispute deadline queue and loss prevention scorecard
  - Items: O009 Dispute intake and deadlines; O010 Evidence pack assembly; O011 Fight-or-accept economics; O012 Descriptor and receipt clarity; O013 Refund-before-dispute resolution; O014 Risk verification calibration; O015 Source-quality loss board; O016 Recovery accounting loop
- **1.21 COGS, BOM and inbound economics** -- 8 items, O017-O024 [FINPLAY-US 1.21]
  - Financial line: COGS and gross profit; inventory before sale; owner: Procurement/finance lead
  - Inputs: BOMs, supplier quotes, receipts, invoices, freight and defect data. Build: Date-effective landed-cost ledger and procurement scenario tool
  - Items: O017 BOM and landed-cost ledger; O018 Supplier quote comparison; O019 Negotiation preparation; O020 MOQ and bulk purchasing simulator; O021 Material and FX exposure board; O022 Cost-shock response ladder; O023 Inbound mode and consolidation; O024 Supplier quality and resilience
- **1.22 Fulfillment and variable selling costs** -- 8 items, O025-O032 [FINPLAY-US 1.22]
  - Financial line: Variable selling costs and CM1; owner: Operations lead
  - Inputs: Shipment invoices, packaging, warehouse activity, fees and service outcomes. Build: Order cost-to-serve board and carrier/service comparison
  - Items: O025 US parcel total-cost comparison (US-localised); O026 Service routing proposals; O027 US dimensional-weight and surcharge audit (US-localised); O028 Split-shipment reduction; O029 Pick-pack productivity; O030 Payment cost optimization; O031 Shipping claim recovery; O032 Variable service cost allocation
- **1.23 Marketing measurement and attribution** -- 10 items, M181-M190 [FINPLAY-US 1.23]
  - Financial line: Marketing expense and CM2; owner: Marketing analytics lead
  - Inputs: Spend, events, order economics, CRM and experiment assignments. Build: Reconciled acquisition scorecard with uncertainty and causal evidence
  - Items: M181 Browser/server event health; M182 Conversion value dictionary; M183 Attribution comparison board; M184 New-customer identity controls; M185 Mature acquisition cohorts; M186 Retargeting holdouts; M187 Brand-search incrementality; M188 Owned-channel holdouts; M189 Supported conversion adjustments; M190 Experiment validity monitor
- **1.24 Marketing cost allocation and scale decisions** -- 10 items, M191-M200 [FINPLAY-US 1.24]
  - Financial line: Marketing expense and CM2; owner: Growth/finance lead
  - Inputs: Fully loaded marketing costs, response tests, stock and cash forecast. Build: Marginal contribution allocator with inventory and cash limits
  - Items: M191 Fully loaded marketing ledger; M192 Marginal budget response; M193 Bounded scale-pause rules; M194 Inventory-aware media pacing; M195 Cash-aware acquisition ceiling; M196 Creative production economics; M197 CRM delivery cost optimization; M198 Agency and vendor fee audit; M199 Spend anomaly detection; M200 Marketing portfolio review
- **1.25 Overhead, operating profit and net profit** -- 8 items, O033-O040 [FINPLAY-US 1.25]
  - Financial line: Operating expenses, D&A, finance expense and taxes; owner: Finance/operations lead
  - Inputs: Payroll/work queues, vendor bills, asset register and ledger. Build: Overhead decision register and EBITDA-to-net-profit bridge
  - Items: O033 Software and renewal register; O034 Workflow labor productivity; O035 Agent run-cost controls; O036 Integration reliability board; O037 Fixed-capacity utilization; O038 Expense and accrual close; O039 Asset and financing expense bridge; O040 US entity-tax and profit bridge (US-localised)

###### Stage 2 - Balance sheet (36 opportunities)

- **2.1 Cash, settlement balances and receivables** -- 6 items, B001-B006 [FINPLAY-US 2.1]
  - Financial line: Cash, restricted balances and receivables; owner: Finance/collections lead
  - Inputs: Bank feeds, payment captures, payouts, marketplace statements and invoices. Build: Daily cash and receivables bridge with overdue exceptions
  - Items: B001 Bank-to-payout reconciliation; B002 Settlement aging; B003 Reserve release tracking; B004 Wholesale receivables queue; B005 US marketplace deduction recovery (US-localised); B006 Cash concentration visibility
- **2.2 Inventory availability and throughput** -- 6 items, B007-B012 [FINPLAY-US 2.2]
  - Financial line: Inventory: raw materials, work in process and finished goods; owner: Inventory/planning lead
  - Inputs: Stock movements, demand, BOMs, POs, ad plans and supplier lead times. Build: SKU stock cover and reorder decision board
  - Items: B007 Sellable-stock truth; B008 Demand forecast with marketing inputs; B009 Lead-time-based reorder points; B010 Allocation across locations; B011 Hero-SKU stockout economics; B012 Launch and seasonal buy sizing
- **2.3 Inventory recovery and valuation** -- 6 items, B013-B018 [FINPLAY-US 2.3]
  - Financial line: Inventory carrying value and write-downs; owner: Inventory/finance lead
  - Inputs: Age, condition, expiry, sell-through, disposal and market recovery evidence. Build: Aged-stock recovery queue with cash and P&L effects separated
  - Items: B013 Aged-stock action queue; B014 Expiry and obsolescence watch; B015 Return-to-stock acceleration; B016 US inventory valuation review (US-localised); B017 Assortment capital productivity; B018 Shrink and variance investigation
- **2.4 Prepayments, deposits and operating assets** -- 6 items, B019-B024 [FINPLAY-US 2.4]
  - Financial line: Prepaids, supplier advances, fixed and qualifying intangible assets; owner: Finance/procurement lead
  - Inputs: Contracts, payment schedules, asset register and usage data. Build: Asset commitment register with recoverability and utilization
  - Items: B019 Supplier deposit milestones; B020 Prepaid service utilization; B021 US supplier credits and claims register (US-localised); B022 Equipment utilization and payback; B023 US software capitalization evidence (US-localised); B024 Operating knowledge register
- **2.5 Payables and customer obligations** -- 6 items, B025-B030 [FINPLAY-US 2.5]
  - Financial line: Trade payables, accruals, taxes and deferred revenue; owner: Finance lead
  - Inputs: Supplier invoices, receipts, terms, refunds, gift cards and customer advances. Build: Obligation calendar and working-capital trade-off tool
  - Items: B025 Three-way invoice matching; B026 Supplier term scenarios; B027 Payment scheduling; B028 Refund and loyalty obligations; B029 Gift card and preorder ledger; B030 US sales-tax and accrual calendar (US-localised)
- **2.6 Debt, equity and working-capital synthesis** -- 6 items, B031-B036 [FINPLAY-US 2.6]
  - Financial line: Borrowings, leases, equity and operating working capital; owner: Owner/finance lead
  - Inputs: Debt/lease schedules, covenants, capital movements and period averages. Build: Capital structure and cash conversion scorecard
  - Items: B031 Debt and lease register; B032 Covenant headroom monitor; B033 Working-capital cycle board; B034 Growth funding requirement; B035 Equity movement reconciliation; B036 Distribution capacity review

###### Stage 3 - Cash flow (24 opportunities)

- **3.1 Operating cash receipts and payments** -- 6 items, C001-C006 [FINPLAY-US 3.1]
  - Financial line: Operating cash flow; owner: Finance/treasury lead
  - Inputs: Expected settlements, bank actuals, POs, payroll, tax and service bills. Build: Direct thirteen-week forecast with named owners for every major variance
  - Items: C001 Rolling thirteen-week forecast; C002 US payment receipt timing model (US-localised); C003 Inventory payment timing; C004 Marketing cash timing; C005 Returns and dispute cash reserve; C006 Profit-to-cash bridge
- **3.2 Liquidity resilience and operating decisions** -- 6 items, C007-C012 [FINPLAY-US 3.2]
  - Financial line: Operating cash flow and cash headroom; owner: Owner/finance lead
  - Inputs: Forecast scenarios, contribution response, collection lags and commitments. Build: Cash stress test and weekly can-we-afford-to-scale decision
  - Items: C007 Downside scenario engine; C008 Scale affordability gate; C009 Cash release verification; C010 Commitment calendar; C011 Emergency action scenarios; C012 Cash buffer calibration
- **3.3 Investing cash flow** -- 6 items, C013-C018 [FINPLAY-US 3.3]
  - Financial line: Equipment, qualifying software and long-term asset investment; owner: Owner/finance lead
  - Inputs: Investment proposals, implementation cost, asset sales and expected benefits. Build: Investment appraisal register and post-investment benefits review
  - Items: C013 Equipment investment case; C014 Build-versus-buy appraisal; C015 Qualifying development cash plan; C016 Asset disposal recovery; C017 Investment stage gates; C018 Post-investment audit
- **3.4 Financing cash flow** -- 6 items, C019-C024 [FINPLAY-US 3.4]
  - Financial line: Borrowing, repayment, equity and owner distributions; owner: Owner/finance lead
  - Inputs: Term sheets, debt schedules, equity records and downside forecast. Build: Funding comparison and repayment affordability dashboard
  - Items: C019 Funding option comparison; C020 Drawdown and repayment planning; C021 Refinancing calendar; C022 Equity funding scenario; C023 Distribution cash schedule; C024 US financing movement reconciliation (US-localised)

##### 12.2 USOPP 178-opportunity stack-ranked portfolio
- Scoring: visibility (speed to proof) 1-5 and business lever 1-5; composite = 0.6 lever + 0.4 visibility. Product form per item: SaaS / Hybrid / DFY (done-for-you). [USOPP §2 p2]
- 20 business domains (§6-§25), 178 areas. Composite tier distribution (parsed from Appendix A): 5.0 x10; 4.6 x22; 4.4 x17; 4.2 x23; 4.0 x39; 3.8 x18; 3.6 x32; 3.4 x4; 3.2 x7; 3.0 x3; 2.8 x1; 2.6 x2. [USOPP App A p29-34]
- Product form (parsed from domain tables, 3 hand-corrected): **Hybrid 90, SaaS 74, DFY 14**. [USOPP Part II]
- Top 10 (all 5.0): above-the-fold clarity; approval inbox; cart abandonment; checkout abandonment; checkout friction audit; discount leakage audit; pixel/server-side event health; return reason taxonomy; SKU contribution-margin map; winning-creative repository. [USOPP §3 p2-3]
- Productisation rule: SaaS = frequent, structured, data-heavy, low-risk (monitoring, reporting, anomaly detection, winner libraries, feed health, cohorts, approval inbox, integration alerts); DFY = context/taste/negotiation/change management (major CRO redesigns, supplier negotiations, pricing strategy, policy changes, launch planning, specialist risk); Hybrid = default for high-impact commercial work (machine analyses/builds, human approves). "Adoption is part of the product." [USOPP Part IV p26]
- Each domain closes with 3-4 "Questions the OS should answer" (e.g. profit truth: which revenue is profitable after all variable costs; which products/customers can absorb more spend; where attribution disagrees with financial truth; which bad outcomes should change acquisition valuation). [USOPP Part II]

Domains, profiles and every item (rank #, visibility/lever, composite, product form):

- **USOPP §6 Profit truth, tracking & decision layer** -- 10 opportunity areas; average visibility 4.0/5 | average business lever 4.6/5 [USOPP §6 p5-6]
  - #7 Pixel / server-side event health (V5/L5, 5.0, SaaS); #22 New-customer gross profit per purchase (V4/L5, 4.6, SaaS); #24 Platform-to-business reconciliation (V4/L5, 4.6, SaaS); #30 True gross profit per order / SKU / campaign (V4/L5, 4.6, Hybrid); #39 Executive gross-profit dashboard (V5/L4, 4.4, SaaS); #50 90/180-day customer gross profit (V3/L5, 4.2, SaaS); #65 Profit-aware campaign feedback (V3/L5, 4.2, Hybrid); #69 Return/refund/chargeback feedback loop (V3/L5, 4.2, Hybrid); #76 Anomaly and leak detection (V4/L4, 4.0, SaaS); #123 Automated daily / weekly narrative (V5/L3, 3.8, SaaS)
- **USOPP §7 Website speed & technical hygiene** -- 8 opportunity areas; average visibility 4.8/5 | average business lever 3.6/5 [USOPP §7 p6]
  - #34 Core mobile speed cleanup (V5/L4, 4.4, Hybrid); #37 Dead / duplicate app and script audit (V5/L4, 4.4, Hybrid); #41 Image compression and next-gen formats (V5/L4, 4.4, Hybrid); #108 Theme / template performance audit (V4/L4, 4.0, DFY); #109 Third-party tag governance (V4/L4, 4.0, Hybrid); #121 App/subscription rationalization (V5/L3, 3.8, Hybrid); #124 Broken link / redirect hygiene (V5/L3, 3.8, SaaS); #127 Real-device mobile QA (V5/L3, 3.8, SaaS)
- **USOPP §8 Landing pages & conversion system** -- 10 opportunity areas; average visibility 3.8/5 | average business lever 4.4/5 [USOPP §8 p7]
  - #1 Above-the-fold clarity (V5/L5, 5.0, Hybrid); #23 Offer architecture tests (V4/L5, 4.6, Hybrid); #47 Sticky add-to-cart / mobile purchase controls (V5/L4, 4.4, DFY); #56 Continuous CRO backlog (V3/L5, 4.2, Hybrid); #91 Navigation and collection findability (V4/L4, 4.0, Hybrid); #94 On-site search quality (V4/L4, 4.0, SaaS); #105 Social proof placement (V4/L4, 4.0, Hybrid); #110 Trust and risk-reversal system (V4/L4, 4.0, Hybrid); #114 Personalized landing experiences (V2/L5, 3.8, Hybrid); #146 Low-traffic big-swing test policy (V3/L4, 3.6, DFY)
- **USOPP §9 Catalog, merchandising & product pages** -- 10 opportunity areas; average visibility 3.9/5 | average business lever 4.2/5 [USOPP §9 p7-8]
  - #43 Out-of-stock ad suppression (V5/L4, 4.4, SaaS); #45 Product data completeness (V5/L4, 4.4, SaaS); #49 Top-SKU image quality refresh (V5/L4, 4.4, Hybrid); #53 Bundle discovery from basket data (V3/L5, 4.2, Hybrid); #62 Margin-aware product ranking (V3/L5, 4.2, SaaS); #87 Feed title / taxonomy optimization (V4/L4, 4.0, Hybrid); #97 PDP description rewrite (V4/L4, 4.0, Hybrid); #111 Variant clarity and merchandising (V4/L4, 4.0, Hybrid); #137 Dead-SKU rationalization (V3/L4, 3.6, Hybrid); #148 New-product launch scorecard (V3/L4, 3.6, SaaS)
- **USOPP §10 Checkout, payments & fraud** -- 8 opportunity areas; average visibility 4.1/5 | average business lever 4.2/5 [USOPP §10 p8-9]
  - #5 Checkout friction audit (V5/L5, 5.0, Hybrid); #28 Shipping-cost surprise reduction (V4/L5, 4.6, Hybrid); #40 Express wallet placement (V5/L4, 4.4, DFY); #59 Fraud / chargeback risk scoring (V3/L5, 4.2, SaaS); #81 Checkout upsell discipline (V4/L4, 4.0, Hybrid); #98 Payment failure recovery (V4/L4, 4.0, SaaS); #120 Address validation (V5/L3, 3.8, SaaS); #142 High-risk order verification (V3/L4, 3.6, Hybrid)
- **USOPP §11 Paid media strategy & media buying** -- 10 opportunity areas; average visibility 3.3/5 | average business lever 4.4/5 [USOPP §11 p9-10]
  - #14 Campaign structure cleanup (V4/L5, 4.6, DFY); #16 Creative-to-media learning loop (V4/L5, 4.6, Hybrid); #27 Scale / kill / refresh rules (V4/L5, 4.6, Hybrid); #64 Profit-aware budget allocation (V3/L5, 4.2, Hybrid); #77 Audience saturation / fatigue monitor (V4/L4, 4.0, SaaS); #113 Incrementality / holdout discipline (V2/L5, 3.8, Hybrid); #141 Geo profitability steering (V3/L4, 3.6, Hybrid); #147 New channel pilot framework (V3/L4, 3.6, Hybrid); #160 Value rules / segment adjustments (V3/L4, 3.6, Hybrid); #173 Daypart / weekday economics (V3/L3, 3.0, SaaS)
- **USOPP §12 Creative, copy & content production** -- 10 opportunity areas; average visibility 4.6/5 | average business lever 4.1/5 [USOPP §12 p10-11]
  - #10 Winning-creative repository (V5/L5, 5.0, SaaS); #15 Creative decomposition (V4/L5, 4.6, Hybrid); #19 Hypothesis-ranked creative briefs (V4/L5, 4.6, Hybrid); #33 Copy and headline testing bank (V5/L4, 4.4, SaaS); #35 Creative fatigue detection (V5/L4, 4.4, SaaS); #42 Low-fidelity variation factory (V5/L4, 4.4, SaaS); #83 Creative learnings journal (V4/L4, 4.0, SaaS); #88 Format expansion from winners (V4/L4, 4.0, Hybrid); #122 Asset resizing / versioning (V5/L3, 3.8, SaaS); #126 Production QA / compliance checklist (V5/L3, 3.8, SaaS)
- **USOPP §13 Customer & competitor research** -- 8 opportunity areas; average visibility 3.5/5 | average business lever 4.6/5 [USOPP §13 p11-12]
  - #31 Voice-of-customer mining (V4/L5, 4.6, Hybrid); #52 Angle whitespace map (V3/L5, 4.2, Hybrid); #60 Jobs-to-be-done map (V3/L5, 4.2, Hybrid); #63 Persona evidence packs (V3/L5, 4.2, Hybrid); #68 Research-to-test pipeline (V3/L5, 4.2, Hybrid); #82 Competitor ad / offer monitor (V4/L4, 4.0, SaaS); #92 Objection library (V4/L4, 4.0, SaaS); #93 Offer benchmark database (V4/L4, 4.0, SaaS)
- **USOPP §14 Email, SMS & lifecycle CRM** -- 11 opportunity areas; average visibility 3.8/5 | average business lever 4.5/5 [USOPP §14 p12-13]
  - #3 Cart abandonment (V5/L5, 5.0, Hybrid); #4 Checkout abandonment (V5/L5, 5.0, Hybrid); #32 Welcome series optimization (V4/L5, 4.6, Hybrid); #57 Cross-sell sequencing (V3/L5, 4.2, SaaS); #67 Replenishment timing (V3/L5, 4.2, SaaS); #78 Browse abandonment (V4/L4, 4.0, Hybrid); #84 Deliverability health (V4/L4, 4.0, Hybrid); #99 Post-purchase education (V4/L4, 4.0, Hybrid); #101 Promotional calendar governance (V4/L4, 4.0, Hybrid); #134 Channel orchestration (V3/L4, 3.6, SaaS); #161 Win-back by lapse stage (V3/L4, 3.6, Hybrid)
- **USOPP §15 Retention, loyalty & referral** -- 8 opportunity areas; average visibility 2.8/5 | average business lever 4.2/5 [USOPP §15 p13-14]
  - #58 Customer cohort profitability (V3/L5, 4.2, SaaS); #71 Second-order acceleration (V3/L5, 4.2, Hybrid); #90 Loyalty program ROI audit (V4/L4, 4.0, Hybrid); #119 Subscription / membership suitability (V2/L5, 3.8, Hybrid); #152 Referral economics (V3/L4, 3.6, Hybrid); #159 VIP / high-value recognition (V3/L4, 3.6, Hybrid); #167 Churn / lapse risk score (V2/L4, 3.2, SaaS); #177 Community / advocacy flywheel (V2/L3, 2.6, DFY)
- **USOPP §16 Shipping, fulfillment & delivery** -- 8 opportunity areas; average visibility 3.4/5 | average business lever 4.2/5 [USOPP §16 p14-15]
  - #18 Free-shipping threshold optimization (V4/L5, 4.6, Hybrid); #79 Carrier cost benchmark (V4/L4, 4.0, Hybrid); #85 Delivery promise accuracy (V4/L4, 4.0, Hybrid); #86 Exception recovery (V4/L4, 4.0, SaaS); #112 Dynamic service selection (V2/L5, 3.8, SaaS); #133 Carrier performance by lane (V3/L4, 3.6, SaaS); #149 Packaging cost / damage trade-off (V3/L4, 3.6, DFY); #153 Split-shipment control (V3/L4, 3.6, SaaS)
- **USOPP §17 Returns, refunds & chargebacks** -- 8 opportunity areas; average visibility 3.5/5 | average business lever 4.4/5 [USOPP §17 p15-16]
  - #8 Return reason taxonomy (V5/L5, 5.0, SaaS); #26 SKU-level return risk (V4/L5, 4.6, SaaS); #51 Acquisition-source return quality (V3/L5, 4.2, SaaS); #80 Chargeback evidence automation (V4/L4, 4.0, SaaS); #118 Return policy experimentation (V2/L5, 3.8, Hybrid); #139 Exchange-first economics (V3/L4, 3.6, SaaS); #150 Pre-return rescue (V3/L4, 3.6, Hybrid); #164 Refund timing / status communication (V4/L3, 3.4, SaaS)
- **USOPP §18 Customer support & assisted conversion** -- 8 opportunity areas; average visibility 4.1/5 | average business lever 3.8/5 [USOPP §18 p16]
  - #44 Pre-purchase question capture (V5/L4, 4.4, SaaS); #46 Reason-code discipline (V5/L4, 4.4, SaaS); #73 Abandoned conversation follow-up (V4/L4, 4.0, Hybrid); #104 Sales-assist routing (V4/L4, 4.0, Hybrid); #106 Support-to-content loop (V4/L4, 4.0, Hybrid); #125 Escalation / SLA alerts (V5/L3, 3.8, SaaS); #135 Conversation-to-order attribution (V3/L4, 3.6, SaaS); #175 Support quality calibration (V3/L3, 3.0, SaaS)
- **USOPP §19 Pricing, promotions & margin management** -- 10 opportunity areas; average visibility 3.3/5 | average business lever 4.5/5 [USOPP §19 p17]
  - #6 Discount leakage audit (V5/L5, 5.0, Hybrid); #9 SKU contribution-margin map (V5/L5, 5.0, SaaS); #13 Bundle pricing optimization (V4/L5, 4.6, Hybrid); #29 Threshold pricing / free-gift tests (V4/L5, 4.6, Hybrid); #115 Price-change sensitivity tests (V2/L5, 3.8, Hybrid); #117 Promo incrementality (V2/L5, 3.8, Hybrid); #138 Dynamic markdown for aged inventory (V3/L4, 3.6, Hybrid); #144 Input-cost exposure watch (V3/L4, 3.6, SaaS); #163 Competitor price intelligence (V4/L3, 3.4, SaaS); #176 Hedging decision support for material exposure (V1/L4, 2.8, DFY)
- **USOPP §20 Inventory, assortment & demand planning** -- 9 opportunity areas; average visibility 3.0/5 | average business lever 4.3/5 [USOPP §20 p18]
  - #20 Inventory-aware ad suppression / boost (V4/L5, 4.6, SaaS); #66 Reorder point / safety stock (V3/L5, 4.2, SaaS); #70 SKU demand forecast (V3/L5, 4.2, SaaS); #75 Aged inventory action queue (V4/L4, 4.0, Hybrid); #131 Assortment productivity (V3/L4, 3.6, Hybrid); #151 Preorder / backorder decisioning (V3/L4, 3.6, Hybrid); #154 Stockout cost estimation (V3/L4, 3.6, SaaS); #170 Launch buy planning (V2/L4, 3.2, DFY); #171 Seasonality / event planning (V2/L4, 3.2, Hybrid)
- **USOPP §21 Sourcing, procurement & inbound logistics** -- 10 opportunity areas; average visibility 3.3/5 | average business lever 4.2/5 [USOPP §21 p18-19]
  - #21 Landed-cost truth by SKU (V4/L5, 4.6, SaaS); #48 Supplier price variance tracking (V5/L4, 4.4, SaaS); #61 MOQ economics (V3/L5, 4.2, Hybrid); #102 Quality / defect feedback to supplier (V4/L4, 4.0, Hybrid); #103 RFQ / quote normalization (V4/L4, 4.0, Hybrid); #143 Inbound freight mode optimization (V3/L4, 3.6, Hybrid); #145 Lead-time variability buffer (V3/L4, 3.6, SaaS); #155 Supplier scorecard (V3/L4, 3.6, SaaS); #169 Dual-source / concentration risk map (V2/L4, 3.2, DFY); #172 Terms / payment working-capital analysis (V2/L4, 3.2, DFY)
- **USOPP §22 Organic search, AEO & discovery** -- 9 opportunity areas; average visibility 3.2/5 | average business lever 4.1/5 [USOPP §22 p19-20]
  - #54 Category / collection page strategy (V3/L5, 4.2, Hybrid); #55 Commercial keyword map (V3/L5, 4.2, Hybrid); #95 Organic content refresh engine (V4/L4, 4.0, SaaS); #100 Product structured data (V4/L4, 4.0, SaaS); #107 Technical SEO hygiene (V4/L4, 4.0, Hybrid); #130 AEO / answer-engine readiness (V3/L4, 3.6, Hybrid); #132 Buying-guide content (V3/L4, 3.6, Hybrid); #168 Digital PR / authority opportunity map (V2/L4, 3.2, DFY); #174 Programmatic content guardrails (V3/L3, 3.0, SaaS)
- **USOPP §23 Creators, affiliates & partnerships** -- 7 opportunity areas; average visibility 3.1/5 | average business lever 4.1/5 [USOPP §23 p20-21]
  - #12 Brief generation from research (V4/L5, 4.6, Hybrid); #17 Creator asset performance library (V4/L5, 4.6, Hybrid); #96 Outreach pipeline (V4/L4, 4.0, Hybrid); #136 Creator discovery and fit scoring (V3/L4, 3.6, SaaS); #158 Usage-rights / whitelisting economics (V3/L4, 3.6, Hybrid); #166 Affiliate quality / incrementality (V2/L4, 3.2, Hybrid); #178 Partnership opportunity map (V2/L3, 2.6, DFY)
- **USOPP §24 Team workflow, adoption & incentives** -- 10 opportunity areas; average visibility 3.8/5 | average business lever 4.5/5 [USOPP §24 p21-22]
  - #2 Approval inbox (V5/L5, 5.0, SaaS); #11 Automated handoffs (V4/L5, 4.6, SaaS); #25 Role-specific AI workbench (V4/L5, 4.6, Hybrid); #36 Daily action summary (V5/L4, 4.4, Hybrid); #38 Decision log (V5/L4, 4.4, SaaS); #72 Standardized operating playbooks (V3/L5, 4.2, Hybrid); #74 Adoption measurement (V4/L4, 4.0, SaaS); #116 Profit-linked team scorecards (V2/L5, 3.8, DFY); #140 Experiment credit / attribution (V3/L4, 3.6, SaaS); #157 Training from real account history (V3/L4, 3.6, SaaS)
- **USOPP §25 Software stack & operating cost** -- 6 opportunity areas; average visibility 4.2/5 | average business lever 3.3/5 [USOPP §25 p22-23]
  - #89 Integration reliability monitor (V4/L4, 4.0, SaaS); #128 SaaS spend inventory (V5/L3, 3.8, SaaS); #129 Usage-based cancellation queue (V5/L3, 3.8, SaaS); #156 Tool ROI scorecard (V3/L4, 3.6, Hybrid); #162 Capability overlap map (V4/L3, 3.4, Hybrid); #165 Vendor renegotiation calendar (V4/L3, 3.4, SaaS)

##### 12.3 FSOS lever inventory (counted from text; PDF and DOCX identical)
- Diagnostics §1.1: 25. Data products §2.1: 25.
- Income statement §3.1-3.15: 247 = research 12; paid media 22; creative 21; website/CRO/checkout 25; catalogue/merchandising 15; SEO/content/AI discovery 12; creators/affiliates/referral 10; lifecycle/retention 22; discounts 15; returns/refunds/cancellations/chargebacks 16; net revenue quality 10; COGS/landed 20; fulfilment/payment/variable 15; contribution margin decision layer 14; fixed opex 18.
- Balance sheet §4.1-4.7: 68 = cash 7; receivables 8; inventory 20; prepaids/deposits 5; AP/supplier financing 12; refunds/disputes/credits/taxes/accruals 8; debt/WC financing 8.
- Cash flow §5.1-5.7: 62 = operating forecast/liquidity 11; CCC/working capital 10; marketing/growth cash 8; inventory cash 10; investing 6; financing/capital allocation 7; scenario engine 10.
- Control tower §6.1: 20. Rollout waves: 5. Dashboards App B: 14. Market modules App C: 6.
- **Total operating levers (diagnostics + data + IS + BS + CF + control tower) = 447**, each with a "Proof:" metric. Growth/marketing share of IS levers ~ 139/247 (§3.1-3.8). [FSOS §1-6]

##### 12.4 Market-specific modules and US specifics

**Market toggles across the set**
- FINMAP is India-first by default (COD, RTO, UPI, WhatsApp, pincode, festive calendar), each "a toggle for prepaid markets". [FINMAP p1]
- USOPP is US-first: card/wallet checkout, chargebacks, returns, parcel shipping and channel mix replace COD/RTO; India modules (COD, RTO, UPI, pincode routing) are market-specific extensions. [USOPP §3 p2] [USOPP App B p34]
- FSOS Appendix C six modules: India/COD/RTO (COD confirmation, prepaid-vs-COD, RTO risk, NDR recovery, UPI placement, pincode serviceability, RTO feedback to ads); US/card-wallet/chargebacks (express wallets, payment failure recovery, dispute prevention/evidence, processor reserves, parcel zones, card-fraud balance); marketplace-heavy (fee/ads/payout reconciliation, price parity, Buy Box/listing quality, marketplace returns, reserve forecasting); manufactured/commodity-exposed (BOM, raw material, FX, purchase timing, pricing bands, hedging decision support); wholesale + DTC hybrid (trade AR/credit terms, channel inventory allocation, wholesale margin, channel conflict); subscription/consumables (replenishment curves, churn, subscription contribution, dunning, deferred revenue, retention payback). [FSOS App C p23]

**FINPLAY-US operating assumptions (10 areas)** [FINPLAY-US US assumptions]
- Currency/reporting USD, sales tax excluded from revenue; market scope US domestic (Alaska, Hawaii, territories, PO boxes modelled separately); checkout = cards, wallets, optional BNPL (compare authorisation, fraud, fees, settlement); owned channels = email + consented SMS (consent evidence, suppression, local-time sending); delivery = USPS/UPS/FedEx/regional vs negotiated quotes, ZIP zones, dims, surcharges; marketplaces = Amazon, Walmart Marketplace; calendar = Mother's Day, Father's Day, back-to-school, Halloween, BFCM, holiday gifting, January return tail; working capital = processor reserves, card/wallet/BNPL settlement, marketplace payouts, wholesale AR; accounting = contribution management view reconciled to US GAAP (tax-basis bridge); regional variation = state sales tax, shipping eligibility, privacy and contact rules as configuration.
- Scope switches: legal entity and state footprint, GAAP/tax bridge, revenue policy, inventory method, return window, channel permissions, marketplaces, fulfilment network; activate subscriptions, wholesale AR, manufacturing BOMs, import/FX only when relevant. [FINPLAY-US scope switches]
- External verification references R1-R11 checked 7 Sep 2026: SEC/FASB 95 (cash-flow classes), ASU 2025-06 (internal-use software), Google conversion adjustments, Google AI features, Meta CAPI optimisation, ASU 2015-11 (inventory LCNRV), FTC CAN-SPAM, FTC Mail Order Rule, CA CDTFA / WA DOR marketplace tax, UPS dims/rates, Amazon FBA pricing. GL edition uses IFRS IAS 7 / IAS 38 / IAS 2 and only R1-R6. [FINPLAY-US sources] [FINPLAY-GL sources]

**US vs global differences in the 300 (22 records changed; 0 group changes)** [BACKLOG diff]
- Revenue/marketing: M019 seasonal calendar -> US seasonal demand calendar (BFCM, back-to-school, January return tail); M049 regional -> ZIP-code service-aware growth; M058 -> US marketplace advertising economics (Amazon statements, R11); M070 international search clarity -> US regional search and product clarity; M123 express payment placement -> card and digital-wallet checkout (Shop Pay, Apple Pay, Google Pay, PayPal); M125 address validation -> US address and serviceability validation (ZIP, unit, PO box); **M130 conditional COD design -> buy-now-pay-later economics**; M150 -> US email and SMS orchestration (consent, local time); M154 delay communication -> US shipping-promise exception handling (FTC Mail Order Rule, R8); M155 -> parcel delivery exception recovery; M160 -> US transactional and promotional message controls (CAN-SPAM, R7).
- Operations: O008 refusal and cancellation prevention (COD) -> pre-fulfilment cancellation prevention; O025 -> US parcel total-cost comparison (R10); O027 -> US dimensional-weight and surcharge audit (R10); O040 -> US entity-tax and profit bridge (sales tax out of revenue; federal/state, pass-through).
- Balance sheet / cash: **B005 COD remittance ledger -> US marketplace deduction recovery**; B016 -> US inventory valuation review (R6); B021 -> US supplier credits and claims register; B023 -> US software capitalisation evidence (R2); B030 -> US sales-tax and accrual calendar (R9); C002 -> US payment receipt timing model; C024 -> US financing movement reconciliation.
- Narrative differences: GL uses CU (neutral currency units), IFRS references, "prepaid does not mean cash in bank" and COD remittance days in DSO; US uses $ throughout, a US operating assumptions table, US GAAP/FASB, FTC references. Otherwise text, structure, formulas and worked examples are identical. [FINPLAY-GL vs FINPLAY-US diff]

---

#### 13. Proposed workflow / dashboard / agent library in these docs (catalogue parts)

Proposed catalogue parts distilled from the four docs. Level = proposed catalogue level (prompt/skill/routine/workflow/agent/system/asset); area per _SCHEMA codes. All are specification-only (status draft); none is built in this folder. Source refs point to the fullest description.

##### 13.1 Foundation: data trust and definitions (FN unless noted)
- `metric-definitions-contract` -- asset/skill, FN: written GP/CM1/CM2/CAC/payback/MER definitions + ledger bridge; input product_data, ledger; output metric contract. [FINPLAY-US F5] [FSOS §2.1 metric contract registry]
- `landed-cost-ledger-builder` -- skill/workflow, FN (sub OP): build date-effective landed COGS per SKU from POs, freight, duty, packaging; flag missing cost. [FINMAP Line 5] [FINPLAY-US O017]
- `order-economics-scorer` -- routine, FN: re-score every order/SKU/campaign/ad to GP/CM1/CM2 daily. [FINMAP p3] [FSOS §2.1 order-line economics]
- `money-reconciliation-check` -- routine, FN: platform vs store vs processor vs bank reconciliation, unmatched queue. [FSOS §1.1 channel-to-finance] [FINPLAY-US shortlist #1]
- `data-reliability-score` -- routine, SY: freshness, completeness, duplicates, missing COGS, impossible values; confidence strip. [FSOS §1.1] [FSOS §2.1 data quality monitors]
- `tracking-health-audit` -- skill/routine, AN: pixel/server-side event loss, duplicates, match quality, UTMs. [USOPP #7] [FINPLAY-US M181]
- `profit-signal-feedback-design` -- workflow, PA: bounded test of profit-weighted values and conversion restatements (Google) / CAPI quality (Meta); negative outcomes internal-first. [FINPLAY-US F7] [FINMAP p3]

##### 13.2 Diagnosis and prioritisation (ST / FN)
- `bottleneck-finder` -- agent, ST: funnel gate map + profit waterfall + cash-trap map -> "biggest leak is X worth Y; fix X, Z, W". [FINMAP §1.1] [FINPLAY-US F2-F3]
- `profit-waterfall-dashboard` -- system/dashboard, FN: gross -> net -> GP -> CM1 -> CM2 -> EBITDA -> net profit with PVM bridge. [FINPLAY-US owner screen] [FSOS App B]
- `unit-economics-teardown` -- skill, FN: per-SKU/campaign mini P&L; "good ROAS, negative GP" finder. [FINMAP §1.1] [FSOS §1.1 campaign profit heatmap]
- `opportunity-card-writer` -- prompt/skill, ST: standard card (statement line, symptom, baseline, upside range, cash, confidence, owner, stop rule). [FINPLAY-US F3, card]
- `opportunity-ranker` -- skill, ST: (Impact x Confidence x Speed)/(Effort x Risk) + guardrails; or 60/40 lever/visibility. [FSOS §7.1] [USOPP §2]
- `owner-action-queue` -- routine, ST: 3-10 sentence actions with owner, due date, impact, approval state, realised value. [FSOS §1.1] [FINMAP §5.2 top box]
- `anomaly-to-action-agent` -- agent, AN: detect metric breaks (spend, CPM, CVR, refunds, fees, stock, tracking), root causes, bounded actions. [FSOS §6.1] [FINMAP p2]
- `narrative-reporting-agent` -- routine, AN: daily role summaries, weekly owner narrative, gross-to-net and profit narratives. [FSOS §3.11, §3.14, §6.1] [USOPP #123]

##### 13.3 Income-statement workflows
- Research (RS): `voc-language-bank`, `jtbd-and-angle-whitespace-map`, `objection-library`, `competitor-offer-monitor`, `research-to-test-handoff`. [FSOS §3.1] [FINPLAY-US 1.1] [USOPP §13]
- Positioning/launch (OF): `launch-readiness-gate`, `launch-demand-probe`, `entry-product-strategy`, `good-better-best-ladder`. [FINPLAY-US 1.2]
- Creative (CS/CPS/CPV/CW): `winning-creative-repository`, `creative-decomposition-tagger`, `hypothesis-ranked-brief-writer`, `low-fi-variation-factory` with resolution ladder, `creative-fatigue-detector`, `format-expansion`, `production-qa-check`, `creative-learning-journal`. [FINMAP p4] [FSOS §3.3] [FINPLAY-US 1.3-1.4]
- Paid media (PA): `campaign-structure-audit`, `profit-aware-budget-allocator`, `scale-kill-refresh-rules`, `high-gp-lookalike-seeds`, `inventory-aware-ad-suppression`, `marginal-cac-curve`, `incrementality-holdout-designer`, `new-channel-pilot-framework`, `budget-pacing-agent`. [FINMAP p5] [FSOS §3.2] [FINPLAY-US 1.5, 1.24]
- Search/marketplace/organic (OG/PA): `search-term-waste-queue`, `feed-attribute-completeness`, `commercial-keyword-map`, `aeo-readiness-audit`, `buying-guide-content-engine`, `marketplace-listing-repair`. [FINPLAY-US 1.6-1.8] [FSOS §3.6]
- Creators (CR): `creator-fit-scoring`, `creator-brief-from-research`, `creator-outreach-pipeline`, `affiliate-incrementality-check`, `usage-rights-economics`. [FSOS §3.7] [FINPLAY-US 1.10]
- Website/CRO (WS): `site-speed-audit`, `app-and-script-audit`, `above-the-fold-clarity-review`, `cro-backlog-manager`, `pdp-rewrite-buyer-language`, `checkout-friction-audit`, `payment-failure-recovery`, `margin-aware-merchandising`. [FINMAP p5-6] [FSOS §3.4-3.5] [FINPLAY-US 1.11-1.13]
- AOV (OF/WS): `basket-bundle-discovery`, `threshold-and-free-gift-tuner`, `post-purchase-upsell`. [FINMAP §1.3] [FINPLAY-US 1.14]
- Lifecycle/retention (RT): `abandonment-flow-optimiser` (cart/checkout/browse), `welcome-series`, `purchase-sequence-cross-sell`, `replenishment-timer`, `second-order-acceleration`, `win-back-by-lapse-stage`, `discount-necessity-model`, `deliverability-monitor`, `loyalty-roi-audit`, `subscription-suitability-model`, `lifecycle-holdouts`. [FINMAP §1.4] [FSOS §3.8] [FINPLAY-US 1.15-1.17]
- Customer care (CX): `pre-purchase-question-capture`, `reason-code-discipline`, `support-to-content-loop`, `shipping-exception-communication`. [USOPP §18] [FINPLAY-US 1.16]
- Offers/discounts (OF/FN): `discount-leakage-audit`, `offer-margin-simulator` (cut-cost-vs-volume), `promo-incrementality-analysis`, `price-elasticity-test`, `markdown-ladder`, `offer-architecture-library` (asset). [FINMAP Line 2] [FSOS §3.9] [FINPLAY-US 1.18, F6]
- Returns/chargebacks (CX/FN): `return-reason-taxonomy-loop`, `sku-return-risk-score`, `source-return-quality-board`, `pre-return-rescue`, `cod-rto-risk-scoring` (India toggle), `ndr-follow-up` (India), `chargeback-evidence-pack`, `fight-or-accept-economics`. [FINMAP Lines 3-4] [FSOS §3.10] [FINPLAY-US 1.19-1.20]
- COGS/procurement (OP): `supplier-scorecard`, `rfq-normalizer`, `moq-cash-simulator`, `input-cost-fx-exposure-board`, `cost-shock-response-ladder`, `defect-lot-feedback`, `freight-mode-optimizer`. [FINMAP Line 5] [FSOS §3.12] [FINPLAY-US 1.21]
- Fulfilment (OP): `carrier-total-cost-comparison`, `dim-weight-surcharge-audit`, `service-routing`, `split-shipment-control`, `free-shipping-subsidy-map`, `delivery-promise-accuracy`, `shipping-claim-recovery`. [FINMAP Line 6] [FSOS §3.13] [FINPLAY-US 1.22]
- Marketing measurement (AN/FN): `attribution-comparison-board`, `new-customer-identity-controls`, `mature-cohort-acquisition-quality`, `break-even-cac-roas-calculator`, `fully-loaded-marketing-ledger`. [FSOS §3.14] [FINPLAY-US 1.23-1.24]
- Opex/team (SY/ST): `saas-spend-inventory`, `usage-based-cancellation-queue`, `integration-reliability-monitor`, `agent-run-cost-controls`, `approval-inbox`, `decision-log`, `daily-role-action-summary`, `automated-handoffs`, `sop-playbook-library`, `profit-linked-team-scorecards`. [FINMAP Line 8] [FSOS §3.15] [FINPLAY-US 1.25] [USOPP §24-25]

##### 13.4 Balance-sheet and cash-flow workflows (FN / OP)
- Inventory (OP): `sku-demand-forecast` (with ad momentum), `reorder-point-safety-stock`, `aged-stock-action-queue`, `stockout-cost-estimator`, `assortment-productivity-review`, `dead-sku-stop-reorder`, `multi-location-rebalancing`, `seasonal-buy-planner`. [FINMAP §3.1] [FSOS §4.3, §5.4] [FINPLAY-US 2.2-2.3]
- Receivables/cash (FN): `settlement-aging-and-payout-reconciliation`, `reserve-release-tracker`, `marketplace-deduction-recovery`, `cod-remittance-ledger` (India), `expected-cash-date-per-order`. [FINMAP §3.2] [FSOS §4.2] [FINPLAY-US 2.1]
- Payables (FN): `three-way-invoice-match`, `supplier-terms-scenarios`, `early-pay-discount-optimizer`, `ap-anomaly-agent`, `supplier-payment-calendar`. [FSOS §4.5] [FINPLAY-US 2.5]
- Liabilities/reserves (FN): `returns-and-chargeback-reserve-model`, `gift-card-preorder-ledger`, `sales-tax-accrual-calendar`. [FSOS §4.6] [FINPLAY-US 2.5]
- Working capital (FN): `ccc-bridge-dashboard` (money freed per day by component), `working-capital-sensitivity-model`, `growth-cash-requirement-calculator`. [FINMAP §3.4] [FSOS §5.2] [FINPLAY-US connecting]
- Cash (FN): `thirteen-week-cash-forecast` (routine, weekly; daily nowcast), `liquidity-alert-bands`, `scale-affordability-gate` (agent gate before raising spend), `cash-aware-media-throttle`, `scenario-engine` (COGS, ad-cost, return, processor hold, stockout, demand spike, supplier failure, promotion, expansion). [FINMAP §4.4] [FSOS §5.1, §5.3, §5.7] [FINPLAY-US 3.1-3.2]
- Investing/financing (FN/ST): `automation-investment-roi` (incl. AI builds), `build-vs-buy-appraisal`, `capex-approval-queue`, `funding-option-comparison`, `covenant-headroom-monitor`, `distribution-capacity-review`, `capital-allocation-scorecard`, `underwriting-pack` (nGPP, payback, 90/180 GP for lenders). [FINMAP §4.3] [FSOS §5.5-5.6] [FINPLAY-US 2.6, 3.3-3.4]

##### 13.5 Systems (multi-agent / workspace level)
- `owner-control-tower` -- system, ST: one screen across P&L, loss, balance sheet, cash; three actions; drilldowns. [FINMAP §5.2] [FSOS §6.1] [FINPLAY-US owner screen]
- Role workbenches -- system, per role: media buyer (PA), CRM (RT), merchandising (WS), CX/returns (CX), procurement (OP), finance (FN). [FSOS §6.1]
- Four product workspaces -- system: profit and diagnostic; growth experiment; acquisition/lifecycle quality; inventory/cash. [FINPLAY-US agents]
- `experiment-operating-system` -- system, AN/ST: experiment register, significance gate, sub-agent watcher, guardrail monitor, playbook memory, change log/rollback. [FSOS §6.1] [FINPLAY-US measurement]
- `access-and-risk-controls` -- system, SY: read-only default, scoped writes, approval thresholds, spend caps, protected actions. [FSOS §6.1]

##### 13.6 Knowledge / asset parts
- Financial operating map (knowledge, FN): FINMAP. Financial statement OS (knowledge, FN): FSOS. Opportunity playbook US + GL (knowledge, FN). 300-opportunity backlog (asset, FN): BACKLOG. 178-opportunity portfolio (knowledge, ST): USOPP. Metric tree and guardrails (knowledge, FN). Transactions-across-statements teaching table (knowledge, FN). Test library (asset, AN). Market modules (knowledge, ST).

---

#### 14. Doc notes

##### FINMAP -- Ecommerce-OS-Financial-Operating-Map.pdf
- Path: C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\Docs\Ecommerce-OS-Financial-Operating-Map.pdf (87 KB, 7 Sep 2026 10:55; 17 pp). Text copies: tmp\pdfs\Ecommerce-OS-Financial-Operating-Map.txt (layout extraction, different hash but same content) and eos_inv extract.
- Purpose: CFO-question re-cut of the Ecommerce OS opportunity set by the three statements: where the OS grows the number, stops the leak or frees cash, and what agent/test/dashboard/loop does it.
- Audience: Kevin / founding team and prospective brand owners; written for an India-first D2C agency/OS offer (rupees, COD/RTO/UPI/WhatsApp/pincode/festive), prepaid markets as toggles.
- Structure: intro + design principle; Part 1 diagnose (bottleneck finder, data layer, CAPI feedback); Part 2 income statement Lines 1-8 (each: levers, dashboards, tests, feedback); Part 3 balance sheet (inventory, receivables/float, payables, CCC, intangibles); Part 4 cash flow (operating, investing, financing, cash diagnostic); Part 5 metric tree, owner dashboard, 7-step sequence; appendix master lever index by line (~145 one-line levers in 20 line groups).
- Quality: dense, punchy, practical; best source for India-specific mechanics and concrete tests. Accounting weaknesses later corrected by FINPLAY: "GPP" deducts ad cost (it is a contribution measure, not GP); EBITDA = operating profit; inventory purchases as investing cash; AI-as-capex and intangible-asset framing; assumes CAPI negative signals train Meta. Contains the profit-share commercial model.
- Overlaps: ~90% lever overlap with FSOS and FINPLAY; unique: resolution ladder for creative cost, COD/RTO/NDR/partial-COD specifics, WhatsApp quality rating, festive spikes, profit-share financing, "riding the wave" falling model cost framing, owner role views (media/product/geo).
- Variant status: single version; FINPLAY S4 cites it as "financial starting point".

##### FSOS -- Ecommerce_OS_Financial_Statement_Operating_System.pdf (+ .docx)
- Paths: Docs\Ecommerce_OS_Financial_Statement_Operating_System.pdf (698 KB, 23 pp, 7 Sep 10:52) and .docx (76 KB, 7 Sep 10:49). Text check: per-section lever counts identical in PDF and DOCX (472 bullets each, same 33 sections); DOCX is the editable source, PDF the render -> twins.
- Purpose: market-neutral "financial-statement architecture for a general ecommerce business": a broad, actionable OS map before implementation (breadth over workflow depth).
- Audience: product/strategy design (Kevin) and finance-literate operators; source basis = idea map + USOPP + strategy deck.
- Structure: §0 thesis + statement table; §1 25 diagnostics; §2 25 data products; §3 income statement 15 subsections (247 levers); §4 balance sheet 7 subsections (68); §5 cash flow 7 subsections (62); §6 control tower (20); §7 waves 0-4 + prioritisation formula; App A metric definitions; App B 14 dashboards; App C 6 market modules.
- Quality: most systematic and complete lever taxonomy (447 levers, each with a Proof metric); strongest on balance sheet/cash/financing (reserves, accruals, covenants, scenario engine) which FINMAP lacks; still uses GPP terminology and "Operating profit/EBITDA view"; less US-specific than FINPLAY-US; no IDs.
- Overlaps: superset of FINMAP levers; FINPLAY's 300 reuse most of its items, condensed and re-grouped with IDs/owners.
- Variant status: PDF/DOCX twins; text extract FSOS_docx.txt equivalent.

##### FINPLAY-US -- Ecommerce_OS_US_Financial_Opportunity_Playbook.md (+ PDFs)
- Paths: output\Ecommerce_OS_US_Financial_Opportunity_Playbook.md (132 KB, 1,154 lines, 7 Sep 11:31); PDFs Docs\...Playbook.pdf and output\pdf\...Playbook.pdf are byte-identical (md5 877fbab6...; ~44 pp rendered). Generated by a Codex pipeline in tmp\pdfs\us (backlog.json -> build_report.py, localize_us.py, check_report.py, qa_manifest.json, layout_check.json, report_intro.md, report_appendix.md, rendered page PNGs).
- Purpose: the detailed, US/USD edition of the 300-opportunity financial-statement playbook: diagnose -> data -> income statement -> balance sheet -> cash flow, each opportunity something an owner could commission.
- Audience: owner/operator of a US ecommerce brand, and Kevin as the OS designer; explicitly not an execution instruction set (source PDFs' agent instructions and commercial terms not adopted).
- Structure: intro (200/100 split), US operating assumptions, reading route, 7 corrections; Foundation F1-F7 (pipelines, diagnostic toolkit, sizing, data layer, definitions, worked economics and simulator, return-to-acquisition loop); Stage 1 (25 groups, 240 items), Stage 2 (6 groups, 36), Stage 3 (4 groups, 24); connecting statements (WC formulas, transactions table, operating loops); owner dashboards and 8 tools; turning backlog into work (15-step shortlist, opportunity card, measurement discipline, agents/people, rhythm); sources R1-R11 and scope switches.
- Quality: highest of the set -- accounting-correct (GP vs CM1 vs CM2; EBITDA vs EBIT; cash-flow classes; LCNRV), explicit uncertainty, stable IDs and owners, proof metric per item, US compliance hooks. Best candidate as the canonical financial model and ID spine for the catalogue.
- Overlaps: synthesises idea maps (S1), USOPP (S2), deck (S3), FINMAP (S4); FSOS not cited but most levers coincide.
- Variant status: US edition (final, 6 minutes after GL). GL twin differs only in localisation (see §12.4).

##### FINPLAY-GL -- Ecommerce_OS_Financial_Opportunity_Playbook.md (+ PDF)
- Paths: output\Ecommerce_OS_Financial_Opportunity_Playbook.md (127 KB, 1,130 lines, 7 Sep 11:25); output\pdf\Ecommerce_OS_Financial_Opportunity_Playbook.pdf (222 KB). Pipeline in tmp\pdfs (backlog.json, build_report.py, opportunities.txt, report_intro.md, report_appendix.md).
- Differences vs US: neutral currency units (CU) instead of $; no US assumptions table; IFRS references (IAS 7, IAS 38, IAS 2) instead of SEC/FASB; R7-R11 absent; 22 of 300 items differ (COD remittance ledger, conditional COD design, refusal/cancellation prevention, international search clarity etc.); DSO includes COD remittance days; source framing sentences slightly different. Otherwise identical structure and wording.
- Use: market-neutral / India-capable template; keep as the "global" variant of the same part.

##### BACKLOG -- tmp\pdfs\us\backlog.json (+ tmp\pdfs\backlog.json)
- 300 JSON records each (id, stage, group, line, title, action, measure, owner); US 142 KB, GL 141 KB; group structure identical; 22 records differ in title/action/measure; 8 US records carry reference tags [R2],[R6]-[R11].
- Purpose: structured data source for the playbook (generated before the report). Ideal seed dataset for the catalogue (stable IDs M/O/B/C, owner roles, statement line, proof metric).
- Quality: clean and consistent; no level/area/inputs fields -- needs mapping to catalogue schema.

##### USOPP -- Ecommerce_OS_US_Opportunity_Architecture_v1.0.pdf
- Path: Docs\Ecommerce_OS_US_Opportunity_Architecture_v1.0.pdf (1.28 MB, 35 pp, 5 Sep 2026 23:33). Compact and layout text copies in tmp\pdfs.
- Purpose: US-first opportunity architecture and stack-ranked growth-lever map: where an AI OS creates value across business value chain x customer journey; decide what to productise (SaaS), deliver as service (DFY) or hybrid.
- Audience: Kevin (product/offer design); prepared from the strategy deck (Ecommerce-OS-Deck-v2.pdf) and a pasted brief dated 2026-09-04.
- Structure: Part I (purpose, scoring, top-40 table, 2x2, thesis); Part II 20 domains (§6-§25) with tables (what improves, vis, lever, proof metrics, form) + questions; Part III 13-stage customer journey; Part IV productisation and adoption; Part V waves 1-4; Part VI metrics hierarchy and guardrails; App A 178-item master backlog; App B scope.
- Quality: good breadth and an explicit scoring model; scores are judgement-based (FINPLAY replaces static scores with evidence-based diagnosis); weaker on balance sheet and cash (only terms/WC analysis and inventory); no financing, reserves or cash-forecast domain.
- Overlaps: its 178 items are the seed of FSOS/FINPLAY; FINPLAY S2 cites it. Domain taxonomy (20 domains) is a useful alternative axis for the catalogue's area codes.
- Variant status: v1.0 only; lives in Docs; compact text copy in tmp\pdfs.

##### Cross-doc conclusions for the catalogue
- Use FINPLAY-US definitions (GP, CM1, CM2, EBITDA, EBIT, net profit) as the canonical P&L spine; FINMAP's GPP and FSOS's GPP map to CM1 or CM2 depending on whether ad cost is included.
- Use BACKLOG IDs (M/O/B/C) as stable part IDs for "opportunity" parts; enrich with FSOS proof metrics and USOPP visibility/lever/product-form scores where names match.
- Market variants: US (FINPLAY-US, USOPP) vs global/India (FINPLAY-GL, FINMAP, FSOS App C) should be a toggle on the same part, not separate parts.
- Gaps: no doc defines data schemas/APIs, agent prompts or permissions (USOPP App B says so explicitly; FINPLAY says next step is workflow specs); no tested implementations; benchmarks are illustrative only.
