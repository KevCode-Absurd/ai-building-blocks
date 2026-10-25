# Cross-Platform Attribution Guide

**Meta and Google do not see each other. Your revenue does. This guide shows how to reconcile the two + Shopify + Klaviyo into one honest picture, and how to make budget decisions from that picture.**

---

## The attribution problem in one paragraph

Meta reports purchases via its own pixel, using 7-day click + 1-day view by default. Google reports purchases via its own tag, using last-click by default. Shopify attributes the sale to whichever referrer cookie won the race. Klaviyo attributes email-related revenue separately. Add those up and you will OVER-count your actual revenue by 30-60%. The real number is in Shopify (or equivalent). The platform-reported numbers are directional truth, not total truth.

---

## The 3 revenue sources to reconcile

### Source 1: Platform-reported conversions (Meta + Google)
- Meta Ads Manager: Purchase events (attributed to Meta touches)
- Google Ads: Conversions (attributed to Google touches)
- Include ALL campaigns, not just the best ones

### Source 2: Shopify analytics / GA4
- Total revenue by channel (Shopify default attribution)
- Total revenue by UTM source (if you tag properly)
- Total new-customer revenue vs repeat-customer revenue

### Source 3: Post-purchase survey ("How did you hear about us?")
- Self-reported channel
- Small sample, high signal
- Shows what platform attribution cannot: word-of-mouth, podcast, organic social

---

## The reconciliation table (build this weekly)

| Channel | Platform-reported revenue | Shopify-reported revenue | Delta | % Delta | Spend | Blended ROAS (Shopify / Spend) |
|---|---|---|---|---|---|---|
| Meta Paid | | | | | | |
| Google Paid Search | | | | | | |
| Google Shopping | | | | | | |
| Google PMax | | | | | | |
| Direct / Organic | n/a | | | | n/a | n/a |
| Email (Klaviyo) | | | | | n/a | n/a |
| Other | | | | | | |

**Read the Delta:**

- If Platform > Shopify by 30%+: platform is over-claiming. Trust Shopify.
- If Platform < Shopify by 30%+: platform is under-attributing. iOS 14 impact. Likely real impact is higher.
- If Platform ≈ Shopify (within 15%): attribution is clean on this channel.

---

## The Meta vs Google budget decision

When deciding whether to shift budget between Meta and Google:

### Indicator 1: MER (Marketing Efficiency Ratio)

```
MER = total_revenue / total_marketing_spend
```

- MER > 4: healthy. Scale both platforms.
- MER 2.5-4: acceptable. Optimize per platform.
- MER 1.5-2.5: tight. Re-evaluate underperforming platform.
- MER < 1.5: bleeding. Cut aggressively until MER recovers.

### Indicator 2: Platform ROAS delta

- If Meta ROAS > Google ROAS by 50%+: shift 15-20% of budget from Google to Meta
- If Google ROAS > Meta ROAS by 50%+: shift 15-20% of budget from Meta to Google
- If within 30% of each other: hold, test diversity

### Indicator 3: New-customer ratio

This is the critical signal that most agencies miss.

- Pull new-customer count by channel (Meta pixel new-customer segmentation OR Shopify customer-first-order report)
- A platform with high ROAS but 20% new customers is RE-CONVERTING existing customers
- A platform with lower ROAS but 70% new customers is GROWING the business

**Scale decision:** Prefer the platform that brings NEW customers. A 3x ROAS on new acquisition beats a 5x ROAS on repeat buyers.

---

## The 3-platform scenario

Most serious eCom accounts run Meta + Google + Klaviyo. Here's how to think about each:

### Meta
- **Job:** Demand generation (cold + warm)
- **Strength:** New customer acquisition, visual storytelling, creative testing
- **Weakness:** iOS 14 attribution loss
- **Budget logic:** Scale based on blended MER, not Meta-only ROAS

### Google
- **Job:** Demand capture (searches, shopping intent)
- **Strength:** High-intent conversion
- **Weakness:** Captures your own brand traffic at a cost if you don't manage negatives
- **Budget logic:** Separate brand search from non-brand; scale non-brand independently

### Klaviyo (email)
- **Job:** LTV + retention
- **Strength:** Profit margin leader
- **Weakness:** No acquisition
- **Budget logic:** Not an acquisition spend; measure by revenue per recipient, not ROAS

---

## The common cross-platform leak

**Google brand search ROAS is 15-25x and it is often 20-35% of Google's total reported revenue.**

Brand search converts at that ROAS because the customer was ALREADY coming to you. Meta (or a podcast, or a friend) drove the intent. Google captured the close.

**Diagnostic:**
- Pull brand search revenue separately
- Compare to total Meta spend + Meta revenue
- If brand search revenue is GROWING as Meta spend grows, Meta is driving the demand that Google is capturing
- You are under-attributing Meta and over-attributing Google

**Fix:** In the reconciliation table, classify Google brand search as "demand capture" not "demand creation." Do not use its ROAS as a reason to cut Meta.

---

## How to build the weekly cross-platform report

Every Monday:

1. Pull platform-reported revenue from Meta Ads Manager
2. Pull platform-reported revenue from Google Ads
3. Pull Shopify revenue by channel (from Shopify Analytics or via UTM-tagged reports)
4. Pull Klaviyo-attributed revenue
5. Fill in the reconciliation table
6. Compute MER for the account
7. Compute new-customer ratio by platform
8. Write a 3-sentence diagnosis:
   - Are we growing? (new-customer revenue up week-over-week)
   - Is our MER healthy?
   - Is any platform over-claiming or under-attributing?
9. Make the budget move before 10 AM Monday

---

## What to do when attribution is broken

If your attribution is so broken you cannot tell what is working:

### Option 1: Holdout test
- Pause Meta for 7 days in a single geography
- Measure Shopify revenue in that geo during the pause
- Resume Meta
- Measure Shopify revenue in that geo after resume
- Delta = Meta's true contribution

This is expensive but honest.

### Option 2: Geo split test
- Two similar states / regions
- Meta runs at full budget in A, reduced budget in B
- Measure Shopify revenue in both for 2-4 weeks
- Delta = marginal contribution of Meta spend

### Option 3: Post-purchase survey
- Ask every buyer "Where did you first hear about us?"
- Aggregate 4 weeks
- Use the percentages to weight your platform-reported numbers
- Crude but better than nothing

---

## The budget allocation question

"How should I split budget across Meta, Google, TikTok?"

**Answer: by job, not by ROAS.**

- Meta: demand creation + new customer acquisition → 50-65% of total ad spend
- Google non-brand: demand capture on search terms → 15-25%
- Google Shopping / PMax: product-aware shoppers → 10-15%
- TikTok / Reels organic: category expansion + top-of-funnel → 5-10% (or free if organic)
- Klaviyo: retention + LTV (SaaS cost only, no ad spend)
- Google brand search: always-on but never a scaling lever → keep budget capped at 5-10% of Google total

If Meta is crushing it on ROAS, do NOT shift 80% of budget there. Diversification protects against platform policy changes, attribution breakage, and CPM inflation.

---

## Red flags to watch

1. **Meta ROAS climbing while Shopify revenue flat** — Meta is cannibalizing Google attribution or re-converting existing customers
2. **Google Shopping ROAS suddenly doubles** — likely counting gift-card or subscription renewals; investigate
3. **Klaviyo revenue % climbs above 40% of total** — retention is carrying the business; acquisition is underperforming
4. **MER drops below 2.0 for 2+ weeks** — structural problem; do a full account audit
5. **Post-purchase survey shows 30%+ saying "Google" but Meta claims credit** — attribution model mismatch; reconcile

---

## One sentence to remember

Platform ROAS tells you what the platform THINKS it drove. Shopify revenue tells you what ACTUALLY happened. Budget from Shopify, diagnose from platform.
