---
name: track-ai-answer-visibility
description: "A monthly AI answer check for a store: a fixed panel of real buying questions run the same way each month in ChatGPT, Perplexity, Gemini, Copilot and Google's AI answers, recording whether the store is named, how it is described, which rivals appear and which sources are cited; plus AI referral sessions and orders in GA4, Search Console trends and how-did-you-hear survey answers. Produces a one-page report with mention share by assistant, wrong facts found, the cited sources to work on, and a ranked fix list handed to the right skill. Free manual method first; paid trackers optional and checked for answers given without web search. Use every month once AI visibility work starts, or when the owner asks what assistants say about the store."
---

# Track AI answer visibility

**You get:** a monthly report (one screen: mention share by assistant, change since last month, wrong facts, top cited sources, fixes), the filled panel sheet, an AI traffic and survey table, and a fix list handed to the right skills.

## When to use

- Every month after `get-recommended-by-ai-assistants` changes start shipping.
- The owner asks "what does ChatGPT say about us?".
- After a price, policy or product change, to see if assistants picked it up.
- A rival seems to be showing up in AI answers more often.

## Not for

- The first diagnosis and change plan: use `get-recommended-by-ai-assistants`.
- Fixing product data for AI shopping channels: use `product-data-for-ai-shopping`.
- Setting up the how-did-you-hear survey: use `post-purchase-how-did-you-hear-survey`.
- Classic search rankings: use Search Console directly or `monthly-store-performance-report`.

## What you need

Required (read access, level 1):

1. **The question panel** (fixed list): from the baseline in `get-recommended-by-ai-assistants`, or built in step 1.
2. **GA4** access: sessions, purchases and revenue by session source.
3. **Search Console** access: standard Web performance and the Generative AI impressions report where available. The older Web-report guidance [AEO-6460] does not establish that a dedicated report is absent; check [current report documentation](https://support.google.com/webmasters/answer/16984139) and the actual property. Documentation checked 17 November 2026. Preserve conflicting source dates and resolve feature changes before making recommendations.
4. **How-did-you-hear survey** results for the month, with an answer option naming AI assistants.
5. **Gross profit per order** by product, to judge which questions matter.

Optional: a paid AI visibility tracker the client already has; last month's report.

This job is read only. Fixes it finds go to other skills, each with its own approval.

## Before you start: the gates

1. **Panel is fixed.** Pass when the question list, assistants, settings and run count are the same as last month. Changing the panel breaks the trend; add new questions in a separate "new" block.
2. **Survey is live.** Most AI mentions carry no link [AEO-0010], so without a how-did-you-hear question that names AI assistants [AEO-0025] the report cannot show business impact. Fail: report mentions only, and ask for the survey.
3. **Purchase filter in GA4.** Conversion numbers use the purchase event only, not any key event [MEA-0002].
4. **Profit link.** Panel questions map to products with known gross profit per order [MEA-0037].

## Steps

### 1. Set up the panel once

- 30 to 60 questions (practitioner default; enough to see change, small enough to run by hand), in five groups: category best-of ("best X for Y"), use case, comparisons with named rivals, brand facts ("does [store] ship to Pune", "is [store] legit"), and problem questions the product solves.
- Weight toward products with the highest gross profit per order.
- Assistants: ChatGPT with search on, Perplexity, Gemini, Copilot, and Google (AI Overview or AI Mode, in the target country). Only a few top cited domains overlap across platforms [AEO-0012], so each is tracked separately.
- If testing changes, keep half the questions as an untouched control [AEO-0035].

### 2. Run it the same way each month

- Same week each month, logged-out or clean session, location set to the selling country.
- Run each question twice per assistant; citations churn fast [AEO-0012].
- Mark whether the assistant actually searched the web. Answers given without search show no citations and say little about current visibility; discount them [AEO-0015].
- New pages can take 30 to 45 days to be cited in ChatGPT but as little as a day in Perplexity [AEO-0026], so judge a change on the right clock.

### 3. Record each answer

For each run: store named (yes or no), position in the list, products named, description accurate (yes, minor error, wrong), sentiment (positive, neutral, negative), rivals named, cited URLs, and whether a store URL was cited.

### 4. Compute the numbers

- **Mention share** per assistant = runs naming the store / runs with web search.
- **Top-3 share** = runs where the store is in the first three named.
- **Accuracy rate** = runs with an accurate description / runs naming the store.
- **Rival share** for each named rival, same method.
- Compare with last month and with the control group.

### 5. Read traffic and buyers

- **GA4:** inspect the default AI Assistant channel and compare session sources against known assistant referrers. Propose a custom group only for verified gaps; this read-only task does not change analytics settings. Report observed sessions, purchases and revenue with attribution limits; report gross profit only when reconciled cost data supports it.
- **Survey:** share of buyers answering "AI assistant". AI referral traffic can be a tiny share of visits but a much larger share of sign-ups found only through the survey [AEO-0020]. Check the survey against spend: channels should show up roughly in proportion [MEA-0045].
- **Search Console:** pages that hold position but lose clicks may be losing them to AI Overviews; check CTR against position [AEO-0005].

### 6. Turn findings into fixes

| Finding | Fix | Hand to |
|---|---|---|
| Wrong price, policy or fact | Update the brand facts page and repeat the fact on owned and third-party profiles [AEO-0011] | `get-recommended-by-ai-assistants` |
| A third-party page cited for rivals, not the store | Add to the source work queue; fix or pitch that exact page [AEO-0014] | `get-recommended-by-ai-assistants` |
| Store page cited but product not named | Make product facts clearer on that page | `answer-pages-for-buyer-questions` |
| No store page for a question | New answer page | `answer-pages-for-buyer-questions` |
| Wrong stock or price in AI shopping | Data sync issue | `product-data-for-ai-shopping` |
| Store not seen at all on one assistant | Check that assistant's crawler access | `technical-seo-audit-shopify` |

Rank fixes by: gross profit per order of the products in affected questions x number of affected questions.

### 7. Market notes

- **Each country:** run the panel with each country the store sells in as location, and include questions in the languages your buyers use. Marketplace pages (Amazon, Walmart, Etsy, Zalando, bol, Mercado Libre and the local leaders) are often the cited source for buying questions, so check how the store's own listings are described there.
- **Reviews:** check that review platforms cited for the store (Trustpilot, Google reviews, local review sites) show current ratings and responses.

### 8. Paid trackers (optional)

If the client uses one, read it alongside the manual panel, not instead of it. Check whether its runs used web search; trackers on free assistant tiers often record answers with no search [AEO-0015]. Never buy a tool because this skill needs it; the manual panel is enough.

## Checks before you hand it over

- Same panel, settings and run count as last month, or the change is stated.
- Every question run twice per assistant; no-search answers marked and discounted.
- Mention share, top-3 share and accuracy rate computed per assistant.
- GA4 numbers use purchases only.
- Survey share reported, or its absence stated as a gap.
- Every wrong fact has a fix and an owner.
- Fixes ranked by gross profit, each handed to a named skill.

## Output

1. **One-screen report:** mention share by assistant and change since last month, top-3 share, accuracy rate, rivals gaining, AI channel purchases and gross profit, survey share, the 5 fixes for this month.
2. **Panel sheet** (`ai-panel-YYYY-MM.csv`):

| Question | Group | Product | Gross profit per order | Assistant | Run | Searched (yes or no) | Store named | Position | Accurate | Sentiment | Rivals named | Cited URLs | Store URL cited |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

3. **Traffic and survey table:** Month, AI channel sessions, purchases, revenue, gross profit, survey share naming AI, Search Console clicks and impressions.
4. **Fix list:** Finding, Fix, Products, Gross profit per order, Questions affected, Hand to, Status.

## Common mistakes

- **Changing the panel each month.** Gate 1 keeps it fixed.
- **One run per question.** Step 2 runs twice; answers vary.
- **Counting no-search answers.** Step 2 discounts them.
- **Judging by clicks.** Step 5 adds the survey; most mentions have no link.
- **Reporting without fixes.** Step 6 turns every finding into a handed-off fix.
- **Buying a tracker first.** Step 8 keeps the free manual method as the standard.

## Sources

- AEO-0005: check CTR against position when clicks drop.
- AEO-0010: most AI brand mentions carry no link.
- AEO-0011: an official brand facts page corrects assistants.
- AEO-0012: track per platform; citations churn.
- AEO-0014: fix the specific cited sources.
- AEO-0015: discount answers without web search.
- AEO-0020: AI referrals undercounted; the survey finds them.
- AEO-0025: survey lists ChatGPT explicitly.
- AEO-0026: citation timing differs by assistant.
- AEO-0035: compare with an untouched control set.
- AEO-6460: AI Overview traffic sits in Search Console's Web data.
- MEA-0002: GA4 conversion rate must be filtered to purchase.
- MEA-0037: gross margin is delivered cost.
- MEA-0045: check the survey against channel spend.

What makes this skill ours: the panel is weighted to the store's highest-profit products and kept fixed so trends mean something; no-search answers are discounted; mention share is joined to purchases, gross profit and survey answers, not clicks alone; and every finding leaves the report as a fix handed to a named skill.

## Selling in India

- Set the panel location to India and add Hinglish and regional-language questions where the store sells in them.
- Amazon.in and Flipkart pages are often the cited source for Indian buying questions; check how the store's listings read there.
