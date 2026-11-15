---
name: category-demand-direction-check
description: "One clear call on a store's category, grow, hold or avoid, built from dated evidence that agrees across at least two kinds of source: Google Trends over five years and twelve months by country and state against a steady reference term, Google Keyword Planner search volume, Amazon Best Sellers and Movers and Shakers, review counts on top marketplace products logged over time, and early trend signals checked against a second dated source, all laid next to the store's own monthly sales. Adds a month-by-month seasonality map and a ranked list of adjacent and add-on products buyers already want. Use when an owner asks whether the market is growing or shrinking, before putting more money into a category, or when choosing what to add next."
---

# Category demand direction check

**You get:** a one-page call (grow, hold or avoid) with how sure it is and what would change it, an evidence table where every number has a source and a date, a seasonality map for each market the store sells in, and a ranked list of 5 to 10 adjacent or add-on products with their own direction and a rough margin check.

## When to use

- Sales are flat or falling and the owner wants to know if it is the market or the store.
- The owner is about to put more cash into stock or ads in one category.
- A trend tool or a viral post says a product is "exploding" and the owner wants proof.
- The store sells well and wants the next product its buyers would add to the basket.
- A store is deciding whether to sell in a new country (for example a US store weighing the UK, Canada or Australia) and wants to compare demand.

## Not for

- Full market sizing and competitor maps: use `niche-size-and-competition-check`.
- Hunting single new products to test: use `find-trending-products`.
- Proving buyers will pay before buying stock: use `validate-demand-before-buying-stock`.
- Forecasting the store's own reorders: use `forecast-demand-per-sku`.
- Studying one rival product: use `competitor-product-teardown`.

## What you need

Required:

1. **Store sales by product and month**, as far back as the store has them (Shopify export, plus Amazon, Walmart, Etsy, eBay or other marketplaces if sold there).
2. **The category in buyer words:** 5 to 10 terms buyers really search, from Search Console, ad search terms or `harvest-amazon-search-terms`.
3. **Markets:** the countries the store sells in or is weighing (US, UK, EU countries, Canada, Australia or others), and the states, regions or cities it ships to.
4. **Gross profit per order** for the current range, from `build-sku-profit-sheet`.

Optional: a Google Ads account (for Keyword Planner), Amazon seller access, rival store names, a trend tool login.

Access: level 1 (read) on the store, Search Console, Google Ads and marketplace accounts. Sheets and the report are saved as drafts at level 2. Nothing is bought, spent or published.

## Before you start: the gates

1. **Terms are buyer words.** Pass: terms come from real searches, not the brand's own names. Fail: pull Search Console or ad search terms first.
2. **Store line exists.** Pass: at least 12 months of store sales, or say plainly that the store line is short and the call leans on market data.
3. **Two kinds of source.** Pass: the call will rest on at least two independent kinds (search interest, search volume, marketplace ranks, review counts). Fail: no call; report "not enough evidence" and what to collect.

## Steps

### 1. Put the store's own line down first

Monthly units and revenue for the category, last 3 to 5 years if possible. Mark launches, stockouts, price changes and big ad changes, so they are not mistaken for market moves.

### 2. Read Google Trends properly

- Pull each main term for **five years** (direction) and **twelve months** (recent turns), for each country the store sells in, then by state or region.
- Trends shows each point as a share of all searches in that place and time, scaled 0 to 100. It is not a count, and two places with the same score can have very different volumes.
- Pull the **exact product term** beside the parent topic (for example "collagen gummies" as well as "collagen"). A parent topic at its peak does not mean the sub-product is still rising, and a falling parent can hide a rising sub-product.
- Add a **steady reference term** in the same comparison (a staple in the same space that has been flat for years). If your term rises against it, interest is rising; if both move together, it is a general shift.
- Trends samples searches and adds small random noise, so low-volume terms jump about. Treat any single spike as a flag until another source agrees.
- Read the slope: compare the last 12 months' average with the same months a year and two years earlier. Note the date you pulled it.

### 3. Size it with search volume

- Google Keyword Planner gives average monthly searches by country and the month-by-month pattern. Volumes are estimates; accounts with little spend may see ranges, so record the range, not a midpoint.
- Record the 3 to 5 biggest terms, their monthly volume, and the change against the same months last year.

### 4. Read the marketplaces

- **Amazon Best Sellers** (by category, on each country's Amazon site) shows what sells most now; **Movers and Shakers** shows the biggest climbers in sales rank over about the last day. A climber can be a small product with a big percentage jump, so log it for weeks before trusting it.
- Log the top 10 products in the category: name, price, rating, review count, and the date.
- **Review-count velocity:** repeat the log every 2 to 4 weeks (or use a dated snapshot or history tool if the store has one). New reviews per month is a rough proxy for new buyers. Rising across most of the top 10 means a growing category; rising for one or two only means share is moving between sellers.
- Repeat the read on the other big marketplaces in each market: Walmart in the US, Etsy for handmade and gifts, eBay for used and collectable goods, Zalando for fashion in Europe, bol in the Netherlands and Belgium, Mercado Libre in Latin America.

### 5. Check early signals twice

Trend tools, social posts and "exploding topic" lists can spot a rise early, but they also flag fads. Before any early signal carries weight:

- Find a **second dated source** that agrees (Trends slope, Keyword Planner change, or review velocity).
- Check it is not a single platform, a single creator, or a holiday spike.
- Check its seasonality: does it come back every year at the same time?

One unconfirmed signal goes in the table as "watch", never as evidence for grow.

### 6. Map the seasons

Month by month, by market: low, normal, peak, from the five-year Trends shape and Keyword Planner's monthly pattern, checked against the store's own months. Note festival and gifting peaks for each market: Black Friday and Cyber Monday, the December holidays, Mother's Day and back to school in most Western markets; Boxing Day in the UK, Canada and Australia; Singles' Day, Lunar New Year, Ramadan and Eid, and other local festivals where the store's buyers live. In the southern hemisphere the seasons flip, so summer goods peak around December to February in Australia. Work back: stock must land before the rise, and ads should start a few weeks before the peak.

### 7. Find adjacent and add-on products

Look for products the same buyer already wants:

- "Frequently bought together" and "customers also bought" on the top marketplace products.
- Related and rising searches in Trends and Keyword Planner around the main terms.
- The store's own baskets: which products appear together, and what repeat buyers buy second.
- What rivals bundle or upsell.

For each candidate: its own Trends direction, a volume figure, fit with the store's range and buyer, and a rough gross profit per order (via `build-sku-profit-sheet` inputs). Rank by direction x fit x margin; drop anything that loses money at a realistic ad cost.

### 8. Make the call

| Call | When |
|---|---|
| **Grow** | Two or more kinds of source agree demand is rising over 12 months and over 5 years (or the category is young and every source is rising), and the store's line is not falling faster than the market |
| **Hold** | Sources are flat or disagree, or the market is steady but the store is losing share (fix the store first) |
| **Avoid** | Two or more kinds of source agree demand is falling, or the rise is a one-season or one-platform spike |

Practitioner default; the owner can tighten it. State how sure you are (high, medium, low) and the one thing that would change the call.

Note two risks beside the call. **Copy speed:** how fast a new rival could launch the same thing (in some categories, such as supplements, a new brand can copy a formula in about 60 days) and what would slow them (brand, a patent, a supply deal, a hard process). Fast copying with no barrier caps the call at Hold for new stock. **One-trend risk:** if most of the range rides one hot ingredient, claim or style, say so, and name a core identity the store can keep while its products change; packs and messages that can follow whichever claim is rising carry less risk. A one-month spike is a fad shape, multi-year growth is growth, and wide local shop availability weakens online demand.

## Checks before you hand it over

- Every number has a source and the date it was pulled.
- Trends figures are described as relative interest, never as search counts.
- Each Trends read includes a steady reference term.
- The exact product term was read beside its parent topic.
- Copy speed and one-trend risk are noted beside the call.
- Keyword Planner ranges are kept as ranges.
- The call rests on at least two kinds of source that agree; unconfirmed signals are marked "watch".
- The store's own line is shown beside the market, with store events marked.
- Every add-on product has a direction, a fit note and a margin check.

## Output

**One-page call:** Grow, Hold or Avoid; how sure; three lines of evidence with dates; what would change it; next step (for example "hold spend, fix the product page", or "add the top two add-ons before the October peak").

**Evidence table:**

| Signal | Source | Market | Date pulled | Reading | Direction | Agrees with call? |
|---|---|---|---|---|---|---|

**Seasonality map:** month, level in each market (one column per country), store's own level, order-by date, ads-start date.

**Add-on list:**

| Product | Why buyers want it | Trends direction | Monthly searches | Fit | Rough profit per order | Rank |
|---|---|---|---|---|---|---|

**Review velocity log** (`review-velocity.csv`): product, marketplace, date, price, rating, review count, change since last log.

## Common mistakes

- **Reading Trends as volume.** Step 2 treats it as share of searches, and step 3 adds volume.
- **No reference term.** Step 2 adds a steady term so the line has a scale.
- **Reading the parent trend as the product's trend.** Step 2 pulls the exact term too.
- **Betting the range on one trend.** Step 8 notes one-trend risk and a core identity.
- **One viral spike.** Step 5 needs a second dated source.
- **Blaming the market for the store's drop.** Step 1 puts the store's line beside it.
- **Trusting one Movers and Shakers jump.** Step 4 logs it over weeks.
- **Add-ons with no margin check.** Step 7 drops anything that loses money.

## Sources

- Google Trends help, how Trends data is adjusted and sampled: https://support.google.com/trends/answer/4365533
- Google Ads help, using Keyword Planner: https://support.google.com/google-ads/answer/7337243
- Exploding Topics, methodology (how trend tools score growth, seasonality and volatility): https://explodingtopics.com/methodology

What makes this skill ours: the store's own sales sit on the same chart as the market, so a store problem is never called a market problem; every Trends read carries a steady reference term; no call is made unless two kinds of dated source agree; and add-on products are ranked only after a margin check, with stock and ad timing worked back from the season.

## Selling in India

- Read Google Trends and Keyword Planner for India as its own market, then by state; demand differs a lot between metros and smaller cities.
- Repeat the marketplace read on Flipkart and, for beauty or fashion, Nykaa or Myntra, beside Amazon.in Best Sellers.
- Mark the Indian gifting peaks on the seasonality map: Diwali, Raksha Bandhan and wedding season. Stock must land and ads must start before them, the same as any other peak.
