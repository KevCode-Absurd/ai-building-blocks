# Sample output: `/health-score`

Illustrative output for a fitness apparel account running both Meta and Google (composite example, not a real account).

---

```
AD ACCOUNT HEALTH SCORE
========================

Overall Score: 74/100 (C)
Data Coverage: 92%

CATEGORY BREAKDOWN:
| Category                       | Score | Grade |
|--------------------------------|-------|-------|
| Meta - Pixel/CAPI              | 82    | B     |
| Meta - Creative Performance    | 61    | C     |
| Meta - Account Structure       | 79    | B     |
| Meta - Audience Targeting      | 85    | B     |
| Google - Conversion Tracking   | 90    | A     |
| Google - Wasted Spend          | 55    | D     |
| Google - Keywords              | 72    | C     |
| Google - Quality Score         | 68    | C     |

Platform Scores:
  Meta Score:    76/100 (B)  [60% of spend]
  Google Score:  71/100 (C)  [40% of spend]
  Aggregate:     74/100 (C)
```

[ANNOTATION: The aggregate is a spend-weighted average. Meta carries more weight because the client spends more there.]

## CRITICAL FAILURES (fix immediately)

1. **GW01 - No negative keyword list on Search campaigns**
   - Current: 0 negatives applied
   - Benchmark: 200+ negatives for an account at this scale
   - Estimated waste: $1,200-$1,800/month in irrelevant clicks
   - Fix: Mine the search terms report, add the top 50 wasted queries this week

2. **C03 - Creative fatigue on top Meta ad**
   - CTR decayed from 2.4% to 0.9% (62% decay) over 45 days
   - Frequency: 4.8 (prospecting threshold: 3.0)
   - This single ad is 34% of Meta spend
   - Fix: Pause or halve budget; launch 3 refreshed variants within 7 days

## HIGH-PRIORITY WARNINGS

1. **GQ01 - Average Quality Score 5.2 across Search campaigns** (benchmark: 7+)
2. **C01 - Only 2 ad formats active** (benchmark: 3+)
3. **GS01 - PMax campaign has no asset group theming** (running as default catch-all)

## QUICK WINS (easy, meaningful impact)

1. Add 50 negative keywords from top wasted terms (30 min, saves ~$40/day)
2. Launch a static format test alongside existing video creatives (2 hours, unlocks C01)
3. Add structured snippets and callout extensions to Search campaigns (1 hour, lifts CTR 5-10%)

[ANNOTATION: Quick wins take under 2 hours each. Critical failures may take longer but have the highest impact.]

## DETAILED CHECK RESULTS

```
Meta Pixel/CAPI:
  P01 Pixel Installed              PASS    (Active site-wide)
  P02 Server-Side Events Active    PASS    (Native integration)
  P03 Event Deduplication          PASS    (94%)
  P04 Event Match Quality          PASS    (8.1)
  P05 Domain Verification          PASS
  P06 Standard Events Used         PASS    (Purchase, ATC, IC standard)
  P07 Attribution Window           PASS    (7-click / 1-view)
  P08 Data Freshness               PASS    (<60 min)

Meta Creative Performance:
  C01 Format Diversity             WARNING (2 formats)
  C02 Creatives per Ad Set         PASS    (avg 6.2)
  C03 Creative Fatigue             FAIL    (62% decay on top ad)
  ... [truncated for sample]

Google Wasted Spend (illustrative IDs):
  GW01 Negative Keywords           FAIL    (0 negatives)
  GW02 Search Term Hygiene         FAIL    (no review in 60 days)
  GW03 Match Type Distribution     WARNING (78% broad, too aggressive)
  ... [truncated]
```

[ANNOTATION: Full check list is much longer. This sample shows the structure. Every check is attached to its ID so teams can reference them in Slack or task tracker.]

## Summary for client email

> Your combined Meta + Google account scores 74/100 this month, up 6 points from last month's 68. The biggest remaining opportunity is wasted Google spend on unfiltered search terms (~$1,500/month recoverable) and creative fatigue on your top Meta ad. We are addressing both this week.
