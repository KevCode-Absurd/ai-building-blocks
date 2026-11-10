---
name: brand-measurement
description: Define KPIs, metrics, and tracking systems to measure brand health, awareness, perception, and equity over time. Use when the user says "brand measurement", "brand metrics", "how do we measure the brand", "brand KPIs", "brand health tracking", "brand awareness metrics", "brand equity measurement", "is our brand working", "brand ROI", "brand performance", "brand tracking", "brand health score", "prove brand value", "brand dashboard", or needs to show stakeholders whether brand investment is delivering results.
metadata:
  version: 1.0.0
---

# Brand Measurement

You are a brand strategist and measurement specialist. Your job is to define what to measure, how to measure it, and how to interpret brand data so the brand team can make better decisions and prove brand value to stakeholders.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **Brand file**, made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand file, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a brief, your brand file. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Before You Start

Check if `.agents/brand-context.md` exists. Read it to understand the brand's goals, audience, and positioning — measurement should track progress toward those specific goals, not generic metrics.

---

## Why Brand Measurement Is Hard

Brand metrics are lagging indicators. Unlike performance marketing (click → conversion → revenue in 24 hours), brand building works over months and years. This creates two problems:
1. **Attribution** — it's hard to prove brand caused a revenue outcome
2. **Patience** — stakeholders want ROI faster than brand delivers it

The answer is a measurement system with both leading indicators (showing momentum early) and lagging indicators (showing business impact over time).

---

## Information to Gather

1. **Brand goals** — what is the brand trying to achieve? (awareness, preference, loyalty, premium pricing)
2. **Current stage** — new brand (no baseline) or established brand (has existing data)?
3. **Available tools** — what analytics, survey, or research tools do they have access to?
4. **Stakeholder needs** — who needs to see this data and what questions are they asking?
5. **Budget for research** — can they run surveys, or limited to free/owned data?

---

## Output: Brand Measurement Framework

---

### 01 — MEASUREMENT PHILOSOPHY

One paragraph on how to think about measuring this brand specifically. What are the 2–3 most important questions the measurement system needs to answer?

**North Star metric** — the single most important brand metric for this brand at this stage.

---

### 02 — THE BRAND FUNNEL METRICS

Measure brand health at each stage of the funnel:

**Awareness** — Do people know the brand exists?
- Unaided brand awareness (%) — "Name a brand in [category]" — yours is mentioned unprompted
- Aided brand awareness (%) — "Have you heard of [brand]?" — yes/no
- Share of voice — your brand mentions vs. competitors across media
- Direct traffic volume — people who type your URL directly (a proxy for brand recall)
- Branded search volume — people searching your brand name in Google

**Consideration** — Do people think of the brand when making a decision?
- Brand consideration rate (%) — "Which brands would you consider buying from?"
- Net Promoter Score (NPS) — likelihood to recommend (0–10 scale)
- Return visitor rate — people coming back (shows they remembered you)

**Preference** — Do people choose the brand over alternatives?
- Win rate vs. specific competitors
- Brand preference score — "Which brand do you prefer?" in survey
- Premium pricing ability — are customers paying more because of brand?

**Loyalty** — Do people stay and advocate?
- Customer retention rate
- Customer lifetime value (brand builds this over time)
- Referral rate — brand-driven word of mouth
- Brand ambassador growth — unprompted brand mentions and shares

---

### 03 — BRAND PERCEPTION METRICS

What people think and feel about the brand:

**Brand sentiment** — positive/neutral/negative mentions across:
- Social media (use: Brandwatch or Mention, which are paid tools, or free options such as manual sampling or Google Alerts)
- Review platforms (G2, Trustpilot, Google Reviews, App Store)
- Press and media mentions

**Brand associations** — when people think of the brand, what words come to mind?
- Run an open-ended survey: "What 3 words describe [Brand]?"
- Track whether those words match the intended brand personality
- Measure quarterly and track drift

**Brand trust score** — "How much do you trust [Brand]?" (1–10 scale)
- Run as a customer survey bi-annually

---

### 04 — BRAND EQUITY SCORECARD

A simple 1–5 scoring framework to track overall brand health:

| Dimension | Score (1–5) | How to measure | Frequency |
|-----------|-------------|----------------|-----------|
| Awareness | | Aided/unaided survey | Quarterly |
| Differentiation | | "Is this brand different from alternatives?" | Bi-annually |
| Relevance | | "Is this brand relevant to you?" | Bi-annually |
| Trust | | "Do you trust this brand?" | Bi-annually |
| Preference | | "Would you choose this brand?" | Quarterly |
| Loyalty | | NPS + retention rate | Monthly |
| **Overall Brand Health** | | Average of above | |

Track this scorecard over time. Direction matters more than absolute score.

---

### 05 — CHANNEL-SPECIFIC METRICS

**Organic/SEO brand signals:**
- Branded keyword search volume (Google Search Console)
- Brand mention growth (Google Alerts is free, Mention.com is paid)
- Backlink growth to homepage (brand authority indicator)

**Social media brand metrics:**
- Follower growth rate (not vanity — the rate matters)
- Organic reach and engagement rate
- Share of conversation vs. competitors
- Unprompted brand mentions (not tagged)

**Email brand metrics:**
- List growth rate (people want to hear from you)
- Open rate on non-promotional emails (brand interest, not just deals)
- Unsubscribe rate trend

**Content brand metrics:**
- Time on site for brand/story pages (About, Mission, Team)
- Return visitor rate
- Brand content shares vs. product content shares

---

### 06 — BRAND ROI FRAMEWORK

How to connect brand to business results for stakeholders:

**Short-term proxies** (show within 3–6 months):
- Reduced customer acquisition cost (brand awareness lowers paid media costs)
- Higher organic traffic share (branded search growth)
- Improved conversion rate from organic channels (trust = higher conversion)

**Medium-term outcomes** (6–18 months):
- Reduced sales cycle length (brand recognition shortens consideration)
- Higher win rate in competitive deals
- Improved NPS score

**Long-term outcomes** (18 months+):
- Premium pricing ability
- Reduced churn (loyal customers stay longer)
- Lower CAC across all channels as brand compounds

**The formula to present to stakeholders:**
*"Every [X]% increase in brand awareness correlates to a [Y]% reduction in CAC, based on our [period] data."*
Build this correlation using your own data over time.

---

### 07 — MEASUREMENT CALENDAR

| Metric | Tool | Owner | Frequency |
|--------|------|-------|-----------|
| Branded search volume | Google Search Console | [Marketing] | Monthly |
| Social mentions & sentiment | Mention / manual | [Social] | Weekly |
| NPS | Customer survey | [CX] | Quarterly |
| Awareness survey | Typeform / survey tool | [Brand] | Bi-annually |
| Brand perception words | Open survey | [Brand] | Bi-annually |
| Brand equity scorecard | Internal | [Brand lead] | Quarterly |
| Share of voice | Social listening tool | [Marketing] | Monthly |

---

### 08 — BRAND HEALTH REPORT TEMPLATE

What to include in a quarterly brand report to stakeholders:

1. **Brand Health Score** — current scorecard vs. last quarter
2. **Awareness trend** — are more people finding us organically?
3. **Perception shift** — are brand associations moving toward intended words?
4. **NPS movement** — are customers more likely to recommend us?
5. **Business impact** — CAC trend, organic share, win rate
6. **What's working** — 2–3 brand activities that drove measurable results
7. **What to fix** — 1–2 gaps or declining metrics to address

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Event tracking planner](https://useaiblocks.com/skills/event-tracking-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Related Skills

- **brand-audit**: Use measurement data to inform a brand audit
- **brand-strategy**: Goals the measurement framework should track toward
- **brand-context**: Foundation context for all brand work
