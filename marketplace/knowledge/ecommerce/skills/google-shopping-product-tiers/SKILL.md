---
name: google-shopping-product-tiers
description: "Places every product in Google Shopping and Performance Max into one tier, from hero to dead stock, using gross profit per click built from Shopify product costs, stock cover and a minimum data rule, not ROAS alone. Tells apart a listing problem (title, image, price) from a page or price problem, gives each tier one action (push, hold, fix, test, clear or pause), and delivers three ready lists: feed fixes, bid or label changes, and pauses, plus the Merchant Center supplemental feed that carries the tiers. Read access only; the client approves every change. Use it monthly, before a sale, after a stock change, or when Shopping spend grows faster than profit."
---

# Shopping product tiers and feed fixes

**You get:** a product tier table for Shopping and Performance Max ranked by gross profit per click, plus feed fix, bid label, pause and supplemental feed label files, ready to upload.

Shopping and Performance Max spend money product by product. A campaign can look fine while a handful of products lose money on every click and a few winners run out of stock. This skill sorts products by what they earn per click after product costs, checks stock, finds whether the listing or the page is the problem, and fixes the feed.

## When to use

- Monthly, for any store running Shopping or Performance Max on a Merchant Center feed; check disapprovals weekly.
- Shopping spend is rising faster than gross profit.
- Before a sale, a stock arrival or a clearance, to decide which products get pushed.
- Merchant Center shows disapprovals or a falling number of active products.
- A best seller is about to run short and ads are still pushing it.

## Not for

- Search keywords and search terms: use `google-keyword-tiers` and `google-search-term-mining`.
- Whether Performance Max takes brand sales or drifts to YouTube: use `google-pmax-diagnostics`.
- Targets and budgets across campaigns: use `google-smart-bidding-budget`.
- Product photos: use `store-meta-product-photos`; product page gallery: `pdp-image-gallery-rebuild`.

## What you need

Required, read access (level 1):

1. **Google Ads product report**, last 30 days (90 for small stores). Columns: Item ID, Product title, Product type (level 1), Campaign, Campaign type (Shopping or Performance Max), Impressions, Clicks, CTR, Cost, Conversions, Conv. value, Avg. CPC. For Standard Shopping add Benchmark CTR and Benchmark max. CPC where shown.
2. **Merchant Center feed and diagnostics**: id, title, description, price, sale_price, availability, image_link, gtin, mpn, brand, product_type, google_product_category, custom_label_0 to 4, item issues, and price competitiveness where available.
3. **Shopify product export**: Variant SKU, Variant Price, Cost per item, Variant Inventory Qty, created date.
4. **Store costs per order**: fulfilment, payment fees, return rate, from `store-meta-math`.

Optional: reorder lead time per SKU, units sold per in-stock day, cash-on-delivery and RTO rates for India.

Missing input: ask once. Without Shopify costs, tier on conversion value per click only, label it "reduced confidence", and move nothing into hero or pause.

## Before you start: the gates

1. **Money gate.** Each product needs gross profit per sale: price after typical discount minus landed cost, fulfilment, fees and expected return loss [MEA-0037]. Fail: get "Cost per item" from Shopify or the cost sheet; no tiers without it.
2. **Stock gate.** Stock and lead time known for products with real spend. Fail: tier on money only and flag "stock unknown".
3. **Tracking gate.** One primary purchase action with real values [MEA-0017] [MEA-0016]. Fail: fix it first.
4. **Size gate.** Under about 30 active products there is too little catalogue to split into many campaigns [GAD-0001]; keep one campaign and use tiers for feed and bid fixes only.

## Steps

### 1. Join ads, feed and costs

Match Item ID to Shopify SKU or variant ID. For each product:

- Gross profit earned = conversions x gross profit per sale.
- Gross profit per click = gross profit earned / clicks.
- Profit after ads = gross profit earned minus cost.
- Break-even cost per click = gross profit per click.
- Days of cover = stock / units sold per in-stock day [OPS-0014].

India and cash on delivery: use profit per placed order, which subtracts the return-to-origin loss on refused orders (`store-meta-math`, step 4). Practitioner default, test it.

### 2. Apply the data rules

Practitioner defaults, test them:

- A product is judged only after clicks of at least 3 / the account's Shopping conversion rate (200 clicks at 1.5%), or cost of at least 2x its gross profit per sale. This scales with price, unlike a fixed spend line.
- Products live for under 30 days are never paused; they go to test.
- Below the data rule, a product is unproven, never a loser.

### 3. Find where a weak product breaks

For judged products losing money, compare CTR with the median CTR of its product type (or Google's Benchmark CTR):

- **CTR under about 70% of the median: listing problem.** Title, image or price loses the click. Fix the feed (step 6).
- **CTR fine, conversion poor: page or price problem.** Shoppers click and leave. Check the product page with `store-meta-landing`, and price against rivals.
- **Avg. CPC well above Benchmark max. CPC with weak CTR:** paying more to make up for a weak listing; fix the listing before raising bids.

Practitioner default, test it.

### 4. Place each product in one tier

First match wins; every product lands somewhere.

| Tier | Rule | Action |
|---|---|---|
| Stock risk | Days of cover shorter than reorder lead time | Lower its push or pause it; do not pay to sell out [ADC-0023] |
| Hero | Judged, profit after ads above zero, gross profit per click at least 1.5x Avg. CPC | Push: bid or label up 15 to 20%, or a lower ROAS target |
| Steady | Profit after ads above zero, gross profit per click 1.0 to 1.5x CPC | Hold; feed polish |
| Fix | Judged, profit after ads below zero, first time | Fix per step 3; bid down 20 to 30% meanwhile; recheck in 30 days |
| Test | Below the data rule, or new | Own small budget so it gets seen at all [GAD-0040] |
| Clear | Slow stock (C and D sellers) tying up cash | Own campaign at break-even or a small loss [FIN-0026] |
| Pause | Still losing after one fix cycle, no clearance need | Exclude via label or listing group; state cost to date |

Where margins sit within about 10 points of each other ROAS tiers work; where they spread (say 30% to 70%), one ROAS target overpays low-margin products [GAD-0040]. Gross profit per click covers both cases.

For cold traffic, concentrate on the few products with the lowest cost per purchase and let the rest sell through remarketing [GAD-0031]. Practitioner default: 3 to 10 heroes for most stores.

### 5. Carry tiers into campaigns

- Write the tier into one custom label (for example custom_label_0) and margin band into another, through a Merchant Center supplemental feed, which is free and leaves the main feed alone.
- **Standard Shopping:** bid per product group on the label.
- **Performance Max:** no per-product bids; use listing groups or separate campaigns by label.
- Keep one campaign by default; split only for materially different margins, brand versus non-brand, or countries [GAD-0043].

### 6. Fix the feed, product by product

Price, title and main image drive most Shopping results [GAD-0019].

- **Title:** product type and searched attributes first (material, colour, size, use), brand last unless people search the brand; searched words in the first 70 characters, about 120 in total [GAD-0009]. Lead with terms proven in the search terms report [GAD-0044].
- **Image:** the real product, no text or badges on the main image. Test a lifestyle or soft-background image against white where the category allows [GAD-0019].
- **Identifiers:** correct gtin, mpn and brand; correct google_product_category and product_type.
- **Price:** matches the page; with frequent changes, update at least every 6 hours and turn on automatic item updates [GAD-0005].
- **Disapprovals:** clear every issue on products with spend or stock.
- **Rival price:** a sudden CTR drop often means a rival cut price [GAD-0034]; match, hold on value, or pause.
- **Countries:** one feed per currency [GAD-0049].

### 7. Write the three lists

Feed fixes, bid or label changes, pauses, each sorted by cost to date.

## Checks before you hand it over

- Every tier call uses Shopify costs, and the gross profit formula is shown.
- Every product is in exactly one tier; none is paused below the data rule or under 30 days old.
- Stock risk is checked before any hero is pushed.
- Each losing product names its break point (listing or page) with the numbers.
- Spend and profit across tiers add up to the report totals.
- Every feed fix names field, old value and new value; labels ship as a supplemental feed.
- Nothing changes in Google Ads or Merchant Center without the client's yes.

## Output

**One-screen summary first:** products reviewed, spend and profit after ads by tier, money lost on losing products, heroes to push, stock risks, and the five feed fixes worth most.

**Table "Product tiers":** Item ID, Title, Campaign type, Clicks, CTR vs median, Cost, Conversions, Gross profit per click, Avg. CPC, Profit after ads, Days of cover, Tier, Break point, Action.

**Lists:** `feed-fixes.csv` (Item ID, Field, Current, New, Reason), `bid-label-changes.csv` (Item ID, Current, New, Direction, Reason), `pauses.csv` (Item ID, Reason, Cost to date), and `supplemental-feed-labels.csv` (id, custom_label_0, custom_label_1).

## Common mistakes

- **Tiering on ROAS with mixed margins.** A 4x ROAS on a 25% margin product loses money. Step 1 uses gross profit per click.
- **A fixed spend line for pauses.** It ignores price; step 2 scales with it.
- **Pausing before fixing.** Step 4 gives a losing product one fix cycle.
- **Raising bids on a weak listing.** Step 3 checks CTR first.
- **Pushing a hero into a stock-out** [ADC-0023], or forecasting from stock-out months [OPS-0014].
- **Splitting a small catalogue.** Each campaign starves [GAD-0043] [GAD-0001].

## Sources

- ADC-0023: when cover is shorter than lead time, raise the target or pause.
- FIN-0026: clear slow stock at break-even.
- GAD-0001, GAD-0043: when to split campaigns.
- GAD-0005, GAD-0049: price sync and one feed per currency.
- GAD-0009, GAD-0019, GAD-0044: titles, images and price drive Shopping.
- GAD-0031: cold traffic on the few cheapest-to-acquire products.
- GAD-0034: falling CTR can mean a rival price cut.
- GAD-0040: margin versus ROAS tiers; a test tier.
- MEA-0016, MEA-0017, MEA-0037: tracking and delivered gross margin.
- OPS-0014: forecast from in-stock days.

What makes this skill ours: tiers come from gross profit per click built from Shopify costs with a data rule that scales with price; each losing product is diagnosed as a listing or a page problem before money moves; stock cover can override a hero call; slow stock gets a clearance tier; and everything ships as ready files.
