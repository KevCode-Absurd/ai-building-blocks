# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 1.

The run did the right thing: it recognised the file was an ad-level creative report, not a search terms export, refused to guess at exclusions, and listed exactly which Google Ads report, columns, negatives and targets to pull. Its one real error is the stated total spend of $18,500, which is wrong (the rows sum to $21,500), a careless number the owner could repeat.

## Fix

In the 'Score it' section add: 'When you state any spend total (including unjudged spend), list the row values you added and show the sum so it can be checked.'

## Judge list

- Met: Coverage note says how many rows it read and the date range
  "rows read: 10 ... dates: not stated (only a days_live count per ad: 14–30 days)" matches the 10-row file.
- Met: Every finding names the exact rows or IDs behind it
  "findings: [ ]" — no findings given, so nothing unsupported.
- Met: No exclusion suggested without match type and brand/profitable check
  "Proposing exclusions from it would be guesswork." No exclusions proposed.
- Met: Nothing says a change was made or promises a Quality Score result
  "Proposals only. Nothing has been changed." No QS promises.
- Met: If the file was wrong for the area, it stopped and listed what to pull
  "MISSING: wrong export ... Report to pull: Google Ads → Insights and reports → Search terms ... Columns: Search term, Search term match type..."

## Invented

- number: Unjudged spend: $18,500 (all 10 rows) (The spend_usd column sums to $21,500, not $18,500; the stated total cannot be worked out from the file.)

## What went in

```text
Area: search terms
Targets: none yet
Question: which searches are wasting money? What should I exclude?

Export (ad-results.csv, all 10 rows pasted; practice numbers).
Columns: ad_name, format, opening_line, days_live, spend_usd,
impressions, link_clicks, purchases, revenue_usd

First two rows:
T1 Hot girl tummy, video 28s UGC, "Fix the Hot Girl Tummy", 30,
  4200, 300000, 4950, 198, 8336
P1 Too expensive days 1-21, image, "'Sprout is too expensive':
  here's 61% off to prove otherwise", 21, 3000, 250000, 3750,
  112, 3830

[attached: sprout/ad-results.csv]
```

## What came out

```text
```
area: Search terms (requested). The export doesn't fit this area.
rows read: 10
rows hidden: not stated
dates: not stated (only a days_live count per ad: 14–30 days)
currency: USD (taken from column names spend_usd and revenue_usd)

findings: [ ]

missing: [
  "MISSING: wrong export. ad-results.csv is an ad-level creative report (ad_name, format, opening_line, link_clicks). It has no search terms, so no search can be judged or excluded from it. The columns ('link_clicks', 'UGC video', 'opening_line') look like a social-ads export rather than Google Ads. Please confirm the source.",
  "MISSING: search term column. No field holds what people typed.",
  "MISSING: campaign ID and ad group ID.",
  "MISSING: match type (search term match type) and the keyword that triggered each search.",
  "MISSING: cost, clicks, impressions, conversions and conversion value per search term.",
  "MISSING: brand flag. Mark which searches contain your brand or product names, e.g. 'sprout'.",
  "MISSING: current negative keywords, with their match type (broad, phrase or exact) and level (account list, campaign or ad group).",
  "MISSING: source and date range. State where and when the export was pulled, and the exact start and end dates.",
  "MISSING: rows hidden for privacy. Include the 'Other search terms' total row if Google shows one.",
  "MISSING: targets. Give a target cost per sale or a target return (ROAS), and say whether refunds and returns should be netted out."
]

Report to pull:
  Google Ads → Insights and reports → Search terms, for the Search
  campaigns. For Performance Max, also pull its search terms view.
  Columns: Search term, Search term match type, Keyword, Campaign
  (+ ID), Ad group (+ ID), Impressions, Clicks, Cost, Conversions,
  Conversion value, Added/Excluded status.
  Also export: your negative keyword lists (Tools → Shared library)
  and the campaign- and ad-group-level negatives, each with match type.

score: not scored. There is no search-terms data to judge and no target, so no spend score is possible. A check-based score would also be empty, because no review was run. Unjudged spend: $18,500 (all 10 rows; none of it is search-term spend).
```

The summary:

1. **No searches to exclude yet.** The file lists 10 ads (videos, images, a carousel) and their results. It doesn't show what anyone searched for, so it can't show which searches waste money. Proposing exclusions from it would be guesswork.
2. **The data may not be from Google Ads.** "Link clicks", UGC video and opening lines suggest a social-ads export. Please pull the Google Ads search terms report listed above, along with your current negative keywords and their match types. Every block has to be checked against profitable searches and brand searches before it's proposed.
3. **Set a target first.** Choose a target cost per sale or a target return, and decide whether refunds count. With that and the right export, the next run can sort searches into keep, watch, add as exact keyword, or block, and score how much of the spend meets the target.

Proposals only. Nothing has been changed.
```
