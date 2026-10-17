# 03 · What we have vs what's missing, module by module

**Built from** `02_MASTER_INVENTORY.csv` (1,338 rows from 7 sources) and the per-source reports in `sources/`. Module numbers are from `01_ECOMMERCE_BUSINESS_MAP.md`.

## How to read this

Three columns sort every item by where it comes from:
- **Own, tested:** Kevin's items with real run evidence. All runs so far are on Grüns, which is fine because examples use public brands.
- **Own, built or planned:** exists in Creative Engine or in Kevin's 11 Oct plan, but has no run evidence yet.
- **Learn from (reference only):** course or purchased material. We may study it, but we write our own version.

**Verdict** tells us what each module needs before launch:
- **Ready to package:** we have tested items and mainly need renaming, optimising and example outputs.
- **Partial:** some own items exist; missing pieces must be built.
- **Gap:** nothing of ours is built yet. Build from scratch, using the references.

---

## 1. Summary table

| Module | Own, tested | Own, built/planned | Reference rows | Verdict |
|---|---:|---:|---:|---|
| BRAIN Brand brain | 5 | 4 | 28 | **Partial**: intake scans are tested, but the in-app builder has never run |
| M01 Intake & stage | 1 | 0 | 37 | **Gap** (the docs specify it well) |
| M02 Market · M03 Category · M04 Product research | 0 | 0 | few | **Gap** |
| M05 Expansion | 0 | 1 | 3 | Gap, low priority |
| M06 Customers, VOC & personas | 2 | 7 | 16 | **Ready to package** (research pipeline works end to end) |
| M07 Angles | in M17/M06 | | | Ready, as part of the concept generator |
| M08 Offers | 1 | 4 | 6 | **Partial**: designer works; contribution-floor maths is missing |
| M09 Brand | see BRAIN | | | Partial |
| M10 Store setup | 0 | 0 | few | Gap, low priority (one-off checklist) |
| M11 Pages & PDP copy | 3 | 3 | 21 | **Partial**: landing pages work; **no PDP copy skill** |
| M12 Product imagery | 1 | 1 | 31 | **Partial**: photoshoot and PDP image sets exist; PDP set not rendered |
| M13 Speed | 0 | 0 | few | Gap (checklist level) |
| M14 Tracking & attribution | 0 | 1 planned | 10 | **Gap** |
| M15 CRO & experiments | 4 | 2 | 13 | **Ready to package** (CRO Studio, auditor, test calculator) |
| M16 Shopify release | 0 | 0 | 7 | Gap; CRO already exports Shopify sections |
| **M17 Creative strategy & static ads** | **27+** | 40+ | 288 | **Ready to package**: the strongest area by far |
| **M18 Scripts & video** | **16** | 30+ | 225 | **Scripts ready; video production half-built** |
| M19 Meta ads | 1 | 6 (mostly planned) | 52 | **Gap** for analysis, budgets and scaling; we only have a compliance check |
| M20 Google ads | 0 | 1 planned | 10 | **Gap** |
| M21 Email / SMS / WhatsApp | 0 | **3 archived** | 24 | **Gap**: the archived retention module could close it |
| M22 SEO / AEO / GEO & organic | 4 | 5 | 44 | **Ready to package** (SEO studio, site audit, blog, AI visibility) |
| M23 Delivery, support & returns | 0 | 0 | 2 | **Gap** |
| M24 Sourcing · M27 Fulfilment | 0 | 0 | 1 | Gap, low priority for launch |
| M25 Profit & inventory | 0 | 1 planned | 5 | **Gap** |
| M26 Creators & affiliates | 1 | 1 | 3 | **Partial**: creator brief works; discovery has never run |
| M28 Seasonal / BFCM | 0 | 0 | 5 | **Gap**, and it's the launch showcase |
| SY AI operator & tooling | 4 | 7 | 196 | Partial: cost ledger, lessons loop and eval exist; agent runtime is planned only |

**In one line:** marketing creation is strong (M06, M15, M17, M18 scripts, M22). Analysis and retention are weak (M14, M19, M20, M21, M25), and so is the launch theme (M28).

---

## 2. Module notes

### BRAIN · Brand brain (first item in the catalogue)
**Have, tested:**
- `brand-visual-identity-scan` (fonts and colours from the live site)
- `website-claims-extractor`
- `brand-creative-kit-builder`
- `product-photo-tagger`
- `founder-interview-capture`

Their combined output is the Creative Engine brain format: 8 markdown docs plus `brand.json` and companion files (`sources/creative-engine-app.md` §4).

**Have, untested:** `brand-brain-builder` (in-app, never run), `brand-brain-auto-learner`, `brand-voice-style-card`.

**Learn from:**
- EAO's governed ledger. It gives evidence state and freshness on every fact, `rights_state` on quotes, a contribution floor on offers, and a claims and rights ledger.
- The Gehna brain as a worked layout. It is private, so it can't be published.
- AI CMO `brand-brain`. Don't copy its "run silently, don't tell the user" instruction.

**Build:**
- One `brand-brain-builder` with three outputs: a Claude Code folder, a single .md for ChatGPT/Claude Projects, and a short block for custom GPT instructions.
- Add the fields the Gehna review found missing: stage, margin profile, signal health, tech stack, offer records, claims register.
- Add an intake step that asks for "pack front, daily unit, out of pack, in hand, in use" photos. The missing opened-pack photo caused 6 in 10 image redos.

### M06 · Customers, VOC & personas
**Have, tested:**
- `voc-mining-pipeline`: cleans the files, redacts personal details, extracts 10 insight types with exact quotes, then clusters them into ranked themes. 131 items became 682 insights and 212 themes, at about 2¢ per item.
- `persona-builder`

**Have, untested:** `refund-reasons-to-ad-guardrails`, `buyer-objection-proof-pairs`, `voc-theme-clustering`.

**Learn from:**
- AI Operator's 24-question customer interview guide and its synthesis. Not ported, worth building.
- The awareness-stage quiz.

### M08 · Offers
**Have:** `offer-designer` (tested), plus offer research and offer naming.

**Missing:** contribution maths per offer. EAO's offer agent and the archived retention economics both show the method.

### M11 · Pages & PDP copy
**Have:** `ad-to-landing-page-builder` and `landing-page-copy-writer` (tested), `native-ad-writer`.

**Missing:**
- **A PDP copy skill.** Neither EAO nor we have a good one, so it's an easy, high-value add.
- The AI CMO "PDP laws" ("proof recurs", "one hero grammar") are worth putting into our own words.

### M15 · CRO & experiments
**Have, tested:** `dtc-landing-and-cro-studio`, `cro-page-auditor`, `cro-test-calculator-and-site-scans`.

**Learn from:**
- EAO's 170-control store audit, as a structure benchmark only.
- The course Shopify funnel data-pull prompt.

### M17 · Creative strategy & static ads (best-tested area)
**Have, tested:**

| Group | Items |
|---|---|
| Studio chain | `static-ad-generator`: plan, then words, then a stranger-read, then a sense check, then the image prompt, then render, then QA and mend |
| Planning | `static-ad-sprint-planner` (50/100 ads), `ad-concept-generator`, `creative-brief-planner` |
| References | `reference-ad-analyzer`, `reference-to-ad-remixer`, `competitor-profile-builder` |
| Copy and checks | `hook-generator`, `static-ad-qa-checker` |

Blind-judged before/after results on Grüns: static ads were mixed and the storyboard clearly improved.

**Have, untested:** 20 native image types, `creative-variety-allocator`, and more.

**Not ported, worth building:**
- **Competitor-ads stack:** collector, then Gemini breakdown, then selector.
- **13-theme ad classifier** with a heat map of open lanes.
- **Explicit creative diversity score.**
- **Hook test results tracker.**
- **Theme half-life and fatigue signals.**
- **Persona × stage × theme grid** with cell scores.
- **TOF/MOF/BOF monthly plan.**
- **Repurposing moves:** turn a video ad into statics, and reformat to every aspect ratio.

**Clean-up:**
- Three generations of static-copy skills overlap. Keep the studio chain and retire `image-ad-copywriter`.
- `scroll-stopper-static-ads` is succeeded by `tof-statics`.

### M18 · Scripts & video
**Have, tested:**
- **Script chain:** `video-ad-script-writer` with the fact checker, patcher, read-aloud editor and hooks handoff.
- **Video:** `video-shot-planner`, `ad-video-shot-director`, `fictional-ugc-avatar-studio`, `ad-video-editor`. The editor has only been tested on synthetic footage.

**Half-built:**
- Script to finished video: only 8 clips have ever been rendered, and no finished video has passed review.
- Audio finishing: loudness, silence trim, music bed.

**Not ported, worth building (from the video courses):**
- **Product-only "hyper-motion" spot:** 8 seconds, about 10 cuts, no script or person.
- **30-second selfie UGC ad in a single generation.**
- **Phone-footage colour grading.**
- **Audio finishing workflow.**
- **3-watch clip QA:** watch normal, then muted, then paused.
- **One image to 9 camera angles.**
- **Motion transfer.**

**Clean-up:** the clay pair (`claymation-ads` vs `claymation-animation`) and the comic pair have confusing names. Rename them as `<format>-ad-format-rules`.

### M19 · Meta ads (a big gap, and in demand)
**Have:**
- `meta-ad-compliance-checker` (tested)
- Untested method notes in `operator-performance`: triage, measurement, reporting, creative diversity. Nothing in the app uses them.
- Coverage gap finder (works on a simulated account)

**Learn from (AI Operator, 14 Meta skills plus the manual SOPs):**
- 30-check account audit and health score
- Leading indicators ("hook rate down, CTR stable = new openings on the same body")
- Scale/Maintain/Reduce/Kill budget tiers
- 5-point scale gate with the 20% ladder
- Break-even CPA/ROAS kill rules derived from margin
- Bid-cap ladders
- Branded-search lag test
- 17-section monthly report

**Watch out:**
- The course numbers contradict each other. Examples: budget moves of 50% vs 20%, frequency limits of 3/5 vs 2.5/3.5, concentration caps of 40/60/70%.
- Several skills auto-pause or change the account. Ours become proposals a person approves.
- The EMQ skill sends hashed personal data to Meta with no consent step.

**Tier ladder:**

| Tier | What the user does |
|---|---|
| Starter | Exports or uses an MCP to pull data into a sheet; a prompt analyses it |
| Standard | Weekly analysis skill with fixed thresholds |
| Advanced | Routine on a schedule with leading indicators |
| Production | Agent that writes proposals behind approval and budget caps |

### M20 · Google ads
**Have:** method notes only (`operator-performance/stages/google-diagnostics`), no Google connector.

**Learn from:** the AI Operator Google course, 11 skills:
- 74-check audit
- search-term negatives miner
- Quality Score triage
- Shopping SKU tiers with feed-fix lists
- PMax asset and brand-cannibalisation checks
- video drop-off
- bid guardrails
- Meta + Google + Shopify cross-channel check

The course versions contradict themselves, so we write our own.

### M21 · Email / SMS / WhatsApp (biggest gap among the core marketing modules)
**Have:**
- **Archived on git tag `archive/retention-r1-r6`:** a `retention-strategy` skill, an `email-copy` skill and a full Retention module (R1–R6, 76 files, with tests). It was never merged, and is the strongest own asset here.
- 4 retention docx files in `skills/` as notes.

**Learn from:**
- AI CMO: post-purchase 5-email flow, flow priority tiers by vertical, 12 Klaviyo segments, 15-point Klaviyo audit, email design method.
- EAO's recovery agent and LTV agent, for structure only.

**Decide:** revive the archived module or rebuild from it. Either way the skills (strategy, email-copy) can be packaged quickly.

### M22 · SEO / AEO / GEO & organic
**Have, tested:** `dtc-search-growth-studio`, `seo-aeo-geo-site-auditor`, `brand-led-seo-blog-writer`, `ai-search-visibility-tracker` (80 visibility calls).

**Untested:** `geo-citation-outreach-planner`, `founder-content-calendar`.

### M25 · Profit, inventory & priorities
**Have:** nothing built. Kevin's plan specifies a `metric-registry` ("an LLM never calculates the ledger").

**Learn from:**
- The Ecommerce OS financial docs: P&L waterfall, 300-opportunity `backlog.json`, 13-week cash.
- EAO's profit agent.

**Starter tier is easy:** export from Shopify, paste into a sheet, and a prompt gives contribution by SKU and campaign.

### M26 · Creators & affiliates
**Have:** `ugc-creator-brief` (tested). `creator-discovery-agent` has never had a live run.

**Missing:** outreach, rights and whitelisting checklist, affiliate economics.

### M28 · Seasonal / BFCM (launch showcase)
**Have:** none as items. The parts exist in other modules: offers (M08), sprint planner (M17), scripts (M18), email (M21).

**Build:** a **BFCM pack**, which is a system-level item chaining the pieces we already have:

1. Promotion calendar and workback
2. BFCM offer ladder (M08)
3. 50-ad BFCM sprint (M17)
4. Video scripts (M18)
5. Email/SMS sequence (M21, from the retention skills)
6. Landing page (M11)
7. Stock check (M25 starter)

It shows off the whole "parts to build a car" idea with mostly existing parts.

### SY · AI operator & tooling
**Have, tested:** `creative-feedback-learner` (lessons loop), `creative-before-after-eval` (blind judge), the AI call and cost ledger.

**Planned in Kevin's 11 Oct plan:**
- hosted data foundation
- connector ingestion routine
- authority and policy executor (L0–L3)
- conditional lesson memory

**Learn from (AI Operator agent system, 6 layers):**
- heartbeat, wakeups, issue tracker with checkout and expiry, delegation with depth ≤3
- proposals with expiry and impact scoring
- self-reflection that grades past predictions with maths
- the baseline pyramid for thresholds
- lesson promotion after 3 confirmations and 30 days

Their starter code doesn't run as shipped and has security gaps, so we take the designs only.

---

## 3. Duplicates and clean-up (from all sources)

| Duplicate | What to do |
|---|---|
| `Ecommerce OS\AI CMO\` (12.6 GB) | Older copy of Creative Engine skills. Copy `flow-chart-v2.png` into CE, then archive the folder. |
| Skool AI Operator **Skills Vault** | 35 of its 36 skills are byte-identical to the Creative and Facebook packs. |
| Sibling `skool\AI_Operator_Knowledge_Base` | Byte-identical to the nested copy, except for one INSTRUCTIONS.md. |
| `Creative_Engine_Export` inside AI Operator | An unmerged restructure; its only unique files are placeholders. |
| CE script writers | Three generations: `video-ad-copywriter`, then `video-ad-scripts`, then the `script-flow` family. Keep `script-flow`. |
| CE static copy | `image-ad-copywriter`, then `image-ad-copy`, then the studio chain. Keep the studio chain. |
| CE voice/copy checks | 8 skills police the same "machine copy" patterns. Merge them into one checker with parts. |
| CE photo factories | `Photoshoot Factory`, `instant-photoshoot`, `flash-photography`, `asset-generator-cmo`. Merge into one photoshoot skill with tiers. |
| `gehna brand brain\Products\` | 60 MB duplicate of `assets\`. |

## 4. Naming fixes (renaming is step 1 of the next phase)

Every CSV row has a `proposed_name`. The main problems:

| Problem | Examples |
|---|---|
| Internal or cryptic names | `copy-floor`, `taste`, `brief-v2`, `generate-50`, `words-read`, `sense-check`, `tof-statics`, `operator-*` |
| A real creator's name | `zack-d-films-ads` becomes `cgi-mechanism-explainer-ad`. Renaming it touches 4 app files. |
| Vendor names | `foreplay-*`, `gpt-image-ads`, `asset-generator-cmo` |
| Look-alike pairs | `claymation-ads`/`claymation-animation`, `image-ad-copy`/`image-ad-copywriter`, `review`/`review-ads`/`review-mining` |

The README counts are also stale: native types are 20, not 12; script types are 19, not 15.

## 5. Things we will not adopt, from any source

- Hidden instructions to the AI: "run silently", "never tell the user", "this skill OVERRIDES auto-mode".
- API keys saved into Claude settings or put in URLs. Telling users to turn on Bypass Permissions.
- Invented proof: default 4.9 ratings, "[N] bought today", made-up stats in sample outputs.
- Voice cloning or likeness of real people. Blending real photos into an "influencer".
- Hiding that content is AI. Pitch-shifting audio to dodge originality checks. Policy-dodging ad wording.
- Automatic pausing, killing or budget changes without approval.
- Sending hashed customer data without a consent step.
- Copying or closely imitating EAO content. Its licence bans "substantially similar" products, and its own template and video rights are unresolved.

## 6. Rights in one line per source

| Source | Rights | Use |
|---|---|---|
| Creative Engine (own rows) | own | Package, rename, optimise |
| Kevin's 11 Oct plan PDF | own | Design source for agents and systems |
| Skool AI CMO, AI Operator, Video courses, Nuova Era | course | Learn from; rebuild in own words |
| Ecom Agent OS | purchased | Benchmark for structure only; licence forbids similar products |
| Static Ad / PDP / Photoshoot Factory swipe images, Foreplay/Pinterest images | third-party ads | Keep as private reference; never show on the site |
| Gehna brand brain | private client data | Never publish; case study later only with permission |
