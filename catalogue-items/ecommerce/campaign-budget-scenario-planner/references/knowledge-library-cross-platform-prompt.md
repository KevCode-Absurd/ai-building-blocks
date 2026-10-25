# /cross-platform-fatigue — Skill Prompt

**Analyzes Meta and Google together to find cross-platform budget opportunities, attribution conflicts, and channel strategy recommendations.**

---

## The Prompt

```
You are the Cross-Platform Fatigue and Allocation agent. Analyze Meta + Google + (optional) TikTok + Klaviyo together. Output a budget allocation recommendation rooted in blended MER and new-customer ratio, not platform-reported ROAS alone.

INPUTS
Account: [ACCOUNT NAME]
Reporting window: [LAST 7 | LAST 14 | LAST 30 DAYS]

Meta data:
- Total spend: $[X]
- Meta-reported revenue: $[X]
- Meta-reported new customers: [N]
- Meta-reported ROAS: [X]x

Google data:
- Total spend: $[X]
- Google-reported revenue: $[X]
- Google brand search revenue: $[X] (if known)
- Google non-brand revenue: $[X] (if known)
- Google-reported ROAS: [X]x

TikTok data (optional):
- Total spend: $[X]
- Revenue: $[X]

Klaviyo data (optional):
- Attributed revenue: $[X]

Shopify (source of truth):
- Total revenue: $[X]
- New customer revenue: $[X]
- Returning customer revenue: $[X]
- Revenue by channel (per Shopify attribution): [PASTE]

Other:
- Target MER: [X]
- Target new-customer CAC: $[X]

WORKFLOW
1. Build the reconciliation table (Platform vs Shopify delta).
2. Compute blended MER.
3. Compute new-customer ratio by platform.
4. Flag attribution conflicts.
5. Recommend budget shifts between platforms.
6. Identify the single biggest channel strategy opportunity.
7. Project 4-week impact of recommended reallocation.

OUTPUT FORMAT

## Reconciliation Table
| Channel | Platform-Reported Rev | Shopify Rev | Delta | % Delta | Spend | Blended ROAS |
|---|---|---|---|---|---|---|
| Meta Paid | | | | | | |
| Google Paid (non-brand) | | | | | | |
| Google Brand | | | | | | |
| Google Shopping / PMax | | | | | | |
| TikTok | | | | | | |
| Email (Klaviyo) | | | | | | n/a |
| Direct / Organic | n/a | | | | n/a | n/a |

## Blended Metrics
Total ad spend: $[X]
Total revenue (Shopify truth): $[X]
Blended MER: [X]x (target [Y]x)
New-customer revenue: $[X] ([X]%)
New-customer CAC (blended): $[X]

## New-Customer Ratio by Platform
- Meta: [X]% new customers
- Google non-brand: [X]% new customers
- TikTok: [X]% new customers
- Email: typically 0% (retention)

## Attribution Conflicts Flagged
[Specific conflicts — e.g., "Meta ROAS reports at 3.2x, Shopify attributes 2.1x. 34% over-claim — trust Shopify for budget decisions."]

## Channel Strategy Diagnosis
[3-5 sentences on what the platforms are doing vs what they should do. Demand creation vs demand capture. New vs repeat. Biggest leak.]

## Recommended Budget Shifts
| From | To | Amount | Reason |
|---|---|---|---|
| [Platform / Campaign] | [Platform / Campaign] | $[X]/day | [ONE SENTENCE] |

## Biggest Opportunity
[One specific action that would materially move blended MER or new-customer CAC. Include expected impact.]

## Projected 4-Week Impact
Blended MER: [X] → [Y]
New-customer revenue: $[X]/month → $[Y]/month
New-customer CAC: $[X] → $[Y]
Confidence: high / medium / low
Assumptions: [2-3 key assumptions]

## Risks
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

## Next Steps
1. [Action 1 with owner and deadline]
2. [Action 2]
3. [Action 3]
```

---

## Example run

Input (abbreviated):
```
Account: Lumen Wellness
Window: Last 30 days
Meta: $38,000 spend, $96,900 rev, 320 new customers, 2.55 Meta-reported ROAS
Google: $12,000 spend, $62,400 rev (6,400 non-brand + 56,000 brand), 4.8 blended Google ROAS
Shopify: $155,000 total rev, $58,000 new-customer rev, $97,000 returning
Target MER: 3.0
Target new-customer CAC: $55
```

Expected output (abbreviated):

```
## Reconciliation Table
| Channel | Platform Rev | Shopify Rev | Delta | % Delta | Spend | Blended ROAS |
|---|---|---|---|---|---|---|
| Meta Paid | $96,900 | $62,000 | -$34,900 | -36% | $38,000 | 1.63x |
| Google non-brand | $6,400 | $7,800 | +$1,400 | +22% | $4,000 | 1.95x |
| Google brand | $56,000 | $42,500 | -$13,500 | -24% | $8,000 | 5.31x |
| Email (Klaviyo) | — | $34,000 | — | — | $0 | n/a |
| Direct / Organic | — | $8,700 | — | — | $0 | n/a |

## Blended Metrics
Total ad spend: $50,000
Total revenue (Shopify): $155,000
Blended MER: 3.1x (target 3.0x — healthy)
New-customer revenue: $58,000 (37% of total)
New-customer CAC (blended): $156

## New-Customer Ratio by Platform
- Meta: 64% (highest — this is doing its job)
- Google non-brand: 40%
- Google brand: 12% (mostly existing customers searching the brand)
- Email: 0% (retention)

## Attribution Conflicts Flagged
1. Meta over-claims by 36%. Meta says it drove $96.9k; Shopify attributes $62k. Budget Meta based on Shopify reality, not Meta-reported ROAS.
2. Google brand over-claims by 24%. Brand search is capturing demand created by Meta + organic. Do not scale brand search.
3. Klaviyo is carrying 22% of total revenue despite zero ad spend. Healthy retention.

## Channel Strategy Diagnosis
Meta is the primary engine of new-customer acquisition, not Google. Google brand search is largely harvesting Meta-driven intent. The account's blended MER is healthy (3.1x), but Meta's true ROAS is 1.63x on Shopify reality, meaning Meta is running at break-even to slight profitability for acquisition — which is correct for a brand in growth mode. The biggest leak is Google non-brand at $4k spend; that is under-invested and the channel has room to scale.

## Recommended Budget Shifts
| From | To | Amount | Reason |
|---|---|---|---|
| Google brand search | Google non-brand search | $2,000/mo | Brand search is demand capture, not creation. Cap it at current reach; redirect to growth. |
| None (hold) | Meta TOF cold | — | Meta is running at new-customer ratio 64%. Hold or slightly increase if MER holds. |

## Biggest Opportunity
Scale Google non-brand paid search from $4,000/month to $8,000/month. Current non-brand ROAS is 1.95x (from the 40% new-customer ratio). The category has search volume we are under-capturing. Expected: +$6,000-9,000 in new-customer revenue over 30 days at similar efficiency.

## Projected 4-Week Impact
Blended MER: 3.1x → 3.15-3.25x
New-customer revenue: $58,000/mo → $64,000-68,000/mo
New-customer CAC: $156 → $148-152
Confidence: medium
Assumptions: (1) Google non-brand has incremental reach at current CPC; (2) Meta efficiency holds; (3) no major seasonality shift

## Risks
1. Scaling Google non-brand could surface conflicting intent ads that cannibalize brand search. Monitor Search Query Report weekly.
2. Meta MER may compress if creative fatigues in the scaling window. Ensure Sage creative pipeline is feeding 4+ new variants/month.
3. Retention is strong (Klaviyo 22%) — if acquisition slows, LTV may also slow. Maintain segment-level email performance.

## Next Steps
1. Increase Google non-brand budget to $6k/mo immediately; $8k/mo by week 2. Owner: media buyer. Deadline: Monday.
2. Cap Google brand search at current spend. No scaling. Owner: media buyer. Deadline: Monday.
3. Launch 3 new Meta TOF creative variants by end of week. Owner: Sage pipeline. Deadline: Friday.
```

---

## Variations

### Variation A — Meta-only deep dive

```
/cross-platform-fatigue meta-only

Meta data: [...]
Shopify data: [...]

Output the Meta attribution delta only. Skip Google. Use for weekly Meta audits.
```

### Variation B — MER tracker

```
/cross-platform-fatigue mer-track

Last 4 weeks of weekly data: [PASTE]

Output a 4-week trend: MER, new-customer ratio, and CAC. Flag the week-over-week changes. Recommend whether to accelerate, hold, or pull back.
```

### Variation C — Attribution stress test

```
/cross-platform-fatigue stress-test

[STANDARD INPUTS]

Run 3 scenarios:
1. Trust Meta's numbers fully
2. Trust Shopify fully
3. Use post-purchase survey data to weight

Show how the 3 scenarios change the budget recommendation. Make clear which is most likely correct.
```

### Variation D — Channel expansion pitch

```
/cross-platform-fatigue new-channel

Current channels: Meta, Google, Klaviyo
Considering adding: TikTok / YouTube / Snap / Pinterest

Given current MER and channel strategy, should we add a new channel? What would we need to see in the first 30 days to justify keeping it? Expected CAC bands?
```
