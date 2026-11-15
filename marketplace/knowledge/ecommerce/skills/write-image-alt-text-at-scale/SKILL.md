---
name: write-image-alt-text-at-scale
description: "Alt text for every product image in a store's catalogue, written in bulk and checked: each image sorted by type (main shot, angle, close-up, in use, size and scale, packaging, chart or infographic, swatch), a short pattern per type built from the product's real attributes, drafts written by looking at the actual image, a review sample that catches wrong colours, counts and claims, and an import-ready Shopify CSV with the Image Alt Text column filled. Useful to screen-reader users first, accurate for search and AI, never a keyword list. Use when product images have empty or file-name alt text, after a big catalogue upload, before a translated market launches, or when an accessibility check fails."
---

# Image alt text for the whole catalog

**You get:** an import-ready Shopify product CSV with alt text for every product image, a pattern sheet per image type, a review log with error rate and fixes, and a one-screen summary, ready for the client to approve and import.

## When to use

- Most product images have empty alt text, or alt text that is just the product title or a file name.
- A large batch of products was uploaded from a supplier.
- The store is launching a translated market and images need alt text in that language.
- An accessibility audit or complaint flagged missing image descriptions.

## Not for

- Compressing and sizing images: use `image-and-video-speed-pass`.
- Checking AI-made images look like the real product: use `keep-product-accurate-in-ai-media`.
- Product descriptions: use `write-product-descriptions-in-bulk`.
- Banner and theme section images: this skill covers product media; list theme images separately for the theme owner.

## What you need

Required (read access, level 1):

1. **Shopify product export (CSV)**, all products: Handle, Title, Type, Vendor, Tags, Option1 to Option3 names and values, Variant SKU, Image Src, Image Position, Image Alt Text, Variant Image.
2. **Product facts**: material, colour names as sold, size, what is in the box, from the product page or `product-claims-profile`.
3. **Access to the image files** through their Image Src URLs (public).

Optional: the store's keyword map (to use buyer words for product types), brand voice notes, list of images that carry text (charts, size guides).

Importing the CSV changes live product data: draft access (level 2) to prepare it, and the client imports (or approves the import) after a test on a few products.

## Before you start: the gates

1. **Export is complete.** Pass when the image count in the CSV matches the admin and every Image Src opens. Fail: re-export; a partial import can blank existing alt text.
2. **Back-up.** Keep the original export unchanged as the rollback file.
3. **Facts available.** Each product needs colour and material from product data. Fail: flag the product; never guess a colour or material from a photo alone.
4. **Claims.** Alt text describes what is visible. It never adds benefits, certifications or results the product page cannot back.

## Steps

### 1. Sort images by type

Look at each image and tag it:

| Type | What it shows |
|---|---|
| Main | Product alone, usually on plain background (position 1) |
| Angle | Back, side, top, inside |
| Close-up | Fabric, stitching, texture, label |
| In use | Person or setting using the product |
| Scale | Product beside a hand, object or person for size |
| Packaging | Box, what is in the box |
| Chart | Size chart, ingredient list, comparison, infographic with text |
| Swatch | Colour or pattern sample |

### 2. Write one pattern per type

Keep it short and specific; Google asks for useful, information-rich alt text that fits the page and warns against keyword stuffing [SEO-6463]. Patterns (fill from data, then from what the image shows):

- **Main:** "[Colour] [product type] in [material], front view" ("Olive linen shirt, front view").
- **Angle:** "[Product] seen from the [back or side], showing [feature]".
- **Close-up:** "Close-up of [part] on the [product], showing [detail]".
- **In use:** "[Person or setting] [doing what] with the [product]" ("Woman carrying the tan leather tote over one shoulder"). Describe people neutrally; no guesses about age, body or ethnicity unless the store's own product data states the model's size.
- **Scale:** "[Product] next to [object] to show its size".
- **Packaging:** "[Product] box with [items] laid out".
- **Chart:** put the key information in words, or say where the full text sits ("Size chart for the linen shirt; measurements are in the size table below"). Charts must also exist as real text on the page.
- **Swatch:** "[Colour name as sold] swatch".

Rules for all: practitioner default of under 125 characters; no "image of" or "picture of"; no keyword lists; colour names as sold in the variant; the product type in buyer words from the keyword map once, not repeated.

### 3. Draft from the image, not just the data

Use a vision-capable model (any assistant that can read images) or a person. Give it the image and the product's facts; ask for one line following the pattern for that type. A text-only model writing from titles alone produces the same line for every image, which helps nobody. Variant images must name their own colour: an image linked to the "Navy" variant says navy.

### 4. Review a sample

- Check 100% of main images (they show in feeds, search and AI answers).
- Check a random 10% of the rest (practitioner default), plus every chart and in-use image.
- Errors to count: wrong colour or variant, wrong count of items, invented detail, claim, person described in a way the store would not say, repeated identical alt text across different images.
- If the sample error rate is over 2% (practitioner default, test it), fix the pattern or the prompt and redraft that type, then sample again.

### 5. Catch image problems on the way

While viewing images, flag (do not fix here): main images with text, badges or watermarks, which Merchant Center does not allow on the main product image [GAD-6043]; images far above Shopify's display needs or the 20 MB limit [SPD-6184]; non-square main images where the theme expects square (Shopify suggests 2048 x 2048 for square product images [SPD-6185]); heavy files that slow pages [SPD-0002]. Pass the list to `image-and-video-speed-pass` or `pdp-image-gallery-rebuild`.

### 6. File names for new uploads

File names give Google only light clues [SEO-6463], and renaming existing Shopify files means re-uploading them. Do not re-upload the catalogue for names. Set a rule for new uploads: short, descriptive, hyphenated ("olive-linen-shirt-front.jpg").

### 7. Translations

- **Base language:** alt text is written first in the store's main language. For each other language your buyers use, translate alt text with the page using Shopify's translation tools, and have a native speaker review a sample; colour names must match the translated variant names.
- **Every language market:** translate for each one; never leave English alt text on a Spanish, French or German page.

### 8. Import and confirm

Fill the Image Alt Text column, keeping every other column unchanged. Import a test of 5 products first; check the product pages and the admin. Then import the full file with the client's yes. Spot-check 20 product pages afterwards with a screen reader or the browser's accessibility view.

## Checks before you hand it over

- Every product image row has alt text, except images marked decorative by the theme.
- No two different images of one product share identical alt text.
- Every variant image names the right colour or option.
- No alt text contains claims, prices, offers or keyword lists.
- Main images reviewed 100%; sample error rate at or under the threshold.
- Charts have their information in page text, not only in the image.
- The rollback export is saved; test import passed before the full import.
- Nothing imported without the client's yes.

## Output

1. **One-screen summary:** images covered, images by type, error rate found and fixed, images flagged for other fixes, import date.
2. **Import file** (`products-alt-text.csv`): the full Shopify export with Image Alt Text filled.
3. **Pattern sheet:** Image type, pattern, two filled examples from this store.
4. **Review log:**

| Handle | Image position | Type | Draft alt text | Error found | Fixed alt text | Reviewer |
|---|---|---|---|---|---|---|

5. **Flag list:** Handle, image position, issue (text on main image, size, ratio), hand-off skill.

## Common mistakes

- **Product title as alt text on every image.** Step 3 drafts from each image.
- **Keyword stuffing.** Step 2 bans lists and repeats.
- **Wrong variant colour.** Step 3 ties variant images to their option.
- **Guessing facts from photos.** Gate 3 uses product data.
- **Partial import wiping alt text.** Gates 1 and 2 and the test import prevent it.
- **Charts as images only.** Step 2 puts the content in page text.

## Sources

- GAD-6043: Merchant Center bans overlays and logos on main product images.
- SEO-6463: Google wants specific alt text, warns against stuffing, file names are light clues.
- SPD-0002: image weight targets for speed.
- SPD-6184: Shopify image limits and automatic formats.
- SPD-6185: Shopify's square product image size.

What makes this skill ours: each image is drafted from what it actually shows, sorted by type, with variant colours tied to the store's own option names; a measured review sample with a stop rule catches errors before import; and image problems that block Shopping or slow pages are flagged on the same pass.
