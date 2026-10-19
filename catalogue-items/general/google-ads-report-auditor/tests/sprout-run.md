# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly recognised that an ad-creative results file cannot answer a search-terms question and refused to guess which searches to block, which protects the owner from acting on nonsense. It gave a precise shopping list of the report, columns, negatives and targets to bring back, so the next attempt can produce real findings.

## Judge list

- Met: Coverage note says how many rows it read and the date range, matching the file
  "rows read: 10 (ad-results.csv, all rows...)" and "dates: not stated (only days_live, 14–30 per row...)" — matches the 10-row file.
- Met: Every finding names exact rows or IDs
  "findings: [ ]" — no findings offered, so none lack rows or IDs; correct given the wrong export.
- Met: No exclusion suggested without match type and brand/profitable check
  No exclusions proposed; "Each proposed block would be checked against your profitable and brand searches before I suggest it."
- Met: Nothing says a change was made or promises a Quality Score result
  "Proposals only. Nothing has been changed." No QS promises anywhere.
- Met: If the file was wrong for the area, it stopped and listed what to pull
  "MISSING: wrong export. ad-results.csv is an ad-level creative report..." followed by "Report to pull: Google Ads > ... Search terms" with columns.

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
area: search terms
rows read: 10 (ad-results.csv, all rows; practice numbers)
rows hidden: not stated
dates: not stated (only days_live, 14–30 per row; no start or end dates)
currency: USD (from column names spend_usd and revenue_usd)
findings: [ ]
missing: [
  "MISSING: wrong export. ad-results.csv is an ad-level creative report (ad_name, format, opening_line, days_live, spend_usd, impressions, link_clicks, purchases, revenue_usd). It has no search terms, campaign or ad group IDs, match types, brand flag or current negatives, so it can't show which searches waste money or what to exclude.",
  "MISSING: source and date. The file doesn't say which platform or account it came from, when it was pulled, or the exact date range.",
  "MISSING: targets. There is no target cost per sale or target return. Even with the right export, any cutoff would have to be labelled exploratory.",
  "MISSING: current negative keywords. These are needed to avoid duplicates and to check the match-type scope of any new block.",
  "Report to pull: Google Ads > Insights and reports > Search terms (for Performance Max, its search terms view as well), one fixed date range, account currency, and the note on rows hidden for privacy. Columns: Search term, Campaign (name and ID), Ad group (name and ID), Keyword, Search term match type, Impressions, Clicks, Cost, Conversions, Conversion value. Then add a brand flag column yourself (Y/N for searches with 'Sprout' or your product names).",
  "Also export: all current negative keywords and shared negative lists, with match type and level (account, campaign, ad group, or Performance Max campaign).",
  "Also give: a target cost per sale or target return (ROAS), ideally allowing for refunds and returns."
]
```

**Summary:** There are no findings yet because the file you sent isn't a search terms export. It reports results by ad creative, such as "Fix the Hot Girl Tummy" and the "61% off" images. Nothing in it shows what people searched, so I can't say which searches to keep, watch or block. If you send the Search terms report and your current negatives with the columns above, plus a target cost per sale or return, I can rank wasteful searches by money at stake. Each proposed block would be checked against your profitable and brand searches before I suggest it.

Proposals only. Nothing has been changed.
```
