---
name: build-google-search-campaign
description: "Builds a ready-to-approve Google Search campaign for an online store from scratch: separate brand, product and competitor groups, keywords by intent with match types, a starting negative list, one ad per group with assets, and starting bids and budgets worked back from the store's gross profit per purchase. Delivered as a Google Ads Editor sheet plus a one-page settings list, built paused for the client to approve. Covers market notes (local language and spelling queries, payment and delivery wording, tax on ad invoices) for the US, UK, EU and other markets. Use when a store has no Search campaign, when an old one is a tangle of mixed brand and non-brand traffic, or when Shopping is running and the store wants Search for extra volume."
---

# Google Search campaign from scratch

**You get:** one Search campaign set (brand, product and competitor campaigns) as a Google Ads Editor import sheet with every keyword, negative, ad and asset filled in, a settings sheet with bids and budgets from the store's own break-even, and a 14-day check plan, all built paused for the client's yes.

## When to use

- The store sells on Google Shopping or Performance Max and wants Search for queries Shopping misses.
- There is no Search campaign, or the old one mixes brand and non-brand keywords in one budget.
- A product or category has clear search demand (people type what it is or the problem it solves).
- After `google-search-term-mining` finds converting queries with no keyword of their own.

## Not for

- Writing the full 15-headline ad sets for each group: use `write-google-responsive-search-ads` after this skill sets the groups.
- Brand-only defence against rivals and resellers: use `protect-brand-search-terms`.
- Fixing an existing Search account: use `google-ads-account-audit`, then `google-keyword-tiers`.
- Planning which campaign types to launch first in a new account: use `google-ads-first-90-days`.

## What you need

Required:

1. **Gross profit per purchase** from `store-meta-math` or `build-sku-profit-sheet`: price after discount minus product cost, shipping, payment fees, returns and, where the store offers pay on delivery, failed-delivery losses.
2. **Product list** with URLs, prices and stock: Shopify product export (Handle, Title, Variant Price, Variant Inventory Qty) or a live collection URL.
3. **Search demand**: Keyword Planner (free inside Google Ads) for 30 to 80 seed terms, and the Search terms report from any Shopping or Performance Max campaign (last 90 days: Search term, Clicks, Cost, Conversions, Conv. value).
4. **Conversion tracking state**: one primary purchase action with real order values. If unsure, run `check-google-ads-conversion-tracking` first.
5. **Monthly cash the client can spend** on Google Search and how many orders the team can ship.

Optional: Google Search Console queries (free), a list of the top three rivals, past Google Ads exports.

If Keyword Planner shows no volume (new account), use Search Console and the Shopping search terms. If there is no search term history at all, build only the brand group and the top product group, and add the rest after 30 days.

Access: read access to research; draft access (level 2) to load the paused campaign. Nothing goes live without the client's yes on the settings sheet.

## Before you start: the gates

1. **Profit.** Gross profit per purchase is known. Fail: stop and run `store-meta-math`; bids cannot be set without it.
2. **Tracking.** Exactly one primary purchase action, sending real order value, with enhanced conversions on [MEA-0017] [MEA-0016]. Fail: fix tracking first; Smart Bidding on bad data learns the wrong thing.
3. **Cash and capacity.** The monthly budget covers at least the test spend in step 7 and the warehouse can ship the extra orders. Fail: build the brand and top product group only.
4. **Claims.** Ads say only what `product-claims-profile` allows. Health, finance and regulated products follow Google's healthcare and restricted content policies; problem-led ads for supplements must not claim to treat a condition [GAD-0025].
5. **Shopping first.** For most stores Shopping carries most Google sales [GAD-0054]. If the store has a feed and no Shopping campaign, say so in the first line and recommend Shopping first; Search still gets built if the client wants it.

## Steps

### 1. Work out the money lines

- Break-even cost per purchase (CPA) = gross profit per purchase. Break-even ROAS = 1 / gross margin [GAD-0023].
- Target CPA = break-even CPA minus the profit the client wants per order.
- Starting max CPC = target CPA x expected conversion rate. Use the store's own Google conversion rate if it exists; if not, use the store's sitewide rate halved (practitioner default, test it). CPA = CPC / conversion rate, so a high CPC is fine only if the rate rises with it [GAD-0038].
- Tax: if the store cannot reclaim the VAT or other tax shown on the Google Ads invoice, add it to ad cost before comparing with profit. If the store offers pay on delivery, count those orders only after delivery when working out conversion rate from Shopify.

### 2. Sort keywords into four groups

| Group | What it holds | Example pattern |
|---|---|---|
| Brand | Store name, store name plus product, misspellings | "storename", "storename linen shirt" |
| Product: transactional | Product type plus buying words, size, colour, material, use | "linen shirt men", "buy steel water bottle 1 litre" |
| Product: problem | The problem the product solves, only where the product truly solves it | "water bottle that keeps cold all day" |
| Competitor | Rival brand names, kept in their own campaign | "rivalname bottle" |

Rules:
- One theme per ad group, 5 to 20 close keywords each. A theme is one product type plus one buyer need.
- Drop terms with research intent only ("how is X made", "X meaning") unless a page answers them and sells.
- Keep comparison terms ("X vs Y", "best X for Y") in their own ad group, with a page that compares honestly.
- Language: add the spellings and mixed-language forms buyers really type (US and UK spelling such as "color" and "colour", local words, common misspellings), and terms in the other languages your buyers use only if the landing page and ads exist in that language. Run one campaign per country or language.

### 3. Choose match types

- Brand: exact and phrase.
- Product groups at launch: phrase and exact. Add broad only after the campaign has 30 or more purchases a month on Smart Bidding, in a separate ad group so its search terms can be read (practitioner default, test it).
- Competitor: exact only.

### 4. Build the starting negative list

Three shared lists, applied before launch:
- **Brand list**: the store's brand terms as exact negatives on every non-brand campaign [GAD-0028].
- **Waste list**: free, jobs, salary, DIY, how to make, wholesale (unless the store sells wholesale), second hand, repair, PDF, images, and any product type the store does not sell.
- **Competitor list**: rival names as negatives on product campaigns, so rival traffic is only bought on purpose.

In the first 30 days, review search terms weekly; that is when the campaign wanders widest. Hand the review to `google-search-term-mining`.

### 5. Write one ad per group, plus assets

Each ad group gets one responsive search ad. Start with 8 to 10 strong headlines and 2 to 3 descriptions rather than filling all 15 and 4 slots, so combinations get real traffic [GAD-0052]; `write-google-responsive-search-ads` can expand them later.

- Headline 1 to 3 candidates repeat the ad group's theme in buyer words.
- Include price or offer only if it is live today and matches the page.
- Competitor ads must not use the rival's trademark in ad text; Google can restrict that after a complaint, while bidding on the name as a keyword is not restricted [GAD-6120].
- All markets: say "Pay on delivery available", "Free delivery over 50" or "Free returns" only if true on the site, and state the real shipping and returns terms.
- Assets: 4 sitelinks (best seller collection, size guide or how to choose, reviews, returns or delivery), 4 callouts, 1 structured snippet (Types or Styles). Google's limits: headline 30 characters, description 90, path fields 15 each.

Landing pages: product groups go to the closest product or collection page, never the home page. Brand goes to the home page or the best seller page.

### 6. Set campaign settings

| Setting | Brand | Product | Competitor |
|---|---|---|---|
| Networks | Search only; Search partners and Display off [GAD-0042] | Same | Same |
| Location option | Presence (people in the location) | Same | Same |
| Bidding at launch | Manual CPC with a cap, or Target impression share with a max CPC cap | Manual CPC or Maximize clicks with a CPC cap; move to Maximize conversion value at 15 to 20 purchases, then Target ROAS at 30 to 50 a month, set at or just below the trailing 30-day ROAS [GAD-0021] | Manual CPC |
| Budget | Enough to never be limited on brand | The rest, after brand | Capped, 10% or less of Search budget at launch (practitioner default, test it) |
| Brand settings | Brand inclusion optional | Brand exclusion for the store's own brand, where the interface offers it [GAD-6121] | Exclude own brand |
| Auto-apply recommendations | Off [GAD-0042] | Off | Off |

Keep brand and non-brand in separate campaigns so non-brand profit is visible; blended numbers hide whether prospecting pays [GAD-0003].

### 7. Set the test budget

Test spend for each product campaign = target CPA x 20 purchases (practitioner default, test it). Monthly budget = sum of test spends plus brand. If the client's cash is lower, cut the number of product ad groups, not the bids.

### 8. Write the 14-day check plan

- Day 1 to 3: ads approved, impressions on every ad group, no search partner traffic, tracking firing.
- Day 7: search terms reviewed, waste added to negatives; non-brand click-through rate checked against a rough 7 to 8% floor from one agency's norms [GAD-0020].
- Day 14: cost per purchase by ad group against target CPA, judged on "conversions by conversion time" because recent days under-count [GAD-0035].

### 9. Category campaigns and converting searches

**Category campaign** for a popular collection: one ad group per collection, 3 to 5 phrase keywords (10 at most), never two collections in one ad group, ads that send to the collection page, brand terms as negatives. Build it only when the category has real search volume, and start at about 20 to 30 a day (more for high order values).

- **Mine winners first.** Pull converting queries from the Shopping and Performance Max search terms and add them as exact match before guessing new ones.
- **Drop terms the margin cannot pay for.** Keyword Planner's top-of-page bid / the store's conversion rate gives a likely cost per sale; drop the term if that is above break-even cost per sale.
- **Intent decides the page.** Buying terms go to product or collection pages; research terms go to a blog post or advertorial or are left out; competitor-name terms stay in their own campaign.
- **Ad group size.** Single-topic ad groups of about 10 to 20 related keywords have replaced one-keyword groups, because exact match now matches meaning [GAD-6167]. Small stores start with 3 to 5 groups.
- **Negatives rhythm.** Weekly in the first 30 days, daily on big budgets, then weekly or fortnightly, plus an account-wide negative list [GAD-6168].

## Checks before you hand it over

- Every non-brand campaign carries the brand negative list; the brand campaign has no non-brand keywords.
- Every keyword is in exactly one ad group; no duplicates across groups.
- Every ad group lands on a page that sells the thing in its keywords, live and in stock today.
- Bids and budgets trace back to gross profit per purchase, with the sum shown.
- No ad uses a rival's trademark, an untrue offer or a claim outside the claims profile.
- Search partners, Display and auto-apply are off; location option is Presence.
- Everything is built paused; nothing is enabled without the client's yes.
- Each category ad group holds one collection and points to that collection page.

## Output

1. **One-screen summary:** campaigns, ad groups, keyword count, starting bids, monthly budget, break-even CPA and target CPA, and what to watch in the first 14 days. One runner-up structure in one line.
2. **Editor import sheet** (`search-build.csv`): Campaign, Ad group, Keyword, Match type, Max CPC, Final URL, Status (Paused).
3. **Negatives sheet**: List name, Negative keyword, Match type, Applied to.
4. **Ads sheet**: Campaign, Ad group, Headline 1 to 10, Description 1 to 3, Path 1, Path 2, Final URL, character counts.
5. **Assets sheet**: Type, Text, Description lines, Final URL.
6. **Settings sheet for approval**: each setting in step 6, the value, and a Yes or No column for the client.
7. **14-day check plan** with dates and owners.

## Common mistakes

- **Brand and non-brand in one campaign.** Brand makes the whole campaign look profitable. Steps 4 and 6 split them.
- **Bids from a benchmark CPC.** Step 1 works them back from the store's own profit.
- **Broad match on day one with no data.** Step 3 holds broad until there are enough purchases.
- **Rival names in ad text.** Step 5 keeps them to keywords only.
- **Home page as the landing page for product terms.** Step 5 points each group to its own page.
- **Judging last week on default columns.** Step 8 uses conversion time.
- **Two collections in one ad group.** The ad and page can match only one of them.

## Sources

- GAD-0003: brand flatters blended results; separate it.
- GAD-0020: rough click-through norms for Search.
- GAD-0021: launch bidding and when to move to Target ROAS.
- GAD-0023: break-even ROAS and CPA from margin.
- GAD-0025: problem-led queries and health claim limits.
- GAD-0028: exact brand negatives on every non-brand campaign.
- GAD-0035: recent days under-count on click-date columns.
- GAD-0038: CPA equals CPC divided by conversion rate.
- GAD-0042: common setting leaks (Display in Search, auto-apply).
- GAD-0052: fewer, stronger headlines get tested properly.
- GAD-0054: Shopping usually carries most store sales on Google.
- GAD-6120: trademark as keyword allowed; in ad text restricted.
- GAD-6121: brand exclusions and inclusions in Search.
- MEA-0016, MEA-0017: real order values, one primary purchase action.
- GAD-6167: single-topic ad groups of 10 to 20 keywords.
- GAD-6168: negatives rhythm.

What makes this skill ours: max CPC and every budget are worked back from the store's gross profit per purchase, not a benchmark; the competitor campaign is capped and kept out of the trademark trap; local language queries and payment wording are built in only where true; and the build ships paused with a dated 14-day check plan.

## Selling in India

- Add the GST on the Google Ads invoice to ad cost, and count cash-on-delivery orders only after delivery.
- Add Hinglish and transliterated forms buyers type ("kurta for men cotton", "bottle ka price").
- Say "Cash on delivery available" only if true on the site.
