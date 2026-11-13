---
name: build-comparison-page
description: "Builds a fair comparison page that sets the store's product against the two or three alternatives buyers really weigh (a named rival, a cheaper generic, the do-it-yourself way or doing nothing), with a dated fact table, a plain 'who should pick which' section, a 'why this one' close and a claims file that backs every row. Checks each comparison against US FTC and India ASCI rules and the store's own evidence, admits where the alternative wins, and writes it so search and AI answers can quote it. Use when buyers ask how the product differs from a rival, when 'X vs Y' or 'alternatives to X' searches exist, or before running comparison ads."
---

# Comparison page against alternatives

**You get:** one comparison page written in full (headline, short verdict, fact table, who-should-pick-which, why this one, FAQ, button) plus a claims file with the source and check date for every row, ready for a claims review and the client's approval.

## When to use

- Reviews or chats say "I was choosing between you and X".
- Search Console or keyword tools show "brand vs X", "X alternative" or "best X for Y" queries.
- Buyers leave the product page to compare and do not return.
- Comparison ads are planned and need a page that holds up.

## Not for

- Comparison ads and their claims sheet: `comparison-ads-that-stay-legal` (it can reuse this page's claims file).
- A full teardown of a rival's product and offer: `competitor-product-teardown` (input to this skill).
- Blog posts that target many comparison queries: `write-seo-blog-posts-that-sell`.
- Checking an ad's wording against platform rules: `check-ad-copy-for-policy-and-claims`.

## What you need

Required (read access, level 1):

1. **Which alternatives buyers weigh**: counted mentions of named rivals, generics or old habits in reviews, tickets, chats and the post-purchase survey.
2. **Store product facts** with evidence: specs, materials or ingredients, test reports, certifications, warranty, returns, price, delivery times.
3. **Alternative facts** from public sources only: the rival's own product page, label or listing, captured as a screenshot with the date. Prices captured on the day.
4. **Gross profit per order** for the store product.

Optional: lab or third-party test results, Search Console queries, the store's reviews that mention switching from the alternative.

If an alternative's fact cannot be found publicly, leave that cell as "not stated by the maker" rather than guessing. Publishing needs draft access (level 2) and the client's yes after the claims review.

## Before you start: the gates

1. **The store wins on something real.** At least two decision-relevant facts favour the store product, with evidence. Fail: no comparison page; work on the offer or product first.
2. **Every row can be proven.** Each fact has a source and a check date. In the US, naming competitors is allowed when the comparison is clear and not deceptive, and comparative claims need the same proof as any claim [MCR-6020]. In India, ASCI requires the compared aspects to be clear, fairly chosen, factual and provable, not misleading, and not denigrating; the proof must be produced if ASCI asks [MCR-6024]. Fail: drop the row.
3. **No borrowed assets.** Rival names are used only to identify the product; no rival logos, photos or copied text. Fail: replace with text.
4. **Profit.** The store product has positive gross profit per order at the price shown. Fail: stop.

## Steps

1. **Pick the alternatives.** Rank alternatives by mentions. Take the top two or three. Include "doing nothing" or "the usual way" if buyers mention it; it is often the real rival.
2. **Choose the rows by buyer decision, not by store strength.** List what buyers say decided their choice (price per use, results, ingredients, comfort, delivery, warranty). Use those rows even where the alternative wins. A table with only rows the store wins breaks ASCI's fair-selection condition [MCR-6024] and readers distrust it.
3. **Fill the fact table.** For each row: store value, each alternative's value, the source, the date checked. Use like-for-like units (price per 100 g, per wash, per month). Write "not stated" where the maker gives no figure. No ticks and crosses without the fact behind them.
4. **Write the verdict.** Open the page with a 2 to 4 sentence direct answer: who should choose the store product and who should choose the alternative. Direct answers at the top, comparison tables and original data make pages easier for AI tools to cite [AEO-0030]; product, comparison and buying-guide pages earn more AI citations than general posts [AEO-0006].
5. **Write who-should-pick-which.** Three to five short cases ("If you mainly want the lowest price, X costs less per month"; "If you have sensitive skin, ours is fragrance-free"). Honest cases build the trust that makes the "why this one" land.
6. **Write why this one.** Three reasons, each tied to a table row and one review from a buyer who switched from that alternative. Reviews must be real, unedited in meaning and attributable [MCR-6021]. For a bottom-funnel objection, a sharp fact difference such as warranty length can carry the case [MCR-0043].
7. **Write the FAQ.** The 4 to 6 questions buyers ask when comparing (can I switch mid-routine, do they work together, what if it does not suit me). Answer from policy and facts.
8. **Write the title and headline for search.** Use the words people search: "[Store product] vs [Alternative]: which is right for you" or "Best [category] for [use]". Comparison and "best X for Y" pages are among the formats that pay for stores [SEO-0011]; focus on the most-aware queries in one product cluster first [SEO-0009].
9. **Set the refresh.** Rival prices and specs change. Recheck every row every 90 days (practitioner default) and on any rival relaunch; cited pages skew fresh [AEO-0021]. Put "Last checked: date" on the page.
10. **India and US notes.** India: compare in rupees including GST, note COD and delivery speed only with the store's real data, and avoid wording that mocks a rival brand. US: keep the claims file; state the test basis for any performance row.
11. **Claims review.** Run the finished page through `check-ad-copy-for-policy-and-claims` or the client's legal reviewer before publishing.

## Checks before you hand it over

- Every alternative was chosen from counted buyer mentions.
- Every row has a source and a check date; "not stated" is used where facts are missing.
- At least one row shows where an alternative is better or equal, if true.
- No rival logos, images or copied text; names used only to identify.
- The verdict answers who should pick which in 4 sentences or fewer.
- Each "why this one" reason links to a table row and a real switching review.
- "Last checked" date is on the page and in the claims file.

## Output

**Summary (one screen):** alternatives chosen and mention counts, rows used, where the store wins and loses, legal points checked, and the main search query targeted.

**Page copy:** title tag, headline, verdict, fact table, who-should-pick-which, why this one, FAQ, button label.

**Fact table:**

| Decision factor | Store product | Alternative 1 | Alternative 2 | Unit basis | Source per cell | Date checked |
|---|---|---|---|---|---|---|

**Claims file:**

| Claim on page | Evidence (file, link or screenshot) | Who checked | Date | Jurisdiction notes (US, India) | Expires |
|---|---|---|---|---|---|

**To confirm:** facts the client must supply, rows awaiting legal review.

## Common mistakes

- **Rigged rows.** Step 2 picks rows by what buyers weigh, including ones the store loses.
- **Old rival prices.** Step 9 dates and refreshes every row.
- **Ticks without facts.** Step 3 puts the actual value in each cell.
- **Mocking the rival.** Gate 2 applies ASCI's no-denigration rule.
- **Forgetting "doing nothing".** Step 1 includes the usual way when buyers mention it.
- **Copying the rival's photos.** Gate 3 allows names only.

## Sources

- MCR-6020: FTC allows naming competitors when clear and not deceptive.
- MCR-6024: ASCI's five conditions for comparisons and proof on request.
- MCR-6021: FTC rule on real, unbought reviews.
- AEO-0030: direct answers, tables and original data get cited.
- AEO-0006: product, comparison and buying-guide pages earn most AI citations.
- MCR-0043: a sharp fact difference answers a bottom-funnel objection.
- SEO-0011: comparison and alternatives formats pay for stores.
- SEO-0009: start with most-aware queries in one product cluster.
- AEO-0021: cited pages skew fresh and list-shaped.

What makes this skill ours: alternatives and rows come from counted buyer mentions, not from what flatters the store; every cell carries a source and a date; the page admits where rivals win, which both US and Indian rules reward; and the same claims file feeds the store's comparison ads.
