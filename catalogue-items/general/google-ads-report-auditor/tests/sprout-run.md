# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly spotted that the pasted file is a Meta-style creative results export, not a Google Ads search terms report, and refused to invent exclusions from it. It told the owner exactly which report and columns to pull, totalled the unjudged spend correctly from the ten rows, and kept everything as proposals.

## Judge list

- Met: Coverage note says how many rows it read and the date range
  "rows read: 10 | rows hidden: MISSING | dates: MISSING (only days_live per ad, 14 to 30 ...)"
- Met: Every finding names the exact rows or IDs behind it
  "findings: [ ]" - no findings given, so nothing is uncited; unjudged spend lists all ten row values
- Met: No exclusion suggested without match type and brand/profitable check
  "No exclusions are proposed. A block needs the actual search, its match type and a check against profitable and brand searches"
- Met: Nothing says a change has been made or promises a Quality Score result
  "Proposals only. Nothing has been changed." No Quality Score claims appear.
- Met: Wrong file: no findings, asked once for the right export, listed what to pull
  "MISSING: wrong export ... not a Google Ads search terms report" then "What to pull instead" with column list and one ask

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
area: search terms | rows read: 10 | rows hidden: MISSING | dates: MISSING (only days_live per ad, 14 to 30; P1 is split into days 1-21 and 22-42) | currency: USD (from the column name spend_usd)
findings: [ ]
missing: [
  "MISSING: wrong export. sprout/ad-results.csv is an ad-level creative results file (ad_name, format, opening_line, link_clicks). It looks like a Meta Ads Manager export, not a Google Ads search terms report. It has no search terms, campaign or ad group IDs, match types or current negatives. So it shows nothing about which searches waste money and nothing to exclude.",
  "MISSING: date range the export was pulled for, and where and when it was pulled",
  "MISSING: rows hidden for privacy (not stated)",
  "MISSING: targets (no target cost per sale or target return). Any future cutoff would be labelled exploratory.",
  "MISSING: brand flag per search, so brand searches can be protected from blocks",
  "MISSING: current negative keyword lists (campaign, ad group and shared), with their match types"
]
```

**What to pull instead**
Go to Google Ads, then Insights and reports, then Search terms. Set a fixed date range and export with these columns:
- Search term
- Campaign (with ID)
- Ad group (with ID)
- Search term match type and the keyword it matched
- Cost
- Clicks
- Impressions
- Conversions
- Conversion value
- Currency

Also export your negative keyword lists (campaign, ad group and shared lists) with their match types. Add a column marking which searches are brand searches (for example, anything containing "Sprout").

If you run Performance Max, add its search terms view too. Send a target cost per sale or target return with the export. Can you send those when you're able?

```
SCORE    not scored: wrong export
         Unjudged spend: $4,200 + $3,000 + $3,000 + $2,500 + $1,300 + $2,200 + $1,800 + $1,600 + $900 + $1,000 = $21,500
```

**Summary**
1. This file can't answer "which searches are wasting money." It holds ad creative results, not searches, so there is no search to keep, watch or block.
2. No exclusions are proposed. A block needs the actual search, its match type and a check against profitable and brand searches, and none of those are in this file.
3. Before judging spend you'll need a target (cost per sale or return) plus the search terms export above. Until then, all $21,500 here stays unjudged.

Proposals only. Nothing has been changed.

Once you have the right export, would you like to plan what to test with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Bring it this audit report. You can also type your own next step.
```
