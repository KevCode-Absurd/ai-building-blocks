---
name: sponsored-products-structure
description: Design or rebuild an Amazon Sponsored Products account by product and match type - automatic discovery campaigns, manual keyword campaigns split by match type, product-targeting campaigns, a naming pattern anyone can read, starting bids, bidding strategy, placement adjustments and daily budgets - and a migration plan from a messy account. Use for a new seller's first build, a launch, or a cleanup of years of overlapping automatic campaigns. Adds Sponsored Brands only where Brand Registry allows.
---

# Sponsored Products structure

## When to use

- A seller's first Amazon Ads build.
- A new product launch that needs its own campaigns.
- An account with dozens of overlapping campaigns, mixed products and no naming pattern.
- Before handing an account to someone else, so it can be read.

## What you need

- Product list with price, profit before ads and break-even ACOS (from the break-even-acos-review skill).
- Which products are launch, growth or defend.
- Current campaign list (bulk download or campaign report): campaign, ad group, products, targeting type, match types, bids, budgets, bidding strategy, spend and sales for 60 days.
- Search term report (60 days) for keywords to seed manual campaigns.
- The client's daily and monthly spend cap.
- Whether the brand is in Brand Registry (needed for Sponsored Brands and display ads).

**Access:** level 1 to map the account; level 2 to build the new campaigns paused; level 3 to launch them and pause old ones within the limits. Pausing old campaigns is reversible; archiving is not, so archiving always needs a fresh yes.

## Steps

### 1. Map what exists
List every campaign with its products, targeting type, match types, spend and sales. Flag: campaigns mixing unrelated products or categories, the same product in many automatic campaigns, keywords and product targets mixed in one ad group (Amazon advises against this), and campaigns with no sales in 60 days.

### 2. Group products
Group by category and then by price and conversion rate, because everything in an ad group shares bids. One hero product can have its own group. Amazon allows up to 1,000 products per ad group, but small groups are easier to control.

### 3. Lay out the campaigns per product group
- **Auto (discovery):** one automatic campaign. Bid the four groups (close match, loose match, substitutes, complements) separately once data comes in.
- **Manual exact:** harvested and proven keywords.
- **Manual phrase or broad:** research keywords to find new searches; Amazon suggests at least 25 to 30 keywords to start and bidding highest on exact, lower on phrase, lowest on broad.
- **Manual product targeting:** rival ASINs and categories, refined by price, rating or brand; and your own detail pages to cross-sell.
- **Brand defence (optional):** your own brand terms in exact, kept separate so brand and non-brand results stay apart.

Targeting type can't be changed after launch, so decide auto or manual per campaign before building.

### 4. Name everything the same way
Pattern: `Product_AdType_Targeting_Match_Phase`, for example `BambooBoard_SP_KW_Exact_Growth`. Underscores keep names readable in reports and safe in spreadsheets. Use portfolios for brand or category.

### 5. Set starting bids and bidding strategy
- Start from Amazon's suggested bid, then check it against the product's margin: the most a click can be worth is roughly break-even ACOS × price × expected conversion rate. Use the seller's own conversion rate, not a guess.
- Bidding strategy: Amazon suggests dynamic bids up and down for automatic campaigns, and down only where you protect return on spend. Fixed bids for tests where you need control.
- Placement adjustments (top of search, rest of search, product pages; up to 900%) only where the placement report shows a placement converts better.

### 6. Set budgets
Start near Amazon's suggested 10 USD, 10 GBP or 10 EUR a day per campaign or what the cap allows, and give exact-match and proven campaigns budget first. Daily budgets aren't paced through the day, so watch for campaigns that run out early. The total across campaigns must sit inside the client's cap.

### 7. Plan the migration from the old account
- Build new campaigns paused (level 2).
- Move keywords with their history in mind: copy proven keywords with bids near their current average CPC.
- Launch new, then pause old campaigns product by product, not all at once, so you can compare.
- Keep old campaigns paused, not archived, for at least one review period.

### 8. Add Sponsored Brands where it fits
Only with Brand Registry, and after Sponsored Products is running, as Amazon's launch playbook suggests. Start with brand and top category keywords, and a collection or video linking to the Brand Store.

## Checks

- Every product appears in exactly one auto campaign and one set of manual campaigns.
- No ad group mixes keywords and product targets.
- Names follow the pattern everywhere.
- Every bid has a reason tied to margin or data.
- Budgets add up to no more than the cap.
- Old campaigns are paused, not archived, and the order of switching is written down.
- Sponsored Brands is included only if Brand Registry is confirmed.

## Output format

1. **Current account map:** problems found, with spend affected.
2. **New structure:** table of campaign name, ad group, products, targeting, match type, bidding strategy, starting bid, placement adjustments, daily budget.
3. **Naming rules:** the pattern and three examples.
4. **Migration plan:** dated steps, what is paused when, and what's checked after each step.
5. **Approval list:** numbered items for the client's yes, or the level 3 log.

## Example of good output (short)

*Illustrative structure, not a real business: a camping gear seller with 12 products on Amazon UK. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Found:** 38 campaigns. 14 automatic campaigns each hold 6 to 12 products; the same products sit in 9 of them. 31% of 60-day spend is on campaigns mixing tents and cookware.
>
> **New structure (Tents group)**
> | Campaign | Targeting | Match | Strategy | Start bid | Budget/day |
> |---|---|---|---|---|---|
> | Tents_SP_Auto_Growth | Auto groups | Close, loose, subs, compl | Up and down | 0.70 | £12 |
> | Tents_SP_KW_Exact_Growth | Keywords | Exact | Down only | 0.95 | £15 |
> | Tents_SP_KW_Phrase_Growth | Keywords | Phrase | Down only | 0.65 | £8 |
> | Tents_SP_PT_Rivals_Growth | Rival ASINs | n/a | Down only | 0.60 | £5 |
>
> Placement: +40% top of search on Exact only, because top of search converted at twice the rate of product pages in your placement report.
>
> **Migration:** build all paused by 12 Nov; switch Tents on 13 Nov and pause the 9 old campaigns holding tents; review 27 Nov before moving Cookware.
>
> Total new budget £40 a day, inside your £45 cap. Reply yes or no to each step.
