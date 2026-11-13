---
name: product-image-library-by-channel
description: "Build the store's reusable base product image library: plain, text-free product photos that meet each sales channel's image rules (store product pages, Google Merchant Center, Amazon, Meta catalogue, AI shopping feeds). Audits every product's current images against a base shot list and each channel's rules, ranks the gaps by gross profit per purchase, plans a few plain scene shots from a reference photo's lighting and camera recipe, fills them by phone shoot, freelancer brief or a careful generator path, runs a product fidelity check (label, shape, colour, count) against the real product, and saves each file with a clear name and an asset register. Use for stores with few or messy photos, before listing on a new channel, or after feed disapprovals. Read access only."
---

# Product image library by channel

**You get:** an audit of every product's base images against each channel's rules, a shot plan for the gaps, a fidelity log and an asset register CSV, so plain product photos are ready for every channel.

Most small stores have a handful of mixed photos and reuse whatever is to hand. This skill decides which base shots each product needs for each channel it sells on, finds the gaps, fills them the cheapest safe way, and stores the results so every later job starts from the same checked files. Base images carry no ad text; text goes on in later jobs.

## When to use

- The store has few product photos, or photos of mixed size, light and background.
- Before listing on a new channel (Google Shopping, Amazon, a marketplace, Meta catalogue ads).
- Merchant Center or a marketplace has disapproved or warned on images.
- Reviews or returns mention "not as pictured" or "smaller than expected".
- Before an ad or photo batch, so later jobs have clean source files.

## Not for

- Planning and making individual product shots for Meta ads, including when AI-made product images are safe: use `store-meta-product-photos`, which this skill hands shot-making to.
- Lifestyle and campaign photography in a chosen look: use `campaign-photo-set`.
- Ad images with text, price and logo: use `store-meta-ad-images`.
- Rebuilding one product page's gallery around buyers' doubts: use `pdp-image-gallery-rebuild`.

## What you need

**Required**

- Shopify products CSV export (Handle, Title, Variant SKU, Image Src, Image Position, Variant Image, Status) or the platform's equivalent, and the live product pages.
- The list of channels the store sells on or will sell on.
- The products table from `store-knowledge-folder` (gross profit per purchase, stock cover).
- At least one real photo of each product taken by the owner, as the truth reference, plus the physical product if a shoot is planned.

**Optional**

- Merchant Center diagnostics export (item issues), Amazon listing quality or suppressed listings report.
- Brand look notes or the visual identity sheet.
- Customer photo reviews with permission to reuse.

**When something is missing.** Ask once for the truth photos and channel list. Without truth photos, no new image can pass the fidelity check, so plan only a real shoot.

**Access.** Level 1, read. Uploading images to the store, Merchant Center or a marketplace needs draft or publish access and the owner's yes. Paying a freelancer or a tool needs the owner's yes and a budget cap.

## Before you start: the gates

1. **Gross profit per purchase decides the order.** Fill gaps for products in the Advertise list first, highest gross profit per purchase first. Fail (unknown): order by net sales and say so.
2. **Cash and capacity are stated.** Who shoots (owner, staff, freelancer), how many hours, and the most the owner will pay. Fail: plan a phone shoot of the top three products only.
3. **The real product is available.** The product, every variant to be listed, and its packaging must be in hand for a shoot, or truth photos must exist for any edited image. Fail for a product: leave its gaps open and list them.

## Steps

### 1. Set the base shot list

For each product, the base set answers the buyer's questions before they ask:

| Shot | Question it answers |
|---|---|
| Main, on plain white | What is it? |
| Second and third angle | What does the rest look like? |
| Scale (in hand or beside a common object) | How big is it? |
| Close-up of label, material or texture | What is it made of, what does the label say? |
| Contents (everything in the box) | What do I get? |
| In use, hands only | How does it work? |
| One per variant (colour or size) | Is the one I pick the one I get? |

Fashion adds on-body front, back and side with the model's size noted. Consumables add the back label with ingredients readable.

The clean main shot also earns its keep in ads: one product-on-white image with a bold text bar is a cheap way to test angles on small Meta budgets, when the benefit fits in a few words [MCR-0075].

### 2. Check each channel's rules on the day

Image rules change; open each channel's current help page and record the date. The usual rules at the time of writing:

- **Store product pages:** one square ratio across the catalogue looks tidiest; upload about 2,000 px wide and compress under 500 KB, ideally 100 to 200 KB, because Shopify only lightly compresses uploads [SPD-0008].
- **Google Merchant Center:** the main image must show the real product, with no promotional text, watermarks or borders. Price, title and main image drive most Shopping results [GAD-0019]; in one agency's tests, soft lifestyle backgrounds beat plain white on click rate in visually similar categories, so treat white versus lifestyle as a test, not a rule (practitioner default, test it).
- **Amazon (US and India):** the main image on a pure white background (RGB 255, 255, 255), the product filling about 85% of the frame, no text, badges or props not included in the sale; 1,000 px or more on the longest side turns on zoom. Secondary images may show use and scale.
- **Meta catalogue:** square images, product clear, no added text for catalogue ads (practitioner default, test it).
- **AI shopping feeds on Shopify:** products need a title, an image and a non-zero price to be eligible [AEO-0003].

### 3. Audit every product

One row per product and variant: which base shots exist, their size, background, weight, and whether each meets each channel's rule. Mark gaps. Add any item issues from Merchant Center or the marketplace. Add review or return comments about looks, size or colour, with counts; those point to the shots that matter most.

### 4. Choose how to fill each gap

In order of preference:

1. **Phone shoot (free):** a window with soft daylight, white foam board as background and bounce, a phone on a tripod or a stack of books, the grid on, the same distance and height for every product (tape marks on the table). Shoot each angle three times. For white backgrounds, cut out the product with any free background removal tool and check edges at 100% zoom.
2. **Freelancer brief:** give the shot list, channel rules, the truth photos, the ratio and weight targets, and the naming rule in step 6. Ask for the unedited originals too.
3. **Generator path, only for backgrounds or scenes:** the real product photo is cut out and composited onto a made background, so the product pixels are the real ones. Image generators redraw the product even when told to paste it, so if one is given the product photo as a reference, put the "match the attached product exactly" instruction first and last in the prompt, state the product's real size, ask for no text or logos, and treat the result as untrusted until step 5 passes. Whether AI imagery is safe for a given product (for example where colour or texture is what the buyer judges) is decided in `store-meta-product-photos`.

### 4b. Plan scene base shots from a reference photo

Stores with few assets also need a handful of plain scene shots (no text) that later ads and pages can build on. Pick a reference photo the owner likes, from any brand, and write down its recipe, not its content: camera height and angle, how close, lens feel (wide, normal, tight), light type, direction, softness and warmth, depth of field, surface and background, props (zero to two), palette, contrast, and how much of the frame the product fills. The reference sets the photography only; never copy its product, branding, text or set so closely that it reads as theirs.

Translate the recipe to this product: how it is really used (the use wins over the reference's subject), its real size against the surface or hand, the angle that shows it best, and one product per image. For textiles and home goods the fabric is the subject, props stay at two or fewer, and one flat overhead shot shows the full pattern repeat.

Make a small varied set so later jobs have range: one in use, one bright and clean, one darker and moodier, one tight texture close-up. The same recipe works as a phone shoot brief, a freelancer brief or a generator brief.

Use the gallery like a short landing page only on product pages and only for non-fashion goods: benefit, guarantee and review images after the base shots [LPG-0060]. Those are not base assets and never go to marketplaces or Merchant Center as the main image.

### 5. Run the fidelity check on every new file

Open the new image beside the truth photo at the same size. Check and record pass or fail for each:

- **Label:** every word and number readable and identical, logo correct.
- **Shape and proportion:** lay one over the other at 50% opacity; edges should match.
- **Colour:** sample the main product colour in both; a difference you can see by eye is a fail.
- **Count and parts:** same number of items, caps, straps, accessories.
- **Scale:** a scale shot uses a real object of known size.

Any fail means the file is not used, however good the rest looks; fidelity is a gate, not one score among several. If you are unsure, it fails. A tool that changed the product is not used for that product again.

### 6. Name, store and register

Name each file `sku_variant_shot_background_ratio_YYYYMMDD.jpg`, for example `TEE-01_navy_main_white_1x1_20261113.jpg`. Keep a full-size master and channel exports beside it. Record each in the asset register (step 7 of the output). Reuse customer photo reviews only with written permission; claim-matching photo reviews are strong proof on product pages [LPG-0062].

### 7. Plan the upload

List per channel what to upload or replace, in the order of step 1 of the gates. Staging and publishing wait for the owner's yes.

### India and similar markets

Marketplaces such as Amazon.in and Flipkart expect white main images and readable back labels; packaged goods also need the legally required label details visible in a secondary image (check the marketplace's current rule). Phone shoots in hard midday light give blown-out whites; shoot near a window in the morning or late afternoon.

## Checks before you hand it over

1. Every product in the Advertise list has a full base set or a listed reason why not.
2. Every main image meets each channel's rule, checked against that channel's page on a stated date.
3. Every new image passed the fidelity check, recorded per item.
4. No base asset carries ad text, price or badges.
5. File names follow the naming rule; the register matches the files.
6. File weights meet the store page targets.
7. Nothing was uploaded, and no money was spent, without the owner's yes.

## Output

1. **One-screen summary first:** products covered, gaps closed and open, the top five products by gross profit per purchase and their status, channel issues fixed, and the cost and hours used.
2. **Audit table:** product, variant, shot, exists (yes or no), channel compliance per channel, gap, fill method.
3. **Shot plan** (for a shoot, freelancer or generator): product, shot, recipe (camera, light, surface, props, palette, framing), real size, ratio, route, deadline.
4. **Fidelity log:** file, label, shape, colour, count, scale, pass or fail, checker, date.
5. **Asset register CSV:** file name, SKU, variant, shot, background, ratio, pixel size, KB, source (phone, freelancer, scene edit), fidelity pass date, channels approved, usage rights.
6. **Upload list** per channel, waiting for approval.

## Common mistakes

- **Shooting everything at once.** The gates order products by gross profit and stock.
- **One image for every channel.** Step 2 checks each channel's own rule.
- **Letting a tool redraw the product.** Step 4 composites the real product; step 5 rejects any change.
- **Copying a reference photo.** Step 4b takes its photography recipe only.
- **Ad text on base files.** Base assets stay clean so later jobs can reuse them.
- **Huge uploads.** Step 2 sets width and weight.
- **Files nobody can find.** Step 6 names and registers every file.

## Sources

- [SPD-0008]: Shopify image upload size and compression.
- [GAD-0019]: price, title and main image drive Shopping; lifestyle versus white is a test.
- [AEO-0003]: Shopify AI feed eligibility needs title, image and price.
- [LPG-0060]: the product gallery as a mini landing page, outside fashion.
- [LPG-0062]: claim-matching photo reviews matter more than counts.
- [MCR-0075]: a product-on-white image with a text bar smoke-tests angles.

Platform documentation: Google Merchant Center image requirements; Amazon product image requirements; Shopify product media guidance.

What makes this skill ours: it decides the base set per sales channel instead of one generic shoot; it fills gaps in order of gross profit per purchase; it never lets a tool redraw the product and logs a five-point fidelity check for every file; and it leaves a named, registered library that later jobs reuse.
