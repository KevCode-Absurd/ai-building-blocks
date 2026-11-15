---
name: design-catalog-ad-overlays
description: "Designs frame templates and overlay rules for catalog (dynamic product) ads so every product the feed shows gets a true price, badge and rating: 2 to 3 frame designs, a rule table that says which product sets may carry which badge, the feed fields each overlay reads, and a product-by-product audit that catches stale sale prices, borrowed ratings and badges that are false for some items. Keeps the Google Shopping image clean while Meta gets the frame. Use before launching or refreshing Meta catalog ads, before a sale, or when catalog ads show a sale price after the sale ended."
---

# Catalog ad frames and overlays

**You get:** 2 to 3 frame templates (transparent PNG layouts with zones marked), a badge and overlay rule table tied to feed fields and product sets, and a filled audit sheet listing every product in the catalog with the badges it may show, ready for the media buyer to switch on.

## When to use

- The store is about to launch or refresh Meta catalog ads (Advantage+ catalog ads) and the images are plain product shots.
- A sale is coming and the catalog ads should show the sale price only while it is true.
- Catalog ads showed a sale price, "free shipping" or a rating that was wrong for some products.
- The store wants catalog ads to look like its brand without breaking the Google feed.

## Not for

- Setting up the catalog, pixel and campaign: use `set-up-meta-catalog-sales-ads`.
- Writing the primary text for catalog ads: use `write-catalog-ad-primary-text`.
- Fixing Google Merchant Center image or price disapprovals: use `fix-merchant-center-disapprovals`.
- Making the base product photos: use `product-image-library-by-channel`.

## What you need

Required:

1. **Catalog export** from Commerce Manager, or the Shopify product feed the channel sends: id, title, price, sale_price, sale_price_effective_date, availability, image_link, additional_image_link, product_type, custom_label_0 to 4, shipping.
2. **Shopify products export** with compare-at prices, plus the store's discount settings for any running sale.
3. **Reviews export** per product (review app CSV: product id or handle, rating, count, date).
4. **Gross profit per product** from `build-sku-profit-sheet` or `store-meta-math`, and **units sold last 30 days** per product from the Shopify sales by product report.
5. **Shipping rules:** which products and order values ship free, by country.

Optional: brand fonts and colours (`store-visual-identity-sheet`), current catalog ad results by product set.

Read access to Commerce Manager and Shopify is enough to design and audit. Changing feed fields, product sets or ad creative needs draft access (level 2) and the client's yes.

## Before you start: the gates

1. **Gross profit per product is known.** Catalog ads push whatever the set contains; products that lose money per order after delivered costs must be excluded from prospecting sets before any frame is designed [MEA-0037].
2. **Catalog spend is in proportion.** Catalog ads mostly reach people who were going to buy and their reported return is inflated by existing customers [ADC-0010]. Cap their share of spend [ADC-0026]. If catalog ads already take most of the budget, flag it to the media buyer; nicer frames do not fix that.
3. **Feed prices match the site.** A sample of 20 products checked against the live pages. A price mismatch is a top cause of Google disapprovals and makes any price overlay false [GAD-0005]. Fail: fix the feed sync first.
4. **Sale dates are set.** Every product with a sale_price has a sale_price_effective_date. Without it the item stays on sale until someone removes the sale price [ADC-6047]. Fail: add dates before any strikethrough overlay goes live.

## Steps

### 1. Keep the base image clean

The feed image is shared. Google bans price, shipping, promotional words, borders and added logos on the main product image [GAD-6043], so frames and badges never get baked into image_link. Put brand frames on the Meta ad layer only (Meta's catalog frame option or the catalog creative options in Ads Manager), or, if a paid feed tool is used, write framed images to a separate Meta-only feed. Free path: Meta's own frame upload and dynamic overlays in Ads Manager. Paid feed-design tools are optional, not required.

If a framed image is ever supplied through the feed, it needs its own new URL, or Meta will not pick up the change [ADC-6047].

### 2. Choose the overlay types

Work through these, in this order, and keep only what is true for every product in the set it runs on:

| Overlay | Reads from | Allowed when |
|---|---|---|
| Price | price | always, if the feed matches the site |
| Strikethrough and percent off | price and sale_price | sale_price is below price and inside its effective dates; the "was" price is one the store genuinely charged |
| Free shipping | shipping field or set rule | every product in the set ships free to the targeted country at its own price, without a threshold |
| Rating | a custom label written from the review app | the product has its own rating from at least 10 reviews in the last 12 months (practitioner default, test it); never the store's average |
| Bestseller | custom label | top 10% of products by units sold in the last 30 days, refreshed weekly |
| New | custom label | first published in the last 30 days |
| Low stock | never | stock counts change faster than ads refresh; skip it |

Percent off is computed by Meta from the two price fields in current Ads Manager; do not type a percent into a frame.

### 3. Map overlays to product sets

Build product sets by rule (custom labels), not by hand, so a product leaves a set the moment the rule is false:

- `set_onsale`: sale_price present and dates current. Gets strikethrough.
- `set_rated`: custom_label_1 = rated. Gets the rating overlay.
- `set_freeship`: products that ship free at their own price. Gets "Free shipping".
- `set_profit_ok`: gross profit per order above the store's floor. Only this set runs in prospecting.
- `set_exclude`: out of stock, negative gross profit, or restricted products.

Each ad gets one frame and only the overlays its set permits.

### 4. Design the frames

Make 2 to 3 templates, each as a 1080 x 1080 transparent PNG (and a 4:5 version where the placement is used), with zones marked:

- **Product zone:** at least 70% of the frame, centred, untouched. The frame must not cover any part of the product in any product's image; test with the widest and the tallest product.
- **Brand strip:** logo or brand name in one corner, small.
- **Badge zone:** one corner reserved for one badge at a time. Two badges compete; pick the stronger one by the rule order above.
- **Price zone:** where Meta places the price overlay; keep it clear of the brand strip.

Template ideas: a thin brand-colour border with logo; a solid bottom bar with the brand line; a corner tab for "New" or "Bestseller". Keep words on the frame to a brand line that is true for every product, such as the store name. Never "Free returns" unless the policy page says so for all products.

### 5. Ratings: the strict rule

A rating overlay shows only that product's own reviews. It never borrows a parent product's rating for a variant with different materials, never shows a store-wide average on a product, and never rounds 4.4 up to 4.5. Reviews must be real buyer reviews; fake or AI-made reviews, and hiding negative ones, are banned in the US [MCR-6045] and under UK and EU consumer law. Under about 80 reviews, count still moves conversion; beyond that it barely matters, so do not pad counts [LPG-0062].

### 6. Audit every product

Run the audit sheet over the whole catalog, not a sample. For each product, mark each overlay allowed or not, with the field value that decides it. Then preview at least 10 products in Ads Manager: the widest, tallest, darkest, lightest, a sale item, a non-sale item, a rated and an unrated item. Screenshot each.

### 7. Set the refresh rhythm

- Feed refresh at least daily; more often during sales.
- Custom labels for bestseller and rating recomputed weekly.
- After a sale ends, remove sale_price the same day even if dates are set [ADC-6047].

### Notes by market

- **Tax and fees:** in the UK, EU and Australia the feed price must include VAT or local tax; in the US and Canada, sales tax is added at checkout, which is normal. A "Free delivery" frame is false if any payment method or area carries a delivery fee; say "Free delivery over [amount]" or name the real rule.
- **Was prices:** a strikethrough price must be a price the store really charged before; check Shopify compare-at history. In the EU it must be the lowest price of the last 30 days.

## Checks before you hand it over

- No frame, badge or price is baked into the Google feed image [GAD-6043].
- Every product with a sale_price has current effective dates [ADC-6047].
- Each badge's rule is written, tied to a feed field or label, and true for every product in its set.
- Rating overlays use the product's own reviews only, with the count shown.
- The frame never covers the product on the widest and tallest images.
- Products with negative gross profit per order are excluded from prospecting sets.
- Ten preview screenshots are attached.
- No feed, set or ad change went live without the client's yes.

## Output

**One-screen summary:** frames delivered, overlays used and their rules, products in each set, products excluded and why, the stale prices or false badges found, and changes waiting for approval.

**Overlay rule table:**

| Overlay | Feed field or label | Rule (true when) | Product set | Refresh |
|---|---|---|---|---|

**Product audit sheet:**

| Product id | Title | Price feed | Price site (date) | Sale price and dates | Gross profit per order | Reviews (count, avg) | Free ship at own price | Bestseller | Allowed overlays | Set | Issue |
|---|---|---|---|---|---|---|---|---|---|---|---|

**Frame files:** `frame_A_1x1.png`, `frame_A_4x5.png`, and the same for B and C, with a zone diagram for each.

**Change list for approval:** numbered feed, label and set changes.

## Common mistakes

- **Baking "SALE" into the feed image.** Google disapproves it [GAD-6043] and Meta keeps showing it after the sale. Step 1 keeps the base image clean.
- **No sale end date.** The strikethrough outlives the sale [ADC-6047]. Gate 4 and step 7 catch it.
- **"Free shipping" on a set with a threshold.** Step 2 allows it only when each product ships free at its own price.
- **Borrowed ratings.** Step 5 shows only the product's own reviews.
- **Pretty frames on a money-losing set.** Gate 1 and step 3 keep loss-making products out of prospecting.
- **Judging catalog ads by their reported return.** It is inflated by existing customers [ADC-0010]; hand the reading to `store-meta-attribution`.

## Sources

- ADC-6047: Meta sale_price and effective date rules; image size; new URL on change.
- GAD-6043: no overlays, borders or added logos on Google's main product image.
- GAD-0005: feed and page price mismatch causes disapprovals.
- ADC-0010: catalog ad return is inflated by existing customers.
- ADC-0026: cap catalog ad share of spend.
- MEA-0037: gross margin is the delivered cost to the door.
- MCR-6045: fake, AI-made or suppressed reviews are banned in the US.
- LPG-0062: review count matters up to about 80.

What makes this skill ours: every badge is a written rule tied to a feed field, so it switches off by itself when it stops being true; the Google image stays clean while Meta gets the frame; sale prices cannot outlive the sale because dates are a gate; and loss-making products are kept out of prospecting before any design work starts.

## Selling in India

- The feed price must be the GST-inclusive selling price, and for packaged goods it must not exceed the MRP printed on the pack.
- A "Free delivery" frame is false if COD carries a fee; say "Free prepaid delivery" only if that is the real rule.
