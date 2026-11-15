---
name: merchandise-homepage-and-collections
description: "A merchandising slot plan for the homepage and the store's main collections: which product sits in each homepage slot and in the first rows of each key collection, in what order, set by profit per product view, stock cover and size runs, and what really sells, instead of revenue rank or the newest upload. Includes the rules that move a product up or down each week (low stock, broken sizes, high returns, a new arrival's trial slot) and the Shopify settings to apply them. Use when the homepage or collection grids are arranged by hand or by default sort, when best sellers keep going out of stock in the top slots, or before a season or sale changes what should lead."
---

# Merchandise the homepage and collections

**You get:** a slot plan sheet: every homepage slot and the first 8 to 12 positions of each key collection, with the product, its merch score, stock cover and the reason; the weekly move-up and move-down rules; and a numbered set-up list for Shopify, ready for approval.

## When to use

- Homepage and collection order was set once and never revisited.
- Top slots show products that are low on stock, missing popular sizes or thin on margin.
- Paid traffic lands on collection pages and conversion varies week to week.
- A season, launch or sale changes what should lead.

## Not for

- Menu and collection structure, tags and automated rules: use `set-up-navigation-and-collections`.
- Collection page intro copy, filters and product card design: use `build-collection-page-that-converts`.
- Homepage copy: use `write-homepage-copy`.
- Deciding which products to keep or cut from the range: use `rank-products-to-push-or-cut`.

## What you need

Required (read access):

1. **Shopify order export**, last 60 to 90 days: Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Created at.
2. **Product page sessions** by product (Shopify Analytics "Sessions by landing page" or GA4 item views) for the same window.
3. **Contribution per unit** by product from `build-sku-profit-sheet`.
4. **Inventory by variant** with days of stock remaining, and supplier lead time.
5. **Return rate** and rating by product.
6. **Current homepage sections and collection list** with their current sort.

Optional: scroll and click maps for homepage and top collections, landing page report for paid traffic, launch dates.

If contribution per unit is missing, rank by units sold on in-stock days and mark the plan "provisional". Reordering collections or editing homepage sections needs draft access (level 2) and the client's yes before publishing.

## Before you start: the gates

1. **Contribution per product is known** (or the plan is marked provisional).
2. **Demand is read on in-stock days only.** Days a product was out of stock make it look weaker than it is [OPS-0014]. Fail: rebuild demand before ranking.
3. **Revenue rank is not profit rank.** Shopify's ABC report grades products by revenue only, ignoring cost [COG-6285]; use it as an input, not the answer.

## Steps

### 1. Score every product

Merch score = view-to-order rate x contribution per order, using in-stock days only. This is the profit each product view earns, so the slots with the most views go to the products that earn most from them.

- View-to-order rate = orders containing the product / product page sessions.
- For products with fewer than 30 sessions, use the collection average and mark them "new or thin data".

### 2. Apply the stock and quality gates

A product cannot hold a top slot if:

- Stock cover is below the weeks until the next restock can land (from lead time). Practitioner default: under 3 weeks of cover moves it below the first screen.
- For apparel and footwear, the most-bought sizes or colours are out. A winner with a broken size run sends a large share of shoppers to unavailable options; the top six slots of a paid landing grid need daily checks [LPG-0069].
- Return rate is well above the store average for its category, or rating is under the store's floor (default 4.0).

Gated products drop below row three and are flagged for the buyer or `set-reorder-points-and-safety-stock`.

### 3. Plan the homepage slots

Most visitors never pass the hero; on collection grids reach falls with each row [LPG-0041]. So:

- **Hero:** one product or collection with the highest merch score that has at least 6 weeks of stock, or the season's planned lead. Not a slideshow of five.
- **First product row:** 4 products on mobile (two by two) with price and a few "best seller" or "new" labels [LPG-0059]. Fill from the top merch scores across categories so each main category shows one.
- **Shop-by tiles:** order by the share of orders each category drives, not by catalogue order.
- **One trial slot** for a new arrival (step 5).
- **Menu:** a best-seller row at the top of the mobile menu, since new visitors often open the menu first [LPG-0061].

Judge the homepage by its view-product rate, the share of homepage visitors who open a product page [LPG-0033].

### 4. Order each key collection

Pick the collections that get the most sessions or paid traffic. For each:

- **Pin the first 8 to 12** by merch score after the gates, mixing price points so the first screen shows a choice.
- **Below the pinned rows,** use an automatic sort. Shopify's default "best selling" sort does not see profit or stock, so keep the pinned rows manual and refresh them weekly.
- **Do not pin slow stock at the top.** Give slow products a fixed lower slot or their own collection; push them through offers instead (`clear-slow-moving-stock`). Raising sell-through frees cash [FIN-0028], but not at the cost of the top slots.
- Keep page length in the range the theme handles well; one search card suggests 36 to 48 products per page for collections [SEO-0005].

### 5. Give new products a fair trial

New arrivals have no score. Give each one a trial slot (second or third row of its collection, one homepage slot shared by all new arrivals) for two weeks. After two weeks, score it like the rest: keep it high if its merch score beats the median of the pinned rows, otherwise move it to the automatic sort.

### 6. Write the weekly rules

Every Monday (or in the weekly review):

- Recompute merch scores for the last 28 in-stock days.
- Move down: any product that failed a gate this week.
- Move up: the highest-scoring product below the pinned rows, if it passes the gates.
- Swap the hero only if its stock or score fell, or a planned season starts.
- During a sale, lead with products that are in the sale and have stock for the whole sale; never feature a product the sale excludes.

### 7. Market notes

- **Every market:** count return and failed-delivery losses in contribution, so products with high returns do not take top slots on order count alone. Plan peak-season collections (Black Friday and Cyber Monday, holiday gifting, local festivals) 3 to 4 weeks ahead with stock checked by variant. Products with regional or country demand can lead their own landing pages.
- **US:** plan holiday gift collections with shipping cutoff messages; seasonal products leave top slots when their season's demand drops, not when stock runs out.
- **UK and EU:** show prices with VAT included on the homepage and collections; for multi-country stores, check each country's top products, since best sellers differ by market.

### 8. Read it after two weeks

Compare with the two weeks before: homepage view-product rate, collection conversion, contribution per session on the top collections, stockouts in top slots.

## Checks before you hand it over

- Every top slot shows the product's merch score, stock cover and reason.
- No product in the first screen fails the stock, size or return gate.
- Demand was read on in-stock days only.
- Each key collection has pinned rows and a stated automatic sort below them.
- Slow stock is not pinned at the top.
- New arrivals have trial slots with a two-week review date.
- Weekly move rules are written with an owner.
- Nothing was published without a client yes.

## Output

**One-screen summary:** the hero choice, the first homepage row, the top collections changed, products moved down for stock or returns, and the expected effect to check at two weeks.

**Slot plan sheet:**

| Page | Section or position | Product | Category | Merch score | Contribution per order | View-to-order rate | Stock cover (weeks) | Size run complete? | Return rate | Rating | Reason | Trial slot? | Review date |

**Weekly rules card** and **set-up list** (homepage sections to edit, collections to switch to manual for the pinned rows, products to pin). **Assumptions:** the rating floor, stock cover line and collections in scope, where not given, as the value used and why, one line each.

## Common mistakes

- **Revenue rank as the order.** Step 1 scores profit per view.
- **Out-of-stock winners at the top.** Step 2 gates on stock and size runs.
- **Demand read through stockouts.** The gates use in-stock days.
- **Slow stock pinned first to clear it.** Step 4 keeps it lower and routes it to offers.
- **New products never seen.** Step 5 gives them a trial.
- **Set once, never changed.** Step 6 makes it a weekly job.

## Sources

- OPS-0014: forecast from in-stock days only.
- COG-6285: Shopify ABC is revenue only; days of inventory remaining.
- LPG-0069: top six slots and size runs need daily checks.
- LPG-0041: reach falls after the hero and with each row.
- LPG-0059: four products on the first mobile screen.
- LPG-0061: best sellers at the top of the menu.
- LPG-0033: judge the homepage by view-product rate.
- FIN-0028: sell-through frees cash.
- SEO-0005: collection page length.

What makes this skill ours: slots go to the products that earn the most profit per view, read on in-stock days; stock cover, size runs and returns can knock a winner out of the first screen; new products get a fair two-week trial; and the plan comes with weekly move rules so the top rows stay right as stock changes.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Count RTO losses in contribution, so COD-heavy products with high RTO do not take top slots. Plan Diwali gifting and wedding season collections 3 to 4 weeks ahead with stock checked by variant.
