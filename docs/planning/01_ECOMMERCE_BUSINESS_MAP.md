# 01 · The ecommerce business, broken into parts

**Purpose:** this is the spine the whole catalogue hangs on. Every prompt, skill, routine, workflow, agent and system belongs to one **module** below. The site's main navigation follows the same structure.

**Built from:** the 18 Ecommerce OS planning docs (full detail and citations in `sources/ecommerce-os.md` §1 and Appendices A–E). It is benchmarked against the 16-agent map in the purchased Ecom Agent OS (`sources/ecom-agent-os.md` §2). Module numbers M01–M25 come from the Data & Engineering Handbook / Complete Product Blueprint. M26–M28 are new, added to fill gaps those docs leave.

---

## 1. The map at a glance

The business runs in seven groups, following the order a brand meets them.

| Group | Modules | What the group decides |
|---|---|---|
| **A. Direction & research** | M01 Intake & stage · M02 Market · M03 Category · M04 Product research · M05 Expansion · M06 Customers & VOC · M07 Angles & untapped uses | What to sell, to whom, and why they'd buy |
| **B. Product, supply & cost** | M24 Sourcing, BOM & cost · M27 Fulfilment & delivery | Can we make it, ship it and keep margin |
| **C. Offer, brand & store foundation** | M08 Offers & economics · M09 Brand · M10 Store & account setup | What we promise and how we sound and look |
| **D. Store, conversion & measurement** | M11 Pages & PDP copy · M12 Product imagery · M13 Speed · M14 Tracking & attribution · M15 CRO & experiments · M16 Shopify release | Does the visit turn into a purchase, and can we trust the numbers |
| **E. Creative, acquisition & discovery** | M17 Creative strategy & references · M18 Scripts & video · M19 Meta ads · M20 Google ads & feeds · M22 SEO / AEO / GEO & organic · M26 Creators & affiliates | How strangers find us and why they click |
| **F. Post-purchase & retention** | M21 Email / SMS / WhatsApp & seasonal · M23 Delivery, unboxing, support & returns | Do customers come back and tell others |
| **G. Money & the business** | M25 Profit, inventory & priorities · M28 Seasonal & launch planning (BFCM) · Finance & admin · People & team | Is it making money and what to do next |
| **Cross-cutting** | **Brand brain** (feeds almost everything) · **AI operator setup** (SY: connectors, cost, approvals, agents) | The shared foundation every item uses |

### Why add M26–M28
- **M26 Creators & affiliates:** no doc gives creators/affiliates a module, but EAO has a dedicated agent for them.
- **M27 Fulfilment & delivery:** this lives only inside other docs' lifecycle sections. It needs to be a module.
- **M28 Seasonal & launch planning:** BFCM and festival planning is scattered across the docs. Kevin's launch showcase is a BFCM pack, so it needs its own module.

---

## 2. Every module: sub-parts and catalogue area

Area codes match the inventory CSVs (`sources/_SCHEMA.md`).

### A. Direction & research
| # | Module | Area | Sub-parts (what items in this module do) |
|---|---|---|---|
| M01 | Business intake & stage diagnosis | ST | goals, constraints, store and ad-account data, stage S0–S5, the one constraint worth solving, "unknown ≠ zero" |
| M02 | Market research & demand validation | RS | market definition, sizing, search intent, seasonality, willingness to pay, substitutes; output is a go / sample / reject memo |
| M03 | Category research | RS | category tree, price tiers, buying criteria, operating burdens (fragile, returns, shelf life) |
| M04 | Product research & validation | OF | review mining, competitor teardowns, spec, concept test, samples, landed-cost / MOQ feasibility |
| M05 | Expansion (existing brand) | ST | portfolio audit, assortment gaps, adjacency, new markets, cannibalisation |
| M06 | Customers, VOC & personas | RS | review/ticket/survey mining, jobs-to-be-done, triggers, objections, proof needs, personas traced to evidence |
| M07 | Angles & untapped situations | CS | workarounds, off-label uses, counter-positioning, angle matrix, claim gate |

### B. Product, supply & cost
| # | Module | Area | Sub-parts |
|---|---|---|---|
| M24 | Sourcing, BOM & cost improvement | OP | make-vs-buy, supplier discovery & RFQ, samples & QC, negotiation (human), BOM / should-cost, supplier scorecards, inbound freight & duty |
| M27 | Fulfilment & delivery | OP | self vs 3PL, carrier routing, SLA, failed-delivery handling, tracking messages, WISMO, packaging spec |

### C. Offer, brand & store foundation
| # | Module | Area | Sub-parts |
|---|---|---|---|
| M08 | Offers, bundles & economics | OF | value proposition, bundles, good-better-best, guarantees, shipping thresholds, subscriptions, contribution floor per offer, offer kept the same across ad, page, email and pack |
| M09 | Brand strategy, voice & identity | BF | positioning, voice do/don't, visual system, claims & proof register, brand enemy |
| M10 | Store, domain & account setup | WS/SY | domain, email auth, payments, shipping, policies, test checkout, ad / analytics / ESP account register |

### D. Store, conversion & measurement
| # | Module | Area | Sub-parts |
|---|---|---|---|
| M11 | Landing pages, PDP & copy | WS | PDP, campaign page, advertorial, listicle, comparison, quiz; message match to the ad; page brief & copy rubric |
| M12 | Product imagery & catalogue assets | CPS | gallery roles (hero, scale, use, contents, proof, care), photoshoots, fidelity check |
| M13 | Site speed | WS | LCP / INP / CLS targets, app residue, regression checks |
| M14 | Tracking, attribution & event quality | AN/FN | pixel + CAPI, dedup, UTMs, consent, order reconciliation, attribution vs incrementality |
| M15 | CRO & experiments | WS | repair vs investigate vs test, sample size, 5 outcome classes, low-traffic alternatives |
| M16 | Shopify implementation & release | WS | theme / section work, preview, test orders, rollback |

### E. Creative, acquisition & discovery
| # | Module | Area | Sub-parts |
|---|---|---|---|
| M17 | Creative strategy, references & copy | CS/CW | reference capture & breakdown, concept briefs, hooks, angle × persona × stage grid, creative diversity, fatigue, static ad production, compliance |
| M18 | Scripts, video & editing | CPV | script → scenes → clips → edit; UGC, founder, podcast, animation formats; audio finishing; clip QA |
| M19 | Meta ads operations | PA | account audit, structure & naming, test design, budgets, scale gates, kill rules, leading indicators |
| M20 | Google ads & product feeds | PA | search terms & negatives, Shopping feed tiers, PMax, Quality Score, bid guardrails |
| M22 | SEO / AEO / GEO & organic social | OG | crawl & schema, collection pages, buying guides, AI-answer visibility, citation outreach, organic posts |
| M26 | Creators, influencers & affiliates | CR | creator fit, outreach, briefs, usage rights / whitelisting, disclosure, affiliate economics |

### F. Post-purchase & retention
| # | Module | Area | Sub-parts |
|---|---|---|---|
| M21 | Email / SMS / WhatsApp lifecycle | RT | welcome, browse / cart / checkout recovery, post-purchase, replenishment, cross-sell, VIP, win-back, sunset; segments; frequency rules; campaigns |
| M23 | Delivery, unboxing, support & returns | CX | unboxing moments, first-use guides, support triage & replies, returns taxonomy, root cause back to product / page / ad, neutral review asks |

### G. Money & the business
| # | Module | Area | Sub-parts |
|---|---|---|---|
| M25 | Profit, inventory & priorities | FN | contribution by order / SKU / campaign / channel, CAC & payback, reorder points, stock cover, missing costs block profit claims |
| M28 | Seasonal & launch planning | ST | BFCM / festival calendar, launch workback, offer + creative + email + stock plan for one event |
| — | Finance & admin | FN | monthly bridge, 13-week cash forecast, payout reconciliation, tax, contracts |
| — | People & team | ST | role scorecards, playbook training, agency / client workspaces |

### Cross-cutting
| Part | Area | What it is |
|---|---|---|
| **Brand brain** | BF | Brand, products, offers, personas, claims (with proof and status), voice, look, competitors, winning ads, recent changes. Optional for analysis items; required or strongly recommended for anything that makes copy, ads or pages. |
| **AI operator setup** | SY | Connectors (Shopify, Meta, Google, GA4, Klaviyo), cost and model routing, approvals ("prepare, don't publish"), run logs, agent runtime |

---

## 3. Stage ladder: which modules matter when

Stages from the "What good looks like" doc. The catalogue uses them as a **filter** ("show me what matters at my stage"). They do not lock anyone out: the universal basics apply at every stage.

| Stage | Size | What good looks like | Modules that matter most |
|---|---|---|---|
| **S0 Explore** | 0 orders | pick a winnable category and a product you can source; store live in under 30 days | M02, M03, M04, M24, M08, M10 |
| **S1 Launch** | 1–30 orders/mo, <$50/day ads | 30 cold orders with positive contribution on at least 1 angle; 1 product, 2–3 personas, 1 landing page, 4–8 creatives/mo, 3 email flows | M06, M09, M11, M12, M14, M17, M19, M21 (basics) |
| **S2 Grow** | 30–300 orders/mo, $50–500/day | a repeatable angle that holds margin while spend doubles; creative volume; offer tests; first real page work | M07, M08, M15, M17, M18, M19, M21 |
| **S3 Scale** | 300–3k orders/mo, $500–5k/day | 3–5 personas, each with its own page and creative line; 40–80 new creatives/mo; real A/B tests; email >25% of revenue | M17–M22, M25, M26, M28 |
| **S4 Growth co.** | 3k–20k orders/mo | defend margin, add products and channels, SEO pays back, incrementality tests | M05, M20, M22, M24, M25 |
| **S5 Large** | 20k+ orders/mo | marginal gains, portfolio decisions, governance across teams and agencies | all, with focus on M14, M15, M25, people |

---

## 4. The customer's journey: where each module shows up

The site can also be browsed this way, for owners who think in terms of their customer rather than their departments.

| # | Customer step | Modules |
|---|---|---|
| 1 | Has a need / trigger | M02, M06, M07 |
| 2 | Discovers the brand (ad, search, creator, AI answer) | M17, M18, M19, M20, M22, M26 |
| 3 | Clicks and lands | M11, M13 |
| 4 | Evaluates (PDP, reviews, images) | M11, M12 |
| 5 | Decides on cart and offer | M08, M15 |
| 6 | Checks out and pays | M15, M16 |
| 7 | Gets the confirmation and post-purchase upsell | M21 |
| 8 | Waits for delivery | M27 |
| 9 | Unboxes | M23 |
| 10 | First use | M23, M21 |
| 11 | Has a problem / support | M23 |
| 12 | Leaves a review or feedback | M23 → back to M06 |
| 13 | Buys again | M21, M08 |
| 14 | Becomes a VIP or refers others | M21, M26 |
| 15 | Lapses / win-back | M21 |

---

## 5. The money behind it

There is one P&L waterfall. Each module pulls on a line of it, so a module's items can say which number they move. Full detail is in `sources/ecommerce-os.md` §1.6.

Gross revenue
→ − discounts
→ − returns / RTO / refunds
→ − chargebacks
→ **net revenue**
→ − landed COGS
→ **gross profit**
→ − shipping, fees, pick-pack
→ **CM1**
→ − marketing
→ **CM2** ("did this order make money")
→ − fixed costs
→ **EBITDA**

Rules the catalogue adopts:
- ROAS is a diagnostic, never the goal.
- A conversion win doesn't count if returns, margin, cash or complaints get worse.
- Missing cost data blocks any profit claim.

---

## 6. How the benchmark lines up

The 16 Ecom Agent OS agents mapped onto these modules. We use their map for structure and coverage only, never their content (see the licence in `sources/ecom-agent-os.md` §9).

| EAO agent | Our module |
|---|---|
| 01 Customer voice & objections | M06 |
| 02 Competitor tracker | M17 (references) / M02 |
| 03 Offers & bundles | M08 |
| 04 Creative strategist | M17 |
| 05 Static ad generator | M17 / M12 |
| 06 UGC video | M18 |
| 07 Performance marketing | M19, M20, M14 |
| 08 PDP & merchandising | M11, M12 |
| 09 Landing pages & CRO | M11, M15 |
| 10 Email / SMS / WhatsApp recovery | M21 |
| 11 Repeat purchase & LTV | M21, M25 |
| 12 SEO / GEO | M22 |
| 13 Creator & affiliate | M26 |
| 14 Profit & attribution | M25, M14 |
| 15 Customer care | M23 |
| 16 Operator | M28, M24, M27 |

They have no agent for M01–M05, M09 (they use a ledger instead), M10, M13, M16, M24 sourcing detail, or finance & admin.
