---
name: search-traffic-drop-diagnosis
description: Diagnoses a fall in organic search traffic step by step. Confirms the drop is real, finds where it is (pages, queries, devices, countries, search types), matches its timing to Google updates, site releases and tracking changes, sorts the cause into technical, demand, results-page change, quality, manual action or spam, and writes a recovery plan with what to watch. Use when a client says "our Google traffic fell", after a core update, or when a Search Console alert arrives.
---

# Search traffic drop diagnosis

Most traffic drops have one of six causes. Guessing wastes weeks; this skill works through them in order, cheapest to check first, and only recommends changes once the evidence points one way.

## When to use

- Organic sessions or Search Console clicks fall by more than normal week-to-week noise.
- A core or spam update is rolling out and the client is worried.
- Search Console shows a manual action, a security issue or a jump in "not indexed" pages.

## What you need

**Access:** level 1 for steps 1 to 5 and 7 (Search Console as a Restricted user, GA4 as a Viewer, or exports). Level 2 to save fixes as drafts. Level 3 to make the agreed technical fixes and request re-crawls in step 6, within your limits.

1. **Search Console Performance exports:** clicks and impressions by date, page, query, country, device and search appearance, for the drop period and the same period before and a year earlier.
2. **Search Console Page Indexing report** and Manual actions and Security issues pages (screenshots are fine).
3. **GA4 organic sessions and conversions** by landing page for the same periods.
4. **Change log:** site releases, CMS or theme updates, redirects, tracking or consent changes, domain or hosting moves, content removals.
5. The date the client first noticed, and anything else they changed.

## Steps

### 1. Is it real?
- Compare Search Console clicks with GA4 organic sessions. If only GA4 fell, suspect tracking: a missing tag, a consent banner change, a new referral rule, or a GA4 property change. Search Console data usually lands within two to three days, so the last few days are incomplete.
- Check seasonality with the same period last year and a free trends tool.
- Check whether impressions fell (visibility loss) or only clicks (click-through loss).

### 2. Where is it?
Split the drop by page template, top pages, query groups (branded versus non-branded), device, country and search type (web, image, video, news, Discover). Write one sentence that pins it down, for example: non-branded clicks to /guides/ on mobile in the US fell 42% from 14 to 28 May, while product pages are flat. A drop that sits in one template or folder points one way; a drop spread evenly across the site points another.

### 3. When did it start?
Mark the first day on a daily chart. Compare it with:
- Google's Search Status Dashboard: core, spam and Discover updates and their start and end dates.
- The client's change log.
- Known results-page changes for the main queries (an AI Overview, a new shopping unit or forum results appearing).

### 4. Test each cause in this order

1. **Tracking or reporting.** Covered in step 1.
2. **Technical.** Page Indexing "not indexed" counts rising; URL Inspection on affected pages shows noindex, a wrong canonical, a robots.txt block, a redirect, a soft 404 or missing rendered content; server errors in crawl stats; a migration with missing redirects. Technical drops usually start on a release date and hit whole templates.
3. **Demand.** Impressions fell across all positions for the query group, but average position held. People are searching less (seasonal or market change). No site fix will restore it.
4. **Results-page change.** Impressions and position steady, click-through rate down. Check the live results for new AI Overviews, ads, video or forum blocks. Ahrefs reported in February 2026 that an AI Overview correlates with a much lower click-through rate for the top result. Report it honestly; check the Search Console Generative AI report for AI Overview impressions.
5. **Quality or core update.** The drop starts inside a core update window, positions fall across many queries, competitors with stronger first-hand content, clearer authorship or better page experience rise. Compare your losing pages with the pages that replaced them against Google's people-first self-assessment questions.
6. **Manual action or spam.** A notice in Manual actions; a spam update in the window; unnatural links, scaled pages, thin affiliate pages, expired domain tactics, site reputation issues or hacked content. Follow the notice's instructions and file a reconsideration request only after fixing.

### 5. Name the most likely cause with your confidence
State the cause, the evidence for it, the evidence against it and your confidence (high, medium, low). If two causes overlap (for example, a release during a core update), say so and plan to separate them.

### 6. Write the recovery plan
- Technical: the exact fix, who makes it (me at level 3, within the client's limits, or their developer), how to test it, and a request to re-crawl key URLs.
- Demand: change targets and reporting; shift effort to queries with steady demand.
- Results-page change: rewrite titles and snippets, add formats that win the feature (video, images, comparison tables), report visibility and conversions alongside clicks.
- Quality: a page-by-page improvement list for the top losing pages (first-hand evidence, author pages, removing or merging thin pages, better experience). Explain that recovery often waits for the next core update and is not guaranteed.
- Manual action: the cleanup steps and the reconsideration request draft. Sending the request always needs a new yes from the client.

### 7. Set the watch
List three to five measures, their baseline and the date to review (two weeks for technical fixes, 8 to 12 weeks or the next core update for quality work).

## Checks before you ship

- You checked tracking before blaming Google.
- The drop is described in numbers with dates and filters.
- Timing was matched against both Google updates and the client's own changes.
- You did not recommend removing large amounts of content or changing many URLs on weak evidence.
- Confidence is stated and the client knows what is not yet known.

## Output format

1. **One-paragraph finding:** what fell, where, when, the likely cause and confidence.
2. **Evidence table:** cause | evidence for | evidence against | verdict.
3. **Recovery plan:** action | owner | effort | when | how we will know.
4. **Watch list** with baselines and review dates.

## Example of good output (made for this kit, not a real client)

> **Finding.** Non-branded clicks fell 38% between 2026-05-21 and 2026-06-01. Impressions fell 35% and average position on the top 50 queries moved from 4.1 to 7.8. Branded clicks are flat; GA4 matches Search Console, so this is not tracking. The start date matches the May 2026 core update (rollout from 21 May). No releases in the change log, Page Indexing is stable and there is no manual action. Likely cause: core update quality reassessment. Confidence: medium.
>
> | Cause | For | Against | Verdict |
> |---|---|---|---|
> | Technical | none | Indexing stable, URL Inspection clean on 10 pages | Ruled out |
> | Demand | none | Impressions fell with position, not alone | Ruled out |
> | Core update | Start date; three rivals with original test data and named reviewers replaced us on 31 of 50 queries | Some losing pages were updated in April | Most likely |
>
> **Plan.** Rewrite the 12 biggest losing guides with the client's own test results and named reviewers; merge 40 thin "best X for Y" pages into 8 stronger pages; add author bio pages. Review clicks at the next core update; do not expect a quick bounce.
