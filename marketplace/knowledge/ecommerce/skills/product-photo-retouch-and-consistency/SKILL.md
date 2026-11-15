---
name: product-photo-retouch-and-consistency
description: "Writes the store's retouch and export standard so every product image matches: one background value, one light direction, one crop rule (product size and position in frame), one colour-check method, allowed and banned retouch edits, and export sizes, formats and file weights for the site, Google, Meta and marketplaces. Includes an audit of current images against the standard, a batch fix list, and a template any editor or freelancer can follow. Use when collection grids look messy, product sizes jump between images, files are heavy, or a new editor is joining."
---

# Consistent product photo set

**You get:** a one-page retouch and export standard (background, light, crop, colour, allowed edits, export table), an audit sheet scoring every current product image against it, and a ranked fix list, ready for an editor or freelancer to apply in batches.

## When to use

- Collection pages look messy: products float at different sizes, backgrounds range from white to grey to cream.
- Images are heavy and slow the site.
- A new editor, freelancer or agency starts editing product photos.
- Images get disapproved on Google or a marketplace for overlays, borders or size.
- After a shoot, before the selects are edited.

## Not for

- Planning the shoot: use `art-direct-product-photoshoot` or `lifestyle-photos-without-a-studio`.
- Building the base image set per channel and filling missing shots: use `product-image-library-by-channel`.
- Site speed beyond images: use `image-and-video-speed-pass` and `shopify-speed-audit-and-fix-list`.
- Alt text: use `write-image-alt-text-at-scale`.

## What you need

Required:

1. **Shopify products export** (Handle, Title, Variant SKU, Image Src, Image Position, Variant Image) to list every image and where it is used.
2. **The image files** (or the CDN URLs from the export), plus originals or RAW files if they exist.
3. **The theme's image settings:** product card ratio (square, portrait or natural), gallery ratio, and whether the theme crops.
4. **Channels used:** Shopify site, Google Merchant Center, Meta catalog, Amazon or other marketplaces (Walmart, eBay, Etsy, Zalando).

Optional: brand colours (`store-visual-identity-sheet`), the physical products for colour checks, PageSpeed Insights report for the top product pages.

Read access is enough to audit and write the standard. Replacing images in Shopify needs draft access (level 2): replace on a duplicate theme or in a small batch, and the client approves before the live store changes.

## Before you start: the gates

1. **Fix order follows money.** Products ranked by gross profit per order times sales [MEA-0037]; fixes start at the top. Fail: rank first.
2. **Originals exist.** Retouching a compressed web JPG again loses quality. Pass: originals or at least full-size files. Fail: mark the product for a reshoot instead.
3. **Channel rules are known.** Google's main image: no promotional overlays, watermarks, borders or added logos; at least 500 x 500 from 31 January 2027; about 1500 x 1500 recommended; product fills 75 to 90% [GAD-6043]. Meta catalog: JPEG or PNG, at least 500 x 500, up to 8 MB, and a changed image needs a new URL [ADC-6047]. Marketplaces have their own rules; read them on the day.

## Steps

### 1. Pick the house style, once

Write one value for each, and do not vary it by product:

- **Background:** pure white (RGB 255, 255, 255) if Amazon, Walmart or other white-background marketplaces are used, otherwise one light neutral the brand chooses, with its exact RGB value.
- **Shadow:** none, soft contact shadow, or natural shadow. One choice.
- **Light direction:** for example, key from the left at 45 degrees. Products shot with light from the other side are flagged for reshoot, not flipped (flipping mirrors labels).
- **Canvas ratio:** match the theme's product card. If the card is square, every main image is square; if 4:5, every main image is 4:5.
- **Product size in frame:** the product's longest side fills a fixed share of the canvas, for example 80% (inside Google's 75 to 90% range [GAD-6043]). Small and large products both fill 80%; scale is shown in other gallery images, not by shrinking the main one.
- **Position:** centred, with the base on the same line for products that stand (for example 10% above the bottom edge), so a collection row lines up.
- **Angle:** front, or three-quarter front at a fixed angle, the same per category.

On mobile, collections often show two products per row in the first screen [LPG-0059], so these rules decide whether a grid looks like one store.

### 2. Set the colour check

Use a grey card or colour checker in the first frame of each setup. In editing, set white balance from it. Then compare the result on a calibrated or at least brightness-matched screen with the real product beside it, in daylight. Write the variant colour as the buyer would name it; if the image and product disagree, the image is wrong.

### 3. Allowed and banned edits

| Allowed | Banned |
|---|---|
| Dust, lint, scratches on the sample, fingerprints | Changing the product's shape, size or proportions |
| Background clean-up and replacement to the house value | Changing colour away from the real product |
| Exposure and white balance to match the reference | Removing real features (seams, texture, a visible join) |
| Straightening and perspective correction | Adding badges, text, logos, borders or prices to the main image [GAD-6043] |
| Removing stray threads, label wrinkles from shipping | Generating a new product from a photo of a different variant |
| Compositing variants only if each is photographed | AI upscaling that invents label text |

If an AI tool is used for background removal or clean-up, check the label letter by letter and the edges at full size afterwards. Any product accuracy problem goes to `keep-product-accurate-in-ai-media`.

### 4. Export table

| Use | Size | Format | Weight |
|---|---|---|---|
| Master archive | full size | TIFF or max-quality JPG | no limit |
| Shopify product image | about 2,000 px long side | JPG (or PNG only for transparency) | under 500 KB, ideally 100 to 200 KB [SPD-0008] |
| Product images on page | served by theme | WebP or AVIF where the theme supports it | product images under 100 KB [SPD-0002] |
| Google Merchant Center | at least 1500 x 1500 recommended | JPG or WebP | under 16 MB [GAD-6043] |
| Meta catalog | at least 1080 x 1080 (500 x 500 minimum) | JPG or PNG | under 8 MB [ADC-6047] |

Shopify serves resized versions, but only compresses lightly, so compress before upload [SPD-0008]. Resizing to about twice the displayed size and exporting AVIF at moderate quality can cut weight sharply [SPD-0013]; test it on a few products and check by eye.

### 5. Audit the current set

For each product image, score pass or fail on: background value, shadow style, canvas ratio, product size in frame (within 5 points of the target), position, angle, colour match, overlays or borders, file weight, pixel size. Use an image editor's info panel or a free batch tool to read size and weight; eyeball the rest at full size against a reference image placed beside it.

### 6. Rank and batch the fixes

- **Batch A:** top-ranked products with a channel rule failure (overlay, border, too small): fix first, because they can be disapproved.
- **Batch B:** top-ranked products off-style (size, background, angle).
- **Batch C:** heavy files across the store: a pure export fix.
- **Batch D:** products needing a reshoot.

When replacing an image in Shopify, the image URL changes; check the feed apps pick it up, because Meta ignores a changed image at the same URL [ADC-6047].

### Marketplace and market notes

- **Marketplaces:** Walmart, eBay, Etsy, Zalando and other marketplaces each set main image rules (background, size, no text); keep a marketplace export per their rules from the same master. Colour accuracy matters most for apparel and textiles, where buyers judge colour from the photo alone; check the store's own return reasons for "colour different" and shoot fabric in daylight.
- **Amazon (every country):** the main image needs a pure white background and the product filling most of the frame; keep an Amazon export if the store sells there.

## Checks before you hand it over

- The standard has one written value for background, shadow, light, ratio, product size, position and angle.
- The allowed and banned edits table is in the standard.
- No main image carries text, badges, borders or added logos.
- Every exported web image is under 500 KB and the top products' images under 200 KB.
- Colour of the top 10 products was checked against the real product in daylight.
- The audit covers every product image, not a sample, and the fix list is ranked by gross profit.
- Replacement images will carry new URLs so Meta and Google pick them up.

## Output

**One-screen summary:** the house style in seven lines, how many images pass, the top fixes, time estimate per batch, and approvals needed.

**Retouch and export standard (template):** Background (RGB); Shadow; Light direction; Canvas ratio; Product fill (%); Base line or centre position; Angle by category; Colour check method; Allowed edits; Banned edits; Export table; File naming rule `<sku>_<slot>_<ratio>_v<#>.jpg`.

**Audit sheet:**

| Product | SKU | Image position | Background | Shadow | Ratio | Fill % | Position | Angle | Colour match | Overlay or border | KB | Pixels | Pass | Batch |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Fix list:** batch, products, edit needed, owner, due date, approved by.

## Common mistakes

- **Rules that vary by editor.** Step 1 writes one value each and the standard travels with the files.
- **Shrinking big products and enlarging small ones by eye.** Step 1 sets one fill percentage.
- **Flipping images to match light.** Step 1 flags them for reshoot; flipping mirrors labels.
- **"Correcting" colour to look nicer.** Step 2 matches the real product.
- **Uploading 6 MB files.** Step 4 compresses before upload [SPD-0008].
- **Same URL after replacing.** Step 6 checks feeds pick up new URLs [ADC-6047].

## Sources

- GAD-6043: Google main image rules, sizes, 75 to 90% fill.
- ADC-6047: Meta catalog image rules; changed image needs a new URL.
- SPD-0002: product images under 100 KB, hero under 200 KB.
- SPD-0008: Shopify compresses lightly; upload about 2,000 px under 500 KB.
- SPD-0013: resize to twice display size and export AVIF.
- LPG-0059: mobile collections show four products in the first screen.
- MEA-0037: gross margin is the delivered cost to the door.

What makes this skill ours: one fill percentage and one base line make every collection row line up; edits are split into allowed and banned so no editor "improves" the product; fixes are ordered by gross profit and channel risk; and image replacements carry new URLs so Meta and Google actually pick them up.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Amazon.in, Flipkart and Myntra each set main image rules (white background, size, no text); keep an export for each from the same master. Colour accuracy matters most for sarees and ethnic wear; check return reasons for "colour different".
