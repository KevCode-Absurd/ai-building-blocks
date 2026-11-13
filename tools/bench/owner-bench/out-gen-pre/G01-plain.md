# Plausible: 90-day SEO plan for trials

## What the October data says

| Page group | Trials per 1,000 clicks | Trials per page |
|---|---|---|
| Home, pricing, features | 36.1 | 57.5 |
| "Alternative" and "vs" pages | 31.9 | 45.8 |
| Docs | 4.8 | 0.6 |
| Blog | 2.5 | 0.7 |

- Comparison pages are 9 pages and brought 412 trials. The 140 blog posts brought 96.
- Blog clicks fell 37% since May. Comparison clicks rose 74%. Trials follow comparison pages, not blog traffic.
- Organic trials in October: 1,316, or about 500 paid at 38%.

**Assumptions.** Benchmarks come from your own pages: 9% CTR for a top-3 page (/vs-matomo at 2.8) and 3.5% for a top-5 page (/vs-google-analytics at 4.2). New clicks convert at your comparison rate (31.9 per 1,000) unless stated. Gains are monthly ceilings once a page ranks. Rankings take weeks, so expect part of this by day 90.

## Ranked by trials

| Rank | Move | Extra clicks a month | Extra trials a month | Extra paid |
|---|---|---|---|---|
| 1 | Rewrite /vs-google-analytics to reach top 3 | +3,190 | +100 | +39 |
| 2 | Rewrite /privacy-focused-web-analytics for "website analytics without cookies" (position 11.4 to top 5) | +805 | +26 | +10 |
| 3 | New /vs-fathom and /vs-umami pages (top 3) | +612 | +20 | +8 |
| 4 | Rewrite the 2022 cookie banner post (to top 5) | +1,230 | +3 at blog rate | +1 |
| 5 | Trial prompt on docs pages | n/a | about +25 if docs rise by one trial per 1,000 clicks | +9 |

Full ceiling: about 175 extra trials and 67 extra paid customers a month.

The cookie banner post is low on direct trials but answers Maya's own question. Its job is to send her to the product page.

## Stop doing

1. **Stop writing marketing tips and privacy news posts.** They convert at 2.5 per 1,000 clicks. Every writer slot goes to pages that sell.
2. **Stop judging SEO by total traffic.** Report trials by landing page every week instead.
3. **Stop leaving comparison pages undated.** Each one gets a "Last checked" date and a source for every claim about the other tool.
4. **Stop keeping dead posts.** Blog posts with no clicks in six months get merged or redirected.

## Month 1: the comparison pages

**Writer (4 pages)**
1. Rewrite /vs-google-analytics (full brief in Week 1).
2. New /vs-fathom. Fair, factual, dated. Say where Fathom is a good fit.
3. New /vs-umami. Same format. Cover hosted and self-hosted, since both products offer both.
4. Rewrite the cookie banner post. Answer the question in the first two lines. Say Plausible doesn't use cookies, so it adds no banner of its own. Note that other tools on a site may still need one. Link to /privacy-focused-web-analytics.

**Developer day**
- Add a trial prompt and a small dashboard screenshot to the docs and blog templates.
- Add a "Last checked" date field to comparison pages.
- Link the 20 blog posts with the most clicks to the closest comparison page.

## Month 2: the cookie-free page and the buyers' fears

**Writer (4 pages)**
1. Rewrite /privacy-focused-web-analytics for "website analytics without cookies." Put that phrase in the title and first line. Show the dashboard. Plain claims only. No "100% GDPR compliant" and no talk of fines.
2. New page: "Moving from GA4 without losing your history." This is Maya's first blocker. Assumption: the product team confirms which import options exist before it ships.
3. New agency page for Tomas: one tool for 20+ sites, the three numbers clients read, and data-handling facts to show a DPO. No guarantees.
4. Refresh /vs-matomo facts and date so it holds its 9% CTR.

**Developer day**
- Build a /compare hub that lists every comparison page.
- Link the docs WordPress page (position 1.3, 21.4% CTR) clearly to the trial.

## Month 3: double down on what moved

**Writer (4 pages)**
1. and 2. Two new comparison pages. Pick the two competitors with the most "vs plausible" impressions in Search Console that have no page yet.
3. Second pass on whichever Month 1 page moved least. Improve its title and opening lines first.
4. Rewrite the blog post with the most impressions that still converts below 2.5 per 1,000. Point it at a product or comparison page.

**Developer day**
- Redirect or merge the zero-click blog posts flagged in the audit (strategist does the audit, not the writer).

## Measure every Friday

- Trials by landing page, against the October baseline above.
- Position and CTR for the seven tracked queries, plus "vs plausible" queries.
- Day 90 review: keep the moves that grew trials. Cut the rest.

## Week 1 for the writer

**Monday**
- Read /vs-google-analytics, /vs-matomo and the top five results for "google analytics alternative." List what our page lacks.
- Write a new title and meta description for /vs-google-analytics that says what Maya gets: simple numbers, no cookies.

**Tuesday**
- Draft the new /vs-google-analytics. Order: one-line answer, dashboard screenshot, fair comparison table with today's date, "What about my old data?", pricing, trial button.
- Grade 8. Short sentences. No attacks on Google's people.

**Wednesday**
- Finish the draft. Check every GA4 claim against Google's current docs and add source and date. Send to the owner for a facts check.

**Thursday**
- Publish /vs-google-analytics. Request indexing in Search Console.
- Note the baseline: 58,000 impressions, 2,030 clicks, 3.5% CTR, position 4.2.
- Start the /vs-fathom fact sheet: pricing, hosting, features, data location. One source and date per line.

**Friday**
- Outline /vs-fathom using the same structure.
- Report trials by landing page for the week. This is the first line of the new weekly report.
