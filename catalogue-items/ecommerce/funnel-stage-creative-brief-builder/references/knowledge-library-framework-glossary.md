# Framework Glossary

**Every named framework in the library, in plain English. Alphabetical.**

If you hear a term on a call and can't place it, look here first.

---

## 30-Point Framework (Meta)

**What:** A 30-check audit framework for Meta ad accounts. Covers pixel/CAPI tracking, creative performance, account structure, and audience. Each check carries a severity multiplier (Critical 5x, High 3x, Medium 1.5x, Low 0.5x) and rolls up into a 0-100 weighted score.

**Where:** `01-Auditing-and-Diagnostics/33-Your-First-Audit-Build/audit-scoring-rubric.md`

**Use when:** Auditing a Meta account from scratch or evaluating an incumbent agency's setup.

---

## Google Audit Framework

**What:** A parallel audit framework for Google Ads accounts, built on the same scoring math as the Meta 30-point framework. Suggested categories: Conversion Tracking (30%), Search Term and Keyword Hygiene (25%), Quality Score Health (20%), Account Structure (15%), Audience and Targeting (10%). Start with 25-35 checks, tuned to your own account mix.

**Where:** `01-Auditing-and-Diagnostics/33-Your-First-Audit-Build/audit-scoring-rubric.md` (Google Ads section)

**Use when:** Auditing a Google Ads account or benchmarking a new prospect.

---

## 5-Point Readiness Checklist (Scaling)

**What:** The 5 checks that must pass before scaling a campaign: Efficiency, Creative, Audience, Funnel, Inventory.

**Where:** `05-Operations-and-Growth/50-Budget-Plus-Scaling-Plus-Cross-Platform/scaling-readiness-5-point-checklist.md`

**Use when:** Deciding whether a campaign can absorb a +20/+30/+50% budget move.

---

## 3-Layer Hook System

**What:** A framework for building ads where the hook operates simultaneously at three layers: visual (what they see in the first 0.5 seconds), caption (the first line of text), and voiceover (the first spoken words).

**Where:** `03-Copy-and-Hooks/43-3-Layer-Hook-System/`

**Use when:** Designing a hook for a video or UGC ad.

---

## 4-Signal Budget Scorecard

**What:** A system for scoring any campaign's budget deservedness using 4 weighted signals: ROAS (35%), Volume (25%), Trend (20%), Creative Freshness (20%). Outputs SCALE / MAINTAIN / REDUCE / KILL.

**Where:** `05-Operations-and-Growth/50-Budget-Plus-Scaling-Plus-Cross-Platform/budget-allocation-scorecard.md`

**Use when:** Weekly budget reviews. Allocating budget across 10+ campaigns.

---

## Awareness Stages (Eugene Schwartz)

**What:** Five stages a prospect passes through: Unaware, Problem Aware, Solution Aware, Product Aware, Most Aware. Each stage requires different copy, creative, and offers.

**Where:** `03-Copy-and-Hooks/44-UGC-Plus-Copy-Frameworks/awareness-stage-copy-matrix.md`

**Use when:** Matching copy framework to buyer stage. Deciding what angle a new creative should take.

---

## Bold Claim (Hook Tactic)

**What:** A hook tactic that opens with a specific, confident, number-backed statement. "89% of women see results by day 14."

**Where:** `03-Copy-and-Hooks/42-Hook-Library/`

**Use when:** Building ads for Product Aware or Most Aware audiences. Good for social proof angles.

---

## Brand DNA

**What:** A structured document capturing a client's visual and verbal identity, used as input for image generation and copy. Covers identity, visual DNA, voice DNA, packaging, brand mark, angles, competitive positioning, compliance, and forbidden patterns.

**Where:** `05-Operations-and-Growth/49-Brand-DNA-Plus-Image-Pipeline/brand-dna-extraction-template.md`

**Use when:** Onboarding a new client. Setting up the Sage pipeline. Briefing a new designer.

---

## CBO (Campaign Budget Optimization)

**What:** Meta's native system for distributing campaign budget across ad sets dynamically. Meta picks winners within the campaign.

**Use when:** Single audience tests work well with ABO; CBO is better when you have 3+ audiences or want Meta to pick.

---

## Confession (Hook Tactic)

**What:** A hook tactic that opens with vulnerability or admission. "I was wrong about serums."

**Where:** `03-Copy-and-Hooks/42-Hook-Library/`

**Use when:** Targeting Problem Aware audiences. Especially effective for skincare, wellness, and self-improvement verticals.

---

## Diff Check

**What:** The table in an A/B test design that confirms only ONE variable differs between variants. If more than one row says "different," the test is confounded.

**Where:** `05-Operations-and-Growth/51-AB-Test-Plus-Monthly-Report/ab-test-design-worksheet.md`

**Use when:** Before launching any A/B test.

---

## Fatigue (Creative)

**What:** The point at which a creative's performance degrades because the audience has seen it too many times. Detected by rising frequency (>3.5) and declining CTR (>15% week-over-week drop).

**Use when:** Deciding when to retire an ad. Triggering new creative production.

---

## Hook Rate

**What:** 3-second video plays divided by impressions. For static, CTR serves as the equivalent. Measures whether the hook earned attention.

**Target:** 20%+ for video, 1.5%+ CTR for static.

**Use when:** Evaluating hook tests. Identifying which creatives need hook rewrites.

---

## Jordan (Agent)

**What:** The copywriting agent in the Your Agency stack. Writes ad copy, UGC scripts, and emails using frameworks (PAS, Social Proof, etc.) conditioned on brand DNA and persona.

**Where:** `lib/agents/copywriting/` (Your Agency repo)

---

## LAL (Lookalike)

**What:** A Meta audience built by modeling a seed audience (e.g., recent purchasers) and finding similar users. LAL-1% is the top 1% match; LAL-3% is broader.

**Use when:** Prospecting (TOF cold). LAL-1% on purchasers is usually the warmest cold audience you can build.

---

## MDE (Minimum Detectable Effect)

**What:** The smallest lift an A/B test can reliably detect at a given sample size. If the observed lift is below MDE, you have a tie.

**Where:** `05-Operations-and-Growth/51-AB-Test-Plus-Monthly-Report/ab-test-design-worksheet.md`

**Use when:** Designing a test. Interpreting results.

---

## MER (Marketing Efficiency Ratio)

**What:** Total revenue divided by total ad spend, blended across all platforms. The truest measure of paid marketing performance because it does not rely on platform-reported attribution.

**Target:** Varies by margin. DTC supplement: 3.0-4.0. Apparel: 2.5-3.5.

**Use when:** Monthly reports. Budget decisions. Cross-platform fatigue reviews.

---

## Mia (Agent)

**What:** The media-buying agent. Analyzes campaign performance, recommends budget shifts, flags fatigue, runs the weekly budget scorecard.

**Where:** `lib/agents/facebook-ads/` (Your Agency repo)

---

## One-Variable Rule (A/B Testing)

**What:** The rule that an A/B test must change exactly one variable between variants. Two or more variables = confound, not a test.

**Use when:** Every test design. If tempted to "test two things at once," either redesign or accept you are running a concept test, not an A/B.

---

## PAS (Problem-Agitate-Solution)

**What:** A copy framework. Name the problem, agitate it (emotional stakes), present the solution.

**Use when:** Problem Aware and Solution Aware audiences. Most common framework in direct response.

---

## PMax (Performance Max)

**What:** Google's fully automated campaign type. Mixes Search, Shopping, Display, YouTube, Gmail, Discovery based on AI allocation.

**Use when:** Accounts with clean conversion tracking and enough volume for the algorithm to learn. Always split brand from non-brand with asset group structure.

---

## Riley (Agent)

**What:** The creative review agent. Evaluates designer / editor submissions against the brief. Checks brand compliance, visual quality, message clarity.

**Where:** `lib/agents/creative-review/` (Your Agency repo)

---

## ROAS (Return on Ad Spend)

**What:** Revenue divided by ad spend for a single platform or campaign. Platform-reported ROAS usually overstates truth; Shopify-reconciled ROAS is closer to reality.

**Target:** Varies by margin and channel. Meta TOF: 1.8-2.5 is fine for growth. Google brand: 5.0+.

---

## Sage (Agent)

**What:** The creative generation agent. Turns briefs into ad images using Gemini 2.5 Flash + REVE Fast Edit + Riley QA.

**Where:** `lib/agents/sage/` (Your Agency repo)

---

## Schwartz Awareness Stages

See **Awareness Stages**.

---

## Shopify-Reconciled Revenue

**What:** Revenue attributed in Shopify (either by UTM, channel, or post-purchase survey), used as the source of truth over platform-reported revenue.

**Use when:** Every budget decision. Every monthly report reconciliation.

---

## Split Test (Meta)

**What:** Meta's native A/B testing tool. Distributes budget and audience evenly between two or more variants. Cleaner than running "2 ads in one ad set."

**Use when:** Any serious A/B test. Prevents Meta's optimization from concentrating spend on one variant.

---

## TEEP Framework

**What:** A 4-element ad psychology model: Trigger (what makes the buyer notice), Emotion (the feeling the trigger carries), Evidence (why believe this works), Payoff (what they get if they buy).

**Where:** `04-Psychology-and-Strategy/47-Buyer-Psychology-TEEP/teep-framework-card.md`

**Use when:** Writing a psychology brief. Designing a full-funnel creative strategy.

---

## Theme (Creative)

**What:** A recurring creative angle (Lifestyle, Problem-Solution, Social Proof, Founder-Story). Each has a copy spine, visual spine, stage fit, and fatigue signal. Start with 4-5 themes, add more as your brand voice demands.

**Where:** `04-Psychology-and-Strategy/48-Theme-Plus-Prompt-Pipeline/theme-library-catalog.md`

**Use when:** Every creative brief. Weekly theme mix analysis in reports.

---

## TOF / MOF / BOF

**What:** Top of Funnel (cold prospecting), Middle of Funnel (engagement, video views, light retargeting), Bottom of Funnel (high-intent retargeting: ATC, view-product, past purchasers).

**Use when:** Campaign structure. Audience naming conventions.

---

## UGC (User-Generated Content)

**What:** Content filmed by a creator (real customer or contracted creator) in a non-studio, native style. Typically phone-shot, selfie-camera, conversational.

**Where:** `03-Copy-and-Hooks/44-UGC-Plus-Copy-Frameworks/ugc-script-templates.md`

---

## Us vs Them (Copy Framework)

**What:** A copy framework that positions your product against an incumbent category solution. "Most serums pile on actives. We use just three."

**Use when:** Solution Aware and Product Aware audiences. Premium positioning.

---

## Winner (A/B Test)

**What:** A variant that beats the control by more than the MDE with acceptable statistical confidence. If the lift is smaller than MDE, there is no winner — it is a tie.

**Use when:** Declaring test outcomes. Do not adopt "winners" that did not clear MDE.

---

## Acronyms quick reference

| Term | Full name |
|---|---|
| ABO | Ad Set Budget Optimization |
| AOV | Average Order Value |
| ATC | Add To Cart |
| BOF | Bottom Of Funnel |
| CAC | Customer Acquisition Cost |
| CBO | Campaign Budget Optimization |
| CPA | Cost Per Acquisition |
| CPM | Cost Per Mille (per 1,000 impressions) |
| CTR | Click-Through Rate |
| CVR | Conversion Rate |
| DTC | Direct To Consumer |
| LAL | Lookalike (audience) |
| LP | Landing Page |
| LTV | Lifetime Value |
| MDE | Minimum Detectable Effect |
| MER | Marketing Efficiency Ratio |
| MOF | Middle Of Funnel |
| PAS | Problem Agitate Solution (copy framework) |
| PDP | Product Detail Page |
| PMax | Performance Max (Google) |
| PV | Page View |
| ROAS | Return On Ad Spend |
| SKU | Stock Keeping Unit |
| TOF | Top Of Funnel |
| UGC | User-Generated Content |
| UTM | Urchin Tracking Module (URL parameters) |
| YoY | Year Over Year |
