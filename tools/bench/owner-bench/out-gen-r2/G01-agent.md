# Plausible: 90-day SEO plan, ranked by trials

**The decision:** Spend this quarter on comparison pages and the "without cookies" page. Stop writing new blog posts. Comparison pages earn 31.9 trials per 1,000 clicks; blog posts earn 2.5. Per click, that is about 13 times the trials.

**Bad news first:** Organic clicks fell from 108,900 in May to 95,100 in October, down 13%. The whole drop is the blog: down 22,500 clicks, or 37%. Every other group grew. Those lost clicks were worth about 56 trials a month. This plan does not chase them: a blog post earns 0.7 trials a month, a comparison page 45.8.

**Projected gain:** +41 to +95 trials a month once the pages settle. At your 38% trial-to-paid rate, that is +16 to +36 paying customers a month, or 3% to 7% on top of October's 1,316 organic trials. A projection; new pages may need more than 90 days.

**First move:** On Monday, the writer starts the /vs-google-analytics rewrite.

## Ranked moves

| # | Move | October data | Trials a month (projection) |
|---|---|---|---|
| 1 | Rewrite /vs-google-analytics, new title | 58,000 impressions, 3.5% CTR, position 4.2 | +19 to +46 if CTR reaches 4.5% to 6% |
| 2 | New /vs-fathom and /vs-umami | 6,800 impressions, no page | +10 to +20 at half to all of /vs-matomo's 9.0% CTR |
| 3 | Retarget /privacy-focused-web-analytics to "website analytics without cookies" | 31,000 impressions, position 11.4 | +11 to +26 if CTR reaches 2% to 3.5% |
| 4 | Refresh the other 7 alternative pages | 9 such pages earned 412 trials | Not projected: no query data |
| 5 | Rewrite the 2022 cookie-banner post | 44,000 impressions, 0.7% CTR | +1 to +3 if CTR reaches 2% to 3.5% |

Moves 1 to 3 use the alternative pages' rate; move 5 uses the blog rate. Move 5 adds the most clicks (+570 to +1,230) and the fewest trials. It stays because it is Maya's own question, "Can I finally get rid of the cookie banner?", and it should send readers on to move 3.

## Stop

- **New marketing-tip and privacy-news posts.** 140 posts earned 96 trials in October.
- **Judging SEO by total clicks.** Report trials per 1,000 clicks by page group each month.
- **Touching pages that already win.** Leave /docs/wordpress-integration (position 1.3, 21.4% CTR) and /vs-matomo (position 2.8, 9.0% CTR) alone. Use /vs-matomo as the model.

## Month by month: 12 writer pages, 3 developer days

| Month | Writer (4 pages) | Developer day | Done when |
|---|---|---|---|
| 1 | Week 1: /vs-google-analytics. Week 2: /vs-fathom. Week 3: /vs-umami. Week 4: /privacy-focused-web-analytics. | Footer links to every alternative page. A "Facts checked on" line in the comparison template. A closing block on every blog post linking to moves 1 and 3. | 4 pages live and sent for indexing |
| 2 | Cookie-banner post. Refresh the 3 alternative pages with the most October trials. | Monthly report: clicks, trials and trials per 1,000 clicks by page group | 4 pages live, first report sent |
| 3 | Refresh 2 more alternative pages, plus 2 pages set by the day-60 rules | Fixes the day-60 review finds | Every alternative page shows a check date |

## How every comparison page is built

- Open with "Plausible doesn't use cookies." Then show the dashboard screenshot.
- A fair table. Take each rival fact from the rival's own site and date it. Nothing about their people.
- Maya's worries, from your current pages: what happens to her old GA data, and the monthly price.
- Tomas's worries: cost per site, and what to tell a DPO. List what data Plausible collects. No "100% GDPR compliant", no talk of fines. Have someone who knows data protection law read this part once.
- One trial button near the top, one at the end.

## Week 1: the writer's tasks

| Day | Task | Done when |
|---|---|---|
| Mon | Export 3 months of Search Console queries for /vs-google-analytics. Check every fact on the page against GA4's and your own current pages. | Query list; fact list with source and date |
| Tue | Outline on the /vs-matomo structure. Pick the screenshot. | Outline saved |
| Wed | Write the page to the rules above. | Full draft |
| Thu | Cut to grade 8. Set the title and meta below. Link to it from pricing and features. | Title under 60 characters, meta under 155 |
| Fri | Publish, request indexing, log the baseline: 58,000 impressions, 2,030 clicks, 3.5% CTR, position 4.2. | Page live, log made |

**Titles and meta, ready to use:**

- /vs-google-analytics: "Google Analytics alternative: Plausible vs GA4 compared". Meta: "Plausible doesn't use cookies. See where your visitors came from on one simple dashboard. A fair, dated comparison with GA4."
- /privacy-focused-web-analytics, title and H1: "Website analytics without cookies | Plausible". Meta: "Plausible doesn't use cookies. Visitors, sources and top pages on one dashboard. Open source, made by a small independent team."
- "Fathom vs Plausible: a fair, dated comparison" and "Umami vs Plausible: a fair, dated comparison".

## Day-60 and day-90 rules

- **New page not in the top 50 four weeks after indexing:** add 3 links from other alternative pages. Don't rewrite yet.
- **Retitled page, no CTR rise after 4 weeks at steady position:** try a second title.
- **/vs-fathom or /vs-umami at position 4 to 15 by day 60:** give it a month-3 slot for a second pass. Otherwise, refresh the last 2 alternative pages.

## Assumptions

1. The writer can publish pages and edit titles in your CMS; the developer day covers templates and site-wide changes.
2. The Fathom and Umami query impressions (4,100 and 2,700) show monthly demand a new page can reach.
3. October trial rates hold per page group. Move 3 is valued at the alternative-page rate because it is a product page.
