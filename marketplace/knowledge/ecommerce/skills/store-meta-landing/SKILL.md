---
name: store-meta-landing
description: "Check the product pages and collection pages a store's Meta ads land on, on a phone, the way a shopper arrives from an ad. Tests message match with the ad, mobile speed, price and shipping clarity, reviews, stock of the advertised variants, checkout friction and whether the Pixel fires the right events. Ranks fixes by gross profit at stake per month, using the store's own traffic, revenue per visitor and gross profit per purchase. Use when ads get clicks but few sales, before scaling spend, before a sale, or after a theme or app change. Read access only."
---

# Meta ad landing page check for an online store

**You get:** a phone-first check of every page the Meta ads land on, with a page table, pass or fail checks, a ranked fix list with gross profit at stake, and screenshots.

## When to use

- Ads get link clicks at a normal cost, but purchases per click are low.
- Before raising spend: the page must be able to turn paid clicks into profit.
- Before a sale, a launch, or a new batch of ads that point to new pages.
- After a theme change, a new app or a new checkout setting.
- The ad says one thing and the owner suspects the page says another.

## Not for

- Judging which ads to keep or cut: use `store-meta-creative-review`.
- Setting up or repairing the Pixel and Conversions API: use `store-meta-capi`.
- Planning budgets and campaign structure: use `store-meta-plan`.
- Designing a split test and its sample size: use `store-meta-test`.

## What you need

Required:

1. **Meta Ads Manager export**, last 30 days, ad level: Campaign name, Ad name, Ad ID, Website URL (or link), Amount spent, Link clicks, Landing page views, Adds to cart, Checkouts initiated, Purchases, Purchases conversion value, Attribution setting. Group spend by landing URL.
2. **Ad previews** for the ads behind the top URLs: image or video, primary text, headline, offer.
3. **The live URLs**, opened on a real phone.
4. **Gross profit per purchase (GPP)** for the advertised products, or the cost sheet to compute it as `store-meta-plan` does.

Optional, each raises confidence:

5. Shopify Analytics or GA4 funnel for the same 30 days: sessions, product views, add to cart, reached checkout, orders, by landing page and device.
6. Shopify order export (Name, Created at, Total, Discount Code, Shipping, Payment Method, Lineitem name) to check which offers and payment methods buyers really use.
7. Stock by variant for advertised products.
8. Heatmaps or session recordings, if the store already has them.

Missing 1 to 4: ask once. Missing 5 to 8: work from the ad export and the live page, and mark the ranking "reduced confidence".

**Access:** level 1 (read) for every check. A test order on the live store is the owner's action: ask before suggesting one, and never enter payment details yourself. Page fixes are proposals; level 2 lets you draft them in an unpublished theme copy, and publishing needs level 3 and a yes.

## Before you start: the gates

1. **Money.** *Pass:* GPP known for each advertised product, so a fix can be valued in gross profit. *Fail:* run the checks, list fixes unranked, and say ranking waits for GPP.
2. **Stock.** *Pass:* the advertised variants (sizes, colours, bundles) are in stock, or the ad is paused. *Fail:* an ad sending paid clicks to a sold-out variant is finding 1; tell the owner the same day.
3. **Cash.** *Pass:* the owner knows which fixes need paid help (developer, app). *Fail:* split fixes into "free in the theme editor" and "needs paid help".
4. **Tracking.** *Pass:* Meta purchases are not above Shopify orders for the same dates. *Fail:* page conversion numbers are unreliable; do the page checks, but send the tracking fix to `store-meta-capi` before judging any page by its Meta numbers.

## Steps

1. **Pick the pages that carry the money.** Sort landing URLs by spend. Check every URL in the top 80% of spend, and at most 8. Per URL compute: link clicks, landing page views ÷ link clicks (under about 80% suggests slow loads or redirects; practitioner default, test it), purchases ÷ landing page views, and revenue per visitor.

2. **Arrive like a shopper.** Open each ad on a phone through its Ads Manager preview link, so the page loads in Facebook's or Instagram's in-app browser, not desktop Chrome. Screenshot the first screen, then each scroll.

3. **Message match.** Pass or fail each:
   - The product, buyer and promise in the ad appear in the first screen.
   - The offer in the ad (price, discount, gift, bundle) shows on the page and is applied, not hidden behind a code the shopper must remember.
   - Ads for different buyers or angles go to pages that lead with that one benefit [LPG-0064].
   - Curiosity-led ads go to a page that explains, not straight to the product page [MCR-0024]; but build an advertorial only after a plain product page has roughly broken even [LPG-0030].

4. **First screen on mobile.** On a product page: image thumbnails, rating above the title, price, add to cart and risk reducers in the first screen [LPG-0034]; free returns or guarantee in the line under the button [LPG-0038]; two kinds of proof above the fold [LPG-0036]. On a collection page: four products with prices in the first screen [LPG-0059], and the top six in stock in the bestselling sizes, checked daily for fashion [LPG-0069].

5. **Price and shipping clarity.** Shipping cost, delivery time and returns are visible before checkout. Keep extra costs added at checkout under 10% of order value [LPG-0063]. A specific delivery date beats a vague range when fulfilment is reliable [CXP-0010]. Set any free shipping threshold from the peaks of the store's order value spread, not the average [OFF-0013]. In cash on delivery markets, the COD fee and any prepaid saving show on the product page.

6. **Reviews.** Count reviews on the product. Going from zero to about 80 reviews roughly doubled conversion in one presenter's stores, and photo reviews that match the claim matter more than count after that [LPG-0062]. Reviews show name and source [LPG-0037], and 3 or 4 of them, picked to answer the main objections, sit next to add to cart [LPG-0005].

7. **Stock and variants.** Every advertised variant can be added to cart. Sold-out sizes are marked before the shopper taps. Catalog ad items match the page's price and stock, since a mismatch sends shoppers to a page that contradicts the ad.

8. **Mobile speed.** Run PageSpeed Insights on mobile for each URL. Use field data where it exists; it is a rolling 28-day sample, so recent fixes show there only weeks later [SPD-0005]. Google's "good" thresholds: Largest Contentful Paint 2.5 seconds or less, Interaction to Next Paint 200 ms or less, Cumulative Layout Shift 0.1 or less. Usual Shopify causes, in fix order: a lazy-loaded hero image [SPD-0006], heavy images [SPD-0002], too many apps [SPD-0001], and app bars injected after load that shift the page [SPD-0007].

9. **Checkout friction.** Walk to the payment step without paying. Check: express checkout (Shop Pay where available) is on [SET-0008]; a discount code box is hidden when no promotion runs [LPG-0058]; no forced account; the ad's offer is still applied; COD shows where offered. On Shopify, checkout cannot be split-tested with client-side tools [CRO-0016], so checkout changes are before-and-after reads.

10. **Pixel firing.** With the free Meta Pixel Helper extension, or Events Manager's Test events, load the page from the ad link and check: PageView, ViewContent with content IDs that match catalog item IDs, AddToCart with value, InitiateCheckout. Purchase must fire once per order with value and currency; confirm on the owner's next real order in Events Manager rather than a test order you place. If a consent banner is used, the Pixel must also fire after consent is given [MEA-0007]. The ad's click ID (fbclid) must survive any redirect.

11. **Rank fixes by gross profit at stake.** For each failed check: monthly paid visitors to that URL × revenue per visitor × expected lift × (GPP ÷ order value), minus build cost [CRO-0013]. Card lifts come from single agency tests, so use the low end of a card's range and halve it (practitioner default, test it). Decide how to prove each fix by monthly orders: under 30 orders, fix and track before and after; 30 to 300, one big-swing test; 300 or more, regular split tests [CRO-0011]. Changing the URL on a live ad counts as an edit and can restart learning; duplicate the ad with the new URL instead.

## Checks before you hand it over

1. Every page in the top 80% of spend was opened on a phone in the in-app browser, with screenshots.
2. Each check is pass or fail with a screenshot or number as evidence.
3. Any advertised variant that is out of stock is flagged first.
4. Speed numbers say field or lab, and the date.
5. Pixel events were seen firing, not assumed.
6. Every fix has gross profit at stake per month, a build cost and a proof method.
7. No fix is marked done; publishing waits for a yes.

## Output

1. **One-screen summary:** the page losing the most gross profit, the top 3 fixes with money at stake, any sold-out or broken-tracking issue, confidence.
2. **Page table:** URL, Page type, Spend share, Landing page view rate, Purchase rate, Revenue per visitor, Speed (LCP, INP, CLS, field or lab).
3. **Check table:** URL, Check (message match, first screen, price and shipping, reviews, stock, speed, checkout, Pixel), Pass or fail, Evidence, Fix.
4. **Fix list:** Rank, Fix, Page, Gross profit at stake per month, Build cost, Free or paid help, Proof method, Access level needed.
5. Files: `LANDING-CHECK.md` and a screenshots folder.

## Common mistakes

- **Testing on desktop Chrome.** Meta shoppers land in an in-app browser on a phone. Step 2 tests there.
- **Scoring pages instead of valuing fixes.** A weighted page score cannot pick between fixes. Step 11 ranks by gross profit.
- **Trusting big lifts from case studies.** Step 11 halves the low end.
- **Fixing speed on the wrong page.** Step 1 starts from spend.
- **Sending ads to sold-out sizes.** The stock gate and step 7 catch it.
- **Placing test orders on the live store.** Step 10 uses the next real order.
- **Swapping the URL on a winning ad.** Step 11 duplicates instead.

## Sources

CRO-0011: testing gate by monthly orders; CRO-0013: rank by expected gross profit; CRO-0016: Shopify checkout cannot be client-side tested; CXP-0010: specific delivery date; LPG-0005: objection reviews by add to cart; LPG-0030: advertorial only after a page proves out; LPG-0034: mobile product page first screen; LPG-0036: two proof types up top; LPG-0037: named, sourced reviews; LPG-0038: risk reducers under the button; LPG-0058: hide the empty code box; LPG-0059: four products first screen; LPG-0062: review count and photo reviews; LPG-0063: extra costs under 10%; LPG-0064: one page per angle; LPG-0069: top six in stock; MCR-0024: curiosity ads need an explaining page; MEA-0007: Pixel after consent; OFF-0013: threshold from order value peaks; SET-0008: Shop Pay on mobile; SPD-0001: app count; SPD-0002: speed fix order; SPD-0005: field data lags; SPD-0006: lazy-loaded hero; SPD-0007: app bars shift layout.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: it checks store pages (product and collection) for stock of the advertised variants, price and shipping clarity, reviews and checkout, instead of lead forms; it tests in the in-app browser where Meta shoppers land; it values each fix in gross profit per month from the store's own traffic and gross profit per purchase instead of a weighted score; and it drops the unsourced lift claims ("every second costs 7%", "+15 to 25% from moving the button").
